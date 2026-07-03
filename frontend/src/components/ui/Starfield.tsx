import { useMemo } from 'react';

export default function Starfield({ count = 80 }: { count?: number }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 3}s`,
      maxOpacity: 0.3 + Math.random() * 0.5,
      size: Math.random() > 0.9 ? 3 : Math.random() > 0.7 ? 2 : 1,
    })), [count]);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            '--duration': star.duration,
            '--max-opacity': star.maxOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
