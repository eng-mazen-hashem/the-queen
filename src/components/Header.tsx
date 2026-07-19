'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { items, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-[var(--border)] z-40 transition-colors" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Right side: Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--accent)] flex-shrink-0">
            <img src="/logo.jpg" alt="عطارة الملكة" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-[var(--primary)] dark:text-[var(--accent)] font-semibold tracking-wide leading-none mb-1">
              عطارة الملكة
            </h1>
            <p className="text-[9px] text-[var(--secondary)] font-light tracking-widest leading-none">
              أعشاب طبيعية .. جودة الملكة
            </p>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex gap-8 text-sm font-light text-[var(--secondary)]">
          <Link href="/" className="hover:text-[var(--primary)] dark:hover:text-[var(--accent)] transition-colors font-medium">الرئيسية</Link>
          <Link href="/admin/products" className="hover:text-[var(--primary)] dark:hover:text-[var(--accent)] transition-colors">لوحة التحكم</Link>
        </nav>

        {/* Left side: Cart Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-transparent hover:border-[var(--border)] transition-all rounded-full cursor-pointer group"
            title="سلة المشتريات"
          >
            <ShoppingBag size={20} className="text-[var(--primary)] dark:text-[var(--accent)]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans shadow-md border border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
