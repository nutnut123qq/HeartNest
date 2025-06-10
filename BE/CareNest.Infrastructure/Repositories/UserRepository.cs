using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.Domain.ValueObjects;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly CareNestDbContext _context;

    public UserRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(Email email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> ExistsByEmailAsync(Email email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);
        if (user != null)
        {
            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
    {
        return await _context.Users
            .Where(u => u.Role == role)
            .ToListAsync();
    }

    public async Task<int> GetUsersByRoleCountAsync(UserRole role)
    {
        return await _context.Users
            .CountAsync(u => u.Role == role);
    }

    public async Task<int> GetTotalUsersAsync()
    {
        return await _context.Users.CountAsync();
    }

    public async Task<object> GetUsersWithPaginationAsync(int page, int pageSize)
    {
        var totalUsers = await _context.Users.CountAsync();
        var users = await _context.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email.Value,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return new
        {
            Users = users,
            TotalUsers = totalUsers,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalUsers / pageSize)
        };
    }
}
