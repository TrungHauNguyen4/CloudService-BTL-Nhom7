using System.Security.Claims;
using System.Text.Json;
using CloudService.Application.Interfaces;

namespace CloudService.WebApi.Middleware;

public class AuditMiddleware
{
    private readonly RequestDelegate _next;

    public AuditMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context,
        IAuditLogService auditLogService)
    {
        var method = context.Request.Method;

        // Chỉ audit các thao tác thay đổi dữ liệu
        if (method != HttpMethods.Post &&
            method != HttpMethods.Put &&
            method != HttpMethods.Delete)
        {
            await _next(context);
            return;
        }

        // Chỉ audit API Admin
        if (!context.Request.Path.StartsWithSegments("/api/admin"))
        {
            await _next(context);
            return;
        }

        var userIdClaim = context.User.FindFirst(
            ClaimTypes.NameIdentifier);

        if (userIdClaim == null ||
            !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            await _next(context);
            return;
        }

        var action = method switch
        {
            "POST" => "Create",
            "PUT" => "Update",
            "DELETE" => "Delete",
            _ => method
        };

        var entityType = GetEntityType(context.Request.Path);

        var entityId = GetEntityId(context.Request.Path);

        await _next(context);

        // Chỉ ghi log khi request thành công
        if (context.Response.StatusCode >= 200 &&
            context.Response.StatusCode < 300)
        {
            await auditLogService.LogAsync(
                userId,
                action,
                entityType,
                entityId,
                null,
                null);
        }
    }

    private static string GetEntityType(PathString path)
    {
        var segments = path.Value?
            .Split(
                '/',
                StringSplitOptions.RemoveEmptyEntries)
            ?? Array.Empty<string>();

        if (segments.Length >= 3)
        {
            return segments[2];
        }

        return "Unknown";
    }

    private static string GetEntityId(PathString path)
    {
        var segments = path.Value?
            .Split(
                '/',
                StringSplitOptions.RemoveEmptyEntries)
            ?? Array.Empty<string>();

        if (segments.Length >= 4)
        {
            return segments[3];
        }

        return string.Empty;
    }
}