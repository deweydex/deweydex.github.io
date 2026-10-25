// One editing session on one file, used by the editor screen and by in-place editing.
import { mountCore, type Core } from "./core.ts";
import { S, full, rel } from "./ctx.ts";
import { askText, fileDialog, note } from "./dialogs.ts";
import { bytesToBase64 } from "./gitlab.ts";
import { dedupe, el, ext, slugOf } from "./util.ts";

export interface Session {
  save(): Promise<void>;
  dirty(): boolean;
  destroy(): void;
}

export interface SessionOptions {
  path: string;
  holder: HTMLElement;
  text: string;
  lastCommitId?: string;
  isNew: boolean;
  /** Short state shown beside the Save button. */
  onStatus(text: string): void;
  /** Where messages about a save go. */
  messages: HTMLElement;
  onSaving(busy: boolean): void;
}

export function pageUrl(path: string): string | null {
  const m = /^content\/pages\/(.+)\.md$/.exec(path);
  if (m) return S.cfg.siteBase + m[1] + "/";
  if (path === "content/index.md" || /^content\/sections\//.test(path)) return S.cfg.siteBase;
  return null;
}

export async function startSession(o: SessionOptions): Promise<Session> {
  let text = o.text, current = o.text, lastCommitId = o.lastCommitId, fresh = o.isNew;
  let core: Core | null = null;
  const slug = slugOf(o.path);
  const markDirty = () => o.onStatus(current === text && S.pending.size === 0 ? "No changes yet" : "Unsaved changes");

  if (ext(o.path) === "md") {
    core = await mountCore(o.holder, {
      markdown: text,
      onChange: (m) => { current = m; markDirty(); },
      pickFile: () => fileDialog(slug),
      saveImage: async (file) => { const p = dedupe(`${S.cfg.contentRoot}/downloads/${slug}/${file.name}`, new Set([...S.files, ...S.pending.keys()])); S.pending.set(p, { file }); markDirty(); return rel(p); },
      resolveImage: async (src) => {
        const p = full(src);
        const queued = S.pending.get(p); if (queued) return URL.createObjectURL(queued.file);
        if (!S.files.includes(p)) return null;
        try { const r = await S.store.read(p); return URL.createObjectURL(new Blob([r.bytes as BlobPart])); } catch { return null; }
      },
    });
  } else {
    const ta = el("textarea", { class: "plain", spellcheck: "false" }); ta.value = text;
    ta.oninput = () => { current = ta.value; markDirty(); };
    o.holder.append(ta);
  }

  async function save() {
    const body = core ? core.markdown() : current;
    const changed = body !== text;
    if (!changed && S.pending.size === 0) { o.messages.replaceChildren(note("Nothing to save.")); return; }
    const message = await askText("Describe this change", `Edit ${rel(o.path)}`);
    if (message === null) return;
    o.onSaving(true); o.messages.replaceChildren(note("Saving…"));
    try {
      const actions: import("./gitlab.ts").Action[] = [];
      if (changed) actions.push({ action: fresh && !S.files.includes(o.path) ? "create" : "update", path: o.path, text: body, lastCommitId });
      for (const [p, u] of S.pending) actions.push({ action: S.files.includes(p) ? "update" : "create", path: p, base64: bytesToBase64(new Uint8Array(await u.file.arrayBuffer())) });
      const done = await S.store.commit(message || `Edit ${rel(o.path)}`, actions);
      for (const a of actions) if (!S.files.includes(a.path)) S.files.push(a.path);
      S.pending.clear(); text = body; current = body; fresh = false;
      lastCommitId = (await S.store.read(o.path).catch(() => null))?.lastCommitId;
      o.onStatus("Saved");
      const page = pageUrl(o.path);
      o.messages.replaceChildren(note(`Saved as commit ${done.id}. The site updates in about a minute.`, "good"),
        el("p", {}, el("a", { href: done.url, target: "_blank", rel: "noopener" }, "See the change"), page ? " · " : "", page ? el("a", { href: page, target: "_blank", rel: "noopener" }, "View the page") : ""));
    } catch (e) { o.messages.replaceChildren(note(String((e as Error).message), "bad")); }
    o.onSaving(false);
  }

  return { save, dirty: () => current !== text || S.pending.size > 0, destroy: () => core?.destroy() };
}
