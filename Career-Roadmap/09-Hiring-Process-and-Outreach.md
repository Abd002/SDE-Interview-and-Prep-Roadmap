# 09 — Hiring Process and Outreach (the 5 shortlisted roles)

> **For:** the [current shortlist](08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026): Canonical, Cloudflare, Igalia, NXP and Amazon.
> **Checked on:** 19 Oct 2026.
> **Sources:**
> - each company's own hiring pages, where one exists;
> - candidate reports on Glassdoor, Blind, LeetCode and 1point3acres, and prep sites.
>
> **Two limits:**
> - **Reddit and LinkedIn block this research environment.** Reddit returns 403 and LinkedIn returns 999, so their threads and profiles could not be read. Reddit-style reports were found on other sites instead.
> - Engineers at these companies almost never publish their CVs, so "copy the CV of people who got in" was replaced by the CV template that new-grad hires and the career subreddits use most. See [CV/README.md](CV/README.md#second-template-jakes-resume).
>
> **Official** = the company says it. **Reports** = what candidates wrote, which varies by team, country and year.

## Contents
- [1. Timeline at a glance](#1-timeline-at-a-glance)
- [2. Each company's folder](#2-each-companys-folder)
- [3. People to contact](#3-people-to-contact)
- [4. What to ask, and message templates](#4-what-to-ask-and-message-templates)
- [5. Follow-up rules](#5-follow-up-rules)

---

## 1. Timeline at a glance

All of this assumes you apply in the week of 19 Oct 2026.

| Company | Stages | First reply | Total time | Hardest part for you |
|---|---|---|---|---|
| **Canonical** | Written interview → GIA test → 3 technical interviews → talent interview (+ personality profile) → late-stage interviews → offer | Days to 2 weeks (the dashboard link) | **About 3 months** on average (official); reports say 2.5–6 months | The written interview, and the GIA timed test |
| **Cloudflare** | Recruiter call → hiring manager → coding screen → 3–5 round loop | 1–4 weeks, often silent if rejected | **3–6 weeks** once it starts (reports); some took 2 months | Coding plus networking depth, possibly in Rust or Go |
| **Igalia** | Form with cover letter → video interview(s) | Unknown; small company | Weeks (few reports) | Showing JS engine or C++ interest in the cover letter |
| **NXP** | Workday → recruiter email → 15–30 min phone call → panel interviews (maybe a test) | 1–3 weeks | **~3–6 weeks**. NXP aims to reply **within 2 weeks of an interview** (official); Glassdoor's average is 19 days | C and embedded depth, secure boot, testing |
| **Amazon** | Online assessment (coding, workstyles, work simulation) → final interviews (usually 3 × 1 h) → offer | OA link within days to weeks; an email after each OA section (official) | **4–8 weeks** (reports) | Leadership Principles stories and LeetCode-medium speed |

**Expected order of answers:** Amazon's OA and NXP's recruiter will probably reply first. Cloudflare and Igalia come next. Canonical runs the longest, with offers likely around Jan–Feb 2027.

---

## 2. Each company's folder

Everything for one application now lives in that company's folder: the role, the CV to send (both templates), the saved job ad, the full hiring process and how to prepare, the people to contact, and a checklist.

| Company | Folder | Role |
|---|---|---|
| Canonical | [CV/applications/canonical/](CV/applications/canonical/README.md) | Graduate Software Engineer, Open Source and Linux |
| Cloudflare | [CV/applications/cloudflare/](CV/applications/cloudflare/README.md) | Systems Engineer, Network Protocols & Distributed Systems |
| Igalia | [CV/applications/igalia/](CV/applications/igalia/README.md) | JavaScript Engine Developer |
| NXP | [CV/applications/nxp/](CV/applications/nxp/README.md) | Junior Embedded Software Engineer, Secure IoT Firmware |
| Amazon | [CV/applications/amazon/](CV/applications/amazon/README.md) | Software Development Engineer – 2027 (Dublin) |

This page keeps what the five share: the timeline above, the mentors and open-source contacts below, the message templates and the follow-up rules.

---

## 3. People to contact

**Ground rules:**
- Contact people about the work, not to ask for a job straight away.
- Never send the same message to 20 people at one company.
- Log every contact in the Notion row's **Contacts** and **Referral status** fields.

### Tier 1: people who already know your work (contact first)

These are your Google Summer of Code mentors (from [CV/facts.md](CV/facts.md)). They can give real referrals and LinkedIn recommendations.

| Person | Connection | What to ask for | Helps with |
|---|---|---|---|
| **Till Kamppeter** | OpenPrinting leader, your GSoC mentor. He was Canonical's printing maintainer for years ([LWN, 2025](https://lwn.net/Articles/1031701): Canonical laid him off in 2025, and he now runs OpenPrinting with The Linux Foundation) | A LinkedIn recommendation; introductions to Ubuntu desktop or printing engineers he still knows at Canonical; his view on which Canonical team fits you | Canonical (introduction, not an internal referral), credibility everywhere |
| **Michael Murphy** | System76 (COSMIC), GSoC mentor and reviewer of your COSMIC PRs | Merge or review status of #2182 and #188; a recommendation; System76 openings | System76, plus Canonical and Igalia as proof |
| **Mintu Gogoi** and **Titiksha Bansal** | GSoC mentors | A LinkedIn recommendation; whether they know people at the five companies | All |

### Tier 2: open-source people you have already worked with

You only had short code-review contact with these people, so ask for advice, not a referral.

| Person (GitHub) | Connection | Use |
|---|---|---|
| Zephyr networking reviewers of your PR #87167: **jukkar**, **rlubos**, **pdgendt**; merged by **kartben** | They reviewed or approved your `IP_MULTICAST_LOOP` PR | Ask which open Zephyr networking issues are worth taking next. More Zephyr PRs help with NXP |
| **Boa maintainers** (the reviewers of your PR #4553) | They reviewed your Boa PR | Ask for a good next issue in Boa or **boa-dev/temporal**. That leads to the Igalia link explained in the [Igalia folder](CV/applications/igalia/README.md) |

### Tier 3: people at each company (find them on LinkedIn)

LinkedIn can't be opened from this environment, so each company folder (§2) has ready LinkedIn searches and who to look for. Look for 2–3 people per company. Good choices are:
- engineers on the team the role names;
- someone from Egypt or the MENA region;
- recent graduates who joined in the last 1–2 years;
- the recruiter named on the job.

**Communities where these engineers talk in public:**
- **Zephyr Discord:** NXP and Nordic engineers are there.
- **Boa's Matrix/Discord:** Boa contributors and people working on temporal_rs.
- **Ubuntu Discourse** and **OpenPrinting's channels:** Canonical people.

---

## 4. What to ask, and message templates

### Questions that get useful answers
1. "What does a new graduate on your team work on in the first 3 months?"
2. "What made recent graduate hires stand out in the process?"
3. "Which skills would you work on if you were applying now: [two specific skills]?"
4. "Is the team behind [role link] still hiring, and is it open to candidates who need visa sponsorship?"
5. Ask this **only after a real conversation:** "Would you be comfortable referring me? I can send my CV and a 3-line summary."

**Don't ask** "Do you have any jobs for me?", and don't attach your CV in the first message.

### Template A: mentor (Tier 1), asking for a recommendation or referral
> Hi Till, I hope you're well. I'm applying for graduate roles now, including Canonical's Graduate Software Engineer (Open Source and Linux). Working on the COSMIC printers backend with you was the best engineering experience I've had. Would you be willing to write a short LinkedIn recommendation about my GSoC work? And if you think it fits, could you introduce me to someone on the Ubuntu Desktop or Foundations team? Thank you either way. Abdelrahman

### Template B: engineer at the company (Tier 3), connection note (under 300 characters)
> Hi [Name], I'm a Rust/C engineer from Egypt (Google Summer of Code 2026 with The Linux Foundation: OpenPrinting, plus merged PRs in Zephyr, Boa and Clippy). I read your team's [blog post or project]. Could I ask you two quick questions about how new graduates join [team]?

### Template C: after they accept the connection
> Thanks for connecting! I'm applying to [role link]. [One sentence on why your work fits: e.g. "I built a Rust IPC service around a C library for COSMIC, which feels close to the FL2 move from Lua to Rust."] Two questions: (1) what does a new engineer work on first, and (2) what made recent hires stand out? Happy to keep it to 15 minutes on a call, or just here.

### Template D: recruiter, after you apply
> Hi [Name], I applied today for [role, job ID]. In short: Google Summer of Code 2026 contributor with The Linux Foundation (OpenPrinting, Rust and C, 7 accepted upstream PRs) and embedded engineer on Zephyr RTOS. I'd be glad to answer anything about visa sponsorship or timing. Thank you!

---

## 5. Follow-up rules

| Situation | What to do |
|---|---|
| No reply to a connection request after 7 days | Leave it. Try another person. |
| No reply to a message after 7 days | One short follow-up. Then stop. |
| No reply to an application after 3 weeks (2 for NXP) | One polite email or LinkedIn note to the recruiter with the job ID. |
| Workday or Greenhouse status says "rejected" | Thank the recruiter, ask for feedback once, and note the re-apply date (Canonical: 180 days). |
| An interview is scheduled | Re-read this page's section for that company, plus [CV/Interview-Talking-Guide.md](CV/Interview-Talking-Guide.md). Send a thank-you note within 24 hours. |
| An offer arrives while others are still running | Tell the other companies at once and ask whether they can speed up. This is normal and expected. |

Update the Status and Next step for each company in [08](08-Application-Tracker.md) and in Notion after every reply.
