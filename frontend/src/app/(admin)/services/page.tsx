"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import apiClient from "@/lib/axios";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    </div>
  );
}
