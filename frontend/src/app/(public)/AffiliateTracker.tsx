'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      // Lưu cookie trong 30 ngày
      Cookies.set('affiliate_ref', ref, { expires: 30, path: '/' });
    }
  }, [searchParams]);

  return null; // Component không hiển thị gì cả
}
