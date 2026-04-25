import { create } from "zustand"
import axiosInstance from "../api/axiosInstance"

const normalizeError = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isHydrated: false,
  error: null,
  itemLoadingMap: {},

  reset: () => {
    set({
      items: [],
      isLoading: false,
      isHydrated: false,
      error: null,
      itemLoadingMap: {},
    })
  },

  fetchWishlist: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get("/users/wishlist")
      set({
        items: response?.data?.data || [],
        isHydrated: true,
      })
      return response?.data?.data || []
    } catch (error) {
      const message = normalizeError(error, "Favoriler yuklenemedi.")
      set({ error: message, isHydrated: true })
      throw new Error(message)
    } finally {
      set({ isLoading: false })
    }
  },

  toggleWishlist: async (productId) => {
    if (!productId) {
      return { inWishlist: false, items: get().items }
    }
    set((state) => ({
      error: null,
      itemLoadingMap: { ...state.itemLoadingMap, [productId]: true },
    }))
    try {
      const response = await axiosInstance.patch(`/users/wishlist/${productId}`)
      const nextItems = response?.data?.data || []
      set({
        items: nextItems,
        isHydrated: true,
      })
      return {
        inWishlist: nextItems.some((item) => item?._id === productId),
        items: nextItems,
      }
    } catch (error) {
      const message = normalizeError(error, "Favori islemi basarisiz oldu.")
      set({ error: message })
      throw new Error(message)
    } finally {
      set((state) => ({
        itemLoadingMap: { ...state.itemLoadingMap, [productId]: false },
      }))
    }
  },

  removeFromWishlist: async (productId) => {
    const result = await get().toggleWishlist(productId)
    return result.items
  },

  isInWishlist: (productId) => get().items.some((item) => item?._id === productId),
}))
