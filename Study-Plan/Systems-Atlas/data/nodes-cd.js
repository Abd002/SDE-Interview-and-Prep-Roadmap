/* Layer C: Storage Engine */
N({ id: "heapfile", g: "C1", n: "Heap file", ab: "heap table unordered file", loc: ["DISK"], ln: "Pages on disk; cached pages in the buffer pool", own: "DBMS storage manager",
  p: "Store a table's tuples on disk with no particular order.",
  s: "An unordered collection of pages. New tuples go into any page with free space. Finding a tuple by value needs a scan or an index.",
  pro: ["Fast inserts, simple."], con: ["Lookups need an index or a full scan."], alt: "Index-organized storage (sorted by key), LSM storage (append-only runs).", rel: ["pagedir", "freespace", "seqscan"] });
N({ id: "page", g: "C1", n: "Database page", ab: "block page size 8KB", loc: ["DISK", "RAM"], ln: "Persistent on disk; a copy lives in a buffer frame while in use", own: "DBMS storage manager",
  p: "Disks read and write in blocks; the DBMS needs a fixed unit of storage and caching.",
  s: "A fixed-size block (commonly 4–16 KB; PostgreSQL 8 KB, MySQL InnoDB 16 KB) with a header (page ID, checksum, LSN, type) and contents (tuples, index entries).",
  h: ["Identified by a page ID.", "Read from disk into a buffer frame.", "Modified in RAM; pageLSN updated.", "Written back when flushed or evicted."],
  mis: "A database page is not an OS virtual-memory page (usually 4 KB) and not a hardware sector/flash page; the three sizes are independent.",
  f: ["Torn write: a crash mid-write of a page larger than the device's atomic unit leaves half old, half new (see crash consistency)."], rel: ["vmem", "crashcons", "frame"] });
N({ id: "pagedir", g: "C1", n: "Page directory", ab: "page directory file offset mapping", loc: ["DISK", "RAM"], ln: "Persisted on disk, usually cached in RAM", own: "DBMS storage manager",
  p: "Upper layers ask for page 42; something must know which file and offset holds it.",
  s: "Special pages mapping page ID → physical location (file, offset), plus per-page metadata such as free space and type.",
  mis: "The page directory (on disk: page ID → disk location) is not the buffer pool page table (in RAM: page ID → frame).", rel: ["pagetable", "diskmgr"] });
N({ id: "freespace", g: "C1", n: "Free-space management", ab: "free space map FSM fragmentation vacuum", loc: ["DISK", "RAM"], own: "DBMS storage manager",
  p: "Inserts need to find a page with enough room without scanning every page.",
  s: "Track approximate free bytes per page (a free-space map or lists of pages with space). Deletes and updates create holes; compaction or VACUUM reclaims them.",
  f: ["Fragmentation wastes space and I/O until pages are compacted."], ex: "PostgreSQL keeps a free space map fork per table." });
N({ id: "slotted", g: "C2", n: "Slotted page", ab: "slot array slotted page layout", loc: ["DISK", "RAM"], own: "DBMS storage manager",
  p: "Store variable-length tuples in a page and let them move without changing their external IDs.",
  s: "Header + slot array grows from the front; tuple data grows from the back. A slot stores the offset and length of a tuple. The page is full when they meet.",
  art: `┌ header │ s1 s2 s3 → ......... ← t3 │ t2 │ t1 ┐
└────────────────────────────────────────────────┘
 slot i = (offset,len) → tuple i`,
  pro: ["Tuples can be compacted inside the page; RIDs stay stable."], con: ["Fragmentation after deletes; random I/O for scattered updates."], rel: ["rid", "tuple"] });
N({ id: "tuple", g: "C2", n: "Tuple layout (records)", ab: "record row header null bitmap", loc: ["DISK", "RAM"], own: "DBMS storage manager",
  p: "Interpret a sequence of bytes as typed attribute values.",
  s: "A tuple is a header (visibility info for concurrency control, NULL bitmap) followed by attribute data in schema order, word-aligned. The schema is in the catalog, not in the tuple.",
  ex: "PostgreSQL tuple header holds xmin/xmax transaction IDs used by MVCC.", rel: ["mvcc", "catalog", "datarep"] });
