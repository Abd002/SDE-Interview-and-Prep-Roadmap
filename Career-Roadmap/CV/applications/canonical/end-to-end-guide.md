# Canonical, from written interview to offer: the full plan

> Graduate Software Engineer, Open Source and Linux. Invited to the written interview on **17 Nov 2026** by Alex Cendejas (hiring lead). Written on 17 Nov 2026 from Canonical's own pages (hiring process, written-interview blog, careers FAQ), several candidates' public accounts, and a friend's written interview that passed this stage (he then failed the aptitude test). Every fact about you comes from [facts.md](../../facts.md).

## 0. The one rule that decides everything

Canonical says it twice: **"Plagiarism or the use of generated content, chatbots or AI will disqualify your application."** Their hiring page adds: *"use your own words … without use of online aids."* Two domain experts grade the document, every later interviewer reads it, and if you're hired it's shared with your team.

So this guide gives you **the facts and the structure**, never sentences to copy. You write every answer yourself. In the interviews they'll ask you to go deeper on what you wrote, so every line must be something you can talk about for five minutes.

---

## 1. The whole process (official, plus what candidates report)

| # | Stage | What it is | When (estimate) |
|---|---|---|---|
| 1 | Application review | Done. You passed | 31 Oct – 17 Nov |
| 2 | **Written interview** | Anonymous PDF answering every question. Graded by two domain experts | **Submit by 30 Nov** (14 days from 17 Nov) |
| 3 | **GIA aptitude test** (Thomas International) | 5 timed parts, 30–45 min total, online. **Everyone must do it.** This is where your friend failed | A few days after the written interview passes |
| 4 | Technical assessment (depends on the role) | Candidates report a 90-minute test with technical questions plus LeetCode-style problems, or a ~2-hour Python test | Shortly after the GIA |
| 5 | **3 early interviews** (about 1 hour each) | Future colleagues: software engineering and architecture, **Linux system skills**, and a domain deep-dive | ~2–4 weeks later |
| 6 | **Talent interview** + 10-minute **PPA** personality questionnaire | Talent Science team: motivations and career story (STAR questions); pay talk starts here | After the technical interviews |
| 7 | Late-stage interviews | Hiring lead, potential manager, senior people. Candidates report being questioned closely on their **school results** here | Near the end |
| 8 | Offer | From the hiring lead | Canonical says ~3 months on average from application |

**Things to know now:**
- **Sprints:** Canonical expects travel to in-person sprints **2–4 times a year (1–2 weeks each)**. Its FAQ says: *"If you have any restrictions on travel please … let us know as soon as possible."* Also know your start date (June 2027) before the talent interview.
- **Results:** you can download your GIA and PPA reports later from your candidate dashboard ("Request assessment report").
- **Limits:** you can apply to at most 4 different Canonical jobs in 180 days. Keep this in mind for the Next-Gen Silicon role ([../canonical-silicon/](../canonical-silicon/README.md)).

---

## 2. The written interview

### 2.1 What they're really scoring
From Canonical's hiring page: **high academic performance with evidence of initiative, leadership and drive**, **cognitive ability**, plus **drive, curiosity, resilience and stamina**. From the written-interview blog: depth of thinking, initiative, ownership, enthusiasm for open source, and how you communicate.

So every answer should show one of these: **results**, **initiative**, **depth**, **honesty**.

### 2.2 Format (from their FAQ)
- **Question-and-answer format** is easiest for them. Copy every question as a heading, in the same order, and answer under it.
- **Length is up to you.** Candidates report 15–21 pages. Your friend passed with about 9 pages, but his "Context" answers were one line each. Aim for **12–18 pages**: about 100–250 words per question, more for the personal project.
- **If you can't answer something,** say so honestly and say what you do know.
- **Anonymous:** no name, email, phone, photo, GitHub, LinkedIn or links to your profiles; not in the filename or in the PDF's Author field. Project names (COSMIC, OpenPrinting, Zephyr) are fine.
- **Submit** only through the link at the bottom of Alex's email, never by email.

### 2.3 The model for each answer
For **experience questions** (skill, projects, open source, languages, embedded):
1. **Direct answer** in the first sentence (say the level honestly: "comfortable", "intermediate", "beginner").
2. **Evidence:** a specific thing you did, with a number or a name (PR count, 40%, CRC, varlink, 6 networking modules).
3. **How you did it or what was hard:** one or two sentences of real detail. This is where depth shows.
4. **Reflection:** what you learned or what you'd do differently.

