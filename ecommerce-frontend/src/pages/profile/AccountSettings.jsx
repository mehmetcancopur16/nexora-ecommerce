import { zodResolver } from "@hookform/resolvers/zod"
import { motion as Motion } from "framer-motion"
import { Eye, EyeOff, KeyRound, Link2, Sparkles, User } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"
import SearchableSelect from "../../components/common/SearchableSelect"
import { useAuthStore } from "../../store/authStore"
import { passwordUpdateSchema, profileUpdateSchema } from "../../validations/profile.validation"
import { TURKEY_PROVINCES, getDistrictsForProvince } from "../../utils/turkiyeAddress"

const PROVINCE_NAMES = TURKEY_PROVINCES.map((p) => p.name).sort((a, b) => a.localeCompare(b, "tr-TR"))

function passwordStrengthScore(pw) {
  if (!pw || !pw.length) return 0
  let s = 0
  if (pw.length >= 8) s += 1
  if (pw.length >= 12) s += 1
  if (/[A-Z]/.test(pw)) s += 1
  if (/[a-z]/.test(pw)) s += 1
  if (/[0-9]/.test(pw)) s += 1
  if (/[^A-Za-z0-9]/.test(pw)) s += 1
  return Math.min(5, s)
}

function AccountSettings() {
  const user = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  const completionFields = [
    user?.firstName,
    user?.lastName,
    user?.phone,
    user?.address?.openAddress || user?.address?.street,
    user?.address?.city,
    user?.address?.postalCode || user?.address?.zip,
  ]
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    control: profileControl,
    reset: resetProfileForm,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      district: "",
      postalCode: "",
      openAddress: "",
    },
  })

  const cityVal = useWatch({ control: profileControl, name: "city", defaultValue: "" })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    control: passwordControl,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    resolver: zodResolver(passwordUpdateSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPw = useWatch({ control: passwordControl, name: "newPassword", defaultValue: "" })
  const strength = useMemo(() => passwordStrengthScore(newPw || ""), [newPw])
  const strengthLabel = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Güçlü", "Çok güçlü"][strength] || "—"

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    resetProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      city: user?.address?.city || "",
      district: user?.address?.district || "",
      postalCode: user?.address?.postalCode || user?.address?.zip || "",
      openAddress: user?.address?.openAddress || user?.address?.street || "",
    })
  }, [user, resetProfileForm])

  const onSubmitProfile = async (values) => {
    try {
      await axiosInstance.patch("/users/profile", {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        address: {
          city: values.city,
          district: values.district,
          postalCode: values.postalCode,
          openAddress: values.openAddress,
        },
      })
      await checkAuth()
      toast.success("Profil bilgileriniz güncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profil güncellenemedi.")
    }
  }

  const onSubmitPassword = async (values) => {
    try {
      await axiosInstance.patch("/users/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      resetPasswordForm()
      setShowCurrent(false)
      setShowNew(false)
      setShowConfirm(false)
      toast.success("Şifreniz güncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Şifre güncellenemedi.")
    }
  }

  const districtOptions = getDistrictsForProvince(cityVal)

  return (
    <div className="space-y-8">
      <Motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-sky-50/90 via-white to-rose-50/40 p-6 shadow-xl"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-sky-200/30 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-nexora-primary/10 text-nexora-primary">
              <User className="size-6" />
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-700">
                <Sparkles className="size-3.5" />
                Profil
              </p>
              <h1 className="text-2xl font-bold text-nexora-text">Hesap ayarları</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm">
              <span className="text-slate-500">Tamamlanma</span>{" "}
              <span className="font-bold text-nexora-primary">%{completion}</span>
            </div>
            <Link
              to="/profile/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-300"
            >
              <Link2 className="size-3.5" />
              Siparişler & iadeler
            </Link>
            <Link
              to="/profile/addresses"
              className="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              Adresler
            </Link>
          </div>
        </div>
      </Motion.header>

      <Motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-slate-900">Profil</h2>
        <p className="mt-1 text-sm text-slate-500">Kişisel bilgi ve fatura/teslimat için kullanılan adres.</p>
        <form className="mt-5 space-y-4" onSubmit={handleProfileSubmit(onSubmitProfile)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Ad</label>
              <input
                className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                  profileErrors.firstName ? "border-rose-400" : "border-slate-200"
                }`}
                {...registerProfile("firstName")}
              />
              {profileErrors.firstName && <p className="mt-1 text-xs text-rose-600">{profileErrors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Soyad</label>
              <input
                className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                  profileErrors.lastName ? "border-rose-400" : "border-slate-200"
                }`}
                {...registerProfile("lastName")}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">E-posta</label>
              <input type="email" readOnly value={user?.email || ""} className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Telefon</label>
              <input
                className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                  profileErrors.phone ? "border-rose-400" : "border-slate-200"
                }`}
                {...registerProfile("phone")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="city"
              control={profileControl}
              render={({ field }) => (
                <SearchableSelect
                  label="İl"
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v)
                    setProfileValue("district", "")
                  }}
                  options={PROVINCE_NAMES}
                  placeholder="İl adı (ör. K yazınca K ile başlayanlar)"
                  error={profileErrors.city?.message}
                />
              )}
            />
            <Controller
              name="district"
              control={profileControl}
              render={({ field }) => (
                <SearchableSelect
                  label="İlçe"
                  value={field.value}
                  onChange={field.onChange}
                  options={districtOptions}
                  disabled={!cityVal}
                  placeholder="İlçe"
                  error={profileErrors.district?.message}
                />
              )}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Posta kodu</label>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                profileErrors.postalCode ? "border-rose-400" : "border-slate-200"
              }`}
              {...registerProfile("postalCode")}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Açık adres</label>
            <textarea
              rows={3}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm ${
                profileErrors.openAddress ? "border-rose-400" : "border-slate-200"
              }`}
              {...registerProfile("openAddress")}
            />
            {profileErrors.openAddress && <p className="mt-1 text-xs text-rose-600">{profileErrors.openAddress.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isProfileSubmitting}
            className="rounded-xl bg-nexora-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60"
          >
            {isProfileSubmitting ? "Kaydediliyor..." : "Profili kaydet"}
          </button>
        </form>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-900/5 to-white p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 text-slate-900">
          <KeyRound className="size-5 text-nexora-primary" />
          <h2 className="text-xl font-semibold">Şifre güncelleme</h2>
        </div>
        <p className="mt-1 text-sm text-slate-600">En az 8 karakter; büyük, küçük harf ve rakam içermelidir.</p>

        <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit(onSubmitPassword)}>
          {[
            { name: "currentPassword", label: "Mevcut şifre", show: showCurrent, set: setShowCurrent },
            { name: "newPassword", label: "Yeni şifre", show: showNew, set: setShowNew },
            { name: "confirmPassword", label: "Yeni şifre tekrar", show: showConfirm, set: setShowConfirm },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="mb-1 block text-xs font-medium text-slate-600">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  autoComplete={field.name === "newPassword" ? "new-password" : "current-password"}
                  className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm ${
                    passwordErrors[field.name] ? "border-rose-400" : "border-slate-200"
                  }`}
                  {...registerPassword(field.name)}
                />
                <button
                  type="button"
                  onClick={() => field.set((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  {field.show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors[field.name] && (
                <p className="mt-1 text-xs text-rose-600">{passwordErrors[field.name]?.message}</p>
              )}
            </div>
          ))}

          {newPw && (
            <div className="space-y-1.5">
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs font-medium text-slate-600">Şifre gücü: {strengthLabel}</p>
              <ul className="text-xs text-slate-500 list-disc pl-4 space-y-0.5">
                <li>En az bir büyük ve bir küçük harf</li>
                <li>En az bir rakam</li>
                <li>Daha iyi için 12+ karakter ve sembol</li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="rounded-xl bg-nexora-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600 disabled:opacity-60"
          >
            {isPasswordSubmitting ? "Güncelleniyor..." : "Şifreyi güncelle"}
          </button>
        </form>
      </Motion.div>
    </div>
  )
}

export default AccountSettings
