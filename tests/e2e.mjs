// Uçtan uca testler (Chromium, Playwright). Gerçek iPhone/Android testi DEĞİLDİR; ekran boyutu taklididir.
// Kullanım: node app/build.mjs && node tests/e2e.mjs
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }

const here = dirname(fileURLToPath(import.meta.url));
const distHtml = readFileSync(join(here, "..", "app", "dist", "index.html"));
const shots = process.env.SHOTS_DIR || join(here, "screenshots");
mkdirSync(shots, { recursive: true });

// Google Fonts bu ortamda engelli olabilir; testler yedek yazı tipleriyle çalışır.
const server = createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(distHtml);
}).listen(0);
const URL_ = `http://127.0.0.1:${server.address().port}/`;

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try {
    await fn();
    results.push(["OK", name]);
  } catch (e) {
    results.push(["HATA", name, e.message.split("\n")[0]]);
  }
}

async function newPage(opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 390, height: 844 },
    isMobile: opts.isMobile ?? true,
    hasTouch: true,
    deviceScaleFactor: 2,
    locale: "tr-TR",
    timezoneId: "Europe/Istanbul",
    reducedMotion: opts.reducedMotion || "no-preference",
    acceptDownloads: true,
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  if (opts.time) await page.clock.install({ time: opts.time });
  await page.goto(URL_ + (opts.hash || ""));
  return { ctx, page, errors };
}

async function noOverflow(page, label) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  assert.ok(sw <= cw, `${label}: yatay taşma ${sw} > ${cw}`);
}

const waitSaved = (page) => page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));

// 1) Karşılama ekranı ve başlangıç düğmeleri
await run("İlk açılışta karşılama ekranı ve başlangıç düğmeleri görünür", async () => {
  const { ctx, page, errors } = await newPage();
  await page.getByRole("heading", { name: "Küçük Adımlar, Daha Net Günler" }).waitFor();
  await page.getByRole("button", { name: "Okumaya başla" }).waitFor();
  await page.screenshot({ path: join(shots, "01-karsilama-390.png"), fullPage: true });
  await page.getByRole("button", { name: "Okumaya başla" }).click();
  await page.getByRole("heading", { name: "Başlarken" }).waitFor();
  await page.reload();
  await page.getByRole("heading", { name: "Başlarken" }).waitFor(); // karşılama tekrar gelmez
  assert.deepEqual(errors, []);
  await ctx.close();
});

// 2) Kayıt oluşturma, düzenleme ve yenilemede korunma
await run("Günlük kayıt oluşturulur, düzenlenir ve sayfa yenilenince korunur", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#planla", time: new Date("2026-10-02T09:00:00+03:00") });
  await page.fill("#f-brain", "Kira mesajı\nÖdev\nİade kargosu – çğıöşü ÇĞİÖŞÜ");
  await page.fill("#f-main", "Sunumun ilk taslağı");
  await page.fill("#f-step", "Dosyayı açıp üç başlık yazmak");
  await page.fill("#f-extra1", "Annemi ara");
  await page.fill("#f-when", "Öğle yemeğinden sonra");
  await page.fill("#f-where", "kütüphanede");
  await page.fill("#f-what", "ilk başlığı yazarak");
  await page.getByText("Öğle yemeğinden sonra, kütüphanede, ilk başlığı yazarak başlayacağım.").waitFor();
  await page.locator("label[for=f-main-done]").click();
  await waitSaved(page);
  await page.screenshot({ path: join(shots, "02-planlayici-390.png"), fullPage: true });
  await page.reload();
  assert.equal(await page.inputValue("#f-main"), "Sunumun ilk taslağı");
  assert.equal(await page.inputValue("#f-brain"), "Kira mesajı\nÖdev\nİade kargosu – çğıöşü ÇĞİÖŞÜ");
  assert.equal(await page.isChecked("#f-main-done"), true);
  // düzenle
  await page.fill("#f-main", "Sunumun ilk taslağı (düzenlendi)");
  await page.locator("label[for=f-main-done]").click();
  await waitSaved(page);
  await page.reload();
  assert.equal(await page.inputValue("#f-main"), "Sunumun ilk taslağı (düzenlendi)");
  assert.equal(await page.isChecked("#f-main-done"), false);
  assert.deepEqual(errors, []);
  await ctx.close();
});

