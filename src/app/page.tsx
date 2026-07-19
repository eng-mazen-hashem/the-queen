import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import Link from 'next/link';

export const revalidate = 10; // ISR cache

export default async function Home() {
  const [products, categories, banners] = await Promise.all([
    prisma.product.findMany({
      include: {
        variants: {
          orderBy: { price: 'asc' }
        },
        category: true
      }
    }),
    prisma.category.findMany(),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
      <div>
        {/* Dynamic Hero Carousel */}
        <HeroCarousel banners={banners} />

        {/* Brand Showcase Intro */}
        <section className="relative overflow-hidden bg-[var(--background)] py-16 px-6 text-center isolate border-b border-[var(--border)]">
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-3 block">
              متجرنا الفاخر
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6 uppercase tracking-wide">
              عطارة الملكة
            </h1>
            <p className="text-base md:text-lg text-[var(--secondary)] max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              اكتشف تشكيلتنا الفاخرة من الأعشاب الطبية، البهارات الأصيلة، والزيوت الطبيعية المنتقاة بعناية لتعزيز صحتك وجمالك. نقدم الطبيعة في أبهى حلتها وأعلى مستويات الجودة.
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative z-20 border-b border-[var(--border)]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] tracking-wide mb-3">تسوق حسب الأقسام</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-4">اختر القسم الذي تفضله واستكشف خياراتنا</p>
            <div className="w-8 h-[1px] bg-[var(--border)] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="group relative h-80 bg-neutral-900 overflow-hidden border border-[var(--border)] cursor-pointer flex flex-col justify-end p-6"
              >
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/10 to-[var(--accent)]/5 group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="relative z-10 text-right">
                  <h3 className="text-2xl font-serif text-white mb-2 font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed mb-4">{category.description}</p>
                  )}
                  <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-medium border-b border-[var(--accent)] pb-1 inline-block">
                    استكشف المنتجات
                  </span>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-xs text-[var(--secondary)] col-span-full">لا توجد أقسام متوفرة حالياً.</p>
            )}
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] tracking-wide mb-3">المنتجات المختارة</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-4">أفضل ما جادت به الطبيعة من أجلك</p>
            <div className="w-8 h-[1px] bg-[var(--border)] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={{
                ...product,
                variants: product.variants.map(v => ({
                  id: v.id,
                  weight: v.weight,
                  price: Number(v.price)
                }))
              }} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12">
                لا توجد منتجات حالياً.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Premium Minimal Footer */}
      <footer className="border-t border-[var(--border)] py-16 px-6 bg-neutral-50 dark:bg-black/10" dir="rtl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
          <div>
            <h3 className="font-serif text-xl text-[var(--foreground)] font-medium mb-4">عطارة الملكة</h3>
            <p className="text-sm text-[var(--secondary)] font-light leading-relaxed max-w-sm mb-4">
              وجهتك الفاخرة والأولى لأجود أنواع البهارات والزيوت الطبيعية المعصورة على البارد والأعشاب النادرة المنتقاة بعناية.
            </p>
            <p className="text-xs text-[var(--accent)] font-medium">عضوية وطبيعية 100%</p>
          </div>
          
          <div>
            <h4 className="font-serif text-sm text-[var(--foreground)] uppercase tracking-wider mb-4 font-semibold">روابط سريعة</h4>
            <div className="flex flex-col gap-3 text-xs text-[var(--secondary)] font-light">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">الرئيسية</Link>
              <Link href="/checkout" className="hover:text-[var(--accent)] transition-colors">السلة والشراء</Link>
              <Link href="/admin/products" className="hover:text-[var(--accent)] transition-colors">لوحة التحكم للمسؤول</Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-sm text-[var(--foreground)] uppercase tracking-wider mb-4 font-semibold">سياسات المتجر</h4>
            <div className="flex flex-col gap-3 text-xs text-[var(--secondary)] font-light">
              <Link href="#" className="hover:text-[var(--accent)] transition-colors">سياسة الخصوصية</Link>
              <Link href="#" className="hover:text-[var(--accent)] transition-colors">الشروط والأحكام</Link>
              <Link href="#" className="hover:text-[var(--accent)] transition-colors">سياسة الاسترجاع والشحن</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[var(--border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--secondary)] font-light">
          <div>
            &copy; {new Date().getFullYear()} عطارة الملكة. جميع الحقوق محفوظة.
          </div>
          <div>
            شُيّد بحب وشغف للأصالة.
          </div>
        </div>
      </footer>
    </div>
  );
}
