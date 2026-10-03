// Uçtan uca testler (Chromium, Playwright). Gerçek iPhone/Android/iPad testi DEĞİLDİR; ekran boyutu taklididir.
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
const v1Html = readFileSync(join(here, "fixtures", "v1-app.html")); // önceki sürüm: geçiş testi için
const v1Backup = join(here, "fixtures", "v1-backup.json");
const shots = process.env.SHOTS_DIR || join(here, "screenshots");
mkdirSync(shots, { recursive: true });

// Aynı adres (origin) altında eski ve yeni sürüm: localStorage paylaşılır, tıpkı aynı bağlantının güncellenmesi gibi.
const server = createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(req.url.startsWith("/v1") ? v1Html : distHtml);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const URL_ = BASE + "/";

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try {
    await fn();
    results.push(["OK", name]);
  } catch (e) {
    results.push(["HATA", name, e.message.split("\n").filter(Boolean).slice(0, 8).join(" | ")]);
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
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fontlar yüklenmezse de düzen bozulmamalı
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  if (opts.time) await page.clock.install({ time: opts.time });
  await page.goto((opts.base || URL_) + (opts.hash || ""));
  return { ctx, page, errors };
}

async function noOverflow(page, label) {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  assert.ok(r.sw <= r.cw, `${label}: yatay taşma ${r.sw} > ${r.cw}`);
}
async function smallTargets(page) {
  return page.evaluate(() => [...document.querySelectorAll("button, summary, a, .choice span, .check, input[type=text], textarea")]
    .filter((el) => el.checkVisibility() && !el.closest(".visually-hidden"))
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && (r.width < 44 || r.height < 44))
    .map(({ el, r }) => `${el.tagName}.${el.className} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || "").trim().slice(0, 20)}"`));
}

const waitSaved = (page) => page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
const openSection = (page, id) => page.evaluate((id) => { document.getElementById(id).open = true; }, id);
const lsDays = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.days.v1") || "{}"));
const lsHabit = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.habit.v1") || "null"));

async function createHabit(page, { goal = "Düzenli matematik çalışmak", place = "Masamda" } = {}) {
  await page.goto(URL_ + "#aliskanlik");
  await page.click("#habit-setup");
  await page.fill("#w-goal", goal);
  await page.click("#wizard-next");
  await page.click("#use-example"); // örnek yalnızca kullanıcı isteyince doldurulur
  await page.click("#wizard-next");
  await page.fill("#w-anchor", "Akşam yemeğinden sonra");
  await page.click("#wizard-next");
  await page.fill("#w-place", place);
  await page.click("#wizard-next");
  await page.click("#wizard-skip");
  await page.fill("#w-smaller", "Yalnızca bir soruyu okumak");
  await page.click("#wizard-next");
  await page.locator("#wizard-summary").waitFor();
  await page.click("#wizard-finish");
  await page.locator("#habit-week").waitFor();
}

