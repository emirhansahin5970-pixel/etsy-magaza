// Etsy satış paketi üretici.
// Çıktılar (etsy/out/):
//   upload/01_START-HERE_Small-Steps-Clear-Days.pdf   alıcının indireceği teslim PDF'i (uygulama bağlantısı, kurulum, şartlar)
//   upload/02_Book_EN_Small-Steps-Clear-Days.pdf       kitabın İngilizce PDF'i
//   upload/03_Book_other-languages.zip                 kitap PDF'leri: TR, DE, FR, ES, IT, NL
//   books/Book_<DİL>.pdf                               bütün kitap PDF'leri (ayrı ayrı)
//   images/01-…png                                     Etsy ilan görselleri (2700×2025)
//   screens/<dil>-*.png                                uygulama ekran görüntüleri (ilan görsellerinde kullanılır)
//   Small-Steps-Clear-Days_Etsy-Package.zip            hepsi tek dosyada (upload + images + ilan metinleri + rehber)
// Kullanım: npm run build (kökte) && cd etsy && npm install && node build.mjs
// Bağlantı değişirse: APP_URL="https://…/" node build.mjs  (PDF'teki bağlantı ve QR kod yeniden üretilir)
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import QRCode from "qrcode";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = (p) => join(root, "app", "src", p);
const OUT = join(here, "out");
const APP_URL = process.env.APP_URL || "https://emirhansahin5970-pixel.github.io/etsy-magaza/";
const LANGS = ["en", "tr", "de", "fr", "es", "it", "nl"];
const TODAY = new Date("2026-10-14T10:00:00"); // ekran görüntülerindeki "bugün" (çarşamba)

if (!existsSync(join(root, "app", "dist", "index.html"))) throw new Error("Önce kökte: npm run build");

/* ---------- İçerik ---------- */
const sb = { window: {} };
for (const l of LANGS) vm.runInNewContext(readFileSync(src(`i18n/${l}.js`), "utf8"), sb);
for (const l of LANGS) vm.runInNewContext(readFileSync(src(`content/book.${l}.js`), "utf8"), sb);
vm.runInNewContext(readFileSync(src("illustrations.js"), "utf8"), sb);
const I18N = JSON.parse(JSON.stringify(sb.window.GX_I18N));
const BOOKS = JSON.parse(JSON.stringify(sb.window.GX_BOOKS));
const ART = sb.window.GX_ART;
const SOURCES = BOOKS.tr.sources;

// PDF'e özgü kısa metinler (uygulamada yok)
const PDF = {
  en: { contents: "Contents", sources: "Sources", appTitle: "Use the app", appBody: "The daily planner (My Day) and the habit trial (My Habit) are in the web app. Open this link on your phone, tablet or computer:", appNote: "Your entries are stored only in the browser on your device. No account needed.", personal: "For personal use only. Please don't share or resell this file.", inApp: "In the app", minutes: "{min} min read", by: "Genix Studio" },
  tr: { contents: "İçindekiler", sources: "Kaynaklar", appTitle: "Uygulamayı kullan", appBody: "Günlük planlayıcı (Günüm) ve alışkanlık denemesi (Alışkanlığım) web uygulamasında. Bu bağlantıyı telefonunda, tabletinde ya da bilgisayarında aç:", appNote: "Kayıtların yalnızca cihazındaki tarayıcıda tutulur. Hesap gerekmez.", personal: "Yalnızca kişisel kullanım içindir. Lütfen bu dosyayı paylaşma ya da satma.", inApp: "Uygulamada", minutes: "{min} dakikalık okuma", by: "Genix Studio" },
  de: { contents: "Inhalt", sources: "Quellen", appTitle: "Die App nutzen", appBody: "Der Tagesplaner („Mein Tag“) und der Gewohnheitsversuch („Gewohnheit“) sind in der Web-App. Öffne diesen Link auf deinem Handy, Tablet oder Computer:", appNote: "Deine Einträge werden nur im Browser auf deinem Gerät gespeichert. Kein Konto nötig.", personal: "Nur für den persönlichen Gebrauch. Bitte teile oder verkaufe diese Datei nicht.", inApp: "In der App", minutes: "{min} Min. Lesezeit", by: "Genix Studio" },
  fr: { contents: "Sommaire", sources: "Sources", appTitle: "Utiliser l’application", appBody: "Le planificateur quotidien (Ma journée) et l’essai d’habitude (Mon habitude) se trouvent dans l’application web. Ouvre ce lien sur ton téléphone, ta tablette ou ton ordinateur :", appNote: "Tes données sont enregistrées uniquement dans le navigateur de ton appareil. Aucun compte nécessaire.", personal: "Pour un usage personnel uniquement. Merci de ne pas partager ni revendre ce fichier.", inApp: "Dans l’application", minutes: "{min} min de lecture", by: "Genix Studio" },
  es: { contents: "Índice", sources: "Fuentes", appTitle: "Usa la aplicación", appBody: "El planificador diario (Mi día) y la prueba de hábito (Mi hábito) están en la aplicación web. Abre este enlace en tu móvil, tableta u ordenador:", appNote: "Tus registros se guardan solo en el navegador de tu dispositivo. No necesitas cuenta.", personal: "Solo para uso personal. Por favor, no compartas ni revendas este archivo.", inApp: "En la aplicación", minutes: "{min} min de lectura", by: "Genix Studio" },
  it: { contents: "Indice", sources: "Fonti", appTitle: "Usa l'app", appBody: "Il planner giornaliero («Giornata») e la prova di abitudine («Abitudine») sono nell'app web. Apri questo link sul telefono, sul tablet o sul computer:", appNote: "I tuoi dati restano solo nel browser del tuo dispositivo. Nessun account necessario.", personal: "Solo per uso personale. Per favore non condividere né rivendere questo file.", inApp: "Nell'app", minutes: "{min} min di lettura", by: "Genix Studio" },
  nl: { contents: "Inhoud", sources: "Bronnen", appTitle: "Gebruik de app", appBody: "De dagplanner (Mijn dag) en de gewoontetest (Gewoonte) staan in de web-app. Open deze link op je telefoon, tablet of computer:", appNote: "Wat je invult, wordt alleen in de browser op je apparaat bewaard. Geen account nodig.", personal: "Alleen voor persoonlijk gebruik. Deel of verkoop dit bestand niet.", inApp: "In de app", minutes: "{min} min lezen", by: "Genix Studio" },
};

