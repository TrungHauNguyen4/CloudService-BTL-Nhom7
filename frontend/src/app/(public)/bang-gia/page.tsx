'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  // Đưa dữ liệu vào mảng để dễ dàng thêm gói, đổi giá hoặc làm tính năng "Thanh toán hàng năm" sau này
      const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  const handleShowQr = async (planId: string) => {
    setShowQrModal(true);
    setLoadingQr(true);
    setQrData(null);
    try {
      const res = await fetch("http://localhost:5000/api/service-plans/" + planId + "/qr");
      if (res.ok) {
        const data = await res.json();
        setQrData(data);
      } else {
        alert("Không thể tải mã QR lúc này.");
        setShowQrModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối.");
      setShowQrModal(false);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/service-plans")
      .then(res => res.json())
      .then(data => {
        // Map data from API to frontend structure
        const mapped = data.map((plan: any, index: number) => {
          // Parse specs assuming format "X vCPU / Y RAM / Z SSD"
          const specsParts = plan.specs ? plan.specs.split(' / ') : [];
          const cpu = specsParts[0] || '1 vCPU';
          const ram = specsParts[1] || '2GB RAM';
          const storage = specsParts[2] || '40GB SSD';
          
          // Generate dummy price based on index
          const basePrice = (index + 1) * 150000;
          
          return {
            id: plan.id,
            name: plan.name,
            desc: plan.description || 'Giải pháp Cloud tối ưu cho mọi nhu cầu.',
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice),
            priceYear: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice * 10),
            priceRaw: basePrice,
            cpu,
            ram,
            storage,
            features: ['Băng thông Không giới hạn', 'Hỗ trợ kỹ thuật 24/7', 'Tự động Backup'],
            isPopular: index === 1
          };
        });
        setPricingPlans(mapped);
      })
      .catch(err => console.error("Error fetching plans:", err))
      .finally(() => setLoading(false));
  }, []);

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
            className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isYearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
          <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
            Thanh toán theo Năm
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">-17%</span>
          </span>
        </div>
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

            <div className="mb-8 flex items-baseline gap-2 border-b border-slate-100 pb-8">
              <span className="text-5xl font-black text-slate-900">
                {isYearly ? plan.priceYear : plan.price}
              </span>
              <span className="text-slate-500 font-medium">
                /{isYearly ? 'năm' : 'tháng'}
              </span>
            </div>

            {/* Thông số cốt lõi */}
            <div className="grid grid-cols-3 gap-2 mb-8 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-slate-900 font-bold">{plan.cpu}</p>
              </div>
              <div className="border-x border-slate-200">
                <p className="text-slate-900 font-bold">{plan.ram}</p>
              </div>
              <div>
                <p className="text-slate-900 font-bold">{plan.storage}</p>
              </div>
            </div>

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

            {/* Nút Call to Action */}
            <Link 
              href={`/thanh-toan?plan=${plan.id}`} 
              className={`mt-auto w-full block text-center py-4 rounded-2xl font-bold transition-all duration-300 ${
                plan.isPopular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900'
              }`}
            >
              Triển khai ngay
            </Link>
          </div>
        ))}
      </div>
    
      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Thanh toán Momo / VNPay</h3>
            <p className="text-slate-500 text-sm text-center mb-6">Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới.</p>
            
            <div className="flex justify-center items-center min-h-[250px] bg-slate-50 rounded-2xl border border-slate-100 p-4">
              {loadingQr ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <span className="text-sm font-medium text-slate-500">Đang sinh mã QR...</span>
                </div>
              ) : qrData ? (
                <div className="text-center">
                  <img src={qrData.qrImage} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-sm mb-4" />
                  <p className="font-bold text-blue-600">{qrData.planName}</p>
                  <p className="text-lg font-black text-slate-900 mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(qrData.price)}
                  </p>
                </div>
              ) : (
                <div className="text-red-500 text-sm font-medium">Không thể hiển thị mã QR</div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}