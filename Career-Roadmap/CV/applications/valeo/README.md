# Valeo: everything for this application

> Part of [08: Next 5, no relocation risk](../../../08-Application-Tracker.md#next-5-no-relocation-risk-found-2-nov-2026). Follow-up rules: [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Checked on 2 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Junior Software Engineer, LIGHT](https://valeo.wd3.myworkdayjobs.com/valeo_jobs/job/Cairo/Embedded-Software-Engineer--LIGHT_REQ2026071105) (REQ2026071105; the posting date in Workday is 26 Feb 2026, and it was still open on 2 Nov 2026) |
| **Where** | Cairo, Valeo Egypt. **No visa or relocation needed.** |
| **Level** | **0–1 years** in automotive embedded software |
| **What the team builds** | Software for automotive lighting systems: requirements, design, integration on the test bench and in the vehicle, ASPICE processes |
| **Why it fits** | C/C++ for microcontrollers, Python, UART/SPI/I2C, AUTOSAR a plus: your AUTOSAR graduation project (UDS bootloader), AUTOSAR MCAL drivers, FreeRTOS seat-heater controller and over a year of Zephyr firmware at EKSON |
| **Status** | Not started (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b41810eaa6cde06fd3312cf)) |
| **Applied on** | — |
| **Saved job ad** | [job-ad.md](job-ad.md) |
| **Fallback** | [Graduate In Training Program, Embedded Software](https://valeo.wd3.myworkdayjobs.com/valeo_jobs/job/Cairo/Job-Posting-Title-Graduate-In-Training-Program--GIT----Embedded-Software_REQ2026080868): a 6-month trainee programme for 2025/2026 graduates (MISRA-C, static analysis, component tests). Apply there too only if the junior role doesn't answer. |

## 2. Files in this folder

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Same CV in Word, only if the site asks for Word |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | Its LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad text as it was on 2 Nov 2026 |

**What the tailored CV changes:** Title "Automotive C, AUTOSAR, RTOS". EKSON comes first (your professional embedded year). The graduation project bullet now shows the **UDS services** found in your repo (0x10, 0x34, 0x36, 0x37, read version) and the hardware CRC check. The seat heater is framed as a car seat-heater controller. New skills lines: "Automotive & RTOS" (AUTOSAR MCAL, UDS, bootloaders, OSEK/VDX, FreeRTOS, Zephyr) and "Microcontrollers".

## 3. Gaps, and how to prepare

| The ad asks for | Your honest answer |
|---|---|
| Vector tools (CANoe, DaVinci, vTESTstudio), LIN/CAN/Ethernet | You haven't used Vector tools; CAN was tried in the graduation project and replaced by UART. Read the free Vector CANoe intro and the CAN basics (frames, arbitration, error handling) before the interview. |
| Renesas, NXP, Aurix MCUs | You've used STM32 (Cortex-M4), TM4C, ESP32-S3 and AVR. Say that the concepts (clocks, interrupts, peripherals, linker scripts) carry over. |
| ASPICE, Codebeamer, DOORS | Not used. Know what ASPICE is (V-model process levels, SWE.1–SWE.6) and that requirements trace to tests. |
| Scopes, logic analysers | Say only what you've used on the bench at EKSON; don't overclaim. |
| AUTOSAR | Your MCAL PORT/GPIO drivers and the graduation project. Revise the layered architecture (MCAL, ECU abstraction, services, RTE, SWCs) and UDS. |

**Hiring process:** Valeo Egypt doesn't publish it. Expect technical and HR interviews, possibly a C test. Note each stage here when it happens.

## 4. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] Ask a Valeo Cairo engineer for a referral if you know one (LinkedIn search: "Valeo Egypt software engineer LIGHT").
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) in Workday; check every auto-filled field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Revise AUTOSAR layers, UDS and CAN basics while you wait.
- [ ] Follow up once after 3 weeks with no reply (09 §5).
