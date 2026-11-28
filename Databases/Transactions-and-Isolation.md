# Transactions and Isolation Levels — Explained for Beginners

> **What you'll learn:** how the **ACID properties apply to transactions**, what goes wrong when transactions run at the same time (the **anomalies**: dirty reads, non-repeatable reads, phantoms, lost updates, write skew), and the four standard **isolation levels** — **Read Uncommitted, Read Committed, Repeatable Read, Serializable** — plus a C++ MVCC simulator that reproduces every anomaly at every level.
>
> **Prerequisites:** [ACID](./ACID.md), [COMMIT/ROLLBACK](./SQL-DDL-DCL-TCL.md#6-commit-statement).

## Table of Contents
1. [ACID properties in transactions](#1-acid-properties-in-transactions)
2. [Concurrency anomalies (what can go wrong)](#2-concurrency-anomalies-what-can-go-wrong)
3. [Isolation levels](#3-isolation-levels)
   - [Read Uncommitted](#31-read-uncommitted) · [Read Committed](#32-read-committed) · [Repeatable Read](#33-repeatable-read) · [Serializable](#34-serializable)
4. [How databases implement isolation: locks vs. MVCC](#4-how-databases-implement-isolation-locks-vs-mvcc)
5. [Cheat sheet](#cheat-sheet)

---

## 1. ACID properties in transactions

**In one sentence:** a transaction is a unit of work that the database runs with the **ACID** guarantees — all-or-nothing (Atomicity), rule-preserving (Consistency), not disturbed by others (Isolation) and permanent once committed (Durability).

### In plain words
A transaction is a promise from the database: "treat these steps as **one thing** — do them all or none, don't break any rules, don't let other people's half-finished work leak in, and once I say *done*, it's saved forever."

### How it works
```sql
BEGIN;                                                     -- start the unit of work
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- A: both updates, or neither
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- C: CHECK (balance >= 0) enforced
COMMIT;                                                    -- D: durable once this returns
                                                           -- I: others never see the "in-between" state
```
| Property | In a transaction it means | Implemented with |
|---|---|---|
| Atomicity | ROLLBACK/crash undoes every change of the transaction | Undo log / old row versions |
| Consistency | Commit only if all constraints hold | Constraints, triggers, app logic |
| Isolation | Concurrent transactions behave (almost) as if run one by one | Locks, MVCC snapshots — **tunable by isolation level** |
| Durability | Committed changes survive crashes | Write-ahead log + fsync, replication |

Each property is explained with its own C++ demo in [ACID](./ACID.md). **Isolation is the one you can tune**, and that's what the rest of this page is about.

---

## 2. Concurrency anomalies (what can go wrong)

**In one sentence:** when transactions overlap, they can see each other's data at the wrong moment, producing results that could never happen if they ran one after another.

### In plain words
Two people editing the same shared shopping list at the same time: one might read an item the other is about to erase, see the list change between two glances, see new items appear, or both remove "the last carton of milk" thinking the other one still has one.

### How it works
| Anomaly | What happens | Example |
|---|---|---|
| **Dirty read** | T2 reads data T1 wrote but **hasn't committed** — T1 then rolls back, so T2 used data that never existed | T2 sees balance 0 from T1's aborted withdrawal |
| **Non-repeatable read** | T2 reads a row twice and gets **different values**, because T1 committed an update in between | Balance 100, then 50, in the same report |
| **Phantom read** | T2 runs the same **query** twice and gets a **different set of rows**, because T1 inserted/deleted matching rows | `COUNT(*) FROM orders` is 2, then 3 |
| **Lost update** | T1 and T2 both read, then both write based on what they read; one write overwrites the other | Two clerks sell the last ticket (see [ACID → Isolation](./ACID.md#3-isolation)) |
| **Write skew** | T1 and T2 read overlapping data, then update **different** rows; each is valid alone, together they break a rule | Two on-call doctors both go off call because each saw the other on call |

---

## 3. Isolation levels

**In one sentence:** an isolation level is a setting that chooses how much protection a transaction gets from concurrent ones — stronger levels prevent more anomalies but reduce concurrency.

### In plain words
It's like the privacy setting on a shared document. The lowest setting shows others' typing live (even text they're about to delete); higher settings show only saved versions, or freeze your view of the document when you open it, or make everybody take turns.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;     -- per transaction (standard SQL)
BEGIN ISOLATION LEVEL SERIALIZABLE;                  -- PostgreSQL shorthand
```
The SQL standard defines the levels by which anomalies they must prevent:
| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read Uncommitted | possible | possible | possible |
| Read Committed | prevented | possible | possible |
| Repeatable Read | prevented | prevented | possible *(standard)* — prevented in PostgreSQL & InnoDB snapshots |
| Serializable | prevented | prevented | prevented (and write skew too) |

Defaults: **PostgreSQL, Oracle, SQL Server → Read Committed**; **MySQL InnoDB → Repeatable Read**.

### 3.1 Read Uncommitted
**In one sentence:** transactions may read other transactions' **uncommitted** changes.

- In plain words: reading someone's draft over their shoulder while they're still typing — they might delete it a second later.
- Allows **dirty reads** and everything below. Almost never used for correctness-sensitive work; sometimes used for rough monitoring queries (SQL Server `WITH (NOLOCK)`). PostgreSQL silently treats it as Read Committed.
- Read rule, in C++ terms:
```c++
if (other_tx_has_uncommitted_write(key)) return dirty_value(key);   // may be rolled back later!
return latest_committed(key);
```

### 3.2 Read Committed
**In one sentence:** every statement sees only data **committed before that statement started**.

- In plain words: you only ever read *saved* versions — but if you look twice, someone may have saved a new version in between.
- Prevents dirty reads; allows **non-repeatable reads**, **phantoms**, lost updates (without `SELECT ... FOR UPDATE`) and write skew.
- The default in PostgreSQL/Oracle/SQL Server: good balance for most OLTP work, as long as you use row locks (`SELECT ... FOR UPDATE`) or atomic updates (`UPDATE ... SET x = x - 1`) for read-modify-write.
```c++
return latest_committed(key);          // a fresh snapshot for EACH statement
```

### 3.3 Repeatable Read
**In one sentence:** the transaction sees a **consistent snapshot** taken at its start (or first read); rows it read won't change under it.

- In plain words: when you open the document you get a **frozen photo**; your view doesn't change until you finish, even if others save changes.
- Prevents dirty and non-repeatable reads. The standard still allows phantoms, but snapshot-based implementations (PostgreSQL, MySQL InnoDB for plain reads) prevent them too. Conflicting concurrent **writes** to the same row: one of them waits/fails ("could not serialize access due to concurrent update" in PostgreSQL) — no lost updates.
- Still allows **write skew** (both transactions read the photo, both change *different* rows).
```c++
return committed_as_of(key, my_start_timestamp);   // the snapshot never moves
```

### 3.4 Serializable
**In one sentence:** the strongest level — the result is guaranteed to be the same as if the transactions had run **one at a time in some order**.

- In plain words: everyone takes turns — or at least the database checks that the final outcome *could* have come from taking turns, and cancels one transaction if not.
- Prevents **all** the anomalies above, including write skew.
- Implementations: **strict two-phase locking** (hold read/write + range locks until commit — MySQL, SQL Server) or **Serializable Snapshot Isolation (SSI)** (PostgreSQL: run on snapshots, track read/write dependencies, abort a transaction if a dangerous pattern appears).
- Cost: more blocking or more aborts → **your application must retry** transactions that fail with a serialization error.
```c++
// snapshot reads + at COMMIT:
if (anything_i_read_was_changed_by_a_tx_that_committed_after_i_started()) abort_and_retry();
```

---

## 4. How databases implement isolation: locks vs. MVCC

| | Two-phase locking (2PL) | MVCC (multi-version concurrency control) |
|---|---|---|
| Idea | Take shared (read) / exclusive (write) locks; release only at commit | Keep old row versions; readers see a snapshot, writers create new versions |
| Readers block writers? | Yes | **No** — "readers don't block writers, writers don't block readers" |
| Anomaly prevention | Locks + range/predicate locks for phantoms | Snapshots; conflict checks at commit (first-committer-wins, SSI) |
| Downsides | Blocking, deadlocks | Old versions must be cleaned up (PostgreSQL VACUUM, InnoDB purge), aborts under contention |
| Used by | SQL Server (default), MySQL for locking reads, DB2 | PostgreSQL, Oracle, MySQL InnoDB, SQL Server snapshot isolation |

Practical advice:
- Stay on the default (usually Read Committed) and protect read-modify-write with `SELECT ... FOR UPDATE`, atomic `UPDATE ... SET x = x + 1`, or optimistic version columns (`UPDATE ... WHERE version = ?`).
- Use **Serializable** for complex invariants spanning multiple rows (bookings, balances across accounts) — and **retry** on serialization failures.
- Keep transactions **short**: no user input or network calls inside them.

---

## Cheat sheet

| Level | Sees | Prevents | Still allows |
|---|---|---|---|
| Read Uncommitted | Uncommitted data | — | Dirty, non-repeatable, phantom, write skew |
| Read Committed | Latest committed per statement | Dirty reads | Non-repeatable, phantom, lost update*, write skew |
| Repeatable Read | Snapshot at transaction start | Dirty, non-repeatable (+ phantoms in PG/InnoDB) | Write skew |
| Serializable | Equivalent to a serial order | Everything | — (but expect aborts → retry) |

\*Unless you use `SELECT ... FOR UPDATE` or atomic updates.
