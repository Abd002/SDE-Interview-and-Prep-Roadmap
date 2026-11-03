# Collabora application form: Embedded Linux Consultant Engineer (Remote/Anywhere)

Prepared 3 Nov 2026 from [facts.md](../../facts.md). The form doesn't forbid help with writing, but **read every answer and change anything that doesn't sound like you.** They will ask about each point in the interviews.

## Basic fields

| Field | What to enter |
|---|---|
| Resume/CV | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) (the Collabora copy) |
| Full name | Abdelrahman Khalifa |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone | +20 114 250 5042 |
| Current location | Cairo, Egypt |
| Current company | EKSON Technology |
| LinkedIn URL | https://www.linkedin.com/in/abd002 |
| Twitter URL | leave empty |
| GitHub URL | https://github.com/Abd002 |
| Portfolio URL | https://github.com/Abd002/GSOC-2026 |
| Other website | https://codeforces.com/profile/_Khalifa |
| Future opportunities (6 months) | Tick it |

## Please tell us of your interest in Collabora

> I want to work where the job is to make Linux work on real hardware and send the fixes upstream, and that is how Collabora works. My path has been heading here: I built Yocto and Buildroot images and wrote a kernel module for ARM during my Orange Digital Center internship, I write Zephyr firmware for motion simulators at EKSON, and as a Google Summer of Code 2026 contributor with The Linux Foundation (OpenPrinting) I spent six months working upstream in C and Rust on the Linux printing stack, with 11 PRs merged in cups-rs and libcups.
>
> What I liked most in that work was the upstream part: finding a crash in libcups, fixing it in the right place, and getting it through review instead of working around it in my own code. Collabora's "upstream first" approach, and the mix of customer problems with open-source contributions, is the kind of work I want to grow in. I'm also interested in where Rust is going in embedded Linux, and Collabora is one of the places doing that work in the open.

## Describe any technical leadership experience you have, formal or informal

> - **Driving a technical decision (Google Summer of Code 2026):** I designed the architecture of the COSMIC Printers page. The Rust code calls libcups through FFI, and a crash in native code would take down the whole Settings app, so I proposed running the backend as a separate varlink service inside cosmic-settings-daemon. I discussed the design with my mentors from OpenPrinting and System76, and split the project into 5 crates so the Settings page and a standalone app share the same UI and client.
> - **Representing the work upstream:** I ported cups-rs to libcups3, which meant agreeing on API changes with the maintainers, and I added a CI matrix across architectures and CUPS 2 and 3. When I found crashes in libcups' Avahi DNS-SD code, I reported and fixed them upstream (libcups #164, #165) rather than patching around them. I still maintain the project after the program ended.
> - **Ownership:** at EKSON I own the software for the simulator product end to end: firmware, desktop app, backend and CI. I chose to migrate the firmware from ESP-IDF/FreeRTOS to Zephyr for more deterministic timing and portable, devicetree-based drivers.
> - **Mentoring:** I mentor in my local ICPC community and have taught problem solving in C++ to more than 20 colleagues. At university I was Treasurer of the IEEE Student Branch, managing a budget of more than $10k.

## Please tell us about your Open Source contributions and provide links

