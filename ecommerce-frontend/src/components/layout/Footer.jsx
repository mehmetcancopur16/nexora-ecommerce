import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { toast } from "sonner"
import { useState } from "react"
import { useNewsletterSubscribe } from "../../hooks/useNewsletterSubscribe"

const MotionDiv = motion.div

const quickLinks = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Urunler", to: "/products" },
  { label: "Sepet", to: "/cart" },
  { label: "Profil", to: "/profile" },
]

const helpLinks = [
  { label: "Iade Politikasi", to: "/iade-politikasi" },
  { label: "Teslimat Bilgisi", to: "/teslimat" },
  { label: "Gizlilik", to: "/gizlilik" },
  { label: "Destek", to: "/destek" },
]

const socialLinks = [
  { href: "https://www.facebook.com/", label: "Facebook", short: "f" },
  { href: "https://www.instagram.com/", label: "Instagram", short: "ig" },
  { href: "https://www.linkedin.com/", label: "LinkedIn", short: "in" },
  { href: "https://www.x.com/", label: "X", short: "x" },
]

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
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
          <motion.div variants={columnVariants} className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-nexora-primary transition hover:opacity-90">
              <Sparkles size={22} className="text-nexora-primary" />
              Nexora
            </Link>
            <p className="max-w-sm text-sm leading-7 text-nexora-muted">
              Premium e-ticaret deneyimi, guvenli odeme altyapisi ve guclu lojistik agi ile modern alisverisin yeni
              standardi.
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 min-w-10 items-center justify-center rounded-full border border-nexora-line bg-white/90 px-3 text-xs font-bold uppercase tracking-wide text-nexora-text shadow-sm transition hover:-translate-y-0.5 hover:border-nexora-primary hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2"
                >
                  {item.short}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Hizli Linkler</h3>
            <div className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block text-sm text-nexora-muted transition hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Yardim ve Politika</h3>
            <div className="mt-4 space-y-2">
              {helpLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block text-sm text-nexora-muted transition hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary focus-visible:ring-offset-2 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-nexora-text">Iletisim</h3>
            <div className="mt-4 space-y-3 text-sm text-nexora-muted">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-nexora-primary" />
                Istanbul, Turkiye
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-nexora-primary" />
                <a href="tel:+902120000000" className="hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary rounded">
                  +90 212 000 00 00
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-nexora-primary" />
                <a href="mailto:hello@nexora.com" className="hover:text-nexora-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-primary rounded">
                  hello@nexora.com
                </a>
              </p>
            </div>
          </motion.div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-nexora-line bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.5)] sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bulten</p>
              <h3 className="mt-2 text-xl font-semibold sm:text-2xl">Kampanya ve yeniliklerden haberdar ol</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                E-posta adresinizi birakin; ozel firsatlar ve stok haberleri dogrudan gelen kutuna gelsin.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:min-w-[420px]">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                E-posta
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                autoComplete="email"
                className="min-h-12 w-full rounded-xl border border-slate-600 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
              >
                {loading ? "Gonderiliyor..." : "Kaydol"}
                {!loading ? <Send size={16} /> : null}
              </button>
            </form>
          </div>
        </MotionDiv>
      </div>

      <div className="relative border-t border-nexora-line bg-white/80 py-5 text-center text-xs text-nexora-muted backdrop-blur-sm">
        Copyright {new Date().getFullYear()} Nexora. Tum haklari saklidir.
      </div>
    </footer>
  )
}

export default Footer
