import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../api/axiosInstance"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
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
  const navigate = useNavigate()
  const { id } = useParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const addItem = useCartStore((state) => state.addItem)
  const product = useProductStore((state) => state.product)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const fetchProductById = useProductStore((state) => state.fetchProductById)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProductById(id)
    }
  }, [id, fetchProductById])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return
      setIsReviewsLoading(true)
      try {
        const response = await axiosInstance.get(`/reviews/product/${id}`)
        setReviews(response?.data?.data || [])
      } catch {
        setReviews([])
      } finally {
        setIsReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [id])

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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Sepete eklemek icin once giris yapin.")
      navigate("/login")
      return
    }

    try {
      await addItem({ productId: product?._id, quantity })
      toast.success(`${quantity} adet urun sepete eklendi.`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      toast.error("Yorum yapmak icin giris yapmalisiniz.")
      return
    }

    setIsSubmittingReview(true)
    try {
      const response = await axiosInstance.post("/reviews", {
        product: id,
        rating,
        comment,
      })
      const newReview = response?.data?.data
      if (newReview) {
        setReviews((prev) => [newReview, ...prev])
      }
      setComment("")
      setRating(5)
      toast.success("Degerlendirmeniz alindi.")
    } catch (submitError) {
      toast.error(submitError?.response?.data?.message || "Yorum gonderilemedi.")
    } finally {
      setIsSubmittingReview(false)
    }
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
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
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
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-nexora-accent px-5 py-4 text-base font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Degerlendirmeler</h2>

        {isAuthenticated && (
          <form className="mt-4 space-y-3 rounded-xl border border-slate-200 p-4" onSubmit={handleSubmitReview}>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-amber-400" : "text-slate-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Urun hakkindaki gorusunuzu yazin..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              rows={4}
              maxLength={1000}
              required
            />
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="rounded-xl bg-nexora-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmittingReview ? "Gonderiliyor..." : "Yorum Yap"}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <p className="mt-3 text-sm text-slate-500">
            Yorum birakmak icin giris yapmaniz gerekiyor.
          </p>
        )}

        <div className="mt-5 space-y-3">
          {isReviewsLoading && <div className="h-24 animate-pulse rounded-xl bg-slate-200" />}
          {!isReviewsLoading &&
            reviews.map((review) => (
              <article key={review._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{review?.user?.name || "Kullanici"}</p>
                  <span className="text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="mt-1 flex">{renderStars(review.rating)}</div>
                {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
              </article>
            ))}
          {!isReviewsLoading && !reviews.length && (
            <p className="text-sm text-slate-500">Bu urun icin henuz yorum bulunmuyor.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
