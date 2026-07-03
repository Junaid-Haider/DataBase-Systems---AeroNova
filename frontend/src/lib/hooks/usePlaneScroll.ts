import { useEffect, useRef } from 'react';

export function usePlaneScroll() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = heroRef.current;
      if (!hero) return;

      const heroHeight = hero.offsetHeight;
      // Only animate while hero is in view
      if (scrollY > heroHeight) return;

      // Progress from 0 (top) to 1 (hero bottom)
      const progress = scrollY / heroHeight;

      // Add inside handleScroll() — after the bg transform:
      const starsEl = document.getElementById('hero-stars-layer');
      const atmosphereEl = document.getElementById('hero-atmosphere-layer');

      if (starsEl) {
        starsEl.style.transform = `translateY(${scrollY * 0.15}px)`;  // stars move slower (parallax)
      }
      if (atmosphereEl) {
        atmosphereEl.style.opacity = String(Math.max(0, 1 - progress * 2));  // glow fades out fast
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { heroRef };
}
