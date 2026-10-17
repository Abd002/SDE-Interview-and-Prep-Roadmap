# Infrastructure, Cloud, and Supply-Chain Security — Containers, Kubernetes, IAM, Zero Trust, Dependencies, CI Gates and Secrets

> **What you'll learn:** how to harden **containers and Kubernetes** (security contexts, RBAC, network policies), manage **dependency vulnerabilities** with **SBOMs** and defend against **supply-chain attacks**, design **least-privilege IAM** and spot **privilege-escalation** paths, build **segmented, zero-trust** networks with **private access**, choose between **SAST, DAST and SCA** and wire them into **CI security gates**, and **prevent secrets leaks** and **rotate credentials** after an incident. Each part has config snippets and a runnable C++ checker.
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

#### Modern C++ example — a pod-spec linter (like a tiny Kyverno/kube-score)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct Container { std::string name, image; bool run_as_non_root, read_only_root, allow_priv_escalation, privileged; std::set<std::string> added_caps; bool caps_drop_all; bool has_limits; };
struct Pod { std::string name, service_account; bool host_network; std::vector<std::string> host_paths; std::vector<Container> containers; };

std::vector<std::string> lint(const Pod& p) {
    std::vector<std::string> f;
    if (p.service_account == "default") f.push_back("uses the 'default' service account");
    if (p.host_network) f.push_back("hostNetwork: true");
    for (auto& hp : p.host_paths) if (hp == "/" || hp == "/var/run/docker.sock") f.push_back("dangerous hostPath " + hp);
    for (auto& c : p.containers) {
        auto at = c.image.find('@');
        if (at == std::string::npos) f.push_back(c.name + ": image not pinned by digest (" + c.image + ")");
        if (!c.run_as_non_root) f.push_back(c.name + ": may run as root");
        if (!c.read_only_root) f.push_back(c.name + ": writable root filesystem");
        if (c.allow_priv_escalation) f.push_back(c.name + ": allowPrivilegeEscalation");
        if (c.privileged) f.push_back(c.name + ": PRIVILEGED container (host takeover risk)");
        if (!c.caps_drop_all) f.push_back(c.name + ": capabilities not dropped");
        for (auto& cap : c.added_caps) if (cap == "SYS_ADMIN" || cap == "NET_ADMIN") f.push_back(c.name + ": adds " + cap);
        if (!c.has_limits) f.push_back(c.name + ": no resource limits (noisy neighbour / DoS)");
    }
    return f;
}

int main() {
    Pod hardened{"api", "api", false, {}, {{"api", "registry.example.com/api@sha256:3f1c", true, true, false, false, {}, true, true}}};
    Pod risky{"debug-tool", "default", true, {"/var/run/docker.sock"},
              {{"tool", "someone/tool:latest", false, false, true, true, {"SYS_ADMIN"}, false, false}}};
    for (auto& p : {hardened, risky}) {
        auto findings = lint(p);
        std::cout << p.name << ": " << (findings.empty() ? "passes the restricted profile" : std::to_string(findings.size()) + " findings -> blocked at admission") << '\n';
        for (auto& x : findings) std::cout << "  - " << x << '\n';
    }
}
```

**Output:**
```text
api: passes the restricted profile
debug-tool: 11 findings -> blocked at admission
  - uses the 'default' service account
  - hostNetwork: true
  - dangerous hostPath /var/run/docker.sock
  - tool: image not pinned by digest (someone/tool:latest)
  - tool: may run as root
  - tool: writable root filesystem
  - tool: allowPrivilegeEscalation
  - tool: PRIVILEGED container (host takeover risk)
  - tool: capabilities not dropped
  - tool: adds SYS_ADMIN
  - tool: no resource limits (noisy neighbour / DoS)
