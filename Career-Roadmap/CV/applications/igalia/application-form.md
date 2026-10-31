# Igalia application form: JavaScript Engine Developer

**Role:** [JavaScript Engine Developer](https://www.igalia.com/jobs/javascript_engine_developer) (Web Languages team, remote). Prepared 31 Oct 2026; every fact comes from [facts.md](../../facts.md).

## Personal information

| Field | What to enter |
|---|---|
| Name | Abdelrahman Khalifa |
| Email | abdelrahman.khalifa.gad@gmail.com |
| Phone number | +20 114 250 5042 |
| Time zone | Africa/Cairo (UTC+2; UTC+3 in summer) |

## Cover letter & introduction

Paste the text between the lines.

---

Hello Igalia Web Languages team,

I'm Abdelrahman Khalifa, a systems software engineer from Cairo, Egypt, working mostly in Rust, C and modern C++. I'm applying for the JavaScript Engine Developer position because language runtimes are where I want to grow, and Igalia is where that work happens in the open.

My closest experience is in Boa, a JavaScript engine written in Rust. JavaScript strings are UTF-16 by specification, but engines store many of them as one-byte Latin1 to save memory. In PR #4553 (merged) I added a fast path to `JsStr::code_points()` for Latin1 strings, so iterating code points no longer converts them to UTF-16 first, and I added tests for it. Working through that code taught me how much of an engine's performance depends on its string representation. I also had a fix merged in Rust Clippy (#16214): the `ref_as_ptr` lint reported false positives for non-temporary references in `let`/`const`, which meant reading how the compiler represents types and expressions.

Most of my open-source work has been upstream and remote. As a Google Summer of Code 2026 contributor with The Linux Foundation's OpenPrinting project, I built the Printers page for the COSMIC desktop in Rust, with mentors from OpenPrinting and System76. I got 7 pull requests merged in cups-rs and libcups, including crash fixes in libcups' C code, and I still maintain the project. My first contribution was an IPv4 multicast socket option in Zephyr RTOS's networking stack, also merged. That work taught me to keep changes small, explain them clearly and respond to review.

I know C/C++ engines like V8, SpiderMonkey and JavaScriptCore are far larger than anything I have worked on, and I'm ready to learn them with your team's mentorship. I have been following Temporal with particular interest: V8 ships it using temporal_rs, a Rust crate that started in Boa and was built by Google, Igalia, ICU4X and Boa contributors together. It's a good example of the standards-to-implementation work your team does.

My pronouns are he/him. Thank you for considering my application.

Abdelrahman Khalifa
https://github.com/Abd002

---

## Professional information

| Field | What to enter |
|---|---|
| Curriculum vitae (PDF, 5 MB max) | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf), the Igalia copy |
| Additional comments | See below |
| Other documents (PDF) | Leave empty. Your CV already links your PRs. |
| How did you discover this position | Igalia's careers page (igalia.com/jobs) |
| Robot check (3 + 5) | 8 |
| Copy of my application | Tick it, so you keep a copy |
| Privacy policy | Tick after reading |

**Additional comments** (paste):

> Links to the work mentioned above: Boa PR https://github.com/boa-dev/boa/pull/4553 · Rust Clippy PR https://github.com/rust-lang/rust-clippy/pull/16214 · Zephyr https://github.com/zephyrproject-rtos/zephyr/pull/87167 · cups-rs PRs #18–#22 https://github.com/OpenPrinting/cups-rs/pulls?q=is%3Apr+author%3AAbd002 · COSMIC printers https://github.com/Abd002/cosmic-printers. I'm happy to work remotely in any team time zone overlap you need.

## Check before sending

- **Pronouns:** the letter says he/him. Change it if that's wrong.
- **The optional question about underrepresented groups:** the letter says nothing, which is fine. If you choose to answer, it's your call what to say, for example that you're from a region (Egypt / MENA) that is underrepresented in free and open-source software.
- **Temporal:** the paragraph says you're *following* it. Be ready to explain in an interview what Temporal is (the new date/time API that replaces `Date`). Even better, first look at the good first issues in [boa-dev/temporal](https://github.com/boa-dev/temporal); a PR there would be the strongest thing for this application (see [README §3](README.md)).
- **cups-rs link:** the search link only works if the PRs were opened from your GitHub account `Abd002`. Open it once to check; otherwise link [PR #18](https://github.com/OpenPrinting/cups-rs/pull/18).
