'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { api } from '@/lib/api'
import { useCache } from '@/hooks/useCache'
import { Users, Activity, Bell, Shield } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalNurses: number
  totalReminders: number
  activeReminders: number
  inactiveReminders: number
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuthStore()
  const router = useRouter()

  // Use cached data for better performance
  const { data: stats, loading, error, refresh } = useCache(
    async () => {
      const response = await api.get('/api/admin/dashboard/stats')
      return response.data.data
    },
    { key: 'admin-dashboard-stats', ttl: 2 * 60 * 1000 } // 2 minutes cache
  )

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      router.push('/dashboard')
      return
    }
  }, [user, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải dữ liệu thống kê</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Tất cả người dùng trong hệ thống'
    },
    {
      title: 'Điều dưỡng',
      value: stats.totalNurses,
      icon: Shield,
      color: 'bg-green-500',
      description: 'Số lượng điều dưỡng'
    },
    {
      title: 'Tổng nhắc nhở',
      value: stats.totalReminders,
      icon: Bell,
      color: 'bg-purple-500',
      description: 'Tất cả nhắc nhở trong hệ thống'
    },
    {
      title: 'Nhắc nhở hoạt động',
      value: stats.activeReminders,
      icon: Activity,
      color: 'bg-orange-500',
      description: 'Nhắc nhở đang hoạt động'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống CareNest</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Quản lý người dùng</p>
                    <p className="text-sm text-gray-500">Xem và quản lý tất cả người dùng</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/users/role/Nurse')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Quản lý điều dưỡng</p>
                    <p className="text-sm text-gray-500">Xem danh sách điều dưỡng</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhắc nhở</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hoạt động</span>
                <span className="font-semibold text-green-600">{stats.activeReminders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Không hoạt động</span>
                <span className="font-semibold text-gray-600">{stats.inactiveReminders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.activeReminders / stats.totalReminders) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {((stats.activeReminders / stats.totalReminders) * 100).toFixed(1)}% nhắc nhở đang hoạt động
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
