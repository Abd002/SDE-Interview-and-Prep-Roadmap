#!/usr/bin/env python3
"""Copy the open question banks into the Practice Bank, with their own answers.

Usage: build_banks.py CLONES_DIR BANK_DIR [bank ...]

CLONES_DIR holds shallow clones of the source repositories. Every file written
here keeps the source's own questions and answers; a header says where it came
from and under which licence. Nothing is answered here.
"""
import glob
import os
import re
import shutil
import subprocess
import sys

SRC, BANK = sys.argv[1], sys.argv[2]


def header(title, url, licence, extra=''):
    return (f'# {title}\n\n> Copied from <{url}> ({licence}). Questions and answers are the source\'s own; '
            f'nothing was answered or rewritten here.{(" " + extra) if extra else ""}\n\n')


def count_details(md):
    total = empty = 0
    for m in re.finditer(r'<details>(.*?)</details>', md, re.S):
        total += 1
        body = re.sub(r'<summary>.*?</summary>', '', m.group(1), flags=re.S)
        if not re.sub(r'<[^>]+>', '', body).strip():
            empty += 1
    return total, empty


def copy_images(md, src_dir, dst_dir, url_base):
    """Copy local images referenced by md into dst_dir/images and fix the paths."""
    def fix(path):
        if re.match(r'(https?:|data:|#|mailto:)', path):
            return path
        src = os.path.normpath(os.path.join(src_dir, path))
        if os.path.isfile(src) and re.search(r'\.(png|jpe?g|gif|svg|webp)$', src, re.I):
            os.makedirs(os.path.join(dst_dir, 'images'), exist_ok=True)
            name = os.path.relpath(src, SRC).replace('/', '_')
            shutil.copy(src, os.path.join(dst_dir, 'images', name))
            return 'images/' + name
        # other relative links: point to the original repository
        return url_base + os.path.relpath(os.path.normpath(os.path.join(src_dir, path)), os.path.join(SRC, url_base.split('/')[4]))
    md = re.sub(r'(!?\[[^\]]*\]\()([^)\s]+)(\))', lambda m: m.group(1) + fix(m.group(2)) + m.group(3), md)
    md = re.sub(r'(<img[^>]*src=")([^"]+)(")', lambda m: m.group(1) + fix(m.group(2)) + m.group(3), md)
    return md


