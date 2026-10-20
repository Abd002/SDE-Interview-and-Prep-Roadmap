/* Comparisons: options are node ids; rows are [label, cell per option]. */
function C(o) { ATLAS.comparisons.push(o); }
var ROWS = ["How it works", "Where it lives", "Performance", "Failure / weak spot", "Use it when"];
function R(cells) { var out = []; for (var i = 0; i < ROWS.length; i++) out.push([ROWS[i], cells[i]]); return out; }

C({ id: "replacement", n: "LRU vs LRU-K vs CLOCK vs LFU (and FIFO, ARC)", q: "Which page should leave memory when no frame is free?", opts: ["fifo", "lru", "lruk", "clock", "lfu", "arc"], rows: R([
  ["Evict oldest loaded", "Evict least recently used", "Evict largest backward K-distance; <K accesses = ∞", "Reference bit + rotating hand", "Evict lowest access count", "Balance recency list T1 and frequency list T2 adaptively"],
  ["RAM metadata (queue)", "RAM: hash map + list", "RAM: K timestamps per frame", "RAM: 1 bit per frame", "RAM: counter per frame", "RAM: 2 lists + 2 ghost lists"],
  ["O(1); poor hit ratio", "O(1); good for recency", "Higher overhead; scan resistant", "O(1) amortized; cheap hits", "O(log n) with a heap", "O(1); robust hit ratio"],
  ["Evicts hot pages; Bélády's anomaly", "Sequential flooding", "Needs history; tuning K", "Sequential flooding (approximates LRU)", "Stale popular pages never leave", "More complex"],
  ["Teaching / trivial caches", "General caches with temporal locality", "DBMS buffer pools with mixed scans and lookups", "OS page reclaim, PostgreSQL clock-sweep", "Stable popularity", "Self-tuning caches (ZFS)"]]) });

C({ id: "indexes", n: "B+ tree vs hash index vs LSM tree", q: "How should a key-value index be organized on disk?", opts: ["bplustree", "hashindex", "lsm"], rows: R([
  ["Balanced sorted tree of pages; in-place updates", "Hash key to bucket pages", "Buffer writes in RAM, write sorted immutable files, compact"],
  ["Pages on disk, hot nodes cached in buffer pool", "Bucket pages on disk, cached in buffer pool", "MemTable in RAM; WAL + SSTables on disk; filters in RAM"],
  ["Reads O(log n) few I/Os; random writes", "O(1) equality lookups", "Fast sequential writes; reads may touch several files"],
  ["Page splits, random write I/O", "No ranges; resizing", "Compaction debt, write and read amplification"],
  ["General OLTP, ranges, ordering", "Pure equality lookups", "Write-heavy workloads, SSD, time series"]]) });

C({ id: "hashing", n: "Linear probing vs cuckoo hashing vs extendible hashing (and chaining)", q: "How should a hash table handle collisions and growth?", opts: ["linprobe", "cuckoo", "extendible", "chaining"], rows: R([
  ["Step to the next free slot", "Each key has 2+ candidate slots; evict and relocate", "Directory of 2^g pointers; split only the full bucket", "Linked list (or page chain) per slot"],
  ["RAM (or pages)", "RAM", "RAM or disk pages", "RAM or disk pages"],
  ["Fastest at low load; cache friendly", "O(1) worst-case lookup", "Grows incrementally", "Simple; never full"],
  ["Clustering at high load; tombstones", "Insert cycles force a rebuild", "Directory doubling; skewed hashes waste directory", "Long chains under skew; pointer chasing"],
  ["In-memory joins/aggregations", "Read-heavy, latency-critical lookups", "Disk-based hash indexes", "General use; dynamic size"]]) });

C({ id: "rowcol", n: "Row storage vs column storage", q: "Should a tuple's attributes be stored together or each column separately?", opts: ["nsm", "dsm", "pax"], rows: R([
  ["All attributes of a row in one page", "Each column contiguous", "Row groups, columns inside each group"],
  ["Slotted pages on disk + buffer pool", "Column files/blocks on disk", "Parquet/ORC files"],
  ["Fast inserts and point lookups", "Fast scans of few columns; strong compression", "Close to column-store scans with row locality"],
  ["Wasteful for wide scans", "Slow single-row inserts and updates", "Point updates still expensive"],
  ["OLTP", "OLAP / analytics", "Analytics files in data lakes"]]) });

