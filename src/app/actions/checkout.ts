'use server';

import prisma from '@/lib/prisma';

export async function createOrderAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const cartData = JSON.parse(formData.get('cart') as string);
  const totalAmount = Number(formData.get('totalAmount'));

  if (!name || !email || !cartData || cartData.length === 0) {
    return { error: 'بيانات غير مكتملة' };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Find or create user
      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        user = await tx.user.create({
          data: { name, email, role: 'CUSTOMER' }
        });
      }

      // 2. Validate and decrement stock for each item in the cart
      for (const item of cartData) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) {
          throw new Error('أحد المنتجات المطلوبة لم يعد متوفراً في المتجر.');
        }

        if (variant.stock < item.quantity) {
          throw new Error(
            `عذراً، الكمية المطلوبة من "${variant.product.name} (${variant.weight})" غير متوفرة. المتاح حالياً: ${variant.stock}`
          );
        }

        // Decrement stock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 3. Create the order with all its items
      return await tx.order.create({
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
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return { error: error.message || 'حدث خطأ غير متوقع أثناء معالجة طلبك.' };
  }
}

