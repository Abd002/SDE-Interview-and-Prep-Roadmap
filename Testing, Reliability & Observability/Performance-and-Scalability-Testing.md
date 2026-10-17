# Performance and Scalability Testing — Baselines, Test Types, Profiling, Latency Percentiles and Workload Modeling

> **What you'll learn:** how to set **capacity baselines** and catch **performance regressions** in CI, the difference between **load, stress, spike and soak** tests, how to **profile** CPU, memory, I/O and database queries, how to read **throughput, latency percentiles (p50/p95/p99) and error rates** correctly, and how to **model realistic workloads** and **diagnose bottlenecks**. Each part has a runnable C++ example.
>
> **Prerequisites:** [Complexity Analysis](../Problem-solving%20and%20Coding/Complexity-Analysis.md), [Optimization → Profiling tools](../Problem-solving%20and%20Coding/Optimization.md#3-profiling-tools), [RED and USE](./Logging-Metrics-and-Tracing.md#6-red-rate-errors-duration-and-use-utilization-saturation-errors).

## Table of Contents
1. [Capacity baselines and regression performance testing](#1-capacity-baselines-and-regression-performance-testing)
2. [Load vs. stress vs. spike vs. soak testing](#2-load-vs-stress-vs-spike-vs-soak-testing)
3. [Profiling CPU, memory, I/O, and database queries](#3-profiling-cpu-memory-io-and-database-queries)
4. [Throughput, latency distributions (p50/p95/p99), and error rates](#4-throughput-latency-distributions-p50p95p99-and-error-rates)
5. [Workload modeling, realistic traffic, and bottleneck diagnosis](#5-workload-modeling-realistic-traffic-and-bottleneck-diagnosis)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Capacity baselines and regression performance testing

**In one sentence:** a **capacity baseline** records how much load one instance (or the whole system) handles **within its SLO** on a known setup, and **regression performance tests** re-measure key benchmarks on every change and **fail the build** when a result gets significantly worse.

### In plain words
Before a marathon, you time yourself on the same route every week. If one week you're 10% slower, something changed — new shoes, less sleep. Without the earlier times, you'd never notice the slow drift.

### How it works
**Capacity baseline**
- Fixed environment (instance type, version, config, data size), realistic workload, ramp load until the **SLO breaks** (e.g. p99 > 300 ms or errors > 0.1%).
- Record: **max sustainable throughput per instance**, latency percentiles at 50/80/100% of it, CPU/memory at that point, and the **first bottleneck**.
- Use it for **capacity planning**: instances needed = peak load ÷ (per-instance capacity × target utilization, e.g. 60–70%) + headroom for failures (N+1, zone loss).

**Regression testing**
- **Micro-benchmarks** (Google Benchmark, Catch2 BENCHMARK, Criterion, JMH) for hot functions; **macro/load tests** (k6, Gatling, Locust, JMeter, wrk2) for endpoints.
- Run **several repetitions**, compare **medians** (or use a statistical test), and use a **tolerance** (e.g. fail if > 5–10% slower) — single runs are noisy.
- Reduce noise: dedicated runners, fixed CPU frequency, warm-up, pinned versions, same data. Track results over time (bencher.dev, Grafana, GitHub Action benchmark).
- Also track **allocations**, **binary size**, **startup time** and **query counts** (N+1 regressions).

#### Modern C++ example — median-of-runs benchmark with a regression gate
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

template <class F>
double median_ms(F&& f, int runs) {
    std::vector<double> t;
    f();                                                           // warm-up
    for (int i = 0; i < runs; ++i) {
        auto a = std::chrono::steady_clock::now();
        f();
        t.push_back(std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - a).count());
    }
    std::sort(t.begin(), t.end());
    return t[t.size() / 2];
}

// Version A: count words with reserve. Version B (a "refactor"): copies every key string twice.
std::size_t count_a(const std::vector<std::string>& words) {
    std::unordered_map<std::string, int> m; m.reserve(words.size());
    for (const auto& w : words) ++m[w];
    return m.size();
}
std::size_t count_b(const std::vector<std::string>& words) {
    std::unordered_map<std::string, int> m;
    for (auto w : words) { std::string key = w; ++m[key]; }       // extra copies + rehashing
    return m.size();
}

int main() {
    std::vector<std::string> words;
    for (int i = 0; i < 200000; ++i) words.push_back("word_number_" + std::to_string(i % 5000) + "_with_a_long_suffix");
    volatile std::size_t sink = 0;
    double base = median_ms([&] { sink = count_a(words); }, 9);
    double candidate = median_ms([&] { sink = count_b(words); }, 9);
    double change = (candidate - base) / base * 100;
    const double tolerance = 10.0;
    std::cout << "baseline and candidate measured (median of 9 runs each)\n";
    std::cout << "regression gate (" << tolerance << "% tolerance): " << (change > tolerance ? "FAIL - candidate is slower" : "pass") << '\n';
}
```

**Output:**
```text
baseline and candidate measured (median of 9 runs each)
regression gate (10% tolerance): FAIL - candidate is slower
```

(The exact milliseconds depend on the machine, so the example prints only the verdict; on a typical laptop the candidate is about 1.5–2× slower.)

### Interview answer
"A capacity baseline is the maximum load one instance handles within the SLO on a fixed setup, plus where it breaks first; I use it to plan instance counts with target utilization and failure headroom. For regressions I run micro-benchmarks and a short load test in CI on dedicated runners, take medians of several runs with warm-up, and fail the build past a tolerance like 10%, while tracking trends like allocations and query counts over time."

---

## 2. Load vs. stress vs. spike vs. soak testing

**In one sentence:** **load** tests check behaviour at **expected** traffic, **stress** tests push **beyond** capacity to find the breaking point and how it fails, **spike** tests apply **sudden** jumps, and **soak** (endurance) tests run **normal load for hours or days** to find leaks and slow degradation.

### In plain words
Testing a bridge: normal traffic (load), keep adding trucks until something bends (stress), a sudden parade of 1,000 people at once (spike), and normal traffic for a month to see whether bolts loosen (soak).

### How it works
| Test | Load shape | Question it answers | Typical findings |
|---|---|---|---|
| **Load** | ramp to expected peak, hold | do we meet the SLO at peak? | slow endpoints, missing indexes |
| **Stress** | keep ramping past capacity | where and **how** do we break? graceful or cascading? | connection pool exhaustion, timeouts cascading, no load shedding |
| **Spike** | instant jump (10× in seconds) | do autoscaling, queues and rate limits react in time? | cold starts, thundering herd, cache stampede |
| **Soak** | normal load for 8–72 h | does anything degrade over time? | memory leaks, file-descriptor leaks, log/disk growth, GC pauses, token expiry |
| **Breakpoint / capacity** | step up until SLO fails | max sustainable throughput | baseline numbers |
| **Scalability** | same test at 1, 2, 4, 8 instances | does capacity grow linearly? | shared bottlenecks (DB, locks) |

- Tools: **k6** (JavaScript scenarios), **Gatling** (Scala/Java), **Locust** (Python), **JMeter**, **wrk/wrk2**, **vegeta**; cloud: Grafana Cloud k6, Azure Load Testing, Distributed Load Testing on AWS.
- Use **open-model** load (arrival rate, like real users) for latency tests — closed-model tools (fixed virtual users waiting for responses) hide slowness ("coordinated omission"; wrk2 and k6 `constant-arrival-rate` fix it).

```text
# k6 scenario excerpt: a spike test with an open (arrival-rate) model
export const options = { scenarios: { spike: {
  executor: 'ramping-arrival-rate', startRate: 50, timeUnit: '1s', preAllocatedVUs: 500,
  stages: [ { target: 50, duration: '2m' }, { target: 1000, duration: '10s' }, { target: 1000, duration: '3m' }, { target: 50, duration: '1m' } ] } },
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(99)<500'] } };
```

#### Modern C++ example — simulating a service under load, stress, spike and soak patterns
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Result { double served, dropped, max_queue, final_mem_mb; };

// Discrete simulation: capacity 100 req/s, queue limit 300 (load shedding beyond), a small leak per request.
Result run(const std::vector<double>& arrivals_per_s, double leak_kb_per_req) {
    const double capacity = 100, queue_limit = 300;
    double queue = 0, served = 0, dropped = 0, max_q = 0, mem_mb = 200;
    for (double a : arrivals_per_s) {
        queue += a;
        if (queue > queue_limit) { dropped += queue - queue_limit; queue = queue_limit; }   // shed load, don't fall over
        double s = std::min(queue, capacity);
        queue -= s; served += s;
        max_q = std::max(max_q, queue);
        mem_mb += s * leak_kb_per_req / 1024;
    }
    return {served, dropped, max_q, mem_mb};
}

std::vector<double> shape(std::initializer_list<std::pair<int, double>> stages) {   // (seconds, req/s)
    std::vector<double> v;
    for (auto [secs, rate] : stages) v.insert(v.end(), secs, rate);
    return v;
}

int main() {
    std::cout << std::fixed << std::setprecision(0);
    auto print = [](const std::string& name, Result r) {
        std::cout << std::left << std::setw(7) << name << " served " << std::setw(8) << r.served << " dropped " << std::setw(6) << r.dropped
                  << " max queue " << std::setw(4) << r.max_queue << " memory " << r.final_mem_mb << " MB\n";
    };
    print("load", run(shape({{600, 80}}), 0.0));                      // 80% of capacity: fine
    print("stress", run(shape({{120, 100}, {120, 150}, {120, 200}}), 0.0));   // past capacity: queue fills, sheds
    print("spike", run(shape({{60, 50}, {10, 1000}, {60, 50}}), 0.0));   // short burst: queue absorbs part
    print("soak", run(shape({{72 * 3600, 60}}), 0.1));                 // 72 h at 60 req/s with a 0.1 KB/request leak
}
```

**Output:**
```text
load    served 48000    dropped 0      max queue 0    memory 200 MB
stress  served 36000    dropped 17800  max queue 200  memory 200 MB
spike   served 7200     dropped 8800   max queue 200  memory 200 MB
soak    served 15552000 dropped 0      max queue 0    memory 1719 MB
```

Only the soak test reveals the leak: a tiny 0.1 KB per request becomes 1.5 GB after three days.

### Interview answer
"Load tests confirm the SLO at expected peak; stress tests go past capacity to find the breaking point and check we degrade gracefully — shedding load instead of cascading; spike tests check autoscaling, queues and rate limits react to sudden jumps; and soak tests run normal load for hours or days to find leaks and slow degradation. I use open-model arrival rates in tools like k6 or wrk2 to avoid coordinated omission, and thresholds on p99 and error rate to pass or fail."

---

## 3. Profiling CPU, memory, I/O, and database queries

**In one sentence:** **measure before optimizing**: use a **sampling CPU profiler** to find hot functions, **heap profilers** to find allocation hot spots and leaks, **I/O tools** to see disk/network waits, and **query analysis** (`EXPLAIN ANALYZE`, slow-query logs) to find slow or repeated database calls.

### In plain words
A doctor doesn't operate before an X-ray. A profiler is the X-ray: it shows exactly where the time and memory go, which is often not where you guessed.

### How it works
| Resource | Tools (Linux / C++ first) | What to look for |
|---|---|---|
| **CPU** | `perf record -g` + **flame graphs** (Brendan Gregg), `perf top`, gprof, VTune, Instruments; language profilers (async-profiler, py-spy, pprof) | wide flame-graph towers = hot code paths; lock spinning; serialization |
| **Memory** | **Valgrind massif**, heaptrack, jemalloc/tcmalloc profilers, **AddressSanitizer / LeakSanitizer** | allocation rate, peak heap, leaks, fragmentation |
| **I/O** | `iostat`, `iotop`, `strace -c`, `bpftrace`/BCC (`biolatency`, `opensnoop`) | many small syscalls, fsync storms, blocking reads |
| **Off-CPU / waiting** | off-CPU flame graphs, `perf sched`, tracing spans | time waiting on locks, network, disk |
| **Database** | `EXPLAIN (ANALYZE, BUFFERS)`, `pg_stat_statements`, MySQL slow-query log, APM traces | seq scans on big tables, missing indexes, **N+1 queries**, lock waits |

- **Sampling vs. instrumentation:** sampling (perf) has low overhead and is safe in production; instrumentation (timers in code, gprof) is exact but distorts timings.
- **Continuous profiling** in production: Parca, Pyroscope (Grafana), Google Cloud Profiler.
- Compile with symbols (`-g`, `-fno-omit-frame-pointer`) so stacks are readable.
- **N+1 query:** fetching a list (1 query) and then each item's details (N queries) — fix with a join, `IN (...)` batch, or eager loading.

#### Modern C++ example — a tiny instrumenting profiler that finds the hot function, and an N+1 query counter
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <iostream>
#include <map>
#include <string>
#include <vector>

std::map<std::string, double> profile_ms;                       // function -> total time
struct ScopedTimer {                                            // RAII instrumentation
    explicit ScopedTimer(std::string n) : name(std::move(n)), t0(std::chrono::steady_clock::now()) {}
    ~ScopedTimer() { profile_ms[name] += std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count(); }
    std::string name; std::chrono::steady_clock::time_point t0;
};

std::vector<int> parse(int n) { ScopedTimer t("parse"); std::vector<int> v(n); for (int i = 0; i < n; ++i) v[i] = (i * 2654435761u) % 100000; return v; }
long validate(const std::vector<int>& v) {                      // accidental O(n^2): looks up duplicates naively
    ScopedTimer t("validate");
    long dups = 0;
    for (std::size_t i = 0; i < v.size(); ++i) for (std::size_t j = 0; j < i; ++j) if (v[i] == v[j]) { ++dups; break; }
    return dups;
}
void sort_it(std::vector<int>& v) { ScopedTimer t("sort"); std::sort(v.begin(), v.end()); }

// Fake DB that counts queries: the N+1 pattern vs. one batched query.
struct Db { int queries = 0; std::string user(int id) { ++queries; return "u" + std::to_string(id); }
            std::vector<std::string> users(const std::vector<int>& ids) { ++queries; std::vector<std::string> r; for (int id : ids) r.push_back("u" + std::to_string(id)); return r; } };

int main() {
    auto v = parse(20000);
    volatile long d = validate(v);
    sort_it(v);
    (void)d;
    std::vector<std::pair<std::string, double>> rows(profile_ms.begin(), profile_ms.end());
    std::sort(rows.begin(), rows.end(), [](auto& a, auto& b) { return a.second > b.second; });
    double total = 0; for (auto& [n, ms] : rows) total += ms;
    std::cout << "hottest function: " << rows[0].first << " (" << static_cast<int>(rows[0].second * 100 / total) / 10 * 10 << "%+ of measured time)\n";

    std::vector<int> order_user_ids(50);
    for (int i = 0; i < 50; ++i) order_user_ids[i] = i;
    Db n1; for (int id : order_user_ids) n1.user(id);               // 1 query per order
    Db batched; batched.users(order_user_ids);                      // WHERE id IN (...)
    std::cout << "N+1 pattern: " << n1.queries << " queries; batched: " << batched.queries << " query\n";
}
```

**Output:**
```text
hottest function: validate (90%+ of measured time)
N+1 pattern: 50 queries; batched: 1 query
```

In a real project you'd run `perf record -g ./app` and open a flame graph; the wide `validate` tower would point at the same O(n²) loop.

### Interview answer
"I always profile before optimizing: a sampling profiler like perf with flame graphs for CPU, heaptrack or massif for allocations and leaks, iostat and eBPF tools for I/O, and off-CPU profiling when time is spent waiting. For databases I look at slow-query logs and pg_stat_statements, check plans with EXPLAIN ANALYZE for sequential scans and bad joins, and count queries per request to catch N+1 patterns, which I fix with joins or batched IN queries."

---

## 4. Throughput, latency distributions (p50/p95/p99), and error rates

**In one sentence:** report **throughput** (requests or work per second), **latency as a distribution** — p50 (median), p95, p99, max — rather than an average, and **error rate**, all **measured together**, because a system can look fast only because it's failing quickly.

### In plain words
"The average delivery takes 30 minutes" sounds fine, until you learn that 1 in 100 deliveries takes 3 hours. Percentiles tell you how bad it gets for the unlucky customers — and with many requests per page, almost everyone is unlucky sometimes.

### How it works
- **pXX** = the latency that XX% of requests are faster than. p50 = typical user; p99 = the slowest 1%; also watch **max** and **p99.9** for big systems.
- **Why not averages:** latency is **skewed** (long tail); one 5-second request hides behind 999 fast ones in the mean.
- **Tail amplification:** a page that calls 100 backends in parallel is slower than **all** of them — if each has p99 = 1 s, the chance a page avoids all slow calls is 0.99¹⁰⁰ ≈ 37% (see "The Tail at Scale", Dean & Barroso).
- **Throughput vs. latency:** as load approaches capacity, latency rises sharply ([queueing](./Logging-Metrics-and-Tracing.md#6-red-rate-errors-duration-and-use-utilization-saturation-errors)). Report latency **at a given throughput**.
- **Error rate:** count timeouts and 5xx; separate 4xx; report latency of successes and failures separately.
- **Measure correctly:** use histograms (HdrHistogram, Prometheus histograms) for percentiles; avoid **coordinated omission** (a stalled server stops the load generator from sending, hiding the stall).

#### Modern C++ example — percentiles vs. mean, and tail amplification across fan-out
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <random>
#include <vector>

double percentile(std::vector<double> v, double p) {
    std::sort(v.begin(), v.end());
    return v[static_cast<std::size_t>(std::ceil(p / 100.0 * v.size())) - 1];
}

int main() {
    std::mt19937 rng(1);
    std::lognormal_distribution<double> latency(std::log(40.0), 0.5);       // typical skewed latency, ~40 ms
    std::vector<double> ms;
    int errors = 0;
    for (int i = 0; i < 100000; ++i) {
        double l = latency(rng);
        if (i % 500 == 0) l = 3000;                                          // 0.2% stalls (GC, retries)
        if (i % 1000 == 0) ++errors;
        ms.push_back(l);
    }
    double mean = std::accumulate(ms.begin(), ms.end(), 0.0) / ms.size();
    std::cout << std::fixed << std::setprecision(0)
              << "throughput: " << ms.size() / 60.0 << " req/s over 60 s, errors " << std::setprecision(2) << 100.0 * errors / ms.size() << "%\n"
              << std::setprecision(0) << "mean " << mean << " ms | p50 " << percentile(ms, 50) << " | p95 " << percentile(ms, 95)
              << " | p99 " << percentile(ms, 99) << " | p99.9 " << percentile(ms, 99.9) << " | max " << *std::max_element(ms.begin(), ms.end()) << " ms\n";

    std::cout << std::setprecision(1);
    for (int fanout : {1, 10, 100})
        std::cout << "page calling " << std::setw(3) << fanout << " backends: chance at least one is slower than its p99 = "
                  << 100 * (1 - std::pow(0.99, fanout)) << "%\n";
}
```

**Output:**
```text
throughput: 1667 req/s over 60 s, errors 0.10%
mean 51 ms | p50 40 | p95 92 | p99 132 | p99.9 3000 | max 3000 ms
page calling   1 backends: chance at least one is slower than its p99 = 1.0%
page calling  10 backends: chance at least one is slower than its p99 = 9.6%
page calling 100 backends: chance at least one is slower than its p99 = 63.4%
```

The mean (51 ms) looks harmless; p99.9 shows the 3-second stalls.

### Interview answer
"I report throughput, error rate and latency percentiles together, at a stated load. Latency is skewed, so the mean hides the tail; p50 shows the typical case and p99 or p99.9 the unlucky users, which matter more with fan-out because a request touching 100 backends hits some backend's p99 about 63% of the time. I measure with histograms and open-model load generators to avoid coordinated omission, and I check that fast responses aren't just fast failures."

---

## 5. Workload modeling, realistic traffic, and bottleneck diagnosis

**In one sentence:** build load tests from **real traffic patterns** — the **mix** of endpoints, **arrival rates** and peaks, **data sizes and key distributions** (hot keys!), think times and cache hit rates — then find the **bottleneck** by watching **which resource saturates first** as load rises.

### In plain words
Testing a supermarket by sending 1,000 people who all buy only milk at 9:00 tells you little. Real shoppers buy different things, come in waves, and crowd the bread aisle on Friday. Model *that*, then watch which checkout line overflows first.

### How it works
**Workload model checklist**
| Aspect | Get it from | Example |
|---|---|---|
| **Endpoint mix** | access logs, APM | 70% browse, 20% search, 8% add-to-cart, 2% checkout |
| **Arrival pattern** | metrics over weeks | daily peak 3× average; Black Friday 10×; bursty (Poisson or worse) |
| **Data** | production stats (anonymized) | catalogue of 2M items, **Zipf**-distributed popularity, realistic payload sizes |
| **User behaviour** | session analytics | think time, session length, logged-in vs. anonymous |
| **State** | production snapshot | DB size, cache warm vs. cold, index bloat |
| **Dependencies** | service map | third parties virtualized with realistic latency ([virtualization](./Backend-and-Distributed-System-Testing.md#7-testcontainers-ephemeral-environments-and-service-virtualization)) |

- Uniform random keys give unrealistically **low** cache hit rates *and* hide **hot-key** contention; real traffic is skewed.
- **Replay** sampled production traffic (GoReplay, Envoy tap, Kafka topic copies) for the most realistic tests — scrub personal data.

**Bottleneck diagnosis (the method)**
1. Step the load up; at each step record RED for the service and **USE for every resource** (CPU, memory, disk, network, **thread pools, connection pools, locks, queues**, downstream services).
2. The **first resource to saturate** is the bottleneck; latency "knees" right there.
3. Fix or scale it, and repeat — the bottleneck **moves** (CPU → DB connections → DB CPU → a lock …).
4. **Amdahl/USL thinking:** if doubling instances doesn't double throughput, a shared resource (DB, lock, coordinator) limits you.

#### Modern C++ example — a weighted, Zipf-skewed workload and a step test that finds the first saturated resource
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <random>
#include <string>
#include <vector>

int main() {
    std::mt19937 rng(3);
    // 1) Endpoint mix from access logs.
    std::vector<std::string> endpoints{"browse", "search", "add_to_cart", "checkout"};
    std::discrete_distribution<int> mix({70, 20, 8, 2});
    // 2) Zipf-like popularity over 10,000 products: a few items get most traffic.
    const int N = 10000;
    std::vector<double> w(N);
    for (int k = 0; k < N; ++k) w[k] = 1.0 / (k + 1);
    std::discrete_distribution<int> product(w.begin(), w.end());
    std::map<std::string, int> count;
    int top10_hits = 0;
    const int requests = 100000;
    for (int i = 0; i < requests; ++i) { ++count[endpoints[mix(rng)]]; top10_hits += product(rng) < 10; }
    std::cout << "mix:";
    for (auto& e : endpoints) std::cout << ' ' << e << '=' << count[e] * 100 / requests << '%';
    std::cout << "\ntop 10 of 10,000 products receive " << top10_hits * 100 / requests << "% of product views (uniform would be 0.1%)\n";

    // 3) Step test: per-request cost on each resource -> utilization at each load step.
    struct Resource { std::string name; double capacity, cost_per_req; };
    std::vector<Resource> res{{"app-CPU", 8000, 4.0},          // 8 cores = 8000 CPU-ms per second; 4 ms per request
                              {"DB-conns", 20, 0.012},         // 20 connections; each request holds one for 12 ms
                              {"DB-CPU", 4000, 1.5},
                              {"network", 125, 0.03}};         // 125 MB/s; 30 KB per request
    std::cout << std::fixed << std::setprecision(0);
    for (double rps : {500.0, 1000.0, 1500.0, 2000.0}) {
        std::cout << "load " << std::setw(4) << rps << " req/s:";
        std::string worst; double worst_u = 0;
        for (auto& r : res) {
            double u = rps * r.cost_per_req / r.capacity * 100;
            std::cout << "  " << r.name << ' ' << std::setw(3) << u << '%';
            if (u > worst_u) { worst_u = u; worst = r.name; }
        }
        std::cout << (worst_u >= 90 ? "  <- bottleneck: " + worst : "") << '\n';
    }
}
```

**Output:**
```text
mix: browse=69% search=20% add_to_cart=7% checkout=2%
top 10 of 10,000 products receive 29% of product views (uniform would be 0.1%)
load  500 req/s:  app-CPU  25%  DB-conns  30%  DB-CPU  19%  network  12%
load 1000 req/s:  app-CPU  50%  DB-conns  60%  DB-CPU  38%  network  24%
load 1500 req/s:  app-CPU  75%  DB-conns  90%  DB-CPU  56%  network  36%  <- bottleneck: DB-conns
load 2000 req/s:  app-CPU 100%  DB-conns 120%  DB-CPU  75%  network  48%  <- bottleneck: DB-conns
```

The **DB connection pool** saturates first (90% at 1,500 req/s, while app CPU is at 75%): adding app servers wouldn't help; a bigger pool (DB CPU still has room) or shorter transactions would.

### Interview answer
"I model workloads from production data: the endpoint mix, arrival rates and peaks, realistic data sizes and a skewed key distribution — real traffic has hot keys, and uniform keys give misleading cache and contention results — or I replay sampled, scrubbed production traffic. Then I step the load up while recording RED for the service and USE for every resource, including pools, locks and queues; the first resource to saturate is the bottleneck. After fixing it I repeat, because the bottleneck moves."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Baseline | max throughput within SLO on a fixed setup + first bottleneck; plan at 60–70% utilization + N+1 |
| Regression tests | medians of repeated runs, warm-up, dedicated runners, tolerance gate (5–10%) |
| Load / stress / spike / soak | expected peak / past capacity / sudden jump / hours–days for leaks |
| Open model | arrival-rate load (k6 arrival-rate, wrk2) avoids coordinated omission |
| CPU profiling | perf + flame graphs; `-g -fno-omit-frame-pointer`; sampling is production-safe |
| Memory | heaptrack, massif, ASan/LSan; allocation rate and peak heap |
| DB | EXPLAIN ANALYZE, pg_stat_statements, slow-query log; N+1 → join / IN batch |
| Latency | p50 / p95 / p99 / p99.9 / max; never just the mean |
| Tail at scale | P(hit a p99) = 1 − 0.99^fanout → 63% at 100 calls |
| Workload model | endpoint mix, arrival peaks, Zipf keys, payload sizes, warm/cold caches; replay scrubbed traffic |
| Bottleneck | step load; first saturated resource (incl. pools, locks); fix → repeat (it moves) |
