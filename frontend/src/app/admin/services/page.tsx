"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, QrCode } from "lucide-react";
import apiClient from "@/lib/axios";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  // States cho CRUD Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    monthlyPrice: 0,
    isActive: true
  });
  const [specItems, setSpecItems] = useState<string[]>(["", "", "", ""]);

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

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/admin/service-categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const handleShowQr = async (planId: string) => {
    setShowQrModal(true);
    setLoadingQr(true);
    setQrData(null);
    try {
      const response = await apiClient.get('/service-plans/' + planId + '/qr');
      setQrData(response.data);
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      alert("Không thể tải mã QR");
      setShowQrModal(false);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa gói dịch vụ này?")) return;
    try {
      await apiClient.delete(`/admin/service-plans/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      categoryId: categories.length > 0 ? categories[0].id : "",
      monthlyPrice: 0,
      isActive: true
    });
    setSpecItems(["", "", "", ""]);
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      categoryId: service.categoryId || (service.category?.id) || "",
      monthlyPrice: service.monthlyPrice,
      isActive: service.isActive
    });
    
    // Convert specs string back to array
    const specsString = service.specs || "";
    const parts = specsString.split(/[\n]|\s\/\s/).map((s: string) => s.trim()).filter(Boolean);
    while (parts.length < 4) parts.push("");
    setSpecItems(parts.slice(0, 4));
    
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...specItems];
    newSpecs[index] = value;
    setSpecItems(newSpecs);
  };

  // Removed addSpec and removeSpec as the form is now fixed to 4 fields

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Join specItems with \n
      const finalSpecs = specItems.map(s => s.trim()).filter(s => s !== "").join("\n");
      const payload = { ...formData, specs: finalSpecs };
      
      if (editingId) {
        await apiClient.put(`/admin/service-plans/${editingId}`, payload);
      } else {
        await apiClient.post('/admin/service-plans', payload);
      }
      
      setShowModal(false);
      fetchServices();
      setEditingId(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gói Dịch Vụ</h1>
          <p className="text-muted-foreground mt-2">Quản lý các gói Cloud Service đang cung cấp.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors font-medium"
        >
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
                    <td className="px-6 py-4 font-semibold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.monthlyPrice)}</td>
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
                        <button 
                          onClick={() => handleEdit(service)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          title="Xóa"
                        >
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

      {/* QR MODAL */}
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

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-6 w-full max-w-xl shadow-2xl relative border border-border max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Cập Nhật Gói Dịch Vụ' : 'Thêm Gói Dịch Vụ Mới'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tên Gói */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tên gói</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="VD: VPS Basic"
                  />
                </div>

                {/* Danh Mục */}
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Giá */}
                <div>
                  <label className="block text-sm font-medium mb-1">Giá mỗi tháng (VNĐ)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({...formData, monthlyPrice: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Trạng Thái */}
                <div className="flex items-center gap-3 pt-6">
                  <input 
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Đang hoạt động</label>
                </div>
              </div>

              {/* Thông số kỹ thuật - Fixed 4 Fields */}
              <div>
                <label className="block text-sm font-medium mb-2">Thông số kỹ thuật (Mặc định)</label>
                <div className="space-y-3 bg-muted/5 p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-muted-foreground text-right">CPU (vCore)</label>
                    <input 
                      type="text"
                      value={specItems[0] || ""}
                      onChange={(e) => handleSpecChange(0, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background"
                      placeholder="VD: 2 vCore"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-muted-foreground text-right">RAM (GB)</label>
                    <input 
                      type="text"
                      value={specItems[1] || ""}
                      onChange={(e) => handleSpecChange(1, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background"
                      placeholder="VD: 4 GB"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-muted-foreground text-right">Ổ cứng (Disk)</label>
                    <input 
                      type="text"
                      value={specItems[2] || ""}
                      onChange={(e) => handleSpecChange(2, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background"
                      placeholder="VD: 50 GB NVMe"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-sm font-medium text-muted-foreground text-right">Băng thông (Bandwidth)</label>
                    <input 
                      type="text"
                      value={specItems[3] || ""}
                      onChange={(e) => handleSpecChange(3, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background"
                      placeholder="VD: Không giới hạn"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t mt-4">
                <button 
                  type="button"
                  onClick={() => { setShowModal(false); setEditingId(null); }}
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 flex items-center transition-colors disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Cập Nhật' : 'Lưu Lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
