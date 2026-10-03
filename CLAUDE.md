# CLAUDE.md

Bu dosya, Claude Code'un bu projede yeni bir oturumda bağlamı hızla kavraması ve kaldığı yerden devam edebilmesi için hazırlandı. Her oturumun sonunda **"Durum ve İlerleme"** bölümünü güncel tutun.

## Proje Özeti

- **Marka:** Genix Studio. İnsanların günlük hayatlarında küçük ama anlamlı değişiklikler yapmasına yardımcı olan dijital kişisel gelişim markası.
- **Ürün alanları:** (1) görsellerle desteklenen kısa dijital kitaplar, (2) dijital planlayıcılar, (3) küçük etkileşimli araçlar. **Şu an yalnızca ilk paket geliştiriliyor.** Mağaza veya büyük bir platform kurulmayacak.
- **İlk paket:** *Small Steps, Clear Days — A Short Read & Gentle Daily Planner*. Türkçe çalışma adı: **Küçük Adımlar, Daha Net Günler**.
- **Amaç:** Okuyucunun aklındaki işleri görünür kılması, bugün için gerçekçi bir öncelik seçmesi ve küçük bir başlangıç yapması. Kitap ve planlayıcı birbirinden bağımsız olarak da kullanılabilmeli.
- **Hedef kitle:** Üniversite öğrencileri, çalışma hayatına yeni başlayanlar, nereden başlayacağını bilemeyenler, ayrıntılı planlama sistemlerinden bunalanlar.
- **Repo:** `emirhansahin5970-pixel/etsy-magaza`
- **Dil:** İletişim, kitap ve arayüz Türkçe. İngilizce sürüm daha sonra hazırlanacak, dil değiştirici yok. Kod ve commit mesajları İngilizce.

## Ürün Kuralları (değiştirmeden önce sahibine sor)

- Abartılı vaat yok: "hayatını değiştir", "ertelemeyi kesin bitir", "bilimsel olarak garantili" gibi ifadeler kullanılmaz.
- Üslup samimi ve yetişkine hitap eden bir dil. Öğüt veren, suçlayan ya da aşırı motive eden bir ton yok.
- Her bölümde şunlar bulunur: gündelik bir sahne, açıklama, özgün bir görsel, küçük bir uygulama ve tek cümlelik bir özet.
- Araştırma bulgusu (`research` bloğu) ile yazarın önerisi (`suggestion` bloğu) ayrı tutulur. Sınırlı bulgular genelleştirilmez. Kaynak uydurulmaz.
- Planlayıcıda yalnızca şu alanlar var: Aklımdakiler, Bugünün Ana İşi (ve ilk adımı), en fazla iki ek iş, Başlama Planım (ne zaman, nerede, ne), Akşam Notum (iki soru).
- Hesap, sosyal paylaşım, bildirim, yapay zekâ sohbeti, ödeme ekranı ya da istatistik paneli eklenmez.
- Animasyonlar yalnızca kısa ve yumuşak geçişlerden oluşur. Cihazın hareket tercihi dikkate alınır ve animasyonlar arayüzden kapatılabilir.
- Veriler yalnızca tarayıcıda (localStorage) tutulur. Bu durum kullanıcıya açıkça söylenir. Çevrimdışı çalışma gerçekten uygulanıp test edilmeden vaat edilmez.
- Tasarım: açık krem zemin, koyu metin, adaçayı yeşili ve ölçülü turuncu, büyük yazılar, dokunmaya uygun düğmeler (en az 48px). Çocuksu bir görünüm yok.

## Teknoloji

- Bağımlılığı olmayan, düz HTML, CSS ve JavaScript (ES5 uyumlu IIFE). Derleme adımı yalnızca dosyaları tek HTML dosyasında birleştirir.
- Yazı tipleri Google Fonts'tan geliyor (Fraunces, Literata, Figtree). Yüklenmezse sistem yazı tiplerine düşer.
- Testler için Node 22'nin `node:test` modülü ve sistemdeki Playwright (Chromium, `/opt/node-tools/node_modules/playwright`) kullanılıyor. Bu ortamda WebKit/Safari motoru yok.

## Klasör Yapısı

```
app/src/index.html         İskelet (@artifact-* işaretçileri derleme için)
app/src/styles.css         Tasarım tokenleri en üstte
app/src/i18n/tr.js         BÜTÜN arayüz metinleri → window.GX_STRINGS
app/src/content/book.tr.js Kitap içeriği ve kaynakça → window.GX_BOOK
app/src/illustrations.js   SVG görseller → window.GX_ART
app/src/storage.js         Veri katmanı → window.GX_STORE (Node'da require edilebilir)
app/src/app.js             Yönlendirme ve ekranlar
app/build.mjs              → app/dist/index.html ve app/dist/artifact.html
tests/storage.test.mjs     Birim testleri
tests/e2e.mjs              Chromium uçtan uca testleri (13 senaryo)
docs/telefon-test-listesi.md  Sahibin gerçek cihazda uygulayacağı test listesi
```

Rotalar: `#hosgeldin`, `#oku`, `#oku-<bolumId>`, `#planla`, `#gun-YYYY-AA-GG`, `#gecmis`.
Depolama anahtarları: `gx.ssc.days.v1` (günler), `gx.ssc.settings.v1` (ayarlar), `gx.ssc.days.beforeRestore` (geri yüklemeden önceki kopya).

## Komutlar

```bash
npm run build                          # dist/ dosyalarını üret (src değişince her seferinde)
node --test tests/storage.test.mjs     # birim testleri
node tests/e2e.mjs                     # tarayıcı testleri (önce build)
npm test                               # hepsi
```

## Yayın

- Prototip, özel bir claude.ai Artifact'ı olarak yayında: https://claude.ai/artifact/AQwSnF55f1uGJsMyNjYy4Z
  - Güncellemek için `app/dist/artifact.html` dosyasını Artifact aracıyla bu URL'ye yeniden yayınla.
  - Sayfa yalnızca sahibine açık. Müşteri erişimi için uygun değil.
  - Artifact ortamında dosya indirme engelli. Bu yüzden "Yedeği metin olarak göster ve kopyala" seçeneği ile metin yapıştırarak geri yükleme eklendi.
- `app/dist/index.html` herhangi bir HTTPS statik barındırmaya (GitHub Pages, Netlify vb.) konabilir. **Henüz bir barındırma yapılmadı.**

## Kaynaklar (doğrulandı: arama motoru ve üniversite/akademik kayıtlarla eşleştirildi)

Masicampo ve Baumeister 2011 (10.1037/a0024192), Scullin vd. 2018 (10.1037/xge0000374), Gollwitzer 1999 (10.1037/0003-066X.54.7.493), Gollwitzer ve Sheeran 2006 (10.1016/S0065-2601(06)38002-1), Lally vd. 2010 (10.1002/ejsp.674). Ayrıntılar `book.tr.js` içindeki `sources` alanında. Yayıncı sayfaları bu ortamdan açılamadı (ağ politikası). Satıştan önce DOI bağlantıları tarayıcıda bir kez kontrol edilmeli.
Planlanan kullanım: Bölüm 2'de Gollwitzer'ın iki çalışması (uygulama niyeti, "ne zaman, nerede, ne"), Bölüm 3'te Lally vd. 2010 (bir günü kaçırmak alışkanlık oluşumunu belirgin biçimde bozmadı; süre kişiden kişiye çok değişti: 18–254 gün).

## Durum ve İlerleme

### Tamamlananlar
- [x] Repo ve CLAUDE.md (2026-10-02)
- [x] Prototip aşaması 1 (2026-10-02): karşılama, Başlarken ve Bölüm 1 tam metni, planlayıcı, geçmiş günler, yedek alma ve geri yükleme, animasyon ayarı
- [x] Birim testleri 8/8, Chromium uçtan uca testleri 13/13

### Kelime sayıları (kaynakça hariç)
- Başlarken: 133 · Bölüm 1: 808 · Toplam: yaklaşık 940 (hedef 2.500–3.500)

### Sıradaki Adımlar (sahibin prototip değerlendirmesinden SONRA)
- [ ] Sahibin telefon/tablet test sonuçlarını al (`docs/telefon-test-listesi.md`) ve geri bildirimlere göre düzelt
- [ ] Bölüm 2 (~1.000 kelime, Gollwitzer kaynakları, görsel: büyük işin küçük adımlara ayrılması)
- [ ] Bölüm 3 (~900 kelime, Lally 2010, görsel: esnek günlük plan, 7 günlük deneme)
- [ ] Kısa bir kapanış ve tam kaynakça
- [ ] Mobilde okunacak düz PDF mini kitap (Türkçe karakterleri ve görselleri kontrol et; etkileşim varmış gibi tanıtma)
- [ ] Kullanım belgesi (web sürümüne erişim, web ile PDF arasındaki fark) ve yardım metni (veri saklama, yedekleme, tarayıcı gereksinimleri)
- [ ] Satış öncesi kararlar: barındırma yeri, bağlantı paylaşımı, müşteri erişim yöntemi, barındırmanın sürekliliği

### Notlar / Kararlar
- 2026-10-02: Prototip, sahibin kendi kullanımı için claude.ai Artifact olarak yayınlandı. Satış için ayrı bir barındırma kararı gerekiyor.
- 2026-10-02: Geçmiş bir gün düzenlenebilir. Form, açıldığı tarihe sabitlenir; gece yarısı geçse bile yazılanlar o güne gider ve "Yeni bir gün başladı" uyarısı çıkar.
- 2026-10-02: Geri yükleme bir birleştirmedir. Aynı tarihli günlerde yedekteki kayıt kullanılır, diğer günler korunur. Hatalı dosyada hiçbir şey değişmez.
