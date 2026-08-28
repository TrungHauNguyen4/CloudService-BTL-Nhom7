'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  
  // New ticket state
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('Hỗ trợ kỹ thuật');
  const [message, setMessage] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchServices();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/customer/profile/support-tickets');
      setTickets(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách ticket", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await apiClient.get('/customer/services');
      setServices(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    
    try {
      await apiClient.post('/support-tickets', {
        customerName: '', // Backend auto fills based on token
        email: '',
        subject: subject,
        message: message,
        customerServiceId: serviceId || null
      });
      alert('Đã gửi yêu cầu hỗ trợ thành công!');
      setIsCreating(false);
      setMessage('');
      fetchTickets();
    } catch (err) {
      alert('Gửi yêu cầu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải danh sách hỗ trợ...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Ticket Hỗ Trợ Kỹ Thuật</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors"
        >
          + Tạo Yêu Cầu Mới
        </button>
      </div>

      {isCreating && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Tạo yêu cầu mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Chủ đề</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                >
                  <option>Hỗ trợ kỹ thuật</option>
                  <option>Vấn đề thanh toán / Hóa đơn</option>
                  <option>Tư vấn nâng cấp</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Liên quan đến dịch vụ (Tùy chọn)</label>
                <select 
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                >
                  <option value="">-- Không chọn --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name || 'Dịch vụ'} - {s.ipAddress}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung chi tiết</label>
              <textarea 
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              />
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                Hủy
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
              </button>
            </div>
          </form>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
          <p className="text-slate-500 mb-4">Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                  <div className="text-sm text-slate-500 flex gap-4 mt-1">
                    <span>Mã: <strong className="text-blue-600">{ticket.ticketCode}</strong></span>
                    <span>Ngày: {new Date(ticket.createdAt).toLocaleString('vi-VN')}</span>
                    {ticket.customerServiceName && <span>Dịch vụ: <strong className="text-slate-700">{ticket.customerServiceName}</strong></span>}
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  ticket.status === 1 ? 'bg-amber-100 text-amber-700' :
                  ticket.status === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {ticket.status === 1 ? 'Đang xử lý' : ticket.status === 2 ? 'Đã trả lời' : 'Đã đóng'}
                </span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm mb-4 whitespace-pre-wrap border border-slate-100">
                {ticket.message}
              </div>

              {ticket.adminReply && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-2">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">CSKH CloudService phản hồi:</div>
                  <div className="text-slate-800 text-sm whitespace-pre-wrap font-medium">{ticket.adminReply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
