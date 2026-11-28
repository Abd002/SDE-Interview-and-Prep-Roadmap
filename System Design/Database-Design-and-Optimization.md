# Database Design and Optimization — Partitioning, Materialized Views, NoSQL Types and Normal Forms

> **What you'll learn:** how database design choices affect performance and scale in system design: **partitioning** (inside one database and across many), **materialized views**, choosing among **NoSQL database types (document, key-value, column-family, graph)**, and applying the **normal forms (1NF, 2NF, 3NF, BCNF)** — plus when to deliberately denormalize. Deeper dives are linked.
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
