# Agentic System Design Interview Practice — Worked Designs You Can Reuse

> **What you'll learn:**
> - a repeatable framework for agentic system design interviews;
> - **back-of-the-envelope maths** (throughput, token cost, p95 latency);
> - **pipeline vs. agent** reasoning;
> - eight worked designs: code-review/bug-triage agent, CSV/Excel validation agent, customer-support agent, document research agent, job-search agent, multi-agent research workflow, incident-response assistant, and how to enforce approvals;
> - how to explain **failure modes, recovery, evaluation and monitoring**.
>
> **Prerequisites:** the other guides in this folder, especially [Tool Use](./Tool-Use-Integrations-and-Protocols.md), [RAG](./Retrieval-Augmented-Generation.md), [Production Reliability](./Production-Reliability-and-Observability.md), [Evaluation](./Evaluation-and-Testing.md) and [Security](./Security-Privacy-and-Safety.md). General system design background: [System Design](../System%20Design/Scalability.md).

## The 45-minute framework (use it for every design below)
```text
 1. Clarify (5 min)      users, task, inputs/outputs, scale, latency, autonomy level, risk of side effects
 2. Success (3 min)      metrics + thresholds, zero-tolerance failures, baseline        -> Evaluation guide §2
 3. Shape (5 min)        workflow, agent, or hybrid? single or multi-agent?           -> §2 below
 4. Architecture (12)    API -> orchestrator -> model(s) + tools + retrieval + state store; draw it
 5. Deep dives (10)      tools & schemas, retrieval, state/checkpoints, approvals, security
 6. Numbers (4)          QPS, tokens, cost, p95 latency, capacity                     -> §1 below
 7. Reliability (3)      failure modes, retries/idempotency, fallbacks, recovery       -> §10 below
 8. Eval & monitor (3)   offline evals, online metrics, traces, alerts
```