/* ---------- Ortak stil ---------- */
const styles = readFileSync(src("styles.css"), "utf8");
const tokens = styles.slice(styles.indexOf(":root {"), styles.indexOf("\n}", styles.indexOf(":root {")) + 2);
const artCss = styles.split("\n").filter((l) => /^\.(il|cv)-/.test(l)).join("\n");
const fontDir = pathToFileURL(join(here, "fonts")).href + "/";
const fontsCss = readFileSync(join(here, "fonts", "fonts.css"), "utf8").replace(/url\(([^)]+)\)/g, (_, f) => `url(${fontDir}${f})`);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fill = (s, p) => s.replace(/\{(\w+)\}/g, (m, k) => (p[k] != null ? p[k] : m));
const BASE_CSS = `${fontsCss}\n${tokens}\n${artCss}\n
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: var(--font-text); color: var(--ink); background: var(--cream); }
h1, h2, h3 { font-family: var(--font-display); font-weight: 600; line-height: 1.2; }
svg { display: block; width: 100%; height: auto; }`;

/* ---------- Kitap PDF'i ---------- */
function citation(id) {
  const s = SOURCES[id];
  return `${esc(s.authors)} (${s.year}). ${esc(s.title)}. <i>${esc(s.venue)}</i>. https://doi.org/${esc(s.doi)}`;
}

