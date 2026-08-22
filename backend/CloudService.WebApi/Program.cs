using System.Text;
using CloudService.Application.Interfaces;
using CloudService.Application.Services;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using CloudService.Infrastructure.Repositories;
using CloudService.Infrastructure.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CloudService.WebApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ==================== DATABASE ====================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")));

// ==================== REPOSITORIES ====================

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ==================== APPLICATION SERVICES ====================

builder.Services.AddScoped<IServicePlanService, ServicePlanService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<INewsArticleService, NewsArticleService>();
builder.Services.AddScoped<IAffiliateService, AffiliateService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAffiliateApplicationService, AffiliateApplicationService>();
builder.Services.AddScoped<IAdminStatsService, AdminStatsService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<ICustomerAffiliateService, CustomerAffiliateService>();

// ==================== INFRASTRUCTURE SERVICES ====================

builder.Services.AddSingleton<PasswordHashService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<QrCodeService>();
builder.Services.AddSingleton<ExcelExportService>();

// ==================== AUTOMAPPER ====================

builder.Services.AddAutoMapper(
    cfg => { },
    typeof(CloudService.Application.Mappings.ServicePlanProfile).Assembly);

// ==================== FLUENT VALIDATION ====================

builder.Services.AddValidatorsFromAssemblyContaining
    <CloudService.Application.Validators.CreateServicePlanDtoValidator>();

// ==================== JWT AUTHENTICATION ====================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
            NameClaimType = System.Security.Claims.ClaimTypes.Name,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Secret"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("========== JWT AUTHENTICATION ERROR ==========");
                Console.WriteLine(context.Exception.Message);
                Console.WriteLine("==============================================");

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ==================== CONTROLLERS + SWAGGER ====================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "CloudService API",
            Version = "v1"
        });

    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Nháº­p token: Bearer {token}"
        });

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement
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
                Array.Empty<string>()
            }
        });
});

// ==================== CORS ====================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ==================== BUILD APP ====================

var app = builder.Build();

// ==================== MIDDLEWARE ====================
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseMiddleware<AuditMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
