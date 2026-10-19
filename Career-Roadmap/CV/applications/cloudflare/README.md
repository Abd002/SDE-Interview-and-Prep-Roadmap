# Cloudflare: everything for this application

> Part of the [current shortlist](../../../08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026). Overview of all five, shared outreach templates and follow-up rules: [09 — Hiring Process and Outreach](../../../09-Hiring-Process-and-Outreach.md). Checked on 19 Oct 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Systems Engineer, Network Protocols & Distributed Systems](https://boards.greenhouse.io/cloudflare/jobs/8187404) |
| **Where** | London · Lisbon (hybrid) |
| **Why it fits** | Migrating NGINX to a Rust proxy; asks for "solid systems programming experience (Rust, C, or similar)"; no years required |
| **Status** | Preparing (update here, in [08](../../../08-Application-Tracker.md) and in the [Notion row](https://app.notion.com/p/3f7f38194b418166b18fc6bfaefdfd77)) |
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

**What the tailored CV changes for this ad:** Title "Rust, C, Networking, Linux"; summary leads with the protocol work (IPP over HTTP, DNS-SD, the Zephyr IPv4 multicast option); new Networking skills line. Ad keywords matched: **6 of 13 (base: 5)**.

## 3. Hiring process, timeline and how to prepare

| Company | Stages | First reply | Total time | Hardest part for you |
|---|---|---|---|---|
| **Cloudflare** | Recruiter call → hiring manager → coding screen → 3–5 round loop | 1–4 weeks, often silent if rejected | **3–6 weeks** once it starts (reports); some took 2 months | Coding plus networking depth, possibly in Rust or Go |

#### The process
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

#### How to do well
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

## 4. People to contact

**Start with people who already know your work** (your Google Summer of Code mentors):

| Person | Connection | What to ask for | Helps with |
|---|---|---|---|
| **Till Kamppeter** | OpenPrinting leader, your GSoC mentor. He was Canonical's printing maintainer for years ([LWN, 2025](https://lwn.net/Articles/1031701): Canonical laid him off in 2025, and he now runs OpenPrinting with The Linux Foundation) | A LinkedIn recommendation; introductions to Ubuntu desktop or printing engineers he still knows at Canonical; his view on which Canonical team fits you | Canonical (introduction, not an internal referral), credibility everywhere |
| **Michael Murphy** | System76 (COSMIC), GSoC mentor and reviewer of your COSMIC PRs | Merge or review status of #2182 and #188; a recommendation; System76 openings | System76, plus Canonical and Igalia as proof |
| **Mintu Gogoi** and **Titiksha Bansal** | GSoC mentors | A LinkedIn recommendation; whether they know people at the five companies | All |

**People at Cloudflare** (open the searches while logged in to LinkedIn; pick 2–3 people):

| Company | Who to look for | LinkedIn search |
|---|---|---|
| Cloudflare | Systems engineers in London or Lisbon working on the proxy (FL2, Oxy, Pingora); early-talent recruiters | [Cloudflare systems engineer Lisbon](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20systems%20engineer%20Lisbon) · [Cloudflare Rust proxy](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20Rust%20proxy%20engineer) · [Cloudflare early talent recruiter](https://www.linkedin.com/search/results/people/?keywords=Cloudflare%20early%20talent%20recruiter) |

**What to ask and the message templates:** [09 §4](../../../09-Hiring-Process-and-Outreach.md#4-what-to-ask-and-message-templates). **Follow-up rules:** [09 §5](../../../09-Hiring-Process-and-Outreach.md#5-follow-up-rules). Log each contact in the Notion row (Contacts, Referral status).

## 5. Checklist

- [ ] Re-open the job link and check it is still open.
- [ ] Message 1–2 people from §4 (mentors first) **before** applying.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf); check every auto-filled form field.
- [ ] Fill in **Applied on** above, in 08 and in Notion; set Status to Applied.
- [ ] Prepare with §3 while you wait.
- [ ] Follow up once if there is no reply (see 09 §5).
