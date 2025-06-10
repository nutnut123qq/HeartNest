using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IReminderService
{
    Task<Reminder?> GetByIdAsync(Guid id, Guid userId);
    Task<IEnumerable<Reminder>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetUpcomingAsync(Guid userId, int hours = 24);
    Task<IEnumerable<Reminder>> GetOverdueAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetTodayAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Reminder>> GetByTypeAsync(Guid userId, ReminderType type);
    Task<IEnumerable<Reminder>> GetActiveAsync(Guid userId);
    Task<IEnumerable<Reminder>> GetCompletedAsync(Guid userId);
    Task<Reminder> CreateAsync(Reminder reminder);
    Task<Reminder> UpdateAsync(Reminder reminder);
    Task DeleteAsync(Guid id, Guid userId);
    Task<Reminder> MarkAsCompletedAsync(Guid id, Guid userId);
    Task<Reminder> MarkAsIncompleteAsync(Guid id, Guid userId);
    Task<IEnumerable<Reminder>> SearchAsync(Guid userId, string searchTerm);
}
