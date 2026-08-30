# Bước 1: Mượn môi trường .NET 9 SDK của Microsoft để tiến hành Build code
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Sao chép các file cấu trúc thư viện để Restore trước (giúp tải nhanh hơn nhờ cache)
COPY ["CloudService.WebApi/CloudService.WebApi.csproj", "CloudService.WebApi/"]
COPY ["CloudService.Application/CloudService.Application.csproj", "CloudService.Application/"]
COPY ["CloudService.Domain/CloudService.Domain.csproj", "CloudService.Domain/"]
COPY ["CloudService.Infrastructure/CloudService.Infrastructure.csproj", "CloudService.Infrastructure/"]
RUN dotnet restore "CloudService.WebApi/CloudService.WebApi.csproj"

# Sao chép toàn bộ mã nguồn còn lại vào
COPY . .
WORKDIR "/src/CloudService.WebApi"

# Build và Publish dự án ra phiên bản Release (Tối ưu hóa tốc độ)
RUN dotnet build "CloudService.WebApi.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "CloudService.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Bước 2: Bỏ bớt SDK nặng nề, chỉ lấy môi trường Runtime siêu nhẹ để chạy thực tế
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_HTTP_PORTS=80

# Khai báo cổng 80 cho container
EXPOSE 80 
ENTRYPOINT ["dotnet", "CloudService.WebApi.dll"]
