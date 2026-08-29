'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { decodeJWT } from '@/lib/jwt';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer' | string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const decodeToken = (token: string): User | null => {
      const payload = decodeJWT(token);
      if (!payload) return null;
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }
      return {
        id: payload.nameid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        name: payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User",
        email: payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        role: payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer"
      };
  };

  const checkAuth = () => {
    const token = Cookies.get('token');
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        Cookies.remove('token');
        Cookies.remove('token', { path: '/' });
        Cookies.remove('token', { path: '/dashboard' });
        Cookies.remove('token', { path: '/', domain: window.location.hostname });
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]); // Kiểm tra lại khi chuyển trang

  // Cơ chế chống "Nút Back" - Nếu đang ở trang protected nhưng mất token -> văng ra đăng nhập
  useEffect(() => {
    if (!loading) {
      if ((pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) && !user) {
        router.replace('/dang-nhap');
      }
    }
  }, [pathname, user, loading, router]);

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 1, path: '/' });
    checkAuth();
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { path: '/dashboard' });
    Cookies.remove('token', { path: '/', domain: window.location.hostname });
    setUser(null);
    // Refresh trang hoàn toàn để xóa sạch bộ đệm JS memory và trở thành khách vãng lai
    window.location.href = '/dang-nhap'; 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
