'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('vps');
  const [loading, setLoading] = useState(true);
  const [yearlyDiscountRate, setYearlyDiscountRate] = useState(17);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5023/api'}/service-plans`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5023/api'}/public/settings`).then(res => res.json())
    ])
      .then(([plansData, settingsData]) => {
        const publicSettings = settingsData.settings || {};
        const discountRate = parseInt(publicSettings['YearlyDiscountRate'] || '17');
        setYearlyDiscountRate(discountRate);
        
        const promo = settingsData.activePromotion;
        if (promo) {
          setPromoCode(promo.code);
        }
        
        setAllPlans(plansData);
        
        // Trích xuất danh sách các Category duy nhất
        const uniqueCats: any[] = [];
        const catMap = new Map();
        plansData.forEach((p: any) => {
          if (p.category && !catMap.has(p.category.slug)) {
            catMap.set(p.category.slug, true);
            uniqueCats.push(p.category);
          }
        });
        setCategories(uniqueCats);
        
        // Đọc tham số category từ URL (nếu có)
        let defaultCategory = 'vps';
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const catParam = params.get('category');
          if (catParam && uniqueCats.some(c => c.slug === catParam)) {
            defaultCategory = catParam;
          } else if (uniqueCats.length > 0 && !uniqueCats.some(c => c.slug === 'vps')) {
            defaultCategory = uniqueCats[0].slug;
          }
        }
        setActiveCategory(defaultCategory);
      })
      .catch(err => console.error("Error fetching plans:", err))
      .finally(() => setLoading(false));
  }, []);

  // Tính toán dữ liệu hiển thị dựa trên Tab đang chọn
  const filteredPlans = allPlans.filter((p: any) => p.category?.slug === activeCategory);
  const currentCategoryData = categories.find(c => c.slug === activeCategory);
  
  let maxCount = -1;
  let popularPlanId: string | null = null;
  filteredPlans.forEach((plan: any) => {
    const count = plan.registrationCount || 0;
    if (count > maxCount) {
      maxCount = count;
      popularPlanId = plan.id;
    }
  });

  const pricingPlans = filteredPlans.map((plan: any, index: number) => {
    let cpu = '', ram = '', storage = '';
    let features: string[] = [];
    
    if (plan.specs) {
      if (plan.specs.includes(' / ')) {
        const parts = plan.specs.split(' / ');
        cpu = parts[0] || '';
        ram = parts[1] || '';
        storage = parts[2] || '';
        features = ['Băng thông Không giới hạn', 'Hỗ trợ kỹ thuật 24/7', 'Tự động Backup'];
      } else {
        features = plan.specs.split('\n').map((s: string) => s.trim()).filter(Boolean);
      }
    } else {
      features = ['Dịch vụ tối ưu', 'Hỗ trợ kỹ thuật 24/7'];
    }
    
    const basePrice = plan.monthlyPrice || 0;
    const discountedYearlyPrice = basePrice * 12 * (1 - yearlyDiscountRate / 100);
    
    return {
      id: plan.id,
      name: plan.name,
      desc: plan.description || 'Giải pháp tối ưu cho mọi nhu cầu.',
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice),
      priceYear: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedYearlyPrice),
      priceRaw: basePrice,
      cpu,
      ram,
      storage,
      features,
      isPopular: (maxCount > 0) ? (plan.id === popularPlanId) : (index === 1)
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* HEADER TITTLE */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Bảng Giá <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Minh Bạch</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light mb-8">
          Không phí ẩn. Dễ dàng nâng cấp hoặc hạ cấp bất cứ lúc nào. Chọn gói cấu hình phù hợp với quy mô dự án của bạn.
        </p>

        {/* TOGGLE THÁNG / NĂM */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
            Thanh toán theo Tháng
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${isYearly ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
            Thanh toán theo Năm
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">-{yearlyDiscountRate}%</span>
          </span>
        </div>
        
        {/* TABS CATEGORY */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-12 mb-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat.slug 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {currentCategoryData?.promotionCode && (
          <div className="mt-4 mb-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold shadow-sm animate-in fade-in zoom-in duration-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Khuyến mãi đặc biệt cho {currentCategoryData.name}: Giảm ngay {currentCategoryData.promotionDiscountPercentage}%</span>
            <span className="bg-white px-2 py-0.5 rounded-full border border-emerald-100 text-emerald-800 ml-1">Mã: {currentCategoryData.promotionCode}</span>
          </div>
        )}
      </div>

      {/* PRICING GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {pricingPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-white rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 flex flex-col h-full ${
              plan.isPopular 
                ? 'border-2 border-blue-500 shadow-[0_20px_50px_rgba(37,99,235,0.15)] transform lg:-translate-y-4 z-10' 
                : 'border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200'
            }`}
          >
            {/* Badge Nổi Bật */}
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                Phổ biến nhất
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{plan.name}</h3>
              <p className="text-slate-500 text-sm h-10">{plan.desc}</p>
            </div>

            <div className="mb-8 flex flex-col justify-center border-b border-slate-100 pb-8 min-h-[120px]">
              {isYearly && (
                <div className="text-slate-400 font-medium line-through decoration-rose-500/50 decoration-2 text-lg mb-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.priceRaw * 12)}/năm
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">
                  {isYearly ? plan.priceYear : plan.price}
                </span>
                <span className="text-slate-500 font-medium">
                  /{isYearly ? 'năm' : 'tháng'}
                </span>
              </div>
            </div>

            {/* Thông số cốt lõi */}
            {(plan.cpu || plan.ram || plan.storage) && (
              <div className="grid grid-cols-3 gap-2 mb-8 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {plan.cpu && <div><p className="text-slate-900 font-bold">{plan.cpu}</p></div>}
                {plan.ram && <div className="border-x border-slate-200"><p className="text-slate-900 font-bold">{plan.ram}</p></div>}
                {plan.storage && <div><p className="text-slate-900 font-bold">{plan.storage}</p></div>}
              </div>
            )}

            {/* Danh sách tính năng */}
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-600 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              href={`/thanh-toan?plan=${plan.id}&cycle=${isYearly ? '12' : '1'}${currentCategoryData?.promotionCode ? `&promo=${currentCategoryData.promotionCode}` : ''}`} 
              className={`mt-auto w-full block text-center py-4 rounded-2xl font-bold transition-all duration-300 ${
                plan.isPopular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'
              }`}
            >
              Triển khai ngay
            </Link>
            
            <div className="mt-6 border-t border-slate-100 pt-6">
              <PlanQrCode planId={plan.id} />
            </div>
          </div>
        ))}
      </div>
    
    </main>
  );
}

function PlanQrCode({ planId }: { planId: string }) {
  const [qrBase64, setQrBase64] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5023/api'}/service-plans/${planId}/qr`)
      .then(res => res.json())
      .then(data => {
        if (data && data.qrImage) {
          setQrBase64(data.qrImage);
        }
      })
      .catch(err => console.error(err));
  }, [planId]);

  if (!qrBase64) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Quét để đăng ký bằng ĐTDĐ</p>
      <img src={qrBase64} alt="QR Code" className="w-24 h-24 border border-slate-200 p-1 rounded-lg" />
    </div>
  );
}