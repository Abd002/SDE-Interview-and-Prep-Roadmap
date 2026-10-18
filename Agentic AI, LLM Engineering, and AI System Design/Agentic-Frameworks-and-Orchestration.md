# Agentic Frameworks and Orchestration — LangChain, LangGraph, LangSmith, and How Agent Runs Are Executed

> **What you'll learn:** how the main agent frameworks compare (**LangGraph, AutoGen, CrewAI, SDK-native**); orchestration patterns (**branching, map-reduce, fan-out/fan-in**); **durable execution** and recovery from mid-run failures; **LangChain** building blocks; **LangGraph** state graphs, reducers, checkpointing, interrupts, retries and human approval; **LangSmith** tracing, datasets and evaluations; **stateless services vs. stateful agent execution**; and **workflow vs. agent orchestration**. Each concept is modelled in a small runnable C++ example, with short Python snippets of the real framework APIs for reference.
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

#### Modern C++ example — the same "research then answer" task as an explicit graph vs. a conversation between agents
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    // LangGraph style: explicit nodes and edges; the developer decides the control flow.
    std::map<std::string, std::function<std::string(std::string&)>> nodes{
        {"research", [](std::string& s) { s += " +facts"; return std::string("write"); }},
        {"write", [](std::string& s) { s += " +draft"; return std::string("review"); }},
        {"review", [](std::string& s) { return s.find("+draft") != std::string::npos ? std::string("END") : std::string("write"); }}};
    std::string state = "question", node = "research";
    std::cout << "graph:";
    while (node != "END") { std::cout << ' ' << node; node = nodes[node](state); }
    std::cout << " -> state: " << state << '\n';

    // AutoGen style: agents take turns in a group chat until someone says TERMINATE.
    std::vector<std::pair<std::string, std::string>> chat{{"user", "Research X and answer"},
        {"researcher", "Here are 3 facts about X."}, {"writer", "Draft answer using the facts."}, {"critic", "Looks good. TERMINATE"}};
    std::cout << "conversation:";
    for (auto& [who, msg] : chat) { std::cout << ' ' << who; if (msg.find("TERMINATE") != std::string::npos) break; }
    std::cout << " -> stop on TERMINATE (turn order chosen by a speaker-selection policy)\n";
}
```

**Output:**
```text
graph: research write review -> state: question +facts +draft
conversation: user researcher writer critic -> stop on TERMINATE (turn order chosen by a speaker-selection policy)
```

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

#### Modern C++ example — route by intent, then map-reduce over a dynamic list of documents with parallel workers
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <future>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

std::string route(const std::string& request) {
    if (request.find("summarize") != std::string::npos) return "map_reduce_summarize";
    if (request.find("refund") != std::string::npos) return "refund_flow";
    return "general_answer";
}

int main() {
    std::string req = "summarize these contracts";
    std::cout << "router -> " << route(req) << '\n';

    std::vector<std::string> docs{"contract-A (12 pages)", "contract-B (30 pages)", "contract-C (8 pages)", "contract-D (21 pages)"};
    std::vector<std::future<std::string>> workers;                                       // fan-out: one Send per document
    for (auto& d : docs) workers.push_back(std::async(std::launch::async, [d] { return "summary(" + d.substr(0, 10) + ")"; }));
    std::vector<std::string> summaries;                                                  // fan-in: wait for all, merge in input order
    for (auto& w : workers) summaries.push_back(w.get());
    std::string combined = std::accumulate(summaries.begin() + 1, summaries.end(), summaries[0], [](std::string a, const std::string& b) { return a + " + " + b; });
    std::cout << "reduce: " << combined << '\n';
    std::cout << "router -> " << route("I want a refund") << ", router -> " << route("hello") << '\n';
}
```

