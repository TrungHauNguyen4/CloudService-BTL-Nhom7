# 🚀 Hướng Dẫn Deploy — Dự Án Cloud Service (Nhóm 7)

> **Người viết:** Thành viên phụ trách Deploy  
> **Ngày cập nhật:** 27/08/2026  
> **Phiên bản:** 1.0.0  
> **Mục đích:** Hướng dẫn triển khai toàn bộ hệ thống lên môi trường Production.  
> **Xem xét bởi:** Leader dự án — Nhóm 7

---

## 📋 Mục Lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Yêu cầu trước khi bắt đầu](#2-yêu-cầu-trước-khi-bắt-đầu)
3. [Bước 1 — Thiết lập Azure SQL Database](#3-bước-1--thiết-lập-azure-sql-database)
4. [Bước 2 — Thiết lập Resend (Email)](#4-bước-2--thiết-lập-resend-email)
5. [Bước 3 — Thiết lập PayOS (Thanh toán)](#5-bước-3--thiết-lập-payos-thanh-toán)
6. [Bước 4 — Cấu hình GitHub Secrets](#6-bước-4--cấu-hình-github-secrets)
7. [Bước 5 — Deploy Backend lên Render (Docker)](#7-bước-5--deploy-backend-lên-render-docker)
8. [Bước 6 — Deploy Frontend lên Vercel](#8-bước-6--deploy-frontend-lên-vercel)
9. [Bước 7 — Cấu hình GitHub Actions CI/CD](#9-bước-7--cấu-hình-github-actions-cicd)
10. [Bước 8 — Chạy Migration Database lần đầu](#10-bước-8--chạy-migration-database-lần-đầu)
11. [Kiểm tra sau khi deploy](#11-kiểm-tra-sau-khi-deploy)
12. [Xử lý sự cố thường gặp](#12-xử-lý-sự-cố-thường-gặp)
13. [Quy trình rollback](#13-quy-trình-rollback)
14. [Bảng tổng hợp biến môi trường](#14-bảng-tổng-hợp-biến-môi-trường)

---

## 1. Tổng Quan Kiến Trúc

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRODUCTION STACK                          │
├──────────────────┬──────────────────┬────────────────────────────┤
│   FRONTEND       │   BACKEND        │   EXTERNAL SERVICES         │
│   Next.js 16     │   .NET 9 WebAPI  │                            │
│   TypeScript     │   [Docker]       │  ┌──────────────────────┐  │
│                  │                  │  │  Azure SQL Database  │  │
│   ┌──────────┐  │   ┌──────────┐   │  │  • SQL Server        │  │
│   │  Vercel  │  │   │  Render  │   │  │  • EF Core Migration │  │
│   │  (Auto)  │◄─┼───┤  Port 80 │◄──┼──│  • Free Tier (32GB)  │  │
│   └──────────┘  │   └──────────┘   │  └──────────────────────┘  │
│                  │                  │  ┌──────────────────────┐  │
│                  │                  │  │  Resend              │  │
│                  │                  │  │  • Gửi Email OTP     │  │
│                  │                  │  │  • Email thông báo   │  │
│                  │                  │  └──────────────────────┘  │
│                  │                  │  ┌──────────────────────┐  │
│                  │                  │  │  PayOS               │  │
│                  │                  │  │  • Thanh toán QR     │  │
│                  │                  │  │  • Webhook callback  │  │
│                  │                  │  └──────────────────────┘  │
└──────────────────┴──────────────────┴────────────────────────────┘

CI/CD Pipeline:
  Push to main → GitHub Actions → Build & Test
    → Trigger Render Deploy Hook  (Backend Docker)
    → Deploy to Vercel            (Frontend)
```

### Phân vai từng dịch vụ

| Tầng | Công nghệ | Nền tảng | Ghi chú |
|---|---|---|---|
| Frontend | Next.js 16 + TypeScript | **Vercel** | Auto-deploy từ nhánh `main` |
| Backend | .NET 9 WebAPI | **Render** | Deploy qua Docker container |
| Database | SQL Server (EF Core) | **Azure SQL Database** | Free tier 32GB, giữ nguyên tech stack |
| Email | REST API | **Resend** | Gửi email giao dịch / OTP |
| Thanh toán | QR Code / VietQR | **PayOS** | Webhook HTTPS callback |
| CI/CD | GitHub Actions | **GitHub** | Không dùng GitHub Desktop |

---

## 2. Yêu Cầu Trước Khi Bắt Đầu

### Tài khoản cần tạo

- [ ] **GitHub** — Có quyền Admin vào repo của nhóm
- [ ] **Microsoft Azure** — [portal.azure.com](https://portal.azure.com) _(dùng email sinh viên để nhận credit miễn phí)_
- [ ] **Render** — [render.com](https://render.com) _(đăng nhập bằng GitHub)_
- [ ] **Vercel** — [vercel.com](https://vercel.com) _(đăng nhập bằng GitHub)_
- [ ] **Resend** — [resend.com](https://resend.com) _(miễn phí, 100 email/ngày)_
- [ ] **PayOS** — [payos.vn](https://payos.vn) _(cần xác minh tài khoản)_
- [ ] **Docker Hub** — [hub.docker.com](https://hub.docker.com) _(miễn phí, lưu Docker image)_

### Công cụ cần có trên máy

```bash
# Kiểm tra các công cụ đã cài chưa
dotnet --version    # >= 9.0
docker --version    # Docker Desktop
git --version       # Git CLI
node --version      # Node.js >= 18
```

> ℹ️ **Không cần** cài GitHub Desktop — mọi thao tác đều qua `git` CLI và GitHub Actions.

---

## 3. Bước 1 — Thiết Lập Azure SQL Database

> **Lý do chọn Azure SQL:** Tương thích 100% với SQL Server — không cần thay đổi bất kỳ dòng code hay migration nào trong dự án.

### 3.1. Tạo Azure SQL Database

1. Đăng nhập [portal.azure.com](https://portal.azure.com)
2. Tìm kiếm **"SQL databases"** → **Create**
3. Điền thông tin:

| Trường | Giá trị |
|---|---|
| **Subscription** | Chọn subscription của bạn |
| **Resource group** | Tạo mới: `rg-cloudservice` |
| **Database name** | `CloudServiceDb` |
| **Server** | Tạo mới — xem mục 3.2 |
| **Workload environment** | `Development` |
| **Backup storage redundancy** | `Locally-redundant backup storage` |

4. Nhấn **Configure database** → chọn **Free offer** _(nếu account mới)_ hoặc **Basic** _(~$5/tháng)_

### 3.2. Tạo SQL Server mới

Khi tạo Database, nhấn **Create new** tại mục Server:

| Trường | Giá trị |
|---|---|
| **Server name** | `cloudservice-nhom7` _(phải là tên duy nhất toàn cầu)_ |
| **Location** | `Southeast Asia` |
| **Authentication method** | `Use SQL authentication` |
| **Server admin login** | `cloudadmin` |
| **Password** | Đặt mật khẩu mạnh — **lưu lại ngay** |

5. Nhấn **Review + create** → **Create** — chờ ~3 phút.

### 3.3. Cấu hình Firewall — Cho phép Render kết nối

1. Vào resource **SQL Server** vừa tạo → **Networking**
2. Bật **"Allow Azure services and resources to access this server"** → **Yes**
3. Nhấn **Save**

> ⚠️ **Bắt buộc!** Nếu bỏ qua bước này, Backend trên Render sẽ không thể kết nối vào database.

### 3.4. Lấy Connection String

1. Vào resource **SQL Database** → **Connection strings** → tab **ADO.NET**
2. Copy chuỗi kết nối:

```
Server=tcp:cloudservice-nhom7.database.windows.net,1433;Initial Catalog=CloudServiceDb;Persist Security Info=False;User ID=cloudadmin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

3. **Thay `{your_password}`** bằng mật khẩu thực và lưu lại — sẽ dùng ở Bước 5.

> ✅ Đây chính xác là format connection string mà EF Core `.UseSqlServer()` trong dự án đang dùng — **không cần sửa gì trong code**.

---

## 4. Bước 2 — Thiết Lập Resend (Email)

### 4.1. Lấy API Key

1. Đăng nhập [resend.com](https://resend.com)
2. Vào **API Keys** → **Create API Key**
3. Đặt tên `cloudservice-production`, quyền **Full Access**
4. Copy API key dạng `re_xxxxxxxxxxxx`

> ⚠️ **Lưu ngay!** API key chỉ được hiển thị một lần duy nhất.

### 4.2. Xác minh Domain (để email không vào spam)

1. Vào **Domains** → **Add Domain** → nhập domain của nhóm _(vd: `cloudservice-nhom7.io.vn`)_
2. Thêm các DNS record mà Resend yêu cầu (TXT, MX, DKIM) vào nhà cung cấp domain
3. Nhấn **Verify** — thường mất 5–30 phút

> 💡 **Chưa có domain?** Dùng địa chỉ sandbox `onboarding@resend.dev` để test. Sau này có domain thì cập nhật lại.

### 4.3. Biến môi trường cho Backend

```env
Resend__ApiKey=re_xxxxxxxxxxxx
Resend__FromEmail=noreply@cloudservice-nhom7.io.vn
Resend__FromName=Cloud Service Nhóm 7
```

---

## 5. Bước 3 — Thiết Lập PayOS (Thanh Toán)

### 5.1. Lấy thông tin API

1. Đăng nhập [business.payos.vn](https://business.payos.vn)
2. Vào **Cài đặt** → **API Keys** → lấy 3 giá trị:
   - `Client ID`
   - `API Key`
   - `Checksum Key`

### 5.2. Cấu hình Webhook URL

> ⚠️ Làm bước này **sau khi đã deploy Backend lên Render** (Bước 5) và đã có URL thật.

1. Vào **Webhook** → **Cài đặt URL Webhook**
2. Nhập: `https://cloudservice-api.onrender.com/api/payment/webhook`
3. PayOS sẽ gửi POST tới URL này sau mỗi giao dịch hoàn tất / thất bại.

> 💡 **Test Webhook trước:** Dùng [webhook.site](https://webhook.site) để lấy URL test tạm, cấu hình vào PayOS để kiểm tra dữ liệu trả về, sau đó đổi lại URL thật.

### 5.3. Biến môi trường cho Backend

```env
PayOS__ClientId=xxxxxxxx
PayOS__ApiKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PayOS__ChecksumKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 6. Bước 4 — Cấu Hình GitHub Secrets

> **Bắt buộc thực hiện** trước khi chạy GitHub Actions. Các secrets này được mã hóa và không ai xem được nội dung sau khi lưu.

**Cách thêm:** GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Secrets cho Backend

| Tên Secret | Giá trị | Lấy từ đâu |
|---|---|---|
| `RENDER_DEPLOY_HOOK` | `https://api.render.com/deploy/srv-xxx?key=xxx` | Render → Settings → Deploy Hook _(Bước 5.5)_ |
| `DOCKERHUB_USERNAME` | `your_dockerhub_username` | Docker Hub account |
| `DOCKERHUB_TOKEN` | `dckr_pat_xxx` | Docker Hub → Account Settings → Security |

### Secrets cho Frontend

| Tên Secret | Giá trị | Lấy từ đâu |
|---|---|---|
| `VERCEL_TOKEN` | `xxx` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `team_xxx` hoặc `user_xxx` | Bước 6.4 |
| `VERCEL_PROJECT_ID` | `prj_xxx` | Bước 6.4 |
| `NEXT_PUBLIC_API_URL` | `https://cloudservice-api.onrender.com/api` | URL Render sau Bước 5 |

> 💡 **Tạo JWT Secret mạnh** _(dùng khi set ENV trên Render)_:
> ```powershell
> # PowerShell — tạo chuỗi ngẫu nhiên 64 ký tự
> -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
> ```

---

## 7. Bước 5 — Deploy Backend Lên Render (Docker)

### 7.1. Kiểm tra Dockerfile Backend

File `backend/Dockerfile` của dự án đã đúng, **không cần chỉnh sửa**:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CloudService.WebApi/CloudService.WebApi.csproj", "CloudService.WebApi/"]
COPY ["CloudService.Application/CloudService.Application.csproj", "CloudService.Application/"]
COPY ["CloudService.Domain/CloudService.Domain.csproj", "CloudService.Domain/"]
COPY ["CloudService.Infrastructure/CloudService.Infrastructure.csproj", "CloudService.Infrastructure/"]
RUN dotnet restore "CloudService.WebApi/CloudService.WebApi.csproj"
COPY . .
WORKDIR "/src/CloudService.WebApi"
RUN dotnet build "CloudService.WebApi.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "CloudService.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "CloudService.WebApi.dll"]
```

### 7.2. Cập nhật CORS trong `Program.cs`

Tìm đoạn CORS trong `Program.cs` và cập nhật để whitelist domain Vercel:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",                   // Dev local
                "https://cloudservice-nhom7.vercel.app"   // URL Vercel (thay bằng URL thật sau Bước 6)
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
```

> 💡 Nếu chưa biết URL Vercel chính xác, có thể push 2 lần: lần đầu deploy, lần hai cập nhật CORS sau khi có URL.

### 7.3. Tạo Web Service trên Render

1. Truy cập [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
2. Chọn **Deploy from a Git repository** → Connect GitHub → chọn repo nhóm
3. Cấu hình:

| Trường | Giá trị |
|---|---|
| **Name** | `cloudservice-api` |
| **Region** | `Singapore (Southeast Asia)` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |
| **Docker Context** | `./` |
| **Auto-Deploy** | **`No`** — GitHub Actions sẽ trigger deploy |

4. Nhấn **Create Web Service**.

### 7.4. Thêm Environment Variables trên Render

Trong service vừa tạo → **Environment** → thêm từng biến:

```env
# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80

# Database (Azure SQL Server)
ConnectionStrings__Default=Server=tcp:cloudservice-nhom7.database.windows.net,1433;Initial Catalog=CloudServiceDb;Persist Security Info=False;User ID=cloudadmin;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

# JWT Authentication
Jwt__Secret=YOUR_RANDOM_SECRET_MIN_32_CHARS
Jwt__Issuer=CloudServiceAPI
Jwt__Audience=CloudServiceClient

# Email (Resend)
Resend__ApiKey=re_xxxxxxxxxxxx
Resend__FromEmail=noreply@cloudservice-nhom7.io.vn
Resend__FromName=Cloud Service Nhóm 7

# Thanh toán (PayOS)
PayOS__ClientId=xxxxxxxx
PayOS__ApiKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PayOS__ChecksumKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7.5. Lấy Deploy Hook URL

1. Vào service **cloudservice-api** → **Settings**
2. Cuộn xuống mục **Deploy Hook** → copy URL
3. Lưu URL này vào GitHub Secret `RENDER_DEPLOY_HOOK` _(Bước 4)_

### 7.6. Kiểm tra deploy lần đầu

Sau khi tạo service, Render sẽ tự build lần đầu. Vào **Logs** để theo dõi.  
Thành công khi thấy:

```
==> Build successful 🎉
==> Your service is live at https://cloudservice-api.onrender.com
```

---

## 8. Bước 6 — Deploy Frontend Lên Vercel

### 8.1. Import Project vào Vercel

1. Truy cập [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Kết nối GitHub → chọn repo của nhóm
3. Cấu hình:

| Trường | Giá trị |
|---|---|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` _(để mặc định)_ |
| **Install Command** | `npm ci` |
| **Node.js Version** | `18.x` |

4. Nhấn **Deploy** — Vercel sẽ build và deploy lần đầu tự động.

### 8.2. Thêm Environment Variables trên Vercel

Vào **Project Settings** → **Environment Variables**:

| Tên | Giá trị | Môi trường |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://cloudservice-api.onrender.com/api` | Production, Preview, Development |

> ⚠️ Sau khi thêm ENV, cần **Redeploy** để có hiệu lực: **Deployments** → chọn bản mới nhất → **Redeploy**.

### 8.3. Ghi lại URL Vercel

Sau khi deploy thành công, Vercel cấp URL dạng:
```
https://cloudservice-nhom7.vercel.app
```

Dùng URL này để cập nhật CORS trong `Program.cs` (Bước 5.2).

### 8.4. Lấy thông tin cho GitHub Secrets

```bash
# Chạy trong thư mục frontend trên máy LOCAL
cd frontend
npx vercel login         # Đăng nhập Vercel CLI
npx vercel link          # Link với project vừa tạo (chọn existing project)

# Xem kết quả
cat .vercel/project.json
# {
#   "orgId": "team_xxxxx",      ← VERCEL_ORG_ID
#   "projectId": "prj_xxxxx"    ← VERCEL_PROJECT_ID
# }
```

Lấy **Personal Access Token**: [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create** → lưu vào `VERCEL_TOKEN`.

---

## 9. Bước 7 — Cấu Hình GitHub Actions CI/CD

### 9.1. Giữ nguyên file `ci.yml` hiện có

File `.github/workflows/ci.yml` đang chạy tốt cho việc kiểm thử — **giữ nguyên, không xóa**.

### 9.2. Tạo thêm file `deploy.yml` cho Production

Tạo file `.github/workflows/deploy.yml`:

```yaml
# .github/workflows/deploy.yml
name: 🚀 CI/CD — Cloud Service Production

on:
  push:
    branches:
      - main        # Deploy khi push/merge vào main
  pull_request:
    branches:
      - main        # PR vào main chỉ chạy test, KHÔNG deploy

env:
  DOTNET_VERSION: '9.0.x'
  NODE_VERSION: '18'

jobs:

  # ═══════════════════════════════════════════
  # JOB 1: Kiểm thử Backend .NET
  # Chạy với MỌI pull request và push
  # ═══════════════════════════════════════════
  test-backend:
    name: 🧪 Test Backend (.NET 9)
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout mã nguồn
        uses: actions/checkout@v4

      - name: ⚙️ Cài đặt .NET ${{ env.DOTNET_VERSION }}
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}

      - name: 📦 Restore dependencies (WebApi)
        run: dotnet restore backend/CloudService.WebApi/CloudService.WebApi.csproj

      - name: 📦 Restore dependencies (UnitTests)
        run: dotnet restore backend/CloudService.UnitTests/CloudService.UnitTests.csproj

      - name: 🔨 Build Backend
        run: dotnet build backend/CloudService.WebApi/CloudService.WebApi.csproj --no-restore -c Release

      - name: ✅ Chạy Unit Tests
        run: dotnet test backend/CloudService.UnitTests/CloudService.UnitTests.csproj --no-restore --verbosity normal

  # ═══════════════════════════════════════════
  # JOB 2: Build & Push Docker Image
  # Chỉ chạy khi push/merge vào main
  # ═══════════════════════════════════════════
  build-docker:
    name: 🐳 Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: test-backend
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: 📥 Checkout mã nguồn
        uses: actions/checkout@v4

      - name: 🔐 Đăng nhập Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 🏗️ Thiết lập Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: 🐳 Build và Push image Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/cloudservice-api:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/cloudservice-api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ═══════════════════════════════════════════
  # JOB 3: Deploy Backend → Render
  # Chạy SAU khi Docker image được push thành công
  # ═══════════════════════════════════════════
  deploy-backend:
    name: 🚀 Deploy Backend → Render
    runs-on: ubuntu-latest
    needs: build-docker
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: 🔔 Kích hoạt Render Deploy Hook
        run: |
          echo "📡 Triggering Render deploy..."
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}")
          echo "→ HTTP Status: $HTTP_STATUS"
          if [ "$HTTP_STATUS" != "200" ] && [ "$HTTP_STATUS" != "201" ]; then
            echo "❌ Deploy trigger FAILED (HTTP $HTTP_STATUS)"
            exit 1
          fi
          echo "✅ Deploy triggered! Render is building the new container..."

  # ═══════════════════════════════════════════
  # JOB 4: Deploy Frontend → Vercel
  # Chạy SONG SONG với Job 3 (độc lập nhau)
  # ═══════════════════════════════════════════
  deploy-frontend:
    name: 🚀 Deploy Frontend → Vercel
    runs-on: ubuntu-latest
    needs: test-backend
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: 📥 Checkout mã nguồn
        uses: actions/checkout@v4

      - name: ⚙️ Cài đặt Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: 📦 Cài đặt dependencies
        working-directory: ./frontend
        run: npm ci

      - name: 🔨 Build Frontend (kiểm tra lỗi compile)
        working-directory: ./frontend
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

      - name: 🚀 Deploy lên Vercel (Production)
        working-directory: ./frontend
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }} --yes
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 9.3. Sơ đồ luồng CI/CD

```
Git push lên nhánh main
         │
         ▼
  [Job 1] test-backend ──────── LUÔN CHẠY ─────────────────────┐
         │                                                        │
         │  (chỉ khi push vào main, test đã qua)                 │
         ▼                                                        ▼
  [Job 2] build-docker                           [Job 4] deploy-frontend
         │                                           (song song với Job 2)
         ▼
  [Job 3] deploy-backend
         │
         ▼
  ✅ DONE — Backend & Frontend đều deploy xong
```

---

## 10. Bước 8 — Chạy Migration Database Lần Đầu

> Sau khi deploy Backend lên Render, cần apply toàn bộ EF Core migrations vào Azure SQL Database để tạo các bảng.

### Cách 1: Tự Động Khi Khởi Động _(Khuyến nghị cho BTL)_

Thêm đoạn sau vào `Program.cs` — Backend sẽ tự apply migration mỗi lần khởi động nếu có migration chưa được apply:

```csharp
// Thêm vào Program.cs
// Vị trí: SAU dòng var app = builder.Build();
// VÀ TRƯỚC dòng app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
        Console.WriteLine("✅ Database migration applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Migration error: {ex.Message}");
        throw; // Dừng app nếu không kết nối được DB
    }
}
```

### Cách 2: Chạy Thủ Công Từ Máy Local

```powershell
# 1. Cài EF Core Tools (nếu chưa có)
dotnet tool install --global dotnet-ef

# 2. Set connection string Azure SQL
$env:ConnectionStrings__Default = "Server=tcp:cloudservice-nhom7.database.windows.net,1433;Initial Catalog=CloudServiceDb;Persist Security Info=False;User ID=cloudadmin;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# 3. Chạy từ thư mục gốc của repo
cd D:\PTPM_huong_doi_tuong\BTL_Ban_dich_vu_cloud\backend

# 4. Apply tất cả migrations
dotnet ef database update `
  --project CloudService.Infrastructure `
  --startup-project CloudService.WebApi

# 5. Kiểm tra trạng thái
dotnet ef migrations list `
  --project CloudService.Infrastructure `
  --startup-project CloudService.WebApi
```

> ✅ Sau khi apply xong, vào Azure Portal → SQL Database → **Query editor** → chạy `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES` để xác nhận các bảng đã được tạo.

---

## 11. Kiểm Tra Sau Khi Deploy

### 11.1. Checklist Backend (Render)

- [ ] Truy cập `https://cloudservice-api.onrender.com/swagger` → Swagger UI hiển thị đầy đủ
- [ ] `GET /api/services` → trả về dữ liệu, không lỗi `500`
- [ ] `POST /api/auth/login` với tài khoản seeded → nhận JWT token hợp lệ
- [ ] Logs Render không có lỗi `Connection refused` hay `Login failed for user`
- [ ] GitHub Actions **Job 3** (deploy-backend) → ✅

### 11.2. Checklist Frontend (Vercel)

- [ ] Truy cập URL Vercel → trang chủ render đúng giao diện
- [ ] `/dang-nhap` → đăng nhập thành công, chuyển vào `/admin/dashboard`
- [ ] `/bang-gia` → hiển thị danh sách service plans từ API
- [ ] `/khach-hang`, `/lien-he` → load không lỗi
- [ ] Browser Console (F12) → **không có lỗi CORS** màu đỏ
- [ ] GitHub Actions **Job 4** (deploy-frontend) → ✅

### 11.3. Checklist Tích Hợp Dịch Vụ

- [ ] **Email:** Điền form liên hệ/đăng ký → email đến inbox _(kiểm tra cả thư mục Spam)_
- [ ] **PayOS:** Tạo đơn hàng → QR code sinh ra → quét được bằng app ngân hàng
- [ ] **JWT:** Token nhận từ login dùng được cho các API protected như `/api/admin/*`

### 11.4. Kiểm Tra GitHub Actions Pipeline

Repo → **Actions** → Run gần nhất → tất cả 4 jobs đều ✅:

```
✅ test-backend       ~2 phút
✅ build-docker       ~5 phút
✅ deploy-backend     ~30 giây
✅ deploy-frontend    ~3 phút
─────────────────────────────
Tổng: ~10 phút mỗi lần deploy
```

---

## 12. Xử Lý Sự Cố Thường Gặp

### ❌ Backend lỗi `Login failed for user 'cloudadmin'`

**Nguyên nhân:** Mật khẩu trong Connection String sai.  
**Giải pháp:**
1. Render → **Environment** → kiểm tra `ConnectionStrings__Default`
2. Đảm bảo không có ký tự thừa (khoảng trắng đầu/cuối)
3. Nếu password có ký tự đặc biệt (`@`, `#`, `%`...) hãy thử đặt lại password đơn giản hơn

---

### ❌ Backend không kết nối được database (timeout sau 30 giây)

**Nguyên nhân:** Firewall Azure SQL chưa mở.  
**Giải pháp:**
1. Azure Portal → SQL Server → **Networking**
2. Bật **"Allow Azure services and resources to access this server"** → **Save**

---

### ❌ Frontend lỗi CORS `Access-Control-Allow-Origin`

**Nguyên nhân:** Domain Vercel chưa được whitelist trong `Program.cs`.  
**Giải pháp:**
```csharp
// Cập nhật Program.cs
policy.WithOrigins(
    "http://localhost:3000",
    "https://your-exact-url.vercel.app"  // Dán đúng URL Vercel của nhóm
)
```
Commit và push → GitHub Actions sẽ tự redeploy.

---

### ❌ Render khởi động nhưng app crash ngay lập tức

**Nguyên nhân:** App bind sai port hoặc thiếu ENV.  
**Giải pháp:** Đảm bảo Render có biến:
```env
ASPNETCORE_URLS=http://+:80
```
Xem **Logs** Render để đọc thông báo lỗi cụ thể.

---

### ❌ GitHub Actions Job `build-docker` thất bại

**Nguyên nhân:** Docker Hub credentials sai hoặc token hết hạn.  
**Giải pháp:**
1. Kiểm tra `DOCKERHUB_USERNAME` và `DOCKERHUB_TOKEN` trong Secrets
2. Đảm bảo token có quyền **Read & Write** (không phải Read only)
3. Tạo token mới tại Docker Hub → Account Settings → Security → **New Access Token**

---

### ❌ GitHub Actions Job `deploy-frontend` thất bại khi build

**Nguyên nhân:** Lỗi TypeScript hoặc thiếu ENV.  
**Giải pháp:**
1. Chạy `npm run build` ở máy local để xem lỗi chi tiết
2. Đảm bảo `NEXT_PUBLIC_API_URL` đã được thêm vào GitHub Secrets

---

### ❌ PayOS Webhook không nhận được callback

**Nguyên nhân:** URL webhook sai hoặc endpoint chưa được tạo.  
**Giải pháp:**
1. Dùng [webhook.site](https://webhook.site) để test trước
2. Đảm bảo endpoint `/api/payment/webhook` **không có** `[Authorize]` attribute
3. Sau khi xác nhận hoạt động, cập nhật URL thật vào PayOS Dashboard

---

## 13. Quy Trình Rollback

### Rollback Frontend — Vercel _(nhanh nhất, < 1 phút)_

1. Vercel Dashboard → Chọn project → **Deployments**
2. Tìm bản deploy trước đó → nhấn **`...`** → **Promote to Production**
3. ✅ Frontend trở về phiên bản cũ ngay lập tức.

---

### Rollback Backend — Render _(~5 phút)_

1. Render Dashboard → Chọn service `cloudservice-api` → **Deploys**
2. Tìm bản deploy trước đó _(trạng thái `Live`)_ → nhấn **Rollback to this deploy**
3. Render tự động khởi động lại container từ image cũ.

---

### Rollback Database — ⚠️ Rất thận trọng!

> **CẢNH BÁO:** Rollback database có thể gây **mất dữ liệu**. Thông báo leader và backup trước khi thực hiện.

```powershell
# Xem danh sách migration đã apply (theo thứ tự)
dotnet ef migrations list `
  --project backend/CloudService.Infrastructure `
  --startup-project backend/CloudService.WebApi

# Rollback về migration cụ thể (tên migration lấy từ lệnh trên)
dotnet ef database update 20260822074212_CustomerDashboardEntities `
  --project backend/CloudService.Infrastructure `
  --startup-project backend/CloudService.WebApi
```

---

## 14. Bảng Tổng Hợp Biến Môi Trường

### Backend — Render Environment Variables

```env
# ── ASP.NET Core ─────────────────────────────────────────────────
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80

# ── Database (Azure SQL Server) ───────────────────────────────────
ConnectionStrings__Default=Server=tcp:cloudservice-nhom7.database.windows.net,1433;Initial Catalog=CloudServiceDb;Persist Security Info=False;User ID=cloudadmin;Password=YOUR_STRONG_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;

# ── JWT ───────────────────────────────────────────────────────────
Jwt__Secret=YOUR_RANDOM_SECRET_MIN_32_CHARACTERS_LONG
Jwt__Issuer=CloudServiceAPI
Jwt__Audience=CloudServiceClient

# ── Email (Resend) ────────────────────────────────────────────────
Resend__ApiKey=re_xxxxxxxxxxxx
Resend__FromEmail=noreply@cloudservice-nhom7.io.vn
Resend__FromName=Cloud Service Nhóm 7

# ── Thanh toán (PayOS) ────────────────────────────────────────────
PayOS__ClientId=xxxxxxxx
PayOS__ApiKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PayOS__ChecksumKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend — Vercel Environment Variables

```env
NEXT_PUBLIC_API_URL=https://cloudservice-api.onrender.com/api
```

### GitHub Repository Secrets

```
RENDER_DEPLOY_HOOK     = https://api.render.com/deploy/srv-xxx?key=xxx
DOCKERHUB_USERNAME     = your_dockerhub_username
DOCKERHUB_TOKEN        = dckr_pat_xxxxxxxxxxxx
VERCEL_TOKEN           = xxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID          = team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID      = prj_xxxxxxxxxxxxx
NEXT_PUBLIC_API_URL    = https://cloudservice-api.onrender.com/api
```

---

## 📌 Ghi Chú Cuối — Nhắn Gửi Leader

> **Đánh giá tính khả thi:**
>
> Quy trình deploy này **hoàn toàn khả thi** và **không thay đổi bất kỳ công nghệ nào** đang dùng trong codebase hiện tại.
>
> | Hạng mục | Trạng thái |
> |---|---|
> | Dockerfile Backend | ✅ Đã có, không cần chỉnh |
> | Dockerfile Frontend | ✅ Đã có (Vercel tự xử lý) |
> | EF Core Migrations | ✅ Đủ 9 migrations, apply thẳng lên Azure SQL |
> | GitHub Actions CI | ✅ File `ci.yml` đang chạy, chỉ cần thêm `deploy.yml` |
> | CORS | ⚠️ Cần cập nhật 1 dòng trong `Program.cs` (thêm URL Vercel) |
> | Unit Tests | ✅ 16 bài test đang pass, tích hợp vào pipeline |
>
> **Ước tính thời gian setup lần đầu:** 2–3 tiếng  
> **Mỗi lần deploy sau đó:** Tự động hoàn toàn, ~10 phút sau khi push code

---

*Tài liệu soạn bởi thành viên phụ trách Deploy — Nhóm 7*  
*Cập nhật: 27/08/2026*
