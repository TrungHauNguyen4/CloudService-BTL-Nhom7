'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import apiClient from '@/lib/axios';

const pieData = [
  { name: 'Gói Cơ Bản', value: 400 },
  { name: 'Gói Pro', value: 300 },
  { name: 'Gói Doanh Nghiệp', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AnalyticsPage() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newCustomers: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [summaryRes, revenueRes] = await Promise.all([
          apiClient.get('/admin/stats/summary'),
          apiClient.get('/admin/stats/revenue-chart')
        ]);
        setSummary(summaryRes.data);
        
        const mappedRevenue = revenueRes.data.map((item: any) => ({
          name: item.month,
          revenue: item.revenue
        }));
        setRevenueData(mappedRevenue);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu phân tích...</div>;
  }

  const overviewCards = [
    { title: 'Tổng Doanh Thu', value: `$${summary.totalRevenue.toLocaleString()}` },
    { title: 'Khách Hàng Mới', value: `+${summary.newCustomers}` },
    { title: 'Đơn Hàng', value: summary.totalOrders },
    { title: 'Lượt Truy Cập', value: 'Tracking...' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Thống Kê Tổng Quan</h1>
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-black text-foreground">{card.value}</p>
            <p className="text-emerald-500 text-xs font-bold mt-2">Cập nhật tự động</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ đường */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-96">
          <h3 className="text-lg font-bold text-foreground mb-6">Tăng trưởng Doanh thu</h3>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tròn */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-96">
          <h3 className="text-lg font-bold text-foreground mb-6">Tỷ lệ Gói Dịch vụ (Mock)</h3>
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
