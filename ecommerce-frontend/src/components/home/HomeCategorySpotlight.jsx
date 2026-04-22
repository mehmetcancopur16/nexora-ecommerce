import { Link } from "react-router"
import { ArrowRight, LayoutGrid } from "lucide-react"
import { motion } from "framer-motion"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"

const MotionDiv = motion.div

const CARD_GRADIENTS = [
  "from-sky-500/15 via-blue-500/8 to-transparent",
  "from-violet-500/15 via-purple-500/8 to-transparent",
  "from-emerald-500/15 via-green-500/8 to-transparent",
  "from-amber-500/15 via-orange-500/8 to-transparent",
]

const ICON_COLORS = [
  "text-sky-500 bg-sky-50",
  "text-violet-500 bg-violet-50",
  "text-emerald-500 bg-emerald-50",
  "text-amber-500 bg-amber-50",
]

function HomeCategorySpotlight({ categories = [], loading = false }) {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Curated Categories"
          title="Stiline göre seç, hızlıca keşfet."
          description="Koleksiyonlarımızı ihtiyacına ve zevkine göre düzenledik. Bir kategori seçerek direkt ilgili ürünlere ulaş."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <SurfaceCard key={index} className="space-y-3">
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
                </SurfaceCard>
              ))
            : categories.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-nexora-line bg-white px-5 py-8 text-center text-sm text-nexora-muted">
                  <LayoutGrid className="mx-auto mb-2 size-8 opacity-30" />
                  <p>Henüz kategori eklenmemiş. Katalog oluştuğunda bu alan otomatik olarak güncellenecek.</p>
                </div>
              )
            : categories.map((category, index) => (
                <MotionDiv
                  key={category._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                >
                  <SurfaceCard className="group h-full p-0 transition hover:-translate-y-1.5 hover:shadow-xl">
                    <Link
                      to={`/products?category=${category._id}`}
                      className={`block h-full rounded-2xl bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} p-5 transition`}
                    >
                      <div className={`mb-4 inline-flex size-9 items-center justify-center rounded-xl ${ICON_COLORS[index % ICON_COLORS.length]}`}>
                        <LayoutGrid size={16} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexora-muted">Kategori</p>
                      <h3 className="mt-2 text-xl font-semibold text-nexora-text transition group-hover:text-nexora-primary">
                        {category.name}
                      </h3>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-nexora-muted transition group-hover:text-nexora-primary">
                        Seçili ürünleri incele
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </p>
                    </Link>
                  </SurfaceCard>
                </MotionDiv>
              ))}
        </div>
      </Container>
    </section>
  )
}

export default HomeCategorySpotlight
