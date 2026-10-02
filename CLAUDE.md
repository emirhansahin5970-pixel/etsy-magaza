# CLAUDE.md

Bu dosya, Claude Code'un bu projede yeni bir oturum açıldığında bağlamı hızla
kavraması ve kaldığı yerden devam edebilmesi için hazırlanmıştır. Her oturumun
sonunda **"Durum ve İlerleme"** bölümünü güncel tutun.

## Proje Özeti

- **Proje adı:** etsy-magaza
- **Amaç:** Etsy mağazası ile ilgili çalışmalar (kapsam henüz netleşmedi —
  aşağıdaki "Açık Sorular" bölümüne bakın).
- **Repo:** `emirhansahin5970-pixel/etsy-magaza`
- **Çalışma dili:** Türkçe (iletişim ve dokümantasyon). Kod, değişken adları ve
  commit mesajları İngilizce olabilir.

## Mevcut Durum

Proje yeni başlatıldı. Repoda şu an yalnızca `README.md` ve bu `CLAUDE.md`
dosyası bulunuyor. Henüz teknoloji yığını, klasör yapısı veya bağımlılık
seçilmedi.

## Açık Sorular

Projenin yönü belirlendikçe bu soruları yanıtlayıp ilgili bölümlere taşıyın:

1. Mağazada ne satılacak? (ör. dijital ürün, el yapımı ürün, baskı/POD)
2. Bu repoda ne geliştirilecek? Olası seçenekler:
   - Ürün listeleme metinleri / SEO etiketleri üretimi
   - Etsy Open API v3 ile otomasyon (listeleme, stok, sipariş takibi)
   - Dijital ürün dosyalarının (şablon, printable vb.) üretimi
   - Satış/rakip analizi, raporlama
3. Hangi dil ve araçlar kullanılacak? (ör. Python, Node.js/TypeScript)

## Teknoloji Yığını

_Henüz belirlenmedi._

## Klasör Yapısı

```
etsy-magaza/
├── CLAUDE.md   # Proje bağlamı ve ilerleme kaydı (bu dosya)
└── README.md
```

## Komutlar

_Henüz yok. Kurulum, çalıştırma, test ve lint komutları eklendikçe buraya yazın._

## Çalışma Kuralları

- Geliştirme `claude/...` ile başlayan özellik dallarında yapılır; `main`'e
  doğrudan push edilmez.
- API anahtarları, Etsy kimlik bilgileri vb. gizli bilgiler **asla** repoya
  commit edilmez; `.env` dosyasında tutulur ve `.gitignore`'a eklenir.
- Her anlamlı adımdan sonra bu dosyadaki "Durum ve İlerleme" bölümü güncellenir.

## Durum ve İlerleme

### Tamamlananlar
- [x] Repo oluşturuldu.
- [x] `CLAUDE.md` eklendi (2026-10-02).

### Sıradaki Adımlar
- [ ] "Açık Sorular" bölümündeki soruları yanıtla ve proje kapsamını netleştir.
- [ ] Teknoloji yığınını seç ve temel proje iskeletini kur.
- [ ] `README.md`'yi proje açıklamasıyla güncelle.

### Notlar / Kararlar
_Alınan önemli kararları tarihleriyle birlikte buraya ekleyin._
