'use client';
import { AlertCircle, Edit, Trash2, Plus } from 'lucide-react';

interface AuditLog {
  id: number;
  admin: string;
  action: string;
  type: 'DELETE' | 'UPDATE' | 'CREATE' | 'VIEW';
  time: string;
}

const mockLogs: AuditLog[] = [
  { id: 1, admin: 'Nguyễn Trung Hậu', action: 'Xóa tài khoản khách hàng ID #1029', type: 'DELETE', time: '10 phút trước' },
  { id: 2, admin: 'Admin Hệ Thống', action: 'Cập nhật cấu hình gói VPS Pro', type: 'UPDATE', time: '2 giờ trước' },
  { id: 3, admin: 'Nguyễn Trung Hậu', action: 'Thêm mới mã giảm giá SUMMER2026', type: 'CREATE', time: '1 ngày trước' },
  { id: 4, admin: 'Trần Thị B', action: 'Xem chi tiết đơn hàng #1005', type: 'VIEW', time: '2 ngày trước' },
  { id: 5, admin: 'Admin Hệ Thống', action: 'Cập nhật thông tin server #42', type: 'UPDATE', time: '3 ngày trước' },
];

export default function AuditLogsPage() {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'DELETE':
        return 'bg-rose-100 text-rose-700';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-700';
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-700';
      case 'VIEW':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DELETE': return <Trash2 size={16} />;
      case 'UPDATE': return <Edit size={16} />;
      case 'CREATE': return <Plus size={16} />;
      case 'VIEW': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nhật Ký Hoạt Động Hệ Thống</h1>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="relative border-l-2 border-border ml-3 space-y-8">
          {mockLogs.map((log) => (
            <div key={log.id} className="relative pl-8">
              {/* Vòng tròn mốc thời gian */}
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 border-4 border-card shadow"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div className="flex-1">
                  <p className="font-bold text-foreground">
                    {log.admin}
                    <span className="font-normal text-muted-foreground text-sm ml-2">đã thực hiện</span>
                  </p>
                  <p className="text-foreground mt-2 text-sm">{log.action}</p>
                </div>
                <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                  <span className="text-xs font-semibold text-muted-foreground">{log.time}</span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getBadgeColor(
                      log.type
                    )}`}
                  >
                    {getIcon(log.type)}
                    {log.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
