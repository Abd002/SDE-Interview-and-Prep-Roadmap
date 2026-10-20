# Practice exams and YouTube channels

> **Not part of the study plan** (the practice steps were removed on 20 Oct 2026). Use these only if you have spare time.

**What it's for:**
- **Practice:** train on real exams and interview-style questions for the steps already finished.
- **Channels:** follow the tech you're studying on YouTube.

**Checked:** every link opened on 18 Oct 2026. LeetCode and Codeforces block automated checks, but both are live.

**⚡ Interview tomorrow?** Use [Interview-Fast-Revision.md](Interview-Fast-Revision.md) instead: short Q&A pages for every track, read in an evening.

**📦 All of it is now in the repo:** the [Practice Bank](Practice-Bank/README.md) has every exam, homework and question bank below copied in one place, with the sources' own solutions and figures (19 Oct 2026). Use the links below only for what the bank couldn't copy (its §3 lists those).

**Contents**
1. [Practice exams and interview questions](#1-practice-exams-and-interview-questions)
2. [Interview questions for the tracks still ahead](#2-interview-questions-for-the-tracks-still-ahead)
3. [YouTube channels](#3-youtube-channels)

---

## 1. Practice exams and interview questions

**Start with these three:** the MIT 6.5840 quizzes, the Berkeley CS186 exams and the OSTEP homework. All three are real exams or graders with answer keys, and together they cover nearly every finished step.

### Databases: CMU L01–L07 (SQL, storage, buffer pool, compression, hash tables)
| Site | What you get |
|---|---|
| [CMU 15-445 past homeworks](https://15445.courses.cs.cmu.edu/fall2024/assignments.html) | The same course in other semesters, **with solutions**. Fall 2024, Spring 2025 and Fall 2023 each have HW1–HW2 on the same topics; change the year in the link. |
| [Berkeley CS186 past exams](https://cs186berkeley.net/resources/) | Real midterms with solutions: SQL, disk and files, buffer management, hashing. The closest thing to CMU's exams. |
| [Berkeley HKN exam archive, CS186](https://hkn.eecs.berkeley.edu/exams/course/cs/186) | More years of the same exams. |
| [DataLemur](https://datalemur.com/) | SQL questions from real FAANG interviews. |
| [LeetCode SQL 50](https://leetcode.com/studyplan/top-sql-50/) | The standard interview SQL set. |
| [StrataScratch](https://www.stratascratch.com/) | SQL interview questions, tagged by company. |
| [PostgreSQL Exercises](https://pgexercises.com/) · [SQL Practice](https://www.sql-practice.com/) | Free SQL drills: joins, aggregates, window functions, recursive CTEs. |

**Notes:**
- CMU's official practice midterms are restricted to the CMU VPN, so use the past homeworks above instead.
- Don't open the **Fall 2025 HW2 solutions** before step 26 (self-grade), or the check becomes useless.

### Operating systems (processes, threads, synchronization, scheduling, memory)
| Site | What you get |
|---|---|
| [OSTEP homework](https://pages.cs.wisc.edu/~remzi/OSTEP/) | Simulators that make up unlimited questions and check your answers: scheduling (`scheduler.py`, `mlfq.py`), paging and LRU/Clock (`paging-policy.py`), threads and locks. |
| [Berkeley HKN exam archive, CS162](https://hkn.eecs.berkeley.edu/exams/course/cs/162) | Real OS exams with solutions. |
| [LeetCode Concurrency](https://leetcode.com/problemset/concurrency/) | Thread-synchronization coding problems (print in order, FooBar, dining philosophers). |

### Distributed systems (Raft, DDIA ch. 5 and ch. 9)
| Site | What you get |
|---|---|
| [MIT 6.5840 past quizzes](https://pdos.csail.mit.edu/6.824/quizzes.html) | **The best one here.** Many years of real exams with solutions, full of Raft, linearizability and replication questions. |
| [Cambridge past papers: Concurrent and Distributed Systems](https://www.cl.cam.ac.uk/teaching/exams/pastpapers/t-ConcurrentandDistributedSystems.html) | Exam papers from Kleppmann's own course, the one the [ch. 9 revision map](Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md) uses. |
| [MIT 6.5840 Raft lab](https://pdos.csail.mit.edu/6.824/labs/lab-raft1.html) | Hands-on: implement Raft and run it against the official tests. |

### C++ and Rust (P0, concurrency, the key-value store)
| Site | What you get |
|---|---|
| [CppQuiz](https://cppquiz.org/) | "What does this code print?" questions, graded against the C++ standard. |
| [Exercism, Rust track](https://exercism.org/tracks/rust) | Rust exercises with free human mentoring. |

### System design and mock interviews
| Site | What you get |
|---|---|
| [Hello Interview](https://www.hellointerview.com/) | System design questions with worked answers (key-value store, rate limiter…) and mock interviews. |
| [Exponent](https://www.tryexponent.com/) | Peer mock interviews and question banks. |
| [interviewing.io](https://interviewing.io/) | Anonymous mock interviews with engineers from big companies. |

### Problem solving
| Site | What you get |
|---|---|
| [Codeforces](https://codeforces.com/) | Virtual contests, as in the [Contest Practice](../Contest-Practice/README.md) track. |
| [CSES Problem Set](https://cses.fi/problemset/) | 300 classic problems, sorted by topic. |

---

## 2. Interview questions for the tracks still ahead

Use each bank when its track comes up in the plan (section 3 has the exact steps). Answer out loud first, then check.

| Track | Where to practice |
|---|---|
| Databases + SQL (deeper) | [GfG SQL interview questions](https://www.geeksforgeeks.org/sql/sql-interview-questions/) · devops-exercises [SQL](https://github.com/bregman-arie/devops-exercises/blob/master/README.md#sql) and [Databases](https://github.com/bregman-arie/devops-exercises/blob/master/topics/databases/README.md) |
| Operating systems | [GfG OS interview questions](https://www.geeksforgeeks.org/operating-systems/operating-systems-interview-questions/) · devops-exercises [OS](https://github.com/bregman-arie/devops-exercises/blob/master/README.md#operating-system) and [Linux](https://github.com/bregman-arie/devops-exercises/blob/master/topics/linux/README.md) · [Berkeley CS162 exams](https://hkn.eecs.berkeley.edu/exams/course/cs/162) |
| Networking | [GfG networking interview questions](https://www.geeksforgeeks.org/computer-networks/networking-interview-questions/) · devops-exercises [Network](https://github.com/bregman-arie/devops-exercises/blob/master/README.md#network) and [DNS](https://github.com/bregman-arie/devops-exercises/blob/master/topics/dns/README.md) · [Berkeley CS168 exams](https://hkn.eecs.berkeley.edu/exams/course/cs/168) |
| Git | [Learn Git Branching](https://learngitbranching.js.org/) (interactive levels) · devops-exercises [Git](https://github.com/bregman-arie/devops-exercises/blob/master/topics/git/README.md) |
| C++ and languages | [learncpp](https://www.learncpp.com/) chapter quizzes · [CppQuiz](https://cppquiz.org/) · [GfG C++ questions](https://www.geeksforgeeks.org/cpp/cpp-interview-questions/) · [Refactoring.Guru patterns](https://refactoring.guru/design-patterns) |
| Rust (flagship) | [Rustlings](https://rustlings.rust-lang.org/) · [Exercism Rust](https://exercism.org/tracks/rust) |
| Architecture | The repo's [76-question Microservices reference](../System%20Design/Microservices.md) · [ByteByteGo System Design 101](https://github.com/ByteByteGoHq/system-design-101) |
| System design | [Hello Interview problem breakdowns](https://www.hellointerview.com/learn/system-design/problem-breakdowns/overview) · [System Design Primer](https://github.com/donnemartin/system-design-primer) · devops-exercises [System Design](https://github.com/bregman-arie/devops-exercises/blob/master/README.md#system-design) |
| Low-level design | [awesome-low-level-design](https://github.com/ashishps1/awesome-low-level-design) problems |
| Testing and reliability | devops-exercises [Testing](https://github.com/bregman-arie/devops-exercises/blob/master/README.md#testing), [Observability](https://github.com/bregman-arie/devops-exercises/blob/master/topics/observability/README.md), [Chaos engineering](https://github.com/bregman-arie/devops-exercises/blob/master/topics/chaos_engineering/README.md) · [Google SRE Workbook](https://sre.google/workbook/table-of-contents/) |
| Security | [PortSwigger Web Security Academy labs](https://portswigger.net/web-security/all-labs) · [OWASP Top 10](https://owasp.org/www-project-top-ten/) · devops-exercises [Security](https://github.com/bregman-arie/devops-exercises/blob/master/topics/security/README.md) |
| Cloud and DevOps | [AWS Cloud Practitioner official practice question set](https://explore.skillbuilder.aws/learn/course/external/view/elearning/14637/aws-certified-cloud-practitioner-official-practice-question-set-clf-c02-english) (free) · [Killercoda](https://killercoda.com/) Kubernetes scenarios · devops-exercises [AWS](https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/README.md), [Containers](https://github.com/bregman-arie/devops-exercises/blob/master/topics/containers/README.md), [Kubernetes](https://github.com/bregman-arie/devops-exercises/blob/master/topics/kubernetes/README.md) |
| AI and LLM engineering | [ML Interviews Book](https://huyenchip.com/ml-interviews-book/) (Chip Huyen) · the repo's [agentic system design mocks](../Agentic%20AI%2C%20LLM%20Engineering%2C%20and%20AI%20System%20Design/Agentic-System-Design-Interview-Practice.md) |
| Behavioral | [Tech Interview Handbook behavioral questions](https://www.techinterviewhandbook.org/behavioral-interview-questions/) |

---

## 3. YouTube channels

**If you follow only five:** Fireship, ByteByteGo, Core Dumped, CMU Database Group and Jon Gjengset.

### News and updates, told in an engaging way
| Channel | Why |
|---|---|
| [Fireship](https://www.youtube.com/@Fireship) | Fast, funny videos. "X in 100 Seconds" explains a tool; "The Code Report" covers the news each week. |
| [ByteByteGo](https://www.youtube.com/@ByteByteGo) | Animated system design: caching, replication, Kafka, databases. |
| [Core Dumped](https://www.youtube.com/@CoreDumpped) | Beautifully animated OS internals: scheduling, paging, threads. |

### Databases
| Channel | Why |
|---|---|
| [CMU Database Group](https://www.youtube.com/@CMUDatabaseGroup) | The 15-445 lectures, plus a seminar series with talks from database companies. |
| [Hussein Nasser](https://www.youtube.com/@hnasr) | Postgres and MySQL internals, backend engineering from first principles. |
| [Arpit Bhayani](https://www.youtube.com/@AsliEngineering) | Database internals and breakdowns of real company engineering blogs. |

### Distributed systems
| Channel | Why |
|---|---|
| [Martin Kleppmann](https://www.youtube.com/@kleppmann) | The DDIA author. His Cambridge distributed systems course. |
| [MIT 6.824](https://www.youtube.com/@6.824) | The distributed systems course behind the Raft labs and the Students' Guide. |
| [Papers We Love](https://www.youtube.com/@PapersWeLove) | Talks on classic papers: Dynamo, Spanner, Paxos. |

### C++ and Rust
| Channel | Why |
|---|---|
| [C++ Weekly with Jason Turner](https://www.youtube.com/@cppweekly) | A short modern-C++ video every week. |
| [CppCon](https://www.youtube.com/@CppCon) | Conference talks on concurrency and performance. |
| [Jon Gjengset](https://www.youtube.com/@jonhoo) | Deep Rust; "Crust of Rust" is the one to watch before the key-value store. |
| [Let's Get Rusty](https://www.youtube.com/@letsgetrusty) | Rust news and new releases. |

### Low-level and security
| Channel | Why |
|---|---|
| [Low Level](https://www.youtube.com/@LowLevelTV) | C, memory bugs and security news. |
| [LiveOverflow](https://www.youtube.com/@LiveOverflow) | Security and exploitation, very well explained. |

### Cloud and DevOps
| Channel | Why |
|---|---|
| [TechWorld with Nana](https://www.youtube.com/@TechWorldwithNana) | Docker, Kubernetes and CI/CD with clear animations. |

### AI and LLM engineering
| Channel | Why |
|---|---|
| [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) | Builds LLMs from scratch. |
| [3Blue1Brown](https://www.youtube.com/@3blue1brown) | Animated explanations of neural networks and transformers. |
| [AI Explained](https://www.youtube.com/@aiexplained-official) | Calm, careful coverage of new AI models and papers. |

### Competitive programming
| Channel | Why |
|---|---|
| [Errichto](https://www.youtube.com/@Errichto) | Problem-solving technique and contest walkthroughs. |
