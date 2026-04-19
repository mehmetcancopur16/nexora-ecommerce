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
    <div className="pb-12 pt-2">
      <nav className="mx-auto mb-6 max-w-6xl px-4 text-sm text-nexora-muted sm:px-6 lg:px-8">
        <Link to="/" className="transition hover:text-nexora-primary">
          Ana Sayfa
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-nexora-text">{breadcrumbLabel}</span>
      </nav>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12 lg:px-8">
        <Motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative hidden overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br from-sky-100/90 via-white to-rose-100/70 p-8 shadow-xl shadow-slate-900/5 lg:flex lg:flex-col lg:justify-between lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 size-56 rounded-full bg-rose-200/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-900">
              <Sparkles className="size-3.5" aria-hidden />
              Nexora
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-nexora-text sm:text-3xl">
              <span className="nexora-gradient-text">Alışverişin dijital merkezi</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
              Binlerce ürün, güvenli ödeme ve kişiselleştirilmiş hesap deneyimi. Giriş yapın veya birkaç dakikada üye olun.
            </p>
          </div>

          <ul className="relative mt-10 space-y-4">
            {highlights.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-nexora-primary shadow-sm">
                  {createElement(icon, { className: "size-4", "aria-hidden": true })}
                </span>
                {text}
              </li>
            ))}
          </ul>

          <p className="relative mt-8 flex items-center gap-2 text-xs text-slate-500">
            <Lock className="size-3.5 shrink-0" aria-hidden />
            Oturumunuz SSL ile korunur; şifreniz güvenli biçimde saklanır.
          </p>
        </Motion.aside>

        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-full"
        >
          <div className="mb-6 rounded-2xl border border-sky-100/80 bg-gradient-to-r from-sky-50/90 to-rose-50/80 p-4 text-center lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-900">Nexora</p>
            <p className="mt-1 text-sm text-slate-600">Güvenli ödeme ve hızlı teslimat ile alışveriş.</p>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-nexora-text sm:text-4xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
          </div>

          <div className="nexora-glass rounded-3xl border border-white/70 p-6 shadow-2xl shadow-slate-900/10 sm:p-8">{children}</div>
        </Motion.div>
      </div>
    </div>
  )
}

export default AuthPageLayout
