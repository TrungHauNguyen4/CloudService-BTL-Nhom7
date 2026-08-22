'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    activeServers: 0,
    creditBalance: 0,
    recentActivity: 'Đang tải...'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/customer/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thông kê", error);
        setStats(prev => ({ ...prev, recentActivity: 'Không thể kết nối đến máy chủ' }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
        <Link href="/dich-vu" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all">
          + Khởi tạo Server
        </Link>
      </header>

      <main className="p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Thống kê 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-semibold text-sm mb-1">Máy chủ đang chạy</p>
            <h3 className="text-3xl font-black text-slate-800">
              {isLoading ? '...' : stats.activeServers}
            </h3>
          </div>
        </div>

        {/* Bảng Server */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
           <p className="text-slate-500">{stats.recentActivity}</p>
        </div>
      </main>
    </>
  );
}