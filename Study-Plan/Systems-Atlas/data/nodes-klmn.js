/* Layer K: Consensus & Coordination */
N({ id: "raft", g: "K1", n: "Raft", ab: "Raft consensus replicated log etcd", loc: ["MULTI", "DISK", "RAM", "NET"], ln: "Persistent log + term/vote on each node's disk; volatile indices in RAM; RPCs over the network", own: "Each member of the consensus group",
  p: "Several servers must agree on the same sequence of commands even if some crash or the network splits, without ever disagreeing.",
  s: "One leader per term receives commands, appends them to its log and replicates them with AppendEntries. An entry is committed once stored on a majority; every server applies committed entries in log order to its state machine.",
  h: ["Followers wait for heartbeats; on an election timeout one becomes a candidate (term+1) and requests votes.", "A majority of votes makes it leader for that term.", "Leader appends client commands and sends AppendEntries (with prevLogIndex/prevLogTerm consistency check).", "Majority stored → leader advances commitIndex; followers learn it in later RPCs.", "Everyone applies committed entries in order.", "Snapshots compact the log; joint consensus changes membership."],
  ds: "Persistent: currentTerm, votedFor, log[]. Volatile: commitIndex, lastApplied; leader: nextIndex[], matchIndex[].", al: "Randomized election timeouts; majority quorums; election restriction; log matching.",
  cx: "A commit needs one round trip to a majority plus a durable log write on each.",
  pro: ["Understandable; strong safety; used widely."], con: ["Leader is a throughput bottleneck; the minority side of a partition cannot make progress."],
  f: ["Leader crash: new election after a timeout.", "Partition: only the side with a majority can commit.", "Old leader on the minority side keeps believing it leads until it hears a higher term; its uncommitted entries are later overwritten."],
  art: `client → [Leader t=3] ──AppendEntries──▶ [F1] ✔
                         └─────────────▶ [F2] ✔  majority → commit
                         └──────✘──────▶ [F3] (partitioned)`,
  an: "A committee with a chair: the chair writes proposals in the minutes, and a proposal counts once most members have copied it into their own minutes.",
  ex: "etcd, Consul, CockroachDB (one Raft group per range), TiKV, MongoDB's protocol is Raft-like.", cmp: "consrepl", rel: ["rpc", "timeouts", "partialfail", "wal", "replog"] });
N({ id: "raftroles", g: "K1", n: "Roles, terms & log indices", ab: "leader follower candidate term index", loc: ["RAM", "DISK"], own: "Raft",
  p: "Know who leads and detect stale leaders.",
  s: "Each server is a follower, candidate or leader. Terms are numbered, increase monotonically, and act as a logical clock: any message with a higher term makes the receiver update its term and step down. Each log entry has (index, term)." });
N({ id: "raftelect", g: "K1", n: "Elections & heartbeats", ab: "RequestVote election timeout heartbeat", loc: ["NET", "RAM"], own: "Raft",
  p: "Pick a new leader when the current one stops responding.",
  s: "The leader sends periodic heartbeats (empty AppendEntries). A follower that hears nothing for a randomized timeout (e.g. 150–300 ms) starts an election. Each server votes once per term, only for a candidate whose log is at least as up to date.",
  f: ["Split votes: nobody wins; randomized timeouts make a repeat unlikely."], rel: ["timeouts"] });
N({ id: "raftlog", g: "K1", n: "Log replication & commit index", ab: "AppendEntries commitIndex matchIndex nextIndex", loc: ["NET", "DISK", "RAM"], own: "Raft",
  p: "Copy the leader's log to followers and decide when an entry is safe.",
  s: "AppendEntries carries entries plus the previous entry's (index, term); followers reject on mismatch and the leader backs nextIndex up until logs match, then overwrites the follower's conflicting suffix. commitIndex advances when a majority's matchIndex covers an entry from the current term.", rel: ["quorum"] });
N({ id: "raftsafety", g: "K1", n: "Raft safety properties", ab: "election safety log matching leader completeness state machine safety", loc: ["LOGIC"], own: "Raft",
  p: "State exactly what can never go wrong.",
  s: "Election safety (≤1 leader per term), leader append-only, log matching (same index+term ⇒ identical prefix), leader completeness (committed entries appear in all future leaders' logs), state machine safety (no two servers apply different commands at one index). A leader only commits earlier-term entries indirectly, by committing one from its own term." });
