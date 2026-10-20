/* Layer A: Applications & Clients */
N({ id: "app", g: "A1", n: "Applications & services", ab: "service backend microservice", loc: ["CPU", "RAM", "NET"], own: "Application process",
  p: "Business logic needs to store and read shared, durable data that outlives the process.",
  s: "Your program. It keeps only temporary state in its own memory and asks a database or another service for anything that must be shared or durable.",
  io: "In: user/HTTP requests. Out: queries to a DBMS, RPCs to other services, responses.",
  h: ["Receive a request (HTTP, gRPC, message).", "Borrow a database connection from the pool.", "Run one or more queries, often inside a transaction.", "Combine results, return a response."],
  pro: ["Stateless app servers scale out easily when state lives in the DB."], con: ["Every request pays network round trips to the database."],
  f: ["The app can crash after the DB committed but before it replied: the client may retry and must not double-apply (see idempotency)."],
  ex: "A shop service handling POST /orders inserts an order row and decrements stock in one transaction.",
  mis: "Treating the app's in-memory cache as the source of truth. After a crash it is gone; only committed DB state is durable." });
N({ id: "driver", g: "A1", n: "SQL client & driver", ab: "JDBC ODBC libpq wire protocol client library", loc: ["RAM", "NET"], own: "Client library inside the app process",
  p: "The app needs a typed API to send SQL and read rows without speaking the DBMS's network protocol by hand.",
  s: "A library (JDBC, ODBC, libpq, psycopg) that opens a TCP connection to the DBMS, sends SQL in the DBMS's wire protocol and turns returned bytes into rows.",
  io: "In: SQL text + parameters. Out: result sets, error codes.",
  h: ["Open TCP (often TLS) connection to the server port.", "Authenticate (startup handshake).", "Send query messages; stream back row messages.", "Map DB types to language types."],
  impl: "The wire protocol is DBMS-specific (PostgreSQL frontend/backend protocol, MySQL protocol).",
  ex: "psycopg2 cursor.execute('SELECT ...', (42,)) becomes a Parse/Bind/Execute exchange with PostgreSQL." });
N({ id: "api", g: "A1", n: "HTTP / gRPC APIs", ab: "REST gRPC protobuf API endpoint", loc: ["NET", "CPU"], own: "Service process",
  p: "Services need a contract for calling each other over the network.",
  s: "HTTP/JSON (REST) or gRPC (HTTP/2 + Protocol Buffers) define request and response shapes between clients and services. Behind the API, the service usually talks to a database.",
  io: "In: request message. Out: response message or error status.",
  pro: ["gRPC: typed schema, streaming, compact binary encoding.", "HTTP/JSON: human-readable, universal tooling."], con: ["Every call can fail, time out or be duplicated; the network is not a function call."],
  rel: ["rpc", "serialization"] });
N({ id: "conpool", g: "A1", n: "Connection pool", ab: "HikariCP PgBouncer pool", loc: ["RAM", "NET"], own: "App process (or a proxy such as PgBouncer)",
  p: "Opening a DB connection is expensive (TCP + TLS + auth + a server-side process or thread), and servers support a limited number.",
  s: "Keep a fixed set of open connections and lend them to requests. A request borrows one, runs its queries, returns it.",
  h: ["At start, open N connections.", "Request borrows an idle connection (or waits).", "Run queries/transaction.", "Return the connection; reset session state if needed."],
  pro: ["Removes connect cost from each request.", "Caps load on the DB (natural back-pressure)."], con: ["Too small: requests queue. Too large: DB thrashes on context switches and memory."],
  f: ["A leaked connection (never returned) slowly starves the pool.", "Returning a connection inside an open transaction leaks locks to the next borrower."],
  ex: "PostgreSQL forks one backend process per connection, so poolers like PgBouncer are common in front of it.", rel: ["threads", "backpressure"] });
N({ id: "prepstmt", g: "A1", n: "Prepared statements", ab: "PREPARE EXECUTE bind parameters plan cache", loc: ["RAM"], own: "DBMS session + driver",
  p: "Re-parsing and re-planning the same query is wasted work, and pasting user input into SQL text enables SQL injection.",
  s: "Send the query shape once with placeholders ($1, ?). The DBMS parses (and may plan) it once; later executions only send parameter values.",
  h: ["PREPARE: parse + bind (+ maybe plan) the template.", "EXECUTE with parameters: reuse the cached work.", "Parameters are sent as data, never spliced into SQL text."],
  pro: ["Prevents SQL injection.", "Saves parse/plan CPU on hot queries."], con: ["A generic cached plan can be worse than a plan made for specific parameter values."],
  impl: "Whether the plan is cached per statement or re-planned per execution is DBMS-specific (PostgreSQL chooses between custom and generic plans).", rel: ["parser", "optimizer"] });
N({ id: "auth", g: "A1", n: "Authentication & authorization", ab: "auth login roles GRANT privileges TLS", loc: ["RAM", "DISK"], own: "DBMS security subsystem",
  p: "Only the right users may connect, and each may only read or change what they are allowed to.",
  s: "Authentication proves who you are (password, certificate, Kerberos). Authorization checks what you may do (GRANT SELECT ON orders TO app). Privileges live in the catalog.",
  h: ["Handshake proves identity.", "Session gets a role.", "Binder/executor checks privileges on each object used."],
  ex: "A read-only reporting role can SELECT but not UPDATE.", rel: ["catalog", "binder"] });
N({ id: "reqlife", g: "A2", n: "Request / response lifecycle", ab: "round trip request path", loc: ["NET", "CPU", "RAM"], own: "Client + server",
  p: "To reason about latency and failures you must know every hop a request takes.",
  s: "Client sends bytes → kernel and network → server socket → server thread parses and executes → result bytes back. Any hop can be slow or fail.",
  h: ["App builds request.", "Kernel sends TCP segments.", "Server accepts, a worker thread handles it.", "Query runs (parse, plan, execute).", "Rows are sent back; client decodes."],
  f: ["A timeout on the client does not mean the server did nothing: the work may have committed."],
  art: `client ──req──▶ [socket] ──▶ worker ──▶ parse/plan/exec
   ▲                                         │
   └──────────────── rows ◀──────────────────┘`, rel: ["timeouts", "latency"] });
N({ id: "clienttxn", g: "A2", n: "Client transactions & sessions", ab: "BEGIN COMMIT ROLLBACK autocommit session", loc: ["RAM", "LOGIC"], own: "DBMS session",
  p: "A business action often needs several statements to succeed or fail together.",
  s: "BEGIN ... COMMIT groups statements into one transaction. In autocommit mode each statement is its own transaction. The session carries the transaction state between statements.",
  h: ["BEGIN starts a transaction (txn id, snapshot or locks).", "Statements run inside it.", "COMMIT makes changes durable and visible; ROLLBACK discards them."],
  f: ["If the connection drops before COMMIT is acknowledged, the client does not know whether it committed."],
  mis: "A database transaction is local to one DBMS. Work spanning several databases or services needs a distributed transaction or a saga.", rel: ["txn", "twopc", "saga"] });

/* Layer B: Query Processing */
N({ id: "parser", g: "B1", n: "SQL parser", ab: "lexer tokenizer AST parse tree grammar", loc: ["CPU", "RAM"], own: "DBMS front end",
  p: "SQL arrives as text; the system needs a structured representation to work on.",
  s: "A lexer splits the text into tokens; a grammar-driven parser builds an abstract syntax tree (AST). Syntax errors are caught here.",
  io: "In: SQL string. Out: AST (or a syntax error).",
  h: ["Tokenize: SELECT, identifier, comma, ...", "Parse tokens with the grammar (often generated by Bison/yacc).", "Build the AST; no table or column is checked yet."],
  cx: "Linear in query length.",
  art: `SELECT name FROM emp WHERE id = 7
        ↓
   Select
   ├─ list: [name]
   ├─ from: emp
   └─ where: (= id 7)`, ex: "PostgreSQL uses a Bison grammar (gram.y)." });
