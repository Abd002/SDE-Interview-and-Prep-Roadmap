# Functional Programming — Explained for Beginners

> **What you'll learn:** the five core ideas of functional programming — **higher-order functions, closures, lambda expressions, pure functions and referential transparency** — and how to use each in modern C++.
>
> **Prerequisites:** basic C++ functions. For how FP compares to other styles, see [Programming Paradigms](./Programming-Paradigms.md).

## Table of Contents
1. [Lambda expressions](#1-lambda-expressions)
2. [Higher-order functions](#2-higher-order-functions)
3. [Closures](#3-closures)
4. [Pure functions](#4-pure-functions)
5. [Referential transparency](#5-referential-transparency)
6. [Cheat sheet](#cheat-sheet)

(We start with lambdas because the other four ideas are easiest to show with them.)

---

## 1. Lambda expressions

**In one sentence:** a lambda is a small, unnamed function you can write right where you need it — inline, inside another expression.

### In plain words
Normally, to give someone instructions you write a whole labeled page in a manual ("Procedure 7: how to sort by price"). A lambda is a **sticky note** you write on the spot and hand over: "sort these by price, cheapest first". It has no name and is used right there.

### How it works
C++ lambda syntax:
```c++
[captures](parameters) -> return_type { body }
//  ^ which outside variables it can use (see Closures)
```
- `[](int x) { return x * 2; }` — takes an `int`, returns double it.
- The return type is usually deduced; `-> T` is optional.
- **Generic lambdas** (C++14): `[](auto x) { ... }` work with any type.
- **Template lambdas** (C++20): `[]<class T>(std::vector<T> v) { ... }`.
- `constexpr` lambdas can run at compile time.
- Under the hood, the compiler creates a tiny class with an `operator()` — a **function object**.

Other languages: `x => x * 2` (JavaScript/C#), `lambda x: x * 2` (Python), `|x| x * 2` (Rust).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Product { std::string name; double price; };

int main() {
    auto twice = [](int x) { return x * 2; };                 // a lambda stored in a variable
    std::cout << "twice(21) = " << twice(21) << '\n';

    auto add = [](auto a, auto b) { return a + b; };          // generic lambda
    std::cout << "add(1, 2) = " << add(1, 2) << ", add(1.5, 2.25) = " << add(1.5, 2.25) << '\n';

    std::vector<Product> products{{"pen", 1.5}, {"book", 12.0}, {"mug", 6.0}};
    std::ranges::sort(products, [](const Product& a, const Product& b) {   // inline "sticky note"
        return a.price < b.price;
    });
    for (const auto& p : products) std::cout << p.name << ' ';
    std::cout << '\n';

    constexpr auto square = [](int x) { return x * x; };
    static_assert(square(5) == 25);                            // evaluated at compile time
}
```

**Output:**
```text
twice(21) = 42
add(1, 2) = 3, add(1.5, 2.25) = 3.75
pen mug book
```

### Common mistakes
- Writing huge multi-screen lambdas. If it needs a name and a comment, make it a real function.

### Interview answer
"A lambda is an anonymous function literal. In C++ it creates a closure object of a unique compiler-generated class with `operator()`; it can capture variables, be generic with `auto` parameters, and be `constexpr`."

---

## 2. Higher-order functions

**In one sentence:** a higher-order function is a function that **takes another function as a parameter** and/or **returns a function**.

### In plain words
A washing machine is "higher-order": you choose the program (the *function*): wool, cotton, quick wash. The machine does the general work (fill, spin, drain), and your chosen program decides the details. `std::sort` is the same: it does the sorting, and *you* hand it the rule for comparing.

### How it works
Classic higher-order functions:
| Name | What it does | C++ |
|---|---|---|
| **map** | Apply f to every element | `std::ranges::transform`, `views::transform` |
| **filter** | Keep elements where f is true | `std::ranges::copy_if`, `views::filter` |
| **reduce / fold** | Combine all elements into one value | `std::accumulate`, `std::reduce`, `std::ranges::fold_left` (C++23) |
| **compose** | Build f(g(x)) from f and g | write your own (below) |

To accept "any callable" in C++, take a template parameter (fastest, inlined) or a `std::function<R(Args...)>` (flexible, type-erased, a little slower).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <numeric>
#include <vector>

// Takes a function: apply 'f' n times.
template <class F>
int apply_n_times(F f, int n, int x) {
    for (int i = 0; i < n; ++i) x = f(x);
    return x;
}

// Returns a function: compose(f, g)(x) == f(g(x))
auto compose(auto f, auto g) {
    return [=](auto x) { return f(g(x)); };
}

// Returns a function built from data: a "multiplier factory"
std::function<int(int)> make_multiplier(int factor) {
    return [factor](int x) { return x * factor; };
}

int main() {
    auto inc = [](int x) { return x + 1; };
    auto dbl = [](int x) { return x * 2; };

    std::cout << "inc applied 5 times to 0: " << apply_n_times(inc, 5, 0) << '\n';
    auto inc_then_double = compose(dbl, inc);
    std::cout << "double(inc(3)) = " << inc_then_double(3) << '\n';

    auto triple = make_multiplier(3);
    std::cout << "triple(7) = " << triple(7) << '\n';

    std::vector<int> v{1, 2, 3, 4};
    int product = std::accumulate(v.begin(), v.end(), 1, std::multiplies<>{});   // reduce
    std::cout << "product = " << product << '\n';
}
```

**Output:**
```text
inc applied 5 times to 0: 5
double(inc(3)) = 8
triple(7) = 21
product = 24
```

### Interview answer
"A higher-order function takes functions as arguments or returns them — map, filter, reduce, composition, factories. They separate the generic algorithm from the specific behavior. In C++ I accept callables via templates or concepts for zero overhead, or `std::function` when I need type erasure."

---

## 3. Closures

**In one sentence:** a closure is a function bundled together with the variables it "captured" from the place where it was created, so it can still use them later.

### In plain words
You write a note for your roommate: "Buy **3** apples." Even if you later change your mind at home, the note already *remembers* "3". A closure is a function that carries a little backpack of remembered values from where it was written.

### How it works
In C++ the capture list says what goes in the backpack and *how*:
| Capture | Meaning |
|---|---|
| `[x]` | Copy `x` into the closure (snapshot) |
| `[&x]` | Refer to the original `x` (must still be alive when called!) |
| `[=]` | Copy everything used |
| `[&]` | Reference everything used |
| `[this]` / `[*this]` | Access the current object by pointer / by copy |
| `[y = std::move(x)]` | Init-capture: create a new member, e.g. move a `unique_ptr` in |
| `mutable` | Allows modifying the closure's own copies |

A closure that captures by value and is marked `mutable` can keep **private state** between calls — like a tiny object.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <memory>
#include <string>

std::function<int()> make_counter() {
    int count = 0;
    return [count]() mutable { return ++count; };   // the closure OWNS its own 'count'
}   // the local 'count' dies here, but the closure's copy lives on

int main() {
    auto c1 = make_counter();
    auto c2 = make_counter();                        // independent backpack
    std::cout << c1() << ' ' << c1() << ' ' << c1() << " | " << c2() << '\n';

    int apples = 3;
    auto by_value = [apples] { return apples; };     // snapshot: 3
    auto by_ref   = [&apples] { return apples; };    // live view
    apples = 10;
    std::cout << "by value: " << by_value() << ", by reference: " << by_ref() << '\n';

    auto owned = std::make_unique<std::string>("moved into the closure");
    auto speaker = [msg = std::move(owned)] { return *msg; };   // init-capture with move
    std::cout << speaker() << '\n';
}
```

**Output:**
```text
1 2 3 | 1
by value: 3, by reference: 10
moved into the closure
```

### Common mistakes
- **Dangling reference captures:** returning `[&local] { ... }` from a function — `local` is dead by the time the lambda runs. Capture by value when the closure outlives the scope.
- `[=]` in a member function implicitly captured `this` (deprecated in C++20) — the object might be gone later.

### Interview answer
"A closure is a function object plus captured environment. C++ lambdas capture by value or by reference explicitly; by-value captures are snapshots, by-reference captures must not outlive the referenced objects, and `mutable` closures can hold private state. Init-captures allow moving resources in."

---

## 4. Pure functions

**In one sentence:** a pure function (1) always returns the same output for the same input and (2) has no side effects — it doesn't change or depend on anything outside itself.

### In plain words
A calculator's `+` button: `2 + 3` is **always** 5, no matter what time it is or what you did before, and pressing it doesn't change your bank balance. A vending machine is *not* pure: pressing the same button can give a drink, or nothing (sold out), and it changes the machine's stock.

### How it works
**Side effects** include: modifying a global or a parameter passed by reference, printing, reading input, writing files, network calls, getting the current time, random numbers, throwing exceptions (arguably).

Why purity is great:
- **Easy to test:** no setup, no mocks — just input → expected output.
- **Easy to reason about:** the function signature tells the whole story.
- **Safe to run in parallel:** no shared state → no data races.
- **Cacheable (memoization):** same input → same output, so store the result.
- **Compile-time evaluation** in C++ (`constexpr`/`consteval`).

Real programs need side effects (otherwise they can't print anything!). The functional approach: keep a **pure core** and push side effects to a thin outer **shell** ("functional core, imperative shell").

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <vector>

int total_calls = 0;

// IMPURE: reads and modifies global state, output depends on history
int impure_add(int x) { ++total_calls; return x + total_calls; }

// PURE: output depends only on inputs; nothing outside is touched
constexpr int pure_add(int a, int b) { return a + b; }

// PURE: returns a new vector instead of modifying the argument
std::vector<int> doubled(const std::vector<int>& v) {
    std::vector<int> out;
    out.reserve(v.size());
    for (int x : v) out.push_back(x * 2);
    return out;
}

// Purity enables memoization: same input -> reuse cached output
long long fib(int n) {
    static std::map<int, long long> cache;   // the cache is an implementation detail
    if (n < 2) return n;
    if (auto it = cache.find(n); it != cache.end()) return it->second;
    return cache[n] = fib(n - 1) + fib(n - 2);
}

int main() {
    std::cout << "impure_add(1) twice: " << impure_add(1) << ", ";
    std::cout << impure_add(1) << "  <- different results!\n";
    std::cout << "pure_add(1, 1) twice: " << pure_add(1, 1) << ", " << pure_add(1, 1) << '\n';

    const std::vector<int> original{1, 2, 3};
    auto d = doubled(original);
    std::cout << "original[0]=" << original[0] << ", doubled[0]=" << d[0] << '\n';

    static_assert(pure_add(2, 3) == 5);         // pure + constexpr: checked by the compiler
    std::cout << "fib(80) = " << fib(80) << '\n';
}
```

**Output:**
```text
impure_add(1) twice: 2, 3  <- different results!
pure_add(1, 1) twice: 2, 2
original[0]=1, doubled[0]=2
fib(80) = 23416728348467685
```

### Common mistakes
- Hidden impurity: a "pure-looking" function that reads a global config, the clock, or a random generator. Pass those in as parameters instead.

### Interview answer
"A pure function is deterministic and has no side effects. Purity makes code easy to test, reason about, cache and parallelize. Real systems keep a pure core and isolate I/O and mutation in a thin shell; in C++ `constexpr` functions are a good pure subset."

---

## 5. Referential transparency

**In one sentence:** an expression is referentially transparent if you can **replace it with its value** anywhere in the program without changing the program's behavior.

### In plain words
If `2 + 3` appears in a math homework, you can cross it out and write `5` — nothing changes. That's referential transparency. But you can't replace "the current time" with `3:00 pm` everywhere: tomorrow's run would behave differently. So `now()` is **not** referentially transparent.

### How it works
- Calls to **pure functions** with the same arguments are referentially transparent. (Purity is the property of a function; referential transparency is the property of an expression/call.)
- It enables **equational reasoning**: you can simplify code like algebra.
- It lets compilers **optimize**: common subexpression elimination, constant folding, reordering, compile-time evaluation.
- It enables **memoization** and **lazy evaluation** (compute only when needed) safely.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <random>

constexpr int area(int w, int h) { return w * h; }     // referentially transparent

int roll_die() {                                        // NOT referentially transparent
    static std::mt19937 rng(42);
    return std::uniform_int_distribution<int>(1, 6)(rng);
}

int main() {
    // area(3, 4) can be replaced by 12 everywhere: both lines mean the same thing.
    int a = area(3, 4) + area(3, 4);
    int b = 12 + 12;
    std::cout << "area version: " << a << ", replaced version: " << b << '\n';

    // The compiler may even compute it at compile time:
    constexpr int at_compile_time = area(3, 4);
    static_assert(at_compile_time == 12);

    // roll_die() + roll_die() is NOT the same as 2 * roll_die():
    int first  = roll_die();
    int second = roll_die();
    std::cout << "two calls gave " << first << " and " << second
              << (first == second ? " (same by luck)\n" : " -> can't replace a call with one value\n");
}
```

**Output (may vary):**
```text
area version: 24, replaced version: 24
two calls gave 3 and 5 -> can't replace a call with one value
```

### Interview answer
"An expression is referentially transparent if it can be replaced by its value without changing behavior — true for calls to pure functions. It enables equational reasoning, memoization, lazy evaluation and compiler optimizations such as constant folding and common subexpression elimination."

---

## Cheat sheet

| Concept | One-liner | C++ |
|---|---|---|
| Lambda | Anonymous inline function | `[](int x) { return x * 2; }` |
| Higher-order function | Takes or returns functions | `std::sort(v, cmp)`, `compose(f, g)` |
| Closure | Function + captured variables | `[count]() mutable { return ++count; }` |
| Pure function | Same input → same output, no side effects | `constexpr` functions |
| Referential transparency | Expression replaceable by its value | `area(3,4)` ≡ `12` |
