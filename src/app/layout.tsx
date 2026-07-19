import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Queen's Attara - عطارة الملكة",
  description: "Your premium destination for herbs, spices, and organic products.",
};

import CartDrawer from '@/components/CartDrawer';

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
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
