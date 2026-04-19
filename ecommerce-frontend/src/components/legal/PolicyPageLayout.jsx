import { motion as Motion } from "framer-motion"
import { BookOpen, Sparkles } from "lucide-react"
import { Link } from "react-router"
import Container from "../common/Container"
import { POLICY_QUICK_LINKS } from "../../data/policyLinks"

function PolicyPageLayout({
  title,
  description,
  updatedLabel,
  tocSections = [],
  currentPageKey,
  children,
}) {
  const relatedLinks = POLICY_QUICK_LINKS.filter((item) => item.key !== currentPageKey)

  return (
    <section className="pb-16 pt-2">
      <Container>
        <nav className="mb-6 text-sm text-nexora-muted">
          <Link to="/" className="transition hover:text-nexora-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-nexora-text">{title}</span>
        </nav>

        <Motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mb-10 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-10 sm:py-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-8 size-48 rounded-full bg-rose-200/35 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
              <Sparkles className="size-3.5" aria-hidden />
              Yasal bilgilendirme
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="nexora-gradient-text">{title}</span>
            </h1>
            {description ? (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
            ) : null}
          </div>
        </Motion.div>

        <div className="lg:hidden">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <BookOpen className="size-4 text-nexora-primary" aria-hidden />
            Bu sayfada
          </p>
          <nav aria-label="İçindekiler" className="flex flex-wrap gap-2">
            {tocSections.map((item) => (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className="rounded-full border border-slate-200/90 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-nexora-primary/40 hover:text-nexora-primary"
              >
                {item.heading}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-12">
          <aside className="hidden lg:block">
            <nav
              aria-label="İçindekiler"
              className="nexora-glass sticky top-24 rounded-2xl border border-white/70 p-4 shadow-md"
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BookOpen className="size-4 text-nexora-primary" aria-hidden />
                İçindekiler
              </p>
              <ul className="space-y-1 text-sm">
                {tocSections.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={`#${item.slug}`}
                      className="block rounded-lg px-2 py-1.5 text-slate-600 transition hover:bg-sky-50 hover:text-nexora-primary"
                    >
                      {item.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 space-y-8">
            {children}

            <p className="text-xs uppercase tracking-[0.14em] text-nexora-muted">{updatedLabel}</p>

            {relatedLinks.length > 0 ? (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-5 py-5">
                <p className="text-sm font-semibold text-nexora-text">Diğer politikalar</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {relatedLinks.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={item.to}
                        className="inline-flex rounded-xl border border-white bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-nexora-primary/40 hover:text-nexora-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default PolicyPageLayout
