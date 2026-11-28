# AWS Compute and Application Hosting — API Gateway, Lambda, EC2, Containers and Load Balancers

> **What you'll learn:** how **API Gateway** fronts and integrates services, how **Lambda** works (triggers, **cold starts**, **concurrency**, **idempotency**), the **EC2** basics (instance families, AMIs, security groups, auto scaling groups), how to choose between **ECS/Fargate, EKS, EC2 and Lambda**, and how **ALB/NLB** load balancers and **health checks** work. Each part has config snippets.
>
> **Prerequisites:** [Cloud Computing Fundamentals](./Cloud-Computing-Fundamentals.md), [HTTP](../Networking/HTTP.md). Azure/GCP equivalents: API Management / API Gateway, Azure Functions / Cloud Functions & Cloud Run, VMs / Compute Engine, AKS / GKE, Application Gateway / Cloud Load Balancing.

## Table of Contents
1. [API Gateway and service integration patterns](#1-api-gateway-and-service-integration-patterns)
2. [AWS Lambda: triggers, cold starts, concurrency, and idempotency](#2-aws-lambda-triggers-cold-starts-concurrency-and-idempotency)
3. [EC2: instance families, AMIs, security groups, and auto scaling groups](#3-ec2-instance-families-amis-security-groups-and-auto-scaling-groups)
4. [ECS/Fargate vs. EKS vs. EC2 vs. Lambda deployment decisions](#4-ecsfargate-vs-eks-vs-ec2-vs-lambda-deployment-decisions)
5. [Elastic Load Balancing (ALB/NLB) and health checks](#5-elastic-load-balancing-albnlb-and-health-checks)
6. [Cheat sheet](#cheat-sheet)

---

## 1. API Gateway and service integration patterns

**In one sentence:** **Amazon API Gateway** is a managed front door for APIs — it terminates TLS, authenticates (IAM, Cognito/JWT authorizers, Lambda authorizers), throttles, validates requests, and **integrates** with backends such as Lambda, HTTP services, private VPC services, or **directly** with AWS services (SQS, DynamoDB, Step Functions) without any code.

### In plain words
A hotel reception: guests talk only to reception, which checks IDs, enforces "max 3 requests a minute", and forwards each request to the right department — sometimes straight into the right in-tray without bothering a person.

### How it works
| Flavour | Use |
|---|---|
| **HTTP API** | cheaper, faster, JWT authorizers, Lambda/HTTP integrations — default for most new APIs |
| **REST API** | more features: request validation, usage plans & API keys, caching, request/response mapping, AWS service integrations, private APIs, WAF |
| **WebSocket API** | bidirectional connections (chat, live updates) |

**Integration patterns**
- **Lambda proxy:** the whole request goes to a function — simplest serverless API.
- **HTTP proxy:** forward to an existing service (ALB, or private via **VPC Link** to an NLB/ALB).
- **Direct service integration** ("storage-first"): `POST /orders` → **SQS SendMessage** or **Step Functions StartExecution** with a mapping template — returns 202 instantly, processing happens asynchronously, fewer moving parts.
- **Backend-for-frontend / aggregation:** a Lambda combining several services for one client.
- **Limits to know:** default integration timeout 29 s (REST/HTTP APIs), payload 10 MB; use async patterns for long work.
- **Throttling:** account and per-route/per-key limits (token bucket), returns 429; usage plans for API keys.

```yaml
# AWS SAM excerpt: HTTP API with a JWT authorizer and a Lambda integration
Resources:
  OrdersApi:
    Type: AWS::Serverless::HttpApi
    Properties:
      Auth:
        DefaultAuthorizer: Cognito
        Authorizers:
          Cognito: { IdentitySource: "$request.header.Authorization", JwtConfiguration: { issuer: !Sub "https://cognito-idp.${AWS::Region}.amazonaws.com/${UserPool}", audience: [!Ref AppClient] } }
  CreateOrder:
    Type: AWS::Serverless::Function
    Properties: { Handler: app.create, Runtime: python3.12, Events: { Post: { Type: HttpApi, Properties: { ApiId: !Ref OrdersApi, Path: /orders, Method: POST } } } }
```

### Interview answer
"API Gateway is the managed front door: TLS, authentication with IAM, JWT or Lambda authorizers, throttling and usage plans, request validation, and routing. HTTP APIs are the cheaper default; REST APIs add validation, caching, API keys, private APIs and direct AWS service integrations. I use Lambda proxy for serverless handlers, VPC Link to reach private services, and for writes that can be asynchronous a storage-first integration straight into SQS or Step Functions that returns 202 — which also sidesteps the 29-second integration timeout."

---

## 2. AWS Lambda: triggers, cold starts, concurrency, and idempotency

**In one sentence:** **Lambda** runs your function in managed, short-lived execution environments in response to **triggers** (API Gateway, SQS, S3, EventBridge, DynamoDB/Kinesis streams); you need to understand **cold starts** (time to create a new environment), **concurrency** (one environment per in-flight request, with account and reserved limits), and **idempotency**, because most triggers deliver **at least once**.

### In plain words
A food truck fleet that appears on demand: when orders come in, trucks are dispatched. The first truck needs time to set up the kitchen (cold start); later orders to the same truck are fast (warm). There's a limit to how many trucks the city allows at once (concurrency), and sometimes the same order arrives twice, so cooks check the order number (idempotency).

### How it works
**Invocation types**
| Type | Triggers | Retries |
|---|---|---|
| **Synchronous** | API Gateway, ALB, SDK `Invoke` | caller handles errors |
| **Asynchronous** | S3, SNS, EventBridge | Lambda retries 2× by default, then an on-failure **destination** / DLQ |
| **Poll-based (event source mapping)** | SQS, Kinesis, DynamoDB Streams, Kafka/MSK | batches; failures retried (SQS: until visibility timeout/maxReceiveCount → DLQ; streams: block the shard until success or bisect/skip) — use **partial batch responses** |

**Cold starts:** download code, start runtime, run init code (outside the handler). Typically ~100 ms to 1 s+ (bigger for Java/.NET, large packages, VPC-attached functions used to be slow). Mitigate: small packages, lazy init, reuse clients across invocations, **Provisioned Concurrency**, **SnapStart** (Java, Python, .NET), arm64 (Graviton).

**Concurrency:** concurrent executions ≈ requests/s × average duration (s). Default **account limit 1,000** per region (raisable); **reserved concurrency** guarantees and caps a function; bursts scale at a limited rate (each function can add up to 1,000 concurrent environments every 10 seconds). Protect downstream databases with reserved concurrency limits and **RDS Proxy**.

**Idempotency:** use an idempotency key (message ID, request ID, business key) stored with a conditional write (DynamoDB `attribute_not_exists`) — AWS **Powertools for Lambda** has an idempotency utility.

**Other limits:** max timeout **15 minutes**, memory 128 MB–10 GB (CPU scales with memory), `/tmp` up to 10 GB, payload 6 MB sync.

### Interview answer
"Lambda runs handlers in managed execution environments: synchronous for API Gateway, asynchronous with retries and destinations for S3 or EventBridge, and polling event-source mappings for SQS and streams with partial batch failure reporting. Cold starts happen when a new environment initializes, so I keep packages small, initialize clients outside the handler, and use provisioned concurrency or SnapStart for latency-sensitive paths. Concurrency is roughly rate times duration against a regional limit, and I cap functions with reserved concurrency to protect databases. Because delivery is at least once, handlers are idempotent with a conditional write on a request or message ID."

---

## 3. EC2: instance families, AMIs, security groups, and auto scaling groups

**In one sentence:** **EC2** gives you virtual machines: pick an **instance family** for the workload (general, compute, memory, storage, accelerated), boot from an **AMI** (machine image), control traffic with **security groups** (stateful firewalls), and run fleets with **Auto Scaling Groups** that replace unhealthy instances and scale on metrics.

### In plain words
Renting computers: choose the kind (fast CPU, lots of memory, big disks, GPUs), start them from a saved template (AMI), put a doorman in front of each (security group), and hire a manager (auto scaling group) who keeps the right number running and replaces broken ones.

### How it works
**Instance naming** `m7g.large` = family **m** (general purpose), generation **7**, attribute **g** (Graviton/ARM), size **large**.
| Family | For |
|---|---|
| **t** (burstable), **m** (general) | web apps, small services |
| **c** (compute) | CPU-heavy: encoding, batch, high-traffic APIs |
| **r / x** (memory) | in-memory caches, big databases, analytics |
| **i / d** (storage) | local NVMe for databases, search |
| **p / g / inf / trn** (accelerated) | ML training/inference, graphics |
Graviton (ARM) instances are usually ~20–40% better price-performance if your software runs on ARM.

**AMIs:** OS + preinstalled software; build **golden AMIs** with Packer/EC2 Image Builder (immutable infrastructure) instead of configuring servers by hand; patch by building a new AMI and rolling the fleet.

**Security groups:** stateful (return traffic allowed automatically), **allow rules only**, can reference other security groups (`db-sg` allows 5432 from `app-sg`). No SSH from `0.0.0.0/0` — use SSM Session Manager.

**Auto Scaling Groups:** launch template + min/desired/max + subnets in several AZs; **health checks** (EC2 or ELB) replace bad instances; scaling policies: **target tracking** (keep CPU at 50% / requests per target at 1,000), step, scheduled, predictive; **instance refresh** for rolling AMI updates; mixed instances + Spot.

```hcl
# Terraform excerpt: ASG across 3 AZs with target tracking
resource "aws_autoscaling_group" "web" {
  min_size = 3
  max_size = 30
  vpc_zone_identifier = var.private_subnet_ids          # one per AZ
  health_check_type   = "ELB"
  target_group_arns   = [aws_lb_target_group.web.arn]
  launch_template { id = aws_launch_template.web.id, version = "$Latest" }
}
resource "aws_autoscaling_policy" "cpu50" {
  autoscaling_group_name = aws_autoscaling_group.web.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification { predefined_metric_type = "ASGAverageCPUUtilization" }
    target_value = 50
  }
}
```

### Interview answer
"I pick the instance family by bottleneck — general m, compute c, memory r, storage i, accelerated p/g — preferring Graviton when the stack supports ARM. Instances boot from golden AMIs built with Packer or Image Builder, so patching is a new AMI and an instance refresh, not SSH. Security groups are stateful allow-lists that reference each other, with no public SSH — Session Manager instead. Fleets run in Auto Scaling Groups across three AZs with ELB health checks and target tracking on CPU or requests per target, plus warm pools or predictive scaling for fast ramps."

---

## 4. ECS/Fargate vs. EKS vs. EC2 vs. Lambda deployment decisions

**In one sentence:** choose the compute platform by **how much you want to manage** versus **how much control and portability you need**: **Lambda** (no servers, event-driven, short tasks), **ECS on Fargate** (containers without managing servers), **EKS** (Kubernetes — portable, huge ecosystem, more operations), **EC2** (full control of the machine).

### In plain words
Getting to work: a taxi (Lambda — just say where), a rented car with servicing included (Fargate), your own fleet with a professional garage system (Kubernetes/EKS), or building your own car (EC2).

### How it works
| | Lambda | ECS + Fargate | EKS (Kubernetes) | EC2 |
|---|---|---|---|---|
| You manage | code | container image + task definition | cluster add-ons, node groups (or Fargate/Auto Mode), manifests | OS, runtime, scaling, patching |
| Max duration | 15 min | unlimited | unlimited | unlimited |
| Scaling | per request, to thousands fast | tasks via service auto scaling | HPA/KEDA + Karpenter/cluster autoscaler | ASGs |
| Cold start | yes | task start (~30–60 s) | pod start (seconds if nodes exist) | instance boot (minutes) |
| Cost model | per request + GB-second (great for spiky/low traffic) | per vCPU/GB-second of tasks | control-plane fee + nodes | per instance-second |
| Portability | low | medium | **high** (any Kubernetes) | high |
| Best for | event processing, glue, spiky APIs | most container microservices, small teams | many services, platform teams, multi-cloud, operators | special hardware, licensing, legacy, extreme tuning |

**Rules of thumb**
- Steady high traffic → containers/EC2 are usually cheaper than Lambda; spiky or low traffic → Lambda.
- Long-running connections (WebSockets at scale, streaming), GPUs, or > 15 min jobs → not Lambda.
- No platform team → ECS/Fargate over EKS. Already invested in Kubernetes tooling or need portability → EKS.
- Batch jobs → AWS Batch, ECS tasks, or Step Functions + Lambda.

### Interview answer
"I choose by operational burden versus control. Lambda for event-driven, spiky or low-traffic work under 15 minutes — no servers, pay per use, with cold starts and concurrency limits to manage. ECS on Fargate as the default for containerized services when there's no dedicated platform team. EKS when we need Kubernetes' ecosystem, portability or many services run by a platform team. EC2 for GPUs, special licensing, legacy software or deep tuning. Cost crosses over: steady high throughput is usually cheaper on containers than Lambda."

---

## 5. Elastic Load Balancing (ALB/NLB) and health checks

**In one sentence:** **ALB** (Application Load Balancer, layer 7) routes HTTP/HTTPS/gRPC by host, path, headers and more, while **NLB** (Network Load Balancer, layer 4) forwards TCP/UDP/TLS with ultra-low latency and static IPs; both use **health checks** to send traffic only to healthy targets and drain connections gracefully.

### In plain words
A hotel concierge (ALB) reads each guest's request and sends them to the right desk — spa, restaurant, rooms. A fast sorting machine at the door (NLB) just pushes each car to an open parking lane without reading anything. Both skip desks or lanes that are closed (health checks).

### How it works
| | ALB (L7) | NLB (L4) |
|---|---|---|
| Protocols | HTTP/1.1, HTTP/2, gRPC, WebSocket | TCP, UDP, TLS |
| Routing | host, path, headers, query, method, weighted target groups | port → target group |
| Features | TLS termination, redirects, fixed responses, OIDC/Cognito auth, WAF | static/Elastic IPs, preserves client IP, PrivateLink, millions of rps |
| Latency | ms | lower (µs) |
| Use | web apps, APIs, microservices, canaries (weighted) | non-HTTP protocols, extreme throughput, static IPs, private services |

(Also **Gateway Load Balancer** for inline network appliances.)

**Health checks**
- Configure path (`/healthz`), interval (e.g. 10 s), timeout, **healthy/unhealthy thresholds** (e.g. 2 / 3), success codes.
- A **liveness**-style check (process up) vs. a **readiness**-style check (can serve: config loaded, can reach critical dependencies). Be careful: if every instance fails because a **shared dependency** is down, the LB has nothing healthy (ALB then "fails open" and sends to all targets) — keep health checks focused on the instance itself.
- **Deregistration delay** (connection draining, default 300 s; often 30–60 s) lets in-flight requests finish during deploys and scale-in.
- **Cross-zone load balancing** spreads traffic evenly across AZs; **slow start** ramps new targets gradually.

### Interview answer
"ALB is layer 7: it terminates TLS and routes HTTP, gRPC and WebSockets by host, path or headers, supports weighted target groups for canaries, and integrates WAF and OIDC auth. NLB is layer 4 for TCP, UDP and TLS with very low latency, static IPs, client IP preservation and PrivateLink. Health checks hit a focused endpoint with interval and healthy/unhealthy thresholds that balance detection speed against flapping; I avoid making them depend on shared downstream services, since if all targets fail the ALB fails open. Deregistration delay drains connections during deploys, and cross-zone balancing and slow start smooth traffic."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| API Gateway | HTTP API (cheap default) vs. REST API (validation, keys, caching, service integrations); authorizers; throttling 429; 29 s integration timeout |
| Integration patterns | Lambda proxy, HTTP proxy, VPC Link, storage-first (SQS/Step Functions → 202), BFF |
| Lambda invocation | sync (API) · async (S3/SNS/EventBridge, retries + destinations) · polling (SQS/streams, partial batch failures) |
| Cold starts | small packages, init outside handler, provisioned concurrency, SnapStart |
| Concurrency | ≈ rps × duration; 1,000 default/region; reserved concurrency protects downstreams |
| Lambda limits | 15 min, 10 GB memory, 6 MB sync payload; idempotency for at-least-once |
| EC2 families | t/m general, c compute, r/x memory, i/d storage, p/g/inf/trn accelerated; Graviton = g |
| AMIs | golden images (Packer/Image Builder), immutable, instance refresh |
| Security groups | stateful, allow-only, reference other SGs; no public SSH (SSM) |
| ASG | multi-AZ, ELB health checks, target tracking, warm pools, mixed instances + Spot |
| Platform choice | Lambda (events, spiky) · Fargate (containers, small team) · EKS (k8s, portability, platform team) · EC2 (control, GPUs) |
| ALB vs. NLB | L7 routing, TLS, WAF, weighted / L4, static IPs, PrivateLink, extreme throughput |
| Health checks | focused endpoint, thresholds, deregistration delay, fail-open when all unhealthy |
