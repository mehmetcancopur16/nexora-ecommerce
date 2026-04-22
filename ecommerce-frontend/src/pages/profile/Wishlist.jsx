import { useEffect, useState } from "react"
import { HeartOff, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"
import { useCartStore } from "../../store/cartStore"

function Wishlist() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const addItem = useCartStore((state) => state.addItem)

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

  const handleRemove = async (productId) => {
    try {
      const response = await axiosInstance.patch(`/users/wishlist/${productId}`)
      setProducts(response?.data?.data || [])
      toast.success("Urun favorilerden kaldirildi.")
    } catch (actionError) {
      toast.error(actionError?.response?.data?.message || "Islem basarisiz.")
    }
  }

  const moveToCart = async (productId) => {
    try {
      await addItem({ productId, quantity: 1 })
      await handleRemove(productId)
      toast.success("Urun sepete tasindi.")
    } catch (actionError) {
      toast.error(actionError?.message || "Sepete tasima basarisiz.")
    }
  }

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
        <article key={product._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <img
            src={product?.images?.[0] || "https://placehold.co/500x500/e2e8f0/64748b?text=Nexora"}
            alt={product?.name || "Urun"}
            className="h-48 w-full rounded-xl object-cover"
          />
          <p className="mt-3 line-clamp-2 text-base font-semibold text-slate-800">{product?.name}</p>
          <p className="mt-1 text-sm text-slate-600">{Number(product?.price || 0).toFixed(2)} TL</p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveToCart(product._id)}
              className="inline-flex items-center gap-1 rounded-xl bg-nexora-primary px-3 py-2 text-sm font-semibold text-white"
            >
              <ShoppingCart className="size-4" aria-hidden />
              Sepete Tası
            </button>
            <button
              type="button"
              onClick={() => handleRemove(product._id)}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
            >
              <HeartOff className="size-4" aria-hidden />
              Cikar
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default Wishlist
