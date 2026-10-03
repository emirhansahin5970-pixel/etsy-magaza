# Telefon ve tablet test listesi

Bu testleri kendi telefonunda ve tabletinde yap. Bu ortamda yapılan testler yalnızca bilgisayardaki Chromium tarayıcısında, ekran boyutu taklit edilerek yapıldı. Gerçek iPhone, Android ya da iPad üzerinde henüz test yapılmadı.

Bağlantı: https://claude.ai/artifact/AQwSnF55f1uGJsMyNjYy4Z (claude.ai hesabınla giriş yapman gerekir).

| # | Ne yapacaksın | Beklenen sonuç |
|---|---|---|
| 1 | Bağlantıyı ilk kez aç. | Karşılama ekranı, görsel, "Okumaya başla" ve "Doğrudan bugünü planla" düğmeleri görünür. Ekran yana kaymaz. |
| 2 | "Okumaya başla"ya dokun. Sonra "Kitabı Oku" sekmesinden 1. bölümü aç ve sonuna kadar kaydır. | Metin rahat okunur, görsel ve renkli kutular (Araştırma ne diyor?, Önerim) görünür. Türkçe karakterler (ç, ğ, ı, İ, ö, ş, ü) düzgündür. |
| 3 | Bölümün ortasına kadar oku, "Günümü Planla"ya geç, sonra "Kitabı Oku"ya dön. | İçindekilerde "Kaldığın yerden devam et" görünür. Dokununca bıraktığın yere yakın bir yere döner. |
| 4 | Bölüm 1'deki "3 dakikalık sayacı başlat" düğmesine dokun. | Çubuk dolmaya başlar, kalan süre yazar. "Sayacı durdur" ile durur. |
| 5 | "Bunu planlayıcıda yap"a dokun. | Planlayıcı açılır, "Aklımdakiler" alanı turuncu çerçeveyle vurgulanır ve klavye açılır. Yazdığın satır klavyenin altında kalmaz. |
| 6 | Birkaç satır yaz, sonra "Kitapta kaldığın yere dön"e dokun. | Bölüm 1'deki uygulama kutusuna geri dönersin. |
| 7 | Planlayıcıda ana iş, ilk adım, bir ek iş ve başlama planının üç alanını doldur. | Başlama planının altında "…, …, … başlayacağım." cümlesi oluşur. Altta kısa bir "Kaydedildi" yazısı görünür. |
| 8 | Ana işin yanındaki kutuya dokun. | Kutu turuncu olur ve tik işareti çıkar. Metnin üstü çizilir. Kısa bir "İşaretlendi" bildirimi çıkar. |
| 9 | Sayfayı yenile ya da tarayıcıyı tamamen kapatıp yeniden aç. | Yazdığın her şey ve işaretlerin yerinde durur. |
| 10 | Telefonu yatay çevir, sonra tekrar dikey çevir. | Hiçbir ekranda yatay kaydırma olmaz. Sekmeler ve düğmeler kullanılabilir kalır. |
| 11 | Telefonun yazı boyutunu en büyüğe yakın bir değere getir (iPhone: Ayarlar › Ekran ve Parlaklık › Metin Boyutu; Android: Ayarlar › Ekran › Yazı tipi boyutu) ve uygulamayı yeniden aç. | Yazılar büyür. Metin kesilmez ve ekran yana kaymaz. Uzun kelimeler gerekirse alt satıra bölünür. |
| 12 | Ertesi gün uygulamayı aç ve "Günümü Planla"ya gir. | Yeni ve boş bir gün açılır. "Geçmiş Günler"de dünkü kayıt ayrı olarak görünür. |
| 13 | "Geçmiş Günler"de dünkü güne "Aç ve düzenle" ile gir, bir şeyi değiştir. | Üstte "Bu gün geçmişte kaldı" uyarısı görünür. Değişiklik dünkü güne kaydedilir. Bugünün kaydı değişmez. |
| 14 | "Geçmiş Günler"de bir günü "Sil". | Önce onay penceresi çıkar. "Vazgeç" derse hiçbir şey silinmez. "Evet, sil" derse yalnızca o gün silinir. |
| 15 | Sağ üstteki ayarlar düğmesinden "Yedek dosyasını indir"e dokun. | **Not:** claude.ai bağlantısında indirme engellenebilir. Bu durumda dosya inmez. Bu bilinen bir kısıtlama. |
| 16 | Aynı yerde "Yedeği metin olarak göster" ve "Metni kopyala"ya dokun. Metni bir nota yapıştır. | "Kopyalandı" yazar. Notta `"app": "genix-small-steps-clear-days"` ile başlayan bir metin görünür. |
| 17 | "Dosya yerine metin yapıştır"a dokun, notundaki metni yapıştır, "Metni kontrol et" ve sonra "Geri yükle"ye dokun. | "Yedek kontrol edildi" özeti ve ardından "… gün geri yüklendi." mesajı çıkar. |
| 18 | Aynı alana rastgele bir metin (ör. "deneme") yapıştırıp kontrol et. | "Bu yedek geri yüklenemedi" ve "Mevcut kayıtlarında hiçbir değişiklik yapılmadı." mesajları çıkar. Kayıtların aynen durur. |
| 19 | Ayarlar'da Animasyonlar › "Kapalı" seç, sonra 7–9. adımları tekrarla. | Geçişler ve tik animasyonu olmadan her şey aynı şekilde çalışır. |
| 20 | Telefonun "Hareketi azalt" ayarını aç (iPhone: Erişilebilirlik › Hareket; Android: Erişilebilirlik › Animasyonları kaldır), Ayarlar'da "Cihaz ayarına uy"u seç. | Ayarlar'da "Cihazın azaltılmış hareket tercihi açık…" notu görünür. Animasyonlar kapalıdır. |
| 21 | Aynı bağlantıyı tablette aç. | Telefondaki kayıtlar tablette **görünmez**. Bu beklenen bir durum, çünkü kayıtlar cihazlar arasında eşitlenmez. Tablette 1–14 arasını tekrar dene. |

Bir test beklenen sonucu vermezse cihazı, tarayıcıyı ve adım numarasını not et. Mümkünse bir ekran görüntüsü de al.