**Output:**
```text
router -> map_reduce_summarize
reduce: summary(contract-A) + summary(contract-B) + summary(contract-C) + summary(contract-D)
router -> refund_flow, router -> general_answer
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

#### Modern C++ example — event-history replay: a crash after a payment doesn't charge twice when the workflow resumes
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>

class DurableRun {
    std::map<std::string, std::string>& history_;              // persisted activity results (survives crashes)
public:
    int executed = 0;
    explicit DurableRun(std::map<std::string, std::string>& h) : history_(h) {}
    std::string activity(const std::string& name, const std::function<std::string()>& fn) {
        if (auto it = history_.find(name); it != history_.end()) { std::cout << "  replay  " << name << " -> " << it->second << '\n'; return it->second; }
        std::string result = fn(); ++executed;
        history_[name] = result;                               // recorded before moving on
        std::cout << "  execute " << name << " -> " << result << '\n';
        return result;
    }
};

void workflow(DurableRun& run, bool crash) {
    auto order = run.activity("validate_order", [] { return "order 1042 valid"; });
    auto charge = run.activity("charge_card", [] { return "charged 1500 EGP (ch_1)"; });
    if (crash) throw std::runtime_error("process killed by deploy");
    run.activity("send_confirmation_email", [] { return "email sent"; });
}

int main() {
    std::map<std::string, std::string> history;
    std::cout << "attempt 1:\n";
    try { DurableRun r(history); workflow(r, true); } catch (const std::exception& e) { std::cout << "  CRASH: " << e.what() << '\n'; }
    std::cout << "attempt 2 (new worker, same history):\n";
    DurableRun r2(history); workflow(r2, false);
    std::cout << "activities actually executed on attempt 2: " << r2.executed << " (card charged once overall)\n";
}
```

**Output:**
```text
attempt 1:
  execute validate_order -> order 1042 valid
  execute charge_card -> charged 1500 EGP (ch_1)
  CRASH: process killed by deploy
attempt 2 (new worker, same history):
  replay  validate_order -> order 1042 valid
  replay  charge_card -> charged 1500 EGP (ch_1)
  execute send_confirmation_email -> email sent
activities actually executed on attempt 2: 1 (card charged once overall)
```

There is still a gap: a crash *during* `charge_card` (after the charge, before the result is recorded) would re-run it — that's why the payment call itself also needs an **idempotency key**.

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

#### Modern C++ example — a provider-agnostic chat-model interface, a tool with a schema, and a retriever, mirroring LangChain's abstractions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct ToolCall { std::string name, args; };
struct AIMessage { std::string content; std::vector<ToolCall> tool_calls; };
struct Tool { std::string name, schema; std::function<std::string(const std::string&)> fn; };

struct ChatModel {                                                   // one interface, many providers
    virtual ~ChatModel() = default;
    virtual AIMessage invoke(const std::string& prompt, const std::vector<Tool>& tools) = 0;
};
struct FakeProviderA : ChatModel {
    AIMessage invoke(const std::string& prompt, const std::vector<Tool>& tools) override {
        if (!tools.empty() && prompt.find("order") != std::string::npos) return {"", {{tools[0].name, R"({"order_id":1042})"}}};
        return {"(provider A) " + prompt, {}};
    }
};
struct Retriever {
    std::vector<std::string> docs;
    std::vector<std::string> invoke(const std::string& q, std::size_t k) const {
        std::vector<std::string> out;
        for (auto& d : docs) if (out.size() < k && d.find(q) != std::string::npos) out.push_back(d);
        return out;
    }
};

int main() {
    std::unique_ptr<ChatModel> model = std::make_unique<FakeProviderA>();
    Tool status{"get_order_status", R"({"type":"object","properties":{"order_id":{"type":"integer"}},"required":["order_id"]})",
                [](const std::string& args) { return "order in " + args + " is shipped"; }};
    auto msg = model->invoke("Where is order 1042?", {status});
    for (auto& tc : msg.tool_calls) std::cout << "tool_call " << tc.name << ' ' << tc.args << " -> " << status.fn(tc.args) << '\n';
    Retriever r{{"refund policy: 14 days", "shipping policy: 2-5 days", "refund to card only"}};
    for (auto& d : r.invoke("refund", 5)) std::cout << "retrieved: " << d << '\n';
}
```

**Output:**
```text
tool_call get_order_status {"order_id":1042} -> order in {"order_id":1042} is shipped
retrieved: refund policy: 14 days
retrieved: refund to card only
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

