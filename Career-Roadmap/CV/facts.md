# Career facts: the single source of truth

Every CV, LinkedIn text and interview answer must match this file. It was built from an interview on 11 Oct 2026 and checked against public sources (GitHub, the GSoC report).

**If something changes, update this file first, then the CVs and LinkedIn.**

## Identity
| Item | Fact |
|---|---|
| Name (use everywhere) | **Abdelrahman Khalifa** |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone | +20 114 250 5042 (kept on the CVs) |
| Location | Cairo, Egypt |
| Links | linkedin.com/in/abd002 · github.com/Abd002 · codeforces.com/profile/_Khalifa |
| Military service | **Completed** (Egypt). During service he kept working at EKSON part-time/remote. |
| English | Professional working proficiency (IELTS not taken yet) |
| Languages, self-rated | **Rust, modern C++, C: strong** · Python: good |

## Experience

### EKSON: Embedded Software Engineer · Aug 2025 – Present
Part-time/remote during military service; still part-time now.

- **Only software engineer.** He owned firmware, desktop app, web app and CI. The rest of the team was hardware and mechanical.
- **Product:** pneumatic motion simulators, 3-DoF and 6-DoF, for training and gaming.
- **Firmware** (he wrote all of it):
  - ESP32-S3, first on **ESP-IDF/FreeRTOS**, then **migrated to Zephyr RTOS**.
  - Why Zephyr:
    - a real production-grade RTOS;
    - more deterministic timing for motion control;
    - devicetree and portable drivers;
    - maintainability (west, structure);
    - easier to move to other boards later.
  - Drives pneumatic **valves/pressure** to move the actuators.
  - **Closed-loop PID** control with IMU feedback.
  - Reads sensors: **MPU6050 IMU over I2C**, with calibration and a **Mahony filter** for orientation.
  - **Safety stop:** e-stop, limits, watchdog.
  - Talks to the PC over **UART** (serial protocol).
  - Not known: the PID loop rate. **Never quote a number.**
- **Desktop control app: PyQt5 (Python).** It is **not** C++/Qt and **never** had a C++/QML version.
  - Sends commands and receives telemetry over UART.
  - **About 40% lower CPU usage/latency**, measured, after moving serial I/O and processing to **async/background threads** off the UI thread.
- **Remote operation:**
  - The path is web app → **Node.js/Express** server with **MongoDB** → the desktop app **polls the REST API** → UART → microcontroller.
  - Used for remote control and session/telemetry data.
- **FOTA (firmware update):**
  - The new firmware is uploaded in the web app.
  - The desktop app downloads it via the REST API.
  - It then flashes the ESP32-S3 with **esptool.py**.
- **CI:** GitHub Actions for build and test during development.
- **Unity proof of concept:** a game scene that sent motion data to the simulator, to prove in-house simulator sessions could be built. Low priority; LinkedIn only.
- **His own view:** the desktop and web code was built without a senior to guide it, so he doesn't consider it his best code. Present it as **ownership and end-to-end delivery**, not as a code-quality showcase.

### Google Summer of Code 2026: The Linux Foundation / OpenPrinting · May 2026 – Oct 2026
- **Outcome:** passed the final evaluation. He is **still maintaining** cosmic-printers.
- **Project:** a printer setup tool for the **COSMIC desktop** (System76), in **Rust**.
- **Mentors:** Till Kamppeter, Mintu Gogoi, Michael Murphy, Titiksha Bansal.
- **5 crates:**
  - `printers-core`: types, grouping queues into physical printers;
  - `printers-client`: async varlink client;
  - `printers-server`: CUPS, IPP, DNS-SD and Printer Application backend;
  - `printers-ui`: iced/libcosmic;
  - `printers-app`: the standalone app.
- **Backend as a separate process:** runs inside **cosmic-settings-daemon** over **varlink** IPC, so a crash in the C/FFI code can't take down the Settings app. The standalone app falls back to running the server in-process.
- **7 PRs merged upstream:**
  - **cups-rs #18–#22:** port to libcups3, CUPS 2 + 3 builds and CI, IPP management, DNS-SD FFI bindings, lpoptions;
  - **libcups #164, #165:** DNS-SD/Avahi crash fixes and a leaked client.
