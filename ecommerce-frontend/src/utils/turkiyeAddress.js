import provincesData from "../data/turkiye-iller-ilceler.json"

/** @type {{ name: string; plate_code: number; districts: { name: string }[] }[]} */
export const TURKEY_PROVINCES = provincesData

/**
 * @param {string} query - User-typed filter; "k" returns provinces starting with K (Turkish locale)
 */
export function filterProvinces(query = "") {
  const q = query.trim()
  if (!q) {
    return TURKEY_PROVINCES.map((p) => p.name)
  }
  const lower = q.toLocaleLowerCase("tr-TR")
  return TURKEY_PROVINCES.filter((p) => p.name.toLocaleLowerCase("tr-TR").startsWith(lower)).map((p) => p.name)
}

/**
 * @param {string} provinceName
 */
export function getDistrictsForProvince(provinceName) {
  if (!provinceName) return []
  const found = TURKEY_PROVINCES.find((p) => p.name === provinceName)
  if (!found) return []
  return found.districts.map((d) => d.name).sort((a, b) => a.localeCompare(b, "tr-TR"))
}

/**
 * @param {string} provinceName
 * @param {string} query
 */
export function filterDistricts(provinceName, query = "") {
  const all = getDistrictsForProvince(provinceName)
  const q = query.trim()
  if (!q) return all
  const lower = q.toLocaleLowerCase("tr-TR")
  return all.filter((d) => d.toLocaleLowerCase("tr-TR").startsWith(lower))
}
