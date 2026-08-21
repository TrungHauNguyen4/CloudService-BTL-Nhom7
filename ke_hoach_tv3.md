# 🚀 KẾ HOẠCH HÀNH ĐỘNG CỦA THÀNH VIÊN 3 (TV3)
**Mục tiêu: Đạt 100% tiến độ Frontend Public**

Dựa trên bảng đánh giá ngày 21/08, TV3 đã hoàn thành khoảng **60-65%** khối lượng công việc. Giao diện đã **rất đẹp** nhưng còn thiếu 2 trang quan trọng, chưa kết nối API backend, và thiếu SEO. Dưới đây là danh sách **7 nhiệm vụ** cần xử lý để đạt 100%.

---

## 📌 TỔNG QUAN TÌNH HÌNH HIỆN TẠI

### ✅ Đã hoàn thành (6/8 trang + 2 trang bonus):
| Trang | File | Trạng thái |
|---|---|---|
| Trang chủ | `(public)/page.tsx` | ✅ 233 dòng — Hero, Stats, Services, Testimonials |
| Giới thiệu | `(public)/gioi-thieu/page.tsx` | ✅ 149 dòng — Story, Core Values, CTA |
| Dịch vụ | `(public)/dich-vu/page.tsx` | ✅ 103 dòng — Grid 4 dịch vụ |
| Bảng giá | `(public)/bang-gia/page.tsx` | ✅ 125 dòng — 3 gói + "Phổ biến nhất" |
| Liên hệ | `(public)/lien-he/page.tsx` | ✅ 133 dòng — Form + Thông tin |
| Đối tác | `(public)/doi-tac/page.tsx` | ✅ 76 dòng — Grid + CTA |
| Đăng ký *(bonus)* | `(public)/dang-ky/page.tsx` | ✅ 136 dòng — Split layout |
| Đăng nhập *(bonus)* | `(public)/dang-nhap/page.tsx` | ✅ 114 dòng — Split layout |
| Header | `(public)/Header.tsx` | ✅ 63 dòng |
| Footer | `(public)/Footer.tsx` | ✅ 43 dòng |

### ❌ Còn thiếu:
1. **Trang Tin tức** (`/tin-tuc`) — danh sách bài viết
2. **Chi tiết Tin tức** (`/tin-tuc/[slug]`) — xem 1 bài viết
3. **Chi tiết Dịch vụ** (`/dich-vu/[slug]`) — xem chi tiết 1 dịch vụ
4. **Kết nối API backend** — hiện tại 100% dùng dữ liệu cứng
5. **Form submit** — Liên hệ và Đối tác chỉ có giao diện, chưa gọi API
6. **Toggle Tháng/Năm** ở Bảng giá
7. **SEO metadata** cho tất cả các trang
8. **Hamburger menu mobile** — có icon nhưng chưa toggle được

---

## 🎯 NHIỆM VỤ 1: Tạo file TypeScript Types (Nền tảng)

> **Ưu tiên:** Làm ĐẦU TIÊN vì tất cả trang khác sẽ dùng.

**Tạo file:** `frontend/src/types/index.ts`

```typescript
// ===== Các kiểu dữ liệu mapping từ Backend DTOs =====

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ServicePlan {
  id: string;
  name: string;
  slug: string;
  specs?: string;
  categoryId: string;
  category?: ServiceCategory;
  prices?: PlanPrice[];
  isActive: boolean;
}

export interface PlanPrice {
  id: string;
  planId: string;
  billingCycle: 'Monthly' | 'Yearly';
  price: number;
  originalPrice: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  authorName: string;
  publishedAt?: string;
  isPublished: boolean;
}

export interface CreateOrderDto {
  planId: string;
  serviceName: string;
  billingCycle: 'Monthly' | 'Yearly';
  customerName: string;
  email: string;
  phone: string;
}

export interface CreateAffiliateDto {
  fullName: string;
  email: string;
  phone: string;
  website?: string;
}
```

---

## 🎯 NHIỆM VỤ 2: Tạo trang Tin Tức (KHẨN CẤP)

> **Ưu tiên:** 🔴 CAO — Đây là 1 trong 2 trang còn thiếu hoàn toàn.

