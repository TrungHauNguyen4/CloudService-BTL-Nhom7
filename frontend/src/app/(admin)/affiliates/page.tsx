"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Search, Link as LinkIcon } from "lucide-react";

const mockAffiliates = [
  { id: "AFF-001", name: "Nguyễn Văn Đối Tác", email: "doitac1@gmail.com", source: "Website cá nhân", status: "Pending" },
  { id: "AFF-002", name: "Trần Thị KOL", email: "kol_tran@yahoo.com", source: "Kênh Youtube", status: "Approved" },
  { id: "AFF-003", name: "Lê Văn Tiktoker", email: "le_tiktok@gmail.com", source: "Tiktok 1M Follows", status: "Pending" },
  { id: "AFF-004", name: "Spammer 99", email: "spam@bot.com", source: "Không rõ", status: "Rejected" },
];

export default function AffiliatesPage() {
  const [affiliates] = useState(mockAffiliates);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/20">Đã Phê Duyệt</span>;
      case 'Rejected':
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
              {affiliates.map((affiliate, index) => (
                <tr 
                  key={affiliate.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 font-medium text-foreground">{affiliate.id}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{affiliate.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{affiliate.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{affiliate.source}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(affiliate.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {affiliate.status === 'Pending' ? (
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors" title="Chấp nhận">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Từ chối">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Đã chốt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
