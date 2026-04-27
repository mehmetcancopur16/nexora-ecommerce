import { motion as Motion } from "framer-motion"
import { BadgePercent, Calendar, Loader2, RefreshCw, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  usageLimit: "100",
  startsAt: "",
  expiresAt: "",
  isActive: true,
}

function AdminCoupons() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [filters, setFilters] = useState({ page: 1, limit: 12, search: "", status: "" })
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchItems = useCallback(async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/coupons", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          status: filters.status || undefined,
        },
      })
      setItems(response?.data?.data || [])
      setPagination({
        total: response?.data?.pagination?.total || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kuponlar yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [filters.limit, filters.page, filters.search, filters.status])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

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
      startsAt: item.startsAt ? new Date(item.startsAt).toISOString().slice(0, 16) : "",
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : "",
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
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
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
      await fetchItems({ silent: true })
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
      await fetchItems({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kupon silinemedi.")
    }
  }

  const couponState = (item) => {
    const now = Date.now()
    const startsAt = item.startsAt ? new Date(item.startsAt).getTime() : null
    const expiresAt = item.expiresAt ? new Date(item.expiresAt).getTime() : null
    if (!item.isActive) return "inactive"
    if (startsAt && startsAt > now) return "scheduled"
    if (expiresAt && expiresAt < now) return "expired"
    if (item.usageLimit && item.usedCount >= item.usageLimit) return "exhausted"
    return "active"
  }

  const stats = useMemo(() => {
    const active = items.filter((item) => couponState(item) === "active").length
    const expired = items.filter((item) => couponState(item) === "expired").length
    const exhausted = items.filter((item) => couponState(item) === "exhausted").length
    return { active, expired, exhausted }
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
            <h2 className="text-2xl font-semibold text-slate-900">Kupon Yonetimi</h2>
            <p className="mt-1 text-sm text-slate-500">Toplam {pagination.total} kupon kaydi.</p>
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
              Yeni Kupon
            </button>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Kod ile ara..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <div className="grid grid-cols-4 gap-3">
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Tum durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Aktif</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Suresi dolan</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.expired}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Limit dolan</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.exhausted}</p>
            </div>
          </div>
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
          <input
            type="datetime-local"
            value={form.startsAt || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="datetime-local"
            value={form.expiresAt || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
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
      </Motion.div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Deger</th>
              <th className="px-4 py-3">Kullanim</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Islem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={7}>
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Yukleniyor...
                  </span>
                </td>
              </tr>
            ) : !items.length ? (
              <tr>
                <td className="px-4 py-8" colSpan={7}>
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                    <BadgePercent className="size-7 text-slate-400" />
                    <p className="font-medium text-slate-700">Sonuc bulunamadi.</p>
                  </div>
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
                    {(() => {
                      const state = couponState(item)
                      const classMap = {
                        active: "bg-emerald-100 text-emerald-700",
                        scheduled: "bg-indigo-100 text-indigo-700",
                        expired: "bg-amber-100 text-amber-700",
                        exhausted: "bg-rose-100 text-rose-700",
                        inactive: "bg-slate-200 text-slate-700",
                      }
                      return (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classMap[state] || classMap.inactive}`}>
                          {state}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <p className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {item.startsAt ? new Date(item.startsAt).toLocaleDateString("tr-TR") : "-"}
                    </p>
                    <p className="mt-1">
                      {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("tr-TR") : "-"}
                    </p>
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

export default AdminCoupons
