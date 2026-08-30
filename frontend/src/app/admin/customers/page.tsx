'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Quản Lý Khách Hàng</h1>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Mã Khách Hàng (ID)</th>
                  <th className="p-4 font-semibold">Tên Khách Hàng</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Ngày Đăng Ký</th>
                  <th className="p-4 font-semibold">Vai Trò</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {user.id}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {user.fullName || user.username || 'Khách hàng ẩn danh'}
                    </td>
                    <td className="p-4 text-sm text-foreground">{user.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 1 ? 'bg-purple-100 text-purple-700' :
                        user.role === 2 ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 1 ? 'Admin' : user.role === 2 ? 'Editor' : 'Khách hàng'}
                      </span>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Chưa có khách hàng nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
