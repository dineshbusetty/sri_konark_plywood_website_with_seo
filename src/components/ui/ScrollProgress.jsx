import { useEffect, useRef } from 'react';
import { onFrame } from '../../lib/scroll';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    return onFrame(() => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    });
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 z-[9998] h-[3px] w-full origin-left"
      style={{
        transform: 'scaleX(0)',
        background:
          'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold), var(--color-gold-light))',
      }}
    />
  );
}
