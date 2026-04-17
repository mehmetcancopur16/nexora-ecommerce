import { useEffect, useState } from "react"
import { Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { motion } from "framer-motion"
import { Link, NavLink, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
const MotionDiv = motion.div

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
    <header className="sticky top-0 z-30 border-b border-nexora-line bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-4 md:flex-nowrap sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2 text-2xl font-bold tracking-tight text-nexora-primary">
          <Sparkles size={20} className="transition group-hover:rotate-12" />
          Nexora
        </Link>

        <form className="order-3 w-full md:order-none md:flex-1" onSubmit={handleSearchSubmit}>
          <div className="flex items-center gap-2 rounded-xl border border-nexora-line bg-white px-3 py-2 shadow-sm focus-within:border-nexora-primary">
            <Search size={16} className="text-slate-400" />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Urun, kategori veya marka ara..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-nexora-dark px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
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
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav className="ml-auto hidden items-center gap-2 md:flex">
          <NavLink
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-lg border border-nexora-line px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary"
          >
            <ShoppingBag size={16} />
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
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-nexora-primary"
              >
                <User size={16} />
                Giris
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-nexora-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
              >
                Kayit
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/profile"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-nexora-primary"
              >
                <User size={16} />
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
          <MotionDiv
            className="order-4 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-2">
              <NavLink
                to="/cart"
                onClick={closeMobileMenu}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <ShoppingBag size={15} />
                Sepet {itemCount > 0 ? `(${itemCount})` : ""}
              </NavLink>
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    <User size={15} />
                    Giris
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-nexora-primary px-3 py-2 text-sm font-medium text-white"
                  >
                    Kayit
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    <User size={15} />
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
          </MotionDiv>
        )}
      </div>
    </header>
  )
}

export default Navbar