function blockHtml(b, S, P) {
  switch (b.type) {
    case "h": return `<h3 class="sub">${esc(b.text)}</h3>`;
    case "p": return `<p>${esc(b.text)}</p>`;
    case "scene": return `<div class="scene">${b.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
    case "figure": return `<figure><div class="art">${ART[b.art]}</div><figcaption>${esc(b.caption)}</figcaption></figure>`;
    case "research": return `<aside class="box research"><span class="label">${esc(S.reader.researchLabel)}</span><p>${esc(b.finding)}</p><p class="limits"><b>${esc(S.reader.limitsLabel)}:</b> ${esc(b.limits)}</p><p class="details">${esc(b.details)}</p><p class="refs">${(b.refs || []).map(citation).join("<br>")}</p></aside>`;
    case "suggestion": return `<aside class="suggestion"><span class="label">${esc(S.reader.suggestionLabel)}</span><p>${esc(b.text)}</p></aside>`;
    case "exercise": {
      const app = b.planner === "habit" ? S.nav.habit : S.nav.day;
      return `<section class="box exercise"><span class="label">${esc(S.reader.exerciseLabel)}</span><h3>${esc(b.title)}</h3><ol>${b.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><p class="inapp">${esc(P.inApp)}: <b>${esc(app)}</b></p></section>`;
    }
    case "summary": return `<p class="summary"><span class="label">${esc(S.reader.summaryLabel)}</span>${esc(b.text)}</p>`;
    default: return "";
  }
}

async function bookHtml(lang) {
  const S = I18N[lang], B = BOOKS[lang], P = PDF[lang];
  const qr = await QRCode.toString(APP_URL, { type: "svg", margin: 0, color: { dark: "#1d231f", light: "#00000000" } });
  const label = (c) => (c.kind === "chapter" ? fill(S.reader.chapterLabel, { n: c.number }) : "");
  const usedSources = [...new Set(B.chapters.flatMap((c) => c.sources || []))];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(B.title)}</title><style>${BASE_CSS}
@page { size: A5; margin: 16mm 15mm 18mm; }
@page cover { margin: 0; }
body { background: var(--paper); font-size: 10.6pt; line-height: 1.55; }
.cover { page: cover; height: 210mm; background: var(--cover-bg); color: var(--cover-ink); padding: 22mm 16mm; display: flex; flex-direction: column; break-after: page; }
.cover .brand { letter-spacing: .14em; text-transform: uppercase; font-weight: 700; font-size: 9pt; color: var(--cover-muted); }
.cover h1 { font-size: 30pt; margin: 10mm 0 4mm; color: var(--cover-ink); }
.cover .subtitle { font-size: 12.5pt; color: var(--cover-muted); margin: 0; }
.cover .art { margin-top: auto; }
.cover .art svg { width: 100%; }
.toc { break-after: page; }
.toc h2 { font-size: 18pt; margin: 0 0 6mm; }
.toc ol { list-style: none; padding: 0; margin: 0; }
.toc li { padding: 3mm 0; border-bottom: 1px solid var(--line); }
.toc .k { display: block; color: var(--sage); font-size: 8.5pt; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
.toc .t { font-family: var(--font-display); font-size: 13pt; }
.toc .m { color: var(--ink-soft); font-size: 8.5pt; }
.chapter { break-before: page; }
.chapter > .k { color: var(--sage); font-weight: 700; font-size: 8.5pt; letter-spacing: .1em; text-transform: uppercase; margin: 0; }
.chapter > h2 { font-size: 20pt; margin: 2mm 0 1mm; }
.chapter > .m { color: var(--ink-soft); font-size: 8.5pt; margin: 0 0 6mm; }
h3.sub { font-size: 13pt; margin: 7mm 0 2mm; break-after: avoid; }
p { margin: 0 0 3mm; orphans: 3; widows: 3; }
.scene { border-left: 3px solid var(--sage-soft); padding-left: 4mm; margin: 0 0 5mm; font-style: italic; color: var(--ink-soft); }
figure { margin: 5mm 0; break-inside: avoid; }
figure .art { background: var(--field); border: 1px solid var(--line); border-radius: 10px; padding: 4mm; }
figcaption { font-size: 9pt; color: var(--ink-soft); margin-top: 2mm; }
.box { border-radius: 10px; padding: 4mm 4.5mm; margin: 5mm 0; break-inside: avoid; }
.research { background: var(--sage-wash); border: 1px solid var(--sage-soft); }
.research .limits, .research .details { font-size: 9.4pt; }
.research .refs { font-size: 7.8pt; color: var(--ink-soft); margin: 0; word-break: break-word; }
.exercise { background: var(--accent-soft); border: 1px solid #ecc9ad; }
.exercise h3 { font-size: 13pt; margin: 1mm 0 2mm; }
.exercise ol { margin: 0 0 2mm; padding-left: 5mm; }
.exercise li { margin-bottom: 1.5mm; }
.inapp { font-size: 8.8pt; color: var(--accent-ink); margin: 0; }
.label { display: block; font-size: 8pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--sage-deep); margin-bottom: 1.5mm; }
.exercise .label { color: var(--accent-ink); }
.suggestion { border-left: 3px solid var(--accent-mark); padding: 1mm 0 1mm 4mm; margin: 5mm 0; break-inside: avoid; }
.summary { font-family: var(--font-display); font-size: 12pt; border-top: 1px solid var(--line); padding-top: 4mm; margin-top: 6mm; break-inside: avoid; }
.end { break-before: page; }
.end h2 { font-size: 18pt; margin: 0 0 4mm; }
.link { font-weight: 700; color: var(--sage-deep); word-break: break-all; font-size: 11pt; }
.qr { width: 26mm; margin: 4mm 0; }
.small { font-size: 8.5pt; color: var(--ink-soft); }
.biblio p { font-size: 7.6pt; margin-bottom: 1.5mm; }
</style></head><body>
<section class="cover"><span class="brand">${esc(P.by)}</span><h1>${esc(B.title)}</h1><p class="subtitle">${esc(B.subtitle)}</p><div class="art">${ART.cover}</div></section>
<section class="toc"><h2>${esc(P.contents)}</h2><ol>${B.chapters.map((c) => `<li>${label(c) ? `<span class="k">${esc(label(c))}</span>` : ""}<span class="t">${esc(c.title)}</span> <span class="m">· ${esc(fill(P.minutes, { min: c.minutes }))}</span></li>`).join("")}</ol></section>
${B.chapters.map((c) => `<section class="chapter">${label(c) ? `<p class="k">${esc(label(c))}</p>` : ""}<h2>${esc(c.title)}</h2><p class="m">${esc(fill(P.minutes, { min: c.minutes }))}</p>${c.blocks.map((b) => blockHtml(b, I18N[lang], P)).join("\n")}</section>`).join("\n")}
<section class="end"><h2>${esc(P.appTitle)}</h2><p>${esc(P.appBody)}</p><p class="link">${esc(APP_URL)}</p><div class="qr">${qr}</div><p class="small">${esc(P.appNote)}</p>
<div class="biblio"><h3 class="sub">${esc(P.sources)}</h3>${usedSources.map((id) => `<p>${citation(id)}</p>`).join("")}</div>
<p class="small">© 2026 Genix Studio. ${esc(P.personal)}</p></section>
</body></html>`;
}

/* ---------- Teslim PDF'i (START HERE) ---------- */
const QUICK = {
  tr: ["Türkçe", "Bağlantıyı Safari'de (iPhone/iPad) ya da Chrome'da (Android, bilgisayar) aç.", "Paylaş → Ana Ekrana Ekle ile uygulama gibi kullan.", "Dili değiştirmek için üstteki küre düğmesine (EN) dokun ve Türkçe'yi seç.", "Kayıtların yalnızca bu cihazdaki tarayıcıda tutulur; Ayarlar'dan yedek al."],
  de: ["Deutsch", "Öffne den Link in Safari (iPhone/iPad) oder Chrome (Android, Computer).", "Über Teilen → Zum Home-Bildschirm nutzt du ihn wie eine App.", "Zum Wechseln der Sprache tippe oben auf die Weltkugel (EN) und wähle Deutsch.", "Deine Einträge bleiben nur im Browser dieses Geräts; mach in den Einstellungen ein Backup."],
  fr: ["Français", "Ouvre le lien dans Safari (iPhone/iPad) ou Chrome (Android, ordinateur).", "Partager → Sur l’écran d’accueil pour l’utiliser comme une app.", "Pour changer de langue, touche le globe (EN) en haut et choisis Français.", "Tes données restent dans le navigateur de cet appareil ; fais une sauvegarde dans les Réglages."],
  es: ["Español", "Abre el enlace en Safari (iPhone/iPad) o Chrome (Android, ordenador).", "Compartir → Añadir a pantalla de inicio para usarlo como una app.", "Para cambiar el idioma, toca el globo (EN) arriba y elige Español.", "Tus registros se quedan en el navegador de este dispositivo; haz una copia en Ajustes."],
  it: ["Italiano", "Apri il link in Safari (iPhone/iPad) o Chrome (Android, computer).", "Condividi → Aggiungi alla schermata Home per usarlo come un'app.", "Per cambiare lingua tocca il globo (EN) in alto e scegli Italiano.", "I tuoi dati restano nel browser di questo dispositivo; fai un backup dalle Impostazioni."],
  nl: ["Nederlands", "Open de link in Safari (iPhone/iPad) of Chrome (Android, computer).", "Via Delen → Zet op beginscherm gebruik je het als een app.", "Tik bovenaan op de wereldbol (EN) en kies Nederlands om de taal te wijzigen.", "Wat je invult, blijft in de browser van dit apparaat; maak een back-up via Instellingen."],
};

async function startHereHtml() {
  const qr = await QRCode.toString(APP_URL, { type: "svg", margin: 0, color: { dark: "#1d231f", light: "#00000000" } });
  const step = (n, t, d) => `<li><span class="n">${n}</span><div><b>${t}</b><p>${d}</p></div></li>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Start here – Small Steps, Clear Days</title><style>${BASE_CSS}
@page { size: A5; margin: 14mm 14mm 16mm; }
body { background: var(--paper); font-size: 10.4pt; line-height: 1.5; }
.page { break-after: page; }
.page:last-child { break-after: auto; }
.brand { letter-spacing: .14em; text-transform: uppercase; font-weight: 700; font-size: 8.5pt; color: var(--sage); }
h1 { font-size: 24pt; margin: 3mm 0 1mm; }
h2 { font-size: 16pt; margin: 0 0 4mm; }
h3 { font-size: 12pt; margin: 5mm 0 1.5mm; }
.lead { color: var(--ink-soft); margin: 0 0 6mm; }
.linkbox { background: var(--sage-deep); color: var(--cover-ink); border-radius: 12px; padding: 6mm; display: flex; gap: 5mm; align-items: center; }
.linkbox .qr { flex: none; width: 30mm; background: #fff; padding: 2.5mm; border-radius: 6px; }
.linkbox a { color: #fff; font-weight: 700; font-size: 11.5pt; word-break: break-all; }
.linkbox p { margin: 0 0 2mm; font-size: 9.2pt; color: var(--cover-muted); }
ol.steps { list-style: none; padding: 0; margin: 0; }
ol.steps li { display: flex; gap: 3.5mm; margin-bottom: 3.5mm; }
ol.steps .n { flex: none; width: 7mm; height: 7mm; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; display: grid; place-items: center; font-size: 9pt; }
ol.steps p { margin: .5mm 0 0; color: var(--ink-soft); }
ul { padding-left: 5mm; margin: 0 0 3mm; }
li { margin-bottom: 1.4mm; }
.box { background: var(--sage-wash); border: 1px solid var(--sage-soft); border-radius: 10px; padding: 4mm; margin: 4mm 0; }
.small { font-size: 8.6pt; color: var(--ink-soft); }
.quick { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 4mm; }
.quick section { border-top: 2px solid var(--sage-soft); padding-top: 2mm; break-inside: avoid; }
.quick h3 { margin: 0 0 1mm; font-size: 10.5pt; }
.quick ol { margin: 0; padding-left: 4mm; font-size: 8.3pt; line-height: 1.4; }
.quick li { margin-bottom: .8mm; }
</style></head><body>

<section class="page">
  <span class="brand">Genix Studio</span>
  <h1>Small Steps, Clear Days</h1>
  <p class="lead">A short read and a gentle daily planner. Thank you for your purchase!</p>
  <div class="linkbox"><div class="qr">${qr}</div><div><p>Your app link — open it on your phone, tablet or computer:</p><a href="${esc(APP_URL)}">${esc(APP_URL)}</a></div></div>
  <h3>What you get</h3>
  <ul>
    <li><b>Read</b> — the complete short book (introduction, three chapters, closing), with illustrations, small exercises and clearly marked research notes.</li>
    <li><b>My Day</b> — one main task, its first small step, an optional start time and an evening check-in. A monthly calendar shows your past days.</li>
    <li><b>My Habit</b> — one small habit, set up in six short steps and tried for seven days. No points, badges or streak counters.</li>
    <li><b>PDF book</b> — the book as a PDF in 7 languages (included in this download).</li>
  </ul>
  <p class="small">Languages: English, Türkçe, Deutsch, Français, Español, Italiano, Nederlands. The app opens in English; tap the globe button (EN) at the top to switch.</p>
</section>

<section class="page">
  <h2>Add it to your home screen</h2>
  <p class="lead">The app runs in your browser — nothing to install from an app store. Adding it to your home screen makes it open full-screen, like an app.</p>
  <h3>iPhone / iPad (Safari)</h3>
  <ol class="steps">
    ${step(1, "Open the link in Safari", "Tap the link or scan the QR code on the first page with your camera.")}
    ${step(2, "Tap the Share button", "The square with an arrow pointing up, at the bottom or top of Safari.")}
    ${step(3, "Choose “Add to Home Screen”", "Scroll down in the menu if you don't see it, then tap Add.")}
  </ol>
  <h3>Android (Chrome)</h3>
  <ol class="steps">
    ${step(1, "Open the link in Chrome", "Tap the link or scan the QR code.")}
    ${step(2, "Open the ⋮ menu", "Top right corner.")}
    ${step(3, "Tap “Add to Home screen” or “Install app”", "Then confirm.")}
  </ol>
  <h3>Computer</h3>
  <p>Open the link in Chrome, Edge, Safari or Firefox and bookmark it. In Chrome and Edge you can also use the install icon in the address bar.</p>
  <p class="small">An internet connection is needed the first time you open the app.</p>
</section>

<section class="page">
  <h2>Your entries and privacy</h2>
  <ul>
    <li>There is no account and no sign-in. What you write is stored only in the browser on the device you use.</li>
    <li>Entries don't sync between devices. If you use the app on your phone and your computer, each keeps its own entries.</li>
    <li>Clearing your browser's data (history, website data) can delete your entries. Private / incognito windows may not keep them at all.</li>
    <li>Make a backup now and then: <b>Settings → Back up</b>. You can restore it later, also on another device.</li>
  </ul>
  <div class="box"><b>Tip:</b> If downloading the backup file doesn't work on your device, use “Show backup as text” in Settings, copy the text and keep it in a note.</div>
  <h2 style="margin-top:8mm">Good to know</h2>
  <ul>
    <li>This is a gentle self-help tool for everyday planning. It is not medical or psychological advice and not a substitute for professional support.</li>
    <li>The book mentions a few research studies. Their findings are summarised with their limits; they don't promise results for everyone.</li>
    <li>Updates are added to the same link.</li>
  </ul>
</section>

<section class="page">
  <h2>License &amp; terms</h2>
  <p>Thank you for respecting a small independent studio.</p>
  <ul>
    <li>This purchase gives <b>you</b> a personal, non-transferable license to use the app link and the PDF files.</li>
    <li>Please don't share the link or the files publicly or with others, and don't resell, redistribute, upload or claim them as your own.</li>
    <li>All text, illustrations and design © 2026 Genix Studio. All rights reserved.</li>
    <li>This is a digital product; nothing will be shipped.</li>
  </ul>
  <h3>Need help?</h3>
  <p>Send us a message through Etsy. Please tell us your device (e.g. iPhone 15, Samsung Galaxy) and browser, and what you see.</p>
</section>

<section class="page">
  <h2>Quick start in other languages</h2>
  <div class="quick">${Object.values(QUICK).map(([name, ...items]) => `<section lang="${Object.keys(QUICK).find((k) => QUICK[k][0] === name)}"><h3>${esc(name)}</h3><ol>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol></section>`).join("")}</div>
  <p class="small" style="margin-top:5mm">Link: ${esc(APP_URL)}</p>
</section>
</body></html>`;
}

/* ---------- Uygulama ekran görüntüleri ---------- */
function iso(d) { return new Date(d + "T09:00:00").toISOString(); }
const SAMPLE = {
  en: {
    brain: "Pay the phone bill\nReturn the parcel\nCall Alex back\nInternship form\nBuy printer paper",
    main: "First draft of the presentation", step: "Open the file and write three headings",
    extras: ["Return the parcel", "Reply to Alex"], when: "Right after lunch", where: "Library, top floor",
    past: [["2026-10-13", "Finish the reading notes", 4], ["2026-10-12", "Clean up the desk", 3], ["2026-10-09", "Send the internship form", 5], ["2026-10-08", "Study chapter 4", 2], ["2026-10-07", "Grocery shopping", 4], ["2026-10-06", "Call the landlord", 3], ["2026-10-02", "Gym: 20 minutes", 4], ["2026-10-01", "Essay outline", 3]],
    plan: { goal: "Study math regularly", start: "Solve one problem", anchor: "After dinner", place: "At my desk", ease: "Put the book and a pencil on the desk in the morning", smaller: "Just read one problem" },
    note: "Having the book already on the desk helped.",
  },
};
function seedFor(lang) {
  const d = SAMPLE.en;
  const day = (main, step, rating, extra) => ({
    brain: "", main: { text: main, step: step || "", done: !!rating && rating > 2 }, extras: [{ text: "", done: false }, { text: "", done: false }],
    start: { when: "", where: "", what: "" }, time: { budget: "", custom: "" }, evening: { worked: "", easier: "" }, rating: rating || null, ratingNote: "", updatedAt: iso("2026-10-14"), ...extra,
  });
  const days = {};
  for (const [k, m, r] of d.past) days[k] = day(m, "", r);
  days["2026-10-14"] = day(d.main, d.step, null, {
    extras: [{ text: d.extras[0], done: true }, { text: d.extras[1], done: false }],
    start: { when: d.when, where: d.where, what: "" }, time: { budget: "30", custom: "" },
  });
  days["2026-10-14"].main.done = false;
  const pid = "pdemo1";
  const log = {};
  [["2026-10-08", "done"], ["2026-10-09", "done"], ["2026-10-10", "smaller"], ["2026-10-11", "skipped"], ["2026-10-12", "done"], ["2026-10-13", "done"], ["2026-10-14", "done"]].forEach(([k, s]) => {
    log[k] = { status: s, note: k === "2026-10-13" ? d.note : "", planId: pid, updatedAt: iso(k) };
  });
  const habit = { activePlanId: pid, plans: { [pid]: { id: pid, ...d.plan, createdAt: iso("2026-10-08"), updatedAt: iso("2026-10-08"), archivedAt: null } }, log, reviews: {}, draft: null };
  return {
    "gx.ssc.meta": JSON.stringify({ schema: 3 }),
    "gx.ssc.days.v1": JSON.stringify(days),
    "gx.ssc.habit.v1": JSON.stringify(habit),
    "gx.ssc.settings.v1": JSON.stringify({ lang, motion: "off", welcomed: true }),
  };
}

async function screens(browser, lang, dir) {
  const shots = {};
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: "en-US", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.clock.install({ time: TODAY });
  await page.addInitScript((seed) => { if (!sessionStorage.getItem("s")) { sessionStorage.setItem("s", "1"); for (const k in seed) localStorage.setItem(k, seed[k]); } }, seedFor(lang));
  const url = pathToFileURL(join(root, "app", "dist", "index.html")).href;
  await page.goto(url + "#hosgeldin");
  // Uygulamanın gerçek yazı tipleri (Google Fonts yerine yerel kopya)
  await page.addStyleTag({ content: fontsCss });
  await page.evaluate(() => document.fonts.ready);
  const snap = async (name, prep) => {
    if (prep) await prep();
    await page.waitForTimeout(250);
    await page.evaluate(() => window.scrollTo(0, 0));
    const f = join(dir, `${lang}-${name}.png`);
    await page.screenshot({ path: f });
    shots[name] = f;
  };
  const go = async (h) => { await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(200); };
  // Açılış ekranında "kaldığın yerden devam" kutusu görünmesin diye lastPlace yok
  await snap("home");
  await snap("day", () => go("#gunum"));
  // Başlama planı açık, ana iş ve ilk adım üstte
  await page.evaluate(() => { document.getElementById("d-start").open = true; document.getElementById("d-extras").open = true; });
  await page.waitForTimeout(200);
  await page.evaluate(() => { const r = document.getElementById("f-main").getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - 120); });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(dir, `${lang}-start.png`) });
  shots.start = join(dir, `${lang}-start.png`);
  await go("#gunum");
  await page.click("#cal-toggle");
  await page.waitForTimeout(250);
  await page.click("#cal-day-2026-10-09");
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(dir, `${lang}-calendar.png`) });
  shots.calendar = join(dir, `${lang}-calendar.png`);
  await page.click("#cal-toggle");
  await go("#aliskanlik");
  await page.waitForTimeout(200);
  await page.evaluate(() => { const r = document.getElementById("week-title").getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - 380); });
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(dir, `${lang}-habit.png`) });
  shots.habit = join(dir, `${lang}-habit.png`);
  await go("#oku-bolum-2");
  await page.waitForTimeout(250);
  await page.evaluate(() => document.getElementById("blk-b2-gorsel").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(dir, `${lang}-read.png`) });
  shots.read = join(dir, `${lang}-read.png`);
  await snap("contents", () => go("#oku"));
  await go("#hosgeldin");
  await page.click("#open-language");
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(dir, `${lang}-language.png`) });
  shots.language = join(dir, `${lang}-language.png`);
  await ctx.close();
  return shots;
}

