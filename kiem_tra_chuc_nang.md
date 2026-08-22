# 🔍 KIỂM TRA TOÀN BỘ CHỨC NĂNG HỆ THỐNG
**Ngày quét: 22/08/2026**
**Mục đích: Xác định trang nào đã gọi API thật, trang nào còn là HTML tĩnh (dữ liệu cứng)**

---

## 📋 KẾT QUẢ TỔNG QUAN

- **Backend API:** `http://localhost:5023/api` — **37 endpoints** sẵn sàng
- **Frontend axios:** baseURL = `http://localhost:5023/api` + JWT interceptor
- **Tổng số trang frontend:** 33 file TSX

```
TỔNG KẾT NHANH:
├── ✅ Trang gọi API thật:     15/33 (45%)
├── 🟡 Trang có API nhưng thiếu: 5/33 (15%)
├── ❌ Trang hoàn toàn tĩnh:    13/33 (40%)
```

---

## 1. TRANG CÔNG KHAI (PUBLIC) — 14 file

### ✅ CÁC TRANG ĐÃ GỌI API THẬT

| # | Trang | File | API được gọi | Hoạt động? |
|---|---|---|---|---|
| 1 | **Trang chủ** | `(public)/page.tsx` | `fetch("/api/service-categories")` — SSR | ✅ Lấy danh mục dịch vụ thật |
| 2 | **Bảng giá** | `(public)/bang-gia/page.tsx` | `fetch("/api/service-plans")` + `fetch("/api/service-plans/{id}/qr")` | ✅ Lấy gói + QR thật |
| 3 | **Tin tức (list)** | `(public)/tin-tuc/page.tsx` | `apiClient.get('/public/news')` | ✅ Có fallback nếu API lỗi |
| 4 | **Liên hệ** | `(public)/lien-he/page.tsx` | `apiClient.post('/public/orders', {...})` | ✅ Gửi form → DB |
| 5 | **Đối tác** | `(public)/doi-tac/page.tsx` | `apiClient.post('/public/affiliates', {...})` | ✅ Form đăng ký affiliate → DB |
| 6 | **Login Admin** | `(public)/login/page.tsx` | `apiClient.post('/auth/login', {...})` | ✅ Đăng nhập JWT |

### ❌ CÁC TRANG HOÀN TOÀN TĨNH (không gọi API)

| # | Trang | File | Vấn đề | Mức cần sửa |
|---|---|---|---|---|
| 7 | **Giới thiệu** | `(public)/gioi-thieu/page.tsx` | 100% HTML cứng — stats, story, core values | 🟢 **Chấp nhận được** — trang giới thiệu thường là nội dung cố định |
| 8 | **Dịch vụ** | `(public)/dich-vu/page.tsx` | 4 dịch vụ hardcode (id, name, price, features) | 🟡 **Nên sửa** — nên fetch từ `/api/public/service-plans` |
| 9 | **Chi tiết dịch vụ** | `(public)/dich-vu/[slug]/page.tsx` | Dữ liệu cứng trong `serviceDetails` object | 🟡 **Nên sửa** — nên fetch `GET /api/public/service-plans/{id}` |
| 10 | **Khách hàng** | `(public)/khach-hang/page.tsx` | Partners, testimonials hardcode | 🟢 **Chấp nhận được** — trang marketing |
| 11 | **Tin tức (detail)** | `(public)/tin-tuc/[slug]/page.tsx` | **Không có API!** Chỉ dùng `fallbackArticle` | 🔴 **Phải sửa** — phải fetch `GET /api/public/news/{slug}` |
| 12 | **Đăng nhập (KH)** | `(public)/dang-nhap/page.tsx` | Chỉ giao diện, nút `type="button"` không làm gì | 🟡 **Nên sửa** — không có backend cho user login |
| 13 | **Đăng ký** | `(public)/dang-ky/page.tsx` | Chỉ giao diện, nút `type="button"` không làm gì | 🟡 **Nên sửa** — không có backend register |

### ⚙️ Components chung

