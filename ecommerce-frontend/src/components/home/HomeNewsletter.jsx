import { useState } from "react"
import { Mail, Send, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useNewsletterSubscribe } from "../../hooks/useNewsletterSubscribe"
import Button from "../common/Button"
import Container from "../common/Container"
import SurfaceCard from "../common/SurfaceCard"

const MotionDiv = motion.div

function HomeNewsletter() {
  const [email, setEmail] = useState("")
  const { subscribe, loading } = useNewsletterSubscribe("home")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await subscribe(email, "home")
    if (result.ok) {
      toast.success(result.message)
      setEmail("")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <section className="pb-6 pt-16">
      <Container>
        <SurfaceCard className="relative overflow-hidden rounded-3xl border-slate-700/50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl shadow-slate-900/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,_var(--tw-gradient-stops))] from-nexora-primary/20 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" aria-hidden="true" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <MotionDiv initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Newsletter</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Özel kampanyalar ve yeni ürünler önce seninle buluşsun.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Ücretsiz üyelikle haftalık seçili koleksiyon bildirimlerini, stok yenileme bilgilerini ve
                üye özel indirimleri al.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={14} className="text-slate-300" />
                  Spam yok, sadece seçili kampanya duyuruları.
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  KVKK uyumlu — istediğin zaman çık.
                </div>
              </div>
            </MotionDiv>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label htmlFor="newsletter-email" className="sr-only">
                E-posta adresin
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-posta adresin"
                required
                className="min-w-64 rounded-xl border border-slate-600 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition focus:border-white focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 bg-white text-slate-900 shadow-md hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Gönderiliyor..." : "Abone Ol"}
                  {!loading && <Send size={15} />}
                </Button>
              </motion.div>
            </form>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  )
}

export default HomeNewsletter
