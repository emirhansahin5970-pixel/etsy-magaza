# CLAUDE.md

Bu dosya, Claude Code'un bu projede yeni bir oturumda bağlamı hızla kavraması ve kaldığı yerden devam edebilmesi için hazırlandı. Her oturumun sonunda **"Durum ve İlerleme"** bölümünü güncel tutun.

## Proje Özeti

- **Marka:** Genix Studio. İnsanların günlük hayatlarında küçük ama anlamlı değişiklikler yapmasına yardımcı olan dijital kişisel gelişim markası.
- **Ürün alanları:** (1) görsellerle desteklenen kısa dijital kitaplar, (2) dijital planlayıcılar, (3) küçük etkileşimli araçlar. **Şu an yalnızca ilk paket geliştiriliyor.** Mağaza veya büyük bir platform kurulmayacak.
- **İlk paket:** *Small Steps, Clear Days — A Short Read & Gentle Daily Planner*. Türkçe çalışma adı: **Küçük Adımlar, Daha Net Günler**.
- **Amaç:** Üç işlev: (1) kısa, görselli bir kitap okumak, (2) gerçekçi bir günlük plan yapmak, (3) tek bir alışkanlığı küçük adımlarla denemek. Kitap, planlayıcı ve alışkanlık bölümü birbirinden bağımsız kullanılabilmeli.
- **Hedef kitle:** Üniversite öğrencileri, çalışma hayatına yeni başlayanlar, nereden başlayacağını bilemeyenler, ayrıntılı planlama sistemlerinden bunalanlar.
- **Repo:** `emirhansahin5970-pixel/etsy-magaza`
- **Dil:** İletişim, kitap ve arayüz Türkçe. İngilizce sürüm daha sonra hazırlanacak, dil değiştirici yok. Kod ve commit mesajları İngilizce.

## Ürün Kuralları (değiştirmeden önce sahibine sor)

- Abartılı vaat yok: "hayatını değiştir", "ertelemeyi kesin bitir", "bilimsel olarak garantili" gibi ifadeler kullanılmaz.
- Üslup samimi ve yetişkine hitap eden bir dil. Öğüt veren, suçlayan ya da aşırı motive eden bir ton yok.
- Her bölümde şunlar bulunur: gündelik bir sahne, açıklama, özgün bir görsel, küçük bir uygulama ve tek cümlelik bir özet.
- Araştırma bulgusu (`research` bloğu) ile yazarın önerisi (`suggestion` bloğu) ayrı tutulur. Sınırlı bulgular genelleştirilmez. Kaynak uydurulmaz.
- Günüm: ilk bakışta yalnızca ana iş ve ilk küçük adım. Açılır bölümler: aklımdakiler, iki ek iş, başlama zamanı (ne zaman, nerede ve isteğe bağlı süre: 5/15/30/kendim), akşam değerlendirmesi. Başlama planı ilk küçük adımı kendiliğinden kullanır; "ne yapacağım?" ayrıca sorulmaz.
- Alışkanlığım: aynı anda tek aktif alışkanlık. 6 adımlı kurulum, günlük üç seçenek (yaptım / daha küçüğünü yaptım / yapmadım) ve bir not, nötr yedi günlük görünüm, istenince değerlendirme. Puan, rozet ve seri sayacı yok.
- Hesap, sosyal paylaşım, bildirim, yapay zekâ sohbeti, ödeme ekranı, puan, rozet, seri sayacı ya da istatistik paneli eklenmez.
- Animasyonlar yalnızca kısa ve yumuşak geçişlerden oluşur. Cihazın hareket tercihi dikkate alınır ve animasyonlar arayüzden kapatılabilir.
- Veriler yalnızca tarayıcıda (localStorage) tutulur. Bu durum kullanıcıya açıkça söylenir. Çevrimdışı çalışma gerçekten uygulanıp test edilmeden vaat edilmez.
- Tasarım: açık krem zemin, koyu metin, adaçayı yeşili. Turuncu yalnızca önemli eylemler (birincil düğme) ve küçük işaretler için. İki yazı ailesi (Fraunces başlık, Figtree metin ve arayüz). Kutular yalnızca uygulama, araştırma ve önemli eylem alanlarında. Dokunma alanları en az 44px. Çocuksu bir görünüm yok.

