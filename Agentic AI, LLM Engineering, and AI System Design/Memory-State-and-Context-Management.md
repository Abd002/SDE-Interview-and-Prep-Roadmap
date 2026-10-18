# Memory, State, and Context Management — What an Agent Remembers, Where It Lives, and Who Can See It

> **What you'll learn:** how agents keep context under control with **compaction, summaries and memory retrieval**; how **conversation state and checkpoints** work; where memory is **persisted** (in-memory, databases, durable checkpoint stores); how to keep memory **relevant** (aging, deletion, conflicts); how state stays **consistent across replicas**; how to retain memory **privately** (minimization, retention, erasure); how to **isolate sessions, users and tenants**; and the kinds of memory (**working, episodic, semantic, preferences**). Each part has a runnable C++ example.
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

#### Modern C++ example — compact a long conversation: summarize old turns, trim tool output, retrieve a stored memory
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Turn { std::string role, text; int tokens; };

std::string summarize(const std::vector<Turn>& old) {                     // stand-in for an LLM summary call
    return "[summary of " + std::to_string(old.size()) + " turns] User is planning a trip to Luxor in December, budget 20,000 EGP, prefers trains.";
}

int main() {
    std::vector<Turn> history;
    for (int i = 1; i <= 30; ++i) history.push_back({i % 2 ? "user" : "assistant", "turn " + std::to_string(i), 400});
    history.push_back({"tool", "search_trains -> 214 results (full JSON, 9,000 tokens)", 9000});
    history.push_back({"user", "Which of those leave in the morning?", 20});

    int total = 0; for (auto& t : history) total += t.tokens;
    const int threshold = 8000, keep_recent = 4;
    std::cout << "before: " << history.size() << " messages, " << total << " tokens\n";
    if (total > threshold) {
        std::vector<Turn> old(history.begin(), history.end() - keep_recent), compacted{{"system", summarize(old), 60}};
        for (auto it = history.end() - keep_recent; it != history.end(); ++it) {
            Turn t = *it;
            if (t.role == "tool" && t.tokens > 1000) { t.text = "search_trains -> 214 results; 6 depart before 10:00 (ids saved as result_ref=r-88)"; t.tokens = 40; }
            compacted.push_back(t);
        }
        compacted.insert(compacted.begin() + 1, {"system", "[relevant memory] User gets motion-sick on buses (from 2026-08 chat).", 25});
        history = compacted;
    }
    total = 0; for (auto& t : history) total += t.tokens;
    std::cout << "after:  " << history.size() << " messages, " << total << " tokens\n";
    for (auto& t : history) std::cout << "  " << t.role << ": " << t.text << '\n';
}
```

**Output:**
```text
before: 32 messages, 21020 tokens
after:  6 messages, 945 tokens
  system: [summary of 28 turns] User is planning a trip to Luxor in December, budget 20,000 EGP, prefers trains.
  system: [relevant memory] User gets motion-sick on buses (from 2026-08 chat).
  user: turn 29
  assistant: turn 30
  tool: search_trains -> 214 results; 6 depart before 10:00 (ids saved as result_ref=r-88)
  user: Which of those leave in the morning?
```

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

#### Modern C++ example — checkpoint after every step, crash mid-run, and resume from the last checkpoint
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>

struct State { int step = 0; std::vector<std::string> results; };

class Checkpointer {
    std::map<std::string, std::vector<State>> store_;            // thread_id -> checkpoints (a DB table in production)
public:
    void save(const std::string& thread, const State& s) { store_[thread].push_back(s); }
    State latest(const std::string& thread) const { auto it = store_.find(thread); return it == store_.end() ? State{} : it->second.back(); }
    std::size_t count(const std::string& thread) const { auto it = store_.find(thread); return it == store_.end() ? 0 : it->second.size(); }
};

const std::vector<std::string> steps{"fetch_invoice", "validate_totals", "lookup_vendor", "draft_email"};

void run(const std::string& thread, Checkpointer& cp, bool crash_at_step_2) {
    State s = cp.latest(thread);
    std::cout << "run starts at step " << s.step << '\n';
    while (s.step < int(steps.size())) {
        if (crash_at_step_2 && s.step == 2) throw std::runtime_error("worker killed (OOM) during " + steps[s.step]);
        s.results.push_back(steps[s.step] + ":ok");
        ++s.step;
        cp.save(thread, s);
        std::cout << "  done " << steps[s.step - 1] << " -> checkpoint #" << cp.count(thread) << '\n';
    }
}

int main() {
    Checkpointer cp;
    try { run("thread-42", cp, true); } catch (const std::exception& e) { std::cout << "CRASH: " << e.what() << '\n'; }
    run("thread-42", cp, false);                                  // a new worker resumes the same thread
    auto final = cp.latest("thread-42");
    std::cout << "final results:"; for (auto& r : final.results) std::cout << ' ' << r; std::cout << '\n';
}
```

