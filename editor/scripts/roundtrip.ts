// Opens every file under content/ in the real editor core (in headless
// Chromium) and saves it. Passes when saving twice gives the same text
// (normalised once, then byte identical) and the blocks are unchanged.
import { chromium } from "playwright";
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../content/", import.meta.url).pathname;
const fix = process.argv.includes("--write");
function walk(d: string): string[] {
  return readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? (n === "assets" || n === "downloads" ? [] : walk(p)) : p.endsWith(".md") ? [p] : []; });
}
const build = await Bun.build({ entrypoints: [new URL("../src/rt.ts", import.meta.url).pathname], outdir: "/tmp/rt", minify: false });
await Bun.write("/tmp/rt/index.html", "<!doctype html><meta charset=utf-8><link rel=stylesheet href=rt.css><body><script type=module src=rt.js></script></body>");
if (!build.success) { console.error(build.logs); process.exit(1); }
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERR", e.message)); const server = Bun.serve({ port: 0, fetch: (r) => { const u = new URL(r.url).pathname; return new Response(Bun.file("/tmp/rt" + (u === "/" ? "/index.html" : u))); } });
await page.goto(`http://localhost:${server.port}/`);
await page.waitForFunction(() => typeof (window as any).rt === "function");
let bad = 0, same = 0, changed = 0;
for (const f of [...walk(ROOT), ...walk(new URL("../fixtures/", import.meta.url).pathname)]) {
  const src = readFileSync(f, "utf8");
  const one = await page.evaluate((m) => (window as any).rt(m), src) as string;
  const two = await page.evaluate((m) => (window as any).rt(m), one) as string;
  const blocks = (s: string) => s.split("\n").filter((l) => /^:{2,}/.test(l)).join("\n");
  const rel = f.startsWith(ROOT) ? f.slice(ROOT.length) : "fixtures/" + f.split("/").pop();
  if (one !== two) { bad++; console.log("NOT IDEMPOTENT", rel); }
  else if (blocks(src) !== blocks(one)) { bad++; console.log("BLOCKS CHANGED", rel); }
  else if (one === src) same++;
  else { changed++; console.log("normalised", rel); mkdirSync("/tmp/rt/out", { recursive: true }); writeFileSync("/tmp/rt/out/" + rel.replace(/\//g, "__"), one); if (fix) writeFileSync(f, one); }
}
await browser.close(); server.stop();
console.log(`${same} identical, ${changed} normalised once, ${bad} failures`);
process.exit(bad ? 1 : 0);
