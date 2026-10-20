# What I'm doing now, and what I know

**Updated:** 20 Oct 2026.

**What it's for:** read it before a call, an interview or a networking chat, so you can say clearly what you're working on and what you've learned.

**Where it comes from:** the 27 steps marked **Done** in the Notion study plan ("Study Plan — Step by Step"). Every line in §3 was checked against the **main resource of its step** in the plan (the step's Link and Notes), linked under each heading. On 20 Oct 2026 the whole of §3 was re-checked line by line against the full CMU lecture notes L01–L07, the HW2 official solutions and every repo guide, and the concepts that had been left out were added. For DDIA, ch. 5 was checked against the free official excerpt. Ch. 9 has no free copy, so it was checked against the author's own lecture notes on the same topics. The "How well I know it" table (§4) is filled in from the [knowledge check](Knowledge-Check.md).

**Diagrams for quick revision:** [DBMS layers, L01–L07](../Study-Plan/Revision-Maps/DBMS-Layers-L01-L07.md) · [DDIA ch. 5, Replication](../Study-Plan/Revision-Maps/DDIA-Ch5-Replication.md) · [DDIA ch. 9, Consistency and Consensus](../Study-Plan/Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md).

---

## 1. Say it out loud

### 30 seconds: "What are you doing these days?"
> Right now I'm doing three things.
>
> First, I'm taking Carnegie Mellon's **database systems course (CMU 15-445)** on my own. I've finished the first seven lectures (relational model, SQL, storage, the buffer pool, storage models and compression, hash tables), homework 1 in SQL, homework 2 on storage and compression, and **project 0**. That's a thread-safe **Count-Min Sketch** in C++, and it passes the course's autograder.
>
> Second, I'm preparing my next big project: a **distributed key-value store in Rust built on Raft**. I've read the whole Raft paper, and the replication and the consistency and consensus chapters of *Designing Data-Intensive Applications*.
>
> Third, I keep my problem solving sharp with **Codeforces virtual contests**, and I'm reviewing **OS fundamentals**: processes, threads, synchronization, scheduling, memory management and file systems.

### 60 seconds: add the "why"
Use the 30-second answer, then add:
> I picked databases and distributed systems because they connect everything I already do: low-level C++ and Rust, concurrency, and systems that must not lose data. The course gives me the storage engine side: pages, buffer pools, indexes. The Raft project gives me the distributed side: replication, consensus and testing under failures. And everything I learn goes into the key-value store.

### If they ask "what's the plan after that?"
> - **CMU:** project 1 next, a buffer pool manager. Then indexes and B+Trees, query execution, concurrency control and recovery.
> - **Key-value store:** first a storage engine (write-ahead log + LSM tree), then Raft, then sharding.
> - **Goal:** a finished, tested project I can show, and a systems/infrastructure role.

---

## 2. What I finished (from Notion)

| Area | Done | Step |
|---|---|---|
| **CMU 15-445 lectures** | L01 Relational Model & Algebra · L02 Modern SQL · L03 Database Storage I · L04 Memory & Disk Management · L05 Database Storage II · L06 Storage Models & Compression · L07 Hash Tables | 1, 2, 8, 9, 15, 20, 25 |
| **CMU homework** | HW1 SQL in DuckDB, Q1–Q6, compared with the official solutions · HW2 Storage (slotted pages vs log-structured, storage models, compression), finished and self-graded with the official solutions | 11, 16, 21, 26 |
| **CMU project** | Setup (BusTub, CMake, clang, gdb, Gradescope) · **P0 C++ Primer: Count-Min Sketch**, passing on Gradescope, clang-tidy clean, no memory leaks | 3, 4, 10 |
| **Operating systems** (repo guides) | Processes · Threads · Thread synchronization (mutexes, semaphores, monitors, atomics) · Scheduling algorithms · Memory management · File systems (journaling, NFS/SMB, encryption, HDFS/Ceph); the whole OS checklist is now done | 5, 17, 22, 27, 36 |
| **Distributed systems** (flagship prep) | Raft paper §1–§5 + the raft.github.io visualization · Raft §6–§8 + the Students' Guide to Raft · DDIA ch. 9 part 1 (linearizability, ordering) · DDIA ch. 9 part 2 (consensus) + the Jepsen consistency-models map · DDIA ch. 5 (replication) | 6, 12, 18, 23, 28 |
| **Problem solving** | Codeforces Round 1074 (Div. 4), virtual: A–D | 13 |
| **Career** | LinkedIn update (following CV/LinkedIn.md) · Knight-Hennessy go/no-go decision | 7, 14 |

**Not done yet:**
- **Phase 1:** step 19 (DAAD documents + shortlist). Deadline **30 Oct**, so do it first.
- **Phase 2:** step 24 (book IELTS). Its 15 Oct date has passed, so book it now.
- **Phase 2:** step 29 (shortlist 5 P1 companies).
- **Then phase 3:** P1 Buffer Pool Manager (steps 30–35, then 37 onwards; step 36, file systems, is already done).

---

## 3. What I can explain now

These are the concepts from the finished steps, one line each, the way you'd say them to an engineer.

### 3.1 Relational model and SQL (L01, L02, HW1)
> **Source:** CMU 15-445 Fall 2025 [L01 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/01-relationalmodel.pdf) · [L02 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/02-modernsql.pdf) · [HW1](https://15445.courses.cs.cmu.edu/fall2025/homework1/) (6 queries, Q1–Q6, in DuckDB on the Lahman baseball database)

- **Database vs DBMS:** the database is the organized collection of related data; the DBMS (MySQL, Oracle, MongoDB…) is the software that manages it.
- **Why not flat CSV files:**
  - **integrity:** nothing stops a bad year or a deleted artist that still has albums;
  - **implementation:** finding a record means parsing the whole file, and two threads writing at once corrupt it;
  - **durability:** a crash mid-update, and no replication.
- **Data model vs schema:** a data model is the set of concepts used to describe data (relational, key/value, document, graph, wide-column, array/vector; hierarchical and network are legacy). A schema describes one collection of data in that model.
- **Before the relational model:** 1960s systems (IMS, CODASYL) made you write procedural code that walked the data. When the data changed, the queries had to be rewritten.
- **Codd's relational model (1969):** three parts.
  - **Structure:** relations and their attributes, independent of how they're stored.
  - **Integrity:** constraints the data must meet.
  - **Manipulation:** a declarative API.
- **Relation:** an unordered set of tuples with the same attributes. A table is the everyday name. An n-ary relation is a table with n columns. Any attribute can be `NULL` (undefined).
- **Primary key / foreign key:** a primary key uniquely identifies a row (some DBMSs make one automatically, an identity column). A foreign key points to a primary key in another table.
- **Constraints:** user-defined conditions that always hold, most often unique keys and referential (foreign key) constraints, or `NOT NULL`.
- **Data independence:** the user writes *what* they want (declarative SQL); the DBMS decides *how* to store and fetch it, and re-optimizes when the data changes.
- **Procedural vs declarative DMLs:** procedural says how to compute the result (a loop); declarative says only what you want (`SELECT COUNT(*)`).
- **Relational algebra:** select σ (filter rows), project π (pick columns), union ∪, intersection ∩, difference −, product ×, join ⋈. Each operator takes relations and returns a relation, so they chain. SQL: `UNION ALL`, `INTERSECT`, `EXCEPT`, `CROSS JOIN`, `JOIN … USING`.
- **Why order matters → query optimization:** `R ⋈ σ(S)` and `σ(R ⋈ S)` give the same answer, but filtering first can be far faster on a big S. In a declarative language the DBMS picks the order for you.
- **Other data models:** the **document** model (JSON with nested fields; it runs into the flat-file problems again) and the **vector** model (arrays for nearest-neighbour search over ML embeddings; pgvector adds it to PostgreSQL).
- **SQL history:** IBM System R in the 1970s called it "SEQUEL". SQL-92 is the minimum a system must support to claim SQL; later standards added windows (2003), JSON (2016) and property-graph queries (2023).
- **Command classes:** DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), DDL (tables, indexes, views), DCL (security and access).
- **SQL works on bags (multisets), not sets:** duplicates are kept unless you use `DISTINCT`. Removing them by default would cost extra work.
- **Aggregates:** `AVG`, `MIN`, `MAX`, `SUM`, `COUNT`, mostly in the `SELECT` list.
  - `COUNT(*)`, `COUNT(col)` and `COUNT(1)` all count rows (`COUNT(col)` skips NULLs); `COUNT(DISTINCT …)`.
  - A non-aggregated column in the output must be in `GROUP BY`. Otherwise its value is undefined; SQL:2023 adds `ANY_VALUE()` to pick one on purpose.
- **GROUP BY + HAVING:** `HAVING` filters groups after aggregation; `WHERE` filters rows before. Standard SQL repeats the aggregate in `HAVING` instead of using its alias.
- **GROUPING SETS:** several groupings in one query and one scan, instead of a `UNION` of separate queries.
- **Strings:** the standard says case-sensitive, single quotes only. `LIKE` with `%` (any substring) and `_` (one character); `||` concatenates; `SIMILAR TO` for regex.
- **Output redirection:** `SELECT … INTO newtable` creates a table; `INSERT INTO t (SELECT …)` fills an existing one.
- **Output control:** `ORDER BY … ASC/DESC` (several keys break ties, expressions allowed); `LIMIT n OFFSET m`. Without `ORDER BY`, `LIMIT` can return different rows each time.
- **Window functions:** `ROW_NUMBER()`, `RANK()` `OVER (PARTITION BY … ORDER BY …)`. They compute over related rows without collapsing them into one row. The table is partitioned, each partition sorted, then each row gets a value. `RANK` is computed after the window's sort.
- **Nested queries and CTEs:**
  - `IN` (= `ANY`), `EXISTS`, `ANY`, `ALL`. The inner query can see the outer query's columns, not the other way round.
  - `NOT EXISTS` finds rows with no match (courses with no students).
  - `WITH` names a sub-query. `WITH RECURSIVE` handles trees and graphs, and makes SQL Turing-complete.
- **LATERAL joins:** a nested query in `FROM` can use columns of the tables before it, like a for-loop that runs a query per row.

### 3.2 Storage (L03, L05)
> **Source:** [L03 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) · [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) (+ the slides with the same numbers)

- **Disk-oriented DBMS:** the database lives on disk; the **buffer pool** brings pages into memory when they're needed. The **execution engine** asks the buffer pool for a page and gets back a pointer to it in memory.
- **Storage hierarchy:**
  - **Volatile** ("memory", DRAM): fast, byte-addressable, lost on power loss.
  - **Non-volatile** ("disk", SSD/HDD): block-addressable (to read one byte, load its 4 KB page), survives power loss, better at sequential access.
  - Scale: if an L1 cache read took 1 second, an SSD read would take 4.4 hours and an HDD read 3.3 weeks.
- **Sequential vs random I/O:** sequential is much faster, so storage design tries to turn random I/O into sequential I/O. Some systems buffer random writes and write them out in the background.
- **Design goal:** manage databases bigger than memory without stalling on disk I/O; keep running other queries while one waits for disk.
- **Why not mmap:**
  - the OS can flush dirty pages at any time, which is unsafe for transactions;
  - I/O stalls on page faults (the thread blocks);
  - hard error handling (SIGBUS);
  - TLB shootdowns.
  - `madvise` (hint which pages you'll read), `mlock` (don't swap these out) and `msync` (flush now) help, but it's as much work as doing it yourself.
  - "The OS is not your friend."
- **File storage:** the database is one or more files (SQLite: one file) in a DBMS-specific format, or an open format any DBMS can read. The OS knows nothing about what's inside. The **storage manager** sees the files as a collection of pages and tracks free space. Replication is not its job (RAID below it, or logical copies above it).
- **Database pages:** fixed-size blocks holding tuples, index entries or other data (most systems don't mix types in one page). Some systems need pages to be **self-contained**. An indirection layer maps page ID → file + offset.
- **Three kinds of page:** hardware page (usually 4 KB), OS page (4 KB), database page (1–16 KB). Read-heavy systems use bigger pages (1 MB+), write-heavy ones 4–16 KB.
- **Torn pages:** the device only guarantees an atomic write of one hardware page. A database page bigger than that can be half-written in a crash, so the DBMS needs extra protection.
- **Heap file + page directory:** an unordered set of pages; the page directory maps page IDs to where they are in the files, and tracks free space per page, free pages and page types. It must stay in sync with the pages.
- **Page header:** page size, checksum, DBMS version, transaction visibility, self-containment.
- **Three page layouts:** tuple-oriented (slotted pages), log-structured, index-organized.
- **Slotted page:** a header and a slot array at the start, tuples filled from the end. The page is full when they meet. The slot array maps slot numbers to offsets, so tuples can move inside the page.
- **Record ID:** (file ID, page ID, slot number), which finds one tuple; usually 4–10 bytes and not stored in the tuple. Applications must not rely on it, because it's a physical location.
- **Tuple layout:**
  - A **header** with visibility info for concurrency control and a **NULL bitmap**. No schema info; that's in the catalog.
  - Then the attribute data, usually in `CREATE TABLE` order and **word-aligned** (padded).
  - Most DBMSs don't let a tuple be bigger than a page.
- **Data representation:**
  - Integers: native C/C++ format.
  - `FLOAT`/`REAL`: IEEE-754, fast but inexact. `NUMERIC`/`DECIMAL`: fixed-point, exact, slower.
  - `VARCHAR`/`BLOB`: a length header plus the bytes. A value too big for the page goes to **overflow pages** (the tuple keeps a record ID to them). **External storage** keeps the value in a separate file, with no durability or transaction guarantees.
  - `TIMESTAMP`: a 32/64-bit integer of micro- or milliseconds since the Unix epoch.
- **Storing NULLs:**
  - a NULL bitmap in the tuple header (most common in row stores);
  - a special value such as `INT32_MIN` (most common in column stores);
  - a flag per attribute (bad: the flag needs padding).
- **Tuple-oriented operations:**
  - **Read:** page directory → fetch the page into the buffer pool → slot array → offset.
  - **Insert:** find a page with a free slot, check the free space, else another or a new page.
  - **Update:** in place if it fits; otherwise delete and re-insert as a new tuple.
- **Problems with tuple-oriented storage:** fragmentation, useless I/O (a whole page to change one tuple), random I/O (20 tuples can mean 20 different places). Some systems (HDFS, Google Colossus, object stores) don't allow in-place updates at all, which is what log-structured storage fits.
- **Log-structured storage (LSM):**
  - Based on log-structured file systems and LSM trees. Each record is the tuple's ID, the operation (`PUT`/`DELETE`) and, for a PUT, the contents. Only the latest record per key counts.
  - Writes go to an in-memory **MemTable**. When it's full, it's sorted by key and written to disk as an immutable **SSTable**, sequentially.
  - Reads check the MemTable, then SSTables from newest to oldest (binary search in each). An in-memory **summary table** with min/max keys per SSTable and **Bloom filters** per level lets reads skip files.
- **Compaction:** a sort-merge of SSTables that keeps only the newest change for each key. It saves space and speeds up reads.
  - **Level compaction:** level 0 → 1 → 2, non-overlapping key ranges inside a level, except level 0.
  - **Universal compaction:** all SSTables in one level; it runs when size thresholds are met or too many SSTables overlap.
- **LSM trade-offs:** fast sequential writes (good for append-only and cloud storage), slower reads, expensive compaction, **write amplification** (one logical write becomes several physical writes during compaction).
- **Index-organized storage:** slotted pages and log-structured storage both need a separate index, because the table is unsorted. Here the tuples are stored inside the index itself (B+Tree, skip list, trie), sorted by key in slotted-page-like pages.

### 3.3 Buffer pool (L04, L05)
> **Source:** [L04 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) · [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) §1 (buffer pool optimizations) · [L04 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/04-bufferpool.pdf)

- **Goal:** the rest of the DBMS should see the whole database as if it were in memory, even when it's bigger than memory.
  - **Spatial control:** where pages sit on disk; keep pages used together close together.
  - **Temporal control:** when to read pages in and write them out, to minimize stalls.
- **Buffer pool:** an array of fixed-size **frames** in memory. It's a **write-back** cache: dirty pages are written later, not on every change (write-through would write at once).
  - The memory also holds tuples and indexes, sort and join buffers, query and dictionary caches, and log buffers (some of these can just use `malloc`).
  - The **page table** maps page ID → frame. It lives in memory only (a hash table).
  - The **page directory** maps page ID → place on disk. It's stored on disk, so it survives a restart, and is usually cached in memory.
- **Pin count:** how many threads are using a page right now. A pinned page can't be evicted, but pinning doesn't stop other threads from reading it. If every page is pinned and the pool is full, the result is an out-of-memory error.
- **Dirty flag:** the page was changed, so it must be written to disk before eviction.
  - **Fast path:** a clean page is just dropped. **Slow path:** a dirty page is written out first.
  - **Background writing:** the DBMS walks the page table and writes dirty pages out early, then evicts them or clears the flag, so eviction stays fast.
- **Locks vs latches:**
  - **Locks** protect database contents (tuples, tables) between transactions, are visible to users, and can roll back.
  - **Latches** protect internal data structures for the length of one operation. They're mutexes and don't roll back.
- **Why the DBMS beats the OS:** it can flush dirty pages in the right order, prefetch with knowledge of the query plan, pick better replacement policies, and schedule its own threads.
- **Replacement policies** (goals: correct, accurate, fast, little metadata):
  - **LRU:** evict the page used longest ago. Exact timestamps cost too much.
  - **CLOCK:** an LRU approximation with one reference bit per page and a "clock hand". The hand clears 1s and evicts the first 0.
  - **Sequential flooding:** a big scan pushes useful pages out of LRU/CLOCK. For scans, the most recently used page is often the best one to evict.
  - **LFU:** evict the lowest access count; ignores time, so stale pages build up.
  - **LRU-K:** keeps the last K access times and predicts the next access from the gaps between them. Needs a **ghost cache** of recently evicted pages.
  - **MySQL's young/old lists:** an approximation of LRU-2. New pages go to the head of the old list; a page hit again moves to the young list; evict from the tail of the old list.
  - **Localization:** choose victims per query or transaction, so one query can't pollute the pool for everyone.
  - **Priority hints:** queries tell the pool which pages matter.
  - **ARC (IBM):** balances recency (T1, pages seen once) against frequency (T2, seen at least twice), with ghost lists. A target size p adapts to the workload.
- **Disk I/O scheduling:** the OS reorders and batches I/O but doesn't know what matters. The DBMS keeps its own queues and ranks requests by sequential vs random, critical path vs background, table vs index vs log, transaction and user SLA.
- **Optimizations:**
  - **Multiple buffer pools** (per database, table or page type), each with its own policy, which also cuts latch contention. Map pages to pools with object IDs or by hashing the page ID.
  - **Pre-fetching** from the query plan: the next pages of a scan, or the next *logical* leaf pages of an index scan.
  - **Scan sharing** (synchronized scans): a second query joins a scan that's already running and finishes the part it missed at the end.
  - **Direct I/O (`O_DIRECT`)** to skip the OS page cache, avoiding double copies and a second eviction policy. PostgreSQL is the exception: it uses the OS cache.
  - Warning: `fsync` errors can be silent, and on error the page gets marked clean.

### 3.4 Storage models and compression (L06, HW2)
> **Source:** [L06 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/06-storage3.pdf) · [L06 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/06-storage3.pdf) · [HW2](https://15445.courses.cs.cmu.edu/fall2025/files/hw2-clean.pdf) and its [official solutions](https://15445.courses.cs.cmu.edu/fall2025/files/hw2-sols.pdf): Q1 slotted pages vs log-structured, Q2 storage models, Q3 compression.

- **Workloads:**
  - **OLTP:** short, simple, repetitive queries on one entity; write-heavy (the Amazon storefront).
  - **OLAP:** long, complex queries with aggregates over large parts of the data; read-heavy (personalized ads).
  - **HTAP:** both on the same database.
- **NSM (row store):** all attributes of a tuple together in a slotted page (pages are a multiple of 4 KB).
  - Good for OLTP: one fetch gets the whole tuple; fast insert, update, delete; can cluster through index-organized storage.
  - Bad at scans of a few columns; poor memory locality; hard to compress, because a page mixes value domains.
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
- **Why compress:** disk I/O is (almost) always the bottleneck, so fitting more tuples per page wins, at some CPU cost. In-memory DBMSs compress to need less DRAM, trading speed against ratio.
- **Compression goals:**
  - fixed-length values (so offsets and word alignment still work; variable-length data goes in a separate pool);
  - **late materialization** (decompress as late as possible);
  - lossless (lossy compression is the application's job).
- **Granularity:** block, tuple (NSM only), attribute, or columnar (DSM only).
- **Naive compression:**
  - What it is: general-purpose algorithms (LZ4, Snappy, Zstd…) on whole pages, padded to a power of 2 KB. Engineers pick faster algorithms over better ratios.
  - Cost: every read or update must decompress first (blind writes don't); MySQL keeps compressed pages plus a "mod log", and splits tables into small chunks.
  - Limit: the algorithm doesn't know what the data means, so late materialization isn't possible.
- **Columnar schemes** (the DBMS can work on the data without fully decompressing it):
  - **RLE:** (value, offset, length) triplets. Sorting first makes the runs longer.
  - **Bit packing:** fewer bits per value. **Mostly encoding** adds a marker and a lookup table for the few values that are too big.
  - **Bitmap:** one bitmap per distinct value, split into chunks. Only for low cardinality, or the bitmaps get bigger than the data; Roaring bitmaps for sparse ones.
  - **Delta:** store the differences (the base value inline or in a lookup table), and RLE them too.
  - **Dictionary:** the most common scheme. Codes map to values, and it must support fast encoding and decoding, so no hash functions. It's **order-preserving**, so range queries and `LIKE 'And%'` can run on the codes.
- **What HW2 drilled** (the official answers):
  - **Log-structured problems:** write amplification from compaction. Reading several pages to find a tuple is sequential I/O, not random.
  - **Slotted-page problems:** fragmentation, more random reads and more random writes.
  - **Both:** support variable-length tuples. With no indexes and an append-only workload, slotted pages behave like log-structured storage. Both benefit from maintenance (compaction) after many updates and deletes.
  - **Counting page reads** (20,000 tuples in 200 pages, 4 equal-width columns, no index, worst-case data):
    - A filter-and-aggregate scan reads all 200 pages in NSM, but only the 2 needed columns in DSM: 2 × 50 = 100 pages.
    - A lookup by key reads 1 to 200 pages in NSM. In DSM: the key column (1 to 50 pages) plus the 2 output columns at the same offsets (2 or 4 pages), so 3 to 54.
    - Pages already in the buffer pool aren't read again: a sub-query on the same column costs nothing extra.
  - **Dictionary codes:** any codes that keep the values' sort order work for range queries; the numbers themselves don't matter. Point lookups alone don't need order-preserving codes.
  - **Sorting first** helps only **RLE** (longer runs) and **delta** (smaller gaps).
  - **Other traps:** delta is bad for large text; bitmaps on high-cardinality columns make every insert or update touch many bitmaps; an update whose value is already in the dictionary needs no re-encoding; RLE suits low-cardinality integer columns.

### 3.5 Hash tables (L07)
> **Source:** [L07 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/07-hashtables.pdf) · [L07 slides](https://15445.courses.cs.cmu.edu/fall2025/slides/07-hashtables.pdf)

- **Where a DBMS uses data structures:**
  - internal metadata (page tables, page directories);
  - core tuple storage;
  - temporary structures (a hash table for a join);
  - table indexes.
  - Two design decisions: data organization and concurrency.
- **Hash table:**
  - Average O(1), worst case O(n); O(n) space; no ordering, so no range scans. Constant factors still matter in practice.
  - Two parts: a **hash function** and a **hashing scheme** for collisions. The trade-off: a bigger table means fewer collisions; a smaller one means more work per collision.
- **Hash function:** deterministic, fast with a low collision rate; never cryptographic (SHA-256 is wasted work, since the keys never leave the DBMS). The state of the art is **XXHash3**.
- **Static hashing:** the size is fixed in advance. When it's full, rebuild a bigger table (usually 2×). Use about 2× as many slots as expected keys. It assumes things that rarely hold: a known number of keys, unique keys, a perfect hash function.
- **Linear probing:** a circular array of slots; on a collision, scan forward to the next free slot. It's the simplest and usually fastest scheme (no pointers, cache-friendly), but suffers **primary clustering** at high load.
  - **Lookup:** scan from the hashed slot until the key, an empty slot, or a full lap. So each slot stores the key as well as the value.
  - **Delete:** use **tombstones** (lookups keep scanning; inserts can reuse them), or shift entries back (rarely done, expensive).
  - **Keys and values:** fixed-length ones go in the slot (optionally with the hash, for faster comparisons). Variable-length ones go in a separate table, and the slot stores the hash and a record ID.
  - **Non-unique keys:** a separate value list, or redundant keys (more common).
  - **Optimizations:** specialized tables per key type or size; tombstone and empty-slot metadata in a separate bitmap; a **version counter** so the whole table can be cleared at once by bumping it.
  - **State of the art:** Google's `absl::flat_hash_map`.
- **Cuckoo hashing:** several hash functions (the same algorithm with different seeds); in practice, several positions in one table.
  - Insert into a free slot, or evict the old entry and rehash it elsewhere.
  - A cycle means a rebuild, usually with a bigger table.
  - O(1) lookups and deletes; inserts can cost more.
- **Dynamic hashing:** grows (and shrinks) without a full rebuild.
  - **Chained:** a linked list of buckets per slot; the most common dynamic scheme.
  - **Extendible:** the slot array is indexed by the hash's top bits; several slots can share one bucket. Global and local depth count those bits. Split only the full bucket, and double the slot array only when the local depth equals the global depth.
  - **Linear hashing:** a **split pointer**. Any overflow splits the bucket *at the pointer*, using a second hash function (key % 2n). Keys that land below the pointer use the new function. When the pointer reaches the end, the old function is dropped. The table can also shrink. It grows one bucket at a time, never a full rebuild.

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
> **Source:** [Processes](../Operating%20Systems/Processes.md) · [Threads](../Operating%20Systems/Threads.md) · [Thread synchronization](../Operating%20Systems/Thread-Synchronization.md) · [Scheduling](../Operating%20Systems/Scheduling.md) · [Memory management](../Operating%20Systems/Memory-Management.md) (file systems are in §3.8)

- **Program vs process:** a program is a file on disk; a process is a running copy of it, with state. One program can have many processes.
- **Process:** a running program with its own address space. The OS tracks it in a **PCB** (process control block: PID, state, program counter, registers, memory info, open files, scheduling info, parent PID).
- **Memory layout**, low to high addresses: **text** (read-only code), **data** (initialized globals), **BSS** (zeroed globals), **heap** (grows up), **stack** (grows down).
- **States:** new → ready → running → waiting → terminated.
- **`fork` + `exec`:** `fork` copies the process (copy-on-write); `exec` replaces the program; the parent `wait`s.
- **Context switch:** save one task's registers and state, load another's. It's pure overhead.
- **IPC:** pipes (one-way), named pipes (FIFOs), message queues, shared memory (fastest, needs locking), sockets (even across machines), signals (`SIGTERM`).
- **Zombie:** finished, but the parent hasn't called `wait` yet. **Orphan:** the parent died, so init/systemd adopts it.
- **Thread:** a flow of execution inside a process.
  - Threads **share** the code, heap, globals and open files.
  - Each one **keeps its own** stack, registers and program counter.
- **Threads vs processes:** threads are cheaper to create and switch (same memory map) and talk through shared variables. Processes are isolated: a crashing thread kills the whole process, a crashing process doesn't (Chrome uses a process per tab).
- **Modern C++:** `std::jthread` joins itself automatically; `std::stop_token` asks a thread to stop politely.
- **User threads vs kernel threads:** 1:1 (`std::thread`), N:1 (old green threads) and M:N (Go goroutines, Rust Tokio).
- **Thread pool:** a fixed set of workers taking tasks from a queue.
- **Why threads, and the dangers:** parallelism, responsiveness, cheap sharing; but race conditions, **deadlock**, starvation and heisenbugs. Find races with ThreadSanitizer.
- **Race condition:** the result depends on timing. A **critical section** is code that only one thread may run at a time. A correct solution gives mutual exclusion, progress and bounded waiting (no starvation).
- **Mutex:** one owner at a time; only the owner unlocks it.
  - Use RAII guards: `std::scoped_lock` by default (it locks several mutexes at once without deadlock), `std::unique_lock` with condition variables.
  - A **reader–writer lock** (`std::shared_mutex`) allows many readers or one writer.
  - Pitfalls: keep critical sections short (no I/O inside), always lock in the same order, and don't lock the same mutex twice (`recursive_mutex` is a design smell).
- **Semaphore:** a counter with no owner. `acquire` waits while it's 0. It limits N users (`std::counting_semaphore`), or a binary semaphore signals "go" between threads. Wrap it in RAII so a permit isn't leaked on an error path.
- **Monitor:** a mutex plus a **condition variable**. Always wait in a loop (or with a predicate) because of **spurious wake-ups**. Change the state while holding the mutex, or the wake-up can be lost. The classic example is the bounded producer/consumer queue.
- **Atomics:** lock-free updates of single values (`std::atomic`, `compare_exchange`). `if (x == 0) x = 1;` is still two steps, so use CAS. For invariants across several variables, use a mutex.
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
  - Virtual memory is split into pages and RAM into frames of the same size (usually 4 KB). Pages map to frames through a per-process page table.
  - Address = (page number, offset); with 4 KB pages, address 8200 is page 2, offset 8.
  - The MMU translates addresses, and the TLB caches the translations.
  - A **page fault** loads the missing page.
  - Paging removes **external** fragmentation; **internal** fragmentation is the unused end of the last page.
- **Page replacement:**
  - **FIFO:** suffers Bélády's anomaly.
  - **LRU:** close to optimal, but costly to do exactly.
  - **Clock:** a reference bit plus a hand; what real OSes use.
  - **Optimal:** a theoretical bound.
  - **Thrashing:** the working sets don't fit in RAM.
- **`mmap`:** a file appears as memory, loaded lazily on page faults, with zero copies. Errors arrive as `SIGBUS`. Call `msync` for durability.
- **Buddy allocator:** power-of-two blocks, split to allocate, merge with the buddy at `addr ^ size`. Linux uses it for page frames, at the cost of internal fragmentation.

### 3.8 File systems (repo guide)
> **Source:** [File systems](../Operating%20Systems/File-Systems.md)

- **Basics:**
  - A file system turns raw blocks (usually 4 KB) into named files and folders.
  - An **inode** holds a file's metadata (size, owner, permissions, timestamps) and pointers to its data blocks. **The name isn't in the inode.**
  - A **directory** is a file of (name, inode number) pairs. Path lookup walks from the root inode one name at a time.
  - **Hard link:** another name for the same inode. **Symlink:** a small file holding a path.
- **Journaling (ext3/ext4):**
  - Write the planned changes to a journal, write a **commit record**, then **checkpoint** (apply them in place) and free the entry.
  - After a crash, replay committed transactions and drop uncommitted ones. Recovery takes seconds instead of an hours-long `fsck`.
  - **Modes:** `journal` (metadata and data; safest, slowest), `ordered` (the default: metadata only, but data is written before its metadata commits), `writeback` (metadata only, no ordering; fastest, can leave garbage in files).
  - **ext4 adds:** extents (one entry for a range of blocks), delayed allocation (less fragmentation), journal checksums, bigger limits, faster `fsck`.
  - **Copy-on-write** file systems (Btrfs, ZFS, APFS) never overwrite in place instead.
  - It's the same write-ahead logging idea as in databases. Journaling doesn't make your data durable: the application still calls `fsync`.
- **Network file systems (NFS, SMB):**
  - The server exports a directory, the client mounts it, and file calls become RPCs. Clients cache, so **cache consistency** is the hard part.
  - **NFS** (Unix): v3 stateless, v4 stateful with locks and delegations; **close-to-open** consistency (flush on `close`, re-check on `open`); UIDs or Kerberos.
  - **SMB** (Windows): stateful sessions, locking, **oplocks/leases** that the server revokes when another client wants the file; Active Directory / Kerberos.
  - Pitfall: two clients writing the same file can overwrite each other, and the network can drop mid-write.
- **Encryption at rest:**
  - **Full-disk** (LUKS/dm-crypt, BitLocker, FileVault): every block, unlocked once at boot. **File-based** (fscrypt on Android, APFS): per-file or per-directory keys, which also separate users.
  - **AES-XTS** encrypts each sector on its own, so random access still works.
  - **Key hierarchy:** password → slow KDF (PBKDF2/Argon2) → key-encryption key → the random data key. Changing the password re-encrypts only the small data key.
  - It protects a stolen device, not a running, unlocked one. Never roll your own cipher, and never store the key next to the data.
- **Distributed file systems:**
  - **HDFS:** 128 MB blocks, 3 replicas across racks (rack awareness). A central **NameNode** holds the metadata (a single point of failure without HA mode); **DataNodes** hold blocks. Built for write-once, read-many big sequential reads; bad for many small files (each costs NameNode memory).
  - **Ceph:** object (RADOS, S3 gateway), block (RBD) and file (CephFS) storage. **CRUSH** computes where an object lives from its name and the cluster map, so there's no central lookup. Data sits on **OSDs** (about one per disk); **monitors** keep the cluster map; replication or **erasure coding**.
  - Replicas must sit in different failure domains (racks, zones).

### 3.9 Raft (paper §1–§8, Students' Guide)
> **Source:** [Raft paper](https://raft.github.io/raft.pdf) §1–8 (replicated state machine, roles, terms, election, replication, safety, membership changes, log compaction, client interaction) · [Students' Guide to Raft](https://thesquareplanet.com/blog/students-guide-to-raft/)

- **Replicated state machine:** every node applies the same log of commands in the same order, so all nodes end up in the same state.
- **Raft roles:** follower, candidate, leader. Time is split into **terms**, and each term has at most one leader. Terms act as a logical clock: a server that sees a higher term updates its own and becomes a follower; requests with an old term are rejected.
- **State (Figure 2):**
  - Persistent, saved before answering an RPC: `currentTerm`, `votedFor`, `log[]`.
  - Volatile on every server: `commitIndex`, `lastApplied`. On the leader: `nextIndex[]` and `matchIndex[]` per follower.
  - Two RPCs: **RequestVote** and **AppendEntries** (also the heartbeat).
- **Leader election:**
  - A follower that hears nothing for a **random election timeout** becomes a candidate, increments its term, votes for itself and asks for votes.
  - Each server gives one vote per term, first come first served. The candidate wins with a **majority**, or steps down if a valid leader appears.
  - The random timeouts stop split votes from repeating.
- **Log replication:**
  - The leader appends an entry and sends **AppendEntries** to the followers, with the index and term of the entry before the new ones (the **consistency check**).
  - The entry is **committed** once it's stored on a **majority**; then it can be applied.
  - On a rejected check, the leader decrements `nextIndex` and retries until the logs match; then the follower's conflicting entries are overwritten with the leader's.
- **Safety:**
  - **Election safety:** at most one leader per term.
  - **Leader append-only:** a leader never overwrites or deletes its own entries.
  - **Log matching:** same index and term means the same entry and the same history before it.
  - **Election restriction:** a candidate's log must be at least as up to date as the voter's (compare the last entry's term, then the length).
  - **Leader completeness:** so **a leader always has every committed entry**.
  - **State machine safety:** no two servers apply different commands at the same index.
  - **Commit rule (§5.4.2):** a leader commits an entry from an earlier term only indirectly, by committing one from its own term.
- **Follower and candidate crashes (§5.5):** the leader just retries forever. RPCs are idempotent, so a repeated one does no harm.
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

### 3.10 Replication (DDIA ch. 5)
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

### 3.11 Consistency and consensus (DDIA ch. 9, Jepsen)
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

### 3.12 Problem solving (CF Round 1074, Div. 4)
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
| Storage models, compression, hash tables (L06, L07) | Not tested yet | Finished after the exam. HW2 (storage models, compression) was self-graded with the official solutions |
| Project 0: Count-Min Sketch | Not tested yet | Part 3 skipped |
| OS: processes, threads, synchronization | **Strong** (10/10) | |
| OS: scheduling, memory management, file systems | Not tested yet | Finished after the exam |
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
