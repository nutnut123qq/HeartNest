'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, Stethoscope, MessageCircle, Star, MapPin } from 'lucide-react'
import { chatApiService } from '@/services/chatApi'
import { useChatStore } from '@/store/chatStore'
import { toast } from 'react-hot-toast'

interface HealthcareProvider {
  id: string
  fullName: string
  email: string
  role: number
  specialization?: string
  experience?: string
  rating?: number
  location?: string
  isOnline?: boolean
}

interface ProviderSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProviderSelectionModal({ isOpen, onClose }: ProviderSelectionModalProps) {
  const [providers, setProviders] = useState<HealthcareProvider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<HealthcareProvider[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const { setCurrentConversation, addConversation } = useChatStore()

  useEffect(() => {
    if (isOpen) {
      loadProviders()
    }
  }, [isOpen])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProviders(providers)
    } else {
      const filtered = providers.filter(provider =>
        provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProviders(filtered)
    }
  }, [searchTerm, providers])

  const loadProviders = async () => {
    try {
      setLoading(true)
      const response = await chatApiService.getHealthcareProviders()
      
      if (response.success) {
        setProviders(response.data)
      } else {
        toast.error('Không thể tải danh sách bác sĩ')
      }
    } catch (error) {
      console.error('Failed to load providers:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách bác sĩ')
    } finally {
      setLoading(false)
    }
  }

  const handleStartConversation = async (provider: HealthcareProvider) => {
    try {
      setCreating(true)
      const response = await chatApiService.createConversation({
        type: 'consultation',
        healthcareProviderId: provider.id,
        title: `Tư vấn với ${provider.fullName}`
      })

      if (response.success) {
        const newConversation = response.data
        addConversation(newConversation)
        setCurrentConversation(newConversation)
        toast.success('Đã tạo cuộc trò chuyện mới')
        onClose()
      } else {
        toast.error('Không thể tạo cuộc trò chuyện')
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
      toast.error('Có lỗi xảy ra khi tạo cuộc trò chuyện')
    } finally {
      setCreating(false)
    }
  }

  const getRoleText = (role: number) => {
    switch (role) {
      case 1:
        return 'Bác sĩ'
      case 2:
        return 'Y tá'
      default:
        return 'Nhân viên y tế'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-primary-600" />
            Chọn bác sĩ để tư vấn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Provider List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Không tìm thấy bác sĩ phù hợp' : 'Chưa có bác sĩ nào trong hệ thống'}
              </div>
            ) : (
              filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-primary-600" />
                      </div>
                      {provider.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{provider.fullName}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {getRoleText(provider.role)}
                        </span>
                      </div>
                      
                      {provider.specialization && (
                        <p className="text-sm text-gray-600 mt-1">{provider.specialization}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {provider.experience && (
                          <span>{provider.experience}</span>
                        )}
                        {provider.rating && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span>{provider.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {provider.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{provider.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartConversation(provider)}
                    disabled={creating}
                    size="sm"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                  >
                    {creating ? 'Đang tạo...' : 'Bắt đầu tư vấn'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
