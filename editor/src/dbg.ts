import { Crepe } from "@milkdown/crepe";
import { remarkPreserveEmptyLinePlugin } from "@milkdown/kit/preset/commonmark";
(window as any).rt = async (md: string, drop: boolean) => {
  const root = document.createElement("div"); document.body.appendChild(root);
  const c = new Crepe({ root, defaultValue: md });
  if (drop) await c.editor.remove(remarkPreserveEmptyLinePlugin);
  await c.create();
  const out = c.getMarkdown(); c.destroy(); return out;
};
