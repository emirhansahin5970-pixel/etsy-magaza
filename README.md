# etsy-magaza — Genix Studio

Genix Studio'nun dijital kişisel gelişim ürünleri. İlk paket:

**Small Steps, Clear Days** — *A Short Read & Gentle Daily Planner*
Türkçe çalışma adı: **Küçük Adımlar, Daha Net Günler**

Mini kitap ile bu kitaptaki yaklaşımı uygulayan günlük planlayıcı, mobil öncelikli bir web uygulamasında bir arada sunulur.

## Durum

İlk prototip hazır: karşılama ekranı, Başlarken ve Bölüm 1 tam metin, verileri tarayıcıda saklayan planlayıcı, geçmiş günler, yedek alma ve geri yükleme. Bölüm 2–3, PDF ve satış paketi prototip değerlendirmesinden sonra hazırlanacak. Ayrıntılar için `CLAUDE.md` dosyasına bakın.

## Klasörler

```
app/src/            Kaynak kod
  index.html        Sayfa iskeleti
  styles.css        Tasarım (renk ve yazı tokenleri en üstte)
  i18n/tr.js        Bütün arayüz metinleri (İngilizce sürüm için en.js buradan kopyalanır)
  content/book.tr.js Kitap içeriği ve kaynakça
  illustrations.js  SVG görseller
  storage.js        Kayıt, doğrulama, yedek alma ve geri yükleme
  app.js            Ekranlar ve etkileşim
app/build.mjs       Tek dosyalık sürümleri üretir
app/dist/           index.html (statik barındırma için), artifact.html (claude.ai için)
tests/              Birim ve tarayıcı testleri
docs/               Telefon test listesi
```

## Komutlar

```bash
npm run build   # app/dist/ içini yeniden üretir
npm test        # birim testleri + Chromium uçtan uca testleri
npm run serve   # app/dist'i http://localhost:8080 adresinde sunar
```

Herhangi bir paket kurulumu gerekmez. Uçtan uca testler sistemdeki Playwright'ı kullanır.
