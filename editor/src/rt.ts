import "@milkdown/crepe/theme/common/style.css";
import "./style.css";
import { mountCore } from "./core.ts";
(window as any).rt = async (md: string) => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const core = await mountCore(root, { markdown: md });
  const out = core.markdown();
  core.destroy();
  root.remove();
  return out;
};
