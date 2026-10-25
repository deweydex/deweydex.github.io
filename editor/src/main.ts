import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./style.css";
import "./shell.css";
import { S, full, rel } from "./ctx.ts";
import { button, askText, fileDialog, modal, note } from "./dialogs.ts";
import { GitLab, bytesToBase64, session, type Action, type Config, type Store } from "./gitlab.ts";
import { GitHub } from "./github.ts";
import { loadConfig, makeStore } from "./store.ts";
import { pageUrl, startSession, type Session } from "./session.ts";
import { base, dedupe, el, ext, isText, lineDiff, slugOf } from "./util.ts";

const app = document.getElementById("app")!;
let current: Session | null = null;
function show(...kids: (Node | string)[]) { current?.destroy(); current = null; app.replaceChildren(...kids.map((k) => (typeof k === "string" ? document.createTextNode(k) : k))); window.scrollTo(0, 0); }
// ---------- sign in ----------
function signInScreen(message = "") {
  if (S.store.kind === "github") {
    const token = el("input", { type: "password", class: "search", placeholder: "Paste the token here", autocomplete: "off" });
    const go = button("Use this token", async () => {
      go.disabled = true;
      const who = await (S.store as GitHub).useToken(token.value);
      if (who) return void (await start());
      signInScreen("GitHub did not accept that token. Check that it is for this repository and allows Contents: read and write.");
    }, "primary");
    return show(el("h1", {}, "Edit the site"), el("p", { class: "lede" }, "GitHub needs a token, because it has no sign-in that works without a server. The token stays in this browser only."),
      message ? note(message, "bad") : "",
      el("ol", {}, el("li", {}, "Open ", el("a", { href: "https://github.com/settings/personal-access-tokens/new", target: "_blank", rel: "noopener" }, "the GitHub page for a new fine-grained token"), "."),
        el("li", {}, `Under Repository access, choose Only select repositories, and pick ${S.cfg.repo}.`),
        el("li", {}, "Under Permissions, set Contents to Read and write."),
        el("li", {}, "Create the token, copy it and paste it below.")),
      token, go);
  }
  show(el("h1", {}, "Edit the site"), el("p", { class: "lede" }, "Sign in with GitLab to see the files in this project and change them."), message ? note(message, "bad") : "", button("Sign in with GitLab", () => void S.store.signIn(), "primary"));
}

// ---------- the index ----------
async function indexScreen(flash = "") {
  show(el("h1", {}, "Edit the site"), note("Reading the list of files…"));
  try { S.files = await S.store.tree(); } catch (e) { return show(el("h1", {}, "Edit the site"), note(String((e as Error).message), "bad"), button("Try again", () => void indexScreen())); }
  const search = el("input", { type: "search", placeholder: "Search files", "aria-label": "Search files", class: "search" });
  const list = el("div", { class: "files" });
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const shown = S.files.filter((f) => !q || f.toLowerCase().includes(q));
    const pages = shown.filter((f) => /^content\/(pages|sections)\/.+\.md$|^content\/index\.md$/.test(f));
    const others = shown.filter((f) => !pages.includes(f));
    list.replaceChildren(
      el("h2", {}, `Pages (${pages.length})`), ...pages.map(row),
      el("h2", {}, `Other S.files (${others.length})`), ...others.slice(0, 200).map(row),
      others.length > 200 ? note(`${others.length - 200} more. Type in the search box to narrow the list.`) : "");
  };
  const row = (f: string) => el("button", { class: "frow", type: "button", onclick: () => chooseMode(f) }, el("span", { class: "ext" }, ext(f) || "file"), el("span", { class: "fname" }, rel(f)));
  search.oninput = draw;
  const actions = el("div", { class: "row" }, button("New page", () => newPage(), "primary"), button("Upload a file", () => uploadScreen()), button("Sign out", async () => { await S.store.signOut(); signInScreen("Signed out."); }));
  show(el("h1", {}, "Edit the site"), flash ? note(flash, "good") : "", actions, search, list);
  draw();
}

