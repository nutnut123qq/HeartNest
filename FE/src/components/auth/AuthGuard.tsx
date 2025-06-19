'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const router = useRouter()
  const { isAuthenticated, isTokenValid, checkTokenExpiry, user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if token is valid
        if (isAuthenticated && !isTokenValid()) {
          console.log('Token expired, clearing auth state')
          useAuthStore.getState().clearAuth()
          if (requireAuth) {
            router.push(redirectTo)
          }
          return
        }

        // If auth is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
          router.push(redirectTo)
          return
        }

        // If user is authenticated but shouldn't be (e.g., on login page)
        if (!requireAuth && isAuthenticated) {
          router.push('/dashboard')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        if (requireAuth) {
          router.push(redirectTo)
        } else {
          setIsLoading(false)
        }
      }
    }

    // Initial check
    checkAuth()

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkTokenExpiry()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, requireAuth, redirectTo, router, isTokenValid, checkTokenExpiry])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Render children if auth check passes
  return <>{children}</>
}

export default AuthGuard
