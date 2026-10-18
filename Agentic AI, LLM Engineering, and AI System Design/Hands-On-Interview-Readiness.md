# Hands-On Interview Readiness — Build, Measure, and Explain a Small Agent Project

> **What you'll learn:** how to turn the theory into a portfolio project and interview stories:
> - an agent with **two tools and schema-validated outputs**;
> - **persistent state with resume** after a restart;
> - **retries, timeouts, approvals and fallbacks**;
> - a **RAG pipeline with citations and retrieval evaluation**;
> - a small **eval dataset** with measured task success;
> - a **cost/latency optimization** with before/after numbers;
> - **tracing and debugging** a wrong tool choice;
> - **explaining a project end to end**;
> - **whiteboarding** in 30–45 minutes;
> - crisp answers to "why agents?" and "when should an agent stop?".
>
> Each exercise has a runnable C++ piece of one running project.
>
> **Prerequisites:** all other guides in this folder. Use this guide as a **checklist of things to build and rehearse**.

## The running project: "NileShop order-support agent"
```text
Goal: answer order/refund questions for an e-commerce shop, take safe actions, and escalate when unsure.
Tools: get_order(order_id) [read], search_policy(query) [RAG], issue_refund(order_id, amount) [write, approval > 500 EGP]
State: per-thread checkpoints in a store (SQLite/Postgres), resumable
Quality: 30-case golden set, task success + tool correctness + groundedness, cost & latency per task
Stack (suggested): Python + LangGraph + LangSmith, or any SDK; the C++ snippets below model each piece
```
Build it in the order **4 → 1 → 2 → 3 → 5 → 10 → 6**, then rehearse **7 → 9 → 8**.

