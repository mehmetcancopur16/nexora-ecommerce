import { motion as Motion, AnimatePresence } from "framer-motion"
import { Package, RotateCcw, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api").replace(/\/api$/, "")

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

const RETURN_STATUS_TR = {
  requested: "Talep alındı",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  refunded: "İade edildi",
}

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 border-amber-200/80",
  processing: "bg-sky-100 text-sky-800 border-sky-200/80",
  shipped: "bg-violet-100 text-violet-800 border-violet-200/80",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200/80",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200/80",
}
const paymentStatusStyles = {
  pending_payment: "bg-amber-50 text-amber-800",
  paid: "bg-emerald-50 text-emerald-800",
  failed: "bg-rose-50 text-rose-800",
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [returnRequests, setReturnRequests] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState(() => (searchParams.get("tab") === "returns" ? "returns" : "orders"))

  useEffect(() => {
    const t = searchParams.get("tab")
    if (t === "returns") setView("returns")
    if (t === "orders" || !t) setView("orders")
  }, [searchParams])
  const [returnOrderId, setReturnOrderId] = useState(searchParams.get("returnOrder") || "")
  const [returnNote, setReturnNote] = useState("")
  const [itemReasons, setItemReasons] = useState({})
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState("date_desc")

  const prefillOrder = searchParams.get("returnOrder")

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [ordersRes, retRes] = await Promise.all([
        axiosInstance.get("/orders/my"),
        axiosInstance.get("/returns/my"),
      ])
      setOrders(ordersRes?.data?.data || [])
      setReturnRequests(retRes?.data?.data || [])
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Veriler yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    if (prefillOrder) {
      setView("returns")
      setReturnOrderId(prefillOrder)
    }
  }, [prefillOrder])

  const filteredOrders = useMemo(() => {
    let list = [...orders]
    const q = search.trim().toLocaleLowerCase("tr-TR")
    if (q) {
      list = list.filter((o) => {
        const num = (o.orderNumber || "").toLowerCase()
        return num.includes(q) || String(o._id).toLowerCase().includes(q)
      })
    }
    if (sortKey === "date_desc") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortKey === "date_asc") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sortKey === "amount_desc") list.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    if (sortKey === "amount_asc") list.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0))
    return list
  }, [orders, search, sortKey])

  const selectableOrders = useMemo(
    () => orders.filter((item) => ["processing", "shipped", "delivered"].includes(item.status)),
    [orders]
  )

  const selectedOrder = useMemo(
    () => orders.find((o) => String(o._id) === returnOrderId),
    [orders, returnOrderId]
  )

  const setTab = (v) => {
    setView(v)
    setSearchParams(v === "returns" ? { tab: "returns" } : {}, { replace: true })
  }

  const cancelOrder = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/orders/my/${orderId}/cancel`)
      setOrders((prev) =>
        prev.map((item) => (item._id === orderId ? { ...item, status: response?.data?.data?.status } : item))
      )
      toast.success("Sipariş iptal edildi.")
    } catch (e) {
      toast.error(e?.response?.data?.message || "İptal edilemedi.")
    }
  }

  const startReturnForOrder = (id) => {
    setView("returns")
    setReturnOrderId(String(id))
    setSearchParams({ tab: "returns", returnOrder: String(id) }, { replace: true })
  }

  const getLineKey = (line, index) => {
    if (line?._id) return String(line._id)
    const pid = line?.product?._id || line?.product
    return `product-${String(pid || index)}`
  }

  const submitReturn = async () => {
    const order = selectedOrder
    if (!order?.items?.length) {
      toast.error("Sipariş seçin.")
      return
    }
    const defaultReason = returnNote.trim() || "Ürün beklentimi karşılamadı"
    const items = order.items.map((line, index) => {
      const oid = getLineKey(line, index)
      return {
        orderItemId: oid,
        quantity: line.quantity,
        reason: (itemReasons[oid] || defaultReason).trim() || defaultReason,
      }
    })
    try {
      await axiosInstance.post("/returns", {
        orderId: returnOrderId,
        note: returnNote.trim() || defaultReason,
        items,
      })
      toast.success("İade talebiniz alındı.")
      setReturnNote("")
      setItemReasons({})
      setSearchParams({ tab: "returns" }, { replace: true })
      await loadAll()
    } catch (e) {
      toast.error(e?.response?.data?.message || "İade talebi oluşturulamadı.")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200/60" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/95 via-white to-rose-50/40 p-6 shadow-lg shadow-slate-200/50"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-nexora-text">Siparişlerim ve iadeler</h1>
            <p className="mt-1 text-sm text-slate-600">Siparişlerinizi takip edin, gerekirse iade talebi oluşturun.</p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-1">
            <button
              type="button"
              onClick={() => setTab("orders")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                view === "orders" ? "bg-nexora-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Package className="size-4" />
              Siparişler
            </button>
            <button
              type="button"
              onClick={() => setTab("returns")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                view === "returns" ? "bg-nexora-primary text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <RotateCcw className="size-4" />
              İadeler
            </button>
          </div>
        </div>
        {view === "orders" ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sipariş no ile ara..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
            >
              <option value="date_desc">En yeni</option>
              <option value="date_asc">En eski</option>
              <option value="amount_desc">Tutar (yüksek)</option>
              <option value="amount_asc">Tutar (düşük)</option>
            </select>
          </div>
        ) : null}
      </Motion.header>

      {view === "returns" ? (
        <div className="space-y-6">
          <Motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">İade talebi</h2>
            <p className="mt-1 text-sm text-slate-500">Yalnızca hazırlanan, kargoda veya teslim edilen siparişler için.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Sipariş</label>
                <select
                  value={returnOrderId}
                  onChange={(e) => {
                    setReturnOrderId(e.target.value)
                    if (e.target.value) {
                      setSearchParams({ tab: "returns", returnOrder: e.target.value }, { replace: true })
                    } else {
                      setSearchParams({ tab: "returns" }, { replace: true })
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
                >
                  <option value="">Sipariş seçin</option>
                  {selectableOrders.map((order) => (
                    <option key={order._id} value={String(order._id)}>
                      {order.orderNumber} — {STATUS_TR[order.status] || order.status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Genel açıklama (isteğe bağlı)</label>
                <input
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Örn. kutu hasarlı geldi"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-sky-400"
                />
              </div>
            </div>
            {selectedOrder?.items?.length ? (
              <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                {selectedOrder.items.map((line, index) => {
                  const oid = getLineKey(line, index)
                  return (
                    <div key={oid} className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-end">
                      <p className="text-sm font-medium text-slate-800">{line?.product?.name || "Ürün"} × {line.quantity}</p>
                      <input
                        value={itemReasons[oid] || ""}
                        onChange={(e) => setItemReasons((prev) => ({ ...prev, [oid]: e.target.value }))}
                        placeholder="Kalem iade sebebi"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      />
                    </div>
                  )
                })}
              </div>
            ) : null}
            <button
              type="button"
              onClick={submitReturn}
              disabled={!returnOrderId}
              className="mt-4 rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              İade talebini gönder
            </button>
          </Motion.section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-slate-900">İade geçmişi</h2>
            <div className="mt-4 space-y-3">
              <AnimatePresence>
                {returnRequests.map((req) => (
                  <Motion.article
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {req?.order?.orderNumber || "Sipariş"} —{" "}
                      <span className="text-nexora-primary">{RETURN_STATUS_TR[req.status] || req.status}</span>
                    </p>
                    {req?.note ? <p className="mt-1 text-sm text-slate-600">{req.note}</p> : null}
                    <p className="mt-2 text-xs text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleString("tr-TR") : ""}
                    </p>
                  </Motion.article>
                ))}
              </AnimatePresence>
              {!returnRequests.length ? <p className="text-sm text-slate-500">Henüz iade talebiniz yok.</p> : null}
            </div>
          </section>
        </div>
      ) : !filteredOrders.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-slate-700">Henüz bir siparişiniz yok</p>
          <Link
            to="/products"
            className="mt-4 inline-flex rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Alışverişe başla
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isOpen = expandedId === order._id
            return (
              <article key={order._id} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : order._id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
                >
                  <div>
                    <p className="text-xs text-slate-500">Sipariş no</p>
                    <p className="font-semibold text-slate-900">{order.orderNumber || order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tarih</p>
                    <p className="font-medium text-slate-700">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("tr-TR") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Toplam</p>
                    <p className="font-semibold text-slate-900">{Number(order.totalAmount || 0).toFixed(2)} TL</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[order.status] || "border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    {STATUS_TR[order.status] || order.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      paymentStatusStyles[order.paymentStatus] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {PAY_TR[order.paymentStatus] || order.paymentStatus}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200"
                    >
                      <div className="space-y-3 px-4 py-4">
                        {(order.items || []).map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-2xl bg-slate-50/90 p-3">
                            <img
                              src={getImageSource(item?.product?.images?.[0])}
                              alt=""
                              className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200/80"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item?.product?.name}</p>
                              <p className="text-xs text-slate-500">Adet: {item?.quantity}</p>
                            </div>
                          </div>
                        ))}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Link
                            to={`/profile/orders/${order._id}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm"
                          >
                            Detaylar
                          </Link>
                          {["pending", "processing"].includes(order.status) ? (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order._id)}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                            >
                              İptal et
                            </button>
                          ) : null}
                          {["processing", "shipped", "delivered"].includes(order.status) ? (
                            <button
                              type="button"
                              onClick={() => startReturnForOrder(order._id)}
                              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800"
                            >
                              İade talebi
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
