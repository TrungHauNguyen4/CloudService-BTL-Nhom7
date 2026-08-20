import Link from 'next/link';

export default function LoginPage() {
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
            <h2 className="text-3xl font-black text-slate-900 mb-3">Đăng Nhập</h2>
            <p className="text-slate-500 font-medium text-sm">Điền thông tin để truy cập vào không gian làm việc của bạn.</p>
          </div>

          {/* Nút Đăng nhập qua MXH */}
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
            <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">hoặc</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Traditional Form */}
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Tài khoản Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="name@company.com" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Quên mật khẩu?</a>
              </div>
              <input 
                type="password" 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm text-slate-800" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="button" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              Đăng Nhập
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="text-blue-600 font-bold hover:underline">
              Tạo tài khoản mới
            </Link>
          </p>

        </div>
      </div>

    </main>
  );
}