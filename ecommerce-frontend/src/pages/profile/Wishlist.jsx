import { motion as Motion } from "framer-motion"
import { ArrowRight, Heart, HeartOff, Package, ShoppingCart, Sparkles } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { useCartStore } from "../../store/cartStore"
import { useWishlistStore } from "../../store/wishlistStore"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api").replace(/\/api$/, "")

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/500x500/e2e8f0/64748b?text=Nexora"
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  return `${API_BASE_URL}${imagePath}`
}

function Wishlist() {
  const products = useWishlistStore((state) => state.items)
  const isLoading = useWishlistStore((state) => state.isLoading)
  const isHydrated = useWishlistStore((state) => state.isHydrated)
  const error = useWishlistStore((state) => state.error)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const itemLoadingMap = useWishlistStore((state) => state.itemLoadingMap)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (!isHydrated) {
      fetchWishlist().catch(() => {})
    }
  }, [isHydrated, fetchWishlist])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
      toast.success("Urun favorilerden kaldirildi.")
    } catch (actionError) {
      toast.error(actionError?.message || "Islem basarisiz.")
    }
  }

  const moveToCart = async (productId) => {
    try {
      await addItem({ productId, quantity: 1 })
      await handleRemove(productId)
      toast.success("Urun sepete eklendi, favorilerden cikarildi.")
    } catch (actionError) {
      toast.error(actionError?.message || "Sepete eklenemedi.")
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => fetchWishlist().catch(() => {})}
          className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
        >
          Tekrar dene
        </button>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-14 text-center">
        <Heart className="mx-auto size-12 text-rose-200" />
        <p className="mt-4 text-lg font-semibold text-slate-800">Favori ürününüz yok</p>
        <p className="mt-2 text-sm text-slate-500">Beğendiklerinizi kalp ile kaydedin, burada görünsün.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Package className="size-4" />
          Ürünlere git
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-rose-50/80 via-white to-sky-50/50 p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-600">
          <Sparkles className="size-4" />
          Favori listeniz
        </div>
        <h1 className="mt-2 text-2xl font-bold text-nexora-text">{products.length} ürün</h1>
        <p className="mt-1 text-sm text-slate-600">Sepete hızlı ekleyin veya listeden çıkarın.</p>
      </Motion.header>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <Motion.article
            key={product._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                src={getImageSource(product?.images?.[0])}
                alt={product?.name || "Urun"}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {Number(product?.stock) === 0 ? (
                <span className="absolute right-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                  Stokta yok
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h2 className="line-clamp-2 min-h-12 text-base font-semibold text-slate-900">{product?.name}</h2>
              <p className="mt-2 text-lg font-bold text-nexora-text">{Number(product?.price || 0).toFixed(2)} TL</p>
              <Link
                to={`/products/${product._id}`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-nexora-primary hover:underline"
              >
                Urun detayina git
                <ArrowRight className="size-4" />
              </Link>
              <div className="mt-4 flex flex-1 flex-wrap items-end gap-2">
                <button
                  type="button"
                  onClick={() => moveToCart(product._id)}
                  disabled={Number(product?.stock) === 0 || Boolean(itemLoadingMap[product._id])}
                  className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-nexora-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <ShoppingCart className="size-4" />
                  Sepete ekle
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(product._id)}
                  disabled={Boolean(itemLoadingMap[product._id])}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HeartOff className="size-4" />
                  Kaldır
                </button>
              </div>
            </div>
          </Motion.article>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
