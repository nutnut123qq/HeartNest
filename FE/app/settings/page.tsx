'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  ProfileSettings,
  NotificationSettings,
  SecuritySettings,
  AppearanceSettings,
  LanguageSettings,
  BillingSettings
} from '@/components/settings'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'billing'

const settingsTabs = [
  {
    id: 'profile' as SettingsTab,
    name: 'Thông tin cá nhân',
    description: 'Quản lý thông tin tài khoản và hồ sơ',
    icon: User,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  {
    id: 'notifications' as SettingsTab,
    name: 'Thông báo',
    description: 'Cài đặt thông báo và nhắc nhở',
    icon: Bell,
    color: 'text-care-600',
    bgColor: 'bg-care-100'
  },
  {
    id: 'security' as SettingsTab,
    name: 'Bảo mật',
    description: 'Mật khẩu và bảo mật tài khoản',
    icon: Shield,
    color: 'text-trust-600',
    bgColor: 'bg-trust-100'
  },
  {
    id: 'appearance' as SettingsTab,
    name: 'Giao diện',
    description: 'Chủ đề và tùy chỉnh hiển thị',
    icon: Palette,
    color: 'text-family-600',
    bgColor: 'bg-family-100'
  },
  {
    id: 'language' as SettingsTab,
    name: 'Ngôn ngữ',
    description: 'Ngôn ngữ và định dạng khu vực',
    icon: Globe,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100'
  },
  {
    id: 'billing' as SettingsTab,
    name: 'Thanh toán',
    description: 'Gói dịch vụ và phương thức thanh toán',
    icon: CreditCard,
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  }
]

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings />
      case 'appearance':
        return <AppearanceSettings />
      case 'language':
        return <LanguageSettings />
      case 'billing':
        return <BillingSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-full">
            <SettingsIcon className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Cài đặt hệ thống</span>
          </div>
          
          <h1 className="text-4xl font-bold text-secondary-900">
            Cài đặt
          </h1>
          
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Tùy chỉnh trải nghiệm CareNest theo sở thích và nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-secondary-900">
                  Danh mục cài đặt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300',
                      activeTab === tab.id
                        ? 'bg-primary-50 border-2 border-primary-200 shadow-sm'
                        : 'hover:bg-secondary-50 border-2 border-transparent'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      activeTab === tab.id ? tab.bgColor : 'bg-secondary-100'
                    )}>
                      <tab.icon className={cn(
                        'h-5 w-5',
                        activeTab === tab.id ? tab.color : 'text-secondary-500'
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-medium text-sm',
                        activeTab === tab.id ? 'text-primary-900' : 'text-secondary-700'
                      )}>
                        {tab.name}
                      </div>
                      <div className="text-xs text-secondary-500 mt-0.5 line-clamp-2">
                        {tab.description}
                      </div>
                    </div>
                    
                    <ChevronRight className={cn(
                      'h-4 w-4 transition-transform',
                      activeTab === tab.id ? 'text-primary-600 rotate-90' : 'text-secondary-400'
                    )} />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Active Tab Header */}
              <div className="flex items-center gap-4">
                {(() => {
                  const currentTab = settingsTabs.find(tab => tab.id === activeTab)
                  if (!currentTab) return null
                  
                  return (
                    <>
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', currentTab.bgColor)}>
                        <currentTab.icon className={cn('h-6 w-6', currentTab.color)} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-secondary-900">
                          {currentTab.name}
                        </h2>
                        <p className="text-secondary-600">
                          {currentTab.description}
                        </p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
