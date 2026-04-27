import { Link } from "react-router"

const baseClassName = "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"

const sizeClassMap = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
}

const variantClassMap = {
  primary: "bg-nexora-dark text-white hover:bg-slate-800 focus-visible:ring-slate-900",
  accent: "bg-nexora-accent text-white hover:bg-rose-600 focus-visible:ring-rose-500",
  light:
    "border border-white/90 bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-900",
  darkGhost:
    "border border-slate-300/80 bg-slate-950/35 text-white backdrop-blur-sm hover:border-white hover:bg-slate-900/55 hover:text-white focus-visible:ring-white",
  ghost:
    "border border-nexora-line bg-white text-nexora-text hover:border-nexora-primary hover:text-nexora-primary focus-visible:ring-nexora-primary",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500",
}

function Button({
  as = "button",
  to,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const finalClassName = `${baseClassName} ${sizeClassMap[size] || sizeClassMap.md} ${variantClassMap[variant] || variantClassMap.primary} ${className}`.trim()

  if (as === "link" && to) {
    return (
      <Link to={to} className={finalClassName} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={finalClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
