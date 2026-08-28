'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await apiClient.post('/auth/register', formData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/dang-nhap');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* LEFT SECTION - BRANDING (Chỉ hiện trên màn hình lớn) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-600 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-white">

          
          <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
            Khởi tạo hạ tầng <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
              Chỉ trong 60 giây
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Gia nhập cùng hơn 5,000 doanh nghiệp đang sử dụng hệ sinh thái Cloud của chúng tôi để tối ưu hóa hiệu suất và chi phí.
          </p>

          <ul className="space-y-4">
            {['Cam kết Uptime 99.99% SLA', 'Bảo mật Anti-DDoS tự động Layer 7', 'Hỗ trợ kỹ thuật chuyên sâu 24/7'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-slate-300 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SECTION - REGISTER FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto">
        <div className="max-w-md w-full py-8">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Tạo Tài Khoản</h2>
            <p className="text-slate-500 font-medium text-sm">Bắt đầu hành trình chuyển đổi số của bạn ngay hôm nay.</p>
          </div>



          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Traditional Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Họ và tên</label>
              <input 
                type="text" 
                required
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="Nguyễn Văn A" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Địa chỉ Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="name@company.com" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Số điện thoại</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="0912345678" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Mật khẩu</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
              />
            </div>

            {/* Checkbox điều khoản */}
            <div className="flex items-start gap-3 mt-4">
              <div className="flex items-center h-5">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-blue-300 cursor-pointer" 
                />
              </div>
              <label className="text-sm text-slate-500">
                Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline font-semibold">Điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:underline font-semibold">Chính sách bảo mật</a>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            Đã có tài khoản?{' '}
            <Link href="/dang-nhap" className="text-blue-600 font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>

        </div>
      </div>

    </main>
  );
}