import { Crown, Sparkles, Truck } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../common/Button"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"
const MotionDiv = motion.div
const MotionArticle = motion.article

function HomeEditorialShowcase() {
  return (
    <section className="py-16">
      <Container>
        <SurfaceCard className="overflow-hidden border-slate-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-0 text-white">
          <div className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <MotionDiv initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeader
                eyebrow="Seasonal Edit"
                title="Nexora Signature koleksiyonu ile sezonu yeniden tanimla."
                description="Sadece secili uyelere ozel premium seri, sinirli stok ve ozel fiyat avantaji ile yayinda."
                eyebrowClassName="border-slate-600 bg-white/5 text-slate-300"
                titleClassName="text-white"
                descriptionClassName="text-slate-300"
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <Button as="link" to="/products" className="bg-white text-slate-900 hover:bg-slate-100">
                  Kampanyaya Git
                </Button>
                <Button
                  as="link"
                  to="/products?search=signature"
                  variant="ghost"
                  className="border-slate-500 bg-transparent text-white hover:border-white hover:text-white"
                >
                  Signature Urunleri Incele
                </Button>
              </div>
            </MotionDiv>

            <div className="grid gap-3">
              {[
                { text: "Sinirli Uretim Urun Serisi", icon: Crown },
                { text: "Ucretsiz Premium Kargo", icon: Truck },
                { text: "Ilk Sipariste Ozel Uye Avantaji", icon: Sparkles },
              ].map((item) => (
                <MotionArticle
                  key={item.text}
                  className="rounded-2xl border border-slate-700 bg-white/5 p-4 text-sm"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-slate-100" />
                    <span>{item.text}</span>
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
