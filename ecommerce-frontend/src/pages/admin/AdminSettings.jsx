import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/admin/settings")
        setForm((prev) => ({ ...prev, ...(response?.data?.data || {}) }))
      } catch (error) {
        toast.error(error?.response?.data?.message || "Ayarlar yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      const response = await axiosInstance.patch("/admin/settings", {
        ...form,
        lowStockThreshold: Number(form.lowStockThreshold || 0),
      })
      setForm((prev) => ({ ...prev, ...(response?.data?.data || {}) }))
      toast.success("Ayarlar kaydedildi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Ayarlar kaydedilemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Magaza Ayarlari</h2>
      <form className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2" onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Magaza adi"
          value={form.storeName || ""}
          onChange={(event) => setForm((prev) => ({ ...prev, storeName: event.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
        />
        <input
          type="email"
          placeholder="Destek e-posta"
          value={form.supportEmail || ""}
          onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
        />
        <input
          type="text"
          placeholder="Destek telefon"
          value={form.supportPhone || ""}
          onChange={(event) => setForm((prev) => ({ ...prev, supportPhone: event.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
        />
        <input
          type="text"
          placeholder="Para birimi"
          value={form.currency || ""}
          onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
        />
        <input
          type="number"
          min="0"
          placeholder="Dusuk stok esigi"
          value={form.lowStockThreshold ?? 10}
          onChange={(event) => setForm((prev) => ({ ...prev, lowStockThreshold: event.target.value }))}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
        />
        <div className="flex flex-col justify-center gap-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.maintenanceMode)}
              onChange={(event) => setForm((prev) => ({ ...prev, maintenanceMode: event.target.checked }))}
            />
            Bakim modu
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.allowGuestCheckout)}
              onChange={(event) => setForm((prev) => ({ ...prev, allowGuestCheckout: event.target.checked }))}
            />
            Misafir odeme
          </label>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Kaydediliyor..." : "Ayarlari Kaydet"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AdminSettings
