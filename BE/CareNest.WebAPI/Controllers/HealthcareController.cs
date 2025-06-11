using CareNest.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/healthcare")]
[Authorize]
public class HealthcareController : ControllerBase
{
    private readonly IHealthcareService _healthcareService;

    public HealthcareController(IHealthcareService healthcareService)
    {
        _healthcareService = healthcareService;
    }

    /// <summary>
    /// Lấy thống kê tổng quan hệ thống y tế
    /// </summary>
    [HttpGet("stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetHealthcareStats()
    {
        var result = await _healthcareService.GetHealthcareStatsAsync();
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Lấy danh sách loại cơ sở y tế
    /// </summary>
    [HttpGet("facility-types")]
    [AllowAnonymous]
    public IActionResult GetFacilityTypes()
    {
        var facilityTypes = new[]
        {
            new { Value = 0, Name = "Hospital", Display = "Bệnh viện" },
            new { Value = 1, Name = "Clinic", Display = "Phòng khám" },
            new { Value = 2, Name = "Pharmacy", Display = "Nhà thuốc" },
            new { Value = 3, Name = "Laboratory", Display = "Phòng xét nghiệm" },
            new { Value = 4, Name = "Emergency", Display = "Cấp cứu" },
            new { Value = 5, Name = "SpecialtyCenter", Display = "Trung tâm chuyên khoa" }
        };

        return Ok(new { success = true, data = facilityTypes, message = "Lấy danh sách loại cơ sở y tế thành công" });
    }

    /// <summary>
    /// Lấy danh sách chuyên khoa
    /// </summary>
    [HttpGet("specializations")]
    [AllowAnonymous]
    public IActionResult GetSpecializations()
    {
        var specializations = new[]
        {
            new { Value = 0, Name = "GeneralPractice", Display = "Bác sĩ đa khoa" },
            new { Value = 1, Name = "Cardiology", Display = "Tim mạch" },
            new { Value = 2, Name = "Dermatology", Display = "Da liễu" },
            new { Value = 3, Name = "Endocrinology", Display = "Nội tiết" },
            new { Value = 4, Name = "Gastroenterology", Display = "Tiêu hóa" },
            new { Value = 5, Name = "Neurology", Display = "Thần kinh" },
            new { Value = 6, Name = "Oncology", Display = "Ung bướu" },
            new { Value = 7, Name = "Orthopedics", Display = "Chấn thương chỉnh hình" },
            new { Value = 8, Name = "Pediatrics", Display = "Nhi khoa" },
            new { Value = 9, Name = "Psychiatry", Display = "Tâm thần" },
            new { Value = 10, Name = "Radiology", Display = "Chẩn đoán hình ảnh" },
            new { Value = 11, Name = "Surgery", Display = "Phẫu thuật" },
            new { Value = 12, Name = "Urology", Display = "Tiết niệu" },
            new { Value = 13, Name = "Gynecology", Display = "Phụ khoa" },
            new { Value = 14, Name = "Ophthalmology", Display = "Mắt" },
            new { Value = 15, Name = "ENT", Display = "Tai mũi họng" },
            new { Value = 16, Name = "Dentistry", Display = "Nha khoa" },
            new { Value = 17, Name = "Physiotherapy", Display = "Vật lý trị liệu" },
            new { Value = 18, Name = "Psychology", Display = "Tâm lý" },
            new { Value = 19, Name = "Nutrition", Display = "Dinh dưỡng" }
        };

        return Ok(new { success = true, data = specializations, message = "Lấy danh sách chuyên khoa thành công" });
    }
}
