# Concurrency — Explained for Beginners

> **What you'll learn:** threads vs. processes, synchronization primitives (locks, mutexes, semaphores), what **thread safety** means, deadlocks, **race conditions** (and data races), the difference between **parallelism and concurrency**, and a first look at **asynchronous programming** — all in modern C++.
>
> **Prerequisites:** basic C++. The Operating Systems guides go deeper: [Processes](../Operating%20Systems/Processes.md), [Threads](../Operating%20Systems/Threads.md), [Thread Synchronization](../Operating%20Systems/Thread-Synchronization.md), [Deadlocks](../Operating%20Systems/Deadlocks.md).
>
> Compile every example with `-pthread`.

## Table of Contents
1. [Threads vs. Processes](#1-threads-vs-processes)
2. [Synchronization primitives (locks, mutexes, semaphores)](#2-synchronization-primitives-locks-mutexes-semaphores)
3. [Thread safety](#3-thread-safety)
4. [Deadlocks](#4-deadlocks)
5. [Race conditions](#5-race-conditions)
6. [Parallelism vs. Concurrency](#6-parallelism-vs-concurrency)
7. [Asynchronous programming](#7-asynchronous-programming)
8. [Cheat sheet](#cheat-sheet)

---

## 1. Threads vs. Processes

**In one sentence:** a **process** is a running program with its own private memory; a **thread** is a path of execution *inside* a process, and all threads of a process share its memory.

### In plain words
A process is a **house**; threads are the **people living in it**. People in the same house share the fridge and the TV (memory) — easy to share, but they can fight over the remote. Different houses (processes) are separate: to share something you must send it by mail (inter-process communication), but a fire in one house doesn't burn the other.

### How it works
| | Process | Thread |
|---|---|---|
| Memory | Private | Shared with other threads of the same process |
| Cost to create | High | Low |
| Communication | IPC (pipes, sockets, shared memory) | Shared variables (+ synchronization) |
| Failure isolation | Strong | None — one crash kills all threads |

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <thread>
#include <vector>

int main() {
    std::vector<int> results(3);                  // shared memory: every thread can see it
    {
        std::vector<std::jthread> threads;
        for (int i = 0; i < 3; ++i)
            threads.emplace_back([&results, i] { results[i] = i * i; });  // each writes its own slot
    }                                             // jthreads join automatically here
    for (int r : results) std::cout << r << ' ';
    std::cout << '\n';
}
```

**Output:**
```text
0 1 4
```

### Interview answer
"Processes have separate address spaces and communicate via IPC, giving isolation at a higher cost; threads share their process's address space, making communication cheap but requiring synchronization, and a fault in one thread affects the whole process."

---

## 2. Synchronization primitives (locks, mutexes, semaphores)

**In one sentence:** synchronization primitives are the tools that coordinate threads so they don't trip over each other: **mutexes/locks** allow one thread at a time, **semaphores** allow up to N, and **condition variables** let threads wait for a condition.

### In plain words
- **Mutex / lock:** a single bathroom key. One person at a time.
- **Semaphore:** a parking lot with N spaces and a counter at the gate.
- **Condition variable:** a restaurant pager — you wait (without standing in line) until it buzzes to say your table is ready.
- **Atomic:** a turnstile counter that can't be miscounted even if people push through together.

### How it works
| Primitive | C++ type | Use |
|---|---|---|
| Mutex | `std::mutex` + `std::scoped_lock` | Protect shared data |
| Reader–writer lock | `std::shared_mutex` + `std::shared_lock` | Many readers, one writer |
| Semaphore | `std::counting_semaphore<N>` | Limit concurrency to N |
| Condition variable | `std::condition_variable` | Wait until state changes |
| Latch / barrier | `std::latch`, `std::barrier` | Wait for N threads to reach a point |
| Atomic | `std::atomic<T>` | Lock-free counters/flags |

"Lock" is the general idea; a mutex is the most common kind of lock.

### Modern C++ example — mutex, semaphore and latch together
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <latch>
#include <mutex>
#include <semaphore>
#include <thread>
#include <vector>

int main() {
    std::mutex m;                            // protects 'log'
    std::vector<int> log;
    std::counting_semaphore<2> printers(2);  // only 2 workers may "print" at once
    std::latch all_done(5);                  // main waits for 5 workers

    std::vector<std::jthread> workers;
    for (int id = 0; id < 5; ++id) {
        workers.emplace_back([&, id] {
            printers.acquire();
            {
                std::scoped_lock lock(m);    // one thread at a time touches 'log'
                log.push_back(id);
            }
            printers.release();
            all_done.count_down();
        });
    }
    all_done.wait();                         // blocks until all 5 have counted down
    std::cout << "entries logged: " << log.size() << '\n';
}
```

**Output:**
```text
entries logged: 5
```

### Interview answer
"Mutexes provide mutual exclusion with ownership; semaphores are counters that allow up to N concurrent holders and can signal between threads; condition variables let threads sleep until a predicate holds; atomics give lock-free single-variable operations. In C++ I use RAII lock guards so locks are always released."

---

## 3. Thread safety

**In one sentence:** code is **thread-safe** if it behaves correctly when called from multiple threads at the same time, without the caller having to add extra locking.

### In plain words
A shared notebook is **thread-safe** if several people can write in it at once and nothing gets garbled — for example, because there's a rule that only the person holding the pen may write. It's **not** thread-safe if two people can write on the same line simultaneously.

### How it works
Ways to achieve thread safety, from best to last resort:
1. **Don't share:** each thread has its own data (thread-local, message passing).
2. **Share only immutable data:** read-only data never needs locks (`const` everything).
3. **Atomics** for single variables.
4. **Locks** for everything else — encapsulated *inside* the class so callers can't forget.

Levels you'll hear about:
- **Thread-safe:** any method can be called concurrently (e.g. a concurrent queue).
- **Conditionally safe:** safe if threads use *different* objects (most standard containers: two threads may read the same `std::vector` concurrently, but a writer needs exclusive access).
- **Not thread-safe:** needs external synchronization.

Also: **reentrant** functions can be interrupted and called again safely (no static/global state), which usually implies thread-safe.

### Modern C++ example — making a class thread-safe
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <string>
#include <thread>
#include <vector>

class ThreadSafeCounter {                 // callers never see the mutex
public:
    void increment(const std::string& key) {
        std::scoped_lock lock(m_);
        ++counts_[key];
    }
    std::optional<int> get(const std::string& key) const {
        std::scoped_lock lock(m_);
        auto it = counts_.find(key);
        return it == counts_.end() ? std::nullopt : std::optional(it->second);
    }
private:
    mutable std::mutex m_;
    std::map<std::string, int> counts_;
};

int main() {
    ThreadSafeCounter page_views;
    {
        std::vector<std::jthread> ts;
        for (int t = 0; t < 4; ++t)
            ts.emplace_back([&] { for (int i = 0; i < 1000; ++i) page_views.increment("/home"); });
    }
    std::cout << "/home views: " << page_views.get("/home").value_or(0) << '\n';
}
```

**Output:**
```text
/home views: 4000
```

### Common mistakes
- Returning a reference to internal data from a locked method (`const std::map& all()`) — the caller then reads it *after* the lock is released.
- "Check-then-act" across two calls: `if (!q.empty()) q.pop();` is broken even if `empty` and `pop` are each thread-safe; the combination isn't. Provide a single `try_pop()`.

### Interview answer
"A component is thread-safe if concurrent use preserves its invariants without extra caller-side synchronization. I prefer no sharing or immutable sharing, then atomics, then encapsulated locking, and I avoid exposing internal references or check-then-act APIs."

---

## 4. Deadlocks

**In one sentence:** a deadlock is when threads wait for each other forever — each holds something the other needs.

### In plain words
Two cars meet on a one-lane bridge from opposite ends. Each waits for the other to back up. Nobody moves — forever.

### How it works
All four must hold (Coffman conditions): **mutual exclusion**, **hold and wait**, **no preemption**, **circular wait**. Break one and deadlock is impossible. In practice:
- Lock multiple mutexes **together** with `std::scoped_lock(a, b)`.
- Or always lock in the **same global order**.
- Don't call unknown code (callbacks) while holding a lock.
- Use timeouts (`try_lock_for`) where appropriate.

Full details, detection and the Banker's algorithm: [Deadlocks](../Operating%20Systems/Deadlocks.md).

### Modern C++ example — the classic bug and its fix
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <mutex>
#include <thread>

std::mutex accounts_mutex, audit_mutex;
int balance = 100, audit_entries = 0;

// BUG (don't do this): thread 1 locks accounts->audit, thread 2 locks audit->accounts.
// If each grabs its first lock at the same time, both wait forever.

void deposit() {
    std::scoped_lock lock(accounts_mutex, audit_mutex);   // FIX: acquire both atomically
    balance += 10;
    ++audit_entries;
}
void audit() {
    std::scoped_lock lock(audit_mutex, accounts_mutex);   // order doesn't matter anymore
    ++audit_entries;
}

int main() {
    {
        std::jthread t1([] { for (int i = 0; i < 10'000; ++i) deposit(); });
        std::jthread t2([] { for (int i = 0; i < 10'000; ++i) audit(); });
    }
    std::cout << "balance=" << balance << " audit_entries=" << audit_entries << '\n';
}
```

**Output:**
```text
balance=100100 audit_entries=20000
```

### Interview answer
"Deadlock needs mutual exclusion, hold-and-wait, no preemption and circular wait. I prevent it with a consistent lock order or by acquiring locks together with `std::scoped_lock`, keeping critical sections small and never calling external code under a lock."

---

## 5. Race conditions

**In one sentence:** a race condition is a bug where the result depends on the unpredictable **timing** of threads; a **data race** is the specific case of two threads accessing the same memory at the same time, at least one writing, with no synchronization — which is undefined behavior in C++.

### In plain words
Two people edit the same Google-Doc-like shared text file *offline*, then both upload. Whoever uploads **last** wins and the other's changes disappear. The outcome depends on who was faster — that's a race.

### How it works
- **Data race** (memory level): unsynchronized concurrent access with a write. In C++ this is **undefined behavior** — anything can happen.
- **Race condition** (logic level): even with every single access protected, the *order* of operations can still be wrong. Classic example: **check-then-act**.
  ```c++
  if (!map.contains(key))   // thread A checks... thread B checks too...
      map[key] = create();  // ...both create! (even if each call locks)
  ```
- Also **read-modify-write** (`x++` = read, add, write) and **lazy initialization**.

Fixes: make the *whole* check-and-act one atomic step (one lock around both, `compare_exchange`, `std::call_once`, or a single `try_emplace`).

Detect them with **ThreadSanitizer**: compile with `-fsanitize=thread -g`.

### Modern C++ example — a check-then-act race and its fix
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

// Seats in a cinema: we must never sell more than 'capacity' tickets.
class Cinema {
public:
    explicit Cinema(int capacity) : seats_left_(capacity) {}

    // Correct: the check and the update happen as ONE atomic step.
    bool buy_ticket() {
        int left = seats_left_.load();
        while (left > 0) {
            if (seats_left_.compare_exchange_weak(left, left - 1)) return true;
            // CAS failed: someone else changed it; 'left' now holds the fresh value, retry
        }
        return false;
    }
    int seats_left() const { return seats_left_; }
private:
    std::atomic<int> seats_left_;
};

int main() {
    Cinema cinema(100);
    std::atomic<int> sold = 0;
    {
        std::vector<std::jthread> buyers;
        for (int t = 0; t < 8; ++t)                      // 8 threads x 50 attempts = 400 buyers
            buyers.emplace_back([&] { for (int i = 0; i < 50; ++i) if (cinema.buy_ticket()) ++sold; });
    }
    std::cout << "tickets sold: " << sold << ", seats left: " << cinema.seats_left() << '\n';
}
```

**Output:**
```text
tickets sold: 100, seats left: 0
```
The buggy version, `if (seats_left_ > 0) --seats_left_;`, can oversell: two threads both see 1 seat left, and both decrement.

### Interview answer
"A data race is unsynchronized concurrent access with at least one write — undefined behavior in C++. A race condition is broader: correctness depends on interleaving, like check-then-act or read-modify-write, even when individual operations are synchronized. The fix is to make the compound operation atomic with one lock, CAS, or `call_once`, and to test with ThreadSanitizer."

---

## 6. Parallelism vs. Concurrency

**In one sentence:** **concurrency** is *dealing with* many tasks at once (structuring a program so tasks can make progress independently); **parallelism** is *doing* many tasks at the exact same instant on multiple CPU cores.

### In plain words
- **Concurrency:** one chef cooking three dishes — stir the soup, chop veggies while the water boils, check the oven. Only one thing at any instant, but all three dishes progress.
- **Parallelism:** three chefs each cooking one dish at the same time.

You can have concurrency without parallelism (a single-core CPU switching between tasks, or a JavaScript event loop) and parallelism without much concurrency (the same math on each element of a big array, split across cores — "data parallelism").

> "Concurrency is about *dealing with* lots of things at once. Parallelism is about *doing* lots of things at once." — Rob Pike

### How it works
| | Concurrency | Parallelism |
|---|---|---|
| Goal | Responsiveness, structure, overlapping waits (I/O) | Speed (throughput) on CPU-heavy work |
| Needs multiple cores? | No | Yes |
| Typical tools | Threads, async/await, coroutines, event loops | Thread pools, `std::execution::par`, SIMD, GPUs |
| Limit | Complexity | **Amdahl's law**: the serial part limits speed-up |

**Amdahl's law:** if 10% of the program must run serially, even infinite cores give at most 10× speed-up.

### Modern C++ example — parallel algorithm vs. concurrent tasks
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <future>
#include <iostream>
#include <numeric>
#include <thread>
#include <vector>

using namespace std::chrono_literals;

int main() {
    // PARALLELISM: split a CPU-heavy job across cores.
    std::vector<long long> data(4'000'000);
    std::iota(data.begin(), data.end(), 1);
    auto half = data.begin() + data.size() / 2;
    auto left = std::async(std::launch::async, [&] { return std::accumulate(data.begin(), half, 0LL); });
    long long right = std::accumulate(half, data.end(), 0LL);   // this thread does the other half
    std::cout << "parallel sum = " << left.get() + right << '\n';

    // CONCURRENCY: overlap two "waiting" tasks (like two network calls).
    auto start = std::chrono::steady_clock::now();
    auto a = std::async(std::launch::async, [] { std::this_thread::sleep_for(100ms); return 1; });
    auto b = std::async(std::launch::async, [] { std::this_thread::sleep_for(100ms); return 2; });
    int total = a.get() + b.get();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
                  std::chrono::steady_clock::now() - start).count();
    std::cout << "two 100ms waits finished together in ~" << (ms < 190 ? "100" : "200")
              << "ms (result " << total << ")\n";
}
```

**Output:**
```text
parallel sum = 8000002000000
two 100ms waits finished together in ~100ms (result 3)
```

### Interview answer
"Concurrency is about composing independently progressing tasks — possible on one core via interleaving — while parallelism is simultaneous execution on multiple cores to increase throughput. Concurrency helps I/O-bound work and responsiveness; parallelism helps CPU-bound work, bounded by Amdahl's law."

---

## 7. Asynchronous programming

**In one sentence:** asynchronous programming lets you **start** a slow operation (network, disk, timer) and **continue doing other work**, getting the result later via a callback, future, or `co_await`, instead of blocking and waiting.

### In plain words
Ordering coffee: **synchronous** = you stand at the counter staring at the barista until your coffee is ready. **Asynchronous** = you get a buzzer (a *future*), sit down, answer emails, and pick up the coffee when it buzzes.

### How it works
Styles, oldest to newest:
1. **Callbacks** — "call this function when done".
2. **Futures/Promises** — a placeholder object for a value that will exist later.
3. **async/await (coroutines)** — write code that *looks* sequential, but pauses at each `await` without blocking the thread.

Full guide with all four styles: [Asynchronous Programming](./Asynchronous-Programming.md).

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <future>
#include <iostream>
#include <string>
#include <thread>

using namespace std::chrono_literals;

std::string download(const std::string& url) {
    std::this_thread::sleep_for(50ms);                    // pretend: slow network
    return "<html>" + url + "</html>";
}

int main() {
    std::future<std::string> page = std::async(std::launch::async, download, "example.com");
    std::cout << "download started; doing other work...\n";     // not blocked!
    std::cout << "got: " << page.get() << '\n';                 // wait only when we need it
}
```

**Output:**
```text
download started; doing other work...
got: <html>example.com</html>
```

### Interview answer
"Asynchronous programming decouples starting an operation from consuming its result, so a thread isn't blocked on I/O. It evolved from callbacks to futures/promises to async/await coroutines, which keep sequential-looking code while suspending instead of blocking."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Process vs thread | Private memory vs shared memory |
| Mutex / semaphore / condvar / atomic | 1 at a time / N at a time / wait for a condition / indivisible op |
| Thread-safe | Correct under concurrent calls without caller locking |
| Deadlock | Circular waiting; fix with lock ordering / `scoped_lock` |
| Data race | Unsynchronized concurrent access + write = UB |
| Race condition | Timing-dependent bug (check-then-act) |
| Concurrency vs parallelism | Dealing with many things vs doing many things at once |
| Async | Start now, get result later without blocking |
