'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được quá 50 ký tự'),
  lastName: z
    .string()
    .min(1, 'Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự'),
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+84|0)[3-9]\d{8}$/.test(val), {
      message: 'Số điện thoại không hợp lệ',
    }),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .refine((password) => {
      const hasLowerCase = /[a-z]/.test(password)
      const hasUpperCase = /[A-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasSpecialChar = /[@$!%*?&()#^~_+=\[\]{}|\\:";'<>?,./`-]/.test(password)
      return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar
    }, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với điều khoản sử dụng',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, acceptTerms, phone, ...registerData } = data
      const apiData = {
        ...registerData,
        phoneNumber: phone, // Map phone to phoneNumber
        confirmPassword,
      }
      console.log('Form data:', data)
      console.log('API data being sent:', apiData)
      console.log('API data JSON:', JSON.stringify(apiData, null, 2))
      await registerUser(apiData)
      toast.success('Đăng ký thành công!')
      onSuccess?.()
    } catch (error: any) {
      console.error('Register error:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error response status:', error.response?.status)
      console.error('Error response headers:', error.response?.headers)

      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.join(', ')
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title
      }

      toast.error(errorMessage)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản mới để sử dụng CareNest
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('firstName')}
              label="Họ"
              placeholder="Nhập họ"
              error={errors.firstName?.message}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="given-name"
            />

            <Input
              {...register('lastName')}
              label="Tên"
              placeholder="Nhập tên"
              error={errors.lastName?.message}
              leftIcon={<User className="h-4 w-4" />}
              autoComplete="family-name"
            />
          </div>

          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="Nhập email của bạn"
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />

          <Input
            {...register('phone')}
            type="tel"
            label="Số điện thoại (tùy chọn)"
            placeholder="Nhập số điện thoại"
            error={errors.phone?.message}
            leftIcon={<Phone className="h-4 w-4" />}
            autoComplete="tel"
          />

          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            error={errors.password?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            autoComplete="new-password"
          />

          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            autoComplete="new-password"
          />

          <div className="space-y-2">
            <label className="flex items-start space-x-2">
              <input
                {...register('acceptTerms')}
                type="checkbox"
                className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-600">
                Tôi đồng ý với{' '}
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Điều khoản sử dụng
                </button>{' '}
                và{' '}
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Chính sách bảo mật
                </button>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-error-600">{errors.acceptTerms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-secondary-600">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
