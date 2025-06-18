'use client'

import React from 'react'
import { Message } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Download, Image as ImageIcon, File, Volume2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const formatTime = (date: string) => {
    return format(new Date(date), 'HH:mm', { locale: vi })
  }

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        )

      case 'image':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <div className="relative">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || 'Image'}
                  className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.fileUrl, '_blank')}
                />
              </div>
            )}
            {message.content && (
              <div className="text-sm">{message.content}</div>
            )}
          </div>
        )

      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <File className="w-8 h-8 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName || 'File'}
              </p>
              {message.fileSize && (
                <p className="text-xs text-gray-500">
                  {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            {message.fileUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(message.fileUrl, '_blank')}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        )

      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <Volume2 className="w-6 h-6 text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Tin nhắn thoại</p>
              {message.durationSeconds && (
                <p className="text-xs text-gray-500">
                  {Math.floor(message.durationSeconds / 60)}:{(message.durationSeconds % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
            {message.fileUrl && (
              <audio controls className="max-w-full">
                <source src={message.fileUrl} type="audio/mpeg" />
                Trình duyệt không hỗ trợ audio
              </audio>
            )}
          </div>
        )

      case 'system':
        return (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {message.content}
            </span>
          </div>
        )

      default:
        return <div>{message.content}</div>
    }
  }

  // System messages are centered
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        {renderMessageContent()}
      </div>
    )
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {message.sender?.firstName?.charAt(0) || message.senderName?.charAt(0) || 'U'}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div className={`relative ${isOwn ? 'mr-2' : 'ml-2'}`}>
          {/* Reply indicator */}
          {message.replyToMessage && (
            <div className={`mb-1 p-2 rounded-lg border-l-4 text-xs ${
              isOwn
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-gray-50 border-gray-300 text-gray-600'
            }`}>
              <p className="font-medium">{message.replyToMessage.sender?.fullName || message.replyToMessage.senderName || 'Unknown User'}</p>
              <p className="truncate">{message.replyToMessage.content}</p>
            </div>
          )}

          {/* Main message */}
          <div className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}>
            {/* Debug indicator */}
            <div className="text-xs opacity-50 mb-1">
              {isOwn ? '(Own)' : '(Other)'}
            </div>
            {/* Sender name for group conversations */}
            {!isOwn && showAvatar && (
              <p className="text-xs font-medium text-gray-600 mb-1">
                {message.sender?.fullName || message.senderName || 'Unknown User'}
              </p>
            )}

            {renderMessageContent()}

            {/* Message time and status */}
            <div className={`flex items-center justify-end mt-1 space-x-1 ${
              isOwn ? 'text-primary-100' : 'text-gray-500'
            }`}>
              <span className="text-xs">
                {formatTime(message.createdAt)}
              </span>

              {message.isEdited && (
                <span className="text-xs opacity-75">(đã chỉnh sửa)</span>
              )}

              {/* Read receipts for own messages */}
              {isOwn && message.readReceipts && message.readReceipts.length > 0 && (
                <span className="text-xs opacity-75">✓✓</span>
              )}
            </div>
          </div>

          {/* Message actions (show on hover) */}
          {isOwn && (
            <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1 ml-2">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
