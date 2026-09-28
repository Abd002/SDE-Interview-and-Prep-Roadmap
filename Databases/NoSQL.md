# NoSQL Databases — Explained for Beginners

> **What you'll learn:** what "NoSQL" means and when to choose it over SQL, the four **types** — **document, key-value, column-family, graph** — each modeled in C++, and the most common **MongoDB** and **Redis** interview questions with answers.
>
> **Prerequisites:** basic understanding of tables ([Normalization](./Normalization.md) helps to see what NoSQL trades away).

## Table of Contents
0. [What is NoSQL, and why?](#0-what-is-nosql-and-why)
1. [Document-based](#1-document-based)
2. [Key-value](#2-key-value)
3. [Column-family](#3-column-family)
4. [Graph](#4-graph)
5. [MongoDB interview questions](#5-mongodb-interview-questions)
6. [Redis interview questions](#6-redis-interview-questions)
7. [Cheat sheet](#cheat-sheet)

---

## 0. What is NoSQL, and why?

**In one sentence:** "NoSQL" ("Not only SQL") is a family of databases that **don't use the relational table model**, trading some relational features (joins, rigid schemas, sometimes strict consistency) for flexibility, horizontal scale and speed for specific access patterns.

### In plain words
A relational database is a **filing cabinet with strict forms**: every folder has the same fields, and you cross-reference folders by ID. That's great for consistency, but awkward when every item looks different, when you need to spread the cabinet across 100 buildings, or when the only thing you ever do is "look up by name". NoSQL databases are **specialized storage furniture**: a box of self-contained folders (document), a wall of labeled lockers (key-value), a giant ledger optimized for appending (column-family), or a pinboard with strings between photos (graph).

### How it works
| | Relational (SQL) | NoSQL (typical) |
|---|---|---|
| Data model | Tables, rows, fixed columns | Documents, key-value pairs, wide rows, graphs |
| Schema | Defined up front (schema-on-write) | Flexible (schema-on-read) |
| Relationships | Joins + foreign keys | Embedding/denormalization, or graph edges |
| Scaling | Mostly vertical; sharding is hard | Designed for horizontal scaling (sharding, replication) |
| Consistency | Strong ACID transactions | Often tunable/eventual; many now support ACID per document or more |
| Query language | SQL (standard) | Product-specific APIs |
| Best for | Complex queries, integrity, transactions | Huge scale, flexible data, specific access patterns |

**Design mindset difference:** in SQL you model the *data* and then write any query; in NoSQL you model around your *queries* ("what will I read together?").

**CAP theorem (quick):** in a distributed system, during a network **P**artition you must choose between **C**onsistency (refuse/answer with latest data) and **A**vailability (answer, maybe stale). Many NoSQL systems favor availability and offer **eventual consistency**. (More in [Distributed Systems](../System%20Design/Distributed-Systems.md).)

It's rarely either/or: most real systems use **polyglot persistence** — e.g. PostgreSQL for orders, Redis for caching/sessions, Elasticsearch for search, a graph DB for recommendations.

---

## 1. Document-based

**In one sentence:** a document database stores **self-contained documents** (JSON-like objects with nested fields and arrays), each with a unique ID, and lets you query by any field.

### In plain words
Instead of splitting a customer across 5 tables (customer, addresses, phones, preferences, orders), you keep **one folder per customer** containing everything about them. Different folders can have different fields — a business customer might have a "VAT number", a personal one doesn't.

### How it works
```json
{
  "_id": "u42",
  "name": "Ana",
  "email": "ana@example.com",
  "addresses": [ { "type": "home", "city": "Lisbon" } ],
  "tags": ["vip", "newsletter"],
  "orders": [ { "id": 1, "total": 30 }, { "id": 2, "total": 20 } ]
}
```
- Documents are grouped into **collections** (≈ tables).
- **Embed** data you read together (addresses inside the user); **reference** by ID data that is large, shared or unbounded (millions of orders → separate collection).
- Secondary indexes on any field, including nested ones (`addresses.city`).
- Examples: **MongoDB**, Couchbase, Firestore, CouchDB, Amazon DocumentDB. (PostgreSQL's `JSONB` gives document features inside SQL.)
- Great for: content management, catalogs with varied attributes, user profiles, event logging.

### Modern C++ example — a tiny document store with nested fields
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <sstream>
#include <string>
#include <variant>
#include <vector>

// A JSON-like value: null, number, string, array, or object
struct Value;
using Object = std::map<std::string, Value>;
using Array = std::vector<Value>;
struct Value : std::variant<std::monostate, double, std::string, std::shared_ptr<Array>, std::shared_ptr<Object>> {
    using variant::variant;
};
Value obj(Object o) { return std::make_shared<Object>(std::move(o)); }
Value arr(Array a)  { return std::make_shared<Array>(std::move(a)); }

// Get a nested field by dotted path, e.g. "address.city"
std::optional<Value> get(const Value& v, const std::string& path) {
    std::istringstream parts(path);
    std::string key;
    const Value* cur = &v;
    while (std::getline(parts, key, '.')) {
        auto* o = std::get_if<std::shared_ptr<Object>>(cur);
        if (!o) return std::nullopt;
        auto it = (*o)->find(key);
        if (it == (*o)->end()) return std::nullopt;    // field missing: flexible schema!
        cur = &it->second;
    }
    return *cur;
}

int main() {
    std::map<std::string, Value> users;                // collection: _id -> document
    users["u1"] = obj({{"name", std::string("Ana")}, {"address", obj({{"city", std::string("Lisbon")}})},
                       {"tags", arr({std::string("vip")})}});
    users["u2"] = obj({{"name", std::string("Ben")}, {"address", obj({{"city", std::string("Porto")}})}});
    users["u3"] = obj({{"name", std::string("Acme Ltd")}, {"vat", std::string("PT123")},     // different shape
                       {"address", obj({{"city", std::string("Lisbon")}})}});

    // db.users.find({ "address.city": "Lisbon" })
    std::cout << "users in Lisbon:";
    for (const auto& [id, doc] : users) {
        auto city = get(doc, "address.city");
        if (city && std::get<std::string>(*city) == "Lisbon")
            std::cout << ' ' << std::get<std::string>(*get(doc, "name"));
    }
    std::cout << '\n';
    std::cout << "u3 has a VAT field: " << (get(users["u3"], "vat") ? "yes" : "no")
              << ", u1 has a VAT field: " << (get(users["u1"], "vat") ? "yes" : "no") << '\n';
}
```

**Output:**
```text
users in Lisbon: Ana Acme Ltd
u3 has a VAT field: yes, u1 has a VAT field: no
```

### Interview answer
"Document databases store semi-structured JSON/BSON documents in collections with flexible schemas and rich queries and indexes on nested fields. You embed data read together and reference data that is large, shared or unbounded. They suit catalogs, profiles and content; the trade-off is weaker support for joins and multi-document transactions compared with relational databases."

---

## 2. Key-value

**In one sentence:** a key-value store is a giant **dictionary**: you store a value under a key and get it back by that exact key — extremely fast, extremely simple.

### In plain words
A **coat check**: you hand over your coat (value) and receive ticket #57 (key). Later, ticket #57 gets you your coat back instantly. The attendant doesn't care what's in the pockets and can't answer "which coats are red?" — only "what's under ticket #57?".

### How it works
- Operations: `GET key`, `SET key value`, `DELETE key` — O(1) typically.
- The value is opaque to the database (a string, blob, or — in Redis — a data structure).
- Often **in memory** (Redis, Memcached) for microsecond latency, sometimes with persistence; or distributed on disk (DynamoDB, Riak, etcd, RocksDB as an embedded engine).
- **TTL (time to live)**: keys can expire automatically — perfect for caches and sessions.
- Scales horizontally by **partitioning keys** with hashing (see [Scalability → Consistent Hashing](../System%20Design/Scalability.md)).
- Use cases: caching, session storage, shopping carts, feature flags, rate-limit counters, configuration (etcd/Consul).

### Modern C++ example — a key-value store with TTL
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <optional>
#include <string>
#include <unordered_map>

using namespace std::chrono_literals;
using Clock = std::chrono::steady_clock;

class KeyValueStore {
public:
    void set(const std::string& key, std::string value,
             std::optional<std::chrono::seconds> ttl = std::nullopt, Clock::time_point now = Clock::now()) {
        std::optional<Clock::time_point> expires;
        if (ttl) expires = now + *ttl;
        data_[key] = {std::move(value), expires};
    }
    std::optional<std::string> get(const std::string& key, Clock::time_point now = Clock::now()) {
        auto it = data_.find(key);
        if (it == data_.end()) return std::nullopt;
        if (it->second.expires && now >= *it->second.expires) {   // lazy expiration
            data_.erase(it);
            return std::nullopt;
        }
        return it->second.value;
    }
    bool del(const std::string& key) { return data_.erase(key) > 0; }
private:
    struct Entry { std::string value; std::optional<Clock::time_point> expires; };
    std::unordered_map<std::string, Entry> data_;                  // O(1) average lookups
};

int main() {
    KeyValueStore kv;
    auto t0 = Clock::now();
    kv.set("user:42:name", "Ana");
    kv.set("session:abc", "user=42", 1800s, t0);                    // expires in 30 minutes

    std::cout << "GET user:42:name -> " << kv.get("user:42:name").value_or("(nil)") << '\n';
    std::cout << "GET session:abc  -> " << kv.get("session:abc", t0 + 60s).value_or("(nil)") << " (after 1 min)\n";
    std::cout << "GET session:abc  -> " << kv.get("session:abc", t0 + 3600s).value_or("(nil)") << " (after 1 hour)\n";
}
```

**Output:**
```text
GET user:42:name -> Ana
GET session:abc  -> user=42 (after 1 min)
GET session:abc  -> (nil) (after 1 hour)
```

### Interview answer
"Key-value stores map unique keys to opaque values with O(1) get/put/delete, often in memory with TTLs, and partition keys across nodes for horizontal scale. They're ideal for caches, sessions, counters and configuration, but can't query by value — you must know the key."

---

## 3. Column-family

**In one sentence:** a column-family (wide-column) database stores rows grouped by a **partition key**, where each row can have many, varying columns kept **sorted** on disk — built for massive write volumes and fast reads of a partition's range.

### In plain words
Imagine a huge accounting ledger split into **one notebook per customer** (the partition). Inside each notebook, entries are always kept **in date order** (the clustering key). "Give me Ana's last 10 transactions" = open Ana's notebook and read the last 10 lines — instant, even with billions of entries overall. Writing a new entry is just appending a line.

(Not to be confused with **columnar** analytics databases like ClickHouse/Redshift, which store each *column* separately for fast aggregations.)

### How it works
Using **Apache Cassandra** terms (also: ScyllaDB, HBase, Google Bigtable, Azure Cosmos DB Cassandra API):
```sql
-- CQL (Cassandra Query Language) looks like SQL, but the key design is everything
CREATE TABLE messages_by_chat (
    chat_id    uuid,          -- PARTITION key: decides which node stores the data
    sent_at    timestamp,     -- CLUSTERING key: sort order inside the partition
    sender     text,
    body       text,
    PRIMARY KEY ((chat_id), sent_at)
) WITH CLUSTERING ORDER BY (sent_at DESC);

SELECT * FROM messages_by_chat WHERE chat_id = ? LIMIT 20;   -- latest 20 messages: one partition read
```
- **Partition key → hashed → node.** All rows of a partition live together, so reading one partition is fast; queries *across* partitions without the key are discouraged/forbidden.
- **Write-optimized storage (LSM trees):** writes go to an in-memory table + commit log, then are flushed as immutable sorted files (SSTables) and compacted later → very high write throughput.
- **Denormalize per query:** one table per access pattern (`messages_by_chat`, `messages_by_user`), no joins.
- **Tunable consistency:** per query choose `ONE`, `QUORUM`, `ALL` replicas.
- Use cases: time series, IoT sensor data, messaging (Discord used Cassandra/ScyllaDB), activity feeds, logs at massive scale.

### Modern C++ example — partition key + sorted clustering key
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Message { std::string sender, body; };

class MessagesByChat {
public:
    void insert(const std::string& chat_id, long sent_at, Message m) {
        partitions_[chat_id][sent_at] = std::move(m);          // cheap append into a sorted map
    }
    // SELECT * FROM messages_by_chat WHERE chat_id = ? LIMIT n   (newest first)
    std::vector<std::pair<long, Message>> latest(const std::string& chat_id, std::size_t n) const {
        std::vector<std::pair<long, Message>> out;
        auto it = partitions_.find(chat_id);                    // 1 partition lookup (which node)
        if (it == partitions_.end()) return out;
        for (const auto& [ts, msg] : it->second) {              // already sorted DESC
            if (out.size() == n) break;
            out.emplace_back(ts, msg);
        }
        return out;
    }
    std::size_t node_for(const std::string& chat_id, std::size_t nodes) const {
        return std::hash<std::string>{}(chat_id) % nodes;       // partition key -> node
    }
private:
    // partition key -> (clustering key sorted DESC -> row)
    std::map<std::string, std::map<long, Message, std::greater<>>> partitions_;
};

int main() {
    MessagesByChat table;
    table.insert("chat-A", 1000, {"ana", "hi"});
    table.insert("chat-A", 1005, {"ben", "hello!"});
    table.insert("chat-B", 1003, {"cara", "other chat"});
    table.insert("chat-A", 1010, {"ana", "how are you?"});

    for (const auto& [ts, m] : table.latest("chat-A", 2))
        std::cout << ts << ' ' << m.sender << ": " << m.body << '\n';
    std::cout << "chat-A lives on node " << table.node_for("chat-A", 3) << " of 3 (all its rows together)\n";
}
```

**Output (may vary):**
```text
1010 ana: how are you?
1005 ben: hello!
chat-A lives on node 2 of 3 (all its rows together)
```
(The node number depends on the hash function of your standard library.)

### Interview answer
"Wide-column stores like Cassandra, HBase and Bigtable organize data by partition key, with rows clustered and sorted within a partition, stored in LSM trees for very high write throughput. You design one denormalized table per query pattern, always querying by partition key, with tunable consistency across replicas. They excel at time-series, messaging and event data at huge scale."

---

## 4. Graph

**In one sentence:** a graph database stores **nodes** (things) and **edges** (relationships between them) as first-class data, making "follow the connections" queries fast.

### In plain words
A detective's **pinboard**: photos of people (nodes) connected by strings labeled "knows", "works at", "paid money to" (edges). Questions like "who are friends of Ana's friends who live in Lisbon?" mean *following strings* — easy on a pinboard, painful in tables (each hop is another expensive join).

### How it works
- **Property graph model:** nodes and edges both have labels and properties: `(:Person {name:'Ana'})-[:FRIENDS_WITH {since:2019}]->(:Person {name:'Ben'})`.
- **Index-free adjacency:** each node directly points to its neighbors, so traversing one hop costs O(neighbors), independent of total graph size.
- Query languages: **Cypher** (Neo4j, also GQL standard), Gremlin, SPARQL (RDF).
```cypher
// Friends-of-friends of Ana who aren't already her friends
MATCH (a:Person {name: 'Ana'})-[:FRIENDS_WITH]-(f)-[:FRIENDS_WITH]-(fof)
WHERE fof <> a AND NOT (a)-[:FRIENDS_WITH]-(fof)
RETURN DISTINCT fof.name;
```
- Examples: **Neo4j**, Amazon Neptune, TigerGraph, ArangoDB (multi-model), JanusGraph.
- Use cases: social networks, recommendations ("people who bought X also bought"), fraud detection (rings of accounts), knowledge graphs, network/IT dependency mapping, access-control graphs.

### Modern C++ example — friends-of-friends with an adjacency list
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

class SocialGraph {
public:
    void befriend(const std::string& a, const std::string& b) {
        adj_[a].insert(b);                                  // index-free adjacency:
        adj_[b].insert(a);                                  // each node knows its neighbors
    }
    std::set<std::string> friends_of_friends(const std::string& who) const {
        std::set<std::string> result;
        const auto& friends = adj_.at(who);
        for (const auto& f : friends)                       // hop 1
            for (const auto& fof : adj_.at(f))              // hop 2
                if (fof != who && !friends.contains(fof)) result.insert(fof);
        return result;
    }
private:
    std::map<std::string, std::set<std::string>> adj_;
};

int main() {
    SocialGraph g;
    g.befriend("Ana", "Ben");
    g.befriend("Ana", "Cara");
    g.befriend("Ben", "Dan");
    g.befriend("Cara", "Dan");
    g.befriend("Cara", "Eve");
    g.befriend("Dan", "Finn");

    std::cout << "People Ana may know:";
    for (const auto& p : g.friends_of_friends("Ana")) std::cout << ' ' << p;
    std::cout << '\n';
}
```

**Output:**
```text
People Ana may know: Dan Eve
```

### Interview answer
"Graph databases store nodes and relationships with properties and use index-free adjacency, so multi-hop traversals cost proportional to the neighborhood explored rather than table size. They shine for social networks, recommendations, fraud rings and knowledge graphs, queried with Cypher/GQL or Gremlin; they're less suited to bulk aggregations over all data."

---

## 5. MongoDB interview questions

**Q1. What is MongoDB?**
A document database storing **BSON** (binary JSON) documents in **collections**, with flexible schemas, rich queries, secondary indexes, aggregation pipelines, replication (replica sets) and sharding.

**Q2. What is `_id`?**
Every document's primary key. If you don't provide one, MongoDB generates an **ObjectId** (12 bytes: timestamp + random + counter), which is roughly time-ordered.

**Q3. Embedding vs. referencing — how do you decide?**
Embed when data is read together, owned by the parent and bounded in size (a user's addresses). Reference when it's large, unbounded (a user's millions of events), shared by many documents, or updated independently. Documents are limited to **16 MB**.

**Q4. How do you query and update?**
```javascript
db.users.insertOne({ name: "Ana", age: 30, city: "Lisbon" })
db.users.find({ age: { $gte: 18 }, city: "Lisbon" }, { name: 1, _id: 0 })   // filter + projection
db.users.updateOne({ name: "Ana" }, { $set: { age: 31 }, $push: { tags: "vip" } })
db.users.updateOne({ email: "x@y.com" }, { $set: { name: "X" } }, { upsert: true })
db.users.deleteMany({ active: false })
```

**Q5. What is the aggregation pipeline?**
A sequence of stages that transform documents, like a Unix pipe: `$match` (filter) → `$group` (aggregate) → `$sort` → `$project` → `$lookup` (left join) → `$unwind` (flatten arrays)…
```javascript
db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort:  { total: -1 } },
  { $limit: 3 }
])
```

**Q6. What indexes does MongoDB support?**
Single-field, **compound** (order matters — follow the ESR rule: Equality, Sort, Range), multikey (arrays), text, geospatial (2dsphere), hashed (for sharding), TTL (auto-delete old docs), partial, unique, wildcard. Use `explain("executionStats")` to verify `IXSCAN` instead of `COLLSCAN`.

**Q7. What is a replica set?**
A group of `mongod` nodes: one **primary** takes writes, **secondaries** replicate its oplog. If the primary fails, the members **elect** a new primary (Raft-like). **Write concern** (`w: "majority"`) controls durability; **read preference** (primary/secondary/nearest) and **read concern** control what reads see.

**Q8. How does sharding work?**
Data is split into **chunks** by a **shard key** and spread across shards; `mongos` routers direct queries; config servers hold metadata. A good shard key has high cardinality, even distribution and matches common queries (avoid monotonically increasing keys like timestamps with ranged sharding → hot shard; use hashed sharding instead).

**Q9. Does MongoDB support transactions?**
Single-document operations are always atomic. Since 4.0 (replica sets) and 4.2 (sharded clusters), **multi-document ACID transactions** exist — but they're slower; good schema design (embedding) usually avoids needing them.

**Q10. MongoDB vs. a relational database?**
MongoDB: flexible schema, natural JSON mapping, easy horizontal scaling, denormalized reads. Relational: strong schema, joins, mature transactions, ad-hoc analytics. Choose by data shape and access patterns.

### Modern C++ example — the aggregation pipeline idea (`$match` → `$group` → `$sort` → `$limit`)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <ranges>
#include <string>
#include <vector>

struct Order { std::string customer; std::string status; double amount; };

int main() {
    const std::vector<Order> orders{
        {"ana", "paid", 30}, {"ben", "paid", 50}, {"ana", "paid", 40},
        {"cara", "cancelled", 999}, {"cara", "paid", 10}, {"dan", "paid", 60}};

    // $match: { status: "paid" }
    auto paid = orders | std::views::filter([](const Order& o) { return o.status == "paid"; });
    // $group: { _id: "$customer", total: { $sum: "$amount" } }
    std::map<std::string, double> totals;
    for (const auto& o : paid) totals[o.customer] += o.amount;
    // $sort: { total: -1 }
    std::vector<std::pair<std::string, double>> result(totals.begin(), totals.end());
    std::ranges::sort(result, std::greater<>{}, &std::pair<std::string, double>::second);
    // $limit: 3
    result.resize(std::min<std::size_t>(3, result.size()));

    for (const auto& [customer, total] : result)
        std::cout << "{ _id: \"" << customer << "\", total: " << total << " }\n";
}
```

**Output:**
```text
{ _id: "ana", total: 70 }
{ _id: "dan", total: 60 }
{ _id: "ben", total: 50 }
```

---

## 6. Redis interview questions

**Q1. What is Redis?**
An **in-memory** data-structure server (key-value store) with sub-millisecond latency. Values can be strings, lists, hashes, sets, **sorted sets**, streams, bitmaps, HyperLogLogs and geospatial indexes. Used as a cache, session store, message broker, rate limiter, leaderboard, and lightweight database.

**Q2. Why is Redis so fast if it's (mostly) single-threaded?**
Data lives in RAM; operations are simple O(1)/O(log n); a single-threaded event loop (epoll) avoids locks and context switches; I/O threads (Redis 6+) help with networking. Being single-threaded also makes each command **atomic**.

**Q3. Main data types and uses?**
| Type | Commands | Use case |
|---|---|---|
| String | `SET`, `GET`, `INCR`, `SETEX` | Cache values, counters, rate limits |
| Hash | `HSET`, `HGETALL` | Objects (user profile fields) |
| List | `LPUSH`, `RPOP`, `BLPOP` | Queues, recent items |
| Set | `SADD`, `SISMEMBER`, `SINTER` | Unique visitors, tags |
| Sorted set | `ZADD`, `ZRANGE ... REV`, `ZINCRBY` | Leaderboards, priority queues, time-ordered feeds |
| Stream | `XADD`, `XREADGROUP` | Event log with consumer groups |

**Q4. How does Redis persist data?**
**RDB** snapshots (periodic point-in-time dumps, compact, may lose recent writes) and/or **AOF** (append-only log of every write, `fsync` every second or always; more durable, bigger). Many deployments use both; pure caches may use neither.

**Q5. How do keys expire, and what happens when memory is full?**
`EXPIRE key seconds` / `SET key val EX 60`. Expired keys are removed **lazily** (on access) and **actively** (random sampling). When `maxmemory` is reached, the **eviction policy** decides: `noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, `volatile-ttl`, random…

**Q6. How do you implement a cache with Redis?**
Usually **cache-aside**: read from Redis; on miss read the DB and `SET` with a TTL; on update, write the DB and delete the key. See [Caching Strategies](../System%20Design/Caching-Strategies.md).

**Q7. Transactions and atomicity?**
Every single command is atomic. `MULTI`/`EXEC` queues commands and executes them together (no rollback on errors); `WATCH` adds optimistic locking. **Lua scripts** (`EVAL`) or Functions run atomically for complex logic.

**Q8. Pub/Sub vs. Streams?**
Pub/Sub is fire-and-forget: offline subscribers miss messages. Streams persist messages, support consumer groups, acknowledgements and replay — closer to Kafka-lite.

**Q9. How do you scale Redis and make it highly available?**
**Replication** (primary + replicas), **Redis Sentinel** for automatic failover, **Redis Cluster** for sharding across 16,384 hash slots (key → `CRC16(key) mod 16384`). Replication is asynchronous, so a failover can lose the latest writes.

**Q10. How would you build a distributed lock?**
`SET lock:resource <random-token> NX PX 30000` (set only if absent, with expiry); release with a Lua script that deletes only if the token matches. For stronger guarantees across nodes there's the (debated) **Redlock** algorithm; for correctness-critical locks, use fencing tokens or a consensus system (etcd/ZooKeeper).

### Modern C++ example — a Redis-style sorted set leaderboard (`ZADD`, `ZINCRBY`, `ZREVRANGE`)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <utility>

// Sorted set = hash map (member -> score) + ordered set of (score, member).
// Redis uses a hash table + skip list for the same O(1) lookups and O(log n) ranking.
class SortedSet {
public:
    void zadd(const std::string& member, double score) {
        if (auto it = score_of_.find(member); it != score_of_.end()) ordered_.erase({it->second, member});
        score_of_[member] = score;
        ordered_.insert({score, member});
    }
    void zincrby(const std::string& member, double delta) {
        auto it = score_of_.find(member);
        zadd(member, (it == score_of_.end() ? 0 : it->second) + delta);
    }
    void zrevrange(std::size_t n) const {                 // top n, highest first
        std::size_t rank = 1;
        for (auto it = ordered_.begin(); it != ordered_.end() && rank <= n; ++it, ++rank)
            std::cout << rank << ". " << it->second << " (" << it->first << ")\n";
    }
private:
    std::map<std::string, double> score_of_;
    std::set<std::pair<double, std::string>, std::greater<>> ordered_;
};

int main() {
    SortedSet leaderboard;                                // ZADD game:scores ...
    leaderboard.zadd("ana", 120);
    leaderboard.zadd("ben", 90);
    leaderboard.zadd("cara", 150);
    leaderboard.zincrby("ben", 70);                       // ZINCRBY game:scores 70 ben
    leaderboard.zrevrange(3);                             // ZREVRANGE game:scores 0 2 WITHSCORES
}
```

**Output:**
```text
1. ben (160)
2. cara (150)
3. ana (120)
```

---

## Cheat sheet

| Type | Model | Examples | Best for | Weak at |
|---|---|---|---|---|
| Document | JSON documents in collections | MongoDB, Couchbase, Firestore | Varied/nested data, catalogs, profiles | Joins, cross-document transactions |
| Key-value | key → opaque value | Redis, DynamoDB, Memcached, etcd | Caching, sessions, counters | Querying by value |
| Column-family | Partition key → sorted wide rows | Cassandra, ScyllaDB, HBase, Bigtable | Massive writes, time series, messaging | Ad-hoc queries, joins |
| Graph | Nodes + edges with properties | Neo4j, Neptune, TigerGraph | Relationships, multi-hop traversal | Bulk aggregation |

SQL vs NoSQL: **model the data, then query anything** vs. **model around the queries**. Most systems use both.
