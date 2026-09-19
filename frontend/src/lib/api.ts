import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('notevault_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('notevault_token')
    }
    return Promise.reject(error)
  },
)

export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data as { message?: string } | string | undefined
    if (typeof detail === 'string') return detail
    if (detail?.message) return detail.message
    if (error.response?.status === 403) return 'You do not have permission for that action.'
  }
  return 'Something went wrong. Please try again.'
}
