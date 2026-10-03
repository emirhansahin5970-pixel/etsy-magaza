// Veri katmanı birim testleri: node --test tests/storage.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const STORE = require("../app/src/storage.js");
const fixture = (f) => readFileSync(new URL("./fixtures/" + f, import.meta.url), "utf8");

function memoryStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
}
function sampleDay(main) {
  const d = STORE.emptyDay();
  d.main.text = main;
  return d;
}
function habitWithPlan(goal = "Matematik çalışmak") {
  return STORE.applyPlanEdit(STORE.emptyHabit(), { goal, start: "Bir soru", anchor: "Akşam yemeğinden sonra", place: "Masamda" }, null);
}

/* ---------- Tarih ---------- */

test("dateKey yerel saati kullanır (gece yarısına yakın UTC kayması yok)", () => {
  assert.equal(STORE.dateKey(new Date(2026, 9, 2, 23, 59)), "2026-10-02");
  assert.equal(STORE.dateKey(new Date(2026, 9, 3, 0, 1)), "2026-10-03");
  assert.equal(STORE.addDays("2026-10-01", -1), "2026-09-30");
});

test("geçersiz tarih anahtarları reddedilir", () => {
  for (const k of ["2026-02-30", "2026-13-01", "26-10-02", "2026-10-2", "abcd-ef-gh", "1999-01-01"]) {
    assert.equal(STORE.isValidDateKey(k), false, k);
  }
  assert.equal(STORE.isValidDateKey("2028-02-29"), true);
});

/* ---------- Geriye uyumluluk ---------- */

test("eski sürümün (şema 1) localStorage kayıtları yeni sürümde okunur, yeni alanlar varsayılan alır", () => {
  const ls = JSON.parse(fixture("v1-localstorage.json"));
  const s = STORE.createStore(memoryStorage(ls));
  const d = s.getDay("2026-09-30");
  assert.equal(d.main.text, "Eski sürümdeki ana iş");
  assert.equal(d.main.done, true);
  assert.equal(d.brain, "Kira mesajı\nÖdev");
  assert.equal(d.start.what, "Farklı bir başlangıç metni", "eski 'ne yapacağım' metni silinmez");
  assert.deepEqual(d.time, { budget: "", custom: "" });
  assert.equal(s.getSettings().motion, "off", "animasyon tercihi korunur");
  assert.equal(s.getSettings().reading.blockId, "b1-h2", "okuma konumu korunur");
  assert.equal(s.getHabit().activePlanId, null);
});

test("eski kayıt düzenlenip kaydedilince diğer alanları ve eski metin kaybolmaz", () => {
  const ls = JSON.parse(fixture("v1-localstorage.json"));
  const st = memoryStorage(ls);
  const s = STORE.createStore(st);
  const d = s.getDay("2026-09-30");
  d.time.budget = "15";
  assert.equal(s.saveDay("2026-09-30", d), true);
  const raw = JSON.parse(st.getItem("gx.ssc.days.v1"));
  assert.equal(raw["2026-09-30"].start.what, "Farklı bir başlangıç metni");
  assert.equal(raw["2026-09-30"].time.budget, "15");
  assert.equal(raw["2026-10-01"].main.text, "Eşleşen başlama", "dokunulmayan gün olduğu gibi kalır");
});

test("eski sürüm yedeği (version 1) kabul edilir ve alışkanlık verisine dokunmaz", () => {
  const s = STORE.createStore(memoryStorage());
  const hb = habitWithPlan().habit;
  hb.log["2026-10-02"] = { status: "done", note: "iyi", planId: hb.activePlanId };
  s.saveHabit(hb);
  s.saveDay("2026-09-30", sampleDay("Bu cihazdaki iş"));

  const res = STORE.parseBackup(fixture("v1-backup.json"));
  assert.equal(res.ok, true);
  assert.equal(res.version, 1);
  assert.equal(res.habit, null);
  const plan = s.planRestore(res);
  assert.equal(plan.daysChanged.length, 1);
  assert.equal(plan.daysChanged[0].key, "2026-09-30");
  assert.deepEqual(plan.daysAdded, ["2026-10-01"]);
  assert.equal(s.applyRestore(res), true);
  assert.equal(s.getHabit().log["2026-10-02"].status, "done", "alışkanlık kaydı silinmedi");
  assert.equal(s.getHabit().activePlanId, hb.activePlanId);
  assert.equal(s.getDay("2026-09-30").main.text, "Eski sürümdeki ana iş");
});

/* ---------- Günlük kayıt ---------- */

