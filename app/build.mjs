// Kaynak dosyalarını (src/) tek dosyalık sürümlere dönüştürür:
//   dist/              – HTTPS statik barındırmada yayınlanacak klasör (index.html, manifest, simgeler, sw.js)
//   dist-artifact/artifact.html – claude.ai Artifact olarak yayınlanacak sayfa gövdesi (iskelet etiketleri olmadan)
// Derleme ayrıca data-t ile işaretli sabit metinleri ve başlangıç (boot) metinlerini i18n/tr.js'ten HTML'e yazar;
// böylece JavaScript çalışmasa da ürün adı, açıklama ve uyarı görünür.
// Kullanım: node app/build.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const src = (p) => join(root, "src", p);
const read = (p) => readFileSync(src(p), "utf8");

// Arayüz metinlerini oku (i18n/<dil>.js). HTML Türkçe derlenir; diğer dillerin başlangıç metinleri boot.js'e yazılır.
const LANGS = ["tr", "en", "de", "fr", "es", "it", "nl"];
const sandbox = { window: {} };
for (const l of LANGS) vm.runInNewContext(read(`i18n/${l}.js`), sandbox);
const I18N = sandbox.window.GX_I18N;
const lookupIn = (S, path) => {
  const v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), S);
  if (typeof v !== "string") throw new Error(`Metin bulunamadı: ${path}`);
  return v;
};
const lookup = (path, lang = "tr") => lookupIn(I18N[lang], path);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let html = read("index.html");

// 1) Sabit metinler: <tag ... data-t="anahtar" ...></tag> → içerik doldurulur
const staticKeys = new Set(["app.title"]);
for (const m of html.matchAll(/\sdata-t(?:-label)?="([^"]+)"/g)) staticKeys.add(m[1]);
html = html.replace(/(<(\w+)\b[^>]*\sdata-t="([^"]+)"[^>]*>)(<\/\2>)/g, (_, open, tag, key, close) => {
  const lang = (open.match(/\sdata-t-lang="(\w+)"/) || [])[1] || "tr";
  return open + esc(lookup(key, lang)) + close;
});
html = html.replace(/(<\w+\b[^>]*\sdata-t-label="([^"]+)")/g, (m, open, key) => `${open} aria-label="${esc(lookup(key))}"`);
if (/data-t="[^"]+"[^>]*><\//.test(html)) throw new Error("Doldurulmamış data-t kaldı");

// 2) CSS ve JS dosyalarını satır içine al. "</script" dizisi metinde geçerse kaçışla.
html = html.replace(/<link rel="stylesheet" href="styles\.css">/, () => `<style>\n${read("styles.css")}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, file) => {
  let code = read(file);
  if (file === "boot.js") {
    const boot = {};
    for (const l of LANGS) boot[l] = { boot: I18N[l].boot, ui: Object.fromEntries([...staticKeys].map((k) => [k, lookup(k, l)])) };
    code = code.replace("/*@BOOT_STRINGS@*/ {}", JSON.stringify(boot));
  }
  code = code.replace(/<\/script/gi, "<\\/script");
  return `<script>\n${code}\n</script>`;
});

const between = (s, a, b) => {
  const i = s.indexOf(a), j = s.indexOf(b);
  if (i < 0 || j < 0) throw new Error(`İşaretçi bulunamadı: ${a}`);
  return s.slice(i + a.length, j).trim();
};
const head = between(html, "<!-- @artifact-head-start -->", "<!-- @artifact-head-end -->");
const body = between(html, "<!-- @artifact-body-start -->", "<!-- @artifact-body-end -->");

// Çıktılar:
//   dist/                → web'de barındırılacak klasör (index.html + uygulama tanımı + simgeler + service worker)
//   dist-artifact/       → claude.ai Artifact gövdesi (web klasörüne karışmasın)
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "icons"), { recursive: true });
writeFileSync(join(dist, "index.html"), html);
const version = createHash("sha256").update(html).digest("hex").slice(0, 10);
writeFileSync(join(dist, "sw.js"), read("pwa/sw.js").replace("__BUILD__", version));
copyFileSync(src("pwa/manifest.webmanifest"), join(dist, "manifest.webmanifest"));
for (const f of ["icon-192.png", "icon-512.png", "apple-touch-icon.png"]) copyFileSync(src("pwa/icons/" + f), join(dist, "icons", f));
mkdirSync(join(root, "dist-artifact"), { recursive: true });
writeFileSync(join(root, "dist-artifact", "artifact.html"), `${head}\n${body}\n`);

console.log("dist/index.html", Buffer.byteLength(html), "bayt");
console.log("dist-artifact/artifact.html", Buffer.byteLength(head + body), "bayt");
console.log("sürüm", version);
