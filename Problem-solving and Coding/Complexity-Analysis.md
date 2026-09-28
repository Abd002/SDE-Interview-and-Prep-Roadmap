# Time and Space Complexity Analysis — Big O, Big Ω, Big Θ

> **What you'll learn:** how to describe how fast code runs and how much memory it uses **as the input grows**, using **Big O** (upper bound), **Big Omega** (lower bound) and **Big Theta** (tight bound), how to analyze loops and recursion, best/average/worst/amortized cases, and **space complexity** — with C++ programs that count operations so you can *see* the growth.
>
> **Prerequisites:** loops and functions in C++. No math beyond "multiply" and "logarithm = how many times you can halve".

## Table of Contents
0. [Why complexity analysis?](#0-why-complexity-analysis)
1. [Big O notation](#1-big-o-notation)
2. [Big Omega notation](#2-big-omega-notation)
3. [Big Theta notation](#3-big-theta-notation)
4. [Space complexity analysis](#4-space-complexity-analysis)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Why complexity analysis?

**In one sentence:** complexity analysis predicts how an algorithm's running time and memory **grow** with the input size *n*, independent of the computer, compiler or programming language.

### In plain words
Two ways to find a word in a 1,000-page dictionary:
- **Read every page from the start** — twice the pages, twice the work.
- **Open in the middle and keep halving** — twice the pages, only **one** extra step.
On a small booklet both are instant. On a million-page book, the first takes a week and the second takes 20 steps. Complexity analysis tells you *which kind of growth* you have — before you learn it in production.

### How it works
- We count **basic operations** (comparisons, assignments, additions) as a function of *n*, not seconds.
- We care about **growth for large n**, so we **drop constants** and **lower-order terms**: `3n² + 5n + 100` → n².
- Common growth rates, from best to worst:

| Class | Name | n = 10 | n = 1,000 | n = 1,000,000 | Example |
|---|---|---|---|---|---|
| O(1) | constant | 1 | 1 | 1 | Array index, hash lookup (average) |
| O(log n) | logarithmic | 3 | 10 | 20 | Binary search, balanced tree lookup |
| O(n) | linear | 10 | 1,000 | 10⁶ | One loop over the data |
| O(n log n) | linearithmic | 33 | 10,000 | 2×10⁷ | Good sorting (`std::sort`) |
| O(n²) | quadratic | 100 | 10⁶ | 10¹² | Nested loops over the same data |
| O(2ⁿ) | exponential | 1,024 | 10³⁰¹ | — | All subsets, naive recursive Fibonacci |
| O(n!) | factorial | 3.6×10⁶ | — | — | All orderings (permutations) |

Rule of thumb: a modern CPU does roughly **10⁸–10⁹ simple operations per second**, so with n = 10⁶, O(n log n) is fine and O(n²) is not.

---

## 1. Big O notation

**In one sentence:** **Big O** gives an **upper bound** on growth — "the algorithm takes **at most** this order of steps (for large n)" — and is most often used to describe the **worst case**.

### In plain words
"The trip takes **at most** 2 hours" — it could be faster, but never slower (beyond a constant factor). When people say "this algorithm is O(n²)", they usually mean "in the worst case its work grows no faster than n²".

### How it works
**Formal idea:** f(n) = O(g(n)) if there are constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀.

**How to compute Big O of code:**
1. **Sequential statements → add**, then keep the biggest: O(n) + O(n²) = O(n²).
2. **Nested loops → multiply**: a loop of n inside a loop of n = O(n²); a loop of n inside a loop of m = O(n·m) (different inputs, different letters!).
3. **Loops that halve/double** the problem → O(log n).
4. **Drop constants**: 2n → O(n); n/2 → O(n).
5. **Function calls** count as the complexity of the function (e.g. `std::sort` inside a loop → O(k · n log n)).
6. **Recursion**: (number of calls) × (work per call), or use a recurrence: T(n) = 2T(n/2) + O(n) → O(n log n).

**Cases:**
- **Worst case** — the maximum over all inputs of size n (what Big O usually describes).
- **Best case** — the minimum (e.g. the item is first).
- **Average case** — expected over typical inputs.
- **Amortized** — average per operation over a *sequence* (e.g. `std::vector::push_back` is O(1) amortized: occasional O(n) reallocations are rare enough).

### Modern C++ example — counting operations for O(1), O(log n), O(n), O(n log n), O(n²)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>

long constant(long)   { return 1; }                                             // O(1)
long logarithmic(long n) { long steps = 0; while (n > 1) { n /= 2; ++steps; } return steps; }  // O(log n)
long linear(long n)   { long steps = 0; for (long i = 0; i < n; ++i) ++steps; return steps; } // O(n)
long linearithmic(long n) {                                                     // O(n log n)
    long steps = 0;
    for (long i = 0; i < n; ++i) steps += logarithmic(n);
    return steps;
}
long quadratic(long n) {                                                        // O(n^2)
    long steps = 0;
    for (long i = 0; i < n; ++i)
        for (long j = 0; j < n; ++j) ++steps;
    return steps;
}

int main() {
    std::cout << std::format("{:>7} {:>6} {:>8} {:>8} {:>10} {:>12}\n", "n", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)");
    for (long n : {10L, 100L, 1000L, 10000L})
        std::cout << std::format("{:>7} {:>6} {:>8} {:>8} {:>10} {:>12}\n",
                                 n, constant(n), logarithmic(n), linear(n), linearithmic(n), quadratic(n));
}
```

**Output:**
```text
      n   O(1) O(log n)     O(n) O(n log n)       O(n^2)
     10      1        3       10         30          100
    100      1        6      100        600        10000
   1000      1        9     1000       9000      1000000
  10000      1       13    10000     130000    100000000
```
Multiply n by 10: O(n) work ×10, O(n²) work ×100, O(log n) work +3 or 4.

### Modern C++ example — amortized O(1): `std::vector::push_back`
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    long copies = 0;                                   // elements moved during reallocations
    const int n = 1'000'000;
    for (int i = 0; i < n; ++i) {
        if (v.size() == v.capacity()) copies += static_cast<long>(v.size());   // a reallocation copies everything
        v.push_back(i);
    }
    std::cout << n << " push_backs caused " << copies << " element copies in total -> "
              << static_cast<double>(copies) / n << " copies per push on average (O(1) amortized)\n";
}
```

**Output (may vary):**
```text
1000000 push_backs caused 1048575 element copies in total -> 1.04858 copies per push on average (O(1) amortized)
```
(With libstdc++'s doubling growth; MSVC grows by 1.5× and gets a slightly different constant — still O(1) amortized.)

### Common mistakes
- Calling two different inputs "n": iterating an `n`-element list inside an `m`-element loop is O(n·m), not O(n²).
- Forgetting hidden costs: `s = s + c` in a loop copies the string each time (O(n²)); `std::vector::erase(begin())` is O(n); `std::find` is O(n).
- Thinking O(1) means "fast": it means "doesn't grow with n" — a slow constant is still slow.

### Interview answer
"Big O is an asymptotic upper bound on growth — f(n) ≤ c·g(n) for large n — typically used for worst-case running time. I compute it by adding sequential parts, multiplying nested loops, dropping constants and lower-order terms, using log n for halving, and solving recurrences for recursion. I also distinguish best, average, worst and amortized costs, like O(1) amortized vector push_back."

---

## 2. Big Omega notation

**In one sentence:** **Big Omega (Ω)** gives a **lower bound** on growth — "the algorithm takes **at least** this order of steps" (for large n).

### In plain words
"The trip takes **at least** 30 minutes" — it could take longer, but never less. Big Ω answers "what's the minimum work this could possibly need?"

### How it works
- **Formal idea:** f(n) = Ω(g(n)) if f(n) ≥ c·g(n) for some c > 0 and all large n.
- Often used for:
  - **Best case** of an algorithm: linear search is Ω(1) — the item might be first.
  - **Lower bounds of problems** (any algorithm): finding the maximum of an unsorted array is Ω(n), because you must look at every element; comparison-based sorting is **Ω(n log n)** — no comparison sort can do better.
- Caution: "best case" and "Ω" aren't the same concept — Ω is a *bound*, which can describe any case. But in interviews, "best case → Ω" is a common and acceptable shorthand.

### Modern C++ example — linear search: best case Ω(1), worst case O(n)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <vector>

int comparisons = 0;
int linear_search(const std::vector<int>& v, int target) {
    for (std::size_t i = 0; i < v.size(); ++i) {
        ++comparisons;
        if (v[i] == target) return static_cast<int>(i);
    }
    return -1;
}

int main() {
    std::vector<int> data(1'000'000);
    std::iota(data.begin(), data.end(), 0);           // 0, 1, 2, ...

    comparisons = 0; linear_search(data, 0);
    std::cout << "best case (target first):    " << comparisons << " comparison  -> Omega(1)\n";
    comparisons = 0; linear_search(data, -5);
    std::cout << "worst case (target missing): " << comparisons << " comparisons -> O(n)\n";

    // A PROBLEM lower bound: to know the maximum you must look at every element -> Omega(n)
    int looked = 0, best = data[0];
    for (int x : data) { ++looked; if (x > best) best = x; }
    std::cout << "finding the max looked at " << looked << " elements: no algorithm can skip any -> Omega(n)\n";
}
```

**Output:**
```text
best case (target first):    1 comparison  -> Omega(1)
worst case (target missing): 1000000 comparisons -> O(n)
finding the max looked at 1000000 elements: no algorithm can skip any -> Omega(n)
```

### Interview answer
"Big Omega is an asymptotic lower bound: f(n) ≥ c·g(n) for large n. It describes the minimum growth — often the best case, like Ω(1) for linear search — and lower bounds for entire problems, like Ω(n) to find a maximum or Ω(n log n) for comparison-based sorting."

---

## 3. Big Theta notation

**In one sentence:** **Big Theta (Θ)** gives a **tight bound** — the growth is **both** O(g(n)) and Ω(g(n)), so it grows **exactly** like g(n) up to constant factors.

### In plain words
"The trip takes **between** 50 and 70 minutes" — you've pinned it down from both sides. Θ is the most precise statement: "this algorithm's work grows like n², no more, no less."

### How it works
- **Formal idea:** f(n) = Θ(g(n)) if c₁·g(n) ≤ f(n) ≤ c₂·g(n) for large n.
- Θ exists when upper and lower bounds match. Examples:
  - Summing an array: always touches all n elements → **Θ(n)** (best = worst).
  - Nested loop over all pairs: **Θ(n²)**.
  - Merge sort: **Θ(n log n)** in every case.
  - Linear search: best Θ(1), worst Θ(n) → overall only O(n) and Ω(1); there's no single Θ for "all inputs", but there is a Θ for each case.
- In everyday speech (and many interviews), people say "Big O" when they really mean Θ ("sorting is O(n log n)"). Being precise about O vs Θ is a plus.

### Modern C++ example — Θ(n) and Θ(n²): the same count on every input
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <random>
#include <vector>

long sum_steps(const std::vector<int>& v) { long s = 0; for (int x : v) { (void)x; ++s; } return s; }   // always n
long pairs_steps(const std::vector<int>& v) {                                                         // always n(n-1)/2
    long s = 0;
    for (std::size_t i = 0; i < v.size(); ++i)
        for (std::size_t j = i + 1; j < v.size(); ++j) ++s;
    return s;
}

int main() {
    std::mt19937 rng(1);
    for (int trial = 0; trial < 3; ++trial) {                 // different random inputs of size 1000
        std::vector<int> v(1000);
        for (int& x : v) x = static_cast<int>(rng() % 100);
        std::cout << "input #" << trial << ": sum does " << sum_steps(v) << " steps, all-pairs does "
                  << pairs_steps(v) << " steps\n";
    }
    std::cout << "identical for every input -> Theta(n) and Theta(n^2) (best case = worst case)\n";
}
```

**Output:**
```text
input #0: sum does 1000 steps, all-pairs does 499500 steps
input #1: sum does 1000 steps, all-pairs does 499500 steps
input #2: sum does 1000 steps, all-pairs does 499500 steps
identical for every input -> Theta(n) and Theta(n^2) (best case = worst case)
```

### Interview answer
"Big Theta is a tight bound: f(n) is Θ(g(n)) when it's both O(g(n)) and Ω(g(n)), meaning it grows at exactly that rate up to constants — like Θ(n) to sum an array or Θ(n log n) for merge sort. Big O is only an upper bound, so 'O(n²)' is technically true for a linear algorithm too; Θ is the precise statement, and it can be given per case."

---

## 4. Space complexity analysis

**In one sentence:** space complexity measures how much **extra memory** an algorithm needs as the input grows — including new data structures **and the call stack used by recursion**.

### In plain words
Time complexity asks "how many steps?"; space complexity asks "how much desk space do I need to work?". Sorting a deck of cards in your hands needs almost no extra table space; making a sorted copy needs a second full-size table.

### How it works
- Usually we count **auxiliary space** (extra memory beyond the input). Say which you mean: "O(1) extra space" vs "O(n) total including the input".
- Sources of memory use:
  - **Data structures you allocate:** a copy of the array → O(n); an n×n table → O(n²); a fixed-size array of 256 counters → O(1).
  - **Recursion depth:** each call keeps a stack frame → a recursion of depth n uses O(n) stack even without any arrays (and can **stack overflow**).
  - **Hidden allocations:** strings built in loops, `std::vector` growth, temporary copies (pass big objects by `const&`).
- **In-place** algorithms use O(1) (or O(log n)) extra space.
- **Space–time trade-off:** often you can spend memory to save time (a hash set of seen values, caches, memoization) or save memory at the cost of time — see [Optimization](./Optimization.md#2-space-time-trade-offs).

### Modern C++ example — O(1), O(n) and recursion-depth space
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <vector>

// O(1) extra space: reverse in place with two indices
void reverse_in_place(std::vector<int>& v) {
    for (std::size_t i = 0, j = v.size(); i < j--; ++i) std::swap(v[i], v[j]);
}

// O(n) extra space: builds a whole new vector
std::vector<int> reversed_copy(const std::vector<int>& v) { return {v.rbegin(), v.rend()}; }

// O(n) extra space hidden in the CALL STACK: one frame per element
int max_depth = 0;
long sum_recursive(const std::vector<int>& v, std::size_t i, int depth = 1) {
    max_depth = std::max(max_depth, depth);
    if (i == v.size()) return 0;
    return v[i] + sum_recursive(v, i + 1, depth + 1);
}
// O(1) extra space: the same sum with a loop
long sum_iterative(const std::vector<int>& v) { long s = 0; for (int x : v) s += x; return s; }

int main() {
    std::vector<int> v{1, 2, 3, 4, 5};
    reverse_in_place(v);
    auto copy = reversed_copy(v);
    std::cout << "in place: v[0]=" << v[0] << " (no extra array); copy: " << copy.size() << " extra ints\n";

    std::vector<int> big(10'000, 1);
    long a = sum_recursive(big, 0), b = sum_iterative(big);
    std::cout << "recursive sum=" << a << " used " << max_depth << " stack frames; iterative sum=" << b << " used 1\n";
}
```

**Output:**
```text
in place: v[0]=5 (no extra array); copy: 5 extra ints
recursive sum=10000 used 10001 stack frames; iterative sum=10000 used 1
```

### Interview answer
"Space complexity measures the additional memory an algorithm needs as a function of input size: allocated data structures, hidden copies, and the recursion stack, where depth d costs O(d). I state whether I mean auxiliary or total space, prefer in-place O(1) approaches when memory matters, and discuss space–time trade-offs like using a hash set or memoization to cut time."

---

## Cheat sheet

| Notation | Meaning | Analogy |
|---|---|---|
| O(g) | Upper bound: at most ~g (usually worst case) | "at most 2 hours" |
| Ω(g) | Lower bound: at least ~g (often best case / problem bound) | "at least 30 minutes" |
| Θ(g) | Tight bound: exactly ~g | "between 50 and 70 minutes" |

| Code shape | Complexity |
|---|---|
| Simple statement, array index, hash lookup (avg) | O(1) |
| Loop that halves/doubles | O(log n) |
| Single loop over n | O(n) |
| Loop × O(log n) work, good sorting | O(n log n) |
| Nested loops over n | O(n²) |
| Two different inputs | O(n + m) sequential, O(n·m) nested |
| Recursion with 2 branches, depth n | O(2ⁿ) |
| Recursion depth d | O(d) stack space |

Rules: add sequential parts, multiply nested parts, drop constants and smaller terms.
