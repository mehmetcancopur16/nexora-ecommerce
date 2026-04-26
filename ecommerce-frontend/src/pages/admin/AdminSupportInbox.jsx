import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const statusOptions = ["open", "in_progress", "resolved"]

function AdminSupportInbox() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/support-messages", { params: { page: 1, limit: 100 } })
      setItems(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Destek mesajlari yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const updateStatus = async (id, adminStatus) => {
    try {
      await axiosInstance.patch(`/admin/support-messages/${id}`, { adminStatus })
      toast.success("Mesaj durumu guncellendi.")
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Mesaj durumu guncellenemedi.")
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Destek Mesaj Kutusu</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Gonderen</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Konu</th>
              <th className="px-4 py-3">Mesaj</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
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
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-400"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(item.createdAt).toLocaleString("tr-TR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminSupportInbox
