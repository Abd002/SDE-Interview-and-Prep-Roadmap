# Event-Driven Architecture (EDA) — Basics, Components, Advantages and Implementations

> **What you'll learn:** what an event is and how event-driven systems work, the **components** (producers, channels/brokers, consumers, event store, schemas), the **advantages** (and costs), related patterns (**event sourcing**, **CQRS**), and how EDA is **implemented with Apache Kafka** — with C++ models throughout.
>
> **Prerequisites:** [Message Queuing](./Message-Queuing.md). The in-process version of the idea: [Event-driven programming](../Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#6-event-driven-programming) and the [Observer pattern](../System%20Design/Design%20Patterns/Behavioral-Patterns.md#6-observer).

## Table of Contents
1. [Basics](#1-basics)
2. [Components](#2-components)
3. [Advantages](#3-advantages)
4. [Implementations (e.g., Apache Kafka)](#4-implementations-eg-apache-kafka)
5. [Cheat sheet](#cheat-sheet)

---

## 1. Basics

**In one sentence:** in event-driven architecture, services communicate by **publishing events** — facts about something that happened ("OrderPlaced") — and other services **react** to the events they care about, without the publisher knowing who they are.

### In plain words
A town **announcement board**. When the bakery has fresh bread, it pins a note: *"Fresh bread at 7:00"*. It doesn't phone every customer. Whoever cares — the café, the school kitchen, hungry neighbors — reads the board and reacts in their own way. Tomorrow a new sandwich shop can start reading the board without the bakery changing anything.

Compare with a **request/command** style: "Café, buy 20 loaves now!" — the sender must know the receiver and wait for the answer.

### How it works
- An **event** is an immutable record of a **past fact**: name + data + metadata (id, timestamp, source, schema version):
  ```json
  { "type": "OrderPlaced", "id": "evt-9f3", "time": "2024-06-01T10:15:00Z",
    "data": { "orderId": 42, "customerId": 7, "total": 59.99 } }
  ```
- **Event vs. command vs. query:** event = "this happened" (past tense, any number of listeners); command = "do this" (one handler, may be refused); query = "tell me".
- **Event styles:**
  - **Event notification** — thin event ("Order 42 changed"); consumers call back for details.
  - **Event-carried state transfer** — the event carries the needed data, so consumers don't call back.
  - **Event sourcing** — the event log *is* the source of truth; state is rebuilt by replaying events.
- **Topologies:** **broker** (choreography — everyone reacts to events) vs. **mediator** (an orchestrator reacts and emits commands) — see [Choreography vs. Orchestration](../System%20Design/Microservices-Explained.md#1-choreography-vs-orchestration).
- Communication is **asynchronous** → the system is **eventually consistent**.

### Modern C++ example — publishers and subscribers that don't know each other
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Event { std::string type; int order_id; double total; };

class EventBroker {
public:
    void subscribe(const std::string& type, std::function<void(const Event&)> handler) {
        handlers_[type].push_back(std::move(handler));
    }
    void publish(const Event& e) {                       // the publisher doesn't know who listens
        std::cout << "published " << e.type << " #" << e.order_id << '\n';
        for (auto& h : handlers_[e.type]) h(e);
    }
private:
    std::map<std::string, std::vector<std::function<void(const Event&)>>> handlers_;
};

int main() {
    EventBroker broker;
    broker.subscribe("OrderPlaced", [](const Event& e) { std::cout << "  email: receipt for order " << e.order_id << '\n'; });
    broker.subscribe("OrderPlaced", [](const Event& e) { std::cout << "  inventory: reserve items for " << e.order_id << '\n'; });
    broker.subscribe("OrderPlaced", [](const Event& e) { std::cout << "  analytics: revenue += " << e.total << '\n'; });

    // The order service's code is just this line — it has no idea three services reacted.
    broker.publish({"OrderPlaced", 42, 59.99});
}
```

**Output:**
```text
published OrderPlaced #42
  email: receipt for order 42
  inventory: reserve items for 42
  analytics: revenue += 59.99
```

### Interview answer
"Event-driven architecture structures a system around the production and consumption of events — immutable facts about state changes. Producers publish events to a broker without knowing consumers, and consumers react asynchronously, which decouples services in space and time and leads to eventual consistency. Events can be thin notifications, carry state, or form the source of truth in event sourcing."

---

## 2. Components

**In one sentence:** an event-driven system has **event producers**, an **event channel/broker**, **event consumers (processors)**, and usually an **event store**, **schemas/registry**, and **dead-letter/monitoring** infrastructure.

### In plain words
The announcement board again: the **bakery** (producer) writes notes; the **board** (broker/channel) holds them; **readers** (consumers) react; the **archive box** under the board keeps old notes (event store); a **rule sheet** says how notes must be written so everyone can read them (schema).

### How it works
| Component | Role | Examples |
|---|---|---|
| **Event producer** | Detects a state change and publishes an event | Order service, IoT sensor, database CDC (Debezium) |
| **Event** | Immutable fact with type, payload, metadata | `OrderPlaced`, `PaymentFailed` |
| **Event channel / broker (event bus)** | Transports, buffers, routes, persists events; decouples producers/consumers | Apache Kafka, RabbitMQ, AWS EventBridge/SNS+SQS, Google Pub/Sub, Azure Event Grid, NATS |
| **Event consumer / processor** | Subscribes and reacts: updates its own data, triggers actions, emits new events | Email service, stream processors (Kafka Streams, Flink) |
| **Event store** | Durable, ordered, replayable history of events | Kafka topics with retention, EventStoreDB |
| **Schema & registry** | Contract for event formats and versioning (backward/forward compatible) | Avro/Protobuf/JSON Schema + Confluent Schema Registry, CloudEvents spec |
| **Dead-letter queue, retries, monitoring, tracing** | Handle failed events, observe lag and flows | DLQ topics, consumer-lag dashboards, OpenTelemetry |

Design details that matter: **idempotent consumers** (at-least-once delivery means duplicates), **ordering** per key/partition, **schema evolution** (add optional fields, never repurpose), and the **transactional outbox** pattern — write the business change and the event to the same database transaction, then a relay publishes it, so you never "save the order but lose the event".

### Modern C++ example — outbox relay + idempotent consumer
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct Event { std::string id, type; int order_id; };

// Producer side: the order and its event are saved in ONE local transaction (the outbox).
struct OrderDatabase {
    std::vector<int> orders;
    std::vector<Event> outbox;
    void place_order(int id) { orders.push_back(id); outbox.push_back({"evt-" + std::to_string(id), "OrderPlaced", id}); }
};

// Consumer side: remembers processed event ids, so redelivered duplicates are ignored.
struct IdempotentConsumer {
    std::set<std::string> processed;
    int emails_sent = 0;
    void handle(const Event& e) {
        if (!processed.insert(e.id).second) { std::cout << "  duplicate " << e.id << " ignored\n"; return; }
        ++emails_sent;
        std::cout << "  email sent for order " << e.order_id << '\n';
    }
};

int main() {
    OrderDatabase db;
    db.place_order(1);
    db.place_order(2);

    IdempotentConsumer email;
    // The outbox relay publishes events; the broker redelivers event 1 (at-least-once).
    for (const auto& e : db.outbox) email.handle(e);
    email.handle(db.outbox[0]);
    std::cout << "orders: " << db.orders.size() << ", emails: " << email.emails_sent << " (exactly one per order)\n";
}
```

**Output:**
```text
  email sent for order 1
  email sent for order 2
  duplicate evt-1 ignored
orders: 2, emails: 2 (exactly one per order)
```

### Interview answer
"The components are event producers, the events themselves, an event channel or broker that routes and persists them, consumers or stream processors that react, an event store for replayable history, and schemas with a registry for compatible evolution, plus DLQs and observability. Key practices are idempotent consumers, per-key ordering, schema evolution rules and the transactional outbox to publish reliably."

---

## 3. Advantages

**In one sentence:** EDA gives **loose coupling**, **independent scalability**, **extensibility**, **resilience to downstream failures**, **real-time responsiveness**, and a **replayable audit trail** — at the cost of eventual consistency and harder debugging.

### How it works
| Advantage | Why |
|---|---|
| **Loose coupling** | Producers don't know consumers; teams evolve services independently |
| **Extensibility** | Add a new consumer (fraud detection, analytics) without changing producers |
| **Temporal decoupling / resilience** | If the email service is down, events wait in the broker; nothing is lost and the order service keeps working |
| **Scalability** | Consumers scale horizontally (consumer groups/partitions); bursts are buffered |
| **Real-time reactions** | React to changes as they happen (notifications, fraud alerts, dashboards) |
| **Audit & replay** | A durable event log records *what happened*; rebuild state, fix bugs by reprocessing, create new read models from history (**event sourcing**, **CQRS**) |

**Costs to mention:** eventual consistency, harder end-to-end debugging (needs [distributed tracing](../System%20Design/Distributed-Systems.md#4-distributed-tracing)), duplicate/out-of-order handling, schema governance, and "event spaghetti" when flows become implicit.

**CQRS** (Command Query Responsibility Segregation) separates the **write model** (handles commands, emits events) from one or more **read models** (projections built from events, optimized for queries).

### Modern C++ example — event sourcing: state rebuilt from the event log, and a new read model from history
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <variant>
#include <vector>

struct Deposited { std::string account; int amount; };
struct Withdrawn { std::string account; int amount; };
using Event = std::variant<Deposited, Withdrawn>;
template <class... Fs> struct overloaded : Fs... { using Fs::operator()...; };

int main() {
    // The append-only event log IS the source of truth.
    const std::vector<Event> log{Deposited{"ana", 100}, Deposited{"ben", 50}, Withdrawn{"ana", 30},
                                 Deposited{"ana", 20}, Withdrawn{"ben", 10}};

    // Read model 1: current balances (rebuilt by replaying events).
    std::map<std::string, int> balance;
    for (const auto& e : log)
        std::visit(overloaded{[&](const Deposited& d) { balance[d.account] += d.amount; },
                              [&](const Withdrawn& w) { balance[w.account] -= w.amount; }}, e);
    for (const auto& [acct, b] : balance) std::cout << acct << " balance: " << b << '\n';

    // Read model 2, added LATER: "number of withdrawals" — computed from full history, no migration needed.
    std::map<std::string, int> withdrawals;
    for (const auto& e : log)
        if (auto w = std::get_if<Withdrawn>(&e)) ++withdrawals[w->account];
    for (const auto& [acct, n] : withdrawals) std::cout << acct << " withdrawals: " << n << '\n';
}
```

**Output:**
```text
ana balance: 90
ben balance: 40
ana withdrawals: 1
ben withdrawals: 1
```

### Interview answer
"EDA's advantages are loose coupling between producers and consumers, easy extension by adding consumers, temporal decoupling so failures are buffered rather than cascading, independent horizontal scaling, real-time reactivity, and a durable, replayable event log enabling auditing, event sourcing and CQRS read models. The trade-offs are eventual consistency, harder debugging and the need for idempotency and schema governance."

---

## 4. Implementations (e.g., Apache Kafka)

**In one sentence:** Apache Kafka is the most common backbone for EDA: a distributed, replicated, partitioned event log where producers append events to **topics**, events are **retained**, and **consumer groups** read at their own pace using **offsets**.

### In plain words
Kafka is a set of giant, ever-growing **diaries** (topics), each split into several **volumes** (partitions) spread over many servers, with copies for safety. Anyone can add an entry at the end; any team can read any diary from any page, keeping their own **bookmark**. Entries aren't erased when read — they stay for days, months, or forever.

### How it works
- **Topics** (e.g. `orders`), divided into **partitions** for parallelism; each partition is an ordered, append-only log.
- **Keys** decide the partition (`hash(key) % partitions`) → events with the same key (e.g. `order-42`) keep their **order**.
- **Replication:** each partition has a leader and followers on other brokers; `acks=all` + `min.insync.replicas` for durability.
- **Consumer groups:** partitions are split among the group's consumers; each group gets its own copy of the stream; **offsets** record progress (committed after processing → at-least-once).
- **Retention** by time/size, or **log compaction** (keep only the latest event per key — great for "current state" topics).
- **Exactly-once processing** within Kafka via idempotent producers + transactions.
- Ecosystem: **Kafka Connect** (import/export: databases via CDC/Debezium, S3, Elasticsearch), **Kafka Streams / ksqlDB / Apache Flink** (stateful stream processing: joins, windows, aggregations), **Schema Registry**.
- Alternatives: AWS Kinesis/EventBridge, Google Pub/Sub, Azure Event Hubs (Kafka-compatible), Apache Pulsar, Redpanda (Kafka API).

### Modern C++ example — keyed partitions, consumer-group rebalancing and log compaction
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Record { std::string key, value; };

std::uint32_t stable_hash(const std::string& s) {         // deterministic across platforms
    std::uint32_t h = 2166136261u;
    for (unsigned char c : s) { h ^= c; h *= 16777619u; }
    return h;
}

struct Topic {
    std::vector<std::vector<Record>> partitions;
    explicit Topic(std::size_t n) : partitions(n) {}
    std::size_t produce(const Record& r) {
        std::size_t p = stable_hash(r.key) % partitions.size();
        partitions[p].push_back(r);
        return p;
    }
    // Log compaction: keep only the LATEST record per key (a "current state" topic)
    std::map<std::string, std::string> compacted() const {
        std::map<std::string, std::string> latest;
        for (const auto& part : partitions) for (const auto& r : part) latest[r.key] = r.value;
        return latest;
    }
};

// Assign partitions to the consumers of a group (round-robin assignment)
std::map<std::string, std::vector<std::size_t>> assign(std::size_t partitions, const std::vector<std::string>& consumers) {
    std::map<std::string, std::vector<std::size_t>> a;
    for (std::size_t p = 0; p < partitions; ++p) a[consumers[p % consumers.size()]].push_back(p);
    return a;
}

void print_assignment(const std::map<std::string, std::vector<std::size_t>>& a) {
    for (const auto& [c, ps] : a) {
        std::cout << "  " << c << " reads partitions";
        for (auto p : ps) std::cout << ' ' << p;
        std::cout << '\n';
    }
}

int main() {
    Topic orders(4);
    for (const auto& [key, status] : std::vector<std::pair<std::string, std::string>>{
             {"order-42", "placed"}, {"order-7", "placed"}, {"order-42", "paid"}, {"order-42", "shipped"}, {"order-7", "cancelled"}}) {
        std::size_t p = orders.produce({key, status});
        std::cout << key << " -> " << status << " (partition " << p << ")\n";
    }
    std::cout << "all events of order-42 are in ONE partition, so their order is preserved\n";

    std::cout << "consumer group 'shipping' with 2 consumers:\n";
    print_assignment(assign(4, {"c1", "c2"}));
    std::cout << "a third consumer joins -> rebalance:\n";
    print_assignment(assign(4, {"c1", "c2", "c3"}));

    std::cout << "compacted topic (latest state per key):\n";
    for (const auto& [k, v] : orders.compacted()) std::cout << "  " << k << " = " << v << '\n';
}
```

**Output:**
```text
order-42 -> placed (partition 0)
order-7 -> placed (partition 3)
order-42 -> paid (partition 0)
order-42 -> shipped (partition 0)
order-7 -> cancelled (partition 3)
all events of order-42 are in ONE partition, so their order is preserved
consumer group 'shipping' with 2 consumers:
  c1 reads partitions 0 2
  c2 reads partitions 1 3
a third consumer joins -> rebalance:
  c1 reads partitions 0 3
  c2 reads partitions 1
  c3 reads partitions 2
compacted topic (latest state per key):
  order-42 = shipped
  order-7 = cancelled
```

### Interview answer
"Kafka implements EDA as a distributed, replicated commit log: producers append keyed events to partitioned topics, which preserves per-key ordering; events are retained or compacted, and consumer groups divide partitions among members and track offsets, enabling horizontal scaling, independent consumers and replay. With Kafka Connect for CDC integration, Kafka Streams or Flink for stream processing, a schema registry and idempotent/transactional producers, it's the typical backbone for event-driven microservices."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Event | Immutable fact that something happened (past tense) |
| Producer / broker / consumer | Publishes / transports & stores / reacts |
| Event notification vs state transfer | Thin "something changed" vs event carries the data |
| Event sourcing | The event log is the source of truth; state = replay |
| CQRS | Separate write model from read models (projections) |
| Outbox pattern | Save state + event in one DB transaction, relay later |
| Idempotent consumer | Handles duplicates safely (at-least-once) |
| Kafka | Topics → partitions (key ordering), retention/compaction, consumer groups + offsets |