## Teknoloji

- Bağımlılığı olmayan, düz HTML, CSS ve JavaScript (ES5 uyumlu IIFE; boot.js ES3). Derleme dosyaları tek HTML'de birleştirir ve `data-t` metinlerini tr.js'ten HTML'e yazar (JavaScript'siz görünüm için).
- Açılış kuralları: Google Fonts çizimi engellememeli (`media="print"` + boot.js). Başlangıçta kullanılan her tarayıcı API'si korumalı olmalı (Intl, localStorage, showModal yedekleri var). Hata durumunda boş ekran değil, mesaj ve ayrı teknik ayrıntı gösterilir.
- Yazı tipleri Google Fonts'tan geliyor (Fraunces, Figtree). Yüklenmezse sistem yazı tiplerine düşer; testler fontlar engellenmiş hâlde çalışır.
- Testler için Node 22'nin `node:test` modülü ve sistemdeki Playwright (Chromium, `/opt/node-tools/node_modules/playwright`) kullanılıyor. Bu ortamda WebKit/Safari motoru yok.

## Klasör Yapısı

```
app/src/index.html         İskelet + JavaScript'siz başlangıç ekranı ve noscript (@artifact-* işaretçileri derleme için)
app/src/boot.js            Başlangıç güvenlik ağı (ES3): font yükleme, hata/zaman aşımı ekranı, GX_BOOT.ready()/fail()
app/src/styles.css         Tasarım tokenleri en üstte
app/src/i18n/tr.js         BÜTÜN arayüz metinleri → window.GX_STRINGS
app/src/content/book.tr.js Kitap içeriği ve kaynakça → window.GX_BOOK
app/src/illustrations.js   SVG görseller → window.GX_ART
app/src/storage.js         Veri katmanı, şema 2, geçiş ve yedek → window.GX_STORE (Node'da require edilebilir)
app/src/app.js             Yönlendirme ve ekranlar
app/build.mjs              → app/dist/index.html ve app/dist/artifact.html
tests/storage.test.mjs     Birim testleri
tests/e2e.mjs              Chromium uçtan uca testleri (17 senaryo)
tests/boot.mjs             Açılış testleri (13): HTTPS, yerel dosya, JavaScript kapalı, başlangıç hataları, eksik API'ler
tests/fixtures/            Önceki sürüm (v1) uygulaması, localStorage içeriği ve yedeği: geriye uyumluluk testleri için
docs/telefon-test-listesi.md  Açılış teşhisi + sahibin gerçek cihazda uygulayacağı test listesi
docs/barindirma.md         Web bağlantısında yayınlama adımları
```

