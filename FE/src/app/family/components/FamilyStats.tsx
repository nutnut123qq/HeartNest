'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { 
  Users, 
  Crown, 
  User, 
  Baby, 
  Calendar,
  Bell,
  Activity,
  Heart
} from 'lucide-react'
import { FamilyMember } from '@/types'

interface FamilyStatsProps {
  members: FamilyMember[]
}

export const FamilyStats: React.FC<FamilyStatsProps> = ({ members }) => {
  const getStatsData = () => {
    const totalMembers = members.length
    const adminCount = members.filter(m => m.role === 'admin').length
    const memberCount = members.filter(m => m.role === 'member').length
    const childCount = members.filter(m => m.role === 'child').length
    
    // Mock data for now - in real app, this would come from API
    const todayReminders = 8
    const activeMembers = members.filter(m => {
      // Mock: consider member active if joined within last 30 days
      const joinDate = new Date(m.joinedAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return joinDate > thirtyDaysAgo
    }).length

    return {
      totalMembers,
      adminCount,
      memberCount,
      childCount,
      todayReminders,
      activeMembers
    }
  }

  const stats = getStatsData()

  const statsCards = [
    {
      title: 'Tổng thành viên',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Thành viên trong gia đình'
    },
    {
      title: 'Quản trị viên',
      value: stats.adminCount,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Người quản lý gia đình'
    },
    {
      title: 'Nhắc nhở hôm nay',
      value: stats.todayReminders,
      icon: Bell,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Nhắc nhở cần thực hiện'
    },
    {
      title: 'Hoạt động gần đây',
      value: stats.activeMembers,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Thành viên hoạt động'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stat.value}
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
