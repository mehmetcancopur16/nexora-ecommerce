import axios from "axios"

const TOKEN_KEY = "nexora_token"

let onUnauthorized = null

export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof onUnauthorized === "function") {
        onUnauthorized()
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
