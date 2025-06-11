'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Heart, 
  UserPlus,
  Home,
  Shield,
  AlertCircle
} from 'lucide-react'
import { useFamilyStore } from '@/store/familyStore'
import { toast } from 'sonner'
import { familyApi } from '@/services/familyApi'

interface CreateFamilyCardProps {
  onSuccess: () => void
}

export const CreateFamilyCard: React.FC<CreateFamilyCardProps> = ({ onSuccess }) => {
  const { isLoading } = useFamilyStore()
  const [familyName, setFamilyName] = useState('')
  const [errors, setErrors] = useState<{ familyName?: string }>({})

  const validateForm = () => {
    const newErrors: { familyName?: string } = {}

    if (!familyName.trim()) {
      newErrors.familyName = 'Tên gia đình là bắt buộc'
    } else if (familyName.trim().length < 2) {
      newErrors.familyName = 'Tên gia đình phải có ít nhất 2 ký tự'
    } else if (familyName.trim().length > 50) {
      newErrors.familyName = 'Tên gia đình không được quá 50 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await familyApi.createFamily({
        name: familyName.trim(),
        description: undefined
      })

      if (response.success) {
        toast.success('Đã tạo gia đình thành công!')
        onSuccess()
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo gia đình')
      }
    } catch (error: any) {
      console.error('Error creating family:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi tạo gia đình')
    }
  }

  const features = [
    {
      icon: Users,
      title: 'Quản lý thành viên',
      description: 'Mời và quản lý các thành viên trong gia đình'
    },
    {
      icon: Shield,
      title: 'Bảo mật cao',
      description: 'Thông tin gia đình được bảo vệ an toàn'
    },
    {
      icon: Heart,
      title: 'Chăm sóc sức khỏe',
      description: 'Theo dõi sức khỏe của tất cả thành viên'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Chào mừng đến với CareNest
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Bạn chưa có gia đình nào. Hãy tạo gia đình đầu tiên để bắt đầu quản lý sức khỏe cho những người thân yêu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Family Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-primary-600" />
              <span>Tạo gia đình mới</span>
            </CardTitle>
            <CardDescription>
              Tạo gia đình để bắt đầu quản lý sức khỏe cùng nhau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="familyName" className="text-sm font-medium text-secondary-900">
                  Tên gia đình
                </Label>
                <Input
                  id="familyName"
                  type="text"
                  placeholder="Ví dụ: Gia đình Nguyễn"
                  value={familyName}
                  onChange={(e) => {
                    setFamilyName(e.target.value)
                    if (errors.familyName) {
                      setErrors(prev => ({ ...prev, familyName: undefined }))
                    }
                  }}
                  className={errors.familyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.familyName && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.familyName}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Bạn sẽ trở thành quản trị viên của gia đình</li>
                      <li>• Có thể mời thêm thành viên sau khi tạo</li>
                      <li>• Tên gia đình có thể thay đổi sau</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                leftIcon={<Heart className="h-4 w-4" />}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo gia đình'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary-600" />
              <span>Tính năng nổi bật</span>
            </CardTitle>
            <CardDescription>
              Những gì bạn có thể làm với gia đình CareNest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-secondary-200 pt-6">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        Bắt đầu ngay hôm nay
                      </h4>
                      <p className="text-sm text-secondary-600">
                        Tạo gia đình và mời những người thân yêu tham gia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
