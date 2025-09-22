import axios from 'axios'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL 
  ? `${(import.meta as any).env.VITE_API_URL}/api` 
  : 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.error || 'An error occurred'
    // Note: toast removed since it's not imported
    console.error('API Error:', message)
    
    return Promise.reject(error)
  }
)