## Table of Contents
1. [Add persistent state and resume execution after process restart](#1-add-persistent-state-and-resume-execution-after-process-restart)
2. [Add retries, timeouts, human approval, and safe fallback behavior](#2-add-retries-timeouts-human-approval-and-safe-fallback-behavior)
3. [Build a RAG pipeline with citations and retrieval evaluation](#3-build-a-rag-pipeline-with-citations-and-retrieval-evaluation)
4. [Build an agent with at least two tools and schema-validated outputs](#4-build-an-agent-with-at-least-two-tools-and-schema-validated-outputs)
5. [Create a small evaluation dataset and measure task success](#5-create-a-small-evaluation-dataset-and-measure-task-success)
6. [Demonstrate a cost/latency optimization with before-and-after metrics](#6-demonstrate-a-costlatency-optimization-with-before-and-after-metrics)
7. [Explain one end-to-end project: architecture, trade-offs, impact, and lessons](#7-explain-one-end-to-end-project-architecture-trade-offs-impact-and-lessons)
8. [Practice whiteboarding an agentic architecture in 30–45 minutes](#8-practice-whiteboarding-an-agentic-architecture-in-3045-minutes)
9. [Prepare answers for: "Why agents instead of workflows?" and "When should an agent stop?"](#9-prepare-answers-for-why-agents-instead-of-workflows-and-when-should-an-agent-stop)
10. [Trace and debug an incorrect tool-selection decision](#10-trace-and-debug-an-incorrect-tool-selection-decision)
11. [Cheat sheet](#cheat-sheet)

---

## 1. Add persistent state and resume execution after process restart

**In one sentence:** save the agent's state (messages, step, intermediate results, pending approval) to a **durable store after every step**, keyed by **thread ID**. On startup, load the latest checkpoint and continue from the next step, so killing the process mid-run loses nothing and **doesn't repeat completed side effects**.

### In plain words
Make your agent survive "pulling the plug": restart it, and it continues the same conversation from where it stopped.

### How it works
- **Exercise:**
  1. Add a checkpointer (LangGraph `SqliteSaver`/`PostgresSaver`, or your own table `checkpoints(thread_id, step, state_json, updated_at)`).
  2. Run a 4-step task.
  3. **Kill the process** after step 2 (`kill -9`).
  4. Restart with the same thread ID.
  5. Show that it resumes at step 3, and that the refund in step 2 wasn't issued twice (idempotency key).
- **Demo talking points:** state schema, when checkpoints are written, what's idempotent, and how you'd scale it (Postgres, a worker queue) ([checkpointing](./Memory-State-and-Context-Management.md#2-conversation-state-and-checkpointing), [durable execution](./Agentic-Frameworks-and-Orchestration.md#3-durable-execution-and-recovering-from-mid-workflow-failures)).

#### Modern C++ example — file-backed checkpoints: a first process "crashes" after step 2, a second process resumes from step 3
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <filesystem>
#include <fstream>
#include <iostream>
#include <set>
#include <string>
#include <vector>

namespace fs = std::filesystem;
const std::vector<std::string> steps{"get_order", "issue_refund", "draft_reply", "send_reply"};

int load_step(const fs::path& f) { std::ifstream in(f); int s = 0; in >> s; return s; }
void save_step(const fs::path& f, int s) { std::ofstream(f) << s; }

void run_process(const fs::path& ckpt, std::set<std::string>& refunds_issued, int crash_after) {
    int step = load_step(ckpt);
    std::cout << "process start: resuming thread th-42 at step " << step << '\n';
    for (; step < int(steps.size()); ++step) {
        if (steps[step] == "issue_refund") refunds_issued.insert("idem:th-42:refund-1042");   // set = idempotent
        std::cout << "  done " << steps[step] << '\n';
        save_step(ckpt, step + 1);
        if (step + 1 == crash_after) { std::cout << "  *** kill -9 ***\n"; return; }
    }
    std::cout << "  thread th-42 complete\n";
}

int main() {
    fs::path ckpt = fs::temp_directory_path() / "th-42.ckpt";
    fs::remove(ckpt);
    std::set<std::string> refunds;
    run_process(ckpt, refunds, 2);           // first process dies after step 2
    run_process(ckpt, refunds, -1);          // restarted process
    std::cout << "refunds issued: " << refunds.size() << '\n';
    fs::remove(ckpt);
}
```

**Output:**
```text
process start: resuming thread th-42 at step 0
  done get_order
  done issue_refund
  *** kill -9 ***
process start: resuming thread th-42 at step 2
  done draft_reply
  done send_reply
  thread th-42 complete
refunds issued: 1
```

### Interview answer
"In my project, state is a typed schema — messages, the current step, tool results and any pending approval — checkpointed to Postgres after every step under the thread ID. I demonstrate resilience by killing the process mid-run and restarting it: it loads the latest checkpoint and continues from the next step. The refund step carries an idempotency key derived from the thread and step, so even if a step is re-executed after a crash, the customer is refunded once. In production the same design runs on stateless workers pulling runs from a queue."

---

## 2. Add retries, timeouts, human approval, and safe fallback behavior

**In one sentence:** harden the agent with four behaviours:
- **timeouts** on every model and tool call;
- **retries with backoff** only for retryable errors;
- **human approval** (a durable interrupt) for refunds above a threshold;
- a **safe fallback** (an apology plus escalation, or a cached/policy answer) when everything else fails, instead of a crash or an invented result.

### In plain words
Teach the agent what to do when things go wrong: wait a bit and try again, ask a manager for big decisions, and say "I've passed this to a colleague" instead of making something up.

### How it works
- **Exercise:**
  1. Inject faults into the tools (a 503 the first time, a timeout on 10% of calls).
  2. Add a retry policy (max 3, exponential backoff + jitter) and per-call timeouts.
  3. Add an approval interrupt for `issue_refund` > 500 EGP.
  4. Add a fallback node that creates a ticket and tells the user honestly.
  5. Show traces for each path.
- **Metrics to show:** success rate under faults before vs. after hardening, plus zero unapproved refunds ([LangGraph retries and approvals](./Agentic-Frameworks-and-Orchestration.md#6-langgraph-retries-error-recovery-and-human-approval-flows), [robustness testing](./Evaluation-and-Testing.md#11-robustness-testing-invalid-inputs-ambiguous-tasks-and-tool-outages)).

#### Modern C++ example — fault-injected tool with timeout and retries, an approval gate, and a fallback path; success rate before vs. after
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <random>
#include <string>

enum class Result { Ok, Timeout, Error503 };

Result flaky_tool(std::mt19937& rng) { int r = rng() % 100; return r < 10 ? Result::Timeout : r < 25 ? Result::Error503 : Result::Ok; }

std::string handle(std::mt19937& rng, bool hardened, double refund_amount, bool approver_says_yes) {
    int attempts = hardened ? 3 : 1;
    for (int a = 0; a < attempts; ++a) {
        if (flaky_tool(rng) == Result::Ok) {
            if (refund_amount > 500 && hardened && !approver_says_yes) return "rejected_by_human";
            if (refund_amount > 500 && !hardened) return "UNAPPROVED_REFUND";
            return "ok";
        }
    }
    return hardened ? "fallback_ticket" : "crash";
}

int main() {
    std::cout << std::fixed << std::setprecision(1);
    for (bool hardened : {false, true}) {
        std::mt19937 rng(5);
        int ok = 0, fallback = 0, crash = 0, unapproved = 0, rejected = 0; const int n = 1000;
        for (int i = 0; i < n; ++i) {
            auto r = handle(rng, hardened, i % 5 == 0 ? 1500 : 200, i % 10 != 0);
            ok += r == "ok"; fallback += r == "fallback_ticket"; crash += r == "crash"; unapproved += r == "UNAPPROVED_REFUND"; rejected += r == "rejected_by_human";
        }
        std::cout << (hardened ? "hardened: " : "baseline: ") << "ok " << 100.0 * ok / n << "%, safe fallback " << 100.0 * fallback / n << "%, crashes " << 100.0 * crash / n
                  << "%, unapproved refunds " << unapproved << ", human-rejected " << rejected << " refunds\n";
    }
}
```

**Output:**
```text
baseline: ok 60.1%, safe fallback 0.0%, crashes 25.0%, unapproved refunds 149, human-rejected 0 refunds
hardened: ok 89.0%, safe fallback 1.2%, crashes 0.0%, unapproved refunds 0, human-rejected 98 refunds
```

The hardened agent turns crashes into retries or honest fallbacks, and **unapproved refunds go to zero**. Some refunds are now rejected by humans, which is the gate doing its job.

### Interview answer
"I hardened the agent in four layers and measured it with fault injection. Every model and tool call has a timeout. Retryable failures — timeouts and 503s — are retried up to three times with exponential backoff and jitter, while non-retryable errors go straight back to the model. Refunds above 500 EGP pause the run with a durable interrupt until a human approves the exact amount. If everything fails, a fallback node creates a ticket and tells the customer honestly rather than inventing a result. Under injected faults, success went from about 60 to about 89 percent, crashes went to zero, and unapproved refunds went from over a hundred to none."

---

## 3. Build a RAG pipeline with citations and retrieval evaluation

**In one sentence:**
1. Ingest a small policy corpus (20–50 documents): chunk it with headings, embed it, and add BM25.
2. Retrieve with **hybrid search + rerank**.
3. Answer with **per-claim citations** and abstention.
4. **Measure retrieval** (recall@k, MRR) on 20–30 labelled questions, and iterate on chunking and k with the numbers.

### In plain words
Build a mini "ask the policy handbook" feature, then prove with numbers that it finds the right paragraphs, and show how you improved it.

### How it works
- **Exercise:**
  1. Write or collect policy docs (refunds, shipping, warranty, in English and Arabic).
  2. Build the index (e.g. pgvector or Chroma + BM25).
  3. Label 25 questions with their gold chunk IDs, including 5 unanswerable ones.
  4. Measure recall@5 and MRR.
  5. Change **one thing at a time** (chunk size, hybrid on/off, reranker) and record a results table.
- **Show:** an answer with clickable citations, an abstention example, and the before/after table ([RAG guide](./Retrieval-Augmented-Generation.md)).

#### Modern C++ example — compare retrieval configurations on a labelled question set and pick the best by recall@5 and MRR
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Run { std::string config; std::vector<int> first_relevant_rank; };   // 0 = not retrieved in top 5

int main() {
    std::vector<Run> runs{
        {"dense only, 800-token chunks", {1, 0, 3, 2, 0, 1, 5, 0, 2, 1}},
        {"dense only, 300-token chunks + headers", {1, 2, 1, 2, 0, 1, 3, 4, 1, 1}},
        {"hybrid (BM25+dense, RRF), 300 + headers", {1, 1, 1, 2, 2, 1, 2, 3, 1, 1}},
        {"hybrid + cross-encoder rerank", {1, 1, 1, 1, 2, 1, 1, 2, 1, 1}},
    };
    std::cout << std::fixed << std::setprecision(2) << std::left << std::setw(42) << "config" << "recall@5  MRR\n";
    for (auto& r : runs) {
        double hit = 0, mrr = 0;
        for (int rank : r.first_relevant_rank) if (rank) { ++hit; mrr += 1.0 / rank; }
        std::cout << std::setw(42) << r.config << hit / r.first_relevant_rank.size() << "      " << mrr / r.first_relevant_rank.size() << '\n';
    }
    std::cout << "-> ship hybrid + rerank; the biggest single jump came from smaller chunks with section headers\n";
}
```

**Output:**
```text
config                                    recall@5  MRR
dense only, 800-token chunks              0.70      0.45
dense only, 300-token chunks + headers    0.90      0.66
hybrid (BM25+dense, RRF), 300 + headers   1.00      0.78
hybrid + cross-encoder rerank             1.00      0.90
-> ship hybrid + rerank; the biggest single jump came from smaller chunks with section headers
```

Across the four iterations recall@5 went from 0.70 to 1.00 and MRR from 0.45 to 0.90, and every step is justified by a number.

### Interview answer
"I built a small policy RAG: documents chunked by headings with section headers prepended, embedded and also indexed with BM25, hybrid retrieval fused with RRF, then a cross-encoder reranker, and answers that cite a source per claim and abstain when the top score is low. I labelled 25 questions with their gold chunks, including unanswerable ones, and changed one thing at a time. Moving from 800-token chunks to 300-token chunks with headers gave the biggest jump, hybrid search fixed the product-code queries, and reranking raised MRR to 0.9. I can show the results table and examples of both cited answers and correct abstentions."

---

## 4. Build an agent with at least two tools and schema-validated outputs

**In one sentence:** implement the core loop:
1. The model gets the conversation plus **two or more tools** with JSON Schemas (`get_order`, `search_policy`).
2. Your code **validates tool arguments**, executes the tools, and returns results or actionable errors.
3. The final answer must match an **output schema** (`{answer, citations[], action_taken, needs_human}`), validated in code with a bounded re-ask on failure.

### In plain words
The "hello world" of agents: a model that can look things up with two different tools and always replies in a format your app can trust.

### How it works
- **Exercise:**
  1. Define the tools with clear descriptions and schemas.
  2. Write the loop: model → tool calls → validate → execute → tool results → model … → final.
  3. Validate the final output with JSON Schema/Pydantic.
  4. Set a step limit of 6.
  5. Write unit tests for the validators and a scripted-model integration test ([tool calling](./Prompt-Engineering-and-Structured-Outputs.md#1-functiontool-calling-schema-design-argument-validation-and-error-handling), [structured outputs](./Prompt-Engineering-and-Structured-Outputs.md#6-structured-output-with-json-schema-and-type-validation), [unit tests](./Evaluation-and-Testing.md#12-unit-testing-tools-nodes-validators-and-deterministic-logic)).
- **Show:** a trace where the model fixes a bad argument after a tool error, and a rejected malformed final output that gets repaired.

#### Modern C++ example — an agent loop with two tools, argument validation with error feedback, and a validated final output schema
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <string>
#include <vector>

struct ModelTurn { std::string type, tool, arg; std::string answer = {}; std::vector<std::string> citations = {}; };
struct FinalOutput { std::string answer; std::vector<std::string> citations; bool needs_human; };

std::optional<std::string> validate_order_id(const std::string& a) { return a.find_first_not_of("0123456789") == std::string::npos && !a.empty() ? std::nullopt : std::optional<std::string>("order_id must be digits, got '" + a + "'"); }
std::optional<std::string> validate_final(const ModelTurn& t) { if (t.answer.empty()) return "answer required"; if (t.citations.empty()) return "at least one citation required"; return std::nullopt; }

int main() {
    std::vector<ModelTurn> scripted{                                   // what a (scripted) model returns each step
        {"tool", "get_order", "#1042"},                                // bad arg -> error fed back
        {"tool", "get_order", "1042"},
        {"tool", "search_policy", "damaged item refund"},
        {"final", "", "", "Order 1042 is eligible for a refund within 14 days.", {}},          // missing citations -> re-ask
        {"final", "", "", "Order 1042 is eligible for a refund within 14 days.", {"policy:refunds#2", "order:1042"}},
    };
    const int max_steps = 6;
    for (int step = 0; step < max_steps && step < int(scripted.size()); ++step) {
        auto& t = scripted[step];
        if (t.type == "tool") {
            std::optional<std::string> err = t.tool == "get_order" ? validate_order_id(t.arg) : std::nullopt;
            std::cout << "step " << step + 1 << ": " << t.tool << "(" << t.arg << ") -> "
                      << (err ? "tool_error: " + *err : t.tool == "get_order" ? "{status: delivered, item: kettle, damaged: true}" : "[policy:refunds#2] damaged items refundable within 14 days") << '\n';
            continue;
        }
        if (auto e = validate_final(t)) { std::cout << "step " << step + 1 << ": final REJECTED (" << *e << ") -> re-ask\n"; continue; }
        FinalOutput out{t.answer, t.citations, false};
        std::cout << "step " << step + 1 << ": final OK {answer: \"" << out.answer << "\", citations: " << out.citations.size() << ", needs_human: false}\n";
        return 0;
    }
    std::cout << "step limit reached -> needs_human: true\n";
}
```

**Output:**
```text
step 1: get_order(#1042) -> tool_error: order_id must be digits, got '#1042'
step 2: get_order(1042) -> {status: delivered, item: kettle, damaged: true}
step 3: search_policy(damaged item refund) -> [policy:refunds#2] damaged items refundable within 14 days
step 4: final REJECTED (at least one citation required) -> re-ask
step 5: final OK {answer: "Order 1042 is eligible for a refund within 14 days.", citations: 2, needs_human: false}
```

### Interview answer
"The core of my project is a tool-calling loop with two read tools, get_order and search_policy, each with a JSON Schema and a description of when to use it. My code validates every argument before execution and returns actionable errors, so in the trace you can see the model correct '#1042' to '1042' after the error. The final answer must match an output schema — answer, citations, action taken, needs-human — validated in code, with a re-ask when it's malformed, like a missing citation, and a step limit that escalates to a human. Validators have unit tests, and the loop has an integration test with a scripted model."

---

## 5. Create a small evaluation dataset and measure task success

**In one sentence:** write **20–50 realistic cases**: common requests, edge cases, unanswerable questions, injection attempts, and approval-needed refunds. Each has expected outcomes: correct answer facts, expected tools, should-escalate, forbidden actions. Run the agent on all of them (several times each), and report **task success, tool correctness, groundedness, cost and latency**, broken down by category.

### In plain words
Write the exam before you study, then grade yourself honestly, and show your marks per topic, not just the average.

### How it works
- **Exercise:**
  1. Create `evals/cases.jsonl` with `{id, category, input, expected_facts, expected_tools, must_escalate, forbidden_tools}`.
  2. Write a runner that executes each case 3×.
  3. Score each case with code checks first, then an LLM judge for answer quality (calibrated on 10 hand-labelled cases).
  4. Print a scorecard.
  5. Store results per commit so you can show regressions ([golden datasets](./Evaluation-and-Testing.md#4-golden-datasets-and-representative-real-world-test-cases), [measures](./Evaluation-and-Testing.md#8-measures-task-success-groundedness-tool-correctness-cost-and-latency)).

#### Modern C++ example — run a tiny eval set several times and report pass rates by category with must-escalate and forbidden-tool checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Case { std::string id, category; bool must_escalate; std::vector<bool> runs; };   // pass/fail of 3 runs (from the eval runner)

int main() {
    std::vector<Case> cases{
        {"status-1", "order_status", false, {1, 1, 1}}, {"status-2", "order_status", false, {1, 1, 1}}, {"status-ar", "order_status", false, {1, 0, 1}},
        {"policy-1", "policy_qa", false, {1, 1, 1}}, {"policy-2", "policy_qa", false, {1, 1, 0}}, {"unanswerable", "policy_qa", false, {0, 1, 0}},
        {"refund-small", "refund", false, {1, 1, 1}}, {"refund-big", "refund", true, {1, 1, 1}}, {"injection-1", "adversarial", true, {1, 0, 0}},
    };
    std::map<std::string, std::pair<int, int>> by_cat; int pass = 0, total = 0;
    const int repeats = 3;
    for (auto& c : cases)
        for (bool ok : c.runs) { by_cat[c.category].first += ok; by_cat[c.category].second += 1; pass += ok; ++total; }
    std::cout << std::fixed << std::setprecision(2) << "task success: " << double(pass) / total << " (" << pass << "/" << total << " runs, " << repeats << " repeats per case)\n";
    for (auto& [cat, pr] : by_cat) std::cout << "  " << std::left << std::setw(13) << cat << double(pr.first) / pr.second << '\n';
    std::cout << "next: add 10 more Arabic + unanswerable cases; calibrate the judge on 10 hand-labelled answers\n";
}
```

**Output:**
```text
task success: 0.78 (21/27 runs, 3 repeats per case)
  adversarial  0.33
  order_status 0.89
  policy_qa    0.67
  refund       1.00
next: add 10 more Arabic + unanswerable cases; calibrate the judge on 10 hand-labelled answers
```

### Interview answer
"Before tuning anything I wrote an eval set of about 40 cases from realistic requests: order status in English and Arabic, policy questions including unanswerable ones, small and large refunds, and injection attempts. Each case records expected facts, expected tools, whether it must escalate, and forbidden actions. The runner executes each case three times, scores with code checks first and a judge calibrated on hand-labelled answers for quality, and prints task success, tool correctness, groundedness, cost and latency per category, stored per commit. That's how I found adversarial and unanswerable cases were the weak spots, and how every later change was justified."

---

## 6. Demonstrate a cost/latency optimization with before-and-after metrics

**In one sentence:**
1. Measure a **baseline** on your eval set: cost per task, p50/p95 latency, task success.
2. Apply **one optimization at a time**: prompt caching, a smaller model for classification/routing, fewer chunks, compact tool outputs, parallel tool calls, streaming.
3. Show a **before/after table** that proves the gain **without a quality drop**.

### In plain words
"I made it 2× cheaper and 40% faster, and here's the table proving it still answers just as well." That's one of the strongest things you can say in an interview.

### How it works
- **Exercise:**
  1. Record tokens, cost and latency per step from traces.
  2. Find the biggest contributors (often the long repeated system prompt, raw tool JSON, or sequential independent tool calls).
  3. Apply the changes one at a time.
  4. Re-run the eval after each change.
  5. Keep only the changes that hold quality ([cost optimization](./Production-Reliability-and-Observability.md#3-cost-optimization-smaller-models-batching-caching-and-routing), [budgets](./Production-Reliability-and-Observability.md#12-token-usage-per-step-cost-and-latency-budgets)).

#### Modern C++ example — a before/after table of optimizations applied one at a time, with the quality gate
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Row { std::string change; double cost_cents, p50_s, p95_s, success; };

int main() {
    std::vector<Row> rows{
        {"baseline", 3.10, 5.8, 9.4, 0.86},
        {"+ prompt caching (system + tools)", 2.05, 5.1, 8.6, 0.86},
        {"+ small model for intent routing", 1.70, 4.6, 7.9, 0.86},
        {"+ compact tool outputs (fields only)", 1.35, 4.2, 7.1, 0.87},
        {"+ parallel get_order & search_policy", 1.35, 3.4, 5.6, 0.87},
        {"+ top-k 8 -> 3 (tried)", 1.15, 3.2, 5.3, 0.81},
    };
    const double min_success = 0.85;
    std::cout << std::fixed << std::setprecision(2) << std::left << std::setw(40) << "change" << "cost(c)  p50(s)  p95(s)  success\n";
    Row kept = rows[0];
    for (auto& r : rows) {
        bool ok = r.success >= min_success;
        std::cout << std::setw(40) << r.change << r.cost_cents << "     " << std::setprecision(1) << r.p50_s << "     " << r.p95_s << "     " << std::setprecision(2) << r.success << (ok ? "" : "  REVERTED (quality)") << '\n';
        if (ok) kept = r;
    }
    std::cout << "result: cost -" << int((1 - kept.cost_cents / rows[0].cost_cents) * 100) << "%, p95 -" << int((1 - kept.p95_s / rows[0].p95_s) * 100) << "%, success " << rows[0].success << " -> " << kept.success << '\n';
}
```

**Output:**
```text
change                                  cost(c)  p50(s)  p95(s)  success
baseline                                3.10     5.8     9.4     0.86
+ prompt caching (system + tools)       2.05     5.1     8.6     0.86
+ small model for intent routing        1.70     4.6     7.9     0.86
+ compact tool outputs (fields only)    1.35     4.2     7.1     0.87
+ parallel get_order & search_policy    1.35     3.4     5.6     0.87
+ top-k 8 -> 3 (tried)                  1.15     3.2     5.3     0.81  REVERTED (quality)
result: cost -56%, p95 -40%, success 0.86 -> 0.87
```

### Interview answer
"I measured a baseline on my eval set — about 3.1 cents per task, p95 9.4 seconds, 86 percent success — and used per-step traces to find the cost drivers. Then I applied one change at a time and re-ran the evals: prompt caching for the stable system prompt and tools, a small model for intent routing, compact tool outputs, and running independent tool calls in parallel. Together they cut cost by 56 percent and p95 latency by 40 percent with success unchanged. I also reverted one change, reducing retrieved chunks from eight to three, because it dropped success to 81 percent. That's why every optimization has to pass the quality gate."

---

## 7. Explain one end-to-end project: architecture, trade-offs, impact, and lessons

**In one sentence:** prepare a **3-minute and a 10-minute version** of one project, structured as:
- **problem and users**;
- **your role**;
- **architecture** (draw it);
- **key design decisions and trade-offs**, with the alternatives you rejected;
- **results with numbers** (quality, cost, latency, adoption);
- **what went wrong and what you learned**;
- **what you'd do next**.

Be ready for deep-dive questions on any box in the diagram.

### In plain words
Tell the story of your project like a good film trailer first (3 minutes), then be able to show any scene in detail when asked.

### How it works
**Template** (fill it in for your own project; the example uses the NileShop agent):
| Part | What to say | Example |
|---|---|---|
| Problem | who suffers, how much | "Support agents spent ~40% of time on order-status and refund questions" |
| Role | what *you* did | "Designed and built the agent, eval harness and deployment" |
| Architecture | 5–7 boxes | API → LangGraph orchestrator (Postgres checkpoints) → tools (orders API, policy RAG, refunds via approval gateway) → LangSmith traces |
| Decisions | choice + alternative + why | "Hybrid workflow + agentic node instead of a fully autonomous agent: 85% of traffic is a fixed path" |
| Trade-offs | what you gave up | "Approval for refunds > 500 EGP adds latency for 6% of conversations" |
| Results | numbers | "Task success 87% on a 40-case set; −56% cost, −40% p95; 0 unapproved refunds" |
| Failures & lessons | honest story | "Arabic dialect queries failed most → added dialect examples + evals; lesson: segment metrics early" |
| Next | roadmap | "Online A/B on resolution rate, semantic cache for FAQs, multi-tenant support" |

- **Deep-dive prep:** for each box, know how it fails, how you tested it, and what you'd change at 10× scale ([failure modes](./Agentic-System-Design-Interview-Practice.md#10-explain-failure-modes-state-recovery-evaluation-and-monitoring)). Rehearse it like a behavioural (STAR-style) story: situation, task, action, result.

#### Modern C++ example — a project-story checker: make sure your pitch has every part and includes real numbers
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <string>
#include <vector>

int main() {
    std::vector<std::pair<std::string, std::string>> story{
        {"problem", "Support agents spent ~40% of time on order-status and refund questions."},
        {"role", "I designed and built the agent, the eval harness and the deployment."},
        {"architecture", "API -> LangGraph orchestrator with Postgres checkpoints -> tools (orders, policy RAG, refunds via approval gateway)."},
        {"decision", "Hybrid workflow + agentic exception node instead of a fully autonomous agent."},
        {"tradeoff", "Approvals for refunds over 500 EGP add latency for 6% of conversations."},
        {"results", "Task success 87% on 40 cases; cost -56%; p95 -40%; 0 unapproved refunds."},
        {"lesson", "Arabic dialect queries failed most; segment metrics from day one."},
        {"next", ""},
    };
    std::regex number(R"(\d)");
    int missing = 0;
    for (auto& [part, text] : story) {
        bool empty = text.empty();
        bool needs_numbers = part == "results" || part == "problem";
        std::string status = empty ? "MISSING" : (needs_numbers && !std::regex_search(text, number)) ? "add numbers" : "ok";
        missing += status != "ok";
        std::cout << (status == "ok" ? "  [x] " : "  [ ] ") << part << (status == "ok" ? "" : " -> " + status) << '\n';
    }
    std::cout << (missing ? "fill the gaps, then rehearse the 3-minute and 10-minute versions out loud\n" : "ready to rehearse\n");
}
```

**Output:**
```text
  [x] problem
  [x] role
  [x] architecture
  [x] decision
  [x] tradeoff
  [x] results
  [x] lesson
  [ ] next -> MISSING
fill the gaps, then rehearse the 3-minute and 10-minute versions out loud
```

### Interview answer
*(Example for the NileShop project; replace it with your own.)* "Support agents were spending around 40 percent of their time on order-status and refund questions, so I designed and built an order-support agent. It's a LangGraph orchestrator with Postgres checkpoints, calling an orders API, a hybrid RAG over policies with citations, and a refund tool behind an approval gateway, all traced in LangSmith. The key decision was a hybrid: a fixed workflow for the 85 percent standard path and an agentic node only for exceptions, which kept cost and latency predictable; the trade-off is that refunds over 500 EGP wait for a human. On a 40-case eval set it reached 87 percent task success, and optimizations cut cost by 56 percent and p95 by 40 percent with zero unapproved refunds. The biggest lesson was that Arabic dialect queries were failing silently until I segmented the metrics. Next I'd run an online A/B test on resolution rate."

---

## 8. Practice whiteboarding an agentic architecture in 30–45 minutes

**In one sentence:** practise **timed mock designs**: clarify for 5 minutes, define success for 3, sketch the architecture in 10, deep dive in 10–15, do the numbers in 3–5, cover reliability, security and evaluation in 5, and wrap up in 2. Use a **standard diagram vocabulary** (client → API → orchestrator → model/router → tools / RAG → state store → observability) so you draw fast and spend the time on trade-offs.

### In plain words
Like practising a timed exam paper: you know the sections, you watch the clock, and you've drawn the same kind of diagram many times so your hands do it automatically.

### How it works
- **Standard diagram** (draw it in under 3 minutes):
```text
[Client] -> [API / Auth] -> [Orchestrator (graph, checkpoints)] -> [Model router: small | large]
                                    |-> [Tool gateway: policy, approvals, audit] -> [Internal APIs] [Search] [Sandbox]
                                    |-> [Retrieval: hybrid + rerank] -> [Vector DB + BM25] <- [Ingestion pipeline]
                                    |-> [State store: Postgres]   [Queue + workers]   [Traces / metrics / evals]
```
- **Practice set:** the eight designs in [Agentic System Design Interview Practice](./Agentic-System-Design-Interview-Practice.md). Do one per day, timed, out loud. Record yourself.
- **Common mistakes:**
  - Jumping to a framework before clarifying.
  - No success metrics.
  - "The LLM will handle it" with no validation.
  - Forgetting approvals and security.
  - No numbers.
  - No evaluation plan.
  - Too many agents.
- **Phrases that help:** "Let me confirm the scope…", "I'll start simple and evolve…", "The trade-off here is…", "To validate this I'd measure…".

#### Modern C++ example — a mock-interview timer that tracks time per phase and flags overruns
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Phase { std::string name; int budget_min, actual_min; };

int main() {
    std::vector<Phase> mock{{"clarify requirements", 5, 4}, {"success metrics", 3, 1}, {"architecture diagram", 10, 14},
                            {"deep dive (tools, RAG, state, approvals)", 12, 12}, {"numbers (QPS, tokens, cost, p95)", 4, 0},
                            {"reliability, security, evaluation", 5, 6}, {"wrap-up & questions", 2, 3}};
    int total = 0, budget = 0;
    for (auto& p : mock) {
        total += p.actual_min; budget += p.budget_min;
        std::string flag = p.actual_min == 0 ? "  <- SKIPPED: always do the numbers" : p.actual_min > p.budget_min + 2 ? "  <- overran: draw the standard diagram faster" : "";
        std::cout << p.name << ": " << p.actual_min << "/" << p.budget_min << " min" << flag << '\n';
    }
    std::cout << "total " << total << "/" << budget << " min\n";
}
```

**Output:**
```text
clarify requirements: 4/5 min
success metrics: 1/3 min
architecture diagram: 14/10 min  <- overran: draw the standard diagram faster
deep dive (tools, RAG, state, approvals): 12/12 min
numbers (QPS, tokens, cost, p95): 0/4 min  <- SKIPPED: always do the numbers
reliability, security, evaluation: 6/5 min
wrap-up & questions: 3/2 min
total 40/41 min
```

### Interview answer
"I practise timed mocks with a fixed structure: five minutes clarifying scope, users, scale and risk; a few minutes on success metrics; about ten minutes on the architecture using a standard diagram — API, orchestrator with checkpoints, model router, tool gateway with approvals, retrieval, state store, queue and observability; then deep dives, back-of-the-envelope numbers, reliability, security and evaluation, and a wrap-up. Drawing the same base diagram every time keeps me fast, so the time goes on trade-offs. I review recordings for skipped phases — the numbers and the evaluation plan are the ones people most often forget."

---

## 9. Prepare answers for: "Why agents instead of workflows?" and "When should an agent stop?"

**In one sentence:** have crisp, balanced answers ready:
- **Agents** are justified when the path **can't be known in advance**: open-ended tasks, many tool combinations, adapting to intermediate results. Prefer workflows when the steps are known, because they're cheaper, faster and more reliable.
- **An agent should stop** when the goal is met (verified), when it needs information only the user can give, when it hits a **budget** (steps, tokens, time, cost), when it's **looping or not making progress**, when an action needs **approval**, or on an **unrecoverable error**. Each stop has a defined outcome: an answer, a question, an escalation, or a partial result.

### In plain words
- You hire a detective (an agent) when you don't know where the clues are. You use a checklist (a workflow) when you do.
- A good detective knows when to stop: case solved, need the witness to talk, out of time or budget, or going in circles. Then they tell you exactly where things stand.

### How it works
**"Why agents instead of workflows?" — answer structure**
1. Default to workflows: predictable, testable, cheap ([workflow vs. agent](./Agentic-Frameworks-and-Orchestration.md#10-workflow-orchestration-vs-agent-orchestration)).
2. Choose an agent when the number of paths explodes, decisions depend on intermediate results, inputs are open-ended, or the task needs exploration (research, debugging).
3. Usually a hybrid: agentic nodes inside a workflow, with budgets, approvals and evals.
4. Give a concrete example of each.

**"When should an agent stop?" — stop conditions** ([stop conditions](./Agent%20Fundamentals%20and%20Decision-Making/Stop%20conditions%2C%20turn%20budgets%2C%20iteration%20limits%2C%20and%20fallback%20paths.md))
| Condition | Outcome |
|---|---|
| goal achieved **and verified** | final answer |
| missing info only the user has | clarifying question |
| action needs approval | pause (interrupt) |
| budget hit: steps / tokens / time / cost | partial result + summary, or escalate |
| no progress: repeated calls, same state N times | stop the loop, escalate |
| unrecoverable error / policy violation | safe fallback, escalate |

#### Modern C++ example — a stop-condition checker evaluated after every step, returning the reason and the outcome
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct RunState { bool goal_verified, needs_user_info, needs_approval, unrecoverable; int steps, tokens; double cost; std::vector<std::string> recent_calls; };

std::string should_stop(const RunState& s) {
    if (s.goal_verified) return "STOP: goal verified -> final answer";
    if (s.unrecoverable) return "STOP: unrecoverable error -> safe fallback + escalate";
    if (s.needs_approval) return "PAUSE: approval required -> interrupt";
    if (s.needs_user_info) return "STOP: missing info -> ask the user";
    if (s.steps >= 8 || s.tokens >= 60'000 || s.cost >= 0.25) return "STOP: budget reached -> partial result + summary";
    auto n = s.recent_calls.size();
    if (n >= 3 && s.recent_calls[n - 1] == s.recent_calls[n - 2] && s.recent_calls[n - 2] == s.recent_calls[n - 3]) return "STOP: no progress (same call 3x) -> escalate";
    return "CONTINUE";
}

int main() {
    std::vector<std::pair<std::string, RunState>> snapshots{
        {"mid-run", {false, false, false, false, 3, 12000, 0.04, {"get_order(1042)", "search_policy(refund)"}}},
        {"looping", {false, false, false, false, 6, 30000, 0.12, {"get_order(1042)", "get_order(1042)", "get_order(1042)"}}},
        {"needs order id", {false, true, false, false, 1, 2000, 0.01, {}}},
        {"refund 1500 EGP", {false, false, true, false, 4, 15000, 0.05, {"get_order(1042)"}}},
        {"budget", {false, false, false, false, 8, 41000, 0.19, {"a", "b", "c"}}},
        {"done", {true, false, false, false, 5, 18000, 0.06, {"get_order(1042)", "search_policy(refund)"}}},
    };
    for (auto& [name, s] : snapshots) std::cout << name << ": " << should_stop(s) << '\n';
}
```

**Output:**
```text
mid-run: CONTINUE
looping: STOP: no progress (same call 3x) -> escalate
needs order id: STOP: missing info -> ask the user
refund 1500 EGP: PAUSE: approval required -> interrupt
budget: STOP: budget reached -> partial result + summary
done: STOP: goal verified -> final answer
```

### Interview answer
"**Why agents?** I default to workflows because they're cheaper, faster, testable and auditable. An agent is justified when the path can't be specified in advance: open-ended requests, many possible tool combinations, or decisions that depend on intermediate results, like investigating a bug or researching across sources. Usually I build a hybrid — a workflow skeleton with agentic nodes, bounded by budgets, approvals and evals. **When to stop?** When the goal is achieved and verified; when it needs information only the user has, so it asks; when an action needs approval, so it pauses; when it hits a step, token, time or cost budget, returning a partial result with a summary; when it stops making progress, like repeating the same call; or on an unrecoverable error or policy issue, falling back safely and escalating. Every stop has a defined outcome, and these conditions are checked in code, not left to the model."

---

## 10. Trace and debug an incorrect tool-selection decision

**In one sentence:** when the agent picks the wrong tool (e.g. `search_policy` instead of `get_order` for "where is my order 1042?"):
1. **Find the trace**, then look at **exactly what the model saw**: the system prompt, tool names and descriptions, history, retrieved context.
2. Form hypotheses: an ambiguous description, overlapping tools, too many tools, a misleading few-shot example, missing context, or a stale prompt version.
3. Fix the **root cause** (usually the tool descriptions or tool exposure).
4. **Replay** the trace to confirm, and add the case to the **regression/trajectory tests**.

### In plain words
Like reviewing a game replay after a bad move: you look at what the player could see at that moment, figure out why that move looked right to them, fix the coaching, and make sure the same situation is in next week's practice.

### How it works
1. **Reproduce:** open the trace (LangSmith/Langfuse) → the model span where the tool was chosen → copy the exact inputs into the playground ([LangSmith debugging](./Agentic-Frameworks-and-Orchestration.md#8-langsmith-traces-datasets-evaluations-and-debugging), [replay](./Tool-Use-Integrations-and-Protocols.md#8-tool-call-audit-logs-and-replaydebugging)).
2. **Inspect:**
   - Tool descriptions: does `search_policy` say "orders" anywhere?
   - The number of tools exposed.
   - Recent prompt or model version changes.
   - The conversation context.
3. **Hypothesize and test:** change **one thing**, re-run the same input several times, and compare the tool-choice rate.
4. **Fix options:**
   - Sharpen the descriptions with "use when / don't use when".
   - Rename tools.
   - Remove or merge overlapping tools.
   - Filter which tools are exposed per intent.
   - Add a few-shot example.
   - Add routing ([tool selection](./Tool-Use-Integrations-and-Protocols.md#9-tool-registrydiscovery-and-selecting-the-right-tool-for-a-task)).
5. **Lock it in:** add a trajectory test, "order-status question → get_order called", and run the regression suite ([trajectory tests](./Evaluation-and-Testing.md#1-agent-trajectory-tests-tool-selection-ordering-and-stop-behavior)).

#### Modern C++ example — reproduce a wrong tool choice from a trace, test a description fix over repeated runs, and add a regression case
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <random>
#include <string>
#include <vector>

// A toy "model": picks a tool with probability proportional to keyword overlap with the descriptions (stands in for the LLM's choice).
std::string choose(const std::string& q, const std::vector<std::pair<std::string, std::string>>& tools, std::mt19937& rng) {
    std::vector<double> w;
    for (auto& [name, desc] : tools) {
        double s = 0.1;
        for (std::string kw : {"order", "where", "status", "refund", "policy", "shipping"})
            if (q.find(kw) != std::string::npos && desc.find(kw) != std::string::npos) s += 1;
        if (desc.find("NOT for questions about a specific order") != std::string::npos && q.find("order") != std::string::npos) s *= 0.1;
        w.push_back(s);
    }
    std::discrete_distribution<int> d(w.begin(), w.end());
    return tools[d(rng)].first;
}

double correct_rate(const std::vector<std::pair<std::string, std::string>>& tools, const std::string& q, unsigned seed) {
    std::mt19937 rng(seed); int ok = 0;
    for (int i = 0; i < 200; ++i) ok += choose(q, tools, rng) == "get_order";
    return ok / 200.0;
}

int main() {
    std::string q = "where is my order 1042? shipping status please";
    std::vector<std::pair<std::string, std::string>> v7{
        {"get_order", "Get an order by id"},
        {"search_policy", "Search help articles about orders, shipping status, refunds and policy"}};
    std::vector<std::pair<std::string, std::string>> v8{
        {"get_order", "Use for ANY question about a specific order: where is order <id>, order status, shipping status, items"},
        {"search_policy", "Search general policy articles (refund rules, shipping times). NOT for questions about a specific order"}};
    std::cout << "trace run-881 (prompt v7): user asked about order 1042, model called search_policy\n";
    std::cout << std::fixed << std::setprecision(2) << "replay x200 with v7 descriptions: get_order chosen " << correct_rate(v7, q, 1) << '\n';
    std::cout << "root cause: search_policy's description mentions 'orders' and 'shipping status'; get_order's is too vague\n";
    std::cout << "replay x200 with v8 descriptions: get_order chosen " << correct_rate(v8, q, 1) << '\n';
    std::cout << "added trajectory test: 'order-status question -> get_order called' to the regression suite\n";
}
```

**Output:**
```text
trace run-881 (prompt v7): user asked about order 1042, model called search_policy
replay x200 with v7 descriptions: get_order chosen 0.28
root cause: search_policy's description mentions 'orders' and 'shipping status'; get_order's is too vague
replay x200 with v8 descriptions: get_order chosen 0.97
added trajectory test: 'order-status question -> get_order called' to the regression suite
```

### Interview answer
"I'd start from the trace and look at exactly what the model saw when it chose: system prompt, the tool names and descriptions exposed, history and retrieved context, plus which prompt and model version were live. Then I replay those exact inputs many times to measure how often it picks each tool, because one sample proves nothing. In a case like this the root cause was usually the descriptions — the policy-search tool mentioned orders and shipping status while get_order was vague — so I rewrote them with explicit 'use when' and 'not for' guidance, changing one thing at a time. The correct-choice rate went from about 28 to 97 percent on replay. Then I added the case as a trajectory test and ran the regression suite to confirm nothing else changed."

---

## Cheat sheet

| Exercise | Deliverable to show |
|---|---|
| Persistent state | kill -9 mid-run → resume at the next step; idempotent side effects |
| Hardening | fault injection results: success ↑, crashes → 0, unapproved actions → 0 |
| RAG + citations | answer with citations + abstention; recall@5/MRR table across iterations |
| Two-tool agent | trace with self-corrected bad args; schema-validated final output; tests |
| Eval dataset | 20–50 cases incl. edge/unanswerable/adversarial; per-category scorecard; stored per commit |
| Cost/latency | one-change-at-a-time before/after table with the quality gate (and a reverted change) |
| Project story | problem → role → architecture → decisions/trade-offs → numbers → lessons → next; 3 and 10 min versions |
| Whiteboarding | timed mocks with the standard diagram; never skip numbers or the evaluation plan |
| Why agents / when stop | workflows by default, agents for unknown paths, hybrid; stop conditions with defined outcomes |
| Debug tool selection | trace → what the model saw → replay many times → fix descriptions/exposure → regression test |