N({ id: "rid", g: "C2", n: "Page ID & record ID", ab: "RID TID ctid page id slot", loc: ["LOGIC", "DISK"], own: "DBMS storage manager",
  p: "Indexes need a compact pointer to a specific tuple.",
  s: "A record ID = (page ID, slot number), sometimes with a file ID. It names the tuple's physical location; apps must not rely on it.",
  ex: "PostgreSQL ctid (block, offset).", f: ["When a tuple moves to another page, indexes holding its RID must be updated (or a forwarding pointer left)."] });
N({ id: "datarep", g: "C2", n: "Data representation", ab: "IEEE-754 decimal varchar overflow page TOAST NULL", loc: ["DISK", "RAM"], own: "DBMS storage manager",
  p: "Store each SQL type correctly and compactly.",
  s: "Integers in native format; FLOAT as IEEE-754 (fast, inexact); DECIMAL as exact fixed-point; VARCHAR/BLOB as length + bytes, with overflow pages for values bigger than a page; timestamps as integers since the epoch. NULLs via a bitmap (row stores) or special values (column stores).",
  ex: "PostgreSQL TOAST moves large values to a side table." });
N({ id: "nsm", g: "C3", n: "Row storage (NSM)", ab: "N-ary storage model row store OLTP", loc: ["DISK", "RAM"], own: "DBMS storage engine",
  p: "OLTP reads and writes whole rows, one entity at a time.",
  s: "All attributes of a tuple are stored together in a slotted page.",
  pro: ["One page fetch gets the whole row; fast insert/update/delete."], con: ["Scanning a few columns reads every column; poor compression."], cmp: "rowcol", ex: "PostgreSQL, MySQL InnoDB." });
N({ id: "dsm", g: "C3", n: "Column storage (DSM)", ab: "decomposition storage model column store OLAP", loc: ["DISK", "RAM"], own: "DBMS storage engine",
  p: "Analytics scans a few columns of many rows.",
  s: "Each attribute is stored contiguously for all tuples. Tuples are stitched back by position (fixed-length offsets) or by embedded IDs.",
  pro: ["Reads only needed columns; compresses well; vectorizes well."], con: ["Point lookups and updates must touch many columns."], cmp: "rowcol", ex: "ClickHouse, Vertica, DuckDB.", rel: ["compression", "vectorized"] });
N({ id: "pax", g: "C3", n: "PAX / hybrid row groups", ab: "PAX Parquet ORC row group", loc: ["DISK"], own: "Storage format",
  p: "Get column-scan speed while keeping a row's columns physically close.",
  s: "Rows are split horizontally into row groups; inside each group values are stored column by column. A footer/header holds offsets and statistics.",
  ex: "Apache Parquet and ORC files.", rel: ["columnar", "zonemap"] });
N({ id: "ios", g: "C3", n: "Index-organized storage", ab: "clustered index table IOT InnoDB primary key", loc: ["DISK", "RAM"], own: "DBMS storage engine",
  p: "Avoid a separate heap lookup after an index search.",
  s: "The table's tuples are stored inside the leaf pages of a B+ tree (or another ordered structure), sorted by primary key.",
  ex: "MySQL InnoDB tables are B+ trees on the primary key; SQLite tables are B-trees on rowid.", rel: ["bplustree", "clustered"] });
N({ id: "catalog", g: "C3", n: "Catalog & metadata", ab: "system catalog information_schema pg_catalog data dictionary", loc: ["DISK", "RAM"], ln: "Stored as tables on disk; hot parts cached in RAM", own: "DBMS",
  p: "Every layer needs to know what tables, columns, types, indexes, statistics and privileges exist.",
  s: "Metadata stored in internal tables (pg_class, pg_attribute, ...) and cached in memory hash maps for fast lookup.",
  rel: ["binder", "stats", "metahash"] });
N({ id: "seapi", g: "C3", n: "Storage engine API", ab: "table access method handler API pluggable storage engine", loc: ["CPU", "LOGIC"], own: "DBMS",
  p: "Separate query processing from how tuples are physically stored.",
  s: "A narrow interface: open table, scan next tuple, fetch by RID, insert/update/delete tuple, index lookup. Different engines can implement it.",
  impl: "MySQL's handler API allows pluggable engines (InnoDB, MyRocks); PostgreSQL has table access methods since v12.", rel: ["execeng"] });

