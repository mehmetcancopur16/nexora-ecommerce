import { motion as Motion } from "framer-motion"
import { Bell, CreditCard, Heart, House, Package, RotateCcw, Settings2, Shield } from "lucide-react"
import { NavLink, Outlet } from "react-router"

const tabs = [
  { label: "Hesap Ayarlari", to: "/profile", icon: Settings2 },
  { label: "Siparislerim", to: "/profile/orders", icon: Package },
  { label: "Favorilerim", to: "/profile/wishlist", icon: Heart },
  { label: "Adreslerim", to: "/profile/addresses", icon: House },
  { label: "Odeme Yontemleri", to: "/profile/payment-methods", icon: CreditCard },
  { label: "Bildirimler", to: "/profile/notifications", icon: Bell },
  { label: "Guvenlik", to: "/profile/security", icon: Shield },
  { label: "Iadeler", to: "/profile/returns", icon: RotateCcw },
]

function ProfileLayout() {
  return (
    <section className="space-y-6">
      <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold text-nexora-text">Kullanici Paneli</h1>
        <p className="mt-2 text-sm text-slate-500">Hesabiniz, siparisleriniz ve favorileriniz tek ekranda.</p>
      </Motion.div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/profile"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-nexora-primary text-white"
                      : "text-slate-700 hover:bg-slate-50 hover:text-nexora-primary"
                  }`
                }
              >
                <Icon className="size-4" aria-hidden />
                {tab.label}
              </NavLink>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default ProfileLayout
