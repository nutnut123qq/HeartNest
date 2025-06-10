using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;

namespace CareNest.Domain.Services;

public class ReminderDomainService : IReminderService
{
    private readonly IReminderRepository _reminderRepository;

    public ReminderDomainService(IReminderRepository reminderRepository)
    {
        _reminderRepository = reminderRepository;
    }

    public async Task<Reminder?> GetByIdAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            return null;
        }
        return reminder;
    }

    public async Task<IEnumerable<Reminder>> GetByUserIdAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetByUserIdAsync(userId);
        var assignedReminders = await _reminderRepository.GetAssignedToUserAsync(userId);
        return reminders.Concat(assignedReminders).Distinct();
    }

    public async Task<IEnumerable<Reminder>> GetUpcomingAsync(Guid userId, int hours = 24)
    {
        return await _reminderRepository.GetUpcomingAsync(userId, hours);
    }

    public async Task<IEnumerable<Reminder>> GetOverdueAsync(Guid userId)
    {
        return await _reminderRepository.GetOverdueAsync(userId);
    }

    public async Task<IEnumerable<Reminder>> GetTodayAsync(Guid userId)
    {
        return await _reminderRepository.GetTodayAsync(userId);
    }

    public async Task<IEnumerable<Reminder>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        return await _reminderRepository.GetByDateRangeAsync(userId, startDate, endDate);
    }

    public async Task<IEnumerable<Reminder>> GetByTypeAsync(Guid userId, ReminderType type)
    {
        return await _reminderRepository.GetByTypeAsync(userId, type);
    }

    public async Task<IEnumerable<Reminder>> GetActiveAsync(Guid userId)
    {
        return await _reminderRepository.GetActiveAsync(userId);
    }

    public async Task<IEnumerable<Reminder>> GetCompletedAsync(Guid userId)
    {
        return await _reminderRepository.GetCompletedAsync(userId);
    }

    public async Task<Reminder> CreateAsync(Reminder reminder)
    {
        reminder.Id = Guid.NewGuid();
        reminder.CreatedAt = DateTime.UtcNow;
        return await _reminderRepository.CreateAsync(reminder);
    }

    public async Task<Reminder> UpdateAsync(Reminder reminder)
    {
        return await _reminderRepository.UpdateAsync(reminder);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || reminder.UserId != userId)
        {
            throw new UnauthorizedAccessException("Không có quyền xóa nhắc nhở này");
        }
        await _reminderRepository.DeleteAsync(id);
    }

    public async Task<Reminder> MarkAsCompletedAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            throw new UnauthorizedAccessException("Không có quyền cập nhật nhắc nhở này");
        }

        reminder.IsCompleted = true;
        reminder.CompletedAt = DateTime.UtcNow;
        return await _reminderRepository.UpdateAsync(reminder);
    }

    public async Task<Reminder> MarkAsIncompleteAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            throw new UnauthorizedAccessException("Không có quyền cập nhật nhắc nhở này");
        }

        reminder.IsCompleted = false;
        reminder.CompletedAt = null;
        return await _reminderRepository.UpdateAsync(reminder);
    }

    public async Task<IEnumerable<Reminder>> SearchAsync(Guid userId, string searchTerm)
    {
        return await _reminderRepository.SearchAsync(userId, searchTerm);
    }
}
