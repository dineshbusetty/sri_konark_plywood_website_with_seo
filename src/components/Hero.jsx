import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

function InteriorSceneSVG() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="pendantGlow" cx="50%" cy="18%" r="35%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.12)" />
          <stop offset="60%" stopColor="rgba(201,168,76,0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1F1A" />
          <stop offset="100%" stopColor="#1A1410" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(62,39,35,0.7)" />
          <stop offset="100%" stopColor="rgba(62,39,35,0.5)" />
        </linearGradient>
      </defs>

      {/* Back wall */}
      <rect x="0" y="0" width="1200" height="520" fill="url(#wallGrad)" />

      {/* Wainscoting trim */}
      <line x1="0" y1="310" x2="1200" y2="310" stroke="rgba(201,168,76,0.12)" strokeWidth="2" />
      <line x1="0" y1="320" x2="1200" y2="320" stroke="rgba(201,168,76,0.08)" strokeWidth="1" />

      {/* Floor */}
      <rect x="0" y="520" width="1200" height="280" fill="url(#floorGrad)" />
      {/* Floor plank lines */}
      {[580, 640, 700, 760].map(y => (
        <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="rgba(201,168,76,0.03)" strokeWidth="1" />
      ))}

      {/* Large art frame on back wall */}
      <rect x="420" y="80" width="360" height="200" rx="3"
        stroke="rgba(201,168,76,0.25)" strokeWidth="2"
        fill="rgba(201,168,76,0.03)" />
      <rect x="430" y="90" width="340" height="180" rx="2"
        stroke="rgba(201,168,76,0.1)" strokeWidth="1"
        fill="rgba(62,39,35,0.3)" />
      {/* Abstract art lines inside frame */}
      <path d="M460,200 Q530,140 600,190 Q670,240 740,170" stroke="rgba(201,168,76,0.15)" strokeWidth="1.5" fill="none" />
      <path d="M480,220 Q550,180 620,210 Q690,240 720,200" stroke="rgba(201,168,76,0.08)" strokeWidth="1" fill="none" />

      {/* Pendant light */}
      <line x1="600" y1="0" x2="600" y2="100" stroke="rgba(201,168,76,0.2)" strokeWidth="1.5" />
      <polygon points="580,100 620,100 612,130 588,130" fill="rgba(201,168,76,0.2)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      {/* Light glow */}
      <rect x="0" y="0" width="1200" height="800" fill="url(#pendantGlow)" />

      {/* Sofa - main body */}
      <rect x="160" y="430" width="380" height="75" rx="8" fill="rgba(50,32,26,0.85)" />
      {/* Sofa back cushion */}
      <rect x="160" y="380" width="380" height="55" rx="6" fill="rgba(42,28,22,0.9)" />
      {/* Sofa arm left */}
      <rect x="145" y="385" width="25" height="115" rx="6" fill="rgba(55,36,28,0.8)" />
      {/* Sofa arm right */}
      <rect x="530" y="385" width="25" height="115" rx="6" fill="rgba(55,36,28,0.8)" />
      {/* Sofa cushion lines */}
      <line x1="280" y1="440" x2="280" y2="500" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />
      <line x1="400" y1="440" x2="400" y2="500" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />
      {/* Throw pillows */}
      <rect x="180" y="400" width="50" height="40" rx="8" fill="rgba(201,168,76,0.12)" />
      <rect x="480" y="400" width="50" height="40" rx="8" fill="rgba(120,80,50,0.25)" />

      {/* Coffee table */}
      <rect x="280" y="530" width="240" height="14" rx="2" fill="rgba(80,55,35,0.7)" />
      <rect x="282" y="530" width="236" height="3" rx="1" fill="rgba(201,168,76,0.08)" />
      {/* Table legs */}
      <rect x="300" y="544" width="4" height="30" fill="rgba(70,48,30,0.6)" />
      <rect x="496" y="544" width="4" height="30" fill="rgba(70,48,30,0.6)" />
      {/* Items on table */}
      <rect x="360" y="518" width="60" height="12" rx="2" fill="rgba(201,168,76,0.1)" />
      <circle cx="440" cy="524" r="8" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />

      {/* Side table with lamp - right side */}
      <rect x="880" y="440" width="65" height="75" rx="3" fill="rgba(62,39,35,0.7)" />
      {/* Lamp base */}
      <rect x="900" y="420" width="25" height="20" rx="2" fill="rgba(80,55,35,0.6)" />
      {/* Lamp shade */}
      <polygon points="895,420 930,420 925,385 900,385" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      {/* Lamp glow */}
      <circle cx="912" cy="410" r="60" fill="url(#lampGlow)" />

      {/* Bookshelf - left side */}
      <rect x="30" y="180" width="90" height="340" rx="2" fill="rgba(55,36,28,0.75)" stroke="rgba(201,168,76,0.08)" strokeWidth="1" />
      {/* Shelf dividers */}
      {[250, 320, 390, 450].map(y => (
        <line key={y} x1="32" y1={y} x2="118" y2={y} stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
      ))}
      {/* Books on shelves */}
      <rect x="38" y="192" width="10" height="55" rx="1" fill="rgba(139,69,19,0.4)" />
      <rect x="52" y="195" width="8" height="52" rx="1" fill="rgba(201,168,76,0.12)" />
      <rect x="64" y="190" width="12" height="57" rx="1" fill="rgba(100,60,35,0.4)" />
      <rect x="80" y="198" width="9" height="49" rx="1" fill="rgba(62,39,35,0.5)" />
      <rect x="38" y="258" width="12" height="58" rx="1" fill="rgba(201,168,76,0.08)" />
      <rect x="55" y="255" width="10" height="61" rx="1" fill="rgba(80,55,35,0.4)" />
      <rect x="70" y="260" width="14" height="56" rx="1" fill="rgba(139,69,19,0.3)" />

      {/* Floor plant - right side */}
      <rect x="1060" y="500" width="45" height="50" rx="6" fill="rgba(62,39,35,0.6)" />
      {/* Plant leaves */}
      <ellipse cx="1082" cy="470" rx="30" ry="35" fill="rgba(50,70,40,0.35)" />
      <ellipse cx="1065" cy="460" rx="20" ry="30" fill="rgba(45,65,35,0.3)" />
      <ellipse cx="1098" cy="455" rx="22" ry="28" fill="rgba(55,75,42,0.25)" />
      {/* Plant stems */}
      <line x1="1082" y1="500" x2="1075" y2="445" stroke="rgba(50,70,40,0.3)" strokeWidth="2" />
      <line x1="1082" y1="500" x2="1095" y2="440" stroke="rgba(50,70,40,0.25)" strokeWidth="2" />

      {/* Rug under coffee table */}
      <rect x="230" y="555" width="340" height="120" rx="4" fill="rgba(201,168,76,0.04)" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />
      <rect x="240" y="560" width="320" height="110" rx="3" fill="none" stroke="rgba(201,168,76,0.04)" strokeWidth="1" />

      {/* Second pendant light - subtle */}
      <line x1="900" y1="0" x2="900" y2="80" stroke="rgba(201,168,76,0.1)" strokeWidth="1" />
      <circle cx="900" cy="85" r="8" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
    </svg>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const leftDoorRef = useRef(null)
  const rightDoorRef = useRef(null)
  const frameRef = useRef(null)
  const sceneRef = useRef(null)
  const contentRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Phase 1 (0-35%): Doors slide open, text fades out
      tl.to(leftDoorRef.current, {
        xPercent: -100,
        duration: 0.35,
        ease: 'power2.inOut',
      }, 0)

      tl.to(rightDoorRef.current, {
        xPercent: 100,
        duration: 0.35,
        ease: 'power2.inOut',
      }, 0)

      tl.to(contentRef.current, {
        opacity: 0,
        y: -60,
        duration: 0.25,
        ease: 'power2.in',
      }, 0.05)

      // Phase 2 (35-70%): Scene zooms in, frame fades
      tl.to(sceneRef.current, {
        scale: 2.5,
        duration: 0.35,
        ease: 'power1.in',
      }, 0.35)

      tl.to(frameRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in',
      }, 0.4)

      // Phase 3 (70-100%): Dark overlay, scene continues zoom + fades
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power1.in',
      }, 0.7)

      tl.to(sceneRef.current, {
        scale: 4,
        opacity: 0,
        duration: 0.3,
      }, 0.7)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  function handleExploreClick(e) {
    e.preventDefault()
    const scrollDistance = window.innerHeight * 2.1
    window.scrollTo({ top: scrollDistance, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen overflow-hidden"
      style={{ background: '#0D0A08' }}
    >
      {/* Layer 1: Interior scene (z-1) */}
      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{
          transformOrigin: '50% 50%',
          background: `
            radial-gradient(ellipse 60% 40% at 50% 30%, rgba(201,168,76,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 80% 30% at 50% 95%, rgba(201,168,76,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #2C2420 0%, #1A1512 40%, #15100D 100%)
          `,
          zIndex: 1,
        }}
      >
        <InteriorSceneSVG />
        <div className="ambient-glow absolute inset-0" />

        {/* Floating dust motes */}
        <div className="animate-mote absolute w-1 h-1 rounded-full bg-gold/20" style={{ left: '30%', top: '60%' }} />
        <div className="animate-mote-delayed absolute w-1 h-1 rounded-full bg-gold/15" style={{ left: '65%', top: '50%' }} />
        <div className="animate-mote-slow absolute w-1.5 h-1.5 rounded-full bg-gold/10" style={{ left: '45%', top: '70%' }} />
      </div>

      {/* Layer 2: Glass door panels (z-3) */}
      <div
        ref={leftDoorRef}
        className="glass-door-panel absolute top-0 left-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,26,0.88) 0%, rgba(62,39,35,0.7) 50%, rgba(26,26,26,0.92) 100%)',
          borderRight: '1px solid rgba(201,168,76,0.25)',
          zIndex: 3,
        }}
      >
        {/* Left door handle */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 w-1 h-14 rounded-sm"
          style={{ background: 'linear-gradient(180deg, #A68B3C, #C9A84C, #D4B96A)' }}
        />
        {/* Glass reflection line */}
        <div
          className="absolute top-0 right-[20%] w-px h-full"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.03), transparent)' }}
        />
      </div>

      <div
        ref={rightDoorRef}
        className="glass-door-panel absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(225deg, rgba(26,26,26,0.88) 0%, rgba(62,39,35,0.7) 50%, rgba(26,26,26,0.92) 100%)',
          borderLeft: '1px solid rgba(201,168,76,0.25)',
          zIndex: 3,
        }}
      >
        {/* Right door handle */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-14 rounded-sm"
          style={{ background: 'linear-gradient(180deg, #A68B3C, #C9A84C, #D4B96A)' }}
        />
        <div
          className="absolute top-0 left-[20%] w-px h-full"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.03), transparent)' }}
        />
      </div>

      {/* Layer 3: Door frame (z-4) */}
      <div ref={frameRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        {/* Top frame */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-[#1A1A1A]" />
        {/* Bottom frame */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1A1A1A]" />
        {/* Left frame */}
        <div className="absolute top-0 left-0 bottom-0 w-10 sm:w-16 md:w-20 bg-[#1A1A1A]" />
        {/* Right frame */}
        <div className="absolute top-0 right-0 bottom-0 w-10 sm:w-16 md:w-20 bg-[#1A1A1A]" />
        {/* Inner gold trim */}
        <div
          className="door-frame-trim absolute"
          style={{
            top: '48px',
            bottom: '32px',
            left: 'clamp(40px, 5vw, 80px)',
            right: 'clamp(40px, 5vw, 80px)',
          }}
        />
        {/* Corner accents */}
        <div className="absolute top-12 left-10 sm:left-16 md:left-20 w-3 h-3 border-t border-l border-gold/30" />
        <div className="absolute top-12 right-10 sm:right-16 md:right-20 w-3 h-3 border-t border-r border-gold/30" />
        <div className="absolute bottom-8 left-10 sm:left-16 md:left-20 w-3 h-3 border-b border-l border-gold/30" />
        <div className="absolute bottom-8 right-10 sm:right-16 md:right-20 w-3 h-3 border-b border-r border-gold/30" />
      </div>

      {/* Layer 4: Content overlay (z-5) */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 5 }}
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="premium-badge inline-block border border-gold/30 rounded-full px-5 py-1.5 text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-8">
              Premium Quality
            </span>
          </motion.div>

          {/* Shop name */}
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream tracking-wide mb-2"
          >
            Sri Konark
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-6"
          >
            Plywood & Hardware
          </motion.p>

          {/* Tagline */}
          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-cream/50 text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase mb-4"
          >
            Walk Through Quality
          </motion.p>

          {/* Location */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-gold/50 text-xs tracking-[0.2em] uppercase mb-10"
          >
            <MapPin size={14} />
            <span>Anantapur, Andhra Pradesh</span>
          </motion.div>

          {/* CTA button - outlined premium style */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <a
              href="#living-room"
              onClick={handleExploreClick}
              className="inline-block border border-gold/50 text-gold font-semibold px-12 py-4 rounded-full text-sm tracking-[0.15em] uppercase hover:bg-gold/10 hover:border-gold transition-all duration-300 transform hover:scale-105"
            >
              Enter Our Home
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="absolute bottom-14 left-1/2 -translate-x-1/2"
        style={{ zIndex: 5 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-gold/40 text-[10px] tracking-[0.3em] uppercase">Scroll to Enter</span>
          <ChevronDown size={24} className="text-gold/50 animate-scroll-hint" />
        </div>
      </motion.div>

      {/* Dark transition overlay (z-20) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-charcoal pointer-events-none"
        style={{ opacity: 0, zIndex: 20 }}
      />
    </section>
  )
}
