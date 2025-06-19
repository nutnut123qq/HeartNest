'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Bell,
  Users,
  MapPin,
  MessageCircle,
  CreditCard,
  Settings,
  X,
  Heart,
  Calendar,
  Stethoscope,
  Shield,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useUnreadCount } from '@/store/chatStore'
import { useRoutePreload } from '@/hooks/useRoutePreload'
import { UserRole } from '@/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const getNavigationItems = (userRole: UserRole) => {
  const baseItems = [
    {
      name: 'Trang chủ',
      href: '/dashboard',
      icon: Home,
      description: 'Tổng quan và thống kê',
      roles: [UserRole.User, UserRole.Nurse, UserRole.Admin]
    },
    {
      name: 'Nhắc nhở',
      href: '/reminders',
      icon: Bell,
      description: 'Quản lý nhắc nhở thuốc và lịch khám',
      roles: [UserRole.User, UserRole.Nurse, UserRole.Admin]
    },
  ]

  const userItems = [
    {
      name: 'Gia đình',
      href: '/family',
      icon: Users,
      description: 'Quản lý thành viên gia đình',
      roles: [UserRole.User]
    },
    {
      name: 'Dịch vụ y tế',
      href: '/healthcare',
      icon: Stethoscope,
      description: 'Tìm kiếm cơ sở y tế và bác sĩ',
      roles: [UserRole.User]
    },
    {
      name: 'Bản đồ y tế',
      href: '/map',
      icon: MapPin,
      description: 'Bản đồ cơ sở y tế gần bạn',
      roles: [UserRole.User]
    },
    {
      name: 'Tư vấn',
      href: '/chat',
      icon: MessageCircle,
      description: 'Chat với bác sĩ và chuyên gia',
      roles: [UserRole.User]
    },
    {
      name: 'Gói dịch vụ',
      href: '/subscription',
      icon: CreditCard,
      description: 'Quản lý gói dịch vụ và thanh toán',
      roles: [UserRole.User]
    },
  ]

  const nurseItems = [
    {
      name: 'Dashboard Điều dưỡng',
      href: '/nurse/dashboard',
      icon: Activity,
      description: 'Dashboard cho điều dưỡng',
      roles: [UserRole.Nurse]
    },
    {
      name: 'Bệnh nhân',
      href: '/nurse/patients',
      icon: Users,
      description: 'Quản lý bệnh nhân được phân công',
      roles: [UserRole.Nurse]
    },
  ]

  const adminItems = [
    {
      name: 'Dashboard Admin',
      href: '/admin/dashboard',
      icon: Shield,
      description: 'Dashboard quản trị hệ thống',
      roles: [UserRole.Admin]
    },
    {
      name: 'Quản lý người dùng',
      href: '/admin/users',
      icon: Users,
      description: 'Quản lý tất cả người dùng',
      roles: [UserRole.Admin]
    },
  ]

  const allItems = [...baseItems, ...userItems, ...nurseItems, ...adminItems]
  return allItems.filter(item => item.roles.includes(userRole))
}

const settingsItems = [
  {
    name: 'Cài đặt',
    href: '/settings',
    icon: Settings,
    description: 'Cài đặt tài khoản và ứng dụng'
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className }) => {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const unreadCount = useUnreadCount()

  // Preload routes for faster navigation
  useRoutePreload()

  const navigationItems = getNavigationItems(user?.role || UserRole.User)

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
    const showUnreadBadge = item.href === '/chat' && unreadCount > 0

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative',
          isActive
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
            : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
        )}
      >
        <item.icon className={cn(
          'h-5 w-5',
          isActive ? 'text-primary-600' : 'text-secondary-500'
        )} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span>{item.name}</span>
            {showUnreadBadge && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div className="text-xs text-secondary-500 mt-0.5">
            {item.description}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-80 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">CareNest</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-secondary-200 my-4" />

          {/* Settings */}
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-secondary-200">
          <div className="bg-primary-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-primary-700">Gói Love Package</span>
            </div>
            <p className="text-xs text-primary-600 mb-2">
              Còn 45 ngày sử dụng
            </p>
            <Button size="sm" className="w-full text-xs">
              Nâng cấp gói
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
