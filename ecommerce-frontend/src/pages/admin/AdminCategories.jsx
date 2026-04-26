import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const initialForm = { name: "", description: "" }

function AdminCategories() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/categories")
      setItems(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kategoriler yuklenemedi.")
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
      name: item.name || "",
      description: item.description || "",
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      if (editing?._id) {
        await axiosInstance.patch(`/admin/categories/${editing._id}`, form)
        toast.success("Kategori guncellendi.")
      } else {
        await axiosInstance.post("/admin/categories", form)
        toast.success("Kategori eklendi.")
      }
      setForm(initialForm)
      setEditing(null)
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kategori kaydedilemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/categories/${id}`)
      toast.success("Kategori silindi.")
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kategori silinemedi.")
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Kategori Yonetimi</h2>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Yeni Kategori
          </button>
        </div>
        <form className="grid gap-3 md:grid-cols-[1fr_2fr_auto]" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kategori adi"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
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
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Aciklama</th>
              <th className="px-4 py-3">Islem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={3}>
                  Yukleniyor...
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.description || "-"}</td>
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

export default AdminCategories
