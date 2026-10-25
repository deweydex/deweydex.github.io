// State shared by the editor screen and the in-place editor.
import type { Config, Store } from "./gitlab.ts";

export const S = {
  cfg: null as unknown as Config,
  store: null as unknown as Store,
  files: [] as string[],                                   // every file under the roots
  pending: new Map<string, { file: File }>(),              // uploads waiting for the next save
};

export const rel = (p: string) => (p.startsWith(S.cfg.contentRoot + "/") ? p.slice(S.cfg.contentRoot.length + 1) : p);
export const full = (p: string) => (p.startsWith("http") || p.startsWith(S.cfg.contentRoot + "/") ? p : `${S.cfg.contentRoot}/${p}`);
