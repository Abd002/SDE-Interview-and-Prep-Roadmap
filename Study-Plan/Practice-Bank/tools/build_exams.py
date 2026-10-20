#!/usr/bin/env python3
"""Build the exam part of the Practice Bank from downloaded PDFs.

Usage: build_exams.py RAW_DIR BANK_DIR

RAW_DIR has the files as downloaded:
  cmu/<semester>/{homework1.html, hw1-sols*.tar.gz, hwN(-clean).pdf, hwN-sols.pdf}
  hkn/cs186_fa18_mt1(_sol).pdf, hkn/cs162_...    (Berkeley HKN exam archive)
  mit/q24-1(-sol).pdf, q1-07-ans.pdf, ...         (MIT 6.824 / 6.5840 quizzes)
  cam/yYYYYpPqQ.pdf                               (Cambridge papers)
  cs168/cs168-sp25-discNN(-sols).pdf              (Berkeley CS168 worksheets)

For every exam it writes a folder with the original PDFs, questions.md,
solutions.md and figures/, plus one README per course.
"""
import glob
import html
import os
import re
import shutil
import sys
import tarfile

sys.path.insert(0, os.path.dirname(__file__))
from pdf2md import convert  # noqa: E402

RAW, BANK = sys.argv[1], sys.argv[2]
SEM = {'fa': 'Fall', 'sp': 'Spring', 'su': 'Summer'}
EXAM = {'mt1': 'Midterm 1', 'mt2': 'Midterm 2', 'mt3': 'Midterm 3', 'f': 'Final'}


def year(yy):
    y = int(yy)
    return 2000 + y if y < 90 else 1900 + y


def build_set(folder, title, source, q_pdf=None, s_pdf=None, note=None):
    """One exam folder. Returns (questions_md or None, solutions_md or None)."""
    os.makedirs(folder, exist_ok=True)
    out = [None, None]
    for k, (pdf, kind, fname) in enumerate([(q_pdf, 'Questions', 'exam.pdf'), (s_pdf, 'Official solutions', 'solutions.pdf')]):
        if not pdf:
            continue
        shutil.copy(pdf, os.path.join(folder, fname))
        md = os.path.join(folder, 'questions.md' if k == 0 else 'solutions.md')
        t = f'{title}: {kind}'
        convert(pdf, md, os.path.join(folder, 'figures'), t, source)
        if note:
            body = open(md).read().split('\n', 1)
            open(md, 'w').write(body[0] + '\n\n' + note + '\n' + body[1])
        out[k] = md
    return out


def link(path, base, text):
    return f'[{text}]({os.path.relpath(path, base)})' if path else '—'


def topics_from(pdf):
    """Question titles from a CMU/Berkeley points table or 'Question N:' lines."""
    import pymupdf
    try:
        doc = pymupdf.open(pdf)
    except Exception:
        return ''
    text = ''.join(p.get_text() for p in doc)
    found = re.findall(r'Question \d+:\s*([^.\n]+?)\s*(?:\.\s*){2,}', text)
    if not found:
        found = re.findall(r'\n\s*\d+\s+([A-Z][A-Za-z+/ \-]{3,40}?)\s*\((\d+) points?\)', text)
        found = [f[0] for f in found]
    seen = []
    for f in found:
        f = ' '.join(f.split())
        if f not in seen:
            seen.append(f)
    return ', '.join(seen[:8])