**Output:**
```text
run starts at step 0
  done fetch_invoice -> checkpoint #1
  done validate_totals -> checkpoint #2
CRASH: worker killed (OOM) during lookup_vendor
run starts at step 2
  done lookup_vendor -> checkpoint #3
  done draft_email -> checkpoint #4
final results: fetch_invoice:ok validate_totals:ok lookup_vendor:ok draft_email:ok
```

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

#### Modern C++ example — one interface, two backends: in-memory loses state on restart, a file-backed store survives
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <filesystem>
#include <fstream>
#include <iostream>
#include <map>
#include <memory>
#include <string>

struct Store {
    virtual ~Store() = default;
    virtual void put(const std::string& k, const std::string& v) = 0;
    virtual std::string get(const std::string& k) = 0;
};
struct InMemoryStore : Store {
    std::map<std::string, std::string> m;
    void put(const std::string& k, const std::string& v) override { m[k] = v; }
    std::string get(const std::string& k) override { auto it = m.find(k); return it == m.end() ? "<none>" : it->second; }
};
struct FileStore : Store {                                       // stands in for Postgres/DynamoDB: survives process restarts
    std::filesystem::path dir;
    explicit FileStore(std::filesystem::path d) : dir(std::move(d)) { std::filesystem::create_directories(dir); }
    void put(const std::string& k, const std::string& v) override { std::ofstream(dir / k) << v; }
    std::string get(const std::string& k) override { std::ifstream in(dir / k); std::string v; return std::getline(in, v) ? v : "<none>"; }
};

int main() {
    auto dir = std::filesystem::temp_directory_path() / "agent-checkpoints-demo";
    std::filesystem::remove_all(dir);
    {   // process 1
        std::unique_ptr<Store> mem = std::make_unique<InMemoryStore>(), disk = std::make_unique<FileStore>(dir);
        mem->put("thread-7", "step=3;plan=book_train");
        disk->put("thread-7", "step=3;plan=book_train");
        std::cout << "process 1: memory=" << mem->get("thread-7") << " disk=" << disk->get("thread-7") << '\n';
    }   // process exits / pod restarts
    {   // process 2
        std::unique_ptr<Store> mem = std::make_unique<InMemoryStore>(), disk = std::make_unique<FileStore>(dir);
        std::cout << "process 2: memory=" << mem->get("thread-7") << " disk=" << disk->get("thread-7") << '\n';
    }
    std::filesystem::remove_all(dir);
}
```

**Output:**
```text
process 1: memory=step=3;plan=book_train disk=step=3;plan=book_train
process 2: memory=<none> disk=step=3;plan=book_train
```

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

#### Modern C++ example — upsert a memory with conflict resolution, then rank memories by similarity, importance and recency
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Memory { std::string key, value, source; int day; double importance; bool active = true; };

void upsert(std::vector<Memory>& mem, Memory m) {
    for (auto& old : mem)
        if (old.active && old.key == m.key && old.value != m.value) {
            bool newer_or_explicit = m.day >= old.day && (m.source == "explicit" || old.source != "explicit");
            if (!newer_or_explicit) { std::cout << "keep '" << old.value << "', ignore weaker '" << m.value << "'\n"; return; }
            old.active = false;
            std::cout << "conflict on " << m.key << ": '" << old.value << "' (day " << old.day << ") superseded by '" << m.value << "' (day " << m.day << ")\n";
        }
    mem.push_back(m);
}

int main() {
    std::vector<Memory> mem;
    upsert(mem, {"diet", "vegetarian", "explicit", 10, 0.9});
    upsert(mem, {"city", "Cairo", "explicit", 12, 0.7});
    upsert(mem, {"likes", "football", "inferred", 40, 0.3});
    upsert(mem, {"diet", "pescatarian", "explicit", 200, 0.9});         // user: "I eat fish now"
    upsert(mem, {"city", "Giza", "inferred", 210, 0.4});                 // weak guess from an address in an email

    const int today = 220; const double tau = 180;
    struct Scored { double score; std::string text; };
    std::vector<Scored> ranked;
    std::vector<double> similarity_to_query{0.9, 0.2, 0.1, 0.9, 0.2};   // query: "suggest a restaurant for dinner"
    for (std::size_t i = 0; i < mem.size(); ++i) {
        if (!mem[i].active) continue;
        double recency = std::exp(-(today - mem[i].day) / tau);
        ranked.push_back({0.6 * similarity_to_query[i] + 0.25 * mem[i].importance + 0.15 * recency, mem[i].key + "=" + mem[i].value});
    }
    std::sort(ranked.begin(), ranked.end(), [](auto& a, auto& b) { return a.score > b.score; });
    std::cout << std::fixed << std::setprecision(3) << "retrieved for 'suggest a restaurant':\n";
    for (auto& r : ranked) std::cout << "  " << r.text << " (" << r.score << ")\n";
}
```

