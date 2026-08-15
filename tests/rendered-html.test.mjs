import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Simple Kanban", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Simple Kanban<\/title>/i);
  assert.match(html, /Simple Kanban/);
  assert.match(html, /To Do/);
  assert.match(html, /In Progress/);
  assert.match(html, /Done/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("includes the requested LiteSpec CRUD behavior", async () => {
  const [page, docsLibrary, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/DocsLibrary.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage/);
  assert.match(page, /draggable=/);
  assert.match(page, /window\.confirm/);
  assert.match(page, /Edit todo title/);
  assert.match(page, /clearDone/);
  assert.match(page, /DocsLibrary/);
  assert.match(page, /> Docs</);
  assert.match(docsLibrary, /Nine source documents/);
  assert.match(docsLibrary, /Raw Markdown/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("publishes all nine canonical LiteSpec documents", async () => {
  const documentPairs = [
    ["../docs/litespec/README.md", "../public/docs/litespec/README.md"],
    ["../docs/litespec/templates/spec.md", "../public/docs/litespec/templates/spec.md"],
    ["../docs/litespec/templates/plan.md", "../public/docs/litespec/templates/plan.md"],
    ["../docs/litespec/templates/tests.md", "../public/docs/litespec/templates/tests.md"],
    ["../.litespec/simple-kanban/spec.md", "../public/docs/simple-kanban/spec.md"],
    ["../.litespec/simple-kanban/plan.md", "../public/docs/simple-kanban/plan.md"],
    ["../.litespec/simple-kanban/tests.md", "../public/docs/simple-kanban/tests.md"],
    ["../.agents/skills/litespec/SKILL.md", "../public/docs/litespec/skill/SKILL.md"],
    ["../.agents/skills/litespec/references/method.md", "../public/docs/litespec/skill/method.md"],
  ];

  const docsLibrary = await readFile(new URL("../app/DocsLibrary.tsx", import.meta.url), "utf8");
  assert.equal((docsLibrary.match(/path: "\/docs\//g) ?? []).length, 9);

  for (const [canonicalPath, publicPath] of documentPairs) {
    const [canonical, published] = await Promise.all([
      readFile(new URL(canonicalPath, import.meta.url), "utf8"),
      readFile(new URL(publicPath, import.meta.url), "utf8"),
    ]);
    assert.equal(published, canonical, `${publicPath} must match its canonical source`);
  }
});