# ---------------- devops-exercises ----------------
def devops():
    repo = os.path.join(SRC, 'devops-exercises')
    out = os.path.join(BANK, 'Question-Banks', 'devops-exercises')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://github.com/bregman-arie/devops-exercises'
    lic = 'CC BY-NC-ND 3.0, by Arie Bregman and contributors'
    gh = 'https://github.com/bregman-arie/devops-exercises/blob/master/'
    readme = open(os.path.join(repo, 'README.md')).read()
    parts = re.split(r'(?m)^## ', readme)
    keep = ['Network', 'Operating System', 'Virtualization', 'Mongo', 'SQL', 'Distributed', 'Misc', 'HTTP', 'Storage', 'Testing', 'System Design', 'Hardware']
    rows = []
    for p in parts[1:]:
        name = p.split('\n', 1)[0].strip()
        if name not in keep:
            continue
        fname = re.sub(r'[^A-Za-z0-9]+', '-', name).strip('-') + '.md'
        body = copy_images('## ' + p, repo, out, gh)
        t, e = count_details(body)
        open(os.path.join(out, fname), 'w').write(header(f'devops-exercises: {name}', url + '#' + name.lower().replace(' ', '-'), lic) + body)
        rows.append((name, fname, t, e))
    topics = ['databases', 'linux', 'dns', 'git', 'observability', 'chaos_engineering', 'security', 'aws', 'containers', 'kubernetes', 'cicd', 'docker', 'python', 'shell', 'terraform', 'ansible', 'cloud', 'sre']
    for tpc in topics:
        tdir = os.path.join(repo, 'topics', tpc)
        if not os.path.isdir(os.path.join(tdir)) or not os.path.exists(os.path.join(tdir, 'README.md')):
            continue
        dst = os.path.join(out, 'topics', tpc)
        os.makedirs(dst, exist_ok=True)
        files = sorted(glob.glob(os.path.join(tdir, '**', '*.md'), recursive=True))
        t = e = 0
        for f in files:
            rel = os.path.relpath(f, tdir)
            os.makedirs(os.path.dirname(os.path.join(dst, rel)), exist_ok=True)
            body = copy_images(open(f).read(), os.path.dirname(f), os.path.dirname(os.path.join(dst, rel)), gh)
            a, b = count_details(body)
            t, e = t + a, e + b
            open(os.path.join(dst, rel), 'w').write(header(f'devops-exercises: {tpc} / {rel}', gh + f'topics/{tpc}/{rel}', lic) + body)
        rows.append((tpc.replace('_', ' ').title(), f'topics/{tpc}/README.md', t, e))
    w = [header('devops-exercises: interview questions with answers', url, lic),
         'Each question is a collapsible block: click it to see the answer. The source leaves some questions without an answer (count below); those stay unanswered here too.\n',
         '| Topic | File | Questions | Without an answer in the source |', '|---|---|---|---|']
    for name, f, t, e in rows:
        w.append(f'| {name} | [{f}]({f}) | {t} | {e} |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


# ---------------- System Design Primer ----------------
def sdp():
    repo = os.path.join(SRC, 'system-design-primer')
    out = os.path.join(BANK, 'System-Design', 'system-design-primer')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://github.com/donnemartin/system-design-primer'
    lic = 'CC BY 4.0, by Donne Martin'
    gh = url + '/blob/master/'
    rows = []
    for d in sorted(glob.glob(os.path.join(repo, 'solutions', 'system_design', '*'))):
        if not os.path.isdir(d) or os.path.basename(d) == 'template':
            continue
        name = os.path.basename(d)
        dst = os.path.join(out, 'interview-questions', name)
        os.makedirs(dst, exist_ok=True)
        for f in glob.glob(os.path.join(d, '*')):
            if f.endswith('.md'):
                body = copy_images(open(f).read(), d, dst, gh)
                open(os.path.join(dst, 'README.md'), 'w').write(header(f'System Design Primer: {name.replace("_", " ")} (question and official solution)', gh + f'solutions/system_design/{name}', lic) + body)
            elif re.search(r'\.(png|jpe?g|gif)$', f):
                shutil.copy(f, dst)
            elif f.endswith('.py'):
                shutil.copy(f, dst)
        rows.append(('System design', name.replace('_', ' '), f'interview-questions/{name}/README.md'))
    for d in sorted(glob.glob(os.path.join(repo, 'solutions', 'object_oriented_design', '*'))):
        name = os.path.basename(d)
        dst = os.path.join(out, 'object-oriented-design', name)
        os.makedirs(dst, exist_ok=True)
        for f in glob.glob(os.path.join(d, '*')):
            shutil.copy(f, dst)
        nb = glob.glob(os.path.join(dst, '*.ipynb'))
        md = [header(f'System Design Primer: {name.replace("_", " ")} (object-oriented design, official solution)', gh + f'solutions/object_oriented_design/{name}', lic)]
        for n in nb:
            md.append(notebook_md(n))
        open(os.path.join(dst, 'README.md'), 'w').write('\n'.join(md))
        rows.append(('Object-oriented design', name.replace('_', ' '), f'object-oriented-design/{name}/README.md'))
    # the primer itself, with its own images
    body = copy_images(open(os.path.join(repo, 'README.md')).read(), repo, out, gh)
    open(os.path.join(out, 'primer.md'), 'w').write(header('The System Design Primer (full text)', url, lic) + body)
    w = [header('System Design Primer: interview questions with official solutions', url, lic),
         'The [full primer](primer.md) plus every interview question that comes with an official solution (diagrams included).\n',
         '| Kind | Question | Solution |', '|---|---|---|']
    for k, n, f in rows:
        w.append(f'| {k} | {n} | [open]({f}) |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(w) + '\n')
    return len(rows)


def notebook_md(path):
    import json
    nb = json.load(open(path))
    out = []
    for c in nb.get('cells', []):
        src = ''.join(c.get('source', []))
        if c.get('cell_type') == 'markdown':
            out.append(src)
        else:
            out.append('```python\n' + src + '\n```')
    return '\n\n'.join(out)


# ---------------- awesome-low-level-design ----------------
def lld():
    repo = os.path.join(SRC, 'awesome-low-level-design')
    out = os.path.join(BANK, 'Low-Level-Design', 'awesome-low-level-design')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://github.com/ashishps1/awesome-low-level-design'
    lic = 'GPL-3.0, by Ashish Pratap Singh' if 'GNU' in open(os.path.join(repo, 'LICENSE')).read()[:200] else 'see the repository licence'
    gh = url + '/blob/main/'
    probs = sorted(glob.glob(os.path.join(repo, 'problems', '*.md')))
    rows = []
    for p in probs:
        name = os.path.splitext(os.path.basename(p))[0]
        body = copy_images(open(p).read(), os.path.dirname(p), out, gh)
        # official solutions live in solutions/<lang>/<problem>/
        sol = []
        for lang in ['java', 'python', 'cpp', 'golang', 'csharp', 'typescript', 'rust']:
            roots = [os.path.join(repo, 'solutions', lang), os.path.join(repo, 'solutions', lang, 'src')]
            key = name.replace('-', '').replace('_', '').lower()
            cands = [d for r in roots for d in glob.glob(os.path.join(r, '*')) if os.path.isdir(d) and os.path.basename(d).replace('-', '').replace('_', '').lower() == key]
            for d in cands:
                files = sorted(f for f in glob.glob(os.path.join(d, '**', '*'), recursive=True) if os.path.isfile(f))
                if files:
                    sol.append((lang, d, files))
        w = [header(f'Low-level design problem: {name.replace("-", " ")}', gh + f'problems/{name}.md', lic), body, '\n---\n\n## Official solutions from the repository\n']
        if not sol:
            w.append('The repository has no solution code for this problem.\n')
        for lang, d, files in sol:
            w.append(f'<details><summary><b>{lang}</b> ({len(files)} files)</summary>\n')
            for f in files:
                ext = os.path.splitext(f)[1].lstrip('.')
                code = open(f, errors='replace').read()
                w.append(f'\n**{os.path.relpath(f, d)}**\n\n```{ext}\n{code.rstrip()}\n```\n')
            w.append('</details>\n')
        open(os.path.join(out, name + '.md'), 'w').write('\n'.join(w))
        rows.append((name, [s[0] for s in sol]))
    idx = [header('Low-level design problems with official solutions', url, lic), '| Problem | Solutions in |', '|---|---|']
    for n, langs in rows:
        idx.append(f'| [{n.replace("-", " ")}]({n}.md) | {", ".join(langs) or "—"} |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return len(rows)


# ---------------- Rustlings ----------------
def rustlings():
    repo = os.path.join(SRC, 'rustlings')
    out = os.path.join(BANK, 'Rust', 'rustlings')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://github.com/rust-lang/rustlings'
    lic = 'MIT, by the Rustlings contributors'
    rows = []
    for ex in sorted(glob.glob(os.path.join(repo, 'exercises', '*', '*.rs'))):
        rel = os.path.relpath(ex, os.path.join(repo, 'exercises'))
        sol = os.path.join(repo, 'solutions', rel)
        topic = rel.split('/')[0]
        rows.append((topic, rel, ex, sol if os.path.exists(sol) else None))
    by = {}
    for r in rows:
        by.setdefault(r[0], []).append(r)
    import tomllib
    hints = {}
    info = os.path.join(repo, 'rustlings-macros', 'info.toml')
    if os.path.exists(info):
        for e in tomllib.load(open(info, 'rb')).get('exercises', []):
            hints[e['name']] = e.get('hint', '')
    idx = [header('Rustlings: exercises with official solutions', url, lic),
           'Each topic file has every exercise, then the official solution in a collapsible block.\n', '| Topic | Exercises |', '|---|---|']
    for topic, items in by.items():
        readme = os.path.join(repo, 'exercises', topic, 'README.md')
        w = [header(f'Rustlings: {topic}', f'{url}/tree/main/exercises/{topic}', lic)]
        if os.path.exists(readme):
            w.append(open(readme).read() + '\n')
        for _, rel, ex, sol in items:
            name = os.path.splitext(os.path.basename(rel))[0]
            w.append(f'## {name}\n\n```rust\n{open(ex).read().rstrip()}\n```\n')
            if hints.get(name):
                w.append(f'<details><summary>Official hint</summary>\n\n{hints[name].strip()}\n\n</details>\n')
            if sol:
                w.append(f'<details><summary>Official solution</summary>\n\n```rust\n{open(sol).read().rstrip()}\n```\n\n</details>\n')
        open(os.path.join(out, f'{topic}.md'), 'w').write('\n'.join(w))
        idx.append(f'| [{topic}]({topic}.md) | {len(items)} |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return len(rows)


def simulator_answers(folder, hw):
    """Run the chapter's own simulator with -c on every flag set the questions list.

    The output is the simulator's answer key, printed by the official tool."""
    progs = [p for p in re.findall(r'([A-Za-z0-9_.-]+\.py)', hw) if os.path.exists(os.path.join(folder, p))]
    if not progs:
        progs = [os.path.basename(p) for p in glob.glob(os.path.join(folder, '*.py'))][:1]
    if not progs:
        return ''
    prog = progs[0]
    runs = []
    cmds = []
    for line in hw.splitlines():
        m = re.match(r'^\s*[•\-]\s+((?:\./)?(?:[A-Za-z0-9_.-]+\.py\s+)?-[^\n]*)$', line)
        if m:
            cmds.append(m.group(1).strip())
    flat = re.sub(r'-\n\s*', '-', hw)              # "-" split across a line break
    flat = re.sub(r'\s*\n\s*', ' ', flat)
    for m in re.finditer(r'((?:\./)?[A-Za-z0-9_-]+\.py)((?:\s+-{1,2}[A-Za-z][\w-]*(?:[ =](?!-)[^\s;)"\u201d\u2019]+)?)+)', flat):
        flags = m.group(2).strip().rstrip('.,')
        cmds.append(m.group(1) + ' ' + flags)
    seen = set()
    for cmd in cmds:
        if cmd in seen:
            continue
        seen.add(cmd)
        mp = re.match(r'(?:\./)?([A-Za-z0-9_.-]+\.py)\s+(.*)', cmd)
        p, flags = (mp.group(1), mp.group(2)) if mp else (prog, cmd)
        if not os.path.exists(os.path.join(folder, p)):
            continue
        args = ['python3', p] + flags.split() + (['-c'] if ' -c' not in ' ' + flags else [])
        if '?' in flags:
            continue  # the question wants you to choose these values
        try:
            r = subprocess.run(args, cwd=folder, capture_output=True, text=True, timeout=20)
        except Exception:
            continue
        outp = (r.stdout + r.stderr).strip()
        if r.returncode != 0 or 'Traceback' in outp or outp.lower().startswith('usage') or not outp:
            continue  # not a complete command (cut by the PDF line break); skip rather than show an error
        if len(outp) > 6000:
            outp = outp[:6000] + '\n... (output cut; run it yourself for the rest)'
        runs.append(f'<details><summary>Simulator answer: <code>./{p} {flags} -c</code></summary>\n\n```text\n{outp}\n```\n\n</details>\n')
    if not runs:
        return ''
    return ('### Answers printed by the official simulator\n\nFor every command the questions list, this is what `' + prog +
            '` prints with `-c` (compute the answer). Try each question first.\n\n' + '\n'.join(runs) + '\n')


# ---------------- OSTEP homework ----------------
def ostep():
    repo = os.path.join(SRC, 'ostep-homework')
    out = os.path.join(BANK, 'Operating-Systems', 'OSTEP-Homework')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://github.com/remzi-arpacidusseau/ostep-homework'
    lic = 'by Remzi and Andrea Arpaci-Dusseau'
    rows = []
    for d in sorted(glob.glob(os.path.join(repo, '*'))):
        rd = os.path.join(d, 'README.md')
        if not os.path.isdir(d) or not os.path.exists(rd):
            continue
        name = os.path.basename(d)
        dst = os.path.join(out, name)
        os.makedirs(dst, exist_ok=True)
        body = open(rd).read()
        chap = os.path.join(os.environ.get('OSTEP_PDFS', ''), name + '.pdf')
        qtext = ''
        if os.path.exists(chap):
            txt = subprocess.run(['pdftotext', '-layout', chap, '-'], capture_output=True, text=True).stdout
            k = txt.find('Homework (')
            if k < 0:
                k = txt.find('Homework')
            if k >= 0:
                hw = txt[k:]
                hw = re.sub(r'(?m)^.*(OPERATING|O PERATING|S YSTEMS|WWW\. OSTEP|\[V ERSION|T HREE|A RPACI|E ASY|P IECES|©).*$', '', hw)
                hw = re.sub(r'\f', '', hw)
                hw = re.sub(r'\n{3,}', '\n\n', hw).strip()
                for a, b in {'\ufb01': 'fi', '\ufb02': 'fl', '\ufb00': 'ff', '\ufb03': 'ffi', '\ufb04': 'ffl', '\u2019': "'"}.items():
                    hw = hw.replace(a, b)
                answers = simulator_answers(d, hw)
                qtext = ('## Homework questions from the book chapter\n\n> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/' + name +
                         '.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.\n\n```text\n' + hw + '\n```\n\n' + answers + '## The simulator (README from the homework repository)\n\n')
        for f in glob.glob(os.path.join(d, '*')):
            if os.path.isfile(f) and not f.endswith('.md'):
                shutil.copy(f, dst)
        open(os.path.join(dst, 'README.md'), 'w').write(header(f'OSTEP homework: {name}', f'{url}/tree/master/{name}', lic,
            'The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.') + qtext + body)
        rows.append(name)
    idx = [header('OSTEP homework: simulators and questions', url, lic),
           '**How the answers work:** OSTEP homework is done with the simulators (`.py` files) in each folder. Every simulator prints its own correct answer when you add `-c` (or `--compute`). That is the official answer key. The chapter questions are in the README of each folder and at the end of each chapter of the free book (<https://pages.cs.wisc.edu/~remzi/OSTEP/>).\n',
           '| Chapter homework | Folder |', '|---|---|']
    for n in rows:
        idx.append(f'| {n} | [{n}/]({n}/README.md) |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return len(rows)


# ---------------- Learn Git Branching ----------------
def lgb():
    """Needs CLONES_DIR/lgb.json, made by: cd learnGitBranching && node ../tools/learngitbranching_dump.js > ../lgb.json"""
    import json
    data = json.load(open(os.path.join(SRC, 'lgb.json')))
    out = os.path.join(BANK, 'Git', 'learn-git-branching')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://learngitbranching.js.org/'
    lic = 'MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching'
    idx = [header('Learn Git Branching: every level with its official solution', url, lic),
           'Play each level on the site (it draws the commit tree); use this page to read the lesson again or check the official solution. The solutions are the `solutionCommand` stored with each level in the game\'s source code.\n',
           '| Tab | Sequence | Levels |', '|---|---|---|']
    n = 0
    for s in data['sequences']:
        fname = s['id'] + '.md'
        w = [header(f"Learn Git Branching: {s['name']}", url, lic)]
        if s['about']:
            w.append(f"_{s['about']}_\n")
        for i, l in enumerate(s['levels'], 1):
            n += 1
            w.append(f"## {i}. {l['name']}\n")
            for d in l['dialog']:
                w.append(re.sub(r'(?m)^(#+)', r'##\1', d.strip()) + '\n')
            if l['hint']:
                w.append(f"<details><summary>Official hint</summary>\n\n{l['hint']}\n\n</details>\n")
            sol = '\n'.join(c.strip() for c in l['solution'].split(';') if c.strip())
            w.append(f"<details><summary>Official solution</summary>\n\n```bash\n{sol}\n```\n\n</details>\n")
        open(os.path.join(out, fname), 'w').write('\n'.join(w))
        idx.append(f"| {s['tab']} | [{s['name']}]({fname}) | {len(s['levels'])} |")
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return n


# ---------------- Tech Interview Handbook: behavioral ----------------
def tih():
    repo = os.path.join(SRC, 'tech-interview-handbook', 'apps', 'website', 'contents')
    out = os.path.join(BANK, 'Behavioral', 'tech-interview-handbook')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://www.techinterviewhandbook.org/'
    lic = 'MIT, by Yangshun Tay and contributors'
    files = ['behavioral-interview-questions', 'behavioral-interview', 'behavioral-interview-rubrics', 'behavioral-interview-senior-candidates', 'self-introduction', 'questions-to-ask', 'final-questions']
    idx = [header('Tech Interview Handbook: behavioral interview questions and guides', url, lic),
           'The question list has no model answers in the source: it is meant to be answered with your own stories (STAR). The other pages are the source\'s own guidance and rubrics for judging an answer.\n', '| Page |', '|---|']
    for f in files:
        src = os.path.join(repo, f + '.md')
        if not os.path.exists(src):
            continue
        body = re.sub(r'^---.*?---\n', '', open(src).read(), flags=re.S)
        body = re.sub(r'(?m)^import .*$', '', body)
        open(os.path.join(out, f + '.md'), 'w').write(header(f'Tech Interview Handbook: {f.replace("-", " ")}', url + f + '/', lic) + body)
        idx.append(f'| [{f.replace("-", " ")}]({f}.md) |')
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return len(idx) - 4


# ---------------- ML Interviews Book (Chip Huyen) ----------------
def mlbook():
    repo = os.path.join(SRC, 'ml-interviews-book')
    out = os.path.join(BANK, 'AI-and-ML', 'ml-interviews-book')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    url = 'https://huyenchip.com/ml-interviews-book/'
    lic = 'by Chip Huyen; see the repository'
    files = sorted(glob.glob(os.path.join(repo, 'contents', '*.md')), key=lambda f: [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', os.path.basename(f))])
    w = [header('Machine Learning Interviews Book (Chip Huyen): all questions', url, lic,
                'The book publishes questions only: its answers folder is empty, so there are no official answers to copy.')]
    n = 0
    for f in files:
        name = os.path.basename(f)
        if not re.match(r'[5-8]\.', name) and name not in ('0-about-the-questions.md', '0-about-the-answers.md'):
            continue
        body = open(f).read().replace('$$', '$')
        body = copy_images(body, os.path.dirname(f), out, 'https://github.com/chiphuyen/ml-interviews-book/blob/master/')
        w.append(body.strip() + '\n')
        n += len(re.findall(r'\[(?:E|M|H)\]', body))
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(w))
    return n


# ---------------- ByteByteGo System Design 101 ----------------
def sd101():
    from PIL import Image
    import io
    import urllib.request
    repo = os.path.join(SRC, 'system-design-101', 'data')
    out = os.path.join(BANK, 'System-Design', 'bytebytego-system-design-101')
    os.makedirs(os.path.join(out, 'images'), exist_ok=True)
    url = 'https://github.com/ByteByteGoHq/system-design-101'
    lic = 'CC BY-NC-ND 4.0, by ByteByteGo'
    cats = {}
    for f in sorted(glob.glob(os.path.join(repo, 'guides', '*.md'))):
        txt = open(f).read()
        fm = re.match(r'^---(.*?)---\n', txt, re.S)
        meta = fm.group(1) if fm else ''
        title = re.search(r'title:\s*["\']?(.*?)["\']?\s*$', meta, re.M)
        title = title.group(1) if title else os.path.basename(f)
        cat = re.search(r'categories:\s*\n\s*-\s*(\S+)', meta)
        cat = cat.group(1) if cat else 'other'
        body = txt[fm.end():] if fm else txt

        def local(m):
            u = m.group(2)
            name = re.sub(r'[^A-Za-z0-9._-]', '_', u.split('/')[-1])
            name = os.path.splitext(name)[0] + '.webp'
            dst = os.path.join(out, 'images', name)
            if not os.path.exists(dst):
                try:
                    raw = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()
                    im = Image.open(io.BytesIO(raw)).convert('RGB')
                    if im.width > 1000:
                        im = im.resize((1000, int(im.height * 1000 / im.width)))
                    im.save(dst, 'WEBP', quality=72)
                except Exception as e:
                    print('image failed', u, e)
                    return m.group(0)
            return f'{m.group(1)}images/{name}{m.group(3)}'
        body = re.sub(r'(!\[[^\]]*\]\()(https://assets\.bytebytego\.com/[^)\s]+)(\))', local, body)
        slug = os.path.splitext(os.path.basename(f))[0]
        cats.setdefault(cat, []).append((title, slug))
        open(os.path.join(out, slug + '.md'), 'w').write(header(f'ByteByteGo System Design 101: {title}', url, lic) + body)
    idx = [header('ByteByteGo System Design 101: every guide with its diagram', url, lic),
           'Visual explanations, not a question bank: use them to check your answers to the architecture and system design questions. Diagrams are saved here (resized to 1000 px wide).\n']
    for c, items in sorted(cats.items()):
        idx.append(f'\n## {c.replace("-", " ").title()}\n')
        idx += [f'- [{t}]({s}.md)' for t, s in sorted(items)]
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return sum(len(v) for v in cats.values())


if __name__ == '__main__':
    which = sys.argv[3:] or ['devops', 'sdp', 'lld', 'rustlings', 'ostep', 'lgb', 'tih', 'mlbook', 'sd101']
    for w in which:
        print(w, globals()[w]())
