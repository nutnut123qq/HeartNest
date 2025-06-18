'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    id: string
    name: string
    price: number
    duration: number
  } | null
}

type PaymentMethod = 'card' | 'momo' | 'banking' | 'vnpay'

const paymentMethods = [
  {
    id: 'card' as PaymentMethod,
    name: 'Thẻ tín dụng/ghi nợ',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB',
    popular: true
  },
  {
    id: 'momo' as PaymentMethod,
    name: 'Ví MoMo',
    icon: Smartphone,
    description: 'Thanh toán qua ví điện tử',
    popular: true
  },
  {
    id: 'banking' as PaymentMethod,
    name: 'Chuyển khoản ngân hàng',
    icon: Building2,
    description: 'Internet Banking, ATM',
    popular: false
  },
  {
    id: 'vnpay' as PaymentMethod,
    name: 'VNPay',
    icon: CreditCard,
    description: 'Cổng thanh toán VNPay',
    popular: false
  }
]

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  })

  if (!isOpen || !plan) return null

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setStep('details')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setStep('processing')
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setStep('success')
    setIsProcessing(false)
  }

  const handleClose = () => {
    setStep('method')
    setSelectedMethod('card')
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      email: '',
      phone: ''
    })
    onClose()
  }

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          Chọn phương thức thanh toán
        </h3>
        <p className="text-secondary-600">
          Chọn phương thức thanh toán phù hợp với bạn
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className={cn(
              'w-full p-4 border-2 rounded-2xl text-left transition-all duration-300 hover:border-primary-300',
              selectedMethod === method.id 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-secondary-200 hover:bg-secondary-25'
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                selectedMethod === method.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-secondary-100 text-secondary-600'
              )}>
                <method.icon className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-secondary-900">
                    {method.name}
                  </span>
                  {method.popular && (
                    <span className="text-xs bg-care-100 text-care-700 px-2 py-1 rounded-full">
                      Phổ biến
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary-600 mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          Thông tin thanh toán
        </h3>
        <p className="text-secondary-600">
          Nhập thông tin để hoàn tất thanh toán
        </p>
      </div>

      {selectedMethod === 'card' && (
        <div className="space-y-4">
          <Input
            label="Số thẻ"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ngày hết hạn"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
            />
          </div>
          
          <Input
            label="Tên chủ thẻ"
            placeholder="NGUYEN VAN A"
            value={formData.cardName}
            onChange={(e) => handleInputChange('cardName', e.target.value)}
          />
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        
        <Input
          label="Số điện thoại"
          placeholder="0123456789"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('method')}
          className="flex-1"
        >
          Quay lại
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1"
          rightIcon={<CreditCard className="h-4 w-4" />}
        >
          Thanh toán {formatPrice(plan.price)}
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
        Đang xử lý thanh toán
      </h3>
      <p className="text-secondary-600">
        Vui lòng đợi trong giây lát...
      </p>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-success-600" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
        Thanh toán thành công!
      </h3>
      <p className="text-secondary-600 mb-6">
        Bạn đã nâng cấp thành công lên gói {plan.name}
      </p>
      <Button onClick={handleClose} className="w-full">
        Hoàn tất
      </Button>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-100">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">
              Nâng cấp gói dịch vụ
            </h2>
            <p className="text-sm text-secondary-600">
              {plan.name} - {formatPrice(plan.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && renderMethodSelection()}
          {step === 'details' && renderPaymentDetails()}
          {step === 'processing' && renderProcessing()}
          {step === 'success' && renderSuccess()}
        </div>

        {/* Security notice */}
        {(step === 'method' || step === 'details') && (
          <div className="px-6 pb-6">
            <div className="bg-secondary-50 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    Bảo mật SSL 256-bit
                  </p>
                  <p className="text-xs text-secondary-600">
                    Thông tin của bạn được bảo vệ an toàn
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
