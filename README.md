# <span style="color:darkslategray;">SDE Interview and Prep Roadmap</span>

## <span style="color:darkolivegreen;">Overview</span>

Welcome to the SDE Interview Preparation Roadmap! This repository is not just about my personal journey; it's a collaborative space for collective learning. As I prepare for Software Development Engineer (SDE) interviews, I've created a comprehensive checklist to guide my preparation. By sharing this roadmap, I aim to foster a community of learners where we can all grow together. It covers various domains including **Data Structures, Algorithms, System Design, Operating Systems, Networking, Databases, Programming Languages and Concepts, System Architecture, Problem-solving and Coding, as well as Behavioral and Soft Skills**.

## <span style="color:darkolivegreen;">Printable PDF Version of Checklist - [Click Here](/SDE-Interview-and-Prep-Roadmap.pdf)</span>

## <span style="color:darkolivegreen;">Career Roadmap — [Click Here](./Career-Roadmap/README.md)</span>

International job targets, remote work from Egypt, funded master's programmes, 2026 salary and visa rules, and a month-by-month application plan with a tracker.

## <span style="color:darkolivegreen;">Contest Practice PDFs — [Click Here](./Contest-Practice/README.md)</span>

20 printable contests (7 Codeforces Div. 4, 3 Codeforces Div. 3, 10 AtCoder Beginner Contests), printed from each site's own problems page. Each PDF ends with one hints page taken from the official editorial. One combined PDF holds all of them.

## <span style="color:darkolivegreen;">Study Plan + Flagship Project — [Click Here](./Study-Plan/README.md)</span>

A printable step-by-step plan with no dates: 116 numbered steps, done in order at your own pace. It covers CMU 15-445 (lectures, homeworks 1–4, projects 0–2), this repo's OS, Networking, Version Control and System Design domains, contest practice, and a small career track. It also includes the guide for the flagship project, a Raft-replicated key-value store in Rust.

## <span style="color:darkolivegreen;">**Domains and Topics**</span>

<details>
<summary>1. <span style="color:green;">Data Structures</span></summary>

   - [ ] [**Arrays**](./Data%20Structures/Arrays.md)
   - [ ] [**Linked Lists**](./Data%20Structures/LinkedList.md)
     - [ ] Singly linked lists
       - [ ] Circularly linked lists
       - [ ] Lock-free linked lists
     - [ ] Doubly linked lists
       - [ ] Circular doubly linked lists
     - [ ] Circular linked lists
     - [ ] Skip lists
     - [ ] Unrolled linked lists
   - [ ] **Stacks**
     - [ ] Implementations using arrays and linked lists
       - [ ] Array-based stack
       - [ ] Linked list-based stack
     - [ ] Applications (e.g., expression evaluation, backtracking)
     - [ ] Priority stacks
   - [ ] **Queues**
     - [ ] Implementations (e.g., array-based, linked list-based, priority queues)
       - [ ] Circular queue
       - [ ] Double-ended queue (Deque)
     - [ ] Applications (e.g., BFS, job scheduling)
   - [ ] **Trees**
     - [ ] Binary Trees
       - [ ] Full binary tree
       - [ ] Complete binary tree
       - [ ] Perfect binary tree
     - [ ] Binary Search Trees (BST)
       - [ ] Self-balancing BST
         - [ ] Scapegoat tree
         - [ ] Tango tree
     - [ ] AVL Trees
     - [ ] Red-Black Trees
     - [ ] Splay Trees
     - [ ] B-Trees
     - [ ] Heap Trees (min-heap, max-heap)
     - [ ] Trie
     - [ ] Radix Trees
   - [ ] **Graphs**
     - [ ] Representations (adjacency matrix, adjacency list)
       - [ ] Edge list
       - [ ] Incidence matrix
     - [ ] Traversal algorithms (DFS, BFS)
     - [ ] Weighted graphs
     - [ ] Directed graphs
     - [ ] Acyclic graphs
     - [ ] Bipartite graphs
     - [ ] Spanning trees (Minimum Spanning Tree, Maximum Spanning Tree)
     - [ ] Graphs with special properties (e.g., planar graphs, Eulerian graphs)
   - [ ] **Hash Tables**
     - [ ] Collision resolution techniques (chaining, open addressing)
     - [ ] Hash functions
     - [ ] Perfect Hashing
     - [ ] Cuckoo Hashing
     - [ ] Robin Hood Hashing
     - [ ] Count-Min Sketch
     - [ ] Bloom Filters

</details>

