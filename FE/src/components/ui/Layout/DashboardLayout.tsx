'use client'

import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Container } from './Container'
import { cn } from '@/lib/utils'

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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
      />

      {/* Main content area */}
      <div className="lg:pl-80">
        {/* Header */}
        <Header onMenuClick={handleSidebarToggle} />

        {/* Page content */}
        <main className={cn('min-h-[calc(100vh-4rem)]', className)}>
          {showContainer ? (
            <Container size={containerSize} className="py-6">
              {children}
            </Container>
          ) : (
            <div className="py-6">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
