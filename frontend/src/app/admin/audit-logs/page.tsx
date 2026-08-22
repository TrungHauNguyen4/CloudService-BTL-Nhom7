'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await apiClient.get('/admin/audit-logs');
        setLogs(response.data);
      } catch (error) {
        console.error("Lỗi khi tải Audit Logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Delete':
        return 'bg-rose-100 text-rose-700';
      case 'Update':
        return 'bg-amber-100 text-amber-700';
      case 'Create':
        return 'bg-emerald-100 text-emerald-700';
      case 'View':
        return 'bg-blue-100 text-blue-700';
      case 'Login':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Delete': return <Trash2 size={16} />;
      case 'Update': return <Edit size={16} />;
      case 'Create': return <Plus size={16} />;
      case 'View': return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Nhật Ký Hoạt Động Hệ Thống</h1>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Đang tải nhật ký hệ thống...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            Không có hoạt động nào được ghi nhận.
          </div>
        ) : (
          <div className="relative border-l-2 border-border ml-3 space-y-8">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-8">
                {/* Vòng tròn mốc thời gian */}
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1 border-4 border-card shadow"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">
                      {log.userEmail || log.userId}
                      <span className="font-normal text-muted-foreground text-sm ml-2">đã thực hiện</span>
                    </p>
                    <p className="text-foreground mt-2 text-sm">{log.action}</p>
                    {log.details && (
                      <p className="text-muted-foreground mt-1 text-xs">{log.details}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${getBadgeColor(
                        log.entityType || 'Action'
                      )}`}
                    >
                      {getIcon(log.entityType || 'Action')}
                      {log.entityType || 'Hành động'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
