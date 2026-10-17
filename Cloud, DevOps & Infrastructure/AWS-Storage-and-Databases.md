# AWS Storage and Databases — DynamoDB, EBS/EFS/S3, ElastiCache, RDS/Aurora and S3 Features

> **What you'll learn:** how to model **DynamoDB** tables (partition and sort keys, **GSIs**, **hot partitions**, capacity modes), when to use **EBS vs. EFS vs. S3** and what their durability and consistency mean, how to use **ElastiCache/Redis** (invalidation, eviction, replication), how **RDS/Aurora** handle backups, replicas, failover and **connection pooling**, and the key **S3** features (versioning, encryption, lifecycle policies, **presigned URLs**). Each part has config snippets and a runnable C++ model.
>
> **Prerequisites:** [Databases → NoSQL](../Databases/NoSQL.md), [Caching Strategies](../System%20Design/Caching-Strategies.md), [Transactions](../Databases/Transactions-and-Isolation.md).

## Table of Contents
1. [DynamoDB: partition/sort keys, GSIs, hot partitions, capacity modes](#1-dynamodb-partitionsort-keys-gsis-hot-partitions-capacity-modes)
2. [EBS vs. EFS vs. S3; durability and consistency trade-offs](#2-ebs-vs-efs-vs-s3-durability-and-consistency-trade-offs)
3. [ElastiCache/Redis: cache invalidation, eviction, and replication](#3-elasticacheredis-cache-invalidation-eviction-and-replication)
4. [RDS/Aurora: backups, replicas, failover, and connection pooling](#4-rdsaurora-backups-replicas-failover-and-connection-pooling)
5. [S3: object versioning, encryption, lifecycle policies, and presigned URLs](#5-s3-object-versioning-encryption-lifecycle-policies-and-presigned-urls)
6. [Cheat sheet](#cheat-sheet)

---

## 1. DynamoDB: partition/sort keys, GSIs, hot partitions, capacity modes

**In one sentence:** **DynamoDB** is a serverless key-value/document database where the **partition key** decides which internal partition stores an item and the optional **sort key** orders items within it; you design tables **around access patterns**, add **global secondary indexes (GSIs)** for other queries, avoid **hot partitions** with high-cardinality keys, and choose **on-demand** or **provisioned** capacity.

### In plain words
A huge filing cabinet with thousands of drawers. The partition key picks the drawer (by hashing); inside, the sort key keeps folders in order so "all of customer 42's orders from October" is one quick grab. If everyone files under the same drawer label, that one drawer jams (hot partition).

### How it works
- **Primary key:** partition key (`PK`) alone, or `PK + SK` (composite). Queries **must** give the partition key; the sort key allows `=`, `<`, `begins_with`, `BETWEEN`.
- **Access patterns first:** list the queries ("orders of a customer by date", "order by ID", "open orders by status"), then design keys. **Single-table design** stores several entity types with generic keys (`PK=CUSTOMER#42`, `SK=ORDER#2026-10-17#81`).
- **GSI:** a second key schema on the same data (eventually consistent, its own capacity) — e.g. `GSI1PK=STATUS#open`. **LSI:** same partition key, different sort key (must be created with the table, 10 GB per partition key limit).
- **Hot partitions:** each partition handles up to about **3,000 RCU and 1,000 WCU** per second; a low-cardinality key (`status`, `date`) or one celebrity key concentrates traffic. Fix with high-cardinality keys, **write sharding** (`PK = DATE#2026-10-17#shard-7`), caching (DAX), and adaptive capacity helps but isn't magic.
- **Capacity modes:** **on-demand** (pay per request, instant scaling — new/spiky workloads) vs. **provisioned** with auto scaling (cheaper for steady, predictable traffic; reserved capacity discounts).
- **Consistency:** reads are eventually consistent by default; strongly consistent reads on the base table (not GSIs); **transactions** (`TransactWriteItems`) and **conditional writes** for invariants and idempotency; TTL for expiry; Streams for change data capture.
- Item size limit **400 KB**; `Scan` is expensive — avoid it in hot paths.

#### Modern C++ example — single-table key design, a sort-key range query, and spotting a hot partition
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Item { std::string pk, sk, data; };

int main() {
    std::map<std::string, std::map<std::string, std::string>> table;     // PK -> (SK -> data), SK kept sorted
    auto put = [&](const Item& i) { table[i.pk][i.sk] = i.data; };
    put({"CUSTOMER#42", "PROFILE", "Mona, Cairo"});
    put({"CUSTOMER#42", "ORDER#2026-09-30#77", "keyboard"});
    put({"CUSTOMER#42", "ORDER#2026-10-03#79", "mouse"});
    put({"CUSTOMER#42", "ORDER#2026-10-17#81", "monitor"});
    put({"CUSTOMER#7", "ORDER#2026-10-05#80", "cable"});

    // Query: PK = CUSTOMER#42 AND SK BETWEEN ORDER#2026-10-01 AND ORDER#2026-10-31~
    auto& part = table["CUSTOMER#42"];
    std::cout << "October orders of customer 42:";
    for (auto it = part.lower_bound("ORDER#2026-10-01"); it != part.end() && it->first <= "ORDER#2026-10-31~"; ++it)
        std::cout << ' ' << it->second;
    std::cout << '\n';

    // Hot partitions: 10,000 writes/s keyed by status vs. by order ID, spread over 8 partitions.
    auto load = [](const std::function<std::string(int)>& key) {
        std::vector<int> per_partition(8, 0);
        for (int i = 0; i < 10000; ++i) ++per_partition[std::hash<std::string>{}(key(i)) % 8];
        int mx = 0; for (int x : per_partition) mx = std::max(mx, x);
        return mx;
    };
    int by_status = load([](int i) { return i % 10 == 0 ? std::string("STATUS#shipped") : std::string("STATUS#open"); });
    int by_order = load([](int i) { return "ORDER#" + std::to_string(i); });
    int sharded = load([](int i) { return "STATUS#open#shard-" + std::to_string(i % 20); });
    std::cout << "busiest partition (limit ~1000 WCU): by status=" << by_status << " WCU (HOT), by order id=" << by_order
              << " WCU, status with 20 write shards=" << sharded << " WCU\n";
}
```

**Output:**
```text
October orders of customer 42: mouse monitor
busiest partition (limit ~1000 WCU): by status=9000 WCU (HOT), by order id=1303 WCU, status with 20 write shards=2500 WCU
```

Even "by order id" is above 1,000 WCU per partition here because the toy table only has 8 partitions; real DynamoDB **splits partitions** as traffic grows — but it can't split a **single key**, which is why `STATUS#open` stays hot.

### Interview answer
"In DynamoDB I start from access patterns: the partition key spreads data and must appear in every query, the sort key orders items within a partition for range queries, and in single-table designs I use prefixed composite keys like CUSTOMER#42 and ORDER#date#id. GSIs serve other access patterns, eventually consistently. Hot partitions come from low-cardinality or celebrity keys hitting per-partition limits of about 1,000 writes and 3,000 reads per second, so I use high-cardinality keys, write sharding or caching. On-demand suits new or spiky workloads, provisioned with auto scaling suits steady ones, and conditional writes and transactions enforce invariants and idempotency."

---

## 2. EBS vs. EFS vs. S3; durability and consistency trade-offs

**In one sentence:** **EBS** is a **block disk** attached to one EC2 instance in one AZ (low latency, for OS and databases), **EFS** is a **shared POSIX file system** mounted by many instances across AZs (NFS), and **S3** is **object storage** accessed over HTTP (virtually unlimited, 11 nines durability, strongly consistent since 2020).

### In plain words
EBS is your laptop's hard drive. EFS is a shared network drive the whole office can open. S3 is a giant warehouse where every box has a label and you fetch boxes by label — you can't edit one page inside a box, you replace the whole box.

### How it works
| | EBS | EFS | S3 |
|---|---|---|---|
| Type | block device | network file system (NFSv4) | object store (HTTP API) |
| Attach | one instance (Multi-Attach only for io1/io2 with cluster-aware FS) | thousands of instances, many AZs | anything with credentials/network |
| Scope | single AZ | regional (multi-AZ) | regional (copies across ≥ 3 AZs) |
| Latency | sub-ms (gp3, io2) | ~ms | tens of ms |
| Durability | 99.8–99.999% (io2 Block Express) per year; snapshot to S3 for backups | 11 nines (regional) | **99.999999999%** (11 nines) |
| Consistency | like a local disk | close-to-open NFS semantics | **strong read-after-write** for PUTs, overwrites, deletes and LISTs |
| Scaling / price | provisioned size and IOPS (gp3 baseline 3,000 IOPS) | elastic, pay per GB used (more expensive) | elastic, cheapest per GB, storage classes |
| Use | boot volumes, databases, low-latency apps | shared content, home directories, legacy apps needing a FS | backups, data lakes, static assets, logs, media |

- **Instance store** (NVMe on the host) is fastest but **ephemeral** — lost on stop/terminate.
- S3 objects are **immutable** — update = rewrite the whole object; no file locks or appends (use DynamoDB/a DB for coordination).
- **FSx** offers managed Lustre, NetApp ONTAP, Windows File Server, OpenZFS for special needs.

#### Modern C++ example — choosing a storage service from workload requirements
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Need { std::string what; bool shared_by_many, needs_posix, low_latency_random_io, huge_and_cheap, http_access; };

std::string choose(const Need& n) {
    if (n.huge_and_cheap || n.http_access) return "S3 (objects, 11 nines, lifecycle to cheaper classes)";
    if (n.shared_by_many && n.needs_posix) return "EFS (shared NFS across AZs)";
    if (n.low_latency_random_io) return "EBS gp3/io2 (block, single AZ; snapshot for backup)";
    return "EBS gp3";
}

int main() {
    std::vector<Need> needs{
        {"PostgreSQL data directory on EC2", false, true, true, false, false},
        {"user-uploaded photos served via CDN", true, false, false, true, true},
        {"shared WordPress uploads across 6 instances", true, true, false, false, false},
        {"10 TB of logs kept for 1 year", false, false, false, true, false},
        {"OS boot volume", false, true, false, false, false},
    };
    for (auto& n : needs) std::cout << std::left << std::setw(46) << n.what << "-> " << choose(n) << '\n';
}
```

**Output:**
```text
PostgreSQL data directory on EC2              -> EBS gp3/io2 (block, single AZ; snapshot for backup)
user-uploaded photos served via CDN           -> S3 (objects, 11 nines, lifecycle to cheaper classes)
shared WordPress uploads across 6 instances   -> EFS (shared NFS across AZs)
10 TB of logs kept for 1 year                 -> S3 (objects, 11 nines, lifecycle to cheaper classes)
OS boot volume                                -> EBS gp3
```

### Interview answer
"EBS is a block volume for one instance in one AZ with sub-millisecond latency — boot disks and self-managed databases — backed up with snapshots. EFS is a regional NFS file system many instances share, for workloads that need POSIX semantics. S3 is regional object storage with eleven nines of durability, strong read-after-write consistency, cheap storage classes and HTTP access — the default for backups, data lakes, uploads and static assets, as long as I don't need in-place edits, appends or file locks."

---

## 3. ElastiCache/Redis: cache invalidation, eviction, and replication

**In one sentence:** **ElastiCache** (Redis OSS / **Valkey** / Memcached) is a managed in-memory store used as a **cache** (cache-aside, write-through), session store, rate limiter or leaderboard; you need a strategy for **invalidation** (TTLs, delete-on-write, versioned keys), an **eviction policy** for when memory fills, and **replication** (primary + replicas, Multi-AZ failover, cluster mode sharding) for availability and scale.

### In plain words
A notepad next to the phone with the numbers you call most. It's fast, but numbers change (invalidation), the notepad has limited pages (eviction), and you keep a photocopy in case you lose it (replication).

### How it works
**Patterns** ([details](../System%20Design/Caching-Strategies.md)): **cache-aside** (read: cache → on miss load DB and `SET` with TTL; write: update DB then **delete** the key), write-through, write-behind.

**Invalidation strategies**
- **TTL** on every key (+ random jitter to avoid synchronized expiry).
- **Delete on write** (not update — avoids racing writers leaving stale values); for strict cases, versioned keys (`user:42:v17`).
- **Stampede protection:** request coalescing / a short lock per key, or early refresh before expiry.
- Events: invalidate from change-data-capture (DynamoDB Streams, Debezium) for multi-writer systems.

**Eviction (`maxmemory-policy`):** `allkeys-lru` (typical cache), `allkeys-lfu` (skewed popularity), `volatile-lru`/`volatile-ttl` (only keys with TTLs), `noeviction` (writes fail when full — for data you can't lose, but then it's not just a cache). Monitor `evictions` and memory.

**Replication & scaling**
- **Primary + up to 5 replicas** per shard; **Multi-AZ automatic failover** promotes a replica (async replication → a few writes can be lost).
- **Cluster mode:** data sharded across up to 500 shards by **hash slots** (16,384); scale out writes and memory.
- Reads from replicas are **eventually consistent**.
- **ElastiCache Serverless** removes capacity planning. Use TLS in transit, AUTH/RBAC, and keep it in private subnets.

#### Modern C++ example — cache-aside with TTL + jitter, delete-on-write, and LRU eviction
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <list>
#include <map>
#include <optional>
#include <random>
#include <string>
#include <unordered_map>

class LruCache {                                            // allkeys-lru with TTL
public:
    explicit LruCache(std::size_t cap) : cap_(cap) {}
    std::optional<std::string> get(const std::string& k, int now) {
        auto it = map_.find(k);
        if (it == map_.end()) return std::nullopt;
        if (it->second->expires <= now) { order_.erase(it->second); map_.erase(it); return std::nullopt; }   // expired
        order_.splice(order_.begin(), order_, it->second);
        return it->second->value;
    }
    void set(const std::string& k, std::string v, int now, int ttl) {
        del(k);
        if (map_.size() == cap_) { std::cout << "    evict " << order_.back().key << '\n'; map_.erase(order_.back().key); order_.pop_back(); ++evictions; }
        order_.push_front({k, std::move(v), now + ttl});
        map_[k] = order_.begin();
    }
    void del(const std::string& k) { if (auto it = map_.find(k); it != map_.end()) { order_.erase(it->second); map_.erase(it); } }
    int evictions = 0;
private:
    struct Entry { std::string key, value; int expires; };
    std::size_t cap_;
    std::list<Entry> order_;
    std::unordered_map<std::string, std::list<Entry>::iterator> map_;
};

int main() {
    std::map<std::string, std::string> db{{"user:1", "Mona"}, {"user:2", "Omar"}, {"user:3", "Lina"}, {"user:4", "Ali"}};
    LruCache cache(3);
    std::mt19937 rng(1);
    int db_reads = 0;
    auto read = [&](const std::string& k, int now) {                  // cache-aside
        if (auto v = cache.get(k, now)) return *v + " (hit)";
        ++db_reads;
        int ttl = 300 + std::uniform_int_distribution<int>(0, 60)(rng);  // TTL + jitter
        cache.set(k, db[k], now, ttl);
        return db[k] + " (miss -> DB)";
    };
    auto write = [&](const std::string& k, const std::string& v) { db[k] = v; cache.del(k); };   // update DB, then DELETE the key

    std::cout << read("user:1", 0) << '\n' << read("user:1", 5) << '\n';
    write("user:1", "Mona A.");
    std::cout << read("user:1", 10) << "  (no stale value after the write)\n";
    std::cout << read("user:2", 11) << '\n' << read("user:3", 12) << '\n';
    std::cout << "  reading user:4 into a full cache:\n" << read("user:4", 13) << '\n';
    std::cout << read("user:3", 400) << "  (TTL expired)\n";
    std::cout << "DB reads: " << db_reads << ", evictions: " << cache.evictions << '\n';
}
```

**Output:**
```text
Mona (miss -> DB)
Mona (hit)
Mona A. (miss -> DB)  (no stale value after the write)
Omar (miss -> DB)
Lina (miss -> DB)
  reading user:4 into a full cache:
    evict user:1
Ali (miss -> DB)
Lina (miss -> DB)  (TTL expired)
DB reads: 6, evictions: 1
```

### Interview answer
"I use ElastiCache Redis or Valkey mostly as a cache-aside layer: read from the cache, on a miss load from the database and set with a TTL plus jitter, and on writes update the database and delete the key rather than updating it, with request coalescing to prevent stampedes. When memory fills, an eviction policy like allkeys-lru or allkeys-lfu removes keys, and I alert on evictions. For availability I run a primary with replicas across AZs and automatic failover — replication is asynchronous, so it's a cache, not the source of truth — and cluster mode shards hash slots to scale writes."

---

## 4. RDS/Aurora: backups, replicas, failover, and connection pooling

**In one sentence:** **RDS** runs managed MySQL/PostgreSQL/MariaDB/Oracle/SQL Server with automated **backups and point-in-time recovery**, **Multi-AZ** standby **failover**, and **read replicas**; **Aurora** re-architects MySQL/PostgreSQL on a distributed storage layer (6 copies across 3 AZs) for faster failover and up to 15 low-lag replicas; and because each database connection is expensive, use **connection pooling** (RDS Proxy, PgBouncer) — especially with Lambda.

### In plain words
A managed restaurant kitchen: the company does the cleaning, backups of recipes, and has a second kitchen ready next door (Multi-AZ). Extra counters can serve pre-cooked dishes to many customers (read replicas). But the head chef can only talk to so many waiters at once — so waiters share a few runners (connection pool).

### How it works
**Backups:** automated daily snapshots + transaction logs → **point-in-time recovery** to any second in the retention window (1–35 days); manual snapshots kept until deleted; copy snapshots cross-region/account for DR; **restore = a new instance** (test the time it takes!).

**Availability & scaling**
| | RDS Multi-AZ (instance) | RDS Multi-AZ DB cluster | Aurora |
|---|---|---|---|
| Standby | 1 synchronous standby, not readable | 2 readable standbys | shared storage, up to 15 replicas |
| Failover | ~60–120 s | ~35 s | typically < 30 s |
| Storage | EBS per instance | per instance | 6 copies across 3 AZs, auto-grows to 128 TiB |

- **Read replicas** (async): scale reads, analytics, cross-region DR; **replica lag** means stale reads — read-your-writes requests go to the primary.
- **Aurora Global Database:** cross-region replication with ~1 s lag; **Aurora Serverless v2** scales capacity automatically.
- **Failover:** apps use the **cluster/writer endpoint DNS** and must **retry** on connection errors; keep DNS TTLs low; drivers like the AWS Advanced JDBC Wrapper speed up failover detection.

**Connection pooling**
- Each PostgreSQL connection is a process (~several MB); `max_connections` is limited by instance memory.
- 500 Lambda environments × 1 connection each can exhaust the DB. **RDS Proxy** pools and multiplexes connections, holds them during failover, and supports IAM auth; or run **PgBouncer** (transaction pooling).
- Pool size rule of thumb (per HikariCP): connections ≈ (CPU cores × 2) + effective spindles — **more connections don't mean more throughput**.

#### Modern C++ example — connection exhaustion without a pool vs. with a proxy, and replica-lag-aware routing
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>

int main() {
    const int max_connections = 400;                          // e.g. a db.r6g.large-ish PostgreSQL
    for (int lambdas : {200, 400, 1200}) {
        int direct = lambdas;                                  // each environment opens its own connection
        int via_proxy = std::min(lambdas, 60);                 // proxy multiplexes onto a 60-connection pool
        std::cout << lambdas << " concurrent Lambdas: direct " << direct << " conns -> "
                  << (direct > max_connections ? "'too many connections' errors" : "ok")
                  << " | via RDS Proxy " << via_proxy << " DB conns -> ok\n";
    }

    // Read routing: replicas are async; send read-your-writes traffic to the writer.
    double replica_lag_ms = 850;
    auto route = [&](const std::string& query, bool just_wrote) {
        if (just_wrote || replica_lag_ms > 1000) return query + " -> writer endpoint";
        return query + " -> reader endpoint (may be " + std::to_string(static_cast<int>(replica_lag_ms)) + " ms stale)";
    };
    std::cout << route("GET /orders (dashboard)", false) << '\n'
              << route("GET /orders/81 right after checkout", true) << '\n';
    replica_lag_ms = 4000;
    std::cout << route("GET /orders (dashboard), lag spike", false) << '\n';
}
```

**Output:**
```text
200 concurrent Lambdas: direct 200 conns -> ok | via RDS Proxy 60 DB conns -> ok
400 concurrent Lambdas: direct 400 conns -> ok | via RDS Proxy 60 DB conns -> ok
1200 concurrent Lambdas: direct 1200 conns -> 'too many connections' errors | via RDS Proxy 60 DB conns -> ok
GET /orders (dashboard) -> reader endpoint (may be 850 ms stale)
GET /orders/81 right after checkout -> writer endpoint
GET /orders (dashboard), lag spike -> writer endpoint
```

### Interview answer
"RDS gives managed relational databases with automated backups and point-in-time recovery, Multi-AZ synchronous standbys for failover in a minute or two, and asynchronous read replicas for scaling reads — with lag, so read-your-writes goes to the primary. Aurora uses distributed storage with six copies across three AZs, failover usually under 30 seconds, up to 15 replicas, Global Database and Serverless v2. Apps connect through cluster endpoints and retry on failover. Since connections are expensive, I pool them with RDS Proxy or PgBouncer — essential with Lambda — and size pools small, because more connections don't mean more throughput."

---

## 5. S3: object versioning, encryption, lifecycle policies, and presigned URLs

**In one sentence:** protect and manage S3 data with **versioning** (keep every version; deletes become delete markers), **encryption** (SSE-S3 by default, **SSE-KMS** for key control and auditing), **lifecycle policies** (move to cheaper storage classes, expire old versions), **Block Public Access**, and grant temporary access with **presigned URLs** instead of making buckets public.

### In plain words
A photo archive: every edit is kept as a new copy (versioning), the archive is locked (encryption), old photos move to the cheaper basement after a year (lifecycle), and when a friend needs one photo you give them a ticket valid for 15 minutes (presigned URL) instead of the keys to the archive.

### How it works
- **Versioning:** protects against overwrites and deletes; combine with **MFA Delete** or **Object Lock** (WORM, governance/compliance modes) for ransomware protection; lifecycle rules must clean up **noncurrent versions** or costs grow.
- **Encryption:** all new objects are encrypted with **SSE-S3** by default (since January 2023); **SSE-KMS** adds key policies, CloudTrail audit of every decrypt, and per-tenant keys (enable **S3 Bucket Keys** to cut KMS costs); DSSE-KMS for dual-layer; client-side encryption for end-to-end. Enforce TLS with `aws:SecureTransport` in the bucket policy.
- **Access control:** **Block Public Access** on (account level), bucket policies + IAM, **Object Ownership = bucket owner enforced** (ACLs disabled), **CloudFront Origin Access Control** for public websites instead of public buckets, VPC endpoint policies.
- **Storage classes & lifecycle:** Standard → Standard-IA (30 days) → Glacier Instant/Flexible Retrieval → Deep Archive; **Intelligent-Tiering** for unknown access patterns; expire temp files and incomplete multipart uploads.
- **Presigned URLs:** a URL signed with your credentials (SigV4) allowing one operation (GET/PUT) on one key until an expiry (max 7 days with IAM user keys; shorter with role credentials). Great for direct browser **uploads/downloads** without proxying through your servers; for uploads, constrain size/type with **presigned POST** policies.
- Also: replication (CRR/SRR), event notifications (to Lambda/SQS/EventBridge), access logs, S3 Inventory, multipart upload for large objects.

```json
{
  "Rules": [{
    "ID": "logs-tiering",
    "Filter": { "Prefix": "logs/" },
    "Status": "Enabled",
    "Transitions": [ { "Days": 30, "StorageClass": "STANDARD_IA" }, { "Days": 90, "StorageClass": "GLACIER_IR" } ],
    "NoncurrentVersionExpiration": { "NoncurrentDays": 30 },
    "Expiration": { "Days": 365 },
    "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
  }]
}
```

#### Modern C++ example — versioning with delete markers, a lifecycle cost estimate, and presigned-URL style expiry checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Version { int id; std::string data; bool delete_marker; };

// TOY signature for the presigned URL (real S3: AWS SigV4 = HMAC-SHA256 chain over the canonical request).
std::uint64_t toy_sign(const std::string& secret, const std::string& s) { std::uint64_t h = 1469598103934665603ull; for (unsigned char c : secret + s) { h ^= c; h *= 1099511628211ull; } return h; }

int main() {
    std::map<std::string, std::vector<Version>> bucket;
    int next = 1;
    auto put = [&](const std::string& k, const std::string& d) { bucket[k].push_back({next++, d, false}); };
    auto del = [&](const std::string& k) { bucket[k].push_back({next++, "", true}); };
    auto get = [&](const std::string& k) -> std::string { auto& v = bucket[k]; return v.empty() || v.back().delete_marker ? "404 (latest is a delete marker)" : v.back().data; };
    put("report.pdf", "v1 draft"); put("report.pdf", "v2 final"); del("report.pdf");
    std::cout << "GET report.pdf -> " << get("report.pdf") << '\n';
    bucket["report.pdf"].pop_back();                                     // restore = remove the delete marker
    std::cout << "after removing the delete marker -> " << get("report.pdf") << " (" << bucket["report.pdf"].size() << " versions kept)\n";

    // Lifecycle: 10 TB of logs, 30 days Standard, then IA until day 90, then Glacier IR until day 365 (prices USD/GB-month, illustrative).
    const double gb = 10'000, standard = 0.023, ia = 0.0125, glacier_ir = 0.004;
    double all_standard = gb * standard * 12, tiered = gb * (standard * 1 + ia * 2 + glacier_ir * 9);
    std::cout << std::fixed << std::setprecision(0) << "1-year cost: all Standard ~$" << all_standard << ", with lifecycle ~$" << tiered << '\n';

    const std::string secret = "server-side-credentials";
    auto presign = [&](const std::string& key, long expires) { return std::to_string(expires) + ":" + std::to_string(toy_sign(secret, "GET " + key + " " + std::to_string(expires))); };
    auto check = [&](const std::string& key, const std::string& url, long now) {
        long expires = std::stol(url.substr(0, url.find(':')));
        if (now > expires) return std::string("403 Request has expired");
        if (url != presign(key, expires)) return std::string("403 SignatureDoesNotMatch");
        return std::string("200 OK");
    };
    long now = 1'760'000'000;
    std::string url = presign("invoices/81.pdf", now + 900);             // 15-minute download link
    std::cout << "presigned GET within 15 min: " << check("invoices/81.pdf", url, now + 60) << '\n'
              << "same URL for another key:    " << check("invoices/82.pdf", url, now + 60) << '\n'
              << "after expiry:                " << check("invoices/81.pdf", url, now + 1000) << '\n';
}
```

**Output:**
```text
GET report.pdf -> 404 (latest is a delete marker)
after removing the delete marker -> v2 final (2 versions kept)
1-year cost: all Standard ~$2760, with lifecycle ~$840
presigned GET within 15 min: 200 OK
same URL for another key:    403 SignatureDoesNotMatch
after expiry:                403 Request has expired
```

### Interview answer
"I enable versioning so overwrites and deletes are recoverable — deletes become delete markers — with Object Lock or MFA Delete for ransomware-grade protection and lifecycle rules to expire noncurrent versions. Everything is encrypted by default with SSE-S3; I use SSE-KMS with bucket keys when I need key control and audit, enforce TLS in the bucket policy, keep Block Public Access on and ACLs disabled, and serve public content through CloudFront with Origin Access Control. Lifecycle policies move data to IA and Glacier classes or Intelligent-Tiering and clean up incomplete multipart uploads. For direct browser uploads and downloads I issue short-lived presigned URLs scoped to one key and operation."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| DynamoDB keys | access patterns first; PK spreads, SK orders; single-table with prefixed keys |
| GSI / LSI | other key schema, eventually consistent, own capacity / same PK, created with table |
| Hot partitions | ~1,000 WCU / 3,000 RCU per partition; high-cardinality keys, write sharding, DAX |
| Capacity | on-demand (spiky/new) vs. provisioned + auto scaling (steady) |
| DynamoDB extras | conditional writes, transactions, TTL, Streams, 400 KB items, avoid Scan |
| EBS / EFS / S3 | block single-AZ / shared NFS multi-AZ / objects, 11 nines, strong consistency |
| Instance store | fastest, ephemeral |
| Redis caching | cache-aside, TTL + jitter, delete on write, stampede protection |
| Eviction | allkeys-lru / allkeys-lfu / volatile-* / noeviction; watch the evictions metric |
| Redis HA | primary + replicas, Multi-AZ failover (async), cluster mode hash slots |
| RDS backups | automated + PITR (1–35 days), cross-region snapshot copies, restore = new instance |
| RDS HA | Multi-AZ standby (~1–2 min failover) · read replicas (async, lag) |
| Aurora | 6 copies / 3 AZs, < 30 s failover, 15 replicas, Global DB, Serverless v2 |
| Connections | RDS Proxy / PgBouncer, small pools, essential for Lambda |
| S3 protection | versioning + Object Lock/MFA Delete; Block Public Access; ACLs off; CloudFront OAC |
| S3 encryption | SSE-S3 default; SSE-KMS + bucket keys for control/audit; enforce TLS |
| S3 lifecycle | Standard → IA → Glacier; Intelligent-Tiering; expire noncurrent versions + incomplete uploads |
| Presigned URLs | one key, one operation, short expiry; presigned POST to constrain uploads |
