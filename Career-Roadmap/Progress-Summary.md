# What I'm doing now, and what I know

**Updated:** 12 Oct 2026.

**What it's for:** read it before a call, an interview or a networking chat, so you can say clearly what you're working on and what you've learned.

**Where it comes from:** the 18 steps marked **Done** in the Notion study plan ("Study Plan — Step by Step"). The "How well I know it" column is filled in from the [knowledge check](Knowledge-Check.md), round by round.

---

## 1. Say it out loud

### 30 seconds: "What are you doing these days?"
> Right now I'm doing three things.
>
> First, I'm taking Carnegie Mellon's **database systems course (CMU 15-445)** on my own. I've finished the first five lectures (relational model, SQL, storage, the buffer pool), homework 1 in SQL, and **project 0**. That's a thread-safe **Count-Min Sketch** in C++, and it passes the course's autograder.
>
> Second, I'm preparing my next big project: a **distributed key-value store in Rust built on Raft**. I've read the Raft paper and the consistency and consensus chapter of *Designing Data-Intensive Applications*.
>
> Third, I keep my problem solving sharp with **Codeforces virtual contests**, and I'm reviewing **OS fundamentals**: processes, threads and synchronization.

### 60 seconds: add the "why"
Use the 30-second answer, then add:
> I picked databases and distributed systems because they connect everything I already do: low-level C++ and Rust, concurrency, and systems that must not lose data. The course gives me the storage engine side: pages, buffer pools, indexes. The Raft project gives me the distributed side: replication, consensus and testing under failures. And everything I learn goes into the key-value store.

### If they ask "what's the plan after that?"
> - **CMU:** next is project 1, a buffer pool manager. Then indexes and B+Trees, query execution, concurrency control and recovery.
> - **Key-value store:** first a storage engine (write-ahead log + LSM tree), then Raft, then sharding.
> - **Goal:** a finished, tested project I can show, and a systems/infrastructure role.

---

## 2. What I finished (from Notion)

| Area | Done | Step |
|---|---|---|
| **CMU 15-445 lectures** | L01 Relational Model & Algebra · L02 Modern SQL · L03 Database Storage I · L04 Memory & Disk Management · L05 Database Storage II | 1, 2, 8, 9, 15 |
| **CMU homework** | HW1 SQL in DuckDB, Q1–Q6, compared with the official solutions | 11, 16 |
| **CMU project** | Setup (BusTub, CMake, clang, gdb, Gradescope) · **P0 C++ Primer: Count-Min Sketch**, passing on Gradescope, clang-tidy clean, no memory leaks | 3, 4, 10 |
| **Operating systems** (repo guides) | Processes · Threads · Thread synchronization (mutexes, semaphores, monitors, atomics) | 5, 17 |
| **Distributed systems** (flagship prep) | Raft paper §1–§5 + the raft.github.io visualization · DDIA ch. 9 part 1 (linearizability, ordering) · DDIA ch. 9 part 2 (consensus) + the Jepsen consistency-models map | 6, 18, 23 |
| **Problem solving** | Codeforces Round 1074 (Div. 4), virtual: A–D | 13 |
| **Career** | LinkedIn update (first pass) · Knight-Hennessy go/no-go decision | 7, 14 |

**Not done yet in phase 1:** step 12. **Phase 2:** steps 19–22 are next.

---

## 3. What I can explain now

These are the concepts from the finished steps, one line each, the way you'd say them to an engineer.

### 3.1 Relational model and SQL (L01, L02, HW1)
- **Relation:** an unordered set of tuples with the same attributes. A table is the everyday name.
- **Primary key / foreign key:** a primary key uniquely identifies a row; a foreign key points to a primary key in another table.
- **Data independence:** the user writes *what* they want (declarative SQL); the DBMS decides *how* to store and fetch it.
- **Relational algebra:** select σ (filter rows), project π (pick columns), union, intersection, difference, product ×, join ⋈. SQL is built on these.
- **SQL works on bags (multisets), not sets:** duplicates are kept unless you use `DISTINCT`.
- **Aggregates + GROUP BY + HAVING:** `HAVING` filters groups after aggregation; `WHERE` filters rows before.
- **Window functions:** `ROW_NUMBER()`, `RANK()` `OVER (PARTITION BY … ORDER BY …)`. They compute over related rows without collapsing them into one row.
- **Nested queries and CTEs:** `IN`, `EXISTS`, `ANY`, `ALL`; `WITH` names a sub-query; `WITH RECURSIVE` handles trees and graphs.

