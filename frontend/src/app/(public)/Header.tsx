import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-blue-600">
          <Link href="/">CloudService</Link>
        </div>

        {/* Menu điều hướng */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">Trang chủ</Link>
          <Link href="/dich-vu" className="text-gray-600 hover:text-blue-600 font-medium">Dịch vụ</Link>
          <Link href="/bang-gia" className="text-gray-600 hover:text-blue-600 font-medium">Bảng giá</Link>
          <Link href="/lien-he" className="text-gray-600 hover:text-blue-600 font-medium">Liên hệ</Link>
        </nav>

        {/* Nút Đăng nhập / Đăng ký */}
        <div className="flex space-x-4 items-center">
          <button className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Đăng nhập</button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">Đăng ký</button>
        </div>
      </div>
    </header>
  );
}