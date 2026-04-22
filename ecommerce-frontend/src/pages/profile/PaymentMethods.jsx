import { useEffect, useState } from "react"
import { CreditCard, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

const EMPTY_FORM = {
  holderName: "",
  brand: "VISA",
  last4: "",
  expiryMonth: 12,
  expiryYear: new Date().getFullYear() + 1,
  tokenRef: "",
}

function PaymentMethods() {
  const [methods, setMethods] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMethods = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/payment-methods")
      setMethods(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Odeme yontemleri yuklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMethods()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      await axiosInstance.post("/payment-methods", form)
      setForm(EMPTY_FORM)
      await fetchMethods()
      toast.success("Odeme yontemi eklendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Odeme yontemi eklenemedi.")
    }
  }

  const setDefault = async (id) => {
    await axiosInstance.patch(`/payment-methods/${id}/default`)
    await fetchMethods()
  }

  const remove = async (id) => {
    await axiosInstance.delete(`/payment-methods/${id}`)
    await fetchMethods()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Yeni Odeme Yontemi</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {Object.keys(EMPTY_FORM).map((field) => (
            <input
              key={field}
              value={form[field]}
              onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
              placeholder={field}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
          ))}
        </div>
        <button type="submit" className="mt-4 rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white">
          Ekle
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ) : (
          methods.map((method) => (
            <article key={method._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <CreditCard className="size-4" aria-hidden />
                    {method.brand} **** {method.last4}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{method.holderName}</p>
                </div>
                {method.isDefault ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    Varsayilan
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {!method.isDefault ? (
                  <button type="button" onClick={() => setDefault(method._id)} className="inline-flex items-center gap-1 text-sm text-nexora-primary">
                    <Star className="size-4" aria-hidden />
                    Varsayilan Yap
                  </button>
                ) : null}
                <button type="button" onClick={() => remove(method._id)} className="inline-flex items-center gap-1 text-sm text-rose-600">
                  <Trash2 className="size-4" aria-hidden />
                  Sil
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default PaymentMethods
