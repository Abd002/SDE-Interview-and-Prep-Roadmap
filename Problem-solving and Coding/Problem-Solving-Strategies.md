# Problem-Solving Strategies — A Step-by-Step Method for Any Coding Problem

> **What you'll learn:** a repeatable 7-step method for solving programming problems (in interviews and at work): **understand the problem, break it down, solve a simpler problem, look for patterns, make a plan, implement the plan, test your solution**. We apply every step to the **same example problem** in modern C++, so you can watch a solution grow from confusion to tested code.
>
> **Prerequisites:** basic C++ (functions, loops, `std::string`, `std::vector`).

**The running example problem:**
> *Given a string, return the index of the **first character that appears only once**. If every character repeats, return −1.*
> `"leetcode"` → 0 (`l`), `"loveleetcode"` → 2 (`v`), `"aabb"` → −1.

## Table of Contents
1. [Understand the problem](#1-understand-the-problem)
2. [Break it down](#2-break-it-down)
3. [Solve a simpler problem](#3-solve-a-simpler-problem)
4. [Look for patterns](#4-look-for-patterns)
5. [Make a plan](#5-make-a-plan)
6. [Implement the plan](#6-implement-the-plan)
7. [Test your solution](#7-test-your-solution)
8. [Cheat sheet](#cheat-sheet)

---

## 1. Understand the problem

**In one sentence:** before writing any code, make sure you know **exactly** what goes in, what comes out, and what the edge cases are — by restating the problem, asking questions, and working through examples by hand.

### In plain words
A taxi driver who starts driving before hearing the full address will go the wrong way fast. Most failed interview answers aren't bad code — they're correct code for the **wrong problem**.

### How it works
1. **Restate** the problem in your own words ("so I scan left to right and want the earliest letter whose total count is 1").
2. Identify **inputs** (type, size, range: can it be empty? Unicode? uppercase?) and **outputs** (index? character? what if none?).
3. **Ask clarifying questions:** constraints (length up to 10⁵?), character set, case sensitivity, performance expectations.
4. **Work examples by hand**, including **edge cases:** empty string, one character, all repeating, the answer at the end.
5. Write the examples down — they become your tests later.

### Modern C++ example — examples captured as executable expectations
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Example { std::string input; int expected; std::string why; };

int main() {
    // Written BEFORE any solution exists: this is our understanding of the problem.
    const std::vector<Example> examples{
        {"leetcode", 0, "'l' appears once and is first"},
        {"loveleetcode", 2, "'l' and 'o' repeat; 'v' is the first unique"},
        {"aabb", -1, "everything repeats"},
        {"", -1, "edge case: empty input"},
        {"z", 0, "edge case: single character"},
        {"aab", 2, "edge case: answer is the last character"},
    };
    for (const auto& e : examples)
        std::cout << '"' << e.input << "\" -> " << e.expected << "   (" << e.why << ")\n";
}
```

**Output:**
```text
"leetcode" -> 0   ('l' appears once and is first)
"loveleetcode" -> 2   ('l' and 'o' repeat; 'v' is the first unique)
"aabb" -> -1   (everything repeats)
"" -> -1   (edge case: empty input)
"z" -> 0   (edge case: single character)
"aab" -> 2   (edge case: answer is the last character)
```

### Interview answer
"I start by restating the problem, clarifying inputs, outputs and constraints, and working through normal and edge-case examples by hand; those examples later become my test cases."

---

## 2. Break it down

**In one sentence:** split the problem into **smaller sub-problems** that are each easy to solve and test on their own.

### In plain words
"Clean the whole house" is overwhelming. "Vacuum the living room, wash dishes, take out trash" are each easy. Big problems become manageable when you name their parts.

### How it works
Ask: "What smaller questions must I answer to solve this?" For our problem:
1. **How many times does each character appear?** (counting)
2. **Which position is the first one whose count is 1?** (searching)

Each sub-problem becomes a **function** with a clear name, input and output. This also makes the code more readable and testable (see [Modular programming](./Coding-Best-Practices.md#1-modular-programming)).

### Modern C++ example — two helper functions, each testable alone
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <iostream>
#include <string_view>

// Sub-problem 1: count occurrences of each character
std::array<int, 256> count_chars(std::string_view s) {
    std::array<int, 256> counts{};
    for (unsigned char c : s) ++counts[c];
    return counts;
}

// Sub-problem 2: first position whose character has count == 1
int first_with_count_one(std::string_view s, const std::array<int, 256>& counts) {
    for (std::size_t i = 0; i < s.size(); ++i)
        if (counts[static_cast<unsigned char>(s[i])] == 1) return static_cast<int>(i);
    return -1;
}

int main() {
    auto counts = count_chars("loveleetcode");
    std::cout << "count of 'e': " << counts['e'] << ", count of 'v': " << counts['v'] << '\n';   // test part 1
    std::cout << "first unique: " << first_with_count_one("loveleetcode", counts) << '\n';        // test part 2
}
```

**Output:**
```text
count of 'e': 4, count of 'v': 1
first unique: 2
```

### Interview answer
"I decompose the problem into independent sub-problems with clear inputs and outputs — here, counting characters and then finding the first with count one — and implement each as a small, testable function."

---

## 3. Solve a simpler problem

**In one sentence:** if the full problem is hard, first solve an **easier version** (smaller input, fewer constraints, a brute-force approach), then improve it.

### In plain words
Learning to ride a bike with training wheels first. A correct slow solution is a stepping stone *and* a safety net: it tells you what the right answers are while you build the fast one.

### How it works
Ways to simplify:
- **Brute force first:** the most obvious (maybe slow) solution.
- **Smaller input:** "what if the string had only 2 characters?"
- **Drop a constraint:** "what if we only needed *whether* a unique character exists?"
- **Special case:** "only lowercase letters".

For our problem, the brute force is: *for each character, count how often it appears in the whole string* — O(n²), but obviously correct.

### Modern C++ example — brute force (correct, but slow)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string_view>

// Simplest correct idea: for each position, count that character across the whole string.
int first_unique_brute_force(std::string_view s) {
    for (std::size_t i = 0; i < s.size(); ++i)
        if (std::ranges::count(s, s[i]) == 1)          // scans the whole string again: O(n) each time
            return static_cast<int>(i);
    return -1;
}

int main() {
    for (std::string_view s : {"leetcode", "loveleetcode", "aabb"})
        std::cout << s << " -> " << first_unique_brute_force(s) << '\n';
}
```

**Output:**
```text
leetcode -> 0
loveleetcode -> 2
aabb -> -1
```
It's O(n²): fine for 100 characters, too slow for 10⁶. But now we have a **reference** to check faster versions against.

### Interview answer
"When stuck, I solve a simpler version — usually the brute force, or the problem with a relaxed constraint — to get a correct baseline, understand the structure, and then optimize, using the baseline to verify the faster solution."

---

## 4. Look for patterns

**In one sentence:** look for **repeated work** in your simple solution and for **similarities to problems you've solved before**; both point to a better approach.

### In plain words
If you notice you keep walking to the same shop for one item at a time, you start making a shopping list. If a new puzzle looks like one you've solved before, you reuse the trick.

### How it works
- **Spot repeated work:** the brute force recounts the same characters again and again. Counting **once** and remembering the results removes that repetition → precompute + store (a frequency table / hash map).
- **Recognize known problem families:** "count things then query" → frequency map; "first/earliest" → scan in order; "pairs that sum to X" → hash set; "range of elements" → sliding window/prefix sums; "sorted input" → binary search/two pointers.
- **Look at the examples you wrote:** what do the answers have in common?
- Common "patterns" questions to ask: Can I sort it? Can I precompute? Can I use extra memory to save time? Is there a monotonic property?

### Modern C++ example — seeing the repeated work, then removing it
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <unordered_map>

int main() {
    const std::string s = "loveleetcode";

    // Pattern spotted: brute force counts the same letters over and over.
    long brute_steps = 0;
    int times_e_was_recounted = 0;
    for (std::size_t i = 0; i < s.size(); ++i) {
        int count = 0;
        for (std::size_t j = 0; j < s.size(); ++j) { ++brute_steps; count += s[i] == s[j]; }
        if (s[i] == 'e') ++times_e_was_recounted;           // same answer (4) computed again and again
    }
    std::cout << "brute force inspects " << brute_steps << " characters (n * n) and counts 'e' "
              << times_e_was_recounted << " separate times\n";

    // Fix: count ONCE into a frequency map ("count, then query" pattern).
    std::unordered_map<char, int> freq;
    for (char c : s) ++freq[c];
    std::cout << "frequency map built in " << s.size() << " steps; e appears " << freq['e'] << " times\n";
}
```

**Output:**
```text
brute force inspects 144 characters (n * n) and counts 'e' 4 separate times
frequency map built in 12 steps; e appears 4 times
```

### Interview answer
"I look for repeated computation in the brute force and for similarity to known problem patterns — frequency maps, two pointers, sliding windows, sorting, prefix sums. Here the repeated counting suggests counting once into a frequency table, trading O(1)-ish extra memory for linear time."

---

## 5. Make a plan

**In one sentence:** before coding, write the approach as **steps or pseudocode**, check it against your examples, and state its time and space **complexity**.

### In plain words
An architect draws the blueprint before the builders pour concrete. Fixing a mistake on paper costs seconds; fixing it in code costs minutes; fixing it in production costs days.

### How it works
1. Write numbered steps or pseudocode (in an interview, say them out loud).
2. **Dry-run** the plan on 1–2 examples by hand, including an edge case.
3. State **complexity** (see [Complexity Analysis](./Complexity-Analysis.md)): our plan is **O(n) time**, **O(1) space** (the alphabet is fixed size: 256 counters).
4. Get agreement (interviewer or teammate) before implementing.

Plan for our problem:
```
1. counts[256] = all zeros
2. for each char c in s: counts[c] += 1                  (first pass)
3. for i from 0 to len(s)-1: if counts[s[i]] == 1 return i   (second pass, in order)
4. return -1
```

### Modern C++ example — the plan as comments, dry-run printed step by step
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <iostream>
#include <string_view>

int main() {
    std::string_view s = "aab";                        // dry-run on an edge case
    // Step 1: zeroed counters
    std::array<int, 256> counts{};
    // Step 2: first pass - count
    for (unsigned char c : s) ++counts[c];
    std::cout << "after pass 1: a=" << counts['a'] << " b=" << counts['b'] << '\n';
    // Step 3: second pass - first index with count 1
    for (std::size_t i = 0; i < s.size(); ++i) {
        std::cout << "  i=" << i << " '" << s[i] << "' count=" << counts[static_cast<unsigned char>(s[i])] << '\n';
        if (counts[static_cast<unsigned char>(s[i])] == 1) { std::cout << "answer: " << i << '\n'; return 0; }
    }
    // Step 4: not found
    std::cout << "answer: -1\n";
}
```

**Output:**
```text
after pass 1: a=2 b=1
  i=0 'a' count=2
  i=1 'a' count=2
  i=2 'b' count=1
answer: 2
```

### Interview answer
"I write the algorithm as pseudocode, dry-run it on examples including edge cases, and state its time and space complexity — here two linear passes, O(n) time and O(1) space for a fixed alphabet — before writing real code."

---

## 6. Implement the plan

**In one sentence:** translate the plan into **clean, readable code** — good names, small functions, handled edge cases — and talk through it as you write.

### In plain words
Now the builders follow the blueprint. Because the plan is clear, writing the code is mostly translation, not invention.

### How it works
- Follow the plan step by step; don't redesign mid-typing unless the plan was wrong (then go back to step 5).
- Use clear names (`counts`, `first_unique_index`), the standard library, `const`, correct types (`std::size_t` for sizes, `unsigned char` when indexing by character).
- Handle edge cases explicitly (empty string works naturally here).
- In interviews: narrate what you're writing and why.

### Modern C++ example — the final solution
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <iostream>
#include <string_view>

// Returns the index of the first character that occurs exactly once, or -1.
// Time O(n), extra space O(1) (256 counters regardless of input size).
[[nodiscard]] int first_unique_index(std::string_view s) {
    std::array<int, 256> counts{};
    for (unsigned char c : s) ++counts[c];
    for (std::size_t i = 0; i < s.size(); ++i)
        if (counts[static_cast<unsigned char>(s[i])] == 1) return static_cast<int>(i);
    return -1;
}

int main() {
    std::cout << first_unique_index("leetcode") << ' '
              << first_unique_index("loveleetcode") << ' '
              << first_unique_index("aabb") << '\n';
}
```

**Output:**
```text
0 2 -1
```

### Interview answer
"I implement the agreed plan with clear names, small functions and explicit edge-case handling, narrating as I go, and I return to planning rather than improvising if the plan turns out to be wrong."

---

## 7. Test your solution

**In one sentence:** prove the code works by running it on your examples, **edge cases**, and — when possible — comparing it against the brute-force solution on many random inputs.

### In plain words
A chef tastes the dish before serving it. Testing catches the mistakes your brain skipped over. In interviews, walking through tests *yourself* before the interviewer asks is a strong signal.

### How it works
1. **Dry-run** the code (not the plan) on a normal example.
2. Run all the examples from step 1, especially **edge cases**: empty, single element, all same, answer at the start/end, maximum size.
3. **Randomized differential testing** ("fuzzing against a reference"): generate random inputs, compare the fast solution with the brute force from step 3. Any mismatch is a bug with a ready-made reproducer.
4. In real projects: keep these as **unit tests** (GoogleTest, Catch2, doctest) so they run on every change (see [Testing](./Coding-Best-Practices.md#6-testing)).

### Modern C++ example — example tests + randomized comparison against the brute force
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <array>
#include <iostream>
#include <random>
#include <string>
#include <string_view>
#include <vector>

int first_unique_index(std::string_view s) {
    std::array<int, 256> counts{};
    for (unsigned char c : s) ++counts[c];
    for (std::size_t i = 0; i < s.size(); ++i)
        if (counts[static_cast<unsigned char>(s[i])] == 1) return static_cast<int>(i);
    return -1;
}
int brute_force(std::string_view s) {
    for (std::size_t i = 0; i < s.size(); ++i)
        if (std::ranges::count(s, s[i]) == 1) return static_cast<int>(i);
    return -1;
}

int main() {
    // 1) Hand-written examples and edge cases (from step 1)
    const std::vector<std::pair<std::string, int>> cases{
        {"leetcode", 0}, {"loveleetcode", 2}, {"aabb", -1}, {"", -1}, {"z", 0}, {"aab", 2}};
    int failures = 0;
    for (const auto& [input, expected] : cases)
        if (int got = first_unique_index(input); got != expected) {
            ++failures;
            std::cout << "FAIL: \"" << input << "\" expected " << expected << " got " << got << '\n';
        }
    std::cout << cases.size() - failures << "/" << cases.size() << " example tests passed\n";

    // 2) Randomized differential testing against the brute force
    std::mt19937 rng(2024);
    std::uniform_int_distribution<int> len(0, 12), letter('a', 'e');   // small alphabet -> many repeats
    int mismatches = 0;
    for (int t = 0; t < 10'000; ++t) {
        std::string s(len(rng), ' ');
        for (char& c : s) c = static_cast<char>(letter(rng));
        if (first_unique_index(s) != brute_force(s)) ++mismatches;
    }
    std::cout << "10000 random tests, mismatches vs brute force: " << mismatches << '\n';
}
```

**Output:**
```text
6/6 example tests passed
10000 random tests, mismatches vs brute force: 0
```

### Interview answer
"I test by dry-running the code, running normal and edge cases — empty, single element, all duplicates, answer at the boundaries — and, where possible, comparing against a brute-force reference on many random inputs. In production these become automated unit tests."

---

## Cheat sheet

| Step | Ask yourself | Output |
|---|---|---|
| 1. Understand | What are the inputs, outputs, constraints, edge cases? | Written examples |
| 2. Break down | What smaller questions must I answer? | Helper functions |
| 3. Simplify | What's the brute force / easier version? | Correct baseline |
| 4. Patterns | Where's the repeated work? Seen this before? | Better idea |
| 5. Plan | Steps, dry-run, complexity? | Pseudocode + Big O |
| 6. Implement | Clean translation of the plan | Readable code |
| 7. Test | Examples, edge cases, random vs brute force | Confidence |
