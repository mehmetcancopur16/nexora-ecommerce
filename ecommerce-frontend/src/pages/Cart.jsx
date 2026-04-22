import { AnimatePresence, motion as Motion } from "framer-motion"
import { ArrowRight, Lock, Percent, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react"
import { useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import CartItem from "../components/cart/CartItem"
import { FREE_SHIPPING_THRESHOLD_TL } from "../constants/shipping"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { selectCartSubtotal } from "../store/cartSelectors"

const SHIPPING_FEE = 0
const TAX_RATE = 0.18
const DISCOUNT_RATE = 0.05

function CartItemSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
      <div className="h-28 w-full rounded-xl bg-slate-200 sm:h-24 sm:w-24" />
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/4 rounded bg-slate-200" />
        </div>
        <div className="flex justify-between">
          <div className="h-9 w-28 rounded-lg bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

function Cart() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const cart = useCartStore((state) => state.cart)
  const isLoading = useCartStore((state) => state.isLoading)
  const error = useCartStore((state) => state.error)
  const itemLoadingMap = useCartStore((state) => state.itemLoadingMap)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const totalAmount = useCartStore(selectCartSubtotal)

  const items = useMemo(() => cart?.items || [], [cart?.items])
  const grandTotal = totalAmount + SHIPPING_FEE
  const estimatedTax = totalAmount * TAX_RATE
  const campaignDiscount = totalAmount > 1500 ? totalAmount * DISCOUNT_RATE : 0
  const payableTotal = Math.max(0, grandTotal + estimatedTax - campaignDiscount)

  const hasInactiveProduct = useMemo(
    () => items.some((line) => line?.product && line.product.isActive === false),
    [items]
  )

  const freeShippingProgress = useMemo(() => {
    if (totalAmount <= 0) return 0
    return Math.min(100, (totalAmount / FREE_SHIPPING_THRESHOLD_TL) * 100)
  }, [totalAmount])

  const amountUntilFreeShipping = useMemo(
    () => Math.max(0, FREE_SHIPPING_THRESHOLD_TL - totalAmount),
    [totalAmount]
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch((fetchError) => toast.error(fetchError.message))
    }
  }, [isAuthenticated, fetchCart])

  const handleQuantityChange = async (productId, quantity) => {
    if (!Number.isFinite(quantity) || quantity < 1) return
    try {
      await updateQuantity({ productId, quantity })
    } catch (updateError) {
      toast.error(updateError.message)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId)
      toast.success("Ürün sepetten kaldırıldı.")
    } catch (removeError) {
      toast.error(removeError.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/30 px-6 py-14 text-center shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky-200/35 blur-3xl" />
        <Lock className="mx-auto size-12 text-nexora-primary" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Sepetinizi görmek için giriş yapın</h1>
        <p className="mt-2 text-sm text-slate-600">Sepetiniz hesabınıza bağlıdır; güvenli alışveriş için oturum açın.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-nexora-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600"
        >
          Giriş yap
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-10"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-sky-200/40 blur-3xl" />
        <nav className="relative text-xs font-medium text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-nexora-primary" to="/">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden className="text-slate-300">
              /
            </li>
            <li className="text-nexora-text">Sepet</li>
          </ol>
        </nav>
        <div className="relative mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
              <Sparkles className="size-3.5" aria-hidden />
              Sepetim
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="nexora-gradient-text">Alışveriş özetiniz</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Miktarları güncelleyin, ürünleri kaldırın ve güvenle ödemeye geçin.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-nexora-text shadow-sm transition hover:border-nexora-primary/50 hover:bg-sky-50/80"
          >
            <ShoppingBag className="size-4" aria-hidden />
            Alışverişe devam
          </Link>
        </div>
      </Motion.div>

      {error ? (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      {hasInactiveProduct ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
        >
          <Truck className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
          <p>
            Sepetinizde satışta olmayan ürün var. Ödeme yapabilmek için bu ürünleri kaldırın veya miktarını güncelleyin.
          </p>
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-6 py-16 text-center shadow-inner">
          <ShoppingBag className="mx-auto size-14 text-slate-300" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold text-slate-800">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-slate-500">Beğendiğiniz ürünleri ekleyerek alışverişe başlayın.</p>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-xl bg-nexora-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600"
          >
            Ürünlere göz at
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-4">
            {isLoading ? (
              <>
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartItem
                    key={item?.product?._id}
                    item={item}
                    disabled={isLoading}
                    isItemLoading={Boolean(itemLoadingMap?.[item?.product?._id])}
                    onDecrease={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                    onIncrease={() =>
                      handleQuantityChange(
                        item.product._id,
                        Math.min(item.product.stock, item.quantity + 1)
                      )
                    }
                    onQuantityInput={(nextQuantity) =>
                      handleQuantityChange(
                        item.product._id,
                        Math.min(item.product.stock, Math.max(1, nextQuantity || 1))
                      )
                    }
                    onRemove={() => handleRemove(item.product._id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          <aside className="nexora-glass h-fit rounded-2xl border border-white/70 p-6 shadow-xl lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-nexora-text">Sipariş özeti</h2>

            {totalAmount > 0 && totalAmount < FREE_SHIPPING_THRESHOLD_TL ? (
              <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-3">
                <div className="flex items-center gap-2 text-xs font-medium text-sky-900">
                  <Truck className="size-4 shrink-0" aria-hidden />
                  Ücretsiz kargo için {amountUntilFreeShipping.toFixed(2)} TL kaldı
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-sky-200/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-nexora-primary to-sky-400 transition-all"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-sky-800/90">
                  {FREE_SHIPPING_THRESHOLD_TL} TL ve üzeri siparişlerde kampanyalı ücretsiz kargo (bilgilendirme).
                </p>
              </div>
            ) : null}

            {totalAmount >= FREE_SHIPPING_THRESHOLD_TL ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/90 px-3 py-2 text-xs font-medium text-emerald-900">
                <Truck className="size-4" aria-hidden />
                Bu sepet tutarıyla ücretsiz kargo koşuluna uydunuz.
              </p>
            ) : null}

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Ara toplam</span>
                <span className="font-medium text-slate-900">{totalAmount.toFixed(2)} TL</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Percent className="size-3.5" aria-hidden />
                  Kampanya indirimi
                </span>
                <span className="font-medium text-emerald-700">-{campaignDiscount.toFixed(2)} TL</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Kargo</span>
                <span className="font-medium text-slate-900">{SHIPPING_FEE.toFixed(2)} TL</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tahmini vergi</span>
                <span className="font-medium text-slate-900">{estimatedTax.toFixed(2)} TL</span>
              </div>
              <div className="my-3 border-t border-slate-200/80" />
              <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Genel toplam</span>
                <Motion.span key={payableTotal} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>
                  {payableTotal.toFixed(2)} TL
                </Motion.span>
              </div>
            </div>

            <button
              type="button"
              disabled={!items.length || isLoading || hasInactiveProduct}
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              Ödemeye geç
              <ArrowRight className="size-4" aria-hidden />
            </button>
            {hasInactiveProduct ? (
              <p className="mt-2 text-center text-xs text-rose-600">Pasif ürünleri kaldırmadan ödeme yapılamaz.</p>
            ) : null}

            <p className="mt-4 text-center text-xs text-slate-500">
              <ShieldCheck className="mr-1 inline size-3.5 text-emerald-600" aria-hidden />
              Ödeme ve teslimat için{" "}
              <Link className="font-medium text-nexora-primary hover:underline" to="/destek">
                destek
              </Link>{" "}
              sayfamıza göz atabilirsiniz.
            </p>
          </aside>
        </div>
      )}

      {items.length ? (
        <div className="fixed inset-x-0 bottom-3 z-40 px-4 lg:hidden">
          <div className="mx-auto flex max-w-2xl items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur">
            <div>
              <p className="text-xs text-slate-500">Ödenecek Tutar</p>
              <p className="text-base font-bold text-slate-900">{payableTotal.toFixed(2)} TL</p>
            </div>
            <button
              type="button"
              disabled={!items.length || isLoading || hasInactiveProduct}
              onClick={() => navigate("/checkout")}
              className="rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Ödemeye Geç
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Cart