/* 1) Mevcut (eski sürüm) günlük kaydın güncellenmiş sürümde okunması */
await run("Eski sürümde arayüzden girilen kayıt ve tercihler yeni sürümde okunur", async () => {
  const { ctx, page, errors } = await newPage({ base: BASE + "/v1", hash: "#planla", time: new Date("2026-10-01T09:00:00+03:00") });
  await page.fill("#f-main", "Eski sürümde yazılan iş");
  await page.fill("#f-step", "Taslağı açmak");
  await page.fill("#f-when", "Öğleden sonra");
  await page.fill("#f-where", "kütüphanede");
  await page.fill("#f-what", "Bambaşka bir başlangıç");
  await page.fill("#f-worked", "Sessiz ortam");
  await page.locator("label[for=f-main-done]").click();
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.getByRole("button", { name: "Ayarlar ve veriler" }).click();
  await page.locator("label:has(#motion-off)").click();
  await page.goto(BASE + "/v1#oku-bolum-1");
  await page.evaluate(() => document.getElementById("blk-b1-h2").scrollIntoView());
  await page.waitForTimeout(400);

  // Aynı adreste yeni sürüm
  await page.goto(URL_ + "#gun-2026-10-01");
  assert.equal(await page.inputValue("#f-main"), "Eski sürümde yazılan iş");
  assert.equal(await page.inputValue("#f-step"), "Taslağı açmak");
  assert.equal(await page.isChecked("#f-main-done"), true);
  assert.equal(await page.evaluate(() => document.getElementById("d-start").open), true, "dolu bölüm açık gelir");
  // Eski "ne yapacağım?" metni gösterilir, sessizce silinmez
  await page.locator("#legacy-what").getByText("Bambaşka bir başlangıç").waitFor();
  assert.equal((await lsDays(page))["2026-10-01"].start.what, "Bambaşka bir başlangıç");
  assert.equal(await page.evaluate(() => document.documentElement.dataset.motion), "off", "animasyon tercihi korunur");
  await page.screenshot({ path: join(shots, "01-eski-kayit-yeni-surum.png"), fullPage: true });
  // Kullanıcı eşitlemeyi seçerse
  await page.click("#legacy-use-step");
  await waitSaved(page);
  assert.equal((await lsDays(page))["2026-10-01"].start.what, "");
  await page.locator("#start-sentence").getByText("Öğleden sonra, kütüphanede şu adımla başlayacağım: taslağı açmak").waitFor();
  // Okuma konumu korunur
  await page.goto(URL_ + "#hosgeldin");
  await page.click("#start-reading");
  await page.waitForTimeout(300);
  const visible = await page.evaluate(() => { const r = document.getElementById("blk-b1-h2").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
  assert.ok(visible, "eski sürümde kalınan yer açılmalı");
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* Açılış ekranı */
await run("Açılış: kapak, açıklama, iki düğme, alışkanlık bağlantısı; tekrar gelende devam seçeneği", async () => {
  const { ctx, page, errors } = await newPage();
  await page.getByText("Kısa bir okuma, daha net bir günlük plan ve küçük bir alışkanlık denemesi.").waitFor();
  await page.getByRole("button", { name: "Okumaya başla" }).waitFor();
  await page.getByRole("button", { name: "Bugünümü planla" }).waitFor();
  await page.locator("#habit-link").waitFor();
  assert.equal(await page.locator("#home-continue").count(), 0, "ilk açılışta devam seçeneği yok");
  await page.screenshot({ path: join(shots, "02-acilis-390.png"), fullPage: true });
  await page.click("#start-reading");
  await page.getByRole("heading", { name: "Başlarken" }).waitFor();
  await page.goto(URL_);
  await page.locator("#home-continue").waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* 2) Yeni günlük plan: kaydet, yeniden aç; zaman seçimi; tekrar eden alan yok */
await run("Yeni günlük plan kaydedilir ve yeniden açılınca korunur (zaman seçimi dahil)", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum", time: new Date("2026-10-02T09:00:00+03:00") });
  // İlk bakışta yalnızca ana iş ve ilk adım görünür
  const visibleInputs = await page.evaluate(() => [...document.querySelectorAll("#day-form input[type=text], #day-form textarea")].filter((e) => e.checkVisibility()).map((e) => e.id));
  assert.deepEqual(visibleInputs, ["f-main", "f-step"]);
  assert.equal(await page.locator("#f-what").count(), 0, "\"ne yapacağım?\" alanı tekrar sorulmaz");
  await page.screenshot({ path: join(shots, "03-gunum-ilk-bakis-390.png"), fullPage: true });

  await page.fill("#f-main", "Sunumun ilk taslağı");
  await page.fill("#f-step", "Dosyayı açıp üç başlık yazmak");
  await page.click("#d-brain > summary");
  await page.fill("#f-brain", "Kira mesajı\nİade kargosu – çğıöşü ÇĞİÖŞÜ");
  await page.click("#d-extras > summary");
  await page.fill("#f-extra1", "Annemi ara");
  await page.locator("label[for=f-extra1-done]").click();
  await page.click("#d-start > summary");
  await page.fill("#f-when", "Öğle yemeğinden sonra");
  await page.fill("#f-where", "kütüphanede");
  await page.locator("#start-sentence").getByText("Öğle yemeğinden sonra, kütüphanede şu adımla başlayacağım: dosyayı açıp üç başlık yazmak").waitFor();
  await page.locator("label[for=time-15]").click();
  await page.locator("#time-tip").getByText("On beş dakikada").waitFor();
  assert.equal(await page.inputValue("#f-step"), "Dosyayı açıp üç başlık yazmak", "zaman seçimi görevi değiştirmez");
  await page.click("#d-evening > summary");
  await page.fill("#f-worked", "Telefonu başka odaya koymak");
  await waitSaved(page);
  await page.screenshot({ path: join(shots, "04-gunum-dolu-390.png"), fullPage: true });

  await page.reload();
  assert.equal(await page.inputValue("#f-main"), "Sunumun ilk taslağı");
  assert.equal(await page.inputValue("#f-brain"), "Kira mesajı\nİade kargosu – çğıöşü ÇĞİÖŞÜ");
  assert.equal(await page.isChecked("#f-extra1-done"), true);
  assert.equal(await page.isChecked("#time-15"), true);
  assert.equal(await page.inputValue("#f-worked"), "Telefonu başka odaya koymak");
  // Kendim belirleyeceğim
  await page.locator("label[for=time-custom]").click();
  await page.fill("#f-time-custom", "45 dakika");
  await waitSaved(page);
  await page.reload();
  assert.equal(await page.inputValue("#f-time-custom"), "45 dakika");
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* 4) Gün değiştiğinde eski verilerin korunması */
await run("Gece yarısı geçince eski günün kaydı korunur, yeni gün ayrı saklanır", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", time: new Date("2026-10-01T23:58:00+03:00") });
  await page.fill("#f-main", "1 Ekim işi");
  await waitSaved(page);
  await page.clock.fastForward("05:00");
  await page.fill("#f-step", "gece yarısından sonra yazıldı");
  await waitSaved(page);
  await page.getByText("Yeni bir gün başladı").waitFor();
  await page.getByRole("button", { name: "Bugünün planını aç" }).click();
  await page.waitForFunction(() => document.getElementById("f-main")?.value === "");
  await page.fill("#f-main", "2 Ekim işi");
  await waitSaved(page);
  const days = await lsDays(page);
  assert.equal(days["2026-10-01"].main.text, "1 Ekim işi");
  assert.equal(days["2026-10-01"].main.step, "gece yarısından sonra yazıldı");
  assert.equal(days["2026-10-02"].main.text, "2 Ekim işi");
  await ctx.close();
});

/* Geçmiş günler: Günüm'ün ikincil ekranı */
await run("Geçmiş günler: özet (tarih, ana iş, akşam notu), açılınca ayrıntı, düzenleme ve onaylı silme", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", time: new Date("2026-10-01T10:00:00+03:00") });
  await page.fill("#f-main", "Dünkü ana iş");
  await page.fill("#f-step", "Dünkü ilk adım");
  await page.click("#d-evening > summary");
  await page.fill("#f-worked", "Kısa molalar işe yaradı");
  await waitSaved(page);
  await page.clock.setSystemTime(new Date("2026-10-02T10:00:00+03:00"));
  await page.reload();
  await page.fill("#f-main", "Bugünkü ana iş");
  await waitSaved(page);
  await page.click("#open-history");
  await page.getByRole("button", { name: "Günüm" }).first().waitFor();
  assert.equal(await page.locator('[data-nav="gunum"][aria-current="page"]').count(), 1, "Günüm sekmesi seçili görünür");
  const item = page.locator('details[data-day="2026-10-01"]');
  await item.getByText("Dünkü ana iş").waitFor();
  await item.getByText("Akşam notu: Kısa molalar işe yaradı").waitFor();
  assert.equal(await item.getByText("Dünkü ilk adım").isVisible(), false, "ayrıntı kapalıyken görünmez");
  await item.locator("summary").click();
  await item.getByText("Dünkü ilk adım").waitFor();
  await page.screenshot({ path: join(shots, "05-gecmis-390.png"), fullPage: true });
  await page.locator('[data-open-day="2026-10-01"]').click();
  await page.getByText("Bu gün geçmişte kaldı").waitFor();
  await page.fill("#f-main", "Dünkü ana iş (düzenlendi)");
  await waitSaved(page);
  await page.click("#open-history");
  await page.getByText("Dünkü ana iş (düzenlendi)").waitFor();
  await page.locator('details[data-day="2026-10-01"] summary').click();
  await page.locator('[data-delete-day="2026-10-01"]').click();
  await page.getByRole("button", { name: "Vazgeç" }).click();
  await page.locator('details[data-day="2026-10-01"]').waitFor();
  assert.equal((await lsDays(page))["2026-10-01"].main.text, "Dünkü ana iş (düzenlendi)", "vazgeçince silinmez");
  await page.locator('[data-delete-day="2026-10-01"]').click();
  await page.getByRole("button", { name: "Evet, sil" }).click();
  await page.locator('details[data-day="2026-10-01"]').waitFor({ state: "detached" });
  await page.locator('details[data-day="2026-10-02"]').waitFor();
  await ctx.close();
});

/* 3) Alışkanlık: oluşturma, günlük kayıt, değiştirme, düzenleme (hedef değişince eski kayıtlar korunur) */
await run("Alışkanlık: adım adım kurulum, özet, günlük kayıt ve kaydı sonradan değiştirme", async () => {
  const { ctx, page, errors } = await newPage({ time: new Date("2026-10-02T20:00:00+03:00") });
  await page.goto(URL_ + "#aliskanlik");
  await page.click("#habit-setup");
  // Zorunlu adım boş geçilemez, anlaşılır hata
  await page.click("#wizard-next");
  await page.getByText("Devam etmek için bu alanı kısaca doldur.").waitFor();
  assert.equal(await page.getAttribute("#w-goal", "aria-invalid"), "true");
  assert.equal(await page.inputValue("#w-goal"), "", "örnek otomatik doldurulmaz");
  await page.screenshot({ path: join(shots, "06-aliskanlik-kurulum-390.png"), fullPage: true });
  await page.goto(URL_ + "#aliskanlik"); // yarıda bırak
  await createHabit(page);
  await page.locator("#plan-sentence").getByText("Akşam yemeğinden sonra, masamda şunu deneyeceğim: beş dakika çalışmak").waitFor();
  await page.getByText("Yalnızca bir soruyu okumak").first().waitFor();
  // Bugün
  await page.locator("label[for=hstatus-smaller]").click();
  await page.fill("#f-hnote", "Yorgundum ama masada kitap hazırdı");
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("gx.ssc.habit.v1")).log["2026-10-02"]?.note === "Yorgundum ama masada kitap hazırdı");
  await page.screenshot({ path: join(shots, "07-aliskanlik-390.png"), fullPage: true });
  let hb = await lsHabit(page);
  assert.equal(hb.log["2026-10-02"].status, "smaller");
  assert.equal(hb.log["2026-10-02"].note, "Yorgundum ama masada kitap hazırdı");
  // Kaydı değiştir
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
  // Önceki günü yedi günlük görünümden seç ve kaydet
  await page.click('[data-hday="2026-09-30"]');
  await page.locator("label[for=hstatus-skipped]").click();
  await waitSaved(page);
  await page.reload();
  hb = await lsHabit(page);
  assert.equal(hb.log["2026-10-02"].status, "done");
  assert.equal(hb.log["2026-09-30"].status, "skipped");
  // Kaçırılan gün kırmızı başarısızlık işareti değil, nötr gösterilir
  const dotColor = await page.evaluate(() => getComputedStyle(document.querySelector('[data-hday="2026-09-30"] .dot')).borderColor);
  assert.ok(!/rgb\((1[5-9]\d|2\d\d), (\d|[1-7]\d), (\d|[1-7]\d)\)/.test(dotColor), "kırmızı değil: " + dotColor);
  // Puan/seri sayacı yok
  const body = await page.evaluate(() => document.body.innerText);
  assert.ok(!/seri|puan|rozet/i.test(body));
  // Değerlendirme
  await page.click("#d-review > summary");
  await page.fill("#f-rfit", "Bir soru çözmek");
  await page.waitForFunction(() => Object.values(JSON.parse(localStorage.getItem("gx.ssc.habit.v1")).reviews)[0]?.fit === "Bir soru çözmek");
  assert.equal((await lsHabit(page)).reviews[hb.activePlanId].fit, "Bir soru çözmek");
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Alışkanlık planı düzenlenir; hedef değişince eski kayıtlar eski plana ait kalır", async () => {
  const { ctx, page } = await newPage({ time: new Date("2026-10-02T20:00:00+03:00") });
  await createHabit(page, { goal: "Matematik çalışmak" });
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
  const oldId = (await lsHabit(page)).activePlanId;
  // Hedefi değiştirmeden yeri düzenle → aynı plan
  await page.click("#habit-edit");
  assert.equal(await page.inputValue("#w-goal"), "Matematik çalışmak");
  for (let i = 0; i < 3; i++) await page.click("#wizard-next");
  await page.fill("#w-place", "Kütüphanede");
  for (let i = 0; i < 3; i++) await page.click("#wizard-next");
  await page.click("#wizard-finish");
  await page.getByText("Plan kaydedildi.").waitFor();
  assert.equal((await lsHabit(page)).activePlanId, oldId);
  // Hedefi değiştir → yeni plan; bugünkü kayıt eski planda
  await page.click("#habit-edit");
  await page.fill("#w-goal", "Her gün kısa yürüyüş");
  for (let i = 0; i < 6; i++) await page.click("#wizard-next");
  await page.click("#wizard-finish");
  await page.getByText("Önceki kayıtların eski plana bağlı kalacak").waitFor();
  const hb = await lsHabit(page);
  assert.notEqual(hb.activePlanId, oldId);
  assert.equal(hb.log["2026-10-02"].planId, oldId);
  assert.equal(hb.plans[oldId].goal, "Matematik çalışmak");
  await page.locator("#older-plan-note").getByText("Matematik çalışmak").waitFor();
  await page.locator("#previous-plans").getByText("Matematik çalışmak · 1 günlük kayıt").waitFor();
  assert.equal(await page.locator('[data-hday="2026-10-02"] .dot--older').count(), 1);
  // Eski plana ait kaydı değiştirmek onu yeni plana taşımaz
  await page.locator("label[for=hstatus-smaller]").click();
  await waitSaved(page);
  assert.equal((await lsHabit(page)).log["2026-10-02"].planId, oldId);
  await ctx.close();
});

/* 5) Yeni yedeğin dışa aktarılıp geri yüklenmesi (çakışmalar onaydan önce gösterilir) */
await run("Yeni yedek (günler + alışkanlık + tercihler) indirilir ve başka profilde geri yüklenir", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.fill("#f-main", "Yedeklenecek iş – ğüşiöç");
  await waitSaved(page);
  await createHabit(page);
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
  await page.click("#open-settings");
  await page.locator("label:has(#textsize-settings-larger)").click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#export-file")]);
  const file = join(shots, "yedek-v2.json");
  await dl.saveAs(file);
  assert.equal(JSON.parse(readFileSync(file, "utf8")).version, 3);
  await ctx.close();

  const b = await newPage({ hash: "#gunum", time: new Date("2026-10-02T12:00:00+03:00") });
  await b.page.fill("#f-main", "Bu cihazda başka iş");
  await waitSaved(b.page);
  await b.page.click("#open-settings");
  await b.page.setInputFiles("#import-file", file);
  const sum = b.page.locator("#import-summary");
  await sum.getByText("1 günün kaydı yedektekiyle değiştirilecek:").waitFor();
  await sum.getByText('"Bu cihazda başka iş" yerine "Yedeklenecek iş – ğüşiöç"').waitFor();
  await sum.getByText("1 günlük alışkanlık kaydı eklenecek.").waitFor();
  await sum.getByText("Yedekteki alışkanlık planı aktif plan olacak.").waitFor();
  await b.page.screenshot({ path: join(shots, "08-geri-yukleme-ozeti-390.png") });
  assert.equal((await lsDays(b.page))["2026-10-02"].main.text, "Bu cihazda başka iş", "onaydan önce değişmez");
  await b.page.click("#import-confirm");
  await b.page.getByText("Geri yükleme tamamlandı.").waitFor();
  assert.equal((await lsDays(b.page))["2026-10-02"].main.text, "Yedeklenecek iş – ğüşiöç");
  const hb = await lsHabit(b.page);
  assert.equal(hb.plans[hb.activePlanId].goal, "Düzenli matematik çalışmak");
  assert.equal(hb.log["2026-10-02"].status, "done");
  await b.ctx.close();
});

