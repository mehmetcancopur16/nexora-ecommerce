import { useEffect, useState } from "react"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, CartesianGrid, Bar, BarChart } from "recharts"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function AdminReports() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/admin/reports")
        setData(response?.data?.data || null)
      } catch (error) {
        toast.error(error?.response?.data?.message || "Rapor verileri yuklenemedi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Raporlar ve Analitik</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Gunluk Gelir Trendi</h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.dailySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Kategori Dagilimi</h3>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categorySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
              {(data?.topProducts || []).map((item) => (
                <tr key={item.productId} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-800">{item.name}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.soldUnits}</td>
                  <td className="px-4 py-2.5 text-slate-700">{Number(item.revenue || 0).toFixed(2)} TL</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminReports
