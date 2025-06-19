'use client'

import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Container } from './Container'
import { cn } from '@/lib/utils'
import { useRequireAuth } from '@/hooks/useAuthGuard'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'sm' | 'default' | 'lg' | 'xl' | 'full'
  showContainer?: boolean
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
  containerSize = 'default',
  showContainer = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Remove auth guard from layout - let individual pages handle it
  // This prevents double auth checks and improves performance

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-80">
        {/* Header */}
        <Header onMenuClick={handleSidebarToggle} />

        {/* Page content */}
        <main className={cn('flex-1 overflow-y-auto', className)}>
          {showContainer ? (
            <Container size={containerSize} className="p-6">
              {children}
            </Container>
          ) : (
            <div className="p-6">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
