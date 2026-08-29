'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export default function AdminCustomerServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/customer-services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa hoàn toàn dịch vụ này và giải phóng bộ nhớ? Hành động này không thể hoàn tác!")) return;
    try {
      await apiClient.delete(`/admin/customer-services/${id}`);
      alert("Đã xóa và giải phóng thành công.");
      fetchServices();
    } catch (err) {
      alert("Lỗi khi xóa dịch vụ.");
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Running' ? 'Stopped' : 'Running';
    if (!confirm(`Bạn có chắc muốn ${newStatus === 'Stopped' ? 'Tạm dừng (Khóa)' : 'Kích hoạt lại (Mở khóa)'} dịch vụ này?`)) return;
    try {
      await apiClient.put(`/admin/customer-services/${id}/status`, { status: newStatus });
      fetchServices();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  if (loading) return <div className="p-8">Đang tải danh sách dịch vụ...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dịch Vụ Khách Hàng (VPS / Hosting)</h1>
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Khách hàng</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Gói / Dịch vụ</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Thông tin (IP / OS)</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 font-bold text-xs text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map(srv => {
              const isCancelled = srv.status === 'Cancelled';
              return (
                <tr key={srv.id} className={isCancelled ? 'bg-rose-50/50' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{srv.customerName}</div>
                    <div className="text-sm text-slate-500">{srv.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-600">{srv.serviceName}</div>
                    <div className="text-sm text-slate-500">Gói: {srv.planName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-slate-700">{srv.ipAddress || 'Đang cấp phát...'}</div>
                    <div className="text-xs text-slate-500">{srv.os}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isCancelled ? 'bg-rose-100 text-rose-700' : 
                      srv.status === 'Running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isCancelled ? 'Đã Hủy' : srv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {isCancelled ? (
                      <button 
                        onClick={() => handleDelete(srv.id)}
                        className="text-white bg-rose-600 hover:bg-rose-700 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        Xóa & Giải phóng
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(srv.id, srv.status)}
                          className={`font-bold text-sm px-4 py-2 rounded-lg transition-colors text-white ${
                            srv.status === 'Running' 
                              ? 'bg-amber-500 hover:bg-amber-600' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                        >
                          {srv.status === 'Running' ? 'Tạm Dừng' : 'Mở Lại'}
                        </button>
                        <button 
                          onClick={() => handleDelete(srv.id)}
                          className="text-white bg-rose-600 hover:bg-rose-700 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Chưa có dịch vụ nào đang chạy.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