```

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

#### Modern C++ example — checking an SBOM against advisories with version ranges
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <sstream>
#include <string>
#include <tuple>
#include <vector>

using Ver = std::tuple<int, int, int>;
Ver parse(const std::string& s) { Ver v{}; char d; std::istringstream in(s); in >> std::get<0>(v) >> d >> std::get<1>(v) >> d >> std::get<2>(v); return v; }

struct Component { std::string name, version; };
struct Advisory { std::string id, package, introduced, fixed; double cvss; bool known_exploited; };

int main() {
    std::vector<Component> sbom{{"log4j-core", "2.14.1"}, {"openssl", "3.0.13"}, {"zlib", "1.3.1"}, {"xz-utils", "5.6.0"}, {"libcurl", "8.4.0"}};
    std::vector<Advisory> db{
        {"CVE-2021-44228", "log4j-core", "2.0.0", "2.15.0", 10.0, true},
        {"CVE-2024-3094", "xz-utils", "5.6.0", "5.6.2", 10.0, true},
        {"CVE-2023-38545", "libcurl", "7.69.0", "8.4.0", 9.8, false},
        {"CVE-2022-37434", "zlib", "1.2.0", "1.2.13", 9.8, false},
    };
    int blocking = 0;
    for (auto& c : sbom)
        for (auto& a : db) {
            if (a.package != c.name) continue;
            Ver v = parse(c.version);
            if (v >= parse(a.introduced) && v < parse(a.fixed)) {           // affected range [introduced, fixed)
                bool block = a.cvss >= 9.0 || a.known_exploited;
                blocking += block;
                std::cout << c.name << ' ' << c.version << " AFFECTED by " << a.id << " (CVSS " << a.cvss
                          << (a.known_exploited ? ", known exploited" : "") << ") -> upgrade to >= " << a.fixed << (block ? "  [BLOCKS RELEASE]" : "") << '\n';
            }
        }
    std::cout << "libcurl 8.4.0 and zlib 1.3.1 are already at or past the fixed versions\n"
              << blocking << " blocking finding(s)\n";
}
```

**Output:**
```text
log4j-core 2.14.1 AFFECTED by CVE-2021-44228 (CVSS 10, known exploited) -> upgrade to >= 2.15.0  [BLOCKS RELEASE]
xz-utils 5.6.0 AFFECTED by CVE-2024-3094 (CVSS 10, known exploited) -> upgrade to >= 5.6.2  [BLOCKS RELEASE]
libcurl 8.4.0 and zlib 1.3.1 are already at or past the fixed versions
2 blocking finding(s)
```

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

#### Modern C++ example — finding wildcard grants and privilege-escalation paths in a set of policies
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Grant { std::string action, resource; };
using Policy = std::vector<Grant>;

int main() {
    std::map<std::string, Policy> identities{
        {"role/report-reader", {{"s3:GetObject", "arn:aws:s3:::invoices-prod/reports/*"}}},
        {"role/ci-deployer", {{"iam:PassRole", "*"}, {"lambda:CreateFunction", "*"}, {"lambda:InvokeFunction", "*"}}},
        {"user/old-intern", {{"iam:CreatePolicyVersion", "arn:aws:iam::123:policy/intern"}, {"s3:*", "*"}}},
        {"role/app", {{"dynamodb:GetItem", "arn:aws:dynamodb:eu-west-1:123:table/orders"}}},
    };
    const std::set<std::string> self_escalation{"iam:CreatePolicyVersion", "iam:SetDefaultPolicyVersion", "iam:AttachUserPolicy",
                                                "iam:PutUserPolicy", "iam:AttachRolePolicy", "iam:UpdateAssumeRolePolicy"};
    for (auto& [who, policy] : identities) {
        std::vector<std::string> issues;
        std::set<std::string> actions;
        for (auto& g : policy) {
            actions.insert(g.action);
            if (g.action.find('*') != std::string::npos) issues.push_back("wildcard action " + g.action);
            if (g.resource == "*") issues.push_back(g.action + " on Resource \"*\"");
            if (self_escalation.count(g.action)) issues.push_back("ESCALATION: " + g.action + " lets it rewrite its own permissions");
        }
        if (actions.count("iam:PassRole") && (actions.count("lambda:CreateFunction") || actions.count("ec2:RunInstances")))
            issues.push_back("ESCALATION: PassRole + create compute -> run code as any passable role");
        std::cout << who << ": " << (issues.empty() ? "least privilege OK" : std::to_string(issues.size()) + " issue(s)") << '\n';
        for (auto& i : issues) std::cout << "    " << i << '\n';
    }
}
```

**Output:**
```text
role/app: least privilege OK
role/ci-deployer: 4 issue(s)
    iam:PassRole on Resource "*"
    lambda:CreateFunction on Resource "*"
    lambda:InvokeFunction on Resource "*"
    ESCALATION: PassRole + create compute -> run code as any passable role
