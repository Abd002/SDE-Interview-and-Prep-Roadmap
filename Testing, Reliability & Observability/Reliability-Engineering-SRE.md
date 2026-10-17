# Reliability Engineering (SRE) — Availability, SLOs, Resilience Patterns, Chaos and Disaster Recovery

> **What you'll learn:** how to **calculate availability** across dependency chains, monitor **capacity and saturation**, run **chaos experiments and game days**, practise **disaster recovery** and verify **backups by restoring them**, design for **fault tolerance** (redundancy, graceful degradation, bulkheads), use **retries with backoff and jitter** and **circuit breakers** safely, define **SLIs, SLOs, SLAs and error budgets**, and protect services with **timeouts, cancellation, rate limiting and backpressure**. Each part has a runnable C++ example.
>
> **Prerequisites:** [Distributed Systems → Fault tolerance](../System%20Design/Distributed-Systems.md#5-fault-tolerance-and-resilience), [Microservices → Circuit Breaker](../System%20Design/Microservices-Explained.md#3-circuit-breaker-pattern), [Logging, Metrics, and Tracing](./Logging-Metrics-and-Tracing.md).

## Table of Contents
1. [Availability math and the implications of dependency chains](#1-availability-math-and-the-implications-of-dependency-chains)
2. [Capacity and saturation monitoring](#2-capacity-and-saturation-monitoring)
3. [Chaos engineering and game-day exercises](#3-chaos-engineering-and-game-day-exercises)
4. [Disaster recovery drills, backups, and restore verification](#4-disaster-recovery-drills-backups-and-restore-verification)
5. [Fault tolerance, redundancy, graceful degradation, and bulkheads](#5-fault-tolerance-redundancy-graceful-degradation-and-bulkheads)
6. [Retry policies, exponential backoff, jitter, and circuit breakers](#6-retry-policies-exponential-backoff-jitter-and-circuit-breakers)
7. [SLIs, SLOs, SLAs, and error budgets](#7-slis-slos-slas-and-error-budgets)
8. [Timeouts, cancellation, rate limiting, and backpressure](#8-timeouts-cancellation-rate-limiting-and-backpressure)
9. [Cheat sheet](#cheat-sheet)

---

## 1. Availability math and the implications of dependency chains

**In one sentence:** availability is the fraction of time (or requests) a service works; components **in series** multiply their availabilities (so the chain is **worse** than its weakest link), while **redundant** components in parallel fail only if **all** fail (so the system is **better** than any one).

### In plain words
A string of old Christmas lights in series: if any bulb dies, the whole string goes dark — 50 good bulbs make the string *less* reliable than one bulb. Two lamps in a room: you're in the dark only if **both** fail.

### How it works
| "Nines" | Availability | Downtime per year | per 30 days |
|---|---|---|---|
| two nines | 99% | 3.65 days | 7.2 h |
| three nines | 99.9% | 8.77 h | 43.2 min |
| four nines | 99.99% | 52.6 min | 4.3 min |
| five nines | 99.999% | 5.3 min | 26 s |

- **Series (hard dependencies):** A = A₁ × A₂ × … × Aₙ. Ten dependencies at 99.9% → 99.0%. You can't promise more than your hard dependencies give you.
- **Parallel (N redundant replicas, independent failures):** A = 1 − (1 − Aᵢ)ᴺ. Two 99% replicas → 99.99%.
- **Caveats:** failures are often **correlated** (same zone, same bad deploy, same config) — redundancy only helps if failures are independent; failover itself can fail.
- **MTBF / MTTR:** A = MTBF / (MTBF + MTTR). Reducing **time to recover** is often cheaper than preventing failures.
- **Implications:** remove hard dependencies from the critical path (cache, async, fallbacks), make optional calls **soft** (degrade instead of fail), and add timeouts so a slow dependency doesn't become your outage.

#### Modern C++ example — series vs. parallel availability and downtime budgets
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

double series(const std::vector<double>& a) { double r = 1; for (double x : a) r *= x; return r; }
double parallel(double a, int n) { return 1 - std::pow(1 - a, n); }
double downtime_min_per_month(double a) { return (1 - a) * 30 * 24 * 60; }

int main() {
    std::cout << std::fixed;
    std::vector<double> chain(10, 0.999);                         // 10 hard dependencies at three nines
    double s = series(chain);
    std::cout << std::setprecision(3) << "10 deps in series at 99.9%: " << s * 100 << "% (" << std::setprecision(0)
              << downtime_min_per_month(s) << " min down / month)\n";
    double p = parallel(0.99, 2);
    std::cout << std::setprecision(3) << "2 replicas at 99% in parallel: " << p * 100 << "% (" << std::setprecision(1)
              << downtime_min_per_month(p) << " min down / month)\n";
    // A realistic stack: load balancer -> 3 app replicas -> DB primary with a standby
    double lb = 0.9999, app = parallel(0.995, 3), db = parallel(0.999, 2);
    double total = lb * app * db;
    std::cout << std::setprecision(4) << "LB x 3 apps x (DB+standby): " << total * 100 << "% (" << std::setprecision(1)
              << downtime_min_per_month(total) << " min down / month)\n";
    double mtbf_h = 720, mttr_h = 2;
    std::cout << std::setprecision(3) << "MTBF 720 h, MTTR 2 h -> " << 100 * mtbf_h / (mtbf_h + mttr_h)
              << "%; halving MTTR -> " << 100 * mtbf_h / (mtbf_h + mttr_h / 2) << "%\n";
}
```

**Output:**
```text
10 deps in series at 99.9%: 99.004% (430 min down / month)
2 replicas at 99% in parallel: 99.990% (4.3 min down / month)
LB x 3 apps x (DB+standby): 99.9899% (4.4 min down / month)
MTBF 720 h, MTTR 2 h -> 99.723%; halving MTTR -> 99.861%
```

### Interview answer
"Hard dependencies in series multiply, so ten three-nines dependencies give about two nines — my service can't be more available than its critical path. Independent replicas in parallel fail only together, so two 99% replicas give about 99.99%, but only if failures aren't correlated by zone, deploy or config. So I keep the critical path short, make optional dependencies soft with timeouts and fallbacks, add redundancy across failure domains, and invest in fast recovery, since availability is MTBF over MTBF plus MTTR."

---

## 2. Capacity and saturation monitoring

**In one sentence:** track **how full** each resource is (utilization) and **how much work is waiting** (saturation) — CPU, memory, disk, network, connection and thread pools, queues, quotas — and **forecast** when you'll run out so you add capacity **before** users feel it.

### In plain words
A water tank needs two gauges: how full it is now, and how fast it's filling. If it's 70% full and rising 5% a day, you know when to act — before it overflows.

### How it works
- **Saturation signals** (earliest warnings): run-queue length / load per core, CPU throttling in containers, memory pressure (PSI), swap, disk queue depth, connection-pool wait time, thread-pool queue length, message-queue lag, **consumer lag** in Kafka.
- **Hard limits** that cause sudden outages: file descriptors, ephemeral ports, disk space, inode count, DB max connections, cloud **quotas** (IP addresses, instance limits), license limits, certificate expiry.
- **Targets:** run at **60–70%** of capacity in steady state, so there's headroom for spikes and for losing an instance or zone (N+1, N+2).
- **Forecasting:** linear (or seasonal) trend over weeks → "disk full in 18 days" alert as a **ticket**, not a page. Prometheus `predict_linear(node_filesystem_avail_bytes[6h], 4*3600) < 0`.
- **Load tests** confirm the capacity numbers ([baselines](./Performance-and-Scalability-Testing.md#1-capacity-baselines-and-regression-performance-testing)); **autoscaling** reacts to load, but needs limits and warm-up time.

#### Modern C++ example — forecasting time-to-full with a linear trend, plus headroom for losing a zone
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

// Least-squares slope of y over x.
double slope(const std::vector<double>& x, const std::vector<double>& y) {
    double n = static_cast<double>(x.size()), sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (std::size_t i = 0; i < x.size(); ++i) { sx += x[i]; sy += y[i]; sxy += x[i] * y[i]; sxx += x[i] * x[i]; }
    return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

int main() {
    std::vector<double> day{0, 1, 2, 3, 4, 5, 6}, disk_used_pct{61, 62.5, 63.4, 65.1, 66.0, 67.6, 69.0};
    double per_day = slope(day, disk_used_pct);
    double days_left = (90 - disk_used_pct.back()) / per_day;          // act before 90%
    std::cout << std::fixed << std::setprecision(1) << "disk grows " << per_day << "% / day -> reaches 90% in "
              << days_left << " days -> open a ticket now\n";

    // 3 zones, peak 4,200 req/s, each instance handles 300 req/s at the SLO, target utilization 70%.
    const double peak = 4200, per_instance = 300, target = 0.70;
    int zones = 3;
    int needed = static_cast<int>(std::ceil(peak / (per_instance * target)));
    int per_zone = static_cast<int>(std::ceil(needed / double(zones - 1)));   // survive losing one zone
    std::cout << "instances needed at 70%: " << needed << "; to survive a zone loss: " << per_zone << " per zone x "
              << zones << " = " << per_zone * zones << '\n';
}
```

**Output:**
```text
disk grows 1.3% / day -> reaches 90% in 16.0 days -> open a ticket now
instances needed at 70%: 20; to survive a zone loss: 10 per zone x 3 = 30
```

### Interview answer
"I monitor utilization and especially saturation — run queues, pool wait times, queue lag, memory pressure — plus hard limits like disk, file descriptors, connection limits and cloud quotas. I keep steady-state utilization around 60–70% and size for losing a zone, use trend forecasts like predict_linear to open tickets weeks before a limit, and confirm capacity numbers with load tests rather than guesses."

---

## 3. Chaos engineering and game-day exercises

**In one sentence:** **chaos engineering** runs **controlled experiments** that inject real failures (kill instances, add latency, cut a dependency) to verify a **hypothesis about steady state**, and a **game day** is a scheduled team exercise that rehearses an incident end to end, including people and runbooks.

### In plain words
A fire drill. You don't wait for a real fire to learn the exits are blocked. You pull the alarm on a calm Tuesday, watch what happens, and fix what went wrong.

### How it works
**The experiment loop (Principles of Chaos Engineering, Netflix)**
1. Define **steady state** with metrics (e.g. checkout success ≥ 99.5%, p99 < 400 ms).
2. **Hypothesis:** "If one payment instance dies, steady state holds."
3. **Inject** a realistic fault in a **small blast radius** (one instance, 1% of traffic, staging first) with a **stop button** (abort if SLO burns).
4. **Observe** and compare to a control group.
5. **Learn and fix**, then automate the experiment to run regularly.

**Typical faults:** kill a process/pod/VM/zone, CPU/memory/disk pressure, network latency, packet loss, partition, DNS failure, dependency returning errors, clock skew, expired certificates.

**Tools:** Chaos Monkey / Simian Army (Netflix), **Gremlin**, **Chaos Mesh** and **LitmusChaos** (Kubernetes), AWS Fault Injection Service, Azure Chaos Studio, Toxiproxy, `tc netem`.

**Game day:** pick a scenario ("primary DB fails over at peak"), assign roles (incident commander, operators, observers), run it live, time detection and recovery, test **runbooks, alerts, dashboards and communication**, then write a short report with action items.

#### Modern C++ example — a chaos experiment with a steady-state hypothesis and an abort condition
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <random>
#include <vector>

struct Cluster {
    std::vector<bool> up{true, true, true};                     // 3 payment instances behind a load balancer
    bool retry_on_other_instance = true;                        // the resilience feature under test
    bool handle(std::mt19937& rng) {
        std::uniform_int_distribution<int> pick(0, 2);
        int i = pick(rng);
        if (up[i]) return true;
        if (!retry_on_other_instance) return false;
        for (int j = 0; j < 3; ++j) if (up[j]) return true;      // LB retries a healthy instance
        return false;
    }
};

double success_rate(Cluster& c, std::mt19937& rng, int n) { int ok = 0; for (int i = 0; i < n; ++i) ok += c.handle(rng); return 100.0 * ok / n; }

void experiment(bool retries, std::mt19937& rng) {
    Cluster c; c.retry_on_other_instance = retries;
    const double steady_state = 99.5;                           // hypothesis: success stays >= 99.5%
    double before = success_rate(c, rng, 10000);
    c.up[1] = false;                                            // inject: kill instance 1
    double during = success_rate(c, rng, 10000);
    bool abort = during < 95.0;                                 // stop button: too much user impact
    c.up[1] = true;                                             // always roll back the fault
    std::cout << std::fixed << std::setprecision(1) << (retries ? "with LB retries:    " : "without LB retries: ")
              << "before " << before << "%, during " << during << "% -> "
              << (abort ? "ABORTED, hypothesis false: fix before next run" : during >= steady_state ? "hypothesis holds" : "hypothesis false") << '\n';
}

int main() {
    std::mt19937 rng(11);
    experiment(false, rng);
    experiment(true, rng);
}
```

**Output:**
```text
without LB retries: before 100.0%, during 66.7% -> ABORTED, hypothesis false: fix before next run
with LB retries:    before 100.0%, during 100.0% -> hypothesis holds
```

### Interview answer
"Chaos engineering is running controlled experiments: define steady state with SLO metrics, state a hypothesis like 'losing one instance doesn't hurt checkout', inject a realistic fault with a small blast radius and an abort condition, observe, then fix what we learned and automate the experiment. Game days rehearse whole scenarios with the team — alerts, runbooks, roles and communication — so the first time we see a failure isn't during a real incident."

---

## 4. Disaster recovery drills, backups, and restore verification

**In one sentence:** **disaster recovery (DR)** is your plan to restore service after losing a database, region or account, defined by **RPO** (how much data you can lose) and **RTO** (how long you can be down), and **a backup only counts once you've restored it successfully** — so you **drill** restores regularly.

### In plain words
Having a spare key is useless if it's for the wrong lock. Backups are the same: until you've actually opened the door with them, you don't know they work.

### How it works
- **RPO (recovery point objective):** maximum acceptable data loss (e.g. 5 minutes) → drives backup / replication frequency.
- **RTO (recovery time objective):** maximum acceptable downtime (e.g. 1 hour) → drives the DR strategy.

| Strategy | RTO / RPO | Cost |
|---|---|---|
| **Backup & restore** | hours / hours | lowest |
| **Pilot light** (data replicated, minimal infra off) | tens of minutes | low |
| **Warm standby** (scaled-down copy running) | minutes | medium |
| **Multi-site active-active** | ~0 / ~0 | highest |

**Backup rules**
- **3-2-1:** 3 copies, 2 different media/services, 1 off-site — plus **immutable / air-gapped** copies against ransomware and accidental deletion (object lock, separate account).
- Full + incremental + **point-in-time recovery** (database WAL/binlog archiving).
- **Encrypt**, and keep the **keys** recoverable (a backup encrypted with a lost key is gone).
- **Verify automatically:** restore into a scratch environment on a schedule, run integrity checks (row counts, checksums, app smoke tests), and **measure the restore time** against RTO.
- **DR drills:** fail over a region or rebuild from backups at least yearly (quarterly for critical systems); include DNS, secrets, IAM, and the runbook.

#### Modern C++ example — backup with checksums, an automated restore test, and RPO/RTO checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Table = std::map<int, std::string>;
std::uint64_t checksum(const Table& t) {                    // order-independent fingerprint of the data
    std::uint64_t h = 1469598103934665603ull;
    for (auto& [k, v] : t) { for (char c : std::to_string(k) + "=" + v) { h ^= static_cast<unsigned char>(c); h *= 1099511628211ull; } }
    return h;
}

struct Backup { Table snapshot; std::uint64_t sum; int taken_at_min; bool corrupted = false; };

Backup take_backup(const Table& live, int now) { return {live, checksum(live), now}; }

bool restore_and_verify(const Backup& b, int restore_minutes, int rto_minutes, std::string& report) {
    Table restored = b.snapshot;
    if (b.corrupted) restored.erase(restored.begin());       // simulate a silently broken backup
    bool data_ok = checksum(restored) == b.sum && !restored.empty();
    bool rto_ok = restore_minutes <= rto_minutes;
    report = std::string(data_ok ? "checksum ok" : "CHECKSUM MISMATCH") + ", restore took " + std::to_string(restore_minutes) +
             " min (RTO " + std::to_string(rto_minutes) + ") " + (rto_ok ? "ok" : "TOO SLOW");
    return data_ok && rto_ok;
}

int main() {
    Table orders{{1, "paid"}, {2, "shipped"}, {3, "paid"}};
    const int rpo_min = 15, rto_min = 60;
    std::vector<Backup> backups{take_backup(orders, 0)};
    orders[4] = "paid";
    backups.push_back(take_backup(orders, 15));
    backups.back().corrupted = true;                         // bit rot / bad upload nobody noticed

    int now = 20;
    std::cout << "data written since last backup: " << now - backups.back().taken_at_min << " min (RPO " << rpo_min << ") -> "
              << (now - backups.back().taken_at_min <= rpo_min ? "within RPO" : "RPO breached") << '\n';
    for (std::size_t i = 0; i < backups.size(); ++i) {
        std::string report;
        bool ok = restore_and_verify(backups[i], 35 + static_cast<int>(i) * 40, rto_min, report);
        std::cout << "restore test of backup #" << i + 1 << ": " << report << " -> " << (ok ? "PASS" : "FAIL, alert the owners") << '\n';
    }
}
```

**Output:**
```text
data written since last backup: 5 min (RPO 15) -> within RPO
restore test of backup #1: checksum ok, restore took 35 min (RTO 60) ok -> PASS
restore test of backup #2: CHECKSUM MISMATCH, restore took 75 min (RTO 60) TOO SLOW -> FAIL, alert the owners
```

### Interview answer
"I start from RPO and RTO — how much data we can lose and how long we can be down — which choose between backup-and-restore, pilot light, warm standby and active-active. Backups follow 3-2-1 with an immutable off-site copy and recoverable encryption keys, plus point-in-time recovery for databases. Most importantly, restores are tested automatically on a schedule with integrity checks and timed against the RTO, and we run real failover drills, because an untested backup is just a hope."

---

## 5. Fault tolerance, redundancy, graceful degradation, and bulkheads

**In one sentence:** **fault tolerance** keeps the service working when parts fail, through **redundancy** (spare copies across failure domains), **graceful degradation** (drop non-essential features instead of failing completely) and **bulkheads** (separate resource pools so one failing part can't sink the rest).

### In plain words
A ship is split into watertight compartments (bulkheads): a hole floods one compartment, not the whole ship. If the restaurant's dessert machine breaks, it still serves dinner (graceful degradation). Two engines on a plane (redundancy).

### How it works
- **Redundancy:** N+1 instances, replicas across **zones/regions**, no single points of failure (load balancers, DNS, databases, a single person with the password). Health checks + automatic failover.
- **Graceful degradation:** classify features as **critical** (checkout) and **optional** (recommendations, reviews, personalization). On dependency failure: serve **cached/stale** data, defaults, a simpler version, or hide the feature — never fail the whole page for an optional widget.
- **Load shedding:** when overloaded, reject low-priority requests early (HTTP 503/429) to protect high-priority ones.
- **Bulkheads:** separate **thread pools / connection pools / queues / instances** per dependency or tenant, so a slow dependency exhausts only its own pool. Also: per-tenant quotas, cell-based architecture (shard customers into independent cells).
- **Static stability:** the system keeps working with its last known good state even if the control plane (config service, autoscaler) is down.

#### Modern C++ example — a product page with bulkheads per dependency and graceful degradation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>

class Bulkhead {                                        // a fixed number of concurrent slots per dependency
public:
    explicit Bulkhead(int slots) : free_(slots) {}
    bool try_acquire() { if (free_ == 0) return false; --free_; return true; }
    void release() { ++free_; }
private:
    int free_;
};

struct Dependencies {
    bool recommendations_slow = false;                  // a slow call holds its slot (simulated)
    std::optional<std::string> price(int) { return "499 EGP"; }
    std::optional<std::string> recommendations(int) { if (recommendations_slow) return std::nullopt; return "similar: mouse, pad"; }
};

class ProductPage {
public:
    explicit ProductPage(Dependencies& d) : deps_(d) {}
    std::string render(int id) {
        std::string page = "product " + std::to_string(id);
        // Critical: price. Its own bulkhead, so a reco outage can't take its slots.
        if (!price_pool_.try_acquire()) return page + " | 503 busy (shed load)";
        auto p = deps_.price(id); price_pool_.release();
        if (!p) return page + " | error: price unavailable";
        page += " | price " + *p;
        // Optional: recommendations. Degrade to cached or hidden.
        if (reco_pool_.try_acquire()) {
            auto r = deps_.recommendations(id);
            if (r) { cache_[id] = *r; reco_pool_.release(); page += " | " + *r; return page; }
            // slow call: in real code the slot stays held until a timeout fires
        }
        page += cache_.count(id) ? " | " + cache_[id] + " (cached)" : " | (recommendations hidden)";
        return page;
    }
private:
    Dependencies& deps_;
    Bulkhead price_pool_{10}, reco_pool_{2};
    std::map<int, std::string> cache_;
};

int main() {
    Dependencies deps;
    ProductPage page(deps);
    std::cout << page.render(7) << '\n';
    deps.recommendations_slow = true;                   // recommendations service degrades
    for (int i = 0; i < 3; ++i) std::cout << page.render(7) << '\n';
    std::cout << page.render(8) << '\n';                // no cache for this product
}
```

**Output:**
```text
product 7 | price 499 EGP | similar: mouse, pad
product 7 | price 499 EGP | similar: mouse, pad (cached)
product 7 | price 499 EGP | similar: mouse, pad (cached)
product 7 | price 499 EGP | similar: mouse, pad (cached)
product 8 | price 499 EGP | (recommendations hidden)
```

The recommendation slots are exhausted by slow calls, but the price — the critical part — keeps its own pool, and the page never fails.

### Interview answer
"I design for failure: redundancy across failure domains with health checks and automatic failover, so no single instance, zone or person is a single point of failure. I classify features as critical or optional, and optional ones degrade to cached data, defaults or nothing. Bulkheads — separate pools, queues or cells per dependency or tenant — keep one slow dependency from exhausting everything, and under overload I shed low-priority traffic early to protect the critical path."

---

## 6. Retry policies, exponential backoff, jitter, and circuit breakers

**In one sentence:** **retry** only **transient** failures of **idempotent** operations, wait **exponentially longer** between attempts with **random jitter** so clients don't retry in sync, cap attempts and total time (a **retry budget**), and use a **circuit breaker** to **stop calling** a dependency that's clearly down.

### In plain words
If a shop's phone line is busy, you call back in a minute, then in 5 minutes, then in 15 — not 100 times a second. And if you hear "this number is disconnected", you stop calling altogether for a while (circuit breaker).

### How it works
**Retries**
- Retry **transient** errors only (timeouts, 503, connection reset, throttling 429 with `Retry-After`); never 400/401/404 or validation errors.
- Only **idempotent** operations, or with an **idempotency key** ([why](../Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#2-idempotent-operations-and-safe-retries-in-low-level-apis)).
- **Exponential backoff:** `delay = base × 2^attempt`, capped (e.g. max 10 s).
- **Jitter** (AWS Architecture Blog, "Exponential Backoff And Jitter"): **full jitter** `delay = random(0, base × 2^attempt)` spreads retries out and avoids **thundering herds** after an outage.
- **Retry at one layer only** — retries at every layer multiply (3 layers × 3 retries = 27 calls). Use a **retry budget** (e.g. retries ≤ 10% of requests).

**Circuit breaker** (Michael Nygard, *Release It!*)
| State | Behaviour | Transition |
|---|---|---|
| **Closed** | calls pass; count failures | failure rate over threshold → **Open** |
| **Open** | fail fast (fallback), don't call | after a cool-down → **Half-open** |
| **Half-open** | let a few trial calls through | success → **Closed**; failure → **Open** |

Libraries: Resilience4j (Java), Polly (.NET), Envoy/Istio outlier detection, gRPC retry policies, Hystrix (retired).

#### Modern C++ example — backoff with full jitter, and a circuit breaker opening and recovering
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <random>
#include <string>
#include <vector>

double backoff_ms(int attempt, double base, double cap, std::mt19937& rng) {           // full jitter
    double ceiling = std::min(cap, base * (1 << attempt));
    return std::uniform_real_distribution<double>(0, ceiling)(rng);
}

class CircuitBreaker {
public:
    enum class State { Closed, Open, HalfOpen };
    CircuitBreaker(int threshold, int cooldown) : threshold_(threshold), cooldown_(cooldown) {}
    bool allow(int now) {
        if (state_ == State::Open && now - opened_at_ >= cooldown_) state_ = State::HalfOpen;
        return state_ != State::Open;
    }
    void record(bool ok, int now) {
        if (ok) { failures_ = 0; state_ = State::Closed; return; }
        if (state_ == State::HalfOpen || ++failures_ >= threshold_) { state_ = State::Open; opened_at_ = now; }
    }
    const char* state() const { return state_ == State::Closed ? "closed" : state_ == State::Open ? "OPEN" : "half-open"; }
private:
    int threshold_, cooldown_, failures_ = 0, opened_at_ = 0;
    State state_ = State::Closed;
};

int main() {
    std::mt19937 rng(5);
    std::cout << "retry delays for 1000 clients after an outage (attempt 3, base 100 ms):\n";
    std::vector<double> d;
    for (int c = 0; c < 1000; ++c) d.push_back(backoff_ms(3, 100, 10'000, rng));
    std::sort(d.begin(), d.end());
    std::cout << "  no jitter: all 1000 retry at exactly 800 ms (thundering herd)\n"
              << "  full jitter: spread from " << static_cast<int>(d.front()) << " to " << static_cast<int>(d.back()) << " ms\n";

    CircuitBreaker cb(3, 10);
    auto dependency_up = [](int t) { return t < 3 || t >= 25; };     // down between t=3 and t=24
    std::string timeline;
    for (int t = 0; t < 30; ++t) {
        if (!cb.allow(t)) { timeline += 'f'; continue; }            // fail fast, no call made
        bool ok = dependency_up(t);
        cb.record(ok, t);
        timeline += ok ? '.' : 'x';
    }
    std::cout << "calls over time (. ok, x failed call, f failed fast): " << timeline << '\n'
              << "final state: " << cb.state() << '\n';
}
```

**Output:**
```text
retry delays for 1000 clients after an outage (attempt 3, base 100 ms):
  no jitter: all 1000 retry at exactly 800 ms (thundering herd)
  full jitter: spread from 2 to 797 ms
calls over time (. ok, x failed call, f failed fast): ...xxxfffffffffxfffffffff.....
final state: closed
```

While the dependency was down (t = 3…24), only 4 real calls were made instead of 22 — the rest failed fast — and the breaker closed again on the first successful trial.

### Interview answer
"I retry only transient failures of idempotent operations, with capped exponential backoff and full jitter so clients don't retry in lockstep, a small attempt limit, and retries at only one layer within a retry budget. A circuit breaker tracks failures per dependency: once they pass a threshold it opens and fails fast with a fallback, after a cool-down it lets trial calls through in half-open, and it closes on success. Together they stop a struggling dependency from being hammered into a longer outage."

---

## 7. SLIs, SLOs, SLAs, and error budgets

**In one sentence:** an **SLI** is a measured indicator of user experience (e.g. % of successful requests under 300 ms), an **SLO** is the internal **target** for it (99.9% over 30 days), an **SLA** is the **contract** with customers and penalties (usually looser), and the **error budget** (1 − SLO) is how much unreliability you're **allowed to spend** on releases and experiments.

### In plain words
A pizza place measures delivery time (SLI), aims for 99% within 30 minutes (SLO), and promises customers "free pizza if it's over 45 minutes" (SLA). The 1% of late deliveries they can afford is the error budget — if it's used up, they stop trying new routes and focus on punctuality.

### How it works
- **Good SLIs** are ratios of good events to valid events, measured as close to the user as possible (load balancer or client), e.g.:
  - availability: `successful requests / valid requests`;
  - latency: `requests faster than 300 ms / valid requests`;
  - freshness, correctness, durability for data pipelines.
- **SLO:** target + window (rolling 28/30 days). Not 100% — that's impossible and blocks all change. Set it from what users need and what the system can achieve.
- **SLA:** external, legal, with credits; keep SLO **stricter** than SLA so you notice before you owe money.
- **Error budget policy:** while budget remains, ship freely; when it's exhausted, **freeze risky releases**, prioritize reliability work, require extra review. This turns reliability vs. speed into a data-driven agreement between product and engineering.
- Alert on budget **burn rate** ([burn-rate alerts](./Logging-Metrics-and-Tracing.md#1-alert-quality-actionable-alerts-thresholds-burn-rate-alerts)).

#### Modern C++ example — computing SLIs, remaining error budget, and the release decision
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>

int main() {
    // 30-day window for the checkout API.
    const long valid = 50'000'000, failed = 32'000, slower_than_300ms = 61'000;
    const double slo_availability = 0.999, slo_latency = 0.998, sla = 0.995;

    double sli_avail = 1.0 - double(failed) / valid;
    double sli_lat = 1.0 - double(slower_than_300ms) / valid;
    double budget_errors = (1 - slo_availability) * valid;              // allowed failed requests
    double budget_left = 1 - failed / budget_errors;
    double lat_budget_left = 1 - slower_than_300ms / ((1 - slo_latency) * valid);

    std::cout << std::fixed << std::setprecision(3)
              << "availability SLI " << sli_avail * 100 << "% (SLO " << slo_availability * 100 << "%, SLA " << sla * 100 << "%)\n"
              << "latency SLI      " << sli_lat * 100 << "% under 300 ms (SLO " << slo_latency * 100 << "%)\n"
              << std::setprecision(0)
              << "availability budget: " << budget_errors << " failures allowed, " << failed << " used, " << budget_left * 100 << "% left\n"
              << "latency budget left: " << lat_budget_left * 100 << "%\n";
    bool freeze = budget_left <= 0 || lat_budget_left <= 0;
    std::cout << "release policy: " << (freeze ? "FREEZE risky releases, prioritize reliability" : "ship normally") << '\n';
}
```

**Output:**
```text
availability SLI 99.936% (SLO 99.900%, SLA 99.500%)
latency SLI      99.878% under 300 ms (SLO 99.800%)
availability budget: 50000 failures allowed, 32000 used, 36% left
latency budget left: 39%
release policy: ship normally
```

### Interview answer
"An SLI is a ratio of good events to valid events measured close to the user — successful requests, or requests under 300 ms. The SLO is our internal target over a rolling window, like 99.9% over 30 days, and the SLA is the looser external contract with penalties. One minus the SLO is the error budget: while there's budget we ship freely, and when it's burned, the agreed policy freezes risky releases and shifts the team to reliability work. I alert on burn rate rather than raw errors."

---

## 8. Timeouts, cancellation, rate limiting, and backpressure

**In one sentence:** every remote call needs a **timeout** (ideally a **deadline** propagated down the call chain), work for a request that's no longer wanted must be **cancelled**, **rate limiting** caps how much each client can send, and **backpressure** makes overloaded consumers **slow producers down** instead of letting queues grow without bound.

### In plain words
- Timeout: you won't wait more than 10 minutes for a bus; then you take a taxi.
- Cancellation: if the customer leaves the shop, the kitchen stops cooking their order.
- Rate limiting: one free sample per person.
- Backpressure: the conveyor belt slows down when the packers can't keep up, instead of boxes piling onto the floor.

### How it works
**Timeouts and deadlines**
- No infinite waits: connect, read and total timeouts on every client (HTTP, DB, gRPC).
- Set from the dependency's latency (e.g. a bit above its p99.9) and the caller's own budget.
- **Deadline propagation:** the edge sets "this request must finish by T"; each hop passes the **remaining** time (gRPC deadlines do this) and skips work that can't finish in time.

**Cancellation**
- When the client disconnects or the deadline passes, cancel downstream calls and stop computation (`std::stop_token`, Go `context`, `CancellationToken`, gRPC cancellation) — saves capacity during overload, when it matters most.

**Rate limiting** — per client/key/tenant; token bucket or sliding window ([algorithms](../Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#9-design-a-rate-limiter-strategy-interfaces-pluggable-algorithms)); respond **429 + `Retry-After`**.

**Backpressure**
- **Bounded** queues everywhere; when full: block the producer, reject (503/429), or drop the lowest-priority work — **never** an unbounded queue (it just turns overload into memory exhaustion and huge latency).
- Pull-based consumption (Kafka consumers, Reactive Streams `request(n)`), TCP flow control, HTTP/2 flow-control windows.
- **Adaptive concurrency limits** (Netflix concurrency-limits, Envoy adaptive concurrency) adjust in-flight limits from observed latency.

#### Modern C++ example — deadline propagation with cancellation, and a bounded queue applying backpressure
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <condition_variable>
#include <iostream>
#include <mutex>
#include <optional>
#include <queue>
#include <stop_token>
#include <string>
#include <thread>

using Clock = std::chrono::steady_clock;
using namespace std::chrono_literals;

// Each hop checks the remaining budget and the stop token before doing more work.
std::optional<std::string> call_hop(const std::string& name, std::chrono::milliseconds cost, Clock::time_point deadline, std::stop_token st) {
    if (Clock::now() + cost > deadline) return std::nullopt;                     // can't finish in time: don't start
    auto end = Clock::now() + cost;
    while (Clock::now() < end) {
        if (st.stop_requested()) return std::nullopt;                            // client went away
        std::this_thread::sleep_for(1ms);
    }
    return name + " ok";
}

std::string handle(Clock::duration budget, std::stop_token st) {
    auto deadline = Clock::now() + budget;                                         // set once at the edge
    for (auto [name, cost] : {std::pair{"auth", 20ms}, std::pair{"inventory", 30ms}, std::pair{"pricing", 60ms}}) {
        if (!call_hop(name, cost, deadline, st)) return std::string("stopped before/at ") + name + (st.stop_requested() ? " (cancelled)" : " (deadline)");
    }
    return "complete";
}

template <class T>
class BoundedQueue {                                      // backpressure: try_push fails when full
public:
    explicit BoundedQueue(std::size_t cap) : cap_(cap) {}
    bool try_push(T v) { std::scoped_lock l(m_); if (q_.size() == cap_) return false; q_.push(std::move(v)); return true; }
    std::optional<T> try_pop() { std::scoped_lock l(m_); if (q_.empty()) return std::nullopt; T v = std::move(q_.front()); q_.pop(); return v; }
private:
    std::mutex m_; std::queue<T> q_; std::size_t cap_;
};

int main() {
    std::stop_source s1;
    std::cout << "budget 200 ms: " << handle(200ms, s1.get_token()) << '\n';
    std::stop_source s2;
    std::cout << "budget 70 ms:  " << handle(70ms, s2.get_token()) << '\n';
    std::stop_source s3;
    std::jthread client_leaves([&] { std::this_thread::sleep_for(30ms); s3.request_stop(); });
    std::cout << "client disconnects at ~30 ms: " << handle(500ms, s3.get_token()) << '\n';

    BoundedQueue<int> q(100);
    int accepted = 0, rejected = 0;
    for (int i = 0; i < 1000; ++i) {                      // producer bursts 1000 items; consumer takes 1 per 4
        (q.try_push(i) ? accepted : rejected)++;
        if (i % 4 == 0) q.try_pop();
    }
    std::cout << "burst of 1000 into a queue of 100: accepted " << accepted << ", pushed back (429/503) " << rejected << '\n';
}
```

**Output:**
```text
budget 200 ms: complete
budget 70 ms:  stopped before/at pricing (deadline)
client disconnects at ~30 ms: stopped before/at inventory (cancelled)
burst of 1000 into a queue of 100: accepted 350, pushed back (429/503) 650
```

With 70 ms left after auth and inventory took 50 ms, the service **doesn't even start** the 60 ms pricing call — it would miss the deadline anyway.

### Interview answer
"Every remote call has a timeout, and better, the edge sets a deadline that's propagated so each hop knows its remaining budget and skips work it can't finish. When the client disconnects or the deadline passes, cancellation stops downstream calls and computation. Rate limiting caps each client with 429 and Retry-After, and all queues are bounded: when they're full we block, reject or drop low-priority work, so overload produces fast, clear errors instead of unbounded memory and latency."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Nines | 99.9% = 43 min / month; 99.99% = 4.3 min / month |
| Series / parallel | multiply / 1 − (1 − a)ⁿ; correlated failures break redundancy |
| MTTR | A = MTBF / (MTBF + MTTR); faster recovery is often cheaper |
| Capacity | saturation first; hard limits (disk, FDs, quotas); 60–70% target; survive zone loss; `predict_linear` |
| Chaos | steady state → hypothesis → small blast radius + abort → learn → automate; game days for people + runbooks |
| DR | RPO (data loss) / RTO (downtime); backup&restore → pilot light → warm standby → active-active |
| Backups | 3-2-1 + immutable; keys recoverable; **restore tests** timed against RTO |
| Fault tolerance | redundancy across domains; degrade optional features; bulkheads; load shedding; static stability |
| Retries | transient + idempotent only; capped exponential backoff + full jitter; one layer; retry budget |
| Circuit breaker | closed → open (fail fast) → half-open (trial) → closed |
| SLI / SLO / SLA | good/valid ratio / internal target / contract (looser) |
| Error budget | 1 − SLO; policy: freeze risky releases when spent; alert on burn rate |
| Timeouts | everywhere; deadline propagation; don't start work that can't finish |
| Backpressure | bounded queues; block / reject / drop; never unbounded |
