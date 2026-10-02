# Flagship Project — Raft KV Store in Rust

**What:** a public, Raft-replicated, sharded key-value store in Rust, like a small etcd or TiKV. It has:

- a gRPC API and a Go client;
- fault-injection tests and benchmarks;
- Docker + Kubernetes deployment.

**Why:** it goes at the top of every CV version and covers what CMU 15-445 and GSoC 2026 don't show: distributed systems, backend services, Docker/Kubernetes, observability and measured performance.

**Time:** there are no fixed dates, because the time available during military service varies. Milestone **M0** is 20 short steps woven into the [step-by-step study plan](README.md). After step 104, work through **M1 → M8 in order**, alternating with the Phase 7 steps. Use Friday, the one day off, for the coding-heavy milestones. The total is about 240 hours.

## 1. Why this project (and not more CMU or GSoC)

- **CMU projects must stay private** (the course's academic-integrity rule), so no recruiter can see them. They also cover a single-node database only: no replication, no consensus, no cloud.
- **GSoC shows Rust desktop, FFI and IPC work**, but not services, distributed systems, Kubernetes, load tests or production metrics.
- **The job ads the CVs were compared with** (Canonical, Cloudflare, IMC) asked for distributed systems, cloud, containers/Kubernetes, Go and performance. This project adds all of them truthfully.
- **It builds on CMU instead of repeating it:**
  - lectures 3–7 and 21–22 (storage, WAL, recovery) become the storage layer;
  - lectures 17–24 (concurrency control, distributed databases) become the theory behind it.

**Target CV bullet.** Fill in the real numbers at the end:

> Built a Raft-replicated, sharded key-value store in Rust (own Raft implementation, LSM storage, gRPC). Verified linearizable under crashes and network partitions with Maelstrom/Porcupine. X ops/s and p99 Y ms on a 5-node cluster. Deployed with Docker, Helm and Prometheus/Grafana.

## 2. Rules that make it impressive

1. **Write your own Raft.** Use raft-rs or openraft only to compare against. Your own consensus code is what interviewers ask about.
2. **Public repo from the first commit:**
   - small, clean commits;
   - one issue per task;
   - a design doc (RFC) for every big decision.
3. **Every claim has proof:** a test, a benchmark or a graph.
4. **Deterministic simulation testing** with turmoil:
   - run thousands of randomized cluster schedules with injected faults;
   - replay any failure from its seed.
5. **Linearizability checked under faults** with Maelstrom (Jepsen) and Porcupine. Publish the fault matrix.
6. **An honest README:**
   - what works, the known limits and the benchmarks;
   - how to run it with one command.
7. **Ship in milestones.** Each milestone ends with a tag, a short post and an updated design doc.

## 3. What to know before you start
| Topic | Why | Resource |
|---|---|---|
| Raft consensus | The core: election, replication, safety (Figure 2) | [Raft paper](https://raft.github.io/raft.pdf) · [raft.github.io + visualization](https://raft.github.io/) · [Students' Guide to Raft](https://thesquareplanet.com/blog/students-guide-to-raft/) |
| Distributed-systems course | Lab structure and the classic Raft bugs | [MIT 6.5840](https://pdos.csail.mit.edu/6.824/) · [Raft lab](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) |
| Replication, partitioning, consistency | The vocabulary and trade-offs interviewers use | [DDIA](https://dataintensive.net/) ch. 5, 6, 9 · [Jepsen consistency models](https://jepsen.io/consistency) |
| Async Rust | Networking, timers, channels, tasks | [Tokio tutorial](https://tokio.rs/tokio/tutorial) |
| gRPC + protobuf | Client API and Raft RPCs | [tonic](https://github.com/hyperium/tonic) |
| LSM storage engine | WAL, memtable, SSTables, compaction | [mini-lsm](https://skyzh.github.io/mini-lsm/) · CMU lectures 3–7, 21–22 |
| Testing distributed systems | Correctness under faults | [turmoil](https://github.com/tokio-rs/turmoil) · [madsim](https://github.com/madsim-rs/madsim) · [Maelstrom](https://github.com/jepsen-io/maelstrom) · [Gossip Glomers](https://fly.io/dist-sys/) · [Porcupine](https://github.com/anishathalye/porcupine) · [toxiproxy](https://github.com/Shopify/toxiproxy) |
| Ops and cloud | Deploying and observing a cluster | [kind](https://kind.sigs.k8s.io/) · [Helm](https://helm.sh/docs/) · [Prometheus](https://prometheus.io/docs/introduction/overview/) · [OpenTelemetry Rust](https://opentelemetry.io/docs/languages/rust/) |
| Performance | Credible benchmarks and profiling | [go-ycsb](https://github.com/pingcap/go-ycsb) · [etcd performance](https://etcd.io/docs/v3.5/op-guide/performance/) · [cargo flamegraph](https://github.com/flamegraph-rs/flamegraph) |
| Go basics | The client SDK | [A Tour of Go](https://go.dev/tour/) |
| Reference implementations (read, don't copy) | How production systems structure Raft | [raft-rs](https://github.com/tikv/raft-rs) · [openraft](https://github.com/databendlabs/openraft) · [etcd raft](https://github.com/etcd-io/raft) · [talent-plan](https://github.com/pingcap/talent-plan) |

## 4. Architecture
```text
clients (CLI, Go SDK, Rust client)
        │  gRPC: Get / Put / Delete / Scan / CAS
        ▼
  kv-server ── shard router (key range → Raft group)
        │
        ▼
  Raft groups (3–5 replicas each)
    leader election · log replication · ReadIndex reads
    snapshots · membership change
        │ apply committed entries
        ▼
  kv-storage: WAL → memtable → SSTables (LSM), compaction

  ops: Docker image · docker compose · Helm chart (StatefulSet)
       Prometheus metrics · Grafana dashboard · OpenTelemetry traces
```
**Cargo workspace:** `kv-storage`, `kv-raft`, `kv-server`, `kv-client`, `kv-sim` (deterministic simulation tests), `bench`. The Go SDK lives in `clients/go`.

**Design decisions to write up as RFCs:**

- Raft vs Paxos;
- ReadIndex vs lease reads;
- LSM vs B+tree (and the write amplification it costs);
- range vs hash sharding;
- joint consensus vs single-server membership change;
- exactly-once client retries.

## 5. Milestones (in order, no dates)
| # | Milestone | Est. hours | Done when |
|---|---|---|---|
| M0 | Prep + skeleton: papers, Tokio/tonic, RFC-000, repo + CI, WAL + memtable, gRPC Get/Put, Raft election in simulation (the 20 flagship steps of the study plan) | 20 | CI green; RFC-000 in `docs/`; election test passes under turmoil with random delays |
| M1 | Storage engine (WAL with checksums, memtable, SSTables + bloom filters, compaction v0, crash recovery) + gRPC Get/Put/Delete/Scan + CLI + criterion benchmarks | 24 | `kill -9` mid-write never loses an acknowledged write; first benchmark numbers committed |
| M2 | Raft core: election, log replication, commit, persistence, conflict handling; deterministic simulation with partitions, drops, reordering, crashes | 36 | Every Figure 2 rule has a test; 1000 seeded random runs pass; any failure replays from its seed |
| M3 | Replicated KV: state machine, ReadIndex reads, client IDs for exactly-once retries, snapshots + InstallSnapshot, Maelstrom adapter | 24 | Maelstrom `lin-kv` passes on 5 nodes, including partitions |
| M4 | Faults: docker + toxiproxy + tc netem (partitions, latency, loss, crashes, disk-full); history recorder + Porcupine | 24 | Fault matrix in the README, every scenario linearizable; each bug found has a regression test |
| M5 | Scale-out: multi-Raft per key range, shard router, membership change, shard split/move, rebalancing | 36 | Add/remove a node and move a shard under load with no lost or duplicated writes |
| M6 | Ops: small Docker image, compose 3/5-node clusters, Helm chart on kind, Prometheus metrics, Grafana dashboard, tracing | 24 | `helm install` gives a healthy 3-node cluster; killing the leader shows a failover on the dashboard |
| M7 | Performance + Go SDK: YCSB-style workloads, batching/pipelining, flamegraph tuning, comparison with etcd | 24 | Benchmark report with ops/s and p50/p99 for 3 workloads, before and after tuning, plus methodology |
| M8 | Ship v1.0: final README, architecture doc + RFCs, 2 blog posts, 3-minute demo video, CV/LinkedIn update, Show HN / r/rust | 24 | v1.0 tagged; all three CVs rebuilt with real numbers; post published; GSoC mentors asked for feedback |

## 6. How to present it to companies

- **README:**
  - one-line pitch, architecture diagram, one-command quick start (`docker compose up`);
  - features table;
  - **fault-test matrix**, **benchmark charts** (ops/s, p50/p99, against etcd) and **known limits**.
- **Two blog posts:**
  1. "Building Raft in Rust: the bugs deterministic simulation found"
  2. "Benchmarking my KV store against etcd"
- **3-minute demo video:** kill the leader live; the cluster keeps serving and Grafana shows the failover.
- **CV:** the first item under Projects in all three versions:
  - General SWE: numbers + the Go SDK;
  - Systems: Raft and simulation testing;
  - Embedded: the WAL, crash recovery and the latency budget.
- **Interview story (STAR):** the hardest bug, a trade-off you changed your mind on, and what you'd do differently.
- **Share it:** a LinkedIn post at v1.0, r/rust, Hacker News "Show HN", and a message to the GSoC mentors asking for feedback or a referral.

## 7. Routine

- **Every session:** a small commit, then tick the step.
- **Every week:** update the design doc, add a note to `docs/log.md`, run the full simulation suite.
- **Every milestone:** tag a release, write a short public post, update the CV bullet.
