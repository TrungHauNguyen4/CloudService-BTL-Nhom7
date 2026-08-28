'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface ApiKey {
  id: string;
  name: string;
  keyString: string;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', companyName: '', is2faEnabled: false });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/customer/profile');
      setProfile({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phone || '',
        companyName: res.data.companyName || '',
        is2faEnabled: res.data.is2faEnabled
      });
      setApiKeys(res.data.apiKeys || []);
    } catch (error) {
      console.error("Lỗi khi tải thông tin tài khoản", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await apiClient.put('/customer/profile', {
        fullName: profile.fullName,
        phone: profile.phone,
        companyName: profile.companyName
      });
      setMessage('Lưu thay đổi thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggle2FA = async () => {
    try {
      const res = await apiClient.post('/customer/profile/2fa/toggle');
      setProfile({ ...profile, is2faEnabled: res.data.is2faEnabled });
    } catch (error) {
      alert('Lỗi đổi trạng thái 2FA');
    }
  };

  const generateApiKey = async () => {
    try {
      await apiClient.post('/customer/profile/api-keys', { name: 'Key_Moi_' + Date.now().toString().slice(-4) });
      fetchProfile();
    } catch (error) {
      alert('Lỗi tạo API Key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào bộ nhớ tạm');
  };

  if (isLoading) return <div className="p-8 text-slate-500">Đang tải cấu hình...</div>;

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Cài đặt hệ thống</h1>
        <div className="flex items-center gap-4">
          {message && <span className="text-emerald-600 font-bold text-sm">{message}</span>}
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </header>

      <main className="p-8 overflow-y-auto max-w-5xl">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Block 1: Thông tin cá nhân */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Hồ sơ cá nhân</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Họ và Tên</label>
                  <input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa chỉ Email</label>
                  <input type="email" value={profile.email} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 outline-none cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-2">Liên hệ Hỗ trợ nếu bạn muốn đổi Email.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số điện thoại</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Nhập số điện thoại" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tên Doanh nghiệp / Tổ chức</label>
                  <input type="text" value={profile.companyName} onChange={(e) => setProfile({...profile, companyName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Nhập tên doanh nghiệp" />
                </div>
              </div>
            </section>

            {/* Block 2: Bảo mật */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Bảo mật tài khoản</h2>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl mb-4">
                <div>
                  <h4 className="font-bold text-slate-800">Xác thực 2 yếu tố (2FA)</h4>
                  <p className="text-sm text-slate-500 mt-1">Bảo vệ tài khoản bằng mã OTP.</p>
                </div>
                <button 
                  onClick={toggle2FA}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${profile.is2faEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white'}`}
                >
                  {profile.is2faEnabled ? 'Đang bật' : 'Kích hoạt'}
                </button>
              </div>
            </section>

            {/* Block 3: API Keys */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">API Keys</h2>
                <button onClick={generateApiKey} className="text-sm font-bold text-blue-600 hover:underline">+ Tạo Key mới</button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Sử dụng API Key để tự động hóa việc quản lý tài nguyên thông qua CloudService API.</p>
              
              {apiKeys.length === 0 ? (
                <p className="text-slate-500 text-sm">Bạn chưa tạo API Key nào.</p>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="bg-slate-900 rounded-xl p-4 flex items-center justify-between font-mono text-sm text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">{k.name}:</span>
                        <span>{k.keyString.substring(0, 10)}...<span className="blur-sm">xxxxxxxx</span></span>
                      </div>
                      <button onClick={() => copyToClipboard(k.keyString)} className="text-slate-400 hover:text-white transition-colors" title="Sao chép">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
        </div>
      </main>
    </>
  );
}