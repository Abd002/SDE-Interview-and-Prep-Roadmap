#!/usr/bin/env python3
"""Copy question pages from the web into the Practice Bank, with their answers.

Usage: build_web.py WEB_DIR BANK_DIR [source ...]

WEB_DIR holds the saved HTML pages (see the fetch commands in the README of
each output folder). Every page keeps the source's own questions, answers and
images; a header says where it came from. Nothing is answered here.
"""
import hashlib
import os
import re
import shutil
import subprocess
import sys
import urllib.request

from bs4 import BeautifulSoup
from markdownify import markdownify

WEB, BANK = sys.argv[1], sys.argv[2]
UA = {'User-Agent': 'Mozilla/5.0'}


def header(title, url, extra=''):
    return (f'# {title}\n\n> Copied from <{url}>. Questions and answers are the source\'s own; nothing was answered '
            f'or rewritten here.{(" " + extra) if extra else ""}\n\n')


def fetch_image(url, img_dir, rel):
    os.makedirs(img_dir, exist_ok=True)
    ext = os.path.splitext(url.split('?')[0])[1].lower()
    if ext not in ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'):
        ext = '.png'
    name = hashlib.sha1(url.encode()).hexdigest()[:12] + ext
    dst = os.path.join(img_dir, name)
    if not os.path.exists(dst):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
            if len(data) > 1_500_000 and ext in ('.png', '.jpg', '.jpeg'):
                from PIL import Image
                import io
                im = Image.open(io.BytesIO(data)).convert('RGB')
                if im.width > 1000:
                    im = im.resize((1000, int(im.height * 1000 / im.width)))
                name = os.path.splitext(name)[0] + '.webp'
                dst = os.path.join(img_dir, name)
                im.save(dst, 'WEBP', quality=75)
            else:
                open(dst, 'wb').write(data)
        except Exception as e:
            print('image failed', url, e)
            return url
    return f'{rel}/{name}'


def localise_images(soup, base_url, img_dir, rel):
    for img in soup.find_all('img'):
        src = img.get('data-src') or img.get('data-lazy-src') or img.get('src') or ''
        if not src or src.startswith('data:'):
            img.decompose()
            continue
        src = urllib.request.urljoin(base_url, src)
        img['src'] = fetch_image(src, img_dir, rel)
        for a in ('srcset', 'data-src', 'data-lazy-src', 'sizes', 'width', 'height', 'loading', 'class', 'style'):
            if a in img.attrs:
                del img[a]


def to_md(soup):
    md = markdownify(str(soup), heading_style='ATX', code_language='', bullets='-')
    md = re.sub(r'\n{3,}', '\n\n', md).replace('****', '**')
    return md.strip() + '\n'


# ---------------- GeeksforGeeks interview questions ----------------
GFG = [
    ('sql-interview-questions', 'https://www.geeksforgeeks.org/sql/sql-interview-questions/', 'Databases', 'SQL interview questions'),
    ('operating-systems-interview-questions', 'https://www.geeksforgeeks.org/operating-systems/operating-systems-interview-questions/', 'Operating-Systems', 'Operating systems interview questions'),
    ('networking-interview-questions', 'https://www.geeksforgeeks.org/blogs/networking-interview-questions/', 'Networking', 'Networking interview questions'),
    ('cpp-interview-questions', 'https://www.geeksforgeeks.org/cpp/cpp-interview-questions/', 'Cpp', 'C++ interview questions'),
]


def gfg():
    n = 0
    for slug, url, area, title in GFG:
        src = os.path.join(WEB, f'gfg_{slug}.html')
        if not os.path.exists(src):
            continue
        soup = BeautifulSoup(open(src).read(), 'html.parser')
        body = soup.select_one('div.article--viewer_content') or soup.select_one('div.text')
        for bad in body.select('script, style, .article-meta, .improve, .share, .ad, [id*=AP_], .header-main__wrapper, button'):
            bad.decompose()
        out = os.path.join(BANK, area, 'GeeksforGeeks')
        os.makedirs(out, exist_ok=True)
        localise_images(body, url, os.path.join(out, 'images'), 'images')
        md = to_md(body)
        open(os.path.join(out, f'{slug}.md'), 'w').write(header(f'GeeksforGeeks: {title}', url, 'Each answer is written right under its question, as on the site.') + md)
        n += len(re.findall(r'(?m)^#{2,4} ', md))
    return n


