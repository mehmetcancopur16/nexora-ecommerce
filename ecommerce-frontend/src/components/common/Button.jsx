import { Link } from "react-router"

const baseClassName =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

const variantClassMap = {
  primary: "bg-nexora-dark text-white hover:bg-slate-800 focus-visible:ring-slate-900",
  accent: "bg-nexora-accent text-white hover:bg-rose-600 focus-visible:ring-rose-500",
  ghost:
    "border border-nexora-line bg-white text-nexora-text hover:border-nexora-primary hover:text-nexora-primary focus-visible:ring-nexora-primary",
}

function Button({ as = "button", to, type = "button", variant = "primary", className = "", children, ...props }) {
  const finalClassName = `${baseClassName} ${variantClassMap[variant] || variantClassMap.primary} ${className}`.trim()

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
