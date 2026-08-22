"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, Tag, Calendar, Percent } from "lucide-react";
import apiClient from "@/lib/axios";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: 10,
    expiryDate: ""
  });

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/admin/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error("Lỗi khi tải mã khuyến mãi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mã khuyến mãi này?")) return;
    try {
      await apiClient.delete(`/admin/promotions/${id}`);
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const handleEdit = (promo: any) => {
    // Format date for datetime-local input: YYYY-MM-DDTHH:mm
    const date = new Date(promo.expiryDate);
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setFormData({
      code: promo.code,
      discountPercentage: promo.discountPercentage,
      expiryDate: formattedDate
    });
    setEditingId(promo.id);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ code: "", discountPercentage: 10, expiryDate: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountPercentage: formData.discountPercentage,
        expiryDate: new Date(formData.expiryDate).toISOString()
      };

      if (editingId) {
        await apiClient.put(`/admin/promotions/${editingId}`, payload);
      } else {
        await apiClient.post('/admin/promotions', payload);
      }
      
      setShowModal(false);
      fetchPromotions();
      setFormData({ code: "", discountPercentage: 10, expiryDate: "" });
      setEditingId(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mã Khuyến Mãi</h1>
          <p className="text-muted-foreground">Quản lý và tạo các mã giảm giá cho dịch vụ</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-primary text-primary-foreground flex items-center px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo Mã Mới
        </button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Mã Giảm Giá</th>
                <th className="px-6 py-4 font-medium">% Giảm</th>
                <th className="px-6 py-4 font-medium">Hạn Sử Dụng</th>
                <th className="px-6 py-4 font-medium">Trạng Thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Chưa có mã khuyến mãi nào
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => {
                  const isExpired = new Date(promo.expiryDate) < new Date();
                  return (
                    <tr key={promo.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          {promo.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">{promo.discountPercentage}%</td>
                      <td className="px-6 py-4">
                        {new Date(promo.expiryDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isExpired ? 'Hết hạn' : 'Đang hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(promo)}
                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-md transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(promo.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM/SỬA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-border">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Cập Nhật Mã Khuyến Mãi' : 'Tạo Mã Khuyến Mãi Mới'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mã Code (Tự viết hoa)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    placeholder="VD: KHUYENMAI2026"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">% Giảm Giá (1 - 100)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="number" 
                    required
                    min="1" max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({...formData, discountPercentage: parseInt(e.target.value) || 0})}
                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày Hết Hạn</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
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
