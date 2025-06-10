using CareNest.Application.DTOs.Reminder;
using CareNest.Domain.Entities;

namespace CareNest.Application.Interfaces;

public interface IReminderApplicationService
{
    Task<ReminderResponse> GetByIdAsync(Guid id, Guid userId);
    Task<IEnumerable<ReminderResponse>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<ReminderResponse>> GetUpcomingAsync(Guid userId, int hours = 24);
    Task<IEnumerable<ReminderResponse>> GetOverdueAsync(Guid userId);
    Task<IEnumerable<ReminderResponse>> GetTodayAsync(Guid userId);
    Task<IEnumerable<ReminderResponse>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<ReminderResponse>> GetByTypeAsync(Guid userId, ReminderType type);
    Task<IEnumerable<ReminderResponse>> GetActiveAsync(Guid userId);
    Task<IEnumerable<ReminderResponse>> GetCompletedAsync(Guid userId);
    Task<ReminderResponse> CreateAsync(CreateReminderRequest request, Guid userId);
    Task<ReminderResponse> UpdateAsync(Guid id, UpdateReminderRequest request, Guid userId);
    Task DeleteAsync(Guid id, Guid userId);
    Task<ReminderResponse> MarkAsCompletedAsync(Guid id, Guid userId);
    Task<ReminderResponse> MarkAsIncompleteAsync(Guid id, Guid userId);
    Task<IEnumerable<ReminderResponse>> SearchAsync(Guid userId, string searchTerm);
    Task<ReminderStatsResponse> GetStatsAsync(Guid userId);
}

public class ReminderStatsResponse
{
    public int TotalReminders { get; set; }
    public int CompletedReminders { get; set; }
    public int OverdueReminders { get; set; }
    public int TodayReminders { get; set; }
    public int UpcomingReminders { get; set; }
    public double CompletionRate { get; set; }
}
