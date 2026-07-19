'use client';

import { useState, useEffect } from 'react';
import { addBanner, toggleBanner, deleteBanner } from '@/app/actions/admin';
import { Plus, Trash2, Power, PowerOff, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';

type Banner = {
  id: string;
  imageUrl: string;
  link: string | null;
  title: string | null;
  isActive: boolean;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload?type=banners', {
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
    if (!imageUrl) {
      alert('يرجى رفع صورة أولاً');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addBanner({ imageUrl, title, link });
      if (res.success) {
        alert('تم حفظ البنر الإعلاني بنجاح');
        setTitle('');
        setLink('');
        setImageUrl('');
        fetchBanners();
      } else {
        alert(res.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      alert('فشل حفظ البيانات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleBanner(id, !currentStatus);
      if (res.success) {
        fetchBanners();
      } else {
        alert('فشل تعديل حالة البنر');
      }
    } catch (error) {
      alert('حدث خطأ أثناء تعديل الحالة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البنر؟')) return;
    try {
      const res = await deleteBanner(id);
      if (res.success) {
        fetchBanners();
      } else {
        alert('فشل حذف البنر');
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف البنر');
    }
  };

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-[var(--foreground)] font-medium">إدارة البنرات الإعلانية</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form: Add Banner */}
        <div className="lg:col-span-1 bg-white dark:bg-black/30 p-6 border border-[var(--border)] rounded-none shadow-sm h-fit">
          <h2 className="text-lg font-serif text-[var(--foreground)] mb-4 font-medium">إضافة بنر جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">عنوان البنر (اختياري)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors"
                placeholder="مثال: خصومات الصيف"
              />
            </div>

            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">صورة البنر</label>
              <div className="border border-dashed border-[var(--border)] p-4 text-center cursor-pointer relative hover:border-[var(--accent)] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isUploading}
                />
                {imageUrl ? (
                  <div className="relative w-full h-32">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                      تغيير الصورة
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="text-[var(--secondary)]" size={32} />
                    <span className="text-xs text-[var(--secondary)]">
                      {isUploading ? 'جاري الرفع...' : 'اسحب الصورة هنا أو اضغط للاختيار'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[var(--secondary)] font-medium mb-1">رابط التوجيه (اختياري)</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors font-mono text-left"
                placeholder="/products/category-id"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading || !imageUrl}
              className="w-full border border-[var(--primary)] bg-[var(--primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] text-[var(--primary-foreground)] hover:text-white py-2.5 rounded-none text-sm font-medium transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ البنر الإعلاني'}</span>
            </button>
          </form>
        </div>

        {/* List: Existing Banners */}
        <div className="lg:col-span-2 bg-white dark:bg-black/30 p-6 border border-[var(--border)] rounded-none shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-serif text-[var(--foreground)] font-medium">البنرات الحالية</h2>
            <button
              onClick={fetchBanners}
              className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors p-1"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {isLoading && banners.length === 0 ? (
            <p className="text-sm text-[var(--secondary)] text-center py-8">جاري تحميل البنرات...</p>
          ) : banners.length === 0 ? (
            <p className="text-sm text-[var(--secondary)] text-center py-8">لا توجد بنرات إعلانية مضافة بعد.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="border border-[var(--border)] p-4 flex flex-col gap-3 relative">
                  <div className="w-full h-36 bg-neutral-100 dark:bg-neutral-800 relative">
                    <img src={banner.imageUrl} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium ${
                      banner.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {banner.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
                      {banner.title || <span className="text-[var(--secondary)] italic text-xs">بدون عنوان</span>}
                    </h3>
                    {banner.link && (
                      <p className="text-xs text-[var(--secondary)] flex items-center gap-1 font-mono" dir="ltr">
                        <LinkIcon size={12} />
                        <span>{banner.link}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between border-t border-[var(--border)] pt-3">
                    <button
                      onClick={() => handleToggle(banner.id, banner.isActive)}
                      className={`text-xs flex items-center gap-1 transition-colors ${
                        banner.isActive ? 'text-red-500 hover:text-red-700' : 'text-emerald-500 hover:text-emerald-700'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <PowerOff size={14} />
                          <span>تعطيل</span>
                        </>
                      ) : (
                        <>
                          <Power size={14} />
                          <span>تفعيل</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
