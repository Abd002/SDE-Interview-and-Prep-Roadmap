# Implementation and Review — Writing, Changing and Defending LLD Code in an Interview

> **What you'll learn:** how to **write compilable, testable code** for a scoped LLD problem in 30–40 minutes, how to **review edge cases, invariants and failure behaviour**, how to **discuss complexity, extensibility and maintainability**, and how to **absorb a requirements change** without rewriting the design. One running example — a **meeting-room booking system** — is built, reviewed and changed in C++.
>
> **Prerequisites:** [Requirements and Domain Modeling](./Requirements-and-Domain-Modeling.md), [API, Persistence, and Concurrency Design](./API-Persistence-and-Concurrency-Design.md).

## Table of Contents
1. [Demonstrate a requirements change without rewriting the design](#1-demonstrate-a-requirements-change-without-rewriting-the-design)
2. [Discuss complexity, extensibility, and maintainability trade-offs](#2-discuss-complexity-extensibility-and-maintainability-trade-offs)
3. [Review edge cases, invariants, and failure behavior](#3-review-edge-cases-invariants-and-failure-behavior)
4. [Write compilable, testable code for a scoped LLD problem](#4-write-compilable-testable-code-for-a-scoped-lld-problem)
5. [Cheat sheet](#cheat-sheet)

The sections are in checklist order; if you're practising, read **4 → 3 → 2 → 1** — that's the order they happen in an interview.

---

## 1. Demonstrate a requirements change without rewriting the design

**In one sentence:** when the interviewer says "now also support X", show that the change lands in **one new class or one small, local edit** behind an existing seam, and that **the old tests still pass** — that's the proof your design was good.

### In plain words
A good kitchen lets you add a dishwasher by plugging it into the existing water and power points. A bad kitchen needs the walls torn down. Interviewers add a requirement precisely to see which kitchen you built.

### How it works
1. **Restate the change** and how it affects the model: "Rooms can now have a booking rule — e.g. the boardroom needs approval and max 2 hours."
2. **Name where it lands:** "That's a new `BookingRule` interface checked in `BookingService::book`. Rooms, bookings and conflict detection don't change."
3. **Implement only that**, keeping existing behaviour as the default (the "no rule" case).
4. **Re-run the old tests** and add one for the new behaviour.
5. If the change **doesn't fit** — say so honestly and refactor the seam first ("make the change easy, then make the easy change" — Kent Beck).

Typical follow-up changes: new item types, new pricing/fee rules, new notification channels, concurrency ("now multiple terminals"), persistence ("now store it in a DB"), limits ("max 3 bookings per person per day").

#### Modern C++ example — adding booking rules to the room system from section 4
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>
#include <vector>

struct Booking { std::string room, who; int start, end; };            // minutes from midnight, [start, end)

// --- NEW: the seam added for the requirement change ---
class BookingRule {
public:
    virtual ~BookingRule() = default;
    virtual std::optional<std::string> check(const Booking& b) const = 0;   // error message or nullopt
};
class MaxDuration : public BookingRule {
public:
    explicit MaxDuration(int minutes) : max_(minutes) {}
    std::optional<std::string> check(const Booking& b) const override {
        if (b.end - b.start > max_) return "longer than " + std::to_string(max_) + " minutes";
        return std::nullopt;
    }
private:
    int max_;
};
class BusinessHours : public BookingRule {
public:
    std::optional<std::string> check(const Booking& b) const override {
        if (b.start < 9 * 60 || b.end > 18 * 60) return "outside 09:00-18:00";
        return std::nullopt;
    }
};

// --- UNCHANGED core, plus one loop over rules ---
class BookingService {
public:
    void add_room(const std::string& room, std::vector<std::shared_ptr<BookingRule>> rules = {}) { rules_[room] = std::move(rules); }
    std::optional<std::string> book(const Booking& b) {
        if (b.start >= b.end) return "empty or negative interval";
        if (!rules_.count(b.room)) return "unknown room";
        for (const auto& rule : rules_[b.room])                             // the only edit in book()
            if (auto err = rule->check(b)) return err;
        for (const auto& x : bookings_)
            if (x.room == b.room && b.start < x.end && x.start < b.end) return "overlaps " + x.who;
        bookings_.push_back(b);
        return std::nullopt;
    }
private:
    std::map<std::string, std::vector<std::shared_ptr<BookingRule>>> rules_;
    std::vector<Booking> bookings_;
};

int main() {
    BookingService svc;
    svc.add_room("nile");                                                    // old behaviour: no rules
    svc.add_room("board", {std::make_shared<BusinessHours>(), std::make_shared<MaxDuration>(120)});
    auto show = [&](const Booking& b) {
        auto err = svc.book(b);
        std::cout << b.room << ' ' << b.who << ' ' << b.start / 60 << ':' << (b.start % 60 < 10 ? "0" : "") << b.start % 60
                  << " -> " << (err ? "rejected: " + *err : "booked") << '\n';
    };
    show({"nile", "ali", 7 * 60, 11 * 60});                                  // unaffected by the new rules
    show({"board", "bea", 8 * 60, 9 * 60});
    show({"board", "bea", 10 * 60, 13 * 60});
    show({"board", "bea", 10 * 60, 11 * 60 + 30});
}
```

**Output:**
```text
nile ali 7:00 -> booked
board bea 8:00 -> rejected: outside 09:00-18:00
board bea 10:00 -> rejected: longer than 120 minutes
board bea 10:00 -> booked
```

### Interview answer
"I restate the new requirement, say exactly which class absorbs it and what stays untouched, implement just that behind an existing or new seam with the old behaviour as the default, and show the old tests still pass plus a new one. If the design doesn't have a natural place for it, I say so and do a small refactor first rather than bolting on a special case."

---

## 2. Discuss complexity, extensibility, and maintainability trade-offs

**In one sentence:** for your design, be ready to state the **time and space cost** of each main operation, **what's easy and what's hard to change**, and **why this is maintainable** — and to name a better structure if the scale or requirements grow.

### In plain words
Like explaining your house plan: "the kitchen is close to the dining room, so serving is fast (complexity); there's space to add a room later (extensibility); every pipe is labelled and reachable (maintainability)."

### How it works
**Complexity** — state it per operation and per data structure:
| Booking-system operation | Simple version (vector) | Better version (map of intervals per room) |
|---|---|---|
| book (conflict check) | O(total bookings) | O(log k) per room (k = bookings in that room) |
| cancel | O(n) | O(log k) |
| free slots in a day | O(n log n) (sort) | O(k) walk in order |
| memory | O(n) | O(n) |

**Extensibility** — where are the seams? (rules, notifiers, storage). What change would hurt? (e.g. "recurring meetings" changes the booking model itself — say so.)

**Maintainability** — small classes with one job, clear names, invariants enforced in one place, tests that document behaviour, no hidden global state, dependencies injected.

**Typical trade-off sentences**
- "I used a vector for simplicity; at 10k bookings I'd switch to a per-room `std::map` keyed by start time for O(log n) conflict checks."
- "Rules are a strategy list — easy to add rules, but the order of checks now matters; I'd document it."
- "One mutex around the service is simple and correct; if contention shows up, lock per room."

#### Modern C++ example — the conflict check at O(n) and at O(log k), measured
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <iterator>
#include <map>
#include <vector>

struct Interval { int start, end; };

class LinearRoom {                                        // simple: scan all bookings
public:
    bool book(Interval b) {
        for (const auto& x : v_) if (b.start < x.end && x.start < b.end) return false;
        v_.push_back(b); return true;
    }
private:
    std::vector<Interval> v_;
};

class TreeRoom {                                          // non-overlapping intervals keyed by start
public:
    bool book(Interval b) {
        auto next = m_.lower_bound(b.start);                              // first booking starting at/after b.start
        if (next != m_.end() && next->first < b.end) return false;        // overlaps the next one
        if (next != m_.begin() && std::prev(next)->second > b.start) return false;   // overlaps the previous one
        m_.emplace(b.start, b.end); return true;
    }
private:
    std::map<int, int> m_;                                // start -> end
};

template <class Room>
double run_ms(int n, int& booked) {
    Room r; booked = 0;
    auto t0 = std::chrono::steady_clock::now();
    for (int i = 0; i < n; ++i) booked += r.book({(i * 7919) % (n * 10) * 10, (i * 7919) % (n * 10) * 10 + 5});
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count();
}

int main() {
    const int n = 20000;
    int a = 0, b = 0;
    double linear = run_ms<LinearRoom>(n, a), tree = run_ms<TreeRoom>(n, b);
    std::cout << "same answers: " << std::boolalpha << (a == b) << " (" << a << " booked)\n";
    std::cout << "tree version is faster: " << (tree < linear) << '\n';
}
```

**Output:**
```text
same answers: true (20000 booked)
tree version is faster: true
```

(On a typical laptop the linear version takes hundreds of milliseconds here and the tree version a few milliseconds — the gap grows with n.)

### Interview answer
"I state the cost of each main operation — here a linear conflict scan is O(n), and a per-room ordered map makes it O(log k) — and I say at what scale I'd switch. I point out the seams that make likely changes cheap and the changes that would hurt, like recurring bookings changing the model itself. For maintainability I rely on small single-purpose classes, invariants in one place, injected dependencies and tests that document behaviour."

---

## 3. Review edge cases, invariants, and failure behavior

**In one sentence:** before saying "done", **walk through your own code like a reviewer**: list the **invariants** it must keep, try the **edge cases** (empty, boundary, duplicate, huge, concurrent), and state what happens on **every failure** — then add tests for the ones that matter.

### In plain words
Before handing in an exam, you re-read each answer and ask "what if the number is zero? what if the list is empty?" Interviewers notice candidates who find their own bugs.

### How it works
**Edge-case checklist for LLD**
| Category | Booking-system examples |
|---|---|
| Empty / zero | zero-length booking, no rooms, cancel when nothing is booked |
| Boundaries | booking ending exactly when another starts (`[9,10)` and `[10,11)` must **both** be allowed), midnight, max duration exactly |
| Invalid input | end before start, unknown room, negative times |
| Duplicates | same booking twice, double cancel |
| Limits | max bookings per person, overflow of IDs |
| Concurrency | two people booking the same slot at the same moment |
| Failure mid-operation | notifier throws after the booking was saved — is the booking kept? |

**Invariants** to state and enforce: "no two bookings in one room overlap", "every booking has start < end", "a cancelled booking frees its slot".

**Failure behaviour** to decide explicitly: reject with an error (and which one), retry, or keep partial work? E.g. "if the email fails, the booking stays and we retry the email later" — the booking is the source of truth.

#### Modern C++ example — edge-case tests against the booking service
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <string>
#include <thread>
#include <vector>

struct Booking { std::string room, who; int start, end; };

class BookingService {
public:
    explicit BookingService(std::vector<std::string> rooms) { for (auto& r : rooms) rooms_[r]; }
    std::optional<std::string> book(const Booking& b) {
        if (b.start < 0 || b.start >= b.end) return "invalid interval";
        std::scoped_lock l(m_);                                        // check + insert atomically
        auto it = rooms_.find(b.room);
        if (it == rooms_.end()) return "unknown room";
        for (const auto& x : it->second) if (b.start < x.end && x.start < b.end) return "overlap";
        it->second.push_back(b);
        return std::nullopt;
    }
    bool cancel(const std::string& room, int start) {
        std::scoped_lock l(m_);
        auto& v = rooms_[room];
        for (auto i = v.begin(); i != v.end(); ++i) if (i->start == start) { v.erase(i); return true; }
        return false;
    }
private:
    std::mutex m_;
    std::map<std::string, std::vector<Booking>> rooms_;
};

int passed = 0, failed = 0;
void expect(bool ok, const char* name) { (ok ? passed : failed)++; if (!ok) std::cout << "FAIL: " << name << '\n'; }

int main() {
    BookingService s({"nile"});
    expect(!s.book({"nile", "a", 540, 600}), "normal booking");
    expect(!s.book({"nile", "b", 600, 660}), "back-to-back booking is allowed ([9,10) then [10,11))");
    expect(s.book({"nile", "c", 599, 601}) == "overlap", "one-minute overlap rejected");
    expect(s.book({"nile", "d", 700, 700}) == "invalid interval", "zero-length rejected");
    expect(s.book({"nile", "e", 800, 700}) == "invalid interval", "end before start rejected");
    expect(s.book({"tigris", "f", 540, 600}) == "unknown room", "unknown room rejected");
    expect(s.cancel("nile", 540), "cancel existing");
    expect(!s.cancel("nile", 540), "double cancel is a no-op");
    expect(!s.book({"nile", "g", 540, 600}), "cancelled slot can be rebooked");

    std::atomic<int> wins{0};                                         // concurrency: 8 people, 1 slot
    {
        std::vector<std::jthread> users;
        for (int i = 0; i < 8; ++i) users.emplace_back([&] { if (!s.book({"nile", "x", 900, 960})) ++wins; });
    }
    expect(wins == 1, "exactly one concurrent booking wins");
    std::cout << passed << " passed, " << failed << " failed\n";
}
```

**Output:**
```text
10 passed, 0 failed
```

### Interview answer
"Before calling it done I state the invariants — no overlaps, start before end — and walk the edge cases out loud: empty and zero-length inputs, exact boundaries like back-to-back bookings, invalid and unknown inputs, duplicates and double cancels, limits, and two users racing for one slot. For each failure I say what the system does, and I turn the important ones into quick tests."

---

## 4. Write compilable, testable code for a scoped LLD problem

**In one sentence:** in 30–40 minutes, write **a small, complete, compiling core** — domain types, one service with the main use cases, injected boundaries — plus a `main` or a few tests that **exercise it**, instead of a huge skeleton with empty methods.

### In plain words
A working bicycle beats a half-built car. Interviewers want to see that you can turn a design into real code that runs and can be tested — not just boxes on a whiteboard.

### How it works
**A time plan for a 45-minute LLD round**
| Minutes | Do |
|---|---|
| 0–5 | clarify requirements and scope ([how](./Requirements-and-Domain-Modeling.md#1-clarify-functionalnon-functional-requirements-and-scope)) |
| 5–12 | entities, relationships, key interfaces (quick class diagram) |
| 12–35 | code the core: types → service → main use cases → a few checks |
| 35–40 | review edge cases and failure behaviour |
| 40–45 | complexity, extensibility; absorb the follow-up change |

**Coding habits that score well**
- **Start from types**: value objects and entities with invariants in constructors.
- **One service** per main use case group; **inject** clock, storage and notifiers as interfaces.
- **Compile early, compile often** (or "mentally compile" on a whiteboard): includes, `const`, ownership (`unique_ptr` vs. references).
- **Return explicit results** (`std::optional`/`expected`/error enum) for expected failures.
- **Show it running**: a `main` with the main scenario and a couple of edge cases, or 3–5 asserts.
- **Skip** getters/setters noise, logging frameworks, persistence code — mention them instead.
- **Name things after the domain** (`book`, `cancel`, `Room`), not technical noise (`Manager`, `process`).

#### Modern C++ example — a complete, testable meeting-room booking core
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>
#include <variant>
#include <vector>

// ---------- Domain types ----------
class TimeSlot {                                            // value object, [start, end) in minutes
public:
    TimeSlot(int start, int end) : start_(start), end_(end) {
        if (start < 0 || end > 24 * 60 || start >= end) throw std::invalid_argument("bad slot");
    }
    bool overlaps(const TimeSlot& o) const { return start_ < o.end_ && o.start_ < end_; }
    int start() const { return start_; }
    int end() const { return end_; }
private:
    int start_, end_;
};

struct Booking { int id; std::string room; std::string user; TimeSlot slot; };
enum class BookError { UnknownRoom, Conflict, TooManyForUser };

// ---------- Boundary (injected) ----------
class Notifier { public: virtual ~Notifier() = default; virtual void booked(const Booking&) = 0; };

// ---------- Service ----------
class BookingService {
public:
    BookingService(Notifier& n, int max_per_user) : notifier_(n), max_per_user_(max_per_user) {}
    void add_room(const std::string& name, int capacity) { capacity_[name] = capacity; }

    std::variant<int, BookError> book(const std::string& room, const std::string& user, TimeSlot slot) {
        if (!capacity_.count(room)) return BookError::UnknownRoom;
        auto& list = by_room_[room];
        if (std::any_of(list.begin(), list.end(), [&](const Booking& b) { return b.slot.overlaps(slot); })) return BookError::Conflict;
        if (count_for(user) >= max_per_user_) return BookError::TooManyForUser;
        list.push_back({next_id_, room, user, slot});
        notifier_.booked(list.back());
        return next_id_++;
    }
    bool cancel(int id) {
        for (auto& [room, list] : by_room_) {
            auto it = std::find_if(list.begin(), list.end(), [&](const Booking& b) { return b.id == id; });
            if (it != list.end()) { list.erase(it); return true; }
        }
        return false;
    }
    std::vector<TimeSlot> free_slots(const std::string& room, int day_start, int day_end) const {
        std::vector<TimeSlot> busy;
        if (auto it = by_room_.find(room); it != by_room_.end()) for (auto& b : it->second) busy.push_back(b.slot);
        std::sort(busy.begin(), busy.end(), [](auto& a, auto& b) { return a.start() < b.start(); });
        std::vector<TimeSlot> free;
        int t = day_start;
        for (auto& s : busy) { if (s.start() > t) free.emplace_back(t, s.start()); t = std::max(t, s.end()); }
        if (t < day_end) free.emplace_back(t, day_end);
        return free;
    }
    std::vector<std::string> rooms_with_capacity(int people) const {
        std::vector<std::string> out;
        for (auto& [name, cap] : capacity_) if (cap >= people) out.push_back(name);
        return out;
    }
private:
    int count_for(const std::string& user) const {
        int n = 0;
        for (auto& [r, list] : by_room_) n += static_cast<int>(std::count_if(list.begin(), list.end(), [&](auto& b) { return b.user == user; }));
        return n;
    }
    Notifier& notifier_;
    int max_per_user_;
    std::map<std::string, int> capacity_;
    std::map<std::string, std::vector<Booking>> by_room_;
    int next_id_ = 1;
};

// ---------- Test double + scenario ----------
class CountingNotifier : public Notifier { public: void booked(const Booking&) override { ++count; } int count = 0; };

std::string hhmm(int m) { std::string h = std::to_string(m / 60), mm = std::to_string(m % 60); return (h.size() < 2 ? "0" + h : h) + ":" + (mm.size() < 2 ? "0" + mm : mm); }
const char* why(BookError e) { return e == BookError::UnknownRoom ? "unknown room" : e == BookError::Conflict ? "conflict" : "too many bookings"; }

int main() {
    CountingNotifier notes;
    BookingService svc(notes, 2);
    svc.add_room("nile", 6);
    svc.add_room("board", 12);

    auto try_book = [&](const char* room, const char* user, int s, int e) {
        auto r = svc.book(room, user, TimeSlot(s, e));
        if (auto* id = std::get_if<int>(&r)) std::cout << user << " booked " << room << ' ' << hhmm(s) << "-" << hhmm(e) << " (#" << *id << ")\n";
        else std::cout << user << " -> " << room << ' ' << hhmm(s) << ": " << why(std::get<BookError>(r)) << '\n';
    };
    try_book("nile", "ali", 9 * 60, 10 * 60);
    try_book("nile", "bea", 9 * 60 + 30, 11 * 60);
    try_book("nile", "bea", 10 * 60, 11 * 60);
    try_book("board", "ali", 13 * 60, 14 * 60);
    try_book("board", "ali", 15 * 60, 16 * 60);
    try_book("mars", "chen", 9 * 60, 10 * 60);

    std::cout << "nile free between 08:00 and 18:00:";
    for (auto& s : svc.free_slots("nile", 8 * 60, 18 * 60)) std::cout << ' ' << hhmm(s.start()) << "-" << hhmm(s.end());
    std::cout << "\nrooms for 10 people:";
    for (auto& r : svc.rooms_with_capacity(10)) std::cout << ' ' << r;
    std::cout << "\nnotifications sent: " << notes.count << ", cancel #1: " << std::boolalpha << svc.cancel(1) << '\n';
}
```

**Output:**
```text
ali booked nile 09:00-10:00 (#1)
bea -> nile 09:30: conflict
bea booked nile 10:00-11:00 (#2)
ali booked board 13:00-14:00 (#3)
ali -> board 15:00: too many bookings
chen -> mars 09:00: unknown room
nile free between 08:00 and 18:00: 08:00-09:00 11:00-18:00
rooms for 10 people: board
notifications sent: 3, cancel #1: true
```

### Interview answer
"I aim for a small, complete core that compiles and runs: value types with invariants first, then one service with the main use cases, boundaries like the notifier injected as interfaces, and expected failures returned as explicit errors. I finish with a short main or a few asserts that run the main scenario and a couple of edge cases, and I mention — rather than write — persistence and logging."

---

## Cheat sheet

| Step | Remember |
|---|---|
| Write code | types → service → use cases → `main`/asserts; inject boundaries; explicit errors; compile early |
| Time plan (45 min) | 5 clarify · 7 model · 23 code · 5 review · 5 trade-offs + change |
| Review | invariants out loud; empty/boundary/invalid/duplicate/limit/concurrent/mid-failure cases |
| Boundaries | `[start, end)` intervals: back-to-back is **not** an overlap |
| Complexity | cost per operation + when you'd switch structures (vector → ordered map) |
| Extensibility | name the seams and the changes that would hurt |
| Maintainability | small classes, one place per rule, injected deps, tests as documentation |
| Requirement change | restate → where it lands → implement only that → old tests pass → new test |
