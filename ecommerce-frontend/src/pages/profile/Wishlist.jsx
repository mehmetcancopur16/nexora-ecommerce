import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"
import ProductCard from "../../components/product/ProductCard"

function Wishlist() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get("/users/wishlist")
        setProducts(response?.data?.data || [])
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Favoriler yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <p className="text-lg font-semibold text-slate-700">Favori urununuz bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default Wishlist
