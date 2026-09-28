# Distributed Systems — Explained for Beginners

> **What you'll learn:** what makes distributed systems hard, **ACID vs. BASE**, **eventual consistency** (with CRDTs), **leader election** with **Paxos and Raft**, **distributed tracing**, and **fault tolerance and resilience** — each with a C++ simulation you can run and tweak.
>
> **Prerequisites:** [ACID](../Databases/ACID.md), [Replication vs. Partitioning](./Scalability.md#1-replication-vs-partitioning).

## Table of Contents
0. [What is a distributed system, and why is it hard?](#0-what-is-a-distributed-system-and-why-is-it-hard)
1. [ACID vs. BASE](#1-acid-vs-base)
2. [Eventual consistency](#2-eventual-consistency)
3. [Leader election algorithms (Paxos, Raft)](#3-leader-election-algorithms-paxos-raft)
4. [Distributed tracing](#4-distributed-tracing)
5. [Fault tolerance and resilience](#5-fault-tolerance-and-resilience)
6. [Cheat sheet](#cheat-sheet)

---

## 0. What is a distributed system, and why is it hard?

**In one sentence:** a distributed system is a group of computers that work together over a network and appear to users as **one system** — and it's hard because the network and machines can fail **partially** and **unpredictably**.

### In plain words
A group project done by people in different cities who can only communicate by mail. Letters get delayed, lost or arrive out of order; someone might get sick without telling anyone; two people might both think they're in charge. Yet the final report must be consistent. That's distributed systems.

### How it works
Things that are **not true** (the "fallacies of distributed computing"): the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology doesn't change, there is one administrator, transport cost is zero, the network is homogeneous.

Core facts:
- **Partial failure:** some nodes/links fail while others keep running — and you often can't tell a *slow* node from a *dead* one.
- **No global clock:** machines' clocks drift; you can't order events just by timestamps (logical clocks — Lamport, vector clocks — help).
- **CAP theorem:** during a network **P**artition, a system must choose between **C**onsistency (every read sees the latest write, or an error) and **A**vailability (every request gets a non-error answer). Partitions *will* happen, so the real choice is CP vs. AP.
- **PACELC:** if **P**artitioned choose **A** or **C**; **E**lse (normal operation) choose **L**atency or **C**onsistency.

---

## 1. ACID vs. BASE

**In one sentence:** **ACID** databases guarantee strict correctness for every transaction; **BASE** systems relax that to stay **B**asically **A**vailable with **S**oft state and **E**ventual consistency at massive scale.

### In plain words
- **ACID = a bank vault.** Every transfer is exact and immediately visible; if the vault's systems can't agree, it closes the door rather than risk a mistake.
- **BASE = a social network's like counter.** It always accepts your like, even if some data center is unreachable; the number might show 1,203 in Europe and 1,201 in Asia for a few seconds, and that's fine — it'll converge.

### How it works
| | ACID | BASE |
|---|---|---|
| Stands for | Atomicity, Consistency, Isolation, Durability | Basically Available, Soft state, Eventual consistency |
| Consistency | Strong: reads see the latest committed write | Eventual: replicas converge over time |
| On partition | Prefers consistency (may reject requests) → **CP** | Prefers availability (may serve stale data) → **AP** |
| Scaling | Harder across nodes (coordination: 2PC, consensus) | Easy horizontal scaling, no global coordination per write |
| Typical systems | PostgreSQL, MySQL, Spanner, CockroachDB | Cassandra, DynamoDB (default), Riak, DNS, CDNs |
| Use for | Money, orders, inventory, bookings | Feeds, likes, counters, carts, analytics, caches |

Many systems let you choose per operation (Cassandra/DynamoDB consistency levels, MongoDB read/write concerns). Distributed ACID across nodes needs **consensus** (section 3) or **two-phase commit**.

### Modern C++ example — strong (all replicas ack) vs. eventual (one replica acks) writes
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Replica { std::string value = "v0"; bool reachable = true; };

// ACID-style (CP): the write succeeds only if EVERY replica applies it; otherwise it fails.
bool write_strong(std::vector<Replica>& rs, const std::string& v) {
    for (const auto& r : rs) if (!r.reachable) return false;       // can't guarantee consistency -> refuse
    for (auto& r : rs) r.value = v;
    return true;
}
// BASE-style (AP): accept the write on any reachable replica; others catch up later.
bool write_eventual(std::vector<Replica>& rs, const std::string& v) {
    for (auto& r : rs) if (r.reachable) { r.value = v; return true; }
    return false;
}

void show(const std::vector<Replica>& rs) {
    std::cout << "  replicas:";
    for (const auto& r : rs) std::cout << ' ' << r.value << (r.reachable ? "" : "(cut off)");
    std::cout << '\n';
}

int main() {
    std::vector<Replica> strong(3), eventual(3);
    strong[2].reachable = eventual[2].reachable = false;            // a network partition

    std::cout << "strong write during partition: " << (write_strong(strong, "v1") ? "OK" : "REJECTED (unavailable)") << '\n';
    show(strong);
    std::cout << "eventual write during partition: " << (write_eventual(eventual, "v1") ? "OK (available)" : "failed") << '\n';
    show(eventual);
    std::cout << "  -> a reader of replica 1 or 2 now sees stale data until replication catches up\n";
}
```

**Output:**
```text
strong write during partition: REJECTED (unavailable)
  replicas: v0 v0 v0(cut off)
eventual write during partition: OK (available)
  replicas: v1 v0 v0(cut off)
  -> a reader of replica 1 or 2 now sees stale data until replication catches up
```

### Interview answer
"ACID provides atomic, consistent, isolated, durable transactions with strong consistency, favoring correctness and CP behavior under partitions. BASE — basically available, soft state, eventually consistent — favors availability and scale, allowing temporarily stale reads. The choice is per use case: money needs ACID, likes and feeds tolerate BASE, and many databases offer tunable consistency."

---

## 2. Eventual consistency

**In one sentence:** eventual consistency guarantees that if no new updates are made, **all replicas will eventually return the same value** — but reads in the meantime may be stale.

### In plain words
You change your profile picture. Your friend in another country still sees the old one for a few seconds, then the new one. Nobody sees garbage, and everyone ends up agreeing — just not instantly.

### How it works
How replicas converge:
- **Asynchronous replication** + **anti-entropy**: replicas periodically compare data (often with **Merkle trees**) and exchange differences; **gossip** spreads updates epidemically; **read repair** fixes stale replicas noticed during reads; **hinted handoff** stores writes for a temporarily down node.

How conflicts are resolved (two replicas updated concurrently):
| Method | Idea | Risk |
|---|---|---|
| **Last-writer-wins (LWW)** | Keep the value with the highest timestamp | Silently drops concurrent writes; relies on clocks |
| **Vector clocks** | Detect concurrency; keep both "siblings" for the app to merge | Complexity |
| **CRDTs** (Conflict-free Replicated Data Types) | Data types whose merge is mathematically guaranteed to converge (counters, sets, maps) | Limited set of types |

Stronger client-side guarantees you can add: **read-your-writes**, **monotonic reads** (never go back in time), **causal consistency**. And with quorums, **R + W > N** gives reads that overlap the latest write.

### Modern C++ example — a G-Counter CRDT converging through gossip
A "grow-only counter" (e.g. page views) where each replica counts its own increments; merging takes the **maximum per replica**, so merges can happen in any order, any number of times, and everyone converges.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

class GCounter {
public:
    GCounter(std::size_t id, std::size_t n) : id_(id), counts_(n, 0) {}
    void increment() { ++counts_[id_]; }                       // only touch MY slot
    long value() const { return std::accumulate(counts_.begin(), counts_.end(), 0L); }
    void merge(const GCounter& other) {                        // commutative, associative, idempotent
        for (std::size_t i = 0; i < counts_.size(); ++i) counts_[i] = std::max(counts_[i], other.counts_[i]);
    }
private:
    std::size_t id_;
    std::vector<long> counts_;
};

void show(const char* when, const std::vector<GCounter>& rs) {
    std::cout << when;
    for (const auto& r : rs) std::cout << ' ' << r.value();
    std::cout << '\n';
}

int main() {
    std::vector<GCounter> replicas{{0, 3}, {1, 3}, {2, 3}};
    // Concurrent page views hit different data centers:
    for (int i = 0; i < 5; ++i) replicas[0].increment();
    for (int i = 0; i < 3; ++i) replicas[1].increment();
    for (int i = 0; i < 2; ++i) replicas[2].increment();
    show("before gossip, each replica sees:", replicas);

    // Gossip rounds: each replica merges a neighbour's state (order doesn't matter).
    replicas[1].merge(replicas[0]);
    replicas[2].merge(replicas[1]);
    show("after 2 merges:                  ", replicas);
    replicas[0].merge(replicas[2]);
    replicas[1].merge(replicas[2]);
    replicas[1].merge(replicas[2]);                            // duplicate merge: harmless (idempotent)
    show("after anti-entropy completes:    ", replicas);
}
```

**Output:**
```text
before gossip, each replica sees: 5 3 2
after 2 merges:                   5 8 10
after anti-entropy completes:     10 10 10
```

### Interview answer
"Eventual consistency guarantees replicas converge once updates stop, allowing temporarily stale reads in exchange for availability and low latency. Convergence comes from async replication, gossip, anti-entropy with Merkle trees, read repair and hinted handoff; conflicts are resolved with last-writer-wins, vector clocks or CRDTs whose merges are commutative, associative and idempotent. Session guarantees like read-your-writes can be layered on top."

---

## 3. Leader election algorithms (Paxos, Raft)

**In one sentence:** leader election (and, more generally, **consensus**) lets a group of machines **agree on one leader or one value** even when some machines crash or messages are delayed — as long as a **majority** is alive.

### In plain words
A group chat decides where to eat. Messages are slow, people drop offline, and two people might propose at the same time. The rule that makes it work: **a decision needs a majority** (3 of 5). Because any two majorities overlap in at least one person, two different decisions can never both win — the overlapping person would notice.

Why we need it: a replicated database needs **one** leader to order writes; if two nodes both think they're leader (**split brain**), data diverges. Consensus systems like **etcd, ZooKeeper, Consul**, and databases like **CockroachDB, Spanner, MongoDB, Kafka (KRaft)** are built on Paxos or Raft.

### How it works
**Common ideas**
- **Quorum = majority** (⌊N/2⌋ + 1). A cluster of 5 tolerates 2 failures; 3 tolerates 1. (Use odd sizes.)
- **Terms / ballot numbers:** a monotonically increasing number identifies each election round, so stale leaders are recognized and ignored.

**Paxos (single-decree)** — agree on one value. Roles: proposers, acceptors (learners).
1. **Prepare(n):** a proposer picks a unique number *n* and asks acceptors.
2. **Promise:** an acceptor promises to ignore proposals numbered < *n*, and reports any value it already **accepted**.
3. **Accept(n, v):** if a majority promised, the proposer sends a value — it **must use the highest-numbered already-accepted value** it heard about (this is the safety rule), otherwise its own.
4. **Accepted:** acceptors accept unless they've promised a higher number. A value accepted by a majority is **chosen** — forever.
Multi-Paxos runs this for a sequence of log entries with a stable leader. Paxos is correct but famously hard to understand and implement.

**Raft** — designed to be understandable; equivalent power. Each node is a **Follower**, **Candidate** or **Leader**.
1. Followers expect **heartbeats** from a leader. If none arrives within a **randomized election timeout** (e.g. 150–300 ms), the follower becomes a **candidate**: increments its **term**, votes for itself, and asks others for votes.
2. A node grants **at most one vote per term**, and only to a candidate whose **log is at least as up to date** as its own.
3. A candidate with a **majority** becomes **leader** and sends heartbeats; anyone seeing a higher term steps down.
4. **Randomized timeouts** make split votes rare; if one happens, the term times out and a new election starts.
5. The leader then does **log replication**: entries are committed once stored on a majority.

### Modern C++ example 1 — Paxos: the safety rule in action
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <string>
#include <vector>

struct Acceptor {
    int promised = 0;                    // highest ballot promised
    int accepted_n = 0;                  // ballot of accepted value (0 = none)
    std::optional<std::string> accepted_v;
};

struct Promise { bool ok; int accepted_n; std::optional<std::string> accepted_v; };

Promise prepare(Acceptor& a, int n) {
    if (n <= a.promised) return {false, 0, {}};
    a.promised = n;
    return {true, a.accepted_n, a.accepted_v};
}
bool accept(Acceptor& a, int n, const std::string& v) {
    if (n < a.promised) return false;    // promised someone newer
    a.promised = n; a.accepted_n = n; a.accepted_v = v;
    return true;
}

// Phase 1 only: returns the value this proposer is ALLOWED to propose, or nullopt.
std::optional<std::string> phase1(std::vector<Acceptor>& acc, int n, const std::string& my_value) {
    int promises = 0, highest = 0;
    std::optional<std::string> value = my_value;
    for (auto& a : acc) {
        auto p = prepare(a, n);
        if (!p.ok) continue;
        ++promises;
        if (p.accepted_v && p.accepted_n > highest) { highest = p.accepted_n; value = p.accepted_v; }  // SAFETY RULE
    }
    if (promises <= static_cast<int>(acc.size()) / 2) return std::nullopt;
    return value;
}
bool phase2(std::vector<Acceptor>& acc, int n, const std::string& v) {
    int oks = 0;
    for (auto& a : acc) oks += accept(a, n, v);
    return oks > static_cast<int>(acc.size()) / 2;
}

int main() {
    std::vector<Acceptor> acceptors(3);

    auto p1 = phase1(acceptors, 1, "A");                      // P1 prepares ballot 1
    auto p2 = phase1(acceptors, 2, "B");                      // P2 prepares ballot 2 (overrides P1's promise)
    std::cout << "P1 accept(1, A): " << (phase2(acceptors, 1, *p1) ? "chosen" : "rejected (acceptors promised 2)") << '\n';
    std::cout << "P2 accept(2, " << *p2 << "): " << (phase2(acceptors, 2, *p2) ? "chosen" : "rejected") << '\n';

    auto p1_retry = phase1(acceptors, 3, "A");                // P1 retries with ballot 3 and its own value A...
    std::cout << "P1 retries with ballot 3 wanting A, but must propose: " << *p1_retry << '\n';
    std::cout << "P1 accept(3, " << *p1_retry << "): " << (phase2(acceptors, 3, *p1_retry) ? "chosen" : "rejected")
              << "  -> the chosen value never changes\n";
}
```

**Output:**
```text
P1 accept(1, A): rejected (acceptors promised 2)
P2 accept(2, B): chosen
P1 retries with ballot 3 wanting A, but must propose: B
P1 accept(3, B): chosen  -> the chosen value never changes
```

### Modern C++ example 2 — Raft leader election with randomized timeouts and a leader crash
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <string>
#include <vector>

enum class Role { Follower, Candidate, Leader };

struct Node {
    int id;
    Role role = Role::Follower;
    int term = 0;
    int voted_for = -1;
    int timeout = 0, elapsed = 0;
    bool alive = true;
};

class Cluster {
public:
    explicit Cluster(int n) { for (int i = 0; i < n; ++i) { nodes_.push_back({i}); reset_timer(nodes_.back()); } }

    void run(int until_ms, int crash_leader_at) {
        for (now_ = 1; now_ <= until_ms; ++now_) {
            if (now_ == crash_leader_at)
                for (auto& n : nodes_)
                    if (n.alive && n.role == Role::Leader) {
                        n.alive = false;
                        std::cout << "t=" << now_ << "ms: LEADER node " << n.id << " crashes\n";
                    }
            for (auto& n : nodes_) {
                if (!n.alive) continue;
                if (n.role == Role::Leader) {
                    if (now_ % 50 == 0) heartbeat(n);            // leaders send heartbeats every 50ms
                } else if (++n.elapsed >= n.timeout) {
                    start_election(n);                            // no heartbeat -> try to become leader
                }
            }
        }
    }

private:
    std::uint32_t rng_ = 12345;
    std::uint32_t next_random() { rng_ ^= rng_ << 13; rng_ ^= rng_ >> 17; rng_ ^= rng_ << 5; return rng_; }
    void reset_timer(Node& n) { n.elapsed = 0; n.timeout = 150 + static_cast<int>(next_random() % 151); }  // 150..300ms

    void heartbeat(Node& leader) {
        for (auto& f : nodes_)
            if (f.alive && &f != &leader && f.term <= leader.term) {
                f.term = leader.term; f.role = Role::Follower; reset_timer(f);
            }
    }

    void start_election(Node& c) {
        c.role = Role::Candidate;
        ++c.term;
        c.voted_for = c.id;
        int votes = 1, alive = 0;
        for (auto& n : nodes_) alive += n.alive;
        std::cout << "t=" << now_ << "ms: node " << c.id << " timed out -> candidate for term " << c.term << '\n';
        for (auto& n : nodes_) {
            if (!n.alive || &n == &c) continue;
            if (n.term < c.term) { n.term = c.term; n.voted_for = -1; n.role = Role::Follower; }
            if (n.voted_for == -1) { n.voted_for = c.id; ++votes; reset_timer(n); }   // one vote per term
        }
        if (votes > static_cast<int>(nodes_.size()) / 2) {        // majority of the WHOLE cluster
            c.role = Role::Leader;
            std::cout << "t=" << now_ << "ms: node " << c.id << " wins " << votes << "/" << nodes_.size()
                      << " votes -> LEADER of term " << c.term << " (" << alive << " nodes alive)\n";
            heartbeat(c);
        } else {
            reset_timer(c);
        }
    }

    std::vector<Node> nodes_;
    int now_ = 0;
};

int main() {
    Cluster cluster(5);
    cluster.run(/*until_ms=*/800, /*crash_leader_at=*/400);
}
```

**Output:**
```text
t=178ms: node 4 timed out -> candidate for term 1
t=178ms: node 4 wins 5/5 votes -> LEADER of term 1 (5 nodes alive)
t=400ms: LEADER node 4 crashes
t=549ms: node 3 timed out -> candidate for term 2
t=549ms: node 3 wins 4/5 votes -> LEADER of term 2 (4 nodes alive)
```
The crashed leader's heartbeats stop; the follower whose random timeout expires first starts a new term and wins with 4 of 5 votes — still a majority. (Real Raft also compares log freshness before voting and replicates a log; this simulation focuses on elections.)

### Interview answer
"Consensus lets nodes agree despite crashes as long as a majority is available, because majorities intersect. Paxos uses prepare/promise and accept/accepted phases with ballot numbers, and the rule that a proposer must adopt the highest previously accepted value guarantees a chosen value never changes. Raft elects a leader per term using randomized election timeouts and one vote per node per term, requires the candidate's log to be up to date, and then replicates a log that commits on majority acknowledgment. etcd, ZooKeeper and Consul provide this to other systems."

---

## 4. Distributed tracing

**In one sentence:** distributed tracing follows **one request** as it travels through many services, recording each step (a **span**) with timing, so you can see where time was spent and where errors happened.

### In plain words
A parcel's **tracking history**: "picked up → sorting center → truck → local depot → delivered", each with a timestamp. When a parcel is late you can see exactly which step was slow. In microservices, a single "checkout" click might touch 15 services; without tracing, finding the slow one is guesswork.

### How it works
- A **trace** = the whole journey of one request, identified by a **trace ID**.
- A **span** = one unit of work (an HTTP call, a DB query): span ID, **parent span ID**, name, start/end time, status, attributes (user id, SQL statement…).
- **Context propagation:** each service passes the trace ID and its span ID to downstream calls in headers (the W3C standard header is `traceparent: 00-<trace-id>-<span-id>-01`).
- Spans are exported to a backend that reassembles the **tree** and shows a waterfall/timeline: **Jaeger, Zipkin, Grafana Tempo, Datadog, Honeycomb**. **OpenTelemetry** is the standard SDK/protocol for producing them.
- **Sampling:** tracing everything is expensive; keep e.g. 1% of traces, or "tail sampling" that keeps slow/failed ones.
- Tracing complements **metrics** (aggregates, alerts) and **logs** (details) — the "three pillars of observability". Put the trace ID in every log line to connect them.

### Modern C++ example — spans with parent/child context and an RAII timer
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <cstdint>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

using namespace std::chrono;

struct SpanRecord { std::string name; int span_id, parent_id; long start_ms, duration_ms; };

struct Tracer {
    std::uint64_t trace_id = 0x4bf92f3577b34da6;
    std::vector<SpanRecord> finished;
    int next_id = 1;
    steady_clock::time_point t0 = steady_clock::now();
    long ms_since_start() const { return duration_cast<milliseconds>(steady_clock::now() - t0).count(); }
};

class Span {                                                // RAII: starts on creation, ends on scope exit
public:
    Span(Tracer& t, std::string name, int parent_id) : t_(t), name_(std::move(name)),
        id_(t.next_id++), parent_(parent_id), start_(t.ms_since_start()) {}
    ~Span() { t_.finished.push_back({name_, id_, parent_, start_, t_.ms_since_start() - start_}); }
    int id() const { return id_; }                          // passed to children ("context propagation")
private:
    Tracer& t_; std::string name_; int id_, parent_; long start_;
};

// Pretend these are separate microservices receiving the parent span id in a header.
void query_db(Tracer& t, int parent)       { Span s(t, "postgres: SELECT cart", parent); std::this_thread::sleep_for(20ms); }
void call_payment(Tracer& t, int parent)   { Span s(t, "payment-service: charge", parent); std::this_thread::sleep_for(60ms); }
void cart_service(Tracer& t, int parent)   { Span s(t, "cart-service: get cart", parent); query_db(t, s.id()); }

int main() {
    Tracer tracer;
    {
        Span root(tracer, "api-gateway: POST /checkout", 0);
        cart_service(tracer, root.id());
        call_payment(tracer, root.id());
    }
    std::cout << "trace " << std::hex << tracer.trace_id << std::dec << " (waterfall):\n";
    // Print as a tree ordered by start time (children indented under parents).
    auto depth = [&](int id) { int d = 0; for (;;) { int p = 0; for (auto& s : tracer.finished) if (s.span_id == id) p = s.parent_id; if (!p) return d; id = p; ++d; } };
    std::vector<SpanRecord> spans = tracer.finished;
    std::sort(spans.begin(), spans.end(), [](auto& a, auto& b) { return a.span_id < b.span_id; });
    for (const auto& s : spans)
        std::cout << std::string(2 * depth(s.span_id), ' ') << s.name << "  ~" << (s.duration_ms / 10) * 10 << "ms\n";
}
```

**Output (may vary):**
```text
trace 4bf92f3577b34da6 (waterfall):
api-gateway: POST /checkout  ~80ms
  cart-service: get cart  ~20ms
    postgres: SELECT cart  ~20ms
  payment-service: charge  ~60ms
```
At a glance: the payment call dominates the checkout latency.

### Interview answer
"Distributed tracing records a request's path across services as a trace made of spans with IDs, parent IDs, timings and attributes. Services propagate trace context via headers such as W3C traceparent, instrumentation is usually OpenTelemetry, and backends like Jaeger or Tempo reconstruct the waterfall to pinpoint latency and errors. Sampling controls cost, and trace IDs in logs connect tracing with logs and metrics."

---

## 5. Fault tolerance and resilience

**In one sentence:** fault tolerance is the ability to **keep working correctly when parts fail**; resilience is the broader ability to **absorb failures, degrade gracefully and recover quickly**.

### In plain words
A plane has multiple engines and can fly on one; hospitals have backup generators; a well-run restaurant has a plan when the dishwasher breaks (paper plates). The goal isn't "nothing ever fails" — it's "when something fails, customers barely notice".

### How it works
**Design principles**
| Technique | What it does |
|---|---|
| **Redundancy** | No single point of failure: multiple instances, replicas, availability zones, regions |
| **Failover** | Detect a failure (health checks, heartbeats) and switch to a standby |
| **Timeouts** | Never wait forever; a slow dependency is worse than a dead one |
| **Retries with exponential backoff + jitter** | Survive transient errors — only for idempotent operations, with a budget |
| **Circuit breaker** | Stop calling a failing dependency for a while (see [Microservices](./Microservices-Explained.md#3-circuit-breaker-pattern)) |
| **Bulkheads** | Isolate resources (separate thread pools/connection pools per dependency) so one failure can't sink the ship |
| **Graceful degradation / fallbacks** | Serve cached or partial results ("recommendations unavailable") |
| **Rate limiting & load shedding** | Reject excess load early to protect the core |
| **Idempotency** | Safe retries (idempotency keys) |
| **Replication + consensus** | Keep data and decisions alive despite node loss |
| **Chaos engineering** | Deliberately inject failures (Netflix Chaos Monkey) to prove resilience |

**Measuring it:** availability (99.9% = ~8.8 h downtime/year; 99.99% = ~53 min), **MTBF** (mean time between failures), **MTTR** (mean time to recover), **RPO** (how much data you can lose) and **RTO** (how long recovery may take), SLOs/error budgets.

### Modern C++ example — health-checked failover with timeouts and a retry budget
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <optional>
#include <string>
#include <vector>

using namespace std::chrono_literals;

struct Server {
    std::string name;
    bool healthy;
    std::chrono::milliseconds latency;
    std::optional<std::string> handle(const std::string& req, std::chrono::milliseconds timeout) const {
        if (!healthy) return std::nullopt;                   // crashed
        if (latency > timeout) return std::nullopt;          // too slow = treated as failure
        return name + " handled " + req;
    }
};

class ResilientClient {
public:
    explicit ResilientClient(std::vector<Server> servers) : servers_(std::move(servers)) {}
    std::string call(const std::string& req) {
        int attempts = 0;
        for (const auto& s : servers_) {                      // failover in order of preference
            if (attempts == kMaxAttempts) break;              // retry budget: don't hammer everything
            ++attempts;
            if (auto r = s.handle(req, kTimeout)) return *r + " (attempt " + std::to_string(attempts) + ")";
            std::cout << "  " << s.name << " failed or timed out, failing over...\n";
        }
        return "fallback: cached response for " + req;       // graceful degradation
    }
private:
    static constexpr auto kTimeout = 200ms;
    static constexpr int kMaxAttempts = 3;
    std::vector<Server> servers_;
};

int main() {
    ResilientClient client({{"us-east-1a", false, 10ms},      // crashed
                            {"us-east-1b", true, 900ms},      // alive but too slow
                            {"us-east-1c", true, 30ms}});     // healthy
    std::cout << client.call("GET /profile") << '\n';

    ResilientClient all_down({{"a", false, 1ms}, {"b", false, 1ms}, {"c", false, 1ms}});
    std::cout << all_down.call("GET /profile") << '\n';
}
```

**Output:**
```text
  us-east-1a failed or timed out, failing over...
  us-east-1b failed or timed out, failing over...
us-east-1c handled GET /profile (attempt 3)
  a failed or timed out, failing over...
  b failed or timed out, failing over...
  c failed or timed out, failing over...
fallback: cached response for GET /profile
```

### Interview answer
"Fault tolerance keeps a system correct when components fail; resilience adds graceful degradation and fast recovery. I remove single points of failure with redundancy across zones, detect failures with health checks, bound waits with timeouts, retry idempotent calls with backoff and jitter under a budget, contain failures with circuit breakers and bulkheads, shed load, provide fallbacks, and validate it all with chaos testing and SLOs like availability, MTTR, RPO and RTO."

---

## Cheat sheet

| Topic | Key idea |
|---|---|
| CAP | Under partition choose Consistency or Availability |
| ACID vs BASE | Strict transactions (CP) vs available + eventually consistent (AP) |
| Eventual consistency | Replicas converge when writes stop; gossip, anti-entropy, CRDTs, LWW |
| Quorum | Majority; any two majorities overlap; R + W > N |
| Paxos | Prepare/promise, accept/accepted; adopt highest accepted value |
| Raft | Terms, randomized timeouts, one vote per term, heartbeats, log replication |
| Tracing | Trace ID + spans + context propagation (OpenTelemetry, Jaeger) |
| Resilience | Redundancy, failover, timeouts, retries+backoff, circuit breaker, bulkhead, fallback |
