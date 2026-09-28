# Asynchronous Programming — Callbacks, Promises, Futures and Coroutines

> **What you'll learn:** why asynchronous programming exists, and the four ways to do it — **callbacks, promises, futures and coroutines** — each built step by step in modern C++ (including C++20 `co_await`).
>
> **Prerequisites:** [Functional Programming → Lambdas](./Functional-Programming.md#1-lambda-expressions), basic idea of threads ([Concurrency](./Concurrency.md)).

## Table of Contents
0. [Why asynchronous?](#0-why-asynchronous)
1. [Callbacks](#1-callbacks)
2. [Promises](#2-promises)
3. [Futures](#3-futures)
4. [Coroutines](#4-coroutines)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Why asynchronous?

**In one sentence:** many operations (network, disk, timers, user input) spend most of their time *waiting*, and asynchronous programming lets your program do useful work during that wait instead of freezing.

### In plain words
- **Synchronous (blocking):** you put a pizza in the oven and stare at it for 15 minutes. Nothing else gets done.
- **Asynchronous (non-blocking):** you set a timer, go wash the dishes, and come back when it rings.

A web server handling 10,000 users can't have 10,000 threads each staring at a slow database. With async code, a few threads juggle all the waiting requests.

### How it works
Every async style answers the same question: **"when the result is ready, how does my code continue?"**
| Style | How you continue | Reads like |
|---|---|---|
| Callback | Pass a function to call later | Nested functions ("callback hell") |
| Promise | The producer side: "I promise to deliver a value later" | — |
| Future | The consumer side: a placeholder you can wait on / attach to | `result = future.get()` |
| Coroutine (`async`/`await`) | The function *pauses* at `co_await` and resumes later | Normal sequential code |

Note: **async ≠ multithreaded.** JavaScript is single-threaded and fully async. Async is about *not waiting*; threads are one way to implement it.

---

## 1. Callbacks

**In one sentence:** a callback is a function you hand to an operation so it can **call you back** when it finishes (or fails).

### In plain words
Leaving your phone number at a busy restaurant: "Call me when a table is free." You go shopping; they call you. The phone number is the callback.

### How it works
1. `start_operation(args, on_done)` returns **immediately**.
2. Later (when the data arrives), the system calls `on_done(result)`.
3. To do several async steps in order, you start step 2 *inside* step 1's callback, step 3 inside step 2's… → deeply nested code, called **callback hell** or the **pyramid of doom**, with error handling repeated at every level.

Used in: C APIs, GUI event handlers, Node.js (classic), Boost.Asio completion handlers.

### Modern C++ example — a tiny event loop with callbacks (and callback hell)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <queue>
#include <string>

// A single-threaded event loop: async operations just schedule their callback.
std::queue<std::function<void()>> event_queue;

void async_fetch(const std::string& what,
                 std::function<void(std::string)> on_success,
                 std::function<void(std::string)> on_error) {
    std::cout << "  (started fetching " << what << ", returning immediately)\n";
    event_queue.push([=] {                        // "later", when the loop runs
        if (what == "bad-url") on_error("404 for " + what);
        else on_success("<" + what + ">");
    });
}

int main() {
    auto on_error = [](std::string e) { std::cout << "error: " << e << '\n'; };

    // Three dependent steps -> three levels of nesting ("callback hell")
    async_fetch("user", [&](std::string user) {
        std::cout << "got " << user << '\n';
        async_fetch("orders", [&](std::string orders) {
            std::cout << "got " << orders << '\n';
            async_fetch("bad-url", [&](std::string x) {
                std::cout << "got " << x << '\n';
            }, on_error);
        }, on_error);
    }, on_error);

    std::cout << "main continues while fetches are pending...\n";
    while (!event_queue.empty()) {                // the event loop
        auto task = std::move(event_queue.front());
        event_queue.pop();
        task();
    }
}
```

**Output:**
```text
  (started fetching user, returning immediately)
main continues while fetches are pending...
got <user>
  (started fetching orders, returning immediately)
got <orders>
  (started fetching bad-url, returning immediately)
error: 404 for bad-url
```

### Common mistakes
- Capturing local variables **by reference** in a callback that runs after the function returned → dangling references. (Above it's safe only because `main` outlives the loop.)
- Forgetting to call the callback on some error path → the caller waits forever.
- Calling a callback twice.

### Interview answer
"A callback is a function passed to an asynchronous operation to be invoked on completion. It's simple and has no extra machinery, but sequencing and error handling across multiple steps lead to deeply nested 'callback hell' and ownership/lifetime pitfalls, which futures and coroutines address."

---

## 2. Promises

**In one sentence:** a promise is the **producer's** end of a one-time channel: whoever does the work uses it to deliver a value (or an error) to whoever is waiting on the matching future.

### In plain words
Ordering a custom cake. The bakery gives you a **receipt** (the *future*) and keeps the **order slip** (the *promise*). When the cake is ready, the baker marks the slip "done" (sets the value), and your receipt now lets you collect the cake. If the oven breaks, the baker marks the slip "failed" (sets an exception), and you'll be told when you come to collect.

### How it works
- In C++: `std::promise<T>` and `std::future<T>` are a pair created together:
  ```c++
  std::promise<int> p;
  std::future<int> f = p.get_future();   // give 'f' to the consumer
  p.set_value(42);                        // producer fulfills (once!)
  f.get();                                // consumer receives 42
  ```
- `set_exception(std::current_exception())` delivers an error instead; `f.get()` then **rethrows** it.
- If the promise is destroyed without being fulfilled, `get()` throws `std::future_error` (**broken promise**).
- **Naming across languages:** JavaScript's `Promise` combines both roles (it's what C++ calls a future, with `.then()`); the JS producer side is the `resolve`/`reject` pair. Java has `CompletableFuture`.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <future>
#include <iostream>
#include <stdexcept>
#include <thread>

void bake_cake(std::promise<std::string> order, bool oven_works) {
    try {
        if (!oven_works) throw std::runtime_error("oven broke");
        order.set_value("chocolate cake");                        // fulfill
    } catch (...) {
        order.set_exception(std::current_exception());            // deliver the error
    }
}

int main() {
    for (bool oven_ok : {true, false}) {
        std::promise<std::string> order;                          // producer end
        std::future<std::string> receipt = order.get_future();    // consumer end
        std::jthread baker(bake_cake, std::move(order), oven_ok);

        try {
            std::string cake = receipt.get();                     // waits; rethrows errors
            std::cout << "collected: " << cake << '\n';
        } catch (const std::exception& e) {
            std::cout << "order failed: " << e.what() << '\n';
        }
    }

    // A promise that is never fulfilled:
    std::future<int> orphan;
    { std::promise<int> p; orphan = p.get_future(); }             // p destroyed unfulfilled
    try { orphan.get(); } catch (const std::future_error&) {
        std::cout << "broken promise detected\n";
    }
}
```

**Output:**
```text
collected: chocolate cake
order failed: oven broke
broken promise detected
```

### Interview answer
"A promise is the write end of a single-assignment asynchronous result; its paired future is the read end. The producer sets a value or exception exactly once; the consumer waits on the future and gets the value or the rethrown exception. Destroying an unfulfilled promise breaks it."

---

## 3. Futures

**In one sentence:** a future is a **placeholder for a result that will exist later**; you can keep working and then wait for it, check if it's ready, or wait with a timeout.

### In plain words
The buzzer a café gives you. You can sit down (do other work), glance at it (`wait_for` — "is it ready yet?"), or go stand at the counter (`get` — wait until it's ready). Several friends can watch the same order if it's a *shared* buzzer (`shared_future`).

### How it works
C++ standard futures:
| Tool | What it does |
|---|---|
| `std::async(std::launch::async, f, args...)` | Run `f` on another thread, return a `std::future` of its result |
| `future.get()` | Wait and take the value (only once; rethrows exceptions) |
| `future.wait_for(100ms)` | Wait up to a timeout; returns `ready` / `timeout` |
| `std::shared_future` | Copyable; many consumers can `get()` the same value |
| `std::packaged_task` | Wrap a function so running it fulfills a future (used in thread pools) |

Limitation of `std::future`: no `.then()` for chaining continuations (other libraries — Folly, Boost, `stlab`, `std::execution` in C++26 — add that). In C++, **coroutines** are the modern answer for chaining.

Also: the future returned by `std::async` **blocks in its destructor** until the task finishes — don't ignore it.

### Modern C++ example — parallel requests, timeouts, shared results
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <chrono>
#include <future>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

using namespace std::chrono_literals;

std::string fetch(const std::string& url, std::chrono::milliseconds delay) {
    std::this_thread::sleep_for(delay);
    return "data from " + url;
}

int main() {
    // Start two requests at once; both run while main keeps going.
    auto a = std::async(std::launch::async, fetch, "api/users", 50ms);
    auto b = std::async(std::launch::async, fetch, "api/orders", 50ms);
    std::cout << a.get() << '\n' << b.get() << '\n';      // ~50ms total, not 100ms

    // Timeout: don't wait forever for a slow service.
    auto slow = std::async(std::launch::async, fetch, "api/slow", 300ms);
    if (slow.wait_for(20ms) == std::future_status::timeout)
        std::cout << "slow service: still waiting after 20ms, showing a spinner\n";
    std::cout << slow.get() << '\n';

    // One result, many consumers.
    std::shared_future<std::string> config =
        std::async(std::launch::async, fetch, "config", 10ms).share();
    std::vector<std::future<std::size_t>> readers;
    for (int i = 0; i < 3; ++i)
        readers.push_back(std::async(std::launch::async, [config] { return config.get().size(); }));
    for (auto& r : readers) std::cout << "reader saw " << r.get() << " chars\n";
}
```

**Output:**
```text
data from api/users
data from api/orders
slow service: still waiting after 20ms, showing a spinner
data from api/slow
reader saw 16 chars
reader saw 16 chars
reader saw 16 chars
```

### Common mistakes
- Calling `get()` twice on a `std::future` (it's single-use; use `shared_future`).
- `std::async(f)` without `std::launch::async` may run lazily on the *same* thread when you call `get()`.
- Discarding the returned future: `std::async(std::launch::async, f);` blocks right there until `f` ends.

### Interview answer
"A future is a handle to a value that will be available later, supporting blocking get, polling and timed waits, and propagating exceptions. `std::async` returns one; `shared_future` allows multiple readers. Standard C++ futures lack continuation chaining, which is why coroutines or executor libraries are used for composing async work."

---

## 4. Coroutines

**In one sentence:** a coroutine is a function that can **pause itself** (`co_await`, `co_yield`) and be **resumed later** from exactly where it stopped, which lets async code be written as simple top-to-bottom code.

### In plain words
Reading a book with a bookmark. A normal function is like reading a whole chapter in one sitting. A coroutine is reading until you need to wait for something (the kettle to boil), putting in a **bookmark** (saving where you are and your local variables), doing something else, and later opening the book **at the bookmark** and continuing. The code *looks* like one straight story, but it's actually spread over time.

### How it works
C++20 keywords — any function using one of them is a coroutine:
- `co_await expr` — pause until `expr` is ready (e.g. a timer or a network read), then continue with its result.
- `co_yield value` — produce a value and pause (for **generators**: lazy sequences).
- `co_return value` — finish and deliver the result.

Under the hood:
1. The coroutine's local variables live in a heap-allocated **coroutine frame**, so they survive across pauses.
2. The return type (e.g. `Task<T>` or `Generator<T>`) must provide a nested `promise_type` that tells the compiler how to start, finish and deliver values.
3. `std::coroutine_handle` is the "bookmark" — calling `.resume()` continues the coroutine.
4. C++20 gives the *machinery* but few ready-made types. You write your own (as below) or use a library: `std::generator` (C++23), Boost.Asio, cppcoro, libunifex, `std::execution` (C++26).

Same idea elsewhere: `async`/`await` in JavaScript, Python, C#, Rust, Kotlin coroutines, Go goroutines (different mechanism, similar feel).

### Modern C++ example 1 — a generator with `co_yield`
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <coroutine>
#include <iostream>
#include <utility>

template <class T>
class Generator {
public:
    struct promise_type {
        T current;
        Generator get_return_object() { return Generator{Handle::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }   // start paused
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(T v) { current = std::move(v); return {}; }  // pause at co_yield
        void return_void() {}
        void unhandled_exception() { throw; }
    };
    using Handle = std::coroutine_handle<promise_type>;

    explicit Generator(Handle h) : h_(h) {}
    Generator(Generator&& o) noexcept : h_(std::exchange(o.h_, {})) {}
    ~Generator() { if (h_) h_.destroy(); }

    bool next() { h_.resume(); return !h_.done(); }    // run until the next co_yield
    const T& value() const { return h_.promise().current; }

private:
    Handle h_;
};

Generator<long long> fibonacci() {        // an INFINITE sequence, computed lazily
    long long a = 0, b = 1;
    while (true) {
        co_yield a;                       // hand out a value, pause here
        a = std::exchange(b, a + b);      // resume here next time
    }
}

int main() {
    auto fib = fibonacci();
    for (int i = 0; i < 10 && fib.next(); ++i) std::cout << fib.value() << ' ';
    std::cout << '\n';
}
```

**Output:**
```text
0 1 1 2 3 5 8 13 21 34
```

### Modern C++ example 2 — async/await style with `co_await`
Two "requests" run concurrently on a single thread. Each is written as simple sequential code; `co_await loop.sleep(ms)` pauses it without blocking. A virtual clock keeps the output deterministic.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <coroutine>
#include <exception>
#include <iostream>
#include <map>
#include <string>
#include <utility>

// ---------- a tiny event loop with timers (virtual time) ----------
struct EventLoop {
    int now = 0;
    std::multimap<int, std::coroutine_handle<>> timers;

    auto sleep(int ms) {                               // an "awaitable"
        struct Awaiter {
            EventLoop& loop; int ms;
            bool await_ready() const noexcept { return false; }              // always pause
            void await_suspend(std::coroutine_handle<> h) { loop.timers.emplace(loop.now + ms, h); }
            void await_resume() const noexcept {}
        };
        return Awaiter{*this, ms};
    }
    void run() {
        while (!timers.empty()) {
            auto [time, handle] = *timers.begin();
            timers.erase(timers.begin());
            now = time;
            handle.resume();                           // continue the paused coroutine
        }
    }
};

// ---------- Task<T>: a coroutine that returns a value to whoever co_awaits it ----------
template <class T>
struct Task {
    struct promise_type {
        T value{};
        std::coroutine_handle<> continuation;          // who is waiting for us
        Task get_return_object() { return Task{Handle::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }
        struct Final {
            bool await_ready() noexcept { return false; }
            std::coroutine_handle<> await_suspend(std::coroutine_handle<promise_type> h) noexcept {
                auto c = h.promise().continuation;     // resume the awaiting coroutine
                return c ? c : std::noop_coroutine();
            }
            void await_resume() noexcept {}
        };
        Final final_suspend() noexcept { return {}; }
        void return_value(T v) { value = std::move(v); }
        void unhandled_exception() { std::terminate(); }
    };
    using Handle = std::coroutine_handle<promise_type>;
    Handle h;
    explicit Task(Handle handle) : h(handle) {}
    Task(Task&& o) noexcept : h(std::exchange(o.h, {})) {}
    ~Task() { if (h) h.destroy(); }

    bool await_ready() const noexcept { return false; }
    std::coroutine_handle<> await_suspend(std::coroutine_handle<> caller) {
        h.promise().continuation = caller;
        return h;                                      // start the child task now
    }
    T await_resume() { return std::move(h.promise().value); }
};

// ---------- Spawn: fire-and-forget top-level coroutine ----------
struct Spawn {
    struct promise_type {
        Spawn get_return_object() { return {}; }
        std::suspend_never initial_suspend() noexcept { return {}; }
        std::suspend_never final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };
};

// ---------- application code: reads like normal synchronous code ----------
Task<std::string> fetch(EventLoop& loop, std::string what, int latency_ms) {
    co_await loop.sleep(latency_ms);                   // "waiting for the network"
    co_return what;
}

Spawn handle_request(EventLoop& loop, std::string user, int latency) {
    std::cout << "[t=" << loop.now << "] " << user << ": start\n";
    std::string profile = co_await fetch(loop, user + "'s profile", latency);
    std::cout << "[t=" << loop.now << "] " << user << ": got " << profile << '\n';
    std::string orders = co_await fetch(loop, user + "'s orders", latency);
    std::cout << "[t=" << loop.now << "] " << user << ": got " << orders << ", done\n";
}

int main() {
    EventLoop loop;
    handle_request(loop, "ana", 30);   // slow backend
    handle_request(loop, "ben", 10);   // fast backend
    loop.run();                        // ONE thread interleaves both requests
}
```

**Output:**
```text
[t=0] ana: start
[t=0] ben: start
[t=10] ben: got ben's profile
[t=20] ben: got ben's orders, done
[t=30] ana: got ana's profile
[t=60] ana: got ana's orders, done
```
Ben's request finishes first even though Ana's started first — and no thread ever blocked. This is exactly how async servers (Boost.Asio, Node.js, Python asyncio) serve many clients with few threads.

### Common mistakes
- Passing references (`const std::string&`) into a coroutine that outlives the caller — the referenced object can die while the coroutine is paused. Take parameters **by value** in coroutines (as above).
- Forgetting that someone must `resume()` and eventually `destroy()` the coroutine — leaked frames are memory leaks. Wrap handles in RAII types.
- Blocking inside a coroutine (`sleep_for`, synchronous I/O) — it blocks every other coroutine on that thread.

### Interview answer
"A coroutine is a function that can suspend and resume, keeping its state in a coroutine frame. C++20 provides `co_await`, `co_yield` and `co_return` plus customization points through `promise_type` and awaiters; libraries build tasks and generators on top. Coroutines let asynchronous code be written sequentially, avoiding callback nesting, and an event loop can multiplex thousands of them on a few threads."

---

## Cheat sheet

| Style | Idea | C++ | Pros | Cons |
|---|---|---|---|---|
| Callback | "Call me when done" | `std::function`, lambdas | Simple, no allocation needed | Nesting, error handling, lifetimes |
| Promise | Producer sets value/error once | `std::promise<T>` | Clear ownership of the result | Low level |
| Future | Placeholder to wait on | `std::future`, `std::async`, `shared_future` | Timeouts, exceptions propagate | No `.then()` in std, blocking `get` |
| Coroutine | Pause/resume at `co_await` | C++20 coroutines, `std::generator` (C++23) | Sequential-looking async code, cheap | Needs library types; lifetime care |
