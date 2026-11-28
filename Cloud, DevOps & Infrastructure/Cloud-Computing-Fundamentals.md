# Cloud Computing Fundamentals — HA vs. DR, Scaling, Service Models, Deployment Models and Regions

> **What you'll learn:** the difference between **high availability** and **disaster recovery** (with **RTO** and **RPO**), **horizontal vs. vertical scaling** and why **stateless** services scale easily, **IaaS vs. PaaS vs. SaaS** and the **shared responsibility model**, **public, private, hybrid and multi-cloud** trade-offs, and how **regions, availability zones, fault domains and global services** shape every architecture.
>
> **Prerequisites:** [Scalability](../System%20Design/Scalability.md), [Reliability Engineering (SRE)](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md). Examples use AWS names; Azure and Google Cloud have direct equivalents.

## Table of Contents
1. [High availability vs. disaster recovery; RTO and RPO](#1-high-availability-vs-disaster-recovery-rto-and-rpo)
2. [Horizontal vs. vertical scaling; stateless vs. stateful services](#2-horizontal-vs-vertical-scaling-stateless-vs-stateful-services)
3. [IaaS vs. PaaS vs. SaaS; shared responsibility model](#3-iaas-vs-paas-vs-saas-shared-responsibility-model)
4. [Public, private, hybrid, and multi-cloud trade-offs](#4-public-private-hybrid-and-multi-cloud-trade-offs)
5. [Regions, availability zones, fault domains, and global services](#5-regions-availability-zones-fault-domains-and-global-services)
6. [Cheat sheet](#cheat-sheet)

---

## 1. High availability vs. disaster recovery; RTO and RPO

**In one sentence:** **high availability (HA)** keeps a service running through **common, small failures** (a server, a disk, an availability zone) **automatically and continuously**, while **disaster recovery (DR)** restores service after **rare, large failures** (a whole region, data corruption, ransomware, a bad deploy that deletes data) — measured by **RTO** (how long you're down) and **RPO** (how much data you lose).

### In plain words
HA is a car with a spare tyre that changes itself while you drive. DR is roadside assistance and insurance when the car is wrecked: slower, but it gets you going again.

### How it works
| | High availability | Disaster recovery |
|---|---|---|
| Handles | instance, disk, rack, AZ failures | region outage, corruption, deletion, ransomware, account compromise |
| How | redundancy across AZs, load balancers, health checks, automatic failover, multi-AZ databases | backups, cross-region replication, standby environments, runbooks, drills |
| Speed | seconds–minutes, automatic | minutes–hours, often partly manual |
| Measured by | availability % (SLO) | **RTO** and **RPO** |

- **RTO (Recovery Time Objective):** maximum acceptable time to restore service.
- **RPO (Recovery Point Objective):** maximum acceptable data loss, measured in time ("we can lose at most 5 minutes of writes").
- HA **doesn't** replace DR: replication happily copies a `DROP TABLE` or ransomware encryption to every replica. You need **point-in-time backups** and **immutable copies**.
- DR strategies: backup & restore → pilot light → warm standby → multi-site active-active ([details](../Testing%2C%20Reliability%20%26%20Observability/Reliability-Engineering-SRE.md#4-disaster-recovery-drills-backups-and-restore-verification)); cost rises as RTO/RPO shrink.

### Interview answer
"High availability handles frequent small failures automatically — redundant instances across availability zones behind load balancers, multi-AZ databases with automatic failover — and is measured by uptime. Disaster recovery handles rare big events like a region outage, data corruption or ransomware, and is defined by RTO, how long we may be down, and RPO, how much data we may lose. Replication isn't a backup, so DR needs point-in-time and immutable backups, and I choose backup-and-restore, pilot light, warm standby or active-active per service by its RTO and RPO versus cost."

---

## 2. Horizontal vs. vertical scaling; stateless vs. stateful services

**In one sentence:** **vertical scaling** (scale up) makes one machine bigger, **horizontal scaling** (scale out) adds more machines; horizontal scaling is easy for **stateless** services (any instance can serve any request) and hard for **stateful** ones (data or sessions live on a specific instance), so you move state into **shared stores** or **partition** it.

### In plain words
A busy restaurant can buy a bigger stove (vertical) or open more counters (horizontal). More counters only work if any cook can serve any customer — which is easy if orders are on a shared screen (stateless), and hard if each cook keeps the orders in their own head (stateful).

### How it works
| | Vertical (up) | Horizontal (out) |
|---|---|---|
| How | bigger instance (more CPU/RAM/IOPS) | more instances behind a load balancer |
| Limit | the biggest machine available; one failure domain | practically unlimited |
| Downtime | often a restart | none (add/remove instances) |
| Complexity | none in code | load balancing, state management, consistency |
| Good for | databases (to a point), legacy apps, quick wins | web/API tiers, workers, stateless services |

- **Stateless service:** keeps no client-specific data between requests in local memory/disk — sessions in Redis/DB or in signed tokens, files in S3, caches as optional. Then **autoscaling** and rolling deploys are trivial.
- **Stateful service:** databases, caches, brokers, WebSocket/game servers, stream processors. Scale with **replication** (read replicas), **partitioning/sharding** ([consistent hashing](../System%20Design/Scalability.md#2-consistent-hashing)), sticky sessions (last resort), or managed services that handle it (DynamoDB, Aurora, MSK).
- **Amdahl's law:** a serial/shared part (one database, one lock) caps how far scale-out helps.

### Interview answer
"Vertical scaling buys a bigger machine — simple, but capped and a single failure domain; horizontal scaling adds instances behind a load balancer and is how web tiers grow. It works smoothly only for stateless services, so I keep sessions in Redis or tokens, files in object storage, and treat local caches as optional; then autoscaling and rolling deploys are easy. Stateful systems like databases scale with read replicas, partitioning or managed services, and I watch for shared bottlenecks because Amdahl's law caps the speedup."

---

## 3. IaaS vs. PaaS vs. SaaS; shared responsibility model

**In one sentence:** **IaaS** rents you raw infrastructure (VMs, networks, disks), **PaaS** runs your code or data on a managed platform, **SaaS** is a finished application — and under the **shared responsibility model** the provider secures **the cloud** (hardware, facilities, the managed layers), while **you** always secure what you put **in** it (data, identities, configuration, code).

### In plain words
Pizza as a service: IaaS is renting a kitchen (you buy ingredients and cook), PaaS is a pizza place that bakes the pizza you designed, SaaS is pizza delivered to your door. But even with delivery, **you** decide who's allowed to open your front door.

### How it works
| Layer | On-premises | IaaS (EC2, VPC, EBS) | PaaS / serverless (Lambda, RDS, App Engine, Fargate) | SaaS (Gmail, Salesforce, Slack) |
|---|---|---|---|---|
| Data, access, identities | you | you | you | **you** |
| Application code | you | you | you | provider |
| Runtime, middleware | you | you | provider | provider |
| OS patching | you | **you** | provider | provider |
| Virtualization, hardware, network, facilities | you | provider | provider | provider |

- **Always yours, in every model:** data classification and encryption choices, IAM users/roles and MFA, configuration (public buckets!), network exposure, logging/monitoring, and how you use the service. Most cloud breaches are **customer misconfigurations**.
- Higher in the stack = **less operational work and less control**; also more lock-in ([managed vs. self-hosting](./Cloud-Cost-Capacity-and-Operations.md#4-operational-trade-offs-managed-services-vs-self-hosting)).
- Other terms: **FaaS** (functions), **CaaS** (containers as a service: ECS/Fargate, Cloud Run), **DBaaS**.

### Interview answer
"IaaS gives raw VMs, networks and disks — maximum control, and I patch the OS; PaaS and serverless run my code or database on a managed platform, so the provider handles OS and runtime; SaaS is a complete application. Under the shared responsibility model the provider secures the infrastructure and whatever layers it manages, but in every model I own my data, identities, access configuration, network exposure and monitoring — which is where most cloud breaches happen. Moving up the stack trades control and portability for less operational work."

---

## 4. Public, private, hybrid, and multi-cloud trade-offs

**In one sentence:** **public cloud** rents shared infrastructure on demand, **private cloud** runs cloud-style infrastructure dedicated to one organization, **hybrid** connects on-premises/private with public cloud, and **multi-cloud** uses several public providers — each trades **cost, control, compliance, speed and complexity** differently.

### In plain words
Renting a flat (public), owning a house (private), owning a house plus renting a holiday flat for summer guests (hybrid), and renting flats from several landlords so no single one can trap you (multi-cloud) — at the price of managing several contracts and sets of keys.

### How it works
| Model | Why choose it | Costs / risks |
|---|---|---|
| **Public** (AWS, Azure, GCP, Oracle, local providers) | elasticity, managed services, global reach, pay-as-you-go, fast start | variable bills, provider dependency, data-residency questions |
| **Private** (OpenStack, VMware, bare metal, Kubernetes on-prem) | control, predictable cost at steady high utilization, strict data rules, special hardware | capex, staff to run it, slower innovation, capacity planning |
| **Hybrid** | keep regulated data or legacy systems on-prem, burst to cloud, gradual migration, edge/factory sites | networking (VPN/Direct Connect), consistent identity and tooling, latency between sites |
| **Multi-cloud** | avoid lock-in, best-of-breed services, regulatory or customer demands, resilience against one provider | lowest-common-denominator designs, multiple skill sets, egress costs, more security surface |

- "Multi-cloud for resilience" is expensive: active-active across providers needs portable data layers and doubles operations. Many teams pick **one primary cloud** + **portable building blocks** (Kubernetes, Terraform, Postgres, OpenTelemetry) + an **exit plan**.
- **Data residency / sovereignty** (e.g. GDPR, local banking rules) often drives region choice and hybrid designs.
- **Egress fees** (data leaving a cloud) often dominate multi-cloud and hybrid costs.

### Interview answer
"Public cloud gives elasticity and managed services fastest; private cloud gives control and predictable cost at high steady utilization, plus strict data rules, at the price of running it; hybrid connects the two for regulated or legacy systems and gradual migration; multi-cloud avoids dependence on one provider but adds lowest-common-denominator designs, more skills and egress costs. I'd usually pick one primary cloud, keep portable building blocks like Kubernetes, Terraform and Postgres, and have an exit plan, choosing hybrid when data residency or legacy systems demand it."

---

## 5. Regions, availability zones, fault domains, and global services

**In one sentence:** a **region** is a geographic area (e.g. `eu-central-1` Frankfurt) made of several **availability zones** — separate data centres with independent power, cooling and networking, connected by low-latency links — so you spread replicas across **AZs for HA**, across **regions for DR and latency**, and know which services are **zonal, regional or global**.

### In plain words
A region is a city; availability zones are separate buildings in different neighbourhoods with their own power. If one building loses power, the others keep running. A whole city can still have a disaster, so for the worst case you keep a copy in another city.

### How it works
- **Fault domains (smallest to largest):** host → rack → AZ → region → the provider's global control plane. Spread redundancy across the domain you need to survive.
- **Zonal services:** EC2 instances, EBS volumes, subnets — they live in one AZ. **Regional:** S3, DynamoDB, SQS, Lambda, ALB (spans AZs), RDS Multi-AZ. **Global:** IAM, Route 53, CloudFront, Global Accelerator — but some have their **control plane in one region** (e.g. `us-east-1`), so design for the **data plane** to keep working if the control plane is down.
- **Latency:** within an AZ < 1 ms, between AZs ~1–2 ms, between regions tens to hundreds of ms — synchronous replication across regions is slow.
- **Choosing regions:** distance to users, data-residency rules, service availability, price (varies by region), and a second region for DR.
- **Typical HA layout:** ALB across 3 AZs → app instances in each AZ (N+1 so losing one AZ leaves enough capacity) → Multi-AZ database.
- **Static stability:** pre-provision enough capacity in the remaining AZs so you don't depend on launching new instances during an AZ outage.

### Interview answer
"A region is a geographic area of several availability zones — independent data centres with separate power and networking, a millisecond or two apart. I spread replicas across at least two, usually three AZs for high availability, with enough pre-provisioned capacity that losing one AZ still covers peak, and use a second region for disaster recovery and latency, accepting that cross-region sync replication is slow. I also know which services are zonal, regional or global and keep data planes independent of global control planes that live in a single region."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| HA vs. DR | small frequent failures, automatic / rare big failures, RTO + RPO |
| RTO / RPO | downtime allowed / data loss allowed; replication ≠ backup |
| DR strategies | backup & restore → pilot light → warm standby → active-active (cost ↑, RTO/RPO ↓) |
| Vertical vs. horizontal | bigger box (capped) vs. more boxes (needs statelessness) |
| Stateless | sessions in Redis/tokens, files in S3, caches optional → easy autoscaling |
| Stateful | replicas, partitioning, managed services; Amdahl caps speedup |
| IaaS / PaaS / SaaS | you patch the OS / provider runs the platform / finished app |
| Shared responsibility | provider: security **of** the cloud; you: **in** it — data, IAM, config, exposure, monitoring |
| Deployment models | public (speed), private (control), hybrid (legacy/regulated + cloud), multi-cloud (no lock-in, high complexity) |
| Regions / AZs | region = several AZs with independent power; spread across AZs for HA, regions for DR |
| Scope | zonal (EC2, EBS) · regional (S3, DynamoDB, SQS, ALB) · global (IAM, Route 53, CloudFront) |
| Static stability | enough capacity in remaining AZs without launching new instances |
