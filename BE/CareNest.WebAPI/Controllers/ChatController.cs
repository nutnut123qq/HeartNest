using CareNest.Application.DTOs.Chat;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Infrastructure.Data;
using CareNest.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize] // Tạm thời comment để test
public class ChatController : ControllerBase
{
    private readonly IChatApplicationService _chatApplicationService;
    private readonly CareNestDbContext _context; // Cache test user to avoid repeated queries

    public ChatController(IChatApplicationService chatApplicationService, CareNestDbContext context)
    {
        _chatApplicationService = chatApplicationService;
        _context = context;
    }



    private async Task<User?> GetCurrentUserAsync()
    {
        try
        {
            // Try to get user from JWT token first using the correct claim
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user != null)
                {
                    Console.WriteLine($"Found authenticated user: {user.Id} ({user.Email.Value}) - Role: {user.Role}");
                    return user;
                }
                else
                {
                    Console.WriteLine($"User with ID {userId} not found in database");
                    return null; // Return null instead of test user
                }
            }
            else
            {
                Console.WriteLine("No NameIdentifier claim found in JWT token");
                Console.WriteLine($"Total claims count: {User.Claims.Count()}");
                Console.WriteLine("All claims:");
                foreach (var claim in User.Claims)
                {
                    Console.WriteLine($"  - Type: '{claim.Type}' = Value: '{claim.Value}'");
                }
                Console.WriteLine("Looking for these claim types:");
                Console.WriteLine($"  - ClaimTypes.NameIdentifier: '{System.Security.Claims.ClaimTypes.NameIdentifier}'");
                Console.WriteLine($"  - 'sub': {User.FindFirst("sub")?.Value ?? "Not found"}");
                Console.WriteLine($"  - 'nameid': {User.FindFirst("nameid")?.Value ?? "Not found"}");

                return null; // Return null instead of test user
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting current user: {ex.Message}");
            return null; // Return null instead of test user
        }
    }

    /// <summary>
    /// Get available healthcare providers for chat
    /// </summary>
    [HttpGet("providers")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> GetAvailableHealthcareProviders()
    {
        try
        {
            // Lấy từ bảng HealthcareProviders trước
            var healthcareProviders = await _context.HealthcareProviders
                .Where(h => h.IsActive)
                .Select(h => new
                {
                    id = h.Id,
                    fullName = h.FirstName + " " + h.LastName,
                    title = h.Title,
                    specialization = h.SubSpecialty ?? h.Specialization.ToString(),
                    yearsOfExperience = h.YearsOfExperience,
                    averageRating = h.AverageRating,
                    role = 1 // Healthcare provider role
                })
                .OrderBy(h => h.fullName)
                .ToListAsync();

            // Lấy IDs của HealthcareProviders để tránh duplicate
            var healthcareProviderIds = healthcareProviders.Select(h => h.id).ToHashSet();

            // Lấy providers từ bảng Users với role = 1 (chỉ những user chưa có trong HealthcareProviders)
            var userProviders = await _context.Users
                .Where(u => u.Role == Domain.Enums.UserRole.Nurse && u.IsActive && !u.IsDeleted && !healthcareProviderIds.Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    fullName = u.FirstName + " " + u.LastName,
                    title = "Nhân viên y tế",
                    specialization = "Tư vấn sức khỏe",
                    yearsOfExperience = 1,
                    averageRating = (decimal)5.0,
                    role = 1 // Healthcare provider role
                })
                .OrderBy(u => u.fullName)
                .ToListAsync();

            // Kết hợp cả hai danh sách (HealthcareProviders trước, Users sau)
            var allProviders = healthcareProviders.Concat(userProviders).ToList();

            // Frontend expect "success" field
            var result = new
            {
                success = true,
                isSuccess = true,
                message = "Healthcare providers retrieved successfully",
                data = allProviders,
                errors = new object[] { }
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }



    /// <summary>
    /// Create or get existing conversation with a healthcare provider
    /// </summary>
    [HttpPost("conversations")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> CreateOrGetConversation([FromBody] CreateConversationDto dto)
    {
        try
        {
            // Log để debug
            Console.WriteLine($"Received HealthcareProviderId: {dto.HealthcareProviderId}");

            // Kiểm tra xem provider có tồn tại không (trong cả Users và HealthcareProviders)
            var userProviderExists = await _context.Users.AnyAsync(u => u.Id == dto.HealthcareProviderId && u.Role == Domain.Enums.UserRole.Nurse && u.IsActive && !u.IsDeleted);
            var healthcareProviderExists = await _context.HealthcareProviders.AnyAsync(h => h.Id == dto.HealthcareProviderId && h.IsActive);

            var providerExists = userProviderExists || healthcareProviderExists;
            Console.WriteLine($"User provider exists: {userProviderExists}");
            Console.WriteLine($"Healthcare provider exists: {healthcareProviderExists}");
            Console.WriteLine($"Provider exists: {providerExists}");

            if (!providerExists)
            {
                return BadRequest($"Healthcare provider with ID {dto.HealthcareProviderId} not found");
            }

            // Nếu provider chỉ tồn tại trong Users, tạo record tương ứng trong HealthcareProviders
            if (userProviderExists && !healthcareProviderExists)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.HealthcareProviderId);
                if (user != null)
                {
                    var healthcareProvider = new Domain.Entities.HealthcareProvider
                    {
                        Id = user.Id, // Sử dụng cùng ID
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email.Value,
                        Title = "Nhân viên y tế",
                        Specialization = Domain.Enums.ProviderSpecialization.GeneralPractice,
                        YearsOfExperience = 1,
                        AverageRating = 5.0m,
                        IsActive = true,
                        IsVerified = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _context.HealthcareProviders.AddAsync(healthcareProvider);
                    await _context.SaveChangesAsync();
                }
            }

            // Use authenticated user instead of test user
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                Console.WriteLine("CreateOrGetConversation: No authenticated user found");
                return Unauthorized(new {
                    success = false,
                    message = "User not authenticated",
                    error = "AUTHENTICATION_REQUIRED"
                });
            }

            Console.WriteLine($"Creating conversation for user: {currentUser.Id} ({currentUser.Email.Value}) with provider: {dto.HealthcareProviderId}");

            var result = await _chatApplicationService.CreateOrGetConversationAsync(currentUser.Id, dto.HealthcareProviderId);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    /// <summary>
    /// Get user's conversations
    /// </summary>
    [HttpGet("conversations")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> GetUserConversations()
    {
        try
        {
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                return BadRequest("User not found");
            }

            Console.WriteLine($"Getting conversations for user: {currentUser.Id} ({currentUser.Email.Value})");
            var result = await _chatApplicationService.GetUserConversationsAsync(currentUser.Id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GetUserConversations error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Get specific conversation details
    /// </summary>
    [HttpGet("conversations/{conversationId}")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> GetConversation(Guid conversationId)
    {
        try
        {
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                Console.WriteLine("GetConversation: No authenticated user found");
                return Unauthorized(new {
                    success = false,
                    message = "User not authenticated",
                    error = "AUTHENTICATION_REQUIRED"
                });
            }

            Console.WriteLine($"Getting conversation {conversationId} for user: {currentUser.Id} ({currentUser.Email.Value})");
            var result = await _chatApplicationService.GetConversationAsync(conversationId, currentUser.Id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GetConversation error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Get messages for a conversation
    /// </summary>
    [HttpGet("conversations/{conversationId}/messages")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> GetConversationMessages(
        Guid conversationId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                return BadRequest("User not found");
            }

            Console.WriteLine($"Getting messages for conversation {conversationId}, user: {currentUser.Id} ({currentUser.Email.Value})");
            var result = await _chatApplicationService.GetConversationMessagesAsync(conversationId, currentUser.Id, page, pageSize);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GetConversationMessages error: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    /// <summary>
    /// Send a message
    /// </summary>
    [HttpPost("messages")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
    {
        try
        {


            // Use JWT authenticated user instead of test user
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                return BadRequest("User not authenticated");
            }

            var result = await _chatApplicationService.SendMessageAsync(dto, currentUser.Id);

            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    /// <summary>
    /// Mark messages as read
    /// </summary>
    [HttpPost("conversations/{conversationId}/mark-read")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> MarkMessagesAsRead(Guid conversationId)
    {
        // Tạm thời sử dụng test user
        var testEmail = new Domain.ValueObjects.Email("test@carenest.com");
        var testUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == testEmail);

        if (testUser == null)
        {
            return BadRequest("Test user not found");
        }

        var result = await _chatApplicationService.MarkMessagesAsReadAsync(conversationId, testUser.Id);

        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Start consultation
    /// </summary>
    [HttpPost("conversations/{conversationId}/start-consultation")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> StartConsultation(Guid conversationId)
    {
        // Tạm thời sử dụng test user
        var testEmail = new Domain.ValueObjects.Email("test@carenest.com");
        var testUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == testEmail);

        if (testUser == null)
        {
            return BadRequest("Test user not found");
        }

        // For now, just return success
        return Ok(new { success = true, message = "Consultation started" });
    }

    /// <summary>
    /// End consultation
    /// </summary>
    [HttpPost("conversations/{conversationId}/end-consultation")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> EndConsultation(Guid conversationId)
    {
        // Tạm thời sử dụng test user
        var testEmail = new Domain.ValueObjects.Email("test@carenest.com");
        var testUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == testEmail);

        if (testUser == null)
        {
            return BadRequest("Test user not found");
        }

        // For now, just return success
        return Ok(new { success = true, message = "Consultation ended" });
    }

    /// <summary>
    /// Cancel consultation
    /// </summary>
    [HttpPost("conversations/{conversationId}/cancel-consultation")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> CancelConsultation(Guid conversationId)
    {
        // Tạm thời sử dụng test user
        var testEmail = new Domain.ValueObjects.Email("test@carenest.com");
        var testUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == testEmail);

        if (testUser == null)
        {
            return BadRequest("Test user not found");
        }

        // For now, just return success
        return Ok(new { success = true, message = "Consultation cancelled" });
    }

    /// <summary>
    /// Get current user info for testing
    /// </summary>
    [HttpGet("current-user")]
    [AllowAnonymous] // Tạm thời để test
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                return Unauthorized(new {
                    success = false,
                    message = "No authenticated user found",
                    error = "AUTHENTICATION_REQUIRED"
                });
            }
            return Ok(new {
                success = true,
                id = currentUser.Id,
                firstName = currentUser.FirstName,
                lastName = currentUser.LastName,
                email = currentUser.Email.Value,
                role = currentUser.Role.ToString()
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new {
                success = false,
                message = $"Internal server error: {ex.Message}"
            });
        }
    }
}

public class CreateConversationDto
{
    public Guid HealthcareProviderId { get; set; }
}
