# Regular Expressions — Explained for Beginners

> **What you'll learn:** what regular expressions (regex) are, the building blocks (literals, character classes, quantifiers, anchors, groups, alternation, lookahead), how regex engines work and how they can blow up, and how to use them in C++ with `<regex>`.
>
> **Prerequisites:** basic C++ strings.

## Table of Contents
1. [What is a regular expression?](#1-what-is-a-regular-expression)
2. [Building blocks](#2-building-blocks)
3. [Groups, captures and alternation](#3-groups-captures-and-alternation)
4. [Greedy vs. lazy, and lookahead](#4-greedy-vs-lazy-and-lookahead)
5. [Using regex in C++ (`std::regex`)](#5-using-regex-in-c-stdregex)
6. [How regex engines work (and catastrophic backtracking)](#6-how-regex-engines-work-and-catastrophic-backtracking)
7. [Cheat sheet](#cheat-sheet)

---

## 1. What is a regular expression?

**In one sentence:** a regular expression is a small pattern language for describing **sets of strings**, used to search, validate, extract and replace text.

### In plain words
"Find every word that starts with a capital letter and ends with 'ing'" or "is this a valid date like 2024-03-15?" Writing loops for that by hand is tedious. A regex is a compact **search description**: `\d{4}-\d{2}-\d{2}` reads as "4 digits, dash, 2 digits, dash, 2 digits". It's like the "find" box in your editor, but super-powered.

### How it works
- A regex engine takes a **pattern** and a **text** and answers: does it match? Where? What parts?
- Three typical operations:
  1. **Match** the whole string (validation): "is this an email?"
  2. **Search** for a match anywhere (extraction): "find all phone numbers in this document".
  3. **Replace** matches (transformation): "change all dates to DD/MM/YYYY".
- Used everywhere: `grep`, editors (VS Code, Vim), log analysis, input validation, tokenizers, web frameworks' URL routing.

---

## 2. Building blocks

**In one sentence:** a regex is built from literal characters plus special **metacharacters** that mean "any of these", "repeat this", or "at this position".

### How it works
**Literals:** `cat` matches exactly "cat". To match a special character literally, escape it: `\.` `\*` `\?` `\(`.

**Character classes — "one character from a set":**
| Pattern | Matches |
|---|---|
| `.` | Any character except newline |
| `[abc]` | `a`, `b` or `c` |
| `[a-z]` | Any lowercase letter |
| `[^0-9]` | Anything **except** a digit |
| `\d` / `\D` | A digit / a non-digit |
| `\w` / `\W` | A word char `[A-Za-z0-9_]` / non-word char |
| `\s` / `\S` | Whitespace (space, tab, newline) / non-whitespace |

**Quantifiers — "how many times" (applies to the thing just before):**
| Pattern | Meaning |
|---|---|
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 (optional) |
| `{3}` | Exactly 3 |
| `{2,5}` | 2 to 5 |
| `{2,}` | 2 or more |

**Anchors — "a position, not a character":**
| Pattern | Position |
|---|---|
| `^` | Start of the string (or line) |
| `$` | End of the string (or line) |
| `\b` | Word boundary (between `\w` and `\W`) |

Examples:
- `^\d{3}-\d{4}$` → a whole string like `555-1234`.
- `colou?r` → `color` or `colour`.
- `\bcat\b` → the word "cat", but not "concatenate".

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <string>

int main() {
    const std::regex phone(R"(^\d{3}-\d{4}$)");       // raw string R"(...)": no double escaping!
    const std::regex color(R"(colou?r)");
    const std::regex word_cat(R"(\bcat\b)");

    std::cout << std::boolalpha;
    for (const char* s : {"555-1234", "5551234", "555-12345"})
        std::cout << s << " is a phone number? " << std::regex_match(s, phone) << '\n';

    std::cout << "color/colour: " << std::regex_search("British colour", color)
              << ' ' << std::regex_search("US color", color) << '\n';
    std::cout << "'cat' as a word in 'the cat sat': " << std::regex_search("the cat sat", word_cat) << '\n';
    std::cout << "'cat' as a word in 'concatenate': " << std::regex_search("concatenate", word_cat) << '\n';
}
```

**Output:**
```text
555-1234 is a phone number? true
5551234 is a phone number? false
555-12345 is a phone number? false
color/colour: true true
'cat' as a word in 'the cat sat': true
'cat' as a word in 'concatenate': false
```

### Common mistakes
- Forgetting to escape `.` — `3.14` also matches `3x14`. Use `3\.14`.
- In normal C++ strings you need `"\\d"`; use **raw strings** `R"(\d)"` to avoid double escaping.
- Forgetting anchors in validation: `\d{3}` "matches" inside `abc12345` when searching.

---

## 3. Groups, captures and alternation

**In one sentence:** parentheses `( )` group parts of a pattern so you can apply quantifiers to them and **capture** the text they matched; `|` means "or".

### In plain words
Parentheses are like highlighting parts of a sentence with a marker: "find a date, and **highlight** the year, the month and the day separately so I can use them." Alternation `|` is a menu: `cat|dog` = "cat or dog".

### How it works
| Pattern | Meaning |
|---|---|
| `(abc)+` | Group: "abc" repeated one or more times |
| `(\d{4})-(\d{2})` | Capture groups 1 and 2 |
| `(?:abc)` | Group **without** capturing (just for structure) |
| `cat\|dog` | cat or dog |
| `gr(a\|e)y` | gray or grey |
| `\1` | **Backreference**: the same text group 1 matched (e.g. `(\w)\1` = a doubled letter) |

In replacement strings (ECMAScript syntax used by `std::regex_replace`), `$1`, `$2` refer to captured groups.

### Modern C++ example — extract and rearrange dates
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <string>

int main() {
    const std::string log = "Deploys: 2024-03-15 ok, 2024-04-02 failed, 2024-05-20 ok";
    const std::regex date(R"((\d{4})-(\d{2})-(\d{2}))");     // 3 capture groups

    // Iterate over every match and read its groups.
    for (auto it = std::sregex_iterator(log.begin(), log.end(), date);
         it != std::sregex_iterator(); ++it) {
        const std::smatch& m = *it;
        std::cout << "full: " << m[0] << "  year: " << m[1]
                  << "  month: " << m[2] << "  day: " << m[3] << '\n';
    }

    // Rearrange with backreferences in the replacement: YYYY-MM-DD -> DD/MM/YYYY
    std::cout << std::regex_replace(log, date, "$3/$2/$1") << '\n';

    // Alternation + backreference: find doubled words like "the the"
    const std::regex doubled(R"(\b(\w+) \1\b)");
    std::smatch m;
    std::string text = "this is the the best";
    if (std::regex_search(text, m, doubled)) std::cout << "doubled word: '" << m[1] << "'\n";
}
```

**Output:**
```text
full: 2024-03-15  year: 2024  month: 03  day: 15
full: 2024-04-02  year: 2024  month: 04  day: 02
full: 2024-05-20  year: 2024  month: 05  day: 20
Deploys: 15/03/2024 ok, 02/04/2024 failed, 20/05/2024 ok
doubled word: 'the'
```

### Common mistakes
- `^cat|dog$` means `(^cat)|(dog$)`, not `^(cat|dog)$`. Alternation has the lowest priority — group it.

---

## 4. Greedy vs. lazy, and lookahead

**In one sentence:** quantifiers are **greedy** by default (grab as much as possible); adding `?` makes them **lazy** (grab as little as possible); **lookahead** `(?=...)` checks what comes next without consuming it.

### In plain words
- **Greedy:** at a buffet, you fill your plate as much as possible, then put things back only if you must.
- **Lazy:** you take the smallest bite that satisfies the rule.
- **Lookahead:** peeking around a corner without stepping forward.

### How it works
Text: `<b>bold</b> and <i>italic</i>`
- `<.+>` (greedy) matches `<b>bold</b> and <i>italic</i>` — everything from the first `<` to the **last** `>`.
- `<.+?>` (lazy) matches `<b>` — stops at the **first** `>`.

Lookarounds:
| Pattern | Meaning | In `std::regex`? |
|---|---|---|
| `X(?=Y)` | X followed by Y (positive lookahead) | ✅ |
| `X(?!Y)` | X **not** followed by Y (negative lookahead) | ✅ |
| `(?<=Y)X` | X preceded by Y (lookbehind) | ❌ (not in ECMAScript mode of `std::regex`; available in PCRE, Python, JS 2018+) |

Classic use of lookahead: password rules — "at least one digit **and** at least one uppercase letter **and** 8+ chars": `^(?=.*\d)(?=.*[A-Z]).{8,}$`.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <string>

int main() {
    const std::string html = "<b>bold</b> and <i>italic</i>";
    std::smatch m;

    std::regex_search(html, m, std::regex("<.+>"));
    std::cout << "greedy: " << m[0] << '\n';
    std::regex_search(html, m, std::regex("<.+?>"));
    std::cout << "lazy:   " << m[0] << '\n';

    const std::regex strong_password(R"(^(?=.*\d)(?=.*[A-Z]).{8,}$)");
    std::cout << std::boolalpha;
    for (const char* pw : {"password", "Password", "Passw0rd", "P4ss"})
        std::cout << pw << " strong? " << std::regex_match(pw, strong_password) << '\n';

    // Negative lookahead: numbers NOT followed by '%'
    const std::string report = "growth 15% on 300 users, 7% churn, 42 new";
    const std::regex plain_number(R"(\b\d+\b(?!%))");
    std::cout << "plain numbers:";
    for (auto it = std::sregex_iterator(report.begin(), report.end(), plain_number);
         it != std::sregex_iterator(); ++it)
        std::cout << ' ' << it->str();
    std::cout << '\n';
}
```

**Output:**
```text
greedy: <b>bold</b> and <i>italic</i>
lazy:   <b>
password strong? false
Password strong? false
Passw0rd strong? true
P4ss strong? false
plain numbers: 300 42
```

### Common mistakes
- Parsing HTML/JSON with regex. Nested structures are beyond what regular expressions can reliably describe — use a real parser.

---

## 5. Using regex in C++ (`std::regex`)

**In one sentence:** `<regex>` (C++11) provides `std::regex` for patterns and `regex_match`, `regex_search`, `regex_replace` and `sregex_iterator` to use them.

### How it works
| Function | Use |
|---|---|
| `std::regex_match(s, re)` | Does the **entire** string match? (validation) |
| `std::regex_search(s, m, re)` | Is there a match **anywhere**? Fills `std::smatch m` with groups |
| `std::regex_replace(s, re, fmt)` | Replace every match (`$1`… for groups) |
| `std::sregex_iterator` | Loop over all matches |
| `std::sregex_token_iterator` | Split a string by a pattern (use `-1` for "the parts between matches") |
| Flags | `std::regex::icase` (ignore case), `std::regex::optimize`, grammar choice (`ECMAScript` default) |

**Performance notes:**
- **Construct a `std::regex` once and reuse it** — compiling a pattern is expensive. Make it `static const`.
- `std::regex` is known to be slow compared to alternatives; for hot paths consider RE2 (Google), PCRE2, Boost.Regex, Hyperscan, or compile-time regex (CTRE library).

### Modern C++ example — validate, split and case-insensitive search
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <regex>
#include <string>
#include <vector>

bool is_valid_email(const std::string& s) {
    // Compiled ONCE (static), reused on every call. Simplified on purpose.
    static const std::regex email(R"(^[\w.+-]+@[\w-]+(\.[\w-]+)+$)");
    return std::regex_match(s, email);
}

std::vector<std::string> split(const std::string& s, const std::regex& sep) {
    return {std::sregex_token_iterator(s.begin(), s.end(), sep, -1),   // -1: the gaps
            std::sregex_token_iterator()};
}

int main() {
    std::cout << std::boolalpha;
    for (const char* e : {"ana@example.com", "bob.smith+tag@mail.co.uk", "not-an-email", "x@y"})
        std::cout << e << " -> " << is_valid_email(e) << '\n';

    for (const auto& part : split("a, b;c  ;  d", std::regex(R"(\s*[,;]\s*)")))
        std::cout << '[' << part << ']';
    std::cout << '\n';

    const std::regex error_word("error", std::regex::icase);
    std::cout << "found ERROR case-insensitively: " << std::regex_search("Fatal ERROR here", error_word) << '\n';
}
```

**Output:**
```text
ana@example.com -> true
bob.smith+tag@mail.co.uk -> true
not-an-email -> false
x@y -> false
[a][b][c][d]
found ERROR case-insensitively: true
```
(Real email validation is famously complicated — in practice, check for a basic shape and send a confirmation email.)

---

## 6. How regex engines work (and catastrophic backtracking)

**In one sentence:** most regex engines (including `std::regex`, PCRE, Java, Python, JavaScript) try possibilities one by one and **backtrack** on failure, which is flexible but can take **exponential time** on certain patterns; others (RE2, Rust `regex`, Go) use automata that guarantee linear time.

### In plain words
Finding your way through a maze by trying a path, and when you hit a dead end, walking back to the last fork and trying the next one. Usually fine. But some mazes have so many forks that trying every combination would take longer than the age of the universe.

### How it works
- In theory, "regular" expressions can be compiled to a **finite automaton** (NFA → DFA) that reads each character once → **O(n)** time. This is what RE2, Rust, Go and `grep` do.
- Features like **backreferences** and lookaround aren't "regular" in the math sense; supporting them pushes most engines to use **backtracking**.
- **Catastrophic backtracking:** nested quantifiers like `(a+)+$` or `(a|a)*` on input `"aaaa...ab"` make the engine try exponentially many ways to split the `a`s before failing. This is behind real outages and **ReDoS** (Regular expression Denial of Service) attacks — e.g. the 2019 Cloudflare outage.
- Defenses: avoid nested quantifiers over the same characters; make alternatives mutually exclusive; limit input length; use a linear-time engine (RE2) for untrusted input; use timeouts.

### Modern C++ example — measuring exponential blow-up
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <regex>
#include <string>

int main() {
    const std::regex dangerous("(a+)+b");      // nested quantifiers: exponential on failure
    const std::regex safe("a+b");               // same meaning, no nesting: linear

    for (int n : {14, 16, 18}) {
        std::string input(n, 'a');              // "aaaa...a" with NO 'b' -> must fail
        auto time_it = [&](const std::regex& re) {
            auto t0 = std::chrono::steady_clock::now();
            bool matched = std::regex_match(input, re);
            auto us = std::chrono::duration_cast<std::chrono::microseconds>(
                          std::chrono::steady_clock::now() - t0).count();
            return std::pair{matched, us};
        };
        auto [m1, t1] = time_it(dangerous);
        auto [m2, t2] = time_it(safe);
        std::cout << "n=" << n << ": (a+)+b took " << t1 << " us, a+b took " << t2
                  << " us (both matched=" << (m1 || m2) << ")\n";
    }
}
```

**Output (may vary):**
```text
n=14: (a+)+b took 1905 us, a+b took 3 us (both matched=0)
n=16: (a+)+b took 7702 us, a+b took 2 us (both matched=0)
n=18: (a+)+b took 31046 us, a+b took 3 us (both matched=0)
```
Each extra 2 characters multiplies the dangerous pattern's time by ~4 — at 40 characters it would take hours.

### Interview answer
"A regular expression describes a regular language using literals, character classes, quantifiers, anchors, groups and alternation. Truly regular patterns can be matched in linear time with finite automata, as RE2 does, but backtracking engines — used by most languages to support backreferences and lookarounds — can take exponential time on patterns with nested quantifiers, enabling ReDoS. In C++ I compile `std::regex` once, use raw strings, and prefer RE2 or CTRE for performance-critical or untrusted input."

---

## Cheat sheet

| Syntax | Meaning |
|---|---|
| `.` `\d` `\w` `\s` | any char, digit, word char, whitespace |
| `[abc]` `[^abc]` `[a-z]` | set, negated set, range |
| `*` `+` `?` `{n,m}` | 0+, 1+, 0–1, n to m |
| `*?` `+?` | lazy versions |
| `^` `$` `\b` | start, end, word boundary |
| `( )` `(?: )` `\1` | capture, non-capture group, backreference |
| `a\|b` | alternation |
| `(?=X)` `(?!X)` | lookahead, negative lookahead |
| C++ | `regex_match` (whole), `regex_search` (anywhere), `regex_replace`, `sregex_iterator` |
