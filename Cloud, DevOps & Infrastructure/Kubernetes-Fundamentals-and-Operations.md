# Kubernetes Fundamentals and Operations — Workloads, Networking, Config, Storage, Probes, Scaling and Troubleshooting

> **What you'll learn:** the core objects — **Pods, Deployments, ReplicaSets, Services, Ingress** — plus **ConfigMaps, Secrets, namespaces, RBAC and service accounts**; stateful workloads with **PersistentVolumes, StatefulSets and PodDisruptionBudgets**; **readiness/liveness/startup probes** and **rolling deployments**; **requests/limits, HPA, cluster autoscaling and scheduling**; and how to **troubleshoot CrashLoopBackOff, Pending pods and service discovery**. Each part has manifests/`kubectl` snippets and a runnable C++ model of the controller logic.
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

#### Modern C++ example — RBAC authorization (`kubectl auth can-i`) and env vs. mounted config updates
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Rule { std::set<std::string> resources, verbs; };
struct Binding { std::string subject, ns; std::vector<Rule> rules; };

bool can_i(const std::vector<Binding>& bindings, const std::string& who, const std::string& verb, const std::string& resource, const std::string& ns) {
    for (auto& b : bindings)
        if (b.subject == who && (b.ns == ns || b.ns == "*"))
            for (auto& r : b.rules) if (r.resources.count(resource) && r.verbs.count(verb)) return true;
    return false;                                                   // RBAC is deny-by-default (no deny rules exist)
}

int main() {
    std::vector<Binding> bindings{
        {"system:serviceaccount:orders:orders-api", "orders", {{{"configmaps"}, {"get", "list", "watch"}}}},
        {"group:sre", "*", {{{"pods", "deployments"}, {"get", "list", "delete"}}, {{"pods/log"}, {"get"}}}},
    };
    std::cout << std::boolalpha;
    for (auto [who, verb, res, ns] : std::vector<std::tuple<std::string, std::string, std::string, std::string>>{
             {"system:serviceaccount:orders:orders-api", "get", "configmaps", "orders"},
             {"system:serviceaccount:orders:orders-api", "get", "secrets", "orders"},
             {"system:serviceaccount:orders:orders-api", "get", "configmaps", "payments"},
             {"group:sre", "delete", "pods", "payments"}})
        std::cout << "can-i " << verb << ' ' << res << " -n " << ns << " as " << who.substr(who.rfind(':') + 1) << " -> " << can_i(bindings, who, verb, res, ns) << '\n';

    std::map<std::string, std::string> configmap{{"LOG_LEVEL", "info"}};
    std::string env_copy = configmap["LOG_LEVEL"];                  // env var: copied once at container start
    configmap["LOG_LEVEL"] = "debug";                               // kubectl edit configmap
    std::string mounted_file = configmap["LOG_LEVEL"];              // volume: kubelet syncs the file
    std::cout << "after editing the ConfigMap: env var still '" << env_copy << "' (needs a rollout), mounted file now '" << mounted_file << "'\n";
}
```

**Output:**
```text
can-i get configmaps -n orders as orders-api -> true
can-i get secrets -n orders as orders-api -> false
can-i get configmaps -n payments as orders-api -> false
can-i delete pods -n payments as sre -> true
after editing the ConfigMap: env var still 'info' (needs a rollout), mounted file now 'debug'
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

#### Modern C++ example — StatefulSet identity + per-pod volumes surviving restarts, and a drain respecting a PDB
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::map<std::string, std::string> pvcs;                         // PVC name -> data (outlives pods)
    std::vector<std::string> pods;
    for (int i = 0; i < 3; ++i) {                                    // ordered creation: redis-0, then -1, then -2
        std::string pod = "redis-" + std::to_string(i), pvc = "data-" + pod;
        pods.push_back(pod);
        pvcs[pvc] = "keys of shard " + std::to_string(i);
        std::cout << "created " << pod << " (DNS " << pod << ".redis.cache.svc.cluster.local) with " << pvc << '\n';
    }
    std::cout << "redis-1 crashes and is recreated with the SAME name and volume: " << pvcs["data-redis-1"] << '\n';

    // Node drain: 3 pods on 2 nodes; PDB maxUnavailable = 1 -> evictions wait until the previous pod is Ready again.
    std::map<std::string, std::string> node_of{{"redis-0", "node-a"}, {"redis-1", "node-b"}, {"redis-2", "node-b"}};
    int max_unavailable = 1, unavailable = 0;
    for (auto& [pod, node] : node_of) {
        if (node != "node-b") continue;
        if (unavailable >= max_unavailable) { std::cout << "evict " << pod << ": BLOCKED by PDB (retry after the previous pod is Ready)\n"; continue; }
        ++unavailable;
        std::cout << "evict " << pod << ": allowed (" << unavailable << "/" << max_unavailable << " unavailable)\n";
    }
    unavailable = 0;
    std::cout << "redis-1 rescheduled on node-c and Ready -> retry: evict redis-2 allowed\n";
}
```

**Output:**
```text
created redis-0 (DNS redis-0.redis.cache.svc.cluster.local) with data-redis-0
created redis-1 (DNS redis-1.redis.cache.svc.cluster.local) with data-redis-1
created redis-2 (DNS redis-2.redis.cache.svc.cluster.local) with data-redis-2
redis-1 crashes and is recreated with the SAME name and volume: keys of shard 1
evict redis-1: allowed (1/1 unavailable)
evict redis-2: BLOCKED by PDB (retry after the previous pod is Ready)
redis-1 rescheduled on node-c and Ready -> retry: evict redis-2 allowed
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

#### Modern C++ example — a ReplicaSet reconciliation loop and a Service selecting ready pods by label
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Pod { std::string name; std::map<std::string, std::string> labels; bool ready; };

int main() {
    std::vector<Pod> pods{{"orders-7f9c-a", {{"app", "orders"}}, true}, {"payments-1b2c-x", {{"app", "payments"}}, true}};
    const int desired = 3;
    int next = 0;
    auto reconcile = [&] {                                                    // ReplicaSet controller
        int have = 0;
        for (auto& p : pods) have += p.labels["app"] == "orders";
        for (; have < desired; ++have) { pods.push_back({"orders-7f9c-" + std::string(1, char('b' + next++)), {{"app", "orders"}}, false}); std::cout << "  create " << pods.back().name << '\n'; }
    };
    std::cout << "reconcile (desired " << desired << "):\n"; reconcile();
    for (auto& p : pods) p.ready = true;
    std::erase_if(pods, [](const Pod& p) { return p.name == "orders-7f9c-a"; });  // a node dies, pod gone
    std::cout << "node failure removed orders-7f9c-a; reconcile:\n"; reconcile();

    auto endpoints = [&](const std::string& app) {                           // Service: selector + readiness
        std::vector<std::string> ips;
        for (auto& p : pods) if (p.labels["app"] == app && p.ready) ips.push_back(p.name);
        return ips;
    };
    std::cout << "Service 'orders' endpoints (ready pods only):";
    for (auto& e : endpoints("orders")) std::cout << ' ' << e;
    std::cout << "\nDNS: orders.shop.svc.cluster.local -> ClusterIP -> one of the endpoints above\n";
}
```

**Output:**
```text
reconcile (desired 3):
  create orders-7f9c-b
  create orders-7f9c-c
node failure removed orders-7f9c-a; reconcile:
  create orders-7f9c-d
