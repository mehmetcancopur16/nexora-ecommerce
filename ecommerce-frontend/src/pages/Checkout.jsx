import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../api/axiosInstance"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { checkoutSchema } from "../validations/checkout.validation"

function Checkout() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const cart = useCartStore((state) => state.cart)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalAmount = useCartStore((state) => state.totalAmount)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      street: "",
      city: "",
      zip: "",
    },
  })

  const itemCount = useMemo(
    () => (cart?.items || []).reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
    [cart]
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch((error) => toast.error(error.message))
    }
  }, [isAuthenticated, fetchCart])

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post("/orders", {
        shippingAddress: values,
      })
      const orderId = response?.data?.data?._id
      clearCart()
      toast.success("Siparisiniz basariyla olusturuldu.")
      navigate(`/order-success/${orderId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Siparis olusturulamadi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Odeme icin giris yapmaniz gerekiyor.</h1>
        <Link
          to="/login"
          className="mt-4 inline-flex rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Giris Yap
        </Link>
      </section>
    )
  }

  if (!itemCount) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sepetiniz bos.</h1>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-xl bg-nexora-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Urunlere Don
        </Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-nexora-text">Odeme Bilgileri</h1>
        <p className="mt-2 text-sm text-slate-500">Teslimat adresinizi girerek siparisi tamamlayin.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="street" className="mb-1 block text-sm font-medium text-slate-700">
              Adres
            </label>
            <input
              id="street"
              type="text"
              placeholder="Mahalle, sokak, bina no"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                errors.street
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("street")}
            />
            {errors.street && <p className="mt-1 text-xs text-rose-600">{errors.street.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-slate-700">
                Sehir
              </label>
              <input
                id="city"
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  errors.city
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...register("city")}
              />
              {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="zip" className="mb-1 block text-sm font-medium text-slate-700">
                Posta Kodu
              </label>
              <input
                id="zip"
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  errors.zip
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...register("zip")}
              />
              {errors.zip && <p className="mt-1 text-xs text-rose-600">{errors.zip.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-nexora-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Siparis olusturuluyor..." : "Siparisi Tamamla"}
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Siparis Ozeti</h2>
        <p className="mt-3 text-sm text-slate-600">Toplam Urun: {itemCount}</p>
        <p className="mt-1 text-sm text-slate-600">Ara Toplam: {totalAmount.toFixed(2)} TL</p>
        <div className="my-3 border-t border-slate-200" />
        <p className="text-base font-semibold text-slate-900">Genel Toplam: {totalAmount.toFixed(2)} TL</p>
      </aside>
    </section>
  )
}

export default Checkout
