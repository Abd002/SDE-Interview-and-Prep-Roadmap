# LinkedIn: what to update, with ready-to-paste text

This file compares the LinkedIn profile (the "Save to PDF" export from **12 Oct 2026**) with the [CVs](README.md). Every fact below comes from **[facts.md](facts.md)**, the record built from the interview on 11 Oct 2026. Nothing is new or inflated.

**When the facts change, update facts.md first, then the CVs and LinkedIn.** Recruiters check that the dates match.

## 0. Fix these first (about 20 minutes)
1. **Headline.** It now says "Embedded Linux Systems Intern at Orange Digital Center Egypt". LinkedIn changed it on its own when you added the internship. Paste headline A from [§2](#2-headline). **This is the most urgent fix**: the headline shows under your name everywhere, and right now it says you're an intern.
   - When you add or edit a position, LinkedIn asks "Update your headline?" or ticks a box for it. Always untick it.
2. **EKSON entry.** It still says "modern C++/Qt desktop control application" and "fewer threads". **That's wrong**: the app is PyQt5 and the gain came from asyncio. Replace the title and the whole description with [§4.2](#42-ekson).
3. **About.** It still says "C++/Qt" and "3-DoF" only, and the paragraphs run together ("devices.In Google", "upstream.At EKSON"). Replace it with [§3](#3-about), and press Enter twice between paragraphs.
4. **Google Summer of Code entry.** It doesn't mention the Printers page, the main goal, and its wording doesn't follow the program's rules. Change the title, clear the employment type and replace the description with [§4.1](#41-google-summer-of-code-2026).
5. **Google Summer of Code wording everywhere.** Follow [§2.1](#21-google-summer-of-code-rules) in the headline, Experience, Honors and Featured.

## 1. What is done and what is left

| Section | On LinkedIn now (12 Oct 2026) | Status and what to do |
|---|---|---|
| **Name** | Abdelrahman Khalifa | ✅ Done. |
| **Headline** | "Embedded Linux Systems Intern at Orange Digital Center Egypt" | ❌ **Fix now.** Paste A from [§2](#2-headline). |
| **Location** | Qesm El Maadi, Cairo, Egypt | ⚠️ Change it to **Cairo, Egypt**. Recruiters search by city, and the district adds nothing. |
| **About** | Old text: "C++/Qt … 40% faster", 3-DoF only, paragraphs joined | ❌ Replace with [§3](#3-about). |
| **Top skills** (shown under About) | Rust, CUPS, IPC | ⚠️ Pin **Rust · C++ · Linux · Embedded Systems · Zephyr RTOS** ([§6](#6-skills)). CUPS and IPC are too narrow to lead with. |
| **Experience: EKSON** | "Embedded System Engineer", C++/Qt app, 3-DoF, "fewer threads" | ❌ Title **Embedded Software Engineer**, employment type **Part-time**, description [§4.2](#42-ekson). |
| **Experience: Google Summer of Code 2026** | ✅ Added (The Linux Foundation, May–Oct 2026) | ⚠️ Title **Google Summer of Code 2026 Contributor**, employment type **empty**, description [§4.1](#41-google-summer-of-code-2026), which leads with the Printers page. |
| **Experience: Orange Digital Center** | ✅ Added; "kernel modules, device drivers"; 100% final evaluation | ⚠️ Replace the first line with [§4.3](#43-orange-digital-center-internship) ("wrote a Linux kernel module"). Keep the 100% line. |
| **Education** | "Bachelor's degree, Computer Engineering", Oct 2020 – Jun 2025, no grade | ❌ Field of study **Computer and Systems Engineering**, grade, activities, description → [§8](#8-education). |
| **Honors & awards** | ✅ Google Summer of Code 2026 Contributor (check the issuer, [§7](#7-honors--awards)), ✅ Codeforces Expert | ❌ Add **4-time ECPC Finalist (2021–2024)** → [§7](#7-honors--awards). |
| **Languages** | ✅ Arabic (Native), English (Full professional) | ✅ Done. |
| **Certifications** | ✅ Zephyr Technical Contributor | ✅ Keep. |
| **Contact info** | ✅ Email, LinkedIn, GitHub (Portfolio) | ✅ Done. |
| **Projects** | Not in the PDF export | Open the profile and check. Add the ones from [§5](#5-projects) that are missing. |
| **Skills** | Only the 3 top skills are in the PDF | Add the list in [§6](#6-skills). |
| **Volunteering** | ❌ Not in the export | Add IEEE Student Branch Treasurer → [§9](#9-volunteering-languages-certifications). |
| **Featured** | Not in the PDF export | Pin the Google Summer of Code report, cosmic-printers and the COSMIC Settings PR → [§10](#10-featured). |
| **Open to work** | ? | Turn it on for **recruiters only** → [§11](#11-contact-info-and-open-to-work). |
| **Custom URL** | ✅ `linkedin.com/in/abd002` | ✅ Done. |

**Never on LinkedIn:** "sole" or "only software engineer" for EKSON, the Deloitte mentorship, the Winter of Code lp/lpstat project, and any "C++/Qt" wording for the EKSON app (it is PyQt5).

## 2. Headline
**Why Google Summer of Code goes first.** LinkedIn shows only about the **first 60 characters** in search results, comments and messages, so the first words are the ones people see. The limit for the whole headline is 220 characters.

Pick one:

**A (recommended, general, 191 characters):**
```
Google Summer of Code 2026 Contributor, The Linux Foundation | Software Engineer | Rust · C++ · Linux · Zephyr RTOS | Embedded Software Engineer @ EKSON | Codeforces Expert · 4x ECPC Finalist
```
**B (systems/Rust focus, 190 characters):**
```
Google Summer of Code 2026 Contributor, The Linux Foundation (OpenPrinting) | Systems Software Engineer | Rust · C · Linux | Open Source: Zephyr, libcups, cups-rs, Clippy | Codeforces Expert
```

### 2.1 Google Summer of Code rules
These come from the program's own "Tips for Resumes & Jobs", and they apply to the CVs, LinkedIn and anything else public:
- **Always write "Google Summer of Code 2026 Contributor", followed by the organization:** The Linux Foundation (OpenPrinting).
- **Never write "GSoC"**, and not "GSoC'26" either. Not everyone knows the acronym. The only exception is the report's URL, `github.com/Abd002/GSOC-2026`, because that is the repo's real name.
- **You were not an employee or intern** of Google, the program or The Linux Foundation. You took part in the program as a contributor to an open-source organization. Recruiters check this, and the program's admins only confirm that you took part successfully. So:
  - never "Software Engineer at Google", "Intern at The Linux Foundation" or "@ The Linux Foundation";
  - leave the LinkedIn **employment type** empty, because every option (Seasonal, Internship…) means a job;
  - in interviews, say "I was a Google Summer of Code contributor with The Linux Foundation's OpenPrinting project".
- **Link the work:** the report, the code and the upstream PRs (Experience description and [§10](#10-featured)).
- **Ask your org:** some organizations have a preferred wording. Message Till Kamppeter (OpenPrinting) and ask whether The Linux Foundation / OpenPrinting wants it written a certain way, then update this file and [facts.md](facts.md).
- **Phone and email:** they are on every CV. On LinkedIn, add the phone under **Contact info** (only your connections see it).
- **Length:** send only the 1-page CVs. The 2-page master is the source.
- **Work permit:** apply only where you can legally work, or where the company sponsors a visa. Check the Visa column in the [Notion tracker](https://app.notion.com/p/65cf33df29f64fcdb0191c3a6522bb30).
- **Apply early:** don't wait for the deadline.

## 3. About
Limit: 2,600 characters. This text is about 1,500. **Press Enter twice between paragraphs**, so each one stands apart (in your current About they run together).
```
I'm a software engineer who works close to the system: Rust, C and modern C++ on Linux and embedded devices.

As a Google Summer of Code 2026 Contributor with The Linux Foundation (OpenPrinting), I built the Printers page for COSMIC Settings in Rust, plus a standalone printers app with the same UI. Behind it are five crates: an async client, and a CUPS/IPP/DNS-SD backend that runs as a varlink service in the settings daemon, so a crash in C code can't take down Settings. Along the way I ported cups-rs to libcups3 and fixed DNS-SD crashes in libcups: 7 pull requests merged upstream. I still maintain the project.

At EKSON I work on 3-DoF and 6-DoF pneumatic motion simulators. I wrote the ESP32-S3 firmware and moved it from FreeRTOS to Zephyr RTOS, with PID valve control and IMU feedback. I also built the PyQt5 desktop app that drives the simulator (about 40% lower CPU use and latency after I used asyncio to wait for ESP32 and server messages at the same time, off the UI thread), plus remote control and firmware updates through a small Node.js backend.

My first open-source contribution was to Zephyr RTOS (IPv4 multicast loopback, merged). I've since contributed to the Boa JavaScript engine and Rust Clippy.

Competitive programming keeps my problem solving sharp: Codeforces Expert and 4-time ECPC finalist.

I'm looking for systems, Linux, embedded and backend software roles, remote or with relocation.

GitHub: github.com/Abd002
Email: abdelrahman.khalifa.gad@gmail.com
```

## 4. Experience
Add the entries newest first, so LinkedIn sorts them correctly.

### 4.1 Google Summer of Code 2026
- **Title:** Google Summer of Code 2026 Contributor
- **Company or organization:** The Linux Foundation (OpenPrinting goes in the description)
- **Employment type:** leave it **empty** (it is optional). You were a program contributor, not an employee or intern ([§2.1](#21-google-summer-of-code-rules)).
- **Location:** Remote
- **Dates:** May 2026 – Oct 2026
- **Description:**
```
Google Summer of Code 2026 Contributor with The Linux Foundation (OpenPrinting), an open-source contribution through the Google Summer of Code program.

Printers page for COSMIC Settings, in Rust, mentored by Till Kamppeter, Mintu Gogoi, Michael Murphy and Titiksha Bansal (OpenPrinting and System76). Passed the final evaluation; I still maintain the project.

• Built the Printers page for COSMIC Settings and a standalone printers app with the same UI: printers grouped by device, status and supply levels, print queue control, test pages, live updates, and an Add Printer flow that sets up legacy printers through Printer Applications instead of PPD drivers (cosmic-settings #2182, in review).
• Designed the stack as 5 Rust crates: shared types, an async varlink client, a CUPS/IPP/DNS-SD and Printer Application backend, a shared UI (iced/libcosmic) and a standalone app.
• Ran the backend as a varlink IPC service in cosmic-settings-daemon, so a crash in native C code can't take down the Settings app.
• Ported cups-rs to libcups3 (CUPS 2 and 3 builds with CI), wrote FFI bindings for the libcups3 DNS-SD API, and fixed crashes and a client leak in libcups: 7 PRs merged upstream.
• Tested on real HP printers; CI checks formatting, Clippy and tests on several architectures with virtual IPP printers (ippeveprinter).

Google Summer of Code final report: github.com/Abd002/GSOC-2026
Code: github.com/Abd002/cosmic-printers
```
- **Skills:** Rust · Linux · CUPS · Inter-Process Communication (IPC) · FFI · Open-Source Development

### 4.2 EKSON
- **Title:** Embedded Software Engineer
- **Company:** EKSON Technology
- **Employment type:** Part-time
- **Location type:** Remote (Cairo, Egypt)
- **Dates:** Aug 2025 – Present
- **Description** (replace the current paragraph):
```
Software for 3-DoF and 6-DoF pneumatic motion simulators for training and gaming: firmware, desktop app, web backend and CI.

• Wrote the ESP32-S3 firmware and migrated it from ESP-IDF/FreeRTOS to Zephyr RTOS for more deterministic timing, devicetree-based drivers and easier porting.
• Closed-loop PID control of the pneumatic valves with feedback from an MPU6050 IMU over I2C (calibration + Mahony filter), safety stops and a watchdog; UART protocol to the PC.
• Built the PyQt5 desktop control app and cut its CPU usage and latency by about 40% (measured) by using asyncio to wait for messages from the ESP32 (serial) and the server at the same time, with processing in background threads, off the UI thread.
• Remote operation: web app → Node.js/Express + MongoDB backend → the desktop app polls the REST API → UART → the simulator.
• Firmware updates: new firmware uploaded on the web is downloaded by the desktop app and flashed with esptool. GitHub Actions CI for builds and tests.
• Unity proof of concept that streams game motion to the simulator.
```
- **Skills:** Zephyr RTOS · Embedded C · ESP32 · Python · asyncio · PyQt5 · Node.js

### 4.3 Orange Digital Center internship
- **Title:** Embedded Linux Systems Intern
- **Company:** Orange Digital Center Egypt (the company page you already picked)
- **Employment type:** Internship
- **Dates:** Dec 2024 – Jan 2025
- **Description:**
```
• Built Linux images with Yocto and Buildroot and wrote a Linux kernel module; worked with device trees, root file systems and hardware flashing.
• Achieved a 100% score in the final internship evaluation.
```
- **Skills:** Embedded Linux · Yocto · Buildroot · Linux Device Drivers

## 5. Projects
Profile → Add section → Projects. For each project, set **"Associated with"** where it fits and paste the link.

| # | Name | Associated with | Description (paste) | Link |
|---|---|---|---|---|
| 1 | COSMIC Printers (Rust) | Google Summer of Code | Printer management for the COSMIC desktop: 5 crates, async varlink client, CUPS/IPP/DNS-SD backend, shared UI for Settings and a standalone app. | github.com/Abd002/cosmic-printers |
| 2 | cups-rs: CUPS 3 support | Google Summer of Code | Ported cups-rs to libcups3 (CUPS 2 + 3 builds and CI); IPP management operations, Printer Application support, DNS-SD discovery, lpoptions. PRs #18–#22, merged. | github.com/OpenPrinting/cups-rs/pull/18 |
| 3 | libcups: DNS-SD crash fixes (C) | Google Summer of Code | Fixed crashes in cupsDNSSDDelete() when Avahi fails to initialize, and a leaked client in the Avahi DNS-SD code. PRs #164 and #165, merged. | github.com/OpenPrinting/libcups/pull/165 |
| 4 | Zephyr RTOS: IP_MULTICAST_LOOP | — | My first open-source contribution (Mar 2025): implemented the IP_MULTICAST_LOOP socket option for IPv4 across 6 networking modules; merged upstream. | github.com/zephyrproject-rtos/zephyr/issues/86977 |
| 5 | Boa JavaScript engine: faster Latin1 code points | — | Optimized JsStr::code_points() for Latin1 strings, avoiding UTF-16 conversion; with tests. Merged. | github.com/boa-dev/boa/pull/4553 |
| 6 | Rust Clippy: ref_as_ptr fix | — | Fixed ref_as_ptr false positives for non-temporary references in let/const. Merged. | github.com/rust-lang/rust-clippy/pull/16214 |
| 7 | AUTOSAR-Based V2X Vehicle (graduation project) | Minia University | Team project on STM32. My part: the firmware update path (an ESP32/Raspberry Pi gateway sends the image over UART) and a dual-bank bootloader with CRC check and rollback. | github.com/Abd002/Graduation-Project |
| 8 | IoT Device Communication System | — | C++ framework for TCP unicast and UDP multicast between a Raspberry Pi 4 server and QEMU clients; Yocto cross-compilation. | github.com/Abd002/IoT-Comm-System-RPi4-QEMU |
| 9 | Seat Heater Control System | — | FreeRTOS real-time controller on Tiva C: temperature monitoring, heater-level control, UART diagnostics, mutexes and event flags. | github.com/Abd002/SeatHeaterControlSystem |
| later | Raft KV store in Rust (flagship) | — | Add it when the repo is public (study plan step 60), and update the text at each milestone. | — |

## 6. Skills
Add these (LinkedIn allows 100). Then **pin the top 5:** Rust · C++ · Linux · Embedded Systems · Zephyr RTOS.

```
Rust, C++, C, Python, asyncio, Linux, Embedded Systems, Zephyr RTOS, FreeRTOS, Embedded C, Embedded Linux, Yocto Project, Buildroot, Linux Device Drivers, Linux Kernel, PyQt, Node.js, Express.js, MongoDB, REST APIs, Multithreading, Asynchronous Programming, Inter-Process Communication (IPC), CUPS, Networking, TCP/IP, Git, GitHub, GitHub Actions, CMake, Continuous Integration (CI), Unit Testing, Debugging, Code Review, Open-Source Development, Data Structures, Algorithms, Competitive Programming, AUTOSAR, Bootloaders, PID Control, ARM Cortex-M, STM32, ESP32, UART, I2C, SPI, CAN Bus
```

## 7. Honors & awards
| Title | Issuer | Date | Description |
|---|---|---|---|
| Google Summer of Code 2026 Contributor | Google Summer of Code program | Oct 2026 | Google Summer of Code 2026 Contributor with The Linux Foundation (OpenPrinting): Printers page for COSMIC Settings in Rust; passed the final evaluation; 7 PRs merged upstream. |
| Codeforces Expert | Codeforces | (your date) | Handle _Khalifa: codeforces.com/profile/_Khalifa |
| 4-time ECPC Finalist | Egyptian Collegiate Programming Contest (ECPC) | 2021–2024 | Team finalist four years in a row. |

## 8. Education
- **School:** Minia University
- **Degree:** Bachelor of Engineering (B.Sc.)
- **Field of study:** Computer and Systems Engineering
- **Dates:** 2020 – 2025
- **Grade:** Very Good (84.6%) with Honors
- **Activities:** IEEE student branch (Treasurer) · ECPC finalist (4 times)
- **Description:**
```
Graduation project: AUTOSAR-based V2X vehicle prototype on STM32 (team). My part was the firmware update path, where an ESP32/Raspberry Pi gateway sends the new image over UART, and a dual-bank bootloader that checks the CRC and rolls back on failure. I also studied the Trampoline OSEK/VDX RTOS and helped the team start on it.
```

## 9. Volunteering, Languages, Certifications
- **Volunteering:** Treasurer, IEEE student branch, Minia University. "Managed a budget of more than $10k."
- **Languages:** Arabic (Native or bilingual) · English (Full professional, as on your profile; add the IELTS score after you take it).
- **Certifications:** keep "Zephyr Technical Contributor".

## 10. Featured
Profile → Add section → Featured → Add a link. In this order:
1. `github.com/Abd002/GSOC-2026`: the Google Summer of Code 2026 final report (title it "Google Summer of Code 2026: Printers page for COSMIC Settings")
2. `github.com/Abd002/cosmic-printers`: the code
3. `github.com/pop-os/cosmic-settings/pull/2182`: the COSMIC Settings Printers page PR
4. Later: the flagship KV store repo

## 11. Contact info and open to work
- **Contact info → Website:** `https://github.com/Abd002`, type "Portfolio".
- **Contact info → Phone:** `+20 114 250 5042`, type Mobile. Only your connections see it; the program's tips say to always give a phone and email.
- **Open to work:** choose **Recruiters only**, so there's no green banner.
  - **Job titles:** Software Engineer · Systems Software Engineer · Rust Engineer · Embedded Software Engineer · Firmware Engineer · Backend Engineer
  - **Workplace:** Remote · On-site · Hybrid
  - **Locations:** Remote, Germany, Netherlands, Ireland, United Kingdom, Sweden, UAE (the countries ranked in [07](../07-Strategy-and-Roadmap.md#2-target-countries-ranked))
  - **Start date:** flexible

## 12. Order to do it in (about 1 hour)
1. Name spelling, then the headline (§2)
2. About (§3)
3. Experience: fix the Google Summer of Code entry, rewrite EKSON, add Orange Digital Center (§4)
4. Education (§8)
5. Projects (§5)
6. Skills, then pin the top 5 (§6)
7. Honors, volunteering, languages (§7, §9)
8. Featured (§10)
9. Contact info and open to work (§11)
10. Save to PDF again and compare with this file.
