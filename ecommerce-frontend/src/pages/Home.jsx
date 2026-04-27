import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import axiosInstance from "../api/axiosInstance"
import Container from "../components/common/Container"
import HomeCategorySpotlight from "../components/home/HomeCategorySpotlight"
import HomeEditorialShowcase from "../components/home/HomeEditorialShowcase"
import HomeFeaturedProducts from "../components/home/HomeFeaturedProducts"
import HomeHero from "../components/home/HomeHero"
import HomeNewsletter from "../components/home/HomeNewsletter"
import HomeStatsBar from "../components/home/HomeStatsBar"
import HomeTestimonials from "../components/home/HomeTestimonials"
import HomeTrustStrip from "../components/home/HomeTrustStrip"

const FALLBACK_ERROR = "Ana sayfa verileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin."

function Home() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    const fetchHomepageData = async () => {
      setIsLoading(true)
      setError("")
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/products", { params: { page: 1, limit: 4 } }),
        ])

        if (ignore) return

        setCategories(categoriesResponse?.data?.data || [])
        setFeaturedProducts(productsResponse?.data?.data || [])
      } catch (requestError) {
        if (ignore) return
        setError(requestError?.response?.data?.message || requestError?.message || FALLBACK_ERROR)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    fetchHomepageData()

    return () => {
      ignore = true
    }
  }, [])

  const featuredCategories = useMemo(() => categories.slice(0, 4), [categories])

  return (
    <div className="relative space-y-4 overflow-hidden pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_12%_18%,rgba(14,165,233,0.11),transparent_52%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-48 h-80 bg-[radial-gradient(circle_at_88%_22%,rgba(244,63,94,0.1),transparent_52%)]" aria-hidden="true" />
      <HomeHero />
      <HomeStatsBar />
      <HomeTrustStrip />

      {error ? (
        <section className="py-10">
          <Container>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}{" "}
              <Link to="/products" className="font-semibold underline underline-offset-2">
                Ürünleri yine de görüntüle
              </Link>
              .
            </div>
          </Container>
        </section>
      ) : null}

      {isLoading || featuredCategories.length > 0 ? (
        <HomeCategorySpotlight categories={featuredCategories} loading={isLoading} />
      ) : !error ? (
        <section className="py-10">
          <Container>
            <div className="rounded-2xl border border-nexora-line bg-white px-5 py-6 text-sm text-nexora-muted">
              Henüz kategori eklenmemiş. Katalog oluştuğunda bu alan otomatik olarak güncellenecek.
            </div>
          </Container>
        </section>
      ) : null}

      {isLoading || featuredProducts.length > 0 ? (
        <HomeFeaturedProducts loading={isLoading} products={featuredProducts} />
      ) : !error ? (
        <section>
          <Container>
            <div className="rounded-2xl border border-nexora-line bg-white px-5 py-6 text-sm text-nexora-muted">
              Öne çıkan ürünler henüz görüntülenemiyor. Lütfen katalog sayfasını ziyaret et.
            </div>
          </Container>
        </section>
      ) : null}

      <HomeEditorialShowcase />
      <HomeTestimonials />
      <HomeNewsletter />
    </div>
  )
}

export default Home
