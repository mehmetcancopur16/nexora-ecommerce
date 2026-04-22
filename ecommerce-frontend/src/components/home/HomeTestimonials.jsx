import { Star } from "lucide-react"
import { motion } from "framer-motion"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"

const MotionDiv = motion.div

const testimonials = [
  {
    name: "Merve K.",
    role: "Nexora Plus Üyesi",
    quote:
      "Ürün kalitesi ve paketleme seviyesi gerçekten premium. Sipariş süreci beklediğimden çok daha hızlıydı.",
    stars: 5,
    initials: "MK",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Can A.",
    role: "Kurumsal Müşteri",
    quote:
      "Ekip profesyonel, iade ve değişim süreci çok net. Düzenli kampanya yönetimi de çok başarılı.",
    stars: 5,
    initials: "CA",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Buse T.",
    role: "Trend Takipçisi",
    quote:
      "Modern tasarım dili ve seçili ürün gamı sayesinde aradığımı hızla buluyorum. Çok memnunum.",
    stars: 5,
    initials: "BT",
    color: "from-emerald-500 to-green-600",
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} yıldız`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  )
}

function HomeTestimonials() {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Social Proof"
          title="Müşterilerimizin yorumları"
          description="Nexora deneyimini her gün tercih eden kullanıcıların geri bildirimleri."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <MotionDiv
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <SurfaceCard className="group h-full transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70">
                <StarRating count={item.stars} />
                <p className="mt-4 text-sm leading-7 text-slate-600">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-sm font-bold text-white shadow-md`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-nexora-text">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-nexora-muted">{item.role}</p>
                  </div>
                </div>
              </SurfaceCard>
            </MotionDiv>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HomeTestimonials
