"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Filter, Loader2 } from "lucide-react";
import apiClient from "@/lib/axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/admin/orders/pending');
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

  const getStatusBadge = (status: number) => {
    // 0 = New, 1 = Processing, 2 = Completed, 3 = Cancelled
    switch(status) {
      case 2:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/20">Hoàn thành</span>;
      case 3:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/20">Đã hủy</span>;
      case 1:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20">Đang xử lý</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/20">Chờ duyệt</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Đơn Hàng</h1>
          <p className="text-muted-foreground mt-2">Quản lý và xét duyệt các đơn đăng ký dịch vụ.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex space-x-4">
        <div className="flex-1 max-w-md flex items-center bg-card rounded-lg px-4 py-2 border border-border focus-within:border-primary transition-colors">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn, tên khách..." 
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button className="flex items-center space-x-2 bg-card border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Lọc Trạng Thái</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Mã Đơn</th>
                <th scope="col" className="px-6 py-4 font-medium">Khách Hàng</th>
                <th scope="col" className="px-6 py-4 font-medium">Gói Đăng Ký</th>
                <th scope="col" className="px-6 py-4 font-medium">Tổng Tiền</th>
                <th scope="col" className="px-6 py-4 font-medium">Ngày Đặt</th>
                <th scope="col" className="px-6 py-4 font-medium">Trạng Thái</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Tác Vụ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu từ Backend...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Không có đơn hàng nào đang chờ xử lý.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-bold text-foreground">{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.customerName}</td>
                    <td className="px-6 py-4 font-medium text-primary">{order.serviceName}</td>
                    <td className="px-6 py-4 font-semibold">${order.totalAmount || 0}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 0 || order.status === 1 ? (
                        <div className="flex justify-end space-x-2">
                          {processingId === order.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 2)}
                                className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors" title="Duyệt"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 3)}
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Hủy"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
