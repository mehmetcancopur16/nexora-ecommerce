import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-sky-100 text-sky-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
}
const paymentStatusStyles = {
  pending_payment: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
}

const getImageSource = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/120x120/e2e8f0/64748b?text=Nexora"
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  return `${API_BASE_URL}${imagePath}`
}

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get("/orders/my")
        setOrders(response?.data?.data || [])
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Siparisler yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
        <p className="text-lg font-semibold text-slate-700">Henuz bir siparisiniz bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isOpen = expandedId === order._id
        return (
          <article key={order._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : order._id)}
              className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
            >
              <div>
                <p className="text-sm text-slate-500">Siparis No</p>
                <p className="font-semibold text-slate-800">{order._id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tarih</p>
                <p className="font-medium text-slate-700">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Toplam</p>
                <p className="font-semibold text-slate-800">{Number(order.totalAmount || 0).toFixed(2)} TL</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[order.status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {order.status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  paymentStatusStyles[order.paymentStatus] || "bg-slate-100 text-slate-700"
                }`}
              >
                odeme: {order.paymentStatus || "pending_payment"}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-200 px-4 py-4">
                <div className="space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <img
                        src={getImageSource(item?.product?.images?.[0])}
                        alt={item?.product?.name || "Urun"}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{item?.product?.name}</p>
                        <p className="text-xs text-slate-500">Adet: {item?.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

export default OrderHistory
