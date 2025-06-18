'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Smartphone,
  Clock,
  Users,
  Heart,
  Calendar,
  Volume2,
  VolumeX,
  Settings as SettingsIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface NotificationChannel {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
}

interface NotificationCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  channels: NotificationChannel[]
}

export const NotificationSettings: React.FC = () => {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'reminders',
      name: 'Nhắc nhở',
      description: 'Thông báo về thuốc, lịch khám và các hoạt động sức khỏe',
      icon: Bell,
      channels: [
        { id: 'web', name: 'Thông báo web', description: 'Hiển thị trên trình duyệt', icon: Bell, enabled: true },
        { id: 'email', name: 'Email', description: 'Gửi qua email', icon: Mail, enabled: true },
        { id: 'sms', name: 'SMS', description: 'Tin nhắn điện thoại', icon: MessageCircle, enabled: false },
        { id: 'push', name: 'Push notification', description: 'Thông báo đẩy', icon: Smartphone, enabled: true }
      ]
    },
    {
      id: 'family',
      name: 'Gia đình',
      description: 'Hoạt động của thành viên gia đình và lời mời',
      icon: Users,
      channels: [
        { id: 'web', name: 'Thông báo web', description: 'Hiển thị trên trình duyệt', icon: Bell, enabled: true },
        { id: 'email', name: 'Email', description: 'Gửi qua email', icon: Mail, enabled: true },
        { id: 'push', name: 'Push notification', description: 'Thông báo đẩy', icon: Smartphone, enabled: false }
      ]
    },
    {
      id: 'health',
      name: 'Sức khỏe',
      description: 'Báo cáo sức khỏe và khuyến nghị từ hệ thống',
      icon: Heart,
      channels: [
        { id: 'web', name: 'Thông báo web', description: 'Hiển thị trên trình duyệt', icon: Bell, enabled: true },
        { id: 'email', name: 'Email', description: 'Gửi qua email', icon: Mail, enabled: true }
      ]
    },
    {
      id: 'appointments',
      name: 'Lịch hẹn',
      description: 'Thông báo về cuộc hẹn với bác sĩ và tư vấn',
      icon: Calendar,
      channels: [
        { id: 'web', name: 'Thông báo web', description: 'Hiển thị trên trình duyệt', icon: Bell, enabled: true },
        { id: 'email', name: 'Email', description: 'Gửi qua email', icon: Mail, enabled: true },
        { id: 'sms', name: 'SMS', description: 'Tin nhắn điện thoại', icon: MessageCircle, enabled: true },
        { id: 'push', name: 'Push notification', description: 'Thông báo đẩy', icon: Smartphone, enabled: true }
      ]
    }
  ])

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '07:00'
  })

  const [soundEnabled, setSoundEnabled] = useState(true)

  const toggleChannel = (categoryId: string, channelId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            channels: category.channels.map(channel =>
              channel.id === channelId 
                ? { ...channel, enabled: !channel.enabled }
                : channel
            )
          }
        : category
    ))
  }

  const toggleAllChannels = (categoryId: string, enabled: boolean) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            channels: category.channels.map(channel => ({ ...channel, enabled }))
          }
        : category
    ))
  }

  const saveSettings = () => {
    // TODO: Implement save to backend
    toast.success('Cài đặt thông báo đã được lưu!')
  }

  return (
    <div className="space-y-6">
      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Cài đặt nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary-600" />
              ) : (
                <VolumeX className="h-5 w-5 text-secondary-500" />
              )}
              <div>
                <div className="font-medium text-secondary-900">Âm thanh thông báo</div>
                <div className="text-sm text-secondary-600">Phát âm thanh khi có thông báo mới</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                soundEnabled ? 'bg-primary-600' : 'bg-secondary-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Quiet Hours */}
          <div className="p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary-600" />
                <div>
                  <div className="font-medium text-secondary-900">Giờ yên tĩnh</div>
                  <div className="text-sm text-secondary-600">Tắt thông báo trong khoảng thời gian này</div>
                </div>
              </div>
              <button
                onClick={() => setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  quietHours.enabled ? 'bg-primary-600' : 'bg-secondary-300'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
            
            {quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-secondary-700">Từ</label>
                  <input
                    type="time"
                    value={quietHours.startTime}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700">Đến</label>
                  <input
                    type="time"
                    value={quietHours.endTime}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {categories.map((category) => {
        const allEnabled = category.channels.every(channel => channel.enabled)
        const someEnabled = category.channels.some(channel => channel.enabled)
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-secondary-600 mt-1">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllChannels(category.id, !allEnabled)}
                  >
                    {allEnabled ? 'Tắt tất cả' : 'Bật tất cả'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {category.channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-25 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <channel.icon className={cn(
                        'h-5 w-5',
                        channel.enabled ? 'text-primary-600' : 'text-secondary-400'
                      )} />
                      <div>
                        <div className={cn(
                          'font-medium',
                          channel.enabled ? 'text-secondary-900' : 'text-secondary-500'
                        )}>
                          {channel.name}
                        </div>
                        <div className="text-sm text-secondary-600">
                          {channel.description}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleChannel(category.id, channel.id)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        channel.enabled ? 'bg-primary-600' : 'bg-secondary-300'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          channel.enabled ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Lưu cài đặt
        </Button>
      </div>
    </div>
  )
}
