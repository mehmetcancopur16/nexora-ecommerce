import { motion as Motion } from "framer-motion"
import { CheckCircle2, ReceiptText } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import axiosInstance from "../api/axiosInstance"

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(`/orders/my/${id}`)
        setOrder(response?.data?.data || null)
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Sipariş detayları yüklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-3xl bg-slate-200" />
  }

  if (error) {
    return <section className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-rose-700">{error}</section>
  }

  return (
    <Motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg shadow-emerald-100/50"
    >
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="size-11" aria-hidden />
      </div>

      <h1 className="text-3xl font-bold text-emerald-700">Siparişiniz Alındı!</h1>
      <p className="mt-3 text-sm text-slate-600">
        Ödeme işleminiz başarıyla tamamlandı. Siparişiniz en kısa sürede hazırlanacak.
      </p>

      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
        <p className="inline-flex items-center gap-1 font-medium text-slate-800">
          <ReceiptText className="size-4" aria-hidden />
          Sipariş Bilgisi
        </p>
        <p className="mt-2">
          Sipariş No: <span className="font-semibold text-slate-900">{order?.orderNumber || order?._id || id}</span>
        </p>
        <p className="mt-1">
          Ödeme Durumu: <span className="font-semibold text-emerald-700">{order?.paymentStatus || "paid"}</span>
        </p>
        <p className="mt-1">
          Tutar: <span className="font-semibold text-slate-900">{Number(order?.totalAmount || 0).toFixed(2)} TL</span>
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/products"
          className="rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Alışverişe Devam Et
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          to="/profile/orders"
          className="rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Siparişlerim
        </Link>
      </div>
    </Motion.section>
  )
}

export default OrderSuccess
