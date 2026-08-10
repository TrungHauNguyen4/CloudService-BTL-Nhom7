# 📘 Hướng Dẫn Chi Tiết Công Việc Còn Lại — TV2, TV3, TV4

> **Ngày tạo**: 01/08/2026  
> **Dựa trên**: Kế hoạch gốc ([kehoach](file:///d:/BTL_Ban_dich_vu_cloud/kehoach)) + Source code thực tế  
> **Tech Stack**: .NET 9 · Next.js 16 · Tailwind CSS 4 · SQL Server · Docker

---

## 📌 Ghi Chú Quan Trọng Trước Khi Bắt Đầu

> [!IMPORTANT]
> **TV1 đã hoàn thành** toàn bộ Domain + Application layer. Các thành viên còn lại sẽ **kế thừa và implement** dựa trên interfaces/services mà TV1 đã viết.

### Những gì TV1 đã cung cấp sẵn:
| Thành phần | File | Mô tả |
|---|---|---|
| 9 Entities | `ServiceCategory`, `ServicePlan`, `PlanPrice`, `Promotion`, `NewsArticle`, `OrderRequest`, `AppUser`, `AuditLog`, `AffiliateApplication` | Ánh xạ DB |
| 3 Enums | `BillingCycle`, `OrderStatus`, `UserRole` | Các giá trị cố định |
| Base classes | `BaseEntity` (Id, CreatedAt, UpdatedAt), `Result<T>` | Dùng chung |
| 6 Repository Interfaces | `IGenericRepository<T>`, `IServicePlanRepository`, `IServiceCategoryRepository`, `INewsArticleRepository`, `IOrderRequestRepository`, `IUnitOfWork` | Hợp đồng cho tầng Infrastructure |
| 6 Service Interfaces | `IServicePlanService`, `ICategoryService`, `IOrderService`, `INewsArticleService`, `IAffiliateService`, `IAuthService` | Hợp đồng cho tầng Application |
| 5 Service Implementations | `ServicePlanService`, `CategoryService`, `OrderService`, `NewsArticleService`, `AffiliateService` | Business logic |
| 11 DTOs | `ServicePlanDto`, `CreateServicePlanDto`, `CategoryDto`, `CreateCategoryDto`, `OrderDto`, `CreateOrderDto`, `NewsArticleDto` (trống), `CreateNewsArticleDto`, `CreateAffiliateDto`, `LoginDto`, `UserDto` (trống) | Data transfer |
| 4 AutoMapper Profiles | `ServicePlanProfile`, `CategoryProfile`, `OrderProfile`, `NewsProfile` | Mapping config |
| 1 Validator | `CreateServicePlanDtoValidator` | FluentValidation |

### ⚠️ Lỗi cần sửa trước khi bắt đầu:
1. **File `IAffiliateApplicationRepository.cs` chưa tồn tại** — `IUnitOfWork` tham chiếu đến `IAffiliateApplicationRepository` nhưng file chưa được tạo.
2. **`NewsArticleDto.cs` và `UserDto.cs` đang trống** — cần bổ sung nội dung.

---

---

# 🔧 TV2 — Backend API + Security + Infrastructure

**Mục tiêu**: Biến các interface/entity của TV1 thành hệ thống chạy thực với Database, Authentication, và REST API.

---

## Bước 1: Sửa Lỗi Kế Thừa Từ TV1

### 1.1 Tạo file `IAffiliateApplicationRepository.cs`

**Vị trí**: `backend/CloudService.Domain/Interfaces/IAffiliateApplicationRepository.cs`

```csharp
using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IAffiliateApplicationRepository : IGenericRepository<AffiliateApplication>
{
    // Có thể thêm method riêng nếu cần
}
```

### 1.2 Bổ sung `NewsArticleDto.cs`

**Vị trí**: `backend/CloudService.Application/DTOs/NewsArticleDto.cs`

```csharp
namespace CloudService.Application.DTOs;

public class NewsArticleDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty; // Map từ Author.Username
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished { get; set; }
}
```

### 1.3 Bổ sung `UserDto.cs`

**Vị trí**: `backend/CloudService.Application/DTOs/UserDto.cs`

```csharp
namespace CloudService.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
```

---

## Bước 2: Cài NuGet Packages cho Infrastructure

### 2.1 Chạy lệnh cài package (trong thư mục `backend/CloudService.Infrastructure/`)

```bash
# EF Core cho SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

# BCrypt để băm password
dotnet add package BCrypt.Net-Next

# JWT Authentication
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# QR Code (sinh mã QR)
dotnet add package QRCoder

# Export Excel
dotnet add package ClosedXML
```

### 2.2 Cài package cho WebApi (trong thư mục `backend/CloudService.WebApi/`)

```bash
# Swagger UI
dotnet add package Swashbuckle.AspNetCore

# JWT Bearer Auth
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# Serilog Logging
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

---

## Bước 3: Tạo `AppDbContext`

**Vị trí**: `backend/CloudService.Infrastructure/Data/AppDbContext.cs`

```csharp
using CloudService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Khai báo DbSet cho mỗi Entity
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<ServicePlan> ServicePlans => Set<ServicePlan>();
    public DbSet<PlanPrice> PlanPrices => Set<PlanPrice>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<NewsArticle> NewsArticles => Set<NewsArticle>();
    public DbSet<OrderRequest> OrderRequests => Set<OrderRequest>();
    public DbSet<AffiliateApplication> AffiliateApplications => Set<AffiliateApplication>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ===== ServiceCategory =====
        modelBuilder.Entity<ServiceCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        // ===== ServicePlan =====
        modelBuilder.Entity<ServicePlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(150);
            entity.HasIndex(e => e.Slug).IsUnique();

            // Quan hệ: 1 Category -> nhiều Plans
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.ServicePlans)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== PlanPrice =====
        modelBuilder.Entity<PlanPrice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OriginalPrice).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Plan)
                  .WithMany(p => p.Prices)
                  .HasForeignKey(e => e.PlanId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== Promotion =====
        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DiscountPercent).HasColumnType("decimal(5,2)");

            entity.HasOne(e => e.Plan)
                  .WithMany()
                  .HasForeignKey(e => e.PlanId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== NewsArticle =====
        modelBuilder.Entity<NewsArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(250);
            entity.HasIndex(e => e.Slug).IsUnique();

            entity.HasOne(e => e.Author)
                  .WithMany(u => u.AuthoredArticles)
                  .HasForeignKey(e => e.AuthorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== OrderRequest =====
        modelBuilder.Entity<OrderRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);

            entity.HasOne(e => e.Customer)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Plan)
                  .WithMany()
                  .HasForeignKey(e => e.PlanId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== AppUser =====
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
        });

        // ===== AuditLog =====
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
        });

        // ===== AffiliateApplication =====
        modelBuilder.Entity<AffiliateApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
        });

        // ===== SEED DATA =====
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // --- Tài khoản demo ---
        var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var editorId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        modelBuilder.Entity<AppUser>().HasData(
            new AppUser
            {
                Id = adminId,
                Username = "admin",
                Email = "admin@cloudvn.vn",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = Domain.Enums.UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            },
            new AppUser
            {
                Id = editorId,
                Username = "editor",
                Email = "editor@cloudvn.vn",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Editor@123"),
                Role = Domain.Enums.UserRole.Editor,
                CreatedAt = DateTime.UtcNow
            }
        );

        // --- Danh mục dịch vụ ---
        var catVps = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var catHosting = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var catDomain = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

        modelBuilder.Entity<ServiceCategory>().HasData(
            new ServiceCategory { Id = catVps, Name = "VPS", Slug = "vps", Description = "Máy chủ ảo hiệu năng cao" },
            new ServiceCategory { Id = catHosting, Name = "Hosting", Slug = "hosting", Description = "Web hosting tốc độ nhanh" },
            new ServiceCategory { Id = catDomain, Name = "Domain", Slug = "domain", Description = "Tên miền giá rẻ" }
        );

        // --- Gói dịch vụ mẫu (10+ gói) ---
        var plan1 = Guid.Parse("11111111-aaaa-aaaa-aaaa-111111111111");
        var plan2 = Guid.Parse("22222222-aaaa-aaaa-aaaa-222222222222");
        var plan3 = Guid.Parse("33333333-aaaa-aaaa-aaaa-333333333333");
        var plan4 = Guid.Parse("44444444-aaaa-aaaa-aaaa-444444444444");
        var plan5 = Guid.Parse("55555555-bbbb-bbbb-bbbb-555555555555");
        var plan6 = Guid.Parse("66666666-bbbb-bbbb-bbbb-666666666666");
        var plan7 = Guid.Parse("77777777-bbbb-bbbb-bbbb-777777777777");
        var plan8 = Guid.Parse("88888888-cccc-cccc-cccc-888888888888");
        var plan9 = Guid.Parse("99999999-cccc-cccc-cccc-999999999999");
        var plan10 = Guid.Parse("aaaaaaaa-cccc-cccc-cccc-aaaaaaaaaaaa");

        modelBuilder.Entity<ServicePlan>().HasData(
            new ServicePlan { Id = plan1, CategoryId = catVps, Name = "VPS Basic", Slug = "vps-basic", Specs = "1 vCPU / 1GB RAM / 20GB SSD" },
            new ServicePlan { Id = plan2, CategoryId = catVps, Name = "VPS Pro", Slug = "vps-pro", Specs = "2 vCPU / 4GB RAM / 60GB SSD" },
            new ServicePlan { Id = plan3, CategoryId = catVps, Name = "VPS Business", Slug = "vps-business", Specs = "4 vCPU / 8GB RAM / 120GB SSD" },
            new ServicePlan { Id = plan4, CategoryId = catVps, Name = "VPS Enterprise", Slug = "vps-enterprise", Specs = "8 vCPU / 16GB RAM / 240GB SSD" },
            new ServicePlan { Id = plan5, CategoryId = catHosting, Name = "Hosting Starter", Slug = "hosting-starter", Specs = "5GB SSD / 50GB BW / 1 Website" },
            new ServicePlan { Id = plan6, CategoryId = catHosting, Name = "Hosting Business", Slug = "hosting-business", Specs = "20GB SSD / Unlimited BW / 10 Websites" },
            new ServicePlan { Id = plan7, CategoryId = catHosting, Name = "Hosting Premium", Slug = "hosting-premium", Specs = "50GB SSD / Unlimited BW / Unlimited Websites" },
            new ServicePlan { Id = plan8, CategoryId = catDomain, Name = "Domain .vn", Slug = "domain-vn", Specs = "Tên miền .vn giá rẻ" },
            new ServicePlan { Id = plan9, CategoryId = catDomain, Name = "Domain .com", Slug = "domain-com", Specs = "Tên miền .com quốc tế" },
            new ServicePlan { Id = plan10, CategoryId = catDomain, Name = "Domain .net", Slug = "domain-net", Specs = "Tên miền .net quốc tế" }
        );
    }
}
```

---

## Bước 4: Tạo Repositories (Implement các Interface của TV1)

### 4.1 `GenericRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/GenericRepository.cs`

```csharp
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id)
        => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public async Task AddAsync(T entity)
        => await _dbSet.AddAsync(entity);

    public void Update(T entity)
        => _dbSet.Update(entity);

    public void Delete(T entity)
        => _dbSet.Remove(entity);
}
```

### 4.2 `ServicePlanRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/ServicePlanRepository.cs`

```csharp
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class ServicePlanRepository : GenericRepository<ServicePlan>, IServicePlanRepository
{
    public ServicePlanRepository(AppDbContext context) : base(context) { }

    public async Task<ServicePlan?> GetBySlugAsync(string slug)
        => await _dbSet
            .Include(p => p.Prices)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<IEnumerable<ServicePlan>> GetActivePlansByCategoryAsync(Guid categoryId)
        => await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Prices)
            .ToListAsync();
}
```

### 4.3 `ServiceCategoryRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/ServiceCategoryRepository.cs`

```csharp
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class ServiceCategoryRepository : GenericRepository<ServiceCategory>, IServiceCategoryRepository
{
    public ServiceCategoryRepository(AppDbContext context) : base(context) { }

    public async Task<ServiceCategory?> GetBySlugAsync(string slug)
        => await _dbSet.FirstOrDefaultAsync(c => c.Slug == slug);

    public async Task<IEnumerable<ServiceCategory>> GetActiveCategoriesAsync()
        => await _dbSet.Where(c => c.IsActive).ToListAsync();
}
```

### 4.4 `NewsArticleRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/NewsArticleRepository.cs`

```csharp
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class NewsArticleRepository : GenericRepository<NewsArticle>, INewsArticleRepository
{
    public NewsArticleRepository(AppDbContext context) : base(context) { }

    public async Task<NewsArticle?> GetBySlugAsync(string slug)
        => await _dbSet.Include(a => a.Author).FirstOrDefaultAsync(a => a.Slug == slug);

    public async Task<IEnumerable<NewsArticle>> GetPublishedArticlesAsync(int page, int pageSize)
        => await _dbSet
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.Author)
            .ToListAsync();
}
```

### 4.5 `OrderRequestRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/OrderRequestRepository.cs`

```csharp
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class OrderRequestRepository : GenericRepository<OrderRequest>, IOrderRequestRepository
{
    public OrderRequestRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<OrderRequest>> GetOrdersByCustomerIdAsync(Guid customerId)
        => await _dbSet.Where(o => o.CustomerId == customerId)
                       .OrderByDescending(o => o.CreatedAt)
                       .ToListAsync();

    public async Task<IEnumerable<OrderRequest>> GetPendingOrdersAsync()
        => await _dbSet.Where(o => o.Status == OrderStatus.New || o.Status == OrderStatus.Processing)
                       .OrderByDescending(o => o.CreatedAt)
                       .ToListAsync();
}
```

### 4.6 `AffiliateApplicationRepository.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/AffiliateApplicationRepository.cs`

```csharp
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;

