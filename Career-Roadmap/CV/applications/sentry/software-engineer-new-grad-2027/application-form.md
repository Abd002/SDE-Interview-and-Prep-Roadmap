# Sentry: Software Engineer, New Grad (2027): application answers

Prepared 25 Nov 2026; every fact comes from [facts.md](../../../facts.md). Form: [Ashby](https://jobs.ashbyhq.com/sentry/f345b525-b2e9-4dc1-bec1-85fb4c3b3cf2/application).

## Ashby form

| Field | What to enter |
|---|---|
| First and Last Name | Abdelrahman Khalifa |
| Location | Cairo, Egypt |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone number | +20 114 250 5042 |
| Resume | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) (don't use "Autofill from resume"; type the fields yourself) |
| Cover Letter (optional) | Leave empty. The two written answers below do that job |
| LinkedIn Profile | https://www.linkedin.com/in/abd002 |
| GitHub Profile URL | https://github.com/Abd002 |
| How did you hear about this position? | LinkedIn |
| When do you graduate? | **Other** (you graduated in 2025). If a text box appears: `Graduated 2025, B.Sc. Computer and Systems Engineering, Minia University` |
| Which office are you applying to? | Vienna |
| Pronouns | he/him |
| Hybrid, 3 days in office (Mon, Tue, Thu)? | Yes |
| Will you now or in the future require visa sponsorship? | **Yes** (you need an Austrian work permit) |
| Which area are you most proficient in or most excited to work in? | **C++/Rust (Ingest team)** |
| Privacy policy | Tick the box |

## "Tell us about the most impactful project you've worked on recently." (paste between the lines)

---

The Printers page for COSMIC Settings, which I built as a Google Summer of Code 2026 contributor with The Linux Foundation's OpenPrinting project.

COSMIC is System76's new desktop, written in Rust, and it had no way to manage printers. I built the page and a standalone app with the same UI: printers grouped by physical device, their status and supply levels, the print queue (pause, resume, cancel, move jobs), and an Add Printer flow that also covers legacy printers through Printer Applications.

The decision I'm proudest of is where the C code runs. Printing goes through libcups, a C library, and a crash there would take all of Settings down with it. So I moved the backend into a varlink IPC service in cosmic-settings-daemon. The Settings process never loads the C code; it gets events pushed from the service, so the page updates live without polling.

To get there I had to fix the layer underneath. I ported cups-rs (the Rust bindings) to libcups3 with CI for CUPS 2 and 3, wrote its DNS-SD FFI module from scratch, and fixed a crash and a leaked client in libcups's Avahi code. 11 of my PRs are merged upstream.

- Code: https://github.com/Abd002/cosmic-printers
- COSMIC Settings PR (in review): https://github.com/pop-os/cosmic-settings/pull/2182
- Merged PRs: https://github.com/OpenPrinting/cups-rs/pulls?q=is%3Apr+author%3AAbd002+is%3Amerged

---

## "Teach us something!" (paste between the lines)

---

**What happens to your data if the power goes out in the middle of a write?**

I ran into this while building raftkv, a key-value store in Rust. Every change is first appended to a write-ahead log (WAL) on disk, and only then does the client hear "saved". After a crash, you rebuild the state by replaying the log.

The catch is that a crash can hit halfway through an append. The file then ends with half a record, a "torn write". Replay it blindly and you either crash on garbage or, worse, silently load a wrong value. There's a second trap: `write()` returning doesn't mean the data is on disk. It may still sit in the OS page cache, so you have to call fsync (`sync_data()` in Rust) before you promise anything.

My fix is to frame every record as `[crc32][length][payload]`. On startup I read records one by one. If the last record is cut short or its checksum doesn't match, it was never fully written, so it was never acknowledged either, and it's safe to cut the file there. Everything before it is intact.

One more lesson I liked: if fsync itself fails, don't just retry. Linux may already have dropped the dirty pages, so a retry can "succeed" while the data is gone. PostgreSQL learned this the hard way in 2018 ("fsyncgate"). So my log goes into a poisoned state and refuses new writes instead of pretending everything is fine.

Code: https://github.com/Abd002/raftkv (in progress; the storage layer is done)

---

**Before you paste:** both answers are drafts built from your facts. Read them aloud and change anything that doesn't sound like you. Sentry says they care how you think and communicate.