// 3) Farklı tarihler ayrı saklanır; gece yarısı geçince eski günün üzerine yazılmaz
await run("Farklı tarihler ayrı saklanır ve gün değişince eski kayıt korunur", async () => {
  const { ctx, page } = await newPage({ hash: "#planla", time: new Date("2026-10-01T23:58:00+03:00") });
  await page.fill("#f-main", "1 Ekim işi");
  await waitSaved(page);
  // Uygulama açıkken gece yarısı geçer; aynı forma yazılanlar 1 Ekim'e gitmeli
  await page.clock.fastForward("05:00");
  await page.fill("#f-extra1", "gece yarısından sonra yazıldı");
  await waitSaved(page);
  await page.getByText("Yeni bir gün başladı").waitFor();
  await page.getByRole("button", { name: "Bugünün planını aç" }).click();
  await page.waitForFunction(() => document.getElementById("f-main") && document.getElementById("f-main").value === "");
  await page.fill("#f-main", "2 Ekim işi");
  await waitSaved(page);
  const days = await page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.days.v1")));
  assert.equal(days["2026-10-01"].main.text, "1 Ekim işi");
  assert.equal(days["2026-10-01"].extras[0].text, "gece yarısından sonra yazıldı");
  assert.equal(days["2026-10-02"].main.text, "2 Ekim işi");
  await ctx.close();
});

// 4) Geçmiş günler: görüntüle, düzenle, silmede onay
await run("Geçmiş günler listelenir, düzenlenir; silme onay ister", async () => {
  const { ctx, page } = await newPage({ hash: "#planla", time: new Date("2026-10-01T10:00:00+03:00") });
  await page.fill("#f-main", "Dünkü ana iş");
  await waitSaved(page);
  await page.clock.setSystemTime(new Date("2026-10-02T10:00:00+03:00"));
  await page.goto(URL_ + "#planla");
  await page.reload();
  await page.fill("#f-main", "Bugünkü ana iş");
  await waitSaved(page);
  await page.getByRole("button", { name: "Geçmiş Günler" }).click();
  await page.locator('[data-day="2026-10-01"]').waitFor();
  await page.screenshot({ path: join(shots, "03-gecmis-390.png"), fullPage: true });
  await page.locator('[data-open-day="2026-10-01"]').click();
  await page.getByText("Bu gün geçmişte kaldı").waitFor();
  assert.equal(await page.inputValue("#f-main"), "Dünkü ana iş");
  await page.fill("#f-main", "Dünkü ana iş (sonradan düzenlendi)");
  await waitSaved(page);
  await page.getByRole("button", { name: "Geçmiş Günler" }).click();
  await page.getByText("Dünkü ana iş (sonradan düzenlendi)").waitFor();
  await page.getByText("Bugünkü ana iş").waitFor();
  // Silme: önce vazgeç, sonra onayla
  await page.locator('[data-delete-day="2026-10-01"]').click();
  await page.getByRole("heading", { name: "Bu günü silmek istiyor musun?" }).waitFor();
  await page.getByRole("button", { name: "Vazgeç" }).click();
  await page.locator('[data-day="2026-10-01"]').waitFor();
  await page.locator('[data-delete-day="2026-10-01"]').click();
  await page.getByRole("button", { name: "Evet, sil" }).click();
  await page.locator('[data-day="2026-10-01"]').waitFor({ state: "detached" });
  await page.locator('[data-day="2026-10-02"]').waitFor();
  await ctx.close();
});

