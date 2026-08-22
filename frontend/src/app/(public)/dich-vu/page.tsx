import Link from 'next/link';

export default function ServicesPage() {
  // Đưa dữ liệu vào mảng giúp code gọn gàng và dễ mở rộng sau này
  const services = [
    {
      id: 'cloud-server',
      name: 'Cloud Server (VPS)',
      desc: 'Máy chủ ảo hiệu năng cao với 100% NVMe SSD, cam kết uptime 99.99%. Sẵn sàng triển khai trong 60 giây.',
      price: '150.000đ',
      features: ['Toàn quyền quản trị (Root/Admin)', 'Băng thông không giới hạn', 'Tự động Snapshot hàng tuần', 'IP Tĩnh riêng biệt'],
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
      color: 'from-blue-500 to-cyan-500',
      bgIcon: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'cloud-storage',
      name: 'Cloud Storage',
      desc: 'Lưu trữ Object Storage an toàn, linh hoạt mở rộng dung lượng lên đến hàng ngàn Terabyte mà không gián đoạn.',
      price: '50.000đ',
      features: ['Cơ chế nhân bản 3 lớp (3-way replica)', 'Mã hóa dữ liệu AES-256', 'Tương thích chuẩn S3 API', 'Truy xuất tốc độ cao'],
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
      color: 'from-indigo-500 to-purple-500',
      bgIcon: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'cloud-security',
      name: 'Cloud Security',
      desc: 'Bảo vệ toàn diện hệ thống của bạn trước các cuộc tấn công DDoS và mã độc tống tiền (Ransomware).',
      price: '250.000đ',
      features: ['Tường lửa WAF đa lớp', 'Chống DDoS Layer 3/4/7', 'Quét lỗ hổng định kỳ', 'Cảnh báo xâm nhập theo thời gian thực'],
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      color: 'from-teal-500 to-emerald-500',
      bgIcon: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'cloud-database',
      name: 'Managed Database',
      desc: 'Cơ sở dữ liệu được tối ưu hóa sẵn, hỗ trợ MySQL, PostgreSQL, MongoDB. Chạy mượt mà, không lo cấu hình.',
      price: '300.000đ',
      features: ['Tự động Failover (Chuyển đổi dự phòng)', 'Backup tự động mỗi giờ', 'Mở rộng cấu hình không downtime', 'Tối ưu hóa query'],
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
      color: 'from-rose-500 to-orange-500',
      bgIcon: 'bg-rose-50 text-rose-600',
    }
  ];

  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-20 px-6 sm:px-8">
      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Hệ Sinh Thái <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dịch Vụ</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Xây dựng, mở rộng và bảo vệ ứng dụng của bạn với hạ tầng đám mây mạnh mẽ, tối ưu hóa chi phí cho mọi quy mô doanh nghiệp.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc) => (
          <div key={svc.id} className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 z-10 overflow-hidden flex flex-col h-full">
            
            {/* Hiệu ứng viền phát sáng khi hover */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${svc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="flex items-center gap-5 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${svc.bgIcon}`}>
                {svc.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{svc.name}</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Chỉ từ <span className="font-bold text-slate-900 text-lg">{svc.price}</span> / tháng
                </p>
              </div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
              {svc.desc}
            </p>

            <div className="space-y-3 mb-8">
              {svc.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-slate-600 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link href={`/dich-vu/${svc.id}`} className="mt-auto block w-full text-center py-4 rounded-xl bg-slate-50 text-slate-700 font-semibold border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
              Cấu hình ngay
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}