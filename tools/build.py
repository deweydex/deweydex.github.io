"""Build the one-page site from content/ into public/index.html. Run: python3 tools/build.py
content/index.md is the introduction. content/sections/*.md are the sections, in file order.
Blocks are directives, see docs/blocks.md:  ::file{title="..." path="..."}   :::callout{type="tip"} ... :::"""
import re, html, yaml, markdown, shutil, os, pathlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT, PUBLIC = ROOT / "content", ROOT / "public"
SITE = yaml.safe_load((CONTENT / "_site.yaml").read_text())
esc = html.escape

def parse(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n?", text, re.S)
    return (yaml.safe_load(m.group(1)) or {}, text[m.end():]) if m else ({}, text)

FILES = {}  # published path -> True, for files that need a viewer page
KINDS = {"pdf":"PDF","docx":"Word","zip":"ZIP","tex":"TeX","md":"Markdown","py":"Python","html":"HTML","css":"CSS","js":"JS","txt":"Text","ipynb":"Notebook","csv":"CSV","json":"JSON"}
TEXT = {"tex","md","py","html","css","js","txt","csv","json"}
LIVE = {"html"}  # opens as a page
CURRENT = ["?"]
def fail(msg):
    raise SystemExit(f"Build stopped. {msg}")
def need(href):
    if not href.startswith("http") and not (CONTENT / href).exists():
        fail(f"{CURRENT[0]} points at a file that is not in the project: {href}")
def fsize(href):
    p = CONTENT / href
    need(href)
    n = p.stat().st_size
    return ("under 1 KB" if n < 1024 else f"{n/1024:.0f} KB") if n < 1024*1024 else f"{n/1048576:.1f} MB"
def viewer_path(href): return "view/" + href + ".html"
def file_row(title, href, note="", compact=False):
    need(href)
    ext = href.rsplit(".", 1)[-1].lower() if "." in href else ""
    kind = KINDS.get(ext, ext.upper() or "File")
    size = fsize(href) if not href.startswith("http") else ""
    meta = " &middot; ".join(x for x in [esc(note) if note else "", size] if x)
    acts = []
    if ext == "pdf":
        acts.append(f"<a class='act out' href='{esc(href)}' target='_blank' rel='noopener'>View</a>")
    elif ext in LIVE:
        acts.append(f"<a class='act out' href='{esc(href)}' target='_blank' rel='noopener'>Open</a>")
        acts.append(f"<a class='act' href='{esc(viewer_path(href))}'>View code</a>"); FILES[href] = True
    elif ext in TEXT:
        acts.append(f"<a class='act' href='{esc(viewer_path(href))}'>View</a>"); FILES[href] = True
    acts.append(f"<a class='act dl' href='{esc(href)}' download>Download</a>")
    name = f"<strong>{esc(title)}</strong>" if title else ""
    return (f"<div class='file{' compact' if compact else ''}'><span class='ext'>{esc(kind)}</span>"
            f"<div class='meta'>{name}<span class='n'>{meta}</span></div><div class='acts'>{''.join(acts)}</div></div>")

def sheet(m):
    t, pdf, tex, outline = [p.strip() for p in m.group(1).split("|")]
    return (f"<div class='sheet'><h4>{esc(t)}</h4><p>{esc(outline)}</p>"
            f"{file_row('', pdf, '', True)}{file_row('', tex, '', True)}</div>")

ATTR = re.compile(r"""([A-Za-z_][\w.-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`}]+)))?""")
def attrs_of(text):
    out = {}
    for m in ATTR.finditer(text or ""):
        v = m.group(2) if m.group(2) is not None else m.group(3) if m.group(3) is not None else m.group(4) or ""
        out[m.group(1)] = html.unescape(v)
    return out

def blocks(body):
    """Directives: ::name{key="value"} for one-line blocks, :::name{...} ... ::: for blocks with a body."""
    def leaf(m):
        name, a = m.group(1), attrs_of(m.group(2))
        g = lambda k: a.get(k, "")
        if name == "file":
            if not g("path").startswith("http"):
                return file_row(g("title"), g("path"), g("note"))
            return (f"<a class='card file' href='{esc(g('path'))}' rel='noopener' target='_blank'><span class='k'>Download</span>"
                    f"<strong>{esc(g('title'))}</strong><span class='n'>{esc(g('note'))}</span></a>")
        if name == "link":
            ext = " rel='noopener' target='_blank'" if g("url").startswith("http") else ""
            return (f"<a class='card link' href='{esc(g('url'))}'{ext}><span class='k'>Open</span>"
                    f"<strong>{esc(g('title'))}</strong><span class='n'>{esc(g('note'))}</span></a>")
        if name == "sheet":
            return (f"<div class='sheet'><h4>{esc(g('title'))}</h4><p>{esc(g('outline'))}</p>"
                    f"{file_row('', g('pdf'), '', True)}{file_row('', g('tex'), '', True)}</div>")
        if name == "pdf":
            need(g("path"))
            return (f"<figure class='pdf'><iframe src='{esc(g('path'))}' title='{esc(g('title'))}' loading='lazy'></iframe>"
                    f"<figcaption><a href='{esc(g('path'))}'>{esc(g('title'))}</a></figcaption></figure>")
        if name == "button":
            return f"<p><a class='act dl-btn' href='{esc(g('url'))}' target='_blank' rel='noopener'>{esc(g('label'))}</a></p>"
        fail(f"{CURRENT[0]} uses a block this site does not know: ::{name}")
    body = re.sub(r"^::([a-z]+)\{(.*)\}[ \t]*$", leaf, body, flags=re.M)
    # blocks with a body, innermost first so that one can hold another
    pat = re.compile(r"^(:{3,})([a-z]+)(?:\{([^\n]*)\})?[ \t]*\n((?:(?!^:{3,}[a-z]).)*?)\n\1[ \t]*$", re.M | re.S)
    def container(m):
        name, a, inner = m.group(2), attrs_of(m.group(3)), m.group(4)
        if name == "callout":
            kind = a.get("type", "note")
            if kind not in ("note", "tip", "info", "warning"): kind = "note"
            return f"<aside class='callout {kind}' markdown='1'>\n\n{inner}\n\n</aside>"
        if name == "details":
            return f"<details markdown='1'><summary>{esc(a.get('title', ''))}</summary>\n\n{inner}\n\n</details>"
        fail(f"{CURRENT[0]} uses a block this site does not know: :::{name}")
    while True:
        new_body = pat.sub(container, body)
        if new_body == body: break
        body = new_body
    return body

def render(body):
    return markdown.markdown(blocks(body), extensions=["tables", "fenced_code", "md_in_html", "attr_list", "pymdownx.arithmatex"],
                             extension_configs={"pymdownx.arithmatex": {"generic": True}})

CSS = """
:root{--ink:#1B2A4A;--accent:#C25A1E;--paper:#fbfaf7;--muted:#5f6b7a;--line:#e5e2da;--card:#fff}
@media(prefers-color-scheme:dark){:root{--ink:#e8ebf2;--accent:#f08a4b;--paper:#12182a;--muted:#a3adbd;--line:#2a3452;--card:#1a2238}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--paper);color:var(--ink);font:1.08rem/1.65 Georgia,"Times New Roman",serif}
a{color:var(--accent)}
header.top{position:sticky;top:0;z-index:10;background:var(--paper);border-bottom:1px solid var(--line)}
.wrap{max-width:46rem;margin:0 auto;padding:0 1rem}
header.top .wrap{display:flex;flex-wrap:wrap;gap:.2rem 1.2rem;align-items:baseline;padding:.7rem 1rem}
.brand{font-size:1.15rem;color:var(--ink);text-decoration:none;margin-right:auto}
nav{display:flex;flex-wrap:wrap;gap:.1rem 1.1rem}
nav a{color:var(--ink);text-decoration:none;font-size:.95rem;padding:.15rem 0;border-bottom:2px solid transparent}
nav a:hover,nav a.on{color:var(--accent);border-bottom-color:var(--accent)}
section{scroll-margin-top:5.5rem;padding-top:1rem}section+section{border-top:1px solid var(--line);margin-top:2.5rem}
h1{font-weight:normal;font-size:2.2rem;line-height:1.2;margin:2.2rem 0 .4rem}
h2{font-weight:normal;font-size:1.7rem;margin:1.2rem 0 .6rem}h3{font-weight:normal;font-size:1.35rem;margin:2rem 0 .3rem;color:var(--accent)}
h4{font-size:1.1rem;margin:1.6rem 0 .1rem}h4+p em{color:var(--muted)}
.lede{color:var(--muted);font-size:1.15rem;margin-top:0}
a.card{display:grid;gap:.1rem;background:var(--card);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:.7rem 1rem;margin:.8rem 0;color:var(--ink);text-decoration:none}
a.card .k{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}a.card .n{color:var(--muted);font-size:.95rem}
.callout{border-left:4px solid var(--accent);background:var(--card);padding:.7rem 1rem;margin:1.2rem 0;border-radius:0 6px 6px 0}
.callout::before{content:"Note";display:block;font:600 .72rem system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.callout.tip{border-left-color:#2f7d4f}.callout.tip::before{content:"Tip";color:#2f7d4f}
.callout.info{border-left-color:#2b6cb0}.callout.info::before{content:"Information";color:#2b6cb0}
.callout.warning{border-left-color:#b7791f}.callout.warning::before{content:"Warning";color:#b7791f}
.callout>p:last-child{margin-bottom:0}
a.dl-btn{background:var(--accent);color:var(--paper);min-height:2.75rem;padding:0 1.3rem}a.dl-btn::after{content:" \2197"}
details{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.1rem 1rem;margin:1rem 0}summary{cursor:pointer;min-height:2.4rem;display:flex;align-items:center;font-weight:600}
.pdf iframe{width:100%;height:32rem;border:1px solid var(--line);border-radius:6px;background:#fff}
table{border-collapse:collapse;width:100%;display:block;overflow-x:auto}td,th{border:1px solid var(--line);padding:.4rem .7rem;text-align:left}
pre{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:.8rem;overflow:auto;font-size:.88rem}img{max-width:100%;height:auto}
.sheet{border-top:1px solid var(--line);padding:.2rem 0 .6rem}.sheet h4{margin:1rem 0 .2rem}.sheet p{margin:.2rem 0}.crumb{margin:1.4rem 0 0;font-size:.95rem}
.file{display:grid;grid-template-columns:auto 1fr;gap:.2rem .8rem;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.7rem .9rem;margin:.6rem 0}
.file.compact{padding:.45rem .7rem;margin:.35rem 0}
.file .ext{grid-row:1;min-width:3.6rem;text-align:center;font:600 .72rem/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);border:1.5px solid var(--accent);border-radius:6px;padding:.45rem .3rem}
.file .meta{display:grid;min-width:0}.file .meta strong{font-weight:600}.file .n{color:var(--muted);font-size:.9rem}
.file .acts{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:.5rem}
.file.compact .acts{grid-column:3;grid-row:1}.file.compact{grid-template-columns:auto 1fr auto}
a.act,button.act{display:inline-flex;align-items:center;min-height:2.4rem;padding:0 .9rem;border:1px solid var(--accent);border-radius:999px;color:var(--accent);text-decoration:none;font:600 .88rem system-ui,sans-serif}
a.act.dl{background:var(--accent);color:var(--paper)}a.act.dl::before{content:"↓ "}a.act.out::after{content:" ↗"}
a.act:hover,a.act:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
@media(min-width:34rem){.file .acts{grid-column:3;grid-row:1}.file{grid-template-columns:auto 1fr auto}}
.src{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.9rem;overflow:auto;font:.85rem/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre;tab-size:4}
.bar{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}button.act{background:none;cursor:pointer;color:var(--accent)}
.katex-display{overflow-x:auto;overflow-y:hidden}
footer{border-top:1px solid var(--line);margin-top:4rem;padding:1.5rem 0;color:var(--muted);font-size:.9rem}
"""
JS = """
const links=[...document.querySelectorAll('nav a[href^="#"]')];
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){
    links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}});},
    {rootMargin:'-20% 0px -70% 0px'});
  links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s);});
}
"""

def prefixed(html_text, prefix):
    if not prefix: return html_text
    return re.sub(r"(href|src)=(['\"])(?!https?:|mailto:|#|/)([^'\"]*)\2", lambda m: f"{m.group(1)}={m.group(2)}{prefix}{m.group(3)}{m.group(2)}", html_text)

def shell(title, summary, inner, prefix, src="", secmap=None):
    nav = "".join(f"<a href='{prefix or ''}#{n['id']}'>{esc(n['title'])}</a>" for n in SITE["nav"])
    nav += "".join(f"<a href='{esc(x['href'])}' rel='noopener'>{esc(x['title'])} &#8599;</a>" for x in SITE.get("external", []))
    robots = "<meta name='robots' content='noindex'>" if SITE.get("noindex") else ""
    js = JS if not prefix else ""
    math = "arithmatex" in inner
    kcss = f"<link rel='stylesheet' href='{prefix}assets/katex/katex.min.css'>" if math else ""
    kjs = (f"<script src='{prefix}assets/katex/katex.min.js'></script><script src='{prefix}assets/katex/auto-render.min.js'></script>"
           "<script>document.addEventListener('DOMContentLoaded',()=>renderMathInElement(document.body,{delimiters:[{left:'\\\\[',right:'\\\\]',display:true},{left:'\\\\(',right:'\\\\)',display:false}]}));</script>") if math else ""
    import json as _json
    P = prefix + "edit/"
    edit = (f"<script>(function(){{if(!/[?&]edit(=|&|$)/.test(location.search))return;"
            f"var P={_json.dumps(P)},u=new URL(P,location.href).href,t=!1;try{{t=!!(localStorage.getItem('access_token')||localStorage.getItem('github_token'))}}catch(e){{}}"
            f"window.__edit={{src:{_json.dumps(src)},secmap:{_json.dumps(secmap or {})},shell:u}};"
            "if(!t){var m=window.__edit.secmap[location.hash.slice(1)]||window.__edit.src;location.replace(u+'?src='+encodeURIComponent(m)+'&return='+encodeURIComponent(location.href));return}"
            "var l=document.createElement('link');l.rel='stylesheet';l.href=u+'inplace.css';document.head.appendChild(l);"
            "var s=document.createElement('script');s.type='module';s.src=u+'inplace.js';document.head.appendChild(s)})();</script>") if src else ""
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
{edit}{robots}<title>{esc(title)}</title><meta name="description" content="{esc(summary)}"><style>{CSS}</style>{kcss}</head>
<body><header class="top"><div class="wrap"><a class="brand" href="{prefix or ''}#top">{esc(SITE['name'])}</a><nav>{nav}</nav></div></header>
<main class="wrap">{inner}</main>
<footer><div class="wrap">{SITE['footer']}</div></footer><script>{js}</script>{kjs}</body></html>"""

meta, intro = parse(CONTENT / "index.md")
secs = []
secmap = {}
CURRENT[0] = "content/index.md"
home_intro = render(intro)
for f in sorted((CONTENT / "sections").glob("*.md")):
    m, b = parse(f)
    if m.get("draft"): continue
    CURRENT[0] = f"content/sections/{f.name}"
    secmap[m["id"]] = CURRENT[0]
    secs.append(f"<section id='{esc(m['id'])}' data-src='{CURRENT[0]}'><h2>{esc(m['title'])}</h2>{render(b)}</section>")
home = f"<section id='top' data-src='content/index.md'><h1>{esc(meta['title'])}</h1><p class='lede'>{esc(meta.get('summary',''))}</p>{home_intro}</section>{''.join(secs)}"

for child in PUBLIC.iterdir():
    if child.name in {"old", "edit"}: continue
    shutil.rmtree(child) if child.is_dir() else child.unlink()
(PUBLIC / "index.html").write_text(shell(SITE['name'], meta.get('summary',''), home, "", "content/index.md", secmap), encoding="utf-8")

pages = 0
for f in sorted((CONTENT / "pages").glob("*.md")):
    m, b = parse(f)
    if m.get("draft"): continue
    CURRENT[0] = f"content/pages/{f.name}"
    inner = (f"<section id='top' data-src='content/pages/{f.name}'><p class='crumb'><a href='../#{esc(m.get('parent','projects'))}'>&larr; {esc(m.get('parent_title','Current Stuff'))}</a></p>"
             f"<h1>{esc(m['title'])}</h1><p class='lede'>{esc(m.get('summary',''))}</p>{prefixed(render(b), '../')}</section>")
    d = PUBLIC / m["slug"]; d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(shell(m["title"] + " | " + SITE['name'], m.get('summary',''), inner, "../", f"content/pages/{f.name}"), encoding="utf-8")
    pages += 1
if (CONTENT / "downloads").exists():
    shutil.copytree(CONTENT / "downloads", PUBLIC / "downloads")
if (CONTENT / "assets").exists():
    shutil.copytree(CONTENT / "assets", PUBLIC / "assets")
viewers = 0
for href in sorted(FILES):
    src = CONTENT / href
    if not src.exists(): continue
    text = src.read_text(encoding="utf-8", errors="replace")
    if len(text) > 400_000: continue
    depth = len(Path(viewer_path(href)).parts) - 1
    prefix = "../" * depth
    name = Path(href).name
    inner = (f"<section id='top'><p class='crumb'><a href='javascript:history.back()'>&larr; Back</a></p><h1>{esc(name)}</h1>"
             f"<div class='bar'><a class='act dl' href='{prefix}{esc(href)}' download>Download</a>"
             f"<button class='act' type='button' onclick=\"navigator.clipboard.writeText(document.getElementById('src').textContent).then(()=>{{this.textContent='Copied'}})\">Copy text</button></div>"
             f"<pre class='src' id='src'>{esc(text)}</pre></section>")
    out = PUBLIC / viewer_path(href)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(shell(name + " | " + SITE['name'], "", inner, prefix, "content/" + href), encoding="utf-8")
    viewers += 1
print(len(secs), "sections,", pages, "pages,", viewers, "viewers built")
