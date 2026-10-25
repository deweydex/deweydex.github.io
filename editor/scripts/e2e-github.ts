// The editor against a pretend GitHub: token entry, index, edit, save through the Git Data API.
import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const REPO = new URL("../../", import.meta.url).pathname;
const files = new Map<string, Buffer>();
(function walk(d: string) { for (const n of readdirSync(join(REPO, d))) { const p = d + "/" + n; statSync(join(REPO, p)).isDirectory() ? walk(p) : files.set(p, readFileSync(join(REPO, p))); } })("content");
const sha = (b: Buffer) => createHash("sha1").update(b).digest("hex");
const blobs = new Map<string, Buffer>();
const commits: { message: string; paths: string[] }[] = [];
let head = "c1";

const CFG = { host: "github", repo: "deweydex/deweydex.github.io", branch: "main", gitlab: "", projectId: 0, clientId: "", roots: ["content"], contentRoot: "content", siteBase: "https://deweydex.github.io/" };
const server = Bun.serve({ port: 0, fetch: (r) => { const u = new URL(r.url).pathname; if (u.endsWith("edit.json")) return Response.json(CFG); const f = Bun.file(REPO + "public/edit" + (u === "/" ? "/index.html" : u)); return f.size ? new Response(f) : new Response("", { status: 404 }); } });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("https://api.github.com/**", async (route) => {
  const req = route.request(); const url = new URL(req.url()); const p = url.pathname.replace("/repos/deweydex/deweydex.github.io", "");
  const auth = req.headers()["authorization"];
  const json = (b: any, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(b) });
  if (auth !== "Bearer good-token") return json({ message: "Bad credentials" }, 401);
  if (url.pathname === "/user") return json({ login: "deweydex" });
  if (p === "/git/ref/heads/main") return json({ object: { sha: head } });
  if (p.startsWith("/git/commits/") && req.method() === "GET") return json({ tree: { sha: "t-" + head } });
  if (p.startsWith("/git/trees/")) return json({ tree: [...files].map(([path, b]) => ({ path, type: "blob", sha: sha(b) })) });
  if (p.startsWith("/contents/")) { const b = files.get(decodeURIComponent(p.replace("/contents/", ""))); return b ? json({ content: b.toString("base64"), encoding: "base64", sha: sha(b) }) : json({}, 404); }
  if (p === "/git/blobs") { const b = Buffer.from(JSON.parse(req.postData()!).content, "base64"); blobs.set(sha(b), b); return json({ sha: sha(b) }, 201); }
  if (p === "/git/trees" && req.method() === "POST") {
    const { tree } = JSON.parse(req.postData()!); const paths: string[] = [];
    for (const e of tree) { if (e.sha === null) files.delete(e.path); else files.set(e.path, blobs.get(e.sha)!); paths.push(e.path); }
    commits.push({ message: "", paths }); return json({ sha: "t2" }, 201);
  }
  if (p === "/git/commits" && req.method() === "POST") { commits.at(-1)!.message = JSON.parse(req.postData()!).message; return json({ sha: "c2abcdef", html_url: "https://github.com/x" }, 201); }
  if (p === "/git/refs/heads/main") { head = "c2"; return json({}); }
  return json({}, 404);
});
const ok = (c: boolean, m: string) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
await page.goto(`http://localhost:${server.port}/`);
await page.getByText("GitHub needs a token").waitFor();
await page.fill("input[type=password]", "wrong");
await page.getByRole("button", { name: "Use this token" }).click();
await page.getByText("did not accept that token").waitFor();
ok(true, "a wrong token is refused with a plain message");
await page.fill("input[type=password]", "good-token");
await page.getByRole("button", { name: "Use this token" }).click();
await page.getByText("Pages (").waitFor();
ok((await page.locator(".frow").count()) > 10, "index lists the repository's files");
await page.fill(".search", "ai-literacy");
await page.locator(".frow").first().click();
await page.getByRole("button", { name: "Edit online" }).click();
await page.locator(".milkdown .ProseMirror").waitFor();
await page.locator(".milkdown .ProseMirror h3").first().click();
await page.keyboard.type("Z");
await page.click(".bar .btn");
await page.locator(".modal input").fill("github edit");
await page.getByRole("button", { name: "Save", exact: true }).last().click();
await page.getByText("Saved as commit").waitFor();
ok(commits.at(-1)!.paths.join() === "content/pages/ai-literacy.md" && commits.at(-1)!.message === "github edit", "one commit with the one changed file");
ok(files.get("content/pages/ai-literacy.md")!.toString().includes("Z"), "the new text is in the repository");
ok(errors.length === 0, "no page errors " + errors.join("; "));
await browser.close(); server.stop();