test("farklı günler ayrı saklanır; boş gün kaydedilmez", () => {
  const s = STORE.createStore(memoryStorage());
  s.saveDay("2026-10-01", sampleDay("Dünkü iş"));
  s.saveDay("2026-10-02", sampleDay("Bugünkü iş"));
  s.saveDay("2026-10-03", STORE.emptyDay());
  assert.deepEqual(Object.keys(s.getDays()).sort(), ["2026-10-01", "2026-10-02"]);
});

test("yalnızca zaman seçimi yapılmış gün de kaydedilir; geçersiz zaman değeri reddedilir", () => {
  const s = STORE.createStore(memoryStorage());
  const d = STORE.emptyDay();
  d.time.budget = "custom";
  d.time.custom = "45 dakika";
  assert.equal(s.saveDay("2026-10-02", d), true);
  assert.equal(s.getDay("2026-10-02").time.custom, "45 dakika");
  const bad = STORE.emptyDay();
  bad.main.text = "x";
  bad.time.budget = "90";
  assert.equal(s.saveDay("2026-10-03", bad), false);
});

/* ---------- Alışkanlık ---------- */

test("plan oluşturulur; hedef değişince eski kayıtlar eski plana bağlı kalır", () => {
  let { habit, planId } = habitWithPlan();
  habit.log["2026-10-01"] = { status: "done", note: "", planId };
  habit.log["2026-10-02"] = { status: "smaller", note: "yorgundum", planId };

  // Hedef aynı, ayrıntı değişti → aynı plan güncellenir
  let r = STORE.applyPlanEdit(habit, { ...habit.plans[planId], place: "Kütüphanede" }, planId);
  assert.equal(r.versioned, false);
  assert.equal(r.habit.plans[planId].place, "Kütüphanede");

  // Hedef değişti → yeni plan, eski kayıtlar eski planda
  r = STORE.applyPlanEdit(r.habit, { ...r.habit.plans[planId], goal: "Her gün yürümek" }, planId);
  assert.equal(r.versioned, true);
  assert.notEqual(r.planId, planId);
  assert.equal(r.habit.activePlanId, r.planId);
  assert.equal(r.habit.log["2026-10-01"].planId, planId);
  assert.equal(r.habit.log["2026-10-02"].planId, planId);
  assert.ok(r.habit.plans[planId].archivedAt);
  assert.equal(r.habit.plans[planId].goal, "Matematik çalışmak", "eski planın hedefi değişmez");
});

test("kaydı olmayan planın hedefi değişirse yeni plan açılmaz", () => {
  const { habit, planId } = habitWithPlan();
  const r = STORE.applyPlanEdit(habit, { ...habit.plans[planId], goal: "Başka hedef" }, planId);
  assert.equal(r.versioned, false);
  assert.equal(r.habit.plans[planId].goal, "Başka hedef");
});

test("alışkanlık kaydı bilinmeyen plana bağlanamaz ve geçersiz durum reddedilir", () => {
  const { habit, planId } = habitWithPlan();
  const bad1 = JSON.parse(JSON.stringify(habit));
  bad1.log["2026-10-01"] = { status: "done", planId: "yok" };
  assert.throws(() => STORE.migrateHabit(bad1));
  const bad2 = JSON.parse(JSON.stringify(habit));
  bad2.log["2026-10-01"] = { status: "harika", planId };
  assert.throws(() => STORE.migrateHabit(bad2));
});

/* ---------- Yedek (şema 2) ---------- */

test("yeni yedek: günler + alışkanlık + tercihler dışa aktarılır ve geri yüklenir", () => {
  const a = STORE.createStore(memoryStorage());
  const d = sampleDay("Sunum taslağı – ğüşiöç İ");
  d.time.budget = "5";
  a.saveDay("2026-10-01", d);
  const { habit, planId } = habitWithPlan();
  habit.log["2026-10-01"] = { status: "skipped", note: "Misafir vardı", planId };
  habit.reviews[planId] = { fit: "Bir soru", context: "Akşam", shrink: "Yarım soru", updatedAt: null };
  a.saveHabit(habit);
  a.setSettings({ motion: "off", textSize: "larger" });

  const text = a.exportText();
  const res = STORE.parseBackup(text);
  assert.equal(res.ok, true);
  assert.equal(res.version, 2);

  const b = STORE.createStore(memoryStorage());
  b.saveDay("2026-09-30", sampleDay("Eski"));
  const plan = b.planRestore(res);
  assert.deepEqual(plan.daysAdded, ["2026-10-01"]);
  assert.equal(plan.adoptsActivePlan, true);
  assert.equal(b.applyRestore(res), true);
  assert.equal(b.getDay("2026-10-01").main.text, "Sunum taslağı – ğüşiöç İ");
  assert.equal(b.getDay("2026-10-01").time.budget, "5");
  assert.equal(b.getDay("2026-09-30").main.text, "Eski", "yedekte olmayan gün korunur");
  assert.equal(b.getHabit().log["2026-10-01"].note, "Misafir vardı");
  assert.equal(b.getHabit().reviews[planId].shrink, "Yarım soru");
  assert.equal(b.getSettings().textSize, "larger");
});

