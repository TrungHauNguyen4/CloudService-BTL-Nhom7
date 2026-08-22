'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Tin tức', path: '/tin-tuc' },
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Dịch vụ', path: '/dich-vu' },
    { name: 'Bảng giá', path: '/bang-gia' },
    { name: 'Khách hàng', path: '/khach-hang' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <Link href="/">Cloud<span className="text-blue-600">Service</span></Link>
        </div>

        {/* Menu điều hướng Desktop */}
        <nav className="hidden lg:flex space-x-6">
          {navLinks.map((link, index) => {
            const isActive = link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
            return (
              <Link 
                key={index} 
                href={link.path} 
                className={`font-semibold text-sm transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 px-4 py-2 rounded-full' 
                    : 'text-slate-600 hover:text-blue-600 px-2 py-2'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Nút Đăng nhập / Đăng ký hoặc Auth Bar */}
        <div className="hidden md:flex space-x-4 items-center">
          {loading ? (
            <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                Chào, {user.name}
              </span>
              <Link href={user.role === 'Admin' ? '/admin/dashboard' : '/dashboard'} className="text-blue-600 font-bold text-sm hover:underline whitespace-nowrap">
                {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button onClick={logout} className="text-rose-600 font-bold text-sm hover:underline whitespace-nowrap">
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link href="/dang-nhap" className="text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5">
                Đăng ký
              </Link>
            </>
          )}
        </div>
        
        {/* Nút Hamburger menu cho Mobile */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 focus:outline-none">
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-slate-100 py-4 px-6 lg:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, index) => {
              const isActive = link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
              return (
                <Link
                  key={index}
                  href={link.path}
                  className={`font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 pt-4">
              {loading ? (
                <div className="h-10 bg-slate-100 animate-pulse rounded-full"></div>
              ) : user ? (
                <>
                  <Link href={user.role === 'Admin' ? '/admin/dashboard' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className="text-center text-blue-600 font-bold py-2">
                    {user.role === 'Admin' ? 'Tới Admin Panel' : 'Tới Dashboard'}
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-center text-rose-600 font-bold py-2">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dang-nhap" onClick={() => setIsMenuOpen(false)} className="text-center text-slate-600 font-bold py-2">Đăng nhập</Link>
                  <Link href="/dang-ky" onClick={() => setIsMenuOpen(false)} className="text-center bg-blue-600 text-white py-3 rounded-full font-bold">Đăng ký</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}