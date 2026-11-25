# Rerun: Software Engineer (Rust): application answers

Prepared 25 Nov 2026; every fact comes from [facts.md](../../facts.md).

## Ashby form

| Field | What to enter |
|---|---|
| Name | Abdelrahman Khalifa |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone | +20 114 250 5042 |
| Location | Cairo, Egypt (time zone Africa/Cairo, UTC+2; UTC+3 in summer) |
| LinkedIn | https://www.linkedin.com/in/abd002 |
| GitHub | https://github.com/Abd002 |
| Resume | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) |
| Work authorisation / location | I live in Egypt and can work remotely as a contractor or through an employer of record. I'm available every day during your 1:30–5:00 pm CET overlap (2:30–6:00 pm in Cairo). |
| Salary expectation (if asked) | Open to your range for this level; I'd rather discuss it after the first call. |
| How did you hear about us? | LinkedIn / Rerun's careers page |

## Cover letter / "Why Rerun?" (paste between the lines)

---

Hello Rerun team,

I'm Abdelrahman Khalifa, a software engineer in Cairo working mostly in Rust on Linux. I'm applying for the Software Engineer (Rust) role because it sits exactly where I like to work: between a user interface, the data underneath it and the systems that move that data.

As a Google Summer of Code 2026 contributor with The Linux Foundation's OpenPrinting, I built the Printers page for COSMIC Settings in Rust, with an iced/libcosmic UI that updates live from events pushed by an async backend running behind varlink IPC. I got 11 pull requests merged in cups-rs and libcups along the way, including FFI bindings and crash fixes in C, and I still maintain the project.

At EKSON I work with the kind of data Rerun is built for: motion simulators driven by firmware that reads an MPU6050 IMU, fuses it with a Mahony filter and closes PID loops on pneumatic actuators, with telemetry streamed to a desktop app. Being able to see those streams in Rerun would have saved me many debugging sessions.

Right now I'm building raftkv, a Raft key-value store in Rust, starting from the storage layer (a CRC-framed write-ahead log with crash recovery). I haven't used egui yet, but I learn UI toolkits quickly, as iced showed me.

I'm in Egypt (UTC+2), so your 1:30–5:00 pm CET overlap is my normal afternoon. Thank you for considering me.

Abdelrahman Khalifa
https://github.com/Abd002

---

**Links / additional info:** COSMIC printers https://github.com/Abd002/cosmic-printers · merged cups-rs PRs https://github.com/OpenPrinting/cups-rs/pulls?q=is%3Apr+author%3AAbd002+is%3Amerged · libcups fixes https://github.com/OpenPrinting/libcups/pull/164 and /165 · raftkv (in progress) https://github.com/Abd002/raftkv

## Before you send
- Clone [rerun-io/rerun](https://github.com/rerun-io/rerun), run one example (e.g. the Python or Rust quick start), and look at how the viewer is split into crates. If you do it, add one sentence to the letter about what you tried. Don't claim more than you did.
