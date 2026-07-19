'use client';

import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPrice, formatTotal } from '@/lib/formatters';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotal } = useCartStore();
  const shouldReduceMotion = useReducedMotion();
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 }}
            transition={shouldReduceMotion ? { duration: 0.15 } : { type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--background)] shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="سلة المشتريات"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--secondary)]/20">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <ShoppingBag size={24} aria-hidden="true" />
                <h2 className="text-xl font-bold">سلة المشتريات</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق السلة"
                className="p-2 min-w-[44px] min-h-[44px] text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded-full"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--foreground)] opacity-70">
                  <ShoppingBag size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">سلتك فارغة حالياً</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-[var(--background)] p-3 rounded-lg border border-[var(--secondary)]/10 shadow-sm">
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--foreground)]">{item.name}</h3>
                      <p className="text-sm text-[var(--secondary)]">{item.weight}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--secondary)]/20 rounded-md p-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            aria-label={`تقليل كمية ${item.name}`}
                            className="p-1 min-w-[36px] min-h-[36px] hover:text-[var(--primary)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded"
                          >
                            <Minus size={16} aria-hidden="true" />
                          </button>
                          <span className="w-6 text-center font-medium" aria-label={`الكمية: ${item.quantity}`}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`زيادة كمية ${item.name}`}
                            className="p-1 min-w-[36px] min-h-[36px] hover:text-[var(--primary)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded"
                          >
                            <Plus size={16} aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`حذف ${item.name} من السلة`}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 min-w-[36px] min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-red-400 rounded"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-[var(--primary)] flex flex-col justify-end">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[var(--secondary)]/20 bg-[var(--background)]">
                <div className="flex justify-between items-center mb-4 text-lg font-bold text-[var(--foreground)]">
                  <span>الإجمالي:</span>
                  <span className="text-[var(--primary)]">{formatTotal(getTotal())}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/checkout';
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg"
                >
                  <span>إتمام الطلب</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
