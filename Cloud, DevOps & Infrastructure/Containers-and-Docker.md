# Containers and Docker — Images, Layers, Dockerfiles, Multi-Stage Builds, Caching, Networking, Limits and Security

> **What you'll learn:** what **images, layers and registries** are and how to write good **Dockerfiles** with **multi-stage builds**; how to make builds **reproducible**, use the **layer cache** well and shrink **image size**; how containers get **networking, volumes, resource limits and isolation** (namespaces, cgroups); and how to secure images with **scanning, non-root users and pinned dependencies**. Each part has Dockerfile/CLI snippets and a runnable C++ model.
>
> **Prerequisites:** [Processes](../Operating%20Systems/Processes.md), [File Systems](../Operating%20Systems/File-Systems.md). Security deep dive: [Container/Kubernetes security](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#1-containerkubernetes-security-contexts-rbac-and-network-policies).

## Table of Contents
1. [Build reproducibility, caching, and image size optimization](#1-build-reproducibility-caching-and-image-size-optimization)
2. [Container networking, volumes, resource limits, and isolation](#2-container-networking-volumes-resource-limits-and-isolation)
3. [Image scanning, non-root containers, pinned dependencies](#3-image-scanning-non-root-containers-pinned-dependencies)
4. [Images, layers, registries, Dockerfiles, and multi-stage builds](#4-images-layers-registries-dockerfiles-and-multi-stage-builds)
5. [Cheat sheet](#cheat-sheet)

Start with section **4** if containers are new to you.

---

## 1. Build reproducibility, caching, and image size optimization

**In one sentence:** order Dockerfile steps from **least to most frequently changing** so the **layer cache** is reused, **pin** base images and dependencies so the same commit always builds the same image, and keep images **small** (multi-stage builds, minimal bases, `.dockerignore`, no build tools at runtime) for faster pulls, faster starts and fewer vulnerabilities.

### In plain words
Packing a suitcase: put the things that never change (shoes) at the bottom and the things you swap every trip on top, so you don't unpack everything each time. Use the exact same packing list every time (reproducible). And don't bring the ironing board — you only needed it while getting dressed (multi-stage).

### How it works
**Layer cache rules**
- Each instruction creates a layer; the cache is reused **until the first changed instruction** — everything after it rebuilds.
- Copy **dependency manifests first**, install dependencies, **then** copy source code:
```dockerfile
COPY package.json package-lock.json ./
RUN npm ci                       # cached until the lockfile changes
COPY src/ ./src                  # code changes only invalidate from here
```
- **BuildKit** features: `RUN --mount=type=cache,target=/root/.cache/pip` (persistent package caches), `--mount=type=secret` (secrets not baked into layers), remote cache export/import in CI (`--cache-to/--cache-from type=registry` or `type=gha`).
- `.dockerignore` excludes `.git`, `node_modules`, build outputs and secrets from the build context (faster, safer).

**Reproducibility**
- Pin base images by **digest** (`FROM python:3.12-slim@sha256:…`), use lockfiles (`npm ci`, `pip install --require-hashes`, `cargo build --locked`), pin OS packages where practical, set `SOURCE_DATE_EPOCH` for timestamps, avoid `curl | sh` of moving URLs.
- Tag images with the **git SHA** (immutable), not just `latest`.

**Size**
| Technique | Typical saving |
|---|---|
| multi-stage: build in a full image, copy only the binary/artifacts | 1 GB → 20–100 MB |
| minimal bases: `-slim`, Alpine (musl caveats), **distroless**, `scratch` for static binaries | 100s of MB |
| combine `RUN` steps and clean package caches in the same layer (`apt-get … && rm -rf /var/lib/apt/lists/*`) | tens of MB |
| don't copy what you don't need (`.dockerignore`, specific `COPY` paths) | varies |

#### Modern C++ example — simulating the layer cache for a good vs. a bad instruction order
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Step { std::string instruction; std::string depends_on; int seconds; };

int rebuild_seconds(const std::vector<Step>& steps, const std::string& changed) {
    int total = 0; bool invalid = false;
    for (auto& s : steps) {
        if (s.depends_on == changed) invalid = true;              // first changed input invalidates this and every later layer
        if (invalid) total += s.seconds;
    }
    return total;
}

int main() {
    std::vector<Step> bad{{"FROM node:22-slim", "base", 5}, {"COPY . .", "src", 1}, {"RUN npm ci", "lockfile", 90}, {"RUN npm run build", "src", 30}};
    std::vector<Step> good{{"FROM node:22-slim", "base", 5}, {"COPY package*.json ./", "lockfile", 1}, {"RUN npm ci", "lockfile", 90},
                           {"COPY src/ ./src", "src", 1}, {"RUN npm run build", "src", 30}};
    // In the bad file "COPY . ." copies src AND the lockfile, so any code edit invalidates npm ci.
    bad[2].depends_on = "src";
    std::cout << "code change only:   bad order " << rebuild_seconds(bad, "src") << " s, good order " << rebuild_seconds(good, "src") << " s\n";
    std::cout << "lockfile change:    bad order " << rebuild_seconds(bad, "src") << " s, good order " << rebuild_seconds(good, "lockfile") << " s\n";
    int edits_per_day = 40;
    std::cout << "with " << edits_per_day << " code edits/day the good order saves ~"
              << (rebuild_seconds(bad, "src") - rebuild_seconds(good, "src")) * edits_per_day / 60 << " minutes of build time per developer\n";
}
```

**Output:**
```text
code change only:   bad order 121 s, good order 31 s
lockfile change:    bad order 121 s, good order 122 s
with 40 code edits/day the good order saves ~60 minutes of build time per developer
```

### Interview answer
"I order Dockerfiles from least to most frequently changing: base image, then dependency manifests and install, then source code, so code edits reuse the cached dependency layer. With BuildKit I use cache mounts for package managers, secret mounts so credentials never land in layers, and a registry or GitHub Actions cache in CI. Builds are reproducible by pinning base images by digest, using lockfiles and tagging images with the git SHA. Images stay small with multi-stage builds onto slim, distroless or scratch bases, a .dockerignore, and cleanup in the same RUN layer."

---

## 2. Container networking, volumes, resource limits, and isolation

**In one sentence:** a container is a normal Linux process isolated by **namespaces** (PID, network, mount, UTS, IPC, user) and limited by **cgroups** (CPU, memory, I/O, PIDs); it gets **networking** through a virtual interface on a bridge (or the host network), keeps persistent data in **volumes**, and shares the **host kernel** — so it's lighter but less isolated than a VM.

### In plain words
Containers are flats in one building: each has its own front door, address and furniture (namespaces), and a fair share of the building's water and electricity (cgroups) — but they all share the same foundations and plumbing (the kernel). VMs are separate houses.

### How it works
**Isolation**
- **Namespaces:** `pid` (own process tree, PID 1 inside), `net` (own interfaces, IPs, ports), `mnt` (own filesystem view), `uts` (hostname), `ipc`, `user` (map root inside to an unprivileged user outside — rootless containers).
- **cgroups v2:** `--memory=512m` (exceeding → **OOM kill**, exit code 137), `--cpus=1.5` (CFS quota → **throttling**, not killing), `--pids-limit`, block I/O weights.
- **Kernel attack surface:** containers share the kernel, so add seccomp, AppArmor/SELinux, dropped capabilities; for untrusted code use **gVisor**, **Kata Containers** or **Firecracker** microVMs.

**Networking (Docker)**
| Mode | What | Use |
|---|---|---|
| `bridge` (default) | private IP on `docker0`, NAT to the outside, `-p 8080:80` publishes ports | single-host apps |
| user-defined bridge | built-in DNS by container name | Compose multi-container apps |
| `host` | shares the host network namespace | max performance, no isolation |
| `none` | no network | batch jobs that need none |
| overlay / CNI | multi-host networking | Swarm, Kubernetes |

**Storage**
- The container's writable layer is **ephemeral** (lost when the container is removed) and slow (copy-on-write).
- **Volumes** (`docker volume create`, managed by Docker) for databases and persistent data; **bind mounts** (host path) for development; `tmpfs` for in-memory scratch; read-only root filesystem (`--read-only`) + explicit writable volumes for production.

**Process hygiene:** handle **SIGTERM** for graceful shutdown (orchestrators wait ~10–30 s, then SIGKILL); PID 1 doesn't get default signal handling and must reap zombies — use `exec` form `CMD ["app"]` and/or `--init` (tini).

```bash
docker run -d --name api --network appnet -p 8080:8080 \
  --memory=512m --cpus=1 --pids-limit=200 --read-only --tmpfs /tmp \
  -v api-data:/var/lib/api --cap-drop=ALL --security-opt no-new-privileges \
  registry.example.com/api@sha256:3f1c...
```

#### Modern C++ example — cgroup-style limits: CPU throttling vs. memory OOM kill, and graceful SIGTERM handling
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <atomic>
#include <csignal>
#include <iostream>
#include <string>
#include <vector>

std::atomic<bool> stop_requested{false};
extern "C" void on_sigterm(int) { stop_requested = true; }

struct Limits { double cpus; long memory_mb; };

std::string run(const Limits& l, double cpu_demand, long mem_demand_mb) {
    std::string out;
    if (cpu_demand > l.cpus) out += "CPU throttled to " + std::to_string(l.cpus).substr(0, 3) + " cores (slower, still running); ";
    if (mem_demand_mb > l.memory_mb) return out + "OOMKilled (exit 137) at " + std::to_string(mem_demand_mb) + " MB > " + std::to_string(l.memory_mb) + " MB";
    return out + "running fine";
}

int main() {
    Limits l{1.0, 512};
    std::cout << "demand 0.5 CPU / 300 MB:  " << run(l, 0.5, 300) << '\n'
              << "demand 3.0 CPU / 300 MB:  " << run(l, 3.0, 300) << '\n'
              << "demand 0.5 CPU / 900 MB:  " << run(l, 0.5, 900) << '\n';

    std::signal(SIGTERM, on_sigterm);                            // orchestrator sends SIGTERM before SIGKILL
    std::vector<int> in_flight{101, 102, 103};
    std::raise(SIGTERM);
    if (stop_requested) {
        std::cout << "SIGTERM received: stop accepting new requests, finish " << in_flight.size() << " in-flight, flush logs, exit 0\n";
        for (int id : in_flight) std::cout << "  completed request " << id << '\n';
    }
}
```

**Output:**
```text
demand 0.5 CPU / 300 MB:  running fine
demand 3.0 CPU / 300 MB:  CPU throttled to 1.0 cores (slower, still running); running fine
demand 0.5 CPU / 900 MB:  OOMKilled (exit 137) at 900 MB > 512 MB
SIGTERM received: stop accepting new requests, finish 3 in-flight, flush logs, exit 0
  completed request 101
  completed request 102
  completed request 103
```

### Interview answer
"A container is a Linux process isolated with namespaces — PID, network, mount, UTS, IPC, user — and constrained with cgroups: exceeding the memory limit gets it OOM-killed with exit code 137, while exceeding the CPU limit only throttles it. It shares the host kernel, so for untrusted code I'd add gVisor, Kata or Firecracker. Networking is usually a bridge with NAT and published ports, or user-defined networks with DNS by name; persistent data belongs in volumes because the writable layer is ephemeral. In production I set limits, a read-only root filesystem, dropped capabilities, and handle SIGTERM for graceful shutdown with an init process as PID 1."

---

## 3. Image scanning, non-root containers, pinned dependencies

**In one sentence:** **scan** images for known vulnerabilities and secrets in CI and continuously in the registry, run processes as a **non-root user** with minimal capabilities, and **pin** base images and packages (digests, lockfiles) so you control exactly what ships — then rebuild regularly to pick up patches.

### In plain words
Before shipping a box, X-ray it for dangerous items (scanning), make sure the delivery person doesn't have a master key to the customer's house (non-root), and list the exact contents with serial numbers so you know what's inside and can recall it (pinning).

### How it works
- **Scanning:** Trivy, Grype, Docker Scout, Snyk, Amazon ECR / Inspector, GCP Artifact Analysis — find CVEs in OS packages and language dependencies, misconfigurations, and embedded secrets. **Fail CI** on critical/high with fixes available; rescan stored images daily (new CVEs appear after build); generate an **SBOM** (Syft) and **sign** images (cosign) ([supply chain](../Security%20Engineering%20%26%20Authentication/Infrastructure-Cloud-and-Supply-Chain-Security.md#2-dependency-vulnerabilities-sboms-and-software-supply-chain-attacks)).
- **Fewer packages = fewer CVEs:** distroless/scratch images have almost nothing to patch; no shells or package managers in runtime images.
- **Non-root:** `USER 10001` in the Dockerfile (numeric UID so Kubernetes `runAsNonRoot` can verify it); bind to ports > 1024; files owned by root but readable; `--cap-drop=ALL`, `no-new-privileges`, read-only root FS. Running as root inside a container + a container escape = root on the host.
- **Pinning:** `FROM image@sha256:…` (tags are mutable), lockfiles with hashes, pinned versions of tools you `curl` in builds — and **automated updates** (Renovate/Dependabot) so pinning doesn't mean never patching.

```dockerfile
# syntax=docker/dockerfile:1.7
FROM golang:1.23@sha256:<digest> AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

FROM gcr.io/distroless/static-debian12:nonroot@sha256:<digest>
COPY --from=build /out/api /api
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/api"]
```

#### Modern C++ example — a Dockerfile policy check (non-root, digests, secrets, latest tags) plus a scan gate
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> check_dockerfile(const std::string& df) {
    std::vector<std::string> issues;
    std::istringstream in(df);
    std::string line, last_user = "root";
    bool any_from = false;
    while (std::getline(in, line)) {
        if (line.rfind("FROM ", 0) == 0) {
            any_from = true;
            if (line.find("@sha256:") == std::string::npos) issues.push_back("base image not pinned by digest: " + line);
            if (line.find(":latest") != std::string::npos) issues.push_back("uses :latest tag");
            last_user = "root";                                  // each stage starts as root
        }
        if (line.rfind("USER ", 0) == 0) last_user = line.substr(5);
        if (std::regex_search(line, std::regex(R"((PASSWORD|SECRET|TOKEN|API_KEY)\s*=)", std::regex::icase))) issues.push_back("secret baked into image: " + line);
        if (line.find("curl") != std::string::npos && line.find("| sh") != std::string::npos) issues.push_back("pipes a remote script to sh (unpinned)");
    }
    if (any_from && (last_user == "root" || last_user == "0")) issues.push_back("final stage runs as root (add USER 10001)");
    return issues;
}

int main() {
    std::string bad = "FROM node:latest\nENV API_KEY=sk-live-123\nRUN curl -fsSL https://get.example.sh | sh\nCOPY . .\nCMD node server.js\n";
    std::string good = "FROM node:22-slim@sha256:0b1c AS build\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n"
                       "FROM gcr.io/distroless/nodejs22-debian12@sha256:9f2e\nCOPY --from=build /app/dist /app\nUSER 10001\nCMD [\"/app/server.js\"]\n";
    for (auto [name, df] : {std::pair{"bad Dockerfile", bad}, std::pair{"good Dockerfile", good}}) {
        auto issues = check_dockerfile(df);
        std::cout << name << ": " << (issues.empty() ? "passes policy" : std::to_string(issues.size()) + " issue(s)") << '\n';
        for (auto& i : issues) std::cout << "  - " << i << '\n';
    }
    struct Vuln { std::string id, severity; bool fixed_in_newer; };
    std::vector<Vuln> scan{{"CVE-2024-6387 openssh", "high", true}, {"CVE-2023-4911 glibc", "high", true}, {"CVE-2022-0001 libx", "low", false}};
    int blocking = 0;
    for (auto& v : scan) blocking += (v.severity == "critical" || v.severity == "high") && v.fixed_in_newer;
    std::cout << "image scan of the bad base: " << blocking << " fixable high/critical -> " << (blocking ? "BLOCK, rebuild on a patched/minimal base" : "pass") << '\n';
}
```

**Output:**
```text
bad Dockerfile: 5 issue(s)
  - base image not pinned by digest: FROM node:latest
  - uses :latest tag
  - secret baked into image: ENV API_KEY=sk-live-123
  - pipes a remote script to sh (unpinned)
  - final stage runs as root (add USER 10001)
good Dockerfile: passes policy
image scan of the bad base: 2 fixable high/critical -> BLOCK, rebuild on a patched/minimal base
```

### Interview answer
"I scan every image in CI with Trivy or Grype — OS packages, language dependencies, misconfigurations and secrets — block fixable critical and high findings, and rescan stored images daily because new CVEs appear after the build; I also generate SBOMs and sign images. Images run as a numeric non-root user with dropped capabilities, no-new-privileges and a read-only filesystem, on minimal or distroless bases with no shell. Base images are pinned by digest and dependencies by lockfiles, with Renovate keeping the pins fresh so we still patch regularly."

---

## 4. Images, layers, registries, Dockerfiles, and multi-stage builds

**In one sentence:** an **image** is a read-only stack of **layers** (filesystem diffs) plus metadata (entrypoint, env, ports), built from a **Dockerfile** and stored in a **registry** (ECR, GHCR, Docker Hub, Artifact Registry); a **container** is a running instance with a thin writable layer on top; **multi-stage builds** compile in one stage and copy only the result into a small final stage.

### In plain words
An image is a recipe photo-book: each page adds one step (a layer), and the finished book is stored in a library (registry). A container is someone cooking from that book with their own notepad for scribbles (writable layer). Multi-stage: one kitchen for messy preparation, and only the finished dish is plated in the clean dining room.

### How it works
**Dockerfile instructions:** `FROM` (base), `WORKDIR`, `COPY`/`ADD` (prefer COPY), `RUN` (build-time commands → new layer), `ENV`, `ARG` (build-time variables — never secrets), `EXPOSE` (documentation), `USER`, `ENTRYPOINT` + `CMD` (prefer **exec form** `["bin","arg"]` so signals reach the app), `HEALTHCHECK`, `LABEL` (OCI annotations).

**Layers:** content-addressed (by SHA-256), shared between images (pull once), cached locally; deleting a file in a later layer **doesn't** shrink the image (it's still in the earlier layer — and so are secrets).

**Registries & tags:** `registry/namespace/repo:tag@sha256:digest`. Tags are **mutable pointers**; digests are immutable. Use immutable tags (git SHA, semver) and **tag immutability** settings in ECR; lifecycle policies to delete old images; replication for multi-region; private registries with IAM/OIDC auth; multi-architecture images (`docker buildx build --platform linux/amd64,linux/arm64`) via manifest lists.

**OCI:** images follow the Open Container Initiative image/distribution specs, so Docker, Podman, BuildKit, containerd and Kubernetes all interoperate.

**Multi-stage example (C++)**
```dockerfile
FROM gcc:14 AS build
WORKDIR /src
COPY CMakeLists.txt .
COPY src/ src/
RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_EXE_LINKER_FLAGS="-static" && cmake --build build -j

FROM scratch
COPY --from=build /src/build/server /server
USER 10001
ENTRYPOINT ["/server"]
```

#### Modern C++ example — an image as content-addressed layers: sharing, the "deleted file is still there" trap, and multi-stage size
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Layer { std::string instruction; std::map<std::string, long> files; std::set<std::string> whiteouts; };   // whiteout = "deleted"

std::string digest(const Layer& l) {
    std::string s = l.instruction;
    for (auto& [f, sz] : l.files) s += f + std::to_string(sz);
    return "sha256:" + std::to_string(std::hash<std::string>{}(s) % 1000000);
}
long image_size(const std::vector<Layer>& layers) { long t = 0; for (auto& l : layers) for (auto& [f, sz] : l.files) t += sz; return t; }
std::map<std::string, long> visible(const std::vector<Layer>& layers) {
    std::map<std::string, long> fs;
    for (auto& l : layers) { for (auto& [f, sz] : l.files) fs[f] = sz; for (auto& w : l.whiteouts) fs.erase(w); }
    return fs;
}

int main() {
    Layer base{"FROM debian:12-slim", {{"/bin+/lib", 75}}, {}};
    std::vector<Layer> single{base, {"RUN apt-get install build-essential", {{"/usr/bin/gcc+headers", 410}}, {}},
                              {"COPY . /src", {{"/src", 3}, {"/src/.env (secret!)", 0}}, {}},
                              {"RUN make && rm -rf /src", {{"/server", 12}}, {"/src", "/src/.env (secret!)"}}};
    std::vector<Layer> multi{{"FROM gcr.io/distroless/cc", {{"/lib (minimal)", 21}}, {}}, {"COPY --from=build /server", {{"/server", 12}}, {}}};
    std::cout << "single-stage: " << image_size(single) << " MB in " << single.size() << " layers; files visible in the container: " << visible(single).size()
              << ", but '/src/.env (secret!)' is still inside layer 3 (" << digest(single[2]) << ")\n";
    std::cout << "multi-stage:  " << image_size(multi) << " MB in " << multi.size() << " layers; build tools and sources never shipped\n";
    std::vector<Layer> other_app{base, {"COPY worker", {{"/worker", 8}}, {}}};
    std::cout << "two images on debian:12-slim share the base layer " << digest(base) << " -> pulled and stored once ("
              << std::boolalpha << (digest(single[0]) == digest(other_app[0])) << ")\n";
}
```

**Output:**
```text
single-stage: 500 MB in 4 layers; files visible in the container: 3, but '/src/.env (secret!)' is still inside layer 3 (sha256:832148)
multi-stage:  33 MB in 2 layers; build tools and sources never shipped
two images on debian:12-slim share the base layer sha256:719748 -> pulled and stored once (true)
```

### Interview answer
"An image is an ordered stack of content-addressed read-only layers plus config like the entrypoint, built from a Dockerfile and pushed to a registry; a container adds a thin writable layer when it runs. Layers are shared and cached, but deleting a file in a later layer doesn't remove it from the image, so secrets must never be copied in. Tags are mutable pointers while digests are immutable, so I deploy by digest or immutable git-SHA tags, with registry lifecycle policies and multi-arch manifests. Multi-stage builds compile in a full toolchain image and copy only the artifact into a slim, distroless or scratch final stage."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Layer cache | stable steps first: base → manifests → install → source; first change rebuilds everything after |
| BuildKit | cache mounts, secret mounts, registry/GHA cache in CI |
| Reproducible | base by digest, lockfiles, git-SHA tags, no `curl \| sh` |
| Small images | multi-stage, slim/distroless/scratch, `.dockerignore`, clean caches in the same RUN |
| Isolation | namespaces (pid, net, mnt, uts, ipc, user) + cgroups; shared kernel → gVisor/Kata/Firecracker for untrusted code |
| Limits | memory over limit → OOMKilled (137); CPU over limit → throttled |
| Networking | bridge + NAT + `-p`; user-defined bridge DNS; host; none; overlay/CNI |
| Storage | writable layer is ephemeral → volumes; bind mounts for dev; read-only root + tmpfs |
| Signals | exec-form CMD, handle SIGTERM, `--init`/tini as PID 1 |
| Scanning | Trivy/Grype in CI + continuous; block fixable high/critical; SBOM + cosign |
| Non-root | `USER 10001`, ports > 1024, cap-drop ALL, no-new-privileges |
| Images | content-addressed layers; deleted files remain in old layers; tags mutable, digests immutable; OCI; multi-arch |
