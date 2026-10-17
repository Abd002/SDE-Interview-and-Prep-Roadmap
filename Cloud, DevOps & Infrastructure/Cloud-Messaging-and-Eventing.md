# Cloud Messaging and Eventing — EventBridge, SNS, SQS, Kinesis/Kafka, Retries and Backpressure

> **What you'll learn:** how to route events with **EventBridge** buses and rules, fan out with **SNS** topics and **subscription filters**, queue work with **SQS** (standard vs. **FIFO**, **visibility timeout**, **dead-letter queues**), choose between **Kinesis and Kafka** for streaming, and handle **retries, poison messages, deduplication and backpressure** across all of them. Each part has config snippets and a runnable C++ simulation.
>
> **Prerequisites:** [Message Queuing](../System%20Architecture/Message-Queuing.md), [Event-Driven Architecture](../System%20Architecture/Event-Driven-Architecture.md), [Queue/event handler testing](../Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#5-message-queueevent-handler-tests-ordering-duplication-retry-dlq).

## Table of Contents
1. [EventBridge event buses, rules, and event routing](#1-eventbridge-event-buses-rules-and-event-routing)
2. [Kinesis/Kafka trade-offs for streaming workloads](#2-kinesiskafka-trade-offs-for-streaming-workloads)
3. [Retries, poison messages, deduplication, and backpressure](#3-retries-poison-messages-deduplication-and-backpressure)
4. [SNS pub/sub, subscription filters, and fan-out](#4-sns-pubsub-subscription-filters-and-fan-out)
5. [SQS standard vs. FIFO; visibility timeout; dead-letter queues](#5-sqs-standard-vs-fifo-visibility-timeout-dead-letter-queues)
6. [Cheat sheet](#cheat-sheet)

**Which one?** **SQS** = a work queue (one consumer group processes each message). **SNS** = push fan-out to many subscribers. **EventBridge** = content-based event routing between services, accounts and SaaS. **Kinesis/Kafka** = an ordered, replayable **log** for high-throughput streams with many independent readers.

---

## 1. EventBridge event buses, rules, and event routing

**In one sentence:** **Amazon EventBridge** receives JSON **events** on an **event bus** (default bus for AWS service events, custom buses for your apps, partner buses for SaaS) and **rules** with **event patterns** route matching events to **targets** (Lambda, SQS, Step Functions, API destinations, other buses/accounts), with **archive and replay**, a **schema registry**, **Pipes** and the **Scheduler**.

### In plain words
A central post office sorting room: every letter has a label (source, type, details). Sorting rules say "all `OrderPlaced` letters from the shop with amount > 1000 go to the fraud desk and the analytics desk". Senders don't need to know who reads their letters.

### How it works
- **Event envelope:** `source` (`com.acme.orders`), `detail-type` (`OrderPlaced`), `detail` (your payload), `time`, `account`, `region`, `id`.
- **Rules** match with **event patterns**: exact values, prefixes, numeric ranges, `anything-but`, `exists`, wildcards; up to 5 targets per rule; **input transformers** reshape the payload.
- **Delivery:** at-least-once; retries for up to 24 h with backoff, then a **DLQ (SQS)** per target; consumers must be idempotent; ordering is **not** guaranteed.
- **Cross-account / cross-region** buses for central event hubs; resource policies on the bus.
- **Archive & replay** for reprocessing after bugs; **Schema Registry** with code bindings; **EventBridge Pipes** (source → filter → enrich → target, e.g. SQS/DynamoDB Streams → Step Functions); **EventBridge Scheduler** for one-off and cron schedules at scale.
- Good for **decoupled domain events** between teams; not for very high throughput ordered streams (use Kinesis/Kafka).

```json
{
  "source": ["com.acme.orders"],
  "detail-type": ["OrderPlaced"],
  "detail": { "amount": [{ "numeric": [">", 1000] }], "country": [{ "anything-but": ["EG"] }] }
}
```

#### Modern C++ example — a mini event bus with pattern rules, multiple targets and a DLQ on target failure
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Event { std::string source, type; std::map<std::string, double> num; std::map<std::string, std::string> str; };
struct Rule { std::string name; std::function<bool(const Event&)> pattern; std::vector<std::string> targets; };

int main() {
    std::vector<Rule> rules{
        {"all-orders-to-analytics", [](const Event& e) { return e.source == "com.acme.orders"; }, {"analytics-firehose"}},
        {"big-foreign-orders-to-fraud", [](const Event& e) { return e.type == "OrderPlaced" && e.num.at("amount") > 1000 && e.str.at("country") != "EG"; }, {"fraud-lambda", "ops-sqs"}},
        {"payments-failed-to-support", [](const Event& e) { return e.source == "com.acme.payments" && e.type == "PaymentFailed"; }, {"support-api-destination"}},
    };
    std::map<std::string, int> delivered;
    std::vector<std::string> dlq;
    auto deliver = [&](const std::string& target, const Event& e) {
        if (target == "support-api-destination") { dlq.push_back(e.type + " -> " + target + " (HTTP 500 after retries)"); return; }   // failing target
        ++delivered[target];
    };
    std::vector<Event> events{
        {"com.acme.orders", "OrderPlaced", {{"amount", 250}}, {{"country", "EG"}}},
        {"com.acme.orders", "OrderPlaced", {{"amount", 4200}}, {{"country", "DE"}}},
        {"com.acme.orders", "OrderPlaced", {{"amount", 5000}}, {{"country", "EG"}}},
        {"com.acme.payments", "PaymentFailed", {{"amount", 99}}, {{"country", "EG"}}},
    };
    for (auto& e : events)
        for (auto& r : rules)
            if (r.pattern(e)) for (auto& t : r.targets) deliver(t, e);
    for (auto& [t, n] : delivered) std::cout << t << ": " << n << " event(s)\n";
    for (auto& d : dlq) std::cout << "DLQ: " << d << '\n';
}
```

**Output:**
```text
analytics-firehose: 3 event(s)
fraud-lambda: 1 event(s)
ops-sqs: 1 event(s)
DLQ: PaymentFailed -> support-api-destination (HTTP 500 after retries)
```

### Interview answer
"EventBridge is a serverless event router: producers put JSON events with a source, detail-type and detail onto a bus, and rules with content-based patterns — exact values, prefixes, numeric ranges, anything-but — send matching events to up to five targets, optionally transformed. Delivery is at least once with retries for up to 24 hours and a per-target DLQ, so consumers are idempotent, and ordering isn't guaranteed. I use it for decoupled domain events between teams and accounts, plus archive and replay, the schema registry, Pipes for point-to-point integrations, and Scheduler for timed events — and Kinesis or Kafka when I need ordered high-throughput streams."

---

## 2. Kinesis/Kafka trade-offs for streaming workloads

**In one sentence:** **Kinesis Data Streams** and **Apache Kafka** (self-managed, **Amazon MSK**, Confluent) are **partitioned, ordered, replayable logs**: producers append records by **key** to **shards/partitions**, many **consumer groups** read independently at their own **offsets** — Kinesis is fully managed and simple, Kafka offers more throughput per partition, longer retention, a richer ecosystem (Connect, Streams, compaction) and portability, at higher operational cost.

### In plain words
A train line recording every passenger in order on a ticket roll. Different inspectors (consumer groups) can each read the whole roll at their own pace, rewind it, or start from today. More parallel lines (partitions) carry more passengers, but order is only guaranteed within one line.

### How it works
| | Kinesis Data Streams | Kafka / MSK |
|---|---|---|
| Unit | **shard**: 1 MB/s or 1,000 records/s in, 2 MB/s out | **partition**: limited by brokers/disks, usually far more per partition |
| Scaling | on-demand mode or resharding | add partitions (keys remap!) + brokers; MSK Serverless |
| Retention | 24 h default, up to 365 days | configurable (days, forever), **log compaction** by key, tiered storage |
| Ordering | per shard (partition key) | per partition (key) |
| Consumers | KCL, Lambda, enhanced fan-out (2 MB/s per consumer per shard) | consumer groups, Kafka Streams, ksqlDB, Flink, Connect |
| Ops | zero (managed) | MSK reduces it; self-managed Kafka is significant work |
| Delivery | at least once | at least once; **exactly-once** with idempotent producers + transactions (within Kafka) |
| Ecosystem | AWS-native (Firehose, Lambda, Managed Flink) | huge (Connect connectors, Schema Registry, portable across clouds) |

- **Partitioning:** choose a key that spreads load (user ID, device ID) **and** keeps per-entity order; hot keys overload one partition.
- **Consumer lag** (records behind the head) is the key metric for scaling consumers; consumers in a group ≤ partitions.
- **Use a log (Kinesis/Kafka) when:** many independent consumers, replay/reprocessing, ordered per key, very high throughput (clickstreams, IoT, CDC, event sourcing). **Use a queue (SQS) when:** each task is processed once, per-message retries/DLQ, simple scaling.

#### Modern C++ example — keyed partitions, per-key ordering, independent consumer offsets, and replay
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Record { std::string key, value; };

class Topic {
public:
    explicit Topic(int partitions) : logs_(partitions) {}
    void produce(const Record& r) { logs_[std::hash<std::string>{}(r.key) % logs_.size()].push_back(r); }
    std::vector<Record> poll(const std::string& group, int partition, int max) {
        auto& off = offsets_[group][partition];
        std::vector<Record> out;
        while (off < static_cast<int>(logs_[partition].size()) && static_cast<int>(out.size()) < max) out.push_back(logs_[partition][off++]);
        return out;
    }
    void seek(const std::string& group, int partition, int offset) { offsets_[group][partition] = offset; }
    int lag(const std::string& group) { int l = 0; for (std::size_t p = 0; p < logs_.size(); ++p) l += static_cast<int>(logs_[p].size()) - offsets_[group][static_cast<int>(p)]; return l; }
    int partitions() const { return static_cast<int>(logs_.size()); }
private:
    std::vector<std::vector<Record>> logs_;
    std::map<std::string, std::map<int, int>> offsets_;
};

int main() {
    Topic orders(3);
    for (auto [k, v] : std::vector<std::pair<std::string, std::string>>{
             {"user-1", "created"}, {"user-2", "created"}, {"user-1", "paid"}, {"user-3", "created"}, {"user-1", "shipped"}, {"user-2", "paid"}})
        orders.produce({k, v});

    std::cout << "billing group reads everything (per-key order preserved):\n";
    for (int p = 0; p < orders.partitions(); ++p)
        for (auto& r : orders.poll("billing", p, 100)) std::cout << "  p" << p << ' ' << r.key << ' ' << r.value << '\n';
    orders.poll("analytics", 2, 1);                                     // a slower, independent group
    std::cout << "lag: billing=" << orders.lag("billing") << ", analytics=" << orders.lag("analytics") << '\n';

    orders.seek("billing", 0, 0); orders.seek("billing", 1, 0); orders.seek("billing", 2, 0);   // replay after a bug fix
    std::cout << "billing lag after rewinding to offset 0 (replay): " << orders.lag("billing") << '\n';
}
```

**Output:**
```text
billing group reads everything (per-key order preserved):
  p1 user-2 created
  p1 user-2 paid
  p2 user-1 created
  p2 user-1 paid
  p2 user-3 created
  p2 user-1 shipped
lag: billing=0, analytics=5
billing lag after rewinding to offset 0 (replay): 6
```

### Interview answer
"Kinesis and Kafka are partitioned, append-only logs: records with the same key go to the same shard or partition, so order holds per key, and each consumer group tracks its own offsets, so many teams can read independently and replay history. Kinesis is fully managed with per-shard limits of 1 MB/s in and on-demand scaling; Kafka or MSK gives higher per-partition throughput, long retention and compaction, exactly-once within Kafka, and a big ecosystem with Connect and stream processing, but more operations. I pick a log for high-throughput, multi-consumer, replayable streams like CDC or clickstreams, a queue like SQS for one-time task processing, and I monitor consumer lag and avoid hot keys."

---

## 3. Retries, poison messages, deduplication, and backpressure

**In one sentence:** in every messaging system, **retry transient failures** with **backoff** (and a cap), move **poison messages** that keep failing to a **DLQ** instead of blocking the stream, make handlers **idempotent** or **deduplicate** because delivery is at least once, and apply **backpressure** (bounded concurrency, batch sizes, max in-flight) so consumers don't overwhelm downstream systems.

### In plain words
A mail sorter: if an address is temporarily unreachable, try again later; if a letter is unreadable after three tries, put it in the "problem letters" box so it doesn't block the rest; if the same letter arrives twice, deliver it once; and if the delivery vans are full, slow down the sorting belt.

### How it works
| Concern | SQS | SNS / EventBridge | Kinesis / Kafka |
|---|---|---|---|
| Retries | message reappears after the **visibility timeout**; `maxReceiveCount` | service retries with backoff (EventBridge up to 24 h / 185 attempts) | consumer retries; **a failing record blocks its shard/partition** |
| Poison message | **redrive policy → DLQ** | DLQ per subscription/target | Lambda: `BisectBatchOnFunctionError`, `MaximumRetryAttempts`, on-failure destination; Kafka: retry topics + DLT |
| Partial batch | `ReportBatchItemFailures` (only failed IDs retried) | — | `ReportBatchItemFailures` / checkpoint per record |
| Dedup | FIFO: 5-minute dedup window; standard: app-level | app-level | app-level; Kafka idempotent producer + transactions |
| Backpressure | Lambda `MaximumConcurrency` on the event source, batch size/window | target rate limits | parallelization factor, batch size, consumer count ≤ partitions |

- **Retry carefully:** exponential backoff + jitter; distinguish transient vs. permanent errors (don't retry validation errors — send to DLQ immediately).
- **DLQs need owners:** alarms on DLQ depth, a **redrive** process (SQS DLQ redrive to source) after fixing the bug, retention longer than the source.
- **Deduplication:** idempotency keys stored with a conditional write; or upserts by business key; or FIFO/Kafka exactly-once features within their scope.
- **Backpressure** protects the database: cap consumer concurrency, use **RDS Proxy**, shed or delay low-priority work; queue depth growing is fine as long as it drains within your SLA.

#### Modern C++ example — a consumer with partial batch failures, max receives → DLQ, idempotent dedup and a concurrency cap
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <deque>
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct Msg { std::string id, body; int receives = 0; };

int main() {
    std::deque<Msg> queue{{"m1", "ok"}, {"m2", "flaky"}, {"m3", "corrupt"}, {"m1", "ok"}, {"m4", "ok"}, {"m5", "ok"}, {"m6", "ok"}};   // m1 duplicated
    std::vector<Msg> dlq;
    std::set<std::string> done;
    int flaky_failures_left = 1, processed = 0, db_peak = 0;
    const int max_receive = 3, batch_size = 3, max_concurrency = 2;       // backpressure: at most 2 batches at once

    for (int round = 1; !queue.empty(); ++round) {
        int in_flight = std::min<int>(max_concurrency, (static_cast<int>(queue.size()) + batch_size - 1) / batch_size);
        db_peak = std::max(db_peak, in_flight * batch_size);
        std::vector<Msg> retry;
        for (int b = 0; b < in_flight; ++b)
            for (int i = 0; i < batch_size && !queue.empty(); ++i) {
                Msg m = queue.front(); queue.pop_front();
                ++m.receives;
                if (done.count(m.id)) continue;                                        // dedup: already processed
                bool fail = m.body == "corrupt" || (m.body == "flaky" && flaky_failures_left-- > 0);
                if (!fail) { done.insert(m.id); ++processed; continue; }
                if (m.receives >= max_receive) dlq.push_back(m);                       // poison -> DLQ
                else retry.push_back(m);                                               // only failed items retried
            }
        for (auto& m : retry) queue.push_back(m);
        std::cout << "round " << round << ": processed so far " << processed << ", retrying " << retry.size() << ", DLQ " << dlq.size() << '\n';
    }
    std::cout << "unique messages processed: " << processed << "; DLQ: ";
    for (auto& m : dlq) std::cout << m.id << " (" << m.receives << " receives) ";
    std::cout << "\npeak concurrent DB work: " << db_peak << " messages (capped by max concurrency)\n";
}
```

**Output:**
```text
round 1: processed so far 3, retrying 2, DLQ 0
round 2: processed so far 5, retrying 1, DLQ 0
round 3: processed so far 5, retrying 0, DLQ 1
unique messages processed: 5; DLQ: m3 (3 receives) 
peak concurrent DB work: 6 messages (capped by max concurrency)
```

### Interview answer
"Delivery is at least once everywhere, so handlers are idempotent, deduplicating by message or business key with conditional writes. Transient failures are retried with backoff — via the SQS visibility timeout, service retry policies, or consumer retries — while permanent or repeatedly failing poison messages go to a DLQ after a receive limit, with alarms and a redrive process once fixed. I report partial batch failures so only failed items are retried, and in streams I use bisect and retry limits so one bad record doesn't block a shard. Backpressure comes from capped consumer concurrency and batch sizes so downstream databases aren't overwhelmed."

---

## 4. SNS pub/sub, subscription filters, and fan-out

**In one sentence:** **Amazon SNS** is a managed **pub/sub** service: publishers send a message to a **topic** and SNS **pushes** a copy to every **subscription** (SQS, Lambda, HTTP/S, email, SMS, mobile push, Firehose), optionally narrowed by **subscription filter policies**; the classic pattern is **SNS → many SQS queues** fan-out.

### In plain words
A radio station broadcasting announcements. Anyone tuned in hears them; some listeners have a filter that only plays traffic news. To make sure no listener misses anything while asleep, each one records the broadcast to their own tape (an SQS queue).

### How it works
- **Fan-out:** one `OrderPlaced` publish → SQS queues for billing, shipping, email, analytics — each consumer scales and fails independently, with its own DLQ.
- **Subscription filter policies:** match **message attributes** or the **message body** (`"country": ["DE","FR"]`, numeric ranges, prefixes, `anything-but`) so subscribers only receive what they need (saves cost and code).
- **Standard topics:** very high throughput, at-least-once, best-effort ordering. **FIFO topics:** ordered, deduplicated, only to SQS FIFO queues, lower throughput.
- **Delivery & retries:** each protocol has a retry policy; failed deliveries can go to a **DLQ per subscription**; **raw message delivery** for SQS/HTTP to skip the SNS envelope.
- **Security:** topic policies, SSE-KMS, HTTPS endpoints must confirm subscription; cross-account subscriptions.
- **SNS vs. EventBridge:** SNS for high-throughput simple fan-out and mobile/SMS/email notifications; EventBridge for rich content routing, many sources, schemas, archive/replay and SaaS integrations.

```json
{ "country": ["DE", "FR"], "amount": [{ "numeric": [">=", 1000] }] }
```

#### Modern C++ example — SNS → SQS fan-out with subscription filter policies
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>

struct Message { std::string body; std::map<std::string, std::string> attrs; double amount; };
struct Subscription { std::string queue; std::function<bool(const Message&)> filter; };

int main() {
    std::map<std::string, std::queue<std::string>> sqs;
    std::vector<Subscription> topic{
        {"billing-queue", nullptr},                                                                   // everything
        {"shipping-queue", [](const Message& m) { return m.attrs.at("type") == "OrderPlaced"; }},
        {"eu-vip-queue", [](const Message& m) { auto c = m.attrs.at("country"); return (c == "DE" || c == "FR") && m.amount >= 1000; }},
    };
    auto publish = [&](const Message& m) {
        int copies = 0;
        for (auto& s : topic) if (!s.filter || s.filter(m)) { sqs[s.queue].push(m.body); ++copies; }
        std::cout << "publish " << m.body << " -> " << copies << " subscription(s)\n";
    };
    publish({"order#81", {{"type", "OrderPlaced"}, {"country", "EG"}}, 250});
    publish({"order#82", {{"type", "OrderPlaced"}, {"country", "DE"}}, 4200});
    publish({"refund#9", {{"type", "RefundIssued"}, {"country", "FR"}}, 1500});
    for (auto& [q, msgs] : sqs) std::cout << q << ": " << msgs.size() << " message(s)\n";
}
```

**Output:**
```text
publish order#81 -> 2 subscription(s)
publish order#82 -> 3 subscription(s)
publish refund#9 -> 2 subscription(s)
billing-queue: 3 message(s)
eu-vip-queue: 2 message(s)
shipping-queue: 2 message(s)
```

### Interview answer
"SNS is push-based pub/sub: one publish to a topic delivers a copy to every subscription — SQS, Lambda, HTTPS, email, SMS or mobile push — and filter policies on attributes or the body narrow what each subscriber gets. The standard pattern is SNS-to-SQS fan-out, so each consumer has its own durable queue, scaling and DLQ. Standard topics are high-throughput and at least once; FIFO topics add ordering and dedup into SQS FIFO queues. I choose EventBridge instead when I need richer routing, many event sources, schemas or replay."

---

## 5. SQS standard vs. FIFO; visibility timeout; dead-letter queues

**In one sentence:** **SQS** is a fully managed **pull-based queue**: **standard** queues offer nearly unlimited throughput with **at-least-once, best-effort ordering**, **FIFO** queues give **exactly-once processing** and **ordering per message group**; a received message becomes **invisible** for the **visibility timeout** and reappears if not deleted, and after `maxReceiveCount` failures a **redrive policy** moves it to a **dead-letter queue**.

### In plain words
A ticket queue at a deli. When a worker takes a ticket, it's hidden from others for a few minutes (visibility timeout). If the worker finishes, the ticket is thrown away (delete). If the worker disappears, the ticket reappears for someone else. A ticket that's failed three times goes to the manager's tray (DLQ).

### How it works
| | Standard | FIFO |
|---|---|---|
| Throughput | nearly unlimited | 300 msg/s per API action (3,000 with batching); **high-throughput mode** much more per message group |
| Delivery | at least once (occasional duplicates) | exactly-once processing within a **5-minute dedup window** (`MessageDeduplicationId` or content-based) |
| Ordering | best effort | strict **per `MessageGroupId`** (groups processed in parallel) |
| Use | most background jobs | order-sensitive per entity (account ledger, per-user commands) |

**Lifecycle:** `SendMessage` → `ReceiveMessage` (long polling `WaitTimeSeconds` up to 20 s reduces empty receives and cost) → process → `DeleteMessage`. If not deleted within the **visibility timeout** (default 30 s, max 12 h), the message is visible again and its **receive count** increases.
- Set visibility timeout **> processing time** (for Lambda: ≥ 6× the function timeout); extend it with `ChangeMessageVisibility` for long jobs.
- **DLQ** via redrive policy (`maxReceiveCount`, e.g. 5); FIFO queues need FIFO DLQs; alarm on `ApproximateNumberOfMessagesVisible` of the DLQ; **redrive** back to the source after fixing.
- Other features: **delay queues** / message timers (0–15 min), message size up to 256 KB (use S3 for bigger payloads), retention 1 min–14 days, SSE, `ApproximateAgeOfOldestMessage` as the key lag metric.

```hcl
resource "aws_sqs_queue" "orders_dlq" { name = "orders-dlq", message_retention_seconds = 1209600 }
resource "aws_sqs_queue" "orders" {
  name                       = "orders"
  visibility_timeout_seconds = 180          # 6 x a 30 s Lambda timeout
  receive_wait_time_seconds  = 20           # long polling
  redrive_policy = jsonencode({ deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn, maxReceiveCount = 5 })
}
```

#### Modern C++ example — visibility timeout, a crashed consumer, redelivery, DLQ, and FIFO message groups with dedup
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <set>
#include <string>
#include <vector>

struct Msg { std::string id, body; int visible_at = 0, receives = 0; bool deleted = false; };

class Queue {
public:
    Queue(int visibility, int max_receive) : vis_(visibility), max_(max_receive) {}
    void send(std::string id, std::string body) { msgs_.push_back({std::move(id), std::move(body)}); }
    std::optional<std::string> receive(int now) {
        for (auto& m : msgs_) {
            if (m.deleted || m.visible_at > now) continue;
            if (m.receives >= max_) { m.deleted = true; dlq.push_back(m.id); continue; }   // redrive to DLQ
            ++m.receives; m.visible_at = now + vis_;                                        // invisible while processing
            return m.id;
        }
        return std::nullopt;
    }
    void remove(const std::string& id) { for (auto& m : msgs_) if (m.id == id) m.deleted = true; }
    std::vector<std::string> dlq;
private:
    int vis_, max_;
    std::vector<Msg> msgs_;
};

int main() {
    Queue q(30, 3);
    q.send("job-1", "resize photo"); q.send("job-2", "corrupt file");
    auto a = q.receive(0);  std::cout << "t=0  consumer A got " << *a << " and CRASHES (no delete)\n";
    auto b = q.receive(5);  std::cout << "t=5  consumer B got " << *b << " (job-1 is invisible)\n";
    q.remove(*b == "job-2" ? "x" : *b);
    auto c = q.receive(31); std::cout << "t=31 job-1 visible again -> " << *c << ", processed and deleted\n";
    q.remove("job-1");
    for (int t = 40; t <= 200; t += 40) if (auto m = q.receive(t)) std::cout << "t=" << t << " receive " << *m << " -> fails again\n";
    std::cout << "DLQ:"; for (auto& id : q.dlq) std::cout << ' ' << id; std::cout << " (after 3 receives)\n";

    // FIFO: strict order within a message group, 5-minute deduplication window.
    std::map<std::string, std::vector<std::string>> groups;
    std::set<std::string> dedup_ids;
    for (auto [group, dedup, body] : std::vector<std::tuple<std::string, std::string, std::string>>{
             {"account-42", "d1", "deposit 100"}, {"account-7", "d2", "deposit 50"}, {"account-42", "d3", "withdraw 30"},
             {"account-42", "d3", "withdraw 30"}, {"account-42", "d4", "withdraw 80"}})
        if (dedup_ids.insert(dedup).second) groups[group].push_back(body);
    for (auto& [g, ops] : groups) { std::cout << "FIFO group " << g << ':'; for (auto& o : ops) std::cout << " [" << o << ']'; std::cout << '\n'; }
}
```

**Output:**
```text
t=0  consumer A got job-1 and CRASHES (no delete)
t=5  consumer B got job-2 (job-1 is invisible)
t=31 job-1 visible again -> job-1, processed and deleted
t=40 receive job-2 -> fails again
t=80 receive job-2 -> fails again
DLQ: job-2 (after 3 receives)
FIFO group account-42: [deposit 100] [withdraw 30] [withdraw 80]
FIFO group account-7: [deposit 50]
```

The duplicate "withdraw 30" (same deduplication ID within the window) was dropped, and account-42's operations stay in order while account-7 is processed independently.

### Interview answer
"SQS is a pull-based managed queue. Standard queues scale almost without limit with at-least-once delivery and best-effort ordering; FIFO queues give ordering per message group and exactly-once processing within a five-minute deduplication window, at lower throughput unless high-throughput mode is on. A received message is hidden for the visibility timeout — which I set above processing time, six times the Lambda timeout for event sources, and extend for long jobs — and reappears if not deleted. A redrive policy moves it to a DLQ after maxReceiveCount, with alarms and redrive once fixed. I use long polling and watch the age of the oldest message."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Choose | SQS work queue · SNS push fan-out · EventBridge content routing · Kinesis/Kafka replayable ordered log |
| EventBridge | source / detail-type / detail; pattern rules → ≤ 5 targets; at least once, unordered; retries 24 h + DLQ; archive/replay, Pipes, Scheduler |
| Kinesis vs. Kafka | managed shards (1 MB/s in) vs. high-throughput partitions, compaction, ecosystem, more ops; order per key; consumer lag |
| Retries | backoff + jitter; transient only; partial batch failures; bisect for streams |
| Poison | maxReceiveCount / retry limits → DLQ with alarms and redrive |
| Dedup | idempotency keys + conditional writes; FIFO 5-min window; Kafka idempotent producer |
| Backpressure | capped consumer concurrency, batch sizes, RDS Proxy; queue depth is a buffer |
| SNS | topic → subscriptions; filter policies; SNS→SQS fan-out; DLQ per subscription; FIFO topics |
| SQS standard vs. FIFO | unlimited, at least once, best-effort order vs. ordered per group, exactly-once processing, lower throughput |
| Visibility timeout | > processing time (6× Lambda timeout); extend for long jobs; not deleted → redelivered |
| SQS extras | long polling 20 s, delay up to 15 min, 256 KB (S3 for more), 14-day retention, age-of-oldest-message |
