import { motion as Motion } from "framer-motion"
import { FolderTree, Loader2, RefreshCw, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const initialForm = { name: "", description: "" }

function AdminCategories() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: "" })
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchItems = async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/categories", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
        },
      })
      setItems(response?.data?.data || [])
      setPagination({
        total: response?.data?.pagination?.total || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kategoriler yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [filters.page, filters.limit, filters.search])

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
      await fetchItems({ silent: true })
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
      await fetchItems({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kategori silinemedi. Bu kategoriye bagli urunleri kontrol edin.")
    }
  }

  const stats = useMemo(() => {
    const totalProducts = items.reduce((sum, item) => sum + Number(item.totalProducts || 0), 0)
    const activeProducts = items.reduce((sum, item) => sum + Number(item.activeProducts || 0), 0)
    return { totalProducts, activeProducts, visibleCount: items.length }
  }, [items])

  return (
    <section className="space-y-5">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Kategori Yonetimi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Toplam {pagination.total} kategori, bu sayfada {stats.visibleCount} kayit goruntuleniyor.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchItems({ silent: true })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Yeni Kategori
            </button>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Urun</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.totalProducts}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Aktif urun</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.activeProducts}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Sayfa</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {filters.page}/{pagination.totalPages}
              </p>
            </div>
          </div>
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
      </Motion.div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Aciklama</th>
              <th className="px-4 py-3">Urun</th>
              <th className="px-4 py-3">Aktif urun</th>
              <th className="px-4 py-3">Islem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={5}>
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Yukleniyor...
                  </span>
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td className="px-4 py-8" colSpan={5}>
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                    <FolderTree className="size-7 text-slate-400" />
                    <p className="font-medium text-slate-700">Sonuc bulunamadi.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.description || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.totalProducts || 0}</td>
                  <td className="px-4 py-3 text-slate-700">{item.activeProducts || 0}</td>
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

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <span className="text-slate-500">
          Sayfa {filters.page} / {pagination.totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={filters.page <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Onceki
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={filters.page >= pagination.totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>
    </section>
  )
}

export default AdminCategories
