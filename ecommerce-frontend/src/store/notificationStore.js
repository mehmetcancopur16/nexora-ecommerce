import { create } from "zustand"
import axiosInstance from "../api/axiosInstance"

const normalizeError = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get("/notifications")
      const data = response?.data?.data || []
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.isRead).length,
      })
    } catch (error) {
      set({ error: normalizeError(error, "Bildirimler yüklenemedi.") })
    } finally {
      set({ isLoading: false })
    }
  },

  markRead: async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`)
      set((state) => {
        const updated = state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length,
        }
      })
    } catch {
      // silent
    }
  },

  markAllRead: async () => {
    try {
      await axiosInstance.patch("/notifications/read-all")
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }))
    } catch {
      // silent
    }
  },

  reset: () => {
    set({ notifications: [], unreadCount: 0, isLoading: false, error: null })
  },
}))