N({ id: "raftpersist", g: "K1", n: "Persistent state", ab: "currentTerm votedFor log fsync", loc: ["DISK"], own: "Raft",
  p: "A server that forgets its vote or log after a restart could break safety.",
  s: "currentTerm, votedFor and the log must be on stable storage (fsync) before replying to RPCs. Commit and apply indices can be rebuilt.", rel: ["wal", "directio"] });
N({ id: "raftsnap", g: "K1", n: "Snapshots & log compaction", ab: "snapshot InstallSnapshot log compaction", loc: ["DISK", "NET"], own: "Raft",
  p: "The log grows forever.",
  s: "Each server snapshots its state machine (with last included index and term) and discards earlier log entries. Followers too far behind receive the snapshot via InstallSnapshot.", rel: ["checkpoint"] });
N({ id: "raftmember", g: "K1", n: "Membership changes", ab: "joint consensus single-server change", loc: ["MULTI"], own: "Raft",
  p: "Switching directly from old to new configuration can create two disjoint majorities.",
  s: "Joint consensus: a transitional configuration C_old,new needs majorities of both. A simpler variant adds or removes one server at a time. New servers first catch up as non-voters." });
N({ id: "raftfail", g: "K1", n: "Raft failure scenarios", ab: "leader crash partition stale leader", loc: ["MULTI", "NET"], own: "Raft",
  p: "See how Raft behaves when things break.",
  s: "Follower crash: leader retries forever (RPCs are idempotent). Leader crash: election. Partition: majority side elects a leader and continues; minority side cannot commit; when healed, the old leader sees a higher term and steps down. Timing affects availability, never safety.", rel: ["partition", "partialfail"] });
N({ id: "consensus", g: "K2", n: "Consensus & FLP", ab: "consensus Paxos Zab VR FLP impossibility", loc: ["LOGIC", "MULTI"], own: "Theory",
  p: "Agree on one value (or one sequence) despite failures.",
  s: "Properties: agreement, validity, termination. FLP: no deterministic algorithm guarantees termination in a fully asynchronous network with even one crash, so real algorithms (Paxos, Raft, Zab, Viewstamped Replication) use timeouts for liveness and never rely on timing for safety.", rel: ["safetyliveness"] });
N({ id: "consvsrepl", g: "K2", n: "Consensus vs replication", ab: "consensus replication difference", loc: ["LOGIC"], own: "Design",
  p: "Copying data is not the same as agreeing on it.",
  s: "Ordinary async replication copies the leader's changes; if the leader dies, a follower may be promoted missing writes, and two nodes can both believe they lead. Consensus-based replication only acknowledges what a majority stored and elects leaders safely, so no acknowledged write is lost and there is never split brain.", cmp: "consrepl" });
N({ id: "tob", g: "K2", n: "Total order broadcast", ab: "atomic broadcast total order broadcast", loc: ["LOGIC", "MULTI"], own: "Theory",
  p: "Deliver the same messages in the same order to every node.",
  s: "Equivalent to consensus. A replicated log (Raft) is total order broadcast; applying it gives state machine replication." });
N({ id: "zk", g: "K3", n: "ZooKeeper / etcd coordination", ab: "ZooKeeper etcd Chubby coordination service", loc: ["MULTI", "DISK"], own: "Coordination service cluster",
  p: "Applications need leader election, configuration and locks without implementing consensus themselves.",
  s: "A small replicated store built on consensus (Zab in ZooKeeper, Raft in etcd) exposing linearizable writes, watches, ephemeral nodes and leases.", ex: "Kafka (older versions), HBase and Kubernetes (etcd) use them for cluster metadata." });
N({ id: "distlock", g: "K3", n: "Distributed locks", ab: "distributed lock lease lock", loc: ["MULTI"], own: "Coordination service",
  p: "Ensure only one node does something (e.g. acts as leader, owns a partition).",
  s: "A lock held in a coordination service, usually with a lease that expires if the holder dies.", f: ["A paused (GC) or partitioned holder may still believe it holds the lock after expiry: use fencing tokens."] });
