import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Novoe Pokolenie landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Новое поколение — медицинский центр в Краснодаре/i);
  assert.match(html, /ул\. Космонавта Гагарина, 124/i);
  assert.match(html, /Подобрать специалиста/i);
  assert.match(html, /role="tablist"/i);
  assert.match(html, /clinic-(hero|doctor|detail)\.(jpg|webp)/i);
  assert.doesNotMatch(html, /Красных Партизан, 238/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/i);
});

test("keeps the interactive booking flow in the page source", async () => {
  const [page, layout, packageJson] = await Promise.all([readFile(new URL("../app/page.tsx", import.meta.url), "utf8"), readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"), readFile(new URL("../package.json", import.meta.url), "utf8")]);
  assert.match(page, /use client/);
  assert.match(page, /bookingOpen/);
  assert.match(page, /setSubmitted/);
  assert.match(page, /directionTabs/);
  assert.match(page, /faqs/);
  assert.match(page, /tel:\+78612033632/);
  assert.match(layout, /Новое поколение — медицинский центр в Краснодаре/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await Promise.all([
    access(new URL("../public/images/clinic-hero.jpg", import.meta.url)),
    access(new URL("../public/images/clinic-doctor.jpg", import.meta.url)),
    access(new URL("../public/images/clinic-detail.jpg", import.meta.url)),
    access(new URL("../public/images/clinic-logo.jpg", import.meta.url)),
  ]);
});
