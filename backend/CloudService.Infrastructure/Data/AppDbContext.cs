using CloudService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<ServiceCategory> ServiceCategories { get; set; }
    public DbSet<ServicePlan> ServicePlans { get; set; }
    public DbSet<OrderRequest> OrderRequests { get; set; }
    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<AffiliateApplication> AffiliateApplications { get; set; }
    public DbSet<Promotion> Promotions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        // ===== OrderRequest =====
        modelBuilder.Entity<OrderRequest>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);

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
        // --- Danh mục dịch vụ ---
        var catVps = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var catHosting = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var catDomain = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

        modelBuilder.Entity<ServiceCategory>().HasData(
            new ServiceCategory
            {
                Id = catVps,
                Name = "VPS",
                Slug = "vps",
                Description = "Máy chủ ảo hiệu năng cao",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServiceCategory
            {
                Id = catHosting,
                Name = "Hosting",
                Slug = "hosting",
                Description = "Web hosting tốc độ nhanh",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServiceCategory
            {
                Id = catDomain,
                Name = "Domain",
                Slug = "domain",
                Description = "Tên miền giá rẻ",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            }
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
            new ServicePlan
            {
                Id = plan1,
                CategoryId = catVps,
                Name = "VPS Basic",
                Slug = "vps-basic",
                Specs = "1 vCPU / 1GB RAM / 20GB SSD",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan2,
                CategoryId = catVps,
                Name = "VPS Pro",
                Slug = "vps-pro",
                Specs = "2 vCPU / 4GB RAM / 60GB SSD",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan3,
                CategoryId = catVps,
                Name = "VPS Business",
                Slug = "vps-business",
                Specs = "4 vCPU / 8GB RAM / 120GB SSD",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan4,
                CategoryId = catVps,
                Name = "VPS Enterprise",
                Slug = "vps-enterprise",
                Specs = "8 vCPU / 16GB RAM / 240GB SSD",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan5,
                CategoryId = catHosting,
                Name = "Hosting Starter",
                Slug = "hosting-starter",
                Specs = "5GB SSD / 50GB BW / 1 Website",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan6,
                CategoryId = catHosting,
                Name = "Hosting Business",
                Slug = "hosting-business",
                Specs = "20GB SSD / Unlimited BW / 10 Websites",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan7,
                CategoryId = catHosting,
                Name = "Hosting Premium",
                Slug = "hosting-premium",
                Specs = "50GB SSD / Unlimited BW / Unlimited Websites",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan8,
                CategoryId = catDomain,
                Name = "Domain .vn",
                Slug = "domain-vn",
                Specs = "Tên miền .vn giá rẻ",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan9,
                CategoryId = catDomain,
                Name = "Domain .com",
                Slug = "domain-com",
                Specs = "Tên miền .com quốc tế",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new ServicePlan
            {
                Id = plan10,
                CategoryId = catDomain,
                Name = "Domain .net",
                Slug = "domain-net",
                Specs = "Tên miền .net quốc tế",
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
