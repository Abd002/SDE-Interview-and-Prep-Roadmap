# Agentic Frameworks and Orchestration — LangChain, LangGraph, LangSmith, and How Agent Runs Are Executed

> **What you'll learn:** how the main agent frameworks compare (**LangGraph, AutoGen, CrewAI, SDK-native**); orchestration patterns (**branching, map-reduce, fan-out/fan-in**); **durable execution** and recovery from mid-run failures; **LangChain** building blocks; **LangGraph** state graphs, reducers, checkpointing, interrupts, retries and human approval; **LangSmith** tracing, datasets and evaluations; **stateless services vs. stateful agent execution**; and **workflow vs. agent orchestration**. Short Python snippets show the real framework APIs.
>
> **Prerequisites:** [Core agent loop](./Agent%20Fundamentals%20and%20Decision-Making/Core%20agent%20loop%3A%20observe%2C%20decide%2C%20act%2C%20inspect%20results%20and%20stop.md), [Tool Use, Integrations, and Protocols](./Tool-Use-Integrations-and-Protocols.md), [Memory, State, and Context Management](./Memory-State-and-Context-Management.md). Framework APIs move quickly — check the current docs before an interview or a build.

## Table of Contents
1. [Compare LangGraph, AutoGen, CrewAI, and SDK-native agent approaches](#1-compare-langgraph-autogen-crewai-and-sdk-native-agent-approaches)
2. [Conditional branching, map-reduce, parallel fan-out, and fan-in](#2-conditional-branching-map-reduce-parallel-fan-out-and-fan-in)
3. [Durable execution and recovering from mid-workflow failures](#3-durable-execution-and-recovering-from-mid-workflow-failures)
4. [LangChain: models, tools, retrievers, and integrations](#4-langchain-models-tools-retrievers-and-integrations)
5. [LangGraph: checkpointing, persistence, interrupts, and resumability](#5-langgraph-checkpointing-persistence-interrupts-and-resumability)
6. [LangGraph: retries, error recovery, and human approval flows](#6-langgraph-retries-error-recovery-and-human-approval-flows)
7. [LangGraph: state graphs, nodes, edges, routing, and reducers](#7-langgraph-state-graphs-nodes-edges-routing-and-reducers)
8. [LangSmith: traces, datasets, evaluations, and debugging](#8-langsmith-traces-datasets-evaluations-and-debugging)
9. [Stateless service architecture vs. stateful agent execution](#9-stateless-service-architecture-vs-stateful-agent-execution)
10. [Workflow orchestration vs. agent orchestration](#10-workflow-orchestration-vs-agent-orchestration)
11. [Cheat sheet](#cheat-sheet)

Suggested order: **10 → 4 → 7 → 2 → 5 → 6 → 3 → 9 → 8 → 1**.

---

## 1. Compare LangGraph, AutoGen, CrewAI, and SDK-native agent approaches

**In one sentence:** **LangGraph** gives low-level, explicit control as a **stateful graph** with checkpointing and human-in-the-loop; **AutoGen** (Microsoft) models agents as **conversing participants** in multi-agent chats; **CrewAI** offers a high-level **role/task/crew** abstraction (plus event-driven Flows); and **SDK-native** approaches (OpenAI Agents SDK, Claude Agent SDK, Google ADK, or a hand-written loop over a provider API) keep things close to the model provider with minimal abstraction.

### In plain words
- LangGraph: a detailed flowchart you draw yourself.
- AutoGen: a meeting where agents talk until the job's done.
- CrewAI: hiring a team by job title and giving them tasks.
- SDK-native: using the manufacturer's own toolkit — fewer layers, closer to the metal.

### How it works
| | LangGraph | AutoGen | CrewAI | SDK-native / hand-rolled |
|---|---|---|---|---|
| Mental model | state machine / graph | multi-agent conversation | roles, tasks, crews; flows | agent loop + tools (+ handoffs) |
| Control | very explicit | conversational, emergent | high-level, opinionated | full (you write it) or SDK defaults |
| State & persistence | first-class (checkpointers, threads) | conversation state; you add persistence | memory options; flows have state | you build it (or SDK sessions) |
| Human-in-the-loop | interrupts + resume | human proxy agent | human input on tasks | you build it |
| Observability | LangSmith (also OTel) | built-in tracing/OTel | integrations | provider dashboards, OTel |
| Best for | production agents needing control, durability, approvals | research/prototyping of multi-agent dialogs | quick role-based multi-agent apps | simple agents, tight provider integration, minimal deps |

- **Ecosystem notes:** Microsoft has positioned the **Microsoft Agent Framework** as the successor that unifies AutoGen and Semantic Kernel; LlamaIndex, Pydantic AI, Haystack, Mastra (TypeScript) and Temporal-based agents are other options.
- **How to choose:** the simplest thing that meets requirements. Many production systems are a **hand-written loop or a small graph**; pick a framework for durable state, HITL, tracing and team familiarity — not for the demo.

### Interview answer
"LangGraph is a low-level orchestration library where you model the agent as a stateful graph — nodes, edges, conditional routing — with first-class checkpointing, interrupts for human approval and LangSmith tracing, so it suits production agents that need control and durability. AutoGen models multi-agent conversations, good for exploring collaborative dialogues; Microsoft now steers new work toward its Agent Framework. CrewAI is higher-level and role-based, fast to build with but more opinionated. SDK-native approaches — the OpenAI Agents SDK, Claude Agent SDK, Google ADK or a hand-written loop — have the fewest layers. I'd start with the simplest option and adopt a framework when I need its persistence, human-in-the-loop and observability."

---

## 2. Conditional branching, map-reduce, parallel fan-out, and fan-in

**In one sentence:** orchestration graphs combine a few patterns: **conditional branching** (route to different nodes based on state), **parallel fan-out** (run several independent nodes at once), **fan-in** (wait for all branches, then merge with a reducer), and **map-reduce** (fan out one task per item of a *dynamic* list, then reduce the results).

### In plain words
A restaurant ticket: "if it's a dessert order, send it to the pastry chef" (branching); starter, main and drinks prepared at the same time (fan-out); the waiter waits until all are ready before serving (fan-in); and for a party of 12, one ticket per guest, then everything goes out together (map-reduce).

### How it works
- **Branching:** a router function reads the state and returns the next node name (`add_conditional_edges` in LangGraph).
- **Static fan-out:** several edges from one node → those nodes run in the same "super-step"; a node with multiple incoming edges runs after they all complete (fan-in).
- **Dynamic map-reduce:** return a list of `Send("worker", {...item...})` objects to spawn one worker per item; results merge into a list via a **reducer** (`operator.add`).
- **Concerns:** concurrency limits, partial failures (retry the failed branch only), deterministic merge order, cost of N parallel model calls.

```python
# LangGraph reference (Python)
from langgraph.types import Send
def fan_out(state):                       # conditional edge returning Sends = map step
    return [Send("summarize_doc", {"doc": d}) for d in state["docs"]]
builder.add_conditional_edges("split", fan_out, ["summarize_doc"])
builder.add_edge("summarize_doc", "combine")   # reduce step runs after all workers finish
```

### Interview answer
"Graphs are built from a few patterns. Conditional branching uses a router that reads state and picks the next node. Static fan-out runs independent nodes in parallel and fan-in waits for all of them, merging their outputs with a reducer. Map-reduce handles a dynamic list — in LangGraph by returning Send objects that spawn one worker per item, then a reduce node combines them. In practice I cap concurrency, make merges deterministic, retry only failed branches, and watch the cost of fanning out many model calls."

---

## 3. Durable execution and recovering from mid-workflow failures

**In one sentence:** **durable execution** means a long-running workflow's progress is **persisted step by step** so that if a process crashes, is redeployed, or waits days for a human, it **resumes from where it stopped** without redoing completed work — achieved with checkpoints (LangGraph) or event-history replay (Temporal, Restate, DBOS, AWS Step Functions), plus **idempotent** side effects.

### In plain words
Writing a long report with autosave: if the laptop dies, you reopen it and continue from the last saved paragraph, and you don't accidentally email the report twice.

### How it works
- **Checkpoint-based (LangGraph):** state saved after each super-step under a thread ID; on resume, completed nodes aren't re-run; a node that failed mid-way re-runs from its start (so nodes should be idempotent, side effects at node boundaries). LangGraph's durability modes control when checkpoints are written (e.g. `"exit"`, `"async"`, `"sync"`).
- **Event-sourced (Temporal-style):** workflow code is deterministic; every activity (model call, tool call) result is recorded; after a crash the workflow **replays** its history, skipping recorded activities.
- **Design rules:** wrap non-determinism (model calls, time, random) as recorded steps/activities; side effects with **idempotency keys**; timeouts and retry policies per step; **compensations** (sagas) for multi-step side effects that must be undone ([sagas](../System%20Design/Microservices-Explained.md#4-saga-pattern)).
- **Recovery playbook:** detect stuck runs (heartbeats, "no progress for N minutes"), resume or retry from the last checkpoint, route poison runs to a dead-letter queue for humans ([DLQs](./Production-Reliability-and-Observability.md#2-circuit-breakers-dead-letter-queues-and-recovery-workflows)).

### Interview answer
"Durable execution persists a workflow's progress so crashes, deploys or long human waits don't lose work. In LangGraph that's checkpointing after each super-step under a thread ID; in Temporal-style engines, deterministic workflow code with recorded activity results that are replayed after a crash. The rules are the same: put non-deterministic work like model and tool calls in recorded steps, make side effects idempotent with keys because a step can still be re-executed if it crashes mid-way, set per-step timeouts and retries, use compensations for multi-step side effects, and detect stuck runs to resume them or send them to a dead-letter queue."

---

## 4. LangChain: models, tools, retrievers, and integrations

**In one sentence:** **LangChain** is a library of **standard interfaces and integrations** for LLM apps: **chat models** (one API across providers), **tools** (functions with schemas the model can call), **retrievers/vector stores** (for RAG), document loaders and text splitters, output parsers/structured output, and hundreds of provider **integrations** — with LangGraph as its lower-level orchestration layer for agents.

### In plain words
A universal adapter kit: one plug shape for many model providers, ready-made connectors for databases and document sources, and a standard way to describe tools.

### How it works
| Building block | What it gives you |
|---|---|
| **Chat models** | `init_chat_model("provider:model")`, `.invoke / .stream / .batch`, `.bind_tools(...)`, `.with_structured_output(Schema)` |
| **Messages** | `SystemMessage`, `HumanMessage`, `AIMessage` (with `tool_calls`), `ToolMessage` |
| **Tools** | `@tool` decorator turns a typed function + docstring into a schema |
| **Retrievers** | `vectorstore.as_retriever(search_kwargs={"k": 5})`, BM25/ensemble retrievers, rerankers |
| **Loaders / splitters** | PDFs, web, Notion, S3…; `RecursiveCharacterTextSplitter` |
| **Agents** | `create_agent(model, tools, ...)` builds a tool-calling agent on top of LangGraph (older `AgentExecutor` is legacy) |
| **Runnables (LCEL)** | composable `prompt | model | parser` pipelines |

```python
# LangChain reference (Python)
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool

@tool
def get_order_status(order_id: int) -> str:
    """Return the shipping status for a numeric order id."""
    return db.status(order_id)

model = init_chat_model("anthropic:<model-id>", temperature=0)
ai_msg = model.bind_tools([get_order_status]).invoke("Where is order 1042?")
print(ai_msg.tool_calls)   # [{'name': 'get_order_status', 'args': {'order_id': 1042}, 'id': '...'}]
```

### Interview answer
"LangChain provides standard interfaces and integrations: chat models with a common invoke, stream, batch, tool-binding and structured-output API across providers; message types including tool calls and tool results; tools created from typed functions with docstrings; retrievers and vector stores for RAG with loaders and text splitters; and a large integration catalogue. Its agent helpers are built on LangGraph, which handles orchestration and state. I value it for avoiding provider lock-in and for integrations, while keeping custom logic in plain code where abstractions don't help."

---

## 5. LangGraph: checkpointing, persistence, interrupts, and resumability

**In one sentence:** compiling a LangGraph with a **checkpointer** saves the graph state after every super-step under a `thread_id`, which gives you **conversation memory, fault tolerance, time travel and human-in-the-loop**: a node can call **`interrupt()`** to pause the run and return a payload to the caller, and you **resume** later with `Command(resume=value)` on the same thread.

### In plain words
Pausing a game to ask a friend for advice: the game freezes exactly where you are, you can come back tomorrow, type in the answer, and play continues from that moment.

### How it works
- **Checkpointers:** `InMemorySaver` (dev), `SqliteSaver`, `PostgresSaver`, Redis and others (production). The **store** interface holds cross-thread long-term memory ([persistence choices](./Memory-State-and-Context-Management.md#3-memory-persistence-in-memory-databases-and-durable-checkpoint-stores)).
- **Threads:** `config = {"configurable": {"thread_id": "user-42-session-7"}}`; same thread → continue; new thread → fresh state.
- **Inspection & time travel:** `graph.get_state(config)`, `graph.get_state_history(config)`; resume or fork from an earlier `checkpoint_id`; `update_state` to edit.
- **Interrupts:** `interrupt(payload)` inside a node pauses; the caller sees the payload (e.g. under `__interrupt__`); `graph.invoke(Command(resume=answer), config)` resumes — the node **re-runs from its start** and `interrupt()` now returns `answer`, so code before the interrupt should be idempotent.

```python
# LangGraph reference (Python)
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command

def approve_refund(state):
    decision = interrupt({"question": "Approve refund?", "amount": state["amount"]})
    return {"approved": decision == "yes"}

graph = builder.compile(checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "t-1"}}
graph.invoke({"amount": 1500}, cfg)            # pauses at the interrupt
graph.invoke(Command(resume="yes"), cfg)       # resumes the same thread
```

### Interview answer
"Compiling a LangGraph graph with a checkpointer — in-memory for development, Postgres or similar in production — persists state after every super-step under a thread ID. That gives multi-turn memory per thread, recovery after failures, and the ability to inspect history, fork from an earlier checkpoint or edit state. For human-in-the-loop, a node calls interrupt with a payload; the run pauses and returns it, and later we invoke with Command resume on the same thread. The interrupted node re-executes from its start with interrupt returning the human's answer, so anything before the interrupt must be idempotent."

---

## 6. LangGraph: retries, error recovery, and human approval flows

**In one sentence:** LangGraph handles failures at several levels — **retry policies** on nodes for transient errors, **error-handling edges** that route to fallback or repair nodes, the model **self-correcting** from tool errors returned as messages, and **resuming from the last checkpoint** after crashes — and implements **human approval** with interrupts placed before sensitive tool calls (approve, edit, or reject).

### In plain words
If the printer jams, try again a couple of times; if it's out of paper, use the other printer; if you're about to send something important, ask the boss first — and if the office loses power, pick up from the last saved page.

### How it works
- **Node retry policy:** `builder.add_node("call_api", fn, retry_policy=RetryPolicy(max_attempts=3, initial_interval=1.0, backoff_factor=2.0))` — retries on exceptions with backoff (choose which exceptions are retryable).
- **Tool errors as data:** a tool node catches exceptions and returns a `ToolMessage` with the error so the model can fix arguments ([actionable errors](./Prompt-Engineering-and-Structured-Outputs.md#1-functiontool-calling-schema-design-argument-validation-and-error-handling)).
- **Fallback routing:** state holds `error` / `attempts`; a conditional edge sends to `fallback_model`, `ask_user`, or `escalate_to_human` after N failures.
- **Approval flow:** before executing a high-risk tool call, an `interrupt()` shows the proposed call; the human returns `approve`, `edit` (new args) or `reject` (with feedback to the model) — via `Command(resume=...)`; prebuilt HITL middleware wraps this pattern ([approval gates](./Tool-Use-Integrations-and-Protocols.md#2-approval-gates-for-irreversible-or-high-impact-actions)).
- **Crash recovery:** resume the thread from its checkpoint ([durable execution](#3-durable-execution-and-recovering-from-mid-workflow-failures)).

### Interview answer
"I layer error handling. Transient failures get a node-level retry policy with exponential backoff, limited to retryable exceptions. Tool errors are returned to the model as tool messages so it can correct its arguments. The state tracks errors and attempts, so a conditional edge can route to a fallback model, ask the user, or escalate to a human after repeated failures, and crashes are recovered by resuming the thread from its checkpoint. For approvals, an interrupt before a sensitive tool call shows the proposed call, and the human resumes with approve, edited arguments, or a rejection whose reason goes back to the model."

---

## 7. LangGraph: state graphs, nodes, edges, routing, and reducers

**In one sentence:** a LangGraph app is a **`StateGraph`** over a typed **state** schema; **nodes** are functions that read the state and return **partial updates**; **edges** (fixed or **conditional**) choose what runs next; and **reducers** define how updates merge into each state key — e.g. *overwrite* by default, or *append* for message lists (`add_messages`, `operator.add`).

### In plain words
A shared whiteboard (state) that several specialists (nodes) take turns writing on, a set of arrows saying who goes next (edges), and a rule per box on the whiteboard: "replace what's there" or "add to the list" (reducers).

### How it works
```python
# LangGraph reference (Python)
from typing import Annotated, TypedDict
import operator
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]     # reducer: append/merge messages by id
    findings: Annotated[list[str], operator.add] # reducer: concatenate lists (parallel-safe)
    route: str                                   # no reducer: last write wins

def classify(state): return {"route": "search" if "price" in state["messages"][-1].content else "answer"}
builder = StateGraph(State)
builder.add_node("classify", classify); builder.add_node("search", search); builder.add_node("answer", answer)
builder.add_edge(START, "classify")
builder.add_conditional_edges("classify", lambda s: s["route"], {"search": "search", "answer": "answer"})
builder.add_edge("search", "answer"); builder.add_edge("answer", END)
graph = builder.compile()
```

- **Super-steps:** nodes triggered together run in parallel; their updates are merged with reducers — without a reducer, two parallel writes to the same key are an error.
- **Routing:** conditional edges or a node returning `Command(goto="x", update={...})`.
- **Agent loop as a graph:** `model → (tool calls?) → tools → model … → END` — the prebuilt ReAct agent is exactly this ([ReAct](./Agent%20Fundamentals%20and%20Decision-Making/Reasoning-and-acting%20patterns%20%28e.g.%2C%20ReAct%29%20and%20tool-use%20loops.md)).
- Subgraphs compose; `recursion_limit` caps steps ([stop conditions](./Agent%20Fundamentals%20and%20Decision-Making/Stop%20conditions%2C%20turn%20budgets%2C%20iteration%20limits%2C%20and%20fallback%20paths.md)).

### Interview answer
"In LangGraph you define a typed state schema and a StateGraph; nodes are functions that take state and return partial updates, and edges — fixed or conditional — decide what runs next, from START to END. Reducers declare how updates merge into each key: by default last write wins, while message lists use add_messages and accumulating lists use operator.add, which is what makes parallel branches safe. The classic agent is just a loop between a model node and a tools node with a conditional edge on whether there are tool calls, bounded by a recursion limit."

---

## 8. LangSmith: traces, datasets, evaluations, and debugging

**In one sentence:** **LangSmith** is LangChain's observability and evaluation platform: it records **traces** (a tree of runs: chains, model calls with prompts/tokens/latency, tool calls), lets you build **datasets** of examples (often from production traces), run **evaluations** with custom or LLM-as-judge evaluators and compare experiments, and **debug** by inspecting or re-running individual steps — framework-agnostic via SDK decorators or OpenTelemetry.

### In plain words
A black-box flight recorder plus an exam room: you can replay exactly what the agent saw and did on any request, and you keep a set of exam questions to re-test every new version.

### How it works
- **Tracing:** set `LANGSMITH_TRACING=true` and an API key; LangChain/LangGraph trace automatically, other code with `@traceable`. Each trace has nested runs with inputs/outputs, tokens, cost, latency, errors, metadata and tags (user, prompt version).
- **Monitoring:** dashboards for latency, error rate, cost, feedback; online evaluators on sampled production traffic; alerts.
- **Datasets:** examples of `{inputs, reference outputs}`; add from traces, CSVs or by hand; version them.
- **Evaluations:** `evaluate(target_fn, data="dataset", evaluators=[...])` → an **experiment**; compare experiments side by side; pairwise comparisons; annotation queues for human review ([Evaluation and Testing](./Evaluation-and-Testing.md)).
- **Debugging:** open the failing trace, find the step where it went wrong (wrong tool choice? bad retrieval?), open the model call in the **playground**, tweak the prompt, re-run, then add the case to the dataset.
- Alternatives: Langfuse (open source), Arize Phoenix, Braintrust, Weights & Biases Weave, Helicone, OpenTelemetry GenAI conventions ([traces](./Production-Reliability-and-Observability.md#4-end-to-end-distributed-traces-for-prompts-model-calls-and-tools)).

```python
# LangSmith reference (Python)
from langsmith import traceable, Client
@traceable(run_type="tool")
def search_flights(origin: str, dest: str): ...
client = Client()
results = client.evaluate(my_agent, data="support-golden-v3", evaluators=[correct_tool, grounded], experiment_prefix="prompt-v8")
```

### Interview answer
"LangSmith records traces as trees of runs — chains, model calls with full prompts, token counts, cost and latency, and tool calls — automatically for LangChain and LangGraph and via decorators or OpenTelemetry for other code, with metadata like user and prompt version. On top of that it has monitoring dashboards and online evaluators, datasets built from production traces or curated examples, and evaluations that run an agent version over a dataset as an experiment with code or LLM-judge evaluators, so versions can be compared side by side. My debugging loop is: open the failing trace, find the step that went wrong, iterate in the playground, re-run, and add the case to the dataset."

---

## 9. Stateless service architecture vs. stateful agent execution

**In one sentence:** web services scale best as **stateless** replicas (any request can go to any instance), but agent runs are inherently **stateful** (multi-step, long-running, waiting on humans), so the standard design is **stateless API servers + externalized state** (checkpoint store) **+ a worker/queue or workflow engine** that executes long runs, with clients reconnecting by **thread/run ID**.

### In plain words
The front desk (API) is staffed by interchangeable receptionists who don't remember anything themselves; every case has a folder in the filing room (state store), and the long work happens in the back office (workers), who pick up folders from a tray (queue).

### How it works
| | Stateless request/response | Stateful agent execution |
|---|---|---|
| Duration | ms–seconds | seconds–days (approvals, long tools) |
| State | none on the server | messages, plan, tool results, pending approvals |
| Scaling | add replicas behind LB | workers pull runs from a queue; state in DB |
| Failure | retry the request | resume from checkpoint ([durable execution](#3-durable-execution-and-recovering-from-mid-workflow-failures)) |

**Reference architecture:**
1. `POST /threads/{id}/runs` → API validates, persists the input, enqueues a run, returns `run_id` (202 Accepted).
2. A **worker** loads the checkpoint, executes steps, checkpoints each step, emits events.
3. Clients **stream** progress (SSE/WebSocket) or poll `GET /runs/{id}`; on disconnect they reconnect by `run_id` ([streaming](./Production-Reliability-and-Observability.md#11-streaming-responses-cancellation-and-timeout-handling)).
4. Interrupts park the run (`status=waiting_for_human`); a later approval re-enqueues it.
- Keep in-memory state **ephemeral** (caches only); use per-session concurrency control ([multi-replica consistency](./Memory-State-and-Context-Management.md#5-multi-replica-deployments-and-shared-state-consistency)). Managed options: LangGraph Platform/Server, Temporal, AWS Step Functions, cloud agent runtimes.

### Interview answer
"I keep the API tier stateless so it scales horizontally behind a load balancer, and treat agent runs as stateful jobs. Creating a run persists the input, enqueues it and returns a run ID; workers pull runs, load the thread's checkpoint, execute and checkpoint each step, and stream events to clients, who can reconnect by run ID. Runs waiting for a human are parked and re-enqueued on approval, and any worker can resume them because all state lives in the shared store, with per-session concurrency control. That combines stateless scalability with durable, long-running agent execution."

---

## 10. Workflow orchestration vs. agent orchestration

**In one sentence:** in **workflow orchestration** the **developer defines the control flow** in code (fixed steps, branches, loops — LLMs fill in individual steps), while in **agent orchestration** the **model decides the next step** at runtime (which tool, which sub-agent, when to stop); workflows are predictable, cheaper and easier to test, agents are flexible for open-ended tasks — and most production systems **mix** them.

### In plain words
A workflow is a recipe you follow step by step; an agent is a chef who decides what to cook based on what's in the fridge. Recipes are reliable; chefs handle surprises.

### How it works
| | Workflow orchestration | Agent orchestration |
|---|---|---|
| Who chooses the next step | code (graph edges) | the model (tool calls, handoffs) |
| Predictability / testing | high; unit-test each step | lower; needs trajectory tests and evals |
| Cost / latency | bounded | variable (loops) — needs budgets |
| Good for | known processes: extract → validate → route → notify | open-ended research, debugging, multi-tool exploration |
| Tools | Temporal, Airflow, Step Functions, LangGraph with fixed edges | LangGraph agent loops, Agents SDKs, AutoGen/CrewAI |

- **Common hybrid:** a workflow skeleton with **agentic nodes** where flexibility helps (e.g. "investigate" step), surrounded by deterministic validation, approvals and budgets ([deterministic nodes vs. model-selected actions](./Agent%20Fundamentals%20and%20Decision-Making/Deterministic%20workflow%20nodes%20vs.%20model-selected%20actions.md), [workflows vs. agents](./Agent%20Fundamentals%20and%20Decision-Making/LLM%20workflows%20vs.%20autonomous%20agents%3A%20when%20each%20is%20appropriate.md)).

### Interview answer
"In workflow orchestration the control flow is in code — steps, branches and loops are fixed, and the model only fills in individual steps — so it's predictable, cheap, easy to test and audit. In agent orchestration the model chooses the next action at runtime, which handles open-ended tasks and surprises but costs more, varies in latency and needs trajectory evaluations and budgets. I default to workflows for known processes and introduce agentic nodes only where flexibility clearly pays off, wrapped in deterministic validation, approvals and step limits."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Frameworks | LangGraph = explicit stateful graph + checkpoints + HITL; AutoGen = agent conversations (→ MS Agent Framework); CrewAI = roles/tasks/crews; SDK-native = fewest layers |
| Patterns | conditional edges (router) · static fan-out/fan-in · map-reduce with `Send` · reducers for merges |
| Durable execution | checkpoint per super-step or event-history replay; idempotent side effects; compensations; resume stuck runs |
| LangChain | chat models (`init_chat_model`, `bind_tools`, `with_structured_output`), messages, `@tool`, retrievers, loaders, integrations |
| Checkpointing | checkpointer + `thread_id`; get_state/history, fork; `interrupt()` → `Command(resume=…)`; node re-runs on resume |
| Errors & approval | `RetryPolicy`; tool errors as ToolMessages; fallback edges; approve/edit/reject interrupts before risky tools |
| State graphs | typed state; nodes return partial updates; edges/conditional edges; reducers (`add_messages`, `operator.add`); recursion limit |
| LangSmith | traces (runs tree, tokens, latency), monitoring, datasets, experiments/evaluators, playground debugging |
| Stateless vs. stateful | stateless API + checkpoint store + queue/workers; run IDs; stream + reconnect; park/resume for humans |
| Workflow vs. agent | code decides vs. model decides; default to workflows, add agentic nodes where they pay off |
