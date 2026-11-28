# Core Security Principles — CIA, Defense in Depth, Secure SDLC, Risk and Threat Modeling

> **What you'll learn:** the vocabulary every security discussion builds on: the **CIA triad**, **defense in depth**, **least privilege** and **secure defaults**; how security fits into the **software development lifecycle** (reviews, testing, **responsible disclosure**); the difference between **security requirements, controls and residual risk**; and how to **threat-model** a design with **STRIDE**, **trust boundaries** and **attack surfaces**.
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
