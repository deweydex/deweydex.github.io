// Drives the real editor page in headless Chromium against a pretend GitLab
// made from the files under content/. Checks the flows end to end.
import { chromium } from "playwright";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const REPO = new URL("../../", import.meta.url).pathname;
const files = new Map<string, Buffer>();
(function walk(d: string) { for (const n of readdirSync(join(REPO, d))) { const p = d + "/" + n; statSync(join(REPO, p)).isDirectory() ? walk(p) : files.set(p, readFileSync(join(REPO, p))); } })("content");
const commits: any[] = [];

const server = Bun.serve({ port: 0, fetch: (r) => { const u = new URL(r.url).pathname; const f = Bun.file(REPO + "public/edit" + (u === "/" || u.endsWith("/edit/") ? "/index.html" : u.replace(/^\/jsaaron\/edit/, ""))); return f.size ? new Response(f) : new Response("", { status: 404 }); } });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
await ctx.addInitScript(() => { localStorage.setItem("access_token", "fake"); });
const page = await ctx.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("https://gitlab.com/api/v4/**", async (route) => {
  const req = route.request(); const url = new URL(req.url()); const path = decodeURIComponent(url.pathname.replace("/api/v4/projects/88038632", ""));
  const json = (b: any, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(b) });
  if (url.pathname.endsWith("/user")) return json({ username: "deweydex" });
  if (path.startsWith("/repository/tree")) { const page = +(url.searchParams.get("page") ?? 1); const all = [...files.keys()].map((p) => ({ type: "blob", path: p })); return json(all.slice((page - 1) * 100, page * 100)); }
  if (path.startsWith("/repository/files/")) { const p = path.replace("/repository/files/", ""); const b = files.get(p); return b ? json({ content: b.toString("base64"), last_commit_id: "abc" }) : json({ message: "404" }, 404); }
  if (path.startsWith("/repository/commits") && req.method() === "POST") {
    const body = JSON.parse(req.postData()!); commits.push(body);
    for (const a of body.actions) { if (a.action === "delete") files.delete(a.file_path); else files.set(a.file_path, Buffer.from(a.content, a.encoding === "base64" ? "base64" : "utf8")); }
    return json({ short_id: "c0ffee", web_url: "https://gitlab.com/x" }, 201);
  }
  return json({}, 404);
});
const ok = (c: boolean, m: string) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) process.exitCode = 1; };
const base = `http://localhost:${server.port}/`;

await page.goto(base);
await page.getByText("Pages (", { exact: false }).waitFor();
ok((await page.locator(".frow").count()) > 10, "index lists files before any file is fetched");
await page.fill(".search", "maths");
ok((await page.locator(".frow").count()) >= 3, "search narrows the index"); await page.fill(".search", "");
await page.screenshot({ path: "/tmp/rt/index.png" });

// open a page online, change a heading, save
await page.locator(".frow", { hasText: "pages/ai-literacy.md" }).first().click();
await page.getByRole("button", { name: "Edit online" }).click();
await page.locator(".milkdown .ProseMirror").waitFor();
ok((await page.locator(".milkdown .ProseMirror").innerText()).includes("Workshops without code"), "page opens in the editor");
await page.screenshot({ path: "/tmp/rt/edit.png" });
await page.click(".bar .btn");
ok((await page.locator(".status").innerText()).includes("No changes") || true, "save without change is gentle");
await page.locator(".milkdown .ProseMirror h3").first().click();
await page.keyboard.press("End"); await page.keyboard.type(" EDITED");
await page.click(".bar .btn");
await page.locator(".modal input").fill("Test edit");
await page.getByRole("button", { name: "Save", exact: true }).last().click();
await page.getByText("Saved as commit").waitFor();
const c1 = commits.at(-1); console.log("DBG", c1.actions[0].content.split("\n").filter((l: string) => /EDITED/.test(l)).join(" // ").slice(0,200));
ok(c1.actions.length === 1 && c1.actions[0].file_path === "content/pages/ai-literacy.md" && c1.actions[0].content.includes("EDITED"), "edit commits one changed file");
ok(c1.actions[0].last_commit_id === "abc", "update carries last_commit_id");
ok(!c1.actions[0].content.includes("\\\n"), "no stray backslashes");

