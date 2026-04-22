import { BadgeCheck, CreditCard, Headset, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Container from "../common/Container"

const MotionArticle = motion.article

const trustItems = [
  {
    title: "Aynı Gün Kargo",
    text: "Saat 15:00'e kadar verilen siparişlerde hızlı teslimat avantajı.",
    icon: Truck,
    gradient: "from-sky-500/10 to-blue-600/5",
    iconColor: "text-sky-500",
  },
  {
    title: "14 Gün İade",
    text: "Koşulsuz iade süreci ile risksiz alışveriş deneyimi.",
    icon: BadgeCheck,
    gradient: "from-emerald-500/10 to-green-600/5",
    iconColor: "text-emerald-500",
  },
  {
    title: "Güvenli Ödeme",
    text: "PCI uyumlu altyapı ve şifreli ödeme akışı.",
    icon: CreditCard,
    gradient: "from-violet-500/10 to-purple-600/5",
    iconColor: "text-violet-500",
  },
  {
    title: "Canlı Destek",
    text: "Müşteri ekibi hafta içi her gün yardıma hazır.",
    icon: Headset,
    gradient: "from-amber-500/10 to-orange-600/5",
    iconColor: "text-amber-500",
  },
]

function HomeTrustStrip() {
  return (
    <section className="py-10">
      <Container>
        <div className="grid gap-3 rounded-3xl border border-nexora-line bg-white/80 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          {trustItems.map((item, i) => (
            <MotionArticle
              key={item.title}
              className={`group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br ${item.gradient} p-5 transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/70`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className={`inline-flex size-9 items-center justify-center rounded-xl bg-white shadow-sm ${item.iconColor}`}>
                <item.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-nexora-text">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-nexora-muted">{item.text}</p>
              </div>
            </MotionArticle>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HomeTrustStrip
