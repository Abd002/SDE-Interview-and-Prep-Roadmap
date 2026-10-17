# Security Operations and Design Interviews — Logging, Multi-Tenancy, Trade-offs, Incident Response, Replay and Confused Deputies

> **What you'll learn:** how to run **centralized security logging** with **tamper-evident audit trails**, how to **design multi-tenant data access** with real **tenant isolation**, how to **explain trade-offs** between usability, latency and security in a design interview, the **security incident lifecycle** (detection, containment, eradication, recovery), and how to model **replay attacks**, **confused-deputy** problems and **privilege boundaries**. Each part has a runnable C++ example.
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

#### Modern C++ example — a hash-chained audit log that detects edits and deletions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

// TOY 64-bit hash for brevity; real systems use SHA-256 + a signature/HMAC over the chain head.
std::uint64_t h64(const std::string& s) { std::uint64_t h = 1469598103934665603ull; for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; } return h; }

struct Entry { int seq; std::string ts, actor, action, target, result; std::uint64_t prev, hash; };
std::string body(const Entry& e) { std::ostringstream o; o << e.seq << '|' << e.ts << '|' << e.actor << '|' << e.action << '|' << e.target << '|' << e.result << '|' << e.prev; return o.str(); }

class AuditLog {
public:
    void append(std::string ts, std::string actor, std::string action, std::string target, std::string result) {
        Entry e{static_cast<int>(entries.size()) + 1, ts, actor, action, target, result, entries.empty() ? 0 : entries.back().hash, 0};
        e.hash = h64(body(e));
        entries.push_back(e);
    }
    std::string verify() const {
        std::uint64_t prev = 0;
        for (std::size_t i = 0; i < entries.size(); ++i) {
            const Entry& e = entries[i];
            if (e.seq != static_cast<int>(i) + 1) return "BROKEN: sequence gap before entry " + std::to_string(e.seq) + " (deleted record?)";
            if (e.prev != prev) return "BROKEN: entry " + std::to_string(e.seq) + " doesn't link to the previous hash";
            if (h64(body(e)) != e.hash) return "BROKEN: entry " + std::to_string(e.seq) + " was modified";
            prev = e.hash;
        }
        return "intact (" + std::to_string(entries.size()) + " entries, head " + hex(prev) + ")";
    }
    static std::string hex(std::uint64_t v) { std::ostringstream o; o << std::hex << std::setw(16) << std::setfill('0') << v; return o.str(); }
    std::vector<Entry> entries;
};

int main() {
    AuditLog log;
    log.append("2026-10-12T14:00:03Z", "mona", "login", "console", "success+mfa");
    log.append("2026-10-12T14:02:11Z", "mona", "role.grant", "user:omar -> admin", "allowed");
    log.append("2026-10-12T14:05:40Z", "omar", "export", "customers.csv (52k rows)", "allowed");
    log.append("2026-10-12T14:06:02Z", "omar", "role.revoke", "user:omar", "allowed");
    std::cout << "original:        " << log.verify() << '\n';

    AuditLog edited = log;
    edited.entries[2].target = "customers.csv (12 rows)";               // attacker downplays the export
    std::cout << "edited record:   " << edited.verify() << '\n';

    AuditLog deleted = log;
    deleted.entries.erase(deleted.entries.begin() + 1);                 // attacker removes the grant
    std::cout << "deleted record:  " << deleted.verify() << '\n';
}
```

**Output:**
```text
original:        intact (4 entries, head 58d948aa94f3bd54)
edited record:   BROKEN: entry 3 was modified
deleted record:  BROKEN: sequence gap before entry 3 (deleted record?)
```

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

#### Modern C++ example — a tenant-scoped repository that can't forget the filter, and a cross-tenant attempt
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <vector>

struct Row { std::string tenant; int id; std::string data; };
struct Token { std::string user, tenant; };                       // already verified

class TenantContext {                                              // can only be built from a verified token
public:
    explicit TenantContext(const Token& t) : tenant_(t.tenant) {}
    const std::string& tenant() const { return tenant_; }
private:
    std::string tenant_;
};

class InvoiceRepository {
public:
    void insert(Row r) { rows_.push_back(std::move(r)); }
    // Every method REQUIRES a TenantContext: there is no "unscoped" query to forget.
    std::optional<Row> get(const TenantContext& ctx, int id) const {
        for (auto& r : rows_) if (r.id == id && r.tenant == ctx.tenant()) return r;          // like RLS: tenant filter always applied
        return std::nullopt;
    }
    std::vector<Row> list(const TenantContext& ctx) const {
        std::vector<Row> out;
        for (auto& r : rows_) if (r.tenant == ctx.tenant()) out.push_back(r);
        return out;
    }
private:
    std::vector<Row> rows_;
};

std::string cache_key(const TenantContext& ctx, const std::string& k) { return "tenant:" + ctx.tenant() + ":" + k; }

std::string handle_get(const InvoiceRepository& repo, const Token& tok, const std::string& tenant_in_path, int id) {
    if (tenant_in_path != tok.tenant) return "403 tenant mismatch (path says " + tenant_in_path + ", token says " + tok.tenant + ") -> security alert";
    TenantContext ctx(tok);
    auto r = repo.get(ctx, id);
    return r ? "200 " + r->data : "404";
}

int main() {
    InvoiceRepository repo;
    repo.insert({"acme", 1, "acme invoice #1"});
    repo.insert({"globex", 2, "globex invoice #2"});
    Token mona{"mona", "acme"};
    std::cout << handle_get(repo, mona, "acme", 1) << '\n'
              << handle_get(repo, mona, "acme", 2) << "  (id exists, but in another tenant)\n"
              << handle_get(repo, mona, "globex", 2) << '\n';
    TenantContext ctx(mona);
    std::cout << "list for acme: " << repo.list(ctx).size() << " row(s); cache key: " << cache_key(ctx, "invoice:1") << '\n';
}
```

