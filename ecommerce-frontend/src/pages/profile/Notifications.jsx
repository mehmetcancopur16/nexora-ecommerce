import { useCallback, useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    securityAlerts: true,
    productNews: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [listRes, prefRes] = await Promise.all([
        axiosInstance.get("/notifications"),
        axiosInstance.get("/notifications/preferences"),
      ])
      setNotifications(listRes?.data?.data || [])
      setPreferences(prefRes?.data?.data || {})
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bildirimler yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const markRead = async (id) => {
    await axiosInstance.patch(`/notifications/${id}/read`)
    setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)))
  }

  const savePreferences = async () => {
    await axiosInstance.patch("/notifications/preferences", preferences)
    toast.success("Bildirim tercihleri kaydedildi.")
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Bildirim Tercihleri</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(preferences).map(([key, value]) => (
            <label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setPreferences((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
              {key}
            </label>
          ))}
        </div>
        <button type="button" onClick={savePreferences} className="mt-4 rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white">
          Kaydet
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Bildirim Geçmisi</h2>
        {isLoading ? (
          <div className="mt-3 h-24 animate-pulse rounded-xl bg-slate-200" />
        ) : (
          <div className="mt-3 space-y-2">
            {notifications.map((item) => (
              <article key={item._id} className={`rounded-xl border p-3 ${item.isRead ? "border-slate-200" : "border-sky-200 bg-sky-50/60"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Bell className="size-4" aria-hidden />
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  </div>
                  {!item.isRead ? (
                    <button type="button" onClick={() => markRead(item._id)} className="inline-flex items-center gap-1 text-xs text-nexora-primary">
                      <CheckCheck className="size-4" aria-hidden />
                      Okundu
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Notifications
