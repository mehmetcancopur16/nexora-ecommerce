import { motion as Motion } from "framer-motion"
import { AlertTriangle, Building2, CheckCircle2, RefreshCw, Save, Settings2, ShieldAlert } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const currencyOptions = ["TRY", "USD", "EUR", "GBP"]

const initialForm = {
  storeName: "",
  supportEmail: "",
  supportPhone: "",
  currency: "TRY",
  maintenanceMode: false,
  allowGuestCheckout: true,
  lowStockThreshold: 10,
}

function AdminSettings() {
  const [form, setForm] = useState(initialForm)
  const [savedForm, setSavedForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(null)

  const fetchData = useCallback(async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get("/admin/settings")
      const next = { ...initialForm, ...(response?.data?.data || {}) }
      setForm(next)
      setSavedForm(next)
      if (response?.data?.data?.updatedAt) {
        setLastSavedAt(response.data.data.updatedAt)
      }
    } catch (fetchError) {
      const message = fetchError?.response?.data?.message || "Ayarlar yuklenemedi."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setIsFirstLoad(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm), [form, savedForm])

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      const response = await axiosInstance.patch("/admin/settings", {
        ...form,
        lowStockThreshold: Number(form.lowStockThreshold ?? 0),
      })
      const next = { ...initialForm, ...(response?.data?.data || {}) }
      setForm(next)
      setSavedForm(next)
      setLastSavedAt(new Date().toISOString())
      toast.success("Ayarlar kaydedildi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Ayarlar kaydedilemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading && isFirstLoad) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
  }

  return (
    <section className="space-y-4">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-5 py-5 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <Settings2 className="size-5" />
              Magaza Ayarlari
            </h2>
            <p className="mt-1 text-sm text-slate-200">Genel magaza, destek ve sistem davranisi ayarlari.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchData({ silent: true })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
      </Motion.div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => fetchData()}
            className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
          >
            Tekrar dene
          </button>
        </div>
      ) : null}

      <form className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2" onSubmit={handleSave}>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Magaza adi</label>
          <input
            type="text"
            value={form.storeName || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, storeName: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Para birimi</label>
          <select
            value={form.currency || "TRY"}
            onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Destek e-posta</label>
          <input
            type="email"
            value={form.supportEmail || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Destek telefon</label>
          <input
            type="text"
            value={form.supportPhone || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, supportPhone: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dusuk stok esigi</label>
          <input
            type="number"
            min="0"
            value={form.lowStockThreshold ?? 10}
            onChange={(event) => setForm((prev) => ({ ...prev, lowStockThreshold: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-400"
          />
          <p className="text-xs text-slate-500">Dashboard kritik stok listesi bu esige gore olusturulur.</p>
        </div>
        <div className="flex flex-col justify-center gap-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-50">
            <input
              type="checkbox"
              checked={Boolean(form.maintenanceMode)}
              onChange={(event) => setForm((prev) => ({ ...prev, maintenanceMode: event.target.checked }))}
            />
            <span className="inline-flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-amber-500" />
              Bakim modu
            </span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-50">
            <input
              type="checkbox"
              checked={Boolean(form.allowGuestCheckout)}
              onChange={(event) => setForm((prev) => ({ ...prev, allowGuestCheckout: event.target.checked }))}
            />
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4 text-sky-500" />
              Misafir odeme
            </span>
          </label>
        </div>
        {form.maintenanceMode ? (
          <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <p className="inline-flex items-center gap-1.5">
              <AlertTriangle className="size-4" />
              Bakim modu aktifse kullanicilar satis akisinda kisitla karsilasabilir.
            </p>
          </div>
        ) : null}
        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {lastSavedAt ? `Son kayit: ${new Date(lastSavedAt).toLocaleString("tr-TR")}` : "Henuz kayit bilgisi yok"}
            {isDirty ? <span className="ml-2 font-semibold text-amber-600">Kaydedilmemis degisiklik var</span> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setForm(savedForm)}
              disabled={!isDirty || isSaving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Geri al
            </button>
            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Kaydediliyor..." : "Ayarlari Kaydet"}
            </button>
          </div>
        </div>
      </form>
      {!isDirty && !isSaving ? (
        <p className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="size-4" />
          Ayarlar guncel.
        </p>
      ) : null}
    </section>
  )
}

export default AdminSettings