# ---------------- learncpp.com chapter quizzes ----------------
def learncpp():
    out = os.path.join(BANK, 'Cpp', 'learncpp-chapter-quizzes')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    pages = sorted(os.listdir(os.path.join(WEB, 'learncpp')), key=lambda f: (len(f), f))
    idx = [header('learncpp.com: every chapter summary and quiz, with the official solutions', 'https://www.learncpp.com/'),
           'Each chapter page has the summary, then the quiz; every official solution is in a collapsible block under its question.\n',
           '| Chapter | Quiz questions |', '|---|---|']
    total = 0
    for f in pages:
        ch = f[2:-5]
        url = f'https://www.learncpp.com/cpp-tutorial/chapter-{ch}-summary-and-quiz/'
        soup = BeautifulSoup(open(os.path.join(WEB, 'learncpp', f)).read(), 'html.parser')
        body = soup.select_one('div.entry-content')
        title = soup.select_one('h1')
        title = title.get_text(' ', strip=True) if title else f'Chapter {ch} summary and quiz'
        for bad in body.select('script, style, .code-block-blocker, .prevnext, .cpp-note-ad, ins, .addtoany_share_save_container, .ezoic-adpicker-ad, [id^=ezoic], .wp-block-buttons'):
            bad.decompose()
        # solutions: a "Show Solution" link followed by a hidden div.wpsolution
        nq = 0
        for sol in body.select('.wpsolution'):
            nq += 1
            start = soup.new_tag('p')
            start.string = 'QQDETAILSSTARTQQ'
            end = soup.new_tag('p')
            end.string = 'QQDETAILSENDQQ'
            sol.insert_before(start)
            sol.insert_after(end)
            sol.unwrap()
        for a in body.select('.solution_link_show, .solution_link_hide'):
            a.decompose()
        localise_images(body, url, os.path.join(out, 'images'), 'images')
        md = to_md(body)
        md = re.sub(r'(?m)^(Question #\d+)\s*$', r'### \1', md)
        md = md.replace('QQDETAILSSTARTQQ', '<details><summary>Official solution</summary>\n').replace('QQDETAILSENDQQ', '</details>')
        name = f'chapter-{ch}.md'
        open(os.path.join(out, name), 'w').write(header(f'learncpp.com: {title}', url) + md)
        idx.append(f'| [{title}]({name}) | {nq} |')
        total += nq
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return total


# ---------------- PostgreSQL Exercises (pgexercises.com) ----------------
def get(url, cache):
    if os.path.exists(cache):
        return open(cache).read()
    import time
    time.sleep(0.5)
    data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read().decode('utf-8', 'replace')
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    open(cache, 'w').write(data)
    return data


