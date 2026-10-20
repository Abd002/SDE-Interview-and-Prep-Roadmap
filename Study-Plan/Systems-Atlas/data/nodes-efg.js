/* Layer E: Buffer Pool */
N({ id: "bpm", g: "E1", n: "Buffer pool manager", ab: "BPM buffer manager buffer cache", loc: ["RAM"], ln: "Frames and metadata in RAM; manages copies of disk pages", own: "DBMS",
  p: "The database is bigger than memory, and operators need pages in memory to work on them.",
  s: "Owns a fixed array of frames. Gives callers a pointer to a page, reading it from disk if needed, and decides which page to evict when memory is full. It is a write-back cache: dirty pages are written later, not on every change.",
  io: "In: page IDs from operators/indexes. Out: pinned in-memory pages; read/write requests to the disk manager.",
  h: ["Look up page ID in the page table.", "Hit: pin it, return it.", "Miss: get a free frame, or ask the replacer for a victim.", "If the victim is dirty: make sure its log is flushed (WAL rule), then write it.", "Read the requested page into the frame, update the page table, pin, return."],
  ds: "Frame array, page table (hash map), free list, replacer metadata (LRU-K / CLOCK), pin counts, dirty flags.",
  pro: ["DBMS controls eviction, prefetching and write order (unlike mmap)."], con: ["Must be sized well; too small = I/O bound."],
  f: ["All frames pinned → no victim → the request fails or waits.", "Writing a dirty page before its log records = broken recovery."],
  art: `operator ─FetchPage(7)─▶ page table ─hit─▶ frame 3 (pin++)
                             └─miss─▶ replacer ▶ victim ▶ disk read`,
  an: "A library desk with a fixed number of slots: books (pages) come from the stacks (disk), readers hold them (pins), and a book nobody holds can be sent back to make room.",
  ex: "CMU 15-445 Project 1 (BusTub) builds exactly this.", cmp: "bpvscache" });
N({ id: "frame", g: "E1", n: "Buffer frames", ab: "frame slot", loc: ["RAM"], own: "Buffer pool",
  p: "Need fixed memory slots to hold pages.",
  s: "A frame is one page-sized slot of the buffer pool's memory. A frame holds at most one page at a time; its frame ID never changes, its content does.",
  mis: "Frame ID ≠ page ID: page 7 can be in frame 3 today and frame 9 tomorrow." });
N({ id: "pagetable", g: "E1", n: "Page table (page ID → frame ID)", ab: "buffer pool page table", loc: ["RAM"], own: "Buffer pool",
  p: "Find quickly whether a page is cached and where.",
  s: "An in-memory hash map from page ID to frame ID, rebuilt empty at startup. Protected by a latch.",
  mis: "Not the OS page table (virtual page → physical frame, used by the MMU) and not the page directory (page ID → disk location).", rel: ["ospt", "pagedir", "metahash"] });
N({ id: "freelist", g: "E1", n: "Free frame list", ab: "free list", loc: ["RAM"], own: "Buffer pool",
  p: "Avoid calling the replacer when empty frames exist.",
  s: "A list of frames that hold no page. Used first; only when it is empty does the BPM evict." });
N({ id: "pincount", g: "E1", n: "Pin count", ab: "pin reference count", loc: ["RAM"], own: "Buffer pool",
  p: "A page must not be evicted while someone is using it.",
  s: "Counter per frame of current users. Fetch increments; Unpin decrements. Only frames with pin count 0 are evictable.",
  f: ["A missing Unpin leaks the frame forever; with enough leaks the pool runs out of victims."], mis: "Pinning prevents eviction, not concurrent access. Latches protect the content." });
N({ id: "dirtyflag", g: "E1", n: "Dirty flag", ab: "dirty bit modified", loc: ["RAM"], own: "Buffer pool",
  p: "Know whether a cached page differs from the disk copy.",
  s: "Set when a page is modified. A dirty page must be written back before its frame is reused; a clean page can simply be dropped.", rel: ["dpt", "bgwriter"] });
