'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Banner = {
  id: string;
  imageUrl: string;
  link: string | null;
  title: string | null;
};

type HeroCarouselProps = {
  banners: Banner[];
};

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  /** Respect OS-level "Reduce Motion" setting — disables slide transitions */
  const shouldReduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-advance; paused when reduced motion is requested
  useEffect(() => {
    if (banners.length <= 1 || shouldReduceMotion) return;
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, banners.length, shouldReduceMotion, handleNext]);

  // Default banner when no banners exist in DB
  if (!banners || banners.length === 0) {
    return (
      <section
        aria-label="عرض ترويجي"
        className="relative w-full h-[60vh] md:h-[70vh] bg-neutral-900 overflow-hidden flex items-center justify-center"
      >
        <img
          src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
          alt="أعشاب وبهارات طبيعية من عطارة الملكة"
          loading="eager"
          width={1600}
          height={700}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" aria-hidden="true" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-3 block">
            أصالة وجودة
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            عطارة الملكة
          </h2>
          <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed max-w-xl mx-auto">
            نقدم لكم أجود أنواع الأعشاب الطبيعية والبهارات الشرقية والزيوت المعصورة على البارد لنمط حياة صحي ونقي.
          </p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  // Slide variants — disabled when prefers-reduced-motion is active
  const slideVariants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? 1000 : -1000, opacity: 0 }),
      };

  const bannerContent = (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      {/* Hero image — eager loaded (above the fold) */}
      <img
        src={currentBanner.imageUrl}
        alt={currentBanner.title ? `${currentBanner.title} — عطارة الملكة` : 'بنر عطارة الملكة'}
        loading="eager"
        width={1600}
        height={700}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" aria-hidden="true" />

      {/* Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-3 block">
              عروض حصرية
            </span>
            {currentBanner.title && (
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                {currentBanner.title}
              </h2>
            )}
            <p className="text-xs md:text-sm text-neutral-300 font-light max-w-lg mx-auto tracking-wide">
              اكتشف تشكيلتنا الفاخرة اليوم واستفد من العروض الخاصة المتاحة لفترة محدودة.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <section
      aria-label="عرض ترويجي — الشرائح"
      aria-roledescription="carousel"
      className="relative w-full h-[60vh] md:h-[70vh] bg-neutral-950 overflow-hidden group"
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            shouldReduceMotion
              ? { duration: 0.2 }
              : { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.4 } }
          }
          className="absolute inset-0 w-full h-full"
          aria-label={`الشريحة ${currentIndex + 1} من ${banners.length}`}
        >
          {currentBanner.link ? (
            <Link href={currentBanner.link} aria-label={currentBanner.title || 'عرض البنر'}>
              {bannerContent}
            </Link>
          ) : (
            bannerContent
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows — min 44×44px touch targets */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="الشريحة السابقة"
            className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <button
            onClick={handleNext}
            aria-label="الشريحة التالية"
            className="absolute left-4 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20"
          role="tablist"
          aria-label="تنقل الشرائح"
        >
          {banners.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`الشريحة ${idx + 1}`}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                idx === currentIndex ? 'bg-[var(--accent)] w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
