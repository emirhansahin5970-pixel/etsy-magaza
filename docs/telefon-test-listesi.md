# Açılış sorunu teşhisi (sürüm 2.1)

Bu ortamda gerçek telefon veya tablet testi yapılmadı. Aşağıdaki adımlar boş ekran sorununun nereden kaynaklandığını ayırmak içindir. Gördüğün sonucu bana yaz.

| # | Nasıl açıyorsun? | Görürsen | Anlamı |
|---|---|---|---|
| 1 | İndirilen HTML dosyasına Dosyalar / dosya yöneticisi / mesaj önizlemesinden dokun | Ürün adı, açıklama ve turuncu kutuda "Bu görünüm uygulamanın kodunu çalıştıramıyor…" | Önizleme JavaScript çalıştırmıyor. Beklenen durum; ürün bu yolla kullanılamaz. |
| 2 | Aynı dosyayı tarayıcıda aç (iPhone: Paylaş › Safari'de aç ya da Chrome'da "Dosyalar"dan aç) | Uygulama açılır | Kod çalışıyor; sorun önizlemedeydi. Asıl kullanım için yine web bağlantısı öner. |
| 3 | Web bağlantısını Safari / Chrome'da aç | Uygulama açılır | Web kullanımı sorunsuz. |
| 4 | 2. veya 3. yolda | "Uygulama başlatılamadı" ya da "beklenenden uzun sürede açılıyor" | Kod çalıştı ama başlarken sorun oldu. "Teknik ayrıntılar"ı aç, "Ayrıntıları kopyala"ya dokun ve metni bana gönder. |
| 5 | Herhangi bir yolda | Tamamen boş ekran | Beklenmeyen durum: cihaz modeli, iOS/Android sürümü, uygulama (Safari, Chrome, Dosyalar, WhatsApp…) ve ekran görüntüsünü gönder. |

# Beş dakikalık telefon ve tablet kontrolü (sürüm 2)

Bu ortamdaki testler bilgisayarda Chromium ile, ekran boyutu taklit edilerek yapıldı. Gerçek iPhone, Android ya da iPad üzerinde test yapılmadı. Aşağıdaki kontrolleri kendi cihazlarında **tarayıcıdan** yap (Safari / Chrome). HTML dosyasını telefonun dosya önizlemesinde açmak bu testin yerini tutmaz.

Bağlantı: https://claude.ai/artifact/AQwSnF55f1uGJsMyNjYy4Z

| # | Ne yapacaksın | Beklenen sonuç |
|---|---|---|
| 1 | Bağlantıyı aç. | Kitap kapağı, "Kısa bir okuma, daha net bir günlük plan ve küçük bir alışkanlık denemesi." cümlesi, "Okumaya başla" ve "Bugünümü planla" düğmeleri görünür. Ekran yana kaymaz. Önceki sürümde kayıt girdiysen "Kaldığın yerden devam et" de görünür. |
| 2 | Önceki sürümde bir gün kaydettiysen **Günüm › Geçmiş günler**'e gir. | Eski günlerin listede görünür. Bir güne dokununca ayrıntılar açılır. Hiçbir kayıt kaybolmamıştır. |
| 3 | **Günüm**'de ana işi ve ilk küçük adımı yaz. "Başlama zamanımı belirle"yi aç, zaman ve yer yaz (ör. "kütüphanede"), "15 dakika"yı seç. | Ekranda yalnızca ana iş ve ilk adım açık görünür, diğer bölümler kapalıdır. Başlama planı cümlesi ilk adımı kendiliğinden kullanır. Seçimin altında kısa bir ipucu çıkar. "Kaydedildi" yazısı görünür. |
| 4 | Yer alanına dokununca klavye açılır. Sayfayı yenile. | Yazdığın alan klavyenin altında kalmaz. Yenilemeden sonra her şey yerindedir. |
| 5 | **Alışkanlığım** › "Planımı kur". İlk adımı boş bırakıp "Devam"a dokun, sonra adımları doldur. "Örneği kullan"ı bir kez dene. | Boş geçerken anlaşılır bir uyarı çıkar. Örnek yalnızca düğmeye dokununca dolar ve düzenlenebilir. Sonunda okunabilir bir özet görünür. |
| 6 | "Küçük adımımı yaptım."ı seç, not yaz. Sonra "Daha küçük seçeneğimi yaptım." ile değiştir. Son yedi günden dünkü güne dokunup "Bugün yapmadım." seç. | Seçim değişir. Yedi günlük görünümde günler nötr işaretlerle görünür; kırmızı işaret, puan ya da seri sayacı yoktur. |
| 7 | **Oku** › Bölüm 1. Biraz kaydır, "Yazı boyutu"ndan "Daha büyük"ü seç. | Üstte bölüm adı ve yaklaşık yüzde ilerler. Yazı büyür ve sayfa yana kaymaz. Başka bir sekmeye gidip dönünce kaldığın yer ve yazı boyutu korunur. |
| 8 | Telefonu yatay çevir, sonra geri çevir. | Üç sekme ve düğmeler kullanılabilir kalır. Okuma çubuğu metni kapatmaz. |
| 9 | **Ayarlar** › "Yedeği metin olarak göster" › "Metni kopyala". Notlar uygulamasına yapıştır. Sonra "Dosya yerine metin yapıştır" ile aynı metni yapıştırıp "Metni kontrol et"e dokun. | Geri yüklemeden önce neyin değişeceğini gösteren bir özet çıkar ("… gün bu cihazdakiyle aynı" gibi). "Vazgeç" dersen hiçbir şey değişmez. |
| 10 | Aynı alana "deneme" yazıp kontrol et. Ardından Ayarlar'da Animasyonlar › "Kapalı" seç ve 3. adımı tekrarla. | Önce "Bu yedek geri yüklenemedi" ve "Mevcut kayıtlarında hiçbir değişiklik yapılmadı." mesajları çıkar. Animasyonlar kapalıyken her şey aynı şekilde çalışır. |

**Not:** claude.ai bağlantısında "Yedek dosyasını indir" düğmesi engellenebilir; bu bilinen bir kısıtlama. Metinle yedek alma yolu her yerde çalışır. Tablette telefonun kayıtları görünmez, çünkü otomatik eşitleme yoktur. Bu beklenen bir durum.
