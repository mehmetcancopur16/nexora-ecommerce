function SectionHeader({ eyebrow, title, description, align = "left", className = "", titleClassName = "", descriptionClassName = "", eyebrowClassName = "" }) {
  const alignment = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"

  return (
    <header className={`${alignment} ${className}`.trim()}>
      {eyebrow && (
        <p
          className={`mb-3 inline-flex rounded-full border border-nexora-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-nexora-muted ${eyebrowClassName}`.trim()}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-semibold tracking-tight text-nexora-text sm:text-4xl ${titleClassName}`.trim()}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-3 text-sm leading-6 text-nexora-muted sm:text-base ${descriptionClassName}`.trim()}>
          {description}
        </p>
      ) : null}
    </header>
  )
}

export default SectionHeader
