# DBMS layers: full map, CMU 15-445 L01–L07

**What it's for:** quick revision of everything in lectures 1–7, layer by layer, with every option the course lists. Read the diagrams top to bottom: the same order a query travels, from SQL down to the disk.

> **Source:** CMU 15-445/645 Fall 2025, notes and slides for [L01](https://15445.courses.cs.cmu.edu/fall2025/notes/01-relationalmodel.pdf) · [L02](https://15445.courses.cs.cmu.edu/fall2025/notes/02-modernsql.pdf) · [L03](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) · [L04](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) · [L05](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) · [L06](https://15445.courses.cs.cmu.edu/fall2025/notes/06-storage3.pdf) · [L07](https://15445.courses.cs.cmu.edu/fall2025/notes/07-hashtables.pdf) (slides: same names under `/slides/`). Nothing here comes from outside those files. A line marked *(slides)* is only on the slides, not in the notes.

**Contents**
1. [The whole stack](#1-the-whole-stack)
2. [L01: relational model and algebra](#2-l01-relational-model-and-algebra)
3. [L02: modern SQL](#3-l02-modern-sql)
4. [L03: storage hierarchy](#4-l03-storage-hierarchy)
5. [L03: files and pages](#5-l03-files-and-pages)
6. [L03/L05: the three page layouts](#6-l03l05-the-three-page-layouts)
7. [L03: tuple layout and data representation](#7-l03-tuple-layout-and-data-representation)
8. [L05: tuple-oriented storage, step by step](#8-l05-tuple-oriented-storage-step-by-step)
9. [L05: log-structured storage](#9-l05-log-structured-storage)
10. [L06: workloads and storage models](#10-l06-workloads-and-storage-models)
11. [L06: compression](#11-l06-compression)
12. [L04: buffer pool](#12-l04-buffer-pool)
13. [L04: why not the OS (mmap)](#13-l04-why-not-the-os-mmap)
14. [L04: replacement policies](#14-l04-replacement-policies)
15. [L04: dirty pages, I/O scheduling, OS cache, fsync](#15-l04-dirty-pages-io-scheduling-os-cache-fsync)
16. [L04/L05: buffer pool optimizations](#16-l04l05-buffer-pool-optimizations)
17. [L07: hash tables](#17-l07-hash-tables)
18. [One-page recap](#18-one-page-recap)

---

## 1. The whole stack

The layers are from the L03 "Course outline" slide. Query planning, operator execution, concurrency control and recovery come after L07, so they are only named here.

```mermaid
flowchart TB
    APP["Application"] -->|"SQL (L01, L02)"| QP
    subgraph DBMS["DBMS"]
        QP["Query Planning<br/>(later lectures)"] --> OE["Operator Execution<br/>(later lectures)"]
        OE --> AM["Access Methods<br/>hash tables (L07), B+Trees (later)"]
        AM --> BPM["Buffer Pool Manager (L04, L05)<br/>frames, page table, replacement, dirty pages"]
        BPM --> DM["Disk Manager / Storage Manager (L03, L05, L06)<br/>files, pages, page layout, tuple layout, storage model, compression"]
    end
    DM --> DISK[("Non-volatile disk<br/>database files: directory page + pages")]
    CC["Concurrency Control (later)"] -.-> DBMS
    REC["Database Recovery (later)"] -.-> DBMS
```

How one request moves through it (L03 §4 "Disk-oriented DBMS overview"):

```mermaid
sequenceDiagram
    participant EE as Execution engine
    participant BP as Buffer pool
    participant D as Disk (database file)
    EE->>BP: Get page #2
    BP->>D: Read page directory (page 0), find page #2
    D-->>BP: Page #2 copied into a free frame
    BP-->>EE: Pointer to page #2 in memory
    Note over EE,BP: The buffer pool keeps the page in memory<br/>while the engine works on it (pinned)
    EE->>BP: Done (unpin), page may now be evicted
```

---

## 2. L01: relational model and algebra

```mermaid
flowchart TB
    DB["Database: organized collection of inter-related data"] --> DBMS1["DBMS: software that manages a database"]
    FF["Flat file strawman (CSV per entity)"] --> FFI["Problems"]
    FFI --> I1["Data integrity: same artist per album? invalid year? many artists? delete artist with albums?"]
    FFI --> I2["Implementation: find a record? new app, other machine? two threads write the same file?"]
    FFI --> I3["Durability: crash during update? replicate for high availability?"]
    DBMS1 --> DMOD["Data model: concepts that describe the data"]
    DBMS1 --> SCH["Schema: description of a collection of data in a data model"]
    DMOD --> M1["Relational (most DBMSs)"]
    DMOD --> M2["Key/Value (simple apps, caching)"]
    DMOD --> M3["Graph (NoSQL)"]
    DMOD --> M4["Document / XML / Object (NoSQL)"]
    DMOD --> M5["Wide-column / column-family (NoSQL)"]
    DMOD --> M6["Array / Matrix / Vector (ML, science)"]
    DMOD --> M7["Hierarchical, Network, Multi-Value (obsolete, legacy, rare)"]
```

```mermaid
flowchart TB
    RM["Relational model (Ted Codd, IBM, 1969)"] --> S["Structure: relations + attributes, each attribute has a domain"]
    RM --> IN["Integrity: constraints must hold"]
    RM --> MA["Manipulation: declarative API, DBMS picks the plan"]
    RM --> DI["Data independence: physical changes do not break the app"]
    S --> REL["Relation = unordered set of tuples = table<br/>n-ary relation = n columns"]
    REL --> T["Tuple: set of attribute values; NULL = undefined"]
    REL --> PK["Primary key: uniquely identifies a tuple<br/>(some DBMSs auto-create one, identity column)"]
    REL --> FK["Foreign key: attribute maps to a tuple in another relation"]
    IN --> CON["Constraints: unique key, referential (FK), NOT NULL"]
    MA --> DML["DML classes"]
    DML --> PROC["Procedural: says HOW (for loop to count)"]
    DML --> DECL["Non-procedural / declarative: says WHAT (SELECT COUNT(*))"]
```

```mermaid
flowchart LR
    RA["Relational algebra: each operator takes relations, outputs a relation"] --> SEL["Select σ: rows matching a predicate<br/>WHERE"]
    RA --> PRJ["Projection π: only some attributes, can reorder/compute<br/>SELECT b_id-100, a_id"]
    RA --> UNI["Union ∪: in at least one input<br/>UNION ALL"]
    RA --> INT["Intersection ∩: in both<br/>INTERSECT"]
    RA --> DIF["Difference −: in first, not second<br/>EXCEPT"]
    RA --> PRD["Product ×: all combinations<br/>CROSS JOIN"]
    RA --> JN["Join ⋈: combine tuples equal on shared attributes<br/>JOIN ... USING"]
    RA --> OBS["Order matters for speed:<br/>R ⋈ σ(S) is much faster than σ(R ⋈ S)<br/>when S is huge and the filter keeps 1 tuple<br/>so: say WHAT, let the optimizer pick HOW"]
    OTHER["Other data models"] --> DOC["Document: hierarchy of field/value pairs, JSON (older: XML)"]
    OTHER --> VEC["Vector: 1-D arrays for nearest-neighbor search on embeddings<br/>specialized indexes; pgvector in relational DBMSs"]
```

---

## 3. L02: modern SQL

```mermaid
flowchart TB
    SQL["SQL: declarative; IBM System R, 1970s, 'SEQUEL'<br/>minimum to claim SQL support: SQL-92"] --> STD["Standards: 1999 regex, triggers · 2003 XML, windows, sequences · 2008 truncation, fancy sorting · 2011 temporal, pipelined DML · 2016 JSON, polymorphic tables · 2023 property graph queries, multi-dim arrays"]
    SQL --> CLS["Command classes"]
    CLS --> DML["DML: SELECT, INSERT, UPDATE, DELETE"]
    CLS --> DDL["DDL: tables, indexes, views, other objects"]
    CLS --> DCL["DCL: security, access control"]
    CLS --> OTH["Also: views, integrity + referential constraints, transactions"]
    SQL --> BAG["SQL uses bags (duplicates allowed), algebra uses sets<br/>DISTINCT removes duplicates"]
```

```mermaid
flowchart TB
    Q["SELECT query features"] --> AGG["Aggregates: AVG MIN MAX SUM COUNT<br/>COUNT/SUM/AVG support DISTINCT<br/>non-aggregated column outside GROUP BY is undefined → ANY_VALUE (SQL:2023)"]
    Q --> GB["GROUP BY: one aggregate per group"]
    GB --> GS["GROUPING SETS: many groupings, one scan<br/>e.g. (name, grade), (name), ()"]
    GB --> HV["HAVING: filters groups (WHERE filters rows)<br/>standard form repeats AVG(...) in HAVING"]
    Q --> STR["Strings: case-sensitive, single quotes (standard)<br/>LIKE: % any substring, _ one char · SIMILAR TO regex<br/>SUBSTRING, UPPER · concat ||"]
    Q --> DT["Date/time ops: syntax varies a lot by system"]
    Q --> RED["Output redirection: SELECT ... INTO new table<br/>INSERT INTO existing (same columns/types)"]
    Q --> OC["Output control: ORDER BY (ASC default, DESC, many keys, expressions)<br/>LIMIT n OFFSET m; without ORDER BY results may differ"]
    Q --> WIN["Window functions: partition → sort → window per row → output<br/>ROW_NUMBER, RANK, any aggregate · OVER (PARTITION BY ... ORDER BY ...)<br/>RANK after sorting, ROW_NUMBER before"]
    Q --> NQ["Nested queries: in SELECT, FROM, WHERE<br/>inner sees outer attributes, not the reverse<br/>ALL, ANY, IN (= ANY), EXISTS"]
    Q --> LAT["LATERAL: a nested query references earlier ones<br/>like a for loop per tuple"]
    Q --> CTE["CTE: WITH name AS (...), temp table for one query<br/>column names, many CTEs, WITH RECURSIVE → Turing-complete"]
```

---

## 4. L03: storage hierarchy

```mermaid
flowchart TB
    subgraph VOL["Volatile: random access, byte-addressable = 'memory'"]
        R["CPU registers"] --> C["CPU caches<br/>L1 1 ns · L2 4 ns"] --> DR["DRAM 100 ns"]
    end
    subgraph NV["Non-volatile: sequential access, block-addressable = 'disk'"]
        SSD["SSD 16,000 ns"] --> HDD["HDD 2,000,000 ns"] --> NET["Network storage ~50,000,000 ns"]
    end
    DR --> SSD
    NET --> TAPE["Tape archives 1,000,000,000 ns (slides)"]
    SCALE["If L1 = 1 second: SSD = 4.4 hours, HDD = 3.3 weeks,<br/>network = 1.5 years, tape = 31.7 years"]
    UP["Up: faster, smaller, more expensive"] -.- R
    DOWN["Down: slower, larger, cheaper per GB"] -.- NET
```

```mermaid
flowchart LR
    G["Design goals of a disk-oriented DBMS"] --> G1["Manage databases larger than memory"]
    G --> G2["Avoid long stalls on disk I/O"]
    G --> G3["Maximize sequential access<br/>random is almost always slower;<br/>some systems buffer random writes, write them later"]
```

---

## 5. L03: files and pages

```mermaid
flowchart TB
    FILES["Database = one or more files on disk<br/>(file hierarchy, or a single file like SQLite)"] --> FMT["Proprietary format (only that DBMS reads it)<br/>or portable open formats; the OS knows nothing about the contents"]
    FILES --> FS["Runs on the OS file system<br/>some enterprise systems use a custom FS / raw block storage: Oracle (ASM), Teradata"]
    FILES --> SM["Storage manager: files as a collection of pages<br/>tracks reads/writes and free space"]
    SM --> REPL["Replication is NOT here:<br/>below (file system, RAID) or above (logical copies of tuples)"]
    SM --> PAGE["Page: fixed-size block, unique page ID<br/>one kind of data per page (tuples, indexes...)<br/>some systems: self-contained pages (Oracle)"]
    PAGE --> IND["Indirection layer: page ID → file path + offset"]
    PAGE --> KINDS["Three kinds of page<br/>hardware 4 KB · OS 4 KB · database 1-16 KB"]
    KINDS --> SIZE["Read-only workloads: larger pages (≥ 1 MB)<br/>write-heavy: smaller (4-16 KB)"]
    KINDS --> ATOM["Only the hardware page write is atomic<br/>DB page bigger than 4 KB needs extra care for torn writes"]
    PAGE --> FIX["Fixed size, because variable-size pages leave holes on delete"]
```

```mermaid
flowchart TB
    ORG["Page storage architecture (how pages sit in files)"] --> HEAP["Heap file organization<br/>unordered pages, tuples in random order"]
    ORG --> TREE["Tree file organization"]
    ORG --> ISAM["Sequential / sorted file organization (ISAM)"]
    ORG --> HASH["Hashing file organization"]
    HEAP --> HOPS["Create / Get / Write / Delete page + iterate all pages"]
    HEAP --> ONE["Single file: offset = page# × page size"]
    HEAP --> DIR["Many files: page directory<br/>special pages, one entry per object (data pages, index pages)<br/>kept in sync with the pages<br/>tracks free space per page, free pages, page types"]
    HDR["Every page header"] --> H1["Page size"]
    HDR --> H2["Checksum"]
    HDR --> H3["DBMS version"]
    HDR --> H4["Transaction visibility"]
    HDR --> H5["Self-containment (e.g. Oracle)"]
```

---

## 6. L03/L05: the three page layouts

```mermaid
flowchart TB
    PL["How to organize data INSIDE a page"] --> TO["1. Tuple-oriented storage"]
    PL --> LS["2. Log-structured storage (section 9)"]
    PL --> IO["3. Index-organized storage"]
    TO --> STRAW["Strawman: count tuples, append at the end<br/>breaks on deletes and variable-length attributes"]
    TO --> SLOT["Slotted pages (most common)"]
    SLOT --> SH["Header: number of used slots, offset of the last used slot, slot array"]
    SLOT --> SG["Slot array grows from the start, tuple data grows from the end<br/>page is full when they meet"]
    SLOT --> RID["Record ID = physical location (file id, page id, slot#)<br/>4-10 bytes, usually not stored in the tuple<br/>apps must not rely on it"]
    IO --> IO1["Tuples are the VALUES of an index (B+Tree, skip list, trie)"]
    IO --> IO2["Page looks like a slotted page: key → offset array<br/>tuples sorted by key in the page (leaf nodes)"]
    IO --> IO3["Slotted pages and log-structured need an extra index to find tuples;<br/>index-organized does not"]
```

---

## 7. L03: tuple layout and data representation

```mermaid
flowchart TB
    TUP["Tuple = sequence of bytes (not always contiguous)<br/>the DBMS interprets them into types and values<br/>(slides: reinterpret_cast on a char[])"] --> TH["Tuple header"]
    TUP --> TD["Tuple data"]
    TH --> TH1["Visibility info for concurrency control<br/>(which txn created/modified it)"]
    TH --> TH2["Bitmap for NULL values"]
    TH --> TH3["No schema metadata needed here"]
    TD --> TD1["Attributes in CREATE TABLE order (usually)"]
    TD --> TD2["Must be word aligned (64-bit words)"]
    TD --> TD3["Most DBMSs: a tuple cannot exceed one page"]
    TD2 --> PAD["Padding: add empty bits after attributes<br/>(round types up to the word size)"]
    TD2 --> REO["Reordering: change physical attribute order<br/>may still need padding (slides)"]
```

```mermaid
flowchart TB
    REP["Data representation"] --> INT["INTEGER, BIGINT, SMALLINT, TINYINT<br/>native C/C++ format"]
    REP --> FLT["FLOAT, REAL: variable precision<br/>IEEE-754, inexact, fast (CPU support)"]
    REP --> NUM["NUMERIC, DECIMAL: fixed precision<br/>arbitrary precision and scale, e.g. exact variable-length binary<br/>(slides) Postgres numeric: ndigits, weight, scale, sign, digits[]"]
    REP --> VAR["VARCHAR, VARBINARY, TEXT, BLOB<br/>header with length + bytes, or pointer to another page + offset"]
    REP --> TIME["TIME, DATE, TIMESTAMP, INTERVAL<br/>32/64-bit integer of micro/milliseconds since Unix epoch"]
    VAR --> OVF["Large values: overflow pages, record id kept inline<br/>optimizations: compress the overflow page, keep a prefix inline<br/>(slides) Postgres TOAST over 2 KB · MySQL over ½ page · SQL Server over 1 page<br/>(slides) Overflow compression, German strings"]
    VAR --> EXT["External value storage: value in an external file, treated as BLOB<br/>(slides) Oracle BFILE, Microsoft FILESTREAM<br/>DBMS cannot change it: no durability, no transaction guarantees"]
    REP --> NUL["NULLs"]
    NUL --> N1["Null column bitmap in the header<br/>most common in row stores"]
    NUL --> N2["Special value (e.g. INT32_MIN)<br/>most common in column stores"]
    NUL --> N3["Per-attribute null flag<br/>bad: padding for alignment wastes space"]
```

---

## 8. L05: tuple-oriented storage, step by step

```mermaid
flowchart LR
    subgraph READ["Read by record ID"]
        R1["Page directory → page location"] --> R2["Fetch page into the buffer pool"] --> R3["Slot array → tuple offset"]
    end
    subgraph INS["Insert"]
        I1["Page directory → page with a free slot"] --> I2["Fetch page"] --> I3{"Enough free space?<br/>(slot array)"}
        I3 -->|yes| I5["Insert tuple, update slot array"]
        I3 -->|no| I4["Other page with a free slot, or a new page"] --> I5
    end
    subgraph UPD["Update"]
        U1["Find tuple like a read"] --> U2{"New value fits?"}
        U2 -->|yes| U3["Update in place"]
        U2 -->|no| U4["Mark old as deleted, insert new as a new tuple"]
    end
    PROB["Problems"] --> P1["Fragmentation: deletes leave gaps"]
    PROB --> P2["Useless disk I/O: whole block to change one tuple"]
    PROB --> P3["Random disk I/O: 20 tuples = 20 places"]
    PROB --> P4["What if the storage forbids in-place updates?<br/>(HDFS, Google Colossus, some object stores) → log-structured"]
```

---

## 9. L05: log-structured storage

Based on log-structured file systems and LSM trees.

```mermaid
flowchart TB
    W["Write: PUT(key, tuple) or DELETE(key)"] --> MT["MemTable (in memory)<br/>record = tuple id, op type, contents for PUT"]
    MT -->|"full: sort by key, write sequentially"| L0["SSTable (immutable, on disk)"]
    RD["Read key"] --> C1{"In MemTable?"}
    C1 -->|yes| OUT["Latest value (newest PUT/DELETE wins)"]
    C1 -->|no| C2["SSTables newest → oldest, binary search in each<br/>slow, so: in-memory SummaryTable<br/>min/max key per SSTable + key filter (Bloom filter) per level"]
    C2 --> OUT
    L0 --> CMP["Compaction: sort-merge SSTables, keep only the newest change per key<br/>less space, faster reads"]
    CMP --> LEV["Leveled compaction<br/>size limit per level; level 0 = fresh flushes, overlapping ranges<br/>other levels non-overlapping, sorted<br/>merge a file into the next level<br/>better for read-heavy (slides)"]
    CMP --> UNIV["Universal compaction<br/>one 'universal' level, no hierarchy<br/>compact when too many SSTables overlap or exceed size thresholds<br/>better for insert-heavy + time-oriented queries (slides)"]
    TR["Trade-offs"] --> T1["+ fast sequential writes, good for append-only storage"]
    TR --> T2["− reads may be slow"]
    TR --> T3["− compaction is expensive"]
    TR --> T4["− write amplification: one logical write → many physical writes"]
    TR --> T5["More common today, partly due to RocksDB (slides)"]
```

---

## 10. L06: workloads and storage models

```mermaid
flowchart LR
    WL["Workloads"] --> OLTP["OLTP: fast, short, repetitive, simple queries on one entity<br/>write-heavy · e.g. Amazon storefront"]
    WL --> OLAP["OLAP: long, complex queries, aggregates, read large parts<br/>read-heavy · e.g. personalized Amazon ads"]
    WL --> HTAP["HTAP: OLTP + OLAP on the same instance"]
    OLTP -->|"best fit"| NSM
    OLAP -->|"best fit"| DSM
    NSM["NSM / row store<br/>all attributes of a tuple together in a slotted page<br/>record id (page#, slot#)<br/>pages = multiple of 4 KB"]
    DSM["DSM / column store<br/>one attribute for all tuples together<br/>separate pages per attribute, header + null bitmap"]
    PAX["PAX (hybrid)<br/>row groups (horizontal), column chunks inside (vertical)<br/>global header / directory with row-group offsets<br/>(footer if immutable: Parquet, ORC)<br/>each row group has its own metadata header"]
    NSM --- PAX --- DSM
```

```mermaid
flowchart TB
    NSMp["NSM"] --> NP["+ fast insert, update, delete<br/>+ queries that need the whole tuple<br/>+ can use index-organized storage for clustering"]
    NSMp --> NM["− slow scans of large parts / few attributes<br/>− poor memory locality<br/>− hard to compress (mixed value domains in a page)"]
    DSMp["DSM"] --> DP["+ less wasted I/O: read only needed attributes<br/>+ faster processing: locality, cache reuse<br/>+ better compression"]
    DSMp --> DM["− slow point queries, inserts, updates, deletes<br/>(tuple splitting / stitching)"]
    DSMp --> TID["Putting tuples back together"]
    TID --> FO["Fixed-length offsets (most common)<br/>same offset in every column = same tuple"]
    TID --> ET["Embedded tuple ids (less common)<br/>id stored with every value: big overhead"]
    DSMp --> VL["Variable-length data: padding is wasteful<br/>→ dictionary compression to fixed-length (32-bit ints) (slides)"]
```

Mixing row and column storage (slides):

```mermaid
flowchart LR
    subgraph BIF["Bifurcated environment"]
        O1["OLTP databases"] -->|"ETL: extract, transform, load<br/>or ELT"| O2["OLAP database"]
    end
    subgraph HYB["Hybrid storage model: separate NSM and DSM engines, results combined as one DB"]
        FM["Choice 1: Fractured mirrors<br/>2nd copy in DSM, auto-updated; writes go to NSM first<br/>updates must invalidate tuples in the mirror<br/>Oracle, IBM DB2 Blu, SQL Server"]
        DS["Choice 2: Delta store<br/>stage updates in an NSM table; background thread migrates to DSM<br/>batch → PAX file; delete from delta once in column store<br/>SAP HANA, Vertica, SingleStore, Databricks, Google Napa"]
    end
    CONC["Conclusion: OLTP = row store, OLAP = column store"]
```

---

## 11. L06: compression

```mermaid
flowchart TB
    WHY["Why: disk I/O is (almost) always the bottleneck<br/>more useful tuples per I/O, at a CPU cost<br/>in-memory DBMS: less DRAM, maybe less CPU, trade speed vs ratio"] --> GOALS["Goals"]
    GOALS --> G1["Fixed-length values (except variable data in separate pools)<br/>keeps word alignment and offset access"]
    GOALS --> G2["Late materialization: decompress as late as possible"]
    GOALS --> G3["Lossless (lossy only at application level)"]
    GRAN["Granularity"] --> B["Block: block of tuples, same table"]
    GRAN --> T["Tuple: whole tuple (NSM only)"]
    GRAN --> A["Attribute: one value in a tuple (can do several attributes)"]
    GRAN --> C["Columnar: many values of one or more attributes (DSM only)"]
```

```mermaid
flowchart TB
    NAIVE["Naive compression: general-purpose algorithm<br/>Deflate, LZO, LZ4, Snappy, Oracle OZIP, Zstd, Lizard<br/>engineers pick faster over higher ratio"] --> N1["Compress pages, pad to a power of 2 KB, store in the buffer pool"]
    N1 --> N2["Must decompress before every read/update<br/>blind writes need no decompression"]
    N2 --> N3["Limits scope: cannot compress a whole table as one block<br/>→ MySQL splits the table into smaller chunks"]
    N3 --> N4["No semantics: does not know the data or the query → no late materialization"]
    N1 --> INNO["(slides) MySQL InnoDB: compressed pages of 1, 2, 4 or 8 KB + 'mod log'<br/>a read brings an uncompressed 16 KB copy into the buffer pool<br/>writes go to the mod log"]
```

```mermaid
flowchart TB
    COL["Columnar compression: read without fully decompressing"] --> RLE["Run-length encoding<br/>triplets: (value, start offset, run length)<br/>sort columns first to make longer runs"]
    COL --> BP["Bit packing<br/>values smaller than the declared size → fewer bits"]
    COL --> MOST["Patching / mostly encoding<br/>bit packing + marker for big values + lookup table"]
    COL --> BMP["Bitmap encoding<br/>one bitmap per distinct value, bit i = tuple i<br/>segmented into chunks<br/>only for LOW cardinality; Roaring Bitmaps for sparse"]
    COL --> DEL["Delta encoding<br/>store differences; base inline or in a lookup table<br/>+ RLE on deltas"]
    COL --> DICT["Dictionary compression (most common)<br/>frequent values → small codes + dictionary code ↔ value<br/>fast encode AND decode → no hash functions"]
    DICT --> OP["Order-preserving: codes sort like the values<br/>range queries + ops on codes"]
    OP --> OP1["LIKE 'And%' on the column: still scans the column"]
    OP --> OP2["SELECT DISTINCT ... LIKE 'And%': only the dictionary"]
    DICT --> BEST["(slides) Dictionary is probably the most useful: no pre-sorting needed<br/>schemes can be combined"]
```

---

## 12. L04: buffer pool

```mermaid
flowchart TB
    BPM["Buffer pool: in-memory cache of pages<br/>array of fixed-size FRAMES<br/>write-back cache (not write-through)"] --> PT["Page table (in memory only)<br/>page ID → frame"]
    PT --> DF["Dirty flag: page changed, write before eviction"]
    PT --> PIN["Pin / reference counter: threads using it<br/>pinned = cannot evict; full + all pinned = out-of-memory error<br/>pinning does not block other readers"]
    PT --> ACC["Access tracking info: who is accessing it"]
    BPM --> PD["Page directory (on disk, often cached)<br/>page ID → location in the database files<br/>changes must be recorded on disk for restart"]
    BPM --> POOLS["Other memory pools (may not be backed by disk)<br/>sorting + join buffers · query caches · dictionary caches<br/>maintenance buffers · log buffers"]
    CTRL["What the BPM optimizes"] --> SP["Spatial control: pages used together sit close on disk"]
    CTRL --> TP["Temporal control: when to read in / write out, fewer stalls"]
    LL["Locks vs latches"] --> LK["Lock: logical, protects DB contents (tuples, tables) between txns<br/>visible to users, must roll back"]
    LL --> LA["Latch: low-level, protects internal structures (hash table, memory)<br/>held for one operation, no rollback, mutex / condition variable"]
```

Fetch a page (from the definitions above):

```mermaid
flowchart TB
    REQ["Request page P"] --> HIT{"P in page table?"}
    HIT -->|yes| PINP["Pin P (count + 1), return frame pointer"]
    HIT -->|no| FREE{"Free frame?"}
    FREE -->|yes| LOAD["Read P from disk (page directory → file + offset) into the frame<br/>add P → frame to page table"]
    FREE -->|no| VIC{"Replacement policy finds an unpinned victim?"}
    VIC -->|no| OOM["Out-of-memory error"]
    VIC -->|yes| DIRTY{"Victim dirty?"}
    DIRTY -->|"no: fast path"| DROP["Just drop it"] --> LOAD
    DIRTY -->|"yes: slow path"| WB["Write victim to disk first"] --> LOAD
    LOAD --> PINP
```

---

## 13. L04: why not the OS (mmap)

```mermaid
flowchart TB
    MM["mmap: map the file into the address space<br/>OS moves pages; a page fault blocks the process"] --> P1["1. Transaction safety: OS can flush dirty pages at any time"]
    MM --> P2["2. I/O stalls: DBMS does not know what is in memory"]
    MM --> P3["3. Error handling: hard to validate pages, any access can SIGBUS"]
    MM --> P4["4. Performance: OS data-structure contention, TLB shootdowns"]
    MM --> FIX["Partial fixes: madvise (planned reads), mlock (no swap), msync (flush)<br/>just as hard as managing memory yourself"]
    BETTER["The DBMS does better itself"] --> B1["Flush dirty pages in the correct order"]
    BETTER --> B2["Specialized prefetching"]
    BETTER --> B3["Better replacement policies"]
    BETTER --> B4["Thread / process scheduling"]
    RULE["Never use mmap if you need to write. The OS is not your friend."]
```

---

## 14. L04: replacement policies

Goals: correctness, accuracy, speed, metadata overhead. A pinned page is never evicted.

```mermaid
flowchart TB
    POL["Replacement policies"] --> LRU["LRU (1965): timestamp of last access, evict oldest<br/>sorted queue helps, but overhead is large"]
    POL --> CLK["CLOCK (1969): LRU approximation, one reference bit per page<br/>(some use a counter above 1)"]
    POL --> LFU["LFU (1971): access count, evict lowest<br/>log complexity, ignores time, keeps stale popular pages"]
    POL --> LRUK["LRU-K (1993): last K access times → predict next access<br/>more storage; ghost cache of recently evicted pages"]
    POL --> MY["MySQL approximate LRU-K (LRU-2)<br/>one list, two entry points: young + old<br/>hit in old → head of young; new → head of old; evict tail of old"]
    POL --> ARC["ARC (2003, IBM Research)<br/>recency + frequency, adapts list sizes<br/>DB2, PostgreSQL (rewritten: patent), ZFS (slides)"]
    POL --> LOC["Localization: choose victims per query / txn"]
    POL --> HINT["Priority hints: txn tells the pool which pages matter"]
    PROB["Problems with LRU + CLOCK"] --> SF["Sequential flooding: a scan fills the pool, evicts useful pages<br/>for scans, the MOST recently used page is often the best victim"]
    PROB --> FQ["LRU ignores frequency"]
```

CLOCK eviction:

```mermaid
flowchart LR
    S["Eviction needed"] --> H["Look at page under the clock hand"]
    H --> R{"Reference bit = 1?"}
    R -->|yes| Z["Set bit to 0, move hand forward"] --> H
    R -->|no| E["Evict it, put new page here, move hand forward<br/>(hand position is remembered)"]
    A["Any access"] --> SET["Set the page's bit to 1"]
```

ARC lists and lookup protocol:

```mermaid
flowchart TB
    subgraph LISTS["ARC state"]
        T1["T1 recent list: accessed once recently"]
        T2["T2 frequent list: accessed at least twice"]
        B1["B1 ghost of T1: recently evicted from T1"]
        B2["B2 ghost of T2: recently evicted from T2"]
        PP["p: target size, favor recency (T1) vs frequency (T2)"]
    end
    L["Look up page X (a page is in only one list)"] --> Q1{"Where is X?"}
    Q1 -->|"T1 (hit)"| A1["Promote T1 → T2"]
    Q1 -->|"T2 (hit)"| A2["Stay in T2"]
    Q1 -->|"B1 (miss)"| A3["Increase p (favor recency), move X into T2"]
    Q1 -->|"B2 (miss)"| A4["Decrease p (favor frequency), move X into T2"]
    Q1 -->|"nowhere (miss)"| A5["If T1 + B1 full → evict from B1 or T1<br/>if T2 + B2 full → evict from B2 or T2<br/>insert X into T1"]
```

---

## 15. L04: dirty pages, I/O scheduling, OS cache, fsync

```mermaid
flowchart TB
    DP["Dirty pages"] --> FAST["Not dirty: drop (fast path)"]
    DP --> SLOW["Dirty: write back first (slow path)"]
    DP --> BG["Background writing: walk the page table, write dirty pages,<br/>then evict or just clear the dirty flag"]
    IOS["Disk I/O scheduling: OS/hardware reorder + batch but do not know priorities<br/>DBMS keeps its own queues; priority from:"] --> Q1["Sequential vs random I/O"]
    IOS --> Q2["Critical path vs background task"]
    IOS --> Q3["Table vs index vs log vs ephemeral data"]
    IOS --> Q4["Transaction information"]
    IOS --> Q5["User-based SLAs"]
    OSC["OS page cache (filesystem / buffer cache)"] --> DIO["Most DBMSs use direct I/O (O_DIRECT) to bypass it<br/>avoids redundant page copies, different eviction policies, loss of control"]
    OSC --> PG["PostgreSQL uses the OS page cache"]
    FSY["fsync problems"] --> F1["fsync fails (EIO) → Linux marks dirty pages clean"]
    F1 --> F2["Next fsync says success → DBMS wrongly thinks data is safe"]
```

---

## 16. L04/L05: buffer pool optimizations

```mermaid
flowchart TB
    OPT["Buffer pool optimizations"] --> MBP["Multiple buffer pools: per database, table, page type<br/>local policies, less latch contention, better locality"]
    MBP --> OID["Object ID: embed object id in record ids, map objects → pools<br/>finer control, storage overhead"]
    MBP --> HSH["Hashing: HASH(page id) % n picks the pool<br/>general, uniform"]
    OPT --> PRE["Pre-fetching from the query plan<br/>sequential scans: next pages · index scans: next LEAF pages (logical, not physical)<br/>(slides) some DBMSs prefetch to fill empty frames at start-up"]
    OPT --> SCAN["Scan sharing / synchronized scans<br/>2nd query attaches to the running cursor, remembers where it joined, finishes the rest<br/>not result caching · DB2, MSSQL, Teradata, Postgres; Oracle only identical queries<br/>continuous scan sharing: academic, wasteful"]
    OPT --> BYP["(slides) Buffer pool bypass: sequential scan does not store pages in the pool<br/>memory local to the query; also for temp data (sorting, joins)<br/>'light scans' in Informix"]
    WIN["DBMS beats the OS on: evictions, allocations, pre-fetching"]
```

---

## 17. L07: hash tables

```mermaid
flowchart TB
    DS["DBMS data structures"] --> D1["Internal metadata: page tables, page directories"]
    DS --> D2["Core data storage: the tuples"]
    DS --> D3["Temporary: built per query, e.g. hash table for a join"]
    DS --> D4["Table indexes: find tuples fast"]
    DD["Design decisions"] --> DD1["Data organization: layout and its effect on performance"]
    DD --> DD2["Concurrency: many threads, no conflicts, correct"]
    HT["Hash table: key → value, average O(1), worst O(n), storage O(n)<br/>no ordering, no sequential access"] --> HF["Hash function: big key space → small domain<br/>fast vs collision rate; deterministic<br/>NOT cryptographic (no SHA-2)"]
    HT --> HS["Hashing scheme: what to do on collisions<br/>bigger table vs extra work on collision"]
    HF --> HFL["(slides) CRC-64 1975 · MurmurHash 2008 · Google CityHash 2011 (short keys)<br/>Facebook XXHash 2012 ← state of the art (XXHash3) · Google FarmHash 2014 · RapidHash 2019"]
    HS --> STAT["Static: size fixed in advance<br/>full → rebuild bigger (usually 2×); use 2× slots vs expected elements"]
    HS --> DYN["Dynamic: grow / shrink on demand without a full rebuild"]
    STAT --> ASM["Assumptions that usually fail: known element count, unique keys, perfect hash"]
```

```mermaid
flowchart TB
    LP["Linear probe hashing: circular array of slots<br/>usually fastest; no pointers, cache friendly<br/>primary clustering at high load factor"] --> LPI["Insert: on collision scan next slots, wrap around"]
    LP --> LPL["Lookup: scan from the hashed slot until found,<br/>empty slot, or full loop → store key AND value in the slot"]
    LP --> LPD["Delete"]
    LPD --> TOMB["Tombstone (most common): lookups keep scanning, inserts can reuse it"]
    LPD --> SHIFT["Shift adjacent entries back (only ones that were shifted)<br/>rarely done: expensive"]
    LP --> KV["Key/value storage"]
    KV --> FIXKV["Fixed-length: inline in the hash table pages (+ optional stored hash)"]
    KV --> VARKV["Variable-length: data in a temp table; table stores hash → record id"]
    LP --> NU["Non-unique keys"]
    NU --> SLL["Separate linked list of values (may overflow pages)"]
    NU --> RED["Redundant keys: store the key many times (more common)"]
    LP --> LPO["Optimizations"]
    LPO --> O1["Specialized tables by key type/size (short strings inline, long → pointer/hash)"]
    LPO --> O2["Metadata in a separate array: empty/tombstone bitmap in page header"]
    LPO --> O3["Versions: bump table version to clear; slot version ≠ table version = empty"]
    LP --> ABSL["State of the art: Google absl::flat_hash_map"]
```

```mermaid
flowchart TB
    CK["Cuckoo hashing: several tables (or several hash functions into one table)<br/>same algorithm, different seeds"] --> CI{"Insert: a table has a free slot?"}
    CI -->|"yes (several: load factor or random)"| CPUT["Put it there"]
    CI -->|no| CEV["Pick a table (usually random), evict the old entry,<br/>rehash the old entry into another table"]
    CEV --> CYC{"Cycle?"}
    CYC -->|no| CPUT
    CYC -->|yes| CRB["Rebuild: new seeds (less common) or bigger tables (more common)"]
    CK --> CG["O(1) lookups and deletes, inserts can cost more<br/>(professor's note: hashing itself may not be O(1))"]
```

```mermaid
flowchart TB
    CH["Chained hashing (most common dynamic)<br/>linked list of buckets per slot; lookup = hash + scan the chain"] --> EX["Extendible hashing: split buckets instead of long chains<br/>many slots can point to one bucket; only the split bucket moves"]
    EX --> EXD["Global depth + local depth = number of most significant bits looked at"]
    EX --> EXS{"Bucket full → split. Local depth below global depth?"}
    EXS -->|yes| EXA["Add the new bucket to the existing slot array"]
    EXS -->|no| EXB["Double the slot array, global depth + 1"]
    LH["Linear hashing: split pointer = next bucket to split<br/>overflow criterion is up to the implementation"] --> LH1["ANY bucket overflows → split the bucket AT THE POINTER (even if it is another one)<br/>add a slot + new hash function (key % 2n), rehash that bucket"]
    LH1 --> LH2["Lookup: hash1 (key % n) points to a slot already passed by the pointer → use hash2"]
    LH2 --> LH3["Pointer reaches the last slot → drop hash1, pointer back to the start"]
    LH --> LH4["Shrink: highest bucket below the pointer empty → remove it, move pointer back"]
    LH --> LH5["Grows and shrinks incrementally: no full rebuild"]
    END["(slides) Hash tables are usually not what you want for a table index<br/>CREATE INDEX ... USING BTREE vs USING HASH"]
```

---

## 18. One-page recap

```mermaid
flowchart TB
    SQLR["SQL (declarative, bags) on the relational model"] --> EXEC["Planning + execution (later)"]
    EXEC --> AMR["Access methods: hash tables<br/>static: linear probe, cuckoo · dynamic: chained, extendible, linear"]
    AMR --> BPR["Buffer pool: frames, page table, pin, dirty<br/>LRU, CLOCK, LFU, LRU-K, MySQL LRU-2, ARC<br/>multiple pools, prefetch, scan sharing, bypass, O_DIRECT"]
    BPR --> STR["Storage: files → pages (heap + directory) → layout<br/>slotted · log-structured · index-organized<br/>tuple header + aligned data · NULL options · overflow / external"]
    STR --> MOD["Storage model: NSM · DSM · PAX · fractured mirrors · delta store"]
    MOD --> CMPR["Compression: naive (page) or columnar<br/>RLE, bit packing, mostly, bitmap, delta, dictionary"]
    CMPR --> DSK[("Disk: sequential beats random")]
```
