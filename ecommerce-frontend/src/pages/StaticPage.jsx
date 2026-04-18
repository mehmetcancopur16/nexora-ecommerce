import { STATIC_PAGES } from "./staticContent"
import PolicyPageLayout from "../components/legal/PolicyPageLayout"

function StaticPage({ pageKey }) {
  const page = STATIC_PAGES[pageKey]

  if (!page) {
    return null
  }

  return (
    <PolicyPageLayout title={page.title} description={page.description}>
      {page.sections.map((section) => (
        <article key={section.heading} className="border-b border-nexora-line pb-10 last:border-0">
          <h2 className="text-xl font-semibold text-nexora-text">{section.heading}</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-nexora-muted">
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </article>
      ))}
      <p className="text-xs uppercase tracking-[0.14em] text-nexora-muted">{page.updatedLabel}</p>
    </PolicyPageLayout>
  )
}

export default StaticPage