| # | Component | File | Trạng thái |
|---|---|---|---|
| 14 | Header | `(public)/Header.tsx` | ✅ Hamburger menu hoạt động (`useState`) |
| 15 | Footer | `(public)/Footer.tsx` | ✅ HTML tĩnh — chấp nhận được |
| 16 | Layout | `(public)/layout.tsx` | ✅ Header + children + Footer |

---

## 2. TRANG QUẢN TRỊ (ADMIN) — 9 file

### ✅ TẤT CẢ TRANG ADMIN ĐỀU GỌI API THẬT

| # | Trang | File | API calls | CRUD đầy đủ? |
|---|---|---|---|---|
| 1 | **Dashboard** | `admin/dashboard/page.tsx` | `GET /admin/stats/summary` + `GET /admin/stats/revenue-chart` | ✅ Hiển thị data thật |
| 2 | **Quản lý Tin tức** | `admin/news/page.tsx` | `GET + POST + PUT + DELETE /admin/news` | ✅ CRUD đầy đủ |
| 3 | **Quản lý Dịch vụ** | `admin/services/page.tsx` | `GET /admin/service-plans` + `QR modal` | 🟡 Chỉ GET + QR, **thiếu Create/Edit/Delete UI** |
| 4 | **Quản lý Đơn hàng** | `admin/orders/page.tsx` | `GET /admin/orders` + `PUT status` + `GET /export/orders` | ✅ Xem + đổi trạng thái + Export Excel |
| 5 | **Quản lý Affiliate** | `admin/affiliates/page.tsx` | `GET /admin/affiliates/pending` + `PUT status` | ✅ Xem + đổi trạng thái |
| 6 | **Khuyến mãi** | `admin/promotions/page.tsx` | `GET + POST + DELETE /admin/promotions` | 🟡 Thiếu **PUT (Edit)** UI |
| 7 | **Thống kê** | `admin/analytics/page.tsx` | `GET /admin/stats/summary` + `GET /admin/stats/revenue-chart` | ✅ Biểu đồ data thật |
| 8 | **Audit Logs** | `admin/audit-logs/page.tsx` | `GET /admin/audit-logs` | ✅ Data thật |
| 9 | **Layout + Sidebar** | `admin/layout.tsx` | — | ✅ Sidebar + navigation |
| 10 | **Logout Button** | `admin/LogoutButton.tsx` | — | ✅ Xóa cookie + redirect |

---

## 3. TRANG DASHBOARD KHÁCH HÀNG — 6 file

### ❌ TẤT CẢ ĐỀU LÀ HTML TĨNH (0 API calls)

| # | Trang | File | Vấn đề | Mức cần sửa |
|---|---|---|---|---|
| 1 | **Tổng quan** | `dashboard/page.tsx` | Server list hardcode, nút "Khởi tạo Server" không hoạt động | 🟡 |
| 2 | **Máy chủ ảo** | `dashboard/may-chu-ao/page.tsx` | **Trang trống!** Chỉ có 1 dòng text placeholder | 🔴 |
| 3 | **Lưu trữ** | `dashboard/luu-tru/page.tsx` | Storage volumes hardcode, nút không hoạt động | 🟡 |
| 4 | **Hóa đơn** | `dashboard/hoa-don/page.tsx` | Transactions hardcode, nút không hoạt động | 🟡 |
| 5 | **Cài đặt** | `dashboard/cai-dat/page.tsx` | Form settings hardcode, nút "Lưu thay đổi" không hoạt động | 🟡 |
| 6 | **Layout** | `dashboard/layout.tsx` | Sidebar tĩnh | ✅ Chấp nhận |

> **Lưu ý:** Khu vực `/dashboard` (Customer Dashboard) **không có trong đề bài yêu cầu**. Đây là phần mở rộng thêm. Nếu không có thời gian, có thể **bỏ qua hoặc ẩn đi**.

---

## 4. BACKEND API — DANH SÁCH 37 ENDPOINTS

### ✅ Endpoints đã hoạt động

