'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/app/actions/admin';
import { KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await adminLogin(password);
      if (res.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(res.error || 'حدث خطأ ما');
      }
    } catch (err) {
      setError('فشل الاتصال بالسيرفر');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between p-6" dir="rtl">
      {/* Top Header Link */}
      <div className="flex justify-start">
        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors">
          <ArrowLeft size={16} />
          <span>العودة للمتجر</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white dark:bg-black/30 p-10 border border-[var(--border)] rounded-none shadow-sm my-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[var(--foreground)] tracking-wide mb-3">لوحة الإدارة</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-6">عطارة الملكة</p>
          <div className="w-8 h-[1px] bg-[var(--border)] mx-auto" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--secondary)] font-medium mb-2">
              كلمة مرور المسؤول
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[var(--border)] bg-transparent rounded-none p-3 pl-10 outline-none focus:border-[var(--accent)] text-[var(--foreground)] text-sm transition-colors text-center font-mono"
                placeholder="••••••••"
              />
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)] opacity-50" size={18} />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-[var(--primary)] bg-[var(--primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] text-[var(--primary-foreground)] hover:text-white py-3 rounded-none text-sm font-medium transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>

      {/* Empty bottom div for spacing */}
      <div className="h-6" />
    </div>
  );
}
