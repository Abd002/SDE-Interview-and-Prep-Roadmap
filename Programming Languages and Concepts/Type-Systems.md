# Type Systems — Explained for Beginners

> **What you'll learn:** what a "type" and a "type system" are, and the three classic comparisons: **static vs. dynamic typing**, **strong vs. weak typing**, and **nominal vs. structural typing** — with C++ showing each side (C++ can surprisingly do all of them).
>
> **Prerequisites:** basic C++ variables and functions.

## Table of Contents
0. [What is a type system?](#0-what-is-a-type-system)
1. [Static vs. Dynamic typing](#1-static-vs-dynamic-typing)
2. [Strong vs. Weak typing](#2-strong-vs-weak-typing)
3. [Nominal vs. Structural typing](#3-nominal-vs-structural-typing)
4. [Cheat sheet](#cheat-sheet)

---

## 0. What is a type system?

**In one sentence:** a **type** says what kind of value something is (a number, text, a list, a `User`) and what you can do with it; a **type system** is the set of rules a language uses to check that you only do sensible things with values.

### In plain words
Kitchen containers are labeled "sugar", "salt", "flour". The labels (types) stop you from putting salt in the coffee. A type system is the kitchen rule-keeper: some check every label **before** you start cooking (static), some check as you pour (dynamic); some refuse to let you mix anything mismatched (strong), others shrug and mix salt into sugar (weak).

These are **three independent axes** — a language gets one answer on each:
| Language | Static/Dynamic | Strong/Weak | Nominal/Structural |
|---|---|---|---|
| C++ | Static | Mostly strong (with weak spots) | Nominal classes; structural templates/concepts |
| Java, C# | Static | Strong | Nominal |
| TypeScript, Go interfaces | Static | Strong | **Structural** |
| Python, Ruby | Dynamic | Strong | Duck typing (structural at runtime) |
| JavaScript | Dynamic | **Weak** | Duck typing |
| C | Static | Weak | Nominal |

---

## 1. Static vs. Dynamic typing

**In one sentence:** in **static** typing, types are checked by the compiler **before** the program runs; in **dynamic** typing, types are checked **while** the program runs.

### In plain words
- **Static:** an airport checks your passport *before* you board. Problems are caught early, on the ground.
- **Dynamic:** checks happen *during the flight*. More flexible (you can board quickly), but a problem might surface mid-air.

### How it works
**Static typing** (C++, Java, Rust, Go, TypeScript)
- Every variable/expression has a type known at compile time (written or **inferred**, e.g. C++ `auto`).
- ✅ Catches mistakes early, enables great IDE tooling and refactoring, faster code (the compiler knows the layout).
- ❌ More upfront ceremony; some flexible patterns need generics.

**Dynamic typing** (Python, JavaScript, Ruby)
- *Values* have types; *variables* are just names that can hold anything.
- ✅ Quick to write, flexible, great for scripts and prototypes.
- ❌ Type errors only appear when that line runs (maybe in production); needs more tests. Many dynamic languages add optional static checking (Python type hints + mypy, TypeScript for JS).

C++ is static, but offers "dynamic-style" containers when you need them: `std::any` (anything, checked at runtime) and `std::variant` (one of a fixed list, checked at compile time *and* runtime).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <any>
#include <iostream>
#include <string>
#include <variant>
#include <vector>

int main() {
    // STATIC: types known at compile time; mismatches don't compile.
    int count = 3;
    auto price = 9.99;                     // type inferred (double) — still static!
    // count = "three";                    // compile error: can't assign const char* to int
    std::cout << "static: " << count * price << '\n';

    // DYNAMIC-style with std::any: type checked only at runtime.
    std::any box = 42;
    box = std::string("now I'm a string");                  // allowed: any type
    try {
        int n = std::any_cast<int>(box);                    // wrong guess -> runtime error
        std::cout << n << '\n';
    } catch (const std::bad_any_cast&) {
        std::cout << "dynamic: runtime type error caught (box holds a string)\n";
    }

    // Best of both: std::variant — a closed set of types, checked by the compiler.
    std::vector<std::variant<int, std::string>> cells{1, std::string("two"), 3};
    for (const auto& cell : cells)
        std::visit([](const auto& v) { std::cout << "variant holds: " << v << '\n'; }, cell);
}
```

**Output:**
```text
static: 29.97
dynamic: runtime type error caught (box holds a string)
variant holds: 1
variant holds: two
variant holds: 3
```

The same bug in Python only fails when the line runs:
```python
def total(price, qty):
    return price * qty
total("9.99", 3)   # no error! returns "9.999.999.99" (string repeated)
```

### Common mistakes
- Thinking `auto` (C++) or `var` (Java/C#) makes a language dynamic. It's **type inference** — the type is still fixed at compile time.

### Interview answer
"Static typing checks types at compile time, catching errors early and enabling optimization and tooling; dynamic typing checks at runtime, attaching types to values, which is more flexible but surfaces errors later. Type inference keeps static typing concise. C++ is static but provides `std::any` and `std::variant` for runtime flexibility."

---

## 2. Strong vs. Weak typing

**In one sentence:** **strong** typing refuses to silently mix incompatible types; **weak** typing silently converts values between types to make an operation "work".

### In plain words
You ask a shop assistant to add "5 apples" and "3".
- **Strong:** "Sorry, '5 apples' is text and 3 is a number. Please convert one of them explicitly."
- **Weak:** "Sure!" — and you get `"5 apples3"` or `8` or something surprising, depending on hidden rules.

### How it works
- **Weak typing = many implicit conversions (coercions).** JavaScript: `"5" - 2 === 3` but `"5" + 2 === "52"`; `[] + {}` is `"[object Object]"`. C lets you treat any pointer as any other pointer.
- **Strong typing = conversions must be explicit.** Python: `"5" + 2` → `TypeError`.
- "Strong/weak" is a **spectrum**, not a strict definition. It's independent of static/dynamic: Python is *dynamic + strong*; C is *static + weak*.
- C++ sits in the middle: its type system is strong for classes, but it inherited C's implicit numeric conversions (`double`→`int` truncation, `int`→`bool`, signed/unsigned mixing). Modern C++ lets you make it stronger:
  - **Brace initialization** `int x{3.7};` → compile error on narrowing.
  - **`explicit`** constructors prevent surprise conversions.
  - **`enum class`** doesn't convert to `int` implicitly.
  - **Strong type wrappers** (`Meters`, `Seconds`) instead of raw `double`.
  - Compiler flags: `-Wconversion -Wsign-conversion`.

### Modern C++ example — weak spots and how to close them
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <vector>

// Strong type wrappers: the compiler now distinguishes these.
struct Meters { double value; };
struct Seconds { double value; };
double speed(Meters d, Seconds t) { return d.value / t.value; }

enum class Color { Red, Green };        // enum class: no implicit conversion to int

int main() {
    // WEAK spots inherited from C:
    int truncated = 3.99;                       // silently becomes 3 (compiler may warn)
    unsigned int u = 1;
    int negative = -1;
    bool surprising = negative < static_cast<int>(u);         // fine
    bool weak_compare = static_cast<unsigned>(negative) > u;  // -1 as unsigned is 4294967295!
    std::cout << "truncated: " << truncated << '\n';
    std::cout << "-1 < 1 as ints: " << surprising << ", -1 > 1 as unsigned: " << weak_compare << '\n';

    // STRONGER modern C++:
    // int x{3.99};                              // compile error: narrowing conversion
    // speed(Seconds{10}, Meters{100});          // compile error: arguments swapped!
    std::cout << "speed: " << speed(Meters{100}, Seconds{10}) << " m/s\n";

    // int c = Color::Red;                       // compile error with enum class
    std::cout << "color as int (explicit): " << static_cast<int>(Color::Green) << '\n';

    std::vector<int> v{1, 2, 3};
    for (std::size_t i = 0; i < v.size(); ++i) {}   // use size_t to avoid signed/unsigned mixing
}
```

**Output:**
```text
truncated: 3
-1 < 1 as ints: 1, -1 > 1 as unsigned: 1
speed: 10 m/s
color as int (explicit): 1
```

### Common mistakes
- Comparing `int` with `.size()` (unsigned) — negative numbers become huge.
- Swapping two parameters of the same primitive type (`transfer(double amount, double fee)`). Strong types prevent it.

### Interview answer
"Strong typing disallows or limits implicit conversions between unrelated types; weak typing performs them automatically. It's a spectrum and orthogonal to static/dynamic: Python is dynamic and strong, C is static and weak. C++ is mostly strong but has C's implicit numeric conversions; I harden it with brace initialization, `explicit`, `enum class`, strong type wrappers and conversion warnings."

---

## 3. Nominal vs. Structural typing

**In one sentence:** in **nominal** typing two types are compatible only if they have the **same name** (or are declared related, e.g. by inheritance); in **structural** typing they're compatible if they have the **same shape** (the same members).

### In plain words
Entering a members-only club:
- **Nominal:** the bouncer checks your **membership card** with the club's name on it. Even if you look exactly like a member, no card, no entry.
- **Structural:** the bouncer only checks that you **have what's needed** — a jacket and a tie. Anyone with the right "shape" gets in.

"**Duck typing**" is structural typing checked at runtime: *"If it walks like a duck and quacks like a duck, it's a duck."*

### How it works
| | Nominal | Structural |
|---|---|---|
| Compatibility by | Declared name / explicit relationship | Matching members/signatures |
| Languages | Java, C#, C++ classes, Rust traits (must `impl`) | TypeScript, Go interfaces, OCaml objects; Python/JS duck typing |
| ✅ | Intent is explicit; accidental matches impossible | Flexible; no need to modify types to fit an interface |
| ❌ | Must declare relationships up front; adapters needed for 3rd-party types | Accidental matches (two unrelated `.close()` methods) |

C++ has **both**:
- **Classes/virtual functions → nominal:** a class must *inherit* from `Shape` to be used as a `Shape&`.
- **Templates/concepts → structural:** any type with the right members works, no inheritance needed.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <concepts>
#include <iostream>
#include <string>

// ---------------- NOMINAL: must explicitly inherit from Drawable ----------------
struct Drawable {
    virtual ~Drawable() = default;
    virtual std::string draw() const = 0;
};
struct Circle : Drawable {                          // declared: "I am a Drawable"
    std::string draw() const override { return "circle"; }
};
struct Sketch {                                     // same shape, but NOT declared Drawable
    std::string draw() const { return "sketch"; }
};
void render_nominal(const Drawable& d) { std::cout << "nominal: " << d.draw() << '\n'; }

// ---------------- STRUCTURAL: anything with a draw() returning a string ----------------
template <class T>
concept HasDraw = requires(const T& t) {
    { t.draw() } -> std::convertible_to<std::string>;
};
void render_structural(const HasDraw auto& d) { std::cout << "structural: " << d.draw() << '\n'; }

int main() {
    render_nominal(Circle{});
    // render_nominal(Sketch{});      // compile error: Sketch is not a Drawable (by NAME)

    render_structural(Circle{});
    render_structural(Sketch{});      // OK: Sketch has the right SHAPE
    // render_structural(42);         // compile error: int has no draw()
}
```

**Output:**
```text
nominal: circle
structural: circle
structural: sketch
```

### Common mistakes
- Assuming structural typing means "no checking". TypeScript and C++ concepts check shapes at compile time; only duck typing in dynamic languages defers it to runtime.

### Interview answer
"Nominal typing relates types by their declared names and explicit subtyping — Java, C#, C++ class hierarchies. Structural typing relates them by shape — TypeScript and Go interfaces, and C++ templates constrained by concepts. Duck typing is the runtime, dynamic version. Nominal makes intent explicit; structural is more flexible and avoids adapter boilerplate."

---

## Cheat sheet

| Axis | Option A | Option B |
|---|---|---|
| **When** are types checked? | Static: compile time (C++, Java, Rust) | Dynamic: runtime (Python, JS) |
| **How strict** are conversions? | Strong: explicit only (Python, Java) | Weak: implicit coercions (JS, C) |
| **What makes types compatible?** | Nominal: same declared name (Java, C++ classes) | Structural: same shape (TS, Go, C++ concepts) |

C++ tools: `auto` (inference, still static), `std::variant`/`std::any` (runtime flexibility), brace-init/`explicit`/`enum class` (stronger typing), concepts (structural constraints).
