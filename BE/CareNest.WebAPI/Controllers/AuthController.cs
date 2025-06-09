using CareNest.Application.DTOs.Auth;
using CareNest.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Đăng nhập người dùng
    /// </summary>
    /// <param name="request">Thông tin đăng nhập</param>
    /// <returns>Token và thông tin người dùng</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors });
        }

        var result = await _authService.LoginAsync(request);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Đăng ký người dùng mới
    /// </summary>
    /// <param name="request">Thông tin đăng ký</param>
    /// <returns>Token và thông tin người dùng</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors });
        }

        var result = await _authService.RegisterAsync(request);
        
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
