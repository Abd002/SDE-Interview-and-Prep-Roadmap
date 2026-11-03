# Collabora application form: Embedded Linux Consultant Engineer (Remote/Anywhere)

Prepared 3 Nov 2026 from [facts.md](../../facts.md); rewritten the same day in a plainer, first-person voice. The form doesn't forbid help with writing, but **read every answer and change anything that doesn't sound like you.** They will ask about each point in the interviews.

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

## Your final answers (submitted 3 Nov 2026, exactly as below)

Saved exactly as you wrote them, so your interview answers can match. The drafts further down are kept only for reference.

**Interest in Collabora**
> I've been moving toward embedded Linux for a while. In my internship at Orange Digital Center I built Yocto and Buildroot images and wrote a kernel module for ARM, and at EKSON I write the Zephyr firmware for our motion simulators. This year I was a Google Summer of Code contributor with The Linux Foundation (OpenPrinting), working on the Linux printing stack in C and Rust, and I got 11 PRs merged in cups-rs and libcups.
>
> The part I enjoyed most was working upstream. When I found a crash in libcups, I fixed it in libcups and went through review, instead of adding a workaround in my code. Collabora does this every day for its customers, and that's why I'm applying. I also use Rust a lot and I'd like to work on it in embedded Linux.

**Technical leadership**
> In Google Summer of Code I designed how the COSMIC Printers page is built. My Rust code calls libcups through FFI, so if libcups crashed it would take the whole Settings app down. I suggested moving the backend into a separate varlink service in cosmic-settings-daemon, discussed it with my mentors from OpenPrinting and System76, and they agreed. I split the code into 5 crates so the Settings page and the standalone app share the same UI.
>
> I also ported cups-rs to libcups3 and talked with the maintainers about the API changes before writing them. I added CI that builds against CUPS 2 and 3 on several architectures. I still maintain the project now that the program is over.
>
> At EKSON I'm responsible for the simulator software: firmware, desktop app, backend and CI. I decided to move the firmware from ESP-IDF/FreeRTOS to Zephyr to get more deterministic timing and devicetree drivers.
>
> Outside work, I mentor in my local ICPC community and taught problem solving in C++ to more than 20 people. I was also Treasurer of the IEEE Student Branch at university.

**Open Source contributions**
> OpenPrinting (The Linux Foundation), 2026: 11 merged PRs.
> cups-rs, 9 PRs: port to libcups3, CI on several architectures and CUPS versions, IPP management, Printer Application support, DNS-SD bindings, lpoptions. https://github.com/OpenPrinting/cups-rs/pulls?q=is:pr+author:Abd002+is:merged
> libcups (C): fixed crashes in cupsDNSSDDelete() when Avahi fails to start, and a leaked client. https://github.com/OpenPrinting/libcups/pull/164 https://github.com/OpenPrinting/libcups/pull/165
> COSMIC (System76), in review: Printers page in COSMIC Settings https://github.com/pop-os/cosmic-settings/pull/2182 · Backend service: https://github.com/pop-os/cosmic-settings-daemon/pull/188 · My code: https://github.com/Abd002/cosmic-printers · My report: https://github.com/Abd002/GSOC-2026
> Zephyr RTOS (2025): added the IP_MULTICAST_LOOP socket option for IPv4, merged. https://github.com/zephyrproject-rtos/zephyr/pull/87167
> Boa (2025): faster code_points() for Latin1 strings, merged. https://github.com/boa-dev/boa/pull/4553
> Rust Clippy (2025): fixed false positives in the ref_as_ptr lint, merged. https://github.com/rust-lang/rust-clippy/pull/16214

**Consultancy experience**
> I haven't worked in a consultancy yet. The closest thing is Google Summer of Code, where I worked remotely with two groups at the same time: OpenPrinting, who maintain CUPS and libcups, and System76, who own COSMIC. They didn't always want the same thing, so I had to explain the trade-offs in writing, agree on changes before coding, and send the work in small pieces that were easy to review.

**Critical production issue**
> I haven't had a paying customer with a production outage yet, so this is the closest real case I have.
>
> While building the COSMIC Printers page, I found that libcups could crash in cupsDNSSDDelete() when Avahi failed to start, and that the same code leaked a client. My Rust code calls libcups through FFI, so this crash would have closed the whole Settings app.
>
> I reproduced it, found the cause in libcups' Avahi code and fixed both problems upstream in C (libcups #164 and #165, both merged). I didn't want to just hide it in my bindings. Then I moved the CUPS backend out of the Settings process into a varlink service in cosmic-settings-daemon, so if native code crashes again, Settings stays open.

**Remuneration**
> USD 30,000–40,000 per year (gross), working remotely from Cairo, Egypt. I'm open to discussing it depending on the full package.

---

# Earlier drafts (reference only)

## Please tell us of your interest in Collabora

> I've been moving toward embedded Linux for a while. In my internship at Orange Digital Center I built Yocto and Buildroot images and wrote a kernel module for ARM, and at EKSON I write the Zephyr firmware for our motion simulators. This year I was a Google Summer of Code contributor with The Linux Foundation (OpenPrinting), working on the Linux printing stack in C and Rust, and I got 11 PRs merged in cups-rs and libcups.
>
> The part I enjoyed most was working upstream. When I found a crash in libcups, I fixed it in libcups and went through review, instead of adding a workaround in my code. Collabora does this every day for its customers, and that's why I'm applying. I also use Rust a lot and I'd like to work on it in embedded Linux.

