# Mercor: everything for this application

> Side income, in parallel with the job search ([08 §C2](../../../08-Application-Tracker.md#c2-side-income-contract-and-ai-training-work)). Checked on 5 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Open Source Maintainer / Core Contributor – Software Engineer](https://work.mercor.com/explore?listingId=list_AAABoZ5Af5H0GMoyXaBBDKW2) (found through aitrainer.work, listed 5 Nov 2026) |
| **Where** | Remote. You're engaged through **Cincinnatus LLC** (employer of record) and placed with an AI lab |
| **Pay** | USD 150/hr as listed (confirm on Mercor's page; it can change and can depend on country) |
| **Hours** | 30–40 a week, mostly async (evenings and weekends are fine) plus some meetings |
| **The work** | Write realistic tasks (features, refactors, bug fixes) from the open-source repo you know best, with reference solutions; review AI-written code, tests and rubrics; build and run the project locally, including with Docker; write the reasoning in your own words |
| **Process** | Mercor profile + CV upload → AI interview → one-time Persona ID check → wait for a client match. Typical wait to hear back: about 3–4 weeks. Pay goes out weekly via Stripe or Wise |
| **Status** | **Applied 5 Nov 2026** (Mercor dashboard: Explore → Applications). The form called it "Remote US, W2"; you answered "based in Egypt", so it may be US-only |

## 2. Do you meet the bar? Honestly: almost

The ad asks for **3+ substantive merged PRs in the last 12 months** in one widely used repo that is **2+ years old**, with real users and real code review. Checked against the git history on 5 Nov 2026:

| Repo | Age | Your merged PRs since 5 Nov 2025 | Meets it? |
|---|---|---|---|
| **libcups** (OpenPrinting, C) | Since 2006, 98 authors, the CUPS library | 2 (#164, #165) | **One short** |
| **cups-rs** (OpenPrinting, Rust) | Since Apr 2025 (1 yr 7 months) | 9 (#8, #9, #16, #18–#23) | Enough PRs, but the repo is under 2 years old |
| Rust Clippy | Old, very widely used | 1 (#16214) | No |
| Boa | Old, widely used | 1 (#4553) | No |

**What this means:**
- **Apply anyway.** Name **libcups / CUPS** as the codebase you know best, and present cups-rs (its Rust bindings) as part of the same project. Don't claim you are a maintainer or that you review others' PRs; you're a **core contributor**.
- **The fastest way to qualify cleanly:** get **one more libcups PR merged**. A third libcups PR puts you over the bar on a 20-year-old, widely used repo.
- "Years of sustained contributions": yours run from Mar 2025 (Zephyr) to now, about 20 months. Say it as it is.

## 3. Things to know before you take it

- **Exclusivity:** no other AI lab or AI training company during the engagement, **including other Mercor projects**. That includes **micro1** (you applied as a Photo Contributor on 5 Nov). If both come through, you have to choose one.
- **Not alongside a full-time job.** EKSON part-time is fine, but if a full-time offer comes you'd have to choose. 30–40 hours a week will also slow the study plan.
- **Docker:** the ad wants you to build and test the project with Docker. It isn't in your facts, so it isn't on the CV. Before the interview, write a Dockerfile that builds libcups and runs its tests (you already have the steps in cosmic-printers `ci/ci-setup.sh`). Then you can honestly say you've done it.
- **Background check, NDA, company-provided device:** normal for this kind of role.
- **Scam check:** applying to Mercor is free. If anyone asks you to pay, stop.

## 4. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad as it was on 5 Nov 2026 |

**What the tailored CV changes** (from [cv-systems-rust](../../cv-systems-rust.tex)): the title is "Open-Source Software Engineer". The summary leads with **14 merged upstream PRs since March 2025** (11 OpenPrinting + Clippy + Boa + Zephyr), names libcups and cups-rs, and says every change went through maintainer review. Code review, testing and multi-architecture CI come first in Tooling. Nothing new is claimed (no Docker, no maintainer role).

## 5. The AI interview: what to have ready

- **The codebase you know best:** libcups / CUPS 3 and cups-rs. Explain how a print job goes through IPP, what DNS-SD does for printer discovery, and why you ported cups-rs to libcups3.
- **Your two libcups fixes:** what crashed in `cupsDNSSDDelete()` when Avahi failed to start, and where the client leaked.
- **A task you'd assign** in that repo: for example "add an IPP operation to cups-rs with tests", plus what a good solution looks like.
- **Code review judgment:** how you'd review an AI-written patch: does it build, does it follow the repo's style, are there tests, what are the edge cases (NULL, error paths, memory ownership across FFI)?
- Answer in your own words. The ad says rationales must be written personally.

## 6. Checklist

- [x] Make the Mercor profile and upload the PDF above (5 Nov 2026)
- [ ] Link LinkedIn on the Mercor dashboard (it says this boosts matching)
- [ ] Do the AI interview (quiet room, camera on)
- [ ] Persona ID check
- [ ] Try to land a third libcups PR
- [ ] Dockerfile that builds libcups and runs its tests
