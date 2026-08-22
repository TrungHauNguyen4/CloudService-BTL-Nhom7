'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const lineData = [
  { name: 'Tháng 1', users: 4000, revenue: 2400 },
  { name: 'Tháng 2', users: 3000, revenue: 1398 },
  { name: 'Tháng 3', users: 2000, revenue: 9800 },
  { name: 'Tháng 4', users: 2780, revenue: 3908 },
  { name: 'Tháng 5', users: 1890, revenue: 4800 },
  { name: 'Tháng 6', users: 2390, revenue: 3800 },
];

const pieData = [
  { name: 'Gói Cơ Bản', value: 400 },
  { name: 'Gói Pro', value: 300 },
  { name: 'Gói Doanh Nghiệp', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Thống Kê Tổng Quan</h1>
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {['Tổng Doanh Thu', 'Khách Hàng Mới', 'Đơn Hàng', 'Lượt Truy Cập'].map((t, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">{t}</h3>
            <p className="text-3xl font-black text-foreground">{(Math.random() * 10000).toFixed(0)}</p>
            <p className="text-emerald-500 text-xs font-bold mt-2">+15% tháng này</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ đường */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-96">
          <h3 className="text-lg font-bold text-foreground mb-6">Tăng trưởng Người dùng</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-96">
          <h3 className="text-lg font-bold text-foreground mb-6">Tỷ lệ Gói Dịch vụ</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
