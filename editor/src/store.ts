import { GitHub } from "./github.ts";
import { GitLab, type Config, type Store } from "./gitlab.ts";
export const makeStore = (cfg: Config): Store => (cfg.host === "github" ? new GitHub(cfg) : new GitLab(cfg));
export async function loadConfig(url: string): Promise<Config> { return (await fetch(url, { cache: "no-cache" })).json(); }
