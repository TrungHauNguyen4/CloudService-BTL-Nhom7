"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, Link as LinkIcon, Loader2 } from "lucide-react";
import apiClient from "@/lib/axios";

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAffiliates = async () => {
    try {
      const response = await apiClient.get('/admin/affiliates/pending');
      setAffiliates(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách Affiliate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: number) => {
    setProcessingId(id);
    try {
      await apiClient.put(`/admin/affiliates/${id}/status`, { status: newStatus }, {
        headers: { 'Content-Type': 'application/json' }
      });
      await fetchAffiliates();
    } catch (error) {
      console.error("Lỗi khi duyệt Affiliate:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setProcessingId(null);
    }
  };

  // Status mapping: 0 = New/Pending, 1 = Processing, 2 = Completed/Approved, 3 = Cancelled/Rejected
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 2:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/20">Đã Phê Duyệt</span>;
      case 3:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/20">Từ Chối</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/20">Chờ Xử Lý</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Đối Tác Affiliate</h1>
          <p className="text-muted-foreground mt-2">Xét duyệt đơn đăng ký tham gia mạng lưới Affiliate.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors font-medium">
          <LinkIcon className="w-5 h-5" />
          <span>Copy Link Đăng Ký</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-4 border-b border-border flex items-center bg-card">
          <div className="flex-1 max-w-sm flex items-center bg-background rounded-lg px-4 py-2 border border-border focus-within:border-primary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm đối tác..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Mã Đăng Ký</th>
                <th scope="col" className="px-6 py-4 font-medium">Họ Tên</th>
                <th scope="col" className="px-6 py-4 font-medium">Email Liên Hệ</th>
                <th scope="col" className="px-6 py-4 font-medium">Nguồn Traffic</th>
                <th scope="col" className="px-6 py-4 font-medium">Trạng Thái</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Phê Duyệt</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : affiliates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Không có đơn đăng ký nào chờ xử lý.
                  </td>
                </tr>
              ) : (
                affiliates.map((affiliate, index) => (
                  <tr 
                    key={affiliate.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{affiliate.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{affiliate.fullName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{affiliate.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{affiliate.websiteOrSocialLink || 'Không rõ'}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(affiliate.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {affiliate.status === 0 || affiliate.status === 1 ? (
                        <div className="flex justify-end space-x-2">
                          {processingId === affiliate.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              <button onClick={() => handleUpdateStatus(affiliate.id, 2)} className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors" title="Chấp nhận">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleUpdateStatus(affiliate.id, 3)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Từ chối">
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
