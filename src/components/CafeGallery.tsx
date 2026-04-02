import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CafeGalleryProps {
  images: string[];
  cafeName: string;
  autoSlideInterval?: number;
}

const CafeGallery = ({ images, cafeName, autoSlideInterval = 5000 }: CafeGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const total = images.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-slide
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const timer = setInterval(next, autoSlideInterval);
    return () => clearInterval(timer);
  }, [next, isHovered, autoSlideInterval, total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  if (total === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div
        className="relative h-64 md:h-80 lg:h-[28rem] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${cafeName} - ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              i === current
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-foreground/5" />

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 shadow-lg"
              aria-label="Previous image"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 shadow-lg"
              aria-label="Next image"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <div className="absolute top-4 right-4 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 mt-3 px-4 overflow-x-auto scrollbar-hide pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === current
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={src}
                alt={`${cafeName} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CafeGallery;
