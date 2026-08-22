'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  serviceName: string;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, invoicesRes] = await Promise.all([
          apiClient.get('/customer/dashboard/stats'),
          apiClient.get('/customer/invoices')
        ]);
        setCreditBalance(statsRes.data.creditBalance);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin hóa đơn", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Hóa đơn & Thanh toán</h1>
      </header>

      <main className="p-8 overflow-y-auto">

        {/* Bảng Lịch sử giao dịch */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Lịch sử giao dịch & Hóa đơn</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Mã Hóa Đơn</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4">Dịch vụ</th>
                  <th className="p-4 text-right">Số tiền</th>
                  <th className="p-4 text-right pr-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Bạn chưa có hóa đơn nào.</td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-slate-500">{inv.invoiceNumber}</td>
                      <td className="p-4 text-sm font-medium text-slate-600">
                        {new Date(inv.issueDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 text-sm text-slate-700">{inv.serviceName}</td>
                      <td className="p-4 text-right font-bold text-slate-800">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(inv.amount)}
                      </td>
                      <td className="p-4 text-right pr-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}