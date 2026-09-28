# Coding Best Practices — Explained for Beginners

> **What you'll learn:** the habits that make code easy to read, change and trust: **modular programming, naming conventions, code readability, code reusability, error handling, testing, version control and code reviews** — each with a *before/after* in modern C++.
>
> **Prerequisites:** basic C++. Related principles: [DRY, KISS, YAGNI, SOLID](../System%20Design/OOD-Principles.md).

## Table of Contents
1. [Modular programming](#1-modular-programming)
2. [Naming conventions](#2-naming-conventions)
3. [Code readability](#3-code-readability)
4. [Code reusability](#4-code-reusability)
5. [Error handling](#5-error-handling)
6. [Testing](#6-testing)
7. [Version control (e.g., Git)](#7-version-control-eg-git)
8. [Code reviews](#8-code-reviews)
9. [Cheat sheet](#cheat-sheet)

---

## 1. Modular programming

**In one sentence:** modular programming splits a program into **independent modules** (functions, classes, files, libraries), each with one clear job and a small public interface.

### In plain words
A car is built from modules — engine, brakes, radio — made by different teams and connected through standard interfaces. You can replace the radio without touching the brakes. Code should work the same way.

### How it works
- **High cohesion:** things inside a module belong together. **Low coupling:** modules depend on each other as little as possible, only through their public interface.
- In C++: functions → classes → **namespaces** → header/source pairs (`.h`/`.cpp`) → libraries → **C++20 modules** (`export module geometry;`), which replace textual `#include` with faster, cleaner imports.
- Hide details: `private` members, anonymous namespaces/`static` for file-local helpers, only export what users need.
- Benefits: parallel work, easier testing, reuse, faster builds, smaller blast radius for changes.

### Modern C++ example — a module with a small public interface and hidden internals
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iostream>
#include <numbers>
#include <string>

// ---- module "geometry": public interface ----
namespace geometry {
double circle_area(double radius);
double ring_area(double outer, double inner);
}

// ---- module "geometry": implementation details (would live in geometry.cpp) ----
namespace geometry {
namespace {                                           // anonymous namespace: invisible outside this file
double square(double x) { return x * x; }
}
double circle_area(double radius) { return std::numbers::pi * square(radius); }
double ring_area(double outer, double inner) { return circle_area(outer) - circle_area(inner); }
}

// ---- module "report": uses geometry only through its interface ----
namespace report {
std::string describe_ring(double outer, double inner) {
    return "ring area = " + std::to_string(geometry::ring_area(outer, inner));
}
}

int main() { std::cout << report::describe_ring(2.0, 1.0) << '\n'; }
```

**Output:**
```text
ring area = 9.424778
```
With C++20 modules the interface would be `export module geometry;` + `export double circle_area(double);`, and users would write `import geometry;`.

### Interview answer
"Modular programming decomposes a system into cohesive, loosely coupled modules with minimal public interfaces and hidden internals, enabling independent development, testing and reuse. In C++ that means functions, classes, namespaces, header/source separation, libraries and C++20 modules."

---

## 2. Naming conventions

**In one sentence:** choose names that tell the reader **what something is or does**, and follow one consistent style for the whole codebase.

### In plain words
A labeled spice rack ("cumin", "paprika") versus unlabeled jars ("jar1", "jar2"). You'll spend far more time *reading* code than writing it; good names are free documentation.

### How it works
**Meaningful names**
- Variables and classes: **nouns** (`invoice_total`, `Customer`). Functions: **verbs** (`calculate_tax`, `send_email`). Booleans: questions (`is_valid`, `has_permission`).
- Say units: `timeout_ms`, `distance_km` (or use strong types like `std::chrono::milliseconds`).
- Avoid abbreviations nobody knows (`cstmr_mgr`), single letters (except tiny loops `i`, `j`), and misleading names (`list` that's actually a `map`).
- Name length ≈ scope size: short for tiny scopes, descriptive for globals and public APIs.

**Consistent style** (pick one per project; common C++ choices):
| Kind | Standard library style | Google style |
|---|---|---|
| Types | `snake_case` (`unordered_map`) | `PascalCase` (`HttpClient`) |
| Functions | `snake_case` | `PascalCase` |
| Variables | `snake_case` | `snake_case` |
| Members | often `name_` or `m_name` | `name_` |
| Constants | `kMaxSize` or `MAX_SIZE` | `kMaxSize` |
| Macros | `ALL_CAPS` | `ALL_CAPS` |
Enforce it automatically with **clang-format** and **clang-tidy** (readability-identifier-naming).

### Modern C++ example — the same function, badly and well named
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <vector>

// BEFORE: what is d? what is x? what unit is t?
double f(const std::vector<double>& d, double x, int t) {
    double r = 0;
    for (double v : d) r += v;
    return r * (1 + x) * t;
}

// AFTER: the code explains itself
double total_invoice_amount(const std::vector<double>& line_item_prices, double tax_rate, int quantity_multiplier) {
    double subtotal = 0;
    for (double price : line_item_prices) subtotal += price;
    return subtotal * (1 + tax_rate) * quantity_multiplier;
}

// Units in the type: impossible to pass seconds where milliseconds are expected
void wait_for_reply(std::chrono::milliseconds timeout) { std::cout << "waiting up to " << timeout.count() << " ms\n"; }

int main() {
    using namespace std::chrono_literals;
    std::cout << f({10, 20}, 0.2, 1) << " == " << total_invoice_amount({10, 20}, 0.2, 1) << '\n';
    wait_for_reply(2s);               // converts safely: 2000 ms
}
```

**Output:**
```text
36 == 36
waiting up to 2000 ms
```

### Interview answer
"Names should reveal intent — nouns for data and types, verbs for functions, questions for booleans, units in names or types — and follow a single consistent convention enforced by tools like clang-format and clang-tidy."

---

## 3. Code readability

**In one sentence:** readable code is code that another person (or you in six months) can **understand quickly and correctly** — clear structure, small functions, obvious control flow, and comments that explain *why*.

### In plain words
A well-written recipe: short numbered steps, one action per step, ingredients listed up front. Compare with one long paragraph where you must reread every sentence three times.

### How it works
- **Small functions** that do one thing at one level of abstraction.
- **Early returns / guard clauses** instead of deep nesting ("arrow code").
- **Avoid magic numbers:** `constexpr int kMaxRetries = 3;`.
- **Prefer standard algorithms** (`std::ranges::any_of`) over hand-written loops when they say what you mean.
- **Comments explain *why*, not *what*** — the code already says what. Keep comments true (outdated comments lie).
- **Consistent formatting** (clang-format), reasonable line length, grouped related code.
- `const` by default; narrow variable scope; avoid clever one-liners.

### Modern C++ example — nested "arrow code" vs. guard clauses
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

struct User { bool active; bool email_verified; int age; std::string country; };

// BEFORE: deep nesting, the real rule is hidden
std::string can_buy_before(const User& u) {
    if (u.active) {
        if (u.email_verified) {
            if (u.age >= 18) {
                if (u.country != "XX") {
                    return "allowed";
                } else { return "denied: region"; }
            } else { return "denied: age"; }
        } else { return "denied: email"; }
    } else { return "denied: inactive"; }
}

// AFTER: guard clauses, named constants, flat and scannable
constexpr int kMinimumAge = 18;
constexpr const char* kEmbargoedCountry = "XX";

std::string can_buy(const User& u) {
    if (!u.active)                     return "denied: inactive";
    if (!u.email_verified)             return "denied: email";
    if (u.age < kMinimumAge)           return "denied: age";
    if (u.country == kEmbargoedCountry) return "denied: region";   // legal requirement, see policy doc
    return "allowed";
}

int main() {
    User teen{true, true, 16, "PT"}, adult{true, true, 30, "PT"};
    std::cout << can_buy(teen) << " / " << can_buy(adult) << " (same as before: "
              << can_buy_before(teen) << " / " << can_buy_before(adult) << ")\n";
}
```

**Output:**
```text
denied: age / allowed (same as before: denied: age / allowed)
```

### Interview answer
"Readable code uses small single-purpose functions, guard clauses instead of deep nesting, named constants, standard algorithms, consistent formatting and comments that explain intent rather than restate the code, because code is read far more often than it's written."

---

## 4. Code reusability

**In one sentence:** reusable code is written once, **generally enough** to be used in many places — through functions, templates/generics, libraries and composition — without copy-pasting.

### In plain words
A power drill with interchangeable bits works for screws, holes and sanding. You don't buy a new drill for each job. Code reuse works the same way: one well-designed tool, many uses.

### How it works
- **Functions** for repeated logic (DRY — see [OOD Principles](../System%20Design/OOD-Principles.md#1-dry-dont-repeat-yourself)).
- **Templates + concepts** for type-generic code (`std::sort` works on any sortable range).
- **Composition and interfaces** rather than deep inheritance.
- **Libraries/packages** shared across projects (vcpkg, Conan in C++).
- Use the **standard library** and well-known libraries before writing your own.
- Balance: don't over-generalize before there are two or three real uses (YAGNI); reusable code needs clear docs and tests.

### Modern C++ example — one generic, constrained function reused for many types
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <concepts>
#include <iostream>
#include <string>
#include <vector>

// Reusable for ANY range of values that can be compared with <.
template <std::ranges::input_range R>
    requires std::totally_ordered<std::ranges::range_value_t<R>>
auto max_or(const R& values, std::ranges::range_value_t<R> fallback) {
    auto best = fallback;
    bool first = true;
    for (const auto& v : values)
        if (first || best < v) { best = v; first = false; }
    return best;
}

int main() {
    std::vector<int> scores{70, 95, 88};
    std::vector<std::string> names{"bob", "zoe", "ana"};
    std::vector<double> empty;
    std::cout << max_or(scores, 0) << ", " << max_or(names, std::string("?")) << ", " << max_or(empty, -1.0) << '\n';
}
```

**Output:**
```text
95, zoe, -1
```

### Interview answer
"I make code reusable by extracting cohesive functions, using templates constrained with concepts for type-generic logic, preferring composition and interfaces, packaging shared code as libraries, and leaning on the standard library — while avoiding premature generalization until there are real repeated use cases."

---

## 5. Error handling

**In one sentence:** good error handling makes failures **visible, specific and recoverable** — never silently ignored — using exceptions or result types consistently.

### In plain words
A good car dashboard shows *which* problem you have ("low oil pressure"), at the moment it happens, and doesn't hide it behind a single generic "error" light — or worse, no light at all.

### How it works (summary — full guide: [Error Handling](../Programming%20Languages%20and%20Concepts/Error-Handling.md))
- **Never swallow errors** (`catch (...) {}`); log with context and re-throw or handle.
- **Fail fast** on programming errors (preconditions, `assert`), **recover** from expected failures (network, missing file).
- Use **exceptions** for exceptional failures and **`std::optional` / `std::expected`** for expected ones; mark results `[[nodiscard]]`.
- **RAII** so resources are released on every path.
- Error messages should say **what** failed, **with which input**, and ideally **what to do**.
- Validate at boundaries (user input, network, files); trust internal invariants.

### Modern C++ example — silent failure vs. specific, handled errors
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <charconv>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>

// BEFORE: returns 0 on bad input -- a silent, indistinguishable failure
int parse_port_bad(std::string_view s) { int v = 0; std::from_chars(s.data(), s.data() + s.size(), v); return v; }

// AFTER: the caller can't miss the failure, and the message says exactly what went wrong
struct ParseResult { std::optional<int> port; std::string error; };
[[nodiscard]] ParseResult parse_port(std::string_view s) {
    int v = 0;
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), v);
    if (ec != std::errc{} || ptr != s.data() + s.size()) return {std::nullopt, "port '" + std::string(s) + "' is not a number"};
    if (v < 1 || v > 65535) return {std::nullopt, "port " + std::to_string(v) + " is outside 1-65535"};
    return {v, ""};
}

int main() {
    std::cout << "bad version: parse_port_bad(\"http\") = " << parse_port_bad("http") << "  (is 0 a real port?)\n";
    for (std::string_view input : {"8080", "http", "70000"}) {
        auto r = parse_port(input);
        if (r.port) std::cout << "port = " << *r.port << '\n';
        else        std::cout << "config error: " << r.error << '\n';
    }
}
```

**Output:**
```text
bad version: parse_port_bad("http") = 0  (is 0 a real port?)
port = 8080
config error: port 'http' is not a number
config error: port 70000 is outside 1-65535
```

### Interview answer
"Errors must never be silently ignored: I validate at boundaries, fail fast on bugs, recover from expected failures, use exceptions or std::expected consistently with [[nodiscard]], release resources with RAII, and produce specific, contextual error messages."

---

## 6. Testing

**In one sentence:** automated tests are small programs that **check your code behaves as expected**, run on every change so bugs are caught before users see them.

### In plain words
A pilot runs through a checklist before every flight, even though the plane flew fine yesterday. Tests are your code's pre-flight checklist — automatic, repeatable, and fast.

### How it works
**The testing pyramid** (many cheap tests at the bottom, few expensive ones at the top):
| Level | Tests | Speed | Example |
|---|---|---|---|
| **Unit** | One function/class in isolation (with fakes for dependencies) | Milliseconds | `calculate_tax(100) == 20` |
| **Integration** | Several components together (real DB, real HTTP) | Seconds | Repository against a test PostgreSQL |
| **End-to-end (E2E)** | Whole system like a user | Minutes | Browser clicks "checkout" |

Good unit tests are **FIRST**: Fast, Independent, Repeatable, Self-validating, Timely. Structure each test as **Arrange–Act–Assert**. Test normal cases, **edge cases** and **error cases**.
Practices: **TDD** (write the failing test first: red → green → refactor), **test doubles** (fakes, stubs, mocks) via dependency injection, **code coverage** as a hint (not a goal), **CI** runs all tests on every push, property-based and fuzz testing, sanitizers (`-fsanitize=address,undefined`).
C++ frameworks: **GoogleTest**, **Catch2**, **doctest**, **Boost.Test**.

### Modern C++ example — a tiny unit-test harness (no libraries needed)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <source_location>
#include <stdexcept>
#include <string>
#include <vector>

// ---- code under test ----
double apply_discount(double price, double percent) {
    if (price < 0 || percent < 0 || percent > 100) throw std::invalid_argument("invalid input");
    return price * (1 - percent / 100);
}

// ---- minimal test framework (GoogleTest/Catch2 do this and much more) ----
int failures = 0;
void expect_eq(double actual, double expected, std::source_location loc = std::source_location::current()) {
    if (actual != expected) {
        ++failures;
        std::cout << "  FAILED at line " << loc.line() << ": expected " << expected << ", got " << actual << '\n';
    }
}
template <class F> void expect_throws(F f, std::source_location loc = std::source_location::current()) {
    try { f(); ++failures; std::cout << "  FAILED at line " << loc.line() << ": expected an exception\n"; }
    catch (const std::exception&) {}
}

int main() {
    std::vector<std::pair<std::string, std::function<void()>>> tests{
        {"normal discount", [] {
             double price = 200;                          // Arrange
             double result = apply_discount(price, 25);   // Act
             expect_eq(result, 150);                      // Assert
         }},
        {"zero discount keeps price", [] { expect_eq(apply_discount(80, 0), 80); }},
        {"full discount is free",     [] { expect_eq(apply_discount(80, 100), 0); }},
        {"rejects negative price",    [] { expect_throws([] { apply_discount(-1, 10); }); }},
        {"rejects >100 percent",      [] { expect_throws([] { apply_discount(10, 150); }); }},
    };
    for (const auto& [name, test] : tests) {
        int before = failures;
        test();
        std::cout << (failures == before ? "[ PASS ] " : "[ FAIL ] ") << name << '\n';
    }
    std::cout << tests.size() << " tests, " << failures << " failures\n";
    return failures == 0 ? 0 : 1;
}
```

**Output:**
```text
[ PASS ] normal discount
[ PASS ] zero discount keeps price
[ PASS ] full discount is free
[ PASS ] rejects negative price
[ PASS ] rejects >100 percent
5 tests, 0 failures
```

### Interview answer
"I follow the testing pyramid: many fast, isolated unit tests in Arrange–Act–Assert form covering normal, edge and error cases, fewer integration tests with real dependencies, and a few end-to-end tests, all run in CI. I use dependency injection for test doubles, TDD where it helps design, sanitizers and fuzzing for C++, and treat coverage as a signal, not a target."

---

## 7. Version control (e.g., Git)

**In one sentence:** version control records **every change** to your code with who/when/why, lets many people work in parallel on **branches**, and lets you go back to any previous version.

### In plain words
"Track changes" plus "unlimited undo" plus "parallel universes" for your whole project: each teammate experiments on their own branch, and good changes are merged back into the main line.

### How it works (summary — full guide: [Git Explained](../Version%20Control%20Systems/Git-Explained.md))
Best practices:
- **Small, focused commits** with clear messages: an imperative summary line ("Add retry to payment client") + *why* in the body.
- **Branch per feature/fix**; keep branches short-lived; open **pull requests** for review.
- Never commit secrets, build artifacts or huge binaries (`.gitignore`, Git LFS).
- Keep `main` always releasable; CI runs tests on every PR.
- Rebase/merge regularly to avoid painful conflicts; tag releases.

### Modern C++ example — why commits are snapshots: a toy history with checkout
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Commit { std::string message; std::string file_content; };

int main() {
    std::vector<Commit> history;
    history.push_back({"Add greeting", "print('hello')"});
    history.push_back({"Make greeting friendlier", "print('hello, friend!')"});
    history.push_back({"Refactor: oops, broke it", "prnt('hello, friend!')"});

    std::cout << "git log:\n";
    for (std::size_t i = history.size(); i-- > 0;) std::cout << "  " << i << "  " << history[i].message << '\n';
    std::cout << "current file: " << history.back().file_content << "   <- bug!\n";
    std::cout << "git checkout 1 -> " << history[1].file_content << "   <- last good version, instantly\n";
}
```

**Output:**
```text
git log:
  2  Refactor: oops, broke it
  1  Make greeting friendlier
  0  Add greeting
current file: prnt('hello, friend!')   <- bug!
git checkout 1 -> print('hello, friend!')   <- last good version, instantly
```

### Interview answer
"Version control like Git tracks the full history of the code, enables parallel work on branches merged through reviewed pull requests, and allows reverting to any point. I make small, well-described commits, use short-lived feature branches, keep main releasable with CI, and keep secrets and build outputs out of the repository."

---

## 8. Code reviews

**In one sentence:** a code review is when teammates **read and comment on a change before it's merged**, to catch bugs, share knowledge and keep the codebase consistent.

### In plain words
A second pair of eyes on an important letter before you send it: they catch the typo in the amount, the unclear sentence, and the missing attachment you were too close to notice.

### How it works
**What reviewers look for:** correctness and edge cases, tests, readability and naming, design (does it fit the architecture? is it too complex?), security (input validation, secrets, injection), performance where it matters, error handling, and documentation.

**As an author:** keep PRs **small** (a few hundred lines max), write a clear description (what, why, how tested), self-review first, run linters/formatters/tests before asking.

**As a reviewer:** be kind and specific, comment on the code not the person, explain *why*, distinguish blocking issues from nits ("nit:", "optional:"), ask questions ("what happens if the list is empty?"), and approve when it's good enough — not perfect.

**Automate the boring parts** so humans focus on logic and design: clang-format, clang-tidy, static analyzers, sanitizers, CI tests.

### Modern C++ example — code before and after addressing review comments
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <optional>
#include <vector>

// BEFORE review:
//   reviewer: "crashes (division by zero) on an empty vector"
//   reviewer: "integer division: average of {1,2} returns 1"
//   reviewer: "nit: name 'calc' says nothing; take by const& to avoid a copy"
int calc(std::vector<int> v) { int s = 0; for (int x : v) s += x; return s / static_cast<int>(v.size()); }

// AFTER review:
std::optional<double> average(const std::vector<int>& values) {
    if (values.empty()) return std::nullopt;                                  // edge case handled
    double sum = std::accumulate(values.begin(), values.end(), 0.0);          // floating-point sum
    return sum / static_cast<double>(values.size());
}

int main() {
    std::cout << "before: calc({1, 2}) = " << calc({1, 2}) << "  (wrong)\n";
    std::cout << "after:  average({1, 2}) = " << average({1, 2}).value() << '\n';
    std::cout << "after:  average({}) has value? " << std::boolalpha << average({}).has_value() << '\n';
}
```

**Output:**
```text
before: calc({1, 2}) = 1  (wrong)
after:  average({1, 2}) = 1.5
after:  average({}) has value? false
```

### Interview answer
"Code reviews catch defects early, spread knowledge and keep code consistent. As an author I submit small, well-described, self-reviewed PRs with tests; as a reviewer I focus on correctness, edge cases, design, readability, security and tests, give specific and respectful feedback, separate blocking issues from nits, and leave formatting and style to automated tools."

---

## Cheat sheet

| Practice | Key habit |
|---|---|
| Modular programming | Cohesive modules, small interfaces, hidden internals |
| Naming | Intent-revealing, consistent style, units in names/types |
| Readability | Small functions, guard clauses, named constants, "why" comments |
| Reusability | Functions, templates + concepts, composition, libraries — no copy-paste |
| Error handling | Never swallow; specific messages; exceptions/expected; RAII |
| Testing | Pyramid; Arrange–Act–Assert; edge cases; CI |
| Version control | Small commits, clear messages, short branches, PRs |
| Code reviews | Small PRs, kind + specific feedback, automate style checks |
