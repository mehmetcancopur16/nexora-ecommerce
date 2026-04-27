import { motion as Motion } from "framer-motion"
import { Clock3, Filter, RefreshCw, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const statusOptions = ["open", "in_progress", "resolved"]

function AdminSupportInbox() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [error, setError] = useState(null)
  const [rowLoadingId, setRowLoadingId] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [filters, setFilters] = useState({ search: "", status: "all", limit: 10 })

  const fetchItems = useCallback(async ({ page = pagination.page, silent = false } = {}) => {
    if (!silent) setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get("/admin/support-messages", {
        params: {
          page,
          limit: filters.limit,
          search: filters.search || undefined,
          status: filters.status === "all" ? undefined : filters.status,
        },
      })
      setItems(response?.data?.data || [])
      setPagination(response?.data?.pagination || { page: 1, limit: filters.limit, total: 0, totalPages: 1 })
    } catch (error) {
      const message = error?.response?.data?.message || "Destek mesajlari yuklenemedi."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsFirstLoad(false)
    }
  }, [filters.limit, filters.search, filters.status, pagination.page])

  useEffect(() => {
    fetchItems({ page: 1 })
  }, [fetchItems])

  const updateStatus = async (id, adminStatus) => {
    setRowLoadingId(id)
    try {
      await axiosInstance.patch(`/admin/support-messages/${id}`, { adminStatus })
      toast.success("Mesaj durumu guncellendi.")
      await fetchItems({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Mesaj durumu guncellenemedi.")
    } finally {
      setRowLoadingId(null)
    }
  }

  const isPageLoading = isLoading && isFirstLoad
  const resultText = useMemo(() => {
    if (!pagination.total) return "Sonuc bulunamadi"
    const start = (pagination.page - 1) * pagination.limit + 1
    const end = Math.min(pagination.page * pagination.limit, pagination.total)
    return `${start}-${end} / ${pagination.total} mesaj`
  }, [pagination])

  return (
    <section className="space-y-4">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 px-5 py-5 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Destek Mesaj Kutusu</h2>
            <p className="mt-1 text-sm text-slate-200">Mesajlari filtrele, statu guncelle ve cozum akislarini takip et.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchItems({ page: pagination.page })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
      </Motion.div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Ad, e-posta, konu veya mesaj ara..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400"
            />
          </label>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400"
            >
              <option value="all">Tum durumlar</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filters.limit}
            onChange={(event) => setFilters((prev) => ({ ...prev, limit: Number(event.target.value) }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
          >
            <option value={10}>10 / sayfa</option>
            <option value={20}>20 / sayfa</option>
            <option value={50}>50 / sayfa</option>
          </select>
        </div>
      </div>

      {error && !isPageLoading ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => fetchItems({ page: pagination.page })}
            className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
          >
            Tekrar dene
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Gonderen</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Konu</th>
              <th className="px-4 py-3">Mesaj</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih / Cozum</th>
            </tr>
          </thead>
          <tbody>
            {isPageLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Yukleniyor...
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                  Filtrelere uygun destek mesaji bulunamadi.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.category}</td>
                  <td className="px-4 py-3 text-slate-700">{item.subject || "-"}</td>
                  <td className="max-w-md px-4 py-3 text-slate-600">{item.message}</td>
                  <td className="px-4 py-3">
                    <select
                      value={item.adminStatus || "open"}
                      onChange={(event) => updateStatus(item._id, event.target.value)}
                      disabled={rowLoadingId === item._id}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none transition focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <p>{new Date(item.createdAt).toLocaleString("tr-TR")}</p>
                    {item.resolvedAt ? (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
                        <Clock3 className="size-3.5" />
                        Cozuldu: {new Date(item.resolvedAt).toLocaleString("tr-TR")}
                      </p>
                    ) : null}
                    {item.resolvedBy?.email ? <p className="text-xs text-slate-500">Yetkili: {item.resolvedBy.email}</p> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
        <p className="text-slate-600">{resultText}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => fetchItems({ page: pagination.page - 1 })}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Onceki
          </button>
          <span className="text-slate-500">
            Sayfa {pagination.page}/{pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchItems({ page: pagination.page + 1 })}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>
    </section>
  )
}

export default AdminSupportInbox