/* ---------- İlan görselleri (2700×2025) ---------- */
function img(p) { return "data:image/png;base64," + readFileSync(p).toString("base64"); }
function phone(p, extra = "") { return `<div class="phone ${extra}"><img src="${img(p)}"></div>`; }
const IMG_CSS = `${BASE_CSS}
body { width: 2700px; height: 2025px; overflow: hidden; background: var(--cream); }
.wrap { position: absolute; inset: 0; padding: 150px 170px; display: flex; gap: 120px; align-items: center; }
.brand { letter-spacing: .16em; text-transform: uppercase; font-weight: 700; font-size: 40px; color: var(--sage); }
h1 { font-size: 148px; margin: 26px 0 30px; line-height: 1.04; }
h2 { font-size: 112px; margin: 18px 0 36px; line-height: 1.06; }
.lead { font-size: 54px; line-height: 1.35; color: var(--ink-soft); margin: 0 0 50px; }
.pill { display: inline-block; background: var(--sage-deep); color: var(--cover-ink); border-radius: 999px; padding: 22px 44px; font-size: 42px; font-weight: 600; margin: 0 16px 16px 0; }
.pill--accent { background: var(--accent); color: #fff; }
ul.ticks { list-style: none; padding: 0; margin: 0; font-size: 52px; line-height: 1.3; }
ul.ticks li { display: flex; gap: 28px; margin-bottom: 34px; }
ul.ticks li::before { content: ""; flex: none; width: 34px; height: 34px; margin-top: 14px; border-radius: 50%; background: var(--accent-mark); }
.phone { flex: none; width: 640px; height: 1385px; border-radius: 80px; background: #1d231f; padding: 26px; box-shadow: 0 50px 110px rgb(29 35 31 / .28); }
.phone img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 56px; display: block; }
.phone--sm { width: 560px; height: 1212px; border-radius: 82px; }
.phone--sm img { border-radius: 50px; }
.col { flex: 1; min-width: 0; }
.phones { display: flex; gap: 60px; align-items: center; }
.lift { transform: translateY(-70px); }
.drop { transform: translateY(70px); }
.foot { position: absolute; left: 170px; right: 170px; bottom: 80px; font-size: 38px; color: var(--ink-soft); }
.card { background: var(--paper); border: 3px solid var(--line); border-radius: 48px; padding: 70px 64px; }
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; width: 100%; }
.grid3 h3 { font-size: 72px; margin: 0 0 24px; }
.grid3 p { font-size: 46px; line-height: 1.38; color: var(--ink-soft); margin: 0; }
.num { width: 120px; height: 120px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 64px; font-weight: 700; display: grid; place-items: center; margin-bottom: 40px; }
.langs { display: flex; flex-wrap: wrap; gap: 26px; margin: 10px 0 56px; }
.langs span { background: var(--paper); border: 3px solid var(--sage-soft); border-radius: 24px; padding: 22px 40px; font-size: 52px; font-weight: 600; }
.coverbg { background: var(--cover-bg); color: var(--cover-ink); }
.coverbg .brand { color: var(--cover-muted); }
.coverbg .lead { color: var(--cover-muted); }
`;
function page(body, cls = "") { return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${IMG_CSS}</style></head><body class="${cls}">${body}</body></html>`; }

function listingPages(s) {
  return [
    ["01-hero", page(`<div class="wrap"><div class="col"><span class="brand">Genix Studio</span><h1>Small Steps,<br>Clear Days</h1><p class="lead">A short illustrated read and a gentle daily planner for students and busy beginners.</p><div><span class="pill pill--accent">Digital download</span><span class="pill">Web app + PDF book</span><span class="pill">7 languages</span></div></div><div class="phones">${phone(s.home, "phone--sm drop")}${phone(s.day, "lift")}</div></div>`)],
    ["02-inside", page(`<div class="wrap" style="flex-direction:column;align-items:stretch;justify-content:center;gap:80px"><div><span class="brand">What's inside</span><h2 style="margin-bottom:0">Three simple parts. Use one, or all three.</h2></div><div class="grid3"><div class="card"><div class="num">1</div><h3>Read</h3><p>A complete short book in five parts: one scene, one idea, one small exercise at a time. Research notes with their limits, clearly separated from advice.</p></div><div class="card"><div class="num">2</div><h3>My Day</h3><p>One main task and its first small step. Optional start time, two extra tasks, an evening check-in and a monthly calendar.</p></div><div class="card"><div class="num">3</div><h3>My Habit</h3><p>One small habit, set up in six short steps and tried for seven days. A smaller option for hard days. No streaks, no points.</p></div></div></div>`)],
    ["03-my-day", page(`<div class="wrap"><div class="phones">${phone(s.day)}${phone(s.start, "phone--sm drop")}</div><div class="col"><span class="brand">My Day</span><h2>Plan a realistic day, not a perfect one</h2><ul class="ticks"><li>Choose today's one main task</li><li>Turn it into a first small step</li><li>Add when and where you'll start</li><li>At most two extra tasks — the rest can wait</li><li>Optional evening check-in, rated 1–5 only if you want</li></ul></div></div>`)],
    ["04-calendar", page(`<div class="wrap"><div class="col"><span class="brand">Monthly calendar</span><h2>See your past days at a glance</h2><ul class="ticks"><li>Week starts on Monday</li><li>Tap any day to see its plan and notes</li><li>Empty days are just empty — not a failure</li><li>Plan ahead for a future day</li></ul></div>${phone(s.calendar)}</div>`)],
    ["05-my-habit", page(`<div class="wrap">${phone(s.habit)}<div class="col"><span class="brand">My Habit</span><h2>One small habit, a seven-day trial</h2><ul class="ticks"><li>Six short questions turn a goal into a tiny start</li><li>Each day: did my small step, did the smaller option, or not today — plus an optional note</li><li>A neutral seven-day view — no streak counters</li><li>Review and adjust your plan when you like</li></ul></div></div>`)],
    ["06-book", page(`<div class="wrap"><div class="col"><span class="brand">The book</span><h2>A short read with original illustrations</h2><ul class="ticks"><li>Introduction, three chapters and a closing note</li><li>Everyday scenes, one small exercise per chapter</li><li>Research findings shown with their limits and sources</li><li>Read in the app or as the included PDF</li></ul></div><div class="phones">${phone(s.contents, "phone--sm drop")}${phone(s.read, "lift")}</div></div>`)],
    ["07-languages", page(`<div class="wrap">${phone(s.language)}<div class="col"><span class="brand">7 languages</span><h2>Switch the language any time</h2><div class="langs"><span>English</span><span>Türkçe</span><span>Deutsch</span><span>Français</span><span>Español</span><span>Italiano</span><span>Nederlands</span></div><ul class="ticks"><li>App and book in every language</li><li>Your entries stay the same when you switch</li></ul></div></div>`)],
    ["08-how-it-works", page(`<div class="wrap" style="flex-direction:column;align-items:stretch;justify-content:center;gap:80px"><div><span class="brand">How it works</span><h2 style="margin-bottom:0">Instant digital download</h2></div><div class="grid3"><div class="card"><div class="num">1</div><h3>Download</h3><p>After purchase, download your files from Etsy: the “Start here” PDF with your app link, and the PDF book.</p></div><div class="card"><div class="num">2</div><h3>Open the link</h3><p>Open it in Safari or Chrome on your phone, tablet or computer. No app store, no account.</p></div><div class="card"><div class="num">3</div><h3>Add to home screen</h3><p>It then opens full-screen like an app. Your entries stay private, only on your device.</p></div></div><p class="lead" style="margin:0;font-size:44px">Personal use only · Nothing is shipped · Internet needed the first time you open it</p></div>`)],
  ];
}

