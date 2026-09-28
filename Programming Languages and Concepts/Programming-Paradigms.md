# Programming Paradigms — Explained for Beginners

> **What you'll learn:** what a "programming paradigm" is and the seven paradigms in the roadmap — **imperative, declarative, functional, object-oriented, procedural, event-driven and aspect-oriented** — plus a side-by-side comparison of **functional vs. imperative vs. declarative**. Every paradigm is shown in modern C++, which (usefully) supports almost all of them.
>
> **Prerequisites:** basic C++ syntax (variables, functions, loops).

## Table of Contents
0. [What is a paradigm?](#0-what-is-a-paradigm)
1. [Imperative programming](#1-imperative-programming)
2. [Declarative programming](#2-declarative-programming)
3. [Functional programming](#3-functional-programming)
4. [Object-oriented programming](#4-object-oriented-programming)
5. [Procedural programming](#5-procedural-programming)
6. [Event-driven programming](#6-event-driven-programming)
7. [Aspect-oriented programming](#7-aspect-oriented-programming)
8. [Functional vs. Imperative vs. Declarative](#8-functional-vs-imperative-vs-declarative)
9. [Cheat sheet](#cheat-sheet)

---

## 0. What is a paradigm?

**In one sentence:** a paradigm is a *style* or *way of thinking* about how to structure a program.

### In plain words
There are many ways to give directions to a friend:
- "Walk 200 m, turn left, walk 50 m, it's the blue door." — step-by-step **instructions** (imperative).
- "My address is 12 Rose Street." — you say **what** you want; they figure out **how** (declarative).

Both get your friend there. Paradigms are like that: different styles for the same goal. Languages are often designed around one paradigm (Haskell → functional, Java → OOP), but **C++ is multi-paradigm** — you can mix styles, choosing the best one for each part of the program.

---

## 1. Imperative programming

**In one sentence:** you tell the computer **exactly how** to do something, step by step, by changing variables (the program's *state*) one statement at a time.

### In plain words
A cooking recipe: "1. Crack 2 eggs into a bowl. 2. Add 100 g flour. 3. Stir for 1 minute." Each step changes the state of the bowl. The order matters.

### How it works
- Core tools: **variables** that change (mutable state), **assignments** (`x = x + 1`), **loops** (`for`, `while`), **conditionals** (`if`).
- This is how the CPU itself works (load, add, store, jump), which is why it's the most natural style for beginners and the most common in C, C++, Java, Python.

### Modern C++ example
Sum the squares of the even numbers — spelled out step by step.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers{1, 2, 3, 4, 5, 6};
    int total = 0;                                   // state we will mutate
    for (std::size_t i = 0; i < numbers.size(); ++i) {   // HOW to loop
        if (numbers[i] % 2 == 0) {                   // HOW to filter
            total += numbers[i] * numbers[i];        // HOW to accumulate
        }
    }
    std::cout << "sum of squares of evens = " << total << '\n';
}
```

**Output:**
```text
sum of squares of evens = 56
```

### Common mistakes
- Letting state be changed from too many places — bugs become hard to track ("who changed `total`?").

### Interview answer
"Imperative programming describes computation as a sequence of statements that change program state. It maps closely to how hardware works and includes procedural and object-oriented styles."

---

## 2. Declarative programming

**In one sentence:** you describe **what** result you want, and the language/library works out **how** to produce it.

### In plain words
At a restaurant you say "I'd like a pizza margherita" — you don't explain how to knead dough. SQL, HTML and spreadsheet formulas are declarative:
```sql
SELECT name FROM employees WHERE salary > 50000;   -- WHAT, not HOW
```
You never wrote a loop; the database decides whether to scan or use an index.

### How it works
- No explicit loops or step order — you state the desired result or rules.
- Examples: SQL, HTML/CSS, regular expressions, build files (Makefiles), configuration (Kubernetes YAML), Prolog, and in C++ the **ranges** library and standard algorithms.
- Benefits: shorter, fewer bugs, the engine can optimize. Cost: less control, and "magic" can be harder to debug.

### Modern C++ example
The same "sum of squares of evens" with C++20 ranges — it reads like a description of the result.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <ranges>
#include <vector>

int main() {
    std::vector<int> numbers{1, 2, 3, 4, 5, 6};

    // "Take the numbers, keep the even ones, square them."
    auto squares_of_evens = numbers
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; });

    int total = std::accumulate(squares_of_evens.begin(), squares_of_evens.end(), 0);
    std::cout << "sum of squares of evens = " << total << '\n';
}
```

**Output:**
```text
sum of squares of evens = 56
```

### Common mistakes
- Thinking declarative means "no code runs step by step". It does — the steps are just hidden inside the engine (the SQL planner, the ranges library).

### Interview answer
"Declarative programming expresses the logic of a computation — what the result should be — without describing control flow. SQL, HTML and regex are declarative; in C++, algorithms and ranges let you write in a declarative style."

---

## 3. Functional programming

**In one sentence:** you build programs by combining **pure functions** — functions that always give the same output for the same input and don't change anything outside themselves — and you avoid changing data.

### In plain words
A calculator's `√` button: press `√9` and you *always* get 3, and pressing it never changes anything else in the calculator. Functional programming builds whole programs from pieces like that, snapping them together like LEGO. Data is never modified; instead you create new data from old.

### How it works
Key ideas (covered in depth in [Functional Programming](./Functional-Programming.md)):
- **Pure functions** — no side effects (no printing, no global changes).
- **Immutability** — don't change data; return new values.
- **First-class & higher-order functions** — functions can be passed around, returned and stored like values.
- **Composition** — build big functions from small ones.
- **Recursion** instead of loops (in purely functional languages).

Languages: Haskell, Elm, Clojure, F#, Elixir; and functional features in C++, JavaScript, Python, Rust, Java, Kotlin.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <vector>

// Pure function: output depends only on input, nothing outside is changed.
constexpr int square(int x) { return x * x; }
constexpr bool is_even(int x) { return x % 2 == 0; }

// Higher-order function: takes functions as parameters, returns a NEW vector.
template <class Pred, class F>
std::vector<int> filter_map(const std::vector<int>& in, Pred keep, F f) {
    std::vector<int> out;
    for (int x : in) if (keep(x)) out.push_back(f(x));
    return out;   // the input is never modified
}

int main() {
    const std::vector<int> numbers{1, 2, 3, 4, 5, 6};          // immutable input
    const auto squares = filter_map(numbers, is_even, square);
    const int total = std::reduce(squares.begin(), squares.end(), 0);
    std::cout << "sum of squares of evens = " << total << '\n';

    static_assert(square(4) == 16);   // pure + constexpr -> can even run at compile time
}
```

**Output:**
```text
sum of squares of evens = 56
```

### Interview answer
"Functional programming models computation as evaluating pure functions and avoids mutable state and side effects. It relies on immutability, higher-order functions and composition, which make code easier to reason about, test and parallelize."

---

## 4. Object-oriented programming

**In one sentence:** you organize a program as a set of **objects** — bundles of data plus the functions that act on that data — which interact by calling each other's methods.

### In plain words
A car has **data** (color, speed, fuel) and **actions** (accelerate, brake). You don't reach into the engine to change the speed directly; you press the pedal (call a method). Different car models share a common idea of "vehicle" but behave differently. That's the OOP world view: model the program as interacting "things".

### How it works
Four pillars (covered in depth in [OOP](./OOP.md)):
1. **Encapsulation** — hide internal data; expose a safe interface.
2. **Abstraction** — show *what* an object does, hide *how*.
3. **Inheritance** — a class can build on another ("a Dog is an Animal").
4. **Polymorphism** — the same call (`speak()`) does different things for different objects.

Languages: Java, C#, C++, Python, Ruby, Kotlin, Swift.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Shape {                                    // abstraction: what every shape can do
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
};

class Circle : public Shape {                    // inheritance
public:
    explicit Circle(double r) : r_(r) {}
    double area() const override { return 3.14159 * r_ * r_; }
    std::string name() const override { return "circle"; }
private:
    double r_;                                   // encapsulation: hidden data
};

class Rectangle : public Shape {
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "rectangle"; }
private:
    double w_, h_;
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(1.0));
    shapes.push_back(std::make_unique<Rectangle>(2.0, 3.0));
    for (const auto& s : shapes)                 // polymorphism: same call, different behavior
        std::cout << s->name() << " area = " << s->area() << '\n';
}
```

**Output:**
```text
circle area = 3.14159
rectangle area = 6
```

### Interview answer
"OOP structures programs around objects combining state and behavior, using encapsulation, abstraction, inheritance and polymorphism. It's good for modeling domains with many interacting entities, but deep inheritance hierarchies can become rigid, so composition is often preferred."

---

## 5. Procedural programming

**In one sentence:** procedural programming is imperative programming organized into **procedures** (functions) — reusable, named blocks of steps — with data passed between them.

### In plain words
A long recipe book split into chapters: "Make the dough (see page 3)", "Make the sauce (see page 5)", "Assemble". Each chapter is a procedure you can reuse in many recipes. Data (the dough) is passed from one procedure to the next.

### How it works
- Program = `main` calling functions that call other functions.
- Data and functions are **separate** (unlike OOP, where they're bundled into objects).
- Classic languages: C, Pascal, Fortran, early BASIC; also simple scripts in any language.
- Great for straightforward tasks; can get messy when many functions share lots of global data.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Order { std::string item; int quantity; double unit_price; };   // plain data

// Procedures: each does one step, data passed in and out explicitly.
double subtotal(const std::vector<Order>& orders) {
    double sum = 0;
    for (const auto& o : orders) sum += o.quantity * o.unit_price;
    return sum;
}
double apply_tax(double amount, double rate) { return amount * (1 + rate); }
void print_receipt(const std::vector<Order>& orders, double total) {
    for (const auto& o : orders) std::cout << o.quantity << " x " << o.item << '\n';
    std::cout << "total: " << total << '\n';
}

int main() {
    std::vector<Order> orders{{"coffee", 2, 3.0}, {"cake", 1, 4.0}};
    double total = apply_tax(subtotal(orders), 0.10);
    print_receipt(orders, total);
}
```

**Output:**
```text
2 x coffee
1 x cake
total: 11
```

### Interview answer
"Procedural programming is an imperative style that structures code into procedures operating on data passed in or shared. It's simple and efficient; compared to OOP it doesn't bundle data with behavior, which can make large codebases harder to keep consistent."

---

## 6. Event-driven programming

**In one sentence:** the program's flow is controlled by **events** — clicks, key presses, network messages, timers — and you write **handlers** that react when those events happen.

### In plain words
A firefighter doesn't follow a fixed daily script; they wait at the station and **react** when the alarm rings. A program with a GUI is the same: it mostly waits, and when you click "Save", the "on save clicked" handler runs.

### How it works
1. An **event loop** waits for events and puts them in a queue.
2. For each event, it calls the **handlers** (callbacks/listeners) registered for that event type.
3. Handlers should be quick; long work goes to a background thread, or the UI freezes.

Used in: GUIs (Qt, browsers), JavaScript/Node.js, game engines, servers (nginx, Boost.Asio), IoT, and at large scale in [Event-Driven Architecture](../System%20Architecture/Event-Driven-Architecture.md).

### Modern C++ example — a tiny event bus and event loop
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>

struct Event { std::string type; std::string data; };

class EventLoop {
public:
    using Handler = std::function<void(const Event&)>;
    void on(const std::string& type, Handler h) { handlers_[type].push_back(std::move(h)); }
    void post(Event e) { queue_.push(std::move(e)); }
    void run() {                                   // the event loop
        while (!queue_.empty()) {
            Event e = queue_.front();
            queue_.pop();
            for (auto& h : handlers_[e.type]) h(e);   // dispatch to every listener
        }
    }
private:
    std::map<std::string, std::vector<Handler>> handlers_;
    std::queue<Event> queue_;
};

int main() {
    EventLoop loop;
    loop.on("click", [](const Event& e) { std::cout << "button clicked: " << e.data << '\n'; });
    loop.on("key",   [](const Event& e) { std::cout << "key pressed: " << e.data << '\n'; });
    loop.on("click", [&](const Event& e) {
        if (e.data == "save") loop.post({"saved", "document.txt"});  // handlers can emit events
    });
    loop.on("saved", [](const Event& e) { std::cout << "file saved: " << e.data << '\n'; });

    // Pretend these came from the mouse and keyboard:
    loop.post({"key", "Ctrl"});
    loop.post({"click", "save"});
    loop.run();
}
```

**Output:**
```text
key pressed: Ctrl
button clicked: save
file saved: document.txt
```

### Common mistakes
- Doing slow work inside a handler — the whole loop (and UI) freezes.
- "Callback hell" — deeply nested handlers. Use futures/coroutines (see [Asynchronous Programming](./Asynchronous-Programming.md)).

### Interview answer
"In event-driven programming, control flow is determined by events dispatched from an event loop to registered handlers. It suits UIs, servers and I/O-heavy systems; handlers must be non-blocking, and complex flows are better expressed with futures or coroutines than nested callbacks."

---

## 7. Aspect-oriented programming

**In one sentence:** aspect-oriented programming (AOP) separates **cross-cutting concerns** — things like logging, timing, security checks or transactions that are needed in *many* functions — into reusable "aspects" that are applied around the main code, instead of copy-pasting them everywhere.

### In plain words
In an office, every department must follow security rules (badge in, badge out). Instead of teaching each department to build its own security system, you put **one security guard at every door**. The departments do their real work; the guard (the *aspect*) wraps around them automatically.

### How it works
Vocabulary:
- **Cross-cutting concern:** logic that cuts across many modules (logging, auth, caching, metrics, retries, transactions).
- **Advice:** the extra code to run (e.g. "log before and after").
- **Join point:** a place where advice can be applied (e.g. a function call).
- **Pointcut:** a rule that selects join points ("all public methods of the `Payment` class").
- **Weaving:** combining aspects with the main code (at compile time, load time or runtime).

Languages/frameworks: AspectJ and Spring AOP (Java), Python decorators, C# attributes/interceptors. C++ has no built-in AOP, but we can get the same effect with **higher-order wrappers** (like Python decorators) and RAII.

### Modern C++ example — logging and timing "aspects" as wrappers
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>

// An "aspect": wraps ANY function with before/after logging.
template <class F>
auto logged(std::string name, F f) {
    return [name = std::move(name), f]<class... Args>(Args&&... args) {
        std::cout << "[log] enter " << name << '\n';
        auto result = f(std::forward<Args>(args)...);
        std::cout << "[log] exit  " << name << " -> " << result << '\n';
        return result;
    };
}

// Another aspect: an authorization check.
template <class F>
auto requires_admin(bool is_admin, F f) {
    return [is_admin, f]<class... Args>(Args&&... args) {
        if (!is_admin) throw std::runtime_error("access denied");
        return f(std::forward<Args>(args)...);
    };
}

// Business logic stays clean: no logging or security code inside.
int transfer(int from, int to, int amount) { (void)from; (void)to; return amount; }

int main() {
    // "Weave" the aspects around the core function:
    auto safe_transfer = logged("transfer", requires_admin(true, transfer));
    safe_transfer(1, 2, 100);

    auto blocked = requires_admin(false, transfer);
    try { blocked(1, 2, 100); }
    catch (const std::exception& e) { std::cout << "error: " << e.what() << '\n'; }
}
```

**Output:**
```text
[log] enter transfer
[log] exit  transfer -> 100
error: access denied
```

### Common mistakes
- Hiding too much behavior in aspects — a reader of `transfer` can't see that it's logged, checked and wrapped in a transaction, which makes debugging surprising.

### Interview answer
"AOP modularizes cross-cutting concerns such as logging, security and transactions into aspects, whose advice is woven into selected join points defined by pointcuts. Spring AOP and AspectJ are typical examples; in C++ similar effects come from decorators, templates and RAII wrappers."

---

## 8. Functional vs. Imperative vs. Declarative

**In one sentence:** imperative says **how** (steps that change state), declarative says **what** (the desired result), and functional is a kind of declarative style that builds the result by composing **pure functions** without changing state.

### In plain words
Task: "get the names of adults, in upper case".
- **Imperative:** "Make an empty list. Go through the people one by one. If the age is at least 18, convert the name to upper case and add it to the list."
- **Declarative:** "The upper-cased names of all people aged 18 or more." (SQL: `SELECT UPPER(name) FROM people WHERE age >= 18`)
- **Functional:** "`map(toUpper) ∘ filter(isAdult)` applied to people" — a pipeline of pure functions.

### How it works
| | Imperative | Declarative | Functional |
|---|---|---|---|
| Focus | How (control flow) | What (result) | What, via function composition |
| State | Mutable variables | Hidden in the engine | Immutable values |
| Typical constructs | Loops, assignments | Queries, rules, markup | Pure functions, map/filter/reduce, recursion |
| Examples | C, Java loops | SQL, HTML, regex | Haskell, ranges pipelines |
| Strengths | Control, performance, familiarity | Concise, optimizable | Easy to test, reason about and parallelize |
| Weaknesses | Bugs from shared state | Less control | Learning curve, allocation of new values |

### Modern C++ example — the same task in all three styles
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cctype>
#include <iostream>
#include <ranges>
#include <string>
#include <vector>

struct Person { std::string name; int age; };

std::string upper(std::string s) {                // pure function
    for (char& c : s) c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
    return s;
}

int main() {
    const std::vector<Person> people{{"ana", 17}, {"ben", 30}, {"cara", 45}};

    // 1) Imperative: explicit loop + mutation
    std::vector<std::string> a;
    for (const auto& p : people)
        if (p.age >= 18) a.push_back(upper(p.name));

    // 2) Declarative (standard algorithm): say WHAT — "copy those that match"
    std::vector<Person> adults;
    std::ranges::copy_if(people, std::back_inserter(adults), [](const Person& p) { return p.age >= 18; });
    std::vector<std::string> b;
    std::ranges::transform(adults, std::back_inserter(b), [](const Person& p) { return upper(p.name); });

    // 3) Functional pipeline: compose pure functions lazily, no mutation of inputs
    auto c = people
           | std::views::filter([](const Person& p) { return p.age >= 18; })
           | std::views::transform([](const Person& p) { return upper(p.name); });

    for (const auto& s : a) std::cout << s << ' ';
    std::cout << "| ";
    for (const auto& s : b) std::cout << s << ' ';
    std::cout << "| ";
    for (const auto& s : c) std::cout << s << ' ';
    std::cout << '\n';
}
```

**Output:**
```text
BEN CARA | BEN CARA | BEN CARA
```

### Interview answer
"Imperative code specifies control flow and mutates state; declarative code specifies the desired result and leaves execution to an engine; functional programming is a declarative approach based on composing pure functions over immutable data. Modern languages, C++ included, let you mix them — for example, ranges pipelines for data transformation inside otherwise imperative code."

---

## Cheat sheet

| Paradigm | Core idea | Typical languages | C++ tools |
|---|---|---|---|
| Imperative | Steps that change state | C, C++, Python | loops, assignments |
| Declarative | Describe the result | SQL, HTML, regex | algorithms, ranges |
| Functional | Pure functions, immutability | Haskell, F#, Clojure | lambdas, `constexpr`, ranges |
| Object-oriented | Objects = data + behavior | Java, C#, C++ | classes, virtual functions |
| Procedural | Code organized into procedures | C, Pascal | free functions + structs |
| Event-driven | React to events via handlers | JavaScript, GUIs | callbacks, event loops, Asio |
| Aspect-oriented | Factor out cross-cutting concerns | AspectJ, Spring | wrappers/decorators, RAII |
