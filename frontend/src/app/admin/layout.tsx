import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Server, 
  ShoppingCart, 
  Users, 
  Settings,
  Bell,
  Search,
  Newspaper,
  PieChart,
  History
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard - Cloud Service",
  description: "Quản trị hệ thống Cloud Service",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Server className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold text-lg tracking-wider text-foreground">CLOUD ADMIN</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/services" icon={<Server size={20} />} label="Gói Cloud" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Đơn Hàng" />
          <NavItem href="/admin/affiliates" icon={<Users size={20} />} label="Đối Tác (Affiliate)" />
          <NavItem href="/admin/news" icon={<Newspaper size={20} />} label="Tin Tức" />
          <NavItem href="/admin/analytics" icon={<PieChart size={20} />} label="Thống Kê" />
          <NavItem href="/admin/audit-logs" icon={<History size={20} />} label="Nhật Ký Hệ Thống" />
        </nav>
        
        <div className="p-4 border-t border-border shrink-0">
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
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-border pl-4">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-sm ring-1 ring-primary/30">
                AD
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium leading-none">Administrator</span>
                <span className="text-xs text-muted-foreground mt-1">Hệ thống</span>
              </div>
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
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
    >
      <span className="group-hover:text-primary transition-colors">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