/* 6) Eski sürüm yedeğinin kabul edilmesi (alışkanlık verisi silinmez) */
await run("Eski sürüm yedeği kabul edilir; mevcut alışkanlık verisi korunur", async () => {
  const { ctx, page } = await newPage({ time: new Date("2026-10-02T20:00:00+03:00") });
  await createHabit(page);
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
  const before = await lsHabit(page);
  await page.click("#open-settings");
  await page.setInputFiles("#import-file", v1Backup);
  await page.getByText("Bu yedek önceki sürümden ve yalnızca günlük kayıtları içeriyor").waitFor();
  await page.getByText("2 gün eklenecek.").waitFor();
  await page.click("#import-confirm");
  await page.getByText("Geri yükleme tamamlandı.").waitFor();
  assert.deepEqual(await lsHabit(page), before);
  assert.equal((await lsDays(page))["2026-09-30"].main.text, "Eski sürümdeki ana iş");
  await ctx.close();
});

/* 7) Hatalı yedek mevcut verileri değiştirmez */
await run("Hatalı yedekler reddedilir ve hiçbir mevcut veri değişmez", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum" });
  await page.fill("#f-main", "Korunacak iş");
  await waitSaved(page);
  await createHabit(page);
  const snap = () => page.evaluate(() => JSON.stringify(Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)]))));
  await page.click("#open-settings");
  const before = await snap();
  const bad = {
    "bozuk.json": "{ bu json değil",
    "baska.json": JSON.stringify({ app: "baska", version: 2, days: {} }),
    "tarih.json": JSON.stringify({ app: "genix-small-steps-clear-days", version: 1, days: { "2026-02-31": { main: { text: "x" } } } }),
    "alan.json": JSON.stringify({ app: "genix-small-steps-clear-days", version: 2, days: { "2026-10-01": { main: { text: 5 } } } }),
    "plan.json": JSON.stringify({ app: "genix-small-steps-clear-days", version: 2, days: {}, habit: { plans: {}, log: { "2026-10-01": { status: "done", planId: "yok" } } } }),
  };
  for (const [name, content] of Object.entries(bad)) {
    await page.setInputFiles("#import-file", { name, mimeType: "application/json", buffer: Buffer.from(content) });
    await page.getByText("Bu yedek geri yüklenemedi").waitFor();
    await page.getByText("Mevcut kayıtlarında hiçbir değişiklik yapılmadı.").waitFor();
    assert.equal(await page.locator("#import-confirm").count(), 0);
  }
  await page.screenshot({ path: join(shots, "09-hatali-yedek-390.png") });
  assert.equal(await snap(), before);
  await ctx.close();
});

