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

  const [activePromotion, setActivePromotion] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get(`/service-plans/${id}`),
      apiClient.get(`/public/settings`).catch(() => ({ data: { settings: {} } })) // fallback if fails
    ])
      .then(([resPlan, resSettings]) => {
        const plan = resPlan.data;
        const settings = resSettings.data.settings || {};
        const promo = resSettings.data.activePromotion;
        
        if (promo) {
          setActivePromotion(promo);
        }
        
        // Parse specs to find CPU, RAM, SSD, BW
        let specsLines: string[] = [];
        if (plan.specs) {
          specsLines = plan.specs.split(/[\n,]| \/ /).map((s: string) => s.trim()).filter(Boolean);
        }

        const getSpec = (keyword: string) => specsLines.find((l: string) => l.toLowerCase().includes(keyword));
        
        // Dynamic Discounts
        const yearlyDiscountRateStr = settings['YearlyDiscountRate'] || '16';
        const yearlyDiscountRate = parseInt(yearlyDiscountRateStr) || 0;
        
        const monthlyDiscountRate = promo ? promo.discountPercentage : 0;
        
        const priceMonthOriginal = plan.monthlyPrice || 0;
        const priceMonth = priceMonthOriginal * (1 - monthlyDiscountRate / 100);
        
        const priceYearOriginal = priceMonthOriginal * 12;
        const priceYear = priceYearOriginal * (1 - yearlyDiscountRate / 100);

        setService({
          name: plan.category?.name || 'Gói Dịch vụ',
          desc: plan.category?.description || 'Máy chủ ảo hiệu năng cao với 100% NVMe SSD, cam kết uptime 99.99%.',
          color: 'blue',
          specSchema: plan.category?.specSchema,
          specsLines: specsLines,
          plans: [
            { 
              name: plan.name, 
              cpu: getSpec('vcpu') || getSpec('cpu') || getSpec('core') || '-', 
              ram: getSpec('ram') || getSpec('gb') || '-', 
              ssd: getSpec('ssd') || getSpec('nvme') || getSpec('disk') || '-', 
              bw: getSpec('băng thông') || getSpec('bw') || 'Không giới hạn', 
              priceMonth: priceMonth, 
              priceMonthOriginal: priceMonthOriginal,
              monthlyDiscountRate: monthlyDiscountRate,
              promoCode: promo ? promo.code : null,
              priceYear: priceYear,
              priceYearOriginal: priceYearOriginal,
              yearlyDiscountRate: yearlyDiscountRate
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

  useEffect(() => {
    if (!activePromotion) return;
    
    // Đếm đến 23:59:59 của ngày ExpiryDate
    const expiry = new Date(activePromotion.expiryDate);
    expiry.setHours(23, 59, 59, 999);
    
    const calculateTimeLeft = () => {
      const difference = expiry.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activePromotion]);

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
                {service.specSchema && service.specSchema.length > 0 ? (
                  service.specSchema.map((schema: string, idx: number) => (
                    <th key={idx} className="px-6 py-4 text-sm font-bold text-slate-600">{schema}</th>
                  ))
                ) : (
                  <>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">CPU</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">RAM</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">SSD</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-600">Băng thông</th>
                  </>
                )}
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Giá/tháng</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Giá/năm</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {service.plans.map((plan: any, idx: number) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-900">{plan.name}</td>
                  {service.specSchema && service.specSchema.length > 0 ? (
                    service.specSchema.map((_: string, specIdx: number) => (
                      <td key={specIdx} className="px-6 py-5 text-slate-600 text-sm">
                        {service.specsLines[specIdx] || '-'}
                      </td>
                    ))
                  ) : (
                    <>
                      <td className="px-6 py-5 text-slate-600 text-sm">{plan.cpu}</td>
                      <td className="px-6 py-5 text-slate-600 text-sm">{plan.ram}</td>
                      <td className="px-6 py-5 text-slate-600 text-sm">{plan.ssd}</td>
                      <td className="px-6 py-5 text-slate-600 text-sm">{plan.bw}</td>
                    </>
                  )}
                  <td className="px-6 py-5 font-bold text-slate-900">
                    {plan.monthlyDiscountRate > 0 ? (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-emerald-600 font-bold text-sm">{formatPrice(plan.priceMonth)}</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Giảm {plan.monthlyDiscountRate}%</span>
                        </div>
                        <span className="text-xs text-slate-400 line-through mb-2">{formatPrice(plan.priceMonthOriginal)}</span>
                        {timeLeft && (
                          <div className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md font-medium w-fit">
                            <span className="animate-pulse">🔥</span>
                            Kết thúc sau: {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>{formatPrice(plan.priceMonth)}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold text-sm">{formatPrice(plan.priceYear)}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Giảm {plan.yearlyDiscountRate}%</span>
                      </div>
                      <span className="text-xs text-slate-400 line-through mt-0.5">{formatPrice(plan.priceYearOriginal)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/thanh-toan?plan=${id}${plan.promoCode ? `&promo=${plan.promoCode}` : ''}`} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
