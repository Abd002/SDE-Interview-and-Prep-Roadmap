# Igalia: Multimedia Developer

> Second Igalia application. The JavaScript Engine Developer one ([igalia/](../igalia/README.md)) was rejected on 7 Nov 2026. Checked on 14 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Multimedia Developer](https://www.igalia.com/jobs/multimedia_developer) |
| **Where** | Remote, anywhere; the team meets in person a few times a year in Galicia, Spain |
| **What they want** | Good written communication, iterating constructively in code review, self-directed remote work. GStreamer or browser-engine experience is "not essential". They ask you to mention: browser tech, GStreamer, FFmpeg, OpenMAX, VA-API, multimedia formats and protocols, **multimedia in embedded devices** or **Rust on GNU/Linux** |
| **Why it fits** | Rust on GNU/Linux (COSMIC printers, cups-rs), embedded devices (EKSON firmware on Zephyr), whole-stack work from UI to firmware, 11 upstream PRs through review, remote work with mentors from two organizations |
| **Gap** | No GStreamer, FFmpeg or codec experience. The letter says so plainly |
| **Status** | **Ready, not sent** |

## 2. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [application-form.md](application-form.md) | **Cover letter and every form field** |
| [job-ad.md](job-ad.md) | The ad as it was on 14 Nov 2026 |

**What the tailored CV changes** (from [cv-systems-rust](../../cv-systems-rust.tex)): title "Rust, C, GNU/Linux, Embedded"; the summary says you work across the whole stack, from the UI down to C libraries and microcontroller firmware, and that you're used to remote, self-directed work and upstream review. **Projects, picked for low-level Linux and embedded devices:** Kernel Monitor (a Linux character device driver on ARM in QEMU) and IoT device communication (embedded Linux boards booted with U-Boot over the network). Skills keep async/event-driven code, IPC, FFI and kernel modules. **No multimedia claims.**

## 3. Before you apply (an evening is enough)

1. Learn the basic words: **pipeline, element, pad, caps, source/sink, demuxer, decoder**, and what VA-API does (hardware video decoding on Linux).
2. Build [gst-plugins-rs](https://gitlab.freedesktop.org/gstreamer/gst-plugins-rs) and run one pipeline, for example `gst-launch-1.0 videotestsrc ! autovideosink`.
3. Add one honest sentence about it to the letter. A good-first-issue MR there would help most.

## 4. Checklist

- [ ] Do step 3 above
- [ ] Send the form with the PDF above; tick "send me a copy"
- [ ] Fill in **Applied on** here, in 08 and in Notion
- [ ] Follow up once after 3 weeks with no reply
