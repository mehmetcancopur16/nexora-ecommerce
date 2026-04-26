import { useEffect, useMemo, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import axiosInstance from "../../api/axiosInstance"

const chartColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444"]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get("/admin/dashboard")
        setStats(response?.data?.data || null)
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Dashboard verileri yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const pieData = useMemo(() => stats?.orderStatusDistribution || [], [stats])

  if (isLoading) {
    return <div className="h-60 animate-pulse rounded-2xl bg-slate-200" />
  }

  if (error) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Toplam Gelir</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{Number(stats?.totalRevenue || 0).toFixed(2)} TL</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kullanici Sayisi</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Siparis Sayisi</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats?.totalOrders || 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Aktif Kupon</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats?.activeCouponCount || 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Acil Destek</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats?.openSupportCount || 0}</p>
        </div>
      </div>

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
              {(stats?.lowStockProducts || []).map((item) => (
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
    </section>
  )
}

export default Dashboard
