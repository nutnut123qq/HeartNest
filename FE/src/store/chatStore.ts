import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message, ConversationParticipant } from '@/types'

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  currentConversationId: string | null // Add this for persistence
  messages: Message[]
  unreadCount: number
  loading: boolean
  error: string | null

  // Actions
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (conversation: Conversation | null) => void
  setCurrentConversationId: (id: string | null) => void // Add this
  addConversation: (conversation: Conversation) => void
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void

  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  removeMessage: (messageId: string) => void

  setUnreadCount: (count: number) => void
  incrementUnreadCount: () => void
  decrementUnreadCount: () => void

  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Real-time updates
  handleNewMessage: (message: Message) => void
  handleMessageUpdate: (message: Message) => void
  handleConversationUpdate: (conversation: Conversation) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      currentConversationId: null,
      messages: [],
      unreadCount: 0,
      loading: false,
      error: null,

      setConversations: (conversations) => {
        // Remove duplicates based on ID
        const uniqueConversations = conversations.filter((conv, index, self) =>
          index === self.findIndex(c => c.id === conv.id)
        )
        set({ conversations: uniqueConversations })
      },

      setCurrentConversation: (conversation) => set({
        currentConversation: conversation,
        currentConversationId: conversation?.id || null,
        messages: [] // Clear messages when switching conversations
      }),

      setCurrentConversationId: (id) => set({ currentConversationId: id }),

      addConversation: (conversation) => set((state) => {
        // Check if conversation already exists
        const exists = state.conversations.some(c => c.id === conversation.id)
        if (exists) return state

        return {
          conversations: [conversation, ...state.conversations]
        }
      }),

  updateConversation: (conversationId, updates) => set((state) => ({
    conversations: state.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, ...updates } : conv
    ),
    currentConversation: state.currentConversation?.id === conversationId
      ? { ...state.currentConversation, ...updates }
      : state.currentConversation
  })),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => {
    // Check if message already exists to avoid duplicates
    const exists = state.messages.some(m => m.id === message.id)
    if (exists) return state

    return {
      messages: [...state.messages, message]
    }
  }),

  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    )
  })),

  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId)
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnreadCount: () => set((state) => ({
    unreadCount: state.unreadCount + 1
  })),

  decrementUnreadCount: () => set((state) => ({
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Real-time handlers
  handleNewMessage: (message) => {
    const state = get()

    // Add message to current conversation if it matches
    if (state.currentConversation?.id === message.conversationId) {
      state.addMessage(message)
    }

    // Update conversation's last message
    state.updateConversation(message.conversationId, {
      lastMessage: message,
      updatedAt: message.createdAt
    })

    // Increment unread count if not current conversation
    if (state.currentConversation?.id !== message.conversationId) {
      state.incrementUnreadCount()
    }
  },

  handleMessageUpdate: (message) => {
    const state = get()
    state.updateMessage(message.id, message)
  },

  handleConversationUpdate: (conversation) => {
    const state = get()
    state.updateConversation(conversation.id, conversation)
  }
}),
{
  name: 'chat-store',
  partialize: (state) => ({
    currentConversationId: state.currentConversationId,
    // Don't persist conversations and messages as they should be fresh from server
  }),
}
)
)

// Selectors
export const useCurrentConversation = () => useChatStore(state => state.currentConversation)
export const useCurrentConversationId = () => useChatStore(state => state.currentConversationId)
export const useMessages = () => useChatStore(state => state.messages)
export const useConversations = () => useChatStore(state => state.conversations)
export const useUnreadCount = () => useChatStore(state => state.unreadCount)
export const useChatLoading = () => useChatStore(state => state.loading)
export const useChatError = () => useChatStore(state => state.error)
