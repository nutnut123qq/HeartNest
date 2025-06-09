'use client'

import React from 'react'
import { Bell, Users, Calendar, MessageCircle, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
            <p className="text-xs text-secondary-500 mt-1">{description}</p>
            
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`} />
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-secondary-500 ml-1">so với tuần trước</span>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Nhắc nhở hôm nay',
      value: 8,
      description: '3 đã hoàn thành, 5 còn lại',
      icon: <Bell className="h-6 w-6 text-primary-600" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Thành viên gia đình',
      value: 4,
      description: 'Tất cả đang hoạt động',
      icon: <Users className="h-6 w-6 text-primary-600" />,
    },
    {
      title: 'Lịch hẹn tuần này',
      value: 3,
      description: '1 hôm nay, 2 ngày tới',
      icon: <Calendar className="h-6 w-6 text-primary-600" />,
      trend: { value: 5, isPositive: false }
    },
    {
      title: 'Tin nhắn mới',
      value: 12,
      description: 'Từ bác sĩ và gia đình',
      icon: <MessageCircle className="h-6 w-6 text-primary-600" />,
      trend: { value: 8, isPositive: true }
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
