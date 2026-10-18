# Production Reliability and Observability for LLM Systems — Keeping Agents Fast, Affordable, and Up

> **What you'll learn:** how to run LLM and agent systems in production:
> - **caching** (prompt, response, embedding, retrieval);
> - **circuit breakers, DLQs and recovery**;
> - **cost optimization**;
> - **end-to-end traces**;
> - **logs, metrics, dashboards and alerts**;
> - **model/prompt versioning and rollback**;
> - **provider outages and failover**;
> - **queuing, concurrency limits and backpressure**;
> - **retry storms and idempotency**;
> - **SLOs and incident investigation**;
> - **streaming, cancellation and timeouts**;
> - **token, cost and latency budgets**.
>
> Each part has a runnable C++ example.
>
> **Prerequisites:** [Tool Use, Integrations, and Protocols](./Tool-Use-Integrations-and-Protocols.md) and general observability from [Logging, Metrics, and Tracing](../Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md) and [Reliability Engineering (SRE)](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md).

## Table of Contents
1. [Cache strategies: prompt, response, embedding, and retrieval caching](#1-cache-strategies-prompt-response-embedding-and-retrieval-caching)
2. [Circuit breakers, dead-letter queues, and recovery workflows](#2-circuit-breakers-dead-letter-queues-and-recovery-workflows)
3. [Cost optimization: smaller models, batching, caching, and routing](#3-cost-optimization-smaller-models-batching-caching-and-routing)
4. [End-to-end distributed traces for prompts, model calls, and tools](#4-end-to-end-distributed-traces-for-prompts-model-calls-and-tools)
5. [Logs, metrics, dashboards, and actionable alerting](#5-logs-metrics-dashboards-and-actionable-alerting)
6. [Model and prompt versioning, release controls, and rollback](#6-model-and-prompt-versioning-release-controls-and-rollback)
7. [Provider outages, failover models, and graceful degradation](#7-provider-outages-failover-models-and-graceful-degradation)
8. [Request queuing, concurrency limits, and backpressure](#8-request-queuing-concurrency-limits-and-backpressure)
9. [Retry storms, duplicate side effects, and idempotency keys](#9-retry-storms-duplicate-side-effects-and-idempotency-keys)
10. [SLA/SLO design and incident investigation](#10-slaslo-design-and-incident-investigation)
11. [Streaming responses, cancellation, and timeout handling](#11-streaming-responses-cancellation-and-timeout-handling)
12. [Token usage, per-step cost, and latency budgets](#12-token-usage-per-step-cost-and-latency-budgets)
13. [Cheat sheet](#cheat-sheet)

Suggested order: **12 → 4 → 5 → 10 → 1 → 3 → 8 → 9 → 2 → 7 → 11 → 6**.

---

## 1. Cache strategies: prompt, response, embedding, and retrieval caching

**In one sentence:** cache at several layers:
- **Prompt (prefix) caching** at the provider reuses a long, identical prompt prefix at a big discount and lower latency.
- **Response caching** returns a stored answer for an identical (exact) or very similar (semantic) request.
- **Embedding caching** avoids re-embedding the same text.
- **Retrieval caching** stores search results for repeated queries.

Every cache key must include the **model/prompt version and the tenant/permissions**.

### In plain words
A café that pre-grinds coffee beans for the most common orders (prompt caching), keeps freshly made popular drinks ready (response cache), and doesn't re-weigh the same bag of beans twice (embedding cache), while never handing one customer's custom order to someone else.

### How it works
| Cache | Key | Hit rate | Risks |
|---|---|---|---|
| **Provider prompt caching** | identical prefix (system prompt, tools, static docs), marked or automatic | high for agents and chats | order content stable → dynamic last; minimum prefix sizes; short TTLs |
| **Exact response cache** | hash(model, prompt version, params, normalized input, tenant) | low–medium (FAQ-like traffic) | stale answers → TTL, invalidate on doc/prompt change |
| **Semantic response cache** | embedding similarity above a threshold | higher | **wrong answer for a similar-but-different question** → high threshold, only for safe domains |
| **Embedding cache** | hash(embedding model, text) | very high in ingestion | invalidate on model change |
| **Retrieval cache** | hash(query, filters incl. ACL, index version) | medium | must include permissions; invalidate on re-index |

- Don't cache personalized or sensitive answers across users. Measure the hit rate and the quality of cache hits.

#### Modern C++ example — an exact response cache keyed by version and tenant, with TTL and invalidation on prompt change
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cctype>
#include <functional>
#include <iostream>
#include <map>
#include <string>

struct Entry { std::string answer; int expires_at; };

class ResponseCache {
    std::map<std::size_t, Entry> m_;
public:
    int hits = 0, misses = 0;
    static std::string normalize(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return std::tolower(c); });
        s.erase(std::remove_if(s.begin(), s.end(), [](unsigned char c) { return std::ispunct(c); }), s.end());
        return s;
    }
    static std::size_t key(const std::string& model, const std::string& prompt_v, const std::string& tenant, const std::string& q) {
        return std::hash<std::string>{}(model + "|" + prompt_v + "|" + tenant + "|" + normalize(q));
    }
    std::string get_or_call(std::size_t k, int now, const std::function<std::string()>& llm) {
        if (auto it = m_.find(k); it != m_.end() && it->second.expires_at > now) { ++hits; return it->second.answer + " (cache)"; }
        ++misses; auto a = llm(); m_[k] = {a, now + 3600}; return a;
    }
};

int main() {
    ResponseCache cache;
    auto llm = [] { return std::string("Refunds take 14 days."); };
    std::cout << cache.get_or_call(ResponseCache::key("m-2026-06", "faq@v3", "acme", "How long do refunds take?"), 0, llm) << '\n';
    std::cout << cache.get_or_call(ResponseCache::key("m-2026-06", "faq@v3", "acme", "how long do refunds take"), 60, llm) << '\n';
    std::cout << cache.get_or_call(ResponseCache::key("m-2026-06", "faq@v3", "globex", "how long do refunds take"), 90, llm) << "  <- other tenant: separate entry\n";
    std::cout << cache.get_or_call(ResponseCache::key("m-2026-06", "faq@v4", "acme", "how long do refunds take"), 120, llm) << "  <- new prompt version: miss\n";
    std::cout << cache.get_or_call(ResponseCache::key("m-2026-06", "faq@v3", "acme", "how long do refunds take"), 4000, llm) << "  <- TTL expired\n";
    std::cout << "hits " << cache.hits << ", misses " << cache.misses << '\n';
}
```

**Output:**
```text
Refunds take 14 days.
Refunds take 14 days. (cache)
Refunds take 14 days.  <- other tenant: separate entry
Refunds take 14 days.  <- new prompt version: miss
Refunds take 14 days.  <- TTL expired
hits 1, misses 4
```

### Interview answer
"I cache at several layers. Provider prompt caching is usually the biggest win for agents: I keep the system prompt, tool definitions and static context as a stable prefix with dynamic content last, which cuts cost and time to first token. Exact response caching is keyed by model, prompt version, parameters, normalized input and tenant, with TTLs and invalidation when documents or prompts change. Semantic caching only goes in low-risk domains with a high threshold, because a similar question can need a different answer. Embedding and retrieval caches speed up ingestion and repeated queries, and retrieval keys must include permission filters. I track hit rates and the quality of cached answers."

---

## 2. Circuit breakers, dead-letter queues, and recovery workflows

**In one sentence:**
- A **circuit breaker** stops calling a failing dependency (model provider, tool API) after repeated errors. It **fails fast** or falls back, then cautiously **probes** before closing again.
- A **dead-letter queue (DLQ)** holds runs or messages that failed permanently so they aren't lost or retried forever.
- **Recovery workflows** replay, repair, or route those failures to humans.

### In plain words
A fuse box: when a circuit keeps shorting, the fuse trips so the whole house doesn't burn, and you test it before switching it back on. Letters that can't be delivered go to a "return to sender" bin that someone reviews, instead of the postman trying the same address forever.

### How it works
- **Breaker states:**
  - **Closed** (normal; count failures over a window).
  - **Open** (reject immediately for a cool-down; use the fallback).
  - **Half-open** (allow a few trial calls; success closes, failure re-opens).
- Have one breaker **per dependency** (and per model), configured with an error-rate threshold, a minimum number of requests, and the cool-down.
- **DLQ:** after max retries, or on a non-retryable error, move the message with **full context** (run ID, inputs, error, attempts, versions) to the DLQ. Alert on DLQ growth.
- **Recovery:** dashboards to inspect DLQ items. **Redrive** after a fix (idempotent!), patch the input and resume from the checkpoint, or hand off to a human queue. Use poison-message detection so one bad input doesn't block a queue ([durable execution](./Agentic-Frameworks-and-Orchestration.md#3-durable-execution-and-recovering-from-mid-workflow-failures)).

#### Modern C++ example — a circuit breaker opening after failures, failing fast, probing half-open, and failed runs going to a DLQ
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

class CircuitBreaker {
public:
    enum class State { Closed, Open, HalfOpen };
    State state = State::Closed;
    int failures = 0, opened_at = 0;
    const int threshold = 3, cooldown = 30;
    bool allow(int now) {
        if (state == State::Open && now - opened_at >= cooldown) state = State::HalfOpen;
        return state != State::Open;
    }
    void record(bool ok, int now) {
        if (ok) { state = State::Closed; failures = 0; return; }
        if (state == State::HalfOpen || ++failures >= threshold) { state = State::Open; opened_at = now; }
    }
    std::string name() const { return state == State::Closed ? "closed" : state == State::Open ? "OPEN" : "half-open"; }
};

int main() {
    CircuitBreaker cb;
    std::vector<std::string> dlq;
    struct Call { int t; bool provider_ok; };
    std::vector<Call> calls{{0, true}, {5, false}, {6, false}, {7, false}, {8, false}, {20, false}, {40, true}, {41, true}};
    for (auto& c : calls) {
        if (!cb.allow(c.t)) { std::cout << "t=" << c.t << " breaker " << cb.name() << " -> fail fast, use fallback model\n"; continue; }
        cb.record(c.provider_ok, c.t);
        std::cout << "t=" << c.t << " call " << (c.provider_ok ? "ok  " : "FAIL") << " -> breaker " << cb.name() << '\n';
        if (!c.provider_ok && cb.state == CircuitBreaker::State::Open) dlq.push_back("run@t=" + std::to_string(c.t));
    }
    std::cout << "DLQ: " << dlq.size() << " run(s) parked for redrive after the incident\n";
}
```

**Output:**
```text
t=0 call ok   -> breaker closed
t=5 call FAIL -> breaker closed
t=6 call FAIL -> breaker closed
t=7 call FAIL -> breaker OPEN
t=8 breaker OPEN -> fail fast, use fallback model
t=20 breaker OPEN -> fail fast, use fallback model
t=40 call ok   -> breaker closed
t=41 call ok   -> breaker closed
DLQ: 1 run(s) parked for redrive after the incident
```

At t=40 the cool-down had passed, so the breaker went **half-open**. The trial call succeeded and closed it.

### Interview answer
"I put a circuit breaker per dependency — each model provider, each tool API. After an error threshold over a window it opens and fails fast, using a fallback model or a degraded response instead of piling up timeouts. After a cool-down it lets a few trial calls through half-open and closes on success. Runs that exhaust retries, or hit non-retryable errors, go to a dead-letter queue with full context — inputs, versions, error, attempts — and I alert on its growth. Recovery is a deliberate workflow: inspect, fix, then redrive idempotently or resume from checkpoints, or route to a human queue."

---

## 3. Cost optimization: smaller models, batching, caching, and routing

**In one sentence:** LLM cost is roughly **tokens × price × calls**, so reduce each factor:
- **Route** easy requests to **smaller models** and escalate only hard ones.
- **Shrink prompts** with tighter context, fewer retrieved chunks and compact tool outputs.
- **Cache** prompt prefixes and responses.
- **Batch** offline work (batch APIs are often ~50% cheaper).
- **Cap output** and agent steps.
- Measure **cost per successful task**, not per call.

### In plain words
Don't send every letter by express courier: most can go by regular post, a few by courier. Pack envelopes with only the pages needed, and send the monthly mailing in one bulk shipment.

### How it works
| Lever | Typical impact | Watch out for |
|---|---|---|
| **Model routing / cascades** | 2–10× | quality on hard cases; router accuracy |
| **Prompt caching** | large discount on cached input | stable prefix ordering |
| **Context trimming** (top-k, summaries, compact tool results) | 20–60% fewer input tokens | recall loss |
| **Output limits & concise formats** | output tokens cost more than input tokens | truncation |
| **Batch APIs** for offline jobs | ~50% | hours of latency |
| **Fewer agent steps** (better tools, workflows instead of loops) | big for agents | flexibility |
| **Fine-tuned/distilled small model** for narrow tasks | large at volume | training and maintenance |
| **Self-hosting at high utilization** | depends | ops cost ([hosting](./LLM-and-Generative-AI-Fundamentals.md#1-closed-weight-vs-open-weight-models-hosted-apis-vs-self-hosting)) |

- Attribute cost per tenant, feature and step ([section 12](#12-token-usage-per-step-cost-and-latency-budgets)). Validate every optimization against the eval set.

#### Modern C++ example — monthly cost before and after routing, prompt caching and trimming, with the quality check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>

struct Config { const char* name; double share_small, in_tokens, out_tokens, cached_fraction, success; };

int main() {
    const double large_in = 3.0 / 1e6, large_out = 15.0 / 1e6, small_in = 0.25 / 1e6, small_out = 1.25 / 1e6, cache_price = 0.1;
    const double requests = 3'000'000;                                             // per month
    Config before{"before", 0.0, 6000, 700, 0.0, 0.92}, after{"after", 0.7, 3500, 450, 0.6, 0.92};
    std::cout << std::fixed << std::setprecision(0);
    for (auto& c : {before, after}) {
        auto cost = [&](double in_p, double out_p) {
            double in = c.in_tokens * ((1 - c.cached_fraction) + c.cached_fraction * cache_price);
            return in * in_p + c.out_tokens * out_p;
        };
        double per_req = c.share_small * cost(small_in, small_out) + (1 - c.share_small) * cost(large_in, large_out);
        std::cout << c.name << ": $" << per_req * requests << "/month, $" << std::setprecision(4) << per_req / c.success
                  << " per successful task, success " << std::setprecision(2) << c.success << std::setprecision(0) << '\n';
    }
    std::cout << "changes: 70% routed to small model, 60% of input cached, top-k 8->4 and compact tool results, max output 700->450\n";
}
```

**Output:**
```text
before: $85500/month, $0.0310 per successful task, success 0.92
after: $12449/month, $0.0045 per successful task, success 0.92
changes: 70% routed to small model, 60% of input cached, top-k 8->4 and compact tool results, max output 700->450
```

### Interview answer
"I treat cost as tokens times price times calls and attack each factor. A router or cascade sends easy requests to a small model and escalates hard ones. Prompt caching makes the stable prefix cheap. Context trimming — fewer, better chunks, summaries and compact tool outputs — and tighter output limits cut tokens. Batch APIs handle offline jobs, and better tools or workflows reduce agent steps. For narrow high-volume tasks, a fine-tuned small model can help. I track cost per successful task per feature and tenant, and validate each optimization against the eval set so savings don't quietly reduce quality."

---

## 4. End-to-end distributed traces for prompts, model calls, and tools

**In one sentence:** give every user request a **trace ID** and record a **span** for each step — API handler, retrieval, every model call (prompt/version, model, tokens, latency, finish reason), every tool call (args, status, latency) and downstream service calls. Spans are linked parent→child across services using **OpenTelemetry**, so you can see exactly what happened, where time went, and why the agent did what it did.

### In plain words
A parcel tracking page for each request: every hand-off is scanned, so you can see where it waited, which van carried it, and where it got lost.

### How it works
- **OpenTelemetry:** spans with attributes, propagated via `traceparent` headers across services and queues. **GenAI semantic conventions** cover model spans: `gen_ai.request.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, the operation name, and so on.
- **What to record:**
  - Prompt template ID/version and model ID.
  - Token counts, cost and latency (TTFT plus total).
  - Finish reason.
  - Tool name, args (redacted) and result size.
  - Retrieval doc IDs and scores.
  - User and tenant (pseudonymous), run/thread IDs.
- **Privacy:** full prompts and outputs may contain PII. Redact them, sample them, restrict access, and set retention.
- **Backends:** LangSmith, Langfuse, Phoenix, or Datadog/Honeycomb/Grafana Tempo/Jaeger via OTel ([LangSmith](./Agentic-Frameworks-and-Orchestration.md#8-langsmith-traces-datasets-evaluations-and-debugging), [Logging, Metrics, and Tracing](../Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md)).
- **Uses:** latency breakdowns (critical path), debugging wrong answers, cost attribution, and building eval datasets from real traces.

#### Modern C++ example — nested spans for one agent request, with GenAI attributes and a critical-path latency breakdown
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Span { std::string id, parent, name; int start_ms, end_ms; std::map<std::string, std::string> attrs; };

int main() {
    const std::string trace_id = "4bf92f3577b34da6a3ce929d0e0e4736";
    std::vector<Span> spans{
        {"s1", "", "POST /chat", 0, 3120, {{"tenant", "acme"}, {"thread_id", "th-9"}}},
        {"s2", "s1", "retrieve", 15, 240, {{"top_k", "5"}, {"doc_ids", "kb-3,kb-9"}}},
        {"s3", "s1", "chat model (plan)", 245, 1150, {{"gen_ai.request.model", "model-2026-06"}, {"gen_ai.usage.input_tokens", "3180"}, {"gen_ai.usage.output_tokens", "95"}, {"prompt", "support@v8"}}},
        {"s4", "s1", "tool orders.get_status", 1155, 1960, {{"status", "ok"}, {"order_id", "1042"}}},
        {"s5", "s1", "chat model (answer)", 1965, 3100, {{"gen_ai.usage.input_tokens", "3420"}, {"gen_ai.usage.output_tokens", "210"}, {"finish_reason", "end_turn"}}},
    };
    std::cout << "trace " << trace_id.substr(0, 8) << "...\n";
    int total = spans[0].end_ms - spans[0].start_ms;
    for (auto& s : spans) {
        int d = s.end_ms - s.start_ms;
        std::cout << (s.parent.empty() ? "" : "  ") << s.name << " " << d << "ms";
        if (!s.parent.empty()) std::cout << " (" << d * 100 / total << "%)";
        for (auto& [k, v] : s.attrs) if (k.rfind("gen_ai.usage", 0) == 0 || k == "status" || k == "finish_reason") std::cout << " " << k.substr(k.rfind('.') + 1) << "=" << v;
        std::cout << '\n';
    }
    std::cout << "slowest child: tool orders.get_status at 805ms -> investigate the orders API p95\n";
}
```

**Output:**
```text
trace 4bf92f35...
POST /chat 3120ms
  retrieve 225ms (7%)
  chat model (plan) 905ms (29%) input_tokens=3180 output_tokens=95
  tool orders.get_status 805ms (25%) status=ok
  chat model (answer) 1135ms (36%) finish_reason=end_turn input_tokens=3420 output_tokens=210
slowest child: tool orders.get_status at 805ms -> investigate the orders API p95
```

The model calls are the longest spans, but they're expected to be slow. The tool span is the **anomaly** worth investigating: an 805 ms status lookup suggests something is off.

### Interview answer
"Each request gets a trace ID propagated through services and queues with OpenTelemetry, and every step is a span: retrieval with doc IDs and scores; each model call with model, prompt version, token counts, latency, time to first token and finish reason, following the GenAI semantic conventions; and each tool call with redacted arguments, status and latency. That gives critical-path latency breakdowns, cost attribution, and the exact context behind a wrong decision. Because prompts can contain PII, I redact, sample and restrict access. Traces feed back into evaluation datasets."

---

## 5. Logs, metrics, dashboards, and actionable alerting

**In one sentence:**
- **Structured logs** with trace IDs answer "what happened to *this* request".
- **Metrics** answer "how is the system doing overall": request rate, errors, latency p50/p95/p99, TTFT, tokens and cost, tool error rates, cache hit rate, **quality signals** like user feedback, judge scores and abstention rate.
- **Dashboards** tell the story per feature and tenant.
- **Alerts** fire only on **user-impacting symptoms** (SLO burn rate), and each one links to a runbook.

### In plain words
Logs are the detailed diary, metrics are the car's dashboard gauges, and alerts are the warning lights. A good warning light means "pull over now", not "something somewhere changed slightly".

### How it works
- **Golden signals + LLM signals:**
  - Traffic, errors (incl. provider 429/5xx, refusals, schema failures).
  - Latency (TTFT, total, per step).
  - Saturation (queue depth, concurrency, rate-limit headroom).
  - **Tokens and cost** per request/feature/tenant.
  - **Quality** (thumbs up/down, online judge scores, groundedness, escalation rate).
  - **Agent behaviour** (steps per run, tool-call distribution, loop/budget hits).
- **Cardinality:** label by model, prompt version, feature and tenant tier, but **not** user ID or raw prompts. Those go in logs and traces.
- **Logs:** JSON with trace/run IDs, versions and event types. Redact PII and set retention.
- **Alerting:** page on SLO burn rate (fast + slow windows), sustained provider error rates, cost spikes and DLQ growth. Make it **ticket, not page** for slow-moving quality drift. Every alert gets an owner and a runbook ([Logging, Metrics, and Tracing](../Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md), [SRE](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md)).

#### Modern C++ example — compute p50/p95 and error rate from request records, and evaluate a multi-window SLO burn-rate alert
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <random>
#include <vector>

double percentile(std::vector<int> v, double p) { std::sort(v.begin(), v.end()); return v[std::size_t(std::ceil(p * v.size())) - 1]; }

int main() {
    std::mt19937 rng(3);
    std::lognormal_distribution<double> latency(7.3, 0.4);                 // ms, median ~1.5s
    std::vector<int> lat; int errors_5m = 0, total_5m = 0;
    for (int i = 0; i < 2000; ++i) {
        lat.push_back(int(latency(rng)));
        bool late_window = i >= 1700;                                         // last 300 requests = the last 5 minutes
        bool error = late_window ? (rng() % 100 < 9) : (rng() % 1000 < 3);    // provider incident starts
        if (late_window) { ++total_5m; errors_5m += error; }
    }
    const double slo = 0.995, budget = 1 - slo;                              // 99.5% success
    double err_5m = double(errors_5m) / total_5m, err_1h = 0.012;            // 1h error rate from the metrics backend
    double burn_5m = err_5m / budget, burn_1h = err_1h / budget;
    std::cout << std::fixed << std::setprecision(1) << "p50=" << percentile(lat, 0.50) << "ms p95=" << percentile(lat, 0.95) << "ms\n";
    std::cout << std::setprecision(3) << "error rate 5m=" << err_5m << " 1h=" << err_1h << std::setprecision(1) << " -> burn rate 5m=" << burn_5m << "x 1h=" << burn_1h << "x\n";
    bool page = burn_5m > 14.4 && burn_1h > 14.4, ticket = burn_1h > 2;
    std::cout << (page ? "PAGE: fast burn" : ticket ? "TICKET + watch: budget burning faster than allowed (runbook: provider-errors.md)" : "ok") << '\n';
}
```

**Output:**
```text
p50=1486.0ms p95=2797.0ms
error rate 5m=0.087 1h=0.012 -> burn rate 5m=17.3x 1h=2.4x
TICKET + watch: budget burning faster than allowed (runbook: provider-errors.md)
```

The 5-minute window is burning fast, but the 1-hour window hasn't confirmed it yet. Requiring **both** windows prevents paging on a short blip. If the incident continues, the 1-hour burn rate rises and the alert pages.

### Interview answer
"I use structured logs with trace and run IDs for per-request detail, and metrics for aggregate health. Those are the golden signals plus LLM-specific ones: time to first token, tokens and cost per feature and tenant, provider 429 and 5xx rates, refusals and schema failures, cache hits, steps per run and budget hits, and quality signals like user feedback, online judge scores and escalation rate. Labels stay low-cardinality — model, prompt version, feature — with user-level detail in traces. Paging alerts fire on user-impacting symptoms like multi-window SLO burn rates, sustained provider failures, cost spikes or DLQ growth, each with an owner and a runbook. Slow quality drift becomes a ticket."

---

## 6. Model and prompt versioning, release controls, and rollback

**In one sentence:** treat every behaviour-changing artifact — **model snapshot, prompt version, tool schemas, retrieval config, parameters** — as a versioned **release bundle**. Roll it out gradually (offline evals → shadow → canary → percentage rollout, behind **feature flags**), compare metrics against the current version, and keep **instant rollback** to the previous bundle.

### In plain words
A restaurant changes its recipe by giving it to a few tables first, watching their reactions, and keeping the old recipe card handy. If people complain, the kitchen switches back immediately.

### How it works
- **Pin model snapshots** (e.g. a dated model ID), not floating aliases, in production. Provider upgrades become **your** release decisions. Track deprecation dates.
- **Bundle:** `{bundle_id, model, prompt@vN, tools@vM, retrieval config, temperature, max_tokens}` stored in config, not code. Log the bundle ID on every request.
- **Release pipeline:**
  - **Offline eval gate:** the regression suite must not get worse ([regression tests](./Evaluation-and-Testing.md#10-regression-tests-after-prompt-tool-model-or-retrieval-changes)).
  - **Shadow:** run on live traffic without showing results.
  - **Canary** at 1–5%, with automatic metrics comparison (errors, latency, cost, feedback, judge scores).
  - **Ramp** gradually.
  - **A/B test** for product impact ([online experiments](./Evaluation-and-Testing.md#9-offline-evaluation-vs-online-experiments-and-ab-testing)).
- **Rollback:** a flag flip to the previous bundle with no deploy. Keep old prompts and indexes available. Sticky assignment per user avoids flip-flopping experiences.

#### Modern C++ example — deterministic percentage rollout of a new bundle, canary metric comparison, and automatic rollback
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iomanip>
#include <iostream>
#include <string>

struct Bundle { std::string id, model, prompt; };
struct Metrics { double error_rate, p95_ms, thumbs_up, cost_cents; };

const Bundle& pick(const std::string& user, int canary_percent, const Bundle& stable, const Bundle& canary) {
    return std::hash<std::string>{}(user + "salt-1") % 100 < std::size_t(canary_percent) ? canary : stable;   // sticky per user
}

int main() {
    Bundle stable{"b-41", "model-2026-03", "support@v7"}, canary{"b-42", "model-2026-06", "support@v8"};
    int on_canary = 0;
    for (int u = 0; u < 10000; ++u) on_canary += pick("user-" + std::to_string(u), 5, stable, canary).id == canary.id;
    std::cout << "5% canary -> " << on_canary << " of 10000 users on " << canary.id << " (" << canary.model << ", " << canary.prompt << ")\n";

    Metrics s{0.004, 3100, 0.81, 0.62}, c{0.004, 2700, 0.74, 0.55};
    bool regress = c.error_rate > s.error_rate * 1.5 || c.p95_ms > s.p95_ms * 1.2 || c.thumbs_up < s.thumbs_up - 0.03;
    std::cout << std::fixed << std::setprecision(2) << "canary vs stable: thumbs-up " << c.thumbs_up << " vs " << s.thumbs_up
              << ", p95 " << int(c.p95_ms) << " vs " << int(s.p95_ms) << "ms, cost " << c.cost_cents << " vs " << s.cost_cents << "c\n";
    std::cout << (regress ? "ROLLBACK: flag 'support_bundle' -> " + stable.id + " (no deploy needed); investigate the quality drop" : "ramp to 25%") << '\n';
}
```

**Output:**
```text
5% canary -> 539 of 10000 users on b-42 (model-2026-06, support@v8)
canary vs stable: thumbs-up 0.74 vs 0.81, p95 2700 vs 3100ms, cost 0.55 vs 0.62c
ROLLBACK: flag 'support_bundle' -> b-41 (no deploy needed); investigate the quality drop
```

The new bundle was faster and cheaper but **worse for users**. That's exactly why quality signals are part of the canary gate.

### Interview answer
"I version everything that changes behaviour as one release bundle: a pinned model snapshot, prompt version, tool schemas, retrieval settings and sampling parameters, stored as configuration and logged on every request. Changes pass the offline regression suite, then shadow traffic, then a small sticky-per-user canary compared automatically on errors, latency, cost and quality signals like feedback and judge scores, then a gradual ramp or an A/B test. Rollback is a feature-flag flip to the previous bundle with no deploy, and provider model upgrades go through the same pipeline because I never use floating aliases in production."

---

## 7. Provider outages, failover models, and graceful degradation

**In one sentence:** model providers have outages, rate limits and latency spikes, so design **failover**: retry within limits, then switch to a **backup region/deployment** or an **alternate model or provider** that has been pre-evaluated on your tasks. If quality can't be maintained, **degrade gracefully**: a simpler model, a cached or static answer, a non-AI fallback, or a queue for later processing, with honest messaging to users.

### In plain words
If your usual taxi company's phone is down, call the second company you already checked is decent. If nobody answers, take the bus and tell your host you'll be a bit late, rather than just not showing up.

### How it works
- **Detection:** health metrics per provider/model (error rate, 429s, latency), with circuit breakers ([section 2](#2-circuit-breakers-dead-letter-queues-and-recovery-workflows)).
- **Failover ladder:** same model, other region/deployment (e.g. Bedrock or Vertex cross-region) → alternate model from the same provider → **another provider's model** → small/self-hosted model → degraded mode.
- **Prerequisites:**
  - A model-agnostic interface (gateway such as LiteLLM, Portkey or a cloud AI gateway).
  - **Prompts adapted and evaluated per model** (prompts don't always transfer).
  - Tool-calling and structured-output compatibility.
  - Quotas reserved on the backups.
- **Graceful degradation options:**
  - Disable non-essential features (suggestions, summaries).
  - Return cached or retrieval-only answers ("here are the relevant articles").
  - Queue async jobs.
  - Hand off to humans.
- Be cautious with failover for **side-effecting agents**: a different model may behave differently, so keep approvals strict. Game-day test the failover path.

#### Modern C++ example — a failover ladder across providers with health checks, ending in a degraded retrieval-only response
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Target { std::string name; bool healthy; bool evaluated_for_task; };

std::string answer(const std::vector<Target>& ladder) {
    for (auto& t : ladder) {
        if (!t.evaluated_for_task) { std::cout << "  skip " << t.name << " (not evaluated for this task)\n"; continue; }
        if (!t.healthy) { std::cout << "  " << t.name << ": unavailable (breaker open)\n"; continue; }
        return "answer from " + t.name;
    }
    return "DEGRADED: \"Our assistant is temporarily limited. Here are the most relevant help articles: [Refund policy], [Track an order].\"";
}

int main() {
    std::vector<Target> normal{{"provider-A model-L (eu-west)", true, true}, {"provider-A model-L (eu-central)", true, true}};
    std::vector<Target> regional_outage{{"provider-A model-L (eu-west)", false, true}, {"provider-A model-L (eu-central)", true, true}};
    std::vector<Target> provider_outage{{"provider-A model-L (eu-west)", false, true}, {"provider-A model-L (eu-central)", false, true},
                                        {"provider-B model-X", false, true}, {"self-hosted small model", true, false}};
    for (auto& [label, ladder] : {std::pair{"normal", normal}, std::pair{"regional outage", regional_outage}, std::pair{"wide outage", provider_outage}}) {
        std::cout << label << ":\n";
        std::string result = answer(ladder);                         // prints skipped targets first
        std::cout << "  " << result << '\n';
    }
}
```

**Output:**
```text
normal:
  answer from provider-A model-L (eu-west)
regional outage:
  provider-A model-L (eu-west): unavailable (breaker open)
  answer from provider-A model-L (eu-central)
wide outage:
  provider-A model-L (eu-west): unavailable (breaker open)
  provider-A model-L (eu-central): unavailable (breaker open)
  provider-B model-X: unavailable (breaker open)
  skip self-hosted small model (not evaluated for this task)
  DEGRADED: "Our assistant is temporarily limited. Here are the most relevant help articles: [Refund policy], [Track an order]."
```

### Interview answer
"I assume providers will fail. Per-provider health metrics and circuit breakers detect it, and a failover ladder moves from another region or deployment of the same model, to an alternate model, to another provider. That requires a model-agnostic gateway, prompts and tool schemas adapted and evaluated for each backup, and reserved quota. If no acceptable model is available I degrade gracefully: disable non-essential features, show retrieval-only results or cached answers, queue async work, or hand off to humans, with honest messaging. Side-effecting agents keep strict approvals on backup models, and I rehearse failover in game days."

---

## 8. Request queuing, concurrency limits, and backpressure

**In one sentence:** LLM capacity is limited (provider **rate limits** in requests and tokens per minute, GPU throughput), so put **bounded queues** in front of model calls, enforce **concurrency limits** per provider/tenant, use **token-bucket** rate limiting, and apply **backpressure**: reject early with `429 + Retry-After` or degrade when queues fill, instead of letting latency explode and requests time out.

### In plain words
A popular restaurant with 20 tables takes a limited waiting list. When the list is full, it tells new arrivals honestly, "come back in 30 minutes", rather than packing people into the doorway until nobody gets served.

### How it works
- **Limits to respect:** provider RPM/TPM (requests and tokens per minute), concurrent streams, your GPU batch capacity, and downstream tool limits.
- **Admission control:** token-bucket per tenant (fairness, so one customer's batch job doesn't starve others) and a global concurrency semaphore per provider.
- **Bounded queue + timeouts:** requests that would wait longer than their deadline are **shed** early (fail fast is better than a timeout after 60 s).
- **Priorities:** interactive traffic ahead of batch, paid tiers ahead of free tiers, and a separate queue for async jobs.
- **Backpressure signals:** `429` with `Retry-After`, queue-depth metrics, and autoscaling workers on queue depth. Clients use jittered backoff ([retries](./Tool-Use-Integrations-and-Protocols.md#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits)).
- **Token-aware:** estimate tokens per request so that TPM budgeting, not just request count, drives admission.

#### Modern C++ example — per-tenant token buckets, a global concurrency limit, and load shedding when the queue would miss the deadline
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <string>

struct TokenBucket {
    double capacity, refill_per_s, tokens, last = 0;
    bool take(double cost, double now) { tokens = std::min(capacity, tokens + (now - last) * refill_per_s); last = now; if (tokens < cost) return false; tokens -= cost; return true; }
};

int main() {
    std::map<std::string, TokenBucket> buckets{{"acme", {20'000, 2'000, 20'000}}, {"free-tier", {4'000, 400, 4'000}}};   // tokens/minute-ish budgets
    const int max_concurrency = 8; int in_flight = 8, queue_depth = 30;          // provider slots all busy
    const double avg_service_s = 2.0, deadline_s = 7.8;          // the caller's remaining time budget
    struct Req { std::string tenant; double est_tokens, t; };
    for (Req r : {Req{"acme", 6000, 0}, Req{"acme", 6000, 0.1}, Req{"acme", 9000, 0.2}, Req{"free-tier", 5000, 0.3}, Req{"acme", 3000, 5.0}}) {
        if (!buckets.at(r.tenant).take(r.est_tokens, r.t)) { std::cout << r.tenant << " (" << r.est_tokens << " tok): 429 Retry-After (tenant budget)\n"; continue; }
        double expected_wait = (queue_depth / double(max_concurrency)) * avg_service_s;
        if (in_flight >= max_concurrency && expected_wait > deadline_s) { std::cout << r.tenant << ": 503 shed early (expected wait " << expected_wait << "s > deadline)\n"; continue; }
        std::cout << r.tenant << ": queued (expected wait " << expected_wait << "s)\n";
        ++queue_depth;
    }
}
```

**Output:**
```text
acme: queued (expected wait 7.5s)
acme: queued (expected wait 7.75s)
acme (9000 tok): 429 Retry-After (tenant budget)
free-tier (5000 tok): 429 Retry-After (tenant budget)
acme: 503 shed early (expected wait 8s > deadline)
```

The last request passed its tenant budget (the bucket had refilled by t=5 s), but it was still shed: 32 queued requests on 8 slots means about 8 s of expected waiting, more than its 7.8 s deadline. Failing fast now is better than timing out later.

### Interview answer
"Model capacity is bounded by provider request and token rate limits and GPU throughput, so I put admission control in front of it. Per-tenant token buckets use estimated tokens, for fairness. A global concurrency limit per provider and a bounded priority queue put interactive requests ahead of batch. Requests that would miss their deadline get shed early with a 429 or 503 and Retry-After, rather than timing out after a long wait. Workers autoscale on queue depth, async jobs go to a separate queue, and clients back off with jitter. Monitoring queue depth, wait time and shed rate tells me when to add capacity or quota."

---

## 9. Retry storms, duplicate side effects, and idempotency keys

**In one sentence:** naive retries at **every layer** (client, gateway, agent, tool) multiply: 3 retries × 3 layers = up to 27 calls into an already struggling dependency. That's a **retry storm**. Retrying side-effecting operations also causes **duplicates** (double charges, double emails). The fixes are to:
- retry at **one layer** with **budgets**, exponential **backoff + jitter**, and circuit breakers;
- make side effects **idempotent** with **idempotency keys** stored server-side.

### In plain words
If ten people in a queue all start pressing the lift button repeatedly, the lift doesn't come faster. And if you press "send money" twice because the screen froze, the bank should recognise it's the same transfer.

### How it works
- **Retry amplification:** retries at each layer multiply. Allow retries at **one** layer (usually the closest to the failure), and set the others to fail fast.
- **Retry budget:** retries may be at most ~10% of requests. When the budget is spent, stop retrying.
- **Jittered exponential backoff** spreads retries out and avoids synchronized waves. Honour `Retry-After`.
- **Agent-specific duplicates:**
  - The model calls the same tool twice.
  - A resumed run re-executes a step.
  - A user double-submits.
  - A queue redelivers a message (at-least-once delivery).
- **Idempotency key:** derived from the **logical action** (`run_id:step:tool:hash(args)`), not from the attempt. The server stores `key → result` (with a TTL), returns the stored result on duplicates, and rejects the same key with *different* arguments. Consumers dedupe message IDs ([Tool Use: idempotency](./Tool-Use-Integrations-and-Protocols.md#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits)).

#### Modern C++ example — retry amplification across layers vs. a single layer with a retry budget, plus key-based dedupe
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>

int calls_with_layers(int layers, int retries_per_layer) { int n = 1; for (int i = 0; i < layers; ++i) n *= (1 + retries_per_layer); return n; }

int main() {
    std::cout << "worst-case calls to a failing provider per user request:\n";
    std::cout << "  3 layers x 3 retries each: " << calls_with_layers(3, 3) << '\n';
    std::cout << "  retries only at 1 layer:   " << calls_with_layers(1, 3) << '\n';

    const int requests = 1000; const double budget_ratio = 0.1;                 // retries <= 10% of requests
    int retry_tokens = int(requests * budget_ratio), retried = 0;
    for (int i = 0; i < requests; ++i) { bool failed = true; if (failed && retry_tokens > 0) { --retry_tokens; ++retried; } }
    std::cout << "during an outage, retry budget allows " << retried << " retries for " << requests << " failing requests (not " << requests * 3 << ")\n";

    std::map<std::string, std::string> idem;                                    // server-side store
    auto send_email = [&](const std::string& key, const std::string& args) {
        if (auto it = idem.find(key); it != idem.end()) return it->second == args ? std::string("duplicate ignored, returning original result") : std::string("409 Conflict: key reused with different args");
        idem[key] = args; return std::string("email sent");
    };
    std::string key = "run-31:step-4:send_email:7f3a";
    std::cout << "attempt 1: " << send_email(key, "to=mona subject=Refund approved") << '\n';
    std::cout << "redelivery: " << send_email(key, "to=mona subject=Refund approved") << '\n';
    std::cout << "buggy reuse: " << send_email(key, "to=karim subject=Refund approved") << '\n';
}
```

**Output:**
```text
worst-case calls to a failing provider per user request:
  3 layers x 3 retries each: 64
  retries only at 1 layer:   4
during an outage, retry budget allows 100 retries for 1000 failing requests (not 3000)
attempt 1: email sent
redelivery: duplicate ignored, returning original result
buggy reuse: 409 Conflict: key reused with different args
```

(With 3 retries per layer, each layer makes up to 4 attempts, so three layers make 4³ = **64** calls.)

### Interview answer
"Retries at every layer multiply. Three layers with three retries each can turn one request into 64 calls against a struggling provider, so I retry at a single layer with exponential backoff, jitter, Retry-After handling, a retry budget of around 10 percent of traffic, and circuit breakers. Agents add duplicate-side-effect risks from repeated tool calls, resumed steps, double submits and at-least-once queues. Every side-effecting tool therefore takes an idempotency key derived from the logical action rather than the attempt. The server stores key to result, replays it for duplicates, and rejects a key reused with different arguments."

---

## 10. SLA/SLO design and incident investigation

**In one sentence:**
- An **SLA** is the external promise, with penalties.
- An **SLO** is your internal target for an **SLI** (a measured indicator).

For LLM products, define SLIs for **availability, latency (TTFT and end-to-end), and quality**: task success, groundedness, valid structured output. Use **error budgets** to balance velocity against reliability, and investigate incidents with traces, version changes and dependency health.

### In plain words
"99.5% of chat replies start within 2 seconds" is a promise you can measure. If you're beating it comfortably, ship faster; if you're burning through the allowed failures, slow down and fix reliability.

### How it works
| SLI | Example SLO |
|---|---|
| Availability | 99.9% of chat requests return a non-error response (monthly) |
| TTFT | 95% of streamed responses start < 1.5 s |
| End-to-end latency | 90% of agent tasks complete < 30 s |
| Structured output validity | 99.5% of extraction responses pass schema validation |
| Quality (sampled) | ≥ 90% judge-rated grounded answers per week |
| Agent task success | ≥ 85% of support tasks resolved without escalation |

- **Error budget:** 99.9% monthly = ~43 minutes of failure. Burn-rate alerts protect it ([alerting](#5-logs-metrics-dashboards-and-actionable-alerting)).
- **SLA ≤ SLO:** promise customers less than you target internally. Exclude provider outages only if the contract says so.
- **Incident investigation:**
  1. Detect (alert or user report) and declare severity.
  2. **Mitigate first**: roll back the bundle, fail over, shed load.
  3. Find what changed: deploys, prompt/model versions, provider status, traffic mix, index updates.
  4. Use traces to locate the failing step.
  5. Write a blameless postmortem with action items, and add an eval case ([Production Incidents](../Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md)).

#### Modern C++ example — compute SLIs against SLOs, the remaining error budget, and correlate an SLO breach with a version change
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Day { int day; long requests, errors, slow_ttft; std::string bundle; };

int main() {
    std::vector<Day> days{{1, 400000, 220, 9000, "b-41"}, {2, 410000, 230, 9500, "b-41"}, {3, 395000, 210, 8800, "b-41"},
                          {4, 420000, 2900, 31000, "b-42"}, {5, 415000, 240, 9100, "b-41"}};
    const double slo_avail = 0.999, slo_ttft = 0.95;
    long total = 0, errors = 0;
    std::cout << std::fixed << std::setprecision(4);
    for (auto& d : days) {
        double avail = 1 - double(d.errors) / d.requests, ttft = 1 - double(d.slow_ttft) / d.requests;
        total += d.requests; errors += d.errors;
        std::cout << "day " << d.day << " [" << d.bundle << "] availability " << avail << (avail < slo_avail ? " BREACH" : "") << ", TTFT<1.5s " << ttft << (ttft < slo_ttft ? " BREACH" : "") << '\n';
    }
    double budget = (1 - slo_avail) * total, used = errors;
    std::cout << std::setprecision(1) << "error budget used: " << used / budget * 100 << "% of " << budget << " allowed failures so far\n";
    std::cout << "investigation: breach only on day 4, the only day bundle b-42 was live -> rolled back on day 5; postmortem + add failing cases to evals\n";
}
```

**Output:**
```text
day 1 [b-41] availability 0.9994, TTFT<1.5s 0.9775
day 2 [b-41] availability 0.9994, TTFT<1.5s 0.9768
day 3 [b-41] availability 0.9995, TTFT<1.5s 0.9777
day 4 [b-42] availability 0.9931 BREACH, TTFT<1.5s 0.9262 BREACH
day 5 [b-41] availability 0.9994, TTFT<1.5s 0.9781
error budget used: 186.3% of 2040.0 allowed failures so far
investigation: breach only on day 4, the only day bundle b-42 was live -> rolled back on day 5; postmortem + add failing cases to evals
```

One bad release spent the whole budget for the period. Under an error-budget policy, that freezes risky launches until reliability work lands.

### Interview answer
"I define SLIs that reflect the user experience — availability, time to first token, end-to-end task latency, structured-output validity — plus sampled quality and task-success SLIs, and set SLOs with error budgets. External SLAs are looser than internal SLOs. Burn-rate alerts protect the budget, and exhausting it shifts priority from features to reliability. In an incident I mitigate first by rolling back the bundle, failing over or shedding load, then look for what changed — deploys, prompt or model versions, provider status, traffic mix, index updates — and use traces to find the failing step. I finish with a blameless postmortem whose action items include new eval cases."

---

## 11. Streaming responses, cancellation, and timeout handling

**In one sentence:**
- **Stream** tokens to the user (SSE/WebSocket) to cut *perceived* latency to the time to first token.
- Propagate **cancellation** when the user stops or disconnects, so you stop paying for tokens and stop agent steps.
- Set **timeouts** at every level: per model call, per tool, per step, and an overall run deadline. Handle partial outputs explicitly.

### In plain words
Like a waiter bringing dishes as they're ready instead of all at once. If you leave the restaurant, the kitchen stops cooking your order, and no dish is allowed to take forever.

### How it works
- **Streaming:** providers emit events (text deltas, tool-call deltas, a final message with usage and stop reason). Forward them via **Server-Sent Events** and show progress for agent steps ("Searching orders…").
- **Structured output while streaming:** buffer until valid, or use partial-JSON parsers, and **validate at the end** ([malformed outputs](./Prompt-Engineering-and-Structured-Outputs.md#2-handling-malformed-outputs-refusals-and-partial-completions)).
- **Cancellation:**
  - Detect a client disconnect or a stop button.
  - Cancel the upstream HTTP stream (abort the request).
  - Cancel queued tool calls and mark the run `cancelled` at a safe checkpoint.
  - **Don't** interrupt a side-effecting tool mid-way. Let it finish or compensate.
- **Timeouts:**
  - Connect and **idle-between-chunks** timeouts for streams.
  - A total deadline per call.
  - Deadline propagation, where remaining time passes down to sub-calls.
  - Overall run limits ([stop conditions](./Agent%20Fundamentals%20and%20Decision-Making/Stop%20conditions%2C%20turn%20budgets%2C%20iteration%20limits%2C%20and%20fallback%20paths.md)).
- **Resumable streams:** clients reconnect with a `Last-Event-ID` or run ID and replay buffered events ([stateful runs](./Agentic-Frameworks-and-Orchestration.md#9-stateless-service-architecture-vs-stateful-agent-execution)).

#### Modern C++ example — stream tokens with a cancellation flag and an idle timeout between chunks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Chunk { int at_ms; std::string text; };
enum class End { Complete, Cancelled, IdleTimeout };

End stream(const std::vector<Chunk>& chunks, int cancel_at_ms, int idle_timeout_ms, std::string& shown, int& billed_chunks) {
    int last = 0;
    for (auto& c : chunks) {
        if (cancel_at_ms >= 0 && c.at_ms >= cancel_at_ms) return End::Cancelled;          // abort upstream request: stop paying
        if (c.at_ms - last > idle_timeout_ms) return End::IdleTimeout;
        shown += c.text; ++billed_chunks; last = c.at_ms;
    }
    return End::Complete;
}

int main() {
    std::vector<Chunk> normal{{350, "Your "}, {390, "refund "}, {430, "was "}, {470, "approved "}, {510, "on Oct 12."}};
    std::vector<Chunk> stalled{{350, "Your "}, {390, "refund "}, {9000, "was "}};
    const char* names[] = {"complete", "cancelled", "idle timeout"};
    for (auto [label, chunks, cancel] : {std::tuple{"normal", normal, -1}, std::tuple{"user pressed stop", normal, 420}, std::tuple{"provider stalled", stalled, -1}}) {
        std::string shown; int billed = 0;
        End e = stream(chunks, cancel, 5000, shown, billed);
        std::cout << label << ": \"" << shown << "\" -> " << names[int(e)] << ", chunks billed " << billed << " of " << chunks.size()
                  << (e == End::Complete ? "" : ", UI marks answer as partial") << '\n';
    }
    std::cout << "TTFT for the user: 350ms (first chunk) instead of waiting 510ms for the full answer\n";
}
```

**Output:**
```text
normal: "Your refund was approved on Oct 12." -> complete, chunks billed 5 of 5
user pressed stop: "Your refund " -> cancelled, chunks billed 2 of 5, UI marks answer as partial
provider stalled: "Your refund " -> idle timeout, chunks billed 2 of 3, UI marks answer as partial
TTFT for the user: 350ms (first chunk) instead of waiting 510ms for the full answer
```

### Interview answer
"Streaming tokens over SSE or WebSockets makes perceived latency equal to time to first token. For agents I also stream step progress, and structured outputs are validated when the stream completes. When the user stops or disconnects, I propagate cancellation: abort the upstream model stream to stop token spend, cancel pending tool calls, and checkpoint the run as cancelled. Side-effecting tools are never cut off mid-execution. Every level has timeouts — connect, idle time between chunks, a per-call deadline and an overall run deadline propagated to sub-calls — and partial answers are clearly marked. Clients can reconnect to a run and replay buffered events."

---

## 12. Token usage, per-step cost, and latency budgets

**In one sentence:** record **input/output (and cached) tokens, cost and latency per step** of every run. Attribute them to feature, tenant and prompt version. Then enforce **budgets**:
- per-request token and **cost caps**;
- per-run **step limits**;
- a **latency budget** split across retrieval, model calls and tools;
- per-tenant spend limits with alerts.

### In plain words
A travel budget: you know what each part of the trip may cost (flights, hotel, food), you track receipts as you go, and you stop adding activities when the money or the time runs out.

### How it works
- **Accounting:** providers return usage per call (input, output, cache read/write tokens). Multiply by the price table for that model version, and store it on the span and in a usage table keyed by tenant, feature and run.
- **Per-step view:** find the expensive step. Often it's a long system prompt repeated every turn, a huge tool output, or a loop.
- **Budgets:**
  - `max_output_tokens` per call;
  - a max steps / tool calls per run;
  - a max cost per run (stop gracefully with a partial answer or escalate);
  - monthly per-tenant quotas.
- **Latency budget:** e.g. a 5 s p95 target split as retrieval 300 ms + plan call 1.5 s + tools 1.2 s + answer call 1.8 s + overhead 200 ms. A step exceeding its share triggers degradation (skip reranking, use a smaller model).
- **Unit economics:** cost per successful task and per active user versus revenue. Use it to guide optimization ([cost optimization](#3-cost-optimization-smaller-models-batching-caching-and-routing)).

#### Modern C++ example — per-step token and cost accounting with a run cost cap and a latency budget check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Step { std::string name; int in_tokens, cached_tokens, out_tokens, latency_ms, budget_ms; };

int main() {
    const double in_price = 3.0 / 1e6, cached_price = 0.3 / 1e6, out_price = 15.0 / 1e6, max_run_cost = 0.05;
    std::vector<Step> run{{"plan", 4200, 3000, 120, 1300, 1500}, {"tool:search_orders", 0, 0, 0, 900, 1200},
                          {"reason over results", 9800, 3000, 300, 2100, 1800}, {"answer", 10400, 3000, 450, 1700, 1800}};
    double total = 0; int total_ms = 0;
    std::cout << std::fixed << std::setprecision(4);
    for (auto& s : run) {
        double cost = (s.in_tokens - s.cached_tokens) * in_price + s.cached_tokens * cached_price + s.out_tokens * out_price;
        total += cost; total_ms += s.latency_ms;
        std::cout << s.name << ": in " << s.in_tokens << " (cached " << s.cached_tokens << "), out " << s.out_tokens << ", $" << cost << ", "
                  << s.latency_ms << "ms" << (s.latency_ms > s.budget_ms ? " OVER latency budget " + std::to_string(s.budget_ms) + "ms" : "") << '\n';
        if (total > max_run_cost) { std::cout << "run cost cap $" << max_run_cost << " reached -> stop with partial answer / escalate\n"; break; }
    }
    std::cout << "run total: $" << total << ", " << total_ms << "ms (target p95 6000ms)\n";
    std::cout << "biggest lever: 'reason over results' sends 6800 uncached tokens of raw tool output -> return compact tool results\n";
}
```

**Output:**
```text
plan: in 4200 (cached 3000), out 120, $0.0063, 1300ms
tool:search_orders: in 0 (cached 0), out 0, $0.0000, 900ms
reason over results: in 9800 (cached 3000), out 300, $0.0258, 2100ms OVER latency budget 1800ms
answer: in 10400 (cached 3000), out 450, $0.0299, 1700ms
run cost cap $0.0500 reached -> stop with partial answer / escalate
run total: $0.0620, 6000ms (target p95 6000ms)
biggest lever: 'reason over results' sends 6800 uncached tokens of raw tool output -> return compact tool results
```

Here the cap is checked *after* each step, so the run slightly overshoots it. A stricter version estimates the next step's cost **before** calling the model.

### Interview answer
"I record usage on every model call — input, output and cached tokens, cost from the price table for that model version, and latency — on the trace span and in a usage table keyed by tenant, feature, prompt version and run. Per-step views reveal the expensive parts, usually repeated long prompts, raw tool outputs or loops. Then I enforce budgets: max output tokens per call, max steps and cost per run with a graceful stop or escalation, per-tenant quotas with alerts, and a latency budget split across retrieval, model calls and tools, where overruns trigger cheaper paths. Cost per successful task becomes the unit-economics metric that guides optimization."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Caching | provider prompt caching (stable prefix first); exact response cache keyed by model+prompt version+tenant; semantic cache only for safe domains; embedding/retrieval caches incl. ACL |
| Breakers & DLQ | closed → open (fail fast + fallback) → half-open probe; DLQ with full context; redrive idempotently |
| Cost | route small→large, cache, trim context, cap output, batch APIs, fewer steps, distill; measure cost per successful task |
| Traces | OTel spans per retrieval/model/tool; GenAI attributes (model, tokens, finish reason); redact PII; find the anomalous span |
| Metrics & alerts | golden signals + TTFT, tokens/cost, refusals, schema failures, quality; low-cardinality labels; page on burn rate, ticket on drift |
| Versioning | release bundle (pinned model + prompt + tools + params); eval gate → shadow → canary → ramp; flag-based rollback |
| Outages | failover ladder (region → model → provider), pre-evaluated prompts, gateway, reserved quota; graceful degradation |
| Backpressure | token buckets per tenant, concurrency caps, bounded priority queues, shed early with 429/503 + Retry-After |
| Retry storms | retry at one layer, budgets, jitter, breakers; idempotency key per logical action; reject key reuse with new args |
| SLOs | availability, TTFT, task latency, schema validity, quality, task success; error budgets; mitigate first, then root-cause |
| Streaming | SSE token + step events; cancel upstream on stop/disconnect; idle + total + run deadlines; mark partials; resumable |
| Budgets | per-step tokens/cost/latency; caps per call/run/tenant; latency budget per stage; unit economics |
