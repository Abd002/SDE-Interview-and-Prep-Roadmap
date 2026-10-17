# Requirements and Domain Modeling — From a Vague Prompt to Classes

> **What you'll learn:** how to start a low-level design interview by **clarifying requirements and scope**, how to turn **use cases into classes and interactions**, how to find **entities, value objects, aggregates and invariants**, how to model **relationships, ownership, lifecycles and state transitions**, and how to leave **extension points without overengineering**. One running example (a library) is built step by step in C++.
>
> **Prerequisites:** [OOD Fundamentals](./OOD-Fundamentals.md).

## Table of Contents
1. [Clarify functional/non-functional requirements and scope](#1-clarify-functionalnon-functional-requirements-and-scope)
2. [Translate use cases into classes, interfaces, and interactions](#2-translate-use-cases-into-classes-interfaces-and-interactions)
3. [Identify entities, value objects, aggregates, and invariants](#3-identify-entities-value-objects-aggregates-and-invariants)
4. [Model relationships, ownership, object lifecycles, and state transitions](#4-model-relationships-ownership-object-lifecycles-and-state-transitions)
5. [Define extension points without overengineering](#5-define-extension-points-without-overengineering)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Clarify functional/non-functional requirements and scope

**In one sentence:** before drawing any class, spend the first 3–5 minutes turning the vague prompt ("design a library system") into a **short written list** of what the system must do (functional), how well it must do it (non-functional), and what is **out of scope**.

### In plain words
A builder asks "how many bedrooms, what budget, is there a garden?" before drawing plans. In an interview, the questions show you think like an engineer, and the answers keep you from designing the wrong thing.

### How it works
**Functional requirements** — verbs the system supports: "a member can borrow a book", "a member can reserve a book that's out", "the system charges a late fee".

**Non-functional requirements** for LLD (lighter than in system design):
- **Concurrency:** can two members borrow the last copy at the same time?
- **Scale inside one process:** how many items in memory? Does lookup need to be O(1)?
- **Extensibility:** which parts are likely to change (fee rules, item types, notification channels)?
- **Correctness:** which rules must never break (a copy can't be lent twice)?
- **Persistence and failures:** in memory only, or behind a repository?

**Good clarifying questions (pick 5–8, don't interrogate)**
| Area | Question |
|---|---|
| Actors | Who uses it — members, librarians, admins? |
| Core flows | What must work end to end in the time we have? |
| Rules | Limits (max 5 loans), durations (14 days), fees (per day, cap)? |
| Variants | Only books, or also DVDs/magazines? Different rules per type? |
| Concurrency | Many terminals at once? |
| Out of scope | Payments, search UI, authentication, multiple branches? |

Then **write it down** as a short list and confirm: "So the core is borrow, return, reserve and late fees for books; payment and auth are out of scope. OK?"

#### Modern C++ example — requirements written as executable checks
A neat interview trick: express the agreed rules as constants and asserts you'll satisfy. It makes the scope concrete.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Requirement { std::string id, text; bool in_scope; };

namespace rules {                                    // agreed numbers live in ONE place
constexpr int kMaxLoansPerMember = 5;
constexpr int kLoanDays = 14;
constexpr long kLateFeePerDayCents = 5'00;
constexpr long kLateFeeCapCents = 100'00;
}

int main() {
    std::vector<Requirement> reqs{
        {"F1", "Member borrows an available copy", true},
        {"F2", "Member returns a copy; late fee if overdue", true},
        {"F3", "Member reserves a title with no free copy; first in line gets it", true},
        {"N1", "Two terminals must never lend the same copy twice", true},
        {"N2", "Fee rules will change; keep them swappable", true},
        {"X1", "Online payment of fees", false},
        {"X2", "Login / authentication", false},
    };
    for (const auto& r : reqs) std::cout << (r.in_scope ? "[in]  " : "[out] ") << r.id << ' ' << r.text << '\n';
    std::cout << "limits: " << rules::kMaxLoansPerMember << " loans, " << rules::kLoanDays << " days, fee "
              << rules::kLateFeePerDayCents / 100 << "/day capped at " << rules::kLateFeeCapCents / 100 << '\n';
}
```

**Output:**
```text
[in]  F1 Member borrows an available copy
[in]  F2 Member returns a copy; late fee if overdue
[in]  F3 Member reserves a title with no free copy; first in line gets it
[in]  N1 Two terminals must never lend the same copy twice
[in]  N2 Fee rules will change; keep them swappable
[out] X1 Online payment of fees
[out] X2 Login / authentication
limits: 5 loans, 14 days, fee 5/day capped at 100
```

### Interview answer
"I start by listing actors and core use cases, the business rules with their numbers, the non-functional needs that matter in one process — concurrency, extensibility, correctness — and explicitly what's out of scope. I read the list back to the interviewer before designing, so we agree on what 'done' means for the next 40 minutes."

---

## 2. Translate use cases into classes, interfaces, and interactions

**In one sentence:** write each use case as a short sentence, then take **nouns → candidate classes**, **verbs → methods**, and walk the main flow step by step to decide **which object owns each step**.

### In plain words
"A **member** **borrows** a **copy** of a **book**." Nouns: member, copy, book. Verb: borrow. Now ask: who should know whether the copy is free? The copy. Who knows how many loans a member has? The member. Who coordinates the whole thing? A small service.

### How it works
1. **Use case → steps.** "Borrow: find the title → pick a free copy → check the member's limit → create a loan with a due date → mark the copy as lent."
2. **Noun/verb analysis.** Keep nouns that have **state or rules** (Member, Copy, Loan). Drop nouns that are just attributes (title name, date) or outside scope (Payment).
3. **Assign responsibilities (GRASP "Information Expert"):** the object that **has the data** does the work. `Copy` decides if it is available; `Member` checks its own loan limit.
4. **A thin service / use-case class** (`LendingService`) coordinates objects; it should contain the *flow*, not every rule.
5. **Interfaces at boundaries:** clock, storage, notifications — things that vary or need test doubles.
6. Sanity check with a **sequence of calls** (see [UML → sequence diagrams](./UML-and-Communication.md#3-sequence-diagrams-method-calls-boundaries-and-async-events)).

| Use-case sentence | Class / method |
|---|---|
| "member borrows a copy" | `LendingService::borrow(member, isbn)` |
| "a copy is free or lent" | `Copy::is_available()` |
| "a member can have at most 5 loans" | `Member::can_borrow()` |
| "a loan has a due date" | `Loan{copy, member, due}` |
| "today's date" | `Clock` interface (fake in tests) |

#### Modern C++ example — the borrow use case as classes and interactions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <vector>

class Clock { public: virtual ~Clock() = default; virtual int today() const = 0; };   // boundary
class FixedClock : public Clock { public: explicit FixedClock(int d) : d_(d) {} int today() const override { return d_; } int d_; };

struct Copy {
    std::string id, isbn;
    bool lent = false;
    bool is_available() const { return !lent; }               // expert: the copy knows its state
};
struct Member {
    std::string name;
    int active_loans = 0;
    bool can_borrow() const { return active_loans < 5; }      // expert: the member knows its limit
};
struct Loan { std::string copy_id, member; int due_day; };

class LendingService {                                        // coordinates the use case
public:
    explicit LendingService(const Clock& clock) : clock_(clock) {}
    void add_copy(Copy c) { copies_.push_back(std::move(c)); }
    std::optional<Loan> borrow(Member& m, const std::string& isbn) {
        if (!m.can_borrow()) return std::nullopt;
        for (auto& c : copies_)
            if (c.isbn == isbn && c.is_available()) {
                c.lent = true;
                ++m.active_loans;
                return Loan{c.id, m.name, clock_.today() + 14};
            }
        return std::nullopt;
    }
private:
    const Clock& clock_;
    std::vector<Copy> copies_;
};

int main() {
    FixedClock clock(100);
    LendingService lib(clock);
    lib.add_copy({"c1", "978-0134"});
    lib.add_copy({"c2", "978-0134"});
    Member ali{"ali"}, bea{"bea"}, chen{"chen"};
    for (Member* m : {&ali, &bea, &chen}) {
        auto loan = lib.borrow(*m, "978-0134");
        if (loan) std::cout << m->name << " borrowed " << loan->copy_id << ", due day " << loan->due_day << '\n';
        else std::cout << m->name << ": no copy available\n";
    }
}
```

**Output:**
```text
ali borrowed c1, due day 114
bea borrowed c2, due day 114
chen: no copy available
```

### Interview answer
"I write each use case as a sentence and a list of steps, pick nouns with state or rules as classes and verbs as methods, and give each step to the object that has the data. A thin service coordinates the flow, and things like time, storage and notifications sit behind interfaces. Then I walk the main scenario as a sequence of calls to check every step has an owner."

---

## 3. Identify entities, value objects, aggregates, and invariants

**In one sentence:** an **entity** has an **identity** that lasts (a member, an order), a **value object** is defined only by its **values** and is immutable (money, a date range, an email), an **aggregate** is a cluster of objects changed together through **one root**, and **invariants** are the rules that root guarantees are always true.

### In plain words
- **Entity:** you. Change your address, name or haircut — you're still the same person (same ID).
- **Value object:** a 100-pound note. Any 100-pound note is as good as another; you don't care *which* one.
- **Aggregate:** an order with its order lines. You never edit a line directly; you ask the order to add or remove lines, so the order can keep its total and limits right.
- **Invariant:** "an order's total equals the sum of its lines", "a copy is lent to at most one member".

### How it works
| | Entity | Value object |
|---|---|---|
| Equality | by ID | by all fields |
| Mutability | changes over time | **immutable** — create a new one instead |
| Examples | Member, Copy, Order, Account | Money, Isbn, Email, DateRange, Address |
| In C++ | class with an `id_` member, often non-copyable or shared by reference | small class with `operator==` (`= default`), validated in the constructor |

**Aggregates (from Domain-Driven Design, Eric Evans)**
- One **aggregate root** (e.g. `Order`) is the only entry point; outside code holds references to the root only.
- The root **enforces invariants** for everything inside it.
- One transaction / one lock usually covers **one aggregate**. Other aggregates are referenced **by ID**, not by pointer.
- Keep aggregates **small**: "Library" as one aggregate holding every book would make every change contend on one lock.

**Value objects remove whole classes of bugs:** a `Money` type can't be added to a different currency by accident; an `Isbn` type can't be confused with a member ID.

#### Modern C++ example — value objects, an entity and an aggregate root that guards invariants
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

class Money {                                              // value object: immutable, equal by value
public:
    Money(long cents, std::string currency) : cents_(cents), currency_(std::move(currency)) {
        if (cents_ < 0) throw std::invalid_argument("negative money");
    }
    Money operator+(const Money& o) const {
        if (o.currency_ != currency_) throw std::invalid_argument("currency mismatch");
        return Money(cents_ + o.cents_, currency_);
    }
    Money times(int n) const { return Money(cents_ * n, currency_); }
    bool operator==(const Money&) const = default;
    std::string str() const { return std::to_string(cents_ / 100) + "." + (cents_ % 100 < 10 ? "0" : "") + std::to_string(cents_ % 100) + " " + currency_; }
    long cents() const { return cents_; }
    const std::string& currency() const { return currency_; }
private:
    long cents_;
    std::string currency_;
};

struct OrderLine { std::string sku; Money unit; int qty; };

class Order {                                              // entity + aggregate root
public:
    explicit Order(std::string id) : id_(std::move(id)) {}
    void add_line(std::string sku, Money unit, int qty) {
        if (submitted_) throw std::logic_error("order already submitted");     // invariant 1
        if (qty <= 0 || qty > 10) throw std::invalid_argument("qty must be 1..10");   // invariant 2
        if (lines_.size() == 20) throw std::length_error("max 20 lines");     // invariant 3
        if (unit.currency() != "EGP") throw std::invalid_argument("currency mismatch");   // invariant 4
        lines_.push_back({std::move(sku), unit, qty});
    }
    Money total() const {                                  // always = sum of lines, never stored separately
        Money t(0, "EGP");
        for (const auto& l : lines_) t = t + l.unit.times(l.qty);
        return t;
    }
    void submit() { if (lines_.empty()) throw std::logic_error("empty order"); submitted_ = true; }
    const std::string& id() const { return id_; }          // identity
private:
    std::string id_;
    std::vector<OrderLine> lines_;                          // only reachable through the root
    bool submitted_ = false;
};

int main() {
    std::cout << std::boolalpha << "Money(5000,EGP) == Money(5000,EGP)? " << (Money(5000, "EGP") == Money(5000, "EGP")) << '\n';
    Order o("ORD-1");
    o.add_line("keyboard", Money(750'00, "EGP"), 1);
    o.add_line("cable", Money(45'50, "EGP"), 2);
    std::cout << o.id() << " total: " << o.total().str() << '\n';
    for (auto attempt : {0, 1, 2}) {
        try {
            if (attempt == 0) o.add_line("mouse", Money(10'00, "USD"), 1);
            if (attempt == 1) o.add_line("monitor", Money(3000'00, "EGP"), 11);
            if (attempt == 2) { o.submit(); o.add_line("late", Money(1'00, "EGP"), 1); }
        } catch (const std::exception& e) { std::cout << "rejected: " << e.what() << '\n'; }
    }
}
```

**Output:**
```text
Money(5000,EGP) == Money(5000,EGP)? true
ORD-1 total: 841.00 EGP
rejected: currency mismatch
rejected: qty must be 1..10
rejected: order already submitted
```

Every rejected change left the order untouched — the root checks the rules **before** changing anything.

### Interview answer
"Entities have identity and change over time; value objects like Money or Isbn are immutable and compared by value, and they remove whole bug classes. I group objects that must stay consistent together into an aggregate with one root that's the only entry point and enforces the invariants — like an order guaranteeing its total and line limits. Aggregates stay small and reference each other by ID, so one lock or transaction covers one aggregate."

---

## 4. Model relationships, ownership, object lifecycles, and state transitions

**In one sentence:** decide for every link between objects **how many** (1–1, 1–many, many–many), **who owns whom** (who creates and destroys), **how long** each object lives, and which **states** it moves through, with the **allowed transitions** written down explicitly.

### In plain words
A library copy is **owned** by the library (it's destroyed if the library is). A loan **refers** to a member but doesn't own them. A copy moves through states — *available → lent → returned → available*, or *lent → lost* — and some moves are illegal (*lost → lent*).

### How it works
**Relationships and ownership in C++**
| Relationship | Meaning | Typical C++ |
|---|---|---|
| **Composition** (owns, same lifetime) | Order owns OrderLines | member object or `std::unique_ptr` / `std::vector<T>` |
| **Aggregation** (uses, independent lifetime) | Loan refers to a Member | ID, reference, or raw non-owning pointer |
| **Shared ownership** (rare) | cached image used by many views | `std::shared_ptr` (+ `weak_ptr` to break cycles) |
| **Many-to-many** | members ↔ titles reserved | a separate object (`Reservation`) or map of IDs |

- **Prefer IDs across aggregates** — they survive serialization and avoid dangling pointers.
- **Lifecycle questions:** who creates it (factory/repository)? Can it be deleted while referenced? Is it archived instead (soft delete)?
- **State machine:** list states, events and the transition table; reject illegal transitions in **one** place. An `enum class` + a transition function (or the [State pattern](./Design-Patterns-in-Practice.md#10-state-pattern-for-workflow-transitions) when behaviour differs a lot per state).

#### Modern C++ example — ownership choices and a copy's state machine
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>
#include <vector>

enum class CopyState { Available, OnHold, Lent, Lost };
enum class Event { Hold, Lend, Return, ReportLost, Found };

const char* name(CopyState s) {
    switch (s) { case CopyState::Available: return "Available"; case CopyState::OnHold: return "OnHold";
                 case CopyState::Lent: return "Lent"; case CopyState::Lost: return "Lost"; }
    return "?";
}
const char* name(Event e) {
    switch (e) { case Event::Hold: return "Hold"; case Event::Lend: return "Lend"; case Event::Return: return "Return";
                 case Event::ReportLost: return "ReportLost"; case Event::Found: return "Found"; }
    return "?";
}

// The whole transition table in one place.
std::optional<CopyState> next(CopyState s, Event e) {
    static const std::map<std::pair<CopyState, Event>, CopyState> table{
        {{CopyState::Available, Event::Hold}, CopyState::OnHold},
        {{CopyState::Available, Event::Lend}, CopyState::Lent},
        {{CopyState::OnHold, Event::Lend}, CopyState::Lent},
        {{CopyState::Lent, Event::Return}, CopyState::Available},
        {{CopyState::Lent, Event::ReportLost}, CopyState::Lost},
        {{CopyState::Lost, Event::Found}, CopyState::Available},
    };
    auto it = table.find({s, e});
    if (it == table.end()) return std::nullopt;
    return it->second;
}

class Copy {
public:
    explicit Copy(std::string id) : id_(std::move(id)) {}
    bool apply(Event e) {
        auto n = next(state_, e);
        std::cout << id_ << ": " << name(state_) << " --" << name(e) << "--> " << (n ? name(*n) : "REJECTED") << '\n';
        if (n) state_ = *n;
        return n.has_value();
    }
private:
    std::string id_;
    CopyState state_ = CopyState::Available;
};

class Library {                                         // composition: owns its copies
public:
    Copy& add(std::string id) { return *copies_.emplace(id, std::make_unique<Copy>(id)).first->second; }
private:
    std::map<std::string, std::unique_ptr<Copy>> copies_;
};

struct Loan { std::string copy_id; std::string member_id; };   // aggregation by ID: owns nothing

int main() {
    Library lib;
    Copy& c = lib.add("c1");
    Loan loan{"c1", "m42"};
    std::cout << "loan refers to copy " << loan.copy_id << " and member " << loan.member_id << " by ID\n";
    for (Event e : {Event::Lend, Event::Lend, Event::ReportLost, Event::Lend, Event::Found, Event::Hold, Event::Lend, Event::Return})
        c.apply(e);
}
```

**Output:**
```text
loan refers to copy c1 and member m42 by ID
c1: Available --Lend--> Lent
c1: Lent --Lend--> REJECTED
c1: Lent --ReportLost--> Lost
c1: Lost --Lend--> REJECTED
c1: Lost --Found--> Available
c1: Available --Hold--> OnHold
c1: OnHold --Lend--> Lent
c1: Lent --Return--> Available
```

### Interview answer
"For each relationship I state multiplicity and ownership: composition for parts that live and die with the whole — `unique_ptr` or members — and plain IDs for references across aggregates, so nothing dangles. I think through who creates and deletes each object. For anything with a lifecycle I write the states and a transition table, and reject illegal transitions in one place; if behaviour differs a lot per state I'd move to the State pattern."

---

## 5. Define extension points without overengineering

**In one sentence:** add an abstraction (interface, strategy, hook) **only where the interviewer or the requirements say change is likely**, keep everything else concrete, and **say** where you'd extend later.

### In plain words
Put electrical sockets where you'll plug things in — near the desk and the TV — not every 30 cm along every wall. You can always add a socket later; ripping out a hundred unused ones is harder.

### How it works
- **Find real variation points from the requirements:** "fee rules will change" → `FeePolicy`. "We might add DVDs" → item type with per-type rules. "Notify by email now, SMS later" → `Notifier`.
- **Choose the lightest mechanism that works:**

| Need | Lightest tool |
|---|---|
| one varying rule | a function / `std::function` parameter |
| a family of related behaviours | a small interface (Strategy) |
| a closed set of types | `enum` or `std::variant` |
| plugins from outside | interface + registry/factory |
| configuration only | a constant or a config struct |

- **Don't:** add interfaces for every class, generic base classes "just in case", or plugin systems no one asked for.
- **Do:** keep the code **easy to change** — small classes, injected dependencies, one place for each rule — that's the real extension point.
- In the interview, **demonstrate** it: "Now let's add a weekend-free fee rule" and show it's one new class (see [Implementation and Review](./Implementation-and-Review.md#1-demonstrate-a-requirements-change-without-rewriting-the-design)).

#### Modern C++ example — one real extension point (fee policy), everything else concrete
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>

// The requirement said "fee rules will change" -> exactly one extension point.
using FeePolicy = std::function<long(int days_late)>;

FeePolicy per_day(long cents_per_day, long cap) {
    return [=](int days) { return std::min<long>(days * cents_per_day, cap); };
}
FeePolicy grace_period(int free_days, FeePolicy inner) {      // composes with others
    return [=](int days) { return inner(std::max(0, days - free_days)); };
}

class ReturnDesk {                                            // concrete; no speculative interfaces
public:
    explicit ReturnDesk(FeePolicy fee) : fee_(std::move(fee)) {}
    long late_fee(int due_day, int returned_day) const { return fee_(std::max(0, returned_day - due_day)); }
private:
    FeePolicy fee_;
};

int main() {
    ReturnDesk standard(per_day(5'00, 100'00));
    ReturnDesk students(grace_period(3, per_day(2'00, 30'00)));
    for (int late : {0, 2, 10, 40})
        std::cout << late << " days late: standard " << standard.late_fee(100, 100 + late) / 100
                  << ", student " << students.late_fee(100, 100 + late) / 100 << '\n';
}
```

**Output:**
```text
0 days late: standard 0, student 0
2 days late: standard 10, student 0
10 days late: standard 50, student 14
40 days late: standard 100, student 30
```

### Interview answer
"I add extension points only where the requirements point to change — here, fee rules — and use the lightest tool that works: a function or a small strategy interface. Everything else stays concrete, but small and dependency-injected, so it's still easy to change. I mention other likely extension points out loud instead of building them, and I show a requirements change landing as one new class or function."

---

## Cheat sheet

| Step | Remember |
|---|---|
| Clarify | actors, core use cases, rules with numbers, concurrency, extensibility, **out of scope**; read it back |
| Use cases → classes | nouns with state/rules → classes; verbs → methods; data owner does the work; thin coordinating service |
| Boundaries | clock, storage, notifications behind interfaces (testable) |
| Entity | identity; changes over time |
| Value object | immutable, equal by value, validated (Money, Isbn, Email) |
| Aggregate | cluster changed via one root; root enforces invariants; reference others by ID; keep small |
| Relationships | multiplicity + ownership: composition (`unique_ptr`/member), aggregation (ID/reference), rare `shared_ptr` |
| Lifecycle | who creates, who deletes, soft delete? |
| State machine | states + events + transition table in one place; reject illegal moves |
| Extension points | only where change is expected; lightest tool (function → strategy → plugin); say the rest out loud |
