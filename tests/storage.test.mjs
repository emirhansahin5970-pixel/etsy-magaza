// Veri katmanı birim testleri: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const STORE = require("../app/src/storage.js");

function memoryStorage() {
  const m = new Map();
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

test("dateKey yerel saati kullanır (gece yarısına yakın UTC kayması yok)", () => {
  assert.equal(STORE.dateKey(new Date(2026, 9, 2, 23, 59)), "2026-10-02");
  assert.equal(STORE.dateKey(new Date(2026, 9, 3, 0, 1)), "2026-10-03");
});

test("geçersiz tarih anahtarları reddedilir", () => {
  for (const k of ["2026-02-30", "2026-13-01", "26-10-02", "2026-10-2", "abcd-ef-gh", "1999-01-01"]) {
    assert.equal(STORE.isValidDateKey(k), false, k);
  }
  assert.equal(STORE.isValidDateKey("2028-02-29"), true);
});

test("farklı günler ayrı saklanır, birinin kaydı diğerinin üzerine yazmaz", () => {
  const s = STORE.createStore(memoryStorage());
  s.saveDay("2026-10-01", sampleDay("Dünkü iş"));
  s.saveDay("2026-10-02", sampleDay("Bugünkü iş"));
  assert.equal(s.getDay("2026-10-01").main.text, "Dünkü iş");
  assert.equal(s.getDay("2026-10-02").main.text, "Bugünkü iş");
});

test("boş gün kaydedilmez, içi boşaltılan gün silinir", () => {
  const s = STORE.createStore(memoryStorage());
  s.saveDay("2026-10-02", STORE.emptyDay());
  assert.deepEqual(Object.keys(s.getDays()), []);
  s.saveDay("2026-10-02", sampleDay("x"));
  s.saveDay("2026-10-02", STORE.emptyDay());
  assert.deepEqual(Object.keys(s.getDays()), []);
});

test("yedek al → geri yükle döngüsü veriyi korur", () => {
  const a = STORE.createStore(memoryStorage());
  const d = sampleDay("Sunum taslağı");
  d.main.done = true;
  d.brain = "Çağrı, ödev, şemsiye, İğdır, ölçü";
  d.extras[1] = { text: "Kargo", done: true };
  a.saveDay("2026-10-01", d);
  const text = a.exportText();

  const res = STORE.parseBackup(text);
  assert.equal(res.ok, true);
  const b = STORE.createStore(memoryStorage());
  b.saveDay("2026-09-30", sampleDay("Eski"));
  b.mergeDays(res.days);
  assert.equal(b.getDay("2026-10-01").brain, d.brain);
  assert.equal(b.getDay("2026-10-01").extras[1].done, true);
  assert.equal(b.getDay("2026-09-30").main.text, "Eski", "yedekte olmayan gün korunur");
});

test("hatalı yedekler reddedilir", () => {
  const good = JSON.parse(STORE.buildBackup({ "2026-10-01": sampleDay("a") }));
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
  // Üçten fazla ek iş (sonsuz liste) kabul edilmez
  const tooMany = { ...good, days: { "2026-10-01": { main: { text: "a" }, extras: [{}, {}, {}] } } };
  assert.equal(STORE.parseBackup(JSON.stringify(tooMany)).code, "badField");
});

test("yedekteki bilinmeyen alanlar atılır, HTML olduğu gibi metin kalır", () => {
  const raw = { app: STORE.APP_ID, version: 1, days: { "2026-10-01": { brain: "<img src=x onerror=alert(1)>", hacker: "x", main: { text: "a" } } } };
  const r = STORE.parseBackup(JSON.stringify(raw));
  assert.equal(r.ok, true);
  assert.equal(r.days["2026-10-01"].hacker, undefined);
  assert.equal(r.days["2026-10-01"].brain, "<img src=x onerror=alert(1)>");
});

test("depolama kullanılamıyorsa uygulama çökmez", () => {
  const broken = { getItem() { throw new Error("no"); }, setItem() { throw new Error("no"); }, removeItem() {} };
  const s = STORE.createStore(broken);
  assert.equal(s.available, false);
  assert.equal(s.saveDay("2026-10-01", sampleDay("a")), false);
  assert.equal(s.getDay("2026-10-01").main.text, "a", "oturum boyunca bellekte tutulur");
});
