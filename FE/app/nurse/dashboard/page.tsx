'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { api } from '@/lib/api'
import { Users, Activity, Bell, CheckCircle, Clock, Calendar } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useRouter } from 'next/navigation'

interface NurseStats {
  totalAssignedReminders: number
  completedReminders: number
  pendingReminders: number
  todayReminders: number
}

export default function NurseDashboard() {
  const { user, isNurse } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<NurseStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!isNurse()) {
      router.push('/dashboard')
      return
    }

    fetchStats()
  }, [user, isNurse, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/nurse/dashboard/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching nurse stats:', error)
    } finally {
      setLoading(false)
    }
  }

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
      title: 'Tổng nhắc nhở được giao',
      value: stats.totalAssignedReminders,
      icon: Bell,
      color: 'bg-blue-500',
      description: 'Tất cả nhắc nhở được phân công'
    },
    {
      title: 'Đã hoàn thành',
      value: stats.completedReminders,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Nhắc nhở đã hoàn thành'
    },
    {
      title: 'Đang chờ xử lý',
      value: stats.pendingReminders,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Nhắc nhở chưa hoàn thành'
    },
    {
      title: 'Hôm nay',
      value: stats.todayReminders,
      icon: Calendar,
      color: 'bg-purple-500',
      description: 'Nhắc nhở trong ngày hôm nay'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Điều dưỡng</h1>
          <p className="text-gray-600 mt-2">Xin chào, {user?.fullName}</p>
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
                onClick={() => router.push('/nurse/reminders')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Nhắc nhở được giao</p>
                    <p className="text-sm text-gray-500">Xem tất cả nhắc nhở được phân công</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/nurse/patients')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Bệnh nhân</p>
                    <p className="text-sm text-gray-500">Xem danh sách bệnh nhân được phân công</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ công việc</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đã hoàn thành</span>
                <span className="font-semibold text-green-600">{stats.completedReminders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Đang chờ</span>
                <span className="font-semibold text-orange-600">{stats.pendingReminders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: stats.totalAssignedReminders > 0 
                      ? `${(stats.completedReminders / stats.totalAssignedReminders) * 100}%` 
                      : '0%'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {stats.totalAssignedReminders > 0 
                  ? ((stats.completedReminders / stats.totalAssignedReminders) * 100).toFixed(1)
                  : 0}% công việc đã hoàn thành
              </p>
            </div>
          </div>
        </div>

        {/* Today's Priority */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ưu tiên hôm nay</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold text-blue-900">
                    {stats.todayReminders} nhắc nhở cần xử lý hôm nay
                  </p>
                  <p className="text-sm text-blue-700">
                    Hãy kiểm tra và hoàn thành các nhắc nhở trong ngày
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
