export default function SettingsPage() {
  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Cài đặt hệ thống</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all">
          Lưu thay đổi
        </button>
      </header>

      <main className="p-8 overflow-y-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Điều hướng nội bộ (Tùy chọn) */}
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100 transition-colors">
              <span>Thông tin tài khoản</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              <span>Bảo mật & 2FA</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              <span>Quản lý API Keys</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              <span>Thông báo (Notifications)</span>
            </button>
          </div>

          {/* Cột phải: Nội dung form cài đặt */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Block 1: Thông tin cá nhân */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Hồ sơ cá nhân</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-2xl border-2 border-white shadow-md">
                  A
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors mb-2">
                    Tải ảnh lên
                  </button>
                  <p className="text-xs text-slate-500">Định dạng JPG, PNG. Tối đa 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Họ và Tên</label>
                  <input type="text" defaultValue="Khách hàng A" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ Email</label>
                  <input type="email" defaultValue="khachhang.a@congty.com" disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-2">Liên hệ Hỗ trợ nếu bạn muốn đổi Email.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tên Doanh nghiệp / Tổ chức</label>
                  <input type="text" defaultValue="Công ty TNHH Công Nghệ A" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" />
                </div>
              </div>
            </section>

            {/* Block 2: Bảo mật */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Bảo mật tài khoản</h2>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl mb-4">
                <div>
                  <h4 className="font-bold text-slate-800">Xác thực 2 yếu tố (2FA)</h4>
                  <p className="text-sm text-slate-500 mt-1">Bảo vệ tài khoản bằng mã OTP từ Google Authenticator.</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                  Kích hoạt
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-800">Mật khẩu</h4>
                  <p className="text-sm text-slate-500 mt-1">Lần thay đổi cuối: 45 ngày trước</p>
                </div>
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors">
                  Đổi mật khẩu
                </button>
              </div>
            </section>

            {/* Block 3: API Keys (Giao diện cho dân IT) */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">API Keys</h2>
                <button className="text-sm font-bold text-blue-600 hover:underline">+ Tạo Key mới</button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Sử dụng API Key để tự động hóa việc quản lý tài nguyên thông qua CloudService API.</p>
              
              <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between font-mono text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400">Prod_Key:</span>
                  <span>cs_live_8f92j...<span className="blur-sm">k3l2m1n0</span></span>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors" title="Sao chép">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}