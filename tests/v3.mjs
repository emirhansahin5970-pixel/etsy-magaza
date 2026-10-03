// Sürüm 3 testleri: takvim, gün değerlendirmesi, açık/koyu tema, v1/v2 uyumluluğu, yedekleme.
// Chromium ile; telefon/tablet yalnızca ekran boyutu taklididir (gerçek cihaz testi DEĞİLDİR).
// Kullanım: node app/build.mjs && node tests/v3.mjs
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
const fx = (f) => readFileSync(join(here, "fixtures", f), "utf8");
const pages = {
  "/": readFileSync(join(here, "..", "app", "dist", "index.html")),
  "/v1": readFileSync(join(here, "fixtures", "v1-app.html")),
  "/v2": readFileSync(join(here, "fixtures", "v2-app.html")),
};
const shots = process.env.SHOTS_DIR || join(here, "screenshots");
mkdirSync(shots, { recursive: true });

const server = createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(pages[req.url.split("#")[0]] || pages["/"]);
}).listen(0);
const BASE = `http://127.0.0.1:${server.address().port}`;
const URL_ = BASE + "/";
const TODAY = new Date("2026-10-14T10:00:00+03:00"); // çarşamba

const browser = await playwright.chromium.launch();
const results = [];
async function run(name, fn) {
  try { await fn(); results.push(["OK", name]); }
  catch (e) { results.push(["HATA", name, e.message.split("\n").filter(Boolean).slice(0, 6).join(" | ")]); }
}
async function newPage(opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 390, height: 844 }, isMobile: opts.isMobile ?? true, hasTouch: true,
    locale: "tr-TR", timezoneId: "Europe/Istanbul", colorScheme: opts.colorScheme || "light", acceptDownloads: true,
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.install({ time: opts.time || TODAY });
  if (opts.seed) await page.addInitScript((seed) => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); for (const k in seed) localStorage.setItem(k, seed[k]); } }, opts.seed);
  await page.goto((opts.base || URL_) + (opts.hash || ""));
  return { ctx, page, errors };
}
const waitSaved = (page) => page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
const lsDays = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.days.v1") || "{}"));
const lsSettings = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("gx.ssc.settings.v1") || "{}"));
async function openCalendar(page) {
  if ((await page.getAttribute("#cal-toggle", "aria-expanded")) !== "true") await page.click("#cal-toggle");
  await page.locator("#cal-title").waitFor();
}
const calTitle = (page) => page.textContent("#cal-title");
const dayCount = (page) => page.locator(".cal__day").count();

