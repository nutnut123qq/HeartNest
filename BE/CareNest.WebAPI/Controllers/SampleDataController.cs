using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/sample-data")]
[AllowAnonymous] // For demo purposes
public class SampleDataController : ControllerBase
{
    private readonly CareNestDbContext _context;

    public SampleDataController(CareNestDbContext context)
    {
        _context = context;
    }

    [HttpPost("healthcare")]
    public async Task<IActionResult> CreateHealthcareSampleData()
    {
        try
        {
            // Check if data already exists
            if (_context.HealthcareFacilities.Any())
            {
                return Ok(new { message = "Sample data already exists" });
            }

            // Create sample facilities
            var facilities = new List<HealthcareFacility>
            {
                new HealthcareFacility
                {
                    Name = "Bệnh viện Đa khoa Thành phố",
                    Type = HealthcareFacilityType.Hospital,
                    Description = "Bệnh viện đa khoa hàng đầu với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.",
                    Address = "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
                    Phone = "028-3822-1234",
                    Email = "info@bvdktp.vn",
                    Website = "https://bvdktp.vn",
                    Latitude = 10.7769,
                    Longitude = 106.7009,
                    OperatingHours = JsonSerializer.Serialize(new[] { "Thứ 2-6: 7:00-17:00", "Thứ 7: 7:00-12:00", "Chủ nhật: Nghỉ" }),
                    Services = JsonSerializer.Serialize(new[] { "Khám tổng quát", "Xét nghiệm", "Chẩn đoán hình ảnh", "Phẫu thuật", "Cấp cứu 24/7" }),
                    Images = JsonSerializer.Serialize(new[] { "/images/hospital1.jpg" }),
                    IsVerified = true,
                    AverageRating = 4.5m,
                    ReviewCount = 128
                },
                new HealthcareFacility
                {
                    Name = "Phòng khám Đa khoa An Khang",
                    Type = HealthcareFacilityType.Clinic,
                    Description = "Phòng khám đa khoa với dịch vụ chăm sóc sức khỏe toàn diện cho gia đình.",
                    Address = "456 Đường Lê Lợi, Quận 3, TP.HCM",
                    Phone = "028-3933-5678",
                    Email = "contact@ankhang.vn",
                    Latitude = 10.7756,
                    Longitude = 106.6934,
                    OperatingHours = JsonSerializer.Serialize(new[] { "Thứ 2-7: 8:00-20:00", "Chủ nhật: 8:00-17:00" }),
                    Services = JsonSerializer.Serialize(new[] { "Khám nội khoa", "Khám nhi khoa", "Khám phụ khoa", "Tiêm chủng", "Tư vấn dinh dưỡng" }),
                    Images = JsonSerializer.Serialize(new[] { "/images/clinic1.jpg" }),
                    IsVerified = true,
                    AverageRating = 4.2m,
                    ReviewCount = 89
                },
                new HealthcareFacility
                {
                    Name = "Nhà thuốc FPT Long Châu",
                    Type = HealthcareFacilityType.Pharmacy,
                    Description = "Chuỗi nhà thuốc uy tín với đầy đủ các loại thuốc và sản phẩm chăm sóc sức khỏe.",
                    Address = "789 Đường Võ Văn Tần, Quận 3, TP.HCM",
                    Phone = "028-3829-9999",
                    Email = "info@fptlongchau.vn",
                    Website = "https://nhathuoclongchau.com.vn",
                    Latitude = 10.7784,
                    Longitude = 106.6917,
                    OperatingHours = JsonSerializer.Serialize(new[] { "Thứ 2-7: 7:00-22:00", "Chủ nhật: 8:00-21:00" }),
                    Services = JsonSerializer.Serialize(new[] { "Bán thuốc theo toa", "Thuốc không kê đơn", "Sản phẩm chăm sóc sức khỏe", "Tư vấn dược sĩ", "Giao thuốc tận nhà" }),
                    Images = JsonSerializer.Serialize(new[] { "/images/pharmacy1.jpg" }),
                    IsVerified = true,
                    AverageRating = 4.3m,
                    ReviewCount = 156
                }
            };

            _context.HealthcareFacilities.AddRange(facilities);
            await _context.SaveChangesAsync();

            // Create sample providers
            var providers = new List<HealthcareProvider>
            {
                new HealthcareProvider
                {
                    FirstName = "Nguyễn Văn",
                    LastName = "Minh",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Cardiology,
                    SubSpecialty = "Tim mạch can thiệp",
                    LicenseNumber = "BS001234",
                    YearsOfExperience = 15,
                    Qualifications = JsonSerializer.Serialize(new[] { "Bác sĩ Đa khoa - ĐH Y Dược TP.HCM", "Thạc sĩ Tim mạch - ĐH Y Dược TP.HCM", "Chứng chỉ Tim mạch can thiệp - Bệnh viện Chợ Rẫy" }),
                    Biography = "Bác sĩ Nguyễn Văn Minh có hơn 15 năm kinh nghiệm trong lĩnh vực tim mạch, đặc biệt là tim mạch can thiệp. Đã thực hiện hơn 2000 ca can thiệp tim mạch thành công.",
                    Phone = "0901-234-567",
                    Email = "bs.minh@bvdktp.vn",
                    ConsultationFees = JsonSerializer.Serialize(new Dictionary<string, decimal> { { "Khám tổng quát", 300000 }, { "Khám chuyên khoa", 500000 }, { "Tái khám", 200000 } }),
                    Availability = JsonSerializer.Serialize(new Dictionary<string, List<string>> { { "Thứ 2", new List<string> { "8:00-12:00", "14:00-17:00" } }, { "Thứ 4", new List<string> { "8:00-12:00" } }, { "Thứ 6", new List<string> { "14:00-17:00" } } }),
                    Languages = JsonSerializer.Serialize(new[] { "Tiếng Việt", "English" }),
                    PrimaryFacilityId = facilities[0].Id,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.7m,
                    ReviewCount = 45
                },
                new HealthcareProvider
                {
                    FirstName = "Trần Thị",
                    LastName = "Lan",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Pediatrics,
                    SubSpecialty = "Nhi khoa tổng quát",
                    LicenseNumber = "BS005678",
                    YearsOfExperience = 12,
                    Qualifications = JsonSerializer.Serialize(new[] { "Bác sĩ Đa khoa - ĐH Y Dược Cần Thơ", "Chuyên khoa I Nhi khoa - ĐH Y Dược TP.HCM", "Chứng chỉ Dinh dưỡng trẻ em" }),
                    Biography = "Bác sĩ Trần Thị Lan chuyên về chăm sóc sức khỏe trẻ em với 12 năm kinh nghiệm. Đặc biệt quan tâm đến dinh dưỡng và phát triển của trẻ.",
                    Phone = "0902-345-678",
                    Email = "bs.lan@ankhang.vn",
                    ConsultationFees = JsonSerializer.Serialize(new Dictionary<string, decimal> { { "Khám nhi khoa", 250000 }, { "Tư vấn dinh dưỡng", 200000 }, { "Tiêm chủng", 150000 } }),
                    Availability = JsonSerializer.Serialize(new Dictionary<string, List<string>> { { "Thứ 2", new List<string> { "8:00-12:00" } }, { "Thứ 3", new List<string> { "14:00-18:00" } }, { "Thứ 5", new List<string> { "8:00-12:00", "14:00-18:00" } }, { "Thứ 7", new List<string> { "8:00-12:00" } } }),
                    Languages = JsonSerializer.Serialize(new[] { "Tiếng Việt" }),
                    PrimaryFacilityId = facilities[1].Id,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.6m,
                    ReviewCount = 67
                },
                new HealthcareProvider
                {
                    FirstName = "Lê Hoàng",
                    LastName = "Phúc",
                    Title = "Dược sĩ",
                    Specialization = ProviderSpecialization.GeneralPractice,
                    SubSpecialty = "Tư vấn dược",
                    LicenseNumber = "DS001122",
                    YearsOfExperience = 8,
                    Qualifications = JsonSerializer.Serialize(new[] { "Dược sĩ Đại học - ĐH Dược TP.HCM", "Chứng chỉ Tư vấn dược lâm sàng", "Chứng chỉ Quản lý chất lượng thuốc" }),
                    Biography = "Dược sĩ Lê Hoàng Phúc có 8 năm kinh nghiệm trong lĩnh vực dược phẩm và tư vấn sử dụng thuốc an toàn, hiệu quả.",
                    Phone = "0903-456-789",
                    Email = "ds.phuc@fptlongchau.vn",
                    ConsultationFees = JsonSerializer.Serialize(new Dictionary<string, decimal> { { "Tư vấn dược", 100000 }, { "Kiểm tra tương tác thuốc", 50000 } }),
                    Availability = JsonSerializer.Serialize(new Dictionary<string, List<string>> { { "Thứ 2-6", new List<string> { "8:00-17:00" } }, { "Thứ 7", new List<string> { "8:00-12:00" } } }),
                    Languages = JsonSerializer.Serialize(new[] { "Tiếng Việt", "English" }),
                    PrimaryFacilityId = facilities[2].Id,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.4m,
                    ReviewCount = 23
                }
            };

            _context.HealthcareProviders.AddRange(providers);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Sample healthcare data created successfully",
                facilities = facilities.Count,
                providers = providers.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error creating sample data", error = ex.Message });
        }
    }

    [HttpDelete("healthcare")]
    public async Task<IActionResult> DeleteHealthcareSampleData()
    {
        try
        {
            _context.ProviderReviews.RemoveRange(_context.ProviderReviews);
            _context.FacilityReviews.RemoveRange(_context.FacilityReviews);
            _context.ProviderFacilities.RemoveRange(_context.ProviderFacilities);
            _context.HealthcareProviders.RemoveRange(_context.HealthcareProviders);
            _context.HealthcareFacilities.RemoveRange(_context.HealthcareFacilities);
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sample healthcare data deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error deleting sample data", error = ex.Message });
        }
    }
}
