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

function CartItem({ item, disabled, onIncrease, onDecrease, onRemove }) {
  const product = item?.product
  const quantity = Number(item?.quantity || 1)
  const stock = Number(product?.stock || 0)
  const itemTotal = Number(product?.price || 0) * quantity

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
      <img
        src={getImageSource(product?.images?.[0])}
        alt={product?.name || "Urun"}
        className="h-24 w-24 rounded-xl object-cover"
      />

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-800">{product?.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{Number(product?.price || 0).toFixed(2)} TL</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled || quantity <= 1}
              onClick={onDecrease}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-slate-800">{quantity}</span>
            <button
              type="button"
              disabled={disabled || quantity >= stock}
              onClick={onIncrease}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-800">{itemTotal.toFixed(2)} TL</p>
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              className="text-sm font-medium text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Kaldir
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default CartItem
