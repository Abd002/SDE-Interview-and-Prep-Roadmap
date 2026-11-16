# Valeo Cairo: Graduate In Training Program (GIT), Embedded Software

> Second Valeo application. The Junior Software Engineer, LIGHT one ([valeo/](../valeo/README.md)) was rejected on 13 Nov 2026 with no reason. Checked on 16 Nov 2026 (Workday shows it open and "can apply").

## 1. The role

| | |
|---|---|
| **Role** | [Graduate In Training Program (GIT), Embedded Software](https://valeo.wd3.myworkdayjobs.com/valeo_jobs/job/Cairo/Job-Posting-Title-Graduate-In-Training-Program--GIT----Embedded-Software_REQ2026080868) (REQ2026080868) |
| **Where** | Cairo, on-site, full time |
| **What it is** | 6-month on-site trainee program in R&D (renewable): code from component requirements, MISRA-C, configuration, integration, test plans and test cases, verification on the hardware target, static analysis, bug reports. For 2025/2026 graduates; excellent English and Arabic; French a plus |
| **Why it fits** | Firmware in C on 32-bit MCUs (EKSON), AUTOSAR MCAL drivers tested against the spec, UDS bootloader with CRC on STM32, FreeRTOS seat heater with run-time measurements, clang-tidy and Clippy, CI |
| **Gap** | **MISRA-C:** not in your facts, so not on the CV. Read the main rules before an interview (no dynamic memory, no recursion, explicit casts, single exit, etc.) and be honest that you know them from reading |
| **Status** | **Ready, not sent** |
| **Apply** | In Workday with the same account as before: [valeo userHome](https://valeo.wd3.myworkdayjobs.com/en-US/valeo_jobs/userHome). Reuse the answers in [valeo/application-form.md](../valeo/application-form.md) |

## 2. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad as it was on 16 Nov 2026 |

**What the tailored CV changes** (from the LIGHT copy): Title "C, AUTOSAR, Testing". The summary leads with your 2025 degree, C firmware verified on hardware, AUTOSAR drivers tested against the spec, static analysis and CI, and English and Arabic. Skills gain a "Quality & tools" line (testing on the hardware target, clang-tidy, Clippy) and a spoken-languages line. **Projects, picked for testing and verification:** AUTOSAR PORT/GPIO drivers written from the specification and tested against it on the board · the graduation bootloader (CRC verification, UDS) · the seat heater (diagnostics and run-time performance measured on the target: CPU load, task and lock times) · CMU BusTub (passes the autograder tests, clean under clang-tidy, no leaks) · the door locker (layered ECUs integrated over UART).

## 3. Checklist

- [ ] Apply in Workday with the PDF above
- [ ] Fill in **Applied on** here, in 08 and in Notion
- [ ] Follow up once after 3 weeks with no reply
