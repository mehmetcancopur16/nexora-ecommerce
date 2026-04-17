import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import axiosInstance from "../api/axiosInstance"
import Container from "../components/common/Container"
import HomeCategorySpotlight from "../components/home/HomeCategorySpotlight"
import HomeEditorialShowcase from "../components/home/HomeEditorialShowcase"
import HomeFeaturedProducts from "../components/home/HomeFeaturedProducts"
import HomeHero from "../components/home/HomeHero"
import HomeNewsletter from "../components/home/HomeNewsletter"
import HomeTestimonials from "../components/home/HomeTestimonials"
import HomeTrustStrip from "../components/home/HomeTrustStrip"

const FALLBACK_ERROR = "Ana sayfa verileri yuklenirken bir hata olustu. Lutfen tekrar deneyin."

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
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchHomepageData()

    return () => {
      ignore = true
    }
  }, [])

  const featuredCategories = useMemo(() => categories.slice(0, 4), [categories])

  return (
    <div className="space-y-4 pb-8">
      <HomeHero />
      <HomeTrustStrip />

      {error ? (
        <section className="py-10">
          <Container>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}{" "}
              <Link to="/products" className="font-semibold underline underline-offset-2">
                Urunleri yine de goruntule
              </Link>
              .
            </div>
          </Container>
        </section>
      ) : null}

      {!isLoading && !featuredCategories.length ? (
        <section className="py-10">
          <Container>
            <div className="rounded-2xl border border-nexora-line bg-white px-5 py-6 text-sm text-nexora-muted">
              Henuz kategori eklenmemis. Katalog olustukca bu alan otomatik olarak guncellenecek.
            </div>
          </Container>
        </section>
      ) : (
        <HomeCategorySpotlight categories={featuredCategories} loading={isLoading} />
      )}

      <HomeFeaturedProducts loading={isLoading} products={featuredProducts} />
      {!isLoading && !featuredProducts.length ? (
        <section>
          <Container>
            <div className="rounded-2xl border border-nexora-line bg-white px-5 py-6 text-sm text-nexora-muted">
              One cikan urunler henuz goruntulenemiyor. Lutfen katalog sayfasini ziyaret et.
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
