'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { Loader2, Search, Edit, Trash2, Shield, DollarSign } from 'lucide-react';

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [role, setRole] = useState(3); // Default: Customer = 3
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/customers');
      setAccounts(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài khoản:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"? Thao tác này có thể thất bại nếu tài khoản đang có đơn hàng/dịch vụ.`)) return;
    
    try {
      await apiClient.delete(`/admin/customers/${id}`);
      setAccounts(accounts.filter(a => a.id !== id));
      alert("Xóa thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Xóa thất bại!");
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setRole(user.role);
    setNewPassword('');
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Gọi API cập nhật thông tin chung (Role)
      await apiClient.put(`/admin/customers/${editingUser.id}`, { role: role, addCredit: 0 });
      
      // Nếu có nhập mật khẩu mới, gọi API đặt lại mật khẩu
      if (newPassword.trim()) {
        await apiClient.put(`/admin/customers/${editingUser.id}/reset-password`, { newPassword: newPassword });
      }

      setAccounts(accounts.map(a => a.id === editingUser.id ? { ...a, role: role } : a));
      setShowEditModal(false);
      alert("Cập nhật tài khoản thành công!");
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi cập nhật!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAccounts = accounts.filter(a => 
    (a.email?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (a.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Tài Khoản</h1>
          <p className="text-muted-foreground">Phân quyền và quản lý người dùng</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo email, tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-500 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-4 font-bold">Người Dùng</th>
                <th className="px-6 py-4 font-bold">Liên Hệ</th>
                <th className="px-6 py-4 font-bold">Vai Trò</th>
                <th className="px-6 py-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">
                        {user.fullName || 'Khách hàng ẩn danh'}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        @{user.username || 'unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{user.email}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        TG Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 1 ? 'bg-purple-100 text-purple-700' :
                        user.role === 2 ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 1 ? 'Admin' : user.role === 2 ? 'Editor' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.fullName || user.username)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors"
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

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-border">
            <h3 className="text-xl font-bold mb-4">Chỉnh Sửa Tài Khoản</h3>
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700">{editingUser.email}</p>
              <p className="text-xs text-muted-foreground">ID: {editingUser.id}</p>
            </div>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vai Trò</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={role}
                    onChange={(e) => setRole(parseInt(e.target.value))}
                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-slate-900"
                  >
                    <option value={3}>Khách Hàng</option>
                    <option value={1}>Admin</option>
                    <option value={2}>Editor</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium mb-1">Mật Khẩu Mới (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Để trống nếu không muốn đổi"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50 text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">Sử dụng tính năng này để cấp lại mật khẩu cho khách hàng quên mật khẩu.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
