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
export enum HealthcareFacilityType {
  Hospital = 0,
  Clinic = 1,
  Pharmacy = 2,
  Laboratory = 3,
  Emergency = 4,
  SpecialtyCenter = 5
}

export enum ProviderSpecialization {
  GeneralPractice = 0,
  Cardiology = 1,
  Dermatology = 2,
  Endocrinology = 3,
  Gastroenterology = 4,
  Neurology = 5,
  Oncology = 6,
  Orthopedics = 7,
  Pediatrics = 8,
  Psychiatry = 9,
  Radiology = 10,
  Surgery = 11,
  Urology = 12,
  Gynecology = 13,
  Ophthalmology = 14,
  ENT = 15,
  Dentistry = 16,
  Physiotherapy = 17,
  Psychology = 18,
  Nutrition = 19
}

export interface HealthcareFacility {
  id: string
  name: string
  type: HealthcareFacilityType
  typeDisplay: string
  description: string
  address: string
  phone: string
  email?: string
  website?: string
  latitude: number
  longitude: number
  averageRating: number
  reviewCount: number
  operatingHours: string[]
  services: string[]
  images: string[]
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  providers?: HealthcareProviderSummary[]
  recentReviews?: FacilityReview[]
  distanceKm?: number
}

export interface HealthcareFacilitySummary {
  id: string
  name: string
  type: HealthcareFacilityType
  typeDisplay: string
  address: string
  phone: string
  averageRating: number
  reviewCount: number
  isVerified: boolean
  distanceKm?: number
}

export interface HealthcareProvider {
  id: string
  firstName: string
  lastName: string
  fullName: string
  title: string
  specialization: ProviderSpecialization
  specializationDisplay: string
  subSpecialty?: string
  licenseNumber: string
  yearsOfExperience: number
  qualifications: string[]
  biography: string
  phone: string
  email?: string
  averageRating: number
  reviewCount: number
  consultationFees: Record<string, number>
  availability: Record<string, string[]>
  languages: string[]
  profileImage?: string
  isActive: boolean
  isVerified: boolean
  acceptsNewPatients: boolean
  createdAt: string
  updatedAt: string
  primaryFacility?: HealthcareFacilitySummary
  facilities?: HealthcareFacilitySummary[]
  recentReviews?: ProviderReview[]
}

export interface HealthcareProviderSummary {
  id: string
  fullName: string
  title: string
  specialization: ProviderSpecialization
  specializationDisplay: string
  subSpecialty?: string
  yearsOfExperience: number
  averageRating: number
  reviewCount: number
  isVerified: boolean
  acceptsNewPatients: boolean
  profileImage?: string
}

export interface FacilityReview {
  id: string
  facilityId: string
  userId: string
  rating: number
  title: string
  comment: string
  cleanlinessRating?: number
  staffRating?: number
  waitTimeRating?: number
  facilitiesRating?: number
  isVerified: boolean
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
  userName?: string
  userAvatar?: string
  facilityName?: string
}

export interface ProviderReview {
  id: string
  providerId: string
  userId: string
  rating: number
  title: string
  comment: string
  communicationRating?: number
  professionalismRating?: number
  treatmentEffectivenessRating?: number
  waitTimeRating?: number
  visitDate?: string
  treatmentType?: string
  wouldRecommend: boolean
  isVerified: boolean
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
  userName?: string
  userAvatar?: string
  providerName?: string
}

export interface HealthcareSearchFilters {
  searchTerm?: string
  type?: HealthcareFacilityType
  specialization?: ProviderSpecialization
  minRating?: number
  isVerified?: boolean
  acceptsNewPatients?: boolean
  latitude?: number
  longitude?: number
  radiusKm?: number
  page?: number
  pageSize?: number
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
