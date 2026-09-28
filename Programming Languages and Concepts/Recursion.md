# Recursion — Explained for Beginners

> **What you'll learn:** what recursion is, how it uses the call stack, the base case / recursive case recipe, and the three roadmap variants: **tail recursion**, **mutual recursion** and **anonymous recursion** — each in modern C++.
>
> **Prerequisites:** C++ functions. Knowing the [stack](./Memory-Management-and-GC.md#1-stack-vs-heap) helps.

## Table of Contents
0. [Recursion basics](#0-recursion-basics)
1. [Tail recursion](#1-tail-recursion)
2. [Mutual recursion](#2-mutual-recursion)
3. [Anonymous recursion](#3-anonymous-recursion)
4. [Recursion vs. iteration](#4-recursion-vs-iteration)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Recursion basics

**In one sentence:** a recursive function solves a problem by calling **itself** on a smaller version of the same problem, until it reaches a case so small it can answer directly.

### In plain words
**Russian nesting dolls.** To find the tiniest doll: open the doll; if there's another doll inside, do the same thing to *that* doll; if it's solid (no doll inside), you've found it. You never needed a new instruction — just "do the same thing on the smaller one".

Another: you're in a queue and want to know your position. You ask the person in front "what's your position?"; they ask the person in front of them… The first person says "1" (**base case**). Each answer comes back as "theirs + 1".

### How it works
Every recursive function needs:
1. **Base case(s):** a small input answered directly, with no recursion. *Without it, the function never stops.*
2. **Recursive case:** break the problem into a smaller one, call yourself, and combine the result.
3. **Progress:** each call must move *closer* to the base case.

**The call stack:** every call gets its own **stack frame** (its own copy of parameters and locals). Frames pile up until the base case, then unwind as each call returns.
```
factorial(3)
 └ 3 * factorial(2)
        └ 2 * factorial(1)
               └ 1           <- base case, start returning
        └ 2 * 1 = 2
 └ 3 * 2 = 6
```
Too many nested calls → **stack overflow** (the stack is only a few MB).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

long long factorial(int n) {
    if (n <= 1) return 1;                 // base case
    return n * factorial(n - 1);          // recursive case: smaller problem
}

// Recursion shines on naturally nested data, like a folder tree:
struct Folder {
    std::string name;
    int files;
    std::vector<Folder> subfolders;
};

int count_files(const Folder& f) {
    int total = f.files;                          // this folder
    for (const auto& sub : f.subfolders)
        total += count_files(sub);                // same question, smaller folder
    return total;                                 // base case: no subfolders -> loop does nothing
}

void print_tree(const Folder& f, int depth = 0) {
    std::cout << std::string(depth * 2, ' ') << f.name << " (" << f.files << " files)\n";
    for (const auto& sub : f.subfolders) print_tree(sub, depth + 1);
}

int main() {
    std::cout << "5! = " << factorial(5) << '\n';

    Folder root{"root", 2, {{"docs", 3, {{"old", 4, {}}}}, {"pics", 5, {}}}};
    print_tree(root);
    std::cout << "total files: " << count_files(root) << '\n';
}
```

**Output:**
```text
5! = 120
root (2 files)
  docs (3 files)
    old (4 files)
  pics (5 files)
total files: 14
```

### Common mistakes
- Missing or unreachable base case → infinite recursion → stack overflow crash.
- Recomputing the same subproblems (naive Fibonacci is O(2ⁿ)) → add memoization.

### Interview answer
"Recursion defines a solution in terms of the same problem on smaller inputs, with base cases that stop it. Each call uses a stack frame, so depth is limited by stack size. It's natural for trees, nested structures and divide-and-conquer; overlapping subproblems need memoization."

---

## 1. Tail recursion

**In one sentence:** a function is **tail recursive** when the recursive call is the **very last thing** it does — nothing is left to compute after it returns — which lets compilers turn the recursion into a loop that uses constant stack space (**tail call optimization**, TCO).

### In plain words
- Normal recursion: "Ask the person in front for their position, **then add 1**." You must wait and remember to add 1 → your frame stays on the stack.
- Tail recursion: "Here's a running count; pass it forward with +1 already added." When the last person gets it, *they* hold the final answer. Nobody needs to wait for a reply, so nobody needs to remember anything → frames can be reused.

### How it works
- Not tail recursive: `return n * factorial(n - 1);` — multiplication happens *after* the call.
- Tail recursive: carry the partial result in an **accumulator** parameter: `return fact_acc(n - 1, acc * n);` — the call is the final action.
- **TCO** replaces the call with a jump, reusing the current frame → O(1) stack.
- Guarantees differ by language: **Scheme** guarantees TCO; **Scala** (`@tailrec`) and **Kotlin** (`tailrec`) can enforce it; **C/C++** compilers (GCC, Clang) *usually* do it at `-O2`, but the standard doesn't guarantee it (Clang has `[[clang::musttail]]`); **Python** and **Java** don't do it.

### Modern C++ example
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <iostream>

// NOT tail recursive: must multiply after the call returns.
long long sum_to(long long n) {
    if (n == 0) return 0;
    return n + sum_to(n - 1);            // work left after the call -> frame must stay
}

// Tail recursive: the recursive call is the last action; 'acc' carries the result.
long long sum_to_tail(long long n, long long acc = 0) {
    if (n == 0) return acc;
    return sum_to_tail(n - 1, acc + n);  // nothing left to do afterwards
}

// What the compiler effectively turns the tail-recursive version into:
long long sum_to_loop(long long n) {
    long long acc = 0;
    while (n != 0) { acc += n; --n; }
    return acc;
}

int main() {
    std::cout << "sum_to(10'000)            = " << sum_to(10'000) << '\n';
    // With optimizations, this deep call runs in constant stack space.
    // Without TCO, 10 million frames would overflow the stack.
    std::cout << "sum_to_tail(10'000'000)   = " << sum_to_tail(10'000'000) << '\n';
    std::cout << "sum_to_loop(10'000'000)   = " << sum_to_loop(10'000'000) << '\n';
}
```

**Output:**
```text
sum_to(10'000)            = 50005000
sum_to_tail(10'000'000)   = 50000005000000
sum_to_loop(10'000'000)   = 50000005000000
```
(Compile with `-O2`. At `-O0`, `sum_to_tail(10'000'000)` may crash with a stack overflow because GCC doesn't apply TCO without optimization — a good reason not to rely on it in C++ for unbounded depth.)

### Common mistakes
- Thinking `return f(n - 1) + 1;` is a tail call — it isn't (the `+ 1` happens after).
- Objects with destructors in the frame can prevent TCO in C++ (the destructor must run after the call).

### Interview answer
"A tail call is a call in tail position — its result is returned directly. Tail-recursive functions use an accumulator so no work remains after the call, allowing tail-call optimization into a loop with O(1) stack. Scheme guarantees it; C++ compilers typically do it with optimization but it isn't guaranteed, so for deep recursion in C++ I prefer an explicit loop."

---

## 2. Mutual recursion

**In one sentence:** mutual recursion is when two (or more) functions call **each other** in a cycle, e.g. `A` calls `B` and `B` calls `A`, until a base case stops it.

### In plain words
Two friends taking turns telling a story: Ana says one sentence then says "your turn, Ben"; Ben says one sentence then says "your turn, Ana"… until someone says "The End". Neither can tell the story alone.

### How it works
- Classic toy example: `is_even(n) = n == 0 ? true : is_odd(n - 1)` and `is_odd(n) = n == 0 ? false : is_even(n - 1)`.
- Real uses:
  - **Recursive-descent parsers:** `parse_expression` calls `parse_term`, which calls `parse_factor`, which (for parentheses) calls `parse_expression` again.
  - **State machines** where each state is a function.
  - Grammars and tree structures with different node types (e.g. JSON: an object contains values; a value can be an object).
- In C++ you need a **forward declaration** so the first function knows the second exists.

### Modern C++ example — a tiny recursive-descent calculator
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cctype>
#include <iostream>
#include <string_view>

// Grammar:
//   expr   := term   (('+' | '-') term)*
//   term   := factor (('*' | '/') factor)*
//   factor := number | '(' expr ')'
class Calculator {
public:
    explicit Calculator(std::string_view s) : s_(s) {}
    double parse() { return expr(); }

private:
    double expr();     // forward declarations: these functions call each other
    double term();
    double factor();

    char peek() { skip_spaces(); return pos_ < s_.size() ? s_[pos_] : '\0'; }
    void skip_spaces() { while (pos_ < s_.size() && s_[pos_] == ' ') ++pos_; }

    std::string_view s_;
    std::size_t pos_ = 0;
};

double Calculator::expr() {
    double v = term();
    while (peek() == '+' || peek() == '-') {
        char op = s_[pos_++];
        v = (op == '+') ? v + term() : v - term();
    }
    return v;
}
double Calculator::term() {
    double v = factor();
    while (peek() == '*' || peek() == '/') {
        char op = s_[pos_++];
        v = (op == '*') ? v * factor() : v / factor();
    }
    return v;
}
double Calculator::factor() {
    if (peek() == '(') {
        ++pos_;                       // '('
        double v = expr();            // <- mutual recursion: factor calls expr
        ++pos_;                       // ')'
        return v;
    }
    double v = 0;
    while (pos_ < s_.size() && std::isdigit(static_cast<unsigned char>(s_[pos_])))
        v = v * 10 + (s_[pos_++] - '0');
    return v;
}

// The textbook example:
bool is_odd(unsigned n);
bool is_even(unsigned n) { return n == 0 ? true : is_odd(n - 1); }
bool is_odd(unsigned n)  { return n == 0 ? false : is_even(n - 1); }

int main() {
    for (const char* e : {"2 + 3 * 4", "(2 + 3) * 4", "100 / (4 * (2 + 3))"})
        std::cout << e << " = " << Calculator(e).parse() << '\n';
    std::cout << std::boolalpha << "is_even(10) = " << is_even(10) << ", is_odd(7) = " << is_odd(7) << '\n';
}
```

**Output:**
```text
2 + 3 * 4 = 14
(2 + 3) * 4 = 20
100 / (4 * (2 + 3)) = 5
is_even(10) = true, is_odd(7) = true
```

### Interview answer
"Mutual recursion is a cycle of functions calling each other, like is_even/is_odd or the expr/term/factor functions of a recursive-descent parser. It needs forward declarations in C++ and the same care as ordinary recursion: base cases and bounded depth."

---

## 3. Anonymous recursion

**In one sentence:** anonymous recursion is recursion in a function that **has no name** (a lambda), achieved by passing the function to itself, capturing a `std::function`, or — in C++23 — using "deducing this".

### In plain words
A normal function calls itself by name: "Ana, do step 2." A lambda has no name, so it can't say "call me again". Solution: hand it a **mirror** (a reference to itself) as a parameter, so it can call the mirror. (This is the practical version of the Y combinator from [Lambda Calculus](./Lambda-Calculus.md#6-recursion-without-names-the-y-combinator).)

### How it works
Three ways in C++:
| Technique | Standard | Notes |
|---|---|---|
| Pass `self` as a parameter: `f(f, n)` | C++14 | Zero overhead; slightly awkward call syntax |
| Capture a `std::function` by reference | C++11 | Easy, but type-erased (slower) and the captured reference must stay alive |
| **Deducing this**: `[](this auto self, int n)` | **C++23** | Cleanest: `self(n - 1)` |

Useful for small local helpers such as a DFS inside a function, without polluting the namespace with a separate named function.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <vector>

int main() {
    // 1) Pass itself as a parameter (generic lambda)
    auto fib = [](auto&& self, int n) -> int {
        return n < 2 ? n : self(self, n - 1) + self(self, n - 2);
    };
    std::cout << "fib(20) = " << fib(fib, 20) << '\n';

    // 2) Capture a std::function by reference (common for local DFS helpers)
    std::map<int, std::vector<int>> tree{{1, {2, 3}}, {2, {4}}, {3, {}}, {4, {}}};
    std::vector<int> order;
    std::function<void(int)> dfs = [&](int node) {
        order.push_back(node);
        for (int child : tree[node]) dfs(child);   // calls itself through the captured object
    };
    dfs(1);
    std::cout << "DFS order:";
    for (int n : order) std::cout << ' ' << n;
    std::cout << '\n';

    // 3) C++23 "deducing this" (needs -std=c++23 and GCC 14 / Clang 18 / MSVC 17.2):
    //    auto fact = [](this auto self, int n) -> long long { return n <= 1 ? 1 : n * self(n - 1); };
}
```

**Output:**
```text
fib(20) = 6765
DFS order: 1 2 4 3
```

### Interview answer
"Anonymous recursion lets an unnamed function recurse — theoretically via fixed-point combinators, practically by passing the lambda to itself, capturing a std::function, or with C++23's explicit object parameter (`this auto self`). It's handy for local recursive helpers like a DFS inside a function."

---

## 4. Recursion vs. iteration

| | Recursion | Iteration (loops) |
|---|---|---|
| Best for | Trees, graphs, nested data, divide and conquer, grammars | Linear sequences, simple counting |
| Readability | Often closer to the problem's definition | Often simpler for flat problems |
| Memory | O(depth) stack frames | O(1) extra (unless you keep your own stack) |
| Risk | Stack overflow on deep input | Harder to write for nested structures |

Any recursion can be converted to iteration with an **explicit stack** (e.g. `std::vector` used as a stack) — a good fix when input depth is unbounded (e.g. a user-supplied deeply nested JSON).

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Base case | Stops the recursion |
| Recursive case | Same problem, smaller input |
| Call stack | One frame per active call; depth-limited |
| Tail recursion | Recursive call is the last action; enables TCO (O(1) stack) |
| Mutual recursion | Functions calling each other (parsers, is_even/is_odd) |
| Anonymous recursion | Lambda recursion via `self` parameter, `std::function`, or `this auto` (C++23) |
