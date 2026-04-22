import { motion as Motion } from "framer-motion"
import { ArrowLeft, MapPin, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const STATUS_TR = {
  pending: "Beklemede",
  processing: "Hazırlanıyor",
  shipped: "Kargoda",
  delivered: "Teslim edildi",
  cancelled: "İptal",
}
const PAY_TR = {
  pending_payment: "Ödeme bekleniyor",
  paid: "Ödendi",
  failed: "Başarısız",
}

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
        toast.error(error?.response?.data?.message || "Sipariş yüklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
  }
  if (!order) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">Sipariş bulunamadı.</div>
  }

  const sa = order.shippingAddress || {}

  return (
    <Motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-nexora-text">Sipariş detayı</h1>
        <Link
          to="/profile/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm"
        >
          <ArrowLeft className="size-4" />
          Siparişlere dön
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Sipariş no</p>
        <p className="text-lg font-semibold text-slate-900">{order.orderNumber || order._id}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
            {STATUS_TR[order.status] || order.status}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
            Ödeme: {PAY_TR[order.paymentStatus] || order.paymentStatus}
          </span>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Tarih: {order.createdAt ? new Date(order.createdAt).toLocaleString("tr-TR") : "—"}
        </p>
        <p className="mt-2 text-lg font-bold text-nexora-text">Toplam: {Number(order.totalAmount || 0).toFixed(2)} TL</p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-sky-50/40 to-white p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MapPin className="size-4 text-nexora-primary" />
          Teslimat adresi
        </p>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
          {sa.openAddress || sa.street}
          <br />
          {sa.district && `${sa.district}, `}
          {sa.city} {sa.postalCode || sa.zip}
          <br />
          {sa.country}
        </p>
      </div>

      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Package className="size-4" />
          Ürünler
        </p>
        <div className="space-y-2">
          {(order.items || []).map((item, index) => (
            <div key={`${order._id}-${index}`} className="rounded-xl border border-slate-200/80 bg-white p-3 text-sm shadow-sm">
              <p className="font-semibold text-slate-900">{item?.product?.name}</p>
              <p className="text-slate-600">Adet: {item?.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {["processing", "shipped", "delivered"].includes(order.status) ? (
        <Link
          to={`/profile/orders?tab=returns&returnOrder=${String(order._id)}`}
          className="inline-flex rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          Bu sipariş için iade talebi
        </Link>
      ) : null}
    </Motion.section>
  )
}

export default OrderDetail
