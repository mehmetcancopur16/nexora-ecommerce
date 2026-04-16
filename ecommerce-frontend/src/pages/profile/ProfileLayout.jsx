import { NavLink, Outlet } from "react-router"

const tabs = [
  { label: "Hesap Ayarlari", to: "/profile" },
  { label: "Siparislerim", to: "/profile/orders" },
  { label: "Favorilerim", to: "/profile/wishlist" },
]

function ProfileLayout() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-nexora-text">Kullanici Paneli</h1>
        <p className="mt-2 text-sm text-slate-500">Hesabiniz, siparisleriniz ve favorileriniz tek ekranda.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/profile"}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-nexora-primary text-white"
                      : "text-slate-700 hover:bg-slate-50 hover:text-nexora-primary"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
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
