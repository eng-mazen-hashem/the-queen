'use client';

import { useCartStore } from '@/store/cartStore';
import { createOrderAction } from '@/app/actions/checkout';
import { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { formatPrice, formatTotal } from '@/lib/formatters';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0 && !isPending) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between" dir="rtl">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <ShoppingBag size={64} className="text-[var(--secondary)] opacity-30 mb-4" />
          <h2 className="text-2xl font-serif text-[var(--foreground)] mb-4 font-medium">سلة المشتريات فارغة</h2>
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--accent)] font-medium hover:underline">
            <ArrowRight size={16} />
            <span>العودة للتسوق واكتشاف المنتجات</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between" dir="rtl">
      <div>
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-serif text-[var(--foreground)] mb-8 font-medium border-b border-[var(--border)] pb-4">إتمام عملية الشراء</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white dark:bg-black/30 p-8 border border-[var(--border)] rounded-none shadow-sm h-fit">
              <h2 className="text-xl font-serif text-[var(--foreground)] mb-6 font-medium border-b border-[var(--border)] pb-2">بيانات التوصيل</h2>
              <form action={async (formData) => {
                setIsPending(true);
                formData.append('cart', JSON.stringify(items));
                formData.append('totalAmount', getTotal().toString());
                
                try {
                  const res = await createOrderAction(formData);
                  if (res && 'error' in res) {
                    alert(res.error);
                    setIsPending(false);
                  } else if (res && 'success' in res && res.orderId) {
                    clearCart();
                    window.location.href = `/orders/${res.orderId}`;
                  } else {
                    alert('حدث خطأ غير متوقع');
                    setIsPending(false);
                  }
                } catch (e) {
                  alert('حدث خطأ أثناء معالجة طلبك.');
                  setIsPending(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">الاسم الكامل</label>
                  <input required name="name" className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" placeholder="أدخل اسمك الكريم" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">البريد الإلكتروني</label>
                  <input required type="email" name="email" className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" placeholder="example@email.com" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-1">العنوان بالتفصيل</label>
                  <textarea required name="address" rows={3} className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 outline-none focus:border-[var(--accent)] text-sm transition-colors text-[var(--foreground)]" placeholder="المدينة، الحي، الشارع، رقم المنزل"></textarea>
                </div>
                
                <button disabled={isPending} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-none mt-6 transition duration-300 disabled:opacity-50 font-medium text-sm shadow-md shadow-emerald-600/10 cursor-pointer">
                  {isPending ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 bg-white dark:bg-black/30 p-6 border border-[var(--border)] rounded-none shadow-sm h-fit">
              <h2 className="text-lg font-serif text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-2 font-medium">ملخص الطلب</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.name}</p>
                      <p className="text-xs text-[var(--secondary)] font-light mt-0.5">{item.weight} <span className="mx-1">×</span> {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg font-serif pt-2 font-semibold">
                <span className="text-[var(--foreground)]">الإجمالي المطلوب:</span>
                <span className="text-emerald-600 text-xl">{formatTotal(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
