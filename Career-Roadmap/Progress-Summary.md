# What I'm doing now, and what I know

**Updated:** 18 Oct 2026.

**What it's for:** read it before a call, an interview or a networking chat, so you can say clearly what you're working on and what you've learned.

**Where it comes from:** the 25 steps marked **Done** in the Notion study plan ("Study Plan — Step by Step"). Every line in §3 was checked on 18 Oct 2026 against the **main resource of its step** in the plan (the step's Link and Notes), linked under each heading. For DDIA, ch. 5 was checked against the free official excerpt. Ch. 9 has no free copy, so it was checked against the author's own lecture notes on the same topics. The "How well I know it" table (§4) is filled in from the [knowledge check](Knowledge-Check.md).

**Diagrams for quick revision:** [DBMS layers, L01–L07](../Study-Plan/Revision-Maps/DBMS-Layers-L01-L07.md) · [DDIA ch. 5, Replication](../Study-Plan/Revision-Maps/DDIA-Ch5-Replication.md) · [DDIA ch. 9, Consistency and Consensus](../Study-Plan/Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md).

---

## 1. Say it out loud

### 30 seconds: "What are you doing these days?"
> Right now I'm doing three things.
>
> First, I'm taking Carnegie Mellon's **database systems course (CMU 15-445)** on my own. I've finished the first seven lectures (relational model, SQL, storage, the buffer pool, storage models and compression, hash tables), homework 1 in SQL, half of homework 2, and **project 0**. That's a thread-safe **Count-Min Sketch** in C++, and it passes the course's autograder.
>
> Second, I'm preparing my next big project: a **distributed key-value store in Rust built on Raft**. I've read the whole Raft paper, and the replication and the consistency and consensus chapters of *Designing Data-Intensive Applications*.
>
> Third, I keep my problem solving sharp with **Codeforces virtual contests**, and I'm reviewing **OS fundamentals**: processes, threads, synchronization, scheduling and memory management.

### 60 seconds: add the "why"
Use the 30-second answer, then add:
> I picked databases and distributed systems because they connect everything I already do: low-level C++ and Rust, concurrency, and systems that must not lose data. The course gives me the storage engine side: pages, buffer pools, indexes. The Raft project gives me the distributed side: replication, consensus and testing under failures. And everything I learn goes into the key-value store.

### If they ask "what's the plan after that?"
> - **CMU:** finish homework 2, then project 1, a buffer pool manager. Then indexes and B+Trees, query execution, concurrency control and recovery.
> - **Key-value store:** first a storage engine (write-ahead log + LSM tree), then Raft, then sharding.
> - **Goal:** a finished, tested project I can show, and a systems/infrastructure role.

---

## 2. What I finished (from Notion)

| Area | Done | Step |
|---|---|---|
| **CMU 15-445 lectures** | L01 Relational Model & Algebra · L02 Modern SQL · L03 Database Storage I · L04 Memory & Disk Management · L05 Database Storage II · L06 Storage Models & Compression · L07 Hash Tables | 1, 2, 8, 9, 15, 20, 25 |
| **CMU homework** | HW1 SQL in DuckDB, Q1–Q6, compared with the official solutions · HW2 Storage, first half | 11, 16, 21 |
| **CMU project** | Setup (BusTub, CMake, clang, gdb, Gradescope) · **P0 C++ Primer: Count-Min Sketch**, passing on Gradescope, clang-tidy clean, no memory leaks | 3, 4, 10 |
| **Operating systems** (repo guides) | Processes · Threads · Thread synchronization (mutexes, semaphores, monitors, atomics) · Scheduling algorithms · Memory management | 5, 17, 22, 27 |
| **Distributed systems** (flagship prep) | Raft paper §1–§5 + the raft.github.io visualization · Raft §6–§8 + the Students' Guide to Raft · DDIA ch. 9 part 1 (linearizability, ordering) · DDIA ch. 9 part 2 (consensus) + the Jepsen consistency-models map · DDIA ch. 5 (replication) | 6, 12, 18, 23, 28 |
| **Problem solving** | Codeforces Round 1074 (Div. 4), virtual: A–D | 13 |
| **Career** | LinkedIn update (following CV/LinkedIn.md) · Knight-Hennessy go/no-go decision | 7, 14 |

**Not done yet:**
- **Phase 1:** step 19 (DAAD documents + shortlist). Deadline **30 Oct**, so do it first.
- **Phase 2:** step 24 (book IELTS). Its 15 Oct date has passed, so book it now.
- **Phase 2:** step 26 (finish HW2 + self-grade).
- **Phase 2:** step 29 (shortlist 5 P1 companies).
- **Then phase 3:** P1 Buffer Pool Manager (step 30 onwards).

---

## 3. What I can explain now

These are the concepts from the finished steps, one line each, the way you'd say them to an engineer.

### 3.1 Relational model and SQL (L01, L02, HW1)
> **Source:** CMU 15-445 Fall 2025 [L01 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/01-relationalmodel.pdf) · [L02 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/02-modernsql.pdf) · [HW1](https://15445.courses.cs.cmu.edu/fall2025/homework1/) (6 queries, Q1–Q6, in DuckDB on the Lahman baseball database)

- **Relation:** an unordered set of tuples with the same attributes. A table is the everyday name.
- **Primary key / foreign key:** a primary key uniquely identifies a row; a foreign key points to a primary key in another table.
- **Data independence:** the user writes *what* they want (declarative SQL); the DBMS decides *how* to store and fetch it.
- **Relational algebra:** select σ (filter rows), project π (pick columns), union, intersection, difference, product ×, join ⋈. SQL is built on these.
- **SQL works on bags (multisets), not sets:** duplicates are kept unless you use `DISTINCT`.
- **Aggregates + GROUP BY + HAVING:** `HAVING` filters groups after aggregation; `WHERE` filters rows before.
- **Window functions:** `ROW_NUMBER()`, `RANK()` `OVER (PARTITION BY … ORDER BY …)`. They compute over related rows without collapsing them into one row.
- **Nested queries and CTEs:** `IN`, `EXISTS`, `ANY`, `ALL`; `WITH` names a sub-query; `WITH RECURSIVE` handles trees and graphs.

### 3.2 Storage (L03, L05)
> **Source:** [L03 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) · [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) (+ the slides with the same numbers)

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
> **Source:** [L04 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) · [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) §1 (buffer pool optimizations) · [L04 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/04-bufferpool.pdf)

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

### 3.4 Storage models and compression (L06, HW2 first half)
> **Source:** [L06 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/06-storage3.pdf) · [L06 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/06-storage3.pdf) · [HW2](https://15445.courses.cs.cmu.edu/fall2025/files/hw2-clean.pdf) Q1 (slotted pages vs log-structured) and Q2 (storage models). The answers get checked against the official solutions in step 26.

- **Workloads:**
  - **OLTP:** short, simple, repetitive queries on one entity; write-heavy (the Amazon storefront).
  - **OLAP:** long, complex queries with aggregates over large parts of the data; read-heavy (personalized ads).
  - **HTAP:** both on the same database.
- **NSM (row store):** all attributes of a tuple together in a slotted page.
  - Good for OLTP: one fetch gets the whole tuple; fast insert, update, delete.
  - Bad at scans of a few columns; hard to compress, because a page mixes value domains.
- **DSM (column store):** one attribute for all tuples stored together.
  - Good for OLAP: reads only the columns a query needs, better locality, better compression.
  - Bad for point queries and writes, because tuples have to be split and stitched back together.
- **Putting a tuple back together in DSM:**
  - **fixed-length offsets** (most common): the same offset in every column is the same tuple;
  - **embedded tuple IDs** (rare, big overhead).
  - Variable-length values become fixed-length through dictionary compression.
- **PAX:** rows are split into **row groups**, and each row group into column chunks. A global header (a footer in Parquet/ORC) holds the row-group offsets. It gets column-store speed with row-store locality.
- **Hybrid storage (slides):**
  - **fractured mirrors:** a second, columnar copy, kept up to date automatically;
  - **delta store:** updates are staged in NSM, and a background thread moves them to the column store.
- **Compression goals:**
  - fixed-length values;
  - **late materialization** (decompress as late as possible);
  - lossless.
- **Granularity:** block, tuple (NSM only), attribute, or columnar (DSM only).
- **Naive compression:**
  - What it is: general-purpose algorithms (LZ4, Snappy, Zstd…) on whole pages.
  - Cost: every read or update must decompress first; MySQL keeps compressed pages plus a "mod log".
  - Limit: the algorithm doesn't know what the data means, so late materialization isn't possible.
- **Columnar schemes:**
  - **RLE:** (value, offset, length) triplets. Sorting first makes the runs longer.
  - **Bit packing:** fewer bits per value. **Mostly encoding** adds a marker and a lookup table for the few values that are too big.
  - **Bitmap:** one bitmap per distinct value. Only for low cardinality; Roaring bitmaps for sparse ones.
  - **Delta:** store the differences, and RLE them too.
  - **Dictionary:** the most common scheme. Codes map to values, and it must support fast encoding and decoding, so no hash functions. It's **order-preserving**, so range queries and `LIKE 'And%'` can run on the codes.

### 3.5 Hash tables (L07)
> **Source:** [L07 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/07-hashtables.pdf) · [L07 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/07-hashtables.pdf)

- **Where a DBMS uses data structures:**
  - internal metadata (page tables, page directories);
  - core tuple storage;
  - temporary structures (a hash table for a join);
  - table indexes.
  - Two design decisions: data organization and concurrency.
- **Hash table:**
  - Average O(1), worst case O(n); no ordering.
  - Two parts: a **hash function** and a **hashing scheme** for collisions.
- **Hash function:** fast with a low collision rate; never cryptographic. The state of the art is **XXHash3**.
- **Static hashing:** the size is fixed in advance. When it's full, rebuild a bigger table (usually 2×). Use about 2× as many slots as expected keys.
- **Linear probing:** on a collision, scan forward to the next free slot.
  - **Delete:** use **tombstones**, or shift entries back (rarely done).
  - **Non-unique keys:** a separate value list, or redundant keys (more common).
  - **State of the art:** Google's `absl::flat_hash_map`.
- **Cuckoo hashing:** several hash functions (different seeds).
  - Insert into a free slot, or evict the old entry and rehash it.
  - A cycle means a rebuild.
  - O(1) lookups and deletes.
- **Dynamic hashing:** grows without a full rebuild.
  - **Chained:** a linked list of buckets per slot.
  - **Extendible:** global and local depth. Split only the full bucket, and double the slot array only when the local depth equals the global depth.
  - **Linear hashing:** a **split pointer**. Any overflow splits the bucket *at the pointer*, using a second hash function (key % 2n). The table can also shrink.

### 3.6 Project 0: Count-Min Sketch (C++)
> **Source:** [P0 C++ Primer page](https://15445.courses.cs.cmu.edu/fall2025/project0/)

- **What it is:** a small, fixed-size structure that **estimates how often each item appears** in a stream.
  - A 2-D array of counters: `depth` rows, one hash function per row, `width` columns.
- **Insert:** hash the item with each row's hash and add 1 to that cell in every row.
- **Count:** take the **minimum** over the rows. Collisions only add, so the estimate is **never lower than the true count**; it can only overestimate.
- **Merge:** add two sketches cell by cell. They must have the same width and depth.
- **Clear:** reset all counters for a new stream.
- **TopK:** return the k candidates with the highest estimated counts.
- **Thread safety:** `Insert` had to be thread-safe and **faster than the sequential version (speedup > 1.2)**. The page says one global latch gives a speedup of about 1.0; the hint is finer-grained latches or no latch at all (`compare_exchange`).
- **Engineering:** CMake + clang, the Google C++ Style Guide (checked with clang-tidy), no memory leaks (ASAN/LSAN), move constructor and move assignment.

### 3.7 Operating systems (repo guides)
> **Source:** [Processes](../Operating%20Systems/Processes.md) · [Threads](../Operating%20Systems/Threads.md) · [Thread synchronization](../Operating%20Systems/Thread-Synchronization.md) · [Scheduling](../Operating%20Systems/Scheduling.md) · [Memory management](../Operating%20Systems/Memory-Management.md)

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
- **Scheduling metrics:** waiting, turnaround, response time, throughput, CPU utilization, fairness. No algorithm wins on all of them.
- **Classic algorithms:**
  - **FCFS:** the convoy effect.
  - **SJF/SRTF:** lowest average waiting time, but it can starve long jobs.
  - **Round Robin:** the quantum size matters.
  - **Priority:** needs **aging** so low priorities don't starve.
  - Linux uses CFS (EEVDF since 6.6).
- **Fair share:** divide the CPU between *groups* (users, cgroups `cpu.weight`) first, then between processes inside each group.
- **EDF:** run the task with the nearest deadline (real-time, preemptive). For periodic tasks on one CPU, every deadline is met iff `U = Σ C/P ≤ 1`. Under overload it fails in a domino effect. Linux: `SCHED_DEADLINE`.
- **WFQ:** each packet gets a virtual finish time `F = max(V(now), F_prev) + L / weight`, and the smallest F goes first. It approximates GPS and is work-conserving.
- **Paging:**
  - Pages map to frames through a per-process page table.
  - The MMU translates addresses, and the TLB caches the translations.
  - A **page fault** loads the missing page.
- **Page replacement:**
  - **FIFO:** suffers Bélády's anomaly.
  - **LRU:** close to optimal, but costly to do exactly.
  - **Clock:** a reference bit plus a hand; what real OSes use.
  - **Optimal:** a theoretical bound.
  - **Thrashing:** the working sets don't fit in RAM.
- **`mmap`:** a file appears as memory, loaded lazily on page faults, with zero copies. Errors arrive as `SIGBUS`. Call `msync` for durability.
- **Buddy allocator:** power-of-two blocks, split to allocate, merge with the buddy at `addr ^ size`. Linux uses it for page frames, at the cost of internal fragmentation.

### 3.8 Raft (paper §1–§8, Students' Guide)
> **Source:** [Raft paper](https://raft.github.io/raft.pdf) §1–8 (replicated state machine, roles, terms, election, replication, safety, membership changes, log compaction, client interaction) · [Students' Guide to Raft](https://thesquareplanet.com/blog/students-guide-to-raft/)

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
- **Timing (§5.6):** `broadcastTime ≪ electionTimeout ≪ MTBF`. Typical election timeouts are 10–500 ms. Safety never depends on timing; availability does.
- **Membership changes (§6):** switching straight from the old to the new configuration could create two majorities.
  - Raft goes through **joint consensus** (C_old,new) first: agreement needs majorities of both.
  - New servers join as non-voting members until they catch up.
  - A leader that isn't in C_new steps down.
- **Log compaction (§7):** each server **snapshots** its committed state on its own (last included index + term + config). A follower that is too far behind gets an **InstallSnapshot** RPC.
- **Client interaction (§8):**
  - Clients find the leader by being redirected.
  - **Unique serial numbers** per command stop duplicate execution.
  - **Linearizable reads** need two things: a no-op commit at the start of the term, and heartbeats with a majority before answering. A lease instead would rely on timing.
- **Students' Guide:**
  - Treat Figure 2 as **MUST**, not SHOULD.
  - Heartbeats are normal AppendEntries and must run every check.
  - Truncate the log **only on a conflict**.
  - Reset the election timer only on AppendEntries from the current leader, when starting an election, or when granting a vote.
  - Drop RPC replies from old terms.
  - `matchIndex` is for safety, `nextIndex` for speed.
  - Never commit an entry from an earlier term by counting.

### 3.9 Replication (DDIA ch. 5)
> **Source:** *DDIA* ch. 5, read in the free official excerpt from O'Reilly and ScyllaDB ([PDF](https://www.scylladb.com/wp-content/uploads/ScyllaDB-Designing-Data-Intensive-Applications.pdf)). Every situation is drawn in the [ch. 5 revision map](../Study-Plan/Revision-Maps/DDIA-Ch5-Replication.md).

- **Why replicate:** lower latency (data near users), availability (keep working when parts fail), read throughput.
- **Single-leader:** writes go to the leader, which streams a replication log to the followers; reads can go to any replica.
- **Sync vs async:**
  - A synchronous follower is guaranteed up to date, but blocks writes when it's down.
  - **Semi-synchronous:** one follower synchronous, the rest asynchronous.
  - Fully asynchronous can lose confirmed writes if the leader dies.
- **New follower:** snapshot → copy → ask for the changes since the snapshot's log position (LSN / binlog coordinates) → caught up.
- **Failover:**
  - Steps: detect by timeout, choose the most up-to-date replica (election or controller), reconfigure clients.
  - Lost async writes get discarded. In the **GitHub** incident, reused autoincrement keys leaked data via Redis.
  - **Split brain:** fencing / STONITH.
  - Choosing the timeout is a trade-off.
- **Replication logs:**
  - **statement-based** (breaks on NOW(), RAND(), side effects);
  - **WAL shipping** (tied to the storage engine, so upgrades need downtime);
  - **logical row-based** (decoupled; also change data capture);
  - **trigger-based** (flexible, more overhead).
- **Replication lag** (eventual consistency) causes three anomalies:
  - **Read-your-writes:** e.g. read your own profile from the leader, or track the timestamp of your last write.
  - **Monotonic reads:** the same replica per user (hash of the user ID).
  - **Consistent prefix:** causally related writes go to the same partition.
- **Multi-leader:**
  - One leader per datacenter: better performance, and tolerates DC outages and network problems.
  - Also used for offline clients (calendar, CouchDB) and collaborative editing.
  - The cost is **write conflicts**.
- **Conflicts:**
  - Avoid them (a home leader per record).
  - Or converge: LWW or replica ID (both lose data), merge ("B/C"), or record the conflict.
  - Custom handlers run on write (Bucardo) or on read (CouchDB).
  - Automatic resolution: CRDTs, mergeable persistent data structures, operational transformation.
- **Topologies:**
  - circular, star, all-to-all;
  - node IDs in each write stop loops;
  - in all-to-all, writes can overtake each other → **version vectors**.
- **Leaderless (Dynamo-style: Riak, Cassandra, Voldemort):**
  - Write to and read from several nodes; repair through **read repair** and **anti-entropy**.
  - Quorum **w + r > n** (n = 3, w = r = 2) means the read and write sets overlap.
  - Stale reads are still possible: sloppy quorums, concurrent writes, partial failures.
- **Sloppy quorum + hinted handoff:** under a partition, write to other reachable nodes and hand the writes back later. It gives durability, not a real quorum. Riak: on by default; Cassandra, Voldemort: off.
- **Concurrent writes:**
  - **LWW** loses data; the only safe use is immutable keys (UUIDs).
  - **Happens-before:** A before B, B before A, or concurrent.
  - Version numbers keep **siblings**, and a merge is needed (union + **tombstones** for removals).
  - With many replicas, **version vectors** (dotted version vectors in Riak 2.0).

### 3.10 Consistency and consensus (DDIA ch. 9, Jepsen)
> **Source:** the book's ch. 9 has no free copy, so these lines come from the author's own [Cambridge lecture notes](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf) on the same topics (slide numbers below) and the [Jepsen consistency models](https://jepsen.io/consistency/models) (linearizability, the map, availability under partitions). Every situation is drawn in the [ch. 9 revision map](../Study-Plan/Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md).

- **Linearizability (Slide 128):** the system acts as if there is one copy of the data, and every operation takes effect at one instant between its start and its end. It's a recency guarantee in **real time**.
  - **Not serializability:** that is about transactions in *some* serial order. Both together are **strict serializability**.
- **Quorums alone aren't linearizable (Slides 132–133):**
  - Two reads can see v1 and then v0.
  - **ABD (Slide 134):** the reader writes the newest value back to a quorum before it returns.
- **Linearizable compare-and-swap (Slide 136):** total order broadcast of every operation, executed on delivery.
- **Causality (Slides 60–64):**
  - **happens-before** is a partial order; events not ordered by it are **concurrent**.
  - Physical timestamps can contradict causality.
- **Lamport timestamps (Slides 66–68):**
  - `t = max(t, t') + 1` on receive.
  - (counter, node ID) gives a total order that respects causality, but it can't tell concurrent events apart.
  - **Vector clocks (Slides 69–72)** can.
- **Broadcast (Slides 75–80):**
  - **FIFO** → **causal** → **total order** (the same delivery order on every node).
  - Total order broadcast gives state machine replication. A leader database is total order broadcast of its commit records.
- **Consensus = total order broadcast (Slide 106):** the two are formally equivalent. Paxos/Multi-Paxos, Raft, Viewstamped Replication, Zab.
- **FLP (Slide 107):** no deterministic consensus algorithm always terminates in an asynchronous model. So timeouts are used for *liveness*, and *safety* never depends on timing.
- **Leader election (Slides 108–110):**
  - Terms, one vote per term, a quorum to win.
  - Two leaders from different terms can still exist, so the leader asks a quorum again before every decision.
- **2PC (Slides 122–125):**
  - Every node votes. The coordinator commits only if all say yes.
  - If the coordinator dies after "prepare", participants are **in doubt** and **blocked**.
  - **Paxos Commit (Slides 126–127):** votes go through total order broadcast, so there is no single point of failure.
- **CAP (Slide 139):** under a network partition, choose linearizable *or* available. It's not "pick 2 of 3". Jepsen: linearizability "cannot be totally or sticky available".
- **Jepsen map:**
  - Consistency models form a hierarchy: strict serializable at the top, then linearizable and serializable, down to weaker ones such as causal and read-your-writes.
  - Stronger models are less available under partitions.

### 3.11 Problem solving (CF Round 1074, Div. 4)
> **Source:** [the round's PDF with the official hints](../Contest-Practice/Codeforces/CF-2185-Div4-Round1074.pdf)

| Problem | Idea |
|---|---|
| **A. Perfect Root** | Every positive integer x is a "perfect root" of y = x², so print 1, 2, …, n. |
| **B. Prefix Max** | Moving the maximum element to the front makes every prefix max equal to it. That gives the best value: n × max. |
| **C. Shifted MEX** | Shifting by x keeps the gaps between values, so the answer is the longest run of consecutive distinct values (sort and deduplicate). |
| **D. OutOfMemoryError** | Simulate with lazy resets: track which indices changed since the last reset, and reset only those, instead of copying the whole array each time. |

---

## 4. How well I know it

From the [knowledge check](Knowledge-Check.md), round 1 on **13 Oct 2026**, with no revision first: **28/32 (88%) of the questions answered**. The steps finished after 13 Oct are not tested yet.

| Topic | Level | Notes |
|---|---|---|
| Relational model + SQL | Not tested yet | Part 1 skipped |
| Storage + buffer pool | **OK** (10/12) | Gaps: Bloom filters, `O_DIRECT` |
| Storage models, compression, hash tables (L06, L07) | Not tested yet | Finished after the exam |
| Project 0: Count-Min Sketch | Not tested yet | Part 3 skipped |
| OS: processes, threads, synchronization | **Strong** (10/10) | |
| OS: scheduling, memory management | Not tested yet | Finished after the exam |
| Distributed: Raft, linearizability, consensus | **OK** (8/10, 1 skipped) | Raft and Jepsen parts all right. Gaps: Lamport timestamps, total order broadcast, 2PC |
| Raft §6–§8, DDIA ch. 5 replication | Not tested yet | Finished after the exam |
| Contest problems A–D | Not tested yet | Part 6 skipped |

**Review before the next interview** (5 minutes each; the details are in [Knowledge-Check.md](Knowledge-Check.md#what-to-re-read-the-5-missed-concepts)):
1. **Bloom filter:** "definitely not here" or "maybe here"; no false negatives, never a location. *L05 notes §3.*
2. **`O_DIRECT`:** skips the OS page cache. It does not replace `fsync`. *L04 notes §5.*
3. **Lamport timestamps:** (counter, node ID), max on receive. A total order that respects causality, not wall-clock time. *Kleppmann notes, Slides 66–68.*
4. **Total order broadcast = consensus.** Raft's log is one. *Kleppmann notes, Slide 106; Raft §2.*
5. **2PC blocks** if the coordinator dies after the "yes" votes. Raft uses a majority instead. *Kleppmann notes, Slide 125.*

**Levels:**
- **Strong:** can explain it and answer follow-ups.
- **OK:** knows the idea, with gaps in the details.
- **Review:** needs another pass.
