'use client';
import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
}

export default function AnimatedCounter({ value, duration = 1.2, decimals = 0 }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const end = value;
    const start = 0;
    const startTime = performance.now();
    const totalMs = duration * 1000;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalMs, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();

  return <span>{formatted}</span>;
}
