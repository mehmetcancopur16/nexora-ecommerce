import { ChevronDown } from "lucide-react"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

/**
 * Searchable dropdown: typing filters options (prefix match, Turkish locale).
 */
function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Yazın veya seçin",
  disabled = false,
  error,
  id: idProp,
  className = "",
}) {
  const reactId = useId()
  const listId = idProp || `searchable-${reactId}`
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const rootRef = useRef(null)
  const closedValue = value || ""

  const queryForFilter = open ? draft : closedValue
  const filtered = useMemo(() => {
    const source = (queryForFilter || "").trim()
    if (!source) return options
    const q = source.toLocaleLowerCase("tr-TR")
    return options.filter((opt) => String(opt).toLocaleLowerCase("tr-TR").startsWith(q))
  }, [options, queryForFilter])

  const selectOption = useCallback(
    (opt) => {
      onChange(opt)
      setDraft(opt)
      setOpen(false)
    },
    [onChange]
  )

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setDraft("")
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      {label ? (
        <label htmlFor={listId} className="mb-1 block text-xs font-medium text-slate-600">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={listId}
          type="text"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={open ? draft : closedValue}
          onChange={(e) => {
            const v = e.target.value
            setDraft(v)
            setOpen(true)
            if (!v) {
              onChange("")
            }
          }}
          onFocus={() => {
            setDraft(closedValue)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false)
              setDraft("")
            }
            if (e.key === "Enter" && filtered[0]) {
              e.preventDefault()
              selectOption(filtered[0])
            }
          }}
          className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition ${
            error ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          }`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          tabIndex={-1}
          onClick={() => {
            setOpen((o) => !o)
            if (!open) setDraft(closedValue)
          }}
        >
          <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>
      {open && !disabled && (
        <ul
          id={`${listId}-listbox`}
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-slate-500">Sonuç yok</li>
          ) : (
            filtered.slice(0, 200).map((opt) => (
              <li key={opt} role="option">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-slate-800 hover:bg-sky-50"
                  onClick={() => selectOption(opt)}
                >
                  {opt}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export default SearchableSelect
