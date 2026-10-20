#!/usr/bin/env python3
"""Turn an exam or homework PDF into Markdown, keeping its figures.

Usage: pdf2md.py IN.pdf OUT.md FIG_DIR [--title TITLE] [--source URL]

- Text is copied from the PDF as it is (nothing is answered or rewritten).
- Checkboxes become ☐ (empty) and ☒ (ticked), so ticked answers in a
  solution PDF stay visible.
- Figures (vector drawings such as trees, tables and diagrams, and embedded
  images) are cut out of the page as PNG files and placed where they appear.
  Text inside a figure is left to the image, so it isn't printed twice.
- Scanned pages (no text layer) are kept as one image of the whole page.
"""
import os
import re
import sys

import pymupdf

DPI = 120
# Symbol glyphs that stand for checkboxes or bubbles in LaTeX exam classes.
SYMBOLS = {
    ('LASY10', '2'): '☐', ('MSAM10', '■'): '☒', ('MSAM10', '□'): '☐',
    ('LASY10', '3'): '◇',
}


def sym(font, ch):
    base = font.split('+')[-1]
    for (f, c), out in SYMBOLS.items():
        if base.startswith(f) and ch == c:
            return out
    if 'Dingbat' in base or 'ZapfDingbats' in base:
        return {'❍': '◯', 'm': '◯', 'l': '●', 'o': '☐', 'n': '■', '4': '✓', '8': '✗'}.get(ch, ch)
    return None


MD_SPECIAL = re.compile(r'([\\`*_\[\]<>|])')


LIGATURES = {'\u200b': '', '\ufeff': '', '\ufb00': 'ff', '\ufb01': 'fi', '\ufb02': 'fl', '\ufb03': 'ffi', '\ufb04': 'ffl'}


def esc(t):
    for a, b in LIGATURES.items():
        t = t.replace(a, b)
    t = MD_SPECIAL.sub(r'\\\1', t)
    return t


def esc_line_start(t):
    # stop "# x", "- x", "+ x", "1. x" and "> x" at the start of a line from
    # turning into Markdown structure
    m = re.match(r'^(\d+)([.)])(\s)', t)
    if m:
        return m.group(1) + '\\' + t[len(m.group(1)):]
    if re.match(r'^(#+\s|[-+]\s)', t):
        return '\\' + t
    return t


def figure_rects(page):
    """Rectangles of figures on the page (vector drawing clusters and images)."""
    W, H = page.rect.width, page.rect.height
    rects = []
    try:
        drawings = page.get_drawings()
    except Exception:
        drawings = []
    try:
        clusters = page.cluster_drawings(drawings=drawings, x_tolerance=6, y_tolerance=6)
    except Exception:
        clusters = []
    for r in clusters:
        if r.width < 25 or r.height < 18:
            continue
        if r.width > 0.95 * W and r.height > 0.9 * H:
            continue  # page frame
        items = [d for d in drawings if d['rect'].intersects(r) and r.contains(d['rect'])]
        n_items = sum(len(d['items']) for d in items)
        kinds = {it[0] for d in items for it in d['items']}
        boxlike = kinds <= {'re', 'qu'} and n_items <= 2
        if boxlike:
            continue  # a single frame around text, e.g. a solution box or answer box
        if n_items < 3 and 'c' not in kinds:
            continue
        rects.append(r)
    for info in page.get_image_info():
        r = pymupdf.Rect(info['bbox']) & page.rect
        if r.width >= 20 and r.height >= 15:
            rects.append(r)
    # merge overlapping rectangles
    merged = True
    while merged:
        merged = False
        out = []
        for r in rects:
            for i, o in enumerate(out):
                if (r + (-4, -4, 4, 4)).intersects(o):
                    out[i] = o | r
                    merged = True
                    break
            else:
                out.append(pymupdf.Rect(r))
        rects = out
    return [r + (-3, -3, 3, 3) & page.rect for r in rects]


def page_lines(page):
    d = page.get_text('dict')
    lines = []
    for b in d['blocks']:
        for l in b.get('lines', []):
            spans = [s for s in l['spans'] if s['text'].strip() or s['text'] == ' ']
            if not spans:
                continue
            lines.append((pymupdf.Rect(l['bbox']), spans))
    return lines


