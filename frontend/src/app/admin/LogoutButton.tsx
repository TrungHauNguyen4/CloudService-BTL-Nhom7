"use client";

import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;
    Cookies.remove("token");
    Cookies.remove("role"); // In case role is saved
    router.push("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors ml-4"
      title="Đăng xuất"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
