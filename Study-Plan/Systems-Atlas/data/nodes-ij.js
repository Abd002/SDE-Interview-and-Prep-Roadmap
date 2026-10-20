/* Layer I: Distributed Fundamentals */
N({ id: "rpc", g: "I1", n: "RPC (HTTP, gRPC)", ab: "remote procedure call gRPC HTTP request", loc: ["NET", "MULTI"], own: "Every networked process",
  p: "Ask another machine to do work.",
  s: "Looks like a function call, but the request and response travel over the network: they can be lost, delayed, duplicated, or the server can crash halfway.",
  h: ["Serialize arguments.", "Send over TCP (HTTP/1.1, HTTP/2 for gRPC).", "Server deserializes, executes, replies.", "Client waits with a timeout."],
  f: ["Timeout: the server may or may not have executed the call."], mis: "An RPC is not a local call: latency is 1000× higher and failure is normal.", rel: ["api", "timeouts", "idempotency"] });
N({ id: "serialization", g: "I1", n: "Serialization", ab: "protobuf JSON Avro encoding marshalling", loc: ["CPU", "RAM"], own: "Client and server libraries",
  p: "Turn in-memory objects into bytes for the network or disk, and back.",
  s: "Formats: JSON (text, self-describing), Protocol Buffers/Avro/Thrift (binary, schema-based, support schema evolution).", f: ["Old and new versions of a service must read each other's messages during a rolling upgrade."] });
N({ id: "tcpudp", g: "I1", n: "TCP vs UDP", ab: "TCP UDP QUIC", loc: ["NET", "OS"], own: "Kernel network stack",
  p: "Pick a transport.",
  s: "TCP: reliable ordered stream with connection setup and congestion control. UDP: individual datagrams, no delivery guarantee, low overhead (used by DNS, QUIC, some gossip protocols).", rel: ["tcpip"] });
N({ id: "latency", g: "I1", n: "Latency & throughput", ab: "latency throughput tail latency p99 bandwidth", loc: ["NET", "LOGIC"], own: "System property",
  p: "Measure and reason about speed.",
  s: "Latency = time for one request; throughput = requests per second. Tail latency (p99) matters because a request fanning out to many servers waits for the slowest.",
  ex: "Same datacenter round trip ~0.5 ms; cross-continent ~100 ms." });
N({ id: "lb", g: "I1", n: "Load balancing", ab: "load balancer round robin least connections", loc: ["NET", "MULTI"], own: "Proxy / client library",
  p: "Spread requests over many servers.",
  s: "Round robin, least connections, or hashing (sticky). Health checks remove dead servers.", rel: ["conshash"] });
N({ id: "discovery", g: "I1", n: "Service discovery", ab: "DNS Consul etcd registry", loc: ["MULTI", "NET"], own: "Coordination service / DNS",
  p: "Find the current addresses of a service whose instances come and go.",
  s: "Instances register in a registry (DNS, Consul, etcd, Kubernetes); clients look them up. Database clients similarly need to find the current leader.", rel: ["zk"] });
N({ id: "backpressure", g: "I1", n: "Backpressure", ab: "flow control load shedding queue", loc: ["LOGIC"], own: "Every stage of a pipeline",
  p: "A fast producer can overwhelm a slow consumer until queues and memory explode.",
  s: "Let the consumer slow the producer down: bounded queues, TCP flow control, rejecting requests (load shedding).", rel: ["conpool"] });
N({ id: "circuitbreaker", g: "I1", n: "Circuit breakers", ab: "circuit breaker", loc: ["RAM", "LOGIC"], own: "Client library",
  p: "Retrying against a failing dependency makes things worse.",
  s: "After repeated failures, stop calling the dependency for a while (open), then try a few calls (half-open) before resuming (closed)." });
N({ id: "partialfail", g: "I2", n: "Partial failure & failure types", ab: "partial failure crash fault process crash machine failure Byzantine", loc: ["MULTI", "LOGIC"], own: "Distributed system",
  p: "In a single machine, things mostly work or crash entirely. In a cluster, some parts fail while others run.",
  s: "Distinguish: a process crash (restarts, disk intact), a machine failure (its disk may be lost), a network partition (nodes alive but unreachable), a slow node (looks dead), and Byzantine faults (arbitrary or malicious behavior, usually not handled by databases).",
  mis: "From the outside, a crashed node, a partitioned node and a slow node look the same: no reply." });