/* Layer D: Indexes & Data Structures — hashing */
N({ id: "hashfn", g: "D1", n: "Hash functions", ab: "xxHash MurmurHash CityHash hash function", loc: ["CPU"], own: "Used by every hash structure",
  p: "Map a large key space to a small range of slots quickly and evenly.",
  s: "A deterministic function key → integer. Databases want speed and few collisions, not cryptographic security.",
  ex: "XXHash3, MurmurHash, CityHash. Not SHA-256: it is much slower and the security is not needed.",
  mis: "Using a slow cryptographic hash inside a hash join." });
N({ id: "hashtable", g: "D1", n: "Hash table", ab: "hash map associative array", loc: ["RAM"], ln: "Usually in RAM; persistent hash indexes keep buckets on disk pages", own: "Many: executor, catalog caches, buffer pool page table",
  p: "Find a value by exact key in about O(1).",
  s: "An array of slots; hash(key) picks a slot; a hashing scheme handles collisions.",
  cx: "Average O(1) insert/lookup/delete; worst O(n); O(n) space; no ordering.", pro: ["Fast point lookups."], con: ["No range queries or ordered scans."],
  rel: ["hashjoin", "aggop", "pagetable", "metahash"] });
N({ id: "chaining", g: "D1", n: "Separate chaining", ab: "chained hashing bucket chain linked list", loc: ["RAM", "DISK"], own: "Hash table scheme",
  p: "Handle collisions without searching other slots.",
  s: "Each slot points to a list (or chain of bucket pages) of entries that hashed there.",
  pro: ["Never 'full'; simple deletes."], con: ["Pointer chasing; long chains under skew."], cmp: "hashing" });
N({ id: "openaddr", g: "D1", n: "Open addressing", ab: "probing open addressing", loc: ["RAM"], own: "Hash table scheme",
  p: "Store entries directly in the slot array for cache-friendly access.",
  s: "On collision, look at other slots in a fixed probe sequence. Variants: linear (h+1, h+2...), quadratic (h+1², h+2²...), double hashing (h + i·h2(k)).",
  con: ["Must resize as load factor rises; deletes need tombstones."], cmp: "hashing" });
N({ id: "linprobe", g: "D1", n: "Linear probing", ab: "linear probe hashing", loc: ["RAM"], own: "Hash table scheme",
  p: "Simplest, usually fastest collision handling.",
  s: "Insert: start at hash(k) and step +1 until an empty slot. Lookup: step until the key or an empty slot. Store the key in the slot so you can compare.",
  cx: "Fast at low load; degrades with primary clustering as load rises.",
  art: `h(k)=3   [ 0 ][ 1 ][ 2 ][ A ][ B ][ k ][   ]
                         ↑taken ↑taken ↑ placed`, ex: "Google absl::flat_hash_map is a probing table; many DB join hash tables use linear probing.", cmp: "hashing" });
N({ id: "quadprobe", g: "D1", n: "Quadratic probing & double hashing", ab: "quadratic probing double hashing", loc: ["RAM"], own: "Hash table scheme",
  p: "Reduce the clustering that linear probing suffers.",
  s: "Quadratic: probe h, h+1, h+4, h+9 ... Double hashing: probe h1(k) + i·h2(k). Both scatter colliding keys more.",
  con: ["Worse cache locality than linear probing."] });
N({ id: "tombstone", g: "D1", n: "Tombstones", ab: "deleted marker", loc: ["RAM", "DISK"], own: "Hash tables, LSM trees",
  p: "Deleting from an open-addressing table can break probe chains.",
  s: "Mark the slot 'deleted' instead of empty: lookups keep scanning past it; inserts may reuse it. LSM trees use the same word for delete markers that later compaction removes.",
  rel: ["lsmtomb"] });
