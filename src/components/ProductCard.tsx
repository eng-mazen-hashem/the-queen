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
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      <div className="w-full h-48 bg-[var(--secondary)]/10 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--secondary)]/5 to-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-5xl drop-shadow-md">🌿</span>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                  selectedVariant.id === variant.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-gray-200 text-gray-600 hover:border-[var(--primary)]/50 hover:bg-gray-50'
                }`}
                dir="ltr"
              >
                {variant.weight}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {selectedVariant.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">د.إ</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-emerald-600/20"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
