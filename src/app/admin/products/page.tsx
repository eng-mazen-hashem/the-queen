'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { addProduct } from '@/app/actions/admin';

const variantSchema = z.object({
  weight: z.string().min(1, 'الوزن مطلوب (مثال: 50g)'),
  price: z.number().min(0.01, 'السعر يجب أن يكون أكبر من 0'),
  stock: z.number().min(0, 'الكمية يجب أن تكون 0 أو أكثر'),
});

const productSchema = z.object({
  name: z.string().min(3, 'اسم المنتج يجب أن يحتوي على 3 أحرف على الأقل'),
  slug: z.string().min(3, 'الرابط (Slug) مطلوب'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  categoryId: z.string().min(1, 'يرجى اختيار التصنيف'),
  imageUrl: z.string().optional(),
  variants: z.array(variantSchema).min(1, 'يجب إضافة وزن واحد على الأقل للمنتج'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlPreview, setImageUrlPreview] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      imageUrl: '',
      variants: [{ weight: '', price: 0, stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'variants',
    control,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload?type=products', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setValue('imageUrl', data.url);
        setImageUrlPreview(data.url);
      } else {
        alert('فشل رفع الصورة');
      }
    } catch (error) {
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await addProduct(data);
      if (res.success) {
        alert('تمت إضافة المنتج بنجاح');
        setImageUrlPreview('');
        reset({
          name: '',
          slug: '',
          description: '',
          categoryId: '',
          imageUrl: '',
          variants: [{ weight: '', price: 0, stock: 0 }],
        });
      } else {
        alert(res.error || 'حدث خطأ أثناء حفظ المنتج');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoGenerateSlug = (val: string) => {
    setValue('name', val);
    const slugified = val
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0621-\u064A-]+/g, ''); // Allow letters, Arabic and dashes
    setValue('slug', slugified);
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-[var(--foreground)] font-medium">إضافة منتج جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-black/30 p-8 border border-[var(--border)] rounded-none shadow-sm space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">اسم المنتج</label>
            <input 
              required
              onChange={(e) => autoGenerateSlug(e.target.value)} 
              className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" 
              placeholder="مثال: يانسون بلدي" 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">الرابط الفريد (Slug)</label>
            <input 
              required
              {...register('slug')} 
              className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors font-mono text-left text-[var(--foreground)]" 
              placeholder="anise-baladi" 
              dir="ltr"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">صورة المنتج</label>
          <div className="border border-dashed border-[var(--border)] p-4 text-center cursor-pointer relative hover:border-[var(--accent)] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              disabled={isUploading}
            />
            {imageUrlPreview ? (
              <div className="relative w-full h-40">
                <img src={imageUrlPreview} alt="Product preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                  تغيير الصورة
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <ImageIcon className="text-[var(--secondary)]" size={32} />
                <span className="text-xs text-[var(--secondary)]">
                  {isUploading ? 'جاري الرفع...' : 'اسحب الصورة هنا أو اضغط للاختيار'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">وصف المنتج</label>
          <textarea 
            required
            {...register('description')} 
            rows={4}
            className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" 
            placeholder="وصف تفصيلي للمنتج وفوائده..." 
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">التصنيف</label>
          <select 
            required
            {...register('categoryId')}
            className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" 
          >
            <option value="" className="dark:bg-neutral-900">اختر التصنيف...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="dark:bg-neutral-900">
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Variants */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif text-[var(--foreground)] font-medium">خيارات الأوزان والأسعار</h3>
            <button 
              type="button" 
              onClick={() => append({ weight: '', price: 0, stock: 0 })}
              className="text-xs border border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] px-3 py-2 rounded-none flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> إضافة وزن
            </button>
          </div>
          
          {errors.variants?.root && <p className="text-red-500 text-xs mb-4">{errors.variants.root.message}</p>}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start bg-neutral-50 dark:bg-black/10 p-4 border border-[var(--border)] rounded-none">
                <div className="flex-1 w-full">
                  <label className="block text-xs text-[var(--secondary)] mb-1">الوزن</label>
                  <input 
                    required
                    {...register(`variants.${index}.weight` as const)} 
                    className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" 
                    placeholder="مثال: 50g" 
                    dir="ltr"
                  />
                  {errors.variants?.[index]?.weight && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.weight?.message}</p>}
                </div>
                
                <div className="flex-1 w-full">
                  <label className="block text-xs text-[var(--secondary)] mb-1">السعر (د.إ)</label>
                  <input 
                    required
                    type="number" step="0.01"
                    {...register(`variants.${index}.price` as const, { valueAsNumber: true })} 
                    className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)] font-mono text-left" 
                  />
                  {errors.variants?.[index]?.price && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.price?.message}</p>}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs text-[var(--secondary)] mb-1">الكمية المتوفرة</label>
                  <input 
                    required
                    type="number"
                    {...register(`variants.${index}.stock` as const, { valueAsNumber: true })} 
                    className="w-full border border-[var(--border)] bg-transparent rounded-none p-2 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)] font-mono text-left" 
                  />
                  {errors.variants?.[index]?.stock && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.stock?.message}</p>}
                </div>

                <div className="pt-6">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 p-2 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="border border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] font-medium py-3 px-8 rounded-none flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : (
              <>
                <Save size={18} />
                <span>حفظ المنتج</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
