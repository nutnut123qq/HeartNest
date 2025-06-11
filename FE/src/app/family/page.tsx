'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/ui/Layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Layout'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Crown, 
  User, 
  Baby, 
  MoreVertical,
  Calendar,
  Bell,
  Activity,
  Shield
} from 'lucide-react'
import { useFamilyStore } from '@/store/familyStore'
import { useAuthStore } from '@/store/authStore'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { FamilyMember, Invitation } from '@/types'
import { toast } from 'sonner'
import { AddMemberModal } from './components/AddMemberModal'
import { FamilyStats } from './components/FamilyStats'
import { InvitationManager } from './components/InvitationManager'
import { MemberActionsDropdown } from './components/MemberActionsDropdown'
import { FamilyOverview } from './components/FamilyOverview'
import { CreateFamilyCard } from './components/CreateFamilyCard'

export default function FamilyPage() {
  const { user, isAuthenticated } = useAuthStore()
  const {
    family,
    members,
    invitations,
    isLoading,
    fetchFamily,
    fetchMembers,
    fetchInvitations,
    removeMember,
    updateMemberRole
  } = useFamilyStore()

  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log('Family page - Auth check:', { isAuthenticated, hasUser: !!user, userEmail: user?.email })

    // Just load data if authenticated, don't redirect for now
    if (isAuthenticated && user) {
      console.log('Loading family data...')
      loadFamilyData()
    }
  }, [mounted, isAuthenticated, user])

  const loadFamilyData = async () => {
    try {
      console.log('Loading family data...')

      // Load all family data - errors are now handled in the store
      await Promise.all([
        fetchFamily(),
        fetchMembers(),
        fetchInvitations()
      ])

      console.log('Family data loaded successfully')
    } catch (error: any) {
      console.error('Error loading family data:', error)
      // Only show error if it's not a "no family" error
      if (!error.message?.includes('400') && !error.message?.includes('không thuộc gia đình')) {
        toast.error('Có lỗi xảy ra khi tải dữ liệu gia đình')
      }
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi gia đình?')) {
      try {
        await removeMember(memberId)
        toast.success('Đã xóa thành viên khỏi gia đình')
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa thành viên')
      }
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member' | 'child') => {
    try {
      await updateMemberRole(memberId, newRole)
      toast.success('Đã cập nhật vai trò thành viên')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật vai trò')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'member':
        return <User className="h-4 w-4 text-blue-500" />
      case 'child':
        return <Baby className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800'
      case 'member':
        return 'bg-blue-100 text-blue-800'
      case 'child':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isCurrentUserAdmin = () => {
    return members.find(m => m.userId === user?.id)?.role === 'admin'
  }

  // Show loading while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Đang tải ứng dụng...</p>
        </div>
      </div>
    )
  }

  // If not authenticated after mounting, show message instead of redirect
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Cần đăng nhập</h2>
            <p className="text-secondary-600 mb-6">Bạn cần đăng nhập để truy cập trang gia đình.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Đang tải thông tin gia đình...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show create family card if no family exists
  if (!family && !isLoading) {
    return (
      <DashboardLayout>
        <CreateFamilyCard onSuccess={loadFamilyData} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {family?.name || 'Gia đình của bạn'}
              </h1>
              <p className="text-secondary-600 mt-1">
                Quản lý thành viên và thông tin gia đình
              </p>
            </div>
          </div>
          
          {isCurrentUserAdmin() && (
            <Button 
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowAddMemberModal(true)}
            >
              Mời thành viên
            </Button>
          )}
        </div>

        {/* Family Stats */}
        <FamilyStats members={members} />

        {/* Family Overview */}
        <FamilyOverview family={family} members={members} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Family Members */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span>Thành viên gia đình</span>
                  <Badge variant="secondary">{members.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Danh sách tất cả thành viên trong gia đình
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.avatar} />
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {member.user.fullName?.charAt(0) || member.user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-secondary-900">
                              {member.user.fullName || member.user.email}
                            </h3>
                            {member.userId === user?.id && (
                              <Badge variant="outline" className="text-xs">Bạn</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getRoleIcon(member.role)}
                            <span className="text-sm text-secondary-600">
                              {getRoleLabel(member.role)}
                            </span>
                          </div>
                          <p className="text-xs text-secondary-500 mt-1">
                            Tham gia: {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        
                        {isCurrentUserAdmin() && (
                          <MemberActionsDropdown
                            member={member}
                            currentUserId={user?.id || ''}
                            onClose={() => setSelectedMember(null)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {members.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                      <p className="text-secondary-600">Chưa có thành viên nào trong gia đình</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invitations */}
          <div className="lg:col-span-1">
            <InvitationManager invitations={invitations} />
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSuccess={() => {
          setShowAddMemberModal(false)
          loadFamilyData()
        }}
      />
    </DashboardLayout>
  )
}
