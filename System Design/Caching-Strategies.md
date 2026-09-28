# Caching Strategies — Cache-Aside, Write-Through, Write-Behind and Stampede Prevention

> **What you'll learn:** what a cache is and the vocabulary around it (hits, misses, TTL, eviction, invalidation), the three classic strategies for keeping a cache and a database together — **cache-aside, write-through, write-behind** — and how to prevent a **cache stampede**. Each comes with a runnable C++ model that counts database calls so you can *see* the difference.
>
> **Prerequisites:** none. Helpful: [Key-value stores / Redis](../Databases/NoSQL.md#2-key-value).
>
> This page covers the caching items in both **System Design → Microservices** and **System Architecture → Caching strategies**.

## Table of Contents
0. [Caching basics](#0-caching-basics)
1. [Cache aside](#1-cache-aside)
2. [Write-through caching](#2-write-through-caching)
3. [Write-behind caching](#3-write-behind-caching)
4. [Cache stampede prevention](#4-cache-stampede-prevention)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Caching basics

**In one sentence:** a cache is a small, **fast** storage layer that keeps copies of frequently used data so future requests don't have to go to the slower original source.

### In plain words
You keep a glass of water on your desk instead of walking to the kitchen every time you're thirsty. The glass (cache) is small and close; the kitchen (database) is big and far. Two problems appear: the glass runs out (**eviction** — what do you keep?) and the water can get **stale** (**invalidation** — when do you refresh it?). There's a famous joke: *"There are only two hard things in computer science: cache invalidation and naming things."*

### How it works
- **Hit:** data found in the cache (fast). **Miss:** not found → fetch from the source (slow). **Hit ratio** = hits / total — the key metric.
- Where caches live: CPU caches, browser cache, CDN ([CDNs](./Microservices-Explained.md#52-content-delivery-networks-cdns)), reverse proxy (Varnish/NGINX), **application cache** (in-process map, or a shared cache like **Redis/Memcached**), database buffer pool.
- **TTL (time to live):** entries expire after a time — simple bound on staleness.
- **Eviction policies** when full: **LRU** (least recently used — most common), **LFU** (least frequently used), FIFO, random. (An LRU cache — hash map + linked list — is a classic coding question; see [page replacement](../Operating%20Systems/Memory-Management.md#1-page-replacement-algorithms-fifo-lru-clock-optimal).)
- **Invalidation:** on write, delete or update the cached entry; or rely on TTL; or broadcast invalidations (pub/sub, change-data-capture).
- What to cache: data read often and changed rarely; expensive computations; sessions. Don't cache what must always be exactly current (account balance at payment time) without careful design.

---

## 1. Cache aside

**In one sentence:** in **cache-aside** (lazy loading), the **application** checks the cache first; on a miss it reads the database and **puts the result in the cache**; on writes it updates the database and **invalidates** the cache entry.

### In plain words
Before walking to the kitchen, you check your desk. If the glass is empty, you go to the kitchen, drink, and **refill the glass on your way back** so next time it's there. When someone changes the water supply (a write), you **pour out your glass** so you don't drink the old water.

### How it works
```
READ:  value = cache.get(key)
       if miss:  value = db.read(key);  cache.set(key, value, ttl)
WRITE: db.write(key, value);  cache.delete(key)      // delete, not update (avoids races)
```
- ✅ Only data that's actually requested gets cached; a cache failure isn't fatal (fall back to the DB).
- ❌ First request for each key is slow (**cold cache**); the data can be stale until TTL/invalidation; three round trips on a miss.
- Why **delete** instead of **set** on write: if two writers race, "set" can leave the older value in the cache; delete + lazy reload is safer. (A small race remains; short TTLs bound it.)
- The **most common** strategy — typical with Redis/Memcached.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <unordered_map>

struct Database {
    std::map<std::string, std::string> rows{{"user:1", "Ana"}, {"user:2", "Ben"}};
    int reads = 0;
    std::string read(const std::string& k) { ++reads; return rows.at(k); }
    void write(const std::string& k, const std::string& v) { rows[k] = v; }
};

class CacheAsideRepo {
public:
    explicit CacheAsideRepo(Database& db) : db_(db) {}
    std::string get(const std::string& key) {
        if (auto it = cache_.find(key); it != cache_.end()) return it->second;   // HIT
        std::string value = db_.read(key);                                        // MISS -> DB
        cache_[key] = value;                                                      // populate lazily
        return value;
    }
    void update(const std::string& key, const std::string& value) {
        db_.write(key, value);                                                    // DB is the source of truth
        cache_.erase(key);                                                        // invalidate
    }
private:
    Database& db_;
    std::unordered_map<std::string, std::string> cache_;
};

int main() {
    Database db;
    CacheAsideRepo repo(db);
    for (int i = 0; i < 100; ++i) repo.get("user:1");                  // 100 reads of a hot key
    std::cout << "100 reads -> DB reads: " << db.reads << '\n';
    repo.update("user:1", "Ana Silva");
    std::cout << "after update, read: " << repo.get("user:1") << " (DB reads: " << db.reads << ")\n";
}
```

**Output:**
```text
100 reads -> DB reads: 1
after update, read: Ana Silva (DB reads: 2)
```

### Interview answer
"In cache-aside the application reads the cache, and on a miss loads from the database and populates the cache with a TTL; writes go to the database and invalidate the cache key. It caches only what's used and tolerates cache outages, but has cold-start misses and possible staleness, and deleting rather than updating on write avoids most races."

---

## 2. Write-through caching

**In one sentence:** in **write-through**, every write goes to the **cache and the database together** (synchronously), so the cache is always up to date.

### In plain words
Every time you update your address book, you **also** update the sticky note on your fridge immediately. The fridge note is never out of date — but every update takes a little longer because you write in two places.

### How it works
```
WRITE: cache.set(key, value);  db.write(key, value);   // both, before acknowledging
READ:  value = cache.get(key)   // usually a hit; on miss, load from DB (often combined with cache-aside)
```
- ✅ Cache and DB stay consistent; reads right after writes are fast and fresh.
- ❌ Higher write latency (two writes); the cache fills with data that may **never be read** (use TTLs); if one of the two writes fails you need handling (write DB first, or use transactions/retries).
- Often provided by the caching layer itself ("read-through/write-through" caches such as some DAX/Hazelcast setups).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>

struct Database {
    std::map<std::string, int> rows;
    int writes = 0, reads = 0;
    void write(const std::string& k, int v) { ++writes; rows[k] = v; }
    int read(const std::string& k) { ++reads; return rows.at(k); }
};

class WriteThroughCache {
public:
    explicit WriteThroughCache(Database& db) : db_(db) {}
    void put(const std::string& k, int v) {
        db_.write(k, v);          // write to the source of truth...
        cache_[k] = v;            // ...and to the cache, before returning (synchronous)
    }
    int get(const std::string& k) {
        if (auto it = cache_.find(k); it != cache_.end()) return it->second;
        return cache_[k] = db_.read(k);
    }
private:
    Database& db_;
    std::map<std::string, int> cache_;
};

int main() {
    Database db;
    WriteThroughCache cache(db);
    cache.put("stock:pen", 100);
    cache.put("stock:pen", 99);
    std::cout << "read right after write: " << cache.get("stock:pen") << '\n';
    std::cout << "DB writes: " << db.writes << ", DB reads: " << db.reads << "  (cache always fresh)\n";
}
```

**Output:**
```text
read right after write: 99
DB writes: 2, DB reads: 0  (cache always fresh)
```

### Interview answer
"Write-through writes to the cache and the backing store synchronously on every update, keeping them consistent so subsequent reads hit fresh data. The costs are higher write latency and caching data that may never be read, which TTLs mitigate; it's often paired with read-through or cache-aside loading."

---

## 3. Write-behind caching

**In one sentence:** in **write-behind** (write-back), writes go **only to the cache** and are acknowledged immediately; the cache **flushes them to the database later**, asynchronously and often in batches.

### In plain words
A waiter writes orders on a notepad and only enters them into the restaurant's computer system **every 10 minutes**, in one go. Customers are served fast, and the computer isn't interrupted constantly — but if the waiter loses the notepad before entering the orders, those orders are **gone**.

### How it works
```
WRITE: cache.set(key, value); dirty_queue.push(key); return   // fast
LATER: flush worker: batch = dirty_queue.drain(); db.write_many(batch)
```
- ✅ Very fast writes; the DB sees fewer, **batched and coalesced** writes (10 updates to the same key → 1 DB write); absorbs write spikes.
- ❌ **Risk of data loss** if the cache crashes before flushing; the DB is temporarily behind (other readers of the DB see old data); more complex (ordering, retries, failures).
- Used for: counters/metrics, view counts, likes, gaming state, analytics — data where losing a few seconds is acceptable. Also how OS page caches and CPU caches work internally.
- Mitigations: replicate the cache, persist the queue (append-only log), flush frequently.

### Modern C++ example — batching, coalescing, and the crash risk
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

struct Database {
    std::map<std::string, int> rows;
    int write_calls = 0;
    void write_batch(const std::map<std::string, int>& batch) { ++write_calls; for (auto& [k, v] : batch) rows[k] = v; }
};

class WriteBehindCache {
public:
    explicit WriteBehindCache(Database& db) : db_(db) {}
    void put(const std::string& k, int v) { cache_[k] = v; dirty_.insert(k); }   // returns immediately
    void flush() {                                                                // runs periodically
        if (dirty_.empty()) return;
        std::map<std::string, int> batch;
        for (const auto& k : dirty_) batch[k] = cache_[k];                         // latest value only (coalesced)
        db_.write_batch(batch);
        dirty_.clear();
    }
    void crash() { cache_.clear(); dirty_.clear(); }                               // unflushed writes are lost
private:
    Database& db_;
    std::map<std::string, int> cache_;
    std::set<std::string> dirty_;
};

int main() {
    Database db;
    WriteBehindCache cache(db);
    for (int i = 1; i <= 1000; ++i) cache.put("views:video42", i);   // 1000 fast writes
    cache.put("views:video7", 5);
    cache.flush();
    std::cout << "1001 writes -> " << db.write_calls << " DB call; views:video42 = " << db.rows["views:video42"] << '\n';

    cache.put("views:video42", 1500);                                 // not flushed yet...
    cache.crash();
    std::cout << "after crash, DB still has " << db.rows["views:video42"] << " (500 views lost)\n";
}
```

**Output:**
```text
1001 writes -> 1 DB call; views:video42 = 1000
after crash, DB still has 1000 (500 views lost)
```

### Interview answer
"Write-behind acknowledges writes once they're in the cache and persists them to the database asynchronously, often batched and coalesced, which gives low write latency and reduces database load. The trade-offs are possible data loss if the cache fails before flushing and temporary inconsistency with the database, so it suits counters and analytics rather than financial data, or needs a replicated, persistent write queue."

---

## 4. Cache stampede prevention

**In one sentence:** a **cache stampede** (thundering herd, dog-pile) happens when a popular cache entry expires and **many requests miss at the same time and all hit the database at once** — prevention makes sure only **one** request recomputes the value.

### In plain words
A popular bakery sells out of its famous croissant. At that moment 500 customers all run to the single baker at once, the baker is overwhelmed and bakes nothing. A better rule: **one** customer asks for a new batch while everyone else waits a minute (or takes yesterday's croissant). Even better: the baker starts a new batch **before** the tray is empty.

### How it works
Why it happens: a hot key with a TTL expires → thousands of concurrent misses → thousands of identical expensive DB queries → the DB slows → requests time out → retries make it worse.

Techniques (often combined):
| Technique | Idea |
|---|---|
| **Locking / request coalescing ("single flight")** | The first miss takes a lock (per key; a Redis `SET key:lock NX PX` for distributed setups) and recomputes; others **wait** for its result or serve stale data |
| **Stale-while-revalidate** | Keep serving the old value past its soft TTL while **one** background task refreshes it |
| **Probabilistic early expiration (XFetch)** | Each request, near expiry, refreshes early with a small probability — so a refresh happens *before* the mass expiry |
| **TTL jitter** | Add randomness to TTLs (e.g. 300 s ± 10%) so many keys don't expire at the same instant |
| **Pre-warming / refresh-ahead** | Recompute hot keys on a schedule before they expire; warm caches after deploys |
| **Negative caching** | Cache "not found" too, so repeated misses for missing keys don't hit the DB |

### Modern C++ example — 50 concurrent misses: naive vs. single-flight
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <chrono>
#include <future>
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <string>
#include <thread>
#include <vector>

using namespace std::chrono_literals;

std::atomic<int> db_queries = 0;
std::string expensive_db_query(const std::string& key) {
    ++db_queries;
    std::this_thread::sleep_for(50ms);                      // slow query
    return "value of " + key;
}

// NAIVE: every miss queries the DB
class NaiveCache {
public:
    std::string get(const std::string& key) {
        { std::scoped_lock l(m_); if (auto it = data_.find(key); it != data_.end()) return it->second; }
        std::string v = expensive_db_query(key);             // everyone who missed runs this
        std::scoped_lock l(m_);
        return data_[key] = v;
    }
private:
    std::mutex m_;
    std::map<std::string, std::string> data_;
};

// SINGLE-FLIGHT: the first miss computes; concurrent misses wait for the same future
class SingleFlightCache {
public:
    std::string get(const std::string& key) {
        std::shared_future<std::string> result;
        bool i_compute = false;
        std::promise<std::string> promise;
        {
            std::scoped_lock l(m_);
            if (auto it = data_.find(key); it != data_.end()) return it->second;
            if (auto it = in_flight_.find(key); it != in_flight_.end()) result = it->second;   // join
            else { result = promise.get_future().share(); in_flight_[key] = result; i_compute = true; }
        }
        if (i_compute) {
            std::string v = expensive_db_query(key);
            {
                std::scoped_lock l(m_);
                data_[key] = v;
                in_flight_.erase(key);
            }
            promise.set_value(v);
        }
        return result.get();
    }
private:
    std::mutex m_;
    std::map<std::string, std::string> data_;
    std::map<std::string, std::shared_future<std::string>> in_flight_;
};

template <class Cache>
int stampede(Cache& cache) {
    db_queries = 0;
    {
        std::vector<std::jthread> requests;
        for (int i = 0; i < 50; ++i) requests.emplace_back([&] { (void)cache.get("homepage"); });
    }
    return db_queries;
}

int main() {
    NaiveCache naive;
    SingleFlightCache single;
    std::cout << "50 simultaneous misses, naive cache:         " << stampede(naive) << " DB queries\n";
    std::cout << "50 simultaneous misses, single-flight cache: " << stampede(single) << " DB query\n";
}
```

**Output (may vary):**
```text
50 simultaneous misses, naive cache:         50 DB queries
50 simultaneous misses, single-flight cache: 1 DB query
```
(The naive number depends on thread timing but is typically close to 50; the single-flight number is always 1.)

### Modern C++ example — probabilistic early expiration (XFetch)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iostream>
#include <random>

// XFetch (Vattani et al.): refresh early with a probability that grows as expiry approaches.
// recompute_cost = how long a recompute takes (seconds); beta > 1 = refresh earlier.
bool should_refresh_early(double now, double expiry, double recompute_cost, double beta, std::mt19937& rng) {
    std::uniform_real_distribution<double> u(0.0, 1.0);
    return now - recompute_cost * beta * std::log(u(rng)) >= expiry;   // -log(u) is a positive random number
}

int main() {
    std::mt19937 rng(1);
    const double expiry = 300, cost = 2, beta = 1;
    for (double seconds_left : {60.0, 10.0, 3.0, 1.0}) {
        int refreshes = 0;
        for (int i = 0; i < 10'000; ++i)                         // 10k requests at this moment
            refreshes += should_refresh_early(expiry - seconds_left, expiry, cost, beta, rng);
        std::cout << seconds_left << "s before expiry: " << refreshes / 100.0 << "% of requests trigger a refresh\n";
    }
}
```

**Output (may vary):**
```text
60s before expiry: 0% of requests trigger a refresh
10s before expiry: 0.72% of requests trigger a refresh
3s before expiry: 22.34% of requests trigger a refresh
1s before expiry: 61.29% of requests trigger a refresh
```
Far from expiry nobody refreshes; close to expiry a *few* requests refresh early, so the value is renewed before the mass expiry moment — without any locks.

### Interview answer
"A cache stampede occurs when a hot key expires and many concurrent misses hit the backing store at once. I prevent it with request coalescing — a per-key lock or single-flight so one request recomputes while others wait or get stale data — stale-while-revalidate, probabilistic early expiration like XFetch, TTL jitter to desynchronize expirations, and pre-warming hot keys."

---

## Cheat sheet

| Strategy | Read path | Write path | Pros | Cons |
|---|---|---|---|---|
| Cache-aside | App checks cache → DB on miss → populate | Write DB, **delete** cache key | Simple, resilient, caches only what's used | Cold misses, possible staleness |
| Write-through | Cache (fresh) | Cache **and** DB synchronously | Consistent, fresh reads | Slower writes, caches unread data |
| Write-behind | Cache | Cache now, DB **later** (batched) | Fastest writes, fewer DB writes | Data loss risk, DB lags |
| Stampede prevention | — | — | Single-flight/locks, stale-while-revalidate, XFetch, TTL jitter, pre-warm | Some complexity |
