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

test("includes the requested TinySpec CRUD behavior", async () => {
  const [page, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage/);
  assert.match(page, /draggable=/);
  assert.match(page, /window\.confirm/);
  assert.match(page, /Edit todo title/);
  assert.match(page, /clearDone/);
  assert.match(page, /View TinySpec/);
  assert.match(page, /\/tinyspec\.md/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/tinyspec.md", import.meta.url));

  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