**Output:**
```text
200 acme invoice #1
404  (id exists, but in another tenant)
403 tenant mismatch (path says globex, token says acme) -> security alert
list for acme: 1 row(s); cache key: tenant:acme:invoice:1
```

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

#### Modern C++ example — adaptive (risk-based) MFA: security where it matters, low friction elsewhere
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Login { std::string who; bool known_device, usual_country, impossible_travel, breached_password; std::string action; };

int risk(const Login& l) {
    int r = 0;
    if (!l.known_device) r += 30;
    if (!l.usual_country) r += 25;
    if (l.impossible_travel) r += 50;
    if (l.breached_password) r += 60;
    if (l.action == "change_payout_account" || l.action == "export_all_data") r += 40;      // sensitive action
    return r;
}

std::string decide(const Login& l) {
    int r = risk(l);
    if (r >= 90) return "block + notify user (risk " + std::to_string(r) + ")";
    if (r >= 30) return "step-up: passkey or TOTP (risk " + std::to_string(r) + ")";
    return "allow silently (risk " + std::to_string(r) + ")";
}

int main() {
    std::vector<Login> logins{
        {"mona", true, true, false, false, "view_orders"},
        {"mona", true, true, false, false, "change_payout_account"},
        {"mona", false, true, false, false, "view_orders"},
        {"mona", false, false, true, false, "view_orders"},
        {"omar", true, true, false, true, "view_orders"},
    };
    int prompts = 0;
    for (auto& l : logins) {
        std::string d = decide(l);
        prompts += d.rfind("step-up", 0) == 0;
        std::cout << l.who << " / " << l.action << " -> " << d << '\n';
    }
    std::cout << "MFA prompts: " << prompts << " of " << logins.size() << " requests (always-on MFA would prompt every time)\n";
}
```

**Output:**
```text
mona / view_orders -> allow silently (risk 0)
mona / change_payout_account -> step-up: passkey or TOTP (risk 40)
mona / view_orders -> step-up: passkey or TOTP (risk 30)
mona / view_orders -> block + notify user (risk 105)
omar / view_orders -> step-up: passkey or TOTP (risk 60)
MFA prompts: 3 of 5 requests (always-on MFA would prompt every time)
```

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

#### Modern C++ example — a compromised-key incident walked through the phases, with persistence found during eradication
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct CloudEvent { std::string time, key, action, detail; };

int main() {
    std::vector<CloudEvent> trail{
        {"02:10", "AKIA-CI-01", "ListBuckets", "from 203.0.113.50 (unusual ASN)"},
        {"02:12", "AKIA-CI-01", "GetObject", "customers-prod/export.csv"},
        {"02:15", "AKIA-CI-01", "CreateUser", "svc-backup2"},
        {"02:16", "AKIA-CI-01", "CreateAccessKey", "svc-backup2"},
        {"02:20", "AKIA-CI-01", "CreateFunction", "metrics-sync (runs hourly)"},
        {"02:40", "AKIA-APP-07", "GetItem", "orders table (normal traffic)"},
    };
    const std::string compromised = "AKIA-CI-01";
    std::cout << "DETECTION: GuardDuty alert - key " << compromised << " used from an unusual network at 02:10\n";
    std::cout << "ANALYSIS (scope from the audit trail):\n";
    std::set<std::string> persistence;
    for (auto& e : trail) if (e.key == compromised) {
        std::cout << "  " << e.time << ' ' << e.action << ' ' << e.detail << '\n';
        if (e.action == "CreateUser" || e.action == "CreateAccessKey" || e.action == "CreateFunction") persistence.insert(e.action + ":" + e.detail);
    }
    std::cout << "  data touched: customers-prod/export.csv -> personal data, start the 72-hour GDPR clock\n";
    std::cout << "CONTAINMENT: deactivate " << compromised << ", revoke its sessions, snapshot affected resources for evidence\n";
    std::cout << "ERADICATION: remove " << persistence.size() << " persistence item(s):\n";
    for (auto& p : persistence) std::cout << "  - " << p << '\n';
    std::cout << "  root cause: long-lived CI key in a public build log -> replace with OIDC federation (no static key)\n";
    std::cout << "RECOVERY: redeploy CI from a clean template, rotate all secrets the CI could read, watch for re-entry 30 days\n";
    std::cout << "LESSONS: alert on CreateUser/CreateAccessKey outside IaC; mask CI logs; postmortem with owners\n";
}
```

