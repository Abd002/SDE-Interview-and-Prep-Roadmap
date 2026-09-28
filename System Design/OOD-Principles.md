# Object-Oriented Design Principles — DRY, KISS, YAGNI, Law of Demeter and SOLID

> **What you'll learn:** the principles that separate code that's easy to change from code that fights you: **DRY, KISS, YAGNI, the Law of Demeter**, and the five **SOLID** principles (**S**ingle Responsibility, **O**pen/Closed, **L**iskov Substitution, **I**nterface Segregation, **D**ependency Inversion). Each principle shows a *before* (violating) and *after* (following) version in C++.
>
> **Prerequisites:** [OOP](../Programming%20Languages%20and%20Concepts/OOP.md). Many [design patterns](./Design%20Patterns/Creational-Patterns.md) are these principles applied.

## Table of Contents
1. [DRY (Don't Repeat Yourself)](#1-dry-dont-repeat-yourself)
2. [KISS (Keep It Simple, Stupid)](#2-kiss-keep-it-simple-stupid)
3. [YAGNI (You Aren't Gonna Need It)](#3-yagni-you-arent-gonna-need-it)
4. [Law of Demeter (Principle of Least Knowledge)](#4-law-of-demeter-principle-of-least-knowledge)
5. [SOLID principles](#5-solid-principles)
   - [Single Responsibility Principle (SRP)](#51-single-responsibility-principle-srp)
   - [Open/Closed Principle (OCP)](#52-openclosed-principle-ocp)
   - [Liskov Substitution Principle (LSP)](#53-liskov-substitution-principle-lsp)
   - [Interface Segregation Principle (ISP)](#54-interface-segregation-principle-isp)
   - [Dependency Inversion Principle (DIP)](#55-dependency-inversion-principle-dip)
6. [Cheat sheet](#cheat-sheet)

---

## 1. DRY (Don't Repeat Yourself)

**In one sentence:** every piece of **knowledge** (a rule, a formula, a constant) should have **one single, authoritative place** in the code.

### In plain words
If the tax rate appears in 12 places and the government changes it, you must find and fix all 12 — miss one and your invoices disagree with your receipts. DRY says: define it once, use it everywhere.

### How it works
- Extract repeated logic into a function, class, constant, or configuration.
- DRY is about **knowledge**, not identical-looking text. Two pieces of code that *happen* to look similar but represent different business rules (that will change for different reasons) should **not** be merged — that's the "wrong abstraction" trap. A useful heuristic is the **Rule of Three**: tolerate duplication twice, extract on the third time.
- DRY also applies beyond code: schemas generated from one definition, docs generated from code, one source of truth for config.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>

// BEFORE (not DRY): the tax rule is copy-pasted
double invoice_total_bad(double net)  { return net + net * 0.20; }
double receipt_total_bad(double net)  { return net * 1.2; }        // same rule, written differently
double refund_total_bad(double net)   { return net + net * 0.2; }  // change one, forget the others...

// AFTER (DRY): one authoritative definition
constexpr double kVatRate = 0.20;
constexpr double with_vat(double net) { return net * (1 + kVatRate); }

double invoice_total(double net) { return with_vat(net); }
double receipt_total(double net) { return with_vat(net); }
double refund_total(double net)  { return with_vat(net); }

int main() {
    std::cout << std::format("before: {} {} {}\n", invoice_total_bad(100), receipt_total_bad(100), refund_total_bad(100));
    std::cout << std::format("after:  {} {} {}\n", invoice_total(100), receipt_total(100), refund_total(100));
}
```

**Output:**
```text
before: 120 120 120
after:  120 120 120
```
Same output today — but only the DRY version stays correct when the VAT rate changes.

### Interview answer
"DRY means every piece of knowledge has a single, unambiguous representation, so changes happen in one place. It's about duplicated knowledge rather than similar-looking code; merging coincidentally similar code that changes for different reasons creates the wrong abstraction, so I often apply the rule of three."

---

## 2. KISS (Keep It Simple, Stupid)

**In one sentence:** prefer the **simplest solution that works**; unnecessary complexity is a cost paid by every future reader.

### In plain words
If a paper clip holds your papers together, don't build a motorized binding machine. Simple code is easier to read, test, debug and change. "Clever" code impresses once and confuses forever.

### How it works
- Use the standard library instead of hand-rolled data structures.
- Choose clear names and straightforward control flow over tricks.
- Small functions that do one thing.
- Avoid premature optimization (measure first) and premature generalization (see YAGNI).
- Simple ≠ simplistic: handle the real requirements, just without extra machinery.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>

// BEFORE: "clever" hand-written palindrome check with index gymnastics
bool is_palindrome_clever(const std::string& s) {
    for (std::size_t i = 0, j = s.empty() ? 0 : s.size() - 1; i < j && (s[i] == s[j] || (i = j)); ++i, --j) {}
    return s.empty() || std::equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());
}

// AFTER: says exactly what it means
bool is_palindrome(const std::string& s) {
    return std::equal(s.begin(), s.begin() + s.size() / 2, s.rbegin());   // first half == reversed second half
}

int main() {
    for (const char* w : {"level", "hello", ""})
        std::cout << '"' << w << "\" -> " << std::boolalpha << is_palindrome(w)
                  << " (clever version agrees: " << (is_palindrome(w) == is_palindrome_clever(w)) << ")\n";
}
```

**Output:**
```text
"level" -> true (clever version agrees: true)
"hello" -> false (clever version agrees: true)
"" -> true (clever version agrees: true)
```

### Interview answer
"KISS favors the simplest design that meets the requirements — clear code, standard tools, no speculative machinery — because complexity multiplies maintenance and bug risk. I optimize and generalize only when measurements or real requirements demand it."

---

## 3. YAGNI (You Aren't Gonna Need It)

**In one sentence:** don't build features or flexibility **until you actually need them**.

### In plain words
Buying a 12-seat dining table "in case we have big parties someday" — you pay for it, it takes up space every day, and the party may never come. In code, "future-proof" plugin systems, config options and abstractions that nobody uses cost time to write, test, read and maintain — and usually guess the future wrong.

### How it works
- Implement what today's requirements need; design so it's **easy to change later** (clean, tested, small pieces) rather than predicting every future need.
- Watch for phrases like "we might need…", "just in case…", "let's make it generic…".
- YAGNI doesn't mean ignoring obvious, imminent needs or skipping good structure — it's about *speculative* features.
- Comes from Extreme Programming (XP); pairs naturally with KISS and refactoring.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// BEFORE (YAGNI violation): the only requirement is "greet a user by name",
// but we built a pluggable, localized, templated greeting framework "for later".
//   class GreetingStrategyFactoryRegistry { ... 200 lines ... };
//   class LocaleAwareTemplateRenderer    { ... 300 lines ... };

// AFTER: exactly what is needed today. Easy to extend WHEN a real need appears.
std::string greet(const std::string& name) { return "Hello, " + name + "!"; }

int main() { std::cout << greet("Ana") << '\n'; }
```

**Output:**
```text
Hello, Ana!
```

### Interview answer
"YAGNI says don't implement functionality until it's actually required. Speculative features and abstractions cost effort now and maintenance forever, and often guess wrong. Instead I keep code simple and well-tested so it's cheap to extend when the need is real."

---

## 4. Law of Demeter (Principle of Least Knowledge)

**In one sentence:** an object should talk only to its **immediate friends**, not to strangers reached through them — "don't talk to strangers".

### In plain words
At a shop, you pay the cashier. You don't reach into the cashier's pocket, take out their wallet, open the till and make change yourself. In code, `order.customer().wallet().debit(10)` is reaching into pockets: your code now depends on how customers store wallets. Better: `order.charge(10)` — let the order deal with its own internals.

### How it works
A method `m` of object `O` should only call methods on:
1. `O` itself,
2. `m`'s parameters,
3. objects `m` creates,
4. `O`'s direct members.

Symptom of violation: **train wrecks** — long chains `a.b().c().d()`. Fix: **"Tell, don't ask"** — tell the object what you want done, instead of asking for its internals and doing it yourself.
- Benefit: lower coupling; internal changes don't ripple outward.
- Not a rule against fluent APIs/builders that return `*this` (they don't reach into other objects), or against simple data structs.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>

class Wallet {
public:
    explicit Wallet(double b) : balance_(b) {}
    void debit(double amount) {
        if (amount > balance_) throw std::runtime_error("insufficient funds");
        balance_ -= amount;
    }
    double balance() const { return balance_; }
private:
    double balance_;
};

class Customer {
public:
    explicit Customer(double money) : wallet_(money) {}
    Wallet& wallet() { return wallet_; }              // exposes internals (enables violations)
    void pay(double amount) { wallet_.debit(amount); } // "tell" interface
    double balance() const { return wallet_.balance(); }
private:
    Wallet wallet_;
};

class Order {
public:
    Order(Customer& c, double total) : customer_(c), total_(total) {}
    Customer& customer() { return customer_; }
    void charge() { customer_.pay(total_); }          // tell, don't ask
private:
    Customer& customer_;
    double total_;
};

int main() {
    Customer ana(100);
    Order o1(ana, 30), o2(ana, 20);

    o1.customer().wallet().debit(30);   // BEFORE: train wreck; caller knows Customer has a Wallet
    o2.charge();                        // AFTER: caller only knows Order
    std::cout << "balance: " << ana.balance() << '\n';
}
```

**Output:**
```text
balance: 50
```

### Interview answer
"The Law of Demeter says a method should only interact with itself, its parameters, objects it creates and its direct components, avoiding chains through other objects' internals. Following 'tell, don't ask' reduces coupling so internal structure can change without rippling through callers."

---

## 5. SOLID principles

Five principles (collected by Robert C. Martin) for classes and modules that are easy to understand, extend and test.

### 5.1 Single Responsibility Principle (SRP)

**In one sentence:** a class should have **one reason to change** — it should serve one actor / one responsibility.

#### In plain words
A Swiss-army knife is handy, but if the scissors break you send the whole knife for repair and lose the screwdriver too. A class that computes pay, formats reports **and** saves to the database changes whenever accounting rules, report layout **or** the database changes — three teams editing one file, stepping on each other.

#### How it works
- Ask: "who would request a change to this class?" If the answer is several different people/teams (actors), split it.
- Keep business rules, presentation and persistence in separate classes.
- Result: smaller classes, fewer merge conflicts, easier tests.

#### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Employee { std::string name; double hours, rate; };

// BEFORE: one class, three reasons to change
class EmployeeManagerBad {
public:
    double pay(const Employee& e) { return e.hours * e.rate; }                      // accounting
    std::string report(const Employee& e) { return e.name + ": " + std::to_string(pay(e)); }  // formatting
    void save(const Employee&) { /* SQL here */ }                                   // database
};

// AFTER: one responsibility each
class PayCalculator {                        // changes when pay rules change (finance)
public:
    double pay(const Employee& e) const { return e.hours * e.rate + (e.hours > 40 ? (e.hours - 40) * e.rate * 0.5 : 0); }
};
class PayslipFormatter {                     // changes when the layout changes (HR)
public:
    std::string format(const Employee& e, double pay) const { return std::format("{:<5} ${:>8.2f}", e.name, pay); }
};
class EmployeeRepository {                   // changes when storage changes (DBAs)
public:
    void save(const Employee& e) { saved_.push_back(e.name); }
    std::size_t count() const { return saved_.size(); }
private:
    std::vector<std::string> saved_;
};

int main() {
    PayCalculator calc;
    PayslipFormatter fmt;
    EmployeeRepository repo;
    for (const Employee& e : {Employee{"Ana", 40, 25}, Employee{"Ben", 45, 20}}) {
        std::cout << fmt.format(e, calc.pay(e)) << '\n';
        repo.save(e);
    }
    std::cout << "saved " << repo.count() << " employees\n";
}
```

**Output:**
```text
Ana   $ 1000.00
Ben   $  950.00
saved 2 employees
```

#### Interview answer
"SRP says a module should have one reason to change, meaning it serves one actor. I separate business rules, presentation and persistence so each can change and be tested independently."

### 5.2 Open/Closed Principle (OCP)

**In one sentence:** software entities should be **open for extension but closed for modification** — you add new behavior by adding code, not by editing working code.

#### In plain words
A power strip: to power a new device you **plug it in** — you don't rewire the strip. If every new payment method means editing a giant `switch` in the checkout code, you risk breaking the existing methods every time.

#### How it works
- Identify what varies (payment methods, shapes, export formats), put it behind an **abstraction** (interface, `std::function`, template, `std::variant` + visitor), and make the stable code depend on that abstraction.
- New variants = new classes/lambdas; the core stays untouched (and its tests keep passing).
- Patterns that implement OCP: Strategy, Decorator, Observer, Factory/registry, Template Method, plugins.
- Don't over-apply: add extension points where variation is real (YAGNI).

#### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

// BEFORE: every new method means modifying this function
double fee_bad(const std::string& method, double amount) {
    if (method == "card") return amount * 0.029;
    if (method == "paypal") return amount * 0.034;
    // adding "crypto" = editing (and re-testing) this function
    return 0;
}

// AFTER: closed for modification, open for extension
struct PaymentMethod {
    virtual ~PaymentMethod() = default;
    virtual std::string name() const = 0;
    virtual double fee(double amount) const = 0;
};
struct Card   : PaymentMethod { std::string name() const override { return "card"; }   double fee(double a) const override { return a * 0.029; } };
struct PayPal : PaymentMethod { std::string name() const override { return "paypal"; } double fee(double a) const override { return a * 0.034; } };
// Extension: a NEW class; nothing above was touched.
struct Crypto : PaymentMethod { std::string name() const override { return "crypto"; } double fee(double) const override { return 1.0; } };

double total_fees(const std::vector<std::unique_ptr<PaymentMethod>>& methods, double amount) {
    double sum = 0;
    for (const auto& m : methods) {
        std::cout << "  " << m->name() << " fee: " << m->fee(amount) << '\n';
        sum += m->fee(amount);
    }
    return sum;
}

int main() {
    std::vector<std::unique_ptr<PaymentMethod>> methods;
    methods.push_back(std::make_unique<Card>());
    methods.push_back(std::make_unique<PayPal>());
    methods.push_back(std::make_unique<Crypto>());
    std::cout << "fees on $100:\n";
    double total = total_fees(methods, 100);
    std::cout << "total: " << total << "  (old switch gave card=" << fee_bad("card", 100) << ")\n";
}
```

**Output:**
```text
fees on $100:
  card fee: 2.9
  paypal fee: 3.4
  crypto fee: 1
total: 7.3  (old switch gave card=2.9)
```

#### Interview answer
"OCP says modules should be extendable without modifying existing, tested code. I isolate the axis of variation behind an abstraction — interface, callable, variant — so new behavior is added as new code, as in Strategy or plugin registries, applying it only where variation is expected."

### 5.3 Liskov Substitution Principle (LSP)

**In one sentence:** objects of a subclass must be usable **anywhere the base class is expected** without breaking the program — a subclass must honor the base class's promises.

#### In plain words
If a recipe says "use any **bird** egg", a chocolate egg shaped like a bird egg shouldn't be allowed to pretend it's one — the omelette fails. A subclass that "is-a" base class in name but behaves differently breaks every piece of code written against the base.

The classic example: **a Square is not a proper subclass of Rectangle** (in a mutable design). Code that sets width = 5 and height = 4 expects area 20; a Square that forces both sides equal returns 16.

#### How it works
A subclass must:
- accept **at least** the inputs the base accepts (preconditions can't be strengthened),
- deliver **at least** what the base promises (postconditions can't be weakened),
- keep the base's **invariants**,
- not throw new unexpected exceptions for valid base usage.

Symptoms of violation: `dynamic_cast`/type checks in client code, overridden methods that throw "not supported", "empty" overrides. Fixes: rethink the hierarchy (separate interfaces), prefer composition, make objects immutable.

#### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>

// BEFORE: Square "is-a" Rectangle, but breaks Rectangle's behavior
class Rectangle {
public:
    virtual ~Rectangle() = default;
    virtual void set_width(int w) { w_ = w; }
    virtual void set_height(int h) { h_ = h; }
    int area() const { return w_ * h_; }
protected:
    int w_ = 0, h_ = 0;
};
class Square : public Rectangle {
public:
    void set_width(int w) override { w_ = h_ = w; }     // silently changes height too
    void set_height(int h) override { w_ = h_ = h; }
};

// Client code written (correctly) against Rectangle's contract:
void resize_to_5x4(Rectangle& r) {
    r.set_width(5);
    r.set_height(4);
    std::cout << "  expected area 20, got " << r.area() << (r.area() == 20 ? "" : "  <- LSP violated") << '\n';
}

// AFTER: separate immutable shapes sharing only what they truly share
struct Shape { virtual ~Shape() = default; virtual int area() const = 0; };
struct Rect : Shape { int w, h; Rect(int w_, int h_) : w(w_), h(h_) {} int area() const override { return w * h; } };
struct Sq   : Shape { int side; explicit Sq(int s) : side(s) {} int area() const override { return side * side; } };

int main() {
    Rectangle r; Square s;
    std::cout << "Rectangle:\n"; resize_to_5x4(r);
    std::cout << "Square used as Rectangle:\n"; resize_to_5x4(s);

    const Rect rect(5, 4); const Sq sq(4);
    const Shape* shapes[] = {&rect, &sq};
    for (const Shape* sh : shapes) std::cout << "area " << sh->area() << '\n';   // every Shape keeps its promise
}
```

**Output:**
```text
Rectangle:
  expected area 20, got 20
Square used as Rectangle:
  expected area 20, got 16  <- LSP violated
area 20
area 16
```

#### Interview answer
"LSP requires that subtypes be substitutable for their base types without altering correctness: they can't strengthen preconditions, weaken postconditions or break invariants. The mutable Square-extends-Rectangle example violates it. Signs are type checks or 'not supported' overrides; fixes are better abstractions, composition or immutability."

### 5.4 Interface Segregation Principle (ISP)

**In one sentence:** clients should not be forced to depend on methods they **don't use** — prefer several small, focused interfaces over one "fat" interface.

#### In plain words
A TV remote with 80 buttons when you only use 5. Or a job contract that requires a cashier to also "fly the company plane". If a simple printer must implement `scan()`, `fax()` and `staple()` just to satisfy a giant `Machine` interface, it ends up with fake methods that throw "not supported" — and anything that changes in `fax()` forces printer code to recompile.

#### How it works
- Split fat interfaces by **client needs** (roles): `Printer`, `Scanner`, `Fax`.
- A class implements only the roles it supports; multi-function devices implement several.
- Clients depend on the smallest interface they need → fewer rebuilds, easier testing (tiny mocks).
- In modern C++, **concepts** naturally express small, role-based requirements.

#### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// BEFORE: one fat interface forces fake implementations
struct MachineFat {
    virtual ~MachineFat() = default;
    virtual void print(const std::string& doc) = 0;
    virtual void scan(const std::string& doc) = 0;
    virtual void fax(const std::string& doc) = 0;
};

// AFTER: small role interfaces
struct Printer { virtual ~Printer() = default; virtual void print(const std::string& doc) = 0; };
struct Scanner { virtual ~Scanner() = default; virtual void scan(const std::string& doc) = 0; };

struct SimplePrinter : Printer {                       // only what it can do
    void print(const std::string& doc) override { std::cout << "printing " << doc << '\n'; }
};
struct OfficeCopier : Printer, Scanner {              // combines roles
    void print(const std::string& doc) override { std::cout << "copier printing " << doc << '\n'; }
    void scan(const std::string& doc) override { std::cout << "copier scanning " << doc << '\n'; }
};

void print_invoice(Printer& p) { p.print("invoice.pdf"); }   // depends ONLY on printing
void archive(Scanner& s)       { s.scan("contract.pdf"); }

int main() {
    SimplePrinter home;
    OfficeCopier office;
    print_invoice(home);
    print_invoice(office);
    archive(office);
    // archive(home);   // compile error: a SimplePrinter is not a Scanner — no fake scan() needed
}
```

**Output:**
```text
printing invoice.pdf
copier printing invoice.pdf
copier scanning contract.pdf
```

#### Interview answer
"ISP says no client should depend on methods it doesn't use. I split fat interfaces into cohesive role interfaces so implementers don't need stub methods and clients are insulated from unrelated changes; in C++, small abstract classes or concepts express these roles."

### 5.5 Dependency Inversion Principle (DIP)

**In one sentence:** high-level business logic should not depend on low-level details (databases, email servers, file formats); **both should depend on abstractions**, and details plug into those abstractions.

#### In plain words
A lamp doesn't have wires **soldered** into the power plant; it has a **plug** that fits a standard socket. Any power source that provides the socket works — the grid, a generator, a battery pack. Your `OrderService` shouldn't construct a `MySqlDatabase` and `SmtpMailer` internally; it should declare "I need something that can save orders and something that can send notifications", and be *given* them.

#### How it works
- Define interfaces **owned by the high-level module** (`OrderRepository`, `Notifier`).
- Low-level modules implement them (`PostgresOrderRepository`, `EmailNotifier`).
- Wire them together at the edge of the program (`main`, a DI container) — **dependency injection** via constructor parameters.
- Big win: **testability** — inject in-memory fakes in unit tests; swap infrastructure without touching business logic.
- DIP (a design principle) ≠ dependency injection (a technique to achieve it), but they go together.

#### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

// Abstractions owned by the business layer:
struct OrderRepository { virtual ~OrderRepository() = default; virtual void save(const std::string& order) = 0; };
struct Notifier        { virtual ~Notifier() = default;        virtual void notify(const std::string& msg) = 0; };

// High-level policy: depends only on the abstractions above.
class OrderService {
public:
    OrderService(OrderRepository& repo, Notifier& notifier) : repo_(repo), notifier_(notifier) {}  // injected
    void place(const std::string& order) {
        repo_.save(order);
        notifier_.notify("order placed: " + order);
    }
private:
    OrderRepository& repo_;
    Notifier& notifier_;
};

// Low-level details (production):
struct PostgresRepository : OrderRepository { void save(const std::string& o) override { std::cout << "  INSERT INTO orders VALUES ('" << o << "')\n"; } };
struct EmailNotifier : Notifier { void notify(const std::string& m) override { std::cout << "  email: " << m << '\n'; } };

// Test doubles (unit tests): no database, no network.
struct InMemoryRepository : OrderRepository { std::vector<std::string> saved; void save(const std::string& o) override { saved.push_back(o); } };
struct FakeNotifier : Notifier { int sent = 0; void notify(const std::string&) override { ++sent; } };

int main() {
    std::cout << "production wiring:\n";
    PostgresRepository db; EmailNotifier email;
    OrderService(db, email).place("book #42");

    std::cout << "test wiring:\n";
    InMemoryRepository repo; FakeNotifier fake;
    OrderService service(repo, fake);
    service.place("book #42");
    std::cout << "  saved=" << repo.saved.size() << " notifications=" << fake.sent
              << (repo.saved.size() == 1 && fake.sent == 1 ? "  -> test PASSED\n" : "  -> test FAILED\n");
}
```

**Output:**
```text
production wiring:
  INSERT INTO orders VALUES ('book #42')
  email: order placed: book #42
test wiring:
  saved=1 notifications=1  -> test PASSED
```

#### Interview answer
"DIP says high-level modules shouldn't depend on low-level modules; both depend on abstractions, and the abstractions are owned by the policy layer. I apply it with constructor dependency injection, wiring concrete implementations at the composition root, which makes business logic independent of infrastructure and easy to unit-test with fakes."

---

## Cheat sheet

| Principle | One-liner | Smell when violated |
|---|---|---|
| DRY | One source of truth per piece of knowledge | Same rule copy-pasted |
| KISS | Simplest thing that works | "Clever" code nobody understands |
| YAGNI | Don't build it until you need it | Unused options, speculative frameworks |
| Law of Demeter | Talk only to immediate friends | `a.b().c().d()` train wrecks |
| **S**RP | One reason to change | God classes, many teams edit one file |
| **O**CP | Extend by adding, not editing | Growing `switch` on types |
| **L**SP | Subtypes keep the base's promises | `dynamic_cast` checks, "not supported" overrides |
| **I**SP | Small role interfaces | Stub methods that throw |
| **D**IP | Depend on abstractions; inject details | `new MySqlDb()` inside business logic, untestable code |
