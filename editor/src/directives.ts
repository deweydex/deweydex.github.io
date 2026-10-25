// The site's blocks, as Milkdown nodes.
//
// On disk they are standard directives (the syntax remark-directive reads):
//
//   ::file{title="Notes" path="downloads/notes.pdf" note="Optional"}
//   :::callout{type="tip"}
//   Paragraphs, lists and bold text, as in any page.
//   :::
//
// Each block is a node with its own schema, parse and serialise rules and
// view, the way Milkdown's own nodes are. A leaf block is an atom edited
// through small fields. A container block holds ordinary blocks.

import { $nodeSchema, $remark, $view } from "@milkdown/kit/utils";
import { editorViewCtx } from "@milkdown/kit/core";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";

type Attrs = Record<string, string>;

/** Leaf blocks: name, fields in the order they are written, and which are shown as wide fields. */
export const LEAVES: Record<string, { label: string; fields: { key: string; label: string; wide?: boolean }[] }> = {
  file: { label: "File", fields: [{ key: "title", label: "Title" }, { key: "path", label: "File path" }, { key: "note", label: "Note", wide: true }] },
  link: { label: "Link", fields: [{ key: "title", label: "Title" }, { key: "url", label: "Address" }, { key: "note", label: "Note", wide: true }] },
  button: { label: "Button", fields: [{ key: "label", label: "Label" }, { key: "url", label: "Address" }] },
  pdf: { label: "PDF preview", fields: [{ key: "title", label: "Title" }, { key: "path", label: "File path" }] },
  sheet: { label: "Worksheet", fields: [{ key: "title", label: "Title" }, { key: "pdf", label: "PDF path" }, { key: "tex", label: "TeX path" }, { key: "outline", label: "Outline", wide: true }] },
};
export const CONTAINERS = ["callout", "details"] as const;
export const CALLOUT_TYPES = ["note", "tip", "info", "warning"];

const clean = (a: Attrs | undefined): Attrs => {
  const out: Attrs = {};
  for (const [k, v] of Object.entries(a ?? {})) if (v !== undefined && v !== null && String(v) !== "") out[k] = String(v);
  return out;
};

/** Text directives (`:name`) are never wanted: "word:word" in a sentence is not one.
 * Anything that parses as one goes back to the exact characters that were typed.
 * Directives this site does not know are kept verbatim too. */
const keepUnknownAsWritten = $remark("keepUnknownDirectives", () => () => (tree: any, file: any) => {
  const source = String(file.value ?? "");
  const known = new Set([...Object.keys(LEAVES), ...CONTAINERS]);
  visit(tree, (node: any, index: number | undefined, parent: any) => {
    if (!parent || index === undefined || !node.position) return;
    const isText = node.type === "textDirective";
    const isBlock = node.type === "leafDirective" || node.type === "containerDirective";
    if (!(isText || (isBlock && !known.has(node.name)) || (node.type === "leafDirective" && !LEAVES[node.name]) || (node.type === "containerDirective" && !CONTAINERS.includes(node.name)))) return;
    const raw = source.slice(node.position.start.offset, node.position.end.offset);
    const html = { type: "html", value: raw };
    parent.children[index] = isText ? html : { type: "paragraph", children: [html] };
    return ["skip", index];
  });
});
export const directivePlugin = $remark("directive", () => remarkDirective);

function leafSchema(name: string) {
  return $nodeSchema(`site_${name}`, () => ({
    group: "block",
    atom: true,
    isolating: true,
    selectable: true,
    attrs: Object.fromEntries(LEAVES[name]!.fields.map((f) => [f.key, { default: "" }])),
    parseDOM: [{ tag: `div[data-site-block="${name}"]`, getAttrs: (dom: any) => Object.fromEntries(LEAVES[name]!.fields.map((f) => [f.key, dom.getAttribute(`data-${f.key}`) ?? ""])) }],
    toDOM: (node: any) => ["div", { "data-site-block": name, ...Object.fromEntries(LEAVES[name]!.fields.map((f) => [`data-${f.key}`, node.attrs[f.key]])) }] as const,
    parseMarkdown: {
      match: (n: any) => n.type === "leafDirective" && n.name === name,
      runner: (state: any, node: any, type: any) => {
        const a = node.attributes ?? {};
        state.addNode(type, Object.fromEntries(LEAVES[name]!.fields.map((f) => [f.key, a[f.key] ?? ""])));
      },
    },
    toMarkdown: {
      match: (n: any) => n.type.name === `site_${name}`,
      runner: (state: any, node: any) => {
        const attributes = clean(Object.fromEntries(LEAVES[name]!.fields.map((f) => [f.key, node.attrs[f.key]])));
        state.addNode("leafDirective", undefined, undefined, { name, attributes, children: [] });
      },
    },
  }));
}