| # | Method | Route | Mô tả |
|---|---|---|---|
| **Public** |
| 1 | GET | `/api/public/service-categories` | Danh mục dịch vụ |
| 2 | GET | `/api/public/service-plans` | Tất cả gói dịch vụ |
| 3 | GET | `/api/public/service-plans/{id}` | Chi tiết 1 gói |
| 4 | GET | `/api/public/service-plans/{id}/qr` | QR code cho gói |
| 5 | GET | `/api/public/news` | Danh sách tin tức |
| 6 | GET | `/api/public/news/{slug}` | Chi tiết tin tức theo slug |
| 7 | POST | `/api/public/orders` | Gửi yêu cầu đặt dịch vụ |
| 8 | POST | `/api/public/affiliates` | Đăng ký affiliate |
| **Auth** |
| 9 | POST | `/api/auth/login` | Đăng nhập → JWT |
| 10 | POST | `/api/auth/refresh` | Refresh token |
| 11 | POST | `/api/auth/change-password` | Đổi mật khẩu |
| **Admin** |
| 12-15 | CRUD | `/api/admin/categories` | Quản lý danh mục |
| 16-19 | CRUD | `/api/admin/service-plans` | Quản lý gói dịch vụ |
| 20-23 | CRUD | `/api/admin/news` | Quản lý tin tức |
| 24-28 | CRUD | `/api/admin/promotions` | Quản lý khuyến mãi |
| 29-31 | GET+PUT | `/api/admin/orders` | Quản lý đơn hàng |
| 32-33 | GET+PUT | `/api/admin/affiliates` | Quản lý affiliate |
| 34-35 | GET | `/api/admin/stats/summary` + `/revenue-chart` | Thống kê |
| 36 | GET | `/api/admin/audit-logs` | Audit logs |
| 37 | GET | `/api/admin/export/orders` | Xuất Excel |

---

## 5. TỔNG HỢP VẤN ĐỀ CẦN SỬA

### 🔴 ƯU TIÊN CAO — Chức năng bắt buộc nhưng chưa hoạt động

| # | Vấn đề | File cần sửa | Giải pháp | Thời gian |
|---|---|---|---|---|
| 1 | **Tin tức [slug]** không fetch API | `(public)/tin-tuc/[slug]/page.tsx` | Thêm `'use client'` + `useEffect` gọi `apiClient.get('/public/news/' + slug)` | 15 phút |
| 2 | **Dịch vụ list** dữ liệu cứng | `(public)/dich-vu/page.tsx` | Thêm `'use client'` + `useEffect` gọi `GET /api/public/service-plans` | 20 phút |
| 3 | **Dịch vụ [slug]** dữ liệu cứng | `(public)/dich-vu/[slug]/page.tsx` | Thêm `useEffect` gọi `GET /api/public/service-plans/{id}` | 20 phút |
| 4 | **Admin Services** thiếu Create/Edit/Delete | `admin/services/page.tsx` | Thêm modal form + gọi `POST/PUT/DELETE /admin/service-plans` | 1-2 giờ |
| 5 | **Admin Promotions** thiếu Edit (PUT) | `admin/promotions/page.tsx` | Thêm nút Edit + modal + gọi `PUT /admin/promotions/{id}` | 30 phút |

### 🟡 ƯU TIÊN TB — Nên sửa nếu có thời gian

| # | Vấn đề | File cần sửa | Giải pháp | Thời gian |
|---|---|---|---|---|
| 6 | **Đăng nhập KH** không hoạt động | `(public)/dang-nhap/page.tsx` | Backend không có user registration/login. **Tạm giải pháp**: redirect về `/login` admin, hoặc hiển thị thông báo "Tính năng sắp ra mắt" | 15 phút |
| 7 | **Đăng ký** không hoạt động | `(public)/dang-ky/page.tsx` | Tương tự trên | 15 phút |
| 8 | **Dashboard KH** tất cả tĩnh | `dashboard/*.tsx` (5 file) | Hoặc kết nối API hoặc **ẩn đi** (không thuộc đề bài) | 0-3 giờ |
| 9 | **Trang chủ** một phần tĩnh | `(public)/page.tsx` | Section "Tin tức mới nhất", "Testimonials" vẫn hardcode | 30 phút |