<details>
<summary>2. <span style="color:green;">Algorithms</span></summary>

   - [ ] **Sorting Algorithms**:
     - [ ] Bubble Sort
     - [ ] Selection Sort
     - [ ] Insertion Sort
     - [ ] Merge Sort
     - [ ] Quick Sort
     - [ ] Heap Sort
     - [ ] Shell Sort
     - [ ] Counting Sort
     - [ ] Radix Sort
     - [ ] Bucket Sort
     - [ ] Comb Sort
     - [ ] Cocktail Shaker Sort
     - [ ] Tim Sort
     - [ ] Cycle Sort
     - [ ] Pancake Sort
     - [ ] Bitonic Sort
     - [ ] Gnome Sort
     - [ ] Strand Sort
   - [ ] **Searching Algorithms**:
     - [ ] Linear Search
     - [ ] Binary Search
     - [ ] Depth-First Search (DFS)
     - [ ] Breadth-First Search (BFS)
     - [ ] Jump Search
     - [ ] Interpolation Search
     - [ ] Exponential Search
     - [ ] Fibonacci Search
     - [ ] Ternary Search
     - [ ] Hashing (Hash Table)
   - [ ] **Dynamic Programming**
     - [ ] Memoization
     - [ ] Tabulation
     - [ ] Longest Common Subsequence (LCS)
     - [ ] Longest Increasing Subsequence (LIS)
     - [ ] 0/1 Knapsack Problem
     - [ ] Coin Change Problem
     - [ ] Matrix Chain Multiplication
     - [ ] Edit Distance
     - [ ] Subset Sum Problem
     - [ ] Rod Cutting Problem
     - [ ] Fibonacci Series
     - [ ] Shortest Path Problems (e.g., Dijkstra's Algorithm using DP)
   - [ ] **Greedy Algorithms**
     - [ ] Fractional Knapsack Problem
     - [ ] Activity Selection Problem
     - [ ] Huffman Coding
     - [ ] Job Sequencing with Deadlines
     - [ ] Prim's Algorithm (for Minimum Spanning Tree)
     - [ ] Kruskal's Algorithm (for Minimum Spanning Tree)
     - [ ] Dijkstra's Algorithm (for Single Source Shortest Path)
     - [ ] Greedy Coloring of Graphs
     - [ ] Greedy Set Cover
   - [ ] **Divide and Conquer**
     - [ ] Binary Search
     - [ ] Merge Sort
     - [ ] Quick Sort
     - [ ] Strassen's Matrix Multiplication
     - [ ] Closest Pair of Points Problem
     - [ ] Karatsuba Algorithm (for Fast Multiplication)
     - [ ] Cooley–Tukey Fast Fourier Transform (FFT)
     - [ ] Finding Maximum Subarray Sum (Kadane's Algorithm)
     - [ ] Finding Peak Element in 1D/2D Array
   - [ ] **String Algorithms**:
     - [ ] Rabin-Karp Algorithm
     - [ ] Knuth-Morris-Pratt (KMP) Algorithm
     - [ ] Z-Algorithm
     - [ ] Boyer-Moore Algorithm
     - [ ] Manacher's Algorithm
     - [ ] Suffix Array Construction
     - [ ] Longest Common Prefix (LCP) Array
     - [ ] Aho-Corasick Algorithm
     - [ ] Suffix Tree Construction
     - [ ] Suffix Automaton
     - [ ] Trie (Prefix Tree) Insertion and Search
     - [ ] Breadth-First Search (BFS) in a Trie
     - [ ] Depth-First Search (DFS) in a Trie
     - [ ] Edit Distance (Levenshtein Distance)
     - [ ] Hamming Distance
     - [ ] Longest Palindromic Substring
     - [ ] Longest Repeated Substring
     - [ ] Longest Common Substring
     - [ ] Longest Common Subsequence
     - [ ] Shortest Common Supersequence
     - [ ] Palindrome Check
     - [ ] Count and Say Sequence
     - [ ] String Hashing
     - [ ] Baker-Bird Algorithm
     - [ ] Burrows-Wheeler Transform (BWT)

</details>

<details>
<summary>3. <span style="color:green;">System Design</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - Resources:
     - [System Design Interview by Alex Xu](./System%20Design/Resources/System%20Design%20Interview%20by%20Alex%20Xu.pdf)
     - [Designing Data Intensive Applications by Martin Kleppmann](./System%20Design/Resources/Designing%20Data%20Intensive%20Applications%20by%20Martin%20Kleppmann.pdf)

   - [ ] [**Design patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md#0-what-is-a-design-pattern)
     - [ ] [**Creational patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md)
       - [ ] [Singleton](./System%20Design/Design%20Patterns/Creational-Patterns.md#1-singleton)
       - [ ] [Factory Method](./System%20Design/Design%20Patterns/Creational-Patterns.md#2-factory-method)
       - [ ] [Abstract Factory](./System%20Design/Design%20Patterns/Creational-Patterns.md#3-abstract-factory)
       - [ ] [Builder](./System%20Design/Design%20Patterns/Creational-Patterns.md#4-builder)
       - [ ] [Prototype](./System%20Design/Design%20Patterns/Creational-Patterns.md#5-prototype)
     - [ ] [**Structural patterns**](./System%20Design/Design%20Patterns/Structural-Patterns.md)
       - [ ] [Adapter](./System%20Design/Design%20Patterns/Structural-Patterns.md#1-adapter)
       - [ ] [Bridge](./System%20Design/Design%20Patterns/Structural-Patterns.md#2-bridge)
       - [ ] [Composite](./System%20Design/Design%20Patterns/Structural-Patterns.md#3-composite)
       - [ ] [Decorator](./System%20Design/Design%20Patterns/Structural-Patterns.md#4-decorator)
       - [ ] [Facade](./System%20Design/Design%20Patterns/Structural-Patterns.md#5-facade)
       - [ ] [Flyweight](./System%20Design/Design%20Patterns/Structural-Patterns.md#6-flyweight)
       - [ ] [Proxy](./System%20Design/Design%20Patterns/Structural-Patterns.md#7-proxy)
     - [ ] [**Behavioral patterns**](./System%20Design/Design%20Patterns/Behavioral-Patterns.md)
       - [ ] [Chain of Responsibility](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#1-chain-of-responsibility)
       - [ ] [Command](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#2-command)
       - [ ] [Iterator](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#3-iterator)
       - [ ] [Mediator](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#4-mediator)
       - [ ] [Memento](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#5-memento)
       - [ ] [Observer](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#6-observer)
       - [ ] [State](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#7-state)
       - [ ] [Strategy](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#8-strategy)
       - [ ] [Template Method](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#9-template-method)
       - [ ] [Visitor](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#10-visitor)
   - [ ] [**Object-oriented design principles**](./System%20Design/OOD-Principles.md)
     - [ ] [DRY (Don't Repeat Yourself)](./System%20Design/OOD-Principles.md#1-dry-dont-repeat-yourself)
     - [ ] [KISS (Keep It Simple, Stupid)](./System%20Design/OOD-Principles.md#2-kiss-keep-it-simple-stupid)
     - [ ] [YAGNI (You Aren't Gonna Need It)](./System%20Design/OOD-Principles.md#3-yagni-you-arent-gonna-need-it)
     - [ ] [Law of Demeter (Principle of Least Knowledge)](./System%20Design/OOD-Principles.md#4-law-of-demeter-principle-of-least-knowledge)
     - [ ] [Open/Closed Principle](./System%20Design/OOD-Principles.md#52-openclosed-principle-ocp)
     - [ ] [SOLID principles](./System%20Design/OOD-Principles.md#5-solid-principles)
       - [ ] [Single Responsibility Principle (SRP)](./System%20Design/OOD-Principles.md#51-single-responsibility-principle-srp)
       - [ ] [Open/Closed Principle (OCP)](./System%20Design/OOD-Principles.md#52-openclosed-principle-ocp)
       - [ ] [Liskov Substitution Principle (LSP)](./System%20Design/OOD-Principles.md#53-liskov-substitution-principle-lsp)
       - [ ] [Interface Segregation Principle (ISP)](./System%20Design/OOD-Principles.md#54-interface-segregation-principle-isp)
       - [ ] [Dependency Inversion Principle (DIP)](./System%20Design/OOD-Principles.md#55-dependency-inversion-principle-dip)
   - [ ] [**Scalability**](./System%20Design/Scalability.md)
     - [ ] [Replication vs. Partitioning](./System%20Design/Scalability.md#1-replication-vs-partitioning)
     - [ ] [Consistent Hashing](./System%20Design/Scalability.md#2-consistent-hashing)
     - [ ] [Auto-scaling](./System%20Design/Scalability.md#3-auto-scaling)
   - [ ] [**Distributed systems**](./System%20Design/Distributed-Systems.md)
     - [ ] [ACID vs. BASE](./System%20Design/Distributed-Systems.md#1-acid-vs-base)
     - [ ] [Eventual consistency](./System%20Design/Distributed-Systems.md#2-eventual-consistency)
     - [ ] [Leader election algorithms (Paxos, Raft)](./System%20Design/Distributed-Systems.md#3-leader-election-algorithms-paxos-raft)
     - [ ] [Distributed tracing](./System%20Design/Distributed-Systems.md#4-distributed-tracing)
     - [ ] [Fault tolerance and resilience](./System%20Design/Distributed-Systems.md#5-fault-tolerance-and-resilience)
   - [ ] [**Microservices architecture**](./System%20Design/Microservices-Explained.md) · [Reference & 76 Q&A](./System%20Design/Microservices.md)
     - [ ] [Choreography vs. Orchestration](./System%20Design/Microservices-Explained.md#1-choreography-vs-orchestration)
     - [ ] [API gateway](./System%20Design/Microservices-Explained.md#2-api-gateway)
     - [ ] [Circuit Breaker pattern](./System%20Design/Microservices-Explained.md#3-circuit-breaker-pattern)
     - [ ] [Saga pattern](./System%20Design/Microservices-Explained.md#4-saga-pattern)
     - [ ] [Caching strategies](./System%20Design/Caching-Strategies.md)
       - [ ] [Cache aside](./System%20Design/Caching-Strategies.md#1-cache-aside)
       - [ ] [Write-through caching](./System%20Design/Caching-Strategies.md#2-write-through-caching)
       - [ ] [Write-behind caching](./System%20Design/Caching-Strategies.md#3-write-behind-caching)
       - [ ] [Cache stampede prevention](./System%20Design/Caching-Strategies.md#4-cache-stampede-prevention)
     - [ ] [Load balancing](./System%20Design/Microservices-Explained.md#5-load-balancing)
       - [ ] [DNS load balancing](./System%20Design/Microservices-Explained.md#51-dns-load-balancing)
       - [ ] [Content Delivery Networks (CDNs)](./System%20Design/Microservices-Explained.md#52-content-delivery-networks-cdns)
       - [ ] [Anycast routing](./System%20Design/Microservices-Explained.md#53-anycast-routing)
       - [ ] [Adaptive load balancing algorithms](./System%20Design/Microservices-Explained.md#54-adaptive-load-balancing-algorithms)
   - [ ] [**Database design and optimization**](./System%20Design/Database-Design-and-Optimization.md)
     - [ ] [Partitioning](./System%20Design/Database-Design-and-Optimization.md#1-partitioning)
     - [ ] [Materialized views](./System%20Design/Database-Design-and-Optimization.md#2-materialized-views)
     - [ ] [NoSQL databases (document, key-value, column-family, graph)](./System%20Design/Database-Design-and-Optimization.md#3-nosql-databases-document-key-value-column-family-graph)
     - [ ] [Database normalization forms (1NF, 2NF, 3NF, BCNF)](./System%20Design/Database-Design-and-Optimization.md#4-database-normalization-forms-1nf-2nf-3nf-bcnf)

</details>

<details>
<summary>4. <span style="color:green;">Operating Systems</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Processes**](./Operating%20Systems/Processes.md)
   - [ ] [**Threads**](./Operating%20Systems/Threads.md)
   - [ ] [**Thread synchronization mechanisms**](./Operating%20Systems/Thread-Synchronization.md):
     - [ ] [Mutexes](./Operating%20Systems/Thread-Synchronization.md#1-mutexes)
     - [ ] [Semaphores](./Operating%20Systems/Thread-Synchronization.md#2-semaphores)
     - [ ] [Monitors](./Operating%20Systems/Thread-Synchronization.md#3-monitors-mutex--condition-variable)
   - [ ] [**Deadlock detection and prevention**](./Operating%20Systems/Deadlocks.md)
   - [ ] [**Scheduling algorithms**](./Operating%20Systems/Scheduling.md)
     - [ ] [Fair share scheduling](./Operating%20Systems/Scheduling.md#2-fair-share-scheduling)
     - [ ] [Earliest Deadline First (EDF)](./Operating%20Systems/Scheduling.md#3-earliest-deadline-first-edf)
     - [ ] [Weighted Fair Queuing (WFQ)](./Operating%20Systems/Scheduling.md#4-weighted-fair-queuing-wfq)
   - [ ] [**Memory management**](./Operating%20Systems/Memory-Management.md)
     - [ ] [Page replacement algorithms (LRU, FIFO, Clock)](./Operating%20Systems/Memory-Management.md#1-page-replacement-algorithms-fifo-lru-clock-optimal)
     - [ ] [Memory-mapped files](./Operating%20Systems/Memory-Management.md#2-memory-mapped-files)
     - [ ] [Buddy memory allocation](./Operating%20Systems/Memory-Management.md#3-buddy-memory-allocation)
   - [ ] [**File systems**](./Operating%20Systems/File-Systems.md)
     - [ ] [Journaling file systems (ext3, ext4)](./Operating%20Systems/File-Systems.md#1-journaling-file-systems-ext3-ext4)
     - [ ] [Network file systems (NFS, SMB)](./Operating%20Systems/File-Systems.md#2-network-file-systems-nfs-smb)
     - [ ] [File system encryption](./Operating%20Systems/File-Systems.md#3-file-system-encryption)
     - [ ] [Distributed file systems (HDFS, Ceph)](./Operating%20Systems/File-Systems.md#4-distributed-file-systems-hdfs-ceph)

</details>

<details>
<summary>5. <span style="color:green;">Networking</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**TCP/IP stack**](./Networking/TCP-IP-Stack.md)
     - [ ] [OSI model layers](./Networking/TCP-IP-Stack.md#1-osi-model-layers)
     - [ ] [TCP vs. UDP](./Networking/TCP-IP-Stack.md#3-tcp-vs-udp)
   - [ ] [**HTTP protocol**](./Networking/HTTP.md)
     - [ ] [Request methods (GET, POST, etc.)](./Networking/HTTP.md#1-request-methods-get-post-etc)
     - [ ] [Status codes](./Networking/HTTP.md#2-status-codes)
   - [ ] [**DNS (Domain Name System)**](./Networking/DNS.md)
     - [ ] [Resolution process](./Networking/DNS.md#2-resolution-process)
   - [ ] [**Routing algorithms**](./Networking/Routing-Algorithms.md)
     - [ ] [Shortest Path algorithms (Dijkstra's, Bellman-Ford)](./Networking/Routing-Algorithms.md#1-shortest-path-algorithms-the-idea)

</details>

<details>
<summary>6. <span style="color:green;">Databases</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Relational databases (SQL)**](./Databases/SQL-DML.md#0-the-sql-families-at-a-glance) · [Full interview reference](./Databases/database-interview-prep-guide.md)
     - [ ] [Normalization forms](./Databases/Normalization.md)
       - [ ] [First Normal Form (1NF)](./Databases/Normalization.md#2-first-normal-form-1nf)
       - [ ] [Second Normal Form (2NF)](./Databases/Normalization.md#3-second-normal-form-2nf)
       - [ ] [Third Normal Form (3NF)](./Databases/Normalization.md#4-third-normal-form-3nf)
       - [ ] [Boyce-Codd Normal Form (BCNF)](./Databases/Normalization.md#5-boyce-codd-normal-form-bcnf)
     - [ ] [Joins](./Databases/Joins.md)
       - [ ] [Inner joins](./Databases/Joins.md#1-inner-joins)
       - [ ] [Outer joins (left, right, full)](./Databases/Joins.md#2-outer-joins-left-right-full)
       - [ ] [Cross joins](./Databases/Joins.md#3-cross-joins)
     - [ ] [SQL Data Manipulation Language (DML)](./Databases/SQL-DML.md)
       - [ ] [SELECT statement](./Databases/SQL-DML.md#1-select-statement)
       - [ ] [INSERT statement](./Databases/SQL-DML.md#2-insert-statement)
       - [ ] [UPDATE statement](./Databases/SQL-DML.md#3-update-statement)
       - [ ] [DELETE statement](./Databases/SQL-DML.md#4-delete-statement)
       - [ ] [MERGE statement](./Databases/SQL-DML.md#5-merge-statement)
       - [ ] [TRUNCATE statement](./Databases/SQL-DML.md#6-truncate-statement)
       - [ ] [UPSERT operations](./Databases/SQL-DML.md#7-upsert-operations)
       - [ ] [Explicit vs. Implicit transactions](./Databases/SQL-DML.md#8-explicit-vs-implicit-transactions)
       - [ ] [Control-of-flow language (e.g., CASE, IF-ELSE)](./Databases/SQL-DML.md#9-control-of-flow-language-case-if-else)
     - [ ] [SQL Data Definition Language (DDL)](./Databases/SQL-DDL-DCL-TCL.md)
       - [ ] [CREATE statement](./Databases/SQL-DDL-DCL-TCL.md#1-create-statement)
       - [ ] [ALTER statement](./Databases/SQL-DDL-DCL-TCL.md#2-alter-statement)
       - [ ] [DROP statement](./Databases/SQL-DDL-DCL-TCL.md#3-drop-statement)
     - [ ] [SQL Data Control Language (DCL)](./Databases/SQL-DDL-DCL-TCL.md#4-grant-statement)
       - [ ] [GRANT statement](./Databases/SQL-DDL-DCL-TCL.md#4-grant-statement)
       - [ ] [REVOKE statement](./Databases/SQL-DDL-DCL-TCL.md#5-revoke-statement)
     - [ ] [SQL Data Query Language (DQL)](./Databases/SQL-DQL.md)
       - [ ] [Subqueries](./Databases/SQL-DQL.md#1-subqueries)
       - [ ] [Aggregate functions (e.g., SUM, AVG, COUNT)](./Databases/SQL-DQL.md#2-aggregate-functions-sum-avg-count)
       - [ ] [GROUP BY and HAVING clauses](./Databases/SQL-DQL.md#3-group-by-and-having-clauses)
       - [ ] [Window functions](./Databases/SQL-DQL.md#4-window-functions)
     - [ ] [Transaction Control](./Databases/SQL-DDL-DCL-TCL.md#6-commit-statement)
       - [ ] [COMMIT statement](./Databases/SQL-DDL-DCL-TCL.md#6-commit-statement)
       - [ ] [ROLLBACK statement](./Databases/SQL-DDL-DCL-TCL.md#7-rollback-statement-and-savepoint)
     - [ ] [Database Constraints](./Databases/Constraints.md)
       - [ ] [Primary key](./Databases/Constraints.md#1-primary-key)
       - [ ] [Foreign key](./Databases/Constraints.md#2-foreign-key)
       - [ ] [Unique constraint](./Databases/Constraints.md#3-unique-constraint)
       - [ ] [Check constraint](./Databases/Constraints.md#4-check-constraint)
       - [ ] [Default constraint](./Databases/Constraints.md#5-default-constraint)
     - [ ] [Stored Procedures and Functions](./Databases/Stored-Procedures-Triggers-Views.md#1-stored-procedures-and-functions)
       - [ ] [Creation](./Databases/Stored-Procedures-Triggers-Views.md#11-creation)
       - [ ] [Execution](./Databases/Stored-Procedures-Triggers-Views.md#12-execution)
       - [ ] [Parameters](./Databases/Stored-Procedures-Triggers-Views.md#13-parameters)
     - [ ] [Triggers](./Databases/Stored-Procedures-Triggers-Views.md#2-triggers)
       - [ ] [Types of triggers (BEFORE, AFTER)](./Databases/Stored-Procedures-Triggers-Views.md#21-types-of-triggers-before-after)
       - [ ] [Trigger execution order](./Databases/Stored-Procedures-Triggers-Views.md#22-trigger-execution-order)
     - [ ] [Views](./Databases/Stored-Procedures-Triggers-Views.md#3-views)
       - [ ] [Materialized views vs. regular views](./Databases/Stored-Procedures-Triggers-Views.md#31-materialized-views-vs-regular-views)
       - [ ] [Advantages and use cases](./Databases/Stored-Procedures-Triggers-Views.md#32-advantages-and-use-cases)
   - [ ] [**NoSQL databases**](./Databases/NoSQL.md)
     - [ ] [Types](./Databases/NoSQL.md#0-what-is-nosql-and-why)
       - [ ] [Document-based](./Databases/NoSQL.md#1-document-based)
       - [ ] [Key-value](./Databases/NoSQL.md#2-key-value)
       - [ ] [Column-family](./Databases/NoSQL.md#3-column-family)
       - [ ] [Graph](./Databases/NoSQL.md#4-graph)
     - [ ] [Examples](./Databases/NoSQL.md#5-mongodb-interview-questions)
       - [ ] [MongoDB Interview Questions](./Databases/NoSQL.md#5-mongodb-interview-questions)
       - [ ] [Redis Interview Questions](./Databases/NoSQL.md#6-redis-interview-questions)
   - [ ] [**ACID properties**](./Databases/ACID.md)
     - [ ] [Atomicity](./Databases/ACID.md#1-atomicity)
     - [ ] [Consistency](./Databases/ACID.md#2-consistency)
     - [ ] [Isolation](./Databases/ACID.md#3-isolation)
     - [ ] [Durability](./Databases/ACID.md#4-durability)
   - [ ] [**Indexing**](./Databases/Indexing.md)
     - [ ] [B-tree](./Databases/Indexing.md#1-b-tree)
     - [ ] [B+ tree](./Databases/Indexing.md#2-b-tree)
     - [ ] [Bitmap Indexing](./Databases/Indexing.md#3-bitmap-indexing)
   - [ ] [**Transactions**](./Databases/Transactions-and-Isolation.md)
     - [ ] [ACID properties in transactions](./Databases/Transactions-and-Isolation.md#1-acid-properties-in-transactions)
     - [ ] [Isolation levels](./Databases/Transactions-and-Isolation.md#3-isolation-levels)
       - [ ] [Read Uncommitted](./Databases/Transactions-and-Isolation.md#31-read-uncommitted)
       - [ ] [Read Committed](./Databases/Transactions-and-Isolation.md#32-read-committed)
       - [ ] [Repeatable Read](./Databases/Transactions-and-Isolation.md#33-repeatable-read)
       - [ ] [Serializable](./Databases/Transactions-and-Isolation.md#34-serializable)
   - [ ] [**Database design and optimization**](./System%20Design/Database-Design-and-Optimization.md)
     - [ ] [Partitioning](./System%20Design/Database-Design-and-Optimization.md#1-partitioning)
     - [ ] [Materialized views](./System%20Design/Database-Design-and-Optimization.md#2-materialized-views)

</details>

<details>
<summary>7. <span style="color:green;">Programming Languages and Concepts</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Programming paradigms**](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md)
     - [ ] [Imperative programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#1-imperative-programming)
     - [ ] [Declarative programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#2-declarative-programming)
     - [ ] [Functional programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#3-functional-programming)
     - [ ] [Object-oriented programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#4-object-oriented-programming)
     - [ ] [Procedural programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#5-procedural-programming)
     - [ ] [Event-driven programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#6-event-driven-programming)
     - [ ] [Aspect-oriented programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#7-aspect-oriented-programming)
   - [ ] [**Memory management**](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md)
     - [ ] [Stack vs. Heap](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#1-stack-vs-heap)
     - [ ] [Manual vs. Automatic memory management](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#2-manual-vs-automatic-memory-management)
     - [ ] [Garbage collection algorithms (e.g., Mark and Sweep, Generational GC)](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#4-mark-and-sweep)
   - [ ] [**Concurrency**](./Programming%20Languages%20and%20Concepts/Concurrency.md)
     - [ ] [Threads vs. Processes](./Programming%20Languages%20and%20Concepts/Concurrency.md#1-threads-vs-processes)
     - [ ] [Synchronization primitives (locks, mutexes, semaphores)](./Programming%20Languages%20and%20Concepts/Concurrency.md#2-synchronization-primitives-locks-mutexes-semaphores)
     - [ ] [Thread safety](./Programming%20Languages%20and%20Concepts/Concurrency.md#3-thread-safety)
     - [ ] [Deadlocks](./Programming%20Languages%20and%20Concepts/Concurrency.md#4-deadlocks)
     - [ ] [Race conditions](./Programming%20Languages%20and%20Concepts/Concurrency.md#5-race-conditions)
     - [ ] [Parallelism vs. Concurrency](./Programming%20Languages%20and%20Concepts/Concurrency.md#6-parallelism-vs-concurrency)
     - [ ] [Asynchronous programming](./Programming%20Languages%20and%20Concepts/Concurrency.md#7-asynchronous-programming)
   - [ ] [**Error handling**](./Programming%20Languages%20and%20Concepts/Error-Handling.md)
     - [ ] [Exceptions vs. Error codes](./Programming%20Languages%20and%20Concepts/Error-Handling.md#1-exceptions-vs-error-codes)
     - [ ] [Exception handling mechanisms](./Programming%20Languages%20and%20Concepts/Error-Handling.md#2-exception-handling-mechanisms)
     - [ ] [Exception safety](./Programming%20Languages%20and%20Concepts/Error-Handling.md#3-exception-safety)
     - [ ] [Error propagation](./Programming%20Languages%20and%20Concepts/Error-Handling.md#4-error-propagation)
     - [ ] [Error recovery](./Programming%20Languages%20and%20Concepts/Error-Handling.md#5-error-recovery)
   - [ ] [**Functional programming**](./Programming%20Languages%20and%20Concepts/Functional-Programming.md)
     - [ ] [Higher-order functions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#2-higher-order-functions)
     - [ ] [Closures](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#3-closures)
     - [ ] [Lambda expressions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#1-lambda-expressions)
     - [ ] [Pure functions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#4-pure-functions)
     - [ ] [Referential transparency](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#5-referential-transparency)
   - [ ] [**Object-oriented programming (OOP)**](./Programming%20Languages%20and%20Concepts/OOP.md)
     - [ ] [Encapsulation](./Programming%20Languages%20and%20Concepts/OOP.md#1-encapsulation)
     - [ ] [Inheritance](./Programming%20Languages%20and%20Concepts/OOP.md#2-inheritance)
     - [ ] [Polymorphism](./Programming%20Languages%20and%20Concepts/OOP.md#3-polymorphism)
     - [ ] [Abstraction](./Programming%20Languages%20and%20Concepts/OOP.md#4-abstraction)
     - [ ] [Composition vs. Inheritance](./Programming%20Languages%20and%20Concepts/OOP.md#5-composition-vs-inheritance)
     - [ ] [Method overriding vs. Method overloading](./Programming%20Languages%20and%20Concepts/OOP.md#6-method-overriding-vs-method-overloading)
   - [ ] [**Design patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md#0-what-is-a-design-pattern)
     - [ ] [Creational patterns](./System%20Design/Design%20Patterns/Creational-Patterns.md)
     - [ ] [Structural patterns](./System%20Design/Design%20Patterns/Structural-Patterns.md)
     - [ ] [Behavioral patterns](./System%20Design/Design%20Patterns/Behavioral-Patterns.md)
   - [ ] [**Asynchronous programming**](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md)
     - [ ] [Callbacks](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#1-callbacks)
     - [ ] [Promises](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#2-promises)
     - [ ] [Futures](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#3-futures)
     - [ ] [Coroutines](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#4-coroutines)
   - [ ] [**Functional vs. Imperative vs. Declarative programming**](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#8-functional-vs-imperative-vs-declarative)
   - [ ] [**Type systems**](./Programming%20Languages%20and%20Concepts/Type-Systems.md)
     - [ ] [Static vs. Dynamic typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#1-static-vs-dynamic-typing)
     - [ ] [Strong vs. Weak typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#2-strong-vs-weak-typing)
     - [ ] [Nominal vs. Structural typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#3-nominal-vs-structural-typing)
   - [ ] [**Lambda calculus**](./Programming%20Languages%20and%20Concepts/Lambda-Calculus.md)
   - [ ] [**Garbage collection**](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#3-tracing-vs-reference-counting)
     - [ ] [Tracing vs. Reference counting](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#3-tracing-vs-reference-counting)
     - [ ] [Generational GC](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#5-generational-gc)
   - [ ] [**Regular expressions**](./Programming%20Languages%20and%20Concepts/Regular-Expressions.md)
   - [ ] [**Memory layout**](./Programming%20Languages%20and%20Concepts/Memory-Layout.md)
     - [ ] [Stack vs. Heap memory allocation](./Programming%20Languages%20and%20Concepts/Memory-Layout.md#1-stack-vs-heap-memory-allocation)
     - [ ] [Data segment vs. Code segment](./Programming%20Languages%20and%20Concepts/Memory-Layout.md#2-data-segment-vs-code-segment)
   - [ ] [**Recursion**](./Programming%20Languages%20and%20Concepts/Recursion.md)
     - [ ] [Tail recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#1-tail-recursion)
     - [ ] [Mutual recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#2-mutual-recursion)
     - [ ] [Anonymous recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#3-anonymous-recursion)
   - [ ] [**Virtual Memory**](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md)
     - [ ] [Demand Paging](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md#1-demand-paging)
     - [ ] [Page replacement algorithms (FIFO, LRU, Optimal)](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md#2-page-replacement-algorithms-fifo-lru-optimal)
   - [ ] [**Networking**](./Programming%20Languages%20and%20Concepts/Network-Programming.md)
     - [ ] [Sockets](./Programming%20Languages%20and%20Concepts/Network-Programming.md#1-sockets)
     - [ ] [Client-server architecture](./Programming%20Languages%20and%20Concepts/Network-Programming.md#2-client-server-architecture)
     - [ ] [Protocols (TCP, UDP)](./Programming%20Languages%20and%20Concepts/Network-Programming.md#3-protocols-tcp-udp-in-code)
     - [ ] [Remote Procedure Call (RPC)](./Programming%20Languages%20and%20Concepts/Network-Programming.md#4-remote-procedure-call-rpc)

</details>

<details>
<summary>8. <span style="color:green;">System Architecture</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Client-server architecture**](./System%20Architecture/Client-Server-Architecture.md)
     - [ ] [Basics](./System%20Architecture/Client-Server-Architecture.md#1-basics)
     - [ ] [Communication protocols](./System%20Architecture/Client-Server-Architecture.md#2-communication-protocols)
   - [ ] [**RESTful architecture**](./System%20Architecture/REST-Explained.md) · [Reference](./System%20Design/RESTfulArchitecture.md)
   - [ ] [**Service-Oriented Architecture (SOA)**](./System%20Architecture/SOA.md)
     - [ ] [Principles](./System%20Architecture/SOA.md#1-principles)
     - [ ] [Advantages](./System%20Architecture/SOA.md#2-advantages)
     - [ ] [Challenges](./System%20Architecture/SOA.md#3-challenges)
   - [ ] [**Message Queuing**](./System%20Architecture/Message-Queuing.md)
     - [ ] [Basics](./System%20Architecture/Message-Queuing.md#1-basics)
     - [ ] [Use cases](./System%20Architecture/Message-Queuing.md#2-use-cases)
     - [ ] [Implementations (e.g., RabbitMQ, Kafka)](./System%20Architecture/Message-Queuing.md#3-implementations-eg-rabbitmq-kafka)
   - [ ] [**Microservices**](./System%20Design/Microservices-Explained.md) · [Reference & 76 Q&A](./System%20Design/Microservices.md)
   - [ ] [**Event-Driven Architecture (EDA)**](./System%20Architecture/Event-Driven-Architecture.md)
     - [ ] [Basics](./System%20Architecture/Event-Driven-Architecture.md#1-basics)
     - [ ] [Components](./System%20Architecture/Event-Driven-Architecture.md#2-components)
     - [ ] [Advantages](./System%20Architecture/Event-Driven-Architecture.md#3-advantages)
     - [ ] [Implementations (e.g., Apache Kafka)](./System%20Architecture/Event-Driven-Architecture.md#4-implementations-eg-apache-kafka)
   - [ ] [**Layered Architecture**](./System%20Architecture/Layered-Architecture.md)
     - [ ] [Presentation layer](./System%20Architecture/Layered-Architecture.md#1-presentation-layer)
     - [ ] [Business logic layer](./System%20Architecture/Layered-Architecture.md#2-business-logic-layer)
     - [ ] [Data access layer](./System%20Architecture/Layered-Architecture.md#3-data-access-layer)
     - [ ] [Cross-cutting concerns layer](./System%20Architecture/Layered-Architecture.md#4-cross-cutting-concerns-layer)
   - [ ] [**Caching strategies**](./System%20Design/Caching-Strategies.md)
     - [ ] [Cache aside](./System%20Design/Caching-Strategies.md#1-cache-aside)
     - [ ] [Write-through caching](./System%20Design/Caching-Strategies.md#2-write-through-caching)
     - [ ] [Write-behind caching](./System%20Design/Caching-Strategies.md#3-write-behind-caching)
     - [ ] [Cache stampede prevention](./System%20Design/Caching-Strategies.md#4-cache-stampede-prevention)

</details>

<details>
<summary>9. <span style="color:green;">Problem-solving and Coding</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Problem-solving strategies**](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md)
     - [ ] [Understand the problem](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#1-understand-the-problem)
     - [ ] [Break it down](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#2-break-it-down)
     - [ ] [Solve a simpler problem](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#3-solve-a-simpler-problem)
     - [ ] [Look for patterns](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#4-look-for-patterns)
     - [ ] [Make a plan](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#5-make-a-plan)
     - [ ] [Implement the plan](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#6-implement-the-plan)
     - [ ] [Test your solution](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#7-test-your-solution)
   - [ ] **Coding techniques**
     - [ ] [Modular programming](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#1-modular-programming)
     - [ ] [Recursion](./Programming%20Languages%20and%20Concepts/Recursion.md)
     - Algorithm techniques (divide and conquer, dynamic programming, greedy algorithms, backtracking, bit manipulation, sliding window, two pointers, binary search, fast and slow pointers, hashing) are covered under **Algorithms** above.
   - [ ] [**Coding best practices**](./Problem-solving%20and%20Coding/Coding-Best-Practices.md)
     - [ ] [Naming conventions](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#2-naming-conventions)
     - [ ] [Code readability](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#3-code-readability)
     - [ ] [Code reusability](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#4-code-reusability)
     - [ ] [Error handling](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#5-error-handling)
     - [ ] [Testing](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#6-testing)
     - [ ] [Version control (e.g., Git)](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#7-version-control-eg-git)
     - [ ] [Code reviews](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#8-code-reviews)
   - [ ] [**Time and space complexity analysis**](./Problem-solving%20and%20Coding/Complexity-Analysis.md)
     - [ ] [Big O notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#1-big-o-notation)
     - [ ] [Big Omega notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#2-big-omega-notation)
     - [ ] [Big Theta notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#3-big-theta-notation)
     - [ ] [Space complexity analysis](./Problem-solving%20and%20Coding/Complexity-Analysis.md#4-space-complexity-analysis)
   - [ ] [**Debugging**](./Problem-solving%20and%20Coding/Debugging.md)
     - [ ] [Print debugging](./Problem-solving%20and%20Coding/Debugging.md#1-print-debugging)
     - [ ] [Debugger tools](./Problem-solving%20and%20Coding/Debugging.md#2-debugger-tools)
     - [ ] [Rubber duck debugging](./Problem-solving%20and%20Coding/Debugging.md#3-rubber-duck-debugging)
   - [ ] [**Optimization**](./Problem-solving%20and%20Coding/Optimization.md)
     - [ ] [Algorithmic optimization](./Problem-solving%20and%20Coding/Optimization.md#1-algorithmic-optimization)
     - [ ] [Space-time trade-offs](./Problem-solving%20and%20Coding/Optimization.md#2-space-time-trade-offs)
     - [ ] [Profiling tools](./Problem-solving%20and%20Coding/Optimization.md#3-profiling-tools)
   - [ ] [**Contest practice (Codeforces + AtCoder PDFs)**](./Contest-Practice/README.md)

</details>

<details>
<summary>10. <span style="color:green;">Version control System</span></summary>

   > Every topic below links to a beginner-friendly guide: each sub-topic is explained in plain words with an analogy, then how it works, a runnable **modern C++** example with its output, common mistakes, and a ready-to-say interview answer.

   - [ ] [**Git**](./Version%20Control%20Systems/Git-Explained.md) · [Command reference](./Version%20Control%20Systems/Git.md)
   - [ ] [**Bitbucket**](./Version%20Control%20Systems/Bitbucket.md)

</details>


## <span style="color:darkolivegreen;">**Features**</span>
- **Structured Learning Path**: Follow a well-organized roadmap covering key domains such as **Data Structures**, **Algorithms**, **System Design**, **Operating Systems**, **Networking**, **Databases**, and more.
- **Beginner Guides with Modern C++**: Every topic in System Design, Operating Systems, Networking, Databases, Programming Languages, System Architecture, Problem-solving and Version Control links to a guide that explains it from zero (analogy → how it works → common mistakes → interview answer) with a complete, runnable C++20 example and its expected output. Compile any example with `g++ -std=c++20 -pthread main.cpp` (examples using `std::expected` need `-std=c++23`; examples marked *Linux/macOS* use POSIX APIs).
- **Checklist-based Approach**: Track your progress systematically with checklist-style items for each topic, ensuring thorough coverage of concepts and practical skills.
- **Recommended Resources**: Access curated lists of recommended resources, including books, online courses, coding platforms, articles, and practice problems to enhance your understanding and skills.
- **Tailored Preparation**: Customize your preparation based on the specific requirements and focus areas of the companies you're interviewing with, maximizing your chances of success.
- **Tips and Recommendations**: Benefit from valuable tips and recommendations for problem-solving, coding practice, behavioral and soft skills development, and adapting to different interview formats.

## <span style="color:darkolivegreen;">**How to Use** </span>
1. **Clone the Repository**: Clone this repository to your local machine using Git.
2. **Navigate to Domains**: Explore the `Domains` directory to find checklists for different domains/topics.
3. **Check Off Items**: As you study and practice, mark off checklist items to track your progress.
4. **Explore Resources**: Browse through the `Resources` directory for recommended resources corresponding to each domain/topic.
5. **Customize Your Plan**: Tailor your preparation plan based on your strengths, weaknesses, and the requirements of the companies you're targeting.
6. **Community Learning**: Engage with fellow learners, share insights, ask questions, and collaborate on improving the roadmap together.
7. **Stay Updated**: Periodically update your progress and revisit topics to reinforce your understanding and skills.

## <span style="color:darkolivegreen;">**Contributions**</span>
Contributions are welcome! If you have suggestions for improving the roadmap, additional resources to recommend, or want to fix any errors, feel free to open an issue or submit a pull request.

## <span style="color:darkolivegreen;">**Disclaimer**<span>
This roadmap is intended as a general guideline and may not cover every aspect of SDE interviews. It's essential to supplement my preparation with additional resources and adapt based on individual needs and experiences.

## <span style="color:darkolivegreen;">**Credits**</span>
This project is inspired by various interview preparation resources and the collective wisdom of the developer community.
