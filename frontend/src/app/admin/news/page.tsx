'use client';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function NewsAdminPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Bắt đầu viết nội dung tại đây...</p>',
  });

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground">Viết Bài Mới</h2>
          <div className="space-x-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-muted-foreground font-bold hover:bg-muted rounded-lg">Hủy</button>
            <button onClick={() => alert("Đã lưu!")} className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow">Lưu Bài</button>
          </div>
        </div>
        
        <input 
          type="text" placeholder="Tiêu đề bài viết..." value={title} onChange={e => setTitle(e.target.value)}
          className="w-full text-3xl font-black bg-transparent border-none outline-none mb-6 text-foreground placeholder-muted-foreground"
        />

        {/* Thanh công cụ TipTap */}
        <div className="flex gap-2 mb-4 bg-muted/50 p-2 rounded-lg border border-border">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`px-3 py-1 rounded font-bold text-foreground ${editor?.isActive('bold') ? 'bg-muted' : ''}`}>B</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`px-3 py-1 rounded italic text-foreground ${editor?.isActive('italic') ? 'bg-muted' : ''}`}>I</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-1 rounded font-bold text-foreground">H2</button>
        </div>

        {/* Khu vực soạn thảo */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <EditorContent editor={editor} className="min-h-[400px] focus:outline-none" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Quản lý Tin Tức</h1>
        <button onClick={() => setIsEditing(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow">
          + Viết Bài Mới
        </button>
      </div>
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center text-muted-foreground">
        Chưa có bài viết nào. Hãy bấm "Viết Bài Mới" để bắt đầu.
      </div>
    </div>
  );
}