N({ id: "cuckoo", g: "D1", n: "Cuckoo hashing", ab: "cuckoo", loc: ["RAM"], own: "Hash table scheme",
  p: "Guarantee O(1) lookups.",
  s: "Each key has two (or more) possible slots from different hash functions. Insert into a free one, or evict the occupant and re-insert it in its other slot. A cycle means rebuild with new seeds or a bigger table.",
  cx: "Lookup/delete O(1) worst-case probes; insert amortized O(1) but can trigger rebuilds.", cmp: "hashing" });
N({ id: "statdyn", g: "D1", n: "Static vs dynamic hashing", ab: "static hashing dynamic hashing resize", loc: ["LOGIC"], own: "Design choice",
  p: "Tables grow; rebuilding a huge hash table from scratch is expensive.",
  s: "Static schemes have a fixed size and must rebuild (usually 2×) when full. Dynamic schemes (chained, extendible, linear hashing) grow incrementally." });
N({ id: "extendible", g: "D1", n: "Extendible hashing", ab: "global depth local depth directory", loc: ["RAM", "DISK"], own: "Dynamic hash scheme (disk or memory)",
  p: "Grow a hash table one bucket split at a time, without rehashing everything.",
  s: "A directory of 2^g slots (g = global depth) indexed by g bits of the hash; several slots may share a bucket with local depth d ≤ g. When a bucket overflows, split only it; double the directory only if d = g.",
  art: `global depth 2
dir: 00 ─▶ B1(d=1)
     01 ─▶ B1
     10 ─▶ B2(d=2)
     11 ─▶ B3(d=2)`, cmp: "hashing", ex: "CMU 15-445 Project 2 (some semesters) builds a disk-based extendible hash index." });
N({ id: "linhash", g: "D1", n: "Linear hashing", ab: "split pointer linear hashing", loc: ["RAM", "DISK"], own: "Dynamic hash scheme",
  p: "Grow smoothly with no directory doubling.",
  s: "Keep a split pointer. On any overflow, split the bucket at the pointer (not necessarily the one that overflowed) using h2 = key mod 2n, and advance the pointer. Can also shrink.",
  pro: ["Incremental growth, no big rebuilds."] });
N({ id: "hashindex", g: "D1", n: "Persistent hash index", ab: "hash index disk-based hash", loc: ["DISK", "RAM"], ln: "Bucket pages on disk, cached in the buffer pool", own: "DBMS access method",
  p: "Fast equality lookups on a column, surviving restarts.",
  s: "A hash table whose buckets are database pages, read through the buffer pool and logged in the WAL like any other page.",
  pro: ["O(1) equality lookups."], con: ["No range scans or ORDER BY help."], mis: "An in-memory join hash table vanishes after the query; a hash index is durable.", cmp: "indexes", ex: "PostgreSQL CREATE INDEX ... USING hash." });

/* Trees */
N({ id: "btree", g: "D2", n: "B-tree", ab: "B tree balanced tree", loc: ["DISK", "RAM"], own: "DBMS access method",
  p: "A balanced, high-fanout search tree for disk pages.",
  s: "Each node is a page with many sorted keys and child pointers; values can live in any node. All leaves are at the same depth.",
  alt: "B+ tree (values only in leaves, linked leaves) is what most DBMSs use and often call 'B-tree'.", mis: "When documentation says 'B-tree index' it usually means a B+ tree." });
N({ id: "bplustree", g: "D2", n: "B+ tree", ab: "B+tree index ordered index", loc: ["DISK", "RAM"], ln: "Nodes are pages on disk; hot nodes (root, inner levels) are cached in the buffer pool", own: "DBMS access method",
  p: "Support point lookups, range scans and ordered output on data far bigger than memory, with few I/Os.",
  s: "A balanced tree where inner nodes hold only separator keys and child page IDs, and leaves hold keys with values (RIDs or tuples), linked left-to-right for range scans.",
  h: ["Lookup: from root, binary-search keys in each node, follow the child pointer to a leaf.", "Range scan: find the first leaf, then follow sibling links.", "Insert: put into leaf; if full, split and push a separator up.", "Delete: remove; if under half full, borrow or merge."],
  cx: "Height ≈ log_F(N): with fanout F ≈ 500, 4 levels index ~62 billion keys. Search/insert/delete O(log N).",
  art: `           [ 20 | 50 ]
         ╱      │      ╲
   [5|12] → [20|31|44] → [50|77]   ← linked leaves`,
  pro: ["Ranges and ordering; stable performance."], con: ["Random writes; page splits; write amplification for small updates."],
  f: ["Concurrent splits need latch crabbing; a crash mid-split needs WAL to stay consistent."], cmp: "indexes", ex: "Default index type in PostgreSQL, MySQL, SQLite, Oracle." });
