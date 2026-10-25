// In-place editing. Adding ?edit to a published page replaces the part of
// the page that comes from one source file with the editor, on the page
// itself, in the page's own type and layout.
import "@milkdown/crepe/theme/common/style.css";
import "./style.css";
import "./inplace.css";
import { S } from "./ctx.ts";
import { button, note } from "./dialogs.ts";
import { startSession } from "./session.ts";
import { loadConfig, makeStore } from "./store.ts";
import { el, ext } from "./util.ts";

interface Hint { src: string; secmap?: Record<string, string>; shell: string }

async function run() {
  if (document.readyState === "loading") await new Promise((r) => document.addEventListener("DOMContentLoaded", r, { once: true }));
  const hint = (window as any).__edit as Hint;
  const here = new URL(".", import.meta.url).href;
  const sourcePath = (hint.secmap && hint.secmap[location.hash.slice(1)]) || hint.src;
  const leave = () => { const u = new URL(location.href); u.searchParams.delete("edit"); location.href = u.toString(); };
  const toShell = () => { location.replace(`${hint.shell}?src=${encodeURIComponent(sourcePath)}&return=${encodeURIComponent(location.href)}`); };

  S.cfg = await loadConfig(here + "edit.json");
  S.store = makeStore(S.cfg);
  if (!S.store.signedIn || ext(sourcePath) !== "md") return toShell();
  const target = document.querySelector<HTMLElement>(`[data-src="${CSS.escape(sourcePath)}"]`);
  if (!target) return toShell();
  if (!(await S.store.user())) return toShell();

  S.files = await S.store.tree().catch(() => []);
  let text: string, lastCommitId: string | undefined;
  try { const r = await S.store.read(sourcePath); text = new TextDecoder().decode(r.bytes); lastCommitId = r.lastCommitId; }
  catch (e) { return toShell(); }

  // The editor takes the place of what the file produced; the rest of the page stays.
  const holder = el("div", { class: "inplace-editor" });
  target.classList.add("inplace-target");
  for (const child of Array.from(target.children)) (child as HTMLElement).hidden = true;
  target.append(holder);

  const status = el("span", { class: "status" }, "No changes yet");
  const msg = el("div", { class: "inplace-msg" });
  const save = button("Save", () => void sess.save(), "primary");
  const close = button("Close", () => { if (!sess.dirty() || confirm("Leave without saving?")) leave(); });
  const full = el("a", { href: `${hint.shell}?src=${encodeURIComponent(sourcePath)}`, class: "inplace-link" }, "All files");
  const bar = el("div", { class: "inplace-bar" }, msg, el("div", { class: "inplace-row" }, el("strong", {}, sourcePath.replace(/^content\//, "")), status, full, close, save));
  document.body.append(bar);

  const sess = await startSession({
    path: sourcePath, holder, text, lastCommitId, isNew: false,
    onStatus: (t) => { status.textContent = t; }, messages: msg, onSaving: (b) => { (save as HTMLButtonElement).disabled = b; },
  });
  holder.scrollIntoView({ block: "start" });
}

run().catch((e) => { const m = el("div", { class: "inplace-bar" }, note(String(e?.message ?? e), "bad")); document.body.append(m); });
