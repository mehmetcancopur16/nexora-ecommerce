import { create } from "zustand"
import axiosInstance, { registerUnauthorizedHandler } from "../api/axiosInstance"

const TOKEN_KEY = "nexora_token"
const LOGIN_PATH = import.meta.env.VITE_AUTH_LOGIN_PATH || "/auth/login"
const REGISTER_PATH = import.meta.env.VITE_AUTH_REGISTER_PATH || "/auth/register"

const getToken = () => localStorage.getItem(TOKEN_KEY)
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: Boolean(getToken()),
  isLoading: false,

  forceLogout: () => {
    clearToken()
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  login: async (payload) => {
    set({ isLoading: true })
    try {
      const response = await axiosInstance.post(LOGIN_PATH, payload)
      const token = response?.data?.token || response?.data?.data?.token
      if (token) {
        setToken(token)
      }
      await get().checkAuth()
      return response.data
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true })
    try {
      const response = await axiosInstance.post(REGISTER_PATH, payload)
      const token = response?.data?.token || response?.data?.data?.token
      if (token) {
        setToken(token)
        await get().checkAuth()
      }
      return response.data
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    get().forceLogout()
  },

  checkAuth: async () => {
    const token = getToken()
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return null
    }

    set({ isLoading: true })
    try {
      const response = await axiosInstance.get("/users/me")
      const user = response?.data?.data ?? null
      set({ user, isAuthenticated: Boolean(user) })
      return user
    } catch {
      get().forceLogout()
      return null
    } finally {
      set({ isLoading: false })
    }
  },
}))

registerUnauthorizedHandler(() => {
  useAuthStore.getState().forceLogout()
})
