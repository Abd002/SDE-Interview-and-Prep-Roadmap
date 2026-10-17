# Object-Oriented Design Fundamentals — Building Blocks, Cohesion, Coupling and SOLID in Practice

> **What you'll learn:** how to use the OOP building blocks (classes, interfaces, abstract classes, composition) to **design** software, what **cohesion** and **coupling** mean, how to apply **DRY, KISS and YAGNI** without over-abstracting, how the four OOP pillars show up in a design, when to choose **composition over inheritance**, and how **SOLID** looks in real classes and services. Each part has a runnable C++ example.
>
> **Prerequisites:** [OOP](../Programming%20Languages%20and%20Concepts/OOP.md) (the language features) and [OOD Principles](../System%20Design/OOD-Principles.md) (the principle definitions). This guide is about **using** them in a low-level design interview.

## Table of Contents
1. [Classes, objects, interfaces, abstract classes, and composition](#1-classes-objects-interfaces-abstract-classes-and-composition)
2. [Cohesion, coupling, separation of concerns, and modularity](#2-cohesion-coupling-separation-of-concerns-and-modularity)
3. [DRY, KISS, YAGNI, and premature abstraction trade-offs](#3-dry-kiss-yagni-and-premature-abstraction-trade-offs)
4. [Encapsulation, abstraction, inheritance, and polymorphism in design](#4-encapsulation-abstraction-inheritance-and-polymorphism-in-design)
5. [Favor composition over inheritance; identify misuse of hierarchies](#5-favor-composition-over-inheritance-identify-misuse-of-hierarchies)
6. [SOLID principles applied to practical classes and services](#6-solid-principles-applied-to-practical-classes-and-services)
7. [Cheat sheet](#cheat-sheet)

---

## 1. Classes, objects, interfaces, abstract classes, and composition

**In one sentence:** a **class** is a blueprint with data and behaviour, an **object** is one instance of it, an **interface** is a pure contract ("what you can do"), an **abstract class** is a partial blueprint with some shared code, and **composition** builds bigger objects out of smaller ones ("has-a").

### In plain words
- **Class:** the plan for a car. **Object:** the red car in your garage.
- **Interface:** "anything that can be *charged*" — a phone, a laptop, a car. It says nothing about how.
- **Abstract class:** "a vehicle" — it has wheels and a `start()` routine shared by all, but you can't buy "a vehicle", only a specific kind.
- **Composition:** a car **has an** engine, wheels and a radio. Swap the engine, and it's still the same car.

### How it works
| Tool | In C++ | Use it when |
|---|---|---|
| **Class** | `class` / `struct` with members and invariants | you have state plus rules about that state |
| **Interface** | class with only `virtual … = 0` methods and a virtual destructor | callers should depend on a capability, not a concrete type |
| **Abstract class** | some pure virtual methods **plus** shared data or code | several types share real implementation, and you need a template of steps |
| **Composition** | a member object or a `std::unique_ptr<Interface>` | an object is built from parts that may vary independently |
| **Value type** | small class compared by value (`Money`, `Email`) | the thing has no identity, only a value |

**Design habits**
- Give every class **one clear responsibility** and make its **invariants** impossible to break from outside (private data, validating constructor).
- Keep interfaces **small** (one to a few methods).
- Program to the **interface**, inject the concrete type from outside.
- In C++, an interface needs a **virtual destructor**, or deleting through the interface pointer is undefined behaviour.

#### Modern C++ example — interface, abstract class and composition in one small design
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <vector>

class Notifier {                                         // interface: a capability
public:
    virtual ~Notifier() = default;
    virtual void send(const std::string& to, const std::string& msg) = 0;
};

class EmailNotifier : public Notifier {
public:
    void send(const std::string& to, const std::string& msg) override { std::cout << "[email to " << to << "] " << msg << '\n'; }
};
class SmsNotifier : public Notifier {
public:
    void send(const std::string& to, const std::string& msg) override { std::cout << "[sms to " << to << "] " << msg << '\n'; }
};

class Account {                                          // abstract class: shared state + template step
public:
    Account(std::string owner, long cents) : owner_(std::move(owner)), balance_(cents) {
        if (balance_ < 0) throw std::invalid_argument("negative opening balance");
    }
    virtual ~Account() = default;
    void withdraw(long cents) {                          // shared algorithm, one varying rule
        if (cents <= 0) throw std::invalid_argument("amount must be positive");
        if (balance_ - cents < -overdraft_limit()) throw std::runtime_error("insufficient funds");
        balance_ -= cents;
    }
    long balance() const { return balance_; }
    const std::string& owner() const { return owner_; }
protected:
    virtual long overdraft_limit() const = 0;            // each kind decides
private:
    std::string owner_;
    long balance_;                                        // invariant guarded by withdraw()
};

class Savings : public Account { using Account::Account; long overdraft_limit() const override { return 0; } };
class Checking : public Account { using Account::Account; long overdraft_limit() const override { return 50'00; } };

class Bank {                                             // composition: has accounts and a notifier
public:
    explicit Bank(std::unique_ptr<Notifier> n) : notifier_(std::move(n)) {}
    Account& open(std::unique_ptr<Account> a) { accounts_.push_back(std::move(a)); return *accounts_.back(); }
    void withdraw(Account& a, long cents) {
        try {
            a.withdraw(cents);
            notifier_->send(a.owner(), "withdrew " + std::to_string(cents / 100) + ", balance " + std::to_string(a.balance() / 100));
        } catch (const std::exception& e) {
            notifier_->send(a.owner(), std::string("declined: ") + e.what());
        }
    }
private:
    std::unique_ptr<Notifier> notifier_;
    std::vector<std::unique_ptr<Account>> accounts_;
};

int main() {
    Bank bank(std::make_unique<SmsNotifier>());          // swap to EmailNotifier without touching Bank
    Account& s = bank.open(std::make_unique<Savings>("mona", 100'00));
    Account& c = bank.open(std::make_unique<Checking>("omar", 100'00));
    bank.withdraw(s, 120'00);
    bank.withdraw(c, 120'00);

    Bank other(std::make_unique<EmailNotifier>());
    Account& x = other.open(std::make_unique<Savings>("lina", 10'00));
    other.withdraw(x, 5'00);
}
```

**Output:**
```text
[sms to mona] declined: insufficient funds
[sms to omar] withdrew 120, balance -20
[email to lina] withdrew 5, balance 5
```

### Interview answer
"I model state plus invariants as classes, capabilities that callers depend on as small interfaces, and shared implementation with one varying step as an abstract class. Bigger objects are composed from parts — here `Bank` has a `Notifier` injected — so I can swap SMS for email without changing `Bank`. In C++ I give interfaces a virtual destructor and keep data private behind methods that enforce the invariants."

---

## 2. Cohesion, coupling, separation of concerns, and modularity

**In one sentence:** aim for **high cohesion** (everything inside a module belongs together) and **low coupling** (modules know as little as possible about each other), achieved by **separating concerns** into **modules** with small, stable interfaces.

### In plain words
A kitchen is cohesive: knives, pans and the stove are together because they serve one purpose. It's loosely coupled to the laundry room: they share only the water pipe. If washing clothes required opening the oven, that would be tight coupling.

### How it works
| Concept | Good sign | Bad sign (smell) |
|---|---|---|
| **High cohesion** | a class's methods all use the same few fields; its name explains it in one phrase | "Manager", "Utils", "Helper" classes with unrelated methods |
| **Low coupling** | depends on interfaces, few imports, changes stay local | a change in one class forces edits in five others ("shotgun surgery") |
| **Separation of concerns** | parsing, business rules, storage and presentation are in different places | SQL strings and HTML inside business logic |
| **Modularity** | a module hides its internals and can be tested and replaced alone | everything reaches into everything ("big ball of mud") |

**Kinds of coupling, from worst to best:** content (touching another class's internals) → common/global data → control (passing flags that change what a function does) → stamp (passing a big object when two fields are needed) → **data** (passing only what's needed) → **message** (calling an interface method).

**Ways to reduce coupling:** depend on interfaces (DIP), pass only the data needed, use events/observers for one-to-many notifications, keep a **Law of Demeter** style ("talk to friends, not strangers": avoid `order.customer().address().city()` chains).

#### Modern C++ example — splitting a "god function" into cohesive, loosely coupled parts
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <sstream>
#include <string>
#include <vector>

// BEFORE: one function parsed CSV, applied discounts, saved to a DB and printed HTML.
// AFTER: each concern lives in one place and depends only on small interfaces.

struct Order { std::string customer; int quantity; long unit_cents; };

class OrderParser {                                       // concern 1: input format
public:
    static std::optional<Order> parse(const std::string& line) {
        std::istringstream in(line);
        Order o;
        char c1;
        if (std::getline(in, o.customer, ',') && in >> o.quantity >> c1 >> o.unit_cents && c1 == ',') return o;
        return std::nullopt;
    }
};

class PricingPolicy {                                     // concern 2: business rule
public:
    static long total(const Order& o) {
        long total = o.quantity * o.unit_cents;
        return o.quantity >= 10 ? total * 90 / 100 : total;   // 10% bulk discount
    }
};

class OrderRepository {                                   // concern 3: storage (interface)
public:
    virtual ~OrderRepository() = default;
    virtual void save(const Order& o, long total) = 0;
    virtual long revenue() const = 0;
};
class InMemoryRepository : public OrderRepository {
public:
    void save(const Order& o, long total) override { totals_[o.customer] += total; }
    long revenue() const override { long r = 0; for (const auto& [c, t] : totals_) r += t; return r; }
private:
    std::map<std::string, long> totals_;
};

class OrderService {                                      // orchestration only: knows the steps, not the details
public:
    explicit OrderService(OrderRepository& repo) : repo_(repo) {}
    void import(const std::vector<std::string>& lines) {
        for (const auto& l : lines) {
            auto o = OrderParser::parse(l);
            if (!o) { std::cout << "skipped bad line: " << l << '\n'; continue; }
            repo_.save(*o, PricingPolicy::total(*o));
        }
    }
private:
    OrderRepository& repo_;
};

int main() {
    InMemoryRepository repo;                              // swap for a SQL repository in production
    OrderService service(repo);
    service.import({"ali,2,1500", "bea,10,1000", "oops", "ali,1,500"});
    std::cout << "revenue: " << repo.revenue() / 100.0 << '\n';   // concern 4: presentation
}
```

**Output:**
```text
skipped bad line: oops
revenue: 125
```

### Interview answer
"I want each class to have one reason to exist — high cohesion — and to know as little as possible about others — low coupling — usually by depending on small interfaces and passing only the data needed. I separate concerns like parsing, pricing rules, persistence and presentation, so a change to the CSV format or the database touches one module and each piece can be tested alone."

---

## 3. DRY, KISS, YAGNI, and premature abstraction trade-offs

**In one sentence:** **DRY** removes duplicated *knowledge*, **KISS** prefers the simplest design that works, **YAGNI** says don't build features or extension points before they're needed — and the skill is knowing when an abstraction **helps** versus when it's **premature**.

### In plain words
- **DRY:** if the tax rate is written in five places, one day someone updates four of them.
- **KISS:** a light switch beats a voice-controlled, app-connected lighting platform for a closet.
- **YAGNI:** don't build a garage for the second car you *might* buy.
- **Premature abstraction:** building a generic "VehicleFactoryStrategyProvider" when you have one kind of vehicle. You pay its cost every day and may guess the future wrong.

### How it works
- DRY is about **knowledge**, not text. Two functions that look alike but change for **different reasons** are *not* duplication — merging them couples them.
- **Rule of three:** write it once, tolerate a copy the second time, abstract on the third — when you can *see* the real common shape.
- **"Duplication is far cheaper than the wrong abstraction"** (Sandi Metz). A wrong abstraction collects flags and special cases until nobody understands it.
- **Signs of premature abstraction:** an interface with one implementation and no test double, generic type parameters used with one type, configuration options nobody sets, layers that only forward calls.
- **When an abstraction is worth it now:** a real second implementation exists (or a test fake needs one), the boundary is an external system (database, payment provider, clock), or the interviewer explicitly says "we'll add more types".
- In an interview, **say the trade-off out loud**: "I'll keep it as a simple function now; if we add a second payment provider I'd extract a `PaymentGateway` interface here."

#### Modern C++ example — real DRY vs. false DRY, and a YAGNI-sized design
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// Real DRY: ONE place knows the VAT rule. Every price calculation uses it.
constexpr long kVatPercent = 14;                              // Egypt VAT
long with_vat(long cents) { return cents + cents * kVatPercent / 100; }

// False DRY avoided: these look alike today but change for different reasons
// (marketing owns promo codes, finance owns late fees), so they stay separate.
long apply_promo(long cents) { return cents - cents * 10 / 100; }
long late_fee(long cents) { return cents * 10 / 100; }

// YAGNI: a plain function for the only shipping rule we have.
// (Not: ShippingStrategy interface + factory + registry for one rule.)
long shipping(long subtotal_cents) { return subtotal_cents >= 500'00 ? 0 : 30'00; }

int main() {
    long subtotal = 450'00;
    long total = with_vat(apply_promo(subtotal)) + shipping(subtotal);
    std::cout << "subtotal 450 -> promo -> VAT -> shipping: total " << total / 100.0 << '\n';
    std::cout << "late fee on 450: " << late_fee(subtotal) / 100.0 << '\n';
    // Third shipping rule requested? THEN extract an interface — the shape is known by then.
}
```

**Output:**
```text
subtotal 450 -> promo -> VAT -> shipping: total 491.7
late fee on 450: 45
```

### Interview answer
"DRY means one source of truth for each piece of knowledge, not merging code that merely looks similar — if two things change for different reasons, I keep them apart. I start with the simplest design (KISS), don't add extension points nobody asked for (YAGNI), and extract an abstraction when a second real variant or an external boundary appears. I'd rather duplicate a little than lock in the wrong abstraction, and I say where the extension point would go."

---

## 4. Encapsulation, abstraction, inheritance, and polymorphism in design

**In one sentence:** in a design, **encapsulation** protects invariants, **abstraction** exposes *what* not *how*, **inheritance** shares a true "is-a" contract, and **polymorphism** lets one call site work with many types — so new types can be added without editing existing code.

### In plain words
- **Encapsulation:** a vending machine. You press buttons; you can't reach in and set the coin count yourself.
- **Abstraction:** a car's pedals. You don't need to know how fuel injection works to drive.
- **Inheritance:** an electric car **is a** car — anywhere a car is expected, it works.
- **Polymorphism:** the same "start" button starts petrol, diesel and electric cars, each in its own way.

### How it works
| Pillar | Design question | C++ tool |
|---|---|---|
| **Encapsulation** | can callers put this object into an invalid state? | private data, validating constructors, methods named for behaviour (`deposit`) not setters (`setBalance`) |
| **Abstraction** | what is the smallest interface the caller needs? | interfaces, pure virtual functions, value types |
| **Inheritance** | does the subtype keep **every** promise of the base (Liskov)? | public inheritance only for true is-a; `final` to forbid more |
| **Polymorphism** | will new types be added? | virtual functions (runtime), templates/concepts (compile time), `std::variant` + `std::visit` (closed set) |

- **"Tell, don't ask":** instead of `if (shape.type == CIRCLE) area = …`, ask the shape for `area()`.
- **Open/closed in practice:** a `switch` on a type field that appears in many places is a sign polymorphism is missing.
- Choose the polymorphism kind: **virtual** when the set of types is open (plugins); **`std::variant`** when the set is closed and you'll add operations often; **templates** when performance matters and types are known at compile time.

#### Modern C++ example — the same problem with runtime polymorphism and with `std::variant`
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <numbers>
#include <string>
#include <variant>
#include <vector>

// Open set of types: virtual functions. Adding Triangle = one new class, no edits elsewhere.
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};
class Circle : public Shape {
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return std::numbers::pi * r_ * r_; }
    std::string name() const override { return "circle"; }
private:
    double r_;                                       // encapsulated: no setter that allows r < 0
};
class Rect : public Shape {
public:
    Rect(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "rect"; }
private:
    double w_, h_;
};

// Closed set of types: std::variant. Adding a new OPERATION = one new visitor, no edits to types.
struct Card { std::string last4; };
struct Wallet { std::string provider; };
struct Cash {};
using Payment = std::variant<Card, Wallet, Cash>;

template <class... F> struct overloaded : F... { using F::operator()...; };

std::string describe(const Payment& p) {
    return std::visit(overloaded{
        [](const Card& c) { return "card ****" + c.last4; },
        [](const Wallet& w) { return w.provider + " wallet"; },
        [](const Cash&) { return std::string("cash on delivery"); },
    }, p);                                           // compiler error if a case is missing
}

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(1.0));
    shapes.push_back(std::make_unique<Rect>(2.0, 3.0));
    double total = 0;
    for (const auto& s : shapes) { std::cout << s->name() << ": " << s->area() << '\n'; total += s->area(); }
    std::cout << "total area: " << total << '\n';

    for (const Payment& p : std::vector<Payment>{Card{"4242"}, Wallet{"Vodafone Cash"}, Cash{}})
        std::cout << describe(p) << '\n';
}
```

**Output:**
```text
circle: 3.14159
rect: 6
total area: 9.14159
card ****4242
Vodafone Cash wallet
cash on delivery
```

### Interview answer
"I use encapsulation to make invalid states unrepresentable, abstraction to give callers the smallest useful interface, inheritance only when the subtype truly keeps the base's contract, and polymorphism so new variants don't require editing existing code. If the set of types is open I use virtual functions; if it's closed and I'll add operations, `std::variant` with `std::visit` gives me compile-time exhaustiveness."

---

## 5. Favor composition over inheritance; identify misuse of hierarchies

**In one sentence:** build behaviour by **combining small objects** (has-a) rather than **deep class trees** (is-a), because inheritance couples a subclass to every detail of its parent and can't change at runtime; use inheritance only for a real substitutable "is-a".

### In plain words
Inheritance is like getting your parents' house with all the furniture glued down. Composition is like furnishing your own house — you pick a sofa, and next year you can swap it.

### How it works
**Classic misuses of inheritance**
| Smell | Example | Why it's wrong | Fix |
|---|---|---|---|
| **Inheriting for code reuse** | `Stack : public std::vector` | a stack now exposes `insert(middle)` and breaks its own rules | hold a `vector` as a member |
| **Breaking Liskov** | `Square : Rectangle` with `setWidth` | setting width changes height — callers' expectations break | separate value types, or immutable shapes |
| **Class explosion** | `FlyingQuackingDuck`, `SwimmingNonQuackingDuck`, … | every combination needs a class (2ⁿ) | compose behaviours (strategy) |
| **Refused bequest** | `Penguin : Bird` with `fly()` throwing | the subclass refuses part of the contract | split interfaces (`Flyer`) |
| **Deep hierarchies** | 5+ levels | fragile base class: a parent change breaks distant children | flatten; prefer interfaces + composition |

- Composition lets you **change behaviour at runtime** (swap the strategy), **test parts alone**, and **combine features** freely.
- **When inheritance is right:** a true is-a with full substitutability, a framework's extension point (an abstract base with hooks), or implementing an interface.

#### Modern C++ example — from a class explosion to composed behaviours
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

// Composition: behaviours are small parts, combined per object and swappable at runtime.
using FlyBehavior = std::function<std::string()>;
using QuackBehavior = std::function<std::string()>;

FlyBehavior wings()      { return [] { return std::string("flaps wings"); }; }
FlyBehavior no_fly()     { return [] { return std::string("cannot fly"); }; }
FlyBehavior rocket()     { return [] { return std::string("flies with a rocket!"); }; }
QuackBehavior quack()    { return [] { return std::string("Quack"); }; }
QuackBehavior squeak()   { return [] { return std::string("Squeak"); }; }

class Duck {
public:
    Duck(std::string name, FlyBehavior f, QuackBehavior q) : name_(std::move(name)), fly_(std::move(f)), quack_(std::move(q)) {}
    void perform() const { std::cout << name_ << ": " << fly_() << ", says " << quack_() << '\n'; }
    void set_fly(FlyBehavior f) { fly_ = std::move(f); }           // change behaviour at runtime
private:
    std::string name_;
    FlyBehavior fly_;
    QuackBehavior quack_;
};

// Misuse avoided: a Stack that HAS a vector exposes only stack operations.
template <typename T>
class Stack {
public:
    void push(T v) { items_.push_back(std::move(v)); }
    T pop() { T v = std::move(items_.back()); items_.pop_back(); return v; }
    bool empty() const { return items_.empty(); }
private:
    std::vector<T> items_;                                         // not "class Stack : public vector"
};

int main() {
    Duck mallard("mallard", wings(), quack());
    Duck rubber("rubber duck", no_fly(), squeak());
    mallard.perform();
    rubber.perform();
    rubber.set_fly(rocket());
    rubber.perform();

    Stack<int> s;
    s.push(1); s.push(2);
    std::cout << "stack pop: " << s.pop() << '\n';                 // s.insert(...) does not even compile
}
```

**Output:**
```text
mallard: flaps wings, says Quack
rubber duck: cannot fly, says Squeak
rubber duck: flies with a rocket!, says Squeak
stack pop: 2
```

### Interview answer
"I default to composition: an object holds small parts — strategies, policies, collaborators — that can vary independently and be swapped at runtime or in tests. Inheritance couples the child to the parent's internals and fixes behaviour at compile time, so I keep it for true substitutable is-a relationships or framework hooks. Red flags are inheriting just to reuse code, subclasses that throw on a base method, Liskov violations like Square–Rectangle, and a combinatorial explosion of subclasses."

---

## 6. SOLID principles applied to practical classes and services

**In one sentence:** SOLID is five guidelines for classes that are easy to change: **S**ingle responsibility, **O**pen/closed, **L**iskov substitution, **I**nterface segregation and **D**ependency inversion — and in practice they mostly mean *small focused classes that depend on small interfaces injected from outside*.

### In plain words
Imagine an online shop's checkout. If one giant class does pricing, payment, email and logging, every change risks breaking everything. SOLID splits it so each part changes alone and new payment methods plug in without surgery.

### How it works
| Principle | Practical question in a review | Typical fix |
|---|---|---|
| **SRP** — one reason to change | "Who would ask for this class to change?" More than one team/person → split. | extract `PriceCalculator`, `ReceiptSender` |
| **OCP** — open for extension, closed for modification | "Adding a payment method means editing a `switch`?" | interface + new class per variant |
| **LSP** — subtypes keep the base's promises | "Can every implementation be used where the interface is expected, without surprises?" | no stronger preconditions, no weaker postconditions, no surprise exceptions |
| **ISP** — no client depends on methods it doesn't use | "Does this implementer leave methods empty or throwing?" | split into role interfaces (`Refundable`) |
| **DIP** — depend on abstractions, inject concretes | "Does business logic `new` a database or HTTP client?" | constructor injection of interfaces |

- Definitions with examples: [OOD Principles → SOLID](../System%20Design/OOD-Principles.md#5-solid-principles).
- Don't apply SOLID **mechanically**: a 20-line script doesn't need five interfaces. Apply it at boundaries that really change (payment providers, storage, notification channels).

#### Modern C++ example — a checkout service designed with SOLID
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Item { std::string sku; long cents; int qty; };

// ISP: small role interfaces. Not every gateway can refund, so refund is separate.
class PaymentGateway {
public:
    virtual ~PaymentGateway() = default;
    virtual bool charge(long cents) = 0;                 // LSP contract: returns false on decline, never throws for a decline
    virtual std::string name() const = 0;
};
class Refundable {
public:
    virtual ~Refundable() = default;
    virtual void refund(long cents) = 0;
};
class ReceiptSender {
public:
    virtual ~ReceiptSender() = default;
    virtual void send(const std::string& text) = 0;
};

// OCP: adding a gateway = adding a class. Checkout is never edited.
class CardGateway : public PaymentGateway, public Refundable {
public:
    bool charge(long cents) override { return cents <= 10'000'00; }
    void refund(long cents) override { std::cout << "card refund " << cents / 100 << '\n'; }
    std::string name() const override { return "card"; }
};
class CashOnDelivery : public PaymentGateway {           // no refund method to fake
public:
    bool charge(long) override { return true; }
    std::string name() const override { return "cash on delivery"; }
};
class ConsoleReceipt : public ReceiptSender {
public:
    void send(const std::string& text) override { std::cout << "receipt: " << text << '\n'; }
};

// SRP: pricing has its own class (finance owns these rules).
class PriceCalculator {
public:
    long total(const std::vector<Item>& items) const {
        long sum = 0;
        for (const auto& i : items) sum += i.cents * i.qty;
        return sum >= 1000'00 ? sum - sum / 20 : sum;    // 5% off big orders
    }
};

// DIP: Checkout depends on abstractions passed in; it never creates a gateway itself.
class Checkout {
public:
    Checkout(const PriceCalculator& prices, PaymentGateway& pay, ReceiptSender& receipts)
        : prices_(prices), pay_(pay), receipts_(receipts) {}
    bool place(const std::vector<Item>& items) {
        long total = prices_.total(items);
        if (!pay_.charge(total)) { receipts_.send("payment declined via " + pay_.name()); return false; }
        receipts_.send("paid " + std::to_string(total / 100) + " via " + pay_.name());
        return true;
    }
private:
    const PriceCalculator& prices_;
    PaymentGateway& pay_;
    ReceiptSender& receipts_;
};

int main() {
    PriceCalculator prices;
    ConsoleReceipt receipts;
    CardGateway card;
    CashOnDelivery cod;

    std::vector<Item> cart{{"kbd", 800'00, 1}, {"mouse", 300'00, 1}};
    Checkout(prices, card, receipts).place(cart);
    Checkout(prices, cod, receipts).place({{"cable", 50'00, 2}});
    Checkout(prices, card, receipts).place({{"server", 20'000'00, 1}});
    card.refund(1045'00);                                // only refundable gateways offer this
}
```

**Output:**
```text
receipt: paid 1045 via card
receipt: paid 100 via cash on delivery
receipt: payment declined via card
card refund 1045
```

### Interview answer
"In practice SOLID means: split classes by who asks for changes (SRP), add variants as new classes behind an interface instead of editing switches (OCP), make every implementation honour the interface contract (LSP), keep interfaces role-sized so nobody implements methods they can't support (ISP), and inject those interfaces into business logic instead of constructing concrete dependencies (DIP). I apply it where change is likely — payments, storage, notifications — not everywhere."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Class / object | state + invariants / one instance |
| Interface | pure virtual methods + virtual destructor; small; callers depend on it |
| Abstract class | shared code + a few pure virtual hooks |
| Composition | has-a; parts injected; swappable at runtime |
| Cohesion / coupling | high inside a module / low between modules |
| Separation of concerns | parsing, rules, storage, presentation in separate places |
| DRY | one source of truth for **knowledge**; similar-looking ≠ duplicate |
| KISS / YAGNI | simplest working design; no speculative extension points |
| Premature abstraction | one implementation, forwarding layers, unused options → remove; rule of three |
| Encapsulation | make invalid states impossible; behaviour methods, not setters |
| Polymorphism choice | virtual (open set) · `std::variant` (closed set) · templates (compile time) |
| Composition over inheritance | inheritance only for real, substitutable is-a |
| Inheritance smells | reuse-only inheritance, Square–Rectangle, refused bequest, 2ⁿ subclasses, deep trees |
| SOLID | small focused classes depending on small injected interfaces |
