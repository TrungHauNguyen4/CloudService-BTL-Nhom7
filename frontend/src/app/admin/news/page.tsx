'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axios';

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Chung');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Bắt đầu viết nội dung tại đây...</p>',
  });

  const fetchArticles = async () => {
    try {
      const res = await apiClient.get('/admin/news');
      setArticles(res.data);
    } catch (error) {
      console.error("Lỗi tải tin tức:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateNew = () => {
    setCurrentId(null);
    setTitle('');
    setCategory('Chung');
    setIsPublished(true);
    editor?.commands.setContent('<p>Bắt đầu viết nội dung tại đây...</p>');
    setIsEditing(true);
  };

  const handleEdit = (article: any) => {
    setCurrentId(article.id);
    setTitle(article.title);
    setCategory(article.category || 'Chung');
    setIsPublished(article.isPublished);
    editor?.commands.setContent(article.content);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await apiClient.delete(`/admin/news/${id}`);
      fetchArticles();
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);
      alert("Xóa thất bại!");
    }
  };

  const handleSave = async () => {
    if (!title) return alert("Vui lòng nhập tiêu đề!");
    setSaving(true);
    try {
      const payload = {
        title,
        content: editor?.getHTML() || '',
        category,
        isPublished
      };

      if (currentId) {
        await apiClient.put(`/admin/news/${currentId}`, payload);
      } else {
        await apiClient.post('/admin/news', payload);
      }
      setIsEditing(false);
      fetchArticles();
    } catch (error) {
      console.error("Lỗi lưu bài viết:", error);
      alert("Lưu thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">
            {currentId ? 'Sửa Bài Viết' : 'Viết Bài Mới'}
          </h2>
          <div className="space-x-3 flex items-center">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-muted-foreground font-bold hover:bg-muted rounded-lg">Hủy</button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Lưu Bài
            </button>
          </div>
        </div>
        
        <input 
          type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl font-black bg-transparent border-none outline-none mb-6 text-foreground placeholder-muted-foreground"
        />

        <div className="flex gap-4 mb-6">
          <input 
            type="text" placeholder="Danh mục (VD: Thông báo, Hướng dẫn)" value={category} onChange={e => setCategory(e.target.value)}
            className="flex-1 px-4 py-2 bg-muted/50 rounded-lg border border-border text-sm outline-none focus:border-primary"
          />
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 accent-primary" />
            Công khai (Published)
          </label>
        </div>

        {/* Thanh công cụ TipTap */}
        <div className="flex gap-2 mb-4 bg-muted/50 p-2 rounded-lg border border-border">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded font-bold text-foreground ${editor?.isActive('bold') ? 'bg-muted' : ''}`}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded italic text-foreground ${editor?.isActive('italic') ? 'bg-muted' : ''}`}>I</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-1 rounded font-bold text-foreground">H2</button>
        </div>

        {/* Khu vực soạn thảo */}
        <div className="prose prose-slate dark:prose-invert max-w-none border border-border rounded-lg p-4 min-h-[400px]">
          <EditorContent editor={editor} className="focus:outline-none" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Quản lý Tin Tức</h1>
        <button onClick={handleCreateNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow transition-transform hover:scale-105">
          <Plus className="w-4 h-4" /> Viết Bài Mới
        </button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Tiêu Đề</th>
              <th className="px-6 py-4 font-medium">Danh Mục</th>
              <th className="px-6 py-4 font-medium">Tác Giả</th>
              <th className="px-6 py-4 font-medium">Trạng Thái</th>
              <th className="px-6 py-4 font-medium">Ngày Tạo</th>
              <th className="px-6 py-4 font-medium text-right">Tác Vụ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  Chưa có bài viết nào. Hãy bấm "Viết Bài Mới" để bắt đầu.
                </td>
              </tr>
            ) : (
              articles.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{item.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.authorName}</td>
                  <td className="px-6 py-4">
                    {item.isPublished 
                      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-500">Đã đăng</span>
                      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">Bản nháp</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