function contrast(a, b) {
  const lum = (rgb) => {
    const c = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => +v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/* ---------- Takvim ---------- */
await run("Takvim: varsayılan kapalı, açılınca bugünün ayı; pazartesi başlangıç; bugün ve seçili gün işaretli", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum" });
  assert.equal(await page.getAttribute("#cal-toggle", "aria-expanded"), "false");
  assert.equal(await page.locator("#cal-region").isVisible(), false, "kapalıyken sade günlük görünüm");
  await openCalendar(page);
  assert.equal(await calTitle(page), "Ekim 2026");
  assert.deepEqual(await page.$$eval(".cal__wd", (e) => e.map((x) => x.textContent)), ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]);
  const firstCol = await page.evaluate(() => [...document.querySelectorAll(".cal__grid > *")].slice(7).findIndex((e) => e.id === "cal-day-2026-10-01"));
  assert.equal(firstCol, 3, "1 Ekim 2026 perşembe sütununda");
  assert.equal(await page.getAttribute("#cal-day-2026-10-14", "aria-current"), "date");
  assert.equal(await page.getAttribute("#cal-day-2026-10-14", "aria-pressed"), "true", "açık gün seçili");
  await page.click("#cal-day-2026-10-09");
  assert.equal(await page.getAttribute("#cal-day-2026-10-09", "aria-pressed"), "true");
  assert.equal(await page.getAttribute("#cal-day-2026-10-14", "aria-pressed"), "false");
  const styles = await page.evaluate(() => {
    const t = getComputedStyle(document.getElementById("cal-day-2026-10-14")), s = getComputedStyle(document.getElementById("cal-day-2026-10-09"));
    return { todayBorder: t.borderTopColor, todayBg: t.backgroundColor, selBg: s.backgroundColor, selShadow: s.boxShadow };
  });
  assert.notEqual(styles.todayBg, styles.selBg, "seçili gün bugünden farklı görünür");
  assert.match(styles.selShadow, /inset/);
  assert.match(await page.getAttribute("#cal-day-2026-10-14", "aria-label"), /bugün/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Takvim: ay geçişleri, yıl geçişi ve şubat gün sayıları; Bugüne dön", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", time: new Date("2026-12-20T10:00:00+03:00") });
  await openCalendar(page);
  assert.equal(await calTitle(page), "Aralık 2026");
  assert.equal(await dayCount(page), 31);
  await page.click("#cal-next");
  assert.equal(await calTitle(page), "Ocak 2027", "yıl geçişi");
  await page.click("#cal-next");
  assert.equal(await calTitle(page), "Şubat 2027");
  assert.equal(await dayCount(page), 28);
  for (let i = 0; i < 12; i++) await page.click("#cal-next");
  assert.equal(await calTitle(page), "Şubat 2028");
  assert.equal(await dayCount(page), 29, "artık yıl");
  await page.click("#cal-prev");
  assert.equal(await calTitle(page), "Ocak 2028");
  await page.click("#cal-today");
  assert.equal(await calTitle(page), "Aralık 2026");
  assert.equal(await page.getAttribute("#cal-day-2026-12-20", "aria-pressed"), "true");
  await page.click("#cal-prev");
  await page.click("#cal-prev");
  assert.equal(await calTitle(page), "Ekim 2026");
  assert.equal(await dayCount(page), 31);
  await ctx.close();
});

const SEED = {
  "gx.ssc.days.v1": JSON.stringify({
    "2026-10-14": { main: { text: "Bugünün işi", step: "", done: false }, rating: null, ratingNote: "" },
    "2026-10-02": { main: { text: "Sunum taslağı", step: "Başlıkları yaz", done: true }, extras: [{ text: "Annemi ara", done: true }, { text: "Kargo", done: false }], evening: { worked: "Sabah erken başladım", easier: "" }, rating: 4, ratingNote: "Odaklandım" },
  }),
  "gx.ssc.habit.v1": JSON.stringify({ activePlanId: "p1", plans: { p1: { goal: "Matematik çalışmak", start: "Bir soru", anchor: "Akşam", place: "Masamda", ease: "", smaller: "", createdAt: null, updatedAt: null, archivedAt: null } }, log: { "2026-10-02": { status: "done", note: "", planId: "p1" }, "2026-10-12": { status: "skipped", note: "", planId: "p1" } }, reviews: {}, draft: null }),
};

await run("Takvim: işaretler metinle de anlatılır; seçilen günün özeti; doğru tarih açılır ve bugünün kaydı değişmez", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum", seed: SEED });
  await openCalendar(page);
  const label = await page.getAttribute("#cal-day-2026-10-02", "aria-label");
  assert.match(label, /plan var/);
  assert.match(label, /alışkanlık: Yaptım/);
  assert.match(label, /değerlendirme 4\/5/);
  assert.equal(await page.locator("#cal-day-2026-10-02 .mk-rating").textContent(), "4");
  assert.match(await page.getAttribute("#cal-day-2026-10-05", "aria-label"), /kayıt yok/);
  assert.match(await page.getAttribute("#cal-day-2026-10-12", "aria-label"), /alışkanlık: Yapmadım/);
  // Kayıtsız ya da "yapmadım" günleri kırmızıyla gösterilmez
  const habitColor = await page.evaluate(() => getComputedStyle(document.querySelector("#cal-day-2026-10-12 .mk-habit")).borderTopColor);
  assert.ok(!/rgb\((1[6-9]\d|2\d\d), ([0-6]?\d), ([0-6]?\d)\)/.test(habitColor), "kırmızı değil: " + habitColor);
  await page.getByText("Boş günler bir eksiklik değildir").waitFor();

  await page.click("#cal-day-2026-10-02");
  const sum = page.locator("#cal-summary");
  await sum.getByRole("heading", { name: "2 Ekim 2026 Cuma" }).waitFor();
  await sum.getByText("Sunum taslağı").first().waitFor();
  await sum.getByText("Annemi ara").waitFor();
  await sum.getByText("Küçük adımımı yaptım. · Matematik çalışmak").waitFor();
  await sum.getByText("4 — İyi geçti").waitFor();
  await sum.getByText("Odaklandım").waitFor();
  await sum.getByText("Sabah erken başladım").waitFor();
  await page.screenshot({ path: join(shots, "v3-01-takvim-ozet-390.png"), fullPage: true });
  await page.click("#cal-open-day");
  await page.waitForFunction(() => location.hash === "#gun-2026-10-02");
  assert.equal(await page.inputValue("#f-main"), "Sunum taslağı");
  assert.equal(await page.textContent("#day-date"), "2 Ekim 2026 Cuma");
  assert.equal(await page.getAttribute("#cal-day-2026-10-02", "aria-pressed"), "true", "takvim açık günü seçili gösterir");
  await page.getByText("Bu gün aşağıda açık.").waitFor();
  await page.fill("#f-main", "Sunum taslağı (sonradan düzenlendi)");
  await waitSaved(page);
  const days = await lsDays(page);
  assert.equal(days["2026-10-02"].main.text, "Sunum taslağı (sonradan düzenlendi)");
  assert.equal(days["2026-10-14"].main.text, "Bugünün işi", "bugünün kaydı değişmedi");
  assert.equal(days["2026-10-02"].rating, 4, "düzenleme puanı silmedi");
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Takvim: kayıtsız geçmiş gün için mesaj ve kayıt oluşturma; gelecek gün için plan yazma", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum" });
  await openCalendar(page);
  await page.click("#cal-day-2026-10-06");
  await page.locator("#cal-summary").getByText("Bu gün için henüz kayıt yok.").waitFor();
  await page.click("#cal-create");
  await page.waitForFunction(() => location.hash === "#gun-2026-10-06");
  await page.getByText("Bu gün geçmişte kaldı").waitFor();
  await page.click("#cal-day-2026-10-20");
  await page.locator("#cal-summary").getByText("Bu gün henüz gelmedi").waitFor();
  await page.click("#cal-create");
  await page.waitForFunction(() => location.hash === "#gun-2026-10-20");
  await page.getByRole("heading", { name: "Gelecek bir gün" }).waitFor();
  await page.fill("#f-main", "Diş randevusu");
  await waitSaved(page);
  assert.equal((await lsDays(page))["2026-10-20"].main.text, "Diş randevusu");
  // Gelecek günde değerlendirme kapalı
  await page.click("#d-evening > summary");
  assert.equal(await page.isDisabled("#rating-3"), true);
  assert.equal(await page.isDisabled("#f-rating-note"), true);
  await page.getByText("Bu gün geldiğinde değerlendirebilirsin.").waitFor();
  assert.equal(await page.locator('#cal-day-2026-10-20 .mk-habit').count(), 0);
  assert.equal((await lsDays(page))["2026-10-20"].rating, null);
  await page.screenshot({ path: join(shots, "v3-02-gelecek-gun-390.png"), fullPage: true });
  await ctx.close();
});

