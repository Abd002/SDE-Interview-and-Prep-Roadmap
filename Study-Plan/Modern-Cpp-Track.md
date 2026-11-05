# Modern C++ track (plan phase 9, steps 185–200)

Added on 5 Nov 2026. You already use C++ well in competitive programming, so this track **skips what CP gives you** and covers the C++ that jobs expect: ownership, move semantics, generic code, concurrency, tooling and performance. It runs **in parallel** with phases 3–8: do about **two steps a week**. Each step adds a small file with tests to one lab repo, and the last step turns that work into a public project for your CV.

**Why now:** Siemens (C++, multithreading), Hitachi Rail (C/C++), Valeo and noon all test C++ beyond algorithms.

## What it skips (you know it from CP)

STL containers and `<algorithm>`, iterators, `auto`, range-for, simple function templates, basic lambdas, `pair`/`tuple`, structured bindings in loops, bit tricks, fast I/O, references for parameters, and complexity analysis.

## The steps

| Step | Topic | Hands-on exercise in the lab repo | Main resource |
|---|---|---|---|
| 185 | **Toolchain:** CMake, C++23, strict warnings, ASan/UBSan/TSan presets, clang-tidy, GoogleTest | Set up the `modern-cpp-lab` repo; every later step adds to it | [GoogleTest + CMake quickstart](https://google.github.io/googletest/quickstart-cmake.html), [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) |
| 186 | **Object lifetime + RAII:** construction/destruction order, generated special members, rule of 0/3/5 | RAII `UniqueFd` for a Linux file descriptor | [cppreference: rule of three/five/zero](https://en.cppreference.com/w/cpp/language/rule_of_three); CppCon "Back to Basics: RAII and the Rule of Zero" |
| 187 | **Value categories + move semantics:** rvalue references, `std::move` vs `std::forward`, `noexcept` moves, copy elision | Move-only `Buffer`; count copies vs moves when a vector grows with and without `noexcept` | [learncpp: rvalue references](https://www.learncpp.com/cpp-tutorial/rvalue-references/), [move constructors](https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/) |
| 188 | **Smart pointers + ownership:** `unique_ptr` with custom deleters, `shared_ptr` control block, `weak_ptr` cycles | `FILE*` deleter; show a `shared_ptr` cycle leak with LeakSanitizer | [learncpp: smart pointers](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/) |
| 189 | **Templates beyond CP:** class templates, CTAD, perfect forwarding, variadic templates, fold expressions, type traits, `if constexpr` | A forwarding factory, a variadic `log(...)` | [learncpp: template classes](https://www.learncpp.com/cpp-tutorial/template-classes/) |
| 190 | **Concepts (C++20):** `requires`, standard concepts, your own concept | A `Hashable` concept; compare the error messages | [cppreference: constraints](https://en.cppreference.com/w/cpp/language/constraints) |
| 191 | **Compile time:** `constexpr`, `consteval`, `constinit`, `static_assert` | A compile-time CRC-32 table (like your bootloader's CRC check) | [learncpp: constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/) |
| 192 | **Vocabulary types:** `optional`, `variant` + `visit`, `expected` (C++23), `string_view`, `span` | Config parser returning `std::expected`; a dangling `string_view` caught by ASan | [cppreference: expected](https://en.cppreference.com/w/cpp/utility/expected), [learncpp: string_view](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring_view/) |
| 193 | **Ranges + `std::format`/`std::print`** | Rewrite an old CP solution with views and projections | [cppreference: ranges](https://en.cppreference.com/w/cpp/ranges) |
| 194 | **Exception safety:** basic/strong/nothrow guarantees, `noexcept`, copy-and-swap | Strongly exception-safe `Stack<T>::push`, tested with a throwing `T` | [learncpp: exception dangers and downsides](https://www.learncpp.com/cpp-tutorial/exception-dangers-and-downsides/) |
| 195 | **Concurrency 1:** `jthread` + `stop_token`, `scoped_lock`, `condition_variable`, futures | Thread-safe bounded queue + thread pool, tested under TSan | [cppreference: thread support](https://en.cppreference.com/w/cpp/thread) |
| 196 | **Concurrency 2:** atomics and the memory model, false sharing | Lock-free SPSC ring buffer; benchmark vs the mutex queue | [cppreference: memory_order](https://en.cppreference.com/w/cpp/atomic/memory_order); Herb Sutter "atomic<> Weapons" |
| 197 | **Polymorphism + design:** vtables, slicing, CRTP, type erasure, PImpl | One interface done three ways; compare | [learncpp: the virtual table](https://www.learncpp.com/cpp-tutorial/the-virtual-table/), [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) |
| 198 | **Undefined behaviour + debugging:** lifetime, iterator invalidation, overflow, aliasing; sanitizers, Valgrind, gdb | One tiny program per bug type; then 20 CppQuiz UB questions | [cppreference: UB](https://en.cppreference.com/w/cpp/language/ub), [CppQuiz plan](Practice-Bank/Cpp/CppQuiz-Study-Plan.md) |
| 199 | **Performance:** cache-friendly layout, `reserve`/`emplace`, small-buffer optimisation, Google Benchmark, `perf` | Array-of-structs vs struct-of-arrays (like CMU L06 row vs column storage) | [Google Benchmark](https://github.com/google/benchmark) |
| 200 | **Capstone:** header-only thread-safe LRU cache (C++20) with tests, sanitizers in GitHub Actions CI | Publish it and add it to the C++-heavy CVs; then 30 mixed CppQuiz questions | Steps 185–199 |

About 25 hours in total (the capstone is about 5).

**Quick references while you work:** [hacking C++ cheat sheets](https://hackingcpp.com/cpp/cheat_sheets.html) · [modern-cpp-features (C++11–23 on one page)](https://github.com/AnthonyCalandra/modern-cpp-features) · [CppQuiz](https://cppquiz.org/).
