"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newCustomers: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, revenueRes] = await Promise.all([
          apiClient.get('/admin/stats/summary'),
          apiClient.get('/admin/stats/revenue-chart')
        ]);
        setSummary(summaryRes.data);
        
        // Ensure revenue is mapped correctly for Recharts
        const mappedRevenue = revenueRes.data.map((item: any) => ({
          name: item.month,
          total: item.revenue
        }));
        setRevenueData(mappedRevenue);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu tổng quan...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Tổng quan về tình hình kinh doanh Cloud Service.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Tổng Doanh Thu" 
          value={`$${summary.totalRevenue.toLocaleString()}`} 
          change="Cập nhật mới nhất" 
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
          delay="0"
        />
        <SummaryCard 
          title="Đơn Hàng (Đang chờ)" 
          value={`+${summary.totalOrders}`} 
          change="Cần xử lý" 
          icon={<ShoppingCart className="w-5 h-5 text-secondary" />} 
          delay="100"
        />
        <SummaryCard 
          title="Khách Hàng Mới" 
          value={`+${summary.newCustomers}`} 
          change="Người dùng vừa đăng ký" 
          icon={<Users className="w-5 h-5 text-accent" />} 
          delay="200"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
        <h2 className="text-lg font-semibold text-foreground mb-4">Biểu đồ doanh thu (2026)</h2>
        <div className="h-[400px] w-full">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--muted-foreground)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Chưa có dữ liệu doanh thu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, change, icon, delay }: { title: string, value: string, change: string, icon: React.ReactNode, delay: string }) {
  return (
    <div 
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-muted rounded-full">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{change}</p>
    </div>
  );
}