// ---------- choosing how to edit ----------
// ---------- editing online ----------
async function editOnline(path: string, fresh?: string) {
  show(el("h1", {}, rel(path)), note(fresh === undefined ? "Opening…" : "Starting a new file…"));
  let text = fresh ?? "", lastCommitId: string | undefined;
  if (fresh === undefined) {
    try { const r = await S.store.read(path); text = new TextDecoder().decode(r.bytes); lastCommitId = r.lastCommitId; }
    catch (e) { return show(el("h1", {}, rel(path)), note(String((e as Error).message), "bad"), button("Back", () => void indexScreen())); }
  }
  const holder = el("div", { class: "editor" });
  const status = el("span", { class: "status" }, "No changes yet");
  const msg = el("div", {});
  const save = button("Save", () => void current?.save(), "primary");
  show(el("p", { class: "crumb" }, el("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); if (!current?.dirty() || confirm("Leave without saving?")) void indexScreen(); } }, "← All files")),
    el("div", { class: "bar" }, el("strong", {}, rel(path)), status, save), msg, holder);
  current = await startSession({ path, holder, text, lastCommitId, isNew: fresh !== undefined, onStatus: (t) => { status.textContent = t; }, messages: msg, onSaving: (b) => { save.disabled = b; } });
}

function chooseMode(path: string, auto = false) {
  const text = isText(path);
  const online = text ? button("Edit online", () => void editOnline(path), "primary") : null;
  const computer = button("Edit on this computer", () => computerScreen(path), text ? "" : "primary");
  const del = button("Delete…", () => void deleteScreen(path), "quiet");
  show(el("p", { class: "crumb" }, el("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); void indexScreen(); } }, "← All files")), el("h1", {}, rel(path)),
    text ? note("Online opens the file here. On this computer gives you the file to open in your own program and takes it back afterwards.") : note("This type of file cannot be edited in the browser. Download it, change it, and bring the new copy back."),
    el("div", { class: "row" }, ...(online ? [online] : []), computer, del));
  if (auto && online) void editOnline(path);
}


// ---------- editing on the computer ----------
function computerScreen(path: string) {
  const result = el("div", {});
  const pick = el("input", { type: "file", class: "hidden", onchange: () => { if (pick.files?.[0]) void received(pick.files[0]); } });
  const drop = el("div", { class: "drop", tabindex: 0 }, "Drop the edited file here, or choose it", el("br"), button("Choose the edited file", () => pick.click()));
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); };
  drop.ondragleave = () => drop.classList.remove("over");
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("over"); const f = e.dataTransfer?.files[0]; if (f) void received(f); };

  async function received(file: File) {
    result.replaceChildren(note("Comparing with the file on GitLab…"));
    let remote: { bytes: Uint8Array; lastCommitId: string };
    try { remote = await S.store.read(path); } catch (e) { result.replaceChildren(note(String((e as Error).message), "bad")); return; }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const parts: Node[] = [];
    if (file.name !== base(path)) parts.push(note(`The file is called ${file.name}, and the one on GitLab is called ${base(path)}. It will be saved under the GitLab name.`, "warn"));
    if (isText(path)) {
      const before = new TextDecoder().decode(remote.bytes), after = new TextDecoder().decode(bytes);
      if (before === after) { result.replaceChildren(note("This copy is identical to the file on GitLab. Nothing to save.")); return; }
      const diff = lineDiff(before, after).slice(0, 400);
      const added = diff.filter((l) => l.kind === "+").length, removed = diff.filter((l) => l.kind === "-").length;
      parts.push(note(`${added} lines added, ${removed} lines removed.`), el("pre", { class: "diff" }, ...diff.map((l) => el("div", { class: "d" + (l.kind === "+" ? " add" : l.kind === "-" ? " del" : "") }, l.kind + " " + l.text))));
    } else parts.push(note(`Replaces the ${base(path)} on GitLab (${remote.bytes.length} bytes) with this copy (${bytes.length} bytes).`));
    const go = button("Save this version", async () => {
      const message = await askText("Describe this change", `Edit ${rel(path)} on the computer`); if (message === null) return;
      go.disabled = true;
      try {
        const done = await S.store.commit(message, [{ action: "update", path, ...(isText(path) ? { text: new TextDecoder().decode(bytes) } : { base64: bytesToBase64(bytes) }), lastCommitId: remote.lastCommitId }]);
        result.replaceChildren(note(`Saved as commit ${done.id}. The site updates in about a minute.`, "good"), el("p", {}, el("a", { href: done.url, target: "_blank", rel: "noopener" }, "See the change on GitLab")));
      } catch (e) { result.replaceChildren(note(String((e as Error).message), "bad")); }
    }, "primary");
    result.replaceChildren(...parts, go);
  }

  const dl = button("Download " + base(path), async () => {
    try { const r = await S.store.read(path); const url = URL.createObjectURL(new Blob([r.bytes as BlobPart])); const a = el("a", { href: url, download: base(path) }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
    catch (e) { result.replaceChildren(note(String((e as Error).message), "bad")); }
  }, "primary");
  show(el("p", { class: "crumb" }, el("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); chooseMode(path); } }, "← Back")), el("h1", {}, rel(path)),
    el("h2", {}, "1. Get the file"), dl, el("h2", {}, "2. Edit it in your own program"),
    el("p", {}, "Make your changes and save the file. This page can be closed and opened again later, even on another day."),
    el("h2", {}, "3. Bring it back"), drop, pick, result);
}

// ---------- new page, new file, upload, delete ----------
function newPage() {
  const slug = el("input", { type: "text", class: "search", placeholder: "address-of-the-page" });
  const title = el("input", { type: "text", class: "search", placeholder: "Page title" });
  const summary = el("input", { type: "text", class: "search", placeholder: "One sentence under the title" });
  const msg = el("div", {});
  const go = button("Start the page", () => {
    const s = slug.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!s || !title.value.trim()) { msg.replaceChildren(note("Give the page an address and a title.", "bad")); return; }
    const path = `${S.cfg.contentRoot}/pages/${s}.md`;
    if (S.files.includes(path)) { msg.replaceChildren(note("A page with that address exists already.", "bad")); return; }
    const fm = `---\nslug: ${s}\ntitle: ${title.value.trim()}\nsummary: ${summary.value.trim()}\nparent: projects\ndraft: true\n---\n`;
    void editOnline(path, fm + "\nWrite the page here.\n");
  }, "primary");
  show(el("p", { class: "crumb" }, el("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); void indexScreen(); } }, "← All files")), el("h1", {}, "New page"),
    el("p", {}, "A new page starts as a draft, so the site does not show it until you remove the draft line from its front matter."), el("label", {}, "Address", slug), el("label", {}, "Title", title), el("label", {}, "Summary", summary), go, msg);
}

function uploadScreen() {
  const dest = el("input", { type: "text", class: "search", value: `${S.cfg.contentRoot}/downloads/` });
  const pick = el("input", { type: "file", multiple: "multiple" });
  const msg = el("div", {});
  const go = button("Upload", async () => {
    const list = Array.from(pick.files ?? []); if (!list.length) { msg.replaceChildren(note("Choose a file first.", "bad")); return; }
    const folder = dest.value.trim().replace(/\/?$/, "/");
    const taken = new Set(S.files);
    const actions: Action[] = [];
    for (const f of list) {
      const p = folder + f.name;
      let target = p, action: "create" | "update" = "create";
      if (taken.has(p)) { if (confirm(`${f.name} exists already. OK replaces it. Cancel keeps both.`)) action = "update"; else target = dedupe(p, taken); }
      actions.push({ action, path: target, base64: bytesToBase64(new Uint8Array(await f.arrayBuffer())) }); taken.add(target);
    }
    try { const done = await S.store.commit(`Upload ${list.map((f) => f.name).join(", ")}`, actions); await indexScreen(`Uploaded as commit ${done.id}.`); }
    catch (e) { msg.replaceChildren(note(String((e as Error).message), "bad")); }
  }, "primary");
  show(el("p", { class: "crumb" }, el("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); void indexScreen(); } }, "← All files")), el("h1", {}, "Upload a file"),
    note("Anything you upload is public once the site updates.", "warn"), el("label", {}, "Folder", dest), pick, go, msg);
}

async function deleteScreen(path: string) {
  show(el("h1", {}, "Delete " + rel(path)), note("Checking which pages use it…"));
  const name = base(path), users: string[] = [];
  for (const f of S.files.filter((x) => x.endsWith(".md"))) {
    try { const r = await S.store.read(f); if (new TextDecoder().decode(r.bytes).includes(rel(path))) users.push(f); } catch { /* skip */ }
  }
  const go = button("Delete it", async () => {
    try { const done = await S.store.commit(`Delete ${rel(path)}`, [{ action: "delete", path }]); await indexScreen(`Deleted as commit ${done.id}.`); }
    catch (e) { show(el("h1", {}, "Delete failed"), note(String((e as Error).message), "bad")); }
  }, "danger");
  show(el("h1", {}, "Delete " + name),
    users.length ? note(`These pages still use it, and the site build will stop until they are changed: ${users.map(rel).join(", ")}`, "bad") : note("No page uses this file."),
    el("div", { class: "row" }, go, button("Cancel", () => chooseMode(path))));
}

// ---------- boot ----------
async function start() {
  const who = await S.store.user();
  if (!who) { await S.store.signOut(); return signInScreen("Your sign-in has expired. Sign in again."); }
  const back = session.get("return");
  if (back) { session.del("return"); location.replace(back); return; }
  const t = session.get("target");
  if (t) {
    session.del("target");
    history.replaceState(null, "", location.pathname);
    S.files = await S.store.tree().catch(() => []);
    if (S.files.includes(t)) return chooseMode(t, true);
  }
  await indexScreen();
}

async function boot() {
  S.cfg = await loadConfig("edit.json");
  S.store = makeStore(S.cfg);
  const q = new URLSearchParams(location.search);
  if (q.get("src")) session.set("target", q.get("src")!);
  if (q.get("return")) session.set("return", q.get("return")!);
  try { await S.store.finishSignIn(); } catch (e) { return signInScreen((e as Error).message); }
  if (!S.store.signedIn) return signInScreen();
  await start();
}
boot().catch((e) => show(el("h1", {}, "Edit the site"), note(String(e?.message ?? e), "bad")));
