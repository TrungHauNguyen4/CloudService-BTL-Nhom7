//File này định nghĩa rule: Name không được trống và không quá 100 ký tự. CategoryId bắt buộc phải có. Nếu Frontend gửi thiếu, API tự động trả về lỗi 400 Bad Request kèm câu thông báo Tiếng Việt.
using FluentValidation;//dùng thư viện FluentValidation.
using CloudService.Application.DTOs;

namespace CloudService.Application.Validators;

public class CreateServicePlanDtoValidator : AbstractValidator<CreateServicePlanDto>
{
    public CreateServicePlanDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên gói dịch vụ không được để trống.")
            .MaximumLength(100).WithMessage("Tên gói không được vượt quá 100 ký tự.");
            
        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Vui lòng chọn danh mục dịch vụ.");
    }
}
