function SurfaceCard({ className = "", children }) {
  return (
    <article
      className={`rounded-2xl border border-nexora-line bg-nexora-surface/95 p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.4)] ${className}`.trim()}
    >
      {children}
    </article>
  )
}

export default SurfaceCard
