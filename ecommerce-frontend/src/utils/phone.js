/**
 * Strip non-digits from a string (for dial / local parts).
 */
export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "")
}

/**
 * Build E.164-style international string: +{countryDigits}{nationalDigits}
 * @param {string} dial - e.g. "+90" or "90"
 * @param {string} local - national number (may include spaces/dashes)
 */
export function composeInternationalPhone(dial, local) {
  const dialDigits = digitsOnly(dial)
  const localDigits = digitsOnly(local)
  if (!dialDigits || !localDigits) {
    return ""
  }
  return `+${dialDigits}${localDigits}`
}
