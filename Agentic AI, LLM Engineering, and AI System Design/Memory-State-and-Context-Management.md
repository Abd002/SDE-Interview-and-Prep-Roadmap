# Memory, State, and Context Management — What an Agent Remembers, Where It Lives, and Who Can See It

> **What you'll learn:** how agents keep context under control with **compaction, summaries and memory retrieval**; how **conversation state and checkpoints** work; where memory is **persisted** (in-memory, databases, durable checkpoint stores); how to keep memory **relevant** (aging, deletion, conflicts); how state stays **consistent across replicas**; how to retain memory **privately** (minimization, retention, erasure); how to **isolate sessions, users and tenants**; and the kinds of memory (**working, episodic, semantic, preferences**).
>
> **Prerequisites:** [Short-term context vs. persistent long-term memory](./Agent%20Fundamentals%20and%20Decision-Making/Short-term%20context%20vs.%20persistent%20long-term%20memory.md) and [tokens and context windows](./LLM-and-Generative-AI-Fundamentals.md#7-tokens-tokenization-context-windows-and-output-limits). Related: [Agentic Frameworks and Orchestration](./Agentic-Frameworks-and-Orchestration.md) (checkpointing in LangGraph).

## Table of Contents
1. [Context compaction, summaries, and memory retrieval](#1-context-compaction-summaries-and-memory-retrieval)
2. [Conversation state and checkpointing](#2-conversation-state-and-checkpointing)
3. [Memory persistence: in-memory, databases, and durable checkpoint stores](#3-memory-persistence-in-memory-databases-and-durable-checkpoint-stores)
4. [Memory relevance, aging, deletion, and conflict resolution](#4-memory-relevance-aging-deletion-and-conflict-resolution)
5. [Multi-replica deployments and shared state consistency](#5-multi-replica-deployments-and-shared-state-consistency)
6. [Privacy-aware memory retention and data minimization](#6-privacy-aware-memory-retention-and-data-minimization)
7. [Session isolation and user/tenant scoping](#7-session-isolation-and-usertenant-scoping)
8. [Working memory, episodic memory, semantic memory, and user preferences](#8-working-memory-episodic-memory-semantic-memory-and-user-preferences)
9. [Cheat sheet](#cheat-sheet)

Suggested order: **8 → 2 → 1 → 3 → 4 → 7 → 5 → 6**.

---

## 1. Context compaction, summaries, and memory retrieval

**In one sentence:** when a conversation or agent run grows beyond the useful context budget, **compact** it: keep recent turns verbatim, replace older ones with a **running summary**, move durable facts into **long-term memory**, drop or shorten stale **tool outputs**, and **retrieve** relevant memories back into the prompt only when needed.

### In plain words
After a long meeting you don't reread the full transcript — you keep the minutes (summary), the action items (facts), and only reopen the transcript for the part you need.

### How it works
- **Triggers:** token count above a threshold (e.g. 70% of the window), number of turns, or end of a task phase.
- **Compaction strategies:**
  - **Sliding window:** keep the last N turns.
  - **Running summary:** an LLM summarizes older turns into a few hundred tokens: decisions, open questions, user goals and constraints.
  - **Tool-result trimming:** keep only key fields or a short note ("fetched 120 orders; 3 were late: …"), with an ID to re-fetch.
  - **Memory extraction:** write durable facts and preferences to a store ([memory types](#8-working-memory-episodic-memory-semantic-memory-and-user-preferences)).
- **Retrieval:** embed the current query, search memories (vector + filters by user and recency), and insert the top few as a "relevant memories" block.
- **Risks:** summaries **lose detail** or drift, and errors compound across repeated summarization. Keep the originals in storage, and summarize from originals plus the previous summary. Evaluate on long conversations.

### Interview answer
"When context crosses a budget threshold I compact it. Recent turns stay verbatim. Older turns become a running summary of goals, decisions, constraints and open questions. Bulky tool outputs shrink to key facts plus a reference to re-fetch them, and durable facts and preferences go into a long-term memory store. At each step I retrieve only the few memories relevant to the current request, filtered by user and recency. Summaries lose detail and can drift, so I keep the raw history in storage, summarize from originals, and evaluate quality on long conversations."

---

## 2. Conversation state and checkpointing

**In one sentence:** **conversation state** is everything needed to continue a session — messages, the agent's working variables (plan, step, intermediate results), pending approvals — and **checkpointing** saves a snapshot of that state after each step under a **thread/session ID**, so the run can **resume** after a crash, wait for a human, be inspected, or be "time-travelled" to an earlier step.

### In plain words
Like the save points in a video game: after each level the game saves your position and inventory. If the power cuts out, you restart from the last save point, not from the beginning.

### How it works
- **State schema:** typed and explicit, for example `{messages, plan, current_step, results, pending_approval, version}`. Keep it serializable.
- **Checkpoint per step:** after each node or tool step, write `(thread_id, checkpoint_id, parent_id, state, metadata)`. This is the model behind LangGraph checkpointers ([LangGraph checkpointing](./Agentic-Frameworks-and-Orchestration.md#5-langgraph-checkpointing-persistence-interrupts-and-resumability)).
- **Resume:** load the latest checkpoint for the thread and continue from the next step. Completed steps aren't redone, and side effects stay safe through [idempotency keys](./Tool-Use-Integrations-and-Protocols.md#4-idempotent-operations-retries-backoff-timeouts-and-rate-limits).
- **Human-in-the-loop:** checkpoint, pause (interrupt), and resume hours later with the approval.
- **Time travel / forking:** load an older checkpoint to debug, or branch with edited state.
- **Versioning:** a schema version in the state lets you migrate old checkpoints after deploys.

### Interview answer
"Conversation state is everything needed to continue: messages plus the agent's working variables like the plan, current step, intermediate results and pending approvals, in a typed and serializable schema. I checkpoint it after every step under a thread ID. A crashed or redeployed worker resumes from the last checkpoint without redoing completed steps, and idempotency keys keep any replayed side effects safe. Checkpoints also enable human-in-the-loop pauses, debugging by inspecting or forking earlier states, and schema-versioned migrations after deploys."

---

## 3. Memory persistence: in-memory, databases, and durable checkpoint stores

**In one sentence:** **in-memory** state is fastest but disappears on restart and can't be shared across replicas, so production agents persist **checkpoints** in a durable store (Postgres, Redis with persistence, DynamoDB), **long-term memories** in a database or vector store, and large artifacts in **object storage**, each chosen for its durability, latency and query needs.

### In plain words
Sticky notes on your monitor (in-memory) are handy but lost when someone cleans the desk. Important things go in the filing cabinet (database), and big files go in the archive room (object storage).

### How it works
| Store | Use for | Pros | Cons |
|---|---|---|---|
| **In-process memory** | tests, local dev, single short-lived runs | fastest, zero setup | lost on restart; not shared across replicas |
| **Redis** | hot session state, short-TTL caches, locks | sub-ms, TTLs | durability depends on config; memory cost |
| **Postgres / SQL** | checkpoints, user memories, audit | ACID, queries, backups; pgvector for semantic memory | needs schema/ops; write load per step |
| **DynamoDB / Cosmos / Firestore** | checkpoints at scale | serverless scale, TTL | item size limits, query patterns |
| **Vector store** | semantic memory retrieval | similarity search | not a system of record |
| **Object storage (S3/GCS)** | big tool outputs, files, transcripts | cheap, durable | higher latency; store a reference in state |

- **Checkpoint stores:** LangGraph ships `InMemorySaver` (dev), SQLite, Postgres and Redis checkpointers. Durable-execution engines (Temporal and similar) persist the workflow history for you ([durable execution](./Agentic-Frameworks-and-Orchestration.md#3-durable-execution-and-recovering-from-mid-workflow-failures)).
- **Design:** keep state small, put big blobs in object storage with references, set **TTLs** for abandoned sessions, encrypt at rest, and back up.

### Interview answer
"In-memory state is great for tests and local development, but it disappears on restart and isn't shared across replicas. So in production I persist checkpoints in a durable store, usually Postgres, or DynamoDB or Redis with persistence at scale. Long-term user memories go in a database, with a vector index for semantic retrieval, and large tool outputs or files go in object storage with only references in the state. I keep state small, set TTLs for abandoned sessions, encrypt at rest and back up. For long-running workflows, durable-execution engines persist the history automatically."

---

## 4. Memory relevance, aging, deletion, and conflict resolution

**In one sentence:** long-term memory needs maintenance. **Score relevance** at retrieval (similarity × importance × recency), let memories **age** or expire, **delete** on request or when obsolete, and resolve **conflicts** ("I'm vegetarian" vs. later "I eat fish now") by preferring the **newer, more explicit, higher-confidence** fact and keeping provenance.

### In plain words
A good personal assistant remembers you moved to Alexandria last month, even though for years you lived in Cairo. They don't keep reminding you of the old address. They forget trivia, and they forget anything you ask them to forget.

### How it works
- **Retrieval score:** `α·similarity + β·importance + γ·recency_decay`, where `recency = exp(-age/τ)`. Importance is set at write time: explicit user statements beat inferences.
- **Aging and expiry:** TTLs for transient facts ("I'm travelling this week"), decay for unused memories, periodic **consolidation** that merges duplicates and summarizes clusters.
- **Conflict resolution:** detect contradictions on write (same subject/attribute), then update or supersede (keep history with `valid_from/valid_to`), or ask the user when unsure. Prefer explicit over inferred, newer over older, and the user's own statement over third-party data.
- **Deletion:** user-initiated ("forget that") and policy-driven (retention). Delete from **all** stores: the DB, vector index, caches and summaries ([privacy](#6-privacy-aware-memory-retention-and-data-minimization)).
- **Write discipline:** don't store everything. Store facts that will matter again, with source and confidence.

### Interview answer
"Long-term memory needs curation. At retrieval I rank memories by a mix of semantic similarity, importance set at write time — explicit statements beat inferences — and recency decay. Transient facts get TTLs, unused ones decay, and periodic consolidation merges duplicates. On write I detect conflicts on the same attribute and prefer newer, explicit, higher-confidence facts. I keep superseded versions with validity dates for provenance, or ask the user when it's ambiguous. Deletion, whether the user asks or policy requires it, must reach every copy: database, vector index, caches and summaries."

---

## 5. Multi-replica deployments and shared state consistency

**In one sentence:** when an agent service runs as **many stateless replicas** behind a load balancer, any request for a session can land on any replica, so state must live in a **shared store**. Concurrent updates to the same session need **concurrency control** (optimistic versioning or per-session locks/leases, or routing a session to one worker), or you get lost updates and duplicate actions.

### In plain words
Several waiters share one order book for each table. If two waiters write in the same book at the same moment without checking, one order gets lost. So each waiter checks the page number before writing, or only one waiter serves a table at a time.

### How it works
- **Stateless replicas + external state** (Postgres/Redis/DynamoDB). Avoid sticky sessions as the *only* mechanism: pods die.
- **Race example:** a user double-clicks, or a retry plus the original request arrive together. Two replicas load state v5, both append, and both save, so one update is lost.
- **Optimistic concurrency:** save with `WHERE version = 5`. If 0 rows are updated, reload and retry (or reject the duplicate). Supported via DynamoDB conditional writes and ETags.
- **Pessimistic:** a per-session lock or lease (Redis `SET NX PX`, or Postgres advisory locks) with expiry and **fencing tokens**, so a stale lock holder can't write.
- **Single-writer per session:** route by session ID to a queue partition or actor, which serializes that session's work naturally (Kafka partition key, workflow engines).
- **Consistency levels:** read-your-writes for the user's own session; caches invalidated or versioned; idempotency keys for side effects ([idempotency](./Production-Reliability-and-Observability.md#9-retry-storms-duplicate-side-effects-and-idempotency-keys)).

### Interview answer
"Agent services should be stateless replicas with session state in a shared store, because any request can hit any pod and pods come and go. The danger is concurrent updates to the same session from double submits or retries. A blind write causes lost updates, so I use optimistic concurrency: a version column with conditional writes, then reload and reapply on conflict. Where serialization matters more, I use per-session leases with fencing tokens, or route each session to a single writer via a partitioned queue or workflow engine. Side effects still carry idempotency keys, and caches are versioned so users read their own writes."

---

## 6. Privacy-aware memory retention and data minimization

**In one sentence:** store **only the memory you need** (data minimization), **avoid or redact sensitive data** (PII, health, payment, secrets), give memories a clear **purpose and retention period**, let users **see, correct and delete** what's remembered, and make deletion reach **every copy** — DB, vector index, caches, summaries, logs, backups (per policy) — in line with GDPR and similar laws.

### In plain words
A considerate assistant writes down "prefers morning meetings" — not your full medical history from a passing comment. They throw notes away when they're no longer needed, and they shred everything when you ask.

### How it works
- **Minimize at write:** a memory-extraction step that keeps durable, useful facts and discards incidental sensitive details. Store *derived* facts ("prefers vegetarian food") rather than raw transcripts where possible.
- **Classify and redact:** detect PII (names, phones, national IDs, card numbers, emails) and secrets, then redact, tokenize or encrypt them before storage ([PII handling](./Security-Privacy-and-Safety.md#5-pii-detection-redaction-encryption-and-retention-policies)).
- **Retention:** per category TTLs, such as session transcripts for 30 days, preferences until deleted, support tickets per legal requirements. Run scheduled purge jobs.
- **User control:** opt-in to memory, a "what do you remember about me?" view, edit/delete, and incognito sessions.
- **Erasure everywhere:** index memories by user ID across all stores, cascade deletes, tombstone and compact vector indexes ([vector deletion](./Retrieval-Augmented-Generation.md#12-vector-databases-and-indexing--update--deletion-strategies)), purge caches, and handle backups by expiry.
- **Don't train on it** without consent. Restrict access, encrypt, and audit reads.

### Interview answer
"I apply data minimization: a memory-extraction step stores only durable, useful facts with a clear purpose, preferring derived facts over raw transcripts. Sensitive categories are skipped or redacted, and PII and secrets are detected and redacted or encrypted before storage. Each category has a retention period enforced by purge jobs. Users can opt in, see, edit and delete what's remembered. An erasure request cascades through every copy keyed by user ID: database, vector index with tombstones and compaction, caches, summaries and logs, with backups expiring per policy. Memories aren't used for training without consent, and access is restricted and audited."

---

## 7. Session isolation and user/tenant scoping

**In one sentence:** every piece of state and memory is **keyed by tenant → user → session/thread**, and every read and write is **scoped by the authenticated identity** in code, so one user's conversation, memories, files or cached answers can **never leak** into another's — including through shared caches, vector searches, or the model's context.

### In plain words
Hotel rooms: each guest's key opens only their room, housekeeping never mixes up belongings between rooms, and the front desk never hands one guest's messages to another.

### How it works
- **Key hierarchy:** `tenant_id / user_id / thread_id` on every record (checkpoints, memories, files, traces). Use **composite primary keys** or row-level security (Postgres RLS).
- **Identity from auth, not from the model or the request body:** the server derives `tenant_id` and `user_id` from the verified token. Thread IDs are random (UUIDs) and **checked for ownership** on every access, which prevents IDOR (insecure direct object reference).
- **Shared components:**
  - Vector search with mandatory tenant and user filters ([multi-tenant retrieval](./Retrieval-Augmented-Generation.md#7-multi-tenant-retrieval-acl-aware-filtering-and-data-freshness)).
  - Caches keyed by tenant (and permissions).
  - Per-session sandboxes and temp directories.
- **Process-level isolation:** don't keep per-user data in global variables of a shared worker, and clear state between jobs.
- **Test it:** cross-tenant access tests in CI ("user B can't read thread of user A").

### Interview answer
"All state is keyed by tenant, user and thread, and the tenant and user come from the verified auth token, never from the request body or the model. Thread IDs are random, and ownership is checked on every access to prevent IDOR. I return not-found instead of forbidden so existence isn't revealed, and enforce it in the data layer with composite keys or row-level security. Shared components are scoped as well: vector searches have mandatory tenant and user filters, caches are keyed by tenant and permissions, and sandboxes and temp storage are per session. Cross-tenant access tests run in CI."

---

## 8. Working memory, episodic memory, semantic memory, and user preferences

**In one sentence:** agents use several kinds of memory:
- **Working memory** is the current context: the scratchpad, the plan and recent messages.
- **Episodic memory** holds past *experiences*: previous conversations and runs, what worked and what failed.
- **Semantic memory** holds general *facts* about the user, domain or world.
- **Procedural memory** holds learned instructions and skills.
- **User preferences** are a high-value slice that personalizes behaviour.

### In plain words
- Working memory: what you're juggling in your head right now.
- Episodic memory: your diary ("last time I took the 7am train it was full").
- Semantic memory: things you know ("trains to Aswan leave from Ramses station").
- Preferences: "I like window seats".

### How it works
| Type | Lives in | Written | Retrieved |
|---|---|---|---|
| **Working** | the prompt / graph state | every step | always present (budgeted — [compaction](#1-context-compaction-summaries-and-memory-retrieval)) |
| **Episodic** | event/run log + summaries, vector index | end of session/task ("reflection") | by similarity to the current task ("have I solved this before?") |
| **Semantic** | profile/fact store (key–value or graph) + vector index | when a durable fact is learned | by key or similarity |
| **Procedural** | system prompt, skills, few-shot examples | by developers or by learning from feedback | loaded by task type |
| **Preferences** | user profile (structured) | explicit statements, confirmed inferences | injected into the system prompt for the user |

- Frameworks: LangGraph **store** (namespaced long-term memory) and checkpointers (working/thread memory), plus memory libraries such as Mem0, Letta (MemGPT) and Zep.
- Background reading: [Short-term vs. long-term memory](./Agent%20Fundamentals%20and%20Decision-Making/Short-term%20context%20vs.%20persistent%20long-term%20memory.md).

### Interview answer
"Working memory is the current context: recent messages, the plan and intermediate results in the graph state. It's always present but budgeted. Episodic memory stores past sessions or runs, often as reflections on what worked, retrieved by similarity to the current task. Semantic memory holds durable facts about the user or domain in a profile or fact store, often with a vector index. Procedural memory is the instructions and skills. User preferences are a structured, high-value subset injected for that user. Each type has different write triggers and retrieval paths, and all of it is scoped per user with privacy controls."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Compaction | threshold-triggered; recent turns verbatim + running summary + trimmed tool outputs + extracted memories; retrieve relevant ones |
| Checkpointing | typed serializable state; save after each step per thread ID; resume, interrupt, time-travel, schema versions |
| Persistence | in-memory = dev only; Postgres/DynamoDB/Redis for checkpoints; DB + vector index for memories; object storage for blobs; TTLs |
| Relevance & conflicts | similarity × importance × recency; TTL/decay/consolidation; newer + explicit wins, keep provenance; delete everywhere |
| Multi-replica | stateless pods + shared store; optimistic versions or leases with fencing; single writer per session; idempotency |
| Privacy | minimize, skip/redact sensitive data, retention per category, user view/edit/delete, erasure cascades, no training without consent |
| Isolation | tenant/user/thread keys; identity from auth; ownership check per access (IDOR); scoped caches, vectors, sandboxes; CI tests |
| Memory types | working (context) · episodic (past runs) · semantic (facts) · procedural (instructions) · preferences (profile) |
