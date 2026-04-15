import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"
import { useProductStore } from "../store/productStore"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/800x800/e2e8f0/64748b?text=Nexora"
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

function ProductDetail() {
  const { id } = useParams()
  const product = useProductStore((state) => state.product)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const fetchProductById = useProductStore((state) => state.fetchProductById)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      fetchProductById(id)
    }
  }, [id, fetchProductById])

  useEffect(() => {
    setQuantity(1)
  }, [product?._id])

  const stock = product?.stock || 0
  const image = useMemo(() => getImageSource(product?.images?.[0]), [product?.images])

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(stock || 1, prev + 1))
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <p className="text-lg font-semibold text-slate-700">Urun bulunamadi.</p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-nexora-text">{product.name}</h1>
            <p className="mt-2 text-sm text-slate-600">{product.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex">{renderStars(product.averageRating)}</div>
            <span className="text-slate-500">
              {Number(product.averageRating || 0).toFixed(1)} / 5 ({product.numOfReviews || 0} yorum)
            </span>
          </div>

          <p className="text-3xl font-bold text-nexora-primary">{Number(product.price || 0).toFixed(2)} TL</p>

          <p className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {stock > 0 ? "Stokta var" : "Tukendi"}
          </p>

          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-700">Miktar</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || stock <= 0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-lg font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                -
              </button>
              <span className="min-w-10 text-center text-lg font-semibold text-slate-800">{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= stock || stock <= 0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-lg font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={stock <= 0}
            onClick={() => toast.success(`${quantity} adet urun sepete eklendi (demo).`)}
            className="w-full rounded-xl bg-nexora-accent px-5 py-4 text-base font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
