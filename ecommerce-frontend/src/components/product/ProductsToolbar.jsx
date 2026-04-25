import { LayoutGrid, Rows3 } from "lucide-react"

const SORT_OPTIONS = [
  { value: "newest", label: "En yeni" },
  { value: "relevance", label: "Arama ile ilgili", needsSearch: true },
  { value: "price_asc", label: "Fiyat: düşük → yüksek" },
  { value: "price_desc", label: "Fiyat: yüksek → düşük" },
  { value: "name_asc", label: "İsim: A → Z" },
  { value: "name_desc", label: "İsim: Z → A" },
]

function ProductsToolbar({
  total,
  loading,
  sort,
  onSortChange,
  hasSearch,
  search,
  startsWith,
  category,
  onClearFilter,
  gridMode,
  onGridModeChange,
}) {
  const visibleSortOptions = SORT_OPTIONS.filter((opt) => !opt.needsSearch || hasSearch)
  const chips = [
    search?.trim() ? { key: "search", label: `Arama: ${search}` } : null,
    startsWith ? { key: "startsWith", label: `Harf: ${startsWith}` } : null,
    category ? { key: "category", label: "Kategori secili" } : null,
  ].filter(Boolean)

  return (
    <div className="nexora-glass flex flex-col gap-4 rounded-2xl border border-white/60 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-600">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-3 animate-spin rounded-full border-2 border-nexora-primary border-t-transparent" />
              Ürünler yükleniyor…
            </span>
          ) : (
            <>
              <span className="font-semibold text-nexora-text">{total}</span> ürün listeleniyor
            </>
          )}
        </p>
        {!!chips.length && (
          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => onClearFilter(chip.key)}
                className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                {chip.label} ×
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="whitespace-nowrap font-medium">Sırala</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2 text-sm font-medium text-nexora-text shadow-sm outline-none transition focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
          >
            {visibleSortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div
          className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white/80 p-1 sm:ml-0"
          role="group"
          aria-label="Izgara yoğunluğu"
        >
          <button
            type="button"
            onClick={() => onGridModeChange("comfortable")}
            className={`rounded-lg p-2 transition ${
              gridMode === "comfortable"
                ? "bg-nexora-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            title="Geniş kartlar"
          >
            <Rows3 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onGridModeChange("compact")}
            className={`rounded-lg p-2 transition ${
              gridMode === "compact"
                ? "bg-nexora-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            title="Daha fazla sütun"
          >
            <LayoutGrid className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductsToolbar
