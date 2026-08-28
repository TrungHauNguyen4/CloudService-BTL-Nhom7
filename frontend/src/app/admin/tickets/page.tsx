'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeTicket, setActiveTicket] = useState<any>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/admin/support-tickets');
      setTickets(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách ticket", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    try {
      await apiClient.post(`/admin/support-tickets/${activeTicket.id}/reply`, {
        replyMessage: replyText
      });
      alert('Đã gửi phản hồi!');
      setActiveTicket(null);
      setReplyText('');
      fetchTickets();
    } catch (err) {
      alert('Lỗi khi phản hồi');
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm('Đóng yêu cầu này?')) return;
    try {
      await apiClient.post(`/admin/support-tickets/${id}/close`);
      fetchTickets();
    } catch (err) {
      alert('Lỗi đóng ticket');
    }
  };

  if (loading) return <div className="p-8">Đang tải danh sách hỗ trợ...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Yêu Cầu Hỗ Trợ & Tư Vấn</h1>
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Mã / Khách</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Chủ Đề</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Trạng Thái</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-blue-600">{ticket.ticketCode}</div>
                  <div className="text-sm text-slate-500">{ticket.customerName} - {ticket.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{ticket.subject}</div>
                  <div className="text-sm text-slate-500 truncate max-w-xs">{ticket.message}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ticket.status === 1 ? 'bg-amber-100 text-amber-700' :
                    ticket.status === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ticket.status === 1 ? 'Chờ xử lý' : ticket.status === 2 ? 'Đã trả lời' : 'Đã đóng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setActiveTicket(ticket)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm mr-4"
                  >
                    Xem & Trả lời
                  </button>
                  {ticket.status !== 3 && (
                    <button 
                      onClick={() => handleClose(ticket.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-sm"
                    >
                      Đóng
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Trả lời: {activeTicket.ticketCode}</h3>
              <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase">Tin nhắn khách hàng</h4>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-800 whitespace-pre-wrap border border-slate-100">
                  {activeTicket.message}
                </div>
              </div>

              {activeTicket.adminReply && (
                <div>
                  <h4 className="text-sm font-bold text-emerald-600 mb-2 uppercase">Đã trả lời</h4>
                  <div className="bg-emerald-50 p-4 rounded-xl text-emerald-800 whitespace-pre-wrap border border-emerald-100">
                    {activeTicket.adminReply}
                  </div>
                </div>
              )}

              {activeTicket.status !== 3 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Soạn phản hồi mới</h4>
                  <textarea 
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                    placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => setActiveTicket(null)} className="px-5 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Hủy</button>
                    <button onClick={handleReply} className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow">Gửi Phản Hồi</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
