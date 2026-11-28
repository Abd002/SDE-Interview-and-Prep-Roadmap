# Cloud Messaging and Eventing — EventBridge, SNS, SQS, Kinesis/Kafka, Retries and Backpressure

> **What you'll learn:** how to route events with **EventBridge** buses and rules, fan out with **SNS** topics and **subscription filters**, queue work with **SQS** (standard vs. **FIFO**, **visibility timeout**, **dead-letter queues**), choose between **Kinesis and Kafka** for streaming, and handle **retries, poison messages, deduplication and backpressure** across all of them. Each part has config snippets.
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
