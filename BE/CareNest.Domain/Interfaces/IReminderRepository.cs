using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IReminderRepository
{
    Task<Reminder?> GetByIdAsync(Guid id);
    Task<IEnumerable<Reminder>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetAssignedToUserAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetUpcomingAsync(Guid userId, int hours = 24);
    Task<IEnumerable<Reminder>> GetOverdueAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetTodayAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Reminder>> GetByTypeAsync(Guid userId, ReminderType type);
    Task<IEnumerable<Reminder>> GetActiveAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetCompletedAsync(Guid userId);
    Task<Reminder> CreateAsync(Reminder reminder);
    Task<Reminder> UpdateAsync(Reminder reminder);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetCountByUserAsync(Guid userId);
    Task<int> GetCompletedCountByUserAsync(Guid userId);
    Task<IEnumerable<Reminder>> SearchAsync(Guid userId, string searchTerm);

    // Admin/Nurse methods
    Task<int> GetTotalRemindersAsync();
    Task<int> GetActiveRemindersCountAsync();
    Task<IEnumerable<Reminder>> GetRemindersByAssignedUserAsync(Guid assignedUserId);
}