#### Modern C++ example — a graph runner with per-thread checkpoints, an interrupt that pauses, and a resume that re-runs the node
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <vector>

struct State { int amount = 0; std::string node = "check"; std::optional<std::string> approved = std::nullopt; std::vector<std::string> log = {}; };
struct Interrupt { std::string payload; };

class Graph {
    std::map<std::string, State> checkpoints_;                       // thread_id -> latest state
public:
    std::optional<Interrupt> invoke(const std::string& thread, std::optional<State> input, std::optional<std::string> resume) {
        State s = input ? *input : checkpoints_.at(thread);
        while (s.node != "END") {
            if (s.node == "check") { s.log.push_back("check"); s.node = s.amount > 1000 ? "approve" : "refund"; }
            else if (s.node == "approve") {
                s.log.push_back("approve(start)");                   // re-runs from the start on resume
                if (!resume) { checkpoints_[thread] = s; return Interrupt{"Approve refund of " + std::to_string(s.amount) + " EGP?"}; }
                s.approved = *resume; resume.reset();
                s.node = *s.approved == "yes" ? "refund" : "END";
            } else if (s.node == "refund") { s.log.push_back("refund"); s.node = "END"; }
            checkpoints_[thread] = s;                                // checkpoint after each step
        }
        return std::nullopt;
    }
    const State& state(const std::string& thread) const { return checkpoints_.at(thread); }
};

int main() {
    Graph g;
    if (auto i = g.invoke("t-1", State{1500}, std::nullopt)) std::cout << "__interrupt__: " << i->payload << '\n';
    std::cout << "...hours later, a manager answers 'yes'...\n";
    g.invoke("t-1", std::nullopt, "yes");
    std::cout << "thread t-1 log:"; for (auto& l : g.state("t-1").log) std::cout << ' ' << l; std::cout << '\n';
    g.invoke("t-2", State{300}, std::nullopt);
    std::cout << "thread t-2 log:"; for (auto& l : g.state("t-2").log) std::cout << ' ' << l; std::cout << " (no approval needed)\n";
}
```

**Output:**
```text
__interrupt__: Approve refund of 1500 EGP?
...hours later, a manager answers 'yes'...
thread t-1 log: check approve(start) approve(start) refund
thread t-2 log: check refund (no approval needed)
```

`approve(start)` appears twice: on resume the interrupted node runs again from its beginning — exactly LangGraph's behaviour.

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

#### Modern C++ example — node retries with backoff, fallback routing after repeated failure, and an approve/edit/reject gate
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <stdexcept>
#include <string>

std::string with_retry(const std::string& node, const std::function<std::string(int)>& fn, int max_attempts) {
    double delay = 1.0;
    for (int attempt = 1;; ++attempt) {
        try { return fn(attempt); }
        catch (const std::exception& e) {
            if (attempt == max_attempts) throw;
            std::cout << "  " << node << " attempt " << attempt << " failed (" << e.what() << "), retry in " << delay << "s\n";
            delay *= 2;
        }
    }
}

std::string approval_gate(const std::string& proposed, const std::string& human) {
    if (human == "approve") return "EXECUTE " + proposed;
    if (human.rfind("edit:", 0) == 0) return "EXECUTE " + human.substr(5) + " (edited by human)";
    return "REJECTED -> feedback to model: '" + human.substr(7) + "'";
}

int main() {
    auto flaky = [](int attempt) -> std::string { if (attempt < 3) throw std::runtime_error("503 from provider"); return "classification=refund_request"; };
    std::string label = with_retry("classify", flaky, 3);
    std::cout << "classify -> " << label << '\n';

    auto broken = [](int) -> std::string { throw std::runtime_error("timeout"); };
    try { with_retry("primary_model", broken, 2); }
    catch (const std::exception&) { std::cout << "primary_model exhausted retries -> route to fallback_model -> 'answer from fallback'\n"; }

    std::string call = "issue_refund(order=1042, amount=1500)";
    for (std::string human : {"approve", "edit:issue_refund(order=1042, amount=1000)", "reject:customer already got store credit"})
        std::cout << "human '" << human.substr(0, human.find(':')) << "' -> " << approval_gate(call, human) << '\n';
}
```

**Output:**
```text
  classify attempt 1 failed (503 from provider), retry in 1s
  classify attempt 2 failed (503 from provider), retry in 2s
classify -> classification=refund_request
  primary_model attempt 1 failed (timeout), retry in 1s
primary_model exhausted retries -> route to fallback_model -> 'answer from fallback'
human 'approve' -> EXECUTE issue_refund(order=1042, amount=1500)
human 'edit' -> EXECUTE issue_refund(order=1042, amount=1000) (edited by human)
human 'reject' -> REJECTED -> feedback to model: 'customer already got store credit'
```

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

#### Modern C++ example — a tiny state graph with reducers (append vs. overwrite), conditional routing, and a recursion limit
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct State { std::vector<std::string> messages; std::string route; int tool_calls = 0; };
struct Update { std::vector<std::string> messages = {}; std::string route = {}; int tool_calls = 0; };

void apply(State& s, const Update& u) {                                   // reducers
    s.messages.insert(s.messages.end(), u.messages.begin(), u.messages.end());   // append
    if (!u.route.empty()) s.route = u.route;                                     // overwrite
    s.tool_calls += u.tool_calls;                                                // sum
}

int main() {
    std::map<std::string, std::function<Update(const State&)>> nodes{
        {"model", [](const State& s) { return s.tool_calls < 2 ? Update{{"ai: call search_flights"}, "tools"} : Update{{"ai: final answer"}, "END"}; }},
        {"tools", [](const State& s) { return Update{{"tool: result " + std::to_string(s.tool_calls + 1)}, "model", 1}; }}};
    State s{{"user: cheapest flight Cairo->Dubai?"}, ""};
    std::string node = "model";
    const int recursion_limit = 10;
    for (int step = 1; node != "END"; ++step) {
        if (step > recursion_limit) { std::cout << "GraphRecursionError\n"; break; }
        apply(s, nodes[node](s));
        std::cout << "step " << step << ": " << node << " -> next=" << s.route << '\n';
        node = s.route;                                                           // conditional edge reads state
    }
    std::cout << "messages (" << s.messages.size() << "):"; for (auto& m : s.messages) std::cout << " | " << m; std::cout << '\n';
}
```

**Output:**
```text
step 1: model -> next=tools
step 2: tools -> next=model
step 3: model -> next=tools
step 4: tools -> next=model
step 5: model -> next=END
messages (6): | user: cheapest flight Cairo->Dubai? | ai: call search_flights | tool: result 1 | ai: call search_flights | tool: result 2 | ai: final answer
```

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

#### Modern C++ example — record a nested trace, then evaluate two prompt versions on a small dataset and compare
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Run { std::string name, type; int tokens, latency_ms; int depth; };
struct Example { std::string input, expected_tool; };

std::string agent(const std::string& version, const std::string& input) {         // which tool the agent picks
    if (input.find("refund") != std::string::npos) return version == "v8" ? "billing.refund_status" : "orders.get_status";
    return input.find("track") != std::string::npos ? "orders.get_status" : "docs.search";
}

int main() {
    std::vector<Run> trace{{"support_agent", "chain", 0, 2140, 0}, {"classify", "llm", 412, 380, 1}, {"orders.get_status", "tool", 0, 120, 1},
                           {"answer", "llm", 1630, 1590, 1}};
    int total_tokens = 0;
    for (auto& r : trace) { total_tokens += r.tokens; std::cout << std::string(r.depth * 2, ' ') << r.name << " [" << r.type << "] " << r.latency_ms << "ms" << (r.tokens ? ", " + std::to_string(r.tokens) + " tok" : "") << '\n'; }
    std::cout << "trace total tokens: " << total_tokens << '\n';

    std::vector<Example> dataset{{"where is my refund?", "billing.refund_status"}, {"track order 1042", "orders.get_status"},
                                 {"refund for a broken kettle", "billing.refund_status"}, {"what is the return policy", "docs.search"}};
    for (std::string v : {"v7", "v8"}) {
        int pass = 0;
        for (auto& e : dataset) pass += agent(v, e.input) == e.expected_tool;
        std::cout << "experiment prompt-" << v << ": correct_tool " << pass << "/" << dataset.size() << '\n';
    }
}
```

