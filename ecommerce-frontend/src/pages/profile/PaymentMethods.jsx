import { motion as Motion } from "framer-motion"
import { CreditCard, Plus, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const currentYear = new Date().getFullYear()

function PaymentMethods() {
  const [methods, setMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    holderName: "",
    last4: "",
    expiryMonth: 12,
    expiryYear: currentYear + 1,
    cvc: "",
  })
  const [saving, setSaving] = useState(false)

  const fetchMethods = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/payment-methods")
      setMethods(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Ödeme yöntemleri yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMethods()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!/^\d{4}$/.test(form.last4)) {
      toast.error("Son 4 hane 4 rakam olmalıdır.")
      return
    }
    if (form.cvc && !/^\d{3,4}$/.test(form.cvc)) {
      toast.error("CVC 3 veya 4 hane olmalıdır.")
      return
    }
    setSaving(true)
    try {
      const tokenRef = `card-${form.last4}-${Date.now()}`
      await axiosInstance.post("/payment-methods", {
        methodType: "card",
        holderName: form.holderName.trim(),
        brand: "VISA",
        last4: form.last4,
        expiryMonth: Number(form.expiryMonth),
        expiryYear: Number(form.expiryYear),
        tokenRef,
      })
      setForm({
        holderName: "",
        last4: "",
        expiryMonth: 12,
        expiryYear: currentYear + 1,
        cvc: "",
      })
      await fetchMethods()
      toast.success("Kart kaydedildi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kart eklenemedi.")
    } finally {
      setSaving(false)
    }
  }

  const setDefault = async (id) => {
    try {
      await axiosInstance.patch(`/payment-methods/${id}/default`)
      await fetchMethods()
      toast.success("Varsayılan ödeme yöntemi güncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Güncellenemedi.")
    }
  }

  const remove = async (id) => {
    try {
      await axiosInstance.delete(`/payment-methods/${id}`)
      await fetchMethods()
      toast.success("Kart kaldırıldı.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Silinemedi.")
    }
  }

  return (
    <div className="space-y-8">
      <Motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-slate-900/[0.03] via-white to-sky-50/50 p-6 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-nexora-primary/10 text-nexora-primary">
            <CreditCard className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-nexora-text">Ödeme yöntemleri</h1>
            <p className="mt-1 text-sm text-slate-600">Kart sahibi, son kullanma ve son 4 hane. Test ortamı için CVC sadece formda tutulur.</p>
          </div>
        </div>
      </Motion.header>

      <Motion.form
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleCreate}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md"
      >
        <h2 className="text-lg font-semibold text-slate-900">Yeni kart</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Kart sahibi</label>
            <input
              required
              value={form.holderName}
              onChange={(e) => setForm((p) => ({ ...p, holderName: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              placeholder="Ad Soyad"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Son 4 hane</label>
            <input
              required
              maxLength={4}
              value={form.last4}
              onChange={(e) => setForm((p) => ({ ...p, last4: e.target.value.replace(/\D/g, "") }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm tracking-widest"
              placeholder="4242"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">CVC (yalnızca doğrulama, kayıt yok)</label>
            <input
              value={form.cvc}
              onChange={(e) => setForm((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, "") }))}
              maxLength={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              placeholder="123"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Son kullanma (ay)</label>
            <select
              value={form.expiryMonth}
              onChange={(e) => setForm((p) => ({ ...p, expiryMonth: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Son kullanma (yıl)</label>
            <select
              value={form.expiryYear}
              onChange={(e) => setForm((p) => ({ ...p, expiryYear: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => currentYear + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {saving ? "Kaydediliyor..." : "Kartı ekle"}
        </button>
      </Motion.form>

      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200/80" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200/80" />
          </>
        ) : (
          methods.map((method) => (
            <Motion.article
              key={method._id}
              layout
              className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xl"
            >
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="text-xs uppercase tracking-widest text-white/60">Kart</p>
                <p className="mt-2 text-lg font-semibold">
                  {method.brand} •••• {method.last4}
                </p>
                <p className="mt-1 text-sm text-white/90">{method.holderName}</p>
                <p className="mt-3 text-xs text-white/60">
                  {String(method.expiryMonth).padStart(2, "0")} / {method.expiryYear}
                </p>
                {method.isDefault ? (
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                    <Star className="size-3" />
                    Varsayılan
                  </span>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {!method.isDefault ? (
                    <button
                      type="button"
                      onClick={() => setDefault(method._id)}
                      className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold"
                    >
                      Varsayılan yap
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => remove(method._id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-300/50 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100"
                  >
                    <Trash2 className="size-3.5" />
                    Kaldır
                  </button>
                </div>
              </div>
            </Motion.article>
          ))
        )}
      </div>
    </div>
  )
}

export default PaymentMethods
