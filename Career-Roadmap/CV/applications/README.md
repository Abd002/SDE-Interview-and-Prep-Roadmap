# Applications: one folder per company

Each folder has everything for one application:

- `README.md`: the role, why it fits, the hiring process and timeline, how to prepare, who to contact, and a checklist;
- `Abdelrahman-Khalifa-CV.pdf` (**send this one**), plus `.docx` and `.tex`;
- `jakes-template/`: the same facts in the original Jake's Resume template;
- `job-ad.md`: the ad text, saved in case the posting closes.

| Company | Role | Where | Folder |
|---|---|---|---|
| Canonical | Graduate Software Engineer, Open Source and Linux | Home based, worldwide | [canonical/](canonical/README.md) |
| Cloudflare | Systems Engineer, Network Protocols & Distributed Systems | London · Lisbon (hybrid) | [cloudflare/](cloudflare/README.md) |
| Igalia | JavaScript Engine Developer | Remote | [igalia/](igalia/README.md) |
| NXP | Junior Embedded Software Engineer, Secure IoT Firmware | Gratkorn, Austria | [nxp/](nxp/README.md) |
| Amazon | Software Development Engineer – 2027, AUTA | Dublin, Ireland | [amazon/](amazon/README.md) |
| Siemens DISW | Software Engineer, Graph Lakehouse (database engine, C++) | New Cairo | [siemens/](siemens/README.md) |
| Valeo | Junior Software Engineer, LIGHT (automotive embedded) | Cairo | [valeo/](valeo/README.md) |
| Collabora | Embedded Linux Consultant Engineer | Remote, anywhere | [collabora/](collabora/README.md) |
| MixRank | Junior Software Engineer — Remote, Egypt | Remote (Egypt) | [mixrank/](mixrank/README.md) |
| noon | Software Development Engineer 1 (Backend), CAKE program | Cairo | [noon/](noon/README.md) |
| Vodafone Egypt | Discover Graduate Program, IoT & Cloud 2027 | Egypt | [vodafone/](vodafone/README.md) |
| Hitachi Rail | Embedded Application Developer | Cairo | [hitachi-rail/](hitachi-rail/README.md) |
| Merck Group | Software Engineer II, Platform Engineering | Cairo | [merck/](merck/README.md) |
| CrimsonLogic | Junior System Engineer (Linux infrastructure) | Muscat, Oman | [crimsonlogic/](crimsonlogic/README.md) |
| Mercor (side income) | Open Source Maintainer / Core Contributor – Software Engineer | Remote | [mercor/](mercor/README.md) |
| Valeo (2nd) | Graduate In Training Program (GIT), Embedded Software | Cairo | [valeo-git/](valeo-git/README.md) |
| Valeo (3rd) | Junior Software Engineer, BRAIN | Cairo | [valeo-brain/](valeo-brain/README.md) |
| Igalia (2nd) | Multimedia Developer | Remote | [igalia-multimedia/](igalia-multimedia/README.md) |
| Valeo | Software Engineer, POWER | Cairo | [valeo-power-sw/](valeo-power-sw/README.md) |
| Valeo | Software Engineer - Integrator, POWER | Cairo | [valeo-power-integrator/](valeo-power-integrator/README.md) |
| Hitachi Rail | Software Validation & Test Engineer | Cairo | [hitachi-rail-validation/](hitachi-rail-validation/README.md) |
| KPEK | Embedded System and IoT Engineer | Maadi | [kpek/](kpek/README.md) |
| Siemens EDA | Software Development Engineer (6 openings) | New Cairo | [siemens-eda/](siemens-eda/README.md) |
| eInfochips (Arrow) | Embedded Engineer / Senior | Maadi | [einfochips/](einfochips/README.md) |
| Valeo | Software Engineer - Test Automation, POWER | Cairo | [valeo-power-test-automation/](valeo-power-test-automation/README.md) |
| Schneider Electric | Systems Engineer (Junior Application Engineer) | New Heliopolis | [schneider-electric/](schneider-electric/README.md) |
| Canonical | Linux Software Engineer - Ubuntu for Next-Gen Silicon | Remote | [canonical-silicon/](canonical-silicon/README.md) |
| Zylo3D | Senior Embedded C++ / Qt Engineer | Heliopolis | [zylo3d/](zylo3d/README.md) |

- **Sent CVs are frozen:** the copies for Canonical, Cloudflare, Igalia and NXP stay exactly as sent. The base CVs and the unsent copies were updated on 2 Nov 2026 after a check of every GitHub repo (see [facts.md](../facts.md#github-check-of-every-own-repo-2-nov-2026)).
- **What the five share** (timeline overview, mentors, message templates, follow-up rules): [09 — Hiring Process and Outreach](../../09-Hiring-Process-and-Outreach.md).
- **Status of every application:** [08 — Application Tracker](../../08-Application-Tracker.md#current-shortlist-study-plan-step-29-checked-18-oct-2026).

## Adding a new company
1. Make a folder `applications/<company>/`.
2. Copy the closest base CV (`../cv-systems-rust.tex`, `../cv-embedded.tex` or `../cv-general-swe.tex`) into it as `Abdelrahman-Khalifa-CV.tex`, and tailor the title, summary and skills using only [facts.md](../facts.md).
3. Build it: `TEXINPUTS=../..: pdflatex Abdelrahman-Khalifa-CV.tex` (twice). For Word: `python3 ../../tex2docx.py Abdelrahman-Khalifa-CV.tex`.
4. For the Jake's version, add a line to [../tools/build_jake_cvs.sh](../tools/build_jake_cvs.sh) and run it.
5. Write `README.md` and `job-ad.md` like the other folders.