N({ id: "fencing", g: "K3", n: "Fencing tokens", ab: "fencing token epoch", loc: ["LOGIC", "DISK"], own: "Lock service + storage",
  p: "A stale lock holder must not corrupt data.",
  s: "Each lock grant comes with an increasing number. The storage service rejects writes carrying a token smaller than one it has already seen.",
  art: `lock → client1 (token 33)  …pauses…
lock → client2 (token 34) → write ok
client1 wakes → write(33) → REJECTED`, rel: ["raftroles"] });
N({ id: "leases", g: "K3", n: "Leases & their limits", ab: "lease time-bounded lock", loc: ["LOGIC"], own: "Coordination",
  p: "Give temporary authority without needing a reply from a dead holder.",
  s: "A lock that expires after a time unless renewed. Depends on bounded clock drift and pauses; a process paused longer than the lease acts on stale authority unless fenced.", rel: ["clockskew"] });

/* Layer L: Distributed Transactions */
N({ id: "twopc", g: "L1", n: "Two-phase commit (2PC)", ab: "2PC atomic commit XA", loc: ["MULTI", "DISK", "NET"], own: "Coordinator + participants",
  p: "A transaction touched several databases (or shards); all must commit or all abort.",
  s: "Phase 1 (prepare): the coordinator asks every participant to prepare; each makes its changes durable (WAL) and votes yes/no. Phase 2: if all voted yes, the coordinator logs COMMIT and tells everyone to commit; otherwise abort.",
  h: ["Coordinator → PREPARE to all.", "Each participant writes a prepare record to its WAL, keeps locks, votes YES or NO.", "Coordinator writes its decision to its log (commit point).", "Coordinator → COMMIT/ABORT; participants apply, release locks, ack."],
  art: `C ──prepare──▶ P1 ✔yes   P2 ✔yes
C [log COMMIT]
C ──commit───▶ P1, P2 → release locks`,
  pro: ["Atomic across nodes."], con: ["Blocking if the coordinator fails after prepare; locks held across network round trips."], cmp: "twopcsaga", rel: ["wal", "sharding", "clienttxn"] });
N({ id: "coordpart", g: "L1", n: "Coordinator & participants", ab: "transaction manager resource manager", loc: ["MULTI"], own: "2PC roles",
  p: "Someone must collect votes and decide.",
  s: "The coordinator (transaction manager) runs the protocol and logs the decision; participants (resource managers) hold local transactions and follow the decision. A 'yes' vote is a promise that the participant can commit even after a crash." });
N({ id: "twopcblock", g: "L1", n: "2PC blocking failures", ab: "in-doubt blocking coordinator failure", loc: ["MULTI"], own: "2PC",
  p: "Know when 2PC gets stuck.",
  s: "A participant that voted yes is 'in doubt': it cannot decide alone. If the coordinator crashes before sending the decision, participants keep holding locks until it recovers. Fixes: replicate the coordinator's decision with consensus (Paxos Commit, Spanner).", rel: ["consensus"] });
N({ id: "distdeadlock", g: "L1", n: "Distributed deadlocks", ab: "global deadlock", loc: ["MULTI"], own: "Distributed lock managers",
  p: "Each node sees no cycle, but the global wait-for graph has one.",
  s: "Detect by collecting wait-for edges centrally, or avoid with timeouts or timestamp-based prevention (wait-die/wound-wait).", rel: ["deadlock"] });
N({ id: "saga", g: "L2", n: "Sagas", ab: "saga orchestration choreography long-running transaction", loc: ["MULTI", "DISK"], own: "Services",
  p: "Microservices own separate databases; 2PC across them is slow and couples availability.",
  s: "Split the business transaction into local transactions T1..Tn, each committed in its own service. If Tk fails, run compensations Ck−1..C1 in reverse. Orchestrated (central coordinator) or choreographed (events).",
  con: ["No isolation: others see intermediate states."], cmp: "twopcsaga" });
