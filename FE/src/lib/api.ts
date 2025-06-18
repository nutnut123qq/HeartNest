import axios, { AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 120000, // 120 seconds - increased for slow database
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from auth store
    const token = useAuthStore.getState().accessToken
    const authState = useAuthStore.getState()



    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authStore = useAuthStore.getState()
      const refreshToken = authStore.refreshToken

      if (refreshToken) {
        try {
          // Try to refresh the token
          const newAccessToken = await authStore.refreshAccessToken()

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          // Retry the original request
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          authStore.logout()

          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }

          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, logout user
        authStore.logout()

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

// API error handler
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.errors?.length > 0) {
    return error.response.data.errors.join(', ')
  }

  if (error.response?.data?.title) {
    return error.response.data.title
  }

  if (error.message) {
    return error.message
  }

  return 'Đã xảy ra lỗi không xác định'
}

// Utility functions for common API patterns
export const apiUtils = {
  // GET request with error handling
  get: async <T>(url: string): Promise<T> => {
    try {
      const response = await api.get<ApiResponse<T>>(url)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // POST request with error handling
  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await api.post<ApiResponse<T>>(url, data)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // PUT request with error handling
  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await api.put<ApiResponse<T>>(url, data)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // DELETE request with error handling
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await api.delete<ApiResponse<T>>(url)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  // Upload file
  upload: async <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}

export default api
