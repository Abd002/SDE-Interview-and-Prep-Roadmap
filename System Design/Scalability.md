# Scalability — Replication, Partitioning, Consistent Hashing and Auto-scaling

> **What you'll learn:** what "scalability" means (vertical vs. horizontal scaling), the two fundamental ways to spread data across machines — **replication vs. partitioning** — how **consistent hashing** lets you add or remove servers without reshuffling everything, and how **auto-scaling** adds capacity automatically. Every idea has a C++ simulation.
>
> **Prerequisites:** none. Helpful: [Database Indexing](../Databases/Indexing.md), [NoSQL](../Databases/NoSQL.md).

## Table of Contents
0. [What is scalability?](#0-what-is-scalability)
1. [Replication vs. Partitioning](#1-replication-vs-partitioning)
2. [Consistent Hashing](#2-consistent-hashing)
3. [Auto-scaling](#3-auto-scaling)
4. [Cheat sheet](#cheat-sheet)

---

## 0. What is scalability?

**In one sentence:** scalability is a system's ability to handle **more load** (users, requests, data) by adding resources, while keeping performance acceptable.

### In plain words
A food truck serving 50 customers an hour becomes famous and now has 500. Options:
- **Scale up (vertical):** buy a bigger truck with a bigger grill. Simple — but there's a biggest truck you can buy, it's expensive, and if it breaks down you serve nobody.
- **Scale out (horizontal):** run **ten** trucks. Nearly unlimited, and one broken truck isn't a disaster — but now you need to coordinate them: who serves which customer, how do they share recipes and stock?

### How it works
| | Vertical scaling (scale up) | Horizontal scaling (scale out) |
|---|---|---|
| How | Bigger machine (CPU, RAM, disk) | More machines |
| Limit | Hardware ceiling | Practically none |
| Complexity | Low (no code changes) | Higher (distribution, coordination) |
| Failure | Single point of failure | Redundancy built in |
| Cost curve | Gets very expensive at the top | Commodity hardware, linear-ish |

Keys to horizontal scaling:
- **Stateless application servers** — keep session state in a shared store (Redis, DB, tokens), so any server can handle any request and a **load balancer** can spread traffic ([Load balancing](./Microservices-Explained.md#5-load-balancing)).
- **Scale the data layer** with **replication** and **partitioning** (below) and **caching** ([Caching Strategies](./Caching-Strategies.md)).
- **Asynchronous work** through queues ([Message Queuing](../System%20Architecture/Message-Queuing.md)).

Measure scalability with **throughput** (requests/sec) and **latency percentiles** (p50, p99) as load grows.

---

## 1. Replication vs. Partitioning

**In one sentence:** **replication** keeps **copies of the same data** on several machines (for availability and read capacity); **partitioning** (sharding) **splits the data** so each machine holds only part of it (for write capacity and storage).

### In plain words
- **Replication = photocopies of the whole phone book** in every branch office. Anyone can look up any number locally, and if one office burns down the others still have the book. But every *change* must be copied to all offices, and the book must still fit in one office.
- **Partitioning = splitting the phone book into volumes**: A–F in office 1, G–M in office 2, … Each office stores and updates only its part, so together they can hold a book too big for any single office. But a lookup must go to the *right* office, and losing an office loses that volume — unless each volume is **also** replicated.

Real systems do **both**: data is partitioned, and each partition is replicated (e.g. 3 copies).

### How it works
**Replication**
| Style | How | Trade-off |
|---|---|---|
| **Leader–follower** (primary–replica) | All writes go to the leader; followers copy its log and serve reads | Simple; leader is a write bottleneck; **replication lag** → stale reads |
| **Multi-leader** | Several nodes accept writes (e.g. one per region) | Write anywhere; must resolve **conflicts** |
| **Leaderless** (Dynamo-style: Cassandra, DynamoDB) | Client writes to W of N replicas and reads from R; if **R + W > N** reads overlap the latest write | Highly available; tunable consistency |

- **Synchronous** replication: wait for replicas before confirming → no data loss, slower. **Asynchronous**: confirm immediately → fast, but a leader crash can lose recent writes.
- **Read-your-own-writes:** after updating your profile you read from a lagging replica and see the old value — route such reads to the leader.

**Partitioning (sharding)**
| Strategy | How | Pros | Cons |
|---|---|---|---|
| **Range** | Key ranges: A–F, G–M… or dates | Efficient range scans | **Hot spots** (e.g. all today's writes hit one shard) |
| **Hash** | `hash(key) % N` | Even spread | Range queries hit all shards; **changing N moves almost every key** (→ consistent hashing) |
| **Directory / lookup** | A table maps key → shard | Flexible moves | Lookup service is extra infrastructure |
| **Geographic / tenant** | By region or customer | Data locality, compliance | Uneven sizes |

Partitioning challenges: choosing a **shard key** that spreads load and matches queries, **cross-shard queries/joins/transactions**, **rebalancing** when adding shards, and **hot keys** (a celebrity's account).

### Modern C++ example — leader–follower replication with lag, and hash partitioning
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

// ---------- Replication: one leader, followers apply the leader's log later ----------
struct Replica { std::map<std::string, std::string> data; std::size_t applied = 0; };

class ReplicatedStore {
public:
    explicit ReplicatedStore(int followers) : followers_(followers) {}
    void write(const std::string& k, const std::string& v) {      // writes go to the leader
        leader_.data[k] = v;
        log_.push_back({k, v});
    }
    void replicate(std::size_t follower) {                          // async: happens "later"
        auto& f = followers_[follower];
        for (; f.applied < log_.size(); ++f.applied) f.data[log_[f.applied].first] = log_[f.applied].second;
    }
    std::string read(std::size_t follower, const std::string& k) {  // reads spread over followers
        auto& d = followers_[follower].data;
        return d.contains(k) ? d[k] : "(not found)";
    }
private:
    Replica leader_;
    std::vector<Replica> followers_;
    std::vector<std::pair<std::string, std::string>> log_;
};

// ---------- Partitioning: each key lives on exactly one shard ----------
class ShardedStore {
public:
    explicit ShardedStore(std::size_t n) : shards_(n) {}
    std::size_t shard_for(const std::string& key) const { return std::hash<std::string>{}(key) % shards_.size(); }
    void write(const std::string& k, const std::string& v) { shards_[shard_for(k)][k] = v; }
    std::vector<std::size_t> sizes() const {
        std::vector<std::size_t> s;
        for (const auto& shard : shards_) s.push_back(shard.size());
        return s;
    }
private:
    std::vector<std::map<std::string, std::string>> shards_;
};

int main() {
    ReplicatedStore db(2);
    db.write("user:1:name", "Ana");
    std::cout << "replica 0 before replication: " << db.read(0, "user:1:name") << "  <- replication lag\n";
    db.replicate(0);
    std::cout << "replica 0 after replication:  " << db.read(0, "user:1:name") << '\n';

    ShardedStore sharded(4);
    for (int i = 0; i < 10'000; ++i) sharded.write("user:" + std::to_string(i), "data");
    std::cout << "keys per shard:";
    std::size_t total = 0;
    for (auto n : sharded.sizes()) { std::cout << ' ' << n; total += n; }
    std::cout << " (total " << total << ", each key stored once)\n";
}
```

**Output (may vary):**
```text
replica 0 before replication: (not found)  <- replication lag
replica 0 after replication:  Ana
keys per shard: 2521 2486 2485 2508 (total 10000, each key stored once)
```

### Interview answer
"Replication copies the same data to multiple nodes for availability, durability and read scaling — leader-follower, multi-leader or leaderless quorum, synchronous or asynchronous with lag. Partitioning splits data across nodes by range, hash or directory for write and storage scaling, at the cost of cross-shard queries, rebalancing and hot spots. Production systems partition and then replicate each partition."

---

## 2. Consistent Hashing

**In one sentence:** consistent hashing maps both **servers and keys onto a circle (ring)**; each key belongs to the next server clockwise, so adding or removing a server moves only **about 1/N of the keys** instead of nearly all of them.

### In plain words
With plain `hash(key) % N`, going from 4 to 5 servers changes the answer for almost **every** key — like renumbering every house in a city because one new house was built. Every cache misses at once and every database shard must move data.

Consistent hashing arranges servers around a **clock face**. A key is placed on the clock too, and walks **clockwise** to the first server it meets. Add a new server at 3 o'clock: only the keys between 2 o'clock and 3 o'clock move to it; everyone else stays put.

### How it works
1. Hash each server's name to a position on a ring of, say, 2³² slots.
2. Hash each key to a position; the owner is the first server at or after that position (wrapping around).
3. **Virtual nodes:** each physical server is placed at many positions (e.g. 100–200 "vnodes") so load evens out and a failed server's keys are spread over *all* the others, not dumped on one neighbor.
4. **Replication:** store each key on the next R distinct servers clockwise.
5. Implementation: a sorted map (`std::map`) from position → server; lookup is `lower_bound` = O(log V).

Used by: Amazon Dynamo/DynamoDB, Cassandra, Riak, memcached clients (ketama), CDNs and load balancers (Maglev, rendezvous hashing is a related alternative).

### Modern C++ example — keys moved when adding a 5th server: modulo vs. consistent hashing
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <vector>

// A simple, stable 64-bit hash (FNV-1a) so results are the same on every platform.
std::uint64_t fnv1a(const std::string& s) {
    std::uint64_t h = 1469598103934665603ULL;
    for (unsigned char c : s) { h ^= c; h *= 1099511628211ULL; }
    h ^= h >> 33; h *= 0xff51afd7ed558ccdULL; h ^= h >> 33;   // extra mixing for a better spread
    return h;
}

class ConsistentHashRing {
public:
    explicit ConsistentHashRing(int vnodes) : vnodes_(vnodes) {}
    void add(const std::string& server) {
        for (int v = 0; v < vnodes_; ++v) ring_[fnv1a(server + "#" + std::to_string(v))] = server;
    }
    void remove(const std::string& server) {
        for (int v = 0; v < vnodes_; ++v) ring_.erase(fnv1a(server + "#" + std::to_string(v)));
    }
    const std::string& owner(const std::string& key) const {
        auto it = ring_.lower_bound(fnv1a(key));               // first server clockwise
        if (it == ring_.end()) it = ring_.begin();             // wrap around the circle
        return it->second;
    }
private:
    int vnodes_;
    std::map<std::uint64_t, std::string> ring_;               // position -> server
};

int main() {
    const int kKeys = 100'000;
    std::vector<std::string> keys;
    for (int i = 0; i < kKeys; ++i) keys.push_back("user:" + std::to_string(i));

    // Modulo hashing: 4 -> 5 servers
    int moved_mod = 0;
    for (const auto& k : keys) moved_mod += (fnv1a(k) % 4) != (fnv1a(k) % 5);

    // Consistent hashing: 4 -> 5 servers
    ConsistentHashRing ring(150);
    for (const char* s : {"A", "B", "C", "D"}) ring.add(s);
    std::vector<std::string> before;
    for (const auto& k : keys) before.push_back(ring.owner(k));
    ring.add("E");
    int moved_ring = 0;
    std::map<std::string, int> load;
    for (int i = 0; i < kKeys; ++i) {
        const auto& now = ring.owner(keys[i]);
        moved_ring += now != before[i];
        ++load[now];
    }

    std::cout << std::format("modulo hashing:     {:5.1f}% of keys moved\n", 100.0 * moved_mod / kKeys);
    std::cout << std::format("consistent hashing: {:5.1f}% of keys moved (ideal: 1/5 = 20%)\n", 100.0 * moved_ring / kKeys);
    std::cout << "load after adding E:";
    for (const auto& [server, n] : load) std::cout << ' ' << server << '=' << n;
    std::cout << '\n';
}
```

**Output:**
```text
modulo hashing:      79.9% of keys moved
consistent hashing:  21.0% of keys moved (ideal: 1/5 = 20%)
load after adding E: A=20201 B=17516 C=19931 D=21351 E=21001
```
~80% of keys move with modulo hashing versus ~20% with the ring, and load stays within about ±12% of even thanks to 150 virtual nodes per server (fewer vnodes → more imbalance).

### Common mistakes
- Using few or no virtual nodes → very uneven load (one server may get 2× the keys of another).
- Forgetting that hot **keys** (one celebrity) still overload one server — consistent hashing balances key *counts*, not per-key traffic.

### Interview answer
"Consistent hashing places nodes and keys on a hash ring; each key is owned by the next node clockwise. Adding or removing a node only remaps the keys in its arc — about K/N — instead of nearly all keys as with modulo hashing. Virtual nodes smooth the distribution and spread a failed node's load, and replicas are placed on the next distinct nodes. Dynamo, Cassandra and many caches use it."

---

## 3. Auto-scaling

**In one sentence:** auto-scaling automatically **adds servers when load rises and removes them when it falls**, based on metrics like CPU or requests per second, so you pay for what you need while staying fast.

### In plain words
A supermarket that opens more checkout lanes when queues get long, and closes lanes during quiet hours so cashiers can do other work. Nobody has to remember — a rule says "if more than 5 people wait per lane, open another lane".

### How it works
A control loop runs every minute or so:
1. **Measure** a metric across the group (average CPU, requests per instance, queue length, latency).
2. **Compare** with a target, e.g. "keep average CPU at 60%".
3. **Decide** the desired count: `desired = ceil(current × actual / target)`, clamped between **min** and **max** instances.
4. **Act:** launch or terminate instances; the load balancer adds/removes them.
5. **Cooldown / stabilization:** wait before scaling again to avoid **flapping** (up, down, up, down). Scale **up fast, down slowly**.

Kinds of policies:
| Policy | Idea |
|---|---|
| **Target tracking** | Keep a metric near a target (above) — most common |
| **Step scaling** | "CPU > 80% → +3 instances; > 60% → +1" |
| **Scheduled** | Known patterns: scale up at 8:00 on weekdays |
| **Predictive** | ML forecasts load from history and scales ahead of time |

Where you see it: AWS Auto Scaling Groups, Kubernetes **Horizontal Pod Autoscaler** (HPA — more pods), **Vertical Pod Autoscaler** (bigger pods), **Cluster Autoscaler** (more nodes), serverless platforms (scale to zero).

Requirements and pitfalls:
- Servers must be **stateless** and **start fast** (warm-up time, pre-baked images, readiness checks).
- Scaling reacts after the fact — keep headroom or use scheduled/predictive scaling for sudden spikes.
- The database often becomes the bottleneck when app servers scale out.
- Always set a **max** (cost protection against a bug or attack).

### Modern C++ example — a target-tracking autoscaler with cooldown
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <format>
#include <iostream>
#include <vector>

struct Autoscaler {
    double target_util = 0.60;        // keep each instance ~60% busy
    int min_instances = 2, max_instances = 10;
    int cooldown_ticks = 2;           // wait between scale-downs to avoid flapping
    int last_scale_down = -100;

    int decide(int tick, int current, double demand /* in "instances worth of work" */) {
        int desired = static_cast<int>(std::ceil(demand / target_util));
        desired = std::clamp(desired, min_instances, max_instances);
        if (desired < current) {                                   // scale DOWN slowly
            if (tick - last_scale_down < cooldown_ticks) return current;
            last_scale_down = tick;
            return current - 1;
        }
        return desired;                                            // scale UP immediately
    }
};

int main() {
    Autoscaler as;
    int instances = 2;
    const std::vector<double> demand{1.0, 1.2, 3.0, 4.5, 4.8, 2.0, 1.0, 1.0, 1.0, 1.0};  // traffic over time
    std::cout << "tick demand instances utilization\n";
    for (int t = 0; t < static_cast<int>(demand.size()); ++t) {
        instances = as.decide(t, instances, demand[t]);
        std::cout << std::format("{:>4} {:>6.1f} {:>9} {:>10.0f}%\n", t, demand[t], instances,
                                 100.0 * demand[t] / instances);
    }
}
```

**Output:**
```text
tick demand instances utilization
   0    1.0         2         50%
   1    1.2         2         60%
   2    3.0         5         60%
   3    4.5         8         56%
   4    4.8         8         60%
   5    2.0         7         29%
   6    1.0         7         14%
   7    1.0         6         17%
   8    1.0         6         17%
   9    1.0         5         20%
```
Up quickly when traffic spikes, down one step at a time after the spike — trading a little cost for stability.

### Interview answer
"Auto-scaling adjusts capacity automatically using policies — target tracking on metrics like CPU or requests per instance, step, scheduled or predictive scaling — within min/max bounds and with cooldowns to prevent flapping. It requires stateless, fast-starting instances behind a load balancer, typically scales up aggressively and down conservatively, and must be paired with a scalable data tier."

---

## Cheat sheet

| Concept | Key idea | Trade-off |
|---|---|---|
| Vertical scaling | Bigger machine | Simple, but capped and a SPOF |
| Horizontal scaling | More machines | Unlimited, but needs stateless design + coordination |
| Replication | Copies of the same data | Availability + read scale; lag, write bottleneck, conflicts |
| Partitioning | Split data across nodes | Write/storage scale; cross-shard queries, hot spots, rebalancing |
| Consistent hashing | Ring + virtual nodes | Adding a node moves ~1/N keys, not ~all |
| Auto-scaling | Metric-driven add/remove instances | Cost-efficient; reacts with delay, needs cooldowns |
