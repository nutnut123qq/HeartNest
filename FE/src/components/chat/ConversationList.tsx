'use client'

import React, { useState } from 'react'
import { useConversations, useChatStore, useCurrentConversation } from '@/store/chatStore'
import { Search, Plus, MessageCircle, Users, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProviderSelectionModal } from './ProviderSelectionModal'

export function ConversationList() {
  const conversations = useConversations()
  const currentConversation = useCurrentConversation()
  const { setCurrentConversation, loading } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      conv.title?.toLowerCase().includes(searchLower) ||
      conv.participants.some(p =>
        p.user.fullName.toLowerCase().includes(searchLower)
      )
    )
  })

  const handleConversationSelect = (conversation: any) => {
    setCurrentConversation(conversation)
  }

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="w-5 h-5 text-blue-600" />
      case 'group':
        return <Users className="w-5 h-5 text-green-600" />
      default:
        return <MessageCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getConversationTitle = (conversation: any) => {
    if (conversation.title) return conversation.title

    if (conversation.type === 'consultation') {
      return conversation.healthcareProvider?.fullName || 'Tư vấn y tế'
    }

    // For direct conversations, show other participant's name
    if (conversation.participants && Array.isArray(conversation.participants)) {
      const otherParticipant = conversation.participants.find((p: any) =>
        p.user.id !== currentConversation?.id
      )
      return otherParticipant?.user.fullName || 'Cuộc trò chuyện'
    }

    return 'Cuộc trò chuyện'
  }

  const getLastMessagePreview = (conversation: any) => {
    if (!conversation.lastMessage) return 'Chưa có tin nhắn'

    const message = conversation.lastMessage
    if (message.type === 'text') {
      return message.content
    } else if (message.type === 'image') {
      return '📷 Hình ảnh'
    } else if (message.type === 'file') {
      return '📎 File đính kèm'
    } else if (message.type === 'voice') {
      return '🎵 Tin nhắn thoại'
    } else if (message.type === 'system') {
      return message.content
    }
    return 'Tin nhắn'
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and New Chat */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => setShowNewChatModal(true)}
          className="w-full"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Cuộc trò chuyện mới
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation?.id === conversation.id
                    ? 'bg-primary-50 border-r-2 border-primary-500'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getConversationIcon(conversation.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getConversationTitle(conversation)}
                      </h4>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {getLastMessagePreview(conversation)}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-600 rounded-full flex-shrink-0 ml-2">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Consultation status */}
                    {conversation.type === 'consultation' && conversation.consultationStatus && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          conversation.consultationStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : conversation.consultationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conversation.consultationStatus === 'active' && 'Đang tư vấn'}
                          {conversation.consultationStatus === 'pending' && 'Chờ bắt đầu'}
                          {conversation.consultationStatus === 'completed' && 'Đã hoàn thành'}
                          {conversation.consultationStatus === 'cancelled' && 'Đã hủy'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provider Selection Modal */}
      <ProviderSelectionModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
      />
    </div>
  )
}
