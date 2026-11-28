# Security Operations and Design Interviews — Logging, Multi-Tenancy, Trade-offs, Incident Response, Replay and Confused Deputies

> **What you'll learn:** how to run **centralized security logging** with **tamper-evident audit trails**, how to **design multi-tenant data access** with real **tenant isolation**, how to **explain trade-offs** between usability, latency and security in a design interview, the **security incident lifecycle** (detection, containment, eradication, recovery), and how to model **replay attacks**, **confused-deputy** problems and **privilege boundaries**.
>
> **Prerequisites:** the other security guides, especially [Core Security Principles](./Core-Security-Principles.md) and [Authentication and Authorization](./Authentication-and-Authorization.md); for the operations side, [Production Incidents](../Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md).

## Table of Contents
1. [Centralized security logging and tamper-evident audit trails](#1-centralized-security-logging-and-tamper-evident-audit-trails)
2. [Design secure multi-tenant data access and tenant isolation](#2-design-secure-multi-tenant-data-access-and-tenant-isolation)
3. [Explain trade-offs between usability, latency, and security](#3-explain-trade-offs-between-usability-latency-and-security)
4. [Incident lifecycle: detection, containment, eradication, recovery](#4-incident-lifecycle-detection-containment-eradication-recovery)
5. [Model replay attacks, confused deputy issues, and privilege boundaries](#5-model-replay-attacks-confused-deputy-issues-and-privilege-boundaries)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Centralized security logging and tamper-evident audit trails

**In one sentence:** ship security-relevant events from every system (apps, identity provider, cloud control plane, Kubernetes, network, endpoints) to a **central, access-controlled** store/SIEM, keep **audit trails** of who did what, and make them **tamper-evident** (append-only, **hash-chained or signed**, write-once storage) so attackers can't quietly erase their tracks.

### In plain words
A bank's CCTV recordings go to a separate locked room, not to a laptop the cashier can wipe. And the pages of the visitor log are numbered and sealed so a torn-out page is obvious.

### How it works
**What to log (security events):** authentication (success, failure, MFA, lockouts), authorization denials, privilege and role changes, admin actions, data exports and bulk reads, API key/token creation, configuration and policy changes, cloud control-plane calls (CloudTrail, GCP Audit Logs, Azure Activity Log), Kubernetes audit logs, network flows (VPC Flow Logs), WAF/IDS alerts, endpoint (EDR) events.

**Each event:** timestamp (UTC, synced clocks), actor (user / service identity), source (IP, device, user agent), action, target resource, result, request/trace ID, tenant. **Never** passwords, tokens, keys or full card numbers.

**Centralization:** a SIEM / log platform (Splunk, Elastic Security, Microsoft Sentinel, Google SecOps, Datadog, OpenSearch) in a **separate security account** that production admins can't modify; detection rules (Sigma), correlation, alerting; retention by policy (often 1 year+, regulations may require more).

**Tamper evidence**
- **Append-only** write path; separate permissions for writing vs. reading vs. deleting (nobody routinely deletes).
- **WORM storage:** S3 Object Lock (compliance mode), immutable blob storage.
- **Hash chaining:** each record includes the hash of the previous one; changing or removing a record breaks every later hash. Periodically **sign** or anchor the latest hash elsewhere (CloudTrail log file integrity validation works like this; Certificate Transparency uses Merkle trees).

### Interview answer
"I centralize security events — authentication, authorization denials, privilege and config changes, admin actions, exports, cloud control-plane, Kubernetes audit, network and endpoint logs — into a SIEM in a separate security account with consistent fields and no secrets, plus detection rules and alerting. Audit trails are append-only with separate write and delete permissions, stored on WORM storage like S3 Object Lock, and hash-chained with the chain head signed or anchored elsewhere, so edits or deletions are detectable — the same idea as CloudTrail integrity validation."

---

## 2. Design secure multi-tenant data access and tenant isolation

**In one sentence:** in a multi-tenant system, **every** request carries a **tenant context derived from authentication** (never from a client-supplied field), and **every layer** — API, queries, caches, files, queues, search indexes, encryption keys, logs — is **scoped to that tenant**, using a model that fits the risk: **shared tables with tenant IDs + row-level security**, **schema/database per tenant**, or **cell/account per tenant**.

### In plain words
An apartment building: everyone shares the lift and the pipes, but each flat has its own lock and its own mailbox. The danger is the master key — or a mailbox labelled by whatever name the visitor says.

### How it works
| Isolation model | How | Isolation | Cost / ops |
|---|---|---|---|
| **Pool** (shared everything) | `tenant_id` column on every table, filtered in every query + **Row-Level Security** (PostgreSQL RLS) | logical | cheapest, easiest to operate |
| **Bridge** | schema or database per tenant on shared servers | stronger | more migrations and connections |
| **Silo** | separate stack/account/cell per tenant (or per big customer) | strongest (blast radius, noisy neighbours) | most expensive |

**Rules**
- **Tenant from identity:** take `tenant_id` from the verified token/session; ignore tenant IDs in request bodies/paths unless they match the token.
- **Defence in depth in the data layer:** RLS policies (`USING (tenant_id = current_setting('app.tenant')::uuid)`) so a forgotten `WHERE` can't leak; composite keys including tenant; tenant-aware repositories that **can't** be called without a tenant.
- **Everything else is tenant-scoped too:** cache keys (`tenant:42:user:7`), object storage prefixes + IAM conditions, search indexes, message topics, background jobs, analytics exports, **logs** (tenant field, access control on log search).
- **Per-tenant encryption keys** (envelope encryption) for strong separation and crypto-shredding on offboarding.
- **Noisy neighbours:** per-tenant rate limits and quotas; cells for big tenants.
- **Test it:** automated cross-tenant tests for every endpoint; fuzz tenant IDs; alert on cross-tenant access attempts.

### Interview answer
"The tenant comes from the verified identity, never from a client-supplied field, and every layer is scoped by it: tenant-aware repositories that can't be called without a tenant context, backed by database row-level security so a forgotten filter can't leak, plus tenant-prefixed cache keys, storage paths with IAM conditions, search indexes, queues, logs and per-tenant encryption keys. I choose pool, bridge or silo isolation by risk and size — shared tables with RLS for most tenants, dedicated cells for large or regulated ones — add per-tenant quotas against noisy neighbours, and run automated cross-tenant tests."

---

## 3. Explain trade-offs between usability, latency, and security

**In one sentence:** every control has a cost in **friction**, **latency**, **money** or **complexity**, so in a design interview state the **risk** you're addressing, propose a control **proportional to it**, name its **cost**, and offer ways to **reduce the cost** (risk-based step-up, caching, async checks) instead of "maximum security everywhere".

### In plain words
A house with ten locks on every door is very secure — and nobody wants to live there. You put the strongest lock on the safe, a normal lock on the front door, and none on the bathroom.

### How it works
| Decision | More secure | Cost | Common middle ground |
|---|---|---|---|
| MFA | on every login | friction, drop-off | **risk-based / adaptive MFA**: new device, unusual location, sensitive actions (step-up) |
| Session length | 15 min | users re-login constantly | short access tokens + refresh tokens + idle timeout; step-up for sensitive actions |
| Password rules | complex rotation rules | users write passwords down | NIST SP 800-63B Rev. 4: at least 15 characters when the password is the only factor (8 with MFA), breached-password check, no composition rules or forced periodic rotation, passkeys |
| Token validation | introspect every token at the IdP | network round trip per request | local JWT validation with cached JWKS + short expiry |
| Authorization | central policy service call per request | latency, availability dependency | embedded policy engine / sidecar with cached policies and data |
| Encryption | field-level for everything | CPU, no DB-side search/sort | field-level only for restricted data; disk/TLS for the rest |
| Rate limits | very strict | blocks legit users | per-endpoint limits, progressive challenges |
| Logging | log every payload | cost, privacy risk | log metadata + IDs; sample; redact |
| CAPTCHA | everyone | accessibility, conversion | only on suspicious traffic (bot score) |

**How to talk about it**
1. "The risk is X, with impact Y."
2. "I'd use control Z because…"
3. "The cost is … (latency/friction/money); I'd reduce it by …"
4. "If the risk were higher (e.g. regulated data), I'd go further with …"

### Interview answer
"I frame every control as risk versus cost. For example, rather than MFA on every request, adaptive MFA challenges on new devices, unusual locations or sensitive actions like changing payout details, and blocks impossible travel — strong where it matters, frictionless otherwise. For latency, I validate JWTs locally with cached keys and short expiry instead of introspecting each one, and embed the policy engine instead of a remote call. I state the risk, the control, its cost and how I'd soften it, and how I'd tighten it for regulated data."

---

## 4. Incident lifecycle: detection, containment, eradication, recovery

**In one sentence:** a security incident follows **preparation → detection & analysis → containment → eradication → recovery → lessons learned** (NIST SP 800-61): detect it early, **stop the spread** without destroying evidence, **remove** the attacker's access and root cause, **restore** safely with extra monitoring, and improve controls afterwards.

### In plain words
A fire in a building: smoke detectors (detection), close the fire doors so it doesn't spread (containment), put out every ember (eradication), check the wiring before people return (recovery), and fix why the fire started (lessons learned).

### How it works
| Phase | Key actions |
|---|---|
| **Preparation** | runbooks, on-call, contacts (legal, PR, regulators), logging in place, forensic tooling, tabletop exercises, backups tested |
| **Detection & analysis** | alerts (SIEM, EDR, GuardDuty), user reports, threat intel; triage; **scope**: which accounts, systems, data, since when; preserve evidence (snapshots, logs, memory) with chain of custody |
| **Containment** | short-term: isolate hosts (quarantine security group), disable compromised accounts/keys, block IPs/domains, revoke sessions and tokens; long-term: patch, segment, temporary compensating controls |
| **Eradication** | remove malware/backdoors and persistence (new users, keys, cron jobs, OAuth grants, Lambda functions); fix the root cause (vulnerability, misconfig); **rotate all potentially exposed credentials** |
| **Recovery** | rebuild from known-good images (don't "clean" a compromised host), restore data from verified backups, bring services back gradually, heightened monitoring for re-entry |
| **Post-incident** | blameless postmortem, timeline, new detections, control improvements; **notification** obligations (GDPR: supervisory authority within **72 hours** of awareness for personal-data breaches; contracts; customers) |

- Don't tip off the attacker prematurely when investigating an active intrusion; coordinate containment.
- Use the same **incident command** roles as reliability incidents ([roles](../Testing%2C%20Reliability%20%26%20Observability/Production-Incidents-and-Operational-Excellence.md#3-incident-severity-triage-mitigation-and-communication)), plus legal and communications.

### Interview answer
"I follow the NIST lifecycle: preparation with runbooks, logging and exercises; detection and analysis to scope affected identities, systems and data while preserving evidence; containment by isolating hosts and disabling compromised credentials and sessions; eradication by removing persistence like new users, keys or scheduled functions, fixing the root cause and rotating everything that may be exposed; recovery by rebuilding from known-good images and verified backups with heightened monitoring; then a blameless postmortem, new detections, and any legal notifications such as GDPR's 72-hour rule."

---

## 5. Model replay attacks, confused deputy issues, and privilege boundaries

**In one sentence:** a **replay attack** re-sends a valid captured message (token, signed request, payment) to repeat its effect — stopped with **nonces, timestamps, one-time tokens and audience binding**; a **confused deputy** is a **privileged** component tricked into misusing its authority for a less-privileged caller — stopped by making it act with the **caller's** authority and checking **who asked**; **privilege boundaries** are the lines where those checks must happen.

### In plain words
- Replay: photocopying a signed cheque and cashing it twice. The bank stops it by giving every cheque a number and refusing duplicates.
- Confused deputy: a valet with keys to every car in the garage is asked by a stranger "please bring me the red Ferrari" — and does it, because the valet *can*. The valet must check that **the person asking** owns that car.

### How it works
**Replay defences**
| Message | Defence |
|---|---|
| signed API request / webhook | timestamp within a window **+** nonce stored for that window ([HMAC webhooks](./Cryptography-and-Data-Protection.md#4-hmac-digital-signatures-and-authenticated-encryption)) |
| bearer tokens | short expiry, `aud` binding to one service, `jti` for one-time tokens, **sender-constrained** tokens (DPoP, mTLS-bound) |
| login / auth flows | `state`, `nonce`, PKCE, single-use authorization codes |
| payments / commands | idempotency keys + unique business IDs |
| TLS 0-RTT data | only idempotent requests |

**Confused deputy**
- Classic case: a compiler service with write access to billing files, writing output wherever the caller names. Cloud cases: a SaaS that assumes a role in **your** AWS account — fixed with an **external ID** in the role's trust policy; a service with a broad role fetching any S3 URL a user provides (SSRF-style); an **LLM agent** with admin tools acting on injected instructions ([LLM security](./LLM-and-Agent-Security.md#6-tool-permission-boundaries-allowlists-and-human-approval-for-writes)).
- Defences: **act on behalf of the caller** (pass and check the caller's identity — token exchange / on-behalf-of tokens), **capability-style** references (pre-signed URLs or object handles instead of raw paths), check **resource ownership** against the original caller, AWS `aws:SourceArn`/`aws:SourceAccount` conditions, external IDs for cross-account roles.

**Privilege boundaries** — where trust changes: user → API, service → service, tenant → tenant, app → OS/container, sandbox → host, agent → tools, CI → production. At each one: authenticate, authorize with the **least** privilege, validate inputs, and log.

### Interview answer
"For replay I bind every signed message or token to a short time window plus a nonce I remember for that window, keep tokens short-lived and audience-bound — ideally sender-constrained with DPoP or mTLS — use single-use codes with state, nonce and PKCE in auth flows, and idempotency keys for payments. A confused deputy is a privileged service tricked into using its own authority for a caller, so the deputy must act with the original caller's identity — on-behalf-of tokens, ownership checks, capability-style pre-signed references, and external IDs or source-ARN conditions for cross-account roles. I identify every privilege boundary — user to API, service to service, tenant to tenant, agent to tools, CI to production — and authenticate, authorize, validate and log there."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Security logging | auth, authz denials, privilege/config changes, admin, exports, cloud/K8s audit, network, EDR; no secrets |
| Centralization | SIEM in a separate security account; detection rules; retention policy |
| Tamper evidence | append-only, separate delete rights, WORM (Object Lock), hash chain + signed head |
| Multi-tenancy | tenant from verified identity; tenant-scoped repos + RLS; scoped caches, storage, indexes, queues, logs; per-tenant keys |
| Isolation models | pool (tenant_id + RLS) → bridge (schema/DB per tenant) → silo (cell/account per tenant) |
| Trade-offs | risk → control → cost → how to soften → how to tighten; adaptive MFA, local JWT validation, embedded policies |
| Incident lifecycle | prepare → detect & analyze (scope, evidence) → contain → eradicate (persistence, root cause, rotate) → recover (rebuild, monitor) → lessons + notifications (GDPR 72 h) |
| Replay | timestamp window + nonce; short, audience-bound, sender-constrained tokens; single-use codes; idempotency keys |
| Confused deputy | act with the caller's authority; ownership checks; capabilities; external ID / SourceArn |
| Privilege boundaries | user↔API, service↔service, tenant↔tenant, app↔OS, sandbox↔host, agent↔tools, CI↔prod: authN, authZ, validate, log |
