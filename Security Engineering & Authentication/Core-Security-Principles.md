# Core Security Principles — CIA, Defense in Depth, Secure SDLC, Risk and Threat Modeling

> **What you'll learn:** the vocabulary every security discussion builds on: the **CIA triad**, **defense in depth**, **least privilege** and **secure defaults**; how security fits into the **software development lifecycle** (reviews, testing, **responsible disclosure**); the difference between **security requirements, controls and residual risk**; and how to **threat-model** a design with **STRIDE**, **trust boundaries** and **attack surfaces**. Each part has a runnable C++ example.
>
> **Prerequisites:** none — this is the starting point for the security guides. Next: [Application and API Security](./Application-and-API-Security.md).

## Table of Contents
1. [CIA triad, defense in depth, least privilege, and secure defaults](#1-cia-triad-defense-in-depth-least-privilege-and-secure-defaults)
2. [Secure SDLC, security reviews, and responsible vulnerability disclosure](#2-secure-sdlc-security-reviews-and-responsible-vulnerability-disclosure)
3. [Security requirements vs. security controls vs. residual risk](#3-security-requirements-vs-security-controls-vs-residual-risk)
4. [Threat modeling (STRIDE), trust boundaries, and attack surfaces](#4-threat-modeling-stride-trust-boundaries-and-attack-surfaces)
5. [Cheat sheet](#cheat-sheet)

---

## 1. CIA triad, defense in depth, least privilege, and secure defaults

**In one sentence:** security protects **Confidentiality** (only the right people can read), **Integrity** (data isn't changed without permission) and **Availability** (it works when needed), using **several independent layers** (defense in depth), giving every user and component **only the permissions it needs** (least privilege), and making the **safe option the default**.

### In plain words
A bank: the vault is locked (confidentiality), the ledger can't be secretly edited (integrity), and the bank opens every morning (availability). It has guards, cameras, a vault door **and** a time lock — if one fails, the others still stand (defense in depth). Cashiers can open their drawer but not the vault (least privilege). New doors come locked (secure default).

### How it works
| Principle | Meaning | Example |
|---|---|---|
| **Confidentiality** | prevent unauthorized reading | encryption, access control, data minimization |
| **Integrity** | prevent unauthorized or accidental change | hashes/MACs/signatures, audit logs, input validation |
| **Availability** | stay usable | redundancy, rate limiting, DDoS protection, backups |
| **Defense in depth** | several independent layers | WAF + input validation + parameterized queries + least-privilege DB user + monitoring |
| **Least privilege** | minimum access, for the minimum time | read-only DB user for reports; short-lived credentials; no admin by default |
| **Secure defaults** | the default configuration is safe | deny-by-default firewall, TLS on, debug off, strong password policy |
| **Fail securely** | errors deny, not allow | auth service down → reject, don't let everyone in |
| **Separation of duties** | no one person can do everything | the person who writes a payment can't also approve it |
| **Keep it simple / minimize attack surface** | less code and fewer features exposed = fewer bugs | disable unused endpoints and ports |

Related ideas: **AAA** (authentication, authorization, accounting/auditing), **non-repudiation** (you can prove who did something — signatures, audit trails).

#### Modern C++ example — deny-by-default, least-privilege permissions, fail-closed, and layered checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <set>
#include <string>

enum class Perm { ReadReports, WriteOrders, RefundPayments, ManageUsers };

struct Role { std::set<Perm> perms; };                         // least privilege: only what the job needs
const std::map<std::string, Role> roles{
    {"analyst", {{Perm::ReadReports}}},
    {"support", {{Perm::ReadReports, Perm::WriteOrders}}},
    {"finance", {{Perm::ReadReports, Perm::RefundPayments}}},
};

class AuthService {                                            // may be unavailable
public:
    bool up = true;
    std::optional<std::string> role_of(const std::string& user) const {
        if (!up) return std::nullopt;
        static const std::map<std::string, std::string> users{{"mona", "analyst"}, {"omar", "support"}, {"lina", "finance"}};
        auto it = users.find(user);
        if (it == users.end()) return std::nullopt;
        return it->second;
    }
};

bool allowed(const AuthService& auth, const std::string& user, Perm p, long amount_cents = 0) {
    auto role = auth.role_of(user);
    if (!role) return false;                                   // fail closed: unknown user or auth down -> deny
    auto it = roles.find(*role);
    if (it == roles.end() || !it->second.perms.count(p)) return false;   // deny by default
    if (p == Perm::RefundPayments && amount_cents > 1000'00) return false; // second layer: business limit
    return true;
}

int main() {
    AuthService auth;
    std::cout << std::boolalpha
              << "mona reads reports:     " << allowed(auth, "mona", Perm::ReadReports) << '\n'
              << "mona refunds payments:  " << allowed(auth, "mona", Perm::RefundPayments, 50'00) << '\n'
              << "lina refunds 500:       " << allowed(auth, "lina", Perm::RefundPayments, 500'00) << '\n'
              << "lina refunds 5000:      " << allowed(auth, "lina", Perm::RefundPayments, 5000'00) << "  (needs a second approver)\n"
              << "nobody manages users:   " << allowed(auth, "omar", Perm::ManageUsers) << "  (no role has it by default)\n";
    auth.up = false;
    std::cout << "auth service down, mona reads: " << allowed(auth, "mona", Perm::ReadReports) << "  (fail closed)\n";
}
```

**Output:**
```text
mona reads reports:     true
mona refunds payments:  false
lina refunds 500:       true
lina refunds 5000:      false  (needs a second approver)
nobody manages users:   false  (no role has it by default)
auth service down, mona reads: false  (fail closed)
```

### Interview answer
"Security protects confidentiality, integrity and availability. I design with defense in depth — several independent controls so one failure isn't a breach — and least privilege, giving users, services and credentials only the access they need for as long as they need it. Defaults must be safe: deny by default, TLS on, debug off, and on errors the system fails closed. Separation of duties and a small attack surface reduce the damage any single mistake or account can do."

---

## 2. Secure SDLC, security reviews, and responsible vulnerability disclosure

**In one sentence:** a **secure SDLC** builds security into **every phase** — requirements, design (threat modeling), coding (secure patterns, reviews), testing (SAST/DAST/SCA, pentests), release and operations — and a **responsible disclosure** process lets outsiders report vulnerabilities safely so you can fix them before they're exploited.

### In plain words
It's cheaper to put the fire exits in the building plans than to knock holes in finished walls. And if a visitor notices a broken fire door, there should be a clear, friendly way to tell the owner — not a reason to threaten them.

### How it works
| Phase | Security activities |
|---|---|
| **Requirements** | security and privacy requirements, compliance (GDPR, PCI DSS, HIPAA), abuse cases |
| **Design** | threat modeling ([section 4](#4-threat-modeling-stride-trust-boundaries-and-attack-surfaces)), security design review for risky changes |
| **Implementation** | secure coding standards, vetted libraries (never home-made crypto), secrets out of code, code review with a security checklist |
| **Verification** | SAST, SCA/dependency scanning, secret scanning, DAST, fuzzing, pentests for major releases ([CI gates](./Infrastructure-Cloud-and-Supply-Chain-Security.md#5-sast-vs-dast-vs-sca-ci-security-gates)) |
| **Release** | hardened configs, signed artifacts, SBOM, minimal images |
| **Operations** | monitoring, patching SLAs (e.g. critical in 7 days), incident response, periodic access reviews |

Frameworks: **OWASP SAMM**, **Microsoft SDL**, **NIST SSDF (SP 800-218)**, BSIMM.

**Security review checklist (lightweight):** what data does this touch and how sensitive is it? New endpoints and who can call them? AuthN/AuthZ on every path? Input validation and output encoding? Secrets handling? Logging (without secrets)? Third-party dependencies? Failure modes?

**Responsible / coordinated disclosure**
- Publish a **security policy** (`SECURITY.md`, `/.well-known/security.txt` per RFC 9116) with a contact and scope; promise **safe harbor** for good-faith research.
- Acknowledge quickly (e.g. 2 business days), triage severity (**CVSS**), fix, then disclose publicly together with the reporter — commonly within **90 days**. Get a **CVE** for issues in released software. Optionally run a **bug bounty** (HackerOne, Bugcrowd).

#### Modern C++ example — a tiny vulnerability intake that triages by CVSS-like severity and tracks the fix deadline
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Report { std::string id, title; double cvss; int reported_day; int fixed_day; };   // fixed_day = -1 if open

std::string band(double s) { return s >= 9 ? "critical" : s >= 7 ? "high" : s >= 4 ? "medium" : "low"; }
int sla_days(double s) { return s >= 9 ? 7 : s >= 7 ? 30 : s >= 4 ? 90 : 180; }     // patching policy

int main() {
    const int today = 40;
    std::vector<Report> reports{
        {"VULN-1", "IDOR on /invoices/{id}", 8.1, 10, 25},
        {"VULN-2", "Stored XSS in profile bio", 6.1, 12, -1},
        {"VULN-3", "Auth bypass via reset token reuse", 9.8, 30, -1},
        {"VULN-4", "Verbose error leaks stack trace", 3.1, 5, -1},
    };
    for (auto& r : reports) {
        int deadline = r.reported_day + sla_days(r.cvss);
        std::string status = r.fixed_day >= 0 ? (r.fixed_day <= deadline ? "fixed within SLA" : "fixed LATE")
                                              : (today > deadline ? "OVERDUE - escalate" : "open, " + std::to_string(deadline - today) + " days left");
        std::cout << r.id << " [" << band(r.cvss) << ' ' << r.cvss << "] " << r.title << " -> " << status << '\n';
    }
    std::cout << "reporters are thanked and credited in the advisory once fixes ship\n";
}
```

**Output:**
```text
VULN-1 [high 8.1] IDOR on /invoices/{id} -> fixed within SLA
VULN-2 [medium 6.1] Stored XSS in profile bio -> open, 62 days left
VULN-3 [critical 9.8] Auth bypass via reset token reuse -> OVERDUE - escalate
VULN-4 [low 3.1] Verbose error leaks stack trace -> open, 145 days left
reporters are thanked and credited in the advisory once fixes ship
```

### Interview answer
"A secure SDLC puts security into every phase: security requirements and abuse cases, threat modeling in design, secure coding standards and reviews, automated SAST, SCA and secret scanning plus DAST and pentests in verification, signed minimal artifacts at release, and patching SLAs and monitoring in operations — frameworks like OWASP SAMM or NIST SSDF structure it. For outside reports I publish a security.txt with safe harbor, acknowledge fast, triage with CVSS, fix within SLA and disclose in coordination with the reporter, typically within 90 days."

---

## 3. Security requirements vs. security controls vs. residual risk

**In one sentence:** a **security requirement** states **what must be true** ("only the account owner can view their invoices"), a **security control** is **how** you achieve it (authorization check, encryption, MFA, monitoring), and **residual risk** is what's **left after the controls**, which the business must **accept, reduce further, transfer or avoid**.

### In plain words
Requirement: "the house must not be easy to burgle". Controls: locks, an alarm, a dog. Residual risk: a determined burglar with tools could still get in — so you also buy insurance (transfer) and keep valuables in a bank (avoid).

### How it works
- **Requirements** come from threats, laws/contracts (GDPR, PCI DSS) and business needs; they should be **testable** ("passwords hashed with Argon2id", "all admin actions audited", "sessions expire after 30 min idle"). Catalogue: **OWASP ASVS**.
- **Control types**
  - **Preventive** (stop it): authorization, input validation, encryption, MFA.
  - **Detective** (notice it): logs, alerts, anomaly detection, integrity monitoring.
  - **Corrective / recovery** (fix it): backups, incident response, key rotation.
  - **Deterrent / compensating**: warnings, legal terms; an alternative control when the ideal isn't possible.
- **Risk** ≈ **likelihood × impact**. **Inherent** risk (before controls) → controls → **residual** risk.
- **Risk treatment:** **mitigate** (more controls), **accept** (documented, by an owner with authority, with an expiry date), **transfer** (insurance, a vendor with an SLA), **avoid** (don't build/collect it).
- Keep a **risk register**: risk, owner, controls, residual rating, decision, review date.

#### Modern C++ example — a risk register computing residual risk after controls and the treatment decision
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Control { std::string name; double reduces_likelihood; };          // fraction removed, 0..1
struct Risk { std::string requirement, threat; double likelihood, impact; std::vector<Control> controls; };

int main() {
    std::vector<Risk> register_{
        {"only owners can read invoices", "IDOR: user changes invoice id", 0.6, 9,
         {{"object-level authz check", 0.9}, {"unguessable IDs", 0.5}, {"anomaly alert on enumeration", 0.3}}},
        {"accounts resist takeover", "credential stuffing", 0.8, 8,
         {{"MFA", 0.9}, {"rate limiting + breached-password check", 0.5}}},
        {"service stays available", "volumetric DDoS", 0.3, 6, {{"CDN / DDoS protection", 0.8}}},
        {"no card data leaks", "storing card numbers", 0.5, 10, {}},
    };
    const double accept_threshold = 0.5;
    std::cout << std::fixed << std::setprecision(2);
    for (auto& r : register_) {
        double inherent = r.likelihood * r.impact, l = r.likelihood;
        for (auto& c : r.controls) l *= (1 - c.reduces_likelihood);           // layered controls
        double residual = l * r.impact;
        std::string decision = r.controls.empty() ? "AVOID: don't store card numbers, use the payment provider's tokens"
                             : residual <= accept_threshold ? "accept (owner signs off, review in 6 months)"
                                                            : "mitigate further";
        std::cout << r.requirement << "\n  threat: " << r.threat << " | inherent " << inherent << " -> residual " << residual << " -> " << decision << '\n';
    }
}
```

**Output:**
```text
only owners can read invoices
  threat: IDOR: user changes invoice id | inherent 5.40 -> residual 0.19 -> accept (owner signs off, review in 6 months)
accounts resist takeover
  threat: credential stuffing | inherent 6.40 -> residual 0.32 -> accept (owner signs off, review in 6 months)
service stays available
  threat: volumetric DDoS | inherent 1.80 -> residual 0.36 -> accept (owner signs off, review in 6 months)
no card data leaks
  threat: storing card numbers | inherent 5.00 -> residual 5.00 -> AVOID: don't store card numbers, use the payment provider's tokens
```

### Interview answer
"A security requirement says what must hold, ideally testable — 'only the owner can read an invoice'. Controls are how we meet it: preventive like an object-level authorization check, detective like an enumeration alert, and corrective like incident response. Whatever risk remains after controls is residual risk, and someone with authority must decide to mitigate further, accept it with a review date, transfer it, or avoid it — for example not storing card numbers at all. I track this in a risk register."

---

## 4. Threat modeling (STRIDE), trust boundaries, and attack surfaces

**In one sentence:** **threat modeling** asks four questions — *what are we building, what can go wrong, what are we going to do about it, did we do a good job?* — by drawing a **data-flow diagram**, marking **trust boundaries** (where data crosses from less to more trusted zones), listing the **attack surface** (every entry point), and walking each element through **STRIDE**.

### In plain words
Before moving into a new house, you walk around it: every door and window (attack surface), where the garden meets the street (trust boundary), and for each you ask "how could someone get in, damage something or spy on us?"

### How it works
**STRIDE** (Microsoft) — one threat category per security property:
| Threat | Violates | Example | Typical control |
|---|---|---|---|
| **S**poofing | authentication | stolen session cookie, fake service | MFA, mTLS, signed tokens |
| **T**ampering | integrity | changing a price in the request, editing a file | server-side validation, MACs/signatures, integrity checks |
| **R**epudiation | non-repudiation | "I never made that transfer" | tamper-evident audit logs |
| **I**nformation disclosure | confidentiality | IDOR, verbose errors, unencrypted backups | authz checks, encryption, minimization |
| **D**enial of service | availability | huge uploads, expensive queries, floods | rate limits, quotas, timeouts, size limits |
| **E**levation of privilege | authorization | user → admin via mass assignment | least privilege, authorization on every action |

**Steps**
1. **Diagram** the system: external entities (users, partners), processes (services), data stores, data flows.
2. Mark **trust boundaries**: internet → edge, edge → internal services, service → database, your code → third-party API, user content → LLM, tenant A ↔ tenant B.
3. List the **attack surface**: endpoints, ports, file uploads, webhooks, message consumers, admin panels, CI/CD, cloud consoles, dependencies.
4. For each element / flow **crossing a boundary**, apply STRIDE; write threats with **mitigations** and owners.
5. Rate and prioritize (likelihood × impact, DREAD, CVSS), track mitigations, and **revisit** when the design changes.

Tools: OWASP Threat Dragon, Microsoft Threat Modeling Tool, pytm, plain whiteboards. Other methods: PASTA, LINDDUN (privacy), attack trees.

#### Modern C++ example — a data-flow model that finds boundary-crossing flows and generates STRIDE questions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Element { std::string name; int zone; };            // 0 = internet, 1 = DMZ/edge, 2 = internal, 3 = data
struct Flow { std::string from, to, data; };

int main() {
    std::map<std::string, Element> el{
        {"browser", {"browser", 0}}, {"partner", {"partner webhook", 0}},
        {"api", {"API gateway", 1}}, {"orders", {"orders service", 2}},
        {"db", {"orders DB", 3}}, {"payments", {"payment provider", 0}},
    };
    std::vector<Flow> flows{
        {"browser", "api", "login + order JSON"},
        {"partner", "api", "shipment webhook"},
        {"api", "orders", "authenticated request"},
        {"orders", "db", "SQL"},
        {"orders", "payments", "charge request"},
        {"orders", "orders", "in-memory call"},
    };
    const char* stride[] = {"Spoofing: is the caller authenticated?",
                            "Tampering: is the payload validated / integrity-protected?",
                            "Repudiation: is the action audited?",
                            "Information disclosure: is it encrypted and minimized?",
                            "Denial of service: size limits, rate limits, timeouts?",
                            "Elevation of privilege: is every action authorized?"};
    int crossings = 0;
    for (auto& f : flows) {
        int a = el[f.from].zone, b = el[f.to].zone;
        if (a == b) continue;                                     // same trust zone: lower priority
        std::cout << "BOUNDARY " << el[f.from].name << " -> " << el[f.to].name << " (" << f.data << ")\n";
        ++crossings;
    }
    std::cout << "ask for EACH crossing:\n";
    for (auto* q : stride) std::cout << "    " << q << '\n';
    std::cout << crossings * 6 << " STRIDE questions to answer, each with a mitigation and an owner\n";
}
```

**Output:**
```text
BOUNDARY browser -> API gateway (login + order JSON)
BOUNDARY partner webhook -> API gateway (shipment webhook)
BOUNDARY API gateway -> orders service (authenticated request)
BOUNDARY orders service -> orders DB (SQL)
BOUNDARY orders service -> payment provider (charge request)
ask for EACH crossing:
    Spoofing: is the caller authenticated?
    Tampering: is the payload validated / integrity-protected?
    Repudiation: is the action audited?
    Information disclosure: is it encrypted and minimized?
    Denial of service: size limits, rate limits, timeouts?
    Elevation of privilege: is every action authorized?
30 STRIDE questions to answer, each with a mitigation and an owner
```

For the partner webhook, for example, the answers become concrete mitigations: verify an **HMAC signature** on every webhook (spoofing/tampering — see [HMAC](./Cryptography-and-Data-Protection.md#4-hmac-digital-signatures-and-authenticated-encryption)), reject old timestamps (replay), cap body size (DoS), and log each delivery (repudiation).

### Interview answer
"I threat-model by drawing a data-flow diagram, marking trust boundaries — internet to edge, service to database, our code to third parties, tenant to tenant — and listing the attack surface. For every flow that crosses a boundary I walk STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege, and write a mitigation with an owner for each real threat. I prioritize by likelihood and impact and revisit the model whenever the design changes."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| CIA | confidentiality, integrity, availability (+ AAA, non-repudiation) |
| Defense in depth | several independent layers; no single control is trusted alone |
| Least privilege | minimum access, minimum time; short-lived credentials |
| Secure defaults / fail closed | deny by default; errors deny access |
| Secure SDLC | requirements → threat model → secure code + review → SAST/SCA/DAST/pentest → signed release → patch + monitor |
| Disclosure | security.txt + safe harbor; acknowledge fast; CVSS triage; fix SLA; coordinated (≈ 90 days); CVE |
| Requirement / control / residual | what must hold / how / what's left |
| Control types | preventive, detective, corrective, compensating |
| Treatment | mitigate, accept (owner + expiry), transfer, avoid |
| Threat modeling | DFD → trust boundaries → attack surface → STRIDE per crossing flow → mitigations → revisit |
| STRIDE | Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation of privilege |
