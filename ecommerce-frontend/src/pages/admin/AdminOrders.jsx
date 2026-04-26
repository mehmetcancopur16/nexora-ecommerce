import { motion as Motion } from "framer-motion"
import { Loader2, RefreshCw, Search, ShoppingBag } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    status: "",
    paymentStatus: "",
  })
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchOrders = async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const response = await axiosInstance.get("/orders", {
        params: {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          status: filters.status || undefined,
          paymentStatus: filters.paymentStatus || undefined,
        },
      })
      setOrders(response?.data?.data || [])
      setPagination({
        total: response?.data?.pagination?.total || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Siparisler yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filters.page, filters.limit, filters.search, filters.status, filters.paymentStatus])

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, { status })
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)))
      toast.success("Siparis durumu guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Siparis durumu guncellenemedi.")
    }
  }

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
    const paidCount = orders.filter((item) => item.paymentStatus === "paid").length
    return {
      totalRevenue,
      paidCount,
      visibleCount: orders.length,
    }
  }, [orders])

  return (
    <section className="space-y-5">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Siparis Yonetimi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Toplam {pagination.total} siparis, bu sayfada {stats.visibleCount} kayit goruntuleniyor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchOrders({ silent: true })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Siparis no, kullanici e-posta veya ad ara..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Tum siparis durumlari</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(event) => setFilters((prev) => ({ ...prev, paymentStatus: event.target.value, page: 1 }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Tum odeme durumlari</option>
            <option value="pending_payment">pending_payment</option>
            <option value="paid">paid</option>
            <option value="failed">failed</option>
          </select>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">Sayfadaki toplam tutar</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalRevenue.toFixed(2)} TL</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">Odeme tamamlanan</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{stats.paidCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">Sayfa</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {filters.page} / {pagination.totalPages}
            </p>
          </div>
        </div>
      </Motion.div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Siparis No</th>
              <th className="px-4 py-3">Siparis ID</th>
              <th className="px-4 py-3">Kullanici</th>
              <th className="px-4 py-3">Toplam</th>
              <th className="px-4 py-3">Odeme</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Detay</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={8}>
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Yukleniyor...
                  </span>
                </td>
              </tr>
            ) : !orders.length ? (
              <tr>
                <td className="px-4 py-8" colSpan={8}>
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                    <ShoppingBag className="size-7 text-slate-400" />
                    <p className="font-medium text-slate-700">Filtreye uygun siparis bulunamadi.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{order.orderNumber || "-"}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{order._id}</td>
                  <td className="px-4 py-3 text-slate-700">{order?.user?.email || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{Number(order.totalAmount || 0).toFixed(2)} TL</td>
                  <td className="px-4 py-3 text-slate-700">{order.paymentStatus || "pending_payment"}</td>
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
                  <td className="px-4 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      Gor
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <span className="text-slate-500">
          Sayfa {filters.page} / {pagination.totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={filters.page <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Onceki
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={filters.page >= pagination.totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Siparis Detayi</h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              >
                Kapat
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4 text-sm">
                <p>
                  <span className="font-semibold">Siparis no:</span> {selectedOrder.orderNumber || "-"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Kullanici:</span> {selectedOrder?.user?.email || "-"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Odeme:</span> {selectedOrder.paymentStatus}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Durum:</span> {selectedOrder.status}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 text-sm">
                <p className="font-semibold">Teslimat:</p>
                <p className="mt-1 text-slate-600">{selectedOrder?.shippingAddress?.openAddress || "-"}</p>
                <p className="text-slate-600">
                  {[selectedOrder?.shippingAddress?.district, selectedOrder?.shippingAddress?.city]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-2.5">Urun</th>
                    <th className="px-4 py-2.5">Adet</th>
                    <th className="px-4 py-2.5">Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item) => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="px-4 py-2.5">{item?.product?.name || "-"}</td>
                      <td className="px-4 py-2.5">{item.quantity}</td>
                      <td className="px-4 py-2.5">{Number(item.price || 0).toFixed(2)} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminOrders
