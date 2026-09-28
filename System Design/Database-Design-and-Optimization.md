# Database Design and Optimization — Partitioning, Materialized Views, NoSQL Types and Normal Forms

> **What you'll learn:** how database design choices affect performance and scale in system design: **partitioning** (inside one database and across many), **materialized views**, choosing among **NoSQL database types (document, key-value, column-family, graph)**, and applying the **normal forms (1NF, 2NF, 3NF, BCNF)** — plus when to deliberately denormalize. Each topic has a C++ model; deeper dives are linked.
>
> **Prerequisites:** basic SQL. This page is shared by **System Design → Database design and optimization** and **Databases → Database design and optimization**.

## Table of Contents
1. [Partitioning](#1-partitioning)
2. [Materialized views](#2-materialized-views)
3. [NoSQL databases (document, key-value, column-family, graph)](#3-nosql-databases-document-key-value-column-family-graph)
4. [Database normalization forms (1NF, 2NF, 3NF, BCNF)](#4-database-normalization-forms-1nf-2nf-3nf-bcnf)
5. [A design & optimization checklist](#5-a-design--optimization-checklist)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Partitioning

**In one sentence:** partitioning splits one large table into smaller pieces (**partitions**) by a key — so queries touch only the relevant piece and maintenance becomes cheaper — either inside one database server or across many servers (**sharding**).

### In plain words
A company's archive room with 20 years of invoices in **one** giant pile: finding last month's invoices means digging through everything. Put each **year in its own box**: "last month" means opening one box, and throwing away 2004 means discarding a box, not picking pages out of the pile.

### How it works
**Two directions:**
- **Horizontal partitioning** — split **rows** (by date, region, customer). This is what "partitioning" usually means; across servers it's **sharding** ([Scalability](./Scalability.md#1-replication-vs-partitioning)).
- **Vertical partitioning** — split **columns**: keep hot, small columns in one table and big, rarely used ones (a `bio TEXT`, images) in another.

**Partitioning methods:**
| Method | Example | Good for |
|---|---|---|
| **Range** | `orders_2024_01`, `orders_2024_02` by `created_at` | Time series, archiving, "last N days" queries |
| **List** | `region IN ('EU')`, `('US')` | Known categories, data residency |
| **Hash** | `hash(customer_id) % 8` | Even spread when there's no natural range |
| **Composite** | Range by month, then hash by customer | Big multi-tenant time-series |

```sql
-- PostgreSQL declarative partitioning
CREATE TABLE orders (id BIGINT, created_at DATE NOT NULL, total NUMERIC)
PARTITION BY RANGE (created_at);
CREATE TABLE orders_2024_05 PARTITION OF orders FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE orders_2024_06 PARTITION OF orders FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

SELECT SUM(total) FROM orders WHERE created_at >= '2024-06-01';   -- scans ONLY orders_2024_06
DROP TABLE orders_2024_05;                                          -- instant archival (vs. a huge DELETE)
```
Benefits: **partition pruning** (the planner skips irrelevant partitions), smaller indexes per partition, fast bulk deletes/archival by dropping partitions, parallelism.
Costs: queries that don't filter on the partition key must scan all partitions; unique constraints across partitions must include the key; too many tiny partitions add planning overhead; a bad key causes **hot partitions**.

### Modern C++ example — range partitioning with partition pruning
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Order { int id; std::string month; double total; };   // month = "2024-05"

class PartitionedOrders {
public:
    void insert(const Order& o) { partitions_[o.month].push_back(o); }     // route by partition key

    double sum_for_month(const std::string& month, int& rows_scanned) const {
        rows_scanned = 0;
        double sum = 0;
        auto it = partitions_.find(month);                                  // PRUNING: open one box
        if (it == partitions_.end()) return 0;
        for (const auto& o : it->second) { ++rows_scanned; sum += o.total; }
        return sum;
    }
    void drop_partition(const std::string& month) { partitions_.erase(month); }  // instant archival
    std::size_t partitions() const { return partitions_.size(); }
private:
    std::map<std::string, std::vector<Order>> partitions_;
};

int main() {
    PartitionedOrders orders;
    const char* months[] = {"2024-03", "2024-04", "2024-05", "2024-06"};
    for (int i = 0; i < 40'000; ++i) orders.insert({i, months[i % 4], 10.0});

    int scanned = 0;
    double june = orders.sum_for_month("2024-06", scanned);
    std::cout << "June revenue: " << june << " (scanned " << scanned << " of 40000 rows)\n";
    orders.drop_partition("2024-03");
    std::cout << "after archiving March: " << orders.partitions() << " partitions left\n";
}
```

**Output:**
```text
June revenue: 100000 (scanned 10000 of 40000 rows)
after archiving March: 3 partitions left
```

### Interview answer
"Partitioning divides a large table by a key — range, list, hash or composite — horizontally by rows or vertically by columns. Within one database it enables partition pruning, smaller indexes and cheap archival by dropping partitions; across servers it becomes sharding for write and storage scale. The partition key must match the dominant queries, or every query scans every partition and hot partitions appear."

---

## 2. Materialized views

**In one sentence:** a materialized view **stores the result of an expensive query** as a real table, so reads are instant — at the cost of the data being as old as the last refresh.

### In plain words
Instead of re-counting every sale in the company whenever the CEO opens the dashboard, an assistant prepares a **summary sheet** every hour. Opening the sheet is instant; it's just up to an hour old.

### How it works
```sql
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT date_trunc('day', created_at) AS day, SUM(total) AS revenue, COUNT(*) AS orders
FROM orders GROUP BY 1;

CREATE UNIQUE INDEX ON daily_revenue(day);
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;   -- e.g. every 15 minutes from a scheduler
```
Refresh strategies:
| Strategy | How | Freshness | Cost |
|---|---|---|---|
| Full refresh on a schedule | Recompute everything periodically | Minutes–hours stale | Heavy but simple |
| Incremental / fast refresh | Apply only changes (Oracle fast refresh, triggers, change-data-capture) | Near real time | Complex |
| On demand | Refresh after a batch job | As needed | Controlled |

System-design uses: dashboards and reports, leaderboards, precomputed **feeds**, search/listing pages that join many tables, **CQRS read models** (a separate, denormalized read database updated from events). Also see [Views vs. materialized views](../Databases/Stored-Procedures-Triggers-Views.md#3-views).

### Modern C++ example — incremental maintenance vs. recomputing
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Order { std::string day; double total; };

class DailyRevenueView {                          // materialized: stores results
public:
    // Full refresh: rescans all orders
    void full_refresh(const std::vector<Order>& orders, long& work) {
        rows_.clear();
        for (const auto& o : orders) { rows_[o.day] += o.total; ++work; }
    }
    // Incremental: apply just the new order (like a trigger or CDC consumer)
    void on_new_order(const Order& o, long& work) { rows_[o.day] += o.total; ++work; }
    double revenue(const std::string& day) const { return rows_.at(day); }
private:
    std::map<std::string, double> rows_;
};

int main() {
    std::vector<Order> orders;
    for (int i = 0; i < 100'000; ++i) orders.push_back({i % 2 ? "2024-06-01" : "2024-06-02", 10});

    DailyRevenueView full, incremental;
    long full_work = 0, incr_work = 0;
    full.full_refresh(orders, full_work);
    incremental.full_refresh(orders, incr_work);                  // initial build for both
    incr_work = full_work = 0;

    Order new_order{"2024-06-02", 25};
    orders.push_back(new_order);
    full.full_refresh(orders, full_work);                         // recompute everything
    incremental.on_new_order(new_order, incr_work);               // touch one row

    std::cout << "revenue 06-02: full=" << full.revenue("2024-06-02")
              << " incremental=" << incremental.revenue("2024-06-02") << '\n';
    std::cout << "work for one new order: full refresh=" << full_work << " rows, incremental=" << incr_work << " row\n";
}
```

**Output:**
```text
revenue 06-02: full=500025 incremental=500025
work for one new order: full refresh=100001 rows, incremental=1 row
```

### Interview answer
"A materialized view persists a query's result so expensive aggregations or joins are read like a table. It trades freshness and storage for read speed, refreshed fully on a schedule or incrementally via triggers or change-data-capture. In system design it underlies dashboards, precomputed feeds and CQRS read models."

---

## 3. NoSQL databases (document, key-value, column-family, graph)

**In one sentence:** choosing a NoSQL type means matching the **data model to your access pattern**: documents for self-contained objects, key-value for lookups by ID, column-family for massive write-heavy time series, graphs for relationship traversal.

### In plain words
Picking storage furniture for different items: a **filing cabinet with folders** (document), a **wall of numbered lockers** (key-value), a **ledger per customer with dated lines** (column-family), a **pinboard with strings** between photos (graph).

### How it works — choosing in a system design interview
| Need | Choose | Example system |
|---|---|---|
| Flexible, nested entities read as a whole (profiles, catalogs, CMS) | **Document** (MongoDB, Firestore) | Product catalog with varying attributes |
| Ultra-fast lookup by key, caching, sessions, counters | **Key-value** (Redis, DynamoDB) | Session store, rate limiter, shopping cart |
| Huge write volume, time-ordered data per entity, multi-region | **Column-family** (Cassandra, ScyllaDB, Bigtable) | Chat messages, IoT metrics, activity feeds |
| Many-hop relationship queries | **Graph** (Neo4j, Neptune) | Friend recommendations, fraud rings |
| Transactions, joins, ad-hoc queries, strong integrity | **Relational** (PostgreSQL, MySQL) | Orders, payments, inventory |
| Full-text search | **Search engine** (Elasticsearch, OpenSearch) | Product search |

Design rules that differ from SQL: **design around queries** (one table/collection per access pattern), **denormalize** and duplicate data, pick **partition keys** carefully, and accept eventual consistency where possible. Deep dive with C++ models of each type and MongoDB/Redis Q&A: **[NoSQL](../Databases/NoSQL.md)**.

### Modern C++ example — the same "user timeline" modeled for two access patterns
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Post { long ts; std::string author, text; };

int main() {
    // Column-family style: partition = user timeline, clustered by time (newest first).
    // Access pattern: "latest posts on MY timeline" -> one partition read, no joins.
    std::map<std::string, std::map<long, Post, std::greater<>>> timeline_by_user;

    // Key-value style: access pattern "get post by id" -> O(1) lookup.
    std::map<std::string, Post> post_by_id;

    // Fan-out on write: when Ben posts, copy the post into each follower's timeline (denormalized).
    std::map<std::string, std::vector<std::string>> followers{{"ben", {"ana", "cara"}}, {"ana", {"cara"}}};
    auto publish = [&](const std::string& id, const Post& p) {
        post_by_id[id] = p;
        for (const auto& f : followers[p.author]) timeline_by_user[f][p.ts] = p;
    };
    publish("p1", {100, "ben", "hello world"});
    publish("p2", {105, "ana", "coffee time"});
    publish("p3", {110, "ben", "system design is fun"});

    std::cout << "Cara's timeline (latest first):\n";
    for (const auto& [ts, p] : timeline_by_user["cara"]) std::cout << "  " << ts << " " << p.author << ": " << p.text << '\n';
    std::cout << "post p2 by id: " << post_by_id["p2"].text << '\n';
}
```

**Output:**
```text
Cara's timeline (latest first):
  110 ben: system design is fun
  105 ana: coffee time
  100 ben: hello world
post p2 by id: coffee time
```

### Interview answer
"I choose the store by access pattern: document databases for self-contained, flexible entities; key-value stores for lookups, caching and sessions; wide-column stores for write-heavy, partitioned, time-ordered data at scale; graph databases for multi-hop relationships; and relational databases when I need transactions, joins and integrity. NoSQL schemas are designed per query with denormalization and careful partition keys."

---

## 4. Database normalization forms (1NF, 2NF, 3NF, BCNF)

**In one sentence:** normalization organizes tables so **each fact is stored once**, preventing update/insert/delete anomalies; the normal forms are progressively stricter rules for doing that.

### In plain words
If a teacher's phone number is written in 200 enrollment rows, changing it means 200 edits — and missing one creates two "truths". Normalizing moves it to a `teachers` table where it lives exactly once.

### How it works
| Form | Rule (short) | Removes |
|---|---|---|
| **1NF** | Atomic values, no repeating groups, rows identifiable | Lists inside cells |
| **2NF** | 1NF + no non-key column depends on **part** of a composite key | Partial dependencies |
| **3NF** | 2NF + no non-key column depends on **another non-key** column | Transitive dependencies |
| **BCNF** | Every determinant is a **superkey** | 3NF's remaining edge cases |

*"Every non-key attribute depends on the key (1NF), the whole key (2NF), and nothing but the key (3NF)."* Full walkthrough with examples and C++ checks for each form: **[Normalization](../Databases/Normalization.md)**.

**Normalize vs. denormalize in system design:**
| | Normalized | Denormalized |
|---|---|---|
| Writes | Simple, one place to update | Must update every copy |
| Reads | Need joins | Fast, pre-joined |
| Consistency | Enforced by structure | Must be maintained (triggers, events, jobs) |
| Typical use | OLTP core data (orders, users, payments) | Read-heavy views, analytics (star schema), NoSQL, caches |

Typical approach: **normalize the source of truth to 3NF**, then add denormalized **read models** (materialized views, caches, search indexes) where profiling shows joins are the bottleneck.

### Modern C++ example — the update anomaly a normalized design prevents
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

int main() {
    // Denormalized: teacher phone copied into every enrollment row
    struct Enrollment { std::string student, course, teacher, teacher_phone; };
    std::vector<Enrollment> flat{{"Ana", "DB", "Smith", "555-1"}, {"Ben", "DB", "Smith", "555-1"},
                                 {"Cara", "DB", "Smith", "555-1"}};
    flat[0].teacher_phone = "555-9";                 // an update that missed two rows
    std::set<std::string> phones;
    for (const auto& e : flat) phones.insert(e.teacher_phone);
    std::cout << "denormalized: Smith has " << phones.size() << " different phone numbers (anomaly)\n";

    // Normalized (3NF): the phone lives in ONE place
    std::map<std::string, std::string> teachers{{"Smith", "555-1"}};
    struct Enroll { std::string student, course, teacher; };
    std::vector<Enroll> enrollments{{"Ana", "DB", "Smith"}, {"Ben", "DB", "Smith"}, {"Cara", "DB", "Smith"}};
    teachers["Smith"] = "555-9";                     // one update, always consistent
    for (const auto& e : enrollments)
        std::cout << "  " << e.student << " -> teacher " << e.teacher << " (" << teachers[e.teacher] << ")\n";
}
```

**Output:**
```text
denormalized: Smith has 2 different phone numbers (anomaly)
  Ana -> teacher Smith (555-9)
  Ben -> teacher Smith (555-9)
  Cara -> teacher Smith (555-9)
```

### Interview answer
"Normalization through 1NF, 2NF, 3NF and BCNF removes redundancy so each fact is stored once, eliminating update, insert and delete anomalies. In system design I normalize the transactional source of truth, then denormalize deliberately — materialized views, caches, NoSQL read models — for read-heavy paths, keeping copies in sync via events or triggers."

---

## 5. A design & optimization checklist

1. **Model the domain** (entities, relationships) and normalize the source of truth.
2. **List the access patterns** (top queries, read/write ratio, latency targets).
3. **Index** for those queries; verify with `EXPLAIN ANALYZE` ([Indexing](../Databases/Indexing.md)).
4. **Fix N+1 queries**, select only needed columns, paginate with keyset (`WHERE id > ? LIMIT 50`) instead of large `OFFSET`s.
5. **Cache** hot reads ([Caching Strategies](./Caching-Strategies.md)); use **read replicas** for read scaling.
6. **Materialized views / read models** for expensive aggregations.
7. **Partition** very large tables by the main filter (usually time); **shard** when one server can't handle writes or storage.
8. Use **connection pooling**, batch writes, and keep transactions short.
9. Choose **NoSQL** where the access pattern and scale fit better than relational.
10. **Monitor**: slow query log, cache hit ratio, replication lag, lock waits.

---

## Cheat sheet

| Topic | Key idea |
|---|---|
| Partitioning | Split big tables by key (range/list/hash); pruning; drop old partitions |
| Sharding | Partitioning across servers for write/storage scale |
| Materialized view | Stored query result; fast reads, refresh for freshness |
| NoSQL choice | Document / KV / wide-column / graph by access pattern |
| Normal forms | 1NF atomic → 2NF whole key → 3NF only the key → BCNF every determinant a key |
| Denormalization | Deliberate copies for read speed; must keep in sync |
