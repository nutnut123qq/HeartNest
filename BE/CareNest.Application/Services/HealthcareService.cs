using CareNest.Application.Common;
using CareNest.Application.DTOs.Healthcare;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using System.Text.Json;

namespace CareNest.Application.Services;

public class HealthcareService : IHealthcareService
{
    private readonly IHealthcareFacilityRepository _facilityRepository;
    private readonly IHealthcareProviderRepository _providerRepository;
    private readonly IFacilityReviewRepository _facilityReviewRepository;
    private readonly IProviderReviewRepository _providerReviewRepository;

    public HealthcareService(
        IHealthcareFacilityRepository facilityRepository,
        IHealthcareProviderRepository providerRepository,
        IFacilityReviewRepository facilityReviewRepository,
        IProviderReviewRepository providerReviewRepository)
    {
        _facilityRepository = facilityRepository;
        _providerRepository = providerRepository;
        _facilityReviewRepository = facilityReviewRepository;
        _providerReviewRepository = providerReviewRepository;
    }

    #region Healthcare Facilities

    public async Task<ApiResponse<HealthcareFacilityDto>> GetFacilityByIdAsync(Guid id)
    {
        try
        {
            var facility = await _facilityRepository.GetByIdAsync(id);
            if (facility == null)
            {
                return ApiResponse<HealthcareFacilityDto>.ErrorResult("Không tìm thấy cơ sở y tế");
            }

            var dto = MapToFacilityDto(facility);
            return ApiResponse<HealthcareFacilityDto>.SuccessResult(dto, "Lấy thông tin cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareFacilityDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin cơ sở y tế");
        }
    }

    public async Task<ApiResponse<HealthcareFacilityDto>> GetFacilityWithProvidersAsync(Guid id)
    {
        try
        {
            var facility = await _facilityRepository.GetByIdWithProvidersAsync(id);
            if (facility == null)
            {
                return ApiResponse<HealthcareFacilityDto>.ErrorResult("Không tìm thấy cơ sở y tế");
            }

            var dto = MapToFacilityDto(facility);
            dto.Providers = facility.Providers.Select(p => MapToProviderSummaryDto(p)).ToList();
            
            return ApiResponse<HealthcareFacilityDto>.SuccessResult(dto, "Lấy thông tin cơ sở y tế và bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareFacilityDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin cơ sở y tế");
        }
    }

