'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift } from 'lucide-react';

export default function SimulateDeliveryButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const simulate = async () => {
    setLoading(true);
    const res = await fetch('/api/orders/complete', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      alert('تم التوصيل بنجاح وتمت إضافة نقاط الولاء لحسابك!');
      router.refresh();
    } else {
      alert('حدث خطأ');
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={simulate} 
      disabled={loading} 
      className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2 mx-auto transition-transform active:scale-95"
    >
      <Gift size={20} />
      {loading ? 'جاري المحاكاة...' : 'محاكاة توصيل الطلب لكسب النقاط'}
    </button>
  );
}
