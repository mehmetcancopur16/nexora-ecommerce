import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import AuthPageLayout from "../components/auth/AuthPageLayout"
import { loginSchema } from "../validations/auth.validation"
import { useAuthStore } from "../store/authStore"

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success("Hoş geldiniz!")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Giriş sırasında bir hata oluştu.")
    }
  }

  const identifierId = "login-identifier"
  const passwordId = "login-password"
  const rememberMeId = "login-remember-me"
  const identifierErrId = `${identifierId}-error`
  const passwordErrId = `${passwordId}-error`

  return (
    <AuthPageLayout
      title="Giriş yap"
      subtitle="Hesabınıza erişin ve Nexora deneyimine kaldığınız yerden devam edin."
      breadcrumbLabel="Giriş"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
            Hesabınıza güvenli giriş
          </div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={identifierId}>
            E-posta veya telefon
          </label>
          <input
            id={identifierId}
            type="text"
            autoComplete="username"
            aria-invalid={errors.identifier ? "true" : "false"}
            aria-describedby={errors.identifier ? identifierErrId : undefined}
            placeholder="ornek@mail.com veya +90 5xx xxx xx xx"
            className={`w-full rounded-xl border bg-white/95 px-4 py-2.5 text-sm outline-none transition ${
              errors.identifier
                ? "border-rose-400 ring-2 ring-rose-100"
                : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            }`}
            {...register("identifier")}
          />
          {errors.identifier ? (
            <p id={identifierErrId} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.identifier.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">Kayıtlı e-posta adresinizi veya telefon numaranızı kullanın.</p>
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
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? passwordErrId : undefined}
              placeholder="Şifrenizi giriniz"
              className={`w-full rounded-xl border bg-white/95 py-2.5 pl-4 pr-12 text-sm outline-none transition ${
                errors.password
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              tabIndex={0}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
          {errors.password ? (
            <p id={passwordErrId} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500">Şifreniz en az 8 karakterden oluşmalıdır.</p>
          )}
        </div>

        <label
          htmlFor={rememberMeId}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <span>
            <span className="block text-sm font-medium text-slate-700">Beni hatırla</span>
            <span className="block text-xs text-slate-500">
              İşaretlerseniz bu cihazda oturumunuz kalıcı olarak açık kalır.
            </span>
          </span>
          <input
            id={rememberMeId}
            type="checkbox"
            className="size-4 rounded border-slate-300 text-nexora-primary focus:ring-sky-300"
            {...register("rememberMe")}
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-accent px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          {isLoading ? "Yükleniyor…" : "Giriş yap"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Hesabınız yok mu?{" "}
        <Link className="font-semibold text-nexora-primary hover:underline" to="/register">
          Kayıt olun
        </Link>
      </p>
    </AuthPageLayout>
  )
}

export default Login
