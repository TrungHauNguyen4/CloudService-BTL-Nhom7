/*Design Pattern nâng cao (Result Pattern). Thay vì dùng try-catch và ném ra Exception (gây chậm hệ thống), ta dùng class Result<T> để bọc dữ liệu trả về kèm trạng thái (Thành công/Thất bại, kèm câu lỗi).*/
namespace CloudService.Domain.Common;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string? ErrorMessage { get; }

    private Result(bool isSuccess, T? data, string? errorMessage)
    {
        IsSuccess = isSuccess;
        Data = data;
        ErrorMessage = errorMessage;
    }

    public static Result<T> Success(T data) => new(true, data, null);
    public static Result<T> Failure(string errorMessage) => new(false, default, errorMessage);
}
