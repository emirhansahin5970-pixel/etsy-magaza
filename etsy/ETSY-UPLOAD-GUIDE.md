# Etsy'ye yükleme rehberi (sahip için)

Bu klasörde satış için gereken her şey var. Dosyalar `etsy/out/` içinde üretilir (`cd etsy && npm install && node build.mjs`; önce kökte `npm run build`).

| Dosya | Ne işe yarar |
|---|---|
| `out/upload/01_START-HERE_Small-Steps-Clear-Days.pdf` | Alıcının ilk açacağı PDF: uygulama bağlantısı, QR kod, iPhone/Android/bilgisayar kurulumu, veri ve yedek bilgisi, lisans şartları, 6 dilde kısa başlangıç |
| `out/upload/02_Book_EN_Small-Steps-Clear-Days.pdf` | Kitabın İngilizce PDF'i (22 sayfa, A5) |
| `out/upload/03_Book_other-languages.zip` | Kitabın TR, DE, FR, ES, IT, NL PDF'leri |
| `out/images/01…08.png` | İlan fotoğrafları (2700 × 2025 px), bu sırayla yükle |
| `listing.md` | İngilizce başlık, açıklama, 13 etiket ve diğer alanlar |
| `listing-translations.md` | Başlık/açıklama/etiketlerin DE, FR, ES, IT, NL çevirileri |

## İlanı açmadan ÖNCE (sırayla)

1. **Yayın adresine karar ver.** Şu an uygulama `https://emirhansahin5970-pixel.github.io/etsy-magaza/` adresinde ve depo **herkese açık**: kitabın tamamı ve kodu GitHub'da herkes tarafından okunabilir. Önerim: depoyu gizli yapmak ve yayını Cloudflare Pages'e (ücretsiz) taşımak, tahmin edilemez bir adresle. Adres değişirse PDF'lerdeki bağlantı ve QR kod tek komutla yeniden üretilir: `APP_URL="https://yeni-adres/" node build.mjs`. İstersen bu adımı birlikte ekran ekran yaparız.
2. **Son sürümü yayına al** (main'e birleştirme). Bunu sen onay verince ben yaparım; GitHub Pages birkaç dakika içinde güncellenir.
3. **Kendi telefonunda dene:** START HERE PDF'indeki bağlantıyı Safari'de aç → Paylaş → Ana Ekrana Ekle → uygulamayı aç → üstteki EN düğmesiyle dil değiştir → bir gün planı yaz → kapatıp yeniden aç, yazdığın duruyor mu?
4. **Çevirileri kontrol ettir.** Uygulama, kitap ve ilan çevirileri yapay zekâ yardımıyla yapıldı; anadili konuşan biri okumadı. En azından İngilizceyi (asıl pazar) bir kez okut.
5. **Etsy kurallarını kontrol et:** Etsy, yapay zekâ araçlarıyla hazırlanan ürünlerin açıklamada belirtilmesini isteyebiliyor (Etsy "Creativity Standards"). Güncel kuralı Etsy yardım sayfasından kontrol et; gerekiyorsa açıklamaya şu satırı ekle: `Text and illustrations created by Genix Studio with the help of AI tools.`
6. Kitaptaki DOI bağlantılarını (kaynaklar) tarayıcıda bir kez aç; bu geliştirme ortamından açılamadılar.

## Etsy'de ilan açma

1. Etsy → **Shop Manager → Listings → Add a listing**.
2. **Photos:** `out/images/01-hero.png` … `08-how-it-works.png` sırayla. İlk görsel kapak olur.
3. **Title / Description / Tags:** `listing.md` dosyasındaki kutuları olduğu gibi kopyala.
4. **About this listing:** Who made it → *I did* · What is it → *A finished product* · When was it made → *Made recently* (2020–2026).
5. **Category:** arama kutusuna "planner" yaz ve dijital planlayıcı kategorisini seç (örn. *Paper & Party Supplies › Paper › Calendars & Planners*). Etsy'nin önerdiği kategori de olabilir.
6. **Type:** *Digital files* seç ve şu 3 dosyayı yükle: `01_START-HERE…pdf`, `02_Book_EN…pdf`, `03_Book_other-languages.zip` (`out/upload/` klasöründe).
7. **Price:** benzer ilanlara bakarak sen belirle (dijital planlayıcı + e-kitap paketleri genelde birkaç dolar ile 20 dolar arasında; ben pazar araştırması yapmadım). **Quantity:** 999.
8. **Çeviriler:** İlan ayarlarında dil eklenebiliyorsa (Settings → Languages), `listing-translations.md` dosyasındaki metinleri ilgili dillere yapıştır.
9. **Publish.**

## Satıştan sonra

Hiçbir şey yapman gerekmez: Etsy, ödeme sonrası dosyaları alıcıya otomatik verir. Alıcı START HERE PDF'indeki bağlantıyı açar.

## Güncelleme

Uygulamadaki her değişiklik main'e alındığında aynı bağlantıda yayınlanır; alıcıların kayıtları (aynı adres kaldıkça) korunur. Kitap PDF'i değişirse `node build.mjs` ile yeniden üretip Etsy'de dosyaları değiştir.

## Bilinen sınırlar (dürüst liste)

- Gerçek iPhone/Android cihazda test edilmedi; testler bilgisayarda Chromium ile yapıldı.
- İnternetsiz açılış Chromium'da çalıştı, iPhone'da doğrulanmadı. Bu yüzden ilanda "offline" vaadi yok.
- Bağlantı paylaşılırsa başkaları da kullanabilir (kişiye özel kod yok — senin kararın). Yayılırsa adres yolunu değiştirip PDF'i güncelleriz.