N({ id: "partition", g: "I2", n: "Network partitions", ab: "network partition split brain", loc: ["NET", "MULTI"], own: "Network",
  p: "Nodes can be cut into groups that cannot talk to each other.",
  s: "Each side may think the other is dead. A system must then choose: refuse some requests (stay consistent) or accept them on both sides (stay available, risk conflicts).",
  f: ["Split brain: two leaders accept writes."], rel: ["cap", "fencing", "raftfail"] });
N({ id: "timeouts", g: "I2", n: "Timeouts & failure detection", ab: "timeout heartbeat failure detector phi accrual", loc: ["RAM", "NET"], own: "Every node",
  p: "You cannot tell a dead node from a slow one; you can only wait.",
  s: "Heartbeats and timeouts suspect failure. Short timeouts react fast but cause false suspicions; long ones leave the system stuck longer.", rel: ["raftelect"] });
N({ id: "retries", g: "I2", n: "Retries & duplicate requests", ab: "retry exponential backoff jitter duplicate", loc: ["RAM", "NET"], own: "Clients",
  p: "Lost requests or replies must be retried, but the first attempt may have succeeded.",
  s: "Retry with exponential backoff and jitter. Because a retry can duplicate work, the server must deduplicate (idempotency keys) or the operation must be idempotent.", rel: ["idempotency"] });
N({ id: "idempotency", g: "I2", n: "Idempotency", ab: "idempotent idempotency key dedup", loc: ["LOGIC", "DISK"], own: "Server / application",
  p: "Make retries safe.",
  s: "An operation is idempotent if doing it twice has the same effect as once (SET x=5 yes; x=x+1 no). Non-idempotent requests carry a unique ID that the server records and checks.",
  ex: "Payment APIs take an Idempotency-Key header; Raft clients attach serial numbers to commands.", rel: ["idemconsumer", "delivery"] });
N({ id: "clockskew", g: "I3", n: "Physical clocks & skew", ab: "NTP clock skew clock drift TrueTime", loc: ["CPU", "MULTI"], own: "Each machine",
  p: "Ordering events by wall-clock time across machines is unreliable.",
  s: "Each machine's clock drifts; NTP corrects it within milliseconds, sometimes jumping backward. Spanner's TrueTime exposes clock uncertainty intervals and waits them out.",
  f: ["Last-write-wins with skewed clocks silently drops the truly later write."], rel: ["lww"] });
N({ id: "happensbefore", g: "I3", n: "Happens-before, concurrency & causality", ab: "happens before causality concurrent events partial order", loc: ["LOGIC"], own: "Theory",
  p: "Define order without trusting clocks.",
  s: "a → b if a and b are on the same node and a came first, or a is sending a message and b is receiving it, or by transitivity. If neither a → b nor b → a, the events are concurrent.", rel: ["conflicts"] });
N({ id: "lamport", g: "I3", n: "Lamport timestamps", ab: "Lamport clock logical clock", loc: ["RAM", "LOGIC"], ln: "A counter in each process; sent inside messages", own: "Each process",
  p: "Get a total order consistent with causality.",
  s: "Each node keeps a counter: increment on each event; send it with messages; on receive set counter = max(local, received) + 1. Ties broken by node ID.",
  mis: "If a → b then L(a) < L(b), but L(a) < L(b) does NOT imply a → b; Lamport clocks cannot detect concurrency.",
  art: `A: 1 ──msg(1)──┐   3
B:     2        └─▶ max(2,1)+1 = 3`, ex: "Total order for mutual exclusion; tie-breaking in many protocols." });
N({ id: "vectorclock", g: "I3", n: "Vector clocks", ab: "vector clock version vector", loc: ["RAM", "LOGIC"], own: "Each process / each value",
  p: "Detect whether two events are ordered or concurrent.",
  s: "A vector of counters, one per node. Compare element-wise: one ≤ the other in all entries → ordered; otherwise concurrent. Version vectors apply the same idea to replicas of a key.",
  ex: "Riak and Dynamo-style stores keep sibling values when version vectors show concurrency.", rel: ["appmerge"] });
N({ id: "eventual", g: "I4", n: "Eventual consistency", ab: "eventual consistency convergence", loc: ["LOGIC", "MULTI"], own: "Consistency model",
  p: "Stay available and fast across replicas.",
  s: "If writes stop, all replicas eventually converge to the same value. Until then reads may be stale or differ between replicas.", rel: ["replag", "leaderless"] });
