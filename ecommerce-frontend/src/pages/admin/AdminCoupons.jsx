import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  usageLimit: "100",
  isActive: true,
}

function AdminCoupons() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/coupons", { params: { page: 1, limit: 100 } })
      setItems(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kuponlar yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      code: item.code || "",
      description: item.description || "",
      discountType: item.discountType || "percentage",
      discountValue: String(item.discountValue ?? ""),
      minOrderAmount: String(item.minOrderAmount ?? ""),
      usageLimit: String(item.usageLimit ?? "100"),
      isActive: Boolean(item.isActive),
    })
  }

  const makePayload = () => ({
    code: form.code.trim().toUpperCase(),
    description: form.description,
    discountType: form.discountType,
    discountValue: Number(form.discountValue || 0),
    minOrderAmount: Number(form.minOrderAmount || 0),
    usageLimit: Number(form.usageLimit || 100),
    isActive: Boolean(form.isActive),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      const payload = makePayload()
      if (editing?._id) {
        await axiosInstance.patch(`/admin/coupons/${editing._id}`, payload)
        toast.success("Kupon guncellendi.")
      } else {
        await axiosInstance.post("/admin/coupons", payload)
        toast.success("Kupon olusturuldu.")
      }
      setForm(initialForm)
      setEditing(null)
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kupon kaydedilemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/coupons/${id}`)
      toast.success("Kupon silindi.")
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kupon silinemedi.")
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Kupon Yonetimi</h2>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Yeni Kupon
          </button>
        </div>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kod"
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            required
          />
          <input
            type="text"
            placeholder="Aciklama"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <select
            value={form.discountType}
            onChange={(event) => setForm((prev) => ({ ...prev, discountType: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          >
            <option value="percentage">Yuzde</option>
            <option value="fixed">Sabit tutar</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Indirim degeri"
            value={form.discountValue}
            onChange={(event) => setForm((prev) => ({ ...prev, discountValue: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Min siparis"
            value={form.minOrderAmount}
            onChange={(event) => setForm((prev) => ({ ...prev, minOrderAmount: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="number"
            min="1"
            placeholder="Kullanim limiti"
            value={form.usageLimit}
            onChange={(event) => setForm((prev) => ({ ...prev, usageLimit: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Aktif kupon
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Kaydediliyor..." : editing ? "Guncelle" : "Ekle"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Deger</th>
              <th className="px-4 py-3">Kullanim</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Islem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Yukleniyor...
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.code}</td>
                  <td className="px-4 py-3 text-slate-700">{item.discountType}</td>
                  <td className="px-4 py-3 text-slate-700">{item.discountValue}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {item.usedCount}/{item.usageLimit}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Duzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminCoupons
