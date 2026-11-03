# Collabora: everything for this application

> Part of [08: Next 5, no relocation risk](../../../08-Application-Tracker.md#next-5-no-relocation-risk-found-2-nov-2026). Follow-up rules: [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Checked on 2 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Embedded Linux Consultant Engineer (Remote/Anywhere)](https://jobs.lever.co/collabora/1d10fee4-5504-4abb-a623-276c926aad03) |
| **Where** | **Fully remote, anywhere.** Benefits are "tailored to each country". No visa or relocation needed. |
| **Level** | Not stated; no years asked. Third-party boards label it mid–senior, so it's a stretch, but Collabora values upstream work, which you have. |
| **What the team builds** | Consulting on embedded Linux for customers: bootloaders, kernel and BSP, distributions (Yocto, Debian), image tooling, OTA updates, upstream contributions |
| **Why it fits** | Yocto and Buildroot (ODC), a kernel module on ARM/QEMU, U-Boot and device trees, upstream merged work in C and Rust (OpenPrinting, Zephyr, Boa, Clippy). Nice-to-haves you meet: **Rust**, **A/B boot / atomic upgrades** (your dual-bank bootloader with rollback) |
| **Status** | **Applied** (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b418165beb7ec67d5002d35)) |
| **Applied on** | 3 Nov 2026, on Lever, with the answers in [application-form.md](application-form.md) (sent as written, no edits) |
| **Follow up** | 17 Nov 2026: Collabora says applications are reviewed within 2 weeks. If there's no reply by then, send one short note (09 §5). |
| **Saved job ad** | [job-ad.md](job-ad.md) |

## 2. Files in this folder

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Same CV in Word, only if the site asks for Word |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | Its LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad text as it was on 2 Nov 2026 (includes Collabora's interview process) |
| [application-form.md](application-form.md) | Answers for every field of the Lever form |

**What the tailored CV changes:** Title "Embedded Linux Engineer | Linux, Yocto, C, Rust, Open Source". The summary leads with Yocto/Buildroot, the ARM kernel module, and U-Boot + device trees + BusyBox root file systems on QEMU (all in your repos), then upstream work. GSoC comes first, framed as the Linux printing stack and remote work with mentors. Projects: Kernel Monitor (full ARM/QEMU detail), **A/B firmware updates** (the dual-bank bootloader), and the QEMU/U-Boot networking setup. The new first skills line is "Embedded Linux".

## 3. Their interview process (from the ad)

1. Application review (within 2 weeks): **they look at your code and contributions**, so make sure your GitHub profile README and pinned repos show cosmic-printers, GSOC-2026 and kernel-monitor.
2. Initial chat (30–60 min).
3. Technical interview (1–2 h): an embedded Linux deep-dive (no whiteboard coding), a **code review session on real patches**, and a client scenario (technical debt vs timelines vs upstream).
4. COO (60 min): culture and compensation.
5. Offer within 1 week of the final interview.

## 4. Gaps, and how to prepare

**From your form:** the production-issue answer covers the technical side only. Be ready to describe how you kept your mentors and the libcups maintainers informed; they will ask about the customer side.


| The ad asks for | Your honest answer |
|---|---|
| U-Boot, kernel, BSP | You've booted QEMU boards with U-Boot over TFTP and built a kernel module. Revise the boot flow (ROM → SPL → U-Boot → kernel + DTB → init) and how a BSP layer works in Yocto. |
| Image tooling (debos, wic), Debian system creation | Not used. Read the wic and debos docs once and build one image with each if you have time. |
| OTA (RAUC, Mender, SWUpdate) | You built a firmware-update path for an MCU (two banks, rollback) and remote updates at EKSON. Learn how RAUC does A/B slots on Linux; it's the same idea. |
| Secure/trusted boot | Your bootloader only checks a CRC; don't call it secure boot. Know the chain of trust idea (signed images, verified boot in U-Boot). |
| Code review | You've been through upstream review in Zephyr, Rust Clippy, Boa and OpenPrinting. Prepare one story about feedback you got and changed your code for. |

**Before the technical interview,** fix or be ready to explain the Kernel Monitor weak spots listed in [facts.md](../../facts.md#projects-to-keep) (missing `cdev_del`, the `MKDEV` mistake, the buffer-length bug, no lock on concurrent `open()`). An interviewer may open that repo.

## 5. Checklist

- [x] Re-open the job link and check it is still open.
- [ ] Pin cosmic-printers, GSOC-2026 and kernel-monitor on your GitHub profile.
- [x] Apply on Lever with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); add your GitHub link in the form.
- [x] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Revise the boot flow, Yocto layers and RAUC while you wait.
- [ ] Follow up once after 3 weeks with no reply (09 §5); their own target for the first reply is 2 weeks.
