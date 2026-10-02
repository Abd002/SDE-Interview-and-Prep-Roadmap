# 01 — Professional Profile Analysis

> **Who:** Abdelrahman Khalifa, a software engineer based in Egypt.
> **Public links:** [GitHub — Abd002](https://github.com/Abd002) · [GSoC 2026 report](https://github.com/Abd002/GSOC-2026) · [LinkedIn](https://www.linkedin.com/in/abd002)
> **Sources used:** his CV (Sept 2026 version; the primary source), his public GitHub profile and repositories, and the GSoC 2026 final report.
> **Verified on:** 2026-09-29.
> 🔒 This file leaves out his email address and phone number. At his request they appear only in the CVs in [CV/](CV/).

This file answers five questions:
1. What does he have?
2. What is he strong at?
3. What is missing?
4. Which job titles fit him?
5. Which career paths are open?

It deliberately treats him as a **software engineer first**. Embedded is one strong path, not the only one.

---

## Table of Contents
- [1. Snapshot](#1-snapshot)
- [2. Qualifications (evidence table)](#2-qualifications-evidence-table)
- [3. Strengths](#3-strengths)
- [4. Gaps and how to close them](#4-gaps-and-how-to-close-them)
- [5. Job titles that fit today](#5-job-titles-that-fit-today)
- [6. Career paths compared](#6-career-paths-compared)
- [7. Level calibration](#7-level-calibration)
- [8. CV and LinkedIn keyword advice](#8-cv-and-linkedin-keyword-advice)

---

## 1. Snapshot

| Item | Value |
|---|---|
| Degree | B.Sc. Computer & Systems Engineering, Minia University (2020–2025). Grade: **Very Good, 84.6%, with Honors**. |
| Professional experience | About 1 year full-time at EKSON (Aug 2025 – present, after graduating) + GSoC 2026 (Linux Foundation / OpenPrinting) + a 2-month ODC Embedded Linux internship |
| Main languages | **Rust, C, modern C++**, Python, Bash (also Java, C#, JavaScript/Node.js, Verilog, MATLAB) |
| Signature work | Built a Rust async printer-management stack for the **COSMIC** desktop (System76 mentors). Contributed upstream to **libcups, cups-rs, Zephyr RTOS, Rust Clippy, and Boa** |
| Competitive programming | **Codeforces Expert**; **4-time ECPC finalist** (Egyptian Collegiate Programming Contest) |
| Military service | Completed or exempt (his own answer), so there is no travel restriction |
| Stage | Junior (about 1 year of full-time work plus GSoC and upstream work). Aim for **new-grad / L3 / SWE I** roles at large companies and **junior-to-mid** roles at smaller ones |

---

## 2. Qualifications (evidence table)

Every row points to a source a recruiter can check.

| Area | What he did | Evidence |
|---|---|---|
| **Education** | B.Sc. Computer & Systems Engineering, 84.6%, with Honors. His AUTOSAR/V2X graduation project covered a software-defined vehicle on FreeRTOS, lane-keeping and driver monitoring, firmware updates over the air, secure boot, and rollback. | CV |
| **Industry job** | **Embedded Systems Engineer, EKSON** (Aug 2025 – present). He wrote Zephyr firmware for 3-DoF motion simulators and migrated it from FreeRTOS. He also built a C++/Qt control app and made it about **40% faster** using async processing and threads. | CV |
| **GSoC 2026 — Linux Foundation / OpenPrinting** | He built the printer-management tool for the **COSMIC** desktop in Rust: an async client API, a CUPS/IPP backend, DNS-SD printer discovery, and a UI in iced/libcosmic. The work is split into five crates: `printers-core`, `-client`, `-server`, `-ui`, `-app`. He tested on real HP printers and set up CI with `ippeveprinter`. | [GSOC-2026 report](https://github.com/Abd002/GSOC-2026), [cosmic-printers](https://github.com/Abd002/cosmic-printers) |
| **Upstream C contributions** | **libcups**: PRs #164 and #165 merged, including DNS-SD crash fixes. | GSoC report |
| **Upstream Rust contributions** | **cups-rs**: PRs #18–#22 merged (port to libcups3). **Rust Clippy**: fixed a `ref_as_ptr` false positive. **Boa** (a JavaScript engine written in Rust): optimized `JsStr::code_points`. Winter of Code 2026: implemented Rust `lp`/`lpstat` in cups-rs. | CV, GSoC report |
| **Upstream RTOS contribution** | **Zephyr RTOS**: added `IP_MULTICAST_LOOP` support across 6 network modules. Merged in March 2024. | CV |
| **Open PRs under review** | `cosmic-settings` #2182 and `cosmic-settings-daemon` #188 | GSoC report |
| **Embedded Linux** | ODC internship (Dec 2023 – Jan 2024): Yocto, Buildroot, kernel modules, device drivers, device trees. Personal project: an IoT C++ TCP/UDP framework on a Raspberry Pi 4 and QEMU, built with Yocto. | CV |
| **General software** | OS simulator (Java). Full-stack course project (Node/Express/MongoDB). Sports-management and inventory systems (C#). Python function solver. | [GitHub pinned repos](https://github.com/Abd002) |
| **Algorithms** | Codeforces Expert, 4-time ECPC finalist, and this SDE interview-prep repository | [GitHub profile](https://github.com/Abd002) |
| **Other** | Deloitte mentorship program | CV |

---

## 3. Strengths

1. **Verified open-source record.** Merged PRs in libcups, cups-rs, Zephyr, Clippy and Boa are public proof that he can:
   - read a large unfamiliar codebase;
   - pass a strict code review;
   - work asynchronously with maintainers in other time zones.

   Remote-first employers (Canonical, Collabora, Igalia, GitLab, Red Hat) hire on exactly this signal.
2. **Rust + C + C++ systems depth.** Few junior candidates have production-style Rust (async, crates, IPC through varlink) *and* C/C++ firmware experience. That combination fits:
   - systems and infrastructure teams;
   - developer-tools teams;
   - automotive software teams;
   - Linux desktop teams.
3. **Strong algorithm skills.** Codeforces Expert and a 4-time ECPC finalist are the best predictors of passing Big Tech coding rounds. This is his edge for general-SWE roles at Google, Meta, Amazon, and trading firms.
4. **Works across the whole stack of a device**, from the Verilog FSM up to the RTOS, kernel/drivers, and desktop UI. That breadth reads well for platform, OS and "full-stack systems" roles.
5. **Known mentors.** GSoC mentors from OpenPrinting and System76 (Till Kamppeter, Michael Murphy and others) can give strong references and referrals.
6. **Good degree grade (84.6%, with Honors).** It clears the academic bar for DAAD, Erasmus Mundus, and most funded master's programmes (see [05](05-Masters-and-Scholarships.md)).

---

## 4. Gaps and how to close them

| Gap | Why it matters | Fix (concrete) | Effort |
|---|---|---|---|
| **No English test score** (IELTS/TOEFL) | Most master's scholarships require one: DAAD, Chevening, Erasmus Mundus, Fulbright. Canada Express Entry needs CLB 7. | Take **IELTS Academic** and aim for **7.0+** (no band below 6.5). The score stays valid for 2 years. | 4–6 weeks of preparation |
| **Little production backend/cloud experience** | Most general-SWE openings are backend or distributed-systems roles. | Build one deployed Rust or C++ service (for example an HTTP/gRPC service with Postgres, Docker, CI, and metrics) and put it on GitHub. Optional: an AWS Cloud Practitioner or CKAD certificate. | 6–8 weeks |
| **Little system-design practice** | Mid-level interviews (L4/SWE II) include a system-design round. | Work through this repo's [System Design](../System%20Design/) and [System Architecture](../System%20Architecture/) guides and do 10 mock designs. | 6 weeks alongside other prep |
| **"Embedded-only" title on the CV** | Generalist recruiters filter by title. | Retitle the current job as **"Software Engineer (Embedded & Systems)"**. Keep the facts accurate: this is a title framing, not a claim to a different role. Lead the CV with Rust/C++/Linux and open source. | 1 day |
| **Behavioral interview stories** | Amazon, Meta and Google score behavioral rounds. | Write 8 STAR stories (Situation, Task, Action, Result), for example the FreeRTOS→Zephyr migration, the +40% Qt performance gain, the GSoC design trade-offs, and a code-review disagreement. | 1 week |
| **No work visa or EU experience** | Employers must sponsor him. | Target the sponsors listed in [02](02-International-Companies.md) and [06](06-Salaries-and-Visas.md). Germany's **Opportunity Card** lets him job-hunt on site without a sponsor. | — |
| **German, Dutch or Japanese language** | Helpful but optional for English-speaking tech teams. It matters more for automotive employers in Germany. | Optional A2/B1 German course if Germany is the top target. | 3–6 months |

---

## 5. Job titles that fit today

The list is ordered from most general to most specialized. "Level" means the realistic entry level for about 1 year of experience plus GSoC.

| # | Title to search for | Level to apply at | Why he fits |
|---|---|---|---|
| 1 | **Software Engineer / Software Development Engineer (SDE)** | New grad, SWE I, L3 (Google), SDE I (Amazon), E3 (Meta) | Algorithmic strength, C++, Rust |
| 2 | **Backend Software Engineer (Rust / C++ / Go)** | Junior to mid | Async Rust, IPC, services |
| 3 | **Systems Software Engineer** | Junior to mid | Rust, C, CUPS, Linux, IPC |
| 4 | **Infrastructure / Platform Engineer** | Junior | Linux, CI, build systems (CMake, Yocto) |
| 5 | **Rust Engineer** | Junior to mid | GSoC plus 4 Rust upstream projects |
| 6 | **C++ Software Engineer (low-latency / performance)** | Graduate or junior at trading firms | C++, performance work, competitive programming |
| 7 | **Developer Tools / Compiler / Language Runtime Engineer** | Junior | Clippy (a Rust linter), Boa (a JavaScript engine) |
| 8 | **Linux / Open Source Software Engineer** (desktop, printing, graphics) | Junior to mid | OpenPrinting, COSMIC, libcups |
| 9 | **Embedded Linux / BSP Engineer** | Junior to mid | Yocto, Buildroot, drivers, device trees |
| 10 | **Firmware / Embedded Software Engineer** (Zephyr / RTOS) | Junior to mid | EKSON job, Zephyr upstream |
| 11 | **Automotive Software Engineer** (AUTOSAR, software-defined vehicle) | Junior | AUTOSAR/V2X project, MISRA C |

---

## 6. Career paths compared

| Path | Target employers | Pay ceiling | Competition | Fit today | Main gap |
|---|---|---|---|---|---|
| **A. General SWE at Big Tech** | Google, Microsoft, Amazon, Meta, Apple, Bloomberg | Very high | Very high | ★★★★☆ | System design and behavioral practice |
| **B. Backend / infrastructure** | Cloudflare, Datadog, Elastic, MongoDB, Booking.com, Adyen, Zalando | High | High | ★★★☆☆ | A deployed backend project |
| **C. Systems / Rust / developer tools** | JetBrains, Ferrous Systems, Mozilla, Microsoft (Rust), Cloudflare, 1Password | High | Medium | ★★★★★ | None; this is his best match |
| **D. Linux and open source** | Canonical, Red Hat, SUSE, Collabora, Igalia, System76 | Medium to high | Medium | ★★★★★ | None; most are remote-first |
| **E. Low-latency C++ (trading)** | Optiver, IMC, Flow Traders, Jane Street, Hudson River Trading | Very high | Very high | ★★★☆☆ | Deeper C++ performance knowledge and probability puzzles |
| **F. Embedded / automotive** | Bosch, Continental, NXP, Infineon, Nordic, Valeo, Arm | Medium | Medium | ★★★★★ | German helps for German employers |

**Recommendation:** run **C + D + A** in parallel. Keep **F** as the safe option, because embedded employers sponsor visas often and his CV already fits them word for word. The full plan is in [07 Strategy](07-Strategy-and-Roadmap.md).

---

## 7. Level calibration

| Company type | Level to target | Notes |
|---|---|---|
| Google | L3 | L4 needs roughly 2+ years of experience plus a system-design round, so aim for L3 now. |
| Amazon | SDE I | |
| Microsoft | SWE (59/60) | |
| Meta | E3 | |
| Trading firms | Graduate / junior C++ developer | |
| Mid-size and open-source companies | "Software Engineer" (mid) | GSoC and upstream work count as experience at these companies. |

---

## 8. CV and LinkedIn keyword advice

**Headline:** use a general-SWE headline, for example: *"Software Engineer — Rust · C++ · Linux · Open Source (GSoC 2026 @ Linux Foundation) · Codeforces Expert"*.

**Keywords.** Recruiters' applicant-tracking systems filter on keywords, so put these words in the CV:

| Category | Keywords |
|---|---|
| Languages | Rust, C++17/20, C, Python |
| Concurrency | async/await, Tokio (only if he has used it), multithreading |
| Linux and systems | Linux, IPC, D-Bus/varlink, CUPS/IPP, DNS-SD/mDNS |
| Embedded | Zephyr, FreeRTOS, Yocto, Buildroot, device drivers |
| Tooling | CMake, Git, CI/CD, unit testing, code review |
| Open source | Open-source contributions |

**Order of CV sections for general-SWE applications:**
1. Summary
2. Skills
3. **Open source** (GSoC, libcups, Clippy, Boa, Zephyr)
4. Experience
5. Projects
6. Education
7. Achievements (Codeforces)

**Quantify results.** Examples:
- "+40% throughput"
- "7 upstream PRs merged across 3 organizations"
- "migrated firmware across 6 modules"

**Format.** Keep the CV to one page for industry roles. Master's applications need a separate two-page academic CV.

**Next file:** [06 — Salaries and Visas](06-Salaries-and-Visas.md)
