import { zodResolver } from "@hookform/resolvers/zod"
import { motion as Motion } from "framer-motion"
import { Check, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"
import SearchableSelect from "../../components/common/SearchableSelect"
import { addressFormSchema } from "../../validations/profile.validation"
import { TURKEY_PROVINCES, getDistrictsForProvince } from "../../utils/turkiyeAddress"

const PROVINCE_NAMES = TURKEY_PROVINCES.map((p) => p.name).sort((a, b) => a.localeCompare(b, "tr-TR"))

const defaultFormValues = {
  label: "",
  city: "",
  district: "",
  postalCode: "",
  openAddress: "",
  country: "Türkiye",
  isDefault: false,
}

function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: defaultFormValues,
  })

  const cityValue = watch("city")

  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/users/addresses")
      setAddresses(response?.data?.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adresler yüklenemedi.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const districtOptions = getDistrictsForProvince(cityValue)

  const toPayload = (data) => ({
    label: (data.label && data.label.trim()) || "Ev",
    city: data.city,
    district: data.district,
    postalCode: data.postalCode,
    openAddress: data.openAddress,
    country: data.country || "Türkiye",
    isDefault: Boolean(data.isDefault),
  })

  const onAdd = async (data) => {
    try {
      await axiosInstance.post("/users/addresses", toPayload(data))
      reset(defaultFormValues)
      await fetchAddresses()
      toast.success("Adres eklendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adres eklenemedi.")
    }
  }

  const onUpdate = async (data) => {
    if (!editing) return
    try {
      await axiosInstance.patch(`/users/addresses/${editing._id}`, toPayload(data))
      setEditing(null)
      reset(defaultFormValues)
      await fetchAddresses()
      toast.success("Adres güncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adres güncellenemedi.")
    }
  }

  const startEdit = (addr) => {
    setEditing(addr)
    reset({
      label: addr.label || "",
      city: addr.city || "",
      district: addr.district || "",
      postalCode: addr.postalCode || addr.zip || "",
      openAddress: addr.openAddress || addr.street || "",
      country: addr.country || "Türkiye",
      isDefault: Boolean(addr.isDefault),
    })
  }

  const handleDelete = async (addressId) => {
    try {
      const response = await axiosInstance.delete(`/users/addresses/${addressId}`)
      setAddresses(response?.data?.data || [])
      toast.success("Adres silindi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Adres silinemedi.")
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const response = await axiosInstance.patch(`/users/addresses/${addressId}/default`)
      setAddresses(response?.data?.data || [])
      toast.success("Varsayılan adres güncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Güncellenemedi.")
    }
  }

  return (
    <div className="space-y-8">
      <Motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 px-6 py-8 shadow-xl shadow-slate-900/5"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-sky-200/30 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-nexora-primary/10 text-nexora-primary">
            <MapPin className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-nexora-text">Adreslerim</h1>
            <p className="mt-1 text-sm text-slate-600">
              İl ve ilçe seçin; teslimat için açık adres ve posta kodu ekleyin. Varsayılan adres ödeme ekranında otomatik
              önerilir.
            </p>
          </div>
        </div>
      </Motion.header>

      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50"
      >
        <h2 className="text-lg font-semibold text-slate-800">{editing ? "Adresi düzenle" : "Yeni adres ekle"}</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={handleSubmit(editing ? onUpdate : onAdd)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Adres adı (örn. Ev, İş)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                placeholder="Ev"
                {...register("label")}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Ülke</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                {...register("country")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="İl"
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v)
                    setValue("district", "")
                  }}
                  options={PROVINCE_NAMES}
                  placeholder="İl adı yazın (ör. K → K ile başlayan iller)"
                  error={errors.city?.message}
                />
              )}
            />
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="İlçe"
                  value={field.value}
                  onChange={field.onChange}
                  options={districtOptions}
                  disabled={!cityValue}
                  placeholder={cityValue ? "İlçe seçin veya yazın" : "Önce il seçin"}
                  error={errors.district?.message}
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Posta kodu</label>
            <input
              type="text"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
                errors.postalCode ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("postalCode")}
            />
            {errors.postalCode && <p className="mt-1 text-xs text-rose-600">{errors.postalCode.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Açık adres</label>
            <textarea
              rows={3}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none ${
                errors.openAddress ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              placeholder="Mahalle, sokak, bina no, daire"
              {...register("openAddress")}
            />
            {errors.openAddress && <p className="mt-1 text-xs text-rose-600">{errors.openAddress.message}</p>}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="size-4 rounded border-slate-300" {...register("isDefault")} />
            Varsayılan adres yap
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              {editing ? <Check className="size-4" /> : <Plus className="size-4" aria-hidden />}
              {isSubmitting ? "Kaydediliyor..." : editing ? "Güncelle" : "Adres ekle"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  reset(defaultFormValues)
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                İptal
              </button>
            ) : null}
          </div>
        </form>
      </Motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200/80" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200/80" />
          </>
        ) : (
          addresses.map((address) => (
            <Motion.article
              layout
              key={address._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{address.label || "Adres"}</p>
                  {address.isDefault ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      <Star className="size-3" aria-hidden />
                      Varsayılan
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(address)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-nexora-primary"
                    title="Düzenle"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address._id)}
                    className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                    title="Sil"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {address.openAddress || address.street}
                <br />
                {address.district && `${address.district}, `}
                {address.city} {address.postalCode || address.zip}
                <br />
                {address.country}
              </p>
              {!address.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(address._id)}
                  className="mt-3 text-sm font-semibold text-nexora-primary hover:underline"
                >
                  Varsayılan yap
                </button>
              ) : null}
            </Motion.article>
          ))
        )}
        {!isLoading && addresses.length === 0 ? (
          <p className="col-span-2 text-center text-sm text-slate-500">Henüz kayıtlı adresiniz yok.</p>
        ) : null}
      </div>
    </div>
  )
}

export default Addresses
