// GitHub access from the browser with a fine-grained token that the person
// pastes in once. GitHub has no sign-in flow that works without a server,
// so the token is the sign-in. It is kept in this browser only.

import type { Action, Config, Store } from "./gitlab.ts";

const KEY = "github_token";
const mem = {
  get: () => { try { return localStorage.getItem(KEY); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(KEY, v); } catch { /* private window */ } },
  del: () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } },
};

const utf8 = (s: string) => new TextEncoder().encode(s);
const toBase64 = (b: Uint8Array) => { let s = ""; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
const fromBase64 = (b64: string) => { const bin = atob(b64.replace(/\n/g, "")); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; };

export class GitHub implements Store {
  kind = "github" as const;
  constructor(public cfg: Config) {}
  get signedIn() { return !!mem.get(); }
  async signIn() { /* the token is entered on the page */ }
  async finishSignIn() { return false; }

  /** Checks a pasted token and keeps it if it works. */
  async useToken(token: string): Promise<string | null> {
    mem.set(token.trim());
    const who = await this.user();
    if (!who) mem.del();
    return who;
  }
  async signOut() { mem.del(); }

  private async api(path: string, init: RequestInit = {}): Promise<Response> {
    return fetch(`https://api.github.com${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${mem.get()}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers || {}) },
    });
  }
  private get repo() { return this.cfg.repo!; }

  async user() { const r = await this.api("/user"); return r.ok ? (await r.json()).login : null; }

  private async head(): Promise<{ commit: string; tree: string }> {
    const ref = await this.api(`/repos/${this.repo}/git/ref/heads/${this.cfg.branch}`);
    if (!ref.ok) throw new Error(`Could not read the ${this.cfg.branch} branch (${ref.status}). Check that the token covers this repository.`);
    const commit = (await ref.json()).object.sha as string;
    const c = await this.api(`/repos/${this.repo}/git/commits/${commit}`);
    return { commit, tree: (await c.json()).tree.sha };
  }
  private async fullTree(tree: string): Promise<{ path: string; type: string; sha: string }[]> {
    const r = await this.api(`/repos/${this.repo}/git/trees/${tree}?recursive=1`);
    if (!r.ok) throw new Error(`Could not list the files (${r.status}).`);
    return (await r.json()).tree;
  }

  async tree(): Promise<string[]> {
    const { tree } = await this.head();
    const roots = this.cfg.roots.map((r) => (r === "." ? "" : r.replace(/\/?$/, "/")));
    return (await this.fullTree(tree)).filter((e) => e.type === "blob" && roots.some((r) => e.path.startsWith(r))).map((e) => e.path).sort();
  }

  async read(path: string): Promise<{ bytes: Uint8Array; lastCommitId: string }> {
    const r = await this.api(`/repos/${this.repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${this.cfg.branch}`);
    if (!r.ok) throw new Error(`Could not read ${path} (${r.status}).`);
    const j = await r.json();
    if (j.content && j.encoding === "base64") return { bytes: fromBase64(j.content), lastCommitId: j.sha };
    const b = await this.api(`/repos/${this.repo}/git/blobs/${j.sha}`);
    if (!b.ok) throw new Error(`Could not read ${path} (${b.status}).`);
    return { bytes: fromBase64((await b.json()).content), lastCommitId: j.sha };
  }

  async commit(message: string, actions: Action[]): Promise<{ id: string; url: string }> {
    const head = await this.head();
    const current = new Map((await this.fullTree(head.tree)).map((e) => [e.path, e.sha]));
    for (const a of actions) if (a.lastCommitId && a.action !== "create" && current.get(a.path) !== a.lastCommitId) {
      throw new Error("The file changed on GitHub after you opened it. Reload it and make the change again, or bring your copy back through “On this computer”.");
    }
    const entries: unknown[] = [];
    for (const a of actions) {
      if (a.action === "delete") { entries.push({ path: a.path, mode: "100644", type: "blob", sha: null }); continue; }
      const content = a.base64 ?? toBase64(utf8(a.text ?? ""));
      const b = await this.api(`/repos/${this.repo}/git/blobs`, { method: "POST", body: JSON.stringify({ content, encoding: "base64" }) });
      if (!b.ok) throw new Error(`Save failed while storing ${a.path} (${b.status}).`);
      entries.push({ path: a.path, mode: "100644", type: "blob", sha: (await b.json()).sha });
    }
    const t = await this.api(`/repos/${this.repo}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: head.tree, tree: entries }) });
    if (!t.ok) throw new Error(`Save failed (${t.status}): ${await t.text()}`);
    const c = await this.api(`/repos/${this.repo}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: (await t.json()).sha, parents: [head.commit] }) });
    if (!c.ok) throw new Error(`Save failed (${c.status}): ${await c.text()}`);
    const cj = await c.json();
    const u = await this.api(`/repos/${this.repo}/git/refs/heads/${this.cfg.branch}`, { method: "PATCH", body: JSON.stringify({ sha: cj.sha, force: false }) });
    if (!u.ok) throw new Error("Someone saved to this repository while you were saving. Try again.");
    return { id: cj.sha.slice(0, 7), url: cj.html_url };
  }
}
