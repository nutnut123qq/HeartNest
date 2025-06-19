'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { signalRService } from '@/services/signalRService'

interface SignalRContextType {
  isConnected: boolean
  connectionState: string
}

const SignalRContext = createContext<SignalRContextType>({
  isConnected: false,
  connectionState: 'Disconnected'
})

export const useSignalR = () => useContext(SignalRContext)

interface SignalRProviderProps {
  children: React.ReactNode
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState('Disconnected')
  const { isAuthenticated, accessToken, user } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const connectSignalR = async () => {
      if (!isAuthenticated || !accessToken || !user) {
        console.log('🔌 SignalR: Not authenticated, skipping connection')
        return
      }

      try {
        console.log('🔌 SignalR: Connecting with token:', accessToken.substring(0, 20) + '...')
        await signalRService.connect(accessToken)

        if (mounted) {
          setIsConnected(true)
          setConnectionState('Connected')
          console.log('🔌 SignalR: Connected successfully')

          // Join notification group
          await signalRService.joinUserGroup()
          console.log('🔌 SignalR: Joined notification group')
        }
      } catch (error) {
        console.error('🔌 SignalR: Connection failed:', error)
        if (mounted) {
          setIsConnected(false)
          setConnectionState('Failed')
        }
      }
    }

    const disconnectSignalR = () => {
      console.log('🔌 SignalR: Disconnecting...')
      signalRService.disconnect()
      setIsConnected(false)
      setConnectionState('Disconnected')
    }

    if (isAuthenticated && accessToken) {
      connectSignalR()
    } else {
      disconnectSignalR()
    }

    return () => {
      mounted = false
      if (!isAuthenticated) {
        disconnectSignalR()
      }
    }
  }, [isAuthenticated, accessToken, user])

  // Monitor connection state
  useEffect(() => {
    const interval = setInterval(() => {
      if (signalRService.connection) {
        const state = signalRService.getConnectionState()
        setConnectionState(state)
        setIsConnected(state === 'Connected')
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <SignalRContext.Provider value={{ isConnected, connectionState }}>
      {children}
    </SignalRContext.Provider>
  )
}