## Table of Contents
1. [Calculate throughput, per-request token cost, and p95 latency](#1-calculate-throughput-per-request-token-cost-and-p95-latency)
2. [Compare a deterministic pipeline with an autonomous agent for the same task](#2-compare-a-deterministic-pipeline-with-an-autonomous-agent-for-the-same-task)
3. [Design a code-review / bug-triage agent with repository tools](#3-design-a-code-review--bug-triage-agent-with-repository-tools)
4. [Design a CSV/Excel validation agent with rules and external data checks](#4-design-a-csvexcel-validation-agent-with-rules-and-external-data-checks)
5. [Design a customer-support agent with search and human handoff](#5-design-a-customer-support-agent-with-search-and-human-handoff)
6. [Design a document research agent that produces cited answers](#6-design-a-document-research-agent-that-produces-cited-answers)
7. [Design a job-search agent that finds, evaluates, and ranks openings](#7-design-a-job-search-agent-that-finds-evaluates-and-ranks-openings)
8. [Design a multi-agent research workflow with parallel specialists](#8-design-a-multi-agent-research-workflow-with-parallel-specialists)
9. [Design an incident-response assistant with read-only diagnostics](#9-design-an-incident-response-assistant-with-read-only-diagnostics)
10. [Explain failure modes, state recovery, evaluation, and monitoring](#10-explain-failure-modes-state-recovery-evaluation-and-monitoring)
11. [Explain how you would enforce approvals on write/side-effect tools](#11-explain-how-you-would-enforce-approvals-on-writeside-effect-tools)
12. [Cheat sheet](#cheat-sheet)

Suggested order: **1 → 2 → 10 → 11 → 5 → 6 → 7 → 3 → 4 → 8 → 9**.

---

## 1. Calculate throughput, per-request token cost, and p95 latency

**In one sentence:** do the numbers out loud:
- **throughput** = requests/s × model calls per request × tokens per call → **tokens/s and TPM** against provider limits;
- **cost per request** = Σ calls (input tokens × input price + output tokens × output price, with caching);
- **latency** = the sum of the sequential steps (TTFT + output tokens ÷ tokens/s per model call, plus tools and retrieval). **p95** is driven by the slowest steps and by the number of sequential calls.

### In plain words
Before opening a restaurant, estimate how many customers per hour, how many dishes each orders, what each dish costs to make, and how long the slowest dish takes. That tells you the kitchen size, the menu price, and the waiting time.

### How it works
- **Inputs to ask for:**
  - daily active users;
  - requests per user per day;
  - peak-to-average ratio (×2–×5);
  - model calls per request (agent steps);
  - tokens per call (system + tools + history + retrieved + output).
- **Throughput:**
  - peak RPS = daily requests ÷ 86,400 × peak factor;
  - **TPM** = RPS × calls × tokens × 60;
  - compare with provider rate limits, or with GPU throughput if self-hosted.
- **Cost:** per call `in × p_in + out × p_out` (cached input at a discount); per request = the sum; monthly = × requests. Then **cost per successful task** ([model selection](./LLM-and-Generative-AI-Fundamentals.md#4-model-selection-capability-latency-context-cost-privacy-and-deployment)).
- **Latency:**
  - per model call ≈ TTFT (grows with input length) + output tokens ÷ output speed;
  - per request = the sum along the **sequential** path (parallel branches count as their max);
  - p95: use each step's p95 for a conservative bound, or simulate.
- **Levers:** fewer sequential steps, parallel tools, smaller models for some steps, caching, streaming, shorter outputs ([budgets](./Production-Reliability-and-Observability.md#12-token-usage-per-step-cost-and-latency-budgets)).

### Interview answer
"I compute from the requirements: daily requests times a peak factor gives peak RPS. Multiplied by model calls per request and tokens per call, that gives tokens per minute, which I check against provider limits or GPU capacity. Cost per call is input tokens times the input price, with cached tokens discounted, plus output tokens times the output price; summed over the calls and multiplied out, that gives monthly cost and cost per successful task. Latency is the sum along the sequential path — time to first token plus output tokens divided by generation speed for each model call, plus retrieval and tools — and p95 is dominated by the slowest steps and the number of sequential calls. The levers follow directly: fewer sequential calls, parallel tools, caching, smaller models for some steps, shorter outputs and streaming."

---

## 2. Compare a deterministic pipeline with an autonomous agent for the same task

**In one sentence:** for the same task (e.g. "process an incoming invoice"), compare:
- a **deterministic pipeline**: fixed steps, LLM used only inside steps. Predictable, cheap, testable, auditable, but brittle on unexpected inputs.
- an **autonomous agent**: the model chooses steps and tools. Flexible on novel cases, but variable in cost and latency, harder to test, and riskier with side effects.

Usually you recommend a **hybrid**: a pipeline for the known path, an agentic step for exceptions, behind approvals.

### In plain words
A pipeline is an assembly line: fast and consistent for standard products, stuck on a weird one. An agent is a craftsperson: handles odd jobs, but takes longer and you check their work more.

### How it works
| Dimension | Deterministic pipeline | Autonomous agent | Hybrid |
|---|---|---|---|
| Control flow | code | model | code + agentic exception node |
| Cost / latency | fixed, low | variable, higher | low on the common path |
| Novel inputs | fails or routes to a human | adapts | the agent handles the exceptions |
| Testing | unit tests per step | trajectory evals, pass rates | both |
| Auditability | high | needs traces | high on the common path |
| Side-effect risk | bounded | needs approvals and budgets | approvals on the agent path |

- **Interview move:** walk through 3–4 concrete inputs (standard invoice, missing PO, foreign currency, scanned handwritten) and show where each design succeeds. Then pick, with the % of traffic on each path ([workflows vs. agents](./Agent%20Fundamentals%20and%20Decision-Making/LLM%20workflows%20vs.%20autonomous%20agents%3A%20when%20each%20is%20appropriate.md)).

### Interview answer
"For the same task I'd compare both on concrete cases. A deterministic pipeline — extract, validate, match, post — is cheap, fast, predictable and easy to test and audit, but it fails on anything unexpected. An autonomous agent adapts to missing data or odd formats by choosing its own tools, at the cost of more steps, variable latency and harder evaluation, and it needs approvals for side effects. I'd usually recommend a hybrid: the pipeline handles the common path, which is most of the traffic, an agentic node handles exceptions within a step budget and approvals, and anything still unresolved goes to a human. That gets most of the agent's coverage at close to pipeline cost."

---

## 3. Design a code-review / bug-triage agent with repository tools

**In one sentence:** on a PR or issue event, the agent:
- **gathers context** with read-only repository tools (diff, files, blame, search, CI logs, related issues);
- **analyses** it: review comments, or a triage of severity, component, owner, duplicates and repro;
- **posts structured output** after validation, running tests in a **sandbox**;
- never merges or pushes without humans.

Precision of comments and an evaluation on historical PRs/issues are central.

### In plain words
An experienced colleague who reads every new pull request and bug report first: they point out likely bugs with line numbers, label the issue, find duplicates and suggest who should look at it — but the team decides what gets merged.

### How it works
```text
GitHub webhook -> queue -> orchestrator (per PR/issue run, checkpointed)
  tools (read-only, repo-scoped token): get_diff, read_file, search_code, git_blame, get_ci_logs, search_issues
  sandbox tool: run_tests(branch) in an ephemeral container, no secrets, no network except a package mirror
  steps: plan -> gather context (parallel) -> analyse (per file / per hunk) -> self-check (verify cited lines exist) -> output
  output: review comments {file, line, severity, category, explanation, suggestion}  |  triage {labels, severity, component, owner, duplicates[]}
  guardrails: comment cap per PR, confidence threshold, no auto-approve/merge, untrusted PR content (injection in code/comments!)
```
- **Context strategy:** the diff plus the surrounding functions, callers (search), tests touched, repo conventions (CONTRIBUTING, lint config) and past review comments as few-shot examples ([long context](./Prompt-Engineering-and-Structured-Outputs.md#4-managing-long-context-truncation-summarization-and-irrelevant-context)).
- **Precision over recall:** noisy reviewers get ignored. Filter by confidence and severity, dedupe, and limit to N comments.
- **Triage:** embeddings for duplicate search; CODEOWNERS plus blame for owners; a classifier or LLM for labels; a repro attempt in the sandbox for bugs.
- **Evaluation:** replay historical PRs, then measure the share of agent comments matching human-found issues (precision/recall), acceptance rate of suggestions, label accuracy, and duplicate-detection precision.
- **Security:** PR code and comments are **untrusted** (injection); keep the token read-only; scope the sandbox ([sandboxing](./Security-Privacy-and-Safety.md#8-sandboxing-code-execution-and-restricting-networkfile-access)).

### Interview answer
"A webhook on PR or issue events enqueues a checkpointed run. The agent uses read-only, repo-scoped tools — diff, file reads, code search, blame, CI logs, issue search — gathered in parallel, plus a sandboxed test runner without secrets. It analyses per file or hunk with repository conventions and past reviews as examples, then self-checks that cited lines exist. Output is structured: comments with file, line, severity and suggestion, or triage labels, component, owner from CODEOWNERS and blame, and duplicates via embeddings. Because noisy reviewers get ignored, I optimize precision with confidence thresholds, deduplication and a cap per PR. It never approves, merges or pushes. PR content is treated as untrusted. And it's evaluated by replaying historical PRs and issues for comment precision, acceptance rate and label accuracy."

---

## 4. Design a CSV/Excel validation agent with rules and external data checks

**In one sentence:** combine a **deterministic validation engine** (schema, types, required fields, ranges, regexes, uniqueness, cross-field and cross-row rules) with **external data checks** (VAT/company registry, currency rates, address/postcode APIs, internal master data), and use the LLM only where it adds value:
- **mapping messy headers** to the schema;
- **explaining errors** in plain language and **suggesting fixes**;
- **writing new rules** from natural-language policies (reviewed).

Large files are processed in **streaming chunks**.

### In plain words
A strict accountant checks every cell against the rulebook and calls the tax office to confirm company IDs. A friendly assistant then explains the problems to the uploader and suggests corrections. The assistant never decides on its own that the numbers are fine.

### How it works
```text
upload -> object storage -> job queue
parse (streaming CSV / XLSX sheets) -> header mapping (LLM proposes, user confirms, cached per template)
rules engine (deterministic, per row + aggregate) -> external checks (batched, cached, rate-limited, retried)
results store: {row, column, rule_id, severity, message, suggested_fix}
LLM: summarize issues, explain in the user's language, propose fixes (never silently applied)
output: annotated file + report; "apply suggested fixes" requires user confirmation
```
- **Why deterministic first:** validation must be exact, repeatable and auditable. LLMs are poor at checking 500K rows and can hallucinate.
- **Rules as data:** `{id, column, type: regex|range|enum|lookup|cross_field, params, severity}`, versioned. The LLM can draft rules from a policy document, and a human approves them.
- **External checks:** batch requests, cache by key (VAT number → valid), respect rate limits, timeouts with "unverified" status instead of failing the file ([retries](./Tool-Use-Integrations-and-Protocols.md#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits)).
- **Scale:** stream rows, process chunks in parallel, write results incrementally, and show progress.
- **Security:** files may contain PII and formula injection (`=HYPERLINK(...)`, `=cmd|...`). Sanitize cells on export, scan uploads, and enforce tenant isolation.

### Interview answer
"Validation itself must be deterministic: a versioned, data-driven rules engine for schema, types, ranges, regexes, uniqueness and cross-field rules, plus external checks like VAT registries, FX rates and master data that are batched, cached, rate-limited and marked 'unverified' on timeout instead of failing the file. The LLM goes where it adds value: mapping messy headers to the schema with user confirmation, cached per template; drafting new rules from policy text for human approval; and explaining issues and suggesting fixes in plain language — never silently changing data. Files stream through a job queue in parallel chunks with progress, and I handle PII, tenant isolation and spreadsheet formula injection on export."

---

## 5. Design a customer-support agent with search and human handoff

**In one sentence:** a support agent:
- **authenticates** the customer;
- **classifies intent**;
- answers from a **grounded knowledge base** (RAG with citations);
- uses **account tools** (orders, tracking, refunds within limits);
- **hands off to a human** with a full summary when confidence is low, the customer asks, policy requires it, or sentiment is bad.

It's measured on resolution rate, CSAT, escalation quality and safety.

### In plain words
A good first-line support rep: knows the help centre by heart, can look up your order, can issue small refunds, and when it gets complicated transfers you to a specialist **without making you repeat everything**.

### How it works
```text
channels (web chat, WhatsApp, email) -> API (auth, session) -> orchestrator (graph, checkpointed per conversation)
  classify intent + language + sentiment (small model)
  RAG over help center/policies (hybrid search, rerank, citations, abstain)       -> RAG guide
  tools: get_order, track_shipment, list_invoices (read) | create_ticket, issue_refund<=limit (write, gated)
  policy engine: refund limits, identity verification, PII redaction             -> Security guide §4
  handoff: to human queue with {summary, intent, facts, attempted steps, sentiment, transcript link}
  memory: per-customer preferences (opt-in), conversation history (retention policy)
```
- **Handoff triggers:**
  - the user asks for a human;
  - low retrieval or answer confidence;
  - repeated failure (the same question twice);
  - negative sentiment or a complaint;
  - legal or safety topics;
  - actions above the agent's limits.
- **Grounding:** answers cite help-centre articles and say "I don't know" rather than inventing policy ([grounded responses](./Retrieval-Augmented-Generation.md#5-grounded-responses-source-citations-and-abstention-when-evidence-is-missing)).
- **Metrics:**
  - containment/resolution rate *with* quality (sampled review, CSAT);
  - escalation precision (were handoffs needed?);
  - time to resolution;
  - cost per resolved conversation;
  - zero policy violations.
- **Scale and latency:** stream responses; use a small model for classification and a larger one for complex answers; prompt caching for the system prompt and tools.

### Interview answer
"Customers authenticate through the channel. A checkpointed graph per conversation classifies intent, language and sentiment with a small model, answers policy questions with hybrid RAG over the help centre with citations and abstention, and uses account tools — reads freely, writes like refunds only within limits through a policy engine. Handoff is a first-class path: when the customer asks, confidence is low, the same issue repeats, sentiment is negative, the topic is legal or safety-related, or the action exceeds limits, it routes to the right human queue with a package containing intent, verified facts, what was tried and a summary, so the customer never repeats themselves. I measure resolution with quality — CSAT and sampled review, not just containment — plus escalation precision, cost per resolved conversation and zero policy violations."

---

## 6. Design a document research agent that produces cited answers

**In one sentence:** a research agent over a document corpus (contracts, papers, internal docs):
- **plans** sub-questions;
- **iteratively retrieves** (hybrid search + rerank, multiple rounds);
- **reads and extracts** evidence with exact quotes and locations;
- **synthesizes** an answer where every claim cites a passage, **verifies** citations, and states gaps or conflicts.

ACLs and freshness are enforced throughout.

### In plain words
A careful research assistant: breaks your question into parts, searches the library several times, photocopies the exact paragraphs, writes the summary with footnotes, and tells you what they couldn't find.

### How it works
```text
ingestion: parse PDFs/Office/HTML (layout + tables), chunk hierarchically, metadata (doc, section, page, date, ACL), embed + BM25
query: plan sub-questions -> for each: retrieve (hybrid, ACL pre-filter) -> rerank -> read top passages
       -> extract evidence {claim, quote, doc_id, page} -> enough evidence? else rewrite query / go deeper (max rounds)
synthesize: answer with [n] citations per claim; "conflicts" and "not found" sections
verify: each citation's quote exists in the cited passage and supports the claim (NLI/judge); drop unsupported claims
UI: answer + clickable citations to page highlights; export
```
- **Iterative retrieval:** the agent decides when it has enough evidence. Cap rounds and tokens ([query rewriting](./Retrieval-Augmented-Generation.md#8-query-rewriting-expansion-routing-and-decomposition)).
- **Long documents:** hierarchical chunks (small to find, parent to read) and per-document summaries for map-reduce over many docs.
- **Evaluation:**
  - retrieval recall@k on labelled questions;
  - **citation precision** (does the citation support the claim);
  - faithfulness;
  - answer correctness vs. references;
  - abstention on unanswerable questions ([RAG metrics](./Retrieval-Augmented-Generation.md#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg)).

### Interview answer
"Ingestion parses documents with layout and tables, chunks them hierarchically with metadata including pages and ACLs, and indexes both embeddings and BM25. At query time the agent plans sub-questions and, for each, runs hybrid retrieval with ACL pre-filters and reranking, reads the top passages, and extracts evidence as exact quotes with document and page. If evidence is missing it rewrites the query and searches again, within a round and token budget. Synthesis cites a passage for every claim and has explicit sections for conflicts and not-found items, and a verification pass checks each quote exists and supports its claim. I evaluate retrieval recall, citation precision, faithfulness, correctness and abstention on unanswerable questions."

---

## 7. Design a job-search agent that finds, evaluates, and ranks openings

**In one sentence:** a job-search agent:
- builds a **candidate profile** (skills, experience, preferences: location, remote/visa, salary, company type) from the CV and conversation;
- **finds** openings from multiple sources (job APIs, company career pages/ATS feeds like Greenhouse/Lever/Workday, aggregators) via scheduled crawling;
- **normalizes and deduplicates** them;
- **evaluates** fit: hard filters, then a scored match with explanations;
- **ranks** with transparent weights, tracks **freshness**, and lets the user give feedback.

It never applies or messages anyone without explicit approval.

### In plain words
A personal recruiter who reads every job board each morning, throws away the ones that don't fit your must-haves (wrong country, no visa sponsorship), scores the rest against your skills, and gives you a ranked shortlist with "why this one" notes. It's you who clicks "apply".

### How it works
```text
profile: parse CV (LLM extraction -> structured skills/years/titles) + preferences (must-have vs nice-to-have), user-confirmed
sources (scheduled, rate-limited, robots/ToS-respecting): job APIs, ATS feeds (Greenhouse/Lever/Ashby JSON), career pages, aggregators
normalize: title, company, location, remote policy, visa sponsorship, salary range, seniority, skills, posted_at, url
dedupe: same company + similar title + location (fuzzy/embedding) -> one canonical posting with all source links
evaluate: hard filters (location/visa/seniority) -> score: skill match (embeddings + extracted requirements), seniority fit,
          preferences, company signals; LLM writes a short "why / gaps" explanation from the structured features
rank: weighted score + freshness decay + diversity (not 10 roles at one company); user feedback updates weights
track: applications state machine (saved -> applied -> interview -> offer/rejected), reminders; apply = user action
```
- **Why structured scoring rather than "LLM, rank these":** reproducible, explainable, cheaper, and testable. The LLM extracts features and explains; code ranks.
- **Freshness and dead links:** re-check postings, expire old ones, and prefer ATS feeds over scraped HTML.
- **Evaluation:**
  - precision@10 judged by the user (saved/applied rate);
  - filter accuracy (no visa-mismatch roles shown);
  - dedupe rate;
  - freshness (share of postings still open).
- **Ethics and compliance:** respect site terms and rate limits, keep CV data private ([PII](./Security-Privacy-and-Safety.md#5-pii-detection-redaction-encryption-and-retention-policies)), avoid bias in the scoring features, and never auto-apply without approval ([approvals](#11-explain-how-you-would-enforce-approvals-on-writeside-effect-tools)).

### Interview answer
"First the agent builds a structured profile: skills, years and titles extracted from the CV by an LLM, confirmed by the user, plus must-have versus nice-to-have preferences like countries, visa sponsorship, remote and salary. Scheduled, rate-limited and terms-respecting collectors pull postings from job APIs, ATS feeds like Greenhouse and Lever, and career pages. They're normalized to a common schema and deduplicated by company, title and location similarity. Evaluation applies hard filters first, then a weighted, explainable score — skill overlap from extracted requirements, seniority fit, preferences, freshness decay — with a per-company diversity cap. The LLM writes the 'why and gaps' note from the structured features, and code does the ranking, so it's reproducible and testable. Applications are tracked as a state machine, applying is always the user's action, CV data stays private, and I measure precision of the top 10 by the user's save and apply rate, filter accuracy and freshness."

---

## 8. Design a multi-agent research workflow with parallel specialists

**In one sentence:** a **lead/supervisor agent**:
- clarifies the question and writes a **research plan**;
- **spawns parallel specialist subagents** (e.g. market, technical, regulatory, competitor), each with its own tools, sources and **non-overlapping brief**;
- collects their **structured findings with sources**;
- **reconciles conflicts**;
- writes a cited report through a synthesis step.

A global budget and per-agent limits bound the cost.

### In plain words
An editor-in-chief assigns four reporters to different angles of a story at the same time, gives each a clear brief and deadline, then fact-checks and merges their notes into one article with sources.

### How it works
```text
lead: clarify -> plan {sub-questions, specialist, sources, output schema, budget} -> persist plan (checkpoint)
fan-out (bounded concurrency): specialist_k(brief) -> own context + tools (web search, internal RAG, SQL) -> Findings{claims[], sources[], confidence, gaps}
fan-in: dedupe claims, cluster, detect conflicts -> arbitration (verify / evidence / escalate)   -> Multi-Agent guide §3
       -> lead decides: enough? else spawn follow-ups for gaps (max rounds)
synthesis: report with citations, confidence, open questions; citation verifier pass
cost control: global token budget, per-specialist step caps, cheaper models for specialists, strong model for lead/synthesis
```
- **Why multi-agent here:** breadth-first research parallelizes well, and each specialist gets a clean context of its own ([single vs. multi](./Multi-Agent-Systems.md#7-single-agent-vs-multi-agent-trade-offs)). The token cost is several times a single agent's, so it's justified for high-value questions.
- **Briefs prevent duplicate work:** objective, scope boundaries ("don't cover pricing"), source hints, output format, effort level.
- **Partial failure:** if one specialist times out, report without it and flag it, or retry ([parallel aggregation](./Multi-Agent-Systems.md#5-parallel-agents-race-conditions-and-result-aggregation)).
- **Evaluation:** coverage of key facts vs. an expert checklist, citation accuracy, conflict handling, cost/time per report, and human ratings.

### Interview answer
"A lead agent clarifies the question and writes a persisted research plan: sub-questions, the specialist for each, source hints, output schema and budget. It fans out to specialist subagents in parallel with bounded concurrency. Each has a clean context, its own tools — web search, internal RAG, SQL — and a non-overlapping brief, and returns structured findings with claims, sources, confidence and gaps. The lead merges and deduplicates claims, arbitrates conflicts by evidence, spawns follow-ups for important gaps within a round limit, and a synthesis step writes the cited report, with a verifier checking citations. Cost is bounded by a global token budget, step caps per specialist and cheaper models for specialists. Multi-agent is justified here because breadth-first research parallelizes and benefits from isolated contexts."

---

## 9. Design an incident-response assistant with read-only diagnostics

**In one sentence:** an on-call assistant that, when an alert fires or an engineer asks:
- **gathers diagnostics with read-only tools**: metrics queries, logs search, traces, recent deploys and config changes, Kubernetes describe/events, runbooks, past incidents;
- **correlates** them into ranked **hypotheses with evidence**;
- **suggests** next checks and remediation commands **for humans to run**, or runs a few pre-approved, reversible runbook actions behind approval;
- drafts the incident timeline and postmortem.

### In plain words
A calm senior engineer sitting next to you at 3 a.m.: pulls up the dashboards, notices the deploy that happened 10 minutes before errors started, finds the similar incident from last month, and says "I think it's this — here's the command to roll back, you press enter".

### How it works
```text
trigger: alert webhook (PagerDuty/Opsgenie) or chat (/incident ask ...) -> incident thread + run (checkpointed)
read-only tools (scoped service account): query_metrics(PromQL), search_logs, get_traces, list_deploys(service, window),
     get_config_changes, k8s_describe/events (no exec), runbook_search (RAG), similar_incidents (RAG over postmortems)
loop: parallel gather -> correlate in time (change before symptom?) -> hypotheses [{cause, evidence[], confidence, next_check}]
actions: suggest commands (rollback, scale) as text; optional allowlisted runbook actions with approval + audit   -> §11
outputs: Slack updates every N minutes, timeline, customer-impact estimate, postmortem draft
```
- **Read-only by design:** a mistaken action during an incident makes things worse. The assistant **can't** mutate production. Remediation is human-run or a tightly allowlisted, reversible, approved runbook step.
- **Grounding:** every hypothesis cites concrete evidence (a metric query, log lines, a deploy ID). Say "unknown" rather than guess ([incident investigation](./Production-Reliability-and-Observability.md#10-slaslo-design-and-incident-investigation)).
- **Data handling:** logs contain PII and secrets, so redact before sending them to the model. Logs can also contain **injected text**, so treat them as untrusted.
- **Evaluation:** replay past incidents (recorded telemetry) and score whether the correct root cause was in the top 3, time-to-hypothesis, and false-lead rate. Also track engineer usefulness ratings.

### Interview answer
"Triggered by an alert webhook or a chat command, the assistant opens a checkpointed run tied to the incident channel. It uses only read-only tools on a scoped service account: metrics queries, log search, traces, recent deploys and config changes, Kubernetes describe and events without exec, plus RAG over runbooks and past postmortems. It gathers in parallel, correlates changes against symptom onset, and produces ranked hypotheses, each citing concrete evidence, with suggested next checks and remediation commands for the engineer to run. At most a few allowlisted, reversible runbook actions run behind approval and audit. Logs are redacted and treated as untrusted. It also posts periodic updates and drafts the timeline and postmortem. I evaluate it by replaying past incidents: is the true root cause in the top three, how quickly, and how many false leads."

---

## 10. Explain failure modes, state recovery, evaluation, and monitoring

**In one sentence:** close every design by walking through the four topics below.
- **What can fail:**
  - model errors and outages;
  - malformed output;
  - wrong tool choice or loops;
  - tool timeouts;
  - duplicate side effects;
  - retrieval misses and hallucination;
  - injection;
  - cost runaway;
  - worker crashes.
- **How state recovers:** checkpoints, idempotency, resume, DLQ.
- **How you evaluate** before shipping: golden sets, trajectory tests, regression gates.
- **How you monitor** in production: traces, SLOs, cost, quality signals, alerts.

### In plain words
A pilot's checklist: what can go wrong (engine, weather, instruments), what the backup is for each, how the plane was tested before flight, and which gauges the pilot watches during the flight.

### How it works
| Failure mode | Detection | Mitigation / recovery |
|---|---|---|
| Provider error/outage, 429 | error rates, breaker | retries with backoff, failover model, degrade ([outages](./Production-Reliability-and-Observability.md#7-provider-outages-failover-models-and-graceful-degradation)) |
| Malformed / truncated output | schema validation, finish reason | re-ask with error, structured outputs, raise limits |
| Wrong tool / bad args / loop | validation, step counter, repeated-call detector | actionable tool errors, step budget, fallback to human |
| Tool timeout / failure | timeouts, error codes | retry if retryable, alternative tool, partial answer |
| Duplicate side effects | idempotency store | idempotency keys, approvals ([section 11](#11-explain-how-you-would-enforce-approvals-on-writeside-effect-tools)) |
| Hallucination / retrieval miss | groundedness checks, low retrieval scores | abstain, citations, query rewrite |
| Prompt injection | classifiers, taint tracking | capability restriction, approvals, egress filter |
| Cost/latency runaway | budget counters | caps per run/tenant, cheaper paths |
| Worker crash / deploy | heartbeats, stuck-run detector | resume from checkpoint, DLQ for poison runs ([durable execution](./Agentic-Frameworks-and-Orchestration.md#3-durable-execution-and-recovering-from-mid-workflow-failures)) |

- **Evaluation:** success criteria → golden set → unit, integration and trajectory tests → judges calibrated with humans → regression gate in CI → shadow and canary → A/B ([Evaluation guide](./Evaluation-and-Testing.md)).
- **Monitoring:** traces per run; golden signals plus TTFT, tokens/cost, tool error rates, steps per run, escalations, feedback and online judge scores; SLO burn-rate alerts with runbooks ([alerting](./Production-Reliability-and-Observability.md#5-logs-metrics-dashboards-and-actionable-alerting)).

### Interview answer
"I'd close by walking through failure modes and how each is detected and handled. Provider outages get breakers, retries and failover. Malformed output gets schema validation and a re-ask. Wrong tools and loops get validation, step budgets and loop detection. Tool failures get timeouts and retries for retryable errors. Duplicate side effects get idempotency keys and approvals. Hallucination gets grounding, citations and abstention. Injection gets capability restriction. Cost runaway gets caps. Crashes are covered by checkpoint-based resume and a dead-letter queue. Before shipping I evaluate against success criteria with a golden set, unit, integration and trajectory tests, calibrated judges, a CI regression gate, then shadow, canary and A/B. In production I monitor traces, latency, cost, tool error rates, steps per run, escalations and quality signals, with SLO burn-rate alerts tied to runbooks, and I chaos-test the playbook."

---

## 11. Explain how you would enforce approvals on write/side-effect tools

**In one sentence:**
- Classify every tool by **risk**: read, reversible write, irreversible/high-impact.
- Route every call through a **tool gateway** that the model can't bypass. It runs **policy checks** and, for gated calls, **pauses the run** (durable interrupt) and sends an **approval request** showing the **exact action and arguments**.
- Bind the approval to a **hash of those arguments** with an expiry and the approver's identity and authority.
- Execute with an **idempotency key**, and **audit** everything.

### In plain words
A two-key system for the bank vault: the clerk prepares the exact transfer slip, a manager checks that slip and signs it, the system only accepts that signed slip once, and the camera records it all.

### How it works
1. **Risk tiers in the registry:** `read` (auto) / `write_reversible` (auto or notify, with undo) / `high_impact` (approval). Use thresholds where it makes sense (refunds > 1,000 EGP) ([approval gates](./Tool-Use-Integrations-and-Protocols.md#2-approval-gates-for-irreversible-or-high-impact-actions)).
2. **Gateway enforcement:** tools are only reachable through the gateway, and the agent's credentials can't call the API directly ([least privilege](./Security-Privacy-and-Safety.md#3-least-privilege-agent-identities-and-scoped-credentials)).
3. **Policy first:** schema, business rules, DLP and consistency checks. Deny outright what's never allowed ([policy enforcement](./Security-Privacy-and-Safety.md#4-output-validation-and-policy-enforcement-before-external-actions)).
4. **Interrupt and persist:** checkpoint the run with `pending_approval {action_hash, args, reason, risk}`, and notify approvers (Slack/email/UI) with a clear preview or diff ([LangGraph interrupts](./Agentic-Frameworks-and-Orchestration.md#5-langgraph-checkpointing-persistence-interrupts-and-resumability)).
5. **Decision:** approve / edit (new args → new hash) / reject (with feedback to the model). Check that the approver has the authority for this action and amount, enforce **separation of duties** (the requester can't approve their own), and set an expiry.
6. **Execute once:** re-verify the hash matches, then execute with an idempotency key, record the result, and resume the run.
7. **Audit:** request, decision, approver, timestamps and outcome in an append-only log ([audit trails](./Security-Privacy-and-Safety.md#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails)).
8. **UX:** batch similar approvals, set thresholds to avoid approval fatigue, and measure approval latency and rejection rate.

### Interview answer
"Every tool is classified by risk in the registry, and every call goes through a tool gateway the agent can't bypass, because its credentials don't reach the APIs directly. The gateway first runs policy checks and denies anything never allowed. For high-impact calls it checkpoints the run with a pending approval and notifies approvers with a clear preview of the exact action. The approval is bound to a hash of the tool and arguments, expires, and checks that the approver has authority for that action and amount and isn't the requester. Edits create a new request; rejections go back to the model as feedback. Execution re-verifies the hash, runs once with an idempotency key, resumes the run, and everything is written to an append-only audit log. Thresholds and batching keep approval volume manageable."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Framework | clarify → success metrics → workflow/agent shape → architecture → deep dives → numbers → reliability → eval & monitoring |
| Numbers | peak RPS = daily/86,400 × peak; TPM = RPS × calls × tokens × 60; cost = Σ(in·p_in + out·p_out, cached discount); latency = Σ sequential (TTFT + out/speed) |
| Pipeline vs. agent | compare on concrete cases; hybrid = pipeline for the common path + agentic exceptions + humans |
| Code review / triage | read-only repo tools + sandboxed tests; precision over recall (verify lines, confidence, cap); never merge; PR content untrusted |
| CSV/Excel validation | deterministic rules engine + cached external checks; LLM maps headers, drafts rules, explains; streaming; formula injection |
| Customer support | auth → intent → grounded RAG + scoped tools → policy engine → handoff with package; resolution with quality |
| Document research | plan sub-questions → iterative hybrid retrieval → quote evidence → cited synthesis + verification + "not found" |
| Job search | structured profile → compliant collectors → normalize/dedupe → hard filters → explainable weighted rank + freshness + diversity; user applies |
| Multi-agent research | lead plan → parallel specialists with briefs → structured findings → arbitrate → follow-ups → cited report; global budget |
| Incident response | read-only diagnostics, change-vs-onset correlation, evidence-backed hypotheses, humans run remediation, replay evals |
| Failures & monitoring | failure → detector → recovery table; checkpoints, idempotency, DLQ; eval pipeline; traces + SLOs + cost + quality |
| Approvals | risk tiers, gateway-only access, policy first, durable interrupt, args-hash binding, authority + SoD + expiry, execute once, audit |
