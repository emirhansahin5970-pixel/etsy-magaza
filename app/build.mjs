// Kaynak dosyalarını (src/) tek dosyalık sürümlere dönüştürür:
//   dist/index.html    – herhangi bir HTTPS statik barındırmada yayınlanacak tam sayfa (tek dosya)
//   dist/artifact.html – claude.ai Artifact olarak yayınlanacak sayfa gövdesi (iskelet etiketleri olmadan)
// Derleme ayrıca data-t ile işaretli sabit metinleri ve başlangıç (boot) metinlerini i18n/tr.js'ten HTML'e yazar;
// böylece JavaScript çalışmasa da ürün adı, açıklama ve uyarı görünür.
// Kullanım: node app/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const src = (p) => join(root, "src", p);
const read = (p) => readFileSync(src(p), "utf8");

// Arayüz metinlerini oku (tek kaynak: i18n/tr.js)
const sandbox = { window: {} };
vm.runInNewContext(read("i18n/tr.js"), sandbox);
const S = sandbox.window.GX_STRINGS;
const lookup = (path) => {
  const v = path.split(".").reduce((o, k) => (o == null ? o : o[k]), S);
  if (typeof v !== "string") throw new Error(`Metin bulunamadı: ${path}`);
  return v;
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let html = read("index.html");

// 1) Sabit metinler: <tag ... data-t="anahtar" ...></tag> → içerik doldurulur
html = html.replace(/(<(\w+)\b[^>]*\sdata-t="([^"]+)"[^>]*>)(<\/\2>)/g, (_, open, tag, key, close) => open + esc(lookup(key)) + close);
html = html.replace(/(<\w+\b[^>]*\sdata-t-label="([^"]+)")/g, (m, open, key) => `${open} aria-label="${esc(lookup(key))}"`);
if (/data-t="[^"]+"[^>]*><\//.test(html)) throw new Error("Doldurulmamış data-t kaldı");

// 2) CSS ve JS dosyalarını satır içine al. "</script" dizisi metinde geçerse kaçışla.
html = html.replace(/<link rel="stylesheet" href="styles\.css">/, () => `<style>\n${read("styles.css")}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, file) => {
  let code = read(file);
  if (file === "boot.js") code = code.replace("/*@BOOT_STRINGS@*/ {}", JSON.stringify(S.boot));
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

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "index.html"), html);
writeFileSync(join(root, "dist", "artifact.html"), `${head}\n${body}\n`);

console.log("dist/index.html", Buffer.byteLength(html), "bayt");
console.log("dist/artifact.html", Buffer.byteLength(head + body), "bayt");