namespace CloudService.Infrastructure.Repositories;

public class AffiliateApplicationRepository : GenericRepository<AffiliateApplication>, IAffiliateApplicationRepository
{
    public AffiliateApplicationRepository(AppDbContext context) : base(context) { }
}
```

### 4.7 `UnitOfWork.cs` (Implement `IUnitOfWork` của TV1)

**Vị trí**: `backend/CloudService.Infrastructure/Repositories/UnitOfWork.cs`

```csharp
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;

namespace CloudService.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IServiceCategoryRepository ServiceCategories { get; }
    public IServicePlanRepository ServicePlans { get; }
    public INewsArticleRepository NewsArticles { get; }
    public IOrderRequestRepository OrderRequests { get; }
    public IAffiliateApplicationRepository AffiliateApplication { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        ServiceCategories = new ServiceCategoryRepository(context);
        ServicePlans = new ServicePlanRepository(context);
        NewsArticles = new NewsArticleRepository(context);
        OrderRequests = new OrderRequestRepository(context);
        AffiliateApplication = new AffiliateApplicationRepository(context);
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
        => _context.Dispose();
}
```

---

## Bước 5: Tạo Services Hạ Tầng

### 5.1 `PasswordHashService.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Services/PasswordHashService.cs`

```csharp
namespace CloudService.Infrastructure.Services;

