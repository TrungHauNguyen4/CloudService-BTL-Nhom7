# ☁️ CloudService - Bài Tập Lớn Phát Triển Phần Mềm Hướng Đối Tượng

Đây là dự án Quản lý Dịch vụ Đám Mây (Cloud Service) được phát triển bởi **Nhóm 7**. Dự án mô phỏng một hệ thống cung cấp dịch vụ bán Cloud (VPS, Hosting, Domain, Object Storage) hoàn chỉnh với mô hình kiến trúc Client-Server hiện đại.

- **Backend:** .NET 9 Web API (Clean Architecture, EF Core, SQL Server)
- **Frontend:** Next.js 14 (App Router, Tailwind CSS, TypeScript)
- **Database:** Microsoft SQL Server 2022
- **Triển khai:** Docker & Docker Compose

---

## 🚀 Hướng Dẫn Chạy Dự Án (Chỉ 3 Bước)

Dự án đã được đóng gói toàn bộ vào Docker. Yêu cầu duy nhất: Máy tính của bạn đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Bước 1: Khởi động Docker
Mở phần mềm Docker Desktop trên máy tính và đợi đến khi icon chuyển sang màu xanh (Engine running).

### Bước 2: Tải và Chạy hệ thống
Mở Terminal / Command Prompt tại thư mục chứa mã nguồn (thư mục có chứa file `docker-compose.yml`), sau đó chạy lệnh sau:

```bash
docker compose up --build -d
```
*(Lệnh này sẽ tự động tải SQL Server, thiết lập Database, biên dịch Backend và Frontend. Quá trình có thể mất 2-5 phút trong lần chạy đầu tiên tùy tốc độ mạng).*

### Bước 3: Trải nghiệm
Sau khi các Container báo trạng thái `Started`, bạn có thể truy cập hệ thống qua trình duyệt:

- 🌐 **Giao diện Khách hàng (Trang chủ):** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Giao diện Quản trị (Admin):** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- 🔌 **Tài liệu API Backend (Swagger):** [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

## 🔑 Tài Khoản Demo Chấm Điểm

Hệ thống đã tự động tạo sẵn (Seed Data) các tài khoản sau để Giảng viên tiện chấm điểm mà không cần phải đăng ký lại:

| Vai Trò | Email đăng nhập | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@cloudservice.com` | `Admin@123` | Quản lý toàn bộ Gói dịch vụ, Khuyến mãi, Đơn hàng, Tin tức, Thống kê doanh thu. |
| **👤 Khách hàng** | `customer@gmail.com` | `Customer@123` | Xem dịch vụ, đặt hàng, quản lý hóa đơn cá nhân, thanh toán QR Code. |

*(Nếu muốn test tính năng đăng ký mới, vui lòng nhập mật khẩu có ký tự hoa, ký tự thường, số và ký tự đặc biệt theo chuẩn an toàn).*

---

## 🛑 Cách Dừng / Xóa Hệ Thống

Để tắt hệ thống sau khi chấm xong:
```bash
docker compose down
```

Nếu muốn chạy lại từ đầu và xóa sạch toàn bộ dữ liệu Database cũ:
```bash
docker compose down -v
```

---

## 👨‍💻 Thành Viên Nhóm 7 (Phân công công việc)

1. **TV1:** Phân tích thiết kế, lập kế hoạch, Thiết lập DevOps & Docker, Quản lý tiến độ.
2. **TV2:** Xây dựng toàn bộ Backend (.NET 9), API, Authentication (JWT), Database (SQL Server), QR Code.
3. **TV3:** Xây dựng Giao diện Khách hàng (Public) bao gồm Trang chủ, Bảng Giá, Tin Tức, Auth (Next.js).
4. **TV4:** Xây dựng Giao diện Quản trị (Admin) bao gồm Quản lý Đơn Hàng, Khuyến mãi, Phân quyền.

Cảm ơn thầy cô đã đồng hành và hướng dẫn chúng em hoàn thành dự án này!
