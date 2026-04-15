import { useEffect, useState } from "react"

function FilterSidebar({ categories, filters, onChangeFilters }) {
  const [searchValue, setSearchValue] = useState(filters.search)

  useEffect(() => {
    setSearchValue(filters.search)
  }, [filters.search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onChangeFilters({ search: searchValue })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchValue, filters.search, onChangeFilters])

  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-nexora-text">Filtrele</h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="product-search">
            Arama
          </label>
          <input
            id="product-search"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Urun ara..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">Kategoriler</p>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onChangeFilters({ category: "" })}
                className="size-4 accent-nexora-primary"
              />
              Tum Kategoriler
            </label>

            {categories.map((category) => (
              <label
                key={category._id}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={filters.category === category._id}
                  onChange={() => onChangeFilters({ category: category._id })}
                  className="size-4 accent-nexora-primary"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchValue("")
            onChangeFilters({ search: "", category: "", page: 1 })
          }}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary"
        >
          Filtreleri Temizle
        </button>
      </div>
    </aside>
  )
}

export default FilterSidebar
