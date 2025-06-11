using CareNest.Application.DTOs.Healthcare;
using CareNest.Application.Interfaces;
using CareNest.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/healthcare/facilities")]
[Authorize]
public class HealthcareFacilityController : ControllerBase
{
    private readonly IHealthcareService _healthcareService;

    public HealthcareFacilityController(IHealthcareService healthcareService)
    {
        _healthcareService = healthcareService;
    }

    /// <summary>
    /// Lấy danh sách tất cả cơ sở y tế
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilities()
    {
        var result = await _healthcareService.GetFacilitiesAsync();
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy thông tin chi tiết cơ sở y tế
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacility(Guid id)
    {
        var result = await _healthcareService.GetFacilityByIdAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy thông tin cơ sở y tế kèm danh sách bác sĩ
    /// </summary>
    [HttpGet("{id}/providers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilityWithProviders(Guid id)
    {
        var result = await _healthcareService.GetFacilityWithProvidersAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy thông tin cơ sở y tế kèm đánh giá
    /// </summary>
    [HttpGet("{id}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilityWithReviews(Guid id)
    {
        var result = await _healthcareService.GetFacilityWithReviewsAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return NotFound(result);
    }

    /// <summary>
    /// Lấy danh sách cơ sở y tế theo loại
    /// </summary>
    [HttpGet("type/{type}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilitiesByType(HealthcareFacilityType type)
    {
        var result = await _healthcareService.GetFacilitiesByTypeAsync(type);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tìm kiếm cơ sở y tế
    /// </summary>
    [HttpPost("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchFacilities([FromBody] HealthcareFacilitySearchDto searchDto)
    {
        var result = await _healthcareService.SearchFacilitiesAsync(searchDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy danh sách cơ sở y tế gần vị trí
    /// </summary>
    [HttpGet("nearby")]
    [AllowAnonymous]
    public async Task<IActionResult> GetNearbyFacilities(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        [FromQuery] double radiusKm = 10)
    {
        var result = await _healthcareService.GetNearbyFacilitiesAsync(latitude, longitude, radiusKm);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tạo cơ sở y tế mới (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateFacility([FromBody] CreateHealthcareFacilityDto createDto)
    {
        var result = await _healthcareService.CreateFacilityAsync(createDto);
        
        if (result.Success)
        {
            return CreatedAtAction(nameof(GetFacility), new { id = result.Data?.Id }, result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Cập nhật thông tin cơ sở y tế (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFacility(Guid id, [FromBody] UpdateHealthcareFacilityDto updateDto)
    {
        var result = await _healthcareService.UpdateFacilityAsync(id, updateDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Xóa cơ sở y tế (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFacility(Guid id)
    {
        var result = await _healthcareService.DeleteFacilityAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy thống kê đánh giá cơ sở y tế
    /// </summary>
    [HttpGet("{id}/review-stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilityReviewStats(Guid id)
    {
        var result = await _healthcareService.GetFacilityReviewStatsAsync(id);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
