# ACID Properties — Atomicity, Consistency, Isolation, Durability

> **What you'll learn:** what a transaction is and the four guarantees — **A**tomicity, **C**onsistency, **I**solation, **D**urability — that make databases trustworthy, how databases implement each (undo logs, constraints, locks/MVCC, write-ahead logging).
>
> **Prerequisites:** [Explicit vs. implicit transactions](./SQL-DML.md#8-explicit-vs-implicit-transactions). Isolation levels in depth: [Transactions and Isolation Levels](./Transactions-and-Isolation.md).

## Table of Contents
0. [What is a transaction?](#0-what-is-a-transaction)
1. [Atomicity](#1-atomicity)
2. [Consistency](#2-consistency)
3. [Isolation](#3-isolation)
4. [Durability](#4-durability)
5. [ACID vs. BASE](#5-acid-vs-base)
6. [Cheat sheet](#cheat-sheet)

---

## 0. What is a transaction?

**In one sentence:** a transaction is a group of database operations treated as **one single unit of work** — it either fully happens or doesn't happen at all.

### In plain words
Buying a concert ticket online involves several steps: reserve the seat, charge your card, create the ticket, send the email. You'd be furious if your card were charged but no seat were reserved. A transaction wraps these steps so the world only ever sees "**ticket bought**" or "**nothing happened**" — never a half-finished purchase.

The classic example is a bank transfer:
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 'alice';
UPDATE accounts SET balance = balance + 100 WHERE id = 'bob';
COMMIT;
```
ACID is the set of four promises the database makes about such a transaction.

---

## 1. Atomicity

**In one sentence:** **all or nothing** — either every operation in the transaction takes effect, or none of them do.

### In plain words
"Atom" comes from Greek for "indivisible". The transfer can't be split: if the power fails after taking money from Alice but before giving it to Bob, the database must act as if **nothing** happened — Alice keeps her money.

### How it works
- Before changing a row, the database records how to **undo** the change (an **undo log**, or it keeps the old row version with MVCC).
- On `ROLLBACK`, an error, or a crash before `COMMIT`, the database applies the undo information — the partial changes vanish.
- After a crash, recovery rolls back every transaction that hadn't committed.

### Interview answer
"Atomicity means a transaction's changes are applied entirely or not at all. Databases implement it with undo logs or multi-version rows: on abort, error or crash recovery, uncommitted changes are rolled back."

---

## 2. Consistency

**In one sentence:** a transaction takes the database from one **valid state** to another valid state — it can never leave data breaking the rules (constraints, invariants).

### In plain words
The rules of a board game: whatever moves you make, the board must end up in a legal position. If a move would break a rule (a negative bank balance, an order for a customer who doesn't exist), the whole move is rejected.

### How it works
- The **database** enforces declared rules: primary/foreign keys, unique, check, NOT NULL, triggers ([Constraints](./Constraints.md)). A violating statement fails and (with atomicity) the transaction rolls back.
- The **application** is responsible for business invariants the database doesn't know ("total money in the bank never changes during a transfer") — transactions give it the tools to keep them.
- Note: the "C" in **ACID** (valid state) is *different* from the "C" in the **CAP theorem** (all replicas return the latest write). Interviewers like this distinction.

### Interview answer
"Consistency means a committed transaction moves the database between states that satisfy all integrity constraints and invariants. The database enforces declared constraints and triggers; application invariants rely on correct transaction logic. It's unrelated to CAP consistency, which is about replicas agreeing."

---

## 3. Isolation

**In one sentence:** concurrent transactions don't interfere with each other — the result is as if they ran **one after another** (fully, at the strictest level).

### In plain words
Two cashiers selling the last concert ticket at the same moment. Without isolation, both see "1 seat left", both sell it — one seat, two customers. Isolation makes the second cashier wait (or retry) until the first is finished, as if they were in line.

### How it works
- Implemented with **locks** (two-phase locking: acquire locks as you go, release at commit) and/or **MVCC** — multi-version concurrency control: readers see a consistent **snapshot** of old row versions while writers create new versions, so readers and writers don't block each other (PostgreSQL, MySQL InnoDB, Oracle).
- Full isolation (**serializable**) is expensive, so databases offer weaker **isolation levels** — Read Uncommitted, Read Committed, Repeatable Read, Serializable — that allow some anomalies (dirty reads, non-repeatable reads, phantoms, lost updates) in exchange for speed. See [Transactions and Isolation Levels](./Transactions-and-Isolation.md).

### Interview answer
"Isolation controls how concurrent transactions see each other's work; serializable isolation makes the outcome equivalent to some serial order. It's implemented with two-phase locking or MVCC snapshots, and databases expose weaker isolation levels that trade anomalies like non-repeatable reads, phantoms and lost updates for concurrency."

---

## 4. Durability

**In one sentence:** once a transaction is **committed**, its changes survive crashes, power failures and restarts.

### In plain words
When the ATM says "transfer complete", that fact must survive even if the bank's building loses power one millisecond later. The database won't say "committed" until the change is safely written somewhere that survives a crash.

### How it works
1. **Write-ahead logging (WAL):** before saying "committed", the database appends the change to a sequential **log file** and calls `fsync` to force it to disk. Updating the actual table pages can happen later.
2. After a crash, **recovery** reads the log: **redo** committed changes that hadn't reached the table pages, **undo** uncommitted ones (e.g. the ARIES algorithm).
3. **Checkpoints** periodically flush pages so the log to replay stays short.
4. Beyond one disk: **replication** to other machines (synchronous replication for zero data loss), backups, and point-in-time recovery from archived WAL.

Trade-off: `fsync` on every commit is slow; options like PostgreSQL `synchronous_commit = off` or group commit trade a tiny window of possible loss for throughput.

### Interview answer
"Durability means committed data survives failures. Databases achieve it with write-ahead logging — the log record is flushed with fsync before the commit is acknowledged — plus crash recovery that redoes committed and undoes uncommitted work, checkpoints to bound recovery time, and replication and backups for media or machine loss."

---

## 5. ACID vs. BASE

Many distributed NoSQL systems relax ACID in favor of **BASE**:
- **B**asically **A**vailable — the system keeps answering, even during failures.
- **S**oft state — data may change over time without new input (as replicas sync).
- **E**ventual consistency — replicas converge if writes stop.

| | ACID | BASE |
|---|---|---|
| Priority | Correctness, integrity | Availability, scale |
| Consistency | Strong, immediate | Eventual |
| Typical systems | PostgreSQL, MySQL, Oracle, SQL Server | Cassandra, DynamoDB (default), Riak |
| Good for | Money, orders, inventory | Feeds, likes, analytics, caches |

Many modern systems blur the line: MongoDB and DynamoDB offer ACID transactions; distributed SQL databases (Spanner, CockroachDB, YugabyteDB) provide ACID across regions. More in [Distributed Systems](../System%20Design/Distributed-Systems.md).

---

## Cheat sheet

| Property | Promise | Mechanism |
|---|---|---|
| **A**tomicity | All or nothing | Undo log / MVCC versions, rollback |
| **C**onsistency | Valid state → valid state | Constraints, triggers, correct app logic |
| **I**solation | Concurrent tx don't interfere | Locks (2PL), MVCC snapshots, isolation levels |
| **D**urability | Committed = survives crashes | WAL + fsync, recovery (redo/undo), replication |
