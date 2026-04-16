import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/orders")
      setOrders(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Siparisler yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, { status })
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)))
      toast.success("Siparis durumu guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Siparis durumu guncellenemedi.")
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Siparis Yonetimi</h2>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Siparis ID</th>
              <th className="px-4 py-3">Kullanici</th>
              <th className="px-4 py-3">Toplam</th>
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
              orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{order._id}</td>
                  <td className="px-4 py-3 text-slate-700">{order?.user?.email || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{Number(order.totalAmount || 0).toFixed(2)} TL</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusUpdate(order._id, event.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-sky-400"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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

export default AdminOrders
