import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Execute within a database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the order
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'DELIVERED') {
        throw new Error('Order is already delivered');
      }

      // 2. Mark order as DELIVERED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'DELIVERED' }
      });

      // 3. Calculate loyalty points (e.g., 1 point per 10 AED)
      const pointsToAward = Math.floor(Number(order.totalAmount) / 10);

      // 4. Award points to the user
      let newTotalPoints = 0;
      if (order.userId && pointsToAward > 0) {
        const updatedUser = await tx.user.update({
          where: { id: order.userId },
          data: {
            loyaltyPoints: {
              increment: pointsToAward
            }
          }
        });
        newTotalPoints = updatedUser.loyaltyPoints;
      }

      return { order: updatedOrder, pointsAwarded: pointsToAward, newTotalPoints };
    });

    return NextResponse.json({ success: true, ...result });

  } catch (error: any) {
    console.error('Error completing order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
