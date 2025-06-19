using CareNest.Domain.Interfaces;
using Hangfire;
using System.Linq.Expressions;

namespace CareNest.Infrastructure.Services;

public class HangfireJobService : IBackgroundJobService
{
    public string Schedule<T>(Expression<Func<T, Task>> methodCall, TimeSpan delay)
    {
        return BackgroundJob.Schedule(methodCall, delay);
    }

    public void AddOrUpdateRecurringJob<T>(string jobId, Expression<Func<T, Task>> methodCall, string cronExpression)
    {
        RecurringJob.AddOrUpdate(jobId, methodCall, cronExpression);
    }

    public void RemoveRecurringJob(string jobId)
    {
        RecurringJob.RemoveIfExists(jobId);
    }

    public string Enqueue<T>(Expression<Func<T, Task>> methodCall)
    {
        return BackgroundJob.Enqueue(methodCall);
    }
}
