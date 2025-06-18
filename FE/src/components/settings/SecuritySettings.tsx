'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
})

type PasswordFormData = z.infer<typeof passwordSchema>

interface LoginSession {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

export const SecuritySettings: React.FC = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  const [loginSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Chrome trên Windows',
      location: 'Hồ Chí Minh, Việt Nam',
      ip: '192.168.1.1',
      lastActive: '2024-01-15T10:30:00Z',
      current: true
    },
    {
      id: '2',
      device: 'Safari trên iPhone',
      location: 'Hà Nội, Việt Nam',
      ip: '192.168.1.2',
      lastActive: '2024-01-14T15:20:00Z',
      current: false
    },
    {
      id: '3',
      device: 'Chrome trên Android',
      location: 'Đà Nẵng, Việt Nam',
      ip: '192.168.1.3',
      lastActive: '2024-01-13T09:15:00Z',
      current: false
    }
  ])

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      // TODO: Implement password change API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đổi mật khẩu thành công!')
      reset()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const terminateSession = (sessionId: string) => {
    // TODO: Implement session termination
    toast.success('Đã đăng xuất phiên làm việc')
  }

  const terminateAllSessions = () => {
    // TODO: Implement terminate all sessions
    toast.success('Đã đăng xuất tất cả phiên làm việc khác')
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Vừa xong'
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    return `${Math.floor(diffInHours / 24)} ngày trước`
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <Input
              {...register('currentPassword')}
              type={showPasswords.current ? 'text' : 'password'}
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              error={errors.currentPassword?.message}
              leftIcon={<Key className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <Input
              {...register('newPassword')}
              type={showPasswords.new ? 'text' : 'password'}
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              error={errors.newPassword?.message}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <Input
              {...register('confirmPassword')}
              type={showPasswords.confirm ? 'text' : 'password'}
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              error={errors.confirmPassword?.message}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="text-secondary-500 hover:text-secondary-700"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting}>
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Xác thực hai yếu tố (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                twoFactorEnabled ? 'bg-success-100' : 'bg-secondary-100'
              )}>
                {twoFactorEnabled ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <Shield className="h-5 w-5 text-secondary-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-secondary-900">
                  Xác thực hai yếu tố
                </div>
                <div className="text-sm text-secondary-600">
                  {twoFactorEnabled 
                    ? 'Tài khoản của bạn được bảo vệ bằng 2FA'
                    : 'Tăng cường bảo mật cho tài khoản của bạn'
                  }
                </div>
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'default'}
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            >
              {twoFactorEnabled ? 'Tắt 2FA' : 'Bật 2FA'}
            </Button>
          </div>

          {!twoFactorEnabled && (
            <div className="mt-4 p-4 bg-care-50 border border-care-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-care-600 mt-0.5" />
                <div>
                  <div className="font-medium text-care-900">Khuyến nghị bảo mật</div>
                  <div className="text-sm text-care-700 mt-1">
                    Bật xác thực hai yếu tố để bảo vệ tài khoản khỏi truy cập trái phép, 
                    ngay cả khi mật khẩu bị lộ.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo đăng nhập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-secondary-900">
                  Thông báo đăng nhập
                </div>
                <div className="text-sm text-secondary-600">
                  Nhận thông báo khi có đăng nhập từ thiết bị mới
                </div>
              </div>
            </div>
            <button
              onClick={() => setLoginAlerts(!loginAlerts)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                loginAlerts ? 'bg-primary-600' : 'bg-secondary-300'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  loginAlerts ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Phiên đăng nhập
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={terminateAllSessions}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Đăng xuất tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginSessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'flex items-center justify-between p-4 border rounded-xl',
                  session.current 
                    ? 'border-primary-200 bg-primary-25' 
                    : 'border-secondary-200 hover:bg-secondary-25'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    session.current ? 'bg-primary-100' : 'bg-secondary-100'
                  )}>
                    <Monitor className={cn(
                      'h-5 w-5',
                      session.current ? 'text-primary-600' : 'text-secondary-500'
                    )} />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900 flex items-center gap-2">
                      {session.device}
                      {session.current && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-secondary-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastActive(session.lastActive)}
                      </span>
                    </div>
                    <div className="text-xs text-secondary-500 mt-1">
                      IP: {session.ip}
                    </div>
                  </div>
                </div>
                
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                  >
                    Đăng xuất
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
