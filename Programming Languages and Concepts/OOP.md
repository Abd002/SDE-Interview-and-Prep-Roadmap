# Object-Oriented Programming (OOP) — Explained for Beginners

> **What you'll learn:** the four pillars — **encapsulation, inheritance, polymorphism, abstraction** — then **composition vs. inheritance** and **method overriding vs. method overloading**, all in modern C++.
>
> **Prerequisites:** basic C++ (functions, structs). For the big picture of OOP as a paradigm see [Programming Paradigms](./Programming-Paradigms.md#4-object-oriented-programming). For reusable OOP solutions see the [Design Patterns](#design-patterns) section at the end.

## Table of Contents
0. [Classes and objects in 60 seconds](#0-classes-and-objects-in-60-seconds)
1. [Encapsulation](#1-encapsulation)
2. [Inheritance](#2-inheritance)
3. [Polymorphism](#3-polymorphism)
4. [Abstraction](#4-abstraction)
5. [Composition vs. Inheritance](#5-composition-vs-inheritance)
6. [Method overriding vs. Method overloading](#6-method-overriding-vs-method-overloading)
7. [Design patterns](#design-patterns)
8. [Cheat sheet](#cheat-sheet)

---

## 0. Classes and objects in 60 seconds

- A **class** is a blueprint: "a Dog has a name and can bark".
- An **object** (instance) is a thing built from the blueprint: "Rex, a specific dog".
- **Members** = data (fields/attributes) + functions (methods).
- **Constructor** runs when an object is created; **destructor** when it's destroyed.

```c++
class Dog {
public:
    explicit Dog(std::string name) : name_(std::move(name)) {}   // constructor
    void bark() const { std::cout << name_ << ": Woof!\n"; }     // method
private:
    std::string name_;                                           // data
};
Dog rex("Rex");   // an object
rex.bark();
```

---

## 1. Encapsulation

**In one sentence:** encapsulation means bundling data with the methods that operate on it, and **hiding the data** so it can only be changed through those methods — which protect the object's rules (its *invariants*).

### In plain words
A bank ATM. You can't open the machine and grab cash; you must use the buttons (the **public interface**), which check your PIN and your balance. The cash inside is **private**. The ATM guarantees rules like "the balance never goes below zero" because nobody can bypass its buttons.

### How it works
- `private:` members are only accessible inside the class; `public:` members are the interface; `protected:` members are also visible to derived classes.
- An **invariant** is a rule that must always be true for a valid object (e.g. `balance >= 0`, "a `Date` never has month 13").
- Constructors establish invariants; every public method preserves them.
- **Getters/setters everywhere** are *not* encapsulation — a setter that allows anything exposes the data anyway. Prefer meaningful operations (`deposit`, `withdraw`) over `setBalance`.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>

class BankAccount {
public:
    explicit BankAccount(std::string owner) : owner_(std::move(owner)) {}

    void deposit(long cents) {
        if (cents <= 0) throw std::invalid_argument("deposit must be positive");
        balance_cents_ += cents;
    }
    bool withdraw(long cents) {
        if (cents <= 0 || cents > balance_cents_) return false;   // invariant protected
        balance_cents_ -= cents;
        return true;
    }
    long balance() const { return balance_cents_; }                 // read-only access

private:
    std::string owner_;
    long balance_cents_ = 0;      // invariant: never negative; nobody outside can touch it
};

int main() {
    BankAccount acc("Ana");
    acc.deposit(10'000);
    std::cout << "withdraw 150.00: " << (acc.withdraw(15'000) ? "ok" : "refused") << '\n';
    std::cout << "withdraw  40.00: " << (acc.withdraw(4'000) ? "ok" : "refused") << '\n';
    std::cout << "balance: " << acc.balance() / 100.0 << '\n';
    // acc.balance_cents_ = -500;   // compile error: 'balance_cents_' is private
}
```

**Output:**
```text
withdraw 150.00: refused
withdraw  40.00: ok
balance: 60
```

### Common mistakes
- Making everything public "for convenience".
- Returning non-const references to internal data (`std::vector<int>& items()`), letting callers break invariants.

### Interview answer
"Encapsulation bundles state with behavior and hides the state behind a minimal interface so the class can enforce its invariants. It reduces coupling: internals can change without breaking callers."

---

## 2. Inheritance

**In one sentence:** inheritance lets a new class (**derived**/child) reuse and extend an existing class (**base**/parent), expressing an **"is-a"** relationship.

### In plain words
A "sports car" **is a** "car": it has everything a car has (wheels, engine, steering) plus extras (spoiler, turbo). You don't redesign the car from scratch — you start from the car blueprint and add to it.

### How it works
- `class Derived : public Base { ... };` — `Derived` gets `Base`'s public and protected members.
- **Public inheritance** = "is-a" and is what you almost always want. (`private`/`protected` inheritance mean "implemented in terms of" — rare.)
- The base part is constructed **first**, destroyed **last**.
- If a class is meant to be used polymorphically, give the base a **`virtual` destructor**; otherwise deleting a derived object via a base pointer is undefined behavior.
- C++ supports **multiple inheritance** (a class with several bases) — powerful but can create the "diamond problem"; `virtual` inheritance resolves it. Many languages (Java, C#) allow multiple *interfaces* but only one base class.
- `final` prevents further inheritance/overriding.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

class Vehicle {
public:
    explicit Vehicle(std::string brand) : brand_(std::move(brand)) {
        std::cout << "  Vehicle constructed\n";
    }
    virtual ~Vehicle() { std::cout << "  Vehicle destroyed\n"; }
    void honk() const { std::cout << "  " << brand_ << ": beep beep\n"; }   // inherited as-is
protected:
    std::string brand_;                        // visible to derived classes
};

class SportsCar final : public Vehicle {       // SportsCar IS-A Vehicle
public:
    SportsCar(std::string brand, int hp) : Vehicle(std::move(brand)), horsepower_(hp) {
        std::cout << "  SportsCar constructed\n";
    }
    ~SportsCar() override { std::cout << "  SportsCar destroyed\n"; }
    void boost() const { std::cout << "  " << brand_ << " boosts to " << horsepower_ << " hp!\n"; }
private:
    int horsepower_;
};

int main() {
    std::cout << "create:\n";
    {
        SportsCar car("Zoom", 500);
        std::cout << "use:\n";
        car.honk();     // from Vehicle
        car.boost();    // added by SportsCar
        std::cout << "destroy:\n";
    }
}
```

**Output:**
```text
create:
  Vehicle constructed
  SportsCar constructed
use:
  Zoom: beep beep
  Zoom boosts to 500 hp!
destroy:
  SportsCar destroyed
  Vehicle destroyed
```

### Common mistakes
- Inheriting just to reuse code when there's no real "is-a" (e.g. `class Stack : public std::vector`) — use composition.
- Forgetting the `virtual` destructor in a polymorphic base.
- Deep hierarchies (5+ levels) — hard to understand and change.

### Interview answer
"Inheritance models an is-a relationship where a derived class reuses and extends a base class. Base subobjects are constructed first and destroyed last; polymorphic bases need virtual destructors. It's a strong coupling, so I use it for genuine subtype relationships and prefer composition for code reuse."

---

## 3. Polymorphism

**In one sentence:** polymorphism ("many forms") lets you write code against a general type, and each specific type responds to the same call **in its own way**.

### In plain words
A universal TV remote: you press **Power** and it works on a Sony, a Samsung or an LG TV. You don't care which brand — each TV knows how to turn *itself* on. One button, many behaviors.

### How it works
C++ has two kinds:
| | Runtime (dynamic) polymorphism | Compile-time (static) polymorphism |
|---|---|---|
| Mechanism | `virtual` functions + base pointers/references | Templates, concepts, overloading |
| Decided | At runtime (via the **vtable**) | At compile time |
| Cost | An indirect call; objects usually on the heap | Zero runtime cost; more code generated |
| Flexibility | Mix different types in one container | Types must be known at compile time |

**How virtual calls work:** each class with virtual functions has a hidden table of function pointers (**vtable**); each object holds a hidden pointer to its class's vtable (**vptr**). `shape->area()` looks up the right function in the table at runtime — **dynamic dispatch**.

(A third, modern option: `std::variant` + `std::visit` for a closed set of types.)

### Modern C++ example — runtime and compile-time polymorphism
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <concepts>
#include <iostream>
#include <memory>
#include <vector>

// ---- Runtime polymorphism ----
class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const = 0;              // each animal decides how
};
class Dog : public Animal { public: void speak() const override { std::cout << "Woof\n"; } };
class Cat : public Animal { public: void speak() const override { std::cout << "Meow\n"; } };

// ---- Compile-time polymorphism with a C++20 concept ----
template <class T>
concept Speaker = requires(const T& t) { t.speak(); };

struct Robot { void speak() const { std::cout << "Beep\n"; } };  // not related to Animal!

void make_it_speak(const Speaker auto& s) { s.speak(); }         // resolved at compile time

int main() {
    std::vector<std::unique_ptr<Animal>> zoo;
    zoo.push_back(std::make_unique<Dog>());
    zoo.push_back(std::make_unique<Cat>());
    for (const auto& a : zoo) a->speak();        // dynamic dispatch through the vtable

    make_it_speak(Dog{});                        // static: any type with speak() works
    make_it_speak(Robot{});
}
```

**Output:**
```text
Woof
Meow
Woof
Beep
```

### Common mistakes
- **Object slicing:** `Animal a = Dog{};` copies only the Animal part; `a.speak()` won't act like a Dog. Use pointers/references for polymorphism.
- Forgetting `override` — then a typo in the signature silently creates a *new* function instead of overriding.
- Calling virtual functions from constructors/destructors — they don't dispatch to the derived class there.

### Interview answer
"Polymorphism lets one interface have many implementations. In C++, runtime polymorphism uses virtual functions dispatched through a vtable via base pointers or references; compile-time polymorphism uses templates, concepts and overloading with no runtime cost. I use `override`, avoid slicing, and give polymorphic bases virtual destructors."

---

## 4. Abstraction

**In one sentence:** abstraction means exposing **what** something does through a simple interface while hiding **how** it does it.

### In plain words
You drive a car with a steering wheel, pedals and a gear stick. You don't need to know about fuel injection, spark timing or hydraulic brakes. The car's controls are an **abstraction** over thousands of complicated parts. Even an electric car keeps the same controls — the implementation changed completely, your "interface" didn't.

### How it works
- In C++, an **abstract class** has at least one **pure virtual** function (`= 0`) and can't be instantiated. A class with only pure virtual functions acts as an **interface**.
- Code depends on the abstraction, not the concrete class → you can swap implementations (real vs. test mock, SQL vs. in-memory). This is the **Dependency Inversion Principle** (see [OOD Principles](../System%20Design/OOD-Principles.md)).
- **Encapsulation vs. abstraction:** encapsulation *hides data* to protect invariants; abstraction *hides complexity* to simplify usage. They work together.
- Abstraction also appears without classes: a well-named function (`send_email(to, body)`) is an abstraction.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <string>

// The abstraction: WHAT a storage can do.
class KeyValueStore {
public:
    virtual ~KeyValueStore() = default;
    virtual void put(const std::string& key, const std::string& value) = 0;
    virtual std::optional<std::string> get(const std::string& key) const = 0;
};

// One implementation: HOW (in memory).
class InMemoryStore : public KeyValueStore {
public:
    void put(const std::string& k, const std::string& v) override { data_[k] = v; }
    std::optional<std::string> get(const std::string& k) const override {
        auto it = data_.find(k);
        return it == data_.end() ? std::nullopt : std::optional(it->second);
    }
private:
    std::map<std::string, std::string> data_;
};

// Another implementation: pretends to talk to a remote server.
class LoggingRemoteStore : public KeyValueStore {
public:
    void put(const std::string& k, const std::string& v) override {
        std::cout << "  [network] PUT " << k << '\n';
        cache_.put(k, v);
    }
    std::optional<std::string> get(const std::string& k) const override {
        std::cout << "  [network] GET " << k << '\n';
        return cache_.get(k);
    }
private:
    InMemoryStore cache_;
};

// Business code only knows the abstraction:
void save_user(KeyValueStore& store) {
    store.put("user:1", "Ana");
    auto name = store.get("user:1");
    std::cout << "  loaded: " << name.value_or("?") << '\n';
}

int main() {
    InMemoryStore mem;
    LoggingRemoteStore remote;
    std::cout << "in-memory:\n";  save_user(mem);
    std::cout << "remote:\n";     save_user(remote);
}
```

**Output:**
```text
in-memory:
  loaded: Ana
remote:
  [network] PUT user:1
  [network] GET user:1
  loaded: Ana
```

### Interview answer
"Abstraction exposes essential behavior through an interface and hides implementation details. In C++ that's typically an abstract base class with pure virtual functions, or a concept for compile-time interfaces. Depending on abstractions lets implementations be swapped and tested independently."

---

## 5. Composition vs. Inheritance

**In one sentence:** inheritance builds a class by **being** another ("is-a"); composition builds a class by **having** other objects as parts ("has-a") — and the common advice is **"favor composition over inheritance."**

### In plain words
- **Inheritance:** a "FlyingCar" **is a** Car *and* **is a** Plane — tangled, and every change to Car or Plane ripples into FlyingCar.
- **Composition:** a Car **has an** Engine, **has** Wheels, **has a** GPS. Want an electric car? Swap the Engine part. Parts are like LEGO bricks; inheritance is like carving from one block of stone.

### How it works
| | Inheritance | Composition |
|---|---|---|
| Relationship | is-a | has-a |
| Coupling | Tight: derived depends on base internals | Loose: depends only on the part's public interface |
| Flexibility | Fixed at compile time | Parts can be swapped, even at runtime |
| Reuse | Of implementation (white-box) | Of behavior (black-box) |
| Risk | **Fragile base class**: a base change breaks children; deep hierarchies | More small classes / forwarding code |

Use inheritance when there is a true, stable **subtype** relationship and you need polymorphism (and the Liskov Substitution Principle holds). Use composition for code reuse and for combining behaviors.

Classic example of inheritance going wrong: `Bird` has `fly()`, then `Penguin : Bird`... penguins can't fly. With composition, a bird *has a* movement strategy.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

// Parts ("has-a"): small, swappable behaviors.
struct Engine {
    virtual ~Engine() = default;
    virtual std::string start() const = 0;
};
struct GasEngine : Engine { std::string start() const override { return "vroom (gas)"; } };
struct ElectricEngine : Engine { std::string start() const override { return "hum (electric)"; } };

class Car {
public:
    explicit Car(std::unique_ptr<Engine> e) : engine_(std::move(e)) {}
    void drive() const { std::cout << "Car starts: " << engine_->start() << '\n'; }
    void swap_engine(std::unique_ptr<Engine> e) { engine_ = std::move(e); }   // change at runtime!
private:
    std::unique_ptr<Engine> engine_;   // Car HAS-AN Engine
};

int main() {
    Car car(std::make_unique<GasEngine>());
    car.drive();
    car.swap_engine(std::make_unique<ElectricEngine>());   // impossible with "class Car : GasEngine"
    car.drive();
}
```

**Output:**
```text
Car starts: vroom (gas)
Car starts: hum (electric)
```

### Interview answer
"Inheritance expresses is-a and couples the child to the parent's implementation; composition expresses has-a and depends only on the part's interface, so it's more flexible and can change behavior at runtime. I favor composition for reuse and reserve inheritance for true substitutable subtypes — the basis of patterns like Strategy and Decorator."

---

## 6. Method overriding vs. Method overloading

**In one sentence:** **overriding** is a derived class *replacing* a base class's virtual method with the same signature (runtime polymorphism); **overloading** is having *several functions with the same name but different parameters* in the same scope (compile-time choice).

### In plain words
- **Overloading:** a word with several meanings depending on context — "print a number", "print a string", "print a picture". The compiler picks the right one by looking at the arguments.
- **Overriding:** a child changing a family recipe. The recipe is still called "Grandma's soup" (same name, same ingredients list), but the child's version tastes different, and when you ask *the child* for "Grandma's soup", you get their version.

### How it works
| | Overloading | Overriding |
|---|---|---|
| Where | Same scope (same class or namespace) | Base class + derived class |
| Signature | Same name, **different parameters** | Same name, **same parameters** (and compatible return type) |
| Needs `virtual`? | No | Yes (in the base) |
| Resolved | At compile time | At runtime (dynamic dispatch) |
| Kind of polymorphism | Static (ad-hoc) | Dynamic (subtype) |
| C++ keywords | — | `virtual`, `override`, `final` |

Gotcha — **name hiding**: if a derived class declares a function named `f`, it *hides* all base-class overloads of `f`. Bring them back with `using Base::f;`.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

class Printer {
public:
    virtual ~Printer() = default;
    // OVERLOADING: same name, different parameter types
    void print(int x) const         { std::cout << "int: " << x << '\n'; }
    void print(double x) const      { std::cout << "double: " << x << '\n'; }
    void print(const std::string& s) const { std::cout << "string: " << s << '\n'; }

    virtual std::string header() const { return "== Plain report =="; }  // can be overridden
};

class FancyPrinter : public Printer {
public:
    // OVERRIDING: same signature, new behavior
    std::string header() const override { return "*** Fancy report ***"; }
};

void report(const Printer& p) {                      // works with any Printer
    std::cout << p.header() << '\n';                 // runtime choice (overriding)
    p.print(42);                                     // compile-time choice (overloading)
    p.print(3.5);
    p.print(std::string("done"));
}

int main() {
    report(Printer{});
    report(FancyPrinter{});
}
```

**Output:**
```text
== Plain report ==
int: 42
double: 3.5
string: done
*** Fancy report ***
int: 42
double: 3.5
string: done
```

### Interview answer
"Overloading is multiple functions with the same name and different parameter lists, resolved at compile time. Overriding is a derived class providing a new implementation of a base virtual function with the same signature, resolved at runtime through the vtable. In C++ I always mark overrides with `override`, and watch out for name hiding of base overloads."

---

## Design patterns

Design patterns are proven, named solutions to recurring OOP design problems. They are covered in the System Design section:
- [Creational patterns](../System%20Design/Design%20Patterns/Creational-Patterns.md) — how objects get created (Singleton, Factory Method, Abstract Factory, Builder, Prototype).
- [Structural patterns](../System%20Design/Design%20Patterns/Structural-Patterns.md) — how objects are composed (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy).
- [Behavioral patterns](../System%20Design/Design%20Patterns/Behavioral-Patterns.md) — how objects communicate (Observer, Strategy, Command, State, Visitor…).

---

## Cheat sheet

| Concept | One-liner | C++ |
|---|---|---|
| Encapsulation | Hide data, protect invariants | `private` + meaningful methods |
| Inheritance | is-a, reuse + extend | `class D : public B` |
| Polymorphism | One interface, many behaviors | `virtual`/`override`; templates/concepts |
| Abstraction | Expose what, hide how | pure virtual `= 0`, concepts |
| Composition | has-a; favor over inheritance | member objects / `unique_ptr` parts |
| Overloading | Same name, different params; compile time | several `print(...)` |
| Overriding | Same signature in derived; runtime | `override` |
