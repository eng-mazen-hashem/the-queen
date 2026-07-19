import Link from 'next/link';
import { Package, ShoppingCart, Tag, Users, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--background)]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--foreground)] text-[var(--background)] flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[var(--accent)]">لوحة الإدارة</h2>
          <p className="text-sm opacity-70 mt-1">عطارة الملكة</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <LayoutDashboard size={20} />
            <span>الرئيسية</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors bg-white/5">
            <Package size={20} />
            <span>المنتجات</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <ShoppingCart size={20} />
            <span>الطلبات</span>
          </Link>
          <Link href="/admin/offers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Tag size={20} />
            <span>العروض</span>
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Users size={20} />
            <span>العملاء ونقاط الولاء</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
