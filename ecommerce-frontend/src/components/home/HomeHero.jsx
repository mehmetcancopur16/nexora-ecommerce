import heroImage from "../../assets/hero.png"
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Badge from "../common/Badge"
import Button from "../common/Button"
import Container from "../common/Container"

const heroStats = [
  { value: "50K+", label: "Mutlu Müşteri", icon: Sparkles },
  { value: "24 Saat", label: "Hızlı Kargo", icon: Truck },
  { value: "%99.9", label: "Güvenli Ödeme", icon: ShieldCheck },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const MotionDiv = motion.div

function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-nexora-line bg-white/90 shadow-[0_28px_64px_-40px_rgba(15,23,42,0.45)]">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-nexora-primary/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-nexora-accent/10 blur-3xl" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexora-primary/30 to-transparent" aria-hidden="true" />

      <Container className="relative py-14 sm:py-18">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <MotionDiv variants={itemVariants}>
              <Badge className="border-slate-300 bg-gradient-to-r from-slate-50 to-sky-50 text-slate-600 shadow-sm">
                <Sparkles size={12} className="text-nexora-primary" />
                Luxury Modern Selection
              </Badge>
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-nexora-text sm:text-5xl">
                Premium alışverişi{" "}
                <span className="nexora-gradient-text">akıllı deneyim</span>{" "}
                ile buluşturan modern vitrin.
              </h1>
            </MotionDiv>

            <MotionDiv variants={itemVariants}>
              <p className="mt-5 max-w-xl text-base leading-7 text-nexora-muted">
                Nexora, seçili ürün koleksiyonları, güvenli ödeme adımları ve hızlı teslimat altyapısı
                ile tarz odaklı e-ticaret deneyimini bir üst seviyeye taşır.
              </p>
            </MotionDiv>

            <MotionDiv variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button as="link" to="/products" className="gap-2 shadow-md shadow-nexora-primary/25">
                  Koleksiyonu Keşfet
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button as="link" to="/register" variant="ghost" className="border-nexora-line">
                  Üyeliği Başlat
                </Button>
              </motion.div>
            </MotionDiv>

            <MotionDiv variants={itemVariants} className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {heroStats.map((item) => (
                <motion.div
                  key={item.label}
                  className="group rounded-2xl border border-nexora-line nexora-glass p-4 transition hover:-translate-y-1 hover:border-nexora-primary/30 hover:shadow-md hover:shadow-nexora-primary/10"
                  whileHover={{ scale: 1.03 }}
                >
                  <item.icon size={18} className="text-nexora-primary transition group-hover:scale-110" />
                  <p className="mt-1 text-xl font-bold text-nexora-text">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-nexora-muted">{item.label}</p>
                </motion.div>
              ))}
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            className="relative"
            initial={{ opacity: 0, scale: 0.94, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-nexora-primary/10 via-sky-400/5 to-nexora-accent/10 blur-2xl" />
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full border border-nexora-gold/40 bg-nexora-gold/10 lg:block" />
            <img
              src={heroImage}
              alt="Nexora öne çıkan premium ürün koleksiyonu"
              className="relative w-full rounded-3xl border border-slate-200/80 bg-slate-100 object-cover shadow-[0_28px_60px_-24px_rgba(15,23,42,0.55)]"
            />
            <div className="absolute bottom-4 right-4 hidden items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md lg:flex">
              <span className="inline-block size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-xs font-semibold text-slate-700">Stokta — Hızlı Teslimat</span>
            </div>
          </MotionDiv>
        </div>
      </Container>
    </section>
  )
}

export default HomeHero
