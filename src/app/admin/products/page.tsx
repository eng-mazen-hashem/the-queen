'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Save } from 'lucide-react';
import { useState } from 'react';

const variantSchema = z.object({
  weight: z.string().min(1, 'الوزن مطلوب (مثال: 50g)'),
  price: z.coerce.number().min(0.01, 'السعر يجب أن يكون أكبر من 0'),
  stock: z.coerce.number().min(0, 'الكمية يجب أن تكون 0 أو أكثر'),
});

const productSchema = z.object({
  name: z.string().min(3, 'اسم المنتج يجب أن يحتوي على 3 أحرف على الأقل'),
  slug: z.string().min(3, 'الرابط (Slug) مطلوب'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  categoryId: z.string().min(1, 'يرجى اختيار التصنيف'),
  variants: z.array(variantSchema).min(1, 'يجب إضافة وزن واحد على الأقل للمنتج'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProductsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      variants: [{ weight: '', price: 0, stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'variants',
    control,
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real scenario, we'd POST this to our API route to save to Prisma
      console.log('Product submitted:', data);
      alert('تمت إضافة المنتج بنجاح (Simulation)');
      reset();
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">إضافة منتج جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">اسم المنتج</label>
            <input 
              {...register('name')} 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800" 
              placeholder="مثال: يانسون بلدي" 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">الرابط (Slug)</label>
            <input 
              {...register('slug')} 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800" 
              placeholder="مثال: anise-baladi" 
              dir="ltr"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">الوصف</label>
          <textarea 
            {...register('description')} 
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800" 
            placeholder="وصف تفصيلي للمنتج وفوائده..." 
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">التصنيف</label>
          <select 
            {...register('categoryId')}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800" 
          >
            <option value="">اختر التصنيف...</option>
            <option value="herbs">أعشاب طبية</option>
            <option value="spices">بهارات طبخ</option>
            <option value="oils">زيوت طبيعية</option>
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Variants */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">الأوزان والأسعار (Variants)</h3>
            <button 
              type="button" 
              onClick={() => append({ weight: '', price: 0, stock: 0 })}
              className="text-sm bg-[var(--primary)] text-white px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-[var(--primary)]/90 transition-colors"
            >
              <Plus size={16} /> إضافة وزن
            </button>
          </div>
          
          {errors.variants?.root && <p className="text-red-500 text-sm mb-4">{errors.variants.root.message}</p>}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1 text-gray-600">الوزن</label>
                  <input 
                    {...register(`variants.${index}.weight` as const)} 
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800 text-sm" 
                    placeholder="50g" 
                    dir="ltr"
                  />
                  {errors.variants?.[index]?.weight && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.weight?.message}</p>}
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1 text-gray-600">السعر (د.إ)</label>
                  <input 
                    type="number" step="0.01"
                    {...register(`variants.${index}.price` as const)} 
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800 text-sm" 
                  />
                  {errors.variants?.[index]?.price && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.price?.message}</p>}
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1 text-gray-600">الكمية المتوفرة</label>
                  <input 
                    type="number"
                    {...register(`variants.${index}.stock` as const)} 
                    className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-800 text-sm" 
                  />
                  {errors.variants?.[index]?.stock && <p className="text-red-500 text-xs mt-1">{errors.variants[index]?.stock?.message}</p>}
                </div>

                <div className="pt-6">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[var(--accent)] hover:bg-[var(--secondary)] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : (
              <>
                <Save size={20} />
                <span>حفظ المنتج</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
