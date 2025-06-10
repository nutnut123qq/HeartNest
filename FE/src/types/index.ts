// Core Types for CareNest Frontend Application

// ===== USER & AUTHENTICATION =====
export enum UserRole {
  User = 0,
  Nurse = 1,
  Admin = 2
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole
  avatar?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
  isEmailVerified: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: string
}

export interface AuthResponse {
  token: string
  expiresAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    phoneNumber?: string
    dateOfBirth?: string
    gender?: string
    isEmailVerified: boolean
    createdAt: string
  }
}

// ===== SUBSCRIPTION & BILLING =====
export enum SubscriptionTier {
  FREE = 'free',
  SMALL_FAMILY = 'small_family',
  LOVE_PACKAGE = 'love_package',
  CUSTOM = 'custom'
}

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  price: number
  duration: number // months
  maxFamilyMembers: number
  features: string[]
  channels: string[]
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired'
  startDate: string
  endDate: string
  autoRenew: boolean
}

export interface BillingRecord {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  paymentDate: string
  paymentMethod: string
}

// ===== FAMILY MANAGEMENT =====
export interface FamilyMember {
  id: string
  userId: string
  familyId: string
  user: User
  role: 'admin' | 'member' | 'child'
  permissions: Permission[]
  joinedAt: string
}

export interface Family {
  id: string
  name: string
  createdBy: string
  members: FamilyMember[]
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'reminders' | 'family' | 'healthcare' | 'chat'
}

export interface Invitation {
  id: string
  familyId: string
  invitedBy: string
  email: string
  role: 'member' | 'child'
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string
  expiresAt: string
}

// ===== REMINDERS =====
export interface Reminder {
  id: string
  title: string
  description?: string
  type: 'medication' | 'appointment' | 'exercise' | 'checkup' | 'custom'
  userId: string
  familyMemberId?: string
  scheduledAt: string
  frequency: ReminderFrequency
  isRecurring: boolean
  status: 'active' | 'completed' | 'cancelled' | 'missed'
  channels: NotificationChannel[]
  metadata?: ReminderMetadata
  createdAt: string
  updatedAt: string
}

export interface ReminderFrequency {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom'
  interval?: number
  daysOfWeek?: number[] // 0-6, Sunday = 0
  endDate?: string
}

export interface ReminderMetadata {
  medication?: {
    name: string
    dosage: string
    instructions: string
  }
  appointment?: {
    doctorName: string
    clinic: string
    address: string
    phone: string
  }
}

export type NotificationChannel = 'web' | 'email' | 'sms' | 'push' | 'zalo'

// ===== HEALTHCARE =====
export interface HealthcareFacility {
  id: string
  name: string
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'emergency'
  address: string
  phone: string
  email?: string
  website?: string
  location: {
    latitude: number
    longitude: number
  }
  rating?: number
  reviews?: Review[]
  services: string[]
  openingHours: OpeningHours[]
  distance?: number // in kilometers
}

export interface HealthcareProvider {
  id: string
  name: string
  specialization: string
  qualifications: string[]
  experience: number
  rating?: number
  reviews?: Review[]
  facilities: HealthcareFacility[]
  contact: {
    phone: string
    email?: string
  }
  availability: Availability[]
}

export interface OpeningHours {
  dayOfWeek: number // 0-6, Sunday = 0
  openTime: string // HH:mm format
  closeTime: string // HH:mm format
  isClosed: boolean
}

export interface Availability {
  dayOfWeek: number
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Review {
  id: string
  userId: string
  user: User
  rating: number
  comment: string
  createdAt: string
}

// ===== CHAT SYSTEM =====
export interface Conversation {
  id: string
  type: 'direct' | 'group' | 'consultation'
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface ConversationParticipant {
  id: string
  userId: string
  user: User
  role: 'patient' | 'doctor' | 'family_member'
  joinedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file' | 'voice' | 'system'
  metadata?: MessageMetadata
  isRead: boolean
  createdAt: string
}

export interface MessageMetadata {
  fileName?: string
  fileSize?: number
  fileType?: string
  duration?: number // for voice messages
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===== FORM TYPES =====
export interface CreateReminderData {
  title: string
  description?: string
  type: Reminder['type']
  familyMemberId?: string
  scheduledAt: string
  frequency: ReminderFrequency
  channels: NotificationChannel[]
  metadata?: ReminderMetadata
}

export interface UpdateReminderData extends Partial<CreateReminderData> {
  status?: Reminder['status']
}

export interface ProfileData {
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  gender?: User['gender']
}

// ===== UI STATE TYPES =====
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface ModalState {
  isOpen: boolean
  type?: string
  data?: any
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// ===== UTILITY TYPES =====
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
