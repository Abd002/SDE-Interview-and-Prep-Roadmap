# Canonical: everything for this application

> Part of the [current shortlist](../../../08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026). Overview of all five, shared outreach templates and follow-up rules: [09 — Hiring Process and Outreach](../../../09-Hiring-Process-and-Outreach.md). Checked on 19 Oct 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Graduate Software Engineer, Open Source and Linux](https://job-boards.greenhouse.io/canonical/jobs/8249005) · alternates: [Junior Ubuntu Software Engineer](https://job-boards.greenhouse.io/canonical/jobs/6707669), [Junior Linux Kernel Engineer](https://job-boards.greenhouse.io/canonical/jobs/5370815) |
| **Where** | Home based, worldwide |
| **Why it fits** | Asks for code in Rust or C/C++, Linux experience, personal projects; your GSoC work on the Linux printing stack (OpenPrinting, libcups) |
| **Status** | Preparing (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b4181a38ea3c73df95101d4)) |
| **Applied on** | — |
| **Saved job ad** | [job-ad.md](job-ad.md), in case the posting closes |

## 2. Files in this folder

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** The tailored CV (main template), 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Same CV in Word, only if the site asks for Word |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | Its LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | The same facts in the original [Jake's Resume](https://github.com/jakegut/resume) template (see [CV/README](../../README.md#second-template-jakes-resume)) |
| [job-ad.md](job-ad.md) | The job ad text as it was on 18–19 Oct 2026 |

**What the tailored CV changes for this ad:** Title "Linux, Open Source, Rust, C"; summary adds Python, Ubuntu/Debian, B.Sc. with Honors, Codeforces Expert and ECPC (the ad asks for an exceptional academic record); adds Java; adds firmware and bootloaders. Ad keywords matched: **16 of 23**.

## 3. Hiring process, timeline and how to prepare

| Company | Stages | First reply | Total time | Hardest part for you |
|---|---|---|---|---|
| **Canonical** | Written interview → GIA test → 3 technical interviews → talent interview (+ personality profile) → late-stage interviews → offer | Days to 2 weeks (the dashboard link) | **About 3 months** on average (official); reports say 2.5–6 months | The written interview, and the GIA timed test |

#### The process (official, [canonical.com/careers/hiring-process](https://canonical.com/careers/hiring-process))

1. **Application review:** a domain expert reads it. If it passes, you get a link to a **personal dashboard** with your assessment and interview plan.
   - You can apply to **one job per 180 days, or up to 4 jobs** in that period.
2. **Written interview:** questions about your achievements, experience and skills, tailored to the role.
   - You choose the format and length and upload it.
   - **It is reviewed anonymously** (without your CV), usually by 2 domain experts.
   - Every later interviewer reads it ([Canonical blog](https://ubuntu.com/blog/written-interviews)).
3. **Psychometric test (GIA):** 30–45 minutes in 5 parts (reasoning, perceptual speed, number speed, word meaning, spatial). Everyone takes it. Canonical says it is "not an IQ test" but a measure of trainability.
4. **Technical assessment:** only some roles have one.
5. **Early-stage interviews:** 3 interviews on technical and domain skills with likely future colleagues. They also decide which team fits you.
6. **Talent interview:** a 10-minute Personality Profile Analysis (PPA) first, then a talk about your motivation. **Pay discussion usually starts here.**
7. **Late-stage interviews:** your future manager, the Hiring Lead and senior people. For leadership roles, the CEO too.
8. **Offer:** the Hiring Lead makes it.

**Time:** about **3 months** from application to offer, for every level from graduate to VP (official).

#### What candidates report
Sources: [Blind](https://www.teamblind.com/post/canonical-hiring-process-post-written-interview-tk3cbqoh), [Calibrd](https://www.calibrd.com/interview-prep/canonical-interview), [Glassdoor](https://www.glassdoor.co.in/Interview/Canonical-Interview-Questions-E230560.htm).
- **The written interview is long:** about 40–50 questions, 15–21 pages. It is usually due **within 14 days**.
- **They ask about school:** it asks about **high school results** (Thanaweya Amma), university grades with an explanation of the grading system, leadership, and why Canonical.
- **Live rounds:** one report describes about 8 one-hour interviews in total. Technical rounds are often conversational Linux questions, with little live coding. Some roles have a 60-minute coding test.
- **Where people get rejected:** some candidates report rejection right after the GIA/PPA. Glassdoor rates the experience as mostly negative because it is long. One employee wrote that the long process was still worth it.

#### How to do well
- **Write the written interview yourself.** Canonical says to "use your own words and avoid online aids". Reviewers compare your writing with your interviews.
- **Collect your evidence before you start:**
  - your **Thanaweya Amma score and percentile**;
  - your university grade, **84.6% (Very Good with Honors)**, with a one-line explanation of Egyptian grading;
  - Codeforces Expert and 4× ECPC finalist;
  - IEEE treasurer.
- **Prove every claim with a link:**
  - the COSMIC printers PRs (#2182, #188);
  - the 7 accepted PRs in cups-rs and libcups;
  - the Zephyr, Boa and Clippy PRs;
  - kernel-monitor, after you fix the bugs listed in [CV/facts.md](../../facts.md).
- **Mention Ubuntu printing.** CUPS is part of the Ubuntu stack, and your GSoC work was on the Linux printing system that Ubuntu ships.
- **Practice GIA-style tests** for a week. They are timed and speed matters, so search "Thomas GIA practice test".
- **Expect Linux questions:**
  - processes and signals;
  - systemd;
  - packages (apt, dpkg, snaps);
  - the boot process;
  - file systems;
  - networking commands;
  - how a kernel module works (your kernel-monitor).

## 4. People to contact

**Start with people who already know your work** (your Google Summer of Code mentors):

| Person | Connection | What to ask for | Helps with |
|---|---|---|---|
| **Till Kamppeter** | OpenPrinting leader, your GSoC mentor. He was Canonical's printing maintainer for years ([LWN, 2025](https://lwn.net/Articles/1031701): Canonical laid him off in 2025, and he now runs OpenPrinting with The Linux Foundation) | A LinkedIn recommendation; introductions to Ubuntu desktop or printing engineers he still knows at Canonical; his view on which Canonical team fits you | Canonical (introduction, not an internal referral), credibility everywhere |
| **Michael Murphy** | System76 (COSMIC), GSoC mentor and reviewer of your COSMIC PRs | Merge or review status of #2182 and #188; a recommendation; System76 openings | System76, plus Canonical and Igalia as proof |
| **Mintu Gogoi** and **Titiksha Bansal** | GSoC mentors | A LinkedIn recommendation; whether they know people at the five companies | All |

**People at Canonical** (open the searches while logged in to LinkedIn; pick 2–3 people):

| Company | Who to look for | LinkedIn search |
|---|---|---|
| Canonical | Ubuntu Desktop or Foundations engineers; graduates hired 2024–2026; Egyptians at Canonical | [Canonical + Ubuntu engineer](https://www.linkedin.com/search/results/people/?keywords=Canonical%20Ubuntu%20software%20engineer) · [Canonical + Egypt](https://www.linkedin.com/search/results/people/?keywords=Canonical%20Ubuntu%20Egypt) · [Canonical graduate](https://www.linkedin.com/search/results/people/?keywords=Canonical%20graduate%20software%20engineer) |

**What to ask and the message templates:** [09 §4](../../../09-Hiring-Process-and-Outreach.md#4-what-to-ask-and-message-templates). **Follow-up rules:** [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Log each contact in the Notion row (Contacts, Referral status).

## 5. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] Message 1–2 people from §4 (mentors first) **before** applying.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); check every auto-filled form field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Prepare with §3 while you wait.
- [ ] Follow up once if there is no reply (see 09 §5).
