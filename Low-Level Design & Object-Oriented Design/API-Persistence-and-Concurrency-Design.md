# API, Persistence, and Concurrency Design — Making Classes Safe to Call, Store and Share

> **What you'll learn:** how to layer **data access** and choose **transaction boundaries**, make operations **idempotent** so retries are safe, design **interface-first** with **stable contracts**, keep code **testable** with injection and fakes, make classes **thread-safe** (locks, immutability, atomics), and handle **validation, domain errors and failures** cleanly. Each part has a runnable C++ example.
>
> **Prerequisites:** [OOD Fundamentals](./OOD-Fundamentals.md), [Design Patterns in Practice](./Design-Patterns-in-Practice.md), [Thread Synchronization](../Operating%20Systems/Thread-Synchronization.md) and [Error Handling](../Programming%20Languages%20and%20Concepts/Error-Handling.md).

## Table of Contents
1. [Data access layering, repositories, and transaction boundaries](#1-data-access-layering-repositories-and-transaction-boundaries)
2. [Idempotent operations and safe retries in low-level APIs](#2-idempotent-operations-and-safe-retries-in-low-level-apis)
3. [Interface-first design and stable public contracts](#3-interface-first-design-and-stable-public-contracts)
4. [Testability: dependency injection, mocks, and interface contracts](#4-testability-dependency-injection-mocks-and-interface-contracts)
5. [Thread safety, synchronization, immutability, and race prevention](#5-thread-safety-synchronization-immutability-and-race-prevention)
6. [Validation, domain errors, exceptions, and failure handling](#6-validation-domain-errors-exceptions-and-failure-handling)
7. [Cheat sheet](#cheat-sheet)

---

## 1. Data access layering, repositories, and transaction boundaries

**In one sentence:** keep **business rules** in the domain/service layer, put **all storage code** behind repositories in a data-access layer, and draw the **transaction boundary around one use case** so it either fully happens or doesn't happen at all.

### In plain words
A bank teller (service) handles your transfer request. They don't walk into the vault (database) themselves; vault staff (repositories) do. And the teller treats "take from account A, add to account B" as **one** operation — if the second step fails, the first is undone.

### How it works
```text
API / controller  ->  validates input, maps HTTP <-> domain types
Service (use case) -> owns the transaction; calls domain objects and repositories
Domain objects     -> business rules and invariants (no SQL, no HTTP)
Repositories       -> load/save aggregates; the ONLY place that knows the database
```
- **Dependency direction points inward:** services depend on repository **interfaces**; SQL implementations depend on the domain, not the reverse (see [Layered Architecture](../System%20Architecture/Layered-Architecture.md)).
- **Transaction boundary = one use case**, opened in the service: `begin → load → change → save → commit`. Not per repository call (too small: partial updates) and not per HTTP session (too big: long locks).
- **Keep transactions short:** no network calls to third parties inside them; publish events **after** commit (or use an **outbox table** written in the same transaction).
- **Concurrency inside storage:** use **optimistic locking** (a `version` column: `UPDATE … WHERE id=? AND version=?`) or `SELECT … FOR UPDATE` for hot rows. See [Transactions and Isolation](../Databases/Transactions-and-Isolation.md).

#### Modern C++ example — a service-owned transaction with optimistic locking
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>

struct Account { std::string id; long balance; int version; };

class Database {                                       // stands in for SQL with transactions
public:
    void begin() { snapshot_ = rows_; in_tx_ = true; }
    void commit() { in_tx_ = false; }
    void rollback() { rows_ = snapshot_; in_tx_ = false; }
    std::map<std::string, Account> rows_;
private:
    std::map<std::string, Account> snapshot_;
    bool in_tx_ = false;
};

class AccountRepository {                              // the only class that touches rows
public:
    explicit AccountRepository(Database& db) : db_(db) {}
    Account load(const std::string& id) { return db_.rows_.at(id); }
    void save(const Account& a) {                      // UPDATE ... WHERE version = a.version
        Account& row = db_.rows_.at(a.id);
        if (row.version != a.version) throw std::runtime_error("concurrent update on " + a.id);
        row = {a.id, a.balance, a.version + 1};
    }
private:
    Database& db_;
};

class TransferService {                                // owns the transaction boundary
public:
    TransferService(Database& db, AccountRepository& repo) : db_(db), repo_(repo) {}
    bool transfer(const std::string& from, const std::string& to, long cents,
                  const std::function<void()>& simulate_other_writer = {}) {
        db_.begin();
        try {
            Account a = repo_.load(from), b = repo_.load(to);
            if (a.balance < cents) throw std::runtime_error("insufficient funds");
            a.balance -= cents; b.balance += cents;
            if (simulate_other_writer) simulate_other_writer();
            repo_.save(a);
            repo_.save(b);
            db_.commit();
            return true;
        } catch (const std::exception& e) {
            db_.rollback();
            std::cout << "  rolled back: " << e.what() << '\n';
            return false;
        }
    }
private:
    Database& db_;
    AccountRepository& repo_;
};

int main() {
    Database db;
    db.rows_ = {{"A", {"A", 100, 0}}, {"B", {"B", 0, 0}}};
    AccountRepository repo(db);
    TransferService svc(db, repo);
    std::cout << std::boolalpha;
    bool ok1 = svc.transfer("A", "B", 30);
    std::cout << "transfer 30: " << ok1 << '\n';
    bool ok2 = svc.transfer("A", "B", 500);
    std::cout << "transfer 500: " << ok2 << '\n';
    bool ok3 = svc.transfer("A", "B", 10, [&] { db.rows_["B"].version++; });
    std::cout << "transfer 10 with a concurrent writer on B: " << ok3 << '\n';
    std::cout << "A=" << db.rows_["A"].balance << " B=" << db.rows_["B"].balance << '\n';
}
```

**Output:**
```text
transfer 30: true
  rolled back: insufficient funds
transfer 500: false
  rolled back: concurrent update on B
transfer 10 with a concurrent writer on B: false
A=70 B=30
```

Note the third case: A was already saved when B's save failed, and the rollback undid it — that's why the boundary must wrap the **whole** use case.

### Interview answer
"I layer it as controller, service, domain and repositories: business rules live in the domain, SQL only in repositories behind interfaces, and the service owns one transaction per use case — begin, load, change, save, commit, or roll back on any failure. I keep transactions short, avoid external calls inside them, publish events after commit or through an outbox, and use optimistic locking with a version column to catch concurrent updates."

---

## 2. Idempotent operations and safe retries in low-level APIs

**In one sentence:** an operation is **idempotent** if doing it **twice has the same effect as doing it once**, which is what makes **retries after timeouts safe**; non-idempotent operations (charge, create order) are made safe with an **idempotency key** that the server remembers.

### In plain words
Pressing a lift button five times still calls the lift once — idempotent. Pressing "Pay" five times because the page was slow should **not** charge you five times. The fix: each payment attempt carries a unique ticket number; the server says "I've seen ticket #81 already, here's the same receipt".

### How it works
| Operation | Idempotent? | Why |
|---|---|---|
| `GET /orders/7` | ✅ | reads only |
| `PUT /users/7 {name: "Mona"}` | ✅ | sets a final state |
| `DELETE /orders/7` | ✅ | second delete finds nothing |
| `POST /payments` | ❌ | each call creates a new payment |
| `balance += 10` | ❌ | `balance = 110` (set) would be idempotent |

**Making a call idempotent**
1. Client generates an **idempotency key** (UUID) per logical operation and **reuses it on every retry**.
2. Server stores `key → result` (with a TTL, e.g. 24h). Same key again → return the **stored result**, don't execute again.
3. Store the key **in the same transaction** as the effect, or a crash between them breaks the guarantee.
4. Same key with a **different request body** → reject (it's a client bug).
5. Handle **in-flight duplicates** (two retries at once): lock or "insert key first, unique constraint".

**Safe retries:** retry only **transient** errors (timeouts, 503, connection reset), with **exponential backoff + jitter** and a **maximum** number of attempts; never retry validation errors. Message consumers need the same: at-least-once delivery means **dedupe by message ID**.

#### Modern C++ example — idempotency keys + retry with backoff over a flaky network
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>

struct Receipt { std::string payment_id; long cents; };

class PaymentServer {
public:
    Receipt charge(const std::string& idem_key, long cents) {
        if (auto it = seen_.find(idem_key); it != seen_.end()) {
            if (it->second.cents != cents) throw std::invalid_argument("key reused with different amount");
            std::cout << "  server: duplicate key " << idem_key << ", returning stored receipt\n";
            return it->second;
        }
        Receipt r{"pay_" + std::to_string(++counter_), cents};
        total_charged += cents;
        seen_[idem_key] = r;                         // same transaction as the charge in real life
        return r;
    }
    long total_charged = 0;
private:
    std::map<std::string, Receipt> seen_;
    int counter_ = 0;
};

class FlakyNetwork {                                 // loses the RESPONSE of the first 2 calls
public:
    explicit FlakyNetwork(PaymentServer& s) : s_(s) {}
    Receipt call(const std::string& key, long cents) {
        Receipt r = s_.charge(key, cents);           // the server DID process it...
        if (++calls_ <= 2) throw std::runtime_error("timeout");   // ...but the client never hears back
        return r;
    }
private:
    PaymentServer& s_;
    int calls_ = 0;
};

Receipt charge_with_retry(FlakyNetwork& net, const std::string& key, long cents, int max_attempts) {
    int backoff_ms = 100;
    for (int attempt = 1;; ++attempt) {
        try { return net.call(key, cents); }
        catch (const std::runtime_error& e) {
            if (attempt == max_attempts) throw;
            std::cout << "  client: attempt " << attempt << " " << e.what() << ", retry in " << backoff_ms << "ms (same key)\n";
            backoff_ms *= 2;                         // + random jitter in production
        }
    }
}

int main() {
    PaymentServer server;
    FlakyNetwork net(server);
    Receipt r = charge_with_retry(net, "order-81-attempt", 250'00, 5);
    std::cout << "client got " << r.payment_id << "; server charged in total " << server.total_charged / 100 << " EGP (once)\n";
    try { server.charge("order-81-attempt", 999'00); } catch (const std::exception& e) { std::cout << "rejected: " << e.what() << '\n'; }
}
```

**Output:**
```text
  client: attempt 1 timeout, retry in 100ms (same key)
  server: duplicate key order-81-attempt, returning stored receipt
  client: attempt 2 timeout, retry in 200ms (same key)
  server: duplicate key order-81-attempt, returning stored receipt
client got pay_1; server charged in total 250 EGP (once)
rejected: key reused with different amount
```

### Interview answer
"Idempotent means repeating the call has the same effect as doing it once — GET, PUT and DELETE are, POST and increments aren't. Since a timeout doesn't tell you whether the server acted, I make side-effecting calls idempotent with a client-generated key that's reused on every retry; the server stores key → result in the same transaction as the effect and returns the stored result for duplicates. Retries are limited to transient errors with exponential backoff and jitter."

---

## 3. Interface-first design and stable public contracts

**In one sentence:** design the **public interface** — names, inputs, outputs, errors, guarantees — **before** the implementation, keep it **small and hard to misuse**, and once others depend on it, evolve it **without breaking** them.

### In plain words
A power socket is a contract: shape, voltage, frequency. Power plants change all the time behind it, but your toaster keeps working. If the socket shape changed every year, every appliance would break.

### How it works
**Writing the contract first**
- Start from the **caller's code**: write how you want to *use* it, then design the class. ("What would the ideal call site look like?")
- Specify: **preconditions** (what the caller must ensure), **postconditions** (what you guarantee), **errors** (which, how reported), **thread safety**, **complexity**, **ownership** of returned objects.
- **Hard to misuse:** strong types (`Money`, `UserId`) instead of raw `long`/`string`; no boolean flag parameters (`send(msg, true, false)`); return values that can't be ignored (`[[nodiscard]]`); RAII for resources.
- **Small surface:** every public method is a promise you must keep forever.

**Keeping it stable**
- **Additive changes are safe:** new methods, new optional fields, new enum values (if callers handle unknown values).
- **Breaking changes:** removing/renaming, changing meaning, tightening preconditions, changing error behaviour. Ship them as **v2** alongside v1, **deprecate** (`[[deprecated]]`), migrate, then remove.
- In C++ libraries, ABI stability adds rules (no new virtual functions in the middle, **pImpl** to hide data members).

#### Modern C++ example — a contract that's hard to misuse, and non-breaking evolution
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <optional>
#include <string>

// Strong types: the compiler rejects swapped arguments.
struct UserId { long value; };
struct Email { std::string value; };
enum class Priority { Normal, High };                 // instead of a bare bool flag

struct SendOptions {                                  // new options can be added without breaking callers
    Priority priority = Priority::Normal;
    std::optional<std::chrono::seconds> delay = std::nullopt;
};

class Mailer {
public:
    /// Sends an email to a registered user.
    /// Pre: `to` belongs to a verified user. Post: queued exactly once.
    /// Errors: returns std::nullopt if the user is unknown. Thread-safe. O(1).
    [[nodiscard]] std::optional<std::string> send(UserId to, const std::string& subject, SendOptions opts = {}) {
        if (to.value <= 0) return std::nullopt;
        std::cout << "queued to user " << to.value << ": " << subject
                  << (opts.priority == Priority::High ? " [HIGH]" : "")
                  << (opts.delay ? " in " + std::to_string(opts.delay->count()) + "s" : "") << '\n';
        return "msg-" + std::to_string(++n_);
    }

    [[deprecated("use send(UserId, subject, SendOptions)")]]
    bool send_old(long user, const std::string& subject, bool urgent) {   // v1, kept during migration
        return send(UserId{user}, subject, {urgent ? Priority::High : Priority::Normal}).has_value();
    }
private:
    int n_ = 0;
};

int main() {
    Mailer m;
    auto id = m.send(UserId{7}, "Welcome");
    auto id2 = m.send(UserId{7}, "Password reset", {.priority = Priority::High});
    auto id3 = m.send(UserId{8}, "Weekly digest", {.delay = std::chrono::seconds(3600)});
    std::cout << *id << ' ' << *id2 << ' ' << *id3 << '\n';
    if (!m.send(UserId{-1}, "x")) std::cout << "unknown user handled explicitly\n";
    // m.send("Welcome", UserId{7});   // does not compile: arguments can't be swapped
}
```

**Output:**
```text
queued to user 7: Welcome
queued to user 7: Password reset [HIGH]
queued to user 8: Weekly digest in 3600s
msg-1 msg-2 msg-3
unknown user handled explicitly
```

### Interview answer
"I design the interface from the caller's side first and write down its contract — preconditions, guarantees, errors, thread safety, complexity. I make it hard to misuse with strong types, option structs instead of boolean flags, `[[nodiscard]]` and RAII, and I keep it small because every public method is a promise. Once published, I evolve it additively, deprecate before removing, and ship breaking changes as a new version side by side."

---

## 4. Testability: dependency injection, mocks, and interface contracts

**In one sentence:** code is testable when its **dependencies are injected** (so tests pass in **fakes, stubs or mocks**), its **outputs are observable**, and every implementation of an interface passes the same **contract tests**.

### In plain words
A car factory tests the engine on a test bench, not inside a car driving on a real highway. To do that, the engine must have standard connectors (interfaces) so the bench can plug in fake fuel lines and sensors.

### How it works
**Test doubles**
| Double | What it is | Use for |
|---|---|---|
| **Fake** | a working lightweight version (in-memory repository) | realistic behaviour without infrastructure |
| **Stub** | returns canned answers | forcing a path ("payment declined") |
| **Mock** | records calls and checks expectations | verifying an interaction happened ("email sent once") |
| **Spy** | real object + recording | checking calls without replacing behaviour |

- **Inject what's slow, random or external:** clock, random numbers, network, database, file system, environment variables.
- **Prefer fakes and state checks** over strict mocks — tests that assert every call break on harmless refactors.
- **Contract tests:** one test suite parameterized by implementation. Run it against `InMemoryRepo` *and* `SqlRepo` to prove the fake behaves like the real thing (Liskov in practice).
- Signs of untestable code: `static`/singleton access, `new` inside business logic, hidden time (`now()` calls), giant constructors doing work.
- C++ tools: GoogleTest + GoogleMock, Catch2, doctest. See [Testing Foundations](../Testing%2C%20Reliability%20%26%20Observability/Testing-Foundations.md).

#### Modern C++ example — fake, stub, mock, and one contract test run against two implementations
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>
#include <vector>

class KeyValueStore {                                       // interface + contract
public:
    virtual ~KeyValueStore() = default;
    virtual void put(const std::string& k, const std::string& v) = 0;
    virtual std::optional<std::string> get(const std::string& k) const = 0;
};
class MapStore : public KeyValueStore {                     // fake used in unit tests
public:
    void put(const std::string& k, const std::string& v) override { m_[k] = v; }
    std::optional<std::string> get(const std::string& k) const override { auto it = m_.find(k); if (it == m_.end()) return {}; return it->second; }
private:
    std::map<std::string, std::string> m_;
};
class VectorStore : public KeyValueStore {                  // "production" implementation
public:
    void put(const std::string& k, const std::string& v) override {
        for (auto& [key, val] : kv_) if (key == k) { val = v; return; }
        kv_.push_back({k, v});
    }
    std::optional<std::string> get(const std::string& k) const override { for (auto& [key, val] : kv_) if (key == k) return val; return {}; }
private:
    std::vector<std::pair<std::string, std::string>> kv_;
};

int failures = 0;
void check(bool ok, const std::string& what) { if (!ok) { ++failures; std::cout << "    FAIL " << what << '\n'; } }

void contract_tests(const std::string& name, const std::function<std::unique_ptr<KeyValueStore>()>& make) {
    auto s = make();
    check(!s->get("missing"), "missing key returns nullopt");
    s->put("a", "1"); check(s->get("a") == "1", "get returns what put stored");
    s->put("a", "2"); check(s->get("a") == "2", "put overwrites");
    std::cout << "  contract tests on " << name << ": " << (failures ? "FAILED" : "passed") << '\n';
}

// Code under test, with two injected dependencies.
class Mailer { public: virtual ~Mailer() = default; virtual void send(const std::string& to) = 0; };
class SignupService {
public:
    SignupService(KeyValueStore& users, Mailer& mail) : users_(users), mail_(mail) {}
    bool signup(const std::string& email) {
        if (users_.get(email)) return false;
        users_.put(email, "registered");
        mail_.send(email);
        return true;
    }
private:
    KeyValueStore& users_; Mailer& mail_;
};
class MockMailer : public Mailer {                          // mock: records interactions
public:
    void send(const std::string& to) override { calls.push_back(to); }
    std::vector<std::string> calls;
};

int main() {
    std::cout << "contract:\n";
    contract_tests("MapStore", [] { return std::make_unique<MapStore>(); });
    contract_tests("VectorStore", [] { return std::make_unique<VectorStore>(); });

    std::cout << "unit test SignupService:\n";
    MapStore users;                                          // fake
    users.put("taken@x.com", "registered");                  // stubbed state
    MockMailer mail;
    SignupService svc(users, mail);
    check(svc.signup("new@x.com"), "new user signs up");
    check(!svc.signup("taken@x.com"), "duplicate rejected");
    check(mail.calls == std::vector<std::string>{"new@x.com"}, "exactly one welcome email");
    std::cout << "  " << (failures ? "FAILED" : "all passed") << " (" << mail.calls.size() << " email sent)\n";
}
```

**Output:**
```text
contract:
  contract tests on MapStore: passed
  contract tests on VectorStore: passed
unit test SignupService:
  all passed (1 email sent)
```

### Interview answer
"I keep code testable by injecting anything slow, random or external — clock, storage, network — through interfaces, so tests can use fakes, stubs or mocks. I prefer fakes and checking resulting state, using mocks only for interactions that matter, like 'exactly one email'. And I write one contract test suite per interface and run it against both the fake and the real implementation, so the fake can't drift from reality."

---

## 5. Thread safety, synchronization, immutability, and race prevention

**In one sentence:** a class is **thread-safe** if concurrent calls can't corrupt it or break its invariants; you get there by **not sharing** mutable state, sharing only **immutable** data, or **synchronizing** every access with locks or atomics — and by making **check-then-act** sequences atomic.

### In plain words
Two people editing the same paper form at once will scribble over each other. Options: each gets their own copy (no sharing), they only read a printed notice (immutable), or they take turns with a "talking stick" (a lock).

### How it works
**Strategies, from simplest to hardest**
1. **Confinement:** each thread owns its data; communicate with messages/queues.
2. **Immutability:** objects that never change after construction are safe to share freely (`const` members, `std::shared_ptr<const T>` snapshots, copy-on-write).
3. **Locks:** `std::mutex` + `std::scoped_lock` around every access to shared state; `std::shared_mutex` for many readers / few writers.
4. **Atomics:** `std::atomic<T>` for single counters and flags; lock-free structures only when measured necessary.

**Race patterns to recognize**
| Race | Example | Fix |
|---|---|---|
| **Data race** | two threads `++count` | mutex or `std::atomic` |
| **Check-then-act** | `if (seat.free) seat.book()` | do check + act under **one** lock (or a compare-and-swap) |
| **Read-modify-write** | `balance = balance - x` | atomic operation or lock |
| **Escaping reference** | returning `const&` to guarded data | return a copy |
| **Deadlock** | two locks taken in different orders | `std::scoped_lock(a, b)` takes both safely; fixed lock order |

- **Lock granularity:** one lock per object is simple and usually enough; finer locks add speed and deadlock risk.
- **Never** call unknown code (callbacks, virtual methods of others) while holding a lock.
- Tools: **ThreadSanitizer** (`-fsanitize=thread`) finds data races at runtime.
- Classic LLD cases: booking the last seat or parking spot, rate limiters, caches, ID generators.

#### Modern C++ example — the "last seat" race, broken and fixed, plus an immutable snapshot
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <memory>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

class UnsafeSeat {                                 // check-then-act without a lock (racy)
public:
    bool book() {
        if (free_.load()) {                        // check...
            std::this_thread::yield();             // (widen the race window for the demo)
            free_.store(false);                    // ...then act: another thread may have booked in between
            return true;
        }
        return false;
    }
private:
    std::atomic<bool> free_{true};                 // atomic loads/stores don't make the SEQUENCE atomic
};

class SafeSeat {
public:
    bool book() {
        bool expected = true;
        return free_.compare_exchange_strong(expected, false);   // check + act in one atomic step
    }
private:
    std::atomic<bool> free_{true};
};

class Inventory {                                  // lock-protected state + immutable snapshots for readers
public:
    void add(const std::string& sku) {
        std::scoped_lock l(m_);
        auto next = std::make_shared<std::vector<std::string>>(*snapshot_);   // copy-on-write
        next->push_back(sku);
        snapshot_ = std::move(next);
    }
    std::shared_ptr<const std::vector<std::string>> snapshot() const { std::scoped_lock l(m_); return snapshot_; }
private:
    mutable std::mutex m_;
    std::shared_ptr<const std::vector<std::string>> snapshot_ = std::make_shared<std::vector<std::string>>();
};

template <class Seat>
int count_bookings(int rounds) {
    int double_booked = 0;
    for (int r = 0; r < rounds; ++r) {
        Seat seat;
        std::atomic<int> wins{0};
        {
            std::vector<std::jthread> users;
            for (int u = 0; u < 4; ++u) users.emplace_back([&] { if (seat.book()) ++wins; });
        }
        if (wins > 1) ++double_booked;
    }
    return double_booked;
}

int main() {
    std::cout << "unsafe seat: double-booked in some rounds? " << std::boolalpha << (count_bookings<UnsafeSeat>(2000) > 0) << '\n';
    std::cout << "safe seat:   double-booked rounds = " << count_bookings<SafeSeat>(2000) << '\n';

    Inventory inv;
    inv.add("kbd");
    auto before = inv.snapshot();                  // readers keep a consistent view, no lock held
    inv.add("mouse");
    std::cout << "old snapshot size " << before->size() << ", new snapshot size " << inv.snapshot()->size() << '\n';
}
```

**Output:**
```text
unsafe seat: double-booked in some rounds? true
safe seat:   double-booked rounds = 0
old snapshot size 1, new snapshot size 2
```

The unsafe result depends on thread timing; on most machines a few of the 2,000 rounds double-book. The safe version can never double-book.

### Interview answer
"I first try not to share mutable state at all — confinement or immutable snapshots — and otherwise protect each object's state with one mutex or use atomics for simple flags and counters. The classic bug is check-then-act, like booking the last seat: atomic reads don't help unless the check and the update happen in one critical section or one compare-and-swap. I avoid calling unknown code under a lock, take multiple locks with `std::scoped_lock` or a fixed order, and run tests under ThreadSanitizer."

---

## 6. Validation, domain errors, exceptions, and failure handling

**In one sentence:** **validate at the boundary**, express **expected business failures** as explicit **domain errors** (a result type or specific exception types), reserve exceptions/crashes for **bugs and truly exceptional** conditions, and decide for each failure whether to **retry, compensate, report or stop**.

### In plain words
A bank form: obvious mistakes (empty name, letters in the amount field) are caught at the counter (validation). "Insufficient funds" isn't a bug — it's a normal answer the teller must explain (domain error). The vault door jamming is unexpected (exception) — call maintenance.

### How it works
| Kind | Example | How to report | Caller does |
|---|---|---|---|
| **Invalid input** | negative quantity, malformed email | reject at the boundary (constructor / API layer) with a clear message | fix the request (HTTP 400) |
| **Domain rule failure** | insufficient funds, seat taken, loan limit | `std::expected<T, DomainError>` or a typed exception | show the user, choose another option (409/422) |
| **Transient infrastructure** | timeout, DB deadlock | exception / error code marked **retryable** | retry with backoff |
| **Bug / broken invariant** | null where impossible, index out of range | `assert`, `std::logic_error`, crash fast | fix the code |

- **Parse, don't validate:** convert raw input into **types that can only hold valid values** (`Email::parse(s)` returns `std::expected<Email, Error>`). After that, the rest of the code never re-checks.
- **Fail fast** on broken invariants; **fail safe** for users (clear message, no partial state — see transaction boundaries).
- **Don't swallow errors** (`catch (...) {}`); log with context once, at the layer that handles them.
- **Exception safety** in C++: basic (no leaks, valid state), strong (commit-or-rollback), nothrow — see [Error Handling → Exception safety](../Programming%20Languages%20and%20Concepts/Error-Handling.md#3-exception-safety).
- C++23 has `std::expected`; with C++20 use a small `Result` type or `tl::expected`.

#### Modern C++ example — parse at the boundary, domain errors as values, exceptions for bugs
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>
#include <variant>

enum class Error { InvalidEmail, InvalidAmount, InsufficientFunds, AccountFrozen };
const char* message(Error e) {
    switch (e) {
        case Error::InvalidEmail: return "invalid email";
        case Error::InvalidAmount: return "amount must be positive";
        case Error::InsufficientFunds: return "insufficient funds";
        case Error::AccountFrozen: return "account is frozen";
    }
    return "?";
}

template <class T>
class Result {                                         // tiny std::expected stand-in for C++20
public:
    Result(T v) : v_(std::move(v)) {}
    Result(Error e) : v_(e) {}
    bool ok() const { return std::holds_alternative<T>(v_); }
    const T& value() const { return std::get<T>(v_); }
    Error error() const { return std::get<Error>(v_); }
private:
    std::variant<T, Error> v_;
};

class Email {                                          // "parse, don't validate"
public:
    static Result<Email> parse(const std::string& s) {
        auto at = s.find('@');
        if (at == std::string::npos || at == 0 || s.find('.', at) == std::string::npos) return Error::InvalidEmail;
        return Email(s);
    }
    const std::string& str() const { return s_; }
private:
    explicit Email(std::string s) : s_(std::move(s)) {}
    std::string s_;
};

class Wallet {
public:
    Wallet(Email owner, long cents) : owner_(std::move(owner)), cents_(cents) {}
    Result<long> pay(long cents) {
        if (cents <= 0) return Error::InvalidAmount;               // invalid input
        if (frozen_) return Error::AccountFrozen;                  // domain rule
        if (cents > cents_) return Error::InsufficientFunds;       // domain rule
        cents_ -= cents;
        if (cents_ < 0) throw std::logic_error("invariant broken: negative balance");   // bug -> fail fast
        return cents_;
    }
    void freeze() { frozen_ = true; }
private:
    Email owner_;
    long cents_;
    bool frozen_ = false;
};

int main() {
    for (std::string raw : {"mona@example.com", "not-an-email"}) {
        auto e = Email::parse(raw);
        std::cout << raw << " -> " << (e.ok() ? "ok" : message(e.error())) << '\n';
    }
    Wallet w(Email::parse("mona@example.com").value(), 100'00);
    for (long amount : {30'00L, -5L, 500'00L}) {
        auto r = w.pay(amount);
        if (r.ok()) std::cout << "paid " << amount / 100 << ", left " << r.value() / 100 << '\n';
        else std::cout << "pay " << amount / 100 << " failed: " << message(r.error()) << '\n';
    }
    w.freeze();
    auto r = w.pay(1'00);
    std::cout << "after freeze: " << (r.ok() ? "paid" : message(r.error())) << '\n';
}
```

**Output:**
```text
mona@example.com -> ok
not-an-email -> invalid email
paid 30, left 70
pay 0 failed: amount must be positive
pay 500 failed: insufficient funds
after freeze: account is frozen
```

### Interview answer
"I validate at the boundary by parsing raw input into types that can only hold valid values, so the core never re-checks. Expected business failures — insufficient funds, seat taken — are explicit domain errors, returned as a result type or typed exceptions, so callers must handle them. Transient infrastructure errors are marked retryable, and broken invariants fail fast because they're bugs. Combined with transactions, a failure never leaves partial state."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Layering | controller → service (transaction) → domain (rules) → repository (storage); dependencies point inward |
| Transaction boundary | one use case; short; no external calls inside; events after commit / outbox |
| Optimistic locking | `version` column; `UPDATE … WHERE version = ?`; retry on conflict |
| Idempotent | same effect once or many times: GET/PUT/DELETE yes, POST/increment no |
| Idempotency key | client-generated, reused on retries; server stores key → result atomically with the effect |
| Retries | transient errors only; exponential backoff + jitter; max attempts |
| Interface-first | write the call site first; contract = pre/post/errors/threading/complexity |
| Hard to misuse | strong types, option structs, `[[nodiscard]]`, RAII |
| Stability | additive changes; deprecate → migrate → remove; v2 side by side |
| Testability | inject clock/storage/network; fakes > strict mocks; contract tests for every implementation |
| Thread safety | confine → immutable → lock → atomic; check-then-act must be one atomic step; TSan |
| Errors | validate at the boundary (parse, don't validate); domain errors explicit; retry transient; fail fast on bugs |
