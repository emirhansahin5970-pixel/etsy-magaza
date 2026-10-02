/*
 * Kitap içeriği (Türkçe): "Küçük Adımlar, Daha Net Günler"
 * Arayüz metinleri burada değil: i18n/tr.js
 *
 * Blok türleri:
 *   h        – ara başlık
 *   p        – paragraf
 *   scene    – gündelik sahne (paragraflar dizisi)
 *   figure   – görsel (illustrations.js içindeki anahtar + açıklama)
 *   research – araştırma bulgusu (refs: kaynak kimlikleri)
 *   suggestion – yazarın kendi önerisi (araştırma bulgusundan ayrı tutulur)
 *   exercise – küçük uygulama (planner: planlayıcıdaki hedef alan)
 *   summary  – tek cümlelik bölüm özeti
 * Her bloğun benzersiz bir id'si var; okuma konumu bu id ile hatırlanır.
 */
window.GX_BOOK = {
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
          text: "Masicampo ve Baumeister'ın 2011'de yayımlanan bir dizi deneyinde, bitmemiş bir hedefi hatırlatılan katılımcıların, ilgisiz bir okuma görevi sırasında akıllarının o hedefe daha sık kaydığı görüldü. Aynı hedef için belirli bir plan yapmalarına izin verildiğinde bu etki ortadan kalktı. Araştırmacılara göre fark yaratan, işi yalnızca hatırlamak değil, onun için somut bir plan kurmaktı. Bu çalışmalar laboratuvarda, çoğunlukla üniversite öğrencileriyle yapıldı; günlük hayatta herkeste aynı sonucu vereceği anlamına gelmez.",
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
          text: "Scullin ve arkadaşlarının 2018'de yayımladığı bir uyku laboratuvarı çalışmasında, 57 genç yetişkin yatmadan önce beş dakika yazı yazdı. Önümüzdeki günlerde yapacaklarını yazanlar, son günlerde tamamladıklarını yazanlara göre ortalamada daha çabuk uykuya daldı. Yapılacaklarını daha ayrıntılı yazanlar da daha çabuk uyudu. Çalışma tek bir gece, uyku sorunu olmayan küçük bir grupla yapıldı. Yazmanın herkesin uykusuna iyi geleceğini göstermiyor; ama listeyi akıldan kâğıda taşımanın rahatlatıcı olabileceğine dair ilginç bir ipucu veriyor.",
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
      minutes: 8,
      available: false,
      blocks: [],
    },

    {
      id: "bolum-3",
      kind: "chapter",
      number: 3,
      title: "Planını Hayatına Uydur",
      minutes: 7,
      available: false,
      blocks: [],
    },
  ],

  /*
   * Kaynakça. Künyeler ve DOI'ler web aramasıyla akademik/üniversite kayıtlarından eşleştirildi.
   * Yayıncı sayfaları bu geliştirme ortamından açılamadı; satıştan önce bağlantılar tarayıcıda bir kez açılıp kontrol edilmeli.
   */
  sources: {
    masicampo2011: {
      authors: "Masicampo, E. J. ve Baumeister, R. F.",
      year: 2011,
      title: "Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals",
      venue: "Journal of Personality and Social Psychology, 101(4), 667–683",
      doi: "10.1037/a0024192",
    },
    scullin2018: {
      authors: "Scullin, M. K., Krueger, M. L., Ballard, H. K., Pruett, N. ve Bliwise, D. L.",
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
      authors: "Gollwitzer, P. M. ve Sheeran, P.",
      year: 2006,
      title: "Implementation intentions and goal achievement: A meta-analysis of effects and processes",
      venue: "Advances in Experimental Social Psychology, 38, 69–119",
      doi: "10.1016/S0065-2601(06)38002-1",
    },
    lally2010: {
      authors: "Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W. ve Wardle, J.",
      year: 2010,
      title: "How are habits formed: Modelling habit formation in the real world",
      venue: "European Journal of Social Psychology, 40(6), 998–1009",
      doi: "10.1002/ejsp.674",
    },
  },
};
