# CLAUDE.md

Bu dosya, Claude Code'un bu projede yeni bir oturumda bağlamı hızla kavraması ve kaldığı yerden devam edebilmesi için hazırlandı. Her oturumun sonunda **"Durum ve İlerleme"** bölümünü güncel tutun.

## Proje Özeti

- **Marka:** Genix Studio. İnsanların günlük hayatlarında küçük ama anlamlı değişiklikler yapmasına yardımcı olan dijital kişisel gelişim markası.
- **Ürün alanları:** (1) görsellerle desteklenen kısa dijital kitaplar, (2) dijital planlayıcılar, (3) küçük etkileşimli araçlar. **Şu an yalnızca ilk paket geliştiriliyor.** Mağaza veya büyük bir platform kurulmayacak.
- **İlk paket:** *Small Steps, Clear Days — A Short Read & Gentle Daily Planner*. Türkçe çalışma adı: **Küçük Adımlar, Daha Net Günler**.
- **Amaç:** Üç işlev: (1) kısa, görselli bir kitap okumak, (2) gerçekçi bir günlük plan yapmak, (3) tek bir alışkanlığı küçük adımlarla denemek. Kitap, planlayıcı ve alışkanlık bölümü birbirinden bağımsız kullanılabilmeli.
- **Hedef kitle:** Üniversite öğrencileri, çalışma hayatına yeni başlayanlar, nereden başlayacağını bilemeyenler, ayrıntılı planlama sistemlerinden bunalanlar.
- **Repo:** `emirhansahin5970-pixel/etsy-magaza`
- **Dil:** Sahiple iletişim Türkçe. Kod ve commit mesajları İngilizce. **Arayüz 7 dilde** (2026-10-03 kararı, Etsy'nin site dilleri + Türkçe): Türkçe, English, Deutsch, Français, Español, Italiano, Nederlands. **İlk açılış her cihazda İngilizce** (2026-10-04 sahip kararı); kullanıcı üstteki küre (EN) düğmesinden dil seçer. Kitap da 7 dilde (book.<dil>.js). Çeviriler satıştan önce anadili konuşan biri tarafından gözden geçirilmeli.

## Ürün Kuralları (değiştirmeden önce sahibine sor)

- Abartılı vaat yok: "hayatını değiştir", "ertelemeyi kesin bitir", "bilimsel olarak garantili" gibi ifadeler kullanılmaz.
- Üslup samimi ve yetişkine hitap eden bir dil. Öğüt veren, suçlayan ya da aşırı motive eden bir ton yok.
- Her bölümde şunlar bulunur: gündelik bir sahne, açıklama, özgün bir görsel, küçük bir uygulama ve tek cümlelik bir özet.
- Araştırma bulgusu (`research` bloğu) ile yazarın önerisi (`suggestion` bloğu) ayrı tutulur. Sınırlı bulgular genelleştirilmez. Kaynak uydurulmaz.
- Günüm: üstte açılıp kapanan aylık takvim (varsayılan kapalı; pazartesi başlar; bugün = çerçeve, seçili = dolgu + alt çizgi; işaretler metinle de anlatılır; boş gün eksiklik gibi gösterilmez). İlk bakışta yalnızca ana iş ve ilk küçük adım. Açılır bölümler: aklımdakiler, iki ek iş, başlama zamanı (ne zaman, nerede ve isteğe bağlı süre: 5/15/30/kendim), akşam değerlendirmesi (isteğe bağlı 1–5 gün değerlendirmesi + "neden" notu; varsayılan seçim yok; otomatik hesaplanmaz; gelecek günde kapalı; toplam/ortalama/seri yok). Başlama planı ilk küçük adımı kendiliğinden kullanır; "ne yapacağım?" ayrıca sorulmaz.
- Alışkanlığım: aynı anda tek aktif alışkanlık. 6 adımlı kurulum, günlük üç seçenek (yaptım / daha küçüğünü yaptım / yapmadım) ve bir not, nötr yedi günlük görünüm, istenince değerlendirme. Puan, rozet ve seri sayacı yok.
- Hesap, sosyal paylaşım, bildirim, yapay zekâ sohbeti, ödeme ekranı, puan, rozet, seri sayacı ya da istatistik paneli eklenmez.
- Animasyonlar yalnızca kısa ve yumuşak geçişlerden oluşur. Cihazın hareket tercihi dikkate alınır ve animasyonlar arayüzden kapatılabilir.
- Veriler yalnızca tarayıcıda (localStorage) tutulur. Bu durum kullanıcıya açıkça söylenir. Çevrimdışı çalışma gerçekten uygulanıp test edilmeden vaat edilmez.
- Tema: Açık / Koyu / Cihaz ayarına uy (varsayılan cihaz). Bütün renkler CSS değişkeni; koyu değerler styles.css'te iki blokta (medya sorgusu + [data-theme="dark"]) aynı tutulur, tests/contrast.mjs denetler. Tema <head> içindeki küçük betikle çizimden önce uygulanır.
- Tasarım: açık krem zemin, koyu metin, adaçayı yeşili. Turuncu yalnızca önemli eylemler (birincil düğme) ve küçük işaretler için. İki yazı ailesi (Fraunces başlık, Figtree metin ve arayüz). Kutular yalnızca uygulama, araştırma ve önemli eylem alanlarında. Dokunma alanları en az 44px. Çocuksu bir görünüm yok.

## Teknoloji

- Bağımlılığı olmayan, düz HTML, CSS ve JavaScript (ES5 uyumlu IIFE; boot.js ES3). Derleme dosyaları tek HTML'de birleştirir ve `data-t` metinlerini en.js'ten HTML'e yazar (JavaScript'siz görünüm için; ilk açılış dili İngilizce).
- Açılış kuralları: Google Fonts çizimi engellememeli (`media="print"` + boot.js). Başlangıçta kullanılan her tarayıcı API'si korumalı olmalı (Intl, localStorage, showModal yedekleri var). Hata durumunda boş ekran değil, mesaj ve ayrı teknik ayrıntı gösterilir.
- Yazı tipleri Google Fonts'tan geliyor (Fraunces, Figtree). Yüklenmezse sistem yazı tiplerine düşer; testler fontlar engellenmiş hâlde çalışır.
- Testler için Node 22'nin `node:test` modülü ve sistemdeki Playwright (Chromium, `/opt/node-tools/node_modules/playwright`) kullanılıyor. Bu ortamda WebKit/Safari motoru yok.

