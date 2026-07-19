import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const revalidate = 10; // ISR cache

export default async function Home() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { price: 'asc' }
      },
      category: true
    }
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Premium Liquid Glass Hero Section */}
      <section className="relative overflow-hidden bg-[var(--background)] pt-20 pb-20 px-6 text-center isolate">
        {/* Animated Fluid Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[var(--accent)]/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-[var(--secondary)]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 p-8 md:p-12 border-y border-[var(--border)] mt-12">
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] mb-4 tracking-tight leading-tight uppercase font-medium">
            عطارة الملكة
          </h1>
          <div className="w-12 h-[1px] bg-[var(--accent)] mx-auto my-6" />
          <p className="text-xl md:text-2xl font-serif text-[var(--accent)] italic mb-6">
            جودة الطبيعة بين يديك
          </p>
          <p className="text-base md:text-lg text-[var(--secondary)] max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            اكتشف تشكيلتنا الفاخرة من الأعشاب الطبية، البهارات الأصيلة، والزيوت الطبيعية المنتقاة بعناية لتعزيز صحتك وجمالك.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] tracking-wide mb-3">المنتجات المختارة</h2>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-4">أفضل ما جادت به الطبيعة من أجلك</p>
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
  );
}
