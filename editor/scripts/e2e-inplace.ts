// ?edit on a published page edits the page itself. Runs against the built site
// in public/ and a pretend GitLab, at phone width.
import { chromium } from "playwright";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const REPO = new URL("../../", import.meta.url).pathname;
const files = new Map<string, Buffer>();
(function walk(d: string) { for (const n of readdirSync(join(REPO, d))) { const p = d + "/" + n; statSync(join(REPO, p)).isDirectory() ? walk(p) : files.set(p, readFileSync(join(REPO, p))); } })("content");
const commits: any[] = [];
const server = Bun.serve({ port: 0, fetch: (r) => { let u = decodeURIComponent(new URL(r.url).pathname); if (u.endsWith("/")) u += "index.html"; const f = join(REPO, "public", u); return existsSync(f) && statSync(f).isFile() ? new Response(Bun.file(f)) : new Response("", { status: 404 }); } });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
await ctx.addInitScript(() => { if (!localStorage.getItem("skip")) localStorage.setItem("access_token", "fake"); });
const page = await ctx.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("https://gitlab.com/api/v4/**", async (route) => {
  const req = route.request(); const url = new URL(req.url()); const path = decodeURIComponent(url.pathname.replace("/api/v4/projects/88038632", ""));
  const json = (b: any, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(b) });
  if (url.pathname.endsWith("/user")) return json({ username: "deweydex" });
  if (path.startsWith("/repository/tree")) return json([...files.keys()].map((p) => ({ type: "blob", path: p })));
  if (path.startsWith("/repository/files/")) { const b = files.get(path.replace("/repository/files/", "")); return b ? json({ content: b.toString("base64"), last_commit_id: "abc" }) : json({}, 404); }
  if (path.startsWith("/repository/commits") && req.method() === "POST") { const body = JSON.parse(req.postData()!); commits.push(body); for (const a of body.actions) files.set(a.file_path, Buffer.from(a.content, a.encoding === "base64" ? "base64" : "utf8")); return json({ short_id: "c0ffee", web_url: "https://gitlab.com/x" }, 201); }
  return json({}, 404);
});
const ok = (c: boolean, m: string) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
const base = `http://localhost:${server.port}/`;

await page.goto(base + "ai-literacy/");
const plainTitle = await page.locator("h1").first().innerText();
await page.goto(base + "ai-literacy/?edit");
await page.locator(".inplace-editor .ProseMirror").waitFor();
ok(page.url().includes("/ai-literacy/"), "stays on the page's own address");
ok(await page.locator("header.top").isVisible(), "the site's own header is still there");
ok((await page.locator("#top > p.lede").count()) === 1 && !(await page.locator("#top > p.lede").isVisible()), "the rendered text is replaced by the editor");
ok((await page.locator(".inplace-editor .ProseMirror").innerText()).includes("Workshops without code"), "the editor holds the page's source");
const ff = await page.locator(".inplace-editor .ProseMirror p").first().evaluate((e) => getComputedStyle(e).fontFamily);
ok(/Georgia/.test(ff), "text uses the site's own font: " + ff);
await page.screenshot({ path: "/tmp/rt/inplace.png" });
await page.locator(".inplace-editor .ProseMirror h3").first().click();
await page.keyboard.type("X");
await page.getByRole("button", { name: "Save", exact: true }).first().click();
await page.locator(".modal input").fill("in place");
await page.locator(".modal").getByRole("button", { name: "Save" }).click();
await page.getByText("Saved as commit").waitFor();
ok(commits.at(-1).actions[0].file_path === "content/pages/ai-literacy.md" && commits.at(-1).actions[0].content.includes("X"), "saving commits the page's file");

// a section of the front page
await page.goto(base + "?edit#about");
await page.locator(".inplace-editor .ProseMirror").waitFor();
ok((await page.locator(".inplace-bar strong").innerText()).includes("sections/20-about.md"), "?edit#about opens the About section");
ok((await page.locator("section#top").locator("h1").isVisible()), "the rest of the front page stays as published");

// not signed in goes to the editor screen to sign in, then comes back
await page.evaluate(() => { localStorage.setItem("skip", "1"); localStorage.removeItem("access_token"); });
await page.goto(base + "maths-worksheets/?edit");
await page.waitForURL(/\/edit\/\?src=content%2Fpages%2Fmaths-worksheets.md&return=/);
ok(true, "without a sign-in, ?edit goes to the sign-in screen with a way back");
ok(errors.length === 0, "no page errors " + errors.join("; "));
await browser.close(); server.stop();
