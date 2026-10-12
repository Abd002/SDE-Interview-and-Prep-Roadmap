# Interview talking guide

**What this is for:** what to say about yourself and your work in interviews, plus the names of the concepts you use, each explained in plain words.

**Where it comes from:** the interview on 11 Oct 2026. Every fact matches **[facts.md](facts.md)**, so if you say it from this guide, it is also on your CV.

**How to use it:**
1. Learn the **cheat card** (§1) and the **"Tell me about yourself"** answers (§2) almost by heart.
2. Learn the **stories** (§3) as bullet points, not word by word.
3. Read the **project deep dives** (§4) and the **glossary** (§5) the day before each interview.
4. Follow the **practice plan** (§8). Talking about yourself is a skill: it gets easier by saying it out loud, not by reading.

---

## 0. Rules for talking about yourself

You said the hard part is talking about yourself. These rules make it easier.

1. **Say "I", not "we".** The interviewer is hiring you. "We migrated to Zephyr" hides your work. "I migrated the firmware to Zephyr" shows it. Use "we" only for real team work, and then say what *your* part was.
2. **Use one shape for every answer: What → How → Result.**
   - *What* was the problem (1 sentence).
   - *How* did you solve it (2–3 sentences, with the technical names).
   - *Result* (a number, or what changed).
   - Then stop and let them ask.
3. **Short first, details on request.** Answer in 30–60 seconds, then say: *"I can go deeper into any part of that."* The interviewer picks the direction, so you never have to guess.
4. **Facts are not bragging.** "7 PRs merged upstream" or "the only software engineer" are facts. Say them plainly, the same way you'd say the date.
5. **"I don't remember" is a good answer when it's true.** Example: *"I don't remember the exact loop rate. I'd check it in the code, but the idea was …"* Never guess a number.
6. **Pause instead of filling.** A 2-second pause to think sounds confident. Say *"Good question, let me think for a second."*
7. **Name the concept, then explain it in one line.** For example: *"I used a Mahony filter, which fuses the gyroscope and the accelerometer to get a stable orientation."* This shows you know the name and that you understand it.

---

## 1. Cheat card: one screen to read before every interview

