# Siemens: everything for this application

> Part of [08: Next 5, no relocation risk](../../../08-Application-Tracker.md#next-5-no-relocation-risk-found-2-nov-2026). Follow-up rules: [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Checked on 2 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Software Engineer, Graph Lakehouse](https://jobs.siemens.com/en_US/externaljobs/JobDetail/526909) (job 526909, posted 23 Oct 2026) |
| **Company** | Siemens Digital Industries Software (Siemens Industry Software, Private Free Zone) |
| **Where** | New Cairo, on site. **No visa or relocation needed.** |
| **Level** | "Experienced Professional", but the ad asks for no number of years |
| **What the team builds** | Graph Lakehouse, a massively parallel graph database: query execution algorithms, parallelising sequential algorithms, an ACID storage layer, performance analysis |
| **Why it fits** | C++ and multi-threading on Linux, plus "database and operating system internals" and "distributed systems" as desirables: your CMU 15-445 work (thread-safe Count-Min Sketch), kernel module, OS simulator, Raft and DDIA study |
| **Status** | Not started (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b418133bbdae93a313b0965)) |
| **Applied on** | — |
| **Saved job ad** | [job-ad.md](job-ad.md) |

## 2. Files in this folder

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Same CV in Word, only if the site asks for Word |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | Its LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad text as it was on 2 Nov 2026 |
| [application-form.md](application-form.md) | What to enter in the Siemens careers profile |

**What the tailored CV changes:** Title "C++, Multithreading, Database Systems, Linux". The summary leads with C++ and the CMU database course. Projects lead with the **thread-safe Count-Min Sketch** (one mutex per row, so inserts on different rows run in parallel), then the kernel module (RCU) and the OS simulator. New skills line "Databases & distributed" lists only what you have studied (CMU L01–L07, Raft, DDIA ch. 5 and 9). Achievements add the ICPC mentoring in C++.

## 3. Gaps, and how to prepare

| The ad asks for | Your honest answer |
|---|---|
| "Proficiency in C++" | Codeforces Expert in C++, the BusTub project, the IoT C++ classes. Most of your professional code is Rust, C and Python: say so, and explain that Rust's ownership maps directly to RAII and move semantics. |
| "Expertise programming multi-threaded applications" | Per-row locks in the Count-Min Sketch; RCU in the kernel module; asyncio at EKSON; the varlink service at GSoC. Be ready to explain mutex vs RCU vs atomics, deadlock, and false sharing. |
| "Query execution, parallel algorithms" | Not covered yet: these are the CMU lectures on joins, query execution and parallel execution, after the ones you've done. **Watch them before the interview.** |
| "ACID storage layer" | You know storage and the buffer pool (L03–L06). Concurrency control and recovery come later in the course; read the notes on 2PL, MVCC and WAL/ARIES at least once. |
| Compilers, CPU architectures | Not your strength; don't claim it. You know caches and memory from OS study. |

**Revise before an interview:** [Progress-Summary §3.1–3.6](../../../Progress-Summary.md#3-what-i-can-explain-now) (what you can already explain), [Interview-Fast-Revision](../../../../Study-Plan/Interview-Fast-Revision.md) (C++ and OS tracks), and the Kernel Monitor weak spots in [facts.md](../../facts.md#projects-to-keep).

**Hiring process:** Siemens doesn't publish one for Cairo. Expect an HR call, then technical interviews (C++, multithreading, data structures; possibly a coding test). Note each stage here when it happens.

## 4. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] If you can, ask someone at Siemens DISW Cairo for a referral first (LinkedIn search: "Siemens Digital Industries Software Cairo Graph Lakehouse").
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); check every auto-filled field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Watch the CMU lectures on joins, query execution and parallel execution while you wait.
- [ ] Follow up once after 3 weeks with no reply (09 §5).
