/*
 * Kitap içeriği (Türkçe): "Küçük Adımlar, Daha Net Günler"
 * Arayüz metinleri burada değil: i18n/tr.js
 * Çeviriler: book.<dil>.js — aynı bölüm ve blok kimlikleri (okuma konumu dil değişince korunur); kaynakça yalnızca burada.
 *
 * Blok türleri:
 *   h        – ara başlık (her ara başlık yeni bir kısa okuma parçası başlatır)
 *   p        – paragraf
 *   scene    – gündelik sahne (paragraflar dizisi)
 *   figure   – görsel (illustrations.js içindeki anahtar + açıklama)
 *   research – araştırma: kısa bulgu (finding), sınırlılık (limits), açılabilir ayrıntı (details), refs: kaynak kimlikleri
 *   suggestion – yazarın kendi önerisi (araştırma bulgusundan ayrı tutulur)
 *   exercise – küçük uygulama (planner: planlayıcıdaki hedef alan)
 *   summary  – tek cümlelik bölüm özeti
 * Her bloğun benzersiz bir id'si var; okuma konumu bu id ile hatırlanır.
 */
window.GX_BOOKS = window.GX_BOOKS || {};
window.GX_BOOKS.tr = {
  lang: "tr",
  title: "Küçük Adımlar, Daha Net Günler",
  subtitle: "Kısa bir okuma ve sakin bir günlük planlayıcı",

  chapters: [
    {
      id: "baslarken",
      kind: "intro",
      title: "Başlarken",
      minutes: 2,
      available: true,
      blocks: [
        { id: "g1", type: "p", text: "Bu kısa kitap, günü kurtarmaya çalışan biri için yazıldı. Dersleri, işi, evi ve telefondaki bitmeyen bildirimleri aynı anda taşıyan; akşam olunca “Bugün ne yaptım ki?” diye soran biri için." },
        { id: "g2", type: "p", text: "Burada büyük bir sistem bulmayacaksın. Renk kodlu ajandalar, yirmi adımlı sabah rutinleri ya da her şeyi bir gecede değiştirme sözü yok. Üç küçük fikir var: Aklındakileri bir yere bırakmak, bugün için tek bir ana iş seçmek ve gün değişince planı da değiştirebilmek." },
        { id: "g3", type: "p", text: "Her bölüm, bir otobüs yolculuğunda okunabilecek kadar kısa. Her bölümün sonunda birkaç dakikalık bir uygulama var. İstersen uygulamayı kâğıda yaparsın, istersen bu uygulamadaki planlayıcıya." },
        { id: "g4", type: "p", text: "Yer yer araştırmalardan söz edeceğim. Bunları “bilim kanıtladı” diye değil, “bazı insanlarla, belirli koşullarda şu görüldü” diye okumanı isterim. Araştırmanın söylediğiyle benim önerimi ayrı kutularda göreceksin. Hangisinin hangisi olduğunu bilmek, kendi hayatına neyi alacağına karar vermeni kolaylaştırır." },
      ],
    },

    {
      id: "bolum-1",
      kind: "chapter",
      number: 1,
      title: "Her Şeyi Aklında Tutmak Zorunda Değilsin",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b1-sahne",
          type: "scene",
          paragraphs: [
            "Sabah 08.10. Deniz metroda, kapının yanında ayakta. Bir eliyle tutamağa tutunuyor, diğer eliyle telefonda e-postalara bakıyor.",
            "Aklından geçenler sırayla gelmiyor. Cuma teslim edilecek ödev. Ev sahibine kirayla ilgili yazılacak mesaj. Kargoya verilmesi gereken iade paketi. Annesinin haftaya doğum günü. Staj başvurusundaki yarım kalmış form. Bir de dün akşam bir arkadaşına “Yarın ararım” demişti. Ne zaman arayacaktı?",
            "Metro durağa yaklaşırken içinde tanıdık bir his beliriyor: Bir şeyi unutuyorum ama ne? Daha gün başlamadan yorgun.",
          ],
        },

        { id: "b1-h1", type: "h", text: "Akıl iyi bir hatırlatıcı, kötü bir depo" },
        { id: "b1-p1", type: "p", text: "Deniz'in sorunu tembellik ya da dağınıklık değil. Sorun, bütün işlerin aynı anda, aynı yerde, yani kafasının içinde durması." },
        { id: "b1-p2", type: "p", text: "Bitmemiş bir iş, bir yere not edilmediği sürece arada bir kendini hatırlatır. Ders dinlerken iade paketi aklına gelir, yemek yerken ödev. Bu hatırlatmalar bazen işe yarar. Ama sıralarını ve zamanlarını seçmezler. Önemli bir iş ile önemsiz bir iş aynı sesle seslenir." },
        { id: "b1-p3", type: "p", text: "Sonuçta elinde yirmi tane yarım düşünce olur ve hiçbirini tam olarak düşünemezsin. Gün boyu meşgul hissedip akşam hiçbir şey yapmamış gibi hissetmenin bir nedeni bu olabilir." },

        {
          id: "b1-arastirma-1",
          type: "research",
          finding: "Bir dizi deneyde, bitmemiş bir hedefi hatırlatılan katılımcıların aklı, ilgisiz bir okuma sırasında o hedefe daha sık kaydı. Aynı hedef için belirli bir plan yapmalarına izin verildiğinde bu etki ortadan kalktı.",
          limits: "Deneyler laboratuvarda, çoğunlukla üniversite öğrencileriyle yapıldı. Günlük hayatta herkeste aynı sonucu vermeyebilir.",
          details: "Araştırmacılara göre fark yaratan, işi yalnızca hatırlamak değil, onun için somut bir plan kurmaktı. Bu kitapta yazmak ilk adım; plan ikinci bölümün konusu.",
          refs: ["masicampo2011"],
        },

        { id: "b1-h2", type: "h", text: "Yazmanın pratik amacı" },
        { id: "b1-p4", type: "p", text: "Aklındakileri yazmak, o işleri yapacağına dair bir söz vermek değil. Daha çok, onları bir yere park etmek gibi. Araba otoparkta dururken onu düşünmeye devam etmen gerekmez; nerede olduğunu bilmen yeter." },
        { id: "b1-p5", type: "p", text: "Kâğıda dökülen liste üç somut iş görür. Birincisi, işleri karşılaştırmanı sağlar. Kafanda hepsi aynı büyüklükte görünür; yazınca bazılarının iki dakikalık, bazılarının iki haftalık olduğunu fark edersin. İkincisi, unutma kaygısını azaltır, çünkü artık hatırlama işini kâğıt yapar. Üçüncüsü, bir sonraki adımı, yani bugün neyi seçeceğine karar vermeyi kolaylaştırır." },

        {
          id: "b1-gorsel",
          type: "figure",
          art: "thoughtsToPaper",
          alt: "Solda birbirine dolanmış, farklı boyutlarda kısa çizgiler ve halkalar; ortadan bir ok, sağdaki düzenli satırlara sahip bir kâğıda uzanıyor. Kâğıtta birkaç satır ve bir satırın yanında küçük bir işaret var.",
          caption: "Kafanın içinde her şey birbirine dolanır. Kâğıtta aynı işler sıraya girer ve karşılaştırılabilir hâle gelir.",
        },

        {
          id: "b1-arastirma-2",
          type: "research",
          finding: "Bir uyku laboratuvarı çalışmasında, yatmadan önce beş dakika boyunca önümüzdeki günlerde yapacaklarını yazan genç yetişkinler, son günlerde tamamladıklarını yazanlara göre ortalamada daha çabuk uykuya daldı.",
          limits: "Tek bir gece, uyku sorunu olmayan 57 kişilik küçük bir grup. Yazmanın herkesin uykusuna iyi geleceğini göstermiyor.",
          details: "Yapılacaklarını daha ayrıntılı yazanlar da daha çabuk uyudu. Bu bulgu, listeyi akıldan kâğıda taşımanın rahatlatıcı olabileceğine dair bir ipucu olarak okunmalı; kesin bir sonuç olarak değil.",
          refs: ["scullin2018"],
        },

        { id: "b1-h3", type: "h", text: "Bütün hayatını düzenlemen gerekmiyor" },
        { id: "b1-p6", type: "p", text: "Bu noktada akla gelen ilk fikir genellikle büyük bir temizlik olur: Yeni bir uygulama indirmek, her şeyi kategorilere ayırmak, renkler, etiketler, öncelik seviyeleri. Bir hafta sonra sistem, bakımı gereken bir iş daha olur." },
        { id: "b1-p7", type: "p", text: "Buna gerek yok. Bu bölümde yapacağın tek şey, birkaç dakikalığına aklındakileri dışarı çıkarmak. Sınıflandırma, sıralama ya da plan yok. O kısma ikinci bölümde geleceğiz ve orada da tek bir iş seçeceğiz, yirmi değil." },

        {
          id: "b1-oneri",
          type: "suggestion",
          text: "Listeyi tek bir yerde tut. Bir gün telefonun not uygulamasına, ertesi gün bir kâğıda, öbür gün bir mesaj taslağına yazarsan, aklın bu sefer listelerin nerede olduğunu hatırlamaya çalışır. Hangi yer olduğu önemli değil; aynı yer olması önemli.",
        },

        { id: "b1-p8", type: "p", text: "Bir de şunu bilmek işine yarayabilir: Listen dağınık görünecek. “Annemi ara” ile “Mezuniyetten sonra ne yapacağımı düşün” alt alta duracak. Bu normal. Liste düzenli olmak için değil, kafandaki yükü görünür kılmak için var." },
        { id: "b1-h4", type: "h", text: "Liste uzayınca ne olur?" },
        { id: "b1-p10", type: "p", text: "İlk kez her şeyi yazan birçok kişi, ortaya çıkan listeye bakınca bir an geriler. On beş, yirmi satır. “Bu kadar işim mi var?” Aslında bu işler zaten oradaydı; sadece şimdi sayılabilir hâldeler." },
        { id: "b1-p11", type: "p", text: "Uzun bir liste, hepsini bugün yapman gerektiği anlamına gelmez. Bazı satırlar bir mesajlık iş, bazıları aylarca sürecek bir konu, bazıları da aslında bir iş değil, bir kaygı: “Staj bulabilecek miyim?” Bunları ayırmak için şimdilik bir şey yapmana gerek yok. Sadece hepsinin aynı türden olmadığını görmek bile yükü biraz hafifletebilir." },
        { id: "b1-p12", type: "p", text: "Yazarken aklına gelen ama yazmak istemediğin şeyler de olabilir. Her şeyi yazmak zorunda değilsin. Bu liste kimseye gösterilmeyecek; amacı seni sınamak değil, kafandaki yerden biraz yer açmak." },
        { id: "b1-p13", type: "p", text: "Bir de şunu fark edebilirsin: Bazı işler yazıldıktan hemen sonra küçülür. “Ev sahibine mesaj” kafanda büyük bir konuşma gibi dururken, kâğıtta iki cümlelik bir mesaja dönüşür. Bu her iş için olmaz, ama olduğunda iyi gelir." },
        { id: "b1-p9", type: "p", text: "Deniz o sabah metrodan indiğinde, telefonundaki notlara üç dakika boyunca aklına gelen her şeyi yazdı. On dört satır çıktı. Hiçbirini o an yapmadı. Ama arkadaşını öğle arasında arayacağını ve iade paketini akşam eve dönerken kargoya bırakacağını görünce, gerisi biraz daha sessizleşti." },

        {
          id: "b1-uygulama",
          type: "exercise",
          title: "Üç dakikalık boşaltma",
          planner: "brain",
          timerSeconds: 180,
          steps: [
            "Üç dakikalık bir sayaç kur. Aşağıdaki düğmeyi de kullanabilirsin.",
            "Aklına gelen her işi, sırasız ve kısa yaz. Büyük ya da küçük ayırt etme: “Kira mesajı”, “Ödev”, “Diş randevusu”.",
            "“Yapmalıyım” diye başlayan cümleler kurma; işin adını yazman yeter.",
            "Sayaç bitince dur. Liste eksik kalabilir; eksik kalanlar sonra da eklenebilir.",
            "Listeye şimdilik hiçbir şey yapmana gerek yok. Sadece orada durduğunu bil.",
          ],
        },

        {
          id: "b1-ozet",
          type: "summary",
          text: "Aklındaki işleri bir yere yazmak onları hemen yapmanı gerektirmez; yalnızca hepsini aynı anda taşımayı bırakmanı sağlar.",
        },
      ],
      sources: ["masicampo2011", "scullin2018"],
    },

    {
      id: "bolum-2",
      kind: "chapter",
      number: 2,
      title: "Bugünün Bir Ana İşi Olsun",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b2-sahne",
          type: "scene",
          paragraphs: [
            "Salı sabahı, saat 10.00. Deniz kütüphanede, pencerenin yanındaki masada. Önünde dünkü liste duruyor: on dört satır.",
            "Önce ödev dosyasını açıyor. Birkaç dakika sonra staj formunun son tarihini hatırlıyor ve formu açıyor. Formda istenen belgeyi ararken kargo iadesinin süresine bakmak geliyor aklına. Sonra yeniden ödeve dönüyor.",
            "Öğlene doğru ekranda yedi sekme açık. Hiçbiri bitmedi. Deniz bütün sabah çalıştığını biliyor, ama elinde gösterecek bir şey yok.",
          ],
        },

        { id: "b2-h1", type: "h", text: "Liste bir plan değil" },
        { id: "b2-p1", type: "p", text: "İlk bölümde aklındakileri bir yere yazdın. Bu, kafandaki yükü azaltır; ama sana bugün neyle başlayacağını söylemez. Liste bir envanterdir. On dört satıra aynı anda bakan biri, her birinin ötekinden daha acil olduğunu düşünmeye başlayabilir." },
        { id: "b2-p2", type: "p", text: "Deniz'in sabahı da böyle geçti. Her iş geçerliydi, her geçiş mantıklıydı. Ama işler arasında gidip gelirken her seferinde nerede kaldığını yeniden hatırlaması gerekti. Gün, yarım kalmış başlangıçlarla doldu." },
        { id: "b2-p3", type: "p", text: "Bu bölümde önerdiğim şey basit: Her gün için bir ana iş seç. Hayatındaki en önemli iş olması gerekmiyor. Ölçü şu: Akşam olduğunda bu iş bittiyse ya da ilerlediyse, rahatlayacak mısın? Cevap evetse, bugünün ana işi odur." },
        { id: "b2-p4", type: "p", text: "Diğer işler kaybolmaz; listede beklerler. Bir ana iş seçmek, ötekilerden vazgeçmek değil, bugün onlara ne zaman bakacağını sonraya bırakmaktır." },

        { id: "b2-h5", type: "h", text: "Seçmek zor geldiğinde" },
        { id: "b2-p12", type: "p", text: "Bazı sabahlar iki ya da üç iş aynı derecede acil görünür. Böyle günlerde seçimi kolaylaştırabilecek birkaç soru var. Hangisinin bir son tarihi daha yakın? Hangisi bitmezse başka işleri de bekletir? Hangisini düşündüğünde göğsünde daha fazla ağırlık hissediyorsun?" },
        { id: "b2-p13", type: "p", text: "Bu soruların her zaman net bir cevabı olmaz. O zaman yazı tura atmak bile, hiç seçmemekten daha iyi olabilir. Yanlış ana işi seçmek, gün boyu üç iş arasında gidip gelmekten çoğu zaman daha az yorar; çünkü en azından bir tanesi ilerler." },
        { id: "b2-p14", type: "p", text: "Bir de şu var: Ana iş her gün büyük bir iş olmak zorunda değil. Yorgun olduğun, sınavdan yeni çıktığın ya da hasta olduğun bir günde ana iş “Çamaşırları yıkamak” olabilir. Ana iş, günün kapasitesine göre seçilir; olmak istediğin kişinin kapasitesine göre değil." },

        { id: "b2-h2", type: "h", text: "Ana işi küçük bir adıma çevirmek" },
        { id: "b2-p5", type: "p", text: "“Ödevi yaz” iyi bir ana iş olabilir ama kötü bir başlangıçtır. Çok büyüktür; nereden tutacağını bilemezsin. Başlamayı kolaylaştıran, ana işin ilk küçük adımıdır: birkaç dakikada yapılabilecek kadar somut bir hareket." },
        { id: "b2-p6", type: "p", text: "Birkaç örnek: “Ödevi yaz” yerine “Ödev dosyasını açıp üç başlık yazmak”. “Staj başvurusu” yerine “Formdaki eksik belgeyi bulup klasöre koymak”. “Ev sahibiyle konuş” yerine “Kira mesajının ilk cümlesini yazmak”." },
        { id: "b2-p7", type: "p", text: "İlk adımın amacı işi bitirmek değil, işe girmek. Bazen ilk adım bittikten sonra devam edersin, bazen etmezsin. İkisi de olur. Ama boş bir sayfanın karşısında beklemekle, üç başlığı yazılmış bir sayfaya dönmek arasında fark var." },

        {
          id: "b2-gorsel",
          type: "figure",
          art: "smallSteps",
          alt: "Solda içinde birkaç satır bulunan büyük bir kutu; bir ok, sağa doğru yükselen dört küçük basamağa uzanıyor. İlk ve en alçak basamağın üstünde turuncu bir nokta var.",
          caption: "Büyük bir iş tek seferde atlanmaz. İlk basamak, bugün atılabilecek kadar alçak olmalı.",
        },

        { id: "b2-h3", type: "h", text: "Ne zaman ve nerede?" },
        { id: "b2-p8", type: "p", text: "İlk adımı seçtikten sonra bir soru daha kalıyor: Bunu ne zaman ve nerede yapacaksın? “Bugün bir ara” çoğu zaman günün sonuna kayar. “Öğle yemeğinden sonra, kütüphanenin üst katında” ise zihninde bir randevu gibi durur." },

        {
          id: "b2-arastirma-1",
          type: "research",
          finding: "Psikolog Peter Gollwitzer'ın “uygulama niyeti” adını verdiği planlar, bir hedefi ne zaman, nerede ve nasıl uygulayacağını önceden belirlemeyi içerir: “X durumu olduğunda Y'yi yapacağım.” 94 bağımsız testi bir araya getiren bir meta-analizde, böyle plan yapan katılımcıların hedeflerine ulaşma oranı, yalnızca hedef koyanlara göre ortalamada belirgin biçimde daha yüksekti.",
          limits: "Etkinin büyüklüğü çalışmalar arasında değişiyordu ve araştırmaların bir bölümü laboratuvarda ya da öğrencilerle yapıldı. Ortalama bir etki, planın herkes için ve her işte işe yarayacağını göstermez.",
          details: "Araştırmacılara göre bu tür planlar, “ne zaman başlasam?” kararını önceden verdiği için o an geldiğinde başlamayı kolaylaştırıyor. Bu kitapta Günüm'deki “Başlama zamanımı belirle” bölümü bu fikre dayanıyor.",
          refs: ["gollwitzer1999", "gollwitzer2006"],
        },

        {
          id: "b2-oneri",
          type: "suggestion",
          text: "Zamanı saat olarak değil, günün içinde zaten olan bir ana bağlamayı dene: “İlk dersten sonra”, “Kahvemi koyunca”, “Eve gelip çantamı bırakınca”. Saatler kayar; bu tür anlar ise çoğu gün yine gelir.",
        },

        { id: "b2-h4", type: "h", text: "Ek işler ve yarına kalanlar" },
        { id: "b2-p9", type: "p", text: "Ana işin yanında gün içinde yapılması gereken küçük işler de olacak. Günüm'de bunlar için yalnızca iki yer var. Bu bir kısıtlama gibi görünebilir; aslında bir ölçü. İki satırdan fazlası gerekiyorsa, bugün belki zaten dolu bir gündür ve bazı işlerin yarına kalması doğaldır." },
        { id: "b2-p10", type: "p", text: "Yarına kalan iş başarısızlık değil, bir karardır. Listede kalması, unutulmadığı anlamına gelir." },
        { id: "b2-p11", type: "p", text: "Deniz o gün öğle yemeğinden sonra sekmelerin hepsini kapattı. Ana işi ödevdi; ilk adımı, dosyayı açıp üç başlık yazmaktı. Üst kattaki boş masaya oturdu. Başlıklar on dakika sürdü. Ardından ilk başlığın altına birkaç paragraf daha yazdı. Staj formu ve kargo, ertesi günün ek işleri oldu." },

        {
          id: "b2-uygulama",
          type: "exercise",
          title: "Bugünün ana işi",
          planner: "main",
          steps: [
            "Listene bak ve şu soruyu sor: Akşam olduğunda hangisi ilerlemiş olsa rahatlarım?",
            "O işi bugünün ana işi olarak yaz.",
            "Altına, birkaç dakikada başlayabileceğin ilk küçük adımı yaz.",
            "İstersen ne zaman ve nerede başlayacağını da ekle: “Öğle yemeğinden sonra, masamda” gibi.",
            "Geri kalan işler listede bekleyebilir. Bugün için bu kadarı yeterli.",
          ],
        },

        {
          id: "b2-ozet",
          type: "summary",
          text: "Bugün için tek bir ana iş ve onun küçük bir ilk adımı, uzun bir listeye bakarak başlamaya çalışmaktan çoğu zaman daha kolaydır.",
        },
      ],
      sources: ["gollwitzer1999", "gollwitzer2006"],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Planını Hayatına Uydur",
      minutes: 7,
      available: true,
      blocks: [
        {
          id: "b3-sahne",
          type: "scene",
          paragraphs: [
            "Perşembe. Deniz'in planı belliydi: Öğle yemeğinden sonra kütüphanede ödevin ikinci bölümü.",
            "Ama grup toplantısı uzadı. Çıkışta yağmur başladı. Eve vardığında saat altıyı geçmişti; ıslak, yorgun ve biraz da sinirli.",
            "Aklından geçen cümle tanıdıktı: “Bugün zaten bozuldu. Yarın düzgün başlarım.”",
          ],
        },

        { id: "b3-h1", type: "h", text: "Plan bozulunca" },
        { id: "b3-p1", type: "p", text: "Sabah yapılan plan, günün nasıl geçeceğine dair bir tahmindir. Toplantılar uzar, otobüsler gecikir, enerji beklenenden erken biter. Planın tutmaması, plan yapan kişinin bir hatası değil; tahminlerin doğası bu." },
        { id: "b3-p2", type: "p", text: "Sorun çoğu zaman bozulan plan değil, ardından gelen “hep ya da hiç” düşüncesi. Plan aynen uygulanamıyorsa hiç uygulanmıyor gibi gelir. Oysa çoğu günde üç seçenek vardır." },
        { id: "b3-p3", type: "p", text: "Birincisi, zamanı kaydırmak: “Öğleden sonra olmadı, akşam yemeğinden sonra yarım saat.” İkincisi, adımı küçültmek: “İkinci bölümü yazamam ama notlarımı bir kez okuyabilirim.” Üçüncüsü, bilerek ertelemek: “Bugün yapmıyorum; yarın sabah ilk iş bu.” Üçü de birer karar. Kaybolan gün ise karar verilmeyen gündür." },

        { id: "b3-h2", type: "h", text: "Zor günler için daha küçük bir seçenek" },
        { id: "b3-p4", type: "p", text: "İyi giden bir günde ilk adım kolaydır. Plan asıl zor günlerde sınanır. Bu yüzden, önceden bir “daha küçük seçenek” belirlemek işe yarayabilir: Kötü bir günde bile yapabileceğin kadar küçük bir yedek." },
        { id: "b3-p5", type: "p", text: "Ödev için bu, dosyayı açıp tek bir cümle yazmak olabilir. Yürüyüş için evin önüne çıkıp beş dakika dolaşmak. Kitap okumak için bir sayfa. Küçük seçenek, işi yapmış sayılmak için değil, işle bağını koparmamak için var." },

        {
          id: "b3-gorsel",
          type: "figure",
          art: "flexiblePlan",
          alt: "Soldan sağa giden kesik çizgili bir yol, ortadaki bir engelin etrafından kıvrılarak devam ediyor. Altta yedi küçük kare var; çoğu dolu, biri boş, sonuncusunun yanında turuncu bir nokta.",
          caption: "Plan engelin etrafından dolaşabilir. Yedi günün birinde boşluk olması, yolun bittiği anlamına gelmez.",
        },

        { id: "b3-h3", type: "h", text: "Bir günü kaçırmak" },
        { id: "b3-p6", type: "p", text: "Yeni bir alışkanlık denerken bir gün atlamak, çoğu insana her şeyi baştan başlatması gerekiyormuş gibi gelir. Seri sayaçları da bu duyguyu besler: Otuz günlük bir zincir tek bir günde sıfırlanır." },

        {
          id: "b3-arastirma-1",
          type: "research",
          finding: "Londra'da yapılan bir çalışmada 96 gönüllü, her gün aynı durumda yapacakları bir yeme, içme ya da hareket davranışı seçti ve 12 hafta boyunca bu davranışın ne kadar otomatik hâle geldiğini her gün kendileri değerlendirdi. Tek bir fırsatı kaçırmak, alışkanlığın oluşma sürecini belirgin biçimde bozmadı. Davranışın neredeyse otomatik hâle gelmesi, kişiden kişiye çok farklı sürelerde gerçekleşti: 18 ile 254 gün arasında.",
          limits: "Küçük bir gönüllü grubu ve basit günlük davranışlar. Otomatiklik katılımcıların kendi değerlendirmesiyle ölçüldü ve bazı katılımcıların verileri modele iyi uymadı. Daha karmaşık davranışlarda sonuçlar farklı olabilir.",
          details: "Çalışmada ortanca süre 66 gündü; ama bu bir ortalama değil, bir hedef de değil. Bulgu, “21 günde alışkanlık” gibi sabit sürelerin herkese uymadığını ve ara sıra bir günü kaçırmanın süreci sıfırlamadığını düşündürüyor.",
          refs: ["lally2010"],
        },

        {
          id: "b3-oneri",
          type: "suggestion",
          text: "Bir alışkanlığı denerken önce yedi günlük kısa bir deneme yap. Amaç yedi günde alışkanlık kazanmak değil; seçtiğin zamanın, yerin ve adımın sana uyup uymadığını görmek. Yedi günün sonunda planı değiştirmek, deneyin bir parçası.",
        },

        { id: "b3-h5", type: "h", text: "Plan sana uymuyorsa" },
        { id: "b3-p10", type: "p", text: "Bazen sorun tek bir kötü gün değildir. Aynı plan birkaç gün üst üste tutmuyorsa, bu planın sana değil, senin plana uymaya çalıştığını gösterebilir. Sabah yedide koşmayı planlayan ama her sabah alarmı kapatan biri için asıl soru “Neden yapamıyorum?” değil, “Bu saat gerçekten bana uygun mu?” olabilir." },
        { id: "b3-p11", type: "p", text: "Planı değiştirirken üç şeye bakabilirsin: zaman, yer ve adımın büyüklüğü. Çoğu zaman birini değiştirmek yeterli olur. Sabah yerine akşam, ev yerine kütüphane, yarım saat yerine on dakika. Hedef aynı kalabilir; yalnızca ona giden yol değişir." },
        { id: "b3-p12", type: "p", text: "Bu değişiklikleri yaparken kendine bir deneyi yürüten biri gibi bakmak işe yarayabilir. Deneyler bazen beklenen sonucu vermez; bu, deneyi yapanın başarısız olduğu anlamına gelmez, yalnızca bir sonraki denemenin neyi değiştireceğini gösterir." },

        { id: "b3-h4", type: "h", text: "Akşam iki soru" },
        { id: "b3-p7", type: "p", text: "Günün sonunda planın ne kadarının gerçekleştiğini saymak yerine iki soru sormayı dene: Bugün ne işe yaradı? Yarın neyi kolaylaştırabilirim? İlki, işe yarayanı fark etmeni sağlar. İkincisi, ertesi günün planını bugünün deneyimine göre biraz düzeltir." },
        { id: "b3-p8", type: "p", text: "Cevaplar küçük olabilir: “Telefonu başka odaya koymak işe yaradı.” “Yarın çantamı akşamdan hazırlarım.” Planlar böyle, günden güne küçük düzeltmelerle hayata uyar." },
        { id: "b3-p9", type: "p", text: "Deniz o perşembe akşamı ödev dosyasını açtı ve ikinci bölüm için tek bir cümle yazdı. Sonra yattı. Ertesi sabah dosyayı açtığında, boş bir sayfa yerine bir cümle onu bekliyordu." },

        {
          id: "b3-uygulama",
          type: "exercise",
          title: "Yedi günlük küçük deneme",
          planner: "habit",
          steps: [
            "Denemek istediğin tek bir alışkanlık seç.",
            "En küçük uygulanabilir başlangıcını yaz: Kötü bir günde bile yapabileceğin kadar küçük.",
            "Onu günün içinde zaten olan bir ana bağla ve nerede yapacağını belirle.",
            "Zor günler için daha küçük bir seçenek ekle.",
            "Yedi gün boyunca her akşam yalnızca şunu işaretle: yaptım, daha küçüğünü yaptım ya da yapmadım. Sonra planına yeniden bak.",
          ],
        },

        {
          id: "b3-ozet",
          type: "summary",
          text: "Plan bozulduğunda onu bırakmak yerine zamanını kaydırmak ya da adımını küçültmek çoğu zaman mümkündür; bir günü kaçırmak da yolun bittiği anlamına gelmez.",
        },
      ],
      sources: ["lally2010"],
    },

    {
      id: "kapanis",
      kind: "outro",
      title: "Kapanış",
      minutes: 2,
      available: true,
      blocks: [
        { id: "k1", type: "p", text: "Bu kitapta üç küçük fikir vardı: Aklındakileri bir yere bırakmak, bugün için tek bir ana iş ve onun ilk adımını seçmek, gün değişince planı da değiştirebilmek." },
        { id: "k2", type: "p", text: "Bunların hiçbiri her günü kolaylaştırmayacak. Bazı günler liste uzun kalacak, ana iş ilerlemeyecek, deneme aksayacak. Bu, yöntemin ya da senin başarısız olduğun anlamına gelmez. Ertesi gün yeniden bir ana iş seçebilirsin." },
        { id: "k3", type: "p", text: "Planlayıcı ve alışkanlık bölümü, kitabı okumayı bitirdikten sonra da burada. İstediğin gün açıp yalnızca bugünün ana işini yazabilir, istediğin gün hiç açmayabilirsin. Kayıtların yalnızca bu cihazda duruyor; ara sıra yedek almayı unutma." },
        { id: "k4", type: "p", text: "Küçük adımlar her şeyi çözmez. Ama çoğu gün, başlamak için yeterli olabilir." },
      ],
    },
  ],

  /*
   * Kaynakça. Künyeler ve DOI'ler web aramasıyla akademik/üniversite kayıtlarından eşleştirildi.
   * Yayıncı sayfaları bu geliştirme ortamından açılamadı; satıştan önce bağlantılar tarayıcıda bir kez açılıp kontrol edilmeli.
   */
  sources: {
    masicampo2011: {
      authors: "Masicampo, E. J. & Baumeister, R. F.",
      year: 2011,
      title: "Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals",
      venue: "Journal of Personality and Social Psychology, 101(4), 667–683",
      doi: "10.1037/a0024192",
    },
    scullin2018: {
      authors: "Scullin, M. K., Krueger, M. L., Ballard, H. K., Pruett, N. & Bliwise, D. L.",
      year: 2018,
      title: "The effects of bedtime writing on difficulty falling asleep: A polysomnographic study comparing to-do lists and completed activity lists",
      venue: "Journal of Experimental Psychology: General, 147(1), 139–146",
      doi: "10.1037/xge0000374",
    },
    gollwitzer1999: {
      authors: "Gollwitzer, P. M.",
      year: 1999,
      title: "Implementation intentions: Strong effects of simple plans",
      venue: "American Psychologist, 54(7), 493–503",
      doi: "10.1037/0003-066X.54.7.493",
    },
    gollwitzer2006: {
      authors: "Gollwitzer, P. M. & Sheeran, P.",
      year: 2006,
      title: "Implementation intentions and goal achievement: A meta-analysis of effects and processes",
      venue: "Advances in Experimental Social Psychology, 38, 69–119",
      doi: "10.1016/S0065-2601(06)38002-1",
    },
    lally2010: {
      authors: "Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W. & Wardle, J.",
      year: 2010,
      title: "How are habits formed: Modelling habit formation in the real world",
      venue: "European Journal of Social Psychology, 40(6), 998–1009",
      doi: "10.1002/ejsp.674",
    },
  },
};

// Eski adla erişim (Türkçe kitap)
window.GX_BOOK = window.GX_BOOKS.tr;
