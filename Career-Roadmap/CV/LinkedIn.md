# LinkedIn — what to update, with ready-to-paste text

This file compares the LinkedIn profile (the "Save to PDF" export from 2 Oct 2026) with the [CVs](README.md). Every fact below is the same as on the CVs; nothing is new or inflated.

**When the CVs change, update LinkedIn too.** Recruiters check that the dates match.

## 1. What is missing or different

| Section | On LinkedIn now | What to do |
|---|---|---|
| **Name** | "Abd ElRahman Khalifa" | The CVs, email and GitHub use **"Abdelrahman Khalifa"**. Use one spelling everywhere (the one on your passport). If it's "Abdelrahman", change LinkedIn. |
| **Headline** | GSoC'26 @The Linux Foundation \| Embedded Systems Engineer @EKSON \| Rust, C++ & Zephyr RTOS \| Open-Source Contributor \| 4x ECPC Finalist | Good, but it reads as embedded-only. Lead with "Software Engineer" and add Linux and Codeforces → [§2](#2-headline). |
| **About** | ❌ missing | Add it → [§3](#3-about). Recruiters read this first. |
| **Experience: GSoC 2026** | ❌ only in the headline | Add it as its own entry → [§4.1](#41-google-summer-of-code-2026). This is your strongest item. |
| **Experience: EKSON** | One long paragraph (ESP-IDF, PyQt5, QML, MongoDB/Express, CI, Unity PoC) | Replace with the CV's strong points: Zephyr migration, IMU, ~40% faster C++/Qt app → [§4.2](#42-ekson). Title: "Embedded Systems Engineer" (plural, as on the CV). The **Aug 2025** start date is correct and now matches the CVs. |
| **Experience: ODC internship** | ❌ missing | Add it → [§4.3](#43-odc-internship). |
| **Open source** (Zephyr, Boa, Clippy, cups-rs, libcups, COSMIC) | ❌ not visible (only "Zephyr Technical Contributor" under Certifications) | Add each one as a **Project** → [§5](#5-projects). |
| **Projects** | ? The PDF export never includes Projects | Open the profile and check. Add whatever from [§5](#5-projects) is missing. |
| **Skills** | Only 3 shown (Embedded C, Zephyr, Qt) | Add the list in [§6](#6-skills) and pin the top 5 so systems/Rust shows first. |
| **Honors & awards** | ❌ missing ("4x ECPC" is only in the headline) | Add Codeforces Expert, 4× ECPC finalist, GSoC 2026 and Deloitte → [§7](#7-honors--awards). |
| **Education** | "Bachelor's degree, Computer Engineering", 2020–2025, no grade | Degree name as on the CV, plus grade, honors and graduation project → [§8](#8-education). |
| **Volunteering** | ❌ missing | IEEE student branch treasurer (add your dates) → [§9](#9-volunteering-languages-certifications). |
| **Languages** | ❌ missing | Arabic (native) and English (pick your level) → [§9](#9-volunteering-languages-certifications). |
| **Featured** | ❌ (not in the PDF) | Pin the GSoC report, the cosmic-printers repo and the COSMIC Settings PR → [§10](#10-featured). |
| **Contact info** | Email + LinkedIn URL | Add **GitHub** as a Website (type "Portfolio") → [§11](#11-contact-info-and-open-to-work). |
| **Open to work** | ? | Turn it on for **recruiters only** with the titles and locations in [§11](#11-contact-info-and-open-to-work). |
| **Custom URL** | ✅ `linkedin.com/in/abd002` | Done. The CVs now use this URL too. |

## 2. Headline
Limit: 220 characters. Pick one.

**A (recommended, general):**
```
Software Engineer | Rust · C++ · Linux · Open Source | GSoC 2026 @ The Linux Foundation | Embedded Systems Engineer @ EKSON | Codeforces Expert · 4x ECPC Finalist
```
**B (systems/Rust focus):**
```
Systems Software Engineer | Rust · C · Linux | GSoC 2026 @ The Linux Foundation (OpenPrinting) | Open-Source Contributor (Zephyr, libcups, cups-rs, Clippy) | Codeforces Expert
```

## 3. About
Limit: 2,600 characters. This text is about 1,100.
```
I'm a software engineer who works close to the system: Rust, C and modern C++ on Linux and embedded devices.

In Google Summer of Code 2026 with The Linux Foundation (OpenPrinting), I built the printer-management stack for the COSMIC desktop in Rust: five crates with an async client, a CUPS/IPP/DNS-SD backend behind a varlink service, and one shared UI for COSMIC Settings and a standalone app. Along the way I ported cups-rs to libcups3 and fixed DNS-SD crashes in libcups: 7 pull requests merged upstream.

At EKSON I work on 3-DoF motion simulators: I moved the ESP32-S3 firmware from FreeRTOS to Zephyr RTOS and made our C++/Qt control application about 40% faster.

Outside work I contribute to open source: Zephyr RTOS (IPv4 multicast loopback), the Boa JavaScript engine and Rust Clippy.

Competitive programming keeps my problem solving sharp: Codeforces Expert and 4-time ECPC finalist.

I'm looking for systems, infrastructure, Linux and embedded software roles, remote or with relocation.

GitHub: github.com/Abd002
Email: abdelrahman.khalifa.gad@gmail.com
```

## 4. Experience
Add the entries in this order: newest first, so LinkedIn sorts them correctly.

### 4.1 Google Summer of Code 2026
- **Title:** Google Summer of Code Contributor
- **Company:** The Linux Foundation (mention OpenPrinting in the description)
- **Employment type:** Seasonal. GSoC is not formally an internship.
- **Location:** Remote
- **Dates:** May 2026 – Oct 2026
- **Description:**
```
COSMIC desktop printer setup tool in Rust, with OpenPrinting and System76 mentors.

• Designed a printer-management stack as 5 Rust crates: shared types, an async varlink client, a CUPS/IPP/DNS-SD and Printer Application backend, a shared UI (iced/libcosmic) and a standalone app.
• Ran the backend behind a varlink IPC service in cosmic-settings-daemon, so a crash in native C code can't take down the Settings app.
• Ported cups-rs to libcups3 (CUPS 2 and 3 builds with CI), wrote FFI bindings for the libcups3 DNS-SD API, and fixed crashes and a client leak in libcups: 7 PRs merged upstream.
• Tested on real HP printers; CI checks formatting, Clippy and tests on several architectures with virtual IPP printers.

Report: github.com/Abd002/GSOC-2026
```
- **Skills:** Rust · Linux · CUPS · gRPC/IPC (varlink) · FFI · Open-Source Development

### 4.2 EKSON
- **Title:** Embedded Systems Engineer
- **Company:** EKSON Technology
- **Employment type:** Full-time
- **Dates:** Aug 2025 – Present
- **Location:** Cairo, Egypt
- **Description** (replace the current paragraph):
```
Motion simulator systems for training and gaming.

• Developed Zephyr RTOS firmware for an ESP32-S3 3-DoF motion simulator, migrating it from FreeRTOS for more deterministic behaviour and production readiness.
• Integrated an MPU6050 IMU with calibration, filtering and compensation for stable motion estimation.
• Built a modern C++/Qt desktop control application with reliable UART control of the simulator, and made it about 40% faster through asynchronous processing and fewer threads.
```
- **Optional extra line.** You said the other work there (PyQt5 app, small backend, CI, Unity proof of concept) wasn't your best code, so it's fine to leave it out. If you want to show breadth without overselling it, keep just this one line:

  `• Also worked across the desktop app's CI pipeline and a small backend for remote control.`
- **Skills:** Zephyr RTOS · C++ · Qt · Embedded C · ESP32

### 4.3 ODC internship
- **Title:** Embedded Linux Systems Intern
- **Company:** ODC (pick its LinkedIn company page)
- **Employment type:** Internship
- **Dates:** Dec 2023 – Jan 2024
- **Description:**
```
• Built Linux systems with Yocto and Buildroot; worked with kernel modules, device drivers, device trees, file systems and hardware flashing.
```
- **Skills:** Embedded Linux · Yocto · Buildroot · Linux Device Drivers

## 5. Projects
Profile → Add section → Projects. For each project, set **"Associated with"** where it fits and paste the link.

| # | Name | Associated with | Description (paste) | Link |
|---|---|---|---|---|
| 1 | COSMIC Printers (Rust) | Google Summer of Code | Printer management for the COSMIC desktop: 5 crates, async varlink client, CUPS/IPP/DNS-SD backend, shared UI for Settings and a standalone app. | github.com/Abd002/cosmic-printers |
| 2 | cups-rs: CUPS 3 support | Google Summer of Code | Ported cups-rs to libcups3 (CUPS 2 + 3 builds and CI); IPP management operations, Printer Application support, DNS-SD discovery, lpoptions. PRs #18–#22, merged. | github.com/OpenPrinting/cups-rs/pull/18 |
| 3 | libcups: DNS-SD crash fixes (C) | Google Summer of Code | Fixed crashes in cupsDNSSDDelete() when Avahi fails to initialize, and a leaked client in the Avahi DNS-SD code. PRs #164 and #165, merged. | github.com/OpenPrinting/libcups/pull/165 |
| 4 | Zephyr RTOS: IP_MULTICAST_LOOP | — | Implemented the IP_MULTICAST_LOOP socket option for IPv4 across 6 networking modules; merged upstream. | github.com/zephyrproject-rtos/zephyr/commit/b11703623c02f5afa4a5b0b7abdce3e324d7d470 |
| 5 | Boa JavaScript engine: faster Latin1 code points | — | Optimized JsStr::code_points() for Latin1 strings, avoiding UTF-16 conversion; with tests. | github.com/boa-dev/boa/pull/4553 |
| 6 | Rust Clippy: ref_as_ptr fix | — | Fixed ref_as_ptr false positives for non-temporary references in let/const. | github.com/rust-lang/rust-clippy/pull/16214 |
| 7 | Winter of Code 2026: lp / lpstat in Rust | — | Implemented the lp and lpstat commands in Rust on cups-rs (OpenPrinting). | github.com/Gmin2/cups-rs/pull/11 |
| 8 | AUTOSAR-Based V2X Ecosystem (graduation project) | Minia University | Software-defined vehicle prototype on FreeRTOS + AUTOSAR with ADAS (lane keeping, driver monitoring), FOTA updates and a secure bootloader with rollback. | github.com/Abd002/Graduation-Project |
| 9 | IoT Device Communication System | — | C++ framework for TCP unicast and UDP multicast between a Raspberry Pi 4 server and QEMU clients; Yocto cross-compilation. | github.com/Abd002/IoT-Comm-System-RPi4-QEMU |
| 10 | Seat Heater Control System | — | FreeRTOS real-time controller on Tiva C: temperature monitoring, heater-level control, UART diagnostics, mutexes and event flags. | github.com/Abd002/SeatHeaterControlSystem |
| later | Raft KV store in Rust (flagship) | — | Add it when the repo is public (study plan step 60), and update the text at each milestone. | — |

## 6. Skills
Add these (LinkedIn allows 100). Then **pin the top 5:** Rust · C++ · Linux · Embedded Systems · Zephyr RTOS.

```
Rust, C++, C, Python, Linux, Embedded Systems, Zephyr RTOS, FreeRTOS, Embedded C, Embedded Linux, Yocto Project, Buildroot, Linux Device Drivers, Linux Kernel, Qt, Multithreading, Asynchronous Programming, Inter-Process Communication (IPC), gRPC, CUPS, Networking, TCP/IP, Git, GitHub, CMake, Continuous Integration (CI), Unit Testing, Debugging, Code Review, Open-Source Development, Data Structures, Algorithms, Competitive Programming, AUTOSAR, MISRA C, ARM Cortex-M, ESP32, UART, I2C, SPI, CAN Bus
```

## 7. Honors & awards
| Title | Issuer | Date | Description |
|---|---|---|---|
| Google Summer of Code 2026 Contributor | Google / The Linux Foundation | 2026 | COSMIC printer setup tool in Rust; 7 PRs merged upstream. |
| Codeforces Expert | Codeforces | (your date) | Handle _Khalifa: codeforces.com/profile/_Khalifa |
| 4-time ECPC Finalist | Egyptian Collegiate Programming Contest (ECPC) | (add the 4 years) | Team finalist four times. |
| Deloitte Software Engineering Mentorship | Deloitte | 2024 | Selected for Deloitte's mentorship program on mobile apps with React Native. |

## 8. Education
- **School:** Minia University
- **Degree:** Bachelor of Engineering (B.Sc.)
- **Field of study:** Computer and Systems Engineering (the CVs use this name; use what's on your certificate)
- **Dates:** Oct 2020 – Jun 2025
- **Grade:** Very Good (84.6%) with Honors
- **Activities:** IEEE student branch (Treasurer) · ECPC finalist (4 times)
- **Description:**
```
Graduation project: AUTOSAR-based V2X ecosystem for a software-defined vehicle — FreeRTOS, ADAS (lane keeping, driver monitoring), FOTA updates and a secure bootloader with rollback.
```

## 9. Volunteering, Languages, Certifications
- **Volunteering:** Treasurer, IEEE student branch, Minia University (your dates). "Managed a budget of more than $10k."
- **Languages:** Arabic (Native or bilingual) · English (choose honestly; after IELTS, add the score).
- **Certifications:** keep "Zephyr Technical Contributor".

## 10. Featured
Profile → Add section → Featured → Add a link. In this order:
1. `github.com/Abd002/GSOC-2026`: the GSoC 2026 final report
2. `github.com/Abd002/cosmic-printers`: the code
3. `github.com/pop-os/cosmic-settings/pull/2182`: the COSMIC Settings Printers page PR
4. Later: the flagship KV store repo

## 11. Contact info and open to work
- **Contact info → Website:** `https://github.com/Abd002`, type "Portfolio".
- **Open to work:** choose **Recruiters only**, so there's no green banner.
  - **Job titles:** Software Engineer · Systems Software Engineer · Rust Engineer · Embedded Software Engineer · Firmware Engineer
  - **Workplace:** Remote · On-site · Hybrid
  - **Locations:** Remote, Germany, Netherlands, Ireland, United Kingdom, Sweden, UAE (the countries ranked in [07](../07-Strategy-and-Roadmap.md#2-target-countries-ranked))
  - **Start date:** flexible

## 12. Order to do it in (about 1 hour)
1. Name spelling, then the headline (§2)
2. About (§3)
3. Experience: add GSoC, rewrite EKSON, add ODC (§4)
4. Education (§8)
5. Projects (§5)
6. Skills, then pin the top 5 (§6)
7. Honors, volunteering, languages (§7, §9)
8. Featured (§10)
9. Contact info and open to work (§11)
10. Save to PDF again and compare with this file.
