'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Plus, Sprout } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatNumber, CURRENCY_SYMBOL } from '@/lib/formatters';


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
    imageUrl?: string | null;
    variants: Variant[];
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const { addItem, setIsOpen } = useCartStore();
  /** Respect user's OS-level "Reduce Motion" accessibility setting */
  const shouldReduceMotion = useReducedMotion();

  if (!selectedVariant) return null;

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
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-black/30 rounded-none p-6 border border-[var(--border)] hover:shadow-lg transition-shadow duration-300 flex flex-col group cursor-pointer"
    >
      {/* Product Image */}
      <div className="w-full h-56 bg-neutral-50 dark:bg-neutral-900 border-b border-[var(--border)] -mx-6 -mt-6 mb-6 flex items-center justify-center overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            width={400}
            height={224}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Sprout
            size={48}
            aria-hidden="true"
            className="text-[var(--accent)] opacity-40 group-hover:scale-110 transition-transform duration-500 stroke-[1.2]"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col pt-2">
        <h3 className="text-lg md:text-xl font-serif text-[var(--foreground)] mb-2 font-medium">{product.name}</h3>
        <p className="text-xs text-[var(--secondary)] mb-6 line-clamp-2 leading-relaxed font-light tracking-wide">{product.description}</p>

        <div className="mt-auto">
          {/* Weight variant selector */}
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="اختر الوزن">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariant(variant);
                }}
                aria-pressed={selectedVariant.id === variant.id}
                className={`px-3 py-1.5 text-xs font-light tracking-wider transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 cursor-pointer ${
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

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-4">
            <div className="text-xl font-serif font-medium text-[var(--foreground)]" aria-label={`السعر: ${formatNumber(selectedVariant.price)} ${CURRENCY_SYMBOL}`}>
              {formatNumber(selectedVariant.price)} <span className="text-xs font-sans font-light text-[var(--secondary)]">{CURRENCY_SYMBOL}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              aria-label={`أضف ${product.name} (${selectedVariant.weight}) إلى السلة`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full transition-colors duration-200 active:scale-95 shadow-md shadow-emerald-600/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
