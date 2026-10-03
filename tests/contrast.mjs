// Renk kontrastı denetimi (açık ve koyu tema): node tests/contrast.mjs
// styles.css içindeki tema değişkenlerini okur; metin çiftleri için ≥ 4.5:1, kenarlık/odak/işaret için ≥ 3:1 arar.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/src/styles.css", import.meta.url), "utf8");

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2];
  return out;
}
const lightBlock = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
const mediaStart = css.indexOf(':root:not([data-theme="light"]) {');
const mediaBlock = css.slice(mediaStart, css.indexOf("}", mediaStart));
const attrStart = css.indexOf(':root[data-theme="dark"] {');
const attrBlock = css.slice(attrStart, css.indexOf("}", attrStart));
const light = tokens(lightBlock);
const darkMedia = tokens(mediaBlock);
const darkAttr = tokens(attrBlock);
const dark = { ...light, ...darkMedia };

function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [ön plan, arka plan, en az oran, nerede]
const PAIRS = [
  ["ink", "cream", 4.5, "gövde metni"], ["ink", "paper", 4.5, "kart metni"], ["ink", "field", 4.5, "form alanı metni"],
  ["ink-soft", "cream", 4.5, "ipucu metni"], ["ink-soft", "paper", 4.5, "kartta ipucu"], ["ink-soft", "field", 4.5, "alanda ikincil metin"],
  ["sage", "cream", 4.5, "adaçayı etiket"], ["sage-deep", "cream", 4.5, "bağlantı/düğme metni"], ["sage-deep", "paper", 4.5, "kartta bağlantı"],
  ["sage-deep", "sage-wash", 4.5, "araştırma kutusu etiketi"], ["ink", "sage-wash", 4.5, "araştırma kutusu metni"],
  ["ink", "sage-soft", 4.5, "seçili seçenek / seçili gün"], ["accent-ink", "cream", 4.5, "turuncu etiket"],
  ["ink", "accent-soft", 4.5, "uyarı bandı metni"], ["on-accent", "accent", 4.5, "birincil düğme"],
  ["on-accent", "danger-solid", 4.5, "silme düğmesi"], ["danger", "paper", 4.5, "silme (çerçeveli) düğmesi"],
  ["danger", "cream", 4.5, "alan hata mesajı"], ["danger-ink", "danger-soft", 4.5, "hata kutusu"],
  ["cover-ink", "cover-bg", 4.5, "kapak başlığı"], ["cover-muted", "cover-bg", 4.5, "kapak alt yazısı"],
  ["placeholder", "field", 4.5, "örnek (placeholder) metni"],
  ["focus", "cream", 3, "odak göstergesi"], ["focus", "paper", 3, "kartta odak"], ["field-border", "field", 3, "form kenarlığı (alan içi)"],
  ["field-border", "cream", 3, "form kenarlığı"], ["field-border", "paper", 3, "seçenek kenarlığı"], ["sage", "field", 3, "onay kutusu kenarı"], ["accent-mark", "paper", 3, "küçük işaret"],
  ["sage", "paper", 3, "takvim plan işareti"], ["ink", "paper", 3, "bugün çerçevesi"],
];

let fail = 0;
const missing = Object.keys(darkMedia).filter((k) => darkMedia[k] !== darkAttr[k]).concat(Object.keys(darkAttr).filter((k) => !(k in darkMedia)));
if (missing.length) { console.log("HATA  iki koyu tema bloğu farklı:", missing.join(", ")); fail++; }
for (const [name, t] of [["Açık", light], ["Koyu", dark]]) {
  console.log(`\n${name} tema`);
  for (const [fg, bg, min, where] of PAIRS) {
    if (!t[fg] || !t[bg]) { console.log(`HATA  ${fg}/${bg} tanımsız`); fail++; continue; }
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) fail++;
    console.log(`${ok ? "OK  " : "HATA"}  ${r.toFixed(2).padStart(5)}:1 (≥${min})  ${fg} / ${bg}  — ${where}`);
  }
}
console.log(fail ? `\n${fail} kontrast sorunu` : "\nBütün kontrast çiftleri hedefte");
process.exit(fail ? 1 : 0);