    public async Task<ApiResponse<HealthcareFacilityDto>> GetFacilityWithReviewsAsync(Guid id)
    {
        try
        {
            var facility = await _facilityRepository.GetByIdWithReviewsAsync(id);
            if (facility == null)
            {
                return ApiResponse<HealthcareFacilityDto>.ErrorResult("Không tìm thấy cơ sở y tế");
            }

            var dto = MapToFacilityDto(facility);
            dto.RecentReviews = facility.Reviews.Select(r => MapToFacilityReviewDto(r)).ToList();

            return ApiResponse<HealthcareFacilityDto>.SuccessResult(dto, "Lấy thông tin cơ sở y tế và đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareFacilityDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin cơ sở y tế");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetFacilitiesAsync()
    {
        try
        {
            var facilities = await _facilityRepository.GetActiveAsync();
            var dtos = facilities.Select(f => MapToFacilitySummaryDto(f));
            
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.SuccessResult(dtos, "Lấy danh sách cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách cơ sở y tế");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetFacilitiesByTypeAsync(HealthcareFacilityType type)
    {
        try
        {
            var facilities = await _facilityRepository.GetByTypeAsync(type);
            var dtos = facilities.Select(f => MapToFacilitySummaryDto(f));
            
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.SuccessResult(dtos, $"Lấy danh sách {GetFacilityTypeDisplay(type)} thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách cơ sở y tế");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> SearchFacilitiesAsync(HealthcareFacilitySearchDto searchDto)
    {
        try
        {
            IEnumerable<HealthcareFacility> facilities;

            if (!string.IsNullOrEmpty(searchDto.SearchTerm))
            {
                facilities = await _facilityRepository.SearchAsync(searchDto.SearchTerm);
            }
            else
            {
                facilities = await _facilityRepository.GetWithFiltersAsync(
                    searchDto.Type,
                    searchDto.MinRating,
                    searchDto.IsVerified,
                    searchDto.Latitude,
                    searchDto.Longitude,
                    searchDto.RadiusKm,
                    searchDto.Page,
                    searchDto.PageSize);
            }

            var dtos = facilities.Select(f => MapToFacilitySummaryDto(f, searchDto.Latitude, searchDto.Longitude));
            
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.SuccessResult(dtos, "Tìm kiếm cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.ErrorResult("Có lỗi xảy ra khi tìm kiếm cơ sở y tế");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>> GetNearbyFacilitiesAsync(double latitude, double longitude, double radiusKm)
    {
        try
        {
            var facilities = await _facilityRepository.GetNearbyAsync(latitude, longitude, radiusKm);
            var dtos = facilities.Select(f => MapToFacilitySummaryDto(f, latitude, longitude));
            
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.SuccessResult(dtos, "Lấy danh sách cơ sở y tế gần bạn thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareFacilitySummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách cơ sở y tế gần bạn");
        }
    }

    public async Task<ApiResponse<HealthcareFacilityDto>> CreateFacilityAsync(CreateHealthcareFacilityDto createDto)
    {
        try
        {
            var facility = new HealthcareFacility
            {
                Name = createDto.Name,
                Type = createDto.Type,
                Description = createDto.Description,
                Address = createDto.Address,
                Phone = createDto.Phone,
                Email = createDto.Email,
                Website = createDto.Website,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                OperatingHours = JsonSerializer.Serialize(createDto.OperatingHours),
                Services = JsonSerializer.Serialize(createDto.Services),
                Images = JsonSerializer.Serialize(createDto.Images)
            };

            var createdFacility = await _facilityRepository.CreateAsync(facility);
            var dto = MapToFacilityDto(createdFacility);
            
            return ApiResponse<HealthcareFacilityDto>.SuccessResult(dto, "Tạo cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareFacilityDto>.ErrorResult("Có lỗi xảy ra khi tạo cơ sở y tế");
        }
    }

    public async Task<ApiResponse<HealthcareFacilityDto>> UpdateFacilityAsync(Guid id, UpdateHealthcareFacilityDto updateDto)
    {
        try
        {
            var facility = await _facilityRepository.GetByIdAsync(id);
            if (facility == null)
            {
                return ApiResponse<HealthcareFacilityDto>.ErrorResult("Không tìm thấy cơ sở y tế");
            }

            facility.Name = updateDto.Name;
            facility.Description = updateDto.Description;
            facility.Address = updateDto.Address;
            facility.Phone = updateDto.Phone;
            facility.Email = updateDto.Email;
            facility.Website = updateDto.Website;
            facility.Latitude = updateDto.Latitude;
            facility.Longitude = updateDto.Longitude;
            facility.OperatingHours = JsonSerializer.Serialize(updateDto.OperatingHours);
            facility.Services = JsonSerializer.Serialize(updateDto.Services);
            facility.Images = JsonSerializer.Serialize(updateDto.Images);

            var updatedFacility = await _facilityRepository.UpdateAsync(facility);
            var dto = MapToFacilityDto(updatedFacility);
            
            return ApiResponse<HealthcareFacilityDto>.SuccessResult(dto, "Cập nhật cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareFacilityDto>.ErrorResult("Có lỗi xảy ra khi cập nhật cơ sở y tế");
        }
    }

    public async Task<ApiResponse<string>> DeleteFacilityAsync(Guid id)
    {
        try
        {
            var exists = await _facilityRepository.ExistsAsync(id);
            if (!exists)
            {
                return ApiResponse<string>.ErrorResult("Không tìm thấy cơ sở y tế");
            }

            await _facilityRepository.DeleteAsync(id);
            return ApiResponse<string>.SuccessResult("Xóa cơ sở y tế thành công", "Deleted");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResult("Có lỗi xảy ra khi xóa cơ sở y tế");
        }
    }

    #endregion

    #region Healthcare Providers

    public async Task<ApiResponse<HealthcareProviderDto>> GetProviderByIdAsync(Guid id)
    {
        try
        {
            var provider = await _providerRepository.GetByIdAsync(id);
            if (provider == null)
            {
                return ApiResponse<HealthcareProviderDto>.ErrorResult("Không tìm thấy bác sĩ");
            }

            var dto = MapToProviderDto(provider);
            return ApiResponse<HealthcareProviderDto>.SuccessResult(dto, "Lấy thông tin bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareProviderDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin bác sĩ");
        }
    }

    public async Task<ApiResponse<HealthcareProviderDto>> GetProviderWithFacilitiesAsync(Guid id)
    {
        try
        {
            var provider = await _providerRepository.GetByIdWithFacilitiesAsync(id);
            if (provider == null)
            {
                return ApiResponse<HealthcareProviderDto>.ErrorResult("Không tìm thấy bác sĩ");
            }

            var dto = MapToProviderDto(provider);
            var facilities = await _providerRepository.GetProviderFacilitiesAsync(id);
            dto.Facilities = facilities.Select(f => MapToFacilitySummaryDto(f)).ToList();
            
            return ApiResponse<HealthcareProviderDto>.SuccessResult(dto, "Lấy thông tin bác sĩ và cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareProviderDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin bác sĩ");
        }
    }

    public async Task<ApiResponse<HealthcareProviderDto>> GetProviderWithReviewsAsync(Guid id)
    {
        try
        {
            var provider = await _providerRepository.GetByIdWithReviewsAsync(id);
            if (provider == null)
            {
                return ApiResponse<HealthcareProviderDto>.ErrorResult("Không tìm thấy bác sĩ");
            }

            var dto = MapToProviderDto(provider);
            dto.RecentReviews = provider.Reviews.Select(r => MapToProviderReviewDto(r)).ToList();
            
            return ApiResponse<HealthcareProviderDto>.SuccessResult(dto, "Lấy thông tin bác sĩ và đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareProviderDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin bác sĩ");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersAsync()
    {
        try
        {
            var providers = await _providerRepository.GetActiveAsync();
            var dtos = providers.Select(p => MapToProviderSummaryDto(p));

            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.SuccessResult(dtos, "Lấy danh sách bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách bác sĩ");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersBySpecializationAsync(ProviderSpecialization specialization)
    {
        try
        {
            var providers = await _providerRepository.GetBySpecializationAsync(specialization);
            var dtos = providers.Select(p => MapToProviderSummaryDto(p));

            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.SuccessResult(dtos, $"Lấy danh sách bác sĩ {GetSpecializationDisplay(specialization)} thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách bác sĩ");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> GetProvidersByFacilityAsync(Guid facilityId)
    {
        try
        {
            var providers = await _providerRepository.GetByFacilityAsync(facilityId);
            var dtos = providers.Select(p => MapToProviderSummaryDto(p));

            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.SuccessResult(dtos, "Lấy danh sách bác sĩ tại cơ sở y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách bác sĩ");
        }
    }

    public async Task<ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>> SearchProvidersAsync(HealthcareProviderSearchDto searchDto)
    {
        try
        {
            IEnumerable<HealthcareProvider> providers;

            if (!string.IsNullOrEmpty(searchDto.SearchTerm))
            {
                providers = await _providerRepository.SearchAsync(searchDto.SearchTerm);
            }
            else
            {
                providers = await _providerRepository.GetWithFiltersAsync(
                    searchDto.Specialization,
                    searchDto.MinRating,
                    searchDto.AcceptsNewPatients,
                    searchDto.IsVerified,
                    searchDto.FacilityId,
                    searchDto.Page,
                    searchDto.PageSize);
            }

            var dtos = providers.Select(p => MapToProviderSummaryDto(p));

            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.SuccessResult(dtos, "Tìm kiếm bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<HealthcareProviderSummaryDto>>.ErrorResult("Có lỗi xảy ra khi tìm kiếm bác sĩ");
        }
    }

    public async Task<ApiResponse<HealthcareProviderDto>> CreateProviderAsync(CreateHealthcareProviderDto createDto)
    {
        try
        {
            var existsByLicense = await _providerRepository.ExistsByLicenseAsync(createDto.LicenseNumber);
            if (existsByLicense)
            {
                return ApiResponse<HealthcareProviderDto>.ErrorResult("Số giấy phép hành nghề đã tồn tại");
            }

            var provider = new HealthcareProvider
            {
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Title = createDto.Title,
                Specialization = createDto.Specialization,
                SubSpecialty = createDto.SubSpecialty,
                LicenseNumber = createDto.LicenseNumber,
                YearsOfExperience = createDto.YearsOfExperience,
                Qualifications = JsonSerializer.Serialize(createDto.Qualifications),
                Biography = createDto.Biography,
                Phone = createDto.Phone,
                Email = createDto.Email,
                ConsultationFees = JsonSerializer.Serialize(createDto.ConsultationFees),
                Availability = JsonSerializer.Serialize(createDto.Availability),
                Languages = JsonSerializer.Serialize(createDto.Languages),
                ProfileImage = createDto.ProfileImage,
                PrimaryFacilityId = createDto.PrimaryFacilityId
            };

            var createdProvider = await _providerRepository.CreateAsync(provider);
            var dto = MapToProviderDto(createdProvider);

            return ApiResponse<HealthcareProviderDto>.SuccessResult(dto, "Tạo hồ sơ bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareProviderDto>.ErrorResult("Có lỗi xảy ra khi tạo hồ sơ bác sĩ");
        }
    }

    public async Task<ApiResponse<HealthcareProviderDto>> UpdateProviderAsync(Guid id, UpdateHealthcareProviderDto updateDto)
    {
        try
        {
            var provider = await _providerRepository.GetByIdAsync(id);
            if (provider == null)
            {
                return ApiResponse<HealthcareProviderDto>.ErrorResult("Không tìm thấy bác sĩ");
            }

            provider.FirstName = updateDto.FirstName;
            provider.LastName = updateDto.LastName;
            provider.Title = updateDto.Title;
            provider.SubSpecialty = updateDto.SubSpecialty;
            provider.YearsOfExperience = updateDto.YearsOfExperience;
            provider.Qualifications = JsonSerializer.Serialize(updateDto.Qualifications);
            provider.Biography = updateDto.Biography;
            provider.Phone = updateDto.Phone;
            provider.Email = updateDto.Email;
            provider.ConsultationFees = JsonSerializer.Serialize(updateDto.ConsultationFees);
            provider.Availability = JsonSerializer.Serialize(updateDto.Availability);
            provider.Languages = JsonSerializer.Serialize(updateDto.Languages);
            provider.ProfileImage = updateDto.ProfileImage;
            provider.AcceptsNewPatients = updateDto.AcceptsNewPatients;

            var updatedProvider = await _providerRepository.UpdateAsync(provider);
            var dto = MapToProviderDto(updatedProvider);

            return ApiResponse<HealthcareProviderDto>.SuccessResult(dto, "Cập nhật hồ sơ bác sĩ thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<HealthcareProviderDto>.ErrorResult("Có lỗi xảy ra khi cập nhật hồ sơ bác sĩ");
        }
    }

    public async Task<ApiResponse<string>> DeleteProviderAsync(Guid id)
    {
        try
        {
            var exists = await _providerRepository.ExistsAsync(id);
            if (!exists)
            {
                return ApiResponse<string>.ErrorResult("Không tìm thấy bác sĩ");
            }

            await _providerRepository.DeleteAsync(id);
            return ApiResponse<string>.SuccessResult("Xóa hồ sơ bác sĩ thành công", "Deleted");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResult("Có lỗi xảy ra khi xóa hồ sơ bác sĩ");
        }
    }

    #endregion

    #region Reviews

    public async Task<ApiResponse<IEnumerable<FacilityReviewDto>>> GetFacilityReviewsAsync(Guid facilityId, int page = 1, int pageSize = 10)
    {
        try
        {
            var reviews = await _facilityReviewRepository.GetByFacilityAsync(facilityId, page, pageSize);
            var dtos = reviews.Select(r => MapToFacilityReviewDto(r));

            return ApiResponse<IEnumerable<FacilityReviewDto>>.SuccessResult(dtos, "Lấy danh sách đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<FacilityReviewDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách đánh giá");
        }
    }

    public async Task<ApiResponse<IEnumerable<ProviderReviewDto>>> GetProviderReviewsAsync(Guid providerId, int page = 1, int pageSize = 10)
    {
        try
        {
            var reviews = await _providerReviewRepository.GetByProviderAsync(providerId, page, pageSize);
            var dtos = reviews.Select(r => MapToProviderReviewDto(r));

            return ApiResponse<IEnumerable<ProviderReviewDto>>.SuccessResult(dtos, "Lấy danh sách đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<IEnumerable<ProviderReviewDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách đánh giá");
        }
    }

    public async Task<ApiResponse<FacilityReviewDto>> CreateFacilityReviewAsync(Guid userId, CreateFacilityReviewDto createDto)
    {
        try
        {
            var hasReviewed = await _facilityReviewRepository.UserHasReviewedFacilityAsync(userId, createDto.FacilityId);
            if (hasReviewed)
            {
                return ApiResponse<FacilityReviewDto>.ErrorResult("Bạn đã đánh giá cơ sở y tế này rồi");
            }

            var review = new FacilityReview
            {
                FacilityId = createDto.FacilityId,
                UserId = userId,
                Rating = createDto.Rating,
                Title = createDto.Title,
                Comment = createDto.Comment,
                CleanlinessRating = createDto.CleanlinessRating,
                StaffRating = createDto.StaffRating,
                WaitTimeRating = createDto.WaitTimeRating,
                FacilitiesRating = createDto.FacilitiesRating,
                IsAnonymous = createDto.IsAnonymous
            };

            var createdReview = await _facilityReviewRepository.CreateAsync(review);

            // Update facility rating
            await _facilityRepository.UpdateRatingAsync(createDto.FacilityId);

            var dto = MapToFacilityReviewDto(createdReview);
            return ApiResponse<FacilityReviewDto>.SuccessResult(dto, "Tạo đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<FacilityReviewDto>.ErrorResult("Có lỗi xảy ra khi tạo đánh giá");
        }
    }

    public async Task<ApiResponse<ProviderReviewDto>> CreateProviderReviewAsync(Guid userId, CreateProviderReviewDto createDto)
    {
        try
        {
            var hasReviewed = await _providerReviewRepository.UserHasReviewedProviderAsync(userId, createDto.ProviderId);
            if (hasReviewed)
            {
                return ApiResponse<ProviderReviewDto>.ErrorResult("Bạn đã đánh giá bác sĩ này rồi");
            }

            var review = new ProviderReview
            {
                ProviderId = createDto.ProviderId,
                UserId = userId,
                Rating = createDto.Rating,
                Title = createDto.Title,
                Comment = createDto.Comment,
                CommunicationRating = createDto.CommunicationRating,
                ProfessionalismRating = createDto.ProfessionalismRating,
                TreatmentEffectivenessRating = createDto.TreatmentEffectivenessRating,
                WaitTimeRating = createDto.WaitTimeRating,
                VisitDate = createDto.VisitDate,
                TreatmentType = createDto.TreatmentType,
                WouldRecommend = createDto.WouldRecommend,
                IsAnonymous = createDto.IsAnonymous
            };

            var createdReview = await _providerReviewRepository.CreateAsync(review);

            // Update provider rating
            await _providerRepository.UpdateRatingAsync(createDto.ProviderId);

            var dto = MapToProviderReviewDto(createdReview);
            return ApiResponse<ProviderReviewDto>.SuccessResult(dto, "Tạo đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProviderReviewDto>.ErrorResult("Có lỗi xảy ra khi tạo đánh giá");
        }
    }

    public async Task<ApiResponse<FacilityReviewDto>> UpdateFacilityReviewAsync(Guid reviewId, Guid userId, UpdateFacilityReviewDto updateDto)
    {
        try
        {
            var review = await _facilityReviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ApiResponse<FacilityReviewDto>.ErrorResult("Không tìm thấy đánh giá");
            }

            if (review.UserId != userId)
            {
                return ApiResponse<FacilityReviewDto>.ErrorResult("Bạn không có quyền chỉnh sửa đánh giá này");
            }

            review.Rating = updateDto.Rating;
            review.Title = updateDto.Title;
            review.Comment = updateDto.Comment;
            review.CleanlinessRating = updateDto.CleanlinessRating;
            review.StaffRating = updateDto.StaffRating;
            review.WaitTimeRating = updateDto.WaitTimeRating;
            review.FacilitiesRating = updateDto.FacilitiesRating;

            var updatedReview = await _facilityReviewRepository.UpdateAsync(review);

            // Update facility rating
            await _facilityRepository.UpdateRatingAsync(review.FacilityId);

            var dto = MapToFacilityReviewDto(updatedReview);
            return ApiResponse<FacilityReviewDto>.SuccessResult(dto, "Cập nhật đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<FacilityReviewDto>.ErrorResult("Có lỗi xảy ra khi cập nhật đánh giá");
        }
    }

    public async Task<ApiResponse<ProviderReviewDto>> UpdateProviderReviewAsync(Guid reviewId, Guid userId, UpdateProviderReviewDto updateDto)
    {
        try
        {
            var review = await _providerReviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ApiResponse<ProviderReviewDto>.ErrorResult("Không tìm thấy đánh giá");
            }

            if (review.UserId != userId)
            {
                return ApiResponse<ProviderReviewDto>.ErrorResult("Bạn không có quyền chỉnh sửa đánh giá này");
            }

            review.Rating = updateDto.Rating;
            review.Title = updateDto.Title;
            review.Comment = updateDto.Comment;
            review.CommunicationRating = updateDto.CommunicationRating;
            review.ProfessionalismRating = updateDto.ProfessionalismRating;
            review.TreatmentEffectivenessRating = updateDto.TreatmentEffectivenessRating;
            review.WaitTimeRating = updateDto.WaitTimeRating;
            review.VisitDate = updateDto.VisitDate;
            review.TreatmentType = updateDto.TreatmentType;
            review.WouldRecommend = updateDto.WouldRecommend;

            var updatedReview = await _providerReviewRepository.UpdateAsync(review);

            // Update provider rating
            await _providerRepository.UpdateRatingAsync(review.ProviderId);

            var dto = MapToProviderReviewDto(updatedReview);
            return ApiResponse<ProviderReviewDto>.SuccessResult(dto, "Cập nhật đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProviderReviewDto>.ErrorResult("Có lỗi xảy ra khi cập nhật đánh giá");
        }
    }

    public async Task<ApiResponse<string>> DeleteFacilityReviewAsync(Guid reviewId, Guid userId)
    {
        try
        {
            var review = await _facilityReviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ApiResponse<string>.ErrorResult("Không tìm thấy đánh giá");
            }

            if (review.UserId != userId)
            {
                return ApiResponse<string>.ErrorResult("Bạn không có quyền xóa đánh giá này");
            }

            var facilityId = review.FacilityId;
            await _facilityReviewRepository.DeleteAsync(reviewId);

            // Update facility rating
            await _facilityRepository.UpdateRatingAsync(facilityId);

            return ApiResponse<string>.SuccessResult("Xóa đánh giá thành công", "Deleted");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResult("Có lỗi xảy ra khi xóa đánh giá");
        }
    }

    public async Task<ApiResponse<string>> DeleteProviderReviewAsync(Guid reviewId, Guid userId)
    {
        try
        {
            var review = await _providerReviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                return ApiResponse<string>.ErrorResult("Không tìm thấy đánh giá");
            }

            if (review.UserId != userId)
            {
                return ApiResponse<string>.ErrorResult("Bạn không có quyền xóa đánh giá này");
            }

            var providerId = review.ProviderId;
            await _providerReviewRepository.DeleteAsync(reviewId);

            // Update provider rating
            await _providerRepository.UpdateRatingAsync(providerId);

            return ApiResponse<string>.SuccessResult("Xóa đánh giá thành công", "Deleted");
        }
        catch (Exception ex)
        {
            return ApiResponse<string>.ErrorResult("Có lỗi xảy ra khi xóa đánh giá");
        }
    }

    public async Task<ApiResponse<ReviewStatsDto>> GetFacilityReviewStatsAsync(Guid facilityId)
    {
        try
        {
            var averageRating = await _facilityReviewRepository.GetAverageRatingByFacilityAsync(facilityId);
            var totalReviews = await _facilityReviewRepository.GetCountByFacilityAsync(facilityId);
            var ratingDistribution = await _facilityReviewRepository.GetRatingDistributionAsync(facilityId);

            var stats = new ReviewStatsDto
            {
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                RatingDistribution = ratingDistribution
            };

            return ApiResponse<ReviewStatsDto>.SuccessResult(stats, "Lấy thống kê đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<ReviewStatsDto>.ErrorResult("Có lỗi xảy ra khi lấy thống kê đánh giá");
        }
    }

    public async Task<ApiResponse<ReviewStatsDto>> GetProviderReviewStatsAsync(Guid providerId)
    {
        try
        {
            var averageRating = await _providerReviewRepository.GetAverageRatingByProviderAsync(providerId);
            var totalReviews = await _providerReviewRepository.GetCountByProviderAsync(providerId);
            var ratingDistribution = await _providerReviewRepository.GetRatingDistributionAsync(providerId);

            var stats = new ReviewStatsDto
            {
                AverageRating = averageRating,
                TotalReviews = totalReviews,
                RatingDistribution = ratingDistribution
            };

            return ApiResponse<ReviewStatsDto>.SuccessResult(stats, "Lấy thống kê đánh giá thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<ReviewStatsDto>.ErrorResult("Có lỗi xảy ra khi lấy thống kê đánh giá");
        }
    }

    public async Task<ApiResponse<object>> GetHealthcareStatsAsync()
    {
        try
        {
            var totalFacilities = await _facilityRepository.GetTotalCountAsync();
            var totalProviders = await _providerRepository.GetTotalCountAsync();
            var totalFacilityReviews = await _facilityReviewRepository.GetTotalCountAsync();
            var totalProviderReviews = await _providerReviewRepository.GetTotalCountAsync();
            var avgFacilityRating = await _facilityRepository.GetAverageRatingAsync();
            var avgProviderRating = await _providerRepository.GetAverageRatingAsync();

            var stats = new
            {
                TotalFacilities = totalFacilities,
                TotalProviders = totalProviders,
                TotalReviews = totalFacilityReviews + totalProviderReviews,
                AverageFacilityRating = avgFacilityRating,
                AverageProviderRating = avgProviderRating
            };

            return ApiResponse<object>.SuccessResult(stats, "Lấy thống kê hệ thống y tế thành công");
        }
        catch (Exception ex)
        {
            return ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy thống kê hệ thống y tế");
        }
    }

    #endregion

    #region Mapping Methods

    private HealthcareFacilityDto MapToFacilityDto(HealthcareFacility facility)
    {
        return new HealthcareFacilityDto
        {
            Id = facility.Id,
            Name = facility.Name,
            Type = facility.Type,
            TypeDisplay = GetFacilityTypeDisplay(facility.Type),
            Description = facility.Description,
            Address = facility.Address,
            Phone = facility.Phone,
            Email = facility.Email,
            Website = facility.Website,
            Latitude = facility.Latitude,
            Longitude = facility.Longitude,
            AverageRating = facility.AverageRating,
            ReviewCount = facility.ReviewCount,
            OperatingHours = DeserializeStringList(facility.OperatingHours),
            Services = DeserializeStringList(facility.Services),
            Images = DeserializeStringList(facility.Images),
            IsActive = facility.IsActive,
            IsVerified = facility.IsVerified,
            CreatedAt = facility.CreatedAt,
            UpdatedAt = facility.UpdatedAt
        };
    }

    private HealthcareFacilitySummaryDto MapToFacilitySummaryDto(HealthcareFacility facility, double? userLat = null, double? userLon = null)
    {
        var dto = new HealthcareFacilitySummaryDto
        {
            Id = facility.Id,
            Name = facility.Name,
            Type = facility.Type,
            TypeDisplay = GetFacilityTypeDisplay(facility.Type),
            Address = facility.Address,
            Phone = facility.Phone,
            AverageRating = facility.AverageRating,
            ReviewCount = facility.ReviewCount,
            IsVerified = facility.IsVerified
        };

        if (userLat.HasValue && userLon.HasValue)
        {
            dto.DistanceKm = CalculateDistance(userLat.Value, userLon.Value, facility.Latitude, facility.Longitude);
        }

        return dto;
    }

    private HealthcareProviderDto MapToProviderDto(HealthcareProvider provider)
    {
        return new HealthcareProviderDto
        {
            Id = provider.Id,
            FirstName = provider.FirstName,
            LastName = provider.LastName,
            FullName = provider.FullName,
            Title = provider.Title,
            Specialization = provider.Specialization,
            SpecializationDisplay = GetSpecializationDisplay(provider.Specialization),
            SubSpecialty = provider.SubSpecialty,
            LicenseNumber = provider.LicenseNumber,
            YearsOfExperience = provider.YearsOfExperience,
            Qualifications = DeserializeStringList(provider.Qualifications),
            Biography = provider.Biography,
            Phone = provider.Phone,
            Email = provider.Email,
            AverageRating = provider.AverageRating,
            ReviewCount = provider.ReviewCount,
            ConsultationFees = DeserializeDictionary<decimal>(provider.ConsultationFees),
            Availability = DeserializeDictionary<List<string>>(provider.Availability),
            Languages = DeserializeStringList(provider.Languages),
            ProfileImage = provider.ProfileImage,
            IsActive = provider.IsActive,
            IsVerified = provider.IsVerified,
            AcceptsNewPatients = provider.AcceptsNewPatients,
            CreatedAt = provider.CreatedAt,
            UpdatedAt = provider.UpdatedAt,
            PrimaryFacility = provider.PrimaryFacility != null ? MapToFacilitySummaryDto(provider.PrimaryFacility) : null
        };
    }

    private HealthcareProviderSummaryDto MapToProviderSummaryDto(HealthcareProvider provider)
    {
        return new HealthcareProviderSummaryDto
        {
            Id = provider.Id,
            FullName = provider.FullName,
            Title = provider.Title,
            Specialization = provider.Specialization,
            SpecializationDisplay = GetSpecializationDisplay(provider.Specialization),
            SubSpecialty = provider.SubSpecialty,
            YearsOfExperience = provider.YearsOfExperience,
            AverageRating = provider.AverageRating,
            ReviewCount = provider.ReviewCount,
            IsVerified = provider.IsVerified,
            AcceptsNewPatients = provider.AcceptsNewPatients,
            ProfileImage = provider.ProfileImage
        };
    }

    private FacilityReviewDto MapToFacilityReviewDto(FacilityReview review)
    {
        return new FacilityReviewDto
        {
            Id = review.Id,
            FacilityId = review.FacilityId,
            UserId = review.UserId,
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            CleanlinessRating = review.CleanlinessRating,
            StaffRating = review.StaffRating,
            WaitTimeRating = review.WaitTimeRating,
            FacilitiesRating = review.FacilitiesRating,
            IsVerified = review.IsVerified,
            IsAnonymous = review.IsAnonymous,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt,
            UserName = review.IsAnonymous ? "Ẩn danh" : review.User?.FullName,
            FacilityName = review.Facility?.Name
        };
    }

    private ProviderReviewDto MapToProviderReviewDto(ProviderReview review)
    {
        return new ProviderReviewDto
        {
            Id = review.Id,
            ProviderId = review.ProviderId,
            UserId = review.UserId,
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            CommunicationRating = review.CommunicationRating,
            ProfessionalismRating = review.ProfessionalismRating,
            TreatmentEffectivenessRating = review.TreatmentEffectivenessRating,
            WaitTimeRating = review.WaitTimeRating,
            VisitDate = review.VisitDate,
            TreatmentType = review.TreatmentType,
            WouldRecommend = review.WouldRecommend,
            IsVerified = review.IsVerified,
            IsAnonymous = review.IsAnonymous,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt,
            UserName = review.IsAnonymous ? "Ẩn danh" : review.User?.FullName,
            ProviderName = review.Provider?.FullName
        };
    }

    #endregion

    #region Helper Methods

    private List<string> DeserializeStringList(string json)
    {
        try
        {
            return string.IsNullOrEmpty(json) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    private Dictionary<string, T> DeserializeDictionary<T>(string json)
    {
        try
        {
            return string.IsNullOrEmpty(json) ? new Dictionary<string, T>() : JsonSerializer.Deserialize<Dictionary<string, T>>(json) ?? new Dictionary<string, T>();
        }
        catch
        {
            return new Dictionary<string, T>();
        }
    }

    private string GetFacilityTypeDisplay(HealthcareFacilityType type)
    {
        return type switch
        {
            HealthcareFacilityType.Hospital => "Bệnh viện",
            HealthcareFacilityType.Clinic => "Phòng khám",
            HealthcareFacilityType.Pharmacy => "Nhà thuốc",
            HealthcareFacilityType.Laboratory => "Phòng xét nghiệm",
            HealthcareFacilityType.Emergency => "Cấp cứu",
            HealthcareFacilityType.SpecialtyCenter => "Trung tâm chuyên khoa",
            _ => type.ToString()
        };
    }

    private string GetSpecializationDisplay(ProviderSpecialization specialization)
    {
        return specialization switch
        {
            ProviderSpecialization.GeneralPractice => "Bác sĩ đa khoa",
            ProviderSpecialization.Cardiology => "Tim mạch",
            ProviderSpecialization.Dermatology => "Da liễu",
            ProviderSpecialization.Endocrinology => "Nội tiết",
            ProviderSpecialization.Gastroenterology => "Tiêu hóa",
            ProviderSpecialization.Neurology => "Thần kinh",
            ProviderSpecialization.Oncology => "Ung bướu",
            ProviderSpecialization.Orthopedics => "Chấn thương chỉnh hình",
            ProviderSpecialization.Pediatrics => "Nhi khoa",
            ProviderSpecialization.Psychiatry => "Tâm thần",
            ProviderSpecialization.Radiology => "Chẩn đoán hình ảnh",
            ProviderSpecialization.Surgery => "Phẫu thuật",
            ProviderSpecialization.Urology => "Tiết niệu",
            ProviderSpecialization.Gynecology => "Phụ khoa",
            ProviderSpecialization.Ophthalmology => "Mắt",
            ProviderSpecialization.ENT => "Tai mũi họng",
            ProviderSpecialization.Dentistry => "Nha khoa",
            ProviderSpecialization.Physiotherapy => "Vật lý trị liệu",
            ProviderSpecialization.Psychology => "Tâm lý",
            ProviderSpecialization.Nutrition => "Dinh dưỡng",
            _ => specialization.ToString()
        };
    }

    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; // Earth's radius in kilometers
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }

    #endregion
}
