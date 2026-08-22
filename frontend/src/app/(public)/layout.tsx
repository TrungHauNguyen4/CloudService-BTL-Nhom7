import Header from './Header';
import Footer from './Footer';
import AffiliateTracker from './AffiliateTracker';
import { Suspense } from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>
      <Header />
      {/* children chính là nội dung của các trang như page.tsx, dich-vu/page.tsx... */}
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}