/* Depolama hatası: "Kaydedildi" yok, içerik ekranda, yedek seçeneği */
await run("Depolama yazamazsa \"Kaydedildi\" gösterilmez; yazı ekranda kalır ve yedek metninde yer alır", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException("dolu", "QuotaExceededError"); }; });
  await page.fill("#f-main", "Kaydedilemeyen iş");
  await page.getByText("Kaydedilemedi.").waitFor();
  assert.equal(await page.getByText("Kaydedildi", { exact: true }).count(), 0);
  assert.equal(await page.inputValue("#f-main"), "Kaydedilemeyen iş");
  await page.screenshot({ path: join(shots, "10-kayit-hatasi-390.png") });
  await page.getByRole("button", { name: "Yedeği metin olarak al" }).click();
  const text = await page.inputValue("#export-text");
  assert.equal(JSON.parse(text).days["2026-10-02"].main.text, "Kaydedilemeyen iş");
  await ctx.close();
});

/* Kitap: parçalar, ilerleme, yazı boyutu, araştırma kutusu, kitaptan Günüm'e ve geri */
await run("Kitap: parçalar, konuma dayalı ilerleme, yazı boyutu, açılır kaynaklar ve Günüm'e geçiş", async () => {
  const { ctx, page } = await newPage({ hash: "#oku-bolum-1" });
  await page.getByRole("heading", { name: "Her Şeyi Aklında Tutmak Zorunda Değilsin" }).waitFor();
  assert.equal(await page.locator(".part").count(), 5);
  await page.getByText("Parça 1/5").waitFor();
  const p0 = +(await page.getAttribute("#read-track", "aria-valuenow"));
  assert.equal(p0, 0);
  await page.evaluate(() => document.getElementById("blk-b1-h3").scrollIntoView());
  await page.waitForTimeout(300);
  const p1 = +(await page.getAttribute("#read-track", "aria-valuenow"));
  assert.ok(p1 > 20 && p1 < 80, "ortada ilerleme: " + p1);
  await page.locator(".readbar__title").getByText("Bütün hayatını düzenlemen gerekmiyor").waitFor();
  await page.screenshot({ path: join(shots, "11-okuma-orta-390.png") });
  // Kaynak paneli ve düğmeler ilerlemeye katılmaz: özet görününce %100
  await page.evaluate(() => document.getElementById("blk-b1-ozet").scrollIntoView({ block: "end" }));
  await page.waitForTimeout(300);
  assert.equal(+(await page.getAttribute("#read-track", "aria-valuenow")), 100);
  const srcWeighted = await page.evaluate(() => document.querySelectorAll("#sources [data-w], .chapter-end [data-w], button[data-w]").length);
  assert.equal(srcWeighted, 0);
  // Araştırma kutusu: kısa bulgu + sınırlılık görünür, ayrıntı kapalı
  const research = page.locator("#blk-b1-arastirma-2");
  await research.getByText("Sınırlılık:").waitFor();
  assert.equal(await research.locator("a").isVisible(), false);
  await research.getByText("Ayrıntı ve kaynak").click();
  await research.locator('a[href="https://doi.org/10.1037/xge0000374"]').waitFor();
  // Yazı boyutu kaydedilir
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("label[for=textsize-larger]").click();
  assert.equal(await page.getAttribute(".reader", "data-size"), "larger");
  await page.reload();
  assert.equal(await page.getAttribute(".reader", "data-size"), "larger");
  await page.screenshot({ path: join(shots, "12-okuma-buyuk-yazi-390.png") });
  // Uygulamadan Günüm'e, sonra kitaba dönüş
  await page.locator("[data-to-planner=brain]").click();
  await page.waitForFunction(() => document.activeElement?.id === "f-brain");
  assert.equal(await page.evaluate(() => document.getElementById("d-brain").open), true);
  await page.fill("#f-brain", "Kitaptan gelen not");
  await waitSaved(page);
  await page.click("#back-to-book");
  await page.waitForTimeout(300);
  const visible = await page.evaluate(() => { const r = document.getElementById("blk-b1-uygulama").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
  assert.ok(visible, "uygulama bloğuna dönülmeli");
  // 2. ve 3. bölüm tamamlanmış gibi görünmez
  await page.goto(URL_ + "#oku");
  assert.equal(await page.locator('[data-open-chapter="bolum-2"]').count(), 0);
  assert.equal(await page.getByText("Henüz yazılmadı").count(), 2);
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

/* 8) Animasyon kapalıyken bütün akışlar */
await run("Animasyonlar kapalıyken (cihaz tercihi + uygulama ayarı) bütün akışlar çalışır", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum", reducedMotion: "reduce", time: new Date("2026-10-02T10:00:00+03:00") });
  await page.click("#open-settings");
  await page.getByText("Cihazın azaltılmış hareket tercihi açık").waitFor();
  await page.locator("label:has(#motion-off)").click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.motion), "off");
  await page.click("#close-settings");
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector(".check__box")).transitionDuration), "0s");
  await page.fill("#f-main", "Animasyonsuz iş");
  await page.locator("label[for=f-main-done]").click();
  await page.click("#d-start > summary");
  await page.locator("label[for=time-5]").click();
  await waitSaved(page);
  await page.reload();
  assert.equal(await page.isChecked("#f-main-done"), true);
  await page.click("#open-history");
  await page.getByText("Animasyonsuz iş").waitFor();
  await createHabit(page);
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
  await page.getByRole("button", { name: "Oku" }).click();
  await page.locator("[data-open-chapter=bolum-1]").click();
  await page.locator("[data-to-planner=brain]").click();
  await page.waitForFunction(() => document.activeElement?.id === "f-brain");
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* 9) Küçük ekran ve büyük yazı: taşma yok, dokunma alanları ≥ 44px */
const ROUTES = ["#hosgeldin", "#oku", "#oku-bolum-1", "#gunum", "#gecmis", "#aliskanlik", "#aliskanlik-kur"];
async function seed(page) {
  await page.goto(URL_ + "#gunum");
  await page.fill("#f-main", "Uzun bir ana iş başlığı: kolaylaştırabileceğimiz şeyler üzerine düşünmek");
  await waitSaved(page);
  await createHabit(page);
  await page.locator("label[for=hstatus-done]").click();
  await waitSaved(page);
}

