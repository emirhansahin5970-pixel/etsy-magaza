// Açılış testleri: yerel dosya (file://), HTTPS üzerinden tarayıcı, JavaScript'siz görünüm, başlangıç hataları.
// Chromium ile çalışır. Gerçek iPhone/Android/iPad testi DEĞİLDİR; mobil dosya önizlemesi burada yalnızca
// "JavaScript kapalı" tarayıcı bağlamıyla TAKLİT edilir.
// Kullanım: node app/build.mjs && node tests/boot.mjs
import { createRequire } from "node:module";
import { createServer } from "node:https";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }

const here = dirname(fileURLToPath(import.meta.url));
const distPath = join(here, "..", "app", "dist", "index.html");
const html = readFileSync(distPath, "utf8");
const shots = process.env.SHOTS_DIR || join(here, "screenshots");
mkdirSync(shots, { recursive: true });

// Telefona indirilen dosya gibi: Türkçe karakterli bir klasöre kopyalanmış tek HTML dosyası
const work = mkdtempSync(join(tmpdir(), "gx-boot-"));
const localDir = join(work, "İndirilenler");
mkdirSync(localDir);
const localFile = join(localDir, "kucuk-adimlar-prototip.html");
copyFileSync(distPath, localFile);
const FILE_URL = pathToFileURL(localFile).href;

// Yerel HTTPS sunucusu (kendinden imzalı sertifika). Gerçek barındırma DEĞİLDİR ama HTTPS bağlamını sağlar.
execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-subj", "/CN=localhost", "-days", "1",
  "-keyout", join(work, "key.pem"), "-out", join(work, "cert.pem")], { stdio: "ignore" });
const variants = {
  "/": html,
  // Sözdizimi hatalı uygulama kodu: betik hiç çalışamaz
  "/bozuk-kod": html.replace("function renderHome() {", "function renderHome( {"),
  // Uygulama kodu hiç gelmedi (ör. kesilen indirme): ne hata ne başlangıç
  "/eksik-kod": html.replace(/<script>\n\/\*\n \* Küçük Adımlar, Daha Net Günler — uygulama mantığı\.[\s\S]*?<\/script>/, ""),
};
assert.notEqual(variants["/bozuk-kod"], html);
assert.notEqual(variants["/eksik-kod"], html);
const server = createServer({ key: readFileSync(join(work, "key.pem")), cert: readFileSync(join(work, "cert.pem")) }, (req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(variants[req.url.split("#")[0]] || html);
}).listen(0);
const HTTPS = `https://localhost:${server.address().port}`;

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try {
    await fn();
    results.push(["OK", name]);
  } catch (e) {
    results.push(["HATA", name, e.message.split("\n").filter(Boolean).slice(0, 6).join(" | ")]);
  }
}
async function ctxFor(opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "tr-TR", timezoneId: "Europe/Istanbul",
    ignoreHTTPSErrors: true, javaScriptEnabled: opts.js !== false, acceptDownloads: true,
  });
  if (opts.fonts === "hang") await ctx.route(/fonts\.(googleapis|gstatic)\.com/, () => new Promise(() => {}));
  else await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { ctx, page, errors };
}
const started = (page) => page.waitForFunction(() => !document.getElementById("app-root").classList.contains("is-booting") && !document.getElementById("boot-screen"), null, { timeout: 5000 });

/* ---------- 1. HTTPS üzerinden tarayıcı kullanımı ---------- */
await run("HTTPS: uygulama başlar, kayıt oluşturulur ve yenilemede korunur", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.goto(HTTPS + "/");
  await started(page);
  await page.getByRole("button", { name: "Bugünümü planla" }).click();
  await page.fill("#f-main", "HTTPS üzerinden yazılan iş – çğıöşü");
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.reload();
  await started(page);
  assert.equal(await page.inputValue("#f-main"), "HTTPS üzerinden yazılan iş – çğıöşü");
  assert.equal(await page.evaluate(() => window.isSecureContext), true);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: join(shots, "boot-01-https.png") });
  await ctx.close();
});

