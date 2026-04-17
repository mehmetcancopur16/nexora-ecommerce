import { motion } from "framer-motion"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"
const MotionDiv = motion.div

const testimonials = [
  {
    name: "Merve K.",
    role: "Nexora Plus Uyesi",
    quote: "Urun kalitesi ve paketleme seviyesi gercekten premium. Siparis sureci bekledigimden cok daha hizliydi.",
  },
  {
    name: "Can A.",
    role: "Kurumsal Musteri",
    quote: "Ekip profesyonel, iade ve degisim sureci cok net. Duzenli kampanya yonetimi de cok basarili.",
  },
  {
    name: "Buse T.",
    role: "Trend Takipcisi",
    quote: "Modern tasarim dili ve secili urun gami sayesinde aradigimi hizla buluyorum. Cok memnunum.",
  },
]

function HomeTestimonials() {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Social Proof"
          title="Musterilerimizin yorumlari"
          description="Nexora deneyimini her gun tercih eden kullanicilarin geri bildirimleri."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <MotionDiv
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SurfaceCard className="h-full">
                <p className="text-sm leading-7 text-slate-600">"{item.quote}"</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-nexora-text">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-nexora-muted">{item.role}</p>
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
