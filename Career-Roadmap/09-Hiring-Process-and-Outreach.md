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
- [2. Canonical](#2-canonical)
- [3. Cloudflare](#3-cloudflare)
- [4. Igalia](#4-igalia)
- [5. NXP (Gratkorn, Austria)](#5-nxp-gratkorn-austria)
- [6. Amazon (Dublin, SDE 2027)](#6-amazon-dublin-sde-2027)
- [7. People to contact](#7-people-to-contact)
- [8. What to ask, and message templates](#8-what-to-ask-and-message-templates)
- [9. Follow-up rules](#9-follow-up-rules)

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

## 2. Canonical

**Role:** [Graduate Software Engineer, Open Source and Linux](https://job-boards.greenhouse.io/canonical/jobs/8249005).
**Your CV:** [canonical copy](CV/applications/canonical/Abdelrahman-Khalifa-CV.pdf).

### The process (official, [canonical.com/careers/hiring-process](https://canonical.com/careers/hiring-process))

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

### What candidates report
Sources: [Blind](https://www.teamblind.com/post/canonical-hiring-process-post-written-interview-tk3cbqoh), [Calibrd](https://www.calibrd.com/interview-prep/canonical-interview), [Glassdoor](https://www.glassdoor.co.in/Interview/Canonical-Interview-Questions-E230560.htm).
- **The written interview is long:** about 40–50 questions, 15–21 pages. It is usually due **within 14 days**.
- **They ask about school:** it asks about **high school results** (Thanaweya Amma), university grades with an explanation of the grading system, leadership, and why Canonical.
- **Live rounds:** one report describes about 8 one-hour interviews in total. Technical rounds are often conversational Linux questions, with little live coding. Some roles have a 60-minute coding test.
- **Where people get rejected:** some candidates report rejection right after the GIA/PPA. Glassdoor rates the experience as mostly negative because it is long. One employee wrote that the long process was still worth it.

### How to do well
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
  - kernel-monitor, after you fix the bugs listed in [CV/facts.md](CV/facts.md).
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

---

## 3. Cloudflare

**Role:** [Systems Engineer, Network Protocols & Distributed Systems](https://boards.greenhouse.io/cloudflare/jobs/8187404) (London or Lisbon).
**Your CV:** [cloudflare copy](CV/applications/cloudflare/Abdelrahman-Khalifa-CV.pdf).

### The process
Cloudflare publishes no stage-by-stage guide. These are reports from [Glassdoor](https://www.glassdoor.com/Interview/Cloudflare-System-Engineer-Interview-Questions-EI_IE430862.0,10_KO11,26.htm), [TechPrep](https://www.techprep.app/blog/cloudflare-interview-process) and [Design Gurus](https://www.designgurus.io/blog/cloudflare-interview-guide).
1. **Recruiter call (about 30 min):** background, motivation, visa and location.
2. **Hiring manager (30–45 min):** your projects and why this team.
3. **Technical screen (45–60 min):** one medium coding problem, often a systems-flavoured one. Examples reported: a ring buffer, a rate limiter, parsing a protocol frame.
4. **Loop (3–5 interviews):**
   - coding;
   - system design or debugging;
   - a behavioural round (a recent project, a mistake, why Cloudflare);
   - sometimes an **AI-assisted coding round** in an unfamiliar Rust or Go codebase.

**Time:** about 3–6 weeks once it starts. Reports say recruiters can be slow. One London report says 2 months, and rejections often come without feedback.

### How to do well
- **Read** ["Cloudflare just got faster and more secure, powered by Rust"](https://blog.cloudflare.com/20-percent-internet-upgrade/) (Sept 2025). It describes the NGINX/LuaJIT to Rust migration (FL2 on the Oxy framework) that this team is doing. Be ready to explain:
  - **phased modules** with compile-time checked inputs and outputs;
  - **graceful restarts** that keep sockets open;
  - **staged rollouts** with automatic rollback;
  - the end-to-end comparison tests between the old and new proxy (Flamingo);
  - **fallback** to the old system.
- **Know networking basics:**
  - the TCP handshake and how TCP closes a connection;
  - how HTTP/1.1, HTTP/2 and HTTP/3 differ;
  - the TLS handshake;
  - DNS resolution;
  - what a reverse proxy does;
  - IPv4 multicast (your Zephyr PR).
- **Practise Rust coding:** ownership, async/tokio, error handling. Write a small proxy or rate limiter in Rust before the loop. Look at [Pingora](https://github.com/cloudflare/pingora), Cloudflare's open-source Rust proxy framework.
- **Behavioural story:** your cosmic-printers design, where the C FFI code runs in a separate varlink service so a crash can't take down Settings. That is the same reliability thinking FL2 uses.

---

## 4. Igalia

**Role:** [JavaScript Engine Developer](https://www.igalia.com/jobs/javascript_engine_developer) (remote).
**Your CV:** [igalia copy](CV/applications/igalia/Abdelrahman-Khalifa-CV.pdf).

### The process
- **Application:** the form on the job page. It asks for your time zone, a **cover letter**, a **CV (PDF only, 5 MB max)**, other documents, and how you found the role.
  - The ad says: "We do not have strict requirements for this position."
  - It also says previous open-source contributions "can help".
- **Interviews:** the one public Glassdoor report ([link](https://www.glassdoor.com/Interview/Igalia-Interview-Questions-E2924077.htm)) describes an application, then a **video interview**. It covered past internships, open-source work, remote work, and whether your skills fit a current project. Difficulty was 2 out of 5.
- **How Igalia works:** it is a worker-owned cooperative where decisions are made by consensus in an assembly ([igalia.com/jobs](https://www.igalia.com/jobs/)). Expect several people to meet you, and a decision that may take a few weeks.
- **Another way in:** the paid [Igalia Coding Experience](https://www.igalia.com/coding-experience/) programme for students and career changers. Apply there if the developer role says no.

### How to do well
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

---

## 5. NXP (Gratkorn, Austria)

**Role:** [Junior Embedded Software Engineer, Secure IoT Firmware](https://nxp.wd3.myworkdayjobs.com/careers/job/Gratkorn/Junior-Embedded-Software-Engineer---Secure-IoT-Firmware--m-f-d-_R-10066519).
**Your CV:** [nxp copy](CV/applications/nxp/Abdelrahman-Khalifa-CV.pdf).

### The process (official, [NXP Getting Hired](https://www.nxp.com/company/about-nxp/careers/getting-hired:GETTING-HIRED))
1. **Apply** in the job tool. Track your status in **Candidate Home** (Workday). NXP prefers a "job-specific resume", which is what the NXP copy is.
2. **Recruiter email.**
3. **Phone interview:** 15–30 minutes, to confirm you meet the requirements.
4. **Virtual or on-site interviews:** a series of meetings, possibly a **panel**.
5. **Decision:** NXP aims to answer "**within two weeks of an interview**".

### What candidates report
- **Glassdoor average:** 19 days across all roles ([Glassdoor](https://www.glassdoor.com/Interview/NXP-Semiconductors-Interview-Questions-E13528.htm)). Some roles add an online aptitude or technical test of 60–90 minutes.
- **An old Gratkorn report (2012):** a phone screen, then a 3-hour on-site session. It included a **comprehension test on a software specification** and a design question (emulating non-volatile memory on EEPROM) ([Glassdoor](https://static.glassdoor.nl/Interview/NXP-Semiconductors-Interview-E13528-RVW7422620.htm)). It's old, but it shows the style.

### How to do well
- **Know the topics:**
  - C at a deep level: `volatile`, bit manipulation, memory layout, pointers, undefined behaviour;
  - interrupts and RTOS basics;
  - **secure boot** (signature check, chain of trust, rollback protection; your dual-bank bootloader);
  - flash/EEPROM wear and NVM emulation;
  - NFC and smart-card basics (Gratkorn builds NXP's NFC and secure elements);
  - unit and integration testing of firmware.
- **Mention your Zephyr PR.** NXP is a major Zephyr contributor.
- **Visa:** Austria's Red-White-Red Card (see [06](06-Salaries-and-Visas.md)).

---

## 6. Amazon (Dublin, SDE 2027)

**Role:** [Software Development Engineer – 2027, AUTA](https://www.amazon.jobs/en/jobs/10576783/software-development-engineer-2027-auta).
**Your CV:** [amazon copy](CV/applications/amazon/Abdelrahman-Khalifa-CV.pdf).

### The process
**Online assessment (official, [amazon.jobs OA page](https://amazon.jobs/content/en/how-we-hire/university/sde-oa)):**

| Part | Average time |
|---|---|
| Coding assessment | 70 min |
| Workstyles assessment | 15 min |
| Work simulation | 60 min |
| Feedback survey (required) | 5 min |

- Block **up to 2 hours** in one sitting.
- You get **an email after each section**. Check your spam folder.
- No print-screen (it locks you out), no copy-paste, and no logged-in sites.
- Do the free [practice test](https://hr.gs/TheAmazonCodingDemo) first.

**Final interviews (reports, [LeetCode](https://leetcode.com/discuss/post/6841339/passed-amazon-sde-new-grad-by-anonymous_-1p42/), [Blind](https://www.teamblind.com/post/3x45-amazon-final-new-grad-swe-ky6uwce4)):**
- Usually **3 back-to-back interviews of 45–60 minutes** on one day.
- Each has a coding problem (LeetCode medium) plus **Leadership Principles questions**, or there are 2 technical rounds and 1 behavioural round.
- New grads often go straight from the OA to the final, with no phone screen.

**Time:** 4–8 weeks in total (reports).

**Visa:** Ireland's **Critical Skills Employment Permit**. Amazon usually sponsors it for SDE roles in Dublin; confirm with the recruiter (see [06](06-Salaries-and-Visas.md)).

### How to do well
- **Prepare 6–8 STAR stories** that cover these principles: Customer Obsession, Ownership, Dive Deep, Bias for Action, Learn and Be Curious, Deliver Results, and Have Backbone; Disagree and Commit. The Interview Talking Guide already has the base stories ([CV/Interview-Talking-Guide.md](CV/Interview-Talking-Guide.md)).
  - **Ownership:** you own the EKSON software end to end.
  - **Dive Deep:** the asyncio change that cut CPU use and latency by 40%.
  - **Learn and Be Curious:** the Zephyr PR as your first open-source contribution.
  - **Disagree and Commit:** a design debate with your mentors.
- **The workstyles test:** answer consistently, the way someone with Amazon's Leadership Principles would.
- **The work simulation:** realistic emails and chats where you choose priorities. The customer comes first, data beats opinion, and you escalate when blocked.
- **Coding:**
  - the Blind 75 plus Amazon-tagged LeetCode mediums;
  - explain your thinking aloud;
  - test your code by hand.

  Your Codeforces Expert level is enough, so practise talking while you code.
- **AI tools:** the ad asks for "experience using AI-assisted development tools". Add it to the CV only if it's true, and be ready for one concrete example.

---

## 7. People to contact

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
| **Boa maintainers** (the reviewers of your PR #4553) | They reviewed your Boa PR | Ask for a good next issue in Boa or **boa-dev/temporal**. That leads to the Igalia link in §4 |

### Tier 3: people at each company (find them on LinkedIn)

LinkedIn can't be opened from this environment, so use these searches while logged in. Look for 2–3 people per company. Good choices are:
- engineers on the team the role names;
- someone from Egypt or the MENA region;
- recent graduates who joined in the last 1–2 years;
- the recruiter named on the job.

| Company | Who to look for | LinkedIn search |
|---|---|---|
| Canonical | Ubuntu Desktop or Foundations engineers; graduates hired 2024–2026; Egyptians at Canonical | [Canonical + Ubuntu engineer](https://www.linkedin.com/search/results/people/?keywords=Canonical%20Ubuntu%20software%20engineer) · [Canonical + Egypt](https://www.linkedin.com/search/results/people/?keywords=Canonical%20Ubuntu%20Egypt) · [Canonical graduate](https://www.linkedin.com/search/results/people/?keywords=Canonical%20graduate%20software%20engineer) |
| Cloudflare | Systems engineers in London or Lisbon working on the proxy (FL2, Oxy, Pingora); early-talent recruiters | [Cloudflare systems engineer Lisbon](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20systems%20engineer%20Lisbon) · [Cloudflare Rust proxy](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20Rust%20proxy%20engineer) · [Cloudflare early talent recruiter](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20early%20talent%20recruiter) |
| Igalia | The Web Languages (formerly Compilers) team. Public names include **Joyee Cheung** (Node.js, named in Igalia's [2025 retrospective](https://blogs.igalia.com/compilers/2026/02/06/igalia-s-compilers-team-a-2025-retrospective/)). Also anyone at Igalia who works on Temporal or V8 | [Igalia JavaScript engine](https://www.linkedin.com/search/results/people/?keywords=Igalia%20JavaScript%20V8) · [Igalia compilers](https://www.linkedin.com/search/results/people/?keywords=Igalia%20compilers) |
| NXP | Engineers in Gratkorn (secure IoT, NFC, firmware); NXP's Zephyr maintainers (the Zephyr `MAINTAINERS.yml` lists NXP platform maintainers such as **dleach02** and **mmahadevan108**; check the current file) | [NXP Gratkorn embedded](https://www.linkedin.com/search/results/people/?keywords=NXP%20Gratkorn%20embedded%20software) · [NXP Austria recruiter](https://www.linkedin.com/search/results/people/?keywords=NXP%20Austria%20talent%20acquisition) |
| Amazon | SDEs in Dublin from Egyptian universities; EMEA university recruiters | [Amazon Dublin SDE Egypt](https://www.linkedin.com/search/results/people/?keywords=Amazon%20Dublin%20software%20development%20engineer%20Egypt) · [Amazon university recruiter EMEA](https://www.linkedin.com/search/results/people/?keywords=Amazon%20university%20recruiter%20EMEA) · [Minia University at Amazon](https://www.linkedin.com/search/results/people/?keywords=Minia%20University%20Amazon) |

**Communities where these engineers talk in public:**
- **Zephyr Discord:** NXP and Nordic engineers are there.
- **Boa's Matrix/Discord:** Boa contributors and people working on temporal_rs.
- **Ubuntu Discourse** and **OpenPrinting's channels:** Canonical people.

---

## 8. What to ask, and message templates

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

## 9. Follow-up rules

| Situation | What to do |
|---|---|
| No reply to a connection request after 7 days | Leave it. Try another person. |
| No reply to a message after 7 days | One short follow-up. Then stop. |
| No reply to an application after 3 weeks (2 for NXP) | One polite email or LinkedIn note to the recruiter with the job ID. |
| Workday or Greenhouse status says "rejected" | Thank the recruiter, ask for feedback once, and note the re-apply date (Canonical: 180 days). |
| An interview is scheduled | Re-read this page's section for that company, plus [CV/Interview-Talking-Guide.md](CV/Interview-Talking-Guide.md). Send a thank-you note within 24 hours. |
| An offer arrives while others are still running | Tell the other companies at once and ask whether they can speed up. This is normal and expected. |

Update the Status and Next step for each company in [08](08-Application-Tracker.md) and in Notion after every reply.
