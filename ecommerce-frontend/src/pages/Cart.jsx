import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import CartItem from "../components/cart/CartItem"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"

const SHIPPING_FEE = 0

function Cart() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const cart = useCartStore((state) => state.cart)
  const isLoading = useCartStore((state) => state.isLoading)
  const error = useCartStore((state) => state.error)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalAmount = useCartStore((state) => state.totalAmount)

  const items = cart?.items || []
  const grandTotal = totalAmount + SHIPPING_FEE

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch((fetchError) => toast.error(fetchError.message))
    }
  }, [isAuthenticated, fetchCart])

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateQuantity({ productId, quantity })
    } catch (updateError) {
      toast.error(updateError.message)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId)
      toast.success("Urun sepetten kaldirildi.")
    } catch (removeError) {
      toast.error(removeError.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sepetinizi gormek icin giris yapin.</h1>
        <Link
          to="/login"
          className="mt-4 inline-flex rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Giris Yap
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-nexora-text">Sepetim</h1>
        <p className="mt-2 text-sm text-slate-500">Sepetinizdeki urunleri duzenleyip odemeye gecebilirsiniz.</p>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {!isLoading && items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-800">Sepetiniz bos</h2>
          <p className="mt-2 text-sm text-slate-500">Favori urunlerinizi ekleyerek alisverise baslayin.</p>
          <Link
            to="/products"
            className="mt-5 inline-flex rounded-xl bg-nexora-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
          >
            Alisverise Basla
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {isLoading &&
              Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            {!isLoading &&
              items.map((item) => (
                <CartItem
                  key={item?.product?._id}
                  item={item}
                  disabled={isLoading}
                  onDecrease={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                  onIncrease={() =>
                    handleQuantityChange(item.product._id, Math.min(item.product.stock, item.quantity + 1))
                  }
                  onRemove={() => handleRemove(item.product._id)}
                />
              ))}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Siparis Ozeti</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Ara Toplam</span>
                <span>{totalAmount.toFixed(2)} TL</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Kargo</span>
                <span>{SHIPPING_FEE.toFixed(2)} TL</span>
              </div>
              <div className="my-2 border-t border-slate-200" />
              <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Genel Toplam</span>
                <span>{grandTotal.toFixed(2)} TL</span>
              </div>
            </div>

            <button
              type="button"
              disabled={!items.length || isLoading}
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full rounded-xl bg-nexora-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Odemeye Gec
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart
