'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Danh sách Menu
  const menuItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { name: 'Máy chủ ảo', path: '/dashboard/may-chu-ao', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /> },
    { name: 'Lưu trữ', path: '/dashboard/luu-tru', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /> },
  ];

  const accountItems = [
    { name: 'Hóa đơn', path: '/dashboard/hoa-don', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
    { name: 'Cài đặt', path: '/dashboard/cai-dat', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR CỐ ĐỊNH */}
      <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            Cloud<span className="text-blue-500">Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2">Quản lý dịch vụ</p>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === item.path ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-900'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
              {item.name}
            </Link>
          ))}

          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-8">Tài khoản & Thanh toán</p>
          {accountItems.map((item) => (
            <Link key={item.path} href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === item.path ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-900'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Khách hàng A</p>
              <p className="text-xs text-slate-400 truncate">ID: CUS-99234</p>
            </div>
          </div>
        </div>
      </aside>

      {/* NỘI DUNG THAY ĐỔI BÊN PHẢI (Dashboard, Compute, Storage...) */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}