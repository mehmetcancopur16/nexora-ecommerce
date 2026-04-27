import { motion as Motion } from "framer-motion"
import { CheckCircle2, Eye, EyeOff, RefreshCw, Search, Trash2, XCircle } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function AdminReviews() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [filters, setFilters] = useState({ search: "", status: "all", limit: 10 })
  const [rowLoadingId, setRowLoadingId] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const fetchItems = useCallback(async ({ page = pagination.page, silent = false } = {}) => {
    if (!silent) setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get("/admin/reviews", {
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
      const message = error?.response?.data?.message || "Yorumlar yuklenemedi."
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

  const updateModeration = async (id, payload) => {
    setRowLoadingId(id)
    try {
      await axiosInstance.patch(`/admin/reviews/${id}`, payload)
      toast.success("Yorum guncellendi.")
      await fetchItems({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Yorum guncellenemedi.")
    } finally {
      setRowLoadingId(null)
    }
  }

  const deleteReview = async (id) => {
    setRowLoadingId(id)
    try {
      await axiosInstance.delete(`/admin/reviews/${id}`)
      toast.success("Yorum silindi.")
      setDeleteCandidate(null)
      await fetchItems({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Yorum silinemedi.")
    } finally {
      setRowLoadingId(null)
    }
  }

  const isPageLoading = isLoading && isFirstLoad
  const canGoPrev = pagination.page > 1
  const canGoNext = pagination.page < pagination.totalPages
  const resultText = useMemo(() => {
    if (!pagination.total) return "Sonuc bulunamadi"
    const start = (pagination.page - 1) * pagination.limit + 1
    const end = Math.min(pagination.page * pagination.limit, pagination.total)
    return `${start}-${end} / ${pagination.total} sonuc`
  }, [pagination])

  return (
    <section className="space-y-4">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Yorum Moderasyonu</h2>
            <p className="mt-1 text-sm text-slate-200">Arama, filtreleme ve tek tikla moderasyon islemleri.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchItems({ page: pagination.page })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
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
              placeholder="Urun veya yorum ara..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400"
            />
          </label>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
          >
            <option value="all">Tum Durumlar</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="hidden">Hidden</option>
          </select>
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

      {error && !isPageLoading && (
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
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm transition">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Urun</th>
              <th className="px-4 py-3">Kullanici</th>
              <th className="px-4 py-3">Puan</th>
              <th className="px-4 py-3">Yorum</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Islem</th>
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
                  Filtrelere uygun yorum bulunamadi.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{item?.product?.name || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {[item?.user?.firstName, item?.user?.lastName].filter(Boolean).join(" ") || item?.user?.email || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.rating}/5</td>
                  <td className="max-w-sm px-4 py-3 text-slate-600">{item.comment || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.isHidden || item.moderationStatus === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.isHidden ? "Hidden" : item.moderationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={rowLoadingId === item._id}
                        onClick={() => updateModeration(item._id, { moderationStatus: "approved", isHidden: false })}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Onayla
                      </button>
                      <button
                        type="button"
                        disabled={rowLoadingId === item._id}
                        onClick={() => updateModeration(item._id, { moderationStatus: "rejected", isHidden: true })}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle className="size-3.5" />
                        Reddet
                      </button>
                      <button
                        type="button"
                        disabled={rowLoadingId === item._id}
                        onClick={() => updateModeration(item._id, { isHidden: !item.isHidden })}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {item.isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        Gizle/Goster
                      </button>
                      <button
                        type="button"
                        disabled={rowLoadingId === item._id}
                        onClick={() => setDeleteCandidate(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="size-3.5" />
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
        <p className="text-slate-600">{resultText}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canGoPrev}
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
            disabled={!canGoNext}
            onClick={() => fetchItems({ page: pagination.page + 1 })}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
          <Motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">Yorumu silmek istiyor musun?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Bu islem geri alinamaz. Urun: <span className="font-medium">{deleteCandidate?.product?.name || "-"}</span>
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Vazgec
              </button>
              <button
                type="button"
                onClick={() => deleteReview(deleteCandidate._id)}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Evet, sil
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </section>
  )
}

export default AdminReviews
