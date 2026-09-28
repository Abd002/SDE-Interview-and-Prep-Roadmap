# CPU Scheduling Algorithms — Explained for Beginners

> **What you'll learn:** what a scheduler does, how we measure a "good" schedule, the classic algorithms (FCFS, SJF, Round Robin, Priority), and the three advanced algorithms in the roadmap: **Fair Share Scheduling**, **Earliest Deadline First (EDF)** and **Weighted Fair Queuing (WFQ)**. Every algorithm comes with a small C++ simulator you can run and modify.
>
> **Prerequisites:** [Processes](./Processes.md) (states, context switching).

## Table of Contents
0. [Scheduling basics: what, why, and how we measure it](#0-scheduling-basics-what-why-and-how-we-measure-it)
1. [Classic algorithms: FCFS, SJF, Round Robin, Priority](#1-classic-algorithms-fcfs-sjf-round-robin-priority)
2. [Fair share scheduling](#2-fair-share-scheduling)
3. [Earliest Deadline First (EDF)](#3-earliest-deadline-first-edf)
4. [Weighted Fair Queuing (WFQ)](#4-weighted-fair-queuing-wfq)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Scheduling basics: what, why, and how we measure it

**In one sentence:** the scheduler is the part of the OS that decides which ready process/thread gets the CPU next, and for how long.

### In plain words
A single doctor (the CPU) and a waiting room full of patients (ready processes). Someone has to decide who goes next: first come first served? The quickest case first? The most urgent? That decision-maker is the **scheduler**. Different rules are fair or efficient in different ways.

### How it works
Key vocabulary:
- **Burst time:** how long a process needs the CPU before it finishes or waits for I/O.
- **Arrival time:** when it joined the ready queue.
- **Preemptive:** the scheduler may pause a running process to run another (a timer interrupt). **Non-preemptive:** once started, a process runs until it finishes or blocks.
- **Time quantum / time slice:** the maximum time a process runs before being preempted (e.g. 4 ms).

How we score a scheduler:
| Metric | Meaning | Want |
|---|---|---|
| Waiting time | Time spent in the ready queue | Low |
| Turnaround time | Finish time − arrival time | Low |
| Response time | First time on CPU − arrival time | Low (important for interactive apps) |
| Throughput | Processes completed per second | High |
| CPU utilization | % of time the CPU is busy | High |
| Fairness | Everyone gets a reasonable share | High |

No algorithm wins on all metrics — scheduling is about trade-offs.

---

## 1. Classic algorithms: FCFS, SJF, Round Robin, Priority

These aren't separate items in the roadmap, but you need them to understand the advanced ones.

### In plain words
- **FCFS (First-Come, First-Served):** a supermarket queue. Simple, but one customer with a full cart makes everyone behind them wait (the **convoy effect**).
- **SJF (Shortest Job First):** "anyone with 3 items or fewer goes first". Minimizes average waiting time, but a big job may wait forever (**starvation**), and you must *guess* how long jobs take.
- **Round Robin (RR):** everyone gets 4 minutes with the doctor, then goes to the back of the line if not finished. Fair and responsive; too-small slices waste time on switching.
- **Priority:** emergencies first. Low-priority work can starve unless its priority slowly increases while it waits (**aging**).

Real OSes combine these. Linux's default scheduler (CFS, and EEVDF since kernel 6.6) tries to give each thread a fair share of CPU time; Windows uses priority levels with round robin inside each level (a *multilevel feedback queue*).

### Modern C++ example — compare FCFS, SJF and RR on the same workload
Classic textbook workload: P1 needs 24 ms, P2 needs 3 ms, P3 needs 3 ms, all arriving at time 0.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <deque>
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Proc { std::string name; int burst; };

// Non-preemptive: run processes in the given order; return average waiting time.
double run_in_order(const std::vector<Proc>& order) {
    int clock = 0, total_wait = 0;
    for (const auto& p : order) { total_wait += clock; clock += p.burst; }
    return double(total_wait) / order.size();
}

double round_robin(const std::vector<Proc>& procs, int quantum) {
    struct Job { const Proc* p; int remaining; int last_ready; int waited; };
    std::deque<Job> queue;
    for (const auto& p : procs) queue.push_back({&p, p.burst, 0, 0});
    int clock = 0, total_wait = 0;
    while (!queue.empty()) {
        Job j = queue.front(); queue.pop_front();
        j.waited += clock - j.last_ready;                 // time spent waiting in line
        int run = std::min(quantum, j.remaining);
        clock += run;
        j.remaining -= run;
        if (j.remaining > 0) { j.last_ready = clock; queue.push_back(j); }
        else total_wait += j.waited;
    }
    return double(total_wait) / procs.size();
}

int main() {
    std::vector<Proc> procs{{"P1", 24}, {"P2", 3}, {"P3", 3}};

    auto sjf = procs;
    std::ranges::sort(sjf, {}, &Proc::burst);             // shortest burst first

    std::cout << std::format("FCFS avg wait: {:.2f} ms\n", run_in_order(procs));
    std::cout << std::format("SJF  avg wait: {:.2f} ms\n", run_in_order(sjf));
    std::cout << std::format("RR   avg wait: {:.2f} ms (quantum 4)\n", round_robin(procs, 4));
}
```

**Output:**
```text
FCFS avg wait: 17.00 ms
SJF  avg wait: 3.00 ms
RR   avg wait: 5.67 ms (quantum 4)
```
FCFS suffers the convoy effect (short jobs stuck behind P1). SJF is optimal for average waiting time. RR sits in between but gives every process a quick first response.

### Interview answer
"FCFS is simple but suffers convoy effects; SJF/SRTF minimize average waiting time but need burst estimates and can starve long jobs; Round Robin gives good response time with a well-chosen quantum; priority scheduling needs aging to prevent starvation. Real systems use multilevel feedback queues or fair schedulers like Linux CFS/EEVDF."

---

## 2. Fair share scheduling

**In one sentence:** fair share scheduling divides CPU time fairly between **users or groups** first, and only then between the processes inside each group.

### In plain words
Two roommates share one TV for 12 hours. Alice wants to watch one show. Bob invites 3 friends who each want to watch something. With plain round robin over *people*, Bob's group gets 3/4 of the TV time just because he brought more people. Fair share says: **Alice and Bob each get 6 hours** — Bob's 3 friends then split Bob's 6 hours (2 hours each).

### How it works
1. Assign each group (user, container, team) a **share** (e.g. 50% each, or weighted: 70/30).
2. Track how much CPU each group has recently used.
3. When choosing who runs next, pick the group furthest below its share; then pick a process within that group (e.g. round robin or least-used).
4. Usage often **decays** over time, so what you used an hour ago matters less than what you used a second ago.

Real-world: Linux **cgroups** with `cpu.weight` (used by Docker/Kubernetes CPU limits), and cluster schedulers like SLURM's fair-share.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Process { std::string name; int used = 0; };
struct Group   { std::string name; double share; int used = 0; std::vector<Process> procs; };

int main() {
    std::vector<Group> groups{
        {"alice", 0.5, 0, {{"a1"}}},
        {"bob",   0.5, 0, {{"b1"}, {"b2"}, {"b3"}}},
    };

    for (int tick = 0; tick < 12; ++tick) {
        // 1) choose the group that has used the least relative to its share
        auto& g = *std::ranges::min_element(groups, {}, [](const Group& g) {
            return g.used / g.share;
        });
        // 2) inside that group, choose the process that has used the least
        auto& p = *std::ranges::min_element(g.procs, {}, &Process::used);
        ++p.used;
        ++g.used;
    }

    for (const auto& g : groups) {
        std::cout << std::format("{} total={}:", g.name, g.used);
        for (const auto& p : g.procs) std::cout << std::format(" {}={}", p.name, p.used);
        std::cout << '\n';
    }
}
```

**Output:**
```text
alice total=6: a1=6
bob total=6: b1=2 b2=2 b3=2
```

### Common mistakes
- Thinking fair share means every *process* gets the same time. It means every *group* gets its share; individual processes can get very different amounts.

### Interview answer
"Fair share scheduling allocates CPU to groups (users, cgroups) according to configured shares, then schedules processes within each group. It prevents a user from grabbing more CPU just by spawning more processes. Linux implements it via cgroups CPU weights."

---

## 3. Earliest Deadline First (EDF)

**In one sentence:** EDF always runs the ready task whose deadline is soonest; it's a **real-time** scheduling algorithm.

### In plain words
You have homework for three classes. You always work on whatever is **due soonest**. If a new assignment arrives that's due even sooner, you switch to it. As long as the total work fits in the time available, you'll never miss a deadline.

### How it works
- **Real-time systems** (car brakes, pacemakers, drones, audio) care less about "fast on average" and more about "never late".
- Tasks are often **periodic**: task *i* needs **C** units of CPU every **P** units of time, and must finish before the next period starts (deadline = end of period).
- EDF is **dynamic priority**: priorities change as deadlines approach. It's **preemptive**.
- **Schedulability test** (for periodic tasks with deadline = period, on one CPU):
  `U = Σ Cᵢ / Pᵢ ≤ 1` ⇒ EDF meets **every** deadline. EDF is *optimal*: if any algorithm can schedule the set, EDF can.
- The downside: when overloaded (U > 1), EDF can fail badly — many tasks miss deadlines in a chain reaction ("domino effect").
- Compare **Rate Monotonic (RM)**: fixed priority, shorter period = higher priority; simpler, but only guaranteed up to U ≈ 69% for many tasks.

Linux supports EDF via the `SCHED_DEADLINE` policy.

### Modern C++ example
Three periodic tasks: T1 (C=1, P=4), T2 (C=2, P=6), T3 (C=3, P=8). Utilization = 1/4 + 2/6 + 3/8 ≈ 0.958 ≤ 1, so EDF should meet all deadlines. We simulate 24 time units (the least common multiple of the periods).

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Task { std::string name; int C, P; int remaining = 0, deadline = 0; };

int main() {
    std::vector<Task> tasks{{"1", 1, 4}, {"2", 2, 6}, {"3", 3, 8}};
    double U = 0;
    for (auto& t : tasks) U += double(t.C) / t.P;
    std::cout << std::format("utilization = {:.3f}\n", U);

    std::string timeline;
    int missed = 0;
    for (int time = 0; time < 24; ++time) {
        for (auto& t : tasks) {
            if (time % t.P == 0) {                    // new period starts: release a job
                if (t.remaining > 0) ++missed;        // previous job didn't finish in time!
                t.remaining = t.C;
                t.deadline = time + t.P;
            }
        }
        Task* pick = nullptr;                         // earliest deadline among ready jobs
        for (auto& t : tasks)
            if (t.remaining > 0 && (!pick || t.deadline < pick->deadline)) pick = &t;
        if (pick) { --pick->remaining; timeline += pick->name; }
        else timeline += '.';                         // CPU idle
    }
    std::cout << "timeline: " << timeline << '\n';
    std::cout << "deadlines missed: " << missed << '\n';
}
```

**Output:**
```text
utilization = 0.958
timeline: 12231332123313221322133.
deadlines missed: 0
```
Each character is the task that ran in that time unit (`.` = idle). Ties in deadline go to the task listed first.

### Common mistakes
- Forgetting that EDF's guarantee assumes a single CPU and deadline = period. Multi-core real-time scheduling is much harder.
- Ignoring the overload case — production real-time systems add admission control ("reject the task if U would exceed 1").

### Interview answer
"EDF is a preemptive dynamic-priority real-time scheduler that always runs the job with the nearest absolute deadline. For independent periodic tasks with deadline equal to period on one CPU, it meets all deadlines iff utilization ≤ 1, which makes it optimal, but it degrades unpredictably under overload."

---

## 4. Weighted Fair Queuing (WFQ)

**In one sentence:** WFQ shares a resource (classically a network link) between several flows in proportion to their **weights**, by sending packets in order of a computed "virtual finish time".

### In plain words
A single-lane bridge shared by cars from two towns. Town A paid for 2/3 of the bridge, town B for 1/3. WFQ lets roughly 2 cars from A cross for every 1 car from B — but if A has no cars waiting, B can use the whole bridge (nothing is wasted).

### How it works
The ideal is **GPS (Generalized Processor Sharing)** — imagine serving all flows simultaneously, bit by bit, each at a rate proportional to its weight. Real links send one whole packet at a time, so WFQ **simulates** GPS:
1. For each arriving packet of flow *f* with size *L*, compute a **virtual finish time**:
   `F = max(V(now), F_previous_packet_of_f) + L / weight_f`
   (V(now) is "virtual time", roughly how far the ideal GPS system has progressed.)
2. Always transmit the queued packet with the **smallest F**.

Result: each flow gets bandwidth proportional to its weight, and a flow that sends huge packets or floods the queue can't hurt the others. Used in routers (QoS) and, in variants, in CPU and disk schedulers — Linux CFS is essentially a WFQ-like idea applied to CPU time (weights come from nice values).

### Modern C++ example
Two flows, each with 4 packets of 100 bytes queued at time 0. Flow A has weight 2, flow B weight 1.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <tuple>
#include <vector>

struct Packet {
    double finish;           // virtual finish time
    std::string flow;
    int seq;
    bool operator>(const Packet& o) const {       // min-heap by finish time, then flow name
        return std::tie(finish, flow) > std::tie(o.finish, o.flow);
    }
};

int main() {
    std::map<std::string, double> weight{{"A", 2.0}, {"B", 1.0}};
    std::map<std::string, double> last_finish;     // F of each flow's previous packet
    std::priority_queue<Packet, std::vector<Packet>, std::greater<>> queue;

    const double virtual_now = 0;                  // all packets arrive at time 0
    for (const auto& flow : {"A", "B"}) {
        for (int seq = 1; seq <= 4; ++seq) {
            double start = std::max(virtual_now, last_finish[flow]);
            double F = start + 100 / weight[flow]; // size / weight
            last_finish[flow] = F;
            queue.push({F, flow, seq});
        }
    }

    std::cout << "send order:";
    while (!queue.empty()) {
        auto p = queue.top(); queue.pop();
        std::cout << std::format(" {}{}({:.0f})", p.flow, p.seq, p.finish);
    }
    std::cout << '\n';
}
```

**Output:**
```text
send order: A1(50) A2(100) B1(100) A3(150) A4(200) B2(200) B3(300) B4(400)
```
While both flows are busy, A sends two packets for every one of B's — exactly its 2:1 weight. Once A runs out, B gets the whole link.

### Common mistakes
- Confusing WFQ with simple round robin. Round robin counts *packets*; WFQ accounts for packet *size*, so a flow with big packets can't cheat.
- Forgetting WFQ is **work-conserving**: unused share is redistributed, not wasted.

### Interview answer
"WFQ approximates Generalized Processor Sharing: each packet is stamped with a virtual finish time based on its size divided by its flow's weight, and the scheduler always sends the packet with the smallest finish time. It gives weighted fair bandwidth, isolates misbehaving flows and bounds delay. Linux CFS applies the same idea to CPU time."

---

## Cheat sheet

| Algorithm | Picks next… | Preemptive? | Good for | Watch out for |
|---|---|---|---|---|
| FCFS | Earliest arrival | No | Simplicity | Convoy effect |
| SJF / SRTF | Shortest burst | No / Yes | Min avg waiting | Starvation, needs estimates |
| Round Robin | Next in circular queue | Yes | Interactive fairness | Quantum too small/large |
| Priority | Highest priority | Either | Urgent work | Starvation → use aging |
| Fair share | Group furthest below its share | Yes | Multi-user/containers | Group config |
| EDF | Nearest deadline | Yes | Real-time (U ≤ 1) | Overload domino effect |
| WFQ | Smallest virtual finish time | Per packet | Weighted bandwidth/QoS | Bookkeeping cost |

**Next:** [Memory Management](./Memory-Management.md).
