"""Make the downloadable maths worksheets (TeX and PDF) from the Markdown sources.
Usage: python3 tools/make_worksheets.py /path/to/everlearning/maths/worksheets
Removes the three header lines naming a course, an institution and an instructor, and cuts the answer key."""
import re, subprocess, sys, tempfile
from pathlib import Path

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / "content" / "downloads" / "maths"
out.mkdir(parents=True, exist_ok=True)

def clean(text):
    lines = text.split("\n")
    title = lines[0].lstrip("# ").strip()
    body = "\n".join(lines[1:])
    body = re.sub(r"\A\s*\*\*AIML Foundations Mathematics\*\*\s*\n\*\*Dublin and D.n Laoghaire ETB\*\*\s*\n\*\*Instructor: Josh Aaron\*\*\s*\n", "\n", body)
    body = re.sub(r"\A\s*---\s*\n", "\n", body)
    head, sep, tail = body.partition("\n## Answer Key")
    if sep:
        m = re.search(r"\n## (?!Answer)", tail)
        head += tail[m.start():] if m else ""
    head = re.sub(r"\n---\s*\n\s*\*End of Worksheet[^\n]*\*\s*$", "\n", head.rstrip() + "\n")
    head = re.sub(r" \$ ([+\-=]|\\cdot|\\times) \$ ", r" $\1$ ", head)
    head = re.sub(r"\$ (\+ \\cdots\$)", r"$\1", head)
    head = re.sub(r" \$ (\+ C\$)", r" $\1", head)
    head = re.sub(r"(?<=[^\s\\]) \$(?=\s|$)", "{}$", head, flags=re.M)
    head = re.sub("[\U0001F300-\U0001FAFF\u2600-\u27BF\uFE0F]", "", head)
    head = re.sub(r"\[\s*\]\(", "[](", head)
    return title, head.strip() + "\n"

for f in sorted(src.glob("worksheet_*.md")):
    title, body = clean(f.read_text(encoding="utf-8"))
    slug = f.stem.replace("worksheet_", "")
    md = out / f"{slug}.md"
    md.write_text(f"---\ntitle: \"{title}\"\n---\n\n" + body, encoding="utf-8")
    common = ["pandoc", str(md), "-V", "geometry:margin=2.2cm", "-V", "fontsize=11pt", "--pdf-engine=xelatex", "-V", "fontfamily=fontspec", "-V", "mainfont=Latin Modern Roman", "-V", "mathfont=Latin Modern Math"]
    subprocess.run(["pandoc", str(md), "-s", "-V", "geometry:margin=2.2cm", "-V", "fontsize=11pt", "-o", str(out / f"{slug}.tex")], check=True)
    subprocess.run(common + ["-o", str(out / f"{slug}.pdf")], check=True)
    md.unlink()
    print(slug, title)
