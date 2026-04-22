import { Crown, Gift, Sparkles, Star, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../common/Button"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"

const MotionDiv = motion.div
const MotionArticle = motion.article

const features = [
  {
    text: "Sınırlı Üretim Ürün Serisi",
    sub: "Her sezonda özenle seçilen, stok ile sınırlı koleksiyon.",
    icon: Crown,
    color: "text-amber-300",
    bg: "bg-amber-400/10",
  },
  {
    text: "Ücretsiz Premium Kargo",
    sub: "Tüm Nexora Signature ürünlerinde kapıya ücretsiz teslimat.",
    icon: Truck,
    color: "text-sky-300",
    bg: "bg-sky-400/10",
  },
  {
    text: "İlk Siparişte Özel Üye Avantajı",
    sub: "Yeni üyelere özel %15 indirim ve öncelikli müşteri desteği.",
    icon: Gift,
    color: "text-violet-300",
    bg: "bg-violet-400/10",
  },
  {
    text: "Nexora Plus Puanları",
    sub: "Her alışverişte puan kazan, bir sonrakine harca.",
    icon: Star,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
  },
]

function HomeEditorialShowcase() {
  return (
    <section className="py-16">
      <Container>
        <SurfaceCard className="overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-0 text-white shadow-2xl shadow-slate-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,_var(--tw-gradient-stops))] from-nexora-primary/15 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" aria-hidden="true" />

          <div className="relative grid gap-8 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <MotionDiv initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <SectionHeader
                eyebrow="Seasonal Edit"
                title="Nexora Signature koleksiyonu ile sezonu yeniden tanımla."
                description="Sadece seçili üyelere özel premium seri, sınırlı stok ve özel fiyat avantajı ile yayında."
                eyebrowClassName="border-slate-600 bg-white/5 text-slate-300"
                titleClassName="text-white"
                descriptionClassName="text-slate-300"
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button as="link" to="/products" className="gap-2 bg-white text-slate-900 shadow-lg hover:bg-slate-100">
                    <Sparkles size={15} />
                    Kampanyaya Git
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    as="link"
                    to="/products?search=signature"
                    variant="ghost"
                    className="border-slate-500 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    Signature Ürünleri İncele
                  </Button>
                </motion.div>
              </div>
            </MotionDiv>

            <div className="grid gap-3">
              {features.map((item, i) => (
                <MotionArticle
                  key={item.text}
                  className="group rounded-2xl border border-slate-700/60 bg-white/5 p-4 transition hover:bg-white/10"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                      <item.icon size={15} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{item.text}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                </MotionArticle>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  )
}

export default HomeEditorialShowcase
