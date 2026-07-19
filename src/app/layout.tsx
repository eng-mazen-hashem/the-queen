import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import CartDrawer from '@/components/CartDrawer';

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT (Flash of Invisible Text)
});

export const metadata: Metadata = {
  title: "عطارة الملكة | أعشاب وبهارات طبيعية",
  description: "وجهتك الأولى لأجود أنواع الأعشاب الطبية والبهارات الأصيلة والزيوت الطبيعية في مصر. جودة الملكة بين يديك.",
  keywords: ["أعشاب طبية", "بهارات", "زيوت طبيعية", "عطارة", "عطارة الملكة", "متجر أعشاب مصر"],
  openGraph: {
    title: "عطارة الملكة | أعشاب وبهارات طبيعية",
    description: "أجود أنواع الأعشاب الطبية والبهارات والزيوت الطبيعية",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${jost.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip to main content - critical for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:bg-[var(--primary)] focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:rounded-none"
        >
          تخطى إلى المحتوى الرئيسي
        </a>
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <CartDrawer />
      </body>
    </html>
  );
}
