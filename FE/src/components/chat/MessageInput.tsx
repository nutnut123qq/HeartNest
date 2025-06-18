'use client'

import React, { useState, useRef } from 'react'
import { Send, Paperclip, Image, Mic, Smile } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { chatApiService } from '@/services/chatApi'
import { toast } from 'sonner'

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file' | 'voice', fileData?: any) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const handleFileUpload = async (file: File, type: 'file' | 'image') => {
    if (!file) return

    try {
      setIsUploading(true)
      
      // Upload file
      const uploadResponse = await chatApiService.uploadFile(file)
      
      if (uploadResponse.success) {
        const fileData = {
          fileName: file.name,
          fileUrl: uploadResponse.data,
          fileType: file.type,
          fileSize: file.size
        }
        
        onSendMessage(file.name, type, fileData)
        toast.success('File đã được gửi')
      } else {
        toast.error(uploadResponse.message)
      }
    } catch (error) {
      console.error('File upload failed:', error)
      toast.error('Không thể upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, type)
    }
    
    // Reset input
    e.target.value = ''
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openImageDialog = () => {
    imageInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* File upload progress */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          <span>Đang upload file...</span>
        </div>
      )}

      {/* Message input form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* Attachment buttons */}
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openFileDialog}
            disabled={disabled || isUploading}
            className="h-10 w-10 p-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openImageDialog}
            disabled={disabled || isUploading}
            className="h-10 w-10 p-0"
          >
            <Image className="w-5 h-5" />
          </Button>
        </div>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Không thể gửi tin nhắn" : "Nhập tin nhắn..."}
            disabled={disabled || isUploading}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            rows={1}
          />
          
          {/* Emoji button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || isUploading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled || isUploading}
          className="h-12 w-12 p-0 rounded-full"
        >
          <Send className="w-5 h-5" />
        </Button>

        {/* Voice message button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || isUploading}
          className="h-12 w-12 p-0 rounded-full"
        >
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        onChange={(e) => handleFileSelect(e, 'file')}
        className="hidden"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'image')}
        className="hidden"
      />
    </div>
  )
}
