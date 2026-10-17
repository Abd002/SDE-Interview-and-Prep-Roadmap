# Production Incidents and Operational Excellence — Handling, Learning From and Preventing Outages

> **What you'll learn:** how to classify and run an **incident** (severity, triage, mitigation, communication), how **on-call** works (handoffs, runbooks, escalation, ownership), how to do **root-cause analysis** with timelines and evidence, how to write **blameless postmortems** with real follow-ups, how to ship safely with **change management, feature flags, canaries and rollback**, and which **architectural trade-offs** matter for reliability. Includes runnable C++ examples and copy-paste templates.
>
> **Prerequisites:** [Reliability Engineering (SRE)](./Reliability-Engineering-SRE.md), [Logging, Metrics, and Tracing](./Logging-Metrics-and-Tracing.md).

## Table of Contents
1. [Blameless postmortems with contributing factors and follow-ups](#1-blameless-postmortems-with-contributing-factors-and-follow-ups)
2. [Change management, feature flags, safe rollouts, and rollback](#2-change-management-feature-flags-safe-rollouts-and-rollback)
3. [Incident severity, triage, mitigation, and communication](#3-incident-severity-triage-mitigation-and-communication)
4. [On-call handoffs, runbooks, escalation, and ownership](#4-on-call-handoffs-runbooks-escalation-and-ownership)
5. [Reliability-related architectural trade-offs](#5-reliability-related-architectural-trade-offs)
6. [Root-cause analysis: timelines, hypotheses, and evidence](#6-root-cause-analysis-timelines-hypotheses-and-evidence)
7. [Cheat sheet](#cheat-sheet)

The sections follow the checklist order. In real life the order is **3 → 4 → 6 → 1**, with **2** and **5** preventing the next incident.

---

## 1. Blameless postmortems with contributing factors and follow-ups

**In one sentence:** after a significant incident, write a **blameless** document that explains **what happened, why the system allowed it** (several **contributing factors**, not one person's mistake), what went well and badly in the response, and **owned, dated action items** that are actually tracked to completion.

### In plain words
When a plane has a near-miss, investigators don't ask "who do we fire?" but "why did the system make this mistake easy?" — a confusing switch, a missing checklist, a tired crew. Fix those, and the next crew is safe too. Blame makes people hide information, and then nothing gets fixed.

### How it works
- **When:** every SEV1/SEV2, any data loss, any incident that burned a lot of error budget, and interesting near-misses.
- **Blameless:** assume everyone acted reasonably with the information they had. Ask "how did the system let this happen?" — missing guardrails, confusing tools, alert gaps, unclear ownership.
- **Contributing factors, not "the root cause":** complex failures usually need several conditions at once (a bad config **and** no validation **and** a global rollout **and** an alert that didn't fire). "Human error" is never the end of the analysis.
- **Good action items** are **specific, owned, dated and prioritized** — and they change the system: add validation, add an alert, make rollouts staged, automate a manual step. Avoid "be more careful".
- **Review** the postmortem in a meeting, share it widely, and **track** action items like any other work (they're the whole point).

**Postmortem template**
```text
Title: Checkout errors for EU users after config push        Severity: SEV2      Status: action items open
Date / duration: 2026-10-12 14:02–14:49 UTC (47 min)         Authors: …          Reviewers: …
Impact:        18% of EU checkout requests failed; ~3,100 orders delayed; 41% of monthly error budget burned
Detection:     burn-rate alert at 14:09 (7 min after start); first customer ticket at 14:11
Timeline (UTC): 14:00 config v83 pushed globally · 14:02 errors begin · 14:09 page · 14:17 IC declared SEV2 ·
               14:31 config identified · 14:38 rollback to v82 · 14:49 error rate normal
Contributing factors:
  1. New connection-pool setting (max=10) was valid syntax but too small for EU traffic.
  2. Config changes skipped the canary stage that code deploys use.
  3. The dashboard grouped all regions, hiding the EU-only spike for 12 minutes.
What went well:   alert fired quickly; rollback was one command.
What went badly:  config history was hard to find; status page updated 25 min late.
Action items (owner, due, priority):
  [P1] Route config pushes through the same staged rollout as code — @platform, 10-26
  [P1] Add load-based validation for pool sizes in CI — @payments, 10-24
  [P2] Per-region panels on the checkout dashboard — @observability, 10-31
  [P2] Status-page update within 10 min added to the IC checklist — @incident-mgmt, 10-20
Lessons: config is code; it needs the same safety net.
```

#### Modern C++ example — tracking postmortem action items so they don't silently rot
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct ActionItem { std::string title, owner; int due_day; int priority; bool done; };

int main() {
    const int today = 30;
    std::vector<ActionItem> items{
        {"staged rollout for config pushes", "@platform", 26, 1, false},
        {"CI validation for pool sizes", "@payments", 24, 1, true},
        {"per-region checkout panels", "@observability", 31, 2, false},
        {"status page update in IC checklist", "", 20, 2, false},           // no owner = won't happen
    };
    int open = 0;
    for (const auto& a : items) {
        if (a.done) continue;
        ++open;
        std::string problem = a.owner.empty() ? "NO OWNER" : a.due_day < today ? "OVERDUE by " + std::to_string(today - a.due_day) + " days" : "on track";
        std::cout << "[P" << a.priority << "] " << a.title << " (" << (a.owner.empty() ? "?" : a.owner) << ") -> " << problem << '\n';
    }
    std::cout << open << " open item(s); P1 items overdue should be raised in the weekly ops review\n";
}
```

**Output:**
```text
[P1] staged rollout for config pushes (@platform) -> OVERDUE by 4 days
[P2] per-region checkout panels (@observability) -> on track
[P2] status page update in IC checklist (?) -> NO OWNER
3 open item(s); P1 items overdue should be raised in the weekly ops review
```

### Interview answer
"After a significant incident I write a blameless postmortem: impact, detection, a timestamped timeline, several contributing factors that explain why the system allowed the failure, what went well and badly in the response, and specific action items with owners, dates and priorities that change the system — guardrails, alerts, automation — not 'be careful'. It's reviewed and shared, and the action items are tracked like any other work, because unfixed follow-ups mean the same incident happens again."

---

## 2. Change management, feature flags, safe rollouts, and rollback

**In one sentence:** most outages are caused by **changes**, so ship them **gradually and reversibly**: small changes, automated checks, **canary** or **progressive** rollouts with automatic **health analysis**, **feature flags** to decouple deploy from release, and a **fast, practised rollback** for code, config and schema.

### In plain words
Don't repaint the whole house in a colour you've never seen. Paint one small wall, look at it in daylight, and keep the old paint ready in case you hate it.

### How it works
**Rollout strategies**
| Strategy | How | Rollback |
|---|---|---|
| **Rolling** | replace instances in batches | roll forward/back batch by batch |
| **Blue-green** | two full environments; switch traffic | switch back instantly |
| **Canary** | small % of traffic to the new version, compare metrics, then expand (1% → 5% → 25% → 100%) | stop and shift traffic back |
| **Progressive delivery** | canary + automated analysis (Argo Rollouts, Flagger, Spinnaker Kayenta) | automatic |
| **Region / cell by cell** | one region or cell at a time, with bake time | contained blast radius |

**Feature flags** (LaunchDarkly, Unleash, OpenFeature, homegrown)
- **Deploy dark, release later:** code ships off; turn it on for staff → 1% → everyone.
- **Kill switch** to disable a feature instantly without a deploy.
- Kinds: release flags (short-lived — delete after rollout), ops/kill switches, experiment flags (A/B), permission flags.
- **Flag debt:** old flags make code paths explode — set an expiry and remove them.
- Use **consistent hashing** of user ID so a user stays in the same bucket.

**Change management essentials:** peer review, CI tests, change log/audit trail (who changed what, when), **config treated like code** (reviewed, validated, staged), change freezes for peak events, and **backward-compatible database changes** (expand–contract) so code can roll back without data rollback.

#### Modern C++ example — a percentage feature flag with sticky buckets, and canary analysis that triggers rollback
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <string>

std::uint32_t bucket(const std::string& flag, const std::string& user) {     // stable 0..99 per (flag, user)
    std::uint64_t h = 1469598103934665603ull;
    for (char c : flag + ":" + user) { h ^= static_cast<unsigned char>(c); h *= 1099511628211ull; }
    return static_cast<std::uint32_t>(h % 100);
}
bool enabled(const std::string& flag, const std::string& user, int percent) { return bucket(flag, user) < static_cast<std::uint32_t>(percent); }

struct Metrics { long requests, errors; double p99_ms; };

std::string canary_verdict(const Metrics& base, const Metrics& canary) {
    double be = double(base.errors) / base.requests, ce = double(canary.errors) / canary.requests;
    if (ce > be * 2 && ce - be > 0.001) return "ROLLBACK (error rate " + std::to_string(ce * 100).substr(0, 4) + "% vs " + std::to_string(be * 100).substr(0, 4) + "%)";
    if (canary.p99_ms > base.p99_ms * 1.2) return "ROLLBACK (p99 regression)";
    return "promote to next stage";
}

int main() {
    int on = 0;
    for (int u = 0; u < 10000; ++u) on += enabled("new-checkout", "user" + std::to_string(u), 5);
    std::cout << "5% rollout: " << on << " of 10000 users see the new checkout\n";
    std::cout << std::boolalpha << "sticky: user42 at 5% -> " << enabled("new-checkout", "user42", 5)
              << ", again -> " << enabled("new-checkout", "user42", 5) << '\n';
    int stay = 0, was_on = 0;                                  // raising 5% -> 25% keeps everyone who already had it
    for (int u = 0; u < 10000; ++u) { auto id = "user" + std::to_string(u); if (enabled("new-checkout", id, 5)) { ++was_on; stay += enabled("new-checkout", id, 25); } }
    std::cout << "after raising to 25%: " << stay << " of " << was_on << " early users keep the feature\n";

    Metrics baseline{95000, 95, 210.0};
    std::cout << "stage 1 canary: " << canary_verdict(baseline, {5000, 6, 220.0}) << '\n';
    std::cout << "stage 2 canary: " << canary_verdict(baseline, {25000, 140, 215.0}) << '\n';
}
```

**Output:**
```text
5% rollout: 471 of 10000 users see the new checkout
sticky: user42 at 5% -> false, again -> false
after raising to 25%: 471 of 471 early users keep the feature
stage 1 canary: promote to next stage
stage 2 canary: ROLLBACK (error rate 0.56% vs 0.10%)
```

### Interview answer
"Since most incidents come from changes, I make changes small, reviewed, tested and reversible. I roll out progressively — canary or cell by cell — with automated analysis comparing error rate and latency against the baseline, and automatic rollback when it regresses. Feature flags decouple deploy from release, give kill switches and sticky percentage rollouts via consistent hashing, and get deleted afterwards. Config gets the same pipeline as code, and schema changes are expand–contract so code can always roll back."

---

## 3. Incident severity, triage, mitigation, and communication

**In one sentence:** an incident is handled by **classifying severity** by user impact, **triaging** quickly (what's broken, for whom, since when, what changed), **mitigating first** (stop the bleeding — rollback, failover, disable, scale) before finding the root cause, with clear **roles** and **regular communication** to stakeholders and customers.

### In plain words
At an accident scene, paramedics first stop the bleeding and get the patient to hospital. They don't investigate why the car crashed before treating the patient. Someone also has to tell the family what's going on.

### How it works
**Severity levels (example)**
| Sev | Meaning | Response |
|---|---|---|
| **SEV1** | critical: core feature down for many users, data loss, security breach | page immediately, incident commander, exec + customer comms, postmortem required |
| **SEV2** | major: significant degradation or a key feature down for some users | page, IC, status page, postmortem |
| **SEV3** | minor: limited impact, workaround exists | business hours, ticket |
| **SEV4** | cosmetic / no user impact | backlog |

**Roles (Incident Command System, as used by Google, PagerDuty, Atlassian)**
- **Incident commander (IC):** coordinates, decides, delegates — doesn't debug.
- **Operations / subject-matter experts:** investigate and act.
- **Communications lead:** status page, stakeholder updates, customer support.
- **Scribe:** timeline in the incident channel.

**Triage questions:** What's the user impact (who, how many, which regions)? When did it start? **What changed** around then (deploys, config, flags, traffic, dependency status)? Is it getting worse?

**Mitigation options (fastest first):** roll back the last change, turn off a feature flag, fail over to another region/replica, shed or rate-limit load, scale up, block a bad client, restart (last resort — destroys evidence; take a heap dump first if you can).

**Communication:** declare the incident early (it's cheap to downgrade); updates at a fixed cadence (e.g. every 30 min) even if "no news": impact, what we're doing, next update time.

#### Modern C++ example — severity classification and a mitigation-first triage checklist
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Signal { std::string feature; bool core; double users_affected_pct; bool data_loss; bool security; bool workaround; };

int severity(const Signal& s) {
    if (s.data_loss || s.security || (s.core && s.users_affected_pct >= 20)) return 1;
    if (s.core && s.users_affected_pct >= 1) return 2;
    if (s.users_affected_pct > 0 && !s.workaround) return 2;
    if (s.users_affected_pct > 0) return 3;
    return 4;
}

struct Change { std::string what; int minutes_before_start; bool reversible; };

int main() {
    std::vector<Signal> signals{
        {"checkout", true, 18, false, false, false},
        {"login", true, 35, false, false, false},
        {"profile avatars", false, 60, false, false, true},
        {"export reports", false, 0.5, false, false, false},
        {"orders db", true, 0.1, true, false, false},
    };
    for (auto& s : signals) std::cout << "SEV" << severity(s) << "  " << s.feature << " (" << s.users_affected_pct << "% users)\n";

    std::vector<Change> recent{{"config v83 pushed", 2, true}, {"deploy payments 2.4.1", 45, true}, {"traffic +8%", 0, false}};
    std::cout << "triage for checkout SEV2: suspect the most recent reversible change first\n";
    for (auto& c : recent)
        if (c.reversible && c.minutes_before_start <= 60) { std::cout << "  MITIGATE: roll back \"" << c.what << "\" (" << c.minutes_before_start << " min before start)\n"; break; }
    std::cout << "  then: post status update, next update in 30 min; root cause after recovery\n";
}
```

**Output:**
```text
SEV2  checkout (18% users)
SEV1  login (35% users)
SEV3  profile avatars (60% users)
SEV2  export reports (0.5% users)
SEV1  orders db (0.1% users)
triage for checkout SEV2: suspect the most recent reversible change first
  MITIGATE: roll back "config v83 pushed" (2 min before start)
  then: post status update, next update in 30 min; root cause after recovery
```

### Interview answer
"I classify severity by user impact — core feature, share of users, data loss or security — and declare early, since downgrading is cheap. An incident commander coordinates while experts investigate and a comms lead updates the status page on a fixed cadence. Triage asks who's affected, since when and what changed, and I mitigate before diagnosing: roll back the most recent change, flip a flag, fail over or shed load. Root cause comes after users are safe, and the scribe's timeline feeds the postmortem."

---

## 4. On-call handoffs, runbooks, escalation, and ownership

**In one sentence:** every service has a clear **owning team** with a sustainable **on-call rotation**, **handoffs** that pass on open issues, **runbooks** linked from each alert with exact steps, and an **escalation policy** that guarantees someone responds if the first person doesn't.

### In plain words
A hospital ward at shift change: the outgoing nurse tells the incoming one which patients need attention. There are written procedures for emergencies. If a nurse doesn't answer a call, it goes to the senior nurse, then the doctor.

### How it works
- **Ownership:** a service catalog (Backstage, OpsLevel, a simple YAML) lists the owning team, on-call schedule, dashboards, runbooks and dependencies. "You build it, you run it."
- **Sustainable on-call:** at least 6–8 people per rotation (Google SRE suggests a maximum of ~25% of time on-call); primary + secondary; compensate or give time off; track pages per shift — more than ~2 incidents per shift means fix the system.
- **Handoff:** a short written note at each rotation change: ongoing incidents, flaky alerts, risky changes coming, silenced alerts and why.
- **Runbooks:** one per alert — what it means, how to confirm, **mitigation steps with exact commands**, how to escalate, links to dashboards. Keep them tested and updated after each incident; automate steps that are always the same.
- **Escalation policy:** page primary → after N minutes unacknowledged, page secondary → then the team lead / manager; separate paths for security and customer-facing incidents. Tools: PagerDuty, Opsgenie, Grafana OnCall, incident.io.

**Runbook template**
```text
Alert: CheckoutErrorBudgetBurnFast        Owner: payments team        Severity: SEV2 by default
Meaning:   checkout 5xx error rate burning the 30-day budget >14x for 1h and 5m
Confirm:   dashboard "Checkout / RED" -> errors by region and version
Mitigate:  1. If a deploy/config change in the last 60 min: roll back  (deployctl rollback payments)
           2. If one region: shift traffic away                            (trafficctl drain eu-west-1)
           3. If DB pool saturated: raise pool to 40 via flag `payments.pool_size`
Escalate:  no improvement in 20 min -> page payments secondary + DB on-call
Afterwards: open an incident doc; keep the timeline in #inc-checkout
```

#### Modern C++ example — an escalation policy simulated over time
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <string>
#include <vector>

struct Level { std::string who; int wait_min; };          // page `who`, wait this long for an ack

std::string escalate(const std::vector<Level>& policy, std::optional<std::pair<std::string, int>> ack) {
    int t = 0;
    std::string log;
    for (const auto& l : policy) {
        log += "  t=" + std::to_string(t) + "m page " + l.who + "\n";
        if (ack && ack->first == l.who && ack->second <= t + l.wait_min)
            return log + "  t=" + std::to_string(ack->second) + "m ACK by " + l.who + "\n";
        t += l.wait_min;
    }
    return log + "  t=" + std::to_string(t) + "m nobody acked -> page the incident-management team\n";
}

int main() {
    std::vector<Level> policy{{"primary (mona)", 5}, {"secondary (omar)", 10}, {"team lead (lina)", 15}};
    std::cout << "primary acks after 3 min:\n" << escalate(policy, std::pair{std::string("primary (mona)"), 3});
    std::cout << "primary asleep, secondary acks at minute 9:\n" << escalate(policy, std::pair{std::string("secondary (omar)"), 9});
    std::cout << "nobody answers:\n" << escalate(policy, std::nullopt);
}
```

**Output:**
```text
primary acks after 3 min:
  t=0m page primary (mona)
  t=3m ACK by primary (mona)
primary asleep, secondary acks at minute 9:
  t=0m page primary (mona)
  t=5m page secondary (omar)
  t=9m ACK by secondary (omar)
nobody answers:
  t=0m page primary (mona)
  t=5m page secondary (omar)
  t=15m page team lead (lina)
  t=30m nobody acked -> page the incident-management team
```

### Interview answer
"Every service has an owning team in a service catalog with its on-call schedule, dashboards and runbooks. On-call should be sustainable — enough people, primary and secondary, and a cap on pages per shift — with a written handoff at each rotation. Each alert links a runbook with meaning, confirmation and exact mitigation steps, and an escalation policy pages the secondary and then a lead if nobody acknowledges within minutes."

---

## 5. Reliability-related architectural trade-offs

**In one sentence:** reliability isn't free — every design choice trades it against **consistency, latency, cost, complexity and speed of change**, so make the trade-offs **explicit**, tied to the **SLO and business impact**, and revisit them as the system grows.

### In plain words
A car with two engines is less likely to break down, but it's heavier, costs more and needs more maintenance. Whether it's worth it depends on whether you're delivering pizza or flying over the ocean.

### How it works
| Decision | More reliable option | Cost |
|---|---|---|
| **Replication** | synchronous replication (no data loss on failover) | higher write latency; unavailable if replica is down |
| | asynchronous replication | possible data loss (RPO > 0) on failover |
| **Consistency** (CAP / PACELC) | availability during partitions (AP) | stale or conflicting reads |
| | strong consistency (CP) | errors/latency during partitions |
| **Footprint** | multi-AZ → multi-region active-active | 2–3× cost; data conflicts; complex ops |
| **Coupling** | async messaging (queue between services) | eventual consistency, harder debugging |
| | sync calls | simpler, but availability multiplies along the chain |
| **Caching** | serve stale on failure | users may see old data |
| **Architecture** | monolith (fewer moving parts) vs. microservices (fault isolation, independent deploys) | microservices add network failures and ops overhead |
| **Dependencies** | build in-house vs. managed service | managed: someone else's outages; in-house: your engineers' time |
| **Release speed** | slower, staged rollouts | features reach users later |

- **"How much reliability?"** — the SLO decides. Each extra nine costs roughly 10× more; 99.99% is pointless if users reach you over a 99% mobile network.
- **Cell-based architecture / sharding** limits blast radius at the cost of routing complexity.
- Write decisions down as **ADRs** (Architecture Decision Records) with the trade-off and the conditions that would change it.

#### Modern C++ example — sync vs. async replication: latency cost vs. data lost on failover
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>

int main() {
    const double local_write_ms = 2.0, cross_az_rtt_ms = 1.5, cross_region_rtt_ms = 70.0;
    const double writes_per_s = 2000, async_lag_s = 0.5;          // typical async replication lag
    std::cout << std::fixed << std::setprecision(1);
    std::cout << "sync replica in another AZ:     write latency " << local_write_ms + cross_az_rtt_ms << " ms, data lost on failover 0 writes\n";
    std::cout << "sync replica in another region: write latency " << local_write_ms + cross_region_rtt_ms << " ms, data lost on failover 0 writes\n";
    std::cout << "async replica in another region: write latency " << local_write_ms << " ms, data lost on failover ~"
              << static_cast<int>(writes_per_s * async_lag_s) << " writes (RPO ~" << async_lag_s << " s)\n";
    std::cout << "common choice: sync within the region (across AZs), async to the DR region\n";
}
```

**Output:**
```text
sync replica in another AZ:     write latency 3.5 ms, data lost on failover 0 writes
sync replica in another region: write latency 72.0 ms, data lost on failover 0 writes
async replica in another region: write latency 2.0 ms, data lost on failover ~1000 writes (RPO ~0.5 s)
common choice: sync within the region (across AZs), async to the DR region
```

### Interview answer
"I treat reliability as a trade-off against consistency, latency, cost and complexity, sized by the SLO and the business impact of failure — each extra nine costs about ten times more. Examples: synchronous replication avoids data loss but adds latency and couples availability, so a common choice is synchronous across zones and asynchronous to a DR region; async messaging removes hard dependencies but makes the system eventually consistent; cells limit blast radius but add routing. I record these decisions in ADRs with the conditions that would change them."

---

## 6. Root-cause analysis: timelines, hypotheses, and evidence

**In one sentence:** find out **why** an incident happened by building a precise **timeline** from logs, metrics, deploys and chat, forming **hypotheses** that explain **all** the evidence, **testing** them (data or reproduction), and going beyond the trigger to the **contributing factors** — using tools like the **5 Whys** and fishbone diagrams carefully.

### In plain words
Like a detective: collect the facts in order, suggest suspects, check each suspect's alibi against the facts, and only accept the explanation that fits **everything** — not the first one that sounds good.

### How it works
1. **Timeline:** UTC timestamps for symptoms (metrics), changes (deploys, config, flags, infra), alerts, human actions. Sources: deploy logs, audit logs, metrics, traces, chat.
2. **Scope the symptom:** which users/regions/versions/endpoints; when exactly it started and ended (the "first bad minute").
3. **Hypotheses:** list several ("config change", "traffic spike", "dependency failure", "certificate expiry"). For each: what would we expect to see if it were true?
4. **Test against evidence:** keep hypotheses that explain **all** observations (e.g. EU-only, started 2 min after config v83, stopped at rollback), discard those that contradict any.
5. **Confirm:** reproduce in staging, or show that reverting the change fixed it (and re-applying would break it).
6. **Dig deeper:** the trigger (config) is not the end — **why** was a bad config possible to ship? (5 Whys → missing validation, no staged rollout.) Avoid stopping at "human error".
- Beware **confirmation bias** and **correlation ≠ causation** (two things happening at the same time).

#### Modern C++ example — merging sources into a timeline and testing hypotheses against every observation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Event { int t; std::string source, what; };
struct Observation { std::string fact; };
struct Hypothesis { std::string name; std::function<bool(const std::string&)> explains; };

int main() {
    std::vector<Event> timeline{
        {1402, "metrics", "EU checkout errors rise to 18%"},
        {1400, "deploy-log", "config v83 pushed globally (pool_size=10)"},
        {1345, "deploy-log", "frontend 7.1 deployed"},
        {1409, "pager", "burn-rate alert pages on-call"},
        {1438, "deploy-log", "config rolled back to v82"},
        {1449, "metrics", "EU error rate back to normal"},
        {1405, "metrics", "US error rate unchanged"},
    };
    std::sort(timeline.begin(), timeline.end(), [](auto& a, auto& b) { return a.t < b.t; });
    std::cout << "timeline (UTC):\n";
    for (auto& e : timeline) std::cout << "  " << e.t / 100 << ':' << (e.t % 100 < 10 ? "0" : "") << e.t % 100 << "  [" << e.source << "] " << e.what << '\n';

    std::vector<Observation> obs{{"started 14:02"}, {"EU only"}, {"ended after config rollback"}, {"no traffic spike"}};
    std::vector<Hypothesis> hyps{
        {"frontend 7.1 deploy", [](auto& f) { return f != "started 14:02" && f != "ended after config rollback"; }},   // too early, not rolled back
        {"traffic spike", [](auto& f) { return f != "no traffic spike"; }},
        {"config v83 pool_size too small for EU load", [](auto&) { return true; }},
    };
    for (auto& h : hyps) {
        std::vector<std::string> contradicted;
        for (auto& o : obs) if (!h.explains(o.fact)) contradicted.push_back(o.fact);
        std::cout << (contradicted.empty() ? "KEEP    " : "DISCARD ") << h.name;
        if (!contradicted.empty()) { std::cout << " (contradicts:"; for (auto& c : contradicted) std::cout << " '" << c << "'"; std::cout << ')'; }
        std::cout << '\n';
    }
    std::cout << "5 whys: bad pool size -> no load-based validation -> config skips canary -> config not treated as code\n";
}
```

**Output:**
```text
timeline (UTC):
  13:45  [deploy-log] frontend 7.1 deployed
  14:00  [deploy-log] config v83 pushed globally (pool_size=10)
  14:02  [metrics] EU checkout errors rise to 18%
  14:05  [metrics] US error rate unchanged
  14:09  [pager] burn-rate alert pages on-call
  14:38  [deploy-log] config rolled back to v82
  14:49  [metrics] EU error rate back to normal
DISCARD frontend 7.1 deploy (contradicts: 'started 14:02' 'ended after config rollback')
DISCARD traffic spike (contradicts: 'no traffic spike')
KEEP    config v83 pool_size too small for EU load
5 whys: bad pool size -> no load-based validation -> config skips canary -> config not treated as code
```

### Interview answer
"I start with a precise UTC timeline merged from metrics, deploy and audit logs, alerts and chat, and scope the symptom — who, where, exactly when. Then I list several hypotheses, write down what each predicts, and keep only those consistent with all the evidence, confirming the winner by reproduction or by showing the rollback fixed it. I go past the trigger with 5 Whys to the contributing factors — why the bad change could ship — and stay alert to confirmation bias and coincidental timing."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Postmortem | blameless; impact, detection, timeline, contributing factors, went well/badly, owned + dated action items, tracked |
| Not a root cause | "human error", "be more careful" |
| Safe changes | small, reviewed, tested; canary / progressive / cell by cell with automated analysis + auto-rollback |
| Feature flags | deploy ≠ release; kill switches; sticky % via hashing; remove old flags |
| Config & schema | config is code (same pipeline); expand–contract schema changes |
| Severity | by user impact: SEV1 core down / data loss / security … SEV4 cosmetic; declare early |
| Roles | incident commander, ops/SMEs, comms lead, scribe |
| Mitigate first | roll back, flag off, fail over, shed load, scale; root cause later |
| Comms | fixed cadence: impact, actions, next update time |
| On-call | owning team, ≥ 6–8 people, primary + secondary, handoff notes, page budget |
| Runbooks | one per alert: meaning, confirm, exact mitigation, escalate |
| Escalation | primary → secondary → lead after N min unacked |
| Trade-offs | each nine ≈ 10× cost; sync vs. async replication; CP vs. AP; cells; ADRs |
| RCA | timeline → scope → hypotheses → test against **all** evidence → confirm → 5 Whys to contributing factors |
