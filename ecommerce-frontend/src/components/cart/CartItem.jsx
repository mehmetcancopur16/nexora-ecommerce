import { motion as Motion } from "framer-motion"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { Link } from "react-router"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/200x200/e2e8f0/64748b?text=Nexora"
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  return `${API_BASE_URL}${imagePath}`
}

function CartItem({ item, disabled, isItemLoading, onIncrease, onDecrease, onRemove, onQuantityInput }) {
  const product = item?.product
  const quantity = Number(item?.quantity || 1)
  const stock = Number(product?.stock || 0)
  const itemTotal = Number(product?.price || 0) * quantity
  const isActive = product?.isActive !== false
  const showLowStock = isActive && stock > 0 && stock <= 5

  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24 }}
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        isActive ? "border-slate-200/90 hover:border-sky-200/80 hover:shadow-md" : "border-rose-300/80 ring-1 ring-rose-100"
      }`}
    >
      {!isActive ? (
        <div className="flex items-center gap-2 border-b border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          Bu ürün artık satışta değil; ödeme için sepetten kaldırın.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 p-4 sm:flex-row">
      <Link to={`/products/${product?._id}`} className="shrink-0 sm:mt-0">
        <img
          src={getImageSource(product?.images?.[0])}
          alt={product?.name || "Ürün"}
          className="h-28 w-full rounded-xl object-cover transition hover:opacity-95 sm:h-24 sm:w-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <Link
            to={`/products/${product?._id}`}
            className="line-clamp-2 text-base font-semibold text-slate-800 transition hover:text-nexora-primary"
          >
            {product?.name}
          </Link>
          <p className="mt-1 text-sm text-slate-500">{Number(product?.price || 0).toFixed(2)} TL / adet</p>
          {showLowStock ? (
            <p className="mt-1 text-xs font-medium text-amber-700">Stokta son {stock} adet</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled || isItemLoading || quantity <= 1}
              onClick={onDecrease}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              max={stock || 1}
              disabled={disabled || isItemLoading || !isActive}
              onChange={(event) => onQuantityInput(Number(event.target.value))}
              className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-sm font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <button
              type="button"
              disabled={disabled || isItemLoading || !isActive || quantity >= stock}
              onClick={onIncrease}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-900">{itemTotal.toFixed(2)} TL</p>
            <button
              type="button"
              disabled={disabled || isItemLoading}
              onClick={onRemove}
              className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 transition hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" aria-hidden />
              Kaldır
            </button>
            {isItemLoading ? <Loader2 className="size-4 animate-spin text-sky-600" aria-hidden /> : null}
          </div>
        </div>
      </div>
      </div>
    </Motion.article>
  )
}

export default CartItem
