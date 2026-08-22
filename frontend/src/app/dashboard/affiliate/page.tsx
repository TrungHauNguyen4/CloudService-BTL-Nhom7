"use client";

import { useState, useEffect } from "react";
import { Link, Copy, CheckCircle2, TrendingUp, Users, DollarSign, Loader2, XCircle } from "lucide-react";
import apiClient from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function CustomerAffiliatePage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/customer/affiliate/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thống kê affiliate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCopy = () => {
    if (stats?.affiliateLink) {
      navigator.clipboard.writeText(stats.affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Chưa đăng ký
  if (!stats?.isAffiliate && stats?.affiliateStatus === null) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tiếp Thị Liên Kết (Affiliate)</h1>
          <p className="text-muted-foreground mt-2">Kiếm tiền bằng cách giới thiệu khách hàng sử dụng dịch vụ Cloud của chúng tôi.</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-8 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Trở thành Đối Tác Affiliate</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Nhận hoa hồng lên đến <span className="font-bold text-emerald-500">10%</span> trọn đời cho mỗi khách hàng bạn giới thiệu thành công. Tham gia mạng lưới đối tác của chúng tôi ngay hôm nay!
          </p>
          <button 
            onClick={() => router.push('/doi-tac')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25"
          >
            Đăng Ký Trở Thành Đối Tác
          </button>
        </div>
      </div>
    );
  }

  // Đang chờ duyệt
  if (stats?.affiliateStatus === 0) { // OrderStatus.New
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tiếp Thị Liên Kết</h1>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Đơn Đăng Ký Đang Chờ Duyệt</h2>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã đăng ký tham gia chương trình Đối Tác! Chúng tôi đang xem xét hồ sơ của bạn. Quá trình này có thể mất từ 1-2 ngày làm việc.
          </p>
        </div>
      </div>
    );
  }

  // Đã được duyệt
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tiếp Thị Liên Kết (Affiliate)</h1>
        <p className="text-muted-foreground mt-2">Theo dõi hiệu quả giới thiệu và doanh thu của bạn.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-8">
        {stats?.affiliateStatus === 4 ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold text-destructive mb-2">Hợp Đồng Đã Bị Huỷ</h3>
            <p className="text-destructive/80 mb-4">
              Hợp đồng Tiếp Thị Liên Kết của bạn đã bị ngừng hoặc huỷ bỏ. Mã giới thiệu dưới đây không còn hiệu lực cho các giao dịch mới. Tuy nhiên, các giao dịch thành công trước đó vẫn được ghi nhận hoa hồng.
            </p>
            <code className="px-4 py-2 bg-destructive/5 rounded font-mono text-destructive opacity-50 line-through mb-4 inline-block">
              {stats?.affiliateCode}
            </code>
            <div className="mt-4">
              <button 
                onClick={() => router.push('/doi-tac')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-xl transition-all shadow-md"
              >
                Gửi Lại Yêu Cầu Đăng Ký
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Mã Giới Thiệu Của Bạn</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 flex items-center space-x-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-4">
                <code className="text-2xl font-black text-primary flex-1 tracking-widest">{stats?.affiliateCode}</code>
              </div>
              <button 
                onClick={() => {
                  if (stats?.affiliateCode) {
                    navigator.clipboard.writeText(stats.affiliateCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-4 rounded-lg font-bold transition-colors ${
                  copied 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Mã</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
              <strong>Chính sách:</strong> Tặng khách hàng giảm <span className="font-bold text-emerald-600">{stats?.discountRate}%</span> khi nhập mã này lúc thanh toán. Bạn sẽ nhận được <span className="font-bold text-emerald-600">{stats?.commissionRate}%</span> hoa hồng trên tổng thanh toán của họ!
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Khách Hàng Thành Công</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.totalOrders || 0}</h3>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-border">
            <span className="text-xs text-emerald-500 font-medium">+15% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hoa Hồng Dự Kiến</p>
              <h3 className="text-3xl font-black text-emerald-600">
                {(stats?.totalCommission || 0).toLocaleString()} <span className="text-lg">VND</span>
              </h3>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-border relative z-10">
            <span className="text-xs text-muted-foreground">Dựa trên tỷ lệ hoa hồng {stats?.commissionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
