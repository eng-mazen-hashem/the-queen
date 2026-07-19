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
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--secondary)]/10 to-[var(--background)] pt-32 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight">
            عطارة الملكة
            <span className="block text-[var(--primary)] mt-4">جودة الطبيعة بين يديك</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed mt-6">
            اكتشف تشكيلتنا الفاخرة من الأعشاب الطبية، البهارات الأصيلة، والزيوت الطبيعية المنتقاة بعناية لتعزيز صحتك وجمالك.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">المنتجات المختارة</h2>
            <p className="text-gray-500 text-lg">أفضل ما جادت به الطبيعة من أجلك</p>
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
