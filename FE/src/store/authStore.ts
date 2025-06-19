import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData, AuthResponse, UserRole } from '@/types'
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
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<string>
  updateProfile: (data: Partial<User>) => Promise<void>
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void

  // Role helpers
  isAdmin: () => boolean
  isNurse: () => boolean
  isUser: () => boolean
  hasRole: (role: UserRole) => boolean

  // Token helpers
  isTokenValid: () => boolean
  checkTokenExpiry: () => void
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
              role: user.role,
              phoneNumber: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              isEmailVerified: user.isEmailVerified,
              createdAt: user.createdAt,
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
              role: user.role,
              phoneNumber: user.phoneNumber,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              isEmailVerified: user.isEmailVerified,
              createdAt: user.createdAt,
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

      logout: async () => {
        try {
          // Call logout API if available
          await api.post('/api/auth/logout')
        } catch (error) {
          // Ignore API errors for logout - clear local state anyway
          console.log('Logout API call failed, clearing local state')
        }

        // Always clear local state
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

      // Role helpers
      isAdmin: () => {
        const { user } = get()
        return user?.role === UserRole.Admin
      },

      isNurse: () => {
        const { user } = get()
        return user?.role === UserRole.Nurse
      },

      isUser: () => {
        const { user } = get()
        return user?.role === UserRole.User
      },

      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.role === role
      },

      // Token helpers
      isTokenValid: () => {
        const { accessToken } = get()
        if (!accessToken) return false

        try {
          // Decode JWT token to check expiry
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)

          // Check if token is expired (with 5 minute buffer)
          return payload.exp > (currentTime + 300)
        } catch (error) {
          console.error('Error checking token validity:', error)
          return false
        }
      },

      checkTokenExpiry: () => {
        const { isTokenValid, logout } = get()
        if (!isTokenValid()) {
          console.log('Token expired, logging out...')
          logout()
        }
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
