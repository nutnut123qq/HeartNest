import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { Message, Conversation } from '@/types'
import { useChatStore } from '@/store/chatStore'

class SignalRService {
  private connection: HubConnection | null = null
  private isConnected = false

  async connect(token: string): Promise<void> {
    if (this.isConnected) {
      return
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chatHub`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: 1 // WebSockets only
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    // Set up event handlers
    this.setupEventHandlers()

    try {
      await this.connection.start()
      this.isConnected = true
      console.log('SignalR Connected')

      // For now, don't join user group automatically
      // await this.joinUserGroup()
    } catch (error) {
      console.error('SignalR Connection Error:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.stop()
      this.isConnected = false
      console.log('SignalR Disconnected')
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return

    // Handle new messages
    this.connection.on('ReceiveMessage', (message: Message) => {
      console.log('Received message:', message)
      useChatStore.getState().handleNewMessage(message)
    })

    // Handle message updates (edits)
    this.connection.on('MessageUpdated', (message: Message) => {
      console.log('Message updated:', message)
      useChatStore.getState().handleMessageUpdate(message)
    })

    // Handle message deletions
    this.connection.on('MessageDeleted', (messageId: string) => {
      console.log('Message deleted:', messageId)
      useChatStore.getState().removeMessage(messageId)
    })

    // Handle conversation updates
    this.connection.on('ConversationUpdated', (conversation: Conversation) => {
      console.log('Conversation updated:', conversation)
      useChatStore.getState().handleConversationUpdate(conversation)
    })

    // Handle user typing indicators
    this.connection.on('UserTyping', (conversationId: string, userId: string, isTyping: boolean) => {
      console.log('User typing:', { conversationId, userId, isTyping })
      // Handle typing indicator in UI
    })

    // Handle user online status
    this.connection.on('UserOnlineStatusChanged', (userId: string, isOnline: boolean) => {
      console.log('User online status changed:', { userId, isOnline })
      // Handle online status in UI
    })

    // Handle consultation status changes
    this.connection.on('ConsultationStatusChanged', (conversationId: string, status: string) => {
      console.log('Consultation status changed:', { conversationId, status })
      useChatStore.getState().updateConversation(conversationId, {
        // consultationStatus: status as any // Temporarily disabled due to type issues
      })
    })

    // Connection events
    this.connection.onreconnecting(() => {
      console.log('SignalR Reconnecting...')
    })

    this.connection.onreconnected(() => {
      console.log('SignalR Reconnected')
      this.joinUserGroup()
    })

    this.connection.onclose(() => {
      console.log('SignalR Connection Closed')
      this.isConnected = false
    })
  }

  // Join conversation group to receive real-time updates
  async joinConversation(conversationId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('JoinConversation', conversationId)
        console.log(`Joined conversation: ${conversationId}`)
      } catch (error) {
        console.error('Error joining conversation:', error)
      }
    }
  }

  // Leave conversation group
  async leaveConversation(conversationId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('LeaveConversation', conversationId)
        console.log(`Left conversation: ${conversationId}`)
      } catch (error) {
        console.error('Error leaving conversation:', error)
      }
    }
  }

  // Join user group for personal notifications
  async joinUserGroup(): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('JoinUserGroup')
        console.log('Joined user group')
      } catch (error) {
        console.error('Error joining user group:', error)
      }
    }
  }

  // Send typing indicator
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('SendTypingIndicator', conversationId, isTyping)
      } catch (error) {
        console.error('Error sending typing indicator:', error)
      }
    }
  }

  // Get connection status
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected'
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.connection?.state === 'Connected'
  }
}

export const signalRService = new SignalRService()