N({ id: "linearizability", g: "I4", n: "Linearizability", ab: "atomic consistency strong consistency", loc: ["LOGIC", "MULTI"], own: "Consistency model",
  p: "Make a replicated object behave like a single copy.",
  s: "Every operation appears to take effect at one instant between its start and its end, and all clients agree on that order (real-time recency).",
  pro: ["Easy to reason about; needed for locks and leader election."], con: ["Requires coordination; unavailable on the minority side of a partition."], cmp: "linser", rel: ["raft", "cap"] });
N({ id: "seqcons", g: "I4", n: "Sequential consistency", ab: "sequential consistency", loc: ["LOGIC"], own: "Consistency model",
  p: "A weaker but still single-order model.",
  s: "All processes see operations in one total order that respects each process's program order, but not necessarily real time." });
N({ id: "linvsser", g: "I4", n: "Serializability vs linearizability", ab: "strict serializability", loc: ["LOGIC"], own: "Theory",
  p: "Two 'strong' guarantees that are easy to mix up.",
  s: "Serializability: transactions (groups of operations on many objects) behave as if run in SOME serial order. Linearizability: single operations on one object respect real-time order. Both together = strict serializability.", cmp: "linser" });
N({ id: "safetyliveness", g: "I4", n: "Safety & liveness", ab: "safety liveness FLP", loc: ["LOGIC"], own: "Theory",
  p: "State what an algorithm guarantees.",
  s: "Safety: nothing bad ever happens (two leaders in one term never). Liveness: something good eventually happens (a leader is eventually elected). Consensus keeps safety always and liveness only when the network behaves." });
N({ id: "cap", g: "I4", n: "CAP theorem", ab: "CAP consistency availability partition tolerance PACELC", loc: ["LOGIC"], own: "Theory",
  p: "What you must give up during a network partition.",
  s: "When a partition happens, a system cannot be both linearizable and available to every request on every side. It is not 'pick 2 of 3': partitions are not optional. PACELC adds: Else (no partition), trade Latency vs Consistency.",
  mis: "C in CAP is linearizability, not ACID consistency.", rel: ["partition", "linearizability"] });
N({ id: "quorum", g: "I4", n: "Quorums", ab: "majority quorum w+r>n", loc: ["MULTI", "LOGIC"], own: "Replication / consensus protocol",
  p: "Make sure reads see the latest write without asking every replica.",
  s: "With n replicas, require w acks for writes and r for reads. If w + r > n, every read quorum overlaps every write quorum. Majorities (⌊n/2⌋+1) also guarantee any two quorums intersect, the basis of consensus.",
  ex: "n=3, w=2, r=2 tolerates one unavailable replica.", rel: ["quorumrw", "raftlog"] });
N({ id: "conshash", g: "I4", n: "Consistent hashing", ab: "hash ring virtual nodes rendezvous hashing", loc: ["LOGIC", "MULTI"], own: "Partitioning / load balancing",
  p: "Adding a node to hash(key) mod N remaps almost every key.",
  s: "Place nodes and keys on a hash ring; a key belongs to the next node clockwise. Adding or removing a node moves only ~1/N of the keys. Virtual nodes even out the load.",
  art: `     n1
  k3 ●   ● k1 → n2
n3          n2
     ● k2 → n3`, ex: "Dynamo, Cassandra, Riak.", cmp: "sharding", rel: ["hashpart"] });

/* Layer J: Replication & Partitioning */
N({ id: "leaderfollower", g: "J1", n: "Leader-follower replication", ab: "primary replica master slave single-leader", loc: ["MULTI", "NET", "DISK"], own: "Database nodes",
  p: "Keep copies for availability and read scaling while avoiding write conflicts.",
  s: "All writes go to one leader, which streams its change log to followers; reads can go to followers (possibly stale).",
  h: ["Client writes to leader.", "Leader applies locally and appends to its log (often its WAL).", "Followers fetch/receive log entries and apply them.", "Failover: promote a follower if the leader dies."],
  f: ["Failover can lose async writes, or create split brain if the old leader comes back."], cmp: "replmodels", ex: "PostgreSQL streaming replication, MySQL replication, MongoDB replica sets." });
N({ id: "multileader", g: "J1", n: "Multi-leader replication", ab: "multi-master active-active", loc: ["MULTI", "NET"], own: "Database nodes",
  p: "Accept writes in several datacenters or offline clients.",
  s: "Each leader accepts writes and replicates to the others asynchronously. Concurrent writes to the same record conflict and must be resolved.", cmp: "replmodels", rel: ["conflicts"] });
