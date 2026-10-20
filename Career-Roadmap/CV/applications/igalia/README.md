# Igalia: everything for this application

> Part of the [current shortlist](../../../08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026). Overview of all five, shared outreach templates and follow-up rules: [09 — Hiring Process and Outreach](../../../09-Hiring-Process-and-Outreach.md). Checked on 19 Oct 2026.

## 1. The role

| | |
|---|---|
| **Role** | [JavaScript Engine Developer](https://www.igalia.com/jobs/javascript_engine_developer) |
| **Where** | Remote |
| **Why it fits** | "No strict requirements"; V8/JSC/SpiderMonkey work in C/C++; your Boa (JS engine in Rust) PR is direct evidence |
| **Status** | Preparing (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b4181e18016ec6227aca0f9)) |
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

**What the tailored CV changes for this ad:** Title "Rust, C++, C, Open Source"; summary leads with Boa (a JavaScript engine) and Clippy; Boa listed first. Ad keywords matched: **6 of 12**.

## 3. Hiring process, timeline and how to prepare

| Company | Stages | First reply | Total time | Hardest part for you |
|---|---|---|---|---|
| **Igalia** | Form with cover letter → video interview(s) | Unknown; small company | Weeks (few reports) | Showing JS engine or C++ interest in the cover letter |

#### The process
- **Application:** the form on the job page. It asks for your time zone, a **cover letter**, a **CV (PDF only, 5 MB max)**, other documents, and how you found the role.
  - The ad says: "We do not have strict requirements for this position."
  - It also says previous open-source contributions "can help".
- **Interviews:** the one public Glassdoor report ([link](https://www.glassdoor.com/Interview/Igalia-Interview-Questions-E2924077.htm)) describes an application, then a **video interview**. It covered past internships, open-source work, remote work, and whether your skills fit a current project. Difficulty was 2 out of 5.
- **How Igalia works:** it is a worker-owned cooperative where decisions are made by consensus in an assembly ([igalia.com/jobs](https://www.igalia.com/jobs/)). Expect several people to meet you, and a decision that may take a few weeks.
- **Another way in:** the paid [Igalia Coding Experience](https://www.igalia.com/coding-experience/) programme for students and career changers. Apply there if the developer role says no.

#### How to do well
- **The cover letter is the main filter.** Make it short and specific:
  - your Boa PR (`JsStr::code_points()` for Latin1 strings, #4553), with what it taught you about string representation in engines;
  - your Rust Clippy fix;
  - your C++ experience;
  - one JS engine feature or proposal you've been reading about.
- **Use the Temporal link.** V8 ships Temporal using **temporal_rs**, a Rust crate that started in **Boa**. That work was a collaboration between Google, **Igalia**, ICU4X and Boa contributors ([Boa blog](https://boajs.dev/), [temporal_rs in Chromium](https://chromium.googlesource.com/chromium/src.git/+/lkgr-android-internal/third_party/rust/temporal_rs)).
  - A PR to [boa-dev/temporal](https://www.goodfirstissue.org/boa-dev/temporal) (good-first-issues exist) puts you in the same project as Igalia's engineers.
  - That is the single strongest thing you can do for this application.
- **Learn engine basics:**
  - parsing to an AST, then bytecode;
  - the interpreter and JIT tiers (V8: Ignition, Sparkplug, Maglev, TurboFan);
  - hidden classes and inline caches;
  - garbage collection (generational GC, mark-sweep);
  - test262.
- **They will ask about remote work.** Have an answer about async communication, time zones, and how you worked with your Google Summer of Code mentors.

**Fast revision before the interview:** C and C++ (plus the CppQuiz plan), Rust, data structures and algorithms, Git. Links for each track are in [Interview-Fast-Revision.md](../../../../Study-Plan/Interview-Fast-Revision.md#2-links-by-track); follow its routine (§1) from 7 days before.

## 4. People to contact

**Start with people who already know your work** (your Google Summer of Code mentors):

| Person | Connection | What to ask for | Helps with |
|---|---|---|---|
| **Till Kamppeter** | OpenPrinting leader, your GSoC mentor. He was Canonical's printing maintainer for years ([LWN, 2025](https://lwn.net/Articles/1031701): Canonical laid him off in 2025, and he now runs OpenPrinting with The Linux Foundation) | A LinkedIn recommendation; introductions to Ubuntu desktop or printing engineers he still knows at Canonical; his view on which Canonical team fits you | Canonical (introduction, not an internal referral), credibility everywhere |
| **Michael Murphy** | System76 (COSMIC), GSoC mentor and reviewer of your COSMIC PRs | Merge or review status of #2182 and #188; a recommendation; System76 openings | System76, plus Canonical and Igalia as proof |
| **Mintu Gogoi** and **Titiksha Bansal** | GSoC mentors | A LinkedIn recommendation; whether they know people at the five companies | All |

**Open-source people you have already worked with** (ask for advice, not a referral):

| Person (GitHub) | Connection | Use |
|---|---|---|
| **Boa maintainers** (the reviewers of your PR #4553) | They reviewed your Boa PR | Ask for a good next issue in Boa or **boa-dev/temporal**. That leads to the Temporal link explained in §3 of this page |

**People at Igalia** (open the searches while logged in to LinkedIn; pick 2–3 people):

| Company | Who to look for | LinkedIn search |
|---|---|---|
| Igalia | The Web Languages (formerly Compilers) team. Public names include **Joyee Cheung** (Node.js, named in Igalia's [2025 retrospective](https://blogs.igalia.com/compilers/2026/02/06/igalia-s-compilers-team-a-2025-retrospective/)). Also anyone at Igalia who works on Temporal or V8 | [Igalia JavaScript engine](https://www.linkedin.com/search/results/people/?keywords=Igalia%20JavaScript%20V8) · [Igalia compilers](https://www.linkedin.com/search/results/people/?keywords=Igalia%20compilers) |

**What to ask and the message templates:** [09 §4](../../../09-Hiring-Process-and-Outreach.md#4-what-to-ask-and-message-templates). **Follow-up rules:** [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Log each contact in the Notion row (Contacts, Referral status).

## 5. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] Message 1–2 people from §4 (mentors first) **before** applying.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); check every auto-filled form field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Prepare with §3 while you wait.
- [ ] Follow up once if there is no reply (see 09 §5).
