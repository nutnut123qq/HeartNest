'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/features/Auth/LoginForm'
import { RegisterForm } from '@/components/features/Auth/RegisterForm'
import { Container } from '@/components/ui/Layout'
import { useAuthStore } from '@/store/authStore'
import type { UserRole, User } from '@/types'
import { getDashboardRoute } from '@/lib/roleUtils'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleAuthSuccess = (loggedInUser: User) => {
    // Redirect based on user role
    const dashboardRoute = getDashboardRoute(loggedInUser.role)
    router.push(dashboardRoute)
  }

  const handleSwitchMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm" className="w-full">
        {isLogin ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </Container>
    </div>
  )
}
