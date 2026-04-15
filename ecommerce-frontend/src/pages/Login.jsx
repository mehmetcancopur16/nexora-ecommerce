import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { loginSchema } from "../validations/auth.validation"
import { useAuthStore } from "../store/authStore"

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success("Hos geldin!")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Giris sirasinda bir hata olustu.")
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-nexora-text">Giris Yap</h1>
          <p className="text-sm text-slate-500">Hesabina ulas ve Nexora deneyimine devam et.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@mail.com"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                errors.email
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Sifre
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Sifrenizi giriniz"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                errors.password
                  ? "border-rose-400 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-accent px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isLoading ? "Yukleniyor..." : "Giris Yap"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Hesabin yok mu?{" "}
          <Link className="font-medium text-nexora-primary hover:underline" to="/register">
            Kayit Ol
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
