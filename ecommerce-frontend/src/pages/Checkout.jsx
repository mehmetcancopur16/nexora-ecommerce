import { zodResolver } from "@hookform/resolvers/zod"
import { motion as Motion } from "framer-motion"
import { CreditCard, Landmark, Loader2, ShieldCheck, Truck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../api/axiosInstance"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { selectCartSubtotal } from "../store/cartSelectors"
import { checkoutSchema } from "../validations/checkout.validation"

const PAYMENT_METHODS = [
  { id: "mock_card", label: "Kredi / Banka Kartı (Test)", icon: CreditCard },
  { id: "bank_transfer", label: "Havale / EFT", icon: Landmark },
  { id: "cash_on_delivery", label: "Kapıda Ödeme", icon: Truck },
]

function Checkout() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const cart = useCartStore((state) => state.cart)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalAmount = useCartStore(selectCartSubtotal)
  const shippingFee = 0
  const taxAmount = totalAmount * 0.18
  const discountAmount = totalAmount > 1500 ? totalAmount * 0.05 : 0
  const payableAmount = Math.max(0, totalAmount + shippingFee + taxAmount - discountAmount)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
      country: "Türkiye",
      paymentMethod: "mock_card",
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  })
  const paymentMethod = watch("paymentMethod")

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
      const draftResponse = await axiosInstance.post("/orders/draft", {
        customer: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
        shippingAddress: {
          street: values.street,
          city: values.city,
          zip: values.zip,
          country: values.country,
        },
        paymentMethod: values.paymentMethod,
      })
      const orderId = draftResponse?.data?.data?._id
      if (!orderId) throw new Error("Sipariş taslağı oluşturulamadı.")

      setIsPaying(true)
      await new Promise((resolve) => setTimeout(resolve, 1300))
      await axiosInstance.post(`/orders/${orderId}/pay-mock`, {
        paymentMethod: values.paymentMethod,
        mockCard:
          values.paymentMethod === "mock_card"
            ? {
                holderName: values.cardHolderName,
                number: values.cardNumber,
                expiry: values.expiry,
                cvc: values.cvc,
              }
            : undefined,
      })
      clearCart()
      toast.success("Ödeme başarılı! Siparişiniz onaylandı.")
      navigate(`/order-success/${orderId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Ödeme işlemi tamamlanamadı.")
    } finally {
      setIsSubmitting(false)
      setIsPaying(false)
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
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-3xl font-semibold text-nexora-text">Güvenli Ödeme</h1>
        <p className="mt-2 text-sm text-slate-500">Teslimat, iletişim ve ödeme bilgilerinizi girerek siparişi tamamlayın.</p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">İletişim Bilgileri</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {["firstName", "lastName", "email", "phone"].map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    placeholder={
                      field === "firstName"
                        ? "Ad"
                        : field === "lastName"
                          ? "Soyad"
                          : field === "email"
                            ? "E-posta"
                            : "Telefon"
                    }
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                      errors[field] ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    }`}
                    {...register(field)}
                  />
                  {errors[field] && <p className="mt-1 text-xs text-rose-600">{errors[field]?.message}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Teslimat Adresi</h2>
            <div className="mt-3 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Mahalle, sokak, bina no"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                    errors.street ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  }`}
                  {...register("street")}
                />
                {errors.street && <p className="mt-1 text-xs text-rose-600">{errors.street.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {["city", "zip", "country"].map((field) => (
                  <div key={field}>
                    <input
                      type="text"
                      placeholder={field === "city" ? "Şehir" : field === "zip" ? "Posta kodu" : "Ülke"}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                        errors[field] ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      }`}
                      {...register(field)}
                    />
                    {errors[field] && <p className="mt-1 text-xs text-rose-600">{errors[field]?.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Ödeme Yöntemi</h2>
            <div className="mt-3 grid gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon
                const checked = paymentMethod === method.id
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition ${
                      checked ? "border-sky-400 bg-sky-50/70" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Icon className="size-4" aria-hidden />
                      {method.label}
                    </span>
                    <input type="radio" value={method.id} className="size-4" {...register("paymentMethod")} />
                  </label>
                )
              })}
            </div>

            {paymentMethod === "mock_card" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Kart sahibi"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                      errors.cardHolderName
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    }`}
                    {...register("cardHolderName")}
                  />
                  {errors.cardHolderName && <p className="mt-1 text-xs text-rose-600">{errors.cardHolderName.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Kart numarası (test: 4242424242424242)"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                      errors.cardNumber
                        ? "border-rose-400 ring-2 ring-rose-100"
                        : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    }`}
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-rose-600">{errors.cardNumber.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                      errors.expiry ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    }`}
                    {...register("expiry")}
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-rose-600">{errors.expiry.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="CVC"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                      errors.cvc ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    }`}
                    {...register("cvc")}
                  />
                  {errors.cvc && <p className="mt-1 text-xs text-rose-600">{errors.cvc.message}</p>}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isPaying}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting || isPaying ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {isPaying ? "Ödeme işleniyor..." : "Sipariş hazırlanıyor..."}
              </>
            ) : (
              "Ödeme Yap ve Siparişi Tamamla"
            )}
          </button>

          <p className="rounded-xl border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
            Test modu aktiftir. Kart verileri kaydedilmez, yalnızca ödeme simülasyonu yapılır.
          </p>
        </form>
      </Motion.div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-slate-800">Sipariş Özeti</h2>
        <p className="mt-3 text-sm text-slate-600">Toplam Ürün: {itemCount}</p>
        <p className="mt-1 text-sm text-slate-600">Ara Toplam: {totalAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">İndirim: -{discountAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">Vergi: {taxAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">Kargo: {shippingFee.toFixed(2)} TL</p>
        <div className="my-3 border-t border-slate-200" />
        <p className="text-base font-semibold text-slate-900">Genel Toplam: {payableAmount.toFixed(2)} TL</p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-700">
          <ShieldCheck className="size-4" aria-hidden />
          Siparişiniz SSL korumalı bağlantı ile işlenir.
        </p>
      </aside>
    </section>
  )
}

export default Checkout
