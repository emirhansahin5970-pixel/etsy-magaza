// Dil testleri: ilk açılış İngilizce, dil değiştirme ve kalıcılık, kitap dili notu, tarih biçimleri,
// başlangıç ekranının dili, yedeğe dil tercihinin girmemesi ve 7 dilde 320 px düzeni.
// Chromium ile; telefon yalnızca ekran boyutu taklididir (gerçek cihaz testi DEĞİLDİR). Çevirilerin doğruluğunu denetlemez.
// Kullanım: node app/build.mjs && node tests/lang.mjs
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }
const here = dirname(fileURLToPath(import.meta.url));
const LANGS = ["tr", "en", "de", "fr", "es", "it", "nl"];
const sandbox = { window: {} };
for (const l of LANGS) vm.runInNewContext(readFileSync(join(here, "..", "app", "src", "i18n", `${l}.js`), "utf8"), sandbox);
const I = JSON.parse(JSON.stringify(sandbox.window.GX_I18N)); // başka bağlamın dizileri deepEqual'de sorun çıkarmasın

const html = readFileSync(join(here, "..", "app", "dist", "index.html"));
const shots = process.env.SHOTS_DIR || join(here, "screenshots");
mkdirSync(shots, { recursive: true });
const server = createServer((req, res) => { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(html); }).listen(0);
const URL_ = `http://127.0.0.1:${server.address().port}/`;
const TODAY = new Date("2026-10-14T10:00:00+03:00");

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try { await fn(); results.push(["OK", name]); }
  catch (e) { results.push(["HATA", name, e.message.split("\n").filter(Boolean).slice(0, 6).join(" | ")]); }
}
async function newPage(opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    locale: opts.locale || "tr-TR", timezoneId: "Europe/Istanbul", acceptDownloads: true,
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.install({ time: TODAY });
  if (opts.init) await page.addInitScript(opts.init);
  if (opts.seed) await page.addInitScript((seed) => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); for (const k in seed) localStorage.setItem(k, seed[k]); } }, opts.seed);
  await page.goto(URL_ + (opts.hash || ""));
  return { ctx, page, errors };
}
const tabs = (page) => page.$$eval("[data-nav]", (e) => e.map((x) => x.textContent));
const lsSettings = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.settings.v1") || "{}"));

await run("İlk açılış cihaz dilinden bağımsız olarak İngilizce; üst çubukta dil düğmesi görünür", async () => {
  for (const [locale, lang] of [["de-DE", "en"], ["fr-CA", "en"], ["tr-TR", "en"], ["ja-JP", "en"], ["en-US", "en"]]) {
    const { ctx, page, errors } = await newPage({ locale });
    await page.locator("#home-title").waitFor();
    assert.deepEqual(await tabs(page), [I[lang].nav.read, I[lang].nav.day, I[lang].nav.habit], locale);
    assert.equal(await page.getAttribute("html", "lang"), lang, locale);
    assert.equal(await page.title(), I[lang].app.title);
    assert.equal(await page.textContent("#home-language"), I[lang].home.languageButton.replace("{name}", I[lang].name));
    assert.deepEqual(await lsSettings(page).then((s) => s.lang), undefined, "otomatik seçim kaydedilmez; cihaz dili değişirse uygulama da değişir");
    assert.equal(await page.textContent("#lang-code"), "EN");
    assert.equal(await page.getAttribute("#open-language", "aria-label"), "Language: English");
    assert.deepEqual(errors, []);
    await ctx.close();
  }
  // JavaScript'siz/başlangıç görünümü de İngilizce derlenir
  assert.match(html.toString(), /<html lang="en">/);
  assert.match(html.toString(), /<title>Small Steps, Clear Days<\/title>/);
});

await run("Üst çubuktaki dil düğmesi Ayarlar'ı dil seçimiyle açar; seçim sonrası kod değişir", async () => {
  const { ctx, page } = await newPage({ locale: "en-US" });
  await page.click("#open-language");
  assert.equal(await page.evaluate(() => document.activeElement.id), "lang-en");
  await page.click('label[for="lang-it"]');
  await page.locator("#settings-title", { hasText: I.it.settings.title }).waitFor();
  await page.click("#close-settings");
  assert.equal(await page.textContent("#lang-code"), "IT");
  await ctx.close();
});

