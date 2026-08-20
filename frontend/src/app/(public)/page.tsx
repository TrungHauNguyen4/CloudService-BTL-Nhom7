export default function PublicHomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Phần giới thiệu nổi bật */}
      <section className="bg-blue-50 py-20 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
          Nền tảng Cloud Service hàng đầu
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Cung cấp các giải pháp máy chủ, lưu trữ và bảo mật đám mây với hiệu suất cao, giúp doanh nghiệp của bạn bứt phá.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
          Đăng ký dùng thử
        </button>
      </section>

      {/* Services Section - Các dịch vụ chính */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Dịch vụ của chúng tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Dịch vụ 1 */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Cloud Server (VPS)</h3>
            <p className="text-gray-600">Máy chủ ảo với hiệu năng mạnh mẽ, dễ dàng mở rộng theo nhu cầu thực tế.</p>
          </div>
          {/* Card Dịch vụ 2 */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Cloud Storage</h3>
            <p className="text-gray-600">Lưu trữ dữ liệu an toàn, bảo mật cao và truy xuất dữ liệu cực kỳ nhanh chóng.</p>
          </div>
          {/* Card Dịch vụ 3 */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Cloud Security</h3>
            <p className="text-gray-600">Hệ thống tường lửa và bảo mật nhiều lớp, chống lại mọi cuộc tấn công mạng.</p>
          </div>
        </div>
      </section>
    </main>
  );
}