using CareNest.Application.Common;
using CareNest.Application.DTOs.Healthcare;
using CareNest.Domain.Enums;

namespace CareNest.Application.Interfaces;

public interface IHealthcareService
{
    // Healthcare Facilities
    Task<ApiResponse<HealthcareFacilityDto>> GetFacilityByIdAsync(Guid id);
    Task<ApiResponse<HealthcareFacilityDto>> GetFacilityWithProvidersAsync(Guid id);
    Task<ApiResponse<HealthcareFacilityDto>> GetFacilityWithReviewsAsync(Guid id);
    Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetFacilitiesAsync();
    Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetFacilitiesByTypeAsync(HealthcareFacilityType type);
    Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> SearchFacilitiesAsync(HealthcareFacilitySearchDto searchDto);
    Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetNearbyFacilitiesAsync(double latitude, double longitude, double radiusKm);
    Task<ApiResponse<HealthcareFacilityDto>> CreateFacilityAsync(CreateHealthcareFacilityDto createDto);
    Task<ApiResponse<HealthcareFacilityDto>> UpdateFacilityAsync(Guid id, UpdateHealthcareFacilityDto updateDto);
    Task<ApiResponse<string>> DeleteFacilityAsync(Guid id);

    // Healthcare Providers
    Task<ApiResponse<HealthcareProviderDto>> GetProviderByIdAsync(Guid id);
    Task<ApiResponse<HealthcareProviderDto>> GetProviderWithFacilitiesAsync(Guid id);
    Task<ApiResponse<HealthcareProviderDto>> GetProviderWithReviewsAsync(Guid id);
    Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersAsync();
    Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersBySpecializationAsync(ProviderSpecialization specialization);
    Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersByFacilityAsync(Guid facilityId);
    Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> SearchProvidersAsync(HealthcareProviderSearchDto searchDto);
    Task<ApiResponse<HealthcareProviderDto>> CreateProviderAsync(CreateHealthcareProviderDto createDto);
    Task<ApiResponse<HealthcareProviderDto>> UpdateProviderAsync(Guid id, UpdateHealthcareProviderDto updateDto);
    Task<ApiResponse<string>> DeleteProviderAsync(Guid id);

    // Reviews
    Task<ApiResponse<IEnumerable<FacilityReviewDto>>> GetFacilityReviewsAsync(Guid facilityId, int page = 1, int pageSize = 10);
    Task<ApiResponse<IEnumerable<ProviderReviewDto>>> GetProviderReviewsAsync(Guid providerId, int page = 1, int pageSize = 10);
    Task<ApiResponse<FacilityReviewDto>> CreateFacilityReviewAsync(Guid userId, CreateFacilityReviewDto createDto);
    Task<ApiResponse<ProviderReviewDto>> CreateProviderReviewAsync(Guid userId, CreateProviderReviewDto createDto);
    Task<ApiResponse<FacilityReviewDto>> UpdateFacilityReviewAsync(Guid reviewId, Guid userId, UpdateFacilityReviewDto updateDto);
    Task<ApiResponse<ProviderReviewDto>> UpdateProviderReviewAsync(Guid reviewId, Guid userId, UpdateProviderReviewDto updateDto);
    Task<ApiResponse<string>> DeleteFacilityReviewAsync(Guid reviewId, Guid userId);
    Task<ApiResponse<string>> DeleteProviderReviewAsync(Guid reviewId, Guid userId);

    // Statistics
    Task<ApiResponse<ReviewStatsDto>> GetFacilityReviewStatsAsync(Guid facilityId);
    Task<ApiResponse<ReviewStatsDto>> GetProviderReviewStatsAsync(Guid providerId);
    Task<ApiResponse<object>> GetHealthcareStatsAsync();
}
