"use client";

import { useState, useEffect } from "react";
import { Save, Settings, Percent } from "lucide-react";
import apiClient from "@/lib/axios";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get("/admin/settings");
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async (key: string, value: string) => {
    setIsSaving(true);
    setMessage("");
    try {
      await apiClient.put(`/admin/settings/${key}`, { value });
      setMessage("Cập nhật thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Cập nhật thất bại!");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cấu Hình Hệ Thống</h1>
        <p className="text-muted-foreground mt-2">Quản lý các tham số và chính sách chung của hệ thống.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="border-b bg-muted/30 px-6 py-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold">Chính Sách Khuyến Mãi Hệ Thống</h2>
          </div>
          <div className="p-6 space-y-6">
            {settings.filter(s => s.key.includes('DiscountRate') && !s.key.includes('Affiliate')).map(setting => (
              <div key={setting.key} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-slate-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{setting.description || (setting.key === 'YearlyDiscountRate' ? 'Giảm giá chu kỳ 1 Năm' : 'Giảm giá chu kỳ 1 Tháng')}</h4>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{setting.key}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="number" 
                      value={setting.value}
                      onChange={e => handleChange(setting.key, e.target.value)}
                      className="w-24 pl-3 pr-8 py-2 border rounded-lg text-right font-semibold"
                    />
                    <Percent className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
                  </div>
                  <button 
                    onClick={() => handleSave(setting.key, setting.value)}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                </div>
              </div>
            ))}
            
            {settings.filter(s => s.key.includes('DiscountRate') && !s.key.includes('Affiliate')).length === 0 && (
              <p className="text-muted-foreground text-sm">Chưa có cấu hình nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
