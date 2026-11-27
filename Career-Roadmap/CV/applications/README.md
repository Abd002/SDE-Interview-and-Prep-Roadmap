# Applications: one folder per company, one subfolder per role

Each company has its own folder, and each role you applied to (or prepared) has a subfolder inside it, for example `canonical/graduate-software-engineer/` and `canonical/next-gen-silicon/`.

Every role folder has:

- `Abdelrahman-Khalifa-CV.pdf`: **send this one**. A tailored one-page CV;
- `Abdelrahman-Khalifa-CV.tex`: its LaTeX source (build: `pdflatex Abdelrahman-Khalifa-CV.tex`, run twice);
- `README.md`: the role, why it fits, the gap, the hiring process, status and a checklist;
- `job-ad.md`: the ad text, saved in case the posting closes;
- sometimes `application-form.md` (answers ready to paste), a cover letter or an interview guide.

Every fact comes from [../facts.md](../facts.md).

## New role

1. Create `<company>/<role>/`.
2. Copy the closest base CV from [..](../README.md) (`cv-systems-rust.tex`, `cv-embedded.tex` or `cv-general-swe.tex`) to `Abdelrahman-Khalifa-CV.tex`, and change the title line, summary, skills and projects for the ad. Use only facts from facts.md.
3. Build it twice and check it is still 1 page: `pdfinfo Abdelrahman-Khalifa-CV.pdf | grep Pages`.
4. Save the ad in `job-ad.md`, write the README, and add a row to [08](../../08-Application-Tracker.md) and Notion.

## All roles

