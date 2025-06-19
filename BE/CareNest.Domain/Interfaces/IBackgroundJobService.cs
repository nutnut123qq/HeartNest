using System.Linq.Expressions;

namespace CareNest.Domain.Interfaces;

public interface IBackgroundJobService
{
    /// <summary>
    /// Lên lịch job chạy một lần
    /// </summary>
    string Schedule<T>(Expression<Func<T, Task>> methodCall, TimeSpan delay);

    /// <summary>
    /// Lên lịch job chạy định kỳ
    /// </summary>
    void AddOrUpdateRecurringJob<T>(string jobId, Expression<Func<T, Task>> methodCall, string cronExpression);

    /// <summary>
    /// Xóa job định kỳ
    /// </summary>
    void RemoveRecurringJob(string jobId);

    /// <summary>
    /// Chạy job ngay lập tức
    /// </summary>
    string Enqueue<T>(Expression<Func<T, Task>> methodCall);
}