**Output:**
```text
support_agent [chain] 2140ms
  classify [llm] 380ms, 412 tok
  orders.get_status [tool] 120ms
  answer [llm] 1590ms, 1630 tok
trace total tokens: 2042
experiment prompt-v7: correct_tool 2/4
experiment prompt-v8: correct_tool 4/4
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

#### Modern C++ example — stateless API replicas enqueue runs; any worker resumes a run from the shared store
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <deque>
#include <iostream>
#include <map>
#include <string>

struct RunRecord { std::string thread, status; int step = 0; };
std::map<std::string, RunRecord> db;            // shared state store
std::deque<std::string> queue;                  // run queue

std::string api_create_run(const std::string& replica, const std::string& thread) {     // stateless: no local state kept
    std::string id = "run-" + std::to_string(db.size() + 1);
    db[id] = {thread, "queued", 0};
    queue.push_back(id);
    std::cout << replica << ": POST /threads/" << thread << "/runs -> 202 " << id << '\n';
    return id;
}

void worker(const std::string& name, int max_steps) {
    if (queue.empty()) return;
    auto id = queue.front(); queue.pop_front();
    auto& r = db[id];
    r.status = "running";
    for (int i = 0; i < max_steps && r.step < 3; ++i) ++r.step;                           // checkpoint each step in db
    r.status = r.step < 3 ? "waiting_for_human" : "done";
    std::cout << name << ": " << id << " step=" << r.step << " status=" << r.status << '\n';
}

int main() {
    api_create_run("api-replica-1", "th-a");
    api_create_run("api-replica-2", "th-b");
    worker("worker-1", 2);                                           // pauses at an approval after 2 steps
    worker("worker-2", 5);
    std::cout << "api-replica-3: GET /runs/run-1 -> " << db["run-1"].status << '\n';
    queue.push_back("run-1");                                         // human approved -> re-enqueue
    worker("worker-2", 5);                                           // a different worker resumes it
}
```

**Output:**
```text
api-replica-1: POST /threads/th-a/runs -> 202 run-1
api-replica-2: POST /threads/th-b/runs -> 202 run-2
worker-1: run-1 step=2 status=waiting_for_human
worker-2: run-2 step=3 status=done
api-replica-3: GET /runs/run-1 -> waiting_for_human
worker-2: run-1 step=3 status=done
```

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

#### Modern C++ example — the same invoice task as a fixed workflow and as a model-driven loop with a step budget
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> workflow{"extract_fields", "validate_totals", "match_purchase_order", "post_to_erp"};
    std::cout << "workflow (code decides):";
    for (auto& s : workflow) std::cout << ' ' << s;
    std::cout << " -> always " << workflow.size() << " steps\n";

    // Agent: the (scripted) model picks each next action from what it observes, until it decides to stop.
    std::vector<std::string> model_choices{"extract_fields", "validate_totals", "lookup_vendor_history", "email_vendor_for_missing_po", "finish"};
    const int budget = 6; int used = 0;
    std::cout << "agent (model decides):";
    for (auto& a : model_choices) { if (a == "finish" || used == budget) break; std::cout << ' ' << a; ++used; }
    std::cout << " -> " << used << " steps, adapted to a missing PO (budget " << budget << ")\n";
}
```

**Output:**
```text
workflow (code decides): extract_fields validate_totals match_purchase_order post_to_erp -> always 4 steps
agent (model decides): extract_fields validate_totals lookup_vendor_history email_vendor_for_missing_po -> 4 steps, adapted to a missing PO (budget 6)
```

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
