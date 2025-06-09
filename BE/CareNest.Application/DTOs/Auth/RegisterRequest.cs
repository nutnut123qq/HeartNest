using System.ComponentModel.DataAnnotations;
using CareNest.Application.Attributes;

namespace CareNest.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "Họ là bắt buộc")]
    [StringLength(50, ErrorMessage = "Họ không được vượt quá 50 ký tự")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên là bắt buộc")]
    [StringLength(50, ErrorMessage = "Tên không được vượt quá 50 ký tự")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
    [PasswordValidation]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
    [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string? PhoneNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [RegularExpression("^(Nam|Nữ|Khác)$", ErrorMessage = "Giới tính phải là Nam, Nữ hoặc Khác")]
    public string? Gender { get; set; }
}
