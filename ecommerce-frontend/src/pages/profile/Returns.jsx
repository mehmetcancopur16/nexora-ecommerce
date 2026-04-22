import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function Returns() {
  const [orders, setOrders] = useState([])
  const [returns, setReturns] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [reason, setReason] = useState("Urun bekledigim gibi degil")

  const selectableOrders = useMemo(
    () => orders.filter((item) => ["processing", "shipped", "delivered"].includes(item.status)),
    [orders]
  )

  const fetchData = async () => {
    const [ordersRes, returnsRes] = await Promise.all([
      axiosInstance.get("/orders/my"),
      axiosInstance.get("/returns/my"),
    ])
    setOrders(ordersRes?.data?.data || [])
    setReturns(returnsRes?.data?.data || [])
  }

  useEffect(() => {
    ;(async () => {
      try {
        await fetchData()
      } catch (error) {
        toast.error(error?.response?.data?.message || "Iade verileri yuklenemedi.")
      }
    })()
  }, [])

  const submitReturn = async () => {
    try {
      const order = orders.find((item) => item._id === selectedOrderId)
      if (!order?.items?.length) return
      await axiosInstance.post("/returns", {
        orderId: selectedOrderId,
        note: reason,
        items: order.items.map((line) => ({
          orderItemId: String(line?._id || line?.product?._id || Math.random()),
          quantity: line.quantity,
          reason,
        })),
      })
      toast.success("Iade talebi olusturuldu.")
      await fetchData()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Iade talebi olusturulamadi.")
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Iade Talebi Olustur</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          >
            <option value="">Siparis secin</option>
            {selectableOrders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.orderNumber || order._id}
              </option>
            ))}
          </select>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          />
        </div>
        <button type="button" onClick={submitReturn} className="mt-4 rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white">
          Iade Talebi Gonder
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Iade Gecmisi</h2>
        <div className="mt-3 space-y-2">
          {returns.map((request) => (
            <article key={request._id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-800">
                {request?.order?.orderNumber || request?.order?._id} - {request.status}
              </p>
              <p className="mt-1 text-sm text-slate-600">{request.note || "-"}</p>
            </article>
          ))}
          {!returns.length ? <p className="text-sm text-slate-500">Henuz iade talebiniz yok.</p> : null}
        </div>
      </section>
    </div>
  )
}

export default Returns
