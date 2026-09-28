# Threads — Explained for Beginners

> **What you'll learn:** what a thread is, how threads differ from processes, what threads share and what they keep private, how to create and stop threads in modern C++, user vs. kernel threads, and thread pools.
>
> **Prerequisites:** [Processes](./Processes.md).
>
> **How to run the examples:** save as `main.cpp` and run the command in the first comment line. `-pthread` tells the compiler to link the threading library.

## Table of Contents
1. [What is a thread?](#1-what-is-a-thread)
2. [Threads vs. processes](#2-threads-vs-processes)
3. [What threads share and what they keep private](#3-what-threads-share-and-what-they-keep-private)
4. [Creating threads in modern C++ (`std::jthread`)](#4-creating-threads-in-modern-c-stdjthread)
5. [Stopping a thread politely (`std::stop_token`)](#5-stopping-a-thread-politely-stdstop_token)
6. [User threads vs. kernel threads](#6-user-threads-vs-kernel-threads)
7. [Thread pools](#7-thread-pools)
8. [Why use threads, and what can go wrong](#8-why-use-threads-and-what-can-go-wrong)
9. [Cheat sheet](#cheat-sheet)

---

## 1. What is a thread?

**In one sentence:** a thread is a single sequence of instructions running *inside* a process; one process can have many threads running at the same time.

### In plain words
A process is a restaurant kitchen. A **thread** is one cook in that kitchen. A kitchen with one cook can only do one thing at a time. With four cooks, one can chop, one can fry, one can wash dishes and one can plate — all at once, all using the *same* kitchen, fridge and ingredients.

Every process starts with one thread — the **main thread**, which runs your `main()` function. You can add more.

### How it works
1. Each thread has its own **program counter** (which instruction it is on) and its own **stack** (its local variables).
2. All threads of a process share the process's heap, global variables, code and open files.
3. The OS schedules *threads* (not processes) onto CPU cores. On a 4-core machine, four threads can truly run at the same instant.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <thread>

void cook(const char* task) {
    std::cout << "cook is doing: " << task << '\n';
}

int main() {
    std::cout << "main thread starts\n";
    {
        std::jthread worker(cook, "chopping onions");  // a second thread starts NOW
    }   // jthread automatically waits (joins) here when it goes out of scope
    std::cout << "main thread ends\n";
}
```

**Output:**
```text
main thread starts
cook is doing: chopping onions
main thread ends
```

### Common mistakes
- Using the old `std::thread` and forgetting to call `join()`. If a `std::thread` is destroyed while still joinable, the whole program crashes (`std::terminate`). **Prefer `std::jthread` (C++20)**, which joins automatically.

### Interview answer
"A thread is the smallest unit of execution the OS schedules. Threads within a process share the address space, heap and open files, but each has its own stack, registers and program counter."

---

## 2. Threads vs. processes

**In one sentence:** processes are isolated from each other (separate memory); threads live inside one process and share its memory.

### In plain words
- **Two processes** = two separate restaurants. Each has its own kitchen. If one burns down, the other is fine. Sharing ingredients requires a delivery truck (IPC).
- **Two threads** = two cooks in the same kitchen. Sharing is instant (grab from the same fridge) but if one cook starts a fire, the whole kitchen burns — a crash in one thread kills the whole process.

### How it works
| | Process | Thread |
|---|---|---|
| Memory | Own private address space | Shares the process's address space |
| Creation cost | Heavy (new page tables, PCB) | Light (just a stack + registers) |
| Communication | IPC: pipes, sockets, shared memory | Just read/write shared variables (with locks!) |
| Context switch | Slower (memory map changes) | Faster (same memory map) |
| Crash isolation | Crash stays inside that process | One thread crashing kills all threads |
| Example | Chrome: one process per tab | A game: render thread + audio thread + physics thread |

### Modern C++ example
Two threads see the *same* variable; two processes would each have their own copy.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <thread>

std::atomic<int> shared_counter = 0;   // one variable, visible to every thread

int main() {
    {
        std::jthread t1([] { shared_counter += 10; });
        std::jthread t2([] { shared_counter += 5; });
    }   // both threads joined here
    // Both threads modified the SAME variable:
    std::cout << "shared_counter = " << shared_counter << '\n';
}
```

**Output:**
```text
shared_counter = 15
```
(`std::atomic` makes the `+=` safe when two threads do it at once — see [Thread Synchronization](./Thread-Synchronization.md).)

### Common mistakes
- Choosing threads when you need isolation (e.g. running untrusted plugins). Use processes for safety, threads for speed of sharing.

### Interview answer
"Processes have separate address spaces, so they are isolated and robust but expensive to create and communicate between. Threads share one address space, so they are cheap and communicate through memory, but they need synchronization and a crash in one affects all."

---

## 3. What threads share and what they keep private

**In one sentence:** threads share the heap, globals, code and files, but each thread has its own stack, registers, and thread-local storage.

### In plain words
Cooks share the fridge (heap), the recipe book (code) and the posted menu (globals). But each cook has their own apron pocket with their personal notes (their stack) and their own hands (registers).

### How it works
```
 One process
 ┌──────────────────────────────────────────┐
 │  Code  │  Globals  │  Heap  │  Open files │   <- SHARED by all threads
 ├────────────┬────────────┬────────────────┤
 │ Thread 1   │ Thread 2   │ Thread 3       │
 │  stack     │  stack     │  stack         │   <- PRIVATE per thread
 │  registers │  registers │  registers     │
 │  PC        │  PC        │  PC            │
 └────────────┴────────────┴────────────────┘
```
C++ also offers `thread_local` variables: a global-looking variable where **each thread gets its own copy**.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <format>
#include <iostream>
#include <mutex>
#include <thread>

int global_value = 100;              // shared by all threads
thread_local int per_thread = 0;     // every thread has its own copy
std::mutex print_mutex;

void work(int id) {
    int local = id * 10;             // on this thread's own stack
    per_thread += id;                // only changes THIS thread's copy
    std::scoped_lock lock(print_mutex);
    std::cout << std::format("thread {}: local={} per_thread={} global={}\n",
                             id, local, per_thread, global_value);
}

int main() {
    // Run the threads one after another so the output order is predictable.
    { std::jthread t(work, 1); }
    { std::jthread t(work, 2); }
    std::cout << std::format("main: per_thread={} (main's own copy was never changed)\n",
                             per_thread);
}
```

**Output:**
```text
thread 1: local=10 per_thread=1 global=100
thread 2: local=20 per_thread=2 global=100
main: per_thread=0 (main's own copy was never changed)
```

### Common mistakes
- Passing a pointer/reference to a local variable into a thread, then letting the function return while the thread still uses it → dangling reference.

### Interview answer
"Threads share code, data, heap and file descriptors. Each thread has a private stack, register set, program counter and thread-local storage."

---

## 4. Creating threads in modern C++ (`std::jthread`)

**In one sentence:** construct a `std::jthread` with a function (or lambda) and its arguments, and it starts running immediately and joins automatically when destroyed.

### In plain words
Hiring a cook = creating a thread. **Joining** = waiting at the door until the cook says "I'm done" before you close the kitchen. `std::jthread` ("joining thread") does the waiting for you automatically.

### How it works
- `std::jthread t(function, arg1, arg2);` — starts now.
- Arguments are **copied** into the thread. To pass by reference, wrap with `std::ref(x)`.
- `t.join()` — wait for it to finish (done automatically at scope exit).
- `std::thread::hardware_concurrency()` — how many threads the hardware can run truly in parallel.
- To get a result back, use a `std::future` (see [Asynchronous Programming](../Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md)) or write into a pre-allocated slot.

### Modern C++ example
Sum a big vector using several threads, each summing one chunk.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <span>
#include <thread>
#include <vector>

int main() {
    std::vector<long long> data(1'000'000);
    std::iota(data.begin(), data.end(), 1);          // 1, 2, 3, ..., 1'000'000

    constexpr int kThreads = 4;
    std::vector<long long> partial(kThreads, 0);     // one result slot per thread
    const std::size_t chunk = data.size() / kThreads;

    {
        std::vector<std::jthread> workers;
        for (int i = 0; i < kThreads; ++i) {
            std::span<const long long> part(data.data() + i * chunk, chunk);
            // Each thread writes only to ITS OWN slot, so no lock is needed.
            workers.emplace_back([part, &slot = partial[i]] {
                slot = std::accumulate(part.begin(), part.end(), 0LL);
            });
        }
    }   // all 4 workers joined here

    long long total = std::accumulate(partial.begin(), partial.end(), 0LL);
    std::cout << "total = " << total << '\n';
}
```

**Output:**
```text
total = 500000500000
```

### Common mistakes
- Creating a thread per tiny task (e.g. per element). Creating threads costs microseconds; use a small number of threads or a pool.
- Forgetting `std::ref` and wondering why the thread modified a *copy*.

### Interview answer
"In C++20 I use `std::jthread`, which is RAII: it joins in its destructor and supports cooperative cancellation via `std::stop_token`. I split work so each thread owns separate data to avoid locking."

---

## 5. Stopping a thread politely (`std::stop_token`)

**In one sentence:** you can't safely kill a thread from outside; instead you *ask* it to stop and the thread checks the request and exits cleanly.

### In plain words
You don't yank a cook out of the kitchen mid-chop (knives everywhere!). You tell them "please finish up", and they put things away and leave. This is **cooperative cancellation**.

### How it works
1. `std::jthread` passes a `std::stop_token` as the first argument if your function accepts one.
2. The thread regularly checks `token.stop_requested()`.
3. Someone calls `t.request_stop()` (the `jthread` destructor does it automatically before joining).

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <thread>

using namespace std::chrono_literals;

int main() {
    std::jthread heartbeat([](std::stop_token token) {
        int beats = 0;
        while (!token.stop_requested()) {    // check: "have I been asked to stop?"
            ++beats;
            std::this_thread::sleep_for(10ms);
        }
        std::cout << "heartbeat stopping cleanly after some beats\n";
    });

    std::this_thread::sleep_for(100ms);
    std::cout << "main: asking the thread to stop\n";
    heartbeat.request_stop();                 // polite request
}   // destructor joins
```

**Output:**
```text
main: asking the thread to stop
heartbeat stopping cleanly after some beats
```

### Common mistakes
- Using OS functions like `pthread_cancel`/`TerminateThread`. They can kill a thread while it holds a lock or is half-way through writing data, leaving the program broken.

### Interview answer
"Threads should be cancelled cooperatively. In C++20, `std::jthread` carries a `std::stop_source`; the worker polls `stop_token.stop_requested()` or registers a `std::stop_callback`, and the destructor requests stop and joins."

---

## 6. User threads vs. kernel threads

**In one sentence:** kernel threads are managed and scheduled by the OS; user threads (green threads, fibers, coroutines) are managed by a library inside your program.

### In plain words
- **Kernel thread** = an employee on the company payroll; HR (the OS) knows about them and assigns them desks (CPU cores).
- **User thread** = a helper a manager hires privately; HR doesn't know they exist. The manager decides who works when. Cheap to hire, but if the manager gets stuck in a meeting (a blocking call), all their private helpers wait too.

### How it works
| Model | Meaning | Example |
|---|---|---|
| 1:1 | Each user thread = one kernel thread | `std::thread` on Linux/Windows |
| N:1 | Many user threads on one kernel thread | Old "green threads" |
| M:N | Many user threads on a few kernel threads | Go goroutines, Rust Tokio, C++ coroutine runtimes |

User threads are cheaper to create and switch (no OS call), which is why a Go server can have a million goroutines but not a million OS threads.

### Modern C++ example
`std::thread`/`std::jthread` are kernel threads (1:1). A C++20 coroutine is a user-level task: millions can exist cheaply.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <coroutine>
#include <iostream>
#include <vector>

struct Task {   // minimal coroutine type (see Processes -> Context switching)
    struct promise_type {
        Task get_return_object() { return {std::coroutine_handle<promise_type>::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() {}
    };
    std::coroutine_handle<promise_type> h;
};

Task tiny_job(int& counter) { ++counter; co_return; }

int main() {
    int counter = 0;
    std::vector<std::coroutine_handle<Task::promise_type>> jobs;
    for (int i = 0; i < 100'000; ++i) jobs.push_back(tiny_job(counter).h); // 100k "user threads"
    for (auto h : jobs) { h.resume(); h.destroy(); }   // all run on ONE kernel thread
    std::cout << "ran " << counter << " coroutines on a single OS thread\n";
}
```

**Output:**
```text
ran 100000 coroutines on a single OS thread
```

### Common mistakes
- Calling a blocking function (like a slow file read) inside a user-level task — it blocks the underlying kernel thread and every other task on it.

### Interview answer
"Kernel threads are scheduled by the OS and can run in parallel on multiple cores; blocking one doesn't block others. User threads are scheduled in user space and are much cheaper, but need an M:N runtime and non-blocking I/O to avoid one blocking call stalling everything."

---

## 7. Thread pools

**In one sentence:** a thread pool is a fixed group of worker threads that repeatedly take tasks from a shared queue, so you don't pay thread-creation cost for every task.

### In plain words
Instead of hiring and firing a cook for every single order, a restaurant keeps 4 cooks on staff. Orders go on a ticket rail (the **queue**); whenever a cook is free, they grab the next ticket.

### How it works
1. Create N worker threads at startup (N ≈ number of CPU cores for CPU-heavy work).
2. Each worker loops: wait for a task → take it off the queue → run it.
3. `submit(task)` pushes onto the queue and wakes one worker.
4. On shutdown, workers finish and exit.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <condition_variable>
#include <functional>
#include <future>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

class ThreadPool {
public:
    explicit ThreadPool(unsigned n) {
        for (unsigned i = 0; i < n; ++i)
            workers_.emplace_back([this](std::stop_token st) { run(st); });
    }
    ~ThreadPool() {
        for (auto& w : workers_) w.request_stop();
        cv_.notify_all();              // wake everyone so they can see the stop request
    }                                  // jthreads join automatically

    // Submit any callable; get a future for its result.
    template <class F>
    auto submit(F f) -> std::future<decltype(f())> {
        auto task = std::make_shared<std::packaged_task<decltype(f())()>>(std::move(f));
        auto result = task->get_future();
        {
            std::scoped_lock lock(m_);
            tasks_.push([task] { (*task)(); });
        }
        cv_.notify_one();
        return result;
    }

private:
    void run(std::stop_token st) {
        while (true) {
            std::function<void()> job;
            {
                std::unique_lock lock(m_);
                cv_.wait(lock, [&] { return st.stop_requested() || !tasks_.empty(); });
                if (tasks_.empty()) return;      // stop requested and nothing left
                job = std::move(tasks_.front());
                tasks_.pop();
            }
            job();                                // run OUTSIDE the lock
        }
    }

    std::mutex m_;
    std::condition_variable cv_;
    std::queue<std::function<void()>> tasks_;
    std::vector<std::jthread> workers_;           // declared last: destroyed first
};

int main() {
    ThreadPool pool(4);
    std::vector<std::future<int>> results;
    for (int i = 1; i <= 8; ++i)
        results.push_back(pool.submit([i] { return i * i; }));

    int sum = 0;
    for (auto& r : results) sum += r.get();       // .get() waits for that task
    std::cout << "sum of squares 1..8 = " << sum << '\n';
}
```

**Output:**
```text
sum of squares 1..8 = 204
```

### Common mistakes
- Running the task *while holding the queue lock* — then only one worker can make progress at a time.
- Too many threads for CPU-bound work (more threads than cores just adds context switches).

### Interview answer
"A thread pool pre-creates a fixed number of workers that pull tasks from a synchronized queue, amortizing thread creation cost and bounding concurrency. Size it near the core count for CPU-bound work, larger for I/O-bound work."

---

## 8. Why use threads, and what can go wrong

**In one sentence:** threads give you speed (parallelism) and responsiveness, but shared memory introduces race conditions, deadlocks and hard-to-reproduce bugs.

### In plain words
More cooks make dinner faster — until two cooks grab the same pan at the same time, or each waits forever for the other to hand over the knife.

### How it works
**Benefits**
- **Parallelism:** use all CPU cores for heavy computation.
- **Responsiveness:** a UI thread keeps the window responsive while a worker thread downloads a file.
- **Cheap sharing:** no need to copy data between processes.

**Dangers**
- **Race condition:** result depends on unlucky timing (two threads doing `count++` at the same time).
- **Deadlock:** threads wait for each other forever (see [Deadlocks](./Deadlocks.md)).
- **Starvation:** one thread never gets a turn.
- **Heisenbugs:** bugs that disappear when you add a `print` or run the debugger.

### Modern C++ example — a race condition, then the fix
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <thread>

int main() {
    int unsafe = 0;                  // plain int: "++" is read, add, write -> can interleave
    std::atomic<int> safe = 0;       // atomic: "++" is one indivisible step

    {
        std::jthread a([&] { for (int i = 0; i < 100'000; ++i) { ++unsafe; ++safe; } });
        std::jthread b([&] { for (int i = 0; i < 100'000; ++i) { ++unsafe; ++safe; } });
    }
    std::cout << "safe   = " << safe << '\n';          // always 200000
    std::cout << "unsafe = " << unsafe << " (often less than 200000!)\n";
}
```

**Output (may vary):**
```text
safe   = 200000
unsafe = 131872 (often less than 200000!)
```
(Technically the unsynchronized `unsafe` is *undefined behavior* in C++ — never do this in real code.)

### Common mistakes
- "It worked on my machine" — concurrency bugs appear randomly. Use tools such as ThreadSanitizer: compile with `-fsanitize=thread`.

### Interview answer
"Threads improve throughput and responsiveness, but shared mutable state leads to race conditions, deadlocks and starvation. I minimize sharing, use immutable data or message passing where possible, and protect the rest with mutexes or atomics, verified with ThreadSanitizer."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Thread | One sequence of execution inside a process |
| Main thread | The thread running `main()` |
| `std::jthread` | C++20 thread that auto-joins and supports stop requests |
| Join | Wait for a thread to finish |
| `thread_local` | Each thread gets its own copy of the variable |
| Kernel vs user thread | OS-scheduled vs library-scheduled |
| Thread pool | Fixed workers pulling tasks from a queue |
| Race condition | Result depends on timing of unsynchronized access |

**Next:** [Thread Synchronization](./Thread-Synchronization.md) — mutexes, semaphores and monitors.
