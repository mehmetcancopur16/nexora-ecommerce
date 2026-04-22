import { Mail, MapPin, Phone, Send, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { toast } from "sonner"
import { useState } from "react"
import { useNewsletterSubscribe } from "../../hooks/useNewsletterSubscribe"

const MotionDiv = motion.div

const quickLinks = [
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
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "https://www.x.com/",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
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
  const [email, setEmail] = useState("")
  const { subscribe, loading } = useNewsletterSubscribe("footer")

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
                  href="tel:+902120000000"
                  className="rounded hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary"
                >
                  +90 212 000 00 00
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-nexora-primary" />
                <a
                  href="mailto:hello@nexora.com"
                  className="rounded hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary"
                >
                  hello@nexora.com
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
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
              >
                {loading ? "Gönderiliyor..." : "Kaydol"}
                {!loading && <Send size={16} />}
              </button>
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
