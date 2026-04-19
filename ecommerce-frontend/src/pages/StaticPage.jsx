import { createElement } from "react"
import {
  BadgePercent,
  ClipboardList,
  Database,
  HelpCircle,
  Mail,
  MapPin,
  Package,
  Scale,
  Shield,
  Truck,
} from "lucide-react"
import PolicyPageLayout from "../components/legal/PolicyPageLayout"
import { STATIC_PAGES } from "./staticContent"

const SECTION_ICONS = {
  clipboard: ClipboardList,
  package: Package,
  mail: Mail,
  truck: Truck,
  badgePercent: BadgePercent,
  mapPin: MapPin,
  database: Database,
  shield: Shield,
  scale: Scale,
  help: HelpCircle,
}

function StaticPage({ pageKey }) {
  const page = STATIC_PAGES[pageKey]

  if (!page) {
    return null
  }

  const tocSections = page.sections.map((section) => ({
    slug: section.slug,
    heading: section.heading,
  }))

  return (
    <PolicyPageLayout
      title={page.title}
      description={page.description}
      updatedLabel={page.updatedLabel}
      tocSections={tocSections}
      currentPageKey={page.pageKey}
    >
      <div className="space-y-6">
        {page.sections.map((section) => {
          const IconComponent = SECTION_ICONS[section.icon] || ClipboardList
          return (
            <article
              key={section.slug}
              id={section.slug}
              className="nexora-glass scroll-mt-28 rounded-2xl border border-white/70 p-5 shadow-md sm:p-6"
            >
              <h2 className="flex items-start gap-3 text-lg font-semibold text-nexora-text sm:text-xl">
                <span
                  className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-rose-50 text-nexora-primary shadow-sm"
                  aria-hidden
                >
                  {createElement(IconComponent, { className: "size-5" })}
                </span>
                <span>{section.heading}</span>
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </PolicyPageLayout>
  )
}

export default StaticPage