- **In review (not merged):** cosmic-settings #2182 and cosmic-settings-daemon #188.
- **Testing:** real HP printers (PageWide, LaserJet; DesignJet 800 through a Printer Application). CI runs `ippeveprinter` on several architectures.

### Orange Digital Center (ODC): Embedded Linux Systems Intern · Dec 2023 – Jan 2024
- Built Linux images with **Yocto and Buildroot**.
- **Wrote a kernel module / device driver.**
- Worked with device trees, root file systems and flashing hardware.

## Open source (all merged unless noted)
| What | When | Status | Link |
|---|---|---|---|
| **Zephyr RTOS:** `IP_MULTICAST_LOOP` socket option for IPv4 in `net_context` (6 networking modules, 150+ lines). His **first open-source contribution**, a "good first issue". | **Mar 2025** | Merged, commit b117036; issue #86977, PR #87167 | github.com/zephyrproject-rtos/zephyr/issues/86977 |
| **Boa** (JavaScript engine in Rust): `JsStr::code_points()` fast path for Latin1 strings, with tests | Dec 2025 | **Merged** | boa-dev/boa #4553 |
| **Rust Clippy:** fixed `ref_as_ptr` false positives for non-temporary references in `let`/`const` | Dec 2025 | **Merged** | rust-lang/rust-clippy #16214 |
| **cups-rs** (OpenPrinting) | 2026 | #18–#22 merged | GSoC |
| **libcups** (OpenPrinting, C) | 2026 | #164, #165 merged | GSoC |
| **COSMIC** settings + daemon | 2026 | **In review** | #2182, #188 |

**Removed from all documents:**
- the "Winter of Code 2026" label;
- the lp/lpstat PRs (not merged);
- the "kernel synchronization fix" wording.

**Zephyr "Technical Contributor":** a real certification/badge. Keep it on LinkedIn.

## Education
- **B.Sc. Computer and Systems Engineering, Minia University.** 2020 – 2025, **Very Good (84.6%) with Honors**.
- **Graduation project:** AUTOSAR-based V2X / software-defined vehicle prototype, team project, **STM32**.
  - **His part: FOTA and the bootloader.**
    - An ESP32/Raspberry Pi gateway downloads the image and sends it to the STM32 over **UART**. CAN was tried first, but the CAN hardware caused too many problems.
    - **Two banks with rollback.**
    - **CRC/signature check** before jumping to the new image.
  - **Also:** studied **Trampoline** (an OSEK/VDX RTOS) in depth and helped the RTOS/firmware teammate start on it. The team later moved to **FreeRTOS**.
  - **Honest lesson:** "I couldn't keep up with him, and my lack of experience then made the CAN path fail. I learned a lot."

## Achievements and activities
- **Codeforces Expert** (max rating 1600–1899), handle _Khalifa.
- **4-time ECPC finalist, 2021–2024** (Egyptian Collegiate Programming Contest).
- **IEEE student branch Treasurer:** managed a budget of more than $10k.
- **Removed:** the Deloitte mentorship (not to be listed).

## Projects to keep
- **Strongest:**
  - COSMIC printers (GSoC);
  - the graduation project (FOTA/bootloader);
  - IoT TCP/UDP framework (RPi 4 + QEMU + Yocto);
  - seat heater (FreeRTOS, Tiva C);
  - AUTOSAR PORT/GPIO drivers;
  - traffic light (Verilog FPGA);
  - door locker.
- **Others (master CV only):**
  - OS simulator (Java);
  - inventory system (C#);
  - sports management web app (team);
  - function solver (Python);
  - phonebook (MERN);
  - team apps: Sarh Al-Tafawuq, Nafaqati;
  - chess, children-safety app, face-mask CNN, smart garage.

## Target roles
All four, in this order:
1. Systems / Rust / Linux;
2. Embedded / firmware;
3. General SWE / Big Tech;
4. Backend / infrastructure.