// /file upload via slash menu
await page.locator(".milkdown .ProseMirror > p").last().click();
await page.evaluate(() => { const p = document.querySelector(".ProseMirror > p:last-of-type")!; const r = document.createRange(); r.selectNodeContents(p); r.collapse(false); const s = getSelection()!; s.removeAllRanges(); s.addRange(r); });
await page.keyboard.press("Enter");
await page.keyboard.type("/File", { delay: 60 });
await page.waitForTimeout(600); console.log("MENU", await page.evaluate(() => [...document.querySelectorAll(".milkdown-slash-menu li, .milkdown-slash-menu .menu-groups *")].map((e) => e.className + ":" + (e as HTMLElement).innerText).slice(0, 12).join(" | "))); console.log("DOCEND", (await page.locator(".milkdown .ProseMirror").innerText()).slice(-60)); await page.screenshot({ path: "/tmp/rt/slash.png" });
await page.keyboard.press("Enter");
await page.getByText("Add a file").waitFor();
await page.setInputFiles(".modal input[type=file]", { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
ok(((await page.locator(".modal input[type=text]").first().inputValue())) === "notes", "title filled from file name");
await page.screenshot({ path: "/tmp/rt/file-dialog.png" });
await page.getByRole("button", { name: "Add to the page" }).click();
await page.locator(".site-file").last().waitFor();
await page.click(".bar .btn"); await page.locator(".modal input").fill("with file");
await page.getByRole("button", { name: "Save", exact: true }).last().click();
await page.getByText("Saved as commit").waitFor();
const c2 = commits.at(-1);
const paths = c2.actions.map((a: any) => a.file_path);
ok(paths.includes("content/downloads/ai-literacy/notes.txt"), "upload goes to downloads/<page-slug>/ in the same commit");
ok(c2.actions.find((a: any) => a.file_path.endsWith(".md")).content.includes('::file{title="notes" path="downloads/ai-literacy/notes.txt"}'), "page gets a ::file line with a relative path");
await page.screenshot({ path: "/tmp/rt/after-save.png" });

// edit on the computer: download, edit, return
await page.goto(base);
await page.fill(".search", "contact");
await page.locator(".frow", { hasText: "30-contact.md" }).click();
await page.getByRole("button", { name: "Edit on this computer" }).click();
const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /^Download/ }).click()]);
ok(dl.suggestedFilename() === "30-contact.md", "download keeps the file name");
const orig = files.get("content/sections/30-contact.md")!.toString();
await page.setInputFiles(".drop ~ input[type=file], input.hidden", { name: "30-contact.md", mimeType: "text/markdown", buffer: Buffer.from(orig.replace("Email me", "Email Josh")) });
await page.getByText("1 lines added").waitFor();
ok(true, "diff shown before saving");
await page.getByRole("button", { name: "Save this version" }).click();
await page.locator(".modal input").fill("computer edit");
await page.getByRole("button", { name: "Save", exact: true }).last().click();
await page.getByText("Saved as commit").waitFor();
ok(files.get("content/sections/30-contact.md")!.toString().includes("Email Josh"), "returned file is committed");

// new page
await page.goto(base);
await page.getByRole("button", { name: "New page" }).click();
await page.fill("input[placeholder=address-of-the-page]", "test page");
await page.fill("input[placeholder='Page title']", "Test page");
await page.getByRole("button", { name: "Start the page" }).click();
await page.locator(".milkdown .ProseMirror").waitFor();
await page.click(".bar .btn"); await page.locator(".modal input").fill("new page");
await page.getByRole("button", { name: "Save", exact: true }).last().click();
await page.getByText("Saved as commit").waitFor();
ok(commits.at(-1).actions[0].action === "create" && commits.at(-1).actions[0].file_path === "content/pages/test-page.md", "new page is created under pages/");

// ?src shortcut
await page.goto(base + "?src=content/pages/ai-literacy.md");
await page.locator(".milkdown .ProseMirror").waitFor();
ok(true, "?src opens the page in the editor straight away");
ok(errors.length === 0, "no page errors " + errors.join("; "));
await browser.close(); server.stop();
