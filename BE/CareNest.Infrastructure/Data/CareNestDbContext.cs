using CareNest.Domain.Entities;
using CareNest.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Data;

public class CareNestDbContext : DbContext
{
    public CareNestDbContext(DbContextOptions<CareNestDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Reminder> Reminders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255)
                .HasConversion(
                    email => email.Value,
                    value => new Email(value));

            entity.HasIndex(e => e.Email)
                .IsUnique();

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20);

            entity.Property(e => e.Gender)
                .HasMaxLength(10);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt);

            entity.Property(e => e.LastLoginAt);

            entity.Property(e => e.IsEmailVerified)
                .IsRequired()
                .HasDefaultValue(false);

            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false);

            // Global query filter to exclude soft deleted records
            entity.HasQueryFilter(e => !e.IsDeleted);

            // Configure relationships
            entity.HasMany(u => u.CreatedReminders)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasMany(u => u.AssignedReminders)
                .WithOne(r => r.AssignedToUser)
                .HasForeignKey(r => r.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Reminder entity
        modelBuilder.Entity<Reminder>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            entity.Property(e => e.Type)
                .IsRequired();

            entity.Property(e => e.ScheduledAt)
                .IsRequired();

            entity.Property(e => e.Frequency)
                .IsRequired();

            entity.Property(e => e.Priority)
                .IsRequired()
                .HasDefaultValue(ReminderPriority.Medium);

            entity.Property(e => e.IsCompleted)
                .IsRequired()
                .HasDefaultValue(false);

            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(e => e.EnableNotification)
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(e => e.NotificationMinutesBefore)
                .IsRequired()
                .HasDefaultValue(15);

            entity.Property(e => e.MedicationName)
                .HasMaxLength(100);

            entity.Property(e => e.Dosage)
                .HasMaxLength(100);

            entity.Property(e => e.Instructions)
                .HasMaxLength(500);

            entity.Property(e => e.DoctorName)
                .HasMaxLength(100);

            entity.Property(e => e.ClinicName)
                .HasMaxLength(200);

            entity.Property(e => e.ClinicAddress)
                .HasMaxLength(500);

            entity.Property(e => e.ClinicPhone)
                .HasMaxLength(20);

            entity.Property(e => e.ExerciseType)
                .HasMaxLength(100);

            entity.Property(e => e.CustomFieldsJson)
                .HasMaxLength(4000);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt);

            entity.Property(e => e.IsDeleted)
                .IsRequired()
                .HasDefaultValue(false);

            // Global query filter to exclude soft deleted records
            entity.HasQueryFilter(e => !e.IsDeleted);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<User>())
        {
            switch (entry.State)
            {
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<Reminder>())
        {
            switch (entry.State)
            {
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