/* ---------- Gün değerlendirmesi ---------- */
await run("Değerlendirme: varsayılan seçim yok; yalnızca puan kaydedilir, değiştirilir, kaldırılır; takvimde görünür", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gun-2026-10-10" });
  await page.click("#d-evening > summary");
  await page.getByText("Bu bir başarı puanı değil; gününü kendi gözünden değerlendirmen için.").waitFor();
  assert.equal(await page.locator('input[name="rating"]:checked').count(), 0, "varsayılan puan yok");
  assert.equal(await page.locator("#rating-clear").isVisible(), false);
  await page.locator("label[for=rating-2]").click();
  await waitSaved(page);
  let d = (await lsDays(page))["2026-10-10"];
  assert.equal(d.rating, 2, "yalnızca puan içeren gün kaydedildi");
  assert.equal(d.main.text, "");
  await page.fill("#f-rating-note", "Yorucu bir toplantı");
  await waitSaved(page);
  await page.locator("label[for=rating-4]").click();
  await waitSaved(page);
  await page.reload();
  assert.equal(await page.evaluate(() => document.getElementById("d-evening").open), true, "puanlı gün: bölüm açık gelir");
  assert.equal(await page.isChecked("#rating-4"), true);
  assert.equal(await page.inputValue("#f-rating-note"), "Yorucu bir toplantı");
  await openCalendar(page);
  assert.equal(await page.locator("#cal-day-2026-10-10 .mk-rating").textContent(), "4");
  // Düşük puan kırmızıyla gösterilmez
  const col = await page.evaluate(() => getComputedStyle(document.querySelector("#cal-day-2026-10-10 .mk-rating")).color);
  assert.ok(!/rgb\((1[6-9]\d|2\d\d), ([0-6]?\d), ([0-6]?\d)\)/.test(col), "kırmızı değil: " + col);
  await page.screenshot({ path: join(shots, "v3-03-degerlendirme-390.png"), fullPage: true });
  // Kaldır
  await page.click("#rating-clear");
  await waitSaved(page);
  d = (await lsDays(page))["2026-10-10"];
  assert.equal(d.rating, null);
  assert.equal(d.ratingNote, "Yorucu bir toplantı", "not kalır");
  assert.equal(await page.locator("#cal-day-2026-10-10 .mk-rating").count(), 0);
  await page.fill("#f-rating-note", "");
  await page.waitForFunction(() => !JSON.parse(localStorage.getItem("gx.ssc.days.v1") || "{}")["2026-10-10"], null, { timeout: 3000 });
  assert.equal((await lsDays(page))["2026-10-10"], undefined, "hiçbir şey kalmayınca gün silinir");
  const body = await page.evaluate(() => document.body.innerText);
  assert.ok(!/ortalama|toplam puan|sıralama|seri|%\d/i.test(body), "toplam/ortalama/seri yok");
  assert.deepEqual(errors, []);
  await ctx.close();
});

/* ---------- Tema ---------- */
await run("Tema: ilk kullanımda cihaz ayarı; seçim kaydedilir ve yenilemede (çizimden önce) uygulanır", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum", colorScheme: "dark" });
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.equal(await page.getAttribute("html", "data-theme"), null, "ilk kullanımda seçim yok");
  assert.equal(await bg(), "rgb(25, 27, 26)", "cihaz koyu → koyu zemin");
  await page.click("#open-settings");
  assert.equal(await page.isChecked("#theme-system"), true);
  await page.locator("#theme-system-note").getByText("koyu").waitFor();
  await page.locator("label[for=theme-light]").click();
  assert.equal(await page.getAttribute("html", "data-theme"), "light");
  assert.equal(await bg(), "rgb(251, 246, 236)");
  assert.equal((await lsSettings(page)).theme, "light");
  await page.screenshot({ path: join(shots, "v3-04-ayarlar-gorunum.png") });
  await page.reload();
  assert.equal(await bg(), "rgb(251, 246, 236)", "yenilemeden sonra açık tema");
  // Çizimden önce: ilk betik çalıştığı anda tema öznitelik olarak var
  const early = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  assert.equal(early, "light");
  await page.click("#open-settings");
  await page.locator("label[for=theme-dark]").click();
  await page.reload();
  assert.equal(await page.getAttribute("html", "data-theme"), "dark");
  assert.equal(await bg(), "rgb(25, 27, 26)", "yenilemeden sonra koyu tema");
  await page.click("#open-settings");
  await page.locator("label[for=theme-system]").click();
  assert.equal(await page.getAttribute("html", "data-theme"), null);
  assert.equal((await lsSettings(page)).theme, "system");
  await page.emulateMedia({ colorScheme: "light" });
  assert.equal(await bg(), "rgb(251, 246, 236)", "cihaz açığa dönünce açık");
  await page.emulateMedia({ colorScheme: "dark" });
  assert.equal(await bg(), "rgb(25, 27, 26)");
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("Tema: koyu seçiliyken sayfanın ilk çiziminden önce koyu zemin uygulanır (parlama yok)", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", colorScheme: "light", seed: { "gx.ssc.settings.v1": JSON.stringify({ theme: "dark" }) } });
  // İlk betik, stil dosyasından önce çalışır: <head> içindeki tema betiği → body görünmeden önce data-theme hazır
  const order = await page.evaluate(() => {
    const head = document.head.innerHTML;
    return { scriptBeforeStyle: head.indexOf("data-theme") < head.indexOf("<style"), attr: document.documentElement.getAttribute("data-theme") };
  });
  assert.equal(order.scriptBeforeStyle, true);
  assert.equal(order.attr, "dark");
  await ctx.close();
});

