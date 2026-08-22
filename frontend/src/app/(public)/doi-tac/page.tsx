"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, TrendingUp, Users, DollarSign, ArrowRight, Loader2, Link } from "lucide-react";
import apiClient from "@/lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AffiliateLandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    website: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
        const email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '';
        const id = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
        
        setUserId(id);
        setFormData(prev => ({
          ...prev,
          fullName: name,
          email: email
        }));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để đăng ký chương trình Đối Tác!");
      router.push('/dang-nhap?redirect=/doi-tac');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/affiliate-applications', {
        ...formData,
        appUserId: userId
      });
      setSuccess(true);
    } catch (error) {
      console.error("Lỗi đăng ký affiliate:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-blue-600/10 blur-[100px]"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-4 py-1.5 mb-8 border border-white/10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300">Chương trình Đối Tác CloudPortal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Giới thiệu dịch vụ <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Nhận hoa hồng trọn đời</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Kiếm thêm thu nhập thụ động bằng cách giới thiệu khách hàng sử dụng dịch vụ Cloud, VPS, Hosting của chúng tôi. Hoa hồng lên đến 10% cho mỗi giao dịch thành công.
          </p>
          
          <button onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center space-x-2 bg-white text-slate-950 font-bold px-8 py-4 rounded-xl hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <span>Tham gia ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Tại sao nên chọn chúng tôi?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Chính sách minh bạch, thanh toán đúng hạn và hỗ trợ đối tác 24/7.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Hoa hồng 10% trọn đời</h3>
            <p className="text-slate-600 leading-relaxed">Bạn sẽ nhận được 10% giá trị đơn hàng không chỉ ở lần mua đầu tiên mà còn ở mọi lần gia hạn tiếp theo của khách hàng.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tỷ lệ chuyển đổi cao</h3>
            <p className="text-slate-600 leading-relaxed">Dịch vụ chất lượng, hạ tầng mạnh mẽ và giá cả cạnh tranh giúp bạn dễ dàng thuyết phục khách hàng hơn bao giờ hết.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-500/30 transition-all group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Thống kê minh bạch</h3>
            <p className="text-slate-600 leading-relaxed">Hệ thống theo dõi chi tiết từng lượt click, số đơn hàng và hoa hồng theo thời gian thực ngay trong bảng điều khiển của bạn.</p>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register-form" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            <div className="md:w-2/5 p-10 bg-gradient-to-br from-blue-900 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Tham gia ngay!</h3>
                <p className="text-blue-100/70 mb-8">Trở thành đối tác và bắt đầu tạo ra nguồn thu nhập thụ động không giới hạn.</p>
                
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">Đăng ký hoàn toàn miễn phí</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">Xét duyệt nhanh chóng</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">Hỗ trợ đối tác 1-1</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:w-3/5 p-10 bg-white">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Gửi Yêu Cầu Thành Công!</h3>
                  <p className="text-slate-600">
                    Cảm ơn bạn đã đăng ký tham gia mạng lưới Affiliate. Chúng tôi sẽ xem xét và phản hồi qua email trong vòng 24h.
                  </p>
                  <button onClick={() => router.push('/dashboard/affiliate')} className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    Đến Bảng Điều Khiển
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Đăng Ký Tài Khoản Affiliate</h3>
                  
                  {!isLoggedIn && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm mb-6 flex items-start space-x-3">
                      <span className="block shrink-0 mt-0.5">⚠️</span>
                      <p>Bạn chưa đăng nhập. Vui lòng <a href="/dang-nhap?redirect=/doi-tac" className="font-bold underline text-amber-900">đăng nhập</a> trước khi gửi yêu cầu để hệ thống liên kết tài khoản.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và Tên</label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email liên hệ</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="0912345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nguồn Traffic / Website của bạn</label>
                    <input 
                      type="text" 
                      value={formData.website}
                      onChange={e => setFormData(prev => ({...prev, website: e.target.value}))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="VD: youtube.com/c/kenhcuaban hoặc facebook..."
                    />
                    <p className="text-xs text-slate-500 mt-1.5">Giúp chúng tôi hiểu rõ hơn về cách bạn sẽ quảng bá dịch vụ.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !isLoggedIn}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-colors mt-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Gửi Yêu Cầu</span>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}