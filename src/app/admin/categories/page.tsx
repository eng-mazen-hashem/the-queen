'use client';

import { useState, useEffect } from 'react';
import { addCategory } from '@/app/actions/admin';
import { Plus, Tag, RefreshCw, Image as ImageIcon } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload?type=categories', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert('فشل رفع الصورة');
      }
    } catch (error) {
      alert('حدث خطأ أثناء الاتصال بالسيرفر لرفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await addCategory({ name, slug, description, imageUrl });
      if (res.success && res.category) {
        alert('تمت إضافة القسم بنجاح');
        setName('');
        setSlug('');
        setDescription('');
        setImageUrl('');
        fetchCategories();
      } else {
        alert(res.error || 'حدث خطأ أثناء الإضافة');
      }
    } catch (error) {
      alert('فشل حفظ البيانات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoGenerateSlug = (val: string) => {
    setName(val);
    const slugified = val
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0621-\u064A-]+/g, ''); // Allow letters, Arabic and dashes
    setSlug(slugified);
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-[var(--foreground)] font-medium">إدارة الأقسام</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form: Add Category */}
        <div className="md:col-span-1 bg-white dark:bg-black/30 p-6 border border-[var(--border)] rounded-none shadow-sm h-fit">
          <h2 className="text-lg font-serif text-[var(--foreground)] mb-4 font-medium">إضافة قسم جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">اسم القسم</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => autoGenerateSlug(e.target.value)}
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors"
                placeholder="مثال: زيوت عطرية"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">الرابط الفريد (Slug)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors font-mono"
                placeholder="essential-oils"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">صورة القسم (اختياري)</label>
              <div className="border border-dashed border-[var(--border)] p-4 text-center cursor-pointer relative hover:border-[var(--accent)] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isUploading}
                />
                {imageUrl ? (
                  <div className="relative w-full h-24">
                    <img src={imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] opacity-0 hover:opacity-100 transition-opacity">
                      تغيير الصورة
                    </div>
                  </div>
                ) : (
                  <div className="py-2 flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="text-[var(--secondary)]" size={24} />
                    <span className="text-[10px] text-[var(--secondary)]">
                      {isUploading ? 'جاري الرفع...' : 'اسحب الصورة هنا أو اضغط للاختيار'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">وصف القسم</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors"
                placeholder="وصف تفصيلي للقسم..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full border border-[var(--primary)] bg-[var(--primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] text-[var(--primary-foreground)] hover:text-white py-2.5 rounded-none text-sm font-medium transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'جاري الإضافة...' : 'حفظ القسم'}</span>
            </button>
          </form>
        </div>

        {/* List: Existing Categories */}
        <div className="md:col-span-2 bg-white dark:bg-black/30 p-6 border border-[var(--border)] rounded-none shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-serif text-[var(--foreground)] font-medium">الأقسام الحالية</h2>
            <button
              onClick={fetchCategories}
              className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors p-1"
              title="تحديث القائمة"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {isLoading && categories.length === 0 ? (
            <p className="text-sm text-[var(--secondary)] text-center py-8">جاري تحميل الأقسام...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-[var(--secondary)] text-center py-8">لا توجد أقسام مضافة بعد.</p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {categories.map((cat) => (
                <div key={cat.id} className="py-4 flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag size={14} className="text-[var(--accent)]" />
                      <h3 className="text-sm font-medium text-[var(--foreground)]">{cat.name}</h3>
                      <span className="text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-[var(--secondary)] px-2 py-0.5 rounded-none">
                        {cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[var(--secondary)] font-light leading-relaxed">{cat.description}</p>
                    )}
                  </div>
                  
                  {cat.imageUrl && (
                    <div className="w-16 h-12 bg-neutral-100 dark:bg-neutral-800 relative">
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