| Item | Say this |
|---|---|
| **Who I am** | Software engineer: Rust, C, modern C++ on Linux and embedded. |
| **Best thing** | Google Summer of Code 2026 with The Linux Foundation (OpenPrinting): **the Printers page in COSMIC Settings**, in Rust (PR #2182, in review). **7 PRs merged upstream** (cups-rs, libcups). Passed the final evaluation; I still maintain it. |
| **Job** | **EKSON, Aug 2025 – now, part-time.** **The only software engineer** on 3-DoF and 6-DoF pneumatic motion simulators. Firmware (ESP32-S3, Zephyr), desktop app (PyQt5), web backend (Node.js/Express + MongoDB), CI. |
| **Numbers** | ~40% lower CPU/latency (PyQt5 app, measured) · 5 Rust crates · 7 merged PRs · 6 Zephyr networking modules · Codeforces Expert · 4× ECPC finalist (2021–2024) · 84.6% with Honors |
| **First open-source PR** | Zephyr RTOS, **March 2025**: `IP_MULTICAST_LOOP` socket option (issue #86977). A "good first issue". |
| **Other open source** | Boa (JavaScript engine in Rust), Rust Clippy: both merged, Dec 2025. |
| **Internship** | Orange Digital Center, Dec 2023 – Jan 2024: Yocto, Buildroot, wrote a kernel module. |
| **Graduation project** | STM32 vehicle (team). My part: firmware update over UART + dual-bank bootloader with rollback. CAN failed first: my lesson story. |
| **Never say** | "C++/Qt app" (it's **PyQt5**) · Deloitte · Winter of Code · lp/lpstat · a PID loop rate number · "Zephyr 2024" |

---

## 2. "Tell me about yourself"

This is almost always the first question. The structure is: **now → before → why I'm here**.

### 2.1 Thirty seconds (phone screen, recruiter)
> I'm a software engineer working mostly in Rust, C and C++ on Linux and embedded systems. This summer I did Google Summer of Code with The Linux Foundation, where I built the Printers page for the COSMIC desktop's Settings app in Rust and got seven pull requests merged into the upstream CUPS libraries. I also work at EKSON, a motion-simulator startup, where I'm the only software engineer: I wrote the firmware, the desktop app and the backend. I'm looking for a role where I can work on systems software full time.

### 2.2 Sixty seconds (start of a technical interview)
> I'm a computer and systems engineer from Minia University, and I work close to the system: Rust, C and modern C++, on Linux and microcontrollers.
>
> Right now I have two things. First, Google Summer of Code 2026 with The Linux Foundation's OpenPrinting project. I built the Printers page in COSMIC Settings: you can see your printers, their ink and status, manage the print queue, and add old printers. Under it are five Rust crates, and the C library code runs in a separate process behind a varlink service, so a crash there can't take down the Settings app. Along the way I got seven PRs merged upstream in cups-rs and libcups.
>
> Second, I'm the only software engineer at EKSON, which builds pneumatic motion simulators. I wrote the ESP32 firmware and moved it from FreeRTOS to Zephyr, built the PyQt5 control app (I cut its CPU use and latency by about 40%), and built the web backend for remote control and firmware updates.
>
> Outside that, I'm a Codeforces Expert and was an ECPC finalist four times. I'm now looking for a full-time systems or embedded role.

### 2.3 Two minutes (when they say "walk me through your background")
Use the 60-second version, and add one sentence to each part:
- **Start:** "I got into low-level work through competitive programming and embedded courses at university; my graduation project was the bootloader and firmware-update part of an STM32 vehicle prototype."
- **Open source:** "My first open-source contribution was to Zephyr RTOS in March 2025, a networking socket option. That gave me the confidence to apply to GSoC."
- **EKSON:** "Being the only software person taught me to own everything end to end: from the PID loop on the microcontroller to the database on the server."

### 2.4 Change the first sentence to fit the role
| Role | First sentence |
|---|---|
| **Systems / Rust / Linux** | "I'm a systems software engineer. Most of my recent work is Rust on Linux: IPC, FFI to C libraries, and upstream open source." |
| **Embedded / firmware** | "I'm an embedded software engineer. I write and own the Zephyr RTOS firmware for pneumatic motion simulators at EKSON." |
| **General SWE / Big Tech** | "I'm a software engineer with a strong algorithms background (Codeforces Expert) and real systems work in Rust and C++." |
| **Backend** | "I'm a software engineer who has built a full product path: firmware, desktop app, and a Node.js and MongoDB backend that controls devices remotely." |

### 2.5 Short answers to common follow-ups
- **"Why are you leaving / looking?"** "EKSON is part-time and I'm the only software engineer there. I want to work full-time in a team with senior engineers, where I can learn faster and work on bigger systems."
- **"Why this company?"** Prepare one real reason per company: a product you use, an open-source project they own, or the tech stack. Example: *"You maintain [project], and I've already worked with the Linux printing stack upstream."*
- **"Where do you see yourself in 3 years?"** "A strong systems engineer who owns a component in production and reviews other people's code. I want depth first."
- **"What's your notice period?"** "I'm part-time now, so I can start quickly: [your real answer]."
- **"Military service?"** (Egyptian employers) "Completed."

---

## 3. Your stories (STAR)

**STAR** = **S**ituation, **T**ask, **A**ction, **R**esult. Most behavioral questions ("tell me about a time when…") are answered with one of these 8 stories. Learn the bullets, then tell them in your own words.

| Question they ask | Story to use |
|---|---|
| Hardest technical problem / something you're proud of | 3.1 Zephyr migration, or 3.5 GSoC Printers page |
| Performance improvement / debugging | 3.3 The 40% fix |
| Ownership / working without guidance | 3.2 Sole software engineer |
| Designing a system end to end | 3.4 Remote control and firmware updates |
| Working with others / code review / feedback | 3.5 GSoC, 3.6 libcups fixes |
| Learning something new fast | 3.7 First Zephyr contribution |
| Failure / mistake / weakness | 3.8 Graduation project, CAN |
| Helping a teammate | 3.8 (Trampoline) |

### 3.1 Migrating the firmware from FreeRTOS to Zephyr
- **S:** At EKSON, the simulator firmware ran on an ESP32-S3 with ESP-IDF and FreeRTOS. We needed motion control we could trust in production, and code that could move to other boards later.
- **T:** I owned the firmware, so the decision and the migration were mine.
- **A:**
  - I chose Zephyr because it's a real production-grade RTOS with more deterministic timing, **devicetree** for hardware description, portable drivers and a clean structure with **west**.
  - I moved the valve control, the IMU reading (MPU6050 over I2C), the PID loop, the safety stop and the UART protocol to Zephyr.
- **R:** The firmware runs on Zephyr in the 3-DoF and 6-DoF simulators. Moving to another board is now mostly a devicetree change, not a code rewrite.
- **Lesson:** "Pick the platform for the product's next two years, not for the easiest first week."
- **Likely follow-ups:**
  - *Why not stay on FreeRTOS?* "FreeRTOS is only a kernel. Zephyr adds the driver model, devicetree, networking and a build system, so less of that is our own glue code."
  - *What was hard?* Say what was really hardest for you. The usual hard parts are learning devicetree and Kconfig, and moving the drivers from ESP-IDF's APIs to Zephyr's.
  - *What's the PID loop rate?* "I don't remember the exact number, so I won't guess. It ran as a fixed-period task, and the period was chosen to be faster than the valves can physically react."

### 3.2 Being the only software engineer (ownership)
- **S:** EKSON's team is hardware and mechanical engineers. I was the only software person.
- **T:** Everything with code was mine: firmware, desktop app, web backend, firmware updates, CI.
- **A:** I split the work by layers and built each one: firmware ↔ UART ↔ PyQt5 app ↔ REST ↔ Node.js server ↔ web. I set up GitHub Actions so every change was built and tested.
- **R:** A working product path, from a button on a web page to a valve moving on the simulator.
- **Honest part (say it if asked about code quality):** "I built it without a senior engineer to review it, so some of the desktop and web code isn't how I'd write it today. That's one reason I want to join a team now."

### 3.3 The 40% performance fix
- **S:** The PyQt5 desktop app was slow and used a lot of CPU. It had to wait for messages from two sides, the ESP32 over serial and the server over REST, and that waiting and the processing ran on the UI (main) thread.
- **T:** Make the app responsive and lighter, without changing what it does.
- **A:** I used **asyncio** to wait for messages from **the ESP32 and the server at the same time**. One coroutine waits for serial data from the ESP32, another waits for commands from the server; while one is waiting, the other can run. The processing runs in **background threads**, and the results go back to the UI with Qt signals. The UI thread then only draws.
- **Say it in one sentence:** "I used asyncio so the app waits for ESP32 and server messages concurrently instead of blocking, and that cut CPU use and latency by about 40%."
- **R:** About **40% lower CPU usage and latency**, measured before and after.
- **Lesson:** "Never block the UI thread. Make I/O async, so the program does useful work instead of waiting."
- **Likely follow-ups:**
  - *How did you measure?* Say exactly what you used (for example the system monitor, or timing in code). Don't make up a tool.
  - *Python has the GIL. Why did threads help?* "The GIL is released while a thread waits on I/O, like reading the serial port. So a thread blocked on I/O doesn't block the UI thread."
  - *Why not multiprocessing?* "The work was mostly waiting on I/O, not heavy computation, so async and threads were enough and simpler."
  - *Async vs threads, what's the difference?* "Async is one thread that switches to other work whenever a task would wait, for example on the serial port. Threads are separate flows the OS schedules. Async is lighter for many waits; threads are good for blocking calls you can't make async."
  - *Which async library did you use?* "Python's **asyncio**."
  - *How does asyncio work?* "There's one **event loop**. Each task is a **coroutine** (`async def`). When a coroutine reaches `await`, for example waiting for data from the ESP32, it gives control back to the loop, and the loop runs another task that's ready, like handling a message from the server. So one thread handles many waits without blocking."
  - *How did asyncio work together with Qt?* Qt has its own event loop, so the two loops must not block each other. Be ready to say which way you did it: the asyncio loop ran in a **background thread** and sent results to the UI with Qt signals, or a bridge such as `qasync` ran asyncio on Qt's loop. Say the one you really used.
  - *What would block the event loop?* "Any blocking call inside a coroutine, like a normal `time.sleep()` or a blocking serial read. Those must be awaited, or moved to a thread with `run_in_executor` / `asyncio.to_thread`."
  - *Key words to know:* event loop · coroutine · `async def` / `await` · task (`asyncio.create_task`) · `asyncio.gather` · `asyncio.Queue` · `run_in_executor`.

### 3.4 Remote control and firmware updates (system design)
- **S:** The simulators needed remote control and a way to update firmware without someone connecting a laptop by hand.
- **A:**
  - **Remote control path:** web app → **Node.js/Express** server with **MongoDB** → the desktop app **polls the REST API** for new commands → sends them over **UART** → microcontroller.
  - **Firmware update path:** new firmware is uploaded on the web → the desktop app downloads it through the REST API → flashes the ESP32-S3 with **esptool.py**.
- **R:** Remote operation and updates work through the same pipeline.
- **Likely follow-ups:**
  - *Why polling and not WebSockets?* "The desktop app starts the connection, so it works behind NAT and firewalls with no extra setup, and it was simple to build. The downside is extra delay and requests. Next I'd use a WebSocket or MQTT to push commands."
  - *What if an update fails halfway?* "esptool writes over serial, and the ESP32 ROM bootloader can always be re-entered, so you can flash again. A better design is a dual-bank OTA with rollback, like I built in my graduation project, or MCUboot."
  - *How do you know the firmware is genuine?* "Today the trust comes from the server and the user who uploads. A next step is to sign the image and verify the signature before flashing."

### 3.5 GSoC: the Printers page in COSMIC Settings
**Always start with the mission:** "My GSoC project was adding a Printers page to COSMIC Settings." The crates, varlink and FFI are *how* you did it.

- **S:** COSMIC, System76's new Rust desktop, had no way to manage printers in Settings. The printing libraries (libcups) are C code called through **FFI**. A crash in C code inside the Settings app would close the whole Settings window.
- **T:** Build the Printers page and an Add Printer flow, and design the stack under them so it's safe, reusable and testable.
- **A:**
  - I built the **Printers page**: printers grouped by physical printer, state and supply levels, the print queue (pause, resume, cancel, move a job), default printer and options, test page, live updates.
  - I built the **Add Printer flow**: old printers are set up through **Printer Applications** instead of PPD drivers, the CUPS 3 way.
  - The same UI also runs as a **standalone printers app**.
  - I split it into **5 crates**: `printers-core` (types; groups several queues into one physical printer), `printers-client` (async varlink client), `printers-server` (CUPS, IPP, DNS-SD, Printer Applications), `printers-ui` (iced/libcosmic) and `printers-app` (standalone app).
  - The server runs inside **cosmic-settings-daemon** and talks **varlink IPC**, so the C code never loads in the Settings GUI process. The standalone app falls back to running the server in-process.
  - To make this work upstream, I ported **cups-rs** to **libcups3** with CUPS 2 and 3 builds, added DNS-SD bindings, and fixed crashes in libcups.
- **R:** Passed the GSoC final evaluation, **7 PRs merged** upstream; the COSMIC PRs (#2182, #188) are in review. I still maintain the project.
- **Lesson:** "Isolate code you don't control behind a process boundary."
- **Working with mentors:** Till Kamppeter (OpenPrinting), Mintu Gogoi, Michael Murphy (System76), Titiksha Bansal. Design discussions and code review with them.

### 3.6 Fixing crashes in libcups (C)
- **S:** While testing discovery, the DNS-SD code in libcups crashed when Avahi (the Linux mDNS service) failed to start, and it leaked a client object.
- **A:** I found the crash in `cupsDNSSDDelete()`, fixed the cleanup so it works even if setup failed halfway, and fixed the leaked client. These are PRs **#164 and #165**, merged.
- **R:** libcups no longer crashes in that case; every program that uses libcups benefits.
- **Before the interview:** re-read the two PR diffs so you can describe the exact lines you changed.

### 3.7 My first open-source contribution (Zephyr)
- **S:** In March 2025 I wanted to start contributing to open source. I opened the Zephyr repo and looked at the "good first issue" list.
- **A:** I took issue **#86977**: Zephyr didn't support the `IP_MULTICAST_LOOP` socket option for IPv4. I added it in the network stack (`net_context` and the socket layer), across 6 networking modules, 150+ lines, and went through maintainer review.
- **R:** Merged upstream (commit b117036). It led to GSoC a year later.
- **What the option does:** it decides whether multicast packets a device sends are also delivered back to sockets on the same device.
- **Before the interview:** re-read PR #87167 to remember the files and the review comments.

### 3.8 A failure: CAN in the graduation project (and Trampoline)
- **S:** The graduation project was an STM32 vehicle prototype (team). My part was firmware updates and the bootloader.
- **A:**
  - I first tried to send the new firmware over **CAN**. The CAN hardware gave us too many problems, and I didn't have enough experience then to debug it in time.
  - I switched to **UART**: an ESP32/Raspberry Pi gateway downloads the image and sends it to the STM32.
  - I built a **dual-bank bootloader**: the new image goes into the inactive bank, it's checked with a CRC, and if it fails the board **rolls back** to the old image.
  - I also studied the **Trampoline** RTOS (OSEK/VDX) in depth and helped my teammate start on it. I couldn't keep up with him, and the team later moved to FreeRTOS.
- **R:** Firmware updates worked over UART with rollback.
- **Lesson:** "Get the simplest path working first, then improve it. And ask for help earlier: I spent too long on CAN alone."

---

## 4. Project deep dives

When they say "pick a project and go deep", pick **GSoC** for systems/Rust roles and **EKSON firmware** for embedded roles.

### 4.1 EKSON architecture (draw this on the whiteboard)
```
 Web app ──HTTP──▶ Node.js/Express ──▶ MongoDB
                         ▲
                         │ REST (desktop app polls)
                         │
                  PyQt5 desktop app ──esptool.py──▶ (flash firmware)
                         │
                         │ UART (serial protocol)
                         ▼
                ESP32-S3 + Zephyr RTOS
            ┌────────────┼──────────────┐
         MPU6050       PID loop      safety stop
        (I2C IMU,   ─▶ valve/pressure (e-stop, limits,
     Mahony filter)    control         watchdog)
                         │
                 pneumatic actuators (3-DoF / 6-DoF)
```
**Control loop in one breath:** read the IMU → filter it to get the orientation → compare with the target → the PID computes the valve command → drive the valves → repeat at a fixed period. A safety stop overrides everything.

### 4.2 GSoC architecture
```
 COSMIC Settings (printers-ui) ─┐                 ┌─ printers-app (standalone)
                                │ varlink IPC      │  (falls back to in-process)
                                ▼                 ▼
                  printers-client (async)
                                │
           cosmic-settings-daemon → printers-server
                                │ FFI (cups-rs)
                                ▼
              libcups3 ── IPP ──▶ printers / Printer Applications
                  └── DNS-SD (Avahi) ──▶ discovery on the network
```
**Key points to say:** process isolation for crash safety · one UI shared between Settings and the app · grouping queues into physical printers · Printer Applications instead of old PPD drivers · CI with `ippeveprinter` virtual printers on several architectures · tested on real HP printers (PageWide, LaserJet, a DesignJet 800 through a Printer Application).

### 4.3 Questions to expect, by project
| Project | Question | Short answer |
|---|---|---|
| GSoC | Why Rust? | Memory safety, a strong type system for a long-lived desktop component, and COSMIC is written in Rust. |
| GSoC | What's unsafe about FFI? | The Rust compiler can't check the C side: null pointers, who frees memory, and lifetimes. I wrap each C call in a safe Rust function that checks those things. |
| GSoC | How does printer discovery work? | Printers announce themselves with DNS-SD over mDNS; Avahi listens on Linux; libcups gives the results to my code. |
| GSoC | What would you do next? | Get the COSMIC PRs merged, more tests with real printers, and keep maintaining it. |
| EKSON | Why ESP32-S3? | Enough speed and memory for control plus communication, cheap, and good tool support. If the board was already chosen before you started, say so. |
| EKSON | How do you calibrate the IMU? | Keep it still, measure the average gyro and accelerometer offsets, and subtract them from later readings. |
| EKSON | What happens if UART messages get corrupted? | The protocol must detect it (for example a checksum) and ignore bad frames; the safety stop handles loss of communication. Say only what your protocol really does. |
| Zephyr PR | How did you test it? | Say what you did in the PR (for example Zephyr's test suite in QEMU). Re-read the PR first. |
| Graduation | How does the bootloader know the new image is good? | It checks the CRC before jumping. If the CRC is bad or the new image doesn't confirm it booted, it goes back to the old bank. |
| ODC | What did your kernel module do? | Describe it honestly: what it registered (for example a character device), and how you loaded it with `insmod` and tested it. |

---

## 5. Glossary: the concept names, in plain words

Read one group per day. Each line is what you'd say if an interviewer asked "what is X?".

### 5.1 Your own projects
| Term | Plain explanation |
|---|---|
| **CUPS** | The standard printing system on Linux and macOS. It manages print queues and sends jobs to printers. |
| **IPP** (Internet Printing Protocol) | The protocol for talking to printers over the network, built on HTTP. Used to send jobs and ask a printer its state. |
| **IPP Everywhere / driverless printing** | Modern printers describe their own abilities over IPP, so no driver is needed. |
| **PPD** | The old printer description file that CUPS used with drivers. It is being phased out. |
| **Printer Application / PAPPL** | A small program that acts like an IPP printer and drives an old printer. PAPPL is the library for writing them. It replaces PPD drivers. |
| **libcups3 / CUPS 3** | The new version of the CUPS library, with a cleaner API. I ported cups-rs to it. |
| **cups-rs** | Rust bindings for libcups (OpenPrinting). |
| **ippeveprinter** | A tool that pretends to be an IPP printer. I used it in CI to test without a real printer. |
| **DNS-SD** | DNS Service Discovery: devices announce "I'm a printer, here's my address" so others can find them. |
| **mDNS** | Multicast DNS: DNS on the local network without a DNS server. DNS-SD usually runs over it. |
| **Avahi** | The Linux service that implements mDNS/DNS-SD. |
| **IPC** | Inter-Process Communication: how two separate programs exchange messages. |
| **varlink** | A simple IPC protocol: JSON messages over a Unix socket, with an interface file that defines the methods. I used it between Settings and the daemon. |
| **D-Bus** | The older, very common Linux IPC system with a central message bus. zbus is its Rust library; zlink is a Rust varlink library. |
| **Daemon** | A background program with no window, for example cosmic-settings-daemon. |
| **FFI** | Foreign Function Interface: calling C code from Rust (or another language). |
| **Crate** | A Rust package (library or program). A workspace holds several crates. |
| **iced / libcosmic** | iced is a Rust GUI library; libcosmic is COSMIC's toolkit built on it. |
| **COSMIC** | The Linux desktop environment made by System76, written in Rust. |
| **ESP32-S3** | A microcontroller from Espressif with Wi-Fi/Bluetooth, two cores. |
| **ESP-IDF** | Espressif's official SDK for ESP32. It includes FreeRTOS. |
| **esptool.py** | Espressif's tool to flash ESP32 chips over the serial port. |
| **Zephyr RTOS** | An open-source real-time OS from the Linux Foundation, with drivers, networking, devicetree and its own build system. |
| **west** | Zephyr's command-line tool: manages the repos, builds and flashes. |
| **Devicetree** | A text file that describes the hardware (which pins, which buses, which sensors), so the driver code doesn't hardcode it. Zephyr uses it at build time, Linux at boot. |
| **Kconfig** | The configuration system (from Linux) that turns features on or off at build time. Zephyr uses it too. |
| **MPU6050** | A cheap IMU chip: 3-axis gyroscope + 3-axis accelerometer, read over I2C. |
| **IMU** | Inertial Measurement Unit: a sensor that measures rotation (gyro) and acceleration. |
| **Mahony filter** | A light algorithm that combines the gyroscope (smooth but drifts) and the accelerometer (no drift, but noisy) into a stable orientation. It uses a small PI correction, so it runs well on microcontrollers. Alternatives: Madgwick, Kalman. |
| **PID controller** | Control that computes the output from the error: **P** reacts to the error now, **I** to the error added up over time (removes a steady offset), **D** to how fast the error changes (reduces overshoot). |
| **Closed loop** | Control that measures the result (the IMU) and corrects. Open loop just sends commands without checking. |
| **Anti-windup** | Stops the I term from growing huge when the output is already at its limit. |
| **DoF** | Degrees of freedom: 3-DoF moves in 3 ways (for example pitch, roll, heave); 6-DoF adds the rest (yaw, surge, sway). |
| **Watchdog** | A hardware timer that resets the chip if the software stops "feeding" it, so a hang can't leave the valves on. |
| **E-stop** | Emergency stop: a button or signal that puts the machine in a safe state at once. |
| **FOTA / OTA** | Firmware (Over The Air) update: installing new firmware remotely. |
| **Bootloader** | The small program that runs first after reset and decides which firmware to start. |
| **Dual-bank / A/B** | Two flash areas: run from one, write the update into the other, switch only after it's verified. |
| **Rollback** | Going back to the old firmware if the new one fails. |
| **CRC** | A checksum that detects accidental corruption. It does **not** prove who made the file. |
| **Digital signature** | Proves the firmware came from you and wasn't changed (for example ECDSA). That's security, unlike a CRC. |
| **MCUboot** | A standard secure bootloader for microcontrollers, used with Zephyr. A good answer for "how would you improve your update system?". |
| **OSEK/VDX** | An automotive RTOS standard: tasks and alarms are fixed at build time (in an OIL file). |
| **Trampoline** | An open-source RTOS that implements OSEK/VDX. |
| **AUTOSAR** | The automotive software standard with layers: MCAL (drivers), basic software, RTE (middle layer), and application software components. |
| **MCAL** | Microcontroller Abstraction Layer: the lowest AUTOSAR layer, the drivers (like the PORT and GPIO drivers I wrote). |
| **Yocto** | A framework that builds a custom Linux distribution from recipes. Powerful, but complex. |
| **Buildroot** | A simpler tool that builds a small Linux image (kernel + root filesystem). |
| **Root filesystem (rootfs)** | The files Linux mounts at `/`: programs, libraries, config. |
| **Kernel module** | Code loaded into the running Linux kernel (`insmod`/`rmmod`), with an init and an exit function. Drivers are often modules. |
| **Character device driver** | A driver that exposes a device as a file in `/dev`, using functions like open, read, write. |
| **GitHub Actions / CI** | Continuous Integration: every push builds and tests the code automatically. |
| **REST API** | An HTTP interface where URLs are resources and methods (GET, POST, PUT, DELETE) are actions, usually with JSON. |
| **Polling** | The client asks the server again and again "anything new?". Simple, but adds delay and load. |
| **WebSocket / MQTT** | Ways for the server to push messages to the client at once. MQTT is popular for IoT. |
| **PyQt5** | Python bindings for the Qt GUI framework. My EKSON desktop app. |
| **Qt signals and slots** | Qt's way to send events between objects, including safely from a worker thread to the UI thread. |
| **asyncio** | Python's built-in async library: an event loop runs coroutines (`async def`) and switches between them at each `await`. I used it in the EKSON desktop app. |
| **Coroutine** | A function that can pause at `await` and continue later, so other work can run in between. |
| **GIL** | Python's Global Interpreter Lock: only one thread runs Python code at a time, but it's released during I/O. |

### 5.2 Operating systems and concurrency
| Term | Plain explanation |
|---|---|
| **Process vs thread** | A process has its own memory; threads inside one process share memory. |
| **Context switch** | The OS saves one task's state and loads another's, so they take turns on the CPU. |
| **Scheduler** | The part of the OS that decides which task runs next. |
| **Preemptive scheduling** | The OS can stop a task at any moment to run a more important one. RTOSes use priority-based preemption. |
| **Race condition** | A bug where the result depends on the timing of threads touching the same data. |
| **Mutex** | A lock: only one thread can hold it, so only one enters the protected code. |
| **Semaphore** | A counter for access: allows N users, or signals between tasks. |
| **Deadlock** | Two threads each wait for a lock the other holds, so neither moves. Avoid it by taking locks in the same order. |
| **Priority inversion** | A high-priority task waits on a lock held by a low-priority task, while a medium task runs. Fixed with priority inheritance. |
| **Atomic operation** | An operation that finishes completely or not at all; no other thread sees it half done. |
| **Virtual memory** | Each process sees its own address space; the OS maps it to physical RAM in pages. |
| **Page fault** | A process touches memory that isn't in RAM yet, and the OS loads it. |
| **System call** | How a program asks the kernel to do something (read a file, open a socket). |
| **Kernel space vs user space** | The kernel runs with full hardware access; normal programs run restricted. |
| **Stack vs heap** | Stack: automatic, fast, for local variables, freed on return. Heap: manual or managed, for data that lives longer. |
| **Memory leak** | Memory that is allocated and never freed (like the leaked client I fixed in libcups). |
| **Async / event loop** | One thread handles many tasks by switching when a task would wait, instead of blocking. |
| **RTOS** | Real-Time OS: it guarantees tasks run within a time limit (determinism), not just "fast on average". |
| **Determinism** | The same input always gives the same timing. Important for control loops. |

### 5.3 Embedded and hardware
| Term | Plain explanation |
|---|---|
| **Microcontroller (MCU)** | A small chip with CPU, flash, RAM and peripherals on one die, for example STM32 or ESP32. |
| **Interrupt / ISR** | The hardware stops the normal code to run a short handler (Interrupt Service Routine). Keep ISRs short. |
| **volatile** | Tells the C compiler a variable can change outside the code (hardware or ISR), so it must re-read it every time. |
| **Memory-mapped registers** | Peripherals are controlled by reading and writing fixed memory addresses. |
| **DMA** | Direct Memory Access: hardware copies data without the CPU. |
| **GPIO** | General-purpose pins you set high/low or read. |
| **UART** | Simple serial link with TX and RX wires, no clock line; both sides agree on the baud rate. |
| **I2C** | Two-wire bus (data + clock) with addresses, so many sensors can share it. Slower. |
| **SPI** | Four-wire bus, faster than I2C, one chip-select line per device. |
| **CAN** | Robust bus used in cars: messages have IDs and priorities, and it handles errors in hardware. |
| **PWM** | Turns a pin on and off fast; the on-time ratio (duty cycle) controls power, for example to a valve or motor. |
| **ADC** | Converts an analog voltage (like a pressure sensor) into a number. |
| **Flash vs RAM** | Flash keeps the program after power-off; RAM is fast working memory that's lost at power-off. |
| **Linker script** | Tells the linker where code and data go in the chip's memory. |
| **Cross-compiling** | Building on your PC for a different CPU (for example ARM). |
| **ARM Cortex-M** | The CPU family in most microcontrollers (STM32, TM4C). |

### 5.4 Networking
| Term | Plain explanation |
|---|---|
| **TCP vs UDP** | TCP: connection, ordered, reliable, slower. UDP: no connection, no guarantees, faster. |
| **Unicast / multicast / broadcast** | Unicast: to one host. Multicast: to a group that joined. Broadcast: to everyone on the network. |
| **IP_MULTICAST_LOOP** | A socket option: when this host sends multicast, should its own sockets in that group receive it too? My Zephyr contribution. |
| **Socket** | The program's endpoint for network communication (address + port). |
| **setsockopt / getsockopt** | The calls that set or read socket options like IP_MULTICAST_LOOP. |
| **Three-way handshake** | How TCP opens a connection: SYN, SYN-ACK, ACK. |
| **Port** | A number that tells which program on a host gets the data. |
| **HTTP** | The request/response protocol of the web. IPP and REST use it. |
| **NAT** | A router shares one public IP among many devices; outside servers can't start connections inside easily. That's why my desktop app polls the server. |

### 5.5 Rust
| Term | Plain explanation |
|---|---|
| **Ownership** | Every value has one owner; when the owner goes out of scope, the value is freed. No garbage collector. |
| **Borrowing** | Using a value without owning it: many readers (`&T`) or one writer (`&mut T`), never both at once. |
| **Lifetimes** | The compiler checks that a reference never outlives the data it points to. |
| **Traits** | Like interfaces: a set of methods a type promises to have. |
| **Result / Option** | Errors and "maybe no value" are normal types, so you must handle them; the `?` operator passes errors up. |
| **unsafe** | A block where you promise the compiler things it can't check, like calling C or using raw pointers. |
| **async / await, Future** | A Future is a value that will be ready later; `await` waits without blocking the thread. A runtime (like tokio) runs them. |
| **Send / Sync** | Marker traits: Send = safe to move to another thread; Sync = safe to share between threads. |
| **Arc / Mutex** | Arc = shared ownership across threads; Mutex = lock around data. `Arc<Mutex<T>>` is the common pair. |
| **Clippy** | Rust's linter: it warns about common mistakes and style. I fixed a false positive in its `ref_as_ptr` lint. |
| **Cargo** | Rust's build tool and package manager. |

### 5.6 C and C++
| Term | Plain explanation |
|---|---|
| **Pointer** | A variable holding a memory address. |
| **Undefined behavior** | Code the standard doesn't define (for example reading freed memory). Anything can happen; the compiler assumes it never does. |
| **RAII** | Resource Acquisition Is Initialization: an object gets the resource in its constructor and releases it in its destructor, so it's always cleaned up. |
| **Smart pointers** | `unique_ptr` (one owner), `shared_ptr` (shared, reference counted), `weak_ptr` (watches without owning). |
| **Move semantics** | Transfer an object's resources instead of copying them (`std::move`). |
| **Virtual function** | A function chosen at runtime by the real object type (polymorphism), through a vtable. |
| **Templates** | Write code once for many types; the compiler generates each version. |
| **const** | Promise that something won't change. |
| **Rule of 3/5/0** | If you write one of destructor/copy/move functions, you probably need all of them; best is none (let RAII members do it). |
| **static** (in C) | Inside a function: keeps its value between calls. At file level: visible only in that file. |

### 5.7 Algorithms and data structures (you know these, here are the names)
| Term | Plain explanation |
|---|---|
| **Big-O** | How time or memory grows with input size: O(1), O(log n), O(n), O(n log n), O(n²). |
| **Hash map** | Key → value with average O(1) lookup. |
| **Binary search** | Halve a sorted range each step: O(log n). |
| **BFS / DFS** | Graph traversal: BFS by layers (shortest path with equal weights), DFS goes deep first. |
| **Dijkstra** | Shortest paths with non-negative weights, using a priority queue. |
| **Dynamic programming** | Solve a problem by combining saved answers to smaller sub-problems. |
| **Two pointers / sliding window** | Move two indexes through an array to avoid nested loops. |
| **Heap / priority queue** | Always gives the smallest (or largest) item fast: O(log n) insert and remove. |
| **Union-Find (DSU)** | Tracks which items are in the same group, almost O(1) per operation. |

---

## 6. Hard or tricky questions

| Question | Good answer |
|---|---|
| "Your EKSON job is part-time. Is it real experience?" | "Yes. I'm the only software engineer, so everything with code in the product is mine: the firmware, the desktop app, the backend and CI." |
| "You had no senior. How do you know your code is good?" | "I don't assume it is. I used CI and testing, and in open source I learned from strict reviews by maintainers. That's exactly why I want a team with seniors now." |
| "What's your weakness?" | "I used to try to solve everything alone for too long, like with CAN in my graduation project. Now I set a time limit and ask earlier, which open source taught me." |
| "Why do you have both embedded and Rust/Linux work?" | "They're the same skill: software close to the hardware and the OS. The firmware work taught me timing and constraints; the Linux work taught me IPC, processes and API design." |
| "Rate yourself in C++." | "Strong in modern C++ (RAII, smart pointers, move semantics, the STL), mostly from competitive programming and projects. My recent professional work has been more in Rust and Python." |
| "Did you measure the 40%?" | "Yes, before and after." Then say how. |
| "What's the PID rate / exact latency?" | "I don't remember the exact number and I don't want to guess." Then explain how you'd find it. |
| "Was the COSMIC PR merged?" | "Not yet. #2182 and #188 are in review. The 7 merged PRs are in cups-rs and libcups." |
| "Why did you stop the Trampoline work?" | "The team moved to FreeRTOS because it was easier to move forward with. I learned how OSEK systems are configured statically, which helps me understand AUTOSAR OS." |

---

## 7. Questions to ask them at the end

Always ask 2. It shows interest, and it gives you a short break from talking about yourself.
1. "What would my first three months look like?"
2. "How does code review work in the team?"
3. "What's the hardest technical problem the team is working on now?"
4. "How do new engineers get feedback and mentoring?"
5. (Open-source companies) "How much of the work goes upstream?"
6. "What does success look like in this role after a year?"

---

## 8. Practice plan (because talking is a skill)

**Every day, 15 minutes.**

**Days 1–3**
1. Read §2.1 and §2.2 out loud 5 times.
2. Then say them **without reading** and **record yourself** on your phone.
3. Listen once. Note one thing to fix (too fast, "um", forgot a number).

**Days 4–7**
1. Each day, tell 2 stories from §3 out loud, without notes, in under 2 minutes each.
2. Use the What → How → Result shape.

**Week 2**
1. **Glossary drill:** pick 10 terms from §5 at random. Explain each in one sentence out loud. Mark the ones you couldn't explain and redo them the next day.
2. **Whiteboard:** draw the EKSON (§4.1) and GSoC (§4.2) diagrams from memory, then explain them out loud in 2 minutes.

**Before every real interview**
1. Read the cheat card (§1).
2. Change the first sentence of "Tell me about yourself" for the role (§2.4).
3. Prepare one reason why you want this company.
4. Re-read the one PR or project you'll most likely be asked about.

**Mock interviews:**
- Do one per week with a friend, or on Pramp / interviewing.io.
- Ask them to interrupt you with "why?" questions.
- Use English, even if they speak Arabic.

**Simple checklist after each practice:**
- [ ] Did I say "I" instead of "we"?
- [ ] Did I give a number or a clear result?
- [ ] Did I stop after about 60 seconds?
- [ ] Did I name the concept and explain it in one line?
