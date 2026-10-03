# Web bağlantısında yayınlama (barındırma)

Uygulama tek bir HTML dosyası: `app/dist/index.html`. Sunucu tarafı kod, veritabanı ya da hesap gerektirmez. Bu dosyayı **HTTPS** veren herhangi bir statik barındırma hizmetine koymak yeterli.

Telefonda indirilen HTML dosyasını açmak web bağlantısıyla aynı şey değildir. Dosya önizleme uygulamaları (iPhone Dosyalar/Quick Look, bazı Android dosya yöneticileri, mesajlaşma uygulamalarının önizlemeleri) çoğu zaman JavaScript çalıştırmaz. Uygulama ekranları JavaScript ile oluşturulduğu için bu görünümlerde ürün çalışmaz. Sürüm 2.1'den itibaren boş ekran yerine bir uyarı gösterilir.

## Seçenek 1: Netlify Drop (en hızlı, hesap gerekmeden deneme)

1. Bilgisayarda boş bir klasör oluştur ve içine `index.html` adıyla yalnızca `app/dist/index.html` dosyasını koy.
2. https://app.netlify.com/drop adresini aç ve klasörü sayfaya sürükle.
3. Birkaç saniye içinde `https://…netlify.app` biçiminde bir adres verilir.
4. Hesap açmadan yüklenen siteler bir süre sonra silinebilir. Kalıcı olması için ücretsiz bir Netlify hesabıyla siteyi sahiplen. Güncelleme için aynı sitenin "Deploys" bölümüne yeni klasörü sürükle; adres değişmez.

## Seçenek 2: GitHub Pages (repo üzerinden)

1. GitHub'da depo ayarları: **Settings › Pages**.
2. Ücretsiz planda Pages yalnızca **herkese açık** depolarda çalışır. Depo herkese açık olursa kitap metni ve kaynak kod da herkese açık olur; satıştan önce bunu değerlendir. Özel depo için GitHub Pro ya da üstü gerekir.
3. "Source" olarak **GitHub Actions** seçilir ve `app/dist` klasörünü yayınlayan küçük bir iş akışı dosyası eklenir. İstersen bu dosyayı hazırlarım.
4. Adres şu biçimde olur: `https://emirhansahin5970-pixel.github.io/etsy-magaza/`

## Seçenek 3: Cloudflare Pages

Ücretsiz hesapla **Workers & Pages › Create › Pages › Upload assets** yoluyla aynı klasör yüklenir. Adres `https://…pages.dev` biçimindedir.

## Yayından önce bilinmesi gerekenler

- **Kayıtlar adrese bağlıdır.** Tarayıcı kayıtları her web adresi için ayrı tutar. claude.ai bağlantısında, indirilen dosyada ve yeni adreste yazılanlar birbirine geçmez. Taşımak için eski yerde Ayarlar › Yedek al, yeni adreste Ayarlar › Yedekten geri yükle.
- **Adresi sabit tut.** Adres (alan adı) değişirse kullanıcıların kayıtları eski adreste kalır. Bir kez seçilen adresi koru; güncellemeleri aynı adrese yükle.
- **Herkese açık bağlantı.** Bu barındırma seçeneklerinin hiçbiri ödeme ya da giriş koruması sağlamaz. Bağlantıyı bilen herkes açabilir. Satış öncesinde müşteri erişim yöntemi ayrıca kararlaştırılmalı.
- **Çevrimdışı kullanım yok.** Uygulama ilk açılışta ve her yenilemede internet gerektirir. Çevrimdışı destek eklenmedi; böyle tanıtılmamalı.
- **Yazı tipleri.** Google Fonts'a ulaşılamazsa sayfa sistem fontlarıyla açılır; işlevler etkilenmez.

## Yayından sonra kısa kontrol

1. Adresi iPhone'da **Safari**, Android'de **Chrome** ile aç. Mesajlaşma uygulamasının içindeki önizlemede değil, gerçek tarayıcıda açılmalı.
2. Açılış ekranı ve iki düğme görünmeli; "Bugünümü planla" ile bir kayıt yazıp sayfayı yenile. Kayıt yerinde durmalı.
3. Bir sorun görürsen "Teknik ayrıntılar"daki metni kopyalayıp gönder.
