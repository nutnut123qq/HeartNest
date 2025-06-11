import { create } from 'zustand'
import { Family, FamilyMember, Invitation } from '@/types'
import { familyApi } from '@/services/familyApi'

interface FamilyState {
  // State
  family: Family | null
  members: FamilyMember[]
  invitations: Invitation[]
  isLoading: boolean

  // Actions
  fetchFamily: () => Promise<void>
  fetchMembers: () => Promise<void>
  fetchInvitations: () => Promise<void>
  inviteMember: (email: string, role: 'member' | 'child') => Promise<void>
  removeMember: (memberId: string) => Promise<void>
  updateMemberRole: (memberId: string, role: 'admin' | 'member' | 'child') => Promise<void>
  acceptInvitation: (invitationId: string) => Promise<void>
  declineInvitation: (invitationId: string) => Promise<void>
  setFamily: (family: Family) => void
  setMembers: (members: FamilyMember[]) => void
  setInvitations: (invitations: Invitation[]) => void
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  // Initial state
  family: null,
  members: [],
  invitations: [],
  isLoading: false,

  // Actions
  fetchFamily: async () => {
    set({ isLoading: true })
    try {
      const response = await familyApi.getMyFamily()
      if (response.success && response.data) {
        // Convert API response to frontend types
        const family: Family = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          createdBy: response.data.createdBy,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          isActive: response.data.isActive,
          memberCount: response.data.memberCount
        }
        set({ family, isLoading: false })
      } else {
        set({ family: null, isLoading: false })
      }
    } catch (error: any) {
      console.log('fetchFamily error:', error.message)
      // If user doesn't have a family, that's expected - don't throw error
      if (error.message?.includes('400') || error.message?.includes('không thuộc gia đình')) {
        set({ family: null, isLoading: false })
      } else {
        set({ family: null, isLoading: false })
        throw error
      }
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true })
    try {
      const response = await familyApi.getFamilyMembers()
      if (response.success && response.data) {
        // Convert API response to frontend types
        const members: FamilyMember[] = response.data.map(member => {
          // Convert role enum to string
          let roleString: 'admin' | 'member' | 'child' = 'member'
          if (typeof member.role === 'string') {
            roleString = member.role.toLowerCase() as 'admin' | 'member' | 'child'
          } else if (typeof member.role === 'number') {
            // Assuming enum: 0 = Admin, 1 = Member, 2 = Child
            switch (member.role) {
              case 0: roleString = 'admin'; break
              case 1: roleString = 'member'; break
              case 2: roleString = 'child'; break
              default: roleString = 'member'; break
            }
          }

          return {
            id: member.id,
            familyId: member.familyId,
            userId: member.userId,
            role: roleString,
            joinedAt: member.joinedAt,
            isActive: member.isActive,
            nickname: member.nickname,
            user: {
              id: member.user.id,
              firstName: member.user.firstName,
              lastName: member.user.lastName,
              email: member.user.email,
              phoneNumber: member.user.phoneNumber,
              dateOfBirth: member.user.dateOfBirth,
              gender: member.user.gender,
              fullName: member.user.fullName,
              avatar: member.user.avatar
            }
          }
        })
        set({ members, isLoading: false })
      } else {
        set({ members: [], isLoading: false })
      }
    } catch (error: any) {
      console.log('fetchMembers error:', error.message)
      // If user doesn't have a family, that's expected - don't throw error
      if (error.message?.includes('400') || error.message?.includes('không thuộc gia đình')) {
        set({ members: [], isLoading: false })
      } else {
        set({ members: [], isLoading: false })
        throw error
      }
    }
  },

  fetchInvitations: async () => {
    set({ isLoading: true })
    try {
      const response = await familyApi.getFamilyInvitations()
      if (response.success && response.data) {
        // Convert API response to frontend types
        const invitations: Invitation[] = response.data.map(inv => {
          // Convert role enum to string
          let roleString: 'admin' | 'member' | 'child' = 'member'
          if (typeof inv.role === 'string') {
            roleString = inv.role.toLowerCase() as 'admin' | 'member' | 'child'
          } else if (typeof inv.role === 'number') {
            // Assuming enum: 0 = Admin, 1 = Member, 2 = Child
            switch (inv.role) {
              case 0: roleString = 'admin'; break
              case 1: roleString = 'member'; break
              case 2: roleString = 'child'; break
              default: roleString = 'member'; break
            }
          }

          // Convert status enum to string
          let statusString: 'pending' | 'accepted' | 'declined' | 'expired' = 'pending'
          if (typeof inv.status === 'string') {
            statusString = inv.status.toLowerCase() as 'pending' | 'accepted' | 'declined' | 'expired'
          } else if (typeof inv.status === 'number') {
            // Assuming enum: 0 = Pending, 1 = Accepted, 2 = Declined, 3 = Expired
            switch (inv.status) {
              case 0: statusString = 'pending'; break
              case 1: statusString = 'accepted'; break
              case 2: statusString = 'declined'; break
              case 3: statusString = 'expired'; break
              default: statusString = 'pending'; break
            }
          }

          return {
            id: inv.id,
            familyId: inv.familyId,
            invitedBy: inv.invitedBy,
            email: inv.email,
            role: roleString,
            status: statusString,
            createdAt: inv.createdAt,
            expiresAt: inv.expiresAt,
            acceptedAt: inv.acceptedAt,
            declinedAt: inv.declinedAt,
            message: inv.message,
            familyName: inv.familyName,
            invitedByName: inv.invitedByName
          }
        })
        set({ invitations, isLoading: false })
      } else {
        set({ invitations: [], isLoading: false })
      }
    } catch (error: any) {
      console.log('fetchInvitations error:', error.message)
      // If user doesn't have a family, that's expected - don't throw error
      if (error.message?.includes('400') || error.message?.includes('không thuộc gia đình')) {
        set({ invitations: [], isLoading: false })
      } else {
        set({ invitations: [], isLoading: false })
        throw error
      }
    }
  },

  inviteMember: async (email: string, role: 'member' | 'child') => {
    set({ isLoading: true })
    try {
      const response = await familyApi.createInvitation({
        email,
        role: role === 'member' ? 'Member' : 'Child'
      })

      if (response.success && response.data) {
        // Convert role and status enums
        let roleString: 'admin' | 'member' | 'child' = 'member'
        if (typeof response.data.role === 'string') {
          roleString = response.data.role.toLowerCase() as 'admin' | 'member' | 'child'
        } else if (typeof response.data.role === 'number') {
          switch (response.data.role) {
            case 0: roleString = 'admin'; break
            case 1: roleString = 'member'; break
            case 2: roleString = 'child'; break
            default: roleString = 'member'; break
          }
        }

        let statusString: 'pending' | 'accepted' | 'declined' | 'expired' = 'pending'
        if (typeof response.data.status === 'string') {
          statusString = response.data.status.toLowerCase() as 'pending' | 'accepted' | 'declined' | 'expired'
        } else if (typeof response.data.status === 'number') {
          switch (response.data.status) {
            case 0: statusString = 'pending'; break
            case 1: statusString = 'accepted'; break
            case 2: statusString = 'declined'; break
            case 3: statusString = 'expired'; break
            default: statusString = 'pending'; break
          }
        }

        const newInvitation: Invitation = {
          id: response.data.id,
          familyId: response.data.familyId,
          invitedBy: response.data.invitedBy,
          email: response.data.email,
          role: roleString,
          status: statusString,
          createdAt: response.data.createdAt,
          expiresAt: response.data.expiresAt,
          acceptedAt: response.data.acceptedAt,
          declinedAt: response.data.declinedAt,
          message: response.data.message,
          familyName: response.data.familyName,
          invitedByName: response.data.invitedByName
        }

        set((state) => ({
          invitations: [...state.invitations, newInvitation],
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
        throw new Error(response.message || 'Failed to create invitation')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  removeMember: async (memberId: string) => {
    set({ isLoading: true })
    try {
      const response = await familyApi.removeMember(memberId)

      if (response.success) {
        set((state) => ({
          members: state.members.filter((member) => member.id !== memberId),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
        throw new Error(response.message || 'Failed to remove member')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateMemberRole: async (memberId: string, role: 'admin' | 'member' | 'child') => {
    set({ isLoading: true })
    try {
      const response = await familyApi.updateMemberRole(memberId, {
        role: role.charAt(0).toUpperCase() + role.slice(1) as 'Admin' | 'Member' | 'Child'
      })

      if (response.success && response.data) {
        // Convert role enum
        let roleString: 'admin' | 'member' | 'child' = 'member'
        if (typeof response.data.role === 'string') {
          roleString = response.data.role.toLowerCase() as 'admin' | 'member' | 'child'
        } else if (typeof response.data.role === 'number') {
          switch (response.data.role) {
            case 0: roleString = 'admin'; break
            case 1: roleString = 'member'; break
            case 2: roleString = 'child'; break
            default: roleString = 'member'; break
          }
        }

        const updatedMember: FamilyMember = {
          id: response.data.id,
          familyId: response.data.familyId,
          userId: response.data.userId,
          role: roleString,
          joinedAt: response.data.joinedAt,
          isActive: response.data.isActive,
          nickname: response.data.nickname,
          user: {
            id: response.data.user.id,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email,
            phoneNumber: response.data.user.phoneNumber,
            dateOfBirth: response.data.user.dateOfBirth,
            gender: response.data.user.gender,
            fullName: response.data.user.fullName,
            avatar: response.data.user.avatar
          }
        }

        set((state) => ({
          members: state.members.map((member) =>
            member.id === memberId ? updatedMember : member
          ),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
        throw new Error(response.message || 'Failed to update member role')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  acceptInvitation: async (invitationId: string) => {
    set({ isLoading: true })
    try {
      const response = await familyApi.acceptInvitation(invitationId)

      if (response.success) {
        set((state) => ({
          invitations: state.invitations.filter((inv) => inv.id !== invitationId),
          isLoading: false,
        }))

        // Refresh family and members data
        get().fetchFamily()
        get().fetchMembers()
      } else {
        set({ isLoading: false })
        throw new Error(response.message || 'Failed to accept invitation')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  declineInvitation: async (invitationId: string) => {
    set({ isLoading: true })
    try {
      const response = await familyApi.declineInvitation(invitationId)

      if (response.success) {
        set((state) => ({
          invitations: state.invitations.filter((inv) => inv.id !== invitationId),
          isLoading: false,
        }))
      } else {
        set({ isLoading: false })
        throw new Error(response.message || 'Failed to decline invitation')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  setFamily: (family: Family) => {
    set({ family })
  },

  setMembers: (members: FamilyMember[]) => {
    set({ members })
  },

  setInvitations: (invitations: Invitation[]) => {
    set({ invitations })
  },
}))
