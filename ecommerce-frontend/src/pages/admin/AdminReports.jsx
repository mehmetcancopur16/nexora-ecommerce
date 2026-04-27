import { motion as Motion } from "framer-motion"
import { Activity, CalendarDays, ChartColumn, CircleDollarSign, PackageSearch, RefreshCw, ShoppingCart, TrendingUp } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, CartesianGrid, Bar, BarChart } from "recharts"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const presetOptions = [
  { key: "7d", label: "Son 7 gun", days: 7 },
  { key: "30d", label: "Son 30 gun", days: 30 },
  { key: "90d", label: "Son 90 gun", days: 90 },
]

const numberFormatter = new Intl.NumberFormat("tr-TR")
const moneyFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 })

const toInputDate = (date) => new Date(date).toISOString().slice(0, 10)
const getDateRangeByDays = (days) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - (days - 1))
  return { startDate: toInputDate(start), endDate: toInputDate(end) }
}

const getDeltaText = (value, suffix = "") => {
  if (value === null || value === undefined) return "-"
  const rounded = Number(value).toFixed(2)
  if (Number(value) === 0) return `0${suffix}`
  return `${Number(value) > 0 ? "+" : ""}${rounded}${suffix}`
}

function AdminReports() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState({
    ...getDateRangeByDays(30),
    granularity: "day",
    topLimit: 8,
    comparePrevious: true,
  })

  const fetchData = useCallback(async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get("/admin/reports", {
        params: {
          startDate: `${filters.startDate}T00:00:00.000Z`,
          endDate: `${filters.endDate}T23:59:59.999Z`,
          granularity: filters.granularity,
          topLimit: filters.topLimit,
          comparePrevious: filters.comparePrevious,
        },
      })
      setData(response?.data?.data || null)
    } catch (error) {
      const message = error?.response?.data?.message || "Rapor verileri yuklenemedi."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
      setIsFirstLoad(false)
    }
  }, [filters.comparePrevious, filters.endDate, filters.granularity, filters.startDate, filters.topLimit])

  const summary = data?.summary || {}
  const previousPeriod = data?.previousPeriod
  const salesTrend = useMemo(() => data?.dailySales || [], [data])
  const categorySales = useMemo(() => data?.categorySales || [], [data])
  const topProducts = useMemo(() => data?.topProducts || [], [data])

  const kpis = [
    {
      key: "totalRevenue",
      label: "Toplam Ciro",
      value: moneyFormatter.format(Number(summary.totalRevenue || 0)),
      icon: CircleDollarSign,
      delta: getDeltaText(previousPeriod?.deltaRevenue, " TL"),
    },
    {
      key: "paidOrders",
      label: "Odenmis Siparis",
      value: numberFormatter.format(Number(summary.paidOrders || 0)),
      icon: ShoppingCart,
      delta: getDeltaText(previousPeriod?.deltaOrders),
    },
    {
      key: "averageOrderValue",
      label: "Ortalama Sepet",
      value: moneyFormatter.format(Number(summary.averageOrderValue || 0)),
      icon: TrendingUp,
      delta: getDeltaText(previousPeriod?.deltaAverageOrderValue, " TL"),
    },
    {
      key: "paidRate",
      label: "Odeme Basari Orani",
      value: `%${Number(summary.paidRate || 0).toFixed(1)}`,
      icon: Activity,
      delta: getDeltaText(previousPeriod?.deltaPaidRate, " puan"),
    },
  ]

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading && isFirstLoad) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
  }

  if (error && !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => fetchData()}
          className="mt-2 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700"
        >
          Tekrar dene
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/60 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 px-5 py-5 text-white shadow-xl"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Raporlar ve Analitik</h2>
            <p className="mt-1 text-sm text-slate-200">Satis odakli KPI, trend ve kategori bazli performans takibi.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchData({ silent: true })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/20"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
      </Motion.div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Baslangic</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
            />
          </div>
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Bitis</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Kirilim</label>
            <select
              value={filters.granularity}
              onChange={(event) => setFilters((prev) => ({ ...prev, granularity: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
            >
              <option value="day">Gunluk</option>
              <option value="week">Haftalik</option>
              <option value="month">Aylik</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Top urun</label>
            <select
              value={filters.topLimit}
              onChange={(event) => setFilters((prev) => ({ ...prev, topLimit: Number(event.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
            >
              <option value={5}>Top 5</option>
              <option value={8}>Top 8</option>
              <option value={12}>Top 12</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {presetOptions.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, ...getDateRangeByDays(preset.days) }))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {preset.label}
            </button>
          ))}
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={filters.comparePrevious}
              onChange={(event) => setFilters((prev) => ({ ...prev, comparePrevious: event.target.checked }))}
            />
            Onceki donem karsilastir
          </label>
          <button
            type="button"
            onClick={() => fetchData()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <CalendarDays className="size-4" />
            Uygula
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.key} className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{kpi.label}</p>
                <Icon className="size-4 text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-500">Degisim: {kpi.delta}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-800">
            <ChartColumn className="size-4 text-indigo-500" />
            Gelir Trendi
          </h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
          <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-800">
            <PackageSearch className="size-4 text-violet-500" />
            Kategori Satis Dagilimi
          </h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
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
              {topProducts.map((item) => (
                <tr key={item.productId} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-800">{item.name}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.soldUnits}</td>
                  <td className="px-4 py-2.5 text-slate-700">{Number(item.revenue || 0).toFixed(2)} TL</td>
                </tr>
              ))}
              {!topProducts.length && (
                <tr>
                  <td className="px-4 py-3 text-slate-500" colSpan={3}>
                    Secili tarih araliginda satis bulunamadi.
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

export default AdminReports
