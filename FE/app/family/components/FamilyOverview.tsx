'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Calendar, 
  Crown, 
  User, 
  Baby,
  Heart,
  Shield,
  Clock
} from 'lucide-react'
import { Family, FamilyMember } from '@/types'

interface FamilyOverviewProps {
  family: Family | null
  members: FamilyMember[]
}

export const FamilyOverview: React.FC<FamilyOverviewProps> = ({ family, members }) => {
  const getCreatedDate = () => {
    if (!family?.createdAt) return 'Không xác định'
    return new Date(family.createdAt).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getLastActivity = () => {
    if (members.length === 0) return 'Chưa có hoạt động'
    
    // Get the most recent join date
    const latestJoin = members.reduce((latest, member) => {
      const memberDate = new Date(member.joinedAt)
      return memberDate > latest ? memberDate : latest
    }, new Date(0))

    return latestJoin.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleStats = () => {
    const stats = {
      admin: members.filter(m => m.role === 'admin').length,
      member: members.filter(m => m.role === 'member').length,
      child: members.filter(m => m.role === 'child').length
    }
    return stats
  }

  const roleStats = getRoleStats()

  const roleInfo = [
    {
      role: 'admin',
      label: 'Quản trị viên',
      count: roleStats.admin,
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Có quyền quản lý toàn bộ gia đình'
    },
    {
      role: 'member',
      label: 'Thành viên',
      count: roleStats.member,
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Thành viên bình thường của gia đình'
    },
    {
      role: 'child',
      label: 'Con em',
      count: roleStats.child,
      icon: Baby,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Thành viên nhỏ tuổi, quyền hạn chế'
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary-600" />
            <span>Thông tin gia đình</span>
          </CardTitle>
          <CardDescription>
            Chi tiết về gia đình của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-secondary-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Users className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Tên gia đình</p>
                  <p className="text-sm text-secondary-600">Tên hiển thị của gia đình</p>
                </div>
              </div>
              <p className="font-medium text-secondary-900">
                {family?.name || 'Gia đình của bạn'}
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-secondary-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Ngày tạo</p>
                  <p className="text-sm text-secondary-600">Khi gia đình được thành lập</p>
                </div>
              </div>
              <p className="font-medium text-secondary-900">
                {getCreatedDate()}
              </p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-secondary-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Hoạt động gần đây</p>
                  <p className="text-sm text-secondary-600">Lần cuối có thành viên tham gia</p>
                </div>
              </div>
              <p className="font-medium text-secondary-900">
                {getLastActivity()}
              </p>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">Tổng thành viên</p>
                  <p className="text-sm text-secondary-600">Số lượng người trong gia đình</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {members.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-primary-600" />
            <span>Phân bố vai trò</span>
          </CardTitle>
          <CardDescription>
            Thống kê vai trò của các thành viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleInfo.map((role) => (
              <div
                key={role.role}
                className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${role.bgColor} rounded-lg`}>
                    <role.icon className={`h-4 w-4 ${role.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{role.label}</p>
                    <p className="text-sm text-secondary-600">{role.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary-900">{role.count}</p>
                  <p className="text-xs text-secondary-500">
                    {role.count === 0 ? 'Không có' : role.count === 1 ? '1 người' : `${role.count} người`}
                  </p>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">Chưa có thành viên nào</p>
                <p className="text-secondary-500 text-sm mt-1">
                  Mời thành viên đầu tiên để bắt đầu
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
