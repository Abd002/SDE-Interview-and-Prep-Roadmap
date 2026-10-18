# CV — master and three one-page versions

These implement [07 §5.1](../07-Strategy-and-Roadmap.md#51-three-cv-versions): one master CV plus three one-page versions. Each version reorders the same true facts; nothing is invented.

**Updated:** 2026-10-18.

**Every fact comes from [facts.md](facts.md)**, the record built from an interview on 11 Oct 2026. If a fact changes, update facts.md first, then the CVs and [LinkedIn.md](LinkedIn.md). To prepare for interviews, read **[Interview-Talking-Guide.md](Interview-Talking-Guide.md)**.

**Sources:**
- the interview (11 Oct 2026), recorded in [facts.md](facts.md);
- his latest CV (Sept 2026);
- his [Google Summer of Code 2026 final report](https://github.com/Abd002/GSOC-2026);
- his [GitHub profile README](https://github.com/Abd002);
- his older LaTeX CVs.

LinkedIn was compared from its "Save to PDF" export (2 Oct 2026). That fixed the EKSON start date (Aug 2025) and the ECPC count (4-time finalist) in all CVs. **[LinkedIn.md](LinkedIn.md)** lists what is missing on the profile, with ready-to-paste text.

| Version | PDF | Word | Source | Title line | Section order | Send to |
|---|---|---|---|---|---|---|
| **General SWE** | [cv-general-swe.pdf](cv-general-swe.pdf) | [.docx](cv-general-swe.docx) | [.tex](cv-general-swe.tex) | Software Engineer \| Rust, C++, Linux | Summary → Skills → Experience → Open Source Projects → Projects → Achievements → Education | Big Tech, trading firms, SaaS |
| **Systems / Rust / open source** | [cv-systems-rust.pdf](cv-systems-rust.pdf) | [.docx](cv-systems-rust.docx) | [.tex](cv-systems-rust.tex) | Systems Software Engineer \| Rust, C, Linux | Summary → Experience → Open Source Projects → Skills → Achievements → Education | Canonical, Red Hat, Collabora, Igalia, System76, JetBrains, Cloudflare, Ferrous Systems |
| **Embedded** | [cv-embedded.pdf](cv-embedded.pdf) | [.docx](cv-embedded.docx) | [.tex](cv-embedded.tex) | Embedded Software Engineer \| C, Zephyr RTOS, Embedded Linux | Summary → Experience → Open Source Projects → Projects → Skills → Education | Nordic, NXP, Arm, TomTom, Bosch, Valeo, automotive |
| **Master (2 pages)** | [master-cv.pdf](master-cv.pdf) | [.docx](master-cv.docx) | [.tex](master-cv.tex) | Software Engineer \| Rust, C, C++, Linux, Embedded | Summary → Experience → Skills → Open Source Projects → Projects → Achievements → Courses → Education | Keep as the source. Use for master's applications after adding an academic section. |

**Tailored copies for the current shortlist (18 Oct 2026):** [applications/](applications/) has one copy per company. Each one is a base version with a new title line, summary and skills, matched to that ad. All of them are 1 page and pass the ATS checks below. Send that copy, not the base version.

| Company and role | Built from | What changed for this ad | Ad keywords matched |
|---|---|---|---|
| [Canonical](applications/canonical/Abdelrahman-Khalifa-CV.pdf): Graduate Software Engineer | Systems/Rust | Title "Linux, Open Source, Rust, C"; summary adds Python, Ubuntu/Debian, B.Sc. with Honors, Codeforces Expert and ECPC (the ad asks for an exceptional academic record); adds Java; adds firmware and bootloaders | 15 of 23 |
| [Cloudflare](applications/cloudflare/Abdelrahman-Khalifa-CV.pdf): Systems Engineer, Network Protocols | Systems/Rust | Title "Rust, C, Networking, Linux"; summary leads with the protocol work (IPP over HTTP, DNS-SD, the Zephyr IPv4 multicast option); new Networking skills line | 6 of 13 (base: 5) |
| [Igalia](applications/igalia/Abdelrahman-Khalifa-CV.pdf): JavaScript Engine Developer | Systems/Rust | Title "Rust, C++, C, Open Source"; summary leads with Boa (a JavaScript engine) and Clippy; Boa listed first | 6 of 12 |
| [NXP](applications/nxp/Abdelrahman-Khalifa-CV.pdf): Junior Embedded SW Engineer, Secure IoT Firmware | Embedded | Title "C, 32-bit MCUs, Zephyr RTOS"; summary: 32-bit MCUs, the bootloader with CRC/signature check and rollback; new Testing line (unit and integration tests, pytest, Python scripts for build and test automation in CI); adds Java | 17 of 22 (base: 12) |
| [Amazon](applications/amazon/Abdelrahman-Khalifa-CV.pdf): SDE – 2027 (Dublin) | General SWE | Title "C++, Rust, Python, Linux"; summary leads with algorithms; skills name NoSQL (MongoDB), version control, debugging and troubleshooting | 10 of 17 (base: 7) |

The words still missing are things not in [facts.md](facts.md), such as Go, AWS/cloud, cryptography and V8, so they were not added. **Amazon** lists "experience using AI-assisted development tools" as a basic qualification. Add it to the Amazon copy only if you have really used such tools (for example Copilot or Claude Code), and be ready to talk about it.

To build a copy: `cd applications/<company> && TEXINPUTS=../..: pdflatex Abdelrahman-Khalifa-CV.tex` (run it twice). For Word: `python3 tex2docx.py applications/<company>/Abdelrahman-Khalifa-CV.tex`.

**PDF or Word?** Send the **PDF** by default. Use the **.docx** only when the job site asks for Word, or only accepts .doc/.docx. Both have the same text.

The shared look is in [cv-style.sty](cv-style.sty). Change it once and every version follows.

## Build

```sh
cd Career-Roadmap/CV
pdflatex cv-general-swe.tex && pdflatex cv-general-swe.tex   # run twice; same for the others
```

- **Packages:** the `lato` font package (in `texlive-fonts-extra`; Overleaf has it), `lmodern`, `titlesec`, `enumitem`, `cmap`, `microtype`, `hyperref`.
- **On Overleaf:** upload the `.tex` and `cv-style.sty` files together and choose the pdfLaTeX compiler.

**Word copies:** `python3 tex2docx.py cv-general-swe.tex cv-systems-rust.tex cv-embedded.tex master-cv.tex` (needs `pip install python-docx`). Rebuild them every time you change a `.tex` file.

## The title line under the name
Each version has one short line under the name: **the job title, then 3 core skills**, for example `Systems Software Engineer | Rust, C, Linux`.
- **Why this form:** career guides recommend starting with the job title, then a few skills, separated by a pipe, in fewer than 10 words. The job title matches what recruiters and ATS search for.
- **What's not in it:** achievements like Google Summer of Code 2026 or Codeforces Expert. They are in the Summary and the sections, and a list of them under the name reads like a LinkedIn headline, not a CV.
- **Before applying:** change the title to the exact title in the job ad if it is true for you (for example "Firmware Engineer" or "Backend Engineer").

## ATS checks (all four PDFs and Word copies pass)

**What an ATS does.** An Applicant Tracking System (Workday, Greenhouse, Lever, Taleo, iCIMS, SmartRecruiters…) is the first thing that reads a CV at most companies. It pulls out the text, splits it into sections, and fills fields: name, email, phone, each job's **title, company and dates**, the school, the degree and the skills. Recruiters then search those fields. If a job lands in the wrong field, or the parser skips a section, a human may never see it.

### 1. Tested with a real resume parser
The CVs were run through the **[OpenResume](https://github.com/xitanggg/open-resume) parser**, an open-source parser built to work like an ATS. It reads the PDF, finds the sections, then fills the fields. Results on 12 Oct 2026, for every PDF and every Word copy:

| Field | Result |
|---|---|
| Name, email, LinkedIn URL, Summary | ✅ found |
| Sections | ✅ Summary, Experience, Open Source Projects, Projects, Technical Skills, Achievements, Education all found |
| Jobs | ✅ 3 jobs with the right dates. **Google Summer of Code Contributor**, May–Oct 2026: this parser leaves the title field empty and puts the title in the company field, because "Contributor" isn't in its list of job words (see item 3 below) · **Embedded Software Engineer** at EKSON, Aug 2025 – Present · **Embedded Linux Systems Intern** at Orange Digital Center, Dec 2023 – Jan 2024 |
| Education | ✅ Minia University · Bachelor of Science (B.Sc.), Computer and Systems Engineering · 2020 – 2025 |
| Phone and city | ⚠️ This parser only knows US formats, so it drops "+20" and "Cairo, Egypt". Commercial ATS (Workday, Greenhouse, Textkernel-based ones) read international numbers. Type your phone and city into the job site's form fields anyway. |

**What the first test found, and what was changed:**
1. **Google Summer of Code was dropped completely**, because it sat under "Open Source", a heading an ATS doesn't map to work experience. It now sits under **Experience**, and the other contributions are under **Open Source Projects** ("Projects" is a standard heading).
2. **The job title and company were read as one piece of text** ("Embedded Software Engineer — EKSON"). Now each job line is `Title | Company | Dates`, with the three as separate pieces of text.
3. **The Google Summer of Code title follows the program's rules, not the parser.** The program asks contributors to always write "Google Summer of Code 2026 contributor" followed by the organization, never the acronym "GSoC", and never to present it as a job at Google or the organization ([LinkedIn.md §2.1](LinkedIn.md#21-google-summer-of-code-rules)). A version titled "Software Developer (Google Summer of Code)" parsed better, but it read like employment at The Linux Foundation, so it was dropped (Oct 2026).
   - **Job line:** `Google Summer of Code Contributor | The Linux Foundation (OpenPrinting) | May 2026 – Oct 2026`. The year is not in the title, because a number in the title made the parser read "Google Summer of Code 2026 Contributor" as the date and lose May–Oct 2026.
   - **Every Summary** has the full phrase "Google Summer of Code 2026 contributor with The Linux Foundation (OpenPrinting)", for keyword search.
   - **Parsed result:** dates ✅. The title lands in the company field, because "Contributor" isn't one of OpenResume's job words. **When a job site pre-fills this entry, fix it by hand:** title "Google Summer of Code 2026 Contributor", company "The Linux Foundation (OpenPrinting)".
4. **"84.6%" was read as a GPA of 4.6.** The grade is now "Very Good with Honors". Give the percentage when an Egyptian employer's form asks for it.
5. **A line starting with "~40%"** (the raised "~") was read as the start of a new job. It now says "about 40%".
6. **Master CV:** the page break fell right before a heading, and the heading got glued to the last line of page 1. Page 2 now starts in the middle of a bullet.
7. **Word copies:** Word's own bullet symbol isn't known to parsers, and narrow gaps glued the title, company and dates together. The Word copies now use a plain "•" and wide gaps, like the PDFs.

### 2. Text and layout checks
These rules are built into `cv-style.sty`:

| Check | How it is met | Result |
|---|---|---|
| One column, no tables, text boxes, icons, images, headers or footers | Plain paragraphs and lists only (Word copies too: 0 tables, empty header and footer) | ✅ |
| Text extracts exactly | `glyphtounicode` + `cmap`; ligatures and hyphenation are off, so "finalist" is never extracted as a ligature glyph and "Android" is never split as "An-droid" | ✅ |
| Three extractors agree | pdftotext, pdfminer.six and PyMuPDF give the same word count for each PDF | ✅ |
| Word copy = PDF | Every word in each .docx matches the PDF (word-by-word comparison) | ✅ |
| Fonts | All embedded, with Unicode maps. No Type 3 bitmap fonts. Smallest text 9 pt. | ✅ |
| Standard section names | Summary, Experience, Open Source Projects, Projects, Technical Skills, Achievements, Education (real Word headings in the .docx) | ✅ |
| Contact details as text | Email, phone and the full LinkedIn, GitHub and Codeforces URLs are written out, not hidden behind icons | ✅ |
| Dates | `Mon YYYY – Mon YYYY` or `Present` on the same line as the title and company | ✅ |
| No first-person words | No "I" or "my" in any CV | ✅ |
| Spelling | Spell checker (and Enhancv, 18 Oct 2026): only technical terms are flagged, such as Zephyr, Clippy, varlink, devicetree and asyncio. Keep them spelled exactly as they are, because ATS keyword search matches them letter for letter | ✅ |
| Repeated words | Enhancv flagged "merged" 5 times. Now it is used at most twice per CV; the rest say "accepted", "landed upstream" or name the PR status once in the entry title | ✅ |
| Links | Every link was opened; all the repos, upstream PRs, the Zephyr issue and the Google Summer of Code report exist. COSMIC PRs #2182 and #188 are open and ready for review (since 26 Sep 2026), so the CVs say "in review". | ✅ |
| Length | One page for each version; two for the master (PDF and Word). **Send only the 1-page versions** (the program's tips: 1 page for recent graduates); the master is the source | ✅ |

### 3. What no one can promise
- Every company sets up its ATS differently. Some auto-reject on knockout questions (visa, location, years of experience) no matter what the CV says. Answer those questions honestly on the form.
- Some ATS rank CVs by how well they match the job ad's words. That's why each application should get the 3–5 exact phrases from the ad (see "Before each application" below).
- When a job site shows its parsed version of your CV in a form, **always check it and fix any field by hand** before you submit.
- **File name:** rename the file to `Abdelrahman-Khalifa-CV.pdf` (or `.docx`) before you upload it.

### Keyword match against real job ads (Oct 2026)

Each version's text was compared with real ads from the companies it targets. "Match" is the share of the ad's technical keywords that the CV contains.

| Version | Job ad | Match | Still missing (not in his record, so not added) |
|---|---|---|---|
| General SWE | Canonical — Graduate Software Engineer, Open Source and Linux | 72% | Go, cloud, containers/Kubernetes, packaging, security |
| General SWE | IMC — C++ Software Engineer, Early Careers | 75% | low-latency, profiling |
| General SWE | Cloudflare — Software Engineer, Egress (Go/Rust) | 63% | Go, cloud/AWS, Kubernetes, distributed systems |
| Systems/Rust | Canonical — C++/Rust Graphics and Windowing (Mir) | 68% | graphics, OpenGL/Vulkan, Wayland |
| Systems/Rust | Canonical — Graduate Software Engineer | 69% | Go, cloud, containers, packaging, security |
| Systems/Rust | Cloudflare — Software Engineer, Egress (Go/Rust) | 58% | Go, cloud/AWS, Kubernetes, distributed systems |
| Embedded | Canonical — Embedded & Desktop Linux Systems Engineer | 67% | Docker/containers, cloud, graphics, packaging |
| Embedded | Canonical — Embedded Linux Senior Software Engineer | 67% | Docker/containers, cloud, graphics, packaging |

The missing keywords line up with the gaps in [01 §4](../01-Profile-Analysis.md#4-gaps-and-how-to-close-them). The planned Rust backend service project (Docker, CI, Postgres, metrics) would add Docker, containers, cloud and distributed systems.

**Before each application:**
1. Copy the version's `.tex` file.
2. Add the 3–5 exact phrases from the ad that are true for him to the Skills section and the Summary.
3. Rebuild the PDF.

## Facts left out on purpose
- **Military service:** none of the versions says anything about it. International employers don't ask. For Egyptian employers, add "Military service: completed" under the contact details.
- **Removed after the interview:** the Deloitte mentorship, the Winter of Code lp/lpstat PRs (not merged) and the "C++/Qt" wording for the EKSON app (it is PyQt5).
- **Zephyr issue #86977** is now verified (he was assigned and wrote the merged commit b117036), so the CVs link to it.