N({ id: "compensate", g: "L2", n: "Compensating actions", ab: "compensation undo business", loc: ["LOGIC"], own: "Services",
  p: "Undo a step that already committed.",
  s: "A semantic undo (refund a payment, release a reservation), not a database rollback. Must be idempotent and retryable." });
N({ id: "txnboundary", g: "L2", n: "Transaction boundaries across services", ab: "service boundary consistency boundary", loc: ["LOGIC"], own: "Architecture",
  p: "Decide what must be atomic.",
  s: "Keep data that must change atomically inside one service's database (one local ACID transaction). Across services, accept eventual consistency with sagas." });
N({ id: "outbox", g: "L2", n: "Outbox pattern", ab: "transactional outbox CDC", loc: ["DISK", "MULTI"], own: "Service + relay",
  p: "Writing to the DB and publishing an event are two systems: one can succeed while the other fails (dual write).",
  s: "In the SAME local transaction, write the business change and an 'outbox' row. A relay (polling or change data capture) publishes outbox rows to the message broker, at least once.",
  art: `BEGIN
  INSERT order
  INSERT outbox(event)
COMMIT ─▶ relay ─▶ broker ─▶ consumers`, rel: ["replog", "delivery"] });
N({ id: "idemconsumer", g: "L2", n: "Idempotent consumers", ab: "dedup consumer message id", loc: ["DISK"], own: "Consumer service",
  p: "At-least-once delivery means duplicates.",
  s: "Record processed message IDs (in the same transaction as the effect) and skip repeats.", rel: ["idempotency"] });
N({ id: "delivery", g: "L2", n: "Delivery semantics", ab: "at-most-once at-least-once exactly-once", loc: ["LOGIC"], own: "Messaging",
  p: "What does 'delivered' promise?",
  s: "At-most-once: never retried, may be lost. At-least-once: retried, may duplicate. 'Exactly-once' in practice means at-least-once delivery + idempotent or transactional processing, so the EFFECT happens once.",
  mis: "No network can guarantee a message is delivered exactly once; only effects can be made exactly-once." });

/* Layer M: LSM & Modern Storage */
N({ id: "lsm", g: "M1", n: "LSM tree", ab: "log-structured merge tree RocksDB LevelDB Cassandra", loc: ["RAM", "DISK"], ln: "MemTable in RAM; WAL and SSTables on disk; Bloom filters and indexes cached in RAM", own: "Storage engine",
  p: "B+ trees do random in-place writes; write-heavy workloads want sequential writes.",
  s: "Buffer writes in a sorted in-memory MemTable (logged in a WAL), flush it as an immutable sorted SSTable, and merge SSTables in the background (compaction). Reads check the MemTable, then SSTables newest to oldest.",
  h: ["Write: append to WAL, insert into MemTable.", "MemTable full → becomes immutable → flushed to an L0 SSTable.", "Compaction merges SSTables into larger sorted runs, dropping overwritten values and tombstones.", "Read: MemTable → immutable MemTables → L0 files → L1 … Ln, skipping files with Bloom filters and key ranges."],
  pro: ["High write throughput; good compression; SSD friendly."], con: ["Read amplification; compaction uses I/O and CPU; write amplification."],
  art: `write → WAL(disk) + MemTable(RAM)
           │ flush
L0: [sst][sst][sst]   (overlapping)
L1: [ a-f ][ g-m ][ n-z ]
L2: [...........10× bigger.........]`, cmp: "indexes", ex: "RocksDB, LevelDB, Cassandra, ScyllaDB, HBase, InfluxDB.", rel: ["wal", "skiplist", "bloom"] });
N({ id: "memtable", g: "M1", n: "MemTable", ab: "memtable skiplist write buffer", loc: ["RAM"], own: "LSM engine",
  p: "Absorb writes quickly, in sorted order.",
  s: "An in-memory sorted structure (often a skip list). Lost on crash, which is why every write first goes to the WAL.", rel: ["skiplist"] });
N({ id: "lsmwal", g: "M1", n: "WAL in an LSM engine", ab: "commit log", loc: ["DISK", "RAM"], own: "LSM engine",
  p: "Recover the MemTable after a crash.",
  s: "Each write is appended to a log before being acknowledged. After a crash, replay the log to rebuild the MemTable. Once a MemTable is flushed, its log segment can be deleted.", rel: ["wal"] });
