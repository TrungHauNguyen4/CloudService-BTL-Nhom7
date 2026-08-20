export default function StoragePage() {
  // Dữ liệu giả lập các phân vùng lưu trữ
  const storageVolumes = [
    { id: 'vol-a1b2', name: 'Data-DB-Main', type: 'Block Storage (NVMe)', size: '250 GB', region: 'VN-HCM-1', status: 'Attached' },
    { id: 'vol-c3d4', name: 'Backup-Weekly', type: 'Object Storage (S3)', size: '1.2 TB', region: 'VN-HN-2', status: 'Available' },
    { id: 'vol-e5f6', name: 'App-Assets', type: 'Object Storage (S3)', size: '50 GB', region: 'VN-HCM-1', status: 'Available' },
  ];

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Lưu trữ (Storage)</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2">
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
              <h3 className="text-3xl font-black text-slate-800">1.5 <span className="text-lg text-slate-400 font-medium">TB</span></h3>
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
                    <td className="p-4 font-bold text-slate-700">{vol.size}</td>
                    <td className="p-4 text-sm text-slate-500">{vol.region}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${vol.status === 'Attached' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {vol.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}