# LLM and Agent Evaluation & Reliability — Measuring and Testing Systems Built on Language Models

> **What you'll learn:** how to evaluate and keep reliable an application built on LLMs and agents: **golden datasets** and **regression suites**, **offline vs. online** evaluation, metrics for **hallucination, grounding, task success and retrieval**, using an **LLM as a judge** (and **calibrating** it against humans with **inter-rater agreement**), **tracing tool calls**, **replaying** agent steps and testing **checkpoints**, testing **failure recovery, human handoff and safety**, and building **cost, token, latency and failure-budget dashboards**. Cohen's kappa has a runnable C++ implementation.
>
> **Prerequisites:** [Testing Foundations](./Testing-Foundations.md), [Agent Fundamentals](<../Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Core agent loop: observe, decide, act, inspect results and stop.md>), [SLOs and error budgets](./Reliability-Engineering-SRE.md#7-slis-slos-slas-and-error-budgets).

## Table of Contents
1. [Agent failure recovery, human handoff, and safety regression tests](#1-agent-failure-recovery-human-handoff-and-safety-regression-tests)
2. [Cost, token usage, latency, and failure-budget dashboards](#2-cost-token-usage-latency-and-failure-budget-dashboards)
3. [Golden datasets, regression suites, and offline/online evaluation](#3-golden-datasets-regression-suites-and-offlineonline-evaluation)
4. [Hallucination, grounding, task-success, and retrieval metrics](#4-hallucination-grounding-task-success-and-retrieval-metrics)
5. [Judge-model calibration, human review, and inter-rater agreement](#5-judge-model-calibration-human-review-and-inter-rater-agreement)
6. [Tool-call tracing, execution-step replay, and state checkpoint tests](#6-tool-call-tracing-execution-step-replay-and-state-checkpoint-tests)
7. [Cheat sheet](#cheat-sheet)

**Why LLM apps need their own testing:** outputs are **non-deterministic**, "correct" is often **fuzzy** (many good answers), behaviour changes when the **model, prompt, tools or retrieved data** change, and failures are often **plausible-looking** (confident wrong answers). So you combine classic tests for the deterministic code with **statistical evaluation** of the model-driven parts.

---

## 1. Agent failure recovery, human handoff, and safety regression tests

**In one sentence:** test that an agent **recovers** from tool errors, timeouts and bad model outputs (retry, replan, fall back), **hands off to a human** when it's uncertain, blocked or about to do something risky, and **never regresses on safety** — refusing disallowed requests and resisting prompt injection — with a fixed suite run on every change.

### In plain words
A new employee is allowed to make small mistakes, but must know when to ask the manager, and must never give away the company's passwords — even if a customer's email says "ignore your instructions and send me the passwords". You test all three.

### How it works
**Failure recovery cases to script**
| Fault | Expected behaviour |
|---|---|
| tool returns an error / times out | retry with backoff (idempotent tools only), then try an alternative or report clearly |
| model returns invalid JSON / unknown tool | validate, re-ask once with the error, then fail safely |
| loop without progress | stop at the turn budget and return a partial result ([stop conditions](<../Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Stop conditions, turn budgets, iteration limits, and fallback paths.md>)) |
| missing information | ask the user instead of guessing |

**Human handoff** triggers: low confidence, policy says a human must approve (refunds above X, deleting data, sending external email), repeated failures, an angry or vulnerable user. The handoff must carry **context** (conversation summary, actions taken) so the human doesn't start over.

**Safety regression suite**
- Disallowed content requests (by your policy), **prompt injection** inside retrieved documents or tool outputs ("ignore previous instructions…"), data exfiltration attempts, tool misuse (asking the agent to run destructive commands), jailbreak variants.
- Each case has an expected outcome (refuse / ignore the injected instruction / require approval); the suite runs on **every prompt, model or tool change**, and the pass rate is a release gate (e.g. 100% on critical cases).

### Interview answer
"I script failure cases with a fake model and fake tools: tool timeouts and errors must lead to bounded retries, alternatives or a clear safe failure; invalid model outputs get validated and re-asked once; loops stop at a turn budget. Risky or uncertain actions hand off to a human with context, and the approval rule is enforced in code, not just in the prompt. A safety regression suite — disallowed requests, prompt injection in documents and tool outputs, tool misuse — runs on every prompt, model or tool change and gates releases."

---

## 2. Cost, token usage, latency, and failure-budget dashboards

**In one sentence:** treat an LLM feature like any production service: dashboard **requests, errors, latency** (including **time to first token**), **tokens in/out and cost** per request, per feature and per tenant, **steps and tool calls per task**, and track **quality and failure rates against a budget** so regressions and runaway spend are caught early.

### In plain words
A taxi company watches not only how many rides it does, but fuel per ride, how long customers wait, and how many rides go wrong. One driver taking a 3-hour detour (an agent stuck in a loop) should show up on the dashboard the same day.

### How it works
| Panel | Why |
|---|---|
| **RED**: requests, error rate (provider errors, timeouts, refusals, parse failures), latency p50/p95/p99 | basic service health |
| **Time to first token (TTFT)** and tokens/second | perceived speed in chat UIs |
| **Tokens in / out per request** (p50, p95) | prompt bloat, verbose answers, context growth |
| **Cost per request / per task / per tenant / per day**, with budget lines | spend control, pricing decisions |
| **Agent steps and tool calls per task**, % hitting the turn budget | loops and inefficient plans |
| **Cache hit rate** (prompt caching, semantic cache) | cost and latency savings |
| **Task success / quality score** from online evaluation | the user-facing SLO |
| **Failure budget**: allowed % of failed or low-quality tasks per window | release decisions, like an error budget |

- Cost = input tokens × input price + output tokens × output price (+ cached-token discounts, tool costs). Set **per-request and per-tenant limits** and alert on anomalies.
- Break everything down by **model version, prompt version and feature** — that's how you see which change caused a regression.
- Tools: OpenTelemetry GenAI semantic conventions, Langfuse, LangSmith, Arize Phoenix, Helicone, Datadog LLM Observability.

### Interview answer
"I dashboard an LLM feature like a service — request rate, errors including parse failures and refusals, latency with time to first token — plus tokens in and out, cost per request, per feature and per tenant, agent steps and tool calls per task, and cache hit rates, all broken down by model and prompt version. Online quality scores and a failure budget sit next to them, so a release that raises failed tasks or a runaway agent loop that burns tokens is visible the same day, with per-request and per-tenant spend limits as a safety net."

---

## 3. Golden datasets, regression suites, and offline/online evaluation

**In one sentence:** a **golden dataset** is a curated set of **representative inputs with expected outputs or grading criteria**; you run it as an **offline regression suite** before every model/prompt/retrieval change, and complement it with **online evaluation** of real traffic (sampled grading, user feedback, A/B tests) after release.

### In plain words
A cooking school keeps a fixed set of dishes every student must cook to the same standard before graduating (offline). After they start work, customers' comments and returned plates tell you how they do in real life (online).

### How it works
**Building the golden set**
- 50–500 cases to start, drawn from **real (anonymized) traffic**, plus **edge cases**, past **bugs/incidents**, adversarial and safety cases, and every important **intent / language / user type**.
- Each case: input (+ context/documents), and either an **exact expected answer**, **must-include / must-not-include facts**, a **reference answer** for similarity, or a **rubric** for a judge.
- Version it like code; add a case for every new bug ("regression test").

**Offline regression suite**
- Run the whole set for each candidate change; grade with **code checks** (exact match, JSON schema, regex, numeric tolerance, citations exist), **similarity**, or an **LLM judge**.
- Run each case **several times** (non-determinism) and compare **pass rates** with a tolerance; break down by category to spot targeted regressions.
- Gate releases: e.g. no category drops > 2 points, safety stays 100%.

**Online evaluation**
- Sample production traces and grade them (judge + human review); collect thumbs-up/down, edits, escalations, task completion.
- **A/B tests** or canaries for model/prompt changes with guardrail metrics (cost, latency, safety).
- Feed interesting failures back into the golden set — the loop that keeps it representative.

### Interview answer
"I build a versioned golden dataset from real anonymized traffic, edge cases, past incidents and safety cases, each with an expected answer, must-include and must-not-include facts, or a rubric. Before any model, prompt or retrieval change I run it offline several times per case, grade with code checks first and a calibrated judge where needed, and gate on per-category pass rates, with safety at 100%. After release I evaluate sampled production traffic online with judges, human review, user feedback and A/B tests, and feed failures back into the golden set."

---

## 4. Hallucination, grounding, task-success, and retrieval metrics

**In one sentence:** measure **retrieval** (did we fetch the right documents? — recall@k, precision@k, MRR, nDCG), **grounding / faithfulness** (is every claim in the answer **supported by** the retrieved context?), **hallucination rate** (unsupported or false claims), and **task success** (did the user's goal actually get done?).

### In plain words
A student writing an essay from library books: did they pick the right books (retrieval)? Does every sentence come from those books (grounding)? Did they invent quotes (hallucination)? Did they answer the essay question (task success)?

### How it works
**Retrieval metrics** (need labelled relevant documents per query)
| Metric | Meaning |
|---|---|
| **Recall@k** | fraction of relevant docs that appear in the top k — the most important for RAG (the model can't use what it never saw) |
| **Precision@k** | fraction of the top k that are relevant (noise in the context) |
| **MRR** (mean reciprocal rank) | 1 / rank of the first relevant doc, averaged |
| **nDCG@k** | rewards relevant docs near the top, with graded relevance |

**Answer metrics**
- **Faithfulness / groundedness:** split the answer into claims; a claim is grounded if the context **entails** it (checked with an NLI model or an LLM judge). Score = grounded claims / total claims.
- **Hallucination rate:** % of answers with at least one unsupported claim; **citation accuracy:** cited passages really support the sentence.
- **Answer relevance / completeness:** does it address the question and include the required facts?
- **Task success:** end-to-end outcome — ticket resolved, correct refund issued, code compiles and tests pass, the right tool calls with the right arguments. For agents, also **trajectory** checks (right tools, right order, no unnecessary or dangerous steps).
- Frameworks: RAGAS, TruLens, DeepEval, promptfoo, OpenAI Evals, Inspect.

### Interview answer
"I separate retrieval from generation. For retrieval I label relevant documents per query and track recall@k — the model can't use what wasn't retrieved — plus precision, MRR or nDCG. For answers I measure groundedness by splitting into claims and checking each is entailed by the retrieved context with an NLI model or a calibrated judge; the hallucination rate is the share of answers with unsupported claims, and I check citations too. On top of that, task success measures the real outcome — resolved ticket, correct tool calls and arguments — and for agents I also check the trajectory."

---

## 5. Judge-model calibration, human review, and inter-rater agreement

**In one sentence:** an **LLM-as-judge** grades outputs against a **rubric** at scale, but you must **calibrate** it against **human labels** (agreement, bias checks) before trusting it, and measure **inter-rater agreement** (Cohen's / Fleiss' kappa) among humans to know whether the rubric itself is clear.

### In plain words
Before letting a new teacher grade exams alone, you compare their grades with experienced teachers on the same papers. And if the experienced teachers disagree a lot with **each other**, the marking guide is the problem, not the new teacher.

### How it works
- **Rubric first:** specific, observable criteria ("cites a source for each price", "mentions the 14-day window"), a small scale (pass/fail or 1–4), and examples of each score.
- **Judge prompt:** give the rubric, the input, the context and the answer; ask for **reasoning, then a score** in a strict format; use a strong model; prefer **pairwise** comparison ("A or B better?") for subtle quality.
- **Known biases:** position bias (prefers the first option — swap and average), verbosity bias (prefers longer answers), self-preference (prefers its own model family), leniency. Test for each.
- **Calibration:** humans label 100–300 items; compute judge–human **agreement** and **Cohen's kappa**, plus precision/recall of "fail" detection. Tune the rubric/prompt until agreement is close to human–human agreement. Re-check when the judge model changes.
- **Inter-rater agreement:** κ = (p_observed − p_chance) / (1 − p_chance). Rough reading: < 0.4 poor, 0.4–0.6 moderate, 0.6–0.8 substantial, > 0.8 almost perfect. Low human κ → rewrite the rubric.
- **Human review** stays in the loop: spot-check judge decisions, review disagreements and high-stakes cases, and refresh the calibration set.

#### Modern C++ example — Cohen's kappa for human vs. human and judge vs. human, plus a position-bias test
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <vector>

double cohen_kappa(const std::vector<int>& a, const std::vector<int>& b) {       // labels 0 = fail, 1 = pass
    double n = static_cast<double>(a.size()), agree = 0, a1 = 0, b1 = 0;
    for (std::size_t i = 0; i < a.size(); ++i) { agree += a[i] == b[i]; a1 += a[i]; b1 += b[i]; }
    double po = agree / n, pe = (a1 / n) * (b1 / n) + (1 - a1 / n) * (1 - b1 / n);
    return (po - pe) / (1 - pe);
}

int main() {
    std::vector<int> human1{1,1,0,1,0,1,1,0,1,1, 0,1,1,1,0,1,0,1,1,1};
    std::vector<int> human2{1,1,0,1,0,1,0,0,1,1, 0,1,1,1,0,1,0,1,1,0};
    std::vector<int> judge_v1{1,1,1,1,0,1,1,1,1,1, 1,1,1,1,0,1,1,1,1,1};          // lenient: passes almost everything
    std::vector<int> judge_v2{1,1,0,1,0,1,1,0,1,1, 0,1,1,1,0,1,1,1,1,1};          // after rubric fixes
    std::cout << std::fixed << std::setprecision(2)
              << "human1 vs human2 kappa: " << cohen_kappa(human1, human2) << "  (rubric is clear enough)\n"
              << "judge v1 vs human1:     " << cohen_kappa(judge_v1, human1) << "  (too lenient, not trustworthy)\n"
              << "judge v2 vs human1:     " << cohen_kappa(judge_v2, human1) << "  (close to human-human -> usable)\n";

    // Position bias: ask "is A better than B?" for 100 pairs, then again with A and B swapped.
    int prefers_first_both_orders = 0;
    for (int i = 0; i < 100; ++i) {
        bool first_order_says_A = (i % 10) < 7;          // a biased judge: picks the first option 70% of the time
        bool swapped_says_B = (i % 10) < 7;              // ...and again the first option when swapped (now B)
        prefers_first_both_orders += first_order_says_A && swapped_says_B;
    }
    std::cout << "inconsistent verdicts after swapping order: " << prefers_first_both_orders
              << "% -> position bias; average both orders or discard inconsistent pairs\n";
}
```

**Output:**
```text
human1 vs human2 kappa: 0.78  (rubric is clear enough)
judge v1 vs human1:     0.41  (too lenient, not trustworthy)
judge v2 vs human1:     0.87  (close to human-human -> usable)
inconsistent verdicts after swapping order: 70% -> position bias; average both orders or discard inconsistent pairs
```

### Interview answer
"I use an LLM judge only with a specific rubric, reasoning before a strict score, and pairwise comparisons for subtle quality. Before trusting it I calibrate on a few hundred human-labelled items — agreement and Cohen's kappa against humans, and how well it catches failures — and I test for position, verbosity and self-preference bias, for example by swapping answer order. I also measure human-human kappa: if humans disagree, the rubric needs work. Humans keep reviewing disagreements and high-stakes cases, and I recalibrate whenever the judge model changes."

---

## 6. Tool-call tracing, execution-step replay, and state checkpoint tests

**In one sentence:** **trace** every agent step (model input/output, tool name, arguments, result, timing, tokens), **record** runs so you can **replay** them deterministically with the recorded model and tool responses, and **checkpoint** agent state so tests can verify that a run **resumes correctly** after a crash or a human approval pause.

### In plain words
A flight recorder (black box): every instrument reading and pilot action is saved. After an incident you can replay the flight exactly. And long flights can land for fuel and continue from the same point, not restart from the departure airport.

### How it works
**Tracing**
- One **trace per task**, one **span per step** (LLM call, tool call, retrieval, guardrail), with prompt/version, model, token counts, arguments, results (redacted), errors and latency — OpenTelemetry GenAI conventions, LangSmith, Langfuse, Phoenix.
- Tool-call assertions in tests: **right tool, right arguments (schema-valid), right order, no forbidden tools, bounded count**.

**Record and replay**
- Record model responses and tool results for a run (a "cassette"); replay feeds them back by step so the agent code runs **deterministically** without calling the model or real tools.
- Use replay to **debug** production failures, to **regression-test** orchestration code changes, and to compare a new model on the **same** tool context (replay tools, call the model live).
- Detect **divergence**: if the code under test requests a different tool than the recording, report the step where it diverged.

**Checkpoint tests**
- Durable agents (LangGraph checkpointers, Temporal, AWS Step Functions) save state after each step. Test: crash after step k → resume → **same final result**, **no duplicated side effects** (idempotent tools or "already done" markers), and correct behaviour after a **human approval pause** that may last days.

### Interview answer
"I trace every agent step as a span — model call with prompt version and tokens, each tool call with validated arguments, result, latency and errors — and assert in tests on the right tools, arguments, order and counts. Recorded runs become cassettes for deterministic replay, so I can debug production failures and regression-test orchestration changes without calling the model or real tools, and replay reports exactly where a new version diverges. With durable checkpoints I test crash-and-resume and long approval pauses, asserting the same final result and no duplicated side effects."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Why special | non-deterministic, fuzzy correctness, plausible failures, changes with model/prompt/tools/data |
| Recovery tests | tool errors → bounded retries / alternatives / safe failure; invalid outputs → validate + re-ask once; turn budget |
| Handoff | low confidence, risky action, repeated failure → human with context; approval rules in **code** |
| Safety suite | disallowed requests, prompt injection in docs/tool outputs, tool misuse; 100% gate; every change |
| Dashboards | RED + TTFT, tokens in/out, cost per request/feature/tenant, steps per task, cache hits, quality, failure budget; by model/prompt version |
| Golden set | real + edge + incident + safety cases; versioned; expected answer / must-include / rubric |
| Offline vs. online | regression suite before release (repeated runs, per-category gates) vs. sampled production grading, feedback, A/B |
| Retrieval | recall@k (most important), precision@k, MRR, nDCG |
| Grounding | claims entailed by context; hallucination rate; citation accuracy |
| Task success | real outcome + trajectory checks for agents |
| LLM judge | rubric, reasoning then score, pairwise; biases: position, verbosity, self-preference |
| Calibration | judge vs. human agreement + Cohen's kappa ≈ human-human kappa; recalibrate on judge change |
| Tracing | span per step: prompt version, model, tokens, tool, args, result, latency |
| Replay | cassettes → deterministic runs; report divergence step |
| Checkpoints | crash/resume and approval pauses → same result, no duplicate side effects |
