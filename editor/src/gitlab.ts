// GitLab access from the browser. No server: sign-in is OAuth with PKCE,
// and every call goes straight to the GitLab API as the signed-in person.

export interface Config {
  host?: "gitlab" | "github";   // default gitlab
  repo?: string;        // github: owner/name
  gitlab: string;       // https://gitlab.com
  projectId: number;
  branch: string;
  clientId: string;     // public by design
  roots: string[];      // folders shown in the index, e.g. ["content"]
  siteBase: string;     // where the published site lives
  contentRoot: string;  // folder that block paths are relative to
}

const mem = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private window */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const tmp = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k: string) => { try { sessionStorage.removeItem(k); } catch { /* ignore */ } },
};
export { tmp as session };

const b64url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes as ArrayBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));

/** What the editor needs from a repository host. */
export interface Store {
  kind: "gitlab" | "github";
  cfg: Config;
  signedIn: boolean;
  signIn(): Promise<void>;
  finishSignIn(): Promise<boolean>;
  signOut(): Promise<void>;
  user(): Promise<string | null>;
  tree(): Promise<string[]>;
  read(path: string): Promise<{ bytes: Uint8Array; lastCommitId: string }>;
  commit(message: string, actions: Action[]): Promise<{ id: string; url: string }>;
}

export class GitLab implements Store {
  kind = "gitlab" as const;
  constructor(public cfg: Config) {}
  get redirect() { return location.origin + location.pathname; }
  get signedIn() { return !!mem.get("access_token"); }

  async signIn(): Promise<void> {
    const verifier = random(48), state = random(16);
    tmp.set("pkce_verifier", verifier); tmp.set("oauth_state", state);
    const challenge = b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
    const p = new URLSearchParams({
      client_id: this.cfg.clientId, redirect_uri: this.redirect, response_type: "code", scope: "api",
      state, code_challenge: challenge, code_challenge_method: "S256",
    });
    location.href = `${this.cfg.gitlab}/oauth/authorize?${p}`;
  }

  /** Call on load. Returns true when a sign-in was just completed. */
  async finishSignIn(): Promise<boolean> {
    const q = new URLSearchParams(location.search);
    const code = q.get("code");
    if (!code) return false;
    const state = q.get("state");
    const back = new URLSearchParams(location.search); back.delete("code"); back.delete("state");
    history.replaceState(null, "", this.redirect + (back.toString() ? "?" + back : ""));
    if (state !== tmp.get("oauth_state")) throw new Error("Sign-in stopped: the state check failed. Try again.");
    const res = await fetch(`${this.cfg.gitlab}/oauth/token`, {
      method: "POST",
      body: new URLSearchParams({ client_id: this.cfg.clientId, code, grant_type: "authorization_code", redirect_uri: this.redirect, code_verifier: tmp.get("pkce_verifier") || "" }),
    });
    const data = await res.json().catch(() => ({}));
    tmp.del("pkce_verifier"); tmp.del("oauth_state");
    if (!res.ok || !data.access_token) throw new Error(`GitLab refused the sign-in (${res.status}).`);
    mem.set("access_token", data.access_token);
    if (data.refresh_token) mem.set("refresh_token", data.refresh_token);
    return true;
  }

  private async refresh(): Promise<boolean> {
    const rt = mem.get("refresh_token");
    if (!rt) return false;
    const res = await fetch(`${this.cfg.gitlab}/oauth/token`, {
      method: "POST",
      body: new URLSearchParams({ client_id: this.cfg.clientId, refresh_token: rt, grant_type: "refresh_token", redirect_uri: this.redirect }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) { mem.del("access_token"); mem.del("refresh_token"); return false; }
    mem.set("access_token", data.access_token);
    if (data.refresh_token) mem.set("refresh_token", data.refresh_token);
    return true;
  }

  async signOut(): Promise<void> {
    const token = mem.get("access_token");
    if (token) await fetch(`${this.cfg.gitlab}/oauth/revoke`, { method: "POST", body: new URLSearchParams({ client_id: this.cfg.clientId, token }) }).catch(() => {});
    mem.del("access_token"); mem.del("refresh_token");
  }

  async api(path: string, init: RequestInit = {}): Promise<Response> {
    const go = () => fetch(`${this.cfg.gitlab}/api/v4${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${mem.get("access_token")}`, ...(init.body && typeof init.body === "string" ? { "Content-Type": "application/json" } : {}), ...(init.headers || {}) },
    });
    let res = await go();
    if (res.status === 401 && (await this.refresh())) res = await go();
    return res;
  }

  private proj(p: string) { return `/projects/${this.cfg.projectId}${p}`; }
  private enc(path: string) { return encodeURIComponent(path); }

  async user(): Promise<string | null> {
    const r = await this.api("/user");
    return r.ok ? (await r.json()).username : null;
  }

  /** Every file path under the configured roots. Names only, no contents. */
  async tree(): Promise<string[]> {
    const out: string[] = [];
    for (const root of this.cfg.roots) {
      for (let page = 1; ; page++) {
        const r = await this.api(this.proj(`/repository/tree?recursive=true&per_page=100&page=${page}&ref=${this.cfg.branch}&path=${this.enc(root)}`));
        if (!r.ok) throw new Error(`Could not list the files (${r.status}).`);
        const items = (await r.json()) as { type: string; path: string }[];
        for (const it of items) if (it.type === "blob") out.push(it.path);
        if (items.length < 100) break;
      }
    }
    return out.sort();
  }

  async read(path: string): Promise<{ bytes: Uint8Array; lastCommitId: string }> {
    const r = await this.api(this.proj(`/repository/files/${this.enc(path)}?ref=${this.cfg.branch}`));
    if (!r.ok) throw new Error(`Could not read ${path} (${r.status}).`);
    const j = await r.json();
    const bin = atob(j.content);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, lastCommitId: j.last_commit_id };
  }

  async commit(message: string, actions: Action[]): Promise<{ id: string; url: string }> {
    const r = await this.api(this.proj("/repository/commits"), {
      method: "POST",
      body: JSON.stringify({
        branch: this.cfg.branch, commit_message: message,
        actions: actions.map((a) => ({
          action: a.action, file_path: a.path,
          ...(a.action !== "delete" ? { content: a.base64 ?? a.text ?? "", encoding: a.base64 !== undefined ? "base64" : "text" } : {}),
          ...(a.lastCommitId ? { last_commit_id: a.lastCommitId } : {}),
        })),
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const text = JSON.stringify(j.message ?? j);
      if (/last_commit_id|changed|conflict/i.test(text)) throw new Error("The file changed on GitLab after you opened it. Reload it and make the change again, or bring your copy back through “On this computer”.");
      throw new Error(`Save failed (${r.status}): ${text}`);
    }
    return { id: j.short_id, url: j.web_url };
  }
}

export interface Action {
  action: "create" | "update" | "delete";
  path: string;
  text?: string;
  base64?: string;
  lastCommitId?: string;
}

export const bytesToBase64 = (bytes: Uint8Array) => {
  let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
