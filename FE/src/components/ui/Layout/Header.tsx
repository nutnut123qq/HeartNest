'use client'

import React, { useState } from 'react'
import { Menu, X, Bell, User, LogOut, Settings, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick?: () => void
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, className }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
      // Redirect to login page after logout
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still close menu and redirect even if logout fails
      setShowUserMenu(false)
      router.push('/login')
    }
  }

  return (
    <header className={cn(
      'bg-white border-b border-secondary-200 px-4 lg:px-6 h-16 flex items-center justify-between',
      className
    )}>
      {/* Left side - Logo and menu button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary-600 hidden sm:block">
            CareNest
          </span>
        </div>
      </div>

      {/* Right side - Notifications and user menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
              <div className="p-4 border-b border-secondary-200">
                <h3 className="text-lg font-semibold">Thông báo</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {/* Sample notifications */}
                <div className="p-4 border-b border-secondary-100 hover:bg-secondary-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nhắc nhở uống thuốc</p>
                      <p className="text-xs text-secondary-600">Đã đến giờ uống thuốc huyết áp</p>
                      <p className="text-xs text-secondary-500 mt-1">5 phút trước</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-secondary-100 hover:bg-secondary-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lịch khám sắp tới</p>
                      <p className="text-xs text-secondary-600">Khám tim mạch vào ngày mai lúc 9:00</p>
                      <p className="text-xs text-secondary-500 mt-1">1 giờ trước</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-secondary-100 hover:bg-secondary-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Thành viên mới</p>
                      <p className="text-xs text-secondary-600">Mẹ đã tham gia gia đình CareNest</p>
                      <p className="text-xs text-secondary-500 mt-1">2 giờ trước</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-secondary-200">
                <Button variant="ghost" className="w-full text-sm">
                  Xem tất cả thông báo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 px-3"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-primary-600" />
              )}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
          </Button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
              <div className="p-4 border-b border-secondary-200">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-secondary-600">{user?.email}</p>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                >
                  <User className="h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </button>
                
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt</span>
                </button>
              </div>
              
              <div className="border-t border-secondary-200 py-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </header>
  )
}
