'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Plus } from 'lucide-react';
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
      className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-[var(--secondary)]/10 hover:border-[var(--accent)]/50 hover:shadow-2xl transition-all duration-500 flex flex-col group cursor-pointer"
    >
      <div className="w-full h-48 bg-gradient-to-br from-[var(--background)] to-[var(--secondary)]/5 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
        <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm" />
        <span className="text-6xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">🌿</span>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-serif font-semibold text-[var(--foreground)] mb-2">{product.name}</h3>
        <p className="text-sm text-[var(--secondary)] mb-6 line-clamp-2 leading-relaxed font-light">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                  selectedVariant.id === variant.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--secondary)]/20 text-[var(--secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--secondary)]/5'
                }`}
                dir="ltr"
              >
                {variant.weight}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--secondary)]/10 pt-5 mt-4">
            <div className="text-2xl font-serif text-[var(--foreground)]">
              {selectedVariant.price.toFixed(2)} <span className="text-sm font-sans text-[var(--secondary)]">د.إ</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="bg-[var(--foreground)] hover:bg-[var(--accent)] text-[var(--background)] p-3 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