N({ id: "bpnodes", g: "D2", n: "Inner & leaf nodes, fanout, height", ab: "fanout tree height internal node leaf node", loc: ["DISK", "RAM"], own: "B+ tree",
  p: "Understand why B+ trees are shallow.",
  s: "Fanout = children per inner node, set by page size / (key + pointer size). High fanout gives a short tree, so few page reads per lookup.",
  ex: "8 KB page, 16-byte entries → fanout ≈ 500. Root + 1 inner level usually stay in the buffer pool, so a lookup costs ~1–2 disk reads." });
N({ id: "splitmerge", g: "D2", n: "Page splits & merges", ab: "node split merge redistribute", loc: ["DISK", "RAM"], own: "B+ tree",
  p: "Keep the tree balanced as keys are inserted and deleted.",
  s: "Insert into a full leaf: split it into two half-full pages and insert the middle key into the parent (which may split too, up to the root). Delete below half: borrow from a sibling or merge.",
  f: ["A split changes several pages; it must be WAL-logged so recovery never sees half a split."], rel: ["wal", "latchcrab"] });
N({ id: "bpops", g: "D2", n: "Point lookups & range scans", ab: "point query range query", loc: ["DISK", "RAM"], own: "B+ tree",
  p: "Different queries use the tree differently.",
  s: "Point lookup: root-to-leaf for one key. Range scan: root-to-leaf for the start key, then sibling pointers until the end key. Hash indexes can only do the first." });
N({ id: "clustered", g: "D2", n: "Clustered vs unclustered index", ab: "clustered index primary index secondary index", loc: ["DISK"], own: "DBMS",
  p: "Whether the table's physical order follows the index order decides how expensive index scans are.",
  s: "Clustered: tuples stored in index-key order (or inside the index). Range scans read consecutive pages. Unclustered (secondary): index order differs from heap order, so each match may be a random page read.",
  ex: "InnoDB: primary key is clustered; secondary indexes store the primary key, which is then looked up in the clustered tree." });
N({ id: "composite", g: "D2", n: "Composite indexes", ab: "multi-column index leftmost prefix covering index", loc: ["DISK", "RAM"], own: "DBMS",
  p: "Queries filter or sort on several columns.",
  s: "An index on (a, b, c) is sorted by a, then b, then c. It helps predicates on a, (a,b), (a,b,c) — the leftmost prefix — but not on b alone. A covering index contains all needed columns, so no heap fetch is needed." });
N({ id: "selectivity", g: "D2", n: "Index selectivity", ab: "selectivity cardinality", loc: ["LOGIC"], own: "Optimizer",
  p: "An index only helps if the predicate matches a small fraction of rows.",
  s: "Selectivity = matching rows / total rows. Low selectivity (few matches) → index scan wins. High (most rows) → sequential scan wins because random I/O per row is expensive.", rel: ["stats", "optimizer"] });
N({ id: "latchcrab", g: "D2", n: "Latch crabbing (B+ tree concurrency)", ab: "lock coupling crabbing optimistic latch", loc: ["RAM"], own: "B+ tree implementation",
  p: "Many threads read and modify the same tree; a split must not be seen half-done.",
  s: "Latch the parent, latch the child, release the parent once the child is 'safe' (will not split or merge). Optimistic variant: take read latches down the tree and a write latch only on the leaf; restart with write latches if a split is needed.",
  mis: "These are latches (short, in-memory), not transaction locks.", rel: ["latch", "lockvslatch"] });

