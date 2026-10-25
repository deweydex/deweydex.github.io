// The block editor core. It knows Markdown, maths and the blocks in
// docs/blocks.md. It knows nothing about GitLab or files on a server, so
// dewnote can use it too.
//
// Settings carried over from dewnote's editor so that a save changes as
// little as possible: bullet and rule markers, tight lists, front matter
// held as one string, display maths in one canonical form, no extra
// blank line at the end.

import { Crepe } from "@milkdown/crepe";
import { bulletListSchema, codeBlockSchema, remarkPreserveEmptyLinePlugin } from "@milkdown/kit/preset/commonmark";
import { extendListItemSchemaForTask } from "@milkdown/kit/preset/gfm";
import { $nodeSchema, $remark, insert } from "@milkdown/kit/utils";
import { commandsCtx, editorViewCtx, remarkStringifyOptionsCtx } from "@milkdown/kit/core";
import { clearTextInCurrentBlockCommand } from "@milkdown/kit/preset/commonmark";
import remarkFrontmatter from "remark-frontmatter";
import { canonicaliseDisplayMath, unmathPlainDollars } from "./maths.ts";
import { CALLOUT_TYPES, insertBlock, siteBlocks } from "./directives.ts";

const codeBlockWithMeta = codeBlockSchema.extendSchema((prev) => (ctx) => {
  const base = prev(ctx);
  return {
    ...base,
    attrs: { ...base.attrs, meta: { default: "" } },
    parseMarkdown: {
      match: base.parseMarkdown.match,
      runner: (state, node, type) => {
        state.openNode(type, { language: node.lang ?? "", meta: node.meta ?? "" });
        if (node.value) state.addText(node.value as string);
        state.closeNode();
      },
    },
    toMarkdown: {
      match: base.toMarkdown.match,
      runner: (state, node) => {
        if (String(node.attrs.language ?? "").toLowerCase() === "latex") {
          state.addNode("math", undefined, node.content.firstChild?.text || "");
          return;
        }
        state.addNode("code", undefined, node.content.firstChild?.text || "", {
          lang: node.attrs.language,
          meta: node.attrs.meta || null,
        });
      },
    },
  };
});

const tightBulletLists = bulletListSchema.extendSchema((prev) => (ctx) => {
  const base = prev(ctx);
  return {
    ...base,
    toMarkdown: {
      match: base.toMarkdown.match,
      runner: (state, node) => {
        state.openNode("list", undefined, { ordered: false, spread: String(node.attrs.spread) === "true" }).next(node.content).closeNode();
      },
    },
  };
});

const tightListItems = extendListItemSchemaForTask.extendSchema((prev) => (ctx) => {
  const base = prev(ctx);
  return {
    ...base,
    toMarkdown: {
      match: base.toMarkdown.match,
      runner: (state, node) => {
        if (node.attrs.checked != null) { base.toMarkdown.runner(state, node); return; }
        state.openNode("listItem", undefined, { spread: String(node.attrs.spread) === "true" });
        state.next(node.content);
        state.closeNode();
      },
    },
  };
});

function keepMarkers(ctx: { update: Function }): void {
  ctx.update(remarkStringifyOptionsCtx, (o: any) => ({ ...o, bullet: "-", rule: "-" }));
}

const frontMatterSchema = $nodeSchema("front_matter", () => ({
  content: "text*",
  group: "block",
  marks: "",
  defining: true,
  code: true,
  parseDOM: [{ tag: "div[data-front-matter]", preserveWhitespace: "full" as const }],
  toDOM: () => ["div", { "data-front-matter": "true", class: "jb-front" }, 0] as const,
  parseMarkdown: {
    match: ({ type }: { type: string }) => type === "yaml",
    runner: (state: any, node: any, type: any) => {
      state.openNode(type);
      if (node.value) state.addText(node.value);
      state.closeNode();
    },
  },
  toMarkdown: {
    match: (node: any) => node.type.name === "front_matter",
    runner: (state: any, node: any) => state.addNode("yaml", undefined, node.content.firstChild?.text || ""),
  },
}));
const frontMatterRemark = $remark("frontMatter", () => remarkFrontmatter, ["yaml"]);
const plainDollars = $remark("plainDollars", () => unmathPlainDollars);

/** The text a file has when the editor writes it. Opening a page and
 * saving it without a change must give the same text as this. */