async function readability(page, label) {
  const issues = [];
  const pairs = await page.evaluate(() => {
    const out = [];
    function bgOf(el) {
      while (el) {
        const c = getComputedStyle(el).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
        el = el.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }
    const sel = "h1, h2, h3, p, label, legend, dt, dd, .btn, .tab, .cal__num, .cal__wd, .choice span, .input, .textarea, .hint, summary";
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.checkVisibility() || !el.textContent.trim() && !(el.value)) return;
      out.push({ t: (el.textContent || el.value || "").trim().slice(0, 30), fg: getComputedStyle(el).color, bg: bgOf(el) });
    });
    return out;
  });
  for (const p of pairs) {
    const r = contrast(p.fg, p.bg);
    if (r < 4.5) issues.push(`${label}: "${p.t}" ${r.toFixed(2)}:1`);
  }
  return issues;
}

await run("İki temada metin, form, takvim, diyalog ve hata mesajı okunabilir (canlı sayfada ≥ 4.5:1)", async () => {
  const issues = [];
  for (const scheme of ["light", "dark"]) {
    const { ctx, page } = await newPage({ hash: "#gunum", colorScheme: scheme, seed: SEED });
    await openCalendar(page);
    await page.click("#cal-day-2026-10-02");
    await page.evaluate(() => document.querySelectorAll("#day-form details").forEach((d) => (d.open = true)));
    await page.fill("#f-main", "Okunabilirlik denemesi");
    issues.push(...(await readability(page, scheme + " günüm")));
    await page.screenshot({ path: join(shots, `v3-05-gunum-${scheme}.png`), fullPage: true });
    await page.goto(URL_ + "#oku-bolum-1");
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    issues.push(...(await readability(page, scheme + " kitap")));
    await page.screenshot({ path: join(shots, `v3-06-kitap-${scheme}.png`) });
    await page.goto(URL_ + "#aliskanlik");
    issues.push(...(await readability(page, scheme + " alışkanlık")));
    await page.click("#open-settings");
    await page.setInputFiles("#import-file", { name: "bozuk.json", mimeType: "application/json", buffer: Buffer.from("{bozuk") });
    await page.getByText("Bu yedek geri yüklenemedi").waitFor();
    issues.push(...(await readability(page, scheme + " ayarlar+hata")));
    await page.screenshot({ path: join(shots, `v3-07-ayarlar-hata-${scheme}.png`) });
    await page.keyboard.press("Escape");
    await page.goto(URL_ + "#hosgeldin");
    issues.push(...(await readability(page, scheme + " açılış")));
    await page.screenshot({ path: join(shots, `v3-08-acilis-${scheme}.png`) });
    await ctx.close();
  }
  assert.deepEqual(issues, []);
});

