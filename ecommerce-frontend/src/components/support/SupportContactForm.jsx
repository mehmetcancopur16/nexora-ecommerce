import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import axiosInstance from "../../api/axiosInstance"
import { useAuthStore } from "../../store/authStore"
import { supportContactSchema } from "../../validations/support.validation"

const CATEGORY_LABELS = {
  siparis: "Sipariş",
  urun: "Ürün",
  teknik: "Teknik",
  diger: "Diğer",
}

function SupportContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supportContactSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "diger",
      subject: "",
      message: "",
    },
  })

  useEffect(() => {
    if (!user) return
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
    reset({
      name: fullName || "",
      email: user.email || "",
      category: "diger",
      subject: "",
      message: "",
    })
  }, [user, reset])

  const messageLength = watch("message")?.length || 0

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name,
        email: values.email,
        category: values.category,
        message: values.message,
      }
      if (values.subject?.trim()) {
        payload.subject = values.subject.trim()
      }
      const response = await axiosInstance.post("/contact", payload)
      toast.success(response?.data?.message || "Mesajınız gönderildi.")
      reset({
        name: values.name,
        email: values.email,
        category: "diger",
        subject: "",
        message: "",
      })
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Gönderim başarısız oldu."
      toast.error(typeof msg === "string" ? msg : "Gönderim başarısız oldu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="nexora-glass space-y-4 rounded-2xl border border-white/70 p-5 shadow-lg sm:p-6"
      noValidate
    >
      <div>
        <h3 className="text-lg font-semibold text-nexora-text">Bize yazın</h3>
        <p className="mt-1 text-sm text-slate-500">Tüm alanları doldurun; en geç 1 iş günü içinde yanıtlıyoruz.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support-name" className="mb-1 block text-sm font-medium text-slate-700">
            Ad Soyad
          </label>
          <input
            id="support-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            className="w-full rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            {...register("name")}
          />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="support-email" className="mb-1 block text-sm font-medium text-slate-700">
            E-posta
          </label>
          <input
            id="support-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            className="w-full rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            {...register("email")}
          />
          {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="support-category" className="mb-1 block text-sm font-medium text-slate-700">
            Konu türü
          </label>
          <select
            id="support-category"
            className="w-full rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            {...register("category")}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="support-subject" className="mb-1 block text-sm font-medium text-slate-700">
            Konu başlığı <span className="font-normal text-slate-400">(isteğe bağlı)</span>
          </label>
          <input
            id="support-subject"
            type="text"
            aria-invalid={errors.subject ? "true" : "false"}
            className="w-full rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
            {...register("subject")}
          />
          {errors.subject ? <p className="mt-1 text-xs text-rose-600">{errors.subject.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="support-message" className="mb-1 block text-sm font-medium text-slate-700">
          Mesajınız
        </label>
        <textarea
          id="support-message"
          rows={5}
          aria-invalid={errors.message ? "true" : "false"}
          className="w-full resize-y rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-sm outline-none focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
          placeholder="Sipariş numaranız veya ürün adı varsa belirtin."
          {...register("message")}
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-slate-500">En fazla 5000 karakter</span>
          <span className="text-xs text-slate-400">{messageLength}/5000</span>
        </div>
        {errors.message ? <p className="mt-1 text-xs text-rose-600">{errors.message.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-nexora-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        Gönder
      </button>
    </form>
  )
}

export default SupportContactForm
