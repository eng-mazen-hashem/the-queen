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
      <section className="relative overflow-hidden bg-[var(--background)] pt-24 pb-32 px-6 text-center isolate">
        {/* Animated Fluid Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[var(--accent)]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-[var(--secondary)]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-[var(--primary)]/5 rounded-t-full blur-[60px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 backdrop-blur-md bg-white/40 dark:bg-black/20 border border-white/30 dark:border-white/10 p-10 md:p-16 rounded-3xl shadow-2xl mt-12">
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] mb-6 tracking-tight leading-tight">
            عطارة الملكة
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-amber-700 mt-4 italic font-medium">جودة الطبيعة بين يديك</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--secondary)] max-w-2xl mx-auto leading-relaxed mt-6 font-light">
            اكتشف تشكيلتنا الفاخرة من الأعشاب الطبية، البهارات الأصيلة، والزيوت الطبيعية المنتقاة بعناية لتعزيز صحتك وجمالك.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-20">
        <div className="flex justify-center items-end mb-16">
          <div className="text-center w-full">
            <h2 className="text-4xl font-serif text-[var(--foreground)] mb-4">المنتجات المختارة</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto mb-6" />
            <p className="text-[var(--secondary)] text-lg font-light">أفضل ما جادت به الطبيعة من أجلك</p>
          </div>
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
