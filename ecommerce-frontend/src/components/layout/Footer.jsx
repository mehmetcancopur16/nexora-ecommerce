import { Mail, MapPin, Phone, Send, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { toast } from "sonner"
import { useState } from "react"
import { useNewsletterSubscribe } from "../../hooks/useNewsletterSubscribe"
import Button from "../common/Button"
import { usePublicStoreSettings } from "../../hooks/usePublicStoreSettings"
import { useAuthStore } from "../../store/authStore"

const MotionDiv = motion.div

const guestQuickLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Ürünler", to: "/products" },
  { label: "Sepet", to: "/cart" },
  { label: "Giriş Yap", to: "/login" },
  { label: "Hesap Oluştur", to: "/register" },
]

const memberQuickLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Ürünler", to: "/products" },
  { label: "Sepet", to: "/cart" },
  { label: "Profil", to: "/profile" },
  { label: "Siparişlerim", to: "/profile/orders" },
  { label: "Bildirimler", to: "/profile/notifications" },
]

const helpLinks = [
  { label: "İade Politikası", to: "/iade-politikasi" },
  { label: "Teslimat Bilgisi", to: "/teslimat" },
  { label: "Sipariş Takibi", to: "/profile/orders" },
  { label: "Gizlilik Politikası", to: "/gizlilik" },
  { label: "Destek", to: "/destek" },
  { label: "Yardım Merkezi", to: "/destek" },
]

const socialLinks = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: <span className="text-xs font-bold">f</span>,
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: <span className="text-xs font-bold">ig</span>,
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: <span className="text-xs font-bold">in</span>,
  },
  {
    href: "https://www.x.com/",
    label: "X (Twitter)",
    icon: <span className="text-xs font-bold">x</span>,
  },
]

const paymentBadges = [
  { label: "Visa", bg: "bg-blue-600" },
  { label: "Mastercard", bg: "bg-red-600" },
  { label: "SSL", bg: "bg-emerald-600" },
  { label: "3D Secure", bg: "bg-slate-700" },
  { label: "iyzico", bg: "bg-violet-600" },
]

const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const columnVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function Footer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const settings = usePublicStoreSettings()
  const [email, setEmail] = useState("")
  const { subscribe, loading } = useNewsletterSubscribe("footer")
  const quickLinks = isAuthenticated ? memberQuickLinks : guestQuickLinks

  const handleNewsletter = async (event) => {
    event.preventDefault()
    const result = await subscribe(email, "footer")
    if (result.ok) {
      toast.success(result.message)
      setEmail("")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-nexora-line bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.2), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(244, 63, 94, 0.08), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <MotionDiv
          className="mb-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={gridContainerVariants}
        >
          {/* Brand */}
          <motion.div variants={columnVariants} className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-nexora-primary transition hover:opacity-90"
            >
              <Sparkles size={22} className="text-nexora-primary" />
              Nexora
            </Link>
            <p className="max-w-sm text-sm leading-7 text-nexora-muted">
              Premium e-ticaret deneyimi, güvenli ödeme altyapısı ve güçlü lojistik ağı ile modern
              alışverişin yeni standardı.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex size-10 items-center justify-center rounded-full border border-nexora-line bg-white/90 text-nexora-muted shadow-sm transition hover:-translate-y-0.5 hover:border-nexora-primary hover:text-nexora-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Hızlı Linkler</h3>
            <div className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded text-sm text-nexora-muted transition hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Help */}
          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Yardım ve Politika</h3>
            <div className="mt-4 space-y-2">
              {helpLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block rounded text-sm text-nexora-muted transition hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">İletişim</h3>
            <div className="mt-4 space-y-3 text-sm text-nexora-muted">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-nexora-primary" />
                İstanbul, Türkiye
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-nexora-primary" />
                <a
                  href={`tel:${(settings.supportPhone || "+90 212 000 00 00").replace(/\s+/g, "")}`}
                  className="rounded hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary"
                >
                  {settings.supportPhone || "+90 212 000 00 00"}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-nexora-primary" />
                <a
                  href={`mailto:${settings.supportEmail || "hello@nexora.com"}`}
                  className="rounded hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary"
                >
                  {settings.supportEmail || "hello@nexora.com"}
                </a>
              </p>
            </div>
          </motion.div>
        </MotionDiv>

        {/* Newsletter banner */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-nexora-line bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.5)] sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bülten</p>
              <h3 className="mt-2 text-xl font-semibold sm:text-2xl">Kampanya ve yeniliklerden haberdar ol</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                E-posta adresinizi bırakın; özel fırsatlar ve stok haberleri doğrudan gelen kutunuza gelsin.
              </p>
            </div>
            <form
              onSubmit={handleNewsletter}
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:min-w-[420px]"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">E-posta</label>
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                autoComplete="email"
                required
                className="min-h-12 w-full rounded-xl border border-slate-600 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 transition focus:border-white focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button type="submit" disabled={loading} variant="light" className="min-h-12 shrink-0 gap-2 px-6 text-slate-900">
                {loading ? "Gönderiliyor..." : "Kaydol"}
                {!loading && <Send size={16} />}
              </Button>
            </form>
          </div>
        </MotionDiv>

        {/* Payment security row */}
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-nexora-muted">
            <ShieldCheck size={15} className="text-emerald-500" />
            Güvenli Alışveriş
          </div>
          <div className="h-4 w-px bg-nexora-line" />
          {paymentBadges.map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex items-center rounded-md ${badge.bg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white`}
            >
              {badge.label}
            </span>
          ))}
        </MotionDiv>
      </div>

      {/* Copyright bar */}
      <div className="relative border-t border-nexora-line bg-white/80 py-5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center text-xs text-nexora-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} Nexora. Tüm hakları saklıdır. — İstanbul, Türkiye
          </span>
          <span className="flex items-center gap-1">
            Tasarım &amp; Geliştirme
            <Sparkles size={11} className="text-nexora-primary" />
            Nexora Ekibi
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
