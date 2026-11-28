# Evaluation and Testing for LLM Agents — Proving an Agent Works Before (and After) It Ships

> **What you'll learn:** how to test and evaluate agents at every level:
> - **unit tests** for tools, nodes and validators;
> - **integration tests** with mocked tools;
> - **trajectory tests** (right tools, right order, right stop);
> - **end-to-end tests**;
> - **success criteria** defined up front;
> - **golden datasets**;
> - **metrics** (task success, groundedness, tool correctness, cost, latency);
> - **LLM-as-judge**;
> - **human review and error taxonomies**;
> - **regression tests**;
> - **robustness tests**;
> - **offline evals vs. online A/B tests**.
>
> Parts built on a real algorithm include a runnable C++ implementation.
>
> **Prerequisites:** [Testing Foundations](../Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md) and [LLM and Agent Evaluation](../Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md) (the general evaluation guide this one builds on, focused here on agent systems).

## Table of Contents
1. [Agent trajectory tests: tool selection, ordering, and stop behavior](#1-agent-trajectory-tests-tool-selection-ordering-and-stop-behavior)
2. [Defining success criteria before building an agent](#2-defining-success-criteria-before-building-an-agent)
3. [End-to-end tests for complete multi-step agent workflows](#3-end-to-end-tests-for-complete-multi-step-agent-workflows)
4. [Golden datasets and representative real-world test cases](#4-golden-datasets-and-representative-real-world-test-cases)
5. [Human review, pairwise comparisons, and error taxonomy](#5-human-review-pairwise-comparisons-and-error-taxonomy)
6. [Integration tests with mocked external tools and APIs](#6-integration-tests-with-mocked-external-tools-and-apis)
7. [LLM-as-judge: rubrics, calibration, bias, and limitations](#7-llm-as-judge-rubrics-calibration-bias-and-limitations)
8. [Measures: task success, groundedness, tool correctness, cost, and latency](#8-measures-task-success-groundedness-tool-correctness-cost-and-latency)
9. [Offline evaluation vs. online experiments and A/B testing](#9-offline-evaluation-vs-online-experiments-and-ab-testing)
10. [Regression tests after prompt, tool, model, or retrieval changes](#10-regression-tests-after-prompt-tool-model-or-retrieval-changes)
11. [Robustness testing: invalid inputs, ambiguous tasks, and tool outages](#11-robustness-testing-invalid-inputs-ambiguous-tasks-and-tool-outages)
12. [Unit testing tools, nodes, validators, and deterministic logic](#12-unit-testing-tools-nodes-validators-and-deterministic-logic)
13. [Cheat sheet](#cheat-sheet)

**The testing pyramid for agents:**
```text
            online A/B + monitoring (9)            <- real users, slow, expensive
          end-to-end workflow tests (3)
        trajectory tests (1) + LLM evals (7, 8)    <- non-deterministic: score over many cases
      integration tests with mocked tools (6)
    unit tests: tools, nodes, validators (12)      <- deterministic, fast, many
```

Suggested order: **2 → 12 → 6 → 1 → 3 → 4 → 8 → 7 → 5 → 10 → 11 → 9**.

---

## 1. Agent trajectory tests: tool selection, ordering, and stop behavior

**In one sentence:** a **trajectory** is the sequence of steps an agent took: which tools, with which arguments, in which order, and when it stopped. **Trajectory tests** check it, beyond the final answer: the agent **picked the right tools**, called them **in a valid order**, **passed correct arguments**, **didn't call forbidden tools**, and **stopped** at the right time (not too early, no loops).

### In plain words
Grading a maths exam on the working, not just the final number. A correct answer reached by guessing, or by taking 40 unnecessary steps, is still a problem.

### How it works
| Check | Example assertion |
|---|---|
| **Required tools** | `get_order` was called |
| **Forbidden tools** | `issue_refund` NOT called without `approval` |
| **Ordering** | `find_user` before `list_orders` (dependency) |
| **Arguments** | `get_order.order_id == 1042` |
| **Efficiency** | ≤ 6 steps; no identical call repeated more than twice |
| **Stop behaviour** | ended with a final answer, or asked a clarifying question when info was missing ([stop conditions](./Agent%20Fundamentals%20and%20Decision-Making/Stop%20conditions%2C%20turn%20budgets%2C%20iteration%20limits%2C%20and%20fallback%20paths.md)) |

- **Matching modes:** **exact** sequence (strict, brittle), **in-order subsequence** (the required steps appear in order, and extra harmless steps are allowed), **unordered set**, or an LLM judge for "reasonable trajectory".
- Run each case several times and report a **pass rate**, because trajectories are non-deterministic.

### Interview answer
"Beyond the final answer, I test the trajectory: required tools are called, forbidden or unapproved side-effecting tools are not, dependent steps happen in order, key arguments are right, the step count stays within a budget with no repeated loops, and the agent stops with an answer or asks for clarification when it should. I usually match an in-order subsequence of required steps so harmless extra steps don't fail the test, use an LLM judge for softer 'reasonable path' checks, and run each case several times to report pass rates, since trajectories vary."

---

## 2. Defining success criteria before building an agent

**In one sentence:** before writing prompts or picking a framework, write down **what "good" means**: the task and its users, **measurable success metrics with thresholds** (task success rate, accuracy, groundedness, escalation rate), **constraints** (latency, cost per task, safety rules), **failure severities**, the **baseline** you must beat (human or current system), and how you'll measure it. That gives you an eval set from day one.

### In plain words
Before building a bridge, agree on how many cars it must carry, how much it may cost, and how you'll test it. Otherwise you'll never know whether it's finished, or whether it's safe.

### How it works
- **Task definition:** inputs, expected outputs, in-scope vs. out-of-scope requests, who the users are.
- **Metrics with thresholds:**
  - "≥ 85% of tickets resolved correctly without escalation";
  - "≥ 95% of answers grounded";
  - "0 unapproved refunds";
  - "p95 < 8 s";
  - "≤ 3 cents per task".
- **Severity levels:** a critical failure (wrong refund, data leak) is not the same as a minor one (slightly verbose). Some failures are **zero-tolerance** gates.
- **Baseline:** human agents, the current rules engine, or a simple prompt. The agent must beat it to be worth its cost.
- **Measurement plan:** a golden set (start with 50–100 real cases), automated checks plus judges, human review sampling, and online metrics after launch.
- This also decides **whether you need an agent at all**: a workflow might meet the criteria more cheaply ([workflows vs. agents](./Agent%20Fundamentals%20and%20Decision-Making/LLM%20workflows%20vs.%20autonomous%20agents%3A%20when%20each%20is%20appropriate.md)).

### Interview answer
"Before building anything I define success with stakeholders: the task and its scope, measurable metrics with thresholds such as task success, groundedness and escalation rate, constraints on latency, cost and safety, failure severities with zero-tolerance gates for things like unapproved actions or data leaks, and a baseline — the human team or the current system — that the agent must beat. That becomes a launch scorecard and an initial golden set from real cases, and it often shows whether a simpler workflow would meet the bar without an agent."

---

## 3. End-to-end tests for complete multi-step agent workflows

**In one sentence:** **end-to-end (E2E) tests** run the **whole system**: API, orchestration, real model, retrieval, and tools (in a staging/sandbox environment or with high-fidelity fakes). They run realistic scenarios from start to finish and assert on **outcomes and side effects**: the ticket was created, the email was drafted not sent, the state was persisted, the user got a correct answer. Because they're slow and non-deterministic, you keep **fewer** of them, run them on important changes, and score them by pass rate.

### In plain words
A dress rehearsal: the full cast, costumes and stage, running the whole play once — not just each actor practising their lines alone.

### How it works
- **Environment:** staging services, sandbox accounts (payment test mode, a test CRM), and a seeded test database with known data, reset between runs.
- **Scenario format:** `{user persona, initial state, conversation script (multi-turn), expected end state, forbidden effects}`.
- **Assertions:**
  - The **end state** in systems (DB rows, tickets, emails in the outbox).
  - The **final answer** (rubric or judge).
  - The **trajectory** (key steps).
  - **Budgets** (steps, cost, time).
- **Simulated users:** an LLM plays the customer from a persona and a goal. This is useful for multi-turn flows, but control its variability.
- **Run cadence:** nightly and before releases; a small smoke subset on each PR. Track flakiness and pass rate over time ([Backend and Distributed System Testing](../Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md)).

### Interview answer
"End-to-end tests run complete scenarios through the real stack — API, orchestration, real model, retrieval and tools — in staging with sandbox accounts and seeded data reset between runs. Each scenario has a persona, initial state, a multi-turn script or a simulated user, the expected end state, and forbidden effects. I assert on outcomes in the systems — records created, emails drafted but not sent — plus the final answer via a rubric, key trajectory steps and budgets. They're slow and non-deterministic, so there are fewer of them, run nightly and before releases with a smoke subset per PR, and I track pass rates and flakiness."

---

## 4. Golden datasets and representative real-world test cases

**In one sentence:** a **golden dataset** is a curated, versioned set of test cases (inputs plus expected outputs, reference facts, or grading criteria) that **represents real usage**. It covers common requests, important edge cases, hard and adversarial inputs, and out-of-scope or unanswerable ones, with labels reviewed by experts. It's the backbone of offline evaluation and regression testing.

### In plain words
A teacher's exam bank, built from questions real students actually ask, including the tricky ones and a few trick questions, with model answers checked by experienced teachers.

### How it works
- **Sources:**
  - **Production logs and traces** (best: real distribution, sampled and anonymized).
  - Support tickets and FAQs.
  - Expert-written cases.
  - Failure cases from incidents.
  - Synthetic generation, *reviewed by humans*.
- **Coverage:** stratify by intent, difficulty, language (e.g. Arabic/English), customer tier and risk. Make sure rare-but-critical cases are present.
- **Labels:** expected answer or key facts, expected tool calls, an "should abstain/escalate" flag, and severity. Use **two annotators + adjudication** for ambiguous cases.
- **Size:** start with ~50–200 good cases. Grow from every production failure ("every bug becomes a test").
- **Hygiene:**
  - Version it.
  - Keep a **held-out** split, so you don't over-tune prompts to the eval.
  - Refresh it as usage changes.
  - Remove PII.
  - Record provenance.

### Interview answer
"I build the golden set mostly from sampled, anonymized production traces, plus expert-written edge cases, past failures, and reviewed synthetic cases. It's stratified to match the real traffic mix by intent, language and difficulty, while deliberately including rare but critical cases, adversarial inputs and unanswerable questions. Each case has expected facts or answers, expected tool behaviour, abstain or escalate flags and severity, with ambiguous labels adjudicated by two reviewers. It's versioned, PII-free, has a held-out split to avoid overfitting prompts, and grows from every production failure."

---

## 5. Human review, pairwise comparisons, and error taxonomy

**In one sentence:**
- **Human review** is the ground truth that calibrates everything else: experts grade samples with a rubric.
- **Pairwise comparison** ("which of A or B is better?") is more reliable than absolute 1–10 scores for comparing versions.
- An **error taxonomy** categorizes failures (retrieval miss, wrong tool, hallucination, formatting, policy violation…), so you can count them and fix the biggest categories first.

### In plain words
Taste-testers compare two cakes side by side ("this one's better"), which is easier than giving each a score out of 10. Then the bakery keeps a tally of complaints by type ("too sweet", "burnt", "wrong flavour") and fixes the most common one.

### How it works
- **Review setup:**
  - A clear rubric with examples.
  - Trained reviewers (domain experts for domain tasks).
  - Inter-annotator agreement (Cohen's κ) to check the rubric is clear.
  - Annotation queues (LangSmith, Langfuse, Label Studio).
- **Sampling:** random production samples, plus low-confidence, negative-feedback and escalated cases.
- **Pairwise:** show outputs A and B for the same input, **blind and in random order**. Aggregate win rate (with ties), or Elo/Bradley–Terry for many systems.
- **Error taxonomy** (open coding → categories):

  | Category | Examples |
  |---|---|
  | Retrieval | relevant doc not retrieved; stale doc used |
  | Grounding | hallucinated fact; wrong citation |
  | Tool use | wrong tool, bad args, ignored tool error |
  | Reasoning / planning | skipped step, wrong conclusion, loop |
  | Instruction / format | ignored constraint, invalid JSON, wrong language |
  | Safety / policy | leaked data, unapproved action, unsafe content |
  | UX | too long, unclear, didn't ask a clarifying question |

- Use the counts to prioritize work and to add targeted eval cases ([error analysis](../Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md)).

### Interview answer
"Human review is the ground truth I calibrate automated metrics against: trained reviewers grade samples with a clear rubric, and I check inter-annotator agreement. I sample production traffic randomly, plus low-confidence, negatively rated and escalated cases. To compare versions, blind pairwise comparisons in random order are more reliable than absolute scores, giving a win rate or Elo-style ranking. Failures are coded into an error taxonomy — retrieval, grounding, tool use, reasoning, format, safety, UX — and the counts, weighted by severity, tell me what to fix first and which eval cases to add."

---

## 6. Integration tests with mocked external tools and APIs

**In one sentence:** **integration tests** run the agent's real orchestration (graph, prompts, tool layer, often a real or recorded model) against **mocked or faked external services** — fake CRM, fake payment API, recorded HTTP responses. You get deterministic, fast, safe tests of how components work together, including **error paths** (timeouts, 429s, bad data) that are hard to trigger with real services.

### In plain words
A flight simulator: real controls and real procedures, but a simulated airport and simulated weather, so you can practise engine failures safely and as often as you like.

### How it works
- **What's real:** your code — the graph, tool wrappers, validators, state store (often an in-memory or containerized DB).
- **What's mocked:**
  - External APIs: in-process fakes, WireMock/mock servers, or recorded responses (VCR-style cassettes).
  - The model, where you want determinism: a **scripted/fake model** that returns predetermined tool calls, or **recorded** real model responses.
- **Scenarios:** happy path; tool returns empty; tool times out → retry → success; 429 → backoff; malformed tool response → validation error goes back to the model; permission denied → the agent explains.
- **Assertions:** the calls made to the mock (count, args, idempotency key), state transitions, and the final response.
- **Contract tests** keep mocks honest against the real API's schema ([contracts](./Tool-Use-Integrations-and-Protocols.md#7-tool-argument-schemas-and-inputoutput-contracts)).

### Interview answer
"Integration tests run our real orchestration — graph, prompts, tool wrappers, validators and state store — against mocked external services: in-process fakes, mock servers or recorded responses, often with a scripted fake model or recorded model responses for determinism. That lets me test error paths reliably — timeouts with retries, 429s with backoff, malformed or empty tool data, permission errors — and assert on the calls each mock received, such as counts, arguments and reused idempotency keys, as well as state transitions and the final response. Contract tests keep the mocks aligned with the real APIs."

---

## 7. LLM-as-judge: rubrics, calibration, bias, and limitations

**In one sentence:** **LLM-as-judge** uses a model to grade outputs against a **rubric** (pass/fail per criterion, or a small score scale, ideally with a written rationale), which scales evaluation of open-ended answers. The judge must be **calibrated against human labels**, and you must control its **biases**: position, verbosity, self-preference, and leniency. It is a helpful **proxy**, not ground truth.

### In plain words
A teaching assistant marks essays using the teacher's marking guide. Before trusting them, the teacher double-marks a batch to check they agree, and watches whether the TA gives higher marks to longer essays or to the first essay they read.

### How it works
- **Rubric design:**
  - Specific, binary or 3-point criteria ("Does every claim cite a source? yes/no") beat a vague "rate quality 1–10".
  - One criterion per judge call for hard cases.
  - Include reference answers/sources when available.
  - Ask for reasoning **before** the verdict.
- **Calibration:**
  - Label ~100–200 cases by humans.
  - Measure judge–human **agreement** (accuracy, Cohen's κ, precision/recall on "fail").
  - Iterate on the rubric until agreement is high.
  - Re-check when the judge model changes.
- **Biases and mitigations:**

  | Bias | Mitigation |
  |---|---|
  | **Position** (prefers first/second) | randomize order, judge both orders and require consistency |
  | **Verbosity** (prefers longer) | rubric penalizes padding; length-controlled comparisons |
  | **Self-preference** | use a different model family as the judge |
  | **Leniency / sycophancy** | binary criteria, reference answers, few-shot examples of failures |

- **Limitations:**
  - It can't verify facts it doesn't know (give it the sources).
  - It is weak on specialized domains and maths.
  - It can be prompt-injected by the output being judged.
  - It adds cost.
  - Use code checks wherever possible (schema, exact match, tool assertions).

#### Modern C++ example — calibrate a judge against human labels (agreement, Cohen's kappa) and detect position bias by swapping order
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> human{1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1};     // 1 = pass
    std::vector<int> judge{1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1};
    int n = human.size(), agree = 0, h1 = 0, j1 = 0, tp_fail = 0, human_fail = 0;
    for (int i = 0; i < n; ++i) { agree += human[i] == judge[i]; h1 += human[i]; j1 += judge[i]; if (human[i] == 0) { ++human_fail; tp_fail += judge[i] == 0; } }
    double po = double(agree) / n, pe = (double(h1) / n) * (double(j1) / n) + (1 - double(h1) / n) * (1 - double(j1) / n);
    double kappa = (po - pe) / (1 - pe);
    std::cout << std::fixed << std::setprecision(2) << "agreement " << po << ", Cohen's kappa " << kappa << ", judge catches " << tp_fail << "/" << human_fail << " human-labelled failures\n";
    std::cout << (kappa >= 0.6 ? "acceptable, but the judge is lenient: tighten the rubric for false passes\n" : "too low: revise rubric\n");

    // Position-bias check: the same pair judged in both orders; a consistent judge flips its answer when the order flips.
    std::vector<std::pair<char, char>> ab_then_ba{{'A', 'B'}, {'A', 'A'}, {'B', 'A'}, {'A', 'A'}, {'A', 'B'}};
    int consistent = 0;
    for (auto [first, second] : ab_then_ba) consistent += first != second;
    std::cout << "order-swap consistency " << consistent << "/" << ab_then_ba.size() << " -> inconsistent pairs show a first-position preference; count them as ties\n";
}
```

**Output:**
```text
agreement 0.90, Cohen's kappa 0.76, judge catches 5/7 human-labelled failures
acceptable, but the judge is lenient: tighten the rubric for false passes
order-swap consistency 3/5 -> inconsistent pairs show a first-position preference; count them as ties
```

### Interview answer
"LLM-as-judge scales evaluation of open-ended outputs, but I treat it as a calibrated proxy. Rubrics are specific and preferably binary per criterion, include reference answers or sources, and ask for reasoning before the verdict. I calibrate on a human-labelled set, measuring agreement, Cohen's kappa and especially recall on failures, and iterate on the rubric before trusting it, re-checking whenever the judge model changes. I mitigate position bias by randomizing and judging both orders, verbosity bias with length-aware rubrics, and self-preference by using a different model family. And wherever a deterministic check is possible — schemas, exact values, tool assertions — I use code instead of a judge."

---

## 8. Measures: task success, groundedness, tool correctness, cost, and latency

**In one sentence:** evaluate agents on a **balanced scorecard**:
- **task success**: did it achieve the user's goal, end to end;
- **groundedness / faithfulness**: claims supported by sources or tool results;
- **tool correctness**: right tool, right args, results used properly;
- **efficiency**: steps, **cost** and **latency** per task;
- **safety** gates.

Report them **per segment**, not just as one average.

### In plain words
Judging a delivery driver: did the parcel arrive (success), was the delivery note truthful (groundedness), did they use the right route and van (tool correctness), and how much fuel and time did it take (cost, latency)?

### How it works
| Measure | Definition | How |
|---|---|---|
| **Task success rate** | % of cases where the goal was met | code checks on end state, reference match, judge with rubric |
| **Groundedness** | supported claims / total claims | NLI or judge against retrieved context ([RAG answer eval](./Retrieval-Augmented-Generation.md#1-answer-evaluation-faithfulness-factual-correctness-and-relevance)) |
| **Tool correctness** | correct tool selection, args, and order | trajectory assertions ([section 1](#1-agent-trajectory-tests-tool-selection-ordering-and-stop-behavior)) |
| **Cost per task** | tokens × price, + tool costs | usage logs ([budgets](./Production-Reliability-and-Observability.md#12-token-usage-per-step-cost-and-latency-budgets)) |
| **Latency** | p50/p95 end-to-end, TTFT | traces |
| **Efficiency** | steps / tool calls per task | trajectories |
| **Safety** | policy violations, unapproved actions (should be 0) | checks + red-team set |

- **Segment** by intent, language, difficulty and tenant. A 90% average can hide a 60% Arabic-language segment.
- Report **confidence intervals**. With 100 cases, ±~6 percentage points is normal noise.

### Interview answer
"I use a balanced scorecard. Task success means the user's goal was actually achieved, checked on end state or with rubric judges. Groundedness is the share of claims supported by retrieved context or tool results. Tool correctness covers selection, arguments and order. Efficiency is steps per task, plus cost per task and p50 and p95 latency, and safety violations act as zero-tolerance gates. I always break results down by segment such as intent, language and difficulty, because averages hide weak slices, and I report confidence intervals so I don't overreact to noise on small eval sets."

---

## 9. Offline evaluation vs. online experiments and A/B testing

**In one sentence:**
- **Offline evaluation** runs a candidate on a fixed dataset before release: fast, cheap, safe and repeatable, but only as good as the dataset.
- **Online evaluation** measures real users: **A/B tests**, shadow and canary traffic, user feedback and business KPIs. It is the truth about impact, but slower, noisier and riskier.

Use offline evals to **gate** changes, and online experiments to **decide** between candidates that pass.

### In plain words
Testing a new recipe in your own kitchen with a tasting panel (offline), then serving it to half the restaurant's customers for two weeks and comparing orders and reviews (online).

### How it works
| | Offline | Online |
|---|---|---|
| Data | golden set, replayed traces | live traffic |
| Speed | minutes | days–weeks |
| Metrics | success, groundedness, tool correctness, cost | conversion, resolution rate, CSAT, escalations, retention, thumbs-up, latency |
| Risk | none | users see the change → use guardrails |
| Blind spots | dataset drift, judge bias | novelty effects, noise, needs traffic |

- **A/B test design:**
  - Randomize by **user** (sticky).
  - Pick a **primary metric** plus guardrail metrics (errors, latency, cost, safety).
  - Do a power analysis for sample size.
  - Pre-register the duration.
  - Avoid peeking, or use sequential testing.
  - Check segments.
- **Shadow mode:** the new version runs on live inputs but its outputs aren't shown. Compare offline with judges. It's safe for risky changes.
- **Online evaluators:** judges on sampled production traffic catch drift between releases ([release controls](./Production-Reliability-and-Observability.md#6-model-and-prompt-versioning-release-controls-and-rollback)).

#### Modern C++ example — a two-proportion z-test on an A/B experiment's resolution rate, with a guardrail check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>

int main() {
    // Primary metric: conversations resolved without human escalation.
    const double nA = 12000, resolvedA = 8640, nB = 12000, resolvedB = 8880;
    double pA = resolvedA / nA, pB = resolvedB / nB, p = (resolvedA + resolvedB) / (nA + nB);
    double z = (pB - pA) / std::sqrt(p * (1 - p) * (1 / nA + 1 / nB));
    double p_value = std::erfc(std::fabs(z) / std::sqrt(2.0));                         // two-sided
    std::cout << std::fixed << std::setprecision(4) << "control " << pA << " vs treatment " << pB << " (+" << (pB - pA) * 100 << " pts), z=" << std::setprecision(2) << z
              << ", p=" << std::setprecision(4) << p_value << '\n';
    double p95_A = 6.1, p95_B = 6.4, cost_A = 2.2, cost_B = 2.5;                      // guardrails
    bool guardrails_ok = p95_B <= p95_A * 1.1 && cost_B <= cost_A * 1.2;
    std::cout << "guardrails: p95 " << std::setprecision(1) << p95_B << "s vs " << p95_A << "s, cost " << cost_B << "c vs " << cost_A << "c -> " << (guardrails_ok ? "ok" : "violated") << '\n';
    std::cout << (p_value < 0.05 && guardrails_ok ? "ship treatment (significant win, guardrails held)" : "do not ship yet") << '\n';
}
```

**Output:**
```text
control 0.7200 vs treatment 0.7400 (+2.0000 pts), z=3.49, p=0.0005
guardrails: p95 6.4s vs 6.1s, cost 2.5c vs 2.2c -> ok
ship treatment (significant win, guardrails held)
```

### Interview answer
"Offline evaluation on golden sets and replayed traces is fast, cheap and safe, so it gates every change, but it's limited by how representative the dataset is and by judge bias. Online evaluation measures real impact: shadow traffic for risky changes, canaries, and A/B tests randomized per user with a pre-registered primary metric such as resolution rate, guardrail metrics like latency, cost, errors and safety, a sample size from a power analysis, and no peeking. Online judges on sampled traffic catch drift between releases. Offline tells me a change is safe to try; online tells me it's actually better."

---

## 10. Regression tests after prompt, tool, model, or retrieval changes

**In one sentence:** any change can silently break behaviour that used to work:
- a prompt edit;
- a new tool or schema;
- a model upgrade;
- a re-chunked index or new embedding model;
- a parameter tweak.

So every change runs a **regression suite**: must-pass cases and the golden set, compared **against the current production version**. CI **blocks** merges that reduce quality beyond a tolerance or break any must-pass case.

### In plain words
After renovating one room, you check that the lights, water and doors in every other room still work — automatically, every time.

### How it works
- **Suite layers:**
  - **Must-pass cases** (critical behaviours, past incidents — zero tolerance).
  - The **golden set** (aggregate thresholds).
  - **Unit/integration tests** (deterministic).
  - **Safety/injection tests**.
- **Compare to baseline:** run both versions on the same cases. Report deltas per metric and per segment, and list **newly failing** cases (a flip from pass to fail), not just averages.
- **Non-determinism:** run cases several times, or at temperature 0. Use tolerance bands (e.g. −2 points), with statistical tests for bigger sets.
- **Triggers:** PRs touching prompts, tools, retrieval config, model IDs or dependencies, plus scheduled runs to catch provider-side drift.
- **Outputs:** an eval report attached to the PR (LangSmith/Braintrust/promptfoo experiment comparisons) ([prompt versioning](./Prompt-Engineering-and-Structured-Outputs.md#5-prompt-templates-versioning-regression-testing-and-reproducibility)).

### Interview answer
"Prompts, tools, models, retrieval settings and parameters all change behaviour, so any such change triggers a regression suite in CI: deterministic unit and integration tests, must-pass critical cases including past incidents, safety and injection tests, and the golden set. I run the candidate and the current production version on the same cases, with repeats to handle non-determinism, and report per-metric and per-segment deltas plus the list of cases that flipped from pass to fail. The merge is blocked on any must-pass failure or a drop beyond tolerance. Scheduled runs catch provider-side drift too."

---

## 11. Robustness testing: invalid inputs, ambiguous tasks, and tool outages

**In one sentence:** **robustness tests** check the agent behaves **safely and sensibly when things go wrong**:
- **invalid or malicious inputs**: empty, huge, wrong language, prompt injection;
- **ambiguous or impossible tasks**: it should ask, clarify, or abstain;
- **tool failures**: timeouts, errors, rate limits, garbage data. It should retry, fall back, or explain, never crash, loop, or invent results.

### In plain words
Crash-testing a car: not only "does it drive on a sunny day?", but "what happens on ice, with a flat tyre, or when the driver presses every button at once?"

### How it works
| Category | Test inputs | Expected behaviour |
|---|---|---|
| **Invalid input** | empty, 200K-character paste, emoji-only, mixed languages, malformed IDs | validate, ask for a correction, truncate safely |
| **Adversarial** | direct/indirect prompt injection, jailbreaks, PII-extraction attempts | refuse/ignore, no unsafe tool calls ([security](./Security-Privacy-and-Safety.md#6-prompt-injection-direct-and-indirect-attacks-via-retrieved-contenttools)) |
| **Ambiguous** | "cancel my order" (user has 3 orders) | ask which one; don't guess for side effects |
| **Impossible / out of scope** | "refund an order from another store" | explain, abstain, escalate |
| **Tool outage** | timeouts, 500s, 429s, empty results, schema-violating responses | retry within budget, fallback, honest message; **no fabricated tool results** |
| **Perturbations** | typos, paraphrases, reordered facts | same outcome (consistency) |

- Use **fault injection** in the tool layer (chaos testing) and fuzzing of inputs. Track the **robustness pass rate** separately from the happy-path one.

### Interview answer
"Robustness tests cover what happy-path evals miss. Invalid inputs — empty, enormous, malformed IDs, mixed languages — should be validated or clarified. Adversarial inputs like direct and indirect prompt injection should be refused without unsafe tool calls. Ambiguous requests, especially before side effects, should trigger a clarifying question, and impossible ones an explanation or escalation. Tool failures — timeouts, errors, rate limits, empty or schema-violating responses — are injected in the tool layer to confirm the agent retries within budget, falls back and tells the user honestly, never fabricating results or looping. I also test perturbations like typos and paraphrases for consistency, and track robustness pass rates separately."

---

## 12. Unit testing tools, nodes, validators, and deterministic logic

**In one sentence:** most of an agent system is **ordinary deterministic code**:
- tool wrappers;
- argument and output **validators**;
- parsers;
- routing functions;
- state reducers;
- budget and permission checks;
- prompt template rendering.

Cover all of it with fast, standard **unit tests**, and test graph **nodes** in isolation by injecting a **fake model**, so failures in the deterministic parts are never confused with model variability.

### In plain words
Before testing the whole orchestra, make sure each instrument is in tune. Most bugs in agent systems are a string out of tune in the plain code, not the soloist (the model).

### How it works
- **Test targets:**
  - **Tools:** correct API mapping, error translation (`404 → NOT_FOUND`), pagination, and truncation.
  - **Validators:** schema checks, business rules, edge values.
  - **Routers / conditional edges:** given state X, the next node is Y.
  - **Reducers:** merging updates, including parallel merges.
  - **Guards:** permission checks, approval gating, budgets, stop conditions.
  - **Prompt rendering:** all variables filled and escaped; snapshot tests of the rendered prompt.
  - **Parsers:** handling code fences, partial JSON.
- **Nodes:** call the node function with a hand-built state and a **fake model** that returns a fixed message/tool call, then assert on the returned state update.
- **Style:** table-driven tests, property-based tests for parsers and validators, and run in milliseconds on every commit (GoogleTest/Catch2 in C++, pytest in Python) ([Testing Foundations](../Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md)).

### Interview answer
"Most of an agent system is deterministic code, and I unit-test it like any other code: tool wrappers and their error translation, argument and output validators including boundary values, parsers, routing functions for conditional edges, state reducers, permission, approval and budget guards, and prompt rendering with snapshot tests. Graph nodes are tested in isolation by injecting a fake model that returns a fixed reply or tool call, then asserting on the state update. These table-driven and property-based tests run in milliseconds on every commit, so deterministic bugs are caught before they're confused with model variability in higher-level evals."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Trajectory tests | required/forbidden tools, in-order subsequence, args, step budget, correct stop; pass rate over repeats |
| Success criteria | define first: metrics + thresholds, constraints, severities, zero-tolerance gates, baseline, measurement plan |
| E2E tests | full stack in staging with sandbox accounts; scripted or simulated users; assert end state + forbidden effects; few, nightly |
| Golden datasets | from real traces + experts + failures; stratified; labelled & adjudicated; versioned; held-out split; grows from bugs |
| Human review | rubric + agreement (κ); blind pairwise > absolute scores; error taxonomy weighted by severity |
| Integration tests | real orchestration + mocked APIs + scripted/recorded model; inject errors; assert on calls (idempotency keys) |
| LLM-as-judge | binary rubrics, references, reasoning first; calibrate vs. humans; position/verbosity/self bias; prefer code checks |
| Measures | task success, groundedness, tool correctness, cost, latency, steps, safety; segment + confidence intervals |
| Offline vs. online | offline gates (fast, safe); online decides (A/B per user, primary + guardrails, power, no peeking); shadow, canary |
| Regression | every prompt/tool/model/retrieval change; compare to baseline; per-case flips; must-pass gates; scheduled drift runs |
| Robustness | invalid/huge/adversarial inputs, ambiguity → clarify, impossible → abstain, tool faults → retry/fallback/honest, no fabrication |
| Unit tests | tools, validators, routers, reducers, guards, prompt rendering; nodes with a fake model; fast, every commit |
