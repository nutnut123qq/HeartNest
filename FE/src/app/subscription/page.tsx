'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import {
  Crown,
  Gift,
  CreditCard,
  Sparkles
} from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PricingCard, FeatureComparison, FAQ, PaymentModal } from '@/components/subscription'

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('quarterly')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null)

  const plans = Object.values(SUBSCRIPTION_PLANS)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return

    const plan = plans.find(p => p.id === planId)
    if (plan) {
      setSelectedPlanForPayment(plan)
      setShowPaymentModal(true)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-care-100 px-4 py-2 rounded-full">
            <Crown className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Nâng cấp gói dịch vụ</span>
          </div>

          <h1 className="text-4xl font-bold text-secondary-900">
            Chọn gói dịch vụ phù hợp
          </h1>

          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Trải nghiệm đầy đủ tính năng chăm sóc sức khỏe gia đình với các gói dịch vụ được thiết kế riêng cho nhu cầu của bạn
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-2 shadow-soft border border-secondary-200">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                  billingCycle === 'monthly'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-secondary-600 hover:text-primary-600'
                )}
              >
                Thanh toán hàng tháng
              </button>
              <button
                onClick={() => setBillingCycle('quarterly')}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative',
                  billingCycle === 'quarterly'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-secondary-600 hover:text-primary-600'
                )}
              >
                Thanh toán 3 tháng
                <span className="absolute -top-2 -right-2 bg-care-500 text-white text-xs px-2 py-1 rounded-full">
                  Tiết kiệm
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={handleSelectPlan}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>

        {/* Features Comparison Section */}
        <FeatureComparison plans={plans} />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary-600 to-care-600 rounded-3xl p-8 text-white">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">
              Bắt đầu chăm sóc sức khỏe gia đình ngay hôm nay
            </h2>
            <p className="text-primary-100 text-lg">
              Tham gia cùng hàng nghìn gia đình đã tin tưởng CareNest để chăm sóc sức khỏe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
                leftIcon={<Gift className="h-5 w-5" />}
              >
                Dùng thử miễn phí
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
                leftIcon={<CreditCard className="h-5 w-5" />}
              >
                Xem bảng giá chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlanForPayment}
      />
    </DashboardLayout>
  )
}

export default SubscriptionPage
