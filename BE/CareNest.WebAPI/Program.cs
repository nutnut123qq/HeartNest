using System.Security.Claims;
using System.Text;
using CareNest.Application.Interfaces;
using CareNest.Application.Jobs;
using CareNest.Application.Services;
using CareNest.Domain.Interfaces;
using CareNest.Domain.Services;
using CareNest.Infrastructure.Data;
using CareNest.Infrastructure.Repositories;
using CareNest.Infrastructure.Services;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// SignalR
builder.Services.AddSignalR();

// Database
builder.Services.AddDbContext<CareNestDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Hangfire
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReminderRepository, ReminderRepository>();
builder.Services.AddScoped<IHealthcareFacilityRepository, HealthcareFacilityRepository>();
builder.Services.AddScoped<IHealthcareProviderRepository, HealthcareProviderRepository>();
builder.Services.AddScoped<IFacilityReviewRepository, FacilityReviewRepository>();
builder.Services.AddScoped<IProviderReviewRepository, ProviderReviewRepository>();

// Family repositories
builder.Services.AddScoped<IFamilyRepository, FamilyRepository>();
builder.Services.AddScoped<IFamilyMemberRepository, FamilyMemberRepository>();
builder.Services.AddScoped<IInvitationRepository, InvitationRepository>();

// Chat repositories
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

// Services
builder.Services.AddScoped<IAuthService, JwtAuthService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IReminderService, ReminderDomainService>();
builder.Services.AddScoped<IHealthcareService, HealthcareService>();
builder.Services.AddScoped<IReminderApplicationService, ReminderApplicationService>();

// Family services
builder.Services.AddScoped<IFamilyService, FamilyService>();

// Chat services
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IChatApplicationService, ChatApplicationService>();

// Notification services
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<ISignalRNotificationSender, CareNest.WebAPI.Services.SignalRNotificationSender>();

// Background job services
builder.Services.AddScoped<IBackgroundJobService, HangfireJobService>();
builder.Services.AddScoped<ReminderNotificationJob>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
Console.WriteLine($"JwtSettings section exists: {jwtSettings.Exists()}");
Console.WriteLine($"SecretKey value: {jwtSettings["SecretKey"]}");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero,
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role
    };

    // Configure JWT for SignalR
    options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("JWT Token validated successfully");
            Console.WriteLine($"Claims count: {context.Principal?.Claims.Count()}");
            foreach (var claim in context.Principal?.Claims ?? Enumerable.Empty<Claim>())
            {
                Console.WriteLine($"  Claim: {claim.Type} = {claim.Value}");
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        }
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for SignalR
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CareNest API",
        Version = "v1",
        Description = "API cho ứng dụng chăm sóc sức khỏe gia đình CareNest"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CareNest API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
});

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Hangfire Dashboard
app.UseHangfireDashboard("/hangfire");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// SignalR Hub
app.MapHub<CareNest.WebAPI.Hubs.ChatHub>("/chatHub");

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CareNestDbContext>();
    context.Database.EnsureCreated();
}

// Setup recurring jobs
RecurringJob.AddOrUpdate<ReminderNotificationJob>(
    "check-reminders",
    job => job.CheckAndSendRemindersAsync(),
    "*/1 * * * *"); // Every minute

RecurringJob.AddOrUpdate<ReminderNotificationJob>(
    "check-overdue-reminders",
    job => job.CheckOverdueRemindersAsync(),
    "0 */6 * * *"); // Every 6 hours

app.Run();
