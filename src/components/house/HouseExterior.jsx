import { useEffect, useRef, lazy, Suspense } from 'react';
import { onFrame } from '../../lib/scroll';
import { pinProgress, range, easeOutCubic, lerp } from '../../lib/math';

const ExteriorCanvas = lazy(() => import('../house3d/ExteriorCanvas'));

function SVGFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A] via-[#1B2838] to-[#3A1F10]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function HouseExterior() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const vignetteRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    return onFrame(() => {
      if (!sectionRef.current) return;
      const { p, rect, vh } = pinProgress(sectionRef.current);
      if (rect.bottom < 0 || rect.top > vh * 2) return;

      progressRef.current = p;

      const textOpacity = 1 - range(p, 0.0, 0.25);
      const letterSpacing = lerp(0.3, 0, range(p, 0, 0.1));
      if (contentRef.current) {
        contentRef.current.style.opacity = String(textOpacity);
        contentRef.current.style.transform = `translate3d(0, ${-p * 100}px, 0)`;
        contentRef.current.style.letterSpacing = `${letterSpacing}em`;
      }

      const vignetteProgress = range(p, 0.7, 1.0);
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(easeOutCubic(vignetteProgress));
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{ height: '300svh' }}
      className="relative bg-[#0D0A08]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Three.js 3D Villa Scene */}
        <Suspense fallback={<SVGFallback />}>
          <ExteriorCanvas progress={progressRef} />
        </Suspense>

        {/* Text Content Overlay */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
          style={{ zIndex: 10, pointerEvents: 'none' }}
        >
          <div className="px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-6">
            <span className="text-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">
              Premium Quality
            </span>
          </div>

          <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-cream text-center leading-[0.9] mb-3">
            Sri Konark
          </h2>
          <p className="font-heading text-xl sm:text-2xl lg:text-3xl text-gold/80 text-center tracking-[0.1em] mb-8">
            Plywood & Hardware
          </p>

          <p className="text-cream/50 text-sm sm:text-base text-center max-w-md mb-10 tracking-wide">
            Walk Through Quality — Every Room, Every Surface, Every Detail
          </p>

          <p className="text-cream/30 text-xs uppercase tracking-[0.4em] animate-bounce">
            Scroll to Enter ↓
          </p>
        </div>

        {/* Dark vignette overlay for transition */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 bg-[#1A1A1A]"
          style={{ zIndex: 20, opacity: 0, pointerEvents: 'none' }}
        />
      </div>
    </section>
  );
}
