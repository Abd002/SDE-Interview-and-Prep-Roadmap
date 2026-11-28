# Kubernetes Fundamentals and Operations — Workloads, Networking, Config, Storage, Probes, Scaling and Troubleshooting

> **What you'll learn:** the core objects — **Pods, Deployments, ReplicaSets, Services, Ingress** — plus **ConfigMaps, Secrets, namespaces, RBAC and service accounts**; stateful workloads with **PersistentVolumes, StatefulSets and PodDisruptionBudgets**; **readiness/liveness/startup probes** and **rolling deployments**; **requests/limits, HPA, cluster autoscaling and scheduling**; and how to **troubleshoot CrashLoopBackOff, Pending pods and service discovery**. Each part has manifests/`kubectl` snippets.
>
> **Prerequisites:** [Containers and Docker](./Containers-and-Docker.md). Security hardening: [Kubernetes security](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#1-containerkubernetes-security-contexts-rbac-and-network-policies).

## Table of Contents
1. [ConfigMaps, Secrets, namespaces, RBAC, and service accounts](#1-configmaps-secrets-namespaces-rbac-and-service-accounts)
2. [Persistent volumes, statefulsets, and disruption budgets](#2-persistent-volumes-statefulsets-and-disruption-budgets)
3. [Pods, deployments, replicasets, services, and ingress](#3-pods-deployments-replicasets-services-and-ingress)
4. [Readiness/liveness/startup probes and rolling deployments](#4-readinesslivenessstartup-probes-and-rolling-deployments)
5. [Requests/limits, HPA, cluster autoscaler, and scheduling](#5-requestslimits-hpa-cluster-autoscaler-and-scheduling)
6. [Troubleshooting CrashLoopBackOff, pending pods, and service discovery](#6-troubleshooting-crashloopbackoff-pending-pods-and-service-discovery)
7. [Cheat sheet](#cheat-sheet)

**The core idea:** you declare **desired state** in YAML; **controllers** continuously compare it with **actual state** and act to close the gap (a **reconciliation loop**). Start with section **3** if Kubernetes is new to you.

---

## 1. ConfigMaps, Secrets, namespaces, RBAC, and service accounts

**In one sentence:** **namespaces** split a cluster into virtual areas for teams/environments, **ConfigMaps** hold non-secret configuration and **Secrets** hold sensitive values (base64, not encryption by default), both injected as **env vars or files**; **service accounts** give pods an identity, and **RBAC** (`Role`/`ClusterRole` + bindings) decides what each identity may do with the Kubernetes API.

### In plain words
A shared office building (cluster) with floors per team (namespaces). Each desk has a notice board with settings (ConfigMap) and a locked drawer for passwords (Secret). Every worker has a badge (service account), and the badge only opens the rooms their role allows (RBAC).

### How it works
- **Namespaces:** scope names, RBAC, quotas (`ResourceQuota`, `LimitRange`) and NetworkPolicies; not a hard security boundary on their own.
- **ConfigMap / Secret:** mount as **files** (updated in place when changed, after a short delay) or **env vars** (read only at container start → restart to pick up changes). Roll deployments on config change (checksum annotation, or tools like Reloader).
- **Secrets security:** base64 is encoding, not encryption — enable **encryption at rest** (KMS provider), restrict RBAC (`get secrets` is powerful), and prefer external secret stores (**External Secrets Operator**, Secrets Store CSI driver with AWS Secrets Manager/Vault).
- **Service accounts:** every pod runs as one (default: `default`); tokens are short-lived projected tokens; map to cloud IAM with **IRSA / EKS Pod Identity / GKE Workload Identity**; set `automountServiceAccountToken: false` when the pod doesn't call the API.
- **RBAC:** `Role` (namespaced) / `ClusterRole` (cluster-wide) list `apiGroups`, `resources`, `verbs`; bound to users, groups or service accounts with `RoleBinding`/`ClusterRoleBinding`. Least privilege; audit with `kubectl auth can-i`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata: { name: orders-config, namespace: orders }
data: { LOG_LEVEL: "info", FEATURE_NEW_CHECKOUT: "false" }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: configmap-reader, namespace: orders }
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: orders-api-reads-config, namespace: orders }
subjects: [{ kind: ServiceAccount, name: orders-api, namespace: orders }]
roleRef: { kind: Role, name: configmap-reader, apiGroup: rbac.authorization.k8s.io }
```

### Interview answer
"Namespaces partition the cluster for teams and environments and scope RBAC, quotas and network policies. ConfigMaps carry non-secret config and Secrets sensitive values, injected as env vars — read only at start, so I roll the deployment on change — or as mounted files that update in place. Secrets are only base64, so I enable KMS encryption at rest, restrict who can read them, and prefer External Secrets or the CSI driver with a real secrets manager. Each workload gets its own service account, mapped to cloud IAM with IRSA or Pod Identity, and RBAC Roles grant only the verbs and resources it needs, checked with `kubectl auth can-i`."

---

## 2. Persistent volumes, statefulsets, and disruption budgets

**In one sentence:** pods are disposable, so persistent data lives in **PersistentVolumes** claimed via **PersistentVolumeClaims** and provisioned dynamically by a **StorageClass** (e.g. EBS gp3 via the CSI driver); **StatefulSets** give pods **stable names, ordered rollout and their own volume each**; and **PodDisruptionBudgets** limit how many replicas voluntary disruptions (node drains, upgrades) may take down at once.

### In plain words
Pods are hotel guests who come and go; volumes are their safety-deposit boxes that stay when they check out. A StatefulSet is a band where each member has a fixed name and their own instrument case (database-0, database-1). A PDB is the rule "never send more than one band member on break at a time during the show".

### How it works
- **PVC → StorageClass → PV:** the claim asks for size + access mode (`ReadWriteOnce` = one node, e.g. EBS; `ReadWriteMany` = many nodes, e.g. EFS); the provisioner creates the volume. `reclaimPolicy: Retain` for important data; `volumeBindingMode: WaitForFirstConsumer` so the volume is created in the **same AZ** as the pod (EBS is zonal!). Snapshots via `VolumeSnapshot`.
- **StatefulSet:** pods `name-0, name-1, …` with stable DNS through a **headless Service** (`name-0.svc-name.ns.svc.cluster.local`), `volumeClaimTemplates` (a PVC per pod that follows it across restarts), ordered start/stop (configurable), partitioned rolling updates. For databases, queues, ZooKeeper/etcd — but consider **managed services** first (RDS, MSK); running stateful systems on Kubernetes needs operators and expertise.
- **PodDisruptionBudget:** `minAvailable: 2` or `maxUnavailable: 1` for a label selector; `kubectl drain` and cluster upgrades respect it (involuntary failures don't). Don't set a PDB that blocks every drain (e.g. `maxUnavailable: 0` with 1 replica).

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata: { name: redis, namespace: cache }
spec:
  serviceName: redis                 # headless service for stable DNS
  replicas: 3
  selector: { matchLabels: { app: redis } }
  template:
    metadata: { labels: { app: redis } }
    spec: { containers: [{ name: redis, image: redis:7.4@sha256:<digest>, volumeMounts: [{ name: data, mountPath: /data }] }] }
  volumeClaimTemplates:
    - metadata: { name: data }
      spec: { accessModes: ["ReadWriteOnce"], storageClassName: gp3, resources: { requests: { storage: 20Gi } } }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: redis-pdb, namespace: cache }
spec: { maxUnavailable: 1, selector: { matchLabels: { app: redis } } }
```

### Interview answer
"Pods are ephemeral, so persistent data uses PersistentVolumeClaims dynamically provisioned by a StorageClass through the CSI driver — EBS is ReadWriteOnce and zonal, so I use WaitForFirstConsumer binding, EFS for ReadWriteMany, and Retain for important data. StatefulSets give stable pod names and DNS through a headless service, a dedicated PVC per pod via volumeClaimTemplates, and ordered updates — though for databases I'd still prefer a managed service unless there's a mature operator. PodDisruptionBudgets cap voluntary disruptions like drains and upgrades, for example maxUnavailable 1, without blocking drains entirely."

---

## 3. Pods, deployments, replicasets, services, and ingress

**In one sentence:** a **Pod** is one or more containers sharing a network namespace and volumes, scheduled together; a **Deployment** manages **ReplicaSets** that keep N identical pods running and roll out new versions; a **Service** gives a stable virtual IP and DNS name in front of matching pods (ClusterIP, NodePort, LoadBalancer); and an **Ingress** (or the newer **Gateway API**) routes external HTTP(S) traffic to Services.

### In plain words
Pods are taxi cars (one or a few people riding together). A Deployment is the taxi company that keeps 10 cars on the road and replaces old models gradually. A Service is the company's phone number — you don't need to know which car comes. Ingress is the airport taxi rank that sends you to the right company by destination.

### How it works
- **Pod:** smallest unit; containers share `localhost` and volumes; **sidecars** (proxies, log shippers — native sidecar containers since 1.29) and **init containers** (run to completion before the app). Pods are **cattle**: never fix one by hand; it may be rescheduled anytime with a new IP.
- **ReplicaSet:** ensures N pods matching a label selector. **Deployment:** owns ReplicaSets; a new pod template → a new ReplicaSet scaled up while the old one scales down; keeps history for `kubectl rollout undo`.
- **Labels & selectors** connect everything: Deployment → pods (`app: orders`), Service → pods, NetworkPolicy → pods.
- **Service types:** `ClusterIP` (internal VIP, default), `NodePort` (port on every node), `LoadBalancer` (cloud LB — on EKS via the AWS Load Balancer Controller, NLB), `ExternalName`, **headless** (`clusterIP: None`, DNS returns pod IPs). kube-proxy (iptables/IPVS) or eBPF (Cilium) implements the VIP; **EndpointSlices** list the ready pod IPs.
- **DNS:** `orders.shop.svc.cluster.local` (CoreDNS); within the namespace just `orders`.
- **Ingress:** host/path rules → Services, TLS termination; implemented by an **ingress controller** (ingress-nginx, AWS Load Balancer Controller → ALB, Traefik). **Gateway API** (`Gateway`, `HTTPRoute`) is the more expressive successor (weighted routing, header matching, role separation).

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: orders, namespace: shop }
spec:
  replicas: 3
  selector: { matchLabels: { app: orders } }
  template:
    metadata: { labels: { app: orders } }
    spec:
      containers:
        - name: api
          image: registry.example.com/orders@sha256:<digest>
          ports: [{ containerPort: 8080 }]
---
apiVersion: v1
kind: Service
metadata: { name: orders, namespace: shop }
spec: { selector: { app: orders }, ports: [{ port: 80, targetPort: 8080 }] }
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: shop, namespace: shop, annotations: { alb.ingress.kubernetes.io/scheme: internet-facing } }
spec:
  ingressClassName: alb
  tls: [{ hosts: ["shop.example.com"] }]
  rules:
    - host: shop.example.com
      http: { paths: [{ path: /api/orders, pathType: Prefix, backend: { service: { name: orders, port: { number: 80 } } } }] }
```

### Interview answer
"A pod is one or more containers sharing a network namespace and volumes, scheduled together and treated as disposable. A Deployment manages ReplicaSets that reconcile the number of pods matching a label selector, and rolls out a new template by scaling a new ReplicaSet up and the old one down, with history for rollback. A Service gives a stable virtual IP and DNS name in front of ready pods selected by labels — ClusterIP internally, LoadBalancer for cloud load balancers, headless for direct pod DNS. Ingress, implemented by a controller like the AWS Load Balancer Controller, routes external HTTP(S) by host and path, and the Gateway API is its more expressive successor."

---

## 4. Readiness/liveness/startup probes and rolling deployments

**In one sentence:** **readiness probes** decide whether a pod receives traffic, **liveness probes** restart a pod that's stuck, **startup probes** give slow starters time before liveness kicks in; **rolling updates** replace pods gradually using `maxSurge`/`maxUnavailable`, and only work safely when readiness is accurate and shutdown is graceful.

### In plain words
- Readiness: "is the shop open for customers?" — if not, customers are sent elsewhere.
- Liveness: "is the shopkeeper still responding at all?" — if not, replace them.
- Startup: "give the new shopkeeper 2 minutes to unpack before checking".
- Rolling update: replace shopkeepers one at a time so the shop never closes.

### How it works
| Probe | On failure | Check | Common mistake |
|---|---|---|---|
| **readiness** | removed from Service endpoints (no restart) | can serve now: warmed up, config loaded, critical local deps | failing readiness for every downstream blip → cascading outage |
| **liveness** | container **restarted** | process not deadlocked (cheap internal check) | checking the database in liveness → restart storms when the DB is slow |
| **startup** | liveness/readiness wait until it passes | app finished starting | missing → slow JVMs killed during start |

- Types: `httpGet`, `tcpSocket`, `exec`, `grpc`; tune `initialDelaySeconds`, `periodSeconds`, `timeoutSeconds`, `failureThreshold`.
- **Rolling update strategy:** `maxSurge: 25%` (extra pods during rollout), `maxUnavailable: 0` (never below desired). `minReadySeconds` and `progressDeadlineSeconds` (marks the rollout failed); `kubectl rollout status/undo`.
- **Graceful shutdown:** on termination the pod gets **SIGTERM**, is removed from endpoints (asynchronously — add a short `preStop` sleep), then has `terminationGracePeriodSeconds` (default 30 s) to finish in-flight work before SIGKILL.
- For canary/blue-green, use **Argo Rollouts** or **Flagger** with metric analysis ([release strategies](./CI-CD-and-Release-Engineering.md#2-blue-green-canary-rolling-and-feature-flag-releases)).

```yaml
spec:
  strategy: { type: RollingUpdate, rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } }
  template:
    spec:
      terminationGracePeriodSeconds: 45
      containers:
        - name: api
          startupProbe:   { httpGet: { path: /healthz, port: 8080 }, failureThreshold: 30, periodSeconds: 2 }
          readinessProbe: { httpGet: { path: /ready,   port: 8080 }, periodSeconds: 5, failureThreshold: 2 }
          livenessProbe:  { httpGet: { path: /healthz, port: 8080 }, periodSeconds: 10, failureThreshold: 3 }
          lifecycle: { preStop: { exec: { command: ["sleep", "5"] } } }
```

### Interview answer
"Readiness controls whether a pod gets traffic and should reflect whether this instance can serve — not every downstream dependency; liveness restarts a stuck process and must be cheap and local to avoid restart storms; a startup probe protects slow starters. Rolling updates use maxSurge and maxUnavailable — I like maxUnavailable 0 — so new pods must pass readiness before old ones go, and a progress deadline marks a broken rollout as failed so I can undo it. Graceful shutdown handles SIGTERM, a short preStop sleep covers endpoint propagation, and the grace period lets in-flight requests finish."

---

## 5. Requests/limits, HPA, cluster autoscaler, and scheduling

**In one sentence:** **requests** are what the scheduler **reserves** for a container (placement and fair share), **limits** are the **maximum** it may use (CPU → throttled, memory → OOM-killed); the **HorizontalPodAutoscaler** changes replica counts from metrics, the **Cluster Autoscaler / Karpenter** adds or removes nodes for pending pods, and **scheduling rules** (affinity, taints/tolerations, topology spread) decide where pods land.

### In plain words
Booking a restaurant: the reservation (request) guarantees your table; the limit is how much you may eat. The manager adds more waiters when it gets busy (HPA) and opens another dining room when every table is booked (cluster autoscaler). Some tables are reserved for VIPs (taints) and families want to sit spread across rooms (topology spread).

### How it works
**Requests & limits**
- Scheduler only places a pod on a node whose **allocatable − sum(requests)** fits — actual usage doesn't matter for scheduling.
- **QoS classes:** *Guaranteed* (requests = limits for all containers), *Burstable*, *BestEffort* (none) — evicted first under node pressure.
- Set **memory request = limit** (predictable, avoids OOM surprises); CPU limits are debated (they cause throttling) — many teams set CPU requests only. Use `LimitRange` defaults and `ResourceQuota` per namespace; right-size with VPA recommendations or Goldilocks.

**Autoscaling**
- **HPA:** `desired = ceil(current × currentMetric / targetMetric)` on CPU/memory utilization **relative to requests**, or custom/external metrics (requests per second, queue length via **KEDA**); stabilization windows prevent flapping.
- **VPA:** adjusts requests (recreates pods) — don't combine with HPA on the same CPU metric.
- **Cluster Autoscaler** (node groups) or **Karpenter** (provisions right-sized nodes directly, consolidates, uses Spot) add nodes when pods are **Pending** for resources and remove under-used ones.

**Scheduling controls:** `nodeSelector`/**node affinity** (only GPU or arm64 nodes), **pod (anti-)affinity** (keep replicas apart / near), **taints & tolerations** (dedicate nodes), **topologySpreadConstraints** (`topology.kubernetes.io/zone`, `maxSkew: 1`) to spread across AZs, **PriorityClasses** and preemption.

```yaml
resources: { requests: { cpu: "250m", memory: "256Mi" }, limits: { memory: "256Mi" } }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: orders }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: orders }
  minReplicas: 3
  maxReplicas: 30
  metrics: [{ type: Resource, resource: { name: cpu, target: { type: Utilization, averageUtilization: 60 } } }]
```

### Interview answer
"Requests are what the scheduler reserves and places pods by; limits cap usage — exceeding CPU throttles, exceeding memory OOM-kills. I usually set memory request equal to limit and CPU requests without a hard CPU limit, with LimitRanges and quotas per namespace. The HPA scales replicas by ceil of current times metric over target, using CPU relative to requests or custom metrics like queue depth via KEDA, and Cluster Autoscaler or Karpenter adds nodes when pods are Pending for resources and consolidates idle ones. Placement is shaped with node affinity, taints and tolerations, anti-affinity and topology spread constraints across zones."

---

## 6. Troubleshooting CrashLoopBackOff, pending pods, and service discovery

**In one sentence:** debug Kubernetes top-down with **`kubectl get` → `describe` (events!) → `logs` (incl. `--previous`) → `exec`/`debug`**: **CrashLoopBackOff** means the container keeps exiting (check exit code and previous logs), **Pending** means it can't be scheduled (resources, taints, affinity, PVC zone), and **service discovery** problems are usually **selectors, ports, readiness or DNS**.

### In plain words
A doctor's checklist: look at the patient (`get`), read the chart with the nurse's notes (`describe` → events), listen to what they said before collapsing (`logs --previous`), and if needed examine them directly (`exec`).

### How it works
**CrashLoopBackOff** (restart with exponential backoff up to 5 min)
| Clue | Likely cause |
|---|---|
| exit code **1** / app error in `logs --previous` | bad config, missing env/Secret, failed migration, can't reach a dependency at startup |
| exit code **137** + `OOMKilled` in `describe` | memory limit too low or a leak |
| exit code **139** | segfault (native code) |
| liveness probe failures in events | probe too aggressive / no startup probe |
| exits immediately with code 0 | the command finishes — wrong `CMD`/`args` for a long-running service |
| `ImagePullBackOff` / `ErrImagePull` | wrong image/tag, registry auth, architecture mismatch |

**Pending**
- `describe pod` events: `0/5 nodes are available: 3 Insufficient cpu, 2 node(s) had untolerated taint` — fix requests, add nodes (autoscaler limits?), add tolerations, relax affinity.
- **PVC** not bound or volume in another AZ (`volume node affinity conflict`) — use `WaitForFirstConsumer`.
- Quota exceeded in the namespace (`exceeded quota`).

**Service discovery / "can't connect"**
1. `kubectl get endpointslices -l kubernetes.io/service-name=orders` — **empty?** The Service **selector doesn't match** pod labels, or pods aren't **Ready**.
2. Ports: Service `port` → `targetPort` must equal the container's listening port (and the app must listen on `0.0.0.0`, not `127.0.0.1`).
3. DNS: `kubectl run -it --rm dbg --image=busybox -- nslookup orders.shop` — wrong namespace in the name? CoreDNS healthy?
4. **NetworkPolicy** blocking traffic; Ingress class/host/path mismatch; TLS secret missing.

**Useful commands:** `kubectl get pods -o wide`, `kubectl describe pod X`, `kubectl logs X -c container --previous`, `kubectl get events --sort-by=.lastTimestamp`, `kubectl debug -it X --image=busybox --target=app`, `kubectl top pods`, `kubectl rollout history/undo`.

### Interview answer
"I go get, describe, logs, exec. For CrashLoopBackOff I read `logs --previous` and the exit code — 137 with OOMKilled means memory, 1 usually config or a dependency at boot, 0 a wrong command, and liveness failures in events mean the probe kills a slow start. For Pending, the scheduler events say why: insufficient resources versus autoscaler limits, taints without tolerations, affinity, quotas, or a volume in another AZ. For service discovery I check that the Service has endpoints — selectors and readiness — then port and targetPort and that the app listens on all interfaces, then DNS from a debug pod with the right namespace, and finally NetworkPolicies and Ingress rules."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Model | declare desired state; controllers reconcile actual → desired |
| Namespaces | scope names, RBAC, quotas, NetworkPolicies; not a hard boundary alone |
| ConfigMap / Secret | env (read at start → roll out) vs. files (update in place); Secrets = base64 → KMS encryption, External Secrets |
| RBAC & SAs | Role/ClusterRole + bindings, least privilege, `auth can-i`; SA per workload, IRSA/Pod Identity, disable automount |
| Storage | PVC → StorageClass (CSI) → PV; RWO/RWX; WaitForFirstConsumer; Retain |
| StatefulSet | stable names + DNS (headless svc), PVC per pod, ordered updates; prefer managed DBs |
| PDB | limits voluntary disruptions; don't block all drains |
| Workloads | Pod (shared netns/volumes) → ReplicaSet (N pods) → Deployment (rollouts, history) |
| Services | ClusterIP / NodePort / LoadBalancer / headless; selectors + ready pods → EndpointSlices; CoreDNS names |
| Ingress / Gateway API | host/path routing, TLS, controller-implemented; Gateway API = successor |
| Probes | readiness (traffic) · liveness (restart, keep local) · startup (slow boot) |
| Rolling update | maxSurge / maxUnavailable (0 = no capacity loss), progressDeadline, rollout undo; SIGTERM + preStop + grace period |
| Resources | requests = scheduling; limits: CPU throttle / memory OOM (137); QoS classes |
| Autoscaling | HPA ceil(cur × metric / target), KEDA; VPA; Cluster Autoscaler / Karpenter |
| Scheduling | node affinity, taints/tolerations, pod anti-affinity, topology spread by zone, priorities |
| Debugging | get → describe (events) → logs --previous → exec/debug; endpoints, ports, DNS, NetworkPolicy |
