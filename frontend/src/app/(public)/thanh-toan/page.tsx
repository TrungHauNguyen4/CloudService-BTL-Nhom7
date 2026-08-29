'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { decodeJWT } from '@/lib/jwt';
import apiClient from '@/lib/axios';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const [plan, setPlan] = useState<any>(null);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [success, setSuccess] = useState(false);

  const cycleParam = searchParams.get('cycle');
  
  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<number>(cycleParam === '2' ? 2 : 1); // 1 = Monthly, 2 = Yearly

  // Discount states
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [discountError, setDiscountError] = useState('');

  useEffect(() => {
    // Check Authentication
    const token = Cookies.get('token');
    if (!token) {
      router.replace(`/dang-nhap?redirect=/thanh-toan?plan=${planId}`);
      return;
    }

    if (!planId) {
      router.replace('/bang-gia');
      return;
    }

    // Fetch plan details and public settings
    Promise.all([
      apiClient.get(`/service-plans/${planId}`),
      apiClient.get(`/public/settings`).catch(() => ({ data: {} }))
    ])
      .then(([resPlan, resSettings]) => {
        setPlan(resPlan.data);
        setSettings(resSettings.data.settings || {});
        
        // Auto-apply promo if passed in URL
        const promo = searchParams.get('promo');
        if (promo && !discountCode) {
          setDiscountCode(promo);
          // Auto trigger apply
          setTimeout(() => {
            const btn = document.getElementById('btn-apply-discount');
            if (btn) btn.click();
          }, 500);
        }
      })
      .catch(err => {
        console.error(err);
        router.replace('/bang-gia');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [planId, router, searchParams]);

  // Effect to re-evaluate discount when billing cycle changes
  useEffect(() => {
    if (appliedDiscount && billingCycle !== 1) {
      // Remove any discount code if switching to yearly
      setAppliedDiscount(null);
      setDiscountError('Mã khuyến mãi/giới thiệu chỉ áp dụng cho gói thanh toán 1 tháng.');
      if (qrData) setQrData(null); // Force re-generate QR
    } else {
      setDiscountError('');
      if (qrData && appliedDiscount) setQrData(null); // Re-gen to apply/unapply safely
    }
  }, [billingCycle]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    setDiscountError('');
    setAppliedDiscount(null);
    try {
      const res = await apiClient.get(`/checkout/validate-code?code=${discountCode}&planId=${plan?.id}`);
      const discount = res.data;
      
      if (billingCycle !== 1) {
        setDiscountError('Mã khuyến mãi/giới thiệu chỉ áp dụng cho gói thanh toán 1 tháng.');
        return;
      }
      
      setAppliedDiscount(discount);
      if (qrData) setQrData(null);
    } catch (err: any) {
      setDiscountError(err.response?.data?.message || 'Mã không hợp lệ hoặc đã hết hạn.');
    } finally {
      setValidatingCode(false);
    }
  };

  const getOriginalPrice = () => {
    const priceMonthOriginal = plan?.monthlyPrice || 150000;
    return billingCycle === 1 ? priceMonthOriginal : priceMonthOriginal * 12;
  };

  const getBasePrice = () => {
    const originalPrice = getOriginalPrice();
    if (billingCycle === 1) {
      const monthlyDiscountRate = parseInt(settings['MonthlyDiscountRate'] || '0');
      return originalPrice * (1 - monthlyDiscountRate / 100);
    } else {
      const yearlyDiscountRate = parseInt(settings['YearlyDiscountRate'] || '16');
      return originalPrice * (1 - yearlyDiscountRate / 100);
    }
  };

  const handleGenerateQr = async () => {
    setLoadingQr(true);
    setQrData(null);
    try {
      // Giả lập lấy mã QR từ backend
      const basePrice = getBasePrice();
      let finalPrice = basePrice;
      if (appliedDiscount) {
        finalPrice = basePrice * (1 - appliedDiscount.discountPercentage / 100);
      }
      
      // Simulate API call for QR (in reality, backend should compute this to prevent tampering)
      setQrData({
        qrImage: 'https://api.vietqr.io/image/970415-0909090909-y7T5d2F.jpg?amount=' + finalPrice + '&addInfo=ThanhToan' + planId,
        price: finalPrice
      });
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối.");
    } finally {
      setLoadingQr(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const token = Cookies.get('token');
      let customerId = null;
      let customerName = 'Khách Hàng';
      let email = 'khachhang@cloudservice.vn';
      let phone = 'Chưa cung cấp';
      
      if (token) {
        const payload = decodeJWT(token);
        email = payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email;
        customerName = payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || customerName;
        customerId = payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        phone = payload.mobilephone || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"] || 'Chưa cung cấp';
      }

      await apiClient.post('/order-requests', {
        planId: planId,
        serviceName: plan?.name,
        billingCycle: billingCycle,
        customerName: customerName,
        email: email,
        phone: phone,
        customerId: customerId,
        discountCode: appliedDiscount?.code || null
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xác nhận đơn hàng.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-xl max-w-2xl mx-auto text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Thanh Toán Thành Công!</h2>
        <p className="text-slate-600 mb-8">
          Cảm ơn bạn! Đơn hàng đăng ký gói <strong>{plan?.name}</strong> đã được thanh toán và kích hoạt thành công. Bạn đã có thể bắt đầu sử dụng dịch vụ ngay bây giờ.
        </p>
        <button onClick={() => router.push('/dashboard/may-chu-ao')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-blue-500/30">
          Tới trang Quản lý Máy Chủ Ảo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Xác Nhận & Thanh Toán</h2>
          <p className="text-slate-400 text-sm">Vui lòng kiểm tra lại thông tin gói dịch vụ trước khi thanh toán.</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cột 1: Thông tin đơn hàng */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Chi Tiết Đơn Hàng</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Gói Dịch Vụ:</span>
                <span className="font-bold text-slate-900">{plan?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Chu Kỳ:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setBillingCycle(1)}
                    className={`px-3 py-1 text-sm font-bold rounded-lg border transition-all ${billingCycle === 1 ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                  >
                    1 Tháng
                  </button>
                  <button 
                    onClick={() => setBillingCycle(2)}
                    className={`px-3 py-1 text-sm font-bold rounded-lg border transition-all ${billingCycle === 2 ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                  >
                    1 Năm
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Giá Gốc:</span>
                <span className={`font-bold ${(getOriginalPrice() > getBasePrice()) || appliedDiscount ? 'text-slate-400 line-through' : 'text-blue-600'}`}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getOriginalPrice())}
                </span>
              </div>
              
              {getOriginalPrice() > getBasePrice() && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Khuyến Mãi Hệ Thống ({parseInt(settings[billingCycle === 1 ? 'MonthlyDiscountRate' : 'YearlyDiscountRate'] || '0')}%):</span>
                  <span className="font-bold text-emerald-600">
                    -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getOriginalPrice() - getBasePrice())}
                  </span>
                </div>
              )}
              
              {appliedDiscount && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mã Khuyến Mãi ({appliedDiscount.discountPercentage}%):</span>
                    <span className="font-bold text-emerald-600">
                      -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getBasePrice() * (appliedDiscount.discountPercentage / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                    <span className="text-slate-900 font-bold">Thành Tiền:</span>
                    <span className="text-xl font-black text-blue-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getBasePrice() * (1 - appliedDiscount.discountPercentage / 100))}
                    </span>
                  </div>
                </>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Thông Số</h3>
            <ul className="space-y-2 text-sm text-slate-600 mb-8">
              {plan?.specs?.split('\n').map((spec: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {spec}
                </li>
              ))}
            </ul>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Mã Khuyến Mãi / Giới Thiệu</h4>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="Nhập mã tại đây..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  disabled={validatingCode || appliedDiscount}
                />
                {!appliedDiscount ? (
                  <button 
                    id="btn-apply-discount"
                    onClick={handleApplyDiscount}
                    disabled={validatingCode || !discountCode.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {validatingCode ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setAppliedDiscount(null);
                      setDiscountCode('');
                      if (qrData) handleGenerateQr(); // re-gen without discount
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    Hủy
                  </button>
                )}
              </div>
              {discountError && <p className="text-red-500 text-sm mt-1">{discountError}</p>}
              {appliedDiscount && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-emerald-700 text-sm font-medium">{appliedDiscount.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cột 2: QR Thanh toán */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-slate-900 mb-2">Thanh Toán Quét Mã QR</h3>
            <p className="text-xs text-slate-500 mb-6">Sử dụng ứng dụng Momo hoặc VNPay để quét mã.</p>

            {loadingQr ? (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <span className="text-sm font-medium text-slate-500">Đang sinh mã QR...</span>
              </div>
            ) : qrData ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <img src={qrData.qrImage} alt="QR Code" className="w-48 h-48 mx-auto rounded-xl shadow-sm border border-slate-200 mb-4 p-2 bg-white" />
                
                {appliedDiscount ? (
                  <div className="mb-6">
                    <p className="text-slate-400 line-through text-sm mb-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getBasePrice())}
                    </p>
                    <p className="text-2xl font-black text-emerald-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(qrData.price)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-black text-slate-900 mb-6">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(qrData.price)}
                  </p>
                )}
                
                <button onClick={handleConfirmPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-600/30">
                  Tôi Đã Thanh Toán
                </button>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center w-full">
                <button onClick={handleGenerateQr} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
                  Lấy Mã Thanh Toán
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8 font-sans">
      <Suspense fallback={<div className="flex justify-center pt-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
