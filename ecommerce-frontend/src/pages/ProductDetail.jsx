import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../api/axiosInstance"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { useProductStore } from "../store/productStore"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")
const FALLBACK_IMAGE = "https://placehold.co/800x800/e2e8f0/64748b?text=Nexora"

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(
    Number(value || 0)
  )

function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const addItem = useCartStore((state) => state.addItem)
  const product = useProductStore((state) => state.product)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const fetchProductById = useProductStore((state) => state.fetchProductById)
  const relatedProducts = useProductStore((state) => state.relatedProducts)
  const fetchRelatedProducts = useProductStore((state) => state.fetchRelatedProducts)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviewSort, setReviewSort] = useState("newest")

  useEffect(() => {
    if (id) {
      fetchProductById(id)
    }
  }, [id, fetchProductById])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return
      setIsReviewsLoading(true)
      setReviewsError("")
      try {
        const response = await axiosInstance.get(`/reviews/product/${id}`)
        setReviews(response?.data?.data || [])
      } catch {
        setReviews([])
        setReviewsError("Yorumlar yuklenemedi. Lutfen tekrar deneyin.")
      } finally {
        setIsReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [id])

  useEffect(() => {
    setQuantity(1)
    setSelectedImage(0)
  }, [product?._id])

  const stock = product?.stock || 0
  const gallery = useMemo(() => {
    const list = Array.isArray(product?.images) && product.images.length ? product.images : [""]
    return list.map((item) => getImageSource(item))
  }, [product?.images])
  const image = gallery[selectedImage] || FALLBACK_IMAGE
  const sortedReviews = useMemo(() => {
    const clone = [...reviews]
    if (reviewSort === "highest") return clone.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    if (reviewSort === "lowest") return clone.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    return clone.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [reviewSort, reviews])
  const ratingDistribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const item of reviews) {
      const key = Number(item.rating || 0)
      if (counts[key] !== undefined) counts[key] += 1
    }
    return counts
  }, [reviews])

  useEffect(() => {
    if (product?._id) {
      fetchRelatedProducts(product._id, 4)
    }
  }, [fetchRelatedProducts, product?._id])

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
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-500 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-nexora-primary">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-nexora-primary">
            Urunler
          </Link>
          {product?.category?.name && (
            <>
              <span>/</span>
              <span>{product.category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800">{product.name}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={image}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {gallery.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-lg border bg-slate-100 ${
                    selectedImage === index ? "border-nexora-primary" : "border-slate-200"
                  }`}
                >
                  <img src={item} alt={`${product.name} ${index + 1}`} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
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

            <p className="text-3xl font-bold text-nexora-primary">{formatCurrency(product.price)}</p>

            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Kategori:</span> {product?.category?.name || "Belirtilmedi"}
              </p>
              <p>
                <span className="font-semibold">Marka:</span> {product?.brand || "Nexora"}
              </p>
              <p>
                <span className="font-semibold">SKU:</span> {product?.sku || "N/A"}
              </p>
            </div>

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
            <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:grid-cols-3">
              <p>Guvenli odeme</p>
              <p>14 gun iade</p>
              <p>Hizli teslimat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Teknik Ozellikler</h2>
        {product?.specs?.length > 0 ? (
          <div className="mt-4 grid gap-2">
            {product.specs.map((spec, idx) => (
              <div key={`${spec.key}-${idx}`} className="grid grid-cols-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{spec.key}</span>
                <span className="text-slate-600">{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Bu urun icin henuz teknik ozellik bilgisi eklenmedi.</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Degerlendirmeler</h2>
          <select
            value={reviewSort}
            onChange={(event) => setReviewSort(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="newest">En yeni</option>
            <option value="highest">En yuksek puan</option>
            <option value="lowest">En dusuk puan</option>
          </select>
        </div>

        <div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star]
            const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={star} className="grid grid-cols-[28px_1fr_48px] items-center gap-2 text-xs">
                <span>{star}★</span>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-right text-slate-500">{count}</span>
              </div>
            )
          })}
        </div>

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
          {reviewsError && <p className="text-sm text-rose-600">{reviewsError}</p>}
          {isReviewsLoading && <div className="h-24 animate-pulse rounded-xl bg-slate-200" />}
          {!isReviewsLoading &&
            sortedReviews.map((review) => (
              <article key={review._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">
                    {[review?.user?.firstName, review?.user?.lastName].filter(Boolean).join(" ") ||
                      review?.user?.name ||
                      "Kullanici"}
                  </p>
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Benzer Urunler</h2>
          <Link to="/products" className="text-sm font-semibold text-nexora-primary hover:underline">
            Tumunu gor
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <Link
              key={item._id}
              to={`/products/${item._id}`}
              className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-nexora-primary/40"
            >
              <img
                src={getImageSource(item?.images?.[0])}
                alt={item.name}
                className="aspect-square w-full rounded-lg object-cover"
              />
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="mt-1 text-sm font-bold text-nexora-primary">{formatCurrency(item.price)}</p>
            </Link>
          ))}
          {!relatedProducts.length && <p className="text-sm text-slate-500">Benzer urun bulunamadi.</p>}
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
