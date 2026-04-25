import { AnimatePresence, motion as Motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Filter, Sparkles, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router"
import FilterSidebar from "../components/product/FilterSidebar"
import ProductCard from "../components/product/ProductCard"
import ProductSkeleton from "../components/product/ProductSkeleton"
import ProductsToolbar from "../components/product/ProductsToolbar"
import { useProductStore } from "../store/productStore"

function getImplicitSort(search) {
  return search?.trim() ? "relevance" : "newest"
}

function buildPageList(current, total) {
  if (total < 1) return []
  if (total <= 9) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }
  const pages = new Set([1, total])
  for (let index = current - 2; index <= current + 2; index += 1) {
    if (index >= 1 && index <= total) {
      pages.add(index)
    }
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let index = 0; index < sorted.length; index += 1) {
    if (index > 0 && sorted[index] - sorted[index - 1] > 1) {
      result.push("ellipsis")
    }
    result.push(sorted[index])
  }
  return result
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [gridMode, setGridMode] = useState(() => {
    if (typeof window === "undefined") return "comfortable"
    const saved = window.localStorage.getItem("products_grid_mode")
    if (saved === "compact" || saved === "comfortable") return saved
    return window.matchMedia("(min-width: 1280px)").matches ? "compact" : "comfortable"
  })

  const products = useProductStore((state) => state.products)
  const categories = useProductStore((state) => state.categories)
  const filters = useProductStore((state) => state.filters)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const fetchCategories = useProductStore((state) => state.fetchCategories)
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const setFilters = useProductStore((state) => state.setFilters)
  const hydratedFromUrl = useRef(false)
  const ensuredInitialFetch = useRef(false)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    const querySearch = searchParams.get("search") || ""
    const queryStartsWith = searchParams.get("startsWith") || ""
    const queryCategory = searchParams.get("category") || ""
    const queryPage = Number(searchParams.get("page") || 1)
    const querySortRaw = searchParams.get("sort")
    const querySort = querySortRaw || getImplicitSort(querySearch)
    const page = Number.isNaN(queryPage) || queryPage < 1 ? 1 : queryPage

    const current = useProductStore.getState().filters
    const isSame =
      current.search === querySearch &&
      current.startsWith === queryStartsWith &&
      current.category === queryCategory &&
      current.page === page &&
      current.sort === querySort

    if (hydratedFromUrl.current && isSame) {
      return
    }
    hydratedFromUrl.current = true

    setFilters({
      search: querySearch,
      startsWith: queryStartsWith,
      category: queryCategory,
      page,
      sort: querySort,
    })
  }, [searchParams, setFilters])

  useEffect(() => {
    const nextParams = new URLSearchParams()
    if (filters.search) nextParams.set("search", filters.search)
    if (filters.startsWith) nextParams.set("startsWith", filters.startsWith)
    if (filters.category) nextParams.set("category", filters.category)
    if (filters.page > 1) nextParams.set("page", String(filters.page))
    const implicitSort = getImplicitSort(filters.search)
    if (filters.sort !== implicitSort) {
      nextParams.set("sort", filters.sort)
    }

    const current = searchParams.toString()
    const next = nextParams.toString()
    if (current !== next) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [filters.search, filters.startsWith, filters.category, filters.page, filters.sort, searchParams, setSearchParams])

  useEffect(() => {
    if (!hydratedFromUrl.current) return
    if (!ensuredInitialFetch.current && !loading && products.length === 0 && !error) {
      ensuredInitialFetch.current = true
      fetchProducts()
    }
  }, [error, fetchProducts, loading, products.length])

  useEffect(() => {
    window.localStorage.setItem("products_grid_mode", gridMode)
  }, [gridMode])

  useEffect(() => {
    if (!mobileFiltersOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileFiltersOpen])

  const gridClassName = useMemo(() => {
    if (gridMode === "compact") {
      return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
    return "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
  }, [gridMode])

  const skeletonCount = gridMode === "compact" ? 8 : 6
  const skeletonCards = useMemo(
    () => Array.from({ length: skeletonCount }, (_, index) => <ProductSkeleton key={index} />),
    [skeletonCount]
  )

  const pageItems = useMemo(() => buildPageList(filters.page, filters.totalPages), [filters.page, filters.totalPages])

  const hasSearch = Boolean(filters.search?.trim())

  const handleSortChange = useCallback(
    (value) => {
      setFilters({ sort: value })
    },
    [setFilters]
  )

  return (
    <div className="space-y-8 pb-10">
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 px-6 py-8 shadow-xl shadow-slate-900/5 sm:px-10"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-full bg-rose-200/35 blur-3xl" />

        <nav className="relative text-xs font-medium text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="transition hover:text-nexora-primary" to="/">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden className="text-slate-300">
              /
            </li>
            <li className="text-nexora-text">Ürünler</li>
          </ol>
        </nav>

        <div className="relative mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              <Sparkles className="size-3.5" aria-hidden />
              Koleksiyon
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="nexora-gradient-text">Ürün kataloğu</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Arama, kategori ve akıllı sıralama ile binlerce ürün arasında gezinin. Kartları geniş veya sıkı ızgara
              düzeninde görüntüleyin.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-nexora-text shadow-sm transition hover:border-nexora-primary/50 lg:hidden"
            >
              <Filter className="size-4" />
              Filtreler
            </button>
          </div>
        </div>
      </Motion.div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
        <div className="hidden lg:block">
          <FilterSidebar categories={categories} filters={filters} onChangeFilters={setFilters} idPrefix="desktop" />
        </div>

        <div className="min-w-0 space-y-6">
          <ProductsToolbar
            total={filters.total}
            loading={loading}
            sort={filters.sort}
            onSortChange={handleSortChange}
            hasSearch={hasSearch}
            search={filters.search}
            startsWith={filters.startsWith}
            category={filters.category}
            onClearFilter={(key) => setFilters({ [key]: "" })}
            gridMode={gridMode}
            onGridModeChange={setGridMode}
          />

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 shadow-sm"
            >
              {error}
            </div>
          )}

          <div className={gridClassName}>
            {loading && skeletonCards}
            {!loading && products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>

          {!loading && !products.length && !error && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center shadow-inner"
            >
              <p className="text-lg font-semibold text-slate-800">Bu kriterlere uygun ürün bulunamadı</p>
              <p className="mt-2 text-sm text-slate-500">
                Aramayı, harf filtresini veya kategoriyi değiştirin; filtreleri sıfırlayıp yeniden deneyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ search: "", startsWith: "", category: "", sort: "newest", page: 1 })}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600"
              >
                Tüm ürünleri göster
              </button>
            </Motion.div>
          )}

          {filters.totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
              aria-label="Sayfa navigasyonu"
            >
              <button
                type="button"
                disabled={filters.page <= 1 || loading}
                onClick={() => setFilters({ page: filters.page - 1 })}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
                Önceki
              </button>

              {pageItems.map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`e-${index}`} className="px-2 text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilters({ page: item })}
                    disabled={loading}
                    className={`min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      item === filters.page
                        ? "bg-nexora-primary text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-nexora-primary hover:text-nexora-primary"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={filters.page >= filters.totalPages || loading}
                onClick={() => setFilters({ page: filters.page + 1 })}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sonraki
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <Motion.div
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              aria-label="Filtreleri kapat"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <Motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative ml-auto flex h-full w-full max-w-md flex-col border-l border-white/20 bg-nexora-bg shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-nexora-text">Filtreler</p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Kapat"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar
                  categories={categories}
                  filters={filters}
                  onChangeFilters={async (next) => {
                    await setFilters(next)
                  }}
                  idPrefix="mobile"
                />
              </div>
            </Motion.aside>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Products
