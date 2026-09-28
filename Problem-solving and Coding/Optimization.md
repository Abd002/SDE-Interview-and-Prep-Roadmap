# Optimization — Algorithmic Optimization, Space-Time Trade-offs and Profiling Tools

> **What you'll learn:** how to make programs faster the *right* way: **measure first** with **profiling tools**, get the biggest wins from **algorithmic optimization** (better Big O), use **space-time trade-offs** (spend memory to save time, or the reverse), and apply a few C++-specific performance habits — each backed by a runnable C++ benchmark.
>
> **Prerequisites:** [Complexity Analysis](./Complexity-Analysis.md).
>
> Benchmark numbers depend on your machine; compile with optimizations (`-O2`) when measuring.

## Table of Contents
0. [The golden rules of optimization](#0-the-golden-rules-of-optimization)
1. [Algorithmic optimization](#1-algorithmic-optimization)
2. [Space-time trade-offs](#2-space-time-trade-offs)
3. [Profiling tools](#3-profiling-tools)
4. [Cheat sheet](#cheat-sheet)

---

## 0. The golden rules of optimization

**In one sentence:** first make it **correct**, then **measure** to find the real bottleneck, then fix the **biggest** problem — usually the algorithm — and measure again.

### In plain words
If your commute takes 60 minutes, and 50 of those minutes are stuck in one traffic jam, buying faster shoes for the 5-minute walk won't help. Find the traffic jam first.

### How it works
1. **Correctness first**, with tests, so you can optimize safely.
2. **Set a goal** ("p99 latency < 100 ms", "process 1 GB in < 1 min"). Stop when you reach it.
3. **Measure, don't guess** — profile the realistic workload. Programmers' intuition about hotspots is famously wrong.
4. **Fix the biggest cost first** — **Amdahl's law**: speeding up a part that's 10% of the runtime can save at most 10%.
5. Priorities: **algorithm & data structures** → **I/O & network** (batching, caching) → **memory access patterns** → **micro-optimizations** (last!).
6. **Re-measure** and keep a benchmark to prevent regressions.
> "Premature optimization is the root of all evil" — Donald Knuth (the full quote continues: "…yet we should not pass up our opportunities in that critical 3%").

---

## 1. Algorithmic optimization

**In one sentence:** algorithmic optimization replaces an approach with one of **better time complexity** (e.g. O(n²) → O(n log n) → O(n)), which dwarfs every low-level trick as data grows.

### In plain words
Looking for a friend's number by reading the phone book from page 1 versus using alphabetical order to jump straight to the right page. No amount of reading faster makes the first approach competitive with the second.

### How it works
Typical moves:
| From | To | How |
|---|---|---|
| Nested loops to find pairs/duplicates, O(n²) | O(n) | **Hash set/map** of what you've seen |
| Repeated linear search, O(n) each | O(log n) or O(1) | **Sort once + binary search**, or build a hash index |
| Recomputing the same subresults | Compute once | **Memoization / caching / dynamic programming** |
| Recomputing sums of ranges, O(n) each | O(1) each | **Prefix sums** (precompute) |
| Sorting everything to get the top k, O(n log n) | O(n log k) | **Heap** (`std::priority_queue`) or `std::nth_element` O(n) |
| Many small I/O operations | Few big ones | **Batching** |
| Doing work that isn't needed | Skip it | **Early exit, lazy evaluation, pruning** |

Always check the **hidden complexity** of library calls (e.g. `std::list` has O(n) indexing; `erase` at the front of a vector is O(n); string concatenation in a loop can be O(n²)).

### Modern C++ example — finding duplicates: O(n²) vs O(n log n) vs O(n)
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <algorithm>
#include <chrono>
#include <format>
#include <iostream>
#include <numeric>
#include <random>
#include <unordered_set>
#include <vector>

bool has_duplicate_quadratic(const std::vector<int>& v) {          // compare every pair
    for (std::size_t i = 0; i < v.size(); ++i)
        for (std::size_t j = i + 1; j < v.size(); ++j)
            if (v[i] == v[j]) return true;
    return false;
}
bool has_duplicate_sort(std::vector<int> v) {                        // sort, then check neighbors
    std::ranges::sort(v);
    return std::ranges::adjacent_find(v) != v.end();
}
bool has_duplicate_hash(const std::vector<int>& v) {                 // remember what we've seen
    std::unordered_set<int> seen;
    seen.reserve(v.size());
    for (int x : v) if (!seen.insert(x).second) return true;
    return false;
}

template <class F>
double time_ms(F f) {
    auto t0 = std::chrono::steady_clock::now();
    volatile bool r = f();                                           // keep the call from being optimized away
    (void)r;
    return std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count();
}

int main() {
    std::vector<int> data(40'000);
    std::iota(data.begin(), data.end(), 0);                          // no duplicates: worst case for all
    std::ranges::shuffle(data, std::mt19937{42});

    std::cout << std::format("O(n^2)     nested loops: {:8.2f} ms\n", time_ms([&] { return has_duplicate_quadratic(data); }));
    std::cout << std::format("O(n log n) sort + scan:  {:8.2f} ms\n", time_ms([&] { return has_duplicate_sort(data); }));
    std::cout << std::format("O(n)       hash set:     {:8.2f} ms\n", time_ms([&] { return has_duplicate_hash(data); }));
}
```

**Output (may vary):**
```text
O(n^2)     nested loops:   283.51 ms
O(n log n) sort + scan:      2.35 ms
O(n)       hash set:         1.12 ms
```
Double the input and the first line takes ~4× longer while the others take ~2× longer.

### Interview answer
"Algorithmic optimization improves asymptotic complexity — replacing nested loops with hash lookups, sorting plus binary search, memoization, prefix sums, heaps for top-k, batching and early exits — which yields far larger gains than micro-tuning as input grows. I always check the hidden complexity of library operations."

---

## 2. Space-time trade-offs

**In one sentence:** you can often make code **faster by using more memory** (precomputing, caching, indexing) — or **use less memory by doing more computation** — and the right balance depends on your constraints.

### In plain words
- **Memory for speed:** memorizing the multiplication table so you answer 7×8 instantly instead of adding 7 eight times.
- **Speed for memory:** a small phone that stores only your 10 favorite photos in high quality and re-downloads others when needed.

### How it works
| Spend memory to save time | Spend time to save memory |
|---|---|
| **Lookup tables / precomputation** (sin tables, popcount tables) | **Compression** (store compact, decompress on use) |
| **Caching / memoization** | **Recompute** instead of storing results |
| **Indexes** (database indexes, hash maps) | **Streaming** — process data in chunks instead of loading it all |
| **Prefix sums, summary tables, materialized views** | **Probabilistic structures** — Bloom filters, HyperLogLog (tiny memory, small error) |
| **Denormalization** | **Bit packing** (`std::vector<bool>`, bit fields) |

Considerations: memory is finite (and larger data can be *slower* if it doesn't fit in CPU caches), caches need invalidation, precomputation costs up-front time, and embedded/mobile targets are memory-constrained.

### Modern C++ example — prefix sums (memory for speed) and memoization
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <random>
#include <unordered_map>
#include <vector>

int main() {
    // --- Range-sum queries on daily sales ---
    const std::size_t days = 100'000;
    std::vector<long> sales(days);
    std::mt19937 rng(1);
    for (auto& s : sales) s = rng() % 1000;

    // Spend O(n) extra memory once...
    std::vector<long> prefix(days + 1, 0);                  // prefix[i] = sum of first i days
    std::partial_sum(sales.begin(), sales.end(), prefix.begin() + 1);

    long work_naive = 0, work_prefix = 0;
    for (int q = 0; q < 1000; ++q) {                         // 1000 queries: "sales from day a to day b"
        std::size_t a = rng() % days, b = a + rng() % (days - a);
        long naive = 0;
        for (std::size_t d = a; d <= b; ++d) { naive += sales[d]; ++work_naive; }   // O(n) per query
        long fast = prefix[b + 1] - prefix[a]; ++work_prefix;                        // ...O(1) per query
        if (naive != fast) std::cout << "mismatch!\n";
    }
    std::cout << "1000 range queries: naive touched " << work_naive << " values, prefix sums did " << work_prefix << " lookups\n";

    // --- Memoization: remember results of an expensive pure function ---
    long calls = 0;
    std::unordered_map<int, long long> memo;
    auto ways_to_climb = [&](auto&& self, int stairs) -> long long {    // 1 or 2 steps at a time
        ++calls;
        if (stairs <= 1) return 1;
        if (auto it = memo.find(stairs); it != memo.end()) return it->second;
        return memo[stairs] = self(self, stairs - 1) + self(self, stairs - 2);
    };
    long long ways = ways_to_climb(ways_to_climb, 80);
    std::cout << "ways to climb 80 stairs: " << ways << " using " << calls << " calls (without memo: ~10^16 calls)\n";
}
```

**Output:**
```text
1000 range queries: naive touched 24926113 values, prefix sums did 1000 lookups
ways to climb 80 stairs: 37889062373143906 using 159 calls (without memo: ~10^16 calls)
```

### Interview answer
"Space-time trade-offs exchange memory for speed — lookup tables, caches, memoization, indexes, prefix sums, denormalized views — or computation for memory — compression, recomputation, streaming and probabilistic structures like Bloom filters. I choose based on memory limits, access patterns, cache-locality effects and invalidation cost."

---

## 3. Profiling tools

**In one sentence:** profilers measure **where a program actually spends its time and memory** — which functions, lines, allocations or waits — so you optimize the real bottleneck instead of guessing.

### In plain words
A fitness tracker for your program: instead of "I feel slow", it tells you "you spent 70% of the day in meetings". Now you know what to cut.

### How it works
**Kinds of profiling**
| Kind | Measures | Tools |
|---|---|---|
| **Sampling CPU profiler** | Periodically records the call stack → % time per function; low overhead | **perf** (Linux), Intel **VTune**, AMD uProf, Visual Studio profiler, Xcode **Instruments**, **gperftools** |
| **Instrumenting profiler** | Exact call counts/times via inserted code | **gprof** (`-pg`), **Valgrind Callgrind** (+ KCachegrind), **Tracy**, Optick |
| **Memory profiler** | Allocations, peak usage, leaks | **heaptrack**, Valgrind **Massif**, AddressSanitizer leak check |
| **Hardware counters** | Cache misses, branch mispredictions, IPC | `perf stat`, VTune |
| **Micro-benchmarks** | Precise timing of small functions | **Google Benchmark**, nanobench |
| **Production / distributed** | Latency across services | Continuous profilers (Parca, Pyroscope), [distributed tracing](../System%20Design/Distributed-Systems.md#4-distributed-tracing) |

Typical Linux workflow:
```text
$ g++ -O2 -g main.cpp -o app          # optimized build WITH debug symbols
$ perf record -g ./app                # sample the call stacks
$ perf report                         # see the hottest functions
$ perf stat -e cache-misses ./app     # hardware counters
$ valgrind --tool=callgrind ./app && kcachegrind callgrind.out.*
```
**Flame graphs** (Brendan Gregg) visualize sampled stacks: the widest boxes are where time goes.

Tips: profile **optimized** builds on **realistic data**; measure wall-clock *and* CPU time (I/O waits don't show in CPU profiles); watch out for measurement noise (warm-up, multiple runs, pin CPU frequency).

### Modern C++ example — a tiny scoped profiler that finds a cache-locality hotspot
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <chrono>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <vector>

// RAII timer: measures the scope it lives in and accumulates per label (a mini instrumenting profiler).
class ScopedTimer {
public:
    explicit ScopedTimer(std::string label) : label_(std::move(label)), start_(std::chrono::steady_clock::now()) {}
    ~ScopedTimer() { totals()[label_] += std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - start_).count(); }
    static std::map<std::string, double>& totals() { static std::map<std::string, double> t; return t; }
private:
    std::string label_;
    std::chrono::steady_clock::time_point start_;
};

int main() {
    const std::size_t n = 4096;
    std::vector<int> grid(n * n, 1);                  // one contiguous block, stored row by row
    long long row_sum = 0, col_sum = 0;

    {
        ScopedTimer t("load data");
        for (std::size_t i = 0; i < grid.size(); ++i) grid[i] = static_cast<int>(i % 7);
    }
    {
        ScopedTimer t("sum row by row");              // walks memory in order: cache-friendly
        for (std::size_t r = 0; r < n; ++r)
            for (std::size_t c = 0; c < n; ++c) row_sum += grid[r * n + c];
    }
    {
        ScopedTimer t("sum column by column");        // jumps n*4 bytes each step: cache-hostile
        for (std::size_t c = 0; c < n; ++c)
            for (std::size_t r = 0; r < n; ++r) col_sum += grid[r * n + c];
    }

    double total = 0;
    for (const auto& [label, ms] : ScopedTimer::totals()) total += ms;
    std::cout << "profile (same result: " << (row_sum == col_sum ? "yes" : "no") << "):\n";
    for (const auto& [label, ms] : ScopedTimer::totals())
        std::cout << std::format("  {:<22} {:8.1f} ms  {:5.1f}%\n", label, ms, 100 * ms / total);
}
```

**Output (may vary):**
```text
profile (same result: yes):
  load data                  18.3 ms   10.6%
  sum column by column      141.6 ms   82.3%
  sum row by row             12.2 ms    7.1%
```
Both loops do the same arithmetic, but the column-by-column loop is ~10× slower because it defeats the CPU cache — something only **measurement** reveals. The fix: iterate in memory order (or change the data layout).

### Interview answer
"I profile before optimizing: sampling profilers like perf, VTune or Instruments for CPU hotspots, Callgrind or instrumentation for exact call costs, heaptrack or Massif for memory, hardware counters for cache misses, Google Benchmark for micro-benchmarks and continuous profiling or tracing in production — always on optimized builds with symbols and realistic data. Then I fix the dominant cost, often algorithmic or memory-access related, and re-measure."

---

## Cheat sheet

| Topic | Key idea |
|---|---|
| Golden rules | Correct → set a goal → measure → fix the biggest cost → re-measure |
| Amdahl's law | Speeding up a small part gives a small gain |
| Algorithmic | Better Big O beats micro-tuning (hash sets, sorting, memoization, prefix sums, heaps) |
| Space-time | Tables, caches, indexes (memory → speed) vs compression, recompute, streaming (time → memory) |
| Profiling | perf, VTune, Instruments, gprof, Callgrind, heaptrack, Google Benchmark, flame graphs |
| C++ habits | `-O2`, `reserve()`, avoid copies (`const&`, move), contiguous containers, memory-order loops |
