import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const EMPTY_FORM = { label: "", street: "", city: "", zip: "", country: "Turkiye", isDefault: false }

function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/users/addresses")
      setAddresses(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adresler yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAdd = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await axiosInstance.post("/users/addresses", form)
      setForm(EMPTY_FORM)
      await fetchAddresses()
      toast.success("Adres eklendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adres eklenemedi.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (addressId) => {
    try {
      await axiosInstance.delete(`/users/addresses/${addressId}`)
      setAddresses((prev) => prev.filter((item) => item._id !== addressId))
      toast.success("Adres silindi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adres silinemedi.")
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const response = await axiosInstance.patch(`/users/addresses/${addressId}/default`)
      setAddresses(response?.data?.data || [])
      toast.success("Varsayilan adres guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Varsayilan adres guncellenemedi.")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Yeni Adres Ekle</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["label", "street", "city", "zip", "country"].map((field) => (
            <input
              key={field}
              value={form[field]}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
              placeholder={field}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
          ))}
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
          />
          Varsayilan adres yap
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="size-4" aria-hidden />
          {isSaving ? "Ekleniyor..." : "Adres Ekle"}
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ) : (
          addresses.map((address) => (
            <article key={address._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{address.label}</p>
                {address.isDefault ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Varsayilan</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address._id)}
                    className="text-xs font-semibold text-nexora-primary hover:underline"
                  >
                    Varsayilan yap
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {address.street}, {address.city}, {address.zip}, {address.country}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(address._id)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-600"
              >
                <Trash2 className="size-4" aria-hidden />
                Sil
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default Addresses
