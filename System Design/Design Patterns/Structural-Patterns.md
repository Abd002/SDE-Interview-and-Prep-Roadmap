# Structural Design Patterns — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy

> **What you'll learn:** the seven **structural** patterns — ways to **combine classes and objects into larger structures** while keeping them flexible — each with an everyday analogy, how it works, and a modern C++ implementation.
>
> **Prerequisites:** [OOP](../../Programming%20Languages%20and%20Concepts/OOP.md), especially [composition vs. inheritance](../../Programming%20Languages%20and%20Concepts/OOP.md#5-composition-vs-inheritance). What patterns are: [Creational Patterns → intro](./Creational-Patterns.md#0-what-is-a-design-pattern).

## Table of Contents
1. [Adapter](#1-adapter)
2. [Bridge](#2-bridge)
3. [Composite](#3-composite)
4. [Decorator](#4-decorator)
5. [Facade](#5-facade)
6. [Flyweight](#6-flyweight)
7. [Proxy](#7-proxy)
8. [Cheat sheet](#cheat-sheet)

---

## 1. Adapter

**In one sentence:** Adapter converts the interface of an existing class into the interface your code expects, so incompatible classes can work together.

### In plain words
A **travel plug adapter**: your laptop charger has a European plug, the wall socket is American. You don't rewire the charger or the wall — you put an adapter in between.

### How it works
- **Target:** the interface your code wants (`JsonLogger::log(json)`).
- **Adaptee:** the existing class with a different interface (a third-party library you can't change).
- **Adapter:** implements the Target and internally calls the Adaptee, translating arguments/results.
- *Object adapter* (holds the adaptee — preferred) vs. *class adapter* (inherits from it).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

// What our application expects:
struct Logger {
    virtual ~Logger() = default;
    virtual void log(const std::string& level, const std::string& message) = 0;
};

// A third-party library we can't modify, with a different interface:
class LegacyLogLib {
public:
    void write_line(int severity_code, const char* text) {
        std::cout << "[legacy sev=" << severity_code << "] " << text << '\n';
    }
};

// The adapter: looks like a Logger, talks to LegacyLogLib.
class LegacyLoggerAdapter : public Logger {
public:
    explicit LegacyLoggerAdapter(std::unique_ptr<LegacyLogLib> lib) : lib_(std::move(lib)) {}
    void log(const std::string& level, const std::string& message) override {
        int code = level == "ERROR" ? 3 : level == "WARN" ? 2 : 1;   // translate the arguments
        lib_->write_line(code, message.c_str());
    }
private:
    std::unique_ptr<LegacyLogLib> lib_;
};

void process_order(Logger& logger) {                                   // app code: only knows Logger
    logger.log("INFO", "order received");
    logger.log("ERROR", "payment declined");
}

int main() {
    LegacyLoggerAdapter adapter(std::make_unique<LegacyLogLib>());
    process_order(adapter);
}
```

**Output:**
```text
[legacy sev=1] order received
[legacy sev=3] payment declined
```

### Interview answer
"Adapter wraps an existing class to expose the interface clients expect, translating calls and data. It lets you integrate legacy or third-party code without modifying it; object adapters via composition are preferred over class adapters via inheritance."

---

## 2. Bridge

**In one sentence:** Bridge splits a big class into two separate hierarchies — **abstraction** (what) and **implementation** (how) — connected by a reference, so both can vary independently.

### In plain words
TV **remotes** and **TV brands**. There are basic remotes and advanced remotes; there are Sony and Samsung TVs. Without Bridge you'd need `BasicSonyRemote`, `BasicSamsungRemote`, `AdvancedSonyRemote`, `AdvancedSamsungRemote`… (2 × 2 classes, and it explodes as you add more). With Bridge, a remote **holds a reference to** some TV: 2 remotes + 2 TVs = 4 classes, combined freely.

### How it works
- **Abstraction** (`Remote`) holds a pointer to an **Implementor** interface (`Device`).
- **Refined abstractions** (`AdvancedRemote`) extend the abstraction.
- **Concrete implementors** (`Tv`, `Radio`) implement the device interface.
- Turns an M × N class explosion into M + N classes. Classic real uses: GUI frameworks across OSes, drivers, rendering APIs (shape × renderer).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

// Implementation hierarchy: HOW
struct Device {
    virtual ~Device() = default;
    virtual std::string name() const = 0;
    virtual void set_volume(int v) = 0;
    virtual int volume() const = 0;
};
class Tv : public Device {
    int vol_ = 10;
public:
    std::string name() const override { return "TV"; }
    void set_volume(int v) override { vol_ = v; }
    int volume() const override { return vol_; }
};
class Radio : public Device {
    int vol_ = 30;
public:
    std::string name() const override { return "Radio"; }
    void set_volume(int v) override { vol_ = v; }
    int volume() const override { return vol_; }
};

// Abstraction hierarchy: WHAT
class Remote {
public:
    explicit Remote(std::shared_ptr<Device> d) : device_(std::move(d)) {}   // the "bridge"
    virtual ~Remote() = default;
    void volume_up() { device_->set_volume(device_->volume() + 1); report(); }
protected:
    void report() const { std::cout << device_->name() << " volume = " << device_->volume() << '\n'; }
    std::shared_ptr<Device> device_;
};
class AdvancedRemote : public Remote {
public:
    using Remote::Remote;
    void mute() { device_->set_volume(0); report(); }
};

int main() {
    Remote basic_for_radio(std::make_shared<Radio>());
    AdvancedRemote advanced_for_tv(std::make_shared<Tv>());
    basic_for_radio.volume_up();
    advanced_for_tv.volume_up();
    advanced_for_tv.mute();          // any remote works with any device
}
```

**Output:**
```text
Radio volume = 31
TV volume = 11
TV volume = 0
```

### Interview answer
"Bridge decouples an abstraction from its implementation by composing them through an interface, so each hierarchy can evolve independently and M×N subclasses become M+N. Adapter makes existing interfaces compatible after the fact; Bridge is designed up front to separate dimensions of variation."

---

## 3. Composite

**In one sentence:** Composite lets you treat **individual objects and groups of objects the same way** by organizing them into a tree where groups contain children.

### In plain words
A computer's file system: a **folder** can contain files *and other folders*. Asking "what's your size?" works the same on a file (its own size) and a folder (sum of everything inside). You never need to check "is this a file or a folder?".

### How it works
- **Component** interface: operations common to leaves and groups (`size()`, `print()`).
- **Leaf:** a simple element (`File`).
- **Composite:** holds child components and implements operations by **delegating to its children** (`Folder::size()` = sum of children's sizes).
- Uses: file systems, UI widget trees, organization charts, scene graphs, expression trees, menus.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Node {                                            // Component
    virtual ~Node() = default;
    virtual long size() const = 0;
    virtual void print(int indent = 0) const = 0;
};

class File : public Node {                               // Leaf
public:
    File(std::string n, long s) : name_(std::move(n)), size_(s) {}
    long size() const override { return size_; }
    void print(int indent) const override {
        std::cout << std::string(indent, ' ') << name_ << " (" << size_ << " KB)\n";
    }
private:
    std::string name_;
    long size_;
};

class Folder : public Node {                             // Composite
public:
    explicit Folder(std::string n) : name_(std::move(n)) {}
    Folder& add(std::unique_ptr<Node> child) { children_.push_back(std::move(child)); return *this; }
    long size() const override {                         // delegate to children, recursively
        long total = 0;
        for (const auto& c : children_) total += c->size();
        return total;
    }
    void print(int indent) const override {
        std::cout << std::string(indent, ' ') << name_ << "/ (" << size() << " KB)\n";
        for (const auto& c : children_) c->print(indent + 2);
    }
private:
    std::string name_;
    std::vector<std::unique_ptr<Node>> children_;
};

int main() {
    auto photos = std::make_unique<Folder>("photos");
    photos->add(std::make_unique<File>("beach.jpg", 2048)).add(std::make_unique<File>("cat.png", 512));

    Folder root("home");
    root.add(std::make_unique<File>("notes.txt", 4)).add(std::move(photos));
    root.print(0);
    std::cout << "total: " << root.size() << " KB\n";    // same call works on files and folders
}
```

**Output:**
```text
home/ (2564 KB)
  notes.txt (4 KB)
  photos/ (2560 KB)
    beach.jpg (2048 KB)
    cat.png (512 KB)
total: 2564 KB
```

### Interview answer
"Composite composes objects into tree structures and lets clients treat leaves and composites uniformly through a shared interface, with composites delegating operations recursively to their children. It's the natural pattern for file systems, UI hierarchies and expression trees."

---

## 4. Decorator

**In one sentence:** Decorator **adds behavior to an object dynamically** by wrapping it in another object with the same interface — stackable, without subclassing.

### In plain words
A plain coffee. Add milk → it's still a coffee (costs more). Add caramel on top → still a coffee. Each add-on **wraps** the previous drink and adds its own cost and description. You can combine add-ons in any order without creating classes like `CoffeeWithMilkAndCaramelAndCinnamon`.

### How it works
- The **Decorator** implements the same interface as the component **and holds a component**.
- Each method does its extra work and **forwards** to the wrapped object (before and/or after).
- Decorators can be stacked: `Caramel(Milk(Espresso()))`.
- Real uses: I/O streams (buffering + compression + encryption layers), middleware (logging, auth, retries, caching around a service), UI borders/scrollbars.
- Compared with inheritance: behavior is combined at **runtime** and avoids a subclass explosion.

### Modern C++ example — stackable coffee add-ons
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

struct Beverage {
    virtual ~Beverage() = default;
    virtual std::string description() const = 0;
    virtual double cost() const = 0;
};
struct Espresso : Beverage {
    std::string description() const override { return "espresso"; }
    double cost() const override { return 2.00; }
};

class AddOn : public Beverage {                         // base decorator: IS-A Beverage, HAS-A Beverage
public:
    explicit AddOn(std::unique_ptr<Beverage> inner) : inner_(std::move(inner)) {}
protected:
    std::unique_ptr<Beverage> inner_;
};
struct Milk : AddOn {
    using AddOn::AddOn;
    std::string description() const override { return inner_->description() + " + milk"; }
    double cost() const override { return inner_->cost() + 0.50; }
};
struct Caramel : AddOn {
    using AddOn::AddOn;
    std::string description() const override { return inner_->description() + " + caramel"; }
    double cost() const override { return inner_->cost() + 0.75; }
};

int main() {
    std::unique_ptr<Beverage> order = std::make_unique<Espresso>();
    order = std::make_unique<Milk>(std::move(order));        // wrap
    order = std::make_unique<Caramel>(std::move(order));     // wrap again
    order = std::make_unique<Milk>(std::move(order));        // double milk: just wrap twice
    std::cout << order->description() << " = $" << order->cost() << '\n';
}
```

**Output:**
```text
espresso + milk + caramel + milk = $3.75
```

### Common mistakes
- Deep stacks of decorators are hard to debug ("which layer changed this?").
- Code that checks the concrete type (`dynamic_cast<Espresso*>`) breaks once the object is wrapped.

### Interview answer
"Decorator attaches responsibilities to an object at runtime by wrapping it in objects that share its interface and forward calls while adding behavior. It's a flexible alternative to subclassing for combinable features — classic examples are stream layers and middleware for logging, caching or retries."

---

## 5. Facade

**In one sentence:** Facade provides **one simple interface** to a complicated subsystem made of many classes.

### In plain words
Ordering on a food delivery app: you tap "Order". Behind that one button, the app talks to the restaurant, payment processor, driver dispatch, maps and notifications. The button is a **facade** — you don't deal with any of those systems yourself.

### How it works
- The **Facade** class knows which subsystem classes to call and in what order.
- Clients call the facade; they can still use the subsystem directly if they need advanced features.
- Reduces coupling: if the subsystem changes, only the facade changes.
- Examples: a `VideoConverter::convert(file, "mp4")` hiding codecs/buffers/muxers; an SDK client hiding HTTP, auth and retries; an API gateway is a facade at the architecture level.
- Facade simplifies; **Adapter** converts an interface; **Mediator** coordinates peers that know about the mediator.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// A complicated subsystem with many parts:
struct Inventory  { bool reserve(const std::string& item) { std::cout << "  inventory: reserved " << item << '\n'; return true; } };
struct Payments   { bool charge(const std::string& card, double amt) { std::cout << "  payments: charged $" << amt << " to " << card << '\n'; return true; } };
struct Shipping   { std::string schedule(const std::string& addr) { std::cout << "  shipping: pickup scheduled to " << addr << '\n'; return "TRK-123"; } };
struct Notifier   { void email(const std::string& to, const std::string& msg) { std::cout << "  email to " << to << ": " << msg << '\n'; } };

// The facade: one call that orchestrates everything.
class OrderFacade {
public:
    bool place_order(const std::string& item, double price, const std::string& card,
                     const std::string& address, const std::string& email) {
        if (!inventory_.reserve(item)) return false;
        if (!payments_.charge(card, price)) return false;
        std::string tracking = shipping_.schedule(address);
        notifier_.email(email, "Your " + item + " is on the way, tracking " + tracking);
        return true;
    }
private:
    Inventory inventory_;
    Payments payments_;
    Shipping shipping_;
    Notifier notifier_;
};

int main() {
    OrderFacade shop;
    std::cout << "place_order:\n";
    bool ok = shop.place_order("headphones", 59.99, "**** 4242", "12 Rose St", "ana@example.com");
    std::cout << (ok ? "order placed\n" : "order failed\n");
}
```

**Output:**
```text
place_order:
  inventory: reserved headphones
  payments: charged $59.99 to **** 4242
  shipping: pickup scheduled to 12 Rose St
  email to ana@example.com: Your headphones is on the way, tracking TRK-123
order placed
```

### Interview answer
"Facade offers a simplified, higher-level interface over a complex subsystem, reducing client coupling to its many classes while leaving the subsystem accessible for advanced use. SDK clients and API gateways are facades."

---

## 6. Flyweight

**In one sentence:** Flyweight saves memory when you have **huge numbers of similar objects** by sharing their common, unchanging data (**intrinsic state**) instead of storing a copy in each object.

### In plain words
A forest in a video game has 1,000,000 trees. Each tree needs a position (unique) but also a 3D model, bark texture and leaf texture (the same for every oak). Storing the 5 MB model inside each tree = 5 TB! Instead, all oaks **share one** "oak type" object; each tree stores only its position and a pointer to its type.

Text editors do the same: each character on screen references a shared glyph/font object rather than carrying its own font data.

### How it works
- **Intrinsic state:** shared, immutable data (model, texture, font) → stored once in a **flyweight**.
- **Extrinsic state:** per-object data (position, size) → stored in the small objects or passed in when needed.
- A **flyweight factory** (cache) returns the existing flyweight for a key, or creates it the first time.
- Flyweights must be **immutable** since many objects share them.
- Related everyday C++: string interning, `std::shared_ptr` to shared resources.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <vector>

struct TreeType {                                     // flyweight: intrinsic, shared, immutable
    std::string name;
    std::string texture;                              // pretend these are megabytes of data
    std::string mesh;
};

class TreeTypeFactory {                               // returns shared instances
public:
    std::shared_ptr<const TreeType> get(const std::string& name) {
        auto& slot = cache_[name];
        if (!slot) {
            slot = std::make_shared<const TreeType>(TreeType{name, name + "_bark.png", name + ".mesh"});
            std::cout << "loading heavy data for " << name << '\n';
        }
        return slot;
    }
    std::size_t types_loaded() const { return cache_.size(); }
private:
    std::map<std::string, std::shared_ptr<const TreeType>> cache_;
};

struct Tree {                                         // extrinsic: small, per-object
    float x, y;
    std::shared_ptr<const TreeType> type;
};

int main() {
    TreeTypeFactory factory;
    std::vector<Tree> forest;
    const char* species[] = {"oak", "pine", "birch"};
    for (int i = 0; i < 100'000; ++i)
        forest.push_back({float(i % 500), float(i / 500), factory.get(species[i % 3])});

    std::cout << "trees: " << forest.size() << ", heavy tree types in memory: " << factory.types_loaded() << '\n';
    std::cout << "tree #7 is a " << forest[7].type->name << " at (" << forest[7].x << ',' << forest[7].y << ")\n";
}
```

**Output:**
```text
loading heavy data for oak
loading heavy data for pine
loading heavy data for birch
trees: 100000, heavy tree types in memory: 3
tree #7 is a pine at (7,0)
```

### Interview answer
"Flyweight minimizes memory for large numbers of fine-grained objects by sharing immutable intrinsic state through a factory-managed cache, while each object keeps only its extrinsic state. Examples are glyphs in text rendering and tree or particle types in games."

---

## 7. Proxy

**In one sentence:** Proxy provides a **stand-in object** with the same interface as the real one, controlling access to it — to add laziness, caching, access checks, logging, or remote communication.

### In plain words
A **credit card** is a proxy for your bank account: it has the same "power" (pay for things) but adds checks (PIN, limits) and doesn't carry the actual money. A company **receptionist** is a proxy for the CEO: requests go through them first.

### How it works
The proxy implements the same interface as the **real subject** and holds (or lazily creates) it. Kinds of proxies:
| Kind | Adds |
|---|---|
| **Virtual proxy** | Lazy creation of an expensive object (load a huge image only when displayed) |
| **Protection proxy** | Access control (check permissions before forwarding) |
| **Caching proxy** | Store results of expensive calls |
| **Remote proxy** | Hides that the object lives on another machine (RPC stubs, see [RPC](../../Programming%20Languages%20and%20Concepts/Network-Programming.md#4-remote-procedure-call-rpc)) |
| **Smart reference** | Reference counting, logging (`std::shared_ptr` is a kind of smart proxy) |

**Proxy vs. Decorator:** same structure (wrapper with the same interface). Decorator **adds features** chosen by the client and is often stacked; Proxy **controls access** to the object and usually manages its lifecycle.

### Modern C++ example — virtual + caching + protection proxy
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <stdexcept>
#include <string>

struct ReportService {
    virtual ~ReportService() = default;
    virtual std::string report(const std::string& month) = 0;
};

class RealReportService : public ReportService {           // expensive to create and to call
public:
    RealReportService() { std::cout << "  (connecting to the data warehouse...)\n"; }
    std::string report(const std::string& month) override {
        std::cout << "  (running a 30-second query for " << month << ")\n";
        return "revenue report for " + month;
    }
};

class ReportProxy : public ReportService {
public:
    explicit ReportProxy(std::string user_role) : role_(std::move(user_role)) {}
    std::string report(const std::string& month) override {
        if (role_ != "manager") throw std::runtime_error("access denied for role " + role_);  // protection
        if (auto it = cache_.find(month); it != cache_.end()) return it->second + " [cached]"; // caching
        if (!real_) real_ = std::make_unique<RealReportService>();                             // virtual (lazy)
        return cache_[month] = real_->report(month);
    }
private:
    std::string role_;
    std::unique_ptr<RealReportService> real_;
    std::map<std::string, std::string> cache_;
};

int main() {
    ReportProxy for_manager("manager");
    std::cout << "proxy created (no connection yet)\n";
    std::cout << for_manager.report("2024-05") << '\n';
    std::cout << for_manager.report("2024-05") << '\n';

    ReportProxy for_intern("intern");
    try { for_intern.report("2024-05"); }
    catch (const std::exception& e) { std::cout << "error: " << e.what() << '\n'; }
}
```

**Output:**
```text
proxy created (no connection yet)
  (connecting to the data warehouse...)
  (running a 30-second query for 2024-05)
revenue report for 2024-05
revenue report for 2024-05 [cached]
error: access denied for role intern
```

### Interview answer
"Proxy is a surrogate implementing the same interface as the real subject to control access to it — lazily creating it, caching results, checking permissions, or hiding remoteness. Structurally it resembles Decorator, but its intent is access control and lifecycle management rather than adding features."

---

## Cheat sheet

| Pattern | One-line intent | Analogy |
|---|---|---|
| Adapter | Make an incompatible interface fit | Travel plug adapter |
| Bridge | Separate abstraction from implementation (M+N, not M×N) | Remotes × TVs |
| Composite | Treat single items and groups uniformly (trees) | Files and folders |
| Decorator | Add behavior by wrapping, at runtime | Coffee add-ons |
| Facade | One simple entry point to a complex subsystem | "Order" button |
| Flyweight | Share common state across many objects | One oak model for a million trees |
| Proxy | Stand-in controlling access (lazy, cache, auth, remote) | Credit card, receptionist |
