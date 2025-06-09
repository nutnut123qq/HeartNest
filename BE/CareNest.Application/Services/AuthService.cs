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
            IsEmailVerified = user.IsEmailVerified,
            CreatedAt = user.CreatedAt
        };
    }
}
