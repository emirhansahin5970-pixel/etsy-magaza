# Web bağlantısında yayınlama (barındırma)

## iPhone / iPad'de uygulama gibi kullanmak

1. Adresi **Safari**'de aç.
2. Paylaş düğmesi › **Ana Ekrana Ekle**.
3. Ana ekrandaki "Küçük Adımlar" simgesinden aç. Tarayıcı çubukları olmadan, tam ekran açılır.

İlk açılışta internet gerekir. Sonraki açılışlarda internet yoksa da sayfanın önbellekten açılması için gereken kod var; bu davranış bilgisayarda Chromium ile test edildi, iPhone'da henüz doğrulanmadı.

Android'de: Chrome › ⋮ menüsü › **Ana ekrana ekle** / **Uygulamayı yükle**.

Yayınlanacak klasör: `app/dist/` (index.html, manifest.webmanifest, sw.js, icons/). Sunucu tarafı kod, veritabanı ya da hesap gerektirmez. Bu klasörü **HTTPS** veren herhangi bir statik barındırma hizmetine koymak yeterli.

Telefonda indirilen HTML dosyasını açmak web bağlantısıyla aynı şey değildir. Dosya önizleme uygulamaları (iPhone Dosyalar/Quick Look, bazı Android dosya yöneticileri, mesajlaşma uygulamalarının önizlemeleri) çoğu zaman JavaScript çalıştırmaz. Uygulama ekranları JavaScript ile oluşturulduğu için bu görünümlerde ürün çalışmaz. Sürüm 2.1'den itibaren boş ekran yerine bir uyarı gösterilir.

## Seçenek 1: Netlify Drop (en hızlı, hesap gerekmeden deneme)

1. https://app.netlify.com/drop adresini aç ve `app/dist` klasörünü sayfaya sürükle.
2. Birkaç saniye içinde `https://…netlify.app` biçiminde bir adres verilir.
3. Hesap açmadan yüklenen siteler bir süre sonra silinebilir. Kalıcı olması için ücretsiz bir Netlify hesabıyla siteyi sahiplen. Güncelleme için aynı sitenin "Deploys" bölümüne yeni klasörü sürükle; adres değişmez.

## Seçenek 2: GitHub Pages (kuruldu)

Depo herkese açık olduğu için ücretsiz. Yayın iş akışı hazır: `.github/workflows/pages.yml`. `main` dalına her gönderimde uygulamayı derler, veri testlerini çalıştırır ve yayınlar.

**Bir kez yapılacak ayar:** GitHub'da depo › **Settings › Pages › Build and deployment › Source** alanında **GitHub Actions** seçilir.

Adres: **https://emirhansahin5970-pixel.github.io/etsy-magaza/**

Not: Depo herkese açık olduğu için kitap metni ve kod da herkese açıktır. Satış öncesinde bu ayrıca değerlendirilmeli.

## Seçenek 3: Cloudflare Pages

Ücretsiz hesapla **Workers & Pages › Create › Pages › Upload assets** yoluyla aynı klasör yüklenir. Adres `https://…pages.dev` biçimindedir.

## Yayından önce bilinmesi gerekenler

- **Kayıtlar adrese bağlıdır.** Tarayıcı kayıtları her web adresi için ayrı tutar. claude.ai bağlantısında, indirilen dosyada ve yeni adreste yazılanlar birbirine geçmez. Taşımak için eski yerde Ayarlar › Yedek al, yeni adreste Ayarlar › Yedekten geri yükle.
- **Adresi sabit tut.** Adres (alan adı) değişirse kullanıcıların kayıtları eski adreste kalır. Bir kez seçilen adresi koru; güncellemeleri aynı adrese yükle.
- **Herkese açık bağlantı.** Bu barındırma seçeneklerinin hiçbiri ödeme ya da giriş koruması sağlamaz. Bağlantıyı bilen herkes açabilir. Satış öncesinde müşteri erişim yöntemi ayrıca kararlaştırılmalı.
- **Çevrimdışı kullanım doğrulanmadı.** İlk açılış internet ister. Sonraki açılışlarda önbellekten açılma Chromium'da test edildi; iPhone'da doğrulanana kadar müşteriye çevrimdışı çalışır diye tanıtılmamalı.
- **Yazı tipleri.** Google Fonts'a ulaşılamazsa sayfa sistem fontlarıyla açılır; işlevler etkilenmez.

## Yayından sonra kısa kontrol

1. Adresi iPhone'da **Safari**, Android'de **Chrome** ile aç. Mesajlaşma uygulamasının içindeki önizlemede değil, gerçek tarayıcıda açılmalı.
2. Açılış ekranı ve iki düğme görünmeli; "Bugünümü planla" ile bir kayıt yazıp sayfayı yenile. Kayıt yerinde durmalı.
3. Bir sorun görürsen "Teknik ayrıntılar"daki metni kopyalayıp gönder.
