'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface CustomerService {
  id: string;
  name: string;
  ipAddress: string;
  os: string;
  status: string;
  cpuUsage: number;
  ramUsage: number;
  expiresAt: string | null;
}

export default function ComputePage() {
  const [services, setServices] = useState<CustomerService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient.get('/customer/services');
        setServices(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách máy chủ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const [selectedService, setSelectedService] = useState<CustomerService | null>(null);

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Máy chủ ảo (Compute)</h1>
      </header>
      <main className="p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Tên Server</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Hệ điều hành</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Tài nguyên (CPU/RAM)</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Bạn chưa có máy chủ ảo nào.</td>
                  </tr>
                ) : (
                  services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{srv.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{srv.ipAddress || 'Đang cấp phát...'}</td>
                      <td className="px-6 py-4 text-slate-600">{srv.os || 'Ubuntu 24.04'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          srv.status === 'Running' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {srv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500">
                          <div>CPU: {srv.cpuUsage}%</div>
                          <div>RAM: {srv.ramUsage}%</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedService(srv)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Quản lý
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Quản lý Server */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Chi tiết Máy chủ</h3>
                <p className="text-slate-500 text-sm mt-1">{selectedService.name}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                selectedService.status === 'Running' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
              }`}>
                {selectedService.status}
              </span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">IP Address</span>
                <span className="font-mono font-bold text-slate-900">{selectedService.ipAddress}</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">Hệ điều hành</span>
                <span className="font-bold text-slate-900">{selectedService.os}</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">CPU Usage</span>
                <span className="font-bold text-slate-900">{selectedService.cpuUsage}%</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-medium">RAM Usage</span>
                <span className="font-bold text-slate-900">{selectedService.ramUsage}%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => alert("Tính năng Khởi động lại đang được bảo trì.")}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-3 rounded-xl transition-colors"
              >
                Khởi động lại
              </button>
              <button 
                onClick={() => setSelectedService(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}