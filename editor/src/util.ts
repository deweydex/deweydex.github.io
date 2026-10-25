export const TEXT_EXT = new Set(["md", "tex", "py", "html", "css", "js", "txt", "csv", "json", "yaml", "yml", "svg", "ipynb"]);
export const ext = (p: string) => (p.includes(".") ? p.split(".").pop()!.toLowerCase() : "");
export const isText = (p: string) => TEXT_EXT.has(ext(p));
export const base = (p: string) => p.split("/").pop()!;

/** The slug used for an uploads folder: content/pages/x.md -> x, 10-projects.md -> projects, index.md -> home. */
export function slugOf(path: string): string {
  const stem = base(path).replace(/\.[^.]+$/, "");
  if (stem === "index") return "home";
  return stem.replace(/^\d+-/, "");
}

export function dedupe(path: string, taken: Set<string>): string {
  if (!taken.has(path)) return path;
  const dot = path.lastIndexOf(".");
  const stem = dot > path.lastIndexOf("/") ? path.slice(0, dot) : path;
  const tail = dot > path.lastIndexOf("/") ? path.slice(dot) : "";
  for (let n = 2; ; n++) if (!taken.has(`${stem}-${n}${tail}`)) return `${stem}-${n}${tail}`;
}

export interface DiffLine { kind: " " | "+" | "-"; text: string }
/** A line diff, with long unchanged runs folded. Good enough to check an edit before it is saved. */
export function lineDiff(a: string, b: string, context = 2): DiffLine[] {
  const x = a.split("\n"), y = b.split("\n");
  let s = 0;
  while (s < x.length && s < y.length && x[s] === y[s]) s++;
  let ea = x.length, eb = y.length;
  while (ea > s && eb > s && x[ea - 1] === y[eb - 1]) { ea--; eb--; }
  const mid: DiffLine[] = [];
  const A = x.slice(s, ea), B = y.slice(s, eb);
  if (A.length * B.length > 4_000_000) {
    A.forEach((t) => mid.push({ kind: "-", text: t })); B.forEach((t) => mid.push({ kind: "+", text: t }));
  } else {
    const L: number[][] = Array.from({ length: A.length + 1 }, () => new Array(B.length + 1).fill(0));
    for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) L[i]![j] = A[i] === B[j] ? L[i + 1]![j + 1]! + 1 : Math.max(L[i + 1]![j]!, L[i]![j + 1]!);
    let i = 0, j = 0;
    while (i < A.length && j < B.length) {
      if (A[i] === B[j]) { mid.push({ kind: " ", text: A[i]! }); i++; j++; }
      else if (L[i + 1]![j]! >= L[i]![j + 1]!) mid.push({ kind: "-", text: A[i++]! });
      else mid.push({ kind: "+", text: B[j++]! });
    }
    while (i < A.length) mid.push({ kind: "-", text: A[i++]! });
    while (j < B.length) mid.push({ kind: "+", text: B[j++]! });
  }
  return [...x.slice(Math.max(0, s - context), s).map((t) => ({ kind: " " as const, text: t })), ...mid,
          ...x.slice(ea, ea + context).map((t) => ({ kind: " " as const, text: t }))];
}

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, any> = {}, ...kids: (Node | string | null | false)[]): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") e.className = v; else if (k.startsWith("on")) (e as any)[k] = v; else if (v !== false && v != null) e.setAttribute(k, String(v));
  }
  for (const kid of kids) if (kid) e.append(kid);
  return e;
};
