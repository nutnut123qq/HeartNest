using CareNest.Application.DTOs.Healthcare;
using CareNest.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/healthcare/reviews")]
[Authorize]
public class HealthcareReviewController : ControllerBase
{
    private readonly IHealthcareService _healthcareService;

    public HealthcareReviewController(IHealthcareService healthcareService)
    {
        _healthcareService = healthcareService;
    }

    /// <summary>
    /// Lấy danh sách đánh giá cơ sở y tế
    /// </summary>
    [HttpGet("facilities/{facilityId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFacilityReviews(
        Guid facilityId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _healthcareService.GetFacilityReviewsAsync(facilityId, page, pageSize);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy danh sách đánh giá bác sĩ
    /// </summary>
    [HttpGet("providers/{providerId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderReviews(
        Guid providerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _healthcareService.GetProviderReviewsAsync(providerId, page, pageSize);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tạo đánh giá cơ sở y tế
    /// </summary>
    [HttpPost("facilities")]
    public async Task<IActionResult> CreateFacilityReview([FromBody] CreateFacilityReviewDto createDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.CreateFacilityReviewAsync(userId, createDto);
        
        if (result.Success)
        {
            return CreatedAtAction(nameof(GetFacilityReviews), new { facilityId = createDto.FacilityId }, result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Tạo đánh giá bác sĩ
    /// </summary>
    [HttpPost("providers")]
    public async Task<IActionResult> CreateProviderReview([FromBody] CreateProviderReviewDto createDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.CreateProviderReviewAsync(userId, createDto);
        
        if (result.Success)
        {
            return CreatedAtAction(nameof(GetProviderReviews), new { providerId = createDto.ProviderId }, result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Cập nhật đánh giá cơ sở y tế
    /// </summary>
    [HttpPut("facilities/{reviewId}")]
    public async Task<IActionResult> UpdateFacilityReview(Guid reviewId, [FromBody] UpdateFacilityReviewDto updateDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.UpdateFacilityReviewAsync(reviewId, userId, updateDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Cập nhật đánh giá bác sĩ
    /// </summary>
    [HttpPut("providers/{reviewId}")]
    public async Task<IActionResult> UpdateProviderReview(Guid reviewId, [FromBody] UpdateProviderReviewDto updateDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.UpdateProviderReviewAsync(reviewId, userId, updateDto);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Xóa đánh giá cơ sở y tế
    /// </summary>
    [HttpDelete("facilities/{reviewId}")]
    public async Task<IActionResult> DeleteFacilityReview(Guid reviewId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.DeleteFacilityReviewAsync(reviewId, userId);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Xóa đánh giá bác sĩ
    /// </summary>
    [HttpDelete("providers/{reviewId}")]
    public async Task<IActionResult> DeleteProviderReview(Guid reviewId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
        var result = await _healthcareService.DeleteProviderReviewAsync(reviewId, userId);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
