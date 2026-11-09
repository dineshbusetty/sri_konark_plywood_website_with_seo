import { useRef, useEffect, useState } from 'react'
import { onFrame } from '../../lib/scroll'
import { range, clamp } from '../../lib/math'

export default function JourneyOverlay({ progressRef, currentActRef, getActProgress }) {
  const overlayRef = useRef(null)
  const [act, setAct] = useState('forest')

  useEffect(() => {
    return onFrame(() => {
      const current = currentActRef.current
      setAct(prev => prev !== current ? current : prev)
    })
  }, [currentActRef])

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-10 pointer-events-none"
      role="region"
      aria-label="Sri Konark Plywood journey"
      aria-live="polite"
    >
      {/* Screen reader content */}
      <div className="sr-only">
        {act === 'forest' && (
          <p>Sri Konark Plywood and Hardware — From Forest to Home. Scroll to explore our journey.</p>
        )}
        {act === 'workshop' && (
          <p>The Workshop — Where raw materials become quality products. 25+ years of craftsmanship.</p>
        )}
        {act === 'showroom' && (
          <p>Our Showroom — Browse plywood, laminates, hardware, and adhesives.</p>
        )}
        {act === 'home' && (
          <p>Your Home — See our products in beautifully designed rooms.</p>
        )}
        {act === 'storefront' && (
          <p>Visit Us — Sri Konark Plywood and Hardware, Anantapur, Andhra Pradesh.</p>
        )}
      </div>

      {/* Skip link */}
      <a
        href="#contact"
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-walnut text-cream rounded
                   opacity-0 focus:opacity-100 pointer-events-auto transition-opacity"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Skip to Contact
      </a>

      {/* Scroll hint at very start */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700"
        style={{ opacity: act === 'forest' ? 1 : 0 }}
      >
        <span
          className="text-cream/60 text-sm tracking-widest uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Scroll to explore
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-cream/50 rounded-full animate-scroll-hint" />
        </div>
      </div>
    </div>
  )
}
