// Kaynak dosyalarını (src/) tek dosyalık sürümlere dönüştürür:
//   dist/index.html    – herhangi bir HTTPS statik barındırmada yayınlanacak tam sayfa
//   dist/artifact.html – claude.ai Artifact olarak yayınlanacak sayfa gövdesi (iskelet etiketleri olmadan)
// Kullanım: node app/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const src = (p) => join(root, "src", p);
const read = (p) => readFileSync(src(p), "utf8");

let html = read("index.html");

// CSS ve JS dosyalarını satır içine al. "</script" dizisi metinde geçerse kaçışla.
html = html.replace(/<link rel="stylesheet" href="styles\.css">/, () => `<style>\n${read("styles.css")}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, file) => {
  const code = read(file).replace(/<\/script/gi, "<\\/script");
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
