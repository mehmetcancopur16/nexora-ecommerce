import { useCallback, useState } from "react"
import axiosInstance from "../api/axiosInstance"

function normalizeMessage(error) {
  return error?.response?.data?.message || error?.message || "Bir hata olustu. Lutfen tekrar deneyin."
}

export function useNewsletterSubscribe(defaultSource = "home") {
  const [loading, setLoading] = useState(false)

  const subscribe = useCallback(
    async (email, sourceOverride) => {
      const trimmed = email?.trim()
      if (!trimmed) {
        return { ok: false, message: "Lutfen gecerli bir e-posta adresi girin." }
      }

      setLoading(true)
      try {
        const source = sourceOverride || defaultSource
        const response = await axiosInstance.post("/newsletter/subscribe", {
          email: trimmed,
          source,
        })
        const message = response?.data?.message || "Kaydiniz alindi."
        setLoading(false)
        return { ok: true, message }
      } catch (error) {
        setLoading(false)
        return { ok: false, message: normalizeMessage(error) }
      }
    },
    [defaultSource]
  )

  return { subscribe, loading }
}