// 5) Dışa aktarma ve geri yükleme; 6) hatalı yedek reddi
await run("Yedek dosyası indirilir ve başka bir tarayıcı profilinde geri yüklenir", async () => {
  const { ctx, page } = await newPage({ hash: "#planla", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.fill("#f-main", "Yedeklenecek iş – ğüşiöç");
  await page.fill("#f-worked", "Telefonu başka odaya koymak");
  await waitSaved(page);
  await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  await page.screenshot({ path: join(shots, "04-ayarlar-390.png"), fullPage: false });
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#export-file")]);
  const file = join(shots, "yedek.json");
  await dl.saveAs(file);
  assert.match(dl.suggestedFilename(), /^kucuk-adimlar-yedek-2026-10-02\.json$/);
  await ctx.close();

  const b = await newPage({ hash: "#planla", time: new Date("2026-10-03T10:00:00+03:00") });
  await b.page.fill("#f-main", "Yeni cihazdaki iş");
  await waitSaved(b.page);
  await b.page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  await b.page.setInputFiles("#import-file", file);
  await b.page.getByText("Yedekte 1 gün var").waitFor();
  await b.page.click("#import-confirm");
  await b.page.getByText("1 gün geri yüklendi.").waitFor();
  const days = await b.page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.days.v1")));
  assert.equal(days["2026-10-02"].main.text, "Yedeklenecek iş – ğüşiöç");
  assert.equal(days["2026-10-02"].evening.worked, "Telefonu başka odaya koymak");
  assert.equal(days["2026-10-03"].main.text, "Yeni cihazdaki iş");
  await b.ctx.close();
});

await run("Hatalı yedek dosyaları reddedilir ve mevcut kayıtlar değişmez", async () => {
  const { ctx, page } = await newPage({ hash: "#planla" });
  await page.fill("#f-main", "Korunacak iş");
  await waitSaved(page);
  const before = await page.evaluate(() => localStorage.getItem("gx.ssc.days.v1"));
  await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  const bad = {
    "bozuk.json": "{ bu json değil",
    "baska.json": JSON.stringify({ app: "baska", version: 1, days: {} }),
    "tarih.json": JSON.stringify({ app: "genix-small-steps-clear-days", version: 1, days: { "2026-02-31": { main: { text: "x" } } } }),
    "alan.json": JSON.stringify({ app: "genix-small-steps-clear-days", version: 1, days: { "2026-10-01": { main: { text: 5 } } } }),
  };
  for (const [name, content] of Object.entries(bad)) {
    await page.setInputFiles("#import-file", { name, mimeType: "application/json", buffer: Buffer.from(content) });
    await page.getByText("Bu yedek geri yüklenemedi").waitFor();
    await page.getByText("Mevcut kayıtlarında hiçbir değişiklik yapılmadı.").waitFor();
  }
  await page.screenshot({ path: join(shots, "05-hatali-yedek-390.png"), fullPage: false });
  const after = await page.evaluate(() => localStorage.getItem("gx.ssc.days.v1"));
  assert.equal(after, before);
  await ctx.close();
});

await run("Metin olarak yedek göster + yapıştırarak geri yükle (indirme engelli ortamlar için)", async () => {
  const { ctx, page } = await newPage({ hash: "#planla", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.fill("#f-main", "Metinle taşınan iş");
  await waitSaved(page);
  await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  await page.click("#export-show");
  const text = await page.inputValue("#export-text");
  await page.evaluate(() => localStorage.clear());
  await page.getByRole("button", { name: "Dosya yerine metin yapıştır" }).click();
  await page.fill("#import-paste", text);
  await page.click("#import-paste-check");
  await page.click("#import-confirm");
  await page.getByText("1 gün geri yüklendi.").waitFor();
  const days = await page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.days.v1")));
  assert.equal(days["2026-10-02"].main.text, "Metinle taşınan iş");
  await ctx.close();
});

// 7) Kitap: okuma, kaldığı yer, uygulamadan planlayıcıya geçiş ve geri dönüş
await run("Kitap bölümünden planlayıcıya geçilir ve kitapta kalınan yere dönülür", async () => {
  const { ctx, page } = await newPage({ hash: "#oku-bolum-1" });
  await page.getByRole("heading", { name: "Her Şeyi Aklında Tutmak Zorunda Değilsin" }).waitFor();
  await page.screenshot({ path: join(shots, "06-bolum1-390.png"), fullPage: true });
  await page.locator("[data-to-planner=brain]").click();
  await page.locator("#card-brain.is-highlight").waitFor();
  assert.equal(await page.evaluate(() => document.activeElement.id), "f-brain");
  await page.fill("#f-brain", "Kitaptan gelen not");
  await waitSaved(page);
  await page.click("#back-to-book");
  await page.getByRole("heading", { name: "Her Şeyi Aklında Tutmak Zorunda Değilsin" }).waitFor();
  await page.waitForTimeout(300);
  const visible = await page.evaluate(() => {
    const r = document.getElementById("blk-b1-uygulama").getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  });
  assert.ok(visible, "uygulama bloğu ekranda olmalı");
  // İçindekilerde "Kaldığın yerden devam et"
  await page.getByRole("button", { name: "Kitabı Oku" }).click();
  await page.click("#resume-reading");
  await page.getByRole("heading", { name: "Her Şeyi Aklında Tutmak Zorunda Değilsin" }).waitFor();
  await ctx.close();
});

await run("Üç dakikalık sayaç çalışır ve sona erer", async () => {
  const { ctx, page } = await newPage({ hash: "#oku-bolum-1", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.getByRole("button", { name: "3 dakikalık sayacı başlat" }).click();
  await page.getByText("Kalan süre: 3:00").waitFor();
  await page.clock.fastForward("03:05");
  await page.getByText("Üç dakika doldu.").waitFor();
  await ctx.close();
});

// 8) Küçük ekranlarda taşma yok (dikey ve yatay), büyük yazı boyutunda da
await run("320 px ve yatay yönde hiçbir ekranda yatay taşma yok", async () => {
  const sizes = [
    { width: 320, height: 568, tag: "320" },
    { width: 568, height: 320, tag: "568-yatay" },
    { width: 768, height: 1024, tag: "768" },
    { width: 1280, height: 800, tag: "1280", desktop: true },
  ];
  for (const s of sizes) {
    const { ctx, page } = await newPage({ viewport: { width: s.width, height: s.height }, isMobile: !s.desktop });
    for (const hash of ["#hosgeldin", "#oku", "#oku-bolum-1", "#planla", "#gecmis"]) {
      await page.goto(URL_ + hash);
      await page.waitForTimeout(80);
      await noOverflow(page, `${s.tag} ${hash}`);
    }
    await page.goto(URL_ + "#planla");
    await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
    await noOverflow(page, `${s.tag} ayarlar`);
    if (s.tag === "320") {
      await page.screenshot({ path: join(shots, "07-ayarlar-320.png") });
      await page.keyboard.press("Escape");
      await page.goto(URL_ + "#planla");
      await page.screenshot({ path: join(shots, "08-planlayici-320.png"), fullPage: true });
    }
    if (s.tag === "1280") {
      await page.keyboard.press("Escape");
      await page.goto(URL_ + "#oku-bolum-1");
      await page.screenshot({ path: join(shots, "09-bolum1-1280.png") });
    }
    await ctx.close();
  }
});

await run("Metin %200 büyütüldüğünde 320 px'te içerik kesilmez/taşmaz", async () => {
  const { ctx, page } = await newPage({ viewport: { width: 320, height: 640 } });
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  for (const hash of ["#hosgeldin", "#oku", "#oku-bolum-1", "#planla", "#gecmis"]) {
    await page.goto(URL_ + hash);
    await page.addStyleTag({ content: "html{font-size:200% !important}" });
    await page.waitForTimeout(80);
    await noOverflow(page, `200% ${hash}`);
  }
  await page.goto(URL_ + "#planla");
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  await page.screenshot({ path: join(shots, "10-planlayici-320-yazi200.png") });
  await ctx.close();
});

// 9) Animasyonlar kapalıyken bütün işlevler
await run("Animasyonlar kapalıyken (cihaz tercihi + uygulama ayarı) bütün işlevler çalışır", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#planla", reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  await page.getByText("Cihazın azaltılmış hareket tercihi açık").waitFor();
  await page.locator("label:has(#motion-off)").click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.motion), "off");
  await page.click("#close-settings");
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector(".check__box")).transitionDuration);
  assert.equal(dur, "0s");
  await page.fill("#f-main", "Animasyonsuz iş");
  await page.locator("label[for=f-main-done]").click();
  await waitSaved(page);
  await page.reload();
  assert.equal(await page.isChecked("#f-main-done"), true);
  await page.getByRole("button", { name: "Geçmiş Günler" }).click();
  await page.getByText("Animasyonsuz iş").waitFor();
  await page.getByRole("button", { name: "Kitabı Oku" }).click();
  await page.locator("[data-open-chapter=bolum-1]").click();
  await page.locator("[data-to-planner=brain]").click();
  await page.locator("#card-brain.is-highlight").waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

// 10) Klavye erişimi: sekmeler, onay kutusu ve form alanları klavyeyle kullanılabilir
await run("Klavye ile gezinme ve görev işaretleme çalışır", async () => {
  const { ctx, page } = await newPage({ hash: "#planla", isMobile: false, viewport: { width: 1024, height: 768 } });
  await page.focus("#f-main");
  await page.keyboard.type("Klavyeyle yazıldı");
  await page.focus("#f-main-done");
  await page.keyboard.press("Space");
  await waitSaved(page);
  assert.equal(await page.isChecked("#f-main-done"), true);
  const labelled = await page.evaluate(() =>
    [...document.querySelectorAll("input,textarea")].every((el) => el.labels?.length || el.getAttribute("aria-label"))
  );
  assert.ok(labelled, "her form alanının etiketi olmalı");
  await ctx.close();
});

server.close();
await browser.close();

const width = Math.max(...results.map((r) => r[1].length));
for (const r of results) console.log(`${r[0].padEnd(4)}  ${r[1].padEnd(width)}${r[2] ? "  → " + r[2] : ""}`);
const failed = results.filter((r) => r[0] !== "OK").length;
writeFileSync(join(shots, "sonuc.txt"), results.map((r) => r.join(" | ")).join("\n"));
console.log(`\n${results.length - failed}/${results.length} test geçti`);
process.exit(failed ? 1 : 0);