await run("320 px, yatay telefon, tablet ve masaüstünde yatay taşma yok", async () => {
  const sizes = [
    { width: 320, height: 568, tag: "320" },
    { width: 568, height: 320, tag: "568-yatay" },
    { width: 820, height: 1180, tag: "ipad-dikey" },
    { width: 1180, height: 820, tag: "ipad-yatay" },
    { width: 1366, height: 860, tag: "masaustu", desktop: true },
  ];
  for (const s of sizes) {
    const { ctx, page } = await newPage({ viewport: { width: s.width, height: s.height }, isMobile: !s.desktop });
    await seed(page);
    for (const hash of ROUTES) {
      await page.goto(URL_ + hash);
      await page.waitForTimeout(60);
      if (hash === "#gunum") await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
      await noOverflow(page, `${s.tag} ${hash}`);
    }
    await page.click("#open-settings");
    await noOverflow(page, `${s.tag} ayarlar`);
    if (s.tag === "320") await page.screenshot({ path: join(shots, "13-ayarlar-320.png") });
    await page.keyboard.press("Escape");
    if (s.tag === "masaustu" || s.tag === "ipad-yatay") {
      await page.goto(URL_ + "#hosgeldin");
      await page.screenshot({ path: join(shots, `14-acilis-${s.tag}.png`) });
      await page.goto(URL_ + "#aliskanlik");
      await page.screenshot({ path: join(shots, `15-aliskanlik-${s.tag}.png`), fullPage: true });
    }
    if (s.tag === "568-yatay") {
      await page.goto(URL_ + "#oku-bolum-1");
      await page.screenshot({ path: join(shots, "16-okuma-yatay.png") });
    }
    await ctx.close();
  }
});

