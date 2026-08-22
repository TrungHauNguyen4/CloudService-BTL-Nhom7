'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';


// Ánh xạ từng Category sang một màu khác nhau
const categoryColors: Record<string, string> = {
  'Xu hướng': 'bg-purple-100 text-purple-700',
  'Hướng dẫn': 'bg-blue-100 text-blue-700',
  'Thông báo': 'bg-emerald-100 text-emerald-700',
  'So sánh': 'bg-amber-100 text-amber-700',
};

export default function NewsPage() {
    const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/public/news')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setArticles(res.data);
        } else if (res.data && res.data.items) {
           // If the API returns pagination { items: [...], totalItems: ... }
           setArticles(res.data.items);
        }
      })
      .catch((err) => { console.error("Lỗi tải tin tức", err); })
      .finally(() => setIsLoading(false));
  }, []);

  // Lọc bài viết theo thanh Tìm kiếm và nút Category
  const categories = ['Tất cả', ...new Set(articles.map(a => a.category))];
  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tất cả' || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-32 px-6 sm:px-8">
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Tin Tức & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Blog</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed font-light">
          Cập nhật xu hướng công nghệ, hướng dẫn kỹ thuật và các thông báo mới nhất từ CloudService.
        </p>
      </div>

      {/* THANH TÌM KIẾM + BỘ LỌC */}
      <div className="max-w-6xl mx-auto mb-12">
        {/* Ô tìm kiếm */}
        <div className="relative mb-8">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 shadow-sm"
          />
        </div>

        {/* Nút lọc Category */}
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(article => (
          <Link
            key={article.id}
            href={`/tin-tuc/${article.slug}`}
            className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Ảnh Thumbnail (placeholder) */}
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-800/5 group-hover:bg-slate-800/0 transition-colors" />
              <div className="absolute bottom-4 left-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || 'bg-slate-100 text-slate-600'}`}>
                  {article.category}
                </span>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {article.content}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <span className="font-semibold">{article.authorName}</span>
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Chưa xuất bản'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Nếu không tìm thấy bài viết nào */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">Không tìm thấy bài viết nào</p>
          <p className="text-sm mt-2">Thử thay đổi từ khóa hoặc bộ lọc danh mục.</p>
        </div>
      )}
    </main>
  );
}