public class PasswordHashService
{
    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    public bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}
```

### 5.2 `JwtService.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Services/JwtService.cs`

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CloudService.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CloudService.Infrastructure.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### 5.3 `AuthService.cs` (Implement `IAuthService` của TV1)

**Vị trí**: `backend/CloudService.Infrastructure/Services/AuthService.cs`

```csharp
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHashService _passwordHashService;

    public AuthService(AppDbContext context, JwtService jwtService, PasswordHashService passwordHashService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHashService = passwordHashService;
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await _context.AppUsers
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null) return null;

        // So sánh password đã băm
        if (!_passwordHashService.Verify(dto.Password, user.PasswordHash))
            return null;

        // Tạo JWT token
        return _jwtService.GenerateToken(user);
    }
}
```

### 5.4 `QrCodeService.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Services/QrCodeService.cs`

```csharp
using QRCoder;

namespace CloudService.Infrastructure.Services;

public class QrCodeService
{
    /// <summary>
    /// Sinh QR Code từ text, trả về chuỗi Base64 PNG
    /// </summary>
    public string GenerateQrCodeBase64(string text)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        byte[] qrCodeBytes = qrCode.GetGraphic(10);
        return Convert.ToBase64String(qrCodeBytes);
    }
}
```

### 5.5 `ExcelExportService.cs`

**Vị trí**: `backend/CloudService.Infrastructure/Services/ExcelExportService.cs`

```csharp
using ClosedXML.Excel;
using CloudService.Domain.Entities;

