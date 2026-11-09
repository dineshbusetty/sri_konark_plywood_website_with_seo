import { useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react'
const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'RTC Bus Stand, Srinivas Nagar, Anantapur, AP 515001',
    subtext: 'Opp. Chandra Super Speciality Hospital',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 96525 15211',
    subtext: 'Call for bulk orders & quotes',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon-Sat: 9:00 AM - 8:00 PM',
    subtext: 'Sunday: 10:00 AM - 2:00 PM',
  },
]

function SpotlightCard({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const spotlight = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(226,176,74,0.06), transparent 80%)`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-white/[0.08] bg-white/[0.05] p-6 shadow-lg shadow-black/10 backdrop-blur-xl overflow-hidden transition-colors duration-300 hover:border-[#e2b04a]/20 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function GoogleMap() {
  return (
    <div className="relative w-full h-full min-h-[240px] rounded-xl overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123502.22048279564!2d77.4483373972656!3d14.68744340000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb14ad0c2290791%3A0xa2b4dcc81e68b9f8!2sOzone%20India%20%7C%20Sri%20Konark%20Plywood%20%7C%20Anantapur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1794208781114!5m2!1sen!2sin"
        className="w-full h-full min-h-[240px] border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Sri Konark Plywood & Hardware location"
      />
    </div>
  )
}

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="relative overflow-hidden py-20 md:py-28 px-6"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2118 50%, #1a1612 100%)',
        }}
      >
        {/* Corner accent lines */}
        <motion.div
          className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-[#e2b04a]/15"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-[#e2b04a]/15"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Ambient glow blobs */}
        <div
          className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #e2b04a, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-20 h-[400px] w-[400px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #e2b04a, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Desktop: split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: heading (sticky on desktop) */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-gradient-to-r from-[#e2b04a] to-transparent" />
                  <span className="text-[#e2b04a] font-medium tracking-[0.2em] uppercase text-sm">
                    Get In Touch
                  </span>
                  <div className="h-px w-8 bg-gradient-to-l from-[#e2b04a] to-transparent" />
                </div>

                <h2 className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] leading-tight mb-5">
                  <span className="text-gradient-gold">Visit</span>
                  <br />
                  <span className="text-[#f0ece4]">Sri Konark</span>
                  <br />
                  <span className="text-[#f0ece4]/70">Plywood & Hardware</span>
                </h2>

                <motion.div
                  className="h-[2px] w-16 bg-gradient-to-r from-[#e2b04a] to-transparent mb-6"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />

                <p className="text-white/45 text-base leading-relaxed max-w-sm">
                  Walk in for expert advice, competitive prices, and the widest selection
                  of plywood and hardware in Anantapur.
                </p>

                {/* CTA buttons on desktop */}
                <div className="hidden lg:flex flex-col gap-3 mt-10">
                  <motion.a
                    href="https://wa.me/+919652515211"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-shimmer inline-flex items-center justify-center gap-2 bg-[#e2b04a] text-[#141414] font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-[#e2b04a]/15 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <MessageCircle size={20} />
                    WhatsApp Us
                  </motion.a>
                  <motion.a
                    href="tel:+919652515211"
                    className="inline-flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.12] text-[#f0ece4] font-medium px-7 py-3.5 rounded-xl backdrop-blur-sm hover:bg-white/[0.1] hover:border-[#e2b04a]/20 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Phone size={20} />
                    Get Free Consultation
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Right: cards, map, and mobile CTAs */}
            <div className="lg:col-span-3 space-y-4">
              {contactInfo.map((item, i) => {
                const Icon = item.icon
                return (
                  <SpotlightCard key={item.label} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 rounded-full border border-[#e2b04a]/25 bg-[#e2b04a]/[0.06] flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 + i * 0.1 }}
                      >
                        <Icon size={20} className="text-[#e2b04a]" />
                      </motion.div>
                      <div>
                        <p className="text-xs text-[#e2b04a]/50 uppercase tracking-[0.15em] mb-1 font-medium">
                          {item.label}
                        </p>
                        <p className="text-[#f0ece4] font-medium leading-snug">
                          {item.value}
                        </p>
                        {item.subtext && (
                          <p className="text-white/35 text-sm mt-1">{item.subtext}</p>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                )
              })}

              <SpotlightCard className="min-h-[280px]" delay={0.3}>
                <GoogleMap />
              </SpotlightCard>

              {/* CTA buttons on mobile */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-4 lg:hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.a
                  href="https://wa.me/+919652515211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-shimmer inline-flex items-center justify-center gap-2 bg-[#e2b04a] text-[#141414] font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-[#e2b04a]/15 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={20} />
                  WhatsApp Us
                </motion.a>
                <motion.a
                  href="tel:+919652515211"
                  className="inline-flex items-center justify-center gap-2 bg-white/[0.06] border border-white/[0.12] text-[#f0ece4] font-medium px-7 py-3.5 rounded-xl backdrop-blur-sm hover:bg-white/[0.1] hover:border-[#e2b04a]/20 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone size={20} />
                  Get Free Consultation
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
