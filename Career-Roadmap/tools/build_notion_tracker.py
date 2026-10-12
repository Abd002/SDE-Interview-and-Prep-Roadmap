#!/usr/bin/env python3
"""Build the rows of the Notion "Companies & Applications" tracker from the
company lists in this folder (02, 03 and 04).

Usage: python3 tools/build_notion_tracker.py > companies.json
Each row is a dict of Notion property values (the columns are listed in
08-Application-Tracker.md, section "E. Notion tracker"). Companies that appear
in several lists are merged: their "From my list" values are combined and the
first row's data is kept.
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote, urlparse

HERE = Path(__file__).resolve().parent.parent
FILES = {
    "02-International-Companies.md": "Intl",
    "03-Egypt-Companies.md": "Egypt",
    "04-Remote-From-Egypt.md": "Remote",
}
EGYPT_GEO = "106155005"  # LinkedIn geo ID for Egypt
ATS_HOSTS = ("greenhouse.io", "lever.co", "workable.com", "ashbyhq.com", "smartrecruiters.com",
             "myworkdayjobs.com", "recruitee.com", "personio.", "teamtailor.com", "bamboohr.com",
             "jobvite.com", "breezy.hr", "wellfound.com", "join.com", "workday.com", "icims.com",
             "successfactors", "taleo.net", "linkedin.com", "freehire.me", "relocate.me", "startup.jobs")

LINK = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")


def plain(md):
    s = LINK.sub(r"\1", md)
    s = re.sub(r"\*\*|__|\*|`", "", s)
    return re.sub(r"\s+", " ", s).strip()


def first_url(md):
    m = LINK.search(md)
    return m.group(2) if m else None


def section_name(heading, source):
    h = re.sub(r"^#+\s*", "", heading)
    h = re.sub(r"[^\w\s&/,().'-]", "", h).strip()        # drop emojis and flags
    h = re.sub(r"\s*\(.*\)$", "", h).strip()
    h = h.replace(", ", " / ")  # Notion multi-select options can't contain commas
    if source == "Intl":
        return "Big Tech" if h.lower().startswith("big tech") else f"Intl: {h}"
    if source == "Egypt":
        return f"Egypt: {h}"
    if h.lower().startswith("1. employers"):
        return "Remote employer"
    return f"Startup: {h}"


def cell(row, header, *names):
    for n in names:
        for i, h in enumerate(header):
            if h.lower().startswith(n.lower()) and i < len(row):
                return row[i]
    return ""


ROLE_RULES = [
    ("Systems/Rust", r"\brust\b|systems software|systems programming|low[- ]level|kernel|database|storage|distributed|infrastructure"),
    ("Embedded/Firmware", r"embedded|firmware|zephyr|rtos|autosar|automotive|bsp|microcontroller|iot|robot|hardware"),
    ("Linux/Kernel", r"linux|kernel|yocto|driver"),
    ("Backend", r"backend|back-end|platform|distributed|cloud|api|server"),
    ("Graduate/Junior", r"grad|junior|intern|new grad|entry|early career|\bl3\b|sde i\b"),
    ("Open source", r"open[- ]source|upstream"),
]
STACK_RULES = [
    ("Rust", r"\brust\b"),
    ("C++", r"c\+\+"),
    ("C", r"(?<![\w+#])c(?![\w+#])(?!\s*\+)|embedded c\b"),
    ("Python", r"python"),
    ("Go", r"golang|\bGo\b(?!-)"),
    ("Java", r"\bjava\b|kotlin"),
    ("Linux", r"linux|kernel|yocto"),
    ("Zephyr/RTOS", r"zephyr|rtos|freertos"),
    ("Embedded", r"embedded|firmware|microcontroller|autosar|mcu"),
    ("Cloud/K8s", r"cloud|kubernetes|k8s|aws|azure|gcp"),
    ("Databases", r"database|\bdb\b|sql|storage engine|kv store"),
]


def rules(text, table):
    # "Go" is matched case-sensitively, so the verb "go" doesn't count.
    return [name for name, rx in table
            if re.search(rx, text if name == "Go" else text.lower())]


def visa(evidence, source):
    if source == "Egypt":
        return "🇪🇬 Local (Egypt office)"
    e = evidence.strip()
    for sym, label in (("✅", "✅ Verified"), ("🟡", "🟡 Likely"), ("❌", "❌ No"), ("❓", "❓ Unknown")):
        if e.startswith(sym):
            return label
    if "🇪🇬" in e[:4]:
        return "🇪🇬 Local (Egypt office)"
    return "❓ Unknown"


def work_modes(text):
    t = text.lower()
    out = []
    if "remote" in t or "anywhere" in t:
        out.append("Remote")
    if "hybrid" in t:
        out.append("Hybrid")
    if "on-site" in t or "onsite" in t or "office" in t:
        out.append("On-site")
    return out


def about_url(careers):
    if not careers:
        return None
    u = urlparse(careers)
    host = u.netloc.lower()
    if any(a in host for a in ATS_HOSTS) or host.endswith(".jobs"):
        return None
    host = re.sub(r"^(careers|jobs|job|apply|work|join)\.", "", host)
    return f"https://{host}/"


def li_people(keywords, geo=None):
    url = "https://www.linkedin.com/search/results/people/?keywords=" + quote(keywords)
    if geo:
        url += "&geoUrn=" + quote(f'["{geo}"]')
    return url


def best_cv(roles, stack):
    if "Embedded/Firmware" in roles and "Systems/Rust" not in roles:
        return "Embedded"
    if "Systems/Rust" in roles or "Rust" in stack or "Linux/Kernel" in roles:
        return "Systems-Rust"
    return "General SWE"


def date_of(verified):
    m = re.search(r"\d{4}-\d{2}-\d{2}", verified)
    return m.group(0) if m else None


def build():
    rows = {}
    for fname, source in FILES.items():
        section, header = None, None
        for line in (HERE / fname).read_text(encoding="utf-8").splitlines():
            if line.startswith("## ") or line.startswith("### "):
                section = line
                header = None
                continue
            if line.startswith("| # |"):
                header = [h.strip() for h in line.strip().strip("|").split("|")]
                continue
            if not header or not re.match(r"^\| \d+ \|", line):
                continue
            row = [c.strip() for c in line.strip().strip("|").split("|")]
            name_md = cell(row, header, "Company", "Startup")
            name = plain(name_md)
            key = re.sub(r"\s*\(.*?\)", "", name).lower().strip()
            listname = section_name(section, source)
            if listname == "Intl: P1 shortlist":  # a summary of rows already listed above
                continue
            if key in rows:
                if listname not in rows[key]["From my list"]:
                    rows[key]["From my list"].append(listname)
                continue

            full = plain(line)
            short = re.sub(r"\s*\(.*?\)", "", name)
            careers = first_url(cell(row, header, "Careers"))
            li_jobs = first_url(cell(row, header, "LinkedIn jobs"))
            build_txt = plain(cell(row, header, "What they build") or
                              ", ".join(x for x in (cell(row, header, "Industry"), cell(row, header, "Relevant teams")) if x))
            titles = plain(cell(row, header, "Suitable titles", "Roles for him"))
            # Only the columns that describe the work, not the evidence notes.
            about_work = " ".join(plain(cell(row, header, n)) for n in (
                "Stack", "Relevant teams", "Suitable titles", "Roles for him", "What they build",
                "Industry", "Required qualifications", "Levels"))
            roles = ["Software Engineer"] + rules(about_work, ROLE_RULES)
            stack = rules(about_work, STACK_RULES)
            prio = re.search(r"P[123]", cell(row, header, "Priority"))
            if source == "Intl":
                place = plain(cell(row, header, "Country / City"))
                evidence = cell(row, header, "Visa sponsorship")
                mode_txt = cell(row, header, "Remote / Hybrid") + " " + cell(row, header, "Remote from")
                reloc = cell(row, header, "Relocation").strip().startswith("✅")
            elif source == "Egypt":
                place = plain(cell(row, header, "City")) + ", Egypt"
                evidence = ""
                mode_txt = cell(row, header, "Remote / Hybrid")
                reloc = False
            else:
                place = plain(cell(row, header, "HQ")) or "Remote"
                evidence = cell(row, header, "Egypt eligibility")
                mode_txt = full
                reloc = "relocation" in (section or "").lower()
            stack_word = next((w for w in ("Rust", "Embedded", "Linux", "C++") if w in stack), "")
            rows[key] = {
                "Company": name,
                "Priority": prio.group(0) if prio else "P3",
                "From my list": [listname],
                "Country / City": place[:300],
                "What they build": build_txt[:400],
                "About page": about_url(careers) or "https://www.google.com/search?q=" + quote(f"{short} company what we build"),
                "Careers page": careers,
                "LinkedIn company page": "https://www.linkedin.com/search/results/companies/?keywords=" + quote(short),
                "LinkedIn jobs": li_jobs,
                "Roles for me": sorted(set(roles)),
                "Tech stack": stack,
                "Work mode": work_modes(mode_txt) or (["Remote"] if source == "Remote" else []),
                "Visa / Egypt eligibility": visa(evidence, source),
                "Relocation": reloc,
                "Salary note": plain(cell(row, header, "Salary", "Pay"))[:300],
                "Best CV": best_cv(roles, stack),
                "Find recruiters": li_people(f"{short} technical recruiter"),
                "Find engineers": li_people(f"{short} software engineer {stack_word}".strip()),
                "Find Egyptians there": li_people(short, EGYPT_GEO),
                "Referral status": "Not asked",
                "Status": plain(cell(row, header, "Status")) or "Not started",
                "Verified on": date_of(cell(row, header, "Verified on")),
            }
    return list(rows.values())


if __name__ == "__main__":
    json.dump(build(), sys.stdout, ensure_ascii=False, indent=1)