await run("Büyük yazıda (%200) 320 px'te metin ve düğmeler kesilmez; dokunma alanları ≥ 44 px", async () => {
  const { ctx, page } = await newPage({ viewport: { width: 320, height: 640 } });
  await seed(page);
  const issues = [];
  for (const hash of ROUTES) {
    await page.goto(URL_ + hash);
    await page.reload();
    await page.addStyleTag({ content: "html{font-size:200% !important}" });
    await page.waitForTimeout(80);
    if (hash === "#gunum") await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    await noOverflow(page, `200% ${hash}`);
    // Düğme metni kutusundan taşmıyor
    const clipped = await page.evaluate(() => [...document.querySelectorAll("button, .btn, .choice span")].filter((b) => b.offsetParent && b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim().slice(0, 30)));
    if (clipped.length) issues.push(`${hash}: kesilen düğme ${clipped.join(", ")}`);
    if (hash === "#gunum") await page.screenshot({ path: join(shots, "17-gunum-320-yazi200.png"), fullPage: true });
  }
  // Dokunma alanları normal yazı boyutunda ölçülür
  for (const hash of ROUTES) {
    await page.goto(URL_ + hash);
    await page.reload();
    await page.waitForTimeout(60);
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const small = await smallTargets(page);
    if (small.length) issues.push(`${hash}: küçük dokunma alanı ${small.join("; ")}`);
  }
  assert.deepEqual(issues, []);
  await ctx.close();
});

await run("Klavye: bütün form alanlarının görünür etiketi var, odak göstergesi çalışır", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", isMobile: false, viewport: { width: 1024, height: 768 } });
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  const unlabelled = await page.evaluate(() => [...document.querySelectorAll("#day-form input, #day-form textarea")].filter((el) => !(el.labels && el.labels.length && el.labels[0].textContent.trim())).map((e) => e.id));
  assert.deepEqual(unlabelled, []);
  await page.focus("#f-main");
  await page.keyboard.type("Klavyeyle yazıldı");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await waitSaved(page);
  assert.equal(await page.isChecked("#f-main-done"), true);
  const outline = await page.evaluate(() => getComputedStyle(document.querySelector(".check__box")).outlineStyle);
  assert.equal(outline, "solid");
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
