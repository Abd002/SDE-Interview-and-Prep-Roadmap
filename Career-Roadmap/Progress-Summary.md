# Who I am, what I've done, what I'm doing now, and what I know

**Updated:** 12 Nov 2026.

**What it's for:** read it before a call, an interview or a networking chat, so you can introduce yourself (your whole career, not only the current study), say what you're working on, and explain what you've learned.

**Career facts** come from [CV/facts.md](CV/facts.md), the single source of truth for every CV and interview answer.

**Where it comes from:** the 40 steps marked **Done** in the Notion study plan ("Study Plan — Step by Step"). Every line in §3 was checked against the **main resource of its step** in the plan (the step's Link and Notes), linked under each heading. On 20 Oct 2026 the whole of §3 was re-checked line by line against the full CMU lecture notes L01–L07, the HW2 official solutions and every repo guide, and the concepts that had been left out were added. For DDIA, ch. 5 was checked against the free official excerpt. Ch. 9 has no free copy, so it was checked against the author's own lecture notes on the same topics. On 5 Nov 2026 the 8 newly finished steps were added (§3.13–§3.17): deadlocks, DNS and HTTP were checked against the repo guides, the Tokio part against the official tutorial pages, and DDIA ch. 6 against the book's chapter structure (the free excerpt has only chapters 3, 5 and 8). On 12 Nov 2026 the next 5 finished steps were added (§3.18–§3.22): the P1 Buffer Pool spec and ARC were checked against the official Fall 2025 project page, and routing, Git/Bitbucket, programming paradigms and OOP against the repo guides. The "How well I know it" table (§4) is filled in from the [knowledge check](Knowledge-Check.md).

**Diagrams for quick revision:** [DBMS layers, L01–L07](../Study-Plan/Revision-Maps/DBMS-Layers-L01-L07.md) · [DDIA ch. 5, Replication](../Study-Plan/Revision-Maps/DDIA-Ch5-Replication.md) · [DDIA ch. 9, Consistency and Consensus](../Study-Plan/Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md).

---

## 1. Say it out loud

Two different questions, two different answers:
- **"Tell me about yourself"** → your **whole career**: who you are, what you've built, what you're doing now, what you want (§1.1).
- **"What are you doing these days?"** → only the **current** work and study (§1.2).

The order for "tell me about yourself" is always **who I am → what I've built → what I'm doing now → what I want next**. Same text in the [Interview Talking Guide §2](CV/Interview-Talking-Guide.md#2-tell-me-about-yourself).

### 1.1 "Tell me about yourself" (the whole career)

#### 30 seconds (recruiter, phone screen, networking)
> I'm Abdelrahman Khalifa, a computer and systems engineer from Minia University, Very Good with Honors, 2025. I work close to the system: **Rust, C and modern C++, on Linux and microcontrollers**.
>
> This year I was a **Google Summer of Code 2026 contributor with The Linux Foundation's OpenPrinting project**: I built the Printers page for the COSMIC desktop's Settings in Rust and got **11 pull requests merged** upstream in cups-rs and libcups. I'm also an **embedded software engineer at EKSON**, part-time, where I own the software of a motion simulator: the Zephyr firmware, the desktop app and the CI.
>
> I'm a **Codeforces Expert** and a **4-time ECPC finalist**. Now I'm going deeper into databases and distributed systems, and I'm looking for a **full-time systems or embedded role**.

#### 60 seconds (start of a technical interview)
> I'm a computer and systems engineer from Minia University, and I like working close to the system: Rust, C and modern C++, on Linux and microcontrollers.
>
> **My most recent work** was Google Summer of Code 2026 with The Linux Foundation's OpenPrinting project, May to October. I built the Printers page in COSMIC Settings: you see your printers, their ink and status, manage the print queue and add old printers through Printer Applications. Under it are five Rust crates, and the C library code runs in a separate process behind a varlink service, so a crash there can't take down Settings. Along the way I got 11 PRs merged upstream in cups-rs and libcups, including crash fixes in libcups's DNS-SD code. I passed the final evaluation and I still maintain the project.
>
> **At EKSON**, since August 2025, I work on pneumatic motion simulators. I wrote the ESP32-S3 firmware and moved it from FreeRTOS to Zephyr, with PID control, an IMU and safety stops. I built the PyQt5 control app and cut its CPU use and latency by about 40% with asyncio, and I added remote control and firmware updates through a Node.js backend.
>
> **Before that**, I did an Embedded Linux internship at Orange Digital Center (Yocto, Buildroot, a kernel module; 100% in the final evaluation), and my first open-source contribution, to Zephyr RTOS. I'm a Codeforces Expert and was an ECPC finalist four times.
>
> **Now** I'm studying CMU's database systems course and preparing a Raft-based key-value store in Rust, and I'm looking for a full-time systems or embedded role.

#### 2 minutes ("walk me through your background")
Tell it in order, one or two sentences per stage:

1. **University and competitive programming (2020–2025).** "I studied Computer and Systems Engineering at Minia University and finished Very Good with Honors. Competitive programming got me into thinking about efficiency: I'm a Codeforces Expert, I reached the ECPC finals four years in a row, 2021 to 2024, and I taught problem solving in C++ to more than 20 people in my local ICPC community. I was also treasurer of our IEEE student branch, with a budget over 10,000 dollars."
2. **Embedded projects at university.** "I built FreeRTOS projects on a Tiva C, such as a seat heater controller, and AUTOSAR-style drivers. My graduation project was an AUTOSAR-based V2X vehicle on STM32. My part was the bootloader and firmware updates: a gateway downloads the image and sends it over UART with UDS-style services, and the STM32 checks it with the hardware CRC before jumping to it. We tried CAN first and it failed; that taught me a lot."
3. **Orange Digital Center (Dec 2024 – Jan 2025).** "An Embedded Linux internship: custom Linux images with Yocto and Buildroot, device trees, and a Linux kernel module, a character device that exports process data to user space on an ARM board in QEMU. I scored 100% in the final evaluation."
4. **First open source (March 2025).** "My first contribution was to Zephyr RTOS: the `IP_MULTICAST_LOOP` socket option for IPv4, across six networking modules. Later, in December 2025, I got changes merged in Rust Clippy and in the Boa JavaScript engine."
5. **EKSON (Aug 2025 – now, part-time, also during my military service).** "I own the software of the motion simulators: Zephyr firmware on the ESP32-S3 with PID control, the IMU and safety stops; the PyQt5 desktop app, where asyncio cut CPU use and latency by about 40%; remote control and firmware updates through a Node.js and MongoDB backend; and CI with GitHub Actions."
6. **Google Summer of Code 2026 (May – Oct 2026).** "With The Linux Foundation's OpenPrinting project I built the Printers page for COSMIC Settings in Rust, five crates with the backend isolated behind varlink, and got 11 PRs merged in cups-rs and libcups. I passed the final evaluation and I still maintain it."
7. **Now.** "I'm studying CMU 15-445 on my own (lectures 1 to 7, two homeworks and project 0 done, now the buffer pool project), reading Raft and *Designing Data-Intensive Applications* for my own Raft key-value store in Rust, and reviewing OS, networking and C++ fundamentals."
8. **What I want.** "A full-time systems, Rust/Linux or embedded role in a team with senior engineers, where I can own a component and grow."

**Military service:** completed (say it if an Egyptian employer asks).

### 1.2 "What are you doing these days?" (only the current work)

#### 30 seconds
> Right now I'm doing three things, next to my part-time work at EKSON.
>
> First, I'm taking Carnegie Mellon's **database systems course (CMU 15-445)** on my own. I've finished the first seven lectures (relational model, SQL, storage, the buffer pool, storage models and compression, hash tables), homework 1 in SQL, homework 2 on storage and compression, and **project 0**, a thread-safe **Count-Min Sketch** in C++ that passes the course's autograder. Now I'm on **project 1, the buffer pool manager**: I've worked through its **ARC** replacement policy on paper and I'm starting the code.
>
> Second, I'm preparing my next big project: a **distributed key-value store in Rust built on Raft**. I've read the whole Raft paper, and the replication, partitioning, and consistency and consensus chapters of *Designing Data-Intensive Applications*. I've also worked through the **Tokio** tutorial, the async runtime I'll build it on.
>
> Third, I keep my fundamentals sharp: **Codeforces virtual contests**, the whole **OS** track, networking (**DNS, HTTP, routing**), **Git**, and programming paradigms and **OOP**. And I'm applying for full-time roles.

#### 60 seconds: add the "why"
Use the 30-second answer, then add:
> I picked databases and distributed systems because they connect everything I already do: low-level C++ and Rust, concurrency, and systems that must not lose data. The course gives me the storage engine side: pages, buffer pools, indexes. The Raft project gives me the distributed side: replication, consensus and testing under failures. And everything I learn goes into the key-value store.

#### If they ask "what's the plan after that?"
> - **CMU:** finish project 1 (ARC replacer, disk scheduler, buffer pool manager). Then indexes and B+Trees, query execution, concurrency control and recovery.
> - **Key-value store:** first a storage engine (write-ahead log + LSM tree), then Raft, then sharding.
> - **Goal:** a finished, tested project I can show, and a full-time systems/infrastructure role.

---

## 2. What I've done

### 2.1 Career so far (from [facts.md](CV/facts.md))

| When | What | The one line to remember |
|---|---|---|
| 2020 – 2025 | **B.Sc. Computer and Systems Engineering**, Minia University | Very Good (84.6%) with Honors |
| 2021 – 2024 | **Competitive programming** | Codeforces Expert (_Khalifa); 4-time ECPC finalist; taught C++ problem solving to 20+ people in the local ICPC community |
| University | **IEEE student branch Treasurer** | Managed a budget of more than $10k |
| University | **Embedded projects** | FreeRTOS seat heater (Tiva C), AUTOSAR PORT/GPIO drivers, door locker (2 × ATmega32 over UART), Verilog traffic light, IoT TCP client-server on QEMU ARM + Raspberry Pi |
| 2024 – 2025 | **Graduation project:** AUTOSAR V2X vehicle on STM32 | His part: bootloader + firmware updates (UDS-style services over UART, hardware CRC check, version in flash); CAN failed, a real lesson |
| Dec 2024 – Jan 2025 | **Orange Digital Center**, Embedded Linux Systems Intern | Yocto, Buildroot, device trees, a kernel module (Kernel Monitor); 100% in the final evaluation |
| Mar 2025 | **First open-source contribution:** Zephyr RTOS | `IP_MULTICAST_LOOP` for IPv4 in 6 networking modules (merged) |
| Aug 2025 – now | **EKSON**, Embedded Software Engineer (part-time; also during military service, now completed) | Owns the simulator software: Zephyr firmware on ESP32-S3 (PID, IMU, safety stop), PyQt5 app (~40% less CPU/latency with asyncio), Node.js/MongoDB remote control and firmware updates, CI |
| Dec 2025 | **Rust Clippy** and **Boa** | One merged PR in each |
| May – Oct 2026 | **Google Summer of Code 2026 contributor**, The Linux Foundation (OpenPrinting) | Printers page for COSMIC Settings in Rust (5 crates, varlink backend); **11 PRs merged** in cups-rs and libcups; passed the final evaluation; still maintaining it |
| Oct 2026 – now | **Self-study + job search** | CMU 15-445, Raft/DDIA, OS and networking (§2.2); 10 job applications sent by 5 Nov (NXP said no), plus Mercor and micro1 for side income |

### 2.2 What I finished in the study plan (from Notion)

| Area | Done | Step |
|---|---|---|
| **CMU 15-445 lectures** | L01 Relational Model & Algebra · L02 Modern SQL · L03 Database Storage I · L04 Memory & Disk Management · L05 Database Storage II · L06 Storage Models & Compression · L07 Hash Tables | 1, 2, 8, 9, 15, 20, 25 |
| **CMU homework** | HW1 SQL in DuckDB, Q1–Q6, compared with the official solutions · HW2 Storage (slotted pages vs log-structured, storage models, compression), finished and self-graded with the official solutions | 11, 16, 21, 26 |
| **CMU project** | Setup (BusTub, CMake, clang, gdb, Gradescope) · **P0 C++ Primer: Count-Min Sketch**, passing on Gradescope, clang-tidy clean, no memory leaks | 3, 4, 10 |
| **CMU project 1** | **P1 Buffer Pool Manager:** read the whole spec (ARC replacer, disk scheduler, buffer pool manager, page guards) and worked through the **ARC** algorithm on paper | 30 |
| **Operating systems** (repo guides) | Processes · Threads · Thread synchronization (mutexes, semaphores, monitors, atomics) · Scheduling algorithms · Memory management · **Deadlocks** (Coffman conditions, prevention, Banker's algorithm, wait-for graphs, recovery) · File systems (journaling, NFS/SMB, encryption, HDFS/Ceph); the whole OS checklist is done | 5, 17, 22, 27, 32, 36 |
| **Networking** (repo guides) | **DNS** (hierarchy, record types, resolution, caching and TTL) · **HTTP** (requests and responses, methods, status codes, versions, HTTPS) · **Routing algorithms** (longest prefix match, Dijkstra/OSPF, Bellman-Ford/RIP, BGP) | 55, 64, 69 |
| **Version control** (repo guides) | **Git** (three areas, objects and hashes, branches and HEAD, merge vs rebase, remotes, undoing changes, workflows) + the command reference + **Bitbucket** (PRs, merge checks, Pipelines, Jira) | 86 |
| **Programming languages** (repo guides) | **Programming paradigms** (imperative, declarative, functional, OOP, procedural, event-driven, aspect-oriented) · **OOP** (encapsulation, inheritance, polymorphism, abstraction, composition vs inheritance, overriding vs overloading) | 106, 107 |
| **Distributed systems** (flagship prep) | Raft paper §1–§5 + the raft.github.io visualization · Raft §6–§8 + the Students' Guide to Raft · DDIA ch. 9 part 1 (linearizability, ordering) · DDIA ch. 9 part 2 (consensus) + the Jepsen consistency-models map · DDIA ch. 5 (replication) · **DDIA ch. 6 (partitioning)** · **Tokio tutorial** part 1 (spawning, shared state) and part 2 (channels, I/O, framing, `select!`) | 6, 12, 18, 23, 28, 33, 37, 44 |
| **Problem solving** | Codeforces Round 1074 (Div. 4), virtual: A–D | 13 |
| **Career** | LinkedIn update (following CV/LinkedIn.md) · Knight-Hennessy go/no-go decision · Shortlisted 5 P1 companies · Sent the first application (then kept going: 10 sent by 5 Nov) | 7, 14, 29, 38 |

**Skipped on purpose (Ignored):** the four DAAD steps (19, 34, 46, 52; deadline 30 Oct passed), booking IELTS (24), the repo's databases guide (31), contest PDF #2 (45) and the TCP/IP stack guide (50).

**Next in the plan:**
- **Phase 3:** step 35 (P1 Task #1, the ARC replacer in code), 39 (checkpoint review), then lectures L08–L09 (40–41).
- **Deadline:** step 137, the ETH Zurich ESOP application, by **30 Nov**.
- **In parallel:** the new Modern C++ track (steps 185–200), about 2 steps a week.

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

### 3.13 Deadlocks (repo guide)
> **Source:** [Operating Systems/Deadlocks.md](../Operating%20Systems/Deadlocks.md)

- **Deadlock:** a set of threads each waits for something another one in the set holds, so none can continue. Timing-dependent, so tests may never show it.
- **Coffman conditions, all four needed:** mutual exclusion, hold-and-wait, no preemption, circular wait. Break any one and deadlock is impossible.
- **Prevention in practice:**
  - **Lock ordering** (breaks circular wait): give locks a global order, e.g. by address, and always take the lower one first.
  - **Lock all at once** (breaks hold-and-wait): `std::scoped_lock lock(a.m, b.m);` uses a deadlock-avoidance algorithm, so the bank-transfer A→B / B→A case is safe.
  - **Try-lock and back off** (breaks no-preemption): `try_lock`, and on failure release everything and retry.
  - Don't call unknown code (callbacks, virtual functions) while holding a lock.
- **Avoidance: the Banker's algorithm.** Each process declares its maximum need; `Need = Max − Allocation`. Grant a request only if the state stays **safe**: some order exists in which every process can get its maximum, finish and return its resources. **Unsafe means deadlock is possible, not certain.** O(n²·m), rarely used in real OSes because maximum needs are rarely known.
- **Detection: the wait-for graph.** Edge A → B if A waits for something B holds. With single-instance resources a **cycle** means deadlock; find it with DFS in O(V+E) (a node met again while still on the current path). Databases (PostgreSQL, MySQL) do this and abort a victim transaction. With multiple instances a cycle isn't enough; use a Banker-style check.
- **Recovery:** abort all, or abort one victim at a time, or preempt and roll back to a checkpoint. Choose the victim by cost (priority, work done, resources held) and count past aborts so the same one doesn't **starve**.
- **Livelock:** threads keep reacting to each other but make no progress (both step aside the same way). Fix with **random** back-off.
- **Starvation:** one thread never gets the resource. Fix with fair queues or **aging**.
- **"Ostrich" approach:** ignore it and reboot if it happens; what desktop OSes do for general resources.

### 3.14 DNS (repo guide)
> **Source:** [Networking/DNS.md](../Networking/DNS.md)

- **What it is:** a distributed, hierarchical phone book from names to records. Names are read right to left: root → TLD (`.com`) → domain → subdomain; each **zone** is served by its own authoritative name servers.
- **Servers:** root servers (13 named identities, hundreds of machines via anycast) know the TLD servers; TLD servers know each domain's authoritative servers; authoritative servers hold the records.
- **Transport:** UDP port 53, TCP 53 for large answers and zone transfers; privacy variants DoH (443) and DoT (853).
- **Record types:** A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (authoritative servers), TXT (verification, SPF/DKIM), SOA (zone info and timers), PTR (reverse lookup), SRV (service host and port). Every record has a **TTL**.
- **Resolution, step by step:** browser cache → OS cache → `/etc/hosts` → the OS **stub resolver** sends a **recursive** query to a recursive resolver (ISP, 8.8.8.8, 1.1.1.1) → on a cache miss the resolver makes **iterative** queries: root (referral to `.com`) → TLD (referral to the domain's NS records plus **glue** IPs) → authoritative (the A record) → follows any **CNAME** by starting again → caches everything → replies.
- **Root and TLD servers only give referrals**, never the final answer.
- **CNAME rule:** a name with a CNAME can't have other records, so you can't CNAME the bare domain; providers offer ALIAS/ANAME instead.
- **Caching and TTL:** caches in the browser, OS, router and resolver. Short TTL (30–300 s) = fast failover, more queries; long TTL = fewer lookups, slow changes. **Lower the TTL days before a migration.** "Doesn't exist" (NXDOMAIN) is cached too (**negative caching**, per the SOA).

### 3.15 HTTP (repo guide)
> **Source:** [Networking/HTTP.md](../Networking/HTTP.md)

- **What it is:** a stateless request/response protocol, traditionally over TCP. Request: `METHOD /path HTTP/1.1`, headers, blank line, body. Response: `HTTP/1.1 CODE Reason`, headers, blank line, body. Lines end with `\r\n`. Sessions are built on top with cookies or tokens.
- **URL parts:** scheme, host, port, path, query string, fragment (the fragment never leaves the browser). Common headers: `Host`, `Content-Type`, `Content-Length`, `Authorization`, `Cookie`/`Set-Cookie`, `Cache-Control`, `Accept`, `User-Agent`.
- **Methods:** GET (read), HEAD (headers only), OPTIONS (allowed methods, CORS preflight), POST (create / trigger), PUT (create or **fully replace** at a known URL), PATCH (**partial** update), DELETE.
- **Safe** (changes nothing): GET, HEAD, OPTIONS. **Idempotent** (same effect once or many times): GET, HEAD, OPTIONS, PUT, DELETE. POST is neither; PATCH isn't guaranteed idempotent. DELETE is idempotent even if the second call returns 404, because the server state is the same. Retried POSTs use an **idempotency key**.
- **Mistakes to avoid:** GET that changes data (crawlers will "click" it), mixing PUT and PATCH, secrets in query strings (they end up in logs).
- **Status codes:** 1xx info (100 Continue, 101 Switching Protocols) · 2xx success (200, 201 Created + `Location`, 202 Accepted, 204 No Content) · 3xx redirect (301 permanent, 302 temporary, 304 Not Modified via ETag/`If-None-Match`, 307/308 keep the method) · 4xx client (400, **401 not authenticated vs 403 not allowed**, 404, 405, 409 Conflict, 422, 429 Too Many Requests + `Retry-After`) · 5xx server (500, 502 Bad Gateway, 503 Unavailable, 504 Gateway Timeout).
- **Retry rule:** don't blindly retry 4xx (except 408/429); retry 502/503/504 with exponential backoff, and only idempotent requests. Never return 200 with an error body, or 500 for bad input.
- **Versions:** HTTP/1.0 one request per connection · 1.1 keep-alive, `Host`, chunked, but head-of-line blocking · 2 binary framing, multiplexing over one TCP connection, HPACK header compression · 3 on **QUIC over UDP**, no TCP head-of-line blocking, faster setup, built-in TLS 1.3, survives network changes.
- **HTTPS = HTTP inside TLS:** encryption, integrity, and authentication through a CA-signed certificate.

### 3.16 Partitioning (DDIA ch. 6)
> **Source:** *DDIA* ch. 6, "Partitioning". There is no free copy (the free excerpt has chapters 3, 5 and 8), so this follows the chapter's own sections.

- **Why:** a dataset or load too big for one machine is split into **partitions** (shards); each record belongs to exactly one. Partitioning combines with replication: each partition has copies on several nodes, and a node can lead some partitions and follow others.
- **Goal:** spread data and queries evenly. Uneven = **skew**; a partition with too much load is a **hot spot**.
- **By key range:** contiguous key ranges, like encyclopedia volumes; boundaries set by hand or automatically (Bigtable, HBase). Keys stay sorted, so **range scans are cheap**, but some access patterns create hot spots (a timestamp key sends all of today's writes to one partition; fix it by prefixing, e.g. sensor name + timestamp).
- **By hash of key:** a good hash spreads keys evenly; each partition owns a range of hashes. You **lose efficient range queries**. Cassandra's compromise: a compound key where only the first column is hashed and the rest are sorted inside the partition.
- **Very hot keys** (a celebrity): add a random suffix to spread writes over many keys; reads must then read all of them and combine.
- **Secondary indexes:**
  - **Document-partitioned (local):** each partition indexes only its own documents. Writes touch one partition; reads must **scatter/gather** across all partitions (MongoDB, Cassandra, Elasticsearch).
  - **Term-partitioned (global):** the index itself is partitioned by the indexed term. Reads hit one index partition; writes may touch several and are usually updated **asynchronously** (DynamoDB global secondary indexes).
- **Rebalancing** (moving load when nodes are added or removed): spread load fairly, keep serving during the move, move no more data than needed.
  - **Not hash mod N:** changing N moves almost every key.
  - **Fixed number of partitions:** create many more partitions than nodes and move whole partitions to a new node (Riak, Elasticsearch, Couchbase); the number is chosen up front.
  - **Dynamic partitioning:** split a partition when it grows too big, merge when it shrinks (HBase); pre-split an empty database.
  - **Proportional to nodes:** a fixed number of partitions per node; a new node splits some existing ones (Cassandra).
  - **Automatic vs manual:** fully automatic rebalancing plus automatic failure detection can cause cascading failures, so keeping a human in the loop is safer.
- **Request routing:** a client can contact any node (which forwards), a routing tier, or be partition-aware itself. Someone must know the partition-to-node map: a coordination service such as **ZooKeeper** (HBase, Kafka, SolrCloud), MongoDB's config servers, or a **gossip** protocol (Cassandra, Riak).
- **Parallel query execution:** analytic (MPP) databases split one complex query into stages that run on many partitions at once.

### 3.17 Async Rust with Tokio (tutorial parts 1–2)
> **Source:** the official [Tokio tutorial](https://tokio.rs/tokio/tutorial): Hello Tokio, Spawning, Shared state, Channels, I/O, Framing, Select

- **Async in Rust:** an `async fn` returns a **future**, and nothing runs until you `.await` it (**futures are lazy**). `.await` yields the thread so it can run other work. `#[tokio::main]` turns `async fn main` into a normal `main` that starts the runtime (scheduler, evented I/O, timers).
- **Concurrency vs parallelism:** alternating between tasks vs running them at the same time. Tokio can run many tasks concurrently on one thread.
- **Tasks:** `tokio::spawn(async move { … })` creates a lightweight green thread (one allocation, about 64 bytes) and returns a `JoinHandle`; awaiting it gives a `Result` (`Err` if the task panicked or was cancelled). Tasks may move between threads.
- **`'static` bound:** a spawned task must own its data (use `async move`); share data with `Arc`. `'static` means "could live forever", not "leaks".
- **`Send` bound:** everything held across an `.await` must be `Send`, because the task can resume on another thread.
- **Shared state:** two strategies: a **mutex** for simple data, or a **dedicated task + message passing** for I/O resources. Use `std::sync::Mutex` (not Tokio's) when the lock is short and never held across `.await`. A `std` `MutexGuard` held across `.await` doesn't compile (not `Send`), and with a guard that is `Send` it can **deadlock**; wrap the mutex in a struct with non-async methods. `tokio::sync::Mutex` can be held across `.await` but costs more. Under contention: message passing, **mutex sharding** (N mutexes, key picks the shard), or restructuring. `Bytes`: a cheap reference-counted byte buffer (clone doesn't copy).
- **Channels:** `mpsc` (many producers, one consumer, bounded: `send().await` sleeps when full), `oneshot` (one value, used to send a reply back), `broadcast` (every receiver sees every value), `watch` (only the latest value). Pattern: a manager task owns the resource (e.g. one connection), receives `Command`s with a `oneshot::Sender` for the answer. When all senders drop, `recv()` returns `None`.
- **Backpressure:** unbounded queues eventually exhaust memory. Concurrency is introduced explicitly (`spawn`, `select!`, `join!`, channels), so bound it: limit open sockets and pick channel capacities.
- **I/O:** `AsyncRead`/`AsyncWrite` used through `AsyncReadExt`/`AsyncWriteExt` (`read`, `read_to_end`, `write`, `write_all`); `read` returning `Ok(0)` means the peer closed. `io::copy`; `io::split` (Arc + Mutex inside) vs `TcpStream::split` (zero-cost, same task) and `into_split` (movable halves). Put buffers on the heap, because data living across `.await` is stored inside the task.
- **Framing:** turn a byte stream into frames. A `read` can return part of a frame or several frames, so keep a read buffer (`BytesMut` with an automatic cursor via `Buf`/`BufMut`), parse in two steps (check a full frame is there, then parse), and treat EOF with leftover bytes as an error. Writes go through `BufWriter` to save syscalls, then `flush()`.
- **`select!`:** wait on several async operations and take the first to finish; the other branches are **dropped, which is how cancellation works** in async Rust. Up to 64 branches; branches can use patterns, an `else` branch, preconditions (`, if !done`) and borrowed data; it picks branches in random order for fairness. To resume an operation across loop iterations, `tokio::pin!` it and `select!` on `&mut operation`. **`select!` runs all branches on one task**, while `spawn` creates separate tasks that may run in parallel.

### 3.18 CMU project 1: Buffer Pool Manager and ARC (spec, on paper)
> **Source:** [P1 Buffer Pool Manager, Fall 2025](https://15445.courses.cs.cmu.edu/fall2025/project1/) (the official spec). Code not written yet; this is what the spec asks for.

- **The job:** the buffer pool moves 8 KB pages between disk and memory and acts as a cache. A **page** is 8 KB of logical data; a **frame** is a fixed 8 KB slot in memory that holds one page. The rest of the DBMS asks for a `page_id_t` and doesn't know whether it came from memory or disk.
- **Three parts:** the **ARC replacer** (picks which frame to evict), the **disk scheduler** (a background worker thread reads requests from a shared queue/channel and calls `DiskManager::ReadPage/WritePage`; each request carries a `std::promise` the worker sets to `true` when done) and the **buffer pool manager** itself. Everything must be thread-safe with latches.
- **ARC's four lists:** **MRU** (pages accessed exactly once recently), **MFU** (accessed more than once), and two **ghost lists**, MRU ghost and MFU ghost, that remember pages *recently evicted* (page IDs only, no frames). Plus an adaptive **MRU target size**, starting at 0.
- **Five sizes not to mix up:** capacity (= number of frames); the four lists together (up to **2 × capacity** because of the ghosts); the evictable size (`curr_size_`); the MRU target; the MRU actual size.
- **`RecordAccess`, four cases:**
  1. **Hit in MRU or MFU** → move the page to the front of MFU.
  2. **Hit in the MRU ghost** (a pseudo-hit: "a bigger MRU would have kept it") → raise the target by 1 if MRU-ghost ≥ MFU-ghost, else by MFU-ghost / MRU-ghost (rounded down), capped at capacity; move the page to the front of MFU.
  3. **Hit in the MFU ghost** → lower the target the same way (by 1, or MRU-ghost / MFU-ghost), not below 0; move to the front of MFU.
  4. **Miss everywhere** → if MRU + MRU-ghost = capacity, drop the last MRU-ghost entry; else if all four lists = 2 × capacity, drop the last MFU-ghost entry; then add the page to the front of MRU.
- **`Evict`:** if MRU size < target, try MFU first; otherwise try MRU first. If nothing is evictable on that side, try the other; if nothing at all, return `std::nullopt`. The evicted page moves to its ghost list.
- **Other methods:** `SetEvictable` (pin count reached 0 → evictable; changes `Size()`), `Remove` (only for deleted pages), `Size`.
- **Buffer pool rules:** only **one copy of a page** in memory (two copies = lost updates); a **page table** (hash map page → frame); a **pin count** per frame (no eviction while > 0), kept in sync with `SetEvictable`; a **dirty flag**, written back before the frame is reused.
- **Page guards:** `ReadPageGuard` / `WritePageGuard` are **RAII** objects with **move semantics**: they hold the page latch and the pin, and release both when dropped or destroyed.
- **Performance:** a test checks `RecordAccess` speed (avoid linear scans of the lists: keep a map from frame/page to the list position). The optional leaderboard uses scan threads and Zipfian "get" threads; ideas: smarter replacer, prefetching, parallel I/O in the disk scheduler.

### 3.19 Routing algorithms (repo guide)
> **Source:** [Networking/Routing-Algorithms.md](../Networking/Routing-Algorithms.md)

- **Routing vs forwarding:** routing *builds* the routing table (protocols, every few seconds or on changes); forwarding *uses* it for every packet, in hardware. An entry is `prefix → next hop, interface, cost`; `0.0.0.0/0` is the default route.
- **Longest prefix match:** if several prefixes match, the most specific wins (`10.1.5.7` → the `/24`, not the `/16`). Real routers use a trie or TCAM.
- **Shortest paths:** the network is a weighted graph (cost = hops, inverse bandwidth, latency…). A router only needs the **next hop** of each shortest path.
- **Dijkstra / link-state (OSPF, IS-IS):** routers flood link-state advertisements, so everyone has the **full map**, then each runs Dijkstra from itself: a min-heap, finalize the closest node, relax its neighbors. **O((V+E) log V)**, needs **non-negative** weights; fast convergence, more memory and CPU. Skip stale heap entries.
- **Bellman-Ford / distance-vector (RIP):** each router sends its distance vector to its neighbors and keeps, per destination, the minimum of link cost + neighbor's distance. Centralized version: relax all edges V−1 times, **O(V·E)**, handles negative weights and detects negative cycles. Light but slow to converge.
- **Count-to-infinity:** after a link breaks, two routers can keep pointing at each other and count up. Fixes: a maximum (**RIP: 16 = infinity**, so at most 15 hops), **split horizon**, **poison reverse**.
- **BGP:** between organizations (Autonomous Systems), a **path-vector** protocol: routes carry the full AS path, which prevents loops and allows **policy**, not just shortest cost.

### 3.20 Git and Bitbucket (repo guides)
> **Source:** [Git-Explained.md](../Version%20Control%20Systems/Git-Explained.md) · [Git.md](../Version%20Control%20Systems/Git.md) (command reference, GitHub, GitOps) · [Bitbucket.md](../Version%20Control%20Systems/Bitbucket.md)

- **Distributed VCS:** every clone has the full history (Git, Mercurial), unlike centralized SVN/Perforce.
- **Three areas:** working tree → `git add` → staging area (index) → `git commit` → repository (`.git`).
- **Objects:** blob (file contents), tree (directory), commit (tree + parent(s) + author + message), tag. A commit is a **full snapshot**, named by its **hash** (SHA-1 or SHA-256), so history is a hash chain.
- **Branches and HEAD:** a branch is a movable label on a commit; HEAD points at the current branch. **Detached HEAD** = HEAD points straight at a commit.
- **Merge:** fast-forward (just move the label) or **three-way merge** from the merge base, which creates a commit with two parents; conflicts need a human.
- **Rebase:** replays your commits on a new base with **new hashes** and a linear history; never rebase shared history.
- **Remotes:** clone, fetch (download only), pull (fetch + merge/rebase), push; `origin/main` is a remote-tracking branch.
- **Undo:** `restore` (files), `reset --soft/--mixed/--hard` (move a local branch back), `revert` (new inverse commit, safe for shared history), `commit --amend`, `stash`, **`reflog`** (recover lost commits), **`bisect`** (binary search for the commit that broke something).
- **Workflows:** GitHub flow (short feature branches + PR + CI), trunk-based (integrate daily, feature flags), Git flow (`develop` + release/hotfix), forking (open source). Small atomic commits, imperative subject line, `.gitignore`, never commit secrets, tags + semantic versioning.
- **GitOps:** Git as the single source of truth for declarative infrastructure; an agent (Argo CD, Flux) keeps the system equal to what's in Git, and rollback = revert.
- **Bitbucket:** Atlassian's Git hosting. Workspace → project → repository; pull requests with **merge checks** (approvals, green builds, no open tasks) and **branch permissions**; **Pipelines** CI/CD in `bitbucket-pipelines.yml` (Docker steps, deployments, manual gates); **Jira** links through issue keys in branches, commits and PRs. Cloud vs Data Center (self-hosted).

### 3.21 Programming paradigms (repo guide)
> **Source:** [Programming-Paradigms.md](../Programming%20Languages%20and%20Concepts/Programming-Paradigms.md)

- **Paradigm** = a style of structuring programs; C++ (and Rust) are multi-paradigm.
- **Imperative:** step-by-step statements that change state; close to how the CPU works.
- **Declarative:** say *what* you want and the engine decides *how* (SQL, HTML, regex, Makefiles, C++ ranges).
- **Functional:** pure functions, immutability, higher-order functions, composition; easy to test and parallelize.
- **Object-oriented:** objects bundle data + behavior; the four pillars (§3.22).
- **Procedural:** imperative code organized into procedures, data kept separate from functions (C, Pascal).
- **Event-driven:** an event loop dispatches events to handlers; handlers must not block (or the UI freezes); prefer futures/coroutines over callback hell. (My EKSON asyncio fix is this idea.)
- **Aspect-oriented:** cross-cutting concerns (logging, auth, transactions) as aspects: advice, join points, pointcuts, weaving. In C++: wrappers/decorators and RAII.
- **Imperative vs declarative vs functional:** how (mutable state) vs what (engine) vs what through composing pure functions over immutable data.

### 3.22 Object-oriented programming (repo guide)
> **Source:** [OOP.md](../Programming%20Languages%20and%20Concepts/OOP.md)

- **Encapsulation:** hide data behind meaningful operations so the class protects its **invariants** (`deposit`/`withdraw`, not `setBalance`). Don't return non-const references to internals.
- **Inheritance:** "is-a"; the base is constructed first and destroyed last; a polymorphic base needs a **`virtual` destructor**; multiple inheritance and the diamond problem (`virtual` inheritance); `final`.
- **Polymorphism:** runtime (virtual functions, **vtable/vptr**, dynamic dispatch through pointers/references) vs compile-time (templates, concepts, overloading, zero runtime cost); `std::variant` + `std::visit` for a closed set. Pitfalls: **object slicing**, forgetting `override`, virtual calls inside constructors/destructors.
- **Abstraction:** expose *what*, hide *how*; abstract classes with pure virtual functions (`= 0`) or concepts; depend on abstractions (Dependency Inversion). Encapsulation hides data; abstraction hides complexity.
- **Composition vs inheritance:** has-a vs is-a; **favor composition** (loose coupling, swappable parts); inheritance only for true substitutable subtypes (Liskov). Fragile base class; Bird/Penguin example; Strategy and Decorator build on composition.
- **Overloading vs overriding:** same name, different parameters, chosen at compile time vs same signature in a derived class, chosen at runtime. **Name hiding:** a derived `f` hides all base overloads of `f`; fix with `using Base::f;`.

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
| OS: deadlocks | Not tested yet | Finished after the exam (§3.13) |
| Networking: DNS, HTTP | Not tested yet | Finished after the exam (§3.14–§3.15) |
| DDIA ch. 6 partitioning, Tokio | Not tested yet | Finished after the exam (§3.16–§3.17) |
| P1 spec and ARC, routing, Git/Bitbucket, paradigms, OOP | Not tested yet | Finished after the exam (§3.18–§3.22) |

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
