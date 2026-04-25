import { useEffect, useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")
const FALLBACK_IMAGE = "https://placehold.co/600x600/e2e8f0/64748b?text=Nexora"

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return FALLBACK_IMAGE
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  return `${API_BASE_URL}${imagePath}`
}

const renderStars = (rating) => {
  const roundedRating = Math.round(rating || 0)
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < roundedRating ? "text-amber-400" : "text-slate-300"}>
      ★
    </span>
  ))
}

function ProductCard({ product }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const addItem = useCartStore((state) => state.addItem)
  const image = getImageSource(product?.images?.[0])
  const [imageSrc, setImageSrc] = useState(image)

  useEffect(() => {
    setImageSrc(image)
  }, [image])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Sepete eklemek icin giris yapmalisiniz.")
      return
    }

    try {
      await addItem({ productId: product?._id, quantity: 1 })
      toast.success("Urun sepete eklendi.")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-0 transition hover:-translate-y-1 hover:border-sky-200/80 hover:shadow-xl hover:ring-2 hover:ring-sky-100/80">
      <Link className="block" to={`/products/${product?._id}`}>
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img
            src={imageSrc}
            alt={product?.name || "Urun gorseli"}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link
          to={`/products/${product?._id}`}
          className="line-clamp-2 text-base font-semibold text-slate-800 transition hover:text-nexora-primary"
        >
          {product?.name}
        </Link>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-nexora-text">{Number(product?.price || 0).toFixed(2)} TL</p>
          <div className="flex items-center gap-1 text-sm">
            <div className="flex">{renderStars(product?.averageRating)}</div>
            <span className="text-slate-500">({product?.numOfReviews || 0})</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-xl bg-nexora-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Sepete Ekle
        </button>
      </div>
    </article>
  )
}

export default ProductCard
