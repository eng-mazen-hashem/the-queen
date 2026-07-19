'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createOrderAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const cartData = JSON.parse(formData.get('cart') as string);
  const totalAmount = Number(formData.get('totalAmount'));

  if (!name || !email || !cartData || cartData.length === 0) {
    throw new Error('بيانات غير مكتملة');
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { name, email, role: 'CUSTOMER' }
    });
  }

  // Create Order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      status: 'PENDING',
      items: {
        create: cartData.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  redirect(`/orders/${order.id}`);
}
