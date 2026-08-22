'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export default function StoragePage() {
  const [storageVolumes, setStorageVolumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVolName, setNewVolName] = useState('');
  const [newVolSize, setNewVolSize] = useState(10);
  const [newVolType, setNewVolType] = useState('Block Storage (NVMe)');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchVolumes();
  }, []);

  const fetchVolumes = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/customer/volumes');
      setStorageVolumes(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách Volume", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalUsedGB = storageVolumes.reduce((acc, curr) => acc + curr.sizeGB, 0);
  const displayTotal = totalUsedGB >= 1000 ? (totalUsedGB / 1000).toFixed(1) + ' TB' : totalUsedGB + ' GB';

  const handleCreateVolume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await apiClient.post('/customer/volumes', {
        name: newVolName,
        type: newVolType,
        sizeGB: newVolSize,
        region: 'VN-HCM-1'
      });
      setShowCreateModal(false);
      setNewVolName('');
      setNewVolSize(10);
      fetchVolumes(); // reload data
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo Volume");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('Bạn có chắc muốn xóa Volume này không? Dữ liệu sẽ không thể khôi phục!')) {
      try {
        await apiClient.delete(`/customer/volumes/${id}`);
        fetchVolumes();
      } catch (error) {
        alert("Lỗi khi xóa Volume");
      }
    }
  };

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Lưu trữ (Storage)</h1>
        <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Tạo Volume mới
        </button>
      </header>

      <main className="p-8 overflow-y-auto">
        {/* Thống kê dung lượng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
              <svg className="w-10 h-10 text-blue-500 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            </div>
            <div>
              <p className="text-slate-500 font-semibold text-sm mb-1">Tổng dung lượng đã dùng</p>
              <h3 className="text-3xl font-black text-slate-800">{displayTotal.split(' ')[0]} <span className="text-lg text-slate-400 font-medium">{displayTotal.split(' ')[1]}</span></h3>
            </div>
          </div>
        </div>

        {/* Bảng danh sách Volume */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Danh sách Volume / Bucket</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Tên / ID</th>
                  <th className="p-4">Loại lưu trữ</th>
                  <th className="p-4">Dung lượng</th>
                  <th className="p-4">Khu vực (Region)</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storageVolumes.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-800">{vol.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{vol.id}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">{vol.type}</td>
                    <td className="p-4 font-bold text-slate-700">{vol.sizeGB >= 1000 ? (vol.sizeGB/1000).toFixed(1) + ' TB' : vol.sizeGB + ' GB'}</td>
                    <td className="p-4 text-sm text-slate-500">{vol.region}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${vol.status === 'Attached' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(vol.id)} className="text-rose-600 hover:text-rose-800 font-semibold text-sm bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {storageVolumes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Bạn chưa có Volume nào. Hãy tạo mới!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Tạo Volume mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Tạo Volume Lưu Trữ</h3>
            <form onSubmit={handleCreateVolume} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên Volume</label>
                <input 
                  type="text" required
                  value={newVolName} onChange={e => setNewVolName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Data-Backup"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại lưu trữ</label>
                <select 
                  value={newVolType} onChange={e => setNewVolType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Block Storage (NVMe)</option>
                  <option>Object Storage (S3)</option>
                  <option>File Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Dung lượng (GB)</label>
                <input 
                  type="number" min={10} max={10000} required
                  value={newVolSize} onChange={e => setNewVolSize(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">
                  Hủy
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Khởi tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}