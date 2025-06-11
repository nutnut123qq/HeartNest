using CareNest.Application.DTOs.Healthcare;
using CareNest.Application.Interfaces;
using CareNest.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/healthcare/providers")]
[Authorize]
public class HealthcareProviderController : ControllerBase
{
    private readonly IHealthcareService _healthcareService;

    public HealthcareProviderController(IHealthcareService healthcareService)
    {
        _healthcareService = healthcareService;
    }

    /// <summary>
    /// Lấy danh sách tất cả bác sĩ
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviders()
    {
        var result = await _healthcareService.GetProvidersAsync();
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy thông tin chi tiết bác sĩ
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProvider(Guid id)
    {
        var result = await _healthcareService.GetProviderByIdAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy thông tin bác sĩ kèm danh sách cơ sở y tế
    /// </summary>
    [HttpGet("{id}/facilities")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderWithFacilities(Guid id)
    {
        var result = await _healthcareService.GetProviderWithFacilitiesAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy thông tin bác sĩ kèm đánh giá
    /// </summary>
    [HttpGet("{id}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderWithReviews(Guid id)
    {
        var result = await _healthcareService.GetProviderWithReviewsAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy danh sách bác sĩ theo chuyên khoa
    /// </summary>
    [HttpGet("specialization/{specialization}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProvidersBySpecialization(ProviderSpecialization specialization)
    {
        var result = await _healthcareService.GetProvidersBySpecializationAsync(specialization);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy danh sách bác sĩ tại cơ sở y tế
    /// </summary>
    [HttpGet("facility/{facilityId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProvidersByFacility(Guid facilityId)
    {
        var result = await _healthcareService.GetProvidersByFacilityAsync(facilityId);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tìm kiếm bác sĩ
    /// </summary>
    [HttpPost("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProviders([FromBody] HealthcareProviderSearchDto searchDto)
    {
        var result = await _healthcareService.SearchProvidersAsync(searchDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tạo hồ sơ bác sĩ mới (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProvider([FromBody] CreateHealthcareProviderDto createDto)
    {
        var result = await _healthcareService.CreateProviderAsync(createDto);
        
        if (result.Success)
        {
            return CreatedAtAction(nameof(GetProvider), new { id = result.Data?.Id }, result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Cập nhật thông tin bác sĩ (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProvider(Guid id, [FromBody] UpdateHealthcareProviderDto updateDto)
    {
        var result = await _healthcareService.UpdateProviderAsync(id, updateDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Xóa hồ sơ bác sĩ (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProvider(Guid id)
    {
        var result = await _healthcareService.DeleteProviderAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy thống kê đánh giá bác sĩ
    /// </summary>
    [HttpGet("{id}/review-stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderReviewStats(Guid id)
    {
        var result = await _healthcareService.GetProviderReviewStatsAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
