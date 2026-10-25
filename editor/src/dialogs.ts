import { S, full, rel } from "./ctx.ts";
import { base, dedupe, el, ext } from "./util.ts";

export function button(label: string, onclick: () => void, kind = "") { return el("button", { class: "btn " + kind, type: "button", onclick }, label); }
export function note(text: string, kind = "") { return el("p", { class: "note " + kind }, text); }

export function modal(title: string, body: HTMLElement, buttons: HTMLElement[]): () => void {
  const back = el("div", { class: "modal" }, el("div", { class: "sheet", role: "dialog", "aria-label": title }, el("h2", {}, title), body, el("div", { class: "row" }, ...buttons)));
  document.body.append(back);
  return () => back.remove();
}

export function askText(title: string, initial: string): Promise<string | null> {
  return new Promise((resolve) => {
    const input = el("input", { type: "text", class: "search", value: initial }); input.value = initial;
    let close = () => {};
    const ok = button("Save", () => { close(); resolve(input.value.trim()); }, "primary");
    const no = button("Cancel", () => { close(); resolve(null); });
    close = modal(title, el("div", {}, input), [ok, no]);
    input.focus(); input.select();
    input.onkeydown = (e) => { if (e.key === "Enter") ok.click(); };
  });
}

export function fileDialog(slug: string): Promise<{ title: string; path: string; note: string } | null> {
  return new Promise((resolve) => {
    let close = () => {};
    const finish = (v: { title: string; path: string; note: string } | null) => { close(); resolve(v); };
    const tabs = el("div", { class: "row" });
    const body = el("div", {});
    const showUpload = () => {
      const pick = el("input", { type: "file" });
      const title = el("input", { type: "text", class: "search", placeholder: "Title shown on the page" });
      const noteIn = el("input", { type: "text", class: "search", placeholder: "Optional note" });
      const folder = el("input", { type: "text", class: "search", value: `downloads/${slug}/` });
      const clash = el("div", {});
      let choice: "replace" | "both" = "both";
      const check = () => {
        const f = pick.files?.[0]; clash.replaceChildren(); if (!f) return;
        if (!title.value) title.value = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        if (S.files.includes(full(folder.value.replace(/\/?$/, "/") + f.name))) {
          const a = el("input", { type: "radio", name: "c", onchange: () => { choice = "replace"; } }), b = el("input", { type: "radio", name: "c", checked: "checked", onchange: () => { choice = "both"; } });
          clash.append(note("A file with this name is already there.", "warn"), el("label", { class: "inline" }, a, " Replace it"), el("label", { class: "inline" }, b, " Keep both"));
        }
      };
      pick.onchange = check; folder.oninput = check;
      const add = button("Add to the page", () => {
        const f = pick.files?.[0]; if (!f) return;
        let p = full(folder.value.replace(/\/?$/, "/") + f.name);
        if (S.files.includes(p) && choice === "both") p = dedupe(p, new Set([...S.files, ...S.pending.keys()]));
        S.pending.set(p, { file: f });
        finish({ title: title.value.trim(), path: rel(p), note: noteIn.value.trim() });
      }, "primary");
      body.replaceChildren(pick, el("label", {}, "Title", title), el("label", {}, "Note", noteIn), el("label", {}, "Folder (relative to the site)", folder), clash, note("Uploaded files are public once the site updates.", "warn"), add);
    };
    const showExisting = () => {
      const q = el("input", { type: "search", class: "search", placeholder: "Search the project's files" });
      const list = el("div", { class: "files short" });
      const draw = () => {
        const s = q.value.toLowerCase();
        list.replaceChildren(...S.files.filter((f) => !f.endsWith(".md") || /downloads/.test(f)).filter((f) => !s || f.toLowerCase().includes(s)).slice(0, 80).map((f) =>
          el("button", { class: "frow", type: "button", onclick: () => finish({ title: base(f).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), path: rel(f), note: "" }) }, el("span", { class: "ext" }, ext(f)), el("span", { class: "fname" }, rel(f)))));
      };
      q.oninput = draw; draw();
      body.replaceChildren(note("Linking uses the file where it is. Nothing is copied."), q, list);
    };
    tabs.append(button("Upload a file", showUpload), button("Choose a file already in the project", showExisting));
    close = modal("Add a file", el("div", {}, tabs, body), [button("Cancel", () => finish(null))]);
    showUpload();
  });
}
