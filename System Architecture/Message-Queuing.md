# Message Queuing — Basics, Use Cases and Implementations (RabbitMQ, Kafka)

> **What you'll learn:** what a message queue is (producers, consumers, brokers, acknowledgements, delivery guarantees, dead-letter queues), **when to use one**, and how the two most popular **implementations — RabbitMQ and Apache Kafka** — work and differ. Each part has a runnable C++ model.
>
> **Prerequisites:** [Threads](../Operating%20Systems/Threads.md) and [monitors/condition variables](../Operating%20Systems/Thread-Synchronization.md#3-monitors-mutex--condition-variable) help for the first example.

## Table of Contents
1. [Basics](#1-basics)
2. [Use cases](#2-use-cases)
3. [Implementations (e.g., RabbitMQ, Kafka)](#3-implementations-eg-rabbitmq-kafka)
4. [Cheat sheet](#cheat-sheet)

---

## 1. Basics

**In one sentence:** a message queue lets one program (**producer**) send messages to another (**consumer**) **asynchronously** through an intermediary (**broker**) that stores messages until they're processed.

### In plain words
A restaurant's **order ticket rail**. Waiters (producers) clip order tickets onto the rail and immediately go back to customers — they don't wait for the dish to be cooked. Cooks (consumers) take tickets off the rail when they're ready. If the dinner rush brings 100 orders at once, they wait on the rail instead of overwhelming the cooks, and if a cook leaves, the tickets are still there for the next cook.

### How it works
- **Producer** publishes a message (usually a small JSON/Protobuf payload: "OrderPlaced #42").
- **Broker** (RabbitMQ, Kafka, Amazon SQS, Google Pub/Sub, Azure Service Bus, ActiveMQ) stores it durably in a **queue** or **topic**.
- **Consumer** receives it, processes it, then **acknowledges (ack)** it. Unacknowledged messages are **redelivered** (e.g. if the consumer crashed).
- **Point-to-point (queue):** each message goes to **one** consumer — competing consumers share the work.
- **Publish/subscribe (topic):** each message goes to **every** subscriber group (fan-out).

**Delivery guarantees**
| Guarantee | Meaning | Cost |
|---|---|---|
| **At-most-once** | Ack before processing; may **lose** messages | Fast, simplest |
| **At-least-once** (most common) | Ack after processing; may **duplicate** on retry | Consumers must be **idempotent** |
| **Exactly-once** | Each message's effect happens once | Expensive; Kafka transactions, or at-least-once + idempotent/deduplicating consumers ("effectively once") |

Other key concepts:
- **Dead-letter queue (DLQ):** after N failed attempts, move the "poison" message aside so it doesn't block the queue; inspect later.
- **Ordering:** usually only guaranteed per queue/partition, not globally.
- **Backpressure / prefetch:** limit how many unacked messages a consumer holds.
- **Retention & TTL:** how long messages are kept.

### Modern C++ example — broker with ack, redelivery and a dead-letter queue
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <optional>
#include <queue>
#include <string>
#include <thread>
#include <vector>

struct Message { int id; std::string body; int attempts = 0; };

class Broker {
public:
    void publish(Message m) {
        { std::scoped_lock l(m_); queue_.push(std::move(m)); }
        cv_.notify_one();
    }
    std::optional<Message> receive() {                        // blocks until a message or shutdown
        std::unique_lock l(m_);
        cv_.wait(l, [&] { return !queue_.empty() || closed_; });
        if (queue_.empty()) return std::nullopt;
        Message m = std::move(queue_.front());
        queue_.pop();
        return m;
    }
    void nack(Message m) {                                    // processing failed: retry or dead-letter
        std::scoped_lock l(m_);
        if (++m.attempts >= kMaxAttempts) dead_letters_.push_back(m);
        else queue_.push(m);
        close_if_done();
        cv_.notify_one();
    }
    void ack() { std::scoped_lock l(m_); ++acked_; close_if_done(); }
    void expect(std::size_t n) { expected_ = n; }
    std::size_t acked() const { std::scoped_lock l(m_); return acked_; }
    std::vector<Message> dead_letters() const { std::scoped_lock l(m_); return dead_letters_; }
private:
    void close_if_done() {                                    // caller holds the lock
        if (acked_ + dead_letters_.size() == expected_) { closed_ = true; cv_.notify_all(); }
    }
    static constexpr int kMaxAttempts = 3;
    mutable std::mutex m_;
    std::condition_variable cv_;
    std::queue<Message> queue_;
    std::vector<Message> dead_letters_;
    std::size_t acked_ = 0, expected_ = 0;
    bool closed_ = false;
};

int main() {
    Broker broker;
    broker.expect(6);
    for (int i = 1; i <= 6; ++i) broker.publish({i, i == 4 ? "corrupt-payload" : "order #" + std::to_string(i)});

    {
        std::vector<std::jthread> consumers;                  // competing consumers share the work
        for (int c = 0; c < 2; ++c)
            consumers.emplace_back([&] {
                while (auto m = broker.receive()) {
                    if (m->body == "corrupt-payload") { broker.nack(*m); continue; }   // always fails
                    broker.ack();                                                     // processed OK
                }
            });
    }
    std::cout << "acknowledged: " << broker.acked() << '\n';
    for (const auto& m : broker.dead_letters())
        std::cout << "dead-lettered: message " << m.id << " (" << m.body << ") after " << m.attempts << " attempts\n";
}
```

**Output:**
```text
acknowledged: 5
dead-lettered: message 4 (corrupt-payload) after 3 attempts
```

### Interview answer
"A message queue decouples producers and consumers through a broker that durably buffers messages. Consumers acknowledge after processing and unacked messages are redelivered, which gives at-least-once delivery and requires idempotent consumers; at-most-once and exactly-once are alternatives with different costs. Queues deliver each message to one competing consumer, topics fan out to all subscribers, and dead-letter queues isolate poison messages."

---

## 2. Use cases

**In one sentence:** use a message queue when work can happen **later**, **elsewhere**, or **at a different speed** than the request that triggered it.

### In plain words
You don't make a customer wait at the counter while you bake their cake, print their invoice, update inventory and email a receipt. You take the order, give a ticket number, and let each of those tasks be done by the right person at the right pace.

### How it works
| Use case | Example | Why a queue helps |
|---|---|---|
| **Asynchronous processing** | Resize uploaded images, send emails, generate PDFs, video transcoding | Respond to the user immediately; do slow work in background workers |
| **Load leveling / buffering** | Black-Friday order spike | The queue absorbs bursts; workers process at a steady rate instead of crashing |
| **Decoupling services** | Order service emits `OrderPlaced`; billing, shipping, email subscribe | Producer doesn't know or wait for consumers; services deploy and fail independently |
| **Fan-out / pub-sub** | One event → notifications, analytics, search indexing | Add consumers without touching the producer |
| **Reliable retries** | Calling a flaky third-party API | Failed jobs are redelivered with backoff; DLQ for poison messages |
| **Work distribution** | Many workers pulling tasks | Horizontal scaling: add workers to go faster |
| **Event streaming / logs** | Clickstreams, IoT telemetry, change-data-capture | High-throughput, replayable history (Kafka) |
| **Ordering / serialization** | Per-account transactions in order | Partition by key so related messages stay in order |

When **not** to use one: the caller needs the answer **right now** (synchronous read), or the added latency/complexity isn't justified.

### Modern C++ example — load leveling: a burst of 100 orders vs. a steady worker
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

int main() {
    // Orders arriving per second: a sudden burst at t=2..3
    const std::vector<int> arrivals{5, 5, 50, 50, 5, 5, 0, 0, 0, 0, 0, 0};
    const int worker_capacity = 15;                 // orders the backend can process per second

    int dropped_without_queue = 0;
    std::queue<int> buffer;                         // with a queue
    int processed = 0, max_backlog = 0;

    std::cout << "t  arrive  backlog(queue)\n";
    for (std::size_t t = 0; t < arrivals.size(); ++t) {
        dropped_without_queue += std::max(0, arrivals[t] - worker_capacity);   // direct calls: overload = errors
        for (int i = 0; i < arrivals[t]; ++i) buffer.push(i);
        for (int i = 0; i < worker_capacity && !buffer.empty(); ++i) { buffer.pop(); ++processed; }
        max_backlog = std::max<int>(max_backlog, buffer.size());
        std::cout << t << "  " << arrivals[t] << (arrivals[t] < 10 ? "       " : "      ") << buffer.size() << '\n';
    }
    std::cout << "without a queue: " << dropped_without_queue << " requests failed during the spike\n";
    std::cout << "with a queue: all " << processed << " processed, max backlog " << max_backlog << '\n';
}
```

**Output:**
```text
t  arrive  backlog(queue)
0  5       0
1  5       0
2  50      35
3  50      70
4  5       60
5  5       50
6  0       35
7  0       20
8  0       5
9  0       0
10  0       0
11  0       0
without a queue: 70 requests failed during the spike
with a queue: all 120 processed, max backlog 70
```

### Interview answer
"I use message queues for asynchronous background work, load leveling of bursts, decoupling services via events, fan-out to multiple consumers, reliable retries with dead-lettering, distributing work across scalable workers and high-throughput event streaming. I avoid them where the caller needs an immediate synchronous result."

---

## 3. Implementations (e.g., RabbitMQ, Kafka)

**In one sentence:** **RabbitMQ** is a traditional **message broker** that routes messages to queues and deletes them once consumed; **Apache Kafka** is a distributed, partitioned, **append-only log** where messages are retained and consumers track their own position (offset), so data can be replayed.

### In plain words
- **RabbitMQ = a post office.** Letters arrive at a sorting desk (**exchange**) that routes them by address rules (**bindings/routing keys**) into mailboxes (**queues**). Once you take a letter out and sign for it (**ack**), it's gone.
- **Kafka = a newspaper archive / diary.** Every event is written at the end of a numbered log and **kept** (for days or forever). Each reader keeps a **bookmark** (offset). New readers can start from page 1; a reader who crashed resumes from their bookmark.

### How it works
**RabbitMQ** (AMQP 0-9-1)
- Producer → **exchange** → (bindings) → **queues** → consumers.
- Exchange types: **direct** (exact routing key), **topic** (patterns like `order.*.eu`), **fanout** (to all bound queues), headers.
- Per-message acks, redelivery, **prefetch** limits, priorities, TTL, DLX (dead-letter exchange), delayed messages (plugin).
- Strengths: flexible routing, task queues, request/reply, low latency per message. Throughput: tens of thousands msg/s per node typically.

**Kafka**
- **Topic** split into **partitions**; each partition is an ordered, immutable log with offsets 0, 1, 2…
- Producer chooses a partition by **key hash** → all messages for the same key (e.g. `account-7`) stay **in order** in one partition.
- **Consumer groups:** each partition is consumed by exactly one consumer in a group → parallelism = number of partitions; different groups each get all messages (pub/sub).
- Messages are **retained** by time/size (or compacted by key), not deleted on read → **replay**, reprocessing, new consumers catching up.
- Replication across brokers (leader + followers per partition; KRaft consensus); very high throughput (millions of msg/s) via sequential disk writes and batching.
- Ecosystem: Kafka Connect, Kafka Streams, ksqlDB, Schema Registry.

| | RabbitMQ | Kafka |
|---|---|---|
| Model | Smart broker, queues | Distributed commit log |
| After consumption | Message removed | Message retained (replayable) |
| Routing | Rich (exchanges, bindings) | By topic + partition key |
| Ordering | Per queue | Per partition |
| Consumer state | Broker tracks acks | Consumer group tracks offsets |
| Throughput | High | Very high |
| Best for | Task queues, complex routing, RPC-style work | Event streaming, logs, analytics pipelines, event sourcing, CDC |

Other options: **Amazon SQS/SNS** (managed queue/pub-sub), **Google Pub/Sub**, **Azure Service Bus**, **Redis Streams**, **NATS**, **Apache Pulsar** (log + queue semantics).

### Modern C++ example — RabbitMQ-style topic exchange and a Kafka-style partitioned log
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>

// ---------------- RabbitMQ-style: exchange routes to queues, consumed messages disappear ----------------
bool topic_match(const std::string& pattern, const std::string& key) {       // '*' matches one word
    std::size_t p = 0, k = 0;
    while (p < pattern.size() && k < key.size()) {
        if (pattern[p] == '*') { while (k < key.size() && key[k] != '.') ++k; ++p; }
        else if (pattern[p++] != key[k++]) return false;
    }
    return p == pattern.size() && k == key.size();
}
struct TopicExchange {
    std::map<std::string, std::string> bindings;                              // queue -> pattern
    std::map<std::string, std::queue<std::string>> queues;
    void publish(const std::string& routing_key, const std::string& msg) {
        for (const auto& [q, pattern] : bindings) if (topic_match(pattern, routing_key)) queues[q].push(msg);
    }
};

// ---------------- Kafka-style: partitioned, retained log; consumers keep offsets ----------------
struct Topic {
    std::vector<std::vector<std::string>> partitions;
    explicit Topic(std::size_t n) : partitions(n) {}
    void produce(const std::string& key, const std::string& msg) {
        partitions[std::hash<std::string>{}(key) % partitions.size()].push_back(msg);   // same key -> same partition
    }
};
struct ConsumerGroup {
    std::vector<std::size_t> offsets;                                         // bookmark per partition
    explicit ConsumerGroup(std::size_t n) : offsets(n, 0) {}
    std::vector<std::string> poll(const Topic& t) {
        std::vector<std::string> out;
        for (std::size_t p = 0; p < t.partitions.size(); ++p)
            while (offsets[p] < t.partitions[p].size()) out.push_back(t.partitions[p][offsets[p]++]);
        return out;
    }
};

int main() {
    TopicExchange orders;
    orders.bindings = {{"eu-shipping", "order.*.eu"}, {"all-billing", "order.created.*"}};
    orders.publish("order.created.eu", "order 1 (EU)");
    orders.publish("order.created.us", "order 2 (US)");
    orders.publish("order.cancelled.eu", "order 3 cancelled (EU)");
    for (auto& [q, msgs] : orders.queues) {
        std::cout << "RabbitMQ queue " << q << ":";
        while (!msgs.empty()) { std::cout << " [" << msgs.front() << "]"; msgs.pop(); }   // consumed = removed
        std::cout << '\n';
    }

    Topic payments(3);
    for (int i = 1; i <= 3; ++i) payments.produce("account-7", "acct7 txn " + std::to_string(i));  // ordered in 1 partition
    payments.produce("account-9", "acct9 txn 1");
    ConsumerGroup billing(3), fraud_check(3);
    std::cout << "Kafka group 'billing' read " << billing.poll(payments).size() << " messages\n";
    std::cout << "Kafka group 'fraud' (independent offsets) read " << fraud_check.poll(payments).size() << " messages\n";
    std::cout << "billing polls again: " << billing.poll(payments).size() << " new messages (nothing lost, nothing re-read)\n";
    ConsumerGroup new_analytics(3);                                           // a brand-new consumer can REPLAY
    std::cout << "new group 'analytics' replays history: " << new_analytics.poll(payments).size() << " messages\n";
}
```

**Output:**
```text
RabbitMQ queue all-billing: [order 1 (EU)] [order 2 (US)]
RabbitMQ queue eu-shipping: [order 1 (EU)] [order 3 cancelled (EU)]
Kafka group 'billing' read 4 messages
Kafka group 'fraud' (independent offsets) read 4 messages
billing polls again: 0 new messages (nothing lost, nothing re-read)
new group 'analytics' replays history: 4 messages
```

### Interview answer
"RabbitMQ is a broker where producers publish to exchanges that route by bindings — direct, topic, fanout — into queues; consumers ack and messages are removed, which suits task queues and flexible routing. Kafka is a distributed, replicated, partitioned log: messages are appended with offsets and retained, ordering is per partition via key hashing, and consumer groups track their own offsets, giving very high throughput, horizontal consumer scaling and replay — ideal for event streaming, analytics and event sourcing."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Producer / consumer / broker | Sender / receiver / middleman that stores messages |
| Queue vs topic | One consumer per message vs every subscriber group |
| Ack | "Processed" — otherwise redelivered |
| At-least-once | Duplicates possible → idempotent consumers |
| DLQ | Parking lot for messages that keep failing |
| Load leveling | Queue absorbs bursts; workers go at their own pace |
| RabbitMQ | Exchanges → bindings → queues; deleted after ack |
| Kafka | Partitioned, retained log; offsets; consumer groups; replay |