await run("HTTPS: eski sürüm kayıtları yeni açılış koduyla okunur", async () => {
  const { ctx, page } = await ctxFor();
  const ls = JSON.parse(readFileSync(join(here, "fixtures", "v1-localstorage.json"), "utf8"));
  await page.addInitScript((ls) => { if (!localStorage.getItem("gx.ssc.days.v1")) for (const k in ls) localStorage.setItem(k, ls[k]); }, ls);
  await page.goto(HTTPS + "/#gun-2026-09-30");
  await started(page);
  assert.equal(await page.inputValue("#f-main"), "Eski sürümdeki ana iş");
  await page.locator("#legacy-what").getByText("Farklı bir başlangıç metni").waitFor();
  await ctx.close();
});

await run("HTTPS: Google Fonts hiç yanıt vermezse uygulama yine 2 saniye içinde sistem fontlarıyla açılır", async () => {
  const { ctx, page } = await ctxFor({ fonts: "hang" });
  const t0 = Date.now();
  await page.goto(HTTPS + "/", { waitUntil: "commit" });
  await started(page);
  const ms = Date.now() - t0;
  assert.ok(ms < 2000, `açılış ${ms} ms`);
  const media = await page.evaluate(() => document.getElementById("gx-fonts").media);
  assert.equal(media, "print", "yüklenmeyen font sayfayı etkilemez");
  await ctx.close();
});

/* ---------- 2. Yerel HTML dosyası (file://) ---------- */
await run("Yerel dosya (JavaScript açık): uygulama başlar, kayıt yenilemede korunur", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.goto(FILE_URL);
  await started(page);
  await page.getByRole("button", { name: "Bugünümü planla" }).click();
  await page.fill("#f-main", "Dosyadan açılınca yazılan iş");
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.reload();
  await started(page);
  assert.equal(await page.inputValue("#f-main"), "Dosyadan açılınca yazılan iş");
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* ---------- 3. JavaScript çalışmayan görünüm (mobil dosya önizlemesinin taklidi) ---------- */
for (const [label, url] of [["yerel dosya", FILE_URL], ["HTTPS", HTTPS + "/"]]) {
  await run(`JavaScript kapalı (${label}): boş ekran yok; ürün adı, açıklama ve uyarı görünür`, async () => {
    const { ctx, page } = await ctxFor({ js: false });
    await page.goto(url);
    const text = await page.evaluate(() => document.body.innerText);
    assert.match(text, /Küçük Adımlar, Daha Net Günler/);
    assert.match(text, /Kısa bir okuma, daha net bir günlük plan ve küçük bir alışkanlık denemesi\./);
    assert.match(text, /Bu görünüm uygulamanın kodunu çalıştıramıyor\. Ürünü Safari veya Chrome’da web bağlantısından açın\./);
    assert.equal(await page.locator("#boot-status").isVisible(), false, "JS yokken 'hazırlanıyor' yazmaz");
    assert.equal(await page.locator(".tabs").isVisible(), false, "çalışmayan sekmeler gizli");
    assert.equal(await page.locator("#open-settings").isVisible(), false);
    if (label === "yerel dosya") await page.screenshot({ path: join(shots, "boot-02-js-kapali.png") });
    await ctx.close();
  });
}

/* ---------- 4. JavaScript çalışıyor ama başlangıç başarısız ---------- */
await run("Uygulama dosyası eksik/bozuk yüklenirse anlaşılır hata ve ayrı teknik ayrıntı görünür", async () => {
  const { ctx, page } = await ctxFor();
  // Dil dosyalarının tanımladığı metinler hiç oluşmasın (dosyalar yarım inmiş gibi)
  await page.addInitScript(() => {
    for (const k of ["GX_I18N", "GX_STRINGS"]) Object.defineProperty(window, k, { get() { return undefined; }, set() {}, configurable: false });
  });
  await page.goto(HTTPS + "/");
  await page.locator("#boot-error").getByRole("heading", { name: "Uygulama başlatılamadı" }).waitFor({ timeout: 4000 });
  await page.getByRole("button", { name: "Sayfayı yenile" }).waitFor();
  assert.equal(await page.locator("#boot-error-details").isVisible(), false, "ayrıntı ayrı ve kapalı alanda");
  await page.locator("summary", { hasText: "Teknik ayrıntılar" }).click();
  const details = await page.inputValue("#boot-error-details");
  assert.match(details, /Uygulama dosyaları eksik yüklendi: i18n\/\*\.js/);
  assert.match(details, /GX_I18N YOK/);
  await page.screenshot({ path: join(shots, "boot-03-baslatma-hatasi.png"), fullPage: true });
  await ctx.close();
});

await run("Uygulama kodunda sözdizimi hatası: boş ekran yerine hata ekranı ve SyntaxError ayrıntısı", async () => {
  const { ctx, page } = await ctxFor();
  await page.goto(HTTPS + "/bozuk-kod");
  await page.locator("#boot-error").waitFor({ timeout: 4000 });
  await page.locator("summary", { hasText: "Teknik ayrıntılar" }).click();
  assert.match(await page.inputValue("#boot-error-details"), /SyntaxError/);
  await ctx.close();
});

await run("Uygulama kodu hiç çalışmazsa 12 saniye sonra 'beklenenden uzun' mesajı çıkar", async () => {
  const { ctx, page } = await ctxFor();
  await page.clock.install();
  await page.goto(HTTPS + "/eksik-kod");
  await page.locator("#boot-status").waitFor();
  await page.clock.fastForward("00:13");
  await page.getByRole("heading", { name: "Uygulama beklenenden uzun sürede açılıyor" }).waitFor({ timeout: 3000 });
  await page.locator("summary", { hasText: "Teknik ayrıntılar" }).click();
  assert.match(await page.inputValue("#boot-error-details"), /Durum: timeout/);
  await ctx.close();
});

await run("Bir ekran çizilemezse yalnızca o ekranda mesaj çıkar; diğer bölümler çalışır", async () => {
  const { ctx, page } = await ctxFor();
  await page.goto(HTTPS + "/");
  await started(page);
  await page.evaluate(() => Object.defineProperty(window.GX_ART, "habitLoop", { get() { throw new Error("test: görsel okunamadı"); } }));
  await page.getByRole("button", { name: "Alışkanlığım" }).click();
  await page.locator("#view-error").getByRole("heading", { name: "Bu ekran açılamadı" }).waitFor();
  await page.locator("summary", { hasText: "Teknik ayrıntılar" }).click();
  assert.match(await page.inputValue("#view-error-details"), /görsel okunamadı/);
  await page.getByRole("button", { name: "Günüm" }).click();
  await page.locator("#f-main").waitFor();
  await ctx.close();
});

/* ---------- 5. Desteklenmeyen API'ler açılışı engellemez ---------- */
await run("Intl.DateTimeFormat çalışmazsa uygulama açılır, tarihler yedek adlarla yazılır", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.clock.install({ time: new Date("2026-10-02T10:00:00+03:00") });
  await page.addInitScript(() => { window.Intl.DateTimeFormat = function () { throw new RangeError("desteklenmiyor"); }; });
  await page.goto(HTTPS + "/#gunum");
  await started(page);
  assert.equal(await page.textContent("#day-date"), "2 Ekim 2026 Cuma");
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("dialog.showModal yoksa Ayarlar yedek görünümle açılır, yedek alınır ve kapanır", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.addInitScript(() => { delete HTMLDialogElement.prototype.showModal; HTMLDialogElement.prototype.showModal = undefined; });
  await page.goto(HTTPS + "/#gunum");
  await started(page);
  await page.fill("#f-main", "Pencere yedeği testi");
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.click("#open-settings");
  await page.locator("#settings.is-fallback[open]").waitFor();
  await page.click("#export-show");
  assert.match(await page.inputValue("#export-text"), /Pencere yedeği testi/);
  await page.click("#close-settings");
  assert.equal(await page.locator("#settings[open]").count(), 0);
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("localStorage erişimi engelliyse uygulama açılır ve uyarı gösterir", async () => {
  const { ctx, page, errors } = await ctxFor();
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("engelli", "SecurityError"); } }));
  await page.goto(HTTPS + "/#gunum");
  await started(page);
  await page.getByText("Bu tarayıcı veri saklamaya izin vermiyor").waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

server.close();
await browser.close();

const width = Math.max(...results.map((r) => r[1].length));
for (const r of results) console.log(`${r[0].padEnd(4)}  ${r[1].padEnd(width)}${r[2] ? "  → " + r[2] : ""}`);
const failed = results.filter((r) => r[0] !== "OK").length;
console.log(`\n${results.length - failed}/${results.length} açılış testi geçti`);
process.exit(failed ? 1 : 0);