N({ id: "pageguard", g: "E1", n: "Page guards", ab: "ReadPageGuard WritePageGuard RAII", loc: ["RAM"], own: "Buffer pool API (BusTub)",
  p: "Forgetting to unpin or unlatch a page is an easy, fatal bug.",
  s: "RAII objects that pin (and latch) a page when created and unpin (and unlatch) it when destroyed, so early returns and exceptions cannot leak pins.",
  impl: "Name from CMU BusTub; other systems use similar handles (e.g. PostgreSQL Buffer + LockBuffer pairs)." });
N({ id: "fetchpage", g: "E2", n: "Fetch page", ab: "FetchPage ReadPage", loc: ["RAM", "DISK"], own: "Buffer pool API",
  p: "Get a page into memory and safe to use.",
  s: "Return the page pinned. Hit: pin and return. Miss: get a frame (free list or eviction), read from disk, then pin.", rel: ["bpm"] });
N({ id: "newpage", g: "E2", n: "New page", ab: "NewPage allocate page", loc: ["RAM", "DISK"], own: "Buffer pool API",
  p: "Allocate a fresh page (for a growing table or a B+ tree split).",
  s: "Allocate a new page ID (via the disk manager), give it a frame, zero it, pin it." });
N({ id: "unpinpage", g: "E2", n: "Unpin page", ab: "UnpinPage release", loc: ["RAM"], own: "Buffer pool API",
  p: "Say you are done with a page.",
  s: "Decrement the pin count, optionally marking the page dirty. At 0 the frame becomes evictable." });
N({ id: "flushpage", g: "E2", n: "Flush page", ab: "FlushPage write back", loc: ["RAM", "DISK"], own: "Buffer pool API",
  p: "Write a page's current content to disk (checkpoint, shutdown, background writer).",
  s: "Write the frame to disk (after flushing the log up to the page's pageLSN) and clear the dirty flag. The page stays cached.", rel: ["wal"] });
N({ id: "deletepage", g: "E2", n: "Delete page", ab: "DeletePage deallocate", loc: ["RAM", "DISK"], own: "Buffer pool API",
  p: "Free a page that is no longer needed.",
  s: "Only if unpinned: remove it from the page table, return the frame to the free list, and deallocate the page on disk." });
N({ id: "evict", g: "E2", n: "Evict page", ab: "eviction victim", loc: ["RAM", "DISK"], own: "Buffer pool",
  p: "Make room for a new page.",
  s: "Ask the replacer for an unpinned victim. If dirty: flush the log to its pageLSN, write the page. Remove from the page table; reuse the frame.",
  f: ["Evicting a hot page causes repeated misses (thrashing)."], rel: ["replacer", "wal"] });
N({ id: "replacer", g: "E3", n: "Page replacement (hits & misses)", ab: "replacer replacement policy cache hit miss hit ratio", loc: ["RAM"], own: "Buffer pool",
  p: "Choose the victim that is least likely to be needed soon.",
  s: "A policy (LRU, CLOCK, LRU-K, ...) tracks access history of unpinned frames. Goal: maximize the hit ratio (requests served from RAM) with little overhead.",
  pro: ["A good policy turns disk-bound workloads into memory-bound ones."], cmp: "replacement",
  mis: "The DBMS replacer and the OS page-replacement algorithm are different mechanisms managing different memory, even when both are called 'LRU' or 'CLOCK'.", rel: ["osrepl"] });
N({ id: "fifo", g: "E3", n: "FIFO", ab: "first in first out", loc: ["RAM"], own: "Replacement policy",
  p: "Simplest eviction order.",
  s: "Evict the page that has been in memory longest, regardless of use.", con: ["Evicts hot pages; suffers Bélády's anomaly (more frames can mean more faults)."], cmp: "replacement" });
N({ id: "lru", g: "E3", n: "LRU", ab: "least recently used", loc: ["RAM"], own: "Replacement policy",
  p: "Recently used pages are likely to be used again.",
  s: "Evict the page whose last access is oldest.", cx: "O(1) with a hash map + doubly linked list.",
  con: ["Sequential flooding: one big scan pushes out all hot pages.", "Ignores frequency."], cmp: "replacement", rel: ["lrulist", "seqflood"] });
