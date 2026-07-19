'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'QueenAdmin2026';

export async function adminLogin(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  return { success: false, error: 'كلمة المرور غير صحيحة' };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

export async function addCategory(data: { name: string; slug: string; description?: string }) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
      },
    });
    revalidatePath('/');
    return { success: true, category };
  } catch (error: any) {
    console.error('Failed to add category:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حفظ القسم' };
  }
}

export async function addProduct(data: {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  variants: { weight: string; price: number; stock: number }[];
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        variants: {
          create: data.variants.map((v) => ({
            weight: v.weight,
            price: v.price,
            stock: v.stock,
          })),
        },
      },
      include: {
        variants: true,
      },
    });
    revalidatePath('/');
    return { success: true, product };
  } catch (error: any) {
    console.error('Failed to add product:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حفظ المنتج' };
  }
}
