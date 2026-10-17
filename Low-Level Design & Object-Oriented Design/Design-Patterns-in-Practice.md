# Design Patterns in Practice — The Patterns You Actually Use in Low-Level Design

> **What you'll learn:** how the most useful patterns solve **real design problems** in LLD interviews and production code: Adapter/Facade for external services, Builder, Command (undo and job queues), Decorator/Proxy (wrapping behaviour), dependency injection, Factory/Abstract Factory, Observer/Pub-Sub, Repository/Unit of Work, State, Strategy — and **when not to use a pattern at all**. Each part has a runnable C++ example.
>
> **Prerequisites:** the pattern definitions in [Creational](../System%20Design/Design%20Patterns/Creational-Patterns.md), [Structural](../System%20Design/Design%20Patterns/Structural-Patterns.md) and [Behavioral](../System%20Design/Design%20Patterns/Behavioral-Patterns.md) patterns. This guide focuses on **applying** them.

## Table of Contents
1. [Adapter / Facade for external integration](#1-adapter--facade-for-external-integration)
2. [Builder for complex object construction](#2-builder-for-complex-object-construction)
3. [Command pattern for undo, queues, and operations](#3-command-pattern-for-undo-queues-and-operations)
4. [Decorator / Proxy for behavior interception](#4-decorator--proxy-for-behavior-interception)
5. [Dependency injection and inversion of control](#5-dependency-injection-and-inversion-of-control)
6. [Factory / Abstract Factory for object creation and extensibility](#6-factory--abstract-factory-for-object-creation-and-extensibility)
7. [Observer / Pub-Sub for state-change notifications](#7-observer--pub-sub-for-state-change-notifications)
8. [Recognize when not to introduce a design pattern](#8-recognize-when-not-to-introduce-a-design-pattern)
9. [Repository / Unit of Work for persistence boundaries](#9-repository--unit-of-work-for-persistence-boundaries)
10. [State pattern for workflow transitions](#10-state-pattern-for-workflow-transitions)
11. [Strategy for configurable behavior](#11-strategy-for-configurable-behavior)
12. [Cheat sheet](#cheat-sheet)

---

## 1. Adapter / Facade for external integration

**In one sentence:** an **Adapter** converts a third-party API into **the interface your code expects**, and a **Facade** hides a **complicated subsystem** behind one simple interface — together they keep vendor details out of your business logic.

### In plain words
- **Adapter:** a travel plug adapter. Your laptop (your code) has one plug shape; the wall (the vendor SDK) has another.
- **Facade:** a hotel concierge. You say "book me dinner and a taxi"; they deal with the restaurant, the taxi company and the payment.

### How it works
- Define **your** interface in **your** terms (`PaymentGateway::charge(Money)`), then write one adapter per vendor (`StripeAdapter`, `PaymobAdapter`) that translates units, errors and naming.
- The adapter is the **only** place that knows the vendor's types; switching vendors or faking them in tests touches only it (an "anti-corruption layer").
- A facade **doesn't** add new behaviour; it orders the calls (`Checkout::place` calls inventory, payment and shipping in the right order).
- Translate errors too: vendor exceptions or codes → your domain errors.

#### Modern C++ example — two payment vendors behind one interface, and a checkout facade
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

// --- Vendor SDKs we don't control (different units, names, error styles) ---
struct VendorA { int make_payment(double amount_dollars) { return amount_dollars < 1000 ? 0 : 402; } };       // 0 = ok
struct VendorB { bool pay(long piasters, std::string& err) { if (piasters > 50'000'00) { err = "LIMIT"; return false; } return true; } };

// --- Our interface, in our terms ---
struct PaymentResult { bool ok; std::string reason; };
class PaymentGateway {
public:
    virtual ~PaymentGateway() = default;
    virtual PaymentResult charge(long cents) = 0;
};

class VendorAAdapter : public PaymentGateway {        // adapter: units + error codes translated
public:
    PaymentResult charge(long cents) override {
        int code = sdk_.make_payment(cents / 100.0);
        return code == 0 ? PaymentResult{true, ""} : PaymentResult{false, "declined (vendor A code " + std::to_string(code) + ")"};
    }
private:
    VendorA sdk_;
};
class VendorBAdapter : public PaymentGateway {
public:
    PaymentResult charge(long cents) override {
        std::string err;
        return sdk_.pay(cents, err) ? PaymentResult{true, ""} : PaymentResult{false, "declined (vendor B: " + err + ")"};
    }
private:
    VendorB sdk_;
};

struct Inventory { bool reserve(const std::string& sku) { std::cout << "  reserved " << sku << '\n'; return true; } };
struct Shipping { std::string book(const std::string& sku) { return "TRACK-" + sku; } };

class CheckoutFacade {                                  // facade: one call hides three subsystems
public:
    explicit CheckoutFacade(std::unique_ptr<PaymentGateway> pay) : pay_(std::move(pay)) {}
    std::string buy(const std::string& sku, long cents) {
        if (!inventory_.reserve(sku)) return "out of stock";
        auto r = pay_->charge(cents);
        if (!r.ok) return r.reason;
        return "ok, " + shipping_.book(sku);
    }
private:
    Inventory inventory_;
    Shipping shipping_;
    std::unique_ptr<PaymentGateway> pay_;
};

int main() {
    CheckoutFacade a(std::make_unique<VendorAAdapter>());
    CheckoutFacade b(std::make_unique<VendorBAdapter>());
    std::string r1 = a.buy("kbd", 500'00);
    std::cout << "A small: " << r1 << '\n';
    std::string r2 = a.buy("tv", 2000'00);
    std::cout << "A big:   " << r2 << '\n';
    std::string r3 = b.buy("tv", 2000'00);
    std::cout << "B big:   " << r3 << '\n';
}
```

**Output:**
```text
  reserved kbd
A small: ok, TRACK-kbd
  reserved tv
A big:   declined (vendor A code 402)
  reserved tv
B big:   ok, TRACK-tv
```

### Interview answer
"I define the interface my domain needs and wrap each external SDK in an adapter that translates units, names and errors — so the vendor is swappable and fakeable in tests. When a use case needs several subsystems in a fixed order, a facade gives callers one simple entry point without adding new behaviour."

---

## 2. Builder for complex object construction

**In one sentence:** a Builder constructs an object **step by step with named, optional settings** and **validates everything once** in `build()`, instead of a constructor with ten positional parameters.

### In plain words
Ordering a custom pizza: "large, thin crust, extra cheese, no onions." You say each choice by name, in any order, and the kitchen checks it makes sense before baking.

### How it works
- Avoids **telescoping constructors** (`Request(url, method, timeout, retries, headers, body, …)`) and half-built objects.
- **Fluent API:** each setter returns `*this`, so calls chain.
- `build()` checks **cross-field rules** ("POST needs a body", "timeout > 0") and returns an **immutable** object.
- In modern C++, a plain **aggregate with designated initializers** (`Config{.timeout_ms = 500}`) is often enough — use a builder when you need validation, defaults computed from other fields, or many optional parts.

#### Modern C++ example — an HTTP request builder with validation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>

class HttpRequest {
public:
    class Builder;
    void print() const {
        std::cout << method_ << ' ' << url_ << " timeout=" << timeout_ms_ << "ms retries=" << retries_;
        for (const auto& [k, v] : headers_) std::cout << " [" << k << ": " << v << ']';
        if (!body_.empty()) std::cout << " body=" << body_;
        std::cout << '\n';
    }
private:
    HttpRequest() = default;                              // only the builder creates it
    std::string method_ = "GET", url_, body_;
    int timeout_ms_ = 1000, retries_ = 0;
    std::map<std::string, std::string> headers_;
};

class HttpRequest::Builder {
public:
    explicit Builder(std::string url) { r_.url_ = std::move(url); }
    Builder& method(std::string m) { r_.method_ = std::move(m); return *this; }
    Builder& header(std::string k, std::string v) { r_.headers_[std::move(k)] = std::move(v); return *this; }
    Builder& body(std::string b) { r_.body_ = std::move(b); return *this; }
    Builder& timeout_ms(int t) { r_.timeout_ms_ = t; return *this; }
    Builder& retries(int n) { r_.retries_ = n; return *this; }
    HttpRequest build() const {                           // all rules checked in one place
        if (r_.url_.rfind("https://", 0) != 0) throw std::invalid_argument("https only");
        if (r_.timeout_ms_ <= 0) throw std::invalid_argument("timeout must be positive");
        if ((r_.method_ == "POST" || r_.method_ == "PUT") && r_.body_.empty()) throw std::invalid_argument(r_.method_ + " needs a body");
        if (r_.method_ == "POST" && r_.retries_ > 0 && !r_.headers_.count("Idempotency-Key"))
            throw std::invalid_argument("retried POST needs an Idempotency-Key");
        return r_;
    }
private:
    HttpRequest r_;
};

int main() {
    HttpRequest::Builder("https://api.example.com/users").timeout_ms(300).build().print();
    HttpRequest::Builder("https://api.example.com/orders")
        .method("POST").body(R"({"sku":"kbd"})").retries(3).header("Idempotency-Key", "a1b2").build().print();
    for (auto make : {+[] { return HttpRequest::Builder("http://insecure").build(); },
                      +[] { return HttpRequest::Builder("https://x").method("POST").body("{}").retries(2).build(); }}) {
        try { make(); } catch (const std::exception& e) { std::cout << "rejected: " << e.what() << '\n'; }
    }
}
```

**Output:**
```text
GET https://api.example.com/users timeout=300ms retries=0
POST https://api.example.com/orders timeout=1000ms retries=3 [Idempotency-Key: a1b2] body={"sku":"kbd"}
rejected: https only
rejected: retried POST needs an Idempotency-Key
```

### Interview answer
"I use a builder when an object has many optional parts and rules that span several fields: named fluent setters make call sites readable, and `build()` validates everything once and returns an immutable object, so a half-configured instance never exists. For simple configs, an aggregate with designated initializers is enough."

---

## 3. Command pattern for undo, queues, and operations

**In one sentence:** a Command turns **a request into an object** (with `execute()` and often `undo()`), so operations can be **queued, logged, retried, scheduled or undone**.

### In plain words
A restaurant order slip. The waiter doesn't cook; they write the order on a slip. The slip can wait in a queue, be handed to any cook, be cancelled, or be kept as a record of what was ordered.

### How it works
- **Undo/redo:** keep a stack of executed commands; `undo()` pops and reverses. Redo uses a second stack.
- **Job queues:** commands sit in a queue and workers execute them (see [Queues → thread pool](../Data%20Structures/Queues.md#2-applications-eg-bfs-job-scheduling)).
- **Audit / replay:** store commands to replay them (event-sourcing style) or to show history.
- **Macro commands:** a command made of commands.
- Each command must hold **everything needed to undo**, e.g. the old value it overwrote.

#### Modern C++ example — a text editor with undo/redo and a macro
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stack>
#include <string>
#include <vector>

struct Document { std::string text; };

class Command {
public:
    virtual ~Command() = default;
    virtual void execute(Document&) = 0;
    virtual void undo(Document&) = 0;
};

class Insert : public Command {
public:
    Insert(std::size_t pos, std::string s) : pos_(pos), s_(std::move(s)) {}
    void execute(Document& d) override { d.text.insert(pos_, s_); }
    void undo(Document& d) override { d.text.erase(pos_, s_.size()); }
private:
    std::size_t pos_; std::string s_;
};
class Erase : public Command {
public:
    Erase(std::size_t pos, std::size_t n) : pos_(pos), n_(n) {}
    void execute(Document& d) override { removed_ = d.text.substr(pos_, n_); d.text.erase(pos_, n_); }
    void undo(Document& d) override { d.text.insert(pos_, removed_); }        // remembered what it removed
private:
    std::size_t pos_, n_; std::string removed_;
};
class Macro : public Command {
public:
    void add(std::unique_ptr<Command> c) { parts_.push_back(std::move(c)); }
    void execute(Document& d) override { for (auto& c : parts_) c->execute(d); }
    void undo(Document& d) override { for (auto it = parts_.rbegin(); it != parts_.rend(); ++it) (*it)->undo(d); }
private:
    std::vector<std::unique_ptr<Command>> parts_;
};

class Editor {
public:
    void run(std::unique_ptr<Command> c) { c->execute(doc_); done_.push(std::move(c)); redo_ = {}; show("run "); }
    void undo() { if (done_.empty()) return; done_.top()->undo(doc_); redo_.push(std::move(done_.top())); done_.pop(); show("undo"); }
    void redo() { if (redo_.empty()) return; redo_.top()->execute(doc_); done_.push(std::move(redo_.top())); redo_.pop(); show("redo"); }
private:
    void show(const char* what) const { std::cout << what << ": \"" << doc_.text << "\"\n"; }
    Document doc_;
    std::stack<std::unique_ptr<Command>> done_, redo_;
};

int main() {
    Editor ed;
    ed.run(std::make_unique<Insert>(0, "Hello world"));
    ed.run(std::make_unique<Erase>(5, 6));
    ed.undo();
    ed.redo();
    auto greet = std::make_unique<Macro>();
    greet->add(std::make_unique<Insert>(5, ", Cairo"));
    greet->add(std::make_unique<Insert>(12, "!"));
    ed.run(std::move(greet));
    ed.undo();                                            // undoes the whole macro at once
}
```

**Output:**
```text
run : "Hello world"
run : "Hello"
undo: "Hello world"
redo: "Hello"
run : "Hello, Cairo!"
undo: "Hello"
```

### Interview answer
"Command wraps an operation and its parameters in an object with `execute` and `undo`. That lets me keep undo and redo stacks, push operations onto a job queue, log or replay them, and group them into macros. The key detail is that each command stores what it needs to reverse itself, like the text an erase removed."

---

## 4. Decorator / Proxy for behavior interception

**In one sentence:** a **Decorator** wraps an object with **the same interface** to **add behaviour** (logging, caching, retries, metrics), and a **Proxy** wraps it to **control access** (lazy loading, permission checks, remote calls, rate limits) — the caller can't tell the difference.

### In plain words
- **Decorator:** putting a phone in a case with a battery pack. Still a phone, now with more battery.
- **Proxy:** a receptionist in front of the CEO. Same "talk to the CEO" request, but someone decides whether and when you get through.

### How it works
- Both implement the same interface and hold the wrapped object.
- **Stackable:** `Retry(Cache(Logging(RealService)))` — each layer does one thing (SRP) and they compose in any order. **Order matters:** caching outside retries means cached hits skip retries.
- Typical decorators: logging, metrics, caching, retry with backoff, compression, encryption, timeouts.
- Typical proxies: **virtual** proxy (create the expensive object on first use), **protection** proxy (check permissions), **remote** proxy (gRPC stub), **rate-limiting** proxy.
- Middleware in web frameworks and gRPC interceptors are this pattern.

#### Modern C++ example — retry + cache decorators and a permission proxy around a flaky service
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <set>
#include <stdexcept>
#include <string>

class UserService {
public:
    virtual ~UserService() = default;
    virtual std::string get_name(int id) = 0;
};

class RemoteUserService : public UserService {            // the real thing: slow and flaky
public:
    std::string get_name(int id) override {
        ++calls;
        if (calls % 2 == 1) throw std::runtime_error("timeout");   // every other call fails
        return "user" + std::to_string(id);
    }
    int calls = 0;
};

class RetryDecorator : public UserService {
public:
    RetryDecorator(std::unique_ptr<UserService> inner, int attempts) : inner_(std::move(inner)), attempts_(attempts) {}
    std::string get_name(int id) override {
        for (int a = 1;; ++a) {
            try { return inner_->get_name(id); }
            catch (const std::exception& e) { std::cout << "  retry " << a << " after: " << e.what() << '\n'; if (a == attempts_) throw; }
        }
    }
private:
    std::unique_ptr<UserService> inner_; int attempts_;
};

class CacheDecorator : public UserService {
public:
    explicit CacheDecorator(std::unique_ptr<UserService> inner) : inner_(std::move(inner)) {}
    std::string get_name(int id) override {
        if (auto it = cache_.find(id); it != cache_.end()) { std::cout << "  cache hit " << id << '\n'; return it->second; }
        return cache_[id] = inner_->get_name(id);
    }
private:
    std::unique_ptr<UserService> inner_; std::map<int, std::string> cache_;
};

class PermissionProxy : public UserService {               // controls access, same interface
public:
    PermissionProxy(std::unique_ptr<UserService> inner, std::set<int> allowed) : inner_(std::move(inner)), allowed_(std::move(allowed)) {}
    std::string get_name(int id) override {
        if (!allowed_.count(id)) throw std::runtime_error("forbidden");
        return inner_->get_name(id);
    }
private:
    std::unique_ptr<UserService> inner_; std::set<int> allowed_;
};

int main() {
    auto real = std::make_unique<RemoteUserService>();
    RemoteUserService* raw = real.get();
    std::unique_ptr<UserService> svc =
        std::make_unique<PermissionProxy>(
            std::make_unique<CacheDecorator>(std::make_unique<RetryDecorator>(std::move(real), 3)),
            std::set<int>{1, 2});
    for (int id : {1, 1, 2, 3}) {
        try { std::string name = svc->get_name(id); std::cout << "get_name(" << id << ") = " << name << '\n'; }
        catch (const std::exception& e) { std::cout << "get_name(" << id << ") failed: " << e.what() << '\n'; }
    }
    std::cout << "remote calls made: " << raw->calls << '\n';
}
```

**Output:**
```text
  retry 1 after: timeout
get_name(1) = user1
  cache hit 1
get_name(1) = user1
  retry 1 after: timeout
get_name(2) = user2
get_name(3) failed: forbidden
remote calls made: 4
```

### Interview answer
"Decorator and Proxy both wrap an object behind the same interface. I use decorators to add cross-cutting behaviour — retries, caching, logging, metrics — as small stackable layers, and proxies to control access — permission checks, lazy creation, rate limiting or a remote stub. The caller doesn't change, and the order of the layers is a deliberate design choice."

---

## 5. Dependency injection and inversion of control

**In one sentence:** **dependency injection (DI)** means a class **receives** its collaborators (database, clock, mailer) from outside instead of **creating** them, and **inversion of control (IoC)** is the broader idea that a framework or composition root — not your class — decides **what gets plugged in and when it runs**.

### In plain words
A chef (your class) doesn't grow vegetables or build the stove. The restaurant owner hands them ingredients and equipment. Swap organic tomatoes for regular ones, or a gas stove for electric, without retraining the chef. In tests, you hand them plastic food.

### How it works
- **Constructor injection** (preferred): `OrderService(PaymentGateway&, Clock&)` — required dependencies are explicit and the object is complete after construction.
- **Setter / method injection:** for optional or per-call dependencies.
- **Composition root:** one place (usually `main` or startup) wires concrete classes together. Business code never says `new RealDatabase`.
- **IoC containers** (Spring, .NET's built-in DI, Google Fruit/Boost.DI for C++) automate wiring; in C++ manual wiring is common and fine.
- **C++ options:** interface references/`unique_ptr` (runtime), **templates/concepts** (compile time, zero overhead), or `std::function` for single functions.
- **Benefits:** testability (inject fakes), swappable implementations, explicit dependencies. **Cost:** more types and wiring; don't inject trivial helpers.
- **Anti-pattern:** the **service locator** (`Locator::get<Db>()` anywhere) hides dependencies.

#### Modern C++ example — constructor injection, a composition root, and a test double
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <ctime>
#include <iostream>
#include <string>
#include <vector>

class Clock { public: virtual ~Clock() = default; virtual int hour() const = 0; };
class Mailer { public: virtual ~Mailer() = default; virtual void send(const std::string& to, const std::string& body) = 0; };

class GreetingService {                                   // knows nothing about real clocks or SMTP
public:
    GreetingService(const Clock& clock, Mailer& mailer) : clock_(clock), mailer_(mailer) {}
    void greet(const std::string& user) {
        int h = clock_.hour();
        mailer_.send(user, h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    }
private:
    const Clock& clock_;
    Mailer& mailer_;
};

// Production implementations.
class SystemClock : public Clock { public: int hour() const override { std::time_t t = std::time(nullptr); return std::localtime(&t)->tm_hour; } };
class ConsoleMailer : public Mailer { public: void send(const std::string& to, const std::string& b) override { std::cout << "to " << to << ": " << b << '\n'; } };

// Test doubles.
class FixedClock : public Clock { public: explicit FixedClock(int h) : h_(h) {} int hour() const override { return h_; } int h_; };
class RecordingMailer : public Mailer {
public:
    void send(const std::string& to, const std::string& b) override { sent.push_back(to + ":" + b); }
    std::vector<std::string> sent;
};

int main() {
    // "Tests": deterministic, no real time, no real email.
    for (int h : {9, 15, 21}) {
        FixedClock clock(h);
        RecordingMailer mail;
        GreetingService(clock, mail).greet("mona");
        std::cout << "test at " << h << "h -> " << mail.sent.at(0) << '\n';
    }
    // Composition root: the only place that picks real implementations.
    SystemClock clock;
    ConsoleMailer mailer;
    GreetingService service(clock, mailer);
    (void)service;                                        // service.greet("ali") would use the real clock
    std::cout << "production wiring done in one place\n";
}
```

**Output:**
```text
test at 9h -> mona:Good morning
test at 15h -> mona:Good afternoon
test at 21h -> mona:Good evening
production wiring done in one place
```

### Interview answer
"With dependency injection a class gets its collaborators — clock, repository, gateway — through its constructor instead of creating them, so dependencies are explicit and I can pass fakes in tests. All concrete wiring happens in one composition root at startup; that's inversion of control. In C++ I inject interfaces, or use templates when I want zero runtime overhead, and I avoid service locators because they hide dependencies."

---

## 6. Factory / Abstract Factory for object creation and extensibility

**In one sentence:** a **Factory** puts the "which concrete class do I create?" decision **in one place** (often from a type name or config), and an **Abstract Factory** creates **a whole family of related objects** that must match (e.g. all-AWS or all-local storage + queue).

### In plain words
- **Factory:** a car rental desk. You ask for "a compact car"; they decide which exact model you get.
- **Abstract factory:** furniture sets. If you choose "Victorian", the chair, table and sofa all come in Victorian style — you never mix a Victorian chair with a modern table.

### How it works
- Callers depend on the **interface**; only the factory names concrete classes.
- **Registry-based factory:** a map from name to creator function; new types **register themselves** — open for extension without editing the factory (useful for plugins and config-driven systems).
- Return `std::unique_ptr<Interface>` (clear ownership).
- **Abstract factory:** an interface with one `create_X()` per product; one concrete factory per family (`AwsFactory`, `LocalFactory`). Great for environments (prod vs. tests) and platforms (Windows vs. Linux widgets).
- Don't use a factory if there's only one implementation and `std::make_unique<Concrete>()` is clear.

#### Modern C++ example — a registry factory for notifiers, and an abstract factory for environments
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <stdexcept>
#include <string>

class Notifier { public: virtual ~Notifier() = default; virtual void send(const std::string& msg) = 0; };
class EmailNotifier : public Notifier { public: void send(const std::string& m) override { std::cout << "email: " << m << '\n'; } };
class SmsNotifier : public Notifier { public: void send(const std::string& m) override { std::cout << "sms: " << m << '\n'; } };

class NotifierFactory {                                         // registry: open for new types
public:
    using Creator = std::function<std::unique_ptr<Notifier>()>;
    static NotifierFactory& instance() { static NotifierFactory f; return f; }
    void add(const std::string& name, Creator c) { creators_[name] = std::move(c); }
    std::unique_ptr<Notifier> create(const std::string& name) const {
        auto it = creators_.find(name);
        if (it == creators_.end()) throw std::invalid_argument("unknown channel: " + name);
        return it->second();
    }
private:
    std::map<std::string, Creator> creators_;
};

// Abstract factory: products that must come from the same family.
class Storage { public: virtual ~Storage() = default; virtual std::string put(const std::string& key) = 0; };
class Queue { public: virtual ~Queue() = default; virtual std::string push(const std::string& msg) = 0; };
class InfraFactory {
public:
    virtual ~InfraFactory() = default;
    virtual std::unique_ptr<Storage> storage() = 0;
    virtual std::unique_ptr<Queue> queue() = 0;
};
class CloudFactory : public InfraFactory {
    struct S3 : Storage { std::string put(const std::string& k) override { return "s3://bucket/" + k; } };
    struct Sqs : Queue { std::string push(const std::string& m) override { return "sqs <- " + m; } };
public:
    std::unique_ptr<Storage> storage() override { return std::make_unique<S3>(); }
    std::unique_ptr<Queue> queue() override { return std::make_unique<Sqs>(); }
};
class LocalFactory : public InfraFactory {
    struct Disk : Storage { std::string put(const std::string& k) override { return "/tmp/" + k; } };
    struct Mem : Queue { std::string push(const std::string& m) override { return "memory queue <- " + m; } };
public:
    std::unique_ptr<Storage> storage() override { return std::make_unique<Disk>(); }
    std::unique_ptr<Queue> queue() override { return std::make_unique<Mem>(); }
};

void upload_report(InfraFactory& infra) {                     // never names a concrete class
    auto store = infra.storage();
    auto q = infra.queue();
    std::cout << store->put("report.pdf") << " | " << q->push("report ready") << '\n';
}

int main() {
    auto& f = NotifierFactory::instance();
    f.add("email", [] { return std::make_unique<EmailNotifier>(); });
    f.add("sms", [] { return std::make_unique<SmsNotifier>(); });
    for (std::string channel : {"email", "sms", "pigeon"}) {      // e.g. read from user settings
        try { f.create(channel)->send("your order shipped"); }
        catch (const std::exception& e) { std::cout << e.what() << '\n'; }
    }
    CloudFactory prod; LocalFactory dev;
    upload_report(prod);
    upload_report(dev);
}
```

**Output:**
```text
email: your order shipped
sms: your order shipped
unknown channel: pigeon
s3://bucket/report.pdf | sqs <- report ready
/tmp/report.pdf | memory queue <- report ready
```

### Interview answer
"A factory centralizes the decision of which concrete class to create, so callers depend only on the interface; a registry of creator functions lets new types plug in without editing the factory. An abstract factory creates a family of objects that must match — cloud storage with a cloud queue, or local versions of both for development and tests. If there's only one implementation, I just construct it directly."

---

## 7. Observer / Pub-Sub for state-change notifications

**In one sentence:** with **Observer**, a subject keeps a list of listeners and **notifies them when its state changes**; **Pub-Sub** adds a **broker/event bus** in between, so publishers and subscribers don't know each other at all.

### In plain words
- **Observer:** a YouTube channel. Subscribers get notified when a new video goes up; the channel knows its subscriber list.
- **Pub-Sub:** a radio station. It broadcasts on a frequency; anyone tuned in hears it; the station has no idea who's listening.

### How it works
- **Observer (in-process):** `subscribe(callback)` returns a handle for `unsubscribe`. Watch for: **dangling observers** (use handles/`weak_ptr` or RAII unsubscription), **re-entrancy** (an observer subscribing during notify — copy the list first), and **exceptions** in one observer stopping the others.
- **Pub-Sub:** topics + an event bus or a message broker (Kafka, RabbitMQ — see [Message Queuing](../System%20Architecture/Message-Queuing.md)). Usually **asynchronous**; subscribers must handle duplicates and ordering.
- Uses: UI updates (model → views), domain events (`OrderPlaced` → email, analytics, loyalty points), cache invalidation, price alerts.
- **Cost:** control flow becomes implicit — harder to follow and debug. Name events in the past tense (`OrderShipped`) and keep payloads small and immutable.

#### Modern C++ example — an observable stock price with RAII unsubscription, and a topic bus
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

class StockTicker {                                          // subject
public:
    using Callback = std::function<void(const std::string&, double)>;
    class Subscription {                                     // RAII: unsubscribes in its destructor
    public:
        Subscription(StockTicker& t, int id) : t_(&t), id_(id) {}
        Subscription(Subscription&& o) noexcept : t_(o.t_), id_(o.id_) { o.t_ = nullptr; }
        ~Subscription() { if (t_) t_->observers_.erase(id_); }
    private:
        StockTicker* t_; int id_;
    };
    [[nodiscard]] Subscription subscribe(Callback cb) { observers_[next_] = std::move(cb); return {*this, next_++}; }
    void set_price(const std::string& sym, double p) {
        auto copy = observers_;                               // safe if callbacks (un)subscribe
        for (auto& [id, cb] : copy) cb(sym, p);
    }
private:
    std::map<int, Callback> observers_;
    int next_ = 0;
};

class EventBus {                                             // pub-sub: topics, no direct references
public:
    void on(const std::string& topic, std::function<void(const std::string&)> h) { subs_[topic].push_back(std::move(h)); }
    void publish(const std::string& topic, const std::string& payload) { for (auto& h : subs_[topic]) h(payload); }
private:
    std::map<std::string, std::vector<std::function<void(const std::string&)>>> subs_;
};

int main() {
    StockTicker ticker;
    auto display = ticker.subscribe([](auto& s, double p) { std::cout << "display: " << s << " = " << p << '\n'; });
    {
        auto alert = ticker.subscribe([](auto& s, double p) { if (p > 100) std::cout << "ALERT: " << s << " above 100\n"; });
        ticker.set_price("COMI", 101.5);
    }                                                        // alert unsubscribed here
    ticker.set_price("COMI", 102.0);

    EventBus bus;
    bus.on("OrderPlaced", [](auto& id) { std::cout << "email service: confirmation for " << id << '\n'; });
    bus.on("OrderPlaced", [](auto& id) { std::cout << "loyalty service: +10 points for " << id << '\n'; });
    bus.publish("OrderPlaced", "ORD-7");
    bus.publish("OrderCancelled", "ORD-8");                  // nobody listens: that's fine
}
```

**Output:**
```text
display: COMI = 101.5
ALERT: COMI above 100
display: COMI = 102
email service: confirmation for ORD-7
loyalty service: +10 points for ORD-7
```

### Interview answer
"Observer lets a subject notify registered listeners when its state changes; Pub-Sub puts a bus or broker in the middle so publishers and subscribers are fully decoupled, often asynchronously. In C++ I return a subscription handle that unsubscribes in its destructor to avoid dangling callbacks, and I iterate a copy of the list so callbacks can subscribe safely. The trade-off is implicit control flow, so I keep events small, immutable and named in the past tense."

---

## 8. Recognize when not to introduce a design pattern

**In one sentence:** a pattern is a **solution to a specific problem**; if you don't have that problem — no variation, no second implementation, no complex construction — the pattern only adds **indirection, files and cognitive load**.

### In plain words
A Swiss army knife is great when you need ten tools. If you only ever need to open letters, a letter opener is simpler, lighter and easier to understand.

### How it works
**Red flags**
| Smell | Example | Simpler alternative |
|---|---|---|
| Pattern without the problem | `ShapeFactory` that only ever creates `Circle` | `std::make_unique<Circle>()` |
| Interface with one implementation and no test double | `IUserService` + `UserServiceImpl` | a concrete class; extract later |
| Strategy for a fixed rule | `TaxStrategy` with one strategy | a function |
| Singleton for convenience | global `Config::instance()` everywhere | pass the config in (DI) |
| Observer for one listener | event bus to call one function | a direct call |
| Visitor over 2 stable types | double dispatch machinery | `std::variant` + `std::visit` or an `if` |
| Layers that only forward | Controller → Manager → Service → Helper → Repository | fewer layers |

**Questions to ask before adding one**
1. What **concrete problem** does it solve *today*?
2. Is there a **second variant** or a **test** that needs the seam?
3. Would a **function, lambda, `std::variant` or plain class** do?
4. Can I **explain the design** without the pattern's name?

**The interview angle:** saying "I'd normally reach for Strategy here, but with one rule I'll keep a function and extract it if a second rule appears" scores better than pattern-stuffing.

**Singleton** deserves a special note: it's global state with a fancy name. It hides dependencies, makes tests share state, and complicates concurrency. If you need one instance, **create one and pass it in**.

#### Modern C++ example — the same feature with and without "patterns"
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

// Over-engineered: interface + impl + factory + singleton for ONE discount rule.
class IDiscountStrategy { public: virtual ~IDiscountStrategy() = default; virtual long apply(long) const = 0; };
class TenPercentStrategy : public IDiscountStrategy { public: long apply(long c) const override { return c * 90 / 100; } };
class DiscountStrategyFactory {
public:
    static DiscountStrategyFactory& instance() { static DiscountStrategyFactory f; return f; }
    std::unique_ptr<IDiscountStrategy> create() const { return std::make_unique<TenPercentStrategy>(); }
};
long price_overengineered(long cents) { return DiscountStrategyFactory::instance().create()->apply(cents); }

// Right-sized: one rule -> one function. Extract a Strategy when a second rule appears.
long ten_percent_off(long cents) { return cents * 90 / 100; }
long price_simple(long cents) { return ten_percent_off(cents); }

int main() {
    std::cout << "over-engineered: " << price_overengineered(200'00) / 100 << " (4 types, 1 global)\n";
    std::cout << "simple:          " << price_simple(200'00) / 100 << " (1 function)\n";
}
```

**Output:**
```text
over-engineered: 180 (4 types, 1 global)
simple:          180 (1 function)
```

### Interview answer
"A pattern should answer a problem I actually have — real variation, a test seam, complex construction. If there's one implementation, one rule or one listener, a function, a plain class or `std::variant` is clearer. I avoid singletons because they're hidden global state, and I tell the interviewer where I'd introduce the pattern once the second case shows up."

---

## 9. Repository / Unit of Work for persistence boundaries

**In one sentence:** a **Repository** makes storage look like an **in-memory collection of domain objects** (`find`, `add`, `remove`) so business logic never sees SQL, and a **Unit of Work** tracks all changes made during one business operation and **commits them together** (or not at all).

### In plain words
- **Repository:** a librarian. You ask "give me member 42"; you don't care if it comes from a shelf, a basement or another branch.
- **Unit of work:** a shopping cart at checkout. You add and remove items freely, then pay once. If the card fails, nothing is bought.

### How it works
- One repository **per aggregate root** (`OrderRepository`, `MemberRepository`), returning **domain objects**, not database rows.
- The interface lives with the **domain**; implementations (SQL, in-memory, HTTP) live at the edge — great for tests.
- **Unit of Work** registers new, changed and deleted objects, then `commit()` writes them in **one transaction**; `rollback()` discards them. ORMs implement it (Entity Framework's `DbContext`, Hibernate's session, SQLAlchemy's session).
- Keep query methods **intention-revealing** (`overdue_loans(today)`) instead of leaking a generic query language.
- See also [Data access layering](./API-Persistence-and-Concurrency-Design.md#1-data-access-layering-repositories-and-transaction-boundaries).

#### Modern C++ example — a repository interface, an in-memory implementation, and an all-or-nothing unit of work
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>
#include <vector>

struct Account { std::string id; long balance; };

class AccountRepository {                                  // domain-facing interface
public:
    virtual ~AccountRepository() = default;
    virtual std::optional<Account> find(const std::string& id) const = 0;
    virtual void save(const Account& a) = 0;
};

class InMemoryAccounts : public AccountRepository {        // could be SQL in production
public:
    std::optional<Account> find(const std::string& id) const override {
        auto it = rows_.find(id); if (it == rows_.end()) return std::nullopt; return it->second;
    }
    void save(const Account& a) override { rows_[a.id] = a; }
private:
    std::map<std::string, Account> rows_;
};

class UnitOfWork {                                         // collects changes, commits atomically
public:
    explicit UnitOfWork(AccountRepository& repo) : repo_(repo) {}
    Account get(const std::string& id) {
        if (auto it = dirty_.find(id); it != dirty_.end()) return it->second;
        auto a = repo_.find(id);
        if (!a) throw std::runtime_error("no account " + id);
        return *a;
    }
    void update(const Account& a) { dirty_[a.id] = a; }
    void commit() { for (auto& [id, a] : dirty_) repo_.save(a); dirty_.clear(); }   // one DB transaction in real life
    void rollback() { dirty_.clear(); }
private:
    AccountRepository& repo_;
    std::map<std::string, Account> dirty_;
};

void transfer(AccountRepository& repo, const std::string& from, const std::string& to, long cents) {
    UnitOfWork uow(repo);
    try {
        Account a = uow.get(from), b = uow.get(to);
        a.balance -= cents; uow.update(a);
        if (a.balance < 0) throw std::runtime_error("insufficient funds");
        b.balance += cents; uow.update(b);
        uow.commit();
        std::cout << "transfer " << cents / 100 << " ok\n";
    } catch (const std::exception& e) {
        uow.rollback();                                    // the debit above is NOT saved
        std::cout << "transfer " << cents / 100 << " failed: " << e.what() << '\n';
    }
}

int main() {
    InMemoryAccounts repo;
    repo.save({"A", 100'00});
    repo.save({"B", 50'00});
    transfer(repo, "A", "B", 30'00);
    transfer(repo, "A", "B", 500'00);
    transfer(repo, "A", "Z", 10'00);
    std::cout << "A=" << repo.find("A")->balance / 100 << " B=" << repo.find("B")->balance / 100 << '\n';
}
```

**Output:**
```text
transfer 30 ok
transfer 500 failed: insufficient funds
transfer 10 failed: no account Z
A=70 B=80
```

### Interview answer
"A repository gives the domain a collection-like interface per aggregate — find, save, intention-revealing queries — and hides the storage technology, so business logic is testable with an in-memory version. A unit of work tracks all changes from one business operation and commits them in one transaction or discards them, so a transfer never debits without crediting."

---

## 10. State pattern for workflow transitions

**In one sentence:** the State pattern gives **each state its own class** that decides how to handle each event and **which state comes next**, replacing big `switch (state)` blocks repeated in every method.

### In plain words
A vending machine behaves differently depending on its mood: *waiting for coins*, *has money*, *dispensing*, *out of stock*. Instead of one giant rulebook with "if waiting… else if has money…" on every page, each mood has its own short rulebook.

### How it works
- An interface with one method per event (`insert_coin`, `select`, `refund`); each concrete state implements them.
- The context (`VendingMachine`) holds the current state and delegates to it; a state returns or sets the next state.
- **Use it when** per-state behaviour is substantial and many methods would otherwise `switch` on the state. **Don't** for a small lifecycle — an `enum` + transition table is simpler (see [Requirements → state transitions](./Requirements-and-Domain-Modeling.md#4-model-relationships-ownership-object-lifecycles-and-state-transitions)).
- In C++, `std::variant<Idle, HasMoney, …>` + `std::visit` is a compact alternative with compile-time exhaustiveness.

#### Modern C++ example — a vending machine with state classes
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

class VendingMachine;

class State {
public:
    virtual ~State() = default;
    virtual std::unique_ptr<State> insert(VendingMachine&, int coins) = 0;
    virtual std::unique_ptr<State> select(VendingMachine&) = 0;
    virtual std::string name() const = 0;
};

class VendingMachine {
public:
    explicit VendingMachine(int stock);
    void insert(int coins) { change(state_->insert(*this, coins)); }
    void select() { change(state_->select(*this)); }
    int balance = 0, stock;
    static constexpr int kPrice = 10;
private:
    void change(std::unique_ptr<State> next) {
        if (next) { std::cout << "  [" << state_->name() << " -> " << next->name() << "]\n"; state_ = std::move(next); }
    }
    std::unique_ptr<State> state_;
};

class SoldOut : public State {
public:
    std::unique_ptr<State> insert(VendingMachine&, int coins) override { std::cout << "sold out, returning " << coins << '\n'; return nullptr; }
    std::unique_ptr<State> select(VendingMachine&) override { std::cout << "sold out\n"; return nullptr; }
    std::string name() const override { return "SoldOut"; }
};
class HasMoney;
class Idle : public State {
public:
    std::unique_ptr<State> insert(VendingMachine& m, int coins) override;
    std::unique_ptr<State> select(VendingMachine&) override { std::cout << "insert coins first\n"; return nullptr; }
    std::string name() const override { return "Idle"; }
};
class HasMoney : public State {
public:
    std::unique_ptr<State> insert(VendingMachine& m, int coins) override { m.balance += coins; std::cout << "balance " << m.balance << '\n'; return nullptr; }
    std::unique_ptr<State> select(VendingMachine& m) override {
        if (m.balance < VendingMachine::kPrice) { std::cout << "need " << VendingMachine::kPrice - m.balance << " more\n"; return nullptr; }
        m.balance -= VendingMachine::kPrice; --m.stock;
        std::cout << "dispensed! change " << m.balance << '\n';
        m.balance = 0;
        if (m.stock == 0) return std::make_unique<SoldOut>();
        return std::make_unique<Idle>();
    }
    std::string name() const override { return "HasMoney"; }
};
std::unique_ptr<State> Idle::insert(VendingMachine& m, int coins) { m.balance = coins; std::cout << "balance " << coins << '\n'; return std::make_unique<HasMoney>(); }

VendingMachine::VendingMachine(int s) : stock(s), state_(std::make_unique<Idle>()) {}

int main() {
    VendingMachine vm(1);
    vm.select();
    vm.insert(5);
    vm.select();
    vm.insert(10);
    vm.select();
    vm.insert(10);
}
```

**Output:**
```text
insert coins first
balance 5
  [Idle -> HasMoney]
need 5 more
balance 15
dispensed! change 5
  [HasMoney -> SoldOut]
sold out, returning 10
```

### Interview answer
"When an object's behaviour differs a lot by state — a vending machine, an order workflow, a connection — I give each state a class implementing all the events and returning the next state, and the context just delegates. It removes repeated switches and keeps each state's rules together. For small lifecycles an enum with a transition table is simpler, and `std::variant` is a good C++ alternative."

---

## 11. Strategy for configurable behavior

**In one sentence:** Strategy puts **interchangeable algorithms behind one interface** so the caller can **choose or change the behaviour** (pricing, routing, eviction, rate limiting) at runtime or by configuration, without `if/else` chains.

### In plain words
Getting to the airport: car, bus, or taxi. The goal is the same; the way differs. You pick the strategy based on time and money, and you can switch tomorrow.

### How it works
- **Interface** (`EvictionPolicy`, `PricingRule`) + one class per algorithm; the context holds one and delegates.
- **C++ choices:** virtual interface (runtime, open set), `std::function` (single function, lambdas), template parameter (compile time, zero overhead — like `std::sort`'s comparator or `std::allocator`).
- Strategy vs. State: in **Strategy** the *client* picks the algorithm; in **State** the object *changes its own* behaviour as it moves between states.
- Common LLD uses: cache eviction (LRU/LFU — see [Classic LLD problems](./Classic-LLD-Problems.md#1-design-a-cache-with-lrulfu-eviction)), rate-limiting algorithms, parking pricing, elevator scheduling, payment methods, sorting/ranking.

#### Modern C++ example — parking fee strategies chosen from configuration
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <string>

class PricingStrategy {
public:
    virtual ~PricingStrategy() = default;
    virtual long fee(int minutes) const = 0;                 // in piasters
    virtual std::string name() const = 0;
};
class Hourly : public PricingStrategy {
public:
    long fee(int m) const override { return ((m + 59) / 60) * 20'00; }          // 20 per started hour
    std::string name() const override { return "hourly"; }
};
class FlatDaily : public PricingStrategy {
public:
    long fee(int) const override { return 100'00; }
    std::string name() const override { return "flat"; }
};
class FirstHourFree : public PricingStrategy {               // decorates another strategy
public:
    explicit FirstHourFree(std::unique_ptr<PricingStrategy> inner) : inner_(std::move(inner)) {}
    long fee(int m) const override { return m <= 60 ? 0 : inner_->fee(m - 60); }
    std::string name() const override { return "first-hour-free + " + inner_->name(); }
private:
    std::unique_ptr<PricingStrategy> inner_;
};

class ParkingLot {
public:
    explicit ParkingLot(std::unique_ptr<PricingStrategy> p) : pricing_(std::move(p)) {}
    void set_pricing(std::unique_ptr<PricingStrategy> p) { pricing_ = std::move(p); }   // switch at runtime
    void exit(int minutes) const { std::cout << pricing_->name() << ": " << minutes << " min -> " << pricing_->fee(minutes) / 100 << " EGP\n"; }
private:
    std::unique_ptr<PricingStrategy> pricing_;
};

std::unique_ptr<PricingStrategy> from_config(const std::string& key) {
    if (key == "flat") return std::make_unique<FlatDaily>();
    if (key == "mall") return std::make_unique<FirstHourFree>(std::make_unique<Hourly>());
    return std::make_unique<Hourly>();
}

int main() {
    ParkingLot lot(from_config("hourly"));
    lot.exit(130);
    lot.set_pricing(from_config("mall"));
    lot.exit(45);
    lot.exit(130);
    lot.set_pricing(from_config("flat"));
    lot.exit(600);
}
```

**Output:**
```text
hourly: 130 min -> 60 EGP
first-hour-free + hourly: 45 min -> 0 EGP
first-hour-free + hourly: 130 min -> 40 EGP
flat: 600 min -> 100 EGP
```

### Interview answer
"Strategy hides interchangeable algorithms behind one interface so the caller or configuration picks the behaviour — pricing, eviction, rate limiting — and adding one is a new class, not another branch. In C++ I choose between a virtual interface, a `std::function` for one-method strategies, or a template parameter when it's fixed at compile time. Unlike State, the client chooses the strategy rather than the object switching itself."

---

## Cheat sheet

| Pattern | Problem it solves | Watch out for |
|---|---|---|
| Adapter | vendor API ≠ your interface | translate errors and units too |
| Facade | complex subsystem, simple use case | don't let it become a god class |
| Builder | many optional fields + cross-field rules | an aggregate may be enough |
| Command | undo, queues, audit, macros | store what's needed to undo |
| Decorator | add behaviour (retry, cache, log) in layers | layer order matters |
| Proxy | control access (auth, lazy, remote, rate limit) | hidden latency for remote proxies |
| DI / IoC | testable, swappable dependencies | wire in one composition root; no service locator |
| Factory | central "which class?" decision | skip with one implementation |
| Abstract Factory | consistent families (cloud vs. local) | grows with every new product type |
| Observer / Pub-Sub | notify many on state change | dangling observers, implicit control flow |
| Repository / UoW | hide storage; atomic business operations | one repo per aggregate; intention-revealing queries |
| State | big per-state behaviour | enum + table for small lifecycles |
| Strategy | configurable algorithms | function/template may suffice |
| **No pattern** | no variation, one implementation | Singleton = hidden global state |
