
## 🚀 1. Lần Đầu Tiên Tham Gia (Clone & Setup)

Nếu bạn là thành viên mới (TV2, TV3, TV4) vừa tham gia dự án, hãy làm tuần tự các bước sau để kéo code về và chạy thử.

### ⚡ Yêu Cầu Môi Trường (Phải cài trên máy cá nhân)
1. **.NET 9.0 SDK** (Dùng cho Backend)
2. **Node.js (v20 trở lên)** (Dùng cho Frontend)
3. **Microsoft SQL Server** (Hoặc Docker)

### 📥 Bước 1: Kéo code về máy (Clone)
Mở Terminal/CMD tại thư mục bạn muốn chứa dự án:
```bash
git clone <ĐƯỜNG-LINK-GITHUB-CỦA-DỰ-ÁN>
cd BTL_Ban_dich_vu_cloud

# Chuyển ngay sang nhánh develop (nhánh làm việc chung)
git checkout develop
```

### 💻 Bước 2: Khởi Động Backend (Dành cho TV2, TV4)
Mở Terminal tại thư mục `BTL_Ban_dich_vu_cloud`:
```bash
cd backend
# Khôi phục các thư viện NuGet
dotnet restore CloudService.sln

# Chạy Backend API (Sẽ chạy ở http://localhost:5000/swagger)
cd CloudService.WebApi
dotnet run
```
*(Lưu ý cho TV2: Việc chạy Migration tạo Database sẽ do bạn phụ trách sau khi code xong file AppDbContext).*

### 🎨 Bước 3: Khởi Động Frontend (Dành cho TV3, TV4)
Mở một Terminal MỚI:
```bash
cd frontend
# Cài đặt thư viện Node modules
npm install

# Chạy giao diện (Sẽ chạy ở http://localhost:3000)
npm run dev
```

---

## 🔄 2. Quy Trình Code Hàng Ngày (Feature Branch Workflow)

Để không ai làm hỏng code của người khác, **TUYỆT ĐỐI KHÔNG CODE VÀ PUSH TRỰC TIẾP LÊN NHÁNH `main` hay `develop`**. Mỗi khi làm một tính năng mới, hãy lặp lại 6 bước sau:

**Bước 1: Cập nhật code mới nhất từ team**
```bash
git checkout develop
git pull origin develop
```

**Bước 2: Tạo nhánh cá nhân của bạn**
*(Tên nhánh: `feature/<tv>-<tên-tính-năng>` hoặc `fix/<tv>-<tên-lỗi>`)*
```bash
git checkout -b feature/tv2-setup-database
```

**Bước 3: Code và Lưu lại (Commit)**
*(Xem mục số 3 bên dưới để biết cách ghi lời nhắn Commit chuẩn)*
```bash
git add .
git commit -m "feat(backend): Setup AppDbContext và kết nối SQL Server"
```

**Bước 4: Đồng bộ lại với team trước khi đẩy lên**
*(Đề phòng trong lúc bạn code, có người khác đã đẩy code lên)*
```bash
git pull origin develop
# (Nếu Terminal báo conflict, hãy mở file đó trong VS Code, chọn phần code đúng, rồi commit lại).
```

**Bước 5: Đẩy nhánh của bạn lên Github**
```bash
git push -u origin feature/tv2-setup-database
```

**Bước 6: Tạo Pull Request (PR)**
- Lên trang Github của dự án, bấm nút **Compare & pull request**.
- Báo Leader (TV1) vào review code. Nếu OK, Leader sẽ gộp code của bạn vào nhánh chung `develop`.
- Bạn có thể xóa nhánh cá nhân đó và quay lại Bước 1 để làm tính năng tiếp theo!

---

## 📝 3. Quy Tắc Ghi Nhắn (Commit Convention)

Mọi dòng commit BẮT BUỘC phải theo cú pháp: `<loại>(<phạm vi>): <mô tả chi tiết>`
- `feat`: Thêm tính năng mới (VD: `feat(api): Tạo endpoint đăng nhập`)
- `fix`: Sửa lỗi (VD: `fix(ui): Sửa lỗi vỡ nút bấm trang chủ`)
- `docs`: Cập nhật tài liệu (VD: `docs: Cập nhật README`)
- `refactor`: Viết lại code cho đẹp nhưng không đổi tính năng (VD: `refactor(core): Tối ưu vòng lặp`)
- `chore`: Cấu hình, cài đặt thư viện (VD: `chore: Cài đặt Tailwind CSS`)

---

## 📚 4. Tài Liệu Quan Trọng Khác
Hãy xem các file sau để biết mình cần phải làm gì tiếp theo:
- 👉 Xem file `tien_do_du_an.md` để biết tổng quan dự án và ai đang làm gì.
- 👉 Xem file `huong_dan_chi_tiet.md` để lấy **code mẫu và hướng dẫn step-by-step** cho phần việc của mình.
