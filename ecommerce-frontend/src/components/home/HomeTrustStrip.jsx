import { BadgeCheck, CreditCard, Headset, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Container from "../common/Container"
const MotionArticle = motion.article

const trustItems = [
  { title: "Ayni Gun Kargo", text: "Saat 15:00'e kadar verilen siparislerde hizli teslimat avantaji.", icon: Truck },
  { title: "14 Gun Iade", text: "Kosulsuz iade sureci ile risksiz alisveris deneyimi.", icon: BadgeCheck },
  { title: "Guvenli Odeme", text: "PCI uyumlu altyapi ve sifrelenmis odeme akisi.", icon: CreditCard },
  { title: "Canli Destek", text: "Musteri ekibi hafta ici her gun yardima hazir.", icon: Headset },
]

function HomeTrustStrip() {
  return (
    <section className="py-10">
      <Container>
        <div className="grid gap-3 rounded-3xl border border-nexora-line bg-white/80 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          {trustItems.map((item) => (
            <MotionArticle
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/65 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <item.icon size={18} className="text-nexora-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-nexora-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-nexora-muted">{item.text}</p>
            </MotionArticle>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HomeTrustStrip
