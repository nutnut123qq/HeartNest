'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Check, 
  Star, 
  Users, 
  MessageCircle, 
  Bell, 
  Zap,
  Heart,
  Crown,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  plan: {
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
  isSelected?: boolean
  onSelect?: (planId: string) => void
  onUpgrade?: (planId: string) => void
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isSelected = false,
  onSelect,
  onUpgrade
}) => {
  const formatPrice = (price: number, duration: number) => {
    if (price === 0) return 'Miễn phí'
    if (duration === 0) return 'Miễn phí'
    
    const monthlyPrice = price / duration
    return {
      total: price.toLocaleString('vi-VN'),
      monthly: Math.round(monthlyPrice).toLocaleString('vi-VN'),
      duration
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Heart className="h-8 w-8" />
      case 'small_family':
        return <Users className="h-8 w-8" />
      case 'love_package':
        return <Crown className="h-8 w-8" />
      case 'custom':
        return <Sparkles className="h-8 w-8" />
      default:
        return <Heart className="h-8 w-8" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-secondary-500 to-secondary-600'
      case 'small_family':
        return 'from-primary-500 to-primary-600'
      case 'love_package':
        return 'from-care-500 to-care-600'
      case 'custom':
        return 'from-trust-500 to-trust-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  const priceInfo = formatPrice(plan.price, plan.duration)
  const isPopular = plan.popular

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer',
        isSelected && 'ring-2 ring-primary-500 shadow-xl',
        isPopular && 'border-2 border-care-400 shadow-lg'
      )}
      onClick={() => onSelect?.(plan.id)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-care-500 to-care-600 text-white text-center py-2 text-sm font-medium">
          <Star className="inline h-4 w-4 mr-1" />
          Phổ biến nhất
        </div>
      )}

      <CardHeader className={cn('text-center', isPopular && 'pt-12')}>
        {/* Plan Icon */}
        <div className={cn(
          'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white mb-4',
          `bg-gradient-to-r ${getPlanColor(plan.id)}`
        )}>
          {getPlanIcon(plan.id)}
        </div>

        <CardTitle className="text-xl font-bold text-secondary-900 mb-2">
          {plan.name}
        </CardTitle>

        {/* Price */}
        <div className="space-y-1">
          {typeof priceInfo === 'string' ? (
            <div className="text-3xl font-bold text-secondary-900">
              {priceInfo}
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-secondary-900">
                {priceInfo.total}đ
                {plan.pricePerPerson && (
                  <span className="text-sm font-normal text-secondary-500">/người</span>
                )}
              </div>
              <div className="text-sm text-secondary-500">
                ~{priceInfo.monthly}đ/tháng
                {plan.pricePerPerson && <span>/người</span>}
              </div>
              <div className="text-xs text-secondary-400">
                Thanh toán {priceInfo.duration} tháng
              </div>
            </>
          )}
        </div>

        {/* Family Members */}
        <div className="flex items-center justify-center gap-2 text-sm text-secondary-600 mt-3">
          <Users className="h-4 w-4" />
          <span>
            {plan.maxFamilyMembers === -1 
              ? 'Không giới hạn' 
              : `${plan.maxFamilyMembers} thành viên`
            }
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-secondary-700 leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Notification Channels */}
        <div className="pt-4 border-t border-secondary-100">
          <div className="text-xs font-medium text-secondary-500 mb-2">
            Kênh thông báo:
          </div>
          <div className="flex flex-wrap gap-1">
            {plan.channels.map((channel) => (
              <span
                key={channel}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 text-secondary-600 rounded-lg text-xs"
              >
                {channel === 'web' && <Bell className="h-3 w-3" />}
                {channel === 'email' && <MessageCircle className="h-3 w-3" />}
                {channel === 'sms' && <MessageCircle className="h-3 w-3" />}
                {channel === 'push' && <Zap className="h-3 w-3" />}
                {channel === 'zalo' && <MessageCircle className="h-3 w-3" />}
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={plan.id === 'free' ? 'outline' : isPopular ? 'care' : 'default'}
          size="lg"
          className="w-full mt-6"
          onClick={(e) => {
            e.stopPropagation()
            onUpgrade?.(plan.id)
          }}
          rightIcon={plan.id !== 'free' && <ArrowRight className="h-4 w-4" />}
        >
          {plan.id === 'free' ? 'Gói hiện tại' : 'Chọn gói này'}
        </Button>
      </CardContent>
    </Card>
  )
}
