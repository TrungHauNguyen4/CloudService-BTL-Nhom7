using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Infrastructure.Services;

public class PromotionService : IPromotionService
{
    private readonly IUnitOfWork _unitOfWork;

    public PromotionService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<PromotionDto>> GetAllAsync()
    {
        var promos = await _unitOfWork.Promotions.GetAllAsync();
        return promos.Select(p => new PromotionDto
        {
            Id = p.Id,
            Code = p.Code,
            DiscountPercentage = p.DiscountPercentage,
            ExpiryDate = p.ExpiryDate,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
        });
    }

    public async Task<PromotionDto?> GetByIdAsync(Guid id)
    {
        var p = await _unitOfWork.Promotions.GetByIdAsync(id);
        if (p == null) return null;
        
        return new PromotionDto
        {
            Id = p.Id,
            Code = p.Code,
            DiscountPercentage = p.DiscountPercentage,
            ExpiryDate = p.ExpiryDate,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
        };
    }

    public async Task<PromotionDto?> GetByCodeAsync(string code)
    {
        var p = await _unitOfWork.Promotions.GetByCodeAsync(code);
        if (p == null) return null;
        
        return new PromotionDto
        {
            Id = p.Id,
            Code = p.Code,
            DiscountPercentage = p.DiscountPercentage,
            ExpiryDate = p.ExpiryDate,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
        };
    }

    public async Task<PromotionDto> CreateAsync(CreatePromotionDto dto)
    {
        var promo = new Promotion
        {
            Id = Guid.NewGuid(),
            Code = dto.Code,
            DiscountPercentage = dto.DiscountPercentage,
            ExpiryDate = dto.ExpiryDate,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.Promotions.AddAsync(promo);
        await _unitOfWork.SaveChangesAsync();
        
        return new PromotionDto
        {
            Id = promo.Id,
            Code = promo.Code,
            DiscountPercentage = promo.DiscountPercentage,
            ExpiryDate = promo.ExpiryDate,
            IsActive = promo.IsActive,
            CreatedAt = promo.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(Guid id, UpdatePromotionDto dto)
    {
        var promo = await _unitOfWork.Promotions.GetByIdAsync(id);
        if (promo == null) return false;

        promo.Code = dto.Code;
        promo.DiscountPercentage = dto.DiscountPercentage;
        promo.ExpiryDate = dto.ExpiryDate;
        promo.IsActive = dto.IsActive;

        _unitOfWork.Promotions.Update(promo);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var promo = await _unitOfWork.Promotions.GetByIdAsync(id);
        if (promo == null) return false;

        _unitOfWork.Promotions.Delete(promo);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}

