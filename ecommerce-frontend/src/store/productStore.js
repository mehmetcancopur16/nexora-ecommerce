import { create } from "zustand"
import axiosInstance from "../api/axiosInstance"

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  page: 1,
  limit: 9,
  totalPages: 1,
}

const normalizeError = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  categories: [],
  loading: false,
  pendingRequests: 0,
  error: null,
  filters: DEFAULT_FILTERS,

  beginLoading: () =>
    set((state) => {
      const nextPending = state.pendingRequests + 1
      return { pendingRequests: nextPending, loading: nextPending > 0 }
    }),

  finishLoading: () =>
    set((state) => {
      const nextPending = Math.max(0, state.pendingRequests - 1)
      return { pendingRequests: nextPending, loading: nextPending > 0 }
    }),

  fetchProducts: async () => {
    const { search, category, page, limit } = get().filters
    get().beginLoading()
    set({ error: null })

    try {
      const params = {
        page,
        limit,
      }

      if (search?.trim()) {
        params.search = search.trim()
      }

      if (category) {
        params.category = category
      }

      const response = await axiosInstance.get("/products", { params })
      const products = response?.data?.data || []
      const totalPages = response?.data?.pagination?.totalPages || 1

      set((state) => ({
        products,
        filters: {
          ...state.filters,
          totalPages,
        },
      }))
    } catch (error) {
      set({
        error: normalizeError(error, "Urunler yuklenirken bir hata olustu."),
      })
    } finally {
      get().finishLoading()
    }
  },

  fetchProductById: async (id) => {
    get().beginLoading()
    set({ error: null, product: null })
    try {
      const response = await axiosInstance.get(`/products/${id}`)
      set({ product: response?.data?.data || null })
    } catch (error) {
      set({
        error: normalizeError(error, "Urun detayi yuklenirken bir hata olustu."),
      })
    } finally {
      get().finishLoading()
    }
  },

  fetchCategories: async () => {
    get().beginLoading()
    set({ error: null })
    try {
      const response = await axiosInstance.get("/categories")
      set({ categories: response?.data?.data || [] })
    } catch (error) {
      set({
        error: normalizeError(error, "Kategoriler yuklenirken bir hata olustu."),
      })
    } finally {
      get().finishLoading()
    }
  },

  setFilters: async (nextFilters) => {
    const currentFilters = get().filters
    const incomingSearch = Object.prototype.hasOwnProperty.call(nextFilters, "search")
      ? nextFilters.search
      : currentFilters.search
    const incomingCategory = Object.prototype.hasOwnProperty.call(nextFilters, "category")
      ? nextFilters.category
      : currentFilters.category

    const searchChanged = incomingSearch !== currentFilters.search
    const categoryChanged = incomingCategory !== currentFilters.category

    const mergedFilters = {
      ...currentFilters,
      ...nextFilters,
    }

    if ((searchChanged || categoryChanged) && !Object.prototype.hasOwnProperty.call(nextFilters, "page")) {
      mergedFilters.page = 1
    }

    set({ filters: mergedFilters })
    await get().fetchProducts()
  },
}))
