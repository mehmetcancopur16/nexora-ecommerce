import { createElement } from "react"
import { motion as Motion } from "framer-motion"
import { Headphones, Lock, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { Link } from "react-router"

const highlights = [
  { icon: ShieldCheck, text: "Güvenli ödeme ve veri şifreleme" },
  { icon: Truck, text: "Hızlı teslimat ve kolay iade" },
  { icon: Headphones, text: "7/24 destek ve sipariş takibi" },
]

function AuthPageLayout({ title, subtitle, breadcrumbLabel, children }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden pb-14 pt-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky-200/60 to-transparent" />

      <nav className="mx-auto mb-8 max-w-6xl px-4 text-sm text-nexora-muted sm:px-6 lg:px-8">
        <Link to="/" className="font-medium transition hover:text-nexora-primary">
          Ana Sayfa
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-medium text-nexora-text">{breadcrumbLabel}</span>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14 lg:px-8">
        <Motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden overflow-hidden rounded-[1.75rem] border border-white/60 bg-gradient-to-br from-sky-100/95 via-white to-rose-100/75 p-10 shadow-2xl shadow-slate-900/10 ring-1 ring-white/80 lg:flex lg:flex-col lg:justify-between"
        >
          <div className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-8 size-64 rounded-full bg-rose-300/30 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22100%22%20height=%22100%22%20viewBox=%220%200%20100%20100%22%3E%3Cdefs%3E%3Cpattern%20id=%22g%22%20width=%2210%22%20height=%2210%22%20patternUnits=%22userSpaceOnUse%22%3E%3Cpath%20d=%22M%2010%200%20L%200%200%200%2010%22%20fill=%22none%22%20stroke=%22%230ea5e9%22%20stroke-opacity=%220.06%22%20stroke-width=%220.5%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width=%22100%22%20height=%22100%22%20fill=%22url(%23g)%22/%3E%3C/svg%3E')] opacity-70" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-sky-950 shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-sky-600" aria-hidden />
              Nexora
            </div>
            <h2 className="mt-7 text-3xl font-bold tracking-tight text-nexora-text sm:text-[2rem]">
              <span className="nexora-gradient-text">Alışverişin dijital merkezi</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
              Binlerce ürün, güvenli ödeme ve kişiselleştirilmiş hesap deneyimi. Giriş yapın veya birkaç dakikada üye olun.
            </p>
          </div>

          <ul className="relative mt-12 space-y-5">
            {highlights.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3.5 text-sm text-slate-700">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-nexora-primary shadow-md shadow-sky-900/5 ring-1 ring-slate-100">
                  {createElement(icon, { className: "size-[18px]", "aria-hidden": true })}
                </span>
                <span className="pt-1.5 leading-snug">{text}</span>
              </li>
            ))}
          </ul>

          <p className="relative mt-10 flex items-center gap-2 text-xs text-slate-500">
            <Lock className="size-3.5 shrink-0 text-slate-400" aria-hidden />
            Oturumunuz SSL ile korunur; şifreniz güvenli biçimde saklanır.
          </p>
        </Motion.aside>

        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="mb-6 rounded-2xl border border-sky-100/90 bg-gradient-to-r from-sky-50/95 to-rose-50/85 p-4 text-center shadow-sm shadow-slate-900/5 lg:hidden">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-950">Nexora</p>
            <p className="mt-1.5 text-sm text-slate-600">Güvenli ödeme ve hızlı teslimat ile alışveriş.</p>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-[1.75rem] font-bold tracking-tight text-nexora-text sm:text-4xl">{title}</h1>
            {subtitle ? (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 lg:mx-0 mx-auto">{subtitle}</p>
            ) : null}
          </div>

          <div className="nexora-glass relative overflow-hidden rounded-[1.75rem] border border-white/80 p-6 shadow-2xl shadow-slate-900/12 ring-1 ring-slate-200/40 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-rose-200/25 blur-3xl" />
            <div className="relative">{children}</div>
          </div>
        </Motion.div>
      </div>
    </div>
  )
}

export default AuthPageLayout
