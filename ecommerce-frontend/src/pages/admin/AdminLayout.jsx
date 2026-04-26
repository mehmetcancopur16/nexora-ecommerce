import { motion as Motion } from "framer-motion"
import {
  BarChart3,
  Boxes,
  CirclePercent,
  ClipboardList,
  LayoutDashboard,
  MessageSquareMore,
  Settings,
  Star,
  Tag,
  Users,
} from "lucide-react"
import { NavLink, Outlet } from "react-router"
import { useAuthStore } from "../../store/authStore"

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Urunler", to: "/admin/products", icon: Boxes },
  { label: "Siparisler", to: "/admin/orders", icon: ClipboardList },
  { label: "Kullanicilar", to: "/admin/users", icon: Users },
  { label: "Kategoriler", to: "/admin/categories", icon: Tag },
  { label: "Kuponlar", to: "/admin/coupons", icon: CirclePercent },
  { label: "Yorumlar", to: "/admin/reviews", icon: Star },
  { label: "Raporlar", to: "/admin/reports", icon: BarChart3 },
  { label: "Ayarlar", to: "/admin/settings", icon: Settings },
  { label: "Destek Kutusu", to: "/admin/support-inbox", icon: MessageSquareMore },
]

function AdminLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="relative overflow-hidden bg-slate-950 p-5 text-slate-200">
          <div className="pointer-events-none absolute -left-14 -top-16 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white">Nexora Admin</h1>
            <p className="mt-1 text-xs text-slate-400">Full control center</p>
          </div>
          <nav className="relative mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
              )
            })}
          </nav>
        </aside>

        <main className="p-4 md:p-6">
          <Motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-6 overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-6 py-5 text-white shadow-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/80">Admin panel</p>
                <h2 className="mt-1 text-2xl font-bold">Kontrol Merkezi</h2>
              </div>
              <div className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-right backdrop-blur">
                <p className="text-xs text-white/80">Oturum</p>
                <p className="text-sm font-semibold">{user?.email || "admin@nexora.local"}</p>
              </div>
            </div>
          </Motion.header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
