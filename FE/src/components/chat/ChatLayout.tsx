'use client'

import React, { useEffect, useState } from 'react'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { useChatStore, useCurrentConversation, useCurrentConversationId } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { chatApiService } from '@/services/chatApi'
import { signalRService } from '@/services/signalRService'
import { MessageCircle, Users, Phone, Video, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ChatLayoutProps {
  className?: string
}

export function ChatLayout({ className = '' }: ChatLayoutProps) {
  const { user, accessToken } = useAuthStore()
  const currentConversation = useCurrentConversation()
  const currentConversationId = useCurrentConversationId()
  const {
    conversations,
    setConversations,
    setCurrentConversation,
    setLoading,
    setError,
    clearError
  } = useChatStore()

  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (user && accessToken) {
      initializeChat()
    }

    return () => {
      signalRService.disconnect()
    }
  }, [user, accessToken])

  const initializeChat = async () => {
    try {
      setLoading(true)
      setIsConnecting(true)
      clearError()

      // Load conversations
      const conversationsResponse = await chatApiService.getConversations()

      if (conversationsResponse.success) {
        setConversations(conversationsResponse.data)

        // Restore current conversation if we have a persisted ID
        if (currentConversationId && !currentConversation) {
          await restoreCurrentConversation(currentConversationId, conversationsResponse.data)
        }
      } else {
        console.error('Failed to load conversations:', conversationsResponse)
      }

      // SignalR temporarily disabled due to authentication issues
      // TODO: Re-enable when authentication is properly configured

    } catch (error) {
      console.error('Failed to initialize chat:', error)
      setError('Không thể kết nối đến hệ thống chat')
    } finally {
      setLoading(false)
      setIsConnecting(false)
    }
  }

  const restoreCurrentConversation = async (conversationId: string, conversations: any[]) => {
    try {
      // First try to find in loaded conversations
      const foundConversation = conversations.find(c => c.id === conversationId)
      if (foundConversation) {
        setCurrentConversation(foundConversation)
        return
      }

      // If not found, fetch from server
      const response = await chatApiService.getConversation(conversationId, true)
      if (response.success) {
        const conversation = response.data
        setCurrentConversation(conversation)

        // Add to conversations list if not already there
        const currentConversations = useChatStore.getState().conversations
        const existsInList = currentConversations.some(c => c.id === conversation.id)
        if (!existsInList) {
          setConversations([conversation, ...currentConversations])
        }
      }
    } catch (error) {
      console.error('Failed to restore conversation:', error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Vui lòng đăng nhập để sử dụng chat</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Sidebar - Conversation List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
              Tin nhắn
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isConnecting && (
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              Đang kết nối...
            </div>
          )}

          {signalRService.isConnectionActive() && (
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Đã kết nối
            </div>
          )}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-hidden">
          <ConversationList />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {currentConversation.type === 'consultation' ? (
                      <MessageCircle className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Users className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentConversation.title ||
                       (currentConversation.type === 'consultation'
                         ? 'Tư vấn y tế'
                         : 'Cuộc trò chuyện')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.type === 'consultation' && currentConversation.consultationStatus && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          currentConversation.consultationStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : currentConversation.consultationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {currentConversation.consultationStatus === 'active' && 'Đang tư vấn'}
                          {currentConversation.consultationStatus === 'pending' && 'Chờ bắt đầu'}
                          {currentConversation.consultationStatus === 'completed' && 'Đã hoàn thành'}
                          {currentConversation.consultationStatus === 'cancelled' && 'Đã hủy'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  {currentConversation.type === 'consultation' && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow />
            </div>
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-500">
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
