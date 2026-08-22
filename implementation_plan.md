# Tích Hợp API Thực Tế Cho Trang Quản Trị (Admin Dashboard)

Hiện tại, ngoài trang Khuyến mãi và Dịch vụ đã được tích hợp API một phần, các trang Dashboard, Analytics, Đơn hàng, Tin tức, Affiliates, và Audit Logs đều đang dùng **mock data (dữ liệu giả)** để hiển thị giao diện.
Kế hoạch này nhằm chuyển đổi 100% Admin Frontend sang dùng dữ liệu thật từ SQL Server thông qua .NET API.

## User Review Required

> [!IMPORTANT]
> Việc tích hợp sẽ ghi đè các biến mock data thành các biến State (`useState`, `useEffect`). Bạn hãy xem xét kỹ xem có cần bổ sung thêm chức năng nào không nhé.

## Open Questions

> [!WARNING]
> Trang **Analytics** hiện cần hiển thị Biểu đồ tròn (Tỷ lệ các gói) nhưng Backend hiện chỉ trả về Doanh thu theo tháng và Tổng quan chung. Tôi cần làm giả phần biểu đồ tròn trên Frontend hoặc viết thêm API Thống kê gói bán chạy trong Backend. Bạn chọn cách nào? (Đề xuất: Cứ giữ giao diện và mock data tỷ lệ cho nhanh, hoặc tôi có thể tính toán thêm API này nếu bạn muốn sửa code Backend).

## Proposed Changes

---

### Dashboards & Analytics

Tích hợp biểu đồ doanh thu và các chỉ số tổng quan.

#### [MODIFY] `frontend/src/app/admin/dashboard/page.tsx`
- Sửa logic lấy dữ liệu `mockData` -> `apiClient.get('/admin/stats/summary')`
- Sửa lấy biểu đồ Doanh thu -> `apiClient.get('/admin/stats/revenue-chart')`

#### [MODIFY] `frontend/src/app/admin/analytics/page.tsx`
- Sửa dữ liệu LineChart -> tích hợp `/admin/stats/revenue-chart`

---

### Core Data Pages

Kết nối bảng dữ liệu với Controller tương ứng.

#### [MODIFY] `frontend/src/app/admin/orders/page.tsx`
- Xóa mock data
- Fetch `apiClient.get('/admin/orders')`

#### [MODIFY] `frontend/src/app/admin/news/page.tsx`
- Xóa mock data
- Fetch `apiClient.get('/admin/news')` (kèm CRUD)

#### [MODIFY] `frontend/src/app/admin/affiliates/page.tsx`
- Fetch `apiClient.get('/admin/affiliates')` (danh sách chiết khấu)

#### [MODIFY] `frontend/src/app/admin/audit-logs/page.tsx`
- Fetch `apiClient.get('/admin/audit-logs')`

---

## Verification Plan

### Automated Tests
- Chạy `npm run build` để kiểm tra lỗi Typescript sau khi thay kiểu dữ liệu từ Mock sang Data thật.

### Manual Verification
- Bạn sẽ truy cập `/admin/dashboard` và các trang trên để xác nhận các biểu đồ / bảng biểu có số liệu thật.
- Tôi sẽ gọi trực tiếp API bằng PowerShell `Invoke-RestMethod` trong quá trình code để đảm bảo Backend trả về đúng.
