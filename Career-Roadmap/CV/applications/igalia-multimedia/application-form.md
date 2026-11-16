# Igalia application form: Multimedia Developer

**Role:** [Multimedia Developer](https://www.igalia.com/jobs/multimedia_developer) (remote). Prepared 16 Nov 2026; every fact comes from [facts.md](../../facts.md).

## Personal information

| Field | What to enter |
|---|---|
| Name | Abdelrahman Khalifa |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone number | +20 114 250 5042 |
| Time zone | Africa/Cairo (UTC+2; UTC+3 in summer) |

## Cover letter & introduction

Paste the text between the lines.

---

Hello Igalia Multimedia team,

I'm Abdelrahman Khalifa, a software engineer from Cairo, Egypt. I work mostly in Rust and C on GNU/Linux and embedded devices, and I'm applying for the Multimedia Developer position.

Your ad describes work that runs from the player's user interface down to the firmware on the decoding hardware. I've done that kind of whole-stack work on a smaller scale. At EKSON, a motion-simulator company, I own the simulator's software from end to end: the Zephyr RTOS firmware on an ESP32-S3 (PID control of pneumatic valves with IMU feedback), the UART protocol, the desktop app that drives it, and the backend for remote control and firmware updates. In the desktop app I cut CPU use and latency by about 40% by using asyncio to wait for the device and the server at the same time instead of blocking.

On the Linux desktop, I was a Google Summer of Code 2026 contributor with The Linux Foundation's OpenPrinting project. I built the Printers page for COSMIC Settings in Rust, with the C printing libraries running behind a varlink service so a crash there can't take down Settings. I got 11 pull requests merged in cups-rs and libcups, including fixes for crashes and a leaked client in libcups' Avahi DNS-SD code, and I still maintain the project. Everything went through review with mentors from OpenPrinting and System76, and almost all of my work since my first Zephyr contribution in 2025 has been remote and upstream.

I haven't worked with GStreamer or video codecs yet. I want to learn them, and I'd start with gst-plugins-rs, where my Rust experience is useful from the first day.

I applied for the JavaScript Engine Developer role last month. The team told me they needed more experience with the JavaScript specification, which was fair. Multimedia is a much closer match to what I've actually built.

My pronouns are he/him. Thank you for your time.

Abdelrahman Khalifa
https://github.com/Abd002

---

## Professional information

| Field | What to enter |
|---|---|
| Curriculum vitae (PDF, 5 MB max) | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf), this folder's copy |
| Additional comments | See below |
| Other documents (PDF) | Leave empty |
| How did you discover this position | Igalia's careers page (igalia.com/jobs) |
| Robot check | Do the sum it shows |
| Copy of my application | Tick it |
| Privacy policy | Tick after reading |

**Additional comments** (paste):

> Links: COSMIC printers https://github.com/Abd002/cosmic-printers · my merged cups-rs PRs https://github.com/OpenPrinting/cups-rs/pulls?q=is%3Apr+author%3AAbd002+is%3Amerged · libcups fixes https://github.com/OpenPrinting/libcups/pull/164 and /165 · Zephyr https://github.com/zephyrproject-rtos/zephyr/pull/87167.

## Before you send

- **Do one small GStreamer thing first, and then add one sentence about it to the letter.** For example: build [gst-plugins-rs](https://gitlab.freedesktop.org/gstreamer/gst-plugins-rs), run a pipeline with `gst-launch-1.0`, or read one Rust element's source. A merged good-first-issue there would be the strongest thing you could add. Don't claim more than you did.
- **Optional question about underrepresented groups:** the letter says nothing, which is fine. It's your call.