/* ---------- Uyumluluk ---------- */
await run("Gerçek v2 uygulamasında girilen kayıtlar V3'te okunur; yeni alanlar boş başlar", async () => {
  const { ctx, page, errors } = await newPage({ base: BASE + "/v2", hash: "#gunum", time: new Date("2026-10-12T09:00:00+03:00") });
  await page.fill("#f-main", "V2'de yazılan iş");
  await page.click("#d-evening > summary");
  await page.fill("#f-worked", "V2 akşam notu");
  await page.waitForFunction(() => /Kaydedildi/.test(document.getElementById("save-status")?.textContent || ""));
  await page.goto(BASE + "/v2#aliskanlik");
  await page.click("#habit-setup");
  await page.fill("#w-goal", "V2 alışkanlığı");
  await page.click("#wizard-next");
  await page.fill("#w-start", "Bir sayfa");
  await page.click("#wizard-next");
  await page.fill("#w-anchor", "Kahvaltıdan sonra");
  for (let i = 0; i < 4; i++) await page.click(i === 0 ? "#wizard-next" : "#wizard-skip");
  await page.click("#wizard-finish");
  await page.locator("label[for=hstatus-done]").click();
  await page.waitForTimeout(300);
  await page.goto(URL_ + "#gun-2026-10-12");
  assert.equal(await page.inputValue("#f-main"), "V2'de yazılan iş");
  await page.click("#d-evening > summary");
  assert.equal(await page.inputValue("#f-worked"), "V2 akşam notu");
  assert.equal(await page.locator('input[name="rating"]:checked').count(), 0);
  await openCalendar(page);
  assert.match(await page.getAttribute("#cal-day-2026-10-12", "aria-label"), /alışkanlık: Yaptım/);
  await page.click("#cal-day-2026-10-12");
  await page.locator("#cal-summary").getByText("V2 alışkanlığı").waitFor();
  assert.deepEqual(errors, []);
  await ctx.close();
});

await run("v1 ve v2 localStorage verileri V3'te korunur (tercihler dahil)", async () => {
  for (const [file, key, text] of [["v1-localstorage.json", "2026-09-30", "Eski sürümdeki ana iş"], ["v2-localstorage.json", "2026-09-28", "V2 ana iş"]]) {
    const { ctx, page } = await newPage({ hash: "#gun-" + key, seed: JSON.parse(fx(file)) });
    assert.equal(await page.inputValue("#f-main"), text, file);
    const s = await lsSettings(page);
    if (file.startsWith("v2")) assert.equal(s.textSize, "large");
    assert.equal(await page.getAttribute("html", "data-motion"), "off", file + " animasyon tercihi");
    assert.equal(s.theme, undefined, "tema seçimi yok → cihaz ayarı");
    await ctx.close();
  }
});

await run("Eski (v2) yedek geri yüklenince bu cihazdaki puan, not ve tema silinmez; özet bunu söyler", async () => {
  const seed = {
    "gx.ssc.days.v1": JSON.stringify({ "2026-09-28": { main: { text: "Bu cihazdaki iş", step: "", done: false }, rating: 5, ratingNote: "Harika bir gün" } }),
    "gx.ssc.settings.v1": JSON.stringify({ theme: "dark" }),
  };
  const { ctx, page } = await newPage({ hash: "#gunum", seed });
  await page.click("#open-settings");
  await page.setInputFiles("#import-file", join(here, "fixtures", "v2-backup.json"));
  const sum = page.locator("#import-summary");
  await sum.locator("#import-old-fields").waitFor();
  await sum.getByText('"Bu cihazdaki iş · değerlendirme 5" yerine "V2 ana iş · değerlendirme 5"').waitFor();
  await page.click("#import-confirm");
  await page.getByText("Geri yükleme tamamlandı.").waitFor();
  const d = (await lsDays(page))["2026-09-28"];
  assert.equal(d.main.text, "V2 ana iş");
  assert.equal(d.rating, 5);
  assert.equal(d.ratingNote, "Harika bir gün");
  assert.equal((await lsSettings(page)).theme, "dark");
  assert.equal(await page.getAttribute("html", "data-theme"), "dark");
  await ctx.close();
});

