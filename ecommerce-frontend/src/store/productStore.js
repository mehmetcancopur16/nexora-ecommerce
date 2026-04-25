import { create } from "zustand"
import axiosInstance from "../api/axiosInstance"

const DEFAULT_FILTERS = {
  search: "",
  startsWith: "",
  category: "",
  page: 1,
  limit: 12,
  totalPages: 1,
  total: 0,
  sort: "newest",
}

const normalizeError = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  categories: [],
  relatedProducts: [],
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
    const { search, startsWith, category, page, limit, sort } = get().filters
    get().beginLoading()
    set({ error: null })

    try {
      const params = {
        page,
        limit,
        sort,
      }

      if (search?.trim()) {
        params.search = search.trim()
      }
      if (startsWith?.trim()) {
        params.startsWith = startsWith.trim()
      }

      if (category) {
        params.category = category
      }

      const response = await axiosInstance.get("/products", { params })
      const products = response?.data?.data || []
      const totalPages = response?.data?.pagination?.totalPages || 1
      const total = response?.data?.pagination?.total ?? 0

      set((state) => ({
        products,
        filters: {
          ...state.filters,
          totalPages,
          total,
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

  fetchRelatedProducts: async (id, limit = 8) => {
    if (!id) return
    set({ relatedProducts: [] })
    try {
      const response = await axiosInstance.get(`/products/${id}/related`, { params: { limit } })
      set({ relatedProducts: response?.data?.data || [] })
    } catch {
      set({ relatedProducts: [] })
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
    const incomingStartsWith = Object.prototype.hasOwnProperty.call(nextFilters, "startsWith")
      ? nextFilters.startsWith
      : currentFilters.startsWith

    const searchChanged = incomingSearch !== currentFilters.search
    const categoryChanged = incomingCategory !== currentFilters.category
    const startsWithChanged = incomingStartsWith !== currentFilters.startsWith

    let mergedFilters = {
      ...currentFilters,
      ...nextFilters,
    }

    if (searchChanged) {
      const nextSearch = String(incomingSearch ?? "").trim()
      const prevSearch = String(currentFilters.search ?? "").trim()
      if (!prevSearch && nextSearch && mergedFilters.sort === "newest") {
        mergedFilters = { ...mergedFilters, sort: "relevance" }
      }
      if (prevSearch && !nextSearch && mergedFilters.sort === "relevance") {
        mergedFilters = { ...mergedFilters, sort: "newest" }
      }
    }
    if (startsWithChanged && incomingStartsWith?.trim()) {
      mergedFilters = { ...mergedFilters, search: "" }
      if (mergedFilters.sort === "relevance") {
        mergedFilters.sort = "name_asc"
      }
    }

    const effectiveSortChanged =
      mergedFilters.sort !== currentFilters.sort

    if (
      (searchChanged || categoryChanged || startsWithChanged || effectiveSortChanged) &&
      !Object.prototype.hasOwnProperty.call(nextFilters, "page")
    ) {
      mergedFilters.page = 1
    }

    const hasQueryChange =
      mergedFilters.search !== currentFilters.search ||
      mergedFilters.startsWith !== currentFilters.startsWith ||
      mergedFilters.category !== currentFilters.category ||
      mergedFilters.page !== currentFilters.page ||
      mergedFilters.limit !== currentFilters.limit ||
      mergedFilters.sort !== currentFilters.sort

    if (!hasQueryChange) {
      return
    }

    set({ filters: mergedFilters })
    await get().fetchProducts()
  },
}))
