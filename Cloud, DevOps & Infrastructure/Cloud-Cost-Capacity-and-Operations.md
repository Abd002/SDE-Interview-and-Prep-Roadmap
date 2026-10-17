# Cloud Cost, Capacity, and Operations — Capacity Planning, FinOps, Multi-Region, Managed vs. Self-Hosted, Purchasing Options

> **What you'll learn:** how to **plan capacity** from throughput, utilization and **p95 latency**; how to make cost visible and controllable with **tagging, cost allocation, budgets and cost observability** (FinOps); how to run **multi-region architectures** with **backup/restore drills and runbooks**; how to decide between **managed services and self-hosting**; and when to use **on-demand, reserved/Savings Plans and Spot** capacity. Each part has a runnable C++ calculator.
>
> **Prerequisites:** [Cloud Computing Fundamentals](./Cloud-Computing-Fundamentals.md), [Performance and Scalability Testing](../Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md), [SRE](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md). Prices below are illustrative list prices — always check the current pricing pages.

## Table of Contents
1. [Capacity planning using throughput, utilization, and p95 latency](#1-capacity-planning-using-throughput-utilization-and-p95-latency)
2. [Cost allocation, tagging, budgets, and cost observability](#2-cost-allocation-tagging-budgets-and-cost-observability)
3. [Multi-region architecture, backup/restore drills, and runbooks](#3-multi-region-architecture-backuprestore-drills-and-runbooks)
4. [Operational trade-offs: managed services vs. self-hosting](#4-operational-trade-offs-managed-services-vs-self-hosting)
5. [Reserved capacity vs. on-demand vs. spot instances](#5-reserved-capacity-vs-on-demand-vs-spot-instances)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Capacity planning using throughput, utilization, and p95 latency

**In one sentence:** measure how much **throughput one unit** (instance, pod, DB) handles **while p95/p99 latency stays within the SLO**, keep **utilization** below the knee where queues explode (often 60–70%), then size for **peak + growth + failure headroom** (lose an AZ, deploy surge) — and re-check with load tests and real metrics.

### In plain words
A bridge's sign says "max 30 trucks at once" — not because it collapses at 31, but because traffic slows to a crawl near full capacity. You plan for rush hour plus next year's growth, and for one lane being closed for repairs.

### How it works
1. **Per-unit capacity:** load test one instance; find the throughput where **p95 crosses the SLO** (e.g. 300 ms) — that's the usable capacity, not the CPU-100% point ([baselines](../Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#1-capacity-baselines-and-regression-performance-testing)).
2. **Utilization target:** queueing makes latency rise steeply near saturation; plan at **60–70%** for latency-sensitive services ([why](../Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#6-red-rate-errors-duration-and-use-utilization-saturation-errors)).
3. **Demand:** peak traffic (not average), seasonal events (Ramadan, Black Friday, payday), growth forecast (e.g. +40%/year).
4. **Headroom:** N+1 / survive one AZ of three (×1.5), deployment surge, retries during incidents.
5. **Little's law** for concurrency: `L = λ × W` (in-flight requests = arrival rate × time in system) — sizes thread pools, connection pools and Lambda concurrency.
6. Check **all** resources: CPU, memory, connections, IOPS, network, downstream quotas, licences, API rate limits.

#### Modern C++ example — sizing a fleet from a load test, peak, growth, utilization target and AZ-loss headroom
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

int main() {
    // Load test of ONE instance: throughput (rps) vs. p95 latency (ms). SLO: p95 <= 300 ms.
    std::vector<std::pair<double, double>> test{{100, 80}, {200, 95}, {300, 130}, {400, 210}, {450, 290}, {500, 520}, {550, 1400}};
    double per_instance = 0;
    for (auto [rps, p95] : test) if (p95 <= 300) per_instance = rps;
    std::cout << "usable capacity per instance (p95 <= 300 ms): " << per_instance << " rps (CPU would 'allow' more, latency doesn't)\n";

    const double peak_today = 6000, growth = 0.40, target_util = 0.65;
    const int azs = 3;
    double peak_next_year = peak_today * (1 + growth);
    double needed = std::ceil(peak_next_year / (per_instance * target_util));
    double per_az = std::ceil(needed / (azs - 1));                       // still enough with one AZ down
    std::cout << std::fixed << std::setprecision(0)
              << "peak next year: " << peak_next_year << " rps -> " << needed << " instances at 65% utilization\n"
              << "survive losing 1 of 3 AZs: " << per_az << " per AZ x " << azs << " = " << per_az * azs << " instances\n";

    // Little's law: in-flight = arrival rate x time in system.
    double rps = peak_next_year, avg_latency_s = 0.120;
    std::cout << "Little's law: " << rps << " rps x " << std::setprecision(2) << avg_latency_s << std::setprecision(0) << " s = ~" << rps * avg_latency_s
              << " requests in flight -> size DB pools / workers for that, spread over " << per_az * azs << " instances\n";
}
```

**Output:**
```text
usable capacity per instance (p95 <= 300 ms): 450 rps (CPU would 'allow' more, latency doesn't)
peak next year: 8400 rps -> 29 instances at 65% utilization
survive losing 1 of 3 AZs: 15 per AZ x 3 = 45 instances
Little's law: 8400 rps x 0.12 s = ~1008 requests in flight -> size DB pools / workers for that, spread over 45 instances
```


### Interview answer
"I load-test one unit to find the throughput where p95 still meets the SLO, which is lower than the CPU-saturation point, and plan at 60–70% of that because queueing makes latency explode near saturation. Then I size for peak, not average, plus seasonal events and growth, and add failure headroom — enough capacity in two of three AZs — and deploy surge. Little's law turns rate times latency into in-flight requests to size pools and concurrency, and I check every resource including connections, IOPS and downstream quotas, then verify with load tests and production metrics."

---

## 2. Cost allocation, tagging, budgets, and cost observability

**In one sentence:** make cloud spend **visible per team, service and environment** with **consistent tags** (enforced by policy) and **account structure**, set **budgets and anomaly alerts**, show **unit costs** (cost per order, per active user) next to engineering metrics, and run a **FinOps** loop: inform → optimize → operate.

### In plain words
A shared house electricity bill: if nobody knows who uses what, nobody saves. Put a meter on each room (tags/accounts), set a monthly limit with a warning text (budgets), and show "cost per hot shower" so people understand the trade-off (unit costs).

### How it works
- **Account per team/environment** (AWS Organizations) is the strongest allocation; **tags** for finer splits: `team`, `service`, `env`, `cost-center`, `owner`. Activate them as **cost allocation tags**; enforce with **tag policies**, SCPs, IaC defaults (`default_tags` in the Terraform AWS provider), and CI policy checks.
- **Shared costs** (networking, Kubernetes clusters, support): allocate by usage (Kubecost/OpenCost for per-namespace/pod cost) or a fair split.
- **Budgets & alerts:** AWS Budgets (actual and forecast), **Cost Anomaly Detection**, alerts to team channels; showback/chargeback reports.
- **Cost observability:** Cost Explorer, CUR (Cost and Usage Report) → Athena/QuickSight, Grafana/Vantage/CloudZero; **unit economics** dashboards (cost per 1,000 requests, per tenant).
- **Common waste:** idle/oversized instances, unattached EBS volumes and old snapshots, NAT gateway data processing, cross-AZ/egress traffic, forgotten dev environments, unbounded log retention, over-provisioned DB IOPS. Right-size with Compute Optimizer; schedule non-prod to stop at night.
- **Design for cost:** architecture choices (serverless vs. always-on, data transfer paths, storage classes) usually matter more than discounts.

```hcl
provider "aws" {
  region = "eu-central-1"
  default_tags { tags = { team = "payments", service = "checkout", env = "prod", cost-center = "CC-210" } }
}
```

#### Modern C++ example — allocating a monthly bill by tags, flagging untagged spend, budget forecast and unit cost
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct LineItem { std::string resource; double usd; std::map<std::string, std::string> tags; };

int main() {
    std::vector<LineItem> bill{
        {"eks-node-group", 4200, {{"team", "platform"}, {"env", "prod"}}},
        {"rds-orders", 2600, {{"team", "orders"}, {"env", "prod"}}},
        {"lambda-payments", 380, {{"team", "payments"}, {"env", "prod"}}},
        {"nat-gateway", 1450, {{"team", "platform"}, {"env", "prod"}}},
        {"ec2-i-0abc (no tags)", 900, {}},
        {"rds-orders-staging", 700, {{"team", "orders"}, {"env", "staging"}}},
        {"ebs-unattached-x12", 240, {}},
    };
    std::map<std::string, double> by_team;
    double untagged = 0, total = 0;
    for (auto& li : bill) {
        total += li.usd;
        auto it = li.tags.find("team");
        if (it == li.tags.end()) { untagged += li.usd; continue; }
        by_team[it->second] += li.usd;
    }
    std::cout << std::fixed << std::setprecision(0);
    for (auto& [team, usd] : by_team) std::cout << team << ": $" << usd << '\n';
    std::cout << "UNTAGGED: $" << untagged << " (" << untagged * 100 / total << "% of $" << total << ") -> enforce tag policy, investigate owners\n";

    const double budget = 10000, day = 18, days_in_month = 30;
    double forecast = total / day * days_in_month;
    std::cout << "month-to-date $" << total << " on day " << day << " -> forecast $" << forecast << " vs budget $" << budget
              << (forecast > budget ? " -> ALERT (forecast over budget)" : "") << '\n';
    double orders_this_month = 410'000;
    std::cout << std::setprecision(3) << "unit cost: $" << total / orders_this_month * 1000 << " per 1,000 orders so far\n";
}
```

**Output:**
```text
orders: $3300
payments: $380
platform: $5650
UNTAGGED: $1140 (11% of $10470) -> enforce tag policy, investigate owners
month-to-date $10470 on day 18 -> forecast $17450 vs budget $10000 -> ALERT (forecast over budget)
unit cost: $25.537 per 1,000 orders so far
```

### Interview answer
"I allocate cost with an account per team and environment plus enforced tags — team, service, env, cost center — set as provider default tags and checked in CI, with Kubecost or OpenCost to split shared Kubernetes clusters. Budgets with forecast alerts and anomaly detection go to the owning team's channel, and dashboards show unit costs like cost per thousand orders next to engineering metrics. Then the FinOps loop: find waste — idle or oversized resources, unattached volumes, NAT and cross-AZ data transfer, forgotten environments, log retention — right-size, schedule non-prod, and choose architectures with cost in mind."

---

## 3. Multi-region architecture, backup/restore drills, and runbooks

**In one sentence:** go **multi-region** only when RTO/RPO, latency or regulation require it — **active-passive** (warm standby, failover) or **active-active** (both serve, data replicated) — and make it real with **automated failover paths**, **regular restore and failover drills**, and **runbooks** that someone other than the author can execute under stress.

### In plain words
A hospital with a backup generator is useless if nobody has ever tested switching to it. A second hospital in another city helps only if ambulances know when and how to go there, and the patient records are already there.

### How it works
| Pattern | Data | Failover | Cost / complexity |
|---|---|---|---|
| **Backup & restore** to another region | snapshot copies | hours | low |
| **Pilot light / warm standby** (active-passive) | async replication (Aurora Global, DynamoDB global tables, S3 CRR) | minutes (DNS/ARC switch, scale up) | medium |
| **Active-active** | multi-writer (DynamoDB global tables, Spanner, CockroachDB) or partitioned by user/region | seconds, traffic shifts | high: conflicts, consistency, double capacity |

**Design points**
- **Data is the hard part:** async replication means RPO > 0; multi-writer needs conflict resolution (last-writer-wins, CRDTs) or **home-region** ownership per user/tenant.
- **Routing:** Route 53 latency/failover records with health checks, Global Accelerator, CloudFront origin failover; **Route 53 Application Recovery Controller** for controlled, tested failover switches (data-plane, no dependency on the failing region's control plane).
- **Everything regional must exist in both:** IaC per region, secrets, KMS keys (multi-region keys), container images (ECR replication), quotas raised in the standby region.
- **Drills:** restore backups to a scratch environment monthly (timed vs. RTO), fail over a non-critical service quarterly, full game day yearly; **verify** data integrity after restore ([DR drills](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#4-disaster-recovery-drills-backups-and-restore-verification)).
- **Runbooks:** trigger conditions, decision owner, exact steps/commands, verification checks, rollback, communication template; keep them in the repo, test them in drills, automate repeated steps.

```text
RUNBOOK: Fail over checkout from eu-central-1 to eu-west-1        Owner: payments on-call     Decision: incident commander
Trigger:  region health dashboard red > 10 min OR AWS Health event for eu-central-1 + SLO burn > 14x
1. Confirm: synthetic checks failing from 3 locations; not a bad deploy (check last 60 min of changes)
2. Freeze deploys (pipeline lock)
3. Promote Aurora Global secondary in eu-west-1  ->  aws rds failover-global-cluster --global-cluster-identifier orders ...
4. Flip the ARC routing control "checkout-primary" to eu-west-1
5. Scale eu-west-1 ASG/HPA min to the prod baseline (pre-warmed: 50%)
6. Verify: checkout success rate, p95, order writes visible in eu-west-1; status page update
Rollback / failback: only after root cause known; reverse replication first, then switch in a quiet window
```

#### Modern C++ example — a timed failover drill: measured RTO/RPO vs. objectives, with the step that blew the budget
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Step { std::string what; int minutes; };

int main() {
    const int rto_objective = 30, rpo_objective_s = 60;
    const int replication_lag_s = 4;                                       // Aurora Global typical lag at failover time
    std::vector<Step> drill{
        {"detect + confirm (alerts, synthetic checks)", 6}, {"decision by incident commander", 3},
        {"promote secondary database", 4}, {"flip routing control", 1},
        {"scale standby fleet to baseline (quota limit hit, ticket raised!)", 22}, {"verify + status page", 4},
    };
    int total = 0, worst = 0; std::string worst_step;
    for (auto& s : drill) { total += s.minutes; if (s.minutes > worst) { worst = s.minutes; worst_step = s.what; } std::cout << "  +" << s.minutes << " min  " << s.what << '\n'; }
    std::cout << "measured RTO " << total << " min vs objective " << rto_objective << " -> " << (total <= rto_objective ? "met" : "MISSED") << '\n';
    std::cout << "measured RPO ~" << replication_lag_s << " s vs objective " << rpo_objective_s << " s -> met\n";
    if (total > rto_objective) std::cout << "action item: \"" << worst_step << "\" -> pre-raise quotas and keep standby warm at 50%\n";
}
```

**Output:**
```text
  +6 min  detect + confirm (alerts, synthetic checks)
  +3 min  decision by incident commander
  +4 min  promote secondary database
  +1 min  flip routing control
  +22 min  scale standby fleet to baseline (quota limit hit, ticket raised!)
  +4 min  verify + status page
measured RTO 40 min vs objective 30 -> MISSED
measured RPO ~4 s vs objective 60 s -> met
action item: "scale standby fleet to baseline (quota limit hit, ticket raised!)" -> pre-raise quotas and keep standby warm at 50%
```

This is exactly what drills are for: the quota problem was found on a calm Tuesday instead of during a real outage.

### Interview answer
"I go multi-region only when RTO, RPO, latency or regulation require it. Active-passive with warm standby and async replication like Aurora Global Database or S3 replication is the common choice; active-active needs multi-writer data with conflict handling or home-region ownership per tenant and roughly double capacity. Failover runs through data-plane controls like Route 53 ARC with health checks, and the standby region must already have IaC, secrets, multi-region keys, replicated images and raised quotas. I run timed restore and failover drills against RTO and RPO, and keep runbooks with triggers, owners, exact commands and verification steps."

---

## 4. Operational trade-offs: managed services vs. self-hosting

**In one sentence:** **managed services** (RDS, MSK, ElastiCache, EKS, OpenSearch Service, SaaS) trade **higher unit prices and less control** for **less operational toil, built-in HA/backups/patching and faster delivery**, while **self-hosting** gives **control, portability and sometimes lower cost at scale** — at the price of the people, expertise and on-call needed to run it reliably.

### In plain words
Renting a car with insurance and servicing included vs. owning a car and fixing it yourself. Owning is cheaper per kilometre if you drive a lot and know engines — but count your weekends spent in the garage, and who drives you to work when it breaks.

### How it works
**Total cost of ownership (TCO) = infrastructure + people + risk**
- Self-hosting a database "properly" means: HA setup, replication, failover testing, backups + restore drills, patching/upgrades, monitoring, security hardening, capacity planning, 24/7 on-call. That's often **0.5–2 engineers** — usually more than the managed premium for small and mid-size workloads.
- **Choose managed when:** it's not your differentiator, the team is small, time-to-market matters, you need compliance certifications, or the service is hard to run (Kafka, Elasticsearch, Postgres HA).
- **Consider self-hosting when:** very large steady scale where the premium is huge, special versions/extensions/tuning, data-sovereignty or portability needs, or deep in-house expertise already exists.
- **Middle grounds:** Kubernetes operators (CloudNativePG, Strimzi), "bring your own cloud" vendors, serverless tiers, open-source-compatible managed services to keep an **exit path**.
- **Watch for:** vendor lock-in (proprietary APIs), managed-service limits and maintenance windows, cost cliffs (per-request pricing at high volume), and support quality.

#### Modern C++ example — 3-year TCO: managed vs. self-hosted PostgreSQL, including people and incident risk
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>

struct Option { std::string name; double infra_per_month, engineer_fte, incidents_per_year, hours_down_per_incident; };

double tco_3y(const Option& o, double fte_cost_per_year, double downtime_cost_per_hour) {
    return 36 * o.infra_per_month + 3 * o.engineer_fte * fte_cost_per_year + 3 * o.incidents_per_year * o.hours_down_per_incident * downtime_cost_per_hour;
}

int main() {
    const double fte = 60'000, downtime = 5'000;                // per-year engineer cost; revenue lost per hour down
    std::cout << std::fixed << std::setprecision(0);
    for (double scale : {1.0, 8.0}) {                             // small workload vs. 8x bigger
        Option managed{"managed (Aurora PostgreSQL)", 3'200 * scale, 0.1, 0.5, 0.5};
        Option self{"self-hosted (EC2 + Patroni)", 1'900 * scale, 0.8, 1.5, 2.0};
        double a = tco_3y(managed, fte, downtime), b = tco_3y(self, fte, downtime);
        std::cout << "scale x" << scale << ": " << managed.name << " $" << a << " vs " << self.name << " $" << b
                  << " -> " << (a <= b ? "managed" : "self-hosted") << " is cheaper over 3 years\n";
    }
}
```

**Output:**
```text
scale x1: managed (Aurora PostgreSQL) $136950 vs self-hosted (EC2 + Patroni) $257400 -> managed is cheaper over 3 years
scale x8: managed (Aurora PostgreSQL) $943350 vs self-hosted (EC2 + Patroni) $736200 -> self-hosted is cheaper over 3 years
```

The crossover only appears at large scale — and only if you really have the expertise to keep incidents rare.

### Interview answer
"I compare total cost of ownership: infrastructure plus the engineers to run, patch, back up, fail over and be on call for it, plus the risk cost of incidents. For most teams managed services like RDS, MSK or ElastiCache win, because the premium is smaller than the toil and they bring HA, backups and compliance built in. Self-hosting makes sense at large steady scale, for special tuning or extensions, for portability or sovereignty, or where we already have deep expertise — and Kubernetes operators or open-source-compatible managed services keep an exit path either way."

---

## 5. Reserved capacity vs. on-demand vs. spot instances

**In one sentence:** **on-demand** is pay-as-you-go with no commitment, **Savings Plans / Reserved Instances** give roughly **30–70% discounts** for a **1- or 3-year commitment** to a steady baseline, and **Spot** sells spare capacity at up to **~90% off** but can be **reclaimed with a 2-minute warning** — so cover the steady base with commitments, bursts with on-demand, and interruption-tolerant work with Spot.

### In plain words
Phone plans: pay per minute (on-demand), a yearly contract with cheaper minutes because you promise to use them (reserved/Savings Plans), or standby airline tickets — very cheap, but you may be bumped off the flight (Spot).

### How it works
| Option | Discount vs. on-demand | Commitment | Risk | Best for |
|---|---|---|---|---|
| **On-demand** | 0% | none | none | spiky, unknown, short-term |
| **Compute Savings Plans** | up to ~66% | $/hour for 1 or 3 years, any instance family/region/EC2/Fargate/Lambda | paying for unused commitment | steady baseline, flexible |
| **EC2 Instance Savings Plans / Reserved Instances** | up to ~72% | specific family/region (RIs also size/AZ options) | less flexible | very stable fleets, RDS/ElastiCache/OpenSearch reservations |
| **Spot** | up to ~90% | none | **2-minute interruption notice** | stateless workers, batch, CI runners, big data, dev/test, flexible Kubernetes nodes |

**Strategy**
- Commit to the **floor** you're confident about (e.g. the minimum of the last 30 days, or 70–80% of steady usage), not the peak; review monthly; ladder commitments over time.
- **Spot best practices:** diversify across many instance types and AZs (capacity-optimized allocation), handle the interruption notice (drain/checkpoint), keep state off the instance, mix with on-demand in ASGs (e.g. base on-demand + Spot above it), Karpenter for Spot in Kubernetes.
- Also: Graviton (better price-performance), right-sizing **before** committing, turning off non-prod at night (a 12h/5-day schedule cuts ~64%).

#### Modern C++ example — covering a daily usage curve with Savings Plans + on-demand + Spot, compared with all on-demand
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> instances_by_hour{20, 18, 18, 18, 20, 24, 32, 44, 52, 56, 58, 60, 60, 58, 56, 54, 52, 50, 46, 40, 34, 28, 24, 22};
    const double od = 0.10, sp_discount = 0.45, spot_discount = 0.70;      // $/instance-hour, illustrative
    const int committed = 20;                                              // ~the daily minimum
    double all_od = 0, mixed = 0, interruptions_exposed = 0;
    for (int n : instances_by_hour) {
        all_od += n * od;
        int base = std::min(n, committed);
        int burst = n - base;
        int spot = burst * 6 / 10;                                         // 60% of the burst is interruption-tolerant workers
        int on_demand = burst - spot;
        mixed += committed * od * (1 - sp_discount)                        // commitment is paid even if unused
               + on_demand * od + spot * od * (1 - spot_discount);
        interruptions_exposed += spot;
    }
    std::cout << std::fixed << std::setprecision(2)
              << "daily cost all on-demand:            $" << all_od << '\n'
              << "Savings Plan base + on-demand + Spot: $" << mixed << " (" << std::setprecision(0) << (1 - mixed / all_od) * 100 << "% cheaper)\n"
              << "Spot instance-hours that could be interrupted: " << interruptions_exposed << " -> only stateless workers/batch run there\n";
}
```

**Output:**
```text
daily cost all on-demand:            $94.40
Savings Plan base + on-demand + Spot: $54.15 (43% cheaper)
Spot instance-hours that could be interrupted: 275 -> only stateless workers/batch run there
```

### Interview answer
"On-demand is flexible with no commitment; Savings Plans or Reserved Instances discount a committed steady baseline by roughly 30 to 70 percent for one or three years; Spot gives up to about 90 percent off spare capacity that can be reclaimed with a two-minute notice. I right-size first, commit only to the confident floor of usage — Compute Savings Plans for flexibility — cover bursts with on-demand, and run interruption-tolerant, stateless work like batch, CI and worker pools on diversified Spot with graceful draining. Non-production schedules and Graviton add further savings."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Capacity unit | throughput at which p95 still meets the SLO (not CPU 100%) |
| Utilization target | 60–70% for latency-sensitive services (queueing knee) |
| Sizing | peak × growth ÷ (unit capacity × target) + AZ-loss + deploy headroom; check every resource |
| Little's law | in-flight = rate × latency → pools, workers, concurrency |
| Cost allocation | accounts per team/env + enforced tags (default_tags, tag policies); Kubecost for shared clusters |
| Cost control | budgets (forecast), anomaly detection, unit costs, waste hunting (idle, unattached, NAT, egress, logs) |
| Multi-region | only if RTO/RPO/latency/regulation need it; active-passive common; active-active = data conflicts + 2× capacity |
| Failover readiness | IaC + secrets + multi-region keys + images + quotas in standby; ARC routing controls; drills timed vs. RTO/RPO |
| Runbooks | trigger, owner, exact steps, verification, rollback, comms; tested in drills |
| Managed vs. self-hosted | TCO = infra + people + risk; managed for most; self-host at big steady scale with expertise |
| Purchasing | on-demand (flexible) · Savings Plans/RIs (committed floor, 30–70% off) · Spot (≤ 90% off, 2-min notice) |
| Spot practice | diversify types/AZs, capacity-optimized, drain on notice, stateless only, mix with on-demand |
