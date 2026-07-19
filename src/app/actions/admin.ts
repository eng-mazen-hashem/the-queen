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

export async function addCategory(data: { name: string; slug: string; description?: string; imageUrl?: string }) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
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
  imageUrl?: string;
  variants: { weight: string; price: number; stock: number }[];
}) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || '',
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

export async function addBanner(data: { imageUrl: string; link?: string; title?: string; isActive?: boolean }) {
  try {
    const banner = await prisma.banner.create({
      data: {
        imageUrl: data.imageUrl,
        link: data.link || '',
        title: data.title || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: any) {
    console.error('Failed to add banner:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حفظ البنر' };
  }
}

export async function toggleBanner(id: string, isActive: boolean) {
  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/');
    return { success: true, banner };
  } catch (error: any) {
    console.error('Failed to toggle banner:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء تعديل حالة البنر' };
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete banner:', error);
    return { success: false, error: error.message || 'حدث خطأ أثناء حذف البنر' };
  }
}
