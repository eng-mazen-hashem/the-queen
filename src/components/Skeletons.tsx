/**
 * ProductCardSkeleton — Accessible loading placeholder for ProductCard.
 *
 * Uses CSS `animate-pulse` to provide a skeleton screen while products load.
 * Respects `prefers-reduced-motion` automatically via Tailwind's media query variant.
 *
 * @param {number} count - Number of skeleton cards to render (default: 8)
 */
export function ProductCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-black/30 rounded-none p-6 border border-[var(--border)] flex flex-col"
          aria-hidden="true" // Hidden from screen readers — real content loads next
        >
          {/* Image placeholder */}
          <div className="w-full h-56 bg-neutral-100 dark:bg-neutral-800 -mx-6 -mt-6 mb-6 motion-safe:animate-pulse" />

          {/* Title placeholder */}
          <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded-sm w-3/4 mb-3 motion-safe:animate-pulse" />

          {/* Description placeholders */}
          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-sm w-full mb-2 motion-safe:animate-pulse" />
          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-sm w-5/6 mb-8 motion-safe:animate-pulse" />

          {/* Weight variant buttons */}
          <div className="flex gap-2 mb-6">
            <div className="h-7 w-14 bg-neutral-100 dark:bg-neutral-800 rounded-sm motion-safe:animate-pulse" />
            <div className="h-7 w-14 bg-neutral-100 dark:bg-neutral-800 rounded-sm motion-safe:animate-pulse" />
          </div>

          {/* Price + button row */}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-auto">
            <div className="h-6 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-sm motion-safe:animate-pulse" />
            <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-full motion-safe:animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * CategoryCardSkeleton — Loading placeholder for category grid items.
 */
export function CategoryCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 motion-safe:animate-pulse" />
          <div className="h-4 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-sm motion-safe:animate-pulse" />
        </div>
      ))}
    </>
  );
}