await run("Dil Ayarlar'dan değiştirilir: metinler hemen değişir, pencere açık kalır, tercih saklanır, yeniden açılışta korunur, kayıtlar değişmez", async () => {
  const day = { "2026-10-14": { brain: "", main: { text: "Rapor", step: "Dosyayı aç", done: false }, extras: [{ text: "", done: false }, { text: "", done: false }], start: { when: "", where: "", what: "" }, time: { budget: "", custom: "" }, evening: { worked: "", easier: "" }, rating: null, ratingNote: "", updatedAt: "2026-10-14T07:00:00.000Z" } };
  const { ctx, page, errors } = await newPage({ hash: "#gunum", seed: { "gx.ssc.days.v1": JSON.stringify(day), "gx.ssc.meta": JSON.stringify({ schema: 3 }) } });
  await page.locator("#f-main").waitFor();
  await page.click("#open-settings");
  const options = await page.$$eval('#lang-choices label', (e) => e.map((x) => [x.textContent, x.querySelector("span").getAttribute("lang")]));
  assert.deepEqual(options, LANGS.map((l) => [I[l].name, l]), "dil adları kendi dillerinde ve lang ile işaretli");
  await page.click('label[for="lang-de"]');
  await page.locator("#settings-title", { hasText: I.de.settings.title }).waitFor();
  assert.equal(await page.evaluate(() => document.getElementById("settings").open), true, "pencere açık kalır");
  assert.equal(await page.evaluate(() => document.activeElement.id), "lang-de", "odak seçili dilde");
  assert.deepEqual(await tabs(page), [I.de.nav.read, I.de.nav.day, I.de.nav.habit]);
  assert.equal(await page.getAttribute("html", "lang"), "de");
  assert.equal((await lsSettings(page)).lang, "de");
  await page.screenshot({ path: join(shots, "lang-01-ayarlar-de.png"), fullPage: true });
  await page.click("#close-settings");
  // Arkadaki ekran da yeni dilde ve yazılan metin yerinde
  assert.equal(await page.inputValue("#f-main"), "Rapor");
  assert.equal(await page.textContent("label[for=f-main]"), I.de.day.mainLabel);
  await page.reload();
  await page.locator("#f-main").waitFor();
  assert.deepEqual(await tabs(page), [I.de.nav.read, I.de.nav.day, I.de.nav.habit], "yeniden açılışta tercih korunur");
  // Yedeğe dil tercihi girmez
  const backup = JSON.parse(await page.evaluate(() => window.GX_STORE.createStore(localStorage).exportText()));
  assert.equal(backup.settings.lang, undefined);
  assert.equal(backup.days["2026-10-14"].main.text, "Rapor");
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Açılış ekranındaki dil düğmesi Ayarlar'ı dil seçimiyle açar", async () => {
  const { ctx, page } = await newPage({ locale: "en-US" });
  await page.click("#home-language");
  assert.equal(await page.evaluate(() => document.activeElement.id), "lang-en");
  await page.click('label[for="lang-tr"]');
  await page.locator("#settings-title", { hasText: I.tr.settings.title }).waitFor();
  await page.click("#close-settings");
  assert.equal(await page.textContent("#home-language"), "Dil: Türkçe");
  await ctx.close();
});

await run("Kitap seçilen dilde açılır: başlık, bölüm adı ve metin o dilde; 'yalnızca Türkçe' notu yok; dil değişince okuma konumu korunur", async () => {
  const sb = { window: {} };
  for (const l of LANGS) vm.runInNewContext(readFileSync(join(here, "..", "app", "src", "content", `book.${l}.js`), "utf8"), sb);
  const B = JSON.parse(JSON.stringify(sb.window.GX_BOOKS));
  for (const l of LANGS) {
    const { ctx, page } = await newPage({ hash: "#oku", seed: { "gx.ssc.settings.v1": JSON.stringify({ lang: l }) } });
    await page.locator("#toc-title").waitFor();
    assert.equal(await page.locator("#book-lang-note").count(), 0, l);
    assert.deepEqual(await page.$$eval(".toc__title", (e) => e.map((x) => x.textContent)), B[l].chapters.map((c) => c.title), l);
    await page.click('[data-open-chapter="bolum-2"]');
    assert.equal(await page.textContent("#chapter-title"), B[l].chapters[2].title, l);
    assert.equal(await page.getAttribute("#chapter-title", "lang"), null);
    assert.equal(await page.textContent("#blk-b2-ozet"), I[l].reader.summaryLabel + B[l].chapters[2].blocks.find((b) => b.id === "b2-ozet").text);
    if (l === "en") await page.screenshot({ path: join(shots, "lang-02-kitap-en.png") });
    await ctx.close();
  }
  // Okuma konumu bölüm/blok kimliğiyle saklanır; dil değişince aynı bölümde kalınır
  const { ctx, page } = await newPage({ hash: "#oku-bolum-1" });
  await page.locator("#chapter-title", { hasText: B.en.chapters[1].title }).waitFor();
  await page.click("#open-language");
  await page.click('label[for="lang-de"]');
  await page.click("#close-settings");
  await page.locator("#chapter-title", { hasText: B.de.chapters[1].title }).waitFor();
  await ctx.close();
});

