import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import SurfaceCard from "../common/SurfaceCard"
const MotionDiv = motion.div

function HomeCategorySpotlight({ categories = [], loading = false }) {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Curated Categories"
          title="Stiline gore sec, hizlica kesfet."
          description="Koleksiyonlarimizi ihtiyacina ve zevkine gore duzenledik. Bir kategori secerek direkt ilgili urunlere ulas."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <SurfaceCard key={index} className="space-y-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
                </SurfaceCard>
              ))
            : categories.map((category) => (
                <MotionDiv
                  key={category._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SurfaceCard className="group p-0 transition hover:-translate-y-1">
                  <Link
                    to={`/products?category=${category._id}`}
                    className="block rounded-2xl p-5 transition group-hover:bg-slate-50"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexora-muted">Kategori</p>
                    <h3 className="mt-3 text-xl font-semibold text-nexora-text transition group-hover:text-nexora-primary">
                      {category.name}
                    </h3>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-nexora-muted">
                      Secili urunleri incele
                      <ArrowRight size={15} />
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