/* Other structures */
N({ id: "bloom", g: "D3", n: "Bloom filter", ab: "Bloom filter probabilistic set membership", loc: ["RAM", "DISK"], ln: "Built in RAM; stored with SSTables on disk and loaded into RAM", own: "LSM engines, hash joins, distributed joins",
  p: "Avoid an expensive lookup when the key is definitely absent.",
  s: "A bit array plus k hash functions. Insert sets k bits. Query checks k bits: any 0 → definitely not present; all 1 → maybe present.",
  cx: "O(k) per operation; about 10 bits per key gives ~1% false positives.",
  pro: ["Tiny, fast, no false negatives."], con: ["False positives; standard version cannot delete."],
  art: `insert x: set bits h1(x),h2(x),h3(x)
[0 1 0 0 1 0 1 0]
query y: any bit 0 → NOT present`, mis: "A Bloom filter never says WHERE a key is, only whether it might exist.", rel: ["lsmbloom", "hashjoin"] });
N({ id: "trie", g: "D3", n: "Tries & radix trees", ab: "trie radix tree prefix tree ART", loc: ["RAM"], own: "In-memory indexes",
  p: "Index keys digit by digit; good for prefixes and in-memory speed.",
  s: "Each level consumes part of the key. Radix trees compress single-child paths. The Adaptive Radix Tree (ART) is used as an in-memory index.",
  ex: "HyPer and DuckDB use ART for in-memory indexes." });
N({ id: "skiplist", g: "D3", n: "Skip list", ab: "skiplist", loc: ["RAM"], own: "MemTables, in-memory indexes",
  p: "An ordered in-memory structure that is easy to make concurrent.",
  s: "Several levels of sorted linked lists; higher levels skip over more nodes. Search drops a level when the next key is too big.",
  cx: "Expected O(log n) search/insert.", ex: "RocksDB/LevelDB MemTable default.", rel: ["memtable"] });
N({ id: "pq", g: "D3", n: "Heaps & priority queues", ab: "binary heap min-heap priority queue", loc: ["RAM"], own: "Executor, schedulers",
  p: "Repeatedly take the smallest (or largest) element.",
  s: "A binary heap gives O(log n) insert and pop-min. Used for k-way merges of sorted runs, top-K queries (ORDER BY ... LIMIT k), timers and schedulers.",
  mis: "A binary heap (data structure) is unrelated to a heap file (unordered table pages) and to the heap memory region." });
N({ id: "sortedrun", g: "D3", n: "Sorted arrays & sorted runs", ab: "run sorted file", loc: ["RAM", "DISK"], own: "External sort, LSM",
  p: "Sorted data allows binary search and cheap merging.",
  s: "External sort writes sorted runs to disk and merges them; LSM SSTables are immutable sorted runs merged by compaction.", rel: ["sortop", "sstable"] });
N({ id: "lrulist", g: "D3", n: "LRU list", ab: "doubly linked list hash map LRU", loc: ["RAM"], own: "Buffer pool replacer (or OS)",
  p: "Track recency to evict the least recently used item in O(1).",
  s: "A hash map from key → node in a doubly linked list. On access, move the node to the head; evict from the tail.", cx: "O(1) access and evict.", rel: ["lru"] });
N({ id: "lrukhist", g: "D3", n: "LRU-K history", ab: "access history timestamps", loc: ["RAM"], own: "Buffer pool replacer",
  p: "Record enough access history to estimate how often a page is used.",
  s: "Per frame, keep the timestamps of the last K accesses. The backward K-distance is now − K-th most recent access (∞ if fewer than K).", rel: ["lruk"] });
N({ id: "clockbits", g: "D3", n: "CLOCK reference bits", ab: "reference bit clock hand", loc: ["RAM"], own: "Buffer pool replacer or OS",
  p: "Approximate LRU with one bit per frame.",
  s: "A circular array of reference bits and a 'hand'. Access sets the bit to 1. The hand sweeps: 1 → set to 0 and move on; 0 → evict.", rel: ["clock", "osrepl"] });
N({ id: "metahash", g: "D3", n: "Hash maps for metadata", ab: "in-memory map lookup table", loc: ["RAM"], own: "DBMS components",
  p: "Internal components need fast lookups by ID.",
  s: "In-memory hash maps: the buffer pool page table (page ID → frame), the lock table (resource → lock queue), catalog caches, the transaction table.", rel: ["pagetable", "lockmgr", "catalog"] });
