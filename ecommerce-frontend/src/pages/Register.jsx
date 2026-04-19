import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
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

  const nameId = "register-name"
  const emailId = "register-email"
  const passwordId = "register-password"

  return (
    <AuthPageLayout
      title="Kayıt ol"
      subtitle="Birkaç bilgiyle üye olun; sipariş ve favorileriniz hesabınıza bağlansın."
      breadcrumbLabel="Kayıt"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={nameId}>
            Ad soyad
          </label>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            placeholder="Adınız ve soyadınız"
            className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
              errors.name
                ? "border-rose-400 ring-2 ring-rose-100"
                : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            }`}
            {...register("name")}
          />
          {errors.name ? (
            <p id={`${nameId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.name.message}
            </p>
          ) : null}
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