### 3.2 Storage (L03, L05)
- **Disk-oriented DBMS:** the database lives on disk; the **buffer pool** brings pages into memory when they're needed.
- **Sequential vs random I/O:** sequential is much faster, so storage design tries to turn random I/O into sequential I/O.
- **Why not mmap:**
  - the OS can flush dirty pages at any time, which is unsafe for transactions;
  - I/O stalls on page faults;
  - hard error handling (SIGBUS);
  - TLB shootdowns.
  - "The OS is not your friend."
- **Three kinds of page:** hardware page (usually 4 KB), OS page (4 KB), database page (1–16 KB).
- **Heap file + page directory:** an unordered set of pages; the page directory maps page IDs to where they are in the files.
- **Slotted page:** a header and a slot array at the start, tuples filled from the end. The slot array maps slot numbers to offsets, so tuples can move inside the page.
- **Record ID:** (page ID, slot number), which finds one tuple.
- **Problems with tuple-oriented storage:** fragmentation, useless I/O (a whole page to change one tuple), random I/O.
- **Log-structured storage (LSM):**
  - Writes go to an in-memory **MemTable**. When it's full, it's sorted and written to disk as an immutable **SSTable**.
  - Reads check the MemTable, then SSTables from newest to oldest. Min/max keys and **Bloom filters** let reads skip files.
- **Compaction:** merges SSTables, keeping only the newest version of each key.
  - **Level compaction:** level 0 → 1 → 2, non-overlapping key ranges inside a level, except level 0.
  - **Universal compaction:** all SSTables in one level.
- **LSM trade-offs:** fast sequential writes, slower reads, expensive compaction, **write amplification**.
- **Index-organized storage:** the tuples are stored inside the index itself, sorted by key, for example in the leaves of a B+Tree.

### 3.3 Buffer pool (L04, L05)
- **Buffer pool:** an array of fixed-size **frames** in memory.
  - The **page table** maps page ID → frame. It lives in memory only.
  - The **page directory** maps page ID → place on disk. It's stored on disk.
- **Pin count:** how many threads are using a page right now. A pinned page can't be evicted.
- **Dirty flag:** the page was changed, so it must be written to disk before eviction.
  - **Background writing:** the DBMS writes dirty pages out early, so eviction stays fast.
- **Locks vs latches:**
  - **Locks** protect database contents (tuples, tables) between transactions and can roll back.
  - **Latches** protect internal data structures for a short time. They're mutexes.
- **Replacement policies:**
  - **LRU:** evict the page used longest ago.
  - **CLOCK:** an LRU approximation with one reference bit per page and a "clock hand".
  - **Sequential flooding:** a big scan pushes useful pages out of LRU/CLOCK.
  - **LRU-K:** looks at the last K accesses, so frequency counts too.
  - **MySQL's young/old lists:** an approximation of LRU-2.
  - **ARC:** balances recency (T1) against frequency (T2), with ghost lists.
- **Optimizations:**
  - multiple buffer pools;
  - pre-fetching;
  - scan sharing (synchronized scans);
  - **Direct I/O (`O_DIRECT`)** to skip the OS page cache. PostgreSQL is the exception: it uses the OS cache.

### 3.4 Project 0: Count-Min Sketch (C++)
- **What it is:** a small, fixed-size structure that **estimates how often each item appears** in a stream.
  - A 2-D array of counters: `depth` rows, one hash function per row, `width` columns.
- **Insert:** hash the item with each row's hash and add 1 to that cell in every row.
- **Count:** take the **minimum** over the rows. Collisions only add, so the estimate is **never lower than the true count**; it can only overestimate.
- **Merge:** add two sketches cell by cell. They must have the same width and depth.
- **TopK:** return the k candidates with the highest estimated counts.
- **Thread safety:** `Insert` had to be thread-safe and **faster than the sequential version (speedup > 1.2)**. That means per-counter atomics or fine-grained latches, not one global lock.
- **Engineering:** CMake + clang, Google C++ style (clang-tidy), no memory leaks, move constructor and move assignment.

### 3.5 Operating systems (repo guides)
- **Process:** a running program with its own address space (code, data, heap, stack). The OS tracks it in a **PCB** (process control block).
- **States:** new → ready → running → waiting → terminated.
- **`fork` + `exec`:** `fork` copies the process (copy-on-write); `exec` replaces the program; the parent `wait`s.
- **Context switch:** save one task's registers and state, load another's. It's pure overhead.
- **IPC:** pipes, shared memory, message queues, sockets, signals.
- **Zombie:** finished, but the parent hasn't called `wait` yet. **Orphan:** the parent died, so init/systemd adopts it.
- **Thread:** a flow of execution inside a process.
  - Threads **share** the code, heap, globals and open files.
  - Each one **keeps its own** stack, registers and program counter.
- **Modern C++:** `std::jthread` joins itself automatically; `std::stop_token` asks a thread to stop politely.
- **User threads vs kernel threads:** 1:1, M:1 and M:N models.
- **Thread pool:** a fixed set of workers taking tasks from a queue.
- **Race condition:** the result depends on timing. A **critical section** is code that only one thread may run at a time.
- **Mutex:** one owner at a time. A **reader–writer lock** (`std::shared_mutex`) allows many readers or one writer.
- **Semaphore:** a counter. `acquire` waits while it's 0. It limits N users, or signals between threads.
- **Monitor:** a mutex plus a **condition variable**. Always wait in a loop (or with a predicate) because of **spurious wake-ups**. The classic example is the bounded producer/consumer queue.
- **Atomics:** lock-free updates of single values (`std::atomic`, `compare_exchange`).

### 3.6 Distributed systems (Raft paper, DDIA ch. 9, Jepsen)
- **Replicated state machine:** every node applies the same log of commands in the same order, so all nodes end up in the same state.
- **Raft roles:** follower, candidate, leader. Time is split into **terms**, and each term has at most one leader.
- **Leader election:**
  - A follower that hears nothing for a **random election timeout** becomes a candidate and asks for votes.
  - It wins with a **majority**.
  - The random timeouts stop split votes from repeating.
- **Log replication:**
  - The leader appends an entry and sends **AppendEntries** to the followers.
  - The entry is **committed** once it's stored on a **majority**; then it can be applied.
- **Safety:**
  - **Log matching:** same index and term means the same entry and the same history before it.
  - **Election restriction:** a candidate's log must be at least as up to date as the voter's.
  - So **a leader always has every committed entry**.
- **Linearizability:** the system acts as if there is one copy of the data, and every operation takes effect at one instant between its start and its end. It's a recency guarantee.
- **Causality and ordering:**
  - Causal order is a partial order.
  - **Lamport timestamps** give a total order that matches causality.
  - **Total order broadcast** delivers messages to every node in the same order. It's equivalent to consensus.
- **Consensus:** nodes agree on one value. Uses: leader election, atomic commit, locks.
  - **Two-phase commit (2PC)** blocks if the coordinator fails.
  - Raft, Paxos and ZAB tolerate failures as long as a majority is alive.
- **CAP:** under a network partition, choose consistency (linearizable) or availability.
- **Jepsen map:**
  - consistency models form a hierarchy (strict serializable at the top, then linearizable and serializable, down to weaker ones such as causal and read-your-writes);
  - stronger models are less available under partitions.

### 3.7 Problem solving (CF Round 1074, Div. 4)
| Problem | Idea |
|---|---|
| **A. Perfect Root** | Every positive integer x is a "perfect root" of y = x², so print 1, 2, …, n. |
| **B. Prefix Max** | Moving the maximum element to the front makes every prefix max equal to it. That gives the best value: n × max. |
| **C. Shifted MEX** | Shifting by x keeps the gaps between values, so the answer is the longest run of consecutive distinct values (sort and deduplicate). |
| **D. OutOfMemoryError** | Simulate with lazy resets: track which indices changed since the last reset, and reset only those, instead of copying the whole array each time. |

---

## 4. How well I know it

From the [knowledge check](Knowledge-Check.md). Updated after each round.

| Topic | Level | Notes |
|---|---|---|
| Relational model + SQL | Not tested yet | |
| Storage + buffer pool | Not tested yet | |
| Project 0: Count-Min Sketch | Not tested yet | |
| OS: processes, threads, synchronization | Not tested yet | |
| Distributed: Raft, linearizability, consensus | Not tested yet | |
| Contest problems A–D | Not tested yet | |

**Levels:**
- **Strong:** can explain it and answer follow-ups.
- **OK:** knows the idea, with gaps in the details.
- **Review:** needs another pass.
