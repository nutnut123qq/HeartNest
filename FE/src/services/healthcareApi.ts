import { 
  HealthcareFacility, 
  HealthcareFacilitySummary, 
  HealthcareProvider, 
  HealthcareProviderSummary,
  FacilityReview,
  ProviderReview,
  HealthcareSearchFilters,
  HealthcareFacilityType,
  ProviderSpecialization,
  ApiResponse 
} from '@/types'
import { api as apiClient } from '@/lib/api'

// ===== HEALTHCARE FACILITIES =====
export const healthcareFacilityApi = {
  // Get all facilities
  getAll: async (): Promise<ApiResponse<HealthcareFacilitySummary[]>> => {
    const response = await apiClient.get('/api/healthcare/facilities')
    return response.data
  },

  // Get facility by ID
  getById: async (id: string): Promise<ApiResponse<HealthcareFacility>> => {
    const response = await apiClient.get(`/api/healthcare/facilities/${id}`)
    return response.data
  },

  // Get facility with providers
  getWithProviders: async (id: string): Promise<ApiResponse<HealthcareFacility>> => {
    const response = await apiClient.get(`/api/healthcare/facilities/${id}/providers`)
    return response.data
  },

  // Get facility with reviews
  getWithReviews: async (id: string): Promise<ApiResponse<HealthcareFacility>> => {
    const response = await apiClient.get(`/healthcare/facilities/${id}/reviews`)
    return response.data
  },

  // Get facilities by type
  getByType: async (type: HealthcareFacilityType): Promise<ApiResponse<HealthcareFacilitySummary[]>> => {
    const response = await apiClient.get(`/healthcare/facilities/type/${type}`)
    return response.data
  },

  // Search facilities
  search: async (filters: HealthcareSearchFilters): Promise<ApiResponse<HealthcareFacilitySummary[]>> => {
    const response = await apiClient.post('/api/healthcare/facilities/search', filters)
    return response.data
  },

  // Get nearby facilities
  getNearby: async (latitude: number, longitude: number, radiusKm: number = 10): Promise<ApiResponse<HealthcareFacilitySummary[]>> => {
    const response = await apiClient.get('/api/healthcare/facilities/nearby', {
      params: { latitude, longitude, radiusKm }
    })
    return response.data
  },

  // Get facility review stats
  getReviewStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/healthcare/facilities/${id}/review-stats`)
    return response.data
  }
}

// ===== HEALTHCARE PROVIDERS =====
export const healthcareProviderApi = {
  // Get all providers
  getAll: async (): Promise<ApiResponse<HealthcareProviderSummary[]>> => {
    const response = await apiClient.get('/api/healthcare/providers')
    return response.data
  },

  // Get provider by ID
  getById: async (id: string): Promise<ApiResponse<HealthcareProvider>> => {
    const response = await apiClient.get(`/healthcare/providers/${id}`)
    return response.data
  },

  // Get provider with facilities
  getWithFacilities: async (id: string): Promise<ApiResponse<HealthcareProvider>> => {
    const response = await apiClient.get(`/healthcare/providers/${id}/facilities`)
    return response.data
  },

  // Get provider with reviews
  getWithReviews: async (id: string): Promise<ApiResponse<HealthcareProvider>> => {
    const response = await apiClient.get(`/healthcare/providers/${id}/reviews`)
    return response.data
  },

  // Get providers by specialization
  getBySpecialization: async (specialization: ProviderSpecialization): Promise<ApiResponse<HealthcareProviderSummary[]>> => {
    const response = await apiClient.get(`/healthcare/providers/specialization/${specialization}`)
    return response.data
  },

  // Get providers by facility
  getByFacility: async (facilityId: string): Promise<ApiResponse<HealthcareProviderSummary[]>> => {
    const response = await apiClient.get(`/healthcare/providers/facility/${facilityId}`)
    return response.data
  },

  // Search providers
  search: async (filters: HealthcareSearchFilters): Promise<ApiResponse<HealthcareProviderSummary[]>> => {
    const response = await apiClient.post('/api/healthcare/providers/search', filters)
    return response.data
  },

  // Get provider review stats
  getReviewStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/healthcare/providers/${id}/review-stats`)
    return response.data
  }
}

// ===== HEALTHCARE REVIEWS =====
export const healthcareReviewApi = {
  // Get facility reviews
  getFacilityReviews: async (facilityId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<FacilityReview[]>> => {
    const response = await apiClient.get(`/healthcare/reviews/facilities/${facilityId}`, {
      params: { page, pageSize }
    })
    return response.data
  },

  // Get provider reviews
  getProviderReviews: async (providerId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<ProviderReview[]>> => {
    const response = await apiClient.get(`/healthcare/reviews/providers/${providerId}`, {
      params: { page, pageSize }
    })
    return response.data
  },

  // Create facility review
  createFacilityReview: async (reviewData: {
    facilityId: string
    rating: number
    title: string
    comment: string
    cleanlinessRating?: number
    staffRating?: number
    waitTimeRating?: number
    facilitiesRating?: number
    isAnonymous?: boolean
  }): Promise<ApiResponse<FacilityReview>> => {
    const response = await apiClient.post('/api/healthcare/reviews/facilities', reviewData)
    return response.data
  },

  // Create provider review
  createProviderReview: async (reviewData: {
    providerId: string
    rating: number
    title: string
    comment: string
    communicationRating?: number
    professionalismRating?: number
    treatmentEffectivenessRating?: number
    waitTimeRating?: number
    visitDate?: string
    treatmentType?: string
    wouldRecommend?: boolean
    isAnonymous?: boolean
  }): Promise<ApiResponse<ProviderReview>> => {
    const response = await apiClient.post('/api/healthcare/reviews/providers', reviewData)
    return response.data
  },

  // Update facility review
  updateFacilityReview: async (reviewId: string, reviewData: {
    rating: number
    title: string
    comment: string
    cleanlinessRating?: number
    staffRating?: number
    waitTimeRating?: number
    facilitiesRating?: number
  }): Promise<ApiResponse<FacilityReview>> => {
    const response = await apiClient.put(`/healthcare/reviews/facilities/${reviewId}`, reviewData)
    return response.data
  },

  // Update provider review
  updateProviderReview: async (reviewId: string, reviewData: {
    rating: number
    title: string
    comment: string
    communicationRating?: number
    professionalismRating?: number
    treatmentEffectivenessRating?: number
    waitTimeRating?: number
    visitDate?: string
    treatmentType?: string
    wouldRecommend?: boolean
  }): Promise<ApiResponse<ProviderReview>> => {
    const response = await apiClient.put(`/healthcare/reviews/providers/${reviewId}`, reviewData)
    return response.data
  },

  // Delete facility review
  deleteFacilityReview: async (reviewId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/healthcare/reviews/facilities/${reviewId}`)
    return response.data
  },

  // Delete provider review
  deleteProviderReview: async (reviewId: string): Promise<ApiResponse<string>> => {
    const response = await apiClient.delete(`/healthcare/reviews/providers/${reviewId}`)
    return response.data
  }
}

// ===== HEALTHCARE GENERAL =====
export const healthcareApi = {
  // Get healthcare stats
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/api/healthcare/stats')
    return response.data
  },

  // Get facility types
  getFacilityTypes: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/api/healthcare/facility-types')
    return response.data
  },

  // Get specializations
  getSpecializations: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/api/healthcare/specializations')
    return response.data
  }
}

// Export all APIs
export const healthcareApiService = {
  facilities: healthcareFacilityApi,
  providers: healthcareProviderApi,
  reviews: healthcareReviewApi,
  general: healthcareApi
}