N({ id: "leaderless", g: "J1", n: "Leaderless replication", ab: "Dynamo-style Cassandra Riak", loc: ["MULTI", "NET"], own: "Database nodes + clients",
  p: "No single point that must be up for writes.",
  s: "Clients (or a coordinator node) send writes to several replicas and read from several, using quorums, read repair and anti-entropy to converge.", cmp: "replmodels", rel: ["quorumrw"] });
N({ id: "syncasync", g: "J1", n: "Synchronous vs asynchronous replication", ab: "sync async semi-synchronous", loc: ["MULTI", "NET"], own: "Replication protocol",
  p: "When does the leader confirm a write?",
  s: "Synchronous: after the follower(s) confirm, so no data loss on failover, but a slow follower blocks writes. Asynchronous: immediately, fast but recent writes can be lost if the leader dies. Semi-sync: one synchronous follower.", cmp: "syncasync", rel: ["durablecommit"] });
N({ id: "replog", g: "J1", n: "Replication log formats", ab: "statement-based WAL shipping logical replication CDC binlog", loc: ["DISK", "NET"], own: "Database nodes",
  p: "What exactly is sent to followers?",
  s: "Statement-based (breaks with NOW(), RAND()), physical WAL shipping (tied to storage format and version), logical row-based (decoupled; also used for change data capture), trigger-based.", rel: ["wal"] });
N({ id: "replag", g: "J2", n: "Replication lag", ab: "replica lag stale read", loc: ["MULTI"], own: "Async replication",
  p: "Followers trail the leader by milliseconds to minutes.",
  s: "Reads from a lagging follower return stale data, causing the anomalies below." });
N({ id: "ryw", g: "J2", n: "Read-your-writes (read-after-write)", ab: "read after write consistency", loc: ["LOGIC"], own: "Client routing",
  p: "A user writes, then reads a stale replica and their change is 'gone'.",
  s: "Guarantee a user sees their own writes: read their own data from the leader, or wait for a replica that has caught up to the user's last write position." });
N({ id: "monoreads", g: "J2", n: "Monotonic reads", ab: "monotonic read consistency", loc: ["LOGIC"], own: "Client routing",
  p: "Two reads hit different replicas and time seems to go backward.",
  s: "Route each user to the same replica (e.g. hash of user ID) so reads never go back in time." });
N({ id: "causalcons", g: "J2", n: "Consistent prefix & causal consistency", ab: "causal consistency consistent prefix reads", loc: ["LOGIC", "MULTI"], own: "Replication protocol",
  p: "Readers see an answer before the question.",
  s: "Consistent prefix: writes are seen in an order that makes sense. Causal consistency: if write A causally precedes B, everyone who sees B also sees A. Among the strongest models that can stay available during a partition (when each client sticks to the replicas it has used).", rel: ["happensbefore"] });
N({ id: "quorumrw", g: "J3", n: "Quorum reads & writes", ab: "quorum read write w r n", loc: ["MULTI", "NET"], own: "Leaderless replication",
  p: "Get recent data from a leaderless cluster.",
  s: "Write to w replicas and read from r replicas; with w + r > n at least one read replica has the latest write; pick the newest version (by version number).",
  f: ["Still not linearizable: concurrent writes, sloppy quorums and partial write failures allow stale reads."], rel: ["quorum"] });
N({ id: "readrepair", g: "J3", n: "Read repair", ab: "read repair", loc: ["MULTI"], own: "Leaderless replication",
  p: "Stale replicas need fixing.",
  s: "When a quorum read sees an older version on some replica, write the newer value back to it." });
N({ id: "antientropy", g: "J3", n: "Anti-entropy & Merkle trees", ab: "anti-entropy Merkle tree repair", loc: ["MULTI", "DISK"], own: "Background process",
  p: "Rarely-read keys never get read repair.",
  s: "A background process compares replicas (often with Merkle trees of hashes, so only differing ranges are exchanged) and copies missing data." });
N({ id: "sloppy", g: "J3", n: "Sloppy quorum & hinted handoff", ab: "hinted handoff sloppy quorum", loc: ["MULTI"], own: "Leaderless replication",
  p: "Keep accepting writes when some home replicas are unreachable.",
  s: "Write to other reachable nodes with a hint; they hand the data back when the home node returns. Improves write availability, but a read quorum may miss the write." });
N({ id: "conflicts", g: "J4", n: "Write conflicts & resolution", ab: "conflict resolution concurrent writes", loc: ["LOGIC", "MULTI"], own: "Replication system / application",
  p: "Two replicas accepted different values for the same key concurrently.",
  s: "Avoid conflicts (one home leader per record) or converge: last-write-wins, merge values, keep siblings for the app, or use CRDTs.", rel: ["happensbefore", "vectorclock"] });
