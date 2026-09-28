# Lambda Calculus — Explained for Beginners

> **What you'll learn:** what lambda calculus is and why it matters, its tiny syntax (variables, functions, application), how programs "run" by **beta reduction**, **currying**, and how you can build booleans, numbers and even recursion out of nothing but functions — all demonstrated with C++ lambdas.
>
> **Prerequisites:** [Functional Programming](./Functional-Programming.md) (lambdas and closures).

## Table of Contents
1. [What is lambda calculus?](#1-what-is-lambda-calculus)
2. [The syntax: only three things](#2-the-syntax-only-three-things)
3. [Running a program: beta reduction](#3-running-a-program-beta-reduction)
4. [Currying: many arguments from one](#4-currying-many-arguments-from-one)
5. [Church encodings: booleans and numbers from functions](#5-church-encodings-booleans-and-numbers-from-functions)
6. [Recursion without names: the Y combinator](#6-recursion-without-names-the-y-combinator)
7. [Why it matters for programmers](#7-why-it-matters-for-programmers)
8. [Cheat sheet](#cheat-sheet)

---

## 1. What is lambda calculus?

**In one sentence:** lambda calculus (λ-calculus) is a tiny mathematical "programming language" — invented by Alonzo Church in the 1930s — in which **everything is a function**, and yet it can compute anything any computer can compute.

### In plain words
Imagine a LEGO set that contains only **one kind of brick**. Surprisingly, with enough of those bricks you can build a house, a car, a spaceship — anything. Lambda calculus is that: the only brick is "a function that takes one input and returns something". No numbers, no `if`, no loops — and still it's **Turing complete** (as powerful as any programming language).

It's the theoretical foundation of **functional programming** (Lisp, Haskell, ML, and the lambdas in C++, Java, Python, JavaScript all get their name from it).

---

## 2. The syntax: only three things

**In one sentence:** a lambda calculus expression is either a **variable**, a **function definition** (abstraction), or a **function call** (application).

### How it works
| Form | Math notation | Meaning | C++ equivalent |
|---|---|---|---|
| Variable | `x` | A name | `x` |
| Abstraction | `λx. body` | "A function taking `x` and returning `body`" | `[](auto x) { return body; }` |
| Application | `f a` | "Call `f` with argument `a`" | `f(a)` |

Examples:
- `λx. x` — the **identity** function: returns its input.
- `λx. λy. x` — takes `x`, returns a function that takes `y` and returns `x` ("keep the first").
- `(λx. x) z` — applying identity to `z` gives `z`.

Conventions: application is left-associative (`f a b` = `(f a) b`), and the body of a λ extends as far right as possible.

**Free vs. bound variables:** in `λx. x y`, `x` is **bound** (it's the parameter) and `y` is **free** (comes from outside) — exactly like a lambda capturing a variable in C++.

---

## 3. Running a program: beta reduction

**In one sentence:** you "run" a lambda calculus program by repeatedly replacing a function call with the function's body, substituting the argument for the parameter — that step is called **β-reduction (beta reduction)**.

### In plain words
It's like filling in a form letter: the template says "Dear ___NAME___, …". Applying it to "Ana" means writing "Ana" wherever the blank is. Keep doing that until there's nothing left to fill in.

### How it works
```
(λx. BODY) ARG   →β   BODY with every free x replaced by ARG
```
Example, step by step:
```
(λx. λy. x) a b
= ((λx. λy. x) a) b      application is left-associative
→ (λy. a) b              replace x with a
→ a                      replace y with b (y isn't used, so it disappears)
```
Other rules you'll hear about:
- **α-conversion (alpha):** renaming a parameter doesn't change meaning: `λx. x` ≡ `λz. z` (used to avoid name clashes).
- **Normal form:** an expression with nothing left to reduce — the "answer".
- Some expressions never finish: `(λx. x x)(λx. x x)` reduces to itself forever — the λ-calculus version of an infinite loop.
- **Evaluation strategy:** *normal order* (reduce the outermost call first, like lazy evaluation) vs. *applicative order* (evaluate arguments first, like C++ and most languages).

### Modern C++ example — a tiny beta-reduction engine
We represent λ-terms as a tree and reduce them step by step. (For simplicity it doesn't handle name capture — our examples avoid it.)

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <variant>

struct Var; struct Lam; struct App;
using Term = std::shared_ptr<const std::variant<Var, Lam, App>>;
struct Var { std::string name; };
struct Lam { std::string param; Term body; };
struct App { Term fn, arg; };

Term var(std::string n)        { return std::make_shared<const std::variant<Var, Lam, App>>(Var{std::move(n)}); }
Term lam(std::string p, Term b){ return std::make_shared<const std::variant<Var, Lam, App>>(Lam{std::move(p), std::move(b)}); }
Term app(Term f, Term a)       { return std::make_shared<const std::variant<Var, Lam, App>>(App{std::move(f), std::move(a)}); }

std::string show(const Term& t) {
    if (auto v = std::get_if<Var>(t.get())) return v->name;
    if (auto l = std::get_if<Lam>(t.get())) return "(\\" + l->param + ". " + show(l->body) + ")";
    auto& a = std::get<App>(*t);
    return "(" + show(a.fn) + " " + show(a.arg) + ")";
}

// Replace free occurrences of 'name' in t with 'value'.
Term substitute(const Term& t, const std::string& name, const Term& value) {
    if (auto v = std::get_if<Var>(t.get())) return v->name == name ? value : t;
    if (auto l = std::get_if<Lam>(t.get()))
        return l->param == name ? t : lam(l->param, substitute(l->body, name, value)); // shadowed
    auto& a = std::get<App>(*t);
    return app(substitute(a.fn, name, value), substitute(a.arg, name, value));
}

// One step of normal-order beta reduction; returns nullptr if already in normal form.
Term step(const Term& t) {
    if (auto a = std::get_if<App>(t.get())) {
        if (auto l = std::get_if<Lam>(a->fn.get()))
            return substitute(l->body, l->param, a->arg);              // the beta rule!
        if (auto f = step(a->fn)) return app(f, a->arg);
        if (auto x = step(a->arg)) return app(a->fn, x);
    }
    if (auto l = std::get_if<Lam>(t.get()))
        if (auto b = step(l->body)) return lam(l->param, b);
    return nullptr;
}

int main() {
    // (\x. \y. x) a b   ==>  a
    Term t = app(app(lam("x", lam("y", var("x"))), var("a")), var("b"));
    std::cout << "   " << show(t) << '\n';
    while (Term next = step(t)) {
        t = next;
        std::cout << "-> " << show(t) << '\n';
    }
}
```

**Output:**
```text
   (((\x. (\y. x)) a) b)
-> ((\y. a) b)
-> a
```

### Interview answer
"Computation in lambda calculus is β-reduction: applying `λx.M` to `N` substitutes `N` for free occurrences of `x` in `M`. α-conversion renames bound variables to avoid capture. A term with no redexes is in normal form, and normal-order reduction finds it whenever one exists."

---

## 4. Currying: many arguments from one

**In one sentence:** since lambda calculus functions take exactly **one** argument, a function of several arguments is written as a function that returns another function — this is called **currying** (after Haskell Curry).

### In plain words
A vending machine that takes one coin at a time: put in the first coin → it waits for the second → put in the second → out comes your snack. `add(2, 3)` becomes `add(2)(3)`: `add(2)` is a new function "add 2 to whatever you give me".

### How it works
- `λx. λy. x + y` — takes `x`, returns `λy. x + y`.
- **Partial application:** supply fewer arguments to get a specialized function: `add 2` is "the add-two function".
- Haskell and F# curry every function by default. In C++ you can curry with nested lambdas, or partially apply with `std::bind_front` (C++20).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>

int main() {
    auto add = [](int x) { return [x](int y) { return x + y; }; };   // λx. λy. x + y

    auto add_two = add(2);                     // partial application: λy. 2 + y
    std::cout << "add(2)(3) = " << add(2)(3) << '\n';
    std::cout << "add_two(10) = " << add_two(10) << '\n';

    // Currying a 3-argument function
    auto volume = [](double l) { return [=](double w) { return [=](double h) { return l * w * h; }; }; };
    std::cout << "volume(2)(3)(4) = " << volume(2)(3)(4) << '\n';

    // The standard library's partial application:
    auto greet = [](const char* greeting, const char* name) {
        std::cout << greeting << ", " << name << "!\n";
    };
    auto say_hi = std::bind_front(greet, "Hi");
    say_hi("Ana");
}
```

**Output:**
```text
add(2)(3) = 5
add_two(10) = 12
volume(2)(3)(4) = 24
Hi, Ana!
```

### Interview answer
"Currying transforms a function of n arguments into a chain of n single-argument functions, enabling partial application. Lambda calculus has only unary functions, so multi-argument functions are always curried; in C++ we can curry with nested lambdas or partially apply with `std::bind_front`."

---

## 5. Church encodings: booleans and numbers from functions

**In one sentence:** Church encodings represent data — true/false, numbers, pairs — purely as functions, proving that functions alone are enough to compute anything.

### In plain words
With no numbers available, how do you represent "3"? Church's trick: **"3" is the act of doing something three times.** `3 = "given a function f and a starting value x, apply f three times: f(f(f(x)))"`. And "true" is the act of **choosing the first** of two options; "false" chooses the second.

### How it works
**Booleans** (a boolean *is* an if-then-else):
```
TRUE  = λt. λf. t          pick the first
FALSE = λt. λf. f          pick the second
IF    = λb. λthen. λelse. b then else
AND   = λp. λq. p q p
NOT   = λb. b FALSE TRUE
```
**Numbers** (Church numerals):
```
0    = λf. λx. x                   apply f zero times
1    = λf. λx. f x
2    = λf. λx. f (f x)
SUCC = λn. λf. λx. f (n f x)       one more application
ADD  = λm. λn. λf. λx. m f (n f x) apply f n times, then m more times
MUL  = λm. λn. λf. m (n f)         apply "n times f", m times
```

### Modern C++ example — Church booleans and numerals with generic lambdas
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// ---- Booleans: a boolean chooses between two things ----
auto TRUE_  = [](auto t) { return [=](auto) { return t; }; };
auto FALSE_ = [](auto)   { return [](auto f) { return f; }; };
auto NOT    = [](auto b) { return b(FALSE_)(TRUE_); };   // works because TRUE_/FALSE_ are both valid "choices"

// ---- Numerals: n = "apply f n times" ----
auto ZERO = [](auto)   { return [](auto x) { return x; }; };
auto SUCC = [](auto n) { return [=](auto f) { return [=](auto x) { return f(n(f)(x)); }; }; };
auto ADD  = [](auto m, auto n) { return [=](auto f) { return [=](auto x) { return m(f)(n(f)(x)); }; }; };
auto MUL  = [](auto m, auto n) { return [=](auto f) { return m(n(f)); }; };

// Convert back to normal C++ values so we can print them:
int to_int(auto n) { return n([](int k) { return k + 1; })(0); }         // apply "+1" n times to 0
std::string to_str(auto b) { return b(std::string("true"))(std::string("false")); }

int main() {
    auto ONE = SUCC(ZERO);
    auto TWO = SUCC(ONE);
    auto THREE = ADD(ONE, TWO);
    auto SIX = MUL(TWO, THREE);

    std::cout << "TWO   = " << to_int(TWO) << '\n';
    std::cout << "THREE = " << to_int(THREE) << '\n';
    std::cout << "SIX   = " << to_int(SIX) << '\n';
    std::cout << "stars: " << SIX([](std::string s) { return s + "*"; })(std::string()) << '\n';
    std::cout << "TRUE picks: " << to_str(TRUE_) << ", FALSE picks: " << to_str(FALSE_) << '\n';
    std::cout << "NOT TRUE = " << to_str(NOT(TRUE_)) << '\n';
}
```

**Output:**
```text
TWO   = 2
THREE = 3
SIX   = 6
stars: ******
TRUE picks: true, FALSE picks: false
NOT TRUE = false
```
Nothing in `ZERO`, `SUCC`, `ADD` or `MUL` uses a C++ integer — numbers emerged from functions alone.

### Interview answer
"Church encodings represent data as functions: booleans select one of two arguments, and a numeral n applies a function n times. Arithmetic and logic are then just function composition, demonstrating that lambda calculus with nothing but functions is Turing complete."

---

## 6. Recursion without names: the Y combinator

**In one sentence:** lambda calculus has no names, so a function can't call itself directly; a **fixed-point combinator** such as **Y** gives a function a way to receive "itself" as an argument, making recursion possible.

### In plain words
Imagine instructions that say "to do this job, repeat these instructions" — but the instructions have no title you can refer to. The trick: **hand the instructions a copy of themselves** whenever you run them. Then "repeat" means "run the copy I was given".

### How it works
```
Y = λf. (λx. f (x x)) (λx. f (x x))
Y g  →  g (Y g)  →  g (g (Y g))  → ...
```
`Y g` behaves like "g, with itself available for recursive calls". In real languages we just use names, but the idea appears in C++ as passing `self` into a lambda (or C++23's "deducing this").

### Modern C++ example — recursion in an anonymous lambda
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <utility>

// A fixed-point helper: gives the lambda a way to call itself.
template <class F>
struct Fix {
    F f;
    template <class... Args>
    decltype(auto) operator()(Args&&... args) const { return f(*this, std::forward<Args>(args)...); }
};
template <class F> Fix(F) -> Fix<F>;

int main() {
    // The lambda has no name to call; it receives 'self' instead.
    auto factorial = Fix{[](const auto& self, int n) -> long long {
        return n <= 1 ? 1 : n * self(n - 1);
    }};
    auto fib = Fix{[](const auto& self, int n) -> int {
        return n < 2 ? n : self(n - 1) + self(n - 2);
    }};
    std::cout << "10! = " << factorial(10) << '\n';
    std::cout << "fib(15) = " << fib(15) << '\n';
}
```

**Output:**
```text
10! = 3628800
fib(15) = 610
```

### Interview answer
"Lambda calculus has no named definitions, so recursion is obtained with a fixed-point combinator like Y, where `Y g = g (Y g)`, giving g access to itself. In practice languages use named recursion, but the pattern shows up when writing recursive lambdas that take themselves as a parameter."

---

## 7. Why it matters for programmers

- **Lambdas/closures** in every modern language (C++11+, Java 8+, Python, JS) come straight from λ-calculus.
- **Functional languages** (Haskell, OCaml, F#, Elm) are essentially typed λ-calculus plus conveniences.
- **Type theory**: typed λ-calculi underpin type inference (Hindley–Milner), generics, and proof assistants (Coq, Lean).
- **Compilers** transform code into λ-like intermediate forms (continuation-passing style, closure conversion).
- The **Church–Turing thesis**: λ-calculus and Turing machines compute exactly the same things — two views of "what is computable".

---

## Cheat sheet

| Concept | Notation | C++ analogy |
|---|---|---|
| Abstraction | `λx. M` | `[](auto x) { return M; }` |
| Application | `M N` | `M(N)` |
| β-reduction | `(λx. M) N → M[x := N]` | calling a function |
| α-conversion | `λx. x ≡ λy. y` | renaming a parameter |
| Currying | `λx. λy. …` | `add(2)(3)`, `std::bind_front` |
| Church boolean | `TRUE = λt. λf. t` | a function choosing between two |
| Church numeral | `n = λf. λx. fⁿ(x)` | "apply f n times" |
| Y combinator | `Y g = g (Y g)` | lambda taking `self` |
