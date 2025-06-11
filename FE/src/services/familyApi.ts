import { ApiResponse } from '@/types'
import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Family DTOs
export interface CreateFamilyDto {
  name: string
  description?: string
}

export interface UpdateFamilyDto {
  name: string
  description?: string
}

export interface FamilyDto {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt?: string
  isActive: boolean
  memberCount: number
  members: FamilyMemberDto[]
}

export interface FamilyMemberDto {
  id: string
  familyId: string
  userId: string
  role: 'Admin' | 'Member' | 'Child'
  joinedAt: string
  isActive: boolean
  nickname?: string
  user: UserDto
}

export interface UserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
  fullName: string
  avatar?: string
}

export interface InvitationDto {
  id: string
  familyId: string
  invitedBy: string
  email: string
  role: 'Admin' | 'Member' | 'Child'
  status: 'Pending' | 'Accepted' | 'Declined' | 'Expired'
  createdAt: string
  expiresAt: string
  acceptedAt?: string
  declinedAt?: string
  message?: string
  familyName: string
  invitedByName: string
}

export interface CreateInvitationDto {
  email: string
  role: 'Member' | 'Child'
  message?: string
}

export interface UpdateFamilyMemberRoleDto {
  role: 'Admin' | 'Member' | 'Child'
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  // Get token from auth store
  const authStore = useAuthStore.getState()
  const token = authStore.accessToken
  console.log('Getting auth token:', token ? 'Token found' : 'No token')
  return token
}

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = getAuthToken()
  console.log('Creating headers with token:', token ? 'Yes' : 'No')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }

    try {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }

  return await response.json()
}

// Family API functions
export const familyApi = {
  // Get current user's family
  getMyFamily: async (): Promise<ApiResponse<FamilyDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family`, {
      method: 'GET',
      headers: createHeaders(),
    })
    return handleResponse<FamilyDto>(response)
  },

  // Get family by ID
  getFamilyById: async (familyId: string): Promise<ApiResponse<FamilyDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/${familyId}`, {
      method: 'GET',
      headers: createHeaders(),
    })
    return handleResponse<FamilyDto>(response)
  },

  // Create new family
  createFamily: async (data: CreateFamilyDto): Promise<ApiResponse<FamilyDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<FamilyDto>(response)
  },

  // Update family
  updateFamily: async (familyId: string, data: UpdateFamilyDto): Promise<ApiResponse<FamilyDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/${familyId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<FamilyDto>(response)
  },

  // Delete family
  deleteFamily: async (familyId: string): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/${familyId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },

  // Get family members
  getFamilyMembers: async (): Promise<ApiResponse<FamilyMemberDto[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/members`, {
      method: 'GET',
      headers: createHeaders(),
    })
    return handleResponse<FamilyMemberDto[]>(response)
  },

  // Update member role
  updateMemberRole: async (memberId: string, data: UpdateFamilyMemberRoleDto): Promise<ApiResponse<FamilyMemberDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/members/${memberId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<FamilyMemberDto>(response)
  },

  // Remove member
  removeMember: async (memberId: string): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/members/${memberId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },

  // Leave family
  leaveFamily: async (): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/leave`, {
      method: 'POST',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },

  // Get family invitations
  getFamilyInvitations: async (): Promise<ApiResponse<InvitationDto[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/invitations`, {
      method: 'GET',
      headers: createHeaders(),
    })
    return handleResponse<InvitationDto[]>(response)
  },

  // Get user invitations
  getMyInvitations: async (): Promise<ApiResponse<InvitationDto[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/my-invitations`, {
      method: 'GET',
      headers: createHeaders(),
    })
    return handleResponse<InvitationDto[]>(response)
  },

  // Create invitation
  createInvitation: async (data: CreateInvitationDto): Promise<ApiResponse<InvitationDto>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/invite`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<InvitationDto>(response)
  },

  // Accept invitation
  acceptInvitation: async (invitationId: string): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/invitations/${invitationId}/accept`, {
      method: 'POST',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },

  // Decline invitation
  declineInvitation: async (invitationId: string): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/invitations/${invitationId}/decline`, {
      method: 'POST',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },

  // Cancel invitation
  cancelInvitation: async (invitationId: string): Promise<ApiResponse<boolean>> => {
    const response = await fetch(`${API_BASE_URL}/api/family/invitations/${invitationId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    })
    return handleResponse<boolean>(response)
  },
}
