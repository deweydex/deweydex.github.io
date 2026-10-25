import { expect, test } from "bun:test";
import { dedupe, lineDiff, slugOf } from "./util.ts";
test("slugOf", () => { expect(slugOf("content/pages/maths-worksheets.md")).toBe("maths-worksheets"); expect(slugOf("content/sections/10-projects.md")).toBe("projects"); expect(slugOf("content/index.md")).toBe("home"); });
test("dedupe", () => { expect(dedupe("a/b.pdf", new Set(["a/b.pdf"]))).toBe("a/b-2.pdf"); expect(dedupe("a/b.pdf", new Set())).toBe("a/b.pdf"); });
test("diff", () => { const d = lineDiff("a\nb\nc", "a\nB\nc"); expect(d.filter((l) => l.kind !== " ").map((l) => l.kind + l.text)).toEqual(["-b", "+B"]); });
