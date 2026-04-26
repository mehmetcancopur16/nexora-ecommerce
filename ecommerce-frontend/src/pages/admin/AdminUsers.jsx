import { motion as Motion } from "framer-motion"
import { Loader2, RefreshCw, Search, Shield, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState({ page: 1, limit: 12, search: "" })
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchUsers = async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/users", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
        },
      })
      setUsers(response?.data?.data || [])
      setPagination({
        total: response?.data?.pagination?.total || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kullanicilar yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filters.page, filters.limit, filters.search])

  const handleUpdate = async (userId, payload) => {
    try {
      const response = await axiosInstance.patch(`/admin/users/${userId}`, payload)
      const updatedUser = response?.data?.data
      setUsers((prev) => prev.map((user) => (user._id === userId ? updatedUser : user)))
      toast.success("Kullanici bilgisi guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kullanici guncellenemedi.")
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`)
      toast.success("Kullanici silindi.")
      await fetchUsers({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kullanici silinemedi.")
    }
  }

  const stats = useMemo(() => {
    const adminCount = users.filter((user) => user.role === "admin").length
    const activeCount = users.filter((user) => user.isActive).length
    return { adminCount, activeCount, visibleCount: users.length }
  }, [users])

  return (
    <section className="space-y-5">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Kullanici Yonetimi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Toplam {pagination.total} kullanici, bu sayfada {stats.visibleCount} kayit goruntuleniyor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchUsers({ silent: true })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ad, soyad veya e-posta ile ara..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <div className="grid gap-3 grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Admin</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.adminCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Aktif</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{stats.activeCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[11px] text-slate-500">Sayfa</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {filters.page}/{pagination.totalPages}
              </p>
            </div>
          </div>
        </div>
      </Motion.div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Ad Soyad</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Kayit</th>
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
            ) : !users.length ? (
              <tr>
                <td className="px-4 py-8" colSpan={7}>
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                    <Users className="size-7 text-slate-400" />
                    <p className="font-medium text-slate-700">Sonuc bulunamadi.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">{user.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(event) => handleUpdate(user._id, { role: event.target.value })}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-400"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleUpdate(user._id, { isActive: !user.isActive })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      {user.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(user.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.role === "admin" && <Shield className="size-4 text-indigo-500" />}
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user._id)}
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

export default AdminUsers
