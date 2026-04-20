import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import AuthPageLayout from "../components/auth/AuthPageLayout"
import { registerSchema } from "../validations/auth.validation"
import { useAuthStore } from "../store/authStore"

function Register() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      privacyConsent: false,
    },
  })

  const onSubmit = async (values) => {
    try {
      await registerUser(values)
      toast.success("Hoş geldiniz! Hesabınız oluşturuldu.")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Kayıt sırasında bir hata oluştu.")
    }
  }

  const firstNameId = "register-first-name"
  const lastNameId = "register-last-name"
  const emailId = "register-email"
  const phoneId = "register-phone"
  const passwordId = "register-password"
  const confirmPasswordId = "register-confirm-password"
  const consentId = "register-privacy-consent"

  return (
    <AuthPageLayout
      title="Kayıt ol"
      subtitle="Birkaç bilgiyle üye olun; sipariş ve favorileriniz hesabınıza bağlansın."
      breadcrumbLabel="Kayıt"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
            Hesap bilgileri
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={firstNameId}>
                Ad
              </label>
              <input
                id={firstNameId}
                type="text"
                autoComplete="given-name"
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? `${firstNameId}-error` : undefined}
                placeholder="Adınız"
                className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
                  errors.firstName
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
                }`}
                {...register("firstName")}
              />
              {errors.firstName ? (
                <p id={`${firstNameId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={lastNameId}>
                Soyad
              </label>
              <input
                id={lastNameId}
                type="text"
                autoComplete="family-name"
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? `${lastNameId}-error` : undefined}
                placeholder="Soyadınız"
                className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
                  errors.lastName
                    ? "border-rose-400 ring-2 ring-rose-100"
                    : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
                }`}
                {...register("lastName")}
              />
              {errors.lastName ? (
                <p id={`${lastNameId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={emailId}>
            E-posta
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            placeholder="ornek@mail.com"
            className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
              errors.email
                ? "border-rose-400 ring-2 ring-rose-100"
                : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            }`}
            {...register("email")}
          />
          {errors.email ? (
            <p id={`${emailId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={phoneId}>
            Telefon numarası
          </label>
          <input
            id={phoneId}
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            placeholder="+90 5xx xxx xx xx"
            className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
              errors.phone
                ? "border-rose-400 ring-2 ring-rose-100"
                : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            }`}
            {...register("phone")}
          />
          {errors.phone ? (
            <p id={`${phoneId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.phone.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">Sipariş bildirimleri için kullanılacaktır.</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={passwordId}>
            Şifre
          </label>
          <div className="relative">
            <input
              id={passwordId}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
              placeholder="En az 8 karakter"
              className={`w-full rounded-xl border bg-white/95 py-2.5 pl-4 pr-12 text-sm outline-none transition ${
                errors.password
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
          {errors.password ? (
            <p id={`${passwordId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">
              En az 8 karakter kullanın, güvenliğiniz için güçlü bir şifre seçin.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={confirmPasswordId}>
            Şifre tekrarı
          </label>
          <div className="relative">
            <input
              id={confirmPasswordId}
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? `${confirmPasswordId}-error` : undefined}
              placeholder="Şifrenizi tekrar girin"
              className={`w-full rounded-xl border bg-white/95 py-2.5 pl-4 pr-12 text-sm outline-none transition ${
                errors.confirmPassword
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p id={`${confirmPasswordId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <label className="flex cursor-pointer items-start gap-3" htmlFor={consentId}>
            <input
              id={consentId}
              type="checkbox"
              className="mt-0.5 size-4 rounded border-slate-300 text-nexora-primary focus:ring-sky-300"
              aria-invalid={errors.privacyConsent ? "true" : "false"}
              aria-describedby={errors.privacyConsent ? `${consentId}-error` : undefined}
              {...register("privacyConsent")}
            />
            <span className="text-sm leading-5 text-slate-700">
              Gizlilik politikası ve kullanım koşullarını okudum, kabul ediyorum. Kişisel verilerimin
              hesap oluşturma ve sipariş süreçleri için işlenmesine onay veriyorum.{" "}
              <Link to="/gizlilik" className="font-semibold text-nexora-accent hover:underline">
                Gizlilik Politikası
              </Link>{" "}
              ve{" "}
              <Link to="/teslimat" className="font-semibold text-nexora-accent hover:underline">
                Kullanım Koşulları
              </Link>
              .
            </span>
          </label>
          {errors.privacyConsent ? (
            <p id={`${consentId}-error`} className="mt-2 text-xs text-rose-600" role="alert">
              {errors.privacyConsent.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          {isLoading ? "Yükleniyor…" : "Kayıt ol"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Zaten hesabınız var mı?{" "}
        <Link className="font-semibold text-nexora-accent hover:underline" to="/login">
          Giriş yapın
        </Link>
      </p>
    </AuthPageLayout>
  )
}

export default Register