namespace CloudService.Infrastructure.Services;

public class ExcelExportService
{
    public byte[] ExportOrdersToExcel(IEnumerable<OrderRequest> orders)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Đơn hàng");

        // Header
        worksheet.Cell(1, 1).Value = "Mã đơn";
        worksheet.Cell(1, 2).Value = "Tên khách hàng";
        worksheet.Cell(1, 3).Value = "Email";
        worksheet.Cell(1, 4).Value = "Gói dịch vụ";
        worksheet.Cell(1, 5).Value = "Chu kỳ";
        worksheet.Cell(1, 6).Value = "Trạng thái";
        worksheet.Cell(1, 7).Value = "Ngày tạo";

        var headerRange = worksheet.Range(1, 1, 1, 7);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightBlue;

        int row = 2;
        foreach (var order in orders)
        {
            worksheet.Cell(row, 1).Value = order.Id.ToString();
            worksheet.Cell(row, 2).Value = order.CustomerName;
            worksheet.Cell(row, 3).Value = order.Email;
            worksheet.Cell(row, 4).Value = order.ServiceName;
            worksheet.Cell(row, 5).Value = order.BillingCycle.ToString();
            worksheet.Cell(row, 6).Value = order.Status.ToString();
            worksheet.Cell(row, 7).Value = order.CreatedAt.ToString("dd/MM/yyyy HH:mm");
            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
```

---

## Bước 6: Tạo WebApi Controllers

### 6.1 Cấu hình `Program.cs` (thay thế hoàn toàn template mặc định)

**Vị trí**: `backend/CloudService.WebApi/Program.cs`

```csharp
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

var builder = WebApplication.CreateBuilder(args);

// === Database ===
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// === Repositories (Unit of Work pattern) ===
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// === Application Services ===
builder.Services.AddScoped<IServicePlanService, ServicePlanService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<INewsArticleService, NewsArticleService>();
builder.Services.AddScoped<IAffiliateService, AffiliateService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// === Infrastructure Services ===
builder.Services.AddSingleton<PasswordHashService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<QrCodeService>();
builder.Services.AddSingleton<ExcelExportService>();

// === AutoMapper ===
builder.Services.AddAutoMapper(typeof(CloudService.Application.Mappings.ServicePlanProfile).Assembly);

// === FluentValidation ===
builder.Services.AddValidatorsFromAssemblyContaining
    <CloudService.Application.Validators.CreateServicePlanDtoValidator>();

// === JWT Authentication ===
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

// === Controllers + Swagger ===
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CloudService API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token: Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// === CORS ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

### 6.2 Cấu hình `appsettings.json`

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=CloudServiceDb;User Id=sa;Password=CloudService@123;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "SuperSecretKeyForCloudServiceJWT2026!AtLeast32Chars",
    "Issuer": "CloudServiceAPI",
    "Audience": "CloudServiceClient"
  },
  "Logging": {
    "LogLevel": { "Default": "Information" }
  }
}
```

### 6.3 Controllers Public — tạo thư mục `Controllers/Public/`

#### `Controllers/Public/ServiceCategoriesController.cs`

```csharp
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/service-categories")]
public class ServiceCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    public ServiceCategoriesController(ICategoryService categoryService)
        => _categoryService = categoryService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _categoryService.GetAllAsync());
}
```

#### `Controllers/Public/ServicePlansController.cs`

```csharp
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/service-plans")]
public class ServicePlansController : ControllerBase
{
    private readonly IServicePlanService _service;
    public ServicePlansController(IServicePlanService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var plan = await _service.GetByIdAsync(id);
        return plan == null ? NotFound() : Ok(plan);
    }
}
```

#### `Controllers/Public/OrderRequestsController.cs`

```csharp
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/order-requests")]
public class OrderRequestsController : ControllerBase
{
    private readonly IOrderService _orderService;
    public OrderRequestsController(IOrderService orderService) => _orderService = orderService;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var order = await _orderService.CreateOrderAsync(dto);
        return CreatedAtAction(nameof(Create), new { id = order.Id }, order);
    }
}
```

#### `Controllers/Public/AffiliateController.cs`

```csharp
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/affiliate-applications")]
public class AffiliateController : ControllerBase
{
    private readonly IAffiliateService _service;
    public AffiliateController(IAffiliateService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateAffiliateDto dto)
    {
        var result = await _service.SubmitApplicationAsync(dto);
        return result ? Ok(new { message = "Đăng ký đối tác thành công!" }) : BadRequest();
    }
}
```

### 6.4 Controllers Admin — tạo thư mục `Controllers/Admin/`

#### `Controllers/Admin/AuthController.cs`

```csharp
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);
        if (token == null)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
        return Ok(new { token });
    }
}
```

#### `Controllers/Admin/AdminServicePlansController.cs`

```csharp
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/service-plans")]
[Authorize(Roles = "Admin")]
public class AdminServicePlansController : ControllerBase
{
    private readonly IServicePlanService _planService;
    public AdminServicePlansController(IServicePlanService planService)
        => _planService = planService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _planService.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateServicePlanDto dto)
    {
        var plan = await _planService.CreateAsync(dto);
        return CreatedAtAction(nameof(Create), new { id = plan.Id }, plan);
    }
}
```

#### `Controllers/Admin/AdminOrdersController.cs`

```csharp
using CloudService.Application.Interfaces;
using CloudService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin,Editor")]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    public AdminOrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
        => Ok(await _orderService.GetPendingOrdersAsync());

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus newStatus)
    {
        var success = await _orderService.UpdateOrderStatusAsync(id, newStatus);
        return success ? Ok(new { message = "Cập nhật thành công." }) : NotFound();
    }
}
```

#### `Controllers/Admin/AdminExportController.cs`

```csharp
using CloudService.Infrastructure.Data;
using CloudService.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/export")]
[Authorize(Roles = "Admin")]
public class AdminExportController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ExcelExportService _excelService;

    public AdminExportController(AppDbContext context, ExcelExportService excelService)
    {
        _context = context;
        _excelService = excelService;
    }

    [HttpGet("orders")]
    public async Task<IActionResult> ExportOrders()
    {
        var orders = await _context.OrderRequests.ToListAsync();
        var bytes = _excelService.ExportOrdersToExcel(orders);
        return File(bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"DonHang_{DateTime.Now:yyyyMMdd}.xlsx");
    }
}
```

### 6.5 Middleware `ExceptionMiddleware.cs`

**Vị trí**: `backend/CloudService.WebApi/Middleware/ExceptionMiddleware.cs`

```csharp
using System.Net;
using System.Text.Json;

