'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  UserPlus, 
  Crown, 
  User, 
  Baby,
  AlertCircle
} from 'lucide-react'
import { useFamilyStore } from '@/store/familyStore'
import { toast } from 'sonner'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { inviteMember, isLoading } = useFamilyStore()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'child'>('member')
  const [errors, setErrors] = useState<{ email?: string; role?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; role?: string } = {}

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    // Validate role
    if (!role) {
      newErrors.role = 'Vai trò là bắt buộc'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await inviteMember(email.trim(), role)
      toast.success('Đã gửi lời mời thành công!')
      handleClose()
      onSuccess()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi lời mời'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    setEmail('')
    setRole('member')
    setErrors({})
    onClose()
  }

  const roleOptions = [
    {
      value: 'member',
      label: 'Thành viên',
      description: 'Thành viên bình thường của gia đình',
      icon: User,
      color: 'text-blue-600'
    },
    {
      value: 'child',
      label: 'Con em',
      description: 'Thành viên nhỏ tuổi, quyền hạn chế',
      icon: Baby,
      color: 'text-green-600'
    }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mời thành viên mới"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-secondary-900">
            Email người được mời
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-secondary-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của người bạn muốn mời"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }))
                }
              }}
              className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-secondary-900">
            Vai trò trong gia đình
          </Label>
          <div className="space-y-3">
            {roleOptions.map((option) => (
              <div
                key={option.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  role === option.value
                    ? 'border-primary-300 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
                onClick={() => {
                  setRole(option.value as 'member' | 'child')
                  if (errors.role) {
                    setErrors(prev => ({ ...prev, role: undefined }))
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    role === option.value ? 'bg-primary-100' : 'bg-secondary-100'
                  }`}>
                    <option.icon className={`h-4 w-4 ${
                      role === option.value ? 'text-primary-600' : option.color
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-secondary-900">
                        {option.label}
                      </h4>
                      {role === option.value && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.role && (
            <div className="flex items-center space-x-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.role}</span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Lưu ý:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Người được mời sẽ nhận email thông báo</li>
                <li>• Họ cần có tài khoản CareNest để tham gia</li>
                <li>• Bạn có thể thay đổi vai trò sau khi họ tham gia</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi lời mời'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
