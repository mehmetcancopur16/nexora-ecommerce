import { ChevronDown } from "lucide-react"
import { useState } from "react"

function SupportFaq({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null)

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm transition hover:border-sky-200/80"
          >
            <button
              type="button"
              id={`faq-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-nexora-text sm:px-5 sm:text-base"
            >
              {item.question}
              <ChevronDown
                className={`size-5 shrink-0 text-nexora-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-${item.id}`}
                className="border-t border-slate-100 px-4 pb-4 pt-0 sm:px-5"
              >
                <p className="text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default SupportFaq
