'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()
  const { isAuthenticated, isTokenValid, checkTokenExpiry } = useAuthStore()

  useEffect(() => {
    // Single global token validation interval
    const interval = setInterval(() => {
      if (isAuthenticated) {
        if (!isTokenValid()) {
          console.log('Token expired globally, logging out')
          checkTokenExpiry()
          router.push('/login')
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, isTokenValid, checkTokenExpiry, router])

  return <>{children}</>
}

export default AuthProvider