export const leafNodes = Object.fromEntries(Object.keys(LEAVES).map((n) => [n, leafSchema(n)]));

export const calloutNode = $nodeSchema("site_callout", () => ({
  group: "block",
  content: "block+",
  defining: true,
  attrs: { type: { default: "note" } },
  parseDOM: [{ tag: "aside[data-site-block=callout]", getAttrs: (dom: any) => ({ type: dom.getAttribute("data-type") || "note" }) }],
  toDOM: (node: any) => ["aside", { "data-site-block": "callout", "data-type": node.attrs.type, class: `callout site-callout ${node.attrs.type}` }, 0] as const,
  parseMarkdown: {
    match: (n: any) => n.type === "containerDirective" && n.name === "callout",
    runner: (state: any, node: any, type: any) => {
      state.openNode(type, { type: node.attributes?.type || "note" });
      state.next(node.children);
      state.closeNode();
    },
  },
  toMarkdown: {
    match: (n: any) => n.type.name === "site_callout",
    runner: (state: any, node: any) => {
      state.openNode("containerDirective", undefined, { name: "callout", attributes: node.attrs.type === "note" ? {} : { type: node.attrs.type } });
      state.next(node.content);
      state.closeNode();
    },
  },
}));

export const detailsNode = $nodeSchema("site_details", () => ({
  group: "block",
  content: "block+",
  defining: true,
  attrs: { title: { default: "" } },
  parseDOM: [{ tag: "div[data-site-block=details]", getAttrs: (dom: any) => ({ title: dom.getAttribute("data-title") ?? "" }) }],
  toDOM: (node: any) => ["div", { "data-site-block": "details", "data-title": node.attrs.title, class: "site-details" }, 0] as const,
  parseMarkdown: {
    match: (n: any) => n.type === "containerDirective" && n.name === "details",
    runner: (state: any, node: any, type: any) => {
      state.openNode(type, { title: node.attributes?.title ?? "" });
      state.next(node.children);
      state.closeNode();
    },
  },
  toMarkdown: {
    match: (n: any) => n.type.name === "site_details",
    runner: (state: any, node: any) => {
      state.openNode("containerDirective", undefined, { name: "details", attributes: clean({ title: node.attrs.title }) });
      state.next(node.content);
      state.closeNode();
    },
  },
}));

// ---------- views ----------

const el = (tag: string, cls = "", text = "") => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
const extOf = (p: string) => (p.includes(".") ? p.split(".").pop()!.toLowerCase() : "");

function setAttr(view: any, getPos: () => number | undefined, node: any, key: string, value: string) {
  const pos = getPos(); if (pos === undefined) return;
  view.dispatch(view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, [key]: value }));
}

const KINDS: Record<string, string> = { pdf: "PDF", docx: "Word", zip: "ZIP", tex: "TeX", md: "Markdown", py: "Python", html: "HTML", css: "CSS", js: "JS", txt: "Text", ipynb: "Notebook", csv: "CSV", json: "JSON" };
const kindOf = (p: string) => KINDS[extOf(p)] ?? (extOf(p).toUpperCase() || "File");
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** The same markup the published page uses, so a block looks in the editor as it will to a reader. */
function previewHtml(name: string, a: Attrs): string {
  const row = (title: string, path: string, noteText = "", compact = false) =>
    `<div class="file${compact ? " compact" : ""}"><span class="ext">${esc(kindOf(path))}</span><div class="meta">${title ? `<strong>${esc(title)}</strong>` : ""}<span class="n">${esc(noteText)}</span></div><div class="acts"><span class="act dl">Download</span></div></div>`;
  switch (name) {
    case "file": return row(a.title || "", a.path || "", a.note || "");
    case "link": return `<div class="card link"><span class="k">Open</span><strong>${esc(a.title || "")}</strong><span class="n">${esc(a.note || a.url || "")}</span></div>`;
    case "button": return `<p><span class="act dl-btn">${esc(a.label || "")}</span></p>`;
    case "pdf": return `<figure class="pdf"><div class="pdf-box">PDF preview: ${esc(a.path || "")}</div><figcaption>${esc(a.title || "")}</figcaption></figure>`;
    case "sheet": return `<div class="sheet"><h4>${esc(a.title || "")}</h4><p>${esc(a.outline || "")}</p>${row("", a.pdf || "", "", true)}${row("", a.tex || "", "", true)}</div>`;
  }
  return "";
}