Rotalar: `#hosgeldin` (boş adres de açılışa gider), `#oku`, `#oku-<bolumId>`, `#gunum` (eski `#planla` de çalışır), `#gun-YYYY-AA-GG`, `#gecmis`, `#aliskanlik`, `#aliskanlik-kur`.
Depolama anahtarları: `gx.ssc.days.v1` (günler; şema 2'de de aynı anahtar), `gx.ssc.habit.v1` (alışkanlık), `gx.ssc.settings.v1` (tercihler: motion, textSize, reading, lastPlace), `gx.ssc.meta` (şema sürümü), `gx.ssc.beforeRestore` (geri yüklemeden önceki kopya).

### Veri şeması ve geçiş (önemli)
- Şema 2. Geçiş, okuma sırasında `migrateDay` ile yapılır: eksik `time` alanı `{budget:"", custom:""}` olur. Eski `start.what` metni **silinmez**; Günüm ekranı gösterir ve kullanıcı "İlk küçük adımı kullan" ya da "Bu metni ilk küçük adım yap" seçeneklerinden birini seçebilir.
- Alışkanlık planı: hedef (`goal`) değiştiğinde ve eski planın kayıtları varsa `applyPlanEdit` eski planı arşivler ve yeni plan açar. Kayıtlar `planId` ile eski plana bağlı kalır.
- Yedek: sürüm 2 (günler + alışkanlık + görünüm tercihleri). Sürüm 1 yedekleri de kabul edilir ve alışkanlık verisine dokunmaz. `planRestore`, onaydan önce neyin ekleneceğini, değişeceğini ya da aynı kalacağını hesaplar; `applyRestore` önce bir kopya alır. Hatalı yedekte hiçbir şey yazılmaz.
- Yazma başarısız olursa "Kaydedildi" gösterilmez. İçerik ekranda kalır, bellekte tutulur ve yedek metnine dahil edilir.

## Komutlar

```bash
npm run build                          # dist/ dosyalarını üret (src değişince her seferinde)
node --test tests/storage.test.mjs     # birim testleri
node tests/e2e.mjs                     # tarayıcı testleri (önce build)
node tests/boot.mjs                    # açılış testleri (önce build; openssl gerekir)
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
- [x] Birim testleri 8/8, Chromium uçtan uca testleri 13/13 (sürüm 1)
- [x] Sürüm 2 (2026-10-03): üç sekme (Oku / Günüm / Alışkanlığım), kapaklı açılış ekranı ve devam seçeneği, okuma parçaları, ilerleme, yazı boyutu, açılır araştırma ayrıntıları, sadeleştirilmiş Günüm ekranı, zaman seçimi, alışkanlık bölümü, şema 2 ve geriye uyumluluk. Birim testleri 16/16, Chromium uçtan uca testleri 17/17.

### Kelime sayıları (kaynakça hariç)
- Başlarken: 133 · Bölüm 1: 806 · Toplam: yaklaşık 940 (hedef 2.500–3.500)

- [x] Sürüm 2.1 (2026-10-03): telefonda boş ekran bildirimi üzerine açılış güvenliği. JavaScript'siz başlangıç ekranı + noscript, başlangıç hata ve zaman aşımı ekranı, font yüklemesi engellemez, Intl/showModal/localStorage yedekleri. Açılış testleri 13/13, birim 16/16, uçtan uca 17/17. Gerçek cihazda henüz doğrulanmadı.

### Sıradaki Adımlar (sahibin prototip değerlendirmesinden SONRA)
- [ ] Sahibin açılış teşhisi sonucunu al (`docs/telefon-test-listesi.md` üstteki tablo): önizleme mi, tarayıcı mı, hata ayrıntısı ne?
- [ ] Barındırma seçimi (`docs/barindirma.md`) ve gerçek HTTPS adresinde telefon testi
- [ ] Sahibin sürüm 2 telefon/tablet kontrol sonuçlarını al (`docs/telefon-test-listesi.md`, 10 adım) ve geri bildirimlere göre düzelt
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
- 2026-10-03: Sürüm 2. Geçmiş günler, Günüm'ün ikincil ekranı oldu. Açılış ekranı her açılışta gösterilir. Özet cümleler yalnızca yer bulunma ekiyle (-de/-da) bittiğinde kurulur, aksi hâlde etiketli özet gösterilir. Cümle ortasındaki alanların ilk harfi Türkçe kurallarıyla küçültülür.
- 2026-10-03: Telefonda boş ekran bildirimi. Kanıtlar: (1) JavaScript çalışmazsa eski HTML'de bütün metinler boş kalıyordu; (2) Google Fonts isteği yanıtsız kalırsa sayfa en az 8 sn başlamıyordu (Chromium ölçümü). Cihazdaki asıl neden henüz doğrulanmadı.
