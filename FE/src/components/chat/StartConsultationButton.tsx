'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { chatApiService } from '@/services/chatApi'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

interface StartConsultationButtonProps {
  providerId: string
  providerName: string
  consultationFee?: number
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function StartConsultationButton({
  providerId,
  providerName,
  consultationFee,
  className,
  variant = 'default',
  size = 'md'
}: StartConsultationButtonProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isCreating, setIsCreating] = useState(false)

  const handleStartConsultation = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để bắt đầu tư vấn')
      router.push('/login')
      return
    }

    try {
      setIsCreating(true)

      const response = await chatApiService.createConversation({
        type: 'consultation',
        healthcareProviderId: providerId,
        consultationFee,
        title: `Tư vấn với ${providerName}`
      })

      if (response.success) {
        toast.success('Đã tạo cuộc tư vấn thành công!')
        router.push(`/chat?conversation=${response.data.id}`)
      } else {
        toast.error(response.message || 'Không thể tạo cuộc tư vấn')
      }
    } catch (error) {
      console.error('Failed to create consultation:', error)
      toast.error('Có lỗi xảy ra khi tạo cuộc tư vấn')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Button
      onClick={handleStartConsultation}
      disabled={isCreating}
      variant={variant}
      size={size}
      className={className}
      leftIcon={
        isCreating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )
      }
    >
      {isCreating ? 'Đang tạo...' : 'Bắt đầu tư vấn'}
    </Button>
  )
}
