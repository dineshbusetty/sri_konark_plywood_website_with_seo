import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { scrollToHash, onFrame } from '../lib/scroll'
import Logo from './ui/Logo'

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#gallery' },
  { label: 'Rooms', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const sectionIds = ['top', 'about', 'gallery', 'contact']

function MagneticLink({ children, href, onClick, className, linkRef }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })
  const ref = useRef(null)

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.15)
    y.set((e.clientY - cy) * 0.15)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={(el) => {
        ref.current = el
        if (linkRef) linkRef(el)
      }}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.a>
  )
}

const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const mobileLinkVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const navRef = useRef(null)
  const lastScrollY = useRef(0)
  const isVisible = useRef(true)
  const isScrolled = useRef(false)
  const linkRefs = useRef({})

  useEffect(() => {
    const exteriorHeight = window.innerHeight * 3

    return onFrame(() => {
      const nav = navRef.current
      if (!nav) return

      const y = window.scrollY
      const delta = y - lastScrollY.current
      lastScrollY.current = y

      const pastExterior = y > exteriorHeight
      const nearBottom = y + window.innerHeight >= document.body.scrollHeight - window.innerHeight

      const scrolledDown = isScrolled.current
      const newScrolled = y > 50
      if (newScrolled !== scrolledDown) {
        isScrolled.current = newScrolled
        if (newScrolled) {
          nav.classList.add('nav-scrolled')
          nav.classList.remove('nav-transparent')
        } else {
          nav.classList.remove('nav-scrolled')
          nav.classList.add('nav-transparent')
        }
      }

      let shouldShow
      if (!pastExterior || nearBottom) {
        shouldShow = true
      } else if (delta < -5) {
        shouldShow = true
      } else if (delta > 10) {
        shouldShow = false
      } else {
        shouldShow = isVisible.current
      }

      if (shouldShow !== isVisible.current) {
        isVisible.current = shouldShow
        nav.style.transform = shouldShow ? 'translateY(0)' : 'translateY(-100%)'
      }

      let activeId = sectionIds[0]
      for (const id of sectionIds) {
        const el = id === 'top' ? null : document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.4) activeId = id
      }

      for (const link of navLinks) {
        const linkEl = linkRefs.current[link.href]
        if (!linkEl) continue
        const linkTarget = link.href.replace('#', '')
        const isActive = linkTarget === activeId ||
          (link.href === '#top' && activeId === 'top')
        if (isActive) {
          linkEl.classList.add('nav-link-active')
        } else {
          linkEl.classList.remove('nav-link-active')
        }
      }
    })
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const handleMouseEnter = useCallback(() => {
    if (!isVisible.current && navRef.current) {
      isVisible.current = true
      navRef.current.style.transform = 'translateY(0)'
    }
  }, [])

  function handleNavClick(e, href) {
    e.preventDefault()
    setIsMobileOpen(false)
    scrollToHash(href)
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-5 z-[51]"
        onMouseEnter={handleMouseEnter}
      />

      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-0 left-0 w-full z-50 nav-transparent"
        style={{
          transition: 'transform 0.3s ease, background-color 0.5s, backdrop-filter 0.5s, box-shadow 0.5s, border-color 0.5s',
          transform: 'translateY(0)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            className="group transition-all duration-300"
          >
            <Logo size="md" variant="light" withText />
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <MagneticLink
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  linkRef={(el) => { linkRefs.current[link.href] = el }}
                  className="nav-link relative px-4 py-2 text-cream/70 text-sm tracking-[0.15em] uppercase transition-colors duration-300 rounded-full hover:text-[#e2b04a]"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-full bg-[#e2b04a]/0 hover:bg-[#e2b04a]/[0.08] transition-colors duration-300" />
                  <span className="nav-active-dot absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A84C] opacity-0 transition-opacity duration-300" />
                </MagneticLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="md:hidden text-cream hover:text-[#C9A84C] transition-colors duration-300"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-[#141414]/95 backdrop-blur-xl"
              onClick={() => setIsMobileOpen(false)}
            />

            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#e2b04a]/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#e2b04a]/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#e2b04a]/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#e2b04a]/30" />

            <div className="relative flex flex-col items-center justify-center h-full">
              <motion.button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 text-cream/60 hover:text-[#e2b04a] transition-colors"
                aria-label="Close menu"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X size={32} />
              </motion.button>

              <motion.div
                className="flex flex-col items-center mb-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Logo size="sm" variant="light" withText />
                <span className="block w-8 h-px bg-[#C9A84C]/30 mt-3" />
              </motion.div>

              <motion.ul
                className="flex flex-col items-center gap-2"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {navLinks.map((link) => (
                  <motion.li key={link.label} variants={mobileLinkVariants}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="block py-3 px-8 font-heading text-3xl text-cream/80 tracking-wide hover:text-[#e2b04a] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="mt-12 w-12 h-px bg-gradient-to-r from-transparent via-[#e2b04a]/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
