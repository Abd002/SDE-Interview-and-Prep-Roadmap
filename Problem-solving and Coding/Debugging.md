# Debugging — Print Debugging, Debugger Tools and Rubber Duck Debugging

> **What you'll learn:** a systematic way to find bugs, and the three techniques in the roadmap — **print debugging**, **debugger tools** (gdb/lldb, IDE debuggers, sanitizers, Valgrind) and **rubber duck debugging** — each demonstrated on real C++ bugs.
>
> **Prerequisites:** compiling and running C++ programs.

## Table of Contents
0. [The debugging mindset](#0-the-debugging-mindset)
1. [Print debugging](#1-print-debugging)
2. [Debugger tools](#2-debugger-tools)
3. [Rubber duck debugging](#3-rubber-duck-debugging)
4. [Cheat sheet](#cheat-sheet)

---

## 0. The debugging mindset

**In one sentence:** debugging is the **scientific method** applied to code: observe the failure, form a hypothesis, test it, and narrow down until you find the cause.

### In plain words
A doctor doesn't randomly prescribe medicine; they look at symptoms, guess a cause, run a test, and adjust. Randomly changing code "until it works" is like random prescriptions — it may hide the symptom while the disease remains.

### How it works
1. **Reproduce** the bug reliably (smallest input that fails). A bug you can't reproduce, you can't confirm fixed.
2. **Read the error** — full message, stack trace, logs. Often the answer is right there.
3. **Form a hypothesis** ("the index goes one past the end").
4. **Test it** — print, breakpoint, assertion, or a unit test.
5. **Narrow down** — divide and conquer: comment out half, bisect the input, or use `git bisect` to find the commit that introduced it.
6. **Fix the root cause**, not the symptom.
7. **Add a regression test** so it never returns.

Types of bugs to recognize: logic errors, off-by-one, uninitialized variables, null/dangling pointers, memory leaks, integer overflow, race conditions, wrong assumptions about input.

---

## 1. Print debugging

**In one sentence:** print debugging means adding output statements (`std::cerr`, logs) that show **the values of variables and which code paths run**, so you can compare what the program actually does with what you expected.

### In plain words
Leaving breadcrumbs in a forest: "I passed the big oak at 10:02, the river at 10:15…". When you get lost, the breadcrumbs show exactly where you left the path.

### How it works
- Print **inputs, intermediate values and decisions** near the suspected area: "entering loop, i=3, total=42".
- Print to **`std::cerr`** (unbuffered, separate from normal output), include **file/line** (`std::source_location`), and label every value.
- Use **conditional/compile-time switches** so debug output disappears in release builds, or better, use a proper **logging library** with levels (spdlog: trace/debug/info/warn/error).
- Pros: works everywhere (servers, embedded, CI, multithreaded code where breakpoints change timing), easy. Cons: must recompile, clutter, can change timing, easy to forget to remove.

### Modern C++ example — a DEBUG macro with file/line, finding an off-by-one
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <source_location>
#include <string_view>
#include <vector>

constexpr bool kDebug = true;          // flip to false (or use NDEBUG) to silence all debug output

template <class T>
void debug(std::string_view label, const T& value, std::source_location loc = std::source_location::current()) {
    if constexpr (kDebug) std::cerr << "[debug " << loc.function_name() << ':' << loc.line() << "] "
                                    << label << " = " << value << '\n';
}

// Bug report: "average of the last 3 readings is wrong"
double average_of_last_three(const std::vector<double>& readings) {
    double sum = 0;
    std::size_t start = readings.size() - 3;
    debug("start index", start);
    for (std::size_t i = start; i <= readings.size() - 1; ++i) {   // fixed version: correct bounds
        debug("adding reading", readings[i]);
        sum += readings[i];
    }
    debug("sum", sum);
    return sum / 3;
}

int main() {
    double avg = average_of_last_three({10, 20, 30, 40, 50});
    std::cout << "average = " << avg << '\n';
}
```

**Output (may vary):**
```text
[debug double average_of_last_three(const std::vector<double>&):19] start index = 2
[debug double average_of_last_three(const std::vector<double>&):21] adding reading = 30
[debug double average_of_last_three(const std::vector<double>&):21] adding reading = 40
[debug double average_of_last_three(const std::vector<double>&):21] adding reading = 50
[debug double average_of_last_three(const std::vector<double>&):24] sum = 120
average = 40
```
(The function-name format comes from the compiler — this is GCC's.) In the original buggy version, the loop started at `readings.size() - 4`; the very first debug line ("start index = 1") revealed that it was adding 20, 30, 40, 50 — four readings instead of three.

### Common mistakes
- Printing without labels (`42` — which variable?).
- Leaving debug prints in production code; use a logger with levels instead.
- Printing to `std::cout` and being confused by buffering order — use unbuffered `std::cerr` for diagnostics.

### Interview answer
"Print debugging instruments code with labeled output of variables and control flow, ideally to stderr or a leveled logger with file and line information, to compare actual versus expected behavior. It's universal and works well for servers and concurrency, but requires rebuilding and cleanup, so for complex state I switch to a debugger."

---

## 2. Debugger tools

**In one sentence:** a debugger lets you **pause a running program**, step through it line by line, inspect and change variables, and examine the call stack — plus specialized tools (**sanitizers**, **Valgrind**, static analyzers) find whole classes of bugs automatically.

### In plain words
Print debugging is watching a video of what happened. A debugger is being able to **pause the movie at any frame**, walk around the scene, look inside everyone's pockets, and then play one frame at a time. Sanitizers are like **security cameras** that shout the moment someone breaks a rule (touches memory they don't own).

### How it works
**Interactive debuggers:** **gdb** (Linux), **lldb** (macOS/Clang), and IDE front-ends (Visual Studio, VS Code, CLion, Qt Creator).
- Compile with **debug info and no optimization**: `g++ -g -O0 main.cpp`.
- Core commands:
| gdb | lldb | Does |
|---|---|---|
| `break file.cpp:42` / `b func` | `b file.cpp:42` | Set a breakpoint |
| `run` | `run` | Start the program |
| `next` (`n`) | `next` | Execute the next line (step **over** calls) |
| `step` (`s`) | `step` | Step **into** a function call |
| `finish` | `finish` | Run until the current function returns |
| `continue` (`c`) | `continue` | Run to the next breakpoint |
| `print x` / `p v.size()` | `p x` | Show a value/expression |
| `backtrace` (`bt`) | `bt` | Show the call stack — *how did we get here?* |
| `watch total` | `watchpoint set variable total` | Stop when a variable changes |
| `break 42 if i == 99` | `b 42 -c 'i == 99'` | Conditional breakpoint |
| `frame 2`, `info locals` | `frame select 2`, `frame variable` | Inspect another stack frame |
- **Post-mortem debugging:** load a crash **core dump** (`gdb ./app core`) and run `bt` to see where it crashed.

**Automatic bug finders:**
| Tool | Finds | How |
|---|---|---|
| **AddressSanitizer** (`-fsanitize=address`) | Out-of-bounds, use-after-free, leaks | Compile flag; ~2× slower |
| **UndefinedBehaviorSanitizer** (`-fsanitize=undefined`) | Signed overflow, bad shifts, null deref… | Compile flag |
| **ThreadSanitizer** (`-fsanitize=thread`) | Data races | Compile flag |
| **Valgrind** (memcheck) | Memory errors and leaks | Runs unmodified binaries (slow) |
| **Static analyzers** (clang-tidy, cppcheck, compiler warnings `-Wall -Wextra`) | Suspicious code without running it | Build step |
| **`assert` / `static_assert`** | Broken assumptions | Fail loudly at the exact spot |

### Modern C++ example — a program with a memory bug, and how the tools catch it
```cpp
// g++ -std=c++20 -g main.cpp && ./a.out
#include <cassert>
#include <iostream>
#include <vector>

// Returns the index of the largest element. Assumptions are checked with assert.
std::size_t index_of_max(const std::vector<int>& v) {
    assert(!v.empty() && "index_of_max needs at least one element");   // documents + checks the assumption
    std::size_t best = 0;
    for (std::size_t i = 1; i < v.size(); ++i)          // a classic bug would be `i <= v.size()`
        if (v[i] > v[best]) best = i;
    return best;
}

int main() {
    std::vector<int> temps{12, 19, 7, 23, 15};
    std::cout << "hottest day index: " << index_of_max(temps) << '\n';
    std::cout << "bounds-checked access with .at(): ";
    try { std::cout << temps.at(5) << '\n'; }             // .at() throws instead of reading garbage
    catch (const std::out_of_range&) { std::cout << "caught out_of_range for index 5\n"; }
}
```

**Output:**
```text
hottest day index: 3
bounds-checked access with .at(): caught out_of_range for index 5
```

If the loop were written `i <= v.size()`, the program might still *appear* to work — reading garbage past the end. The tools make it obvious (illustrative transcripts; addresses and line numbers will differ on your machine):
```text
$ g++ -std=c++20 -g -fsanitize=address,undefined main.cpp && ./a.out
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x603000000054
READ of size 4 at 0x603000000054 thread T0
    #0 0x401a2b in index_of_max(std::vector<int> const&) main.cpp:10
    #1 0x401c3e in main main.cpp:16
```
And stepping through it in gdb:
```text
$ g++ -std=c++20 -g -O0 main.cpp -o app && gdb ./app
(gdb) break index_of_max
(gdb) run
Breakpoint 1, index_of_max (v=std::vector of length 5 = {12, 19, 7, 23, 15}) at main.cpp:8
(gdb) next
(gdb) watch best
(gdb) continue
Hardware watchpoint 2: best   Old value = 0   New value = 1
(gdb) print v[best]
$1 = 19
(gdb) backtrace
#0  index_of_max (v=...) at main.cpp:10
#1  0x0000555555555316 in main () at main.cpp:16
```

### Common mistakes
- Debugging an optimized build (`-O2`): variables show as `<optimized out>` and lines jump around. Use `-g -O0` (or `-Og`).
- Ignoring compiler warnings — many bugs are reported before you even run the program.
- Not using sanitizers in CI — they catch memory bugs that tests alone miss.

### Interview answer
"I use an interactive debugger like gdb, lldb or an IDE with a -g -O0 build to set breakpoints, conditional breakpoints and watchpoints, step over and into calls, inspect variables and read the backtrace, and I analyze core dumps post-mortem. I complement it with AddressSanitizer, UBSan and ThreadSanitizer, Valgrind, static analysis and assertions, which catch memory errors, undefined behavior and races automatically."

---

## 3. Rubber duck debugging

**In one sentence:** rubber duck debugging means **explaining your code, line by line, out loud** — to a rubber duck, a colleague, or a blank document — and very often you discover the bug yourself while explaining.

### In plain words
You ask a friend for help, start explaining "so this loop goes from 1 to the size, and then… oh wait." — and you've found it before they said a word. The friend wasn't needed; **the act of explaining** forced you to check each assumption instead of skimming. A rubber duck on your desk works just as well and never gets bored. (The name comes from the book *The Pragmatic Programmer*.)

### How it works
1. Put a duck (or any object) on your desk.
2. Explain **what the code is supposed to do**, in plain words.
3. Go through the code **line by line**, saying what each line **actually** does — not what you *meant* it to do.
4. The moment the "supposed to" and the "actually does" differ, you've found the bug.

Why it works: explaining forces you to slow down, make hidden assumptions explicit, and switch from "author mode" (seeing what you intended) to "reader mode" (seeing what's written). It's also great preparation before asking a teammate — you'll ask a much better question. In interviews, "thinking out loud" is the same technique.

### Modern C++ example — explaining a function step by step exposes the bug
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>

// Supposed to: return true if `word` reads the same forwards and backwards.
bool is_palindrome_buggy(const std::string& word) {
    for (std::size_t i = 0; i < word.size() / 2; ++i)
        if (word[i] != word[word.size() - i]) return false;      // <- explain this line to the duck...
    return true;
}

// Explaining to the duck:
//   "i starts at 0. I compare the first letter, word[0], with the last letter, word[size - i]...
//    when i is 0 that's word[size - 0] = word[size]... but the last letter is word[size - 1]!"
//   Found it: off by one.
bool is_palindrome(const std::string& word) {
    for (std::size_t i = 0; i < word.size() / 2; ++i)
        if (word[i] != word[word.size() - 1 - i]) return false;  // compare with the true mirror position
    return true;
}

int main() {
    for (const char* w : {"level", "abca"})
        std::cout << w << ": buggy says " << std::boolalpha << is_palindrome_buggy(w)
                  << ", fixed says " << is_palindrome(w) << '\n';
}
```

**Output:**
```text
level: buggy says false, fixed says true
abca: buggy says false, fixed says false
```
The buggy version compared `word[0]` with `word[size]` — the character *after* the end (for `std::string` that's the `'\0'` terminator) — so it rejected even real palindromes.

### Interview answer
"Rubber duck debugging is explaining the code's intent and then its actual behavior line by line out loud; the mismatch between what you meant and what's written usually reveals the bug. It works because it forces you to read rather than skim, and it's the same skill as thinking aloud in interviews or preparing a clear question for a teammate."

---

## Cheat sheet

| Technique | Best for | Tools / tips |
|---|---|---|
| Scientific method | Every bug | Reproduce → hypothesize → test → narrow → fix root cause → regression test |
| Print debugging | Quick checks, servers, concurrency, CI | `std::clog`, `std::source_location`, leveled loggers |
| Debugger | Complex state, stepping through logic, crashes | gdb/lldb/IDE, `-g -O0`, breakpoints, watchpoints, `bt`, core dumps |
| Sanitizers & analyzers | Memory errors, UB, races | `-fsanitize=address,undefined,thread`, Valgrind, clang-tidy, `-Wall -Wextra` |
| Rubber duck | Logic errors, wrong assumptions | Explain intent, then actual behavior, line by line |
| Narrowing down | Large codebases/regressions | Divide and conquer, minimal repro, `git bisect` |
