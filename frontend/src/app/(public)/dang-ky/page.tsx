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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md mb-8">
            <span className="text-emerald-400">🎁</span>
            <span className="text-xs font-semibold tracking-wide text-emerald-300">Tặng ngay 1.000.000đ Credit</span>
          </div>
          
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

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-700 text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 border border-slate-900 rounded-2xl hover:bg-slate-800 transition-colors shadow-sm font-semibold text-white text-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">hoặc đăng ký bằng email</span>
            <div className="flex-grow border-t border-slate-200"></div>
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