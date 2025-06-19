'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Preload common routes for faster navigation
export const useRoutePreload = () => {
  const router = useRouter()

  useEffect(() => {
    // Preload common routes after initial load
    const preloadRoutes = [
      '/dashboard',
      '/reminders',
      '/family',
      '/chat',
      '/healthcare',
      '/map',
      '/settings'
    ]

    // Preload routes with a small delay to not block initial render
    const timer = setTimeout(() => {
      preloadRoutes.forEach(route => {
        router.prefetch(route)
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])
}

export default useRoutePreload
