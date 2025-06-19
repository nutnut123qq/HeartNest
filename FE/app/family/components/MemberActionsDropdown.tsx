'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { 
  MoreVertical, 
  Crown, 
  User, 
  Baby, 
  Trash2, 
  Edit,
  Shield,
  UserMinus
} from 'lucide-react'
import { FamilyMember } from '@/types'
import { useFamilyStore } from '@/store/familyStore'
import { toast } from 'sonner'

interface MemberActionsDropdownProps {
  member: FamilyMember
  currentUserId: string
  onClose?: () => void
}

export const MemberActionsDropdown: React.FC<MemberActionsDropdownProps> = ({
  member,
  currentUserId,
  onClose
}) => {
  const { updateMemberRole, removeMember, isLoading } = useFamilyStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleRoleChange = async (newRole: 'admin' | 'member' | 'child') => {
    if (member.role === newRole) return

    try {
      await updateMemberRole(member.id, newRole)
      toast.success(`Đã cập nhật vai trò thành ${getRoleLabel(newRole)}`)
      setShowDropdown(false)
      onClose?.()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật vai trò')
    }
  }

  const handleRemoveMember = async () => {
    const memberName = member.user.fullName || member.user.email
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${memberName} khỏi gia đình?`)) {
      try {
        await removeMember(member.id)
        toast.success(`Đã xóa ${memberName} khỏi gia đình`)
        setShowDropdown(false)
        onClose?.()
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa thành viên')
      }
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

  // Don't show actions for current user
  if (member.userId === currentUserId) {
    return null
  }

  const roleOptions = [
    { value: 'admin', label: 'Quản trị viên', icon: Crown, color: 'text-yellow-600' },
    { value: 'member', label: 'Thành viên', icon: User, color: 'text-blue-600' },
    { value: 'child', label: 'Con em', icon: Baby, color: 'text-green-600' }
  ]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {/* Role Change Section */}
              <div className="px-3 py-2 border-b border-secondary-100">
                <p className="text-xs font-medium text-secondary-600 uppercase tracking-wide">
                  Thay đổi vai trò
                </p>
              </div>
              
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleRoleChange(option.value as 'admin' | 'member' | 'child')}
                  disabled={isLoading || member.role === option.value}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-secondary-50 transition-colors ${
                    member.role === option.value 
                      ? 'bg-primary-50 text-primary-700 cursor-default' 
                      : 'text-secondary-700 hover:text-secondary-900'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option.icon className={`h-4 w-4 ${
                    member.role === option.value ? 'text-primary-600' : option.color
                  }`} />
                  <span>{option.label}</span>
                  {member.role === option.value && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </button>
              ))}

              {/* Divider */}
              <div className="border-t border-secondary-100 my-1"></div>

              {/* Danger Zone */}
              <div className="px-3 py-2 border-b border-secondary-100">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">
                  Hành động nguy hiểm
                </p>
              </div>
              
              <button
                onClick={handleRemoveMember}
                disabled={isLoading}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <UserMinus className="h-4 w-4" />
                <span>Xóa khỏi gia đình</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