function leafView(name: string) {
  const spec = LEAVES[name]!;
  return $view(leafNodes[name]!.node, () => (initial: any, view: any, getPos: any) => {
    let node = initial;
    const dom = el("div", `site-block site-${name}`);
    dom.contentEditable = "false";
    const preview = el("div", "site-preview");
    const toggle = el("button", "site-edit", "Edit"); (toggle as HTMLButtonElement).type = "button";
    const grid = el("div", "site-fields");
    const inputs: Record<string, HTMLInputElement> = {};
    for (const f of spec.fields) {
      const label = el("label", f.wide ? "wide" : "");
      label.append(el("span", "", f.label));
      const input = document.createElement("input");
      input.type = "text"; input.value = node.attrs[f.key] ?? "";
      input.addEventListener("input", () => setAttr(view, getPos, node, f.key, input.value));
      label.append(input); grid.append(label); inputs[f.key] = input;
    }
    let open = false;
    const setOpen = (v: boolean) => { open = v; grid.hidden = !v; toggle.textContent = v ? "Done" : "Edit"; };
    toggle.addEventListener("mousedown", (e) => { e.preventDefault(); setOpen(!open); });
    toggle.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } });
    dom.append(el("div", "site-block-bar", spec.label), toggle, preview, grid);
    const draw = () => {
      preview.innerHTML = previewHtml(name, node.attrs);
      for (const f of spec.fields) if (document.activeElement !== inputs[f.key]) inputs[f.key]!.value = node.attrs[f.key] ?? "";
    };
    // A block that has just been added has nothing in it yet, so it opens ready to fill.
    setOpen(!(node.attrs.title || node.attrs.label || node.attrs.path || node.attrs.pdf));
    draw();
    return {
      dom,
      update(next: any) { if (next.type !== node.type) return false; node = next; draw(); return true; },
      stopEvent: (e: Event) => (e.target as HTMLElement).closest?.("input,button") !== null,
      ignoreMutation: () => true,
    };
  });
}
export const leafViews = Object.keys(LEAVES).map(leafView);

export const calloutView = $view(calloutNode.node, () => (initial: any, view: any, getPos: any) => {
  let node = initial;
  const dom = el("aside", `callout site-callout ${node.attrs.type}`);
  const bar = el("div", "site-callout-bar"); bar.contentEditable = "false";
  const select = document.createElement("select");
  for (const t of CALLOUT_TYPES) select.append(new Option(t[0]!.toUpperCase() + t.slice(1), t));
  select.value = node.attrs.type;
  select.addEventListener("change", () => setAttr(view, getPos, node, "type", select.value));
  bar.append(select);
  const contentDOM = el("div", "site-body");
  dom.append(bar, contentDOM);
  return {
    dom, contentDOM,
    update(next: any) { if (next.type !== node.type) return false; node = next; dom.className = `callout site-callout ${node.attrs.type}`; select.value = node.attrs.type; return true; },
    stopEvent: (e: Event) => bar.contains(e.target as Node),
    ignoreMutation: (m: any) => bar.contains(m.target),
  };
});

export const detailsView = $view(detailsNode.node, () => (initial: any, view: any, getPos: any) => {
  let node = initial;
  const dom = el("div", "site-details");
  const bar = el("div", "site-details-bar"); bar.contentEditable = "false";
  bar.append(el("span", "site-kind", "Collapsible"));
  const input = document.createElement("input"); input.type = "text"; input.placeholder = "Title shown while closed"; input.value = node.attrs.title;
  input.addEventListener("input", () => setAttr(view, getPos, node, "title", input.value));
  bar.append(input);
  const contentDOM = el("div", "site-body");
  dom.append(bar, contentDOM);
  return {
    dom, contentDOM,
    update(next: any) { if (next.type !== node.type) return false; node = next; if (document.activeElement !== input) input.value = node.attrs.title; return true; },
    stopEvent: (e: Event) => bar.contains(e.target as Node),
    ignoreMutation: (m: any) => bar.contains(m.target),
  };
});

/** Puts a block into the document where the cursor is. */
export function insertBlock(ctx: any, name: string, attrs: Attrs = {}) {
  const view = ctx.get(editorViewCtx);
  const type = view.state.schema.nodes[`site_${name}`];
  if (!type) return;
  const node = type.createAndFill(attrs);
  if (node) view.dispatch(view.state.tr.replaceSelectionWith(node).scrollIntoView());
}

export const siteBlocks = [directivePlugin, keepUnknownAsWritten, ...Object.values(leafNodes), calloutNode, detailsNode, ...leafViews, calloutView, detailsView].flat();
