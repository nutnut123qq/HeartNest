using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class ReminderRepository : IReminderRepository
{
    private readonly CareNestDbContext _context;

    public ReminderRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<Reminder?> GetByIdAsync(Guid id)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Reminder>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => r.UserId == userId)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetAssignedToUserAsync(Guid userId)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => r.AssignedToUserId == userId)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetUpcomingAsync(Guid userId, int hours = 24)
    {
        var now = DateTime.UtcNow;
        var endTime = now.AddHours(hours);

        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       !r.IsCompleted &&
                       r.IsActive &&
                       r.ScheduledAt >= now &&
                       r.ScheduledAt <= endTime)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetOverdueAsync(Guid userId)
    {
        var now = DateTime.UtcNow;

        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       !r.IsCompleted &&
                       r.IsActive &&
                       r.ScheduledAt < now)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetTodayAsync(Guid userId)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.IsActive &&
                       r.ScheduledAt >= today &&
                       r.ScheduledAt < tomorrow)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.IsActive &&
                       r.ScheduledAt >= startDate &&
                       r.ScheduledAt <= endDate)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetByTypeAsync(Guid userId, ReminderType type)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.Type == type &&
                       r.IsActive)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetActiveAsync(Guid userId)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.IsActive &&
                       !r.IsCompleted)
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reminder>> GetCompletedAsync(Guid userId)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.IsCompleted)
            .OrderByDescending(r => r.CompletedAt)
            .ToListAsync();
    }

    public async Task<Reminder> CreateAsync(Reminder reminder)
    {
        _context.Reminders.Add(reminder);
        await _context.SaveChangesAsync();
        return reminder;
    }

    public async Task<Reminder> UpdateAsync(Reminder reminder)
    {
        reminder.UpdatedAt = DateTime.UtcNow;
        _context.Reminders.Update(reminder);
        await _context.SaveChangesAsync();
        return reminder;
    }

    public async Task DeleteAsync(Guid id)
    {
        var reminder = await _context.Reminders.FindAsync(id);
        if (reminder != null)
        {
            _context.Reminders.Remove(reminder);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Reminders.AnyAsync(r => r.Id == id);
    }

    public async Task<int> GetCountByUserAsync(Guid userId)
    {
        return await _context.Reminders
            .CountAsync(r => (r.UserId == userId || r.AssignedToUserId == userId) && r.IsActive);
    }

    public async Task<int> GetCompletedCountByUserAsync(Guid userId)
    {
        return await _context.Reminders
            .CountAsync(r => (r.UserId == userId || r.AssignedToUserId == userId) && r.IsCompleted);
    }

    public async Task<IEnumerable<Reminder>> SearchAsync(Guid userId, string searchTerm)
    {
        return await _context.Reminders
            .Include(r => r.User)
            .Include(r => r.AssignedToUser)
            .Where(r => (r.UserId == userId || r.AssignedToUserId == userId) &&
                       r.IsActive &&
                       (r.Title.Contains(searchTerm) ||
                        (r.Description != null && r.Description.Contains(searchTerm)) ||
                        (r.MedicationName != null && r.MedicationName.Contains(searchTerm)) ||
                        (r.DoctorName != null && r.DoctorName.Contains(searchTerm))))
            .OrderBy(r => r.ScheduledAt)
            .ToListAsync();
    }
}
