'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { decodeJWT } from '@/lib/jwt';
import apiClient from '@/lib/axios';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { user, login: contextLogin, logout: contextLogout } = useAuth();
  // Tự động chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        router.push(redirectUrl || '/admin/dashboard');
      } else {
        router.push(redirectUrl || '/dashboard');
      }
    }
  }, [user, router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        contextLogin(response.data.token);
        
        try {
          const payload = decodeJWT(response.data.token);
          const role = payload["role"] || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          
          if (role === 'Admin') {
            router.push(redirectUrl || '/admin/dashboard');
          } else {
            router.push(redirectUrl || '/dashboard');
          }
        } catch {
          router.push(redirectUrl || '/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    setError('');
    
    try {
      await apiClient.post('/auth/forgot-password', { email: resetEmail });
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* LEFT SECTION - BRANDING (Chỉ hiện trên màn hình lớn) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-slate-300">Hệ sinh thái Cloud 2026</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
            Chào mừng trở lại <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Control Panel
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Quản lý toàn bộ cơ sở hạ tầng, máy chủ ảo và bảo mật của bạn tại một trung tâm dữ liệu duy nhất.
          </p>

          {/* Testimonial mini */}
          <div className="mt-12 p-6 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-sm">
            <div className="flex gap-1 mb-4 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <p className="text-slate-300 text-sm font-medium italic">"Giao diện Dashboard nhanh và trực quan nhất mà tôi từng sử dụng."</p>
            <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">— CTO, TechCorp</p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="max-w-md w-full">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-3">{isForgotPassword ? 'Khôi phục Mật khẩu' : 'Đăng Nhập'}</h2>
            <p className="text-slate-500 font-medium text-sm">
              {isForgotPassword ? 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu.' : 'Điền thông tin để truy cập vào không gian làm việc của bạn.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {isForgotPassword ? (
            resetSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Đã gửi liên kết!</h3>
                  <p className="text-slate-500 text-sm">Vui lòng kiểm tra hộp thư đến của <strong>{resetEmail}</strong> để đặt lại mật khẩu.</p>
                </div>
                <button 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail('');
                  }}
                  className="text-blue-600 font-bold hover:underline text-sm"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Tài khoản Email</label>
                  <input 
                    type="email" 
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                    placeholder="name@company.com" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Đang Xử Lý...' : 'Gửi Yêu Cầu'}
                </button>
                <div className="text-center mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Quay lại Đăng nhập
                  </button>
                </div>
              </form>
            )
          ) : (
            <>

          {/* Traditional Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tài khoản Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="name@company.com" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                <button type="button" onClick={() => {setIsForgotPassword(true); setError('');}} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Quên mật khẩu?</button>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="text-blue-600 font-bold hover:underline">
              Tạo tài khoản mới
            </Link>
          </p>
          </>
          )}

        </div>
      </div>



    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <LoginContent />
    </Suspense>
  );
}