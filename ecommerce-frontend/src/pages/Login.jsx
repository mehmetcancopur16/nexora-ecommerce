import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion as Motion } from "framer-motion"
import { Eye, EyeOff, Mail, ShieldCheck, Smartphone } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import AuthPageLayout from "../components/auth/AuthPageLayout"
import CountryDialSelect from "../components/auth/CountryDialSelect"
import { DEFAULT_DIAL } from "../data/countryDialCodes"
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
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      loginType: "email",
      email: "",
      phoneDial: DEFAULT_DIAL,
      phoneLocal: "",
      password: "",
      rememberMe: false,
    },
  })

  const loginType = useWatch({ control, name: "loginType" })

  const setLoginType = (next) => {
    setValue("loginType", next, { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success("Hoş geldiniz!")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Giriş sırasında bir hata oluştu.")
    }
  }

  const emailId = "login-email"
  const phoneDialId = "login-phone-dial"
  const phoneLocalId = "login-phone-local"
  const passwordId = "login-password"
  const rememberMeId = "login-remember-me"

  return (
    <AuthPageLayout
      title="Giriş yap"
      subtitle="E-posta veya telefon ile hesabınıza güvenli şekilde erişin."
      breadcrumbLabel="Giriş"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-1 shadow-sm">
          <div
            className="grid grid-cols-2 gap-1 rounded-[0.875rem] bg-slate-100/90 p-1"
            role="tablist"
            aria-label="Giriş yöntemi"
          >
            <button
              type="button"
              role="tab"
              aria-selected={loginType === "email"}
              id="login-tab-email"
              aria-controls="login-panel-email"
              onClick={() => setLoginType("email")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-primary ${
                loginType === "email"
                  ? "bg-white text-nexora-primary shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              E-posta
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={loginType === "phone"}
              id="login-tab-phone"
              aria-controls="login-panel-phone"
              onClick={() => setLoginType("phone")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexora-primary ${
                loginType === "phone"
                  ? "bg-white text-nexora-primary shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="size-4 shrink-0" aria-hidden />
              Telefon
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
            {loginType === "email" ? "E-posta ile giriş" : "Telefon ile giriş"}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {loginType === "email" ? (
              <Motion.div
                key="email"
                id="login-panel-email"
                role="tabpanel"
                aria-labelledby="login-tab-email"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={emailId}>
                  E-posta adresi
                </label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? `${emailId}-error` : `${emailId}-hint`}
                  placeholder="ornek@mail.com"
                  className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-sm outline-none transition ${
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
                ) : (
                  <p id={`${emailId}-hint`} className="mt-1.5 text-xs text-slate-500">
                    Kayıtlı e-posta adresinizi girin.
                  </p>
                )}
              </Motion.div>
            ) : (
              <Motion.div
                key="phone"
                id="login-panel-phone"
                role="tabpanel"
                aria-labelledby="login-tab-phone"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Telefon numarası</span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <div className="flex shrink-0 flex-col sm:w-auto">
                    <label htmlFor={phoneDialId} className="sr-only">
                      Ülke kodu
                    </label>
                    <Controller
                      name="phoneDial"
                      control={control}
                      render={({ field }) => (
                        <CountryDialSelect
                          id={phoneDialId}
                          value={field.value || DEFAULT_DIAL}
                          onChange={(v) => {
                            field.onChange(v)
                          }}
                          hasError={Boolean(errors.phoneDial)}
                          ariaDescribedby={errors.phoneDial ? `${phoneDialId}-error` : undefined}
                        />
                      )}
                    />
                    {errors.phoneDial ? (
                      <p id={`${phoneDialId}-error`} className="mt-1 text-xs text-rose-600" role="alert">
                        {errors.phoneDial.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor={phoneLocalId} className="sr-only">
                      Hat numarası
                    </label>
                    <input
                      id={phoneLocalId}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="5xx xxx xx xx"
                      aria-invalid={errors.phoneLocal ? "true" : "false"}
                      aria-describedby={
                        errors.phoneLocal ? `${phoneLocalId}-error` : `${phoneLocalId}-hint`
                      }
                      className={`w-full rounded-xl border bg-white/95 px-4 py-3 text-sm outline-none transition ${
                        errors.phoneLocal
                          ? "border-rose-400 ring-2 ring-rose-100"
                          : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
                      }`}
                      {...register("phoneLocal")}
                    />
                    {errors.phoneLocal ? (
                      <p id={`${phoneLocalId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
                        {errors.phoneLocal.message}
                      </p>
                    ) : (
                      <p id={`${phoneLocalId}-hint`} className="mt-1.5 text-xs text-slate-500">
                        Ülke kodunu seçin; numaranızı başında 0 olmadan yazın.
                      </p>
                    )}
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
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
              aria-describedby={errors.password ? `${passwordId}-error` : `${passwordId}-hint`}
              placeholder="Şifrenizi giriniz"
              className={`w-full rounded-xl border bg-white/95 py-3 pl-4 pr-12 text-sm outline-none transition ${
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
            <p id={`${passwordId}-error`} className="mt-1.5 text-xs text-rose-600" role="alert">
              {errors.password.message}
            </p>
          ) : (
            <p id={`${passwordId}-hint`} className="mt-1.5 text-xs text-slate-500">
              Şifreniz en az 8 karakterden oluşmalıdır.
            </p>
          )}
        </div>

        <label
          htmlFor={rememberMeId}
          className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-slate-300"
        >
          <span>
            <span className="block text-sm font-medium text-slate-800">Beni hatırla</span>
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
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-nexora-accent to-rose-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/15 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          {isLoading ? "Yükleniyor…" : "Giriş yap"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Hesabınız yok mu?{" "}
        <Link
          className="font-semibold text-nexora-primary underline-offset-4 transition hover:underline"
          to="/register"
        >
          Kayıt olun
        </Link>
      </p>
    </AuthPageLayout>
  )
}

export default Login