C({ id: "joins", n: "Hash join vs sort-merge join vs nested-loop joins", q: "How should two inputs be joined?", opts: ["hashjoin", "smj", "nlj", "inlj"], rows: R([
  ["Build hash table on small side, probe with big side", "Sort both, merge with two cursors", "For each outer (block), scan inner", "For each outer tuple, probe inner index"],
  ["Hash table in RAM; partitions spill to disk", "Sort memory + runs on disk", "Few buffers", "Index pages via buffer pool"],
  ["O(M+N) in memory; ~3(M+N) I/O Grace", "Sort cost + M+N", "M + ⌈M/(B−2)⌉·N", "M + m·(probe cost)"],
  ["Equality only; skew; memory pressure", "Duplicates; sorting cost", "Quadratic", "Needs an index; random I/O"],
  ["Large unsorted equi-joins", "Inputs already sorted or output must be sorted", "Tiny inputs or non-equality predicates", "Small outer, indexed inner"]]) });

C({ id: "locklatch", n: "Locks vs latches", q: "Which mechanism protects what?", opts: ["lockmgr", "latch"], rows: R([
  ["Lock manager grants S/X locks to transactions", "Mutex / RW latch taken by a thread"],
  ["Lock table in RAM (logical resources)", "Inside the protected in-memory structure"],
  ["Microseconds per request; held until commit", "Nanoseconds; held for one operation"],
  ["Deadlocks → detection and abort", "Deadlock avoided by coding discipline; bugs hang threads"],
  ["Isolation between transactions", "Thread safety of page table, frames, tree nodes"]]) });

C({ id: "mvcc2pl", n: "MVCC vs two-phase locking", q: "How do concurrent transactions avoid interfering?", opts: ["mvcc", "twopl"], rows: R([
  ["Writers create versions; readers use snapshots", "Acquire locks while growing, release while shrinking"],
  ["Versions in heap or undo store (disk + buffer pool); snapshots in RAM", "Lock table in RAM"],
  ["Readers never block writers", "Readers and writers block each other"],
  ["Version garbage; snapshot isolation allows write skew", "Deadlocks; lock contention"],
  ["Read-heavy and mixed workloads (most modern DBMSs)", "Strict serializability with simple reasoning"]]) });

C({ id: "walshadow", n: "WAL vs shadow paging", q: "How do we make updates atomic and durable?", opts: ["wal", "shadow"], rows: R([
  ["Log changes first, update pages in place later", "Copy pages on write, switch root at commit"],
  ["Log buffer in RAM → log file on disk", "Page copies + page table on disk"],
  ["Sequential log writes; fast commit (no-force)", "Commit writes all changed pages + root"],
  ["Recovery needs redo/undo; log grows", "Fragmentation, garbage, poor concurrency"],
  ["Almost every OLTP DBMS", "Simple embedded stores (LMDB-style CoW trees)"]]) });

C({ id: "bpvscache", n: "DBMS buffer pool vs OS page cache", q: "Who should cache database pages in memory?", opts: ["bpm", "pagecache"], rows: R([
  ["DBMS manages frames, pins, dirty pages, its own eviction", "Kernel caches file pages for every process"],
  ["User-space RAM inside the DBMS process", "Kernel RAM, shared"],
  ["Knows query plans; can prefetch and order writes", "Generic read-ahead and write-back"],
  ["Must be sized; double caching if buffered I/O is used", "Cannot enforce the WAL rule; flushes at its own time"],
  ["Primary cache of most DBMSs (with O_DIRECT)", "Secondary cache (PostgreSQL relies on it)"]]) });

C({ id: "replmodels", n: "Leader-follower vs multi-leader vs leaderless", q: "Who accepts writes in a replicated database?", opts: ["leaderfollower", "multileader", "leaderless"], rows: R([
  ["One leader; followers apply its log", "Several leaders replicate to each other", "Clients write to/read from several replicas"],
  ["Each replica stores a full copy (per partition)", "Each datacenter has a leader", "Each replica stores a copy; quorums over the network"],
  ["Simple; reads scale; writes limited by leader", "Local writes per DC", "High write availability"],
  ["Failover risks (lost writes, split brain)", "Write conflicts", "Stale reads; conflicts; repair needed"],
  ["Most relational DBs", "Multi-DC, offline clients", "Dynamo-style, always-writable stores"]]) });

C({ id: "consrepl", n: "Raft consensus vs ordinary replication", q: "Is copying data enough to be safe?", opts: ["raft", "leaderfollower"], rows: R([
  ["Majority must store an entry before commit; safe elections", "Leader streams log; promotion by timeout or operator"],
  ["Persistent log + term + vote on each node", "Leader's log; followers' copies"],
  ["One majority round trip per commit", "Async: fastest; sync: waits for followers"],
  ["Minority side unavailable during a partition", "Lost acknowledged writes; split brain"],
  ["Metadata, coordination, strongly consistent DBs", "Read scaling, backups, when some data loss is acceptable"]]) });

