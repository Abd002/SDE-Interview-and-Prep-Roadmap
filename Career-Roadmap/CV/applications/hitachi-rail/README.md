# Hitachi Rail: everything for this application

> Part of [08: More roles, no relocation risk](../../../08-Application-Tracker.md#more-roles-no-relocation-risk-found-3-nov-2026). Checked on 3 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Embedded Application Developer](https://www.linkedin.com/jobs/view/4478918161) (posted 20 Oct 2026, open on 3 Nov 2026) |
| **Where** | Cairo. No visa or relocation. |
| **Level** | Entry level; training in railway applications, **ETCS** and safety-critical development is provided |
| **The work** | C/C++ software modules for safety-critical railway systems, integration and testing, defect investigation, documentation |
| **Essential** | C/C++, embedded fundamentals, problem solving, good English |
| **Desirable** | Embedded experience, RTOS, software testing methods, automotive/industrial background, basic railway knowledge |
| **Same team also hires** | [Software Validation & Test Engineer](https://www.linkedin.com/jobs/view/4478903663): same CV works; apply only if the developer role doesn't answer |
| **Status** | Not started |
| **Applied on** | — |

## 2. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad as it was on 3 Nov 2026 |

## 3. How each of your projects maps to the ad

| The ad asks for | What the CV shows (all checked in your repos) |
|---|---|
| C/C++ software modules | EKSON Zephyr firmware in C; AUTOSAR MCAL drivers; graduation bootloader and UDS layer; Door Locker (two ATmega32) |
| Safety-critical thinking | EKSON safety functions (e-stop, motion limits, watchdog); bootloader that **verifies the image with the hardware CRC** before jumping, with two banks and rollback; isolating native crashes in a separate service (GSoC) |
| RTOS | Zephyr (EKSON), FreeRTOS (Seat Heater: event groups, periodic tasks, mutex-protected UART), OSEK/VDX Trampoline (graduation project) |
| Testing and defect investigation | Seat Heater fault diagnostics and CPU-load/task-time measurement; libcups crash investigation and fix; CI integration tests against real services |
| Automotive / industrial background | AUTOSAR V2X graduation project, UDS, AUTOSAR drivers; industrial motion simulators at EKSON |
| State machines (railway signalling logic is FSM-heavy) | Traffic Light Controller FSM in Verilog |

## 4. How to prepare

- Read a one-page intro to **ETCS** (levels 1/2, balises, the onboard unit) and **SIL / EN 50128** (the railway software safety standard), so you can show interest. They'll train you on the rest.
- Revise C: pointers, `volatile`, interrupts, memory layout, bit manipulation; and RTOS basics: priorities, priority inversion, mutex vs semaphore.
- Prepare to explain the bootloader: how the image is verified, what happens on a bad image, and how rollback works.

## 5. Checklist

- [ ] Re-open the posting and check it is still open.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf).
- [ ] Fill in **Applied on** above, in 08 and in Notion.
- [ ] Follow up once after 3 weeks with no reply.
