import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"
import { useAuthStore } from "../../store/authStore"
import { passwordUpdateSchema, profileUpdateSchema } from "../../validations/profile.validation"

function AccountSettings() {
  const user = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      city: "",
      zip: "",
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
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

  useEffect(() => {
    resetProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      zip: user?.address?.zip || "",
    })
  }, [user, resetProfileForm])

  const onSubmitProfile = async (values) => {
    try {
      await axiosInstance.patch("/users/profile", {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
          zip: values.zip,
        },
      })
      await checkAuth()
      toast.success("Profil bilgileriniz guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profil bilgileri guncellenemedi.")
    }
  }

  const onSubmitPassword = async (values) => {
    try {
      await axiosInstance.patch("/users/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      resetPasswordForm()
      toast.success("Sifreniz basariyla guncellendi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Sifre guncellenemedi.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Profil Guncelleme</h2>
        <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit(onSubmitProfile)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Ad</label>
              <input
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  profileErrors.firstName
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerProfile("firstName")}
              />
              {profileErrors.firstName && (
                <p className="mt-1 text-xs text-rose-600">{profileErrors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Soyad</label>
              <input
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  profileErrors.lastName
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerProfile("lastName")}
              />
              {profileErrors.lastName && (
                <p className="mt-1 text-xs text-rose-600">{profileErrors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">E-posta</label>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Telefon</label>
            <input
              type="tel"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                profileErrors.phone
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...registerProfile("phone")}
            />
            {profileErrors.phone && (
              <p className="mt-1 text-xs text-rose-600">{profileErrors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Sokak</label>
              <input
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  profileErrors.street
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerProfile("street")}
              />
              {profileErrors.street && (
                <p className="mt-1 text-xs text-rose-600">{profileErrors.street.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Sehir</label>
              <input
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  profileErrors.city
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerProfile("city")}
              />
              {profileErrors.city && (
                <p className="mt-1 text-xs text-rose-600">{profileErrors.city.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Posta Kodu</label>
              <input
                type="text"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  profileErrors.zip
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerProfile("zip")}
              />
              {profileErrors.zip && (
                <p className="mt-1 text-xs text-rose-600">{profileErrors.zip.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isProfileSubmitting}
            className="rounded-xl bg-nexora-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isProfileSubmitting ? "Kaydediliyor..." : "Profili Kaydet"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Sifre Guncelleme</h2>
        <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit(onSubmitPassword)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Eski Sifre</label>
            <input
              type="password"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                passwordErrors.currentPassword
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...registerPassword("currentPassword")}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-xs text-rose-600">{passwordErrors.currentPassword.message}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Yeni Sifre</label>
              <input
                type="password"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  passwordErrors.newPassword
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerPassword("newPassword")}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-600">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Yeni Sifre Tekrar</label>
              <input
                type="password"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                  passwordErrors.confirmPassword
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                }`}
                {...registerPassword("confirmPassword")}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isPasswordSubmitting}
            className="rounded-xl bg-nexora-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPasswordSubmitting ? "Guncelleniyor..." : "Sifreyi Guncelle"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountSettings
