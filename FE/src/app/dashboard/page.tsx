'use client'

import React from 'react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { DashboardStats } from '@/components/features/Dashboard/DashboardStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'

import { Plus, Clock, Calendar, Users, MessageCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Chào mừng trở lại! 👋
            </h1>
            <p className="text-secondary-600 mt-1">
              Hôm nay là ngày tuyệt vời để chăm sóc sức khỏe gia đình
            </p>
          </div>

          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Tạo nhắc nhở mới
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reminders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <span>Nhắc nhở hôm nay</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample reminders */}
                  <div className="flex items-center space-x-4 p-3 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Uống thuốc huyết áp</p>
                      <p className="text-sm text-secondary-600">8:00 AM - Cho bố</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Hoàn thành
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Khám tim mạch</p>
                      <p className="text-sm text-secondary-600">2:00 PM - Bệnh viện Chợ Rẫy</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Xem chi tiết
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4 p-3 bg-success-50 rounded-lg border border-success-200">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Tập thể dục</p>
                      <p className="text-sm text-secondary-600">6:00 PM - Đi bộ 30 phút</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Bắt đầu
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <Button variant="ghost" className="w-full">
                    Xem tất cả nhắc nhở
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Family */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Plus className="h-4 w-4" />}>
                    Tạo nhắc nhở
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Calendar className="h-4 w-4" />}>
                    Đặt lịch khám
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<Users className="h-4 w-4" />}>
                    Mời thành viên
                  </Button>
                  <Button variant="outline" className="w-full justify-start" leftIcon={<MessageCircle className="h-4 w-4" />}>
                    Chat với bác sĩ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span>Gia đình</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">B</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Bố</p>
                      <p className="text-sm text-secondary-600">2 nhắc nhở hôm nay</p>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-pink-600">M</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Mẹ</p>
                      <p className="text-sm text-secondary-600">1 nhắc nhở hôm nay</p>
                    </div>
                    <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">E</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">Em gái</p>
                      <p className="text-sm text-secondary-600">Không có nhắc nhở</p>
                    </div>
                    <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <Button variant="ghost" className="w-full">
                    Quản lý gia đình
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
