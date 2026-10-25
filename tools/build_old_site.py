"""Render the published pages of the old Flowershow site as static HTML under public/old/.
Skips drafts, excluded files and the admin-only page. Usage: build_old_site.py SRC_DIR OUT_DIR"""
import sys, re, json, shutil, html, posixpath
from pathlib import Path
import markdown, yaml

src, out = Path(sys.argv[1]), Path(sys.argv[2])
cfg = json.loads((src / "config.json").read_text())
skip = {p.lstrip("/") for p in cfg.get("contentExclude", []) + cfg.get("contentHide", [])}

def split(text):
    m = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    if not m: return {}, text
    try: meta = yaml.safe_load(m.group(1)) or {}
    except Exception: meta = {}
    return meta, text[m.end():]

pages = {}
for f in sorted(src.rglob("*.md")):
    rel = f.relative_to(src).as_posix()
    if rel in skip: continue
    meta, body = split(f.read_text(encoding="utf-8", errors="replace"))
    if meta.get("draft") is True or meta.get("hidden") is True: continue
    slug = rel[:-3]
    slug = slug[:-6] if slug.endswith("/index") else ("" if slug == "index" else slug)
    pages[rel] = (slug, meta, body)

shutil.rmtree(out, ignore_errors=True)
base = "/old/"
def url(slug): return base + (slug + "/" if slug else "")

def fix_links(body, rel):
    def sub(m):
        text, target = m.group(1), m.group(2)
        if re.match(r"^(https?:|mailto:|#)", target): return m.group(0)
        path, _, frag = target.partition("#")
        if path.endswith(".md"):
            t = posixpath.normpath(posixpath.join(posixpath.dirname(rel), path))
            if t in pages:
                return f"[{text}]({url(pages[t][0])}{'#'+frag if frag else ''})"
            return text
        return m.group(0)
    body = re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", sub, body)
    body = re.sub(r"!\[\[[^\]]*\]\]", "", body)
    return re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", lambda m: m.group(2) or m.group(1), body)

nav = "".join(f'<li><a href="{url(s)}">{html.escape(str(m.get("title") or s.split("/")[-1].replace("-"," ") or "Home"))}</a></li>'
              for s, m, _ in sorted(pages.values(), key=lambda p: p[0]) if s.count("/") <= 0 and s)
TPL = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>{title} (archive)</title><style>
body{{margin:0;background:#fbfaf7;color:#1B2A4A;font-family:Georgia,serif;line-height:1.6}}
main{{max-width:44rem;margin:0 auto;padding:1.5rem 1rem 4rem}}a{{color:#D4692A}}
.banner{{background:#1B2A4A;color:#fff;padding:.6rem 1rem;font-size:.9rem}}.banner a{{color:#fff}}
nav ul{{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.4rem 1rem}}
table{{border-collapse:collapse}}td,th{{border:1px solid #ddd;padding:.3rem .6rem}}img{{max-width:100%}}pre{{overflow:auto;background:#fff;padding:.7rem;border:1px solid #e5e2da}}
</style></head><body><div class="banner">Archive of the previous site. It is no longer updated. <a href="/">Go to the current site</a></div>
<main><nav><ul><li><a href="{base}">Archive home</a></li>{nav}</ul></nav><h1>{title}</h1>{content}</main></body></html>"""

for rel, (slug, meta, body) in pages.items():
    title = str(meta.get("title") or slug.split("/")[-1].replace("-", " ").title() or "Archive home")
    content = markdown.markdown(fix_links(body, rel), extensions=["tables", "fenced_code", "toc"])
    d = out / slug; d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(TPL.format(title=html.escape(title), content=content, base=base, nav=nav), encoding="utf-8")
for f in src.rglob("*"):
    if f.is_file() and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".svg", ".pdf"}:
        t = out / f.relative_to(src); t.parent.mkdir(parents=True, exist_ok=True); shutil.copy(f, t)
print(len(pages), "pages written")
