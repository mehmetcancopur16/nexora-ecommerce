import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Button from "../common/Button"
import Container from "../common/Container"
import SurfaceCard from "../common/SurfaceCard"
const MotionDiv = motion.div

function HomeNewsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      toast.error("Lutfen gecerli bir e-posta adresi girin.")
      return
    }
    toast.success("Bulten uyeligi alindi. Hos geldiniz!")
    setEmail("")
  }

  return (
    <section className="pb-6 pt-16">
      <Container>
        <SurfaceCard className="rounded-3xl border-slate-300 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <MotionDiv initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Newsletter</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ozel kampanyalar ve yeni urunler once seninle bulussun.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Ucretsiz uyelikle haftalik secili koleksiyon bildirimlerini, stok yenileme bilgilerini ve uye ozel
                indirimleri al.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                <Mail size={15} />
                Spam yok, sadece secili kampanya duyurulari.
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
                className="min-w-64 rounded-xl border border-slate-500 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-white focus:outline-none"
              />
              <Button type="submit" className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                Abone Ol
                <Send size={15} />
              </Button>
            </form>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  )
}

export default HomeNewsletter
