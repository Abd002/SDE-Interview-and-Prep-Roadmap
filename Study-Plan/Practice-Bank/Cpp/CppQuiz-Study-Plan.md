# CppQuiz: how to get every question right in modern C++

[CppQuiz](https://cppquiz.org/) asks one thing: **what does this program do according to the C++ standard?**
- **Standard:** answers follow **C++23**.
- **Answer types:** most answers are the exact output. Some are *compile error*, *undefined behavior* or *unspecified/implementation-defined*.
- **Scoring:** a hint costs half a point, and every wrong try halves the points for that question, so think it through before you type ([CppQuiz help](https://cppquiz.org/quiz/help)).
- **Size:** question numbers go past 400, with some numbers unpublished.

You can't learn it by memorising answers. You learn the **rules** that the questions test, then use the quiz to prove you know them. The answers can't be copied into the [Practice Bank](../README.md) (see its §3), so this page is the plan instead.

---

## 1. The rules CppQuiz tests

Learn these 12 areas. Each line ends with where to read it: [learncpp](https://www.learncpp.com/) for the first pass, then [cppreference](https://en.cppreference.com/w/cpp/language) and the [standard draft](https://eel.is/c++draft/) for the exact rule.

| # | Area | What to know cold | Read |
|---|---|---|---|
| 1 | **Initialization** | default vs value vs zero vs aggregate vs list initialization; the most vexing parse; narrowing in `{}`; `auto x{1}` vs `auto x = {1}` | cppreference: *Initialization* |
| 2 | **Object lifetime and special members** | construction order (bases, then members in declaration order) and reverse destruction; when the compiler declares, deletes or omits copy/move members; rule of 0/3/5; guaranteed copy elision (C++17); lifetime extension of temporaries | cppreference: *Lifetime*, *Copy elision*, *Rule of three/five/zero* |
| 3 | **Overload resolution** | ranking: exact match > promotion > conversion > user-defined; template vs non-template ties; `T&&` vs `const T&`; `0`, `nullptr`, `bool` and `char` conversions | cppreference: *Overload resolution*, *Implicit conversions* |
| 4 | **Templates** | argument deduction, forwarding references and reference collapsing; full specialization vs overloading of function templates; partial ordering; two-phase lookup and dependent names; SFINAE and concepts | cppreference: *Template argument deduction*, *Function template* |
| 5 | **Name lookup** | argument-dependent lookup (ADL); a derived-class name hides all base overloads; `using` declarations | cppreference: *ADL*, *Unqualified name lookup* |
| 6 | **Inheritance and virtual functions** | virtual calls inside constructors and destructors; default arguments bind statically; object slicing; virtual destructors; virtual and multiple inheritance order | cppreference: *Virtual function specifier*, *Derived classes* |
| 7 | **Expressions** | order of evaluation and the C++17 sequencing rules; integer promotions and usual arithmetic conversions; signed overflow is UB, unsigned wraps; shifts; precedence; short-circuit; the comma operator | cppreference: *Order of evaluation*, *Arithmetic operators* |
| 8 | **Static storage** | static local initialization (once, thread-safe); static initialization order across files; `inline` variables; ODR | cppreference: *Storage duration*, *Initialization* |
| 9 | **Exceptions** | stack unwinding order; `noexcept` + throw = `std::terminate`; exceptions from destructors; function-try-blocks | cppreference: *Exceptions*, *noexcept* |
| 10 | **Lambdas** | capture by value happens at creation; `mutable`; init-captures; generic lambdas; capturing `this` | cppreference: *Lambda expressions* |
| 11 | **Pointers, arrays and strings** | array-to-pointer decay; `sizeof` of arrays vs pointers; string literals; how `std::cout` prints `char`, `signed char`, `uint8_t`, `bool` | cppreference: *Array declaration*, *operator<<* |
| 12 | **UB vs unspecified vs implementation-defined** | which is which. For UB the answer is "undefined behavior" even when your compiler prints something plausible | cppreference: *Undefined behavior* |

Also know the modern features: structured bindings, `if constexpr`, `constexpr`/`consteval`, `auto` vs `decltype(auto)`, that `std::move` doesn't move anything, the spaceship operator `<=>`, and `[[nodiscard]]`. There is a one-page summary of C++11 to C++23 in [modern-cpp-features](https://github.com/AnthonyCalandra/modern-cpp-features).

---

## 2. The loop for every question

1. **Read the code and predict without running it.** Write one line on the rule you think applies, for example "overload resolution: promotion beats conversion".
2. **Answer on the site.** If you're wrong, don't guess again; go to step 3 first.
3. **Check it in [Compiler Explorer](https://godbolt.org/)** with both GCC and Clang, using `-std=c++23 -Wall -Wextra -pedantic -fsanitize=address,undefined`.
   - If the two compilers disagree, or a sanitizer fires, suspect UB or implementation-defined behavior.
4. **Look in [C++ Insights](https://cppinsights.io/).** It shows the code the compiler adds for you: implicit conversions, generated special members, lambda classes, range-for loops.
5. **Read CppQuiz's explanation** and the standard section it cites. The section numbers work in [eel.is/c++draft](https://eel.is/c++draft/).
6. **Log it.** Keep one row per miss in `Career-Roadmap/Knowledge-Check.md` (or a sheet): question number, area from §1, the rule in one line. Retry it after 1, 3, 7 and 21 days.

---

## 3. Schedule

| Phase | What | How long |
|---|---|---|
| A. Foundations | Read areas 1–7 of §1 on learncpp and cppreference, and work through the learncpp quizzes in this bank ([learncpp chapter quizzes](learncpp-chapter-quizzes/README.md)) | 2–3 weeks, alongside the plan |
| B. Training mode | CppQuiz *training mode*: 10 random questions a day, using the loop in §2 | Until you've seen every published question (about 6–8 weeks at 10 a day) |
| C. Book | [C++ Brain Teasers](https://pragprog.com/titles/akbrain/c-brain-teasers/) by Anders Schau Knatten, the author of CppQuiz: 25 puzzles with long explanations of initialization, overload resolution and conversions | 1 puzzle a day |
| D. Fixed quizzes | Do full 10-question quizzes in one sitting. The target is 9/10 or better with no hints, three times in a row | Weekly |
| E. Review | Redo every logged miss on its review day | Ongoing (weekly self-exam, step 134.1) |

**Where it sits in the study plan:**
- **Step 29.8:** start phase A and 20 training questions.
- **Step 120.1:** phases B–C at full speed.
- **After that:** phase D and E inside the weekly self-exam.

**Talks for weak areas:** CppCon's *Back to Basics* track has one talk per area in §1 (initialization, move semantics, templates, lambdas, overload resolution). Search the [CppCon channel](https://www.youtube.com/@CppCon) for "Back to Basics" plus the area. The [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) explain how to write code that avoids most of these traps.
