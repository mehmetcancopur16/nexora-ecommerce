import { FREE_SHIPPING_THRESHOLD_TL } from "../constants/shipping"

export const STATIC_PAGES = {
  returns: {
    pageKey: "returns",
    title: "İade politikası",
    description: "Nexora’da iade ve değişim koşulları; tüketici haklarınız ve süreç adımları.",
    sections: [
      {
        slug: "genel-kosullar",
        icon: "clipboard",
        heading: "Genel koşullar",
        paragraphs: [
          "Satın aldığınız ürünleri, teslimattan itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin iade edebilirsiniz. Ürün kullanılmamış, orijinal ambalajında ve fatura veya irsaliye ile birlikte olmalıdır.",
          "Kişisel hijyen ürünleri, açılmış yazılım lisansları ve kampanya koşullarında özel olarak belirtilen ürünler iade kapsamı dışında olabilir; ürün sayfasındaki açıklamalar geçerlidir.",
        ],
      },
      {
        slug: "iade-sureci",
        icon: "package",
        heading: "İade süreci",
        paragraphs: [
          "Hesabınızdan sipariş detayına giderek iade talebi oluşturun veya destek ekibimizle iletişime geçin. Onay sonrası kargo etiketi veya iade adresi tarafınıza iletilir.",
          "İade kargonuz depomuza ulaştığında ve kontrol tamamlandığında ödeme, ödeme yaptığınız yönteme 5–10 iş günü içinde iade edilir.",
        ],
      },
      {
        slug: "iletisim",
        icon: "mail",
        heading: "İletişim",
        paragraphs: [
          "İade ile ilgili sorularınız için destek@nexora.com veya +90 212 000 00 00 numaralı hattımızı kullanabilirsiniz.",
        ],
      },
    ],
    updatedLabel: "Son güncelleme: Nisan 2026",
  },
  shipping: {
    pageKey: "shipping",
    title: "Teslimat bilgisi",
    description: "Kargo süreleri ve takip; ücretsiz kargo eşiği sepet özetindeki bilgilendirme ile uyumludur.",
    sections: [
      {
        slug: "teslimat-suresi",
        icon: "truck",
        heading: "Teslimat süresi",
        paragraphs: [
          "İstanbul için aynı gün veya ertesi iş günü teslimat; diğer şehirler için genelde 1–3 iş günü hedeflenir. Kampanya ve yoğunluk dönemlerinde süreler uzayabilir.",
        ],
      },
      {
        slug: "kargo-ucreti",
        icon: "badgePercent",
        heading: "Kargo ücreti",
        paragraphs: [
          `${FREE_SHIPPING_THRESHOLD_TL} TL ve üzeri siparişlerde kampanyalı ücretsiz kargo uygulanır; altında sabit kargo ücreti ödeme ve sepet özeti ekranında gösterilir.`,
          "Ücretler bölge ve kargo firmasına göre değişebilir; nihai tutar sipariş onayı öncesinde netleşir.",
        ],
      },
      {
        slug: "takip",
        icon: "mapPin",
        heading: "Takip",
        paragraphs: [
          "Siparişiniz kargoya verildiğinde e-posta ve SMS ile takip numarası paylaşılır. Kargo firmasının web sitesinden güncel durumu izleyebilirsiniz.",
        ],
      },
    ],
    updatedLabel: "Son güncelleme: Nisan 2026",
  },
  privacy: {
    pageKey: "privacy",
    title: "Gizlilik politikası",
    description: "Kişisel verilerin korunması, işlenme amaçları ve KVKK kapsamındaki haklarınız.",
    sections: [
      {
        slug: "toplanan-veriler",
        icon: "database",
        heading: "Toplanan veriler",
        paragraphs: [
          "Hesap oluşturma, sipariş ve müşteri hizmetleri sürecinde ad, iletişim, teslimat adresi ve ödeme işlemi için gerekli bilgiler işlenir. Ödeme kartı bilgileri PCI uyumlu ödeme sağlayıcısı üzerinden güvenle alınır; Nexora kart numaranızı saklamaz.",
        ],
      },
      {
        slug: "kullanim-amaclari",
        icon: "shield",
        heading: "Kullanım amaçları",
        paragraphs: [
          "Verileriniz siparişin yerine getirilmesi, yasal yükümlülükler, dolandırıcılık önleme ve (tercihinize bağlı) pazarlama iletişimi için kullanılır.",
        ],
      },
      {
        slug: "haklariniz",
        icon: "scale",
        heading: "Haklarınız",
        paragraphs: [
          "KVKK kapsamında verilerinize erişme, düzeltme, silme ve itiraz haklarınızı kullanmak için hello@nexora.com adresine yazabilirsiniz.",
        ],
      },
    ],
    updatedLabel: "Son güncelleme: Nisan 2026",
  },
  support: {
    pageKey: "support",
    title: "Destek",
    description: "Sık sorulan sorular ve iletişim kanalları.",
    sections: [
      {
        slug: "sss",
        icon: "help",
        heading: "Sık sorulan sorular",
        paragraphs: [
          "Sipariş durumunu Hesabım > Siparişlerim bölümünden takip edebilirsiniz. Ödeme hatası yaşarsanız banka veya kart sağlayıcınızla da iletişime geçebilirsiniz.",
        ],
      },
      {
        slug: "ulasim",
        icon: "mail",
        heading: "Bize ulaşın",
        paragraphs: [
          "E-posta: hello@nexora.com",
          "Telefon: +90 212 000 00 00 (Hafta içi 09:00–18:00)",
          "Adres: İstanbul, Türkiye",
        ],
      },
    ],
    updatedLabel: "Son güncelleme: Nisan 2026",
  },
}
