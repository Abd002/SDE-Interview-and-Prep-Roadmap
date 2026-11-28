# Infrastructure, Cloud, and Supply-Chain Security — Containers, Kubernetes, IAM, Zero Trust, Dependencies, CI Gates and Secrets

> **What you'll learn:** how to harden **containers and Kubernetes** (security contexts, RBAC, network policies), manage **dependency vulnerabilities** with **SBOMs** and defend against **supply-chain attacks**, design **least-privilege IAM** and spot **privilege-escalation** paths, build **segmented, zero-trust** networks with **private access**, choose between **SAST, DAST and SCA** and wire them into **CI security gates**, and **prevent secrets leaks** and **rotate credentials** after an incident. Each part has config snippets.
>
> **Prerequisites:** [Core Security Principles](./Core-Security-Principles.md), [Service-to-service authentication](./Authentication-and-Authorization.md#6-service-to-service-authentication-and-workload-identities).

## Table of Contents
1. [Container/Kubernetes security contexts, RBAC, and network policies](#1-containerkubernetes-security-contexts-rbac-and-network-policies)
2. [Dependency vulnerabilities, SBOMs, and software supply-chain attacks](#2-dependency-vulnerabilities-sboms-and-software-supply-chain-attacks)
3. [IAM least privilege and privilege escalation risks](#3-iam-least-privilege-and-privilege-escalation-risks)
4. [Network segmentation, zero-trust architecture, and private access](#4-network-segmentation-zero-trust-architecture-and-private-access)
5. [SAST vs. DAST vs. SCA; CI security gates](#5-sast-vs-dast-vs-sca-ci-security-gates)
6. [Secrets leakage prevention and incident credential rotation](#6-secrets-leakage-prevention-and-incident-credential-rotation)
7. [Cheat sheet](#cheat-sheet)

---

## 1. Container/Kubernetes security contexts, RBAC, and network policies

**In one sentence:** run containers as **non-root**, with a **read-only filesystem**, **no extra Linux capabilities**, **no privilege escalation** and a **seccomp** profile; give each workload a **minimal Kubernetes RBAC** role and service account; and use **NetworkPolicies** so pods can only talk to what they need.

### In plain words
Each container is a hotel room. Don't give guests the master key (root), don't let them knock down walls (capabilities), bolt the furniture down (read-only filesystem), and only let them use the corridors to the rooms they need (network policies).

### How it works
**Container image hygiene:** minimal base images (distroless, Alpine, `scratch`), no secrets in layers, pinned digests (`image@sha256:…`), image scanning (Trivy, Grype), signed images (cosign) verified at admission.

**Pod security context**
```yaml
apiVersion: v1
kind: Pod
metadata: { name: api }
spec:
  serviceAccountName: api                 # its own SA, not "default"
  automountServiceAccountToken: false     # only if it doesn't call the K8s API
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    seccompProfile: { type: RuntimeDefault }
  containers:
    - name: api
      image: registry.example.com/api@sha256:3f1c…   # pinned digest
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        privileged: false
        capabilities: { drop: ["ALL"] }
      resources: { limits: { cpu: "500m", memory: "256Mi" } }
```
- Enforce with **Pod Security Admission** (`restricted` profile) or policy engines (**Kyverno**, **OPA Gatekeeper**); never mount the host Docker socket or `hostPath: /`; avoid `hostNetwork`/`hostPID`.
- **RBAC:** `Role`/`RoleBinding` scoped to a namespace with specific verbs and resources; avoid `cluster-admin`, wildcards (`*`) and verbs like `escalate`, `bind`, `impersonate`, and `create pods` (which can run privileged pods) for app service accounts.
- **NetworkPolicies:** start with **default deny** per namespace, then allow specific flows (requires a CNI that enforces them — Calico, Cilium).
```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata: { name: payments-allow-checkout, namespace: payments }
spec:
  podSelector: { matchLabels: { app: payments } }
  policyTypes: [Ingress]
  ingress:
    - from: [{ namespaceSelector: { matchLabels: { name: checkout } } }]
      ports: [{ protocol: TCP, port: 8443 }]
```
- Also: secrets via external secret stores (not plain `Secret` env vars where avoidable), etcd encryption, audit logging, runtime detection (Falco), keeping nodes and the control plane patched.

### Interview answer
"I harden containers with minimal, digest-pinned, scanned and signed images, running as non-root with a read-only root filesystem, all capabilities dropped, no privilege escalation and the RuntimeDefault seccomp profile, enforced by Pod Security Admission's restricted profile or Kyverno/Gatekeeper. Each workload gets its own service account with a namespaced least-privilege Role, avoiding wildcards, cluster-admin and pod-creation rights, and token automount is off when unneeded. Networking starts from default-deny NetworkPolicies with explicit allows, plus audit logs, etcd encryption and runtime detection like Falco."

---

## 2. Dependency vulnerabilities, SBOMs, and software supply-chain attacks

**In one sentence:** most of your code is **other people's code**, so track every dependency in an **SBOM**, scan it continuously against vulnerability databases (CVE/OSV/GHSA), **patch on an SLA**, and defend the **supply chain** — typosquatting, dependency confusion, compromised maintainers or build systems — with pinning, verified provenance (SLSA, Sigstore) and least-privilege CI.

### In plain words
A restaurant buys ingredients from many suppliers. It keeps an ingredient list for every dish (SBOM), checks food-safety recalls daily (vulnerability scanning), and only buys from verified suppliers with sealed packaging (signatures/provenance) — because one poisoned supplier can poison every dish.

### How it works
**Vulnerable dependencies**
- **SCA** tools (Dependabot, Renovate, Snyk, `osv-scanner`, Trivy, Grype, OWASP Dependency-Check) match your lockfile/SBOM against advisories; prioritize by **severity (CVSS)**, **exploitability (EPSS, CISA KEV list)** and **reachability** (is the vulnerable function actually used?).
- **Patch SLAs** (e.g. critical 7 days, high 30 days); automate PRs; keep dependencies current so upgrades stay small.
- Examples: **Log4Shell** (CVE-2021-44228), the **xz-utils backdoor** (CVE-2024-3094, a malicious maintainer), **event-stream** npm (2018), **SolarWinds** (build system compromise, 2020).

**SBOM (Software Bill of Materials):** machine-readable inventory of components, versions, licences and hashes — **SPDX** or **CycloneDX**; generated at build (Syft, `cdxgen`), stored with the artifact, used to answer "are we affected?" within minutes when a new CVE drops.

**Supply-chain attack types and defences**
| Attack | Defence |
|---|---|
| **Typosquatting** (`reqeusts`) | review new dependencies, allowlists, registry proxies |
| **Dependency confusion** (public package with an internal name) | scoped/namespaced packages, private registry configured to never fall back to public for internal names |
| **Compromised maintainer / malicious update** | lockfiles + pinned versions/hashes, delayed adoption, review diffs of critical deps, OpenSSF Scorecard |
| **Compromised build** | hermetic, ephemeral build runners; **SLSA** provenance; signed artifacts (**Sigstore/cosign**), verified at deploy |
| **Malicious CI action / plugin** | pin actions by commit SHA, least-privilege CI tokens, OIDC instead of static cloud keys |

### Interview answer
"I generate an SBOM in CycloneDX or SPDX for every build and scan it continuously with SCA tools against OSV and GitHub advisories, prioritizing by severity, known exploitation and reachability, with automated upgrade PRs and patch SLAs. For the supply chain I pin dependencies with lockfiles and hashes, guard against typosquatting and dependency confusion with scoped packages and a private registry, pin CI actions by SHA, build on hermetic ephemeral runners with SLSA provenance, and sign artifacts with Sigstore so deployment only accepts verified images."

---

## 3. IAM least privilege and privilege escalation risks

**In one sentence:** give every human and workload **only the actions on the resources they need**, preferably via **short-lived role credentials**, and watch for **escalation paths** — permissions like `iam:PassRole`, `iam:CreatePolicyVersion`, `iam:AttachUserPolicy`, `sts:AssumeRole` on powerful roles, or running code under a more privileged role — that let a limited identity make itself an admin.

### In plain words
A cleaner needs keys to the offices, not to the safe. But if the cleaner can also **make new keys** or **borrow the manager's key ring**, giving them "just office keys" is meaningless — they can turn themselves into the manager.

### How it works
**Least privilege in practice**
- Specific **actions** and **resources** (ARNs), not `"Action": "*"` / `"Resource": "*"`; **conditions** (source VPC, MFA present, tags, time).
- **Roles, not users with access keys**: humans via SSO + short sessions; workloads via instance profiles / IRSA / workload identity federation.
- Use **access analysis** to trim: AWS IAM Access Analyzer "unused access", GCP IAM Recommender; review regularly; remove dormant identities.
- Guardrails above accounts: **SCPs** (AWS Organizations), permission boundaries, separate accounts/projects per environment; **break-glass** admin accounts with alerts.

**Privilege escalation patterns (AWS names; other clouds have equivalents)**
| Permission | How it escalates |
|---|---|
| `iam:CreatePolicyVersion` / `iam:SetDefaultPolicyVersion` | rewrite your own policy to `*:*` |
| `iam:AttachUserPolicy` / `iam:PutUserPolicy` | attach AdministratorAccess to yourself |
| `iam:CreateAccessKey` on other users | become another user |
| `iam:PassRole` + `ec2:RunInstances` / `lambda:CreateFunction` | launch compute with a powerful role and use its credentials |
| `sts:AssumeRole` on an admin role with a loose trust policy | become admin |
| `iam:UpdateAssumeRolePolicy` | let yourself assume any role |
| CI/CD write access | change the pipeline that deploys with admin rights |

Tools: PMapper, Cloudsplaining, Prowler, ScoutSuite, Steampipe.

```json
{ "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::invoices-prod/reports/*",
    "Condition": { "StringEquals": { "aws:SourceVpce": "vpce-0abc123" } }
  }]}
```

### Interview answer
"Least privilege means specific actions on specific resources with conditions, granted to roles with short-lived credentials — SSO for humans, workload identity for services — and trimmed with access analyzers, with SCPs and permission boundaries as guardrails. I look for escalation paths, not just admin grants: rights to create policy versions or attach policies, create access keys for others, loose role trust policies, or PassRole combined with creating Lambdas or instances, which lets an identity run code as a more powerful role. Tools like PMapper or Cloudsplaining find these graph paths automatically."

---

## 4. Network segmentation, zero-trust architecture, and private access

**In one sentence:** **segment** networks so a breach in one zone can't freely reach others (VPCs/subnets, security groups, Kubernetes NetworkPolicies, microsegmentation), adopt **zero trust** — **never trust network location, always verify identity, device and context per request** — and expose internal apps through **identity-aware proxies / private access** instead of VPNs and public endpoints.

### In plain words
Old model: a castle with a moat — once you're over the bridge, you can walk into any room. Zero trust: every room has its own lock that checks your badge **and** whether you should be in that room right now, wherever you came from.

### How it works
**Segmentation**
- Separate **environments** (prod vs. dev accounts/VPCs), **tiers** (public load balancers in public subnets; apps and databases in private subnets with no inbound internet), and **sensitive zones** (payments/PCI, admin).
- **Security groups referencing other groups** ("db allows 5432 only from app-sg"), default-deny NACLs/firewalls, egress controls (block outbound to the internet except via proxies/NAT allowlists — limits data exfiltration and SSRF).
- **Private endpoints** (AWS PrivateLink/VPC endpoints, GCP Private Service Connect) for cloud APIs and SaaS, so traffic never crosses the internet; databases with **no public IP**.

**Zero trust (NIST SP 800-207, Google BeyondCorp)**
- Every request is **authenticated and authorized** using user identity (SSO + MFA), **device posture** (managed, patched, disk encrypted), and context (location, risk); service calls use **workload identity + mTLS**.
- **Policy enforcement points** in front of every resource; continuous evaluation; least privilege; assume breach and log everything.
- **Private access** for staff: identity-aware proxies (Google IAP, Cloudflare Access, Zscaler Private Access, Tailscale, Teleport for SSH/K8s/DB) replace flat VPNs; no bastion hosts with shared keys.

Being on the "office LAN" grants nothing by itself — that's the core of zero trust.

### Interview answer
"I segment by environment, tier and sensitivity — public load balancers, private app and database subnets with no inbound internet, security groups that reference each other, default-deny between segments, egress allowlists and private endpoints for cloud services. On top I apply zero trust: no implicit trust from network location; every request is authenticated and authorized with user identity and MFA, device posture and context, and service calls use workload identity with mTLS. Staff reach internal tools through identity-aware proxies instead of flat VPNs, with everything logged."

---

## 5. SAST vs. DAST vs. SCA; CI security gates

**In one sentence:** **SAST** analyzes **source code** for vulnerable patterns, **DAST** attacks a **running application** from outside, **SCA** checks **third-party dependencies** for known vulnerabilities and licences, and **CI security gates** run them (plus secret scanning, IaC and container scanning) on every change, **blocking merges** on high-severity findings while keeping noise manageable.

### In plain words
- SAST: proofreading the blueprints for weak spots.
- DAST: hiring someone to try the doors and windows of the finished house.
- SCA: checking the recall list for every brand of lock and window you bought.
- CI gates: the building inspector who won't sign off until the serious problems are fixed.

### How it works
| | SAST | DAST | SCA | Others |
|---|---|---|---|---|
| Looks at | source/bytecode | running app (HTTP) | dependency manifests, lockfiles, images | secrets (gitleaks, TruffleHog), IaC (Checkov, tfsec, KICS), containers (Trivy) |
| Finds | injection patterns, unsafe APIs, hardcoded secrets, taint flows | auth/session flaws, misconfig, XSS, injection as exploitable behaviour | known CVEs, licence issues | leaked keys, open buckets, root containers |
| When | every commit/PR (fast) | staging / nightly | every commit + continuous | every commit |
| False positives | many (tune rules) | fewer, but misses unexercised code | low (but reachability matters) | varies |
| Tools | Semgrep, CodeQL, SonarQube, clang-tidy / Clang Static Analyzer, Coverity | OWASP ZAP, Burp Suite, Nuclei | Dependabot, Snyk, osv-scanner, Grype | — |

Also **IAST** (agent inside the running app) and **fuzzing** ([property-based & fuzz testing](../Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#6-property-based-tests-fuzz-testing-and-boundary-value-analysis)), and for C/C++ **sanitizers** (ASan, UBSan) in CI.

**Designing gates that people don't hate**
- **Block** only on high-confidence, high-severity findings (critical/high SCA with a fix available, verified secrets, critical SAST rules); **warn** on the rest.
- Show findings **in the PR** (SARIF annotations), with fix guidance.
- **Baseline** existing issues so new code is held to the standard without blocking everything on day one; track the backlog.
- Time-boxed, documented **exceptions** with owners; measure mean time to remediate.

### Interview answer
"SAST scans our source for dangerous patterns and taint flows early but has false positives; DAST probes the running app from outside and finds exploitable behaviour but only on exercised paths; SCA checks dependencies for known CVEs and licences. In CI I run SAST, SCA, secret scanning, IaC and container scans on every PR and DAST against staging, block only on high-confidence critical or high findings with fixes available, show results inline as SARIF, baseline existing debt so new code is clean, and allow time-boxed exceptions with owners."

---

## 6. Secrets leakage prevention and incident credential rotation

**In one sentence:** keep secrets **out of code, images, logs and chat** (secrets managers, workload identity, pre-commit and CI **secret scanning**, push protection), and when a secret leaks, **revoke and rotate it immediately**, then **investigate its use** — deleting the commit is **not** enough.

### In plain words
If you drop your house key in the street, you don't just pick it up and hope nobody copied it — you **change the locks**, then check whether anyone came in.

### How it works
**Prevention**
- Secrets live in a **secrets manager**; better, **no long-lived secrets** at all (workload identity, OIDC federation for CI, short-lived DB credentials).
- **Scan everywhere:** pre-commit hooks (gitleaks, detect-secrets), CI scanning, **GitHub push protection** and secret scanning (providers like AWS and Stripe auto-revoke some exposed keys), scanning of container images, logs and tickets.
- Redact secrets in logs and error reports; never print environment variables in CI logs; mask CI variables.
- Use **recognizable prefixes** for your own tokens (`ghp_`, `sk_live_`) so scanners can find them, and give tokens **expiry** and **minimal scope**.

**When a secret leaks — the runbook**
1. **Revoke / rotate** the credential **now** (assume it's compromised the moment it was public — bots scan GitHub within minutes).
2. **Deploy** the new secret to the services that need it (this is why rotation must be automated and rehearsed).
3. **Investigate:** audit logs (CloudTrail, provider logs) for use of the old credential since the exposure time; check for persistence (new users, keys, roles, functions).
4. **Clean up** history (BFG / `git filter-repo`) and caches — useful, but **secondary**: clones and forks already have it.
5. **Postmortem:** how did it get there, and which control would have stopped it?

### Interview answer
"I prevent leaks by keeping secrets in a secrets manager or removing them entirely with workload identity and OIDC federation for CI, scanning with pre-commit hooks, CI scanners and push protection, redacting logs and masking CI variables, and issuing scoped, expiring tokens with recognizable prefixes. If a secret leaks, I revoke and rotate it immediately — public repos are scanned by bots within minutes — deploy the replacement, review audit logs for any use since exposure and look for persistence, and only then clean the history, followed by a postmortem on the missing control."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Containers | minimal, digest-pinned, scanned, signed images; non-root; read-only FS; drop ALL caps; no privilege escalation; seccomp |
| Kubernetes | PSA restricted / Kyverno; own SA per workload; namespaced Roles; no wildcards / cluster-admin / create pods; default-deny NetworkPolicy |
| SBOM | CycloneDX/SPDX per build; "are we affected?" in minutes |
| SCA | CVE/OSV matching; prioritize by CVSS + EPSS/KEV + reachability; patch SLAs; Renovate/Dependabot |
| Supply chain | lockfiles + hashes; scoped packages vs. dependency confusion; pin CI actions by SHA; SLSA provenance; cosign signatures |
| IAM | specific actions + resources + conditions; roles with short-lived creds; SCPs; access analyzer |
| Escalation | CreatePolicyVersion, Attach*Policy, CreateAccessKey, UpdateAssumeRolePolicy, PassRole + compute |
| Segmentation | env / tier / sensitivity; private subnets; SG-to-SG rules; egress allowlists; private endpoints |
| Zero trust | identity + device + context per request; mTLS for services; identity-aware proxies, not flat VPNs |
| SAST / DAST / SCA | source patterns / running app / dependencies; + secrets, IaC, containers, fuzzing, sanitizers |
| CI gates | block high-confidence critical/high; SARIF in PRs; baseline; time-boxed exceptions |
| Secrets | secrets manager or no secrets; pre-commit + push protection; redact logs |
| Leak response | revoke/rotate now → deploy → audit usage + persistence → clean history → postmortem |
