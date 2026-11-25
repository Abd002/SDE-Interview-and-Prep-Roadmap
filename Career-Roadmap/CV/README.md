# CV: master, three one-page versions and one folder per application

**Updated:** 2026-11-25. Every CV uses one format: a one-page LaTeX CV (11pt, single column), the format new-grad software hires and the career subreddits recommend most. The master is two pages.

**Every fact comes from [facts.md](facts.md).** If a fact changes, update facts.md first, then the CVs and [LinkedIn.md](LinkedIn.md). To prepare for interviews, read **[Interview-Talking-Guide.md](Interview-Talking-Guide.md)**.

## The base versions

| Version | PDF | Source | Title line | Send to |
|---|---|---|---|---|
| **Systems / Rust / open source** | [cv-systems-rust.pdf](cv-systems-rust.pdf) | [.tex](cv-systems-rust.tex) | Systems Software Engineer \| Rust, C, Linux | Canonical, Red Hat, Collabora, Igalia, System76, Cloudflare, Rust companies |
| **Embedded** | [cv-embedded.pdf](cv-embedded.pdf) | [.tex](cv-embedded.tex) | Embedded Software Engineer \| C, Zephyr RTOS, Embedded Linux | Valeo, NXP, Nordic, automotive and IoT companies |
| **General SWE** | [cv-general-swe.pdf](cv-general-swe.pdf) | [.tex](cv-general-swe.tex) | Software Engineer \| Rust, C++, Linux | Big Tech, trading, SaaS, backend |
| **Master (2 pages)** | [master-cv.pdf](master-cv.pdf) | [.tex](master-cv.tex) | Software Engineer \| Rust, C, C++, Linux, Embedded | The full record: master's applications and the source for new versions |

Sections, in order: Summary → Experience → OSS Projects → Projects → Technical Skills → Education (achievements and activities go under Education).

**What's new on 25 Nov 2026:**
- **raftkv** (Rust, in progress) added to Projects on the master, Systems/Rust and General SWE, worded only as far as it is built (the storage layer).
- **Master:** the cups-rs CI matrix (4 architectures × 3 CUPS releases), the USB HID controller at EKSON, the Google Summer of Code Preferred Candidate note, Golden Mentor of the month (ICPC Minia), leading the VLSI traffic-light project, the 84.6% grade and the high-school result (98.2%, mathematics 119/120).

## Tailored copies

[applications/](applications/README.md) has **one folder per company and one subfolder per role**, for example `applications/canonical/graduate-software-engineer/` and `applications/canonical/next-gen-silicon/`. Each role folder has the tailored CV (`Abdelrahman-Khalifa-CV.pdf`, **send this one**, and its `.tex`), the README, the saved job ad, and sometimes form answers or a cover letter. The applications README explains how to add a new role.

## Build

```sh
cd Career-Roadmap/CV
pdflatex cv-systems-rust.tex && pdflatex cv-systems-rust.tex   # run twice; same for the others
```

Each `.tex` file is standalone (no shared style file). It needs only standard TeX Live packages: `titlesec`, `enumitem`, `fancyhdr`, `tabularx`, `marvosym`, `hyperref`, `lmodern`. On Overleaf, upload the `.tex` alone and use pdfLaTeX. After every change, check the page count: `pdfinfo <file>.pdf | grep Pages`.

**Word:** there are no Word copies any more. If a form only accepts .docx, convert the PDF (for example with LibreOffice or Word's "Open PDF"), then check the text before uploading.

## The title line under the name

Each CV has one short line under the name: **the job title, then 3 core skills**, for example `Systems Software Engineer | Rust, C, Linux`.
- Career guides recommend starting with the job title, then a few skills separated by a pipe, in fewer than 10 words. The title matches what recruiters and ATS search for.
- Achievements such as Google Summer of Code or Codeforces Expert stay in the Summary and the sections, not in the title line.
- Before applying, change the title to the exact title in the ad if it is true for you (for example "Firmware Engineer" or "Backend Engineer").

## ATS notes

- **Font:** the preamble loads `\usepackage[T1]{fontenc}` + `lmodern`. It looks the same as the default font, but parsers that find job titles by "Bold" in the font name (such as OpenResume) then read every job; without it, OpenResume read only 1 of 3 jobs.
- **Section name "OSS Projects":** OpenResume treats a short title with the word "project" as a section; "Open Source" was merged into Experience and lost jobs.
- **Checked with OpenResume (31 Oct 2026):** all 6 sections, all 3 jobs with dates, and the education are read. Plain-text extraction puts each right-aligned date on its own line, which ATS handle.
- **Google Summer of Code:** the job line is `Google Summer of Code Contributor | The Linux Foundation (OpenPrinting) | May 2026 – Oct 2026`, following the program's rules (never "GSoC", never a job at Google). When a job site pre-fills this entry, fix it by hand: title "Google Summer of Code 2026 Contributor", company "The Linux Foundation (OpenPrinting)", location Remote.
- **Grade:** written "Very Good with Honors"; parsers read "84.6%" as a GPA of 4.6. Type the percentage into the form when an Egyptian employer asks.
- **Always** check the parsed fields a job site shows and fix them by hand. Upload the file as `Abdelrahman-Khalifa-CV.pdf`.

**Before each application:**
1. Copy the closest base `.tex` into the role folder.
2. Add the 3–5 exact phrases from the ad that are true for you to the Summary and Skills.
3. Rebuild and check it is still 1 page.

## Facts left out on purpose
- **Military service:** not on any CV. For Egyptian employers, add "Military service: completed" under the contact details only if a form asks.
- **Removed after the interview:** the Deloitte mentorship, the Winter of Code lp/lpstat PRs (not merged) and the "C++/Qt" wording for the EKSON app (it is PyQt5).
- **raftkv:** only what is built (see facts.md); never claim Raft, SSTables or benchmarks until they exist.