Service 'orders' endpoints (ready pods only): orders-7f9c-b orders-7f9c-c
DNS: orders.shop.svc.cluster.local -> ClusterIP -> one of the endpoints above
```

orders-7f9c-d isn't an endpoint yet — it hasn't passed its readiness check ([section 4](#4-readinesslivenessstartup-probes-and-rolling-deployments)).

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

#### Modern C++ example — a rolling update with maxSurge=1/maxUnavailable=0, and a bad version stopped by readiness
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Pod { std::string version; bool ready; };

void rollout(const std::string& new_version, bool new_version_healthy) {
    std::vector<Pod> pods(4, Pod{"v1", true});
    const int desired = 4, max_surge = 1;
    std::cout << "rolling out " << new_version << (new_version_healthy ? "" : " (broken)") << ":\n";
    for (int step = 1; step <= 6; ++step) {
        int old_count = 0, new_ready = 0, new_total = 0;
        for (auto& p : pods) { old_count += p.version == "v1"; if (p.version == new_version) { ++new_total; new_ready += p.ready; } }
        if (old_count == 0) { std::cout << "  step " << step << ": rollout complete\n"; return; }
        if (static_cast<int>(pods.size()) < desired + max_surge) pods.push_back({new_version, false});           // surge one new pod
        for (auto& p : pods) if (p.version == new_version) p.ready = new_version_healthy;                         // readiness result
        int ready_total = 0; for (auto& p : pods) ready_total += p.ready;
        if (ready_total > desired) {                                                                              // only then remove an old pod
            for (auto it = pods.begin(); it != pods.end(); ++it) if (it->version == "v1") { pods.erase(it); break; }
        }
        int serving = 0; for (auto& p : pods) serving += p.ready;
        std::cout << "  step " << step << ": " << pods.size() << " pods, serving traffic " << serving << '\n';
        if (!new_version_healthy && step == 3) { std::cout << "  progressDeadline exceeded -> rollout FAILED, old pods still serving -> kubectl rollout undo\n"; return; }
    }
}

int main() {
    rollout("v2", true);
    rollout("v3", false);
}
```

**Output:**
```text
rolling out v2:
  step 1: 4 pods, serving traffic 4
  step 2: 4 pods, serving traffic 4
  step 3: 4 pods, serving traffic 4
  step 4: 4 pods, serving traffic 4
  step 5: rollout complete
rolling out v3 (broken):
  step 1: 5 pods, serving traffic 4
  step 2: 5 pods, serving traffic 4
  step 3: 5 pods, serving traffic 4
  progressDeadline exceeded -> rollout FAILED, old pods still serving -> kubectl rollout undo
```

With `maxUnavailable: 0`, a broken version never takes capacity away — the old pods keep serving while the new pod fails readiness.

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

#### Modern C++ example — bin-packing by requests, the HPA formula, and a Pending pod that triggers a new node
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iostream>
#include <string>
#include <vector>

struct Node { std::string name; int alloc_mcpu, alloc_mib, used_mcpu = 0, used_mib = 0; };
struct PodSpec { std::string name; int cpu, mem; };

bool schedule(std::vector<Node>& nodes, const PodSpec& p) {
    for (auto& n : nodes)
        if (n.alloc_mcpu - n.used_mcpu >= p.cpu && n.alloc_mib - n.used_mib >= p.mem) {   // by REQUESTS, not usage
            n.used_mcpu += p.cpu; n.used_mib += p.mem;
            std::cout << "  " << p.name << " -> " << n.name << '\n';
            return true;
        }
    std::cout << "  " << p.name << " -> Pending (0/" << nodes.size() << " nodes: Insufficient cpu/memory)\n";
    return false;
}

int main() {
    // HPA: current 4 replicas at 90% CPU (of requests), target 60%.
    int current = 4; double metric = 90, target = 60;
    int desired = static_cast<int>(std::ceil(current * metric / target));
    std::cout << "HPA: ceil(" << current << " x " << metric << " / " << target << ") = " << desired << " replicas\n";

    std::vector<Node> nodes{{"node-1", 1930, 3400}, {"node-2", 1930, 3400}};          // allocatable after system reserve
    std::cout << "scheduling " << desired << " replicas requesting 500m CPU / 768Mi:\n";
    std::vector<std::string> pending;
    for (int i = 0; i < desired; ++i) {
        PodSpec p{"orders-" + std::to_string(i), 500, 768};
        if (!schedule(nodes, p)) pending.push_back(p.name);
    }
    if (!pending.empty()) {
        std::cout << "Karpenter sees " << pending.size() << " pending pod(s) -> launches node-3\n";
        nodes.push_back({"node-3", 1930, 3400});
        for (auto& name : pending) schedule(nodes, {name, 500, 768});
    }
}
```

**Output:**
```text
HPA: ceil(4 x 90 / 60) = 6 replicas
scheduling 6 replicas requesting 500m CPU / 768Mi:
  orders-0 -> node-1
  orders-1 -> node-1
  orders-2 -> node-1
  orders-3 -> node-2
  orders-4 -> node-2
  orders-5 -> node-2
```

Six 500m pods fit exactly on two nodes with 1,930m allocatable each (3 × 500m = 1,500m per node). Raise the request to 700m and you'll see `Pending` and a new node — try it.

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

#### Modern C++ example — a triage assistant mapping pod status, exit codes and events to likely causes
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct PodState { std::string name, status; int exit_code; std::string last_event; int endpoints; };

std::string diagnose(const PodState& p) {
    if (p.status == "CrashLoopBackOff") {
        if (p.exit_code == 137) return "OOMKilled: raise the memory limit or fix the leak (kubectl describe -> Last State: OOMKilled)";
        if (p.exit_code == 0) return "process exits successfully: wrong CMD/args for a long-running service";
        if (p.last_event.find("Liveness probe failed") != std::string::npos) return "liveness kills it during startup: add a startupProbe / relax thresholds";
        return "app error: read kubectl logs --previous (missing env var/Secret, bad config, dependency down at boot)";
    }
    if (p.status == "ImagePullBackOff") return "image name/tag/digest wrong, registry auth (imagePullSecrets/IRSA), or arch mismatch";
    if (p.status == "Pending") {
        if (p.last_event.find("Insufficient") != std::string::npos) return "no node fits the requests: lower requests or let the autoscaler add nodes (check max size)";
        if (p.last_event.find("taint") != std::string::npos) return "nodes are tainted: add a toleration or target another node pool";
        if (p.last_event.find("volume node affinity") != std::string::npos) return "PV is in another AZ: use WaitForFirstConsumer storage class";
        return "check kubectl describe events and namespace quota";
    }
    if (p.status == "Running" && p.endpoints == 0) return "Service has no endpoints: selector doesn't match pod labels, or pods not Ready";
    return "looks healthy";
}

int main() {
    std::vector<PodState> pods{
        {"orders-6d4f", "CrashLoopBackOff", 137, "Back-off restarting failed container", 0},
        {"billing-77aa", "CrashLoopBackOff", 1, "Back-off restarting failed container", 0},
        {"search-5c21", "CrashLoopBackOff", 143, "Liveness probe failed: HTTP probe failed with statuscode: 503", 0},
        {"worker-91bd", "Pending", 0, "0/5 nodes are available: 5 Insufficient memory", 0},
        {"ml-0", "Pending", 0, "0/5 nodes are available: 5 node(s) had untolerated taint {gpu: true}", 0},
        {"api-2f3e", "Running", 0, "", 0},
        {"web-8a7b", "ImagePullBackOff", 0, "Failed to pull image: manifest unknown", 0},
    };
    for (auto& p : pods) std::cout << p.name << " [" << p.status << (p.exit_code ? ", exit " + std::to_string(p.exit_code) : "") << "]\n  -> " << diagnose(p) << '\n';
}
```

**Output:**
```text
orders-6d4f [CrashLoopBackOff, exit 137]
  -> OOMKilled: raise the memory limit or fix the leak (kubectl describe -> Last State: OOMKilled)
billing-77aa [CrashLoopBackOff, exit 1]
  -> app error: read kubectl logs --previous (missing env var/Secret, bad config, dependency down at boot)
search-5c21 [CrashLoopBackOff, exit 143]
  -> liveness kills it during startup: add a startupProbe / relax thresholds
worker-91bd [Pending]
  -> no node fits the requests: lower requests or let the autoscaler add nodes (check max size)
ml-0 [Pending]
  -> nodes are tainted: add a toleration or target another node pool
api-2f3e [Running]
  -> Service has no endpoints: selector doesn't match pod labels, or pods not Ready
web-8a7b [ImagePullBackOff]
  -> image name/tag/digest wrong, registry auth (imagePullSecrets/IRSA), or arch mismatch
```

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