## Klasör Yapısı

```
app/src/index.html         İskelet + JavaScript'siz başlangıç ekranı ve noscript (@artifact-* işaretçileri derleme için)
app/src/boot.js            Başlangıç güvenlik ağı (ES3): font yükleme, hata/zaman aşımı ekranı, GX_BOOT.ready()/fail()
app/src/styles.css         Tasarım tokenleri en üstte
app/src/i18n/<dil>.js      Arayüz metinleri → window.GX_I18N.<dil> (tr, en, de, fr, es, it, nl; tr.js ana kaynak, GX_STRINGS = tr)
app/src/content/book.<dil>.js Kitap → window.GX_BOOKS.<dil> (tr ana kaynak + kaynakça; diğer diller aynı bölüm/blok kimlikleri, kaynakça yok)
app/src/illustrations.js   SVG görseller → window.GX_ART
app/src/storage.js         Veri katmanı, şema 2, geçiş ve yedek → window.GX_STORE (Node'da require edilebilir)
app/src/app.js             Yönlendirme ve ekranlar
app/src/pwa/                Uygulama tanımı (manifest), service worker (sw.js) ve ana ekran simgeleri
app/build.mjs              → app/dist/ (web klasörü: index.html, manifest, sw.js, icons/) ve app/dist-artifact/artifact.html
tools/make-icons.mjs       Simgeleri SVG'den yeniden üretir
.github/workflows/pages.yml main'e gönderimde derler ve GitHub Pages'te yayınlar
tests/storage.test.mjs     Birim testleri
tests/e2e.mjs              Chromium uçtan uca testleri (17 senaryo)
tests/boot.mjs             Açılış testleri (13): HTTPS, yerel dosya, JavaScript kapalı, başlangıç hataları, eksik API'ler
tests/pwa.mjs              Barındırılan klasör testleri (4): alt yol, manifest/simgeler, service worker, internetsiz yeniden açılış
tests/v3.mjs               Sürüm 3 testleri (15): takvim, değerlendirme, tema, v1/v2 uyumluluğu, yedek
tests/i18n.test.mjs        Dil dosyaları: anahtar, yer tutucu ve dizi uzunluğu eşitliği, Türkçe kalmış metin yok
tests/lang.mjs             Dil testleri (9): ilk açılış İngilizce, küre düğmesi, değiştirme/kalıcılık, kitap dili notu, tarih, başlangıç ekranı, 7 dilde 320 px
tests/book.test.mjs        Kitap çevirilerinin yapısı Türkçe ile aynı, Türkçe harf kalmamış
tests/helpers.mjs          turkishUI(): eski Türkçe testler için dil tercihini tr gösterir
etsy/                      Etsy paketi: build.mjs (teslim PDF'i, 7 dilde kitap PDF'i, ilan görselleri), listing.md, listing-translations.md, ETSY-YUKLEME.md (sahip rehberi), fonts/ (OFL)
tests/contrast.mjs         İki temada renk kontrastı denetimi (metin ≥ 4.5:1, kenarlık/odak ≥ 3:1)
tests/fixtures/            Önceki sürümlerin (v1, v2) uygulaması, localStorage içeriği ve yedeği: geriye uyumluluk testleri için
docs/telefon-test-listesi.md  Açılış teşhisi + sahibin gerçek cihazda uygulayacağı test listesi
docs/barindirma.md         Web bağlantısında yayınlama adımları
```

