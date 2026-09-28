# Deadlocks — Detection and Prevention

> **What you'll learn:** what a deadlock is, the four conditions that cause it, and the four ways to deal with it: **prevention**, **avoidance** (Banker's algorithm), **detection** (wait-for graphs) and **recovery**. Also: livelock and starvation.
>
> **Prerequisites:** [Thread Synchronization](./Thread-Synchronization.md).

## Table of Contents
1. [What is a deadlock?](#1-what-is-a-deadlock)
2. [The four necessary conditions (Coffman conditions)](#2-the-four-necessary-conditions-coffman-conditions)
3. [Deadlock prevention](#3-deadlock-prevention)
4. [Deadlock avoidance: the Banker's algorithm](#4-deadlock-avoidance-the-bankers-algorithm)
5. [Deadlock detection: the wait-for graph](#5-deadlock-detection-the-wait-for-graph)
6. [Recovery from deadlock](#6-recovery-from-deadlock)
7. [Cousins: livelock and starvation](#7-cousins-livelock-and-starvation)
8. [Cheat sheet](#cheat-sheet)

---

## 1. What is a deadlock?

**In one sentence:** a deadlock is when two or more threads are each waiting for something another one holds, so none of them can ever continue.

### In plain words
Two people eat with one fork and one knife on the table, and each needs *both* to eat. Alice grabs the fork, Bob grabs the knife. Alice waits for the knife; Bob waits for the fork. Neither will let go. They starve forever politely. That is a deadlock.

A real-life version: a four-way intersection where four cars each entered and each waits for the car on its right to move.

### How it works
```
  Thread A ──holds──> [Mutex 1]
     ^                    |
     |                wanted by
  wanted by               v
  [Mutex 2] <──holds── Thread B
```
A holds 1 and wants 2; B holds 2 and wants 1 → a **cycle** of waiting.

### Modern C++ example — creating a deadlock (safely, with a timeout)
To keep the program from hanging forever, we use `std::timed_mutex::try_lock_for`, which gives up after a while. With a normal `lock()` this program would freeze.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <latch>
#include <mutex>
#include <thread>

using namespace std::chrono_literals;

std::timed_mutex fork_, knife;
std::latch both_holding(2);   // makes sure both threads grab their first item first

void diner(const char* name, std::timed_mutex& first, std::timed_mutex& second) {
    std::unique_lock a(first);
    both_holding.arrive_and_wait();              // now each holds one utensil
    if (!second.try_lock_for(200ms)) {           // a normal lock() would wait FOREVER
        std::cout << name << ": stuck waiting - deadlock!\n";
        return;
    }
    second.unlock();
}

int main() {
    std::jthread alice(diner, "Alice", std::ref(fork_), std::ref(knife));
    std::this_thread::sleep_for(50ms);           // keep output order stable
    std::jthread bob(diner, "Bob", std::ref(knife), std::ref(fork_));
}
```

**Output (may vary):**
```text
Alice: stuck waiting - deadlock!
Bob: stuck waiting - deadlock!
```

### Common mistakes
- Assuming deadlocks will show up in testing. They depend on timing and may appear once a month in production.

### Interview answer
"A deadlock is a state where a set of threads are all blocked, each waiting for a resource held by another thread in the set, so none can proceed."

---

## 2. The four necessary conditions (Coffman conditions)

**In one sentence:** a deadlock can only happen if **all four** of these are true at once: mutual exclusion, hold-and-wait, no preemption, and circular wait.

### In plain words
Using the fork-and-knife story:
1. **Mutual exclusion** — only one person can use the fork at a time.
2. **Hold and wait** — Alice keeps holding the fork while waiting for the knife.
3. **No preemption** — nobody can snatch the fork out of Alice's hand.
4. **Circular wait** — Alice waits for Bob, Bob waits for Alice (a cycle).

Break **any one** of them and deadlock is impossible. That is the whole idea behind prevention.

### How it works
| Condition | What it means | How to break it |
|---|---|---|
| Mutual exclusion | Resource can't be shared | Make it shareable (read-only data, lock-free structures) |
| Hold and wait | Hold one, wait for another | Request **all** resources at once |
| No preemption | Can't take resources away | Use `try_lock`; if you fail, release what you hold and retry |
| Circular wait | A cycle of waiting | Always lock in a **global order** |

### Interview answer
"Coffman's four conditions — mutual exclusion, hold-and-wait, no preemption and circular wait — are all necessary for deadlock. Prevention works by guaranteeing at least one never holds; in practice, lock ordering to break circular wait is the most common."

---

## 3. Deadlock prevention

**In one sentence:** design the code so that at least one Coffman condition can never happen.

### In plain words
Put a house rule in place: "Everyone must pick up the **fork first**, then the knife." Now Bob can't hold the knife while waiting for the fork, so the cycle can't form.

### How it works
Three practical techniques in C++:
1. **Lock ordering (breaks circular wait):** give every mutex a rank; always lock lower rank first.
2. **Lock all at once (breaks hold-and-wait):** `std::scoped_lock lock(m1, m2);` uses a built-in deadlock-avoidance algorithm to acquire both.
3. **Try-and-back-off (breaks no-preemption):** `try_lock`; if it fails, release everything, wait a bit, retry.

### Modern C++ example — safe money transfer between accounts
Transferring between two accounts needs both accounts' locks. If thread 1 transfers A→B while thread 2 transfers B→A, naive locking deadlocks. `std::scoped_lock` fixes it.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <mutex>
#include <thread>

struct Account {
    std::mutex m;
    int balance;
};

void transfer(Account& from, Account& to, int amount) {
    // Locks BOTH mutexes without risk of deadlock, no matter the argument order.
    std::scoped_lock lock(from.m, to.m);
    from.balance -= amount;
    to.balance += amount;
}

int main() {
    Account a{.m = {}, .balance = 1000}, b{.m = {}, .balance = 1000};
    {
        std::jthread t1([&] { for (int i = 0; i < 10'000; ++i) transfer(a, b, 1); });
        std::jthread t2([&] { for (int i = 0; i < 10'000; ++i) transfer(b, a, 1); });
    }
    std::cout << "a=" << a.balance << " b=" << b.balance
              << " total=" << a.balance + b.balance << '\n';
}
```

**Output:**
```text
a=1000 b=1000 total=2000
```

### Modern C++ example — explicit lock ordering by address
When you can't lock all at once (e.g. the locks are taken in different functions), order them consistently:

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <mutex>
#include <thread>

void lock_in_order(std::mutex& x, std::mutex& y) {
    // Rule: always lock the mutex with the lower address first.
    if (std::less<std::mutex*>{}(&y, &x)) { y.lock(); x.lock(); }
    else                                  { x.lock(); y.lock(); }
}

int main() {
    std::mutex m1, m2;
    int shared = 0;
    {
        std::jthread t1([&] { for (int i = 0; i < 1000; ++i) {
            lock_in_order(m1, m2); ++shared; m1.unlock(); m2.unlock(); } });
        std::jthread t2([&] { for (int i = 0; i < 1000; ++i) {
            lock_in_order(m2, m1); ++shared; m2.unlock(); m1.unlock(); } });
    }
    std::cout << "finished without deadlock, shared=" << shared << '\n';
}
```

**Output:**
```text
finished without deadlock, shared=2000
```

### Common mistakes
- Calling unknown code (callbacks, virtual functions) while holding a lock — it might take other locks in the wrong order.

### Interview answer
"I prevent deadlocks mainly by consistent lock ordering and by acquiring multiple locks atomically with `std::scoped_lock`. I avoid holding locks while calling external code, and use timeouts with `try_lock_for` where appropriate."

---

## 4. Deadlock avoidance: the Banker's algorithm

**In one sentence:** before granting a resource request, the system checks whether granting it could possibly lead to deadlock, and only grants it if the system stays in a **safe state**.

### In plain words
A small-town banker has $10 and several customers with credit limits. Before lending money, the banker asks: "If I lend this, can I still find *some order* in which every customer gets their full limit, finishes their project, and pays me back?" If yes, the loan is **safe**. If not, the customer must wait, even though the cash is technically available.

### How it works
Each process declares its **maximum** need up front. The system tracks:
- `Available[r]` — free units of resource type *r*
- `Max[p][r]` — the most process *p* may ever request
- `Allocation[p][r]` — what *p* currently holds
- `Need[p][r] = Max − Allocation`

**Safety check:**
1. `Work = Available`, all processes unfinished.
2. Find an unfinished process whose `Need ≤ Work`. Pretend it runs to completion and returns its allocation: `Work += Allocation[p]`, mark it finished.
3. Repeat. If every process finishes → **safe** (and that order is a *safe sequence*). Otherwise → **unsafe**.

It's used more in textbooks than real OSes (processes rarely know their max needs), but it's a common interview question.

### Modern C++ example
The classic textbook example with 5 processes and 3 resource types.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <vector>

using Matrix = std::vector<std::vector<int>>;

// Returns a safe order of processes, or nullopt if the state is unsafe.
std::optional<std::vector<int>> safe_sequence(std::vector<int> work,
                                              const Matrix& max, const Matrix& alloc) {
    const std::size_t n = max.size(), m = work.size();
    std::vector<bool> finished(n, false);
    std::vector<int> order;

    for (std::size_t round = 0; round < n; ++round) {
        bool progressed = false;
        for (std::size_t p = 0; p < n; ++p) {
            if (finished[p]) continue;
            bool can_finish = true;
            for (std::size_t r = 0; r < m; ++r)
                if (max[p][r] - alloc[p][r] > work[r]) { can_finish = false; break; }
            if (can_finish) {
                for (std::size_t r = 0; r < m; ++r) work[r] += alloc[p][r]; // it gives back
                finished[p] = true;
                order.push_back(static_cast<int>(p));
                progressed = true;
            }
        }
        if (!progressed) break;
    }
    if (order.size() != n) return std::nullopt;
    return order;
}

int main() {
    std::vector<int> available{3, 3, 2};
    Matrix max  {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
    Matrix alloc{{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};

    if (auto seq = safe_sequence(available, max, alloc)) {
        std::cout << "SAFE. One safe order:";
        for (int p : *seq) std::cout << " P" << p;
        std::cout << '\n';
    } else {
        std::cout << "UNSAFE\n";
    }
}
```

**Output:**
```text
SAFE. One safe order: P1 P3 P4 P0 P2
```

### Common mistakes
- Thinking "unsafe" means "deadlocked". Unsafe means deadlock is *possible*, not guaranteed.

### Interview answer
"Avoidance grants a request only if the resulting state is safe, i.e. there exists an order in which all processes can obtain their maximum needs and finish. The Banker's algorithm checks this in O(n²·m), but it requires knowing maximum needs in advance, so it's rarely used in general-purpose OSes."

---

## 5. Deadlock detection: the wait-for graph

**In one sentence:** let deadlocks happen, but periodically build a graph of "who is waiting for whom" and look for a cycle.

### In plain words
A security guard walks around the building every few minutes and draws arrows: "Alice is waiting for Bob", "Bob is waiting for Carol". If the arrows ever form a loop back to the start, those people are deadlocked.

### How it works
1. Nodes = threads/processes.
2. Edge **A → B** if A is waiting for a resource B holds.
3. A **cycle** in this graph = deadlock (when each resource has a single instance).
4. Find cycles with depth-first search: if DFS reaches a node that is still "on the current path", there's a cycle.

Databases do exactly this: PostgreSQL and MySQL detect deadlocked transactions and abort one of them.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

using Graph = std::map<std::string, std::vector<std::string>>;

// Returns the list of threads forming a cycle, or empty if none.
std::vector<std::string> find_deadlock(const Graph& waits_for) {
    std::set<std::string> visited, on_path;
    std::vector<std::string> path, cycle;

    std::function<bool(const std::string&)> dfs = [&](const std::string& node) {
        visited.insert(node);
        on_path.insert(node);
        path.push_back(node);
        if (auto it = waits_for.find(node); it != waits_for.end()) {
            for (const auto& next : it->second) {
                if (on_path.contains(next)) {                  // back to our own path: cycle!
                    auto start = std::find(path.begin(), path.end(), next);
                    cycle.assign(start, path.end());
                    return true;
                }
                if (!visited.contains(next) && dfs(next)) return true;
            }
        }
        on_path.erase(node);
        path.pop_back();
        return false;
    };

    for (const auto& [node, _] : waits_for)
        if (!visited.contains(node) && dfs(node)) break;
    return cycle;
}

int main() {
    Graph g{
        {"T1", {"T2"}},      // T1 waits for T2
        {"T2", {"T3"}},      // T2 waits for T3
        {"T3", {"T1"}},      // T3 waits for T1  -> cycle
        {"T4", {"T1"}},      // T4 is stuck behind the cycle but not part of it
    };
    auto cycle = find_deadlock(g);
    if (cycle.empty()) { std::cout << "no deadlock\n"; return 0; }
    std::cout << "deadlock cycle:";
    for (const auto& t : cycle) std::cout << ' ' << t;
    std::cout << '\n';
}
```

**Output:**
```text
deadlock cycle: T1 T2 T3
```

### Common mistakes
- With *multiple instances* of each resource, a cycle doesn't necessarily mean deadlock; you need a Banker-style detection algorithm instead.

### Interview answer
"Detection lets the system run freely and periodically builds a wait-for graph; with single-instance resources a cycle means deadlock, found by DFS in O(V+E). Databases use this and then abort a victim transaction."

---

## 6. Recovery from deadlock

**In one sentence:** once detected, a deadlock is broken by killing (aborting) one or more participants or by taking resources away from them (rollback).

### In plain words
The security guard found the loop. Now someone has to give up: the guard asks the person with the least important task to drop what they hold and start over.

### How it works
- **Abort all** deadlocked processes — simple, expensive.
- **Abort one at a time** until the cycle breaks. Pick a *victim* by cost: lowest priority, least work done, fewest resources held.
- **Preempt resources + roll back** the victim to a safe checkpoint (databases roll back a transaction).
- Avoid always picking the same victim → **starvation**. Count how many times each has been chosen.

### Modern C++ example
Choose the cheapest victim in a detected cycle.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Txn {
    std::string name;
    int work_done;       // how much would be lost by aborting it
    int times_aborted;   // to avoid starving the same victim
};

int main() {
    std::vector<Txn> cycle{{"T1", 50, 0}, {"T2", 5, 2}, {"T3", 8, 0}};
    auto cost = [](const Txn& t) { return t.work_done + 100 * t.times_aborted; };
    auto victim = std::ranges::min_element(cycle, {}, cost);
    std::cout << "abort " << victim->name << " (cost " << cost(*victim) << ")\n";
}
```

**Output:**
```text
abort T3 (cost 8)
```
T2 did the least work, but it has already been aborted twice, so T3 is chosen to avoid starving T2.

### Interview answer
"Recovery breaks the cycle by aborting processes or preempting resources and rolling back. Victim selection minimizes cost — priority, work done, resources held — while tracking rollback counts to prevent starvation."

---

## 7. Cousins: livelock and starvation

**In one sentence:** in a **livelock** threads keep running but make no progress; in **starvation** one thread never gets the resource because others always get it first.

### In plain words
- **Livelock:** two people meet in a narrow hallway. Both step left; both step right; both step left… forever. They're moving, but nobody gets through.
- **Starvation:** a polite person at a busy door always lets others go first and never gets in.

### How it works
- Livelock often comes from "try-lock, fail, back off, retry" with identical timing. Fix: add **random** back-off.
- Starvation comes from unfair scheduling or priorities. Fix: fair queues, **aging** (increase priority the longer you wait).

### Modern C++ example — try-lock with random back-off (no deadlock, no livelock)
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <mutex>
#include <random>
#include <thread>

using namespace std::chrono_literals;

void grab_both(std::mutex& first, std::mutex& second, int& done) {
    std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<int> jitter(1, 5);
    while (true) {
        std::unique_lock a(first);
        std::unique_lock b(second, std::try_to_lock);
        if (b.owns_lock()) { ++done; return; }         // got both
        a.unlock();                                     // release and back off...
        std::this_thread::sleep_for(std::chrono::milliseconds(jitter(rng))); // ...randomly
    }
}

int main() {
    std::mutex fork_, knife;
    int done = 0;
    {
        std::jthread alice(grab_both, std::ref(fork_), std::ref(knife), std::ref(done));
        std::jthread bob(grab_both, std::ref(knife), std::ref(fork_), std::ref(done));
    }
    std::cout << done << " diners ate\n";
}
```

**Output:**
```text
2 diners ate
```
(`done` is only modified while holding both mutexes, so it's safe.)

### Interview answer
"Livelock is when threads keep reacting to each other without progress, typically fixed with randomized back-off. Starvation is when a thread is perpetually denied a resource, fixed with fair queuing or aging."

---

## Cheat sheet

| Strategy | Idea | Cost |
|---|---|---|
| Prevention | Make one Coffman condition impossible (lock ordering, lock-all-at-once) | Design discipline |
| Avoidance | Only grant requests that keep a safe state (Banker's) | Needs max needs in advance |
| Detection | Find cycles in the wait-for graph | Periodic CPU cost |
| Recovery | Abort/roll back a victim | Lost work |
| Ignore ("ostrich") | Assume it's rare; reboot if it happens | What most desktop OSes do for general resources |

**Next:** [Scheduling](./Scheduling.md).
