import { Link } from "react-router"
import { motion } from "framer-motion"
import Container from "../common/Container"
import SectionHeader from "../common/SectionHeader"
import ProductCard from "../product/ProductCard"
import ProductSkeleton from "../product/ProductSkeleton"
const MotionDiv = motion.div

function HomeFeaturedProducts({ loading, products }) {
  return (
    <section className="py-16">
      <Container className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Best Sellers"
            title="One cikan urunler"
            description="Topluluk tarafindan en cok tercih edilen premium urunleri vitrinden sec."
          />
          <Link
            to="/products"
            className="rounded-xl border border-nexora-line bg-white px-4 py-2 text-sm font-semibold text-nexora-text transition hover:border-nexora-primary hover:text-nexora-primary"
          >
            Tum Urunleri Gor
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => <ProductSkeleton key={index} />)
            : products.map((product) => (
                <MotionDiv
                  key={product._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </MotionDiv>
              ))}
        </div>
      </Container>
    </section>
  )
}

export default HomeFeaturedProducts
