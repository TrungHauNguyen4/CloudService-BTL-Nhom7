import Link from 'next/link';

export default function Header() {
  // Đưa menu vào mảng để dễ dàng thêm/sửa/xóa các mục sau này
  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Dịch vụ', path: '/dich-vu' },
    { name: 'Bảng giá', path: '/bang-gia' },
    { name: 'Đối tác', path: '/doi-tac' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Logo (Thêm icon mây để trông chuyên nghiệp hơn) */}
        <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <Link href="/">Cloud<span className="text-blue-600">Service</span></Link>
        </div>

        {/* Menu điều hướng (Render từ mảng) */}
        <nav className="hidden lg:flex space-x-8">
          {navLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.path} 
              className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Nút Đăng nhập / Đăng ký */}
        <div className="hidden md:flex space-x-5 items-center">
          <Link href="/dang-nhap" className="text-slate-600 font-bold text-sm hover:text-blue-600 transition-colors">
            Đăng nhập
          </Link>
          <Link href="/dang-ky" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5">
            Đăng ký
          </Link>
        </div>
        
        {/* Nút Hamburger menu cho Mobile (Sẽ ẩn trên Desktop) */}
        <div className="lg:hidden flex items-center">
          <button className="text-slate-600 hover:text-blue-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}