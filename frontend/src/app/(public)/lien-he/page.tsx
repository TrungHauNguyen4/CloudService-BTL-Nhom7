'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/axios';

function ContactForm() {
  const searchParams = useSearchParams();
  const planQuery = searchParams.get('plan');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tư vấn dịch vụ Cloud Server');
  const [content, setContent] = useState(planQuery ? `Tôi muốn nhận tư vấn về gói dịch vụ: ${planQuery}` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Track Ticket
  const [ticketCode, setTicketCode] = useState('');
  const [trackCodeInput, setTrackCodeInput] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleOpenTicket = () => {
    setSubject('Hỗ trợ kỹ thuật');
    const formEl = document.getElementById('contact-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await apiClient.post('/support-tickets', {
        customerName: name,
        email: email,
        subject: subject,
        message: content,
        customerServiceId: null
      });
      setSuccess(true);
      setTicketCode(res.data.ticketCode);
      setName('');
      setEmail('');
      setContent('');
    } catch (err) {
      setError('Gửi tin nhắn thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quản lý thông tin liên hệ bằng mảng giúp code gọn và dễ bảo trì
  const contactDetails = [
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: 'Địa chỉ văn phòng',
      desc: 'Sinh Viên Khoa Công Nghệ và Kỹ Thuật, Đồng Tháp',
      color: 'blue'
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      title: 'Hotline hỗ trợ',
      desc: '1900 1234',
      color: 'emerald'
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      title: 'Email liên hệ',
      desc: 'support@cloudservice.vn',
      color: 'indigo'
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: 'Giờ làm việc',
      desc: 'Thứ 2 - Thứ 6 (8:00 - 17:30)',
      color: 'amber'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* HEADER TITTLE */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Sẵn Sàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Hỗ Trợ Bạn</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed font-light">
          Đội ngũ chuyên gia Cloud của chúng tôi luôn túc trực 24/7. Hãy để lại lời nhắn hoặc liên hệ trực tiếp nếu bạn cần tư vấn giải pháp.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* CỘT 1: THÔNG TIN LIÊN HỆ */}
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Thông Tin Chi Tiết</h2>
          
          <div className="space-y-8">
            {contactDetails.map((item, idx) => (
              <div key={idx} className="flex items-start gap-5 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-${item.color}-50 text-${item.color}-600`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-slate-600 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner nhỏ mô phỏng support */}
          <div className="mt-12 bg-blue-600 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-blue-600/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Cần hỗ trợ khẩn cấp?</h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10">Khách hàng gói Enterprise vui lòng sử dụng kênh ưu tiên.</p>
            <button 
              onClick={handleOpenTicket}
              className="relative z-10 bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              Mở Ticket Hỗ Trợ
            </button>
          </div>
        </div>

        {/* CỘT 2: FORM GỬI TIN NHẮN */}
        <div id="contact-form" className="order-1 lg:order-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Gửi Tin Nhắn</h2>
          
          {success && (
            <div className="mb-6 p-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="font-bold text-lg">Tin nhắn của bạn đã được gửi!</span>
              </div>
              <p className="mb-2">Chúng tôi sẽ phản hồi lại sớm nhất.</p>
              <div className="bg-white px-4 py-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span>Mã tra cứu của bạn: <strong>{ticketCode}</strong></span>
                <button onClick={() => { navigator.clipboard.writeText(ticketCode); alert('Đã copy mã!'); }} className="text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1 rounded-lg font-bold">Copy</button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Họ và tên <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700" 
                  placeholder="Nhập tên của bạn" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Email <span className="text-rose-500">*</span></label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Chủ đề</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 appearance-none cursor-pointer"
              >
                <option>Tư vấn dịch vụ Cloud Server</option>
                <option>Hỗ trợ kỹ thuật</option>
                <option>Vấn đề thanh toán / Hóa đơn</option>
                <option>Khác</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Nội dung <span className="text-rose-500">*</span></label>
              <textarea 
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 resize-none" 
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/30 transform hover:-translate-y-1"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn Ngay'}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Bằng việc gửi tin nhắn, bạn đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span> của chúng tôi.
            </p>
          </form>
        </div>

      </div>
      
      {/* CỘT 3: TRA CỨU MÃ HỖ TRỢ */}
      <div className="max-w-6xl mx-auto mt-12 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Tra Cứu Mã Hỗ Trợ</h2>
        <p className="text-slate-500 mb-6">Nhập mã hỗ trợ (Ticket Code) mà bạn nhận được sau khi gửi yêu cầu để xem phản hồi từ quản trị viên.</p>
        
        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            value={trackCodeInput} 
            onChange={(e) => setTrackCodeInput(e.target.value)} 
            placeholder="Ví dụ: TK-2608-A1B2C3" 
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 font-bold" 
          />
          <button 
            onClick={async () => {
              if (!trackCodeInput.trim()) return;
              setIsTracking(true);
              setTrackError('');
              setTrackResult(null);
              try {
                const res = await apiClient.get('/support-tickets/track/' + trackCodeInput.trim());
                setTrackResult(res.data);
              } catch (err: any) {
                setTrackError('Không tìm thấy mã yêu cầu này.');
              } finally {
                setIsTracking(false);
              }
            }}
            disabled={isTracking}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-2xl transition-all disabled:opacity-50"
          >
            {isTracking ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </div>

        {trackError && <div className="text-rose-600 font-medium">{trackError}</div>}
        
        {trackResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{trackResult.subject}</h3>
                <p className="text-sm text-slate-500">Ngày gửi: {new Date(trackResult.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                trackResult.status === 1 ? 'bg-blue-100 text-blue-700' : 
                trackResult.status === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {trackResult.status === 1 ? 'Đang xử lý' : trackResult.status === 2 ? 'Đã trả lời' : 'Đã đóng'}
              </span>
            </div>
            
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tin nhắn của bạn:</span>
              <p className="text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-slate-100">{trackResult.message}</p>
            </div>

            {trackResult.adminReply && (
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 block">Admin phản hồi:</span>
                <p className="text-slate-800 font-medium whitespace-pre-wrap bg-emerald-50 p-4 rounded-xl border border-emerald-100">{trackResult.adminReply}</p>
              </div>
            )}
            {!trackResult.adminReply && trackResult.status === 1 && (
              <p className="text-slate-500 italic text-sm">Quản trị viên chưa phản hồi. Vui lòng quay lại sau nhé!</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div></div>}>
      <ContactForm />
    </Suspense>
  );
}