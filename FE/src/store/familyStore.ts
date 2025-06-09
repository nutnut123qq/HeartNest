import { create } from 'zustand'
import { Family, FamilyMember, Invitation } from '@/types'
import { api } from '@/lib/api'

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
      const response = await api.get<Family>('/api/family')
      set({ family: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get<FamilyMember[]>('/api/family/members')
      set({ members: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchInvitations: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get<Invitation[]>('/api/family/invitations')
      set({ invitations: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  inviteMember: async (email: string, role: 'member' | 'child') => {
    set({ isLoading: true })
    try {
      const response = await api.post<Invitation>('/api/family/invite', { email, role })
      const newInvitation = response.data
      
      set((state) => ({
        invitations: [...state.invitations, newInvitation],
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  removeMember: async (memberId: string) => {
    set({ isLoading: true })
    try {
      await api.delete(`/api/family/members/${memberId}`)
      
      set((state) => ({
        members: state.members.filter((member) => member.id !== memberId),
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateMemberRole: async (memberId: string, role: 'admin' | 'member' | 'child') => {
    set({ isLoading: true })
    try {
      const response = await api.put<FamilyMember>(`/api/family/members/${memberId}`, { role })
      const updatedMember = response.data
      
      set((state) => ({
        members: state.members.map((member) =>
          member.id === memberId ? updatedMember : member
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  acceptInvitation: async (invitationId: string) => {
    set({ isLoading: true })
    try {
      await api.post(`/api/family/invitations/${invitationId}/accept`)
      
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id !== invitationId),
        isLoading: false,
      }))
      
      // Refresh family and members data
      get().fetchFamily()
      get().fetchMembers()
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  declineInvitation: async (invitationId: string) => {
    set({ isLoading: true })
    try {
      await api.delete(`/api/family/invitations/${invitationId}/decline`)
      
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id !== invitationId),
        isLoading: false,
      }))
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
