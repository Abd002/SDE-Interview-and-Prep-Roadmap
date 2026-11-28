# Tool Use, Integrations, and Protocols — Giving Agents Safe, Reliable Hands

> **What you'll learn:** how agents call real systems safely: **authentication, authorization and secrets**; **approval gates** for risky actions; common tool types (**search, databases, code execution, files**); **idempotency, retries, backoff, timeouts and rate limits**; the **Model Context Protocol (MCP)**; **parallel vs. sequential** tool execution; **schemas and contracts**; **audit logs and replay**; **tool registries and tool selection**; and **validating untrusted tool results**. Parts built on a real algorithm include a runnable C++ implementation.
>
> **Prerequisites:** [Prompt Engineering and Structured Outputs](./Prompt-Engineering-and-Structured-Outputs.md) (tool calling basics) and the [core agent loop](./Agent%20Fundamentals%20and%20Decision-Making/Core%20agent%20loop%3A%20observe%2C%20decide%2C%20act%2C%20inspect%20results%20and%20stop.md). Related: [Application and API Security](../Security%20Engineering%20%26%20Authentication/Application-and-API-Security.md).

## Table of Contents
1. [API authentication, authorization, least privilege, and secret handling](#1-api-authentication-authorization-least-privilege-and-secret-handling)
2. [Approval gates for irreversible or high-impact actions](#2-approval-gates-for-irreversible-or-high-impact-actions)
3. [External search, database queries, code execution, and file tools](#3-external-search-database-queries-code-execution-and-file-tools)
4. [Idempotent operations, retries, backoff, timeouts, and rate limits](#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits)
5. [Model Context Protocol (MCP): clients, servers, tools, and resources](#5-model-context-protocol-mcp-clients-servers-tools-and-resources)
6. [Parallel tool execution vs. sequential dependencies](#6-parallel-tool-execution-vs-sequential-dependencies)
7. [Tool argument schemas and input/output contracts](#7-tool-argument-schemas-and-inputoutput-contracts)
8. [Tool call audit logs and replay/debugging](#8-tool-call-audit-logs-and-replaydebugging)
9. [Tool registry/discovery and selecting the right tool for a task](#9-tool-registrydiscovery-and-selecting-the-right-tool-for-a-task)
10. [Tool result validation, sanitization, and handling untrusted content](#10-tool-result-validation-sanitization-and-handling-untrusted-content)
11. [Cheat sheet](#cheat-sheet)

Suggested order: **7 → 3 → 9 → 6 → 4 → 10 → 1 → 2 → 8 → 5**.

---

## 1. API authentication, authorization, least privilege, and secret handling

**In one sentence:** tools act **on behalf of a specific user or service identity** with **scoped, short-lived credentials** that your code (never the model) holds; every call is **authorized** against what *that* user may do, and secrets stay in a **secret manager**, never in prompts, logs or model-visible tool results.

### In plain words
The agent is like a temp worker given a visitor badge that opens only the rooms they need, only for today, and only on behalf of the person they're helping. The worker never sees the master key — the door checks the badge.

### How it works
- **Authentication:** OAuth 2.0 (authorization code + PKCE for user-delegated access; client credentials for service-to-service), API keys for simple integrations, workload identity (cloud IAM roles) instead of static keys ([Authentication and Authorization](../Security%20Engineering%20%26%20Authentication/Authentication-and-Authorization.md)).
- **Authorization:** check **the end user's permissions** at the tool, not just the agent's — the agent must never become a way around access control ("confused deputy").
- **Least privilege:** read-only by default; narrow OAuth scopes (`calendar.readonly`), per-tool credentials, per-tenant tokens, short TTLs ([least-privilege identities](./Security-Privacy-and-Safety.md#3-least-privilege-agent-identities-and-scoped-credentials)).
- **Secret handling:** inject credentials in the tool runtime from a secret manager (AWS Secrets Manager, Vault); **the model never sees tokens**; redact secrets from logs and tool outputs; rotate regularly.

### Interview answer
"Each tool call runs under a specific identity — the end user via OAuth delegation, or a narrowly scoped service identity — and authorization checks the user's own permissions and tenant at the tool layer, so the agent can never be a confused deputy. Credentials are least-privilege, short-lived and per tool, read-only by default, fetched from a secret manager by the tool runtime and never placed in prompts or model-visible output; logs redact them and they're rotated. I prefer workload identity over static API keys where possible."

---

## 2. Approval gates for irreversible or high-impact actions

**In one sentence:** classify tools by **risk** (read, reversible write, irreversible/high-impact), and before risky actions **pause and ask a human to approve the exact action** (who, what, amount, target) — the gate is enforced **in code**, the approval is bound to that specific call, and the decision is logged.

### In plain words
A bank teller can check your balance freely, but a large transfer needs a supervisor's signature on that specific slip — not a general "yes, do whatever".

### How it works
| Risk tier | Examples | Policy |
|---|---|---|
| **Read** | search, get order, list files | auto |
| **Reversible write** | draft email, create ticket, add label | auto or notify; undo available |
| **Irreversible / high impact** | send email to customers, payment/refund, delete data, deploy, merge | **human approval** of the exact arguments |

- The approval request shows a **human-readable diff/preview**, the reason, and the risk; approvers can approve, edit, or reject.
- Bind the approval to a **hash of the action + arguments** and an expiry; any change requires re-approval.
- Use framework **interrupts** to pause durable workflows while waiting ([LangGraph human approval](./Agentic-Frameworks-and-Orchestration.md#6-langgraph-retries-error-recovery-and-human-approval-flows)); thresholds (e.g. refunds > 1,000 EGP) avoid approval fatigue.
- Background: [Human-in-the-loop reviews](./Agent%20Fundamentals%20and%20Decision-Making/Human-in-the-loop%20reviews%2C%20approvals%20and%20escalation.md).

### Interview answer
"I classify tools by risk: reads run automatically, reversible writes run with notification or undo, and irreversible or high-impact actions — payments, deletes, external emails, deploys — pause for human approval. The gate lives in the tool-execution layer, not the prompt. The approver sees a clear preview of the exact action and arguments, and the approval is bound to a hash of that call with an expiry, so the model can't change the amount afterwards. The workflow pauses durably with an interrupt, thresholds keep approval volume reasonable, and every decision is audited."

---

## 3. External search, database queries, code execution, and file tools

**In one sentence:** the most common agent tools are **web/enterprise search** (fresh information), **database queries** (facts from your systems), **code execution** (exact computation, data analysis) and **file tools** (read/write documents) — each powerful and each needing its own guardrails: result limits, **parameterized or read-only queries**, **sandboxes**, and **path restrictions**.

### In plain words
Give the agent a phone book (search), read access to the filing cabinet (database), a calculator in a locked room (code sandbox) and one specific desk drawer (files) — not the whole building.

### How it works
| Tool type | Use for | Guardrails |
|---|---|---|
| **Search** (web, internal, vector) | fresh facts, docs | domain allowlist, top-k limits, return snippets + URLs, treat results as untrusted ([section 10](#10-tool-result-validation-sanitization-and-handling-untrusted-content)) |
| **Database** | orders, users, metrics | prefer **specific tools** (`get_order(id)`) over raw SQL; if text-to-SQL, use a **read-only replica/role**, row limits, timeouts, allowlisted tables, tenant filters added by code |
| **Code execution** | math, data analysis, charts, transformations | isolated sandbox (container/gVisor/Firecracker), no network or allowlisted egress, CPU/memory/time limits ([sandboxing](./Security-Privacy-and-Safety.md#8-sandboxing-code-execution-and-restricting-networkfile-access)) |
| **File tools** | read/write documents, repos | restrict to a workspace root, block `..` and symlinks escapes, size limits, writes need review |

### Interview answer
"Search gives fresh information, database tools give facts from our systems, code execution gives exact computation, and file tools let the agent work with documents — each with guardrails. For search I limit results, allowlist domains and treat content as untrusted. For data I prefer specific typed tools over free SQL; if I allow text-to-SQL it runs on a read-only role against a replica with allowlisted tables, tenant filters injected by code, row limits and timeouts. Code runs in an isolated sandbox without network and with resource limits, and file tools are jailed to a workspace with path normalization and reviewed writes."

---

## 4. Idempotent operations, retries, backoff, timeouts, and rate limits

**In one sentence:** tool calls fail transiently, so wrap them with **timeouts**, **retries with exponential backoff and jitter** for retryable errors only, respect **rate limits** (`429` + `Retry-After`, client-side token buckets), and make side-effecting calls **idempotent** with an **idempotency key** so a retry never charges, emails or books twice.

### In plain words
If the shop's phone line is busy, you wait a bit longer each time before redialling — and when you place an order you quote your order number, so if you accidentally call twice they don't send two parcels.

### How it works
- **Timeouts** on every call (connect + total); a hung tool shouldn't hang the agent.
- **Retry only retryable errors:** timeouts, 429, 502/503/504, connection resets — not 400/401/403/404 or validation errors.
- **Backoff:** `delay = min(cap, base × 2^attempt)` + random **jitter**; cap attempts (e.g. 3–5) and total time.
- **Rate limits:** honour `Retry-After`; client-side token bucket per provider/tenant; queue instead of hammering ([backpressure](./Production-Reliability-and-Observability.md#8-request-queuing-concurrency-limits-and-backpressure)).
- **Idempotency:** generate the key **once per logical action** (e.g. hash of run ID + step + args), send it on every retry; the server stores key → result and returns the stored result for duplicates ([retry storms and idempotency keys](./Production-Reliability-and-Observability.md#9-retry-storms-duplicate-side-effects-and-idempotency-keys)).

#### Modern C++ example — retries with exponential backoff + jitter, retryable-error classification, and an idempotent payment API
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <random>
#include <string>

struct PaymentServer {
    std::map<std::string, std::string> results;              // idempotency key -> stored result
    int calls = 0, charges = 0;
    int respond(const std::string& key, std::string& body) {
        ++calls;
        if (calls == 1) return 503;                           // transient failure before processing
        if (auto it = results.find(key); it != results.end()) { body = it->second + " (replayed)"; return 200; }
        ++charges; body = "charge ch_" + std::to_string(charges);
        results[key] = body;
        if (calls == 2) return 504;                           // processed, but the response timed out!
        return 200;
    }
};

bool retryable(int status) { return status == 429 || status == 502 || status == 503 || status == 504; }

int main() {
    PaymentServer server;
    std::mt19937 rng(42);
    const std::string key = "run-7:step-3:refund-1042";       // same key on every retry of this logical action
    std::string body;
    for (int attempt = 0; attempt < 5; ++attempt) {
        int status = server.respond(key, body);
        if (status == 200) { std::cout << "attempt " << attempt + 1 << ": 200 " << body << '\n'; break; }
        if (!retryable(status)) { std::cout << "attempt " << attempt + 1 << ": " << status << " not retryable, stop\n"; break; }
        int backoff = std::min(8000, 500 << attempt);
        int jitter = std::uniform_int_distribution<int>(0, backoff / 2)(rng);
        std::cout << "attempt " << attempt + 1 << ": " << status << " -> retry in " << backoff << "ms + " << jitter << "ms jitter\n";
    }
    std::cout << "server calls " << server.calls << ", customer charged " << server.charges << " time(s)\n";
}
```

**Output:**
```text
attempt 1: 503 -> retry in 500ms + 94ms jitter
attempt 2: 504 -> retry in 1000ms + 399ms jitter
attempt 3: 200 charge ch_1 (replayed)
server calls 3, customer charged 1 time(s)
```

Without the idempotency key, attempt 3 would have created a **second charge** — the second response timed out *after* the charge happened.

### Interview answer
"Every tool call gets a timeout, and only retryable failures — timeouts, 429s and 5xx gateway errors — are retried, with exponential backoff, jitter and a cap on attempts and total time, honouring Retry-After and client-side rate limits. The dangerous case is a write that succeeded but whose response was lost, so side-effecting calls carry an idempotency key derived once per logical action; the server stores key to result and replays it on duplicates, so retries never double-charge or double-send. Non-retryable errors go back to the model or a human instead of being retried."

---

## 5. Model Context Protocol (MCP): clients, servers, tools, and resources

**In one sentence:** **MCP** is an open protocol (introduced by Anthropic, now widely adopted) that standardizes how AI applications connect to external capabilities: an **MCP host/client** (the AI app) talks **JSON-RPC 2.0** to **MCP servers** that expose **tools** (actions), **resources** (readable data by URI) and **prompts** (templates) — so one integration works across many AI apps.

### In plain words
USB-C for AI tools: instead of every app building a custom connector for GitHub, Slack and your database, each service ships one MCP server and any MCP-capable app can plug in.

### How it works
- **Roles:** the **host** (e.g. an IDE, chat app or agent) runs one **client** per **server** connection.
- **Transports:** **stdio** (local server as a subprocess) and **Streamable HTTP** (remote servers, with OAuth-based authorization).
- **Lifecycle:** `initialize` (exchange protocol version and capabilities) → `tools/list`, `resources/list`, `prompts/list` → `tools/call`, `resources/read` → notifications (e.g. `notifications/tools/list_changed`).
- **Primitives:**
  - **Tools** — model-invoked functions with JSON Schema inputs (`inputSchema`) and results as content blocks.
  - **Resources** — application-controlled data addressed by URI (`file:///…`, `postgres://…`).
  - **Prompts** — user-selected templates.
  - Client-side features servers can request: **sampling** (ask the host's model), **elicitation** (ask the user), **roots**.
- **Security:** MCP servers are code with access to your systems — install only trusted ones, scope their credentials, review tool descriptions (they can carry injected instructions: "tool poisoning"), and keep approvals for risky tools.

### Interview answer
"MCP is an open protocol that standardizes connecting AI applications to tools and data. A host application runs MCP clients, each connected to a server over stdio locally or Streamable HTTP remotely, speaking JSON-RPC 2.0. After an initialize handshake exchanging versions and capabilities, the client lists and calls tools — functions with JSON Schema inputs — reads resources addressed by URI, and uses prompt templates; servers can also request sampling or elicitation from the host. The value is write-once integrations across many AI apps. The risk is that servers are code with access to your systems and their tool descriptions reach the model, so I only use trusted servers, scope their credentials and keep approval gates."

---

## 6. Parallel tool execution vs. sequential dependencies

**In one sentence:** run tool calls **in parallel** when they are **independent** (fetch weather *and* flights *and* hotels) to cut latency from the **sum** to the **max** of their durations, but run them **sequentially** when one needs another's output (look up a user ID, *then* fetch their orders) — modelling the calls as a **dependency graph** and running each "level" concurrently.

### In plain words
Making breakfast: you can boil the kettle and toast bread at the same time, but you can't pour the tea before the water boils.

### How it works
- Models can return **multiple tool calls in one turn** (parallel tool calls); your executor runs them concurrently and returns all results together.
- **Dependencies:** build a DAG (`orders` depends on `user_id`), topologically sort into levels, run each level in parallel ([planning and dependency graphs](./Agent%20Fundamentals%20and%20Decision-Making/Planning%3A%20task%20breakdown%2C%20dependency%20graphs%20and%20replanning.md)).
- **Limits:** cap concurrency per tool/provider (rate limits), set per-call timeouts, decide what partial failure means (proceed with available results or fail the step).
- **Avoid parallel side effects** that conflict (two writes to the same record) — serialize writes or use locks/versions.
- Return results **in a deterministic order** (by call ID) so behaviour is reproducible.

### Interview answer
"Independent tool calls should run in parallel so latency is the maximum rather than the sum, and models can emit several calls in one turn for exactly this. Calls that need another call's output must wait, so I model them as a dependency graph and execute it level by level, each level concurrently. I cap concurrency per provider for rate limits, give each call a timeout, define the partial-failure policy, serialize conflicting writes, and return results in a deterministic order so runs are reproducible and debuggable."

---

## 7. Tool argument schemas and input/output contracts

**In one sentence:** each tool has a **contract** — a versioned **input schema** (types, required fields, enums, formats, ranges), a predictable **output schema** (including a structured **error** shape), documented **side effects**, and limits — so both the model and your code know exactly what goes in and comes out, and changes are **backward compatible**.

### In plain words
Like a vending machine: it accepts specific coins (inputs), always drops the snack into the same tray (output), shows a clear message if it's out of stock (error) — and the manufacturer doesn't suddenly change which coins it accepts.

### How it works
- **Inputs:** JSON Schema with descriptions on every field, `enum`s, `format` (date, email, uri), `minimum/maximum`, `additionalProperties: false`; IDs over free text ([schema design](./Prompt-Engineering-and-Structured-Outputs.md#1-functiontool-calling-schema-design-argument-validation-and-error-handling)).
- **Outputs:** consistent envelope, e.g. `{ok, data, error:{code, message, retryable}}`; keep outputs **compact** (they consume context) with pagination/truncation flags.
- **Side effects and limits:** document whether it writes, its idempotency, rate limits, timeouts.
- **Versioning:** additive changes (new optional field) are safe; renames/removals/type changes are breaking → new tool version (`search_v2`) and migrate prompts/evals.
- **Contract tests** check every tool against its schema in CI ([unit testing tools](./Evaluation-and-Testing.md#12-unit-testing-tools-nodes-validators-and-deterministic-logic)).

### Interview answer
"I treat each tool like a public API with a contract: an input JSON Schema with described fields, enums, formats and ranges and no extra properties; a consistent output envelope with data, a structured error with code, message and a retryable flag, and truncation or pagination markers to keep results compact; plus documented side effects, idempotency and limits. Contracts are versioned — additive optional fields are fine, while renames, removals, type changes or new required fields mean a new version — and contract tests in CI check tools against their schemas so prompts and evaluations don't silently break."

---

## 8. Tool call audit logs and replay/debugging

**In one sentence:** record every tool call as a **structured, append-only audit event** — run/trace ID, step, user and tenant, tool + version, (redacted) arguments, result summary, status, latency, approver — so you can answer **"who did what, when, and why"**, and **replay** a run deterministically by feeding recorded tool results back instead of calling live systems.

### In plain words
A flight recorder for your agent: if something goes wrong you can see every button it pressed, and replay the flight in a simulator without risking a real plane.

### How it works
- **Audit log (compliance, security):** immutable/append-only storage, retention policy, PII and secrets **redacted**, includes approvals and denials ([audit trails](./Security-Privacy-and-Safety.md#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails)).
- **Traces (debugging, performance):** spans per model call and tool call, linked by trace ID ([distributed traces](./Production-Reliability-and-Observability.md#4-end-to-end-distributed-traces-for-prompts-model-calls-and-tools)).
- **Replay:** run the agent with a **recording tool layer**; in replay mode, return recorded results keyed by (step, tool, args hash) — and pin model version, prompts and temperature. Great for reproducing bugs and building regression tests from production incidents.
- **Debugging flow:** find the run → inspect the step where it diverged → check what the model saw (prompt, tool results) → fix → replay to confirm → add to the eval set ([trace and debug tool selection](./Hands-On-Interview-Readiness.md#10-trace-and-debug-an-incorrect-tool-selection-decision)).

### Interview answer
"Every tool call emits a structured, append-only audit event with run and trace IDs, step, user and tenant, tool and version, redacted arguments, a result summary, status, latency and any approval — so we can answer who did what and why, and satisfy compliance. Traces link model and tool spans for debugging. I also wrap tools in a recording layer: in replay mode the agent receives recorded results keyed by tool and arguments, with pinned model and prompt versions, so I can reproduce a production failure without side effects, test the fix, and turn the case into a regression test."

---

## 9. Tool registry/discovery and selecting the right tool for a task

**In one sentence:** a **tool registry** catalogues available tools (name, description, schema, owner, version, risk, permissions), and because models choose tools from their **names and descriptions**, you improve selection by writing **distinct, specific descriptions**, exposing **only relevant tools** per task (filtering or **retrieving tools** by semantic similarity when there are many), and evaluating tool choice explicitly.

### In plain words
A toolbox with 200 tools makes it hard to grab the right screwdriver. Label each one clearly, and for each job hand over only the five tools that job needs.

### How it works
- **Registry entries:** name, description ("use when…", "don't use when…"), input/output schemas, version, owner team, risk tier, required permissions, cost/latency.
- **Discovery:** static config, MCP `tools/list` from connected servers, or a registry service; filter by the user's permissions and the agent's role.
- **Selection quality** drops with many similar tools → **merge overlapping tools**, namespace them (`crm.search`, `docs.search`), and **retrieve top-k tools** for the current request (embedding search over descriptions) when the catalogue is large.
- **Routing:** a classifier or simple rules can pick a tool group (billing vs. shipping) before the model chooses within it.
- **Evaluate** tool-selection accuracy on a labelled set and in trajectory tests ([trajectory tests](./Evaluation-and-Testing.md#1-agent-trajectory-tests-tool-selection-ordering-and-stop-behavior)).

### Interview answer
"I keep a registry with each tool's name, description including when and when not to use it, schemas, version, owner, risk tier and required permissions. Since models choose tools from names and descriptions, selection improves by making descriptions specific and distinct, merging overlapping tools, namespacing, and exposing only what's relevant: filter by the user's permissions and the agent's role, then for big catalogues retrieve the top few tools by semantic similarity or route to a tool group first. I measure tool-selection accuracy with labelled cases and trajectory tests."

---

## 10. Tool result validation, sanitization, and handling untrusted content

**In one sentence:** tool results — especially web pages, emails, documents and third-party APIs — are **untrusted input**: **validate** them against the expected schema, **sanitize** (strip scripts/HTML, truncate, remove secrets/PII where needed), **label** them as data before giving them to the model, and never let instructions inside them trigger actions without checks.

### In plain words
Mail that arrives at the office is opened in the mailroom: checked for anything dangerous, trimmed to what's relevant, stamped "external", and a letter saying "the CEO says transfer money" doesn't get acted on just because it says so.

### How it works
- **Validate structure:** expected JSON shape and types; reject or flag unexpected fields; check sizes.
- **Sanitize:** convert HTML to text, drop `<script>`/hidden text, normalize Unicode (zero-width/invisible characters can hide instructions), truncate to a token budget, redact secrets/PII.
- **Label and isolate:** wrap in `<tool_result source=… trust="untrusted">` ([trust boundaries](./Prompt-Engineering-and-Structured-Outputs.md#3-injection-resistant-prompt-design-and-explicit-trust-boundaries)); detect likely injected instructions and flag them.
- **Contain impact:** after reading untrusted content, require approval for side effects, restrict outbound URLs (no data exfiltration via links/images), and validate outputs before acting ([output validation](./Security-Privacy-and-Safety.md#4-output-validation-and-policy-enforcement-before-external-actions)).

### Interview answer
"I treat tool results, especially web pages, emails and third-party data, as untrusted input. I validate their structure and size, sanitize them — HTML to text, scripts and hidden text removed, Unicode normalized to strip invisible characters, secrets and PII redacted, truncated to a budget — and wrap them in labelled tags with their source so the model treats them as data. I flag likely injected instructions, and after the agent has read untrusted content I restrict its impact: approvals for side effects, outbound URL allowlists to prevent exfiltration, and output validation before any action."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Auth & secrets | act as the end user (OAuth) or scoped service identity; authorize per user/tenant at the tool; short-lived least-privilege creds from a secret manager; model never sees tokens |
| Approval gates | risk tiers; approve exact action + args (hash, expiry); enforced in code; durable interrupt; audit |
| Common tools | search (allowlist, top-k, untrusted) · DB (typed tools, read-only role, tenant filter, limits) · code (sandbox) · files (workspace jail) |
| Reliability | timeouts; retry only 429/5xx/timeouts; exp. backoff + jitter + caps; Retry-After; idempotency key per logical action |
| MCP | host → client ↔ server; JSON-RPC 2.0 over stdio / Streamable HTTP; tools, resources, prompts; trust & scope servers |
| Parallel vs. sequential | independent → parallel (max latency); dependent → DAG levels; concurrency caps; deterministic result order |
| Contracts | input schema + output envelope + structured errors + side effects; additive = safe, otherwise new version; contract tests |
| Audit & replay | append-only redacted events (who/what/when/why); traces; recorded results → deterministic replay → regression test |
| Registry & selection | clear distinct descriptions; filter by permission; retrieve top-k tools; namespaces; measure selection accuracy |
| Untrusted results | validate, sanitize (HTML, invisible chars, PII), truncate, label, flag injection, restrict actions afterwards |
