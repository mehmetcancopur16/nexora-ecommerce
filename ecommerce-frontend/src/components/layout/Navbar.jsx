import { useEffect, useState } from "react"
import {
  Heart,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { Link, NavLink, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { selectCartItemCount } from "../../store/cartSelectors"

const MotionDiv = motion.div

const linkBase =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"

const navInactive = "text-slate-600 hover:bg-slate-100 hover:text-nexora-primary"
const navActive = "bg-gradient-to-r from-nexora-primary/15 to-nexora-accent/10 text-nexora-primary shadow-sm"

function navClass({ isActive }) {
  return `${linkBase} ${isActive ? navActive : navInactive}`
}

function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const itemCount = useCartStore(selectCartItemCount)
  const [searchText, setSearchText] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAdmin = user?.role === "admin"
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "Profil"

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
    <motion.header
      className="sticky top-0 z-30 border-b border-nexora-line/80 bg-gradient-to-b from-white/95 via-white/90 to-white/85 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl"
      initial={{ y: -8, opacity: 0.96 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nexora-primary/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap md:py-3.5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2 rounded-xl px-1 py-0.5 text-xl font-bold tracking-tight sm:text-2xl"
            >
              <span className="nexora-gradient-text flex items-center gap-2">
                <Sparkles
                  size={22}
                  className="text-nexora-primary transition duration-300 group-hover:rotate-12 group-hover:text-sky-500"
                />
                Nexora
              </span>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Ana navigasyon">
            <NavLink to="/" end className={navClass} title="Ana sayfa">
              <LayoutGrid size={16} strokeWidth={2} />
              <span className="hidden xl:inline">Ana Sayfa</span>
            </NavLink>
            <NavLink to="/products" className={navClass} title="Urunler">
              <ShoppingBag size={16} strokeWidth={2} />
              Urunler
            </NavLink>
            <NavLink to="/destek" className={navClass} title="Destek">
              <LifeBuoy size={16} strokeWidth={2} />
              Destek
            </NavLink>
          </nav>
        </div>

        <form
          className="order-3 w-full min-w-0 md:order-none md:mx-2 md:flex-1 lg:mx-4"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <div className="group flex items-center gap-2 rounded-2xl border border-nexora-line bg-white/90 px-3 py-2 shadow-inner shadow-slate-200/50 transition focus-within:border-nexora-primary focus-within:shadow-md focus-within:shadow-nexora-primary/10 group-focus-within:scale-[1.005]">
            <Search size={17} className="shrink-0 text-nexora-primary/80" aria-hidden />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Urun, kategori veya marka ara..."
              aria-label="Site icinde ara"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <motion.button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-nexora-dark to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ara
            </motion.button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-nexora-line bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-nexora-primary hover:text-nexora-primary md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? "Menuyu kapat" : "Menuyu ac"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Hesap ve sepet">
            {isAuthenticated && (
              <NavLink to="/profile/wishlist" className={navClass} title="Istek listesi">
                <Heart size={16} />
                <span className="hidden lg:inline">Istek Listesi</span>
              </NavLink>
            )}

            <NavLink to="/cart" className={navClass} title="Sepet">
              <span className="relative inline-flex">
                <ShoppingBag size={17} />
                {itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-nexora-accent to-rose-600 px-1 text-[10px] font-bold text-white shadow-sm">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline">Sepet</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? navActive : `${navInactive} border border-amber-200/80 bg-amber-50/80 text-amber-900`}`
                }
                title="Yonetim paneli"
              >
                <Shield size={16} />
                <span className="hidden xl:inline">Admin</span>
              </NavLink>
            )}

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass} title="Giris yap">
                  <User size={17} />
                  <span className="hidden sm:inline">Giris</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-nexora-primary text-white shadow-md" : "bg-gradient-to-r from-nexora-primary to-sky-500 text-white shadow-md hover:from-sky-500 hover:to-nexora-primary"}`
                  }
                  title="Kayit ol"
                >
                  <UserPlus size={17} />
                  <span className="hidden sm:inline">Kayit</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className={navClass} title="Profil">
                  <User size={17} />
                  <span className="max-w-[120px] truncate sm:max-w-[140px]">{displayName}</span>
                </NavLink>
                <motion.button
                  type="button"
                  onClick={() => {
                    logout()
                    closeMobileMenu()
                  }}
                  className={`${linkBase} border border-slate-200 bg-slate-900 text-white hover:bg-slate-800`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="Cikis yap"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Cikis</span>
                </motion.button>
              </>
            )}
          </nav>
        </div>

        {isMobileMenuOpen && (
          <MotionDiv
            id="mobile-nav-menu"
            className="order-4 w-full overflow-hidden rounded-2xl border border-nexora-line bg-gradient-to-b from-white to-slate-50/95 p-3 shadow-lg md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-col gap-1 border-b border-nexora-line pb-3">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nexora-muted">Sayfalar</p>
              <NavLink to="/" end onClick={closeMobileMenu} className={navClass}>
                <LayoutGrid size={17} />
                Ana Sayfa
              </NavLink>
              <NavLink to="/products" onClick={closeMobileMenu} className={navClass}>
                <ShoppingBag size={17} />
                Urunler
              </NavLink>
              <NavLink to="/destek" onClick={closeMobileMenu} className={navClass}>
                <LifeBuoy size={17} />
                Destek
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/profile/wishlist" onClick={closeMobileMenu} className={navClass}>
                  <Heart size={17} />
                  Istek Listesi
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMobileMenu} className={navClass}>
                  <Shield size={17} />
                  Admin Panel
                </NavLink>
              )}
            </div>
            <div className="flex flex-col gap-1 pt-3">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nexora-muted">Hesap</p>
              <NavLink to="/cart" onClick={closeMobileMenu} className={navClass}>
                <ShoppingBag size={17} />
                Sepet {itemCount > 0 ? `(${itemCount})` : ""}
              </NavLink>
              {!isAuthenticated ? (
                <>
                  <NavLink to="/login" onClick={closeMobileMenu} className={navClass}>
                    <User size={17} />
                    Giris
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className={`${linkBase} justify-center bg-gradient-to-r from-nexora-primary to-sky-500 text-white shadow-md`}
                  >
                    <UserPlus size={17} />
                    Kayit Ol
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/profile" onClick={closeMobileMenu} className={navClass}>
                    <User size={17} />
                    {displayName}
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      closeMobileMenu()
                    }}
                    className={`${linkBase} justify-center border border-slate-800 bg-slate-900 text-white`}
                  >
                    <LogOut size={17} />
                    Cikis Yap
                  </button>
                </>
              )}
            </div>
          </MotionDiv>
        )}
      </div>
    </motion.header>
  )
}

export default Navbar
