/* Systems Atlas data model.
   layers  -> groups (subsystems) -> nodes (concepts)
   edges   connect nodes (or groups/layers) and carry a type:
     data  = data flow            ctrl  = control flow / calls
     dep   = depends on / built on repl  = replication / copying
     recov = recovery path        rel   = related concept (cross-link)
   Location codes: RAM, DISK, CPU, OS, NET, MULTI, LOGIC */
window.ATLAS = { layers: [], groups: [], nodes: [], edges: [], scenarios: [], comparisons: [] };
function L(o) { ATLAS.layers.push(o); }
function G(id, layer, n, d) { ATLAS.groups.push({ id: id, layer: layer, n: n, d: d }); }
function N(o) { ATLAS.nodes.push(o); }
function E(a, b, t, l, m) { ATLAS.edges.push({ a: a, b: b, t: t, l: l || "", m: !!m }); }

L({ id: "A", n: "Applications & Clients", tag: "Where requests start", hue: 262, own: "Application processes and client libraries",
  d: "Programs that need data: web services, batch jobs, mobile back ends. They talk to a DBMS through a driver over a network connection, or to other services through HTTP/gRPC. Everything below this layer exists to answer their requests correctly and quickly.",
  loc: ["CPU", "RAM", "NET"] });
L({ id: "B", n: "Query Processing", tag: "SQL text → plan → rows", hue: 24, own: "DBMS (front end, optimizer, executor)",
  d: "Turns a SQL string into a result. The parser checks syntax, the binder resolves names against the catalog, the optimizer picks a cheap physical plan, and the execution engine runs operators that pull tuples from the storage engine and indexes.",
  loc: ["CPU", "RAM"] });
L({ id: "C", n: "Storage Engine", tag: "Tables as pages on disk", hue: 38, own: "DBMS storage manager",
  d: "Maps the logical table to physical pages in files. Decides page layout (slotted pages, columns, index-organized), tuple format and free-space tracking. Everything it stores is persistent on disk, with cached copies of pages in the buffer pool.",
  loc: ["DISK", "RAM"] });
L({ id: "D", n: "Indexes & Data Structures", tag: "Find data without scanning it all", hue: 48, own: "DBMS (access methods) + every layer that needs fast lookup",
  d: "Hash tables, B+ trees, Bloom filters, skip lists, heaps and the lists that buffer replacement policies use. The same idea can live in RAM only (a join hash table) or on disk pages cached in RAM (a B+ tree index). Each node says which.",
  loc: ["RAM", "DISK", "LOGIC"] });
L({ id: "E", n: "Buffer Pool", tag: "The DBMS's own page cache", hue: 350, own: "DBMS buffer pool manager",
  d: "A fixed array of in-memory frames that hold copies of disk pages. The buffer pool manager pins pages for operators, tracks dirty pages, chooses victims with a replacement policy and asks the disk manager to read and write. It must obey the WAL rule before writing a dirty page.",
  loc: ["RAM", "DISK"] });
L({ id: "F", n: "Transactions & Concurrency", tag: "Many users, one correct result", hue: 330, own: "DBMS transaction manager, lock manager, MVCC",
  d: "Makes concurrent transactions behave as if they ran one at a time (or as weakly as the isolation level allows). Uses locks (2PL), versions (MVCC), timestamps or validation (OCC). Separately, short-term latches protect in-memory structures.",
  loc: ["RAM", "LOGIC"] });
L({ id: "G", n: "Logging & Recovery", tag: "Survive crashes without losing commits", hue: 14, own: "DBMS log manager and recovery manager",
  d: "The write-ahead log records every change before the page holding it reaches disk. Commit means the commit record is durable. After a crash, recovery replays the log (redo) and rolls back losers (undo), for example with ARIES.",
  loc: ["DISK", "RAM"] });
L({ id: "H", n: "Operating System & Hardware", tag: "CPU, memory, files, devices, sockets", hue: 215, own: "Kernel + hardware",
  d: "The DBMS is just a process. The kernel schedules its threads, maps its virtual memory, caches file pages, runs the filesystem and block layer, drives SSDs/HDDs, and moves bytes over TCP/IP. Similar names (page, LRU, cache) mean different things here than in the DBMS.",
  loc: ["OS", "CPU", "RAM", "DISK", "NET"] });
L({ id: "I", n: "Distributed Fundamentals", tag: "Many machines, unreliable network", hue: 190, own: "Every process in a distributed system",
  d: "Communication (RPC, serialization, TCP), failure (timeouts, retries, partitions, partial failure), time and order (clocks, happens-before, Lamport and vector clocks) and consistency models (linearizability, eventual, CAP, quorums).",
  loc: ["NET", "MULTI", "LOGIC"] });
L({ id: "J", n: "Replication & Partitioning", tag: "Copies of data, and splitting data", hue: 172, own: "Distributed database nodes",
  d: "Replication keeps copies of the same data on several nodes (leader-follower, multi-leader, leaderless). Partitioning (sharding) splits different data across nodes. Real systems do both: each partition is replicated.",
  loc: ["MULTI", "NET", "DISK"] });
L({ id: "K", n: "Consensus & Coordination", tag: "Agree on one order despite failures", hue: 140, own: "Consensus group (Raft/Paxos) and coordination services",
  d: "Consensus makes a group of nodes agree on a single sequence of decisions, even when some crash or the network splits. Raft is the reference algorithm here. Coordination services (ZooKeeper, etcd) expose it as locks, leases and configuration.",
  loc: ["MULTI", "DISK", "RAM"] });
