'use client'

import React, { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { ChatLayout } from '@/components/chat/ChatLayout'
import { useChatStore } from '@/store/chatStore'
import { chatApiService } from '@/services/chatApi'

function ChatPageContent() {
  const searchParams = useSearchParams()
  const conversationId = searchParams?.get('conversation')
  const { setCurrentConversation, setLoading } = useChatStore()

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId])

  const loadConversation = async (id: string) => {
    try {
      setLoading(true)
      const response = await chatApiService.getConversation(id, true)

      if (response.success) {
        setCurrentConversation(response.data)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-full">
        <ChatLayout className="h-[calc(100vh-120px)]" />
      </div>
    </DashboardLayout>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
