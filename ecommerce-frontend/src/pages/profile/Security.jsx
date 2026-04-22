import { useState } from "react"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"

function Security() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const requestReset = async () => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email })
      const mockToken = response?.data?.data?.resetToken
      if (mockToken) {
        setToken(mockToken)
      }
      toast.success("Sifirlama kodu olusturuldu.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Islem basarisiz.")
    }
  }

  const resetPassword = async () => {
    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      })
      setToken("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Sifre basariyla sifirlandi.")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Sifre sifirlanamadi.")
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Sifre Sifirlama</h2>
        <p className="mt-1 text-sm text-slate-500">Hesabiniz icin sifre yenileme kodu olusturun.</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <button type="button" onClick={requestReset} className="rounded-xl bg-nexora-primary px-4 py-2.5 text-sm font-semibold text-white">
            Kod Al
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Yeni Sifre Belirle</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Sifirlama kodu"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni sifre"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni sifre tekrar"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
          />
        </div>
        <button type="button" onClick={resetPassword} className="mt-4 rounded-xl bg-nexora-accent px-4 py-2.5 text-sm font-semibold text-white">
          Sifreyi Sifirla
        </button>
      </section>
    </div>
  )
}

export default Security