**Output:**
```text
conflict on diet: 'vegetarian' (day 10) superseded by 'pescatarian' (day 200)
keep 'Cairo', ignore weaker 'Giza'
retrieved for 'suggest a restaurant':
  diet=pescatarian (0.899)
  city=Cairo (0.342)
  likes=football (0.190)
```

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

#### Modern C++ example — two replicas update the same session: lost update without versioning vs. optimistic concurrency with retry
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Session { int version = 0; std::vector<std::string> messages; };

struct SharedStore {
    Session row;
    Session load() const { return row; }
    void save_blind(const Session& s) { row = s; }
    bool save_if_version(const Session& s, int expected) {       // UPDATE ... WHERE version = expected
        if (row.version != expected) return false;
        row = s; row.version = expected + 1; return true;
    }
};

int main() {
    SharedStore blind;
    auto a = blind.load(), b = blind.load();                      // replica A and B read the same state
    a.messages.push_back("user: cancel order 1042"); b.messages.push_back("user: also change my address");
    blind.save_blind(a); blind.save_blind(b);
    std::cout << "blind writes: " << blind.row.messages.size() << " message(s) stored -> LOST UPDATE\n";

    SharedStore occ;
    auto ra = occ.load(), rb = occ.load();
    int va = ra.version, vb = rb.version;
    ra.messages.push_back("user: cancel order 1042"); rb.messages.push_back("user: also change my address");
    std::cout << "replica A save: " << (occ.save_if_version(ra, va) ? "ok" : "conflict") << '\n';
    if (!occ.save_if_version(rb, vb)) {
        std::cout << "replica B save: conflict (version changed) -> reload and reapply\n";
        auto fresh = occ.load(); fresh.messages.push_back("user: also change my address");
        std::cout << "replica B retry: " << (occ.save_if_version(fresh, fresh.version) ? "ok" : "conflict") << '\n';
    }
    std::cout << "optimistic concurrency: " << occ.row.messages.size() << " messages, version " << occ.row.version << '\n';
}
```

**Output:**
```text
blind writes: 1 message(s) stored -> LOST UPDATE
replica A save: ok
replica B save: conflict (version changed) -> reload and reapply
replica B retry: ok
optimistic concurrency: 2 messages, version 2
```

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

#### Modern C++ example — extract minimal memories with PII redaction and per-category retention, then run a purge
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <regex>
#include <string>
#include <vector>

struct Memory { std::string user, category, text; int created_day; };

std::string redact(std::string s) {
    s = std::regex_replace(s, std::regex(R"(\b01[0125]\d{8}\b)"), "<phone>");                  // Egyptian mobile numbers
    s = std::regex_replace(s, std::regex(R"(\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b)"), "<card>");
    return std::regex_replace(s, std::regex(R"([\w.]+@[\w.]+)"), "<email>");
}

int main() {
    std::map<std::string, int> retention_days{{"preference", 100000}, {"transcript", 30}, {"health", 0}};   // 0 = never store
    std::vector<std::pair<std::string, std::string>> candidates{
        {"preference", "Prefers window seats on trains"},
        {"transcript", "Call me on 01012345678 or mail mona@example.com, card 4111 1111 1111 1111"},
        {"health", "Mentioned a heart condition"},
    };
    std::vector<Memory> store;
    for (auto& [cat, text] : candidates) {
        if (retention_days[cat] == 0) { std::cout << "not stored (" << cat << "): sensitive, no purpose\n"; continue; }
        store.push_back({"mona", cat, redact(text), 1});
        std::cout << "stored (" << cat << "): " << store.back().text << '\n';
    }
    int today = 45;
    std::erase_if(store, [&](const Memory& m) { return today - m.created_day > retention_days[m.category]; });
    std::cout << "after purge on day " << today << ": " << store.size() << " memory left -> " << store[0].text << '\n';
    std::erase_if(store, [](const Memory& m) { return m.user == "mona"; });                       // "forget me"
    std::cout << "after erasure request: " << store.size() << " memories (also purge vector index, caches, summaries)\n";
}
```

