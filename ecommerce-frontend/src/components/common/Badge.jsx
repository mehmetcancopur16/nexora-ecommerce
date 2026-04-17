function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-nexora-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-nexora-muted ${className}`.trim()}
    >
      {children}
    </span>
  )
}

export default Badge
