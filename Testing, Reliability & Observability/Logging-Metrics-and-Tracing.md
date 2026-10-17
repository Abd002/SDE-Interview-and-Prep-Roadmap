# Logging, Metrics, and Tracing — Observability You Can Debug With

> **What you'll learn:** how to write **structured logs** with severity levels and **correlation IDs**, how **metrics** work (counters, gauges, histograms), why **cardinality** matters, the **RED** and **USE** methods, how **distributed tracing** follows one request across services (spans, context propagation, sampling), how **OpenTelemetry** ties it all together, how to **correlate** logs, metrics and traces to find root causes, and how to design **alerts** people trust (including **burn-rate** alerts). Each part has a runnable C++ example.
>
> **Prerequisites:** [Distributed Systems → Distributed tracing](../System%20Design/Distributed-Systems.md#4-distributed-tracing), [SRE → SLOs](./Reliability-Engineering-SRE.md#7-slis-slos-slas-and-error-budgets).

## Table of Contents
1. [Alert quality: actionable alerts, thresholds, burn-rate alerts](#1-alert-quality-actionable-alerts-thresholds-burn-rate-alerts)
2. [Distributed tracing, spans, context propagation, and sampling](#2-distributed-tracing-spans-context-propagation-and-sampling)
3. [Logs/metrics/traces correlation for root-cause analysis](#3-logsmetricstraces-correlation-for-root-cause-analysis)
4. [Metrics cardinality, aggregation, dashboards, and retention](#4-metrics-cardinality-aggregation-dashboards-and-retention)
5. [OpenTelemetry instrumentation and collectors](#5-opentelemetry-instrumentation-and-collectors)
6. [RED (rate, errors, duration) and USE (utilization, saturation, errors)](#6-red-rate-errors-duration-and-use-utilization-saturation-errors)
7. [Structured logging, severity levels, and correlation IDs](#7-structured-logging-severity-levels-and-correlation-ids)
8. [Cheat sheet](#cheat-sheet)

**The three pillars:** **logs** = detailed events ("what happened"), **metrics** = cheap numbers over time ("how much / how often"), **traces** = the path of one request through many services ("where did the time go"). Observability is being able to answer **new** questions about your system from these signals without shipping new code.

---

## 1. Alert quality: actionable alerts, thresholds, burn-rate alerts

**In one sentence:** a good alert fires **only when a human must act now**, says **what's wrong and where to start**, is based on **user-visible symptoms** (SLOs) rather than every internal cause, and **burn-rate alerts** page when the **error budget is being spent too fast**.

### In plain words
A smoke alarm that goes off every time you make toast gets its battery removed. Alerts are the same: too many false alarms, and people stop listening — then the real fire is missed.

### How it works
**Rules for actionable alerts**
- **Page** (wake someone up) only for urgent, user-impacting problems; everything else is a **ticket** or a dashboard.
- **Alert on symptoms, not causes:** "checkout error rate > SLO" (symptom) instead of "CPU 85% on node 7" (cause, maybe harmless).
- Every alert links a **runbook** (what to check, how to mitigate) and a dashboard.
- Use **durations** (`for: 5m`) and **hysteresis** to avoid flapping; group related alerts.
- Review alerts regularly: every page that needed no action is a bug in the alerting.

**Thresholds:** static (`p99 > 500 ms`), relative to normal (anomaly detection, seasonality), or **SLO-based**.

**Burn-rate alerts (Google SRE Workbook)**
- SLO 99.9% → **error budget** 0.1% of requests per 30 days.
- **Burn rate** = observed error rate ÷ budgeted error rate. Burn rate 1 = budget lasts exactly 30 days; burn rate 14.4 = budget gone in ~2 days.
- **Multi-window, multi-burn-rate:** page if burn rate > **14.4 over 1 hour AND over 5 minutes** (fast, severe); page if > **6 over 6 hours AND over 30 minutes**; ticket if > **1 over 3 days**. The short window makes the alert **stop** quickly once fixed.

#### Modern C++ example — burn-rate evaluation with a long and a short window
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Window { std::string name; double error_rate; };

double burn_rate(double error_rate, double slo) { return error_rate / (1.0 - slo); }

std::string evaluate(double slo, const Window& long_w, const Window& short_w, double threshold, const std::string& action) {
    double bl = burn_rate(long_w.error_rate, slo), bs = burn_rate(short_w.error_rate, slo);
    bool fire = bl > threshold && bs > threshold;                       // both windows must agree
    std::ostringstream out;
    out << std::fixed << std::setprecision(1) << long_w.name << " burn " << bl << ", " << short_w.name << " burn " << bs
        << " (threshold " << threshold << ") -> " << (fire ? action : "no alert");
    return out.str();
}

int main() {
    const double slo = 0.999;                                           // 99.9% success over 30 days
    std::cout << "budget: " << (1 - slo) * 100 << "% errors; 30 days at burn 14.4 lasts "
              << std::fixed << std::setprecision(1) << 30.0 / 14.4 << " days\n";
    std::cout << "incident now:  " << evaluate(slo, {"1h", 0.020}, {"5m", 0.030}, 14.4, "PAGE") << '\n';
    std::cout << "already fixed: " << evaluate(slo, {"1h", 0.020}, {"5m", 0.0005}, 14.4, "PAGE") << '\n';
    std::cout << "slow leak:     " << evaluate(slo, {"6h", 0.007}, {"30m", 0.008}, 6.0, "PAGE") << '\n';
    std::cout << "normal day:    " << evaluate(slo, {"1h", 0.0004}, {"5m", 0.0006}, 14.4, "PAGE") << '\n';
}
```

**Output:**
```text
budget: 0.1% errors; 30 days at burn 14.4 lasts 2.1 days
incident now:  1h burn 20.0, 5m burn 30.0 (threshold 14.4) -> PAGE
already fixed: 1h burn 20.0, 5m burn 0.5 (threshold 14.4) -> no alert
slow leak:     6h burn 7.0, 30m burn 8.0 (threshold 6.0) -> PAGE
normal day:    1h burn 0.4, 5m burn 0.6 (threshold 14.4) -> no alert
```

### Interview answer
"An alert should page only when a human needs to act now, based on user-visible symptoms like SLO violations, with a runbook link and a duration to avoid flapping; causes like high CPU go to dashboards or tickets. I like multi-window burn-rate alerts: burn rate is the error rate divided by the error budget rate, and paging when both the 1-hour and 5-minute windows exceed 14.4 catches fast incidents while the short window stops the alert as soon as it's fixed. A slower 6-hour window catches slow leaks."

---

## 2. Distributed tracing, spans, context propagation, and sampling

**In one sentence:** a **trace** is the record of one request's journey across services, made of **spans** (timed operations with a parent), linked by a **trace ID** that is **propagated** in headers (W3C `traceparent`), and **sampled** so you keep the useful traces without storing all of them.

### In plain words
A parcel with a tracking number: every depot it passes scans it with the time. Later you see the full route and exactly which depot held it up. The tracking number travels **with** the parcel — that's context propagation.

### How it works
- **Span:** name, trace ID, span ID, parent span ID, start, duration, status, **attributes** (`http.route`, `db.statement`), **events** (logs inside the span).
- **Context propagation:** the caller sends `traceparent: 00-<trace-id 32 hex>-<parent-span-id 16 hex>-<flags>`; the callee creates a child span with that parent. Inside a process, context passes through function calls, threads and async tasks (thread-local or explicit context objects). Message queues carry it in **message headers**.
- **Sampling**
  - **Head-based:** decide at the start (e.g. keep 1%) — cheap, but may drop the rare slow/error trace.
  - **Tail-based:** buffer whole traces in the collector and keep **errors, slow ones and a % of the rest** — more useful, needs memory.
  - Always propagate the decision so a trace is either complete or absent.
- Backends: Jaeger, Grafana Tempo, Zipkin, Honeycomb, Datadog APM, AWS X-Ray.

#### Modern C++ example — spans across three "services" with propagated context and a tail-sampling decision
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Span { std::string trace_id, span_id, parent, name; int start_ms, dur_ms; bool error = false; };
struct Context { std::string trace_id, span_id; };                  // what travels in `traceparent`

std::vector<Span> collector;                                         // stands in for the tracing backend
int next_id = 1;
int clock_ms = 0;

std::string hex16(int n) { std::string s = std::to_string(n); return std::string(16 - s.size(), '0') + s; }
std::string traceparent(const Context& c) { return "00-" + c.trace_id + "-" + c.span_id + "-01"; }
Context parse(const std::string& header) { return {header.substr(3, 32), header.substr(36, 16)}; }

Context start(const Context& parent, int& start_ms) {
    start_ms = clock_ms;
    return {parent.trace_id, hex16(next_id++)};
}
void end(const Context& self, const Context& parent, const std::string& name, int start_ms, bool error = false) {
    collector.push_back({self.trace_id, self.span_id, parent.span_id, name, start_ms, clock_ms - start_ms, error});
}

void db_query(const std::string& header) {                           // service 3
    Context parent = parse(header); int t;
    Context me = start(parent, t);
    clock_ms += 180;                                                 // the slow part
    end(me, parent, "db SELECT orders", t);
}
void orders_service(const std::string& header) {                     // service 2
    Context parent = parse(header); int t;
    Context me = start(parent, t);
    clock_ms += 5;
    db_query(traceparent(me));                                       // propagate to the next hop
    clock_ms += 5;
    end(me, parent, "orders GET /orders", t);
}
void gateway() {                                                     // service 1: root span
    Context root{"4bf92f3577b34da6a3ce929d0e0e4736", "0000000000000000"};
    int t;
    Context me = start(root, t);
    clock_ms += 10;
    std::string header = traceparent(me);
    std::cout << "outgoing header: traceparent: " << header << '\n';
    orders_service(header);
    clock_ms += 10;
    end(me, root, "gateway GET /checkout", t);
}

int main() {
    gateway();
    int total = 0;
    for (auto& s : collector) if (s.parent == "0000000000000000") total = s.dur_ms;
    std::cout << "trace " << collector[0].trace_id << " (" << collector.size() << " spans, " << total << " ms):\n";
    for (auto it = collector.rbegin(); it != collector.rend(); ++it)
        std::cout << "  " << std::string(it->start_ms / 5, ' ') << it->name << "  " << it->dur_ms << " ms"
                  << (it->dur_ms * 100 / total > 50 ? "   <-- " + std::to_string(it->dur_ms * 100 / total) + "% of the time" : "") << '\n';
    bool keep = total > 150;                                          // tail sampling: keep slow or error traces
    std::cout << "tail sampler: " << (keep ? "KEEP (slower than 150 ms)" : "drop (sampled out)") << '\n';
}
```

**Output:**
```text
outgoing header: traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-0000000000000001-01
trace 4bf92f3577b34da6a3ce929d0e0e4736 (3 spans, 210 ms):
  gateway GET /checkout  210 ms   <-- 100% of the time
    orders GET /orders  190 ms   <-- 90% of the time
     db SELECT orders  180 ms   <-- 85% of the time
tail sampler: KEEP (slower than 150 ms)
```

### Interview answer
"A trace is a tree of spans sharing one trace ID; each span records an operation's timing, status and attributes, with a parent span ID. The context is propagated between services in the W3C `traceparent` header, and through message headers for queues, so every hop adds child spans. I'd use head sampling for cheap baseline volume and tail sampling in the collector to always keep errors and slow traces. The waterfall then shows exactly which hop took the time."

---

## 3. Logs/metrics/traces correlation for root-cause analysis

**In one sentence:** connect the three signals with **shared identifiers and labels** — the **trace ID in every log line**, **exemplars** linking metric spikes to example traces, and the **same service/route/version labels** everywhere — so you can jump **metric → trace → logs** and find the root cause quickly.

### In plain words
An alarm (metric) says "the kitchen is slow". The order ticket (trace) shows which dish took long. The cook's notes (logs) for that exact ticket explain why: "oven 3 broken". Without the ticket number on the notes, you'd read every note of the day.

### How it works
**The usual investigation path**
1. **Metric** shows the symptom and the scope: p99 latency of `POST /checkout` jumped at 14:02, only in `region=eu`, only `version=2.4.1`.
2. **Exemplar / trace search** gives example slow traces from that window; the waterfall shows the time is in `payments → fraud-check`.
3. **Logs filtered by `trace_id`** for those traces show `fraud-check: connection pool exhausted (max=10)`.
4. **Change history** (deploys, flags, config) at 14:00: pool size changed in 2.4.1 → root cause; roll back.

**What makes correlation work**
- Inject `trace_id`/`span_id` into **every log record** (OpenTelemetry log bridge does it).
- Same **resource attributes** everywhere: `service.name`, `service.version`, `deployment.environment`, `k8s.pod.name`, region.
- **Exemplars**: histograms store a trace ID for some sample points (Prometheus/OpenMetrics, Grafana).
- Annotate dashboards with **deploys and feature-flag changes**.

#### Modern C++ example — from a latency spike to the slow trace to its log lines
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Request { std::string trace_id, version; int latency_ms; };
struct LogLine { std::string trace_id, service, msg; };

int main() {
    std::vector<Request> reqs;                                        // metric source + exemplars
    for (int i = 0; i < 20; ++i) reqs.push_back({"t" + std::to_string(i), i < 10 ? "2.4.0" : "2.4.1", i < 10 ? 120 : (i % 3 == 0 ? 2400 : 130)});
    std::vector<LogLine> logs{
        {"t12", "checkout", "calling payments"},
        {"t12", "payments", "calling fraud-check"},
        {"t12", "fraud-check", "waited 2.2s for a DB connection: pool exhausted (max=10)"},
        {"t15", "fraud-check", "waited 2.3s for a DB connection: pool exhausted (max=10)"},
        {"t3", "checkout", "ok"},
    };

    // 1. Metric: compare max latency by version label.
    for (std::string v : {"2.4.0", "2.4.1"}) {
        int mx = 0;
        for (auto& r : reqs) if (r.version == v) mx = std::max(mx, r.latency_ms);
        std::cout << "metric: max latency version " << v << " = " << mx << " ms\n";
    }
    // 2. Exemplar: pick a slow request's trace ID.
    auto slow = std::find_if(reqs.begin(), reqs.end(), [](auto& r) { return r.latency_ms > 1000; });
    std::cout << "exemplar: slow trace " << slow->trace_id << " (" << slow->latency_ms << " ms)\n";
    // 3. Logs filtered by that trace ID.
    for (auto& l : logs) if (l.trace_id == slow->trace_id) std::cout << "  log [" << l.service << "] " << l.msg << '\n';
    std::cout << "root cause candidate: fraud-check DB pool in version 2.4.1 -> check its config change\n";
}
```

**Output:**
```text
metric: max latency version 2.4.0 = 120 ms
metric: max latency version 2.4.1 = 2400 ms
exemplar: slow trace t12 (2400 ms)
  log [checkout] calling payments
  log [payments] calling fraud-check
  log [fraud-check] waited 2.2s for a DB connection: pool exhausted (max=10)
root cause candidate: fraud-check DB pool in version 2.4.1 -> check its config change
```

### Interview answer
"I make the signals linkable: the trace ID goes into every log line, histograms carry exemplars that point to traces, and all three use the same service, version and environment labels, with deploys annotated on dashboards. Then an investigation goes from a metric that shows the symptom and its scope, to example traces that show which hop is slow, to that trace's logs that show why, and finally to the change history to find what triggered it."

---

## 4. Metrics cardinality, aggregation, dashboards, and retention

**In one sentence:** a metric's **cardinality** is the number of unique **label combinations** (time series) — keep it **bounded** (no user IDs or raw URLs as labels), choose the right **type and aggregation** (counters → rates, histograms → percentiles), build **dashboards** around questions, and set **retention/downsampling** to control cost.

### In plain words
A metric is a spreadsheet column per unique combination of labels. Labels like `status=200|500` add a few columns. A label like `user_id` adds a **million** columns — the spreadsheet (and your bill) explodes.

### How it works
**Metric types (Prometheus / OpenTelemetry)**
| Type | Example | Query |
|---|---|---|
| **Counter** (only goes up) | `http_requests_total` | `rate(...[5m])` per second |
| **Gauge** (up and down) | `queue_depth`, `memory_bytes` | current value, `max_over_time` |
| **Histogram** (bucketed observations) | `http_request_duration_seconds` | `histogram_quantile(0.99, ...)` — **aggregatable** across instances |
| **Summary** (client-side quantiles) | rarely recommended | quantiles **can't be averaged** across instances |

**Cardinality**
- Series = product of each label's distinct values: `method(5) × route(50) × status(10) × instance(20) = 50,000`.
- **Never** label with unbounded values: user ID, request ID, email, raw URL path, timestamps, error messages. Use **templated routes** (`/users/:id`) and put IDs in **logs/traces**.
- Watch for explosions: Prometheus `topk(10, count by (__name__)({__name__=~".+"}))`, cardinality limits in the agent.

**Aggregation pitfalls:** don't average averages or percentiles — aggregate **histogram buckets**, then compute the quantile. Sum counters' **rates**, not raw counters across restarts.

**Dashboards:** top row = **SLO / golden signals** (RED); then per-dependency panels; then resources (USE). Each panel answers a question; link to traces/logs.

**Retention:** raw high-resolution for days–weeks, **downsampled** (5m, 1h) for months; recording rules for expensive queries. Long-term storage: Thanos, Cortex/Mimir, VictoriaMetrics.

#### Modern C++ example — cardinality explosion, and why you aggregate histograms instead of averaging percentiles
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

int main() {
    // Cardinality: count distinct label sets for 100k requests.
    std::set<std::string> by_route, by_raw_path;
    for (int i = 0; i < 100000; ++i) {
        std::string method = i % 4 ? "GET" : "POST", status = i % 50 ? "200" : "500";
        by_route.insert(method + " /users/:id " + status);                         // bounded labels
        by_raw_path.insert(method + " /users/" + std::to_string(i % 30000) + " " + status);   // user ID leaks into a label
    }
    std::cout << "series with templated route: " << by_route.size() << '\n';
    std::cout << "series with raw path:        " << by_raw_path.size() << "  <- cardinality explosion\n";

    // Two instances: a busy one (fast) and a quiet one (slow).
    std::vector<int> a(9900, 50), b(100, 900);
    for (int i = 0; i < 98; ++i) a[i] = 400;                      // just under 1% slow
    auto p99 = [](std::vector<int> v) { std::sort(v.begin(), v.end()); return v[v.size() * 99 / 100]; };
    std::vector<int> all = a; all.insert(all.end(), b.begin(), b.end());
    std::cout << "p99 instance A = " << p99(a) << " ms, instance B = " << p99(b) << " ms\n";
    std::cout << "average of the two p99s = " << (p99(a) + p99(b)) / 2 << " ms  <- wrong\n";
    std::cout << "p99 of merged data (what merged histogram buckets give) = " << p99(all) << " ms\n";
}
```

**Output:**
```text
series with templated route: 4
series with raw path:        30000  <- cardinality explosion
p99 instance A = 50 ms, instance B = 900 ms
average of the two p99s = 475 ms  <- wrong
p99 of merged data (what merged histogram buckets give) = 900 ms
```

Instance B's slow requests are 1% of **all** traffic, so the true p99 is 900 ms. Averaging the per-instance p99s says 475 ms and hides the problem.

### Interview answer
"Cardinality is the number of unique label combinations, and each one is a time series, so I keep labels bounded — templated routes, status classes, service and region — and put user or request IDs in logs and traces instead. I use counters with rate(), gauges for current values and histograms for latency, because histogram buckets aggregate across instances while averaging percentiles gives wrong answers. Dashboards start with SLOs and RED signals, and retention keeps raw data short and downsampled data long."

---

## 5. OpenTelemetry instrumentation and collectors

**In one sentence:** **OpenTelemetry (OTel)** is the vendor-neutral standard (CNCF) for producing **traces, metrics and logs**: you **instrument** code with its API/SDK (or auto-instrumentation), export via **OTLP** to an **OpenTelemetry Collector**, which **receives, processes (batch, filter, sample, redact) and exports** to any backend.

### In plain words
Like a universal power adapter for telemetry: instrument your app once, and you can send the data to Jaeger, Prometheus, Datadog or Grafana by changing the collector's configuration — not your code.

### How it works
- **API** (what your code calls: `tracer.start_span`, `meter.create_counter`) vs. **SDK** (the implementation: samplers, processors, exporters). Libraries depend only on the API.
- **Auto-instrumentation** for common frameworks (HTTP servers/clients, gRPC, DB drivers) in Java, Python, .NET, Node, Go; C++ uses the `opentelemetry-cpp` SDK with manual or library instrumentation.
- **Resource** attributes identify the source: `service.name`, `service.version`, `deployment.environment`.
- **Semantic conventions:** standard attribute names (`http.request.method`, `http.response.status_code`, `db.system`) so dashboards work across languages.
- **Collector pipeline:** `receivers` (otlp, prometheus, filelog) → `processors` (batch, memory_limiter, attributes/redaction, tail_sampling, k8sattributes) → `exporters` (otlp to Tempo/Jaeger, prometheusremotewrite, loki, vendor). Deployed as an **agent** (sidecar/DaemonSet) and/or a **gateway**.

```yaml
# otel-collector.yaml (excerpt)
receivers:
  otlp: { protocols: { grpc: {}, http: {} } }
processors:
  memory_limiter: { limit_mib: 512, check_interval: 1s }
  attributes/redact: { actions: [ { key: user.email, action: delete } ] }
  tail_sampling:
    policies:
      - { name: errors, type: status_code, status_code: { status_codes: [ERROR] } }
      - { name: slow,   type: latency,     latency: { threshold_ms: 500 } }
      - { name: rest,   type: probabilistic, probabilistic: { sampling_percentage: 5 } }
  batch: {}
exporters:
  otlp/tempo: { endpoint: tempo:4317, tls: { insecure: true } }
  prometheusremotewrite: { endpoint: http://mimir:9009/api/v1/push }
service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, attributes/redact, tail_sampling, batch], exporters: [otlp/tempo] }
    metrics: { receivers: [otlp], processors: [memory_limiter, batch], exporters: [prometheusremotewrite] }
```

#### Modern C++ example — a mini OTel-style pipeline: instrument → processors (redact, sample, batch) → exporter
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <vector>

struct SpanData { std::string name; int duration_ms; bool error; std::map<std::string, std::string> attrs; };

class Processor { public: virtual ~Processor() = default; virtual bool process(SpanData& s) = 0; };   // false = drop
class Redact : public Processor { public: bool process(SpanData& s) override { s.attrs.erase("user.email"); return true; } };
class TailSample : public Processor {                       // keep errors, slow spans, and 1 in 4 of the rest
public:
    bool process(SpanData& s) override { return s.error || s.duration_ms > 500 || (++n_ % 4 == 0); }
private:
    int n_ = 0;
};
class Exporter { public: virtual ~Exporter() = default; virtual void export_batch(const std::vector<SpanData>&) = 0; };
class ConsoleExporter : public Exporter {
public:
    void export_batch(const std::vector<SpanData>& b) override {
        std::cout << "export batch of " << b.size() << ":";
        for (auto& s : b) std::cout << " [" << s.name << ' ' << s.duration_ms << "ms" << (s.error ? " ERROR" : "")
                                    << (s.attrs.count("user.email") ? " email!" : "") << ']';
        std::cout << '\n';
    }
};

class Pipeline {                                            // receivers -> processors -> batch -> exporter
public:
    Pipeline(std::vector<std::unique_ptr<Processor>> p, std::unique_ptr<Exporter> e, std::size_t batch)
        : procs_(std::move(p)), exp_(std::move(e)), batch_(batch) {}
    void receive(SpanData s) {
        for (auto& p : procs_) if (!p->process(s)) { ++dropped; return; }
        buf_.push_back(std::move(s));
        if (buf_.size() == batch_) flush();
    }
    void flush() { if (!buf_.empty()) { exp_->export_batch(buf_); buf_.clear(); } }
    int dropped = 0;
private:
    std::vector<std::unique_ptr<Processor>> procs_;
    std::unique_ptr<Exporter> exp_;
    std::size_t batch_;
    std::vector<SpanData> buf_;
};

int main() {
    std::vector<std::unique_ptr<Processor>> procs;
    procs.push_back(std::make_unique<Redact>());
    procs.push_back(std::make_unique<TailSample>());
    Pipeline collector(std::move(procs), std::make_unique<ConsoleExporter>(), 3);
    // "Instrumentation": spans as an app would emit them, with resource + semantic-convention attributes.
    for (int i = 1; i <= 12; ++i)
        collector.receive({"GET /orders", i == 5 ? 900 : 40 + i, i == 9, {{"service.name", "orders"}, {"http.response.status_code", i == 9 ? "500" : "200"}, {"user.email", "u@x.com"}}});
    collector.flush();
    std::cout << "dropped by sampler: " << collector.dropped << " of 12\n";
}
```

**Output:**
```text
export batch of 3: [GET /orders 44ms] [GET /orders 900ms] [GET /orders 49ms ERROR]
export batch of 1: [GET /orders 50ms]
dropped by sampler: 8 of 12
```

The slow span and the error span were always kept; `user.email` never left the pipeline.

### Interview answer
"OpenTelemetry gives one vendor-neutral API and SDK for traces, metrics and logs, with semantic conventions for attribute names and resource attributes like service name and version. Apps export OTLP to a Collector, whose pipeline of receivers, processors and exporters handles batching, memory limits, redaction of sensitive fields and tail sampling, and sends data to whichever backends we use — so switching vendors is a config change, not a code change."

---

## 6. RED (rate, errors, duration) and USE (utilization, saturation, errors)

**In one sentence:** **RED** (Tom Wilkie) describes a **service** from the user's side — **Rate** of requests, **Errors**, **Duration** (latency distribution) — and **USE** (Brendan Gregg) describes a **resource** — **Utilization** (% busy), **Saturation** (queued work), **Errors**.

### In plain words
- RED is the restaurant from the customer's view: how many orders per hour, how many went wrong, how long people waited.
- USE is the kitchen equipment: is the oven always busy (utilization), are dishes queuing for it (saturation), is it malfunctioning (errors)?

### How it works
| Method | For | Signals | Example queries |
|---|---|---|---|
| **RED** | request-driven services, endpoints | Rate (req/s), Errors (req/s or %), Duration (p50/p95/p99 histogram) | `sum(rate(http_requests_total[5m]))`, error ratio, `histogram_quantile(0.99, …)` |
| **USE** | CPU, memory, disks, network, thread pools, connection pools, queues | Utilization %, Saturation (run-queue length, swap, queue depth, wait time), Errors | `node_cpu`, `load average / cores`, pool wait count |
| **Golden signals** (Google SRE) | services | latency, traffic, errors, **saturation** | RED + saturation |

- **Saturation is the early warning:** latency usually rises **before** utilization hits 100% because queues form (queueing theory: wait time explodes as utilization → 1).
- Use RED on dashboards and SLOs; use USE when RED says "slow" and you need to find **which resource** is the bottleneck.
- Measure errors **by class** (4xx client vs. 5xx server) and latency for **successful and failed** requests separately (fast failures can hide slowness).

#### Modern C++ example — computing RED for a service and USE for its worker pool, and seeing saturation rise first
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <vector>

struct Req { int latency_ms; int status; };

int main() {
    // RED over a 60-second window.
    std::vector<Req> window;
    for (int i = 0; i < 1200; ++i) window.push_back({i % 100 == 0 ? 950 : 40 + i % 60, i % 80 == 0 ? 503 : 200});
    std::vector<int> lat;
    int errors = 0;
    for (auto& r : window) { lat.push_back(r.latency_ms); errors += r.status >= 500; }
    std::sort(lat.begin(), lat.end());
    auto pct = [&](double p) { return lat[static_cast<std::size_t>(p * (lat.size() - 1))]; };
    std::cout << std::fixed << std::setprecision(1)
              << "RED  rate " << window.size() / 60.0 << " req/s | errors " << 100.0 * errors / window.size() << "% | duration p50 "
              << pct(0.50) << " ms, p95 " << pct(0.95) << " ms, p99 " << pct(0.99) << " ms\n";

    // USE for a pool of 8 workers; service time 40 ms. As load grows, utilization and queueing change.
    const double workers = 8, service_s = 0.040, capacity = workers / service_s;   // 200 req/s
    for (double load : {100.0, 160.0, 190.0, 198.0}) {
        double u = load / capacity;                                             // utilization
        double wait_ms = service_s * 1000 * u / (1 - u) / workers;              // rough queueing wait (M/M/c-like)
        std::cout << "USE  load " << std::setw(5) << load << " req/s | utilization " << std::setw(5) << u * 100
                  << "% | saturation (avg queue wait) " << std::setw(6) << wait_ms << " ms\n";
    }
}
```

**Output:**
```text
RED  rate 20.0 req/s | errors 1.2% | duration p50 70 ms, p95 97 ms, p99 99 ms
USE  load 100.0 req/s | utilization  50.0% | saturation (avg queue wait)    5.0 ms
USE  load 160.0 req/s | utilization  80.0% | saturation (avg queue wait)   20.0 ms
USE  load 190.0 req/s | utilization  95.0% | saturation (avg queue wait)   95.0 ms
USE  load 198.0 req/s | utilization  99.0% | saturation (avg queue wait)  495.0 ms
```

Going from 80% to 99% utilization makes the queueing wait 25× worse — saturation tells you trouble is coming long before "100% busy".

### Interview answer
"RED is how I monitor a service: request rate, error rate and latency percentiles from histograms — it maps directly to SLOs. USE is how I check each resource behind it — utilization, saturation and errors for CPU, memory, disks, and especially pools and queues. When RED shows latency rising, USE finds the bottleneck, and saturation like queue depth or pool wait time is the earliest warning because waiting time explodes as utilization approaches 100%."

---

## 7. Structured logging, severity levels, and correlation IDs

**In one sentence:** write logs as **machine-parseable key-value records** (usually JSON) with a consistent **severity level**, and attach **correlation IDs** (request ID, trace ID, user/tenant where allowed) so every line for one request can be found and joined across services.

### In plain words
"Something failed for user bob at some point" is a diary entry. `{"level":"error","event":"payment_failed","order":"81","trace_id":"4bf9…","reason":"card_declined"}` is a filing card you can search, count and sort.

### How it works
**Severity levels (and what they mean in practice)**
| Level | Use for | Production default |
|---|---|---|
| TRACE / DEBUG | developer detail, variable values | off (enable per module, temporarily) |
| INFO | normal business events (order placed, job finished) | on, but not one line per inner loop |
| WARN | unusual but handled (retry succeeded, fallback used) | on |
| ERROR | the operation failed; someone may need to look | on |
| FATAL | the process can't continue | on, then exit |

**Structured logging rules**
- **Event name + fields**, not sentences with values pasted in: `event=cache_miss key_prefix=user` (searchable, aggregatable).
- Consistent field names across services (`trace_id`, `service`, `http.route`, `duration_ms`) — OTel semantic conventions help.
- **Correlation ID:** take the incoming `X-Request-ID`/`traceparent` or create one at the edge; pass it to every downstream call and put it in every log line (thread-local/context logger).
- **Never log secrets or personal data** (passwords, tokens, full card numbers, national IDs); redact or hash.
- Log **once** where the error is handled, with context — not at every layer ("log and rethrow" duplicates).
- Control volume: sampling for noisy INFO/DEBUG, rate-limit repeated errors, retention by level.
- Pipeline: app → stdout (JSON) → agent (Fluent Bit, Vector, OTel Collector) → Loki / Elasticsearch / OpenSearch / CloudWatch.

#### Modern C++ example — a JSON structured logger with levels, a per-request correlation context and redaction
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

enum class Level { Debug, Info, Warn, Error };
const char* name(Level l) { return l == Level::Debug ? "debug" : l == Level::Info ? "info" : l == Level::Warn ? "warn" : "error"; }

thread_local std::map<std::string, std::string> log_context;      // set once per request

class Logger {
public:
    explicit Logger(Level min) : min_(min) {}
    void log(Level l, const std::string& event, std::map<std::string, std::string> fields = {}) const {
        if (l < min_) return;
        fields.insert(log_context.begin(), log_context.end());    // correlation IDs on every line
        std::string out = R"({"level":")" + std::string(name(l)) + R"(","event":")" + event + '"';
        for (auto& [k, v] : fields) out += ",\"" + k + "\":\"" + (secret_.count(k) ? std::string("[REDACTED]") : v) + '"';
        std::cout << out << "}\n";
    }
private:
    Level min_;
    std::set<std::string> secret_{"password", "card_number", "token"};
};

struct RequestScope {                                              // RAII: context lives for one request
    RequestScope(std::string trace_id, std::string tenant) { log_context = {{"trace_id", std::move(trace_id)}, {"tenant", std::move(tenant)}}; }
    ~RequestScope() { log_context.clear(); }
};

void charge(const Logger& log, const std::string& order) {           // deep inside the call stack: no IDs passed by hand
    log.log(Level::Debug, "fraud_score_computed", {{"order", order}, {"score", "0.02"}});
    log.log(Level::Warn, "payment_retry", {{"order", order}, {"attempt", "2"}, {"card_number", "4111111111111111"}});
}

int main() {
    Logger log(Level::Info);                                       // DEBUG is off in production
    {
        RequestScope scope("4bf92f3577b34da6a3ce929d0e0e4736", "acme");
        log.log(Level::Info, "order_received", {{"order", "81"}, {"http.route", "/orders"}});
        charge(log, "81");
        log.log(Level::Error, "payment_failed", {{"order", "81"}, {"reason", "card_declined"}, {"duration_ms", "412"}});
    }
    log.log(Level::Info, "background_job_done", {{"job", "cleanup"}});    // outside a request: no trace_id
}
```

**Output:**
```text
{"level":"info","event":"order_received","http.route":"/orders","order":"81","tenant":"acme","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
{"level":"warn","event":"payment_retry","attempt":"2","card_number":"[REDACTED]","order":"81","tenant":"acme","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
{"level":"error","event":"payment_failed","duration_ms":"412","order":"81","reason":"card_declined","tenant":"acme","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}
{"level":"info","event":"background_job_done","job":"cleanup"}
```

### Interview answer
"I log structured JSON records — an event name plus fields — with consistent severities: INFO for business events, WARN for handled anomalies, ERROR for failed operations, DEBUG off by default. A request-scoped context adds the trace ID and request ID to every line automatically, and the ID is propagated to downstream calls, so one query returns the whole story across services. Secrets and personal data are redacted, errors are logged once where they're handled, and noisy logs are sampled."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Three pillars | logs (events) · metrics (cheap numbers) · traces (one request's path) |
| Alerts | page only for urgent user impact; symptoms > causes; runbook link; `for:` duration |
| Burn rate | error rate ÷ (1 − SLO); page at 14.4 over 1h **and** 5m; 6 over 6h and 30m; ticket at 1 over 3d |
| Tracing | spans with parent IDs; W3C `traceparent`; propagate via headers incl. queues |
| Sampling | head (cheap) vs. tail (keep errors/slow); keep traces complete |
| Correlation | trace ID in every log; exemplars; same resource labels; deploy annotations |
| Metric types | counter → `rate()`; gauge; histogram → aggregatable quantiles; avoid summaries for aggregation |
| Cardinality | series = product of label values; no IDs/raw paths in labels |
| Never | average percentiles; label with user IDs; log secrets |
| OTel | API vs. SDK; semantic conventions; OTLP → Collector (receivers → processors → exporters) |
| RED / USE | service: rate, errors, duration · resource: utilization, saturation, errors |
| Saturation | queues form before 100% utilization — earliest warning |
| Structured logs | JSON event + fields; levels; request-scoped correlation IDs; redaction; log once |
