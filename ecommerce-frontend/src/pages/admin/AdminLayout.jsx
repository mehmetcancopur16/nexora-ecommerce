import { NavLink, Outlet } from "react-router"

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Urunler", to: "/admin/products" },
  { label: "Siparisler", to: "/admin/orders" },
  { label: "Kullanicilar", to: "/admin/users" },
]

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="bg-slate-900 p-5 text-slate-200">
          <h1 className="text-2xl font-bold text-white">Nexora Admin</h1>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-sky-500 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
