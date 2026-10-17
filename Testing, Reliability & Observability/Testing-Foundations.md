# Software Testing Foundations — Kinds of Tests, Test Doubles, Coverage, Isolation and Strategy

> **What you'll learn:** the difference between **functional and non-functional** testing, the four **levels** of tests (unit, integration, E2E, acceptance), the **test doubles** (mocks, stubs, fakes, spies) and where to put **contract boundaries**, what **coverage** does and doesn't tell you, how to make tests **isolated and deterministic**, and how to choose tests with the **testing pyramid / trophy** and **risk**. Each part has a runnable C++ example using a tiny self-made test helper (in real projects: GoogleTest, Catch2 or doctest).
>
> **Prerequisites:** [Coding Best Practices → Testing](../Problem-solving%20and%20Coding/Coding-Best-Practices.md#6-testing) and [Dependency injection](../Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#5-dependency-injection-and-inversion-of-control).

## Table of Contents
1. [Functional vs. non-functional testing](#1-functional-vs-non-functional-testing)
2. [Mocks, stubs, fakes, spies, and contract boundaries](#2-mocks-stubs-fakes-spies-and-contract-boundaries)
3. [Test coverage metrics and their limitations](#3-test-coverage-metrics-and-their-limitations)
4. [Test isolation, deterministic fixtures, and repeatable environments](#4-test-isolation-deterministic-fixtures-and-repeatable-environments)
5. [Testing pyramid vs. testing trophy; risk-based test selection](#5-testing-pyramid-vs-testing-trophy-risk-based-test-selection)
6. [Unit, integration, end-to-end (E2E), and acceptance tests](#6-unit-integration-end-to-end-e2e-and-acceptance-tests)
7. [Cheat sheet](#cheat-sheet)

---

## 1. Functional vs. non-functional testing

**In one sentence:** **functional** tests check **what** the system does (given this input, is the output right?), while **non-functional** tests check **how well** it does it — speed, load, security, reliability, usability, compatibility.

### In plain words
For a car: "does the brake stop the car?" is functional. "Does it stop within 40 m at 100 km/h, in the rain, 10,000 times in a row?" is non-functional.

### How it works
| Functional | Non-functional |
|---|---|
| business rules, calculations, validation, workflows, APIs returning correct data | **performance** (latency, throughput), **load / stress**, **security** (auth, injection), **reliability** (failover, recovery), **scalability**, **usability / accessibility**, **compatibility** (browsers, OS, versions), **maintainability** |
| "a transfer of 30 moves 30" | "a transfer takes < 50 ms at p99 under 1,000 requests/s" |
| usually pass/fail with exact expectations | usually measured against a **threshold** or budget |

- Non-functional requirements come from **SLOs** ([SRE](./Reliability-Engineering-SRE.md#7-slis-slos-slas-and-error-budgets)), security policies and product needs — write them down as numbers so they can be tested.
- Both kinds can run in CI: functional on every commit; heavier non-functional (load, soak) nightly or before release (see [Performance testing](./Performance-and-Scalability-Testing.md)).

#### Modern C++ example — a functional test and a non-functional (latency budget) test for the same function
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <iostream>
#include <string>
#include <vector>

int failures = 0;
void check(bool ok, const std::string& name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

std::vector<int> top_k(std::vector<int> v, std::size_t k) {       // function under test
    k = std::min(k, v.size());
    std::partial_sort(v.begin(), v.begin() + k, v.end(), std::greater<>());
    v.resize(k);
    return v;
}

int main() {
    // Functional: is the answer right?
    check(top_k({5, 1, 9, 3, 7}, 3) == std::vector<int>{9, 7, 5}, "functional: top 3 of 5 numbers");
    check(top_k({2, 2}, 5) == std::vector<int>{2, 2}, "functional: k larger than input");
    check(top_k({}, 3).empty(), "functional: empty input");

    // Non-functional: is it fast enough? Budget: top-10 of 1,000,000 numbers in < 50 ms.
    std::vector<int> big(1'000'000);
    for (int i = 0; i < 1'000'000; ++i) big[i] = static_cast<int>((i * 7919LL) % 1'000'003);
    auto t0 = std::chrono::steady_clock::now();
    auto r = top_k(big, 10);
    double ms = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count();
    check(ms < 50.0 && r.size() == 10, "non-functional: 1M items under the 50 ms budget");
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS functional: top 3 of 5 numbers
PASS functional: k larger than input
PASS functional: empty input
PASS non-functional: 1M items under the 50 ms budget
0 failure(s)
```

Timing tests depend on the machine — keep budgets generous in unit tests, and do real performance testing in a controlled environment.

### Interview answer
"Functional tests verify behaviour — correct outputs, rules and workflows. Non-functional tests verify qualities against thresholds — latency, throughput, load, security, reliability, compatibility. I turn non-functional requirements into numbers like a p99 latency budget so they're testable, run functional tests on every commit and the heavier non-functional suites on a schedule or before release."

---

## 2. Mocks, stubs, fakes, spies, and contract boundaries

**In one sentence:** test doubles replace real dependencies in tests — a **stub** returns canned data, a **fake** is a simple working implementation, a **spy** records calls, a **mock** records calls *and* checks expectations — and you place them at **contract boundaries** (interfaces you own) rather than deep inside your code.

### In plain words
A film uses a stunt double for dangerous scenes. In tests, you use a "double" for the slow, flaky or expensive parts — the payment provider, the clock, the database — so the scene (your logic) can be filmed safely and quickly.

### How it works
| Double | Behaviour | Assert on | Example |
|---|---|---|---|
| **Dummy** | nothing; just fills a parameter | — | an unused logger |
| **Stub** | returns fixed answers | the **result** of your code | "exchange rate is always 50" |
| **Fake** | real but simplified logic | the **result / state** | in-memory repository, fake clock |
| **Spy** | real or stub + records calls | calls **after** the fact | count emails sent |
| **Mock** | pre-programmed **expectations** | the **interaction** itself | "charge(250) called exactly once" |

**Where to put the boundary**
- Double **external and nondeterministic** things: network, time, randomness, file system, third-party APIs, the database (in unit tests).
- **Don't mock what you don't own** directly — wrap the vendor SDK in your own adapter interface and double *that* ([Adapter](../Low-Level%20Design%20%26%20Object-Oriented%20Design/Design-Patterns-in-Practice.md#1-adapter--facade-for-external-integration)).
- **Don't mock values or your own domain logic** — use the real objects.
- Prefer **state-based** checks (fakes/stubs); use **interaction** checks (mocks) only when the interaction *is* the behaviour (an email sent, a payment charged).
- Over-mocking makes tests **brittle** (break on refactors) and can **lie** (the mock agrees with your wrong assumption). Back fakes with [contract tests](../Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#4-testability-dependency-injection-mocks-and-interface-contracts).

#### Modern C++ example — stub, fake, spy and mock around one checkout service
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

class RateProvider { public: virtual ~RateProvider() = default; virtual double usd_to_egp() const = 0; };
class OrderStore { public: virtual ~OrderStore() = default; virtual void save(const std::string& id, long egp) = 0; virtual long total() const = 0; };
class Payments { public: virtual ~Payments() = default; virtual bool charge(long egp) = 0; };

class Checkout {
public:
    Checkout(const RateProvider& r, OrderStore& s, Payments& p) : rates_(r), store_(s), pay_(p) {}
    bool buy(const std::string& id, double usd) {
        long egp = static_cast<long>(usd * rates_.usd_to_egp());
        if (!pay_.charge(egp)) return false;
        store_.save(id, egp);
        return true;
    }
private:
    const RateProvider& rates_; OrderStore& store_; Payments& pay_;
};

struct StubRate : RateProvider { double usd_to_egp() const override { return 50.0; } };               // stub
struct FakeStore : OrderStore {                                                                         // fake
    void save(const std::string& id, long egp) override { rows[id] = egp; }
    long total() const override { long t = 0; for (auto& [k, v] : rows) t += v; return t; }
    std::map<std::string, long> rows;
};
struct SpyPayments : Payments {                                                                         // spy
    bool charge(long egp) override { calls.push_back(egp); return egp <= 10'000; }
    std::vector<long> calls;
};
class MockPayments : public Payments {                                                                  // mock
public:
    void expect_charge(long egp, int times) { expected_ = egp; times_ = times; }
    bool charge(long egp) override { ++seen_; ok_ = ok_ && egp == expected_; return true; }
    bool verify() const { return ok_ && seen_ == times_; }
private:
    long expected_ = 0; int times_ = 0, seen_ = 0; bool ok_ = true;
};

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    StubRate rate;
    {   // state-based test with a stub, fake and spy
        FakeStore store; SpyPayments pay;
        Checkout c(rate, store, pay);
        check(c.buy("o1", 10.0), "buy 10 USD succeeds");
        check(!c.buy("o2", 500.0), "buy 500 USD is declined");
        check(store.total() == 500, "only the paid order is stored (500 EGP)");
        check(pay.calls == std::vector<long>{500, 25'000}, "spy saw both charge attempts");
    }
    {   // interaction test with a mock: the charge itself is the behaviour
        FakeStore store; MockPayments pay;
        pay.expect_charge(250, 1);
        Checkout(rate, store, pay).buy("o3", 5.0);
        check(pay.verify(), "mock: charged exactly once with 250 EGP");
    }
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS buy 10 USD succeeds
PASS buy 500 USD is declined
PASS only the paid order is stored (500 EGP)
PASS spy saw both charge attempts
PASS mock: charged exactly once with 250 EGP
0 failure(s)
```

### Interview answer
"Stubs return canned answers, fakes are simple working implementations like an in-memory repository, spies record calls, and mocks verify expected interactions. I double things at boundaries I own — wrappers around time, network, databases and vendor SDKs — and use real objects for domain logic. I prefer state-based tests with fakes and stubs because they survive refactoring, use mocks only when the interaction is the point, and keep fakes honest with contract tests."

---

## 3. Test coverage metrics and their limitations

**In one sentence:** coverage measures **how much code ran** during tests (lines, branches, functions, conditions), which reveals **untested code**, but **high coverage doesn't prove the tests check anything** — assertions, edge cases and mutation testing matter more.

### In plain words
A teacher checks that you **visited** every page of the book. That doesn't mean you **understood** them. Coverage tells you which pages nobody opened — useful — but not whether the reading was any good.

### How it works
| Metric | Measures | Note |
|---|---|---|
| **Line / statement** | lines executed | easiest; weakest |
| **Branch** | each `if`/`else`, `switch` case taken | catches the untested `else` |
| **Condition / MC/DC** | each boolean sub-condition affects the outcome | required in avionics (DO-178C) |
| **Function** | functions called at least once | very coarse |
| **Path** | every path through a function | explodes combinatorially |
| **Mutation score** | % of injected bugs (mutants) your tests **catch** | measures test *quality* |

**Limitations**
- A test with **no assertions** gives 100% coverage.
- Coverage can't see **missing code** (a requirement you never implemented) or **missing cases** (inputs you never thought of).
- Chasing a number (e.g. 100%) leads to tests of getters and trivial code instead of risky logic.
- Use it as a **flashlight** (find untested risky areas, e.g. error paths) and a **ratchet** (don't let it drop), not a goal.

**Tools:** `gcov`/`lcov`/`gcovr` and `llvm-cov` for C++ (`-fprofile-arcs -ftest-coverage` or `--coverage`), JaCoCo (Java), coverage.py (Python), Istanbul/nyc (JS). Mutation testing: Mull (C++), PIT (Java), Stryker (JS/C#), mutmut (Python).

#### Modern C++ example — 100% line coverage that misses a bug, caught by mutation testing
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

// Shipping is free from 500 EGP upwards. A "mutant" changes >= to > (an off-by-one bug).
long shipping_correct(long subtotal) { return subtotal >= 500 ? 0 : 30; }
long shipping_mutant(long subtotal)  { return subtotal > 500 ? 0 : 30; }

using Fn = std::function<long(long)>;
struct Suite { std::string name; std::function<bool(const Fn&)> run; };

int main() {
    // Suite A: runs every line (both branches) -> 100% line and branch coverage.
    Suite weak{"weak suite (100% coverage)", [](const Fn& f) { return f(100) == 30 && f(1000) == 0; }};
    // Suite B: adds the boundary value 500.
    Suite strong{"strong suite (+ boundary)", [](const Fn& f) { return f(100) == 30 && f(1000) == 0 && f(500) == 0 && f(499) == 30; }};

    for (const auto& s : {weak, strong}) {
        bool passes_real = s.run(shipping_correct);
        bool kills_mutant = !s.run(shipping_mutant);           // a good suite FAILS on the buggy version
        std::cout << s.name << ": passes on correct code = " << std::boolalpha << passes_real
                  << ", catches the >= -> > mutant = " << kills_mutant << '\n';
    }
}
```

**Output:**
```text
weak suite (100% coverage): passes on correct code = true, catches the >= -> > mutant = false
strong suite (+ boundary): passes on correct code = true, catches the >= -> > mutant = true
```

### Interview answer
"Coverage tells me which lines and branches ran during tests, which is great for finding untested risky code like error handling, and for preventing regressions in coverage. But it doesn't tell me whether the tests assert anything meaningful or cover edge cases — a test without assertions gets full coverage. I prefer branch coverage over line coverage, focus on risky code instead of a 100% target, and use mutation testing to measure whether tests actually catch bugs."

---

## 4. Test isolation, deterministic fixtures, and repeatable environments

**In one sentence:** each test must **set up its own state**, **not depend on other tests or their order**, and give **the same result every run** — so control time, randomness, concurrency, network and data, and run tests in **reproducible environments**.

### In plain words
A science experiment is only useful if anyone can repeat it and get the same result. If your test passes on Monday and fails on Tuesday with no code change, it's not testing your code — it's testing the weather.

### How it works
**Common causes of flaky tests and fixes**
| Cause | Fix |
|---|---|
| shared global/static state between tests | fresh fixture per test; no singletons |
| test order dependency | each test creates its own data; run in **random order** (`--gtest_shuffle`) |
| real time (`now()`, `sleep`) | inject a **fake clock**; never sleep to "wait" — wait on a condition |
| randomness | **fixed seed**, logged on failure |
| concurrency and timing | deterministic schedulers, latches/barriers, timeouts with margin |
| network / external services | doubles, or [containers / service virtualization](./Backend-and-Distributed-System-Testing.md#7-testcontainers-ephemeral-environments-and-service-virtualization) |
| shared database rows | unique IDs per test, transactions rolled back after each test |
| environment drift (versions, locale, time zone) | pinned versions, containers, `TZ=UTC`, hermetic builds (Bazel/Nix) |

- **Fixture:** the known starting state of a test (objects, data, files). Build it with **builders / factory functions** with sensible defaults (`make_order().with_qty(3)`).
- **Arrange–Act–Assert** structure keeps tests readable.
- Track flaky tests, quarantine **only temporarily**, and fix the root cause — a flaky test teaches people to ignore red builds.

#### Modern C++ example — a fake clock and a fixed seed make a time- and random-dependent feature deterministic
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <random>
#include <string>

class Clock { public: virtual ~Clock() = default; virtual long now_s() const = 0; };
class FakeClock : public Clock {
public:
    long now_s() const override { return t_; }
    void advance(long s) { t_ += s; }
private:
    long t_ = 1'700'000'000;
};

class OtpService {                                        // one-time codes valid for 300 s
public:
    OtpService(const Clock& c, std::mt19937& rng) : clock_(c), rng_(rng) {}
    std::string issue() {
        code_ = std::to_string(std::uniform_int_distribution<int>(100000, 999999)(rng_));
        issued_ = clock_.now_s();
        return code_;
    }
    bool verify(const std::string& c) const { return c == code_ && clock_.now_s() - issued_ < 300; }
private:
    const Clock& clock_; std::mt19937& rng_;
    std::string code_; long issued_ = 0;
};

struct Fixture {                                          // fresh, known state for every test
    FakeClock clock;
    std::mt19937 rng{12345};                              // fixed seed: same codes every run
    OtpService otp{clock, rng};
};

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    { Fixture f; auto code = f.otp.issue(); f.clock.advance(299); check(f.otp.verify(code), "code valid at 299 s"); }
    { Fixture f; auto code = f.otp.issue(); f.clock.advance(300); check(!f.otp.verify(code), "code expired at 300 s"); }
    { Fixture f; f.otp.issue(); check(!f.otp.verify("000000"), "wrong code rejected"); }
    { Fixture a, b; check(a.otp.issue() == b.otp.issue(), "same seed -> same code (repeatable)"); }
    std::cout << failures << " failure(s), no sleeping, same result on every run\n";
}
```

**Output:**
```text
PASS code valid at 299 s
PASS code expired at 300 s
PASS wrong code rejected
PASS same seed -> same code (repeatable)
0 failure(s), no sleeping, same result on every run
```

### Interview answer
"Every test builds its own fixture and cleans up, so tests pass in any order and in parallel. I remove nondeterminism by injecting a fake clock instead of sleeping, seeding random generators, synchronizing concurrent tests with latches instead of timing, and isolating external services. Environments are pinned and reproducible — containers, fixed versions, UTC — and flaky tests are tracked and root-caused rather than retried forever."

---

## 5. Testing pyramid vs. testing trophy; risk-based test selection

**In one sentence:** the **pyramid** says "many fast unit tests, fewer integration tests, very few E2E tests"; the **trophy** (Kent C. Dodds) puts the most weight on **integration tests** plus static analysis; either way, **choose tests by risk** — what's most likely to break and most costly if it does.

### In plain words
You can't inspect every brick of a building. You check the foundations and load-bearing walls carefully (high risk), spot-check the rest, and walk through the finished building once (E2E).

### How it works
```text
        Pyramid                     Trophy
          /\                         ___
         /E2E\                      (E2E)        small
        /------\                 /---------\
       /integr. \               |integration|    LARGEST
      /----------\               \---------/
     /    unit    \                 (unit)       medium
    /--------------\               [static]      base: types, linters
```
| | Pyramid | Trophy |
|---|---|---|
| Biggest layer | unit | integration |
| Good fit | libraries, algorithms, complex domain logic (C++/systems code) | apps/services where most bugs live in the wiring (web front-ends, CRUD APIs) |
| Base | — | static analysis: types, linters, sanitizers |

**Anti-pattern:** the **ice-cream cone** — mostly manual and E2E tests, few unit tests: slow, flaky, expensive.

**Risk-based test selection**
- **Risk = likelihood × impact.** Likelihood: complex code, frequent changes, past bugs, new developers. Impact: money, security, data loss, many users.
- Test **high-risk** areas deeply (payments, auth, data migrations, concurrency); test **low-risk** areas lightly.
- In CI, run **changed-area tests first** (test impact analysis), the full suite before merge or nightly.

#### Modern C++ example — ranking features by risk to decide where tests go
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Area { std::string name; int likelihood, impact; };   // each 1..5

int main() {
    std::vector<Area> areas{
        {"payment capture + refunds", 4, 5},
        {"login + password reset", 3, 5},
        {"order history page", 2, 2},
        {"CSV export", 3, 2},
        {"DB migration v12", 4, 4},
        {"footer links", 1, 1},
    };
    std::sort(areas.begin(), areas.end(), [](auto& a, auto& b) { return a.likelihood * a.impact > b.likelihood * b.impact; });
    std::cout << std::left;
    for (auto& a : areas) {
        int risk = a.likelihood * a.impact;
        const char* plan = risk >= 16 ? "unit + integration + E2E happy path + failure cases"
                         : risk >= 6  ? "unit + one integration test"
                                      : "smoke test only";
        std::cout << std::setw(28) << a.name << " risk " << std::setw(3) << risk << plan << '\n';
    }
}
```

**Output:**
```text
payment capture + refunds    risk 20 unit + integration + E2E happy path + failure cases
DB migration v12             risk 16 unit + integration + E2E happy path + failure cases
login + password reset       risk 15 unit + one integration test
CSV export                   risk 6  unit + one integration test
order history page           risk 4  smoke test only
footer links                 risk 1  smoke test only
```

### Interview answer
"The pyramid favours many fast unit tests and few slow E2E tests; the trophy shifts weight to integration tests on top of static analysis, because in service code many bugs are in the wiring. I pick the shape per codebase — algorithms lean pyramid, CRUD services lean trophy — and avoid the ice-cream cone. Within that, I spend testing effort by risk, likelihood times impact, so payments, auth and migrations get deep coverage and the footer gets a smoke test."

---

## 6. Unit, integration, end-to-end (E2E), and acceptance tests

**In one sentence:** **unit** tests check one small piece alone, **integration** tests check several pieces (or a piece + a real database/queue) together, **E2E** tests drive the whole system like a user, and **acceptance** tests confirm the system meets the **business requirement** — often written with the customer.

### In plain words
Building a car: test a spark plug on a bench (unit), test the engine with its fuel pump (integration), drive the finished car around the track (E2E), and let the customer test-drive it to say "yes, this is what I ordered" (acceptance).

### How it works
| Level | Scope | Speed | Doubles | Catches |
|---|---|---|---|---|
| **Unit** | one function / class | ms | for all external deps | logic bugs, edge cases |
| **Integration** | module + real DB / queue / HTTP between 2 services | 100 ms–s | for third parties only | wiring, SQL, serialization, config |
| **E2E** | the whole deployed system through its UI/API | s–min | none (or sandbox third parties) | broken user journeys |
| **Acceptance** | business scenarios ("Given/When/Then"), at any level | varies | varies | building the wrong thing |

- **Acceptance tests** are often written in **BDD** style (Cucumber/Gherkin, behave): `Given a cart with 2 items, When I apply code SAVE10, Then the total is 10% lower`. **UAT** (user acceptance testing) is the manual version done by users.
- Other names you'll hear: **smoke** tests (a quick "does it start?"), **regression** tests (old bugs stay fixed), **component** tests (one service with its dependencies faked), **contract** tests (see [Backend testing](./Backend-and-Distributed-System-Testing.md#1-api-contract-tests-schema-compatibility-and-consumer-driven-contracts)).

#### Modern C++ example — the same feature tested at unit, integration, E2E and acceptance level
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <sstream>
#include <string>

// ---- units ----
long apply_discount(long cents, const std::string& code) { return code == "SAVE10" ? cents - cents / 10 : cents; }

class CartRepository {                                    // "real" storage: serializes to text like a DB would
public:
    void save(const std::string& user, long cents) { rows_[user] = std::to_string(cents); }
    long load(const std::string& user) const { auto it = rows_.find(user); return it == rows_.end() ? 0 : std::stol(it->second); }
private:
    std::map<std::string, std::string> rows_;
};

class CartService {
public:
    explicit CartService(CartRepository& r) : repo_(r) {}
    void add(const std::string& user, long cents) { repo_.save(user, repo_.load(user) + cents); }
    long checkout(const std::string& user, const std::string& code) { return apply_discount(repo_.load(user), code); }
private:
    CartRepository& repo_;
};

// ---- the "whole system": a text API, like an HTTP endpoint ----
std::string handle(CartService& svc, const std::string& request) {
    std::istringstream in(request);
    std::string cmd, user, arg;
    in >> cmd >> user >> arg;
    if (cmd == "ADD") { svc.add(user, std::stol(arg)); return "200 OK"; }
    if (cmd == "CHECKOUT") return "200 TOTAL " + std::to_string(svc.checkout(user, arg));
    return "400 BAD REQUEST";
}

int failures = 0;
void check(bool ok, const char* name) { std::cout << (ok ? "PASS " : "FAIL ") << name << '\n'; failures += !ok; }

int main() {
    check(apply_discount(1000, "SAVE10") == 900 && apply_discount(1000, "BOGUS") == 1000, "unit: discount rule");

    CartRepository repo; CartService svc(repo);
    svc.add("ali", 300); svc.add("ali", 700);
    check(repo.load("ali") == 1000, "integration: service + repository persist the sum");

    CartRepository repo2; CartService system(repo2);
    check(handle(system, "ADD mona 2000") == "200 OK" && handle(system, "CHECKOUT mona SAVE10") == "200 TOTAL 1800"
          && handle(system, "DELETE mona x") == "400 BAD REQUEST", "e2e: API journey add -> checkout");

    // Acceptance (Given/When/Then): "A returning customer with code SAVE10 pays 10% less."
    CartRepository repo3; CartService shop(repo3);
    handle(shop, "ADD omar 5000");                                    // Given a cart worth 50.00
    std::string result = handle(shop, "CHECKOUT omar SAVE10");          // When they check out with SAVE10
    check(result == "200 TOTAL 4500", "acceptance: SAVE10 gives 10% off");   // Then they pay 45.00
    std::cout << failures << " failure(s)\n";
}
```

**Output:**
```text
PASS unit: discount rule
PASS integration: service + repository persist the sum
PASS e2e: API journey add -> checkout
PASS acceptance: SAVE10 gives 10% off
0 failure(s)
```

### Interview answer
"Unit tests check one function or class with its dependencies doubled — fast and precise. Integration tests check pieces together with real infrastructure like the database, which catches wiring, SQL and serialization bugs. E2E tests run user journeys through the deployed system — valuable but slow and flaky, so I keep few. Acceptance tests express business requirements as Given/When/Then scenarios and prove we built the right thing; they can run at any level."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Functional vs. non-functional | what it does vs. how well (latency, load, security, reliability) — make NFRs numbers |
| Stub / fake / spy / mock | canned answers / simple real impl / records calls / verifies expectations |
| Boundaries | double time, network, DB, vendors (via your adapter); not values or domain logic |
| Coverage | finds untested code; doesn't prove assertions; prefer branch; mutation score for quality |
| Isolation | own fixture per test, any order, fake clock, fixed seed, no sleeps, pinned environments |
| Flaky tests | root-cause them; quarantine only briefly |
| Pyramid vs. trophy | many unit / most integration; avoid the ice-cream cone |
| Risk-based | likelihood × impact decides depth |
| Levels | unit (ms) → integration (real infra) → E2E (whole system) → acceptance (business Given/When/Then) |
