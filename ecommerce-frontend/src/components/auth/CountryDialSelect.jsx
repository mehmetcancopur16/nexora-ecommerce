import { COUNTRY_DIAL_CODES } from "../../data/countryDialCodes"

/**
 * Accessible country dial code selector.
 */
function CountryDialSelect({ id, value, onChange, disabled, hasError, ariaDescribedBy }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-invalid={hasError ? "true" : "false"}
      aria-describedby={ariaDescribedBy}
      className={`min-w-[7.5rem] shrink-0 appearance-none rounded-xl border bg-white/95 bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat py-2.5 pl-3 pr-9 text-sm font-medium outline-none transition [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%2364758b%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/%3E%3C/svg%3E')] sm:min-w-[9.5rem] ${
        hasError
          ? "border-rose-400 ring-2 ring-rose-100"
          : "border-slate-200 focus:border-nexora-primary focus:ring-2 focus:ring-sky-100"
      }`}
    >
      {COUNTRY_DIAL_CODES.map(({ code, dial }) => (
        <option key={code} value={dial}>
          {code} {dial}
        </option>
      ))}
    </select>
  )
}

export default CountryDialSelect
