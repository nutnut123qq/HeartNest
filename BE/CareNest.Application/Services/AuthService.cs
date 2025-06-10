using BCrypt.Net;
using CareNest.Application.Common;
using CareNest.Application.DTOs.Auth;
using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Domain.ValueObjects;

namespace CareNest.Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authDomainService;

    public AuthService(IUserRepository userRepository, IAuthService authDomainService)
    {
        _userRepository = userRepository;
        _authDomainService = authDomainService;
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        try
        {
            var email = new Email(request.Email);
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
            {
                return ApiResponse<AuthResponse>.ErrorResult("Email hoặc mật khẩu không chính xác");
            }

            if (!user.IsActive)
            {
                return ApiResponse<AuthResponse>.ErrorResult("Tài khoản đã bị vô hiệu hóa");
            }

            if (!_authDomainService.VerifyPassword(request.Password, user.PasswordHash))
            {
                return ApiResponse<AuthResponse>.ErrorResult("Email hoặc mật khẩu không chính xác");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            var token = _authDomainService.GenerateJwtToken(user);
            var response = new AuthResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user)
            };

            return ApiResponse<AuthResponse>.SuccessResult(response, "Đăng nhập thành công");
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<AuthResponse>.ErrorResult(ex.Message);
        }
        catch (Exception)
        {
            return ApiResponse<AuthResponse>.ErrorResult("Có lỗi xảy ra trong quá trình đăng nhập");
        }
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        try
        {
            var email = new Email(request.Email);
            
            if (await _userRepository.ExistsByEmailAsync(email))
            {
                return ApiResponse<AuthResponse>.ErrorResult("Email đã được sử dụng");
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = email,
                PasswordHash = _authDomainService.HashPassword(request.Password),
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                Role = Domain.Enums.UserRole.User, // Default role
                IsEmailVerified = false,
                IsActive = true
            };

            var createdUser = await _userRepository.CreateAsync(user);
            var token = _authDomainService.GenerateJwtToken(createdUser);
            
            var response = new AuthResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(createdUser)
            };

            return ApiResponse<AuthResponse>.SuccessResult(response, "Đăng ký thành công");
        }
        catch (ArgumentException ex)
        {
            return ApiResponse<AuthResponse>.ErrorResult(ex.Message);
        }
        catch (Exception)
        {
            return ApiResponse<AuthResponse>.ErrorResult("Có lỗi xảy ra trong quá trình đăng ký");
        }
    }

    public async Task<ApiResponse<string>> CreateAdminUserAsync()
    {
        try
        {
            var adminEmail = new Email("admin@carenest.com");

            if (await _userRepository.ExistsByEmailAsync(adminEmail))
            {
                return ApiResponse<string>.ErrorResult("Admin user already exists");
            }

            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "CareNest",
                Email = adminEmail,
                PasswordHash = _authDomainService.HashPassword("admin123"),
                Role = Domain.Enums.UserRole.Admin,
                IsEmailVerified = true,
                IsActive = true
            };

            await _userRepository.CreateAsync(adminUser);
            return ApiResponse<string>.SuccessResult("Admin user created successfully", "Admin user created");
        }
        catch (Exception)
        {
            return ApiResponse<string>.ErrorResult("Error creating admin user");
        }
    }

    public async Task<ApiResponse<string>> CreateNurseUserAsync()
    {
        try
        {
            var nurseEmail = new Email("nurse@carenest.com");

            if (await _userRepository.ExistsByEmailAsync(nurseEmail))
            {
                return ApiResponse<string>.ErrorResult("Nurse user already exists");
            }

            var nurseUser = new User
            {
                FirstName = "Nurse",
                LastName = "Test",
                Email = nurseEmail,
                PasswordHash = _authDomainService.HashPassword("nurse123"),
                Role = Domain.Enums.UserRole.Nurse,
                IsEmailVerified = true,
                IsActive = true
            };

            await _userRepository.CreateAsync(nurseUser);
            return ApiResponse<string>.SuccessResult("Nurse user created successfully", "Nurse user created");
        }
        catch (Exception)
        {
            return ApiResponse<string>.ErrorResult("Error creating nurse user");
        }
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            Email = user.Email.Value,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            CreatedAt = user.CreatedAt
        };
    }
}
