# Multi-Agent Systems — When Several Agents Beat One, and How to Keep Them Coordinated

> **What you'll learn:**
> - how agents **communicate with typed message contracts**;
> - why you should **avoid unnecessary agents**;
> - how to handle **conflicting answers**;
> - how **handoffs and delegation** assign ownership;
> - how to run **parallel agents** without races and merge their results;
> - how to split **shared vs. agent-specific state**;
> - the **single- vs. multi-agent** trade-offs;
> - the **supervisor/worker and coordinator/specialist** patterns.
>
> Each part has a runnable C++ example.
>
> **Prerequisites:** [Agentic Frameworks and Orchestration](./Agentic-Frameworks-and-Orchestration.md) and [Memory, State, and Context Management](./Memory-State-and-Context-Management.md).

## Table of Contents
1. [Agent-to-agent communication and typed message contracts](#1-agent-to-agent-communication-and-typed-message-contracts)
2. [Avoiding unnecessary agent proliferation and coordination overhead](#2-avoiding-unnecessary-agent-proliferation-and-coordination-overhead)
3. [Conflicting answers, arbitration, and consensus limits](#3-conflicting-answers-arbitration-and-consensus-limits)
4. [Handoffs, delegation, and task ownership](#4-handoffs-delegation-and-task-ownership)
5. [Parallel agents, race conditions, and result aggregation](#5-parallel-agents-race-conditions-and-result-aggregation)
6. [Shared state vs. agent-specific state](#6-shared-state-vs-agent-specific-state)
7. [Single-agent vs. multi-agent trade-offs](#7-single-agent-vs-multi-agent-trade-offs)
8. [Supervisor/worker and coordinator/specialist patterns](#8-supervisorworker-and-coordinatorspecialist-patterns)
9. [Cheat sheet](#cheat-sheet)

Suggested order: **7 → 2 → 8 → 4 → 1 → 6 → 5 → 3**.

---

## 1. Agent-to-agent communication and typed message contracts

**In one sentence:** agents should exchange **structured, typed messages**: task requests, results, errors, status. They need explicit fields (task ID, sender and recipient, goal, inputs, constraints, deadline, result schema, confidence, sources), validated at every hop, instead of free-form chat. Then each agent knows exactly what it's being asked, and orchestration code can route, retry and audit.

### In plain words
Departments in a company communicate with standard forms (purchase requests, delivery notes) instead of chatty emails, so nothing is lost or misunderstood between teams.

### How it works
- **Message types:**
  - `TaskRequest {task_id, parent_id, from, to, goal, inputs, constraints, budget, deadline, expected_output_schema}`.
  - `TaskResult {task_id, status: ok|partial|failed, output, confidence, sources, cost}`.
  - `Error {task_id, code, retryable, message}`.
- **Validate** on send and on receive (JSON Schema/Pydantic). Reject or repair malformed messages. Version the contracts ([tool contracts](./Tool-Use-Integrations-and-Protocols.md#7-tool-argument-schemas-and-inputoutput-contracts)).
- **Context passing:** send only what the receiver needs: the task, the relevant facts and references (IDs) to shared artifacts. Don't send the whole transcript. This keeps tokens down and avoids leaking irrelevant data.
- **Transport:** in-process function calls (same graph), queues/events (distributed), or protocols.
  - **A2A (Agent2Agent)** handles cross-vendor agent interoperability through agent cards, tasks and messages/artifacts.
  - **MCP** handles agent-to-tool communication ([MCP](./Tool-Use-Integrations-and-Protocols.md#5-model-context-protocol-mcp-clients-servers-tools-and-resources)).
- Treat messages from other agents as **untrusted input** if they process external content. Injection can propagate between agents.

#### Modern C++ example — typed task request/result messages validated at the boundary between a coordinator and a specialist
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <string>
#include <vector>

struct TaskRequest { std::string task_id, from, to, goal; std::vector<std::string> input_refs; int budget_tokens = 0; std::string output_schema; };
struct TaskResult { std::string task_id, status; std::string output; double confidence = 0; std::vector<std::string> sources = {}; };

std::optional<std::string> validate(const TaskRequest& r) {
    if (r.task_id.empty() || r.goal.empty()) return "task_id and goal are required";
    if (r.budget_tokens <= 0 || r.budget_tokens > 50'000) return "budget_tokens must be in (0, 50000]";
    if (r.output_schema.empty()) return "output_schema is required";
    return std::nullopt;
}
std::optional<std::string> validate(const TaskResult& r, const TaskRequest& req) {
    if (r.task_id != req.task_id) return "result for unknown task " + r.task_id;
    if (r.status == "ok" && r.sources.empty()) return "ok results must cite sources";
    if (r.confidence < 0 || r.confidence > 1) return "confidence must be in [0,1]";
    return std::nullopt;
}

TaskResult pricing_specialist(const TaskRequest& r) { return {r.task_id, "ok", R"({"cheapest":"Plan B","monthly_egp":450})", 0.86, {"doc:pricing-2026"}}; }

int main() {
    TaskRequest bad{"t-7", "coordinator", "pricing", "", {}, 0, ""};
    if (auto e = validate(bad)) std::cout << "rejected request: " << *e << '\n';

    TaskRequest req{"t-8", "coordinator", "pricing", "Find the cheapest plan with 5 seats", {"artifact:requirements-v2"}, 8000, "{cheapest:string, monthly_egp:number}"};
    if (!validate(req)) {
        auto res = pricing_specialist(req);
        auto err = validate(res, req);
        std::cout << "result " << res.task_id << " [" << res.status << ", conf " << res.confidence << "]: " << res.output << " sources=" << res.sources[0] << (err ? " INVALID: " + *err : " (valid)") << '\n';
    }
    TaskResult no_sources{"t-8", "ok", "Plan C", 0.9};
    if (auto e = validate(no_sources, req)) std::cout << "rejected result: " << *e << '\n';
}
```

**Output:**
```text
rejected request: task_id and goal are required
result t-8 [ok, conf 0.86]: {"cheapest":"Plan B","monthly_egp":450} sources=doc:pricing-2026 (valid)
rejected result: ok results must cite sources
```

### Interview answer
"Agents should talk through typed contracts, not free-form chat. A task request carries the task ID, parent, sender and recipient, goal, inputs passed as references to shared artifacts, constraints, budget, deadline and the expected output schema. A result carries status, output, confidence, sources and cost, and errors carry a code and a retryable flag. Messages are validated on both sides and versioned. Only the context the receiver needs is passed. Transport can be in-process, queues, or protocols like A2A for cross-vendor agents and MCP for tools. Inter-agent messages are treated as untrusted when upstream agents read external content, because injections propagate."

---

## 2. Avoiding unnecessary agent proliferation and coordination overhead

**In one sentence:** every extra agent adds model calls, latency, cost, failure points, context handoffs (information loss) and debugging complexity, so **start with one agent and good tools**. Split into multiple agents only when there's a clear reason: context overload, genuinely independent parallel work, distinct permissions or security boundaries, or separately owned and evaluated capabilities. Measure the gain.

### In plain words
Adding more people to a small job often slows it down: more meetings, more hand-offs, more "I thought you were doing that". Hire a team only when the work genuinely can't fit one person.

### How it works
**Signs you *don't* need another agent**
- The "agent" is really a single prompt or a tool (e.g. "summarizer agent" → just a function).
- The agents always run in a fixed sequence, so you have a **workflow**, not agents ([workflow vs. agent](./Agentic-Frameworks-and-Orchestration.md#10-workflow-orchestration-vs-agent-orchestration)).
- The agents mostly pass the same context back and forth.
- Performance didn't improve on the eval set.

**Good reasons to split**
- **Context limits:** one agent's tools and instructions are too many, and selection quality drops.
- **Parallelism:** independent sub-tasks (research several sources at once).
- **Isolation:** different permissions, such as a read-only researcher vs. a writer with approvals, or a quarantined reader of untrusted content ([security](./Security-Privacy-and-Safety.md#6-prompt-injection-direct-and-indirect-attacks-via-retrieved-contenttools)).
- **Ownership:** separate teams evaluate and release separately.

**Overhead math:** coordinator calls + worker calls + aggregation call. Multi-agent research systems can use **several times more tokens** than a single agent. That's worth it only when the task value justifies it.

#### Modern C++ example — estimate cost, latency and failure probability for 1 agent vs. N agents, and compare with the measured quality gain
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>

int main() {
    const double cost_per_call = 0.02, call_latency_s = 3.0, call_failure = 0.02;
    std::cout << std::fixed << std::setprecision(2);
    struct Design { const char* name; int sequential_calls, parallel_workers, calls_per_worker; double success_rate; };
    for (Design d : {Design{"single agent (6 tool loops)", 6, 0, 0, 0.84}, Design{"coordinator + 4 parallel workers", 2, 4, 4, 0.87},
                     Design{"chain of 5 agents (sequential)", 15, 0, 0, 0.83}}) {
        int calls = d.sequential_calls + d.parallel_workers * d.calls_per_worker;
        double latency = (d.sequential_calls + d.calls_per_worker) * call_latency_s;
        double p_any_failure = 1 - std::pow(1 - call_failure, calls);
        std::cout << d.name << ": " << calls << " calls, $" << calls * cost_per_call << ", ~" << latency << "s, P(some call fails) "
                  << p_any_failure << ", task success " << d.success_rate << '\n';
    }
    std::cout << "verdict: the parallel design buys +3 pts for 3x the cost; the sequential chain costs more and is worse -> don't build it\n";
}
```

**Output:**
```text
single agent (6 tool loops): 6 calls, $0.12, ~18.00s, P(some call fails) 0.11, task success 0.84
coordinator + 4 parallel workers: 18 calls, $0.36, ~18.00s, P(some call fails) 0.30, task success 0.87
chain of 5 agents (sequential): 15 calls, $0.30, ~45.00s, P(some call fails) 0.26, task success 0.83
verdict: the parallel design buys +3 pts for 3x the cost; the sequential chain costs more and is worse -> don't build it
```

Whether +3 points is worth 3× the cost and 3× the failure exposure depends on the value of each task. That's a business decision, made with the numbers.

### Interview answer
"I start with a single agent and well-designed tools, because every extra agent adds calls, latency, cost, failure points and information loss at handoffs, and makes debugging harder. I split only for a concrete reason: the tool set or instructions overload one context, there's genuinely parallel independent work, different permissions call for isolation such as a quarantined reader of untrusted content, or capabilities are owned and evaluated by different teams. Even then I measure the quality gain against cost and latency on the eval set. If agents always run in a fixed order, it's really a workflow and should be built as one."

---

## 3. Conflicting answers, arbitration, and consensus limits

**In one sentence:** when agents (or multiple samples) disagree, resolve it with an explicit policy:
- **evidence-based arbitration**: prefer the answer with verifiable sources or tool-checked facts;
- **weighted voting** by calibrated confidence or specialist authority;
- a **judge/arbiter** agent with a rubric;
- **escalation to a human** when stakes are high or disagreement persists.

Remember the limits of consensus: agents built on the **same model share the same blind spots**, and **majority ≠ truth**.

### In plain words
Two doctors disagree. You don't just count votes: you look at the test results, ask the specialist for that organ, and if it's a serious decision and they still disagree, you get a senior consultant.

### How it works
| Strategy | When | Caveat |
|---|---|---|
| **Verify with tools** | facts that can be checked (DB, calculator, docs) | best option when available |
| **Evidence-weighted** | answers with citations | verify the citations ([grounding](./Retrieval-Augmented-Generation.md#5-grounded-responses-source-citations-and-abstention-when-evidence-is-missing)) |
| **Authority** | one agent owns the domain (pricing agent for prices) | define ownership up front |
| **Voting / self-consistency** | many independent samples of reasoning tasks | correlated errors; ties |
| **Judge / debate** | open-ended answers | judge bias ([LLM-as-judge](./Evaluation-and-Testing.md#7-llm-as-judge-rubrics-calibration-bias-and-limitations)); debate can amplify confident wrong answers |
| **Escalate** | high stakes, low agreement, policy questions | human cost; route with context |

- **Consensus limits:** agreement among copies of the same model is weak evidence. Diversify (different models, prompts, data sources) when you rely on agreement. Track **disagreement rate** as a signal of uncertainty and a good source of eval cases.

#### Modern C++ example — arbitration: verified answers win, then evidence-weighted votes, else escalate on low agreement
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

struct Answer { std::string agent, value; double confidence; bool has_citation; bool tool_verified; };

std::string arbitrate(const std::vector<Answer>& answers) {
    for (auto& a : answers) if (a.tool_verified) return "'" + a.value + "' (tool-verified by " + a.agent + ")";
    std::map<std::string, double> score; double total = 0;
    for (auto& a : answers) { double w = a.confidence * (a.has_citation ? 1.0 : 0.5); score[a.value] += w; total += w; }
    std::string best; double bs = 0;
    for (auto& [v, s] : score) if (s > bs) { bs = s; best = v; }
    double agreement = bs / total;
    std::ostringstream os; os << std::fixed << std::setprecision(2) << agreement;
    if (agreement < 0.6) return "ESCALATE to human (agreement " + os.str() + ")";
    return "'" + best + "' (weighted agreement " + os.str() + ")";
}

int main() {
    std::cout << "refund window: " << arbitrate({{"policy_agent", "14 days", 0.8, true, false}, {"support_agent", "30 days", 0.7, false, false}, {"faq_agent", "14 days", 0.6, true, false}}) << '\n';
    std::cout << "order total:   " << arbitrate({{"agent_a", "1,250 EGP", 0.9, false, false}, {"agent_b", "1,520 EGP", 0.6, false, true}}) << '\n';
    std::cout << "contract risk: " << arbitrate({{"legal_agent", "high", 0.6, true, false}, {"finance_agent", "low", 0.7, true, false}, {"ops_agent", "medium", 0.5, true, false}}) << '\n';
}
```

**Output:**
```text
refund window: '14 days' (weighted agreement 0.80)
order total:   '1,520 EGP' (tool-verified by agent_b)
contract risk: ESCALATE to human (agreement 0.39)
```

Note the second case: the **more confident** agent was wrong, and the tool check overrode it.

### Interview answer
"I resolve disagreements with an explicit policy instead of letting agents argue indefinitely. First, verify with tools where facts are checkable. Then weigh evidence: cited, verified sources beat unsupported claims. Respect domain ownership, so the pricing agent owns prices. For open-ended questions, use a calibrated judge or confidence-weighted voting. Escalate to a human when stakes are high or agreement is low. I'm careful with consensus: copies of the same model share blind spots, so agreement is weak evidence unless models, prompts or data sources are diverse. I track the disagreement rate as an uncertainty signal and a source of eval cases."

---

## 4. Handoffs, delegation, and task ownership

**In one sentence:** in a **handoff**, one agent **transfers control** of the conversation to another, more suitable agent: triage → billing specialist. In **delegation**, the delegating agent **keeps ownership** and assigns a subtask whose result comes back to it. Either way, make **ownership explicit**: exactly one owner per task at any time, a handoff package with the needed context, and clear rules for returning, escalating to humans, and timeouts.

### In plain words
- Handoff: a receptionist transfers your call to the billing department, and billing now owns your issue.
- Delegation: your manager asks a colleague to pull some numbers, but your manager still owns the report.
- In both cases, someone must clearly be responsible, so nothing falls through the cracks.

### How it works
| | Handoff | Delegation (agent-as-tool) |
|---|---|---|
| Control after | moves to the receiver | stays with the caller |
| User talks to | the new agent | the original agent |
| Result | receiver continues to the end (or hands back) | returned to the caller as a tool result |
| Examples | triage → refunds agent; bot → human agent | planner calls `research_agent(query)` |

- **Handoff package:** a summary of the conversation, the user's goal, collected facts (order ID, verified identity), what has been tried, and why it's being handed off. **Don't make the user repeat themselves.**
- **Ownership record:** `task_id → owner, state, since`. Transfers are atomic and recorded, so you never get two owners (or zero).
- **Rules:**
  - Allowed transitions (a graph of who can hand off to whom).
  - Max handoffs (to prevent ping-pong).
  - Timeouts with fallback.
  - Human escalation as a first-class handoff target ([human-in-the-loop](./Agent%20Fundamentals%20and%20Decision-Making/Human-in-the-loop%20reviews%2C%20approvals%20and%20escalation.md)).
- Frameworks: OpenAI Agents SDK handoffs, LangGraph `Command(goto=...)` / swarm patterns, and agents-as-tools.

#### Modern C++ example — an ownership registry with allowed handoffs, a handoff package, a ping-pong limit, and delegation that keeps ownership
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

struct HandoffPackage { std::string summary, user_goal, facts, reason; };

class Ownership {
    std::map<std::string, std::string> owner_;
    std::map<std::string, int> handoffs_;
    std::map<std::string, std::set<std::string>> allowed_{{"triage", {"billing", "shipping", "human"}}, {"billing", {"human", "shipping"}}, {"shipping", {"billing", "human"}}};
public:
    void open(const std::string& task, const std::string& agent) { owner_[task] = agent; }
    std::string handoff(const std::string& task, const std::string& to, const HandoffPackage& p) {
        auto from = owner_[task];
        if (!allowed_[from].count(to)) return "REJECTED " + from + " -> " + to + " (not an allowed transition)";
        if (++handoffs_[task] > 2 && to != "human") { owner_[task] = "human"; return "LIMIT: too many handoffs -> escalated to human"; }
        owner_[task] = to;
        return from + " -> " + to + " | package: goal='" + p.user_goal + "' facts='" + p.facts + "' reason='" + p.reason + "'";
    }
    const std::string& owner(const std::string& task) { return owner_[task]; }
};

std::string delegate_research(const std::string& q) { return "research result for '" + q + "'"; }       // agent-as-tool: returns to caller

int main() {
    Ownership o;
    o.open("T-1", "triage");
    HandoffPackage p{"customer charged twice for order 1042", "get refund for duplicate charge", "order=1042, verified=yes", "billing issue"};
    std::cout << o.handoff("T-1", "billing", p) << '\n';
    std::cout << "billing delegates: " << delegate_research("duplicate charge policy") << " (owner still " << o.owner("T-1") << ")\n";
    std::cout << o.handoff("T-1", "shipping", {"", "", "", "maybe shipping?"}) << '\n';
    std::cout << o.handoff("T-1", "billing", {"", "", "", "back to billing"}) << '\n';
    std::cout << "owner now: " << o.owner("T-1") << '\n';
    o.open("T-2", "billing");
    std::cout << o.handoff("T-2", "triage", p) << '\n';
}
```

**Output:**
```text
triage -> billing | package: goal='get refund for duplicate charge' facts='order=1042, verified=yes' reason='billing issue'
billing delegates: research result for 'duplicate charge policy' (owner still billing)
billing -> shipping | package: goal='' facts='' reason='maybe shipping?'
LIMIT: too many handoffs -> escalated to human
owner now: human
REJECTED billing -> triage (not an allowed transition)
```

The billing → shipping handoff also shows a **bad package**: an empty goal and facts. In a real system the contract validation from [section 1](#1-agent-to-agent-communication-and-typed-message-contracts) would reject it.

### Interview answer
"A handoff transfers control — triage to the billing agent, or the bot to a human — so the receiver now owns the task and talks to the user. Delegation keeps ownership with the caller, which uses another agent like a tool and gets a result back. Either way I make ownership explicit: one owner per task in a registry with atomic, logged transfers; a handoff package with the goal, collected facts, what was tried and why, so users never repeat themselves; an allowed-transitions graph; a cap on handoffs to stop ping-pong; timeouts; and human escalation as a first-class target."

---

## 5. Parallel agents, race conditions, and result aggregation

**In one sentence:** running agents **in parallel** cuts latency for independent sub-tasks, but introduces:
- **races**: concurrent writes to shared state, duplicate side effects, order-dependent results;
- **partial failures**;
- the challenge of **aggregating** results: merge, deduplicate, resolve conflicts, cite.

So give each worker its own output slot, merge with **deterministic reducers**, keep side effects out of parallel workers (or serialize and idempotency-key them), and define timeout and partial-result policies.

### In plain words
Four researchers each read a different stack of papers at the same time. Each writes their notes on their own card (not all on one whiteboard at once), and then one editor merges the cards into a single report, noting where they disagree.

### How it works
- **Fan-out / fan-in:** the coordinator splits the task, workers run concurrently with bounded concurrency, and an aggregator merges ([map-reduce](./Agentic-Frameworks-and-Orchestration.md#2-conditional-branching-map-reduce-parallel-fan-out-and-fan-in)).
- **Avoid races:**
  - **Per-worker output keys** plus reducers (append and merge), not shared mutable variables.
  - Optimistic concurrency for shared stores ([multi-replica consistency](./Memory-State-and-Context-Management.md#5-multi-replica-deployments-and-shared-state-consistency)).
  - Parallel workers **read-only**: let the coordinator perform writes after aggregation.
- **Deterministic aggregation:** sort by worker/task ID before merging so results don't depend on finish order. This matters for reproducibility and caching.
- **Aggregation steps:** deduplicate overlapping findings, keep provenance (which worker, which source), flag conflicts ([arbitration](#3-conflicting-answers-arbitration-and-consensus-limits)), then summarize.
- **Partial failure policy:** wait up to a deadline; continue with N of M results (and say so), retry failed shards, or fail the whole task.

#### Modern C++ example — a data race on a shared counter vs. per-worker slots merged by a deterministic reducer, with a partial-failure policy
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <algorithm>
#include <future>
#include <iostream>
#include <map>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

struct Finding { std::string worker, fact, source; };

int main() {
    // Unsafe pattern, simulated deterministically: two agents read-modify-write a shared list with this interleaving.
    std::vector<std::string> shared{"fact-0"};
    auto copy_a = shared, copy_b = shared;                                    // both agents read
    copy_a.push_back("fact-from-A"); copy_b.push_back("fact-from-B");         // both modify their copy
    shared = copy_a; shared = copy_b;                                         // both write back: A's write is lost
    std::cout << "shared list after racing writes: " << shared.size() << " items (expected 3) -> lost update\n";

    // Safe pattern: each worker returns its own result; the aggregator merges deterministically.
    std::vector<std::string> shards{"pricing", "reviews", "competitors", "regulation"};
    std::vector<std::future<std::vector<Finding>>> futures;
    for (auto& s : shards) futures.push_back(std::async(std::launch::async, [s]() -> std::vector<Finding> {
        if (s == "regulation") throw std::runtime_error("source timeout");
        if (s == "pricing") return {{s, "Plan B costs 450 EGP", "pricing.pdf"}, {s, "Free trial is 14 days", "faq"}};
        if (s == "reviews") return {{s, "Free trial is 14 days", "review-site"}, {s, "Support is slow on weekends", "review-site"}};
        return {{s, "Competitor X costs 520 EGP", "x.com/pricing"}};
    }));
    std::map<std::string, std::vector<Finding>> by_worker; std::vector<std::string> failed;
    for (std::size_t i = 0; i < shards.size(); ++i) {
        try { by_worker[shards[i]] = futures[i].get(); } catch (const std::exception& e) { failed.push_back(shards[i] + " (" + e.what() + ")"); }
    }
    std::map<std::string, std::set<std::string>> merged;                                  // fact -> sources (dedupe + provenance)
    for (auto& [w, fs] : by_worker) for (auto& f : fs) merged[f.fact].insert(w + ":" + f.source);
    std::cout << "aggregated " << merged.size() << " unique findings from " << by_worker.size() << "/" << shards.size() << " workers:\n";
    for (auto& [fact, srcs] : merged) { std::cout << "  - " << fact << " ["; bool first = true; for (auto& s : srcs) { std::cout << (first ? "" : ", ") << s; first = false; } std::cout << "]\n"; }
    for (auto& f : failed) std::cout << "  ! partial result: missing " << f << " -> state this in the report or retry the shard\n";
}
```

**Output:**
```text
shared list after racing writes: 2 items (expected 3) -> lost update
aggregated 4 unique findings from 3/4 workers:
  - Competitor X costs 520 EGP [competitors:x.com/pricing]
  - Free trial is 14 days [pricing:faq, reviews:review-site]
  - Plan B costs 450 EGP [pricing:pricing.pdf]
  - Support is slow on weekends [reviews:review-site]
  ! partial result: missing regulation (source timeout) -> state this in the report or retry the shard
```

The first line shows the lost-update race that shared mutable state invites. The "free trial" finding was reported by two workers and merged into one entry with **both sources**.

### Interview answer
"Parallel agents cut latency for independent sub-tasks but bring races, partial failures and aggregation work. I avoid races by giving each worker its own output slot and merging with deterministic reducers sorted by task ID, never shared mutable state. Parallel workers stay read-only, and the coordinator performs side effects after aggregation, with idempotency keys. Aggregation deduplicates findings while keeping provenance, flags conflicts for arbitration, then summarizes. For failures, I set a deadline and an explicit policy — retry the shard, continue with N of M results and say so, or fail the task — and cap concurrency for rate limits."

---

## 6. Shared state vs. agent-specific state

**In one sentence:**
- **Shared state** (the overall goal, plan, task board, final artifacts, key facts) is visible to all agents and has **controlled writers**.
- **Agent-specific (private) state** (each agent's scratchpad, tool results, intermediate reasoning, credentials scope) stays local.

Only distilled results get **published** to the shared state. This keeps contexts small, reduces interference, and limits data exposure.

### In plain words
A project team has a shared board with the plan, decisions and deliverables. Each person also has their own notebook for rough work. You pin your conclusions on the board, not every page of your notebook.

### How it works
| | Shared state | Agent-specific state |
|---|---|---|
| Contents | goal, plan/task board, decisions, final artifacts, verified facts | scratchpad, raw tool outputs, retries, private messages |
| Who reads | all agents (filtered by permission) | the owning agent |
| Who writes | the coordinator, or each agent to its own keys via reducers | the owning agent |
| Size | small, curated | can be large, then summarized |
| Risks | conflicts, races, context bloat, leaking data across permission boundaries | loss of information if never published |

- **LangGraph:** a parent graph state (shared) plus **subgraphs** with their own state schemas (private), mapped at the boundary. Multi-agent "swarm" or supervisor graphs pass only selected keys.
- **Publishing:** an agent returns `{summary, facts with sources, artifacts refs}` and the coordinator merges it into the shared state.
- **Permissions:** a quarantined agent that read untrusted content publishes only **constrained** outputs (e.g. validated fields), not raw text ([security](./Security-Privacy-and-Safety.md#6-prompt-injection-direct-and-indirect-attacks-via-retrieved-contenttools)).

#### Modern C++ example — private scratchpads with explicit publishing to a shared board through a reducer that only accepts curated fields
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Published { std::string agent, summary; std::vector<std::string> facts; };
struct SharedBoard { std::string goal; std::vector<std::string> facts; std::map<std::string, std::string> summaries; };

struct Agent {
    std::string name;
    std::vector<std::string> scratchpad;                                 // private: never copied to the board
    Published work() {
        scratchpad = {"raw search page 1 (4,000 tokens)", "raw search page 2 (3,500 tokens)", "retry after timeout", "draft reasoning..."};
        return {name, name + " found 2 relevant facts", {name + ": fact A [src]", name + ": fact B [src]"}};
    }
};

void publish(SharedBoard& b, const Published& p) {                       // reducer: only curated fields, size-limited
    b.summaries[p.agent] = p.summary.substr(0, 200);
    for (auto& f : p.facts) if (b.facts.size() < 20) b.facts.push_back(f);
}

int main() {
    SharedBoard board{"Compare 2 vendors for the CRM migration", {}, {}};
    std::vector<Agent> agents{{"vendor_a_researcher", {}}, {"vendor_b_researcher", {}}};
    std::size_t private_items = 0;
    for (auto& a : agents) { publish(board, a.work()); private_items += a.scratchpad.size(); }
    std::cout << "shared board: goal='" << board.goal << "', " << board.facts.size() << " facts, " << board.summaries.size() << " summaries\n";
    for (auto& f : board.facts) std::cout << "  " << f << '\n';
    std::cout << "private scratchpad items kept out of the shared context: " << private_items << '\n';
}
```

**Output:**
```text
shared board: goal='Compare 2 vendors for the CRM migration', 4 facts, 2 summaries
  vendor_a_researcher: fact A [src]
  vendor_a_researcher: fact B [src]
  vendor_b_researcher: fact A [src]
  vendor_b_researcher: fact B [src]
private scratchpad items kept out of the shared context: 8
```

### Interview answer
"I separate shared state — goal, plan or task board, decisions, verified facts with sources, and artifact references — from each agent's private state: scratchpad, raw tool outputs, retries and intermediate reasoning. Agents publish distilled results through a reducer that accepts curated, size-limited fields, and the coordinator owns writes to shared keys, which avoids races and keeps every agent's context small. In LangGraph that maps to a parent graph state with subgraphs that have their own schemas. It also enforces security boundaries: an agent that read untrusted content publishes only validated, constrained outputs."

---

## 7. Single-agent vs. multi-agent trade-offs

**In one sentence:**
- A **single agent** (one model loop with tools) is simpler, cheaper, faster to build, easier to debug, and keeps full context. It suits most tasks.
- **Multi-agent** designs help with **broad, parallelizable** work (research across many sources), **specialization** (very different tools, prompts or permissions), and **context isolation**. They pay in cost, latency, coordination failures and information loss between agents.

### In plain words
A skilled generalist handles most jobs end to end without miscommunication. A team of specialists wins on big projects with many independent parts, if someone coordinates them well.

### How it works
| | Single agent | Multi-agent |
|---|---|---|
| Complexity | low | high (protocols, ownership, aggregation) |
| Cost / tokens | lower | often several times higher |
| Latency | sequential tool loop | can be lower with parallelism, higher with chains |
| Context | one shared, can overflow | isolated per agent, but handoff losses |
| Specialization | prompt + tools in one context | tailored prompts, tools, models, permissions |
| Debugging / eval | one trajectory | many interacting trajectories |
| Best for | most support, coding and workflow tasks | breadth-first research, large analyses, separate security domains |

- **Decision path:** start single-agent → improve tools and prompts → add a **workflow** for fixed structure → introduce multiple agents when the evals show a context or parallelism bottleneck ([proliferation](#2-avoiding-unnecessary-agent-proliferation-and-coordination-overhead), [workflows vs. agents](./Agent%20Fundamentals%20and%20Decision-Making/LLM%20workflows%20vs.%20autonomous%20agents%3A%20when%20each%20is%20appropriate.md)).

#### Modern C++ example — a decision helper scoring a task's characteristics for single- vs. multi-agent design
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Task { std::string name; int independent_subtasks; int distinct_tool_domains; bool separate_permissions; bool tight_latency; bool low_value_per_task; };

std::string decide(const Task& t) {
    int multi = 0, single = 0;
    multi += t.independent_subtasks >= 3 ? 2 : 0;
    multi += t.distinct_tool_domains >= 3 ? 1 : 0;
    multi += t.separate_permissions ? 2 : 0;
    single += t.tight_latency ? 1 : 0;
    single += t.low_value_per_task ? 2 : 0;
    single += 1;                                                         // default bias: simplicity
    return multi > single ? "multi-agent (coordinator + specialists)" : "single agent with good tools";
}

int main() {
    std::vector<Task> tasks{
        {"customer support chat", 1, 2, false, true, true},
        {"market research across 10 competitors", 10, 2, false, false, false},
        {"email triage that reads untrusted mail and can send replies", 2, 2, true, false, false},
        {"code fix in one repository", 1, 2, false, false, false},
    };
    for (auto& t : tasks) std::cout << t.name << " -> " << decide(t) << '\n';
}
```

**Output:**
```text
customer support chat -> single agent with good tools
market research across 10 competitors -> multi-agent (coordinator + specialists)
email triage that reads untrusted mail and can send replies -> multi-agent (coordinator + specialists)
code fix in one repository -> single agent with good tools
```

The email case is "multi-agent" for **security** (a quarantined reader separate from the agent that can send), not for speed.

### Interview answer
"A single agent with good tools is my default: it's simpler, cheaper, keeps all context in one place and gives one trajectory to debug and evaluate, which covers most support, coding and workflow tasks. Multi-agent designs pay off for breadth-first work that parallelizes, like researching many sources, for tasks needing very different tools, prompts or models, and for security isolation such as separating a reader of untrusted content from an agent that can act. They cost more tokens, add coordination failures and lose information at handoffs, so I move to them only when evals show a context, parallelism or isolation bottleneck."

---

## 8. Supervisor/worker and coordinator/specialist patterns

**In one sentence:**
- In the **supervisor/worker** pattern, a central agent **plans, dispatches sub-tasks** to (often identical) workers, monitors them, and aggregates results.
- In the **coordinator/specialist** pattern, a coordinator **routes** each sub-task to a **specialist** with its own tools, prompt and permissions (billing, shipping, legal).

Both keep **one accountable owner** of the overall task, unlike peer-to-peer "swarms" where agents hand off among themselves.

### In plain words
- Supervisor/worker: a head chef splits an order into dishes and gives them to line cooks, checking each plate.
- Coordinator/specialist: a hospital front desk sends you to cardiology or radiology depending on what you need.

### How it works
| Pattern | How | Good for | Watch out |
|---|---|---|---|
| **Supervisor / worker** | the supervisor makes a plan → N workers (same skills) on parts → review → aggregate | parallel research, batch analysis, map-reduce | supervisor context growth; workers duplicating each other |
| **Coordinator / specialist** | a router/coordinator picks the specialist per sub-task; specialists hold domain tools | support desks, enterprise assistants with many domains | routing errors; specialist overlap |
| **Hierarchical** | supervisors of supervisors | very large tasks | latency, cost, information loss |
| **Peer handoffs (swarm)** | agents transfer control directly ([handoffs](#4-handoffs-delegation-and-task-ownership)) | conversational routing | harder to keep a single owner and a global budget |

- **Implementation details:**
  - The supervisor's tools are "call worker X" (agents-as-tools), or graph edges to worker nodes.
  - Give **explicit sub-task specs** (objective, output format, boundaries, budget), so workers don't overlap.
  - The supervisor reviews results and can re-dispatch.
  - Enforce a **global budget** (steps, tokens, time) across all agents.
- Frameworks: LangGraph supervisor and hierarchical teams; agents-as-tools in the OpenAI Agents SDK and Claude Agent SDK subagents; CrewAI hierarchical process ([frameworks](./Agentic-Frameworks-and-Orchestration.md#1-compare-langgraph-autogen-crewai-and-sdk-native-agent-approaches)).

#### Modern C++ example — a supervisor dispatching specs to workers, a coordinator routing to specialists, and a global budget across agents
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Budget { int tokens_left; bool spend(int n) { if (n > tokens_left) return false; tokens_left -= n; return true; } };

int main() {
    Budget budget{30'000};
    // Supervisor / worker: identical workers on non-overlapping specs.
    std::vector<std::string> specs{"summarize Q3 sales (region: Cairo)", "summarize Q3 sales (region: Alexandria)", "summarize Q3 sales (region: Delta)"};
    std::cout << "supervisor plan -> " << specs.size() << " workers\n";
    for (auto& s : specs) std::cout << "  worker: " << s << (budget.spend(6'000) ? " [ok]" : " [budget exhausted]") << '\n';
    std::cout << "  supervisor aggregates 3 summaries -> " << (budget.spend(4'000) ? "report ready" : "stop: budget") << '\n';

    // Coordinator / specialist: route each sub-task to the agent that owns the domain and its tools.
    std::map<std::string, std::function<std::string(const std::string&)>> specialists{
        {"billing", [](const std::string& t) { return "billing specialist (tools: invoices, refunds) handled: " + t; }},
        {"shipping", [](const std::string& t) { return "shipping specialist (tools: tracking, carriers) handled: " + t; }}};
    auto route = [](const std::string& t) { return t.find("refund") != std::string::npos || t.find("invoice") != std::string::npos ? "billing" : "shipping"; };
    for (std::string sub : {"where is parcel 77?", "refund the delivery fee"}) {
        bool ok = budget.spend(5'000);
        std::cout << "coordinator -> " << (ok ? specialists[route(sub)](sub) : std::string("budget exhausted: escalate with partial results")) << '\n';
    }
    std::cout << "global budget left: " << budget.tokens_left << " tokens\n";
}
```

**Output:**
```text
supervisor plan -> 3 workers
  worker: summarize Q3 sales (region: Cairo) [ok]
  worker: summarize Q3 sales (region: Alexandria) [ok]
  worker: summarize Q3 sales (region: Delta) [ok]
  supervisor aggregates 3 summaries -> report ready
coordinator -> shipping specialist (tools: tracking, carriers) handled: where is parcel 77?
coordinator -> budget exhausted: escalate with partial results
global budget left: 3000 tokens
```

A **global** budget shared across agents stops a multi-agent run from spending without limit: the second specialist call didn't fit.

### Interview answer
"In supervisor/worker, a central agent decomposes the task into explicit, non-overlapping sub-task specs, dispatches them to workers, often in parallel, reviews results, re-dispatches if needed and aggregates. That suits research and batch analysis. In coordinator/specialist, the coordinator routes each sub-task to a domain specialist with its own prompt, tools and permissions, like billing or shipping, which suits multi-domain assistants. Both keep one accountable owner, unlike peer handoff swarms. The risks are supervisor context growth, overlapping workers and routing errors, so I use clear specs, agents-as-tools or graph edges, and a global budget for steps, tokens and time across all agents."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Communication | typed TaskRequest/TaskResult/Error with IDs, budget, schema, sources; validate both ends; pass references; A2A / MCP; untrusted if upstream read external content |
| Proliferation | default to one agent + tools; split for context overload, parallelism, isolation, ownership; measure gain vs. cost |
| Conflicts | tool verification > evidence > domain authority > weighted vote/judge > human; same-model consensus is weak |
| Handoffs vs. delegation | handoff moves ownership; delegation keeps it; handoff package; one owner; allowed transitions; ping-pong cap; human target |
| Parallel agents | per-worker outputs + deterministic reducers; read-only workers; dedupe with provenance; partial-failure policy |
| Shared vs. private state | shared = goal/plan/decisions/facts/artifacts; private = scratchpads/raw outputs; publish curated results |
| Single vs. multi | single = simple, cheap, full context; multi = breadth, specialization, isolation at higher cost |
| Patterns | supervisor/worker (decompose + aggregate), coordinator/specialist (route by domain), hierarchical, swarm; global budget |
