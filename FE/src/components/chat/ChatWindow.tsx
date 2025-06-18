'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useMessages, useChatStore, useCurrentConversation } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { chatApiService, MessageType } from '@/services/chatApi'
import { signalRService } from '@/services/signalRService'
import { api } from '@/lib/api'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { Button } from '@/components/ui/Button'
import { Play, Square, Phone, Video } from 'lucide-react'
import { toast } from 'sonner'

export function ChatWindow() {
  const { user } = useAuthStore()
  const currentConversation = useCurrentConversation()
  const messages = useMessages()
  const {
    setMessages,
    addMessage,
    setLoading,
    setError,
    clearError
  } = useChatStore()

  // Current user state - will be fetched from backend
  const [currentUser, setCurrentUser] = useState<{
    id: string
    email: string
    firstName: string
    lastName: string
    fullName?: string
  } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)

  // Use auth store user directly (temporary fix until JWT parsing is fixed)
  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`
      })

    } else {
      console.error('No authenticated user available in auth store')
    }
  }, [user])

  useEffect(() => {
    if (currentConversation) {
      loadMessages()
      joinConversation()
      markAsRead()
    }

    return () => {
      if (currentConversation) {
        leaveConversation()
      }
    }
  }, [currentConversation?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async (pageNum = 1) => {
    if (!currentConversation) return

    try {
      setIsLoadingMessages(true)
      clearError()

      const response = await chatApiService.getMessages(
        currentConversation.id,
        pageNum,
        50
      )

      if (response.success) {
        // API returns messages in DESC order (newest first), but we need ASC order (oldest first) for display
        const sortedMessages = [...response.data].reverse()

        if (pageNum === 1) {
          setMessages(sortedMessages)
          // Scroll to bottom for initial load
          setTimeout(() => scrollToBottom(), 100)
        } else {
          // Prepend older messages (they come in DESC order, so reverse and prepend)
          setMessages([...sortedMessages, ...messages])
        }

        setHasMoreMessages(response.data.length === 50)
        setPage(pageNum)
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      setError('Không thể tải tin nhắn')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const joinConversation = async () => {
    if (currentConversation) {
      await signalRService.joinConversation(currentConversation.id)
    }
  }

  const leaveConversation = async () => {
    if (currentConversation) {
      await signalRService.leaveConversation(currentConversation.id)
    }
  }

  const markAsRead = async () => {
    if (currentConversation) {
      try {
        // Temporarily disabled due to authentication issues
        // await chatApiService.markConversationAsRead(currentConversation.id)

      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }
  }

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file' | 'voice' = 'text', fileData?: any) => {
    if (!currentConversation || !currentUser) return

    try {
      // Map string type to MessageType enum
      const messageTypeMap = {
        'text': MessageType.Text,
        'image': MessageType.Image,
        'file': MessageType.File,
        'voice': MessageType.Voice
      }

      const messageData = {
        conversationId: currentConversation.id,
        content,
        type: messageTypeMap[type],
        ...fileData
      }

      const response = await chatApiService.sendMessage(messageData)

      if (response.success) {
        // Message will be added via SignalR, but add optimistically for better UX
        addMessage(response.data)
        scrollToBottom()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Không thể gửi tin nhắn')
    }
  }

  const handleStartConsultation = async () => {
    if (!currentConversation) return

    try {
      const response = await chatApiService.startConsultation(currentConversation.id)
      if (response.success) {
        toast.success('Đã bắt đầu cuộc tư vấn')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Failed to start consultation:', error)
      toast.error('Không thể bắt đầu cuộc tư vấn')
    }
  }

  const handleEndConsultation = async () => {
    if (!currentConversation) return

    try {
      const response = await chatApiService.endConsultation(currentConversation.id)
      if (response.success) {
        toast.success('Đã kết thúc cuộc tư vấn')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Failed to end consultation:', error)
      toast.error('Không thể kết thúc cuộc tư vấn')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMoreMessages = () => {
    if (hasMoreMessages && !isLoadingMessages) {
      loadMessages(page + 1)
    }
  }

  if (!currentConversation) {
    return null
  }

  const canStartConsultation = currentConversation.type === 'consultation' &&
    currentConversation.consultationStatus === 'pending'

  const canEndConsultation = currentConversation.type === 'consultation' &&
    currentConversation.consultationStatus === 'active'

  return (
    <div className="flex flex-col h-full">
      {/* Consultation Controls */}
      {currentConversation.type === 'consultation' && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              {currentConversation.consultationStatus === 'pending' && 'Cuộc tư vấn chưa bắt đầu'}
              {currentConversation.consultationStatus === 'active' && 'Cuộc tư vấn đang diễn ra'}
              {currentConversation.consultationStatus === 'completed' && 'Cuộc tư vấn đã hoàn thành'}
              {currentConversation.consultationStatus === 'cancelled' && 'Cuộc tư vấn đã bị hủy'}
            </div>

            <div className="flex items-center space-x-2">
              {canStartConsultation && (
                <Button
                  size="sm"
                  onClick={handleStartConsultation}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Bắt đầu tư vấn
                </Button>
              )}

              {canEndConsultation && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEndConsultation}
                  leftIcon={<Square className="w-4 h-4" />}
                >
                  Kết thúc tư vấn
                </Button>
              )}

              {currentConversation.consultationStatus === 'active' && (
                <>
                  <Button size="sm" variant="ghost">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Load More Button */}
        {hasMoreMessages && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMoreMessages}
              disabled={isLoadingMessages}
            >
              {isLoadingMessages ? 'Đang tải...' : 'Tải tin nhắn cũ hơn'}
            </Button>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUser?.id
          const showAvatar = index === 0 ||
            messages[index - 1].senderId !== message.senderId



          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          )
        })}

        {/* Loading indicator */}
        {isLoadingMessages && messages.length === 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !isLoadingMessages && (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={currentConversation.type === 'consultation' &&
            currentConversation.consultationStatus !== 'active' &&
            currentConversation.consultationStatus !== 'pending'}
        />
      </div>
    </div>
  )
}
