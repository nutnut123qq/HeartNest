'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Camera,
  Save,
  Edit3,
  Check,
  X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  lastName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfileSettings: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: '',
      bio: ''
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      toast.success('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
    setAvatarPreview(null)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-care-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {avatarPreview || user?.avatar ? (
                  <img 
                    src={avatarPreview || user?.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-secondary-900">
                {user?.fullName || `${user?.firstName} ${user?.lastName}`}
              </h3>
              <p className="text-secondary-600 mt-1">{user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  user?.role === 0 ? 'bg-primary-100 text-primary-700' :
                  user?.role === 1 ? 'bg-care-100 text-care-700' :
                  'bg-trust-100 text-trust-700'
                )}>
                  {user?.role === 0 ? 'Người dùng' :
                   user?.role === 1 ? 'Điều dưỡng' : 'Quản trị viên'}
                </span>
                {user?.isEmailVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                    <Check className="h-3 w-3" />
                    Đã xác thực
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  leftIcon={<Edit3 className="h-4 w-4" />}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    loading={isLoading}
                    disabled={!isDirty}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Lưu
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                label="Tên"
                placeholder="Nhập tên"
                error={errors.firstName?.message}
                leftIcon={<User className="h-4 w-4" />}
                disabled={!isEditing}
              />
              
              <Input
                {...register('lastName')}
                label="Họ"
                placeholder="Nhập họ"
                error={errors.lastName?.message}
                leftIcon={<User className="h-4 w-4" />}
                disabled={!isEditing}
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="Nhập email"
              error={errors.email?.message}
              leftIcon={<Mail className="h-4 w-4" />}
              disabled={!isEditing}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('phoneNumber')}
                type="tel"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                error={errors.phoneNumber?.message}
                leftIcon={<Phone className="h-4 w-4" />}
                disabled={!isEditing}
              />
              
              <Input
                {...register('dateOfBirth')}
                type="date"
                label="Ngày sinh"
                error={errors.dateOfBirth?.message}
                leftIcon={<Calendar className="h-4 w-4" />}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Giới tính</label>
                <select
                  {...register('gender')}
                  disabled={!isEditing}
                  className={cn(
                    'w-full h-11 px-3 py-2 border border-secondary-300 rounded-xl',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'disabled:bg-secondary-50 disabled:text-secondary-500'
                  )}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              
              <Input
                {...register('address')}
                label="Địa chỉ"
                placeholder="Nhập địa chỉ"
                error={errors.address?.message}
                leftIcon={<MapPin className="h-4 w-4" />}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giới thiệu bản thân</label>
              <textarea
                {...register('bio')}
                placeholder="Viết vài dòng giới thiệu về bản thân..."
                disabled={!isEditing}
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border border-secondary-300 rounded-xl resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  'disabled:bg-secondary-50 disabled:text-secondary-500'
                )}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-primary-700 mt-1">Ngày tham gia</div>
            </div>
            
            <div className="bg-care-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-care-600">0</div>
              <div className="text-sm text-care-700 mt-1">Nhắc nhở đã tạo</div>
            </div>
            
            <div className="bg-success-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success-600">0</div>
              <div className="text-sm text-success-700 mt-1">Thành viên gia đình</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