N({ id: "sstable", g: "M1", n: "Immutable SSTables", ab: "SSTable sorted string table", loc: ["DISK"], own: "LSM engine",
  p: "Persist sorted data in a form that is cheap to write and search.",
  s: "A file of key-sorted blocks plus an index block, a Bloom filter and metadata. Never modified after writing; only replaced by compaction.", rel: ["sortedrun"] });
N({ id: "flush", g: "M1", n: "Flush", ab: "memtable flush minor compaction", loc: ["RAM", "DISK"], own: "LSM engine",
  p: "Free memory and make data durable as a sorted file.",
  s: "Freeze the full MemTable, write it sequentially as a new L0 SSTable, then drop it and its WAL segment." });
N({ id: "compaction", g: "M1", n: "Compaction", ab: "compaction merge major compaction", loc: ["DISK", "CPU"], own: "LSM engine background threads",
  p: "Too many overlapping SSTables make reads slow and waste space.",
  s: "Merge-sort several SSTables into new ones, keeping only the newest version of each key and dropping tombstones that are old enough.",
  f: ["Compaction falling behind → write stalls and growing read latency."], rel: ["amplification"] });
N({ id: "leveled", g: "M1", n: "Leveled compaction", ab: "leveled compaction LCS", loc: ["DISK"], own: "LSM engine",
  p: "Bound read amplification and space.",
  s: "Each level is about 10× larger than the previous and holds non-overlapping SSTables (except L0). Compacting one file into the next level rewrites the overlapping files there.",
  pro: ["Low read and space amplification."], con: ["High write amplification."], cmp: "compaction" });
N({ id: "tiered", g: "M1", n: "Tiered (size-tiered) compaction", ab: "size-tiered STCS universal compaction", loc: ["DISK"], own: "LSM engine",
  p: "Minimize rewriting.",
  s: "Wait until several SSTables of similar size accumulate, then merge them into one bigger file.",
  pro: ["Low write amplification."], con: ["More files to check on reads; temporary space spikes."], cmp: "compaction" });
N({ id: "lsmtomb", g: "M1", n: "Tombstones in LSM", ab: "delete marker range tombstone", loc: ["DISK", "RAM"], own: "LSM engine",
  p: "You cannot delete from an immutable file.",
  s: "A delete writes a tombstone that hides older values. Compaction drops the tombstone once no older version can exist below it.", f: ["Many tombstones slow down reads (scans step over them)."], rel: ["tombstone"] });
N({ id: "lsmbloom", g: "M1", n: "Bloom filters per SSTable", ab: "filter block", loc: ["RAM", "DISK"], own: "LSM engine",
  p: "Point reads would otherwise open every SSTable.",
  s: "Each SSTable stores a Bloom filter of its keys; readers load it into memory and skip files that definitely do not contain the key.", rel: ["bloom"] });
N({ id: "amplification", g: "M1", n: "Read, write & space amplification", ab: "RUM conjecture amplification", loc: ["LOGIC"], own: "Storage engine design",
  p: "Measure the hidden cost of a storage design.",
  s: "Write amp = bytes written to disk / bytes written by the user. Read amp = I/Os per read. Space amp = disk size / live data size. Improving one usually worsens another (RUM conjecture).",
  ex: "Leveled LSM: write amp 10–30×, low space amp. B+ tree: rewrites a whole page for a tiny update." });
N({ id: "columnar", g: "M2", n: "Columnar analytics storage", ab: "Parquet ORC column store", loc: ["DISK"], own: "Analytics engines",
  p: "Scan billions of rows but few columns.",
  s: "Column-oriented files (Parquet, ORC) or engines (ClickHouse, Snowflake) with compression, statistics per block and vectorized execution.", rel: ["dsm", "pax", "vectorized"] });
N({ id: "compression", g: "M2", n: "Compression goals & granularity", ab: "compression late materialization naive compression", loc: ["DISK", "RAM", "CPU"], own: "Storage engine",
  p: "Disk I/O is the bottleneck; smaller data means fewer I/Os.",
  s: "Prefer fixed-length codes, late materialization (operate on compressed data as long as possible) and lossless schemes. Granularity: block, tuple, attribute or column. General-purpose compressors (LZ4, Zstd) on pages cannot be queried without decompressing.", cmp: "encodings" });
N({ id: "dictenc", g: "M2", n: "Dictionary encoding", ab: "dictionary compression order-preserving", loc: ["DISK", "RAM"], own: "Column store",
  p: "Long repeated values waste space.",
  s: "Replace each value with a small integer code and keep a dictionary. Order-preserving codes allow range predicates and sorting on the codes.",
  ex: "['Cairo','Berlin','Cairo'] → dict {Berlin:0, Cairo:1}, codes [1,0,1].", cmp: "encodings" });
N({ id: "rle", g: "M2", n: "Run-length encoding (RLE)", ab: "RLE run length", loc: ["DISK", "RAM"], own: "Column store",
  p: "Sorted or low-cardinality columns contain long runs.",
  s: "Store (value, start, length) triplets. Sorting the column first creates longer runs.", ex: "M,M,M,F,F → (M,0,3),(F,3,2)", cmp: "encodings" });
N({ id: "bitpack", g: "M2", n: "Bit packing & mostly encoding", ab: "bit packing frame of reference mostly encoding", loc: ["DISK", "RAM"], own: "Column store",
  p: "Values declared as 64-bit often fit in a few bits.",
  s: "Store each value in the minimum bits needed. Mostly encoding stores most values packed and keeps outliers in a separate table.", cmp: "encodings" });
N({ id: "delta", g: "M2", n: "Delta encoding", ab: "delta compression", loc: ["DISK", "RAM"], own: "Column store",
  p: "Consecutive values (timestamps, sorted IDs) differ only slightly.",
  s: "Store the first value and then differences; combine with RLE or bit packing.", ex: "12:00,12:01,12:02 → 12:00,+1,+1", cmp: "encodings" });
N({ id: "bitmapenc", g: "M2", n: "Bitmap encoding", ab: "bitmap index Roaring bitmap", loc: ["DISK", "RAM"], own: "Column store",
  p: "Fast filters on low-cardinality columns.",
  s: "One bitmap per distinct value; bit i says whether row i has that value. Only for low cardinality; compressed variants such as Roaring for sparse bitmaps.", cmp: "encodings" });
N({ id: "zonemap", g: "M2", n: "Zone maps & data skipping", ab: "min max index zone map small materialized aggregates", loc: ["DISK", "RAM"], own: "Storage engine",
  p: "Avoid reading blocks that cannot match a filter.",
  s: "Store min/max (and sometimes counts) per block or row group. A scan with WHERE x > 100 skips blocks whose max ≤ 100.", ex: "Parquet row-group statistics, Snowflake micro-partition pruning.", rel: ["pushdown", "seqscan"] });

/* Layer N: Distributed Execution */
N({ id: "mapreduce", g: "N1", n: "MapReduce", ab: "MapReduce Hadoop map reduce", loc: ["MULTI", "DISK", "NET", "CPU"], own: "Batch framework",
  p: "Process datasets far bigger than one machine with simple code and automatic fault tolerance.",
  s: "Map tasks read input splits and emit key-value pairs; the framework shuffles pairs so each key reaches one reducer; reduce tasks combine values per key. Failed tasks are simply re-run because inputs are immutable.",
  art: `split1 ─map─▶ (k,v) ┐            ┌─▶ reduce(k1)
split2 ─map─▶ (k,v) ├─ shuffle ─┤
split3 ─map─▶ (k,v) ┘            └─▶ reduce(k2)`, ex: "Hadoop MapReduce; Spark generalizes it with in-memory stages.", rel: ["shuffle"] });
N({ id: "shuffle", g: "N1", n: "Shuffle", ab: "exchange repartition shuffle", loc: ["NET", "DISK", "MULTI"], own: "Distributed engine",
  p: "Records with the same key are on different machines.",
  s: "Each task partitions its output by hash(key) and sends each partition to the responsible worker over the network (usually through files on local disk). Often the most expensive step.", rel: ["hashpart", "shufflefiles"] });