Rotalar: `#hosgeldin` (boş adres de açılışa gider), `#oku`, `#oku-<bolumId>`, `#gunum` (eski `#planla` de çalışır), `#gun-YYYY-AA-GG`, `#gecmis`, `#aliskanlik`, `#aliskanlik-kur`.
Depolama anahtarları: `gx.ssc.days.v1` (günler; şema 2'de de aynı anahtar), `gx.ssc.habit.v1` (alışkanlık), `gx.ssc.settings.v1` (tercihler: motion, textSize, theme, calendarOpen, reading, lastPlace, lang), `gx.ssc.meta` (şema sürümü), `gx.ssc.beforeRestore` (geri yüklemeden önceki kopya).

### Dil (i18n)
- Seçim: kayıtlı `settings.lang`, yoksa İngilizce (cihaz dili kullanılmaz; sahip kararı). Otomatik seçim kaydedilmez; kullanıcı Ayarlar'dan (ya da açılıştaki "Dil: …" düğmesinden) seçince kaydedilir. Dil tercihi yedeğe girmez (cihaz tercihi).
- Yeni metin eklerken: önce tr.js, sonra aynı anahtarı 6 dile ekle; `tests/i18n.test.mjs` eksik/fazla anahtarı yakalar.
- HTML İngilizce derlenir; boot.js kayıtlı dili okuyup başlangıç ekranının metinlerini hemen o dile çevirir (derleme her dilin boot + sabit metinlerini boot.js'e yazar). noscript metni Türkçe + İngilizce.
- Türkçeye özgü özet cümleleri (`-de/-da` kuralı) yalnızca `features.sentenceSummary: true` olan dilde (tr) kurulur; diğer dillerde etiketli özet.
- Kitap seçili dilde açılır; o dilde kitap yoksa Türkçe kitap + not gösterilir (lang="tr"). Okuma konumu bölüm/blok kimliğiyle saklandığı için dil değişince korunur.
- Manifest adı İngilizce ("Small Steps"); iOS ana ekran adı seçili dile göre ayarlanır.

### Veri şeması ve geçiş (önemli)
- Şema 3. Geçiş, okuma sırasında `migrateDay` ile yapılır: eksik `time` alanı `{budget:"", custom:""}`, eksik `rating` null, eksik `ratingNote` "" olur. Yalnızca puan girilmiş gün de geçerli kayıttır. Gelecek güne `rating` kaydedilmez (saveDay reddeder). Eski `start.what` metni **silinmez**; Günüm ekranı gösterir ve kullanıcı "İlk küçük adımı kullan" ya da "Bu metni ilk küçük adım yap" seçeneklerinden birini seçebilir.
- Alışkanlık planı: hedef (`goal`) değiştiğinde ve eski planın kayıtları varsa `applyPlanEdit` eski planı arşivler ve yeni plan açar. Kayıtlar `planId` ile eski plana bağlı kalır.
- Yedek: sürüm 3 (günler + alışkanlık + görünüm tercihleri: tema, animasyon, yazı boyutu). Sürüm 1 ve 2 yedekleri de kabul edilir. **Alan yok ≠ alan boş:** eski yedekte hiç bulunmayan gün alanı (`time`, `rating`, `ratingNote`; `absentFields`) ve tercih mevcut veriyi ezmez; yeni yedekte açıkça null/boş olan alan boş olarak geri yüklenir. Önizleme aynı kimlikli plan ve değerlendirme cevaplarındaki eski/yeni değerleri de listeler (`plansChanged`, `reviewsChanged`). `planRestore`, onaydan önce neyin ekleneceğini, değişeceğini ya da aynı kalacağını hesaplar; `applyRestore` önce bir kopya alır. Hatalı yedekte hiçbir şey yazılmaz.
- Yazma başarısız olursa "Kaydedildi" gösterilmez. İçerik ekranda kalır, bellekte tutulur ve yedek metnine dahil edilir.

## Komutlar

```bash
npm run build                          # dist/ dosyalarını üret (src değişince her seferinde)
node --test tests/storage.test.mjs     # birim testleri
node tests/e2e.mjs                     # tarayıcı testleri (önce build)
node tests/boot.mjs                    # açılış testleri (önce build; openssl gerekir)
node tests/pwa.mjs                     # web uygulaması testleri (önce build)
node tests/v3.mjs                      # sürüm 3 testleri (önce build)
node tests/contrast.mjs                # renk kontrastı (iki tema)
node --test tests/i18n.test.mjs        # dil dosyalarının tutarlılığı
node tests/lang.mjs                    # dil testleri (önce build)
node --test tests/book.test.mjs        # kitap çevirilerinin yapısı
cd etsy && npm install && node build.mjs  # Etsy paketi → etsy/out/ (APP_URL ile bağlantı değiştirilebilir)
npm test                               # hepsi
```

## Yayın

- **Asıl kullanım yolu: web adresi.** iOS dosya önizlemeleri JavaScript çalıştırmaz; HTML dosyası telefonda uygulama olarak açılmaz. Ürün telefona/tablete her zaman bir HTTPS bağlantısıyla ulaştırılır.
- GitHub Pages: `.github/workflows/pages.yml` main'e her gönderimde `app/dist` klasörünü yayınlar. Adres: https://emirhansahin5970-pixel.github.io/etsy-magaza/ (depo ayarlarında Pages kaynağı "GitHub Actions" olmalı).
- Web sürümü PWA: "Ana Ekrana Ekle" ile tam ekran açılır; bir kez internetle açıldıktan sonra service worker sayfayı önbellekten de açabilir (Chromium'da test edildi; iPhone'da doğrulanmadı).
- Prototip ayrıca özel bir claude.ai Artifact'ı olarak yayında: https://claude.ai/artifact/AQwSnF55f1uGJsMyNjYy4Z
  - Güncellemek için `app/dist-artifact/artifact.html` dosyasını Artifact aracıyla bu URL'ye yeniden yayınla.
  - Sayfa yalnızca sahibine açık. Müşteri erişimi için uygun değil.
  - Artifact ortamında dosya indirme engelli. Bu yüzden "Yedeği metin olarak göster ve kopyala" seçeneği ile metin yapıştırarak geri yükleme eklendi.
- `app/dist/` klasörü başka bir HTTPS statik barındırmaya (Netlify, Cloudflare Pages) da olduğu gibi konabilir.

## Kaynaklar (doğrulandı: arama motoru ve üniversite/akademik kayıtlarla eşleştirildi)

Masicampo ve Baumeister 2011 (10.1037/a0024192), Scullin vd. 2018 (10.1037/xge0000374), Gollwitzer 1999 (10.1037/0003-066X.54.7.493), Gollwitzer ve Sheeran 2006 (10.1016/S0065-2601(06)38002-1), Lally vd. 2010 (10.1002/ejsp.674). Ayrıntılar `book.tr.js` içindeki `sources` alanında. Yayıncı sayfaları bu ortamdan açılamadı (ağ politikası). Satıştan önce DOI bağlantıları tarayıcıda bir kez kontrol edilmeli.
Planlanan kullanım: Bölüm 2'de Gollwitzer'ın iki çalışması (uygulama niyeti, "ne zaman, nerede, ne"), Bölüm 3'te Lally vd. 2010 (bir günü kaçırmak alışkanlık oluşumunu belirgin biçimde bozmadı; süre kişiden kişiye çok değişti: 18–254 gün).

## Durum ve İlerleme

### Tamamlananlar
- [x] Repo ve CLAUDE.md (2026-10-02)
- [x] Prototip aşaması 1 (2026-10-02): karşılama, Başlarken ve Bölüm 1 tam metni, planlayıcı, geçmiş günler, yedek alma ve geri yükleme, animasyon ayarı
- [x] Birim testleri 8/8, Chromium uçtan uca testleri 13/13 (sürüm 1)
- [x] Sürüm 2 (2026-10-03): üç sekme (Oku / Günüm / Alışkanlığım), kapaklı açılış ekranı ve devam seçeneği, okuma parçaları, ilerleme, yazı boyutu, açılır araştırma ayrıntıları, sadeleştirilmiş Günüm ekranı, zaman seçimi, alışkanlık bölümü, şema 2 ve geriye uyumluluk. Birim testleri 16/16, Chromium uçtan uca testleri 17/17.

### Kelime sayıları (kaynakça hariç)
- Türkçe: Başlarken 132 · Bölüm 1 800 · Bölüm 2 770 · Bölüm 3 692 · Kapanış 101 · Toplam ~2.500 (İngilizce karşılığı ~3.600)

- [x] Sürüm 2.1 (2026-10-03): telefonda boş ekran bildirimi üzerine açılış güvenliği. JavaScript'siz başlangıç ekranı + noscript, başlangıç hata ve zaman aşımı ekranı, font yüklemesi engellemez, Intl/showModal/localStorage yedekleri. Açılış testleri 13/13, birim 16/16, uçtan uca 17/17. Gerçek cihazda henüz doğrulanmadı.

- [x] Sürüm 2.2 (2026-10-03): iPhone'da yalnızca başlık görünmesi üzerine web uygulaması (PWA) + GitHub Pages yayını. Web uygulaması testleri 4/4.

- [x] Sürüm 3 (2026-10-04): aylık takvim + gün özeti, gün değerlendirmesi (1–5), açık/koyu/cihaz teması, şema 3, yedekte alan-yok/alan-boş ayrımı, plan/değerlendirme farkları önizlemede. Form kenarlığı kontrastı düzeltildi (önceden 1.7:1). Testler: kontrast hedefte, birim 25/25, uçtan uca 17/17, açılış 13/13, web 4/4, v3 15/15. Gerçek cihazda doğrulanmadı.

- [x] Çok dilli arayüz (2026-10-03): 7 dil, dil seçici (Ayarlar + açılış), cihaz diline göre açılış, başlangıç ekranı da çevrilir. Testler: i18n 14/14 (+ birim 25/25), dil 8/8, diğerleri değişmeden geçiyor. Çeviriler yapay zekâ çevirisi; anadili konuşan kontrolü yapılmadı. Gerçek cihazda doğrulanmadı.

- [x] Satışa hazırlık (2026-10-04): ilk açılış İngilizce + üstte küre/dil düğmesi; Bölüm 2, 3 ve kapanış yazıldı (Gollwitzer 1999/2006, Lally 2010); kitap 6 dile çevrildi; Etsy paketi (START HERE PDF'i, 7 dilde kitap PDF'i, 8 ilan görseli, ilan metni + 5 dil). Testler: birim+i18n+kitap 52/52, e2e 17/17, açılış 13/13, web 4/4, v3 15/15, dil 9/9. Gerçek cihazda doğrulanmadı; çeviriler anadili kontrolünden geçmedi.

### Sıradaki Adımlar (sahibin prototip değerlendirmesinden SONRA)
- [ ] Sahibin açılış teşhisi sonucunu al (`docs/telefon-test-listesi.md` üstteki tablo): önizleme mi, tarayıcı mı, hata ayrıntısı ne?
- [x] GitHub Pages yayında (2026-10-03, ilk başarılı yayın): https://emirhansahin5970-pixel.github.io/etsy-magaza/
- [ ] Gerçek HTTPS adresinde iPhone/iPad testi (sahip yapacak)
- [ ] Sahibin sürüm 2 telefon/tablet kontrol sonuçlarını al (`docs/telefon-test-listesi.md`, 10 adım) ve geri bildirimlere göre düzelt
- [ ] Çevirileri anadili konuşanlara kontrol ettir (en, de, fr, es, it, nl); Etsy ilan metinlerini aynı dillere çevir
- [x] Kitap 7 dilde, Bölüm 2–3, kapanış, kaynakça, PDF kitap (etsy/build.mjs)
- [ ] Kullanım belgesi (web sürümüne erişim, web ile PDF arasındaki fark) ve yardım metni (veri saklama, yedekleme, tarayıcı gereksinimleri)
- [x] Teslim PDF'i (START HERE): bağlantı + QR, kurulum, veri/yedek, lisans, 6 dilde hızlı başlangıç
- [ ] Etsy'de yapay zekâ kullanımı beyanı kuralını kontrol et (etsy/ETSY-YUKLEME.md)
- [ ] Satıştan hemen önce: depoyu gizli yap + yayını gizli depoyla çalışan bir yere taşı (ör. Cloudflare Pages), tahmin edilemez adres (ör. /k7m2x9/). Sahibe ekran ekran tarif et.

### Notlar / Kararlar
- 2026-10-02: Prototip, sahibin kendi kullanımı için claude.ai Artifact olarak yayınlandı. Satış için ayrı bir barındırma kararı gerekiyor.
- 2026-10-02: Geçmiş bir gün düzenlenebilir. Form, açıldığı tarihe sabitlenir; gece yarısı geçse bile yazılanlar o güne gider ve "Yeni bir gün başladı" uyarısı çıkar.
- 2026-10-02: Geri yükleme bir birleştirmedir. Aynı tarihli günlerde yedekteki kayıt kullanılır, diğer günler korunur. Hatalı dosyada hiçbir şey değişmez.
- 2026-10-03: Sürüm 2. Geçmiş günler, Günüm'ün ikincil ekranı oldu. Açılış ekranı her açılışta gösterilir. Özet cümleler yalnızca yer bulunma ekiyle (-de/-da) bittiğinde kurulur, aksi hâlde etiketli özet gösterilir. Cümle ortasındaki alanların ilk harfi Türkçe kurallarıyla küçültülür.
- 2026-10-03: Telefonda boş ekran bildirimi. Kanıtlar: (1) JavaScript çalışmazsa eski HTML'de bütün metinler boş kalıyordu; (2) Google Fonts isteği yanıtsız kalırsa sayfa en az 8 sn başlamıyordu (Chromium ölçümü). Cihazdaki asıl neden henüz doğrulanmadı.
- 2026-10-03: Sahip iPhone 17 Pro'da indirilen HTML dosyasında yalnızca başlığı gördü. Neden: iOS dosya önizlemesi JavaScript çalıştırmıyor (Apple forumu, iOS 13+). Çözüm: dosya yerine GitHub Pages adresi + Ana Ekrana Ekle.

- 2026-10-03: DİL KARARI (sahip): Türkçe + Etsy'nin site dilleri (en, de, fr, es, it, nl). Arayüz şimdi, kitap Türkçe bölümler bitince. Hitap samimi: du/tu/tú/tu/je. Arapça/Çince/Hintçe Etsy payı düşük ve sağdan sola düzen gerektirdiği için şimdilik yok.
- 2026-10-03: SATIŞ MODELİ KARARI (sahip): En kolay yol. Etsy dijital ilan → alıcıya otomatik PDF → PDF içinde uygulama bağlantısı. Sipariş başına iş yok. Kişiye özel kod/hesap YOK (sahip zahmetli buldu). Paylaşım yayılırsa: adres yolunu değiştir (aynı alan adında kalınca kullanıcı kayıtları korunur), Etsy'deki PDF'i güncelle. Kopyalayıp satan olursa Etsy IP bildirim formu. Değer stratejisi: güncellemeler (yeni bölümler aynı bağlantıda), marka, PDF kitap.
- 2026-10-04: Sahip kararı: V3 ve sonraki değişiklikler çalışma dalında birikir; sahip "bitti" deyince TEK SEFERDE main'e alınır (GitHub Pages o zaman güncellenir). Ara sürümler claude.ai Artifact bağlantısında güncellenir.
