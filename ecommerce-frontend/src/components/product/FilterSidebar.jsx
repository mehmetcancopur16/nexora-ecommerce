import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function FilterSidebar({ categories, filters, onChangeFilters, idPrefix = "catalog" }) {
  const [searchValue, setSearchValue] = useState(filters.search)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL / sıfırlama ile store’dan senkron
    setSearchValue(filters.search)
  }, [filters.search])

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    setSearchValue(nextValue)
    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      const trimmed = nextValue.trim()
      onChangeFilters({
        search: nextValue,
        startsWith: trimmed.length === 1 ? trimmed.toUpperCase() : "",
      })
    }, 400)
  }

  useEffect(
    () => () => {
      clearTimeout(debounceTimerRef.current)
    },
    []
  )

  const searchId = `${idPrefix}-product-search`

  return (
    <aside className="nexora-glass h-fit overflow-hidden rounded-2xl border border-white/70 shadow-lg shadow-slate-900/5">
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/50 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-nexora-text">Filtrele</h2>
        <p className="mt-1 text-xs text-slate-500">Kategori ve arama ile koleksiyonu daraltın.</p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700" htmlFor={searchId}>
            <Search className="size-4 text-nexora-primary" aria-hidden />
            Arama
          </label>
          <div className="relative">
            <input
              id={searchId}
              type="search"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Ürün adı yazın…"
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200/90 bg-white/95 py-2.5 pl-3 pr-3 text-sm outline-none ring-sky-100 transition placeholder:text-slate-400 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Baslangic harfi</p>
          <div className="grid grid-cols-7 gap-2">
            {LETTERS.map((letter) => {
              const active = filters.startsWith === letter
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() =>
                    onChangeFilters({
                      startsWith: active ? "" : letter,
                      search: active ? filters.search : letter,
                    })
                  }
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-nexora-primary bg-nexora-primary text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-nexora-primary/40 hover:text-nexora-primary"
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">Kategoriler</p>
          <div className="max-h-[min(52vh,22rem)] space-y-1 overflow-y-auto pr-1">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50">
              <input
                type="radio"
                name={`${idPrefix}-category`}
                value=""
                checked={!filters.category}
                onChange={() => onChangeFilters({ category: "" })}
                className="size-4 accent-nexora-primary"
              />
              <span className="font-medium">Tüm kategoriler</span>
            </label>

            {categories.map((category) => (
              <label
                key={category._id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name={`${idPrefix}-category`}
                  value={category._id}
                  checked={filters.category === category._id}
                  onChange={() => onChangeFilters({ category: category._id })}
                  className="size-4 accent-nexora-primary"
                />
                <span className="line-clamp-2">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchValue("")
            clearTimeout(debounceTimerRef.current)
            onChangeFilters({ search: "", startsWith: "", category: "", sort: "newest", page: 1 })
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-nexora-primary/40 hover:bg-sky-50/80 hover:text-nexora-primary"
        >
          Filtreleri sıfırla
        </button>
      </div>
    </aside>
  )
}

export default FilterSidebar