await run("Yeni (v3) yedek: puan, not ve tema dışa aktarılır ve başka profilde geri yüklenir", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum" });
  await page.fill("#f-main", "Yedeklenecek iş");
  await page.click("#d-evening > summary");
  await page.locator("label[for=rating-5]").click();
  await page.fill("#f-rating-note", "Uzun yürüyüş");
  await waitSaved(page);
  await page.click("#open-settings");
  await page.locator("label[for=theme-dark]").click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#export-file")]);
  const file = join(shots, "yedek-v3.json");
  await dl.saveAs(file);
  const json = JSON.parse(readFileSync(file, "utf8"));
  assert.equal(json.version, 3);
  assert.equal(json.days["2026-10-14"].rating, 5);
  assert.equal(json.settings.theme, "dark");
  await ctx.close();

  const b = await newPage({ hash: "#gunum" });
  await b.page.click("#open-settings");
  await b.page.setInputFiles("#import-file", file);
  await b.page.locator("#import-summary").getByText("1 gün eklenecek.").waitFor();
  await b.page.locator("#import-summary").getByText("tema").first().waitFor();
  await b.page.click("#import-confirm");
  await b.page.getByText("Geri yükleme tamamlandı.").waitFor();
  const d = (await lsDays(b.page))["2026-10-14"];
  assert.equal(d.rating, 5);
  assert.equal(d.ratingNote, "Uzun yürüyüş");
  assert.equal(await b.page.getAttribute("html", "data-theme"), "dark");
  await b.ctx.close();
});