> - **OpenPrinting (The Linux Foundation), 2026:** 11 PRs merged.
>   - cups-rs (Rust bindings for CUPS, 9 PRs): port to libcups3, CI across architectures and CUPS versions, IPP management operations, Printer Application support, DNS-SD FFI bindings, lpoptions. https://github.com/OpenPrinting/cups-rs/pulls?q=is:pr+author:Abd002+is:merged
>   - libcups (C): fixed crashes in cupsDNSSDDelete() when Avahi fails to initialize, and a leaked client in the Avahi code. https://github.com/OpenPrinting/libcups/pull/164 and https://github.com/OpenPrinting/libcups/pull/165
> - **COSMIC desktop (System76), in review:** the Printers page for COSMIC Settings (https://github.com/pop-os/cosmic-settings/pull/2182) and its varlink backend service (https://github.com/pop-os/cosmic-settings-daemon/pull/188). Code: https://github.com/Abd002/cosmic-printers, report: https://github.com/Abd002/GSOC-2026
> - **Zephyr RTOS, 2025:** implemented the IP_MULTICAST_LOOP socket option for IPv4 across the networking stack, merged. https://github.com/zephyrproject-rtos/zephyr/pull/87167
> - **Boa (JavaScript engine in Rust), 2025:** fast path for Latin1 strings in JsStr::code_points(), merged. https://github.com/boa-dev/boa/pull/4553
> - **Rust Clippy, 2025:** fixed ref_as_ptr false positives for non-temporary references, merged. https://github.com/rust-lang/rust-clippy/pull/16214
> - **My own:** a Linux kernel character-device driver for ARM, tested on QEMU: https://github.com/Abd002/kernel-monitor

## Can you describe your experience in a consultancy environment?

**Be honest here; you haven't worked in a consultancy.** Suggested answer:

> I haven't worked in a consultancy yet, but most of my work has had the same shape: someone else's codebase, someone else's priorities, and me in the middle. During Google Summer of Code 2026 I worked remotely with two organizations at once, OpenPrinting (who maintain CUPS and libcups) and System76 (who own COSMIC), whose needs didn't always match. I had to explain trade-offs in writing, get agreement on API changes before writing code, and deliver in reviewable steps. At EKSON I own the simulator product's software and work with the people who use the simulators, turning what they need into firmware, app and backend changes. I'm used to asynchronous, written communication across time zones and to being accountable for a result rather than a task list. The consulting skills I want to grow at Collabora are scoping projects and managing customer expectations.

> **Check before sending:** the sentence "work with the people who use the simulators" must be true for you. If you don't deal with EKSON's customers or operators, delete it.

## Describe a situation where a customer had a critical production issue

**Use a real story.** You haven't handled a paying customer's outage, so say so in one line, then tell the closest real one. The libcups crash is real and documented in your PRs:

> I haven't yet handled a paying customer's production outage, so here is the closest real case.
>
> While building the COSMIC Printers page, I found that libcups could crash inside cupsDNSSDDelete() when Avahi (the mDNS/DNS-SD daemon) failed to initialize, and that the same Avahi code leaked a client. My Rust code calls libcups through FFI, so a crash there would have taken the whole Settings app down with it, which is the worst kind of bug in a desktop.
>
> **Technical side:** I reproduced the failure, traced it into libcups' Avahi DNS-SD code and fixed both problems upstream in C (libcups #164 and #165, both merged), rather than hiding the crash in my bindings. I also changed the architecture so this class of bug can't hurt users again: the whole CUPS/libcups backend now runs as a separate varlink service in cosmic-settings-daemon, so if native code crashes, the Settings app stays up.
>
> **The people side:** I kept my mentors from OpenPrinting and System76 informed about the impact, the cause and my plan, and gave the libcups maintainers a clear explanation of the bug with the fix. The lesson I took: say what you know and what you don't as soon as possible, fix the root cause where it lives, and add a safeguard so the same kind of failure is contained next time.

> **Check before sending:** edit the details to match exactly what happened. How did you find the crash? How did you reproduce it (for example by stopping avahi-daemon)? What did you tell your mentors, and when? An interviewer will ask you to go deeper, so every sentence must be something you can expand on. Delete anything that isn't true.

## Remuneration ball-park

Collabora pays by country, and the form rejects answers without a number and a currency. Reference points from [04 — Remote from Egypt](../../../04-Remote-From-Egypt.md):
- Microsoft Egypt pays about EGP 1M/yr (about USD 20k).
- Remote developers in Egypt average about USD 47k/yr (Arc.dev, 2026).

Suggested answer for a junior–mid embedded Linux engineer based in Cairo:

> USD 36,000–45,000 gross per year, as an employee or contractor, working remotely from Cairo, Egypt. I'm flexible depending on the overall package and the level you see me at.

**This is your decision.** Go lower (for example USD 30,000–40,000) if you'd rather not risk being filtered out on cost. Don't go below what you'd accept, because Collabora treats this as a guideline.
