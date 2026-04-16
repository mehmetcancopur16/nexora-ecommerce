import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/users", {
        params: { page: 1, limit: 100 },
      })
      setUsers(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kullanicilar yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Kullanici Yonetimi</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Isim</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={4}>
                  Yukleniyor...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{user.name || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminUsers
