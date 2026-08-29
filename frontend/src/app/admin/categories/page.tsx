"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import apiClient from "@/lib/axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho CRUD Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    promotionId: ""
  });
  const [specSchema, setSpecSchema] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [catRes, promoRes] = await Promise.all([
        apiClient.get('/admin/service-categories'),
        apiClient.get('/admin/promotions')
      ]);
      setCategories(catRes.data);
      setPromotions(promoRes.data.filter((p: any) => p.isActive));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này? Các gói dịch vụ thuộc danh mục có thể bị ảnh hưởng.")) return;
    try {
      await apiClient.delete(`/admin/service-categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
      promotionId: ""
    });
    setSpecSchema([]);
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      promotionId: category.promotionId || ""
    });
    setSpecSchema(category.specSchema || []);
    setEditingId(category.id);
    setShowModal(true);
  };

  const handleSchemaChange = (index: number, value: string) => {
    const newSchema = [...specSchema];
    newSchema[index] = value;
    setSpecSchema(newSchema);
  };

  const addSchemaField = () => setSpecSchema([...specSchema, ""]);
  
  const removeSchemaField = (index: number) => {
    setSpecSchema(specSchema.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { 
        ...formData,
        promotionId: formData.promotionId === "" ? null : formData.promotionId,
        specSchema: specSchema.filter(s => s.trim() !== "") 
      };
      
      if (editingId) {
        await apiClient.put(`/admin/service-categories/${editingId}`, payload);
      } else {
        await apiClient.post('/admin/service-categories', payload);
      }
      
      setShowModal(false);
      fetchData();
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Danh Mục Dịch Vụ</h1>
          <p className="text-muted-foreground mt-2">Quản lý các danh mục gói Cloud (VPS, Hosting, Domain...) và gắn mã khuyến mãi.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Danh Mục</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Tên Danh Mục</th>
                <th scope="col" className="px-6 py-4 font-medium">Slug</th>
                <th scope="col" className="px-6 py-4 font-medium">Khuyến Mãi Áp Dụng</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu từ Backend...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr 
                    key={category.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                    <td className="px-6 py-4">
                      {category.promotionCode ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {category.promotionCode} (-{category.promotionDiscountPercentage}%)
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card rounded-2xl max-w-md w-full shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">
                {editingId ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tên Danh Mục</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors text-sm"
                  placeholder="VD: VPS Hiệu Năng Cao"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mô tả</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors text-sm"
                  placeholder="Mô tả về danh mục..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mã Khuyến Mãi Áp Dụng</label>
                <select 
                  value={formData.promotionId}
                  onChange={(e) => setFormData({...formData, promotionId: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors text-sm"
                >
                  <option value="">-- Không áp dụng khuyến mãi --</option>
                  {promotions.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} (Giảm {p.discountPercentage}%)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Khách hàng sẽ được giảm giá theo mã này khi mua các gói dịch vụ thuộc danh mục.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-foreground">Cấu hình Trường Thông số (Spec Schema)</label>
                  <button 
                    type="button"
                    onClick={addSchemaField}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition-colors font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Thêm trường
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Định nghĩa các trường dữ liệu (VD: CPU, RAM) cho các gói dịch vụ thuộc danh mục này.</p>
                <div className="space-y-2 border border-border bg-muted/10 p-3 rounded-lg max-h-48 overflow-y-auto">
                  {specSchema.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-muted text-muted-foreground rounded text-xs font-bold">
                        {index + 1}
                      </div>
                      <input 
                        type="text"
                        value={field}
                        onChange={(e) => handleSchemaChange(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Tên trường (VD: CPU, Ổ cứng...)"
                      />
                      <button 
                        type="button"
                        onClick={() => removeSchemaField(index)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {specSchema.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Chưa có trường nào. Các gói thuộc danh mục này sẽ nhập thông số tự do.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground">Hoạt động</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
