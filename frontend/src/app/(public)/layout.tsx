import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* children chính là nội dung của các trang như page.tsx, dich-vu/page.tsx... */}
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}