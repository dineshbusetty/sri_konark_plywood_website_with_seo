import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook that initialises Lenis smooth scrolling and integrates it with
 * GSAP ScrollTrigger so that pinned / scrub animations stay in sync with the
 * inertia-based scroll position.
 *
 * @returns {React.MutableRefObject<Lenis | null>} ref to the Lenis instance
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker as the single RAF source so that Lenis, GSAP tweens
    // and ScrollTrigger all share one animation frame.
    const onTick = (time) => {
      lenis.raf(time * 1000); // GSAP ticker gives seconds, Lenis expects ms
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // disable lag compensation for smooth feel

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
