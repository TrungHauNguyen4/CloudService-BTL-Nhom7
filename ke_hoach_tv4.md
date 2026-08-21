# 🚀 KẾ HOẠCH HÀNH ĐỘNG CỦA THÀNH VIÊN 4 (TV4) - GIAI ĐOẠN 5
**Mục tiêu: Đạt 100% tiến độ Giao diện Quản trị (Admin Dashboard)**

Hiện tại, TV4 đã hoàn thiện toàn bộ luồng Auth, Interceptors, và các tính năng CRUD cơ bản cho Dịch vụ & Đơn hàng. Phần còn lại (Khoảng 35% khối lượng) là các tính năng **nâng cao** để giúp Dashboard trở nên chuyên nghiệp như một hệ thống thực thụ.

> **Lưu ý quan trọng:** Cấu trúc thư mục của Admin hiện tại đã được đổi từ (admin) sang dmin để chuẩn hóa đường dẫn URL thành /admin/....

Dưới đây là 5 nhiệm vụ chi tiết cần thực hiện:

---

## 🎯 NHIỆM VỤ 1: Cài đặt thư viện hỗ trợ (Yêu cầu bắt buộc)
Hệ thống cần thêm các thư viện mạnh mẽ để xử lý Biểu đồ, Trình soạn thảo văn bản và Xuất file. 
Hãy chạy lệnh này ở thư mục rontend:
``bash
npm install recharts
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-heading
npm install file-saver
npm install -D @types/file-saver
``

---

## 🎯 NHIỆM VỤ 2: Cập nhật Thanh Điều Hướng (Sidebar Menu)
**Sửa file:** rontend/src/app/admin/layout.tsx

Bổ sung thêm 3 nút mới vào thanh Menu (Sidebar) để trỏ tới các trang sắp tạo:
1. **Tin tức:** href="/admin/news" (Icon: Newspaper hoặc FileText)
2. **Thống kê:** href="/admin/analytics" (Icon: PieChart hoặc BarChart)
3. **Nhật ký:** href="/admin/audit-logs" (Icon: History hoặc Clock)

*Lưu ý import các icon tương ứng từ lucide-react.*

---

## 🎯 NHIỆM VỤ 3: Tính năng Xuất File Excel (Export Excel)
Trang Quản lý Đơn hàng đã có sẵn, chỉ cần thêm nút và xử lý hàm tải file từ API của TV2.

**Sửa file:** rontend/src/app/admin/orders/page.tsx

**Công việc:**
1. Import thư viện saveAs từ ile-saver.
2. Viết hàm handleExportExcel:
``tsx
const handleExportExcel = async () => {
  try {
    // Lưu ý: Nhớ truyền responseType: 'blob' để Axios không làm hỏng file nhị phân
    const response = await apiClient.get('/admin/export/orders', {
      responseType: 'blob' 
    });
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, \DanhSachDonHang_\.xlsx\);
  } catch (error) {
    alert("Lỗi khi tải file Excel!");
  }
};
``
3. Thêm một nút (Button) "Xuất Excel" màu xanh lá cây nằm kế bên ô Tìm kiếm ở góc trên màn hình. Gắn sự kiện onClick={handleExportExcel}.

---

## 🎯 NHIỆM VỤ 4: Trang Quản lý Tin tức tích hợp Trình soạn thảo TipTap
Do Backend (TV2) chưa làm API Tin tức, hãy dùng Dữ liệu giả (Mock Data) nhưng làm Giao diện (UI) đầy đủ chức năng.

**Tạo file:** rontend/src/app/admin/news/page.tsx

**Công việc:**
1. **Thiết kế Bảng danh sách bài viết:** Cột Tiêu đề, Danh mục, Trạng thái (Đã xuất bản / Bản nháp), Ngày tạo.
2. **Thiết kế Trình soạn thảo văn bản (TipTap Editor):**
   - Tạo một modal hoặc chuyển sang trang viết bài khi bấm "Thêm mới".
   - Tích hợp @tiptap/react để có thanh công cụ cơ bản: **In đậm**, *In nghiêng*, Heading 1, Heading 2, Danh sách (List).
3. **Mô phỏng lưu (Mock Save):** Khi nhấn "Lưu bài viết", chỉ cần đẩy bài mới vào state Mảng dữ liệu đang hiển thị trên màn hình.

---

## 🎯 NHIỆM VỤ 5: Bảng Thống kê & Biểu đồ (Analytics)
**Tạo file:** rontend/src/app/admin/analytics/page.tsx

**Công việc:**
1. Tạo 4 Thẻ chỉ số tổng quan (Card) ở trên cùng: Tổng Doanh thu, Tổng Đơn hàng, Tổng Khách hàng, Tăng trưởng (VD: +15% so với tháng trước).
2. Tạo Lưới 2 Cột ở dưới:
   - **Cột Trái (Biểu đồ Đường - LineChart):** Dùng thư viện echarts vẽ biểu đồ Lưu lượng truy cập / Doanh thu trong 6 tháng gần nhất.
   - **Cột Phải (Biểu đồ Tròn - PieChart):** Vẽ biểu đồ tỷ lệ Khách hàng mua các Gói Cloud (Basic 40%, Pro 35%, Enterprise 25%).
3. Khai báo mock data trực tiếp trong file để truyền vào các Component của echarts.

---

## 🎯 NHIỆM VỤ 6: Giao diện Nhật ký Hệ thống (Audit Logs)
**Tạo file:** rontend/src/app/admin/audit-logs/page.tsx

**Công việc:**
1. Thiết kế bố cục dạng Timeline (Dòng thời gian dọc) thay vì Bảng ngang thông thường để trông hiện đại hơn.
2. Mỗi dòng log cần có:
   - Avatar / Tên Admin thực hiện hành động.
   - Hành động (Ví dụ: "Đã xóa khách hàng Nguyễn Văn A", "Thay đổi mật khẩu").
   - Thời gian (Ví dụ: "10 phút trước", "15/08/2026").
   - Thẻ màu (Badge) biểu thị mức độ: Xóa (Đỏ), Thêm (Xanh lá), Cập nhật (Vàng).
3. Sử dụng Mảng mock data khoảng 10-15 logs để hiển thị.

---

> 🏆 **Hoàn thành được 6 nhiệm vụ trên, Giao diện Admin Dashboard của TV4 sẽ thuộc hàng "Tuyệt đỉnh", sẵn sàng gây ấn tượng tuyệt đối khi chấm điểm!**
