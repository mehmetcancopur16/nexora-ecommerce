import { create } from "zustand"
import axiosInstance from "../api/axiosInstance"

const normalizeError = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage

export const useCartStore = create((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  itemLoadingMap: {},

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get("/cart")
      set({ cart: response?.data?.data || { items: [] } })
      return response?.data?.data
    } catch (error) {
      const message = normalizeError(error, "Sepet yuklenirken bir hata olustu.")
      set({ error: message })
      throw new Error(message)
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async ({ productId, quantity = 1 }) => {
    set((state) => ({
      error: null,
      itemLoadingMap: { ...state.itemLoadingMap, [productId]: true },
    }))
    try {
      const response = await axiosInstance.post("/cart/items", { productId, quantity })
      set({ cart: response?.data?.data || { items: [] } })
      return response?.data?.data
    } catch (error) {
      const message = normalizeError(error, "Urun sepete eklenemedi.")
      set({ error: message })
      throw new Error(message)
    } finally {
      set((state) => ({
        itemLoadingMap: { ...state.itemLoadingMap, [productId]: false },
      }))
    }
  },

  updateQuantity: async ({ productId, quantity }) => {
    set((state) => ({
      error: null,
      itemLoadingMap: { ...state.itemLoadingMap, [productId]: true },
    }))
    try {
      const response = await axiosInstance.patch(`/cart/items/${productId}`, { quantity })
      set({ cart: response?.data?.data || { items: [] } })
      return response?.data?.data
    } catch (error) {
      const message = normalizeError(error, "Urun miktari guncellenemedi.")
      set({ error: message })
      throw new Error(message)
    } finally {
      set((state) => ({
        itemLoadingMap: { ...state.itemLoadingMap, [productId]: false },
      }))
    }
  },

  removeItem: async (productId) => {
    set((state) => ({
      error: null,
      itemLoadingMap: { ...state.itemLoadingMap, [productId]: true },
    }))
    try {
      const response = await axiosInstance.delete(`/cart/items/${productId}`)
      set({ cart: response?.data?.data || { items: [] } })
      return response?.data?.data
    } catch (error) {
      const message = normalizeError(error, "Urun sepetten kaldirilamadi.")
      set({ error: message })
      throw new Error(message)
    } finally {
      set((state) => ({
        itemLoadingMap: { ...state.itemLoadingMap, [productId]: false },
      }))
    }
  },

  clearCart: () => {
    set({ cart: { items: [] }, error: null })
  },
}))
