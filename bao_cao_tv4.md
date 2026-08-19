# 📋 BÁO CÁO CÔNG VIỆC CỦA THÀNH VIÊN 4 (TV4)

*Tài liệu này ghi nhận chi tiết các hạng mục công việc mà Thành viên 4 đã hoàn thành xuất sắc tính đến thời điểm hiện tại. Báo cáo này có thể dùng để nộp cho Giảng viên làm minh chứng khối lượng công việc.*

---

## 1. Mảng Unit Testing (Kiểm thử ứng dụng)
**Trạng thái:** Hoàn thành 100% (16/16 Test Cases Passed)

TV4 đã chịu trách nhiệm đảm bảo chất lượng cho tầng Application (Core Business Logic) bằng các công nghệ kiểm thử hiện đại nhất:
- Khởi tạo thành công dự án `CloudService.UnitTests` sử dụng **xUnit**.
- Tích hợp thư viện **Moq** để giả lập (mocking) dữ liệu từ tầng Repository (Database) và thư viện **AutoMapper**.
- Phát hiện và vá thành công lỗi `NullReferenceException` khi Service gọi hàm lưu CSDL.
- Viết tổng cộng **16 kịch bản kiểm thử (Test Cases)** bao phủ các nghiệp vụ cốt lõi:
  - `ServicePlanServiceTests.cs` (5 tests): Đảm bảo logic tính toán giá và tự động sinh mã Slug cho gói dịch vụ.
  - `OrderServiceTests.cs` (6 tests): Kiểm soát chặt chẽ trạng thái đơn hàng (New, Processing, Completed).
  - `CategoryServiceTests.cs` (2 tests): Kiểm tra nghiệp vụ lấy danh mục đang hoạt động.
  - `AffiliateServiceTests.cs` (2 tests): Xác thực quy trình nộp đơn đăng ký đối tác.
  - `NewsArticleServiceTests.cs` (1 test): Kiểm tra tính năng tự động gán ID Tác giả khi đăng bài tin tức.

## 2. Mảng DevOps & Tự động hóa (CI/CD)
**Trạng thái:** Hoàn thành 100%

TV4 đã thiết lập nền tảng hạ tầng vận hành (Infrastructure as Code) đạt tiêu chuẩn doanh nghiệp, giúp nhóm đạt điểm tối đa ở tiêu chí "Quy trình phát triển":
- **Khởi tạo `backend/Dockerfile`:** Ứng dụng kỹ thuật Multi-stage build. Sử dụng `.NET 9 SDK` để biên dịch mã nguồn và đóng gói ứng dụng vào môi trường `ASP.NET 9 Runtime` siêu nhẹ, giúp tiết kiệm dung lượng RAM khi vận hành.
- **Thiết lập `docker-compose.yml`:** Cấu hình "nhạc trưởng" để tự động bật đồng thời CSDL **SQL Server 2022** và **Backend API** chỉ bằng một câu lệnh `docker compose up`. Các chuỗi kết nối (Connection Strings) được ánh xạ tự động thông qua Environment Variables.
- **Xây dựng luồng CI/CD (`.github/workflows/ci.yml`):** Lập trình Bot tự động (Github Actions) để gác cổng. Mỗi khi có thành viên đẩy code hoặc tạo Pull Request, Bot sẽ tự động tải mã nguồn, tự động Build và chạy lại toàn bộ 16 bài Unit Test. Code chỉ được gộp khi Bot cấp phép (Màu xanh).

## 3. Kỹ năng Làm việc nhóm (Git/Github)
- Tuân thủ tuyệt đối mô hình **Feature Branch Workflow** của Trưởng nhóm.
- Đã tạo nhánh làm việc riêng: `feature/tv4-unit-test-devops`.
- Các câu lệnh commit được viết rõ ràng, chuẩn Semantic Versioning:
  - `test: add 16 unit tests for application layer and resolve null exception`
  - `ci: configure docker compose and github actions for auto CI/CD`
- Đã tạo Pull Request và xử lý gộp code (Merge) thành công vào mã nguồn chung.

---
*Ghi chú: Nhiệm vụ tiếp theo của TV4 trong tương lai là phối hợp cùng TV3 xây dựng giao diện Quản trị bằng Next.js.*
