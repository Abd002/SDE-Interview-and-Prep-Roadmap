# Merck Group: everything for this application

> Part of [08: More roles, no relocation risk](../../../08-Application-Tracker.md#more-roles-no-relocation-risk-found-3-nov-2026). Checked on 3 Nov 2026.

## 1. The role

| | |
|---|---|
| **Role** | [Software Engineer II (Expert 2), Platform Engineering](https://www.linkedin.com/jobs/view/4475543187) (posted 26 Oct 2026, open on 3 Nov 2026) |
| **Where** | Cairo. No visa or relocation. |
| **Level** | Associate; the ad asks for **2–5 years**. You have about 15 months at EKSON plus 6 months of Google Summer of Code, so this is a **stretch**. Apply anyway; the rest of the profile fits well. |
| **What the team does** | Internal platform for Merck's engineers: developer tools, self-service automation, CI/CD pipelines, APIs and integrations |
| **Must have** | Python (or another general-purpose language) in production, Git, automated testing, code review, APIs, debugging, CI/CD, clear English |
| **Valuable** | SQL and data pipelines (Snowflake, dbt, Airflow), AWS and infrastructure as code, Docker/Kubernetes, internal developer platforms, AI/LLM knowledge |
| **Status** | Not started |
| **Applied on** | — |

## 2. Files

| File | What it is |
|---|---|
| [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) | **Send this one.** Tailored CV, 1 page |
| [Abdelrahman-Khalifa-CV.docx](Abdelrahman-Khalifa-CV.docx) | Word copy |
| [Abdelrahman-Khalifa-CV.tex](Abdelrahman-Khalifa-CV.tex) | LaTeX source |
| [jakes-template/Abdelrahman-Khalifa-CV.pdf](jakes-template/Abdelrahman-Khalifa-CV.pdf) | Same facts in the Jake's Resume template |
| [job-ad.md](job-ad.md) | The ad as it was on 3 Nov 2026 |

## 3. How each of your projects maps to the ad

| The ad asks for | What the CV shows (all checked in your repos) |
|---|---|
| CI/CD pipelines | cosmic-printers CI: GitHub Actions on **x86_64 and aarch64**, builds libcups3 from source, starts real CUPS and Avahi services, runs Clippy and tests; the cups-rs CI matrix across architectures and CUPS 2/3 (PR #23) |
| Automation, self-service, developer tools | **dotfiles `install.sh`**: idempotent Bash setup of a full dev environment, with backups and skip flags; firmware delivery at EKSON (upload in a web app, the desktop app downloads and flashes it) |
| APIs and services | EKSON's Node.js/Express + MongoDB REST API; the varlink service API between the COSMIC UI and backend |
| Python | EKSON's asyncio desktop app (40% CPU/latency cut); Function Solver with pytest-qt end-to-end tests |
| SQL and data | CMU 15-445: SQL analytics in DuckDB; SQL Server audit triggers in the Inventory system |
| Code review, stakeholders | 11 PRs through maintainer review; design agreed with mentors from two organizations |

**Not claimed, because you haven't used them:** Docker, Kubernetes, AWS, infrastructure as code, Snowflake, dbt, Airflow. If you use AI coding tools in your daily work, you may say so in the interview, since the ad mentions it.

## 4. Checklist

- [ ] Re-open the posting and check it is still open.
- [ ] Optional, in a weekend: containerise one project with Docker and add it to its CI, so you can honestly mention Docker.
- [ ] Apply with [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf).
- [ ] Fill in **Applied on** above, in 08 and in Notion.
- [ ] Follow up once after 3 weeks with no reply.
