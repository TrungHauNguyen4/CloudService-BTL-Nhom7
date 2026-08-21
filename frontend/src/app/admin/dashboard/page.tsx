"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';

const mockData = [
  { name: 'Tháng 1', total: 4000 },
  { name: 'Tháng 2', total: 3000 },
  { name: 'Tháng 3', total: 2000 },
  { name: 'Tháng 4', total: 2780 },
  { name: 'Tháng 5', total: 1890 },
  { name: 'Tháng 6', total: 2390 },
  { name: 'Tháng 7', total: 3490 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Tổng quan về tình hình kinh doanh Cloud Service.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Tổng Doanh Thu" 
          value="$45,231.89" 
          change="+20.1% so với tháng trước" 
          icon={<DollarSign className="w-5 h-5 text-primary" />} 
          delay="0"
        />
        <SummaryCard 
          title="Đơn Hàng Mới" 
          value="+2350" 
          change="+180.1% so với tháng trước" 
          icon={<ShoppingCart className="w-5 h-5 text-secondary" />} 
          delay="100"
        />
        <SummaryCard 
          title="Khách Hàng Mới" 
          value="+12,234" 
          change="+19% so với tháng trước" 
          icon={<Users className="w-5 h-5 text-accent" />} 
          delay="200"
        />
        <SummaryCard 
          title="Lượt Truy Cập" 
          value="+573" 
          change="+201 kể từ 1 giờ trước" 
          icon={<Activity className="w-5 h-5 text-destructive" />} 
          delay="300"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both">
        <h2 className="text-lg font-semibold text-foreground mb-4">Biểu đồ doanh thu (2026)</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
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
