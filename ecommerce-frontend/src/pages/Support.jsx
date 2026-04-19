import { createElement } from "react"
import { motion as Motion } from "framer-motion"
import { ClipboardList, Clock, HelpCircle, Mail, MapPin, Package, Phone, Sparkles } from "lucide-react"
import { Link } from "react-router"
import Container from "../components/common/Container"
import SupportContactForm from "../components/support/SupportContactForm"
import SupportFaq from "../components/support/SupportFaq"
import { SUPPORT_CONTACT, SUPPORT_FAQ } from "../data/supportContent"

const quickLinks = [
  { to: "/teslimat", label: "Teslimat", icon: Package },
  { to: "/iade-politikasi", label: "İade politikası", icon: HelpCircle },
  { to: "/profile/orders", label: "Siparişlerim", icon: ClipboardList },
]

function Support() {
  return (
    <section className="pb-16 pt-2">
      <Container>
        <nav className="mb-6 text-sm text-nexora-muted">
          <Link to="/" className="transition hover:text-nexora-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-nexora-text">Destek</span>
        </nav>

        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mb-10 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 px-6 py-10 shadow-xl shadow-slate-900/5 sm:px-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 size-48 rounded-full bg-rose-200/35 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
              <Sparkles className="size-3.5" aria-hidden />
              Yardım merkezi
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="nexora-gradient-text">Size nasıl yardımcı olabiliriz?</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Sık sorulan sorulara göz atın, iletişim bilgilerimizi kullanın veya formu doldurun; ekibimiz en kısa sürede
              size dönüş yapar.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {quickLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-nexora-primary/40 hover:bg-sky-50/90 hover:text-nexora-primary"
                >
                  {createElement(icon, { className: "size-4 text-nexora-primary", "aria-hidden": true })}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-nexora-text">
                <HelpCircle className="size-6 text-nexora-primary" aria-hidden />
                Sık sorulan sorular
              </h2>
              <p className="mt-1 text-sm text-slate-500">Bir soruya tıklayarak yanıtını açın.</p>
            </div>
            <SupportFaq items={SUPPORT_FAQ} />
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`mailto:${SUPPORT_CONTACT.email}`}
                className="nexora-glass flex flex-col gap-2 rounded-2xl border border-white/70 p-4 shadow-md transition hover:border-sky-200"
              >
                <Mail className="size-5 text-nexora-primary" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">E-posta</span>
                <span className="text-sm font-medium text-nexora-text">{SUPPORT_CONTACT.email}</span>
              </a>
              <div className="nexora-glass flex flex-col gap-2 rounded-2xl border border-white/70 p-4 shadow-md">
                <Phone className="size-5 text-nexora-primary" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telefon</span>
                <span className="text-sm font-medium text-nexora-text">{SUPPORT_CONTACT.phone}</span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="size-3.5" aria-hidden />
                  {SUPPORT_CONTACT.hours}
                </span>
              </div>
              <div className="nexora-glass flex flex-col gap-2 rounded-2xl border border-white/70 p-4 shadow-md sm:col-span-2">
                <MapPin className="size-5 text-nexora-primary" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Adres</span>
                <span className="text-sm font-medium text-nexora-text">{SUPPORT_CONTACT.address}</span>
              </div>
            </div>

            <SupportContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Support
