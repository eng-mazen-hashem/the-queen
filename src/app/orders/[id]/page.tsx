import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CheckCircle2, PackageCheck } from 'lucide-react';
import SimulateDeliveryButton from './SimulateDeliveryButton';
import Link from 'next/link';

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { variant: { include: { product: true } } } }, user: true }
  });

  if (!order) notFound();

  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
        
        {isDelivered ? (
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck size={48} />
          </div>
        ) : (
          <div className="w-24 h-24 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
        )}

        <h1 className="text-3xl font-extrabold mb-2 text-[var(--foreground)]">
          {isDelivered ? 'الطلب مكتمل وتم توصيله' : 'تم استلام طلبك بنجاح!'}
        </h1>
        <p className="text-gray-500 mb-8 font-mono bg-gray-100 inline-block px-4 py-1 rounded-full text-sm">رقم الطلب: {order.id}</p>

        <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-right border border-gray-100">
          <h2 className="font-bold mb-4 text-lg border-b pb-2">تفاصيل الطلب:</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.variant.product.name} <span className="text-gray-500">({item.variant.weight})</span> <span className="mx-1 text-gray-400">×</span> {item.quantity}</span>
                <span className="font-bold">{(Number(item.price) * item.quantity).toFixed(2)} د.إ</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>الإجمالي:</span>
            <span className="text-[var(--primary)]">{Number(order.totalAmount).toFixed(2)} د.إ</span>
          </div>
        </div>

        {/* Developer Sandbox for Loyalty Points */}
        {!isDelivered && (
          <div className="mt-8 p-6 border-2 border-dashed border-amber-200 bg-amber-50 rounded-2xl">
            <p className="text-sm text-amber-800 mb-4 leading-relaxed">
              <strong>خاصية للمطورين:</strong> اضغط أدناه لمحاكاة وصول الطلب إلى العميل. بمجرد التوصيل، سيقوم النظام تلقائياً بحساب <strong className="text-amber-600">نقاط الولاء</strong> وإضافتها لحسابك.
            </p>
            <SimulateDeliveryButton orderId={order.id} />
          </div>
        )}

        {isDelivered && (
          <div className="mt-8 p-6 border-2 border-emerald-100 bg-emerald-50 rounded-2xl text-emerald-800 flex flex-col items-center">
            <span className="text-4xl mb-2">💎</span>
            <h3 className="font-bold text-lg mb-1">مبروك! لقد كسبت نقاط ولاء</h3>
            <p className="text-sm">بفضل هذا الطلب، أصبح رصيدك الكلي من نقاط الولاء: <strong className="text-xl">{order.user.loyaltyPoints}</strong> نقطة.</p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-[var(--primary)] font-bold hover:underline">
            العودة للتسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
