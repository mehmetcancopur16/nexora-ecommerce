import { motion as Motion } from "framer-motion"
import { Bell, CreditCard, Heart, House, Package, Settings2 } from "lucide-react"
import { NavLink, Outlet } from "react-router"

const tabs = [
  { label: "Hesap Ayarları", to: "/profile", icon: Settings2 },
  { label: "Siparişlerim", to: "/profile/orders", icon: Package },
  { label: "Favorilerim", to: "/profile/wishlist", icon: Heart },
  { label: "Adreslerim", to: "/profile/addresses", icon: House },
  { label: "Ödeme Yöntemleri", to: "/profile/payment-methods", icon: CreditCard },
  { label: "Bildirimler", to: "/profile/notifications", icon: Bell },
]

function ProfileLayout() {
  return (
    <section className="space-y-6">
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-slate-50/90 via-white to-sky-50/30 px-6 py-6 shadow-lg shadow-slate-200/40"
      >
        <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-sky-200/25 blur-2xl" />
        <h1 className="relative text-2xl font-bold text-nexora-text">Kullanıcı paneli</h1>
        <p className="relative mt-1 text-sm text-slate-600">Hesabınız, siparişler, iade talepleri ve favoriler tek yerde.</p>
      </Motion.div>

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-md backdrop-blur">
          <nav className="grid grid-cols-1 gap-1.5" aria-label="Profil menüsü">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === "/profile"}
                  className={({ isActive }) =>
                    `group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-nexora-primary to-sky-500 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-50 hover:text-nexora-primary"
                    }`
                  }
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {tab.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <Motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Outlet />
        </Motion.div>
      </div>
    </section>
  )
}

export default ProfileLayout
