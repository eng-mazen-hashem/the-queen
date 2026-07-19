'use client';

import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotal } = useCartStore();
  
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
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer (RTL support: slides from the right side) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[var(--background)] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--secondary)]/20">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <ShoppingBag size={24} />
                <h2 className="text-xl font-bold">سلة المشتريات</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                <X size={24} />
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
                            className="p-1 hover:text-[var(--primary)] transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[var(--primary)] transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-[var(--primary)] flex flex-col justify-end">
                      {(item.price * item.quantity).toFixed(2)} د.إ
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
                  <span className="text-[var(--primary)]">{getTotal().toFixed(2)} د.إ</span>
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
