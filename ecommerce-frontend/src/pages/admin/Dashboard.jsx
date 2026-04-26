import { motion as Motion } from "framer-motion"
import { AlertCircle, ClipboardList, Package, RefreshCw, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Link } from "react-router"
import axiosInstance from "../../api/axiosInstance"

const chartColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"]
const kpiCards = [
  { key: "totalRevenue", label: "Toplam Gelir", suffix: " TL", icon: Bar, formatter: (value) => Number(value || 0).toFixed(2) },
  { key: "totalUsers", label: "Toplam Kullanici", icon: Users },
  { key: "totalOrders", label: "Toplam Siparis", icon: ClipboardList },
  { key: "openSupportCount", label: "Acil Destek", icon: AlertCircle },
  { key: "activeCouponCount", label: "Aktif Kupon", icon: Package },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const fetchDashboard = async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    setError(null)
    try {
      const [statsResponse, reportsResponse] = await Promise.all([
        axiosInstance.get("/admin/dashboard"),
        axiosInstance.get("/admin/reports"),
      ])
      setStats(statsResponse?.data?.data || null)
      setReports(reportsResponse?.data?.data || null)
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Dashboard verileri yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const pieData = useMemo(() => stats?.orderStatusDistribution || [], [stats])
  const salesTrend = useMemo(() => reports?.dailySales || [], [reports])

  if (isLoading) {
    return <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => fetchDashboard()}
          className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
        >
          Tekrar dene
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
            <p className="mt-1 text-sm text-slate-200">Isletmenin canli metrikleri, kritik stok ve performans ozeti.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchDashboard({ silent: true })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <Link
              to="/admin/products"
              className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Urun yonetimine git
            </Link>
          </div>
        </div>
      </Motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((card) => {
          const Icon = card.icon
          const rawValue = stats?.[card.key] || 0
          const value = card.formatter ? card.formatter(rawValue) : rawValue
          return (
            <div key={card.key} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <Icon className="size-4 text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {value}
                {card.suffix || ""}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Siparis Durum Dagilimi</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={110} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Gunluk Gelir Trendi (30 gun)</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend}>
                <XAxis dataKey="_id" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Dusuk Stok Urunler</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Urun</th>
                  <th className="px-4 py-2.5">Stok</th>
                  <th className="px-4 py-2.5">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.lowStockProducts || []).slice(0, 8).map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-800">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-700">{item.stock}</td>
                    <td className="px-4 py-2.5 text-slate-700">{Number(item.price || 0).toFixed(2)} TL</td>
                  </tr>
                ))}
                {!stats?.lowStockProducts?.length && (
                  <tr>
                    <td className="px-4 py-3 text-slate-500" colSpan={3}>
                      Kritik stok urunu bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">En Cok Satan Urunler</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-2.5">Urun</th>
                  <th className="px-4 py-2.5">Adet</th>
                  <th className="px-4 py-2.5">Ciro</th>
                </tr>
              </thead>
              <tbody>
                {(reports?.topProducts || []).slice(0, 8).map((item) => (
                  <tr key={item.productId} className="border-t border-slate-100">
                    <td className="px-4 py-2.5 text-slate-800">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-700">{item.soldUnits}</td>
                    <td className="px-4 py-2.5 text-slate-700">{Number(item.revenue || 0).toFixed(2)} TL</td>
                  </tr>
                ))}
                {!reports?.topProducts?.length && (
                  <tr>
                    <td className="px-4 py-3 text-slate-500" colSpan={3}>
                      Henuz yeterli satis verisi yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
