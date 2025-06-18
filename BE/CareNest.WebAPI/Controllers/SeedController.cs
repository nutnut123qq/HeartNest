using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly CareNestDbContext _context;

    public SeedController(CareNestDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Tạo dữ liệu mẫu cho healthcare providers
    /// </summary>
    [HttpPost("healthcare-providers")]
    [AllowAnonymous] // Tạm thời cho phép anonymous để test
    public async Task<IActionResult> SeedHealthcareProviders()
    {
        try
        {
            // Kiểm tra xem đã có dữ liệu chưa
            var existingProviders = await _context.HealthcareProviders.CountAsync();
            if (existingProviders > 0)
            {
                return BadRequest("Dữ liệu healthcare providers đã tồn tại");
            }

            // Tạo cơ sở y tế mẫu
            var facilities = new List<HealthcareFacility>
            {
                new HealthcareFacility
                {
                    Id = Guid.NewGuid(),
                    Name = "Bệnh viện Đa khoa Thành phố",
                    Type = HealthcareFacilityType.Hospital,
                    Address = "123 Đường Lê Lợi, Quận 1, Hồ Chí Minh",
                    Phone = "028-1234-5678",
                    Email = "info@bvdktphcm.com",
                    Website = "https://bvdktphcm.com",
                    Description = "Bệnh viện đa khoa hàng đầu thành phố",
                    Services = "[\"Khám tổng quát\", \"Nội khoa\", \"Ngoại khoa\", \"Sản phụ khoa\"]",
                    Images = "[]",
                    OperatingHours = "{\"monday\": \"06:00-22:00\", \"tuesday\": \"06:00-22:00\", \"wednesday\": \"06:00-22:00\", \"thursday\": \"06:00-22:00\", \"friday\": \"06:00-22:00\", \"saturday\": \"06:00-18:00\", \"sunday\": \"08:00-16:00\"}",
                    Latitude = 10.7769,
                    Longitude = 106.7009,
                    IsActive = true,
                    IsVerified = true,
                    AverageRating = 4.5m,
                    ReviewCount = 150
                },
                new HealthcareFacility
                {
                    Id = Guid.NewGuid(),
                    Name = "Phòng khám Đa khoa An Khang",
                    Type = HealthcareFacilityType.Clinic,
                    Address = "456 Đường Nguyễn Trãi, Quận 5, Hồ Chí Minh",
                    Phone = "028-9876-5432",
                    Email = "info@pkankhang.com",
                    Website = "https://pkankhang.com",
                    Description = "Phòng khám chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm",
                    Services = "[\"Tim mạch\", \"Tiêu hóa\", \"Thần kinh\"]",
                    Images = "[]",
                    OperatingHours = "{\"monday\": \"07:00-19:00\", \"tuesday\": \"07:00-19:00\", \"wednesday\": \"07:00-19:00\", \"thursday\": \"07:00-19:00\", \"friday\": \"07:00-19:00\", \"saturday\": \"07:00-17:00\"}",
                    Latitude = 10.7589,
                    Longitude = 106.6820,
                    IsActive = true,
                    IsVerified = true,
                    AverageRating = 4.2m,
                    ReviewCount = 89
                }
            };

            await _context.HealthcareFacilities.AddRangeAsync(facilities);
            await _context.SaveChangesAsync();

            // Tạo healthcare providers
            var providers = new List<HealthcareProvider>
            {
                new HealthcareProvider
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Nguyễn",
                    LastName = "Văn An",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Cardiology,
                    SubSpecialty = "Tim mạch can thiệp",
                    LicenseNumber = "BS001234",
                    YearsOfExperience = 15,
                    Qualifications = "[\"Đại học Y Hà Nội\", \"Chuyên khoa Tim mạch\", \"Chứng chỉ Can thiệp tim mạch\"]",
                    Biography = "Bác sĩ có 15 năm kinh nghiệm trong lĩnh vực tim mạch, chuyên về can thiệp tim mạch và điều trị các bệnh lý tim phức tạp.",
                    Phone = "0901-234-567",
                    Email = "bs.nguyenvanan@bvdktphcm.com",
                    ConsultationFees = "{\"consultation\": 500000, \"followup\": 300000}",
                    Availability = "{\"monday\": \"08:00-17:00\", \"tuesday\": \"08:00-17:00\", \"wednesday\": \"08:00-17:00\", \"thursday\": \"08:00-17:00\", \"friday\": \"08:00-17:00\"}",
                    Languages = "[\"Tiếng Việt\", \"English\"]",
                    IsActive = true,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.8m,
                    ReviewCount = 45,
                    PrimaryFacilityId = facilities[0].Id
                },
                new HealthcareProvider
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Trần",
                    LastName = "Thị Bình",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Pediatrics,
                    SubSpecialty = "Nhi khoa tổng quát",
                    LicenseNumber = "BS005678",
                    YearsOfExperience = 12,
                    Qualifications = "[\"Đại học Y Thành phố Hồ Chí Minh\", \"Chuyên khoa Nhi\", \"Chứng chỉ Sơ cứu nhi khoa\"]",
                    Biography = "Bác sĩ chuyên khoa Nhi với 12 năm kinh nghiệm, tận tâm chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi.",
                    Phone = "0902-345-678",
                    Email = "bs.tranthibinh@pkankhang.com",
                    ConsultationFees = "{\"consultation\": 400000, \"followup\": 250000}",
                    Availability = "{\"monday\": \"07:30-16:30\", \"tuesday\": \"07:30-16:30\", \"wednesday\": \"07:30-16:30\", \"thursday\": \"07:30-16:30\", \"friday\": \"07:30-16:30\", \"saturday\": \"07:30-12:00\"}",
                    Languages = "[\"Tiếng Việt\"]",
                    IsActive = true,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.7m,
                    ReviewCount = 67,
                    PrimaryFacilityId = facilities[1].Id
                },
                new HealthcareProvider
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Lê",
                    LastName = "Minh Cường",
                    Title = "Tiến sĩ",
                    Specialization = ProviderSpecialization.Neurology,
                    SubSpecialty = "Thần kinh học",
                    LicenseNumber = "BS009012",
                    YearsOfExperience = 18,
                    Qualifications = "[\"Đại học Y Hà Nội\", \"Tiến sĩ Thần kinh học\", \"Chứng chỉ Điện não đồ\", \"Chứng chỉ Siêu âm Doppler\"]",
                    Biography = "Tiến sĩ Thần kinh học với 18 năm kinh nghiệm, chuyên điều trị các bệnh lý thần kinh phức tạp và đau đầu.",
                    Phone = "0903-456-789",
                    Email = "ts.leminhcuong@bvdktphcm.com",
                    ConsultationFees = "{\"consultation\": 600000, \"followup\": 400000}",
                    Availability = "{\"tuesday\": \"08:00-17:00\", \"wednesday\": \"08:00-17:00\", \"thursday\": \"08:00-17:00\", \"friday\": \"08:00-17:00\", \"saturday\": \"08:00-12:00\"}",
                    Languages = "[\"Tiếng Việt\", \"English\", \"Français\"]",
                    IsActive = true,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.9m,
                    ReviewCount = 32,
                    PrimaryFacilityId = facilities[0].Id
                },
                new HealthcareProvider
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Phạm",
                    LastName = "Thị Dung",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Gynecology,
                    SubSpecialty = "Sản phụ khoa",
                    LicenseNumber = "BS003456",
                    YearsOfExperience = 10,
                    Qualifications = "[\"Đại học Y Thành phố Hồ Chí Minh\", \"Chuyên khoa Sản phụ khoa\", \"Chứng chỉ Siêu âm thai\"]",
                    Biography = "Bác sĩ chuyên khoa Sản phụ khoa với 10 năm kinh nghiệm, chuyên về thai sản và các vấn đề sức khỏe phụ nữ.",
                    Phone = "0904-567-890",
                    Email = "bs.phamthidung@pkankhang.com",
                    ConsultationFees = "{\"consultation\": 450000, \"followup\": 300000}",
                    Availability = "{\"monday\": \"08:00-17:00\", \"tuesday\": \"08:00-17:00\", \"wednesday\": \"08:00-17:00\", \"thursday\": \"08:00-17:00\", \"friday\": \"08:00-17:00\"}",
                    Languages = "[\"Tiếng Việt\"]",
                    IsActive = true,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.6m,
                    ReviewCount = 58,
                    PrimaryFacilityId = facilities[1].Id
                },
                new HealthcareProvider
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Hoàng",
                    LastName = "Văn Em",
                    Title = "Bác sĩ",
                    Specialization = ProviderSpecialization.Orthopedics,
                    SubSpecialty = "Chấn thương thể thao",
                    LicenseNumber = "BS007890",
                    YearsOfExperience = 8,
                    Qualifications = "[\"Đại học Y Hà Nội\", \"Chuyên khoa Chấn thương chỉnh hình\", \"Chứng chỉ Y học thể thao\"]",
                    Biography = "Bác sĩ chuyên khoa Chấn thương chỉnh hình với 8 năm kinh nghiệm, đặc biệt về chấn thương thể thao và phục hồi chức năng.",
                    Phone = "0905-678-901",
                    Email = "bs.hoangvanem@bvdktphcm.com",
                    ConsultationFees = "{\"consultation\": 400000, \"followup\": 250000}",
                    Availability = "{\"monday\": \"13:00-20:00\", \"tuesday\": \"13:00-20:00\", \"wednesday\": \"13:00-20:00\", \"thursday\": \"13:00-20:00\", \"friday\": \"13:00-20:00\", \"saturday\": \"08:00-12:00\"}",
                    Languages = "[\"Tiếng Việt\", \"English\"]",
                    IsActive = true,
                    IsVerified = true,
                    AcceptsNewPatients = true,
                    AverageRating = 4.5m,
                    ReviewCount = 41,
                    PrimaryFacilityId = facilities[0].Id
                }
            };

            await _context.HealthcareProviders.AddRangeAsync(providers);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Đã tạo thành công dữ liệu healthcare providers", 
                facilitiesCount = facilities.Count,
                providersCount = providers.Count 
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi khi tạo dữ liệu: {ex.Message}");
        }
    }

    /// <summary>
    /// Tạo dữ liệu mẫu cho users với role Doctor/Nurse
    /// </summary>
    [HttpPost("users")]
    [AllowAnonymous]
    public async Task<IActionResult> SeedUsers()
    {
        try
        {
            // Tạo một số user với role Doctor/Nurse để test chat
            var users = new List<User>
            {
                new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Nguyễn",
                    LastName = "Văn Bác Sĩ",
                    Email = new Domain.ValueObjects.Email("doctor1@carenest.com"),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = Domain.Enums.UserRole.Nurse, // Role = 1
                    IsActive = true,
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Trần",
                    LastName = "Thị Y Tá",
                    Email = new Domain.ValueObjects.Email("nurse1@carenest.com"),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = Domain.Enums.UserRole.Nurse, // Role = 1
                    IsActive = true,
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Lê",
                    LastName = "Minh Bác Sĩ",
                    Email = new Domain.ValueObjects.Email("doctor2@carenest.com"),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Role = Domain.Enums.UserRole.Nurse, // Role = 1
                    IsActive = true,
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await _context.Users.AddRangeAsync(users);
            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Đã tạo thành công dữ liệu users",
                usersCount = users.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi khi tạo dữ liệu users: {ex.Message}");
        }
    }

    /// <summary>
    /// Tạo user test để chat
    /// </summary>
    [HttpPost("test-user")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateTestUser()
    {
        try
        {
            // Kiểm tra xem đã có user test chưa
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email.Value == "test@carenest.com");
            if (existingUser != null)
            {
                return Ok(new {
                    message = "User test đã tồn tại",
                    userId = existingUser.Id,
                    email = existingUser.Email.Value
                });
            }

            var testUser = new User
            {
                Id = Guid.NewGuid(),
                FirstName = "Test",
                LastName = "User",
                Email = new Domain.ValueObjects.Email("test@carenest.com"),
                PasswordHash = "test123", // Simplified for testing
                Role = Domain.Enums.UserRole.User, // Role = 0
                IsActive = true,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(testUser);
            await _context.SaveChangesAsync();

            return Ok(new {
                message = "Đã tạo user test thành công",
                userId = testUser.Id,
                email = testUser.Email.Value
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi khi tạo user test: {ex.Message}");
        }
    }

    /// <summary>
    /// Test endpoint để kiểm tra dữ liệu providers
    /// </summary>
    [HttpGet("test-providers")]
    [AllowAnonymous]
    public async Task<IActionResult> TestProviders()
    {
        try
        {
            var providers = await _context.HealthcareProviders.ToListAsync();
            var nurseUsers = await _context.Users.Where(u => u.Role == Domain.Enums.UserRole.Nurse).ToListAsync();

            return Ok(new {
                message = "Dữ liệu providers hiện tại",
                healthcareProvidersCount = providers.Count,
                nurseUsersCount = nurseUsers.Count,
                healthcareProviders = providers.Select(p => new { p.Id, p.FirstName, p.LastName, p.Specialization }),
                nurseUsers = nurseUsers.Select(u => new { u.Id, u.FirstName, u.LastName, u.Role })
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi khi kiểm tra dữ liệu: {ex.Message}");
        }
    }

    /// <summary>
    /// Xóa tất cả dữ liệu healthcare providers (chỉ dùng để test)
    /// </summary>
    [HttpDelete("healthcare-providers")]
    [AllowAnonymous]
    public async Task<IActionResult> ClearHealthcareProviders()
    {
        try
        {
            var providers = await _context.HealthcareProviders.ToListAsync();
            var facilities = await _context.HealthcareFacilities.ToListAsync();
            
            _context.HealthcareProviders.RemoveRange(providers);
            _context.HealthcareFacilities.RemoveRange(facilities);
            
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Đã xóa tất cả dữ liệu healthcare providers",
                providersRemoved = providers.Count,
                facilitiesRemoved = facilities.Count
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Lỗi khi xóa dữ liệu: {ex.Message}");
        }
    }
}
