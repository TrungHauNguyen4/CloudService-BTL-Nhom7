"use client";

import { ReactNode, useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Server, 
  ShoppingCart, 
  Users,
  Contact,
  Settings,
  Bell,
  Search,
  Newspaper,
  PieChart,
  History,
  Tag,
  Home
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  
  // Protect editor routes on the client side just in case
  if (user?.role === 'Editor') {
    const pathname = usePathname();
    const allowedEditorPaths = ['/admin/orders', '/admin/affiliates', '/admin/news', '/admin/tickets'];
    if (pathname && pathname !== '/admin' && !allowedEditorPaths.some(p => pathname.startsWith(p))) {
      router.push('/admin/orders');
    }
  }

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await apiClient.get('/admin/support-tickets');
        const tickets = res.data.data || [];
        const count = tickets.filter((t: any) => t.status === 0).length;
        setPendingCount(count);
      } catch (e) { }
    };
    if (user?.role === 'Admin' || user?.role === 'Editor') {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Server className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold text-lg tracking-wider text-foreground">CLOUD ADMIN</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {user?.role === 'Admin' && (
            <>
              <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem href="/admin/services" icon={<Server size={20} />} label="Gói Cloud" />
              <NavItem href="/admin/categories" icon={<LayoutDashboard size={20} />} label="Danh Mục Dịch Vụ" />
            </>
          )}
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Đơn Hàng" />
          <NavItem href="/admin/tickets" icon={<Users size={20} />} label="Ticket Hỗ Trợ" />
          {user?.role === 'Admin' && (
            <>
              <NavItem href="/admin/accounts" icon={<Contact size={20} />} label="Tài Khoản" />
              <NavItem href="/admin/customers" icon={<Users size={20} />} label="Khách Hàng" />
              <NavItem href="/admin/customer-services" icon={<Server size={20} />} label="Dịch Vụ Khách" />
            </>
          )}
          <NavItem href="/admin/news" icon={<Newspaper size={20} />} label="Tin Tức" />
          <NavItem href="/admin/affiliates" icon={<Users size={20} />} label="Đối Tác Affiliate" />
          {user?.role === 'Admin' && (
            <>
              <NavItem href="/admin/promotions" icon={<Tag size={20} />} label="Khuyến Mãi" />
              <NavItem href="/admin/analytics" icon={<PieChart size={20} />} label="Thống Kê" />
              <NavItem href="/admin/audit-logs" icon={<History size={20} />} label="Nhật Ký Hệ Thống" />
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-border shrink-0 flex flex-col gap-1">
          <NavItem href="/" icon={<Home size={20} />} label="Về Trang Chủ" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Cài Đặt" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center bg-background rounded-full px-4 py-2 border border-border w-96 focus-within:border-primary transition-colors shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin/tickets" className="relative p-2 rounded-full hover:bg-muted transition-colors inline-block cursor-pointer">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {pendingCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-card">
                  {pendingCount}
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-3 border-l border-border pl-4">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-sm ring-1 ring-primary/30">
                AD
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium leading-none">{user?.fullName || 'Administrator'}</span>
                <span className="text-xs text-muted-foreground mt-1">{user?.role || 'Hệ thống'}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = href === '/admin/dashboard' 
    ? pathname === '/admin/dashboard'
    : (pathname === href || (href !== '/' && pathname.startsWith(href)));

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all group ${
        isActive 
          ? "bg-primary text-primary-foreground font-bold shadow-md" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className={`${isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`}>{icon}</span>
      <span className={isActive ? "font-bold text-sm" : "font-medium text-sm"}>{label}</span>
    </Link>
  );
}