### 2.1 Tạo trang Danh sách Tin tức

**Tạo file:** `frontend/src/app/(public)/tin-tuc/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

// Dữ liệu dự phòng nếu API chưa sẵn sàng
const fallbackArticles = [
  {
    id: '1', title: 'Xu hướng Cloud Computing 2026', slug: 'xu-huong-cloud-2026',
    content: 'Điện toán đám mây tiếp tục là xu hướng chủ đạo trong chuyển đổi số doanh nghiệp...',
    category: 'Xu hướng', authorName: 'Admin', publishedAt: '2026-08-15T10:00:00', isPublished: true,
  },
  {
    id: '2', title: 'Hướng dẫn bảo mật Server Linux', slug: 'bao-mat-server-linux',
    content: 'Bảo mật máy chủ Linux là bước quan trọng đầu tiên để bảo vệ dữ liệu doanh nghiệp...',
    category: 'Hướng dẫn', authorName: 'Editor', publishedAt: '2026-08-10T08:00:00', isPublished: true,
  },
  {
    id: '3', title: 'So sánh VPS vs Dedicated Server', slug: 'so-sanh-vps-dedicated',
    content: 'Khi nào nên dùng VPS và khi nào nên chuyển sang Dedicated Server? Bài viết phân tích...',
    category: 'So sánh', authorName: 'Admin', publishedAt: '2026-08-05T14:00:00', isPublished: true,
  },
  {
    id: '4', title: 'CloudService ra mắt gói Enterprise mới', slug: 'ra-mat-goi-enterprise',
    content: 'Chúng tôi vui mừng giới thiệu gói Enterprise mới với hiệu năng gấp 3 lần...',
    category: 'Thông báo', authorName: 'Admin', publishedAt: '2026-07-28T09:00:00', isPublished: true,
  },
  {
    id: '5', title: 'Tối ưu hóa chi phí Cloud cho Startup', slug: 'toi-uu-chi-phi-cloud-startup',
    content: 'Với ngân sách hạn chế, các startup cần chiến lược sử dụng cloud thông minh...',
    category: 'Hướng dẫn', authorName: 'Editor', publishedAt: '2026-07-20T11:00:00', isPublished: true,
  },
  {
    id: '6', title: 'Backup dữ liệu tự động với Cron Job', slug: 'backup-du-lieu-cron-job',
    content: 'Hướng dẫn từng bước thiết lập backup tự động sử dụng cron job trên Linux...',
    category: 'Hướng dẫn', authorName: 'Editor', publishedAt: '2026-07-15T10:00:00', isPublished: true,
  },
];

// Ánh xạ từng Category sang một màu khác nhau
const categoryColors: Record<string, string> = {
  'Xu hướng': 'bg-purple-100 text-purple-700',
  'Hướng dẫn': 'bg-blue-100 text-blue-700',
  'Thông báo': 'bg-emerald-100 text-emerald-700',
  'So sánh': 'bg-amber-100 text-amber-700',
};

export default function NewsPage() {
  const [articles, setArticles] = useState(fallbackArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Gọi API khi component mount (Nếu backend sẵn sàng)
  useEffect(() => {
    apiClient.get('/news-articles')
      .then(res => { if (res.data?.length) setArticles(res.data); })
      .catch(() => { /* Giữ nguyên fallback data */ });
  }, []);

  // Lọc bài viết theo thanh Tìm kiếm và nút Category
  const categories = ['Tất cả', ...new Set(articles.map(a => a.category))];
  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tất cả' || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Tin Tức & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Blog</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed font-light">
          Cập nhật xu hướng công nghệ, hướng dẫn kỹ thuật và các thông báo mới nhất từ CloudService.
        </p>
      </div>

      {/* THANH TÌM KIẾM + BỘ LỌC */}
      <div className="max-w-6xl mx-auto mb-12">
        {/* Ô tìm kiếm */}
        <div className="relative mb-8">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 shadow-sm"
          />
        </div>

        {/* Nút lọc Category */}
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(article => (
          <Link
            key={article.id}
            href={`/tin-tuc/${article.slug}`}
            className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Ảnh Thumbnail (placeholder) */}
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-800/5 group-hover:bg-slate-800/0 transition-colors" />
              <div className="absolute bottom-4 left-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-slate-100 text-slate-600'}`}>
                  {article.category}
                </span>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {article.content}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <span className="font-semibold">{article.authorName}</span>
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Chưa xuất bản'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Nếu không tìm thấy bài viết nào */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Không tìm thấy bài viết nào</p>
          <p className="text-sm mt-2">Thử thay đổi từ khóa hoặc bộ lọc danh mục.</p>
        </div>
      )}
    </main>
  );
}
```

### 2.2 Tạo trang Chi tiết Tin tức

**Tạo file:** `frontend/src/app/(public)/tin-tuc/[slug]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';