N({ id: "lww", g: "J4", n: "Last-write-wins", ab: "LWW timestamp", loc: ["LOGIC"], own: "Conflict resolution",
  p: "Simplest way to converge.",
  s: "Keep the value with the highest timestamp, discard others.", con: ["Silently loses concurrent writes; depends on clock accuracy."], ex: "Cassandra's default." });
N({ id: "appmerge", g: "J4", n: "Application-level merging (siblings)", ab: "siblings merge version vector", loc: ["LOGIC"], own: "Application",
  p: "Only the app knows how to combine concurrent shopping carts.",
  s: "Store all concurrent versions (siblings, detected with version vectors) and let the app merge them on read (e.g. union of carts, with tombstones for removals)." });
N({ id: "crdt", g: "J4", n: "CRDTs", ab: "conflict-free replicated data type", loc: ["LOGIC", "RAM"], own: "Data type design",
  p: "Merge concurrent updates automatically and correctly.",
  s: "Data types (counters, sets, maps, sequences) whose merge is commutative, associative and idempotent, so replicas converge regardless of order.", ex: "Riak data types, collaborative editors (Automerge, Yjs)." });
N({ id: "sharding", g: "J5", n: "Sharding (partitioning)", ab: "partitioning shard horizontal partitioning", loc: ["MULTI", "DISK"], own: "Distributed database",
  p: "Data or load too big for one machine.",
  s: "Split data into partitions, each stored on (and replicated across) different nodes. A router or the client finds the right partition for each key.",
  f: ["Queries across partitions need scatter-gather; transactions across partitions need 2PC."], cmp: "sharding", rel: ["replvspart", "twopc"] });
N({ id: "rangepart", g: "J5", n: "Range partitioning", ab: "key range partitioning", loc: ["LOGIC"], own: "Partitioner",
  p: "Keep related keys together for range scans.",
  s: "Each partition owns a contiguous key range.", pro: ["Efficient range queries."], con: ["Hotspots for sequential keys (timestamps)."], cmp: "sharding", ex: "HBase, Bigtable, CockroachDB ranges." });
N({ id: "hashpart", g: "J5", n: "Hash partitioning", ab: "hash partitioning", loc: ["LOGIC"], own: "Partitioner",
  p: "Spread keys evenly.",
  s: "Partition = hash(key) mapped to a range of hash values (or consistent hashing).", pro: ["Even load."], con: ["Range queries hit every partition."], cmp: "sharding", rel: ["conshash"] });
N({ id: "rebalance", g: "J5", n: "Rebalancing", ab: "rebalance partition move split", loc: ["MULTI", "NET", "DISK"], own: "Cluster manager",
  p: "Nodes are added or removed, or partitions grow.",
  s: "Move partitions between nodes: fixed number of partitions moved whole, dynamic splitting of big ranges, or consistent hashing. Moving data costs network and disk I/O." });
N({ id: "hotspot", g: "J5", n: "Hotspots & skew", ab: "hot key skew celebrity", loc: ["LOGIC"], own: "Workload",
  p: "One partition gets most of the traffic.",
  s: "Caused by popular keys or sequential keys under range partitioning. Mitigate by splitting hot keys (adding a random suffix) or better partition keys." });
N({ id: "globalid", g: "J5", n: "Primary keys & globally unique IDs", ab: "UUID Snowflake ID sequence", loc: ["LOGIC"], own: "Application / DB",
  p: "Auto-increment counters need one coordinator; reusing IDs after failover corrupts data.",
  s: "Use UUIDs (random, no coordination), Snowflake-style IDs (time + machine + sequence), or ranges handed out per node.", ex: "GitHub incident: a promoted MySQL follower reused auto-increment IDs that Redis already referenced." });
N({ id: "replvspart", g: "J5", n: "Replication vs partitioning", ab: "replication partitioning difference", loc: ["LOGIC"], own: "Design",
  p: "Two independent ways to spread data.",
  s: "Replication = the SAME data on several nodes (availability, read scaling, durability). Partitioning = DIFFERENT data on different nodes (capacity, write scaling). Usually combined: every partition has replicas.",
  art: `Partition A: [n1 L] [n2 F] [n3 F]   ← replicas of A
Partition B: [n2 L] [n3 F] [n4 F]   ← replicas of B` });