N({ id: "lruk", g: "E3", n: "LRU-K", ab: "LRU-2 backward k-distance", loc: ["RAM"], own: "Replacement policy (buffer pool)",
  p: "LRU cannot tell a page touched once by a scan from a page used constantly.",
  s: "Track the last K access times of each frame. Evict the frame with the largest backward K-distance (now − time of K-th most recent access). Frames with fewer than K accesses have distance +∞ and go first; ties among them are broken by classic LRU (oldest access).",
  h: ["On access: append the timestamp to the frame's history (keep K).", "Evictable = pin count 0.", "Victim = largest backward K-distance; +∞ frames first, earliest timestamp among them.", "Remove the victim's history."],
  ds: "Per-frame list of up to K timestamps; often split into a 'fewer than K' list and a 'K or more' structure.", cx: "O(n) scan per eviction naively; O(log n) with a priority structure.",
  pro: ["Scan-resistant: pages seen once are evicted first.", "Captures frequency."], con: ["More metadata; needs history for recently evicted pages to work best."],
  art: `K=2, now=10
frame A: [3, 9]  → k-dist = 10-3 = 7
frame B: [8]     → k-dist = +∞  ← evict
frame C: [1, 2]  → k-dist = 9`, ex: "BusTub's LRUKReplacer (CMU 15-445 P1). Paper: O'Neil et al., 1993.", cmp: "replacement", rel: ["lrukhist", "pincount", "evict", "osrepl"] });
N({ id: "clock", g: "E3", n: "CLOCK", ab: "second chance clock sweep", loc: ["RAM"], own: "Replacement policy",
  p: "LRU-like behavior with almost no overhead.",
  s: "One reference bit per frame and a rotating hand: access sets the bit; the hand clears 1s and evicts the first 0.",
  pro: ["Cheap, no list updates on hits."], con: ["Approximates LRU, so it also suffers sequential flooding."], ex: "PostgreSQL uses a clock-sweep with usage counts.", cmp: "replacement", rel: ["clockbits"] });
N({ id: "lfu", g: "E3", n: "LFU", ab: "least frequently used", loc: ["RAM"], own: "Replacement policy",
  p: "Keep pages that are used often.",
  s: "Evict the page with the lowest access count.", con: ["Old popular pages stay forever (no aging) unless counts decay."], cmp: "replacement" });
N({ id: "arc", g: "E3", n: "ARC", ab: "adaptive replacement cache", loc: ["RAM"], own: "Replacement policy",
  p: "Balance recency and frequency automatically.",
  s: "Two lists: T1 (seen once recently) and T2 (seen at least twice), plus ghost lists of recently evicted keys. Hits in the ghost lists move a target size p toward recency or frequency.",
  ex: "IBM DS8000, ZFS (ARC cache).", cmp: "replacement" });
N({ id: "seqflood", g: "E3", n: "Sequential flooding & scan resistance", ab: "sequential flooding buffer pool pollution", loc: ["RAM"], own: "Buffer pool",
  p: "A full table scan reads each page once yet evicts everything else under LRU/CLOCK.",
  s: "Fixes: LRU-K, ARC, a small separate ring buffer for big scans (PostgreSQL), or MySQL's young/old sublists where pages enter 'old' and move to 'young' only on a second access.", rel: ["seqscan"] });
N({ id: "diskscheduler", g: "E4", n: "Disk scheduler", ab: "I/O scheduler request queue", loc: ["RAM", "CPU"], own: "DBMS",
  p: "Many threads issue reads and writes; the DBMS wants to prioritize and batch them.",
  s: "A queue of read/write requests processed by background worker thread(s) that call the disk manager and signal completion (e.g. with a promise).",
  impl: "BusTub has a DiskScheduler; real systems use I/O threads or async I/O with their own priorities (foreground reads before background writes).", rel: ["asyncio"] });
N({ id: "diskmgr", g: "E4", n: "Disk manager", ab: "storage manager file manager", loc: ["CPU", "OS"], own: "DBMS",
  p: "Translate page reads/writes into file I/O.",
  s: "Maps page ID → (file, offset) and issues read()/pwrite() system calls (buffered or O_DIRECT), plus fsync for durability.", rel: ["modes", "directio", "pagedir"] });
N({ id: "asyncio", g: "E4", n: "Asynchronous I/O", ab: "io_uring libaio AIO non-blocking I/O", loc: ["OS"], own: "DBMS + kernel",
  p: "A thread blocked on one I/O cannot issue others; SSDs need many outstanding requests to reach full speed.",
  s: "Submit many I/O requests at once and collect completions later (Linux io_uring, libaio). Used for prefetching and background writes.", impl: "Availability and use vary by DBMS and OS." });
N({ id: "bgwriter", g: "E4", n: "Dirty-page tracking & background writer", ab: "background writer page cleaner", loc: ["RAM", "DISK"], own: "DBMS",
  p: "Evicting a dirty page means a slow write in the critical path.",
  s: "A background thread walks the pool and writes dirty pages early (respecting WAL), so most evictions find clean pages.", ex: "PostgreSQL bgwriter, InnoDB page cleaner threads.", rel: ["dpt", "checkpoint"] });
N({ id: "doublecache", g: "E4", n: "Buffer pool vs OS page cache (double caching)", ab: "double buffering page cache", loc: ["RAM", "OS"], own: "DBMS and kernel",
  p: "With buffered I/O, the same page can sit in the DBMS buffer pool AND the kernel page cache, wasting RAM.",
  s: "Most DBMSs open files with O_DIRECT so reads bypass the page cache. PostgreSQL deliberately uses buffered I/O and relies on the OS cache as a second-level cache.",
  mis: "The OS page cache cannot enforce the WAL rule or know query plans; that is why the DBMS keeps its own pool.", cmp: "bpvscache", rel: ["pagecache", "directio", "mmap"] });

/* Layer F: Transactions & Concurrency */
N({ id: "acid", g: "F1", n: "ACID", ab: "atomicity consistency isolation durability", loc: ["LOGIC"], own: "Transaction manager",
  p: "Define what a correct transaction system guarantees.",
  s: "Atomicity: all or nothing (undo log). Consistency: constraints hold. Isolation: concurrent transactions don't see each other's partial work (concurrency control). Durability: committed changes survive crashes (WAL).",
  mis: "The C in ACID (constraints) is not the C in CAP (linearizability)." , rel: ["cap", "wal", "isolation"] });
N({ id: "txn", g: "F1", n: "Transaction", ab: "txn unit of work", loc: ["RAM", "LOGIC"], own: "Transaction manager",
  p: "Group reads and writes into one unit that commits or aborts as a whole.",
  s: "Has an ID, a state (active, committed, aborted), locks or a snapshot, and log records linked by prevLSN.", rel: ["clienttxn", "logrec"] });
N({ id: "schedule", g: "F1", n: "Schedules (serial vs concurrent)", ab: "schedule interleaving", loc: ["LOGIC"], own: "Theory",
  p: "Running one transaction at a time is correct but slow; interleaving is fast but can be wrong.",
  s: "A schedule is an order of operations from several transactions. Serial = no interleaving. A concurrent schedule is correct if it is equivalent to some serial one." });
N({ id: "serializability", g: "F1", n: "Conflict serializability", ab: "serializable conflict equivalence", loc: ["LOGIC"], own: "Theory",
  p: "Decide whether an interleaving is safe.",
  s: "Two operations conflict if they are from different transactions, on the same item, and at least one is a write. A schedule is conflict serializable if swapping non-conflicting operations can turn it into a serial schedule (its precedence graph has no cycle).", rel: ["precedence", "linvsser"] });
N({ id: "precedence", g: "F1", n: "Precedence graph", ab: "dependency graph serialization graph", loc: ["LOGIC"], own: "Theory",
  p: "Test conflict serializability mechanically.",
  s: "One node per transaction; edge Ti → Tj if an operation of Ti conflicts with and comes before one of Tj. Acyclic ⇔ conflict serializable.",
  art: `T1 ──W(A)…R(A)──▶ T2
 ▲                 │
 └──W(B)…R(B)──────┘   cycle ⇒ not serializable` });
N({ id: "anomalies", g: "F1", n: "Anomalies", ab: "dirty read lost update non-repeatable read phantom write skew", loc: ["LOGIC"], own: "Theory",
  p: "Know what can go wrong without full isolation.",
  s: "Dirty read (see uncommitted data), lost update (two writes, one overwritten), non-repeatable read (value changes between reads), phantom (new rows match a predicate), write skew (two transactions read overlapping data and write disjoint data, breaking an invariant)." });
N({ id: "isolation", g: "F1", n: "Isolation levels", ab: "read uncommitted read committed repeatable read serializable snapshot isolation", loc: ["LOGIC"], own: "Transaction manager",
  p: "Trade correctness for concurrency.",
  s: "READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE, each forbidding more anomalies. Snapshot isolation (many MVCC systems) prevents most anomalies but allows write skew unless made serializable (SSI).",
  impl: "Names mean different things across systems: PostgreSQL's REPEATABLE READ is snapshot isolation; its SERIALIZABLE is SSI." });
N({ id: "twopl", g: "F2", n: "Two-phase locking (2PL)", ab: "2PL growing shrinking phase", loc: ["RAM", "LOGIC"], own: "Lock manager",
  p: "Guarantee conflict-serializable schedules.",
  s: "Growing phase: acquire locks, never release. Shrinking phase: release, never acquire again. Guarantees serializability but can cause cascading aborts and deadlocks.", cmp: "mvcc2pl" });
N({ id: "strict2pl", g: "F2", n: "Strict 2PL", ab: "strong strict 2PL rigorous", loc: ["RAM", "LOGIC"], own: "Lock manager",
  p: "Plain 2PL lets others read data from a transaction that later aborts (cascading aborts).",
  s: "Hold all (exclusive) locks until commit or abort. No one ever reads uncommitted data, so no cascading aborts and recovery is simpler." });
N({ id: "sxlocks", g: "F2", n: "Shared & exclusive locks", ab: "S lock X lock compatibility matrix", loc: ["RAM"], own: "Lock manager",
  p: "Readers can share; writers must be alone.",
  s: "S (shared) for reading, X (exclusive) for writing. S is compatible with S; X with nothing.",
  art: `     S    X
S    ✔    ✘
X    ✘    ✘` });
N({ id: "lockmgr", g: "F2", n: "Lock manager", ab: "lock table", loc: ["RAM"], own: "DBMS",
  p: "Track who holds and who waits for each lock.",
  s: "A hash table from resource (table, page, tuple) to a queue of granted and waiting requests. Grants compatible requests, blocks others, and feeds deadlock detection.", rel: ["metahash", "deadlock"] });
N({ id: "granularity", g: "F2", n: "Lock granularity & intention locks", ab: "IS IX SIX hierarchical locking multiple granularity", loc: ["RAM"], own: "Lock manager",
  p: "Locking every tuple is expensive; locking the whole table kills concurrency.",
  s: "Lock at several levels (database, table, page, tuple). Intention locks (IS, IX, SIX) on a parent announce locks below it, so a table-level X lock can detect conflicts without scanning tuple locks." });
N({ id: "deadlock", g: "F2", n: "Deadlocks (wait-for graph)", ab: "deadlock detection prevention wait-die wound-wait", loc: ["RAM"], own: "Lock manager",
  p: "T1 waits for T2's lock while T2 waits for T1's: nobody moves.",
  s: "Detection: build a wait-for graph and abort a victim when a cycle appears. Prevention: order by timestamp — wait-die (older waits, younger dies) or wound-wait (older wounds younger, younger waits).",
  art: `T1 ──waits for──▶ T2
 ▲                 │
 └───waits for─────┘  cycle → abort one`, rel: ["osdeadlock", "distdeadlock"] });
N({ id: "mvcc", g: "F3", n: "MVCC", ab: "multi-version concurrency control versions", loc: ["RAM", "DISK"], ln: "Versions stored in table pages or an undo/version store on disk; snapshot info in RAM", own: "DBMS",
  p: "With locks, readers block writers and writers block readers.",
  s: "Each write creates a new version stamped with the writer's transaction ID. Each reader uses a snapshot and sees only versions committed before it. Readers never block writers.",
  h: ["Txn starts: take a snapshot (or begin timestamp).", "Write: create a new version; old one stays.", "Read: walk the version chain to the version visible to the snapshot.", "Garbage collection removes versions no snapshot can see."],
  pro: ["Readers don't block writers.", "Consistent read-only queries for free."], con: ["Version storage and garbage collection (VACUUM).", "Snapshot isolation allows write skew."],
  impl: "PostgreSQL keeps old versions in the heap; MySQL InnoDB and Oracle rebuild old versions from undo logs.", cmp: "mvcc2pl", rel: ["tuple", "snapshot", "versionchain"] });
N({ id: "snapshot", g: "F3", n: "Snapshots & snapshot isolation", ab: "SI snapshot read view", loc: ["RAM"], own: "MVCC",
  p: "Give a transaction a frozen view of the database.",
  s: "A snapshot records which transactions were committed when it was taken. Under snapshot isolation, a transaction reads its snapshot and aborts if it tries to write an item another committed transaction changed after the snapshot (first-committer-wins)." });
N({ id: "versionchain", g: "F3", n: "Version chains", ab: "version chain newest-to-oldest", loc: ["DISK", "RAM"], own: "MVCC",
  p: "Find the right version of a tuple quickly.",
  s: "Versions of one logical tuple are linked, oldest-to-newest or newest-to-oldest; storage can be append-only, time-travel table or delta records (undo)." });
N({ id: "tso", g: "F3", n: "Timestamp ordering", ab: "T/O basic timestamp ordering Thomas write rule", loc: ["RAM"], own: "Concurrency control",
  p: "Serialize without locks by fixing the order in advance.",
  s: "Each transaction gets a timestamp; each item records the largest read and write timestamps. An operation that would violate timestamp order aborts the transaction (which restarts with a new timestamp)." });
N({ id: "occ", g: "F3", n: "Optimistic concurrency control", ab: "OCC validation", loc: ["RAM"], own: "Concurrency control",
  p: "Locking is wasteful when conflicts are rare.",
  s: "Read phase: work in a private workspace. Validation: check for conflicts with transactions that committed meanwhile. Write phase: install changes. On conflict, abort and retry.", con: ["High abort rate under contention."] });
N({ id: "lockvslatch", g: "F4", n: "Locks vs latches", ab: "lock latch difference", loc: ["RAM", "LOGIC"], own: "DBMS",
  p: "Two different kinds of protection are easy to confuse.",
  s: "Locks protect logical database contents (tuples, tables) between transactions, can be held until commit, are visible to users and need deadlock handling. Latches protect in-memory structures (page table, B+ tree node, buffer frame) for a few microseconds, are never held across user think time, and avoid deadlock by coding discipline.",
  cmp: "locklatch", art: `        LOCK                 LATCH
protects: rows/tables       page table, page bytes
held by:  transactions      threads
duration: until commit      one operation
deadlock: detect/abort      avoid by ordering` });
N({ id: "latch", g: "F4", n: "Latches (mutex, RW latch)", ab: "mutex reader-writer latch rwlock", loc: ["RAM", "CPU"], own: "DBMS internal code",
  p: "Threads must not corrupt shared in-memory structures.",
  s: "Short critical sections using mutexes or reader-writer latches, e.g. on each buffer frame and on the page table.", rel: ["oslocks", "latchcrab"] });
N({ id: "spinlock", g: "F4", n: "Spinlocks", ab: "spin lock test-and-set busy wait", loc: ["CPU", "RAM"], own: "DBMS / kernel",
  p: "Sleeping and waking a thread costs microseconds; some critical sections take nanoseconds.",
  s: "Busy-wait in a loop on an atomic flag instead of sleeping. Great for tiny sections on multi-core CPUs; terrible if the holder is descheduled." });
N({ id: "cas", g: "F4", n: "Atomics & compare-and-swap", ab: "CAS atomic lock-free std::atomic", loc: ["CPU"], own: "Hardware instruction used by software",
  p: "Update a shared word without a lock.",
  s: "CAS(addr, expected, new) writes new only if *addr == expected, atomically, and reports success. Lock-free structures and spinlocks are built from it.",
  f: ["ABA problem: a value changes A→B→A between read and CAS."], ex: "A lock-free counter: loop { old = x; if CAS(x, old, old+1) break; }" });

/* Layer G: Logging & Recovery */
N({ id: "wal", g: "G1", n: "Write-ahead logging (WAL)", ab: "WAL redo log journal write-ahead", loc: ["DISK", "RAM"], ln: "Log records are buffered in RAM (log buffer) and become durable when flushed to disk", own: "Log manager",
  p: "Get atomicity and durability without forcing every modified page to disk at commit.",
  s: "Every change is first described in an append-only log. Rules: (1) a log record must be on durable storage before the data page it describes is written (WAL rule); (2) all of a transaction's log records, including COMMIT, must be durable before the commit is acknowledged.",
  h: ["Modify the page in the buffer pool; append a log record (gets an LSN); set pageLSN.", "At commit: append COMMIT, flush the log up to its LSN, then acknowledge.", "Before writing a dirty page: flush the log up to that page's pageLSN.", "After a crash: replay the log to rebuild state."],
  pro: ["Sequential log writes; no-force at commit; steal allowed."], con: ["Log grows; needs checkpoints and archiving."],
  art: `RAM:  [page 7, pageLSN=120]   [log buffer …118 119 120]
                     │ may write only after ↓
DISK: [data file]           [log file … flushedLSN ≥ 120]`,
  an: "Write in the diary what you are about to do before you do it; after a power cut, read the diary.", cmp: "walshadow", rel: ["journalfs", "lsmwal", "raftpersist"] });
N({ id: "lsn", g: "G1", n: "Log sequence numbers (LSNs)", ab: "LSN pageLSN flushedLSN prevLSN recLSN", loc: ["RAM", "DISK"], own: "Log manager",
  p: "Order log records and compare page state with log state.",
  s: "Monotonic IDs for log records. pageLSN (in each page) = last change applied to it; flushedLSN (in RAM) = log durable up to here; prevLSN links a transaction's records; recLSN = first change that dirtied a page since it was last flushed.",
  ex: "A page with pageLSN 120 can be written only if flushedLSN ≥ 120." });
N({ id: "logrec", g: "G1", n: "Log records", ab: "update record commit abort CLR compensation", loc: ["DISK", "RAM"], own: "Log manager",
  p: "Describe changes precisely enough to redo or undo them.",
  s: "Update records (txn, page, before and/or after image or logical operation), BEGIN/COMMIT/ABORT/END, and compensation log records (CLRs) that log an undo so it is never undone twice.", rel: ["undo", "redo"] });
N({ id: "logbuf", g: "G1", n: "Log buffer & log flush", ab: "log buffer fsync", loc: ["RAM", "DISK", "OS"], own: "Log manager",
  p: "fsync per log record would be far too slow.",
  s: "Records accumulate in an in-memory log buffer and are written sequentially and fsynced when a commit, a page write or a full buffer requires it.", rel: ["directio"] });
N({ id: "groupcommit", g: "G1", n: "Group commit", ab: "group commit batch fsync", loc: ["RAM", "DISK"], own: "Log manager",
  p: "Each commit needs an fsync, and an fsync takes ~0.1–10 ms.",
  s: "Batch the commit records of many concurrent transactions into one log flush; all of them are acknowledged together. Raises throughput at a small latency cost." });
N({ id: "durablecommit", g: "G1", n: "Durable commit acknowledgment", ab: "commit durability synchronous_commit", loc: ["DISK"], own: "Transaction manager",
  p: "When may the DBMS tell the client 'committed'?",
  s: "Only after the COMMIT record is on stable storage (and, with synchronous replication, also on a replica). Asynchronous commit settings trade this guarantee for speed.",
  f: ["Disk caches that lie about fsync can lose 'durable' commits on power loss."], rel: ["syncasync"] });
N({ id: "stealforce", g: "G2", n: "Steal / no-steal, force / no-force", ab: "steal force buffer policy", loc: ["LOGIC"], own: "Buffer pool + recovery design",
  p: "Decide when dirty pages may reach disk.",
  s: "Steal: an uncommitted transaction's dirty page may be written (so undo is needed). Force: all of a transaction's pages are written at commit (so redo is not needed). Fast systems use steal + no-force, which needs both undo and redo (ARIES).",
  art: `            no-force        force
steal       undo+redo ★     undo only
no-steal    redo only       neither (slow)` });
N({ id: "shadow", g: "G2", n: "Shadow paging", ab: "copy-on-write shadow page", loc: ["DISK"], own: "Alternative recovery design",
  p: "Get atomicity without a log.",
  s: "Copy pages on write; keep the old page table as the shadow. Commit = atomically switch the root pointer to the new page table. Abort = discard the copies.",
  pro: ["No undo/redo needed; instant recovery."], con: ["Copies whole pages, fragments data, expensive commit; poor for concurrency."], ex: "Early System R; LMDB uses copy-on-write B+ trees.", cmp: "walshadow" });
N({ id: "checkpoint", g: "G2", n: "Checkpoints", ab: "fuzzy checkpoint", loc: ["DISK", "RAM"], own: "Recovery manager",
  p: "Without checkpoints, recovery would replay the log from the beginning of time.",
  s: "Periodically record where recovery may start. A fuzzy checkpoint writes the active transaction table and the dirty page table to the log without stopping work.", rel: ["dpt", "bgwriter"] });
N({ id: "dpt", g: "G2", n: "Dirty page table & transaction table", ab: "DPT ATT active transaction table", loc: ["RAM"], ln: "In RAM during normal work; copied into checkpoints on disk", own: "Recovery manager",
  p: "Recovery must know which pages may be stale on disk and which transactions were running.",
  s: "DPT: page → recLSN (oldest change not yet on disk). ATT: txn → status and lastLSN. Redo starts at the smallest recLSN.", rel: ["dirtyflag"] });
N({ id: "crashrec", g: "G3", n: "Crash recovery", ab: "restart recovery", loc: ["DISK", "RAM"], own: "Recovery manager",
  p: "After a crash, RAM (buffer pool, lock table, log buffer) is gone; disk pages may be a mix of old and new.",
  s: "Use the durable log to bring the database to a state containing exactly the committed transactions.",
  mis: "A DBMS crash (process dies, memory lost, disk intact) differs from a machine loss (disk gone too → need replicas) and from a network partition (nodes alive but cut off).", rel: ["partialfail", "replog"] });
N({ id: "aries", g: "G3", n: "ARIES", ab: "analysis redo undo repeating history", loc: ["DISK", "RAM"], own: "Recovery manager",
  p: "A complete, efficient recovery algorithm for steal/no-force with fine-grained locking.",
  s: "Three passes. Analysis: from the last checkpoint, rebuild the DPT and ATT. Redo: repeat history from the smallest recLSN, reapplying changes whose LSN > pageLSN. Undo: roll back loser transactions in reverse LSN order, writing CLRs.",
  art: `log: …[ckpt]…………………………………▶ end
Analysis:      ───────────────▶
Redo:     ─────────────────────▶ (from min recLSN)
Undo:  ◀────────────────────────  (losers only)`, ex: "Used (with variations) by DB2, SQL Server; InnoDB follows similar ideas." });
N({ id: "redo", g: "G3", n: "Redo", ab: "redo pass replay", loc: ["DISK", "RAM"], own: "Recovery manager",
  p: "Committed changes may exist only in the log (no-force).",
  s: "Reapply logged changes to pages whose pageLSN is older than the record's LSN. Repeats history, including changes of transactions that will be undone." });
N({ id: "undo", g: "G3", n: "Undo", ab: "undo rollback CLR", loc: ["DISK", "RAM"], own: "Recovery manager",
  p: "Uncommitted changes may be on disk (steal).",
  s: "Revert changes of transactions without a COMMIT, newest first, logging each reversal as a CLR so a crash during recovery never undoes twice." });
N({ id: "crashcons", g: "G3", n: "Crash consistency & torn pages", ab: "torn write partial write checksum full page write doublewrite", loc: ["DISK"], own: "DBMS + filesystem",
  p: "A database page (8–16 KB) is bigger than the unit the device writes atomically.",
  s: "A crash mid-write leaves a torn page. Defenses: page checksums to detect it, full-page images in the WAL (PostgreSQL full_page_writes), or a doublewrite buffer (InnoDB).", rel: ["page", "ssd", "journalfs"] });