---

## 6. KẾ HOẠCH SỬA CHỮA CHI TIẾT

### Bước 1: Chạy Backend local (5 phút)

```bash
# Mở terminal 1: Chạy Backend
cd backend/CloudService.WebApi
dotnet run

# Kiểm tra API hoạt động
# Mở trình duyệt: http://localhost:5023/swagger
```

### Bước 2: Chạy Frontend local (3 phút)

```bash
# Mở terminal 2: Chạy Frontend
cd frontend
npm install    # lần đầu
npm run dev

# Mở trình duyệt: http://localhost:3000
```

---

### Bước 3: Sửa trang Tin tức [slug] — 15 phút

**File:** `frontend/src/app/(public)/tin-tuc/[slug]/page.tsx`

**Hiện tại:** Không gọi API, chỉ hiện `fallbackArticle` cố định.

**Cần sửa:** Thêm fetch API thật:

```tsx
// Đảm bảo có 'use client' ở dòng 1
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/public/news/${slug}`)
      .then(res => setArticle(res.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="min-h-screen pt-32 text-center">Đang tải...</main>;
  if (!article) return <main className="min-h-screen pt-32 text-center">Bài viết không tồn tại</main>;

  // ... render article (giữ nguyên phần JSX cũ, thay fallbackArticle bằng article)
}
```

---

### Bước 4: Sửa trang Dịch vụ (list) — 20 phút

**File:** `frontend/src/app/(public)/dich-vu/page.tsx`

**Hiện tại:** Mảng `services` hardcode 4 dịch vụ.

**Cần sửa:**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/public/service-plans')
      .then(res => setServices(res.data))
      .catch(() => {
        // Fallback nếu API lỗi — giữ nguyên mảng cũ
        setServices([
          { id: 'cloud-server', name: 'Cloud Server (VPS)', /* ... */ },
          // ... giữ data cũ làm fallback
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ... render (giữ nguyên JSX, data từ API tự động cập nhật)
}
```

---

### Bước 5: Sửa Chi tiết Dịch vụ [slug] — 20 phút

**File:** `frontend/src/app/(public)/dich-vu/[slug]/page.tsx`

**Hiện tại:** Object `serviceDetails` hardcode.

**Cần sửa:** Tương tự bước 3, fetch `GET /api/public/service-plans/{id}`

---

### Bước 6: Bổ sung CRUD cho Admin Services — 1-2 giờ

**File:** `frontend/src/app/admin/services/page.tsx`

**Hiện tại:** Chỉ có GET (hiển thị danh sách) + QR modal. Không có nút Tạo/Sửa/Xóa.

**Cần thêm:**
1. Nút "**+ Thêm gói dịch vụ**" → mở modal form
2. Nút "**Sửa**" trên mỗi dòng → mở modal form prefill
3. Nút "**Xóa**" trên mỗi dòng → confirm + gọi `DELETE`
4. Modal form với các trường: name, slug, specs, categoryId, prices

```tsx
// Ví dụ hàm xử lý
const handleSave = async () => {
  if (editingId) {
    await apiClient.put(`/admin/service-plans/${editingId}`, formData);
  } else {
    await apiClient.post('/admin/service-plans', formData);
  }
  fetchPlans(); // Reload danh sách
  setShowModal(false);
};

const handleDelete = async (id: string) => {
  if (!confirm('Bạn chắc chắn muốn xóa?')) return;
  await apiClient.delete(`/admin/service-plans/${id}`);
  fetchPlans();
};
```

---

### Bước 7: Bổ sung Edit cho Admin Promotions — 30 phút

**File:** `frontend/src/app/admin/promotions/page.tsx`

**Hiện tại:** Có GET + POST + DELETE. Thiếu PUT (Edit).

**Cần thêm:**
1. Nút "Sửa" trên mỗi dòng
2. Khi bấm → prefill modal form với data hiện tại
3. Submit → gọi `apiClient.put('/admin/promotions/' + id, updatedData)`

---

### Bước 8: Xử lý trang Đăng nhập/Đăng ký KH — 15 phút

**File:** `(public)/dang-nhap/page.tsx` + `(public)/dang-ky/page.tsx`

**Lựa chọn 1 — Nhanh (khuyến nghị):** Redirect về `/login` admin
```tsx
// Thêm vào nút đăng nhập
<Link href="/login" className="...">Đăng Nhập</Link>
```

**Lựa chọn 2 — Tạm thời:** Hiển thị toast "Tính năng đang phát triển"

**Lựa chọn 3 — Đầy đủ (nếu có thời gian):** Tạo `POST /auth/register` ở backend

---

### Bước 9 (Tùy chọn): Xử lý Dashboard KH — 0-3 giờ

**Khu vực `/dashboard`** không có trong đề bài yêu cầu. Có 2 lựa chọn:

**Lựa chọn A — Ẩn đi:**
- Xóa link Dashboard khỏi Header
- Không cần sửa code

**Lựa chọn B — Kết nối API (nếu có thời gian):**
- Cần tạo thêm backend endpoints cho customer dashboard
- Tốn nhiều thời gian, không cần thiết cho điểm

---

## 7. CHECKLIST SAU KHI SỬA

Sau khi hoàn thành, test lại từng trang:

### Test Public Pages
- [ ] Trang chủ `/` — hiển thị danh mục dịch vụ từ DB
- [ ] Giới thiệu `/gioi-thieu` — hiển thị OK
- [ ] Dịch vụ `/dich-vu` — **danh sách từ API**
- [ ] Chi tiết DV `/dich-vu/cloud-server` — **data từ API**
- [ ] Bảng giá `/bang-gia` — **gói + QR từ API** + toggle tháng/năm
- [ ] Khách hàng `/khach-hang` — hiển thị OK
- [ ] Tin tức `/tin-tuc` — **danh sách từ API**
- [ ] Tin tức detail `/tin-tuc/xu-huong-cloud-2026` — **data từ API**
- [ ] Liên hệ `/lien-he` — **form gửi → DB**
- [ ] Đối tác `/doi-tac` — **form gửi → DB**
- [ ] Đăng nhập `/dang-nhap` — redirect hoặc thông báo
- [ ] Đăng ký `/dang-ky` — redirect hoặc thông báo

### Test Admin Pages (đăng nhập trước tại `/login`)
- [ ] Dashboard `/admin/dashboard` — **stats + chart từ API**
- [ ] Tin tức `/admin/news` — **CRUD đầy đủ**
- [ ] Dịch vụ `/admin/services` — **CRUD đầy đủ + QR**
- [ ] Đơn hàng `/admin/orders` — **list + đổi status + Export Excel**
- [ ] Affiliate `/admin/affiliates` — **list + đổi status**
- [ ] Khuyến mãi `/admin/promotions` — **CRUD đầy đủ (cần thêm Edit)**
- [ ] Thống kê `/admin/analytics` — **biểu đồ từ API**
- [ ] Audit logs `/admin/audit-logs` — **data từ API**

---

## 8. ƯỚC LƯỢNG THỜI GIAN TỔNG

| Bước | Thời gian | Ai làm |
|---|---|---|
| Bước 1-2: Chạy local | 10 phút | Bất kỳ ai |
| Bước 3: Tin tức [slug] | 15 phút | TV3 |
| Bước 4: Dịch vụ list | 20 phút | TV3 |
| Bước 5: Dịch vụ [slug] | 20 phút | TV3 |
| Bước 6: Admin Services CRUD | 1-2 giờ | TV4 |
| Bước 7: Admin Promotions Edit | 30 phút | TV4 |
| Bước 8: Đăng nhập/Đăng ký KH | 15 phút | TV3 |
| **Tổng** | **~3-4 giờ** | |

> **Sau khi sửa xong, hệ thống sẽ đạt ~95% chức năng hoạt động thật.** Các trang marketing (Giới thiệu, Khách hàng) dùng data cứng là hoàn toàn chấp nhận được vì đây là nội dung tĩnh theo bản chất.
