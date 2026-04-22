import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Container from "../common/Container"

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return value
}

const stats = [
  { value: 50000, label: "Mutlu Müşteri", suffix: "+" },
  { value: 12000, label: "Aktif Ürün", suffix: "+" },
  { value: 99, label: "Müşteri Memnuniyeti", suffix: "%" },
  { value: 24, label: "Saat İçinde Kargo", suffix: " Saat" },
]

function StatItem({ stat, active }) {
  const displayed = useCountUp(stat.value, active)
  const formatted =
    stat.value >= 1000 ? `${(displayed / 1000).toFixed(displayed >= stat.value ? 0 : 1)}K` : displayed

  return (
    <motion.div
      className="flex flex-col items-center gap-1 px-4 py-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <span className="text-3xl font-bold tracking-tight text-nexora-text sm:text-4xl">
        {stat.value >= 1000 ? formatted : displayed}
        {stat.suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-nexora-muted">{stat.label}</span>
    </motion.div>
  )
}

function HomeStatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-4">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-nexora-line bg-gradient-to-r from-nexora-primary/5 via-sky-50 to-nexora-accent/5 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,_var(--tw-gradient-stops))] from-nexora-primary/8 via-transparent to-transparent" />
          <div className="relative grid grid-cols-2 divide-x divide-y divide-nexora-line/60 sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} active={isInView} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HomeStatsBar
