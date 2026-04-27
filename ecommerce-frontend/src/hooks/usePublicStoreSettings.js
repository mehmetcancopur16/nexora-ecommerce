import { useEffect, useState } from "react"
import axiosInstance from "../api/axiosInstance"

const defaultSettings = {
  storeName: "Nexora",
  supportEmail: "hello@nexora.com",
  supportPhone: "+90 212 000 00 00",
  currency: "TRY",
}

export function usePublicStoreSettings() {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    let ignore = false
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/settings/public")
        if (!ignore && response?.data?.data) {
          setSettings((prev) => ({ ...prev, ...response.data.data }))
        }
      } catch {
        // Keep safe fallback settings if request fails.
      }
    }
    fetchSettings()
    return () => {
      ignore = true
    }
  }, [])

  return settings
}
