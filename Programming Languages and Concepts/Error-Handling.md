# Error Handling — Explained for Beginners

> **What you'll learn:** the two big families of error handling (**exceptions vs. error codes**), how **exception handling mechanisms** work (throw, catch, stack unwinding), what **exception safety** guarantees are, how errors **propagate** up through a program, and strategies for **error recovery** — with modern C++ including `std::expected` (C++23).
>
> **Prerequisites:** basic C++ functions and classes.
>
> Examples marked `-std=c++23` need GCC 12+/Clang 16+/MSVC 19.33+.

## Table of Contents
1. [Exceptions vs. Error codes](#1-exceptions-vs-error-codes)
2. [Exception handling mechanisms](#2-exception-handling-mechanisms)
3. [Exception safety](#3-exception-safety)
4. [Error propagation](#4-error-propagation)
5. [Error recovery](#5-error-recovery)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Exceptions vs. Error codes

**In one sentence:** with **error codes** a function *returns* a value saying whether it worked and the caller must check it; with **exceptions** a function *throws* an error object that automatically jumps up to whoever is prepared to catch it.

### In plain words
- **Error code:** you mail a letter, and the post office always sends back a receipt saying "delivered" or "failed: address unknown". You must read every receipt. If you ignore one, you'll never know it failed.
- **Exception:** if delivery fails, a loud alarm goes off and keeps getting louder up the chain of command until *someone* responsible handles it. You can't accidentally ignore it — if nobody handles it, the whole operation stops (the program terminates).

### How it works
| | Error codes / result types | Exceptions |
|---|---|---|
| How errors travel | Return values; each caller must check and pass on | Automatically unwind the stack to the nearest matching `catch` |
| Can be ignored? | Yes (unless `[[nodiscard]]`) | No — uncaught → `std::terminate` |
| Code clutter | `if (err) return err;` everywhere | Clean "happy path" |
| Visibility | Visible in the function signature | Invisible — any call might throw |
| Cost | Tiny, always paid | ~zero when not thrown; expensive when thrown |
| Good for | Expected failures (file not found, invalid input), hot paths, embedded/real-time | Rare, truly exceptional failures; constructors; deep call stacks |
| C++ tools | `std::error_code`, `std::optional`, **`std::expected<T, E>` (C++23)** | `throw`, `try`, `catch`, `std::exception` |

Other languages: Go and Rust use result types (`(value, err)`, `Result<T, E>`); Java, Python, C# use exceptions.

A popular modern C++ guideline: **use `std::expected`/`std::optional` for failures the caller is expected to handle; use exceptions for things that shouldn't happen in normal operation.**

### Modern C++ example — the same parser three ways
```cpp
// g++ -std=c++23 main.cpp && ./a.out
#include <charconv>
#include <expected>
#include <iostream>
#include <stdexcept>
#include <string>
#include <string_view>

enum class ParseError { Empty, NotANumber };

// 1) Classic error code + output parameter (C style)
[[nodiscard]] int parse_c(std::string_view s, int& out) {
    if (s.empty()) return 1;
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), out);
    return (ec != std::errc{} || ptr != s.data() + s.size()) ? 2 : 0;
}

// 2) Exceptions
int parse_throw(std::string_view s) {
    if (s.empty()) throw std::invalid_argument("empty input");
    int out{};
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), out);
    if (ec != std::errc{} || ptr != s.data() + s.size())
        throw std::invalid_argument("not a number: " + std::string(s));
    return out;
}

// 3) std::expected: value OR error, visible in the type
std::expected<int, ParseError> parse_expected(std::string_view s) {
    if (s.empty()) return std::unexpected(ParseError::Empty);
    int out{};
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), out);
    if (ec != std::errc{} || ptr != s.data() + s.size()) return std::unexpected(ParseError::NotANumber);
    return out;
}

int main() {
    int v{};
    if (int err = parse_c("42", v); err == 0) std::cout << "C style: " << v << '\n';

    try { parse_throw("4x2"); }
    catch (const std::invalid_argument& e) { std::cout << "exception: " << e.what() << '\n'; }

    auto r = parse_expected("");
    if (!r) std::cout << "expected: error #" << static_cast<int>(r.error()) << " (Empty)\n";
    std::cout << "expected: " << parse_expected("7").value_or(-1) << '\n';
}
```

**Output:**
```text
C style: 42
exception: not a number: 4x2
expected: error #0 (Empty)
expected: 7
```

### Common mistakes
- Ignoring return codes. Mark functions `[[nodiscard]]` so the compiler warns.
- Using exceptions for normal control flow (e.g. "throw to exit a loop") — slow and confusing.
- Mixing both styles randomly in one codebase. Pick a convention per layer.

### Interview answer
"Error codes and result types make failure explicit in the signature and are cheap, but they clutter code and can be ignored. Exceptions keep the happy path clean, can't be silently ignored and work in constructors, but they're invisible in signatures and costly when thrown. In modern C++ I use `std::expected` for expected failures and exceptions for exceptional ones."

---

## 2. Exception handling mechanisms

**In one sentence:** `throw` creates an error object and starts **stack unwinding** — leaving each function in turn and destroying its local objects — until a matching `catch` block is found.

### In plain words
You're deep inside a building (functions calling functions) when the fire alarm goes off (`throw`). You leave room by room, **closing every door behind you** (destructors run). You keep going up and out until you reach someone trained for this kind of fire (a matching `catch`). If you reach the street and nobody can handle it, the whole building is evacuated (`std::terminate`).

### How it works
1. `throw SomeError{...};` — the exception object is created.
2. The runtime looks for a `try` block in the current function with a `catch` whose type matches (exact type or a **base class**).
3. If none, the function exits: all its local objects are destroyed in reverse order (**stack unwinding**), and the search continues in the caller.
4. The first matching `catch` runs. After it finishes, execution continues after that `try/catch`.
5. No match anywhere → `std::terminate()` (program ends).

Rules of thumb:
- **Throw by value, catch by `const&`**: `catch (const std::exception& e)`. Catching by value "slices" derived exceptions.
- Order `catch` blocks from **most specific to most general**.
- Use the standard hierarchy: `std::exception` → `std::logic_error` (bugs: `invalid_argument`, `out_of_range`) and `std::runtime_error` (environment: `system_error`, `overflow_error`…).
- `throw;` (no argument) inside a `catch` **rethrows** the current exception unchanged.
- `noexcept` promises a function won't throw; if it does anyway, `std::terminate`. Destructors are `noexcept` by default — **never throw from a destructor**.
- The **zero-cost model**: on modern compilers, a `try` block costs nothing if no exception is thrown; throwing is expensive (microseconds).

### Modern C++ example — unwinding in action
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>

struct Guard {                                    // prints when destroyed during unwinding
    std::string name;
    ~Guard() { std::cout << "  destroying " << name << '\n'; }
};

class InsufficientFunds : public std::runtime_error {    // custom exception type
public:
    explicit InsufficientFunds(int missing)
        : std::runtime_error("insufficient funds, missing " + std::to_string(missing)) {}
};

void level3(int balance, int amount) {
    Guard g{"level3 locals"};
    if (amount > balance) throw InsufficientFunds(amount - balance);
    std::cout << "never printed\n";
}
void level2(int b, int a) { Guard g{"level2 locals"}; level3(b, a); }
void level1(int b, int a) { Guard g{"level1 locals"}; level2(b, a); }

int main() {
    try {
        level1(50, 80);
    } catch (const InsufficientFunds& e) {        // most specific first
        std::cout << "caught InsufficientFunds: " << e.what() << '\n';
    } catch (const std::exception& e) {           // then general
        std::cout << "caught something else: " << e.what() << '\n';
    }
    std::cout << "program continues normally\n";
}
```

**Output:**
```text
  destroying level3 locals
  destroying level2 locals
  destroying level1 locals
caught InsufficientFunds: insufficient funds, missing 30
program continues normally
```

### Common mistakes
- `catch (...)` that swallows everything silently — you lose the bug.
- Throwing pointers (`throw new MyError`) — who deletes it? Throw by value.
- Throwing from a destructor during unwinding → immediate `std::terminate`.

### Interview answer
"`throw` constructs an exception object and unwinds the stack, running destructors of every local object, until a `catch` with a matching type or base type is found; if none is found, `std::terminate` is called. Throw by value, catch by const reference, order handlers specific to general, mark non-throwing functions `noexcept`, and never throw from destructors."

---

## 3. Exception safety

**In one sentence:** exception safety describes what state your object/program is left in if an exception is thrown halfway through an operation: nothing guaranteed, still valid, unchanged, or "can't fail at all".

### In plain words
You're rearranging furniture and your phone rings (an exception) mid-move:
- **No guarantee:** the couch is stuck in the doorway. The house is broken.
- **Basic guarantee:** the house is livable (nothing broken, nothing lost), but the furniture might be in a different arrangement than before.
- **Strong guarantee:** you put everything back exactly as it was before you started — all or nothing.
- **No-throw guarantee:** you never get interrupted; the operation always succeeds.

### How it works
The four levels (David Abrahams' guarantees):
| Level | Promise | Example |
|---|---|---|
| **No-throw** (`noexcept`) | Never fails | Destructors, `swap`, move constructors of most types |
| **Strong** | Success, or state unchanged (commit-or-rollback) | `std::vector::push_back` (if the element's move is noexcept or it's copyable) |
| **Basic** | No leaks, invariants hold, but state may have changed | Most operations should give at least this |
| **None** | Anything goes | Bugs |

Techniques:
- **RAII everywhere** → no leaks → basic guarantee almost for free.
- **Do the risky work on the side, then commit with a no-throw step** → strong guarantee. The classic pattern is **copy-and-swap**: modify a copy; if it throws, the original is untouched; if it succeeds, `swap` (which can't throw).
- Mark move constructors `noexcept` — otherwise `std::vector` must *copy* on reallocation to keep its strong guarantee.

### Modern C++ example — strong guarantee with copy-and-swap
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

class Playlist {
public:
    // Adds several songs: all of them, or none (strong guarantee).
    void add_all(const std::vector<std::string>& songs) {
        std::vector<std::string> copy = songs_;          // 1) work on a copy
        for (const auto& s : songs) {
            if (s.empty()) throw std::invalid_argument("empty song name");
            copy.push_back(s);                           //    may throw: original untouched
        }
        songs_.swap(copy);                               // 2) commit: swap never throws
    }
    void print() const {
        for (const auto& s : songs_) std::cout << s << ' ';
        std::cout << "(" << songs_.size() << " songs)\n";
    }
private:
    std::vector<std::string> songs_{"intro"};
};

int main() {
    Playlist p;
    p.add_all({"a", "b"});
    p.print();
    try {
        p.add_all({"c", "", "d"});                       // fails in the middle
    } catch (const std::exception& e) {
        std::cout << "error: " << e.what() << '\n';
    }
    p.print();                                           // unchanged: no "c" was added
}
```

**Output:**
```text
intro a b (3 songs)
error: empty song name
intro a b (3 songs)
```

### Common mistakes
- Changing member variables one by one and throwing halfway → object left half-updated (not even the basic guarantee if invariants break).
- Forgetting `noexcept` on move constructors — silently makes `std::vector` slower.

### Interview answer
"The guarantees are no-throw, strong (commit-or-rollback), basic (valid state, no leaks) and none. RAII gives the basic guarantee; copy-and-swap or 'prepare then commit with a noexcept step' gives the strong one. Destructors, swap and moves should be noexcept."

---

## 4. Error propagation

**In one sentence:** error propagation is how an error travels from where it happens (deep in the code) to where it can be sensibly handled (usually much higher), ideally gaining useful context along the way.

### In plain words
A factory worker finds a defective part. They can't decide whether to cancel the customer's order — that's the manager's job. So they report it to their supervisor, who adds "this is for order #123", who reports it to the manager, who decides. Each level passes the problem up and adds context, but doesn't try to solve what it can't.

### How it works
- **Handle errors where you have enough context to decide.** Low-level code usually *reports*; high-level code *decides*.
- **With exceptions:** propagation is automatic. Catch only to add context (`std::throw_with_nested`) or translate between layers (e.g. a `SqlError` becomes a `RepositoryError`).
- **With result types:** you pass errors up explicitly. `std::expected` has **monadic** helpers (C++23) so you don't write `if (!x) return x.error();` each time:
  - `and_then(f)` — if OK, run `f` (which may fail) on the value.
  - `transform(f)` — if OK, change the value.
  - `or_else(f)` — if error, try to recover or change the error.
  - `transform_error(f)` — change the error type/message (add context).
- Rust's `?` operator and Go's `if err != nil { return err }` are the same idea.

### Modern C++ example — propagation with `std::expected` pipelines
```cpp
// g++ -std=c++23 main.cpp && ./a.out
#include <expected>
#include <iostream>
#include <map>
#include <string>

using Result = std::expected<int, std::string>;

const std::map<std::string, int> user_ids{{"ana", 1}, {"ben", 2}};
const std::map<int, int> balances{{1, 500}};                 // ben has no account yet

Result find_user(const std::string& name) {
    if (auto it = user_ids.find(name); it != user_ids.end()) return it->second;
    return std::unexpected("user '" + name + "' not found");
}
Result load_balance(int id) {
    if (auto it = balances.find(id); it != balances.end()) return it->second;
    return std::unexpected("no account for user id " + std::to_string(id));
}

Result balance_after_fee(const std::string& name) {
    return find_user(name)                                   // may fail
        .and_then(load_balance)                              // runs only if the previous step worked
        .transform([](int b) { return b - 5; })              // fee
        .transform_error([&](std::string e) {                // add context on the way up
            return "balance_after_fee(" + name + "): " + e;
        });
}

int main() {
    for (const char* name : {"ana", "ben", "zoe"}) {
        auto r = balance_after_fee(name);
        if (r) std::cout << name << " -> " << *r << '\n';
        else   std::cout << "error: " << r.error() << '\n';
    }
}
```

**Output:**
```text
ana -> 495
error: balance_after_fee(ben): no account for user id 2
error: balance_after_fee(zoe): user 'zoe' not found
```

### Common mistakes
- Catching an exception just to log it and rethrow at every level → the same error is logged 10 times.
- Losing the original error when translating (`throw MyError("failed")` without the cause). Keep the cause (`std::throw_with_nested`, or include the inner message).

### Interview answer
"Errors should propagate to the level that has the context to handle them. Exceptions propagate automatically, and I catch only to translate or add context, preserving the cause with nested exceptions. With result types I use `std::expected`'s and_then/transform/transform_error to chain fallible steps and enrich errors without boilerplate."

---

## 5. Error recovery

**In one sentence:** error recovery means what the program *does* about an error so it can keep working: retry, fall back to an alternative, use a default, degrade gracefully, or fail fast and clean up.

### In plain words
Your phone call drops. You can:
- **Retry** — call again (maybe wait a bit first).
- **Fall back** — send a text message instead.
- **Default** — "I'll assume the meeting is still at 3pm."
- **Degrade gracefully** — "I'll continue without that info."
- **Give up clearly** — "I can't reach them; let me tell my boss."

### How it works
| Strategy | When | Watch out |
|---|---|---|
| **Retry with exponential backoff + jitter** | Transient failures (timeouts, 503, lock conflicts) | Only retry **idempotent** operations; cap attempts; add randomness so clients don't retry in sync |
| **Fallback** | A backup source exists (cache, replica, simpler algorithm) | Fallback data may be stale |
| **Default value** | Missing optional config | Don't hide real problems |
| **Graceful degradation** | Non-critical feature fails (recommendations down → show page without them) | Monitor it |
| **Circuit breaker** | A dependency keeps failing — stop hammering it (see [Microservices](../System%20Design/Microservices-Explained.md)) | Needs a recovery probe |
| **Fail fast** | Bugs, corrupted state, impossible situations | Crash early with a clear message rather than continue with bad data |
| **Compensation / rollback** | Multi-step operation partially done | Undo completed steps (transactions, sagas) |

**Transient vs. permanent errors:** a timeout might succeed next time (retry); "invalid password" won't (don't retry).

### Modern C++ example — retry with exponential backoff, then fallback
```cpp
// g++ -std=c++23 main.cpp && ./a.out
#include <chrono>
#include <expected>
#include <functional>
#include <iostream>
#include <string>
#include <thread>

using namespace std::chrono_literals;
enum class Err { Transient, Permanent };

// Retries only TRANSIENT errors, doubling the wait each time.
template <class F>
auto retry(F op, int max_attempts, std::chrono::milliseconds delay) -> decltype(op()) {
    for (int attempt = 1;; ++attempt) {
        auto r = op();
        if (r || r.error() == Err::Permanent || attempt == max_attempts) return r;
        std::cout << "  attempt " << attempt << " failed (transient), retrying in "
                  << delay.count() << "ms\n";
        std::this_thread::sleep_for(delay);
        delay *= 2;                                   // exponential backoff
    }
}

int main() {
    int calls = 0;
    auto flaky_service = [&]() -> std::expected<std::string, Err> {
        if (++calls < 3) return std::unexpected(Err::Transient);   // fails twice, then works
        return "fresh data";
    };
    auto dead_service = []() -> std::expected<std::string, Err> {
        return std::unexpected(Err::Transient);
    };

    std::cout << "flaky service:\n";
    auto fresh = retry(flaky_service, 5, 10ms);         // run first, then print
    std::cout << "  result: " << fresh.value_or("?") << '\n';

    std::cout << "dead service:\n";
    auto r = retry(dead_service, 3, 10ms)
                 .or_else([](Err) -> std::expected<std::string, Err> {
                     return "cached data (fallback)";           // recovery: fall back
                 });
    std::cout << "  result: " << *r << '\n';
}
```

**Output:**
```text
flaky service:
  attempt 1 failed (transient), retrying in 10ms
  attempt 2 failed (transient), retrying in 20ms
  result: fresh data
dead service:
  attempt 1 failed (transient), retrying in 10ms
  attempt 2 failed (transient), retrying in 20ms
  result: cached data (fallback)
```
(Production code also adds random **jitter** to the delay.)

### Common mistakes
- Retrying non-idempotent operations (charging a card twice).
- Retrying forever with no backoff → you DDoS your own dependency ("retry storm").
- Swallowing errors and returning defaults silently — the system "works" but with wrong data.

### Interview answer
"I classify errors as transient or permanent. Transient, idempotent operations get bounded retries with exponential backoff and jitter; persistent dependency failures are isolated with circuit breakers and handled with fallbacks or graceful degradation; bugs and corrupted state fail fast; and partially completed multi-step work is rolled back or compensated."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Error codes vs exceptions | Explicit & cheap vs automatic & clean happy path |
| `std::expected<T,E>` | Value or error, in the type (C++23) |
| Unwinding | Destructors run while the exception travels up |
| Throw/catch | Throw by value, catch by `const&`, specific → general |
| Guarantees | No-throw ⊃ strong ⊃ basic ⊃ none |
| Strong guarantee | Copy-and-swap / prepare-then-commit |
| Propagation | Handle where you have context; add context going up |
| Recovery | Retry (backoff, idempotent only), fallback, degrade, circuit breaker, fail fast |