For **opinion questions** (open source, quality, Canonical's mission, winning, changes):
1. **Your position** in one sentence.
2. **Why**, with an example from your own work or something concrete you know about Canonical.
3. **One risk or trade-off**, which shows you think rather than praise.

For **education questions:** a **number + the scale + a reference point** ("119/120, where 120 is full marks; the national exam taken by everyone in the science track"). Your friend did this well, and it's the part Canonical cares about most.

### 2.4 Lessons from your friend's passed submission
**What worked (do the same):**
- Exact numbers with the grading system explained.
- An honest national rank with its source ("based on unofficial statistics published that year").
- Explaining why he went to Minia University: the regional admission rules.
- Honest "I don't have experience" where true.
- A personal project told with real difficulty and an honest "what I'd do differently".

**What was weak (do better):**
- The Context section was one line per answer. "I don't know" (winning commercially) and "I would not change anything" both waste a chance to show thinking.
- Generic motivation ("tech that's interesting and impactful") without naming products.
- A "how did your code perform" answer with no numbers.

**Your advantage over him:** you have far more embedded and Linux depth, real upstream work and an open-source project. **His advantage:** stronger school numbers. So your education section must be **exact and well argued**, and your technical sections must be **deep**.

### 2.5 Your facts for every question (write the sentences yourself)

#### Software engineering experience
| Question | Facts to use |
|---|---|
| A recent skill that mattered | Pick one. **(a)** Async Rust and Tokio: why (the Raft key-value store plan), what you learned (`select!`, cancellation, never holding a mutex across `.await`). **(b)** Database internals (CMU 15-445): BusTub Project 0 passes the autograder; you understand buffer pools and ARC. **(c)** Upstream C/Rust FFI work in Google Summer of Code |
| A new skill to learn | The Linux kernel properly (goal: your first mainline patch; you already wrote Kernel Monitor), or distributed systems (Raft, DDIA chapters 5, 6 and 9 already read). Say why it's timely and why you'd be good at it (the evidence) |
| Projects, operating systems, environments, languages, databases | **Projects:** COSMIC Printers page (Rust, 5 crates, varlink), cups-rs/libcups (11 merged PRs), EKSON (Zephyr firmware on ESP32-S3, PyQt5 app, Node.js/MongoDB backend, GitHub Actions), graduation bootloader (STM32, UDS, CRC), Kernel Monitor, IoT TCP on QEMU ARM, BusTub, Inventory (C#, SQL Server). **Operating systems:** CachyOS daily, Zephyr, FreeRTOS, Yocto/Buildroot images, QEMU. **Databases:** MongoDB, SQL Server, DuckDB, SQLite-style concepts from CMU |
| High-quality coder? | Honest level. Upstream review taught you most (Zephyr, OpenPrinting, Clippy). Your EKSON code was written without a senior reviewer, so you know where it's weaker. **How you judge quality:** tests, CI (fmt, Clippy, multi-architecture matrix), clear ownership and error paths (your libcups fixes were about cleanup when setup fails halfway), small reviewable changes |
| Open source | **Merged:** Zephyr (Mar 2025, `IP_MULTICAST_LOOP`, 6 modules), Boa and Clippy (Dec 2025), 11 OpenPrinting PRs (cups-rs and libcups). **In review:** cosmic-settings #2182 and cosmic-settings-daemon #188. **Maintainer:** you maintain your own cosmic-printers project; you're not a maintainer of a large upstream project, so say exactly that. **What matters:** what review taught you (small changes, explaining why, following the project's style, being patient) |
| Languages (Python, Go, C/C++, Rust, JS/TS, Bash) | **Rust:** strongest recent (Google Summer of Code, Clippy, Boa). **C:** libcups fixes, firmware, kernel module. **C++:** competitive programming (Codeforces Expert), BusTub. **Python:** PyQt5, asyncio (the 40% fix), pytest-qt. **Bash:** the idempotent dotfiles `install.sh`. **JavaScript:** the Node.js backend. **Go:** none, say so. **Testing:** cargo tests and CI against real CUPS/Avahi, pytest-qt end-to-end tests, the BusTub autograder plus clang-tidy, testing firmware on the hardware |
| Networking | Honest level (intermediate?). **Evidence:** the Zephyr socket option; TCP client-server with a bridge, TAP, dnsmasq and TFTP for QEMU; DNS-SD/mDNS in cups-rs and libcups; UART protocols; studied DNS, HTTP and routing |
| Relational data | SQL Server audit-log triggers using the session context (Inventory), DuckDB queries (CMU HW1), CMU lectures 1–2. Data-model design: small, say so. **"Unexpected":** pick something real from those projects |
| NoSQL | MongoDB at EKSON, Firebase Storage in the graduation project. **How to choose a store:** access pattern, consistency needs, scale, operations. You read DDIA chapters 5, 6 and 9, so you can talk about replication and partitioning trade-offs |
| Linux from the kernel up, packaging | Kernel Monitor (char device, `for_each_process` under RCU, `copy_to_user`), Yocto/Buildroot images and device trees (ODC), daily CachyOS, GitHub Actions building libcups3 from source. **Packaging:** be honest about how much (or little) you've done with .deb and PKGBUILD |
| Low-level embedded | Zephyr (devicetree, migration from FreeRTOS), PID control with an IMU, safety stop and watchdog, UART protocol; STM32 bootloader with UDS services and hardware CRC; FreeRTOS on Tiva C with run-time measurements; AUTOSAR MCAL drivers; two ATmega32 boards over UART |

#### Favourite personal project (pick one)
- **Option A, cosmic-printers** (open source; strongest technically). **Goal:** a Printers page for COSMIC. **Language:** Rust (the desktop is in Rust; safety; FFI to C). **Hardest:** C FFI and crash isolation, so the backend runs behind varlink in the settings daemon. **Performance:** live updates and responsiveness; only use numbers you actually measured. **Had to be perfect:** memory ownership across FFI, or never crashing Settings. **What you'd change:** your honest view.
- **Option B, Kernel Monitor** (fully personal). The facts file lists its known weak spots (missing `cdev_del`, `MKDEV`, the buffer limit, no lock, an operator-precedence bug). Choosing it means an honest "what I'd do differently" with **real bugs you found**, which reviewers like. **Fix the repo first.**

#### Education (the part Canonical weighs most)
| Question | Your facts | What you still need to find |
|---|---|---|
| Maths in your final school year | Thanaweya Amma maths **119/120** (pure + applied) | — |
| Home language | Arabic **79/80** | — |
| Final results and grading system | Thanaweya Amma total **?/410**: the national exam all Egyptian students take | **Your total and percentage** (your certificate) |
| Top 5% case | National-exam result (if your rank or percentile supports it), **4-time ECPC finalist 2021–2024** (national contest), **Codeforces Expert** | Any national rank or percentile with its source (say it's unofficial if it is); your **rank in your university year**, if your faculty publishes it |
| What kind of student, hobbies, what peers remember | Your own memories | — |
| University and why | Computer and Systems Engineering, Minia University, 2020–2025. Explain the regional admission rules only if they applied to you | Which others you considered |
| Degree result and grading | **84.6%, Very Good with Honors.** Scale: Excellent ≥85, Very Good 75–85, Good 65–75, Pass 50–65. Say it plainly: 0.4 points below Excellent | Rank in your year, if available |
| Exceptional achievements | 4 ECPC finals, Codeforces Expert, 100% in the ODC final evaluation, accepted into Google Summer of Code with The Linux Foundation | Any university prize or ranking |
| Leadership | **IEEE student branch Treasurer** (budget over $10k); taught C++ problem solving to **20+ people** in your ICPC community | What you decided or started, concretely |
| Social or community work | ICPC mentoring (volunteer teaching) | Any other real initiative or certificate |

**Gather the documents now:** your Thanaweya Amma certificate and your university transcript. Candidates report being asked about these numbers again in late interviews.

#### Context (why Canonical): think, don't praise
| Question | Things to think about (form your own view) |
|---|---|
| Mission, appeal, risks | Open source made usable and supported for enterprises, from cloud to IoT. **Risks to discuss:** community reactions to some decisions (Snap), competing with Red Hat/SUSE and free alternatives, and keeping the community while earning money |
| Winning commercially | Where support subscriptions make sense (Ubuntu Pro, long-term support); IoT and embedded devices (Ubuntu Core); silicon partners (the Next-Gen Silicon role shows this). Give one idea with a reason |
| Amplifying open source | Something concrete: upstream-first work (like your OpenPrinting experience), mentoring programs (you were a Google Summer of Code contributor), better documentation |
| Why Canonical | Your path fits: Linux printing stack upstream, embedded, open source remote work with mentors |
| Products | Pick 1–2 you can talk about: **Ubuntu Core / IoT** (your embedded work), **Ubuntu Desktop** (your COSMIC and printing work; Ubuntu ships CUPS), kernel and hardware enablement. Read each product page before you name it |
| What gives you satisfaction | Something real, like a merged upstream PR that many people use |
| What you'd change | One honest, constructive point |
| Most exciting about this role | Graduate track across the whole stack, from kernel to GUI, with mentoring |

### 2.6 Writing plan around your schedule
1. **Day 1 (2 hours):** copy all questions into a document. Under each one, paste the fact bullets from §2.5 that apply. This is your private outline; don't submit it.
2. **Days 2–4 (2–3 hours each):** write Education and Software experience in your own words.
3. **Day 5:** write the personal project and Context.
4. **Day 6:** read everything aloud. Cut buzzwords. Check every number against [facts.md](../../facts.md).
5. **Day 7:** check anonymity and the PDF's Author field, then upload by **30 Nov**. Screenshot the confirmation.

If your schedule makes 30 Nov impossible, email Alex **before** the deadline. The FAQ says to contact the hiring lead if you need more time.

**My role:** once you've written it, I can check facts and dates and point out unanswered questions. I won't rewrite sentences.

---

## 3. The GIA aptitude test (your friend's failure point)

### 3.1 What it is
- Thomas International's General Intelligence Assessment. **5 timed parts, 30–45 minutes in total**, online. Each part has practice questions first, which don't count.
- **Speed and accuracy count equally.** The result is a percentile against a norm group of about 16,000 people.
- **Why your friend failed:** the "English" part he failed was probably **Word Meaning**, the vocabulary section. It's part of the GIA, not a separate English exam.

| Part | What it looks like | How to train |
|---|---|---|
| **Reasoning** | Short statements: "Bob is not as fast as Carl. Who is faster?" Then the statement disappears and you answer | Read the sentence once, turn it into a quick picture ("Carl > Bob"). Watch for negatives ("not as", "less than") |
| **Perceptual Speed** | Pairs of letters, upper and lower case ("a B f H" over "k b j z"): count how many pairs are the same letter, ignoring case | Scan pair by pair from left to right, without going back. Pure speed: drill daily |
| **Number Speed & Accuracy** | Three numbers: which one is furthest from the middle value (highest or lowest)? | Find the middle number, compare the two gaps by quick subtraction |
| **Word Meaning** | Three words: two are related (same or opposite meaning), pick the odd one out | **English vocabulary.** Daily word lists of synonyms and antonyms; read English articles. Your biggest risk if English isn't your first language |
| **Spatial Visualisation** | Pairs of a letter ("R" or "F") rotated or mirrored: how many pairs are the same, rotated only (not mirrored)? | A mirrored R can never be rotated back to normal. Train on the rule, not by mentally spinning each one |

### 3.2 Where to practise
- **Free practice built by a candidate:** [gia.steciuk.dev](https://gia.steciuk.dev/en/), which a 2026 candidate recommended. It's unofficial, but the formats match the descriptions above.
- **Thomas's own example booklet:** search "Thomas GIA example booklet" on thomas.co.
- **Paid prep sites** (optional): Practice Aptitude Tests, TestHQ, Psychometric Success. All have GIA sections.

### 3.3 Practice plan (start today, 20–30 minutes a day; works on your 14-day duty blocks too)
- **Week 1:** learn each part's rule without a timer, until you make zero mistakes.
- **Week 2:** timed rounds. Do a full 5-part run every second day and write down your score per part.
- **Every day:** 15 minutes of English vocabulary (synonyms and antonyms), because Word Meaning is your weakest part.
- **On test day:** a quiet room, a laptop (not a phone), stable internet, a rested mind (not after a duty shift). Take it in one sitting. Read every instruction.
- **Don't start a part and stop:** they only resend the test for platform errors, not for problems with your device or connection.

---

## 4. The technical assessment (if they send one)
- **Reported formats:** a 90-minute mix of specific technical questions and LeetCode-style problems, or a ~2-hour Python test.
- **Preparation:**
  - Your competitive programming (Codeforces Expert) covers the algorithm part. Do 2–3 timed mediums a week in **Python and C++**, because Python is Canonical's first-listed language.
  - Revise the Python basics you'd need under time pressure: comprehensions, dicts and sets, `collections`, string handling, `pytest`.

---

## 5. The three technical interviews

Candidates describe them as friendly conversations, but the **Linux one is a fast stream of questions**. They will read your written interview, so be ready to go deep on everything you wrote.

### 5.1 Software engineering and architecture
- **Walk through your systems on a whiteboard:** the COSMIC printers architecture (5 crates, varlink, why process isolation) and the EKSON system (firmware ↔ UART ↔ app ↔ REST ↔ server). See [Interview Talking Guide §4](../../Interview-Talking-Guide.md#4-project-deep-dives).
- **Trade-offs:** polling vs push (WebSocket/MQTT), monolith vs services, testing strategy, CI design, error handling across FFI.
- **Your STAR stories** ([Talking Guide §3](../../Interview-Talking-Guide.md#3-your-stories-star)): the Zephyr migration, the 40% fix, the libcups crash fix, the CAN failure.

### 5.2 Linux system skills (prepare a checklist)
Expect rapid questions like *"permission denied when running a script: why and how to fix?"* or *"GPL vs Apache licence?"*. Revise:
- **Files and permissions:** `chmod`/`chown`, the exec bit, shebang, `umask`, setuid, `sudo`, ACLs, SELinux/AppArmor (Ubuntu uses AppArmor).
- **Processes:** `ps`, `top`, signals (`SIGTERM` vs `SIGKILL`), `nice`, zombies, `/proc`, `strace`, `lsof`, `gdb`.
- **Boot and services:** firmware/UEFI → bootloader (GRUB) → kernel → initramfs → systemd; `systemctl`, `journalctl`, unit files.
- **Storage:** filesystems, `mount`, `df`/`du`, inodes, links, ext4 journaling (your OS notes cover this).
- **Networking commands:** `ip`, `ss`, `ping`, `dig`, `curl`, ports, firewall basics (`ufw`), DNS resolution (your notes).
- **Packages:** `.deb`, `dpkg` vs `apt`, repositories, PPAs (Launchpad), snaps vs debs, how a Debian package is built (`debian/` directory, `control`, `rules`).
- **Kernel:** what a module is, `insmod`/`modprobe`/`lsmod`, `dmesg`, user vs kernel space, syscalls, device trees (you have real experience).
- **Licences:** GPL (copyleft) vs LGPL vs Apache 2.0 (permissive, patent grant) vs MIT.
- **Git:** your favourite commands; rebase vs merge; bisect (your Git notes).
- **Ubuntu itself:** LTS every two years in April with 5 years of standard support and more with Ubuntu Pro; interim releases every 6 months; Ubuntu Core for IoT; Launchpad. **Check each fact on ubuntu.com before the interview.**

### 5.3 The domain interview
It depends on the team they think fits you: embedded/IoT, kernel, desktop or foundations. Revise your deepest area (embedded and the Linux printing stack) and be ready to say which team you'd like and why.

---

## 6. Talent interview and PPA
- **PPA:** a 10-minute questionnaire. You pick the word **most** and **least** like you from groups of four (a DISC-style working-style profile). Answer honestly and quickly; there's no "right" profile to fake. One candidate was told Canonical likes people who take charge, so in the talent interview give examples of you **leading or deciding**: IEEE treasurer, Zephyr migration decision, owning the simulator software.
- **Talent interview:** STAR behavioural questions about motivations and career path. The interviewer types while you talk; **answer every question fully even if it's in your written interview.** One candidate who said "it's in my written interview" was marked down.
- **Pay:** discussion starts here. Prepare a number in USD and your start date.

---

## 7. Late stage
- **Who:** the hiring lead, your potential manager, maybe senior people.
- **What:** expect to defend your **education numbers** again ("prove you were in the top 5%"). Have your certificate numbers ready and be calm and exact.
- **Prepare:** 3 questions to ask each interviewer about the team, the first 6 months and how success is measured.

---

## 8. Calendar (from 17 Nov)
| When | What |
|---|---|
| 17–20 Nov | Collect certificate numbers. Build the private outline (§2.6, day 1). Start GIA drills: 20 min a day + 15 min vocabulary |
| 21–27 Nov (days off) | Write the written interview. Fix the Kernel Monitor bugs if you choose it as your project |
| by 30 Nov | Final check and upload. Screenshot the confirmation |
| Early Dec | GIA (keep drilling daily until the email arrives). Then the possible technical test |
| Dec – Jan | Linux checklist (§5.2), Python timed problems, STAR stories out loud, architecture drawings |
| Jan – Feb | Talent interview, late stage, offer (about 3 months in total) |

## Sources
- Canonical: [Hiring process](https://canonical.com/careers/hiring-process) · [Careers FAQ](https://canonical.com/careers/application/faq) · [Written interviews blog](https://canonical.com/blog/written-interviews)
- Candidates: [Sahra Vadrot, 2026](https://sahravadrot.com/articles/canonical-hiring-process) · [dustri.org](https://dustri.org/b/my-experience-with-canonicals-interview-process.html) · [Sara Sarafavi thread](https://notes.zachmanson.com/interviewing-for-canonical) · [Calibrd guide](https://www.calibrd.com/interview-prep/canonical-interview)
- GIA: [Psychometric Success](https://psychometric-success.com/aptitude-tests/test-types/thomas-gia-test) · [TestHQ](https://www.testhq.com/blog/thomas-international-gia) · [gia.steciuk.dev practice](https://gia.steciuk.dev/en/)
