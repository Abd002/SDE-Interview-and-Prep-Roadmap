# NXP: everything for this application

> Part of the [current shortlist](../../../08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026). Overview of all five, shared outreach templates and follow-up rules: [09 — Hiring Process and Outreach](../../../09-Hiring-Process-and-Outreach.md). Checked on 19 Oct 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Junior Embedded Software Engineer, Secure IoT Firmware](https://nxp.wd3.myworkdayjobs.com/careers/job/Gratkorn/Junior-Embedded-Software-Engineer---Secure-IoT-Firmware--m-f-d-_R-10066519) |
| **Where** | Gratkorn, Austria |
| **Why it fits** | Junior; strong C, 32-bit MCUs, testing; nice-to-have Zephyr/FreeRTOS and secure boot (your dual-bank bootloader) |
| **Status** | Preparing (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b4181eaa634eb142008680e)) |
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

**What the tailored CV changes for this ad:** Title "C, 32-bit MCUs, Zephyr RTOS"; summary: 32-bit MCUs, the bootloader with CRC/signature check and rollback; new Testing line (unit and integration tests, pytest, Python scripts for build and test automation in CI); adds Java. Ad keywords matched: **17 of 22 (base: 12)**.

## 3. Hiring process, timeline and how to prepare

| Company | Stages | First reply | Total time | Hardest part for you |
|---|---|---|---|---|
| **NXP** | Workday → recruiter email → 15–30 min phone call → panel interviews (maybe a test) | 1–3 weeks | **~3–6 weeks**. NXP aims to reply **within 2 weeks of an interview** (official); Glassdoor's average is 19 days | C and embedded depth, secure boot, testing |

#### The process (official, [NXP Getting Hired](https://www.nxp.com/company/about-nxp/careers/getting-hired:GETTING-HIRED))
1. **Apply** in the job tool. Track your status in **Candidate Home** (Workday). NXP prefers a "job-specific resume", which is what the NXP copy is.
2. **Recruiter email.**
3. **Phone interview:** 15–30 minutes, to confirm you meet the requirements.
4. **Virtual or on-site interviews:** a series of meetings, possibly a **panel**.
5. **Decision:** NXP aims to answer "**within two weeks of an interview**".

#### What candidates report
- **Glassdoor average:** 19 days across all roles ([Glassdoor](https://www.glassdoor.com/Interview/NXP-Semiconductors-Interview-Questions-E13528.htm)). Some roles add an online aptitude or technical test of 60–90 minutes.
- **An old Gratkorn report (2012):** a phone screen, then a 3-hour on-site session. It included a **comprehension test on a software specification** and a design question (emulating non-volatile memory on EEPROM) ([Glassdoor](https://static.glassdoor.nl/Interview/NXP-Semiconductors-Interview-E13528-RVW7422620.htm)). It's old, but it shows the style.

#### How to do well
- **Know the topics:**
  - C at a deep level: `volatile`, bit manipulation, memory layout, pointers, undefined behaviour;
  - interrupts and RTOS basics;
  - **secure boot** (signature check, chain of trust, rollback protection; your dual-bank bootloader);
  - flash/EEPROM wear and NVM emulation;
  - NFC and smart-card basics (Gratkorn builds NXP's NFC and secure elements);
  - unit and integration testing of firmware.
- **Mention your Zephyr PR.** NXP is a major Zephyr contributor.
- **Visa:** Austria's Red-White-Red Card (see [06](../../../06-Salaries-and-Visas.md)).

**Fast revision before the interview:** C and C++, operating systems, testing, security (secure boot), Linux. Links for each track are in [Interview-Fast-Revision.md](../../../../Study-Plan/Interview-Fast-Revision.md#2-links-by-track); follow its routine (§1) from 7 days before.

## 4. People to contact

**Start with people who already know your work** (your Google Summer of Code mentors):

| Person | Connection | What to ask for | Helps with |
|---|---|---|---|
| **Till Kamppeter** | OpenPrinting leader, your GSoC mentor. He was Canonical's printing maintainer for years ([LWN, 2025](https://lwn.net/Articles/1031701): Canonical laid him off in 2025, and he now runs OpenPrinting with The Linux Foundation) | A LinkedIn recommendation; introductions to Ubuntu desktop or printing engineers he still knows at Canonical; his view on which Canonical team fits you | Canonical (introduction, not an internal referral), credibility everywhere |
| **Mintu Gogoi** and **Titiksha Bansal** | GSoC mentors | A LinkedIn recommendation; whether they know people at the five companies | All |

**Open-source people you have already worked with** (ask for advice, not a referral):

| Person (GitHub) | Connection | Use |
|---|---|---|
| Zephyr networking reviewers of your PR #87167: **jukkar**, **rlubos**, **pdgendt**; merged by **kartben** | They reviewed or approved your `IP_MULTICAST_LOOP` PR | Ask which open Zephyr networking issues are worth taking next. More Zephyr PRs help with NXP |

**People at NXP** (open the searches while logged in to LinkedIn; pick 2–3 people):

| Company | Who to look for | LinkedIn search |
|---|---|---|
| NXP | Engineers in Gratkorn (secure IoT, NFC, firmware); NXP's Zephyr maintainers (the Zephyr `MAINTAINERS.yml` lists NXP platform maintainers such as **dleach02** and **mmahadevan108**; check the current file) | [NXP Gratkorn embedded](https://www.linkedin.com/search/results/people/?keywords=NXP%20Gratkorn%20embedded%20software) · [NXP Austria recruiter](https://www.linkedin.com/search/results/people/?keywords=NXP%20Austria%20talent%20acquisition) |

**What to ask and the message templates:** [09 §4](../../../09-Hiring-Process-and-Outreach.md#4-what-to-ask-and-message-templates). **Follow-up rules:** [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Log each contact in the Notion row (Contacts, Referral status).

## 5. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] Message 1–2 people from §4 (mentors first) **before** applying.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); check every auto-filled form field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Prepare with §3 while you wait.
- [ ] Follow up once if there is no reply (see 09 §5).
