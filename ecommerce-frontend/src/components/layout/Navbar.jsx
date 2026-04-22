import { AnimatePresence, motion } from "framer-motion"
import {
  AddressBook,
  Bell,
  CheckCheck,
  Heart,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { useNotificationStore } from "../../store/notificationStore"
import { selectCartItemCount } from "../../store/cartSelectors"

const MotionDiv = motion.div

const linkBase =
  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"
const navInactive = "text-slate-600 hover:bg-slate-100 hover:text-nexora-primary"
const navActive = "bg-gradient-to-r from-nexora-primary/15 to-nexora-accent/10 text-nexora-primary shadow-sm"

function navClass({ isActive }) {
  return `${linkBase} ${isActive ? navActive : navInactive}`
}

function getInitials(user) {
  if (!user) return "U"
  const first = user.firstName?.charAt(0) || ""
  const last = user.lastName?.charAt(0) || ""
  if (first || last) return `${first}${last}`.toUpperCase()
  return (user.email?.charAt(0) || "U").toUpperCase()
}

const notifTypeIcon = {
  order: "📦",
  security: "🔒",
  promotion: "🎁",
  system: "🔔",
}

function NotificationDropdown({ onClose }) {
  const notifications = useNotificationStore((s) => s.notifications)
  const isLoading = useNotificationStore((s) => s.isLoading)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const recent = notifications.slice(0, 6)

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-black/5"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          Bildirimler
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-nexora-accent px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-nexora-primary hover:underline"
          >
            <CheckCheck className="size-3.5" />
            Tümünü okundu yap
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
            <Bell className="size-8 opacity-40" />
            <p className="text-sm">Bildirim yok</p>
          </div>
        ) : (
          recent.map((n) => (
            <button
              key={n._id}
              type="button"
              onClick={() => markRead(n._id)}
              className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${!n.isRead ? "bg-sky-50/60" : ""}`}
            >
              <span className="mt-0.5 text-base">{notifTypeIcon[n.type] || "🔔"}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium leading-tight ${!n.isRead ? "text-slate-900" : "text-slate-600"}`}>
                  {n.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.message}</p>
              </div>
              {!n.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-nexora-primary" />}
            </button>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-2.5">
        <Link
          to="/profile/notifications"
          onClick={onClose}
          className="block text-center text-xs font-semibold text-nexora-primary hover:underline"
        >
          Tüm bildirimleri gör
        </Link>
      </div>
    </MotionDiv>
  )
}

function ProfileDropdown({ user, isAdmin, logout, onClose }) {
  const initials = getInitials(user)

  const items = [
    { label: "Profilim", to: "/profile", icon: User },
    { label: "Siparişlerim", to: "/profile/orders", icon: Package },
    { label: "Favorilerim", to: "/profile/wishlist", icon: Heart },
    { label: "Adreslerim", to: "/profile/addresses", icon: AddressBook },
  ]

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-black/5"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-nexora-primary to-sky-400 text-sm font-bold text-white shadow-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Kullanıcı"}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-nexora-primary"
          >
            <item.icon className="size-4 text-slate-400" />
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
          >
            <Shield className="size-4 text-amber-500" />
            Admin Paneli
          </Link>
        )}
      </div>

      <div className="border-t border-slate-100 p-1.5">
        <button
          type="button"
          onClick={() => { logout(); onClose() }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="size-4" />
          Çıkış Yap
        </button>
      </div>
    </MotionDiv>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const fetchCart = useCartStore((s) => s.fetchCart)
  const itemCount = useCartStore(selectCartItemCount)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const [searchText, setSearchText] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const isAdmin = user?.role === "admin"
  const initials = getInitials(user)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {})
      fetchNotifications()
    }
  }, [isAuthenticated, fetchCart, fetchNotifications])

  useEffect(() => {
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchText.trim()
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-nexora-line/80 bg-gradient-to-b from-white/95 via-white/90 to-white/85 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl"
      initial={{ y: -8, opacity: 0.96 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nexora-primary/45 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 md:flex-nowrap md:py-3.5 lg:px-8">
        {/* Brand + Nav */}
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
            <NavLink to="/" end className={navClass} title="Ana Sayfa">
              <LayoutGrid size={16} strokeWidth={2} />
              <span className="hidden xl:inline">Ana Sayfa</span>
            </NavLink>
            <NavLink to="/products" className={navClass} title="Ürünler">
              <ShoppingBag size={16} strokeWidth={2} />
              Ürünler
            </NavLink>
            <NavLink to="/destek" className={navClass} title="Destek">
              <LifeBuoy size={16} strokeWidth={2} />
              Destek
            </NavLink>
          </nav>
        </div>

        {/* Search */}
        <form
          className="order-3 w-full min-w-0 md:order-none md:mx-2 md:flex-1 lg:mx-4"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <div className="group flex items-center gap-2 rounded-2xl border border-nexora-line bg-white/90 px-3 py-2 shadow-inner shadow-slate-200/50 transition focus-within:border-nexora-primary focus-within:shadow-md focus-within:shadow-nexora-primary/10">
            <Search size={17} className="shrink-0 text-nexora-primary/80" aria-hidden />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Ürün, kategori veya marka ara..."
              aria-label="Sitede ara"
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

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="inline-flex items-center justify-center rounded-xl border border-nexora-line bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-nexora-primary hover:text-nexora-primary md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Hesap ve sepet">
            {/* Wishlist */}
            {isAuthenticated && (
              <NavLink to="/profile/wishlist" className={navClass} title="İstek Listesi">
                <Heart size={16} />
                <span className="hidden lg:inline">İstek Listesi</span>
              </NavLink>
            )}

            {/* Cart */}
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

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false) }}
                  className={`${linkBase} ${navInactive} relative`}
                  title="Bildirimler"
                  aria-label="Bildirimler"
                >
                  <span className="relative">
                    <Bell size={17} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-nexora-accent px-1 text-[9px] font-bold text-white shadow-sm">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="hidden xl:inline">Bildirimler</span>
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <NotificationDropdown onClose={() => setNotifOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth: logged-in avatar or login/register */}
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navClass} title="Giriş yap">
                  <User size={17} />
                  <span className="hidden sm:inline">Giriş</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-nexora-primary text-white shadow-md" : "bg-gradient-to-r from-nexora-primary to-sky-500 text-white shadow-md hover:from-sky-500 hover:to-nexora-primary"}`
                  }
                  title="Kayıt ol"
                >
                  <UserPlus size={17} />
                  <span className="hidden sm:inline">Kayıt</span>
                </NavLink>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false) }}
                  className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-nexora-primary to-sky-400 text-sm font-bold text-white shadow-md ring-2 ring-white transition hover:scale-105 hover:shadow-lg"
                  title="Profil menüsü"
                  aria-label="Profil menüsü"
                >
                  {initials}
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <ProfileDropdown
                      user={user}
                      isAdmin={isAdmin}
                      logout={logout}
                      onClose={() => setProfileOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <MotionDiv
              id="mobile-nav-menu"
              className="order-4 w-full overflow-hidden rounded-2xl border border-nexora-line bg-gradient-to-b from-white to-slate-50/95 p-3 shadow-lg md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex flex-col gap-1 border-b border-nexora-line pb-3">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nexora-muted">Sayfalar</p>
                <NavLink to="/" end onClick={closeMobileMenu} className={navClass}><LayoutGrid size={17} /> Ana Sayfa</NavLink>
                <NavLink to="/products" onClick={closeMobileMenu} className={navClass}><ShoppingBag size={17} /> Ürünler</NavLink>
                <NavLink to="/destek" onClick={closeMobileMenu} className={navClass}><LifeBuoy size={17} /> Destek</NavLink>
                {isAuthenticated && (
                  <>
                    <NavLink to="/profile/wishlist" onClick={closeMobileMenu} className={navClass}><Heart size={17} /> İstek Listesi</NavLink>
                    <NavLink to="/profile/notifications" onClick={closeMobileMenu} className={navClass}>
                      <Bell size={17} />
                      Bildirimler
                      {unreadCount > 0 && (
                        <span className="ml-auto rounded-full bg-nexora-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </NavLink>
                  </>
                )}
                {isAdmin && (
                  <NavLink to="/admin" onClick={closeMobileMenu} className={navClass}><Shield size={17} /> Admin Panel</NavLink>
                )}
              </div>
              <div className="flex flex-col gap-1 pt-3">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nexora-muted">Hesap</p>
                <NavLink to="/cart" onClick={closeMobileMenu} className={navClass}>
                  <ShoppingBag size={17} /> Sepet {itemCount > 0 ? `(${itemCount})` : ""}
                </NavLink>
                {!isAuthenticated ? (
                  <>
                    <NavLink to="/login" onClick={closeMobileMenu} className={navClass}><User size={17} /> Giriş</NavLink>
                    <NavLink to="/register" onClick={closeMobileMenu} className={`${linkBase} justify-center bg-gradient-to-r from-nexora-primary to-sky-500 text-white shadow-md`}>
                      <UserPlus size={17} /> Kayıt Ol
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/profile" onClick={closeMobileMenu} className={navClass}><User size={17} /> Profilim</NavLink>
                    <NavLink to="/profile/orders" onClick={closeMobileMenu} className={navClass}><Package size={17} /> Siparişlerim</NavLink>
                    <button
                      type="button"
                      onClick={() => { logout(); closeMobileMenu() }}
                      className={`${linkBase} justify-center border border-rose-200 bg-rose-50 text-rose-700`}
                    >
                      <LogOut size={17} /> Çıkış Yap
                    </button>
                  </>
                )}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Navbar