N({ id: "binder", g: "B1", n: "Binder & catalog lookup", ab: "binder analyzer semantic analysis name resolution", loc: ["CPU", "RAM"], own: "DBMS front end",
  p: "The AST says 'emp' and 'name', but which table object, which column, which type?",
  s: "The binder resolves every name against the catalog, checks types and privileges, and replaces names with internal IDs.",
  io: "In: AST + catalog. Out: bound tree (logical plan input) or a semantic error (unknown column, type mismatch).",
  h: ["Look up each table in the catalog (table OID, schema).", "Resolve columns, including * expansion and aliases.", "Type-check expressions; add implicit casts.", "Check privileges."],
  rel: ["catalog", "auth"] });
N({ id: "logplan", g: "B1", n: "Logical plan", ab: "logical query plan operator tree", loc: ["RAM", "LOGIC"], own: "DBMS planner",
  p: "We need a description of WHAT to compute, independent of HOW.",
  s: "A tree of relational-algebra operators (scan, select, project, join, aggregate) with no algorithm chosen yet.",
  art: `π name
  │
σ dept='DB'
  │
  ⋈ emp.d=dept.id
 ╱ ╲
emp  dept`, mis: "A logical join says nothing about hash vs nested-loop; that choice is made in the physical plan." });
N({ id: "relalg", g: "B1", n: "Relational algebra", ab: "selection projection join union σ π ⋈", loc: ["LOGIC"], own: "Theory used by the planner",
  p: "Rewrites must not change the answer; algebra gives rules that are provably equivalent.",
  s: "Operators that take relations and return relations: σ select, π project, ⋈ join, ×, ∪, ∩, −. Equivalence rules (push σ below ⋈, reorder joins) let the optimizer rewrite plans safely.",
  ex: "σ(b_id=102)(R ⋈ S) = R ⋈ σ(b_id=102)(S): same answer, far less work if S is big.", mis: "SQL works on bags (duplicates kept); classic relational algebra works on sets." });
N({ id: "optimizer", g: "B2", n: "Query optimizer", ab: "planner cost-based rule-based Cascades System R", loc: ["CPU", "RAM"], own: "DBMS planner",
  p: "One query has many equivalent plans whose costs differ by orders of magnitude.",
  s: "First applies rewrite rules (heuristics), then estimates the cost of candidate physical plans using statistics and picks the cheapest.",
  h: ["Rewrite: push predicates down, remove redundant joins, flatten subqueries.", "Enumerate join orders and access paths.", "Estimate cardinalities from statistics.", "Cost each plan (I/O, CPU, memory).", "Return the cheapest physical plan."],
  al: "System R dynamic programming (bottom-up), Cascades/Volcano (top-down, memoized), genetic search for very many joins (PostgreSQL GEQO).",
  cx: "Join order search is exponential in the number of tables; DP is roughly O(3^n) for bushy plans.",
  f: ["Bad cardinality estimates (correlated columns, stale stats) lead to terrible plans."], pro: ["Users write declarative SQL; the system finds the fast way."], con: ["Plans can change suddenly when statistics change."] });
N({ id: "stats", g: "B2", n: "Statistics & cardinality estimation", ab: "histogram NDV selectivity ANALYZE sketch HyperLogLog", loc: ["DISK", "RAM"], ln: "Stored in the catalog on disk; cached in RAM", own: "DBMS planner + catalog",
  p: "To cost a plan you must guess how many rows each operator produces.",
  s: "The DBMS keeps per-column statistics (row count, distinct values, histograms, most common values). Selectivity of a predicate × input rows = estimated output rows.",
  h: ["ANALYZE samples the table.", "Builds histograms and NDV estimates (sketches such as HyperLogLog in some systems).", "Optimizer multiplies selectivities, usually assuming independence."],
  f: ["Independence assumption fails on correlated columns (city and zip code).", "Stale statistics after bulk loads."], rel: ["catalog", "selectivity"] });
