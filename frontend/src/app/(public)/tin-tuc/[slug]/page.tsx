'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/public/news/${slug}`)
      .then(res => { if (res.data) setArticle(res.data); })
      .catch(() => { setArticle(null); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 flex justify-center">
        <div className="animate-pulse space-y-4 max-w-3xl w-full px-6">
          <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
          <div className="h-4 bg-slate-200 rounded-xl w-1/2" />
          <div className="h-64 bg-slate-200 rounded-2xl mt-8" />
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Bài viết không tồn tại</h1>
        <Link href="/tin-tuc" className="text-blue-600 font-semibold hover:underline">← Quay lại Tin tức</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8">
      <article className="max-w-3xl mx-auto">
        {/* Nút quay lại */}
        <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại Tin tức
        </Link>

        {/* Category + Ngày đăng */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-sm text-slate-400">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
              : ''}
          </span>
        </div>

        {/* Tiêu đề */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Tác giả */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {article.authorName?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{article.authorName}</p>
            <p className="text-xs text-slate-400">Tác giả</p>
          </div>
        </div>

        {/* Nội dung bài viết — Render HTML từ API */}
        <div
          className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-light
            prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA cuối bài */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">Bạn cần tư vấn giải pháp Cloud?</h3>
          <p className="text-slate-400 mb-6">Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7.</p>
          <Link href="/lien-he" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-blue-600/30">
            Liên hệ ngay
          </Link>
        </div>
      </article>
    </main>
  );
}
