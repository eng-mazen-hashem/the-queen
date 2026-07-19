'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, banners.length]);

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-neutral-900 overflow-hidden flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
          alt="Default Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
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
      </div>
    );
  }

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentBanner = banners[currentIndex];

  const bannerContent = (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      <img
        src={currentBanner.imageUrl}
        alt={currentBanner.title || 'Banner'}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      
      {/* Banner Text Overlay */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
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
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-neutral-950 overflow-hidden group">
      {/* Slides Container */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          {currentBanner.link ? (
            <Link href={currentBanner.link}>{bannerContent}</Link>
          ) : (
            bannerContent
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'bg-[var(--accent)] w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
