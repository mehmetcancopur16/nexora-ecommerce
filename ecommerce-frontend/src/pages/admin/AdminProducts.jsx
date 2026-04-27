import { AnimatePresence, motion as Motion } from "framer-motion"
import { Funnel, Loader2, PackageSearch, Plus, RefreshCw, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import axiosInstance, { API_BASE_URL } from "../../api/axiosInstance"

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  sku: "",
}

const getImageSource = (imagePath) => {
  if (!imagePath) return "https://placehold.co/100x100/e2e8f0/64748b?text=Nexora"
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
  return `${API_BASE_URL.replace(/\/api$/, "")}${imagePath}`
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formState, setFormState] = useState(emptyForm)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sort: "newest",
    status: "all",
    search: "",
    category: "",
  })
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const fetchProducts = useCallback(async ({ silent = false } = {}) => {
    if (silent) setIsRefreshing(true)
    else setIsLoading(true)
    try {
      const includeInactive = filters.status !== "active"
      const response = await axiosInstance.get("/products", {
        params: {
          page: filters.page,
          limit: filters.limit,
          sort: filters.sort,
          search: filters.search?.trim() || undefined,
          category: filters.category || undefined,
          includeInactive,
          active: filters.status,
        },
      })
      setProducts(response?.data?.data || [])
      setPagination({
        total: response?.data?.pagination?.total || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urunler yuklenemedi.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [filters.category, filters.limit, filters.page, filters.search, filters.sort, filters.status])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/categories")
      setCategories(response?.data?.data || [])
    } catch {
      setCategories([])
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const currentCategoryLabel = useMemo(
    () => categories.find((item) => item._id === filters.category)?.name || "Tum kategoriler",
    [categories, filters.category]
  )

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormState(emptyForm)
    setSelectedFiles([])
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormState({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      category: product.category?._id || product.category || "",
      brand: product.brand || "",
      sku: product.sku || "",
    })
    setSelectedFiles([])
    setIsModalOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    const payload = {
      name: formState.name,
      description: formState.description,
      price: Number(formState.price),
      stock: Number(formState.stock),
      category: formState.category,
      brand: formState.brand?.trim() || undefined,
      sku: formState.sku?.trim() || undefined,
    }

    try {
      let productId = editingProduct?._id
      if (editingProduct) {
        await axiosInstance.put(`/products/${productId}`, payload)
        toast.success("Urun guncellendi.")
      } else {
        const createResponse = await axiosInstance.post("/products", payload)
        productId = createResponse?.data?.data?._id
        toast.success("Urun eklendi.")
      }

      if (selectedFiles.length > 0 && productId) {
        const formData = new FormData()
        selectedFiles.forEach((file) => formData.append("images", file))
        await axiosInstance.post(`/products/${productId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Urun gorselleri yuklendi.")
      }

      setIsModalOpen(false)
      await fetchProducts({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urun kaydedilemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSoftDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`)
      toast.success("Urun pasife alindi.")
      await fetchProducts({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urun pasife alinamadi.")
    }
  }

  const handleReactivate = async (id) => {
    try {
      await axiosInstance.put(`/products/${id}`, { isActive: true })
      toast.success("Urun tekrar aktif edildi.")
      await fetchProducts({ silent: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urun aktif edilemedi.")
    }
  }

  return (
    <section className="space-y-5">
      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Urun Yonetimi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Toplam {pagination.total} urun, {currentCategoryLabel} kategorisinde {products.length} kayit goruntuleniyor.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchProducts({ silent: true })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              <Plus className="size-4" />
              Yeni Urun
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Urun ara..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <select
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value, page: 1 }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Tum kategoriler</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="all">Tum durumlar</option>
            <option value="active">Sadece aktif</option>
            <option value="inactive">Sadece pasif</option>
          </select>
          <select
            value={filters.sort}
            onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value, page: 1 }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            <option value="newest">En yeni</option>
            <option value="name_asc">Isim A-Z</option>
            <option value="name_desc">Isim Z-A</option>
            <option value="price_asc">Fiyat artan</option>
            <option value="price_desc">Fiyat azalan</option>
          </select>
        </div>
      </Motion.div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Resim</th>
              <th className="px-4 py-3">Isim</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Islem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Yukleniyor...
                  </span>
                </td>
              </tr>
            ) : !products.length ? (
              <tr>
                <td className="px-4 py-8" colSpan={6}>
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                    <PackageSearch className="size-7 text-slate-400" />
                    <p className="font-medium text-slate-700">Filtreye uygun urun bulunamadi.</p>
                    <p className="text-xs">Arama/filtre degerlerini degistirip tekrar deneyin.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <img
                      src={getImageSource(product.images?.[0])}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-slate-700">{Number(product.price || 0).toFixed(2)} TL</td>
                  <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Duzenle
                      </button>
                      {product.isActive && (
                        <button
                          type="button"
                          onClick={() => handleSoftDelete(product._id)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600"
                        >
                          Pasife Al
                        </button>
                      )}
                      {!product.isActive && (
                        <button
                          type="button"
                          onClick={() => handleReactivate(product._id)}
                          className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700"
                        >
                          Aktif Et
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <div className="inline-flex items-center gap-1.5 text-slate-500">
          <Funnel className="size-4" />
          Sayfa {filters.page} / {pagination.totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={filters.page <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Onceki
          </button>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
            disabled={filters.page >= pagination.totalPages}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          >
            <Motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            >
            <h3 className="text-xl font-semibold text-slate-900">
              {editingProduct ? "Urun Duzenle" : "Yeni Urun Ekle"}
            </h3>
            <form className="mt-4 space-y-3" onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Urun adi"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                required
              />
              <textarea
                placeholder="Aciklama"
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                rows={3}
              />
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Fiyat"
                  value={formState.price}
                  onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stok"
                  value={formState.stock}
                  onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
                <select
                  value={formState.category}
                  onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                >
                  <option value="">Kategori Sec</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Marka"
                  value={formState.brand || ""}
                  onChange={(event) => setFormState((prev) => ({ ...prev, brand: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={formState.sku || ""}
                  onChange={(event) => setFormState((prev) => ({ ...prev, sku: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Gorseller</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Vazgec
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default AdminProducts
