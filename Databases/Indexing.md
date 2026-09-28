# Database Indexing — B-tree, B+ tree and Bitmap Indexes

> **What you'll learn:** what an index is and why it makes queries thousands of times faster, how **B-trees** and **B+ trees** (the structures behind almost every database index) work, and when **bitmap indexes** are the better choice — with C++ implementations of all three.
>
> **Prerequisites:** [SELECT and WHERE](./SQL-DML.md#1-select-statement). Knowing binary search helps but isn't required.

## Table of Contents
0. [What is an index?](#0-what-is-an-index)
1. [B-tree](#1-b-tree)
2. [B+ tree](#2-b-tree)
3. [Bitmap indexing](#3-bitmap-indexing)
4. [Practical indexing tips](#4-practical-indexing-tips)
5. [Cheat sheet](#cheat-sheet)

---

## 0. What is an index?

**In one sentence:** an index is an extra, sorted data structure that lets the database **jump straight to matching rows** instead of reading the whole table.

### In plain words
To find "photosynthesis" in a 900-page biology book you don't read every page — you open the **index at the back**, find the word (alphabetical, so that's quick), and it tells you "page 412". A database index is exactly that: a sorted list of values with pointers to where the rows live.

### How it works
- **Without an index** → **full table scan**: check every row. 10 million rows = 10 million checks.
- **With an index** on the `WHERE` column → a few lookups (≈ log of the row count) to find the matching entries, then fetch those rows.
- The cost: indexes take **disk space**, and every `INSERT/UPDATE/DELETE` must also update every index on the table → **slower writes**.

```sql
CREATE INDEX idx_users_email ON users(email);
EXPLAIN SELECT * FROM users WHERE email = 'ana@example.com';
-- without the index:  Seq Scan on users  (reads everything)
-- with the index:     Index Scan using idx_users_email on users
```
Key vocabulary:
- **Clustered index:** the table itself is stored in index order (one per table; InnoDB's primary key, SQL Server clustered index).
- **Non-clustered / secondary index:** separate structure pointing to rows.
- **Composite index:** on several columns `(last_name, first_name)` — usable for queries on the **leftmost prefix**.
- **Covering index:** contains all columns a query needs, so the table itself isn't touched ("index-only scan").
- **Selectivity:** how well a value narrows results. `email` is highly selective; `is_active` (true/false) isn't — B-tree indexes on low-selectivity columns rarely help (but bitmap indexes can, see section 3).

### Modern C++ example — full scan vs. index lookup
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct User { int id; std::string email; };

int main() {
    std::vector<User> table;                                    // the "heap" of rows
    for (int i = 0; i < 1'000'000; ++i) table.push_back({i, "user" + std::to_string(i) + "@example.com"});

    const std::string target = "user987654@example.com";

    // Full table scan: compare row by row
    long comparisons = 0;
    for (const auto& u : table) { ++comparisons; if (u.email == target) break; }
    std::cout << "full scan:    " << comparisons << " comparisons\n";

    // Index: a sorted structure from email -> row position (std::map is a balanced tree)
    std::map<std::string, std::size_t> idx_users_email;
    for (std::size_t pos = 0; pos < table.size(); ++pos) idx_users_email[table[pos].email] = pos;

    long steps = 0;
    auto less = [&](const std::string& a, const std::string& b) { ++steps; return a < b; };
    std::map<std::string, std::size_t, decltype(less)> counted(less);
    counted.insert(idx_users_email.begin(), idx_users_email.end());
    steps = 0;
    auto it = counted.find(target);
    std::cout << "index lookup: " << steps << " comparisons -> row id " << table[it->second].id << '\n';
}
```

**Output (may vary):**
```text
full scan:    987655 comparisons
index lookup: 25 comparisons -> row id 987654
```

### Interview answer
"An index is an auxiliary sorted structure mapping key values to row locations so lookups take logarithmic time instead of a full scan. It speeds reads, joins, sorting and uniqueness checks at the cost of storage and slower writes. Effective indexes target selective columns and common predicates, respecting the leftmost-prefix rule for composite indexes."

---

## 1. B-tree

**In one sentence:** a B-tree is a **self-balancing search tree** where every node holds **many sorted keys** and has many children, keeping the tree very **short** so a lookup touches only a handful of disk pages.

### In plain words
A binary search tree asks one yes/no question per level ("bigger or smaller than 50?"), so a million items need ~20 levels — 20 slow disk reads. A B-tree node is like a **page in a phone book's index with hundreds of tabs**: "A–Ab, Ac–Ad, …". One look at a page narrows the search by a factor of hundreds. A million items fit in **3 levels**; a billion in about 4–5.

### How it works
With **minimum degree t** (each node except the root has between t−1 and 2t−1 keys):
- Keys inside a node are **sorted**; a node with k keys has k+1 children; child *i* holds keys between key *i−1* and key *i*.
- **All leaves are at the same depth** → the tree is always balanced, lookups are O(log n).
- **Search:** in each node, find the first key ≥ target (binary search); either found, or descend into the right child.
- **Insert:** always into a leaf. If a node is **full** (2t−1 keys), **split** it: the middle key moves **up** to the parent, and the node becomes two half-full nodes. The tree grows in height only when the **root** splits — upward growth keeps it balanced.
- **Delete:** remove the key, then **borrow** from a sibling or **merge** nodes if one gets too empty.
- In databases, one node = one **disk page** (e.g. 8 KB), so t is in the hundreds. **Fan-out** of ~500 → 500³ = 125 million keys in 3 levels.

Classic B-trees store **keys and data (or row pointers) in every node**, including internal ones. Most databases actually use the B+ tree variant (next section).

### Modern C++ example — a B-tree with splitting (t = 2, a "2-3-4 tree")
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <memory>
#include <queue>
#include <vector>

template <int T>   // minimum degree: nodes hold T-1 .. 2T-1 keys
class BTree {
    struct Node {
        bool leaf = true;
        std::vector<int> keys;
        std::vector<std::unique_ptr<Node>> kids;
    };
    std::unique_ptr<Node> root_ = std::make_unique<Node>();

    static bool full(const Node& n) { return n.keys.size() == 2 * T - 1; }

    // Split parent->kids[i] (which is full); its middle key moves up into parent.
    static void split_child(Node& parent, std::size_t i) {
        Node& y = *parent.kids[i];
        auto z = std::make_unique<Node>();
        z->leaf = y.leaf;
        int middle = y.keys[T - 1];
        z->keys.assign(y.keys.begin() + T, y.keys.end());            // right half
        if (!y.leaf)
            for (std::size_t k = T; k < y.kids.size(); ++k) z->kids.push_back(std::move(y.kids[k]));
        y.keys.resize(T - 1);                                          // left half stays
        if (!y.leaf) y.kids.resize(T);
        parent.keys.insert(parent.keys.begin() + i, middle);
        parent.kids.insert(parent.kids.begin() + i + 1, std::move(z));
    }

    static void insert_nonfull(Node& n, int key) {
        auto pos = std::upper_bound(n.keys.begin(), n.keys.end(), key) - n.keys.begin();
        if (n.leaf) { n.keys.insert(n.keys.begin() + pos, key); return; }
        if (full(*n.kids[pos])) {                                      // split on the way down
            split_child(n, pos);
            if (key > n.keys[pos]) ++pos;
        }
        insert_nonfull(*n.kids[pos], key);
    }

public:
    void insert(int key) {
        if (full(*root_)) {                                           // the ONLY way height grows
            auto new_root = std::make_unique<Node>();
            new_root->leaf = false;
            new_root->kids.push_back(std::move(root_));
            split_child(*new_root, 0);
            root_ = std::move(new_root);
        }
        insert_nonfull(*root_, key);
    }

    int search_visits(int key) const {                                // how many nodes (pages) we read
        const Node* n = root_.get();
        for (int visits = 1;; ++visits) {
            auto pos = std::lower_bound(n->keys.begin(), n->keys.end(), key) - n->keys.begin();
            if (pos < static_cast<long>(n->keys.size()) && n->keys[pos] == key) return visits;
            if (n->leaf) return -visits;                              // not found
            n = n->kids[pos].get();
        }
    }

    void print() const {                                               // level by level
        std::queue<std::pair<const Node*, int>> q;
        q.push({root_.get(), 0});
        int level = -1;
        while (!q.empty()) {
            auto [n, d] = q.front(); q.pop();
            if (d != level) { std::cout << (level >= 0 ? "\n" : "") << "level " << d << ":"; level = d; }
            std::cout << " [";
            for (std::size_t i = 0; i < n->keys.size(); ++i) std::cout << (i ? " " : "") << n->keys[i];
            std::cout << "]";
            for (const auto& k : n->kids) q.push({k.get(), d + 1});
        }
        std::cout << '\n';
    }
};

int main() {
    BTree<2> tree;
    for (int k = 1; k <= 12; ++k) tree.insert(k * 10);
    tree.print();
    std::cout << "search 90 visited " << tree.search_visits(90) << " node(s)\n";
    std::cout << "search 95 visited " << -tree.search_visits(95) << " node(s), not found\n";
}
```

**Output:**
```text
level 0: [40]
level 1: [20] [60 80 100]
level 2: [10] [30] [50] [70] [90] [110 120]
search 90 visited 3 node(s)
search 95 visited 3 node(s), not found
```
Twelve keys, yet any search reads at most 3 nodes. With a real page size (hundreds of keys per node) the same 3 levels hold millions of keys.

### Interview answer
"A B-tree is a balanced multiway search tree where each node holds between t−1 and 2t−1 sorted keys and all leaves are at the same depth. High fan-out keeps height tiny — typically 3 to 4 levels for billions of keys — so lookups cost few disk page reads. Inserts split full nodes, pushing the median up, and the tree grows only at the root; deletes borrow or merge. Search, insert and delete are O(log n)."

---

## 2. B+ tree

**In one sentence:** a B+ tree is a B-tree variant where **all the data lives in the leaves**, internal nodes hold only keys for navigation, and the leaves are **linked together** in order — making range scans extremely efficient. It's what PostgreSQL, MySQL InnoDB, SQL Server, Oracle and SQLite use for indexes.

### In plain words
Think of a library:
- The **signposts** at the end of each aisle ("A–F", "G–M") are the internal nodes — they only point the way, they contain no books.
- The **shelves** are the leaves — every book is on a shelf, in order, and each shelf leads directly to the next one.
To find all books from "Harry" to "Hobbit", you follow the signposts once to the first shelf, then **walk along the shelves** — no need to go back to the signposts.

### How it works
| | B-tree | B+ tree |
|---|---|---|
| Data / row pointers | In every node | **Only in leaves** |
| Internal nodes | Keys + data | Keys only → **more keys per page → shorter tree** |
| Leaves | Not linked | **Linked list** (often doubly linked) |
| Search always ends at | Any level | A leaf (predictable cost) |
| Range query (`BETWEEN`, `ORDER BY`, `>`) | Needs tree traversal back and forth | Find the start leaf, then scan sideways |
| Duplicate keys | In internal nodes too | Internal keys are just copies/separators |

Why databases love it:
1. Internal nodes are small → higher fan-out → fewer levels → fewer I/Os.
2. `WHERE price BETWEEN 10 AND 20`, `ORDER BY`, `>`/`<` and prefix `LIKE 'abc%'` are sequential leaf scans.
3. Full index scans read leaves in order without touching internal nodes.

In InnoDB, the **clustered** B+ tree's leaves contain the full rows (ordered by primary key); secondary index leaves contain the primary key, which is then looked up in the clustered tree.

### Modern C++ example — a B+ tree built from sorted keys, with a range scan over linked leaves
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

constexpr std::size_t kFanout = 3;   // tiny on purpose; real pages hold hundreds

struct Leaf {
    std::vector<int> keys;
    std::vector<std::string> rows;     // the DATA lives only in leaves
    Leaf* next = nullptr;              // linked list of leaves
};
struct Inner {
    std::vector<int> keys;             // separators only (smallest key of each child except first)
    std::vector<void*> kids;
    bool kids_are_leaves = false;
};

class BPlusTree {
public:
    // Bulk-load from sorted (key,row) pairs: build leaves, link them, then build levels upward.
    explicit BPlusTree(const std::vector<std::pair<int, std::string>>& sorted) {
        for (std::size_t i = 0; i < sorted.size(); i += kFanout) {
            auto leaf = std::make_unique<Leaf>();
            for (std::size_t j = i; j < std::min(i + kFanout, sorted.size()); ++j) {
                leaf->keys.push_back(sorted[j].first);
                leaf->rows.push_back(sorted[j].second);
            }
            if (!leaves_.empty()) leaves_.back()->next = leaf.get();
            leaves_.push_back(std::move(leaf));
        }
        std::vector<std::pair<int, void*>> level;                     // (min key, node)
        for (auto& l : leaves_) level.push_back({l->keys.front(), l.get()});
        bool leaves_below = true;
        while (level.size() > 1) {
            std::vector<std::pair<int, void*>> up;
            for (std::size_t i = 0; i < level.size(); i += kFanout) {
                auto node = std::make_unique<Inner>();
                node->kids_are_leaves = leaves_below;
                for (std::size_t j = i; j < std::min(i + kFanout, level.size()); ++j) {
                    if (j > i) node->keys.push_back(level[j].first);
                    node->kids.push_back(level[j].second);
                }
                up.push_back({level[i].first, node.get()});
                inners_.push_back(std::move(node));
            }
            level = std::move(up);
            leaves_below = false;
            ++height_;
        }
        root_ = level.front().second;
    }

    // SELECT * WHERE key BETWEEN lo AND hi
    void range(int lo, int hi) const {
        void* node = root_;
        int inner_visits = 0;
        for (int h = 0; h < height_; ++h) {                            // descend ONCE
            auto* in = static_cast<Inner*>(node);
            ++inner_visits;
            auto pos = std::upper_bound(in->keys.begin(), in->keys.end(), lo) - in->keys.begin();
            node = in->kids[pos];
        }
        int leaf_visits = 0;
        for (auto* leaf = static_cast<Leaf*>(node); leaf; leaf = leaf->next) {   // then walk sideways
            ++leaf_visits;
            for (std::size_t i = 0; i < leaf->keys.size(); ++i) {
                if (leaf->keys[i] > hi) {
                    std::cout << "\n(" << inner_visits << " inner node reads, " << leaf_visits << " leaf reads)\n";
                    return;
                }
                if (leaf->keys[i] >= lo) std::cout << leaf->keys[i] << ':' << leaf->rows[i] << ' ';
            }
        }
        std::cout << "\n(" << inner_visits << " inner node reads, " << leaf_visits << " leaf reads)\n";
    }
    int height() const { return height_; }
    std::size_t leaf_count() const { return leaves_.size(); }

private:
    std::vector<std::unique_ptr<Leaf>> leaves_;
    std::vector<std::unique_ptr<Inner>> inners_;
    void* root_ = nullptr;
    int height_ = 0;
};

int main() {
    std::vector<std::pair<int, std::string>> rows;
    for (int price = 5; price <= 100; price += 5) rows.push_back({price, "item" + std::to_string(price)});

    BPlusTree index(rows);
    std::cout << "leaves: " << index.leaf_count() << ", inner levels: " << index.height() << '\n';
    std::cout << "WHERE price BETWEEN 30 AND 55:\n";
    index.range(30, 55);
}
```

**Output:**
```text
leaves: 7, inner levels: 2
WHERE price BETWEEN 30 AND 55:
30:item30 35:item35 40:item40 45:item45 50:item50 55:item55
(2 inner node reads, 3 leaf reads)
```
One descent to the first matching leaf, then a sideways walk — that's why range queries on B+ tree indexes are fast.

### Interview answer
"A B+ tree stores all records or row pointers in the leaves and only separator keys in internal nodes, and links the leaves in key order. Smaller internal nodes mean higher fan-out and a shallower tree, every lookup ends at a leaf, and range scans or ORDER BY become a single descent followed by a sequential leaf walk. That's why nearly all relational database indexes are B+ trees."

---

## 3. Bitmap indexing

**In one sentence:** a bitmap index keeps, **for each distinct value** of a column, a string of bits — one bit per row, 1 if the row has that value — so filters become super-fast bitwise AND/OR operations.

### In plain words
A school attendance sheet with a column of checkboxes per category: one row of boxes for "grade 9", one for "grade 10", one for "has a bus pass". To find "grade 10 students **with** a bus pass", you lay the two checkbox rows on top of each other and keep the positions ticked in both. Computers can compare 64 checkboxes in one instruction.

### How it works
Column `color` with rows: red, blue, red, green, blue, red
```
color = red   : 1 0 1 0 0 1
color = blue  : 0 1 0 0 1 0
color = green : 0 0 0 1 0 0
```
- `WHERE color = 'red' AND size = 'L'` → `bitmap(red) AND bitmap(L)`.
- `WHERE color IN ('red','blue')` → `bitmap(red) OR bitmap(blue)`.
- `COUNT(*)` → count the 1-bits (popcount).
- Bitmaps **compress** extremely well (run-length encoding, **Roaring bitmaps**).

When to use:
| Good fit | Bad fit |
|---|---|
| **Low cardinality** columns (gender, status, country, boolean flags) | High cardinality (email, IDs) → one huge bitmap per value |
| Read-mostly **data warehouses / analytics** | **OLTP** with frequent concurrent updates — changing one row may lock a whole bitmap segment |
| Queries combining many filters with AND/OR | Single-row lookups |

Support: Oracle has `CREATE BITMAP INDEX`; PostgreSQL has no persistent bitmap index but builds **bitmap heap scans** on the fly to combine B-tree indexes; analytics engines (Druid, Pinot, ClickHouse skip indexes, Elasticsearch/Lucene) use bitmaps heavily.

### Modern C++ example — building and querying a bitmap index
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <bitset>
#include <iostream>
#include <map>
#include <string>
#include <vector>

constexpr std::size_t kRows = 8;
using Bitmap = std::bitset<kRows>;

struct Product { std::string color, size; bool in_stock; };

std::map<std::string, Bitmap> build_index(const std::vector<Product>& rows, auto column) {
    std::map<std::string, Bitmap> index;
    for (std::size_t r = 0; r < rows.size(); ++r) index[column(rows[r])].set(r);   // one bit per row
    return index;
}

void print_rows(const std::string& label, const Bitmap& b) {
    std::cout << label << " -> bits ";
    for (std::size_t r = 0; r < kRows; ++r) std::cout << b[r];
    std::cout << " -> rows:";
    for (std::size_t r = 0; r < kRows; ++r) if (b[r]) std::cout << ' ' << r;
    std::cout << " (count " << b.count() << ")\n";
}

int main() {
    const std::vector<Product> products{
        {"red", "L", true}, {"blue", "M", true}, {"red", "M", false}, {"green", "L", true},
        {"blue", "L", false}, {"red", "L", true}, {"green", "S", true}, {"red", "S", true}};

    auto color = build_index(products, [](const Product& p) { return p.color; });
    auto size  = build_index(products, [](const Product& p) { return p.size; });
    auto stock = build_index(products, [](const Product& p) { return std::string(p.in_stock ? "yes" : "no"); });

    print_rows("color = red                  ", color["red"]);
    print_rows("red AND size = L AND in stock", color["red"] & size["L"] & stock["yes"]);
    print_rows("color IN (blue, green)       ", color["blue"] | color["green"]);
    print_rows("NOT in stock                 ", ~stock["yes"]);
}
```

**Output:**
```text
color = red                   -> bits 10100101 -> rows: 0 2 5 7 (count 4)
red AND size = L AND in stock -> bits 10000100 -> rows: 0 5 (count 2)
color IN (blue, green)        -> bits 01011010 -> rows: 1 3 4 6 (count 4)
NOT in stock                  -> bits 00101000 -> rows: 2 4 (count 2)
```

### Interview answer
"A bitmap index stores one bit vector per distinct value, with a bit per row. Combining predicates becomes fast bitwise AND/OR/NOT and counts become popcounts, and the bitmaps compress well. It's ideal for low-cardinality columns in read-heavy analytics, but poor for high-cardinality columns and concurrent OLTP updates, where B+ tree indexes are used instead."

---

## 4. Practical indexing tips

1. **Index what you filter, join and sort on**: `WHERE`, `JOIN ... ON`, `ORDER BY` columns, and every foreign key.
2. **Composite index column order:** equality columns first, then range/sort columns. An index on `(country, city)` helps `WHERE country = ?` and `WHERE country = ? AND city = ?`, but **not** `WHERE city = ?` alone (leftmost prefix rule).
3. **Don't wrap indexed columns in functions:** `WHERE LOWER(email) = ?` can't use an index on `email` — create an **expression index** on `LOWER(email)` instead. Same for `WHERE created_at::date = ...` and leading wildcards `LIKE '%abc'`.
4. **Covering indexes** (`INCLUDE (col)` in PostgreSQL/SQL Server) enable index-only scans.
5. **Every index slows writes and uses space** — drop unused ones (check `pg_stat_user_indexes`).
6. **Always verify with `EXPLAIN` / `EXPLAIN ANALYZE`.**
7. Other index types to know by name: **hash** (equality only), **GIN** (full-text, JSONB, arrays), **GiST/SP-GiST** (geospatial, ranges), **BRIN** (huge naturally ordered tables like logs by time), **LSM trees** (write-heavy stores like RocksDB/Cassandra).

---

## Cheat sheet

| Index | Structure | Best for | Weakness |
|---|---|---|---|
| B-tree | Balanced multiway tree, data in all nodes | General lookups, O(log n) | Range scans bounce between levels |
| B+ tree | Data only in linked leaves | Equality **and** ranges, ORDER BY — the default everywhere | Slightly more storage for separators |
| Bitmap | Bit vector per distinct value | Low-cardinality filters in analytics, AND/OR combos | High cardinality, concurrent updates |
| Hash | Hash table | Pure equality | No ranges or sorting |

Trade-off to always mention: **faster reads vs. slower writes + more storage**.
