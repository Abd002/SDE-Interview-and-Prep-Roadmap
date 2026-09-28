# Thread Synchronization — Mutexes, Semaphores and Monitors

> **What you'll learn:** why threads need synchronization, what a critical section is, and the three classic tools — **mutexes**, **semaphores** and **monitors** — with modern C++ code for each.
>
> **Prerequisites:** [Threads](./Threads.md).
>
> **How to run the examples:** save as `main.cpp`, run the command in the first comment line.

## Table of Contents
0. [The problem: race conditions and critical sections](#0-the-problem-race-conditions-and-critical-sections)
1. [Mutexes](#1-mutexes)
2. [Semaphores](#2-semaphores)
3. [Monitors (mutex + condition variable)](#3-monitors-mutex--condition-variable)
4. [Bonus: atomics — synchronization without locks](#4-bonus-atomics--synchronization-without-locks)
5. [Cheat sheet: which one do I use?](#cheat-sheet-which-one-do-i-use)

---

## 0. The problem: race conditions and critical sections

**In one sentence:** when two threads read and write the same data at the same time, the result can be wrong, so the code touching that shared data (the **critical section**) must be run by one thread at a time.

### In plain words
Two people share a bank account with $100. Both check the balance at the same moment, both see $100, both withdraw $100. The bank paid out $200 from a $100 account! The fix: only one person may be "at the ATM" at a time.

### How it works
`balance = balance - 100` is really three CPU steps: **read** balance, **subtract**, **write** back. If two threads interleave those steps:
```
Thread A: read 100
Thread B: read 100
Thread A: write 0
Thread B: write 0      <- A's withdrawal is lost; $200 paid out
```
A **critical section** is the piece of code that touches shared data. **Mutual exclusion** means at most one thread is inside it at any time.

A correct solution must provide:
1. **Mutual exclusion** — one thread at a time inside.
2. **Progress** — if nobody is inside, someone who wants to enter eventually can.
3. **Bounded waiting** — no thread waits forever (no starvation).

---

## 1. Mutexes

**In one sentence:** a mutex ("**mut**ual **ex**clusion") is a lock that only one thread can hold at a time; others wait until it's released.

### In plain words
A mutex is the key to a single-person bathroom. If you have the key, you go in. If someone else has it, you wait outside. When they come out, they hand the key to the next person. Only the person who took the key may give it back.

### How it works
1. Thread calls `lock()`. If the mutex is free, it becomes the **owner** and continues.
2. If another thread owns it, the caller **blocks** (sleeps, using no CPU) until it's free.
3. The owner calls `unlock()` when leaving the critical section.

In modern C++ you almost never call `lock()`/`unlock()` yourself. You use **RAII lock guards** — objects that lock in their constructor and unlock in their destructor, so the mutex is released even if an exception is thrown or you `return` early:
- `std::scoped_lock` — the simple default; can lock several mutexes at once without deadlock.
- `std::unique_lock` — movable, can unlock early; needed with condition variables.
- `std::shared_mutex` + `std::shared_lock` — a **reader–writer lock**: many readers at once, *or* one writer.

### Modern C++ example — the bank account, fixed
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>

class BankAccount {
public:
    explicit BankAccount(int balance) : balance_(balance) {}

    bool withdraw(int amount) {
        std::scoped_lock lock(m_);          // take the key (unlocks automatically at '}')
        if (balance_ < amount) return false; // check...
        balance_ -= amount;                 // ...and act, with no one interrupting
        return true;
    }
    int balance() const {
        std::scoped_lock lock(m_);
        return balance_;
    }

private:
    mutable std::mutex m_;   // 'mutable' so const functions can lock it too
    int balance_;
};

int main() {
    BankAccount account(100);
    std::vector<int> success(10, 0);
    {
        std::vector<std::jthread> people;
        for (int i = 0; i < 10; ++i)        // 10 people each try to withdraw $100
            people.emplace_back([&, i] { success[i] = account.withdraw(100); });
    }
    int ok = 0;
    for (int s : success) ok += s;
    std::cout << "successful withdrawals: " << ok << '\n';   // exactly 1
    std::cout << "final balance: " << account.balance() << '\n';
}
```

**Output:**
```text
successful withdrawals: 1
final balance: 0
```

### Modern C++ example — reader–writer lock
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <map>
#include <mutex>
#include <shared_mutex>
#include <string>
#include <thread>
#include <vector>

class PhoneBook {
public:
    std::string find(const std::string& name) const {
        std::shared_lock lock(m_);         // many readers may hold this at once
        auto it = book_.find(name);
        return it == book_.end() ? "?" : it->second;
    }
    void add(const std::string& name, const std::string& number) {
        std::unique_lock lock(m_);         // a writer needs exclusive access
        book_[name] = number;
    }
private:
    mutable std::shared_mutex m_;
    std::map<std::string, std::string> book_;
};

int main() {
    PhoneBook pb;
    pb.add("alice", "555-1234");
    {
        std::vector<std::jthread> readers;
        for (int i = 0; i < 4; ++i)
            readers.emplace_back([&] { (void)pb.find("alice"); });   // run in parallel
        std::jthread writer([&] { pb.add("bob", "555-9876"); });
    }
    std::cout << "alice: " << pb.find("alice") << ", bob: " << pb.find("bob") << '\n';
}
```

**Output:**
```text
alice: 555-1234, bob: 555-9876
```

### Common mistakes
- Forgetting to unlock on an early `return` or exception → use RAII guards, never raw `lock()`/`unlock()`.
- Holding a lock while doing slow work (network calls, disk I/O). Keep critical sections tiny.
- Locking two mutexes in different orders in different threads → **deadlock**. `std::scoped_lock lock(m1, m2);` avoids this.
- Locking the same `std::mutex` twice from one thread → deadlock (use `std::recursive_mutex` only if truly necessary; usually it's a design smell).

### Interview answer
"A mutex provides mutual exclusion with ownership: only the thread that locked it can unlock it. In C++ I use RAII wrappers — `scoped_lock` by default, `unique_lock` with condition variables, and `shared_mutex` for read-heavy data — and keep critical sections short."

---

## 2. Semaphores

**In one sentence:** a semaphore is a counter of available "permits"; a thread takes a permit to proceed (waiting if there are none) and gives one back when finished.

### In plain words
A parking lot with 3 spaces and a sign showing how many are free.
- A car arrives: if the sign shows > 0, it parks and the sign goes down by 1. If it shows 0, the car waits at the gate.
- A car leaves: the sign goes up by 1, and one waiting car can enter.

A mutex is like a lot with **one** space *and* a rule that only the car that parked can "free" it. A semaphore has **N** spaces, and *anyone* may signal a space as free.

### How it works
Two operations (historically named by Dijkstra **P** and **V**):
- `acquire()` (a.k.a. *wait*, *P*, *down*): if count > 0, decrement and continue; else block.
- `release()` (a.k.a. *signal*, *V*, *up*): increment; wake a waiter if any.

Types:
- **Counting semaphore:** count can be 0…N — limits concurrency to N (e.g. "at most 3 simultaneous downloads").
- **Binary semaphore:** count is 0 or 1 — used for *signalling* ("the data is ready").

C++20 provides `std::counting_semaphore<N>` and `std::binary_semaphore`.

### Modern C++ example — at most 3 downloads at once
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <algorithm>
#include <atomic>
#include <chrono>
#include <iostream>
#include <semaphore>
#include <thread>
#include <vector>

using namespace std::chrono_literals;

std::counting_semaphore<3> slots(3);      // 3 parking spaces
std::atomic<int> active = 0, max_seen = 0;

void download(int /*id*/) {
    slots.acquire();                      // wait for a free slot
    int now = ++active;
    int prev = max_seen.load();
    while (prev < now && !max_seen.compare_exchange_weak(prev, now)) {}
    std::this_thread::sleep_for(20ms);    // pretend to download
    --active;
    slots.release();                      // free the slot
}

int main() {
    {
        std::vector<std::jthread> ts;
        for (int i = 0; i < 10; ++i) ts.emplace_back(download, i);
    }
    std::cout << "10 downloads done; never more than " << max_seen << " at once\n";
}
```

**Output:**
```text
10 downloads done; never more than 3 at once
```

### Modern C++ example — binary semaphore as a "go" signal
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <semaphore>
#include <string>
#include <thread>

std::binary_semaphore data_ready(0);     // starts at 0: "not ready yet"
std::string shared_data;

int main() {
    std::jthread consumer([] {
        data_ready.acquire();            // sleeps until someone releases
        std::cout << "consumer got: " << shared_data << '\n';
    });
    shared_data = "the answer is 42";    // prepare the data first...
    data_ready.release();                // ...then signal "go"
}
```

**Output:**
```text
consumer got: the answer is 42
```

### Common mistakes
- Using a semaphore as a mutex and releasing it from the wrong thread by accident — semaphores have no owner, so the compiler/runtime won't catch it.
- Forgetting a `release()` on an error path → permits "leak" until everything blocks. Wrap acquire/release in a small RAII class.

### Interview answer
"A semaphore is an integer counter with atomic wait/decrement and signal/increment operations. Counting semaphores limit access to N resources; binary semaphores are used for signalling. Unlike a mutex, a semaphore has no ownership, so any thread can release it."

---

## 3. Monitors (mutex + condition variable)

**In one sentence:** a monitor is an object whose methods automatically run under one lock and which lets threads *wait inside* until some condition becomes true.

### In plain words
A doctor's waiting room with a receptionist:
- Only one patient talks to the receptionist at a time (the **lock**).
- If the doctor isn't ready, the receptionist says "please sit down, I'll call you" — you **wait** without blocking the desk for others.
- When the doctor is free, the receptionist **notifies** a waiting patient, who comes back to the desk.

### How it works
A monitor combines:
1. **A mutex** that every public method locks, so the object's data is only touched by one thread at a time.
2. **Condition variables** — waiting rooms. A thread calls `wait(lock, predicate)`:
   - it atomically *releases* the lock and sleeps,
   - when notified, it *re-acquires* the lock and re-checks the predicate,
   - it only continues when the predicate is true.
3. Other methods call `notify_one()` / `notify_all()` after changing the state.

Why re-check? Because of **spurious wakeups** (a thread can wake up for no reason) and because another thread might have grabbed the item first. Passing a predicate to `wait` handles this automatically.

Languages like Java build monitors in (`synchronized` + `wait`/`notify`). In C++ you build one from `std::mutex` + `std::condition_variable`.

### Modern C++ example — a bounded producer/consumer queue
The classic interview problem: producers put items in a fixed-size buffer, consumers take them out. Producers must wait if it's full; consumers must wait if it's empty.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <condition_variable>
#include <cstddef>
#include <iostream>
#include <mutex>
#include <optional>
#include <queue>
#include <thread>

template <class T>
class BoundedQueue {                          // <- this class IS a monitor
public:
    explicit BoundedQueue(std::size_t capacity) : capacity_(capacity) {}

    void push(T value) {
        std::unique_lock lock(m_);
        not_full_.wait(lock, [&] { return q_.size() < capacity_; });   // wait for space
        q_.push(std::move(value));
        not_empty_.notify_one();                                        // wake a consumer
    }

    std::optional<T> pop() {                  // returns nullopt when closed and empty
        std::unique_lock lock(m_);
        not_empty_.wait(lock, [&] { return !q_.empty() || closed_; });  // wait for data
        if (q_.empty()) return std::nullopt;
        T value = std::move(q_.front());
        q_.pop();
        not_full_.notify_one();                                         // wake a producer
        return value;
    }

    void close() {
        { std::scoped_lock lock(m_); closed_ = true; }
        not_empty_.notify_all();
    }

private:
    std::mutex m_;
    std::condition_variable not_full_, not_empty_;
    std::queue<T> q_;
    std::size_t capacity_;
    bool closed_ = false;
};

int main() {
    BoundedQueue<int> q(2);                    // tiny buffer: producer must often wait
    long long sum = 0;
    {
        std::jthread consumer([&] {
            while (auto item = q.pop()) sum += *item;
        });
        std::jthread producer([&] {
            for (int i = 1; i <= 100; ++i) q.push(i);
            q.close();
        });
    }
    std::cout << "consumer summed " << sum << '\n';
}
```

**Output:**
```text
consumer summed 5050
```

### Common mistakes
- Calling `wait` without a predicate and not looping → bugs from spurious wakeups.
- Changing the shared state *without* holding the mutex, then calling notify → the waiter can miss the wake-up ("lost wakeup").
- Using `notify_one` when several different kinds of waiters share one condition variable → the wrong one wakes. Use separate condition variables (as above) or `notify_all`.

### Interview answer
"A monitor encapsulates shared state with a mutex so methods are mutually exclusive, plus condition variables so threads can wait for a condition. `wait` atomically releases the lock and sleeps, then re-acquires it; you always wait in a loop or with a predicate because of spurious wakeups."

---

## 4. Bonus: atomics — synchronization without locks

**In one sentence:** an atomic variable's operations (like `++`) happen as one indivisible step, so simple counters and flags need no mutex.

### In plain words
Instead of locking the whole bathroom, a turnstile clicks the counter forward exactly once per person, even if people push through at the same time.

### How it works
- `std::atomic<int> x; ++x;` compiles to a special CPU instruction that can't be interrupted halfway.
- `compare_exchange` ("CAS"): "if the value is still what I think it is, replace it; otherwise tell me the new value." It's the building block of **lock-free** data structures.
- Atomics are great for single variables; for invariants across several variables, use a mutex.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <thread>
#include <vector>

int main() {
    std::atomic<long> hits = 0;
    {
        std::vector<std::jthread> ts;
        for (int t = 0; t < 8; ++t)
            ts.emplace_back([&] { for (int i = 0; i < 10'000; ++i) hits.fetch_add(1); });
    }
    std::cout << "hits = " << hits << '\n';
}
```

**Output:**
```text
hits = 80000
```

### Common mistakes
- `if (x == 0) x = 1;` on an atomic is **two** operations — another thread can sneak in between. Use `compare_exchange_strong`.

### Interview answer
"Atomics provide indivisible read-modify-write operations using hardware instructions like CAS. They're ideal for counters and flags and are the foundation for lock-free algorithms, but multi-variable invariants still need a mutex."

---

## Cheat sheet: which one do I use?

| Need | Tool | C++ |
|---|---|---|
| Protect shared data, one thread at a time | Mutex | `std::mutex` + `std::scoped_lock` |
| Many readers, rare writers | Reader–writer lock | `std::shared_mutex` + `std::shared_lock` |
| Limit to N concurrent users of a resource | Counting semaphore | `std::counting_semaphore<N>` |
| "Go" signal from one thread to another | Binary semaphore / latch | `std::binary_semaphore`, `std::latch` |
| Wait until some condition on shared state is true | Monitor | `std::mutex` + `std::condition_variable` |
| Simple counter or flag | Atomic | `std::atomic<T>` |

**Next:** [Deadlocks](./Deadlocks.md) — what happens when locks are used badly.
