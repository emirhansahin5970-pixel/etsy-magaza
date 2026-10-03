// Ana ekran simgelerini (PNG) SVG'den üretir: node tools/make-icons.mjs
// Motif: kapaktaki küçük basamaklar ve turuncu başlangıç noktası, koyu adaçayı zemin.
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
let pw;
try { pw = require("playwright"); } catch { pw = require("/opt/node-tools/node_modules/playwright"); }
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "app", "src", "pwa", "icons");

// maskable: önemli içerik ortadaki %60'lık güvenli alanda
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#34503d"/>
  <path d="M120 300c40 0 60 60 120 60h150" stroke="#dde7da" stroke-width="10" stroke-linecap="round" stroke-dasharray="4 22" fill="none"/>
  <rect x="200" y="300" width="56" height="40" rx="8" fill="#dde7da"/>
  <rect x="266" y="256" width="56" height="84" rx="8" fill="#dde7da"/>
  <rect x="332" y="206" width="56" height="134" rx="8" fill="#dde7da" opacity=".55"/>
  <circle cx="228" cy="268" r="17" fill="#d9692c"/>
  <path d="M130 196c22-16 44 10 66-4s40 12 58 0" stroke="#dde7da" stroke-width="10" stroke-linecap="round" fill="none" opacity=".8"/>
</svg>`;
const b = await pw.chromium.launch();
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<html><body style="margin:0">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await p.screenshot({ path: join(out, name) });
  await p.close();
}
await b.close();
console.log("simgeler:", out);