role/report-reader: least privilege OK
user/old-intern: 3 issue(s)
    ESCALATION: iam:CreatePolicyVersion lets it rewrite its own permissions
    wildcard action s3:*
    s3:* on Resource "*"
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

#### Modern C++ example — segmentation rules plus a zero-trust access decision
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <tuple>
#include <vector>

struct Rule { std::string from, to; int port; };
bool allowed_flow(const std::vector<Rule>& rules, const std::string& from, const std::string& to, int port) {
    for (auto& r : rules) if (r.from == from && r.to == to && r.port == port) return true;
    return false;                                                         // default deny between segments
}

struct Request { std::string user; bool mfa, managed_device, patched; std::string app, network; };
std::string zero_trust(const Request& r) {
    static const std::set<std::pair<std::string, std::string>> entitlements{{"mona", "grafana"}, {"omar", "grafana"}, {"omar", "prod-db-console"}};
    if (!r.mfa) return "deny: no MFA";
    if (!r.managed_device || !r.patched) return "deny: device posture check failed";
    if (!entitlements.count({r.user, r.app})) return "deny: " + r.user + " not entitled to " + r.app;
    return "allow via identity-aware proxy (network '" + r.network + "' doesn't matter)";
}

int main() {
    std::vector<Rule> rules{{"internet", "lb", 443}, {"lb", "app", 8443}, {"app", "db", 5432}};
    for (auto [f, t, p] : std::vector<std::tuple<std::string, std::string, int>>{{"internet", "lb", 443}, {"lb", "app", 8443}, {"app", "db", 5432},
                                                                               {"internet", "db", 5432}, {"lb", "db", 5432}, {"app", "internet", 443}})
        std::cout << f << " -> " << t << ':' << p << "  " << (allowed_flow(rules, f, t, p) ? "allowed" : "blocked") << '\n';

    std::cout << zero_trust({"mona", true, true, true, "grafana", "cafe wifi"}) << '\n'
              << zero_trust({"mona", true, true, true, "prod-db-console", "office LAN"}) << '\n'
              << zero_trust({"omar", true, false, true, "prod-db-console", "office LAN"}) << '\n'
              << zero_trust({"omar", false, true, true, "grafana", "office LAN"}) << '\n';
}
```

**Output:**
```text
internet -> lb:443  allowed
lb -> app:8443  allowed
app -> db:5432  allowed
internet -> db:5432  blocked
lb -> db:5432  blocked
app -> internet:443  blocked
allow via identity-aware proxy (network 'cafe wifi' doesn't matter)
deny: mona not entitled to prod-db-console
deny: device posture check failed
deny: no MFA
```

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

#### Modern C++ example — a CI gate combining SAST, SCA and secret-scan results with a baseline and exceptions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct Finding { std::string tool, id, file, severity; bool fix_available = true; };

int main() {
    std::vector<Finding> results{
        {"sast", "sql-injection-concat", "orders/repo.cpp:88", "high"},
        {"sast", "weak-random", "util/token.cpp:12", "medium"},
        {"sca", "CVE-2021-44228", "pom.xml (log4j-core 2.14.1)", "critical"},
        {"sca", "CVE-2099-0001", "package.json (left-pad 1.0)", "high", false},
        {"secrets", "aws-access-key", "deploy/config.env:3", "critical"},
        {"sast", "strcpy-overflow", "legacy/parser.c:410", "high"},
    };
    std::set<std::string> baseline{"strcpy-overflow@legacy/parser.c:410"};     // pre-existing, tracked in the backlog
    std::set<std::string> exceptions{"CVE-2099-0001"};                        // no fix yet; owner + expiry documented
    int blocking = 0;
    for (auto& f : results) {
        std::string key = f.id + "@" + f.file;
        std::string verdict;
        if (baseline.count(key)) verdict = "baseline (existing debt, not blocking)";
        else if (exceptions.count(f.id)) verdict = "exception (expires 2026-11-30, owner @payments)";
        else if (f.severity == "critical" || (f.severity == "high" && f.fix_available)) { verdict = "BLOCK"; ++blocking; }
        else verdict = "warn (PR annotation)";
        std::cout << '[' << f.tool << "] " << f.severity << ' ' << f.id << " in " << f.file << " -> " << verdict << '\n';
    }
    std::cout << "gate: " << (blocking ? "FAILED with " + std::to_string(blocking) + " blocking finding(s)" : "passed") << '\n';
}
```

**Output:**
```text
[sast] high sql-injection-concat in orders/repo.cpp:88 -> BLOCK
[sast] medium weak-random in util/token.cpp:12 -> warn (PR annotation)
[sca] critical CVE-2021-44228 in pom.xml (log4j-core 2.14.1) -> BLOCK
[sca] high CVE-2099-0001 in package.json (left-pad 1.0) -> exception (expires 2026-11-30, owner @payments)
[secrets] critical aws-access-key in deploy/config.env:3 -> BLOCK
[sast] high strcpy-overflow in legacy/parser.c:410 -> baseline (existing debt, not blocking)
gate: FAILED with 3 blocking finding(s)
```

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

#### Modern C++ example — a secret scanner with patterns + entropy, and a rotation runbook tracker
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <regex>
#include <string>
#include <vector>

double entropy(const std::string& s) {                         // Shannon entropy in bits per character
    std::map<char, int> f;
    for (char c : s) ++f[c];
    double h = 0;
    for (auto& [c, n] : f) { double p = double(n) / s.size(); h -= p * std::log2(p); }
    return h;
}

int main() {
    std::vector<std::string> lines{
        "db_host = \"orders.internal\"",
        "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE",
        std::string("stripe_key = \"sk_") + "live_4eC39HqLyjWDarjtT1zdp7dc\"",   // split so real scanners don't flag this file
        "session_secret = \"Xq9vL2mR8tY4wZ7kP3nB6cF1hJ5sD0gA\"",
        "greeting = \"hello-world-hello-world\"",
    };
    const std::vector<std::pair<std::string, std::regex>> rules{
        {"AWS access key", std::regex(R"(AKIA[0-9A-Z]{16})")},
        {"Stripe live key", std::regex(R"(sk_live_[0-9a-zA-Z]{24,})")},
    };
    std::regex quoted(R"x("([A-Za-z0-9_\-]{20,})")x");
    std::cout << std::fixed << std::setprecision(2);
    for (std::size_t i = 0; i < lines.size(); ++i) {
        for (auto& [name, re] : rules) if (std::regex_search(lines[i], re)) std::cout << "line " << i + 1 << ": " << name << " (pattern match)\n";
        std::smatch m;
        if (std::regex_search(lines[i], m, quoted) && entropy(m[1]) > 4.5 && m[1].str().rfind("sk_live_", 0) != 0)
            std::cout << "line " << i + 1 << ": high-entropy string, " << entropy(m[1]) << " bits/char (possible secret)\n";
    }

    std::cout << "\nincident: AKIA...EXAMPLE pushed to a public repo at 14:02\n";
    std::vector<std::pair<std::string, bool>> runbook{
        {"14:05 deactivate the access key in IAM", true}, {"14:09 issue new credentials via workload identity (no static key)", true},
        {"14:20 CloudTrail: any calls with the old key since 14:02?", true}, {"14:31 check for new IAM users/keys/roles (persistence)", false},
        {"--    rewrite git history (secondary: forks already have it)", false}, {"--    postmortem: add pre-commit + push protection", false}};
    for (auto& [step, done] : runbook) std::cout << (done ? "[x] " : "[ ] ") << step << '\n';
}
```

**Output:**
```text
line 2: AWS access key (pattern match)
line 3: Stripe live key (pattern match)
line 4: high-entropy string, 5.00 bits/char (possible secret)

incident: AKIA...EXAMPLE pushed to a public repo at 14:02
[x] 14:05 deactivate the access key in IAM
[x] 14:09 issue new credentials via workload identity (no static key)
[x] 14:20 CloudTrail: any calls with the old key since 14:02?
[ ] 14:31 check for new IAM users/keys/roles (persistence)
[ ] --    rewrite git history (secondary: forks already have it)
[ ] --    postmortem: add pre-commit + push protection
```

The low-entropy `hello-world-hello-world` string isn't flagged — entropy filters cut false positives. (Fun fact: when this guide was first pushed with the fake Stripe-style key written in one piece, **GitHub push protection rejected the push** — exactly the control described above.)

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
