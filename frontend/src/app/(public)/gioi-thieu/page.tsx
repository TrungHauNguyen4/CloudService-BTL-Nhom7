import Link from 'next/link';

export default async function AboutPage() {
  // Dữ liệu các con số ấn tượng
  let stats = [
    { value: '50+', label: 'Trung tâm dữ liệu (Data Centers)' },
    { value: '99.99%', label: 'Cam kết Uptime SLA' },
    { value: '10,000+', label: 'Khách hàng doanh nghiệp' },
    { value: '100 Gbps', label: 'Băng thông mạng nội bộ' },
  ];

  try {
    const statRes = await fetch(`${process.env.API_URL || 'http://localhost:5023/api'}/public/stats`, { next: { revalidate: 60 } });
    if (statRes.ok) {
      const data = await statRes.json();
      stats = [
        { value: `${data.dataCenters}+`, label: 'Trung tâm dữ liệu (Data Centers)' },
        { value: data.uptimeSla, label: 'Cam kết Uptime SLA' },
        { value: `${data.totalCustomers}+`, label: 'Khách hàng doanh nghiệp' },
        { value: `${data.totalServices}+`, label: 'Dịch vụ đang vận hành' },
      ];
    }
  } catch (err) {
    console.error("Lỗi tải stats About:", err);
  }

  // Dữ liệu giá trị cốt lõi
  const coreValues = [
    {
      title: 'Hiệu năng đột phá',
      desc: 'Sử dụng 100% ổ cứng NVMe Gen4 và vi xử lý thế hệ mới nhất, đảm bảo độ trễ thấp nhất cho mọi tác vụ.',
      icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      color: 'blue'
    },
    {
      title: 'Bảo mật tuyệt đối',
      desc: 'Mô hình bảo mật Zero Trust kết hợp cùng hệ thống Anti-DDoS tự động phân tích hành vi bằng AI.',
      icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      color: 'emerald'
    },
    {
      title: 'Hỗ trợ tận tâm',
      desc: 'Đội ngũ chuyên gia Cloud túc trực 24/7/365, sẵn sàng can thiệp và xử lý sự cố trong thời gian tính bằng phút.',
      icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
      color: 'indigo'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. HERO SECTION (Giới thiệu Tầm nhìn) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-24 pb-32 px-6 sm:px-8">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-20 bg-blue-600 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">Về Chúng Tôi</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            Định hình lại cách thế giới <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300">
              Vận hành trên Đám mây
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
            Được thành lập với sứ mệnh dân chủ hóa hạ tầng đám mây. Chúng tôi cung cấp sức mạnh tính toán cấp doanh nghiệp với sự đơn giản tối đa, giúp các nhà phát triển và công ty tập trung hoàn toàn vào việc xây dựng sản phẩm cốt lõi.
          </p>
        </div>
      </section>

      {/* 2. STATS SECTION (Các con số ấn tượng) */}
      <section className="relative -mt-16 z-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-slate-100 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4">
                <p className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</p>
                <p className="text-slate-500 text-sm font-semibold tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STORY SECTION (Câu chuyện doanh nghiệp) */}
      <section className="py-24 px-6 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
              Hành trình từ một Startup đến <span className="text-blue-600">Hệ sinh thái Cloud toàn diện</span>
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-light">
              <p>
                Khởi nguồn từ một nhóm kỹ sư hệ thống đam mê mã nguồn mở, chúng tôi nhận ra rào cản quá lớn về chi phí và tính phức tạp khi các doanh nghiệp vừa và nhỏ muốn tiếp cận hạ tầng chuẩn quốc tế.
              </p>
              <p>
                Đó là lý do CloudService ra đời. Năm 2026 đánh dấu bước chuyển mình mạnh mẽ khi chúng tôi triển khai thành công kiến trúc mạng 100Gbps cùng hệ thống Data Center trải dài khắp khu vực Châu Á, đáp ứng những tiêu chuẩn khắt khe nhất về an toàn thông tin.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform -rotate-3 z-0"></div>
            <div className="relative z-10 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="aspect-video bg-slate-100 rounded-xl mb-6 overflow-hidden relative">
                <img src="/data-center.jpg" alt="Data Center" className="w-full h-full object-cover" />
              </div>
              <p className="italic text-slate-500 text-sm text-center">
                "Chúng tôi không chỉ bán Server, chúng tôi cung cấp sự yên tâm."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES SECTION (Giá trị cốt lõi) */}
      <section className="py-24 px-6 sm:px-8 bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-8 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-4">DNA của chúng tôi</h2>
            <p className="text-slate-400 text-lg">Ba nguyên tắc thiết kế cốt lõi chảy trong mọi dòng code và hệ thống máy chủ mà chúng tôi xây dựng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-slate-800/50 p-10 rounded-[2rem] border border-slate-700/50 backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
                <div className={`w-14 h-14 bg-${value.color}-500/20 text-${value.color}-400 rounded-2xl flex items-center justify-center mb-6 border border-${value.color}-500/30`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="pb-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Trải nghiệm sức mạnh thực sự</h2>
        <p className="text-slate-500 text-lg mb-10">
          Hãy là một phần trong mạng lưới hàng ngàn doanh nghiệp đang tăng trưởng vượt bậc nhờ hạ tầng của chúng tôi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dang-ky" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg shadow-blue-600/30 transform hover:-translate-y-1">
            Bắt đầu
          </Link>
          <Link href="/lien-he" className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold py-4 px-8 rounded-full transition-all">
            Gặp gỡ chuyên gia
          </Link>
        </div>
      </section>

    </main>
  );
}