import { useRef, useCallback } from 'react';

export function useCardTilt(intensity = 8) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `
      perspective(1000px)
      rotateX(${-y * intensity}deg)
      rotateY(${x * intensity}deg)
      translateZ(8px)
    `;
    card.style.transition = 'transform 0.1s ease';
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.5s ease';
  }, []);

  return { cardRef, handleMouseMove, handleMouseLeave };
}