# ---------------- CMU 15-445 ----------------
def cmu():
    base = os.path.join(BANK, 'Databases', 'CMU-15-445-Homeworks')
    rows = []
    order = ['fall2023', 'spring2024', 'fall2024', 'spring2025', 'fall2025', 'spring2026']
    for sem in order:
        sdir = os.path.join(RAW, 'cmu', sem)
        if not os.path.isdir(sdir):
            continue
        nice = sem.replace('fall', 'Fall ').replace('spring', 'Spring ')
        page = f'https://15445.courses.cs.cmu.edu/{sem}/assignments.html'
        # HW1 (SQL): the questions are a web page, the solutions .sql files
        h1 = os.path.join(sdir, 'homework1.html')
        tars = glob.glob(os.path.join(sdir, 'hw1-sol*.tar.gz'))
        if os.path.exists(h1):
            folder = os.path.join(base, sem, 'hw1-sql')
            os.makedirs(folder, exist_ok=True)
            q = hw1_questions(h1, os.path.join(folder, 'questions.md'), f'CMU 15-445 {nice}: Homework 1 (SQL): Questions',
                              f'https://15445.courses.cs.cmu.edu/{sem}/homework1/')
            s = None
            if tars:
                s = hw1_solutions(tars[0], os.path.join(folder, 'solutions.md'), f'CMU 15-445 {nice}: Homework 1 (SQL): Official solutions',
                                  f'https://15445.courses.cs.cmu.edu/{sem}/files/{os.path.basename(tars[0])}')
            rows.append((nice, 'HW1', 'SQL (DuckDB/SQLite queries)', q, s, None, None))
        for n in range(2, 7):
            qp = next((p for p in [os.path.join(sdir, f'hw{n}-clean.pdf'), os.path.join(sdir, f'hw{n}.pdf')] if os.path.exists(p)), None)
            sp = os.path.join(sdir, f'hw{n}-sols.pdf')
            sp = sp if os.path.exists(sp) else None
            if not (qp or sp):
                continue
            folder = os.path.join(base, sem, f'hw{n}')
            note = None
            if sem == 'fall2025' and n == 2:
                note = '> ⚠️ Study plan: don\'t open these solutions before **step 26** (self-grade).'
            q, s = build_set(folder, f'CMU 15-445 {nice}: Homework {n}', page, qp, sp, note)
            rows.append((nice, f'HW{n}', topics_from(qp or sp), q, s,
                         os.path.join(folder, 'exam.pdf') if qp else None, os.path.join(folder, 'solutions.pdf') if sp else None))
    w = ['# CMU 15-445/645 Database Systems: homeworks with official solutions\n',
         '> Source: <https://15445.courses.cs.cmu.edu/> (Prof. Andy Pavlo). Every homework below is copied from the course site of its semester: the question PDF, the official solutions PDF, and both converted to Markdown with their figures. Nothing was answered or rewritten here.\n',
         '**How to use:** do `questions.md` (or `exam.pdf`) with no notes and a timer, then grade yourself with `solutions.md`.\n',
         '| Semester | HW | Topics | Questions | Official solutions | PDFs |', '|---|---|---|---|---|---|']
    for nice, hw, top, q, s, qp, sp in rows:
        pdfs = ' · '.join(x for x in [link(qp, base, 'questions') if qp else '', link(sp, base, 'solutions') if sp else ''] if x)
        w.append(f'| {nice} | {hw} | {top} | {link(q, base, "questions.md")} | {link(s, base, "solutions.md")} | {pdfs or "—"} |')
    open(os.path.join(base, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


def hw1_questions(src, out, title, source):
    s = open(src).read()
    i = s.find('<h1>')
    j = s.find('</main>')
    body = s[i:j if j > i else len(s)] if i >= 0 else s
    body = re.sub(r'<script.*?</script>|<style.*?</style>|<nav.*?</nav>|<header.*?</header>|<footer.*?</footer>', '', body, flags=re.S)
    body = re.sub(r'<pre[^>]*>(.*?)</pre>', lambda m: '\n```\n' + html.unescape(re.sub('<[^>]+>', '', m.group(1))).strip() + '\n```\n', body, flags=re.S)
    body = re.sub(r'<h([1-4])[^>]*>(.*?)</h\1>', lambda m: '\n' + '#' * (int(m.group(1)) + 1) + ' ' + re.sub('<[^>]+>', '', m.group(2)).strip() + '\n', body, flags=re.S)
    body = re.sub(r'<li[^>]*>', '\n- ', body)
    body = re.sub(r'<code>(.*?)</code>', r'`\1`', body, flags=re.S)
    body = re.sub(r'<(strong|b)>(.*?)</\1>', r'**\2**', body, flags=re.S)
    from urllib.parse import urljoin
    body = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f'[{m.group(2)}]({urljoin(source, m.group(1))})', body, flags=re.S)
    body = re.sub(r'<br\s*/?>|</p>|<p[^>]*>', '\n\n', body)
    body = re.sub(r'<[^>]+>', '', body)
    body = html.unescape(body)
    body = re.sub(r'\n{3,}', '\n\n', body).strip()
    open(out, 'w').write(f'# {title}\n\n> Copied from <{source}>. Nothing was answered or rewritten.\n\n{body}\n')
    return out


def hw1_solutions(tgz, out, title, source):
    w = [f'# {title}\n', f'> Copied from the official solutions archive <{source}>: one query file per question. Nothing was written here.\n']
    with tarfile.open(tgz) as t:
        for m in sorted(t.getmembers(), key=lambda m: [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', m.name)]):
            name = os.path.basename(m.name)
            if not m.isfile() or name.startswith('._') or not name.endswith('.sql'):
                continue
            sql = t.extractfile(m).read().decode('utf-8', 'replace').strip()
            w.append(f'## {name}\n\n```sql\n{sql}\n```\n')
    open(out, 'w').write('\n'.join(w))
    return out


# ---------------- Berkeley HKN (CS186, CS162) ----------------
def hkn(course, area, folder_name, title_name):
    base = os.path.join(BANK, area, folder_name)
    files = glob.glob(os.path.join(RAW, 'hkn', f'cs{course}_*.pdf'))
    sets = {}
    for f in files:
        m = re.match(rf'cs{course}_([a-z]{{2}})(\d{{2}})_([a-z0-9]+?)(_sol)?\.pdf', os.path.basename(f))
        if not m:
            continue
        key = (year(m.group(2)), m.group(1), m.group(3))
        sets.setdefault(key, [None, None])[1 if m.group(4) else 0] = f
    rows = []
    for (y, sem, ex), (qp, sp) in sorted(sets.items(), key=lambda kv: (-kv[0][0], kv[0][1], kv[0][2])):
        nice = f'{SEM.get(sem, sem)} {y}'
        exn = EXAM.get(ex, ex)
        folder = os.path.join(base, f'{y}-{sem}-{ex}')
        q, s = build_set(folder, f'Berkeley {title_name} {nice}: {exn}', f'https://hkn.eecs.berkeley.edu/exams/course/cs/{course}', qp, sp)
        rows.append((nice, exn, q, s, os.path.join(folder, 'exam.pdf') if qp else None, os.path.join(folder, 'solutions.pdf') if sp else None))
    return base, rows


def hkn_readme(base, rows, title, extra=''):
    w = [f'# {title}\n',
         '> Source: Berkeley HKN exam archive. Every exam is copied as published: the exam PDF, the official solutions PDF where one exists, and both converted to Markdown with their figures. Old exams that were scanned are kept as page images. Nothing was answered or rewritten here.\n',
         extra,
         '| Semester | Exam | Questions | Official solutions | PDFs |', '|---|---|---|---|---|']
    for nice, exn, q, s, qp, sp in rows:
        pdfs = ' · '.join(x for x in [link(qp, base, 'exam') if qp else '', link(sp, base, 'solutions') if sp else ''] if x)
        w.append(f'| {nice} | {exn} | {link(q, base, "questions.md")} | {link(s, base, "solutions.md")} | {pdfs or "—"} |')
    open(os.path.join(base, 'README.md'), 'w').write('\n'.join(w) + '\n')


# ---------------- MIT 6.824 / 6.5840 quizzes ----------------
def mit():
    base = os.path.join(BANK, 'Distributed-Systems', 'MIT-6.5840-Quizzes')
    sets = {}
    for f in glob.glob(os.path.join(RAW, 'mit', '*')):
        n = os.path.basename(f)
        m = re.match(r'q(\d{2})-(\d)(-sol)?\.(pdf|txt|md)$', n)           # q24-1(-sol).pdf: year-quiz
        m2 = re.match(r'q(\d)-(\d{2})(-ans)?\.pdf$', n)                    # q1-07-ans.pdf: quiz-year
        m3 = re.match(r'q(\d{2})[_-](\d)[_-]ans\.pdf$', n)                  # q09_1_ans.pdf, q14-1-ans.pdf
        if m:
            y, qn, sol = year(m.group(1)), m.group(2), bool(m.group(3))
        elif m2:
            y, qn, sol = year(m2.group(2)), m2.group(1), bool(m2.group(3))
        elif m3:
            y, qn, sol = year(m3.group(1)), m3.group(2), True
        else:
            continue
        sets.setdefault((y, qn), [None, None])[1 if sol else 0] = f
    rows = []
    for (y, qn), (qp, sp) in sorted(sets.items(), key=lambda kv: (-kv[0][0], kv[0][1])):
        folder = os.path.join(base, f'{y}-quiz{qn}')
        title = f'MIT 6.824/6.5840 {y}: Quiz {qn}'
        src = 'https://pdos.csail.mit.edu/6.824/quizzes.html'
        q = s = None
        os.makedirs(folder, exist_ok=True)
        if qp and qp.endswith('.pdf'):
            q, _ = build_set(folder, title, src, qp, None)
        elif qp:
            q = text_set(qp, os.path.join(folder, 'questions.md'), f'{title}: Questions', src)
        if sp and sp.endswith('.pdf'):
            _, s = build_set(folder, title, src, None, sp)
        elif sp:
            s = text_set(sp, os.path.join(folder, 'solutions.md'), f'{title}: Official solutions', src)
        rows.append((y, qn, q, s))
    w = ['# MIT 6.824 / 6.5840 Distributed Systems: quizzes with official solutions\n',
         '> Source: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Every quiz is copied as published; most years have an official solutions file (for 2002–2017 the "answers" file contains the questions too). Converted to Markdown with figures. Nothing was answered or rewritten here.\n',
         '| Year | Quiz | Questions | Official solutions |', '|---|---|---|---|']
    for y, qn, q, s in rows:
        w.append(f'| {y} | {qn} | {link(q, base, "questions.md")} | {link(s, base, "solutions.md")} |')
    open(os.path.join(base, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


def text_set(src_file, out, title, source):
    body = open(src_file, encoding='utf-8', errors='replace').read()
    shutil.copy(src_file, os.path.join(os.path.dirname(out), os.path.basename(src_file)))
    if src_file.endswith('.md'):
        content = body
    else:
        content = '```text\n' + body.strip() + '\n```'
    open(out, 'w').write(f'# {title}\n\n> Copied from <{source}> (original file: `{os.path.basename(src_file)}`). Nothing was answered or rewritten.\n\n{content}\n')
    return out


# ---------------- Cambridge ----------------
def cambridge():
    base = os.path.join(BANK, 'Distributed-Systems', 'Cambridge-Concurrent-and-Distributed-Systems')
    rows = []
    for f in sorted(glob.glob(os.path.join(RAW, 'cam', 'y*.pdf')), reverse=True):
        m = re.match(r'y(\d{4})p(\d+)q(\d+)\.pdf', os.path.basename(f))
        y, p, qn = m.groups()
        folder = os.path.join(base, f'{y}-paper{p}-q{qn}')
        q, _ = build_set(folder, f'Cambridge Computer Science Tripos {y}, Paper {p}, Question {qn}',
                         f'https://www.cl.cam.ac.uk/teaching/exams/pastpapers/{os.path.basename(f)}', f, None)
        rows.append((y, p, qn, q))
    w = ['# Cambridge: Concurrent and Distributed Systems past exam questions\n',
         '> Source: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/t-ConcurrentandDistributedSystems.html> (Kleppmann\'s course from 2020; earlier years cover the older Concurrent and Distributed Systems course). Every question is copied as published and converted to Markdown with its figures.\n',
         '**No official solutions here:** Cambridge publishes its solution notes only to University of Cambridge users (Raven login), so they could not be downloaded. Check your answers against the lecture notes and the [DDIA ch. 9 revision map](../../../Revision-Maps/DDIA-Ch9-Consistency-and-Consensus.md).\n',
         '| Year | Paper | Question | File |', '|---|---|---|---|']
    for y, p, qn, q in rows:
        w.append(f'| {y} | {p} | {qn} | {link(q, base, "questions.md")} |')
    open(os.path.join(base, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


# ---------------- CS168 worksheets ----------------
def cs168():
    base = os.path.join(BANK, 'Networking', 'Berkeley-CS168-Worksheets')
    rows = []
    for qp in sorted(glob.glob(os.path.join(RAW, 'cs168', 'cs168-sp25-disc??.pdf'))):
        n = re.search(r'disc(\d+)', qp).group(1)
        sp = qp.replace('.pdf', '-sols.pdf')
        sp = sp if os.path.exists(sp) else None
        folder = os.path.join(base, f'disc{n}')
        q, s = build_set(folder, f'Berkeley CS168 Spring 2025: Discussion {int(n)}', 'https://sp25.cs168.io/', qp, sp)
        rows.append((n, topics_from(qp), q, s))
    w = ['# Berkeley CS168 Introduction to the Internet: discussion worksheets with official solutions\n',
         '> Source: <https://sp25.cs168.io/> (Spring 2025). CS168 doesn\'t publish past exams (the HKN archive has none), so these official weekly worksheets with solutions are the practice set. Converted to Markdown with figures; nothing was answered or rewritten here.\n',
         '| # | Questions | Official solutions |', '|---|---|---|']
    for n, top, q, s in rows:
        w.append(f'| {int(n)} | {link(q, base, "questions.md")} | {link(s, base, "solutions.md")} |')
    open(os.path.join(base, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


if __name__ == '__main__':
    which = sys.argv[3:] or ['cmu', 'cs186', 'cs162', 'mit', 'cam', 'cs168']
    if 'cmu' in which:
        print('cmu', cmu())
    if 'cs186' in which:
        b, r = hkn(186, 'Databases', 'Berkeley-CS186-Exams', 'CS186')
        hkn_readme(b, r, 'Berkeley CS186 Database Systems: past exams with official solutions',
                   '**Newer exams (Fall 2017 to Spring 2026)** are on the course site, <https://cs186berkeley.net/resources/>, but they are Google Drive files that need a Google sign-in, so they could not be copied here. Open them from that page in a browser.\n')
        print('cs186', len(r))
    if 'cs162' in which:
        b, r = hkn(162, 'Operating-Systems', 'Berkeley-CS162-Exams', 'CS162')
        hkn_readme(b, r, 'Berkeley CS162 Operating Systems: past exams with official solutions')
        print('cs162', len(r))
    if 'mit' in which:
        print('mit', mit())
    if 'cam' in which:
        print('cam', cambridge())
    if 'cs168' in which:
        print('cs168', cs168())