// Dữ liệu dự phòng chi tiết
const fallbackArticle = {
  id: '1',
  title: 'Xu hướng Cloud Computing 2026',
  slug: 'xu-huong-cloud-2026',
  content: `
    <h2>1. Multi-Cloud là xu hướng tất yếu</h2>
    <p>Các doanh nghiệp lớn đang chuyển dần sang mô hình Multi-Cloud, kết hợp nhiều nhà cung cấp dịch vụ đám mây khác nhau để tối ưu hóa chi phí và giảm thiểu rủi ro phụ thuộc vào một nhà cung cấp duy nhất (vendor lock-in). Theo khảo sát của Flexera, hơn 89% doanh nghiệp áp dụng chiến lược multi-cloud trong năm 2026.</p>
    
    <h2>2. AI tích hợp trực tiếp vào hạ tầng Cloud</h2>
    <p>Trí tuệ nhân tạo không còn là một dịch vụ riêng biệt mà đã được tích hợp sâu vào các nền tảng cloud. Từ tự động phát hiện và phản ứng trước các cuộc tấn công mạng, đến tối ưu hóa tài nguyên máy chủ dựa trên mô hình dự đoán tải — AI đang trở thành "bộ não" thầm lặng của mọi hạ tầng.</p>

    <h2>3. Edge Computing bùng nổ</h2>
    <p>Với sự phát triển của IoT và 5G, nhu cầu xử lý dữ liệu tại biên (edge) thay vì gửi về trung tâm dữ liệu tập trung ngày càng tăng. Edge Computing giúp giảm độ trễ xuống mức mili-giây, mở ra kỷ nguyên mới cho xe tự lái, nhà máy thông minh và thành phố thông minh.</p>

    <h2>4. Serverless tiếp tục tăng trưởng</h2>
    <p>Kiến trúc Serverless (FaaS) cho phép lập trình viên tập trung hoàn toàn vào logic nghiệp vụ mà không cần lo về provisioning, scaling hay quản lý hệ điều hành. AWS Lambda, Azure Functions và Google Cloud Run đang cạnh tranh khốc liệt ở phân khúc này.</p>
  `,
  category: 'Xu hướng',
  authorName: 'Admin',
  publishedAt: '2026-08-15T10:00:00',
  isPublished: true,
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState(fallbackArticle);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/news-articles/${slug}`)
      .then(res => { if (res.data) setArticle(res.data); })
      .catch(() => { /* Giữ fallback */ })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 flex justify-center">
        <div className="animate-pulse space-y-4 max-w-3xl w-full px-6">
          <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
          <div className="h-4 bg-slate-200 rounded-xl w-1/2" />
          <div className="h-64 bg-slate-200 rounded-2xl mt-8" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8">
      <article className="max-w-3xl mx-auto">
        {/* Nút quay lại */}
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại Tin tức
        </Link>

        {/* Category + Ngày đăng */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-slate-400">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
              : ''}
          </span>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Tác giả */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {article.authorName?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{article.authorName}</p>
            <p className="text-xs text-slate-400">Tác giả</p>
          </div>
        </div>

        {/* Nội dung bài viết — Render HTML từ API */}
        <div
          className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-light
            prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA cuối bài */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">Bạn cần tư vấn giải pháp Cloud?</h3>
          <p className="text-slate-400 mb-6">Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7.</p>
          <Link href="/lien-he" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-blue-600/30">
            Liên hệ ngay
          </Link>
        </div>
      </article>
    </main>
  );
}
```

> ⚠️ **Lưu ý**: Cần cài thêm plugin Tailwind Typography để class `prose` hoạt động:
> ```bash
> npm install @tailwindcss/typography
> ```

---

## 🎯 NHIỆM VỤ 3: Tạo trang Chi tiết Dịch vụ (KHẨN CẤP)

> **Ưu tiên:** 🔴 CAO — Trang `/dich-vu` có link tới `/dich-vu/[slug]` nhưng trang đó chưa tồn tại.

**Tạo file:** `frontend/src/app/(public)/dich-vu/[slug]/page.tsx`

```tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Dữ liệu chi tiết cho từng dịch vụ (dự phòng)
const serviceDetails: Record<string, any> = {
  'cloud-server': {
    name: 'Cloud Server (VPS)',
    desc: 'Máy chủ ảo hiệu năng cao với 100% NVMe SSD, cam kết uptime 99.99%.',
    color: 'blue',
    plans: [
      { name: 'VPS Basic', cpu: '1 vCPU', ram: '1GB', ssd: '20GB', bw: '1TB', priceMonth: 150000, priceYear: 1500000 },
      { name: 'VPS Pro', cpu: '2 vCPU', ram: '4GB', ssd: '60GB', bw: 'Không giới hạn', priceMonth: 350000, priceYear: 3500000 },
      { name: 'VPS Business', cpu: '4 vCPU', ram: '8GB', ssd: '120GB', bw: 'Không giới hạn', priceMonth: 700000, priceYear: 7000000 },
      { name: 'VPS Enterprise', cpu: '8 vCPU', ram: '16GB', ssd: '240GB', bw: 'Không giới hạn', priceMonth: 1400000, priceYear: 14000000 },
    ],
    features: [
      'Toàn quyền quản trị root/administrator',
      'Tự động Snapshot hàng tuần',
      'Chống DDoS Layer 3/4/7 tích hợp sẵn',
      'Cài đặt 1-click: WordPress, Docker, Node.js',
      'Hỗ trợ kỹ thuật 24/7/365',
      'SLA cam kết 99.99% uptime',
    ],
  },
  'cloud-storage': {
    name: 'Cloud Storage',
    desc: 'Lưu trữ Object Storage an toàn, linh hoạt mở rộng lên đến hàng ngàn Terabyte.',
    color: 'indigo',
    plans: [
      { name: 'Storage 100GB', cpu: '-', ram: '-', ssd: '100GB', bw: '500GB', priceMonth: 50000, priceYear: 500000 },
      { name: 'Storage 500GB', cpu: '-', ram: '-', ssd: '500GB', bw: '2TB', priceMonth: 200000, priceYear: 2000000 },
      { name: 'Storage 1TB', cpu: '-', ram: '-', ssd: '1TB', bw: '5TB', priceMonth: 380000, priceYear: 3800000 },
    ],
    features: [
      'Cơ chế nhân bản 3 lớp (3-way replica)',
      'Mã hóa AES-256 tĩnh và truyền tải',
      'Tương thích chuẩn S3 API',
      'CDN tích hợp cho tốc độ truy xuất cao',
      'Versioning tự động cho mỗi file',
    ],
  },
  'cloud-security': {
    name: 'Cloud Security',
    desc: 'Bảo vệ toàn diện trước các cuộc tấn công DDoS và mã độc.',
    color: 'teal',
    plans: [
      { name: 'Security Basic', cpu: '-', ram: '-', ssd: '-', bw: '-', priceMonth: 250000, priceYear: 2500000 },
      { name: 'Security Pro', cpu: '-', ram: '-', ssd: '-', bw: '-', priceMonth: 500000, priceYear: 5000000 },
    ],
    features: [
      'Tường lửa WAF đa lớp',
      'Chống DDoS tự động Layer 3/4/7',
      'Quét lỗ hổng bảo mật định kỳ',
      'Cảnh báo xâm nhập thời gian thực',
      'SSL/TLS miễn phí',
    ],
  },
  'cloud-database': {
    name: 'Managed Database',
    desc: 'Cơ sở dữ liệu được tối ưu sẵn, hỗ trợ MySQL, PostgreSQL, MongoDB.',
    color: 'rose',
    plans: [
      { name: 'DB Starter', cpu: '1 vCPU', ram: '2GB', ssd: '20GB', bw: '-', priceMonth: 300000, priceYear: 3000000 },
      { name: 'DB Pro', cpu: '2 vCPU', ram: '4GB', ssd: '80GB', bw: '-', priceMonth: 600000, priceYear: 6000000 },
    ],
    features: [
      'Tự động Failover (Chuyển đổi dự phòng)',
      'Backup tự động mỗi giờ',
      'Mở rộng không downtime',
      'Giám sát hiệu năng query',
    ],
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = serviceDetails[slug];

  // Nếu không tìm thấy dịch vụ
  if (!service) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Dịch vụ không tồn tại</h1>
        <Link href="/dich-vu" className="text-blue-600 font-semibold hover:underline">← Quay lại Dịch vụ</Link>
      </main>
    );
  }

  // Hàm format giá tiền VNĐ
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8">
      {/* Nút quay lại */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/dich-vu" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tất cả Dịch vụ
        </Link>
      </div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{service.name}</h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{service.desc}</p>
      </div>

      {/* BẢNG GIÁ CÁC GÓI */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Chọn gói phù hợp</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Gói</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">CPU</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">RAM</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">SSD</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Băng thông</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Giá/tháng</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Giá/năm</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {service.plans.map((plan: any, idx: number) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-900">{plan.name}</td>
                  <td className="px-6 py-5 text-slate-600 text-sm">{plan.cpu}</td>
                  <td className="px-6 py-5 text-slate-600 text-sm">{plan.ram}</td>
                  <td className="px-6 py-5 text-slate-600 text-sm">{plan.ssd}</td>
                  <td className="px-6 py-5 text-slate-600 text-sm">{plan.bw}</td>
                  <td className="px-6 py-5 font-bold text-slate-900">{formatPrice(plan.priceMonth)}</td>
                  <td className="px-6 py-5 text-emerald-600 font-semibold text-sm">{formatPrice(plan.priceYear)}</td>
                  <td className="px-6 py-5">
                    <Link
                      href={`/lien-he?plan=${plan.name}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-all"
                    >
                      Đặt ngay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TÍNH NĂNG NỔI BẬT */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

---

## 🎯 NHIỆM VỤ 4: Thêm Toggle Tháng/Năm vào trang Bảng Giá

> **Ưu tiên:** 🟡 Trung bình — Kế hoạch gốc yêu cầu toggle tháng/năm.

**Sửa file:** `frontend/src/app/(public)/bang-gia/page.tsx`

**Thay đổi cần làm:**
1. Thêm `'use client';` vào dòng đầu tiên (vì cần `useState`)
2. Thêm state `isYearly` để toggle giữa Tháng/Năm
3. Thêm giá năm cho mỗi gói (= giá tháng × 10, giảm 17%)
4. Thêm nút toggle UI

**Code mẫu cho phần toggle (thêm vào ngay dưới thẻ `</p>` của phần HEADER TITTLE):**

```tsx
{/* TOGGLE THÁNG / NĂM */}
<div className="flex items-center justify-center gap-4 mt-8">
  <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
    Thanh toán theo Tháng
  </span>
  <button
    onClick={() => setIsYearly(!isYearly)}
    className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-blue-600' : 'bg-slate-300'}`}
  >
    <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
  </button>
  <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
    Thanh toán theo Năm
    <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">-17%</span>
  </span>
