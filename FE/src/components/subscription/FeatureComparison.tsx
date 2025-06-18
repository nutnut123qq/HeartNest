'use client'

import React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  tier: string
  price: number
  duration: number
  maxFamilyMembers: number
  features: string[]
  channels: string[]
  popular: boolean
  pricePerPerson?: boolean
}

interface FeatureComparisonProps {
  plans: Plan[]
}

interface ComparisonFeature {
  name: string
  key: string
  getValue: (plan: Plan) => string | boolean | number
  type: 'boolean' | 'text' | 'number'
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: 'Số thành viên gia đình',
    key: 'maxFamilyMembers',
    getValue: (plan) => plan.maxFamilyMembers === -1 ? 'Không giới hạn' : plan.maxFamilyMembers,
    type: 'text'
  },
  {
    name: 'Nhắc nhở cơ bản',
    key: 'basicReminders',
    getValue: () => true,
    type: 'boolean'
  },
  {
    name: 'Tìm kiếm cơ sở y tế',
    key: 'healthcareFinder',
    getValue: () => true,
    type: 'boolean'
  },
  {
    name: 'Chat với bác sĩ',
    key: 'doctorChat',
    getValue: (plan) => {
      if (plan.id === 'free') return false
      if (plan.id === 'small_family') return 'Cơ bản'
      return 'Không giới hạn'
    },
    type: 'text'
  },
  {
    name: 'Thông báo đẩy',
    key: 'pushNotifications',
    getValue: (plan) => plan.channels.includes('push'),
    type: 'boolean'
  },
  {
    name: 'Thông báo Email',
    key: 'emailNotifications',
    getValue: (plan) => plan.channels.includes('email'),
    type: 'boolean'
  },
  {
    name: 'Thông báo SMS',
    key: 'smsNotifications',
    getValue: (plan) => plan.channels.includes('sms'),
    type: 'boolean'
  },
  {
    name: 'Thông báo Zalo',
    key: 'zaloNotifications',
    getValue: (plan) => plan.channels.includes('zalo'),
    type: 'boolean'
  },
  {
    name: 'Báo cáo sức khỏe gia đình',
    key: 'familyHealthReports',
    getValue: (plan) => plan.id === 'love_package' || plan.id === 'custom',
    type: 'boolean'
  },
  {
    name: 'Phân tích sức khỏe nâng cao',
    key: 'advancedAnalytics',
    getValue: (plan) => plan.id === 'custom',
    type: 'boolean'
  },
  {
    name: 'Hỗ trợ ưu tiên',
    key: 'prioritySupport',
    getValue: (plan) => plan.id === 'love_package' || plan.id === 'custom',
    type: 'boolean'
  },
  {
    name: 'Hỗ trợ 24/7',
    key: 'support24x7',
    getValue: (plan) => plan.id === 'custom',
    type: 'boolean'
  },
  {
    name: 'Tích hợp API tùy chỉnh',
    key: 'customApi',
    getValue: (plan) => plan.id === 'custom',
    type: 'boolean'
  }
]

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({ plans }) => {
  const renderValue = (feature: ComparisonFeature, plan: Plan) => {
    const value = feature.getValue(plan)
    
    if (feature.type === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-primary-600 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-secondary-300 mx-auto" />
      )
    }
    
    if (feature.type === 'text' || feature.type === 'number') {
      return (
        <span className={cn(
          'text-sm',
          value === false || value === 0 ? 'text-secondary-400' : 'text-secondary-700'
        )}>
          {value === false ? '—' : value}
        </span>
      )
    }
    
    return null
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-secondary-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">
          So sánh chi tiết các gói dịch vụ
        </h2>
        <p className="text-secondary-600">
          Tìm hiểu chi tiết về các tính năng và lợi ích của từng gói dịch vụ
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-secondary-200">
              <th className="text-left py-4 px-4 font-semibold text-secondary-900 min-w-[200px]">
                Tính năng
              </th>
              {plans.map((plan) => (
                <th key={plan.id} className="text-center py-4 px-4 font-semibold text-secondary-900 min-w-[120px]">
                  <div className="space-y-1">
                    <div className={cn(
                      'text-sm font-medium',
                      plan.popular && 'text-care-600'
                    )}>
                      {plan.name}
                    </div>
                    {plan.popular && (
                      <div className="text-xs text-care-500 font-medium">
                        Phổ biến
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {comparisonFeatures.map((feature, index) => (
              <tr key={feature.key} className={cn(
                'hover:bg-secondary-25 transition-colors',
                index % 2 === 0 && 'bg-secondary-25/50'
              )}>
                <td className="py-4 px-4 font-medium text-secondary-700">
                  {feature.name}
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-4 px-4">
                    {renderValue(feature, plan)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly cards for smaller screens */}
      <div className="lg:hidden mt-8 space-y-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-secondary-50 rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className={cn(
                'text-lg font-semibold',
                plan.popular ? 'text-care-600' : 'text-secondary-900'
              )}>
                {plan.name}
              </h3>
              {plan.popular && (
                <div className="text-sm text-care-500 font-medium">
                  Phổ biến nhất
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {comparisonFeatures.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700 font-medium">
                    {feature.name}
                  </span>
                  <div className="flex items-center">
                    {renderValue(feature, plan)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
