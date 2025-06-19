'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'

interface UseAuthGuardOptions {
  redirectTo?: string
  requiredRole?: UserRole
  requireAuth?: boolean
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = '/login',
    requiredRole,
    requireAuth = true
  } = options

  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // Check token validity if authenticated
    if (isAuthenticated) {
      const { isTokenValid, checkTokenExpiry } = useAuthStore.getState()
      if (!isTokenValid()) {
        console.log('Token expired in auth guard, clearing auth')
        checkTokenExpiry()
        router.push(redirectTo)
        return
      }
    }

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // Check if specific role is required
    if (requiredRole && user && user.role !== requiredRole) {
      // Redirect based on user role
      switch (user.role) {
        case UserRole.Admin:
          router.push('/admin')
          break
        case UserRole.Nurse:
          router.push('/nurse')
          break
        case UserRole.User:
          router.push('/dashboard')
          break
        default:
          router.push('/login')
      }
      return
    }

    // Remove periodic token check from individual hooks
    // This will be handled globally in the auth store or layout
  }, [isAuthenticated, isLoading, user, requiredRole, requireAuth, router, redirectTo])

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRequiredRole: requiredRole ? user?.role === requiredRole : true
  }
}

// Convenience hooks for specific roles
export function useAdminGuard(redirectTo?: string) {
  return useAuthGuard({
    requiredRole: UserRole.Admin,
    redirectTo: redirectTo || '/dashboard'
  })
}

export function useNurseGuard(redirectTo?: string) {
  return useAuthGuard({
    requiredRole: UserRole.Nurse,
    redirectTo: redirectTo || '/dashboard'
  })
}

export function useUserGuard(redirectTo?: string) {
  return useAuthGuard({
    requiredRole: UserRole.User,
    redirectTo: redirectTo || '/login'
  })
}

// Hook for pages that require any authenticated user
export function useRequireAuth(redirectTo?: string) {
  return useAuthGuard({
    requireAuth: true,
    redirectTo: redirectTo || '/login'
  })
}