N({ id: "joinorder", g: "B2", n: "Join ordering", ab: "left-deep bushy join order dynamic programming", loc: ["CPU", "LOGIC"], own: "DBMS planner",
  p: "Joins are associative and commutative, so A⋈B⋈C can run in many orders with very different intermediate sizes.",
  s: "The optimizer searches orders, keeping the cheapest way to join each subset of tables (System R DP). Small intermediate results first is the goal.",
  ex: "Joining a 10-row filtered table first can shrink every later join.", alt: "Left-deep trees (pipeline-friendly) vs bushy trees (more options, bigger search)." });
N({ id: "pushdown", g: "B2", n: "Predicate & projection pushdown", ab: "filter pushdown column pruning", loc: ["LOGIC"], own: "DBMS rewriter; also storage formats",
  p: "Moving rows and columns you will throw away later wastes I/O, memory and network.",
  s: "Apply filters as early as possible (even inside the scan or the storage layer) and read only the columns the query needs.",
  ex: "Parquet readers skip row groups whose min/max cannot match the filter and decode only requested columns.", rel: ["zonemap", "dsm"] });
N({ id: "physplan", g: "B2", n: "Physical plan", ab: "physical operator tree EXPLAIN", loc: ["RAM"], own: "DBMS planner → executor",
  p: "The executor needs concrete algorithms, not abstract operators.",
  s: "The logical plan with each operator replaced by an algorithm: SeqScan or IndexScan, HashJoin or MergeJoin, HashAggregate or SortAggregate. EXPLAIN shows it.",
  art: `HashJoin (emp.d = dept.id)
├─ SeqScan emp
└─ Hash
   └─ IndexScan dept (name='DB')` });
N({ id: "execeng", g: "B3", n: "Query execution engine", ab: "executor", loc: ["CPU", "RAM"], own: "DBMS executor",
  p: "Run the physical plan efficiently with bounded memory.",
  s: "Instantiates operators and moves tuples between them using a processing model (iterator, vectorized or materialized). Operators fetch pages through the buffer pool, never directly from disk.",
  h: ["Initialize operators (Open).", "Drive the root operator until it has no more tuples.", "Each operator calls its children and the storage/index layer.", "Send result rows to the client."],
  rel: ["bpm", "volcano", "vectorized"] });
N({ id: "volcano", g: "B3", n: "Volcano / iterator model", ab: "iterator pull Next() tuple-at-a-time", loc: ["CPU", "RAM"], own: "DBMS executor",
  p: "Operators need a uniform way to exchange tuples.",
  s: "Every operator implements Open/Next/Close. The parent calls Next() on its child to pull one tuple at a time.",
  pro: ["Simple, composable; natural pipelining; easy LIMIT."], con: ["One virtual call per tuple per operator: high CPU overhead for analytics."],
  art: `root.Next()
  └▶ join.Next()
       ├▶ left.Next()  → tuple
       └▶ right.Next() → tuple`, alt: "Vectorized (batches) and materialization (whole result) models.", ex: "PostgreSQL and classic System R-style engines." });
N({ id: "vectorized", g: "B3", n: "Vectorized execution", ab: "vector-at-a-time batch SIMD columnar execution", loc: ["CPU", "RAM"], own: "DBMS executor",
  p: "Tuple-at-a-time calls waste CPU on analytic queries over millions of rows.",
  s: "Next() returns a batch (vector) of, say, 1024 values per column. Tight loops over arrays use CPU caches and SIMD well.",
  pro: ["Far fewer function calls; SIMD friendly."], con: ["More complex operators; batches use more memory."], ex: "DuckDB, Snowflake, ClickHouse, Vectorwise.", rel: ["dsm", "columnar"] });