/* ---------- Çalıştır ---------- */
rmSync(OUT, { recursive: true, force: true });
for (const d of ["upload", "books", "images", "screens", "tmp"]) mkdirSync(join(OUT, d), { recursive: true });
const browser = await playwright.chromium.launch();
const pdfPage = await browser.newPage();
async function pdf(html, file, opts = {}) {
  const tmp = join(OUT, "tmp", "page.html");
  writeFileSync(tmp, html);
  await pdfPage.goto(pathToFileURL(tmp).href);
  await pdfPage.evaluate(() => document.fonts.ready);
  await pdfPage.pdf({ path: file, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: !!opts.footer, headerTemplate: "<span></span>", footerTemplate: opts.footer || "<span></span>" });
}
const footer = `<div style="width:100%;font-size:7px;color:#4d554f;text-align:center;font-family:sans-serif"><span class="pageNumber"></span></div>`;

await pdf(await startHereHtml(), join(OUT, "upload", "01_START-HERE_Small-Steps-Clear-Days.pdf"));
for (const l of LANGS) {
  await pdf(await bookHtml(l), join(OUT, "books", `Book_${l.toUpperCase()}_Small-Steps-Clear-Days.pdf`), { footer });
}
execFileSync("cp", [join(OUT, "books", "Book_EN_Small-Steps-Clear-Days.pdf"), join(OUT, "upload", "02_Book_EN_Small-Steps-Clear-Days.pdf")]);
execFileSync("zip", ["-j", "-q", join(OUT, "upload", "03_Book_other-languages.zip"), ...LANGS.filter((l) => l !== "en").map((l) => join(OUT, "books", `Book_${l.toUpperCase()}_Small-Steps-Clear-Days.pdf`))]);

const shots = await screens(browser, "en", join(OUT, "screens"));
const imgPage = await browser.newPage({ viewport: { width: 2700, height: 2025 }, deviceScaleFactor: 1 });
for (const [name, html] of listingPages(shots)) {
  const tmp = join(OUT, "tmp", `${name}.html`);
  writeFileSync(tmp, html);
  await imgPage.goto(pathToFileURL(tmp).href);
  await imgPage.evaluate(() => document.fonts.ready);
  await imgPage.screenshot({ path: join(OUT, "images", `${name}.png`) });
}
await browser.close();
rmSync(join(OUT, "tmp"), { recursive: true, force: true });
// Tek indirilebilir paket: yüklenecek dosyalar, ilan görselleri, ilan metinleri ve rehber
const PACKAGE = join(OUT, "Small-Steps-Clear-Days_Etsy-Package.zip");
execFileSync("zip", ["-r", "-q", PACKAGE, "upload", "images"], { cwd: OUT });
execFileSync("zip", ["-j", "-q", PACKAGE, ...["listing.md", "listing-translations.md", "ETSY-UPLOAD-GUIDE.md"].map((f) => join(here, f))]);
console.log("Bağlantı:", APP_URL);
console.log("Çıktı:", OUT);
