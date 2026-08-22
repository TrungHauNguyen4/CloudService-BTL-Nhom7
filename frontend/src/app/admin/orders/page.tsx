"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Filter, Loader2, Download } from "lucide-react";
import apiClient from "@/lib/axios";
import { saveAs } from 'file-saver';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [hideDraft, setHideDraft] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: number) => {
    setProcessingId(id);
    try {
      await apiClient.put(`/admin/orders/${id}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Refresh list after success
      await fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await apiClient.get('/admin/export/orders', {
        responseType: 'blob' 
      });
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, `DanhSachDonHang_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (error) {
      alert("Lỗi khi tải file Excel! Vui lòng thử lại sau.");
    }
  };

  const getStatusBadge = (status: number) => {
    // 1 = New (Pending), 2 = Processing, 3 = Completed, 4 = Cancelled
    switch(status) {
      case 3:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Hoàn thành</span>;
      case 4:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">Đã hủy</span>;
      case 2:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">Đang xử lý</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Chờ duyệt TT</span>;
    }
  };

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Đơn Hàng</h1>
          <p className="text-muted-foreground mt-2">Quản lý và xem chi tiết các đơn đăng ký dịch vụ.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 max-w-md flex items-center bg-card rounded-lg px-4 py-2 border border-border focus-within:border-primary transition-colors shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn, tên khách..." 
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <button 
          onClick={handleExportExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Xuất Excel
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Mã Đơn</th>
                <th scope="col" className="px-6 py-4 font-bold">Khách Hàng</th>
                <th scope="col" className="px-6 py-4 font-bold">Gói Đăng Ký</th>
                <th scope="col" className="px-6 py-4 font-bold">Trạng Thái</th>
                <th scope="col" className="px-6 py-4 font-bold">Tổng Tiền</th>
                <th scope="col" className="px-6 py-4 font-bold">Ngày Đặt</th>
                <th scope="col" className="px-6 py-4 font-bold text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu từ Backend...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className="border-b border-border hover:bg-slate-50 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{order.customerName}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{order.serviceName}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.finalPrice || 0)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-8 w-full max-w-2xl shadow-2xl relative border border-border">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-4">Chi Tiết Đơn Hàng #{selectedOrder.id.substring(0,8).toUpperCase()}</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Thông Tin Khách Hàng</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Họ tên</p>
                    <p className="font-medium text-foreground">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedOrder.email || 'Chưa cung cấp'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium text-foreground">{selectedOrder.phone || 'Chưa cung cấp'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Thông Tin Gói Đăng Ký</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tên gói dịch vụ</p>
                    <p className="font-bold text-primary">{selectedOrder.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chu kỳ thanh toán</p>
                    <p className="font-medium text-foreground">
                      {selectedOrder.billingCycle === 2 ? 'Hàng năm (Tặng 2 tháng)' : 'Hàng tháng'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày đặt hàng</p>
                    <p className="font-medium text-foreground">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
