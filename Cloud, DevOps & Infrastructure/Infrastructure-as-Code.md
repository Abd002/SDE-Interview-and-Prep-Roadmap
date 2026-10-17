# Infrastructure as Code (IaC) — Terraform, CloudFormation/CDK, State, Drift, Environments and Secrets

> **What you'll learn:** how **Terraform** works (providers, resources, modules, **plan/apply**, **state**), how it compares with **CloudFormation and CDK**, how to manage **remote state, locking, drift detection and resource lifecycles**, how to get **environment parity and reproducible provisioning**, and how to handle **secrets and sensitive outputs** safely. Each part has HCL/CDK snippets and a runnable C++ model of the plan/state logic.
>
> **Prerequisites:** [Cloud Networking and Identity](./Cloud-Networking-and-Identity.md), [CI/CD and Release Engineering](./CI-CD-and-Release-Engineering.md).

## Table of Contents
1. [CloudFormation/CDK vs. Terraform: trade-offs](#1-cloudformationcdk-vs-terraform-trade-offs)
2. [Environment parity and reproducible provisioning](#2-environment-parity-and-reproducible-provisioning)
3. [Managing secrets and sensitive outputs in IaC](#3-managing-secrets-and-sensitive-outputs-in-iac)
4. [Remote state, locking, drift detection, and lifecycle management](#4-remote-state-locking-drift-detection-and-lifecycle-management)
5. [Terraform providers, resources, modules, plans, and state](#5-terraform-providers-resources-modules-plans-and-state)
6. [Cheat sheet](#cheat-sheet)

**Why IaC:** infrastructure described in version-controlled code is **reviewable** (pull requests), **repeatable** (same code → same environment), **auditable** (git history), **testable** and **recoverable** (rebuild after disaster). Clicking in the console ("ClickOps") is none of these. Start with section **5** if Terraform is new to you.

---

## 1. CloudFormation/CDK vs. Terraform: trade-offs

**In one sentence:** **CloudFormation** is AWS's native declarative IaC (YAML/JSON templates, state managed by AWS, rollbacks built in), **CDK** generates CloudFormation from real programming languages (TypeScript, Python, Java, Go, C#), and **Terraform/OpenTofu** is a **multi-cloud** declarative tool with a huge provider ecosystem, where **you** manage the state file.

### In plain words
CloudFormation is the official Apple charger — works perfectly with Apple devices and Apple handles everything. Terraform is a universal charger with adapters for every device in the house (AWS, GCP, GitHub, Datadog, Cloudflare), but you have to keep track of the adapters yourself (state).

### How it works
| | CloudFormation | CDK | Terraform / OpenTofu |
|---|---|---|---|
| Language | YAML/JSON | TypeScript, Python, Java, Go, C# → synthesizes CloudFormation | HCL (declarative), CDKTF optional |
| Scope | AWS (+ registry extensions) | AWS | **any provider**: AWS, Azure, GCP, Kubernetes, GitHub, Datadog, Cloudflare… |
| State | managed by AWS (stacks) | same as CFN | **state file you store** (S3 + DynamoDB/lockfile, Terraform Cloud) |
| Preview | change sets | `cdk diff` | `terraform plan` (very readable) |
| Failure handling | **automatic rollback** of the stack | same | no automatic rollback — partial applies possible; fix forward |
| New AWS features | sometimes later (CloudControl helps) | same | AWS provider usually quick; community providers vary |
| Abstraction | nested stacks, modules | **constructs** (L1/L2/L3), loops, types, unit tests | modules, `for_each`, `count`, dynamic blocks |
| Drift detection | built in (manual run) | same | `terraform plan` shows drift |
| Licence | AWS service | Apache 2.0 | Terraform BSL (since 2023); **OpenTofu** = open-source fork (MPL) |

**Rules of thumb**
- AWS-only team that likes general-purpose languages → **CDK**. AWS-only, prefers plain templates, wants rollbacks → **CloudFormation**.
- Multi-cloud or many SaaS providers (DNS, monitoring, GitHub) → **Terraform/OpenTofu**.
- Kubernetes-centric teams may also use **Crossplane** or Pulumi; whatever you pick, **one tool per resource** (never manage the same resource from two tools).

```typescript
// CDK (TypeScript): an L2 construct hides a lot of CloudFormation
const bucket = new s3.Bucket(this, 'Uploads', {
  versioned: true,
  encryption: s3.BucketEncryption.KMS_MANAGED,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  enforceSSL: true,
  lifecycleRules: [{ noncurrentVersionExpiration: Duration.days(30) }],
});
```

#### Modern C++ example — choosing an IaC tool from team context
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Team { std::string name; bool multi_cloud_or_saas, prefers_general_language, wants_auto_rollback, k8s_centric; };

std::string pick(const Team& t) {
    if (t.multi_cloud_or_saas) return "Terraform / OpenTofu (one workflow for AWS + Cloudflare + GitHub + Datadog)";
    if (t.k8s_centric) return "Crossplane or Terraform (manage cloud resources from the Kubernetes control plane)";
    if (t.prefers_general_language) return "AWS CDK (TypeScript/Python constructs -> CloudFormation, with stack rollbacks)";
    if (t.wants_auto_rollback) return "CloudFormation (native, AWS-managed state, automatic rollback)";
    return "Terraform / OpenTofu";
}

int main() {
    std::vector<Team> teams{
        {"startup on AWS, TypeScript everywhere", false, true, true, false},
        {"platform team: AWS + GCP + Cloudflare DNS", true, false, false, false},
        {"regulated bank, AWS-only, YAML reviews", false, false, true, false},
        {"Kubernetes platform team", false, false, false, true},
    };
    for (auto& t : teams) std::cout << t.name << "\n  -> " << pick(t) << '\n';
}
```

**Output:**
```text
startup on AWS, TypeScript everywhere
  -> AWS CDK (TypeScript/Python constructs -> CloudFormation, with stack rollbacks)
platform team: AWS + GCP + Cloudflare DNS
  -> Terraform / OpenTofu (one workflow for AWS + Cloudflare + GitHub + Datadog)
regulated bank, AWS-only, YAML reviews
  -> CloudFormation (native, AWS-managed state, automatic rollback)
Kubernetes platform team
  -> Crossplane or Terraform (manage cloud resources from the Kubernetes control plane)
```

### Interview answer
"CloudFormation is AWS-native: templates, state managed by AWS, change sets and automatic stack rollback. CDK lets you write CloudFormation with real languages and reusable constructs, with tests and loops. Terraform or OpenTofu is declarative HCL across any provider — clouds plus SaaS like DNS, monitoring and GitHub — with a very readable plan, but you manage the state and there's no automatic rollback. AWS-only teams that like code pick CDK; multi-cloud or SaaS-heavy platforms pick Terraform; and each resource is owned by exactly one tool."

---

## 2. Environment parity and reproducible provisioning

**In one sentence:** **dev, staging and prod should be built from the same code** (same modules, same versions), differing only in **explicit, reviewed variables** (sizes, counts, domains), with **pinned** tool/provider/module versions and an **automated pipeline** so any environment can be recreated identically — and "works in staging" actually predicts production.

### In plain words
A bakery chain: every branch uses the same recipe book and the same brand of oven; the only differences are written on a card — "small branch: 2 ovens, big branch: 6". If one branch secretly changed the recipe, the cakes would taste different and nobody would know why.

### How it works
- **Same modules, different inputs:** `envs/dev/main.tf`, `envs/prod/main.tf` call the same `modules/service` with different `tfvars`; or Terraform **workspaces** (fine for identical shapes; separate directories/state per environment are clearer for real differences); Terragrunt to keep it DRY.
- **Separate accounts/projects per environment** (blast radius, IAM separation), separate state per environment.
- **Pin everything:** `required_version` for Terraform, `required_providers` with version constraints + the committed **`.terraform.lock.hcl`**, module `ref=v1.4.2` tags, container images by digest, AMIs by ID from a pipeline.
- **Promotion:** the same artifact/module version goes dev → staging → prod; changes land via PR + plan review, applied by CI (not laptops).
- **Ephemeral environments:** spin up a full stack per pull request from the same code, destroy on merge ([ephemeral environments](../Testing%2C%20Reliability%20%26%20Observability/Backend-and-Distributed-System-Testing.md#7-testcontainers-ephemeral-environments-and-service-virtualization)).
- **Parity gaps to watch:** data volume, traffic, third-party sandboxes vs. production APIs, feature flags, secrets, instance sizes, Multi-AZ off in dev — document them so they're conscious choices.

```hcl
# modules/service/variables.tf
variable "env"           { type = string }
variable "instance_type" { type = string }
variable "min_size"      { type = number }
variable "multi_az"      { type = bool }

# envs/prod/main.tf
module "orders" {
  source        = "git::https://github.com/acme/infra-modules.git//service?ref=v1.4.2"   # pinned
  env           = "prod"
  instance_type = "m7g.large"
  min_size      = 6
  multi_az      = true
}
```

#### Modern C++ example — diffing two environments to show only the intended differences (and catching an unpinned module)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

using Config = std::map<std::string, std::string>;

int main() {
    Config staging{{"module_version", "v1.4.2"}, {"instance_type", "m7g.medium"}, {"min_size", "2"}, {"multi_az", "true"},
                   {"postgres_version", "16.4"}, {"tls_policy", "TLS13"}, {"log_retention_days", "14"}};
    Config prod{{"module_version", "main"}, {"instance_type", "m7g.large"}, {"min_size", "6"}, {"multi_az", "true"},
                {"postgres_version", "16.2"}, {"tls_policy", "TLS13"}, {"log_retention_days", "90"}};
    const std::set<std::string> allowed_to_differ{"instance_type", "min_size", "log_retention_days"};   // reviewed, intentional
    int problems = 0;
    for (auto& [k, v] : staging) {
        if (prod[k] == v) continue;
        bool ok = allowed_to_differ.count(k);
        problems += !ok;
        std::cout << (ok ? "expected  " : "DRIFT     ") << k << ": staging=" << v << " prod=" << prod[k] << '\n';
    }
    if (prod["module_version"] == "main") std::cout << "UNPINNED  prod uses a moving branch (main) instead of a version tag\n";
    std::cout << problems << " unintended difference(s) -> staging tests don't fully predict prod until fixed\n";
}
```

**Output:**
```text
expected  instance_type: staging=m7g.medium prod=m7g.large
expected  log_retention_days: staging=14 prod=90
expected  min_size: staging=2 prod=6
DRIFT     module_version: staging=v1.4.2 prod=main
DRIFT     postgres_version: staging=16.4 prod=16.2
UNPINNED  prod uses a moving branch (main) instead of a version tag
2 unintended difference(s) -> staging tests don't fully predict prod until fixed
```

### Interview answer
"All environments are built from the same pinned modules with only explicit, reviewed variables differing — sizes, counts, retention — and each environment has its own account and state. I pin the Terraform version, providers with the committed lock file, module tags, images by digest and AMIs from a pipeline, and promote the same versions dev to staging to prod through CI with plan review. That's what makes staging results meaningful, lets me recreate any environment or spin up ephemeral ones per PR, and I document remaining parity gaps like data volume or third-party sandboxes."

---

## 3. Managing secrets and sensitive outputs in IaC

**In one sentence:** **never put secret values in IaC code or variables files**; let the platform **generate and store** them (Secrets Manager, RDS-managed master passwords, random providers writing straight to a secrets manager), reference secrets by **ARN/name**, mark values `sensitive`, and remember that **Terraform state contains every attribute in plain text** — so encrypt and lock down the state.

### In plain words
Building plans for a house can say "there's a safe in the bedroom", but shouldn't contain the safe's combination. And the builder's notebook (state file) may contain the combination anyway — so keep that notebook in a locked cabinet.

### How it works
- **Generate, don't type:** `manage_master_user_password = true` on RDS/Aurora (password stored and rotated in Secrets Manager), `random_password` → `aws_secretsmanager_secret_version`, or have the app fetch secrets at runtime by name.
- **Reference, don't copy:** pass the secret **ARN** to the app (env var `DB_SECRET_ARN`) and grant its role `secretsmanager:GetSecretValue` on that ARN only.
- `sensitive = true` on variables/outputs hides values in plan/apply output — but **not** in the state file.
- **State security:** remote backend with encryption (S3 SSE-KMS), versioning, strict IAM (only CI and a few admins), no local state on laptops, never commit `*.tfstate` or `*.tfvars` with secrets (`.gitignore`). Terraform 1.10+ supports **ephemeral values/resources** that are never stored in state.
- **CI credentials:** OIDC federation from CI to cloud roles (no long-lived keys in CI variables) ([federation](./Cloud-Networking-and-Identity.md#2-iam-rolespolicies-least-privilege-and-temporary-credentials)).
- **Scanning:** secret scanning + IaC scanners (Checkov, tfsec/Trivy, KICS) catch hard-coded secrets and insecure settings in PRs.
- Encrypted values in git when needed: **SOPS** (with KMS), sealed-secrets for Kubernetes.

```hcl
resource "aws_db_instance" "orders" {
  identifier                  = "orders-prod"
  engine                      = "postgres"
  instance_class              = "db.r7g.large"
  username                    = "orders_admin"
  manage_master_user_password = true                 # AWS generates + stores + rotates it in Secrets Manager
  storage_encrypted           = true
}
output "db_secret_arn" {
  value = aws_db_instance.orders.master_user_secret[0].secret_arn   # an ARN, not the password
}
variable "partner_api_token" {
  type      = string
  sensitive = true                                   # redacted in plan output, still present in state!
}
```

#### Modern C++ example — a pre-merge check for hard-coded secrets and a state-file exposure audit
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

int main() {
    std::map<std::string, std::string> files{
        {"main.tf", "resource \"aws_db_instance\" \"x\" {\n  username = \"admin\"\n  password = \"Sup3rS3cret!\"\n}\n"},
        {"rds.tf", "resource \"aws_db_instance\" \"y\" {\n  manage_master_user_password = true\n}\n"},
        {"prod.tfvars", "partner_api_token = \"tok_live_9f8e7d6c5b4a\"\n"},
        {"outputs.tf", "output \"db_password\" {\n  value = aws_db_instance.x.password\n}\n"},
    };
    std::regex literal_secret(R"x((password|secret|token)\s*=\s*"[^"]{6,}")x", std::regex::icase);
    std::regex secret_output(R"x(output\s+"[^"]*(password|secret|token)[^"]*")x", std::regex::icase);
    int findings = 0;
    for (auto& [name, content] : files) {
        std::istringstream in(content); std::string line; int n = 0;
        while (std::getline(in, line)) {
            ++n;
            if (std::regex_search(line, literal_secret)) { std::cout << name << ':' << n << " hard-coded secret -> use manage_master_user_password / Secrets Manager\n"; ++findings; }
            if (std::regex_search(line, secret_output) && content.find("sensitive = true") == std::string::npos) { std::cout << name << ':' << n << " secret exposed as a non-sensitive output\n"; ++findings; }
        }
    }
    struct Backend { bool encrypted, versioned, public_access_blocked; std::vector<std::string> readers; };
    Backend state{true, true, true, {"role/ci-terraform", "role/platform-admins", "role/developers"}};
    std::cout << findings << " finding(s) in code; state backend: encrypted=" << std::boolalpha << state.encrypted << ", versioned=" << state.versioned
              << ", readers=" << state.readers.size() << " -> remove role/developers (state holds secrets in plain text)\n";
}
```

**Output:**
```text
main.tf:3 hard-coded secret -> use manage_master_user_password / Secrets Manager
outputs.tf:1 secret exposed as a non-sensitive output
prod.tfvars:1 hard-coded secret -> use manage_master_user_password / Secrets Manager
3 finding(s) in code; state backend: encrypted=true, versioned=true, readers=3 -> remove role/developers (state holds secrets in plain text)
```

### Interview answer
"Secrets never live in IaC code or tfvars: I let AWS generate and rotate them — manage_master_user_password for RDS, or random_password written straight to Secrets Manager — and pass only the secret's ARN to the application, with IAM limited to that ARN. `sensitive` hides values in plan output but Terraform state still stores them in plain text, so state lives in an encrypted, versioned, tightly permissioned remote backend, never on laptops or in git; ephemeral values in newer Terraform avoid storing some secrets at all. CI uses OIDC instead of static keys, and Checkov or tfsec plus secret scanning run on every PR."

---

## 4. Remote state, locking, drift detection, and lifecycle management

**In one sentence:** store Terraform **state remotely** (S3 + native lockfile or DynamoDB lock table, Terraform Cloud, GCS) so the team shares one source of truth, use **state locking** so two applies can't run at once, run **drift detection** (scheduled `plan`) to find changes made outside IaC, and control resource replacement with **lifecycle** rules (`prevent_destroy`, `create_before_destroy`, `ignore_changes`) and `moved`/`import` blocks.

### In plain words
The state file is the shared inventory list of everything that's been built. It must be kept in one office everyone uses (remote), only one person may edit it at a time (lock), someone regularly walks the building to check nothing was changed without updating the list (drift detection), and some items are labelled "never throw away" (prevent_destroy).

### How it works
**Remote state & locking**
```hcl
terraform {
  backend "s3" {
    bucket       = "acme-tfstate-prod"
    key          = "orders/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true          # S3-native locking (Terraform >= 1.10); older setups use dynamodb_table
  }
}
```
- One state per **environment × component** (small blast radius, faster plans); read other states via `terraform_remote_state` or, better, data sources/SSM parameters.
- Lock contention → wait; a stuck lock after a crash → `terraform force-unlock` only after confirming nothing is running.

**Drift detection:** someone changed a security group in the console → the next `plan` shows the difference. Run `terraform plan -detailed-exitcode` on a schedule (exit code 2 = changes/drift) and alert; then either **revert** (apply) or **codify** the change. Prevent drift with read-only console access in prod and SCPs.

**Lifecycle & refactoring**
- `prevent_destroy = true` on databases, buckets with data, KMS keys.
- `create_before_destroy = true` for zero-downtime replacement (certificates, launch templates).
- `ignore_changes = [desired_count]` when something else (autoscaling) manages an attribute.
- `moved { from = …, to = … }` when renaming/refactoring (no destroy/recreate); `import {}` blocks to adopt existing resources; `removed {}` to stop managing without destroying.
- **Read the plan:** `-/+` (replace) on a stateful resource is a red flag (e.g. changing an immutable attribute like a DB identifier).

#### Modern C++ example — state locking, drift detection, and a plan that would replace a protected database
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <set>
#include <string>

class StateBackend {
public:
    bool lock(const std::string& who) { if (holder_) return false; holder_ = who; return true; }
    void unlock() { holder_.reset(); }
    std::optional<std::string> holder() const { return holder_; }
private:
    std::optional<std::string> holder_;
};

int main() {
    StateBackend s3;
    std::cout << std::boolalpha << "CI job #41 acquires lock: " << s3.lock("ci-job-41") << '\n';
    std::cout << "laptop apply at the same time: " << s3.lock("mona-laptop") << " (held by " << *s3.holder() << ")\n";
    s3.unlock();

    std::map<std::string, std::string> state{{"sg-web.ingress", "443 from 0.0.0.0/0"}, {"db.instance_class", "db.r7g.large"}};
    std::map<std::string, std::string> real{{"sg-web.ingress", "443 from 0.0.0.0/0, 22 from 0.0.0.0/0"}, {"db.instance_class", "db.r7g.large"}};
    std::cout << "scheduled drift check (plan -detailed-exitcode):\n";
    int exit_code = 0;
    for (auto& [k, v] : state) if (real[k] != v) { exit_code = 2; std::cout << "  ~ " << k << ": real \"" << real[k] << "\" vs code \"" << v << "\"\n"; }
    std::cout << "  exit code " << exit_code << (exit_code == 2 ? " -> DRIFT: someone opened SSH in the console; revert with apply and alert" : "") << '\n';

    std::set<std::string> prevent_destroy{"aws_db_instance.orders"};
    std::map<std::string, std::string> plan{{"aws_db_instance.orders", "-/+ replace (identifier changed: forces new resource)"}, {"aws_launch_template.web", "~ update in-place"}};
    for (auto& [res, action] : plan) {
        bool blocked = prevent_destroy.count(res) && action.rfind("-/+", 0) == 0;
        std::cout << res << ": " << action << (blocked ? "  -> ERROR: lifecycle.prevent_destroy, plan rejected" : "") << '\n';
    }
}
```

**Output:**
```text
CI job #41 acquires lock: true
laptop apply at the same time: false (held by ci-job-41)
scheduled drift check (plan -detailed-exitcode):
  ~ sg-web.ingress: real "443 from 0.0.0.0/0, 22 from 0.0.0.0/0" vs code "443 from 0.0.0.0/0"
  exit code 2 -> DRIFT: someone opened SSH in the console; revert with apply and alert
aws_db_instance.orders: -/+ replace (identifier changed: forces new resource)  -> ERROR: lifecycle.prevent_destroy, plan rejected
aws_launch_template.web: ~ update in-place
```

### Interview answer
"State lives in a remote, encrypted, versioned backend — S3 with native lockfiles or DynamoDB locking, or Terraform Cloud — split per environment and component, so the team shares one truth and locking prevents concurrent applies. A scheduled plan with detailed exit codes detects drift from console changes, which we either revert or codify, and prod console access is read-only. Lifecycle rules protect stateful resources with prevent_destroy, avoid downtime with create_before_destroy, and ignore attributes owned by autoscalers; refactors use moved, import and removed blocks so nothing is accidentally destroyed — and any replace on a database in a plan is a red flag."

---

## 5. Terraform providers, resources, modules, plans, and state

**In one sentence:** Terraform reads **`.tf` files** declaring **resources** (things to create) and **data sources** (things to look up) from **providers** (plugins for AWS, Kubernetes, GitHub…), organizes them into reusable **modules**, compares the desired configuration with the **state** and real infrastructure to produce a **plan** (create / update / replace / destroy), and **applies** it in dependency order.

### In plain words
You write a shopping list of what the house should have (configuration). Terraform checks its inventory notebook (state) and the actual house, writes a to-do list — "buy 2 chairs, repaint the door, throw away the old lamp" (plan) — and, after you approve, does the jobs in the right order (apply).

### How it works
- **Workflow:** `terraform init` (download providers/modules, configure backend) → `fmt`/`validate` → `plan -out=tfplan` → review → `apply tfplan`. In CI: plan on PR (posted as a comment), apply on merge.
- **Providers:** `required_providers { aws = { source = "hashicorp/aws", version = "~> 5.70" } }`; configure region, assume-role; aliases for multiple regions/accounts.
- **Resources & references:** `aws_s3_bucket.logs.arn` creates an implicit **dependency**; Terraform builds a **DAG** and creates independent resources in parallel; `depends_on` only for hidden dependencies.
- **Meta-arguments:** `count`, `for_each` (prefer — stable keys), `lifecycle`, `provider`.
- **Variables / locals / outputs:** inputs with types and validation, computed locals, outputs consumed by other modules or stacks.
- **Modules:** a directory of `.tf` files with inputs/outputs; source from a path, git tag or registry (`terraform-aws-modules/vpc/aws`); keep them small and opinionated; version them.
- **State:** maps config addresses (`aws_instance.web["a"]`) to real IDs and stores attributes; commands `state list`, `state show`, `import`, and `moved` blocks.
- **Plan symbols:** `+` create, `~` update in place, `-/+` destroy and recreate, `-` destroy, `<=` read data.
- Testing: `terraform validate`, `tflint`, `terraform test` (native), Terratest, policy as code (OPA/Conftest, Sentinel), cost estimation (Infracost).

```hcl
terraform {
  required_version = ">= 1.9"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.70" } }
}
provider "aws" { region = "eu-central-1" }

variable "buckets" { type = set(string), default = ["logs", "uploads"] }

resource "aws_s3_bucket" "this" {
  for_each = var.buckets
  bucket   = "acme-prod-${each.key}"
}
resource "aws_s3_bucket_versioning" "this" {
  for_each = aws_s3_bucket.this                       # implicit dependency on the buckets
  bucket   = each.value.id
  versioning_configuration { status = "Enabled" }
}
output "bucket_arns" { value = { for k, b in aws_s3_bucket.this : k => b.arn } }
```

#### Modern C++ example — a mini Terraform: diff desired vs. state into a plan, then apply in dependency (DAG) order
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <queue>
#include <set>
#include <string>
#include <vector>

struct Res { std::map<std::string, std::string> attrs; std::vector<std::string> depends_on; std::set<std::string> force_new; };

int main() {
    std::map<std::string, Res> desired{
        {"aws_vpc.main", {{{"cidr", "10.20.0.0/16"}}, {}, {"cidr"}}},
        {"aws_subnet.a", {{{"cidr", "10.20.0.0/20"}, {"vpc", "aws_vpc.main"}}, {"aws_vpc.main"}, {"cidr"}}},
        {"aws_security_group.web", {{{"ingress", "443"}}, {"aws_vpc.main"}, {}}},
        {"aws_instance.web", {{{"type", "m7g.large"}, {"ami", "ami-0b2"}}, {"aws_subnet.a", "aws_security_group.web"}, {"ami"}}},
    };
    std::map<std::string, std::map<std::string, std::string>> state{
        {"aws_vpc.main", {{"cidr", "10.20.0.0/16"}}},
        {"aws_security_group.web", {{"ingress", "80"}}},
        {"aws_instance.web", {{"type", "m7g.medium"}, {"ami", "ami-0a1"}}},
        {"aws_eip.old", {{"ip", "203.0.113.7"}}},
    };
    std::map<std::string, std::string> plan;
    for (auto& [addr, r] : desired) {
        if (!state.count(addr)) { plan[addr] = "+ create"; continue; }
        std::string action;
        for (auto& [k, v] : r.attrs) if (state[addr][k] != v) action = r.force_new.count(k) ? "-/+ replace (" + k + " forces new)" : (action.empty() ? "~ update " + k : action);
        if (!action.empty()) plan[addr] = action;
    }
    for (auto& [addr, a] : state) if (!desired.count(addr)) plan[addr] = "- destroy";
    int add = 0, change = 0, destroy = 0;
    std::cout << "Terraform plan:\n";
    for (auto& [addr, a] : plan) {
        std::cout << "  " << a << "  " << addr << '\n';
        add += a[0] == '+' || a.rfind("-/+", 0) == 0; change += a[0] == '~'; destroy += a[0] == '-';
    }
    std::cout << "Plan: " << add << " to add, " << change << " to change, " << destroy << " to destroy.\n";

    std::map<std::string, int> indeg;                             // apply: topological order over depends_on
    std::map<std::string, std::vector<std::string>> out;
    for (auto& [addr, r] : desired) { indeg[addr]; for (auto& d : r.depends_on) { out[d].push_back(addr); ++indeg[addr]; } }
    std::queue<std::string> ready;
    for (auto& [a, n] : indeg) if (n == 0) ready.push(a);
    std::cout << "apply order:";
    while (!ready.empty()) { auto a = ready.front(); ready.pop(); std::cout << ' ' << a; for (auto& b : out[a]) if (--indeg[b] == 0) ready.push(b); }
    std::cout << '\n';
}
```

**Output:**
```text
Terraform plan:
  - destroy  aws_eip.old
  -/+ replace (ami forces new)  aws_instance.web
  ~ update ingress  aws_security_group.web
  + create  aws_subnet.a
Plan: 2 to add, 1 to change, 2 to destroy.
apply order: aws_vpc.main aws_security_group.web aws_subnet.a aws_instance.web
```

A replacement counts as one add **and** one destroy — exactly how Terraform's own summary line counts it.

### Interview answer
"Terraform configuration declares resources and data sources through versioned providers, organized into reusable, pinned modules. `init` fetches providers and sets up the backend; `plan` compares configuration with state and real infrastructure and shows creates, in-place updates, replacements and destroys; `apply` executes it in dependency order from a DAG built from references, in parallel where possible. State maps addresses to real resource IDs. I prefer for_each over count for stable addresses, review plans in PRs from CI, and add tflint, terraform test, policy checks and cost estimates."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Why IaC | reviewable, repeatable, auditable, testable, recoverable; no ClickOps |
| CFN / CDK / Terraform | AWS-native + rollback / code constructs → CFN / multi-provider, readable plan, you own state; one tool per resource |
| OpenTofu | open-source Terraform fork (after the 2023 BSL licence change) |
| Parity | same pinned modules, only reviewed variables differ; account + state per env; promote versions via CI |
| Pinning | required_version, providers + lock file, module tags, image digests |
| Secrets | generate + store in Secrets Manager (manage_master_user_password), pass ARNs; `sensitive` ≠ hidden in state |
| State security | remote, encrypted, versioned, tight IAM, never in git; ephemeral values (1.10+) |
| Locking | S3 lockfile / DynamoDB / TF Cloud; force-unlock only when sure |
| Drift | scheduled `plan -detailed-exitcode` (2 = drift); revert or codify; read-only console in prod |
| Lifecycle | prevent_destroy, create_before_destroy, ignore_changes; moved / import / removed blocks |
| Workflow | init → fmt/validate → plan -out → review → apply; plan in PR, apply on merge |
| Plan symbols | + create · ~ update · -/+ replace · - destroy · <= read |
| Testing | tflint, terraform test, Terratest, Conftest/Sentinel, Checkov/tfsec, Infracost |