**Output:**
```text
DETECTION: GuardDuty alert - key AKIA-CI-01 used from an unusual network at 02:10
ANALYSIS (scope from the audit trail):
  02:10 ListBuckets from 203.0.113.50 (unusual ASN)
  02:12 GetObject customers-prod/export.csv
  02:15 CreateUser svc-backup2
  02:16 CreateAccessKey svc-backup2
  02:20 CreateFunction metrics-sync (runs hourly)
  data touched: customers-prod/export.csv -> personal data, start the 72-hour GDPR clock
CONTAINMENT: deactivate AKIA-CI-01, revoke its sessions, snapshot affected resources for evidence
ERADICATION: remove 3 persistence item(s):
  - CreateAccessKey:svc-backup2
  - CreateFunction:metrics-sync (runs hourly)
  - CreateUser:svc-backup2
  root cause: long-lived CI key in a public build log -> replace with OIDC federation (no static key)
RECOVERY: redeploy CI from a clean template, rotate all secrets the CI could read, watch for re-entry 30 days
LESSONS: alert on CreateUser/CreateAccessKey outside IaC; mask CI logs; postmortem with owners
```

Deactivating the leaked key alone would have left the attacker **two** other ways back in (the new user's key and the hourly function).

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

#### Modern C++ example — nonce + timestamp replay protection, and a confused-deputy fix by checking the original caller
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

class ReplayGuard {
public:
    std::string accept(const std::string& nonce, long ts, long now) {
        if (now - ts > 300 || ts - now > 30) return "reject: outside the 5-minute window";
        for (auto it = seen_.begin(); it != seen_.end();) it = (now - it->second > 300) ? seen_.erase(it) : std::next(it);   // forget old nonces
        if (!seen_.emplace(nonce, ts).second) return "reject: nonce already used (replay)";
        return "accept";
    }
private:
    std::map<std::string, long> seen_;
};

// A report service has read access to ALL tenants' buckets (the "deputy").
const std::map<std::string, std::string> owner_of{{"acme/q3.pdf", "acme"}, {"globex/payroll.pdf", "globex"}};

std::string export_report_confused(const std::string& /*caller_tenant*/, const std::string& path) {
    return owner_of.count(path) ? "exported " + path : "not found";                 // uses ITS OWN authority
}
std::string export_report_fixed(const std::string& caller_tenant, const std::string& path) {
    auto it = owner_of.find(path);
    if (it == owner_of.end() || it->second != caller_tenant) return "404 not found";  // authority of the ORIGINAL caller
    return "exported " + path;
}

int main() {
    ReplayGuard g;
    long now = 1'760'000'000;
    std::cout << "first transfer request:   " << g.accept("n-81f3", now - 2, now) << '\n'
              << "captured and replayed:    " << g.accept("n-81f3", now - 2, now + 10) << '\n'
              << "old request, new nonce:   " << g.accept("n-0001", now - 3600, now) << '\n';

    std::cout << "confused deputy: acme asks for globex/payroll.pdf -> " << export_report_confused("acme", "globex/payroll.pdf") << '\n'
              << "fixed deputy:    acme asks for globex/payroll.pdf -> " << export_report_fixed("acme", "globex/payroll.pdf") << '\n'
              << "fixed deputy:    acme asks for acme/q3.pdf        -> " << export_report_fixed("acme", "acme/q3.pdf") << '\n';
}
```

**Output:**
```text
first transfer request:   accept
captured and replayed:    reject: nonce already used (replay)
old request, new nonce:   reject: outside the 5-minute window
confused deputy: acme asks for globex/payroll.pdf -> exported globex/payroll.pdf
fixed deputy:    acme asks for globex/payroll.pdf -> 404 not found
fixed deputy:    acme asks for acme/q3.pdf        -> exported acme/q3.pdf
```

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