</div>
```

**Và cập nhật hiển thị giá:**
```tsx
{/* Thay: */}
<span className="text-5xl font-black text-slate-900">{plan.price}</span>
<span className="text-slate-500 font-medium">/tháng</span>

{/* Bằng: */}
<span className="text-5xl font-black text-slate-900">
  {isYearly ? plan.priceYear : plan.price}
</span>
<span className="text-slate-500 font-medium">
  /{isYearly ? 'năm' : 'tháng'}
</span>
```

**Thêm trường `priceYear` vào mảng dữ liệu:**
```tsx
// Gói Cơ Bản
priceYear: '1.500.000đ',

// Gói Chuyên Nghiệp
priceYear: '3.500.000đ',

// Gói Doanh Nghiệp
priceYear: '8.000.000đ',
```

---

## 🎯 NHIỆM VỤ 5: Kết nối Form submit API

> **Ưu tiên:** 🟡 Trung bình — Form đẹp nhưng nút bấm không gọi API.

### 5.1 Sửa trang Liên hệ — Gửi đơn đặt dịch vụ

**Sửa file:** `frontend/src/app/(public)/lien-he/page.tsx`

**Thay đổi cần làm:**
1. Thêm `'use client';` vào dòng đầu tiên
2. Import `{ useState }` và `apiClient`
3. Tạo state cho form fields
4. Viết hàm `handleSubmit` gọi `POST /api/order-requests`
5. Đổi `type="button"` thành `type="submit"` và gắn `onSubmit` vào `<form>`

**Code mẫu hàm submit:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    await apiClient.post('/order-requests', {
      customerName: name,
      email: email,
      phone: '',
      serviceName: subject,
      planId: '00000000-0000-0000-0000-000000000000', // Placeholder
      billingCycle: 'Monthly',
    });
    setSuccess(true);
  } catch (err) {
    setError('Gửi tin nhắn thất bại. Vui lòng thử lại sau.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5.2 Sửa trang Đối tác — Form đăng ký affiliate

**Sửa file:** `frontend/src/app/(public)/doi-tac/page.tsx`

Thêm form đăng ký đối tác (tương tự form Liên hệ) phía dưới CTA banner, gọi `POST /api/affiliate-applications`:

```tsx
const handleAffiliateSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await apiClient.post('/affiliate-applications', {
      fullName, email, phone, website,
    });
    alert('Đăng ký đối tác thành công!');
  } catch (err) {
    alert('Có lỗi xảy ra, vui lòng thử lại.');
  }
};
```

---

## 🎯 NHIỆM VỤ 6: Sửa Hamburger Menu Mobile

> **Ưu tiên:** 🟡 Trung bình — Hiện có icon nhưng click không có gì xảy ra.

**Sửa file:** `frontend/src/app/(public)/Header.tsx`

**Thay đổi cần làm:**
1. Thêm `'use client';` vào dòng đầu tiên
2. Import `{ useState }`
3. Thêm state `isMenuOpen`
4. Gắn `onClick` vào nút hamburger
5. Thêm menu dropdown trên mobile

**Code mẫu thêm vào sau nút hamburger:**
```tsx
{/* Menu Mobile (xuất hiện khi bấm hamburger) */}
{isMenuOpen && (
  <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-slate-100 py-4 px-6 lg:hidden">
    <nav className="flex flex-col space-y-3">
      {navLinks.map((link, index) => (
        <Link
          key={index}
          href={link.path}
          className="text-slate-700 hover:text-blue-600 font-semibold py-2 border-b border-slate-50 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          {link.name}
        </Link>
      ))}
      <div className="flex flex-col gap-3 pt-4">
        <Link href="/dang-nhap" className="text-center text-slate-600 font-bold py-2">Đăng nhập</Link>
        <Link href="/dang-ky" className="text-center bg-blue-600 text-white py-3 rounded-full font-bold">Đăng ký</Link>
      </div>
    </nav>
  </div>
)}
```

---

## 🎯 NHIỆM VỤ 7: Thêm SEO Metadata cho tất cả trang

> **Ưu tiên:** 🟢 Nhỏ nhưng cần thiết — Hiện không có metadata nào.

### 7.1 Sửa Root Layout

**Sửa file:** `frontend/src/app/layout.tsx`

```tsx
// Thay dòng metadata cũ:
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Bằng:
export const metadata: Metadata = {
  title: {
    default: 'CloudService — Dịch vụ Cloud hàng đầu Việt Nam',
    template: '%s | CloudService',
  },
  description: 'Giải pháp VPS, Cloud Storage, Bảo mật đám mây với hiệu năng vượt trội, uptime 99.99%. Hỗ trợ kỹ thuật 24/7.',
  openGraph: {
    title: 'CloudService',
    description: 'Dịch vụ điện toán đám mây hàng đầu Việt Nam',
    type: 'website',
    locale: 'vi_VN',
  },
};
```

Đồng thời đổi `lang="en"` thành `lang="vi"`.

### 7.2 Thêm metadata cho từng trang (chỉ trang Server Component)

> **Lưu ý**: Chỉ trang **KHÔNG** có `'use client'` mới export được `metadata`. Các trang dùng `'use client'` thì không cần vì SEO sẽ fallback về root layout.

**Thêm vào đầu file `(public)/gioi-thieu/page.tsx`** (nếu file này không có `'use client'`):
```tsx
export const metadata = {
  title: 'Giới thiệu',
  description: 'Tìm hiểu về CloudService — hành trình từ startup đến hệ sinh thái đám mây toàn diện.',
};
```

**Thêm vào đầu file `(public)/dich-vu/page.tsx`** (nếu không có `'use client'`):
```tsx
export const metadata = {
  title: 'Dịch vụ Cloud',
  description: 'Cloud Server, Storage, Security, Managed Database — giải pháp hạ tầng đám mây cho mọi quy mô doanh nghiệp.',
};
```

**Tương tự cho các trang còn lại:**

| Trang | Title | Description |
|---|---|---|
| Trang chủ | *(dùng default từ root layout)* | — |
| Giới thiệu | `Giới thiệu` | Tìm hiểu về CloudService... |
| Dịch vụ | `Dịch vụ Cloud` | Cloud Server, Storage, Security... |
| Bảng giá | `Bảng giá` | Bảng giá minh bạch, không phí ẩn... |
| Tin tức | `Tin tức & Blog` | Cập nhật xu hướng công nghệ... |
| Liên hệ | `Liên hệ` | Liên hệ đội ngũ hỗ trợ 24/7... |
| Đối tác | `Đối tác chiến lược` | Trở thành đối tác của CloudService... |

---

## 📋 CHECKLIST TỔNG KẾT

Sau khi hoàn thành tất cả 7 nhiệm vụ, TV3 sẽ có:

- [ ] **Nhiệm vụ 1**: File `types/index.ts` — TypeScript types
- [ ] **Nhiệm vụ 2.1**: Trang `/tin-tuc` — Danh sách tin tức + Tìm kiếm + Lọc category
- [ ] **Nhiệm vụ 2.2**: Trang `/tin-tuc/[slug]` — Chi tiết bài viết
- [ ] **Nhiệm vụ 3**: Trang `/dich-vu/[slug]` — Chi tiết dịch vụ + Bảng giá gói
- [ ] **Nhiệm vụ 4**: Toggle Tháng/Năm ở trang Bảng giá
- [ ] **Nhiệm vụ 5.1**: Form Liên hệ gọi `POST /api/order-requests`
- [ ] **Nhiệm vụ 5.2**: Form Đối tác gọi `POST /api/affiliate-applications`
- [ ] **Nhiệm vụ 6**: Hamburger menu mobile hoạt động
- [ ] **Nhiệm vụ 7.1**: Root layout metadata + `lang="vi"`
- [ ] **Nhiệm vụ 7.2**: Metadata cho từng trang

---

## 💡 LỜI KHUYÊN

- **Thứ tự ưu tiên**: Làm **Nhiệm vụ 1 → 2 → 3** trước vì đây là các trang hoàn toàn mới (thiếu = mất điểm). Nhiệm vụ 4-7 là cải thiện trang đã có.
- **Về API**: Tất cả code mẫu đều có sẵn **dữ liệu dự phòng (fallback)**. Nếu API backend chưa sẵn sàng, trang vẫn hiển thị bình thường với dữ liệu giả. Khi backend sẵn sàng, trang tự động lấy dữ liệu thật.
- **Test responsive**: Sau khi code xong, mở DevTools (F12) → toggle device toolbar → test trên 320px (Mobile SE), 768px (Tablet), 1024px (Desktop).

> Kế hoạch này được tạo ra nhằm giúp TV3 có cái nhìn rõ ràng và dứt khoát hoàn thành công việc nhanh nhất. Ước tính thời gian: **2-3 ngày** nếu tập trung cao độ. Chúc TV3 code nhanh, code đẹp! 🎨
