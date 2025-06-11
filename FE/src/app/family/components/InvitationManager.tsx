'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Clock, 
  Check, 
  X, 
  Send,
  UserPlus,
  Calendar
} from 'lucide-react'
import { Invitation } from '@/types'
import { useFamilyStore } from '@/store/familyStore'
import { toast } from 'sonner'

interface InvitationManagerProps {
  invitations: Invitation[]
}

export const InvitationManager: React.FC<InvitationManagerProps> = ({ invitations }) => {
  const { acceptInvitation, declineInvitation, isLoading } = useFamilyStore()

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId)
      toast.success('Đã chấp nhận lời mời tham gia gia đình')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chấp nhận lời mời')
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối lời mời này?')) {
      try {
        await declineInvitation(invitationId)
        toast.success('Đã từ chối lời mời')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi từ chối lời mời')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Đang chờ
          </Badge>
        )
      case 'accepted':
        return (
          <Badge variant="outline" className="text-green-600 border-green-300">
            <Check className="h-3 w-3 mr-1" />
            Đã chấp nhận
          </Badge>
        )
      case 'declined':
        return (
          <Badge variant="outline" className="text-red-600 border-red-300">
            <X className="h-3 w-3 mr-1" />
            Đã từ chối
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'member':
        return 'Thành viên'
      case 'child':
        return 'Con em'
      default:
        return 'Không xác định'
    }
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const otherInvitations = invitations.filter(inv => inv.status !== 'pending')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary-600" />
          <span>Lời mời</span>
          {pendingInvitations.length > 0 && (
            <Badge variant="destructive">{pendingInvitations.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Quản lý lời mời tham gia gia đình
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-secondary-900 mb-3">
                Lời mời đang chờ
              </h4>
              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          {invitation.email}
                        </p>
                        <p className="text-xs text-secondary-600">
                          Vai trò: {getRoleLabel(invitation.role)}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          Gửi lúc: {new Date(invitation.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {getStatusBadge(invitation.status)}
                    </div>
                    
                    {/* Action buttons for pending invitations */}
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Chấp nhận
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Từ chối
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Invitations */}
          {otherInvitations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-secondary-900 mb-3">
                Lịch sử lời mời
              </h4>
              <div className="space-y-3">
                {otherInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-3 border border-secondary-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          {invitation.email}
                        </p>
                        <p className="text-xs text-secondary-600">
                          Vai trò: {getRoleLabel(invitation.role)}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          Gửi lúc: {new Date(invitation.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      {getStatusBadge(invitation.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {invitations.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600 text-sm">
                Chưa có lời mời nào
              </p>
              <p className="text-secondary-500 text-xs mt-1">
                Lời mời tham gia gia đình sẽ hiển thị ở đây
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
