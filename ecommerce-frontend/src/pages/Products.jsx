import { useEffect } from "react"
import FilterSidebar from "../components/product/FilterSidebar"
import ProductCard from "../components/product/ProductCard"
import ProductSkeleton from "../components/product/ProductSkeleton"
import { useProductStore } from "../store/productStore"

function Products() {
  const products = useProductStore((state) => state.products)
  const categories = useProductStore((state) => state.categories)
  const filters = useProductStore((state) => state.filters)
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const fetchCategories = useProductStore((state) => state.fetchCategories)
  const setFilters = useProductStore((state) => state.setFilters)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchCategories, fetchProducts])

  const skeletonCards = Array.from({ length: 6 }, (_, index) => <ProductSkeleton key={index} />)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-nexora-text">Urun Katalogu</h1>
        <p className="mt-2 text-sm text-slate-500">
          Arama, kategori ve sayfalama ile urunleri kolayca kesfedin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar categories={categories} filters={filters} onChangeFilters={setFilters} />

        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && skeletonCards}
            {!loading && products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>

          {!loading && !products.length && !error && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
              <p className="text-lg font-semibold text-slate-700">Aradigin kriterlerde urun bulunamadi.</p>
              <p className="mt-1 text-sm text-slate-500">Filtreleri temizleyip tekrar deneyebilirsiniz.</p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={filters.page <= 1 || loading}
              onClick={() => setFilters({ page: filters.page - 1 })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Geri
            </button>

            {Array.from({ length: filters.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setFilters({ page: pageNumber })}
                disabled={loading}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pageNumber === filters.page
                    ? "bg-nexora-primary text-white"
                    : "border border-slate-200 text-slate-700 hover:border-nexora-primary hover:text-nexora-primary"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={filters.page >= filters.totalPages || loading}
              onClick={() => setFilters({ page: filters.page + 1 })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-nexora-primary hover:text-nexora-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ileri
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products
