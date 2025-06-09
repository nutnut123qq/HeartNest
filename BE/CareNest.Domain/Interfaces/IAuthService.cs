using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IAuthService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
    string GenerateJwtToken(User user);
}
