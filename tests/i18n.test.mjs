// Dil dosyalarının tutarlılığı: her dilde Türkçe dosyadaki anahtarların tamamı, aynı yer tutucular ve aynı dizi uzunlukları bulunmalı.
// Kullanım: node --test tests/i18n.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

export const LANGS = ["tr", "en", "de", "fr", "es", "it", "nl"];

function load() {
  const sandbox = { window: {} };
  for (const l of LANGS) vm.runInNewContext(readFileSync(new URL(`../app/src/i18n/${l}.js`, import.meta.url), "utf8"), sandbox);
  return sandbox.window.GX_I18N;
}

const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

function compare(ref, other, path, errors) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(other)) return errors.push(`${path}: dizi değil`);
    if (ref.length !== other.length) errors.push(`${path}: ${ref.length} öğe yerine ${other.length}`);
    ref.forEach((v, i) => compare(v, other[i], `${path}[${i}]`, errors));
    return;
  }
  if (ref && typeof ref === "object") {
    if (!other || typeof other !== "object") return errors.push(`${path}: nesne değil`);
    for (const k of Object.keys(ref)) {
      if (!(k in other)) errors.push(`${path}.${k}: eksik`);
      else compare(ref[k], other[k], `${path}.${k}`, errors);
    }
    for (const k of Object.keys(other)) if (!(k in ref)) errors.push(`${path}.${k}: fazla anahtar`);
    return;
  }
  if (typeof ref !== typeof other) return errors.push(`${path}: tür farklı`);
  if (typeof ref === "string") {
    if (!other.trim()) errors.push(`${path}: boş`);
    if (placeholders(ref) !== placeholders(other)) errors.push(`${path}: yer tutucular farklı (${placeholders(ref)} / ${placeholders(other)})`);
  }
}

const I18N = load();

test("bütün diller yüklendi", () => {
  assert.deepEqual(Object.keys(I18N).sort(), [...LANGS].sort());
  for (const l of LANGS) {
    assert.equal(I18N[l].htmlLang, l);
    assert.ok(I18N[l].locale.startsWith(l + "-"), `${l}: locale`);
  }
});

for (const l of LANGS.filter((x) => x !== "tr")) {
  test(`${l}: anahtarlar, yer tutucular ve dizi uzunlukları Türkçe ile aynı`, () => {
    const errors = [];
    compare(I18N.tr, I18N[l], l, errors);
    assert.deepEqual(errors, []);
  });

  test(`${l}: Türkçeye özgü özet cümlesi kapalı, metinler Türkçe kalmamış`, () => {
    assert.equal(I18N[l].features.sentenceSummary, false);
    const same = [];
    const cognates = new Set(["Tema"]); // aynı yazılan ve doğru olan kelimeler (es/it "Tema")
    (function walk(ref, other, path) {
      if (typeof ref === "string") {
        // Marka ve sayı/sembol içeren kısa metinler her dilde aynı olabilir
        if (ref === other && /[a-zçğıöşü]{4,}/i.test(ref.replace(/\{\w+\}/g, "")) && ref !== "Genix Studio" && !cognates.has(ref)) same.push(path);
        return;
      }
      if (ref && typeof ref === "object") for (const k of Object.keys(ref)) walk(ref[k], other[k], `${path}.${k}`);
    })(I18N.tr, I18N[l], l);
    assert.deepEqual(same, []);
  });
}

test("dil adları kendi dillerinde ve birbirinden farklı", () => {
  const names = LANGS.map((l) => I18N[l].name);
  assert.deepEqual(names, ["Türkçe", "English", "Deutsch", "Français", "Español", "Italiano", "Nederlands"]);
});
