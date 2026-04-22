import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(`/orders/my/${id}`)
        setOrder(response?.data?.data || null)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Siparis detaylari yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
  }
  if (!order) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Siparis bulunamadi.</div>
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Siparis Detayi</h2>
        <Link to="/profile/orders" className="text-sm font-semibold text-nexora-primary hover:underline">
          Siparislerime don
        </Link>
      </div>
      <p className="text-sm text-slate-600">Siparis No: {order.orderNumber || order._id}</p>
      <p className="text-sm text-slate-600">Durum: {order.status}</p>
      <p className="text-sm text-slate-600">Odeme: {order.paymentStatus}</p>
      <p className="text-sm text-slate-600">Toplam: {Number(order.totalAmount || 0).toFixed(2)} TL</p>
      <div className="space-y-2">
        {(order.items || []).map((item, index) => (
          <div key={`${order._id}-${index}`} className="rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-semibold text-slate-800">{item?.product?.name}</p>
            <p className="text-slate-600">Adet: {item?.quantity}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OrderDetail