N({ id: "materialization", g: "B3", n: "Materialization model", ab: "operator-at-a-time materialize", loc: ["RAM", "DISK"], ln: "Intermediate results in RAM; may spill to disk", own: "DBMS executor",
  p: "Some operators must see all their input before producing output.",
  s: "Each operator processes its whole input and emits its whole output at once. Good for OLTP queries touching few rows; risky for large intermediate results.",
  con: ["Large intermediates can exceed memory and spill."], ex: "MonetDB-style operator-at-a-time; also any pipeline breaker (sort, hash build)." });
N({ id: "pipelining", g: "B3", n: "Pipelining & pipeline breakers", ab: "pipeline breaker", loc: ["CPU", "RAM"], own: "DBMS executor",
  p: "Writing every intermediate result to memory or disk is slow.",
  s: "A pipeline passes each tuple through several operators without storing it. Pipeline breakers (sort, hash-join build, aggregation) must consume all input first.",
  ex: "Scan → Filter → Project → probe side of a hash join is one pipeline; the hash build side is a separate pipeline that must finish first." });
N({ id: "seqscan", g: "B4", n: "Sequential scan", ab: "table scan full scan heap scan", loc: ["DISK", "RAM"], own: "DBMS executor",
  p: "Read every tuple of a table, when no index helps or most rows qualify.",
  s: "Iterate over every page of the heap file through the buffer pool and every slot in each page, applying the filter.",
  cx: "O(pages) I/O; sequential I/O is fast, but it touches everything.",
  f: ["A big scan can flush useful pages out of an LRU buffer pool (sequential flooding)."], rel: ["heapfile", "seqflood", "zonemap"] });
N({ id: "idxscan", g: "B4", n: "Index scan", ab: "index lookup index-only scan bitmap scan", loc: ["DISK", "RAM"], own: "DBMS executor",
  p: "Find matching tuples without reading the whole table.",
  s: "Search the index (B+ tree or hash) for matching keys, get record IDs, then fetch those tuples from the heap (unless the index covers all needed columns).",
  h: ["Traverse index from root to leaf (pages via buffer pool).", "Walk leaf entries in the key range.", "For each RID, fetch the heap page and tuple."],
  con: ["Unclustered index + many matches = one random I/O per row; a seq scan can be faster."], rel: ["bplustree", "rid", "clustered", "selectivity"] });
N({ id: "sortop", g: "B4", n: "Sorting (external merge sort)", ab: "ORDER BY external sort k-way merge", loc: ["RAM", "DISK"], ln: "Sorts in RAM; spills sorted runs to disk when data exceeds memory", own: "DBMS executor",
  p: "ORDER BY, merge joins, DISTINCT and GROUP BY may need sorted data bigger than memory.",
  s: "Sort chunks that fit in memory into sorted runs, write them to temp files, then merge the runs (k-way merge with a heap).",
  h: ["Pass 0: read B pages, sort in RAM, write a run; repeat.", "Pass 1..n: merge B−1 runs at a time into longer runs.", "Final pass produces the sorted output."],
  cx: "Passes = 1 + ⌈log_{B−1}(N/B)⌉; I/O = 2N per pass (N pages, B buffer pages).", ds: "Sorted runs, min-heap (priority queue) for the merge.",
  alt: "If a B+ tree on the sort key is clustered, reading its leaves gives sorted order without sorting.", rel: ["sortedrun", "pq", "spill"] });
N({ id: "aggop", g: "B4", n: "Aggregation (hash vs sort)", ab: "GROUP BY hash aggregate sort aggregate", loc: ["RAM", "DISK"], own: "DBMS executor",
  p: "Compute COUNT/SUM/AVG per group.",
  s: "Hash aggregation keeps a hash table keyed by group with running aggregates. Sort aggregation sorts by group key and aggregates adjacent rows.",
  pro: ["Hash: one pass, no sort needed.", "Sort: output already ordered; degrades gracefully."], con: ["Hash: table must fit in memory or be partitioned and spilled."],
  rel: ["hashtable", "sortop", "spill"] });
N({ id: "nlj", g: "B4", n: "Nested-loop join", ab: "NLJ block nested loop BNLJ", loc: ["RAM", "DISK"], own: "DBMS executor",
  p: "Join two inputs with any join condition (including non-equality).",
  s: "For each tuple (or block) of the outer input, scan the inner input and test the condition. Block NLJ reads the outer in chunks to cut inner scans.",
  cx: "Simple NLJ: M + m·N page reads. Block NLJ: M + ⌈M/(B−2)⌉·N (M,N pages; m outer tuples; B buffers).",
  pro: ["Works for any predicate; trivial memory."], con: ["Quadratic without an index."], cmp: "joins" });
N({ id: "inlj", g: "B4", n: "Index nested-loop join", ab: "INLJ index join", loc: ["RAM", "DISK"], own: "DBMS executor",
  p: "Join a small outer input with a large inner table that has an index on the join key.",
  s: "For each outer tuple, probe the inner table's index instead of scanning the inner table.",
  cx: "M + m·C, where C is the cost of one index probe (tree height + heap fetch).", rel: ["bplustree", "idxscan"], cmp: "joins" });
N({ id: "smj", g: "B4", n: "Sort-merge join", ab: "merge join SMJ", loc: ["RAM", "DISK"], own: "DBMS executor",
  p: "Equi-join two large inputs, especially when they are already sorted.",
  s: "Sort both inputs on the join key (or use sorted indexes), then advance two cursors together, emitting matches; back up the inner cursor for duplicate keys.",
  cx: "Sort costs + M + N for the merge (worst case M·N with many duplicates).", pro: ["Output is sorted; good when inputs are presorted."], con: ["Sorting cost if not presorted."], rel: ["sortop"], cmp: "joins" });
N({ id: "hashjoin", g: "B4", n: "Hash join", ab: "build probe Grace hash join partitioned hybrid", loc: ["RAM", "DISK"], ln: "Hash table in RAM; partitions spill to disk if too big", own: "DBMS executor",
  p: "Equi-join two large unsorted inputs fast.",
  s: "Build a hash table on the smaller input (build side), then stream the larger input (probe side) and look each key up. If the build side does not fit, Grace/hybrid hash join partitions both sides to disk by hash and joins partition pairs.",
  h: ["Build: hash every build tuple's key into an in-memory hash table.", "Probe: for each probe tuple, hash the key and check matches.", "If memory runs out: partition both inputs with h1 into files, then join each pair with h2."],
  cx: "In memory: O(M + N). Grace: about 3(M + N) I/Os.", ds: "In-memory hash table (often linear probing or chaining), optional Bloom filter on build keys.",
  pro: ["Fastest equi-join for large unsorted inputs."], con: ["Only equality predicates; memory hungry; skewed keys overflow partitions."],
  art: `build (small) ──hash──▶ [ hash table in RAM ]
probe (big)  ──hash──▶ lookup ──▶ matches`, cmp: "joins", rel: ["hashtable", "bloom", "spill"] });
N({ id: "spill", g: "B4", n: "Query memory limits & spilling", ab: "work_mem spill to disk temp files out of memory", loc: ["RAM", "DISK", "OS"], ln: "Operator memory in RAM; spill files on disk through the OS filesystem", own: "DBMS executor + OS",
  p: "Sorts, hash joins and aggregations can need more memory than the query is allowed.",
  s: "Each operator gets a memory budget (PostgreSQL work_mem). When it is exceeded, the operator writes partitions or sorted runs to temporary files and processes them in pieces.",
  h: ["Operator tracks its memory use.", "On overflow: choose victims (partitions/runs).", "Write them to temp files (filesystem I/O).", "Later read them back and finish."],
  f: ["Without spilling the process may be killed by the OS out-of-memory killer.", "Spills turn a fast in-memory query into a disk-bound one."],
  impl: "Whether spill pages go through the DBMS buffer pool or straight to temp files is implementation-dependent.", rel: ["filesystem", "pagecache", "shufflefiles"] });