**Output:**
```text
stored (preference): Prefers window seats on trains
stored (transcript): Call me on <phone> or mail <email>, card <card>
not stored (health): sensitive, no purpose
after purge on day 45: 1 memory left -> Prefers window seats on trains
after erasure request: 0 memories (also purge vector index, caches, summaries)
```

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

#### Modern C++ example — a scoped state store that derives identity from the auth context and rejects cross-user thread access
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <tuple>

struct AuthContext { std::string tenant, user; };                       // from a verified token
using Key = std::tuple<std::string, std::string, std::string>;          // tenant, user, thread

class ScopedStore {
    std::map<Key, std::string> data_;
    std::map<std::string, Key> thread_owner_;
public:
    void write(const AuthContext& a, const std::string& thread, const std::string& v) {
        Key k{a.tenant, a.user, thread};
        thread_owner_.emplace(thread, k);
        data_[k] = v;
    }
    std::optional<std::string> read(const AuthContext& a, const std::string& thread) const {
        auto owner = thread_owner_.find(thread);
        if (owner == thread_owner_.end() || owner->second != Key{a.tenant, a.user, thread}) return std::nullopt;   // 404, not 403: don't reveal it exists
        return data_.at(owner->second);
    }
};

int main() {
    ScopedStore store;
    AuthContext mona{"acme", "mona"}, karim{"acme", "karim"}, eve{"globex", "eve"};
    store.write(mona, "th-9f2c", "messages about mona's salary negotiation");
    for (auto* who : {&mona, &karim, &eve}) {
        auto r = store.read(*who, "th-9f2c");
        std::cout << who->user << "@" << who->tenant << " reads th-9f2c -> " << (r ? *r : "404 not found") << '\n';
    }
}
```

**Output:**
```text
mona@acme reads th-9f2c -> messages about mona's salary negotiation
karim@acme reads th-9f2c -> 404 not found
eve@globex reads th-9f2c -> 404 not found
```

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

#### Modern C++ example — assemble a prompt from working, episodic, semantic and preference memory
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Episode { std::string task, outcome; };

int main() {
    std::vector<std::string> working{"user: book me a train to Aswan next Friday", "plan: 1) search trains 2) pick seat 3) confirm"};
    std::vector<Episode> episodic{{"train to Luxor 2026-08", "7am train was full; booked the 9am instead"},
                                  {"hotel in Dahab 2026-05", "user cancelled: too far from the beach"}};
    std::map<std::string, std::string> semantic{{"home_station", "Ramses (Cairo)"}, {"aswan_trip_hours", "~12-14 by train"}};
    std::map<std::string, std::string> preferences{{"seat", "window"}, {"class", "first"}, {"language", "Arabic"}};

    std::string prompt = "SYSTEM: Travel assistant. Reply in " + preferences["language"] + ".\n";
    prompt += "[preferences] seat=" + preferences["seat"] + ", class=" + preferences["class"] + "\n";
    prompt += "[facts] home station: " + semantic["home_station"] + "; Cairo->Aswan: " + semantic["aswan_trip_hours"] + "\n";
    for (auto& e : episodic) if (e.task.find("train") != std::string::npos) prompt += "[past episode] " + e.task + ": " + e.outcome + "\n";
    for (auto& w : working) prompt += w + "\n";
    std::cout << prompt;
}
```

**Output:**
```text
SYSTEM: Travel assistant. Reply in Arabic.
[preferences] seat=window, class=first
[facts] home station: Ramses (Cairo); Cairo->Aswan: ~12-14 by train
[past episode] train to Luxor 2026-08: 7am train was full; booked the 9am instead
user: book me a train to Aswan next Friday
plan: 1) search trains 2) pick seat 3) confirm
```

Only the **relevant** episode (the train one) was retrieved. The hotel episode stayed out of the context.

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
