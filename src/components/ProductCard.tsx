'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Plus, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

type Variant = {
  id: string;
  weight: string;
  price: number;
};

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    variants: Variant[];
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const { addItem, setIsOpen } = useCartStore();

  if (!selectedVariant) return null; // Safe guard if no variants

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: 1,
    });
    setIsOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-black/30 rounded-none p-6 border border-[var(--border)] hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
    >
      <div className="w-full h-56 bg-neutral-50 dark:bg-neutral-900 border-b border-[var(--border)] -mx-6 -mt-6 mb-6 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[var(--accent)]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Sprout size={48} className="text-[var(--accent)] opacity-40 group-hover:scale-110 transition-transform duration-500 stroke-[1.2]" />
      </div>

      <div className="flex-1 flex flex-col pt-2">
        <h3 className="text-lg md:text-xl font-serif text-[var(--foreground)] mb-2 font-medium">{product.name}</h3>
        <p className="text-xs text-[var(--secondary)] mb-6 line-clamp-2 leading-relaxed font-light tracking-wide">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                className={`px-3 py-1 text-xs font-light tracking-wider transition-all duration-300 ${
                  selectedVariant.id === variant.id
                    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)] font-medium'
                    : 'text-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
                dir="ltr"
              >
                {variant.weight}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-4">
            <div className="text-xl font-serif font-medium text-[var(--foreground)]">
              {selectedVariant.price.toFixed(2)} <span className="text-xs font-sans font-light text-[var(--secondary)]">د.إ</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full transition-all duration-300 transform active:scale-95 shadow-md shadow-emerald-600/10 cursor-pointer animate-none"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
