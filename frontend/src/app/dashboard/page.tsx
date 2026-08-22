import Link from 'next/link';

export default function CustomerDashboard() {
  const instances = [
    { id: 'srv-01', name: 'Web Server Prod', ip: '103.19.12.55', status: 'Running', os: 'Ubuntu 24.04', cpu: '12%', ram: '45%' },
    { id: 'srv-02', name: 'Database Main', ip: '103.19.12.56', status: 'Running', os: 'Debian 12', cpu: '34%', ram: '78%' },
  ];

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all">
          + Khởi tạo Server
        </button>
      </header>

      <main className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Thống kê 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-semibold text-sm mb-1">Máy chủ đang chạy</p>
            <h3 className="text-3xl font-black text-slate-800">2</h3>
          </div>
          {/* Card Thống kê 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-semibold text-sm mb-1">Số dư Credit</p>
            <h3 className="text-3xl font-black text-slate-800">1,250,000đ</h3>
          </div>
        </div>

        {/* Bảng Server */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
           <p className="text-slate-500">Mọi thứ đang hoạt động ổn định.</p>
        </div>
      </main>
    </>
  );
}