# Creational Design Patterns — Singleton, Factory Method, Abstract Factory, Builder, Prototype

> **What you'll learn:** what design patterns are, and the five **creational** patterns — reusable ways to **create objects** flexibly — each with a plain-language explanation, when to use it, and a modern C++ implementation.
>
> **Prerequisites:** [OOP](../../Programming%20Languages%20and%20Concepts/OOP.md) (classes, inheritance, polymorphism), smart pointers (`std::unique_ptr`).
>
> Other pattern families: [Structural](./Structural-Patterns.md) · [Behavioral](./Behavioral-Patterns.md).

## Table of Contents
0. [What is a design pattern?](#0-what-is-a-design-pattern)
1. [Singleton](#1-singleton)
2. [Factory Method](#2-factory-method)
3. [Abstract Factory](#3-abstract-factory)
4. [Builder](#4-builder)
5. [Prototype](#5-prototype)
6. [Cheat sheet](#cheat-sheet)

---

## 0. What is a design pattern?

**In one sentence:** a design pattern is a **named, proven solution** to a problem that keeps coming up in software design — a template you adapt, not code you copy.

### In plain words
Architects don't reinvent "the staircase" for every house; they know several staircase designs, when each fits, and their trade-offs. The famous 1994 book *Design Patterns* by the "Gang of Four" (GoF) catalogued 23 such designs for object-oriented code in three families:
- **Creational** — how objects get **created** (this page).
- **Structural** — how objects are **composed** into bigger structures.
- **Behavioral** — how objects **communicate** and share responsibilities.

Patterns give teams a shared vocabulary: "let's use a Strategy here" says a lot in four words. But don't force them — a pattern used where it isn't needed just adds complexity.

**Why creational patterns?** `new ConcreteClass(...)` scattered everywhere couples your code to specific classes and construction details. Creational patterns centralize or abstract *how* objects are made, so you can change *what* gets created without touching the code that uses it.

---

## 1. Singleton

**In one sentence:** Singleton ensures a class has **only one instance** and provides a **global access point** to it.

### In plain words
A country has **one** president at a time. Anyone who needs "the president" gets the same person — you can't create a second one. Typical software examples: an application-wide configuration, a logger, a hardware device driver.

### How it works
1. Make the constructor **private** (nobody outside can create instances).
2. Delete copy/move so no one can clone it.
3. Provide a static `instance()` function that creates the object on first use and returns it afterwards.

In C++11 and later, a **function-local static** ("Meyers' Singleton") is the correct way: its initialization is **thread-safe** by the language standard and happens lazily on first call.

### Modern C++ example
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <map>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

class Config {
public:
    static Config& instance() {
        static Config the_one;          // created once, on first call; thread-safe since C++11
        return the_one;
    }
    Config(const Config&) = delete;     // no copies
    Config& operator=(const Config&) = delete;

    void set(const std::string& k, const std::string& v) { std::scoped_lock l(m_); values_[k] = v; }
    std::string get(const std::string& k) const { std::scoped_lock l(m_); return values_.at(k); }

private:
    Config() { std::cout << "Config constructed (only once)\n"; }
    mutable std::mutex m_;
    std::map<std::string, std::string> values_;
};

int main() {
    {
        std::vector<std::jthread> threads;
        for (int i = 0; i < 4; ++i)                               // 4 threads race for the first call
            threads.emplace_back([] { Config::instance().set("db_url", "postgres://localhost"); });
    }
    std::cout << "same object everywhere? "
              << (&Config::instance() == &Config::instance() ? "yes" : "no") << '\n';
    std::cout << "db_url = " << Config::instance().get("db_url") << '\n';
}
```

**Output:**
```text
Config constructed (only once)
same object everywhere? yes
db_url = postgres://localhost
```

### Common mistakes
- **Overuse.** A Singleton is global state in disguise: it hides dependencies, makes unit testing hard (you can't easily swap it for a fake) and couples everything to it. Often better: create one object in `main` and **pass it in** (dependency injection).
- Hand-rolled "double-checked locking" with raw pointers — unnecessary and error-prone in modern C++.
- Singletons that depend on other singletons during static destruction → order-of-destruction bugs.

### Interview answer
"Singleton restricts a class to one instance with global access. In C++11+ I implement it with a function-local static, which is lazily and thread-safely initialized, and delete copy/move. I use it sparingly because it's global state that hurts testability; dependency injection of a single instance is usually preferable."

---

## 2. Factory Method

**In one sentence:** Factory Method defines a method for creating an object, but lets **subclasses (or a registry) decide which concrete class** to instantiate.

### In plain words
A logistics company plans deliveries. The planning steps are the same everywhere, but *how* goods travel differs: the road branch uses **trucks**, the sea branch uses **ships**. The general code says "create a transport" and each branch decides which one. The planning code never names `Truck` or `Ship`.

### How it works
1. Define a **product interface** (`Transport`) and concrete products (`Truck`, `Ship`).
2. The **creator** class has an abstract `create_transport()` — the *factory method* — and business logic that uses it.
3. Each **concrete creator** overrides the factory method to return its product.

A common modern variant is a **simple factory function / registry**: `make_transport("sea")` returns the right object, and new types register themselves — no giant `switch` in client code.

### Modern C++ example — classic Factory Method + a registry-based factory
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <string>

// Product
struct Transport {
    virtual ~Transport() = default;
    virtual std::string deliver() const = 0;
};
struct Truck : Transport { std::string deliver() const override { return "by road in a box"; } };
struct Ship  : Transport { std::string deliver() const override { return "by sea in a container"; } };

// Creator with a factory method
class Logistics {
public:
    virtual ~Logistics() = default;
    void plan_delivery() const {                                   // shared business logic
        auto t = create_transport();                               // <- the factory method
        std::cout << "Delivering " << t->deliver() << '\n';
    }
protected:
    virtual std::unique_ptr<Transport> create_transport() const = 0;
};
class RoadLogistics : public Logistics {
    std::unique_ptr<Transport> create_transport() const override { return std::make_unique<Truck>(); }
};
class SeaLogistics : public Logistics {
    std::unique_ptr<Transport> create_transport() const override { return std::make_unique<Ship>(); }
};

// Registry variant: create by name, extend without editing this code
using Maker = std::function<std::unique_ptr<Transport>()>;
std::map<std::string, Maker>& registry() { static std::map<std::string, Maker> r; return r; }
std::unique_ptr<Transport> make_transport(const std::string& kind) { return registry().at(kind)(); }

int main() {
    RoadLogistics{}.plan_delivery();
    SeaLogistics{}.plan_delivery();

    registry()["road"] = [] { return std::make_unique<Truck>(); };
    registry()["sea"]  = [] { return std::make_unique<Ship>(); };
    std::cout << "config says 'sea' -> " << make_transport("sea")->deliver() << '\n';
}
```

**Output:**
```text
Delivering by road in a box
Delivering by sea in a container
config says 'sea' -> by sea in a container
```

### Common mistakes
- Creating a subclass hierarchy just to pick a class — a simple factory function or registry is often enough.

### Interview answer
"Factory Method lets a creator defer instantiation to subclasses via an overridable creation method, so client code depends only on the product interface. It supports the Open/Closed Principle — adding a product means adding a class, not editing callers. In practice a factory function or registry keyed by type name is a lightweight variant."

---

## 3. Abstract Factory

**In one sentence:** Abstract Factory provides an interface for creating **families of related objects** that must be used together, without naming their concrete classes.

### In plain words
A furniture store sells matching sets: a **Victorian** chair, sofa and table, or a **Modern** chair, sofa and table. You don't want a Victorian chair next to a Modern sofa. You pick a *style factory* once, and every piece it produces matches.

Software example: a UI toolkit where a `WindowsFactory` creates Windows-style buttons and checkboxes and a `MacFactory` creates Mac-style ones.

### How it works
1. Define an interface for each product (`Button`, `Checkbox`).
2. Define an **abstract factory** with one creation method per product (`create_button()`, `create_checkbox()`).
3. Each **concrete factory** (`LightTheme`, `DarkTheme`) creates one consistent family.
4. The app receives a factory once (from config) and uses only the interfaces.

Factory Method = one product, chosen by subclass. **Abstract Factory = a whole family** of products, guaranteed consistent.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

struct Button   { virtual ~Button() = default;   virtual std::string render() const = 0; };
struct Checkbox { virtual ~Checkbox() = default; virtual std::string render() const = 0; };

struct UiFactory {                                        // the abstract factory
    virtual ~UiFactory() = default;
    virtual std::unique_ptr<Button> create_button() const = 0;
    virtual std::unique_ptr<Checkbox> create_checkbox() const = 0;
};

// Family 1: light theme
struct LightButton   : Button   { std::string render() const override { return "[ OK ] (white)"; } };
struct LightCheckbox : Checkbox { std::string render() const override { return "[x] (white)"; } };
struct LightTheme : UiFactory {
    std::unique_ptr<Button> create_button() const override { return std::make_unique<LightButton>(); }
    std::unique_ptr<Checkbox> create_checkbox() const override { return std::make_unique<LightCheckbox>(); }
};

// Family 2: dark theme
struct DarkButton   : Button   { std::string render() const override { return "[ OK ] (black)"; } };
struct DarkCheckbox : Checkbox { std::string render() const override { return "[x] (black)"; } };
struct DarkTheme : UiFactory {
    std::unique_ptr<Button> create_button() const override { return std::make_unique<DarkButton>(); }
    std::unique_ptr<Checkbox> create_checkbox() const override { return std::make_unique<DarkCheckbox>(); }
};

void draw_settings_screen(const UiFactory& ui) {          // knows only the interfaces
    std::cout << "  " << ui.create_checkbox()->render() << " Enable notifications\n";
    std::cout << "  " << ui.create_button()->render() << '\n';
}

int main() {
    for (bool dark_mode : {false, true}) {
        std::unique_ptr<UiFactory> ui = dark_mode ? std::unique_ptr<UiFactory>(std::make_unique<DarkTheme>())
                                                  : std::make_unique<LightTheme>();
        std::cout << (dark_mode ? "dark mode:\n" : "light mode:\n");
        draw_settings_screen(*ui);
    }
}
```

**Output:**
```text
light mode:
  [x] (white) Enable notifications
  [ OK ] (white)
dark mode:
  [x] (black) Enable notifications
  [ OK ] (black)
```

### Common mistakes
- Adding a **new product type** (e.g. `Slider`) requires changing the abstract factory *and every* concrete factory — Abstract Factory is great for new families, awkward for new products.

### Interview answer
"Abstract Factory provides an interface for creating families of related objects, with one concrete factory per family, guaranteeing products are compatible and keeping clients independent of concrete classes. Adding families is easy; adding product kinds requires changing all factories."

---

## 4. Builder

**In one sentence:** Builder constructs a complex object **step by step**, separating *how* it's assembled from its final representation, and avoiding constructors with a dozen parameters.

### In plain words
Ordering a custom burger: "bun: sesame, patty: double, cheese: yes, sauce: BBQ, no onions." You specify the parts you care about, in any order, and at the end say "make it" — instead of one gigantic order form with 15 fields where you must fill every box in the right order.

### How it works
- Problem: `HttpRequest(url, method, headers, body, timeout, retries, follow_redirects, ...)` — the "**telescoping constructor**": unreadable call sites (`Request("x", "GET", {}, "", 30, 3, true)` — what's `3`?).
- Solution: a `Builder` with methods for each part that **return the builder itself** (a *fluent interface*) and a final `build()` that validates and returns the finished, often **immutable**, object.
- The GoF version also has a **Director** that encodes a common building sequence (e.g. "build a standard JSON POST").
- In C++20, **designated initializers** (`Options{.timeout = 30}`) cover simple cases; Builder shines when construction needs validation or steps.

### Modern C++ example — a fluent HTTP request builder
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>

using namespace std::chrono_literals;

class HttpRequest {                                    // the product: immutable once built
public:
    class Builder;
    void print() const {
        std::cout << method_ << ' ' << url_ << " (timeout " << timeout_.count() << "s, retries " << retries_ << ")\n";
        for (const auto& [k, v] : headers_) std::cout << "  " << k << ": " << v << '\n';
        if (!body_.empty()) std::cout << "  body: " << body_ << '\n';
    }
private:
    HttpRequest() = default;
    std::string url_, method_ = "GET", body_;
    std::map<std::string, std::string> headers_;
    std::chrono::seconds timeout_ = 30s;
    int retries_ = 0;
};

class HttpRequest::Builder {
public:
    explicit Builder(std::string url) { r_.url_ = std::move(url); }
    Builder& method(std::string m)                    { r_.method_ = std::move(m); return *this; }
    Builder& header(std::string k, std::string v)     { r_.headers_[std::move(k)] = std::move(v); return *this; }
    Builder& body(std::string b)                      { r_.body_ = std::move(b); return *this; }
    Builder& timeout(std::chrono::seconds t)          { r_.timeout_ = t; return *this; }
    Builder& retries(int n)                           { r_.retries_ = n; return *this; }
    HttpRequest build() const {                       // validate the whole object once
        if (r_.url_.empty()) throw std::invalid_argument("url required");
        if (r_.method_ == "GET" && !r_.body_.empty()) throw std::invalid_argument("GET must not have a body");
        return r_;
    }
private:
    HttpRequest r_;
};

int main() {
    auto req = HttpRequest::Builder("https://api.example.com/orders")
                   .method("POST")
                   .header("Content-Type", "application/json")
                   .body(R"({"item":"book","qty":1})")
                   .timeout(10s)
                   .retries(3)
                   .build();
    req.print();

    try { HttpRequest::Builder("https://x.com").body("oops").build(); }
    catch (const std::exception& e) { std::cout << "build failed: " << e.what() << '\n'; }
}
```

**Output:**
```text
POST https://api.example.com/orders (timeout 10s, retries 3)
  Content-Type: application/json
  body: {"item":"book","qty":1}
build failed: GET must not have a body
```

### Common mistakes
- Using a Builder for an object with 2–3 fields — a constructor or aggregate initialization is simpler.

### Interview answer
"Builder separates the construction of a complex object from its representation, assembling it step by step through a fluent interface and validating in a final build() that returns a complete, often immutable object. It removes telescoping constructors and makes call sites self-documenting."

---

## 5. Prototype

**In one sentence:** Prototype creates new objects by **cloning an existing object** (the prototype) instead of building them from scratch — useful when you only have a base-class pointer or when setup is expensive.

### In plain words
A cell divides to make a copy of itself; a photocopier copies a filled-in form. In a game level editor, you configure one "Goblin" with its stats, sprite and AI settings, then **duplicate** it 50 times. You don't need to know its exact class to copy it — you just ask it to clone itself.

### How it works
- Problem: you have `Shape* s` (could be a Circle, a Rectangle…). How do you copy it? `Shape copy = *s;` **slices** it; you don't know the real class.
- Solution: a virtual `clone()` in the base class; each concrete class implements it using its own copy constructor.
- Often combined with a **prototype registry**: pre-configured templates ("small goblin", "boss goblin") that are cloned on demand.
- Watch **deep vs. shallow copy**: members that are pointers must be copied properly (C++ value semantics and smart pointers help).

### Modern C++ example — polymorphic clone + prototype registry
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <vector>

class Enemy {
public:
    virtual ~Enemy() = default;
    virtual std::unique_ptr<Enemy> clone() const = 0;      // "copy yourself"
    virtual std::string describe() const = 0;
    void move_to(int x, int y) { x_ = x; y_ = y; }
protected:
    int x_ = 0, y_ = 0;
};

class Goblin : public Enemy {
public:
    Goblin(int hp, std::string weapon) : hp_(hp), weapon_(std::move(weapon)) {}
    std::unique_ptr<Enemy> clone() const override { return std::make_unique<Goblin>(*this); }  // copy ctor
    std::string describe() const override {
        return "Goblin(hp=" + std::to_string(hp_) + ", " + weapon_ + ") at (" +
               std::to_string(x_) + "," + std::to_string(y_) + ")";
    }
private:
    int hp_;
    std::string weapon_;
};

class Dragon : public Enemy {
public:
    explicit Dragon(int fire) : fire_(fire) {}
    std::unique_ptr<Enemy> clone() const override { return std::make_unique<Dragon>(*this); }
    std::string describe() const override {
        return "Dragon(fire=" + std::to_string(fire_) + ") at (" + std::to_string(x_) + "," + std::to_string(y_) + ")";
    }
private:
    int fire_;
};

int main() {
    // Prototype registry: pre-configured templates
    std::map<std::string, std::unique_ptr<Enemy>> prototypes;
    prototypes["goblin"] = std::make_unique<Goblin>(30, "rusty dagger");
    prototypes["boss"] = std::make_unique<Dragon>(999);

    std::vector<std::unique_ptr<Enemy>> level;
    for (int i = 0; i < 3; ++i) {
        auto g = prototypes.at("goblin")->clone();         // no need to know it's a Goblin
        g->move_to(i * 10, 0);
        level.push_back(std::move(g));
    }
    auto boss = prototypes.at("boss")->clone();
    boss->move_to(50, 50);
    level.push_back(std::move(boss));

    for (const auto& e : level) std::cout << e->describe() << '\n';
}
```

**Output:**
```text
Goblin(hp=30, rusty dagger) at (0,0)
Goblin(hp=30, rusty dagger) at (10,0)
Goblin(hp=30, rusty dagger) at (20,0)
Dragon(fire=999) at (50,50)
```

### Common mistakes
- Shallow-copying owned raw pointers → two objects share (and later double-delete) the same resource.
- Forgetting to override `clone()` in a new subclass → you get a copy of the parent type.

### Interview answer
"Prototype creates objects by cloning a configured instance through a virtual clone method, so clients can copy objects known only by their base type, avoiding slicing and costly re-initialization. In C++, clone returns a unique_ptr built with the derived copy constructor, and deep-copy semantics must be correct."

---

## Cheat sheet

| Pattern | Problem it solves | Key idea | C++ tool |
|---|---|---|---|
| Singleton | Exactly one shared instance | Private ctor + static accessor | Function-local static |
| Factory Method | Decide concrete class elsewhere | Overridable `create()` / registry | `unique_ptr<Base>` returned |
| Abstract Factory | Create consistent families | One factory per family | Interface of `create_x()` methods |
| Builder | Complex construction, many options | Step-by-step fluent API + `build()` | Methods returning `*this` |
| Prototype | Copy objects known by base type | Virtual `clone()` | `make_unique<Derived>(*this)` |
