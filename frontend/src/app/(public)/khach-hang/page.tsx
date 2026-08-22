import Link from 'next/link';

export default function CustomersPage() {
  const partners = ['TECHCORP', 'GlobalNet', 'DATASYNC', 'NEXUS', 'CloudX', 'FinTech VN', 'EduSoft', 'MediaHub'];

  const testimonials = [
    {
      name: 'Hoàng Trần',
      role: 'CTO, TechCorp Vietnam',
      content: 'Từ khi chuyển hệ thống ERP sang hạ tầng cloud này, tốc độ xử lý đã cải thiện rõ rệt. Đội ngũ support 24/7 phản hồi cực kỳ nhanh, giải quyết vấn đề chỉ trong vài phút.',
      initial: 'H',
      color: 'blue'
    },
    {
      name: 'Linh Nguyễn',
      role: 'Giám đốc E-commerce',
      content: 'Uptime 99.99% không phải là lời quảng cáo suông. Website thương mại điện tử của chúng tôi chưa từng gặp sự cố sập nguồn nào trong suốt mùa Sale lớn cuối năm vừa qua.',
      initial: 'L',
      color: 'teal'
    },
    {
      name: 'Minh Phạm',
      role: 'Founder, Startup SaaS',
      content: 'Giao diện quản lý (Dashboard) rất trực quan. Tôi không phải là một SysAdmin chuyên nghiệp nhưng vẫn có thể tự khởi tạo và cấu hình tường lửa bảo mật một cách dễ dàng.',
      initial: 'M',
      color: 'indigo'
    },
    {
      name: 'Tuấn Lê',
      role: 'Giám đốc Kỹ thuật, FinTech VN',
      content: 'Bảo mật dữ liệu là ưu tiên hàng đầu của chúng tôi. CloudService với tiêu chuẩn an toàn cao đã giúp chúng tôi vượt qua các đợt kiểm toán khắt khe nhất.',
      initial: 'T',
      color: 'emerald'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8 font-sans">
      {/* HEADER TITTLE */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-600 text-sm font-semibold mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          Hơn 5000+ Khách hàng tin dùng
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Đối Tác & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Khách Hàng</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light max-w-2xl mx-auto">
          Những doanh nghiệp hàng đầu đã tin tưởng chọn CloudService làm nền tảng cho sự phát triển bền vững của họ.
        </p>
      </div>

      {/* PARTNERS LOGO */}
      <section className="max-w-6xl mx-auto mb-32 bg-white rounded-[2rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">
          Các tập đoàn công nghệ lớn
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
          {partners.map((brand, i) => (
            <h3 key={i} className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter hover:text-blue-600 transition-colors cursor-pointer">
              {brand}
            </h3>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Khách hàng nói gì về chúng tôi?
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testi, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed font-light">
                "{testi.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-14 h-14 rounded-full bg-${testi.color}-100 text-${testi.color}-600 flex items-center justify-center font-bold text-xl`}>
                  {testi.initial}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testi.name}</h4>
                  <p className="text-sm text-slate-500">{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Sẵn sàng để tăng tốc doanh nghiệp?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">Gia nhập cùng 5000+ khách hàng khác và trải nghiệm dịch vụ Cloud hàng đầu Việt Nam ngay hôm nay.</p>
          <Link href="/dang-ky" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-600/30">
            Khởi tạo tài khoản miễn phí
          </Link>
        </div>
      </section>

    </main>
  );
}
