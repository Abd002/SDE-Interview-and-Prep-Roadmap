# Backend and Distributed-System Testing — Contracts, Concurrency, Databases, Idempotency, Queues, Fuzzing and Test Environments

> **What you'll learn:** how to test the things that break in backends and distributed systems: **API contracts** and schema compatibility, **concurrency** and **fault injection**, **database** transactions and **migrations**, **idempotency** under at-least-once delivery, **message handlers** (ordering, duplicates, retries, DLQ), **property-based / fuzz / boundary** testing, and the **environments** that make it possible (Testcontainers, ephemeral environments, service virtualization). Each part has a runnable C++ example.
>
> **Prerequisites:** [Testing Foundations](./Testing-Foundations.md), [Message Queuing](../System%20Architecture/Message-Queuing.md), [Transactions and Isolation](../Databases/Transactions-and-Isolation.md).

## Table of Contents
1. [API contract tests, schema compatibility, and consumer-driven contracts](#1-api-contract-tests-schema-compatibility-and-consumer-driven-contracts)
2. [Concurrency tests, race conditions, and fault injection](#2-concurrency-tests-race-conditions-and-fault-injection)
3. [Database integration tests, transactions, and migration tests](#3-database-integration-tests-transactions-and-migration-tests)
4. [Idempotency tests and at-least-once delivery failure cases](#4-idempotency-tests-and-at-least-once-delivery-failure-cases)
5. [Message queue/event handler tests: ordering, duplication, retry, DLQ](#5-message-queueevent-handler-tests-ordering-duplication-retry-dlq)
6. [Property-based tests, fuzz testing, and boundary-value analysis](#6-property-based-tests-fuzz-testing-and-boundary-value-analysis)
7. [Testcontainers, ephemeral environments, and service virtualization](#7-testcontainers-ephemeral-environments-and-service-virtualization)
8. [Cheat sheet](#cheat-sheet)

---

## 1. API contract tests, schema compatibility, and consumer-driven contracts

**In one sentence:** a **contract test** checks that a service's API still matches what its consumers rely on (fields, types, status codes), **schema compatibility** rules say which changes are safe, and **consumer-driven contracts** let each consumer publish its expectations so the provider's CI fails *before* a breaking change ships.

### In plain words
A plug and a socket. If the power company changes the socket shape, every appliance breaks. A contract test is the inspector who checks the socket against every appliance's plug before the change goes live.

### How it works
**Safe vs. breaking changes (for JSON / Protobuf / Avro APIs)**
| Change | Backward compatible? |
|---|---|
| add an **optional** field | ✅ old consumers ignore it |
| add a **required** request field | ❌ old clients don't send it |
| remove or rename a field | ❌ |
| change a field's type or meaning | ❌ |
| add an enum value | ⚠️ only if consumers handle unknown values |
| Protobuf: reuse a field number | ❌ never — mark it `reserved` |

- **Backward compatible** = new server works with old clients; **forward compatible** = old server/consumers tolerate data from newer producers (ignore unknown fields — "tolerant reader").
- **Provider contract tests:** validate responses against the published schema (OpenAPI, JSON Schema, `.proto`). Tools: Schemathesis, Dredd, `buf breaking` for Protobuf, Confluent **Schema Registry** compatibility modes for Kafka.
- **Consumer-driven contracts (CDC)** with **Pact**: each consumer writes "when I call `GET /users/7` I need `id` (int) and `email` (string)"; the contract is shared (Pact Broker), and the **provider runs every consumer's contract in its CI**. Only fields consumers actually use are locked — the provider can change the rest freely.

#### Modern C++ example — a consumer-driven contract check against two provider versions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

enum class Type { Int, String, Bool };
using Response = std::map<std::string, std::pair<Type, std::string>>;    // field -> (type, value)

struct Contract {                                                          // what ONE consumer needs
    std::string consumer;
    std::map<std::string, Type> required_fields;
};

std::vector<std::string> verify(const Contract& c, const Response& r) {
    std::vector<std::string> problems;
    for (auto& [field, type] : c.required_fields) {
        auto it = r.find(field);
        if (it == r.end()) problems.push_back(c.consumer + ": missing field '" + field + "'");
        else if (it->second.first != type) problems.push_back(c.consumer + ": field '" + field + "' changed type");
    }
    return problems;
}

int main() {
    std::vector<Contract> contracts{
        {"mobile-app", {{"id", Type::Int}, {"email", Type::String}}},
        {"billing", {{"id", Type::Int}, {"vip", Type::Bool}}},
    };
    Response v1{{"id", {Type::Int, "7"}}, {"email", {Type::String, "mona@x.com"}}, {"vip", {Type::Bool, "true"}}, {"nick", {Type::String, "mo"}}};
    Response v2 = v1;
    v2.erase("nick");                                                      // nobody uses it -> safe
    v2["created_at"] = {Type::String, "2026-10-17"};                       // additive -> safe
    v2["id"] = {Type::String, "usr_7"};                                    // breaking for both consumers!

    for (auto [name, resp] : {std::pair{"provider v1", v1}, std::pair{"provider v2", v2}}) {
        std::vector<std::string> all;
        for (auto& c : contracts) for (auto& p : verify(c, resp)) all.push_back(p);
        std::cout << name << ": " << (all.empty() ? "all consumer contracts pass" : "CI FAILS") << '\n';
        for (auto& p : all) std::cout << "  " << p << '\n';
    }
}
```

**Output:**
```text
provider v1: all consumer contracts pass
provider v2: CI FAILS
  mobile-app: field 'id' changed type
  billing: field 'id' changed type
```

Removing `nick` and adding `created_at` didn't fail anything — no consumer depends on them.

### Interview answer
"I keep API changes additive — optional fields, tolerant readers, reserved Protobuf field numbers — and enforce it with schema checks like `buf breaking` or a schema registry. For service-to-service APIs I like consumer-driven contracts with Pact: each consumer publishes the fields and status codes it relies on, and the provider's CI runs all of them, so a breaking change fails before deploy while unused fields stay free to change."

---

## 2. Concurrency tests, race conditions, and fault injection

**In one sentence:** **concurrency tests** hammer code from many threads to expose races and deadlocks (helped by **sanitizers** and stress loops), and **fault injection** deliberately makes dependencies **fail, slow down or return garbage** to prove the system degrades safely.

### In plain words
- Concurrency testing: send 1,000 people through one door at once to see if it jams.
- Fault injection: cut the power to one floor on purpose to check that the emergency lights come on.

### How it works
**Finding races**
- **Stress tests:** run the operation from N threads, many rounds, then check **invariants** (no lost updates, no double booking, totals add up).
- **ThreadSanitizer** (`-fsanitize=thread`) reports data races even when the test happens to pass; **Helgrind**/DRD (Valgrind) as alternatives.
- Increase interleavings: more threads than cores, `std::this_thread::yield()` in test builds, barriers to start all threads at once.
- **Deterministic simulation** (FoundationDB style) and model checkers (TLA+, Loom for Rust, CHESS) explore schedules systematically.

**Fault injection**
- Wrap dependencies with a **faulty decorator**: errors, timeouts, latency, partial writes, corrupted responses, at a configurable rate and **seed**.
- At the network level: `tc netem` (delay, loss), Toxiproxy, Chaos Mesh, AWS Fault Injection Service; service meshes (Istio) can inject faults per route.
- Assert **behaviour**, not just "didn't crash": retries happen, timeouts fire, circuit breaker opens, user gets a clear error, no partial state. See [Chaos engineering](./Reliability-Engineering-SRE.md#3-chaos-engineering-and-game-day-exercises).

#### Modern C++ example — a stress test that finds a lost update, and fault injection with a seeded faulty dependency
```cpp
// g++ -std=c++20 -O1 -pthread main.cpp && ./a.out
#include <atomic>
#include <barrier>
#include <iostream>
#include <mutex>
#include <random>
#include <stdexcept>
#include <thread>
#include <vector>

struct RacyCounter { long value = 0; void add() { long v = value; std::this_thread::yield(); value = v + 1; } };
struct SafeCounter { std::mutex m; long value = 0; void add() { std::scoped_lock l(m); ++value; } };

template <class C>
long stress(int threads, int per_thread) {
    C c;
    std::barrier start(threads);                                   // release all threads at once
    {
        std::vector<std::jthread> ts;
        for (int t = 0; t < threads; ++t) ts.emplace_back([&] { start.arrive_and_wait(); for (int i = 0; i < per_thread; ++i) c.add(); });
    }
    return c.value;
}

// Fault injection: a dependency that fails a configurable fraction of calls (seeded = reproducible).
class Inventory { public: virtual ~Inventory() = default; virtual int stock(int sku) = 0; };
class RealInventory : public Inventory { public: int stock(int) override { return 5; } };
class FaultyInventory : public Inventory {
public:
    FaultyInventory(Inventory& inner, double fail_rate, unsigned seed) : inner_(inner), rate_(fail_rate), rng_(seed) {}
    int stock(int sku) override {
        if (std::uniform_real_distribution<>(0, 1)(rng_) < rate_) throw std::runtime_error("timeout");
        return inner_.stock(sku);
    }
private:
    Inventory& inner_; double rate_; std::mt19937 rng_;
};

std::string product_page(Inventory& inv, int sku) {               // must degrade, not crash
    for (int attempt = 0; attempt < 3; ++attempt) {
        try { return "in stock: " + std::to_string(inv.stock(sku)); } catch (const std::runtime_error&) {}
    }
    return "stock unavailable, try later";                          // graceful degradation
}

int main() {
    const int T = 8, N = 20000;
    long racy = stress<RacyCounter>(T, N), safe = stress<SafeCounter>(T, N);
    std::cout << std::boolalpha << "racy counter lost updates: " << (racy < T * N) << " (invariant value == " << T * N << " broken)\n";
    std::cout << "safe counter lost updates: " << (safe < T * N) << '\n';

    RealInventory real;
    FaultyInventory flaky(real, 0.5, 42);
    int ok = 0, degraded = 0, crashed = 0;
    for (int i = 0; i < 1000; ++i) {
        try { (product_page(flaky, 1).rfind("in stock", 0) == 0 ? ok : degraded)++; } catch (...) { ++crashed; }
    }
    std::cout << "with 50% injected failures: " << ok << " pages with stock, " << degraded << " degraded, " << crashed << " crashes\n";
}
```

**Output:**
```text
racy counter lost updates: true (invariant value == 160000 broken)
safe counter lost updates: false
with 50% injected failures: 879 pages with stock, 121 degraded, 0 crashes
```

How many updates the racy counter loses changes from run to run (one run here kept only about 23,000 of 160,000) — that's exactly what makes races hard; the invariant check (`value == T × N`) is what catches it. The fault-injection numbers are reproducible because the generator is seeded: 3 attempts at 50% failure leave 12.5% of pages degraded.

### Interview answer
"For concurrency I write stress tests that release many threads at once with a barrier, run many rounds and check invariants like totals or 'no seat booked twice', and I run them under ThreadSanitizer because a race can pass by luck. For resilience I inject faults — errors, timeouts, latency — through seeded decorators or tools like Toxiproxy, and assert the behaviour: retries, timeouts, a clear degraded response, and no partial state."

---

## 3. Database integration tests, transactions, and migration tests

**In one sentence:** run tests against a **real database engine** (same version as production) to verify **queries, constraints, transactions and isolation**, and test every **schema migration** forwards (and backwards) on realistic data before it touches production.

### In plain words
An in-memory fake can't tell you that your SQL has a typo, that a unique constraint is missing, or that a migration takes 40 minutes on 50 million rows. Only the real database can.

### How it works
- **Real engine in a container** (PostgreSQL, MySQL — see [Testcontainers](#7-testcontainers-ephemeral-environments-and-service-virtualization)); SQLite/H2 "compatible mode" hides dialect differences.
- **Isolation per test:** wrap each test in a transaction and **roll back** at the end, or create a fresh schema/database per test class; unique IDs for parallel runs.
- **Test what the DB enforces:** unique/foreign-key/check constraints, cascades, triggers, default values — and that your code maps the errors correctly (duplicate key → "email already used").
- **Transactions:** prove atomicity (failure mid-way leaves nothing) and isolation behaviour (two concurrent transactions → no lost update, or the expected serialization error + retry).
- **Migration tests**
  - apply all migrations from empty → schema matches the expected one;
  - apply the new migration on a **copy of production-like data** → data correct, time acceptable, no long table locks;
  - **expand–contract** for zero downtime: add new column → backfill → switch code → drop old column in a later release; test that **old and new code** both work during the transition;
  - test the **rollback** (down migration) or document that it's forward-only.
- Tools: Flyway, Liquibase, Alembic, golang-migrate, Rails/Django migrations; `pg_dump --schema-only` diffing.

#### Modern C++ example — a tiny "database" with constraints, rollback-per-test and a versioned migration test
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

struct Row { std::map<std::string, std::string> cols; };

class Db {                                                   // stands in for a real engine
public:
    void exec_insert(const std::string& table, Row r) {
        auto& t = tables_[table];
        if (table == "users") {
            if (!r.cols.count("email")) throw std::runtime_error("NOT NULL violation: email");
            for (auto& x : t) if (x.cols["email"] == r.cols["email"]) throw std::runtime_error("UNIQUE violation: email");
        }
        t.push_back(std::move(r));
    }
    void begin() { saved_ = tables_; }
    void rollback() { tables_ = saved_; }
    std::size_t count(const std::string& t) { return tables_[t].size(); }
    std::vector<Row>& table(const std::string& t) { return tables_[t]; }
    int version = 0;
private:
    std::map<std::string, std::vector<Row>> tables_, saved_;
};

// Migrations: v1 creates users(name, email). v2 splits name into first/last (expand + backfill).
std::vector<std::function<void(Db&)>> migrations{
    [](Db& db) { db.version = 1; },
    [](Db& db) {
        for (auto& r : db.table("users")) {
            auto name = r.cols["name"];
            auto sp = name.find(' ');
            r.cols["first_name"] = name.substr(0, sp);
            r.cols["last_name"] = sp == std::string::npos ? "" : name.substr(sp + 1);
        }                                                    // keep "name" until all code is switched (contract later)
        db.version = 2;
    },
};

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

void test(Db& db, const char* name, const std::function<bool()>& body) {
    db.begin();                                              // each test runs in a transaction...
    bool ok = false;
    try { ok = body(); } catch (...) { ok = false; }
    db.rollback();                                           // ...and leaves no trace
    check(ok, name);
}

int main() {
    Db db;
    migrations[0](db);
    test(db, "insert user", [&] { db.exec_insert("users", {{{"name", "Mona Ali"}, {"email", "m@x.com"}}}); return db.count("users") == 1; });
    test(db, "unique email enforced", [&] {
        db.exec_insert("users", {{{"name", "A"}, {"email", "dup@x.com"}}});
        try { db.exec_insert("users", {{{"name", "B"}, {"email", "dup@x.com"}}}); return false; }
        catch (const std::runtime_error& e) { return std::string(e.what()).find("UNIQUE") != std::string::npos; }
    });
    test(db, "previous tests left no rows (isolation)", [&] { return db.count("users") == 0; });

    // Migration test: production-like data at v1, then apply v2.
    Db prod_copy;
    migrations[0](prod_copy);
    for (auto [n, e] : std::vector<std::pair<std::string, std::string>>{{"Mona Ali", "m@x"}, {"Cher", "c@x"}, {"Omar El Sayed", "o@x"}})
        prod_copy.exec_insert("users", {{{"name", n}, {"email", e}}});
    migrations[1](prod_copy);
    auto& u = prod_copy.table("users");
    check(prod_copy.version == 2, "migration: version is 2");
    check(u[0].cols["first_name"] == "Mona" && u[0].cols["last_name"] == "Ali", "migration: normal name split");
    check(u[1].cols["first_name"] == "Cher" && u[1].cols["last_name"].empty(), "migration: single-word name");
    check(u[2].cols["last_name"] == "El Sayed", "migration: multi-word last name");
    check(u[2].cols["name"] == "Omar El Sayed", "expand phase: old column still there for old code");
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS insert user
PASS unique email enforced
PASS previous tests left no rows (isolation)
PASS migration: version is 2
PASS migration: normal name split
PASS migration: single-word name
PASS migration: multi-word last name
PASS expand phase: old column still there for old code
0 failure(s)
```

### Interview answer
"I run integration tests against the same database engine and version as production in a container, with each test in a rolled-back transaction or its own schema so they're isolated and parallel. I test what the database enforces — constraints, cascades, isolation behaviour under concurrent transactions — and that my code maps those errors correctly. Migrations are tested from scratch and on production-like data for correctness and duration, using expand–contract so old and new code both work during the rollout."

---

## 4. Idempotency tests and at-least-once delivery failure cases

**In one sentence:** with **at-least-once** delivery and client retries, every handler will eventually see **duplicates**, so tests must replay the **same request or message twice (or N times), concurrently, and after partial failures**, and assert the **effect happens exactly once**.

### In plain words
The postman might deliver the same letter twice. Your test is: deliver it twice on purpose, and check that the customer was charged once and got one confirmation.

### How it works
**Failure cases to test** (each one is a real production incident pattern)
| Case | What happens | Assert |
|---|---|---|
| Plain duplicate | same message/key delivered twice | one effect |
| **Lost response** | server did the work, client timed out and retried | one effect; retry returns the original result |
| **Crash after effect, before ack** | consumer charged, crashed before acking → redelivery | one effect |
| **Crash before effect** | nothing done → redelivery | effect happens (no loss) |
| Concurrent duplicates | two copies processed at the same moment | one effect (needs a unique constraint / lock) |
| Same key, different payload | client bug | rejected |
| Key expiry | duplicate arrives after the dedupe TTL | known, documented behaviour |

- Build the handler so the **dedupe record and the effect commit together** (same transaction, or an idempotent upsert).
- Implementation patterns: idempotency keys (see [API design](../Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#2-idempotent-operations-and-safe-retries-in-low-level-apis)), unique constraints on business keys, "processed messages" table, conditional writes (version checks), naturally idempotent operations (set instead of increment).

#### Modern C++ example — a consumer tested against duplicates, crash-before-ack and concurrent redelivery
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <mutex>
#include <set>
#include <stdexcept>
#include <string>
#include <thread>
#include <vector>

struct Message { std::string id; long cents; };

class PaymentConsumer {
public:
    // Effect + dedupe record are committed together under one lock ("one transaction").
    void handle(const Message& m, bool crash_before_ack = false) {
        {
            std::scoped_lock l(m_);
            if (processed_.insert(m.id).second) total_charged += m.cents;   // insert fails on a duplicate
        }
        if (crash_before_ack) throw std::runtime_error("crashed before ack");   // broker will redeliver
    }
    long total_charged = 0;
private:
    std::mutex m_;
    std::set<std::string> processed_;
};

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    { PaymentConsumer c; c.handle({"m1", 100}); c.handle({"m1", 100}); check(c.total_charged == 100, "duplicate delivery charges once"); }
    {
        PaymentConsumer c;
        try { c.handle({"m2", 250}, true); } catch (...) {}           // effect done, ack lost
        c.handle({"m2", 250});                                          // redelivery
        check(c.total_charged == 250, "crash after effect, before ack -> still one charge");
    }
    {
        PaymentConsumer c;
        std::vector<std::jthread> ts;
        for (int i = 0; i < 16; ++i) ts.emplace_back([&] { c.handle({"m3", 500}); });
        ts.clear();
        check(c.total_charged == 500, "16 concurrent redeliveries -> one charge");
    }
    { PaymentConsumer c; c.handle({"a", 1}); c.handle({"b", 2}); check(c.total_charged == 3, "different messages are not deduped"); }
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS duplicate delivery charges once
PASS crash after effect, before ack -> still one charge
PASS 16 concurrent redeliveries -> one charge
PASS different messages are not deduped
0 failure(s)
```

### Interview answer
"At-least-once delivery means duplicates are guaranteed eventually, so I test them explicitly: the same message twice, a lost response followed by a retry, a crash after the side effect but before the ack, and many concurrent copies — each must produce exactly one effect, while a crash before the effect must still lead to processing. That only passes when the dedupe record and the effect commit atomically, for example in one transaction or behind a unique constraint."

---

## 5. Message queue/event handler tests: ordering, duplication, retry, DLQ

**In one sentence:** test event handlers for **out-of-order** delivery, **duplicates**, **transient failures with retries**, **poison messages** that must end up in the **dead-letter queue (DLQ)**, and that one bad message doesn't block the rest.

### In plain words
A post office test: letters arrive in the wrong order, some twice, some damaged. The sorting room should still get every good letter to the right place, retry when the van is late, and put unreadable letters in a separate bin instead of stopping all work.

### How it works
| Concern | What to test |
|---|---|
| **Ordering** | events for one key arrive out of order (`Shipped` before `Paid`) → handler uses **version/sequence numbers** and ignores stale ones, or buffers; per-partition ordering in Kafka only holds **per key** |
| **Duplication** | redelivery → idempotent effect ([section 4](#4-idempotency-tests-and-at-least-once-delivery-failure-cases)) |
| **Retry** | transient error → retried with backoff, eventually succeeds; retry count respected |
| **DLQ** | permanent error / poison payload → moved to DLQ after N attempts with the error reason; the queue keeps flowing |
| **Schema evolution** | old and new event versions both handled |
| **Backpressure** | slow consumer → bounded in-flight messages, no memory explosion |

- Test at two levels: **handler unit tests** (feed events directly, in any order) and **integration tests** with a real broker in a container (Kafka, RabbitMQ, LocalStack SQS).
- Make retries **visible**: log attempt number and message ID; alert on DLQ growth.

#### Modern C++ example — out-of-order events, a transient failure with retry, and a poison message going to the DLQ
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <deque>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>

struct Event { std::string order; int version; std::string status; int attempts = 0; };

class OrderProjection {                                 // keeps the latest status per order
public:
    void apply(const Event& e) {
        if (e.status.empty()) throw std::invalid_argument("poison: empty status");          // permanent
        if (e.status == "Shipped" && flaky_shipping_api_ && flaky_calls_++ == 0) throw std::runtime_error("transient: carrier API timeout");
        auto& cur = latest_[e.order];
        if (e.version <= cur.first) return;              // stale or duplicate -> ignore
        cur = {e.version, e.status};
    }
    std::string status(const std::string& order) { return latest_[order].second; }
    bool flaky_shipping_api_ = true;
private:
    std::map<std::string, std::pair<int, std::string>> latest_;
    int flaky_calls_ = 0;
};

struct Consumer {
    OrderProjection& proj;
    std::vector<Event> dlq = {};
    int retries = 0;
    void run(std::deque<Event> queue, int max_attempts) {
        while (!queue.empty()) {
            Event e = queue.front(); queue.pop_front();
            try { proj.apply(e); }
            catch (const std::invalid_argument&) { dlq.push_back(e); }                       // don't retry poison
            catch (const std::runtime_error&) {
                if (++e.attempts < max_attempts) { ++retries; queue.push_back(e); }          // retry later
                else dlq.push_back(e);
            }
        }
    }
};

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    OrderProjection proj;
    Consumer c{proj};
    c.run({{"o1", 3, "Shipped"}, {"o1", 1, "Created"}, {"o1", 2, "Paid"}, {"o1", 2, "Paid"},   // out of order + duplicate
           {"o2", 1, ""},                                                                       // poison
           {"o3", 1, "Created"}}, 3);
    check(proj.status("o1") == "Shipped", "out-of-order events end in the newest state");
    check(c.retries == 1, "transient failure retried once");
    check(c.dlq.size() == 1 && c.dlq[0].order == "o2", "poison message moved to the DLQ");
    check(proj.status("o3") == "Created", "a poison message didn't block later messages");
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS out-of-order events end in the newest state
PASS transient failure retried once
PASS poison message moved to the DLQ
PASS a poison message didn't block later messages
0 failure(s)
```

### Interview answer
"For event handlers I test the delivery anomalies directly: out-of-order events, which I handle with per-key version numbers that ignore stale updates; duplicates, which must be idempotent; transient errors, which are retried with backoff up to a limit; and poison messages, which go to a dead-letter queue with the reason so the rest of the queue keeps flowing. I unit-test the handler with crafted sequences and run a few integration tests against a real broker in a container."

---

## 6. Property-based tests, fuzz testing, and boundary-value analysis

**In one sentence:** **boundary-value analysis** picks inputs at and around the **edges** of valid ranges, **property-based testing** checks that a **rule holds for hundreds of generated inputs** (and shrinks failures to the smallest case), and **fuzzing** throws **random or mutated bytes** at code to find crashes and security bugs.

### In plain words
- Boundary values: if a lift holds 1–8 people, test 0, 1, 8 and 9 — that's where bugs live.
- Property-based: instead of "sort([3,1,2]) = [1,2,3]", say "for **any** list, the sorted result is ordered and has the same elements", and let the computer try 1,000 lists.
- Fuzzing: give a parser a million weird files and see which one makes it crash.

### How it works
**Boundary-value analysis (BVA)** with **equivalence partitioning**: split inputs into classes that behave the same (invalid-low, valid, invalid-high), then test **min − 1, min, min + 1, max − 1, max, max + 1**, plus empty, zero, one, many, max-size, and special values (negative, NaN, unicode, very long strings).

**Property-based testing** — tools: RapidCheck (C++), Hypothesis (Python), QuickCheck (Haskell), proptest (Rust), jqwik (Java). Common properties:
| Property | Example |
|---|---|
| **Round-trip** | `decode(encode(x)) == x` (serializers, compression) |
| **Invariant** | sorted output is ordered and a permutation of the input |
| **Oracle** | fast implementation == slow obvious implementation |
| **Idempotence** | `normalize(normalize(x)) == normalize(x)` |
| **Commutativity / metamorphic** | `sum(shuffle(v)) == sum(v)` |

**Fuzzing** — coverage-guided fuzzers (**libFuzzer**, **AFL++**, honggfuzz) mutate inputs to reach new code paths; combine with **AddressSanitizer/UBSan** to turn silent memory bugs into crashes. **OSS-Fuzz** runs this continuously for big open-source projects. Best targets: parsers, decoders, protocol handlers, anything reading untrusted input. A libFuzzer target is just:
```text
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) { parse(data, size); return 0; }
// clang++ -g -fsanitize=fuzzer,address fuzz.cpp && ./a.out corpus/
```

#### Modern C++ example — boundary values, a property test with shrinking, and a mini random fuzzer
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <optional>
#include <random>
#include <string>
#include <vector>

// Under test 1: quantity must be 1..8 (a lift).
bool valid_passengers(int n) { return n >= 1 && n <= 8; }

// Under test 2: run-length encoding with a hidden bug for counts >= 10 (writes 2 digits, decoder reads 1).
std::string rle_encode(const std::string& s) {
    std::string out;
    for (std::size_t i = 0; i < s.size();) {
        std::size_t j = i; while (j < s.size() && s[j] == s[i]) ++j;
        out += std::to_string(j - i) + s[i]; i = j;
    }
    return out;
}
std::string rle_decode(const std::string& s) {
    std::string out;
    for (std::size_t i = 0; i + 1 < s.size(); i += 2) out += std::string(s[i] - '0', s[i + 1]);   // BUG: single digit
    return out;
}

// Under test 3: a parser that must never crash on any input.
std::optional<int> parse_port(const std::string& s) {
    if (s.empty() || s.size() > 5 || !std::all_of(s.begin(), s.end(), ::isdigit)) return std::nullopt;
    int v = std::stoi(s);
    if (v < 1 || v > 65535) return std::nullopt;
    return v;
}

int main() {
    std::cout << "boundary values:";
    for (int n : {0, 1, 2, 7, 8, 9}) std::cout << ' ' << n << '=' << (valid_passengers(n) ? "ok" : "no");
    std::cout << '\n';

    std::mt19937 rng(7);
    std::optional<std::string> failing;
    for (int i = 0; i < 500 && !failing; ++i) {                    // property: decode(encode(x)) == x
        std::string x;
        int len = std::uniform_int_distribution<>(0, 30)(rng);
        for (int k = 0; k < len; ++k) x += "ab"[std::uniform_int_distribution<>(0, 1)(rng) > 0 && k % 7 != 0 ? 0 : 1];
        if (rle_decode(rle_encode(x)) != x) failing = x;
    }
    if (failing) {
        std::string small = *failing;                               // shrink: drop chars while it still fails
        for (bool shrunk = true; shrunk;) {
            shrunk = false;
            for (std::size_t i = 0; i < small.size(); ++i) {
                std::string t = small.substr(0, i) + small.substr(i + 1);
                if (rle_decode(rle_encode(t)) != t) { small = t; shrunk = true; break; }
            }
        }
        std::cout << "round-trip property FAILED; shrunk counterexample: \"" << small << "\" (" << small.size() << " chars)\n";
    }

    int crashes = 0, accepted = 0;                                  // fuzz: random bytes must never crash
    for (int i = 0; i < 20000; ++i) {
        std::string s;
        int len = std::uniform_int_distribution<>(0, 8)(rng);
        for (int k = 0; k < len; ++k) s += static_cast<char>(std::uniform_int_distribution<>(32, 126)(rng));
        if (i % 3 == 0) s = std::to_string(std::uniform_int_distribution<>(-10, 70000)(rng));
        try { accepted += parse_port(s).has_value(); } catch (...) { ++crashes; }
    }
    std::cout << "fuzzed parse_port 20000 times: " << crashes << " crashes, " << accepted << " valid ports\n";
}
```

**Output:**
```text
boundary values: 0=no 1=ok 2=ok 7=ok 8=ok 9=no
round-trip property FAILED; shrunk counterexample: "bbbbbbbbbb" (10 chars)
fuzzed parse_port 20000 times: 0 crashes, 6402 valid ports
```

The property test found the bug no hand-written example covered (a run of 10+ characters) and **shrank** it to the smallest failing input.

### Interview answer
"I use boundary-value analysis with equivalence classes to pick inputs at and around every edge — min−1, min, max, max+1, empty, huge. Property-based tests state rules like round-trip, invariants or 'fast equals slow' and check them on hundreds of generated inputs, shrinking failures to a minimal case. For code that parses untrusted input I add coverage-guided fuzzing with libFuzzer or AFL++ under AddressSanitizer, ideally running continuously."

---

## 7. Testcontainers, ephemeral environments, and service virtualization

**In one sentence:** **Testcontainers** starts **real dependencies** (Postgres, Kafka, Redis) in throwaway Docker containers from test code, **ephemeral environments** spin up a **full copy of the system per pull request**, and **service virtualization** replaces **third-party or unavailable services** with programmable fakes (WireMock, Hoverfly, LocalStack).

### In plain words
Instead of sharing one test kitchen with every cook (and fighting over the oven), each cook gets a fresh, identical pop-up kitchen for their dish, and the expensive ingredient supplier is replaced by a realistic stand-in.

### How it works
| Tool / approach | What you get | Typical use |
|---|---|---|
| **Testcontainers** (Java, Go, .NET, Node, Python, Rust; C++ via scripts/Docker Compose) | real Postgres/Kafka/Redis per test run, random ports, cleaned up after | integration tests in CI and on laptops |
| **Docker Compose** in CI | a small set of services for the suite | E2E smoke tests |
| **Ephemeral / preview environments** (Kubernetes namespace per PR, Vercel/Render previews, Argo CD ApplicationSets) | the whole system deployed from the branch | manual QA, E2E, demos; destroyed on merge |
| **Service virtualization** (WireMock, MockServer, Hoverfly, Mountebank, **LocalStack** for AWS) | HTTP/gRPC/cloud APIs that return recorded or scripted responses, latency and errors | payment gateways, partner APIs, rate-limited or paid services |
| **Record & replay** | capture real responses once, replay in tests | stable fixtures for complex APIs (keep them refreshed) |

- Prefer **real** dependencies you own (your DB, your queue) and **virtualize** what you don't own.
- Keep environments **reproducible**: pinned image tags (`postgres:16.4`, never `latest`), seeded data, migrations applied on start.
- Cost/speed: reuse a container per test **suite** and isolate per test with transactions/unique names.
- Virtual services must stay honest — back them with **contract tests** against the real provider ([section 1](#1-api-contract-tests-schema-compatibility-and-consumer-driven-contracts)).

#### Modern C++ example — a virtualized payment API with scripted scenarios (latency, errors) for integration tests
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct HttpResponse { int status; std::string body; int latency_ms; };

class VirtualService {                                 // like a tiny WireMock: request matcher -> scripted responses
public:
    void stub(const std::string& path, std::vector<HttpResponse> script) { scripts_[path] = std::move(script); }
    HttpResponse call(const std::string& path) {
        auto& s = scripts_.at(path);
        auto& i = cursor_[path];
        HttpResponse r = s[std::min(i, s.size() - 1)];  // play the script, then repeat the last answer
        ++i; ++calls_[path];
        return r;
    }
    int calls(const std::string& path) { return calls_[path]; }
private:
    std::map<std::string, std::vector<HttpResponse>> scripts_;
    std::map<std::string, std::size_t> cursor_;
    std::map<std::string, int> calls_;
};

// Code under test: calls the payment provider with a 1-second timeout and 3 attempts.
std::string pay(VirtualService& provider) {
    for (int attempt = 1; attempt <= 3; ++attempt) {
        HttpResponse r = provider.call("/v1/charges");
        if (r.latency_ms > 1000) continue;             // treated as timeout
        if (r.status == 200) return "paid";
        if (r.status == 402) return "card declined";   // don't retry business errors
    }
    return "provider unavailable";
}

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    { VirtualService v; v.stub("/v1/charges", {{200, "{}", 80}});
      check(pay(v) == "paid", "happy path"); }
    { VirtualService v; v.stub("/v1/charges", {{503, "", 50}, {200, "{}", 3000}, {200, "{}", 90}});
      check(pay(v) == "paid" && v.calls("/v1/charges") == 3, "503 then timeout then success -> retried twice"); }
    { VirtualService v; v.stub("/v1/charges", {{402, "card_declined", 70}});
      check(pay(v) == "card declined" && v.calls("/v1/charges") == 1, "402 is not retried"); }
    { VirtualService v; v.stub("/v1/charges", {{500, "", 40}});
      check(pay(v) == "provider unavailable" && v.calls("/v1/charges") == 3, "persistent 500 -> gives up after 3"); }
    std::cout << failures << " failure(s); no real money moved, every scenario reproducible\n";
}
```

**Output:**
```text
PASS happy path
PASS 503 then timeout then success -> retried twice
PASS 402 is not retried
PASS persistent 500 -> gives up after 3
0 failure(s); no real money moved, every scenario reproducible
```

A Testcontainers test in Java looks like this, for comparison:
```text
@Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16.4");
// db.getJdbcUrl() -> connect, run migrations, test real SQL; container is removed after the run
```

### Interview answer
"For integration tests I start real dependencies I own — Postgres, Kafka, Redis — with Testcontainers or Compose using pinned image versions, so tests are realistic and identical on laptops and CI. For each pull request an ephemeral environment deploys the whole system for E2E and review, and is destroyed on merge. Third-party or paid APIs are virtualized with tools like WireMock or LocalStack, scripted for errors and latency, and kept honest with contract tests against the real provider."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Contracts | additive changes only; tolerant readers; `buf breaking` / schema registry; Pact consumer-driven contracts in provider CI |
| Concurrency | barrier start, many rounds, check invariants, ThreadSanitizer |
| Fault injection | seeded faulty decorators / Toxiproxy / netem; assert degraded behaviour, not just "no crash" |
| DB tests | same engine + version in a container; rollback per test; test constraints and isolation |
| Migrations | from scratch + on production-like data; duration; expand–contract; rollback plan |
| Idempotency | duplicate, lost response, crash before ack, concurrent copies → exactly one effect |
| Queues | out of order (versions), duplicates, retries with limit, poison → DLQ, queue keeps flowing |
| BVA | min−1, min, min+1, max−1, max, max+1, empty, huge |
| Property-based | round-trip, invariants, oracle, idempotence; shrinking |
| Fuzzing | libFuzzer / AFL++ + ASan/UBSan on parsers; OSS-Fuzz |
| Environments | Testcontainers for owned deps; preview env per PR; virtualize third parties; pin image tags |