def pgexercises():
    out = os.path.join(BANK, 'Databases', 'pgexercises')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    base = 'https://pgexercises.com/'
    cats = ['basic', 'joins', 'updates', 'aggregates', 'date', 'string', 'recursive']
    # the schema diagram every exercise refers to
    fetch_image(base + 'img/schema-horizontal.svg', os.path.join(out, 'images'), 'images')
    schema = 'images/' + hashlib.sha1((base + 'img/schema-horizontal.svg').encode()).hexdigest()[:12] + '.svg'
    idx = [header('PostgreSQL Exercises: every exercise with its official answer and discussion', base,
                  'Expected results and the schema diagram are included. Run the queries yourself on the site or on the downloadable database.'),
           f'![Database schema]({schema})\n', '| Category | Exercises |', '|---|---|']
    total = 0
    for c in cats:
        cat_url = f'{base}questions/{c}/'
        cat_html = get(cat_url, os.path.join(WEB, 'pgex', c, 'index.html'))
        first = re.findall(r'href="([a-z0-9]+\.html)"', cat_html)
        first = [f for f in first if f not in ('about.html', 'gettingstarted.html', 'options.html')]
        if not first:
            continue
        seen = []
        cur = first[0]
        w = [header(f'PostgreSQL Exercises: {c}', cat_url), f'Schema: ![Database schema]({schema})\n']
        while cur and cur not in seen:
            seen.append(cur)
            url = cat_url + cur
            soup = BeautifulSoup(get(url, os.path.join(WEB, 'pgex', c, cur)), 'html.parser')
            title = soup.select_one('section#typography h1 span').get_text(strip=True)
            qdiv = soup.select_one('section#typography div.span8')
            qtext = to_md(qdiv).replace('### Question', '').strip()
            exp = soup.select_one('#exprestable')
            exp_md = to_md(exp) if exp else ''
            hint = soup.select_one('#hint')
            ans = soup.select_one('#querydiv')
            disc = soup.select_one('div.answerdiv:not(pre)')
            w.append(f'## {len(seen)}. {title}\n\n{qtext}\n')
            if exp_md:
                w.append(f'<details><summary>Expected results</summary>\n\n{exp_md}\n</details>\n')
            if hint and hint.get_text(strip=True):
                w.append(f'<details><summary>Official hint</summary>\n\n{to_md(hint)}\n</details>\n')
            if ans:
                w.append(f'<details><summary>Official answer and discussion</summary>\n\n```sql\n{ans.get_text().strip()}\n```\n\n{to_md(disc) if disc else ""}\n</details>\n')
            nxt = None
            for a in soup.find_all('a', href=True):
                if a.get_text(strip=True) == 'Next Exercise' and re.match(r'^[a-z0-9]+\.html$', a['href']):
                    nxt = a['href']
                    break
            cur = nxt
        open(os.path.join(out, f'{c}.md'), 'w').write('\n'.join(w))
        idx.append(f'| [{c}]({c}.md) | {len(seen)} |')
        total += len(seen)
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return total


# ---------------- PortSwigger Web Security Academy labs ----------------
def portswigger():
    """Needs WEB_DIR/ps/labs/*.html: every /web-security/**/lab-* URL from https://portswigger.net/sitemap.xml"""
    import glob
    out = os.path.join(BANK, 'Security', 'portswigger-labs')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    topics = {}
    for f in sorted(glob.glob(os.path.join(WEB, 'ps', 'labs', '*.html'))):
        rel = os.path.basename(f)[:-5].split('__')
        url = 'https://portswigger.net/web-security/' + '/'.join(rel)
        soup = BeautifulSoup(open(f).read(), 'html.parser')
        h1 = soup.select_one('h1')
        if not h1:
            continue
        sec = h1.find_parent('div')
        while sec and not sec.select('.component-solution'):
            sec = sec.find_parent()
        if not sec:
            continue
        level = soup.select_one('.label-apprentice-search, .label-practitioner-search, .label-expert-search, [class*=label-apprentice], [class*=label-practitioner], [class*=label-expert]')
        level = level.get_text(strip=True) if level else ''
        parts = []
        for ch in sec.find_all(recursive=False):
            if ch is h1 or ch.name in ('script', 'style'):
                continue
            if 'component-solution' in (ch.get('class') or []):
                summ = ch.find('summary')
                label = summ.get_text(' ', strip=True) if summ else 'Solution'
                if summ:
                    summ.decompose()
                localise_images(ch, url, os.path.join(out, 'images'), 'images')
                for v in ch.select('iframe'):
                    v.replace_with(soup.new_string(v.get('src', '')))
                body = to_md(ch)
                body = re.sub(r'https://www\.youtube\.com/embed/([\w\\-]+)\?\S*', lambda m: 'https://www.youtube.com/watch?v=' + m.group(1).replace('\\', ''), body)
                parts.append(f'<details><summary>{"Official solution" if label == "Solution" else label}</summary>\n\n{body}\n</details>\n')
            else:
                if ch.select('.container-columns') or 'container-columns' in (ch.get('class') or []):
                    lv = ch.get_text(' ', strip=True)
                    if lv:
                        level = level or lv[:40]
                    continue
                localise_images(ch, url, os.path.join(out, 'images'), 'images')
                parts.append(to_md(ch))
        topic = rel[0]
        title = h1.get_text(' ', strip=True).replace('Lab: ', '')
        topics.setdefault(topic, []).append((title, level, url, '\n'.join(p for p in parts if p.strip())))
    idx = [header('PortSwigger Web Security Academy: every lab with its official solution', 'https://portswigger.net/web-security/all-labs',
                  'You still need the live lab on the site to practise (free account); this page is for reading the task and checking the official solution afterwards.'),
           '| Topic | Labs |', '|---|---|']
    n = 0
    for t, labs in sorted(topics.items()):
        w = [header(f'PortSwigger labs: {t.replace("-", " ")}', f'https://portswigger.net/web-security/{t}')]
        for i, (title, level, url, body) in enumerate(labs, 1):
            w.append(f'## {i}. {title}\n\n[Open the lab]({url}){(" · " + level) if level else ""}\n\n{body}\n')
        open(os.path.join(out, f'{t}.md'), 'w').write('\n'.join(w))
        idx.append(f'| [{t.replace("-", " ")}]({t}.md) | {len(labs)} |')
        n += len(labs)
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return n


# ---------------- Hello Interview system design breakdowns ----------------
def hellointerview():
    """Needs WEB_DIR/hi/<slug>.html for every breakdown linked from the overview page."""
    import glob
    out = os.path.join(BANK, 'System-Design', 'hello-interview-breakdowns')
    if os.path.isdir(out):
        shutil.rmtree(out)
    os.makedirs(out)
    base = 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/'
    free, premium = [], []
    for f in sorted(glob.glob(os.path.join(WEB, 'hi', '*.html'))):
        slug = os.path.basename(f)[:-5]
        if slug == 'ov':
            continue
        soup = BeautifulSoup(open(f).read(), 'html.parser')
        art = soup.select_one('article') or soup.select_one('main')
        title = soup.select_one('h1')
        title = title.get_text(' ', strip=True) if title else slug
        if len(art.get_text(' ', strip=True)) < 20000:
            premium.append((title, slug))
            continue
        for h in art.find_all(['h2']):
            if h.get_text(strip=True) == 'Comments':
                for sib in list(h.find_all_next()):
                    if art in sib.parents:
                        sib.decompose()
                h.decompose()
                break
        for bad in art.select('script, style, button, nav, [class*=paywall], [class*=Ad]'):
            bad.decompose()
        localise_images(art, base + slug, os.path.join(out, 'images'), 'images')
        md = to_md(art)
        k = md.find('\n# ')
        if k >= 0:
            md = md[k + 1:]
        md = re.sub(r'(###### Watch Video Walkthrough\s+Watch the author walk through the problem step-by-step\s*)+', '', md)
        md = re.sub(r'(?m)^# .*\n', '', md, count=1)
        open(os.path.join(out, slug + '.md'), 'w').write(header(f'Hello Interview: {title}', base + slug,
             'This is a worked answer: the problem, requirements, design and deep dives, written by Hello Interview.') + md)
        free.append((title, slug))
    idx = [header('Hello Interview: system design problem breakdowns (free ones)', base + 'overview'),
           'Each breakdown is a full worked answer with diagrams. Try the problem yourself first (45 minutes, out loud), then read it.\n',
           '## Copied here (free on the site)\n'] + [f'- [{t}]({s}.md)' for t, s in free] + \
          ['\n## Premium on the site (not copied)\n', 'These need a Hello Interview Premium subscription, so only the links are here:\n'] + \
          [f'- [{t}]({base + s})' for t, s in premium]
    open(os.path.join(out, 'README.md'), 'w').write('\n'.join(idx) + '\n')
    return len(free)


if __name__ == '__main__':
    for w in (sys.argv[3:] or ['gfg', 'learncpp', 'pgexercises', 'portswigger', 'hellointerview']):
        print(w, globals()[w]())
