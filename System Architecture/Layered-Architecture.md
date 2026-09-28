# Layered Architecture — Presentation, Business Logic, Data Access and Cross-Cutting Concerns

> **What you'll learn:** what layered (n-tier) architecture is, the responsibility of each layer — **presentation**, **business logic**, **data access**, and the **cross-cutting concerns** that span them — the rules that keep layers clean, and a complete C++ application built in layers.
>
> **Prerequisites:** [OOP](../Programming%20Languages%20and%20Concepts/OOP.md), [Dependency Inversion](../System%20Design/OOD-Principles.md#55-dependency-inversion-principle-dip).

## Table of Contents
0. [What is layered architecture?](#0-what-is-layered-architecture)
1. [Presentation layer](#1-presentation-layer)
2. [Business logic layer](#2-business-logic-layer)
3. [Data access layer](#3-data-access-layer)
4. [Cross-cutting concerns layer](#4-cross-cutting-concerns-layer)
5. [Putting it together (full C++ example)](#5-putting-it-together-full-c-example)
6. [Cheat sheet](#cheat-sheet)

---

## 0. What is layered architecture?

**In one sentence:** layered architecture organizes an application into **horizontal layers**, each with one kind of responsibility, where each layer only uses the layer **directly below** it.

### In plain words
A restaurant:
- **Waiters (presentation)** talk to customers, take orders, show the menu, bring food. They don't cook.
- **Chefs (business logic)** decide how dishes are made, apply the recipes and rules ("no peanuts for allergic guests").
- **The pantry manager (data access)** fetches and stores ingredients; chefs don't care whether the pantry is a fridge or a warehouse.
- **Hygiene rules, cash handling, security (cross-cutting concerns)** apply to *everyone*.

Because each role is separate, you can hire a new waiter (new mobile app UI) or move the pantry (switch databases) without retraining the chefs.

### How it works
```
 ┌──────────────────────────────┐
 │  Presentation layer          │  UI, REST controllers, input parsing, formatting
 ├──────────────────────────────┤        │ calls ▼
 │  Business logic layer        │  domain rules, use cases, validation, transactions
 ├──────────────────────────────┤        │ calls ▼
 │  Data access layer           │  repositories, SQL/ORM, external storage
 ├──────────────────────────────┤
 │  Database / external systems │
 └──────────────────────────────┘
   Cross-cutting concerns: logging, security, error handling, caching, config, monitoring (all layers)
```
Rules:
- **Dependencies point downward only.** A lower layer never calls an upper one (the database code never builds HTML).
- **Closed layers:** requests pass through each layer in order (presentation doesn't skip business logic to hit the DB). Some layers may be "open" (skippable) by design.
- **Separation of concerns** → easier testing, replacing a layer, parallel team work.
- Pitfalls: the **"sinkhole" anti-pattern** (layers that only pass calls through), changes that ripple through every layer, and becoming a monolith. Variations that invert the dependency on infrastructure: **Hexagonal (Ports & Adapters)**, **Onion**, **Clean Architecture** — business logic in the center, depending on interfaces the outer layers implement.
- Layers (logical) ≠ tiers (physical machines), though a 3-layer app is often deployed as 3 tiers.

---

## 1. Presentation layer

**In one sentence:** the presentation layer handles **interaction with users or clients** — receiving input, validating its *format*, calling the business layer, and formatting the output (HTML, JSON, CLI text).

### In plain words
The waiter: listens to the order, checks it's readable ("you wrote 'pizzza' — you mean pizza?"), passes it to the kitchen, and presents the dish nicely. The waiter **doesn't decide recipes or prices**.

### How it works
- Web UIs, mobile apps, REST/gRPC controllers, CLI handlers.
- Responsibilities: routing, parsing, **syntactic validation** (is it a number? a valid email format?), authentication hand-off, mapping requests to business calls, mapping results/errors to status codes and views.
- Keep it **thin**: no business rules here, or they'll be duplicated across web, mobile and API front-ends.
- Uses **DTOs** (data transfer objects) / view models shaped for the client.

### Modern C++ example — a thin controller that only parses, delegates and formats
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <charconv>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>

// (Business layer stand-in: the controller doesn't care how this works.)
struct PricingService { double quote(int quantity) const { return quantity * 9.5; } };

// PRESENTATION: parse text input -> call business logic -> format output
class QuoteController {
public:
    explicit QuoteController(const PricingService& s) : service_(s) {}
    std::string handle(std::string_view raw_quantity) const {
        std::optional<int> qty = parse_int(raw_quantity);                    // syntactic validation only
        if (!qty) return "400 Bad Request: quantity must be a whole number";
        double price = service_.quote(*qty);                                 // delegate the real work
        return "200 OK: {\"quantity\":" + std::to_string(*qty) + ",\"price\":" + std::to_string(price) + "}";
    }
private:
    static std::optional<int> parse_int(std::string_view s) {
        int v{};
        auto [p, ec] = std::from_chars(s.data(), s.data() + s.size(), v);
        if (ec != std::errc{} || p != s.data() + s.size()) return std::nullopt;
        return v;
    }
    const PricingService& service_;
};

int main() {
    PricingService pricing;
    QuoteController controller(pricing);
    std::cout << controller.handle("3") << '\n';
    std::cout << controller.handle("three") << '\n';
}
```

**Output:**
```text
200 OK: {"quantity":3,"price":28.500000}
400 Bad Request: quantity must be a whole number
```

### Interview answer
"The presentation layer handles client interaction — rendering UI or exposing API endpoints, parsing and syntactically validating input, invoking the business layer and mapping results and errors to views or status codes. It should stay thin and free of business rules so multiple front-ends can share the same logic."

---

## 2. Business logic layer

**In one sentence:** the business logic (domain / service) layer contains the **rules and workflows of the business** — what's allowed, how values are calculated, and how use cases are carried out — independent of UI and storage.

### In plain words
The chef and the recipes: "a combo meal is 15% off", "you can't order alcohol under 18", "if the dish is sold out, suggest an alternative". These rules are the heart of the restaurant; they stay the same whether orders come from waiters, a phone app, or a kiosk.

### How it works
- **Domain model:** entities and value objects (`Order`, `Money`) with invariants.
- **Services / use cases:** orchestrate a business operation (`PlaceOrder`): check rules, compute totals, call repositories, manage the **transaction boundary**.
- **Semantic validation:** "is this customer allowed to do this?", "is there enough stock?".
- Depends on **abstractions** of data access (repository interfaces), not on SQL — this keeps it testable with in-memory fakes.
- Anti-pattern: the **anemic domain model** (objects with only getters/setters and all logic scattered in services or controllers).

### Modern C++ example — business rules tested without any database or UI
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>

struct Customer { std::string name; int age; bool vip; };

// BUSINESS LOGIC: pure rules, no I/O
class OrderPolicy {
public:
    double total(const Customer& c, double subtotal, bool contains_alcohol) const {
        if (contains_alcohol && c.age < 18) throw std::domain_error("customers under 18 cannot buy alcohol");
        double discount = c.vip ? 0.10 : 0.0;
        if (subtotal >= 100) discount += 0.05;                     // bulk discount
        return subtotal * (1 - discount);
    }
};

int main() {
    OrderPolicy policy;
    std::cout << "VIP, $120: " << policy.total({"Ana", 30, true}, 120, false) << '\n';
    std::cout << "regular, $50: " << policy.total({"Ben", 40, false}, 50, false) << '\n';
    try { policy.total({"Tim", 16, false}, 20, true); }
    catch (const std::exception& e) { std::cout << "rejected: " << e.what() << '\n'; }
}
```

**Output:**
```text
VIP, $120: 102
regular, $50: 50
rejected: customers under 18 cannot buy alcohol
```

### Interview answer
"The business logic layer encapsulates domain rules, calculations and use-case workflows, including semantic validation and transaction boundaries. It's independent of presentation and persistence, depending only on abstractions such as repository interfaces, which makes it the most reusable and testable part of the system."

---

## 3. Data access layer

**In one sentence:** the data access (persistence) layer **reads and writes data** from databases, files or external services, hiding **how** data is stored behind simple methods like `find_by_id` and `save`.

### In plain words
The pantry manager: the chef says "I need 2 kg of tomatoes"; the manager knows whether they're in the fridge, the freezer or must be ordered from a supplier. If the restaurant moves to a new warehouse, only the pantry manager's routine changes.

### How it works
- **Repository pattern:** a collection-like interface for each aggregate (`OrderRepository::find`, `save`), implemented with SQL, an ORM (Hibernate, Entity Framework, SQLAlchemy; in C++: sqlpp11, ODB, SOCI), or a NoSQL client.
- **DAO** (data access object): similar, often closer to tables.
- Responsibilities: queries, mapping rows ↔ objects, connection pooling, **parameterized queries** (prevent SQL injection), caching of reads, translating DB errors into domain-friendly errors.
- **Unit of Work:** track changes and commit them in one transaction.
- Because business logic depends on the repository **interface**, you can swap PostgreSQL for an in-memory fake in tests or for another database later.

### Modern C++ example — repository interface with two interchangeable implementations
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>

struct Product { int id; std::string name; double price; };

class ProductRepository {                         // what the business layer depends on
public:
    virtual ~ProductRepository() = default;
    virtual std::optional<Product> find(int id) const = 0;
    virtual void save(const Product& p) = 0;
};

class InMemoryProductRepository : public ProductRepository {      // tests / prototypes
public:
    std::optional<Product> find(int id) const override {
        auto it = rows_.find(id);
        return it == rows_.end() ? std::nullopt : std::optional(it->second);
    }
    void save(const Product& p) override { rows_[p.id] = p; }
private:
    std::map<int, Product> rows_;
};

class SqlProductRepository : public ProductRepository {           // production (SQL shown, not executed)
public:
    std::optional<Product> find(int id) const override {
        std::cout << "    SQL: SELECT id, name, price FROM products WHERE id = $1   -- param " << id << '\n';
        return Product{id, "pen", 1.5};
    }
    void save(const Product& p) override {
        std::cout << "    SQL: INSERT ... ON CONFLICT (id) DO UPDATE ...          -- params " << p.id << ", " << p.name << '\n';
    }
};

void business_operation(ProductRepository& repo) {               // unaware of storage details
    repo.save({7, "pen", 1.5});
    if (auto p = repo.find(7)) std::cout << "    found " << p->name << " at $" << p->price << '\n';
}

int main() {
    InMemoryProductRepository memory;
    SqlProductRepository sql;
    std::cout << "with in-memory repository:\n"; business_operation(memory);
    std::cout << "with SQL repository:\n";       business_operation(sql);
}
```

**Output:**
```text
with in-memory repository:
    found pen at $1.5
with SQL repository:
    SQL: INSERT ... ON CONFLICT (id) DO UPDATE ...          -- params 7, pen
    SQL: SELECT id, name, price FROM products WHERE id = $1   -- param 7
    found pen at $1.5
```

### Interview answer
"The data access layer encapsulates persistence — queries, object mapping, connections, transactions and error translation — typically behind repository or DAO interfaces. Business logic depends on those interfaces, so storage can change and tests can use in-memory fakes; it's also where parameterized queries prevent SQL injection."

---

## 4. Cross-cutting concerns layer

**In one sentence:** cross-cutting concerns are needs that **every layer** has — logging, security, error handling, validation, caching, configuration, monitoring, transactions — handled in a shared, centralized way instead of being copy-pasted into each layer.

### In plain words
Hygiene rules, fire safety and the security guard apply to waiters, chefs **and** the pantry. The restaurant doesn't write separate hygiene manuals for each role; one set of rules is applied everywhere.

### How it works
Common cross-cutting concerns:
| Concern | Typical centralized mechanism |
|---|---|
| Logging, tracing, metrics | Structured logger, OpenTelemetry, middleware |
| Security (authn/authz) | Auth middleware, policies, decorators |
| Error handling | Global exception handler mapping errors to responses |
| Validation | Shared validators/annotations |
| Caching | Caching decorators/proxies |
| Transactions | Unit of Work / transactional decorators |
| Configuration, feature flags | Config service injected everywhere |

Techniques to apply them without cluttering business code: **middleware/filters** (web frameworks), **decorators/proxies** ([Decorator](../System%20Design/Design%20Patterns/Structural-Patterns.md#4-decorator), [Proxy](../System%20Design/Design%20Patterns/Structural-Patterns.md#7-proxy)), **aspect-oriented programming** ([AOP](../Programming%20Languages%20and%20Concepts/Programming-Paradigms.md#7-aspect-oriented-programming)), dependency injection, and in C++ RAII helpers (scoped timers, scoped transactions).

### Modern C++ example — logging, timing and authorization applied around any layer via decorators
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

struct OrderService {
    virtual ~OrderService() = default;
    virtual std::string place(const std::string& user, const std::string& item) = 0;
};

struct RealOrderService : OrderService {                        // clean business code: no logging/security inside
    std::string place(const std::string&, const std::string& item) override { return "order for " + item + " placed"; }
};

// Cross-cutting concern #1: security
struct AuthorizingOrderService : OrderService {
    explicit AuthorizingOrderService(std::unique_ptr<OrderService> inner) : inner_(std::move(inner)) {}
    std::string place(const std::string& user, const std::string& item) override {
        if (user == "guest") throw std::runtime_error("403 forbidden: please log in");
        return inner_->place(user, item);
    }
    std::unique_ptr<OrderService> inner_;
};

// Cross-cutting concern #2: logging + error handling
struct LoggingOrderService : OrderService {
    explicit LoggingOrderService(std::unique_ptr<OrderService> inner) : inner_(std::move(inner)) {}
    std::string place(const std::string& user, const std::string& item) override {
        std::cout << "[log] " << user << " -> place(" << item << ")\n";
        try {
            auto r = inner_->place(user, item);
            std::cout << "[log] success\n";
            return r;
        } catch (const std::exception& e) {
            std::cout << "[log] error: " << e.what() << '\n';
            return std::string("error: ") + e.what();            // central error mapping
        }
    }
    std::unique_ptr<OrderService> inner_;
};

int main() {
    std::unique_ptr<OrderService> service =
        std::make_unique<LoggingOrderService>(
            std::make_unique<AuthorizingOrderService>(
                std::make_unique<RealOrderService>()));
    std::cout << service->place("ana", "book") << "\n\n";
    std::cout << service->place("guest", "book") << '\n';
}
```

**Output:**
```text
[log] ana -> place(book)
[log] success
order for book placed

[log] guest -> place(book)
[log] error: 403 forbidden: please log in
error: 403 forbidden: please log in
```

### Interview answer
"Cross-cutting concerns such as logging, security, error handling, caching, validation, transactions and configuration affect every layer. Rather than duplicating them, I centralize them with middleware, decorators or proxies, aspect-oriented techniques and dependency injection, keeping each layer focused on its own responsibility."

---

## 5. Putting it together (full C++ example)

All four layers in one small application: a CLI (presentation) → service (business) → repository (data access), with a logger injected as a cross-cutting concern.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <string>

// ---------- Cross-cutting ----------
struct Logger { void info(const std::string& m) const { std::cout << "  [info] " << m << '\n'; } };

// ---------- Data access layer ----------
struct Account { std::string id; long balance_cents; };
class AccountRepository {
public:
    std::optional<Account> find(const std::string& id) const {
        auto it = rows_.find(id);
        return it == rows_.end() ? std::nullopt : std::optional(it->second);
    }
    void save(const Account& a) { rows_[a.id] = a; }
private:
    std::map<std::string, Account> rows_{{"ana", {"ana", 10'000}}, {"ben", {"ben", 500}}};
};

// ---------- Business logic layer ----------
class TransferService {
public:
    TransferService(AccountRepository& repo, const Logger& log) : repo_(repo), log_(log) {}
    void transfer(const std::string& from, const std::string& to, long cents) {
        if (cents <= 0) throw std::invalid_argument("amount must be positive");
        auto a = repo_.find(from), b = repo_.find(to);
        if (!a || !b) throw std::invalid_argument("unknown account");
        if (a->balance_cents < cents) throw std::runtime_error("insufficient funds");   // business rule
        a->balance_cents -= cents;
        b->balance_cents += cents;
        repo_.save(*a);
        repo_.save(*b);
        log_.info("transferred " + std::to_string(cents) + " cents " + from + " -> " + to);
    }
    long balance(const std::string& id) const { return repo_.find(id).value().balance_cents; }
private:
    AccountRepository& repo_;
    const Logger& log_;
};

// ---------- Presentation layer ----------
class Cli {
public:
    explicit Cli(TransferService& s) : service_(s) {}
    void run(const std::string& line) {
        std::cout << "> " << line << '\n';
        std::istringstream in(line);
        std::string cmd, from, to;
        double amount = 0;
        in >> cmd >> from >> to >> amount;
        try {
            if (cmd != "transfer" || !in) throw std::invalid_argument("usage: transfer <from> <to> <amount>");
            service_.transfer(from, to, static_cast<long>(amount * 100 + 0.5));
            std::cout << "  OK. " << from << " now has $" << service_.balance(from) / 100.0 << '\n';
        } catch (const std::exception& e) {
            std::cout << "  ERROR: " << e.what() << '\n';
        }
    }
private:
    TransferService& service_;
};

int main() {
    Logger logger;                                  // wiring (composition root)
    AccountRepository repo;
    TransferService service(repo, logger);
    Cli cli(service);

    cli.run("transfer ana ben 25.50");
    cli.run("transfer ben ana 999");
    cli.run("send money please");
}
```

**Output:**
```text
> transfer ana ben 25.50
  [info] transferred 2550 cents ana -> ben
  OK. ana now has $74.5
> transfer ben ana 999
  ERROR: insufficient funds
> send money please
  ERROR: usage: transfer <from> <to> <amount>
```

---

## Cheat sheet

| Layer | Responsibility | Must NOT |
|---|---|---|
| Presentation | UI/API, parse input, format output, map errors to responses | Contain business rules or SQL |
| Business logic | Domain rules, use cases, semantic validation, transactions | Know about HTML/HTTP or SQL details |
| Data access | Queries, mapping, connections, storage details | Make business decisions |
| Cross-cutting | Logging, security, errors, caching, config, monitoring | Be copy-pasted into each layer |

Dependencies point down; variations like Hexagonal/Clean Architecture put business logic at the center behind interfaces.
