import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
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
            title="Öne çıkan ürünler"
            description="Topluluk tarafından en çok tercih edilen premium ürünleri vitrinimizden seç."
          />
          <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-nexora-primary to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-nexora-primary/25 transition hover:from-sky-500 hover:to-nexora-primary"
            >
              Tüm Ürünleri Gör
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => <ProductSkeleton key={index} />)
            : products.map((product, index) => (
                <MotionDiv
                  key={product._id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
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
