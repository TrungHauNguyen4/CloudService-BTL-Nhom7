'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';

// Dữ liệu dự phòng
const fallbackService = {
  name: 'Chi tiết Dịch vụ',
  desc: 'Thông tin chi tiết về dịch vụ đám mây của chúng tôi.',
  color: 'blue',
  plans: [],
  features: [
    'Toàn quyền quản trị',
    'Tự động Snapshot hàng tuần',
    'Chống DDoS Layer 3/4/7 tích hợp sẵn',
    'Hỗ trợ kỹ thuật 24/7/365',
    'SLA cam kết 99.99% uptime',
  ],
};

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.slug as string;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/public/service-plans/${id}`)
      .then(res => {
        const plan = res.data;
        // Parse specs to find CPU, RAM, SSD, BW if possible, or use fallback
        const specsLines = plan.specs ? plan.specs.split('\n') : [];
        const getSpec = (keyword: string) => specsLines.find((l: string) => l.toLowerCase().includes(keyword)) || '-';
        
        // Cố gắng parse monthly/yearly price từ mảng Prices (nếu Backend trả về)
        // Nếu Backend không trả về mảng Prices, dùng MonthlyPrice từ DTO và tự tính YearlyPrice
        const priceMonth = plan.monthlyPrice || 0;
        const priceYear = priceMonth * 10; // Giả sử mua 1 năm tặng 2 tháng

        setService({
          name: plan.category?.name || 'Gói Dịch vụ',
          desc: 'Máy chủ ảo hiệu năng cao với 100% NVMe SSD, cam kết uptime 99.99%.',
          color: 'blue',
          plans: [
            { 
              name: plan.name, 
              cpu: getSpec('vcore') || getSpec('cpu') || '-', 
              ram: getSpec('ram') || getSpec('gb') || '-', 
              ssd: getSpec('ssd') || '-', 
              bw: getSpec('băng thông') || 'Không giới hạn', 
              priceMonth: priceMonth, 
              priceYear: priceYear 
            }
          ],
          features: specsLines.length > 0 ? specsLines : fallbackService.features,
        });
      })
      .catch(() => {
        setService(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </main>
    );
  }

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
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Chi tiết gói dịch vụ</h2>
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
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Thông số nổi bật</h2>
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