C({ id: "twopcsaga", n: "2PC vs Saga", q: "How do several databases or services change together?", opts: ["twopc", "saga"], rows: R([
  ["Prepare all, then commit all", "Sequence of local transactions with compensations"],
  ["Coordinator log + participant WALs", "Each service's own database + messages"],
  ["Locks held across round trips", "No global locks"],
  ["Blocks if coordinator fails after prepare", "No isolation; compensations must work"],
  ["Shards of one database, short transactions", "Microservices, long-running business processes"]]) });

C({ id: "syncasync", n: "Synchronous vs asynchronous replication", q: "When does the leader acknowledge a write?", opts: [{ l: "Synchronous", node: "syncasync" }, { l: "Semi-synchronous", node: "syncasync" }, { l: "Asynchronous", node: "syncasync" }], rows: R([
  ["Ack after every follower has the write", "Ack after one designated follower has it", "Ack right after the leader's local commit"],
  ["Durable on leader + all followers' disks", "Durable on leader + one follower", "Durable on the leader only at ack time"],
  ["Adds a round trip to the slowest follower", "Adds one round trip", "No extra latency"],
  ["Any slow or dead follower blocks writes", "Blocks only if the sync follower fails (another is promoted to sync)", "Failover can lose recently acknowledged writes"],
  ["Small clusters needing zero data loss", "Common production default (MySQL semi-sync, PostgreSQL synchronous_standby_names)", "Read replicas, cross-region copies"]]) });

C({ id: "sharding", n: "Range sharding vs hash sharding", q: "How should keys be assigned to partitions?", opts: ["rangepart", "hashpart", "conshash"], rows: R([
  ["Contiguous key ranges per partition", "hash(key) → partition", "Nodes and keys on a hash ring"],
  ["Partition map in metadata store", "Partition map or formula", "Ring membership on every client/node"],
  ["Efficient range scans", "Even load", "Adding a node moves ~1/N keys"],
  ["Hotspots with sequential keys", "Range queries hit all partitions", "Uneven without virtual nodes"],
  ["Time-ordered or range-queried data", "Uniform key-value access", "Elastic clusters (Dynamo, Cassandra)"]]) });

C({ id: "encodings", n: "RLE vs dictionary encoding vs bit packing (and delta, bitmap)", q: "Which column encoding should be used?", opts: ["rle", "dictenc", "bitpack", "delta", "bitmapenc"], rows: R([
  ["(value, start, length) runs", "Values → integer codes + dictionary", "Minimum bits per value", "First value + differences", "One bitmap per distinct value"],
  ["Column blocks on disk, decoded in RAM", "Dictionary + codes", "Packed words", "Base + deltas", "Bitmaps (often compressed)"],
  ["Huge gains on sorted/low-cardinality data", "Big gains on repeated strings; queries on codes", "Fast to decode with SIMD", "Great for timestamps and sorted IDs", "Very fast filters"],
  ["Useless on random data", "Updates may need re-encoding", "Outliers widen every value (use mostly encoding)", "Bad for large unrelated values (text)", "Explodes with high cardinality"],
  ["Sorted columns, flags", "Strings, categories", "Small integers", "Monotonic series", "Low-cardinality filters"]]) });

C({ id: "compaction", n: "Leveled vs tiered compaction", q: "How should an LSM tree merge its files?", opts: ["leveled", "tiered"], rows: R([
  ["Per level, non-overlapping files, 10× growth", "Merge several similar-size files together"],
  ["SSTables on disk", "SSTables on disk"],
  ["Low read and space amplification", "Low write amplification"],
  ["High write amplification", "Read and temporary space amplification"],
  ["Read-heavy, space-sensitive", "Write-heavy ingestion"]]) });

C({ id: "linser", n: "Linearizability vs serializability", q: "Two kinds of 'strong' guarantees.", opts: ["linearizability", "serializability"], rows: R([
  ["Single operations on one object respect real time", "Transactions equivalent to some serial order"],
  ["Distributed replicas of an object", "A DBMS's concurrency control"],
  ["Needs coordination (consensus/quorums + more)", "Needs locks, MVCC+SSI or OCC"],
  ["Unavailable on minority side of a partition", "Aborts and blocking"],
  ["Locks, leader election, unique constraints across replicas", "Multi-object business invariants"]]) });
