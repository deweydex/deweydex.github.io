import { chromium } from "playwright";
const server = Bun.serve({ port: 0, fetch: (r) => { const u = new URL(r.url).pathname; return u==="/favicon.ico"? new Response("",{status:204}) : new Response(Bun.file("/tmp/rt" + (u === "/" ? "/index.html" : u))); } });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome" });
const p = await b.newPage(); await p.goto(`http://localhost:${server.port}/`);
await p.waitForFunction(() => typeof (window as any).rt === "function");
for (const md of ["- a\n- b\n", "Text\n\n- a\n- b\n", "- [x](y) one\n- two\n", "1. a\n2. b\n"]) console.log(JSON.stringify(md), "->", JSON.stringify(await p.evaluate((m) => (window as any).rt(m), md)));
await b.close(); server.stop();
