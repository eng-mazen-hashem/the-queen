'use client';

import { useCartStore } from '@/store/cartStore';
import { createOrderAction } from '@/app/actions/checkout';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0 && !isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--background)]">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">سلتك فارغة</h2>
        <Link href="/" className="text-[var(--primary)] font-bold hover:underline">العودة للتسوق</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">بيانات التوصيل</h2>
            <form action={(formData) => {
              setIsPending(true);
              formData.append('cart', JSON.stringify(items));
              formData.append('totalAmount', getTotal().toString());
              createOrderAction(formData).then(() => {
                clearCart();
              }).catch(e => {
                alert('حدث خطأ');
                setIsPending(false);
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                <input required name="name" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="أدخل اسمك الكريم" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
                <input required type="email" name="email" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="example@email.com" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">العنوان بالتفصيل</label>
                <textarea required name="address" rows={3} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="المدينة، الحي، الشارع، رقم المبنى"></textarea>
              </div>
              
              <button disabled={isPending} type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg mt-6 hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg shadow-emerald-600/20">
                {isPending ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">ملخص الطلب</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div>
                    <p className="font-bold text-[var(--foreground)]">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.weight} <span className="mx-1">×</span> {item.quantity}</p>
                  </div>
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} د.إ</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xl font-bold pt-2">
              <span>الإجمالي المطلوب:</span>
              <span className="text-[var(--primary)] text-2xl">{getTotal().toFixed(2)} د.إ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
