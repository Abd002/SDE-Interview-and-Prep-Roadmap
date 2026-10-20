# Practice Bank: every review question with its official solution, in one place

> **Optional reference, not part of the study plan.** The practice steps were removed from the plan and Notion on 20 Oct 2026; this material stays here in case you want it later.

**What this is:** all the exams, homeworks, quizzes and interview-question banks from the [study plan](../README.md) and [Practice and Channels](../Practice-and-Channels.md), copied here with **the sources' own solutions** and **their figures**.
- You no longer have to hunt for PDFs, answer keys or VPN-only pages.
- **Nothing here was answered or rewritten:** every answer comes from the source itself. Each file says where it came from.
- Where a source publishes no answers, the file says so, and it was left unanswered.

**Hard vs fast:** this bank is the hard material (real exams, worked solutions). For quick question-and-answer pages to read before an interview, use [Interview-Fast-Revision.md](../Interview-Fast-Revision.md).

**Collected:** 19 Oct 2026. **Size:** about 4,000 files, 175 MB.

**How each exam folder looks**

| File | What it is |
|---|---|
| `questions.md` | The exam as text, with every figure (trees, tables, diagrams) cut out as an image in place. Ticked boxes show as ☒, empty ones as ☐. |
| `solutions.md` | The official solutions, the same way. |
| `exam.pdf`, `solutions.pdf` | The original files, for full fidelity. |
| `figures/` | The captured figures. Old scanned exams are kept as page images. |

**How to use it:**
1. Do `questions.md` (or `exam.pdf`) with no notes and a timer.
2. Grade yourself with `solutions.md`.
3. Note your score in the Notion step.

For the question banks, every answer sits in a collapsible block under its question: try first, then click.

