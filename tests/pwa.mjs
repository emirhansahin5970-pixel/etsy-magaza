// Web uygulaması (barındırılan sürüm) testleri: app/dist klasörü gerçek bir statik sunucu gibi sunulur.
// Chromium ile. iPhone Safari'de "Ana Ekrana Ekle" ve önbellek davranışı bu ortamda test EDİLEMEZ.
// Kullanım: node app/build.mjs && node tests/pwa.mjs
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { turkishUI } from "./helpers.mjs";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }
const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "app", "dist");

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json", ".png": "image/png" };
// GitHub Pages gibi: /etsy-magaza/ alt yolu altında sunulur (göreli yolların doğru çalıştığını da sınar)
const BASE_PATH = "/etsy-magaza/";
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (!p.startsWith(BASE_PATH)) { res.writeHead(404); return res.end(); }
  p = p.slice(BASE_PATH.length) || "index.html";
  const file = normalize(join(dist, p));
  if (!file.startsWith(dist) || !existsSync(file)) { res.writeHead(404); return res.end("yok"); }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(0);
const URL_ = `http://localhost:${server.address().port}${BASE_PATH}`;

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try { await fn(); results.push(["OK", name]); }
  catch (e) { results.push(["HATA", name, e.message.split("\n").filter(Boolean).slice(0, 5).join(" | ")]); }
}
async function ctxFor() {
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, locale: "tr-TR", timezoneId: "Europe/Istanbul" });
  await turkishUI(ctx);
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { ctx, page, errors };
}
const started = (page) => page.waitForFunction(() => !document.getElementById("app-root").classList.contains("is-booting") && !document.getElementById("boot-screen"), null, { timeout: 8000 });

await run("Barındırılan klasör: sayfa, uygulama tanımı ve simgeler alt yol altında yüklenir", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.goto(URL_);
  await started(page);
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel="manifest"]').href;
    const m = await (await fetch(href)).json();
    const icons = await Promise.all(m.icons.map(async (i) => (await fetch(new URL(i.src, href))).status));
    const touch = (await fetch(document.querySelector('link[rel="apple-touch-icon"]').href)).status;
    return { name: m.name, display: m.display, start: m.start_url, icons, touch };
  });
  assert.equal(manifest.name, "Small Steps, Clear Days");
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.icons, [200, 200]);
  assert.equal(manifest.touch, 200);
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Service worker kaydolur; internet kesilince sayfa önbellekten açılır ve kayıtlar yerinde durur", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.goto(URL_ + "#gunum");
  await started(page);
  await page.fill("#f-main", "İnternetsiz de görünecek iş");
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload(); // service worker sayfayı denetlesin
  await started(page);
  assert.equal(await page.evaluate(() => !!navigator.serviceWorker.controller), true);
  await ctx.setOffline(true);
  await page.reload();
  await started(page);
  assert.equal(await page.inputValue("#f-main"), "İnternetsiz de görünecek iş");
  await page.getByRole("button", { name: "Alışkanlığım" }).click();
  await page.locator("#habit-setup").waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Yeni sürüm yayınlanınca sayfa ağdan güncellenir (eski önbellek takılı kalmaz)", async () => {
  const sw = readFileSync(join(dist, "sw.js"), "utf8");
  assert.match(sw, /var CACHE = "gx-ssc-[0-9a-f]{10}";/, "önbellek adı sürüme bağlı");
  assert.match(sw, /req\.mode === "navigate"[\s\S]*fetch\(req\)/, "sayfa için önce ağ");
});

await run("claude.ai sürümünde uygulama tanımı ve service worker yok", async () => {
  const art = readFileSync(join(here, "..", "app", "dist-artifact", "artifact.html"), "utf8");
  assert.equal(/<link rel="manifest"/.test(art), false);
  assert.equal(existsSync(join(dist, "artifact.html")), false, "web klasöründe artifact dosyası yok");
});

server.close();
await browser.close();
const width = Math.max(...results.map((r) => r[1].length));
for (const r of results) console.log(`${r[0].padEnd(4)}  ${r[1].padEnd(width)}${r[2] ? "  → " + r[2] : ""}`);
const failed = results.filter((r) => r[0] !== "OK").length;
console.log(`\n${results.length - failed}/${results.length} web uygulaması testi geçti`);
process.exit(failed ? 1 : 0);
