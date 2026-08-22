'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const mockVisitorData = [
  { time: '00:00', visitors: 120 },
  { time: '04:00', visitors: 80 },
  { time: '08:00', visitors: 450 },
  { time: '12:00', visitors: 890 },
  { time: '16:00', visitors: 1200 },
  { time: '20:00', visitors: 700 },
  { time: '24:00', visitors: 200 },
];

export default function AdminVisitorsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Activity className="text-blue-600 w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Thống Kê Lượt Truy Cập</h1>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Tính năng đang phát triển:</strong> Hệ thống hiện đang tích hợp với Google Analytics để lấy dữ liệu thực tế. Các số liệu dưới đây chỉ là mô phỏng (Mock Data).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[500px]">
        <h3 className="text-lg font-bold text-foreground mb-6">Lưu lượng truy cập theo giờ (24h qua)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={mockVisitorData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} fill="#93c5fd" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
