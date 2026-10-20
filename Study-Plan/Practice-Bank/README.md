# Practice Bank: every review question with its official solution, in one place

**What this is:** all the exams, homeworks, quizzes and interview-question banks from the [study plan](../README.md) and [Practice and Channels](../Practice-and-Channels.md), copied here with **the sources' own solutions** and **their figures**.
- You no longer have to hunt for PDFs, answer keys or VPN-only pages.
- **Nothing here was answered or rewritten:** every answer comes from the source itself. Each file says where it came from.
- Where a source publishes no answers, the file says so, and it was left unanswered.

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
1. [By study plan step](#1-by-study-plan-step)
2. [Everything, by topic](#2-everything-by-topic)
3. [What could not be copied, and why](#3-what-could-not-be-copied-and-why)
4. [Rebuilding the bank](#4-rebuilding-the-bank)

---

## 1. By study plan step

The decimal steps from the [study plan](../README.md) and Notion, with where their material now is.

| Step | What | Where it is now |
|---|---|---|
| 29.1 | CMU Fall 2024 HW2, timed, then self-grade | [questions](Databases/CMU-15-445-Homeworks/fall2024/hw2/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw2/solutions.md) |
| 29.2 | CMU Fall 2024 HW3 Q1–Q2 (hashing) | [questions](Databases/CMU-15-445-Homeworks/fall2024/hw3/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw3/solutions.md) |
| 29.3 | CS186 Midterm 1: SQL, disks/files, buffers | The Spring 2026 exam needs a Berkeley Google sign-in (§3), so use the newest copies here: [Fall 2018 MT1](Databases/Berkeley-CS186-Exams/2018-fa-mt1/questions.md) ([solutions](Databases/Berkeley-CS186-Exams/2018-fa-mt1/solutions.md)) and [Spring 2018 MT1](Databases/Berkeley-CS186-Exams/2018-sp-mt1/questions.md) ([solutions](Databases/Berkeley-CS186-Exams/2018-sp-mt1/solutions.md)). [All CS186 exams](Databases/Berkeley-CS186-Exams/README.md) |
| 29.4 | SQL drills | [PostgreSQL Exercises, 71 with answers](Databases/pgexercises/README.md) · [CMU HW1 SQL, all semesters](Databases/CMU-15-445-Homeworks/README.md) · [GfG SQL questions](Databases/GeeksforGeeks/sql-interview-questions.md) |
| 29.5 | OSTEP simulators: scheduling, paging, locks | [cpu-sched](Operating-Systems/OSTEP-Homework/cpu-sched/README.md) · [cpu-sched-mlfq](Operating-Systems/OSTEP-Homework/cpu-sched-mlfq/README.md) · [vm-paging](Operating-Systems/OSTEP-Homework/vm-paging/README.md) · [vm-beyondphys-policy](Operating-Systems/OSTEP-Homework/vm-beyondphys-policy/README.md) · [threads-locks](Operating-Systems/OSTEP-Homework/threads-locks/README.md) |
| 29.6 | MIT 6.5840 Quiz 1 (2024): Raft + linearizability | [questions](Distributed-Systems/MIT-6.5840-Quizzes/2024-quiz1/questions.md) · [solutions](Distributed-Systems/MIT-6.5840-Quizzes/2024-quiz1/solutions.md) |
| 29.7 | Cambridge Concurrent and Distributed Systems | [42 questions, 2010–2026](Distributed-Systems/Cambridge-Concurrent-and-Distributed-Systems/README.md) (no public solutions, see §3) |
| 29.8 | CppQuiz + LeetCode Concurrency | Neither could be copied (§3). In their place: [learncpp chapter quizzes with solutions](Cpp/learncpp-chapter-quizzes/README.md) and [Rustlings threads](Rust/rustlings/20_threads.md) |
| 29.9 | Knowledge check round 2 | Made by Claude from your Done steps (not a source to copy) |
| 31.1 | Databases + SQL interview questions | [GfG SQL](Databases/GeeksforGeeks/sql-interview-questions.md) · devops-exercises [SQL](Question-Banks/devops-exercises/SQL.md), [Databases](Question-Banks/devops-exercises/topics/databases/README.md), [Mongo](Question-Banks/devops-exercises/Mongo.md) |
| 36.1 | OS interview questions + a CS162 midterm | [GfG OS](Operating-Systems/GeeksforGeeks/operating-systems-interview-questions.md) · devops-exercises [OS](Question-Banks/devops-exercises/Operating-System.md), [Linux](Question-Banks/devops-exercises/topics/linux/README.md) · [CS162 exams](Operating-Systems/Berkeley-CS162-Exams/README.md) |
| 37.1 | Rustlings | [All 95 exercises with official solutions](Rust/rustlings/README.md) |
| 53.1 | CS186 Midterm 1, the rest: B+ trees, sorting/hashing, joins | Midterm 1 sets in [CS186 exams](Databases/Berkeley-CS186-Exams/README.md) |
| 68.1 | CMU Fall 2024 HW3 Q3–Q5 | [questions](Databases/CMU-15-445-Homeworks/fall2024/hw3/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw3/solutions.md) |
| 69.1 | Networking interview questions + a CS168 exam | [GfG networking](Networking/GeeksforGeeks/networking-interview-questions.md) · devops-exercises [Network](Question-Banks/devops-exercises/Network.md), [HTTP](Question-Banks/devops-exercises/HTTP.md), [DNS](Question-Banks/devops-exercises/topics/dns/README.md) · [CS168 worksheets](Networking/Berkeley-CS168-Worksheets/README.md) (CS168 publishes no past exams) |
| 86.1 | Learn Git Branching + Git questions | [All 36 levels with official solutions](Git/learn-git-branching/README.md) · devops-exercises [Git](Question-Banks/devops-exercises/topics/git/README.md) |
| 93.1 | CS186 Midterm 2: optimization, transactions, recovery | Midterm 2 sets in [CS186 exams](Databases/Berkeley-CS186-Exams/README.md) |
| 98.1 | CMU Fall 2024 HW4 | [questions](Databases/CMU-15-445-Homeworks/fall2024/hw4/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw4/solutions.md) |
| 101.1 | CS186 Final + MIT Quiz 2 (2023) Dynamo | Finals in [CS186 exams](Databases/Berkeley-CS186-Exams/README.md) · MIT 2023 Quiz 2 [questions](Distributed-Systems/MIT-6.5840-Quizzes/2023-quiz2/questions.md) · [solutions](Distributed-Systems/MIT-6.5840-Quizzes/2023-quiz2/solutions.md) |
| 104.1 | Knowledge check round 7 | Made by Claude |
| 120.1 | C++ and languages questions + design patterns | [GfG C++](Cpp/GeeksforGeeks/cpp-interview-questions.md) · [learncpp quizzes](Cpp/learncpp-chapter-quizzes/README.md) |
| 121.1 | CMU Fall 2024 HW5 + HW6 | HW5 [questions](Databases/CMU-15-445-Homeworks/fall2024/hw5/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw5/solutions.md); HW6 [questions](Databases/CMU-15-445-Homeworks/fall2024/hw6/questions.md) · [solutions](Databases/CMU-15-445-Homeworks/fall2024/hw6/solutions.md) |
| 129.1 | Architecture questions | The repo's [76-question Microservices reference](../../System%20Design/Microservices.md) · [ByteByteGo System Design 101, 400 guides with diagrams](System-Design/bytebytego-system-design-101/README.md) · devops-exercises [System Design](Question-Banks/devops-exercises/System-Design.md) |
| 132.1 | System design mocks: 3 problems, timed | [Hello Interview breakdowns (16 free, worked answers)](System-Design/hello-interview-breakdowns/README.md) · [System Design Primer questions with solutions](System-Design/system-design-primer/README.md) |
| 134.1 | Weekly self-exam | Pick any set in this bank |
| 145.1 | LLD problems, timed | [33 problems with official solutions in 5–6 languages](Low-Level-Design/awesome-low-level-design/README.md) · [Primer OOD solutions](System-Design/system-design-primer/README.md) |
| 152.1 | Testing and reliability + an SLO exercise | devops-exercises [Testing](Question-Banks/devops-exercises/Testing.md), [Observability](Question-Banks/devops-exercises/topics/observability/README.md), [Chaos engineering](Question-Banks/devops-exercises/topics/chaos_engineering/README.md), [SRE](Question-Banks/devops-exercises/topics/sre/README.md) |
| 159.1 | PortSwigger labs + OWASP Top 10 | [All 268 labs with official solutions](Security/portswigger-labs/README.md) · devops-exercises [Security](Question-Banks/devops-exercises/topics/security/README.md) |
| 169.1 | AWS practice exam + Kubernetes | devops-exercises [AWS](Question-Banks/devops-exercises/topics/aws/README.md), [Kubernetes](Question-Banks/devops-exercises/topics/kubernetes/README.md), [Containers](Question-Banks/devops-exercises/topics/containers/README.md), [Terraform](Question-Banks/devops-exercises/topics/terraform/README.md) (the AWS official practice set needs a login, §3) |
| 183.1 | AI interview questions + agentic mocks | [ML Interviews Book, 318 questions](AI-and-ML/ml-interviews-book/README.md) (questions only; the book has no answers) · the repo's [agentic system design mocks](../../Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-System-Design-Interview-Practice.md) |
| Interviews | Behavioral | [Tech Interview Handbook behavioral questions and rubrics](Behavioral/tech-interview-handbook/README.md) |

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
| CppQuiz | Answers appear only after 3 tries on the site; faking tries would corrupt its answer statistics | Play at <https://cppquiz.org/> |
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
