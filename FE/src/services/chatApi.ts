import { api } from '@/lib/api'
import { Conversation, Message, ConversationParticipant } from '@/types'

export interface CreateConversationRequest {
  type: 'direct' | 'group' | 'consultation'
  title?: string
  description?: string
  healthcareProviderId?: string
  consultationFee?: number
  otherUserId?: string
}

// Backend MessageType enum mapping
export enum MessageType {
  Text = 1,
  Image = 2,
  File = 3,
  Voice = 4,
  System = 5
}

export interface CreateMessageRequest {
  conversationId: string
  content: string
  type: MessageType
  fileName?: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
  durationSeconds?: number
  replyToMessageId?: string
  metadata?: Record<string, any>
}

export interface UpdateMessageRequest {
  content: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors?: string[]
}

class ChatApiService {
  // Conversations
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get('/api/chat/conversations')
    return response.data
  }

  async getConversation(conversationId: string, includeMessages = false, page = 1, pageSize = 50): Promise<ApiResponse<Conversation>> {
    const params = new URLSearchParams({
      includeMessages: includeMessages.toString(),
      page: page.toString(),
      pageSize: pageSize.toString()
    })

    const response = await api.get(`/api/chat/conversations/${conversationId}?${params}`)
    return response.data
  }

  async createConversation(request: CreateConversationRequest): Promise<ApiResponse<Conversation>> {
    try {
      console.log('Creating conversation with:', request)
      // Backend chỉ có một endpoint /conversations cho tất cả loại conversation
      const response = await api.post('/api/chat/conversations', {
        healthcareProviderId: request.healthcareProviderId
      })
      console.log('Conversation created:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error creating conversation:', {
        request,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      throw error
    }
  }

  // Healthcare Providers
  async getHealthcareProviders(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/api/chat/providers')
    return response.data
  }

  // Messages
  async getMessages(conversationId: string, page = 1, pageSize = 50): Promise<ApiResponse<Message[]>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })

      const response = await api.get(`/api/chat/conversations/${conversationId}/messages?${params}`)
      return response.data
  }

  async sendMessage(request: CreateMessageRequest): Promise<ApiResponse<Message>> {
    const response = await api.post('/api/chat/messages', request)
    return response.data
  }

  async editMessage(messageId: string, request: UpdateMessageRequest): Promise<ApiResponse<Message>> {
    const response = await api.put(`/api/chat/messages/${messageId}`, request)
    return response.data
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<boolean>> {
    const response = await api.delete(`/api/chat/messages/${messageId}`)
    return response.data
  }

  // Read status
  async markConversationAsRead(conversationId: string): Promise<ApiResponse<boolean>> {
    const response = await api.post(`/api/chat/conversations/${conversationId}/mark-read`)
    return response.data
  }

  async getUnreadCount(): Promise<ApiResponse<number>> {
    const response = await api.get('/api/chat/unread-count')
    return response.data
  }

  // Consultation management
  async startConsultation(conversationId: string): Promise<ApiResponse<boolean>> {
    const response = await api.post(`/api/chat/conversations/${conversationId}/start-consultation`)
    return response.data
  }

  async endConsultation(conversationId: string): Promise<ApiResponse<boolean>> {
    const response = await api.post(`/api/chat/conversations/${conversationId}/end-consultation`)
    return response.data
  }

  async cancelConsultation(conversationId: string): Promise<ApiResponse<boolean>> {
    const response = await api.post(`/api/chat/conversations/${conversationId}/cancel-consultation`)
    return response.data
  }

  // File upload
  async uploadFile(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export const chatApiService = new ChatApiService()
