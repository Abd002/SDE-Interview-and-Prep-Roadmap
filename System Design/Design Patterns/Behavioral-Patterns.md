# Behavioral Design Patterns — Explained for Beginners

> **What you'll learn:** the ten **behavioral** patterns in the roadmap — **Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor** — which are about **how objects communicate and divide responsibilities**. Each has an analogy, how it works, and modern C++.
>
> **Prerequisites:** [OOP](../../Programming%20Languages%20and%20Concepts/OOP.md), lambdas ([Functional Programming](../../Programming%20Languages%20and%20Concepts/Functional-Programming.md)). Intro to patterns: [Creational Patterns](./Creational-Patterns.md#0-what-is-a-design-pattern).

## Table of Contents
1. [Chain of Responsibility](#1-chain-of-responsibility)
2. [Command](#2-command)
3. [Iterator](#3-iterator)
4. [Mediator](#4-mediator)
5. [Memento](#5-memento)
6. [Observer](#6-observer)
7. [State](#7-state)
8. [Strategy](#8-strategy)
9. [Template Method](#9-template-method)
10. [Visitor](#10-visitor)
11. [Cheat sheet](#cheat-sheet)

---

## 1. Chain of Responsibility

**In one sentence:** pass a request along a **chain of handlers**; each handler either handles it or passes it to the next one.

### In plain words
Calling customer support: the first-level agent handles simple questions; if they can't, they escalate to a specialist; if the specialist can't, to a manager. You (the sender) don't know who will finally help — you just start at the front of the chain.

### How it works
- Each **handler** has a reference to the **next** handler.
- `handle(request)`: if I can deal with it → do so (and maybe stop); otherwise → `next->handle(request)`.
- Adding/removing/reordering handlers doesn't change the sender.
- Real uses: **HTTP middleware** pipelines (auth → rate limit → logging → handler), GUI event bubbling, logging levels, approval workflows.

### Modern C++ example — HTTP middleware chain
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Request { std::string path; std::string token; int requests_this_minute; };
using Next = std::function<std::string(const Request&)>;
using Middleware = std::function<std::string(const Request&, const Next&)>;

// Build the chain: each middleware gets a "next" that calls the rest of the chain.
Next build_chain(const std::vector<Middleware>& mws, Next final_handler) {
    Next next = std::move(final_handler);
    for (auto it = mws.rbegin(); it != mws.rend(); ++it)
        next = [mw = *it, next](const Request& r) { return mw(r, next); };
    return next;
}

int main() {
    Middleware auth = [](const Request& r, const Next& next) {
        if (r.token != "secret") return std::string("401 Unauthorized (stopped by auth)");
        return next(r);
    };
    Middleware rate_limit = [](const Request& r, const Next& next) {
        if (r.requests_this_minute > 100) return std::string("429 Too Many Requests (stopped by rate limiter)");
        return next(r);
    };
    Middleware logging = [](const Request& r, const Next& next) {
        std::string result = next(r);
        return result + "  [logged " + r.path + "]";
    };
    auto app = build_chain({auth, rate_limit, logging},
                           [](const Request& r) { return "200 OK: " + r.path; });

    std::cout << app({"/orders", "secret", 5}) << '\n';
    std::cout << app({"/orders", "wrong", 5}) << '\n';
    std::cout << app({"/orders", "secret", 500}) << '\n';
}
```

**Output:**
```text
200 OK: /orders  [logged /orders]
401 Unauthorized (stopped by auth)
429 Too Many Requests (stopped by rate limiter)
```

### Interview answer
"Chain of Responsibility decouples a sender from receivers by passing a request along a linked chain of handlers, each deciding to handle it or forward it. HTTP middleware pipelines and event bubbling are common examples; handlers can be reordered without changing the sender."

---

## 2. Command

**In one sentence:** Command turns a request into a **standalone object** containing everything needed to perform it — so you can queue it, log it, retry it, or **undo** it.

### In plain words
A waiter writes your order on a **ticket** (the command object) and puts it on the kitchen rail. The ticket can wait in a queue, be handed to any cook, be cancelled, or be reprinted. The waiter doesn't need to know how to cook.

### How it works
- **Command** interface: `execute()` (and often `undo()`).
- **Concrete commands** store the receiver and parameters (`AddText{doc, "hello"}`).
- **Invoker** (button, queue, scheduler) calls `execute()` without knowing the details.
- Keeping executed commands in a **history stack** enables undo/redo.
- Uses: undo/redo in editors, job queues, macro recording, transactional operations, GUI buttons/menus, CQRS "commands".

### Modern C++ example — text editor with undo/redo
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Command {
    virtual ~Command() = default;
    virtual void execute() = 0;
    virtual void undo() = 0;
};

class Append : public Command {
public:
    Append(std::string& doc, std::string text) : doc_(doc), text_(std::move(text)) {}
    void execute() override { doc_ += text_; }
    void undo() override { doc_.erase(doc_.size() - text_.size()); }
private:
    std::string& doc_;
    std::string text_;
};

class Editor {                                            // the invoker
public:
    void run(std::unique_ptr<Command> c) { c->execute(); done_.push_back(std::move(c)); redo_.clear(); }
    void undo() { if (done_.empty()) return; done_.back()->undo(); redo_.push_back(std::move(done_.back())); done_.pop_back(); }
    void redo() { if (redo_.empty()) return; redo_.back()->execute(); done_.push_back(std::move(redo_.back())); redo_.pop_back(); }
private:
    std::vector<std::unique_ptr<Command>> done_, redo_;
};

int main() {
    std::string doc;
    Editor editor;
    editor.run(std::make_unique<Append>(doc, "Hello"));
    editor.run(std::make_unique<Append>(doc, ", world"));
    editor.run(std::make_unique<Append>(doc, "!!!"));
    std::cout << "typed:  " << doc << '\n';
    editor.undo();
    std::cout << "undo:   " << doc << '\n';
    editor.undo();
    std::cout << "undo:   " << doc << '\n';
    editor.redo();
    std::cout << "redo:   " << doc << '\n';
}
```

**Output:**
```text
typed:  Hello, world!!!
undo:   Hello, world
undo:   Hello
redo:   Hello, world
```

### Interview answer
"Command encapsulates a request as an object with execute and often undo, decoupling the invoker from the receiver. Because requests become data, they can be queued, logged, retried, scheduled, or kept in a history for undo/redo."

---

## 3. Iterator

**In one sentence:** Iterator lets you **walk through the elements of a collection** one by one without knowing how the collection is stored inside.

### In plain words
A TV remote's "next channel" button. You don't know (or care) how the TV stores its channel list — array, tree, satellite database. You just press "next" until you've seen them all.

### How it works
- An iterator object keeps a **position** and offers "get current", "advance", "are we done?".
- C++ has this pattern built into the language: every standard container provides `begin()`/`end()` iterators, and **range-based `for`** works with any type that has them.
- Different iterators can traverse the same collection differently (in-order vs. level-order of a tree, reverse, filtered).
- Modern C++: iterator categories (input, forward, bidirectional, random access, contiguous), **C++20 ranges/views** that compose lazily, and **coroutine generators** (`co_yield`) as the easiest way to write custom iteration (see [Asynchronous Programming → Coroutines](../../Programming%20Languages%20and%20Concepts/Asynchronous-Programming.md#4-coroutines)).

### Modern C++ example — a custom iterable range usable with range-for and ranges
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstddef>
#include <iostream>
#include <iterator>
#include <ranges>

// A collection that doesn't store its elements at all: numbers lo, lo+step, ... < hi
class StepRange {
public:
    class iterator {
    public:
        using value_type = int;
        using difference_type = std::ptrdiff_t;
        iterator() = default;
        iterator(int value, int step) : value_(value), step_(step) {}
        int operator*() const { return value_; }
        iterator& operator++() { value_ += step_; return *this; }
        iterator operator++(int) { auto tmp = *this; ++*this; return tmp; }
        bool operator==(const iterator& other) const { return value_ >= other.value_; }  // reached the end
    private:
        int value_ = 0, step_ = 1;
    };
    StepRange(int lo, int hi, int step) : lo_(lo), hi_(hi), step_(step) {}
    iterator begin() const { return {lo_, step_}; }
    iterator end() const { return {hi_, step_}; }
private:
    int lo_, hi_, step_;
};
static_assert(std::input_iterator<StepRange::iterator>);    // works with standard algorithms

int main() {
    for (int x : StepRange(0, 20, 5)) std::cout << x << ' ';          // range-based for
    std::cout << '\n';

    auto squares_of_odds = StepRange(1, 12, 1)
                         | std::views::filter([](int x) { return x % 2 == 1; })
                         | std::views::transform([](int x) { return x * x; });
    for (int x : squares_of_odds) std::cout << x << ' ';               // composes with ranges
    std::cout << '\n';
}
```

**Output:**
```text
0 5 10 15
1 9 25 49 81 121
```

### Interview answer
"Iterator provides sequential access to a collection's elements without exposing its representation. In C++ it's a core language idiom — begin/end iterators, range-based for, iterator concepts and C++20 ranges — and custom iterators or coroutine generators let any structure plug into the standard algorithms."

---

## 4. Mediator

**In one sentence:** Mediator makes objects communicate **through a central mediator** instead of directly with each other, reducing a tangle of many-to-many connections to one-to-many.

### In plain words
**Air traffic control.** Planes don't radio every other plane to negotiate who lands first — that would be chaos with 50 planes. Every plane talks only to the control tower, which coordinates everyone.

### How it works
- **Colleagues** (planes, UI widgets, chat users) hold a reference to the **mediator** and notify it of events.
- The **mediator** contains the coordination logic and tells the relevant colleagues what to do.
- Before: N objects × N references. After: N objects → 1 mediator.
- Uses: chat rooms, dialog boxes (checkbox enables a text field, button validates form), air-traffic/game lobby coordination, message brokers at architecture scale.
- Risk: the mediator can become a "god object" knowing too much.

### Modern C++ example — a chat room
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

class ChatRoom;

class User {
public:
    User(std::string name, ChatRoom& room) : name_(std::move(name)), room_(room) {}
    void send(const std::string& msg);                      // talks ONLY to the mediator
    void receive(const std::string& from, const std::string& msg) const {
        std::cout << "  " << name_ << " got from " << from << ": " << msg << '\n';
    }
    const std::string& name() const { return name_; }
private:
    std::string name_;
    ChatRoom& room_;
};

class ChatRoom {                                            // the mediator
public:
    void join(User& u) { users_.push_back(&u); }
    void broadcast(const User& from, const std::string& msg) {
        for (User* u : users_)
            if (u != &from) u->receive(from.name(), msg);   // routing rules live here
    }
private:
    std::vector<User*> users_;
};

void User::send(const std::string& msg) { room_.broadcast(*this, msg); }

int main() {
    ChatRoom room;
    User ana("Ana", room), ben("Ben", room), cara("Cara", room);
    room.join(ana); room.join(ben); room.join(cara);
    std::cout << "Ana sends:\n";
    ana.send("hi everyone");
    std::cout << "Cara sends:\n";
    cara.send("hello!");
}
```

**Output:**
```text
Ana sends:
  Ben got from Ana: hi everyone
  Cara got from Ana: hi everyone
Cara sends:
  Ana got from Cara: hello!
  Ben got from Cara: hello!
```

### Interview answer
"Mediator centralizes interaction logic between a set of objects so they communicate via the mediator rather than referencing each other, turning many-to-many coupling into one-to-many. It simplifies colleagues but risks the mediator becoming a god object."

---

## 5. Memento

**In one sentence:** Memento **captures an object's internal state as a snapshot** so it can be restored later — without exposing the object's private details.

### In plain words
A **save point in a video game**: the game stores your level, health and inventory in a save file. Later you can load it and continue from exactly there. You can't (and don't need to) edit the save file's internals — you just keep it and hand it back.

### How it works
- **Originator** (the object with state) creates a **memento** (`save()`) and can restore from one (`restore(m)`).
- The **memento** is opaque to everyone except the originator (in C++, private members + `friend`).
- The **caretaker** (history manager) stores mementos but never looks inside.
- Uses: undo (by snapshots rather than inverse commands), checkpoints/rollback, transactions, game saves.
- Cost: snapshots of big objects use memory — consider storing diffs or limiting history.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

class Game {                                               // originator
public:
    class Memento {                                        // opaque snapshot
        friend class Game;                                 // only Game can read it
        Memento(int level, int hp, std::vector<std::string> inv)
            : level_(level), hp_(hp), inventory_(std::move(inv)) {}
        int level_, hp_;
        std::vector<std::string> inventory_;
    };

    void play(int levels, int damage, const std::string& loot) {
        level_ += levels; hp_ -= damage; inventory_.push_back(loot);
    }
    Memento save() const { return Memento(level_, hp_, inventory_); }
    void restore(const Memento& m) { level_ = m.level_; hp_ = m.hp_; inventory_ = m.inventory_; }
    void print() const {
        std::cout << "level " << level_ << ", hp " << hp_ << ", items:";
        for (const auto& i : inventory_) std::cout << ' ' << i;
        std::cout << '\n';
    }
private:
    int level_ = 1, hp_ = 100;
    std::vector<std::string> inventory_;
};

int main() {
    Game game;
    std::vector<Game::Memento> saves;                      // caretaker: stores, never inspects

    game.play(2, 20, "sword");
    saves.push_back(game.save());
    std::cout << "saved:    "; game.print();

    game.play(1, 90, "cursed-ring");                        // bad decision
    std::cout << "now:      "; game.print();

    game.restore(saves.back());
    std::cout << "restored: "; game.print();
}
```

**Output:**
```text
saved:    level 3, hp 80, items: sword
now:      level 4, hp -10, items: sword cursed-ring
restored: level 3, hp 80, items: sword
```

### Interview answer
"Memento captures and externalizes an object's state as an opaque snapshot so it can later be restored, preserving encapsulation because only the originator can read it; a caretaker stores the history. It underlies snapshot-based undo and checkpoints, at the cost of memory for large states."

---

## 6. Observer

**In one sentence:** Observer lets objects **subscribe** to another object and get **notified automatically** whenever it changes (publish/subscribe).

### In plain words
**Subscribing to a YouTube channel.** You don't check the channel every hour; when a new video is published, every subscriber gets a notification. The channel doesn't need to know who you are beyond "a subscriber".

### How it works
- **Subject** (publisher) keeps a list of **observers** and has `subscribe()`, `unsubscribe()`, and `notify()`.
- When its state changes it calls each observer's callback.
- Observers are decoupled from the subject — they just implement a callback.
- Uses: GUI events and data binding, spreadsheets updating dependent cells, stock tickers, model–view (MVC), reactive programming (RxCpp), and — at system scale — event-driven architecture and message brokers.
- Pitfalls: **lifetime** (a destroyed observer still in the list → dangling pointer; use unsubscribe tokens or `weak_ptr`), notification order, cascades of updates, and memory leaks from forgotten subscriptions.

### Modern C++ example — subscriptions with automatic unsubscribe (RAII)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <string>

template <class... Args>
class Signal {                                             // the subject
public:
    using Slot = std::function<void(Args...)>;

    // Returns a token; when the token is destroyed, the subscription ends (no dangling observers).
    [[nodiscard]] std::shared_ptr<void> subscribe(Slot slot) {
        int id = next_id_++;
        slots_[id] = std::move(slot);
        return std::shared_ptr<void>(nullptr, [this, id](void*) { slots_.erase(id); });
    }
    void emit(Args... args) const { for (const auto& [id, slot] : slots_) slot(args...); }
private:
    std::map<int, Slot> slots_;
    int next_id_ = 0;
};

class Stock {
public:
    explicit Stock(std::string symbol) : symbol_(std::move(symbol)) {}
    Signal<const std::string&, double> price_changed;
    void set_price(double p) { price_ = p; price_changed.emit(symbol_, price_); }
private:
    std::string symbol_;
    double price_ = 0;
};

int main() {
    Stock acme("ACME");
    auto chart = acme.price_changed.subscribe([](const std::string& s, double p) {
        std::cout << "  chart: " << s << " -> " << p << '\n';
    });
    {
        auto alert = acme.price_changed.subscribe([](const std::string& s, double p) {
            if (p > 100) std::cout << "  ALERT: " << s << " above 100!\n";
        });
        std::cout << "price 99:\n";  acme.set_price(99);
        std::cout << "price 105:\n"; acme.set_price(105);
    }   // 'alert' token destroyed -> automatically unsubscribed
    std::cout << "price 120 (alert unsubscribed):\n";
    acme.set_price(120);
}
```

**Output:**
```text
price 99:
  chart: ACME -> 99
price 105:
  chart: ACME -> 105
  ALERT: ACME above 100!
price 120 (alert unsubscribed):
  chart: ACME -> 120
```

### Interview answer
"Observer defines a one-to-many dependency where a subject notifies registered observers of state changes, decoupling publishers from subscribers. It powers GUI events, MVC and reactive streams; in C++ the main hazards are observer lifetimes, so I use RAII subscription tokens or weak pointers."

---

## 7. State

**In one sentence:** State lets an object **change its behavior when its internal state changes** — as if it became a different class — by delegating to a state object.

### In plain words
A **vending machine** behaves differently depending on its state: with no coin, pressing "select" says "insert coin"; with a coin, it dispenses; when sold out, it refunds. Instead of giant `if (state == ...)` blocks in every method, each state is its own small object that knows how to react and which state comes next.

### How it works
- **Context** (vending machine) holds a pointer to the current **State** object and forwards requests to it.
- Each **concrete state** implements the behavior for that state and triggers **transitions** (`context.set_state(...)`).
- Adding a new state = adding a class, not editing every method.
- Uses: order lifecycles (pending → paid → shipped → delivered), TCP connection states, UI modes, game character states, workflow engines.
- Modern C++ alternative for small state machines: `std::variant` of state structs + `std::visit`.

### Modern C++ example — vending machine
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>

class VendingMachine;

struct State {
    virtual ~State() = default;
    virtual void insert_coin(VendingMachine&) = 0;
    virtual void press_button(VendingMachine&) = 0;
};

class VendingMachine {                                     // the context
public:
    explicit VendingMachine(int stock);
    void insert_coin() { state_->insert_coin(*this); }
    void press_button() { state_->press_button(*this); }
    void set_state(std::unique_ptr<State> s) { state_ = std::move(s); }
    int stock = 0;
private:
    std::unique_ptr<State> state_;
};

struct SoldOut : State {
    void insert_coin(VendingMachine&) override { std::cout << "  sold out - coin returned\n"; }
    void press_button(VendingMachine&) override { std::cout << "  sold out\n"; }
};
struct NoCoin : State {
    void insert_coin(VendingMachine& m) override;
    void press_button(VendingMachine&) override { std::cout << "  please insert a coin first\n"; }
};
struct HasCoin : State {
    void insert_coin(VendingMachine&) override { std::cout << "  already have a coin\n"; }
    void press_button(VendingMachine& m) override {
        std::cout << "  here is your drink\n";
        if (--m.stock == 0) m.set_state(std::make_unique<SoldOut>());   // transition
        else m.set_state(std::make_unique<NoCoin>());
    }
};
void NoCoin::insert_coin(VendingMachine& m) {
    std::cout << "  coin accepted\n";
    m.set_state(std::make_unique<HasCoin>());                            // transition
}

VendingMachine::VendingMachine(int s) : stock(s), state_(std::make_unique<NoCoin>()) {}

int main() {
    VendingMachine m(1);
    std::cout << "press:\n";  m.press_button();
    std::cout << "coin:\n";   m.insert_coin();
    std::cout << "press:\n";  m.press_button();
    std::cout << "coin:\n";   m.insert_coin();
}
```

**Output:**
```text
press:
  please insert a coin first
coin:
  coin accepted
press:
  here is your drink
coin:
  sold out - coin returned
```

### Interview answer
"State encapsulates state-specific behavior in separate state objects; the context delegates to its current state, and states trigger transitions. It replaces sprawling conditionals with polymorphism and makes adding states easy. Unlike Strategy, the states usually know about each other and change the context's state themselves."

---

## 8. Strategy

**In one sentence:** Strategy defines a **family of interchangeable algorithms**, puts each in its own object, and lets the client **choose one at runtime**.

### In plain words
Getting to the airport: **car, bus, or bike**. The goal is the same; the *strategy* differs in cost and time. A navigation app lets you pick one and computes the route accordingly — without the app's core logic changing.

### How it works
- **Strategy** interface (`price(amount)`); **concrete strategies** implement it.
- The **context** holds a strategy and delegates to it; the strategy can be swapped at runtime.
- In modern C++ a strategy is often just a **callable**: `std::function<double(double)>` or a template parameter (compile-time strategy, zero overhead — like the comparator you pass to `std::sort`).
- Uses: sorting comparators, pricing/discount rules, compression algorithms, payment methods, route planning, retry/backoff policies.

### Modern C++ example — pricing strategies (as lambdas)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

class Checkout {
public:
    using PricingStrategy = std::function<double(double)>;
    void set_strategy(std::string name, PricingStrategy s) { name_ = std::move(name); strategy_ = std::move(s); }
    void pay(double amount) const {
        std::cout << std::format("{:<14} ${:>6.2f} -> ${:>6.2f}\n", name_, amount, strategy_(amount));
    }
private:
    std::string name_ = "regular";
    PricingStrategy strategy_ = [](double a) { return a; };
};

int main() {
    Checkout checkout;
    checkout.pay(80);
    checkout.set_strategy("black friday", [](double a) { return a * 0.7; });
    checkout.pay(80);
    checkout.set_strategy("$10 off > $50", [](double a) { return a > 50 ? a - 10 : a; });
    checkout.pay(80);

    // Compile-time strategy: the comparator passed to std::sort
    std::vector<std::string> names{"bob", "Alexandra", "Eve"};
    std::ranges::sort(names, {}, &std::string::size);        // strategy: "by length"
    for (const auto& n : names) std::cout << n << ' ';
    std::cout << '\n';
}
```

**Output:**
```text
regular        $ 80.00 -> $ 80.00
black friday   $ 80.00 -> $ 56.00
$10 off > $50  $ 80.00 -> $ 70.00
bob Eve Alexandra
```

### Interview answer
"Strategy encapsulates interchangeable algorithms behind a common interface so the context can select or swap them at runtime without conditionals, following the Open/Closed Principle. In C++ a strategy can be a polymorphic object, a std::function, or a template parameter like a sort comparator."

---

## 9. Template Method

**In one sentence:** Template Method defines the **skeleton of an algorithm** in a base class and lets subclasses **fill in specific steps** without changing the overall structure.

### In plain words
Making a hot drink: *boil water → brew → pour into cup → add extras*. Tea and coffee follow the **same steps in the same order**; only "brew" (steep a teabag vs. drip through grounds) and "add extras" (lemon vs. milk) differ. The recipe skeleton is fixed; the specific steps are filled in by each drink.

### How it works
- The base class has a **non-virtual** `template_method()` calling steps in order.
- Some steps are **abstract** (must be provided), some are **hooks** with a default (may be overridden).
- In C++ this is often written with the **NVI idiom** (Non-Virtual Interface): public non-virtual function, private/protected virtual steps.
- Uses: frameworks (test fixtures `SetUp/TearDown`, game loops, data importers: open → parse → validate → save), algorithms with fixed structure.
- Template Method uses **inheritance** (compile-time structure); Strategy uses **composition** (runtime choice).

### Modern C++ example — data importers
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

class DataImporter {
public:
    virtual ~DataImporter() = default;
    void run() {                                            // the TEMPLATE METHOD (non-virtual)
        auto raw = read();
        auto records = parse(raw);
        if (!validate(records)) { std::cout << "  validation failed\n"; return; }
        std::cout << "  saved " << records.size() << " records\n";
    }
private:
    virtual std::string read() = 0;                          // required steps
    virtual std::vector<std::string> parse(const std::string& raw) = 0;
    virtual bool validate(const std::vector<std::string>& r) { return !r.empty(); }  // hook with default
};

class CsvImporter : public DataImporter {
    std::string read() override { std::cout << "  reading users.csv\n"; return "ana,ben,cara"; }
    std::vector<std::string> parse(const std::string& raw) override {
        std::vector<std::string> out;
        std::string cur;
        for (char c : raw) { if (c == ',') { out.push_back(cur); cur.clear(); } else cur += c; }
        out.push_back(cur);
        return out;
    }
};

class JsonImporter : public DataImporter {
    std::string read() override { std::cout << "  reading users.json\n"; return R"(["dan"])"; }
    std::vector<std::string> parse(const std::string&) override { return {"dan"}; }
    bool validate(const std::vector<std::string>& r) override { return r.size() >= 2; }  // stricter hook
};

int main() {
    std::cout << "CSV:\n";  CsvImporter{}.run();
    std::cout << "JSON:\n"; JsonImporter{}.run();
}
```

**Output:**
```text
CSV:
  reading users.csv
  saved 3 records
JSON:
  reading users.json
  validation failed
```

### Interview answer
"Template Method fixes an algorithm's skeleton in a base-class method and defers certain steps to subclasses through abstract operations or optional hooks, typically implemented in C++ with the non-virtual interface idiom. It's inheritance-based; Strategy achieves similar variation through composition."

---

## 10. Visitor

**In one sentence:** Visitor lets you **add new operations** to a set of classes **without modifying those classes**, by putting each operation in a separate "visitor" object.

### In plain words
An **insurance agent visiting** different buildings: at a house they sell fire insurance, at a bank theft insurance, at a factory equipment insurance. The buildings don't change; the agent knows what to do for each building type. Tomorrow a **tax inspector** visits the same buildings with *different* logic — again, no building changes.

### How it works
- Classic GoF: each element class has `accept(Visitor& v) { v.visit(*this); }` — **double dispatch** picks the right `visit` overload for both the visitor type and the element type.
- Each **visitor** implements `visit(Circle&)`, `visit(Rectangle&)`, … for one operation (area, export to SVG, serialize).
- Trade-off: adding a **new operation** is easy (new visitor); adding a **new element type** is hard (every visitor must change). Use it when the class hierarchy is stable but operations keep growing — e.g. compilers walking an **AST** (type checking, optimization, code generation are all visitors).
- **Modern C++:** `std::variant` + `std::visit` + an "overloaded" lambda set is a clean, type-safe visitor with no `accept` boilerplate.

### Modern C++ example — `std::variant` + `std::visit` (and a compile-time "overloaded" helper)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <format>
#include <iostream>
#include <numbers>
#include <string>
#include <variant>
#include <vector>

struct Circle    { double r; };
struct Rectangle { double w, h; };
struct Triangle  { double base, height; };
using Shape = std::variant<Circle, Rectangle, Triangle>;     // a closed set of element types

// Helper that combines several lambdas into one overloaded function object.
template <class... Fs> struct overloaded : Fs... { using Fs::operator()...; };

// Visitor 1: area
struct AreaVisitor {
    double operator()(const Circle& c) const { return std::numbers::pi * c.r * c.r; }
    double operator()(const Rectangle& r) const { return r.w * r.h; }
    double operator()(const Triangle& t) const { return 0.5 * t.base * t.height; }
};

int main() {
    const std::vector<Shape> shapes{Circle{1}, Rectangle{2, 3}, Triangle{4, 5}};

    double total = 0;
    for (const auto& s : shapes) total += std::visit(AreaVisitor{}, s);
    std::cout << std::format("total area: {:.2f}\n", total);

    // Visitor 2 (a NEW operation, added without touching Circle/Rectangle/Triangle): SVG export
    auto to_svg = overloaded{
        [](const Circle& c)    { return std::format("<circle r=\"{}\"/>", c.r); },
        [](const Rectangle& r) { return std::format("<rect width=\"{}\" height=\"{}\"/>", r.w, r.h); },
        [](const Triangle& t)  { return std::format("<polygon base=\"{}\" height=\"{}\"/>", t.base, t.height); },
    };
    for (const auto& s : shapes) std::cout << std::visit(to_svg, s) << '\n';
}
```

**Output:**
```text
total area: 19.14
<circle r="1"/>
<rect width="2" height="3"/>
<polygon base="4" height="5"/>
```
If you add a new shape to the `variant` and forget to handle it in a visitor, the **compiler** reports an error — a big safety win over `if/else` chains with `dynamic_cast`.

### Interview answer
"Visitor separates operations from the object structure: elements accept a visitor, and double dispatch selects the visit method for the concrete element, so new operations are added as new visitors without modifying element classes — at the cost of making new element types expensive. It's classic for compiler ASTs; in modern C++, std::variant with std::visit gives a type-safe, exhaustively checked visitor."

---

## Cheat sheet

| Pattern | Intent | Analogy |
|---|---|---|
| Chain of Responsibility | Pass a request along handlers until one handles it | Support escalation, middleware |
| Command | Request as an object → queue, log, undo | Order ticket on the kitchen rail |
| Iterator | Traverse without exposing internals | "Next channel" button |
| Mediator | Objects talk via a central coordinator | Air traffic control |
| Memento | Snapshot and restore state, keeping encapsulation | Game save point |
| Observer | Notify subscribers of changes | YouTube subscriptions |
| State | Behavior changes with internal state (state objects) | Vending machine |
| Strategy | Swap interchangeable algorithms at runtime | Car / bus / bike to the airport |
| Template Method | Fixed skeleton, subclasses fill in steps | Tea vs. coffee recipe |
| Visitor | Add operations without changing element classes | Insurance agent visiting buildings |
