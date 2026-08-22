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
