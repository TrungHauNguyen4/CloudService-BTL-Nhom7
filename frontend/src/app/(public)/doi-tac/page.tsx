'use client';

import { useState } from 'react';
import apiClient from '@/lib/axios';

export default function PartnersPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAffiliateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.post('/public/affiliates', {
        fullName, email, phone, website,
      });
      setSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setTimeout(() => setShowForm(false), 3000);
    } catch (err) {
      setError('Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const partners = [
    { name: "TechCorp Global", role: "Đối tác Hạ tầng Cloud", desc: "Cung cấp phần cứng và server tối tân.", bg: "from-blue-500 to-indigo-600" },
    { name: "SecurNet AI", role: "Đối tác Bảo mật", desc: "Hệ thống tường lửa và chống DDoS toàn diện.", bg: "from-purple-500 to-pink-600" },
    { name: "DataVortex", role: "Đối tác Lưu trữ", desc: "Giải pháp Big Data và Backup tự động.", bg: "from-cyan-500 to-blue-600" },
    { name: "Cloudify VN", role: "Đối tác Phân phối", desc: "Mạng lưới dịch vụ rộng khắp cả nước.", bg: "from-emerald-500 to-teal-600" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 py-16 px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Mạng lưới toàn cầu
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-6">
          Đối Tác <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Chiến Lược</span>
        </h1>
        <p className="text-lg text-gray-600">
          Chúng tôi hợp tác với các tập đoàn công nghệ hàng đầu thế giới để mang đến chất lượng dịch vụ ổn định và an toàn nhất cho khách hàng.
        </p>
      </div>

      {/* Grid Danh sách đối tác */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {partners.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col justify-between"
          >
            {/* Hiệu ứng màu nền chạy nhẹ khi hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  {item.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm mb-3">{item.role}</p>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Hợp tác từ 2024</span>
              <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Xem chi tiết &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Trở thành đối tác của CloudService?</h3>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Cùng chúng tôi mở rộng hệ sinh thái điện toán đám mây và mang lại giá trị vượt trội cho hàng ngàn doanh nghiệp.
          </p>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-0.5"
            >
              Đăng ký hợp tác ngay
            </button>
          )}
        </div>
      </div>

      {/* Form đăng ký đối tác (ẩn/hiện) */}
      {showForm && (
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Form Đăng Ký Đối Tác</h3>
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAffiliateSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên công ty / Cá nhân *</label>
              <input required value={fullName} onChange={e => setFullName(e.target.value)} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại *</label>
                <input required value={phone} onChange={e => setPhone(e.target.value)} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Website (Tùy chọn)</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-6">
              {isSubmitting ? 'Đang gửi...' : 'Gửi Đăng Ký'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}