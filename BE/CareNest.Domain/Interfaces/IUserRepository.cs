using CareNest.Domain.Entities;
using CareNest.Domain.ValueObjects;

namespace CareNest.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(Email email);
    Task<bool> ExistsByEmailAsync(Email email);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
}
