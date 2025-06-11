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

    // Healthcare entities
    public DbSet<HealthcareFacility> HealthcareFacilities { get; set; }
    public DbSet<HealthcareProvider> HealthcareProviders { get; set; }
    public DbSet<ProviderFacility> ProviderFacilities { get; set; }
    public DbSet<FacilityReview> FacilityReviews { get; set; }
    public DbSet<ProviderReview> ProviderReviews { get; set; }

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

            entity.Property(e => e.Role)
                .IsRequired()
                .HasDefaultValue(Domain.Enums.UserRole.User);

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

        // Configure HealthcareFacility entity
        modelBuilder.Entity<HealthcareFacility>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Type)
                .IsRequired()
                .HasConversion<string>();

            entity.Property(e => e.Description)
                .HasMaxLength(2000);

            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.Phone)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(e => e.Email)
                .HasMaxLength(100);

            entity.Property(e => e.Website)
                .HasMaxLength(200);

            entity.Property(e => e.AverageRating)
                .HasPrecision(3, 2)
                .HasDefaultValue(0);

            entity.Property(e => e.ReviewCount)
                .HasDefaultValue(0);

            entity.Property(e => e.OperatingHours)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Services)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Images)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.IsVerified)
                .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
            entity.HasIndex(e => e.IsActive);
        });

        // Configure HealthcareProvider entity
        modelBuilder.Entity<HealthcareProvider>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Title)
                .HasMaxLength(20);

            entity.Property(e => e.Specialization)
                .IsRequired()
                .HasConversion<string>();

            entity.Property(e => e.SubSpecialty)
                .HasMaxLength(100);

            entity.Property(e => e.LicenseNumber)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Qualifications)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Biography)
                .HasMaxLength(2000);

            entity.Property(e => e.Phone)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(e => e.Email)
                .HasMaxLength(100);

            entity.Property(e => e.AverageRating)
                .HasPrecision(3, 2)
                .HasDefaultValue(0);

            entity.Property(e => e.ReviewCount)
                .HasDefaultValue(0);

            entity.Property(e => e.ConsultationFees)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Availability)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Languages)
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.ProfileImage)
                .HasMaxLength(500);

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.IsVerified)
                .HasDefaultValue(false);

            entity.Property(e => e.AcceptsNewPatients)
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationships
            entity.HasOne(e => e.PrimaryFacility)
                .WithMany(f => f.Providers)
                .HasForeignKey(e => e.PrimaryFacilityId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            entity.HasIndex(e => e.Specialization);
            entity.HasIndex(e => e.LicenseNumber).IsUnique();
            entity.HasIndex(e => e.IsActive);
        });

        // Configure ProviderFacility junction table
        modelBuilder.Entity<ProviderFacility>(entity =>
        {
            entity.HasKey(e => new { e.ProviderId, e.FacilityId });

            entity.Property(e => e.RoomNumber)
                .HasMaxLength(20);

            entity.Property(e => e.Department)
                .HasMaxLength(100);

            entity.Property(e => e.IsPrimary)
                .HasDefaultValue(false);

            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            // Relationships
            entity.HasOne(e => e.Provider)
                .WithMany(p => p.ProviderFacilities)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Facility)
                .WithMany()
                .HasForeignKey(e => e.FacilityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure FacilityReview entity
        modelBuilder.Entity<FacilityReview>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Rating)
                .IsRequired();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Comment)
                .HasMaxLength(2000);

            entity.Property(e => e.IsVerified)
                .HasDefaultValue(false);

            entity.Property(e => e.IsAnonymous)
                .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationships
            entity.HasOne(e => e.Facility)
                .WithMany(f => f.Reviews)
                .HasForeignKey(e => e.FacilityId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(e => e.FacilityId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Rating);
        });

        // Configure ProviderReview entity
        modelBuilder.Entity<ProviderReview>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Rating)
                .IsRequired();

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Comment)
                .HasMaxLength(2000);

            entity.Property(e => e.TreatmentType)
                .HasMaxLength(100);

            entity.Property(e => e.WouldRecommend)
                .HasDefaultValue(true);

            entity.Property(e => e.IsVerified)
                .HasDefaultValue(false);

            entity.Property(e => e.IsAnonymous)
                .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relationships
            entity.HasOne(e => e.Provider)
                .WithMany(p => p.Reviews)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(e => e.ProviderId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Rating);
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