await run("Tarihler ve takvim seçilen dilde; pazartesi başlangıç korunur", async () => {
  const { ctx, page } = await newPage({ locale: "tr-TR", hash: "#gunum", seed: { "gx.ssc.settings.v1": JSON.stringify({ lang: "fr" }) } });
  await page.click("#cal-toggle");
  await page.locator("#cal-title").waitFor();
  assert.equal(await page.textContent("#cal-title"), I.fr.calendar.monthTitle.replace("{month}", I.fr.dates.months[9]).replace("{year}", "2026"));
  assert.deepEqual(await page.$$eval(".cal__wd", (e) => e.map((x) => x.textContent)), I.fr.dates.weekdaysMondayFirst);
  assert.ok(/octobre/.test(await page.evaluate(() => document.body.innerText)), "tarih Fransızca biçimlenir");
  await ctx.close();
});

await run("Türkçe dışındaki dillerde başlama planı ve alışkanlık özeti etiketli gösterilir (Türkçe ek kuralı uygulanmaz)", async () => {
  const { ctx, page } = await newPage({ locale: "en-US", hash: "#gunum" });
  await page.fill("#f-step", "Open the file");
  await page.click("#d-start summary");
  await page.fill("#f-when", "After lunch");
  await page.fill("#f-where", "kütüphanede");
  await page.locator("#start-out dl").waitFor();
  assert.equal(await page.locator("#start-sentence").count(), 0);
  assert.match(await page.textContent("#start-out"), new RegExp(I.en.day.startWhere));
  await ctx.close();
  const tr = await newPage({ hash: "#gunum", seed: { "gx.ssc.settings.v1": JSON.stringify({ lang: "tr" }) } });
  await tr.page.fill("#f-step", "Dosyayı açmak");
  await tr.page.click("#d-start summary");
  await tr.page.fill("#f-when", "Öğleden sonra");
  await tr.page.fill("#f-where", "Kütüphanede");
  await tr.page.locator("#start-sentence").waitFor();
  await tr.ctx.close();
});

await run("Başlangıç hatası ekranı seçilmiş dilde (Almanca) görünür", async () => {
  const { ctx, page } = await newPage({ locale: "de-DE", seed: { "gx.ssc.settings.v1": JSON.stringify({ lang: "de" }) }, init: () => Object.defineProperty(window, "GX_STORE", { get() { return undefined; }, set() {}, configurable: false }) });
  await page.locator("#boot-error").getByRole("heading", { name: I.de.boot.errorTitle }).waitFor({ timeout: 4000 });
  await page.getByRole("button", { name: I.de.boot.reload }).waitFor();
  assert.equal(await page.getAttribute("html", "lang"), "de");
  await ctx.close();
});

await run("7 dilde 320 px'te yatay taşma yok; sekmeler sığar; dokunma alanları ≥ 44 px (normal ve %200 yazı)", async () => {
  for (const l of LANGS) {
    for (const big of [false, true]) {
      const { ctx, page } = await newPage({ viewport: { width: 320, height: 640 }, seed: { "gx.ssc.settings.v1": JSON.stringify({ lang: l }) } });
      if (big) await page.addStyleTag({ content: "html{font-size:200% !important}" });
      for (const hash of ["#hosgeldin", "#oku", "#oku-bolum-2", "#gunum", "#aliskanlik", "#aliskanlik-kur", "#gecmis", "settings"]) {
        if (hash === "settings") await page.click("#open-settings");
        else { await page.evaluate((h) => { location.hash = h; }, hash); await page.waitForTimeout(50); }
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
        const m = await page.evaluate(() => {
          const over = [...document.querySelectorAll("button, a, label, h1, h2, h3, p, legend, summary")].filter((e) => {
            const r = e.getBoundingClientRect();
            if (e.closest(".visually-hidden, .skip")) return false;
            return r.width > 0 && (r.right > document.documentElement.clientWidth + 1 || e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== "visible");
          }).map((e) => (e.id || e.className || e.tagName) + ":" + e.textContent.slice(0, 30));
          const tabs = [...document.querySelectorAll(".tab")].map((e) => [e.getBoundingClientRect().height, e.scrollWidth <= e.clientWidth + 1]);
          return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over, tabs };
        });
        assert.ok(m.sw <= m.cw, `${l}${big ? " %200" : ""} ${hash}: yatay taşma ${m.sw}>${m.cw}`);
        assert.deepEqual(m.over, [], `${l}${big ? " %200" : ""} ${hash}: taşan öğe`);
        for (const [hgt, fits] of m.tabs) { assert.ok(hgt >= 44, `${l} sekme yüksekliği ${hgt}`); assert.ok(fits, `${l} sekme metni sığmıyor`); }
      }
      if (!big) {
        await page.evaluate(() => document.getElementById("close-settings").click());
        await page.evaluate(() => { location.hash = "#hosgeldin"; });
        await page.screenshot({ path: join(shots, `lang-10-acilis-320-${l}.png`), fullPage: true });
      }
      await ctx.close();
    }
  }
});

await browser.close();
server.close();
for (const r of results) console.log(r[0].padEnd(5), r[1].padEnd(90), r[2] ? "→ " + r[2] : "");
const failed = results.filter((r) => r[0] !== "OK").length;
console.log(`\n${results.length - failed}/${results.length} dil testi geçti`);
process.exit(failed ? 1 : 0);
