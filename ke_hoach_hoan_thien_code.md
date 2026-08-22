# 🎯 KẾ HOẠCH HOÀN THIỆN MÃ NGUỒN & DEMO (GIAI ĐOẠN CUỐI)
Dựa trên bảng đánh giá tiến độ, hệ thống của chúng ta đã đi được 90% chặng đường. Để đảm bảo buổi chạy Demo không xảy ra lỗi và đạt điểm tối đa ở phần Kỹ thuật, đây là danh sách chi tiết các tính năng CẦN BỔ SUNG NGAY LẬP TỨC (đã loại bỏ các phần lý thuyết/báo cáo và phần Triển khai do hạn chế thời gian).

---

## 👨‍💻 1. Khối Backend API (Phụ trách: TV2)

### 1.1 Hoàn thiện Luồng Bảo mật (Auth)
- **`POST /auth/refresh`**: Xây dựng API cấp lại Access Token mới. (Hiện tại Token hết hạn là user bị văng ra ngoài, cần có Refresh Token để duy trì đăng nhập).
- **`POST /auth/change-password`**: Xây dựng API Đổi mật khẩu cho người dùng đang đăng nhập (Yêu cầu nhập mật khẩu cũ & mật khẩu mới).

### 1.2 Chức năng Khuyến mãi (Promotions)
- **Tạo Entity & DB:** Đảm bảo bảng `Promotions` đã có trong SQL (Code, DiscountPercentage, ExpiryDate, IsActive...).
- **Xây dựng API:** Tạo `PromotionsController`, `PromotionService` hỗ trợ CRUD (Create, Read, Update, Delete) để Admin có thể quản lý mã giảm giá.

### 1.3 Tích hợp QR Code
- Thêm thư viện sinh mã QR (ví dụ: `QRCoder`).
- Tạo endpoint `GET /api/plans/{id}/qr` trả về luồng ảnh (File Content) chứa mã QR thanh toán Momo/VNPay hoặc thông tin chuyển khoản tương ứng với số tiền của gói dịch vụ đó.

### 1.4 (Bonus) Tích hợp Serilog
- Cài đặt `Serilog.AspNetCore`. Cấu hình để hệ thống tự động ghi lại mọi Lỗi (Exceptions) và Request vào file `logs/log-.txt` theo ngày.

---

## 🎨 2. Khối Frontend Khách Hàng (Phụ trách: TV3)

### 2.1 Kết nối API Thực tế (Xóa Mock Data)
- **Trang chủ & Bảng giá:** Sử dụng `axios` gọi API `/api/services` và `/api/plans` của TV2 để render danh sách gói Cloud thực tế từ Database.
- **Trang Tin tức:** Gọi API `/api/news` để lấy danh sách bài viết do Admin vừa soạn thảo (từ TipTap).

### 2.2 Xây dựng Trang Khách Hàng (`/khach-hang`)
- Tạo giao diện hiển thị các Khách hàng tiêu biểu (Testimonials/Partners).
- Tại phần thanh toán hoặc chi tiết gói, tích hợp hiển thị Mã QR Code (Gọi từ API của TV2) để khách hàng dùng điện thoại quét thanh toán trực tiếp.

---

## ⚙️ 3. Khối Frontend Quản Trị (Phụ trách: TV4)

### 3.1 Giao diện Quản lý Khuyến mãi (`/admin/promotions`)
- Thêm 1 nút "Khuyến mãi" vào Thanh Điều Hướng (Sidebar).
- Xây dựng bảng (Table) liệt kê các mã giảm giá.
- Làm Form (Modal) để Admin có thể Thêm Mã mới, cài đặt % giảm giá và ngày hết hạn.

### 3.2 Tích hợp QR Code trong Admin
- Bổ sung một cột hoặc nút "Xem QR Thanh toán" trong bảng Quản lý Dịch vụ hoặc Đơn hàng để Admin có thể đưa cho khách quét trực tiếp nếu mua tại quầy/chụp ảnh gửi.

*(Lưu ý: Nút xuất Excel mà báo cáo nhắc tới thì TV4 đã làm xong ở Phase 5 rồi nên không cần làm lại)*

---

## 🛠️ 4. Khối Hạ Tầng & Chạy Demo (Phụ trách: TV1)

### 4.1 Cập nhật README.md (Cực kỳ quan trọng - Tránh điểm liệt)
- Xóa file README trống hiện tại.
- Viết hướng dẫn 3 bước để chạy dự án từ số 0 bằng Docker.
- **ĐẶC BIỆT:** Phải cung cấp sẵn Tài khoản Demo (Email/Password của Admin và Khách hàng) ngay đầu file để Giảng viên copy-paste vào test.

### 4.2 Kiểm thử Docker Compose trên máy Local
- Xóa toàn bộ Container và Image cũ trên máy cá nhân: `docker system prune -a`.
- Chạy lệnh `docker compose up --build`.
- Đảm bảo SQL Server tự động seed data (nếu có) và API C# Backend tự chạy lên thành công ở cổng `8080` (hoặc cổng cấu hình) mà không báo lỗi thiếu file.
- Đảm bảo Frontend Next.js khởi động thành công và gọi được qua Backend C# nội bộ máy tính.