test("geri yükleme bu cihazdaki aktif planı değiştirmez; çakışan alışkanlık kayıtları listelenir", () => {
  const dev = STORE.createStore(memoryStorage());
  const mine = habitWithPlan("Benim planım");
  mine.habit.log["2026-10-01"] = { status: "done", note: "", planId: mine.planId };
  dev.saveHabit(mine.habit);

  const other = habitWithPlan("Diğer cihaz planı");
  other.habit.log["2026-10-01"] = { status: "skipped", note: "", planId: other.planId };
  const backup = STORE.buildBackup({}, other.habit, {});
  const res = STORE.parseBackup(backup);
  const plan = dev.planRestore(res);
  assert.equal(plan.keepsActivePlan, true);
  assert.equal(plan.logChanged.length, 1);
  assert.equal(plan.logChanged[0].before.status, "done");
  dev.applyRestore(res);
  assert.equal(dev.getHabit().activePlanId, mine.planId);
  assert.equal(dev.getHabit().log["2026-10-01"].planId, other.planId);
});

test("hatalı yedekler reddedilir", () => {
  const good = JSON.parse(STORE.buildBackup({ "2026-10-01": sampleDay("a") }, null, {}));
  const cases = {
    notJson: "{bozuk",
    wrongApp: JSON.stringify({ ...good, app: "baska-uygulama" }),
    wrongVersion: JSON.stringify({ ...good, version: 99 }),
    badDays: JSON.stringify({ ...good, days: [] }),
    badDate: JSON.stringify({ ...good, days: { "2026-02-31": sampleDay("a") } }),
    badField: JSON.stringify({ ...good, days: { "2026-10-01": { main: { text: 42 } } } }),
    empty: JSON.stringify({ ...good, days: {} }),
  };
  for (const [code, text] of Object.entries(cases)) {
    const r = STORE.parseBackup(text);
    assert.equal(r.ok, false, code);
    assert.equal(r.code, code, code);
  }
  assert.equal(STORE.parseBackup("x".repeat(2 * 1024 * 1024 + 1)).code, "tooLarge");
  const tooMany = { ...good, days: { "2026-10-01": { main: { text: "a" }, extras: [{}, {}, {}] } } };
  assert.equal(STORE.parseBackup(JSON.stringify(tooMany)).code, "badField");
  const badHabit = { ...good, habit: { plans: { p1: { goal: "x" } }, log: { "2026-10-01": { status: "done", planId: "p2" } } } };
  assert.equal(STORE.parseBackup(JSON.stringify(badHabit)).code, "badField");
});

test("yedekteki bilinmeyen alanlar atılır, HTML metin olarak kalır", () => {
  const raw = { app: STORE.APP_ID, version: 1, days: { "2026-10-01": { brain: "<img src=x onerror=alert(1)>", hacker: "x", main: { text: "a" } } } };
  const r = STORE.parseBackup(JSON.stringify(raw));
  assert.equal(r.ok, true);
  assert.equal(r.days["2026-10-01"].hacker, undefined);
  assert.equal(r.days["2026-10-01"].brain, "<img src=x onerror=alert(1)>");
});

/* ---------- Depolama hatası ---------- */

test("depolama yazma hatasında false döner ve yazılan içerik yedek metninde kalır", () => {
  const st = memoryStorage();
  const s = STORE.createStore(st);
  s.saveDay("2026-10-01", sampleDay("Önceden kaydedilen"));
  st.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.equal(s.saveDay("2026-10-02", sampleDay("Kaydedilemeyen iş")), false);
  assert.equal(s.hasUnsaved(), true);
  const backup = JSON.parse(s.exportText());
  assert.equal(backup.days["2026-10-02"].main.text, "Kaydedilemeyen iş");
  assert.equal(backup.days["2026-10-01"].main.text, "Önceden kaydedilen");
});

test("depolama hiç kullanılamıyorsa uygulama çökmez", () => {
  const broken = { getItem() { throw new Error("no"); }, setItem() { throw new Error("no"); }, removeItem() {} };
  const s = STORE.createStore(broken);
  assert.equal(s.available, false);
  assert.equal(s.saveDay("2026-10-01", sampleDay("a")), false);
  assert.equal(s.getDay("2026-10-01").main.text, "a", "oturum boyunca bellekte tutulur");
});
