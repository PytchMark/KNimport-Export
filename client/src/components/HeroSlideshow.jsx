import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Fallback images when no hero images are uploaded
const fallbackImages = [
  {
    url: 'https://images.unsplash.com/photo-1591793654079-f2a25f4635ba?w=1200&q=80',
    alt: 'Fresh Caribbean produce'
  },
  {
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&q=80',
    alt: 'Tropical fruits display'
  },
  {
    url: 'https://images.unsplash.com/photo-1568702846914-96b305d2uj9?w=1200&q=80',
    alt: 'Exotic vegetables'
  }
];

export default function HeroSlideshow({ images = [], autoPlayInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);

  // Use provided images or fallback
  const slideImages = images.length > 0 
    ? images.map(img => ({ url: img.url, alt: img.tag || 'Quality produce' }))
    : fallbackImages;

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  }, [slideImages.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  }, [slideImages.length]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || slideImages.length <= 1) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, goToNext, autoPlayInterval, slideImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.6 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  if (slideImages.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full rounded-3xl overflow-hidden group"
      data-testid="hero-slideshow"
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <img
              src={slideImages[currentIndex].url}
              alt={slideImages[currentIndex].alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = fallbackImages[0].url;
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {slideImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110"
            aria-label="Previous slide"
            data-testid="hero-prev-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110"
            aria-label="Next slide"
            data-testid="hero-next-btn"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicator & Play/Pause */}
      {slideImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            data-testid="hero-playpause-btn"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {slideImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`hero-dot-${index}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {slideImages.length > 1 && isPlaying && (
        <motion.div
          key={`progress-${currentIndex}`}
          className="absolute bottom-0 left-0 h-1 bg-primary/80"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
        />
      )}

      {/* Image Counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-mono">
        {currentIndex + 1} / {slideImages.length}
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 blur-3xl -z-10 opacity-50" />
    </div>
  );
}