| Company | Role | Folder | Status |
|---|---|---|---|
| Alignerr | Back End Developer (AI Infrastructure) | [alignerr/backend-developer/](alignerr/backend-developer/README.md) | **Ready, not sent** |
| Amazon | Software Development Engineer – 2027, AUTA | [amazon/sde-2027/](amazon/sde-2027/README.md) | Preparing |
| Analog Devices | FY27 Software Engineering Graduate Opportunities | [analog-devices/fy27-software-engineering-graduate/](analog-devices/fy27-software-engineering-graduate/README.md) | **Applied 25 Nov 2026** in Workday |
| Applied Intuition | Founding Software Integration Engineer, Middle East | [applied-intuition/software-integration-engineer-middle-east/](applied-intuition/software-integration-engineer-middle-east/README.md) | **Applied 26 Nov 2026** |
| BairesDev | Rust Engineer - Remote Work, REF#290362 | [bairesdev/rust-engineer/](bairesdev/rust-engineer/README.md) | **Applied 25 Nov 2026** via LinkedIn |
| Bending Spoons | Graduate Software Engineer | [bending-spoons/graduate-software-engineer/](bending-spoons/graduate-software-engineer/README.md) | **Applied 25 Nov 2026** on jobs.bendingspoons.com |
| Canonical | Graduate Software Engineer, Open Source and Linux | [canonical/graduate-software-engineer/](canonical/graduate-software-engineer/README.md) | **Written interview submitted 22 Nov 2026** (invited 16 Nov by Alex Cendejas, the hiring l… |
|  | Linux Software Engineer - Ubuntu for Next-Gen Silicon (multiple roles and seniority levels) | [canonical/next-gen-silicon/](canonical/next-gen-silicon/README.md) | **On hold** until the Graduate role is answered |
| Cloudflare | Systems Engineer - Network Data Plane Software | [cloudflare/network-data-plane/](cloudflare/network-data-plane/README.md) | **Applied 25 Nov 2026** in Greenhouse (Systems Engineer, Network Data Plane Software, job … |
|  | Systems Engineer, Network Protocols & Distributed Systems | [cloudflare/network-protocols/](cloudflare/network-protocols/README.md) | **Applied** |
| Collabora | Embedded Linux Consultant Engineer (Remote/Anywhere) | [collabora/embedded-linux-consultant/](collabora/embedded-linux-consultant/README.md) | **Applied** |
| CrimsonLogic | Junior System Engineer | [crimsonlogic/junior-system-engineer/](crimsonlogic/junior-system-engineer/README.md) | **Rejected by 14 Nov 2026** (LinkedIn update, no reason given) |
| DXC Technology | Junior Backend Java Microservices Developer, Fresh Graduates | [dxc/junior-backend-java-microservices/](dxc/junior-backend-java-microservices/README.md) | **Ready, not sent** |
| eInfochips (Arrow) | Senior Embedded Engineer | [einfochips/embedded-engineer/](einfochips/embedded-engineer/README.md) | **Rejected 27 Nov 2026** (applied 23 Nov) |
| Geotab | Software Developer (Dubai) | [geotab/software-developer-dubai/](geotab/software-developer-dubai/README.md) | **Ready, not sent** |
| Hitachi Rail | Embedded Application Developer | [hitachi-rail/embedded-application-developer/](hitachi-rail/embedded-application-developer/README.md) | **Applied** |
|  | Software Validation & Test Engineer | [hitachi-rail/software-validation-test/](hitachi-rail/software-validation-test/README.md) | **Applied 23 Nov 2026** in Workday (salary given: EGP 25,000 net/month, inside the 20–30k … |
| Igalia | JavaScript Engine Developer | [igalia/javascript-engine/](igalia/javascript-engine/README.md) | **Rejected 7 Nov 2026.** Asumu Takikawa (Web Languages team): "We appreciated that you hav… |
|  | Multimedia Developer | [igalia/multimedia/](igalia/multimedia/README.md) | **Applied 23 Nov 2026** through igalia.com |
| IMC | Graduate Software Engineer (2027) | [imc/graduate-software-engineer-2027/](imc/graduate-software-engineer-2027/README.md) | **Applied 26 Nov 2026** on Greenhouse |
| KPEK | Embedded System and IoT Engineer | [kpek/embedded-iot-engineer/](kpek/embedded-iot-engineer/README.md) | **Applied 23 Nov 2026** through the form on kpekiot.com/career |
| Merck Group | Software Engineer II (Expert 2), Platform Engineering | [merck/software-engineer-ii-platform/](merck/software-engineer-ii-platform/README.md) | Not started |
| Mercor | Open Source Maintainer / Core Contributor – Software Engineer | [mercor/open-source-maintainer/](mercor/open-source-maintainer/README.md) | **Rejected 19 Nov 2026** (automated email, no reason; both Mercor roles). Applied 5 Nov 20… |
| MixRank | Junior Software Engineer — Remote, Egypt | [mixrank/junior-software-engineer/](mixrank/junior-software-engineer/README.md) | **Applied** |
| noon | Software Development Engineer 1 (Backend) | [noon/sde1-backend/](noon/sde1-backend/README.md) | Not started |
| NXP | Junior Embedded Software Engineer, Secure IoT Firmware | [nxp/junior-embedded-secure-iot/](nxp/junior-embedded-secure-iot/README.md) | **Rejected** on 2 Nov 2026 |
| Rerun | Software Engineer (Rust) | [rerun/software-engineer-rust/](rerun/software-engineer-rust/README.md) | **Applied 25 Nov 2026** through Ashby (cover answers from application-form.md) |
| Revolut | Graduate Programme 2027: Software Engineer (Java) | [revolut/graduate-programme-2027-software-engineer-java/](revolut/graduate-programme-2027-software-engineer-java/README.md) | **Applied 26 Nov 2026** |
| Schneider Electric | Systems Engineer | [schneider-electric/systems-engineer/](schneider-electric/systems-engineer/README.md) | **Applied 23 Nov 2026** via LinkedIn |
| Sentry | Software Engineer, New Grad (2027) | [sentry/software-engineer-new-grad-2027/](sentry/software-engineer-new-grad-2027/README.md) | **Applied 25 Nov 2026** through Ashby |
| Siemens | Software Development Engineer | [siemens/eda-software-developer/](siemens/eda-software-developer/README.md) | **Ready, not sent** |
|  | Software Engineer, Graph Lakehouse | [siemens/graph-lakehouse/](siemens/graph-lakehouse/README.md) | Not started |
| talabat | Software Engineer I, Backend (DMarts Network Management) | [talabat/software-engineer-1-backend/](talabat/software-engineer-1-backend/README.md) | **Applied 26 Nov 2026** |
| Valeo | Junior Software Engineer, BRAIN | [valeo/brain-junior-software-engineer/](valeo/brain-junior-software-engineer/README.md) | **Closed** (23 Nov 2026) |
|  | Graduate In Training Program (GIT), Embedded Software | [valeo/git-embedded-software/](valeo/git-embedded-software/README.md) | **Applied 23 Nov 2026** in Workday |
|  | Junior Software Engineer, LIGHT | [valeo/light-junior-software-engineer/](valeo/light-junior-software-engineer/README.md) | **Rejected 13 Nov 2026** (Workday email, no reason given) |
|  | Software Engineer - Integrator, POWER | [valeo/power-integrator/](valeo/power-integrator/README.md) | **Applied 23 Nov 2026** in Workday |
|  | Software Engineer, POWER | [valeo/power-software-engineer/](valeo/power-software-engineer/README.md) | **Applied 23 Nov 2026** in Workday (Software Engineer, POWER) |
|  | Software Engineer - Test Automation, POWER | [valeo/power-test-automation/](valeo/power-test-automation/README.md) | **Ready, not sent** |
| Vodafone Egypt | Discover Graduate Program, IoT & Cloud Solutions 2027 | [vodafone/discover-graduate-iot-cloud/](vodafone/discover-graduate-iot-cloud/README.md) | **Invited to the SOVA assessment** (13 Nov 2026): numerical test + recorded competency int… |
| Zylo3D | Senior Embedded C++ / Qt Engineer | [zylo3d/senior-embedded-cpp-qt/](zylo3d/senior-embedded-cpp-qt/README.md) | **Ready, not sent** |
