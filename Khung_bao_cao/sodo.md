# TẬP HỢP MÃ MERMAID CHO CÁC SƠ ĐỒ

Dưới đây là mã nguồn Mermaid cho 5 sơ đồ được yêu cầu trong báo cáo. 
**Cách sử dụng trên Draw.io:** 
1. Mở trang web [app.diagrams.net](https://app.diagrams.net/) (Draw.io)
2. Chọn menu **Arrange > Insert > Advanced > Mermaid...**
3. Copy đoạn code của từng sơ đồ dưới đây (chỉ copy phần text bên trong, không copy dấu backtick ` ``` `) và dán vào hộp thoại để tự động sinh hình.
4. Export hình ảnh ra định dạng PNG và lưu vào thư mục `images/` với đúng tên file đã ghi.

---

## 1. Sơ đồ Use Case (Tên file: `use_case_diagram.png`)

```mermaid
flowchart LR
    %% Định nghĩa các Tác nhân (Actor)
    Customer([Khách hàng])
    Admin([Quản trị viên / Editor])

    %% Khung hệ thống (System Boundary)
    subgraph "Hệ thống Website Bán Dịch vụ Cloud"
        %% Chức năng công khai
        UC1(Xem thông tin & Bảng giá)
        UC2(Đăng ký / Đăng nhập)
        UC3(Đặt mua dịch vụ)
        UC4(Đăng ký Affiliate)

        %% Chức năng quản lý cá nhân
        UC5(Quản lý dịch vụ đang thuê)
        
        %% Chức năng quản trị
        UC6(Quản lý Gói dịch vụ)
        UC7(Quản lý Danh mục)
        UC8(Duyệt Đơn hàng)
        UC9(Quản lý Tin tức / Blog)
        UC10(Xem Thống kê & Báo cáo)
    end

    %% Nối Tác nhân với Use Case
    Customer --- UC1
    Customer --- UC2
    Customer --- UC3
    Customer --- UC4
    Customer --- UC5

    Admin --- UC2
    Admin --- UC6
    Admin --- UC7
    Admin --- UC8
    Admin --- UC9
    Admin --- UC10
```

---

## 2. Sơ đồ Hoạt động Đặt hàng (Tên file: `activity_order.png`)

```mermaid
flowchart TD
    Start((Bắt đầu)) --> ChooseService[Khách hàng chọn Gói dịch vụ]
    ChooseService --> InputInfo[Nhập thông tin cá nhân & Mã giảm giá]
    InputInfo --> SubmitOrder[Bấm nút Gửi Yêu cầu]
    SubmitOrder --> APICall[Hệ thống gọi API tạo OrderRequest]
    
    APICall --> CheckValidation{Dữ liệu hợp lệ?}
    CheckValidation -- Sai --> Error[Hiển thị thông báo lỗi]
    Error --> InputInfo
    
    CheckValidation -- Đúng --> SaveDB[Lưu đơn hàng vào Cơ sở dữ liệu trạng thái Pending]
    SaveDB --> ShowSuccess[Hiển thị thông báo Đặt hàng thành công]
    
    ShowSuccess --> AdminReview[Admin vào Dashboard xem đơn hàng]
    AdminReview --> AdminAction{Duyệt đơn?}
    
    AdminAction -- Từ chối --> RejectOrder[Đổi trạng thái thành Rejected]
    AdminAction -- Chấp nhận --> ApproveOrder[Đổi trạng thái thành Completed]
    
    RejectOrder --> End((Kết thúc))
    ApproveOrder --> Provisioning[Cấp phát dịch vụ cho khách hàng]
    Provisioning --> End
```

---

## 3. Sơ đồ Kiến trúc Clean Architecture (Tên file: `clean_architecture.png`)

```mermaid
flowchart TD
    %% Tầng Web API
    subgraph Presentation ["1. Tầng Presentation (Web API)"]
        Controllers[Controllers]
        Middleware[Exception/Audit Middleware]
        DI[Dependency Injection (Program.cs)]
    end

    %% Tầng Infrastructure
    subgraph Infrastructure ["2. Tầng Infrastructure"]
        EFCore[EF Core DbContext]
        Repositories[Repositories & UnitOfWork]
        InfraServices[JWT / BCrypt / QRCoder]
    end

    %% Tầng Application
    subgraph Application ["3. Tầng Application (Use Cases)"]
        AppServices[Logic Nghiệp vụ: OrderService, AuthService...]
        DTOs[Data Transfer Objects (DTO)]
        Interfaces_Svc[Giao diện IService]
    end

    %% Tầng Domain
    subgraph Domain ["4. Tầng Domain (Core)"]
        Entities[Entities: AppUser, OrderRequest...]
        Enums[Enums: UserRole, Status]
        Interfaces_Repo[Giao diện IRepository]
    end

    %% Các mũi tên thể hiện chiều phụ thuộc (Dependency Rule)
    Presentation -.->|Sử dụng| Application
    Presentation -.->|Đăng ký DI| Infrastructure
    
    Infrastructure -.->|Triển khai (Implement)| Domain
    Infrastructure -.->|Lấy DTO/Service| Application
    
    Application -.->|Sử dụng Entity/Interface| Domain
    
    %% Giải thích màu sắc/quy tắc
    classDef core fill:#d4edda,stroke:#28a745,stroke-width:2px;
    class Domain core;
```

---

## 4. Sơ đồ Cơ sở dữ liệu ERD (Tên file: `erd.png`)

```mermaid
erDiagram
    AppUser {
        int Id PK
        string FullName
        string Email
        string PasswordHash
        string Role
    }

    ServiceCategory {
        int Id PK
        string Name
        string Slug
    }

    ServicePlan {
        int Id PK
        int CategoryId FK
        string Name
        string Specs
    }

    PlanPrice {
        int Id PK
        int PlanId FK
        string BillingCycle
        decimal Price
    }

    OrderRequest {
        int Id PK
        int AppUserId FK
        int PlanId FK
        string CustomerName
        string Status
    }

    NewsArticle {
        int Id PK
        int AuthorId FK
        string Title
        string Content
    }

    Promotion {
        int Id PK
        int PlanId FK
        decimal DiscountPercent
        datetime StartDate
        datetime EndDate
    }

    AffiliateApplication {
        int Id PK
        string FullName
        string Email
        string Phone
        string Status
    }

    AuditLog {
        int Id PK
        string Action
        string UserName
        string IpAddress
        datetime Timestamp
    }

    %% Quan hệ
    ServiceCategory ||--o{ ServicePlan : "có nhiều"
    ServicePlan ||--o{ PlanPrice : "có nhiều"
    ServicePlan ||--o{ OrderRequest : "được đặt trong"
    ServicePlan ||--o{ Promotion : "áp dụng"
    AppUser ||--o{ OrderRequest : "tạo"
    AppUser ||--o{ NewsArticle : "viết"
```

---

## 5. Sơ đồ Tuần tự Đăng nhập (Tên file: `sequence_login.png`)

```mermaid
sequenceDiagram
    participant Client as Frontend (Next.js)
    participant API as AuthController (Web API)
    participant Auth as AuthService (Application)
    participant DB as SQL Server (Database)
    participant JWT as JwtService (Infrastructure)

    Client->>API: POST /api/auth/login (Email, Password)
    API->>Auth: Gọi LoginAsync(dto)
    
    Auth->>DB: Truy vấn AppUser theo Email
    DB-->>Auth: Trả về đối tượng AppUser (nếu có)
    
    alt Không tìm thấy User
        Auth-->>API: Trả về lỗi "Sai tài khoản"
        API-->>Client: HTTP 400 Bad Request
    else Có User
        Auth->>Auth: Kiểm tra BCrypt.Verify(Password, Hash)
        
        alt Sai mật khẩu
            Auth-->>API: Trả về lỗi "Sai mật khẩu"
            API-->>Client: HTTP 400 Bad Request
        else Đúng mật khẩu
            Auth->>JWT: Gọi GenerateToken(AppUser)
            JWT-->>Auth: Trả về chuỗi JWT AccessToken
            
            Auth->>Auth: Sinh RefreshToken ngẫu nhiên
            Auth->>DB: Lưu RefreshToken vào AppUser
            DB-->>Auth: Cập nhật thành công
            
            Auth-->>API: Trả về { AccessToken, RefreshToken }
            API-->>Client: HTTP 200 OK + Lưu Cookie
        end
    end
```
