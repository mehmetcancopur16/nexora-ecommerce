import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"

function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const itemCount = useCartStore((state) => state.itemCount)
  const [searchText, setSearchText] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {})
    }
  }, [isAuthenticated, fetchCart])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchText.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:flex-nowrap">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[#0ea5e9]">
          Nexora
        </Link>

        <form className="order-3 w-full md:order-none md:flex-1" onSubmit={handleSearchSubmit}>
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Urun, kategori veya marka ara..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
            />
            <button
              type="submit"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
            >
              Ara
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="ml-auto rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
        >
          {isMobileMenuOpen ? "Kapat" : "Menu"}
        </button>

        <nav className="ml-auto hidden items-center gap-2 md:flex">
          <NavLink
            to="/cart"
            className="relative rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
          >
            Sepet
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-nexora-accent px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
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
                onClick={() => {
                  logout()
                  closeMobileMenu()
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Cikis
              </button>
            </>
          )}
        </nav>

        {isMobileMenuOpen && (
          <div className="order-4 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/cart"
                onClick={closeMobileMenu}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Sepet {itemCount > 0 ? `(${itemCount})` : ""}
              </NavLink>
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    Giris
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-[#0ea5e9] px-3 py-2 text-sm font-medium text-white"
                  >
                    Kayit
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {user?.name || "Profil"}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Cikis
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
