import { motion as Motion } from "framer-motion"
import { Bell, BellRing, CheckCheck, Mail, Package, Shield, Sparkles, Tag } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const PREF_LABELS = {
  orderUpdates: { label: "Sipariş & kargo güncellemeleri", icon: Package },
  promotions: { label: "Kampanya ve indirimler", icon: Tag },
  securityAlerts: { label: "Hesap güvenliği uyarıları", icon: Shield },
  productNews: { label: "Yeni ürün / stok haberleri", icon: Mail },
}

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    securityAlerts: true,
    productNews: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [savingPrefs, setSavingPrefs] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [listRes, prefRes] = await Promise.all([
        axiosInstance.get("/notifications"),
        axiosInstance.get("/notifications/preferences"),
      ])
      setNotifications(listRes?.data?.data || [])
      setPreferences((prev) => ({ ...prev, ...(prefRes?.data?.data || {}) }))
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bildirimler yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const markRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)))
    } catch (error) {
      toast.error(error?.response?.data?.message || "Güncellenemedi.")
    }
  }

  const markAllRead = async () => {
    try {
      await axiosInstance.patch("/notifications/read-all")
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success("Tüm bildirimler okundu.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "İşlem başarısız.")
    }
  }

  const savePreferences = async () => {
    setSavingPrefs(true)
    try {
      await axiosInstance.patch("/notifications/preferences", preferences)
      toast.success("Tercihleriniz kaydedildi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kaydedilemedi.")
    } finally {
      setSavingPrefs(false)
    }
  }

  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-8">
      <Motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-indigo-50/90 via-white to-amber-50/40 p-6 shadow-lg"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
              <Sparkles className="size-3.5" />
              Bildirimler
            </p>
            <h1 className="mt-1 text-2xl font-bold text-nexora-text">Bildirim merkezi</h1>
            <p className="mt-1 text-sm text-slate-600">
              {isLoading ? "Yükleniyor…" : `Okunmamış: ${unread} • Toplam: ${notifications.length}`}
            </p>
          </div>
          {notifications.length > 0 && unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 shadow-sm"
            >
              <CheckCheck className="size-4" />
              Tümünü okundu yap
            </button>
          ) : null}
        </div>
      </Motion.header>

      <Motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md"
      >
        <h2 className="text-lg font-semibold text-slate-900">Bildirim tercihleri</h2>
        <p className="mt-1 text-sm text-slate-500">Hangi konularda e-posta / uygulama bildirimi alacağınızı seçin.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(preferences).map(([key, value]) => {
            const conf = PREF_LABELS[key] || { label: key, icon: Bell }
            const Icon = conf.icon
            return (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:border-sky-200"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-nexora-primary" />
                <span className="flex-1 text-sm text-slate-800">{conf.label}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="mt-1 size-4 rounded border-slate-300"
                />
              </label>
            )
          })}
        </div>
        <button
          type="button"
          onClick={savePreferences}
          disabled={savingPrefs}
          className="mt-5 rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          {savingPrefs ? "Kaydediliyor…" : "Tercihleri kaydet"}
        </button>
      </Motion.section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-slate-900">Son bildirimler</h2>
        {isLoading ? (
          <div className="mt-4 h-32 animate-pulse rounded-2xl bg-slate-100" />
        ) : (
          <div className="mt-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">Henüz bildirim yok — sipariş veya kampanyalar burada görünür.</p>
            ) : null}
            {notifications.map((item) => (
              <article
                key={item._id}
                className={`rounded-2xl border p-4 transition ${
                  item.isRead ? "border-slate-200 bg-white" : "border-sky-200/80 bg-gradient-to-r from-sky-50/80 to-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      {item.isRead ? <Bell className="size-4 shrink-0 text-slate-400" /> : <BellRing className="size-4 shrink-0 text-sky-600" />}
                      <span className="line-clamp-1">{item.title || "Bildirim"}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.message}</p>
                    {item.createdAt ? (
                      <p className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString("tr-TR")}</p>
                    ) : null}
                  </div>
                  {!item.isRead ? (
                    <button
                      type="button"
                      onClick={() => markRead(item._id)}
                      className="shrink-0 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-800"
                    >
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
