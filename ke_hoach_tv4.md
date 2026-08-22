# 🚀 KẾ HOẠCH HÀNH ĐỘNG CỦA THÀNH VIÊN 4 (TV4) - GIAI ĐOẠN 5
**Mục tiêu: Đạt 100% tiến độ Giao diện Quản trị (Admin Dashboard)**

> **Lưu ý quan trọng:** Cấu trúc thư mục của Admin hiện tại đã được đổi từ `(admin)` sang `admin` để chuẩn hóa đường dẫn URL thành `/admin/...`. Không được tạo nhầm vào thư mục cũ.

---

## 📌 QUY TRÌNH LÀM VIỆC (Dành riêng cho TV4)
Vì dự án vừa trải qua đợt gộp code lớn, bạn bắt buộc phải kéo code mới nhất về và tạo nhánh riêng trước khi code:

1. Mở Terminal và kéo code mới nhất:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Tạo nhánh làm việc mới:
   ```bash
   git checkout -b feature/tv4-phase5
   ```
3. Cài đặt các thư viện bắt buộc cho Giai đoạn 5:
   ```bash
   npm install recharts
   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-heading
   npm install file-saver
   npm install -D @types/file-saver
   ```

---

## 🎯 NHIỆM VỤ 1: Cập nhật Thanh Điều Hướng (Sidebar Menu)
**Mở file:** `frontend/src/app/admin/layout.tsx`

Bổ sung thêm 3 nút mới vào thanh Menu (Sidebar), bên dưới phần `/affiliates`.
Import các icon mới:
```tsx
import { LayoutDashboard, Server, ShoppingCart, Users, Settings, Bell, Search, Newspaper, PieChart, History } from "lucide-react";
```

Thêm vào thẻ `<nav>`:
```tsx
<NavItem href="/admin/news" icon={<Newspaper size={20} />} label="Tin Tức" />
<NavItem href="/admin/analytics" icon={<PieChart size={20} />} label="Thống Kê" />
<NavItem href="/admin/audit-logs" icon={<History size={20} />} label="Nhật Ký Hệ Thống" />
```

---

## 🎯 NHIỆM VỤ 2: Tính năng Xuất File Excel Đơn Hàng
**Sửa file:** `frontend/src/app/admin/orders/page.tsx`

Import ở đầu file:
```tsx
import { saveAs } from 'file-saver';
```

Thêm hàm Export bên trong component `OrdersPage`:
```tsx
const handleExportExcel = async () => {
  try {
    const response = await apiClient.get('/admin/export/orders', {
      responseType: 'blob' 
    });
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `DanhSachDonHang_${new Date().toISOString().slice(0,10)}.xlsx`);
  } catch (error) {
    alert("Lỗi khi tải file Excel! Vui lòng thử lại sau.");
  }
};
```

Gắn nút Export kế bên thanh Search trong Giao diện:
```tsx
<div className="flex items-center gap-4 mb-6">
  {/* Thanh search cũ của bạn ở đây... */}
  <button 
    onClick={handleExportExcel}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors flex items-center gap-2"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
    Xuất Excel
  </button>
</div>
```

---

## 🎯 NHIỆM VỤ 3: Bảng Thống kê & Biểu đồ (Analytics)
**Tạo file:** `frontend/src/app/admin/analytics/page.tsx`

```tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const lineData = [
  { name: 'Tháng 1', users: 4000, revenue: 2400 },
  { name: 'Tháng 2', users: 3000, revenue: 1398 },
  { name: 'Tháng 3', users: 2000, revenue: 9800 },
  { name: 'Tháng 4', users: 2780, revenue: 3908 },
  { name: 'Tháng 5', users: 1890, revenue: 4800 },
  { name: 'Tháng 6', users: 2390, revenue: 3800 },
];

const pieData = [
  { name: 'Gói Cơ Bản', value: 400 },
  { name: 'Gói Pro', value: 300 },
  { name: 'Gói Doanh Nghiệp', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Thống Kê Tổng Quan</h1>
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {['Tổng Doanh Thu', 'Khách Hàng Mới', 'Đơn Hàng', 'Lượt Truy Cập'].map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">{t}</h3>
            <p className="text-3xl font-black text-slate-800">{(Math.random() * 10000).toFixed(0)}</p>
            <p className="text-emerald-500 text-xs font-bold mt-2">+15% tháng này</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ đường */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tăng trưởng Người dùng</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ Gói Dịch vụ</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 NHIỆM VỤ 4: Giao diện Nhật ký Hệ thống (Audit Logs)
**Tạo file:** `frontend/src/app/admin/audit-logs/page.tsx`

```tsx
'use client';

const mockLogs = [
  { id: 1, admin: 'Nguyễn Trung Hậu', action: 'Xóa tài khoản khách hàng ID #1029', type: 'DELETE', time: '10 phút trước' },
  { id: 2, admin: 'Admin Hệ Thống', action: 'Cập nhật cấu hình gói VPS Pro', type: 'UPDATE', time: '2 giờ trước' },
  { id: 3, admin: 'Nguyễn Trung Hậu', action: 'Thêm mới mã giảm giá SUMMER2026', type: 'CREATE', time: '1 ngày trước' },
];

export default function AuditLogsPage() {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'DELETE': return 'bg-rose-100 text-rose-700';
      case 'UPDATE': return 'bg-amber-100 text-amber-700';
      case 'CREATE': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nhật Ký Hoạt Động</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
          {mockLogs.map(log => (
            <div key={log.id} className="relative pl-8">
              {/* Vòng tròn mốc thời gian */}
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white shadow"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">{log.admin} <span className="font-normal text-slate-500 text-sm ml-2">đã thực hiện</span></p>
                  <p className="text-slate-700 mt-1">{log.action}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeColor(log.type)}`}>
                    {log.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 NHIỆM VỤ 5: Trang Quản lý Tin tức (Tích hợp TipTap)
**Tạo file:** `frontend/src/app/admin/news/page.tsx`

```tsx
'use client';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function NewsAdminPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Bắt đầu viết nội dung tại đây...</p>',
  });

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold">Viết Bài Mới</h2>
          <div className="space-x-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Hủy</button>
            <button onClick={() => alert("Đã lưu!")} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow">Lưu Bài</button>
          </div>
        </div>
        
        <input 
          type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl font-black border-none outline-none mb-6 placeholder-slate-300"
        />

        {/* Thanh công cụ TipTap */}
        <div className="flex gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded font-bold ${editor?.isActive('bold') ? 'bg-slate-200' : ''}`}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded italic ${editor?.isActive('italic') ? 'bg-slate-200' : ''}`}>I</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-1 rounded font-bold">H2</button>
        </div>

        {/* Khu vực soạn thảo */}
        <EditorContent editor={editor} className="min-h-[400px] prose max-w-none focus:outline-none" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Tin Tức</h1>
        <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow">
          + Viết Bài Mới
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
        Chưa có bài viết nào. Hãy bấm "Viết Bài Mới" để bắt đầu.
      </div>
    </div>
  );
}
```

---
> 🏆 Sau khi làm xong, hãy dùng lệnh `git add .`, `git commit -m "feat(admin): hoan thien giao dien quan tri nang cao"` và đẩy (Push) lên nhánh của bạn nhé!
