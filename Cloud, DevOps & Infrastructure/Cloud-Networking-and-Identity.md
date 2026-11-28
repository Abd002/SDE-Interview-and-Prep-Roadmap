# Cloud Networking and Identity — DNS, CDN, WAF, IAM, VPCs, Security Groups, NACLs and Connectivity

> **What you'll learn:** how a request reaches your app through **cloud DNS, CDN, TLS termination and WAF**; how **IAM roles, policies and temporary credentials** work and how to keep them least-privilege; how a **VPC** is built from **public/private subnets, route tables, internet and NAT gateways**; the difference between **security groups and network ACLs**; and how networks connect with **private endpoints, peering, transit gateways and hybrid links**. Each part has config snippets; parts built on a real algorithm include a runnable C++ implementation.
>
> **Prerequisites:** [DNS](../Networking/DNS.md), [TCP/IP stack](../Networking/TCP-IP-Stack.md), [Infrastructure security](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md). Names are AWS; Azure (VNet, NSG, Front Door) and GCP (VPC, firewall rules, Cloud CDN/Armor) are equivalent.

## Table of Contents
1. [Cloud DNS, TLS termination, CDN, and WAF integration](#1-cloud-dns-tls-termination-cdn-and-waf-integration)
2. [IAM roles/policies, least privilege, and temporary credentials](#2-iam-rolespolicies-least-privilege-and-temporary-credentials)
3. [Private endpoints, peering, transit gateways, and hybrid connectivity](#3-private-endpoints-peering-transit-gateways-and-hybrid-connectivity)
4. [Security groups vs. network ACLs](#4-security-groups-vs-network-acls)
5. [VPC, public/private subnets, route tables, NAT and internet gateways](#5-vpc-publicprivate-subnets-route-tables-nat-and-internet-gateways)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Cloud DNS, TLS termination, CDN, and WAF integration

**In one sentence:** a typical request goes **DNS (Route 53) → CDN edge (CloudFront) with WAF → TLS-terminating load balancer → app**: DNS routes users to the nearest healthy endpoint, the CDN caches content close to users and absorbs attacks, the **WAF** blocks malicious requests, and TLS is terminated (and usually re-encrypted) at the edge and load balancer.

### In plain words
DNS is the phone book that gives the address of the nearest branch. The CDN is a set of local corner shops stocking the most popular items so customers don't travel to the warehouse. The WAF is the security guard at each shop door. TLS is the armoured envelope protecting the message on the way.

### How it works
**DNS (Route 53 / Cloud DNS / Azure DNS)**
- Record types: A/AAAA, CNAME, **alias** records (AWS: point the zone apex `example.com` at a CloudFront/ALB name), MX, TXT (SPF, DKIM, domain verification), CAA (which CAs may issue certs).
- **Routing policies:** simple, weighted (canaries, migrations), latency-based, geolocation/geoproximity, **failover** with health checks, multivalue.
- **TTLs:** short (60 s) for things you may fail over; long for stable records. DNSSEC for integrity; **private hosted zones** for internal names.

**CDN (CloudFront / Cloud CDN / Front Door / Cloudflare)**
- Caches static and cacheable dynamic content at **edge locations**; reduces latency and origin load; **cache key** = path + selected headers/cookies/query params (keep it minimal for a high hit ratio); `Cache-Control` headers and **invalidations** / versioned file names (`app.3f9c.js`).
- Origin protection: **Origin Access Control** for S3, custom headers or private origins for ALBs; signed URLs/cookies for paid content.
- Edge compute: CloudFront Functions / Lambda@Edge for redirects, headers, auth checks.

**TLS termination**
- Certificates from **ACM** (free, auto-renewing) on CloudFront/ALB; TLS 1.2+ (prefer 1.3) security policies; **HSTS**.
- **Re-encrypt** to the origin (edge → ALB → targets over TLS) for end-to-end encryption, or **TLS passthrough** on an NLB when the app must terminate (mTLS to the client).

**WAF (AWS WAF / Cloud Armor / Azure WAF)**
- Managed rule groups (OWASP core rules, known bad inputs, SQLi/XSS), IP reputation lists, **rate-based rules**, geo blocking, bot control, custom rules (block `/admin` from the internet).
- Deploy rules in **count mode** first, watch logs, then block; DDoS protection with **AWS Shield** (Standard always on; Advanced for big targets).

### Interview answer
"Route 53 answers with alias records and routing policies — latency, weighted for canaries, failover with health checks — using short TTLs for anything I might fail over. CloudFront caches at the edge with a minimal cache key and versioned asset names, protects origins with Origin Access Control, and terminates TLS with ACM certificates under a TLS 1.2+ policy, re-encrypting to the ALB. AWS WAF on CloudFront or the ALB applies managed OWASP rules, IP reputation, rate-based rules and custom rules, rolled out in count mode first, with Shield for DDoS."

---

## 2. IAM roles/policies, least privilege, and temporary credentials

**In one sentence:** **IAM** decides **who** (principal) can do **what** (actions) on **which resources** under **which conditions**; humans should use **SSO** and workloads should use **roles**, both receiving **temporary credentials** from **STS**, and every policy should grant the **least privilege** — evaluated with **explicit deny > allow > implicit deny**.

### In plain words
A company badge system: your badge (role) opens specific doors (actions on resources), maybe only during working hours (conditions). Badges are printed fresh every morning and expire at night (temporary credentials). A "no entry" sign beats any badge (explicit deny).

### How it works
- **Principals:** IAM users (avoid for people — use IAM Identity Center/SSO), **roles** (assumed by services, workloads, federated users, other accounts), service principals (`lambda.amazonaws.com`).
- **Policies:** identity-based (attached to users/roles), **resource-based** (S3 bucket policy, KMS key policy, SQS policy), **permission boundaries**, **SCPs/RCPs** (organization guardrails), session policies.
- **Policy document:** `Effect`, `Action`, `Resource`, `Condition` (`aws:SourceVpce`, `aws:MultiFactorAuthPresent`, `aws:PrincipalTag/team`, `aws:RequestedRegion`).
- **Evaluation:** an **explicit Deny** anywhere wins; otherwise you need an **Allow** (and, if present, the SCP and permission boundary must also allow); otherwise **implicit deny**.
- **Roles and trust policies:** the trust policy says **who may assume** the role (an account, a service, an OIDC provider like GitHub Actions or a Kubernetes service account); the permission policy says **what the role can do**.
- **Temporary credentials (STS):** `AssumeRole`, `AssumeRoleWithWebIdentity` (OIDC federation), instance profiles, IRSA / EKS Pod Identity, ECS task roles — expire after 15 min–12 h; no long-lived access keys to leak.
- **Least privilege in practice:** start narrow, use **IAM Access Analyzer** (policy generation from CloudTrail, unused access findings), tag-based ABAC for teams, and review regularly. Escalation risks: see [IAM privilege escalation](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#3-iam-least-privilege-and-privilege-escalation-risks).

```json
{ "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":   { "token.actions.githubusercontent.com:sub": "repo:acme/orders:ref:refs/heads/main" }
    }
  }]}
```
This **trust policy** lets only the `main` branch of `acme/orders` deploy — no static AWS keys in GitHub.

### Interview answer
"IAM evaluates principal, action, resource and conditions: an explicit deny anywhere wins, then organization SCPs and permission boundaries must allow, then an identity or resource policy must allow — otherwise it's an implicit deny. Humans use SSO and workloads use roles, so everyone gets short-lived STS credentials; trust policies control who can assume a role, for example only a specific GitHub repository and branch through OIDC federation. I keep policies to specific actions and resources with conditions like the source VPC endpoint or MFA, and use Access Analyzer to generate and trim them."

---

## 3. Private endpoints, peering, transit gateways, and hybrid connectivity

**In one sentence:** connect networks **privately**: **VPC endpoints / PrivateLink** reach cloud services or other accounts' services without the internet, **VPC peering** links two VPCs directly (non-transitive), **Transit Gateway** is a regional **hub** connecting many VPCs and on-prem networks, and **Site-to-Site VPN** or **Direct Connect** link your data centre to the cloud.

### In plain words
Private corridors between buildings: a private door into the post office (endpoint), a footbridge between two neighbouring buildings (peering), a central train station connecting dozens of buildings (transit gateway), and a tunnel or dedicated road to your old headquarters (VPN / Direct Connect).

### How it works
| Option | What | Notes |
|---|---|---|
| **Gateway endpoint** | S3 and DynamoDB via route-table entries | free; endpoint policies restrict buckets |
| **Interface endpoint (PrivateLink)** | ENI with private IPs for AWS services (SQS, KMS, ECR, STS…) or **your own service behind an NLB** shared with other accounts | per-hour + per-GB; one-way, no overlapping-CIDR issues; security groups apply |
| **VPC peering** | direct link between two VPCs (any account/region) | **not transitive**, no overlapping CIDRs, n×(n−1)/2 links for full mesh |
| **Transit Gateway** | hub-and-spoke router for many VPCs, VPNs, Direct Connect | route tables for segmentation (prod can't reach dev), inter-region peering |
| **Site-to-Site VPN** | IPsec tunnels over the internet | quick, cheap, ~1.25 Gbps per tunnel, variable latency |
| **Direct Connect** | dedicated private fibre (1–100 Gbps) via a partner location | consistent latency, lower egress price; add VPN or a second link for redundancy |
| **Client VPN / identity-aware proxy** | users to private resources | prefer zero-trust access ([zero trust](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#4-network-segmentation-zero-trust-architecture-and-private-access)) |

- Plan **non-overlapping CIDR blocks** across VPCs and on-prem from day one (IPAM).
- **Hybrid DNS:** Route 53 Resolver inbound/outbound endpoints so cloud and on-prem resolve each other's names.
- Private endpoints also cut **NAT gateway** data-processing costs for heavy S3/ECR traffic.

### Interview answer
"For private access to AWS services I use gateway endpoints for S3 and DynamoDB and interface endpoints for the rest, with endpoint policies; PrivateLink also exposes one service behind an NLB to other accounts without network-level access. VPC peering connects two VPCs but isn't transitive and needs non-overlapping CIDRs, so beyond a handful of VPCs I use a Transit Gateway hub with separate route tables to segment prod, dev and shared services. On-prem connects with Site-to-Site VPN for speed or Direct Connect for consistent bandwidth, made redundant, with Route 53 Resolver endpoints for hybrid DNS and CIDRs planned centrally."

---

## 4. Security groups vs. network ACLs

**In one sentence:** **security groups** are **stateful, allow-only** firewalls attached to **network interfaces** (instances, load balancers, endpoints), evaluated as a whole; **network ACLs** are **stateless**, **numbered allow/deny** rules on **subnets**, evaluated in order — so security groups are your main tool and NACLs a coarse extra layer.

### In plain words
A security group is a doorman for one apartment who remembers who left so they can come back in. A network ACL is a gate at the entrance of the whole street that checks a numbered list every single time, in both directions, and forgets everything immediately.

### How it works
| | Security group | Network ACL |
|---|---|---|
| Attached to | ENI (instance, ALB, RDS, Lambda in VPC, endpoints) | subnet |
| State | **stateful** — return traffic allowed automatically | **stateless** — must allow return traffic (ephemeral ports 1024–65535) explicitly |
| Rules | **allow only**; all rules evaluated together | **allow and deny**; numbered, **first match wins** |
| Sources | CIDRs, prefix lists, **other security groups** | CIDRs only |
| Default | inbound denied, outbound all allowed | default NACL allows all; custom NACL denies all |
| Typical use | per-tier rules: `alb-sg` → `app-sg:8443` → `db-sg:5432` | blocking a known bad CIDR, subnet-level guardrails, compliance |

- Reference **security groups instead of IP ranges** — rules follow instances as they scale.
- Restrict **outbound** too for sensitive tiers (DBs don't need the internet).
- Remember stateless NACLs when debugging "inbound works, responses vanish": the ephemeral-port outbound rule is missing.

### Interview answer
"Security groups are stateful allow-lists on network interfaces — replies are automatic, all rules are evaluated together, and they can reference other security groups, so I model tiers like ALB to app to database with them. Network ACLs are stateless, ordered allow-and-deny rules on subnets with first match winning, so return traffic on ephemeral ports must be allowed explicitly. I rely on security groups for real access control and use NACLs only as a coarse subnet guardrail, for example blocking a known bad range."

---

## 5. VPC, public/private subnets, route tables, NAT and internet gateways

**In one sentence:** a **VPC** is your private network (a CIDR like `10.0.0.0/16`) split into **subnets** per AZ; a subnet is **public** if its **route table** sends `0.0.0.0/0` to an **internet gateway**, **private** if it sends it to a **NAT gateway** (outbound only) or nowhere; put load balancers in public subnets and apps and databases in private ones.

### In plain words
The VPC is your company campus with private street addresses. Public subnets are buildings facing the main road with a front door to the city (internet gateway). Private subnets are back buildings: staff can send letters out through the mailroom (NAT gateway), but nobody from the city can walk in.

### How it works
- **CIDR planning:** e.g. VPC `10.20.0.0/16`; per AZ a `/20` public and a `/19` private subnet (AWS reserves 5 IPs per subnet); avoid overlaps with other VPCs and on-prem.
- **Internet gateway (IGW):** attached to the VPC; resources need a **public IP** and a route to the IGW to be reachable.
- **NAT gateway:** in a **public** subnet, gives private subnets **outbound-only** internet (package downloads, third-party APIs); one per AZ for HA (cross-AZ NAT traffic costs money and adds an AZ dependency); charged per hour **and per GB** — use VPC endpoints for S3/ECR to cut costs. **Egress-only IGW** for IPv6.
- **Route tables:** most specific prefix wins (`10.20.0.0/16 → local`, `0.0.0.0/0 → igw-…` or `nat-…`, `10.30.0.0/16 → tgw-…`, `pl-s3 → vpce-…`).
- **Three-tier layout:** public (ALB, NAT) → private app subnets → isolated data subnets (no route to the internet at all).
- **Flow Logs** for troubleshooting and security; **IPv6** dual-stack is increasingly common.

```hcl
# Terraform excerpt using the community VPC module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.13.0"
  name    = "orders-prod"
  cidr    = "10.20.0.0/16"
  azs              = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
  public_subnets   = ["10.20.0.0/20", "10.20.16.0/20", "10.20.32.0/20"]
  private_subnets  = ["10.20.64.0/19", "10.20.96.0/19", "10.20.128.0/19"]
  database_subnets = ["10.20.192.0/22", "10.20.196.0/22", "10.20.200.0/22"]
  enable_nat_gateway     = true
  one_nat_gateway_per_az = true
  enable_flow_log        = true
}
```

#### Modern C++ example — longest-prefix-match routing for public, private and isolated subnets
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

std::uint32_t ip(const std::string& s) { std::istringstream in(s); std::uint32_t a, b, c, d; char x; in >> a >> x >> b >> x >> c >> x >> d; return (a << 24) | (b << 16) | (c << 8) | d; }
struct Route { std::string cidr; std::string target; };

std::string lookup(const std::vector<Route>& table, const std::string& dest) {
    int best_len = -1; std::string best = "blackhole (no route)";
    for (auto& r : table) {
        auto slash = r.cidr.find('/');
        int len = std::stoi(r.cidr.substr(slash + 1));
        std::uint32_t net = ip(r.cidr.substr(0, slash)), mask = len == 0 ? 0 : 0xFFFFFFFFu << (32 - len);
        if ((ip(dest) & mask) == (net & mask) && len > best_len) { best_len = len; best = r.target; }   // longest prefix wins
    }
    return best;
}

int main() {
    std::vector<Route> public_rt{{"10.20.0.0/16", "local"}, {"0.0.0.0/0", "igw-0a1 (internet gateway)"}};
    std::vector<Route> private_rt{{"10.20.0.0/16", "local"}, {"10.30.0.0/16", "tgw-77 (transit gateway)"}, {"52.216.0.0/15", "vpce-s3 (gateway endpoint)"}, {"0.0.0.0/0", "nat-0b2 (NAT gateway, outbound only)"}};
    std::vector<Route> isolated_rt{{"10.20.0.0/16", "local"}};
    for (std::string d : {"10.20.70.5", "93.184.216.34"}) std::cout << "public  subnet -> " << d << ": " << lookup(public_rt, d) << '\n';
    for (std::string d : {"10.20.70.5", "10.30.4.9", "52.217.10.1", "93.184.216.34"}) std::cout << "private subnet -> " << d << ": " << lookup(private_rt, d) << '\n';
    for (std::string d : {"10.20.70.5", "93.184.216.34"}) std::cout << "db (isolated) -> " << d << ": " << lookup(isolated_rt, d) << '\n';
}
```

**Output:**
```text
public  subnet -> 10.20.70.5: local
public  subnet -> 93.184.216.34: igw-0a1 (internet gateway)
private subnet -> 10.20.70.5: local
private subnet -> 10.30.4.9: tgw-77 (transit gateway)
private subnet -> 52.217.10.1: vpce-s3 (gateway endpoint)
private subnet -> 93.184.216.34: nat-0b2 (NAT gateway, outbound only)
db (isolated) -> 10.20.70.5: local
db (isolated) -> 93.184.216.34: blackhole (no route)
```

### Interview answer
"A VPC is a private CIDR range split into subnets per AZ. A subnet is public when its route table sends 0.0.0.0/0 to an internet gateway and resources have public IPs; private subnets route outbound traffic through a NAT gateway in a public subnet — one per AZ for availability — and isolated data subnets have no internet route at all. Route tables use longest-prefix match, so I add more specific routes to a transit gateway or VPC endpoints, which also saves NAT data charges. The usual layout is ALB and NAT public, apps private, databases isolated, with non-overlapping CIDRs and flow logs."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| DNS | alias at apex; weighted / latency / geo / failover + health checks; short TTL for failover; CAA, DNSSEC, private zones |
| CDN | edge caching, minimal cache key, versioned assets, OAC for S3, signed URLs, edge functions |
| TLS | ACM certs, TLS 1.2+/1.3 policy, HSTS, re-encrypt to origin or NLB passthrough |
| WAF | managed OWASP rules, IP reputation, rate-based rules, custom rules; count mode first; Shield for DDoS |
| IAM evaluation | explicit deny > SCP/boundary must allow > allow > implicit deny |
| IAM practice | SSO for humans, roles for workloads, STS temporary creds, trust policies, conditions, Access Analyzer |
| OIDC federation | GitHub Actions / K8s SA → AssumeRoleWithWebIdentity; no static keys |
| Endpoints | gateway (S3, DynamoDB, free) · interface/PrivateLink (other services, your own NLB services) |
| Peering vs. TGW | peering: 1:1, not transitive, no CIDR overlap · TGW: hub, route tables for segmentation |
| Hybrid | Site-to-Site VPN (fast, cheap) · Direct Connect (consistent, dedicated) · Route 53 Resolver endpoints |
| SG vs. NACL | stateful allow-only on ENIs, SG references · stateless numbered allow/deny on subnets, first match, ephemeral ports |
| VPC | CIDR plan, subnets per AZ; public = route to IGW; private = NAT (per AZ); isolated = no internet |
| Routing | longest prefix wins; local, IGW, NAT, TGW, endpoints; flow logs |