export function asSaved(markdown: string): string {
  return hardBreaksAsSpaces(markdown)
    .replace(/^(---\n[\s\S]*?\n---)\n\n/, "$1\n")   // no blank line after front matter, as the files are written
    .replace(/\n{2,}$/, "\n");
}

/** The serialiser writes a hard line break as a backslash at the end of the
 * line. Python-Markdown, which builds the site, wants two spaces instead and
 * would print the backslash. Fences and display maths are left alone. */
export function hardBreaksAsSpaces(markdown: string): string {
  let fence: string | null = null;
  let maths = false;
  return markdown
    .split("\n")
    .map((line) => {
      const f = /^(`{3,}|~{3,})/.exec(line);
      if (fence) { if (f && f[1]!.startsWith(fence[0]!) && f[1]!.length >= fence.length) fence = null; return line; }
      if (f) { fence = f[1]!; return line; }
      if (line.trim() === "$$") { maths = !maths; return line; }
      if (maths) return line;
      if (/^\|(\s*:?-+:?\s*\|)+\s*$/.test(line)) {
        return line.replace(/:?-+:?/g, (c) => (c.startsWith(":") ? ":" : "") + "---" + (c.endsWith(":") && c.length > 1 ? ":" : ""));
      }
      const unescaped = line.replace(/\\:/g, ":");   // the directive plugin escapes a colon before a letter or digit; Python-Markdown would print the backslash
      return /(?<!\\)\\$/.test(unescaped) ? unescaped.slice(0, -1) + "  " : unescaped;
    })
    .join("\n");
}

export interface CoreOptions {
  markdown: string;
  onChange?(markdown: string): void;
  /** Called by `/file`. Resolves to the file block's fields, or null if cancelled. */
  pickFile?(): Promise<{ title: string; path: string; note: string } | null>;
  /** Turns an image path into something a browser can draw. */
  resolveImage?(src: string): Promise<string | null>;
  saveImage?(file: File): Promise<string>;
}

export interface Core {
  markdown(): string;
  destroy(): void;
}

export async function mountCore(root: HTMLElement, options: CoreOptions): Promise<Core> {
  const crepe = new Crepe({
    root,
    defaultValue: canonicaliseDisplayMath(options.markdown),
    features: {
      [Crepe.Feature.ImageBlock]: false,
      [Crepe.Feature.TopBar]: false,
      [Crepe.Feature.AI]: false,
    },
    featureConfigs: {
      [Crepe.Feature.Placeholder]: { text: "Type / for blocks, files and maths", mode: "block" },
      [Crepe.Feature.BlockEdit]: {
        buildMenu: (builder: any) => {
          const group = builder.addGroup("site", "Site blocks");
          const ICON = '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
          const add = (key: string, label: string, run: (ctx: any) => void) =>
            group.addItem(key, { label, icon: ICON, onRun: (ctx: any) => { ctx.get(commandsCtx).call(clearTextInCurrentBlockCommand.key); run(ctx); } });
          add("file", "File", (ctx) => {
            if (!options.pickFile) { insertBlock(ctx, "file"); return; }
            void options.pickFile().then((f) => { if (f) crepe.editor.action((c) => insertBlock(c, "file", f)); });
          });
          for (const t of CALLOUT_TYPES) add(`callout-${t}`, t === "info" ? "Information" : t[0]!.toUpperCase() + t.slice(1), (ctx) => insertBlock(ctx, "callout", { type: t }));
          add("button", "Button", (ctx) => insertBlock(ctx, "button", { label: "Label", url: "https://" }));
          add("link", "Link card", (ctx) => insertBlock(ctx, "link", { title: "Title", url: "https://" }));
          add("details", "Collapsible section", (ctx) => insertBlock(ctx, "details", { title: "Title shown while closed" }));
        },
      },
    },
  });

  crepe.editor.config(keepMarkers).use(codeBlockWithMeta).use(frontMatterRemark).use(frontMatterSchema).use(plainDollars).use(tightBulletLists).use(tightListItems).use(siteBlocks);
  await crepe.editor.remove(remarkPreserveEmptyLinePlugin);

  let hydrated = false;
  if (options.onChange) {
    crepe.on((l) => l.markdownUpdated((_c, md) => { if (hydrated) options.onChange!(asSaved(md)); }));
  }
  await crepe.create();
  hydrated = true;

  return {
    markdown: () => asSaved(crepe.getMarkdown()),
    destroy: () => crepe.destroy(),
  };
}

export { editorViewCtx };
