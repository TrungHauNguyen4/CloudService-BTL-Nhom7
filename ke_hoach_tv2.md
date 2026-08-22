# 🚀 KẾ HOẠCH HÀNH ĐỘNG CỦA THÀNH VIÊN 2 (TV2)
**Mục tiêu: Đạt 100% tiến độ Backend (C# .NET)**

Dựa trên bảng đánh giá tiến độ ngày 20/08, TV2 đã hoàn thành xuất sắc 92% khối lượng công việc (Xây dựng CSDL, JWT, các Controller cốt lõi). Tuy nhiên, để hệ thống hoàn thiện tuyệt đối và khớp với giao diện của TV3, TV4, dưới đây là danh sách 5 nhiệm vụ cuối cùng (8%) mà TV2 cần xử lý khẩn cấp:

---

## 🎯 DANH SÁCH TÍNH NĂNG CÒN THIẾU (BACKEND)

### 1. Quản lý Tin tức (News Management)
Mảng tin tức hiện tại đang hoàn toàn trống ở cả khía cạnh Quản trị (Admin) lẫn Khách hàng (Public).
- **Nhiệm vụ 1.1:** Tạo `AdminNewsController.cs` (Kế thừa từ `ControllerBase`).
  - Viết 4 API CRUD cơ bản: `GET` (danh sách), `POST` (thêm bài), `PUT` (sửa bài), `DELETE` (xóa bài).
  - Phân quyền: Thêm tag `[Authorize(Roles = "Admin,Editor")]`.
- **Nhiệm vụ 1.2:** Tạo `NewsArticlesController.cs` (Dành cho Public).
  - Viết API `GET /api/public/news` để lấy danh sách tin tức (yêu cầu hỗ trợ phân trang và tìm kiếm theo tiêu đề).
  - Viết API `GET /api/public/news/{slug}` để xem chi tiết 1 bài viết.

### 2. Quản lý Đối tác (Admin Affiliates)
TV2 đã làm API cho khách đăng ký làm đối tác (`AffiliateController`), nhưng lại **quên mất** làm API cho Admin duyệt đối tác!
- **Nhiệm vụ 2.1:** Tạo `AdminAffiliatesController.cs`.
  - Viết API `GET /api/admin/affiliates/pending`: Trả về danh sách đối tác đang chờ duyệt.
  - Viết API `PUT /api/admin/affiliates/{id}/status`: Cập nhật trạng thái duyệt / từ chối đối tác.
  - Phân quyền: `[Authorize(Roles = "Admin,Editor")]`.

### 3. Hệ thống Thống kê (Dashboard Analytics)
Giao diện Admin (TV4) đang cần dữ liệu thật để vẽ biểu đồ doanh thu và lưu lượng.
- **Nhiệm vụ 3.1:** Tạo `AdminStatsController.cs`.
  - Viết API `GET /api/admin/stats/summary`: Trả về tổng số đơn hàng, tổng doanh thu, số khách hàng mới.
  - Viết API `GET /api/admin/stats/revenue-chart`: Trả về mảng dữ liệu doanh thu của 7 tháng gần nhất để vẽ biểu đồ BarChart.
  - Phân quyền: `[Authorize(Roles = "Admin")]`.

### 4. Hoàn thiện các Controller ĐANG VIẾT DỞ
Dù TV2 đã làm một số Controller cho Admin, nhưng kiểm tra kỹ thì vẫn **bị thiếu các hàm (Action) quan trọng** khiến Frontend không thể gọi được:
- **Nhiệm vụ 4.1: Bổ sung cho `AdminServicePlansController.cs`**
  - Hiện tại chỉ có `GET` và `POST`. TV4 đã thiết kế nút Sửa/Xóa Gói dịch vụ.
  - Yêu cầu: Viết thêm API `PUT /api/admin/service-plans/{id}` (Sửa) và `DELETE /api/admin/service-plans/{id}` (Xóa).
- **Nhiệm vụ 4.2: Bổ sung cho `AdminOrdersController.cs`**
  - Hiện tại chỉ có API lấy đơn hàng Đang chờ duyệt (`GetPending`). TV4 đã thiết kế bộ Lọc theo mọi trạng thái.
  - Yêu cầu: Viết thêm API `GET /api/admin/orders` (Lấy TOÀN BỘ đơn hàng, hỗ trợ filter theo status).
- **Nhiệm vụ 4.3: Bổ sung `AdminCategoriesController.cs`**
  - TV4 cần giao diện Quản lý Danh mục (Thêm/Sửa/Xóa Danh mục Hosting, VPS).
  - Yêu cầu: Tạo Controller mới để thực hiện CRUD cho `ServiceCategory`.

### 5. Nhật ký hệ thống (Audit Logging)
Dự án yêu cầu phải ghi vết lại mọi hành động thao tác (Thêm, Sửa, Xóa) của Admin để truy vết khi có lỗi.
- **Nhiệm vụ 5.1:** Tạo `AuditMiddleware.cs` (Hoặc Action Filter).
  - Bắt mọi request có phương thức `POST`, `PUT`, `DELETE` từ Admin.
  - Lấy thông tin user (từ JWT Token), loại hành động, thời gian, và lưu xuống bảng `AuditLogs` trong Database.
- **Nhiệm vụ 5.2:** Tạo `AuditLogsController.cs`.
  - Viết API `GET /api/admin/audit-logs` để Frontend tải danh sách lịch sử thao tác (yêu cầu có phân trang và lọc theo ngày).

### 6. Quản lý Phiên đăng nhập & Bảo mật (Refresh Token + Đổi mật khẩu)
Hiện tại hệ thống chỉ có API Login cấp Token sống trong thời gian ngắn, thiếu cơ chế làm mới Token khiến trải nghiệm của Admin bị gián đoạn.
- **Nhiệm vụ 6.1:** Bổ sung `RefreshToken` property vào Entity `AppUser` (hoặc tạo bảng `RefreshToken` riêng).
- **Nhiệm vụ 6.2:** Sửa `JwtService` — thêm method `GenerateRefreshToken()` và `ValidateRefreshToken()`.
- **Nhiệm vụ 6.3:** Bổ sung `POST /api/auth/refresh` trong `AuthController`.
- **Nhiệm vụ 6.4:** Bổ sung `POST /api/auth/change-password` trong `AuthController`.

### 7. Module Khuyến Mãi (Promotions Controller)
Dự án có đề cập đến Khuyến mãi ở Frontend nhưng Backend chưa có API cung cấp dữ liệu.
- **Nhiệm vụ 7.1:** Tạo `PromotionsController.cs` (Public).
  - Viết API `GET /api/promotions/active` — lấy danh sách các khuyến mãi đang hoạt động (kèm theo thời hạn và % giảm giá).

### 8. Tối ưu Kiến trúc Code (Code Organization)
File `AppDbContext.cs` và `Program.cs` đang quá dài, vi phạm nguyên tắc Clean Code. Cần tái cấu trúc để dễ bảo trì:
- **Nhiệm vụ 8.1:** Tạo thư mục `Configurations/` trong Infrastructure — Tách đống mã FluentAPI đang nhét hết ở `AppDbContext` ra thành các class kế thừa `IEntityTypeConfiguration<T>`.
- **Nhiệm vụ 8.2:** Tạo `Extensions/ServiceCollectionExtensions.cs` — Gom toàn bộ đống DI registrations (AddScoped, AddTransient) ra khỏi `Program.cs` để file Program gọn gàng hơn.
- **Nhiệm vụ 8.3:** Bổ sung slug-based lookup cho Public ServicePlans: Viết API `GET /api/service-plans/{slug}` thay vì chỉ tìm theo ID.
- **Nhiệm vụ 8.4:** Thêm query params (lọc, sắp xếp, phân trang) cho danh sách: `GET /api/service-plans?category=&page=&sort=`.

---

## 💡 LỜI KHUYÊN DÀNH CHO TV2
- **Thứ tự ưu tiên:** Hãy ưu tiên làm phần **Tin tức (News)** trước vì nó liên quan trực tiếp đến cả TV3 (Giao diện khách hàng) và TV4 (Giao diện Admin). Tiếp theo là **Refresh Token** để bảo mật hệ thống.
- **Phối hợp:** Trong lúc TV2 code những tính năng này, TV3 và TV4 sẽ tạm thời dùng dữ liệu giả (Mock Data) để dựng giao diện. Khi nào TV2 làm xong, hãy hô to trong nhóm để các bạn Frontend thay link API là xong!

> Kế hoạch này được tạo ra nhằm giúp TV2 có cái nhìn rõ ràng và dứt điểm công việc một cách chuyên nghiệp nhất, đạt chuẩn Senior Backend Developer. Chúc TV2 code bách phát bách trúng, 0 bugs!
