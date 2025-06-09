using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace CareNest.Application.Attributes;

public class PasswordValidationAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is not string password)
            return false;

        if (string.IsNullOrWhiteSpace(password))
            return false;

        if (password.Length < 6)
            return false;

        // Check for at least one lowercase letter
        if (!Regex.IsMatch(password, @"[a-z]"))
            return false;

        // Check for at least one uppercase letter
        if (!Regex.IsMatch(password, @"[A-Z]"))
            return false;

        // Check for at least one digit
        if (!Regex.IsMatch(password, @"\d"))
            return false;

        // Check for at least one special character (more permissive)
        if (!Regex.IsMatch(password, @"[^a-zA-Z0-9]"))
            return false;

        return true;
    }

    public override string FormatErrorMessage(string name)
    {
        return "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
    }
}
