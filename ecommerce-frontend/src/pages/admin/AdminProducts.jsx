import { useEffect, useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "")

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
}

const getImageSource = (imagePath) => {
  if (!imagePath) return "https://placehold.co/100x100/e2e8f0/64748b?text=Nexora"
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
  return `${API_BASE_URL}${imagePath}`
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formState, setFormState] = useState(emptyForm)
  const [selectedFiles, setSelectedFiles] = useState([])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/products", {
        params: { page: 1, limit: 100, includeInactive: true },
      })
      setProducts(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urunler yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories")
      setCategories(response?.data?.data || [])
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

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
      await fetchProducts()
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
      await fetchProducts()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Urun pasife alinamadi.")
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Urun Yonetimi</h2>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Yeni Urun Ekle
        </button>
      </div>

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
                  Yukleniyor...
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
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
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminProducts
