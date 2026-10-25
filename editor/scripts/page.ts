// Writes public/edit/index.html and edit.json beside the bundle.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const dir = new URL("../../public/edit/", import.meta.url).pathname;
const hasCss = existsSync(dir + "main.css");
writeFileSync(dir + "index.html", `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Edit the site</title>${hasCss ? '<link rel="stylesheet" href="main.css">' : ""}</head><body><div id="app"><p>Loading…</p></div><script type="module" src="main.js"></script></body></html>`);
if (!existsSync(dir + "edit.json")) {
  writeFileSync(dir + "edit.json", JSON.stringify({
    gitlab: "https://gitlab.com", projectId: 88038632, branch: "main",
    clientId: "dffbc96b2f720c7580cf9a45392db5af9efea6123e393ed7e1c103b6b813316a",
    roots: ["content"], contentRoot: "content", siteBase: "https://deweydex.gitlab.io/jsaaron/",
  }, null, 2) + "\n");
}
