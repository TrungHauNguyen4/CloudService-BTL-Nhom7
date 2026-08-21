import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Các đường dẫn dành cho Admin cần được bảo vệ
  const protectedPaths = ['/dashboard', '/services', '/orders', '/affiliates', '/settings'];
  
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Nếu đã đăng nhập mà lại cố vào trang login thì đá về dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/services/:path*', '/orders/:path*', '/affiliates/:path*', '/settings/:path*', '/login'],
};