L({ id: "L", n: "Distributed Transactions", tag: "Atomic work across nodes or services", hue: 95, own: "Transaction coordinators, services",
  d: "Two-phase commit makes several databases commit or abort together but can block. Across microservices, sagas, the outbox pattern and idempotent consumers give practical atomicity with at-least-once delivery.",
  loc: ["MULTI", "NET", "DISK"] });
L({ id: "M", n: "LSM & Modern Storage", tag: "Log-structured, columnar, compressed", hue: 205, own: "Storage engines (RocksDB, Cassandra, analytics engines)",
  d: "LSM trees turn random writes into sequential ones: WAL + MemTable in RAM, immutable SSTables on disk, compaction in the background. Column stores compress data (dictionary, RLE, bit packing, delta, bitmaps) and skip blocks with zone maps.",
  loc: ["RAM", "DISK"] });
L({ id: "N", n: "Distributed Execution", tag: "Queries and jobs across a cluster", hue: 228, own: "Query coordinators, workers, schedulers",
  d: "Splits a query or job into tasks that run near the data, exchanges intermediate data over the network (shuffle), and combines results. MapReduce, Spark and parallel SQL engines all follow this pattern, with local operators from the Query Processing layer.",
  loc: ["MULTI", "NET", "CPU", "DISK"] });

/* Groups (subsystems) */
G("A1", "A", "Clients & APIs", "How programs reach a database or a service.");
G("A2", "A", "Request lifecycle", "What a request goes through from send to response.");
G("B1", "B", "Front end", "SQL text to a validated logical plan.");
G("B2", "B", "Optimizer", "Choose the cheapest physical plan.");
G("B3", "B", "Execution models", "How operators pass tuples to each other.");
G("B4", "B", "Operators", "Scans, joins, sorts, aggregates and their memory needs.");
G("C1", "C", "Files & pages", "How a table becomes files of fixed-size pages.");
G("C2", "C", "Records", "How tuples are laid out inside a page.");
G("C3", "C", "Layout models & catalog", "Row, column, hybrid, index-organized; metadata.");
G("D1", "D", "Hashing", "Hash functions and every collision scheme.");
G("D2", "D", "Trees", "B-trees and B+ trees: ordered, disk-friendly indexes.");
G("D3", "D", "Other structures", "Filters, skip lists, heaps, runs and replacement lists.");
G("E1", "E", "Buffer pool structures", "Frames, page table, pins, dirty flags.");
G("E2", "E", "Buffer pool API", "What operators and indexes call.");
G("E3", "E", "Replacement policies", "Which page to evict when no frame is free.");
G("E4", "E", "Disk I/O path", "From buffer pool to the OS and the device.");
G("F1", "F", "Theory", "What correctness means for concurrent transactions.");
G("F2", "F", "Locking", "Two-phase locking and its machinery.");
G("F3", "F", "Versions & timestamps", "MVCC, timestamp ordering, optimistic control.");
G("F4", "F", "Physical synchronization", "Latches and atomics for in-memory structures.");
G("G1", "G", "The log", "WAL, LSNs, log records, commit.");
G("G2", "G", "Buffer & checkpoint policies", "Steal/force, shadow paging, checkpoints.");
G("G3", "G", "Crash recovery", "ARIES: analysis, redo, undo.");
G("H1", "H", "CPU & execution", "Cores, threads, scheduling, syscalls, interrupts.");
G("H2", "H", "Virtual memory", "Addresses, page tables, TLB, faults, allocators.");
G("H3", "H", "Files & storage I/O", "Filesystems, page cache, block layer, devices.");
G("H4", "H", "Sync & IPC", "Kernel-level synchronization and communication.");
G("H5", "H", "Networking", "Sockets and the TCP/IP stack.");
G("I1", "I", "Communication", "RPC, serialization, transport, traffic control.");
G("I2", "I", "Failures", "Partial failure, partitions, timeouts, retries.");
G("I3", "I", "Time & order", "Clocks, causality and logical time.");
G("I4", "I", "Consistency & placement", "Consistency models, CAP, quorums, hashing.");
G("J1", "J", "Replication topologies", "Who accepts writes and how changes flow.");
G("J2", "J", "Replication lag guarantees", "What readers can see while replicas catch up.");
G("J3", "J", "Leaderless mechanics", "Quorums and repair.");
G("J4", "J", "Conflicts", "Concurrent writes to the same data.");
G("J5", "J", "Partitioning", "Splitting data across nodes.");
G("K1", "K", "Raft", "The consensus algorithm, piece by piece.");
G("K2", "K", "Consensus concepts", "What consensus is and what it is not.");
G("K3", "K", "Coordination", "Locks, leases, fencing, coordination services.");
G("L1", "L", "Atomic commit", "Two-phase commit across databases.");
G("L2", "L", "Service-level patterns", "Sagas, outbox, delivery semantics.");
G("M1", "M", "LSM tree", "Write path, read path and compaction.");
G("M2", "M", "Columnar & compression", "Analytics storage and encodings.");
G("N1", "N", "Batch execution", "MapReduce-style jobs.");
G("N2", "N", "Parallel analytics", "Parallel SQL, materialized views, streams.");
