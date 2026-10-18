# SDE Interview and Prep Roadmap

## Overview

A comprehensive, checklist-driven roadmap for preparing for **Software Development Engineer (SDE), backend engineering, system design, and Agentic AI interviews**. It brings together core computer science fundamentals and modern AI engineering topics in one place, with a focus on understanding concepts, practicing implementation, and explaining technical trade-offs clearly in interviews.

The roadmap covers **Agentic AI, LLM Engineering, and AI System Design, Algorithms, Cloud, DevOps & Infrastructure, Data Structures, Databases, Low-Level Design & Object-Oriented Design, Networking, Operating Systems, Problem-solving and Coding, Programming Languages and Concepts, Security Engineering & Authentication, System Architecture, System Design, Testing, Reliability & Observability, Version control System**. Alongside the topic checklists, it includes an **interview-readiness assessment** to help turn preparation into measurable progress.

Use the expandable checklists to track what you've studied, revisit weak areas, and prepare at your own pace. This repository is also a shared learning resource: contributions, corrections, and useful learning materials are welcome.

## Career Roadmap — [Click Here](./Career-Roadmap/README.md)

International job targets, remote work from Egypt, funded master's programmes, 2026 salary and visa rules, and a month-by-month application plan with a tracker.

## Contest Practice PDFs — [Click Here](./Contest-Practice/README.md)

20 printable contests (7 Codeforces Div. 4, 3 Codeforces Div. 3, 10 AtCoder Beginner Contests), printed from each site's own problems page. Each PDF ends with one hints page taken from the official editorial. One combined PDF holds all of them.

## Study Plan + Flagship Project — [Click Here](./Study-Plan/README.md)

A printable step-by-step plan with no dates: 138 numbered steps, done in order at your own pace. It covers CMU 15-445 (lectures, homeworks 1–4, projects 0–4), every guide in this repo's OS, Networking, Version Control, System Design, Programming Languages and Concepts, and System Architecture domains, contest practice, and a small career track. It also includes the guide for the flagship project, a Raft-replicated key-value store in Rust.

## Domains and Topics

**Overall progress: 0 / 699 topics completed (0.0%)**

![Overall progress](assets/progress/overall.svg?v=35a774e7de)

Progress bars and counts are generated from checklist states when you commit changes to GitHub. The interview-readiness self-assessment is excluded.

**Priority key:**  
<br/>· **`P0`** = essential / most frequently useful 
<br/>· **`P1`** = important 
<br/>· **`P2`** = advanced or lower-frequency. 
<br/>These priorities are interview-prep recommendations, not difficulty ratings.

### 1. Agentic AI, LLM Engineering, and AI System Design

![Agentic AI, LLM Engineering, and AI System Design progress](assets/progress/domain-1.svg?v=016e9b70f6)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] **Agent Fundamentals and Decision-Making** **`P1`**
  - [ ] [Agent autonomy levels and choosing the minimum sufficient autonomy](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Agent autonomy levels and choosing the minimum sufficient autonomy.md>) **`P1`**
  - [ ] [Core agent loop: observe, decide, act, inspect results, and stop](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Core agent loop: observe, decide, act, inspect results and stop.md>) **`P0`**
  - [ ] [Deterministic workflow nodes vs. model-selected actions](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Deterministic workflow nodes vs. model-selected actions.md>) **`P1`**
  - [ ] [Human-in-the-loop reviews, approvals, and escalation](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Human-in-the-loop reviews, approvals and escalation.md>) **`P0`**
  - [ ] [LLM workflows vs. autonomous agents: when each is appropriate](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/LLM workflows vs. autonomous agents: when each is appropriate.md>) **`P0`**
  - [ ] [Planning: task breakdown, dependency graphs, and replanning](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Planning: task breakdown, dependency graphs and replanning.md>) **`P0`**
  - [ ] [Reasoning-and-acting patterns (e.g., ReAct) and tool-use loops](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Reasoning-and-acting patterns (e.g., ReAct) and tool-use loops.md>) **`P0`**
  - [ ] [Reflection, critique, self-correction, and their limitations](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Reflection, critique, self-correction, and their limitations.md>) **`P1`**
  - [ ] [Short-term context vs. persistent long-term memory](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Short-term context vs. persistent long-term memory.md>) **`P1`**
  - [ ] [Stop conditions, turn budgets, iteration limits, and fallback paths](<./Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Stop conditions, turn budgets, iteration limits, and fallback paths.md>) **`P1`**

- [ ] [**Agentic Frameworks and Orchestration**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md) **`P1`**
  - [ ] [Compare LangGraph, AutoGen, CrewAI, and SDK-native agent approaches](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#1-compare-langgraph-autogen-crewai-and-sdk-native-agent-approaches) **`P2`**
  - [ ] [Conditional branching, map-reduce, parallel fan-out, and fan-in](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#2-conditional-branching-map-reduce-parallel-fan-out-and-fan-in) **`P1`**
  - [ ] [Durable execution and recovering from mid-workflow failures](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#3-durable-execution-and-recovering-from-mid-workflow-failures) **`P0`**
  - [ ] [LangChain: models, tools, retrievers, and integrations](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#4-langchain-models-tools-retrievers-and-integrations) **`P0`**
  - [ ] [LangGraph: checkpointing, persistence, interrupts, and resumability](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#5-langgraph-checkpointing-persistence-interrupts-and-resumability) **`P0`**
  - [ ] [LangGraph: retries, error recovery, and human approval flows](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#6-langgraph-retries-error-recovery-and-human-approval-flows) **`P0`**
  - [ ] [LangGraph: state graphs, nodes, edges, routing, and reducers](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#7-langgraph-state-graphs-nodes-edges-routing-and-reducers) **`P0`**
  - [ ] [LangSmith: traces, datasets, evaluations, and debugging](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#8-langsmith-traces-datasets-evaluations-and-debugging) **`P0`**
  - [ ] [Stateless service architecture vs. stateful agent execution](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#9-stateless-service-architecture-vs-stateful-agent-execution) **`P1`**
  - [ ] [Workflow orchestration vs. agent orchestration](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-Frameworks-and-Orchestration.md#10-workflow-orchestration-vs-agent-orchestration) **`P1`**
- [ ] **Agentic System Design Interview Practice** **`P0`**
  - [ ] Calculate throughput, per-request token cost, and p95 latency **`P0`**
  - [ ] Compare a deterministic pipeline with an autonomous agent for the same task **`P1`**
  - [ ] Design a code-review / bug-triage agent with repository tools **`P1`**
  - [ ] Design a CSV/Excel validation agent with rules and external data checks **`P1`**
  - [ ] Design a customer-support agent with search and human handoff **`P1`**
  - [ ] Design a document research agent that produces cited answers **`P1`**
  - [ ] Design a job-search agent that finds, evaluates, and ranks openings **`P0`**
  - [ ] Design a multi-agent research workflow with parallel specialists **`P1`**
  - [ ] Design an incident-response assistant with read-only diagnostics **`P1`**
  - [ ] Explain failure modes, state recovery, evaluation, and monitoring **`P0`**
  - [ ] Explain how you would enforce approvals on write/side-effect tools **`P1`**
- [ ] [**Evaluation and Testing**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md) **`P0`**
  - [ ] [Agent trajectory tests: tool selection, ordering, and stop behavior](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#1-agent-trajectory-tests-tool-selection-ordering-and-stop-behavior) **`P1`**
  - [ ] [Defining success criteria before building an agent](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#2-defining-success-criteria-before-building-an-agent) **`P1`**
  - [ ] [End-to-end tests for complete multi-step agent workflows](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#3-end-to-end-tests-for-complete-multi-step-agent-workflows) **`P1`**
  - [ ] [Golden datasets and representative real-world test cases](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#4-golden-datasets-and-representative-real-world-test-cases) **`P1`**
  - [ ] [Human review, pairwise comparisons, and error taxonomy](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#5-human-review-pairwise-comparisons-and-error-taxonomy) **`P1`**
  - [ ] [Integration tests with mocked external tools and APIs](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#6-integration-tests-with-mocked-external-tools-and-apis) **`P0`**
  - [ ] [LLM-as-judge: rubrics, calibration, bias, and limitations](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#7-llm-as-judge-rubrics-calibration-bias-and-limitations) **`P0`**
  - [ ] [Measures: task success, groundedness, tool correctness, cost, and latency](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#8-measures-task-success-groundedness-tool-correctness-cost-and-latency) **`P0`**
  - [ ] [Offline evaluation vs. online experiments and A/B testing](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#9-offline-evaluation-vs-online-experiments-and-ab-testing) **`P0`**
  - [ ] [Regression tests after prompt, tool, model, or retrieval changes](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#10-regression-tests-after-prompt-tool-model-or-retrieval-changes) **`P0`**
  - [ ] [Robustness testing: invalid inputs, ambiguous tasks, and tool outages](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#11-robustness-testing-invalid-inputs-ambiguous-tasks-and-tool-outages) **`P1`**
  - [ ] [Unit testing tools, nodes, validators, and deterministic logic](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Evaluation-and-Testing.md#12-unit-testing-tools-nodes-validators-and-deterministic-logic) **`P0`**
- [ ] **Hands-On Interview Readiness** **`P1`**
  - [ ] Add persistent state and resume execution after process restart **`P0`**
  - [ ] Add retries, timeouts, human approval, and safe fallback behavior **`P0`**
  - [ ] Build a RAG pipeline with citations and retrieval evaluation **`P0`**
  - [ ] Build an agent with at least two tools and schema-validated outputs **`P1`**
  - [ ] Create a small evaluation dataset and measure task success **`P0`**
  - [ ] Demonstrate a cost/latency optimization with before-and-after metrics **`P0`**
  - [ ] Explain one end-to-end project: architecture, trade-offs, impact, and lessons **`P1`**
  - [ ] Practice whiteboarding an agentic architecture in 30–45 minutes **`P1`**
  - [ ] Prepare answers for: "Why agents instead of workflows?" and "When should an agent stop?" **`P1`**
  - [ ] Trace and debug an incorrect tool-selection decision **`P0`**
- [ ] [**LLM and Generative AI Fundamentals**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md) **`P0`**
  - [ ] [Closed-weight vs. open-weight models; hosted APIs vs. self-hosting](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#1-closed-weight-vs-open-weight-models-hosted-apis-vs-self-hosting) **`P0`**
  - [ ] [Hallucinations, uncertainty, grounding, and model limitations](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#2-hallucinations-uncertainty-grounding-and-model-limitations) **`P1`**
  - [ ] [Inference parameters: temperature, top-p, seed, and stop sequences](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#3-inference-parameters-temperature-top-p-seed-and-stop-sequences) **`P1`**
  - [ ] [Model selection: capability, latency, context, cost, privacy, and deployment](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#4-model-selection-capability-latency-context-cost-privacy-and-deployment) **`P0`**
  - [ ] [Pretraining vs. instruction tuning vs. fine-tuning vs. alignment](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#5-pretraining-vs-instruction-tuning-vs-fine-tuning-vs-alignment) **`P2`**
  - [ ] [Prompting vs. RAG vs. fine-tuning: decision criteria and trade-offs](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#6-prompting-vs-rag-vs-fine-tuning-decision-criteria-and-trade-offs) **`P0`**
  - [ ] [Tokens, tokenization, context windows, and output limits](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#7-tokens-tokenization-context-windows-and-output-limits) **`P1`**
  - [ ] [Transformers, attention, embeddings, and autoregressive generation](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/LLM-and-Generative-AI-Fundamentals.md#8-transformers-attention-embeddings-and-autoregressive-generation) **`P0`**
- [ ] [**Memory, State, and Context Management**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md) **`P1`**
  - [ ] [Context compaction, summaries, and memory retrieval](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#1-context-compaction-summaries-and-memory-retrieval) **`P0`**
  - [ ] [Conversation state and checkpointing](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#2-conversation-state-and-checkpointing) **`P1`**
  - [ ] [Memory persistence: in-memory, databases, and durable checkpoint stores](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#3-memory-persistence-in-memory-databases-and-durable-checkpoint-stores) **`P1`**
  - [ ] [Memory relevance, aging, deletion, and conflict resolution](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#4-memory-relevance-aging-deletion-and-conflict-resolution) **`P1`**
  - [ ] [Multi-replica deployments and shared state consistency](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#5-multi-replica-deployments-and-shared-state-consistency) **`P1`**
  - [ ] [Privacy-aware memory retention and data minimization](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#6-privacy-aware-memory-retention-and-data-minimization) **`P1`**
  - [ ] [Session isolation and user/tenant scoping](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#7-session-isolation-and-usertenant-scoping) **`P1`**
  - [ ] [Working memory, episodic memory, semantic memory, and user preferences](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Memory-State-and-Context-Management.md#8-working-memory-episodic-memory-semantic-memory-and-user-preferences) **`P1`**
- [ ] [**Multi-Agent Systems**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md) **`P1`**
  - [ ] [Agent-to-agent communication and typed message contracts](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#1-agent-to-agent-communication-and-typed-message-contracts) **`P0`**
  - [ ] [Avoiding unnecessary agent proliferation and coordination overhead](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#2-avoiding-unnecessary-agent-proliferation-and-coordination-overhead) **`P1`**
  - [ ] [Conflicting answers, arbitration, and consensus limits](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#3-conflicting-answers-arbitration-and-consensus-limits) **`P1`**
  - [ ] [Handoffs, delegation, and task ownership](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#4-handoffs-delegation-and-task-ownership) **`P1`**
  - [ ] [Parallel agents, race conditions, and result aggregation](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#5-parallel-agents-race-conditions-and-result-aggregation) **`P0`**
  - [ ] [Shared state vs. agent-specific state](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#6-shared-state-vs-agent-specific-state) **`P1`**
  - [ ] [Single-agent vs. multi-agent trade-offs](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#7-single-agent-vs-multi-agent-trade-offs) **`P1`**
  - [ ] [Supervisor/worker and coordinator/specialist patterns](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Multi-Agent-Systems.md#8-supervisorworker-and-coordinatorspecialist-patterns) **`P1`**
- [ ] [**Production Reliability and Observability**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md) **`P1`**
  - [ ] [Cache strategies: prompt, response, embedding, and retrieval caching](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#1-cache-strategies-prompt-response-embedding-and-retrieval-caching) **`P0`**
  - [ ] [Circuit breakers, dead-letter queues, and recovery workflows](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#2-circuit-breakers-dead-letter-queues-and-recovery-workflows) **`P0`**
  - [ ] [Cost optimization: smaller models, batching, caching, and routing](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#3-cost-optimization-smaller-models-batching-caching-and-routing) **`P1`**
  - [ ] [End-to-end distributed traces for prompts, model calls, and tools](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#4-end-to-end-distributed-traces-for-prompts-model-calls-and-tools) **`P0`**
  - [ ] [Logs, metrics, dashboards, and actionable alerting](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#5-logs-metrics-dashboards-and-actionable-alerting) **`P0`**
  - [ ] [Model and prompt versioning, release controls, and rollback](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#6-model-and-prompt-versioning-release-controls-and-rollback) **`P1`**
  - [ ] [Provider outages, failover models, and graceful degradation](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#7-provider-outages-failover-models-and-graceful-degradation) **`P1`**
  - [ ] [Request queuing, concurrency limits, and backpressure](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#8-request-queuing-concurrency-limits-and-backpressure) **`P0`**
  - [ ] [Retry storms, duplicate side effects, and idempotency keys](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#9-retry-storms-duplicate-side-effects-and-idempotency-keys) **`P0`**
  - [ ] [SLA/SLO design and incident investigation](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#10-slaslo-design-and-incident-investigation) **`P0`**
  - [ ] [Streaming responses, cancellation, and timeout handling](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#11-streaming-responses-cancellation-and-timeout-handling) **`P1`**
  - [ ] [Token usage, per-step cost, and latency budgets](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Production-Reliability-and-Observability.md#12-token-usage-per-step-cost-and-latency-budgets) **`P0`**
- [ ] [**Prompt Engineering and Structured Outputs**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md) **`P1`**
  - [ ] [Function/tool calling: schema design, argument validation, and error handling](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#1-functiontool-calling-schema-design-argument-validation-and-error-handling) **`P0`**
  - [ ] [Handling malformed outputs, refusals, and partial completions](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#2-handling-malformed-outputs-refusals-and-partial-completions) **`P1`**
  - [ ] [Injection-resistant prompt design and explicit trust boundaries](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#3-injection-resistant-prompt-design-and-explicit-trust-boundaries) **`P1`**
  - [ ] [Managing long context, truncation, summarization, and irrelevant context](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#4-managing-long-context-truncation-summarization-and-irrelevant-context) **`P1`**
  - [ ] [Prompt templates, versioning, regression testing, and reproducibility](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#5-prompt-templates-versioning-regression-testing-and-reproducibility) **`P1`**
  - [ ] [Structured output with JSON Schema and type validation](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#6-structured-output-with-json-schema-and-type-validation) **`P1`**
  - [ ] [System, developer, user, and tool messages; instruction priority](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#7-system-developer-user-and-tool-messages-instruction-priority) **`P1`**
  - [ ] [Zero-shot, few-shot, role prompting, and task decomposition](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Prompt-Engineering-and-Structured-Outputs.md#8-zero-shot-few-shot-role-prompting-and-task-decomposition) **`P1`**
- [ ] [**Retrieval-Augmented Generation (RAG)**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md) **`P0`**
  - [ ] [Answer evaluation: faithfulness, factual correctness, and relevance](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#1-answer-evaluation-faithfulness-factual-correctness-and-relevance) **`P0`**
  - [ ] [Chunking approaches: fixed-size, semantic, hierarchical, and overlap](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#2-chunking-approaches-fixed-size-semantic-hierarchical-and-overlap) **`P1`**
  - [ ] [Dense vs. sparse retrieval (BM25) and hybrid search](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#3-dense-vs-sparse-retrieval-bm25-and-hybrid-search) **`P0`**
  - [ ] [Embeddings: similarity metrics, dimension, and model selection](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#4-embeddings-similarity-metrics-dimension-and-model-selection) **`P0`**
  - [ ] [Grounded responses, source citations, and abstention when evidence is missing](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#5-grounded-responses-source-citations-and-abstention-when-evidence-is-missing) **`P1`**
  - [ ] [Ingestion pipelines: parsing, cleaning, deduplication, and metadata](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#6-ingestion-pipelines-parsing-cleaning-deduplication-and-metadata) **`P1`**
  - [ ] [Multi-tenant retrieval, ACL-aware filtering, and data freshness](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#7-multi-tenant-retrieval-acl-aware-filtering-and-data-freshness) **`P0`**
  - [ ] [Query rewriting, expansion, routing, and decomposition](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#8-query-rewriting-expansion-routing-and-decomposition) **`P1`**
  - [ ] [RAG vs. long-context prompting vs. fine-tuning: when to use which](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#9-rag-vs-long-context-prompting-vs-fine-tuning-when-to-use-which) **`P0`**
  - [ ] [Reranking, contextual compression, and top-k selection](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#10-reranking-contextual-compression-and-top-k-selection) **`P1`**
  - [ ] [Retrieval evaluation: recall\@k, precision\@k, MRR, and nDCG](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg) **`P0`**
  - [ ] [Vector databases and indexing / update / deletion strategies](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#12-vector-databases-and-indexing--update--deletion-strategies) **`P0`**
  - [ ] [Vector indexes: approximate nearest neighbors, HNSW, and IVF](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Retrieval-Augmented-Generation.md#13-vector-indexes-approximate-nearest-neighbors-hnsw-and-ivf) **`P0`**
- [ ] [**Security, Privacy, and Safety**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md) **`P1`**
  - [ ] [Data exfiltration threats and unsafe tool execution](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#1-data-exfiltration-threats-and-unsafe-tool-execution) **`P1`**
  - [ ] [Defense in depth; why instructions alone are not security boundaries](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#2-defense-in-depth-why-instructions-alone-are-not-security-boundaries) **`P1`**
  - [ ] [Least-privilege agent identities and scoped credentials](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#3-least-privilege-agent-identities-and-scoped-credentials) **`P1`**
  - [ ] [Output validation and policy enforcement before external actions](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#4-output-validation-and-policy-enforcement-before-external-actions) **`P1`**
  - [ ] [PII detection, redaction, encryption, and retention policies](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#5-pii-detection-redaction-encryption-and-retention-policies) **`P0`**
  - [ ] [Prompt injection: direct and indirect attacks via retrieved content/tools](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#6-prompt-injection-direct-and-indirect-attacks-via-retrieved-contenttools) **`P0`**
  - [ ] [Responsible AI: bias, misuse, human oversight, and transparency](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#7-responsible-ai-bias-misuse-human-oversight-and-transparency) **`P1`**
  - [ ] [Sandboxing code execution and restricting network/file access](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#8-sandboxing-code-execution-and-restricting-networkfile-access) **`P0`**
  - [ ] [Tenant isolation and permission-aware retrieval](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#9-tenant-isolation-and-permission-aware-retrieval) **`P0`**
  - [ ] [Tool allowlists, confirmation for destructive actions, and audit trails](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Security-Privacy-and-Safety.md#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails) **`P1`**
- [ ] [**Tool Use, Integrations, and Protocols**](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md) **`P1`**
  - [ ] [API authentication, authorization, least privilege, and secret handling](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#1-api-authentication-authorization-least-privilege-and-secret-handling) **`P0`**
  - [ ] [Approval gates for irreversible or high-impact actions](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#2-approval-gates-for-irreversible-or-high-impact-actions) **`P1`**
  - [ ] [External search, database queries, code execution, and file tools](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#3-external-search-database-queries-code-execution-and-file-tools) **`P1`**
  - [ ] [Idempotent operations, retries, backoff, timeouts, and rate limits](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits) **`P0`**
  - [ ] [Model Context Protocol (MCP): clients, servers, tools, and resources](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#5-model-context-protocol-mcp-clients-servers-tools-and-resources) **`P1`**
  - [ ] [Parallel tool execution vs. sequential dependencies](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#6-parallel-tool-execution-vs-sequential-dependencies) **`P1`**
  - [ ] [Tool argument schemas and input/output contracts](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#7-tool-argument-schemas-and-inputoutput-contracts) **`P0`**
  - [ ] [Tool call audit logs and replay/debugging](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#8-tool-call-audit-logs-and-replaydebugging) **`P0`**
  - [ ] [Tool registry/discovery and selecting the right tool for a task](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#9-tool-registrydiscovery-and-selecting-the-right-tool-for-a-task) **`P1`**
  - [ ] [Tool result validation, sanitization, and handling untrusted content](./Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Tool-Use-Integrations-and-Protocols.md#10-tool-result-validation-sanitization-and-handling-untrusted-content) **`P1`**

</details>


### 2. Algorithms

![Algorithms progress](assets/progress/domain-2.svg?v=c7f831b50f)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] **Divide and Conquer** **`P1`**

  - [ ] Binary Search **`P0`**

  - [ ] Closest Pair of Points Problem **`P1`**

  - [ ] Cooley–Tukey Fast Fourier Transform (FFT) **`P2`**

  - [ ] Finding Maximum Subarray Sum (Kadane's Algorithm) **`P0`**

  - [ ] Finding Peak Element in 1D/2D Array **`P0`**

  - [ ] Karatsuba Algorithm (for Fast Multiplication) **`P2`**

  - [ ] Merge Sort **`P0`**

  - [ ] Quick Sort **`P0`**

  - [ ] Strassen's Matrix Multiplication **`P2`**

- [ ] **Dynamic Programming** **`P0`**

  - [ ] 0/1 Knapsack Problem **`P0`**

  - [ ] Coin Change Problem **`P0`**

  - [ ] Edit Distance **`P1`**

  - [ ] Fibonacci Series **`P1`**

  - [ ] Longest Common Subsequence (LCS) **`P1`**

  - [ ] Longest Increasing Subsequence (LIS) **`P1`**

  - [ ] Matrix Chain Multiplication **`P1`**

  - [ ] Memoization **`P0`**

  - [ ] Rod Cutting Problem **`P1`**

  - [ ] Shortest Path Problems (e.g., Dijkstra's Algorithm using DP) **`P1`**

  - [ ] Subset Sum Problem **`P1`**

  - [ ] Tabulation **`P0`**

- [ ] **Greedy Algorithms** **`P0`**

  - [ ] Activity Selection Problem **`P1`**

  - [ ] Dijkstra's Algorithm (for Single Source Shortest Path) **`P1`**

  - [ ] Fractional Knapsack Problem **`P0`**

  - [ ] Greedy Coloring of Graphs **`P0`**

  - [ ] Greedy Set Cover **`P0`**

  - [ ] Huffman Coding **`P1`**

  - [ ] Job Sequencing with Deadlines **`P1`**

  - [ ] Kruskal's Algorithm (for Minimum Spanning Tree) **`P0`**

  - [ ] Prim's Algorithm (for Minimum Spanning Tree) **`P0`**

- [ ] **Searching Algorithms**: **`P0`**

  - [ ] Binary Search **`P0`**

  - [ ] Breadth-First Search (BFS) **`P0`**

  - [ ] Depth-First Search (DFS) **`P0`**

  - [ ] Exponential Search **`P1`**

  - [ ] Fibonacci Search **`P2`**

  - [ ] Hashing (Hash Table) **`P0`**

  - [ ] Interpolation Search **`P2`**

  - [ ] Jump Search **`P2`**

  - [ ] Linear Search **`P1`**

  - [ ] Ternary Search **`P1`**

- [ ] **Sorting Algorithms**: **`P0`**

  - [ ] Bitonic Sort **`P2`**

  - [ ] Bubble Sort **`P1`**

  - [ ] Bucket Sort **`P1`**

  - [ ] Cocktail Shaker Sort **`P2`**

  - [ ] Comb Sort **`P2`**

  - [ ] Counting Sort **`P1`**

  - [ ] Cycle Sort **`P2`**

  - [ ] Gnome Sort **`P2`**

  - [ ] Heap Sort **`P0`**

  - [ ] Insertion Sort **`P1`**

  - [ ] Merge Sort **`P0`**

  - [ ] Pancake Sort **`P2`**

  - [ ] Quick Sort **`P0`**

  - [ ] Radix Sort **`P1`**

  - [ ] Selection Sort **`P1`**

  - [ ] Shell Sort **`P2`**

  - [ ] Strand Sort **`P2`**

  - [ ] Tim Sort **`P1`**

- [ ] **String Algorithms**: **`P1`**

  - [ ] Aho-Corasick Algorithm **`P1`**

  - [ ] Baker-Bird Algorithm **`P2`**

  - [ ] Boyer-Moore Algorithm **`P1`**

  - [ ] Breadth-First Search (BFS) in a Trie **`P0`**

  - [ ] Burrows-Wheeler Transform (BWT) **`P2`**

  - [ ] Count and Say Sequence **`P2`**

  - [ ] Depth-First Search (DFS) in a Trie **`P0`**

  - [ ] Edit Distance (Levenshtein Distance) **`P1`**

  - [ ] Hamming Distance **`P2`**

  - [ ] Knuth-Morris-Pratt (KMP) Algorithm **`P1`**

  - [ ] Longest Common Prefix (LCP) Array **`P0`**

  - [ ] Longest Common Subsequence **`P1`**

  - [ ] Longest Common Substring **`P1`**

  - [ ] Longest Palindromic Substring **`P1`**

  - [ ] Longest Repeated Substring **`P1`**

  - [ ] Manacher's Algorithm **`P2`**

  - [ ] Palindrome Check **`P1`**

  - [ ] Rabin-Karp Algorithm **`P1`**

  - [ ] Shortest Common Supersequence **`P1`**

  - [ ] String Hashing **`P0`**

  - [ ] Suffix Array Construction **`P0`**

  - [ ] Suffix Automaton **`P2`**

  - [ ] Suffix Tree Construction **`P2`**

  - [ ] Trie (Prefix Tree) Insertion and Search **`P0`**

  - [ ] Z-Algorithm **`P1`**

</details>


### 3. Cloud, DevOps & Infrastructure

![Cloud, DevOps & Infrastructure progress](assets/progress/domain-3.svg?v=c29d857a15)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**AWS Compute and Application Hosting**](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md) **`P1`**

  - [ ] [API Gateway and service integration patterns](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md#1-api-gateway-and-service-integration-patterns) **`P0`**

  - [ ] [AWS Lambda: triggers, cold starts, concurrency, and idempotency](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md#2-aws-lambda-triggers-cold-starts-concurrency-and-idempotency) **`P0`**

  - [ ] [EC2: instance families, AMIs, security groups, and auto scaling groups](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md#3-ec2-instance-families-amis-security-groups-and-auto-scaling-groups) **`P1`**

  - [ ] [ECS/Fargate vs. EKS vs. EC2 vs. Lambda deployment decisions](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md#4-ecsfargate-vs-eks-vs-ec2-vs-lambda-deployment-decisions) **`P0`**

  - [ ] [Elastic Load Balancing (ALB/NLB) and health checks](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Compute-and-Application-Hosting.md#5-elastic-load-balancing-albnlb-and-health-checks) **`P0`**

- [ ] [**AWS Storage and Databases**](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md) **`P0`**

  - [ ] [DynamoDB: partition/sort keys, GSIs, hot partitions, capacity modes](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md#1-dynamodb-partitionsort-keys-gsis-hot-partitions-capacity-modes) **`P0`**

  - [ ] [EBS vs. EFS vs. S3; durability and consistency trade-offs](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md#2-ebs-vs-efs-vs-s3-durability-and-consistency-trade-offs) **`P0`**

  - [ ] [ElastiCache/Redis: cache invalidation, eviction, and replication](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md#3-elasticacheredis-cache-invalidation-eviction-and-replication) **`P0`**

  - [ ] [RDS/Aurora: backups, replicas, failover, and connection pooling](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md#4-rdsaurora-backups-replicas-failover-and-connection-pooling) **`P1`**

  - [ ] [S3: object versioning, encryption, lifecycle policies, and presigned URLs](./Cloud%2C%20DevOps%20%26%20Infrastructure/AWS-Storage-and-Databases.md#5-s3-object-versioning-encryption-lifecycle-policies-and-presigned-urls) **`P0`**

- [ ] [**CI/CD and Release Engineering**](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md) **`P1`**

  - [ ] [Artifact provenance, dependency scanning, and supply-chain security](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md#1-artifact-provenance-dependency-scanning-and-supply-chain-security) **`P2`**

  - [ ] [Blue-green, canary, rolling, and feature-flag releases](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md#2-blue-green-canary-rolling-and-feature-flag-releases) **`P1`**

  - [ ] [Build/test/package/deploy pipelines and quality gates](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md#3-buildtestpackagedeploy-pipelines-and-quality-gates) **`P1`**

  - [ ] [GitHub Actions workflow syntax, runners, permissions, and artifacts](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md#4-github-actions-workflow-syntax-runners-permissions-and-artifacts) **`P1`**

  - [ ] [Rollbacks, database migrations, and backward compatibility](./Cloud%2C%20DevOps%20%26%20Infrastructure/CI-CD-and-Release-Engineering.md#5-rollbacks-database-migrations-and-backward-compatibility) **`P1`**

- [ ] [**Cloud Computing Fundamentals**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md) **`P1`**

  - [ ] [High availability vs. disaster recovery; RTO and RPO](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md#1-high-availability-vs-disaster-recovery-rto-and-rpo) **`P1`**

  - [ ] [Horizontal vs. vertical scaling; stateless vs. stateful services](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md#2-horizontal-vs-vertical-scaling-stateless-vs-stateful-services) **`P1`**

  - [ ] [IaaS vs. PaaS vs. SaaS; shared responsibility model](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md#3-iaas-vs-paas-vs-saas-shared-responsibility-model) **`P1`**

  - [ ] [Public, private, hybrid, and multi-cloud trade-offs](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md#4-public-private-hybrid-and-multi-cloud-trade-offs) **`P2`**

  - [ ] [Regions, availability zones, fault domains, and global services](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Computing-Fundamentals.md#5-regions-availability-zones-fault-domains-and-global-services) **`P1`**

- [ ] [**Cloud Cost, Capacity, and Operations**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md) **`P1`**

  - [ ] [Capacity planning using throughput, utilization, and p95 latency](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md#1-capacity-planning-using-throughput-utilization-and-p95-latency) **`P0`**

  - [ ] [Cost allocation, tagging, budgets, and cost observability](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md#2-cost-allocation-tagging-budgets-and-cost-observability) **`P1`**

  - [ ] [Multi-region architecture, backup/restore drills, and runbooks](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md#3-multi-region-architecture-backuprestore-drills-and-runbooks) **`P0`**

  - [ ] [Operational trade-offs: managed services vs. self-hosting](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md#4-operational-trade-offs-managed-services-vs-self-hosting) **`P1`**

  - [ ] [Reserved capacity vs. on-demand vs. spot instances](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Cost-Capacity-and-Operations.md#5-reserved-capacity-vs-on-demand-vs-spot-instances) **`P1`**

- [ ] [**Cloud Messaging and Eventing**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md) **`P1`**

  - [ ] [EventBridge event buses, rules, and event routing](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md#1-eventbridge-event-buses-rules-and-event-routing) **`P1`**

  - [ ] [Kinesis/Kafka trade-offs for streaming workloads](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md#2-kinesiskafka-trade-offs-for-streaming-workloads) **`P1`**

  - [ ] [Retries, poison messages, deduplication, and backpressure](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md#3-retries-poison-messages-deduplication-and-backpressure) **`P0`**

  - [ ] [SNS pub/sub, subscription filters, and fan-out](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md#4-sns-pubsub-subscription-filters-and-fan-out) **`P1`**

  - [ ] [SQS standard vs. FIFO; visibility timeout; dead-letter queues](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Messaging-and-Eventing.md#5-sqs-standard-vs-fifo-visibility-timeout-dead-letter-queues) **`P0`**

- [ ] [**Cloud Networking and Identity**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md) **`P1`**

  - [ ] [Cloud DNS, TLS termination, CDN, and WAF integration](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md#1-cloud-dns-tls-termination-cdn-and-waf-integration) **`P0`**

  - [ ] [IAM roles/policies, least privilege, and temporary credentials](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md#2-iam-rolespolicies-least-privilege-and-temporary-credentials) **`P0`**

  - [ ] [Private endpoints, peering, transit gateways, and hybrid connectivity](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md#3-private-endpoints-peering-transit-gateways-and-hybrid-connectivity) **`P1`**

  - [ ] [Security groups vs. network ACLs](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md#4-security-groups-vs-network-acls) **`P1`**

  - [ ] [VPC, public/private subnets, route tables, NAT and internet gateways](./Cloud%2C%20DevOps%20%26%20Infrastructure/Cloud-Networking-and-Identity.md#5-vpc-publicprivate-subnets-route-tables-nat-and-internet-gateways) **`P1`**

- [ ] [**Containers and Docker**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Containers-and-Docker.md) **`P0`**

  - [ ] [Build reproducibility, caching, and image size optimization](./Cloud%2C%20DevOps%20%26%20Infrastructure/Containers-and-Docker.md#1-build-reproducibility-caching-and-image-size-optimization) **`P1`**

  - [ ] [Container networking, volumes, resource limits, and isolation](./Cloud%2C%20DevOps%20%26%20Infrastructure/Containers-and-Docker.md#2-container-networking-volumes-resource-limits-and-isolation) **`P1`**

  - [ ] [Image scanning, non-root containers, pinned dependencies](./Cloud%2C%20DevOps%20%26%20Infrastructure/Containers-and-Docker.md#3-image-scanning-non-root-containers-pinned-dependencies) **`P1`**

  - [ ] [Images, layers, registries, Dockerfiles, and multi-stage builds](./Cloud%2C%20DevOps%20%26%20Infrastructure/Containers-and-Docker.md#4-images-layers-registries-dockerfiles-and-multi-stage-builds) **`P0`**

- [ ] [**Infrastructure as Code (IaC)**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md) **`P1`**

  - [ ] [CloudFormation/CDK vs. Terraform: trade-offs](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md#1-cloudformationcdk-vs-terraform-trade-offs) **`P0`**

  - [ ] [Environment parity and reproducible provisioning](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md#2-environment-parity-and-reproducible-provisioning) **`P1`**

  - [ ] [Managing secrets and sensitive outputs in IaC](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md#3-managing-secrets-and-sensitive-outputs-in-iac) **`P1`**

  - [ ] [Remote state, locking, drift detection, and lifecycle management](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md#4-remote-state-locking-drift-detection-and-lifecycle-management) **`P1`**

  - [ ] [Terraform providers, resources, modules, plans, and state](./Cloud%2C%20DevOps%20%26%20Infrastructure/Infrastructure-as-Code.md#5-terraform-providers-resources-modules-plans-and-state) **`P2`**

- [ ] [**Kubernetes Fundamentals and Operations**](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md) **`P0`**

  - [ ] [ConfigMaps, Secrets, namespaces, RBAC, and service accounts](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#1-configmaps-secrets-namespaces-rbac-and-service-accounts) **`P1`**

  - [ ] [Persistent volumes, statefulsets, and disruption budgets](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#2-persistent-volumes-statefulsets-and-disruption-budgets) **`P1`**

  - [ ] [Pods, deployments, replicasets, services, and ingress](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#3-pods-deployments-replicasets-services-and-ingress) **`P1`**

  - [ ] [Readiness/liveness/startup probes and rolling deployments](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#4-readinesslivenessstartup-probes-and-rolling-deployments) **`P1`**

  - [ ] [Requests/limits, HPA, cluster autoscaler, and scheduling](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#5-requestslimits-hpa-cluster-autoscaler-and-scheduling) **`P1`**

  - [ ] [Troubleshooting CrashLoopBackOff, pending pods, and service discovery](./Cloud%2C%20DevOps%20%26%20Infrastructure/Kubernetes-Fundamentals-and-Operations.md#6-troubleshooting-crashloopbackoff-pending-pods-and-service-discovery) **`P0`**

</details>


### 4. Data Structures

![Data Structures progress](assets/progress/domain-4.svg?v=05ad60d837)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Arrays**](./Data%20Structures/Arrays.md) **`P0`**

- [ ] [**Graphs**](./Data%20Structures/Graphs.md) **`P0`**

  - [ ] [Acyclic graphs](./Data%20Structures/Graphs.md#4-acyclic-graphs) **`P0`**

  - [ ] [Bipartite graphs](./Data%20Structures/Graphs.md#6-bipartite-graphs) **`P0`**

  - [ ] [Directed graphs](./Data%20Structures/Graphs.md#3-directed-graphs) **`P0`**

  - [ ] [Graphs with special properties (e.g., planar graphs, Eulerian graphs)](./Data%20Structures/Graphs.md#8-graphs-with-special-properties-eg-planar-graphs-eulerian-graphs) **`P0`**

  - [ ] [Representations (adjacency matrix, adjacency list)](./Data%20Structures/Graphs.md#1-representations-adjacency-matrix-adjacency-list) **`P1`**

    - [ ] [Edge list](./Data%20Structures/Graphs.md#11-edge-list) **`P1`**

    - [ ] [Incidence matrix](./Data%20Structures/Graphs.md#12-incidence-matrix) **`P2`**

  - [ ] [Spanning trees (Minimum Spanning Tree, Maximum Spanning Tree)](./Data%20Structures/Graphs.md#7-spanning-trees-minimum-spanning-tree-maximum-spanning-tree) **`P0`**

  - [ ] [Traversal algorithms (DFS, BFS)](./Data%20Structures/Graphs.md#2-traversal-algorithms-dfs-bfs) **`P0`**

  - [ ] [Weighted graphs](./Data%20Structures/Graphs.md#5-weighted-graphs) **`P0`**

- [ ] [**Hash Tables**](./Data%20Structures/Hash-Tables.md) **`P0`**

  - [ ] [Bloom Filters](./Data%20Structures/Hash-Tables.md#6-bloom-filters) **`P2`**

  - [ ] [Collision resolution techniques (chaining, open addressing)](./Data%20Structures/Hash-Tables.md#2-collision-resolution-techniques-chaining-open-addressing) **`P1`**

  - [ ] [Count-Min Sketch](./Data%20Structures/Hash-Tables.md#7-count-min-sketch) **`P2`**

  - [ ] [Cuckoo Hashing](./Data%20Structures/Hash-Tables.md#4-cuckoo-hashing) **`P0`**

  - [ ] [Hash functions](./Data%20Structures/Hash-Tables.md#1-hash-functions) **`P0`**

  - [ ] [Perfect Hashing](./Data%20Structures/Hash-Tables.md#5-perfect-hashing) **`P2`**

  - [ ] [Robin Hood Hashing](./Data%20Structures/Hash-Tables.md#3-robin-hood-hashing) **`P0`**

- [ ] [**Linked Lists**](./Data%20Structures/LinkedList.md) **`P0`**

  - [ ] Circular linked lists **`P0`**

  - [ ] Doubly linked lists **`P0`**

    - [ ] Circular doubly linked lists **`P0`**

  - [ ] Singly linked lists **`P0`**

    - [ ] Circularly linked lists **`P0`**

    - [ ] Lock-free linked lists **`P0`**

  - [ ] Skip lists **`P1`**

  - [ ] Unrolled linked lists **`P2`**

- [ ] [**Queues**](./Data%20Structures/Queues.md) **`P0`**

  - [ ] [Applications (e.g., BFS, job scheduling)](./Data%20Structures/Queues.md#2-applications-eg-bfs-job-scheduling) **`P0`**

  - [ ] [Implementations (e.g., array-based, linked list-based, priority queues)](./Data%20Structures/Queues.md#1-implementations-eg-array-based-linked-list-based-priority-queues) **`P0`**

    - [ ] [Circular queue](./Data%20Structures/Queues.md#11-circular-queue) **`P0`**

    - [ ] [Double-ended queue (Deque)](./Data%20Structures/Queues.md#12-double-ended-queue-deque) **`P1`**

- [ ] [**Stacks**](./Data%20Structures/Stacks.md) **`P0`**

  - [ ] [Applications (e.g., expression evaluation, backtracking)](./Data%20Structures/Stacks.md#2-applications-eg-expression-evaluation-backtracking) **`P0`**

  - [ ] [Implementations using arrays and linked lists](./Data%20Structures/Stacks.md#1-implementations-using-arrays-and-linked-lists) **`P0`**

    - [ ] [Array-based stack](./Data%20Structures/Stacks.md#11-array-based-stack) **`P0`**

    - [ ] [Linked list-based stack](./Data%20Structures/Stacks.md#12-linked-list-based-stack) **`P0`**

  - [ ] [Priority stacks](./Data%20Structures/Stacks.md#3-priority-stacks) **`P2`**

- [ ] [**Trees**](./Data%20Structures/Trees.md) **`P0`**

  - [ ] [AVL Trees](./Data%20Structures/Trees.md#4-avl-trees) **`P0`**

  - [ ] [B-Trees](./Data%20Structures/Trees.md#7-b-trees) **`P0`**

  - [ ] [Binary Search Trees (BST)](./Data%20Structures/Trees.md#2-binary-search-trees-bst) **`P0`**

    - [ ] [Self-balancing BST](./Data%20Structures/Trees.md#3-self-balancing-bst) **`P1`**

      - [ ] [Scapegoat tree](./Data%20Structures/Trees.md#31-scapegoat-tree) **`P2`**

      - [ ] [Tango tree](./Data%20Structures/Trees.md#32-tango-tree) **`P2`**

  - [ ] [Binary Trees](./Data%20Structures/Trees.md#1-binary-trees) **`P0`**

    - [ ] [Complete binary tree](./Data%20Structures/Trees.md#12-complete-binary-tree) **`P0`**

    - [ ] [Full binary tree](./Data%20Structures/Trees.md#11-full-binary-tree) **`P0`**

    - [ ] [Perfect binary tree](./Data%20Structures/Trees.md#13-perfect-binary-tree) **`P2`**

  - [ ] [Heap Trees (min-heap, max-heap)](./Data%20Structures/Trees.md#6-heap-trees-min-heap-max-heap) **`P0`**

  - [ ] [Radix Trees](./Data%20Structures/Trees.md#10-radix-trees) **`P2`**

  - [ ] [Red-Black Trees](./Data%20Structures/Trees.md#5-red-black-trees) **`P0`**

  - [ ] [Splay Trees](./Data%20Structures/Trees.md#8-splay-trees) **`P2`**

  - [ ] [Trie](./Data%20Structures/Trees.md#9-trie) **`P0`**

</details>


### 5. Databases

![Databases progress](assets/progress/domain-5.svg?v=ba0990857b)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**ACID properties**](./Databases/ACID.md) **`P0`**

  - [ ] [Atomicity](./Databases/ACID.md#1-atomicity) **`P1`**

  - [ ] [Consistency](./Databases/ACID.md#2-consistency) **`P1`**

  - [ ] [Durability](./Databases/ACID.md#4-durability) **`P1`**

  - [ ] [Isolation](./Databases/ACID.md#3-isolation) **`P1`**

- [ ] [**Database design and optimization**](./System%20Design/Database-Design-and-Optimization.md) **`P1`**

  - [ ] [Materialized views](./System%20Design/Database-Design-and-Optimization.md#2-materialized-views) **`P1`**

  - [ ] [Partitioning](./System%20Design/Database-Design-and-Optimization.md#1-partitioning) **`P0`**

- [ ] [**Indexing**](./Databases/Indexing.md) **`P0`**

  - [ ] [B-tree](./Databases/Indexing.md#1-b-tree) **`P0`**

  - [ ] [B+ tree](./Databases/Indexing.md#2-b-tree) **`P0`**

  - [ ] [Bitmap Indexing](./Databases/Indexing.md#3-bitmap-indexing) **`P0`**

- [ ] [**NoSQL databases**](./Databases/NoSQL.md) **`P0`**

  - [ ] [Examples](./Databases/NoSQL.md#5-mongodb-interview-questions) **`P1`**

    - [ ] [MongoDB Interview Questions](./Databases/NoSQL.md#5-mongodb-interview-questions) **`P1`**

    - [ ] [Redis Interview Questions](./Databases/NoSQL.md#6-redis-interview-questions) **`P1`**

  - [ ] [Types](./Databases/NoSQL.md#0-what-is-nosql-and-why) **`P1`**

    - [ ] [Column-family](./Databases/NoSQL.md#3-column-family) **`P1`**

    - [ ] [Document-based](./Databases/NoSQL.md#1-document-based) **`P1`**

    - [ ] [Graph](./Databases/NoSQL.md#4-graph) **`P0`**

    - [ ] [Key-value](./Databases/NoSQL.md#2-key-value) **`P1`**

- [ ] [**Relational databases (SQL)**](./Databases/SQL-DML.md#0-the-sql-families-at-a-glance) **`P0`** · [Full interview reference](./Databases/database-interview-prep-guide.md)

  - [ ] [Database Constraints](./Databases/Constraints.md) **`P1`**

    - [ ] [Check constraint](./Databases/Constraints.md#4-check-constraint) **`P1`**

    - [ ] [Default constraint](./Databases/Constraints.md#5-default-constraint) **`P1`**

    - [ ] [Foreign key](./Databases/Constraints.md#2-foreign-key) **`P1`**

    - [ ] [Primary key](./Databases/Constraints.md#1-primary-key) **`P1`**

    - [ ] [Unique constraint](./Databases/Constraints.md#3-unique-constraint) **`P1`**

  - [ ] [Joins](./Databases/Joins.md) **`P0`**

    - [ ] [Cross joins](./Databases/Joins.md#3-cross-joins) **`P0`**

    - [ ] [Inner joins](./Databases/Joins.md#1-inner-joins) **`P0`**

    - [ ] [Outer joins (left, right, full)](./Databases/Joins.md#2-outer-joins-left-right-full) **`P0`**

  - [ ] [Normalization forms](./Databases/Normalization.md) **`P0`**

    - [ ] [Boyce-Codd Normal Form (BCNF)](./Databases/Normalization.md#5-boyce-codd-normal-form-bcnf) **`P1`**

    - [ ] [First Normal Form (1NF)](./Databases/Normalization.md#2-first-normal-form-1nf) **`P1`**

    - [ ] [Second Normal Form (2NF)](./Databases/Normalization.md#3-second-normal-form-2nf) **`P1`**

    - [ ] [Third Normal Form (3NF)](./Databases/Normalization.md#4-third-normal-form-3nf) **`P1`**

  - [ ] [SQL Data Control Language (DCL)](./Databases/SQL-DDL-DCL-TCL.md#4-grant-statement) **`P0`**

    - [ ] [GRANT statement](./Databases/SQL-DDL-DCL-TCL.md#4-grant-statement) **`P1`**

    - [ ] [REVOKE statement](./Databases/SQL-DDL-DCL-TCL.md#5-revoke-statement) **`P1`**

  - [ ] [SQL Data Definition Language (DDL)](./Databases/SQL-DDL-DCL-TCL.md) **`P0`**

    - [ ] [ALTER statement](./Databases/SQL-DDL-DCL-TCL.md#2-alter-statement) **`P1`**

    - [ ] [CREATE statement](./Databases/SQL-DDL-DCL-TCL.md#1-create-statement) **`P1`**

    - [ ] [DROP statement](./Databases/SQL-DDL-DCL-TCL.md#3-drop-statement) **`P1`**

  - [ ] [SQL Data Manipulation Language (DML)](./Databases/SQL-DML.md) **`P0`**

    - [ ] [Control-of-flow language (e.g., CASE, IF-ELSE)](./Databases/SQL-DML.md#9-control-of-flow-language-case-if-else) **`P1`**

    - [ ] [DELETE statement](./Databases/SQL-DML.md#4-delete-statement) **`P1`**

    - [ ] [Explicit vs. Implicit transactions](./Databases/SQL-DML.md#8-explicit-vs-implicit-transactions) **`P0`**

    - [ ] [INSERT statement](./Databases/SQL-DML.md#2-insert-statement) **`P1`**

    - [ ] [MERGE statement](./Databases/SQL-DML.md#5-merge-statement) **`P1`**

    - [ ] [SELECT statement](./Databases/SQL-DML.md#1-select-statement) **`P1`**

    - [ ] [TRUNCATE statement](./Databases/SQL-DML.md#6-truncate-statement) **`P1`**

    - [ ] [UPDATE statement](./Databases/SQL-DML.md#3-update-statement) **`P1`**

    - [ ] [UPSERT operations](./Databases/SQL-DML.md#7-upsert-operations) **`P1`**

  - [ ] [SQL Data Query Language (DQL)](./Databases/SQL-DQL.md) **`P0`**

    - [ ] [Aggregate functions (e.g., SUM, AVG, COUNT)](./Databases/SQL-DQL.md#2-aggregate-functions-sum-avg-count) **`P1`**

    - [ ] [GROUP BY and HAVING clauses](./Databases/SQL-DQL.md#3-group-by-and-having-clauses) **`P1`**

    - [ ] [Subqueries](./Databases/SQL-DQL.md#1-subqueries) **`P1`**

    - [ ] [Window functions](./Databases/SQL-DQL.md#4-window-functions) **`P1`**

  - [ ] [Stored Procedures and Functions](./Databases/Stored-Procedures-Triggers-Views.md#1-stored-procedures-and-functions) **`P1`**

    - [ ] [Creation](./Databases/Stored-Procedures-Triggers-Views.md#11-creation) **`P1`**

    - [ ] [Execution](./Databases/Stored-Procedures-Triggers-Views.md#12-execution) **`P1`**

    - [ ] [Parameters](./Databases/Stored-Procedures-Triggers-Views.md#13-parameters) **`P1`**

  - [ ] [Transaction Control](./Databases/SQL-DDL-DCL-TCL.md#6-commit-statement) **`P0`**

    - [ ] [COMMIT statement](./Databases/SQL-DDL-DCL-TCL.md#6-commit-statement) **`P1`**

    - [ ] [ROLLBACK statement](./Databases/SQL-DDL-DCL-TCL.md#7-rollback-statement-and-savepoint) **`P1`**

  - [ ] [Triggers](./Databases/Stored-Procedures-Triggers-Views.md#2-triggers) **`P1`**

    - [ ] [Trigger execution order](./Databases/Stored-Procedures-Triggers-Views.md#22-trigger-execution-order) **`P1`**

    - [ ] [Types of triggers (BEFORE, AFTER)](./Databases/Stored-Procedures-Triggers-Views.md#21-types-of-triggers-before-after) **`P1`**

  - [ ] [Views](./Databases/Stored-Procedures-Triggers-Views.md#3-views) **`P1`**

    - [ ] [Advantages and use cases](./Databases/Stored-Procedures-Triggers-Views.md#32-advantages-and-use-cases) **`P1`**

    - [ ] [Materialized views vs. regular views](./Databases/Stored-Procedures-Triggers-Views.md#31-materialized-views-vs-regular-views) **`P1`**

- [ ] [**Transactions**](./Databases/Transactions-and-Isolation.md) **`P0`**

  - [ ] [ACID properties in transactions](./Databases/Transactions-and-Isolation.md#1-acid-properties-in-transactions) **`P0`**

  - [ ] [Isolation levels](./Databases/Transactions-and-Isolation.md#3-isolation-levels) **`P1`**

    - [ ] [Read Committed](./Databases/Transactions-and-Isolation.md#32-read-committed) **`P1`**

    - [ ] [Read Uncommitted](./Databases/Transactions-and-Isolation.md#31-read-uncommitted) **`P1`**

    - [ ] [Repeatable Read](./Databases/Transactions-and-Isolation.md#33-repeatable-read) **`P1`**

    - [ ] [Serializable](./Databases/Transactions-and-Isolation.md#34-serializable) **`P1`**

</details>


### 6. Low-Level Design & Object-Oriented Design

![Low-Level Design & Object-Oriented Design progress](assets/progress/domain-6.svg?v=93bbbffad8)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**API, Persistence, and Concurrency Design**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md) **`P0`**

  - [ ] [Data access layering, repositories, and transaction boundaries](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#1-data-access-layering-repositories-and-transaction-boundaries) **`P0`**

  - [ ] [Idempotent operations and safe retries in low-level APIs](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#2-idempotent-operations-and-safe-retries-in-low-level-apis) **`P0`**

  - [ ] [Interface-first design and stable public contracts](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#3-interface-first-design-and-stable-public-contracts) **`P0`**

  - [ ] [Testability: dependency injection, mocks, and interface contracts](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#4-testability-dependency-injection-mocks-and-interface-contracts) **`P0`**

  - [ ] [Thread safety, synchronization, immutability, and race prevention](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#5-thread-safety-synchronization-immutability-and-race-prevention) **`P0`**

  - [ ] [Validation, domain errors, exceptions, and failure handling](./Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#6-validation-domain-errors-exceptions-and-failure-handling) **`P0`**

- [ ] [**Classic Low-Level Design Interview Problems**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md) **`P1`**

  - [ ] [Design a cache with LRU/LFU eviction](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#1-design-a-cache-with-lrulfu-eviction) **`P0`**

  - [ ] [Design a chess or tic-tac-toe engine (rules, turns, extensibility)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#2-design-a-chess-or-tic-tac-toe-engine-rules-turns-extensibility) **`P1`**

  - [ ] [Design a file system / in-memory directory tree](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#3-design-a-file-system--in-memory-directory-tree) **`P0`**

  - [ ] [Design a library management system (loans, reservations, fines)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#4-design-a-library-management-system-loans-reservations-fines) **`P1`**

  - [ ] [Design a logging framework (appenders, levels, concurrency)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#5-design-a-logging-framework-appenders-levels-concurrency) **`P0`**

  - [ ] [Design a movie ticket booking system (seat locking, expiry)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#6-design-a-movie-ticket-booking-system-seat-locking-expiry) **`P1`**

  - [ ] [Design a notification framework with channels and retries](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#7-design-a-notification-framework-with-channels-and-retries) **`P0`**

  - [ ] [Design a parking lot (spots, pricing, tickets, concurrency)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#8-design-a-parking-lot-spots-pricing-tickets-concurrency) **`P0`**

  - [ ] [Design a rate limiter (strategy interfaces, pluggable algorithms)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#9-design-a-rate-limiter-strategy-interfaces-pluggable-algorithms) **`P0`**

  - [ ] [Design a splitwise-style expense sharing system](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#10-design-a-splitwise-style-expense-sharing-system) **`P1`**

  - [ ] [Design a vending machine (inventory, payment, state transitions)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#11-design-a-vending-machine-inventory-payment-state-transitions) **`P1`**

  - [ ] [Design an elevator system (scheduling, requests, states)](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#12-design-an-elevator-system-scheduling-requests-states) **`P1`**

- [ ] [**Design Patterns in Practice**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md) **`P0`**

  - [ ] [Adapter / Facade for external integration](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#1-adapter--facade-for-external-integration) **`P1`**

  - [ ] [Builder for complex object construction](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#2-builder-for-complex-object-construction) **`P1`**

  - [ ] [Command pattern for undo, queues, and operations](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#3-command-pattern-for-undo-queues-and-operations) **`P1`**

  - [ ] [Decorator / Proxy for behavior interception](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#4-decorator--proxy-for-behavior-interception) **`P1`**

  - [ ] [Dependency injection and inversion of control](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#5-dependency-injection-and-inversion-of-control) **`P1`**

  - [ ] [Factory / Abstract Factory for object creation and extensibility](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#6-factory--abstract-factory-for-object-creation-and-extensibility) **`P0`**

  - [ ] [Observer / Pub-Sub for state-change notifications](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#7-observer--pub-sub-for-state-change-notifications) **`P0`**

  - [ ] [Recognize when not to introduce a design pattern](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#8-recognize-when-not-to-introduce-a-design-pattern) **`P0`**

  - [ ] [Repository / Unit of Work for persistence boundaries](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#9-repository--unit-of-work-for-persistence-boundaries) **`P1`**

  - [ ] [State pattern for workflow transitions](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#10-state-pattern-for-workflow-transitions) **`P1`**

  - [ ] [Strategy for configurable behavior](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#11-strategy-for-configurable-behavior) **`P0`**

- [ ] [**Implementation and Review**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Implementation-and-Review.md) **`P1`**

  - [ ] [Demonstrate a requirements change without rewriting the design](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Implementation-and-Review.md#1-demonstrate-a-requirements-change-without-rewriting-the-design) **`P0`**

  - [ ] [Discuss complexity, extensibility, and maintainability trade-offs](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Implementation-and-Review.md#2-discuss-complexity-extensibility-and-maintainability-trade-offs) **`P0`**

  - [ ] [Review edge cases, invariants, and failure behavior](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Implementation-and-Review.md#3-review-edge-cases-invariants-and-failure-behavior) **`P0`**

  - [ ] [Write compilable, testable code for a scoped LLD problem](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Implementation-and-Review.md#4-write-compilable-testable-code-for-a-scoped-lld-problem) **`P1`**

- [ ] [**Object-Oriented Design Fundamentals**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md) **`P0`**

  - [ ] [Classes, objects, interfaces, abstract classes, and composition](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#1-classes-objects-interfaces-abstract-classes-and-composition) **`P0`**

  - [ ] [Cohesion, coupling, separation of concerns, and modularity](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#2-cohesion-coupling-separation-of-concerns-and-modularity) **`P1`**

  - [ ] [DRY, KISS, YAGNI, and premature abstraction trade-offs](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#3-dry-kiss-yagni-and-premature-abstraction-trade-offs) **`P0`**

  - [ ] [Encapsulation, abstraction, inheritance, and polymorphism in design](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#4-encapsulation-abstraction-inheritance-and-polymorphism-in-design) **`P0`**

  - [ ] [Favor composition over inheritance; identify misuse of hierarchies](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#5-favor-composition-over-inheritance-identify-misuse-of-hierarchies) **`P0`**

  - [ ] [SOLID principles applied to practical classes and services](./Low-Level%20Design%20%26%20Object-Oriented%20Design/OOD-Fundamentals.md#6-solid-principles-applied-to-practical-classes-and-services) **`P0`**

- [ ] [**Requirements and Domain Modeling**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md) **`P0`**

  - [ ] [Clarify functional/non-functional requirements and scope](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md#1-clarify-functionalnon-functional-requirements-and-scope) **`P0`**

  - [ ] [Define extension points without overengineering](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md#5-define-extension-points-without-overengineering) **`P1`**

  - [ ] [Identify entities, value objects, aggregates, and invariants](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md#3-identify-entities-value-objects-aggregates-and-invariants) **`P1`**

  - [ ] [Model relationships, ownership, object lifecycles, and state transitions](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md#4-model-relationships-ownership-object-lifecycles-and-state-transitions) **`P1`**

  - [ ] [Translate use cases into classes, interfaces, and interactions](./Low-Level%20Design%20%26%20Object-Oriented%20Design/Requirements-and-Domain-Modeling.md#2-translate-use-cases-into-classes-interfaces-and-interactions) **`P0`**

- [ ] [**UML and Communication**](./Low-Level%20Design%20%26%20Object-Oriented%20Design/UML-and-Communication.md) **`P1`**

  - [ ] [Class diagrams: associations, aggregation, composition, inheritance](./Low-Level%20Design%20%26%20Object-Oriented%20Design/UML-and-Communication.md#1-class-diagrams-associations-aggregation-composition-inheritance) **`P0`**

  - [ ] [Explain trade-offs while iterating the model with an interviewer](./Low-Level%20Design%20%26%20Object-Oriented%20Design/UML-and-Communication.md#2-explain-trade-offs-while-iterating-the-model-with-an-interviewer) **`P1`**

  - [ ] [Sequence diagrams: method calls, boundaries, and async events](./Low-Level%20Design%20%26%20Object-Oriented%20Design/UML-and-Communication.md#3-sequence-diagrams-method-calls-boundaries-and-async-events) **`P0`**

  - [ ] [State machine diagrams: transitions, guards, and terminal states](./Low-Level%20Design%20%26%20Object-Oriented%20Design/UML-and-Communication.md#4-state-machine-diagrams-transitions-guards-and-terminal-states) **`P1`**

</details>


### 7. Networking

![Networking progress](assets/progress/domain-7.svg?v=d333ba565d)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**DNS (Domain Name System)**](./Networking/DNS.md) **`P0`**

  - [ ] [Resolution process](./Networking/DNS.md#2-resolution-process) **`P0`**

- [ ] [**HTTP protocol**](./Networking/HTTP.md) **`P0`**

  - [ ] [Request methods (GET, POST, etc.)](./Networking/HTTP.md#1-request-methods-get-post-etc) **`P1`**

  - [ ] [Status codes](./Networking/HTTP.md#2-status-codes) **`P1`**

- [ ] [**Routing algorithms**](./Networking/Routing-Algorithms.md) **`P1`**

  - [ ] [Shortest Path algorithms (Dijkstra's, Bellman-Ford)](./Networking/Routing-Algorithms.md#1-shortest-path-algorithms-the-idea) **`P2`**

- [ ] [**TCP/IP stack**](./Networking/TCP-IP-Stack.md) **`P0`**

  - [ ] [OSI model layers](./Networking/TCP-IP-Stack.md#1-osi-model-layers) **`P1`**

  - [ ] [TCP vs. UDP](./Networking/TCP-IP-Stack.md#3-tcp-vs-udp) **`P0`**

</details>


### 8. Operating Systems

![Operating Systems progress](assets/progress/domain-8.svg?v=a91dcbe287)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Deadlock detection and prevention**](./Operating%20Systems/Deadlocks.md) **`P0`**

- [ ] [**File systems**](./Operating%20Systems/File-Systems.md) **`P1`**

  - [ ] [Distributed file systems (HDFS, Ceph)](./Operating%20Systems/File-Systems.md#4-distributed-file-systems-hdfs-ceph) **`P0`**

  - [ ] [File system encryption](./Operating%20Systems/File-Systems.md#3-file-system-encryption) **`P0`**

  - [ ] [Journaling file systems (ext3, ext4)](./Operating%20Systems/File-Systems.md#1-journaling-file-systems-ext3-ext4) **`P1`**

  - [ ] [Network file systems (NFS, SMB)](./Operating%20Systems/File-Systems.md#2-network-file-systems-nfs-smb) **`P1`**

- [ ] [**Memory management**](./Operating%20Systems/Memory-Management.md) **`P1`**

  - [ ] [Buddy memory allocation](./Operating%20Systems/Memory-Management.md#3-buddy-memory-allocation) **`P1`**

  - [ ] [Memory-mapped files](./Operating%20Systems/Memory-Management.md#2-memory-mapped-files) **`P1`**

  - [ ] [Page replacement algorithms (LRU, FIFO, Clock)](./Operating%20Systems/Memory-Management.md#1-page-replacement-algorithms-fifo-lru-clock-optimal) **`P1`**

- [ ] [**Processes**](./Operating%20Systems/Processes.md) **`P0`**

- [ ] [**Scheduling algorithms**](./Operating%20Systems/Scheduling.md) **`P1`**

  - [ ] [Earliest Deadline First (EDF)](./Operating%20Systems/Scheduling.md#3-earliest-deadline-first-edf) **`P1`**

  - [ ] [Fair share scheduling](./Operating%20Systems/Scheduling.md#2-fair-share-scheduling) **`P1`**

  - [ ] [Weighted Fair Queuing (WFQ)](./Operating%20Systems/Scheduling.md#4-weighted-fair-queuing-wfq) **`P1`**

- [ ] [**Thread synchronization mechanisms**](./Operating%20Systems/Thread-Synchronization.md) **`P0`**

  - [ ] [Monitors](./Operating%20Systems/Thread-Synchronization.md#3-monitors-mutex--condition-variable) **`P1`**

  - [ ] [Mutexes](./Operating%20Systems/Thread-Synchronization.md#1-mutexes) **`P1`**

  - [ ] [Semaphores](./Operating%20Systems/Thread-Synchronization.md#2-semaphores) **`P1`**

- [ ] [**Threads**](./Operating%20Systems/Threads.md) **`P0`**

</details>


### 9. Problem-solving and Coding

![Problem-solving and Coding progress](assets/progress/domain-9.svg?v=675f7b3a0e)

<details>
<summary><strong>View topics and checklist</strong></summary>

- Practice: [Contest practice (Codeforces + AtCoder PDFs)](./Contest-Practice/README.md)

- [ ] [**Coding best practices**](./Problem-solving%20and%20Coding/Coding-Best-Practices.md) **`P1`**

  - [ ] [Code readability](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#3-code-readability) **`P1`**

  - [ ] [Code reusability](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#4-code-reusability) **`P1`**

  - [ ] [Code reviews](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#8-code-reviews) **`P1`**

  - [ ] [Error handling](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#5-error-handling) **`P1`**

  - [ ] [Naming conventions](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#2-naming-conventions) **`P1`**

  - [ ] [Testing](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#6-testing) **`P1`**

  - [ ] [Version control (e.g., Git)](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#7-version-control-eg-git) **`P1`**

- [ ] **Coding techniques** **`P1`**

  - [ ] Backtracking **`P0`**

  - [ ] Binary search **`P0`**

  - [ ] Bit manipulation **`P1`**

  - [ ] Divide and conquer **`P1`**

  - [ ] Dynamic programming **`P0`**

  - [ ] Fast and slow pointers **`P0`**

  - [ ] Greedy algorithms **`P0`**

  - [ ] Hashing **`P0`**

  - [ ] [Modular programming](./Problem-solving%20and%20Coding/Coding-Best-Practices.md#1-modular-programming) **`P1`**

  - [ ] [Recursion](./Programming%20Languages%20and%20Concepts/Recursion.md) **`P0`**

  - [ ] [Sliding window](./Algorithms/Sliding-Window-Algo.md) **`P0`**

  - [ ] [Two pointers](./Algorithms/Two-Pointer-Algo.md) **`P0`**

- [ ] [**Debugging**](./Problem-solving%20and%20Coding/Debugging.md) **`P1`**

  - [ ] [Debugger tools](./Problem-solving%20and%20Coding/Debugging.md#2-debugger-tools) **`P1`**

  - [ ] [Print debugging](./Problem-solving%20and%20Coding/Debugging.md#1-print-debugging) **`P1`**

  - [ ] [Rubber duck debugging](./Problem-solving%20and%20Coding/Debugging.md#3-rubber-duck-debugging) **`P1`**

- [ ] [**Optimization**](./Problem-solving%20and%20Coding/Optimization.md) **`P1`**

  - [ ] [Algorithmic optimization](./Problem-solving%20and%20Coding/Optimization.md#1-algorithmic-optimization) **`P1`**

  - [ ] [Profiling tools](./Problem-solving%20and%20Coding/Optimization.md#3-profiling-tools) **`P1`**

  - [ ] [Space-time trade-offs](./Problem-solving%20and%20Coding/Optimization.md#2-space-time-trade-offs) **`P1`**

- [ ] [**Problem-solving strategies**](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md) **`P1`**

  - [ ] [Break it down](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#2-break-it-down) **`P1`**

  - [ ] [Implement the plan](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#6-implement-the-plan) **`P1`**

  - [ ] [Look for patterns](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#4-look-for-patterns) **`P1`**

  - [ ] [Make a plan](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#5-make-a-plan) **`P1`**

  - [ ] [Solve a simpler problem](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#3-solve-a-simpler-problem) **`P1`**

  - [ ] [Test your solution](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#7-test-your-solution) **`P1`**

  - [ ] [Understand the problem](./Problem-solving%20and%20Coding/Problem-Solving-Strategies.md#1-understand-the-problem) **`P1`**

- [ ] [**Time and space complexity analysis**](./Problem-solving%20and%20Coding/Complexity-Analysis.md) **`P0`**

  - [ ] [Big O notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#1-big-o-notation) **`P0`**

  - [ ] [Big Omega notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#2-big-omega-notation) **`P0`**

  - [ ] [Big Theta notation](./Problem-solving%20and%20Coding/Complexity-Analysis.md#3-big-theta-notation) **`P1`**

  - [ ] [Space complexity analysis](./Problem-solving%20and%20Coding/Complexity-Analysis.md#4-space-complexity-analysis) **`P0`**

</details>


### 10. Programming Languages and Concepts

![Programming Languages and Concepts progress](assets/progress/domain-10.svg?v=802412617a)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Asynchronous programming**](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md) **`P0`**

  - [ ] [Callbacks](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#1-callbacks) **`P1`**

  - [ ] [Coroutines](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#4-coroutines) **`P1`**

  - [ ] [Futures](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#3-futures) **`P1`**

  - [ ] [Promises](./Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#2-promises) **`P0`**

- [ ] [**Concurrency**](./Programming%20Languages%20and%20Concepts/Concurrency.md) **`P0`**

  - [ ] [Asynchronous programming](./Programming%20Languages%20and%20Concepts/Concurrency.md#7-asynchronous-programming) **`P0`**

  - [ ] [Deadlocks](./Programming%20Languages%20and%20Concepts/Concurrency.md#4-deadlocks) **`P0`**

  - [ ] [Parallelism vs. Concurrency](./Programming%20Languages%20and%20Concepts/Concurrency.md#6-parallelism-vs-concurrency) **`P0`**

  - [ ] [Race conditions](./Programming%20Languages%20and%20Concepts/Concurrency.md#5-race-conditions) **`P0`**

  - [ ] [Synchronization primitives (locks, mutexes, semaphores)](./Programming%20Languages%20and%20Concepts/Concurrency.md#2-synchronization-primitives-locks-mutexes-semaphores) **`P1`**

  - [ ] [Thread safety](./Programming%20Languages%20and%20Concepts/Concurrency.md#3-thread-safety) **`P0`**

  - [ ] [Threads vs. Processes](./Programming%20Languages%20and%20Concepts/Concurrency.md#1-threads-vs-processes) **`P0`**

- [ ] [**Design patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md#0-what-is-a-design-pattern) **`P0`**

  - [ ] [Behavioral patterns](./System%20Design/Design%20Patterns/Behavioral-Patterns.md) **`P1`**

  - [ ] [Creational patterns](./System%20Design/Design%20Patterns/Creational-Patterns.md) **`P1`**

  - [ ] [Structural patterns](./System%20Design/Design%20Patterns/Structural-Patterns.md) **`P1`**

- [ ] [**Error handling**](./Programming%20Languages%20and%20Concepts/Error-Handling.md) **`P1`**

  - [ ] [Error propagation](./Programming%20Languages%20and%20Concepts/Error-Handling.md#4-error-propagation) **`P1`**

  - [ ] [Error recovery](./Programming%20Languages%20and%20Concepts/Error-Handling.md#5-error-recovery) **`P1`**

  - [ ] [Exception handling mechanisms](./Programming%20Languages%20and%20Concepts/Error-Handling.md#2-exception-handling-mechanisms) **`P1`**

  - [ ] [Exception safety](./Programming%20Languages%20and%20Concepts/Error-Handling.md#3-exception-safety) **`P1`**

  - [ ] [Exceptions vs. Error codes](./Programming%20Languages%20and%20Concepts/Error-Handling.md#1-exceptions-vs-error-codes) **`P1`**

- [ ] [**Functional programming**](./Programming%20Languages%20and%20Concepts/Functional-Programming.md) **`P1`**

  - [ ] [Closures](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#3-closures) **`P1`**

  - [ ] [Higher-order functions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#2-higher-order-functions) **`P1`**

  - [ ] [Lambda expressions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#1-lambda-expressions) **`P0`**

  - [ ] [Pure functions](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#4-pure-functions) **`P1`**

  - [ ] [Referential transparency](./Programming%20Languages%20and%20Concepts/Functional-Programming.md#5-referential-transparency) **`P1`**

- [ ] [**Functional vs. Imperative vs. Declarative programming**](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#8-functional-vs-imperative-vs-declarative) **`P1`**

- [ ] [**Garbage collection**](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#3-tracing-vs-reference-counting) **`P0`**

  - [ ] [Generational GC](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#5-generational-gc) **`P1`**

  - [ ] [Tracing vs. Reference counting](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#3-tracing-vs-reference-counting) **`P0`**

- [ ] [**Lambda calculus**](./Programming%20Languages%20and%20Concepts/Lambda-Calculus.md) **`P2`**

- [ ] [**Memory layout**](./Programming%20Languages%20and%20Concepts/Memory-Layout.md) **`P1`**

  - [ ] [Data segment vs. Code segment](./Programming%20Languages%20and%20Concepts/Memory-Layout.md#2-data-segment-vs-code-segment) **`P1`**

  - [ ] [Stack vs. Heap memory allocation](./Programming%20Languages%20and%20Concepts/Memory-Layout.md#1-stack-vs-heap-memory-allocation) **`P0`**

- [ ] [**Memory management**](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md) **`P1`**

  - [ ] [Garbage collection algorithms (e.g., Mark and Sweep, Generational GC)](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#4-mark-and-sweep) **`P0`**

  - [ ] [Manual vs. Automatic memory management](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#2-manual-vs-automatic-memory-management) **`P1`**

  - [ ] [Stack vs. Heap](./Programming%20Languages%20and%20Concepts/Memory-Management-and-GC.md#1-stack-vs-heap) **`P0`**

- [ ] [**Networking**](./Programming%20Languages%20and%20Concepts/Network-Programming.md) **`P1`**

  - [ ] [Client-server architecture](./Programming%20Languages%20and%20Concepts/Network-Programming.md#2-client-server-architecture) **`P1`**

  - [ ] [Protocols (TCP, UDP)](./Programming%20Languages%20and%20Concepts/Network-Programming.md#3-protocols-tcp-udp-in-code) **`P0`**

  - [ ] [Remote Procedure Call (RPC)](./Programming%20Languages%20and%20Concepts/Network-Programming.md#4-remote-procedure-call-rpc) **`P1`**

  - [ ] [Sockets](./Programming%20Languages%20and%20Concepts/Network-Programming.md#1-sockets) **`P1`**

- [ ] [**Object-oriented programming (OOP)**](./Programming%20Languages%20and%20Concepts/OOP.md) **`P0`**

  - [ ] [Abstraction](./Programming%20Languages%20and%20Concepts/OOP.md#4-abstraction) **`P0`**

  - [ ] [Composition vs. Inheritance](./Programming%20Languages%20and%20Concepts/OOP.md#5-composition-vs-inheritance) **`P0`**

  - [ ] [Encapsulation](./Programming%20Languages%20and%20Concepts/OOP.md#1-encapsulation) **`P0`**

  - [ ] [Inheritance](./Programming%20Languages%20and%20Concepts/OOP.md#2-inheritance) **`P0`**

  - [ ] [Method overriding vs. Method overloading](./Programming%20Languages%20and%20Concepts/OOP.md#6-method-overriding-vs-method-overloading) **`P1`**

  - [ ] [Polymorphism](./Programming%20Languages%20and%20Concepts/OOP.md#3-polymorphism) **`P0`**

- [ ] [**Programming paradigms**](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md) **`P1`**

  - [ ] [Aspect-oriented programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#7-aspect-oriented-programming) **`P2`**

  - [ ] [Declarative programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#2-declarative-programming) **`P1`**

  - [ ] [Event-driven programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#6-event-driven-programming) **`P0`**

  - [ ] [Functional programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#3-functional-programming) **`P1`**

  - [ ] [Imperative programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#1-imperative-programming) **`P1`**

  - [ ] [Object-oriented programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#4-object-oriented-programming) **`P0`**

  - [ ] [Procedural programming](./Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#5-procedural-programming) **`P1`**

- [ ] [**Recursion**](./Programming%20Languages%20and%20Concepts/Recursion.md) **`P0`**

  - [ ] [Anonymous recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#3-anonymous-recursion) **`P2`**

  - [ ] [Mutual recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#2-mutual-recursion) **`P2`**

  - [ ] [Tail recursion](./Programming%20Languages%20and%20Concepts/Recursion.md#1-tail-recursion) **`P0`**

- [ ] [**Regular expressions**](./Programming%20Languages%20and%20Concepts/Regular-Expressions.md) **`P1`**

- [ ] [**Type systems**](./Programming%20Languages%20and%20Concepts/Type-Systems.md) **`P1`**

  - [ ] [Nominal vs. Structural typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#3-nominal-vs-structural-typing) **`P1`**

  - [ ] [Static vs. Dynamic typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#1-static-vs-dynamic-typing) **`P1`**

  - [ ] [Strong vs. Weak typing](./Programming%20Languages%20and%20Concepts/Type-Systems.md#2-strong-vs-weak-typing) **`P1`**

- [ ] [**Virtual Memory**](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md) **`P1`**

  - [ ] [Demand Paging](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md#1-demand-paging) **`P1`**

  - [ ] [Page replacement algorithms (FIFO, LRU, Optimal)](./Programming%20Languages%20and%20Concepts/Virtual-Memory.md#2-page-replacement-algorithms-fifo-lru-optimal) **`P1`**

</details>


### 11. Security Engineering & Authentication

![Security Engineering & Authentication progress](assets/progress/domain-11.svg?v=f7ca4d5310)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Application and API Security**](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md) **`P0`**

  - [ ] [API rate limiting, quotas, abuse prevention, and audit logs](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#1-api-rate-limiting-quotas-abuse-prevention-and-audit-logs) **`P0`**

  - [ ] [Broken object-level authorization (BOLA/IDOR)](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#2-broken-object-level-authorization-bolaidor) **`P0`**

  - [ ] [CORS behavior and common misconfigurations](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#3-cors-behavior-and-common-misconfigurations) **`P1`**

  - [ ] [Cross-site scripting (XSS), output encoding, and CSP](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#4-cross-site-scripting-xss-output-encoding-and-csp) **`P1`**

  - [ ] [CSRF, SSRF, open redirects, and request smuggling basics](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#5-csrf-ssrf-open-redirects-and-request-smuggling-basics) **`P1`**

  - [ ] [File upload validation and malware scanning](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#6-file-upload-validation-and-malware-scanning) **`P1`**

  - [ ] [Input validation, schema validation, and safe deserialization](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#7-input-validation-schema-validation-and-safe-deserialization) **`P1`**

  - [ ] [OWASP Top 10 and common exploitation paths](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#8-owasp-top-10-and-common-exploitation-paths) **`P0`**

  - [ ] [SQL/NoSQL injection and parameterized queries](./Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md#9-sqlnosql-injection-and-parameterized-queries) **`P0`**

- [ ] [**Authentication and Authorization**](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md) **`P0`**

  - [ ] [Authentication vs. authorization; identity vs. session management](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#1-authentication-vs-authorization-identity-vs-session-management) **`P0`**

  - [ ] [JWT structure, claims, signature validation, and key rotation](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#2-jwt-structure-claims-signature-validation-and-key-rotation) **`P0`**

  - [ ] [OAuth 2.0 roles, authorization code + PKCE, scopes, and refresh tokens](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#3-oauth-20-roles-authorization-code--pkce-scopes-and-refresh-tokens) **`P0`**

  - [ ] [OpenID Connect (OIDC) vs. OAuth 2.0](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#4-openid-connect-oidc-vs-oauth-20) **`P0`**

  - [ ] [RBAC vs. ABAC vs. policy-based access control](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#5-rbac-vs-abac-vs-policy-based-access-control) **`P1`**

  - [ ] [Service-to-service authentication and workload identities](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#6-service-to-service-authentication-and-workload-identities) **`P0`**

  - [ ] [Sessions, cookies, SameSite, HttpOnly, Secure, and CSRF protection](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#7-sessions-cookies-samesite-httponly-secure-and-csrf-protection) **`P0`**

  - [ ] [SSO, SAML basics, MFA, and passkeys/WebAuthn](./Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md#8-sso-saml-basics-mfa-and-passkeyswebauthn) **`P1`**

- [ ] [**Core Security Principles**](./Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md) **`P1`**

  - [ ] [CIA triad, defense in depth, least privilege, and secure defaults](./Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md#1-cia-triad-defense-in-depth-least-privilege-and-secure-defaults) **`P1`**

  - [ ] [Secure SDLC, security reviews, and responsible vulnerability disclosure](./Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md#2-secure-sdlc-security-reviews-and-responsible-vulnerability-disclosure) **`P1`**

  - [ ] [Security requirements vs. security controls vs. residual risk](./Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md#3-security-requirements-vs-security-controls-vs-residual-risk) **`P0`**

  - [ ] [Threat modeling (STRIDE), trust boundaries, and attack surfaces](./Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md#4-threat-modeling-stride-trust-boundaries-and-attack-surfaces) **`P1`**

- [ ] [**Cryptography and Data Protection**](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md) **`P0`**

  - [ ] [Data classification, minimization, retention, and deletion](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#1-data-classification-minimization-retention-and-deletion) **`P1`**

  - [ ] [Encryption at rest vs. in transit and envelope encryption](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#2-encryption-at-rest-vs-in-transit-and-envelope-encryption) **`P0`**

  - [ ] [Hashing, password hashing (Argon2/bcrypt), salts, and pepper](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#3-hashing-password-hashing-argon2bcrypt-salts-and-pepper) **`P0`**

  - [ ] [HMAC, digital signatures, and authenticated encryption](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#4-hmac-digital-signatures-and-authenticated-encryption) **`P0`**

  - [ ] [KMS, secrets managers, certificate rotation, and key lifecycles](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#5-kms-secrets-managers-certificate-rotation-and-key-lifecycles) **`P1`**

  - [ ] [Symmetric vs. asymmetric encryption; key-exchange basics](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#6-symmetric-vs-asymmetric-encryption-key-exchange-basics) **`P0`**

  - [ ] [TLS handshake, certificates, certificate authorities, and mTLS](./Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md#7-tls-handshake-certificates-certificate-authorities-and-mtls) **`P1`**

- [ ] [**Infrastructure, Cloud, and Supply-Chain Security**](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md) **`P1`**

  - [ ] [Container/Kubernetes security contexts, RBAC, and network policies](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#1-containerkubernetes-security-contexts-rbac-and-network-policies) **`P0`**

  - [ ] [Dependency vulnerabilities, SBOMs, and software supply-chain attacks](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#2-dependency-vulnerabilities-sboms-and-software-supply-chain-attacks) **`P1`**

  - [ ] [IAM least privilege and privilege escalation risks](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#3-iam-least-privilege-and-privilege-escalation-risks) **`P0`**

  - [ ] [Network segmentation, zero-trust architecture, and private access](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#4-network-segmentation-zero-trust-architecture-and-private-access) **`P1`**

  - [ ] [SAST vs. DAST vs. SCA; CI security gates](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#5-sast-vs-dast-vs-sca-ci-security-gates) **`P1`**

  - [ ] [Secrets leakage prevention and incident credential rotation](./Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#6-secrets-leakage-prevention-and-incident-credential-rotation) **`P1`**

- [ ] [**LLM and Agent Security**](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md) **`P0`**

  - [ ] [Auditability and rollback of agent-triggered side effects](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#1-auditability-and-rollback-of-agent-triggered-side-effects) **`P1`**

  - [ ] [Output validation, sandboxing, and safe execution environments](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#2-output-validation-sandboxing-and-safe-execution-environments) **`P1`**

  - [ ] [Prompt injection vs. instruction-following; untrusted retrieved content](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#3-prompt-injection-vs-instruction-following-untrusted-retrieved-content) **`P0`**

  - [ ] [RAG authorization filtering, document-level access controls](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#4-rag-authorization-filtering-document-level-access-controls) **`P0`**

  - [ ] [Secrets/PII exfiltration threats through tools and model responses](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#5-secretspii-exfiltration-threats-through-tools-and-model-responses) **`P1`**

  - [ ] [Tool permission boundaries, allowlists, and human approval for writes](./Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#6-tool-permission-boundaries-allowlists-and-human-approval-for-writes) **`P1`**

- [ ] [**Security Operations and Design Interviews**](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md) **`P1`**

  - [ ] [Centralized security logging and tamper-evident audit trails](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md#1-centralized-security-logging-and-tamper-evident-audit-trails) **`P0`**

  - [ ] [Design secure multi-tenant data access and tenant isolation](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md#2-design-secure-multi-tenant-data-access-and-tenant-isolation) **`P1`**

  - [ ] [Explain trade-offs between usability, latency, and security](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md#3-explain-trade-offs-between-usability-latency-and-security) **`P0`**

  - [ ] [Incident lifecycle: detection, containment, eradication, recovery](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md#4-incident-lifecycle-detection-containment-eradication-recovery) **`P1`**

  - [ ] [Model replay attacks, confused deputy issues, and privilege boundaries](./Security%20Engineering%20%26%20Authentication/Security-Operations-and-Design-Interviews.md#5-model-replay-attacks-confused-deputy-issues-and-privilege-boundaries) **`P1`**

</details>


### 12. System Architecture

![System Architecture progress](assets/progress/domain-12.svg?v=47ccb07f4e)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Caching strategies**](./System%20Design/Caching-Strategies.md) **`P1`**

  - [ ] [Cache aside](./System%20Design/Caching-Strategies.md#1-cache-aside) **`P0`**

  - [ ] [Cache stampede prevention](./System%20Design/Caching-Strategies.md#4-cache-stampede-prevention) **`P0`**

  - [ ] [Write-behind caching](./System%20Design/Caching-Strategies.md#3-write-behind-caching) **`P1`**

  - [ ] [Write-through caching](./System%20Design/Caching-Strategies.md#2-write-through-caching) **`P1`**

- [ ] [**Client-server architecture**](./System%20Architecture/Client-Server-Architecture.md) **`P1`**

  - [ ] [Basics](./System%20Architecture/Client-Server-Architecture.md#1-basics) **`P1`**

  - [ ] [Communication protocols](./System%20Architecture/Client-Server-Architecture.md#2-communication-protocols) **`P1`**

- [ ] [**Event-Driven Architecture (EDA)**](./System%20Architecture/Event-Driven-Architecture.md) **`P0`**

  - [ ] [Advantages](./System%20Architecture/Event-Driven-Architecture.md#3-advantages) **`P1`**

  - [ ] [Basics](./System%20Architecture/Event-Driven-Architecture.md#1-basics) **`P1`**

  - [ ] [Components](./System%20Architecture/Event-Driven-Architecture.md#2-components) **`P1`**

  - [ ] [Implementations (e.g., Apache Kafka)](./System%20Architecture/Event-Driven-Architecture.md#4-implementations-eg-apache-kafka) **`P1`**

- [ ] [**Layered Architecture**](./System%20Architecture/Layered-Architecture.md) **`P1`**

  - [ ] [Business logic layer](./System%20Architecture/Layered-Architecture.md#2-business-logic-layer) **`P1`**

  - [ ] [Cross-cutting concerns layer](./System%20Architecture/Layered-Architecture.md#4-cross-cutting-concerns-layer) **`P1`**

  - [ ] [Data access layer](./System%20Architecture/Layered-Architecture.md#3-data-access-layer) **`P1`**

  - [ ] [Presentation layer](./System%20Architecture/Layered-Architecture.md#1-presentation-layer) **`P1`**

- [ ] [**Message Queuing**](./System%20Architecture/Message-Queuing.md) **`P0`**

  - [ ] [Basics](./System%20Architecture/Message-Queuing.md#1-basics) **`P1`**

  - [ ] [Implementations (e.g., RabbitMQ, Kafka)](./System%20Architecture/Message-Queuing.md#3-implementations-eg-rabbitmq-kafka) **`P1`**

  - [ ] [Use cases](./System%20Architecture/Message-Queuing.md#2-use-cases) **`P1`**

- [ ] [**Microservices**](./System%20Design/Microservices-Explained.md) **`P0`** · [Reference & 76 Q&A](./System%20Design/Microservices.md)

- [ ] [**RESTful architecture**](./System%20Architecture/REST-Explained.md) **`P0`** · [Reference](./System%20Design/RESTfulArchitecture.md)

- [ ] [**Service-Oriented Architecture (SOA)**](./System%20Architecture/SOA.md) **`P1`**

  - [ ] [Advantages](./System%20Architecture/SOA.md#2-advantages) **`P1`**

  - [ ] [Challenges](./System%20Architecture/SOA.md#3-challenges) **`P1`**

  - [ ] [Principles](./System%20Architecture/SOA.md#1-principles) **`P1`**

</details>


### 13. System Design

![System Design progress](assets/progress/domain-13.svg?v=94b4110508)

<details>
<summary><strong>View topics and checklist</strong></summary>

- Resources:

  - [System Design Interview by Alex Xu](./System%20Design/Resources/System%20Design%20Interview%20by%20Alex%20Xu.pdf)

  - [Designing Data Intensive Applications by Martin Kleppmann](./System%20Design/Resources/Designing%20Data%20Intensive%20Applications%20by%20Martin%20Kleppmann.pdf)

- [ ] [**Database design and optimization**](./System%20Design/Database-Design-and-Optimization.md) **`P1`**

  - [ ] [Database normalization forms (1NF, 2NF, 3NF, BCNF)](./System%20Design/Database-Design-and-Optimization.md#4-database-normalization-forms-1nf-2nf-3nf-bcnf) **`P0`**

  - [ ] [Materialized views](./System%20Design/Database-Design-and-Optimization.md#2-materialized-views) **`P1`**

  - [ ] [NoSQL databases (document, key-value, column-family, graph)](./System%20Design/Database-Design-and-Optimization.md#3-nosql-databases-document-key-value-column-family-graph) **`P0`**

  - [ ] [Partitioning](./System%20Design/Database-Design-and-Optimization.md#1-partitioning) **`P0`**

- [ ] [**Design patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md#0-what-is-a-design-pattern) **`P0`**

  - [ ] [**Behavioral patterns**](./System%20Design/Design%20Patterns/Behavioral-Patterns.md) **`P1`**

    - [ ] [Chain of Responsibility](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#1-chain-of-responsibility) **`P1`**

    - [ ] [Command](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#2-command) **`P1`**

    - [ ] [Iterator](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#3-iterator) **`P1`**

    - [ ] [Mediator](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#4-mediator) **`P1`**

    - [ ] [Memento](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#5-memento) **`P1`**

    - [ ] [Observer](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#6-observer) **`P0`**

    - [ ] [State](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#7-state) **`P1`**

    - [ ] [Strategy](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#8-strategy) **`P0`**

    - [ ] [Template Method](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#9-template-method) **`P1`**

    - [ ] [Visitor](./System%20Design/Design%20Patterns/Behavioral-Patterns.md#10-visitor) **`P1`**

  - [ ] [**Creational patterns**](./System%20Design/Design%20Patterns/Creational-Patterns.md) **`P1`**

    - [ ] [Abstract Factory](./System%20Design/Design%20Patterns/Creational-Patterns.md#3-abstract-factory) **`P0`**

    - [ ] [Builder](./System%20Design/Design%20Patterns/Creational-Patterns.md#4-builder) **`P1`**

    - [ ] [Factory Method](./System%20Design/Design%20Patterns/Creational-Patterns.md#2-factory-method) **`P0`**

    - [ ] [Prototype](./System%20Design/Design%20Patterns/Creational-Patterns.md#5-prototype) **`P1`**

    - [ ] [Singleton](./System%20Design/Design%20Patterns/Creational-Patterns.md#1-singleton) **`P1`**

  - [ ] [**Structural patterns**](./System%20Design/Design%20Patterns/Structural-Patterns.md) **`P1`**

    - [ ] [Adapter](./System%20Design/Design%20Patterns/Structural-Patterns.md#1-adapter) **`P1`**

    - [ ] [Bridge](./System%20Design/Design%20Patterns/Structural-Patterns.md#2-bridge) **`P1`**

    - [ ] [Composite](./System%20Design/Design%20Patterns/Structural-Patterns.md#3-composite) **`P1`**

    - [ ] [Decorator](./System%20Design/Design%20Patterns/Structural-Patterns.md#4-decorator) **`P1`**

    - [ ] [Facade](./System%20Design/Design%20Patterns/Structural-Patterns.md#5-facade) **`P1`**

    - [ ] [Flyweight](./System%20Design/Design%20Patterns/Structural-Patterns.md#6-flyweight) **`P1`**

    - [ ] [Proxy](./System%20Design/Design%20Patterns/Structural-Patterns.md#7-proxy) **`P1`**

- [ ] [**Distributed systems**](./System%20Design/Distributed-Systems.md) **`P1`**

  - [ ] [ACID vs. BASE](./System%20Design/Distributed-Systems.md#1-acid-vs-base) **`P0`**

  - [ ] [Distributed tracing](./System%20Design/Distributed-Systems.md#4-distributed-tracing) **`P0`**

  - [ ] [Eventual consistency](./System%20Design/Distributed-Systems.md#2-eventual-consistency) **`P1`**

  - [ ] [Fault tolerance and resilience](./System%20Design/Distributed-Systems.md#5-fault-tolerance-and-resilience) **`P0`**

  - [ ] [Leader election algorithms (Paxos, Raft)](./System%20Design/Distributed-Systems.md#3-leader-election-algorithms-paxos-raft) **`P1`**

- [ ] [**Microservices architecture**](./System%20Design/Microservices-Explained.md) **`P0`** · [Reference & 76 Q&A](./System%20Design/Microservices.md)

  - [ ] [API gateway](./System%20Design/Microservices-Explained.md#2-api-gateway) **`P0`**

  - [ ] [Caching strategies](./System%20Design/Caching-Strategies.md) **`P1`**

    - [ ] [Cache aside](./System%20Design/Caching-Strategies.md#1-cache-aside) **`P0`**

    - [ ] [Cache stampede prevention](./System%20Design/Caching-Strategies.md#4-cache-stampede-prevention) **`P0`**

    - [ ] [Write-behind caching](./System%20Design/Caching-Strategies.md#3-write-behind-caching) **`P1`**

    - [ ] [Write-through caching](./System%20Design/Caching-Strategies.md#2-write-through-caching) **`P1`**

  - [ ] [Choreography vs. Orchestration](./System%20Design/Microservices-Explained.md#1-choreography-vs-orchestration) **`P0`**

  - [ ] [Circuit Breaker pattern](./System%20Design/Microservices-Explained.md#3-circuit-breaker-pattern) **`P0`**

  - [ ] [Load balancing](./System%20Design/Microservices-Explained.md#5-load-balancing) **`P0`**

    - [ ] [Adaptive load balancing algorithms](./System%20Design/Microservices-Explained.md#54-adaptive-load-balancing-algorithms) **`P0`**

    - [ ] [Anycast routing](./System%20Design/Microservices-Explained.md#53-anycast-routing) **`P1`**

    - [ ] [Content Delivery Networks (CDNs)](./System%20Design/Microservices-Explained.md#52-content-delivery-networks-cdns) **`P0`**

    - [ ] [DNS load balancing](./System%20Design/Microservices-Explained.md#51-dns-load-balancing) **`P0`**

  - [ ] [Saga pattern](./System%20Design/Microservices-Explained.md#4-saga-pattern) **`P1`**

- [ ] [**Object-oriented design principles**](./System%20Design/OOD-Principles.md) **`P0`**

  - [ ] [DRY (Don't Repeat Yourself)](./System%20Design/OOD-Principles.md#1-dry-dont-repeat-yourself) **`P1`**

  - [ ] [KISS (Keep It Simple, Stupid)](./System%20Design/OOD-Principles.md#2-kiss-keep-it-simple-stupid) **`P1`**

  - [ ] [Law of Demeter (Principle of Least Knowledge)](./System%20Design/OOD-Principles.md#4-law-of-demeter-principle-of-least-knowledge) **`P1`**

  - [ ] [Open/Closed Principle](./System%20Design/OOD-Principles.md#52-openclosed-principle-ocp) **`P1`**

  - [ ] [SOLID principles](./System%20Design/OOD-Principles.md#5-solid-principles) **`P0`**

    - [ ] [Dependency Inversion Principle (DIP)](./System%20Design/OOD-Principles.md#55-dependency-inversion-principle-dip) **`P1`**

    - [ ] [Interface Segregation Principle (ISP)](./System%20Design/OOD-Principles.md#54-interface-segregation-principle-isp) **`P0`**

    - [ ] [Liskov Substitution Principle (LSP)](./System%20Design/OOD-Principles.md#53-liskov-substitution-principle-lsp) **`P1`**

    - [ ] [Open/Closed Principle (OCP)](./System%20Design/OOD-Principles.md#52-openclosed-principle-ocp) **`P1`**

    - [ ] [Single Responsibility Principle (SRP)](./System%20Design/OOD-Principles.md#51-single-responsibility-principle-srp) **`P1`**

  - [ ] [YAGNI (You Aren't Gonna Need It)](./System%20Design/OOD-Principles.md#3-yagni-you-arent-gonna-need-it) **`P1`**

- [ ] [**Scalability**](./System%20Design/Scalability.md) **`P0`**

  - [ ] [Auto-scaling](./System%20Design/Scalability.md#3-auto-scaling) **`P1`**

  - [ ] [Consistent Hashing](./System%20Design/Scalability.md#2-consistent-hashing) **`P0`**

  - [ ] [Replication vs. Partitioning](./System%20Design/Scalability.md#1-replication-vs-partitioning) **`P0`**

</details>


### 14. Testing, Reliability & Observability

![Testing, Reliability & Observability progress](assets/progress/domain-14.svg?v=ec9ca1a725)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Backend and Distributed-System Testing**](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md) **`P1`**

  - [ ] [API contract tests, schema compatibility, and consumer-driven contracts](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#1-api-contract-tests-schema-compatibility-and-consumer-driven-contracts) **`P0`**

  - [ ] [Concurrency tests, race conditions, and fault injection](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#2-concurrency-tests-race-conditions-and-fault-injection) **`P0`**

  - [ ] [Database integration tests, transactions, and migration tests](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#3-database-integration-tests-transactions-and-migration-tests) **`P0`**

  - [ ] [Idempotency tests and at-least-once delivery failure cases](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#4-idempotency-tests-and-at-least-once-delivery-failure-cases) **`P0`**

  - [ ] [Message queue/event handler tests: ordering, duplication, retry, DLQ](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#5-message-queueevent-handler-tests-ordering-duplication-retry-dlq) **`P0`**

  - [ ] [Property-based tests, fuzz testing, and boundary-value analysis](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#6-property-based-tests-fuzz-testing-and-boundary-value-analysis) **`P1`**

  - [ ] [Testcontainers, ephemeral environments, and service virtualization](./Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#7-testcontainers-ephemeral-environments-and-service-virtualization) **`P1`**

- [ ] [**LLM and Agent Evaluation & Reliability**](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md) **`P0`**

  - [ ] [Agent failure recovery, human handoff, and safety regression tests](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#1-agent-failure-recovery-human-handoff-and-safety-regression-tests) **`P0`**

  - [ ] [Cost, token usage, latency, and failure-budget dashboards](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#2-cost-token-usage-latency-and-failure-budget-dashboards) **`P0`**

  - [ ] [Golden datasets, regression suites, and offline/online evaluation](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#3-golden-datasets-regression-suites-and-offlineonline-evaluation) **`P0`**

  - [ ] [Hallucination, grounding, task-success, and retrieval metrics](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#4-hallucination-grounding-task-success-and-retrieval-metrics) **`P0`**

  - [ ] [Judge-model calibration, human review, and inter-rater agreement](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#5-judge-model-calibration-human-review-and-inter-rater-agreement) **`P1`**

  - [ ] [Tool-call tracing, execution-step replay, and state checkpoint tests](./Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#6-tool-call-tracing-execution-step-replay-and-state-checkpoint-tests) **`P0`**

- [ ] [**Logging, Metrics, and Tracing**](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md) **`P0`**

  - [ ] [Alert quality: actionable alerts, thresholds, burn-rate alerts](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#1-alert-quality-actionable-alerts-thresholds-burn-rate-alerts) **`P1`**

  - [ ] [Distributed tracing, spans, context propagation, and sampling](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#2-distributed-tracing-spans-context-propagation-and-sampling) **`P0`**

  - [ ] [Logs/metrics/traces correlation for root-cause analysis](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#3-logsmetricstraces-correlation-for-root-cause-analysis) **`P0`**

  - [ ] [Metrics cardinality, aggregation, dashboards, and retention](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#4-metrics-cardinality-aggregation-dashboards-and-retention) **`P0`**

  - [ ] [OpenTelemetry instrumentation and collectors](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#5-opentelemetry-instrumentation-and-collectors) **`P1`**

  - [ ] [RED (rate, errors, duration) and USE (utilization, saturation, errors)](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#6-red-rate-errors-duration-and-use-utilization-saturation-errors) **`P1`**

  - [ ] [Structured logging, severity levels, and correlation IDs](./Testing%2C%20Reliability%20%26%20Observability/Logging-Metrics-and-Tracing.md#7-structured-logging-severity-levels-and-correlation-ids) **`P0`**

- [ ] [**Performance and Scalability Testing**](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md) **`P0`**

  - [ ] [Capacity baselines and regression performance testing](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#1-capacity-baselines-and-regression-performance-testing) **`P1`**

  - [ ] [Load vs. stress vs. spike vs. soak testing](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#2-load-vs-stress-vs-spike-vs-soak-testing) **`P1`**

  - [ ] [Profiling CPU, memory, I/O, and database queries](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#3-profiling-cpu-memory-io-and-database-queries) **`P1`**

  - [ ] [Throughput, latency distributions (p50/p95/p99), and error rates](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#4-throughput-latency-distributions-p50p95p99-and-error-rates) **`P0`**

  - [ ] [Workload modeling, realistic traffic, and bottleneck diagnosis](./Testing%2C%20Reliability%20%26%20Observability/Performance-and-Scalability-Testing.md#5-workload-modeling-realistic-traffic-and-bottleneck-diagnosis) **`P1`**

- [ ] [**Production Incidents and Operational Excellence**](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md) **`P1`**

  - [ ] [Blameless postmortems with contributing factors and follow-ups](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#1-blameless-postmortems-with-contributing-factors-and-follow-ups) **`P1`**

  - [ ] [Change management, feature flags, safe rollouts, and rollback](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#2-change-management-feature-flags-safe-rollouts-and-rollback) **`P1`**

  - [ ] [Incident severity, triage, mitigation, and communication](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#3-incident-severity-triage-mitigation-and-communication) **`P1`**

  - [ ] [On-call handoffs, runbooks, escalation, and ownership](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#4-on-call-handoffs-runbooks-escalation-and-ownership) **`P1`**

  - [ ] [Reliability-related architectural trade-offs](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#5-reliability-related-architectural-trade-offs) **`P1`**

  - [ ] [Root-cause analysis: timelines, hypotheses, and evidence](./Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#6-root-cause-analysis-timelines-hypotheses-and-evidence) **`P1`**

- [ ] [**Reliability Engineering (SRE)**](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md) **`P1`**

  - [ ] [Availability math and the implications of dependency chains](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#1-availability-math-and-the-implications-of-dependency-chains) **`P1`**

  - [ ] [Capacity and saturation monitoring](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#2-capacity-and-saturation-monitoring) **`P1`**

  - [ ] [Chaos engineering and game-day exercises](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#3-chaos-engineering-and-game-day-exercises) **`P1`**

  - [ ] [Disaster recovery drills, backups, and restore verification](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#4-disaster-recovery-drills-backups-and-restore-verification) **`P0`**

  - [ ] [Fault tolerance, redundancy, graceful degradation, and bulkheads](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#5-fault-tolerance-redundancy-graceful-degradation-and-bulkheads) **`P0`**

  - [ ] [Retry policies, exponential backoff, jitter, and circuit breakers](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#6-retry-policies-exponential-backoff-jitter-and-circuit-breakers) **`P0`**

  - [ ] [SLIs, SLOs, SLAs, and error budgets](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#7-slis-slos-slas-and-error-budgets) **`P0`**

  - [ ] [Timeouts, cancellation, rate limiting, and backpressure](./Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#8-timeouts-cancellation-rate-limiting-and-backpressure) **`P1`**

- [ ] [**Software Testing Foundations**](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md) **`P1`**

  - [ ] [Functional vs. non-functional testing](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#1-functional-vs-non-functional-testing) **`P1`**

  - [ ] [Mocks, stubs, fakes, spies, and contract boundaries](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#2-mocks-stubs-fakes-spies-and-contract-boundaries) **`P0`**

  - [ ] [Test coverage metrics and their limitations](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#3-test-coverage-metrics-and-their-limitations) **`P0`**

  - [ ] [Test isolation, deterministic fixtures, and repeatable environments](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#4-test-isolation-deterministic-fixtures-and-repeatable-environments) **`P1`**

  - [ ] [Testing pyramid vs. testing trophy; risk-based test selection](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#5-testing-pyramid-vs-testing-trophy-risk-based-test-selection) **`P1`**

  - [ ] [Unit, integration, end-to-end (E2E), and acceptance tests](./Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md#6-unit-integration-end-to-end-e2e-and-acceptance-tests) **`P1`**

</details>


### 15. Version control System

![Version control System progress](assets/progress/domain-15.svg?v=3e922ba373)

<details>
<summary><strong>View topics and checklist</strong></summary>

- [ ] [**Bitbucket**](./Version%20Control%20Systems/Bitbucket.md) **`P2`**

- [ ] [**Git**](./Version%20Control%20Systems/Git-Explained.md) **`P1`** · [Command reference](./Version%20Control%20Systems/Git.md)

</details>

## Interview Readiness Assessment

Before calling a topic “done,” check whether you can explain and apply it under interview conditions.

- [ ] I can explain the core idea without notes in 1–2 minutes.

- [ ] I can name a realistic use case and when **not** to use it.

- [ ] I can compare alternatives and explain time, memory, cost, or operational trade-offs.

- [ ] I can describe edge cases, failure modes, and mitigations.

- [ ] I can implement it, solve a related problem, or diagram it where applicable.

- [ ] I can handle follow-up questions and communicate uncertainty clearly.

**Simple self-rating:** **0** = unfamiliar · **1** = recognize it · **2** = explain with notes · **3** = explain and apply unaided · **4** = defend the design and trade-offs. Aim for **3+ on P0 topics** rather than superficial coverage of everything.

## Features

- **Structured Learning Path**: Follow a well-organized roadmap covering key domains such as **Data Structures**, **Algorithms**, **System Design**, **Operating Systems**, **Networking**, **Databases**, and more.

- **Checklist-based Approach**: Track your progress systematically with checklist-style items for each topic, ensuring thorough coverage of concepts and practical skills.

- **Recommended Resources**: Access curated lists of recommended resources, including books, online courses, coding platforms, articles, and practice problems to enhance your understanding and skills.

- **Tailored Preparation**: Customize your preparation based on the specific requirements and focus areas of the companies you're interviewing with, maximizing your chances of success.

- **Tips and Recommendations**: Benefit from valuable tips and recommendations for problem-solving, coding practice, behavioral and soft skills development, and adapting to different interview formats.

## How to Use

1\\. **Clone the Repository**: Clone this repository to your local machine using Git.

2\\. **Navigate to Domains**: Explore the `Domains` directory to find checklists for different domains/topics.

3\\. **Check Off Items**: As you study and practice, mark off checklist items to track your progress.

4\\. **Explore Resources**: Browse through the `Resources` directory for recommended resources corresponding to each domain/topic.

5\\. **Customize Your Plan**: Tailor your preparation plan based on your strengths, weaknesses, and the requirements of the companies you're targeting.

6\\. **Community Learning**: Engage with fellow learners, share insights, ask questions, and collaborate on improving the roadmap together.

7\\. **Stay Updated**: Periodically update your progress and revisit topics to reinforce your understanding and skills.

## Contributions

Contributions are welcome! If you have suggestions for improving the roadmap, additional resources to recommend, or want to fix any errors, feel free to open an issue or submit a pull request.

## Disclaimer

This roadmap is intended as a general guideline and may not cover every aspect of SDE interviews. It's essential to supplement my preparation with additional resources and adapt based on individual needs and experiences.

## Credits

This project is inspired by various interview preparation resources and the collective wisdom of the developer community.