namespace CloudService.WebApi.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try { await _next(context); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi không mong đợi");
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var response = new { status = 500, title = "Lỗi hệ thống", detail = ex.Message };
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
```

---

## Bước 7: Chạy Migration Tạo Database

```bash
cd backend
dotnet ef migrations add InitialCreate --project CloudService.Infrastructure --startup-project CloudService.WebApi
dotnet ef database update --project CloudService.Infrastructure --startup-project CloudService.WebApi
```

---

## Bước 8: Test API

```bash
cd backend/CloudService.WebApi
dotnet run
# Mở: http://localhost:5000/swagger
# Test Login: POST /api/auth/login  →  { "email": "admin@cloudvn.vn", "password": "Admin@123" }
# Copy token → Authorize → test các endpoint
```

---

---

# 🎨 TV3 — Frontend Public (Trang Công Khai)

**Mục tiêu**: Xây dựng 8 trang công khai với giao diện đẹp, responsive, kết nối API backend.

---

## Bước 1: Cài Thêm Dependencies

```bash
cd frontend
npm install axios
npm install lucide-react
npm install framer-motion
```

---

## Bước 2: Thiết Lập Cấu Trúc Thư Mục

```
frontend/src/
├── app/
│   ├── (public)/             ← Layout trang công khai
│   │   ├── layout.tsx        ← Header + Footer
│   │   ├── page.tsx          ← Trang chủ
│   │   ├── gioi-thieu/
│   │   │   └── page.tsx
│   │   ├── dich-vu/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── bang-gia/
│   │   │   └── page.tsx
│   │   ├── tin-tuc/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── lien-he/
│   │   │   └── page.tsx
│   │   └── doi-tac/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   ← Button, Card, Modal...
│   └── public/               ← Header, Footer, HeroBanner...
├── lib/
│   ├── api.ts                ← Axios instance
│   └── auth.ts               ← JWT token management
└── types/
    └── index.ts              ← TypeScript interfaces
```

---

## Bước 3: Tạo Axios Instance + TypeScript Types

### 3.1 `lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3.2 `types/index.ts`

```typescript
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ServicePlan {
  id: string;
  name: string;
  slug: string;
  specs?: string;
  isActive: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  authorName: string;
  publishedAt?: string;
  isPublished: boolean;
}

export interface OrderRequest {
  planId: string;
  serviceName: string;
  billingCycle: 'Monthly' | 'Yearly';
  customerName: string;
  email: string;
  phone: string;
}

export interface AffiliateApplication {
  fullName: string;
  email: string;
  phone: string;
  website?: string;
}
```

---

## Bước 4: Tạo Components Dùng Chung

### 4.1 `components/public/Header.tsx`

**Yêu cầu**:
- Logo + navigation responsive
- Menu: Trang chủ | Giới thiệu | Dịch vụ | Bảng giá | Tin tức | Liên hệ | Đối tác
- Hamburger menu trên mobile
- Hiệu ứng scroll (đổi background khi cuộn)

### 4.2 `components/public/Footer.tsx`

**Yêu cầu**:
- 4 cột: Về chúng tôi | Dịch vụ | Hỗ trợ | Liên hệ
- Social icons (lucide-react)
- Copyright

### 4.3 `components/ui/Button.tsx`, `Card.tsx`

Tạo component UI cơ bản với Tailwind CSS, hỗ trợ variant (primary, secondary, outline).

---

## Bước 5: Xây Dựng Từng Trang

### 5.1 Trang Chủ `(public)/page.tsx`

**Sections**:
1. **Hero Banner** — Tiêu đề lớn + CTA + animation (framer-motion)
2. **Danh mục dịch vụ** — Grid 3 cột, mỗi card có icon + tên (fetch `GET /api/service-categories`)
3. **Gói nổi bật** — 3 card (fetch `GET /api/service-plans`)
4. **Uptime badge** — "99.9% Uptime Guarantee"
5. **Testimonials** — Slider (data cứng)
6. **CTA cuối trang**

### 5.2 Trang Giới Thiệu `(public)/gioi-thieu/page.tsx`

1. Timeline lịch sử (data cứng)
2. Datacenter cards
3. Chứng chỉ ISO, SLA 99.9%
4. Đội ngũ

### 5.3 Trang Dịch Vụ `(public)/dich-vu/page.tsx`

1. Fetch `GET /api/service-categories`
2. Grid 3x2 các danh mục (VPS, Hosting, Domain...)
3. Click → `/dich-vu/[slug]`

### 5.4 Chi Tiết Dịch Vụ `(public)/dich-vu/[slug]/page.tsx`

1. Fetch gói theo category slug
2. Thông số (CPU, RAM, SSD)
3. Bảng giá tháng/năm toggle
4. Nút "Đặt dịch vụ" → `/lien-he?plan={planId}`

### 5.5 Trang Bảng Giá `(public)/bang-gia/page.tsx`

1. Fetch tất cả plans + prices
2. Toggle Tháng/Năm
3. Bảng so sánh tất cả gói
4. Highlight gói "Phổ biến nhất"

### 5.6 Trang Tin Tức `(public)/tin-tuc/page.tsx`

1. Fetch `GET /api/news-articles?page=1&pageSize=10`
2. Card danh sách (thumbnail, tiêu đề, ngày)
3. Phân trang + tìm kiếm + lọc category
4. Click → `/tin-tuc/[slug]`

### 5.7 Trang Liên Hệ `(public)/lien-he/page.tsx`

Multi-step form:
- **Bước 1**: Chọn gói (dropdown) + chu kỳ
- **Bước 2**: Thông tin KH (Tên, Email, SĐT)
- **Bước 3**: Xác nhận + gửi
- Submit → `POST /api/order-requests`

### 5.8 Trang Đối Tác `(public)/doi-tac/page.tsx`

1. Chính sách affiliate (data cứng)
2. Form đăng ký (FullName, Email, Phone, Website)
3. Submit → `POST /api/affiliate-applications`

---

## Bước 6: SEO + Responsive

```typescript
// Mỗi trang phải export metadata
export const metadata = {
  title: 'CloudVN - Dịch vụ Cloud hàng đầu Việt Nam',
  description: 'VPS, Hosting, Domain giá rẻ, tốc độ cao.',
  openGraph: { title: 'CloudVN', type: 'website' },
};
```

- Responsive mobile-first (320px, 768px, 1024px)
- Dùng `next/image` cho hình ảnh

> [!TIP]
> Trong khi chờ TV2 hoàn thành API, TV3 có thể dùng **mock data** để code giao diện trước, sau đó đổi sang gọi API thật.

---

---

# 🛡️ TV4 — Frontend Admin + DevOps + Unit Tests

---

## PHẦN A: Frontend Admin Dashboard

### Bước 1: Tạo Cấu Trúc Admin

```
frontend/src/app/
└── (admin)/
    ├── layout.tsx          ← Admin layout (Sidebar + Auth guard)
    ├── login/
    │   └── page.tsx
    └── dashboard/
        ├── page.tsx        ← Dashboard tổng quan
        ├── dich-vu/
        │   └── page.tsx    ← CRUD gói dịch vụ
        ├── tin-tuc/
        │   └── page.tsx    ← CRUD tin tức
        ├── don-hang/
        │   └── page.tsx    ← Quản lý đơn hàng
        ├── thong-ke/
        │   └── page.tsx    ← Biểu đồ
        └── audit-log/
            └── page.tsx
```

### Bước 2: Cài Dependencies

```bash
npm install recharts
npm install @tiptap/react @tiptap/starter-kit
npm install js-cookie @types/js-cookie
```

### Bước 3: Auth Guard `lib/auth.ts`

```typescript
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
export function setToken(token: string) { localStorage.setItem('token', token); }
export function removeToken() { localStorage.removeItem('token'); }
export function isAuthenticated() { return !!getToken(); }

export function parseToken(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}
```

### Bước 4: Admin Layout `(admin)/layout.tsx`

- Sidebar cố định (Dashboard | Dịch vụ | Tin tức | Đơn hàng | Thống kê | Audit Log)
- Header (tên user + Logout)
- Auth guard: chưa login → redirect `/admin/login`
- Kiểm tra role từ JWT (Admin vs Editor)

### Bước 5: Login `(admin)/login/page.tsx`

- Form: Email + Password
- Submit → `POST /api/auth/login`
- Lưu token → redirect `/dashboard`

### Bước 6: Dashboard `dashboard/page.tsx`

- 4 Stats cards (Tổng gói DV | Tổng đơn | Đơn chờ | Tổng bài viết)
- Biểu đồ cột: Đơn hàng theo tháng (Recharts BarChart)
- Biểu đồ tròn: Tỷ lệ đơn theo trạng thái (PieChart)
- Bảng 5 đơn mới nhất

### Bước 7: CRUD Gói DV `dashboard/dich-vu/page.tsx`

- DataTable danh sách gói
- Nút Thêm → Modal form
- Nút Sửa → Modal với data hiện tại
- Nút Xóa → Confirm dialog
- API: `GET/POST/PUT/DELETE /api/admin/service-plans`

### Bước 8: Quản Lý Đơn Hàng `dashboard/don-hang/page.tsx`

- DataTable + Filter theo trạng thái
- Dropdown đổi status → `PUT /api/admin/orders/{id}/status`
- Export Excel → `GET /api/admin/export/orders`

### Bước 9: CRUD Tin Tức `dashboard/tin-tuc/page.tsx`

- DataTable + TipTap rich text editor
- Publish/Unpublish toggle

### Bước 10: Audit Log `dashboard/audit-log/page.tsx`

- DataTable (User, Action, Entity, Thời gian)
- Filter theo user/thời gian

---

## PHẦN B: DevOps

### Bước 11: Dockerfile `backend/Dockerfile`

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY CloudService.sln .
COPY CloudService.Domain/*.csproj CloudService.Domain/
COPY CloudService.Application/*.csproj CloudService.Application/
COPY CloudService.Infrastructure/*.csproj CloudService.Infrastructure/
COPY CloudService.WebApi/*.csproj CloudService.WebApi/
RUN dotnet restore
COPY . .
RUN dotnet publish CloudService.WebApi/CloudService.WebApi.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "CloudService.WebApi.dll"]
```

### Bước 12: docker-compose.yml

```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "CloudService@123"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      ConnectionStrings__Default: "Server=sqlserver;Database=CloudServiceDb;User Id=sa;Password=CloudService@123;TrustServerCertificate=True"
      Jwt__Secret: "SuperSecretKeyForCloudServiceJWT2026!AtLeast32Chars"
      Jwt__Issuer: "CloudServiceAPI"
      Jwt__Audience: "CloudServiceClient"
    depends_on:
      - sqlserver

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: "http://api:8080/api"

volumes:
  sqlserver_data:
```

### Bước 13: GitHub Actions CI `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET 9
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - name: Build Backend
        run: dotnet build backend/CloudService.sln -c Release
      - name: Run Unit Tests
        run: dotnet test backend/CloudService.UnitTests/CloudService.UnitTests.csproj --collect:"XPlat Code Coverage"
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Build Frontend
        run: cd frontend && npm ci && npm run build
```

---

## PHẦN C: Unit Tests (≥16 test cases)

### Bước 14: Tạo Project xUnit

```bash
cd backend
dotnet new xunit -n CloudService.UnitTests
dotnet sln add CloudService.UnitTests/CloudService.UnitTests.csproj
cd CloudService.UnitTests
dotnet add reference ../CloudService.Application/CloudService.Application.csproj
dotnet add reference ../CloudService.Domain/CloudService.Domain.csproj
dotnet add package Moq
dotnet add package AutoMapper
```

### Bước 15: Viết Test Cases

#### `Tests/ServicePlanServiceTests.cs`

```csharp
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Moq;

namespace CloudService.UnitTests.Tests;

public class ServicePlanServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly ServicePlanService _service;

    public ServicePlanServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new ServicePlanService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 1
    public async Task GetAllPlans_ShouldReturnMappedDtos()
    {
        var plans = new List<ServicePlan> { new() { Name = "VPS Basic" } };
        var dtos = new List<ServicePlanDto> { new() { Name = "VPS Basic" } };
        _mockUoW.Setup(u => u.ServicePlans.GetAllAsync()).ReturnsAsync(plans);
        _mockMapper.Setup(m => m.Map<IEnumerable<ServicePlanDto>>(plans)).Returns(dtos);

        var result = await _service.GetAllAsync();
        Assert.Single(result);
        Assert.Equal("VPS Basic", result.First().Name);
    }

    [Fact] // Test 2
    public async Task GetByIdAsync_WhenNotFound_ShouldReturnNull()
    {
        _mockUoW.Setup(u => u.ServicePlans.GetByIdAsync(It.IsAny<Guid>()))
                .ReturnsAsync((ServicePlan?)null);
        var result = await _service.GetByIdAsync(Guid.NewGuid());
        Assert.Null(result);
    }

    [Fact] // Test 3
    public async Task GetByIdAsync_WhenFound_ShouldReturnDto()
    {
        var plan = new ServicePlan { Name = "VPS Pro" };
        var dto = new ServicePlanDto { Name = "VPS Pro" };
        _mockUoW.Setup(u => u.ServicePlans.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(plan);
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(plan)).Returns(dto);

        var result = await _service.GetByIdAsync(Guid.NewGuid());
        Assert.NotNull(result);
        Assert.Equal("VPS Pro", result!.Name);
    }

    [Fact] // Test 4
    public async Task CreateAsync_ShouldGenerateSlug()
    {
        var createDto = new CreateServicePlanDto { Name = "VPS Pro Max", CategoryId = Guid.NewGuid() };
        var entity = new ServicePlan { Name = "VPS Pro Max" };
        _mockMapper.Setup(m => m.Map<ServicePlan>(createDto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(entity)).Returns(new ServicePlanDto());
        _mockUoW.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        await _service.CreateAsync(createDto);
        Assert.Equal("vps-pro-max", entity.Slug);
    }

    [Fact] // Test 5
    public async Task CreateAsync_ShouldCallSaveChanges()
    {
        var createDto = new CreateServicePlanDto { Name = "Test", CategoryId = Guid.NewGuid() };
        _mockMapper.Setup(m => m.Map<ServicePlan>(createDto)).Returns(new ServicePlan());
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(It.IsAny<ServicePlan>())).Returns(new ServicePlanDto());

        await _service.CreateAsync(createDto);
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
```

#### `Tests/OrderServiceTests.cs`

```csharp
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Moq;

namespace CloudService.UnitTests.Tests;

public class OrderServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new OrderService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 6
    public async Task CreateOrder_ShouldSetStatusToNew()
    {
        var dto = new CreateOrderDto { PlanId = Guid.NewGuid(), ServiceName = "VPS", CustomerName = "Nguyễn A", Email = "a@test.com", Phone = "012" };
        var entity = new OrderRequest();
        _mockMapper.Setup(m => m.Map<OrderRequest>(dto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<OrderDto>(entity)).Returns(new OrderDto());

        await _service.CreateOrderAsync(dto);
        Assert.Equal(OrderStatus.New, entity.Status);
    }

    [Fact] // Test 7
    public async Task CreateOrder_ShouldCallSaveChanges()
    {
        var dto = new CreateOrderDto { PlanId = Guid.NewGuid(), ServiceName = "VPS" };
        _mockMapper.Setup(m => m.Map<OrderRequest>(dto)).Returns(new OrderRequest());
        _mockMapper.Setup(m => m.Map<OrderDto>(It.IsAny<OrderRequest>())).Returns(new OrderDto());

        await _service.CreateOrderAsync(dto);
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact] // Test 8
    public async Task GetPendingOrders_ShouldCallRepository()
    {
        var orders = new List<OrderRequest>();
        _mockUoW.Setup(u => u.OrderRequests.GetPendingOrdersAsync()).ReturnsAsync(orders);
        _mockMapper.Setup(m => m.Map<IEnumerable<OrderDto>>(orders)).Returns(new List<OrderDto>());

        await _service.GetPendingOrdersAsync();
        _mockUoW.Verify(u => u.OrderRequests.GetPendingOrdersAsync(), Times.Once);
    }

    [Fact] // Test 9
    public async Task UpdateOrderStatus_WhenNotFound_ReturnFalse()
    {
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((OrderRequest?)null);
        var result = await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Completed);
        Assert.False(result);
    }

    [Fact] // Test 10
    public async Task UpdateOrderStatus_WhenFound_ReturnTrueAndUpdate()
    {
        var order = new OrderRequest { Status = OrderStatus.New };
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(order);

        var result = await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Completed);
        Assert.True(result);
        Assert.Equal(OrderStatus.Completed, order.Status);
    }

    [Fact] // Test 11
    public async Task UpdateOrderStatus_ShouldCallUpdate()
    {
        var order = new OrderRequest();
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(order);

        await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Processing);
        _mockUoW.Verify(u => u.OrderRequests.Update(order), Times.Once);
    }
}
```

#### `Tests/CategoryServiceTests.cs`

```csharp
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Moq;

namespace CloudService.UnitTests.Tests;

public class CategoryServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new CategoryService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 12
    public async Task GetAllAsync_ShouldReturnActiveCategories()
    {
        var categories = new List<ServiceCategory> { new() { Name = "VPS" }, new() { Name = "Hosting" } };
        var dtos = new List<CategoryDto> { new() { Name = "VPS" }, new() { Name = "Hosting" } };
        _mockUoW.Setup(u => u.ServiceCategories.GetActiveCategoriesAsync()).ReturnsAsync(categories);
        _mockMapper.Setup(m => m.Map<IEnumerable<CategoryDto>>(categories)).Returns(dtos);

        var result = await _service.GetAllAsync();
        Assert.Equal(2, result.Count());
    }

    [Fact] // Test 13
    public async Task CreateAsync_ShouldGenerateSlug()
    {
        var createDto = new CreateCategoryDto { Name = "Cloud Server" };
        var entity = new ServiceCategory { Name = "Cloud Server" };
        _mockMapper.Setup(m => m.Map<ServiceCategory>(createDto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<CategoryDto>(entity)).Returns(new CategoryDto());

        await _service.CreateAsync(createDto);
        Assert.Equal("cloud-server", entity.Slug);
    }
}
```

#### `Tests/AffiliateServiceTests.cs`

```csharp
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Moq;

namespace CloudService.UnitTests.Tests;

public class AffiliateServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly AffiliateService _service;

    public AffiliateServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new AffiliateService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 14
    public async Task SubmitApplication_ShouldSetStatusToNew()
    {
        var dto = new CreateAffiliateDto { FullName = "Test", Email = "test@test.com", Phone = "012" };
        var entity = new AffiliateApplication();
        _mockMapper.Setup(m => m.Map<AffiliateApplication>(dto)).Returns(entity);

        await _service.SubmitApplicationAsync(dto);
        Assert.Equal(OrderStatus.New, entity.Status);
    }

    [Fact] // Test 15
    public async Task SubmitApplication_ShouldReturnTrue()
    {
        var dto = new CreateAffiliateDto { FullName = "Test", Email = "test@test.com", Phone = "012" };
        _mockMapper.Setup(m => m.Map<AffiliateApplication>(dto)).Returns(new AffiliateApplication());

        var result = await _service.SubmitApplicationAsync(dto);
        Assert.True(result);
    }

    [Fact] // Test 16
    public async Task SubmitApplication_ShouldCallSaveChanges()
    {
        var dto = new CreateAffiliateDto { FullName = "Test", Email = "test@test.com", Phone = "012" };
        _mockMapper.Setup(m => m.Map<AffiliateApplication>(dto)).Returns(new AffiliateApplication());

        await _service.SubmitApplicationAsync(dto);
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
```

### Bước 16: Chạy Tests

```bash
cd backend
dotnet test CloudService.UnitTests --verbosity normal
# Kỳ vọng: 16/16 tests pass ✅
```

---

## 📊 Tổng Kết

| Thành viên | Số file cần tạo | Ước tính thời gian |
|---|---|---|
| **TV2** | ~15 files (Infrastructure + WebApi) | 5-7 ngày |
| **TV3** | ~20 files (Components + Pages) | 6-8 ngày |
| **TV4** | ~18 files (Admin + Docker + Tests) | 7-9 ngày |

> [!CAUTION]
> **TV2 là bottleneck!** TV3 và TV4 cần API của TV2. TV2 nên hoàn thành Bước 1→7 trong **3 ngày đầu**.

> [!TIP]
> Trong khi chờ TV2, TV3 dùng **mock data** để code giao diện trước, sau đó đổi sang API thật.
