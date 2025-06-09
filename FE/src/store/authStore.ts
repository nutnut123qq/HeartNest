import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types'
import { api } from '@/lib/api'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<string>
  updateProfile: (data: Partial<User>) => Promise<void>
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/api/auth/login', credentials)
          const { token, user } = response.data.data

          set({
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              fullName: user.fullName,
              phone: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              isEmailVerified: user.isEmailVerified,
              createdAt: user.createdAt,
              updatedAt: user.createdAt,
            },
            isAuthenticated: true,
            accessToken: token,
            refreshToken: null, // API không trả refresh token
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/api/auth/register', data)
          const { token, user } = response.data.data

          set({
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              fullName: user.fullName,
              phone: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              isEmailVerified: user.isEmailVerified,
              createdAt: user.createdAt,
              updatedAt: user.createdAt,
            },
            isAuthenticated: true,
            accessToken: token,
            refreshToken: null, // API không trả refresh token
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Call logout API
        api.post('/api/auth/logout').catch(console.error)
        
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        })
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        try {
          const response = await api.post<{ accessToken: string }>('/api/auth/refresh', {
            refreshToken,
          })
          const { accessToken } = response.data

          set({ accessToken })
          return accessToken
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true })
        try {
          const response = await api.put<User>('/api/auth/me', data)
          const updatedUser = response.data

          set({
            user: updatedUser,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        })
      },
    }),
    {
      name: 'carenest-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