## Describe any technical leadership experience you have, formal or informal

> In Google Summer of Code I designed how the COSMIC Printers page is built. My Rust code calls libcups through FFI, so if libcups crashed it would take the whole Settings app down. I suggested moving the backend into a separate varlink service in cosmic-settings-daemon, discussed it with my mentors from OpenPrinting and System76, and they agreed. I split the code into 5 crates so the Settings page and the standalone app share the same UI.
>
> I also ported cups-rs to libcups3 and talked with the maintainers about the API changes before writing them. I added CI that builds against CUPS 2 and 3 on several architectures. I still maintain the project now that the program is over.
>
> At EKSON I'm responsible for the simulator software: firmware, desktop app, backend and CI. I decided to move the firmware from ESP-IDF/FreeRTOS to Zephyr to get more deterministic timing and devicetree drivers.
>
> Outside work, I mentor in my local ICPC community and taught problem solving in C++ to more than 20 people. I was also Treasurer of the IEEE Student Branch at university.

## Please tell us about your Open Source contributions and provide links

> OpenPrinting (The Linux Foundation), 2026: 11 merged PRs.
> - cups-rs, 9 PRs: port to libcups3, CI on several architectures and CUPS versions, IPP management, Printer Application support, DNS-SD bindings, lpoptions. https://github.com/OpenPrinting/cups-rs/pulls?q=is:pr+author:Abd002+is:merged
> - libcups (C): fixed crashes in cupsDNSSDDelete() when Avahi fails to start, and a leaked client. https://github.com/OpenPrinting/libcups/pull/164 https://github.com/OpenPrinting/libcups/pull/165
>
> COSMIC (System76), in review: Printers page in COSMIC Settings https://github.com/pop-os/cosmic-settings/pull/2182 and the backend service https://github.com/pop-os/cosmic-settings-daemon/pull/188. My code: https://github.com/Abd002/cosmic-printers and my report: https://github.com/Abd002/GSOC-2026
>
> Zephyr RTOS (2025): added the IP_MULTICAST_LOOP socket option for IPv4, merged. https://github.com/zephyrproject-rtos/zephyr/pull/87167
>
> Boa (2025): faster code_points() for Latin1 strings, merged. https://github.com/boa-dev/boa/pull/4553
>
> Rust Clippy (2025): fixed false positives in the ref_as_ptr lint, merged. https://github.com/rust-lang/rust-clippy/pull/16214
>
> My own project: a Linux kernel character device driver for ARM, tested on QEMU. https://github.com/Abd002/kernel-monitor

## Can you describe your experience in a consultancy environment?

> I haven't worked in a consultancy yet. The closest thing is Google Summer of Code, where I worked remotely with two groups at the same time: OpenPrinting, who maintain CUPS and libcups, and System76, who own COSMIC. They didn't always want the same thing, so I had to explain the trade-offs in writing, agree on changes before coding, and send the work in small pieces that were easy to review. At EKSON I own the simulator software and turn what the people using the simulators need into firmware and app changes. Scoping projects and handling customer expectations is the part I still need to learn, and I'd like to learn it at Collabora.

> **Check before sending:** keep "turn what the people using the simulators need into firmware and app changes" only if you really work with EKSON's customers or simulator operators. Otherwise delete it.

## Describe a situation where a customer had a critical production issue

> I haven't had a paying customer with a production outage yet, so this is the closest real case I have.
>
> While building the COSMIC Printers page, I found that libcups could crash in cupsDNSSDDelete() when Avahi failed to start, and that the same code leaked a client. My Rust code calls libcups through FFI, so this crash would have closed the whole Settings app.
>
> I reproduced it, found the cause in libcups' Avahi code and fixed both problems upstream in C (libcups #164 and #165, both merged). I didn't want to just hide it in my bindings. Then I moved the CUPS backend out of the Settings process into a varlink service in cosmic-settings-daemon, so if native code crashes again, Settings stays open.
>
> While doing this I kept my mentors updated on what was broken, why, and what I planned to do, and I explained the bug clearly to the libcups maintainers in the PRs. What I took from it: tell people early what you know and what you don't, fix the real cause, and make sure the next failure can't take everything down.

> **Check before sending:** change any detail that doesn't match what really happened (how you found it, how you reproduced it, what you told your mentors). They will ask you to go deeper on this story.

## Remuneration ball-park

Collabora pays by country, and the form rejects answers without a number and a currency. Reference points from [04 — Remote from Egypt](../../../04-Remote-From-Egypt.md):
- Microsoft Egypt pays about EGP 1M/yr (about USD 20k).
- Remote developers in Egypt average about USD 47k/yr (Arc.dev, 2026).

Suggested answer for a junior–mid embedded Linux engineer based in Cairo:

> USD 36,000 to 45,000 per year (gross), working remotely from Cairo, Egypt. I'm open to discussing it depending on the full package.

**This is your decision.** Go lower (for example USD 30,000–40,000) if you'd rather not risk being filtered out on cost. Don't go below what you'd accept, because Collabora treats this as a guideline.