**Contents**
2. [Everything, by topic](#2-everything-by-topic)
3. [What could not be copied, and why](#3-what-could-not-be-copied-and-why)
4. [Rebuilding the bank](#4-rebuilding-the-bank)

---

## 2. Everything, by topic

| Topic | Bank | What's in it | Answers |
|---|---|---|---|
| Databases | [CMU 15-445 homeworks](Databases/CMU-15-445-Homeworks/README.md) | 34 homeworks, Fall 2023 to Spring 2026 (HW1 SQL to HW6) | Official solutions for 31 (HW1 for Fall 2023, Spring 2024 and Spring 2026 has none published) |
| Databases | [Berkeley CS186 exams](Databases/Berkeley-CS186-Exams/README.md) | 47 midterms and finals, 1993–2018 | Official solutions for 29 |
| Databases | [PostgreSQL Exercises](Databases/pgexercises/README.md) | 71 SQL exercises with expected results | Official answer and discussion for all |
| Databases | [GfG SQL](Databases/GeeksforGeeks/sql-interview-questions.md) | 89 interview questions | Under each question |
| Operating systems | [Berkeley CS162 exams](Operating-Systems/Berkeley-CS162-Exams/README.md) | 64 midterms and finals, 1990–2019 | Official solutions for 44 |
| Operating systems | [OSTEP homework](Operating-Systems/OSTEP-Homework/README.md) | 29 chapters: the book's homework questions + the simulators | 56 answers printed by the simulators; run any other command with `-c` |
| Operating systems | [GfG OS](Operating-Systems/GeeksforGeeks/operating-systems-interview-questions.md) | 104 interview questions | Under each question |
| Distributed systems | [MIT 6.824/6.5840 quizzes](Distributed-Systems/MIT-6.5840-Quizzes/README.md) | 41 quizzes, 2002–2025 | Official solutions for 39 |
| Distributed systems | [Cambridge Concurrent and Distributed Systems](Distributed-Systems/Cambridge-Concurrent-and-Distributed-Systems/README.md) | 42 exam questions, 2010–2026 | None public (§3) |
| Networking | [Berkeley CS168 worksheets](Networking/Berkeley-CS168-Worksheets/README.md) | 12 weekly worksheets (Spring 2025) | Official solutions for all |
| Networking | [GfG networking](Networking/GeeksforGeeks/networking-interview-questions.md) | 73 interview questions | Under each question |
| C++ | [learncpp chapter quizzes](Cpp/learncpp-chapter-quizzes/README.md) | 26 chapter summaries, 183 quiz questions | Official solution under each |
| C++ | [GfG C++](Cpp/GeeksforGeeks/cpp-interview-questions.md) | 77 interview questions | Under each question |
| C++ | [CppQuiz study plan](Cpp/CppQuiz-Study-Plan.md) | How to master every [CppQuiz](https://cppquiz.org/) question: the 12 rule areas, the per-question loop, a schedule | Answers stay on the site |
| Rust | [Rustlings](Rust/rustlings/README.md) | 95 exercises | Official hint and solution for each |
| Git | [Learn Git Branching](Git/learn-git-branching/README.md) | 36 levels with their lessons | Official hint and solution for each |
| Mixed (OS, networking, Linux, Git, cloud, security, testing…) | [devops-exercises](Question-Banks/devops-exercises/README.md) | 2,082 questions in 28 topics | Answers for 1,822; the source leaves 260 unanswered |
| System design | [Hello Interview breakdowns](System-Design/hello-interview-breakdowns/README.md) | 16 free problems (15 premium ones listed) | Full worked answers with diagrams |
| System design | [System Design Primer](System-Design/system-design-primer/README.md) | The full primer + 8 system design and 6 OOD questions | Official solutions with diagrams |
| System design | [ByteByteGo System Design 101](System-Design/bytebytego-system-design-101/README.md) | 400 visual guides | Diagrams saved (395 of 397) |
| Low-level design | [awesome-low-level-design](Low-Level-Design/awesome-low-level-design/README.md) | 33 problems | Official code in Java, Python, C++, Go, C# (some TypeScript) |
| Security | [PortSwigger labs](Security/portswigger-labs/README.md) | 268 labs in 31 topics | Official solution + community video links for each |
| AI and ML | [ML Interviews Book](AI-and-ML/ml-interviews-book/README.md) | 318 questions | None: the book publishes questions only |
| Behavioral | [Tech Interview Handbook](Behavioral/tech-interview-handbook/README.md) | Question list, guides, rubrics | Answer with your own STAR stories |

---

## 3. What could not be copied, and why

| Source | Why it isn't here | What to do |
|---|---|---|
| Berkeley CS186 exams, Fall 2017 to Spring 2026 | Google Drive files that need a Google sign-in (they redirect to a login page) | Open them from <https://cs186berkeley.net/resources/> in a browser. The newest copies here are from 2018. |
| CMU 15-445 practice midterms/finals | Only on the CMU VPN | The homeworks here cover the same topics |
| Cambridge solution notes | Only for University of Cambridge users (Raven login) | Check against the lecture notes and the [DDIA ch. 9 map](../Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md) |
| CppQuiz | Answers appear only after 3 tries on the site; faking tries would corrupt its answer statistics | Play at <https://cppquiz.org/> using the [CppQuiz study plan](Cpp/CppQuiz-Study-Plan.md) |
| LeetCode (SQL 50, Concurrency) | Blocks automated access (403); problems and editorials are copyrighted and partly paid | <https://leetcode.com/studyplan/top-sql-50/> · <https://leetcode.com/problemset/concurrency/> |
| DataLemur, StrataScratch | Interactive; solutions need an account | Use the links in [Practice and Channels](../Practice-and-Channels.md) |
| Hello Interview premium breakdowns (15) | Paid content | Listed in [its README](System-Design/hello-interview-breakdowns/README.md) |
| AWS Cloud Practitioner practice set, Killercoda | Need an AWS Skill Builder login / interactive terminals | Use them on their sites |
| Exponent, interviewing.io | Paid mock interviews | Use them on their sites |
| Codeforces, CSES | Contest problems with no official solutions to collect (CSES has none; Codeforces editorials are per contest) | Practice on the sites |
| Exercism Rust | Only community solutions, no official ones | <https://exercism.org/tracks/rust> |
| MIT 6.5840 Raft lab | A lab with tests, not a question set; there is no official solution | Run it against the official tests |
| Knowledge check rounds | Not a source: Claude makes them from your Done steps | Ask Claude, as before |

---

## 4. Rebuilding the bank

The scripts in [tools/](tools/) rebuild everything from the sources:

| Script | Builds |
|---|---|
| [pdf2md.py](tools/pdf2md.py) | Converts one exam PDF to Markdown, cutting out figures as PNG files |
| [build_exams.py](tools/build_exams.py) | CMU, CS186, CS162, MIT, Cambridge and CS168 exam folders and their READMEs |
| [build_banks.py](tools/build_banks.py) | devops-exercises, System Design Primer, LLD, Rustlings, OSTEP (with simulator answers), Learn Git Branching, Tech Interview Handbook, ML Interviews Book, ByteByteGo |
| [build_web.py](tools/build_web.py) | GeeksforGeeks, learncpp, PostgreSQL Exercises, PortSwigger, Hello Interview |
| [learngitbranching_dump.js](tools/learngitbranching_dump.js) | Dumps the Learn Git Branching levels from its source code |

Needs Python 3 with `pymupdf`, `beautifulsoup4`, `markdownify` and `pillow`, plus `pdftotext`.

**Copyright:** every file names its source and author, and the open banks keep their licences (CC BY, CC BY-NC-ND, MIT, GPL-3.0). The university exams and the web pages belong to their authors; they are here for personal study.