N({ id: "distsort", g: "N1", n: "Distributed sorting", ab: "TeraSort range partition sort", loc: ["MULTI", "DISK"], own: "Distributed engine",
  p: "Sort data bigger than any one machine.",
  s: "Sample keys to choose range boundaries, range-partition the data so each worker gets one key range, sort locally (external sort), and concatenate.", rel: ["sortop", "rangepart"] });
N({ id: "partjoin", g: "N1", n: "Partitioned & broadcast joins", ab: "shuffle join broadcast join co-located join", loc: ["MULTI", "NET"], own: "Distributed engine",
  p: "Join two distributed tables.",
  s: "Shuffle (partitioned) join: repartition both sides by join key, then hash join locally. Broadcast join: send the small table to every worker. Co-located join: tables already partitioned on the key need no movement.", rel: ["hashjoin"] });
N({ id: "distagg", g: "N1", n: "Distributed aggregation", ab: "combiner partial aggregation two-phase aggregation", loc: ["MULTI", "NET"], own: "Distributed engine",
  p: "Aggregate without sending every row over the network.",
  s: "Partial aggregation on each worker (combiner), shuffle the partial results by group key, final aggregation. Works directly for SUM/COUNT/MIN/MAX; AVG becomes (sum, count).", rel: ["aggop"] });
N({ id: "locality", g: "N1", n: "Data locality", ab: "move computation to data", loc: ["MULTI", "DISK"], own: "Scheduler",
  p: "Moving data over the network is slower than moving code.",
  s: "Schedule tasks on the nodes (or racks) that already store their input blocks." });
N({ id: "taskschedule", g: "N1", n: "Task scheduling & retries", ab: "task scheduler DAG stage", loc: ["MULTI", "CPU"], own: "Coordinator",
  p: "Run thousands of tasks across machines and recover from failures.",
  s: "The coordinator splits a job into stages and tasks, assigns them to workers, tracks heartbeats and re-runs failed or lost tasks (deterministic tasks on immutable inputs make this safe).", rel: ["timeouts", "retries"] });
N({ id: "stragglers", g: "N1", n: "Stragglers & speculative execution", ab: "straggler speculative execution backup task", loc: ["MULTI"], own: "Scheduler",
  p: "One slow machine delays the whole job.",
  s: "Launch backup copies of the slowest remaining tasks and take whichever finishes first." });
N({ id: "shufflefiles", g: "N1", n: "Shuffle files & spill-to-disk", ab: "spill shuffle files", loc: ["DISK", "OS"], own: "Worker processes",
  p: "Intermediate data exceeds memory.",
  s: "Workers sort/partition in memory and spill to local disk files; reducers fetch these files over the network. Uses the local OS filesystem and page cache.", rel: ["spill", "filesystem"] });
N({ id: "parallelquery", g: "N2", n: "Parallel query execution", ab: "exchange operator MPP parallel SQL", loc: ["MULTI", "CPU", "NET"], own: "Distributed SQL engine",
  p: "Run one SQL query on many cores or nodes.",
  s: "The coordinator splits the physical plan into fragments; exchange operators move rows between fragments (gather, repartition, broadcast). Each worker runs ordinary local operators (scans, hash joins).",
  ex: "Presto/Trino, Spark SQL, Greenplum, CockroachDB DistSQL.", rel: ["physplan", "execeng"] });
N({ id: "matview", g: "N2", n: "Materialized views", ab: "materialized view precomputed", loc: ["DISK"], own: "DBMS",
  p: "Re-running an expensive aggregation for every dashboard load is wasteful.",
  s: "Store a query's result and refresh it (fully or incrementally) when the base data changes." });
N({ id: "streaming", g: "N2", n: "Streaming systems", ab: "Kafka Flink stream processing windows", loc: ["MULTI", "DISK", "NET"], own: "Stream processors",
  p: "Process data continuously as it arrives, not in batches.",
  s: "A durable log (Kafka) feeds operators that keep state and compute over windows; checkpoints of operator state plus log offsets give exactly-once effects.", rel: ["delivery", "checkpoint"] });
