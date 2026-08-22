import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'CloudService — Dịch vụ Cloud hàng đầu Việt Nam',
    template: '%s | CloudService',
  },
  description: 'Giải pháp VPS, Cloud Storage, Bảo mật đám mây với hiệu năng vượt trội, uptime 99.99%. Hỗ trợ kỹ thuật 24/7.',
  openGraph: {
    title: 'CloudService',
    description: 'Dịch vụ điện toán đám mây hàng đầu Việt Nam',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
