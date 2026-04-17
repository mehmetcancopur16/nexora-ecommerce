import heroImage from "../../assets/hero.png"
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Badge from "../common/Badge"
import Button from "../common/Button"
import Container from "../common/Container"

const heroStats = [
  { value: "50K+", label: "Mutlu Musteri", icon: Sparkles },
  { value: "24 Saat", label: "Hizli Kargo", icon: Truck },
  { value: "%99.9", label: "Guvenli Odeme", icon: ShieldCheck },
]
const MotionDiv = motion.div

function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-nexora-line bg-white/90 shadow-[0_28px_64px_-40px_rgba(15,23,42,0.45)]">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-nexora-primary/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-nexora-accent/10 blur-3xl" aria-hidden="true" />

      <Container className="relative py-14 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Badge className="border-slate-300 bg-slate-50 text-slate-600">Luxury Modern Selection</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-nexora-text sm:text-5xl">
              Premium alisverisi <span className="nexora-gradient-text">akilli deneyim</span> ile bulusturan modern
              vitrin.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-nexora-muted">
              Nexora, secili urun koleksiyonlari, guvenli odeme adimlari ve hizli teslimat altyapisi ile tarz odakli
              e-ticaret deneyimini bir ust seviyeye tasir.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="link" to="/products" className="gap-2">
                Koleksiyonu Kesfet
                <ArrowRight size={16} />
              </Button>
              <Button as="link" to="/register" variant="ghost">
                Uyeligi Baslat
              </Button>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-nexora-line nexora-glass p-4">
                  <item.icon size={18} className="text-nexora-primary" />
                  <p className="text-xl font-semibold text-nexora-text">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-nexora-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </MotionDiv>

          <MotionDiv
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full border border-nexora-gold/40 bg-nexora-gold/10 lg:block" />
            <img
              src={heroImage}
              alt="Nexora one cikan premium urun koleksiyonu"
              className="relative w-full rounded-3xl border border-slate-200 bg-slate-100 object-cover shadow-[0_28px_60px_-24px_rgba(15,23,42,0.55)]"
            />
          </MotionDiv>
        </div>
      </Container>
    </section>
  )
}

export default HomeHero
