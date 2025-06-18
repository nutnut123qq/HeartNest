'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { 
  CreditCard, 
  Crown, 
  Calendar,
  Download,
  Receipt,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'wallet'
  name: string
  details: string
  isDefault: boolean
  expiryDate?: string
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  downloadUrl: string
}

export const BillingSettings: React.FC = () => {
  const [currentPlan] = useState(SUBSCRIPTION_PLANS.LOVE_PACKAGE)
  const [nextBillingDate] = useState('2024-04-15')
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ****1234',
      details: 'Hết hạn 12/2025',
      isDefault: true,
      expiryDate: '12/2025'
    },
    {
      id: '2',
      type: 'bank',
      name: 'Vietcombank',
      details: 'Tài khoản ****5678',
      isDefault: false
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Ví MoMo',
      details: 'Số điện thoại ****9012',
      isDefault: false
    }
  ])

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      amount: 109000,
      status: 'paid',
      description: 'Gói Yêu Thương - 3 tháng',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-012',
      date: '2023-10-15',
      amount: 109000,
      status: 'paid',
      description: 'Gói Yêu Thương - 3 tháng',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-009',
      date: '2023-07-15',
      amount: 89000,
      status: 'paid',
      description: 'Gói Gia Đình Nhỏ - 3 tháng',
      downloadUrl: '#'
    }
  ])

  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })))
  }

  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-success-600 bg-success-100'
      case 'pending': return 'text-care-600 bg-care-100'
      case 'failed': return 'text-error-600 bg-error-100'
      default: return 'text-secondary-600 bg-secondary-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán'
      case 'pending': return 'Đang xử lý'
      case 'failed': return 'Thất bại'
      default: return 'Không xác định'
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />
      case 'bank': return <Receipt className="h-5 w-5" />
      case 'wallet': return <CreditCard className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Gói dịch vụ hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-care-50 to-primary-50 rounded-xl border border-care-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-care-500 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-secondary-900 text-lg">
                  {currentPlan.name}
                </div>
                <div className="text-secondary-600">
                  {formatCurrency(currentPlan.price)} / {currentPlan.duration} tháng
                </div>
                <div className="text-sm text-secondary-500 mt-1">
                  Gia hạn tự động vào {formatDate(nextBillingDate)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Thay đổi gói
              </Button>
              <Button variant="outline" size="sm">
                Hủy gói
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Phương thức thanh toán
            </CardTitle>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Thêm phương thức
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={cn(
                  'flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300',
                  method.isDefault 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-secondary-200 hover:border-primary-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    method.isDefault ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                  )}>
                    {getPaymentMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900 flex items-center gap-2">
                      {method.name}
                      {method.isDefault && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-secondary-600">{method.details}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit3 className="h-3 w-3" />}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaymentMethod(method.id)}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Lịch sử thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl hover:bg-secondary-25 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">
                      {invoice.description}
                    </div>
                    <div className="text-sm text-secondary-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.date)}
                      </span>
                      <span>Mã: {invoice.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-secondary-900">
                      {formatCurrency(invoice.amount)}
                    </div>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(invoice.status)
                    )}>
                      {invoice.status === 'paid' && <CheckCircle className="h-3 w-3" />}
                      {invoice.status === 'failed' && <AlertCircle className="h-3 w-3" />}
                      {getStatusText(invoice.status)}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-3 w-3" />}
                  >
                    Tải xuống
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" leftIcon={<ExternalLink className="h-4 w-4" />}>
              Xem tất cả hóa đơn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-secondary-700">Tên công ty/cá nhân</label>
              <div className="mt-1 p-3 bg-secondary-50 rounded-lg text-secondary-900">
                Nguyễn Văn A
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-secondary-700">Mã số thuế</label>
              <div className="mt-1 p-3 bg-secondary-50 rounded-lg text-secondary-600">
                Chưa cập nhật
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-secondary-700">Địa chỉ thanh toán</label>
              <div className="mt-1 p-3 bg-secondary-50 rounded-lg text-secondary-600">
                123 Đường ABC, Quận 1, TP. Hồ Chí Minh
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" leftIcon={<Edit3 className="h-4 w-4" />}>
              Cập nhật thông tin
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Sử dụng và giới hạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-secondary-700">Thành viên gia đình</span>
              <span className="font-medium text-secondary-900">
                2 / {currentPlan.maxFamilyMembers === -1 ? '∞' : currentPlan.maxFamilyMembers}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-secondary-700">Nhắc nhở tháng này</span>
              <span className="font-medium text-secondary-900">45 / ∞</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <span className="text-secondary-700">Chat với bác sĩ</span>
              <span className="font-medium text-secondary-900">12 / ∞</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
