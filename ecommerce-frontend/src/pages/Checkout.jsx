import { zodResolver } from "@hookform/resolvers/zod"
import { motion as Motion } from "framer-motion"
import { CreditCard, Landmark, Loader2, MapPin, ShieldCheck, Truck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../api/axiosInstance"
import SearchableSelect from "../components/common/SearchableSelect"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { selectCartSubtotal } from "../store/cartSelectors"
import { getDistrictsForProvince, TURKEY_PROVINCES } from "../utils/turkiyeAddress"
import { checkoutSchema } from "../validations/checkout.validation"

const PROVINCE_NAMES = TURKEY_PROVINCES.map((p) => p.name).sort((a, b) => a.localeCompare(b, "tr-TR"))

const PAYMENT_METHODS = [
  { id: "mock_card", label: "Kredi / Banka Kartı (Test)", icon: CreditCard },
  { id: "bank_transfer", label: "Havale / EFT", icon: Landmark },
  { id: "cash_on_delivery", label: "Kapıda Ödeme", icon: Truck },
]

function Checkout() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [defaultsLoaded, setDefaultsLoaded] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
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
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      district: "",
      postalCode: "",
      openAddress: "",
      country: "Türkiye",
      paymentMethod: "mock_card",
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  })
  const paymentMethod = watch("paymentMethod")
  const cityValue = watch("city")

  const itemCount = useMemo(
    () => (cart?.items || []).reduce((sum, item) => sum + Number(item?.quantity || 0), 0),
    [cart]
  )

  const districtOptions = getDistrictsForProvince(cityValue)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch((error) => toast.error(error.message))
    }
  }, [isAuthenticated, fetchCart])

  useEffect(() => {
    if (!isAuthenticated || !user || defaultsLoaded) return
    const load = async () => {
      try {
        const [addrRes, pmRes] = await Promise.all([
          axiosInstance.get("/users/addresses"),
          axiosInstance.get("/payment-methods"),
        ])
        const addrs = addrRes?.data?.data || []
        const defAddr = addrs.find((a) => a.isDefault) || addrs[0]
        if (defAddr) {
          setValue("city", defAddr.city || "", { shouldValidate: true })
          setValue("district", defAddr.district || "", { shouldValidate: true })
          setValue("postalCode", defAddr.postalCode || defAddr.zip || "", { shouldValidate: true })
          setValue("openAddress", defAddr.openAddress || defAddr.street || "", { shouldValidate: true })
          setValue("country", defAddr.country || "Türkiye")
        }
        setValue("firstName", user.firstName || "", { shouldValidate: true })
        setValue("lastName", user.lastName || "", { shouldValidate: true })
        setValue("email", user.email || "", { shouldValidate: true })
        setValue("phone", user.phone || "", { shouldValidate: true })
        const pms = pmRes?.data?.data || []
        const defPm = pms.find((p) => p.isDefault) || pms[0]
        if (defPm) {
          setValue("cardHolderName", defPm.holderName || "", { shouldValidate: true })
          if (defPm.expiryMonth && defPm.expiryYear) {
            const m = String(defPm.expiryMonth).padStart(2, "0")
            const y = String(defPm.expiryYear).slice(-2)
            setValue("expiry", `${m}/${y}`, { shouldValidate: true })
          }
          setValue("cardNumber", "4242424242424242", { shouldValidate: true })
          setValue("cvc", "000", { shouldValidate: true })
        }
        setDefaultsLoaded(true)
      } catch {
        setDefaultsLoaded(true)
      }
    }
    load()
  }, [isAuthenticated, user, defaultsLoaded, setValue])

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
          city: values.city,
          district: values.district,
          postalCode: values.postalCode,
          openAddress: values.openAddress,
          country: values.country,
        },
        paymentMethod: values.paymentMethod,
      })
      const orderId = draftResponse?.data?.data?._id
      if (!orderId) throw new Error("Sipariş taslağı oluşturulamadı.")

      setIsPaying(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
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
        <h1 className="text-2xl font-semibold text-slate-800">Ödeme için giriş yapmanız gerekiyor.</h1>
        <Link
          to="/login"
          className="mt-4 inline-flex rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Giriş Yap
        </Link>
      </section>
    )
  }

  if (!itemCount) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Sepetiniz boş.</h1>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-xl bg-nexora-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Ürünlere Dön
        </Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xl shadow-slate-200/40"
      >
        <div className="flex items-center gap-2 text-nexora-primary">
          <MapPin className="size-5" />
          <span className="text-sm font-medium">Teslimat & ödeme</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-nexora-text">Güvenli ödeme</h1>
        <p className="mt-2 text-sm text-slate-500">
          Varsayılan kayıtlı adresiniz varsa aşağıya doldurulur; istediğiniz gibi değiştirebilirsiniz.
        </p>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner">
            <h2 className="text-sm font-semibold text-slate-900">İletişim</h2>
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

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner">
            <h2 className="text-sm font-semibold text-slate-900">Teslimat adresi</h2>
            <div className="mt-3 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      label="İl"
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v)
                        setValue("district", "")
                      }}
                      options={PROVINCE_NAMES}
                      placeholder="İl yazın (K ile başlayan iller...)"
                      error={errors.city?.message}
                    />
                  )}
                />
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      label="İlçe"
                      value={field.value}
                      onChange={field.onChange}
                      options={districtOptions}
                      disabled={!cityValue}
                      placeholder={cityValue ? "İlçe" : "Önce il seçin"}
                      error={errors.district?.message}
                    />
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-600">Posta kodu</label>
                  <input
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                      errors.postalCode ? "border-rose-400" : "border-slate-200"
                    }`}
                    {...register("postalCode")}
                  />
                  {errors.postalCode && <p className="mt-1 text-xs text-rose-600">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-600">Ülke</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                    {...register("country")}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-600">Açık adres</label>
                <textarea
                  rows={2}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                    errors.openAddress ? "border-rose-400" : "border-slate-200"
                  }`}
                  placeholder="Mahalle, sokak, bina, daire"
                  {...register("openAddress")}
                />
                {errors.openAddress && <p className="mt-1 text-xs text-rose-600">{errors.openAddress.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner">
            <h2 className="text-sm font-semibold text-slate-900">Ödeme yöntemi</h2>
            <div className="mt-3 grid gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon
                const checked = paymentMethod === method.id
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition ${
                      checked ? "border-sky-400 bg-sky-50/80" : "border-slate-200 hover:border-slate-300"
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
                      errors.cardHolderName ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400"
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
                      errors.cardNumber ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400"
                    }`}
                    {...register("cardNumber")}
                  />
                  {errors.cardNumber && <p className="mt-1 text-xs text-rose-600">{errors.cardNumber.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                      errors.expiry ? "border-rose-400" : "border-slate-200"
                    }`}
                    {...register("expiry")}
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-rose-600">{errors.expiry.message}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="CVC"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                      errors.cvc ? "border-rose-400" : "border-slate-200"
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
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200/50 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
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
            Test modu: kart verileri gerçek ödeme altyapısına gönderilmez.
          </p>
        </form>
      </Motion.div>

      <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-5 shadow-lg lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-slate-800">Sipariş özeti</h2>
        <p className="mt-3 text-sm text-slate-600">Toplam ürün: {itemCount}</p>
        <p className="mt-1 text-sm text-slate-600">Ara toplam: {totalAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">İndirim: -{discountAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">Vergi: {taxAmount.toFixed(2)} TL</p>
        <p className="mt-1 text-sm text-slate-600">Kargo: {shippingFee.toFixed(2)} TL</p>
        <div className="my-3 border-t border-slate-200" />
        <p className="text-base font-semibold text-slate-900">Genel toplam: {payableAmount.toFixed(2)} TL</p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-700">
          <ShieldCheck className="size-4" aria-hidden />
          Bağlantınız şifrelenir (demoda simülasyon).
        </p>
      </aside>
    </section>
  )
}

export default Checkout