def render_line(spans):
    out = []
    for s in spans:
        t = s['text']
        font = s['font']
        mapped = sym(font, t.strip()) if len(t.strip()) == 1 else None
        if mapped:
            out.append(mapped + ' ')
            continue
        t = esc(t)
        bold = s['flags'] & 16 or 'Bold' in font or 'Medi' in font or 'CMBX' in font
        mono = any(k in font for k in ('Mono', 'CMTT', 'Courier', 'Inconsolata', 'Menlo'))
        if mono and t.strip():
            t = t.replace('\\', '')  # inside code spans nothing needs escaping
            core = t.strip()
            fence = '``' if '`' in core else '`'
            t = t[:len(t) - len(t.lstrip())] + fence + core + fence + t[len(t.rstrip()):]
        elif bold and t.strip():
            core = t.strip()
            t = t[:len(t) - len(t.lstrip())] + '**' + core + '**' + t[len(t.rstrip()):]
        out.append(t)
    s = ''.join(out)
    s = s.replace('****', '').replace('** **', ' ')
    return s.rstrip()


def convert(pdf, md_out, fig_dir, title=None, source=None):
    doc = pymupdf.open(pdf)
    os.makedirs(fig_dir, exist_ok=True)
    rel = os.path.relpath(fig_dir, os.path.dirname(md_out))
    stem = os.path.splitext(os.path.basename(md_out))[0]
    w = []
    if title:
        w.append(f'# {title}\n')
    if source:
        w.append(f'> Copied from the original: <{source}>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.\n')
    nfig = 0
    for pno, page in enumerate(doc, 1):
        w.append(f'\n---\n\n<a id="page-{pno}"></a>\n**Page {pno}**\n')
        text_chars = len(page.get_text('text').strip())
        if text_chars < 40:
            pix = page.get_pixmap(dpi=100)
            if pix.width * pix.height > 0:
                name = f'{stem}-p{pno:02d}-page.png'
                pix.save(os.path.join(fig_dir, name))
                w.append(f'\n![Page {pno} (scanned)]({rel}/{name})\n')
                nfig += 1
            continue
        figs = figure_rects(page)
        elems = []
        for r in figs:
            elems.append((r.y0, 'fig', r))
        left = min((r.x0 for r, _ in page_lines(page)), default=page.rect.x0)
        for r, spans in page_lines(page):
            c = pymupdf.Point((r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2)
            if any(f.contains(c) for f in figs):
                continue
            elems.append((r.y0, 'txt', (r, spans)))
        elems.sort(key=lambda e: (round(e[0]), e[1]))
        para = []
        last_y = None
        merged_lines = []
        # merge spans that sit on the same baseline (PyMuPDF can split them)
        for y, kind, payload in elems:
            if kind == 'txt' and merged_lines and merged_lines[-1][1] == 'txt' and abs(merged_lines[-1][2][0].y0 - payload[0].y0) < 2:
                pr, ps = merged_lines[-1][2]
                spans = ps + [{'text': '   ', 'font': '', 'flags': 0}] + payload[1] if payload[0].x0 > pr.x1 + 1 else payload[1] + ps
                merged_lines[-1] = (y, 'txt', (pr | payload[0], spans))
            else:
                merged_lines.append((y, kind, payload))
        for y, kind, payload in merged_lines:
            if kind == 'fig':
                if para:
                    w.append('<br>\n'.join(para) + '\n')
                    para = []
                nfig += 1
                name = f'{stem}-p{pno:02d}-fig{nfig:02d}.png'
                page.get_pixmap(dpi=DPI, clip=payload).save(os.path.join(fig_dir, name))
                w.append(f'\n![Figure on page {pno}]({rel}/{name})\n')
                last_y = payload.y1
                continue
            r, spans = payload
            text = render_line(spans)
            if not text.strip():
                continue
            if last_y is not None and r.y0 - last_y > 1.2 * max(r.height, 8) and para:
                w.append('<br>\n'.join(para) + '\n')
                para = []
            indent = int(max(0, r.x0 - left) // 14)
            text = esc_line_start(text.strip())
            if re.match(r'^(\*\*)?(Question|Problem|Part)\s+\d+', text):
                if para:
                    w.append('<br>\n'.join(para) + '\n')
                    para = []
                w.append(f'\n### {text}\n')
            else:
                para.append('&emsp;' * min(indent, 8) + text)
            last_y = r.y1
        if para:
            w.append('<br>\n'.join(para) + '\n')
    open(md_out, 'w').write('\n'.join(w) + '\n')
    return doc.page_count, nfig


if __name__ == '__main__':
    a = sys.argv[1:]
    title = a[a.index('--title') + 1] if '--title' in a else None
    source = a[a.index('--source') + 1] if '--source' in a else None
    print(convert(a[0], a[1], a[2], title, source))