await run("Geri yükleme önizlemesi: aynı kimlikli planda ve değerlendirme cevaplarında eski/yeni değerler görünür", async () => {
  const { ctx, page } = await newPage({ hash: "#gunum", seed: { "gx.ssc.habit.v1": JSON.stringify({ activePlanId: "p1", plans: { p1: { goal: "Matematik", start: "Bir soru", anchor: "Akşam", place: "Masamda", ease: "", smaller: "", createdAt: null, updatedAt: null, archivedAt: null } }, log: {}, reviews: { p1: { fit: "Bir soru", context: "", shrink: "", updatedAt: null } }, draft: null }) } });
  const backup = { app: "genix-small-steps-clear-days", version: 3, days: {}, habit: { activePlanId: "p1", plans: { p1: { goal: "Matematik", start: "Bir soru", anchor: "Akşam", place: "Kütüphanede", ease: "", smaller: "", createdAt: null, updatedAt: null, archivedAt: null } }, log: {}, reviews: { p1: { fit: "İki soru", context: "Sabah", shrink: "", updatedAt: null } } }, settings: {} };
  await page.click("#open-settings");
  await page.setInputFiles("#import-file", { name: "plan.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(backup)) });
  const sum = page.locator("#import-summary");
  await sum.getByText("1 alışkanlık planı yedektekiyle değiştirilecek:").waitFor();
  await sum.getByText('"Matematik" planı · Nerede: "Masamda" yerine "Kütüphanede"').waitFor();
  await sum.getByText("1 planın değerlendirme cevapları değiştirilecek:").waitFor();
  await sum.getByText('"Matematik" · Hangi başlangıç uydu: "Bir soru" yerine "İki soru"').waitFor();
  await sum.getByText('"Matematik" · Hangi zaman/ortam: "boş" yerine "Sabah"').waitFor();
  await page.screenshot({ path: join(shots, "v3-09-plan-farki-390.png") });
  const before = await page.evaluate(() => localStorage.getItem("gx.ssc.habit.v1"));
  await sum.getByRole("button", { name: "Vazgeç" }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem("gx.ssc.habit.v1")), before, "vazgeçince değişmez");
  await ctx.close();
});

/* ---------- Küçük ekran ---------- */
await run("Takvim 320 px'te taşmaz; gün düğmeleri ≥ 44 px; iki temada; %200 yazıda da taşma yok", async () => {
  for (const scheme of ["light", "dark"]) {
    for (const vp of [{ width: 320, height: 640 }, { width: 568, height: 320 }, { width: 820, height: 1180 }, { width: 1280, height: 800 }]) {
      const { ctx, page } = await newPage({ hash: "#gunum", viewport: vp, colorScheme: scheme, seed: SEED, isMobile: vp.width < 1000 });
      await openCalendar(page);
      await page.click("#cal-day-2026-10-02");
      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        minW: Math.min(...[...document.querySelectorAll(".cal__day")].map((e) => e.getBoundingClientRect().width)),
        minH: Math.min(...[...document.querySelectorAll(".cal__day")].map((e) => e.getBoundingClientRect().height)),
        nav: Math.min(...["cal-prev", "cal-next"].map((id) => document.getElementById(id).getBoundingClientRect().width)),
      }));
      assert.ok(m.sw <= m.cw, `${scheme} ${vp.width}: yatay taşma ${m.sw}>${m.cw}`);
      assert.ok(m.minW >= 44 && m.minH >= 44, `${scheme} ${vp.width}: gün düğmesi ${m.minW.toFixed(1)}×${m.minH.toFixed(1)}`);
      assert.ok(m.nav >= 44);
      if (vp.width === 320) await page.screenshot({ path: join(shots, `v3-10-takvim-320-${scheme}.png`), fullPage: true });
      if (vp.width === 1280) await page.screenshot({ path: join(shots, `v3-11-takvim-genis-${scheme}.png`) });
      await ctx.close();
    }
  }
  const { ctx, page } = await newPage({ hash: "#gunum", viewport: { width: 320, height: 640 }, seed: SEED });
  await openCalendar(page);
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  await page.click("#cal-day-2026-10-02");
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  const r = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  assert.ok(r[0] <= r[1], `%200 yazı: ${r[0]}>${r[1]}`);
  await page.screenshot({ path: join(shots, "v3-12-takvim-320-yazi200.png"), fullPage: true });
  await ctx.close();
});

await run("Animasyon kapalıyken takvim, değerlendirme ve tema akışları çalışır", async () => {
  const { ctx, page, errors } = await newPage({ hash: "#gunum", seed: { ...SEED, "gx.ssc.settings.v1": JSON.stringify({ motion: "off" }) } });
  assert.equal(await page.getAttribute("html", "data-motion"), "off");
  await openCalendar(page);
  await page.click("#cal-next");
  await page.click("#cal-today");
  await page.click("#cal-day-2026-10-02");
  await page.click("#cal-open-day");
  await page.waitForFunction(() => location.hash === "#gun-2026-10-02");
  await page.evaluate(() => { document.getElementById("d-evening").open = true; });
  await page.locator("label[for=rating-3]").click();
  await waitSaved(page);
  await page.click("#open-settings");
  await page.locator("label[for=theme-dark]").click();
  assert.equal(await page.getAttribute("html", "data-theme"), "dark");
  assert.equal((await lsDays(page))["2026-10-02"].rating, 3);
  assert.deepEqual(errors, []);
  await ctx.close();
});

server.close();
await browser.close();
const width = Math.max(...results.map((r) => r[1].length));
for (const r of results) console.log(`${r[0].padEnd(4)}  ${r[1].padEnd(width)}${r[2] ? "  → " + r[2] : ""}`);
const failed = results.filter((r) => r[0] !== "OK").length;
writeFileSync(join(shots, "v3-sonuc.txt"), results.map((r) => r.join(" | ")).join("\n"));
console.log(`\n${results.length - failed}/${results.length} sürüm 3 testi geçti`);
process.exit(failed ? 1 : 0);
