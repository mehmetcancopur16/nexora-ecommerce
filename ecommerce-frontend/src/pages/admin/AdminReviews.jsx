import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function AdminReviews() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/admin/reviews", { params: { page: 1, limit: 100 } })
      setItems(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Yorumlar yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const updateModeration = async (id, payload) => {
    try {
      await axiosInstance.patch(`/admin/reviews/${id}`, payload)
      toast.success("Yorum guncellendi.")
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Yorum guncellenemedi.")
    }
  }

  const deleteReview = async (id) => {
    try {
      await axiosInstance.delete(`/admin/reviews/${id}`)
      toast.success("Yorum silindi.")
      await fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Yorum silinemedi.")
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Yorum Moderasyonu</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
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
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Yukleniyor...
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
                        onClick={() => updateModeration(item._id, { moderationStatus: "approved", isHidden: false })}
                        className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"
                      >
                        Onayla
                      </button>
                      <button
                        type="button"
                        onClick={() => updateModeration(item._id, { moderationStatus: "rejected", isHidden: true })}
                        className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700"
                      >
                        Reddet
                      </button>
                      <button
                        type="button"
                        onClick={() => updateModeration(item._id, { isHidden: !item.isHidden })}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Gizle/Goster
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReview(item._id)}
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

export default AdminReviews
