import Image from 'next/image';

export default function PartnersPage() {
  const partners = [
    { name: "TechCorp Global", role: "Đối tác Hạ tầng Cloud", desc: "Cung cấp phần cứng và server tối tân.", bg: "from-blue-500 to-indigo-600" },
    { name: "SecurNet AI", role: "Đối tác Bảo mật", desc: "Hệ thống tường lửa và chống DDoS toàn diện.", bg: "from-purple-500 to-pink-600" },
    { name: "DataVortex", role: "Đối tác Lưu trữ", desc: "Giải pháp Big Data và Backup tự động.", bg: "from-cyan-500 to-blue-600" },
    { name: "Cloudify VN", role: "Đối tác Phân phối", desc: "Mạng lưới dịch vụ rộng khắp cả nước.", bg: "from-emerald-500 to-teal-600" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 py-16 px-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
          Mạng lưới toàn cầu
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-6">
          Đối Tác <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Chiến Lược</span>
        </h1>
        <p className="text-lg text-gray-600">
          Chúng tôi hợp tác với các tập đoàn công nghệ hàng đầu thế giới để mang đến chất lượng dịch vụ ổn định và an toàn nhất cho khách hàng.
        </p>
      </div>

      {/* Grid Danh sách đối tác */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {partners.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col justify-between"
          >
            {/* Hiệu ứng màu nền chạy nhẹ khi hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                  {item.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm mb-3">{item.role}</p>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Hợp tác từ 2024</span>
              <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Xem chi tiết &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Trở thành đối tác của CloudService?</h3>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Cùng chúng tôi mở rộng hệ sinh thái điện toán đám mây và mang lại giá trị vượt trội cho hàng ngàn doanh nghiệp.
          </p>
          <button className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-0.5">
            Đăng ký hợp tác ngay
          </button>
        </div>
      </div>
    </main>
  );
}