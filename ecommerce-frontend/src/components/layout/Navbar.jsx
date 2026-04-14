import { Link, NavLink } from "react-router"
import { useAuthStore } from "../../store/authStore"

function Navbar() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:flex-nowrap">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[#0ea5e9]">
          Nexora
        </Link>

        <div className="order-3 w-full md:order-none md:flex-1">
          <input
            type="search"
            placeholder="Ürün, kategori veya marka ara..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
          />
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <NavLink
            to="/cart"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
          >
            Sepet
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-[#0ea5e9]"
              >
                Giris
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-[#0ea5e9] px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
              >
                Kayit
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-[#0ea5e9]"
              >
                {user?.name || "Profil"}
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Cikis
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
