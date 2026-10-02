# CV — master and three one-page versions

These implement [07 §5.1](../07-Strategy-and-Roadmap.md#51-three-cv-versions): one master CV plus three one-page versions. Each version reorders the same true facts; nothing is invented.

**Updated:** 2026-10-01.

**Sources:**
- his latest CV (Sept 2026);
- his [GSoC 2026 final report](https://github.com/Abd002/GSOC-2026);
- his [GitHub profile README](https://github.com/Abd002);
- his older LaTeX CVs.

LinkedIn was compared from its "Save to PDF" export (2 Oct 2026). That fixed the EKSON start date (Aug 2025) and the ECPC count (4-time finalist) in all CVs. **[LinkedIn.md](LinkedIn.md)** lists what is missing on the profile, with ready-to-paste text.

| Version | PDF | Source | Headline | Section order | Send to |
|---|---|---|---|---|---|
| **General SWE** | [cv-general-swe.pdf](cv-general-swe.pdf) | [.tex](cv-general-swe.tex) | Software Engineer — C++ · Rust · Linux · Codeforces Expert | Summary → Skills → Open source → Experience → Projects → Achievements → Education | Big Tech, trading firms, SaaS |
| **Systems / Rust / open source** | [cv-systems-rust.pdf](cv-systems-rust.pdf) | [.tex](cv-systems-rust.tex) | Systems Software Engineer — Rust · C · Linux · GSoC 2026 (Linux Foundation) | Summary → Open source → Experience → Skills → Achievements → Education | Canonical, Red Hat, Collabora, Igalia, System76, JetBrains, Cloudflare, Ferrous Systems |
| **Embedded** | [cv-embedded.pdf](cv-embedded.pdf) | [.tex](cv-embedded.tex) | Embedded Software Engineer — Zephyr · Embedded Linux · Rust | Summary → Experience → Open source (Zephyr first) → Projects → Skills → Education | Nordic, NXP, Arm, TomTom, Bosch, Valeo, automotive |
| **Master (2 pages)** | [master-cv.pdf](master-cv.pdf) | [.tex](master-cv.tex) | Every fact, every project and course | — | Keep as the source. Use for master's applications after adding an academic section. |

The shared look is in [cv-style.sty](cv-style.sty). Change it once and every version follows.

## Build

```sh
cd Career-Roadmap/CV
pdflatex cv-general-swe.tex && pdflatex cv-general-swe.tex   # run twice; same for the others
```

- **Packages:** the `lato` font package (in `texlive-fonts-extra`; Overleaf has it), `lmodern`, `titlesec`, `enumitem`, `cmap`, `microtype`, `hyperref`.
- **On Overleaf:** upload the `.tex` and `cv-style.sty` files together and choose the pdfLaTeX compiler.

## ATS checks (all four PDFs pass)

These rules are built into `cv-style.sty`:

| Check | How it is met | Result |
|---|---|---|
| One column, no tables, text boxes, icons, images, headers or footers | Plain paragraphs and lists only | ✅ |
| Text extracts exactly | `glyphtounicode` + `cmap`; ligatures and hyphenation are off, so "finalist" is never extracted as a ligature glyph and "Android" is never split as "An-droid" | ✅ |
| Fonts | All Type 1, embedded, with Unicode maps. No Type 3 bitmap fonts. | ✅ |
| Standard section names | Summary, Experience, Open Source, Technical Skills, Projects, Achievements, Education | ✅ |
| Contact details as text | Email, phone and the full LinkedIn, GitHub and Codeforces URLs are written out, not hidden behind icons | ✅ |
| Dates next to each role | `Role — Company \| Mon YYYY – Mon YYYY` on one line, so parsers can count years of experience | ✅ |
| Length | One page for each version; two for the master | ✅ |

**How it was tested:**
- Each PDF was parsed with **pdftotext** (Poppler) and **pdfminer.six**, the text layers that most ATS parsers build on. Both gave the same word count and reading order.
- A script checked each extract for:
  - the email, phone and URLs;
  - every section heading;
  - each role's date on its own line;
  - no `(cid:` glyphs, no ligature characters and no split words.
- **Links:**
  - The personal repos, the Google Play and live demo pages, LinkedIn and the GSoC project page all answered when checked.
  - The upstream PR links come from his GSoC report.
- **Not tested:** commercial ATS products such as Workday or Greenhouse can't be run here. They read the same PDF text layer, so the checks above cover what they parse.

### Keyword match against real job ads (Oct 2026)

Each version's text was compared with real ads from the companies it targets. "Match" is the share of the ad's technical keywords that the CV contains.

| Version | Job ad | Match | Still missing (not in his record, so not added) |
|---|---|---|---|
| General SWE | Canonical — Graduate Software Engineer, Open Source and Linux | 72% | Go, cloud, containers/Kubernetes, packaging, security |
| General SWE | IMC — C++ Software Engineer, Early Careers | 75% | low-latency, profiling |
| General SWE | Cloudflare — Software Engineer, Egress (Go/Rust) | 63% | Go, cloud/AWS, Kubernetes, distributed systems |
| Systems/Rust | Canonical — C++/Rust Graphics and Windowing (Mir) | 68% | graphics, OpenGL/Vulkan, Wayland |
| Systems/Rust | Canonical — Graduate Software Engineer | 69% | Go, cloud, containers, packaging, security |
| Systems/Rust | Cloudflare — Software Engineer, Egress (Go/Rust) | 58% | Go, cloud/AWS, Kubernetes, distributed systems |
| Embedded | Canonical — Embedded & Desktop Linux Systems Engineer | 67% | Docker/containers, cloud, graphics, packaging |
| Embedded | Canonical — Embedded Linux Senior Software Engineer | 67% | Docker/containers, cloud, graphics, packaging |

The missing keywords line up with the gaps in [01 §4](../01-Profile-Analysis.md#4-gaps-and-how-to-close-them). The planned Rust backend service project (Docker, CI, Postgres, metrics) would add Docker, containers, cloud and distributed systems.

**Before each application:**
1. Copy the version's `.tex` file.
2. Add the 3–5 exact phrases from the ad that are true for him to the Skills section and the Summary.
3. Rebuild the PDF.

## Facts left out on purpose
- **Military service:** none of the versions says anything about it. International employers don't ask. For Egyptian employers, add a line under the contact details.
- **Zephyr issue #86977:** an older CV mentions it, but it could not be verified, so no version uses it.
