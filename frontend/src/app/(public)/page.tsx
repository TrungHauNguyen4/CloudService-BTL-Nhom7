import Link from 'next/link';

export default async function PublicHomePage() {
  // Dữ liệu tĩnh được đưa vào mảng giúp file gọn gàng và siêu dễ bảo trì
  const stats = [
    { label: 'Cam kết Uptime', value: '99.99%', suffix: '' },
    { label: 'Khách hàng tin dùng', value: '5,000', suffix: '+' },
    { label: 'Hỗ trợ kỹ thuật', value: '24/7', suffix: '' },
    { label: 'Băng thông tối đa', value: '10', suffix: ' Gbps' },
  ];

    let categories = [];
  try {
    const res = await fetch("http://localhost:5023/api/service-categories", { next: { revalidate: 60 } });
    if (res.ok) {
      categories = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  const getCategoryColor = (slug: string) => {
    const colors: any = { vps: 'blue', hosting: 'indigo', domain: 'teal' };
    return colors[slug] || 'blue';
  };

  const getCategoryIcon = (slug: string) => {
    if (slug === 'hosting') return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
    if (slug === 'domain') return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
  };

  const services = categories.length > 0 
    ? categories.map((c: any) => ({
        title: c.name,
        desc: c.description || 'Giải pháp hạ tầng mạnh mẽ',
        icon: getCategoryIcon(c.slug),
        color: getCategoryColor(c.slug)
      }))
    : [
        {
          title: 'Cloud Server',
          desc: 'Máy chủ ảo với vi xử lý thế hệ mới nhất, cấp phát tức thì, toàn quyền quản trị root/administrator.',
          icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
          color: 'blue'
        },
        {
          title: 'Cloud Storage',
          desc: 'Lưu trữ Object Storage linh hoạt. Đảm bảo an toàn dữ liệu với cơ chế nhân bản 3 lớp (3-way replica).',
          icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
          color: 'indigo'
        },
        {
          title: 'Cloud Security',
          desc: 'Bảo vệ toàn diện với Web Application Firewall (WAF), chống DDoS tự động nhận diện rủi ro.',
          icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
          color: 'teal'
        }
      ];

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
      color: 'teal',
      offset: true
    },
    {
      name: 'Minh Phạm',
      role: 'Founder, Startup SaaS',
      content: 'Giao diện quản lý (Dashboard) rất trực quan. Tôi không phải là một SysAdmin chuyên nghiệp nhưng vẫn có thể tự khởi tạo và cấu hình tường lửa bảo mật một cách dễ dàng.',
      initial: 'M',
      color: 'indigo'
    }
  ];

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white font-sans">
      
      {/* 1. HERO SECTION (Nâng cấp giao diện tinh tế hơn) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-40 px-6 sm:px-8">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 bg-blue-600 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-medium mb-8 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Hạ tầng đám mây thế hệ mới 2026
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Kiến tạo tương lai với <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-300 drop-shadow-sm">
                Cloud Hàng Đầu
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Giải pháp máy chủ ảo, lưu trữ và bảo mật đám mây với hiệu năng vượt trội, thời gian hoạt động 99.99%. Sẵn sàng mở rộng cùng doanh nghiệp của bạn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dang-ky" className="group relative inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                <span className="relative flex items-center gap-2">
                  Bắt đầu dùng thử miễn phí
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </Link>
              <Link href="/dich-vu" className="inline-flex items-center justify-center bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all backdrop-blur-sm">
                Bảng giá & Dịch vụ
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-full">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2.5rem] blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-[#0B1121]/90 border border-slate-700/60 rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex space-x-2.5">
                  <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm"></div>
                  <div className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow-sm"></div>
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-sm"></div>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-800/80 px-3 py-1 rounded-md">server-status.sh</div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-400">vCPU Performance</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                    Optimal
                  </span>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-400">DDoS Protection</span>
                  <span className="text-cyan-400 font-semibold">Active Layer 7</span>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                  <span className="text-slate-400">Storage Speed</span>
                  <span className="text-purple-400 font-semibold">NVMe Gen4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Được render từ mảng dữ liệu) */}
      <section className="relative -mt-20 z-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100 text-center">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="p-4">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-2">
                  {stat.value}<span className="text-2xl md:text-3xl">{stat.suffix}</span>
                </p>
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY LOGOS */}
      <section className="pt-24 pb-16 px-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">
          Được tin tưởng bởi các doanh nghiệp công nghệ hàng đầu
        </p>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {['TECHCORP', 'GlobalNet', 'DATASYNC', 'NEXUS', 'CloudX'].map((brand, i) => (
            <h3 key={i} className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter opacity-80 hover:opacity-100 hover:text-blue-600 transition-colors cursor-pointer">
              {brand}
            </h3>
          ))}
        </div>
      </section>

      {/* 4. SERVICES SECTION (Render qua Map) */}
      <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Hệ Sinh Thái Đám Mây Toàn Diện
          </h2>
          <p className="text-slate-500 text-lg md:text-xl">
            Khám phá các giải pháp hạ tầng được thiết kế riêng biệt để tối ưu hóa hiệu suất, chi phí và bảo mật cho doanh nghiệp của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv: any, idx: number) => (
            <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-${srv.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`w-16 h-16 bg-${srv.color}-50 text-${srv.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-${srv.color}-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
                {srv.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{srv.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                {srv.desc}
              </p>
              <div className={`inline-flex items-center text-${srv.color}-600 font-bold group-hover:translate-x-2 transition-transform cursor-pointer`}>
                Tìm hiểu thêm <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION (Render qua Map) */}
      <section className="py-24 px-6 sm:px-8 bg-slate-900 text-white rounded-t-[3rem] mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Đánh Giá Từ Khách Hàng
            </h2>
            <p className="text-slate-400 text-lg md:text-xl">Hàng ngàn doanh nghiệp đã tin tưởng chuyển đổi số cùng chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi: any, idx: number) => (
              <div key={idx} className={`bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-700/50 backdrop-blur-sm ${testi.offset ? 'md:-translate-y-6' : ''}`}>
                <div className="flex gap-1 mb-8 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-10 text-lg leading-relaxed font-light">
                  "{testi.content}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-14 h-14 rounded-full bg-${testi.color}-500/20 text-${testi.color}-400 flex items-center justify-center font-bold text-xl border border-${testi.color}-500/30`}>
                    {testi.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{testi.name}</h4>
                    <p className="text-sm text-slate-400">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </main>
  );
}