"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, QrCode } from "lucide-react";
import apiClient from "@/lib/axios";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  const handleShowQr = async (planId: string) => {
    setShowQrModal(true);
    setLoadingQr(true);
    setQrData(null);
    try {
      const response = await apiClient.get('/public/service-plans/' + planId + '/qr');
      setQrData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      alert("Không thể tải mã QR");
      setShowQrModal(false);
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get('/admin/service-plans');
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách gói dịch vụ:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gói Dịch Vụ</h1>
          <p className="text-muted-foreground mt-2">Quản lý các gói Cloud Service đang cung cấp.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors font-medium">
          <Plus className="w-5 h-5" />
          <span>Thêm Gói Mới</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Tên Gói</th>
                <th scope="col" className="px-6 py-4 font-medium">Danh Mục</th>
                <th scope="col" className="px-6 py-4 font-medium">Giá (Tháng)</th>
                <th scope="col" className="px-6 py-4 font-medium">Trạng Thái</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu từ Backend...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Chưa có gói dịch vụ nào.
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr 
                    key={service.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{service.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{service.category?.name || 'Không rõ'}</td>
                    <td className="px-6 py-4 font-semibold text-primary">${service.monthlyPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        service.isActive 
                          ? 'bg-accent/20 text-accent border border-accent/20' 
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {service.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleShowQr(service.id)}
                          className="p-1.5 text-muted-foreground hover:text-blue-500 transition-colors"
                          title="Xem QR Thanh Toán"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-8 max-w-sm w-full shadow-2xl relative border border-border text-center">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-xl font-bold mb-2">Mã QR Thanh Toán</h3>
            <p className="text-muted-foreground text-sm mb-6">Đưa mã này cho khách hàng quét để thanh toán trực tiếp.</p>
            
            <div className="flex justify-center items-center min-h-[200px] bg-muted/30 rounded-lg p-4">
              {loadingQr ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : qrData ? (
                <div>
                  <img src={qrData.qrImage} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-sm mb-4 bg-white p-2" />
                  <p className="font-bold text-primary">{qrData.planName}</p>
                  <p className="text-lg font-black mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(qrData.price)}
                  </p>
                </div>
              ) : (
                <div className="text-destructive font-medium">Không thể hiển thị mã QR</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
