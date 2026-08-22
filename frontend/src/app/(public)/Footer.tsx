import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin công ty */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">CloudService</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Giải pháp điện toán đám mây tối ưu cho doanh nghiệp. Cung cấp hạ tầng mạnh mẽ, an toàn và dễ dàng mở rộng.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Khám phá</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/gioi-thieu" className="hover:text-blue-400 transition-colors">Về chúng tôi</Link></li>
            <li><Link href="/dich-vu" className="hover:text-blue-400 transition-colors">Dịch vụ nổi bật</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-blue-400 transition-colors">Tin tức & Blog</Link></li>
            <li><Link href="/doi-tac" className="hover:text-blue-400 transition-colors">Đối tác</Link></li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>Email: support@cloudservice.vn</li>
            <li>Hotline: 1900 1234</li>
            <li>Địa chỉ: Sinh Viên Đại Học Đồng Tháp</li>
          </ul>
        </div>
      </div>
      
      {/* Bản quyền */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2026 CloudService. All rights reserved.
      </div>
    </footer>
  );
}